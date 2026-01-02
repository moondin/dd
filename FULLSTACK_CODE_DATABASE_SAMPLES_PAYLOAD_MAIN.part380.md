---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 380
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 380 of 695)

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
Location: payload-main/packages/ui/src/elements/ReactSelect/Control/index.tsx
Signals: React

```typescript
'use client'
import type { ControlProps } from 'react-select'

import React from 'react'
import { components as SelectComponents } from 'react-select'

import type { Option } from '../types.js'

export const Control: React.FC<ControlProps<Option, any>> = (props) => {
  const {
    children,
    innerProps,
    // @ts-expect-error-next-line // TODO Fix this - moduleResolution 16 breaks our declare module
    selectProps: { customProps: { disableKeyDown, disableMouseDown } = {} } = {},
  } = props

  return (
    <React.Fragment>
      <SelectComponents.Control
        {...props}
        innerProps={{
          ...innerProps,
          onKeyDown: (e) => {
            if (disableKeyDown) {
              e.stopPropagation()
              // Create event for keydown listeners which specifically want to bypass this stopPropagation
              const bypassEvent = new CustomEvent('bypassKeyDown', { detail: e })
              document.dispatchEvent(bypassEvent)
            }
          },
          // react-select has this typed incorrectly so we disable the linting rule
          // we need to prevent react-select from hijacking the 'onKeyDown' event while modals are open (i.e. the 'Relationship' field component)

          onMouseDown: (e) => {
            // we need to prevent react-select from hijacking the 'onMouseDown' event while modals are open (i.e. the 'Relationship' field component)
            if (!disableMouseDown) {
              innerProps.onMouseDown(e)
            }
          },
        }}
      >
        {children}
      </SelectComponents.Control>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ReactSelect/DropdownIndicator/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .dropdown-indicator {
    cursor: pointer;
    display: flex;
    @include btn-reset;

    &:focus-visible {
      outline: var(--accessibility-outline);
    }

    &__icon {
      .stroke {
        stroke-width: 1px;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ReactSelect/DropdownIndicator/index.tsx
Signals: React

```typescript
'use client'
import type { DropdownIndicatorProps } from 'react-select'

import React, { type JSX } from 'react'

import type { Option as OptionType } from '../types.js'

import { ChevronIcon } from '../../../icons/Chevron/index.js'
import './index.scss'

const baseClass = 'dropdown-indicator'
export const DropdownIndicator: React.FC<
  {
    innerProps: JSX.IntrinsicElements['button']
  } & DropdownIndicatorProps<OptionType, true>
> = (props) => {
  const {
    innerProps: { ref, ...restInnerProps },
  } = props

  return (
    <button
      className={baseClass}
      ref={ref}
      {...restInnerProps}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.key = ' '
        }
      }}
      type="button"
    >
      <ChevronIcon className={`${baseClass}__icon`} />
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ReactSelect/Input/index.tsx
Signals: React

```typescript
'use client'
import type { InputProps } from 'react-select'

import React from 'react'
import { components as SelectComponents } from 'react-select'

import type { Option } from '../types.js'

export const Input: React.FC<InputProps<Option, any>> = (props) => {
  return (
    <React.Fragment>
      <SelectComponents.Input
        {...props}
        /**
         * Adding `aria-activedescendant` fixes hydration error
         * source: https://github.com/JedWatson/react-select/issues/5459#issuecomment-1878037196
         */
        aria-activedescendant={undefined}
      />
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ReactSelect/MultiValue/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .multi-value {
    &.rs__multi-value {
      display: flex;
      padding: 0;
      border: 1px solid var(--theme-border-color);
      border-radius: var(--style-radius-s);
      line-height: calc(#{$baseline} - 2px);
      margin: base(0.25) base(0.5) base(0.25) 0;
      transition: border 0.2s cubic-bezier(0.2, 0, 0, 1);

      &:hover {
        border: 1px solid var(--theme-elevation-250);
      }
    }

    &--is-dragging {
      z-index: 2;
    }
  }

  html[data-theme='light'] {
    .multi-value {
      &.rs__multi-value {
        background: var(--theme-elevation-50);
      }
    }
  }

  html[data-theme='dark'] {
    .multi-value {
      &.rs__multi-value {
        background: var(--theme-elevation-50);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ReactSelect/MultiValue/index.tsx
Signals: React

```typescript
'use client'
import type { MultiValueProps } from 'react-select'

