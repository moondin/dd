---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 398
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 398 of 695)

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
Location: payload-main/packages/ui/src/forms/fieldSchemasToFormState/index.tsx

```typescript
import type {
  BuildFormStateArgs,
  ClientFieldSchemaMap,
  Data,
  DocumentPreferences,
  Field,
  FieldSchemaMap,
  FormState,
  FormStateWithoutComponents,
  PayloadRequest,
  SanitizedFieldsPermissions,
  SelectMode,
  SelectType,
} from 'payload'

import type { RenderFieldMethod } from './types.js'

import { calculateDefaultValues } from './calculateDefaultValues/index.js'
import { iterateFields } from './iterateFields.js'

type Args = {
  /**
   * The client field schema map is required for field rendering.
   * If fields should not be rendered (=> `renderFieldFn` is not provided),
   * then the client field schema map is not required.
   */
  clientFieldSchemaMap?: ClientFieldSchemaMap
  collectionSlug?: string
  data?: Data
  /**
   * If this is undefined, the `data` passed to this function will serve as `fullData` and `data` when iterating over
   * the top-level-fields to generate form state.
   * For sub fields, the `data` will be narrowed down to the sub fields, while `fullData` remains the same.
   *
   * Usually, the `data` passed to this function will be the document data. This means that running validation, read access control
   * or executing filterOptions here will have access to the full document through the passed `fullData` parameter, and that `fullData` and `data` will be identical.
   *
   * In some cases however, this function is used to generate form state solely for sub fields - independent from the parent form state.
   * This means that `data` will be the form state of the sub fields - the document data won't be available here.
   *
   * In these cases, you can pass `documentData` which will be used as `fullData` instead of `data`.
   *
   * This is useful for lexical blocks, as lexical block fields there are not part of the parent form state, yet we still want
   * document data to be available for validation and filterOptions, under the `data` key.
   */
  documentData?: Data
  fields: Field[] | undefined
  /**
   * The field schema map is required for field rendering.
   * If fields should not be rendered (=> `renderFieldFn` is not provided),
   * then the field schema map is not required.
   */
  fieldSchemaMap: FieldSchemaMap | undefined
  id?: number | string
  /**
   * Validation, filterOptions and read access control will receive the `blockData`, which is the data of the nearest parent block. You can pass in
   * the initial block data here, which will be used as `blockData` for the top-level fields, until the first block is encountered.
   */
  initialBlockData?: Data
  mockRSCs?: BuildFormStateArgs['mockRSCs']
  operation?: 'create' | 'update'
  permissions: SanitizedFieldsPermissions
  preferences: DocumentPreferences
  /**
   * Optionally accept the previous form state,
   * to be able to determine if custom fields need to be re-rendered.
   */
  previousFormState?: FormState
  readOnly?: boolean
  /**
   * If renderAllFields is true, then no matter what is in previous form state,
   * all custom fields will be re-rendered.
   */
  renderAllFields: boolean
  renderFieldFn?: RenderFieldMethod
  req: PayloadRequest
  schemaPath: string
  select?: SelectType
  selectMode?: SelectMode
  skipValidation?: boolean
}

export const fieldSchemasToFormState = async ({
  id,
  clientFieldSchemaMap,
  collectionSlug,
  data = {},
  documentData,
  fields,
  fieldSchemaMap,
  initialBlockData,
  mockRSCs,
  operation,
  permissions,
  preferences,
  previousFormState,
  readOnly,
  renderAllFields,
  renderFieldFn,
  req,
  schemaPath,
  select,
  selectMode,
  skipValidation,
}: Args): Promise<FormState> => {
  if (!clientFieldSchemaMap && renderFieldFn) {
    // eslint-disable-next-line no-console
    console.warn(
      'clientFieldSchemaMap is not passed to fieldSchemasToFormState - this will reduce performance',
    )
  }

  if (fields && fields.length) {
    const state: FormStateWithoutComponents = {}

    const dataWithDefaultValues = { ...data }

    await calculateDefaultValues({
      id,
      data: dataWithDefaultValues,
      fields,
      locale: req.locale,
      req,
      select,
      selectMode,
      siblingData: dataWithDefaultValues,
      user: req.user,
    })

    let fullData = dataWithDefaultValues

    if (documentData) {
      // By the time this function is used to get form state for nested forms, their default values should have already been calculated
      // => no need to run calculateDefaultValues here
      fullData = documentData
    }

    await iterateFields({
      id,
      addErrorPathToParent: null,
      blockData: initialBlockData,
      clientFieldSchemaMap,
      collectionSlug,
      data: dataWithDefaultValues,
      fields,
      fieldSchemaMap,
      fullData,
      mockRSCs,
      operation,
      parentIndexPath: '',
      parentPassesCondition: true,
      parentPath: '',
      parentSchemaPath: schemaPath,
      permissions,
      preferences,
      previousFormState,
      readOnly,
      renderAllFields,
      renderFieldFn,
      req,
      select,
      selectMode,
      skipValidation,
      state,
    })

    return state
  }

  return {}
}

export { iterateFields }
```

