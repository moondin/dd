---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 395
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 395 of 695)

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
Location: payload-main/packages/ui/src/fields/Tabs/Tab/index.tsx
Signals: React

```typescript
'use client'

import type { ClientTab } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { tabHasName } from 'payload/shared'
import React, { useState } from 'react'

import { ErrorPill } from '../../../elements/ErrorPill/index.js'
import { WatchChildErrors } from '../../../forms/WatchChildErrors/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'tabs-field__tab-button'

type TabProps = {
  readonly hidden?: boolean
  readonly isActive?: boolean
  readonly parentPath: string
  readonly setIsActive: () => void
  readonly tab: ClientTab
}

export const TabComponent: React.FC<TabProps> = ({
  hidden,
  isActive,
  parentPath,
  setIsActive,
  tab,
}) => {
  const { i18n } = useTranslation()
  const [errorCount, setErrorCount] = useState(undefined)

  const path = [
    // removes parent 'tabs' path segment, i.e. `_index-0`
    ...(parentPath ? parentPath.split('.').slice(0, -1) : []),
    ...(tabHasName(tab) ? [tab.name] : []),
  ]

  const fieldHasErrors = errorCount > 0

  return (
    <React.Fragment>
      <WatchChildErrors fields={tab.fields} path={path} setErrorCount={setErrorCount} />
      <button
        className={[
          baseClass,
          fieldHasErrors && `${baseClass}--has-error`,
          isActive && `${baseClass}--active`,
          hidden && `${baseClass}--hidden`,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={setIsActive}
        type="button"
      >
        {tab.label ? getTranslation(tab.label, i18n) : tabHasName(tab) ? tab.name : ''}
        {fieldHasErrors && <ErrorPill count={errorCount} i18n={i18n} />}
      </button>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Text/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .field-type.text {
    position: relative;

    &:not(.has-many) {
      input {
        @include formInput;
      }
    }
  }

  .has-many {
    .rs__input-container {
      overflow: hidden;
    }
  }

  html[data-theme='light'] {
    .field-type.text {
      &.error {
        input {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .field-type.text {
      &.error {
        input {
          @include darkInputError;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Text/index.tsx
Signals: React

```typescript
'use client'
import type { TextFieldClientComponent } from 'payload'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import type { Option } from '../../elements/ReactSelect/types.js'
import type { TextInputProps } from './types.js'

import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { isFieldRTL } from '../shared/index.js'
import { TextInput } from './Input.js'
import './index.scss'

export { TextInput, TextInputProps }

