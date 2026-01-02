---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 392
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 392 of 695)

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
Location: payload-main/packages/ui/src/fields/Point/index.tsx
Signals: React

```typescript
'use client'
import type { PointFieldClientComponent, PointFieldValidation } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React, { useCallback, useMemo } from 'react'

import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import './index.scss'
import { fieldBaseClass } from '../shared/index.js'

const baseClass = 'point'

export const PointFieldComponent: PointFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: { className, description, placeholder, step } = {},
      label,
      localized,
      required,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const { i18n, t } = useTranslation()

  const memoizedValidate: PointFieldValidation = useCallback(
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
    path,
    setValue,
    showError,
    value = [null, null],
  } = useField<[number, number]>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const handleChange = useCallback(
    (e, index: 0 | 1) => {
      let val = parseFloat(e.target.value)
      if (Number.isNaN(val)) {
        val = e.target.value
      }
      const coordinates = [...value]
      coordinates[index] = val
      setValue(coordinates)
    },
    [setValue, value],
  )

  const getCoordinateFieldLabel = (type: 'latitude' | 'longitude') => {
    const suffix = type === 'longitude' ? t('fields:longitude') : t('fields:latitude')
    const fieldLabel = label ? getTranslation(label, i18n) : ''

    return `${fieldLabel}${fieldLabel ? ' - ' : ''}${suffix}`
  }

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <div
      className={[
        fieldBaseClass,
        baseClass,
        className,
        showError && 'error',
        (readOnly || disabled) && 'read-only',
      ]
        .filter(Boolean)
        .join(' ')}
      style={styles}
    >
      <ul className={`${baseClass}__wrap`}>
        <li>
          <RenderCustomComponent
            CustomComponent={Label}
            Fallback={
              <FieldLabel
                label={getCoordinateFieldLabel('longitude')}
                localized={localized}
                path={path}
                required={required}
              />
            }
          />
          <div className="input-wrapper">
            {BeforeInput}
            {/* disable eslint rule because the label is dynamic */}
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <input
              disabled={readOnly || disabled}
              id={`field-longitude-${path?.replace(/\./g, '__')}`}
              name={`${path}.longitude`}
              onChange={(e) => handleChange(e, 0)}
              placeholder={getTranslation(placeholder, i18n)}
              step={step}
              type="number"
              value={value && typeof value[0] === 'number' ? value[0] : ''}
            />
            {AfterInput}
          </div>
        </li>
        <li>
          <RenderCustomComponent
            CustomComponent={Label}
            Fallback={
              <FieldLabel
                label={getCoordinateFieldLabel('latitude')}
                localized={localized}
                path={path}
                required={required}
              />
            }
          />
          <div className="input-wrapper">
            <RenderCustomComponent
              CustomComponent={Error}
              Fallback={<FieldError path={path} showError={showError} />}
            />
            {BeforeInput}
            {/* disable eslint rule because the label is dynamic */}
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <input
              disabled={readOnly || disabled}
              id={`field-latitude-${path?.replace(/\./g, '__')}`}
              name={`${path}.latitude`}
              onChange={(e) => handleChange(e, 1)}
              placeholder={getTranslation(placeholder, i18n)}
              step={step}
              type="number"
              value={value && typeof value[1] === 'number' ? value[1] : ''}
            />
            {AfterInput}
          </div>
        </li>
      </ul>
      <RenderCustomComponent
        CustomComponent={Description}
        Fallback={<FieldDescription description={description} path={path} />}
      />
    </div>
  )
}

export const PointField = withCondition(PointFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/RadioGroup/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .radio-group {
    .tooltip:not([aria-hidden='true']) {
      right: auto;
      position: static;
      margin-bottom: 0.2em;
      max-width: fit-content;
    }

    &--layout-horizontal {
      ul {
        display: flex;
        flex-wrap: wrap;
      }

      li {
        flex-shrink: 0;
        [dir='ltr'] & {
          padding-right: $baseline;
        }
        [dir='rtl'] & {
          padding-left: $baseline;
        }
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  }

  .radio-group--read-only {
    .radio-input {
      cursor: default;

      &:hover {
        border-color: var(--theme-elevation-50);
      }

      &__label {
        color: var(--theme-elevation-400);
      }

      &--is-selected {
        .radio-input__styled-radio {
          &:before {
            background-color: var(--theme-elevation-250);
          }
        }
      }

      &:not(.radio-input--is-selected) {
        &:hover {
          .radio-input__styled-radio {
            &:before {
              opacity: 0;
            }
          }
        }
      }
    }
  }

  html[data-theme='light'] {
    .radio-group {
      &.error {
        .radio-input__styled-radio {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .radio-group {
      &.error {
        .radio-input__styled-radio {
          @include darkInputError;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/RadioGroup/index.tsx
Signals: React

```typescript
'use client'
import type { RadioFieldClientComponent, RadioFieldClientProps } from 'payload'

