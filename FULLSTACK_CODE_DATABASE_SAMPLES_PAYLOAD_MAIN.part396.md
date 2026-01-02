---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 396
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 396 of 695)

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

---[FILE: Input.tsx]---
Location: payload-main/packages/ui/src/fields/Upload/Input.tsx
Signals: React

```typescript
'use client'

import type {
  ClientCollectionConfig,
  FieldLabelClientProps,
  FilterOptionsResult,
  JsonObject,
  StaticDescription,
  StaticLabel,
  UploadFieldClient,
  UploadField as UploadFieldType,
  ValueWithRelation,
} from 'payload'
import type { MarkOptional } from 'ts-essentials'

import { useModal } from '@faceless-ui/modal'
import * as qs from 'qs-esm'
import React, { useCallback, useEffect, useMemo } from 'react'

import type { ListDrawerProps } from '../../elements/ListDrawer/types.js'
import type { ReloadDoc, ValueAsDataWithRelation } from './types.js'

import { type BulkUploadContext, useBulkUpload } from '../../elements/BulkUpload/index.js'
import { Button } from '../../elements/Button/index.js'
import { useDocumentDrawer } from '../../elements/DocumentDrawer/index.js'
import { Dropzone } from '../../elements/Dropzone/index.js'
import { useListDrawer } from '../../elements/ListDrawer/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { ShimmerEffect } from '../../elements/ShimmerEffect/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useAuth } from '../../providers/Auth/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { normalizeRelationshipValue } from '../../utilities/normalizeRelationshipValue.js'
import { fieldBaseClass } from '../shared/index.js'
import { UploadComponentHasMany } from './HasMany/index.js'
import { UploadComponentHasOne } from './HasOne/index.js'
import './index.scss'

export const baseClass = 'upload'

type PopulatedDocs = { relationTo: string; value: JsonObject }[]

export type UploadInputProps = {
  readonly AfterInput?: React.ReactNode
  readonly allowCreate?: boolean
  /**
   * Controls the visibility of the "Create new collection" button
   */
  readonly api?: string
  readonly BeforeInput?: React.ReactNode
  readonly className?: string
  readonly collection?: ClientCollectionConfig
  readonly customUploadActions?: React.ReactNode[]
  readonly Description?: React.ReactNode
  readonly description?: StaticDescription
  readonly displayPreview?: boolean
  readonly Error?: React.ReactNode
  readonly filterOptions?: FilterOptionsResult
  readonly hasMany?: boolean
  readonly hideRemoveFile?: boolean
  readonly isSortable?: boolean
  readonly Label?: React.ReactNode
  readonly label?: StaticLabel
  readonly labelProps?: FieldLabelClientProps<MarkOptional<UploadFieldClient, 'type'>>
  readonly localized?: boolean
  readonly maxRows?: number
  readonly onChange?: (e) => void
  readonly path: string
  readonly readOnly?: boolean
  readonly relationTo: UploadFieldType['relationTo']
  readonly required?: boolean
  readonly serverURL?: string
  readonly showError?: boolean
  readonly style?: React.CSSProperties
  readonly value?: (number | string)[] | number | string | ValueWithRelation | ValueWithRelation[]
}

export function UploadInput(props: UploadInputProps) {
  const {
    AfterInput,
    allowCreate,
    api,
    BeforeInput,
    className,
    Description,
    description,
    displayPreview,
    Error,
    filterOptions: filterOptionsFromProps,
    hasMany,
    isSortable,
    Label,
    label,
    localized,
    maxRows,
    onChange: onChangeFromProps,
    path,
    readOnly,
    relationTo,
    required,
    serverURL,
    showError,
    style,
    value,
  } = props

  const [populatedDocs, setPopulatedDocs] = React.useState<
    {
      relationTo: string
      value: JsonObject
    }[]
  >()

  const [activeRelationTo] = React.useState<string>(
    Array.isArray(relationTo) ? relationTo[0] : relationTo,
  )

  const { openModal } = useModal()
  const {
    drawerSlug,
    setCollectionSlug,
    setInitialFiles,
    setMaxFiles,
    setOnSuccess,
    setSelectableCollections,
  } = useBulkUpload()
  const { permissions } = useAuth()
  const { code } = useLocale()
  const { i18n, t } = useTranslation()

  // This will be used by the bulk upload to allow you to select only collections you have create permissions for
  const collectionSlugsWithCreatePermission = useMemo(() => {
    if (Array.isArray(relationTo)) {
      return relationTo.filter(
        (relation) => permissions?.collections && permissions.collections?.[relation]?.create,
      )
    }
    return []
  }, [relationTo, permissions])

  const filterOptions: FilterOptionsResult = useMemo(() => {
    const isPoly = Array.isArray(relationTo)

    if (!value) {
      return filterOptionsFromProps
    }

    // Group existing IDs by relation
    const existingIdsByRelation: Record<string, (number | string)[]> = {}

    const values = Array.isArray(value) ? value : [value]

    for (const val of values) {
      if (isPoly && typeof val === 'object' && 'relationTo' in val) {
        // Poly upload - group by relationTo
        if (!existingIdsByRelation[val.relationTo]) {
          existingIdsByRelation[val.relationTo] = []
        }
        existingIdsByRelation[val.relationTo].push(val.value)
      } else if (!isPoly) {
        // Non-poly upload - all IDs belong to the single collection
        const collection = relationTo
        if (!existingIdsByRelation[collection]) {
          existingIdsByRelation[collection] = []
        }
        const id = typeof val === 'object' && 'value' in val ? val.value : val
        if (typeof id === 'string' || typeof id === 'number') {
          existingIdsByRelation[collection].push(id)
        }
      }
    }

    // Build filter options for each collection
    const newFilterOptions = { ...filterOptionsFromProps }
    const relations = isPoly ? relationTo : [relationTo]

    relations.forEach((relation) => {
      const existingIds = existingIdsByRelation[relation] || []

      newFilterOptions[relation] = {
        ...((filterOptionsFromProps?.[relation] as any) || {}),
        id: {
          ...((filterOptionsFromProps?.[relation] as any)?.id || {}),
          not_in: ((filterOptionsFromProps?.[relation] as any)?.id?.not_in || []).concat(
            existingIds,
          ),
        },
      }
    })

    return newFilterOptions
  }, [value, filterOptionsFromProps, relationTo])

  const [ListDrawer, , { closeDrawer: closeListDrawer, openDrawer: openListDrawer }] =
    useListDrawer({
      collectionSlugs: typeof relationTo === 'string' ? [relationTo] : relationTo,
      filterOptions,
    })

  const [
    CreateDocDrawer,
    ,
    { closeDrawer: closeCreateDocDrawer, openDrawer: openCreateDocDrawer },
  ] = useDocumentDrawer({
    collectionSlug: activeRelationTo,
  })

  /**
   * Track the last loaded value to prevent unnecessary reloads
   */
  const loadedValueRef = React.useRef<
    (number | string)[] | null | number | string | ValueWithRelation | ValueWithRelation[]
  >(null)

  const canCreate = useMemo(() => {
    if (!allowCreate) {
      return false
    }

    if (typeof activeRelationTo === 'string') {
      if (permissions?.collections && permissions.collections?.[activeRelationTo]?.create) {
        return true
      }
    }

    return false
  }, [activeRelationTo, permissions, allowCreate])

  const onChange = React.useCallback(
    (newValue) => {
      if (typeof onChangeFromProps === 'function') {
        onChangeFromProps(newValue)
      }
    },
    [onChangeFromProps],
  )

  const populateDocs = React.useCallback(
    async (items: ValueWithRelation[]): Promise<ValueAsDataWithRelation[]> => {
      if (!items?.length) {
        return []
      }

      // 1. Group IDs by collection
      const grouped: Record<string, (number | string)[]> = {}
      items.forEach(({ relationTo, value }) => {
        if (!grouped[relationTo]) {
          grouped[relationTo] = []
        }
        // Ensure we extract the actual ID value, not an object
        let idValue: number | string = value

        if (value && typeof value === 'object' && 'value' in (value as any)) {
          idValue = (value as any).value
        }

        grouped[relationTo].push(idValue)
      })

      // 2. Fetch per collection
      const fetches = Object.entries(grouped).map(async ([collection, ids]) => {
        const query = {
          depth: 0,
          draft: true,
          limit: ids.length,
          locale: code,
          where: {
            and: [
              {
                id: {
                  in: ids,
                },
              },
            ],
          },
        }
        const response = await fetch(`${serverURL}${api}/${collection}`, {
          body: qs.stringify(query),
          credentials: 'include',
          headers: {
            'Accept-Language': i18n.language,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Payload-HTTP-Method-Override': 'GET',
          },
          method: 'POST',
        })
        let docs: any[] = []
        if (response.ok) {
          const data = await response.json()
          docs = data.docs
        }
        // Map docs by ID for fast lookup
        const docsById = docs.reduce((acc, doc) => {
          acc[doc.id] = doc
          return acc
        }, {})
        return { collection, docsById }
      })

      const results = await Promise.all(fetches)

      // 3. Build lookup
      const lookup: Record<string, Record<string, any>> = {}
      results.forEach(({ collection, docsById }) => {
        lookup[collection] = docsById
      })

      // 4. Reconstruct in input order, add placeholders if missing
      const sortedDocs = items.map(({ relationTo, value }) => {
        const doc = lookup[relationTo]?.[value] || {
          id: value,
          filename: `${t('general:untitled')} - ID: ${value}`,
          isPlaceholder: true,
        }
        return { relationTo, value: doc }
      })

      return sortedDocs
    },
    [serverURL, api, code, i18n.language, t],
  )

  const normalizeValue = useCallback(
    (value: any): any => normalizeRelationshipValue(value, relationTo),
    [relationTo],
  )

  const onUploadSuccess: BulkUploadContext['onSuccess'] = useCallback(
    (uploadedForms) => {
      const isPoly = Array.isArray(relationTo)

      if (hasMany) {
        const newValues = uploadedForms.map((form) =>
          isPoly ? { relationTo: form.collectionSlug, value: form.doc.id } : form.doc.id,
        )
        // Normalize existing values before merging
        const normalizedExisting = Array.isArray(value) ? value.map(normalizeValue) : []
        const mergedValue = [...normalizedExisting, ...newValues]
        onChange(mergedValue)
        setPopulatedDocs((currentDocs) => [
          ...(currentDocs || []),
          ...uploadedForms.map((form) => ({
            relationTo: form.collectionSlug,
            value: form.doc,
          })),
        ])
      } else {
        const firstDoc = uploadedForms[0]
        const newValue = isPoly
          ? { relationTo: firstDoc.collectionSlug, value: firstDoc.doc.id }
          : firstDoc.doc.id
        onChange(newValue)
        setPopulatedDocs([
          {
            relationTo: firstDoc.collectionSlug,
            value: firstDoc.doc,
          },
        ])
      }
    },
    [value, onChange, hasMany, relationTo, normalizeValue],
  )

  const onLocalFileSelection = React.useCallback(
    (fileList?: FileList) => {
      let fileListToUse = fileList
      if (!hasMany && fileList && fileList.length > 1) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(fileList[0])
        fileListToUse = dataTransfer.files
      }
      if (fileListToUse) {
        setInitialFiles(fileListToUse)
      }
      // Use activeRelationTo for poly uploads, or relationTo as string for single collection
      const collectionToUse = Array.isArray(relationTo) ? activeRelationTo : relationTo

      setCollectionSlug(collectionToUse)
      if (Array.isArray(collectionSlugsWithCreatePermission)) {
        setSelectableCollections(collectionSlugsWithCreatePermission)
      }

      if (typeof maxRows === 'number') {
        setMaxFiles(maxRows)
      }

      openModal(drawerSlug)
    },
    [
      hasMany,
      relationTo,
      activeRelationTo,
      setCollectionSlug,
      collectionSlugsWithCreatePermission,
      maxRows,
      openModal,
      drawerSlug,
      setInitialFiles,
      setSelectableCollections,
      setMaxFiles,
    ],
  )

  // only hasMany can bulk select
  const onListBulkSelect = React.useCallback<NonNullable<ListDrawerProps['onBulkSelect']>>(
    async (docs) => {
      const isPoly = Array.isArray(relationTo)
      const selectedDocIDs = []

      for (const [id, isSelected] of docs) {
        if (isSelected) {
          selectedDocIDs.push(id)
        }
      }

      const itemsToLoad = selectedDocIDs.map((id) => ({
        relationTo: activeRelationTo,
        value: id,
      }))

      const loadedDocs = await populateDocs(itemsToLoad)
      if (loadedDocs) {
        setPopulatedDocs((currentDocs) => [...(currentDocs || []), ...loadedDocs])
      }

      const newValues = selectedDocIDs.map((id) =>
        isPoly ? { relationTo: activeRelationTo, value: id } : id,
      )
      // Normalize existing values before merging
      const normalizedExisting = Array.isArray(value) ? value.map(normalizeValue) : []
      onChange([...normalizedExisting, ...newValues])
      closeListDrawer()
    },
    [activeRelationTo, closeListDrawer, onChange, populateDocs, value, relationTo, normalizeValue],
  )

  const onDocCreate = React.useCallback(
    (data) => {
      const isPoly = Array.isArray(relationTo)
      if (data.doc) {
        setPopulatedDocs((currentDocs) => [
          ...(currentDocs || []),
          {
            relationTo: activeRelationTo,
            value: data.doc,
          },
        ])

        const newValue = isPoly ? { relationTo: activeRelationTo, value: data.doc.id } : data.doc.id
        onChange(newValue)
      }
      closeCreateDocDrawer()
    },
    [closeCreateDocDrawer, activeRelationTo, onChange, relationTo],
  )

  const onListSelect = useCallback<NonNullable<ListDrawerProps['onSelect']>>(
    async ({ collectionSlug, doc }) => {
      const isPoly = Array.isArray(relationTo)

      const loadedDocs = await populateDocs([{ relationTo: collectionSlug, value: doc.id }])
      const selectedDoc = loadedDocs?.[0] || null

      setPopulatedDocs((currentDocs) => {
        if (selectedDoc) {
          if (hasMany) {
            return [...(currentDocs || []), selectedDoc]
          }
          return [selectedDoc]
        }
        return currentDocs
      })

      if (hasMany) {
        const newValue = isPoly ? { relationTo: collectionSlug, value: doc.id } : doc.id
        // Normalize existing values before merging
        const normalizedExisting = Array.isArray(value) ? value.map(normalizeValue) : []
        const valueToUse = [...normalizedExisting, newValue]
        onChange(valueToUse)
      } else {
        const valueToUse = isPoly ? { relationTo: collectionSlug, value: doc.id } : doc.id
        onChange(valueToUse)
      }
      closeListDrawer()
    },
    [closeListDrawer, hasMany, populateDocs, onChange, value, relationTo, normalizeValue],
  )

  const reloadDoc = React.useCallback<ReloadDoc>(
    async (docID, collectionSlug) => {
      const docs = await populateDocs([{ relationTo: collectionSlug, value: docID }])

      if (docs[0]) {
        let updatedDocsToPropogate = []
        setPopulatedDocs((currentDocs) => {
          const existingDocIndex = currentDocs?.findIndex((doc) => {
            const hasExisting = doc.value?.id === docs[0].value.id || doc.value?.isPlaceholder
            return hasExisting && doc.relationTo === collectionSlug
          })
          if (existingDocIndex > -1) {
            const updatedDocs = [...currentDocs]
            updatedDocs[existingDocIndex] = docs[0]
            updatedDocsToPropogate = updatedDocs
            return updatedDocs
          }
          return currentDocs
        })

        if (updatedDocsToPropogate.length && hasMany) {
          onChange(updatedDocsToPropogate.map((doc) => doc.value?.id))
        }
      }
    },
    [populateDocs, onChange, hasMany],
  )

  // only hasMany can reorder
  const onReorder = React.useCallback(
    (newValue) => {
      const isPoly = Array.isArray(relationTo)
      const newValueToSave = newValue.map(({ relationTo: rel, value }) =>
        isPoly ? { relationTo: rel, value: value.id } : value.id,
      )
      onChange(newValueToSave)
      setPopulatedDocs(newValue)
    },
    [onChange, relationTo],
  )

  const onRemove = React.useCallback(
    (newValue?: PopulatedDocs) => {
      const isPoly = Array.isArray(relationTo)

      if (!newValue || newValue.length === 0) {
        onChange(hasMany ? [] : null)
        setPopulatedDocs(hasMany ? [] : null)
        return
      }

      const newValueToSave = newValue.map(({ relationTo: rel, value }) =>
        isPoly ? { relationTo: rel, value: value.id } : value.id,
      )

      onChange(hasMany ? newValueToSave : newValueToSave[0])
      setPopulatedDocs(newValue)
    },
    [onChange, hasMany, relationTo],
  )

  useEffect(() => {
    async function loadInitialDocs() {
      if (value) {
        let itemsToLoad: ValueWithRelation[] = []
        if (
          Array.isArray(relationTo) &&
          ((typeof value === 'object' && 'relationTo' in value) ||
            (Array.isArray(value) &&
              value.length > 0 &&
              typeof value[0] === 'object' &&
              'relationTo' in value[0]))
        ) {
          // For poly uploads, value should already be in the format { relationTo, value }
          const values = Array.isArray(value) ? value : [value]
          itemsToLoad = values
            .filter((v): v is ValueWithRelation => typeof v === 'object' && 'relationTo' in v)
            .map((v) => {
              // Ensure the value property is a simple ID, not nested
              let idValue: any = v.value
              while (
                idValue &&
                typeof idValue === 'object' &&
                idValue !== null &&
                'value' in idValue
              ) {
                idValue = idValue.value
              }
              return {
                relationTo: v.relationTo,
                value: idValue as number | string,
              }
            })
        } else {
          // This check is here to satisfy TypeScript that relationTo is a string
          if (!Array.isArray(relationTo)) {
            // For single collection uploads, we need to wrap the IDs
            const ids = Array.isArray(value) ? value : [value]
            itemsToLoad = ids.map((id): ValueWithRelation => {
              // Extract the actual ID, handling nested objects
              let idValue: any = id
              while (
                idValue &&
                typeof idValue === 'object' &&
                idValue !== null &&
                'value' in idValue
              ) {
                idValue = idValue.value
              }
              return {
                relationTo,
                value: idValue as number | string,
              }
            })
          }
        }

        if (itemsToLoad.length > 0) {
          const loadedDocs = await populateDocs(itemsToLoad)

          if (loadedDocs) {
            setPopulatedDocs(loadedDocs)
            loadedValueRef.current = value
          }
        }
      } else {
        // Clear populated docs when value is cleared
        setPopulatedDocs([])
        loadedValueRef.current = null
      }
    }

    // Only load if value has changed from what we last loaded
    const valueChanged = loadedValueRef.current !== value
    if (valueChanged) {
      void loadInitialDocs()
    }
  }, [populateDocs, value, relationTo])

  useEffect(() => {
    setOnSuccess(onUploadSuccess)
  }, [value, path, onUploadSuccess, setOnSuccess])

  const showDropzone =
    !value ||
    (hasMany && Array.isArray(value) && (typeof maxRows !== 'number' || value.length < maxRows)) ||
    (!hasMany && populatedDocs?.[0] && typeof populatedDocs[0].value === 'undefined')

  return (
    <div
      className={[
        fieldBaseClass,
        baseClass,
        className,
        showError && 'error',
        readOnly && 'read-only',
      ]
        .filter(Boolean)
        .join(' ')}
      id={`field-${path?.replace(/\./g, '__')}`}
      style={style}
    >
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={
          <FieldLabel label={label} localized={localized} path={path} required={required} />
        }
      />
      <div className={`${baseClass}__wrap`}>
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
      </div>
      {BeforeInput}
      <div className={`${baseClass}__dropzoneAndUpload`}>
        {hasMany && Array.isArray(value) && value.length > 0 ? (
          <>
            {populatedDocs && populatedDocs?.length > 0 ? (
              <UploadComponentHasMany
                displayPreview={displayPreview}
                fileDocs={populatedDocs}
                isSortable={isSortable && !readOnly}
                onRemove={onRemove}
                onReorder={onReorder}
                readonly={readOnly}
                reloadDoc={reloadDoc}
                serverURL={serverURL}
                showCollectionSlug={Array.isArray(relationTo)}
              />
            ) : (
              <div className={`${baseClass}__loadingRows`}>
                {value.map((id) => (
                  <ShimmerEffect height="40px" key={typeof id === 'object' ? id.value : id} />
                ))}
              </div>
            )}
          </>
        ) : null}
        {!hasMany && value ? (
          <>
            {populatedDocs && populatedDocs?.length > 0 && populatedDocs[0].value ? (
              <UploadComponentHasOne
                displayPreview={displayPreview}
                fileDoc={populatedDocs[0]}
                onRemove={onRemove}
                readonly={readOnly}
                reloadDoc={reloadDoc}
                serverURL={serverURL}
                showCollectionSlug={Array.isArray(relationTo)}
              />
            ) : populatedDocs && value && !populatedDocs?.[0]?.value ? (
              <>
                {t('general:untitled')} - ID: {value}
              </>
            ) : (
              <ShimmerEffect height="62px" />
            )}
          </>
        ) : null}
        {showDropzone ? (
          <Dropzone
            disabled={readOnly || !canCreate}
            multipleFiles={hasMany}
            onChange={onLocalFileSelection}
          >
            <div className={`${baseClass}__dropzoneContent`}>
              <div className={`${baseClass}__dropzoneContent__buttons`}>
                {canCreate && (
                  <>
                    <Button
                      buttonStyle="pill"
                      className={`${baseClass}__createNewToggler`}
                      disabled={readOnly || !canCreate}
                      onClick={() => {
                        if (!readOnly) {
                          if (hasMany) {
                            onLocalFileSelection()
                          } else {
                            openCreateDocDrawer()
                          }
                        }
                      }}
                      size="small"
                    >
                      {t('general:createNew')}
                    </Button>
                    <span className={`${baseClass}__dropzoneContent__orText`}>
                      {t('general:or')}
                    </span>
                  </>
                )}
                <Button
                  buttonStyle="pill"
                  className={`${baseClass}__listToggler`}
                  disabled={readOnly}
                  onClick={openListDrawer}
                  size="small"
                >
                  {t('fields:chooseFromExisting')}
                </Button>
                <CreateDocDrawer onSave={onDocCreate} />
                <ListDrawer
                  allowCreate={canCreate}
                  enableRowSelections={hasMany}
                  onBulkSelect={onListBulkSelect}
                  onSelect={onListSelect}
                />
              </div>

              {canCreate && !readOnly && (
                <p className={`${baseClass}__dragAndDropText`}>
                  {t('general:or')} {t('upload:dragAndDrop')}
                </p>
              )}
            </div>
          </Dropzone>
        ) : (
          <>
            {!readOnly &&
            !populatedDocs &&
            (!value ||
              typeof maxRows !== 'number' ||
              (Array.isArray(value) && value.length < maxRows)) ? (
              <ShimmerEffect height="40px" />
            ) : null}
          </>
        )}
      </div>
      {AfterInput}
      <RenderCustomComponent
        CustomComponent={Description}
        Fallback={<FieldDescription description={description} path={path} />}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/fields/Upload/types.ts

```typescript
import type { PaginatedDocs, ValueWithRelation } from 'payload'

