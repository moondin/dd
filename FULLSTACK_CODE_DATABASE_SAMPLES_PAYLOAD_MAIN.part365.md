---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 365
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 365 of 695)

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
Location: payload-main/packages/ui/src/elements/DeleteMany/index.tsx
Signals: React, Next.js

```typescript
'use client'
import type { ClientCollectionConfig, ViewTypes, Where } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { useRouter, useSearchParams } from 'next/navigation.js'
import { mergeListSearchAndWhere } from 'payload/shared'
import * as qs from 'qs-esm'
import React from 'react'
import { toast } from 'sonner'

import { CheckboxInput } from '../../fields/Checkbox/Input.js'
import { useAuth } from '../../providers/Auth/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useRouteCache } from '../../providers/RouteCache/index.js'
import { SelectAllStatus, useSelection } from '../../providers/Selection/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { requests } from '../../utilities/api.js'
import { parseSearchParams } from '../../utilities/parseSearchParams.js'
import { ConfirmationModal } from '../ConfirmationModal/index.js'
import { ListSelectionButton } from '../ListSelection/index.js'
import { Translation } from '../Translation/index.js'
import './index.scss'

export type Props = {
  collection: ClientCollectionConfig
  /**
   * When multiple DeleteMany components are rendered on the page, this will differentiate them.
   */
  modalPrefix?: string
  /**
   * When multiple PublishMany components are rendered on the page, this will differentiate them.
   */
  title?: string
  viewType?: ViewTypes
}

export const DeleteMany: React.FC<Props> = (props) => {
  const { viewType } = props
  const { collection: { slug, trash } = {}, modalPrefix } = props

  const { permissions } = useAuth()
  const { count, selectAll, selectedIDs, toggleAll } = useSelection()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearRouteCache } = useRouteCache()

  const collectionPermissions = permissions?.collections?.[slug]
  const hasDeletePermission = collectionPermissions?.delete

  const selectingAll = selectAll === SelectAllStatus.AllAvailable

  const ids = selectingAll ? [] : selectedIDs

  if (selectAll === SelectAllStatus.None || !hasDeletePermission) {
    return null
  }

  const baseWhere = parseSearchParams(searchParams)?.where as Where

  const finalWhere =
    viewType === 'trash'
      ? {
          and: [
            ...(Array.isArray(baseWhere?.and) ? baseWhere.and : baseWhere ? [baseWhere] : []),
            { deletedAt: { exists: true } },
          ],
        }
      : baseWhere

  return (
    <React.Fragment>
      <DeleteMany_v4
        afterDelete={() => {
          toggleAll()

          router.replace(
            qs.stringify(
              {
                ...parseSearchParams(searchParams),
                page: selectAll ? '1' : undefined,
              },
              { addQueryPrefix: true },
            ),
          )

          clearRouteCache()
        }}
        modalPrefix={modalPrefix}
        search={parseSearchParams(searchParams)?.search as string}
        selections={{
          [slug]: {
            all: selectAll === SelectAllStatus.AllAvailable,
            ids,
            totalCount: selectingAll ? count : ids.length,
          },
        }}
        trash={trash}
        viewType={viewType}
        where={finalWhere}
      />
    </React.Fragment>
  )
}

type AfterDeleteResult = {
  [relationTo: string]: {
    deletedCount: number
    errors: unknown[]
    ids: (number | string)[]
    totalCount: number
  }
}
type DeleteMany_v4Props = {
  /**
   * A callback function to be called after the delete request is completed.
   */
  afterDelete?: (result: AfterDeleteResult) => void
  /**
   * When multiple DeleteMany components are rendered on the page, this will differentiate them.
   */
  modalPrefix?: string
  /**
   * Optionally pass a search string to filter the documents to be deleted.
   *
   * This is intentionally passed as a prop so modals could pass in their own
   * search string that may not be stored in the URL.
   */
  search?: string
  /**
   * An object containing the relationTo as the key and an object with the following properties:
   * - all: boolean
   * - totalCount: number
   * - ids: (string | number)[]
   */
  selections: {
    [relationTo: string]: {
      all?: boolean
      ids?: (number | string)[]
      totalCount?: number
    }
  }
  trash?: boolean
  viewType?: ViewTypes
  /**
   * Optionally pass a where clause to filter the documents to be deleted.
   * This will be ignored if multiple relations are selected.
   *
   * This is intentionally passed as a prop so modals could pass in their own
   * where clause that may not be stored in the URL.
   */
  where?: Where
}

/**
 * Handles polymorphic document delete operations.
 *
 * If you are deleting monomorphic documents, shape your `selections` to match the polymorphic structure.
 */
export function DeleteMany_v4({
  afterDelete,
  modalPrefix,
  search,
  selections,
  trash,
  viewType,
  where,
}: DeleteMany_v4Props) {
  const { t } = useTranslation()

  const {
    config: {
      collections,
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const { code: locale } = useLocale()
  const { i18n } = useTranslation()
  const { openModal } = useModal()

  const [deletePermanently, setDeletePermanently] = React.useState(false)
  const confirmManyDeleteDrawerSlug = `${modalPrefix ? `${modalPrefix}-` : ''}confirm-delete-many-docs`

  const handleDelete = React.useCallback(async () => {
    const deletingOneCollection = Object.keys(selections).length === 1
    const result: AfterDeleteResult = {}

    for (const [relationTo, { all, ids = [] }] of Object.entries(selections)) {
      const collectionConfig = collections.find(({ slug }) => slug === relationTo)

      if (collectionConfig) {
        let whereConstraint: Where

        if (all) {
          // selecting all documents with optional where filter
          if (deletingOneCollection && where) {
            whereConstraint =
              viewType === 'trash'
                ? {
                    and: [
                      ...(Array.isArray(where.and) ? where.and : [where]),
                      { deletedAt: { exists: true } },
                    ],
                  }
                : where
          } else {
            whereConstraint =
              viewType === 'trash'
                ? {
                    and: [{ id: { not_equals: '' } }, { deletedAt: { exists: true } }],
                  }
                : {
                    id: { not_equals: '' },
                  }
          }
        } else {
          // selecting specific documents
          whereConstraint = {
            and: [
              { id: { in: ids } },
              ...(viewType === 'trash' ? [{ deletedAt: { exists: true } }] : []),
            ],
          }
        }

        const url = `${serverURL}${api}/${relationTo}${qs.stringify(
          {
            limit: 0,
            locale,
            select: {},
            where: mergeListSearchAndWhere({
              collectionConfig,
              search,
              where: whereConstraint,
            }),
            ...(viewType === 'trash' ? { trash: true } : {}),
          },
          { addQueryPrefix: true },
        )}`

        const deleteManyResponse =
          viewType === 'trash' || deletePermanently || !collectionConfig.trash
            ? await requests.delete(url, {
                headers: {
                  'Accept-Language': i18n.language,
                  'Content-Type': 'application/json',
                },
              })
            : await requests.patch(url, {
                body: JSON.stringify({
                  deletedAt: new Date().toISOString(),
                }),
                headers: {
                  'Accept-Language': i18n.language,
                  'Content-Type': 'application/json',
                },
              })

        try {
          const { plural, singular } = collectionConfig.labels
          const json = await deleteManyResponse.json()

          const deletedDocs = json?.docs.length || 0
          const successLabel = deletedDocs > 1 ? plural : singular

          if (deleteManyResponse.status < 400 || deletedDocs > 0) {
            const wasTrashed = collectionConfig.trash && !deletePermanently && viewType !== 'trash'

            let successKey:
              | 'general:deletedCountSuccessfully'
              | 'general:permanentlyDeletedCountSuccessfully'
              | 'general:trashedCountSuccessfully'

            if (wasTrashed) {
              successKey = 'general:trashedCountSuccessfully'
            } else if (viewType === 'trash' || deletePermanently) {
              successKey = 'general:permanentlyDeletedCountSuccessfully'
            } else {
              successKey = 'general:deletedCountSuccessfully'
            }

            toast.success(
              t(successKey, {
                count: deletedDocs,
                label: getTranslation(successLabel, i18n),
              }),
            )
          }

          if (json?.errors.length > 0) {
            toast.error(json.message, {
              description: json.errors.map((error) => error.message).join('\n'),
            })
          }

          result[relationTo] = {
            deletedCount: deletedDocs,
            errors: json?.errors || null,
            ids: json?.docs.map((doc) => doc.id) || [],
            totalCount: json.totalDocs,
          }

          if (deleteManyResponse.status > 400 && json?.errors.length === 0) {
            toast.error(t('error:unknown'))
            result[relationTo].errors = [t('error:unknown')]
          }

          continue
        } catch (_err) {
          toast.error(t('error:unknown'))
          result[relationTo] = {
            deletedCount: 0,
            errors: [_err],
            ids: [],
            totalCount: 0,
          }
          continue
        }
      }
    }

    if (typeof afterDelete === 'function') {
      afterDelete(result)
    }
  }, [
    selections,
    afterDelete,
    collections,
    deletePermanently,
    locale,
    search,
    serverURL,
    api,
    i18n,
    viewType,
    where,
    t,
  ])

  const { label: labelString, labelCount } = Object.entries(selections).reduce(
    (acc, [key, value], index, array) => {
      const collectionConfig = collections.find(({ slug }) => slug === key)
      if (collectionConfig) {
        const labelCount = acc.labelCount === undefined ? value.totalCount : acc.labelCount
        const collectionLabel = `${acc.labelCount !== undefined ? `${value.totalCount} ` : ''}${getTranslation(
          value.totalCount > 1 ? collectionConfig.labels.plural : collectionConfig.labels.singular,
          i18n,
        )}`

        let newLabel

        if (index === array.length - 1 && index !== 0) {
          newLabel = `${acc.label} and ${collectionLabel}`
        } else if (index > 0) {
          newLabel = `${acc.label}, ${collectionLabel}`
        } else {
          newLabel = collectionLabel
        }

        return {
          label: newLabel,
          labelCount,
        }
      }
      return acc
    },
    {
      label: '',
      labelCount: undefined,
    },
  )

  return (
    <React.Fragment>
      <ListSelectionButton
        aria-label={t('general:delete')}
        className="delete-documents__toggle"
        onClick={() => {
          openModal(confirmManyDeleteDrawerSlug)
        }}
      >
        {t('general:delete')}
      </ListSelectionButton>
      <ConfirmationModal
        body={
          <React.Fragment>
            <p>
              {trash ? (
                viewType === 'trash' ? (
                  <Translation
                    elements={{
                      '0': ({ children }) => <strong>{children}</strong>,
                      '1': ({ children }) => <strong>{children}</strong>,
                    }}
                    i18nKey="general:aboutToPermanentlyDeleteTrash"
                    t={t}
                    variables={{
                      count: labelCount ?? 0,
                      label: labelString,
                    }}
                  />
                ) : (
                  t('general:aboutToTrashCount', { count: labelCount, label: labelString })
                )
              ) : (
                t('general:aboutToDeleteCount', { count: labelCount, label: labelString })
              )}
            </p>
            {trash && viewType !== 'trash' && (
              <div className="delete-documents__checkbox">
                <CheckboxInput
                  checked={deletePermanently}
                  id="delete-forever"
                  label={t('general:deletePermanently')}
                  name="delete-forever"
                  onToggle={(e) => setDeletePermanently(e.target.checked)}
                />
              </div>
            )}
          </React.Fragment>
        }
        confirmingLabel={t('general:deleting')}
        heading={t('general:confirmDeletion')}
        modalSlug={confirmManyDeleteDrawerSlug}
        onConfirm={handleDelete}
      />
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/DocumentControls/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .doc-controls {
    @include blur-bg-light;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 5;
    display: flex;
    align-items: center;

    &__divider {
      content: '';
      display: block;
      position: absolute;
      height: 1px;
      background: var(--theme-elevation-100);
      width: 100%;
      left: 0;
      top: 100%;
    }

    &__wrapper {
      position: relative;
      width: 100%;
      display: flex;
      align-items: space-between;
      gap: var(--base);
      padding-bottom: 1px;
      z-index: 4;
      height: var(--doc-controls-height);
    }

    &__content {
      display: flex;
      align-items: center;
      flex-grow: 1;
      overflow: hidden;
      padding: base(0.8) 0;
      gap: calc(var(--base) * 0.5);
    }

    &__meta-icons {
      display: flex;
      align-items: center;
      gap: calc(var(--base) * 0.2);
      flex-shrink: 0;
    }

    &__meta {
      flex-grow: 1;
      display: flex;
      list-style: none;
      padding: 0;
      gap: var(--base);
      margin: 0;
      width: 100%;

      & button {
        margin: 0;
      }
    }

    &__locked-controls.locked {
      position: unset;

      .tooltip {
        top: calc(var(--base) * -0.5);
      }
    }

    &__list-item {
      display: flex;
      align-items: center;
      margin: 0;
    }

    &__value-wrap {
      overflow: hidden;
    }

    &__value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
      font-weight: 600;
      line-height: base(1.2);
    }

    &__label {
      color: var(--theme-elevation-500);
      white-space: nowrap;
      margin: 0;
    }

    &__controls-wrapper {
      --controls-gap: calc(var(--base) / 2);
      --dot-button-width: calc(var(--base) * 2);
      display: flex;
      align-items: center;
      margin: 0;
      gap: var(--controls-gap);
      position: relative;
    }

    &__controls {
      display: flex;
      align-items: center;
      margin: 0;
      gap: calc(var(--base) / 2);

      button {
        margin: 0;
        white-space: nowrap;
      }
    }

    &__dots {
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 2px;
      border: 1px solid var(--theme-elevation-100);
      border-radius: $style-radius-m;
      height: calc(var(--base) * 1.6);
      width: calc(var(--base) * 1.6);

      &:hover {
        border: 1px solid var(--theme-elevation-500);
        background-color: var(--theme-elevation-100);
      }

      > div {
        width: 3px;
        height: 3px;
        border-radius: 100%;
        background-color: currentColor;
      }
    }

    &__popup {
      position: relative;
    }

    .popup--active {
      .doc-controls {
        &__dots {
          border: 1px solid var(--theme-elevation-500);
          background-color: var(--theme-elevation-100);
        }
      }
    }

    .popup__trigger-wrap {
      display: flex;
    }

    @include mid-break {
      // On mobile, only stick the controls to the top
      // The timestamps and meta can scroll past
      // The same container needs to the sticky, though
      // So we use a static height with a negative top equal to the meta height plus top padding
      &.gutter {
        top: base(-2.8);
        padding-right: 0;
        padding-left: 0;
      }

      &__wrapper {
        flex-direction: column;
        gap: 0;
        height: unset;
      }

      &__content {
        width: 100%;
        overflow: auto;
        padding-inline: base(2);
        // this container has a fixed height
        // this means the scrollbar (when present) overlaps the content
        &::-webkit-scrollbar {
          display: none;
        }
      }

      &__popup {
        [dir='rtl'] & {
          padding-left: var(--gutter-h);
        }
      }

      &__meta {
        width: auto;
        gap: calc(var(--base) / 2);

        &::after {
          content: '';
          display: block;
          position: absolute;
          right: 0;
          width: base(0.8);
          height: var(--base);
          background: linear-gradient(to right, transparent, var(--theme-bg));
          flex-shrink: 0;
          z-index: 1111;
          pointer-events: none;
        }
      }

      &__controls-wrapper {
        background-color: var(--theme-bg);
        width: 100%;
        transform: translate3d(0, 0, 0);
        padding-right: var(--gutter-h);
        justify-content: space-between;
        height: var(--doc-controls-height);
        border-top: 1px solid var(--theme-elevation-100);
      }

      &__controls {
        [dir='ltr'] & {
          padding-left: var(--gutter-h);
        }
        overflow: auto;

        // do not show scrollbar because the parent container has a static height
        // this container has a gradient overlay as visual indication of `overflow: scroll`
        &::-webkit-scrollbar {
          display: none;
        }

        &::after {
          content: '';
          display: block;
          position: sticky;
          right: 0;
          width: calc(var(--base) * 2);
          height: calc(var(--base) * 1.5);
          background: linear-gradient(to right, transparent, var(--theme-bg));
          flex-shrink: 0;
          z-index: 1111;
          pointer-events: none;
        }
      }
    }

    @include small-break {
      &__content {
        padding-inline: base(0.8);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DocumentControls/index.tsx
Signals: React

```typescript
'use client'
import type {
  ClientUser,
  Data,
  SanitizedCollectionConfig,
  SanitizedCollectionPermission,
  SanitizedGlobalPermission,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { formatAdminURL, hasAutosaveEnabled, hasDraftsEnabled } from 'payload/shared'
import React, { Fragment, useEffect } from 'react'

import type { DocumentDrawerContextType } from '../DocumentDrawer/Provider.js'

import { useFormInitializing, useFormProcessing } from '../../forms/Form/context.js'
import { useConfig } from '../../providers/Config/index.js'
import { useEditDepth } from '../../providers/EditDepth/index.js'
import { useLivePreviewContext } from '../../providers/LivePreview/context.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { formatDate } from '../../utilities/formatDocTitle/formatDateTitle.js'
import { Autosave } from '../Autosave/index.js'
import { Button } from '../Button/index.js'
import { CopyLocaleData } from '../CopyLocaleData/index.js'
import { DeleteDocument } from '../DeleteDocument/index.js'
import { DuplicateDocument } from '../DuplicateDocument/index.js'
import { MoveDocToFolder } from '../FolderView/MoveDocToFolder/index.js'
import { Gutter } from '../Gutter/index.js'
import { LivePreviewToggler } from '../LivePreview/Toggler/index.js'
import { Locked } from '../Locked/index.js'
import { PermanentlyDeleteButton } from '../PermanentlyDeleteButton/index.js'
import { Popup, PopupList } from '../Popup/index.js'
import { PreviewButton } from '../PreviewButton/index.js'
import { PublishButton } from '../PublishButton/index.js'
import { RenderCustomComponent } from '../RenderCustomComponent/index.js'
import { RestoreButton } from '../RestoreButton/index.js'
import { SaveButton } from '../SaveButton/index.js'
import './index.scss'
import { SaveDraftButton } from '../SaveDraftButton/index.js'
import { Status } from '../Status/index.js'

const baseClass = 'doc-controls'

export const DocumentControls: React.FC<{
  readonly apiURL: string
  readonly BeforeDocumentControls?: React.ReactNode
  readonly customComponents?: {
    readonly PreviewButton?: React.ReactNode
    readonly PublishButton?: React.ReactNode
    readonly SaveButton?: React.ReactNode
    readonly SaveDraftButton?: React.ReactNode
  }
  readonly data?: Data
  readonly disableActions?: boolean
  readonly disableCreate?: boolean
  readonly EditMenuItems?: React.ReactNode
  readonly hasPublishPermission?: boolean
  readonly hasSavePermission?: boolean
  readonly id?: number | string
  readonly isAccountView?: boolean
  readonly isEditing?: boolean
  readonly isInDrawer?: boolean
  readonly isTrashed?: boolean
  readonly onDelete?: DocumentDrawerContextType['onDelete']
  readonly onDrawerCreateNew?: () => void
  /* Only available if `redirectAfterDuplicate` is `false` */
  readonly onDuplicate?: DocumentDrawerContextType['onDuplicate']
  readonly onRestore?: DocumentDrawerContextType['onRestore']
  readonly onSave?: DocumentDrawerContextType['onSave']
  readonly onTakeOver?: () => void
  readonly permissions: null | SanitizedCollectionPermission | SanitizedGlobalPermission
  readonly readOnlyForIncomingUser?: boolean
  readonly redirectAfterDelete?: boolean
  readonly redirectAfterDuplicate?: boolean
  readonly redirectAfterRestore?: boolean
  readonly slug: SanitizedCollectionConfig['slug']
  readonly user?: ClientUser
}> = (props) => {
  const {
    id,
    slug,
    BeforeDocumentControls,
    customComponents: {
      PreviewButton: CustomPreviewButton,
      PublishButton: CustomPublishButton,
      SaveButton: CustomSaveButton,
      SaveDraftButton: CustomSaveDraftButton,
    } = {},
    data,
    disableActions,
    disableCreate,
    EditMenuItems,
    hasSavePermission,
    isAccountView,
    isEditing,
    isInDrawer,
    isTrashed,
    onDelete,
    onDrawerCreateNew,
    onDuplicate,
    onRestore,
    onTakeOver,
    permissions,
    readOnlyForIncomingUser,
    redirectAfterDelete,
    redirectAfterDuplicate,
    redirectAfterRestore,
    user,
  } = props

  const { i18n, t } = useTranslation()

  const editDepth = useEditDepth()

  const { config, getEntityConfig } = useConfig()

  const collectionConfig = getEntityConfig({ collectionSlug: slug })

  const globalConfig = getEntityConfig({ globalSlug: slug })

  const { isLivePreviewEnabled } = useLivePreviewContext()

  const {
    admin: { dateFormat },
    localization,
    routes: { admin: adminRoute },
    serverURL,
  } = config

  // Settings these in state to avoid hydration issues if there is a mismatch between the server and client
  const [updatedAt, setUpdatedAt] = React.useState<string>('')
  const [createdAt, setCreatedAt] = React.useState<string>('')

  const processing = useFormProcessing()
  const initializing = useFormInitializing()

  useEffect(() => {
    if (data?.updatedAt) {
      setUpdatedAt(formatDate({ date: data.updatedAt, i18n, pattern: dateFormat }))
    }
    if (data?.createdAt) {
      setCreatedAt(formatDate({ date: data.createdAt, i18n, pattern: dateFormat }))
    }
  }, [data, i18n, dateFormat])

  const hasCreatePermission = permissions && 'create' in permissions && permissions.create

  const hasDeletePermission = permissions && 'delete' in permissions && permissions.delete

  const showDotMenu = Boolean(
    collectionConfig && id && !disableActions && (hasCreatePermission || hasDeletePermission),
  )

  const unsavedDraftWithValidations =
    !id && collectionConfig?.versions?.drafts && collectionConfig.versions?.drafts.validate

  const globalHasDraftsEnabled = hasDraftsEnabled(globalConfig)
  const collectionHasDraftsEnabled = hasDraftsEnabled(collectionConfig)
  const collectionAutosaveEnabled = hasAutosaveEnabled(collectionConfig)
  const globalAutosaveEnabled = hasAutosaveEnabled(globalConfig)
  const autosaveEnabled = collectionAutosaveEnabled || globalAutosaveEnabled

  const showSaveDraftButton =
    (collectionAutosaveEnabled &&
      collectionConfig.versions.drafts.autosave !== false &&
      collectionConfig.versions.drafts.autosave.showSaveDraftButton === true) ||
    (globalAutosaveEnabled &&
      globalConfig.versions.drafts.autosave !== false &&
      globalConfig.versions.drafts.autosave.showSaveDraftButton === true)
  const showCopyToLocale = localization && !collectionConfig?.admin?.disableCopyToLocale

  const showFolderMetaIcon = collectionConfig && collectionConfig.folders
  const showLockedMetaIcon = user && readOnlyForIncomingUser

  return (
    <Gutter className={baseClass}>
      <div className={`${baseClass}__wrapper`}>
        <div className={`${baseClass}__content`}>
          {showLockedMetaIcon || showFolderMetaIcon ? (
            <div className={`${baseClass}__meta-icons`}>
              {showLockedMetaIcon && (
                <Locked className={`${baseClass}__locked-controls`} user={user} />
              )}
              {showFolderMetaIcon && config.folders && !isTrashed && (
                <MoveDocToFolder
                  folderCollectionSlug={config.folders.slug}
                  folderFieldName={config.folders.fieldName}
                />
              )}
            </div>
          ) : null}
          <ul className={`${baseClass}__meta`}>
            {collectionConfig && !isEditing && !isAccountView && (
              <li className={`${baseClass}__list-item`}>
                <p className={`${baseClass}__value`}>
                  {i18n.t('general:creatingNewLabel', {
                    label: getTranslation(
                      collectionConfig?.labels?.singular ?? i18n.t('general:document'),
                      i18n,
                    ),
                  })}
                </p>
              </li>
            )}
            {(collectionHasDraftsEnabled || globalHasDraftsEnabled) && (
              <Fragment>
                {(globalConfig || (collectionConfig && isEditing)) && (
                  <li
                    className={[`${baseClass}__status`, `${baseClass}__list-item`]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <Status />
                  </li>
                )}
                {hasSavePermission &&
                  autosaveEnabled &&
                  !unsavedDraftWithValidations &&
                  !isTrashed && (
                    <li className={`${baseClass}__list-item`}>
                      <Autosave
                        collection={collectionConfig}
                        global={globalConfig}
                        id={id}
                        publishedDocUpdatedAt={data?.createdAt}
                      />
                    </li>
                  )}
              </Fragment>
            )}
            {collectionConfig?.timestamps && (isEditing || isAccountView) && (
              <Fragment>
                <li
                  className={[`${baseClass}__list-item`, `${baseClass}__value-wrap`]
                    .filter(Boolean)
                    .join(' ')}
                  title={data?.updatedAt ? updatedAt : ''}
                >
                  <p className={`${baseClass}__label`}>
                    {i18n.t(isTrashed ? 'general:deleted' : 'general:lastModified')}:&nbsp;
                  </p>

                  {data?.updatedAt && <p className={`${baseClass}__value`}>{updatedAt}</p>}
                </li>
                <li
                  className={[`${baseClass}__list-item`, `${baseClass}__value-wrap`]
                    .filter(Boolean)
                    .join(' ')}
                  title={data?.createdAt ? createdAt : ''}
                >
                  <p className={`${baseClass}__label`}>{i18n.t('general:created')}:&nbsp;</p>
                  {data?.createdAt && <p className={`${baseClass}__value`}>{createdAt}</p>}
                </li>
              </Fragment>
            )}
          </ul>
        </div>
        <div className={`${baseClass}__controls-wrapper`}>
          <div className={`${baseClass}__controls`}>
            {BeforeDocumentControls}
            {isLivePreviewEnabled && !isInDrawer && <LivePreviewToggler />}
            {(collectionConfig?.admin.preview || globalConfig?.admin.preview) && (
              <RenderCustomComponent
                CustomComponent={CustomPreviewButton}
                Fallback={<PreviewButton />}
              />
            )}
            {hasSavePermission && !isTrashed && (
              <Fragment>
                {collectionHasDraftsEnabled || globalHasDraftsEnabled ? (
                  <Fragment>
                    {(unsavedDraftWithValidations ||
                      !autosaveEnabled ||
                      (autosaveEnabled && showSaveDraftButton)) && (
                      <RenderCustomComponent
                        CustomComponent={CustomSaveDraftButton}
                        Fallback={<SaveDraftButton />}
                      />
                    )}
                    <RenderCustomComponent
                      CustomComponent={CustomPublishButton}
                      Fallback={<PublishButton />}
                    />
                  </Fragment>
                ) : (
                  <RenderCustomComponent
                    CustomComponent={CustomSaveButton}
                    Fallback={<SaveButton />}
                  />
                )}
              </Fragment>
            )}
            {hasDeletePermission && isTrashed && (
              <PermanentlyDeleteButton
                buttonId="action-permanently-delete"
                collectionSlug={collectionConfig?.slug}
                id={id.toString()}
                onDelete={onDelete}
                redirectAfterDelete={redirectAfterDelete}
                singularLabel={collectionConfig?.labels?.singular}
              />
            )}
            {hasSavePermission && isTrashed && (
              <RestoreButton
                buttonId="action-restore"
                collectionSlug={collectionConfig?.slug}
                id={id.toString()}
                onRestore={onRestore}
                redirectAfterRestore={redirectAfterRestore}
                singularLabel={collectionConfig?.labels?.singular}
              />
            )}
            {user && readOnlyForIncomingUser && (
              <Button
                buttonStyle="secondary"
                id="take-over"
                onClick={onTakeOver}
                size="medium"
                type="button"
              >
                {t('general:takeOver')}
              </Button>
            )}
          </div>
          {showDotMenu && !readOnlyForIncomingUser && (
            <Popup
              button={
                <div className={`${baseClass}__dots`}>
                  <div />
                  <div />
                  <div />
                </div>
              }
              className={`${baseClass}__popup`}
              disabled={initializing || processing}
              horizontalAlign="right"
              size="large"
              verticalAlign="bottom"
            >
              <PopupList.ButtonGroup>
                {showCopyToLocale && <CopyLocaleData />}
                {hasCreatePermission && (
                  <React.Fragment>
                    {!disableCreate && (
                      <Fragment>
                        {editDepth > 1 ? (
                          <PopupList.Button id="action-create" onClick={onDrawerCreateNew}>
                            {i18n.t('general:createNew')}
                          </PopupList.Button>
                        ) : (
                          <PopupList.Button
                            href={formatAdminURL({
                              adminRoute,
                              path: `/collections/${collectionConfig?.slug}/create`,
                              serverURL,
                            })}
                            id="action-create"
                          >
                            {i18n.t('general:createNew')}
                          </PopupList.Button>
                        )}
                      </Fragment>
                    )}
                    {collectionConfig.disableDuplicate !== true && isEditing && (
                      <>
                        <DuplicateDocument
                          id={id}
                          onDuplicate={onDuplicate}
                          redirectAfterDuplicate={redirectAfterDuplicate}
                          singularLabel={collectionConfig?.labels?.singular}
                          slug={collectionConfig?.slug}
                        />
                        {localization && (
                          <DuplicateDocument
                            id={id}
                            onDuplicate={onDuplicate}
                            redirectAfterDuplicate={redirectAfterDuplicate}
                            selectLocales={true}
                            singularLabel={collectionConfig?.labels?.singular}
                            slug={collectionConfig?.slug}
                          />
                        )}
                      </>
                    )}
                  </React.Fragment>
                )}
                {hasDeletePermission && (
                  <DeleteDocument
                    buttonId="action-delete"
                    collectionSlug={collectionConfig?.slug}
                    id={id.toString()}
                    onDelete={onDelete}
                    redirectAfterDelete={redirectAfterDelete}
                    singularLabel={collectionConfig?.labels?.singular}
                    useAsTitle={collectionConfig?.admin?.useAsTitle}
                  />
                )}
                {EditMenuItems}
              </PopupList.ButtonGroup>
            </Popup>
          )}
        </div>
      </div>
      <div className={`${baseClass}__divider`} />
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: DrawerContent.tsx]---
Location: payload-main/packages/ui/src/elements/DocumentDrawer/DrawerContent.tsx
Signals: React

```typescript
'use client'

import { useModal } from '@faceless-ui/modal'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import type { DocumentDrawerProps } from './types.js'

import { LoadingOverlay } from '../../elements/Loading/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useServerFunctions } from '../../providers/ServerFunctions/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { abortAndIgnore, handleAbortRef } from '../../utilities/abortAndIgnore.js'
import { DocumentDrawerContextProvider } from './Provider.js'

export const DocumentDrawerContent: React.FC<DocumentDrawerProps> = ({
  id: docID,
  collectionSlug,
  disableActions,
  drawerSlug,
  initialData,
  onDelete: onDeleteFromProps,
  onDuplicate: onDuplicateFromProps,
  onSave: onSaveFromProps,
  overrideEntityVisibility = true,
  redirectAfterCreate,
  redirectAfterDelete,
  redirectAfterDuplicate,
  redirectAfterRestore,
}) => {
  const { getEntityConfig } = useConfig()
  const locale = useLocale()

  const [collectionConfig] = useState(() => getEntityConfig({ collectionSlug }))

  const abortGetDocumentViewRef = React.useRef<AbortController>(null)

  const { closeModal } = useModal()
  const { t } = useTranslation()

  const { renderDocument } = useServerFunctions()

  const [DocumentView, setDocumentView] = useState<React.ReactNode>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  const hasInitialized = useRef(false)

  const getDocumentView = useCallback(
    (docID?: DocumentDrawerProps['id'], showLoadingIndicator: boolean = false) => {
      const controller = handleAbortRef(abortGetDocumentViewRef)

      const fetchDocumentView = async () => {
        if (showLoadingIndicator) {
          setIsLoading(true)
        }

        try {
          const result = await renderDocument({
            collectionSlug,
            disableActions,
            docID,
            drawerSlug,
            initialData,
            locale,
            overrideEntityVisibility,
            redirectAfterCreate,
            redirectAfterDelete: redirectAfterDelete !== undefined ? redirectAfterDelete : false,
            redirectAfterDuplicate:
              redirectAfterDuplicate !== undefined ? redirectAfterDuplicate : false,
            redirectAfterRestore: redirectAfterRestore !== undefined ? redirectAfterRestore : false,
            signal: controller.signal,
          })

          if (result?.Document) {
            setDocumentView(result.Document)
            setIsLoading(false)
          }
        } catch (error) {
          toast.error(error?.message || t('error:unspecific'))
          closeModal(drawerSlug)
        }

        abortGetDocumentViewRef.current = null
      }

      void fetchDocumentView()
    },
    [
      collectionSlug,
      disableActions,
      drawerSlug,
      initialData,
      redirectAfterDelete,
      redirectAfterDuplicate,
      redirectAfterRestore,
      renderDocument,
      redirectAfterCreate,
      closeModal,
      overrideEntityVisibility,
      t,
      locale,
    ],
  )

  const onSave = useCallback<DocumentDrawerProps['onSave']>(
    (args) => {
      if (args.operation === 'create') {
        getDocumentView(args.doc.id)
      }

      if (typeof onSaveFromProps === 'function') {
        void onSaveFromProps({
          ...args,
          collectionConfig,
        })
      }
    },
    [onSaveFromProps, collectionConfig, getDocumentView],
  )

  const onDuplicate = useCallback<DocumentDrawerProps['onDuplicate']>(
    (args) => {
      getDocumentView(args.doc.id)

      if (typeof onDuplicateFromProps === 'function') {
        void onDuplicateFromProps({
          ...args,
          collectionConfig,
        })
      }
    },
    [onDuplicateFromProps, collectionConfig, getDocumentView],
  )

  const onDelete = useCallback<DocumentDrawerProps['onDelete']>(
    (args) => {
      if (typeof onDeleteFromProps === 'function') {
        void onDeleteFromProps({
          ...args,
          collectionConfig,
        })
      }

      closeModal(drawerSlug)
    },
    [onDeleteFromProps, closeModal, drawerSlug, collectionConfig],
  )

  const clearDoc = useCallback(() => {
    getDocumentView(undefined, true)
  }, [getDocumentView])

  useEffect(() => {
    if (!DocumentView && !hasInitialized.current) {
      getDocumentView(docID, true)
      hasInitialized.current = true
    }
  }, [DocumentView, getDocumentView, docID])

  // Cleanup any pending requests when the component unmounts
  useEffect(() => {
    const abortGetDocumentView = abortGetDocumentViewRef.current

    return () => {
      abortAndIgnore(abortGetDocumentView)
    }
  }, [])

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <DocumentDrawerContextProvider
      clearDoc={clearDoc}
      drawerSlug={drawerSlug}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
      onSave={onSave}
    >
      {DocumentView}
    </DocumentDrawerContextProvider>
  )
}
```

--------------------------------------------------------------------------------

````