--------------------------------------------------------------------------------

---[FILE: isRowCollapsed.ts]---
Location: payload-main/packages/ui/src/forms/fieldSchemasToFormState/isRowCollapsed.ts

```typescript
import type { ArrayField, BlocksField, CollapsedPreferences, Row } from 'payload'

export function isRowCollapsed({
  collapsedPrefs,
  field,
  previousRow,
  row,
}: {
  collapsedPrefs: CollapsedPreferences
  field: ArrayField | BlocksField
  previousRow: Row | undefined
  row: Row
}): boolean {
  if (previousRow && 'collapsed' in previousRow) {
    return previousRow.collapsed ?? false
  }

  // If previousFormState is `undefined`, check preferences
  if (collapsedPrefs !== undefined) {
    return collapsedPrefs.includes(row.id) // Check if collapsed in preferences
  }

  // If neither exists, fallback to `field.admin.initCollapsed`
  return field.admin.initCollapsed
}
```

--------------------------------------------------------------------------------

---[FILE: iterateFields.ts]---
Location: payload-main/packages/ui/src/forms/fieldSchemasToFormState/iterateFields.ts

```typescript
import type {
  BuildFormStateArgs,
  ClientFieldSchemaMap,
  Data,
  DocumentPreferences,
  Field as FieldSchema,
  FieldSchemaMap,
  FormState,
  FormStateWithoutComponents,
  PayloadRequest,
  SanitizedFieldsPermissions,
  SelectMode,
  SelectType,
} from 'payload'

import { stripUnselectedFields } from 'payload'
import { getFieldPaths } from 'payload/shared'

import type { AddFieldStatePromiseArgs } from './addFieldStatePromise.js'
import type { RenderFieldMethod } from './types.js'

import { addFieldStatePromise } from './addFieldStatePromise.js'

type Args = {
  addErrorPathToParent: (fieldPath: string) => void
  /**
   * if any parents is localized, then the field is localized. @default false
   */
  anyParentLocalized?: boolean
  /**
   * Data of the nearest parent block, or undefined
   */
  blockData: Data | undefined
  clientFieldSchemaMap?: ClientFieldSchemaMap
  collectionSlug?: string
  data: Data
  fields: FieldSchema[]
  fieldSchemaMap: FieldSchemaMap
  filter?: (args: AddFieldStatePromiseArgs) => boolean
  /**
   * Force the value of fields like arrays or blocks to be the full value instead of the length @default false
   */
  forceFullValue?: boolean
  fullData: Data
  id?: number | string
  /**
   * Whether the field schema should be included in the state. @default false
   */
  includeSchema?: boolean
  mockRSCs?: BuildFormStateArgs['mockRSCs']
  /**
   * Whether to omit parent fields in the state. @default false
   */
  omitParents?: boolean
  /**
   * operation is only needed for validation
   */
  operation: 'create' | 'update'
  parentIndexPath: string
  parentPassesCondition?: boolean
  parentPath: string
  parentSchemaPath: string
  permissions: SanitizedFieldsPermissions
  preferences?: DocumentPreferences
  previousFormState: FormState
  readOnly?: boolean
  renderAllFields: boolean
  renderFieldFn: RenderFieldMethod
  req: PayloadRequest
  select?: SelectType
  selectMode?: SelectMode
  /**
   * Whether to skip checking the field's condition. @default false
   */
  skipConditionChecks?: boolean
  /**
   * Whether to skip validating the field. @default false
   */
  skipValidation?: boolean
  state?: FormStateWithoutComponents
}

/**
 * Flattens the fields schema and fields data
 */
export const iterateFields = async ({
  id,
  addErrorPathToParent: addErrorPathToParentArg,
  anyParentLocalized = false,
  blockData,
  clientFieldSchemaMap,
  collectionSlug,
  data,
  fields,
  fieldSchemaMap,
  filter,
  forceFullValue = false,
  fullData,
  includeSchema = false,
  mockRSCs,
  omitParents = false,
  operation,
  parentIndexPath,
  parentPassesCondition = true,
  parentPath,
  parentSchemaPath,
  permissions,
  preferences,
  previousFormState,
  readOnly,
  renderAllFields,
  renderFieldFn: renderFieldFn,
  req,
  select,
  selectMode,
  skipConditionChecks = false,
  skipValidation = false,
  state = {},
}: Args): Promise<void> => {
  const promises = []

  fields.forEach((field, fieldIndex) => {
    let passesCondition = true

    const { indexPath, path, schemaPath } = getFieldPaths({
      field,
      index: fieldIndex,
      parentIndexPath: 'name' in field ? '' : parentIndexPath,
      parentPath,
      parentSchemaPath,
    })

    if (path !== 'id') {
      const shouldContinue = stripUnselectedFields({
        field,
        select,
        selectMode,
        siblingDoc: data,
      })

      if (!shouldContinue) {
        return
      }
    }

    const pathSegments = path ? path.split('.') : []

    if (!skipConditionChecks) {
      try {
        passesCondition = Boolean(
          (field?.admin?.condition
            ? Boolean(
                field.admin.condition(fullData || {}, data || {}, {
                  blockData,
                  operation,
                  path: pathSegments,
                  user: req.user,
                }),
              )
            : true) && parentPassesCondition,
        )
      } catch (err) {
        passesCondition = false

        req.payload.logger.error({
          err,
          msg: `Error evaluating field condition at path: ${path}`,
        })
      }
    }

    promises.push(
      addFieldStatePromise({
        id,
        addErrorPathToParent: addErrorPathToParentArg,
        anyParentLocalized,
        blockData,
        clientFieldSchemaMap,
        collectionSlug,
        data,
        field,
        fieldIndex,
        fieldSchemaMap,
        filter,
        forceFullValue,
        fullData,
        includeSchema,
        indexPath,
        mockRSCs,
        omitParents,
        operation,
        parentIndexPath,
        parentPath,
        parentPermissions: permissions,
        parentSchemaPath,
        passesCondition,
        path,
        preferences,
        previousFormState,
        readOnly,
        renderAllFields,
        renderFieldFn,
        req,
        schemaPath,
        select,
        selectMode,
        skipConditionChecks,
        skipValidation,
        state,
      }),
    )
  })

  await Promise.all(promises)
}
```

