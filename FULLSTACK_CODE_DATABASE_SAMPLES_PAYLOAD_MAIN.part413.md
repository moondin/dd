---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 413
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 413 of 695)

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

---[FILE: reduceFieldsToOptions.tsx]---
Location: payload-main/packages/ui/src/utilities/reduceFieldsToOptions.tsx

```typescript
'use client'
import type { ClientTranslationKeys, I18nClient } from '@payloadcms/translations'
import type { ClientField, SanitizedFieldPermissions, SanitizedFieldsPermissions } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { fieldAffectsData, fieldIsHiddenOrDisabled, fieldIsID, tabHasName } from 'payload/shared'

import type { ReducedField } from '../elements/WhereBuilder/types.js'

import {
  fieldTypeConditions,
  getValidFieldOperators,
} from '../elements/WhereBuilder/field-types.js'
import { createNestedClientFieldPath } from '../forms/Form/createNestedClientFieldPath.js'
import { combineFieldLabel } from './combineFieldLabel.js'

type ReduceFieldOptionsArgs = {
  fieldPermissions?: SanitizedFieldPermissions | SanitizedFieldsPermissions
  fields: ClientField[]
  i18n: I18nClient
  labelPrefix?: string
  pathPrefix?: string
}

/**
 * Transforms a fields schema into a flattened array of fields with labels and values.
 * Used in the `WhereBuilder` component to render the fields in the dropdown.
 */
export const reduceFieldsToOptions = ({
  fieldPermissions,
  fields,
  i18n,
  labelPrefix,
  pathPrefix: pathPrefixFromArgs,
}: ReduceFieldOptionsArgs): ReducedField[] => {
  return fields.reduce((reduced, field) => {
    let pathPrefix = pathPrefixFromArgs
    // Do not filter out `field.admin.disableListFilter` fields here, as these should still render as disabled if they appear in the URL query
    // Filter out `virtual: true` fields since they are regular virtuals and not backed by a DB field
    if (
      (fieldIsHiddenOrDisabled(field) && !fieldIsID(field)) ||
      ('virtual' in field && field.virtual === true)
    ) {
      return reduced
    }

    // IMPORTANT: We DON'T mutate field.name here because the field object is shared across
    // multiple components (WhereBuilder, GroupByBuilder, etc.). Mutating it would break
    // permission checks and cause issues in other components that need the field name.
    // Instead, we use a flag to determine whether to include the field name in the path.
    let shouldIgnoreFieldName = false

    // Handle virtual:string fields (virtual relationships, e.g. "post.title")
    if ('virtual' in field && typeof field.virtual === 'string') {
      pathPrefix = pathPrefix ? pathPrefix + '.' + field.virtual : field.virtual
      if (fieldAffectsData(field)) {
        // Mark that we should ignore the field name when constructing the field path
        shouldIgnoreFieldName = true
      }
    }

    if (field.type === 'tabs' && 'tabs' in field) {
      const tabs = field.tabs

      tabs.forEach((tab) => {
        if (typeof tab.label !== 'boolean') {
          const localizedTabLabel = getTranslation(tab.label, i18n)

          const labelWithPrefix = labelPrefix
            ? labelPrefix + ' > ' + localizedTabLabel
            : localizedTabLabel

          // Make sure we handle nested tabs
          const tabPathPrefix =
            tabHasName(tab) && tab.name
              ? pathPrefix
                ? pathPrefix + '.' + tab.name
                : tab.name
              : pathPrefix

          if (typeof localizedTabLabel === 'string') {
            reduced.push(
              ...reduceFieldsToOptions({
                fieldPermissions:
                  typeof fieldPermissions === 'boolean'
                    ? fieldPermissions
                    : tabHasName(tab) && tab.name
                      ? fieldPermissions?.[tab.name]?.fields || fieldPermissions?.[tab.name]
                      : fieldPermissions,
                fields: tab.fields,
                i18n,
                labelPrefix: labelWithPrefix,
                pathPrefix: tabPathPrefix,
              }),
            )
          }
        }
      })
      return reduced
    }

    // Rows cant have labels, so we need to handle them differently
    if (field.type === 'row' && 'fields' in field) {
      reduced.push(
        ...reduceFieldsToOptions({
          fieldPermissions,
          fields: field.fields,
          i18n,
          labelPrefix,
          pathPrefix,
        }),
      )
      return reduced
    }

    if (field.type === 'collapsible' && 'fields' in field) {
      const localizedTabLabel = getTranslation(field.label || '', i18n)

      const labelWithPrefix = labelPrefix
        ? labelPrefix + ' > ' + localizedTabLabel
        : localizedTabLabel

      reduced.push(
        ...reduceFieldsToOptions({
          fieldPermissions,
          fields: field.fields,
          i18n,
          labelPrefix: labelWithPrefix,
          pathPrefix,
        }),
      )
      return reduced
    }

    if (field.type === 'group' && 'fields' in field) {
      const translatedLabel = getTranslation(field.label || '', i18n)

      const labelWithPrefix = labelPrefix
        ? translatedLabel
          ? labelPrefix + ' > ' + translatedLabel
          : labelPrefix
        : translatedLabel

      if (fieldAffectsData(field)) {
        // Make sure we handle deeply nested groups
        const pathWithPrefix = field.name
          ? pathPrefix
            ? pathPrefix + '.' + field.name
            : field.name
          : pathPrefix

        reduced.push(
          ...reduceFieldsToOptions({
            fieldPermissions:
              typeof fieldPermissions === 'boolean'
                ? fieldPermissions
                : fieldPermissions?.[field.name]?.fields || fieldPermissions?.[field.name],
            fields: field.fields,
            i18n,
            labelPrefix: labelWithPrefix,
            pathPrefix: pathWithPrefix,
          }),
        )
      } else {
        reduced.push(
          ...reduceFieldsToOptions({
            fieldPermissions,
            fields: field.fields,
            i18n,
            labelPrefix: labelWithPrefix,
            pathPrefix,
          }),
        )
      }

      return reduced
    }

    if (field.type === 'array' && 'fields' in field) {
      const translatedLabel = getTranslation(field.label || '', i18n)

      const labelWithPrefix = labelPrefix
        ? translatedLabel
          ? labelPrefix + ' > ' + translatedLabel
          : labelPrefix
        : translatedLabel

      // Make sure we handle deeply nested groups
      const pathWithPrefix = field.name
        ? pathPrefix
          ? pathPrefix + '.' + field.name
          : field.name
        : pathPrefix

      reduced.push(
        ...reduceFieldsToOptions({
          fieldPermissions:
            typeof fieldPermissions === 'boolean'
              ? fieldPermissions
              : fieldPermissions?.[field.name]?.fields || fieldPermissions?.[field.name],
          fields: field.fields,
          i18n,
          labelPrefix: labelWithPrefix,
          pathPrefix: pathWithPrefix,
        }),
      )

      return reduced
    }

    if (typeof fieldTypeConditions[field.type] === 'object') {
      if (
        fieldIsID(field) ||
        fieldPermissions === true ||
        fieldPermissions?.[field.name] === true ||
        fieldPermissions?.[field.name]?.read === true
      ) {
        const operatorKeys = new Set()

        const { validOperators } = getValidFieldOperators({
          field,
        })

        const operators = validOperators.reduce((acc, operator) => {
          if (!operatorKeys.has(operator.value)) {
            operatorKeys.add(operator.value)
            const operatorKey = `operators:${operator.label}` as ClientTranslationKeys
            acc.push({
              ...operator,
              label: i18n.t(operatorKey),
            })
          }

          return acc
        }, [])

        const localizedLabel = getTranslation(field.label || '', i18n)

        const formattedLabel = labelPrefix
          ? combineFieldLabel({
              field,
              prefix: labelPrefix,
            })
          : localizedLabel

        // For virtual fields, we use just the pathPrefix (the virtual path) without appending the field name
        // For regular fields, we use createNestedClientFieldPath which appends the field name to the path
        let fieldPath: string
        if (shouldIgnoreFieldName) {
          fieldPath = pathPrefix
        } else if (pathPrefix) {
          fieldPath = createNestedClientFieldPath(pathPrefix, field)
        } else {
          fieldPath = field.name
        }

        const formattedField: ReducedField = {
          label: formattedLabel,
          plainTextLabel: `${labelPrefix ? labelPrefix + ' > ' : ''}${localizedLabel}`,
          value: fieldPath,
          ...fieldTypeConditions[field.type],
          field,
          operators,
        }

        reduced.push(formattedField)
        return reduced
      }
    }
    return reduced
  }, [])
}
```