const TextFieldComponent: TextFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: { autoComplete, className, description, placeholder, rtl } = {},
      hasMany,
      label,
      localized,
      maxLength,
      maxRows,
      minLength,
      minRows,
      required,
    },
    inputRef,
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const locale = useLocale()

  const {
    config: { localization: localizationConfig },
  } = useConfig()

  const memoizedValidate = useCallback(
    (value, options) => {
      if (typeof validate === 'function') {
        return validate(value, { ...options, maxLength, minLength, required })
      }
    },
    [validate, minLength, maxLength, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    setValue,
    showError,
    value,
  } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const renderRTL = isFieldRTL({
    fieldLocalized: localized,
    fieldRTL: rtl,
    locale,
    localizationConfig: localizationConfig || undefined,
  })

  const [valueToRender, setValueToRender] = useState<
    { id: string; label: string; value: { value: number } }[]
  >([]) // Only for hasMany

  const handleHasManyChange = useCallback(
    (selectedOption) => {
      if (!(readOnly || disabled)) {
        let newValue
        if (!selectedOption) {
          newValue = []
        } else if (Array.isArray(selectedOption)) {
          newValue = selectedOption.map((option) => option.value?.value || option.value)
        } else {
          newValue = [selectedOption.value?.value || selectedOption.value]
        }

        setValue(newValue)
      }
    },
    [readOnly, setValue, disabled],
  )

  // useEffect update valueToRender:
  useEffect(() => {
    if (hasMany && Array.isArray(value)) {
      setValueToRender(
        value.map((val, index) => {
          return {
            id: `${val}${index}`, // append index to avoid duplicate keys but allow duplicate numbers
            label: `${val}`,
            value: {
              // React-select automatically uses "label-value" as a key, so we will get that react duplicate key warning if we just pass in the value as multiple values can be the same. So we need to append the index to the toString() of the value to avoid that warning, as it uses that as the key.
              toString: () => `${val}${index}`,
              value: val?.value || val,
            },
          }
        }),
      )
    }
  }, [value, hasMany])

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <TextInput
      AfterInput={AfterInput}
      BeforeInput={BeforeInput}
      className={className}
      Description={Description}
      description={description}
      Error={Error}
      hasMany={hasMany}
      htmlAttributes={{
        autoComplete: autoComplete || undefined,
      }}
      inputRef={inputRef}
      Label={Label}
      label={label}
      localized={localized}
      maxRows={maxRows}
      minRows={minRows}
      onChange={
        hasMany
          ? handleHasManyChange
          : (e) => {
              setValue(e.target.value)
            }
      }
      path={path}
      placeholder={placeholder}
      readOnly={readOnly || disabled}
      required={required}
      rtl={renderRTL}
      showError={showError}
      style={styles}
      value={(value as string) || ''}
      valueToRender={valueToRender as Option[]}
    />
  )
}

export const TextField = withCondition(TextFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: Input.tsx]---
Location: payload-main/packages/ui/src/fields/Text/Input.tsx
Signals: React

```typescript
'use client'
import type { ChangeEvent } from 'react'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { ReactSelectAdapterProps } from '../../elements/ReactSelect/types.js'
import type { TextInputProps } from './types.js'

import { ReactSelect } from '../../elements/ReactSelect/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { fieldBaseClass } from '../shared/index.js'
import './index.scss'

export const TextInput: React.FC<TextInputProps> = (props) => {
  const {
    AfterInput,
    BeforeInput,
    className,
    Description,
    description,
    Error,
    hasMany,
    htmlAttributes,
    inputRef,
    Label,
    label,
    localized,
    maxRows,
    onChange,
    onKeyDown,
    path,
    placeholder: placeholderFromProps,
    readOnly,
    required,
    rtl,
    showError,
    style,
    value,
    valueToRender,
  } = props

  const { i18n, t } = useTranslation()

  const editableProps: ReactSelectAdapterProps['customProps']['editableProps'] = (
    data,
    className,
    selectProps,
  ) => {
    const editableClassName = `${className}--editable`

    return {
      onBlur: (event: React.FocusEvent<HTMLDivElement>) => {
        event.currentTarget.contentEditable = 'false'
      },
      onClick: (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget.contentEditable = 'true'
        event.currentTarget.classList.add(editableClassName)
        event.currentTarget.focus()
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === 'Tab' || event.key === 'Escape') {
          event.currentTarget.contentEditable = 'false'
          event.currentTarget.classList.remove(editableClassName)
          data.value.value = event.currentTarget.innerText
          data.label = event.currentTarget.innerText

          if (data.value.value.replaceAll('\n', '')) {
            selectProps.onChange(selectProps.value, {
              action: 'create-option',
              option: data,
            })
          } else {
            if (Array.isArray(selectProps.value)) {
              const newValues = selectProps.value.filter((v) => v.id !== data.id)
              selectProps.onChange(newValues, {
                action: 'pop-value',
                removedValue: data,
              })
            }
          }

          event.preventDefault()
        }
        event.stopPropagation()
      },
    }
  }

  const placeholder = getTranslation(placeholderFromProps, i18n)

  return (
    <div
      className={[
        fieldBaseClass,
        'text',
        className,
        showError && 'error',
        readOnly && 'read-only',
        hasMany && 'has-many',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={
          <FieldLabel label={label} localized={localized} path={path} required={required} />
        }
      />
      <div className={`${fieldBaseClass}__wrap`}>
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
        {BeforeInput}
        {hasMany ? (
          <ReactSelect
            className={`field-${path.replace(/\./g, '__')}`}
            components={{ DropdownIndicator: null }}
            customProps={{
              editableProps,
            }}
            disabled={readOnly}
            // prevent adding additional options if maxRows is reached
            filterOption={() =>
              !maxRows ? true : !(Array.isArray(value) && maxRows && value.length >= maxRows)
            }
            isClearable={false}
            isCreatable
            isMulti
            isSortable
            menuIsOpen={false}
            noOptionsMessage={() => {
              const isOverHasMany = Array.isArray(value) && value.length >= maxRows
              if (isOverHasMany) {
                return t('validation:limitReached', { max: maxRows, value: value.length + 1 })
              }
              return null
            }}
            onChange={onChange}
            options={[]}
            placeholder={placeholder}
            showError={showError}
            value={valueToRender}
          />
        ) : (
          <input
            data-rtl={rtl}
            disabled={readOnly}
            id={`field-${path?.replace(/\./g, '__')}`}
            name={path}
            onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            ref={inputRef}
            type="text"
            value={value || ''}
            {...(htmlAttributes ?? {})}
          />
        )}
        {AfterInput}
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/fields/Text/types.ts
Signals: React

```typescript
import type { StaticDescription, StaticLabel } from 'payload'
import type { ChangeEvent, JSX } from 'react'
import type React from 'react'