--------------------------------------------------------------------------------

---[FILE: renderField.tsx]---
Location: payload-main/packages/ui/src/forms/fieldSchemasToFormState/renderField.tsx

```typescript
import type {
  ClientComponentProps,
  ClientField,
  FieldPaths,
  FlattenedBlock,
  ServerComponentProps,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { createClientField, MissingEditorProp } from 'payload'
import { fieldIsHiddenOrDisabled } from 'payload/shared'

import type { RenderFieldMethod } from './types.js'

import { RenderServerComponent } from '../../elements/RenderServerComponent/index.js'

// eslint-disable-next-line payload/no-imports-from-exports-dir -- MUST reference the exports dir: https://github.com/payloadcms/payload/issues/12002#issuecomment-2791493587
import { FieldDescription, WatchCondition } from '../../exports/client/index.js'

const defaultUIFieldComponentKeys: Array<'Cell' | 'Description' | 'Field' | 'Filter'> = [
  'Cell',
  'Description',
  'Field',
  'Filter',
]

export const renderField: RenderFieldMethod = ({
  id,
  clientFieldSchemaMap,
  collectionSlug,
  data,
  fieldConfig,
  fieldSchemaMap,
  fieldState,
  forceCreateClientField,
  formState,
  indexPath,
  lastRenderedPath,
  mockRSCs,
  operation,
  parentPath,
  parentSchemaPath,
  path,
  permissions,
  preferences,
  readOnly: readOnlyFromProps,
  renderAllFields,
  req,
  schemaPath,
  siblingData,
}) => {
  const requiresRender = renderAllFields || !lastRenderedPath || lastRenderedPath !== path

  if (!requiresRender && fieldConfig.type !== 'array' && fieldConfig.type !== 'blocks') {
    return
  }

  const clientField =
    clientFieldSchemaMap && !forceCreateClientField
      ? (clientFieldSchemaMap.get(schemaPath) as ClientField)
      : createClientField({
          defaultIDType: req.payload.config.db.defaultIDType,
          field: fieldConfig,
          i18n: req.i18n,
          importMap: req.payload.importMap,
        })

  const clientProps: ClientComponentProps & Partial<FieldPaths> = {
    field: clientField,
    path,
    permissions,
    readOnly:
      readOnlyFromProps === true
        ? true
        : typeof permissions === 'boolean'
          ? !permissions
          : !permissions?.[operation],
    schemaPath,
  }

  if (fieldState?.customComponents) {
    clientProps.customComponents = fieldState.customComponents
  }

  // fields with subfields
  if (['array', 'blocks', 'collapsible', 'group', 'row', 'tabs'].includes(fieldConfig.type)) {
    clientProps.indexPath = indexPath
    clientProps.parentPath = parentPath
    clientProps.parentSchemaPath = parentSchemaPath
  }

  const serverProps: ServerComponentProps = {
    id,
    clientField,
    clientFieldSchemaMap,
    data,
    field: fieldConfig,
    fieldSchemaMap,
    permissions,
    // TODO: Should we pass explicit values? initialValue, value, valid
    // value and initialValue should be typed
    collectionSlug,
    formState,
    i18n: req.i18n,
    operation,
    payload: req.payload,
    preferences,
    req,
    siblingData,
    user: req.user,
    value: 'name' in fieldConfig && data?.[fieldConfig.name],
  }

  switch (fieldConfig.type) {
    case 'array': {
      fieldState?.rows?.forEach((row, rowIndex) => {
        const rowLastRenderedPath = row.lastRenderedPath

        const rowPath = `${path}.${rowIndex}`

        const rowRequiresRender =
          renderAllFields || !rowLastRenderedPath || rowLastRenderedPath !== rowPath

        if (!rowRequiresRender) {
          return
        }

        row.lastRenderedPath = rowPath

        if (fieldConfig.admin?.components && 'RowLabel' in fieldConfig.admin.components) {
          if (!row.customComponents) {
            row.customComponents = {}
          }

          row.customComponents.RowLabel = !mockRSCs
            ? RenderServerComponent({
                clientProps,
                Component: fieldConfig.admin.components.RowLabel,
                importMap: req.payload.importMap,
                key: `${rowIndex}`,
                serverProps: {
                  ...serverProps,
                  rowLabel: `${getTranslation(fieldConfig.labels.singular, req.i18n)} ${String(
                    rowIndex + 1,
                  ).padStart(2, '0')}`,
                  rowNumber: rowIndex + 1,
                },
              })
            : 'Mock'
        }
      })

      break
    }

    case 'blocks': {
      fieldState?.rows?.forEach((row, rowIndex) => {
        const rowLastRenderedPath = row.lastRenderedPath

        const rowPath = `${path}.${rowIndex}`

        const rowRequiresRender =
          renderAllFields || !rowLastRenderedPath || rowLastRenderedPath !== rowPath

        if (!rowRequiresRender) {
          return
        }

        row.lastRenderedPath = rowPath

        const blockTypeToMatch: string = row.blockType

        const blockConfig =
          req.payload.blocks[blockTypeToMatch] ??
          ((fieldConfig.blockReferences ?? fieldConfig.blocks).find(
            (block) => typeof block !== 'string' && block.slug === blockTypeToMatch,
          ) as FlattenedBlock | undefined)

        if (blockConfig.admin?.components && 'Label' in blockConfig.admin.components) {
          if (!fieldState.rows[rowIndex]?.customComponents) {
            fieldState.rows[rowIndex].customComponents = {}
          }

          fieldState.rows[rowIndex].customComponents.RowLabel = !mockRSCs
            ? RenderServerComponent({
                clientProps,
                Component: blockConfig.admin.components.Label,
                importMap: req.payload.importMap,
                key: `${rowIndex}`,
                serverProps: {
                  ...serverProps,
                  blockType: row.blockType,
                  rowLabel: `${getTranslation(blockConfig.labels.singular, req.i18n)} ${String(
                    rowIndex + 1,
                  ).padStart(2, '0')}`,
                  rowNumber: rowIndex + 1,
                },
              })
            : 'Mock'
        }
      })

      break
    }
  }

  if (!requiresRender) {
    return
  }

  /**
   * Set the `lastRenderedPath` equal to the new path of the field, this will prevent it from being rendered again
   */
  fieldState.lastRenderedPath = path

  if (fieldIsHiddenOrDisabled(clientField)) {
    return
  }

  /**
   * Only create the `customComponents` object if needed.
   * This will prevent unnecessary data from being transferred to the client.
   */
  if (fieldConfig.admin) {
    if (
      (Object.keys(fieldConfig.admin.components || {}).length > 0 ||
        fieldConfig.type === 'richText' ||
        ('description' in fieldConfig.admin &&
          typeof fieldConfig.admin.description === 'function')) &&
      !fieldState?.customComponents
    ) {
      fieldState.customComponents = {}
    }
  }

  switch (fieldConfig.type) {
    case 'richText': {
      if (!fieldConfig?.editor) {
        throw new MissingEditorProp(fieldConfig) // while we allow disabling editor functionality, you should not have any richText fields defined if you do not have an editor
      }

      if (typeof fieldConfig?.editor === 'function') {
        throw new Error('Attempted to access unsanitized rich text editor.')
      }

      if (!fieldConfig.admin) {
        fieldConfig.admin = {}
      }

      if (!fieldConfig.admin.components) {
        fieldConfig.admin.components = {}
      }

      fieldState.customComponents.Field = !mockRSCs ? (
        <WatchCondition path={path}>
          {RenderServerComponent({
            clientProps,
            Component: fieldConfig.editor.FieldComponent,
            importMap: req.payload.importMap,
            serverProps: {
              ...serverProps,
              // Manually inject lexical-specific `sanitizedEditorConfig` server prop, in order to reduce the size of the field schema.
              // Otherwise, the editorConfig would be included twice - once on the top-level, and once as part of the `FieldComponent` server props.
              sanitizedEditorConfig:
                'editorConfig' in fieldConfig.editor ? fieldConfig.editor.editorConfig : undefined,
            },
          })}
        </WatchCondition>
      ) : (
        'Mock'
      )

      break
    }

    case 'ui': {
      if (fieldConfig?.admin?.components) {
        // Render any extra, untyped components
        for (const key in fieldConfig.admin.components) {
          if (key in defaultUIFieldComponentKeys) {
            continue
          }

          const Component = fieldConfig.admin.components[key]

          fieldState.customComponents[key] = !mockRSCs
            ? RenderServerComponent({
                clientProps,
                Component,
                importMap: req.payload.importMap,
                key: `field.admin.components.${key}`,
                serverProps,
              })
            : 'Mock'
        }
      }
      break
    }

    default: {
      break
    }
  }

  if (fieldConfig.admin) {
    if (
      'description' in fieldConfig.admin &&
      typeof fieldConfig.admin?.description === 'function'
    ) {
      fieldState.customComponents.Description = !mockRSCs ? (
        <FieldDescription
          description={fieldConfig.admin?.description({
            i18n: req.i18n,
            t: req.i18n.t,
          })}
          path={path}
        />
      ) : (
        'Mock'
      )
    }

    if (fieldConfig.admin?.components) {
      if ('afterInput' in fieldConfig.admin.components) {
        fieldState.customComponents.AfterInput = !mockRSCs
          ? RenderServerComponent({
              clientProps,
              Component: fieldConfig.admin.components.afterInput,
              importMap: req.payload.importMap,
              key: 'field.admin.components.afterInput',
              serverProps,
            })
          : 'Mock'
      }

      if ('beforeInput' in fieldConfig.admin.components) {
        fieldState.customComponents.BeforeInput = !mockRSCs
          ? RenderServerComponent({
              clientProps,
              Component: fieldConfig.admin.components.beforeInput,
              importMap: req.payload.importMap,
              key: 'field.admin.components.beforeInput',
              serverProps,
            })
          : 'Mock'
      }

      if ('Description' in fieldConfig.admin.components) {
        fieldState.customComponents.Description = !mockRSCs
          ? RenderServerComponent({
              clientProps,
              Component: fieldConfig.admin.components.Description,
              importMap: req.payload.importMap,
              key: 'field.admin.components.Description',
              serverProps,
            })
          : 'Mock'
      }

      if ('Error' in fieldConfig.admin.components) {
        fieldState.customComponents.Error = !mockRSCs
          ? RenderServerComponent({
              clientProps,
              Component: fieldConfig.admin.components.Error,
              importMap: req.payload.importMap,
              key: 'field.admin.components.Error',
              serverProps,
            })
          : 'Mock'
      }

      if ('Label' in fieldConfig.admin.components) {
        fieldState.customComponents.Label = !mockRSCs
          ? RenderServerComponent({
              clientProps,
              Component: fieldConfig.admin.components.Label,
              importMap: req.payload.importMap,
              key: 'field.admin.components.Label',
              serverProps,
            })
          : 'Mock'
      }

      if ('Field' in fieldConfig.admin.components) {
        fieldState.customComponents.Field = !mockRSCs ? (
          <WatchCondition path={path}>
            {RenderServerComponent({
              clientProps,
              Component: fieldConfig.admin.components.Field,
              importMap: req.payload.importMap,
              key: 'field.admin.components.Field',
              serverProps,
            })}
          </WatchCondition>
        ) : (
          'Mock'
        )
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/forms/fieldSchemasToFormState/types.ts

```typescript
import type {
  ClientFieldSchemaMap,
  Data,
  DocumentPreferences,
  Field,
  FieldSchemaMap,
  FieldState,
  FormState,
  Operation,
  PayloadRequest,
  SanitizedFieldPermissions,
} from 'payload'

