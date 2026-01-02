---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 386
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 386 of 695)

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
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/index.tsx
Signals: React

```typescript
'use client'
import React, { useCallback, useEffect, useState } from 'react'

import type {
  AddCondition,
  ReducedField,
  RemoveCondition,
  UpdateCondition,
  Value,
} from '../types.js'

export type Props = {
  readonly addCondition: AddCondition
  readonly andIndex: number
  readonly fieldPath: string
  readonly filterOptions: ResolvedFilterOptions
  readonly operator: Operator
  readonly orIndex: number
  readonly reducedFields: ReducedField[]
  readonly removeCondition: RemoveCondition
  readonly RenderedFilter: React.ReactNode
  readonly updateCondition: UpdateCondition
  readonly value: Value
}

import type { Operator, Option as PayloadOption, ResolvedFilterOptions } from 'payload'

import type { Option } from '../../ReactSelect/index.js'

import { useDebounce } from '../../../hooks/useDebounce.js'
import { useEffectEvent } from '../../../hooks/useEffectEvent.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Button } from '../../Button/index.js'
import { ReactSelect } from '../../ReactSelect/index.js'
import { DefaultFilter } from './DefaultFilter/index.js'
import { getOperatorValueTypes } from './validOperators.js'
import './index.scss'

const baseClass = 'condition'

export const Condition: React.FC<Props> = (props) => {
  const {
    addCondition,
    andIndex,
    fieldPath,
    filterOptions,
    operator,
    orIndex,
    reducedFields,
    removeCondition,
    RenderedFilter,
    updateCondition,
    value,
  } = props

  const { t } = useTranslation()

  const reducedField = reducedFields.find((field) => field.value === fieldPath)

  const [internalValue, setInternalValue] = useState<Value>(value)

  const debouncedValue = useDebounce(internalValue, 300)

  const booleanSelect = ['exists'].includes(operator) || reducedField?.field?.type === 'checkbox'

  let valueOptions: PayloadOption[] = []

  if (booleanSelect) {
    valueOptions = [
      { label: t('general:true'), value: 'true' },
      { label: t('general:false'), value: 'false' },
    ]
  } else if (reducedField?.field && 'options' in reducedField.field) {
    valueOptions = reducedField.field.options
  }

  const updateValue = useEffectEvent(async (debouncedValue: Value) => {
    if (operator) {
      await updateCondition({
        type: 'value',
        andIndex,
        field: reducedField,
        operator,
        orIndex,
        value: debouncedValue === null || debouncedValue === '' ? undefined : debouncedValue,
      })
    }
  })

  useEffect(() => {
    void updateValue(debouncedValue)
  }, [debouncedValue])

  const disabled =
    (!reducedField?.value && typeof reducedField?.value !== 'number') ||
    reducedField?.field?.admin?.disableListFilter

  const handleFieldChange = useCallback(
    async (field: Option<string>) => {
      setInternalValue(undefined)
      await updateCondition({
        type: 'field',
        andIndex,
        field: reducedFields.find((option) => option.value === field.value),
        operator,
        orIndex,
        value: undefined,
      })
    },
    [andIndex, operator, orIndex, reducedFields, updateCondition],
  )

  const handleOperatorChange = useCallback(
    async (operator: Option<Operator>) => {
      const operatorValueTypes = getOperatorValueTypes(reducedField.field.type)
      const validOperatorValue = operatorValueTypes[operator.value] || 'any'
      const isValidValue =
        validOperatorValue === 'any' ||
        typeof value === validOperatorValue ||
        (validOperatorValue === 'boolean' && (value === 'true' || value === 'false'))

      if (!isValidValue) {
        // if the current value is not valid for the new operator
        // reset the value before passing it to updateCondition
        setInternalValue(undefined)
      }

      await updateCondition({
        type: 'operator',
        andIndex,
        field: reducedField,
        operator: operator.value,
        orIndex,
        value: isValidValue ? value : undefined,
      })
    },
    [andIndex, reducedField, orIndex, updateCondition, value],
  )

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__wrap`}>
        <div className={`${baseClass}__inputs`}>
          <div className={`${baseClass}__field`}>
            <ReactSelect
              disabled={disabled}
              filterOption={(option, inputValue) =>
                ((option?.data?.plainTextLabel as string) || option.label)
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              }
              isClearable={false}
              onChange={handleFieldChange}
              options={reducedFields.filter((field) => !field.field.admin.disableListFilter)}
              value={
                reducedField || {
                  value: reducedField?.value,
                }
              }
            />
          </div>
          <div className={`${baseClass}__operator`}>
            <ReactSelect
              disabled={disabled}
              isClearable={false}
              onChange={handleOperatorChange}
              options={reducedField?.operators}
              value={reducedField?.operators.find((o) => operator === o.value) || null}
            />
          </div>
          <div className={`${baseClass}__value`}>
            {RenderedFilter || (
              <DefaultFilter
                booleanSelect={booleanSelect}
                disabled={
                  !operator || !reducedField || reducedField?.field?.admin?.disableListFilter
                }
                filterOptions={filterOptions}
                internalField={reducedField}
                onChange={setInternalValue}
                operator={operator}
                options={valueOptions}
                value={internalValue ?? ''}
              />
            )}
          </div>
        </div>
        <div className={`${baseClass}__actions`}>
          <Button
            buttonStyle="icon-label"
            className={`${baseClass}__actions-remove`}
            icon="x"
            iconStyle="with-border"
            onClick={() =>
              removeCondition({
                andIndex,
                orIndex,
              })
            }
            round
          />
          <Button
            buttonStyle="icon-label"
            className={`${baseClass}__actions-add`}
            icon="plus"
            iconStyle="with-border"
            onClick={() =>
              addCondition({
                andIndex: andIndex + 1,
                field: reducedFields.find((field) => !field.field.admin?.disableListFilter),
                orIndex,
                relation: 'and',
              })
            }
            round
          />
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/types.ts