--------------------------------------------------------------------------------

---[FILE: reduceFieldsToValuesWithValidation.ts]---
Location: payload-main/packages/ui/src/utilities/reduceFieldsToValuesWithValidation.ts

```typescript
import type { Data, FormState } from 'payload'

import { unflatten as flatleyUnflatten } from 'payload/shared'

type ReturnType = {
  data: Data
  valid: boolean
}

/**
 * Reduce flattened form fields (Fields) to just map to the respective values instead of the full FormField object
 *
 * @param unflatten This also unflattens the data if `unflatten` is true. The unflattened data should match the original data structure
 * @param ignoreDisableFormData - if true, will include fields that have `disableFormData` set to true, for example, blocks or arrays fields.
 *
 */
export const reduceFieldsToValuesWithValidation = (
  fields: FormState,
  unflatten?: boolean,
  ignoreDisableFormData?: boolean,
): ReturnType => {
  const state: ReturnType = {
    data: {},
    valid: true,
  }

  if (!fields) {
    return state
  }

  Object.keys(fields).forEach((key) => {
    if (ignoreDisableFormData === true || !fields[key]?.disableFormData) {
      state.data[key] = fields[key]?.value
      if (!fields[key].valid) {
        state.valid = false
      }
    }
  })

  if (unflatten) {
    state.data = flatleyUnflatten(state.data)
  }

  return state
}
```