export type ValueAsDataWithRelation = {
  relationTo: string
  value: any
}

type PopulateDocsDeprecated = (
  ids: (number | string)[],
  items: never,
  collectionSlug?: string, // kept for compatibility, not used
) => Promise<null | PaginatedDocs>

type PopulateDocsNew = (
  items: ValueWithRelation[],
  ids: never,
  collectionSlug: never,
) => Promise<null | ValueAsDataWithRelation[]>

export type PopulateDocs = PopulateDocsDeprecated | PopulateDocsNew

export type ReloadDoc = (doc: number | string, collectionSlug: string) => Promise<void>
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Upload/HasMany/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .upload--has-many {
    position: relative;
    max-width: 100%;

    &__drag {
      &[aria-disabled='true'] {
        &:hover {
          cursor: default;
        }
      }
    }

    &__draggable-rows {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 4);
    }

    &__dragItem {
      .icon--drag-handle {
        color: var(--theme-elevation-400);
      }

      .thumbnail {
        width: 26px;
        height: 26px;
      }

      .uploadDocRelationshipContent__details {
        line-height: 1.2;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Upload/HasMany/index.tsx
Signals: React

```typescript
'use client'
import type { JsonObject } from 'payload'

import React from 'react'

import { DraggableSortableItem } from '../../../elements/DraggableSortable/DraggableSortableItem/index.js'
import { DraggableSortable } from '../../../elements/DraggableSortable/index.js'
import { DragHandleIcon } from '../../../icons/DragHandle/index.js'
import { RelationshipContent } from '../RelationshipContent/index.js'
import { UploadCard } from '../UploadCard/index.js'

const baseClass = 'upload upload--has-many'

import { getBestFitFromSizes, isImage } from 'payload/shared'

import './index.scss'

import type { ReloadDoc } from '../types.js'

type Props = {
  readonly className?: string
  readonly displayPreview?: boolean
  readonly fileDocs: {
    relationTo: string
    value: JsonObject
  }[]
  readonly isSortable?: boolean
  readonly onRemove?: (value) => void
  readonly onReorder?: (value) => void
  readonly readonly?: boolean
  readonly reloadDoc: ReloadDoc
  readonly serverURL: string
  readonly showCollectionSlug?: boolean
}

export function UploadComponentHasMany(props: Props) {
  const {
    className,
    displayPreview,
    fileDocs,
    isSortable,
    onRemove,
    onReorder,
    readonly,
    reloadDoc,
    serverURL,
    showCollectionSlug = false,
  } = props

  const moveRow = React.useCallback(
    (moveFromIndex: number, moveToIndex: number) => {
      if (moveFromIndex === moveToIndex) {
        return
      }

      const updatedArray = [...fileDocs]
      const [item] = updatedArray.splice(moveFromIndex, 1)

      updatedArray.splice(moveToIndex, 0, item)

      onReorder(updatedArray)
    },
    [fileDocs, onReorder],
  )

  const removeItem = React.useCallback(
    (index: number) => {
      const updatedArray = [...(fileDocs || [])]
      updatedArray.splice(index, 1)
      onRemove(updatedArray.length === 0 ? [] : updatedArray)
    },
    [fileDocs, onRemove],
  )

  return (
    <div className={[baseClass, className].filter(Boolean).join(' ')}>
      <DraggableSortable
        className={`${baseClass}__draggable-rows`}
        ids={fileDocs?.map(({ value }) => String(value.id))}
        onDragEnd={({ moveFromIndex, moveToIndex }) => moveRow(moveFromIndex, moveToIndex)}
      >
        {fileDocs.map(({ relationTo, value }, index) => {
          const id = String(value.id)
          let src: string
          let thumbnailSrc: string

          if (value.url) {
            try {
              src = new URL(value.url, serverURL).toString()
            } catch {
              src = `${serverURL}${value.url}`
            }
          }

          if (value.thumbnailURL) {
            try {
              thumbnailSrc = new URL(value.thumbnailURL, serverURL).toString()
            } catch {
              thumbnailSrc = `${serverURL}${value.thumbnailURL}`
            }
          }

          if (isImage(value.mimeType)) {
            thumbnailSrc = getBestFitFromSizes({
              sizes: value.sizes,
              thumbnailURL: thumbnailSrc,
              url: src,
              width: value.width,
            })
          }

          return (
            <DraggableSortableItem disabled={!isSortable || readonly} id={id} key={id}>
              {(draggableSortableItemProps) => (
                <div
                  className={[
                    `${baseClass}__dragItem`,
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
                  <UploadCard size="small">
                    {draggableSortableItemProps && (
                      <div
                        className={`${baseClass}__drag`}
                        {...draggableSortableItemProps.attributes}
                        {...draggableSortableItemProps.listeners}
                      >
                        <DragHandleIcon />
                      </div>
                    )}

                    <RelationshipContent
                      allowEdit={!readonly}
                      allowRemove={!readonly}
                      alt={(value?.alt || value?.filename) as string}
                      byteSize={value.filesize as number}
                      collectionSlug={relationTo}
                      displayPreview={displayPreview}
                      filename={value.filename as string}
                      id={id}
                      mimeType={value?.mimeType as string}
                      onRemove={() => removeItem(index)}
                      reloadDoc={reloadDoc}
                      showCollectionSlug={showCollectionSlug}
                      src={src}
                      thumbnailSrc={thumbnailSrc}
                      withMeta={false}
                      x={value?.width as number}
                      y={value?.height as number}
                    />
                  </UploadCard>
                </div>
              )}
            </DraggableSortableItem>
          )
        })}
      </DraggableSortable>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Upload/HasOne/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .upload {
    position: relative;
    max-width: 100%;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Upload/HasOne/index.tsx
Signals: React

```typescript
'use client'

import type { JsonObject } from 'payload'

import { getBestFitFromSizes, isImage } from 'payload/shared'
import React from 'react'

import type { ReloadDoc } from '../types.js'

import './index.scss'
import { RelationshipContent } from '../RelationshipContent/index.js'
import { UploadCard } from '../UploadCard/index.js'

const baseClass = 'upload upload--has-one'

type Props = {
  readonly className?: string
  readonly displayPreview?: boolean
  readonly fileDoc: {
    relationTo: string
    value: JsonObject
  }
  readonly onRemove?: () => void
  readonly readonly?: boolean
  readonly reloadDoc: ReloadDoc
  readonly serverURL: string
  readonly showCollectionSlug?: boolean
}

export function UploadComponentHasOne(props: Props) {
  const {
    className,
    displayPreview,
    fileDoc,
    onRemove,
    readonly,
    reloadDoc,
    serverURL,
    showCollectionSlug = false,
  } = props
  const { relationTo, value } = fileDoc
  const id = String(value?.id)

  let src: string
  let thumbnailSrc: string

  if (value.url) {
    try {
      src = new URL(value.url, serverURL).toString()
    } catch {
      src = `${serverURL}${value.url}`
    }
  }

  if (value.thumbnailURL) {
    try {
      thumbnailSrc = new URL(value.thumbnailURL, serverURL).toString()
    } catch {
      thumbnailSrc = `${serverURL}${value.thumbnailURL}`
    }
  }

  if (isImage(value.mimeType)) {
    thumbnailSrc = getBestFitFromSizes({
      sizes: value.sizes,
      thumbnailURL: thumbnailSrc,
      url: src,
      width: value.width,
    })
  }

  return (
    <UploadCard className={[baseClass, className].filter(Boolean).join(' ')}>
      <RelationshipContent
        allowEdit={!readonly}
        allowRemove={!readonly}
        alt={(value?.alt || value?.filename) as string}
        byteSize={value.filesize as number}
        collectionSlug={relationTo}
        displayPreview={displayPreview}
        filename={value.filename as string}
        id={id}
        mimeType={value?.mimeType as string}
        onRemove={onRemove}
        reloadDoc={reloadDoc}
        showCollectionSlug={showCollectionSlug}
        src={src}
        thumbnailSrc={thumbnailSrc}
        x={value?.width as number}
        y={value?.height as number}
      />
    </UploadCard>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Upload/RelationshipContent/index.scss

```text
@layer payload-default {
  .upload-relationship-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-width: 0;

    &__imageAndDetails {
      display: flex;
      gap: calc(var(--base) / 2);
      align-items: center;
      min-width: 0;
    }

    &__thumbnail {
      align-self: center;
      border-radius: var(--style-radius-s);
    }

    &__details {
      display: flex;
      flex-direction: column;
      gap: 0;
      overflow: hidden;
      margin-right: calc(var(--base) * 2);
    }

    &__filename {
      margin: 0;
      text-wrap: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      a {
        text-decoration: none;
      }
    }

    &__meta {
      margin: 0;
      color: var(--theme-elevation-500);
      text-wrap: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &__actions {
      flex-shrink: 0;
      display: flex;
    }

    .btn {
      margin: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

````