export type RenderFieldArgs = {
  clientFieldSchemaMap?: ClientFieldSchemaMap
  collectionSlug: string
  data: Data
  fieldConfig: Field
  fieldSchemaMap: FieldSchemaMap
  fieldState: FieldState
  /**
   * If set to true, it will force creating a clientField based on the passed fieldConfig instead of pulling
   * the client field from the clientFieldSchemaMap. This is useful if the passed fieldConfig differs from the one in the schema map,
   * e.g. when calling the render-field server function and passing a field config override.
   */
  forceCreateClientField?: boolean
  formState: FormState
  id?: number | string
  indexPath: string
  lastRenderedPath: string
  mockRSCs?: boolean
  operation: Operation
  parentPath: string
  parentSchemaPath: string
  path: string
  permissions: SanitizedFieldPermissions
  preferences: DocumentPreferences
  previousFieldState: FieldState
  readOnly?: boolean
  renderAllFields: boolean
  req: PayloadRequest
  schemaPath: string
  siblingData: Data
}

export type RenderFieldMethod = (args: RenderFieldArgs) => void
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/ui/src/forms/fieldSchemasToFormState/calculateDefaultValues/index.ts

```typescript
import type {
  Data,
  Field as FieldSchema,
  PayloadRequest,
  SelectMode,
  SelectType,
  TypedUser,
} from 'payload'

import { iterateFields } from './iterateFields.js'

type Args = {
  data: Data
  fields: FieldSchema[]
  id?: number | string
  locale: string | undefined
  req: PayloadRequest
  select?: SelectType
  selectMode?: SelectMode
  siblingData: Data
  user: TypedUser
}

export const calculateDefaultValues = async ({
  id,
  data,
  fields,
  locale,
  req,
  select,
  selectMode,
  user,
}: Args): Promise<Data> => {
  await iterateFields({
    id,
    data,
    fields,
    locale,
    req,
    select,
    selectMode,
    siblingData: data,
    user,
  })

  return data
}
```