import { optionIsObject } from 'payload/shared'
import React, { useCallback, useMemo } from 'react'

import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useForm } from '../../forms/Form/context.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import './index.scss'
import { fieldBaseClass } from '../shared/index.js'
import { Radio } from './Radio/index.js'

const baseClass = 'radio-group'

const RadioGroupFieldComponent: RadioFieldClientComponent = (props) => {
  const {
    disableModifyingForm: disableModifyingFormFromProps,
    field,
    field: {
      admin: {
        className,
        description,
        layout = 'horizontal',
      } = {} as RadioFieldClientProps['field']['admin'],
      label,
      localized,
      options = [],
      required,
    } = {} as RadioFieldClientProps['field'],
    onChange: onChangeFromProps,
    path: pathFromProps,
    readOnly,
    validate,
    value: valueFromProps,
  } = props

  const { uuid } = useForm()

  const memoizedValidate = useCallback(
    (value, validationOptions) => {
      if (typeof validate === 'function') {
        return validate(value, { ...validationOptions, options, required })
      }
    },
    [validate, options, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    setValue,
    showError,
    value: valueFromContext,
  } = useField<string>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const value = valueFromContext || valueFromProps

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <div
      className={[
        fieldBaseClass,
        baseClass,
        className,
        `${baseClass}--layout-${layout}`,
        showError && 'error',
        (readOnly || disabled) && `${baseClass}--read-only`,
      ]
        .filter(Boolean)
        .join(' ')}
      style={styles}
    >
      <RenderCustomComponent
        CustomComponent={Error}
        Fallback={<FieldError path={path} showError={showError} />}
      />
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={
          <FieldLabel label={label} localized={localized} path={path} required={required} />
        }
      />
      <div className={`${fieldBaseClass}__wrap`}>
        {BeforeInput}
        <ul className={`${baseClass}--group`} id={`field-${path.replace(/\./g, '__')}`}>
          {options.map((option) => {
            let optionValue = ''

            if (optionIsObject(option)) {
              optionValue = option.value
            } else {
              optionValue = option
            }

            const isSelected = String(optionValue) === String(value)

            const id = `field-${path}-${optionValue}${uuid ? `-${uuid}` : ''}`

            return (
              <li key={`${path} - ${optionValue}`}>
                <Radio
                  id={id}
                  isSelected={isSelected}
                  onChange={() => {
                    if (typeof onChangeFromProps === 'function') {
                      onChangeFromProps(optionValue)
                    }

                    if (!(readOnly || disabled)) {
                      setValue(optionValue, !!disableModifyingFormFromProps)
                    }
                  }}
                  option={optionIsObject(option) ? option : { label: option, value: option }}
                  path={path}
                  readOnly={readOnly || disabled}
                  uuid={uuid}
                />
              </li>
            )
          })}
        </ul>
        {AfterInput}
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </div>
  )
}

