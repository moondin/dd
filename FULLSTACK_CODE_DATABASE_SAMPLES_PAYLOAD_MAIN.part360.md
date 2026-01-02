---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 360
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 360 of 695)

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

---[FILE: DrawerContent.tsx]---
Location: payload-main/packages/ui/src/elements/BulkUpload/EditMany/DrawerContent.tsx
Signals: React

```typescript
'use client'

import type { ClientCollectionConfig, SelectType } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { unflatten } from 'payload/shared'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import type { FormProps } from '../../../forms/Form/index.js'
import type { OnFieldSelect } from '../../FieldSelect/index.js'
import type { FieldOption } from '../../FieldSelect/reduceFieldOptions.js'
import type { State } from '../FormsManager/reducer.js'
import type { EditManyBulkUploadsProps } from './index.js'

import { Button } from '../../../elements/Button/index.js'
import { Form } from '../../../forms/Form/index.js'
import { FieldPathContext } from '../../../forms/RenderFields/context.js'
import { RenderField } from '../../../forms/RenderFields/RenderField.js'
import { XIcon } from '../../../icons/X/index.js'
import { useAuth } from '../../../providers/Auth/index.js'
import { useServerFunctions } from '../../../providers/ServerFunctions/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { abortAndIgnore, handleAbortRef } from '../../../utilities/abortAndIgnore.js'
import { FieldSelect } from '../../FieldSelect/index.js'
import { useFormsManager } from '../FormsManager/index.js'
import { baseClass } from './index.js'
import './index.scss'
import '../../../forms/RenderFields/index.scss'

export const EditManyBulkUploadsDrawerContent: React.FC<
  {
    collection: ClientCollectionConfig
    drawerSlug: string
    forms: State['forms']
  } & EditManyBulkUploadsProps
> = (props) => {
  const {
    collection: { fields, labels: { plural, singular } } = {},
    collection,
    drawerSlug,
    forms,
  } = props

  const [isInitializing, setIsInitializing] = useState(false)
  const { permissions } = useAuth()
  const { i18n, t } = useTranslation()
  const { closeModal } = useModal()
  const { bulkUpdateForm } = useFormsManager()
  const { getFormState } = useServerFunctions()
  const abortFormStateRef = React.useRef<AbortController>(null)

  const [selectedFields, setSelectedFields] = useState<FieldOption[]>([])
  const collectionPermissions = permissions?.collections?.[collection.slug]

  const select = useMemo<SelectType>(() => {
    return unflatten(
      selectedFields.reduce((acc, option) => {
        acc[option.value.path] = true
        return acc
      }, {} as SelectType),
    )
  }, [selectedFields])

  const onChange: FormProps['onChange'][0] = useCallback(
    async ({ formState: prevFormState, submitted }) => {
      const controller = handleAbortRef(abortFormStateRef)

      const { state } = await getFormState({
        collectionSlug: collection.slug,
        docPermissions: collectionPermissions,
        docPreferences: null,
        formState: prevFormState,
        operation: 'update',
        schemaPath: collection.slug,
        select,
        signal: controller.signal,
        skipValidation: !submitted,
      })

      abortFormStateRef.current = null

      return state
    },
    [getFormState, collection, collectionPermissions, select],
  )

  useEffect(() => {
    const abortFormState = abortFormStateRef.current

    return () => {
      abortAndIgnore(abortFormState)
    }
  }, [])

  const handleSubmit: FormProps['onSubmit'] = useCallback(
    (formState) => {
      const pairedData = selectedFields.reduce((acc, option) => {
        if (formState[option.value.path]) {
          acc[option.value.path] = formState[option.value.path].value
        }
        return acc
      }, {})

      void bulkUpdateForm(pairedData, () => closeModal(drawerSlug))
    },
    [closeModal, drawerSlug, bulkUpdateForm, selectedFields],
  )

  const onFieldSelect = useCallback<OnFieldSelect>(
    async ({ dispatchFields, formState, selected }) => {
      setIsInitializing(true)

      setSelectedFields(selected || [])

      const { state } = await getFormState({
        collectionSlug: collection.slug,
        docPermissions: collectionPermissions,
        docPreferences: null,
        formState,
        operation: 'update',
        schemaPath: collection.slug,
        select: unflatten(
          selected.reduce((acc, option) => {
            acc[option.value.path] = true
            return acc
          }, {} as SelectType),
        ),
        skipValidation: true,
      })

      dispatchFields({
        type: 'UPDATE_MANY',
        formState: state,
      })

      setIsInitializing(false)
    },
    [getFormState, collection, collectionPermissions],
  )

  return (
    <div className={`${baseClass}__main`}>
      <div className={`${baseClass}__header`}>
        <h2 className={`${baseClass}__header__title`}>
          {t('general:editingLabel', {
            count: forms.length,
            label: getTranslation(forms.length > 1 ? plural : singular, i18n),
          })}
        </h2>
        <button
          aria-label={t('general:close')}
          className={`${baseClass}__header__close`}
          id={`close-drawer__${drawerSlug}`}
          onClick={() => closeModal(drawerSlug)}
          type="button"
        >
          <XIcon />
        </button>
      </div>
      <Form
        className={`${baseClass}__form`}
        isInitializing={isInitializing}
        onChange={[onChange]}
        onSubmit={handleSubmit}
      >
        <FieldSelect
          fields={fields}
          onChange={onFieldSelect}
          permissions={collectionPermissions.fields}
        />
        {selectedFields.length === 0 ? null : (
          <div className="render-fields">
            <FieldPathContext value={undefined}>
              {selectedFields.map((option, i) => {
                const {
                  value: { field, fieldPermissions, path },
                } = option

                return (
                  <RenderField
                    clientFieldConfig={field}
                    indexPath=""
                    key={`${path}-${i}`}
                    parentPath=""
                    parentSchemaPath=""
                    path={path}
                    permissions={fieldPermissions}
                  />
                )
              })}
            </FieldPathContext>
          </div>
        )}
        <div className={`${baseClass}__sidebar-wrap`}>
          <div className={`${baseClass}__sidebar`}>
            <div className={`${baseClass}__sidebar-sticky-wrap`}>
              <div className={`${baseClass}__document-actions`}>
                <Button type="submit">{t('general:applyChanges')}</Button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/BulkUpload/EditMany/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .edit-many-bulk-uploads {
    &__toggle {
      font-size: 1rem;
      line-height: base(1.2);
      display: inline-flex;
      background: var(--theme-elevation-150);
      color: var(--theme-elevation-800);
      border-radius: $style-radius-s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border: 0;
      padding: 0 base(0.4);
      align-items: center;
      cursor: pointer;
      text-decoration: none;

      &:active,
      &:focus {
        outline: none;
      }

      &:hover {
        background: var(--theme-elevation-100);
      }

      &:active {
        background: var(--theme-elevation-100);
      }
    }

    &__form {
      height: 100%;
    }

    &__main {
      width: calc(100% - #{base(15)});
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    &__header {
      display: flex;
      margin-top: base(2.5);
      margin-bottom: base(1);
      width: 100%;

      &__title {
        margin: 0;
        flex-grow: 1;
      }

      &__close {
        border: 0;
        background-color: transparent;
        padding: 0;
        cursor: pointer;
        overflow: hidden;
        width: base(1);
        height: base(1);

        svg {
          width: base(2);
          height: base(2);
          position: relative;
          inset-inline-start: base(-0.5);
          top: base(-0.5);

          .stroke {
            stroke-width: 2px;
            vector-effect: non-scaling-stroke;
          }
        }
      }
    }

    &__edit {
      padding-top: base(1);
      padding-bottom: base(2);
      flex-grow: 1;
    }
    [dir='rtl'] &__sidebar-wrap {
      left: 0;
      border-right: 1px solid var(--theme-elevation-100);
      right: auto;
    }

    &__sidebar-wrap {
      position: fixed;
      width: base(15);
      height: 100%;
      top: 0;
      right: 0;
      overflow: visible;
      border-left: 1px solid var(--theme-elevation-100);
    }

    &__sidebar {
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }

    &__sidebar-sticky-wrap {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    &__collection-actions,
    &__meta,
    &__sidebar-fields {
      [dir='ltr'] & {
        padding-left: base(1.5);
      }
      [dir='rtl'] & {
        padding-right: base(1.5);
      }
    }

    &__document-actions {
      padding-right: $baseline;
      position: sticky;
      top: 0;
      z-index: var(--z-nav);

      > * {
        position: relative;
        z-index: 1;
      }

      @include mid-break {
        @include blur-bg;
      }
    }

    &__document-actions {
      display: flex;
      flex-wrap: wrap;
      padding: base(1);
      gap: base(0.5);

      .form-submit {
        width: calc(50% - #{base(1)});

        @include mid-break {
          width: auto;
          flex-grow: 1;
        }

        .btn {
          width: 100%;
          padding-left: base(0.5);
          padding-right: base(0.5);
          margin-bottom: 0;
        }
      }
    }

    @include mid-break {
      &__main {
        width: 100%;
        min-height: initial;
      }

      &__sidebar-wrap {
        position: static;
        width: 100%;
        height: initial;
      }

      &__form {
        display: block;
      }

      &__edit {
        padding-top: 0;
        padding-bottom: 0;
      }

      &__document-actions {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: auto;
        z-index: var(--z-nav);
      }

      &__document-actions,
      &__sidebar-fields {
        padding-left: var(--gutter-h);
        padding-right: var(--gutter-h);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/BulkUpload/EditMany/index.tsx
Signals: React

```typescript
'use client'