```typescript
import type { Operator, Where } from 'payload'

import type { Action, ReducedField } from '../types.js'

export type Props = {
  andIndex: number
  dispatch: (action: Action) => void
  fields: ReducedField[]
  orIndex: number
  value: Where
}

export type DefaultFilterProps = {
  readonly disabled: boolean
  readonly onChange: (val: any) => void
  readonly operator: Operator
  readonly value: unknown
}
```

--------------------------------------------------------------------------------

---[FILE: validOperators.ts]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/validOperators.ts

```typescript
export const getOperatorValueTypes = (fieldType) => {
  return {
    all: 'any',
    contains: 'string',
    equals: 'any',
    /*
     * exists:
     * The expected value is boolean, but it's passed as a string ('true' or 'false').
     * Need to additionally check if the value is strictly 'true' or 'false' as a string,
     * rather than using a direct typeof comparison.
     * This is handled as:
     * validOperatorValue === 'boolean' && (value === 'true' || value === 'false')
     */
    exists: 'boolean',
    /*
     * greater_than, greater_than_equal, less_than, less_than_equal:
     * Used for number and date fields:
     * - For date fields, the value is an object (e.g., Mon Feb 17 2025 12:00:00 GMT+0000).
     * - For number fields, the value is a string representing the number.
     */
    greater_than: fieldType === 'date' ? 'object' : 'string',
    greater_than_equal: fieldType === 'date' ? 'object' : 'string',
    in: 'any',
    intersects: 'any',
    less_than: fieldType === 'date' ? 'object' : 'string',
    less_than_equal: fieldType === 'date' ? 'object' : 'string',
    like: 'string',
    near: 'any',
    not_equals: 'any',
    not_in: 'any',
    not_like: 'string',
    within: 'any',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Date/index.tsx
Signals: React

```typescript
'use client'
import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { DateFilterProps as Props } from './types.js'

import { useTranslation } from '../../../../providers/Translation/index.js'
import { DatePickerField } from '../../../DatePicker/index.js'

const baseClass = 'condition-value-date'

