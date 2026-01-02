---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 241
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 241 of 695)

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

---[FILE: index.ts]---
Location: payload-main/packages/plugin-import-export/src/index.ts

```typescript
import type { Config, FlattenedField } from 'payload'

import { addDataAndFileToRequest, deepMergeSimple } from 'payload'

import type { PluginDefaultTranslationsObject } from './translations/types.js'
import type { ImportExportPluginConfig, ToCSVFunction } from './types.js'

import { flattenObject } from './export/flattenObject.js'
import { getCreateCollectionExportTask } from './export/getCreateExportCollectionTask.js'
import { getCustomFieldFunctions } from './export/getCustomFieldFunctions.js'
import { getSelect } from './export/getSelect.js'
import { getExportCollection } from './getExportCollection.js'
import { translations } from './translations/index.js'
import { collectDisabledFieldPaths } from './utilities/collectDisabledFieldPaths.js'
import { getFlattenedFieldKeys } from './utilities/getFlattenedFieldKeys.js'
import { getValueAtPath } from './utilities/getvalueAtPath.js'
import { removeDisabledFields } from './utilities/removeDisabledFields.js'
import { setNestedValue } from './utilities/setNestedValue.js'

export const importExportPlugin =
  (pluginConfig: ImportExportPluginConfig) =>
  (config: Config): Config => {
    const exportCollection = getExportCollection({ config, pluginConfig })
    if (config.collections) {
      config.collections.push(exportCollection)
    } else {
      config.collections = [exportCollection]
    }

    // inject custom import export provider
    config.admin = config.admin || {}
    config.admin.components = config.admin.components || {}
    config.admin.components.providers = config.admin.components.providers || []
    config.admin.components.providers.push(
      '@payloadcms/plugin-import-export/rsc#ImportExportProvider',
    )

    // inject the createExport job into the config
    ;((config.jobs ??= {}).tasks ??= []).push(getCreateCollectionExportTask(config, pluginConfig))

    let collectionsToUpdate = config.collections

    const usePluginCollections = pluginConfig.collections && pluginConfig.collections?.length > 0

    if (usePluginCollections) {
      collectionsToUpdate = config.collections?.filter((collection) => {
        return pluginConfig.collections?.includes(collection.slug)
      })
    }

    collectionsToUpdate.forEach((collection) => {
      if (!collection.admin) {
        collection.admin = { components: { listMenuItems: [] } }
      }
      const components = collection.admin.components || {}
      if (!components.listMenuItems) {
        components.listMenuItems = []
      }
      components.listMenuItems.push({
        clientProps: {
          exportCollectionSlug: exportCollection.slug,
        },
        path: '@payloadcms/plugin-import-export/rsc#ExportListMenuItem',
      })

      // Find fields explicitly marked as disabled for import/export
      const disabledFieldAccessors = collectDisabledFieldPaths(collection.fields)

      // Store disabled field accessors in the admin config for use in the UI
      collection.admin.custom = {
        ...(collection.admin.custom || {}),
        'plugin-import-export': {
          ...(collection.admin.custom?.['plugin-import-export'] || {}),
          disabledFields: disabledFieldAccessors,
        },
      }

      collection.admin.components = components
    })

    if (!config.i18n) {
      config.i18n = {}
    }

    // config.i18n.translations = deepMergeSimple(translations, config.i18n?.translations ?? {})

    // Inject custom REST endpoints into the config
    config.endpoints = config.endpoints || []
    config.endpoints.push({
      handler: async (req) => {
        await addDataAndFileToRequest(req)

        const { collectionSlug, draft, fields, limit, locale, page, sort, where } = req.data as {
          collectionSlug: string
          draft?: 'no' | 'yes'
          fields?: string[]
          format?: 'csv' | 'json'
          limit?: number
          locale?: string
          page?: number
          sort?: any
          where?: any
        }

        const collection = req.payload.collections[collectionSlug]
        if (!collection) {
          return Response.json(
            { error: `Collection with slug ${collectionSlug} not found` },
            { status: 400 },
          )
        }

        const select = Array.isArray(fields) && fields.length > 0 ? getSelect(fields) : undefined

        const result = await req.payload.find({
          collection: collectionSlug,
          depth: 1,
          draft: draft === 'yes',
          limit: limit && limit > 10 ? 10 : limit,
          locale,
          overrideAccess: false,
          page,
          req,
          select,
          sort,
          where,
        })

        const isCSV = req?.data?.format === 'csv'
        const docs = result.docs

        let transformed: Record<string, unknown>[] = []

        if (isCSV) {
          const toCSVFunctions = getCustomFieldFunctions({
            fields: collection.config.fields as FlattenedField[],
          })

          const possibleKeys = getFlattenedFieldKeys(collection.config.fields as FlattenedField[])

          transformed = docs.map((doc) => {
            const row = flattenObject({
              doc,
              fields,
              toCSVFunctions,
            })

            for (const key of possibleKeys) {
              if (!(key in row)) {
                row[key] = null
              }
            }

            return row
          })
        } else {
          const disabledFields =
            collection.config.admin.custom?.['plugin-import-export']?.disabledFields

          transformed = docs.map((doc) => {
            let output: Record<string, unknown> = { ...doc }

            // Remove disabled fields first
            output = removeDisabledFields(output, disabledFields)

            // Then trim to selected fields only (if fields are provided)
            if (Array.isArray(fields) && fields.length > 0) {
              const trimmed: Record<string, unknown> = {}

              for (const key of fields) {
                const value = getValueAtPath(output, key)
                setNestedValue(trimmed, key, value ?? null)
              }

              output = trimmed
            }

            return output
          })
        }

        return Response.json({
          docs: transformed,
          totalDocs: result.totalDocs,
        })
      },
      method: 'post',
      path: '/preview-data',
    })

    /**
     * Merge plugin translations
     */
    const simplifiedTranslations = Object.entries(translations).reduce(
      (acc, [key, value]) => {
        acc[key] = value.translations
        return acc
      },
      {} as Record<string, PluginDefaultTranslationsObject>,
    )

    config.i18n = {
      ...config.i18n,
      translations: deepMergeSimple(simplifiedTranslations, config.i18n?.translations ?? {}),
    }

    return config
  }

declare module 'payload' {
  export interface FieldCustom {
    'plugin-import-export'?: {
      /**
       * When `true` the field is **completely excluded** from the import-export plugin:
       * - It will not appear in the "Fields to export" selector.
       * - It is hidden from the preview list when no specific fields are chosen.
       * - Its data is omitted from the final CSV / JSON export.
       * @default false
       */
      disabled?: boolean
      /**
       * Custom function used to modify the outgoing csv data by manipulating the data, siblingData or by returning the desired value
       */
      toCSV?: ToCSVFunction
    }
  }

  export interface CollectionAdminCustom {
    'plugin-import-export'?: {
      /**
       * Array of field paths that are disabled for import/export.
       * These paths are collected from fields marked with `custom['plugin-import-export'].disabled = true`.
       */
      disabledFields?: string[]
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-import-export/src/types.ts

```typescript
import type { CollectionAdminOptions, CollectionConfig, UploadConfig } from 'payload'