--------------------------------------------------------------------------------

---[FILE: removeUndefined.ts]---
Location: payload-main/packages/ui/src/utilities/removeUndefined.ts

```typescript
export function removeUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as T
}
```

--------------------------------------------------------------------------------

---[FILE: renderTable.tsx]---
Location: payload-main/packages/ui/src/utilities/renderTable.tsx
Signals: React

```typescript
import type {
  ClientCollectionConfig,
  ClientConfig,
  ClientField,
  CollectionConfig,
  Column,
  ColumnPreference,
  Field,
  ImportMap,
  ListQuery,
  PaginatedDocs,
  Payload,
  PayloadRequest,
  SanitizedCollectionConfig,
  SanitizedFieldsPermissions,
  ViewTypes,
} from 'payload'

import { getTranslation, type I18nClient } from '@payloadcms/translations'
import { fieldAffectsData, fieldIsHiddenOrDisabled } from 'payload/shared'
import React from 'react'

import type { BuildColumnStateArgs } from '../providers/TableColumns/buildColumnState/index.js'

import { RenderServerComponent } from '../elements/RenderServerComponent/index.js'
import {
  GroupByHeader,
  GroupByPageControls,
  OrderableTable,
  Pill,
  SelectAll,
  SelectionProvider,
  SelectRow,
  SortHeader,
  SortRow,
  Table,
  // eslint-disable-next-line payload/no-imports-from-exports-dir -- these MUST reference the exports dir: https://github.com/payloadcms/payload/issues/12002#issuecomment-2791493587
} from '../exports/client/index.js'
import { filterFieldsWithPermissions } from '../providers/TableColumns/buildColumnState/filterFieldsWithPermissions.js'
import { buildColumnState } from '../providers/TableColumns/buildColumnState/index.js'

export const renderFilters = (
  fields: Field[],
  importMap: ImportMap,
): Map<string, React.ReactNode> =>
  fields.reduce(
    (acc, field) => {
      if (fieldIsHiddenOrDisabled(field)) {
        return acc
      }

      if ('name' in field && field.admin?.components?.Filter) {
        acc.set(
          field.name,
          RenderServerComponent({
            Component: field.admin.components?.Filter,
            importMap,
          }),
        )
      }

      return acc
    },
    new Map() as Map<string, React.ReactNode>,
  )

export const renderTable = ({
  clientCollectionConfig,
  clientConfig,
  collectionConfig,
  collections,
  columns,
  customCellProps,
  data,
  enableRowSelections,
  fieldPermissions,
  groupByFieldPath,
  groupByValue,
  heading,
  i18n,
  key = 'table',
  orderableFieldName,
  payload,
  query,
  renderRowTypes,
  req,
  tableAppearance,
  useAsTitle,
  viewType,
}: {
  clientCollectionConfig?: ClientCollectionConfig
  clientConfig?: ClientConfig
  collectionConfig?: SanitizedCollectionConfig
  collections?: string[]
  columns: ColumnPreference[]
  customCellProps?: Record<string, unknown>
  data?: PaginatedDocs | undefined
  drawerSlug?: string
  enableRowSelections: boolean
  fieldPermissions?: SanitizedFieldsPermissions
  groupByFieldPath?: string
  groupByValue?: string
  heading?: string
  i18n: I18nClient
  key?: string
  orderableFieldName: string
  payload: Payload
  query?: ListQuery
  renderRowTypes?: boolean
  req?: PayloadRequest
  tableAppearance?: 'condensed' | 'default'
  useAsTitle: CollectionConfig['admin']['useAsTitle']
  viewType?: ViewTypes
}): {
  columnState: Column[]
  Table: React.ReactNode
} => {
  // Ensure that columns passed as args comply with the field config, i.e. `hidden`, `disableListColumn`, etc.

  let columnState: Column[]
  let clientFields: ClientField[] = clientCollectionConfig?.fields || []
  let serverFields: Field[] = collectionConfig?.fields || []
  const isPolymorphic = collections

  const isGroupingBy = Boolean(collectionConfig?.admin?.groupBy && query?.groupBy)

  if (isPolymorphic) {
    clientFields = []
    serverFields = []

    for (const collection of collections) {
      const clientCollectionConfig = clientConfig.collections.find(
        (each) => each.slug === collection,
      )

      for (const field of filterFieldsWithPermissions({
        fieldPermissions,
        fields: clientCollectionConfig.fields,
      })) {
        if (fieldAffectsData(field)) {
          if (clientFields.some((each) => fieldAffectsData(each) && each.name === field.name)) {
            continue
          }
        }

        clientFields.push(field)
      }

      const serverCollectionConfig = payload.collections[collection].config

      for (const field of filterFieldsWithPermissions<Field>({
        fieldPermissions,
        fields: serverCollectionConfig.fields,
      })) {
        if (fieldAffectsData(field)) {
          if (serverFields.some((each) => fieldAffectsData(each) && each.name === field.name)) {
            continue
          }
        }

        serverFields.push(field)
      }
    }
  }

  const sharedArgs: Pick<
    BuildColumnStateArgs,
    | 'clientFields'
    | 'columns'
    | 'customCellProps'
    | 'enableRowSelections'
    | 'fieldPermissions'
    | 'i18n'
    | 'payload'
    | 'req'
    | 'serverFields'
    | 'useAsTitle'
    | 'viewType'
  > = {
    clientFields,
    columns,
    enableRowSelections,
    fieldPermissions,
    i18n,
    // sortColumnProps,
    customCellProps,
    payload,
    req,
    serverFields,
    useAsTitle,
    viewType,
  }

  if (isPolymorphic) {
    columnState = buildColumnState({
      ...sharedArgs,
      collectionSlug: undefined,
      dataType: 'polymorphic',
      docs: data?.docs || [],
    })
  } else {
    columnState = buildColumnState({
      ...sharedArgs,
      collectionSlug: clientCollectionConfig.slug,
      dataType: 'monomorphic',
      docs: data?.docs || [],
    })
  }

  const columnsToUse = [...columnState]

  if (renderRowTypes) {
    columnsToUse.unshift({
      accessor: 'collection',
      active: true,
      field: {
        admin: {
          disabled: true,
        },
        hidden: true,
      },
      Heading: i18n.t('version:type'),
      renderedCells: (data?.docs || []).map((doc, i) => (
        <Pill key={i} size="small">
          {getTranslation(
            collections
              ? payload.collections[doc.relationTo].config.labels.singular
              : clientCollectionConfig.labels.singular,
            i18n,
          )}
        </Pill>
      )),
    } as Column)
  }

  if (enableRowSelections) {
    columnsToUse.unshift({
      accessor: '_select',
      active: true,
      field: {
        admin: {
          disabled: true,
        },
        hidden: true,
      },
      Heading: <SelectAll />,
      renderedCells: (data?.docs || []).map((_, i) => (
        <SelectRow key={i} rowData={data?.docs[i]} />
      )),
    } as Column)
  }

  if (isGroupingBy) {
    return {
      columnState,
      // key is required since Next.js 15.2.0 to prevent React key error
      Table: (
        <div
          className={['table-wrap', groupByValue !== undefined && `table-wrap--group-by`]
            .filter(Boolean)
            .join(' ')}
          key={key}
        >
          <SelectionProvider docs={data?.docs || []} totalDocs={data?.totalDocs || 0}>
            <GroupByHeader
              collectionConfig={clientCollectionConfig}
              groupByFieldPath={groupByFieldPath}
              groupByValue={groupByValue}
              heading={heading}
            />
            <Table appearance={tableAppearance} columns={columnsToUse} data={data?.docs || []} />
            <GroupByPageControls
              collectionConfig={clientCollectionConfig}
              data={data}
              groupByValue={groupByValue}
            />
          </SelectionProvider>
        </div>
      ),
    }
  }

  if (!orderableFieldName) {
    return {
      columnState,
      // key is required since Next.js 15.2.0 to prevent React key error
      Table: (
        <div className="table-wrap" key={key}>
          <Table appearance={tableAppearance} columns={columnsToUse} data={data?.docs || []} />
        </div>
      ),
    }
  }

  columnsToUse.unshift({
    accessor: '_dragHandle',
    active: true,
    field: {
      admin: {
        disabled: true,
      },
      hidden: true,
    },
    Heading: <SortHeader />,
    renderedCells: (data?.docs || []).map((_, i) => <SortRow key={i} />),
  } as Column)

  return {
    columnState,
    // key is required since Next.js 15.2.0 to prevent React key error
    Table: (
      <div className="table-wrap" key={key}>
        <OrderableTable
          appearance={tableAppearance}
          collection={clientCollectionConfig}
          columns={columnsToUse}
          data={data?.docs || []}
        />
      </div>
    ),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: resolveFilterOptions.ts]---
Location: payload-main/packages/ui/src/utilities/resolveFilterOptions.ts

```typescript
import type { FilterOptions, FilterOptionsProps, ResolvedFilterOptions } from 'payload'