--------------------------------------------------------------------------------

---[FILE: iterateFields.ts]---
Location: payload-main/packages/ui/src/forms/fieldSchemasToFormState/calculateDefaultValues/iterateFields.ts

```typescript
import type {
  Data,
  Field,
  PayloadRequest,
  SelectMode,
  SelectType,
  TabAsField,
  TypedUser,
} from 'payload'

import { defaultValuePromise } from './promise.js'

type Args<T> = {
  data: T
  fields: (Field | TabAsField)[]
  id?: number | string
  locale: string | undefined
  req: PayloadRequest
  select?: SelectType
  selectMode?: SelectMode
  siblingData: Data
  user: TypedUser
}

export const iterateFields = async <T>({
  id,
  data,
  fields,
  locale,
  req,
  select,
  selectMode,
  siblingData,
  user,
}: Args<T>): Promise<void> => {
  const promises = []

  fields.forEach((field) => {
    promises.push(
      defaultValuePromise({
        id,
        data,
        field,
        locale,
        req,
        select,
        selectMode,
        siblingData,
        user,
      }),
    )
  })

  await Promise.all(promises)
}
```

--------------------------------------------------------------------------------

---[FILE: promise.ts]---
Location: payload-main/packages/ui/src/forms/fieldSchemasToFormState/calculateDefaultValues/promise.ts

