---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 391
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 391 of 695)

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
Location: payload-main/packages/ui/src/fields/Group/index.tsx
Signals: React

```typescript
'use client'

import type { GroupFieldClientComponent } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { groupHasName } from 'payload/shared'
import React, { useMemo } from 'react'

import { useCollapsible } from '../../elements/Collapsible/provider.js'
import { ErrorPill } from '../../elements/ErrorPill/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useFormSubmitted } from '../../forms/Form/context.js'
import { RenderFields } from '../../forms/RenderFields/index.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import './index.scss'
import { useRow } from '../Row/provider.js'
import { fieldBaseClass } from '../shared/index.js'
import { useTabs } from '../Tabs/provider.js'
import { GroupProvider, useGroup } from './provider.js'

const baseClass = 'group-field'

export const GroupFieldComponent: GroupFieldClientComponent = (props) => {
  const {
    field,
    field: { admin: { className, description, hideGutter } = {}, fields, label },
    indexPath,
    parentPath,
    parentSchemaPath,
    path,
    permissions,
    readOnly,
    schemaPath: schemaPathFromProps,
  } = props

  const schemaPath =
    schemaPathFromProps ?? (field.type === 'group' && groupHasName(field) ? field.name : path)

  const { i18n } = useTranslation()
  const { isWithinCollapsible } = useCollapsible()
  const isWithinGroup = useGroup()
  const isWithinRow = useRow()
  const isWithinTab = useTabs()

  const { customComponents: { AfterInput, BeforeInput, Description, Label } = {}, errorPaths } =
    useField({ path })

  const submitted = useFormSubmitted()
  const errorCount = errorPaths.length
  const fieldHasErrors = submitted && errorCount > 0

  const isTopLevel = !(isWithinCollapsible || isWithinGroup || isWithinRow)

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <div
      className={[
        fieldBaseClass,
        baseClass,
        isTopLevel && `${baseClass}--top-level`,
        isWithinCollapsible && `${baseClass}--within-collapsible`,
        isWithinGroup && `${baseClass}--within-group`,
        isWithinRow && `${baseClass}--within-row`,
        isWithinTab && `${baseClass}--within-tab`,
        !hideGutter && isWithinGroup && `${baseClass}--gutter`,
        fieldHasErrors && `${baseClass}--has-error`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      id={`field-${path?.replace(/\./g, '__')}`}
      style={styles}
    >
      <GroupProvider>
        <div className={`${baseClass}__wrap`}>
          {Boolean(Label || Description || label || fieldHasErrors) && (
            <div className={`${baseClass}__header`}>
              {Boolean(Label || Description || label) && (
                <header>
                  <RenderCustomComponent
                    CustomComponent={Label}
                    Fallback={
                      <h3 className={`${baseClass}__title`}>
                        <FieldLabel
                          as="span"
                          label={getTranslation(label, i18n)}
                          localized={false}
                          path={path}
                          required={false}
                        />
                      </h3>
                    }
                  />
                  <RenderCustomComponent
                    CustomComponent={Description}
                    Fallback={<FieldDescription description={description} path={path} />}
                  />
                </header>
              )}
              {fieldHasErrors && <ErrorPill count={errorCount} i18n={i18n} withMessage />}
            </div>
          )}
          {BeforeInput}
          {/* Render an unnamed group differently */}
          {groupHasName(field) ? (
            <RenderFields
              fields={fields}
              margins="small"
              parentIndexPath=""
              parentPath={path}
              parentSchemaPath={schemaPath}
              permissions={permissions === true ? permissions : permissions?.fields}
              readOnly={readOnly}
            />
          ) : (
            <RenderFields
              fields={fields}
              margins="small"
              parentIndexPath={indexPath}
              parentPath={parentPath}
              parentSchemaPath={parentSchemaPath}
              permissions={permissions}
              readOnly={readOnly}
            />
          )}
        </div>
      </GroupProvider>
      {AfterInput}
    </div>
  )
}

export { GroupProvider, useGroup }

export const GroupField = withCondition(GroupFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: provider.tsx]---
Location: payload-main/packages/ui/src/fields/Group/provider.tsx
Signals: React

```typescript
'use client'
import React, { createContext, use } from 'react'

export const GroupContext = createContext(false)

export const GroupProvider: React.FC<{ children?: React.ReactNode; withinGroup?: boolean }> = ({
  children,
  withinGroup = true,
}) => {
  return <GroupContext value={withinGroup}>{children}</GroupContext>
}

