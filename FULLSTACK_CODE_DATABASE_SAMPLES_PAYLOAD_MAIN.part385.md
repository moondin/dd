---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 385
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 385 of 695)

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
Location: payload-main/packages/ui/src/elements/Upload/index.tsx
Signals: React

```typescript
'use client'
import type { FormState, SanitizedCollectionConfig, UploadEdits } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { isImage } from 'payload/shared'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { FieldError } from '../../fields/FieldError/index.js'
import { fieldBaseClass } from '../../fields/shared/index.js'
import { useForm, useFormProcessing } from '../../forms/Form/index.js'
import { useField } from '../../forms/useField/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { EditDepthProvider } from '../../providers/EditDepth/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { UploadControlsProvider, useUploadControls } from '../../providers/UploadControls/index.js'
import { useUploadEdits } from '../../providers/UploadEdits/index.js'
import { Button } from '../Button/index.js'
import { Drawer } from '../Drawer/index.js'
import { Dropzone } from '../Dropzone/index.js'
import { EditUpload } from '../EditUpload/index.js'
import './index.scss'
import { FileDetails } from '../FileDetails/index.js'
import { PreviewSizes } from '../PreviewSizes/index.js'
import { Thumbnail } from '../Thumbnail/index.js'

const baseClass = 'file-field'
export const editDrawerSlug = 'edit-upload'
export const sizePreviewSlug = 'preview-sizes'

const validate = (value) => {
  if (!value && value !== undefined) {
    return 'A file is required.'
  }

  if (value && (!value.name || value.name === '')) {
    return 'A file name is required.'
  }

  return true
}

type UploadActionsArgs = {
  readonly customActions?: React.ReactNode[]
  readonly enableAdjustments: boolean
  readonly enablePreviewSizes: boolean
  readonly mimeType: string
}

export const UploadActions = ({
  customActions,
  enableAdjustments,
  enablePreviewSizes,
  mimeType,
}: UploadActionsArgs) => {
  const { t } = useTranslation()
  const { openModal } = useModal()

  const fileTypeIsAdjustable =
    isImage(mimeType) && mimeType !== 'image/svg+xml' && mimeType !== 'image/jxl'

  if (!fileTypeIsAdjustable && (!customActions || customActions.length === 0)) {
    return null
  }

  return (
    <div className={`${baseClass}__upload-actions`}>
      {fileTypeIsAdjustable && (
        <React.Fragment>
          {enablePreviewSizes && (
            <Button
              buttonStyle="pill"
              className={`${baseClass}__previewSizes`}
              margin={false}
              onClick={() => {
                openModal(sizePreviewSlug)
              }}
              size="small"
            >
              {t('upload:previewSizes')}
            </Button>
          )}
          {enableAdjustments && (
            <Button
              buttonStyle="pill"
              className={`${baseClass}__edit`}
              margin={false}
              onClick={() => {
                openModal(editDrawerSlug)
              }}
              size="small"
            >
              {t('upload:editImage')}
            </Button>
          )}
        </React.Fragment>
      )}

      {customActions &&
        customActions.map((CustomAction, i) => {
          return <React.Fragment key={i}>{CustomAction}</React.Fragment>
        })}
    </div>
  )
}

export type UploadProps = {
  readonly collectionSlug: string
  readonly customActions?: React.ReactNode[]
  readonly initialState?: FormState
  readonly onChange?: (file?: File) => void
  readonly uploadConfig: SanitizedCollectionConfig['upload']
  readonly UploadControls?: React.ReactNode
}

export const Upload: React.FC<UploadProps> = (props) => {
  const { resetUploadEdits, updateUploadEdits, uploadEdits } = useUploadEdits()
  return (
    <UploadControlsProvider>
      <Upload_v4
        {...props}
        resetUploadEdits={resetUploadEdits}
        updateUploadEdits={updateUploadEdits}
        uploadEdits={uploadEdits}
      />
    </UploadControlsProvider>
  )
}

export type UploadProps_v4 = {
  readonly resetUploadEdits?: () => void
  readonly updateUploadEdits?: (args: UploadEdits) => void
  readonly uploadEdits?: UploadEdits
} & UploadProps

export const Upload_v4: React.FC<UploadProps_v4> = (props) => {
  const {
    collectionSlug,
    customActions,
    initialState,
    onChange,
    resetUploadEdits,
    updateUploadEdits,
    uploadConfig,
    UploadControls,
    uploadEdits,
  } = props

  const {
    setUploadControlFile,
    setUploadControlFileName,
    setUploadControlFileUrl,
    uploadControlFile,
    uploadControlFileName,
    uploadControlFileUrl,
  } = useUploadControls()

  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const { t } = useTranslation()
  const { setModified } = useForm()
  const { id, data, docPermissions, setUploadStatus } = useDocumentInfo()
  const isFormSubmitting = useFormProcessing()
  const { errorMessage, setValue, showError, value } = useField<File>({
    path: 'file',
    validate,
  })

  const [fileSrc, setFileSrc] = useState<null | string>(null)
  const [removedFile, setRemovedFile] = useState(false)
  const [filename, setFilename] = useState<string>(value?.name || '')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [fileUrl, setFileUrl] = useState<string>('')

  const urlInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const useServerSideFetch =
    typeof uploadConfig?.pasteURL === 'object' && uploadConfig.pasteURL.allowList?.length > 0

  const handleFileChange = useCallback(
    ({ file, isNewFile = true }: { file: File | null; isNewFile?: boolean }) => {
      if (isNewFile && file instanceof File) {
        setFileSrc(URL.createObjectURL(file))
      }

      setValue(file)
      setShowUrlInput(false)
      setUploadControlFileUrl('')
      setUploadControlFileName(null)
      setUploadControlFile(null)

      if (typeof onChange === 'function') {
        onChange(file)
      }
    },
    [onChange, setValue, setUploadControlFile, setUploadControlFileName, setUploadControlFileUrl],
  )

  const renameFile = (fileToChange: File, newName: string): File => {
    // Creating a new File object with updated properties
    const newFile = new File([fileToChange], newName, {
      type: fileToChange.type,
      lastModified: fileToChange.lastModified,
    })
    return newFile
  }

  const handleFileNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedFileName = e.target.value

      if (value) {
        handleFileChange({ file: renameFile(value, updatedFileName), isNewFile: false })
        setFilename(updatedFileName)
      }
    },
    [handleFileChange, value],
  )

  const handleFileSelection = useCallback(
    (files: FileList) => {
      const fileToUpload = files?.[0]
      handleFileChange({ file: fileToUpload })
    },
    [handleFileChange],
  )

  const handleFileRemoval = useCallback(() => {
    setRemovedFile(true)
    handleFileChange({ file: null })
    setFileSrc('')
    setFileUrl('')
    resetUploadEdits()
    setShowUrlInput(false)
    setUploadControlFileUrl('')
    setUploadControlFileName(null)
    setUploadControlFile(null)
  }, [
    handleFileChange,
    resetUploadEdits,
    setUploadControlFile,
    setUploadControlFileName,
    setUploadControlFileUrl,
  ])

  const onEditsSave = useCallback(
    (args: UploadEdits) => {
      setModified(true)
      updateUploadEdits(args)
    },
    [setModified, updateUploadEdits],
  )

  const handleUrlSubmit = useCallback(async () => {
    if (!fileUrl || uploadConfig?.pasteURL === false) {
      return
    }

    setUploadStatus('uploading')
    try {
      // Attempt client-side fetch
      const clientResponse = await fetch(fileUrl)

      if (!clientResponse.ok) {
        throw new Error(`Fetch failed with status: ${clientResponse.status}`)
      }

      const blob = await clientResponse.blob()
      const fileName = uploadControlFileName || decodeURIComponent(fileUrl.split('/').pop() || '')
      const file = new File([blob], fileName, { type: blob.type })

      handleFileChange({ file })
      setUploadStatus('idle')
      return // Exit if client-side fetch succeeds
    } catch (_clientError) {
      if (!useServerSideFetch) {
        // If server-side fetch is not enabled, show client-side error
        toast.error('Failed to fetch the file.')
        setUploadStatus('failed')
        return
      }
    }

    // Attempt server-side fetch if client-side fetch fails and useServerSideFetch is true
    try {
      const pasteURL = `/${collectionSlug}/paste-url${id ? `/${id}?` : '?'}src=${encodeURIComponent(fileUrl)}`
      const serverResponse = await fetch(`${serverURL}${api}${pasteURL}`)

      if (!serverResponse.ok) {
        throw new Error(`Fetch failed with status: ${serverResponse.status}`)
      }

      const blob = await serverResponse.blob()
      const fileName = decodeURIComponent(fileUrl.split('/').pop() || '')
      const file = new File([blob], fileName, { type: blob.type })

      handleFileChange({ file })
      setUploadStatus('idle')
    } catch (_serverError) {
      toast.error('The provided URL is not allowed.')
      setUploadStatus('failed')
    }
  }, [
    api,
    collectionSlug,
    fileUrl,
    handleFileChange,
    id,
    serverURL,
    setUploadStatus,
    uploadConfig,
    uploadControlFileName,
    useServerSideFetch,
  ])

  useEffect(() => {
    if (initialState?.file?.value instanceof File) {
      setFileSrc(URL.createObjectURL(initialState.file.value))
      setRemovedFile(false)
    }
  }, [initialState])

  useEffect(() => {
    if (showUrlInput && urlInputRef.current) {
      // urlInputRef.current.focus() // Focus on the remote-url input field when showUrlInput is true
    }
  }, [showUrlInput])

  useEffect(() => {
    if (isFormSubmitting) {
      setRemovedFile(false)
    }
  }, [isFormSubmitting])

  const canRemoveUpload = docPermissions?.update

  const hasImageSizes = uploadConfig?.imageSizes?.length > 0
  const hasResizeOptions = Boolean(uploadConfig?.resizeOptions)
  // Explicity check if set to true, default is undefined
  const focalPointEnabled = uploadConfig?.focalPoint === true

  const { crop: showCrop = true, focalPoint = true } = uploadConfig

  const showFocalPoint = focalPoint && (hasImageSizes || hasResizeOptions || focalPointEnabled)

  const acceptMimeTypes = uploadConfig.mimeTypes?.join(', ')

  const imageCacheTag = uploadConfig?.cacheTags && data?.updatedAt

  useEffect(() => {
    const handleControlFileUrl = async () => {
      if (uploadControlFileUrl) {
        setFileUrl(uploadControlFileUrl)
        await handleUrlSubmit()
      }
    }

    void handleControlFileUrl()
  }, [uploadControlFileUrl, handleUrlSubmit])

  useEffect(() => {
    const handleControlFile = () => {
      if (uploadControlFile) {
        handleFileChange({ file: uploadControlFile })
      }
    }

    void handleControlFile()
  }, [uploadControlFile, handleFileChange])

  return (
    <div className={[fieldBaseClass, baseClass].filter(Boolean).join(' ')}>
      <FieldError message={errorMessage} showError={showError} />
      {data && data.filename && !removedFile && (
        <FileDetails
          collectionSlug={collectionSlug}
          customUploadActions={customActions}
          doc={data}
          enableAdjustments={showCrop || showFocalPoint}
          handleRemove={canRemoveUpload ? handleFileRemoval : undefined}
          hasImageSizes={hasImageSizes}
          hideRemoveFile={uploadConfig.hideRemoveFile}
          imageCacheTag={imageCacheTag}
          uploadConfig={uploadConfig}
        />
      )}
      {((!uploadConfig.hideFileInputOnCreate && !data?.filename) || removedFile) && (
        <div className={`${baseClass}__upload`}>
          {!value && !showUrlInput && (
            <Dropzone onChange={handleFileSelection}>
              <div className={`${baseClass}__dropzoneContent`}>
                <div className={`${baseClass}__dropzoneButtons`}>
                  <Button
                    buttonStyle="pill"
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
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileSelection(e.target.files)
                      }
                    }}
                    ref={inputRef}
                    type="file"
                  />
                  {uploadConfig?.pasteURL !== false && (
                    <Fragment>
                      <span className={`${baseClass}__orText`}>{t('general:or')}</span>
                      <Button
                        buttonStyle="pill"
                        onClick={() => {
                          setShowUrlInput(true)
                          setUploadControlFileUrl('')
                          setUploadControlFile(null)
                          setUploadControlFileName(null)
                        }}
                        size="small"
                      >
                        {t('upload:pasteURL')}
                      </Button>
                    </Fragment>
                  )}

                  {UploadControls ? UploadControls : null}
                </div>
                <p className={`${baseClass}__dragAndDropText`}>
                  {t('general:or')} {t('upload:dragAndDrop')}
                </p>
              </div>
            </Dropzone>
          )}
          {showUrlInput && (
            <React.Fragment>
              <div className={`${baseClass}__remote-file-wrap`}>
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <input
                  className={`${baseClass}__remote-file`}
                  onChange={(e) => {
                    setFileUrl(e.target.value)
                  }}
                  ref={urlInputRef}
                  title={fileUrl}
                  type="text"
                  value={fileUrl}
                />
                <div className={`${baseClass}__add-file-wrap`}>
                  <button
                    className={`${baseClass}__add-file`}
                    onClick={() => {
                      void handleUrlSubmit()
                    }}
                    type="button"
                  >
                    {t('upload:addFile')}
                  </button>
                </div>
              </div>
              <Button
                buttonStyle="icon-label"
                className={`${baseClass}__remove`}
                icon="x"
                iconStyle="with-border"
                onClick={() => {
                  setShowUrlInput(false)
                  setUploadControlFileUrl('')
                  setUploadControlFile(null)
                  setUploadControlFileName(null)
                }}
                round
                tooltip={t('general:cancel')}
              />
            </React.Fragment>
          )}
          {value && fileSrc && (
            <React.Fragment>
              <div className={`${baseClass}__thumbnail-wrap`}>
                <Thumbnail
                  collectionSlug={collectionSlug}
                  fileSrc={isImage(value.type) ? fileSrc : null}
                />
              </div>
              <div className={`${baseClass}__file-adjustments`}>
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <input
                  className={`${baseClass}__filename`}
                  onChange={handleFileNameChange}
                  title={filename || value.name}
                  type="text"
                  value={filename || value.name}
                />
                <UploadActions
                  customActions={customActions}
                  enableAdjustments={showCrop || showFocalPoint}
                  enablePreviewSizes={hasImageSizes && data?.filename && !removedFile}
                  mimeType={value.type}
                />
              </div>
              <Button
                buttonStyle="icon-label"
                className={`${baseClass}__remove`}
                icon="x"
                iconStyle="with-border"
                onClick={handleFileRemoval}
                round
                tooltip={t('general:cancel')}
              />
            </React.Fragment>
          )}
        </div>
      )}
      {(value || data?.filename) && (
        <EditDepthProvider>
          <Drawer Header={null} slug={editDrawerSlug}>
            <EditUpload
              fileName={value?.name || data?.filename}
              fileSrc={data?.url || fileSrc}
              imageCacheTag={imageCacheTag}
              initialCrop={uploadEdits?.crop ?? undefined}
              initialFocalPoint={{
                x: uploadEdits?.focalPoint?.x || data?.focalX || 50,
                y: uploadEdits?.focalPoint?.y || data?.focalY || 50,
              }}
              onSave={onEditsSave}
              showCrop={showCrop}
              showFocalPoint={showFocalPoint}
            />
          </Drawer>
        </EditDepthProvider>
      )}
      {data && hasImageSizes && (
        <Drawer
          className={`${baseClass}__previewDrawer`}
          hoverTitle
          slug={sizePreviewSlug}
          title={t('upload:sizesFor', { label: data.filename })}
        >
          <PreviewSizes doc={data} imageCacheTag={imageCacheTag} uploadConfig={uploadConfig} />
        </Drawer>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ViewDescription/index.tsx
Signals: React

```typescript
'use client'
import type { DescriptionFunction, StaticDescription, ViewDescriptionClientProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { useTranslation } from '../../providers/Translation/index.js'

export type ViewDescriptionComponent = React.ComponentType<any>

type Description = DescriptionFunction | StaticDescription | string | ViewDescriptionComponent

export function isComponent(description: Description): description is ViewDescriptionComponent {
  return React.isValidElement(description)
}

export function ViewDescription(props: ViewDescriptionClientProps) {
  const { i18n } = useTranslation()
  const { description } = props

  if (description) {
    return <div className="custom-view-description">{getTranslation(description, i18n)}</div>
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: field-types.tsx]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/field-types.tsx

```typescript
'use client'

import type { ClientField } from 'payload'

const equalsOperators = [
  {
    label: 'equals',
    value: 'equals',
  },
  {
    label: 'isNotEqualTo',
    value: 'not_equals',
  },
]

export const arrayOperators = [
  {
    label: 'isIn',
    value: 'in',
  },
  {
    label: 'isNotIn',
    value: 'not_in',
  },
]

const exists = {
  label: 'exists',
  value: 'exists',
}

const base = [...equalsOperators, ...arrayOperators, exists]

const numeric = [
  ...base,
  {
    label: 'isGreaterThan',
    value: 'greater_than',
  },
  {
    label: 'isLessThan',
    value: 'less_than',
  },
  {
    label: 'isLessThanOrEqualTo',
    value: 'less_than_equal',
  },
  {
    label: 'isGreaterThanOrEqualTo',
    value: 'greater_than_equal',
  },
]

const geo = [
  ...equalsOperators,
  {
    label: 'near',
    value: 'near',
  },
]

const within = {
  label: 'within',
  value: 'within',
}

const intersects = {
  label: 'intersects',
  value: 'intersects',
}

const like = {
  label: 'isLike',
  value: 'like',
}

const notLike = {
  label: 'isNotLike',
  value: 'not_like',
}

const contains = {
  label: 'contains',
  value: 'contains',
}

export const fieldTypeConditions: {
  [key: string]: {
    component: string
    operators: { label: string; value: string }[]
  }
} = {
  checkbox: {
    component: 'Text',
    operators: [...equalsOperators, exists],
  },
  code: {
    component: 'Text',
    operators: [...base, like, notLike, contains],
  },
  date: {
    component: 'Date',
    operators: [...numeric, exists],
  },
  email: {
    component: 'Text',
    operators: [...base, contains],
  },
  json: {
    component: 'Text',
    operators: [...base, like, contains, notLike, within, intersects],
  },
  number: {
    component: 'Number',
    operators: [...numeric, exists],
  },
  point: {
    component: 'Point',
    operators: [...geo, exists, within, intersects],
  },
  radio: {
    component: 'Select',
    operators: [...base],
  },
  relationship: {
    component: 'Relationship',
    operators: [...base],
  },
  richText: {
    component: 'Text',
    operators: [...base, like, notLike, contains],
  },
  select: {
    component: 'Select',
    operators: [...base],
  },
  text: {
    component: 'Text',
    operators: [...base, like, notLike, contains],
  },
  textarea: {
    component: 'Text',
    operators: [...base, like, notLike, contains],
  },
  upload: {
    component: 'Relationship',
    operators: [...base],
  },
}

export const getValidFieldOperators = ({
  field,
  operator,
}: {
  field: ClientField
  operator?: string
}): {
  validOperator: string
  validOperators: {
    label: string
    value: string
  }[]
} => {
  let validOperators: {
    label: string
    value: string
  }[] = []

  if (field.type === 'relationship' && Array.isArray(field.relationTo)) {
    if ('hasMany' in field && field.hasMany) {
      validOperators = [...equalsOperators, exists]
    } else {
      validOperators = [...base]
    }
  } else {
    validOperators = [...fieldTypeConditions[field.type].operators]
  }

  return {
    validOperator:
      operator && validOperators.find(({ value }) => value === operator)
        ? operator
        : validOperators[0].value,
    validOperators,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .where-builder {
    background: var(--theme-elevation-50);
    padding: var(--base);
    display: flex;
    flex-direction: column;
    gap: calc(var(--base) / 2);

    .btn {
      margin: 0;
      align-self: flex-start;
    }

    &__no-filters {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 2);
    }

    &__or-filters,
    &__and-filters {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 2);

      li {
        display: flex;
        flex-direction: column;
        gap: calc(var(--base) / 2);
      }
    }

    @include small-break {
      padding: calc(var(--base) / 2);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/index.tsx
Signals: React

```typescript
'use client'
import type { Operator } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { transformWhereQuery, validateWhereQuery } from 'payload/shared'
import React, { useMemo } from 'react'

import type { AddCondition, RemoveCondition, UpdateCondition, WhereBuilderProps } from './types.js'

import { useAuth } from '../../providers/Auth/index.js'
import { useListQuery } from '../../providers/ListQuery/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { reduceFieldsToOptions } from '../../utilities/reduceFieldsToOptions.js'
import { Button } from '../Button/index.js'
import { Condition } from './Condition/index.js'
import { fieldTypeConditions, getValidFieldOperators } from './field-types.js'
import './index.scss'

const baseClass = 'where-builder'

export { WhereBuilderProps }

/**
 * The WhereBuilder component is used to render the filter controls for a collection's list view.
 * It is part of the {@link ListControls} component which is used to render the controls (search, filter, where).
 */
export const WhereBuilder: React.FC<WhereBuilderProps> = (props) => {
  const { collectionPluralLabel, collectionSlug, fields, renderedFilters, resolvedFilterOptions } =
    props
  const { i18n, t } = useTranslation()
  const { permissions } = useAuth()

  const fieldPermissions = permissions?.collections?.[collectionSlug]?.fields

  const reducedFields = useMemo(
    () =>
      reduceFieldsToOptions({
        fieldPermissions,
        fields,
        i18n,
      }),
    [fieldPermissions, fields, i18n],
  )

  const { handleWhereChange, query } = useListQuery()

  const conditions = useMemo(() => {
    const whereFromSearch = query.where

    if (whereFromSearch) {
      if (validateWhereQuery(whereFromSearch)) {
        return whereFromSearch.or
      }

      // Transform the where query to be in the right format. This will transform something simple like [text][equals]=example%20post to the right format
      const transformedWhere = transformWhereQuery(whereFromSearch)

      if (validateWhereQuery(transformedWhere)) {
        return transformedWhere.or
      }

      console.warn(`Invalid where query in URL: ${JSON.stringify(whereFromSearch)}`) // eslint-disable-line no-console
    }

    return []
  }, [query.where])

  const addCondition: AddCondition = React.useCallback(
    async ({ andIndex, field, orIndex, relation }) => {
      const newConditions = [...conditions]

      const defaultOperator = fieldTypeConditions[field.field.type].operators[0].value

      if (relation === 'and') {
        newConditions[orIndex].and.splice(andIndex, 0, {
          [String(field.value)]: {
            [defaultOperator]: undefined,
          },
        })
      } else {
        newConditions.push({
          and: [
            {
              [String(field.value)]: {
                [defaultOperator]: undefined,
              },
            },
          ],
        })
      }

      await handleWhereChange({ or: newConditions })
    },
    [conditions, handleWhereChange],
  )

  const updateCondition: UpdateCondition = React.useCallback(
    async ({ andIndex, field, operator: incomingOperator, orIndex, value }) => {
      const existingCondition = conditions[orIndex].and[andIndex]

      if (typeof existingCondition === 'object' && field.value) {
        const { validOperator } = getValidFieldOperators({
          field: field.field,
          operator: incomingOperator,
        })
        const newRowCondition = {
          [String(field.value)]: { [validOperator]: value },
        }

        const newConditions = [...conditions]
        newConditions[orIndex].and[andIndex] = newRowCondition
        await handleWhereChange({ or: newConditions })
      }
    },
    [conditions, handleWhereChange],
  )

  const removeCondition: RemoveCondition = React.useCallback(
    async ({ andIndex, orIndex }) => {
      const newConditions = [...conditions]
      newConditions[orIndex].and.splice(andIndex, 1)

      if (newConditions[orIndex].and.length === 0) {
        newConditions.splice(orIndex, 1)
      }

      await handleWhereChange({ or: newConditions })
    },
    [conditions, handleWhereChange],
  )

  return (
    <div className={baseClass}>
      {conditions.length > 0 && (
        <React.Fragment>
          <p className={`${baseClass}__label`}>
            {t('general:filterWhere', { label: getTranslation(collectionPluralLabel, i18n) })}
          </p>
          <ul className={`${baseClass}__or-filters`}>
            {conditions.map((or, orIndex) => {
              const compoundOrKey = `${orIndex}_${Array.isArray(or?.and) ? or.and.length : ''}`

              return (
                <li key={compoundOrKey}>
                  {orIndex !== 0 && <div className={`${baseClass}__label`}>{t('general:or')}</div>}
                  <ul className={`${baseClass}__and-filters`}>
                    {Array.isArray(or?.and) &&
                      or.and.map((_, andIndex) => {
                        const condition = conditions[orIndex].and[andIndex]
                        const fieldPath = Object.keys(condition)[0]

                        const operator =
                          (Object.keys(condition?.[fieldPath] || {})?.[0] as Operator) || undefined

                        const value = condition?.[fieldPath]?.[operator] || undefined

                        return (
                          <li key={andIndex}>
                            {andIndex !== 0 && (
                              <div className={`${baseClass}__label`}>{t('general:and')}</div>
                            )}
                            <Condition
                              addCondition={addCondition}
                              andIndex={andIndex}
                              fieldPath={fieldPath}
                              filterOptions={resolvedFilterOptions?.get(fieldPath)}
                              operator={operator}
                              orIndex={orIndex}
                              reducedFields={reducedFields}
                              removeCondition={removeCondition}
                              RenderedFilter={renderedFilters?.get(fieldPath)}
                              updateCondition={updateCondition}
                              value={value}
                            />
                          </li>
                        )
                      })}
                  </ul>
                </li>
              )
            })}
          </ul>
          <Button
            buttonStyle="icon-label"
            className={`${baseClass}__add-or`}
            icon="plus"
            iconPosition="left"
            iconStyle="with-border"
            onClick={async () => {
              await addCondition({
                andIndex: 0,
                field: reducedFields.find((field) => !field.field.admin?.disableListFilter),
                orIndex: conditions.length,
                relation: 'or',
              })
            }}
          >
            {t('general:or')}
          </Button>
        </React.Fragment>
      )}
      {conditions.length === 0 && (
        <div className={`${baseClass}__no-filters`}>
          <div className={`${baseClass}__label`}>{t('general:noFiltersSet')}</div>
          <Button
            buttonStyle="icon-label"
            className={`${baseClass}__add-first-filter`}
            icon="plus"
            iconPosition="left"
            iconStyle="with-border"
            onClick={async () => {
              if (reducedFields.length > 0) {
                await addCondition({
                  andIndex: 0,
                  field: reducedFields.find((field) => !field.field.admin?.disableListFilter),
                  orIndex: conditions.length,
                  relation: 'or',
                })
              }
            }}
          >
            {t('general:addFilter')}
          </Button>
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/types.ts

```typescript
import type {
  ClientField,
  Operator,
  ResolvedFilterOptions,
  SanitizedCollectionConfig,
  Where,
} from 'payload'

export type WhereBuilderProps = {
  readonly collectionPluralLabel: SanitizedCollectionConfig['labels']['plural']
  readonly collectionSlug: SanitizedCollectionConfig['slug']
  readonly fields?: ClientField[]
  readonly renderedFilters?: Map<string, React.ReactNode>
  readonly resolvedFilterOptions?: Map<string, ResolvedFilterOptions>
}

export type Value = Date | number | number[] | string | string[]

export type ReducedField = {
  field: ClientField
  label: React.ReactNode
  operators: {
    label: string
    value: Operator
  }[]
  plainTextLabel?: string
  value: Value
}

export type Relation = 'and' | 'or'

export type ADD = {
  andIndex?: number
  field: string
  orIndex?: number
  relation?: Relation
  type: 'add'
}

export type REMOVE = {
  andIndex: number
  orIndex: number
  type: 'remove'
}

export type UPDATE = {
  andIndex: number
  field?: string
  operator?: string
  orIndex: number
  type: 'update'
  value?: unknown
}

export type Action = ADD | REMOVE | UPDATE

export type State = {
  or: Where[]
}

export type AddCondition = ({
  andIndex,
  field,
  orIndex,
  relation,
}: {
  andIndex: number
  field: ReducedField
  orIndex: number
  relation: 'and' | 'or'
}) => Promise<void> | void

export type UpdateCondition = ({
  type,
  andIndex,
  field,
  operator,
  orIndex,
  value,
}: {
  andIndex: number
  field: ReducedField
  operator: string
  orIndex: number
  type: 'field' | 'operator' | 'value'
  value: Value
}) => Promise<void> | void

export type RemoveCondition = ({
  andIndex,
  orIndex,
}: {
  andIndex: number
  orIndex: number
}) => Promise<void> | void
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .condition {
    &__wrap {
      display: flex;
      align-items: center;
      gap: var(--base);
    }

    &__inputs {
      display: flex;
      flex-grow: 1;
      align-items: center;
      gap: var(--base);

      > div {
        flex-basis: 100%;
      }
    }

    &__field {
      .field-label {
        padding-bottom: 0;
      }
    }

    &__actions {
      flex-shrink: 0;
      display: flex;
      gap: calc(var(--base) / 2);
      padding: calc(var(--base) / 2) 0;
    }

    .btn {
      vertical-align: middle;
      margin: 0;
    }

    @include mid-break {
      &__wrap {
        align-items: initial;
        gap: calc(var(--base) / 2);
      }

      &__inputs {
        flex-direction: column;
        gap: calc(var(--base) / 2);
        align-items: stretch;
      }

      &__actions {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