export type CollectionOverride = {
  admin: CollectionAdminOptions
  upload: UploadConfig
} & CollectionConfig

export type ImportExportPluginConfig = {
  /**
   * Collections to include the Import/Export controls in
   * Defaults to all collections
   */
  collections?: string[]
  /**
   * If true, enables debug logging
   */
  debug?: boolean
  /**
   * If true, disables the download button in the export preview UI
   * @default false
   */
  disableDownload?: boolean
  /**
   * Enable to force the export to run synchronously
   */
  disableJobsQueue?: boolean
  /**
   * If true, disables the save button in the export preview UI
   * @default false
   */
  disableSave?: boolean
  /**
   * Forces a specific export format (`csv` or `json`) and hides the format dropdown from the UI.
   *
   * When defined, this overrides the user's ability to choose a format manually. The export will
   * always use the specified format, and the format selection field will be hidden.
   *
   * If not set, the user can choose between CSV and JSON in the export UI.
   * @default undefined
   */
  format?: 'csv' | 'json'
  /**
   * This function takes the default export collection configured in the plugin and allows you to override it by modifying and returning it
   * @param collection
   * @returns collection
   */
  overrideExportCollection?: (collection: CollectionOverride) => CollectionOverride
}

/**
 * Custom function used to modify the outgoing csv data by manipulating the data, siblingData or by returning the desired value
 */