export const useGroup = (): boolean => use(GroupContext)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Hidden/index.tsx
Signals: React

```typescript
'use client'

import type { HiddenFieldProps } from 'payload'

import React, { useEffect } from 'react'

import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'

/**
 * Renders an input with `type="hidden"`.
 * This is mainly used to save a value on the form that is not visible to the user.
 * For example, this sets the `ìd` property of a block in the Blocks field.
 */
const HiddenFieldComponent: React.FC<HiddenFieldProps> = (props) => {
  const { disableModifyingForm = true, path: pathFromProps, value: valueFromProps } = props

  const { formInitializing, path, setValue, value } = useField({
    potentiallyStalePath: pathFromProps,
  })

  useEffect(() => {
    if (valueFromProps !== undefined && !formInitializing) {
      setValue(valueFromProps, disableModifyingForm)
    }
  }, [valueFromProps, setValue, disableModifyingForm, formInitializing])

  return (
    <input
      id={`field-${path?.replace(/\./g, '__')}`}
      name={path}
      onChange={setValue}
      type="hidden"
      value={(value as string) || ''}
    />
  )
}

export const HiddenField = withCondition(HiddenFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/Join/index.tsx
Signals: React

```typescript
'use client'

import type {
  ClientConfig,
  ClientField,
  JoinFieldClient,
  JoinFieldClientComponent,
  PaginatedDocs,
  Where,
} from 'payload'

import ObjectIdImport from 'bson-objectid'
import { fieldAffectsData, flattenTopLevelFields } from 'payload/shared'
import React, { useMemo } from 'react'

import { RelationshipTable } from '../../elements/RelationshipTable/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { FieldDescription } from '../FieldDescription/index.js'
import { FieldError } from '../FieldError/index.js'
import { FieldLabel } from '../FieldLabel/index.js'
import { fieldBaseClass } from '../index.js'

const ObjectId = 'default' in ObjectIdImport ? ObjectIdImport.default : ObjectIdImport

/**
 * Recursively builds the default data for joined collection
 */
const getInitialDrawerData = ({
  collectionSlug,
  config,
  docID,
  fields,
  segments,
}: {
  collectionSlug: string
  config: ClientConfig
  docID: number | string
  fields: ClientField[]
  segments: string[]
}) => {
  const flattenedFields = flattenTopLevelFields(fields, {
    keepPresentationalFields: true,
  })

  const path = segments[0]

  const field = flattenedFields.find((field) => field.name === path)

  if (!field) {
    return null
  }

  if (field.type === 'relationship' || field.type === 'upload') {
    let value: { relationTo: string; value: number | string } | number | string = docID
    if (Array.isArray(field.relationTo)) {
      value = {
        relationTo: collectionSlug,
        value: docID,
      }
    }
    return {
      [field.name]: field.hasMany ? [value] : value,
    }
  }

  const nextSegments = segments.slice(1, segments.length)

  if (field.type === 'tab' || (field.type === 'group' && fieldAffectsData(field))) {
    return {
      [field.name]: getInitialDrawerData({
        collectionSlug,
        config,
        docID,
        fields: field.fields,
        segments: nextSegments,
      }),
    }
  }

  if (field.type === 'array') {
    const initialData = getInitialDrawerData({
      collectionSlug,
      config,
      docID,
      fields: field.fields,
      segments: nextSegments,
    })

    initialData.id = ObjectId().toHexString()

    return {
      [field.name]: [initialData],
    }
  }

  if (field.type === 'blocks') {
    for (const _block of field.blockReferences ?? field.blocks) {
      const block = typeof _block === 'string' ? config.blocksMap[_block] : _block

      const blockInitialData = getInitialDrawerData({
        collectionSlug,
        config,
        docID,
        fields: block.fields,
        segments: nextSegments,
      })

      if (blockInitialData) {
        blockInitialData.id = ObjectId().toHexString()
        blockInitialData.blockType = block.slug

        return {
          [field.name]: [blockInitialData],
        }
      }
    }
  }
}

