---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 394
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 394 of 695)

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
Location: payload-main/packages/ui/src/fields/Relationship/select-components/MultiValueLabel/index.tsx
Signals: React

```typescript
'use client'
import type { MultiValueProps } from 'react-select'

import React, { Fragment, useState } from 'react'
import { components } from 'react-select'

import type { ReactSelectAdapterProps } from '../../../../elements/ReactSelect/types.js'
import type { Option } from '../../types.js'

import { Tooltip } from '../../../../elements/Tooltip/index.js'
import { EditIcon } from '../../../../icons/Edit/index.js'
import { useAuth } from '../../../../providers/Auth/index.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'relationship--multi-value-label'

export const MultiValueLabel: React.FC<
  {
    selectProps: {
      // TODO Fix this - moduleResolution 16 breaks our declare module
      customProps: ReactSelectAdapterProps['customProps']
    }
  } & MultiValueProps<Option>
> = (props) => {
  const {
    data: { allowEdit, label, relationTo, value },
    selectProps: { customProps: { draggableProps, onDocumentOpen } = {} } = {},
  } = props

  const { permissions } = useAuth()
  const [showTooltip, setShowTooltip] = useState(false)
  const { t } = useTranslation()
  const hasReadPermission = Boolean(permissions?.collections?.[relationTo]?.read)

  return (
    <div className={baseClass} title={label || ''}>
      <div className={`${baseClass}__content`}>
        <components.MultiValueLabel
          {...props}
          innerProps={{
            className: `${baseClass}__text`,
            ...(draggableProps || {}),
          }}
        />
      </div>
      {relationTo && hasReadPermission && allowEdit !== false && (
        <Fragment>
          <button
            aria-label={`Edit ${label}`}
            className={`${baseClass}__drawer-toggler`}
            onClick={(event) => {
              setShowTooltip(false)
              onDocumentOpen({
                id: value,
                collectionSlug: relationTo,
                hasReadPermission,
                openInNewTab: event.metaKey || event.ctrlKey,
              })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation()
              }
            }}
            onMouseDown={(e) => e.stopPropagation()} // prevents react-select dropdown from opening
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onTouchEnd={(e) => e.stopPropagation()} // prevents react-select dropdown from opening
            type="button"
          >
            <Tooltip className={`${baseClass}__tooltip`} show={showTooltip}>
              {t('general:editLabel', { label: '' })}
            </Tooltip>
            <EditIcon className={`${baseClass}__icon`} />
          </button>
        </Fragment>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Relationship/select-components/SingleValue/index.scss

```text
@import '../../../../scss/styles.scss';

