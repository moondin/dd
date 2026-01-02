---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 401
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 401 of 695)

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

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/forms/Form/types.ts
Signals: React

```typescript
import type {
  ClientField,
  Data,
  FormField,
  FormState,
  Row,
  TypedUser,
  ValidationFieldError,
} from 'payload'
import type React from 'react'
import type { Dispatch } from 'react'

import type { AcceptValues } from './mergeServerFormState.js'

export type Preferences = {
  [key: string]: unknown
}

export type FormOnSuccess<T = unknown, C = Record<string, unknown>> = (
  json: T,
  ctx?: {
    /**
     * Arbitrary context passed to the onSuccess callback.
     */
    context?: C
    /**
     * The form state that was sent with the request when retrieving the `json` arg.
     */
    formState?: FormState
  },
) => Promise<FormState | void> | void

export type FormProps = {
  beforeSubmit?: ((args: { formState: FormState }) => Promise<FormState>)[]
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  disableSuccessStatus?: boolean
  /**
   * If you would like to solely leverage server-side validation on submit,
   * you can disable checks that the form makes before it submits
   */
  disableValidationOnSubmit?: boolean
  /**
   * If you don't want the form to be a <form> element, you can pass a string here to use as the wrapper element.
   */
  el?: string
  /**
   * By default, the form will get the field schema (not data) from the current document. If you pass this in, you can override that behavior.
   * This is very useful for sub-forms, where the form's field schema is not necessarily the field schema of the current document (e.g. for the Blocks
   * feature of the Lexical Rich Text field)
   */
  fields?: ClientField[]
  handleResponse?: (
    res: Response,
    successToast: (value: string) => void,
    errorToast: (value: string) => void,
  ) => void
  initialState?: FormState
  /**
   * Determines if this Form is the main, top-level Form of a document. If set to true, the
   * Form's children will be wrapped in a DocumentFormContext, which lets you access this document
   * Form's data and fields from any child component - even if that child component is wrapped in a child
   * Form (e.g. a lexical block).
   */
  isDocumentForm?: boolean
  isInitializing?: boolean
  log?: boolean
  onChange?: ((args: { formState: FormState; submitted?: boolean }) => Promise<FormState>)[]
  onSubmit?: (fields: FormState, data: Data) => void
  onSuccess?: FormOnSuccess
  redirect?: string
  submitted?: boolean
  uuid?: string
  validationOperation?: 'create' | 'update'
  waitForAutocomplete?: boolean
} & (
  | {
      action: (formData: FormData) => Promise<void>
    }
  | {
      action?: string
      method?: 'DELETE' | 'GET' | 'PATCH' | 'POST'
    }
)

export type SubmitOptions<C = Record<string, unknown>> = {
  acceptValues?: AcceptValues
  action?: string
  /**
   * If you want to pass additional data to the onSuccess callback, you can use this context object.
   *
   * @experimental This property is experimental and may change in the future.
   */
  context?: C
  /**
   * When true, will disable the form while it is processing.
   * @default true
   */
  disableFormWhileProcessing?: boolean
  /**
   * When true, will disable the success toast after form submission.
   * @default false
   */
  disableSuccessStatus?: boolean
  method?: string
  overrides?: ((formState) => FormData) | Record<string, unknown>
  /**
   * When true, will skip validation before submitting the form.
   * @default false
   */
  skipValidation?: boolean
}

export type DispatchFields = React.Dispatch<any>

export type Submit = <T extends Response, C extends Record<string, unknown>>(
  options?: SubmitOptions<C>,
  e?: React.FormEvent<HTMLFormElement>,
) => Promise</**
 * Returns the form state and the response from the server.
 *
 * @experimental - Note: the `{ res: ... }` return type is experimental and may change in the future. Use at your own risk.
 */
{ formState?: FormState; res: T } | void>

export type ValidateForm = () => Promise<boolean>

export type CreateFormData = (
  overrides?: Record<string, unknown>,
  /**
   * If mergeOverrideData true, the data will be merged with the existing data in the form state.
   * @default true
   */
  options?: {
    /**
     * If provided, will use this instead of of derived data from the current form state.
     */
    data?: Data
    mergeOverrideData?: boolean
  },
) => FormData | Promise<FormData>

export type GetFields = () => FormState
export type GetField = (path: string) => FormField
export type GetData = () => Data
export type GetSiblingData = (path: string) => Data
export type GetDataByPath = <T = unknown>(path: string) => T
export type SetModified = (modified: boolean) => void
export type SetSubmitted = (submitted: boolean) => void
export type SetProcessing = (processing: boolean) => void

export type Reset = (data: unknown) => Promise<void>

export type REPLACE_STATE = {
  optimize?: boolean
  /**
   * If `sanitize` is true, default values will be set for form field properties that are not present in the incoming state.
   * For example, `valid` will be set to true if it is not present in the incoming state.
   */
  sanitize?: boolean
  state: FormState
  type: 'REPLACE_STATE'
}

export type REMOVE = {
  path: string
  type: 'REMOVE'
}

export type MODIFY_CONDITION = {
  path: string
  result: boolean
  type: 'MODIFY_CONDITION'
  user: TypedUser
}

export type UPDATE = {
  path: string
  type: 'UPDATE'
} & Partial<FormField>

export type UPDATE_MANY = {
  formState: FormState
  type: 'UPDATE_MANY'
}

export type REMOVE_ROW = {
  path: string
  rowIndex: number
  type: 'REMOVE_ROW'
}

export type ADD_ROW = {
  blockType?: string
  path: string
  rowIndex?: number
  subFieldState?: FormState
  type: 'ADD_ROW'
}

export type MERGE_SERVER_STATE = {
  acceptValues?: AcceptValues
  prevStateRef: React.RefObject<FormState>
  serverState: FormState
  type: 'MERGE_SERVER_STATE'
}

export type REPLACE_ROW = {
  blockType?: string
  path: string
  rowIndex: number
  subFieldState?: FormState
  type: 'REPLACE_ROW'
}

export type DUPLICATE_ROW = {
  path: string
  rowIndex: number
  type: 'DUPLICATE_ROW'
}

export type MOVE_ROW = {
  moveFromIndex: number
  moveToIndex: number
  path: string
  type: 'MOVE_ROW'
}

export type ADD_SERVER_ERRORS = {
  errors: ValidationFieldError[]
  type: 'ADD_SERVER_ERRORS'
}

export type SET_ROW_COLLAPSED = {
  path: string
  type: 'SET_ROW_COLLAPSED'
  updatedRows: Row[]
}

export type SET_ALL_ROWS_COLLAPSED = {
  path: string
  type: 'SET_ALL_ROWS_COLLAPSED'
  updatedRows: Row[]
}

export type FieldAction =
  | ADD_ROW
  | ADD_SERVER_ERRORS
  | DUPLICATE_ROW
  | MERGE_SERVER_STATE
  | MODIFY_CONDITION
  | MOVE_ROW
  | REMOVE
  | REMOVE_ROW
  | REPLACE_ROW
  | REPLACE_STATE
  | SET_ALL_ROWS_COLLAPSED
  | SET_ROW_COLLAPSED
  | UPDATE
  | UPDATE_MANY

export type FormFieldsContext = [FormState, Dispatch<FieldAction>]

export type Context = {
  addFieldRow: ({
    blockType,
    path,
    rowIndex,
    schemaPath,
    subFieldState,
  }: {
    blockType?: string
    path: string
    rowIndex?: number
    schemaPath: string
    subFieldState?: FormState
  }) => void
  buildRowErrors: () => void
  createFormData: CreateFormData
  disabled: boolean
  dispatchFields: Dispatch<FieldAction>
  /**
   * Form context fields may be outdated and should not be relied on. Instead, prefer `useFormFields`.
   */
  fields: FormState
  formRef: React.RefObject<HTMLFormElement>
  getData: GetData
  getDataByPath: GetDataByPath
  getField: GetField
  getFields: GetFields
  getSiblingData: GetSiblingData
  initializing: boolean
  /**
   * Tracks wether the form state passes validation.
   * For example the state could be submitted but invalid as field errors have been returned.
   */
  isValid: boolean
  moveFieldRow: ({
    moveFromIndex,
    moveToIndex,
    path,
  }: {
    moveFromIndex: number
    moveToIndex: number
    path: string
  }) => void
  removeFieldRow: ({ path, rowIndex }: { path: string; rowIndex: number }) => void
  replaceFieldRow: ({
    blockType,
    path,
    rowIndex,
    schemaPath,
    subFieldState,
  }: {
    blockType?: string
    path: string
    rowIndex: number
    schemaPath: string
    subFieldState?: FormState
  }) => void
  replaceState: (state: FormState) => void
  reset: Reset
  /**
   * If the form has started processing in the background (e.g.
   * if autosave is running), this will be true.
   */
  setBackgroundProcessing: SetProcessing
  setDisabled: (disabled: boolean) => void
  setIsValid: (processing: boolean) => void
  setModified: SetModified
  setProcessing: SetProcessing
  setSubmitted: SetSubmitted
  submit: Submit
  uuid?: string
  validateForm: ValidateForm
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/forms/NullifyField/index.scss

```text
@layer payload-default {
  .nullify-locale-field {
    margin-bottom: 0;
    .field-type.checkbox {
      display: flex;
      flex-direction: column;
      margin: 0;
    }

    + .array-field__add-row {
      margin-top: calc(var(--base) / 2);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/forms/NullifyField/index.tsx
Signals: React

```typescript
'use client'

import * as React from 'react'

import { Banner } from '../../elements/Banner/index.js'
import { CheckboxField } from '../../fields/Checkbox/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { useForm } from '../Form/context.js'
import './index.scss'

const baseClass = 'nullify-locale-field'

type NullifyLocaleFieldProps = {
  readonly fieldValue?: [] | null | number
  readonly localized: boolean
  readonly path: string
  readonly readOnly?: boolean
}

export const NullifyLocaleField: React.FC<NullifyLocaleFieldProps> = ({
  fieldValue,
  localized,
  path,
  readOnly = false,
}) => {
  const { code: currentLocale } = useLocale()
  const {
    config: { localization },
  } = useConfig()
  const [checked, setChecked] = React.useState<boolean>(typeof fieldValue !== 'number')
  const { t } = useTranslation()
  const { dispatchFields, setModified } = useForm()

  if (!localized || !localization) {
    // hide when field is not localized or localization is not enabled
    return null
  }

  if (localization.defaultLocale === currentLocale || !localization.fallback) {
    // if editing default locale or when fallback is disabled
    return null
  }

  const onChange = () => {
    const useFallback = !checked

    dispatchFields({
      type: 'UPDATE',
      path,
      value: useFallback ? null : fieldValue || 0,
    })
    setModified(true)
    setChecked(useFallback)
  }

  if (fieldValue) {
    let hideCheckbox = false
    if (typeof fieldValue === 'number' && fieldValue > 0) {
      hideCheckbox = true
    }
    if (Array.isArray(fieldValue) && fieldValue.length > 0) {
      hideCheckbox = true
    }

    if (hideCheckbox) {
      if (checked) {
        setChecked(false)
      } // uncheck when field has value
      return null
    }
  }

  return (
    <Banner className={baseClass}>
      {!fieldValue && readOnly ? (
        t('general:fallbackToDefaultLocale')
      ) : (
        <CheckboxField
          checked={checked}
          field={{
            name: '',
            label: t('general:fallbackToDefaultLocale'),
          }}
          id={`field-${path.replace(/\./g, '__')}`}
          onChange={onChange}
          path={path}
          schemaPath=""
        />
      )}
    </Banner>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: context.ts]---
Location: payload-main/packages/ui/src/forms/RenderFields/context.ts
Signals: React

```typescript
import React from 'react'

/**
 * All fields are wrapped in a `FieldPathContext` provider by default.
 * The `useFieldPath` hook will return this value if it exists, not the path the field was explicitly given.
 * This means if you render a field directly, you will need to wrap it with a new `FieldPathContext` provider.
 * Otherwise, it will return the parent's path, not the path it was explicitly given.
 * @example
 * ```tsx
 * 'use client'
 * import React from 'react'
 * import { TextField, FieldPathContext } from '@payloadcms/ui'
 * import type { TextFieldClientComponent } from 'payload'
 *
 * export const MyCustomField: TextFieldClientComponent = (props) => {
 *   return (
 *     <FieldPathContext value="path.to.some.other.field">
 *       <TextField {...props} />
 *     </FieldPathContext>
 *   )
 * }
 * ```
 *
 * @experimental This is an experimental API and may change at any time. Use at your own risk.
 */
export const FieldPathContext = React.createContext<string>(undefined)

/**
 * Gets the current field path from the nearest `FieldPathContext` provider.
 * All fields are wrapped in this context by default.
 *
 * @experimental This is an experimental API and may change at any time. Use at your own risk.
 */
export const useFieldPath = () => {
  const context = React.useContext(FieldPathContext)

  if (!context) {
    // swallow the error, not all fields are wrapped in a FieldPathContext
    return undefined
  }

  return context
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/forms/RenderFields/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  // Positioned field-type__wrap is needed for correct positioning of field tooltips.
  // This is set outside of .render-fields, so that manually rendered fields (e.g. in Auth/index.tsx)
  // outside RenderFields also receive this styling.
  .field-type__wrap {
    position: relative;
  }

  .render-fields {
    --spacing-field: var(--base);

    &--margins-small {
      --spacing-field: var(--base);
    }

    &--margins-none {
      --spacing-field: 0;
    }

    & > .field-type {
      margin-bottom: var(--spacing-field);
      position: relative;

      &[type='hidden'] {
        margin-bottom: 0;
      }

      &:first-child {
        margin-top: 0;
      }

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    // at the top-level, add extra margins for the following field types
    &:not(.render-fields--margins-small) {
      & > .field-type {
        &.group-field,
        &.blocks-field,
        &.array-field,
        &.collapsible-field,
        &.rich-text {
          margin-top: calc(var(--spacing-field) * 2);
          margin-bottom: calc(var(--spacing-field) * 2);

          &:first-child {
            margin-top: 0;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    @include small-break {
      --spacing-field: calc(var(--base) / 2);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/forms/RenderFields/index.tsx
Signals: React

```typescript
'use client'

import type { SanitizedFieldPermissions } from 'payload'

import { fieldIsHiddenOrDisabled, getFieldPaths, getFieldPermissions } from 'payload/shared'
import React from 'react'

import type { RenderFieldsProps } from './types.js'

import { RenderIfInViewport } from '../../elements/RenderIfInViewport/index.js'
import { useOperation } from '../../providers/Operation/index.js'
import './index.scss'
import { FieldPathContext } from './context.js'
import { RenderField } from './RenderField.js'

const baseClass = 'render-fields'

export { RenderFieldsProps as Props }

export const RenderFields: React.FC<RenderFieldsProps> = (props) => {
  const {
    className,
    fields,
    forceRender,
    margins,
    parentIndexPath,
    parentPath,
    parentSchemaPath,
    permissions,
    readOnly: readOnlyFromParent,
  } = props

  const operation = useOperation()

  if (fields && fields.length > 0) {
    return (
      <RenderIfInViewport
        className={[
          baseClass,
          className,
          margins && `${baseClass}--margins-${margins}`,
          margins === false && `${baseClass}--margins-none`,
        ]
          .filter(Boolean)
          .join(' ')}
        forceRender={forceRender}
      >
        {fields.map((field, i) => {
          // For sidebar fields in the main fields array, `field` will be `null`, and visa versa
          // This is to keep the order of the fields consistent and maintain the correct index paths for the main fields (i)
          if (!field || fieldIsHiddenOrDisabled(field)) {
            return null
          }

          const {
            operation: hasOperationPermission,
            permissions: fieldPermissions,
            read: hasReadPermission,
          } = getFieldPermissions({
            field,
            operation,
            parentName: parentPath?.includes('.')
              ? parentPath.split('.')[parentPath.split('.').length - 1]
              : parentPath,
            permissions,
          })

          // If the user cannot read the field, then filter it out
          // This is different from `admin.readOnly` which is executed based on `operation`
          if ('name' in field && !hasReadPermission) {
            return null
          }

          // `admin.readOnly` displays the value but prevents the field from being edited
          let isReadOnly = readOnlyFromParent || field?.admin?.readOnly

          // If parent field is `readOnly: true`, but this field is `readOnly: false`, the field should still be editable
          if (isReadOnly && field.admin?.readOnly === false) {
            isReadOnly = false
          }

          // If the user does not have access at the operation level, to begin with, force it to be read-only
          if ('name' in field && !hasOperationPermission) {
            isReadOnly = true
          }

          const { indexPath, path, schemaPath } = getFieldPaths({
            field,
            index: i,
            parentIndexPath,
            parentPath,
            parentSchemaPath,
          })

          return (
            <FieldPathContext key={`${path}-${i}`} value={path}>
              <RenderField
                clientFieldConfig={field}
                forceRender={forceRender}
                indexPath={indexPath}
                parentPath={parentPath}
                parentSchemaPath={parentSchemaPath}
                path={path}
                permissions={fieldPermissions as SanitizedFieldPermissions}
                readOnly={isReadOnly}
                schemaPath={schemaPath}
              />
            </FieldPathContext>
          )
        })}
      </RenderIfInViewport>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: RenderField.tsx]---
Location: payload-main/packages/ui/src/forms/RenderFields/RenderField.tsx
Signals: React

```typescript
'use client'

import type {
  ClientComponentProps,
  ClientField,
  FieldPaths,
  SanitizedFieldPermissions,
} from 'payload'

import React from 'react'

import { ArrayField } from '../../fields/Array/index.js'
import { BlocksField } from '../../fields/Blocks/index.js'
import { CheckboxField } from '../../fields/Checkbox/index.js'
import { CodeField } from '../../fields/Code/index.js'
import { CollapsibleField } from '../../fields/Collapsible/index.js'
import { DateTimeField } from '../../fields/DateTime/index.js'
import { EmailField } from '../../fields/Email/index.js'
import { GroupField } from '../../fields/Group/index.js'
import { HiddenField } from '../../fields/Hidden/index.js'
import { JoinField } from '../../fields/Join/index.js'
import { JSONField } from '../../fields/JSON/index.js'
import { NumberField } from '../../fields/Number/index.js'
import { PointField } from '../../fields/Point/index.js'
import { RadioGroupField } from '../../fields/RadioGroup/index.js'
import { RelationshipField } from '../../fields/Relationship/index.js'
import { RichTextField } from '../../fields/RichText/index.js'
import { RowField } from '../../fields/Row/index.js'
import { SelectField } from '../../fields/Select/index.js'
import { TabsField } from '../../fields/Tabs/index.js'
import { TextField } from '../../fields/Text/index.js'
import { TextareaField } from '../../fields/Textarea/index.js'
import { UIField } from '../../fields/UI/index.js'
import { UploadField } from '../../fields/Upload/index.js'
import { useFormFields } from '../../forms/Form/index.js'

type RenderFieldProps = {
  clientFieldConfig: ClientField
  permissions: SanitizedFieldPermissions
} & FieldPaths &
  Pick<ClientComponentProps, 'forceRender' | 'readOnly' | 'schemaPath'>

export function RenderField({
  clientFieldConfig,
  forceRender,
  indexPath,
  parentPath,
  parentSchemaPath,
  path,
  permissions,
  readOnly,
  schemaPath,
}: RenderFieldProps) {
  const CustomField = useFormFields(([fields]) => fields && fields?.[path]?.customComponents?.Field)

  const baseFieldProps: Pick<
    ClientComponentProps,
    'forceRender' | 'permissions' | 'readOnly' | 'schemaPath'
  > = {
    forceRender,
    permissions,
    readOnly,
    schemaPath,
  }

  if (clientFieldConfig.admin?.hidden) {
    return <HiddenField {...baseFieldProps} path={path} />
  }

  if (CustomField !== undefined) {
    return CustomField || null
  }

  const iterableFieldProps = {
    ...baseFieldProps,
    indexPath,
    parentPath,
    parentSchemaPath,
  }

  switch (clientFieldConfig.type) {
    case 'array':
      return <ArrayField {...iterableFieldProps} field={clientFieldConfig} path={path} />

    case 'blocks':
      return <BlocksField {...iterableFieldProps} field={clientFieldConfig} path={path} />

    case 'checkbox':
      return <CheckboxField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'code':
      return <CodeField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'collapsible':
      return <CollapsibleField {...iterableFieldProps} field={clientFieldConfig} path={path} />

    case 'date':
      return <DateTimeField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'email':
      return <EmailField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'group':
      return <GroupField {...iterableFieldProps} field={clientFieldConfig} path={path} />

    case 'join':
      return <JoinField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'json':
      return <JSONField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'number':
      return <NumberField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'point':
      return <PointField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'radio':
      return <RadioGroupField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'relationship':
      return <RelationshipField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'richText':
      return <RichTextField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'row':
      return <RowField {...iterableFieldProps} field={clientFieldConfig} />

    case 'select':
      return <SelectField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'tabs':
      return <TabsField {...iterableFieldProps} field={clientFieldConfig} path={path} />

    case 'text':
      return <TextField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'textarea':
      return <TextareaField {...baseFieldProps} field={clientFieldConfig} path={path} />

    case 'ui':
      return <UIField />

    case 'upload':
      return <UploadField {...baseFieldProps} field={clientFieldConfig} path={path} />
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/forms/RenderFields/types.ts

```typescript
import type { ClientComponentProps, ClientField, SanitizedFieldPermissions } from 'payload'

export type RenderFieldsProps = {
  readonly className?: string
  readonly fields: ClientField[]
  readonly margins?: 'small' | false
  readonly parentIndexPath: string
  readonly parentPath: string
  readonly parentSchemaPath: string
  readonly permissions:
    | {
        [fieldName: string]: SanitizedFieldPermissions
      }
    | SanitizedFieldPermissions
  readonly readOnly?: boolean
} & Pick<ClientComponentProps, 'forceRender'>
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/forms/RowLabel/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import type { RowLabelProps } from './types.js'

import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { RowLabelProvider } from './Context/index.js'
export type { RowLabelProps }

const baseClass = 'row-label'

export const RowLabel: React.FC<RowLabelProps> = (props) => {
  const { className, CustomComponent, label, path, rowNumber } = props

  return (
    <RowLabelProvider path={path} rowNumber={rowNumber}>
      <RenderCustomComponent
        CustomComponent={CustomComponent}
        Fallback={
          typeof label === 'string' ? (
            <span
              className={[baseClass, className].filter(Boolean).join(' ')}
              style={{
                pointerEvents: 'none',
              }}
            >
              {label}
            </span>
          ) : (
            label
          )
        }
      />
    </RowLabelProvider>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/forms/RowLabel/types.ts

```typescript
export type RowLabelProps = {
  readonly className?: string
  readonly CustomComponent?: React.ReactNode
  readonly label?: React.ReactNode | string
  readonly path: string
  readonly rowNumber?: number
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/forms/RowLabel/Context/index.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useWatchForm } from '../../Form/context.js'

type RowLabelType<T = unknown> = {
  readonly data: T
  readonly path: string
  readonly rowNumber?: number
}

const RowLabel = React.createContext<RowLabelType>({
  data: {},
  path: '',
  rowNumber: undefined,
})

type Props<T> = {
  readonly children: React.ReactNode
} & Omit<RowLabelType<T>, 'data'>

export const RowLabelProvider: React.FC<Props<unknown>> = ({ children, path, rowNumber }) => {
  const { getDataByPath, getSiblingData } = useWatchForm()
  const collapsibleData = getSiblingData(path)
  const arrayData = getDataByPath(path)

  const data = arrayData || collapsibleData

  const contextValue = React.useMemo(() => ({ data, path, rowNumber }), [data, path, rowNumber])

  return <RowLabel value={contextValue}>{children}</RowLabel>
}

export const useRowLabel = <T,>() => {
  return React.use(RowLabel) as RowLabelType<T>
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/forms/Submit/index.scss

```text
@layer payload-default {
  form > .form-submit {
    .btn {
      width: 100%;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/forms/Submit/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import type { Props } from '../../elements/Button/types.js'

import { Button } from '../../elements/Button/index.js'
import {
  useForm,
  useFormBackgroundProcessing,
  useFormInitializing,
  useFormProcessing,
} from '../Form/context.js'
import './index.scss'

const baseClass = 'form-submit'

export const FormSubmit: React.FC<Props> = (props) => {
  const {
    type = 'submit',
    buttonId: id,
    children,
    disabled: disabledFromProps,
    onClick,
    programmaticSubmit,
    ref,
  } = props

  const processing = useFormProcessing()
  const backgroundProcessing = useFormBackgroundProcessing()
  const initializing = useFormInitializing()
  const { disabled, submit } = useForm()

  const canSave = !(
    disabledFromProps ||
    initializing ||
    processing ||
    backgroundProcessing ||
    disabled
  )

  const handleClick =
    onClick ??
    (programmaticSubmit
      ? () => {
          void submit()
        }
      : undefined)

  return (
    <div className={baseClass}>
      <Button
        ref={ref}
        {...props}
        disabled={canSave ? undefined : true}
        id={id}
        onClick={handleClick}
        type={type}
      >
        {children}
      </Button>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/forms/useField/index.tsx
Signals: React

```typescript
'use client'
import type { PayloadRequest } from 'payload'

import React, { useCallback, useMemo, useRef } from 'react'

import type { UPDATE } from '../Form/types.js'
import type { FieldType, Options } from './types.js'

export type { FieldType, Options }

import { useThrottledEffect } from '../../hooks/useThrottledEffect.js'
import { useAuth } from '../../providers/Auth/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useOperation } from '../../providers/Operation/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import {
  useDocumentForm,
  useForm,
  useFormFields,
  useFormInitializing,
  useFormProcessing,
  useFormSubmitted,
} from '../Form/context.js'
import { useFieldPath } from '../RenderFields/context.js'

const useFieldInForm = <TValue,>(options?: Options): FieldType<TValue> => {
  const {
    disableFormData = false,
    hasRows,
    path: pathFromOptions,
    potentiallyStalePath,
    validate,
  } = options || {}

  const pathFromContext = useFieldPath()

  // This is a workaround for stale props given to server rendered components.
  // See the notes in the `potentiallyStalePath` type definition for more details.
  const path = pathFromOptions || pathFromContext || potentiallyStalePath

  const submitted = useFormSubmitted()
  const processing = useFormProcessing()
  const initializing = useFormInitializing()
  const { user } = useAuth()
  const { id, collectionSlug } = useDocumentInfo()
  const operation = useOperation()

  const dispatchField = useFormFields(([_, dispatch]) => dispatch)
  const field = useFormFields(([fields]) => (fields && fields?.[path]) || null)

  const { t } = useTranslation()
  const { config } = useConfig()

  const { getData, getDataByPath, getSiblingData, setModified } = useForm()
  const documentForm = useDocumentForm()

  const filterOptions = field?.filterOptions
  const value = field?.value as TValue
  const initialValue = field?.initialValue as TValue
  const valid = typeof field?.valid === 'boolean' ? field.valid : true
  const showError = valid === false && submitted

  const prevValid = useRef(valid)
  const prevErrorMessage = useRef(field?.errorMessage)

  const pathSegments = path ? path.split('.') : []

  // Method to return from `useField`, used to
  // update field values from field component(s)
  const setValue = useCallback(
    (e, disableModifyingForm = false) => {
      // TODO:
      // There are no built-in fields that pass events into `e`.
      // Remove this check in the next major version.
      const isEvent =
        e &&
        typeof e === 'object' &&
        typeof e.preventDefault === 'function' &&
        typeof e.stopPropagation === 'function'

      const val = isEvent ? e.target.value : e

      dispatchField({
        type: 'UPDATE',
        disableFormData: disableFormData || (hasRows && val > 0),
        path,
        value: val,
      })

      if (!disableModifyingForm) {
        setModified(true)
      }
    },
    [setModified, path, dispatchField, disableFormData, hasRows],
  )

  // Store result from hook as ref
  // to prevent unnecessary rerenders
  const result: FieldType<TValue> = useMemo(
    () => ({
      blocksFilterOptions: field?.blocksFilterOptions,
      customComponents: field?.customComponents,
      disabled: processing || initializing,
      errorMessage: field?.errorMessage,
      errorPaths: field?.errorPaths || [],
      filterOptions,
      formInitializing: initializing,
      formProcessing: processing,
      formSubmitted: submitted,
      initialValue,
      path,
      rows: field?.rows,
      selectFilterOptions: field?.selectFilterOptions,
      setValue,
      showError,
      valid: field?.valid,
      value,
    }),
    [
      field,
      processing,
      setValue,
      showError,
      submitted,
      value,
      initialValue,
      path,
      filterOptions,
      initializing,
    ],
  )

  // Throttle the validate function
  useThrottledEffect(
    () => {
      const validateField = async () => {
        let valueToValidate = value

        if (field?.rows && Array.isArray(field.rows)) {
          valueToValidate = getDataByPath(path)
        }

        let errorMessage: string | undefined = prevErrorMessage.current
        let valid: boolean | string = prevValid.current

        const data = getData()
        const isValid =
          typeof validate === 'function'
            ? await validate(valueToValidate, {
                id,
                blockData: undefined, // Will be expensive to get - not worth to pass to client-side validation, as this can be obtained by the user using `useFormFields()`
                collectionSlug,
                data: documentForm?.getData ? documentForm.getData() : data,
                event: 'onChange',
                operation,
                path: pathSegments,
                preferences: {} as any,
                req: {
                  payload: {
                    config,
                  },
                  t,
                  user,
                } as unknown as PayloadRequest,
                siblingData: getSiblingData(path),
              })
            : typeof prevErrorMessage.current === 'string'
              ? prevErrorMessage.current
              : prevValid.current

        if (typeof isValid === 'string') {
          valid = false
          errorMessage = isValid
        } else if (typeof isValid === 'boolean') {
          valid = isValid
          errorMessage = undefined
        }

        // Only dispatch if the validation result has changed
        // This will prevent unnecessary rerenders
        if (valid !== prevValid.current || errorMessage !== prevErrorMessage.current) {
          prevValid.current = valid
          prevErrorMessage.current = errorMessage

          const update: UPDATE = {
            type: 'UPDATE',
            errorMessage,
            path,
            rows: field?.rows,
            valid,
            validate,
            value,
          }

          if (disableFormData || (hasRows ? typeof value === 'number' && value > 0 : false)) {
            update.disableFormData = true
          }

          if (typeof dispatchField === 'function') {
            dispatchField(update)
          }
        }
      }

      void validateField()
    },
    150,
    [
      value,
      disableFormData,
      dispatchField,
      getData,
      getSiblingData,
      getDataByPath,
      id,
      operation,
      path,
      user,
      validate,
      field?.rows,
      collectionSlug,
    ],
  )

  return result
}

/**
 * Context to allow providing useField value for fields directly, if managed outside the Form
 *
 * @experimental
 */
export const FieldContext = React.createContext<FieldType<unknown> | undefined>(undefined)

/**
 * Get and set the value of a form field.
 *
 * @see https://payloadcms.com/docs/admin/react-hooks#usefield
 */
export const useField = <TValue,>(options?: Options): FieldType<TValue> => {
  const pathFromContext = useFieldPath()

  const fieldContext = React.use(FieldContext) as FieldType<TValue> | undefined

  // Lock the mode on first render so hook order is stable forever. This ensures
  // that hooks are called in the same order each time a component renders => should
  // not break the rule of hooks.
  const hasFieldContext = React.useRef<false | null | true>(null)
  if (hasFieldContext.current === null) {
    // Use field context, if a field context exists **and** the path matches. If the path
    // does not match, this could be the field context of a parent field => there likely is
    // a nested <Form /> we should use instead => 'form'
    const currentPath = options?.path || pathFromContext || options.potentiallyStalePath

    hasFieldContext.current =
      fieldContext && currentPath && fieldContext.path === currentPath ? true : false
  }

  if (hasFieldContext.current === true) {
    if (!fieldContext) {
      // Provider was removed after mount. That violates hook guarantees.
      throw new Error('FieldContext was removed after mount. This breaks hook ordering.')
    }
    return fieldContext
  }

  // We intentionally guard this hook call with a mode that is fixed on first render.
  // The order is consistent across renders. Silence the linter’s false positive.

  // eslint-disable-next-line react-compiler/react-compiler
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useFieldInForm<TValue>(options)
}
```

--------------------------------------------------------------------------------

````