const JoinFieldComponent: JoinFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: { allowCreate, description },
      collection,
      label,
      localized,
      on,
      required,
    },
    path: pathFromProps,
  } = props

  const { id: docID, docConfig } = useDocumentInfo()

  const { config, getEntityConfig } = useConfig()

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    path,
    showError,
    value,
  } = useField<PaginatedDocs>({
    potentiallyStalePath: pathFromProps,
  })

  const filterOptions: null | Where = useMemo(() => {
    if (!docID) {
      return null
    }

    let value: { relationTo: string; value: number | string } | number | string = docID

    if (Array.isArray(field.targetField.relationTo)) {
      value = {
        relationTo: docConfig.slug,
        value,
      }
    }

    const where = Array.isArray(collection)
      ? {}
      : {
          [on]: {
            equals: value,
          },
        }

    if (field.where) {
      return {
        and: [where, field.where],
      }
    }

    return where
  }, [docID, collection, field.targetField.relationTo, field.where, on, docConfig?.slug])

  const initialDrawerData = useMemo(() => {
    const relatedCollection = getEntityConfig({
      collectionSlug: Array.isArray(field.collection) ? field.collection[0] : field.collection,
    })

    return getInitialDrawerData({
      collectionSlug: docConfig?.slug,
      config,
      docID,
      fields: relatedCollection?.fields,
      segments: field.on.split('.'),
    })
  }, [getEntityConfig, field.collection, field.on, docConfig?.slug, docID, config])

  if (!docConfig) {
    return null
  }

  return (
    <div
      className={[fieldBaseClass, showError && 'error', 'join'].filter(Boolean).join(' ')}
      id={`field-${path?.replace(/\./g, '__')}`}
    >
      <RenderCustomComponent
        CustomComponent={Error}
        Fallback={<FieldError path={path} showError={showError} />}
      />
      <RelationshipTable
        AfterInput={AfterInput}
        allowCreate={typeof docID !== 'undefined' && allowCreate}
        BeforeInput={BeforeInput}
        disableTable={filterOptions === null}
        field={field as JoinFieldClient}
        fieldPath={path}
        filterOptions={filterOptions}
        initialData={docID && value ? value : ({ docs: [] } as PaginatedDocs)}
        initialDrawerData={initialDrawerData}
        Label={
          <h4 style={{ margin: 0 }}>
            {Label || (
              <FieldLabel label={label} localized={localized} path={path} required={required} />
            )}
          </h4>
        }
        parent={
          Array.isArray(collection)
            ? {
                id: docID,
                collectionSlug: docConfig.slug,
                joinPath: path,
              }
            : undefined
        }
        relationTo={collection}
      />
      <RenderCustomComponent
        CustomComponent={Description}
        Fallback={<FieldDescription description={description} path={path} />}
      />
    </div>
  )
}

