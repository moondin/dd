---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 390
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 390 of 695)

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
Location: payload-main/packages/ui/src/fields/Checkbox/Input.tsx
Signals: React

```typescript
'use client'
import type { StaticLabel } from 'payload'

import React, { useId } from 'react'

import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { CheckIcon } from '../../icons/Check/index.js'
import { LineIcon } from '../../icons/Line/index.js'

export type CheckboxInputProps = {
  readonly AfterInput?: React.ReactNode
  readonly BeforeInput?: React.ReactNode
  readonly checked?: boolean
  readonly className?: string
  readonly id?: string
  readonly inputRef?: React.RefObject<HTMLInputElement | null>
  readonly Label?: React.ReactNode
  readonly label?: StaticLabel
  readonly localized?: boolean
  readonly name?: string
  readonly onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void
  readonly partialChecked?: boolean
  readonly readOnly?: boolean
  readonly required?: boolean
}

export const inputBaseClass = 'checkbox-input'

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  id: idFromProps,
  name,
  AfterInput,
  BeforeInput,
  checked,
  className,
  inputRef,
  Label,
  label,
  localized,
  onToggle,
  partialChecked,
  readOnly,
  required,
}) => {
  const fallbackID = useId()
  const id = idFromProps || fallbackID
  return (
    <div
      className={[
        className,
        inputBaseClass,
        checked && `${inputBaseClass}--checked`,
        readOnly && `${inputBaseClass}--read-only`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={`${inputBaseClass}__input`}>
        {BeforeInput}
        <input
          aria-label=""
          aria-labelledby={name}
          defaultChecked={Boolean(checked)}
          disabled={readOnly}
          id={id}
          name={name}
          onInput={onToggle}
          ref={inputRef}
          required={required}
          title={name}
          type="checkbox"
        />
        <span
          className={[`${inputBaseClass}__icon`, !checked && partialChecked ? 'partial' : 'check']
            .filter(Boolean)
            .join(' ')}
        >
          {checked && <CheckIcon />}
          {!checked && partialChecked && <LineIcon />}
        </span>
        {AfterInput}
      </div>
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={
          <FieldLabel htmlFor={id} label={label} localized={localized} required={required} />
        }
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Code/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .code-field {
    position: relative;

    &.error {
      textarea {
        border: 1px solid var(--theme-error-500) !important;
      }
      .code-editor {
        border-color: var(--theme-error-500);
      }
      .monaco-editor-background,
      .margin {
        background-color: var(--theme-error-50);
      }
    }

    .read-only {
      .code-editor {
        @include readOnly;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Code/index.tsx
Signals: React

```typescript
'use client'
import type { CodeFieldClientComponent } from 'payload'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { CodeEditor } from '../../elements/CodeEditor/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { fieldBaseClass } from '../shared/index.js'
import './index.scss'

const prismToMonacoLanguageMap = {
  js: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
}

const baseClass = 'code-field'

const CodeFieldComponent: CodeFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: { className, description, editorOptions, editorProps, language = 'javascript' } = {},
      label,
      localized,
      required,
    },
    onMount,
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const inputChangeFromRef = React.useRef<'formState' | 'internalEditor'>('formState')
  const [recalculatedHeightAt, setRecalculatedHeightAt] = useState<number | undefined>(Date.now())

  const memoizedValidate = useCallback(
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
    initialValue,
    path,
    setValue,
    showError,
    value,
  } = useField<string>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const stringValueRef = React.useRef<string>(
    (value || initialValue) !== undefined ? (value ?? initialValue) : undefined,
  )

  const handleChange = useCallback(
    (val: string) => {
      if (readOnly || disabled) {
        return
      }
      inputChangeFromRef.current = 'internalEditor'

      try {
        setValue(val ? val : null)
        stringValueRef.current = val
      } catch (e) {
        setValue(val ? val : null)
        stringValueRef.current = val
      }
    },
    [readOnly, disabled, setValue],
  )

  useEffect(() => {
    if (inputChangeFromRef.current === 'formState') {
      stringValueRef.current =
        (value || initialValue) !== undefined ? (value ?? initialValue) : undefined
      setRecalculatedHeightAt(Date.now())
    }

    inputChangeFromRef.current = 'formState'
  }, [initialValue, path, value])

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
        <CodeEditor
          defaultLanguage={prismToMonacoLanguageMap[language] || language}
          onChange={handleChange}
          onMount={onMount}
          options={editorOptions}
          readOnly={readOnly || disabled}
          recalculatedHeightAt={recalculatedHeightAt}
          value={stringValueRef.current}
          wrapperProps={{
            id: `field-${path?.replace(/\./g, '__')}`,
          }}
          {...(editorProps || {})}
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