export const DateFilter: React.FC<Props> = ({ disabled, field: { admin }, onChange, value }) => {
  const { date } = admin || {}
  const { i18n, t } = useTranslation()

  return (
    <div className={baseClass}>
      <DatePickerField
        {...date}
        onChange={onChange}
        placeholder={getTranslation(admin.placeholder, i18n) || t('general:enterAValue')}
        readOnly={disabled}
        value={value as Date}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Date/types.ts

```typescript
import type { DateFieldClient } from 'payload'

import type { DefaultFilterProps } from '../types.js'

export type DateFilterProps = {
  readonly field: DateFieldClient
  readonly value: Date | string
} & DefaultFilterProps
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/DefaultFilter/index.tsx
Signals: React

```typescript
import type {
  Operator,
  Option,
  ResolvedFilterOptions,
  SelectFieldClient,
  TextFieldClient,
} from 'payload'

import React from 'react'

import type { ReducedField, Value } from '../../types.js'

import { DateFilter } from '../Date/index.js'
import { NumberFilter } from '../Number/index.js'
import { RelationshipFilter } from '../Relationship/index.js'
import { Select } from '../Select/index.js'
import { Text } from '../Text/index.js'

type Props = {
  booleanSelect: boolean
  disabled: boolean
  filterOptions: ResolvedFilterOptions
  internalField: ReducedField
  onChange: React.Dispatch<React.SetStateAction<string>>
  operator: Operator
  options: Option[]
  value: Value
}

export const DefaultFilter: React.FC<Props> = ({
  booleanSelect,
  disabled,
  filterOptions,
  internalField,
  onChange,
  operator,
  options,
  value,
}) => {
  if (booleanSelect || ['radio', 'select'].includes(internalField?.field?.type)) {
    return (
      <Select
        disabled={disabled}
        field={internalField.field as SelectFieldClient}
        isClearable={!booleanSelect}
        onChange={onChange}
        operator={operator}
        options={options}
        value={value as string}
      />
    )
  }

  switch (internalField?.field?.type) {
    case 'date': {
      return (
        <DateFilter
          disabled={disabled}
          field={internalField.field}
          onChange={onChange}
          operator={operator}
          value={value as Date | string}
        />
      )
    }

    case 'number': {
      return (
        <NumberFilter
          disabled={disabled}
          field={internalField.field}
          onChange={onChange}
          operator={operator}
          value={value as number | number[]}
        />
      )
    }

    case 'relationship': {
      return (
        <RelationshipFilter
          disabled={disabled}
          field={internalField.field}
          filterOptions={filterOptions}
          onChange={onChange}
          operator={operator}
          value={value}
        />
      )
    }

    case 'upload': {
      return (
        <RelationshipFilter
          disabled={disabled}
          field={internalField.field}
          filterOptions={filterOptions}
          onChange={onChange}
          operator={operator}
          value={value}
        />
      )
    }

    default: {
      return (
        <Text
          disabled={disabled}
          field={internalField?.field as TextFieldClient}
          onChange={onChange}
          operator={operator}
          value={value as string | string[]}
        />
      )
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Number/index.scss

```text
@import '../../../../scss/styles.scss';

@layer payload-default {
  .condition-value-number {
    @include formInput;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Number/index.tsx
Signals: React

```typescript
'use client'
import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { NumberFilterProps as Props } from './types.js'

import { useTranslation } from '../../../../providers/Translation/index.js'
import { ReactSelect } from '../../../ReactSelect/index.js'
import './index.scss'

const baseClass = 'condition-value-number'

export const NumberFilter: React.FC<Props> = (props) => {
  const {
    disabled,
    field: { admin, hasMany },
    onChange,
    operator,
    value,
  } = props

  const { i18n, t } = useTranslation()

  const isMulti = ['in', 'not_in'].includes(operator) || hasMany

  const [valueToRender, setValueToRender] = React.useState<
    { id: string; label: string; value: { value: number } }[]
  >([])

  const onSelect = React.useCallback(
    (selectedOption) => {
      let newValue
      if (!selectedOption) {
        newValue = []
      } else if (isMulti) {
        if (Array.isArray(selectedOption)) {
          newValue = selectedOption.map((option) => Number(option.value?.value || option.value))
        } else {
          newValue = [Number(selectedOption.value?.value || selectedOption.value)]
        }
      }

      onChange(newValue)
    },
    [isMulti, onChange],
  )

  React.useEffect(() => {
    if (Array.isArray(value)) {
      setValueToRender(
        value.map((val, index) => {
          return {
            id: `${val}${index}`, // append index to avoid duplicate keys but allow duplicate numbers
            label: `${val}`,
            value: {
              toString: () => `${val}${index}`,
              value: (val as any)?.value || val,
            },
          }
        }),
      )
    } else {
      setValueToRender([])
    }
  }, [value])

  const placeholder = getTranslation(admin?.placeholder, i18n) || t('general:enterAValue')

  return isMulti ? (
    <ReactSelect
      disabled={disabled}
      isClearable
      isCreatable
      isMulti={isMulti}
      isSortable
      numberOnly
      onChange={onSelect}
      options={[]}
      placeholder={placeholder}
      value={valueToRender || []}
    />
  ) : (
    <input
      className={baseClass}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type="number"
      value={value as number}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Number/types.ts

```typescript
import type { NumberFieldClient } from 'payload'

import type { DefaultFilterProps } from '../types.js'

export type NumberFilterProps = {
  readonly field: NumberFieldClient
  readonly onChange: (e: string) => void
  readonly value: number | number[]
} & DefaultFilterProps
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Relationship/index.scss

```text
@import '../../../../scss/styles.scss';

@layer payload-default {
  .condition-value-relationship {
    &__error-loading {
      border: 1px solid var(--theme-error-600);
      min-height: base(2);
      padding: base(0.5) base(0.75);
      background-color: var(--theme-error-100);
      color: var(--theme-elevation-0);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Relationship/index.tsx
Signals: React

```typescript
'use client'
import type { PaginatedDocs, Where } from 'payload'

import * as qs from 'qs-esm'
import React, { useCallback, useEffect, useReducer, useState } from 'react'

import type { Option } from '../../../ReactSelect/types.js'
import type { RelationshipFilterProps as Props, ValueWithRelation } from './types.js'

import { useDebounce } from '../../../../hooks/useDebounce.js'
import { useEffectEvent } from '../../../../hooks/useEffectEvent.js'
import { useConfig } from '../../../../providers/Config/index.js'
import { useLocale } from '../../../../providers/Locale/index.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import { ReactSelect } from '../../../ReactSelect/index.js'
import optionsReducer from './optionsReducer.js'
import './index.scss'

const baseClass = 'condition-value-relationship'

const maxResultsPerRequest = 10

export const RelationshipFilter: React.FC<Props> = (props) => {
  const {
    disabled,
    field: { admin = {}, hasMany, relationTo },
    filterOptions,
    onChange,
    value,
  } = props

  const placeholder = 'placeholder' in admin ? admin?.placeholder : undefined
  const isSortable = admin?.isSortable

  const {
    config: {
      routes: { api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const hasMultipleRelations = Array.isArray(relationTo)
  const [options, dispatchOptions] = useReducer(optionsReducer, [])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [errorLoading, setErrorLoading] = useState('')
  const [hasLoadedFirstOptions, setHasLoadedFirstOptions] = useState(false)
  const { i18n, t } = useTranslation()
  const locale = useLocale()

  const relationSlugs = hasMultipleRelations ? relationTo : [relationTo]

  const loadedRelationships = React.useRef<
    Map<
      string,
      {
        hasLoadedAll: boolean
        nextPage: number
      }
    >
  >(
    new Map(
      relationSlugs.map((relation) => [
        relation,
        {
          hasLoadedAll: false,
          nextPage: 1,
        },
      ]),
    ),
  )

  const addOptions = useCallback(
    (data, relation) => {
      const collection = getEntityConfig({ collectionSlug: relation })
      dispatchOptions({ type: 'ADD', collection, data, hasMultipleRelations, i18n, relation })
    },
    [hasMultipleRelations, i18n, getEntityConfig],
  )

  const loadOptions = useEffectEvent(
    async ({
      abortController,
      relationSlug,
    }: {
      abortController: AbortController
      relationSlug: string
    }) => {
      const loadedRelationship = loadedRelationships.current.get(relationSlug)

      if (relationSlug && !loadedRelationship.hasLoadedAll) {
        const collection = getEntityConfig({
          collectionSlug: relationSlug,
        })

        const fieldToSearch = collection?.admin?.useAsTitle || 'id'

        const where: Where = {
          and: [],
        }

        const query = {
          depth: 0,
          limit: maxResultsPerRequest,
          locale: locale.code,
          page: loadedRelationship.nextPage,
          select: {
            [fieldToSearch]: true,
          },
          where,
        }

        if (filterOptions && filterOptions?.[relationSlug]) {
          query.where.and.push(filterOptions[relationSlug])
        }

        if (debouncedSearch) {
          query.where.and.push({
            [fieldToSearch]: {
              like: debouncedSearch,
            },
          })
        }

        try {
          const response = await fetch(
            `${serverURL}${api}/${relationSlug}${qs.stringify(query, { addQueryPrefix: true })}`,
            {
              credentials: 'include',
              headers: {
                'Accept-Language': i18n.language,
              },
              signal: abortController.signal,
            },
          )

          if (response.ok) {
            const data: PaginatedDocs = await response.json()
            if (data.docs.length > 0) {
              addOptions(data, relationSlug)

              if (data.nextPage) {
                loadedRelationships.current.set(relationSlug, {
                  hasLoadedAll: false,
                  nextPage: data.nextPage,
                })
              } else {
                loadedRelationships.current.set(relationSlug, {
                  hasLoadedAll: true,
                  nextPage: null,
                })
              }
            }
          } else {
            setErrorLoading(t('error:unspecific'))
          }
        } catch (e) {
          if (!abortController.signal.aborted) {
            console.error(e) // eslint-disable-line no-console
          }
        }
      }

      setHasLoadedFirstOptions(true)
    },
  )

  const handleScrollToBottom = React.useCallback(() => {
    const relationshipToLoad = loadedRelationships.current.entries().next().value

    if (relationshipToLoad[0] && !relationshipToLoad[1].hasLoadedAll) {
      const abortController = new AbortController()

      void loadOptions({
        abortController,
        relationSlug: relationshipToLoad[0],
      })
    }
  }, [])

  const findOptionsByValue = useCallback((): Option | Option[] => {
    if (value) {
      if (hasMany) {
        if (Array.isArray(value)) {
          return value.map((val) => {
            if (hasMultipleRelations) {
              let matchedOption: Option

              options.forEach((opt) => {
                if (opt.options) {
                  opt.options.some((subOpt) => {
                    if (subOpt?.value == val.value) {
                      matchedOption = subOpt
                      return true
                    }

                    return false
                  })
                }
              })

              return matchedOption
            }

            return options.find((opt) => opt.value == val)
          })
        }

        return undefined
      }

      if (hasMultipleRelations) {
        let matchedOption: Option

        const valueWithRelation = value as ValueWithRelation

        options.forEach((opt) => {
          if (opt?.options) {
            opt.options.some((subOpt) => {
              if (subOpt?.value == valueWithRelation.value) {
                matchedOption = subOpt
                return true
              }
              return false
            })
          }
        })

        return matchedOption
      }

      return options.find((opt) => opt.value == value)
    }

    return undefined
  }, [hasMany, hasMultipleRelations, value, options])

  const handleInputChange = useCallback(
    (input: string) => {
      if (input !== search) {
        dispatchOptions({ type: 'CLEAR', i18n, required: false })

        const relationSlugs = Array.isArray(relationTo) ? relationTo : [relationTo]

        loadedRelationships.current = new Map(
          relationSlugs.map((relation) => [
            relation,
            {
              hasLoadedAll: false,
              nextPage: 1,
            },
          ]),
        )

        setSearch(input)
      }
    },
    [i18n, relationTo, search],
  )

  const addOptionByID = useCallback(
    async (id, relation) => {
      if (!errorLoading && id !== 'null' && id && relation) {
        const response = await fetch(`${serverURL}${api}/${relation}/${id}?depth=0`, {
          credentials: 'include',
          headers: {
            'Accept-Language': i18n.language,
          },
        })

        if (response.ok) {
          const data = await response.json()
          addOptions({ docs: [data] }, relation)
        } else {
          // eslint-disable-next-line no-console
          console.error(t('error:loadingDocument', { id }))
        }
      }
    },
    [i18n, addOptions, api, errorLoading, serverURL, t],
  )

  /**
   * When `relationTo` changes externally, reset the options and reload them from scratch
   * The `loadOptions` dependency is a useEffectEvent which has no dependencies of its own
   * This means we can safely depend on it without it triggering this effect to run
   * This is useful because this effect should _only_ run when `relationTo` changes
   */
  useEffect(() => {
    const relations = Array.isArray(relationTo) ? relationTo : [relationTo]

    loadedRelationships.current = new Map(
      relations.map((relation) => [
        relation,
        {
          hasLoadedAll: false,
          nextPage: 1,
        },
      ]),
    )

    dispatchOptions({ type: 'CLEAR', i18n, required: false })
    setHasLoadedFirstOptions(false)

    const abortControllers: AbortController[] = []

    relations.forEach((relation) => {
      const abortController = new AbortController()

      void loadOptions({
        abortController,
        relationSlug: relation,
      })

      abortControllers.push(abortController)
    })

    return () => {
      abortControllers.forEach((controller) => {
        if (controller.signal) {
          try {
            controller.abort()
          } catch (_err) {
            // swallow error
          }
        }
      })
    }
  }, [i18n, relationTo, debouncedSearch, filterOptions])

  /**
   * Load any other options that might exist in the value that were not loaded already
   */
  useEffect(() => {
    if (value && hasLoadedFirstOptions) {
      if (hasMany) {
        const matchedOptions = findOptionsByValue()

        ;((matchedOptions as Option[]) || []).forEach((option, i) => {
          if (!option) {
            if (hasMultipleRelations) {
              void addOptionByID(value[i].value, value[i].relationTo)
            } else {
              void addOptionByID(value[i], relationTo)
            }
          }
        })
      } else {
        const matchedOption = findOptionsByValue()

        if (!matchedOption) {
          if (hasMultipleRelations) {
            const valueWithRelation = value as ValueWithRelation
            void addOptionByID(valueWithRelation.value, valueWithRelation.relationTo)
          } else {
            void addOptionByID(value, relationTo)
          }
        }
      }
    }
  }, [
    addOptionByID,
    findOptionsByValue,
    hasMany,
    hasMultipleRelations,
    relationTo,
    value,
    hasLoadedFirstOptions,
  ])

  const classes = ['field-type', baseClass, errorLoading && 'error-loading']
    .filter(Boolean)
    .join(' ')

  const valueToRender = (findOptionsByValue() || value) as Option

  return (
    <div className={classes}>
      {errorLoading ? (
        <div className={`${baseClass}__error-loading`}>{errorLoading}</div>
      ) : (
        <ReactSelect
          disabled={disabled}
          isMulti={hasMany}
          isSortable={isSortable}
          onChange={(selected) => {
            if (!selected) {
              onChange(null)
              return
            }

            if (hasMany && Array.isArray(selected)) {
              onChange(
                selected
                  ? selected.map((option) => {
                      if (hasMultipleRelations) {
                        return {
                          relationTo: option?.relationTo,
                          value: option?.value,
                        }
                      }

                      return option?.value
                    })
                  : null,
              )
            } else if (hasMultipleRelations && !Array.isArray(selected)) {
              onChange({
                relationTo: selected?.relationTo,
                value: selected?.value,
              })
            } else if (!Array.isArray(selected)) {
              onChange(selected?.value)
            }
          }}
          onInputChange={handleInputChange}
          onMenuScrollToBottom={handleScrollToBottom}
          options={options}
          placeholder={placeholder}
          value={valueToRender}
        />
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: optionsReducer.ts]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Relationship/optionsReducer.ts

```typescript
'use client'
import { getTranslation } from '@payloadcms/translations'

import type { Action, Option } from './types.js'

const reduceToIDs = (options) =>
  options.reduce((ids, option) => {
    if (option.options) {
      return [...ids, ...reduceToIDs(option.options)]
    }

    return [...ids, option.id]
  }, [])

const optionsReducer = (state: Option[], action: Action): Option[] => {
  switch (action.type) {
    case 'ADD': {
      const { collection, data, hasMultipleRelations, i18n, relation } = action

      const labelKey = collection.admin.useAsTitle || 'id'

      const loadedIDs = reduceToIDs(state)

      if (!hasMultipleRelations) {
        return [
          ...state,
          ...data.docs.reduce((docs, doc) => {
            if (loadedIDs.indexOf(doc.id) === -1) {
              loadedIDs.push(doc.id)
              return [
                ...docs,
                {
                  label: doc[labelKey],
                  value: doc.id,
                },
              ]
            }
            return docs
          }, []),
        ]
      }

      const newOptions = [...state]
      const optionsToAddTo = newOptions.find(
        (optionGroup) => optionGroup.label === getTranslation(collection.labels.plural, i18n),
      )

      const newSubOptions = data.docs.reduce((docs, doc) => {
        if (loadedIDs.indexOf(doc.id) === -1) {
          loadedIDs.push(doc.id)

          return [
            ...docs,
            {
              label: doc[labelKey],
              relationTo: relation,
              value: doc.id,
            },
          ]
        }

        return docs
      }, [])

      if (optionsToAddTo) {
        optionsToAddTo.options = [...optionsToAddTo.options, ...newSubOptions]
      } else {
        newOptions.push({
          label: getTranslation(collection.labels.plural, i18n),
          options: newSubOptions,
          value: undefined,
        })
      }

      return newOptions
    }

    case 'CLEAR': {
      return action.required ? [] : [{ label: action.i18n.t('general:none'), value: 'null' }]
    }

    default: {
      return state
    }
  }
}

export default optionsReducer
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Relationship/types.ts

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type {
  ClientCollectionConfig,
  PaginatedDocs,
  RelationshipFieldClient,
  ResolvedFilterOptions,
  UploadFieldClient,
} from 'payload'

import type { DefaultFilterProps } from '../types.js'

export type RelationshipFilterProps = {
  readonly field: RelationshipFieldClient | UploadFieldClient
  readonly filterOptions: ResolvedFilterOptions
} & DefaultFilterProps

export type Option = {
  label: string
  options?: Option[]
  relationTo?: string | string[]
  value: string
}

type CLEAR = {
  i18n: I18nClient
  required: boolean
  type: 'CLEAR'
}

type ADD = {
  collection: ClientCollectionConfig
  data: PaginatedDocs<any>
  hasMultipleRelations: boolean
  i18n: I18nClient
  relation: string
  type: 'ADD'
}

export type Action = ADD | CLEAR

export type ValueWithRelation = {
  relationTo: string
  value: string
}

export type GetResults = (args: {
  lastFullyLoadedRelation?: number
  lastLoadedPage?: number
  search?: string
}) => Promise<void>
```

--------------------------------------------------------------------------------

---[FILE: formatOptions.ts]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Select/formatOptions.ts

```typescript
import type { Option, OptionObject } from 'payload'

/**
 * Formats an array of options for use in a select input.
 */
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
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Select/index.tsx
Signals: React

```typescript
'use client'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { SelectFilterProps as Props } from './types.js'

import { useTranslation } from '../../../../providers/Translation/index.js'
import { ReactSelect } from '../../../ReactSelect/index.js'
import { formatOptions } from './formatOptions.js'

export const Select: React.FC<Props> = ({
  disabled,
  field: {
    admin: { placeholder },
  },
  isClearable,
  onChange,
  operator,
  options: optionsFromProps,
  value,
}) => {
  const { i18n } = useTranslation()
  const [options, setOptions] = React.useState(formatOptions(optionsFromProps))

  const isMulti = ['in', 'not_in'].includes(operator)
  let valueToRender

  if (isMulti && Array.isArray(value)) {
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
  }

  const onSelect = React.useCallback(
    (selectedOption) => {
      let newValue

      if (!selectedOption) {
        newValue = null
      } else if (isMulti) {
        if (Array.isArray(selectedOption)) {
          newValue = selectedOption.map((option) => option.value)
        } else {
          newValue = []
        }
      } else {
        newValue = selectedOption.value
      }

      onChange(newValue)
    },
    [isMulti, onChange],
  )

  React.useEffect(() => {
    setOptions(formatOptions(optionsFromProps))
  }, [optionsFromProps])

  React.useEffect(() => {
    if (!isMulti && Array.isArray(value)) {
      onChange(value[0])
    }
  }, [isMulti, onChange, value])

  return (
    <ReactSelect
      disabled={disabled}
      isClearable={isClearable}
      isMulti={isMulti}
      onChange={onSelect}
      options={options.map((option) => ({ ...option, label: getTranslation(option.label, i18n) }))}
      placeholder={placeholder}
      value={valueToRender}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Select/types.ts

```typescript
import type { LabelFunction, Option, SelectFieldClient } from 'payload'

import type { DefaultFilterProps } from '../types.js'

export type SelectFilterProps = {
  readonly field: SelectFieldClient
  readonly isClearable?: boolean
  readonly onChange: (val: string) => void
  readonly options: Option[]
  readonly placeholder?: LabelFunction | string
  readonly value: string
} & DefaultFilterProps
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Text/index.scss

```text
@import '../../../../scss/styles.scss';

@layer payload-default {
  .condition-value-text {
    @include formInput;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Text/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import type { TextFilterProps as Props } from './types.js'

import { useTranslation } from '../../../../providers/Translation/index.js'
import { ReactSelect } from '../../../ReactSelect/index.js'
import './index.scss'

const baseClass = 'condition-value-text'

export const Text: React.FC<Props> = (props) => {
  const {
    disabled,
    field: { hasMany },
    onChange,
    operator,
    value,
  } = props
  const { t } = useTranslation()

  const isMulti = ['in', 'not_in'].includes(operator) || hasMany

  const [valueToRender, setValueToRender] = React.useState<
    { id: string; label: string; value: { value: string } }[]
  >([])

  const onSelect = React.useCallback(
    (selectedOption) => {
      let newValue
      if (!selectedOption) {
        newValue = []
      } else if (isMulti) {
        if (Array.isArray(selectedOption)) {
          newValue = selectedOption.map((option) => option.value?.value || option.value)
        } else {
          newValue = [selectedOption.value?.value || selectedOption.value]
        }
      }

      onChange(newValue)
    },
    [isMulti, onChange],
  )

  React.useEffect(() => {
    if (Array.isArray(value)) {
      setValueToRender(
        value.map((val, index) => {
          return {
            id: `${val}${index}`, // append index to avoid duplicate keys but allow duplicate numbers
            label: `${val}`,
            value: {
              toString: () => `${val}${index}`,
              value: (val as any)?.value || val,
            },
          }
        }),
      )
    } else {
      setValueToRender([])
    }
  }, [value])

  return isMulti ? (
    <ReactSelect
      disabled={disabled}
      isClearable
      isCreatable
      isMulti={isMulti}
      isSortable
      onChange={onSelect}
      options={[]}
      placeholder={t('general:enterAValue')}
      value={valueToRender || []}
    />
  ) : (
    <input
      className={baseClass}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t('general:enterAValue')}
      type="text"
      value={value || ''}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/WhereBuilder/Condition/Text/types.ts

```typescript
import type { TextFieldClient } from 'payload'

import type { DefaultFilterProps } from '../types.js'

export type TextFilterProps = {
  readonly field: TextFieldClient
  readonly onChange: (val: string) => void
  readonly value: string | string[]
} & DefaultFilterProps
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/WindowInfo/index.tsx

```typescript
'use client'
import { useWindowInfo, WindowInfoProvider } from '@faceless-ui/window-info'
export { useWindowInfo, WindowInfoProvider }
```

--------------------------------------------------------------------------------

````