export type ToCSVFunction = (args: {
  /**
   * The path of the column for the field, for arrays this includes the index (zero-based)
   */
  columnName: string
  /**
   * Alias for `row`, the object that accumulates CSV output.
   * Use this to write additional fields into the exported row.
   */
  data: Record<string, unknown>
  /**
   * The top level document
   */
  doc: Document
  /**
   * The object data that can be manipulated to assign data to the CSV
   */
  row: Record<string, unknown>
  /**
   * The document data at the level where it belongs
   */
  siblingDoc: Record<string, unknown>
  /**
   * The data for the field.
   */
  value: unknown
}) => unknown
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-import-export/src/components/CollectionField/index.tsx
Signals: React

```typescript
'use client'
import type React from 'react'

import { useDocumentInfo, useField } from '@payloadcms/ui'
import { useEffect } from 'react'

import { useImportExport } from '../ImportExportProvider/index.js'

export const CollectionField: React.FC = () => {
  const { id } = useDocumentInfo()
  const { setValue } = useField({ path: 'collectionSlug' })
  const { collection } = useImportExport()

  useEffect(() => {
    if (id) {
      return
    }
    setValue(collection)
  }, [id, collection, setValue])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/plugin-import-export/src/components/ExportListMenuItem/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .export-list-menu-item {
    .doc-drawer__toggler {
      height: 100%;
      width: 100%;
      text-align: left;
    }


    // TODO: is any of this css needed?
    &__subheader,
    &__header {
      padding: 0 var(--gutter-h);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--theme-border-color);

      & h2 {
        margin: calc(var(--gutter-h) * 0.5) 0;
      }
    }

    &__options,
    &__preview {
      padding: calc(var(--gutter-h) * 0.5) var(--gutter-h);
    }

    &__preview-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: calc(var(--gutter-h) * 0.5);
    }

    &__close {
      @include btn-reset;
    }

    &__icon {
      width: 3rem;
      height: 3rem;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-import-export/src/components/ExportListMenuItem/index.tsx
Signals: React

```typescript
'use client'

import { getTranslation } from '@payloadcms/translations'
import {
  PopupList,
  Translation,
  useConfig,
  useDocumentDrawer,
  useTranslation,
} from '@payloadcms/ui'
import React, { useEffect } from 'react'

import type {
  PluginImportExportTranslationKeys,
  PluginImportExportTranslations,
} from '../../translations/index.js'

import { useImportExport } from '../ImportExportProvider/index.js'
import './index.scss'

const baseClass = 'export-list-menu-item'