export const CodeField = withCondition(CodeFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Collapsible/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .collapsible-field {
    &__row-label-wrap {
      pointer-events: none;
      display: flex;
      align-items: center;
      gap: base(0.5);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Collapsible/index.tsx
Signals: React

```typescript
'use client'
import type { CollapsibleFieldClientComponent, DocumentPreferences } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import { Collapsible as CollapsibleElement } from '../../elements/Collapsible/index.js'
import { ErrorPill } from '../../elements/ErrorPill/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { RenderFields } from '../../forms/RenderFields/index.js'
import { RowLabel } from '../../forms/RowLabel/index.js'
import { useField } from '../../forms/useField/index.js'
import { WatchChildErrors } from '../../forms/WatchChildErrors/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { usePreferences } from '../../providers/Preferences/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import './index.scss'
import { fieldBaseClass } from '../shared/index.js'

const baseClass = 'collapsible-field'

const CollapsibleFieldComponent: CollapsibleFieldClientComponent = (props) => {
  const {
    field,
    field: { admin: { className, description, initCollapsed = false } = {}, fields, label } = {},
    indexPath,
    parentPath,
    parentSchemaPath,
    path,
    permissions,
    readOnly,
  } = props

  const { i18n } = useTranslation()
  const { getPreference, setPreference } = usePreferences()
  const { preferencesKey } = useDocumentInfo()
  const [collapsedOnMount, setCollapsedOnMount] = useState<boolean>()
  const fieldPreferencesKey = `collapsible-${path?.replace(/\./g, '__')}`
  const [errorCount, setErrorCount] = useState(0)
  const fieldHasErrors = errorCount > 0

  const { customComponents: { AfterInput, BeforeInput, Description, Label } = {}, disabled } =
    useField({
      path,
    })

  const onToggle = useCallback(
    async (newCollapsedState: boolean): Promise<void> => {
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
                    collapsed: newCollapsedState,
                  },
                },
              }
            : {
                fields: {
                  ...(existingPreferences?.fields || {}),
                  [fieldPreferencesKey]: {
                    ...existingPreferences?.fields?.[fieldPreferencesKey],
                    collapsed: newCollapsedState,
                  },
                },
              }),
        })
      }
    },
    [preferencesKey, fieldPreferencesKey, getPreference, setPreference, path],
  )

  useEffect(() => {
    const fetchInitialState = async () => {
      if (preferencesKey) {
        const preferences = await getPreference(preferencesKey)
        const specificPreference = path
          ? preferences?.fields?.[path]?.collapsed
          : preferences?.fields?.[fieldPreferencesKey]?.collapsed

        if (specificPreference !== undefined) {
          setCollapsedOnMount(Boolean(specificPreference))
        } else {
          setCollapsedOnMount(typeof initCollapsed === 'boolean' ? initCollapsed : false)
        }
      } else {
        setCollapsedOnMount(typeof initCollapsed === 'boolean' ? initCollapsed : false)
      }
    }

    void fetchInitialState()
  }, [getPreference, preferencesKey, fieldPreferencesKey, initCollapsed, path])

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  if (typeof collapsedOnMount !== 'boolean') {
    return null
  }

  return (
    <Fragment>
      <WatchChildErrors
        fields={fields}
        // removes the 'collapsible' path segment, i.e. `_index-0`
        path={path.split('.').slice(0, -1)}
        setErrorCount={setErrorCount}
      />
      <div
        className={[
          fieldBaseClass,
          baseClass,
          className,
          fieldHasErrors ? `${baseClass}--has-error` : `${baseClass}--has-no-error`,
        ]
          .filter(Boolean)
          .join(' ')}
        id={`field-${fieldPreferencesKey}`}
        style={styles}
      >
        {BeforeInput}
        <CollapsibleElement
          className={`${baseClass}__collapsible`}
          collapsibleStyle={fieldHasErrors ? 'error' : 'default'}
          header={
            <div className={`${baseClass}__row-label-wrap`}>
              <RowLabel CustomComponent={Label} label={getTranslation(label, i18n)} path={path} />
              {fieldHasErrors && <ErrorPill count={errorCount} i18n={i18n} withMessage />}
            </div>
          }
          initCollapsed={collapsedOnMount}
          onToggle={onToggle}
        >
          <RenderFields
            fields={fields}
            margins="small"
            parentIndexPath={indexPath}
            parentPath={parentPath}
            parentSchemaPath={parentSchemaPath}
            permissions={permissions}
            readOnly={readOnly || disabled}
          />
        </CollapsibleElement>
        {AfterInput}
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </Fragment>
  )
}

export const CollapsibleField = withCondition(CollapsibleFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/ConfirmPassword/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .field-type.confirm-password {
    position: relative;

    input {
      @include formInput;
    }
  }

  html[data-theme='light'] {
    .field-type.field-type.confirm-password {
      &.error {
        input {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .field-type.field-type.confirm-password {
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
Location: payload-main/packages/ui/src/fields/ConfirmPassword/index.tsx
Signals: React

```typescript
'use client'

import { confirmPassword } from 'payload/shared'
import React from 'react'

import { useField } from '../../forms/useField/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { FieldError } from '../FieldError/index.js'
import { FieldLabel } from '../FieldLabel/index.js'
import { fieldBaseClass } from '../shared/index.js'
import './index.scss'

export type ConfirmPasswordFieldProps = {
  readonly disabled?: boolean
  readonly path?: string
}

export const ConfirmPasswordField: React.FC<ConfirmPasswordFieldProps> = (props) => {
  const { disabled: disabledFromProps, path = 'confirm-password' } = props
  const { t } = useTranslation()

  const { disabled, setValue, showError, value } = useField({
    path,
    validate: (value, options) => {
      return confirmPassword(value, {
        name: 'confirm-password',
        type: 'text',
        required: true,
        ...options,
      })
    },
  })

  return (
    <div
      className={[fieldBaseClass, 'confirm-password', showError && 'error']
        .filter(Boolean)
        .join(' ')}
    >
      <FieldLabel
        htmlFor="field-confirm-password"
        label={t('authentication:confirmPassword')}
        required
      />
      <div className={`${fieldBaseClass}__wrap`}>
        <FieldError path={path} />
        <input
          aria-label={t('authentication:confirmPassword')}
          autoComplete="off"
          disabled={!!(disabled || disabledFromProps)}
          id="field-confirm-password"
          name="confirm-password"
          onChange={setValue}
          type="password"
          value={(value as string) || ''}
        />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/DateTime/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  html[data-theme='light'] {
    .date-time-field {
      &--has-error {
        .react-datepicker__input-container input {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .date-time-field {
      &--has-error {
        .react-datepicker__input-container input {
          @include darkInputError;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/DateTime/index.tsx
Signals: React

```typescript
'use client'
import type { DateFieldClientComponent, DateFieldValidation } from 'payload'

import { TZDateMini as TZDate } from '@date-fns/tz/date/mini'
import { getTranslation } from '@payloadcms/translations'
import { transpose } from 'date-fns'
import { useCallback, useMemo } from 'react'

import { DatePickerField } from '../../elements/DatePicker/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { TimezonePicker } from '../../elements/TimezonePicker/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useForm, useFormFields } from '../../forms/Form/context.js'
import { useField } from '../../forms/useField/index.js'
import './index.scss'
import { withCondition } from '../../forms/withCondition/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { fieldBaseClass } from '../shared/index.js'

const baseClass = 'date-time-field'

const DateTimeFieldComponent: DateFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: { className, date: datePickerProps, description, placeholder } = {},
      label,
      localized,
      required,
      timezone,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const pickerAppearance = datePickerProps?.pickerAppearance || 'default'

  // Get the user timezone so we can adjust the displayed value against it
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const { config } = useConfig()
  const { i18n } = useTranslation()
  const { dispatchFields, setModified } = useForm()

  const memoizedValidate: DateFieldValidation = useCallback(
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
    value,
  } = useField<string>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const timezonePath = path + '_tz'
  const timezoneField = useFormFields(([fields, _]) => fields?.[timezonePath])

  const supportedTimezones = useMemo(() => {
    if (timezone && typeof timezone === 'object' && timezone.supportedTimezones) {
      return timezone.supportedTimezones
    }

    return config.admin.timezones.supportedTimezones
  }, [config.admin.timezones.supportedTimezones, timezone])

  /**
   * Date appearance doesn't include timestamps,
   * which means we need to pin the time to always 12:00 for the selected date
   */
  const isDateOnly = ['dayOnly', 'default', 'monthOnly'].includes(pickerAppearance)
  const selectedTimezone = timezoneField?.value as string
  const timezoneRequired =
    required || (timezone && typeof timezone === 'object' && timezone.required)

  // The displayed value should be the original value, adjusted to the user's timezone
  const displayedValue = useMemo(() => {
    if (timezone && selectedTimezone && userTimezone && value) {
      // Create TZDate instances for the selected timezone and the user's timezone
      // These instances allow us to transpose the date between timezones while keeping the same time value
      const DateWithOriginalTz = TZDate.tz(selectedTimezone)
      const DateWithUserTz = TZDate.tz(userTimezone)

      const modifiedDate = new TZDate(value).withTimeZone(selectedTimezone)

      // Transpose the date to the selected timezone
      const dateWithTimezone = transpose(modifiedDate, DateWithOriginalTz)

      // Transpose the date to the user's timezone - this is necessary because the react-datepicker component insists on displaying the date in the user's timezone
      const dateWithUserTimezone = transpose(dateWithTimezone, DateWithUserTz)

      return dateWithUserTimezone.toISOString()
    }

    return value
  }, [timezone, selectedTimezone, value, userTimezone])

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  const onChange = useCallback(
    (incomingDate: Date) => {
      if (!(readOnly || disabled)) {
        if (timezone && selectedTimezone && incomingDate) {
          // Create TZDate instances for the selected timezone
          const TZDateWithSelectedTz = TZDate.tz(selectedTimezone)

          if (isDateOnly) {
            // We need to offset this hardcoded hour offset from the DatePicker elemenent
            // this can be removed in 4.0 when we remove the hardcoded offset as it is a breaking change
            // const tzOffset = incomingDate.getTimezoneOffset() / 60
            const incomingOffset = incomingDate.getTimezoneOffset() / 60
            const originalHour = incomingDate.getHours() + incomingOffset
            incomingDate.setHours(originalHour)

            // Convert the original date as picked into the desired timezone.
            const dateToSelectedTz = transpose(incomingDate, TZDateWithSelectedTz)

            setValue(dateToSelectedTz.toISOString() || null)
          } else {
            // Creates a TZDate instance for the user's timezone  — this is default behaviour of TZDate as it wraps the Date constructor
            const dateToUserTz = new TZDate(incomingDate)
            // Transpose the date to the selected timezone
            const dateWithTimezone = transpose(dateToUserTz, TZDateWithSelectedTz)

            setValue(dateWithTimezone.toISOString() || null)
          }
        } else {
          setValue(incomingDate?.toISOString() || null)
        }
      }
    },
    [readOnly, disabled, timezone, selectedTimezone, isDateOnly, setValue],
  )

  const onChangeTimezone = useCallback(
    (timezone: string) => {
      if (timezonePath) {
        dispatchFields({
          type: 'UPDATE',
          path: timezonePath,
          value: timezone,
        })

        setModified(true)
      }
    },
    [dispatchFields, setModified, timezonePath],
  )

  return (
    <div
      className={[
        fieldBaseClass,
        baseClass,
        className,
        showError && `${baseClass}--has-error`,
        (readOnly || disabled) && 'read-only',
      ]
        .filter(Boolean)
        .join(' ')}
      style={styles}
    >
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={
          <FieldLabel label={label} localized={localized} path={path} required={required} />
        }
      />
      <div className={`${fieldBaseClass}__wrap`} id={`field-${path.replace(/\./g, '__')}`}>
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
        {BeforeInput}
        <DatePickerField
          {...datePickerProps}
          onChange={onChange}
          overrides={{
            ...datePickerProps?.overrides,
          }}
          placeholder={getTranslation(placeholder, i18n)}
          readOnly={readOnly || disabled}
          value={displayedValue}
        />
        {timezone && supportedTimezones.length > 0 && (
          <TimezonePicker
            id={`${path}-timezone-picker`}
            onChange={onChangeTimezone}
            options={supportedTimezones}
            readOnly={readOnly || disabled}
            required={timezoneRequired}
            selectedTimezone={selectedTimezone}
          />
        )}
        {AfterInput}
      </div>
      <RenderCustomComponent
        CustomComponent={Description}
        Fallback={<FieldDescription description={description} path={path} />}
      />
    </div>
  )
}

export const DateTimeField = withCondition(DateTimeFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Email/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .field-type.email {
    position: relative;

    input {
      @include formInput;
    }

    &.error {
      input {
        background-color: var(--theme-error-200);
      }
    }
  }

  html[data-theme='light'] {
    .field-type.email {
      &.error {
        input {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .field-type.email {
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
Location: payload-main/packages/ui/src/fields/Email/index.tsx
Signals: React

```typescript
'use client'
import type {
  EmailFieldClientComponent,
  EmailFieldClientProps,
  EmailFieldValidation,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React, { useCallback, useMemo } from 'react'

import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { FieldLabel } from '../FieldLabel/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { fieldBaseClass } from '../shared/index.js'
import './index.scss'

const EmailFieldComponent: EmailFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: {
        autoComplete,
        className,
        description,
        placeholder,
      } = {} as EmailFieldClientProps['field']['admin'],
      label,
      localized,
      required,
    } = {} as EmailFieldClientProps['field'],
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const { i18n } = useTranslation()

  const memoizedValidate: EmailFieldValidation = useCallback(
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
    value,
  } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <div
      className={[
        fieldBaseClass,
        'email',
        className,
        showError && 'error',
        (readOnly || disabled) && 'read-only',
      ]
        .filter(Boolean)
        .join(' ')}
      style={styles}
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
        {/* disable eslint here because the label is dynamic */}
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <input
          autoComplete={autoComplete}
          disabled={readOnly || disabled}
          id={`field-${path.replace(/\./g, '__')}`}
          name={path}
          onChange={setValue}
          placeholder={getTranslation(placeholder, i18n)}
          required={required}
          type="email"
          value={(value as string) || ''}
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

export const EmailField = withCondition(EmailFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/FieldDescription/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .field-description {
    display: flex;
    color: var(--theme-elevation-400);
    margin-top: calc(var(--base) / 4);

    &--margin-bottom {
      margin-top: 0;
      margin-bottom: calc(var(--base) / 2);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/FieldDescription/index.tsx
Signals: React

```typescript
'use client'
import type { GenericDescriptionProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { useTranslation } from '../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'field-description'

export const FieldDescription: React.FC<GenericDescriptionProps> = (props) => {
  const { className, description, marginPlacement, path } = props

  const { i18n } = useTranslation()

  if (description) {
    return (
      <div
        className={[
          baseClass,
          className,
          `field-description-${path?.replace(/\./g, '__')}`,
          marginPlacement && `${baseClass}--margin-${marginPlacement}`,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {getTranslation(description, i18n)}
      </div>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/FieldError/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .field-error.tooltip {
    font-family: var(--font-body);
    left: auto;
    max-width: 75%;
    right: 0;
    transform: translateY(calc(var(--caret-size) * -1));
    color: var(--theme-error-950);
    background-color: var(--theme-error-300);

    &::after {
      border-top-color: var(--theme-error-300);
      border-bottom-color: var(--theme-error-300);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/FieldError/index.tsx
Signals: React

```typescript
'use client'

import type { GenericErrorProps } from 'payload'

import React from 'react'

import { Tooltip } from '../../elements/Tooltip/index.js'
import { useFormFields, useFormSubmitted } from '../../forms/Form/context.js'
import './index.scss'

const baseClass = 'field-error'

export const FieldError: React.FC<GenericErrorProps> = (props) => {
  const {
    alignCaret = 'right',
    message: messageFromProps,
    path,
    showError: showErrorFromProps,
  } = props

  const hasSubmitted = useFormSubmitted()
  const field = useFormFields(([fields]) => (fields && fields?.[path]) || null)

  const { errorMessage, valid } = field || {}

  const message = messageFromProps || errorMessage
  const showMessage = showErrorFromProps || (hasSubmitted && valid === false)

  if (showMessage && message?.length) {
    return (
      <Tooltip alignCaret={alignCaret} className={baseClass} delay={0} staticPositioning>
        {message}
      </Tooltip>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/FieldLabel/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  label.field-label {
    display: flex;
    align-items: center;
  }

  label.field-label:not(.unstyled) {
    @extend %body;
    display: flex;
    padding-bottom: base(0.25);
    color: var(--theme-elevation-800);
    font-family: var(--font-body);
    [dir='ltr'] & {
      margin-right: auto;
    }
    [dir='rtl'] & {
      margin-left: auto;
    }

    .required {
      color: var(--theme-error-500);
    }

    .required {
      [dir='ltr'] & {
        margin-left: base(0.25);
      }
      [dir='rtl'] & {
        margin-right: base(0.25);
      }
    }
  }

  .localized {
    @extend %body;
    [dir='ltr'] & {
      margin-left: base(0.25);
    }
    [dir='rtl'] & {
      margin-right: base(0.25);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/FieldLabel/index.tsx
Signals: React

```typescript
'use client'

import type { GenericLabelProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { useForm } from '../../forms/Form/context.js'
import { useEditDepth } from '../../providers/EditDepth/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { generateFieldID } from '../../utilities/generateFieldID.js'
import './index.scss'

export const FieldLabel: React.FC<GenericLabelProps> = (props) => {
  const {
    as: ElementFromProps = 'label',
    hideLocale = false,
    htmlFor: htmlForFromProps,
    label,
    localized = false,
    path,
    required = false,
    unstyled = false,
  } = props

  const { uuid } = useForm()
  const editDepth = useEditDepth()

  const htmlFor = htmlForFromProps || generateFieldID(path, editDepth, uuid)

  const { i18n } = useTranslation()
  const { code, label: localLabel } = useLocale()

  const Element =
    ElementFromProps === 'label' ? (htmlFor ? 'label' : 'span') : ElementFromProps || 'span'

  if (label) {
    return (
      <Element className={`field-label${unstyled ? ' unstyled' : ''}`} htmlFor={htmlFor}>
        {getTranslation(label, i18n)}
        {required && !unstyled && <span className="required">*</span>}
        {localized && !hideLocale && (
          <span className="localized">
            &mdash; {typeof localLabel === 'string' ? localLabel : code}
          </span>
        )}
      </Element>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Group/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .group-field {
    margin-left: calc(var(--gutter-h) * -1);
    margin-right: calc(var(--gutter-h) * -1);
    border-bottom: 1px solid var(--theme-elevation-100);
    border-top: 1px solid var(--theme-elevation-100);

    &--top-level {
      padding: base(2) var(--gutter-h);

      &:first-child {
        padding-top: 0;
        border-top: 0;
      }
    }

    &--within-collapsible {
      margin-left: calc(var(--base) * -1);
      margin-right: calc(var(--base) * -1);
      padding: var(--base);

      &:first-child {
        border-top: 0;
        padding-top: 0;
        margin-top: 0;
      }

      &:last-child {
        padding-bottom: 0;
        border-bottom: 0;
      }
    }

    &--within-group {
      margin-left: 0;
      margin-right: 0;
      padding: 0;
      border-top: 0;
      border-bottom: 0;
    }

    &--within-row {
      margin: 0;
      border-top: 0;
      border-bottom: 0;
    }

    &--within-tab:first-child {
      margin-top: 0;
      border-top: 0;
      padding-top: 0;
    }

    &--within-tab:last-child {
      margin-bottom: 0;
      border-bottom: 0;
      padding-bottom: 0;
    }

    &--gutter {
      border-left: 1px solid var(--theme-elevation-100);
      padding: 0 0 0 $baseline;
    }

    &__header {
      margin-bottom: calc(var(--base) / 2);
      display: flex;
      align-items: center;
      gap: base(0.5);

      > header {
        display: flex;
        flex-direction: column;
        gap: calc(var(--base) / 4);
      }
    }

    &__title {
      margin-bottom: 0;
    }

    @include small-break {
      &--top-level {
        padding: var(--base) var(--gutter-h);

        &:first-child {
          padding-top: 0;
          border-top: 0;
        }
      }

      &__header {
        margin-bottom: calc(var(--base) / 2);
      }

      &--within-collapsible {
        margin-left: calc(var(--gutter-h) * -1);
        margin-right: calc(var(--gutter-h) * -1);
      }

      &--within-group {
        padding: 0;
      }

      &--gutter {
        padding-left: var(--gutter-h);
      }
    }
  }

  .group-field + .group-field {
    border-top: 0;
    padding-top: 0;
  }

  .group-field--within-row + .group-field--within-row {
    margin-top: 0;
  }

  .group-field--within-tab + .group-field--within-row {
    padding-top: 0;
  }

  html[data-theme='light'] {
    .group-field {
      &--has-error {
        .group-field__header {
          color: var(--theme-error-750);

          &:after {
            background: var(--theme-error-500);
          }
        }
      }
    }
  }

  html[data-theme='dark'] {
    .group-field {
      &--has-error {
        .group-field__header {
          color: var(--theme-error-500);

          &:after {
            background: var(--theme-error-500);
          }
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