```typescript
import type {
  Data,
  Field,
  FlattenedBlock,
  PayloadRequest,
  SelectMode,
  SelectType,
  TabAsField,
  TypedUser,
} from 'payload'

import { getBlockSelect, getDefaultValue, stripUnselectedFields } from 'payload'
import { fieldAffectsData, tabHasName } from 'payload/shared'

import { iterateFields } from './iterateFields.js'

type Args<T> = {
  data: T
  field: Field | TabAsField
  id?: number | string
  locale: string | undefined
  req: PayloadRequest
  select?: SelectType
  selectMode?: SelectMode
  siblingData: Data
  user: TypedUser
}

// TODO: Make this works for rich text subfields
export const defaultValuePromise = async <T>({
  id,
  data,
  field,
  locale,
  req,
  select,
  selectMode,
  siblingData,
  user,
}: Args<T>): Promise<void> => {
  const shouldContinue = stripUnselectedFields({
    field,
    select,
    selectMode,
    siblingDoc: siblingData,
  })

  if (!shouldContinue) {
    return
  }

  if (fieldAffectsData(field)) {
    if (
      typeof siblingData[field.name] === 'undefined' &&
      typeof field.defaultValue !== 'undefined'
    ) {
      try {
        siblingData[field.name] = await getDefaultValue({
          defaultValue: field.defaultValue,
          locale,
          req,
          user,
          value: siblingData[field.name],
        })
      } catch (err) {
        req.payload.logger.error({
          err,
          msg: `Error calculating default value for field: ${field.name}`,
        })
      }
    }
  }

  // Traverse subfields
  switch (field.type) {
    case 'array': {
      const rows = siblingData[field.name]

      if (Array.isArray(rows)) {
        const promises = []
        const arraySelect = select?.[field.name]

        rows.forEach((row) => {
          promises.push(
            iterateFields({
              id,
              data,
              fields: field.fields,
              locale,
              req,
              select: typeof arraySelect === 'object' ? arraySelect : undefined,
              selectMode,
              siblingData: row,
              user,
            }),
          )
        })

        await Promise.all(promises)
      }
      break
    }

    case 'blocks': {
      const rows = siblingData[field.name]

      if (Array.isArray(rows)) {
        const promises = []

        rows.forEach((row) => {
          const blockTypeToMatch: string = row.blockType

          const block =
            req.payload.blocks[blockTypeToMatch] ??
            ((field.blockReferences ?? field.blocks).find(
              (blockType) => typeof blockType !== 'string' && blockType.slug === blockTypeToMatch,
            ) as FlattenedBlock | undefined)

          const { blockSelect, blockSelectMode } = getBlockSelect({
            block,
            select: select?.[field.name],
            selectMode,
          })

          if (block) {
            row.blockType = blockTypeToMatch

            promises.push(
              iterateFields({
                id,
                data,
                fields: block.fields,
                locale,
                req,
                select: typeof blockSelect === 'object' ? blockSelect : undefined,
                selectMode: blockSelectMode,
                siblingData: row,
                user,
              }),
            )
          }
        })
        await Promise.all(promises)
      }

      break
    }

    case 'collapsible':
    case 'row': {
      await iterateFields({
        id,
        data,
        fields: field.fields,
        locale,
        req,
        select,
        selectMode,
        siblingData,
        user,
      })

      break
    }
    case 'group': {
      if (fieldAffectsData(field)) {
        if (typeof siblingData[field.name] !== 'object') {
          siblingData[field.name] = {}
        }

        const groupData = siblingData[field.name] as Record<string, unknown>

        const groupSelect = select?.[field.name]

        await iterateFields({
          id,
          data,
          fields: field.fields,
          locale,
          req,
          select: typeof groupSelect === 'object' ? groupSelect : undefined,
          selectMode,
          siblingData: groupData,
          user,
        })
      } else {
        await iterateFields({
          id,
          data,
          fields: field.fields,
          locale,
          req,
          select,
          selectMode,
          siblingData,
          user,
        })
      }

      break
    }

    case 'tab': {
      let tabSiblingData

      const isNamedTab = tabHasName(field)

      let tabSelect: SelectType | undefined

      if (isNamedTab) {
        if (typeof siblingData[field.name] !== 'object') {
          siblingData[field.name] = {}
        }

        tabSiblingData = siblingData[field.name] as Record<string, unknown>

        if (typeof select?.[field.name] === 'object') {
          tabSelect = select?.[field.name] as SelectType
        }
      } else {
        tabSiblingData = siblingData
        tabSelect = select
      }

      await iterateFields({
        id,
        data,
        fields: field.fields,
        locale,
        req,
        select: tabSelect,
        selectMode,
        siblingData: tabSiblingData,
        user,
      })

      break
    }

    case 'tabs': {
      await iterateFields({
        id,
        data,
        fields: field.tabs.map((tab) => ({ ...tab, type: 'tab' })),
        locale,
        req,
        select,
        selectMode,
        siblingData,
        user,
      })

      break
    }

    default: {
      break
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: renderFieldServerFn.ts]---
Location: payload-main/packages/ui/src/forms/fieldSchemasToFormState/serverFunctions/renderFieldServerFn.ts

```typescript
import {
  deepMerge,
  type Field,
  type FieldState,
  type ServerFunction,
  UnauthorizedError,
} from 'payload'