export const ExportListMenuItem: React.FC<{
  collectionSlug: string
  exportCollectionSlug: string
}> = ({ collectionSlug, exportCollectionSlug }) => {
  const { getEntityConfig } = useConfig()
  const { i18n, t } = useTranslation<
    PluginImportExportTranslations,
    PluginImportExportTranslationKeys
  >()
  const currentCollectionConfig = getEntityConfig({ collectionSlug })

  const [DocumentDrawer, DocumentDrawerToggler] = useDocumentDrawer({
    collectionSlug: exportCollectionSlug,
  })
  const { setCollection } = useImportExport()

  // Set collection and selected items on mount or when selection changes
  useEffect(() => {
    setCollection(currentCollectionConfig.slug ?? '')
  }, [currentCollectionConfig, setCollection])

  return (
    <PopupList.Button className={baseClass}>
      <DocumentDrawerToggler>
        <Translation
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          i18nKey="plugin-import-export:exportDocumentLabel"
          t={t}
          variables={{
            label: getTranslation(currentCollectionConfig.labels.plural, i18n),
          }}
        />
      </DocumentDrawerToggler>
      <DocumentDrawer />
    </PopupList.Button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-import-export/src/components/ExportSaveButton/index.tsx
Signals: React

```typescript
'use client'

import {
  Button,
  SaveButton,
  toast,
  Translation,
  useConfig,
  useForm,
  useFormModified,
  useTranslation,
} from '@payloadcms/ui'
import React from 'react'

import type {
  PluginImportExportTranslationKeys,
  PluginImportExportTranslations,
} from '../../translations/index.js'

export const ExportSaveButton: React.FC = () => {
  const { t } = useTranslation<PluginImportExportTranslations, PluginImportExportTranslationKeys>()
  const {
    config: {
      routes: { api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const { getData, setModified } = useForm()
  const modified = useFormModified()

  const exportsCollectionConfig = getEntityConfig({ collectionSlug: 'exports' })

  const disableSave = exportsCollectionConfig?.admin?.custom?.disableSave === true

  const disableDownload = exportsCollectionConfig?.admin?.custom?.disableDownload === true

  const label = t('general:save')

  const handleDownload = async () => {
    let timeoutID: null | ReturnType<typeof setTimeout> = null
    let toastID: null | number | string = null

    try {
      setModified(false) // Reset modified state
      const data = getData()

      // Set a timeout to show toast if the request takes longer than 200ms
      timeoutID = setTimeout(() => {
        toastID = toast.success('Your export is being processed...')
      }, 200)

      const response = await fetch(`${serverURL}${api}/exports/download`, {
        body: JSON.stringify({
          data,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      // Clear the timeout if fetch completes quickly
      if (timeoutID) {
        clearTimeout(timeoutID)
      }

      // Dismiss the toast if it was shown
      if (toastID) {
        toast.dismiss(toastID)
      }

      if (!response.ok) {
        // Try to parse the error message from the JSON response
        let errorMsg = 'Failed to download file'
        try {
          const errorJson = await response.json()
          if (errorJson?.errors?.[0]?.message) {
            errorMsg = errorJson.errors[0].message
          }
        } catch {
          // Ignore JSON parse errors, fallback to generic message
        }
        throw new Error(errorMsg)
      }

      const fileStream = response.body
      const reader = fileStream?.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        result += decoder.decode(value, { stream: true })
      }

      const blob = new Blob([result], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.name}.${data.format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error: any) {
      toast.error(error.message || 'Error downloading file')
    }
  }

  return (
    <React.Fragment>
      {!disableSave && <SaveButton label={label} />}
      {!disableDownload && (
        <Button disabled={!modified} onClick={handleDownload} size="medium" type="button">
          <Translation i18nKey="upload:download" t={t} />
        </Button>
      )}
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-import-export/src/components/FieldsToExport/index.tsx
Signals: React

```typescript
'use client'

import type { SelectFieldClientComponent } from 'payload'
import type { ReactNode } from 'react'

import {
  FieldLabel,
  ReactSelect,
  useConfig,
  useDocumentInfo,
  useField,
  useListQuery,
} from '@payloadcms/ui'
import React, { useEffect } from 'react'

import { useImportExport } from '../ImportExportProvider/index.js'
import { reduceFields } from './reduceFields.js'

const baseClass = 'fields-to-export'

export const FieldsToExport: SelectFieldClientComponent = (props) => {
  const { id } = useDocumentInfo()
  const { setValue, value } = useField<string[]>()
  const { value: collectionSlug } = useField<string>({ path: 'collectionSlug' })
  const { getEntityConfig } = useConfig()
  const { collection } = useImportExport()
  const { query } = useListQuery()

  const collectionConfig = getEntityConfig({ collectionSlug: collectionSlug ?? collection })

  const disabledFields =
    collectionConfig?.admin?.custom?.['plugin-import-export']?.disabledFields ?? []

  const fieldOptions = reduceFields({
    disabledFields,
    fields: collectionConfig?.fields,
  })

  useEffect(() => {
    if (id || !collectionSlug) {
      return
    }

    const queryColumns = query?.columns

    if (Array.isArray(queryColumns)) {
      const cleanColumns = queryColumns.filter(
        (col): col is string => typeof col === 'string' && !col.startsWith('-'),
      )
      // If columns are specified in the query, use them
      setValue(cleanColumns)
    } else {
      // Fallback if no columns in query
      setValue(collectionConfig?.admin?.defaultColumns ?? [])
    }
  }, [id, collectionSlug, query?.columns, collectionConfig?.admin?.defaultColumns, setValue])

  const onChange = (options: { id: string; label: ReactNode; value: string }[]) => {
    if (!options) {
      setValue([])
      return
    }

    const updatedValue = options.map((option) =>
      typeof option === 'object' ? option.value : option,
    )

    setValue(updatedValue)
  }

  return (
    <div className={baseClass}>
      <FieldLabel label={props.field.label} path={props.path} />
      <ReactSelect
        className={baseClass}
        disabled={props.readOnly}
        getOptionValue={(option) => String(option.value)}
        inputId={`field-${props.path.replace(/\./g, '__')}`}
        isClearable={true}
        isMulti={true}
        isSortable={true}
        // @ts-expect-error react select option
        onChange={onChange}
        options={fieldOptions}
        value={
          Array.isArray(value)
            ? value.map((val) => {
                const match = fieldOptions.find((opt) => opt.value === val)
                return match ? { ...match, id: val } : { id: val, label: val, value: val }
              })
            : []
        }
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: reduceFields.tsx]---
Location: payload-main/packages/plugin-import-export/src/components/FieldsToExport/reduceFields.tsx
Signals: React

```typescript
import type { ClientField } from 'payload'

import { fieldAffectsData, fieldHasSubFields } from 'payload/shared'
import React, { Fragment } from 'react'

const createNestedClientFieldPath = (parentPath: string, field: ClientField): string => {
  if (parentPath) {
    if (fieldAffectsData(field)) {
      return `${parentPath}.${field.name}`
    }
    return parentPath
  }

  if (fieldAffectsData(field)) {
    return field.name
  }

  return ''
}

const combineLabel = ({
  field,
  prefix,
}: {
  field: ClientField
  prefix?: React.ReactNode
}): React.ReactNode => {
  return (
    <Fragment>
      {prefix ? (
        <Fragment>
          <span style={{ display: 'inline-block' }}>{prefix}</span>
          {' > '}
        </Fragment>
      ) : null}
      <span style={{ display: 'inline-block' }}>
        {'label' in field && typeof field.label === 'string'
          ? field.label
          : (('name' in field && field.name) ?? 'unnamed field')}
      </span>
    </Fragment>
  )
}

export const reduceFields = ({
  disabledFields = [],
  fields,
  labelPrefix = null,
  path = '',
}: {
  disabledFields?: string[]
  fields: ClientField[]
  labelPrefix?: React.ReactNode
  path?: string
}): { id: string; label: React.ReactNode; value: string }[] => {
  if (!fields) {
    return []
  }

  return fields.reduce<{ id: string; label: React.ReactNode; value: string }[]>(
    (fieldsToUse, field) => {
      // escape for a variety of reasons, include ui fields as they have `name`.
      if (field.type === 'ui') {
        return fieldsToUse
      }

      if (!(field.type === 'array' || field.type === 'blocks') && fieldHasSubFields(field)) {
        return [
          ...fieldsToUse,
          ...reduceFields({
            disabledFields,
            fields: field.fields,
            labelPrefix: combineLabel({ field, prefix: labelPrefix }),
            path: createNestedClientFieldPath(path, field),
          }),
        ]
      }

      if (field.type === 'tabs' && 'tabs' in field) {
        return [
          ...fieldsToUse,
          ...field.tabs.reduce<{ id: string; label: React.ReactNode; value: string }[]>(
            (tabFields, tab) => {
              if ('fields' in tab) {
                const isNamedTab = 'name' in tab && tab.name

                const newPath = isNamedTab ? `${path}${path ? '.' : ''}${tab.name}` : path

                return [
                  ...tabFields,
                  ...reduceFields({
                    disabledFields,
                    fields: tab.fields,
                    labelPrefix: isNamedTab
                      ? combineLabel({
                          field: {
                            name: tab.name,
                            label: tab.label ?? tab.name,
                          } as any,
                          prefix: labelPrefix,
                        })
                      : labelPrefix,
                    path: newPath,
                  }),
                ]
              }
              return tabFields
            },
            [],
          ),
        ]
      }

      const val = createNestedClientFieldPath(path, field)

      // If the field is disabled, skip it
      if (
        disabledFields.some(
          (disabledField) => val === disabledField || val.startsWith(`${disabledField}.`),
        )
      ) {
        return fieldsToUse
      }

      const formattedField = {
        id: val,
        label: combineLabel({ field, prefix: labelPrefix }),
        value: val,
      }

      return [...fieldsToUse, formattedField]
    },
    [],
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-import-export/src/components/ImportExportProvider/index.tsx
Signals: React

```typescript
'use client'
import React, { createContext, use, useCallback, useState } from 'react'

type ImportExportContext = {
  collection: string
  setCollection: (collection: string) => void
}

export const ImportExportContext = createContext({} as ImportExportContext)

export const ImportExportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collection, setCollectionState] = useState<string>('')

  const setCollection = useCallback((collection: string) => {
    setCollectionState(collection)
  }, [])

  return (
    <ImportExportContext
      value={{
        collection,
        setCollection,
      }}
    >
      {children}
    </ImportExportContext>
  )
}

export const useImportExport = (): ImportExportContext => use(ImportExportContext)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/plugin-import-export/src/components/Page/index.scss

```text
.page-field {
  --field-width: 33.3333%;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-import-export/src/components/Page/index.tsx
Signals: React

```typescript
'use client'

import type { NumberFieldClientComponent } from 'payload'

import { NumberField, useField } from '@payloadcms/ui'
import React, { useEffect } from 'react'

import './index.scss'

const baseClass = 'page-field'

export const Page: NumberFieldClientComponent = (props) => {
  const { setValue } = useField<number>()
  const { value: limitValue } = useField<number>({ path: 'limit' })

  // Effect to reset page to 1 if limit is removed
  useEffect(() => {
    if (!limitValue) {
      setValue(1) // Reset page to 1
    }
  }, [limitValue, setValue])

  return (
    <div className={baseClass}>
      <NumberField
        field={{
          name: props.field.name,
          admin: {
            autoComplete: undefined,
            placeholder: undefined,
            step: 1,
          },
          label: props.field.label,
          min: 1,
        }}
        onChange={(value) => setValue(value ?? 1)} // Update the page value on change
        path={props.path}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/plugin-import-export/src/components/Preview/index.scss

```text
.preview {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-import-export/src/components/Preview/index.tsx
Signals: React

```typescript
'use client'
import type { Column } from '@payloadcms/ui'
import type { ClientField } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import {
  CodeEditorLazy,
  Table,
  Translation,
  useConfig,
  useField,
  useTranslation,
} from '@payloadcms/ui'
import React from 'react'

import type {
  PluginImportExportTranslationKeys,
  PluginImportExportTranslations,
} from '../../translations/index.js'

import { buildDisabledFieldRegex } from '../../utilities/buildDisabledFieldRegex.js'
import './index.scss'
import { useImportExport } from '../ImportExportProvider/index.js'

const baseClass = 'preview'

export const Preview = () => {
  const { collection } = useImportExport()
  const { config } = useConfig()
  const { value: where } = useField({ path: 'where' })
  const { value: page } = useField({ path: 'page' })
  const { value: limit } = useField<number>({ path: 'limit' })
  const { value: fields } = useField<string[]>({ path: 'fields' })
  const { value: sort } = useField({ path: 'sort' })
  const { value: draft } = useField({ path: 'drafts' })
  const { value: locale } = useField({ path: 'locale' })
  const { value: format } = useField({ path: 'format' })
  const [dataToRender, setDataToRender] = React.useState<any[]>([])
  const [resultCount, setResultCount] = React.useState<any>('')
  const [columns, setColumns] = React.useState<Column[]>([])
  const { i18n, t } = useTranslation<
    PluginImportExportTranslations,
    PluginImportExportTranslationKeys
  >()

  const collectionSlug = typeof collection === 'string' && collection
  const collectionConfig = config.collections.find(
    (collection) => collection.slug === collectionSlug,
  )

  const disabledFieldRegexes: RegExp[] = React.useMemo(() => {
    const disabledFieldPaths =
      collectionConfig?.admin?.custom?.['plugin-import-export']?.disabledFields ?? []

    return disabledFieldPaths.map(buildDisabledFieldRegex)
  }, [collectionConfig])

  const isCSV = format === 'csv'

  React.useEffect(() => {
    const fetchData = async () => {
      if (!collectionSlug || !collectionConfig) {
        return
      }

      try {
        const res = await fetch('/api/preview-data', {
          body: JSON.stringify({
            collectionSlug,
            draft,
            fields,
            format,
            limit,
            locale,
            page,
            sort,
            where,
          }),
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })

        if (!res.ok) {
          return
        }

        const { docs, totalDocs }: { docs: Record<string, unknown>[]; totalDocs: number } =
          await res.json()

        setResultCount(limit && limit < totalDocs ? limit : totalDocs)

        const allKeys = Array.from(new Set(docs.flatMap((doc) => Object.keys(doc))))
        const defaultMetaFields = ['createdAt', 'updatedAt', '_status', 'id']

        // Match CSV column ordering by building keys based on fields and regex
        const fieldToRegex = (field: string): RegExp => {
          const parts = field.split('.').map((part) => `${part}(?:_\\d+)?`)
          return new RegExp(`^${parts.join('_')}`)
        }

        // Construct final list of field keys to match field order + meta order
        const selectedKeys =
          Array.isArray(fields) && fields.length > 0
            ? fields.flatMap((field) => {
                const regex = fieldToRegex(field)
                return allKeys.filter(
                  (key) =>
                    regex.test(key) &&
                    !disabledFieldRegexes.some((disabledRegex) => disabledRegex.test(key)),
                )
              })
            : allKeys.filter(
                (key) =>
                  !defaultMetaFields.includes(key) &&
                  !disabledFieldRegexes.some((regex) => regex.test(key)),
              )

        const fieldKeys =
          Array.isArray(fields) && fields.length > 0
            ? selectedKeys // strictly use selected fields only
            : [
                ...selectedKeys,
                ...defaultMetaFields.filter(
                  (key) => allKeys.includes(key) && !selectedKeys.includes(key),
                ),
              ]

        // Build columns based on flattened keys
        const newColumns: Column[] = fieldKeys.map((key) => ({
          accessor: key,
          active: true,
          field: { name: key } as ClientField,
          Heading: getTranslation(key, i18n),
          renderedCells: docs.map((doc: Record<string, unknown>) => {
            const val = doc[key]

            if (val === undefined || val === null) {
              return null
            }

            // Avoid ESLint warning by type-checking before calling String()
            if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
              return String(val)
            }

            if (Array.isArray(val)) {
              return val.map(String).join(', ')
            }

            return JSON.stringify(val)
          }),
        }))

        setColumns(newColumns)
        setDataToRender(docs)
      } catch (error) {
        console.error('Error fetching preview data:', error)
      }
    }

    void fetchData()
  }, [
    collectionConfig,
    collectionSlug,
    disabledFieldRegexes,
    draft,
    fields,
    format,
    i18n,
    limit,
    locale,
    page,
    sort,
    where,
  ])

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__header`}>
        <h3>
          <Translation i18nKey="version:preview" t={t} />
        </h3>
        {resultCount && (
          <Translation
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            i18nKey="plugin-import-export:totalDocumentsCount"
            t={t}
            variables={{
              count: resultCount,
            }}
          />
        )}
      </div>
      {dataToRender &&
        (isCSV ? (
          <Table columns={columns} data={dataToRender} />
        ) : (
          <CodeEditorLazy language="json" readOnly value={JSON.stringify(dataToRender, null, 2)} />
        ))}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-import-export/src/components/SelectionToUseField/index.tsx
Signals: React

```typescript
'use client'

import type { Where } from 'payload'

import {
  RadioGroupField,
  useDocumentInfo,
  useField,
  useListQuery,
  useSelection,
  useTranslation,
} from '@payloadcms/ui'
import React, { useEffect, useMemo } from 'react'

const isWhereEmpty = (where: Where): boolean => {
  if (!where || typeof where !== 'object') {
    return true
  }

  // Flatten one level of OR/AND wrappers
  if (Array.isArray(where.and)) {
    return where.and.length === 0
  }
  if (Array.isArray(where.or)) {
    return where.or.length === 0
  }

  return Object.keys(where).length === 0
}

export const SelectionToUseField: React.FC = () => {
  const { id } = useDocumentInfo()
  const { query } = useListQuery()
  const { selectAll, selected } = useSelection()
  const { t } = useTranslation()

  const { setValue: setSelectionToUseValue, value: selectionToUseValue } = useField({
    path: 'selectionToUse',
  })

  const { setValue: setWhere } = useField({
    path: 'where',
  })

  const hasMeaningfulFilters = query?.where && !isWhereEmpty(query.where)

  const availableOptions = useMemo(() => {
    const options = [
      {
        // @ts-expect-error - this is not correctly typed in plugins right now
        label: t('plugin-import-export:selectionToUse-allDocuments'),
        value: 'all',
      },
    ]

    if (hasMeaningfulFilters) {
      options.unshift({
        // @ts-expect-error - this is not correctly typed in plugins right now
        label: t('plugin-import-export:selectionToUse-currentFilters'),
        value: 'currentFilters',
      })
    }

    if (['allInPage', 'some'].includes(selectAll)) {
      options.unshift({
        // @ts-expect-error - this is not correctly typed in plugins right now
        label: t('plugin-import-export:selectionToUse-currentSelection'),
        value: 'currentSelection',
      })
    }

    return options
  }, [hasMeaningfulFilters, selectAll, t])

  // Auto-set default
  useEffect(() => {
    if (id) {
      return
    }

    let defaultSelection: 'all' | 'currentFilters' | 'currentSelection' = 'all'

    if (['allInPage', 'some'].includes(selectAll)) {
      defaultSelection = 'currentSelection'
    } else if (query?.where) {
      defaultSelection = 'currentFilters'
    }

    setSelectionToUseValue(defaultSelection)
  }, [id, selectAll, query?.where, setSelectionToUseValue])

  // Sync where clause with selected option
  useEffect(() => {
    if (id) {
      return
    }

    if (selectionToUseValue === 'currentFilters' && query?.where) {
      setWhere(query.where)
    } else if (selectionToUseValue === 'currentSelection' && selected) {
      const ids = [...selected.entries()].filter(([_, isSelected]) => isSelected).map(([id]) => id)

      setWhere({ id: { in: ids } })
    } else if (selectionToUseValue === 'all') {
      setWhere({})
    }
  }, [id, selectionToUseValue, query?.where, selected, setWhere])

  // Hide component if no other options besides "all" are available
  if (availableOptions.length <= 1) {
    return null
  }

  return (
    <RadioGroupField
      field={{
        name: 'selectionToUse',
        type: 'radio',
        admin: {},
        // @ts-expect-error - this is not correctly typed in plugins right now
        label: t('plugin-import-export:field-selectionToUse-label'),
        options: availableOptions,
      }}
      // @ts-expect-error - this is not correctly typed in plugins right now
      label={t('plugin-import-export:field-selectionToUse-label')}
      options={availableOptions}
      path="selectionToUse"
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/plugin-import-export/src/components/SortBy/index.scss

```text
.sort-by-fields {
  --field-width: 25%;
}
```

--------------------------------------------------------------------------------

````