export const RadioGroupField: any = withCondition(RadioGroupFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/RadioGroup/Radio/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .radio-input {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: base(0.1) 0;
    position: relative;

    input[type='radio'] {
      opacity: 0;
      margin: 0;
      position: absolute;
    }

    input[type='radio']:focus + .radio-input__styled-radio {
      box-shadow: 0 0 3px 3px var(--theme-success-400);
    }

    &__styled-radio {
      border: 1px solid var(--theme-border-color);
      background-color: var(--theme-input-bg);
      @include shadow-sm;
      width: $baseline;
      height: $baseline;
      position: relative;
      padding: 0;
      display: inline-block;
      border-radius: 50%;

      &:before {
        content: ' ';
        display: block;
        border-radius: 100%;
        background-color: var(--theme-elevation-800);
        width: calc(100% - 8px);
        height: calc(100% - 8px);
        border: 4px solid var(--theme-elevation-0);
        opacity: 0;
      }

      &--disabled {
        @include readOnly;
        &::before {
          border-color: var(--theme-elevation-100);
        }
      }
    }

    [dir='rtl'] &__label {
      margin-left: 0;
      margin-right: base(0.5);
    }

    &__label {
      margin-left: base(0.5);
    }

    &--is-selected {
      .radio-input {
        &__styled-radio {
          &:before {
            opacity: 1;
          }
        }
      }
    }

    &:not(&--is-selected) {
      &:hover {
        .radio-input {
          &__styled-radio {
            &:before {
              opacity: 0.2;
            }
          }
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/RadioGroup/Radio/index.tsx
Signals: React

```typescript
'use client'
import type { OptionObject, RadioFieldClientProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { useEditDepth } from '../../../providers/EditDepth/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'radio-input'

export const Radio: React.FC<{
  id: string
  isSelected: boolean
  onChange: RadioFieldClientProps['onChange']
  option: OptionObject
  path: string
  readOnly?: boolean
  uuid?: string
}> = (props) => {
  const { isSelected, onChange, option, path, readOnly, uuid } = props
  const { i18n } = useTranslation()

  const editDepth = useEditDepth()

  const id = `field-${path}-${option.value}${editDepth > 1 ? `-${editDepth}` : ''}${uuid ? `-${uuid}` : ''}`

  return (
    <label htmlFor={id}>
      <div
        className={[baseClass, isSelected && `${baseClass}--is-selected`].filter(Boolean).join(' ')}
      >
        <input
          checked={isSelected}
          disabled={readOnly}
          id={id}
          name={path}
          onChange={() => (typeof onChange === 'function' ? onChange(option.value) : null)}
          type="radio"
        />
        <span
          className={[
            `${baseClass}__styled-radio`,
            readOnly && `${baseClass}__styled-radio--disabled`,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        <span className={`${baseClass}__label`}>{getTranslation(option.label, i18n)}</span>
      </div>
    </label>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: createRelationMap.ts]---
Location: payload-main/packages/ui/src/fields/Relationship/createRelationMap.ts

```typescript
'use client'
import type { HasManyValueUnion } from './types.js'

type RelationMap = {
  [relation: string]: (number | string)[]
}

type CreateRelationMap = (
  args: {
    relationTo: string[]
  } & HasManyValueUnion,
) => RelationMap

export const createRelationMap: CreateRelationMap = ({ hasMany, relationTo, value }) => {
  const relationMap: RelationMap = relationTo.reduce((map, current) => {
    return { ...map, [current]: [] }
  }, {})

  if (value === null) {
    return relationMap
  }

  if (value) {
    const add = (relation: string, id: number | string) => {
      if ((typeof id === 'string' || typeof id === 'number') && typeof relation === 'string') {
        if (relationMap[relation]) {
          relationMap[relation].push(id)
        } else {
          relationMap[relation] = [id]
        }
      }
    }
    if (hasMany === true) {
      value.forEach((val) => {
        if (val) {
          add(val.relationTo, val.value)
        }
      })
    } else {
      add(value.relationTo, value.value)
    }
  }

  return relationMap
}
```

--------------------------------------------------------------------------------

---[FILE: findOptionsByValue.ts]---
Location: payload-main/packages/ui/src/fields/Relationship/findOptionsByValue.ts

```typescript
'use client'
import type { ValueWithRelation } from 'payload'

import type { Option } from '../../elements/ReactSelect/types.js'
import type { OptionGroup } from './types.js'

type Args = {
  allowEdit: boolean
  options: OptionGroup[]
  value: ValueWithRelation | ValueWithRelation[]
}

export const findOptionsByValue = ({ allowEdit, options, value }: Args): Option | Option[] => {
  if (value || typeof value === 'number') {
    if (Array.isArray(value)) {
      return value.map((val) => {
        let matchedOption: Option

        options.forEach((optGroup) => {
          if (!matchedOption) {
            matchedOption = optGroup.options.find((option) => {
              return option.value === val.value && option.relationTo === val.relationTo
            })
          }
        })

        return matchedOption ? { allowEdit, ...matchedOption } : undefined
      })
    }

    let matchedOption: Option

    options.forEach((optGroup) => {
      if (!matchedOption) {
        matchedOption = optGroup.options.find((option) => {
          return option.value === value.value && option.relationTo === value.relationTo
        })
      }
    })

    return matchedOption ? { allowEdit, ...matchedOption } : undefined
  }

  return undefined
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Relationship/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .field-type.relationship {
    position: relative;
  }

  .relationship {
    &__wrap {
      display: flex;
      width: 100%;

      div.react-select {
        width: 100%;
        min-width: 0;
      }
    }

    &__error-loading {
      border: 1px solid var(--theme-error-500);
      min-height: base(2);
      padding: base(0.5) base(0.75);
      background-color: var(--theme-error-500);
      color: var(--theme-elevation-0);
    }

    &--allow-create {
      .rs__control {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }

  html[data-theme='light'] {
    .relationship {
      &.error {
        > .relationship__wrap {
          .rs__control {
            @include lightInputError;
          }
        }

        button.relationship-add-new__add-button {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .relationship {
      &.error {
        > .relationship__wrap {
          .rs__control {
            @include darkInputError;
          }
        }

        button.relationship-add-new__add-button {
          @include darkInputError;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Relationship/index.tsx
Signals: React

```typescript
'use client'
import type { RelationshipFieldClientComponent, ValueWithRelation } from 'payload'

import React, { useCallback, useMemo } from 'react'

import type { Value } from './types.js'

import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { RelationshipInput } from './Input.js'
import './index.scss'

export { RelationshipInput }

const RelationshipFieldComponent: RelationshipFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: {
        allowCreate = true,
        allowEdit = true,
        appearance = 'select',
        className,
        description,
        isSortable = true,
        placeholder,
        sortOptions,
      } = {},
      hasMany,
      label,
      localized,
      relationTo: relationToProp,
      required,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const memoizedValidate = useCallback(
    (value, validationOptions) => {
      if (typeof validate === 'function') {
        return validate(value, { ...validationOptions, required })
      }
    },
    [validate, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    filterOptions,
    initialValue,
    path,
    setValue,
    showError,
    value,
  } = useField<Value>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const styles = useMemo(() => mergeFieldStyles(field), [field])
  const isPolymorphic = Array.isArray(relationToProp)
  const [relationTo] = React.useState(() =>
    Array.isArray(relationToProp) ? relationToProp : [relationToProp],
  )

  const handleChangeHasMulti = useCallback(
    (newValue: ValueWithRelation[]) => {
      if (!newValue) {
        setValue(null, newValue === value)
        return
      }

      let disableFormModification = false
      if (isPolymorphic) {
        disableFormModification =
          Array.isArray(value) &&
          Array.isArray(newValue) &&
          value.length === newValue.length &&
          (value as ValueWithRelation[]).every((val, idx) => {
            const newVal = newValue[idx]
            return val.value === newVal.value && val.relationTo === newVal.relationTo
          })
      } else {
        disableFormModification =
          Array.isArray(value) &&
          Array.isArray(newValue) &&
          value.length === newValue.length &&
          value.every((val, idx) => val === newValue[idx].value)
      }

      const dataToSet = newValue.map((val) => {
        if (isPolymorphic) {
          return val
        } else {
          return val.value
        }
      })

      setValue(dataToSet, disableFormModification)
    },
    [isPolymorphic, setValue, value],
  )

  const handleChangeSingle = useCallback(
    (newValue: ValueWithRelation) => {
      if (!newValue) {
        setValue(null, newValue === value)
        return
      }

      let disableFormModification = false
      if (isPolymorphic) {
        disableFormModification =
          value &&
          newValue &&
          (value as ValueWithRelation).value === newValue.value &&
          (value as ValueWithRelation).relationTo === newValue.relationTo
      } else {
        disableFormModification = value && newValue && value === newValue.value
      }

      const dataToSet = isPolymorphic ? newValue : newValue.value
      setValue(dataToSet, disableFormModification)
    },
    [isPolymorphic, setValue, value],
  )

  const memoizedValue: ValueWithRelation | ValueWithRelation[] = React.useMemo(() => {
    if (hasMany === true) {
      return (
        Array.isArray(value)
          ? value.map((val) => {
              return isPolymorphic
                ? val
                : {
                    relationTo: Array.isArray(relationTo) ? relationTo[0] : relationTo,
                    value: val,
                  }
            })
          : value
      ) as ValueWithRelation[]
    } else {
      return (
        value
          ? isPolymorphic
            ? value
            : {
                relationTo: Array.isArray(relationTo) ? relationTo[0] : relationTo,
                value,
              }
          : value
      ) as ValueWithRelation
    }
  }, [hasMany, value, isPolymorphic, relationTo])

  const memoizedInitialValue: ValueWithRelation | ValueWithRelation[] = React.useMemo(() => {
    if (hasMany === true) {
      return (
        Array.isArray(initialValue)
          ? initialValue.map((val) => {
              return isPolymorphic
                ? val
                : {
                    relationTo: Array.isArray(relationTo) ? relationTo[0] : relationTo,
                    value: val,
                  }
            })
          : initialValue
      ) as ValueWithRelation[]
    } else {
      return (
        initialValue
          ? isPolymorphic
            ? initialValue
            : {
                relationTo: Array.isArray(relationTo) ? relationTo[0] : relationTo,
                value: initialValue,
              }
          : initialValue
      ) as ValueWithRelation
    }
  }, [initialValue, isPolymorphic, relationTo, hasMany])

  return (
    <RelationshipInput
      AfterInput={AfterInput}
      allowCreate={allowCreate}
      allowEdit={allowEdit}
      appearance={appearance}
      BeforeInput={BeforeInput}
      className={className}
      Description={Description}
      description={description}
      Error={Error}
      filterOptions={filterOptions}
      formatDisplayedOptions={
        isPolymorphic ? undefined : (options) => options.map((opt) => opt.options).flat()
      }
      isSortable={isSortable}
      Label={Label}
      label={label}
      localized={localized}
      maxResultsPerRequest={10}
      maxRows={field?.maxRows}
      minRows={field?.minRows}
      path={path}
      placeholder={placeholder}
      readOnly={readOnly || disabled}
      relationTo={relationTo}
      required={required}
      showError={showError}
      sortOptions={sortOptions as any}
      style={styles}
      {...(hasMany === true
        ? {
            hasMany: true,
            initialValue: memoizedInitialValue as ValueWithRelation[],
            onChange: handleChangeHasMulti,
            value: memoizedValue as ValueWithRelation[],
          }
        : {
            hasMany: false,
            initialValue: memoizedInitialValue as ValueWithRelation,
            onChange: handleChangeSingle,
            value: memoizedValue as ValueWithRelation,
          })}
    />
  )
}

export const RelationshipField = withCondition(RelationshipFieldComponent)
```

--------------------------------------------------------------------------------

````