import React from 'react'
import { components as SelectComponents } from 'react-select'

import type { Option } from '../types.js'

import { useDraggableSortable } from '../../DraggableSortable/useDraggableSortable/index.js'
import './index.scss'

const baseClass = 'multi-value'

export function generateMultiValueDraggableID(optionData, valueFunction) {
  return typeof valueFunction === 'function' ? valueFunction(optionData) : optionData?.value
}
export const MultiValue: React.FC<MultiValueProps<Option>> = (props) => {
  const {
    className,
    data,
    innerProps,
    isDisabled,
    // @ts-expect-error // TODO Fix this - moduleResolution 16 breaks our declare module
    selectProps: { customProps: { disableMouseDown } = {}, getOptionValue, isSortable } = {},
  } = props

  const id = generateMultiValueDraggableID(data, getOptionValue)

  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggableSortable({
    id,
    disabled: !isSortable,
  })

  const classes = [
    baseClass,
    className,
    !isDisabled && isSortable && 'draggable',
    isDragging && `${baseClass}--is-dragging`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <React.Fragment>
      <SelectComponents.MultiValue
        {...props}
        className={classes}
        innerProps={{
          ...(isSortable
            ? {
                ...attributes,
                ...listeners,
              }
            : {}),
          ...innerProps,
          onMouseDown: (e) => {
            if (!disableMouseDown) {
              // we need to prevent the dropdown from opening when clicking on the drag handle, but not when a modal is open (i.e. the 'Relationship' field component)
              e.stopPropagation()
            }
          },
          ref: setNodeRef,
          style: isSortable
            ? {
                transform,
                ...attributes?.style,
              }
            : {},
        }}
      />
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ReactSelect/MultiValueLabel/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .multi-value-label {
    @extend %small;
    display: flex;
    align-items: center;
    max-width: 150px;
    color: currentColor;
    padding: 0 base(0.4);

    &__text {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      &--editable {
        cursor: text;
        outline: var(--accessibility-outline);
      }
    }

    &:focus-visible {
      outline: var(--accessibility-outline);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ReactSelect/MultiValueLabel/index.tsx
Signals: React

```typescript
'use client'
import type { OptionLabel } from 'payload'
import type { MultiValueProps } from 'react-select'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'
import { components as SelectComponents } from 'react-select'

import type { Option } from '../types.js'

import { useTranslation } from '../../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'multi-value-label'

export const MultiValueLabel: React.FC<MultiValueProps<Option>> = (props) => {
  // @ts-expect-error-next-line// TODO Fix this - moduleResolution 16 breaks our declare module
  const { data, selectProps: { customProps: { draggableProps, editableProps } = {} } = {} } = props
  const { i18n } = useTranslation()

  const className = `${baseClass}__text`
  const labelText = data.label ? getTranslation(data.label as OptionLabel, i18n) : ''
  const titleText = typeof labelText === 'string' ? labelText : ''

  return (
    <div className={baseClass} title={titleText}>
      <SelectComponents.MultiValueLabel
        {...props}
        innerProps={{
          className,
          ...((editableProps && editableProps(data, className, props.selectProps)) || {}),
          ...(draggableProps || {}),
        }}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ReactSelect/MultiValueRemove/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .multi-value-remove {
    cursor: pointer;
    width: base(1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: transparent;
    border: none;
    padding: 0;
    color: inherit;

    &:hover {
      color: var(--theme-elevation-800);
      background: var(--theme-elevation-150);
    }

    &__icon {
      width: 100%;
      height: 100%;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ReactSelect/MultiValueRemove/index.tsx
Signals: React

```typescript
'use client'
import type { MultiValueRemoveProps } from 'react-select'

import React, { type JSX } from 'react'

import type { Option as OptionType } from '../types.js'

import { XIcon } from '../../../icons/X/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Tooltip } from '../../Tooltip/index.js'
import './index.scss'

const baseClass = 'multi-value-remove'

export const MultiValueRemove: React.FC<
  {
    innerProps: JSX.IntrinsicElements['button']
  } & MultiValueRemoveProps<OptionType>
> = (props) => {
  const {
    innerProps: { className, onClick, onTouchEnd },
  } = props

  const [showTooltip, setShowTooltip] = React.useState(false)
  const { t } = useTranslation()

  return (
    <button
      aria-label={t('general:remove')}
      className={[baseClass, className].filter(Boolean).join(' ')}
      onClick={(e) => {
        setShowTooltip(false)
        onClick(e)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.stopPropagation()
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchEnd={onTouchEnd}
      type="button"
    >
      <Tooltip className={`${baseClass}__tooltip`} show={showTooltip}>
        {t('general:remove')}
      </Tooltip>
      <XIcon className={`${baseClass}__icon`} />
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ReactSelect/SingleValue/index.tsx
Signals: React

```typescript
'use client'
import type { SingleValueProps } from 'react-select'

import React from 'react'
import { components as SelectComponents } from 'react-select'

import type { Option } from '../types.js'

const baseClass = 'react-select--single-value'

export const SingleValue: React.FC<SingleValueProps<Option>> = (props) => {
  const { children, className } = props

  return (
    <React.Fragment>
      <SelectComponents.SingleValue
        {...props}
        className={[baseClass, className].filter(Boolean).join(' ')}
      >
        {children}
      </SelectComponents.SingleValue>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ReactSelect/ValueContainer/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .value-container {
    flex-grow: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: calc(var(--base) / 2);

    &__label {
      color: var(--theme-elevation-550);
    }

    .rs__value-container {
      overflow: visible;
      padding: 2px;
      gap: 2px;

      > * {
        margin: 0;
        padding-top: 0;
        padding-bottom: 0;
        color: currentColor;

        .field-label {
          padding-bottom: 0;
        }
      }

      &--is-multi {
        width: calc(100% + base(0.25));

        &.rs__value-container--has-value {
          padding: 0;
          margin-inline-start: -4px;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ReactSelect/ValueContainer/index.tsx
Signals: React

```typescript
'use client'
import type { OptionLabel } from 'payload'
import type { ValueContainerProps } from 'react-select'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'
import { components as SelectComponents } from 'react-select'

import type { Option } from '../types.js'

import { useTranslation } from '../../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'value-container'

export const ValueContainer: React.FC<ValueContainerProps<Option, any>> = (props) => {
  // @ts-expect-error-next-line // TODO Fix this - moduleResolution 16 breaks our declare module
  const { selectProps: { customProps, value } = {} } = props
  const { i18n } = useTranslation()

  // Get the title for single-value selects
  let titleText = ''
  if (value && !Array.isArray(value) && typeof value === 'object' && 'label' in value) {
    const labelText = value.label ? getTranslation(value.label as OptionLabel, i18n) : ''
    titleText = typeof labelText === 'string' ? labelText : ''
  }

  return (
    <div className={baseClass} ref={customProps?.droppableRef} title={titleText}>
      {customProps?.valueContainerLabel && (
        <span className={`${baseClass}__label`}>{customProps?.valueContainerLabel}</span>
      )}
      <SelectComponents.ValueContainer {...props} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: AddNewButton.tsx]---
Location: payload-main/packages/ui/src/elements/RelationshipTable/AddNewButton.tsx

```typescript
'use client'
import type { I18nClient } from '@payloadcms/translations'
import type { ClientCollectionConfig, SanitizedPermissions } from 'payload'

import { getTranslation } from '@payloadcms/translations'

import type { Props as ButtonProps } from '../../elements/Button/types.js'

import { Button } from '../../elements/Button/index.js'
import { Popup, PopupList } from '../Popup/index.js'

export const AddNewButton = ({
  allowCreate,
  baseClass,
  buttonStyle,
  className,
  collections,
  i18n,
  icon,
  label,
  onClick,
  permissions,
  relationTo,
}: {
  allowCreate: boolean
  baseClass: string
  buttonStyle?: ButtonProps['buttonStyle']
  className?: string
  collections: ClientCollectionConfig[]
  i18n: I18nClient
  icon?: ButtonProps['icon']
  label: string
  onClick: (selectedCollection?: string) => void
  permissions: SanitizedPermissions
  relationTo: string | string[]
}) => {
  if (!allowCreate) {
    return null
  }

  const isPolymorphic = Array.isArray(relationTo)

  if (!isPolymorphic) {
    return (
      <Button buttonStyle={buttonStyle} className={className} onClick={() => onClick()}>
        {label}
      </Button>
    )
  }

  return (
    <div className={`${baseClass}__add-new-polymorphic-wrapper`}>
      <Popup
        button={
          <Button buttonStyle={buttonStyle} className={className} icon={icon}>
            {label}
          </Button>
        }
        buttonType="custom"
        horizontalAlign="center"
        render={({ close: closePopup }) => (
          <PopupList.ButtonGroup>
            {relationTo.map((relatedCollection) => {
              if (permissions.collections[relatedCollection]?.create) {
                return (
                  <PopupList.Button
                    className={`${baseClass}__relation-button--${relatedCollection}`}
                    key={relatedCollection}
                    onClick={() => {
                      closePopup()
                      onClick(relatedCollection)
                    }}
                  >
                    {getTranslation(
                      collections.find((each) => each.slug === relatedCollection).labels.singular,
                      i18n,
                    )}
                  </PopupList.Button>
                )
              }

              return null
            })}
          </PopupList.ButtonGroup>
        )}
        size="medium"
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/RelationshipTable/index.scss

```text
@layer payload-default {
  .relationship-table {
    position: relative;

    &__header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--base);
    }

    &__actions {
      display: flex;
      align-items: center;
      gap: var(--base);
    }

    &__columns-inner {
      padding-bottom: var(--base);
    }

    &__add-new-polymorphic-wrapper {
      display: inline-flex;
    }

    &__add-new-polymorphic .btn__label {
      display: flex;
      text-wrap: nowrap;
      align-items: center;
    }

    .table {
      table {
        width: 100%;
        overflow: auto;

        [class^='cell'] > p,
        [class^='cell'] > span,
        [class^='cell'] > a {
          line-clamp: 4;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
          display: -webkit-box;
          max-width: 100vw;
        }
      }

      th,
      td:first-child {
        min-width: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/RelationshipTable/index.tsx
Signals: React

```typescript
'use client'
import { getTranslation } from '@payloadcms/translations'
import {
  type CollectionSlug,
  type Column,
  type JoinFieldClient,
  type ListQuery,
  type PaginatedDocs,
  type Where,
} from 'payload'
import { hoistQueryParamsToAnd, transformColumnsToPreferences } from 'payload/shared'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import type { DocumentDrawerProps } from '../DocumentDrawer/types.js'

import { Pill } from '../../elements/Pill/index.js'
import { useEffectEvent } from '../../hooks/useEffectEvent.js'
import { ChevronIcon } from '../../icons/Chevron/index.js'
import { useAuth } from '../../providers/Auth/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { ListQueryProvider } from '../../providers/ListQuery/index.js'
import { useServerFunctions } from '../../providers/ServerFunctions/index.js'
import { TableColumnsProvider } from '../../providers/TableColumns/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { AnimateHeight } from '../AnimateHeight/index.js'
import { ColumnSelector } from '../ColumnSelector/index.js'
import { useDocumentDrawer } from '../DocumentDrawer/index.js'
import { RelationshipProvider } from '../Table/RelationshipProvider/index.js'
import { AddNewButton } from './AddNewButton.js'
import { DrawerLink } from './cells/DrawerLink/index.js'
import { RelationshipTablePagination } from './Pagination.js'
import './index.scss'

const baseClass = 'relationship-table'

type RelationshipTableComponentProps = {
  readonly AfterInput?: React.ReactNode
  readonly allowCreate?: boolean
  readonly BeforeInput?: React.ReactNode
  readonly disableTable?: boolean
  readonly field: JoinFieldClient
  readonly fieldPath?: string
  readonly filterOptions?: Where
  readonly initialData?: PaginatedDocs
  readonly initialDrawerData?: DocumentDrawerProps['initialData']
  readonly Label?: React.ReactNode
  readonly parent?: {
    collectionSlug: CollectionSlug
    id: number | string
    joinPath: string
  }
  readonly relationTo: string | string[]
}

export type OnDrawerOpen = (id?: string) => void

export const RelationshipTable: React.FC<RelationshipTableComponentProps> = (props) => {
  const {
    AfterInput,
    allowCreate = true,
    BeforeInput,
    disableTable = false,
    field,
    fieldPath,
    filterOptions,
    initialData: initialDataFromProps,
    initialDrawerData,
    Label,
    parent,
    relationTo,
  } = props
  const [Table, setTable] = useState<React.ReactNode>(null)
  const { config, getEntityConfig } = useConfig()
  const { i18n, t } = useTranslation()

  const [query, setQuery] = useState<ListQuery>()
  const [openColumnSelector, setOpenColumnSelector] = useState(false)

  const [collectionConfig] = useState(() => getEntityConfig({ collectionSlug: relationTo }))

  const isPolymorphic = Array.isArray(relationTo)

  const [selectedCollection, setSelectedCollection] = useState(
    isPolymorphic ? undefined : relationTo,
  )

  const { permissions } = useAuth()

  const openDrawerWhenRelationChanges = useRef(false)

  const [currentDrawerID, setCurrentDrawerID] = useState<string | undefined>(undefined)

  const [DocumentDrawer, , { closeDrawer, isDrawerOpen, openDrawer }] = useDocumentDrawer({
    id: currentDrawerID,
    collectionSlug: selectedCollection,
  })

  const [isLoadingTable, setIsLoadingTable] = useState(!disableTable)

  const [data, setData] = useState<PaginatedDocs>(() =>
    initialDataFromProps
      ? {
          ...initialDataFromProps,
          docs: Array.isArray(initialDataFromProps.docs)
            ? initialDataFromProps.docs.reduce((acc, doc) => {
                if (typeof doc === 'string' || typeof doc === 'number') {
                  return [
                    ...acc,
                    {
                      id: doc,
                    },
                  ]
                }

                return [...acc, doc]
              }, [])
            : [],
        }
      : undefined,
  )

  const [columnState, setColumnState] = useState<Column[]>()

  const { getTableState } = useServerFunctions()

  const renderTable = useCallback(
    async (data?: PaginatedDocs) => {
      const newQuery: ListQuery = {
        limit: field?.defaultLimit || collectionConfig?.admin?.pagination?.defaultLimit,
        sort: field.defaultSort || collectionConfig?.defaultSort,
        ...(query || {}),
        where: { ...(query?.where || {}) },
      }

      if (filterOptions) {
        newQuery.where = hoistQueryParamsToAnd(newQuery.where, filterOptions)
      }

      // map columns from string[] to CollectionPreferences['columns']
      const defaultColumns = field.admin.defaultColumns
        ? field.admin.defaultColumns.map((accessor) => ({
            accessor,
            active: true,
          }))
        : undefined

      const renderRowTypes =
        typeof field.admin.disableRowTypes === 'boolean'
          ? !field.admin.disableRowTypes
          : Array.isArray(relationTo)

      const {
        data: newData,
        state: newColumnState,
        Table: NewTable,
      } = await getTableState({
        collectionSlug: relationTo,
        columns: transformColumnsToPreferences(query?.columns) || defaultColumns,
        data,
        enableRowSelections: false,
        orderableFieldName:
          !field.orderable || Array.isArray(field.collection)
            ? undefined
            : `_${field.collection}_${field.name}_order`,
        parent,
        query: newQuery,
        renderRowTypes,
        tableAppearance: 'condensed',
      })

      setData(newData)
      setTable(NewTable)
      setColumnState(newColumnState)
      setIsLoadingTable(false)
    },
    [
      field.defaultLimit,
      field.defaultSort,
      field.admin.defaultColumns,
      field.admin.disableRowTypes,
      field.collection,
      field.name,
      field.orderable,
      collectionConfig?.admin?.pagination?.defaultLimit,
      collectionConfig?.defaultSort,
      query,
      filterOptions,
      getTableState,
      relationTo,
      parent,
    ],
  )

  const handleTableRender = useEffectEvent((query: ListQuery, disableTable: boolean) => {
    if (!disableTable && (!Table || query)) {
      void renderTable()
    }
  })

  useEffect(() => {
    handleTableRender(query, disableTable)
  }, [query, disableTable])

  const onDrawerSave = useCallback<DocumentDrawerProps['onSave']>(
    ({ doc, operation }) => {
      if (operation === 'create') {
        closeDrawer()
      }

      const foundDocIndex = data?.docs?.findIndex((d) => d.id === doc.id)
      const withNewOrUpdatedData: PaginatedDocs = { docs: [] } as PaginatedDocs

      if (foundDocIndex !== -1) {
        const newDocs = [...data.docs]
        newDocs[foundDocIndex] = doc
        withNewOrUpdatedData.docs = newDocs
      } else {
        withNewOrUpdatedData.docs = [doc, ...data.docs]
      }

      void renderTable(withNewOrUpdatedData)
    },
    [data?.docs, renderTable, closeDrawer],
  )

  const onDrawerDelete = useCallback<DocumentDrawerProps['onDelete']>(
    (args) => {
      const newDocs = data.docs.filter((doc) => doc.id !== args.id)

      void renderTable({
        ...data,
        docs: newDocs,
      })

      setCurrentDrawerID(undefined)
    },
    [data, renderTable],
  )

  const onDrawerOpen = useCallback<OnDrawerOpen>((id) => {
    openDrawerWhenRelationChanges.current = true

    if (id) {
      setCurrentDrawerID(id)
    } else {
      setCurrentDrawerID(undefined)
    }
  }, [])

  useEffect(() => {
    if (openDrawerWhenRelationChanges.current) {
      openDrawerWhenRelationChanges.current = false
      openDrawer()
    }
  }, [openDrawer])

  useEffect(() => {
    if (!isDrawerOpen) {
      setCurrentDrawerID(undefined)
    }
  }, [isDrawerOpen])

  const canCreate =
    allowCreate !== false &&
    permissions?.collections?.[isPolymorphic ? relationTo[0] : relationTo]?.create

  useEffect(() => {
    if (isPolymorphic && selectedCollection) {
      openDrawer()
    }
  }, [selectedCollection, openDrawer, isPolymorphic])

  useEffect(() => {
    if (isPolymorphic && !isDrawerOpen && selectedCollection) {
      setSelectedCollection(undefined)
    }
    // eslint-disable-next-line react-compiler/react-compiler -- TODO: fix
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen])

  const memoizedListQuery = React.useMemo(
    () => ({
      columns: transformColumnsToPreferences(columnState)?.map(({ accessor }) => accessor),
      limit: field.defaultLimit ?? collectionConfig?.admin?.pagination?.defaultLimit,
      sort: field.defaultSort ?? collectionConfig?.defaultSort,
    }),
    [columnState, field, collectionConfig],
  )

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__header`}>
        {Label}
        <div className={`${baseClass}__actions`}>
          <AddNewButton
            allowCreate={allowCreate !== false}
            baseClass={baseClass}
            buttonStyle="none"
            className={`${baseClass}__add-new${isPolymorphic ? '-polymorphic' : ' doc-drawer__toggler'}`}
            collections={config.collections}
            i18n={i18n}
            icon={isPolymorphic ? 'plus' : undefined}
            label={i18n.t('fields:addNew')}
            onClick={isPolymorphic ? setSelectedCollection : openDrawer}
            permissions={permissions}
            relationTo={relationTo}
          />
          <Pill
            aria-controls={`${baseClass}-columns`}
            aria-expanded={openColumnSelector}
            className={`${baseClass}__toggle-columns ${
              openColumnSelector ? `${baseClass}__buttons-active` : ''
            }`}
            icon={<ChevronIcon direction={openColumnSelector ? 'up' : 'down'} />}
            onClick={() => setOpenColumnSelector(!openColumnSelector)}
            pillStyle="light"
            size="small"
          >
            {t('general:columns')}
          </Pill>
        </div>
      </div>
      {BeforeInput}
      {isLoadingTable ? (
        <p>{t('general:loading')}</p>
      ) : (
        <Fragment>
          {data?.docs && data.docs.length === 0 && (
            <div className={`${baseClass}__no-results`}>
              <p>
                {i18n.t('general:noResults', {
                  label: isPolymorphic
                    ? i18n.t('general:documents')
                    : getTranslation(collectionConfig?.labels?.plural, i18n),
                })}
              </p>
              <AddNewButton
                allowCreate={canCreate}
                baseClass={baseClass}
                collections={config.collections}
                i18n={i18n}
                label={i18n.t('general:createNewLabel', {
                  label: isPolymorphic
                    ? i18n.t('general:document')
                    : getTranslation(collectionConfig?.labels?.singular, i18n),
                })}
                onClick={isPolymorphic ? setSelectedCollection : openDrawer}
                permissions={permissions}
                relationTo={relationTo}
              />
            </div>
          )}
          {data?.docs && data.docs.length > 0 && (
            <RelationshipProvider>
              <ListQueryProvider
                data={data}
                modifySearchParams={false}
                onQueryChange={setQuery}
                orderableFieldName={
                  !field.orderable || Array.isArray(field.collection)
                    ? undefined
                    : `_${field.collection}_${fieldPath.replaceAll('.', '_')}_order`
                }
                query={memoizedListQuery}
              >
                <TableColumnsProvider
                  collectionSlug={isPolymorphic ? relationTo[0] : relationTo}
                  columnState={columnState}
                  LinkedCellOverride={
                    <DrawerLink currentDrawerID={currentDrawerID} onDrawerOpen={onDrawerOpen} />
                  }
                >
                  <AnimateHeight
                    className={`${baseClass}__columns`}
                    height={openColumnSelector ? 'auto' : 0}
                    id={`${baseClass}-columns`}
                  >
                    <div className={`${baseClass}__columns-inner`}>
                      {collectionConfig && (
                        <ColumnSelector collectionSlug={collectionConfig.slug} />
                      )}
                    </div>
                  </AnimateHeight>
                  {Table}
                  <RelationshipTablePagination />
                </TableColumnsProvider>
              </ListQueryProvider>
            </RelationshipProvider>
          )}
        </Fragment>
      )}
      {AfterInput}
      <DocumentDrawer
        initialData={initialDrawerData}
        onDelete={onDrawerDelete}
        onSave={onDrawerSave}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Pagination.tsx]---
Location: payload-main/packages/ui/src/elements/RelationshipTable/Pagination.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { useListQuery } from '../../providers/ListQuery/index.js'
import { Pagination } from '../Pagination/index.js'

export const RelationshipTablePagination: React.FC = () => {
  const { data, handlePageChange } = useListQuery()

  return (
    <Pagination
      hasNextPage={data.hasNextPage}
      hasPrevPage={data.hasPrevPage}
      limit={data.limit}
      nextPage={data.nextPage || 2}
      numberOfNeighbors={1}
      onChange={(e) => {
        void handlePageChange(e)
      }}
      page={data.page || 1}
      prevPage={data.prevPage || undefined}
      totalPages={data.totalPages}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/RelationshipTable/cells/DrawerLink/index.scss

```text
@layer payload-default {
  .drawer-link {
    display: flex;
    gap: calc(var(--base) / 2);

    &__doc-drawer-toggler {
      border: none;
      background: none;
      padding: 0;
      cursor: pointer;
      color: var(--color-text);
      font-size: inherit;
      line-height: inherit;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/RelationshipTable/cells/DrawerLink/index.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import type { OnDrawerOpen } from '../../index.js'

import { EditIcon } from '../../../../icons/Edit/index.js'
import { useCellProps } from '../../../../providers/TableColumns/RenderDefaultCell/index.js'
import { DefaultCell } from '../../../Table/DefaultCell/index.js'
import './index.scss'

export const DrawerLink: React.FC<{
  currentDrawerID?: string
  onDrawerOpen: OnDrawerOpen
}> = ({ onDrawerOpen }) => {
  const cellProps = useCellProps()

  return (
    <div className="drawer-link">
      <DefaultCell {...cellProps} className="drawer-link__cell" link={false} onClick={null} />
      <button
        className="drawer-link__doc-drawer-toggler"
        onClick={() => {
          onDrawerOpen(cellProps.rowData.id)
        }}
        type="button"
      >
        <EditIcon />
      </button>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/RenderComponent/index.tsx
Signals: React

```typescript
import React from 'react'

export const RenderComponent: React.FC<{
  readonly Component?: React.ComponentType | React.ComponentType[]
  readonly Fallback?: React.ComponentType
  readonly props?: object
}> = ({ Component, Fallback, props = {} }) => {
  if (Array.isArray(Component)) {
    return Component.map((c, index) => <RenderComponent Component={c} key={index} props={props} />)
  }

  if (typeof Component === 'function') {
    return <Component {...props} />
  }

  return Fallback ? <Fallback {...props} /> : null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/RenderCustomComponent/index.tsx

```typescript
type Args = {
  CustomComponent?: React.ReactNode
  Fallback: React.ReactNode
}

/**
 * Renders a CustomComponent or a Fallback component.
 * Only fallback if the Custom Component is undefined.
 *
 * If the CustomComponent is null, render null.
 *
 * @param {Object} args - Arguments object.
 * @param {React.ReactNode} [args.CustomComponent] - Optional custom component to render.
 * @param {React.ReactNode} args.Fallback - Fallback component to render if CustomComponent is undefined.
 * @returns {React.ReactNode} Rendered component.
 */
export function RenderCustomComponent({ CustomComponent, Fallback }: Args): React.ReactNode {
  return CustomComponent !== undefined ? CustomComponent : Fallback
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/RenderIfInViewport/index.tsx
Signals: React

```typescript
'use client'
import type { ClientComponentProps } from 'payload'

import React from 'react'

import { useIntersect } from '../../hooks/useIntersect.js'

export const RenderIfInViewport: React.FC<
  {
    children: React.ReactNode
    className?: string
  } & Pick<ClientComponentProps, 'forceRender'>
> = ({ children, className, forceRender }) => {
  const [hasRendered, setHasRendered] = React.useState(Boolean(forceRender))
  const [intersectionRef, entry] = useIntersect(
    {
      rootMargin: '1000px',
    },
    Boolean(forceRender),
  )

  const isIntersecting = Boolean(entry?.isIntersecting)
  const isAboveViewport = entry?.boundingClientRect?.top < 0
  const shouldRender = forceRender || isIntersecting || isAboveViewport

  React.useEffect(() => {
    if (shouldRender && !hasRendered) {
      setHasRendered(true)
    }
  }, [shouldRender, hasRendered])

  return (
    <div className={className} ref={intersectionRef}>
      {hasRendered ? children : null}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/RenderServerComponent/index.tsx
Signals: React

```typescript
import type { ImportMap, PayloadComponent } from 'payload'

import { getFromImportMap, isPlainObject, isReactServerComponentOrFunction } from 'payload/shared'
import React from 'react'

import { removeUndefined } from '../../utilities/removeUndefined.js'

type RenderServerComponentFn = (args: {
  readonly clientProps?: object
  readonly Component?:
    | PayloadComponent
    | PayloadComponent[]
    | React.ComponentType
    | React.ComponentType[]
  readonly Fallback?: React.ComponentType
  readonly importMap: ImportMap
  readonly key?: string
  readonly serverProps?: object
}) => React.ReactNode

/**
 * Can be used to render both MappedComponents and React Components.
 */
export const RenderServerComponent: RenderServerComponentFn = ({
  clientProps = {},
  Component,
  Fallback,
  importMap,
  key,
  serverProps,
}) => {
  if (Array.isArray(Component)) {
    return Component.map((c, index) =>
      RenderServerComponent({
        clientProps,
        Component: c,
        importMap,
        key: index,
        serverProps,
      }),
    )
  }

  if (typeof Component === 'function') {
    const isRSC = isReactServerComponentOrFunction(Component)

    // prevent $undefined from being passed through the rsc requests
    const sanitizedProps = removeUndefined({
      ...clientProps,
      ...(isRSC ? serverProps : {}),
    })

    return <Component key={key} {...sanitizedProps} />
  }

  if (typeof Component === 'string' || isPlainObject(Component)) {
    const ResolvedComponent = getFromImportMap<React.ComponentType>({
      importMap,
      PayloadComponent: Component,
      schemaPath: '',
    })

    if (ResolvedComponent) {
      const isRSC = isReactServerComponentOrFunction(ResolvedComponent)

      // prevent $undefined from being passed through rsc requests
      const sanitizedProps = removeUndefined({
        ...clientProps,
        ...(isRSC ? serverProps : {}),
        ...(isRSC && typeof Component === 'object' && Component?.serverProps
          ? Component.serverProps
          : {}),
        ...(typeof Component === 'object' && Component?.clientProps ? Component.clientProps : {}),
      })

      return <ResolvedComponent key={key} {...sanitizedProps} />
    }
  }

  return Fallback
    ? RenderServerComponent({
        clientProps,
        Component: Fallback,
        importMap,
        key,
        serverProps,
      })
    : null
}
```

--------------------------------------------------------------------------------

````
