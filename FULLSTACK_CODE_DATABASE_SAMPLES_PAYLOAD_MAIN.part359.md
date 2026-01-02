---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 359
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 359 of 695)

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
Location: payload-main/packages/ui/src/elements/Autosave/index.tsx
Signals: React

```typescript
'use client'
// TODO: abstract the `next/navigation` dependency out from this component
import type { ClientCollectionConfig, ClientGlobalConfig } from 'payload'

import { dequal } from 'dequal/lite'
import {
  getAutosaveInterval,
  hasDraftValidationEnabled,
  reduceFieldsToValues,
} from 'payload/shared'
import React, { useDeferredValue, useEffect, useRef, useState } from 'react'

import type { OnSaveContext } from '../../views/Edit/index.js'

import {
  useAllFormFields,
  useForm,
  useFormModified,
  useFormSubmitted,
} from '../../forms/Form/context.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import { useEffectEvent } from '../../hooks/useEffectEvent.js'
import { useQueue } from '../../hooks/useQueue.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { formatTimeToNow } from '../../utilities/formatDocTitle/formatDateTitle.js'
import { reduceFieldsToValuesWithValidation } from '../../utilities/reduceFieldsToValuesWithValidation.js'
import { LeaveWithoutSaving } from '../LeaveWithoutSaving/index.js'
import './index.scss'

const baseClass = 'autosave'
// The minimum time the saving state should be shown
const minimumAnimationTime = 1000

export type Props = {
  collection?: ClientCollectionConfig
  global?: ClientGlobalConfig
  id?: number | string
  publishedDocUpdatedAt: string
}

export const Autosave: React.FC<Props> = ({ id, collection, global: globalDoc }) => {
  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const {
    docConfig,
    lastUpdateTime,
    mostRecentVersionIsAutosaved,
    setMostRecentVersionIsAutosaved,
    setUnpublishedVersionCount,
  } = useDocumentInfo()

  const { isValid, setBackgroundProcessing, submit } = useForm()

  const [formState] = useAllFormFields()
  const modified = useFormModified()
  const submitted = useFormSubmitted()

  const { code: locale } = useLocale()
  const { i18n, t } = useTranslation()

  const interval = getAutosaveInterval(docConfig)
  const validateOnDraft = hasDraftValidationEnabled(docConfig)

  const [_saving, setSaving] = useState(false)

  const saving = useDeferredValue(_saving)

  const debouncedFormState = useDebounce(formState, interval)

  const { queueTask } = useQueue()

  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleAutosave = useEffectEvent(() => {
    autosaveTimeoutRef.current = undefined
    // We need to log the time in order to figure out if we need to trigger the state off later
    let startTimestamp = undefined
    let endTimestamp = undefined

    const hideIndicator = () => {
      // If request was faster than minimum animation time, animate the difference
      if (endTimestamp - startTimestamp < minimumAnimationTime) {
        autosaveTimeoutRef.current = setTimeout(
          () => {
            setSaving(false)
          },
          minimumAnimationTime - (endTimestamp - startTimestamp),
        )
      } else {
        stopAutoSaveIndicator()
      }
    }

    queueTask(
      async () => {
        if (modified) {
          startTimestamp = new Date().getTime()

          setSaving(true)

          let url: string
          let method: string
          let entitySlug: string

          if (collection && id) {
            entitySlug = collection.slug
            url = `${serverURL}${api}/${entitySlug}/${id}?depth=0&draft=true&autosave=true&locale=${locale}&fallback-locale=null`
            method = 'PATCH'
          }

          if (globalDoc) {
            entitySlug = globalDoc.slug
            url = `${serverURL}${api}/globals/${entitySlug}?depth=0&draft=true&autosave=true&locale=${locale}&fallback-locale=null`
            method = 'POST'
          }

          const { valid } = reduceFieldsToValuesWithValidation(formState, true)

          const skipSubmission = submitted && !valid && validateOnDraft

          if (!skipSubmission && modified && url) {
            const result = await submit<any, OnSaveContext>({
              acceptValues: {
                overrideLocalChanges: false,
              },
              action: url,
              context: {
                getDocPermissions: false,
                incrementVersionCount: !mostRecentVersionIsAutosaved,
              },
              disableFormWhileProcessing: false,
              disableSuccessStatus: true,
              method,
              overrides: {
                _status: 'draft',
              },
              skipValidation: !validateOnDraft,
            })

            if (result && result?.res?.ok && !mostRecentVersionIsAutosaved) {
              setMostRecentVersionIsAutosaved(true)
              setUnpublishedVersionCount((prev) => prev + 1)
            }

            const newDate = new Date()

            // We need to log the time in order to figure out if we need to trigger the state off later
            endTimestamp = newDate.getTime()

            hideIndicator()
          }
        }
      },
      {
        afterProcess: () => {
          setBackgroundProcessing(false)
        },
        beforeProcess: () => {
          setBackgroundProcessing(true)
        },
      },
    )
  })

  const didMount = useRef(false)
  const previousDebouncedData = useRef(reduceFieldsToValues(debouncedFormState))

  // When debounced fields change, autosave
  useEffect(() => {
    /**
     * Ensure autosave doesn't run on mount
     */
    if (!didMount.current) {
      didMount.current = true
      return
    }

    /**
     * Ensure autosave only runs if the form data changes, not every time the entire form state changes
     * Remove `updatedAt` from comparison as it changes on every autosave interval.
     */
    const { updatedAt: _, ...formData } = reduceFieldsToValues(debouncedFormState)
    const { updatedAt: __, ...prevFormData } = previousDebouncedData.current

    if (dequal(formData, prevFormData)) {
      return
    }

    previousDebouncedData.current = formData

    handleAutosave()
  }, [debouncedFormState])

  /**
   * If component unmounts, clear the autosave timeout
   */
  useEffect(() => {
    return () => {
      stopAutoSaveIndicator()
    }
  }, [])

  const stopAutoSaveIndicator = useEffectEvent(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current)
    }

    setSaving(false)
  })

  return (
    <div className={baseClass}>
      {validateOnDraft && !isValid && <LeaveWithoutSaving />}
      {saving && t('general:saving')}
      {!saving && Boolean(lastUpdateTime) && (
        <React.Fragment>
          {t('version:lastSavedAgo', {
            distance: formatTimeToNow({ date: lastUpdateTime, i18n }),
          })}
        </React.Fragment>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Banner/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .banner {
    font-size: 1rem;
    line-height: base(1);
    border: 0;
    vertical-align: middle;
    background: var(--theme-elevation-100);
    color: var(--theme-elevation-800);
    border-radius: $style-radius-m;
    padding: base(0.5);
    margin-bottom: $baseline;

    &--has-action {
      cursor: pointer;
      text-decoration: none;
    }

    &--has-icon {
      display: flex;

      svg {
        display: block;
      }
    }

    &--type-default {
      &.button--has-action {
        &:hover {
          background: var(--theme-elevation-900);
        }

        &:active {
          background: var(--theme-elevation-950);
        }
      }
    }

    &--type-error {
      background: var(--theme-error-100);
      color: var(--theme-error-600);

      svg {
        @include color-svg(var(--theme-error-600));
      }

      &.button--has-action {
        &:hover {
          background: var(--theme-error-200);
        }

        &:active {
          background: var(--theme-error-300);
        }
      }
    }

    &--type-success {
      background: var(--theme-success-100);
      color: var(--theme-success-600);

      &.button--has-action {
        &:hover {
          background: var(--theme-success-200);
        }

        &:active {
          background: var(--theme-success-200);
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Banner/index.tsx
Signals: React

```typescript
'use client'
import type { MouseEvent } from 'react'