import type { Option, ReactSelectAdapterProps } from '../../elements/ReactSelect/types.js'

export type SharedTextFieldProps =
  | {
      readonly hasMany?: false
      readonly onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    }
  | {
      readonly hasMany?: true
      readonly onChange?: ReactSelectAdapterProps['onChange']
    }

export type TextInputProps = {
  readonly AfterInput?: React.ReactNode
  readonly BeforeInput?: React.ReactNode
  readonly className?: string
  readonly Description?: React.ReactNode
  readonly description?: StaticDescription
  readonly Error?: React.ReactNode
  readonly htmlAttributes?: {
    autoComplete?: JSX.IntrinsicElements['input']['autoComplete']
  }
  readonly inputRef?: React.RefObject<HTMLInputElement>
  readonly Label?: React.ReactNode
  readonly label?: StaticLabel
  readonly localized?: boolean
  readonly maxRows?: number
  readonly minRows?: number
  readonly onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  readonly path: string
  readonly placeholder?: Record<string, string> | string
  readonly readOnly?: boolean
  readonly required?: boolean
  readonly rtl?: boolean
  readonly showError?: boolean
  readonly style?: React.CSSProperties
  readonly value?: string
  readonly valueToRender?: Option[]
} & SharedTextFieldProps
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Textarea/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .field-type.textarea {
    position: relative;
    display: flex;
    flex-direction: column;

    textarea {
      @include formInput();
      overflow-y: auto;
      resize: vertical;
      min-height: base(3);
      height: auto;
      display: flex;
    }

    textarea:not(:empty) {
      field-sizing: content;
      min-height: calc(var(--rows) * var(--base) + var(--base) * 0.8 + 2px);
    }

    &.read-only {
      .textarea-outer {
        @include readOnly;
      }
    }
  }

  html[data-theme='light'] {
    .field-type.textarea {
      &.error {
        textarea {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .field-type.textarea {
      &.error {
        textarea {
          @include darkInputError;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Textarea/index.tsx
Signals: React

```typescript
'use client'
import type { TextareaFieldClientComponent, TextareaFieldValidation } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React, { useCallback, useMemo } from 'react'

import type { TextAreaInputProps } from './types.js'

import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import './index.scss'
import { isFieldRTL } from '../shared/index.js'
import { TextareaInput } from './Input.js'

export { TextareaInput, TextAreaInputProps }

const TextareaFieldComponent: TextareaFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: { className, description, placeholder, rows, rtl } = {},
      label,
      localized,
      maxLength,
      minLength,
      required,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const { i18n } = useTranslation()

  const {
    config: { localization },
  } = useConfig()

  const locale = useLocale()

  const isRTL = isFieldRTL({
    fieldLocalized: localized,
    fieldRTL: rtl,
    locale,
    localizationConfig: localization || undefined,
  })

  const memoizedValidate: TextareaFieldValidation = useCallback(
    (value, options) => {
      if (typeof validate === 'function') {
        return validate(value, { ...options, maxLength, minLength, required })
      }
    },
    [validate, required, maxLength, minLength],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    setValue,
    showError,
    value,
  } = useField<string>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <TextareaInput
      AfterInput={AfterInput}
      BeforeInput={BeforeInput}
      className={className}
      Description={Description}
      description={description}
      Error={Error}
      Label={Label}
      label={label}
      localized={localized}
      onChange={(e) => {
        setValue(e.target.value)
      }}
      path={path}
      placeholder={getTranslation(placeholder, i18n)}
      readOnly={readOnly || disabled}
      required={required}
      rows={rows}
      rtl={isRTL}
      showError={showError}
      style={styles}
      value={value}
    />
  )
}

export const TextareaField = withCondition(TextareaFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: Input.tsx]---
Location: payload-main/packages/ui/src/fields/Textarea/Input.tsx
Signals: React

```typescript
'use client'
import type { CSSProperties } from 'react'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { TextAreaInputProps } from './types.js'

import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { fieldBaseClass } from '../shared/index.js'
import './index.scss'

export const TextareaInput: React.FC<TextAreaInputProps> = (props) => {
  const {
    AfterInput,
    BeforeInput,
    className,
    Description,
    description,
    Error,
    Label,
    label,
    localized,
    onChange,
    path,
    placeholder,
    readOnly,
    required,
    rows,
    rtl,
    showError,
    style,
    value,
  } = props

  const { i18n } = useTranslation()

  return (
    <div
      className={[
        fieldBaseClass,
        'textarea',
        className,
        showError && 'error',
        readOnly && 'read-only',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={
          <FieldLabel
            htmlFor={`field-${path.replace(/\./g, '__')}`}
            label={label}
            localized={localized}
            path={path}
            required={required}
          />
        }
      />
      <div className={`${fieldBaseClass}__wrap`}>
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
        {BeforeInput}
        <div className="textarea-outer">
          <textarea
            data-rtl={rtl}
            disabled={readOnly}
            id={`field-${path.replace(/\./g, '__')}`}
            name={path}
            onChange={onChange}
            placeholder={getTranslation(placeholder, i18n)}
            rows={rows}
            style={
              {
                '--rows': rows,
              } as CSSProperties
            }
            value={value || ''}
          />
        </div>
        {AfterInput}
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/fields/Textarea/types.ts
Signals: React

```typescript
import type { StaticDescription, StaticLabel } from 'payload'
import type React from 'react'

import { type ChangeEvent } from 'react'

export type TextAreaInputProps = {
  readonly AfterInput?: React.ReactNode
  readonly BeforeInput?: React.ReactNode
  readonly className?: string
  readonly Description?: React.ReactNode
  readonly description?: StaticDescription
  readonly Error?: React.ReactNode
  readonly inputRef?: React.RefObject<HTMLInputElement>
  readonly Label?: React.ReactNode
  readonly label?: StaticLabel
  readonly localized?: boolean
  readonly onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  readonly onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  readonly path: string
  readonly placeholder?: string
  readonly readOnly?: boolean
  readonly required?: boolean
  readonly rows?: number
  readonly rtl?: boolean
  readonly showError?: boolean
  readonly style?: React.CSSProperties
  readonly value?: string
  readonly valueToRender?: string
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/UI/index.tsx
Signals: React

```typescript
'use client'
import type React from 'react'

export const UIField: React.FC = () => {
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Upload/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .upload {
    &__dropzoneAndUpload {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 4);
    }

    &__dropzoneContent {
      display: flex;
      flex-wrap: wrap;
      gap: base(0.4);
      justify-content: space-between;
      width: 100%;
    }

    &__dropzoneContent__buttons {
      display: flex;
      gap: calc(var(--base) / 2);
      position: relative;
      left: -2px;

      .btn .btn__content {
        gap: calc(var(--base) / 5);
      }
    }

    &__dropzoneContent__orText {
      color: var(--theme-elevation-500);
      text-transform: lowercase;
    }

    &__dragAndDropText {
      flex-shrink: 0;
      margin: 0;
      text-transform: lowercase;
      align-self: center;
      color: var(--theme-elevation-500);
    }

    &__loadingRows {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 4);
    }

    .shimmer-effect {
      border-radius: var(--style-radius-s);
      border: 1px solid var(--theme-border-color);
    }

    @include small-break {
      &__dragAndDropText {
        display: none;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Upload/index.tsx
Signals: React

```typescript
'use client'

import type { UploadFieldClientProps, ValueWithRelation } from 'payload'

import React, { useMemo } from 'react'

import { BulkUploadProvider } from '../../elements/BulkUpload/index.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { UploadInput } from './Input.js'
import './index.scss'

export { UploadInput } from './Input.js'
export type { UploadInputProps } from './Input.js'

export const baseClass = 'upload'

export function UploadComponent(props: UploadFieldClientProps) {
  const {
    field,
    field: {
      admin: { allowCreate, className, description, isSortable } = {},
      hasMany,
      label,
      localized,
      maxRows,
      relationTo: relationToFromProps,
      required,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const { config } = useConfig()

  const displayPreview = field.displayPreview

  const memoizedValidate = React.useCallback(
    (value, options) => {
      if (typeof validate === 'function') {
        return validate(value, { ...options, required })
      }
    },
    [validate, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    filterOptions,
    path,
    setValue,
    showError,
    value,
  } = useField<string | string[]>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const isPolymorphic = Array.isArray(relationToFromProps)

  const memoizedValue:
    | (number | string)[]
    | number
    | string
    | ValueWithRelation
    | ValueWithRelation[] = React.useMemo(() => {
    if (hasMany === true) {
      return (
        Array.isArray(value)
          ? value.map((val) => {
              return isPolymorphic
                ? val
                : {
                    relationTo: Array.isArray(relationToFromProps)
                      ? relationToFromProps[0]
                      : relationToFromProps,
                    value: val,
                  }
            })
          : value
      ) as ValueWithRelation[]
    } else {
      // Value comes in as string when not polymorphic and with the object with the right relationTo when it is polymorphic
      return value
    }
  }, [hasMany, value, isPolymorphic, relationToFromProps])

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <BulkUploadProvider drawerSlugPrefix={pathFromProps}>
      <UploadInput
        AfterInput={AfterInput}
        allowCreate={allowCreate !== false}
        api={config.routes.api}
        BeforeInput={BeforeInput}
        className={className}
        Description={Description}
        description={description}
        displayPreview={displayPreview}
        Error={Error}
        filterOptions={filterOptions}
        hasMany={hasMany}
        isSortable={isSortable}
        label={label}
        Label={Label}
        localized={localized}
        maxRows={maxRows}
        onChange={setValue}
        path={path}
        readOnly={readOnly || disabled}
        relationTo={relationToFromProps}
        required={required}
        serverURL={config.serverURL}
        showError={showError}
        style={styles}
        value={memoizedValue}
      />
    </BulkUploadProvider>
  )
}

export const UploadField = withCondition(UploadComponent)
```

--------------------------------------------------------------------------------

````