export const JoinField = withCondition(JoinFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/JSON/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .json-field {
    position: relative;

    &.error {
      .code-editor {
        border-color: var(--theme-error-500);
      }

      .monaco-editor-background,
      .margin {
        background-color: var(--theme-error-50);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/fields/JSON/index.tsx
Signals: React

```typescript
'use client'
import type { JSONFieldClientComponent, JsonObject } from 'payload'

import { type OnMount } from '@monaco-editor/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { defaultOptions } from '../../elements/CodeEditor/constants.js'
import { CodeEditor } from '../../elements/CodeEditor/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { FieldDescription } from '../FieldDescription/index.js'
import { FieldError } from '../FieldError/index.js'
import { FieldLabel } from '../FieldLabel/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { fieldBaseClass } from '../shared/index.js'
import './index.scss'

const baseClass = 'json-field'

const JSONFieldComponent: JSONFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: { className, description, editorOptions, maxHeight } = {},
      jsonSchema,
      label,
      localized,
      required,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const { insertSpaces = defaultOptions.insertSpaces, tabSize = defaultOptions.tabSize } =
    editorOptions || {}

  const formatJSON = useCallback(
    (value: JsonObject | undefined): string | undefined => {
      if (value === undefined) {
        return undefined
      }
      if (value === null) {
        return ''
      }
      return insertSpaces ? JSON.stringify(value, null, tabSize) : JSON.stringify(value, null, '\t')
    },
    [tabSize, insertSpaces],
  )

  const [jsonError, setJsonError] = useState<string>()
  const inputChangeFromRef = React.useRef<'formState' | 'internalEditor'>('formState')
  const [recalculatedHeightAt, setRecalculatedHeightAt] = useState<number | undefined>(Date.now())

  const memoizedValidate = useCallback(
    (value, options) => {
      if (typeof validate === 'function') {
        return validate(value, { ...options, jsonError, required })
      }
    },
    [validate, required, jsonError],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    initialValue,
    path,
    setValue,
    showError,
    value,
  } = useField<JsonObject>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const stringValueRef = React.useRef<string>(formatJSON(value ?? initialValue))

  const handleMount = useCallback<OnMount>(
    (editor, monaco) => {
      if (!jsonSchema) {
        return
      }

      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        enableSchemaRequest: true,
        schemas: [
          ...(monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas || []),
          jsonSchema,
        ],
        validate: true,
      })

      const uri = jsonSchema.uri
      const newUri = uri.includes('?')
        ? `${uri}&${crypto.randomUUID ? crypto.randomUUID() : uuidv4()}`
        : `${uri}?${crypto.randomUUID ? crypto.randomUUID() : uuidv4()}`

      editor.setModel(
        monaco.editor.createModel(formatJSON(value) || '', 'json', monaco.Uri.parse(newUri)),
      )
    },
    [jsonSchema, formatJSON, value],
  )

  const handleChange = useCallback(
    (val: string) => {
      if (readOnly || disabled) {
        return
      }
      inputChangeFromRef.current = 'internalEditor'

      try {
        setValue(val ? JSON.parse(val) : null)
        stringValueRef.current = val
        setJsonError(undefined)
      } catch (e) {
        setValue(val ? val : null)
        stringValueRef.current = val
        setJsonError(e)
      }
    },
    [readOnly, disabled, setValue],
  )

  useEffect(() => {
    if (inputChangeFromRef.current === 'formState') {
      const newStringValue = formatJSON(value ?? initialValue)
      if (newStringValue !== stringValueRef.current) {
        stringValueRef.current = newStringValue
        setRecalculatedHeightAt(Date.now())
      }
    }

    inputChangeFromRef.current = 'formState'
  }, [initialValue, path, formatJSON, value])

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
          Fallback={<FieldError message={jsonError} path={path} showError={showError} />}
        />
        {BeforeInput}
        <CodeEditor
          defaultLanguage="json"
          maxHeight={maxHeight}
          onChange={handleChange}
          onMount={handleMount}
          options={editorOptions}
          readOnly={readOnly || disabled}
          recalculatedHeightAt={recalculatedHeightAt}
          value={stringValueRef.current}
          wrapperProps={{
            id: `field-${path?.replace(/\./g, '__')}`,
          }}
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

export const JSONField = withCondition(JSONFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Number/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .field-type.number {
    position: relative;

    &:not(.has-many) {
      input {
        @include formInput;
      }
    }
  }

  html[data-theme='light'] {
    .field-type.number {
      &.error {
        input {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .field-type.number {
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
Location: payload-main/packages/ui/src/fields/Number/index.tsx
Signals: React

```typescript
'use client'
import type { NumberFieldClientComponent, NumberFieldClientProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { isNumber } from 'payload/shared'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import type { Option } from '../../elements/ReactSelect/types.js'

import { ReactSelect } from '../../elements/ReactSelect/index.js'
import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { FieldDescription } from '../FieldDescription/index.js'
import { FieldError } from '../FieldError/index.js'
import { FieldLabel } from '../FieldLabel/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import './index.scss'
import { fieldBaseClass } from '../shared/index.js'

const NumberFieldComponent: NumberFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: {
        className,
        description,
        placeholder: placeholderFromProps,
        step = 1,
      } = {} as NumberFieldClientProps['field']['admin'],
      hasMany = false,
      label,
      localized,
      max = Infinity,
      maxRows = Infinity,
      min = -Infinity,
      required,
    },
    onChange: onChangeFromProps,
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const { i18n, t } = useTranslation()

  const memoizedValidate = useCallback(
    (value, options) => {
      if (typeof validate === 'function') {
        return validate(value, { ...options, max, min, required })
      }
    },
    [validate, min, max, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    setValue,
    showError,
    value,
  } = useField<number | number[]>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const handleChange = useCallback(
    (e) => {
      const val = parseFloat(e.target.value)
      let newVal = val

      if (Number.isNaN(val)) {
        newVal = null
      }

      if (typeof onChangeFromProps === 'function') {
        onChangeFromProps(newVal)
      }

      setValue(newVal)
    },
    [onChangeFromProps, setValue],
  )

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
          newValue = selectedOption.map((option) => Number(option.value?.value || option.value))
        } else {
          newValue = [Number(selectedOption.value?.value || selectedOption.value)]
        }

        setValue(newValue)
      }
    },
    [readOnly, disabled, setValue],
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
              toString: () => `${val}${index}`,
              value: (val as unknown as Record<string, number>)?.value || val,
            }, // You're probably wondering, why the hell is this done that way? Well, React-select automatically uses "label-value" as a key, so we will get that react duplicate key warning if we just pass in the value as multiple values can be the same. So we need to append the index to the toString() of the value to avoid that warning, as it uses that as the key.
          }
        }),
      )
    }
  }, [value, hasMany])

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  const placeholder = getTranslation(placeholderFromProps, i18n)

  return (
    <div
      className={[
        fieldBaseClass,
        'number',
        className,
        showError && 'error',
        (readOnly || disabled) && 'read-only',
        hasMany && 'has-many',
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
        {hasMany ? (
          <ReactSelect
            className={`field-${path.replace(/\./g, '__')}`}
            disabled={readOnly || disabled}
            filterOption={(_, rawInput) => {
              const isOverHasMany = Array.isArray(value) && value.length >= maxRows
              return isNumber(rawInput) && !isOverHasMany
            }}
            isClearable
            isCreatable
            isMulti
            isSortable
            noOptionsMessage={() => {
              const isOverHasMany = Array.isArray(value) && value.length >= maxRows
              if (isOverHasMany) {
                return t('validation:limitReached', { max: maxRows, value: value.length + 1 })
              }
              return null
            }}
            // numberOnly
            onChange={handleHasManyChange}
            options={[]}
            placeholder={placeholder}
            showError={showError}
            value={valueToRender as Option[]}
          />
        ) : (
          <div>
            <input
              disabled={readOnly || disabled}
              id={`field-${path.replace(/\./g, '__')}`}
              max={max}
              min={min}
              name={path}
              onChange={handleChange}
              onWheel={(e) => {
                // @ts-expect-error
                e.target.blur()
              }}
              placeholder={placeholder}
              step={step}
              type="number"
              value={typeof value === 'number' ? value : ''}
            />
          </div>
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

export const NumberField = withCondition(NumberFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Password/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .field-type.password {
    position: relative;

    input {
      @include formInput;
    }
  }

  html[data-theme='light'] {
    .field-type.password {
      &.error {
        input {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .field-type.password {
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
Location: payload-main/packages/ui/src/fields/Password/index.tsx
Signals: React

```typescript
'use client'
import type { PasswordFieldValidation, PayloadRequest } from 'payload'

import { password } from 'payload/shared'
import React, { useCallback, useMemo } from 'react'

import type { PasswordFieldProps } from './types.js'

import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import './index.scss'
import { isFieldRTL } from '../shared/index.js'
import { PasswordInput } from './input.js'

const PasswordFieldComponent: React.FC<PasswordFieldProps> = (props) => {
  const {
    autoComplete,
    field,
    field: {
      admin: {
        className,
        disabled: disabledFromProps,
        placeholder,
        rtl,
      } = {} as PasswordFieldProps['field']['admin'],
      label,
      localized,
      required,
    } = {} as PasswordFieldProps['field'],
    inputRef,
    path,
    validate,
  } = props

  const { t } = useTranslation()
  const locale = useLocale()
  const { config } = useConfig()

  const memoizedValidate: PasswordFieldValidation = useCallback(
    (value, options) => {
      const pathSegments = path ? path.split('.') : []

      if (typeof validate === 'function') {
        return validate(value, { ...options, required })
      }

      return password(value, {
        name: 'password',
        type: 'text',
        blockData: {},
        data: {},
        event: 'onChange',
        path: pathSegments,
        preferences: { fields: {} },
        req: {
          payload: {
            config,
          },
          t,
        } as unknown as PayloadRequest,
        required: true,
        siblingData: {},
      })
    },
    [validate, config, t, required, path],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    setValue,
    showError,
    value,
  } = useField({
    path,
    validate: memoizedValidate,
  })

  const renderRTL = isFieldRTL({
    fieldLocalized: false,
    fieldRTL: rtl,
    locale,
    localizationConfig: config.localization || undefined,
  })

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <PasswordInput
      AfterInput={AfterInput}
      autoComplete={autoComplete}
      BeforeInput={BeforeInput}
      className={className}
      Description={Description}
      Error={Error}
      inputRef={inputRef}
      Label={Label}
      label={label}
      localized={localized}
      onChange={(e) => {
        setValue(e.target.value)
      }}
      path={path}
      placeholder={placeholder}
      readOnly={disabled || disabledFromProps}
      required={required}
      rtl={renderRTL}
      showError={showError}
      style={styles}
      value={(value as string) || ''}
    />
  )
}

export const PasswordField = withCondition(PasswordFieldComponent)
```

--------------------------------------------------------------------------------

---[FILE: input.tsx]---
Location: payload-main/packages/ui/src/fields/Password/input.tsx
Signals: React

```typescript
'use client'
import type { ChangeEvent } from 'react'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { PasswordInputProps } from './types.js'

import { RenderCustomComponent } from '../../elements/RenderCustomComponent/index.js'
import { FieldDescription } from '../../fields/FieldDescription/index.js'
import { FieldError } from '../../fields/FieldError/index.js'
import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { fieldBaseClass } from '../shared/index.js'
import './index.scss'

export const PasswordInput: React.FC<PasswordInputProps> = (props) => {
  const {
    AfterInput,
    autoComplete = 'off',
    BeforeInput,
    className,
    description,
    Description,
    Error,
    inputRef,
    Label,
    label,
    localized,
    onChange,
    onKeyDown,
    path,
    placeholder,
    readOnly,
    required,
    rtl,
    showError,
    style,
    value,
    width,
  } = props

  const { i18n } = useTranslation()

  return (
    <div
      className={[
        fieldBaseClass,
        'password',
        className,
        showError && 'error',
        readOnly && 'read-only',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...style,
        width,
      }}
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
        <div>
          {BeforeInput}
          <input
            aria-label={getTranslation(label, i18n)}
            autoComplete={autoComplete}
            data-rtl={rtl}
            disabled={readOnly}
            id={`field-${path.replace(/\./g, '__')}`}
            name={path}
            onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
            onKeyDown={onKeyDown}
            placeholder={getTranslation(placeholder, i18n)}
            ref={inputRef}
            type="password"
            value={value || ''}
          />
          {AfterInput}
        </div>
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
Location: payload-main/packages/ui/src/fields/Password/types.ts
Signals: React

```typescript
import type {
  FieldBaseClient,
  PasswordFieldValidation,
  StaticDescription,
  TextFieldClient,
} from 'payload'
import type { ChangeEvent, CSSProperties } from 'react'
import type React from 'react'
import type { MarkOptional } from 'ts-essentials'

export type PasswordFieldProps = {
  readonly autoComplete?: string
  readonly field: MarkOptional<TextFieldClient, 'type'>
  /**
   * @default ''
   */
  readonly indexPath?: string
  readonly inputRef?: React.RefObject<HTMLInputElement>
  /**
   * @default ''
   */
  readonly parentPath?: string
  /**
   * @default ''
   */
  readonly parentSchemaPath?: string
  /**
   * @default field.name
   */
  readonly path: string
  /**
   * @default field.name
   */
  readonly schemaPath?: string
  readonly validate?: PasswordFieldValidation
}

export type PasswordInputProps = {
  readonly AfterInput?: React.ReactNode
  readonly autoComplete?: string
  readonly BeforeInput?: React.ReactNode
  readonly className?: string
  readonly description?: StaticDescription
  readonly Description?: React.ReactNode
  readonly Error?: React.ReactNode
  readonly field?: MarkOptional<TextFieldClient, 'type'>
  readonly inputRef?: React.RefObject<HTMLInputElement>
  readonly Label?: React.ReactNode
  readonly label: FieldBaseClient['label']
  readonly localized?: boolean
  readonly onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  readonly onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  readonly path: string
  readonly placeholder?: Record<string, string> | string
  readonly readOnly?: boolean
  readonly required?: boolean
  readonly rtl?: boolean
  readonly showError?: boolean
  readonly style?: React.CSSProperties
  readonly value?: string
  readonly width?: CSSProperties['width']
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/fields/Point/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .point {
    position: relative;

    & .input-wrapper {
      position: relative;
    }

    &__wrap {
      display: flex;
      width: calc(100% + #{base(1)});
      margin: 0;
      margin-left: base(-0.5);
      margin-right: base(-0.5);
      list-style: none;
      padding: 0;

      li {
        padding: 0 base(0.5);
        width: 50%;
      }
    }

    input {
      @include formInput;
    }
  }

  html[data-theme='light'] {
    .point {
      &.error {
        input {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .point {
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

````