@layer payload-default {
  .relationship--single-value {
    &.rs__single-value {
      overflow: visible;
      min-width: 0;
    }

    &__label-text {
      max-width: unset;
      display: flex;
      align-items: center;
      overflow: visible;
      width: 100%;
      flex-shrink: 1;
    }

    &__text {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__drawer-toggler {
      border: none;
      background-color: transparent;
      padding: 0;
      cursor: pointer;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: base(0.25);
      pointer-events: all;

      .icon {
        width: base(0.75);
        height: base(0.75);
      }

      &:focus-visible {
        outline: var(--accessibility-outline);
      }

      &:hover {
        background-color: var(--theme-elevation-100);
      }
    }

    &__label {
      flex-grow: 1;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Relationship/select-components/SingleValue/index.tsx
Signals: React

```typescript
'use client'
import type { SingleValueProps } from 'react-select'

import React, { Fragment, useState } from 'react'
import { components as SelectComponents } from 'react-select'

import type { ReactSelectAdapterProps } from '../../../../elements/ReactSelect/types.js'
import type { Option } from '../../types.js'

import { Tooltip } from '../../../../elements/Tooltip/index.js'
import { EditIcon } from '../../../../icons/Edit/index.js'
import { useAuth } from '../../../../providers/Auth/index.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'relationship--single-value'

export const SingleValue: React.FC<
  {
    selectProps: {
      // TODO Fix this - moduleResolution 16 breaks our declare module
      customProps: ReactSelectAdapterProps['customProps']
    }
  } & SingleValueProps<Option>
> = (props) => {
  const {
    children,
    data: { allowEdit, label, relationTo, value },
    selectProps: { customProps: { onDocumentOpen } = {} } = {},
  } = props

  const [showTooltip, setShowTooltip] = useState(false)
  const { t } = useTranslation()
  const { permissions } = useAuth()
  const hasReadPermission = Boolean(permissions?.collections?.[relationTo]?.read)

  return (
    <SelectComponents.SingleValue {...props} className={baseClass}>
      <div className={`${baseClass}__label`} title={label || ''}>
        <div className={`${baseClass}__label-text`}>
          <div className={`${baseClass}__text`}>{children}</div>
          {relationTo && hasReadPermission && allowEdit !== false && (
            <Fragment>
              <button
                aria-label={t('general:editLabel', { label })}
                className={`${baseClass}__drawer-toggler`}
                onClick={(event) => {
                  setShowTooltip(false)
                  onDocumentOpen({
                    id: value,
                    collectionSlug: relationTo,
                    hasReadPermission,
                    openInNewTab: event.metaKey || event.ctrlKey,
                  })
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation()
                  }
                }}
                onMouseDown={(e) => e.stopPropagation()} // prevents react-select dropdown from opening
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onTouchEnd={(e) => e.stopPropagation()} // prevents react-select dropdown from openingtype="button"
                type="button"
              >
                <Tooltip className={`${baseClass}__tooltip`} show={showTooltip}>
                  {t('general:edit')}
                </Tooltip>
                <EditIcon />
              </button>
            </Fragment>
          )}
        </div>
      </div>
    </SelectComponents.SingleValue>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/RichText/index.tsx
Signals: React

```typescript
'use client'
import type { RichTextFieldClientProps } from 'payload'
import type React from 'react'

export const RichTextField: React.FC<RichTextFieldClientProps> = () => {
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Row/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .field-type.row {
    margin-bottom: 0;

    .row__fields {
      display: flex;
      flex-wrap: wrap;
      row-gap: calc(var(--base) * 0.8);

      > * {
        flex: 0 1 var(--field-width);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      }

      // add margin if the row has children
      &:has(> *:nth-child(1)) {
        margin-bottom: var(--base);
      }

      // If there is more than one child, add inline-margins to space them out.
      &:has(> *:nth-child(2)) {
        margin-inline: calc(var(--base) / -4); // add negative margin to counteract the gap.

        > * {
          flex: 0 1 calc(var(--field-width) - var(--base) * 0.5);
          margin-inline: calc(var(--base) / 4);
        }
      }
    }

    @include mid-break {
      .row__fields {
        display: block;
        margin-left: 0;
        margin-right: 0;
        width: 100%;

        > * {
          margin-left: 0;
          margin-right: 0;
          width: 100% !important;
          padding-left: 0;
          padding-right: 0;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Row/index.tsx
Signals: React

```typescript
'use client'
import type { RowFieldClientComponent } from 'payload'

import React from 'react'

import { RenderFields } from '../../forms/RenderFields/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { fieldBaseClass } from '../shared/index.js'
import './index.scss'
import { RowProvider } from './provider.js'

const baseClass = 'row'

const RowFieldComponent: RowFieldClientComponent = (props) => {
  const {
    field: { admin: { className, style } = {}, fields },
    forceRender = false,
    indexPath = '',
    parentPath = '',
    parentSchemaPath = '',
    permissions,
    readOnly,
  } = props

  return (
    <RowProvider>
      <div
        className={[fieldBaseClass, baseClass, className].filter(Boolean).join(' ')}
        style={style || undefined}
      >
        <RenderFields
          className={`${baseClass}__fields`}
          fields={fields}
          forceRender={forceRender}
          margins={false}
          parentIndexPath={indexPath}
          parentPath={parentPath}
          parentSchemaPath={parentSchemaPath}
          permissions={permissions}
          readOnly={readOnly}
        />
      </div>
    </RowProvider>
  )
}

export const RowField = withCondition(RowFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: provider.tsx]---
Location: payload-main/packages/ui/src/fields/Row/provider.tsx
Signals: React

```typescript
'use client'
import React, { createContext, use } from 'react'

export const Context = createContext(false)

export const RowProvider: React.FC<{ children?: React.ReactNode; withinRow?: boolean }> = ({
  children,
  withinRow = true,
}) => {
  return <Context value={withinRow}>{children}</Context>
}

export const useRow = (): boolean => use(Context)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Select/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .field-type.select {
    position: relative;
  }

  html[data-theme='light'] {
    .field-type.select {
      &.error {
        .rs__control {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .field-type.select {
      &.error {
        .rs__control {
          @include darkInputError;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Select/index.tsx
Signals: React

```typescript
'use client'
import type {
  Option,
  OptionObject,
  SelectFieldClientComponent,
  SelectFieldClientProps,
} from 'payload'

import React, { useCallback, useMemo } from 'react'

import type { ReactSelectAdapterProps } from '../../elements/ReactSelect/types.js'
import type { SelectInputProps } from './Input.js'

import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { SelectInput } from './Input.js'

export const formatOptions = (options: Option[]): OptionObject[] =>
  options.map((option) => {
    if (typeof option === 'object' && (option.value || option.value === '')) {
      return option
    }

    return {
      label: option,
      value: option,
    } as OptionObject
  })

const SelectFieldComponent: SelectFieldClientComponent = (props) => {
  const {
    field,
    field: {
      name,
      admin: {
        className,
        description,
        isClearable = true,
        isSortable = true,
        placeholder,
      } = {} as SelectFieldClientProps['field']['admin'],
      hasMany = false,
      label,
      localized,
      options: optionsFromProps = [],
      required,
    },
    onChange: onChangeFromProps,
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const options = React.useMemo(() => formatOptions(optionsFromProps), [optionsFromProps])

  const memoizedValidate = useCallback(
    (value, validationOptions) => {
      if (typeof validate === 'function') {
        return validate(value, { ...validationOptions, hasMany, options, required })
      }
    },
    [validate, required, hasMany, options],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    selectFilterOptions,
    setValue,
    showError,
    value,
  } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const onChange: ReactSelectAdapterProps['onChange'] = useCallback(
    (selectedOption: OptionObject | OptionObject[]) => {
      if (!readOnly || disabled) {
        let newValue: string | string[] = null
        if (selectedOption && hasMany) {
          if (Array.isArray(selectedOption)) {
            newValue = selectedOption.map((option) => option.value)
          } else {
            newValue = []
          }
        } else if (selectedOption && !Array.isArray(selectedOption)) {
          newValue = selectedOption.value
        }

        if (typeof onChangeFromProps === 'function') {
          onChangeFromProps(newValue)
        }

        setValue(newValue)
      }
    },
    [readOnly, disabled, hasMany, setValue, onChangeFromProps],
  )

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <SelectInput
      AfterInput={AfterInput}
      BeforeInput={BeforeInput}
      className={className}
      Description={Description}
      description={description}
      Error={Error}
      filterOption={
        selectFilterOptions
          ? ({ label, value }, search) =>
              selectFilterOptions?.some(
                (option) => (typeof option === 'string' ? option : option.value) === value,
              ) && label.toLowerCase().includes(search.toLowerCase())
          : undefined
      }
      hasMany={hasMany}
      isClearable={isClearable}
      isSortable={isSortable}
      Label={Label}
      label={label}
      localized={localized}
      name={name}
      onChange={onChange}
      options={options}
      path={path}
      placeholder={placeholder}
      readOnly={readOnly || disabled}
      required={required}
      showError={showError}
      style={styles}
      value={value as string | string[]}
    />
  )
}

export const SelectField = withCondition(SelectFieldComponent)

export { SelectInput, type SelectInputProps }
```

--------------------------------------------------------------------------------

---[FILE: Input.tsx]---
Location: payload-main/packages/ui/src/fields/Select/Input.tsx
Signals: React

```typescript
'use client'
import type { LabelFunction, OptionObject, StaticDescription, StaticLabel } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { ReactSelectAdapterProps } from '../../elements/ReactSelect/types.js'

import { ReactSelect } from '../../elements/ReactSelect/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { fieldBaseClass } from '../shared/index.js'
import './index.scss'

export type SelectInputProps = {
  readonly AfterInput?: React.ReactNode
  readonly BeforeInput?: React.ReactNode
  readonly className?: string
  readonly Description?: React.ReactNode
  readonly description?: StaticDescription
  readonly Error?: React.ReactNode
  readonly filterOption?: ReactSelectAdapterProps['filterOption']
  readonly hasMany?: boolean
  readonly id?: string
  readonly isClearable?: boolean
  readonly isSortable?: boolean
  readonly Label?: React.ReactNode
  readonly label?: StaticLabel
  readonly localized?: boolean
  readonly name: string
  readonly onChange?: ReactSelectAdapterProps['onChange']
  readonly onInputChange?: ReactSelectAdapterProps['onInputChange']
  readonly options?: OptionObject[]
  readonly path: string
  readonly placeholder?: LabelFunction | string
  readonly readOnly?: boolean
  readonly required?: boolean
  readonly showError?: boolean
  readonly style?: React.CSSProperties
  readonly value?: string | string[]
}

export const SelectInput: React.FC<SelectInputProps> = (props) => {
  const {
    id,
    AfterInput,
    BeforeInput,
    className,
    Description,
    description,
    Error,
    filterOption,
    hasMany = false,
    isClearable = true,
    isSortable = true,
    label,
    Label,
    localized,
    onChange,
    onInputChange,
    options,
    path,
    placeholder,
    readOnly,
    required,
    showError,
    style,
    value,
  } = props

  const { i18n } = useTranslation()

  let valueToRender

  if (hasMany && Array.isArray(value)) {
    valueToRender = value.map((val) => {
      const matchingOption = options.find((option) => option.value === val)
      return {
        label: matchingOption ? getTranslation(matchingOption.label, i18n) : val,
        value: matchingOption?.value ?? val,
      }
    })
  } else if (value) {
    const matchingOption = options.find((option) => option.value === value)
    valueToRender = {
      label: matchingOption ? getTranslation(matchingOption.label, i18n) : value,
      value: matchingOption?.value ?? value,
    }
  } else {
    // If value is not present then render nothing, allowing select fields to reset to their initial 'Select an option' state
    valueToRender = null
  }

  return (
    <div
      className={[
        fieldBaseClass,
        'select',
        className,
        showError && 'error',
        readOnly && 'read-only',
      ]
        .filter(Boolean)
        .join(' ')}
      id={`field-${path.replace(/\./g, '__')}`}
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
        <ReactSelect
          disabled={readOnly}
          filterOption={filterOption}
          id={id}
          isClearable={isClearable}
          isMulti={hasMany}
          isSortable={isSortable}
          onChange={onChange}
          onInputChange={onInputChange}
          options={options.map((option) => ({
            ...option,
            label: getTranslation(option.label, i18n),
          }))}
          placeholder={placeholder}
          showError={showError}
          value={valueToRender as OptionObject}
        />
        {AfterInput}
      </div>
      <RenderCustomComponent
        CustomComponent={Description}
        Fallback={<FieldDescription description={description} path={path} />}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/shared/index.tsx

```typescript
'use client'
import type { Locale, SanitizedLocalizationConfig } from 'payload'

export const fieldBaseClass = 'field-type'

/**
 * Determines whether a field should be displayed as right-to-left (RTL) based on its configuration, payload's localization configuration and the adming user's currently enabled locale.

 * @returns Whether the field should be displayed as RTL.
 */
export function isFieldRTL({
  fieldLocalized,
  fieldRTL,
  locale,
  localizationConfig,
}: {
  fieldLocalized: boolean
  fieldRTL: boolean
  locale: Locale
  localizationConfig?: SanitizedLocalizationConfig
}) {
  const hasMultipleLocales =
    locale &&
    localizationConfig &&
    localizationConfig.locales &&
    localizationConfig.locales.length > 1

  const isCurrentLocaleDefaultLocale = locale?.code === localizationConfig?.defaultLocale

  return (
    (fieldRTL !== false &&
      locale?.rtl === true &&
      (fieldLocalized ||
        (!fieldLocalized && !hasMultipleLocales) || // If there is only one locale which is also rtl, that field is rtl too
        (!fieldLocalized && isCurrentLocaleDefaultLocale))) || // If the current locale is the default locale, but the field is not localized, that field is rtl too
    fieldRTL === true
  ) // If fieldRTL is true. This should be useful for when no localization is set at all in the payload config, but you still want fields to be rtl.
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Slug/index.scss

```text
@layer payload-default {
  .slug-field-component {
    width: 100%;

    .label-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: calc(var(--base) / 2);
    }

    .lock-button {
      margin: 0;
      padding-bottom: 0.3125rem;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Slug/index.tsx
Signals: React

```typescript
'use client'

import type { SlugFieldClientProps } from 'payload'

import React, { useCallback, useState } from 'react'

import { Button } from '../../elements/Button/index.js'
import { useForm } from '../../forms/Form/index.js'
import { useField } from '../../forms/useField/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useServerFunctions } from '../../providers/ServerFunctions/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { FieldLabel } from '../FieldLabel/index.js'
import { TextInput } from '../Text/index.js'
import './index.scss'

/**
 * @experimental This component is experimental and may change or be removed in the future. Use at your own risk.
 */
export const SlugField: React.FC<SlugFieldClientProps> = ({
  field,
  path,
  readOnly: readOnlyFromProps,
  useAsSlug,
}) => {
  const { label } = field

  const { t } = useTranslation()

  const { collectionSlug, globalSlug } = useDocumentInfo()

  const { slugify } = useServerFunctions()

  const { setValue, value } = useField<string>({ path: path || field.name })

  const { getData, getDataByPath } = useForm()

  const [isLocked, setIsLocked] = useState(true)

  /**
   * This method allows the user to generate their slug on demand, e.g. when they click the "generate" button.
   * It uses the `slugify` server function to gain access to their custom slugify function defined in their field config.
   */
  const handleGenerate = useCallback(
    async (e: React.MouseEvent<Element>) => {
      e.preventDefault()

      const valueToSlugify = getDataByPath(useAsSlug)

      const formattedSlug = await slugify({
        collectionSlug,
        data: getData(),
        globalSlug,
        path,
        valueToSlugify,
      })

      if (formattedSlug === null || formattedSlug === undefined) {
        setValue('')
        return
      }

      /**
       * The result may be the same as the current value, and if so, we don't want to trigger a re-render.
       */
      if (value !== formattedSlug) {
        setValue(formattedSlug)
      }
    },
    [setValue, value, useAsSlug, getData, slugify, getDataByPath, collectionSlug, globalSlug, path],
  )

  const toggleLock = useCallback((e: React.MouseEvent<Element>) => {
    e.preventDefault()
    setIsLocked((prev) => !prev)
  }, [])

  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper">
        <FieldLabel htmlFor={`field-${path}`} label={label} />
        {!isLocked && (
          <Button buttonStyle="none" className="lock-button" onClick={handleGenerate}>
            {t('authentication:generate')}
          </Button>
        )}
        <Button buttonStyle="none" className="lock-button" onClick={toggleLock}>
          {isLocked ? t('general:unlock') : t('general:lock')}
        </Button>
      </div>
      <TextInput
        onChange={setValue}
        path={path || field.name}
        readOnly={Boolean(readOnlyFromProps || isLocked)}
        value={value}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Tabs/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .tabs-field {
    margin-top: base(2);
    margin-left: calc(var(--gutter-h) * -1);
    margin-right: calc(var(--gutter-h) * -1);

    &--hidden {
      display: none;
    }

    &__content-wrap {
      padding-left: var(--gutter-h);
      padding-right: var(--gutter-h);
    }

    &--within-collapsible {
      margin: 0 calc(#{$baseline} * -1);

      .tabs-field__content-wrap {
        padding-left: $baseline;
        padding-right: $baseline;
      }

      .tabs-field__tabs {
        &:before,
        &:after {
          content: ' ';
          display: block;
          width: $baseline;
        }
      }
    }

    &__tabs-wrap {
      overflow-x: auto;
      overflow-y: hidden;
      margin-bottom: $baseline;
    }

    &__tabs {
      border-bottom: 1px solid var(--theme-elevation-100);
      display: inline-flex;
      min-width: 100%;
      vertical-align: bottom;

      &:before,
      &:after {
        content: ' ';
        display: block;
        width: var(--gutter-h);
        flex-shrink: 0;
      }
    }

    &__tab--hidden {
      display: none;
    }

    &__description {
      margin-bottom: calc(var(--base) / 2);
    }

    @include small-break {
      &--within-collapsible {
        margin-left: calc(var(--gutter-h) * -1);
        margin-right: calc(var(--gutter-h) * -1);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Tabs/index.tsx
Signals: React

```typescript
'use client'
import type {
  ClientComponentProps,
  ClientField,
  ClientTab,
  DocumentPreferences,
  SanitizedFieldPermissions,
  StaticDescription,
  TabsFieldClientComponent,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { tabHasName, toKebabCase } from 'payload/shared'
import React, { useCallback, useEffect, useState } from 'react'

import { useCollapsible } from '../../elements/Collapsible/provider.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { useFormFields } from '../../forms/Form/index.js'
import { RenderFields } from '../../forms/RenderFields/index.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { usePreferences } from '../../providers/Preferences/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { FieldDescription } from '../FieldDescription/index.js'
import { fieldBaseClass } from '../shared/index.js'
import { TabsProvider } from './provider.js'
import { TabComponent } from './Tab/index.js'
import './index.scss'

const baseClass = 'tabs-field'

export { TabsProvider }

function generateTabPath({ activeTabConfig, path }: { activeTabConfig: ClientTab; path: string }) {
  let tabPath = path

  if (tabHasName(activeTabConfig) && activeTabConfig.name) {
    if (path) {
      tabPath = `${path}.${activeTabConfig.name}`
    } else {
      tabPath = activeTabConfig.name
    }
  }

  return tabPath
}

const TabsFieldComponent: TabsFieldClientComponent = (props) => {
  const {
    field: { admin: { className } = {}, tabs = [] },
    forceRender = false,
    indexPath = '',
    parentPath = '',
    parentSchemaPath = '',
    path = '',
    permissions,
    readOnly,
  } = props

  const { getPreference, setPreference } = usePreferences()
  const { preferencesKey } = useDocumentInfo()
  const { i18n } = useTranslation()
  const { isWithinCollapsible } = useCollapsible()

  const tabStates = useFormFields(([fields]) => {
    return tabs.map((tab, index) => {
      const id = tab?.id

      return {
        index,
        passesCondition: fields?.[id]?.passesCondition ?? true,
        tab,
      }
    })
  })

  const [activeTabIndex, setActiveTabIndex] = useState<number>(
    () => tabStates.filter(({ passesCondition }) => passesCondition)?.[0]?.index ?? 0,
  )

  const tabsPrefKey = `tabs-${indexPath}`
  const [activeTabPath, setActiveTabPath] = useState<string>(() =>
    generateTabPath({ activeTabConfig: tabs[activeTabIndex], path: parentPath }),
  )

  const [activeTabSchemaPath, setActiveTabSchemaPath] = useState<string>(() =>
    generateTabPath({ activeTabConfig: tabs[0], path: parentSchemaPath }),
  )

  const activePathChildrenPath = tabHasName(tabs[activeTabIndex]) ? activeTabPath : parentPath
  const activeTabInfo = tabStates[activeTabIndex]
  const activeTabConfig = activeTabInfo?.tab
  const activePathSchemaChildrenPath = tabHasName(tabs[activeTabIndex])
    ? activeTabSchemaPath
    : parentSchemaPath

  const activeTabDescription = activeTabConfig.admin?.description ?? activeTabConfig.description

  const activeTabStaticDescription =
    typeof activeTabDescription === 'function'
      ? activeTabDescription({ i18n, t: i18n.t })
      : activeTabDescription

  const hasVisibleTabs = tabStates.some(({ passesCondition }) => passesCondition)

  const handleTabChange = useCallback(
    async (incomingTabIndex: number): Promise<void> => {
      setActiveTabIndex(incomingTabIndex)

      setActiveTabPath(
        generateTabPath({ activeTabConfig: tabs[incomingTabIndex], path: parentPath }),
      )
      setActiveTabSchemaPath(
        generateTabPath({ activeTabConfig: tabs[incomingTabIndex], path: parentSchemaPath }),
      )

      const existingPreferences: DocumentPreferences = await getPreference(preferencesKey)

      if (preferencesKey) {
        void setPreference(preferencesKey, {
          ...existingPreferences,
          ...(path
            ? {
                fields: {
                  ...(existingPreferences?.fields || {}),
                  [path]: {
                    ...existingPreferences?.fields?.[path],
                    tabIndex: incomingTabIndex,
                  },
                },
              }
            : {
                fields: {
                  ...existingPreferences?.fields,
                  [tabsPrefKey]: {
                    ...existingPreferences?.fields?.[tabsPrefKey],
                    tabIndex: incomingTabIndex,
                  },
                },
              }),
        })
      }
    },
    [
      tabs,
      parentPath,
      parentSchemaPath,
      getPreference,
      preferencesKey,
      setPreference,
      path,
      tabsPrefKey,
    ],
  )

  useEffect(() => {
    if (preferencesKey) {
      const getInitialPref = async () => {
        const existingPreferences: DocumentPreferences = await getPreference(preferencesKey)
        const initialIndex = path
          ? existingPreferences?.fields?.[path]?.tabIndex
          : existingPreferences?.fields?.[tabsPrefKey]?.tabIndex

        const newIndex = initialIndex || 0
        setActiveTabIndex(newIndex)

        setActiveTabPath(generateTabPath({ activeTabConfig: tabs[newIndex], path: parentPath }))
        setActiveTabSchemaPath(
          generateTabPath({ activeTabConfig: tabs[newIndex], path: parentSchemaPath }),
        )
      }
      void getInitialPref()
    }
  }, [path, getPreference, preferencesKey, tabsPrefKey, tabs, parentPath, parentSchemaPath])

  useEffect(() => {
    if (activeTabInfo?.passesCondition === false) {
      const nextTab = tabStates.find(({ passesCondition }) => passesCondition)
      if (nextTab) {
        void handleTabChange(nextTab.index)
      }
    }
  }, [activeTabInfo, tabStates, handleTabChange])

  return (
    <div
      className={[
        fieldBaseClass,
        className,
        baseClass,
        isWithinCollapsible && `${baseClass}--within-collapsible`,
        !hasVisibleTabs && `${baseClass}--hidden`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <TabsProvider>
        <div className={`${baseClass}__tabs-wrap`}>
          <div className={`${baseClass}__tabs`}>
            {tabStates.map(({ index, passesCondition, tab }) => (
              <TabComponent
                hidden={!passesCondition}
                isActive={activeTabIndex === index}
                key={index}
                parentPath={path}
                setIsActive={() => {
                  void handleTabChange(index)
                }}
                tab={tab}
              />
            ))}
          </div>
        </div>
        <div className={`${baseClass}__content-wrap`}>
          {activeTabConfig && (
            <TabContent
              description={activeTabStaticDescription}
              fields={activeTabConfig.fields}
              forceRender={forceRender}
              hidden={false}
              parentIndexPath={
                tabHasName(activeTabConfig)
                  ? ''
                  : `${indexPath ? indexPath + '-' : ''}` + String(activeTabInfo.index)
              }
              parentPath={activePathChildrenPath}
              parentSchemaPath={activePathSchemaChildrenPath}
              path={activeTabPath}
              permissions={
                permissions && typeof permissions === 'object' && 'name' in activeTabConfig
                  ? permissions[activeTabConfig.name] &&
                    typeof permissions[activeTabConfig.name] === 'object' &&
                    'fields' in permissions[activeTabConfig.name]
                    ? permissions[activeTabConfig.name].fields
                    : permissions[activeTabConfig.name]
                  : permissions
              }
              readOnly={readOnly}
            />
          )}
        </div>
      </TabsProvider>
    </div>
  )
}

export const TabsField = withCondition(TabsFieldComponent)

type ActiveTabProps = {
  readonly description: StaticDescription
  readonly fields: ClientField[]
  readonly hidden: boolean
  readonly label?: string
  readonly parentIndexPath: string
  readonly parentPath: string
  readonly parentSchemaPath: string
  readonly path: string
  readonly permissions: SanitizedFieldPermissions
  readonly readOnly: boolean
} & Pick<ClientComponentProps, 'forceRender'>

function TabContent({
  description,
  fields,
  forceRender,
  hidden,
  label,
  parentIndexPath,
  parentPath,
  parentSchemaPath,
  permissions,
  readOnly,
}: ActiveTabProps) {
  const { i18n } = useTranslation()

  const { customComponents: { AfterInput, BeforeInput, Description, Field } = {}, path } =
    useField()

  if (Field) {
    return Field
  }

  return (
    <div
      className={[
        hidden && `${baseClass}__tab--hidden`,
        `${baseClass}__tab`,
        label && `${baseClass}__tabConfigLabel-${toKebabCase(getTranslation(label, i18n))}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <RenderCustomComponent
        CustomComponent={Description}
        Fallback={
          <FieldDescription description={description} marginPlacement="bottom" path={path} />
        }
      />
      {BeforeInput}
      <RenderFields
        fields={fields}
        forceRender={forceRender}
        parentIndexPath={parentIndexPath}
        parentPath={parentPath}
        parentSchemaPath={parentSchemaPath}
        permissions={permissions}
        readOnly={readOnly}
      />
      {AfterInput}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: provider.tsx]---
Location: payload-main/packages/ui/src/fields/Tabs/provider.tsx
Signals: React

```typescript
'use client'
import React, { createContext, use } from 'react'

const Context = createContext(false)

export const TabsProvider: React.FC<{ children?: React.ReactNode; withinTab?: boolean }> = ({
  children,
  withinTab = true,
}) => {
  return <Context value={withinTab}>{children}</Context>
}

export const useTabs = (): boolean => use(Context)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Tabs/Tab/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .tabs-field__tab-button {
    @extend %btn-reset;
    @extend %h4;
    display: flex;
    padding-bottom: base(1);
    margin: 0;
    margin-inline-end: $baseline;
    cursor: pointer;
    opacity: 0.5;
    position: relative;
    white-space: nowrap;
    flex-shrink: 0;
    gap: base(0.5);

    &:last-child {
      margin: 0;
    }

    &:after {
      content: ' ';
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      height: 1px;
      background: var(--theme-elevation-800);
      opacity: 0;
    }

    &:hover {
      opacity: 0.75;

      &:after {
        opacity: 0.2;
      }
    }

    &--hidden {
      display: none;
    }

    &--active {
      opacity: 1 !important;

      &:after {
        opacity: 1 !important;
        height: 2px;
      }
    }

    &__description {
      margin-bottom: calc(var(--base) / 2);
    }

    @include small-break {
      margin: 0 base(0.75) 0 0;
      padding-bottom: base(0.5);

      &:last-child {
        margin: 0;
      }
    }
  }

  html[data-theme='light'] {
    .tabs-field__tab-button--has-error {
      color: var(--theme-error-750);
      &:after {
        background: var(--theme-error-500);
      }
    }
  }

  html[data-theme='dark'] {
    .tabs-field__tab-button--has-error {
      color: var(--theme-error-500);
      &:after {
        background: var(--theme-error-500);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