export const resolveFilterOptions = async (
  filterOptions: FilterOptions,
  options: { relationTo: string | string[] } & Omit<FilterOptionsProps, 'relationTo'>,
): Promise<ResolvedFilterOptions> => {
  const { relationTo } = options

  const relations = Array.isArray(relationTo) ? relationTo : [relationTo]

  const query = {}

  if (typeof filterOptions !== 'undefined') {
    await Promise.all(
      relations.map(async (relation) => {
        query[relation] =
          typeof filterOptions === 'function'
            ? await filterOptions({ ...options, relationTo: relation })
            : filterOptions

        if (query[relation] === true) {
          query[relation] = {}
        }

        // this is an ugly way to prevent results from being returned
        if (query[relation] === false) {
          query[relation] = { id: { exists: false } }
        }
      }),
    )
  }

  return query
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeFilterOptionsQuery.ts]---
Location: payload-main/packages/ui/src/utilities/sanitizeFilterOptionsQuery.ts

```typescript
import type { Where } from 'payload'

export const sanitizeFilterOptionsQuery = (query: Where): Where => {
  for (const key in query) {
    const value = query[key]
    if ((key.toLowerCase() === 'and' || key.toLowerCase() === 'or') && Array.isArray(value)) {
      for (const val of value) {
        sanitizeFilterOptionsQuery(val)
      }
    } else if (
      value &&
      typeof value === 'object' &&
      'in' in value &&
      Array.isArray(value.in) &&
      value.in.length === 0
    ) {
      {
        query[key] = { exists: false }
      }
    }
  }

  return query
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeID.ts]---
Location: payload-main/packages/ui/src/utilities/sanitizeID.ts

```typescript
export function sanitizeID(id: number | string): number | string {
  if (id === undefined) {
    return id
  }

  if (typeof id === 'number') {
    return id
  }

  return decodeURIComponent(id)
}
```

--------------------------------------------------------------------------------

---[FILE: schedulePublishHandler.ts]---
Location: payload-main/packages/ui/src/utilities/schedulePublishHandler.ts

```typescript
import { canAccessAdmin, type PayloadRequest, type SchedulePublishTaskInput } from 'payload'