import { getClientConfig } from '../../../utilities/getClientConfig.js'
import { getClientSchemaMap } from '../../../utilities/getClientSchemaMap.js'
import { getSchemaMap } from '../../../utilities/getSchemaMap.js'
import { renderField } from '../renderField.js'

export type RenderFieldServerFnArgs<TField = Field> = {
  /**
   * Override field config pulled from schemaPath lookup
   */
  field?: Partial<TField>
  /**
   * Pass the value this field will receive when rendering it on the server.
   * For richText, this helps provide initial state for sub-fields that are immediately rendered (like blocks)
   * so that we can avoid multiple waterfall requests for each block that renders on the client.
   */
  initialValue?: unknown
  /**
   * Path to the field to render
   * @default field name
   */
  path?: string
  /**
   * Dot schema path to a richText field declared in your config.
   * Format:
   *   "collection.<collectionSlug>.<fieldPath>"
   *   "global.<globalSlug>.<fieldPath>"
   *
   * Examples:
   *   "collection.posts.richText"
   *   "global.siteSettings.content"
   */
  schemaPath: string
}
export type RenderFieldServerFnReturnType = {} & FieldState['customComponents']

/**
 * @experimental - may break in minor releases
 */
export const _internal_renderFieldHandler: ServerFunction<
  RenderFieldServerFnArgs,
  Promise<RenderFieldServerFnReturnType>
  // eslint-disable-next-line @typescript-eslint/require-await