import React from 'react'

import './index.scss'
import { Link } from '../Link/index.js'

const baseClass = 'banner'

type onClick = (event: MouseEvent) => void

export type Props = Readonly<{
  alignIcon?: 'left' | 'right'
  children?: React.ReactNode
  className?: string
  icon?: React.ReactNode
  onClick?: onClick
  to?: string
  type?: 'default' | 'error' | 'info' | 'success'
}>

export type RenderedTypeProps = {
  children?: React.ReactNode
  className?: string
  onClick?: onClick
  to: string
}

export const Banner: React.FC<Props> = ({
  type = 'default',
  alignIcon = 'right',
  children,
  className,
  icon,
  onClick,
  to,
}) => {
  const classes = [
    baseClass,
    `${baseClass}--type-${type}`,
    className && className,
    to && `${baseClass}--has-link`,
    (to || onClick) && `${baseClass}--has-action`,
    icon && `${baseClass}--has-icon`,
    icon && `${baseClass}--align-icon-${alignIcon}`,
  ]
    .filter(Boolean)
    .join(' ')

  let RenderedType: React.ComponentType<RenderedTypeProps> | React.ElementType = 'div'

  if (onClick && !to) {
    RenderedType = 'button'
  }
  if (to) {
    RenderedType = Link
  }

  return (
    <RenderedType className={classes} href={to || null} onClick={onClick}>
      {icon && alignIcon === 'left' && <React.Fragment>{icon}</React.Fragment>}
      <span className={`${baseClass}__content`}>{children}</span>
      {icon && alignIcon === 'right' && <React.Fragment>{icon}</React.Fragment>}
    </RenderedType>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/BulkUpload/index.tsx
Signals: React

```typescript
'use client'

import type { CollectionSlug, JsonObject } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { validateMimeType } from 'payload/shared'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

import { useEffectEvent } from '../../hooks/useEffectEvent.js'
import { useConfig } from '../../providers/Config/index.js'
import { EditDepthProvider } from '../../providers/EditDepth/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { UploadControlsProvider } from '../../providers/UploadControls/index.js'
import { Drawer, useDrawerDepth } from '../Drawer/index.js'
import { AddFilesView } from './AddFilesView/index.js'
import { AddingFilesView } from './AddingFilesView/index.js'
import { FormsManagerProvider, type InitialForms, useFormsManager } from './FormsManager/index.js'

const drawerSlug = 'bulk-upload-drawer-slug'

function DrawerContent() {
  const { addFiles, forms, isInitializing } = useFormsManager()
  const { closeModal } = useModal()
  const { collectionSlug, drawerSlug } = useBulkUpload()
  const { getEntityConfig } = useConfig()
  const { t } = useTranslation()

  const uploadCollection = getEntityConfig({ collectionSlug })
  const uploadConfig = uploadCollection?.upload
  const uploadMimeTypes = uploadConfig?.mimeTypes

  const onDrop = React.useCallback(
    (acceptedFiles: FileList) => {
      const fileTransfer = new DataTransfer()
      for (const candidateFile of acceptedFiles) {
        if (
          uploadMimeTypes === undefined ||
          uploadMimeTypes.length === 0 ||
          validateMimeType(candidateFile.type, uploadMimeTypes)
        ) {
          fileTransfer.items.add(candidateFile)
        }
      }
      if (fileTransfer.files.length === 0) {
        toast.error(t('error:invalidFileType'))
      } else {
        void addFiles(fileTransfer.files)
      }
    },
    [addFiles, t, uploadMimeTypes],
  )

  if (!collectionSlug) {
    return null
  }

  if (!forms.length && !isInitializing) {
    return (
      <AddFilesView
        acceptMimeTypes={uploadMimeTypes?.join(', ')}
        onCancel={() => closeModal(drawerSlug)}
        onDrop={onDrop}
      />
    )
  } else {
    return <AddingFilesView />
  }
}

export type BulkUploadProps = {
  readonly children: React.ReactNode
}

export function BulkUploadDrawer() {
  const {
    drawerSlug,
    onCancel,
    setInitialFiles,
    setInitialForms,
    setOnCancel,
    setOnSuccess,
    setSelectableCollections,
    setSuccessfullyUploaded,
    successfullyUploaded,
  } = useBulkUpload()
  const { modalState } = useModal()
  const previousModalStateRef = React.useRef(modalState)

  /**
   * This is used to trigger onCancel when the drawer is closed (=> forms reset, as FormsManager is unmounted)
   */
  const onModalStateChanged = useEffectEvent((modalState) => {
    const previousModalState = previousModalStateRef.current[drawerSlug]
    const currentModalState = modalState[drawerSlug]

    if (typeof currentModalState === 'undefined' && typeof previousModalState === 'undefined') {
      return
    }

    if (previousModalState?.isOpen !== currentModalState?.isOpen) {
      if (!currentModalState?.isOpen) {
        if (!successfullyUploaded) {
          // It's only cancelled if successfullyUploaded is not set. Otherwise, this would simply be a modal close after success
          // => do not call cancel, just reset everything
          if (typeof onCancel === 'function') {
            onCancel()
          }
        }

        // Reset everything to defaults
        setInitialFiles(undefined)
        setInitialForms(undefined)
        setOnCancel(() => () => null)
        setOnSuccess(() => () => null)
        setSelectableCollections(null)
        setSuccessfullyUploaded(false)
      }
    }
    previousModalStateRef.current = modalState
  })

  useEffect(() => {
    onModalStateChanged(modalState)
  }, [modalState])

  return (
    <Drawer gutter={false} Header={null} slug={drawerSlug}>
      <FormsManagerProvider>
        <UploadControlsProvider>
          <EditDepthProvider>
            <DrawerContent />
          </EditDepthProvider>
        </UploadControlsProvider>
      </FormsManagerProvider>
    </Drawer>
  )
}

export type BulkUploadContext = {
  collectionSlug: CollectionSlug
  drawerSlug: string
  initialFiles: FileList
  /**
   * Like initialFiles, but allows manually providing initial form state or the form ID for each file
   */
  initialForms: InitialForms
  maxFiles: number
  onCancel: () => void
  onSuccess: (
    uploadedForms: Array<{
      collectionSlug: CollectionSlug
      doc: JsonObject
      /**
       * ID of the form that created this document
       */
      formID: string
    }>,
    errorCount: number,
  ) => void
  /**
   * An array of collection slugs that can be selected in the collection dropdown (if applicable)
   * @default null - collection cannot be selected
   */
  selectableCollections?: null | string[]
  setCollectionSlug: (slug: string) => void
  setInitialFiles: (files: FileList) => void
  setInitialForms: (
    forms: ((forms: InitialForms | undefined) => InitialForms | undefined) | InitialForms,
  ) => void
  setMaxFiles: (maxFiles: number) => void
  setOnCancel: (onCancel: BulkUploadContext['onCancel']) => void
  setOnSuccess: (onSuccess: BulkUploadContext['onSuccess']) => void
  /**
   * Set the collections that can be selected in the collection dropdown (if applicable)
   *
   * @default null - collection cannot be selected
   */
  setSelectableCollections: (collections: null | string[]) => void
  setSuccessfullyUploaded: (successfullyUploaded: boolean) => void
  successfullyUploaded: boolean
}

const Context = React.createContext<BulkUploadContext>({
  collectionSlug: '',
  drawerSlug: '',
  initialFiles: undefined,
  initialForms: [],
  maxFiles: undefined,
  onCancel: () => null,
  onSuccess: () => null,
  selectableCollections: null,
  setCollectionSlug: () => null,
  setInitialFiles: () => null,
  setInitialForms: () => null,
  setMaxFiles: () => null,
  setOnCancel: () => null,
  setOnSuccess: () => null,
  setSelectableCollections: () => null,
  setSuccessfullyUploaded: () => false,
  successfullyUploaded: false,
})
export function BulkUploadProvider({
  children,
  drawerSlugPrefix,
}: {
  readonly children: React.ReactNode
  readonly drawerSlugPrefix?: string
}) {
  const [selectableCollections, setSelectableCollections] = React.useState<null | string[]>(null)
  const [collection, setCollection] = React.useState<string>()
  const [onSuccessFunction, setOnSuccessFunction] = React.useState<BulkUploadContext['onSuccess']>()
  const [onCancelFunction, setOnCancelFunction] = React.useState<BulkUploadContext['onCancel']>()
  const [initialFiles, setInitialFiles] = React.useState<FileList>(undefined)
  const [initialForms, setInitialForms] = React.useState<InitialForms>(undefined)
  const [maxFiles, setMaxFiles] = React.useState<number>(undefined)
  const [successfullyUploaded, setSuccessfullyUploaded] = React.useState<boolean>(false)

  const drawerSlug = `${drawerSlugPrefix ? `${drawerSlugPrefix}-` : ''}${useBulkUploadDrawerSlug()}`

  const setOnSuccess: BulkUploadContext['setOnSuccess'] = (onSuccess) => {
    setOnSuccessFunction(() => onSuccess)
  }
  const setOnCancel: BulkUploadContext['setOnCancel'] = (onCancel) => {
    setOnCancelFunction(() => onCancel)
  }

  return (
    <Context
      value={{
        collectionSlug: collection,
        drawerSlug,
        initialFiles,
        initialForms,
        maxFiles,
        onCancel: () => {
          if (typeof onCancelFunction === 'function') {
            onCancelFunction()
          }
        },
        onSuccess: (newDocs, errorCount) => {
          if (typeof onSuccessFunction === 'function') {
            onSuccessFunction(newDocs, errorCount)
          }
        },
        selectableCollections,
        setCollectionSlug: setCollection,
        setInitialFiles,
        setInitialForms,
        setMaxFiles,
        setOnCancel,
        setOnSuccess,
        setSelectableCollections,
        setSuccessfullyUploaded,
        successfullyUploaded,
      }}
    >
      <React.Fragment>
        {children}
        <BulkUploadDrawer />
      </React.Fragment>
    </Context>
  )
}

export const useBulkUpload = () => React.use(Context)

export function useBulkUploadDrawerSlug() {
  const depth = useDrawerDepth()

  return `${drawerSlug}-${depth || 1}`
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/BulkUpload/ActionsBar/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .bulk-upload--actions-bar {
    display: flex;
    padding-inline: var(--gutter-h);
    align-items: center;
    border-bottom: 1px solid var(--theme-border-color);
    position: sticky;
    z-index: 1;
    top: 0;
    background-color: var(--theme-bg);
    height: var(--doc-controls-height);

    &__navigation {
      display: flex;
      gap: var(--base);
      align-items: center;
      width: 100%;
    }

    &__locationText {
      font-variant-numeric: tabular-nums;
      margin: 0;
    }

    &__controls {
      display: flex;
      gap: calc(var(--base) / 2);

      .btn {
        background-color: var(--theme-elevation-100);
        width: calc(var(--base) * 1.2);
        height: calc(var(--base) * 1.2);

        &:hover {
          background-color: var(--theme-elevation-200);
        }

        &__label {
          display: flex;
        }
      }
    }

    &__buttons {
      display: flex;
      gap: var(--base);
      margin-left: auto;
      white-space: nowrap;
    }

    @include mid-break {
      &__navigation {
        justify-content: space-between;
      }
      &__saveButtons {
        display: none;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/BulkUpload/ActionsBar/index.tsx
Signals: React

```typescript
'use client'

import type { ClientCollectionConfig } from 'payload'

import React from 'react'

import { ChevronIcon } from '../../../icons/Chevron/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Button } from '../../Button/index.js'
import { EditManyBulkUploads } from '../EditMany/index.js'
import { useFormsManager } from '../FormsManager/index.js'
import './index.scss'

const baseClass = 'bulk-upload--actions-bar'

type Props = {
  readonly collectionConfig: ClientCollectionConfig
}

export function ActionsBar({ collectionConfig }: Props) {
  const { activeIndex, forms, setActiveIndex } = useFormsManager()
  const { t } = useTranslation()

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__navigation`}>
        <p className={`${baseClass}__locationText`}>
          <strong>{activeIndex + 1}</strong>
          {` ${t('general:of')} `}
          <strong>{forms.length}</strong>
        </p>

        <div className={`${baseClass}__controls`}>
          <Button
            aria-label={t('general:previous')}
            buttonStyle="none"
            onClick={() => {
              const nextIndex = activeIndex - 1
              if (nextIndex < 0) {
                setActiveIndex(forms.length - 1)
              } else {
                setActiveIndex(nextIndex)
              }
            }}
            type="button"
          >
            <ChevronIcon direction="left" />
          </Button>
          <Button
            aria-label={t('general:next')}
            buttonStyle="none"
            onClick={() => {
              const nextIndex = activeIndex + 1
              if (nextIndex === forms.length) {
                setActiveIndex(0)
              } else {
                setActiveIndex(nextIndex)
              }
            }}
            type="button"
          >
            <ChevronIcon direction="right" />
          </Button>
        </div>
        <EditManyBulkUploads collection={collectionConfig} />
      </div>

      <Actions className={`${baseClass}__saveButtons`} />
    </div>
  )
}

type ActionsProps = {
  readonly className?: string
}
export function Actions({ className }: ActionsProps) {
  const { getEntityConfig } = useConfig()
  const { t } = useTranslation()
  const { collectionSlug, hasPublishPermission, hasSavePermission, saveAllDocs } = useFormsManager()

  const collectionConfig = getEntityConfig({ collectionSlug })

  return (
    <div className={[`${baseClass}__buttons`, className].filter(Boolean).join(' ')}>
      {collectionConfig?.versions?.drafts && hasSavePermission ? (
        <Button
          buttonStyle="secondary"
          onClick={() => void saveAllDocs({ overrides: { _status: 'draft' } })}
        >
          {t('version:saveDraft')}
        </Button>
      ) : null}
      {collectionConfig?.versions?.drafts && hasPublishPermission ? (
        <Button onClick={() => void saveAllDocs({ overrides: { _status: 'published' } })}>
          {t('version:publish')}
        </Button>
      ) : null}

      {!collectionConfig?.versions?.drafts && hasSavePermission ? (
        <Button onClick={() => void saveAllDocs()}>{t('general:save')}</Button>
      ) : null}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/BulkUpload/AddFilesView/index.scss

```text
@layer payload-default {
  .bulk-upload--add-files {
    height: 100%;
    display: flex;
    flex-direction: column;

    &__dropArea {
      height: 100%;
      padding: calc(var(--base) * 2) var(--gutter-h);
    }

    .dropzone {
      flex-direction: column;
      justify-content: center;
      display: flex;
      gap: var(--base);
      background-color: var(--theme-elevation-50);

      p {
        margin: 0;
      }
    }

    &__dragAndDropText {
      margin: 0;
      text-transform: lowercase;
      align-self: center;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/BulkUpload/AddFilesView/index.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useTranslation } from '../../../providers/Translation/index.js'
import { Button } from '../../Button/index.js'
import { Dropzone } from '../../Dropzone/index.js'
import { DrawerHeader } from '../Header/index.js'
import './index.scss'

const baseClass = 'bulk-upload--add-files'

type Props = {
  readonly acceptMimeTypes?: string
  readonly onCancel: () => void
  readonly onDrop: (acceptedFiles: FileList) => void
}
export function AddFilesView({ acceptMimeTypes, onCancel, onDrop }: Props) {
  const { t } = useTranslation()

  const inputRef = React.useRef(null)

  return (
    <div className={baseClass}>
      <DrawerHeader onClose={onCancel} title={t('upload:addFiles')} />
      <div className={`${baseClass}__dropArea`}>
        <Dropzone multipleFiles onChange={onDrop}>
          <Button
            buttonStyle="subtle"
            iconPosition="left"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.click()
              }
            }}
            size="small"
          >
            {t('upload:selectFile')}
          </Button>
          <input
            accept={acceptMimeTypes}
            aria-hidden="true"
            className={`${baseClass}__hidden-input`}
            hidden
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onDrop(e.target.files)
              }
            }}
            ref={inputRef}
            type="file"
          />

          <p className={`${baseClass}__dragAndDropText`}>
            {t('general:or')} {t('upload:dragAndDrop')}
          </p>
        </Dropzone>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/BulkUpload/AddingFilesView/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .bulk-upload--file-manager {
    display: flex;
    height: 100%;
    width: 100%;
    overflow: hidden;

    &__editView {
      flex-grow: 1;
      height: 100%;
      max-height: 100%;
      overflow: auto;
    }

    @include mid-break {
      flex-direction: column-reverse;

      &__editView {
        flex-grow: 1;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/BulkUpload/AddingFilesView/index.tsx
Signals: React

```typescript
'use client'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { reduceFieldsToValues } from 'payload/shared'
import React from 'react'

import { useAuth } from '../../../providers/Auth/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { DocumentInfoProvider } from '../../../providers/DocumentInfo/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { ActionsBar } from '../ActionsBar/index.js'
import { discardBulkUploadModalSlug, DiscardWithoutSaving } from '../DiscardWithoutSaving/index.js'
import { EditForm } from '../EditForm/index.js'
import { FileSidebar } from '../FileSidebar/index.js'
import { useFormsManager } from '../FormsManager/index.js'
import { DrawerHeader } from '../Header/index.js'
import './index.scss'

const baseClass = 'bulk-upload--file-manager'

export function AddingFilesView() {
  const {
    activeIndex,
    collectionSlug,
    docPermissions,
    documentSlots,
    forms,
    hasPublishPermission,
    hasSavePermission,
    hasSubmitted,
    resetUploadEdits,
    updateUploadEdits,
  } = useFormsManager()
  const activeForm = forms[activeIndex]
  const { getEntityConfig } = useConfig()
  const { i18n } = useTranslation()
  const { user } = useAuth()
  const { openModal } = useModal()

  const collectionConfig = getEntityConfig({ collectionSlug })

  return (
    <div className={baseClass}>
      <FileSidebar />

      <div className={`${baseClass}__editView`}>
        <DrawerHeader
          onClose={() => openModal(discardBulkUploadModalSlug)}
          title={getTranslation(collectionConfig.labels.singular, i18n)}
        />
        {activeForm ? (
          <DocumentInfoProvider
            collectionSlug={collectionSlug}
            currentEditor={user}
            docPermissions={docPermissions}
            hasPublishedDoc={false}
            hasPublishPermission={hasPublishPermission}
            hasSavePermission={hasSavePermission}
            id={null}
            initialData={reduceFieldsToValues(activeForm.formState, true)}
            initialState={activeForm.formState}
            isLocked={false}
            key={`${activeIndex}-${forms.length}`}
            lastUpdateTime={0}
            mostRecentVersionIsAutosaved={false}
            unpublishedVersionCount={0}
            Upload={documentSlots.Upload}
            versionCount={0}
          >
            <ActionsBar collectionConfig={collectionConfig} />
            <EditForm
              resetUploadEdits={resetUploadEdits}
              submitted={hasSubmitted}
              updateUploadEdits={updateUploadEdits}
              uploadEdits={activeForm?.uploadEdits}
            />
          </DocumentInfoProvider>
        ) : null}
      </div>

      <DiscardWithoutSaving />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/BulkUpload/DiscardWithoutSaving/index.tsx
Signals: React

```typescript
'use client'

import { useModal } from '@faceless-ui/modal'
import React from 'react'

import { useTranslation } from '../../../providers/Translation/index.js'
import { ConfirmationModal } from '../../ConfirmationModal/index.js'
import { useBulkUpload } from '../index.js'
export const discardBulkUploadModalSlug = 'bulk-upload--discard-without-saving'

export function DiscardWithoutSaving() {
  const { t } = useTranslation()
  const { closeModal } = useModal()
  const { drawerSlug } = useBulkUpload()

  const onCancel = React.useCallback(() => {
    closeModal(discardBulkUploadModalSlug)
  }, [closeModal])

  const onConfirm = React.useCallback(() => {
    closeModal(drawerSlug)
    closeModal(discardBulkUploadModalSlug)
  }, [closeModal, drawerSlug])

  return (
    <ConfirmationModal
      body={t('general:changesNotSaved')}
      cancelLabel={t('general:stayOnThisPage')}
      confirmLabel={t('general:leaveAnyway')}
      heading={t('general:leaveWithoutSaving')}
      modalSlug={discardBulkUploadModalSlug}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/BulkUpload/DrawerCloseButton/index.scss

```text
@layer payload-default {
  .drawer-close-button {
    --size: calc(var(--base) * 1.2);
    border: 0;
    background-color: transparent;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    direction: ltr;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size);
    height: var(--size);

    svg {
      margin: calc(-1 * var(--size));
      width: calc(var(--size) * 2);
      height: calc(var(--size) * 2);

      position: relative;

      .stroke {
        stroke-width: 1px;
        vector-effect: non-scaling-stroke;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/BulkUpload/DrawerCloseButton/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { XIcon } from '../../../icons/X/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'drawer-close-button'

type Props = {
  readonly onClick: () => void
}
export function DrawerCloseButton({ onClick }: Props) {
  const { t } = useTranslation()

  return (
    <button aria-label={t('general:close')} className={baseClass} onClick={onClick} type="button">
      <XIcon />
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/BulkUpload/EditForm/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .collection-edit {
    width: 100%;

    &__form {
      height: auto;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/BulkUpload/EditForm/index.tsx
Signals: React

```typescript
'use client'

import React, { useCallback, useEffect } from 'react'

import type { EditFormProps } from './types.js'

import { Form, useForm } from '../../../forms/Form/index.js'
import { type FormProps } from '../../../forms/Form/types.js'
import { WatchChildErrors } from '../../../forms/WatchChildErrors/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useDocumentEvents } from '../../../providers/DocumentEvents/index.js'
import { useDocumentInfo } from '../../../providers/DocumentInfo/index.js'
import { OperationProvider } from '../../../providers/Operation/index.js'
import { useServerFunctions } from '../../../providers/ServerFunctions/index.js'
import { abortAndIgnore, handleAbortRef } from '../../../utilities/abortAndIgnore.js'
import { useDocumentDrawerContext } from '../../DocumentDrawer/Provider.js'
import { DocumentFields } from '../../DocumentFields/index.js'
import { MoveDocToFolder } from '../../FolderView/MoveDocToFolder/index.js'
import { Upload_v4 } from '../../Upload/index.js'
import { useFormsManager } from '../FormsManager/index.js'
import './index.scss'

const baseClass = 'collection-edit'

// This component receives props only on _pages_
// When rendered within a drawer, props are empty
// This is solely to support custom edit views which get server-rendered

export function EditForm({
  resetUploadEdits,
  submitted,
  updateUploadEdits,
  uploadEdits,
}: EditFormProps) {
  const {
    action,
    collectionSlug: docSlug,
    docPermissions,
    getDocPreferences,
    hasSavePermission,
    initialState,
    isInitializing,
    Upload: CustomUpload,
  } = useDocumentInfo()

  const { drawerSlug, onSave: onSaveFromContext } = useDocumentDrawerContext()

  const { getFormState } = useServerFunctions()

  const {
    config: { folders },
    getEntityConfig,
  } = useConfig()

  const abortOnChangeRef = React.useRef<AbortController>(null)

  const collectionConfig = getEntityConfig({ collectionSlug: docSlug })
  const { reportUpdate } = useDocumentEvents()

  const collectionSlug = collectionConfig.slug

  const [schemaPath] = React.useState(collectionSlug)

  const onSave = useCallback(
    (json) => {
      reportUpdate({
        doc: json?.doc || json?.result,
        drawerSlug,
        entitySlug: collectionSlug,
        operation: 'create',
        updatedAt: json?.result?.updatedAt || new Date().toISOString(),
      })

      if (typeof onSaveFromContext === 'function') {
        void onSaveFromContext({
          ...json,
          operation: 'create',
        })
      }
      resetUploadEdits()
    },
    [collectionSlug, onSaveFromContext, reportUpdate, resetUploadEdits, drawerSlug],
  )

  const onChange: NonNullable<FormProps['onChange']>[0] = useCallback(
    async ({ formState: prevFormState, submitted }) => {
      const controller = handleAbortRef(abortOnChangeRef)

      const docPreferences = await getDocPreferences()

      const { state: newFormState } = await getFormState({
        collectionSlug,
        docPermissions,
        docPreferences,
        formState: prevFormState,
        operation: 'create',
        schemaPath,
        signal: controller.signal,
        skipValidation: !submitted,
      })

      abortOnChangeRef.current = null

      return newFormState
    },
    [collectionSlug, schemaPath, getDocPreferences, getFormState, docPermissions],
  )

  useEffect(() => {
    const abortOnChange = abortOnChangeRef.current

    return () => {
      abortAndIgnore(abortOnChange)
    }
  }, [])

  return (
    <OperationProvider operation="create">
      <Form
        action={action}
        className={`${baseClass}__form`}
        disabled={isInitializing || !hasSavePermission}
        initialState={isInitializing ? undefined : initialState}
        isInitializing={isInitializing}
        method="POST"
        onChange={[onChange]}
        onSuccess={onSave}
        submitted={submitted}
      >
        <DocumentFields
          BeforeFields={
            <React.Fragment>
              {CustomUpload || (
                <Upload_v4
                  collectionSlug={collectionConfig.slug}
                  customActions={[
                    folders && collectionConfig.folders && (
                      <MoveDocToFolder
                        buttonProps={{
                          buttonStyle: 'pill',
                          size: 'small',
                        }}
                        folderCollectionSlug={folders.slug}
                        folderFieldName={folders.fieldName}
                        key="move-doc-to-folder"
                      />
                    ),
                  ].filter(Boolean)}
                  initialState={initialState}
                  resetUploadEdits={resetUploadEdits}
                  updateUploadEdits={updateUploadEdits}
                  uploadConfig={collectionConfig.upload}
                  uploadEdits={uploadEdits}
                />
              )}
            </React.Fragment>
          }
          docPermissions={docPermissions}
          fields={collectionConfig.fields}
          schemaPathSegments={[collectionConfig.slug]}
        />
        <ReportAllErrors />
        <GetFieldProxy />
      </Form>
    </OperationProvider>
  )
}

function GetFieldProxy() {
  const { getFields } = useForm()
  const { getFormDataRef } = useFormsManager()

  useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler -- TODO: fix
    getFormDataRef.current = getFields
  }, [getFields, getFormDataRef])

  return null
}

function ReportAllErrors() {
  const { docConfig } = useDocumentInfo()
  const { activeIndex, setFormTotalErrorCount } = useFormsManager()
  const errorCountRef = React.useRef(0)

  const reportFormErrorCount = React.useCallback(
    (errorCount) => {
      if (errorCount === errorCountRef.current) {
        return
      }
      setFormTotalErrorCount({ errorCount, index: activeIndex })
      errorCountRef.current = errorCount
    },
    [activeIndex, setFormTotalErrorCount],
  )

  if (!docConfig) {
    return null
  }

  return (
    <WatchChildErrors fields={docConfig.fields} path={[]} setErrorCount={reportFormErrorCount} />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/BulkUpload/EditForm/types.ts

```typescript
import type { UploadProps_v4 } from '../../Upload/index.js'

export type EditFormProps = {
  readonly submitted?: boolean
} & Pick<UploadProps_v4, 'resetUploadEdits' | 'updateUploadEdits' | 'uploadEdits'>
```

--------------------------------------------------------------------------------

````