export type SchedulePublishHandlerArgs = {
  date?: Date
  /**
   * The job id to delete to remove a scheduled publish event
   */
  deleteID?: number | string
  req: PayloadRequest
  timezone?: string
} & SchedulePublishTaskInput

export const schedulePublishHandler = async ({
  type,
  date,
  deleteID,
  doc,
  global,
  locale,
  req,
  timezone,
}: SchedulePublishHandlerArgs) => {
  const { i18n, payload, user } = req

  await canAccessAdmin({ req })

  try {
    if (deleteID) {
      await payload.delete({
        collection: 'payload-jobs',
        req,
        where: { id: { equals: deleteID } },
      })
    }

    await payload.jobs.queue({
      input: {
        type,
        doc,
        global,
        locale,
        timezone,
        user: user.id,
      },
      task: 'schedulePublish',
      waitUntil: date,
    })
  } catch (err) {
    let error

    if (deleteID) {
      error = `Error deleting scheduled publish event with ID ${deleteID}`
    } else {
      error = `Error scheduling ${type} for `
      if (doc) {
        error += `document with ID ${doc.value} in collection ${doc.relationTo}`
      }
    }

    payload.logger.error(error)
    payload.logger.error(err)

    return {
      error,
    }
  }

  return { message: i18n.t('general:success') }
}
```

--------------------------------------------------------------------------------

---[FILE: scrollToID.ts]---
Location: payload-main/packages/ui/src/utilities/scrollToID.ts

```typescript
export const scrollToID = (id: string): void => {
  const element = document.getElementById(id)

  if (element) {
    const bounds = element.getBoundingClientRect()
    window.scrollBy({
      behavior: 'smooth',
      top: bounds.top - 100,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: setsAreEqual.ts]---
Location: payload-main/packages/ui/src/utilities/setsAreEqual.ts

```typescript
/**
 * Function to determine whether two sets are equal or not.
 */
export const setsAreEqual = <T>(lhs: Set<T>, rhs: Set<T>) => {
  return lhs.size === rhs.size && Array.from(lhs).every((value) => rhs.has(value))
}
```

--------------------------------------------------------------------------------

---[FILE: traverseForLocalizedFields.ts]---
Location: payload-main/packages/ui/src/utilities/traverseForLocalizedFields.ts

```typescript
import type { ClientField } from 'payload'

export const traverseForLocalizedFields = (fields: ClientField[]): boolean => {
  for (const field of fields) {
    if ('localized' in field && field.localized) {
      return true
    }

    switch (field.type) {
      case 'array':
      case 'collapsible':
      case 'group':
      case 'row':
        if (field.fields && traverseForLocalizedFields(field.fields)) {
          return true
        }
        break

      case 'blocks':
        if (field.blocks) {
          for (const block of field.blocks) {
            if (block.fields && traverseForLocalizedFields(block.fields)) {
              return true
            }
          }
        }
        break

      case 'tabs':
        if (field.tabs) {
          for (const tab of field.tabs) {
            if ('localized' in tab && tab.localized) {
              return true
            }
            if ('fields' in tab && tab.fields && traverseForLocalizedFields(tab.fields)) {
              return true
            }
          }
        }
        break
    }
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: upsertPreferences.ts]---
Location: payload-main/packages/ui/src/utilities/upsertPreferences.ts
Signals: React

```typescript
import type { DefaultDocumentIDType, Payload, PayloadRequest } from 'payload'

import { dequal } from 'dequal/lite'
import { cache } from 'react'

import { removeUndefined } from './removeUndefined.js'

type PreferenceDoc<T> = {
  id: DefaultDocumentIDType | undefined
  value?: T | undefined
}

type DefaultMerge = <T>(existingValue: T, incomingValue: T | undefined) => T

const defaultMerge: DefaultMerge = <T>(existingValue: T, incomingValue: T | undefined) =>
  ({
    ...(typeof existingValue === 'object' ? existingValue : {}), // Shallow merge existing prefs to acquire any missing keys from incoming value
    ...removeUndefined(incomingValue || {}),
  }) as T

export const getPreferences = cache(
  async <T>(
    key: string,
    payload: Payload,
    userID: DefaultDocumentIDType,
    userSlug: string,
  ): Promise<PreferenceDoc<T>> => {
    const result = (await payload
      .find({
        collection: 'payload-preferences',
        depth: 0,
        limit: 1,
        pagination: false,
        where: {
          and: [
            {
              key: {
                equals: key,
              },
            },
            {
              'user.relationTo': {
                equals: userSlug,
              },
            },
            {
              'user.value': {
                equals: userID,
              },
            },
          ],
        },
      })
      .then((res) => res.docs?.[0])) as { id: DefaultDocumentIDType; value: T }

    return result
  },
)

/**
 * Will update the given preferences by key, creating a new record if it doesn't already exist, or merging existing preferences with the new value.
 * This is not possible to do with the existing `db.upsert` operation because it stores on the `value` key and does not perform a deep merge beyond the first level.
 * I.e. if you have a preferences record with a `value` key, `db.upsert` will overwrite the existing value. In the future if this supported we should use that instead.
 * @param req - The PayloadRequest object
 * @param key - The key of the preferences to update
 * @param value - The new value to merge with the existing preferences
 */
export const upsertPreferences = async <T extends Record<string, unknown> | string>({
  customMerge,
  key,
  req,
  value: incomingValue,
}: {
  customMerge?: (existingValue: T, incomingValue: T, defaultMerge: DefaultMerge) => T
  key: string
  req: PayloadRequest
  value: T
}): Promise<T> => {
  const existingPrefs: PreferenceDoc<T> = req.user
    ? await getPreferences<T>(key, req.payload, req.user.id, req.user.collection)
    : ({} as PreferenceDoc<T>)

  let newPrefs = existingPrefs?.value

  if (!existingPrefs?.id) {
    await req.payload.create({
      collection: 'payload-preferences',
      data: {
        key,
        user: {
          collection: req.user.collection,
          value: req.user.id,
        },
        value: incomingValue,
      },
      depth: 0,
      disableTransaction: true,
      user: req.user,
    })
  } else {
    let mergedPrefs: T

    if (typeof customMerge === 'function') {
      mergedPrefs = customMerge(existingPrefs.value, incomingValue, defaultMerge)
    } else {
      // Strings are valid JSON, i.e. `locale` saved as a string to the locale preferences
      mergedPrefs =
        typeof incomingValue === 'object'
          ? defaultMerge<T>(existingPrefs.value, incomingValue)
          : incomingValue
    }

    if (!dequal(mergedPrefs, existingPrefs.value)) {
      newPrefs = await req.payload
        .update({
          id: existingPrefs.id,
          collection: 'payload-preferences',
          data: {
            key,
            user: {
              collection: req.user.collection,
              value: req.user.id,
            },
            value: mergedPrefs,
          },
          depth: 0,
          disableTransaction: true,
          user: req.user,
        })
        ?.then((res) => res.value)
    }
  }

  return newPrefs
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/ui/src/utilities/buildClientFieldSchemaMap/index.ts

```typescript
import type { I18n } from '@payloadcms/translations'
import type {
  ClientConfig,
  ClientField,
  ClientFieldSchemaMap,
  FieldSchemaMap,
  Payload,
  TextFieldClient,
} from 'payload'

import { traverseFields } from './traverseFields.js'

const baseAuthFields: ClientField[] = [
  {
    name: 'password',
    type: 'text',
    required: true,
  },
  {
    name: 'confirm-password',
    type: 'text',
    required: true,
  },
]

/**
 * Flattens the config fields into a map of field schemas
 */
export const buildClientFieldSchemaMap = (args: {
  collectionSlug?: string
  config: ClientConfig
  globalSlug?: string
  i18n: I18n
  payload: Payload
  schemaMap: FieldSchemaMap
}): { clientFieldSchemaMap: ClientFieldSchemaMap } => {
  const { collectionSlug, config, globalSlug, i18n, payload, schemaMap } = args

  const clientSchemaMap: ClientFieldSchemaMap = new Map()

  if (collectionSlug) {
    const matchedCollection = config.collections.find(
      (collection) => collection.slug === collectionSlug,
    )

    if (matchedCollection) {
      let fieldsToSet = matchedCollection?.fields || []

      if (matchedCollection.auth && !matchedCollection.auth.disableLocalStrategy) {
        ;(baseAuthFields[0] as TextFieldClient).label = i18n.t('general:password')
        ;(baseAuthFields[1] as TextFieldClient).label = i18n.t('authentication:confirmPassword')
        // Place these fields _last_ to ensure they do not disrupt field paths in the field schema map
        fieldsToSet = fieldsToSet.concat(baseAuthFields)
      }

      clientSchemaMap.set(collectionSlug, {
        fields: fieldsToSet,
      })

      traverseFields({
        clientSchemaMap,
        config,
        fields: fieldsToSet,
        i18n,
        parentIndexPath: '',
        parentSchemaPath: collectionSlug,
        payload,
        schemaMap,
      })
    }
  } else if (globalSlug) {
    const matchedGlobal = config.globals.find((global) => global.slug === globalSlug)

    if (matchedGlobal) {
      clientSchemaMap.set(globalSlug, {
        fields: matchedGlobal.fields,
      })

      traverseFields({
        clientSchemaMap,
        config,
        fields: matchedGlobal.fields,
        i18n,
        parentIndexPath: '',
        parentSchemaPath: globalSlug,
        payload,
        schemaMap,
      })
    }
  }

  return { clientFieldSchemaMap: clientSchemaMap }
}
```

--------------------------------------------------------------------------------

---[FILE: traverseFields.ts]---
Location: payload-main/packages/ui/src/utilities/buildClientFieldSchemaMap/traverseFields.ts

```typescript
import type { I18n } from '@payloadcms/translations'

import {
  type ClientConfig,
  type ClientField,
  type ClientFieldSchemaMap,
  createClientFields,
  type Field,
  type FieldSchemaMap,
  type Payload,
} from 'payload'
import { fieldAffectsData, getFieldPaths, tabHasName } from 'payload/shared'

type Args = {
  clientSchemaMap: ClientFieldSchemaMap
  config: ClientConfig
  fields: ClientField[]
  i18n: I18n<any, any>
  parentIndexPath: string
  parentSchemaPath: string
  payload: Payload
  schemaMap: FieldSchemaMap
}

export const traverseFields = ({
  clientSchemaMap,
  config,
  fields,
  i18n,
  parentIndexPath,
  parentSchemaPath,
  payload,
  schemaMap,
}: Args) => {
  for (const [index, field] of fields.entries()) {
    const { indexPath, schemaPath } = getFieldPaths({
      field,
      index,
      parentIndexPath: 'name' in field ? '' : parentIndexPath,
      parentPath: '',
      parentSchemaPath,
    })

    clientSchemaMap.set(schemaPath, field)

    switch (field.type) {
      case 'array': {
        traverseFields({
          clientSchemaMap,
          config,
          fields: field.fields,
          i18n,
          parentIndexPath: '',
          parentSchemaPath: schemaPath,
          payload,
          schemaMap,
        })

        break
      }

      case 'blocks':
        ;(field.blockReferences ?? field.blocks).map((_block) => {
          const block =
            typeof _block === 'string'
              ? config.blocksMap
                ? config.blocksMap[_block]
                : config.blocks.find((block) => typeof block !== 'string' && block.slug === _block)
              : _block

          const blockSchemaPath = `${schemaPath}.${block.slug}`

          clientSchemaMap.set(blockSchemaPath, block)
          traverseFields({
            clientSchemaMap,
            config,
            fields: block.fields,
            i18n,
            parentIndexPath: '',
            parentSchemaPath: blockSchemaPath,
            payload,
            schemaMap,
          })
        })

        break

      case 'collapsible':
      case 'row':
        traverseFields({
          clientSchemaMap,
          config,
          fields: field.fields,
          i18n,
          parentIndexPath: indexPath,
          parentSchemaPath,
          payload,
          schemaMap,
        })
        break

      case 'group': {
        if (fieldAffectsData(field)) {
          traverseFields({
            clientSchemaMap,
            config,
            fields: field.fields,
            i18n,
            parentIndexPath: '',
            parentSchemaPath: schemaPath,
            payload,
            schemaMap,
          })
        } else {
          traverseFields({
            clientSchemaMap,
            config,
            fields: field.fields,
            i18n,
            parentIndexPath: indexPath,
            parentSchemaPath,
            payload,
            schemaMap,
          })
        }
        break
      }

      case 'richText': {
        // richText sub-fields are not part of the ClientConfig or the Config.
        // They only exist in the field schema map.
        // Thus, we need to
        // 1. get them from the field schema map
        // 2. convert them to client fields
        // 3. add them to the client schema map

        // So these would basically be all fields that are not part of the client config already
        const richTextFieldSchemaMap: FieldSchemaMap = new Map()
        for (const [path, subField] of schemaMap.entries()) {
          if (path.startsWith(`${schemaPath}.`)) {
            richTextFieldSchemaMap.set(path, subField)
          }
        }

        // Now loop through them, convert each entry to a client field and add it to the client schema map
        for (const [path, subField] of richTextFieldSchemaMap.entries()) {
          // check if fields is the only key in the subField object
          const isFieldsOnly = Object.keys(subField).length === 1 && 'fields' in subField

          const clientFields = createClientFields({
            defaultIDType: payload.config.db.defaultIDType,
            disableAddingID: true,
            fields: isFieldsOnly ? subField.fields : [subField as Field],
            i18n,
            importMap: payload.importMap,
          })

          clientSchemaMap.set(
            path,
            isFieldsOnly
              ? {
                  fields: clientFields,
                }
              : clientFields[0],
          )
        }
        break
      }

      case 'tabs':
        field.tabs.map((tab, tabIndex) => {
          const isNamedTab = tabHasName(tab)

          const { indexPath: tabIndexPath, schemaPath: tabSchemaPath } = getFieldPaths({
            field: {
              ...tab,
              type: 'tab',
            },
            index: tabIndex,
            parentIndexPath: indexPath,
            parentPath: '',
            parentSchemaPath,
          })

          clientSchemaMap.set(tabSchemaPath, tab)

          traverseFields({
            clientSchemaMap,
            config,
            fields: tab.fields,
            i18n,
            parentIndexPath: isNamedTab ? '' : tabIndexPath,
            parentSchemaPath: isNamedTab ? tabSchemaPath : parentSchemaPath,
            payload,
            schemaMap,
          })
        })

        break
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/ui/src/utilities/buildFieldSchemaMap/index.ts

```typescript
import type { I18n } from '@payloadcms/translations'
import type { Field, FieldSchemaMap, SanitizedConfig, TextField } from 'payload'

import { confirmPassword, password } from 'payload/shared'

import { traverseFields } from './traverseFields.js'

const baseAuthFields: Field[] = [
  {
    name: 'password',
    type: 'text',
    required: true,
    validate: password,
  },
  {
    name: 'confirm-password',
    type: 'text',
    required: true,
    validate: confirmPassword,
  },
]

/**
 * Flattens the config fields into a map of field schemas
 */
export const buildFieldSchemaMap = (args: {
  collectionSlug?: string
  config: SanitizedConfig
  globalSlug?: string
  i18n: I18n
}): { fieldSchemaMap: FieldSchemaMap } => {
  const { collectionSlug, config, globalSlug, i18n } = args

  const schemaMap: FieldSchemaMap = new Map()

  if (collectionSlug) {
    const matchedCollection = config.collections.find(
      (collection) => collection.slug === collectionSlug,
    )

    if (matchedCollection) {
      let fieldsToSet = matchedCollection?.fields || []

      if (matchedCollection.auth && !matchedCollection.auth.disableLocalStrategy) {
        ;(baseAuthFields[0] as TextField).label = i18n.t('general:password')
        ;(baseAuthFields[1] as TextField).label = i18n.t('authentication:confirmPassword')
        // Place these fields _last_ to ensure they do not disrupt field paths in the field schema map
        fieldsToSet = fieldsToSet.concat(baseAuthFields)
      }

      schemaMap.set(collectionSlug, {
        fields: fieldsToSet,
      })

      traverseFields({
        config,
        fields: fieldsToSet,
        i18n,
        parentIndexPath: '',
        parentSchemaPath: collectionSlug,
        schemaMap,
      })
    }
  } else if (globalSlug) {
    const matchedGlobal = config.globals.find((global) => global.slug === globalSlug)

    if (matchedGlobal) {
      schemaMap.set(globalSlug, {
        fields: matchedGlobal.fields,
      })

      traverseFields({
        config,
        fields: matchedGlobal.fields,
        i18n,
        parentIndexPath: '',
        parentSchemaPath: globalSlug,
        schemaMap,
      })
    }
  }

  return { fieldSchemaMap: schemaMap }
}
```

--------------------------------------------------------------------------------

````