import type { ClientCollectionConfig } from 'payload'

import React from 'react'

import { useAuth } from '../../../providers/Auth/index.js'
import { EditDepthProvider } from '../../../providers/EditDepth/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Drawer, DrawerToggler } from '../../Drawer/index.js'
import { useFormsManager } from '../FormsManager/index.js'
import { EditManyBulkUploadsDrawerContent } from './DrawerContent.js'
import './index.scss'

export const baseClass = 'edit-many-bulk-uploads'

export type EditManyBulkUploadsProps = {
  readonly collection: ClientCollectionConfig
}

export const EditManyBulkUploads: React.FC<EditManyBulkUploadsProps> = (props) => {
  const { collection: { slug } = {}, collection } = props

  const { permissions } = useAuth()

  const { t } = useTranslation()
  const { forms } = useFormsManager() // Access forms managed in bulk uploads

  const collectionPermissions = permissions?.collections?.[slug]
  const hasUpdatePermission = collectionPermissions?.update

  const drawerSlug = `edit-${slug}-bulk-uploads`

  if (!hasUpdatePermission) {
    return null
  }

  return (
    <div className={baseClass}>
      <DrawerToggler
        aria-label={t('general:editAll')}
        className={`${baseClass}__toggle`}
        slug={drawerSlug}
      >
        {t('general:editAll')}
      </DrawerToggler>
      <EditDepthProvider>
        <Drawer Header={null} slug={drawerSlug}>
          <EditManyBulkUploadsDrawerContent
            collection={collection}
            drawerSlug={drawerSlug}
            forms={forms}
          />
        </Drawer>
      </EditDepthProvider>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/BulkUpload/FileSidebar/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .file-selections {
    --file-gutter-h: calc(var(--gutter-h) / 4);
    border-right: 1px solid var(--theme-border-color);
    padding: 0;
    display: flex;
    flex-direction: column;
    width: 300px;
    overflow: visible;
    max-height: 100%;

    &__header {
      position: sticky;
      top: 0;
      margin-top: var(--base);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      background: var(--theme-bg);
      flex-wrap: wrap;

      p {
        margin: 0;
      }
    }

    &__collectionSelect {
      width: 100%;

      .react-select {
        width: 100%;
      }
      .field-type__wrap {
        width: 100%;
        padding-block: var(--base);
        padding-inline: var(--file-gutter-h);
      }
    }

    &__headerTopRow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--base);
      width: 100%;
      padding-block: var(--base);
      padding-inline: var(--file-gutter-h);
    }

    &__header__text {
      display: flex;
      flex-direction: column;

      .error-pill {
        align-self: flex-start;
      }
    }

    &__filesContainer {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 4);
      margin-top: calc(var(--base) / 2);
      width: 100%;
      padding-inline: var(--file-gutter-h);

      .shimmer-effect {
        border-radius: var(--style-radius-m);
      }
    }

    &__fileRowContainer {
      --rowPadding: calc(var(--base) / 4);
      position: relative;
      &:last-child {
        margin-bottom: calc(var(--base) / 4);
      }
    }

    &__fileRow {
      @include btn-reset;
      display: flex;
      padding: var(--rowPadding);
      align-items: center;
      gap: calc(var(--base) / 2);
      border-radius: var(--style-radius-m);
      max-width: 100%;
      cursor: pointer;
      width: 100%;

      &:hover {
        background-color: var(--theme-elevation-100);
      }

      .file-selections__thumbnail,
      .file-selections__thumbnail-shimmer {
        width: calc(var(--base) * 1.2);
        height: calc(var(--base) * 1.2);
        border-radius: var(--style-radius-s);
        flex-shrink: 0;
        object-fit: cover;
      }

      p {
        margin: 0;
      }
    }

    &__fileDetails {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    &__fileRowContainer--active {
      .file-selections__fileRow {
        background-color: var(--theme-elevation-100);
      }

      .file-selections__remove {
        .icon--x {
          opacity: 1;
        }
      }
    }

    &__fileRowContainer--error {
      .file-selections__fileRow {
        background-color: var(--theme-error-100);
      }

      &.file-selections__fileRowContainer--active .file-selections__fileRow,
      .file-selections__fileRow:hover {
        background-color: var(--theme-error-200);
      }

      .file-selections__remove--overlay:hover {
        background-color: var(--theme-error-50);

        .icon--x {
          opacity: 1;
        }
      }
    }

    &__errorCount {
      margin-left: auto;
      position: absolute;
      transform: translate(50%, -50%);
      top: 0;
      right: 0;
    }

    &__fileName {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__fileSize {
      font-size: calc(var(--base) / 2);
      color: var(--theme-elvation-400);
      flex-shrink: 0;
    }

    &__remove {
      @include btn-reset;
      margin: 0;
      margin-left: auto;

      .icon--x {
        opacity: 0.75;
      }
    }

    &__remove--underlay {
      pointer-events: none;
      opacity: 0;
    }

    &__remove--overlay {
      position: absolute;
      transform: translateY(-50%);
      top: 50%;
      bottom: 50%;
      right: var(--rowPadding);
      height: 20px;
      border-radius: var(--style-radius-m);
      cursor: pointer;

      &:hover {
        background-color: var(--theme-elevation-200);
      }
    }

    &__header__actions {
      display: flex;
      align-items: center;
      gap: var(--base);
    }

    &__header__addFile {
      height: fit-content;
    }

    &__toggler {
      display: none;
      margin: 0;
      padding-block: 0;

      &__text {
        display: none;
      }
    }

    &__header__mobileDocActions {
      display: none;
    }

    &__animateWrapper {
      overflow: auto;
    }

    &__mobileBlur {
      @include blur-bg;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 100ms cubic-bezier(0, 0.2, 0.2, 1);
    }

    &__showingFiles {
      .file-selections__mobileBlur {
        opacity: 1;
      }
    }

    @include mid-break {
      --file-gutter-h: var(--gutter-h);
      flex-direction: column-reverse;
      width: 100%;
      position: sticky;
      bottom: 0;
      flex-shrink: 0;

      &__showingFiles {
        z-index: 2;
      }

      &__filesContainer {
        @include blur-bg;
      }

      &__fileRowContainer {
        z-index: 1;
      }

      &__header {
        margin-top: 0;
      }

      &__headerTopRow {
        border-top: 1px solid var(--theme-border-color);
        padding-block: 0 calc(var(--base) * 0.8) 0;
      }

      &__header__text {
        display: none;
      }

      &__header__actions {
        flex-grow: 2;
        display: flex;
        justify-content: flex-end;
      }

      &__header__mobileDocActions {
        position: relative;
        display: flex;
        width: 100%;
        padding-block: calc(var(--base) * 0.8);
        padding-inline: var(--file-gutter-h);
        border-top: 1px solid var(--theme-border-color);

        > div {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          button {
            flex: 0.5;
          }
        }
      }

      &__toggler {
        padding-right: 0;
        padding-left: 0;
        padding-top: calc(var(--base) * 0.8);
        padding-bottom: calc(var(--base) * 0.8);
        display: flex;
        justify-content: flex-end;
        flex-grow: 1;

        .btn__label {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        &__text {
          display: flex;
        }

        svg {
          max-width: 1.5rem;
        }

        .btn__content {
          width: 100%;
        }
      }

      .btn {
        margin: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/BulkUpload/FileSidebar/index.tsx
Signals: React

```typescript
'use client'

import { useModal } from '@faceless-ui/modal'
import { useWindowInfo } from '@faceless-ui/window-info'
import { isImage } from 'payload/shared'
import React from 'react'

import { SelectInput } from '../../../fields/Select/Input.js'
import { ChevronIcon } from '../../../icons/Chevron/index.js'
import { XIcon } from '../../../icons/X/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { AnimateHeight } from '../../AnimateHeight/index.js'
import { Button } from '../../Button/index.js'
import { Drawer } from '../../Drawer/index.js'
import { ErrorPill } from '../../ErrorPill/index.js'
import { Pill } from '../../Pill/index.js'
import { ShimmerEffect } from '../../ShimmerEffect/index.js'
import { createThumbnail } from '../../Thumbnail/createThumbnail.js'
import { Thumbnail } from '../../Thumbnail/index.js'
import { Actions } from '../ActionsBar/index.js'
import { AddFilesView } from '../AddFilesView/index.js'
import './index.scss'
import { useFormsManager } from '../FormsManager/index.js'
import { useBulkUpload } from '../index.js'

const addMoreFilesDrawerSlug = 'bulk-upload-drawer--add-more-files'

const baseClass = 'file-selections'

export function FileSidebar() {
  const {
    activeIndex,
    addFiles,
    forms,
    isInitializing,
    removeFile,
    setActiveIndex,
    totalErrorCount,
  } = useFormsManager()
  const { initialFiles, initialForms, maxFiles } = useBulkUpload()
  const { i18n, t } = useTranslation()
  const { closeModal, openModal } = useModal()
  const [showFiles, setShowFiles] = React.useState(false)
  const { breakpoints } = useWindowInfo()

  const handleRemoveFile = React.useCallback(
    (indexToRemove: number) => {
      removeFile(indexToRemove)
    },
    [removeFile],
  )

  const handleAddFiles = React.useCallback(
    (filelist: FileList) => {
      void addFiles(filelist)
      closeModal(addMoreFilesDrawerSlug)
    },
    [addFiles, closeModal],
  )

  const getFileSize = React.useCallback((file: File) => {
    const size = file.size
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
    const decimals = i > 1 ? 1 : 0
    const formattedSize =
      (size / Math.pow(1024, i)).toFixed(decimals) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
    return formattedSize
  }, [])

  const totalFileCount = isInitializing
    ? (initialFiles?.length ?? initialForms?.length)
    : forms.length

  const {
    collectionSlug: bulkUploadCollectionSlug,
    selectableCollections,
    setCollectionSlug,
  } = useBulkUpload()

  const { getEntityConfig } = useConfig()

  return (
    <div
      className={[baseClass, showFiles && `${baseClass}__showingFiles`].filter(Boolean).join(' ')}
    >
      {breakpoints.m && showFiles ? <div className={`${baseClass}__mobileBlur`} /> : null}
      <div className={`${baseClass}__header`}>
        {selectableCollections?.length > 1 && (
          <SelectInput
            className={`${baseClass}__collectionSelect`}
            isClearable={false}
            name="groupBy"
            onChange={(e) => {
              const val: string =
                typeof e === 'object' && 'value' in e
                  ? (e?.value as string)
                  : (e as unknown as string)
              setCollectionSlug(val)
            }}
            options={
              selectableCollections?.map((coll) => {
                const config = getEntityConfig({ collectionSlug: coll })
                return { label: config.labels.singular, value: config.slug }
              }) || []
            }
            path="groupBy"
            required
            value={bulkUploadCollectionSlug}
          />
        )}
        <div className={`${baseClass}__headerTopRow`}>
          <div className={`${baseClass}__header__text`}>
            <ErrorPill count={totalErrorCount} i18n={i18n} withMessage />
            <p>
              <strong
                title={`${totalFileCount} ${t(totalFileCount > 1 ? 'upload:filesToUpload' : 'upload:fileToUpload')}`}
              >
                {totalFileCount}{' '}
                {t(totalFileCount > 1 ? 'upload:filesToUpload' : 'upload:fileToUpload')}
              </strong>
            </p>
          </div>

          <div className={`${baseClass}__header__actions`}>
            {(typeof maxFiles === 'number' ? totalFileCount < maxFiles : true) ? (
              <Pill
                className={`${baseClass}__header__addFile`}
                onClick={() => openModal(addMoreFilesDrawerSlug)}
                size="small"
              >
                {t('upload:addFile')}
              </Pill>
            ) : null}
            <Button
              buttonStyle="transparent"
              className={`${baseClass}__toggler`}
              onClick={() => setShowFiles((prev) => !prev)}
            >
              <span className={`${baseClass}__toggler__label`}>
                <strong
                  title={`${totalFileCount} ${t(totalFileCount > 1 ? 'upload:filesToUpload' : 'upload:fileToUpload')}`}
                >
                  {totalFileCount}{' '}
                  {t(totalFileCount > 1 ? 'upload:filesToUpload' : 'upload:fileToUpload')}
                </strong>
              </span>
              <ChevronIcon direction={showFiles ? 'down' : 'up'} />
            </Button>

            <Drawer gutter={false} Header={null} slug={addMoreFilesDrawerSlug}>
              <AddFilesView
                onCancel={() => closeModal(addMoreFilesDrawerSlug)}
                onDrop={handleAddFiles}
              />
            </Drawer>
          </div>
        </div>

        <div className={`${baseClass}__header__mobileDocActions`}>
          <Actions />
        </div>
      </div>

      <div className={`${baseClass}__animateWrapper`}>
        <AnimateHeight height={!breakpoints.m || showFiles ? 'auto' : 0}>
          <div className={`${baseClass}__filesContainer`}>
            {isInitializing &&
            forms.length === 0 &&
            (initialFiles?.length > 0 || initialForms?.length > 0)
              ? (initialFiles ? Array.from(initialFiles) : initialForms).map((file, index) => (
                  <ShimmerEffect
                    animationDelay={`calc(${index} * ${60}ms)`}
                    height="35px"
                    key={index}
                  />
                ))
              : null}
            {forms.map(({ errorCount, formID, formState }, index) => {
              const currentFile = (formState?.file?.value as File) || ({} as File)

              return (
                <div
                  className={[
                    `${baseClass}__fileRowContainer`,
                    index === activeIndex && `${baseClass}__fileRowContainer--active`,
                    errorCount && errorCount > 0 && `${baseClass}__fileRowContainer--error`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={formID}
                >
                  <button
                    className={`${baseClass}__fileRow`}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  >
                    <SidebarThumbnail file={currentFile} formID={formID} />
                    <div className={`${baseClass}__fileDetails`}>
                      <p className={`${baseClass}__fileName`} title={currentFile.name}>
                        {currentFile.name || t('upload:noFile')}
                      </p>
                    </div>
                    {currentFile instanceof File ? (
                      <p className={`${baseClass}__fileSize`}>{getFileSize(currentFile)}</p>
                    ) : null}
                    <div className={`${baseClass}__remove ${baseClass}__remove--underlay`}>
                      <XIcon />
                    </div>

                    {errorCount ? (
                      <ErrorPill
                        className={`${baseClass}__errorCount`}
                        count={errorCount}
                        i18n={i18n}
                      />
                    ) : null}
                  </button>

                  <button
                    aria-label={t('general:remove')}
                    className={`${baseClass}__remove ${baseClass}__remove--overlay`}
                    onClick={() => handleRemoveFile(index)}
                    type="button"
                  >
                    <XIcon />
                  </button>
                </div>
              )
            })}
          </div>
        </AnimateHeight>
      </div>
    </div>
  )
}

function SidebarThumbnail({ file, formID }: { file: File; formID: string }) {
  const [thumbnailURL, setThumbnailURL] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let isCancelled = false

    async function generateThumbnail() {
      setIsLoading(true)
      setThumbnailURL(null)

      try {
        if (isImage(file.type)) {
          const url = await createThumbnail(file)
          if (!isCancelled) {
            setThumbnailURL(url)
          }
        } else {
          setThumbnailURL(null)
        }
      } catch (_) {
        if (!isCancelled) {
          setThumbnailURL(null)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void generateThumbnail()

    return () => {
      isCancelled = true
    }
  }, [file])

  if (isLoading) {
    return <ShimmerEffect className={`${baseClass}__thumbnail-shimmer`} disableInlineStyles />
  }

  return (
    <Thumbnail
      className={`${baseClass}__thumbnail`}
      fileSrc={thumbnailURL}
      key={`${formID}-${thumbnailURL || 'placeholder'}`}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: createFormData.ts]---
Location: payload-main/packages/ui/src/elements/BulkUpload/FormsManager/createFormData.ts

```typescript
import type { CollectionSlug, FormState } from 'payload'

import { serialize } from 'object-to-formdata'
import { reduceFieldsToValues } from 'payload/shared'

import type { UploadHandlersContext } from '../../../providers/UploadHandlers/index.js'

export async function createFormData(
  formState: FormState = {},
  overrides: Record<string, any> = {},
  collectionSlug: CollectionSlug,
  uploadHandler: ReturnType<UploadHandlersContext['getUploadHandler']>,
) {
  const data = reduceFieldsToValues(formState, true)
  let file = data?.file

  if (file) {
    delete data.file
  }

  if (file && typeof uploadHandler === 'function') {
    let filename = file.name

    const clientUploadContext = await uploadHandler({
      file,
      updateFilename: (value) => {
        filename = value
      },
    })

    file = JSON.stringify({
      clientUploadContext,
      collectionSlug,
      filename,
      mimeType: file.type,
      size: file.size,
    })
  }

  const dataWithOverrides = {
    ...data,
    ...overrides,
  }

  const dataToSerialize = {
    _payload: JSON.stringify(dataWithOverrides),
    file,
  }

  return serialize(dataToSerialize, { indices: true, nullsAsUndefineds: false })
}
```

--------------------------------------------------------------------------------

````