> = async ({ field: fieldArg, initialValue, path, req, schemaPath }) => {
  if (!req.user) {
    throw new UnauthorizedError()
  }

  const [entityType, entitySlug, ...fieldPath] = schemaPath.split('.')

  const schemaMap = getSchemaMap({
    collectionSlug: entityType === 'collection' ? entitySlug : undefined,
    config: req.payload.config,
    globalSlug: entityType === 'global' ? entitySlug : undefined,
    i18n: req.i18n,
  })

  // Provide client schema map as it would have been provided if the target editor field would have been rendered.
  // For lexical, only then will it contain all the lexical-internal entries
  const clientSchemaMap = getClientSchemaMap({
    collectionSlug: entityType === 'collection' ? entitySlug : undefined,
    config: getClientConfig({
      config: req.payload.config,
      i18n: req.i18n,
      importMap: req.payload.importMap,
      user: req.user,
    }),
    globalSlug: entityType === 'global' ? entitySlug : undefined,
    i18n: req.i18n,
    payload: req.payload,
    schemaMap,
  })

  const targetField = schemaMap.get(`${entitySlug}.${fieldPath.join('.')}`) as Field | undefined

  if (!targetField) {
    throw new Error(`Could not find target field at schemaPath: ${schemaPath}`)
  }

  const field: Field = fieldArg ? deepMerge(targetField, fieldArg, { clone: false }) : targetField

  let data = {}
  if (typeof initialValue !== 'undefined') {
    if ('name' in field) {
      data[field.name] = initialValue
    } else {
      data = initialValue
    }
  }

  const fieldState: FieldState = {}
  renderField({
    clientFieldSchemaMap: clientSchemaMap,
    collectionSlug: entityType === 'collection' && entitySlug ? entitySlug : '-',
    data,
    fieldConfig: field,
    fieldSchemaMap: schemaMap,
    fieldState, // TODO,
    formState: {}, // TODO,
    indexPath: '',
    lastRenderedPath: '',
    operation: 'create',
    parentPath: '',
    parentSchemaPath: '',
    path: path ?? ('name' in field ? field.name : ''),
    permissions: true,
    preferences: {
      fields: {},
    },
    // If we are passed a field override, we want to ensure we create a new client field based on that override
    forceCreateClientField: fieldArg ? true : false,
    previousFieldState: undefined,
    renderAllFields: true,
    req,
    schemaPath: `${entitySlug}.${fieldPath.join('.')}`,
    siblingData: data,
  })

  return fieldState.customComponents ?? {}
}
```

--------------------------------------------------------------------------------

---[FILE: context.ts]---
Location: payload-main/packages/ui/src/forms/Form/context.ts
Signals: React

```typescript
'use client'
import type { RenderedField } from 'payload'

import { createContext, use } from 'react'
import {
  createContext as createSelectorContext,
  useContextSelector,
  useContext as useFullContext,
} from 'use-context-selector'

import type { Context, FormFieldsContext as FormFieldsContextType } from './types.js'

const FormContext = createContext({} as Context)
const DocumentFormContext = createContext({} as Context)
const FormWatchContext = createContext({} as Context)
const SubmittedContext = createContext(false)
const ProcessingContext = createContext(false)
/**
 * If the form has started processing in the background (e.g.
 * if autosave is running), this will be true.
 */
const BackgroundProcessingContext = createContext(false)
const ModifiedContext = createContext(false)
const InitializingContext = createContext(false)
const FormFieldsContext = createSelectorContext<FormFieldsContextType>([{}, () => null])

export type RenderedFieldSlots = Map<string, RenderedField>

/**
 * Get the state of the form, can be used to submit & validate the form.
 *
 * @see https://payloadcms.com/docs/admin/react-hooks#useform
 */
const useForm = (): Context => use(FormContext)
/**
 * Get the state of the document-level form. This is useful if you need to access the document-level Form from within a child Form.
 * This is the case withing lexical Blocks, as each lexical blocks renders their own Form.
 */
const useDocumentForm = (): Context => use(DocumentFormContext)

const useWatchForm = (): Context => use(FormWatchContext)
const useFormSubmitted = (): boolean => use(SubmittedContext)
const useFormProcessing = (): boolean => use(ProcessingContext)
/**
 * If the form has started processing in the background (e.g.
 * if autosave is running), this will be true.
 */
const useFormBackgroundProcessing = (): boolean => use(BackgroundProcessingContext)
const useFormModified = (): boolean => use(ModifiedContext)
const useFormInitializing = (): boolean => use(InitializingContext)

/**
 * Get and set the value of a form field based on a selector
 *
 * @see https://payloadcms.com/docs/admin/react-hooks#useformfields
 */
const useFormFields = <Value = unknown>(
  selector: (context: FormFieldsContextType) => Value,
): Value => useContextSelector(FormFieldsContext, selector)

/**
 * Get the state of all form fields.
 *
 * @see https://payloadcms.com/docs/admin/react-hooks#useallformfields
 */
const useAllFormFields = (): FormFieldsContextType => useFullContext(FormFieldsContext)

export {
  BackgroundProcessingContext,
  DocumentFormContext,
  FormContext,
  FormFieldsContext,
  FormWatchContext,
  InitializingContext,
  ModifiedContext,
  ProcessingContext,
  SubmittedContext,
  useAllFormFields,
  useDocumentForm,
  useForm,
  useFormBackgroundProcessing,
  useFormFields,
  useFormInitializing,
  useFormModified,
  useFormProcessing,
  useFormSubmitted,
  useWatchForm,
}
```

--------------------------------------------------------------------------------

````
