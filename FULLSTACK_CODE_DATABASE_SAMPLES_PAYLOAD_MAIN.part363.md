---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 363
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 363 of 695)

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
Location: payload-main/packages/ui/src/elements/ColumnSelector/index.tsx
Signals: React

```typescript
'use client'
import type { SanitizedCollectionConfig, StaticLabel } from 'payload'

import { fieldIsHiddenOrDisabled, fieldIsID } from 'payload/shared'
import React, { useId, useMemo } from 'react'

import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useEditDepth } from '../../providers/EditDepth/index.js'
import { useTableColumns } from '../../providers/TableColumns/index.js'
import { PillSelector, type SelectablePill } from '../PillSelector/index.js'

export type Props = {
  readonly collectionSlug: SanitizedCollectionConfig['slug']
}

export const ColumnSelector: React.FC<Props> = ({ collectionSlug }) => {
  const { columns, moveColumn, toggleColumn } = useTableColumns()

  const uuid = useId()
  const editDepth = useEditDepth()

  const filteredColumns = useMemo(
    () =>
      columns?.filter(
        (col) =>
          !(fieldIsHiddenOrDisabled(col.field) && !fieldIsID(col.field)) &&
          !col?.field?.admin?.disableListColumn,
      ),
    [columns],
  )

  const pills: SelectablePill[] = useMemo(() => {
    return filteredColumns
      ? filteredColumns.map((col, i) => {
          const { accessor, active, field } = col

          const label =
            'labelWithPrefix' in field && field.labelWithPrefix !== undefined
              ? field.labelWithPrefix
              : 'label' in field && field.label !== undefined
                ? field.label
                : 'name' in field && field.name !== undefined
                  ? field.name
                  : undefined

          return {
            name: accessor,
            key: `${collectionSlug}-${accessor}-${i}${editDepth ? `-${editDepth}-` : ''}${uuid}`,
            Label: <FieldLabel label={label as StaticLabel} unstyled />,
            selected: active,
          } as SelectablePill
        })
      : null
  }, [collectionSlug, editDepth, filteredColumns, uuid])

  if (!pills) {
    return null
  }

  return (
    <PillSelector
      draggable={{
        onDragEnd: ({ moveFromIndex, moveToIndex }) => {
          void moveColumn({
            fromIndex: moveFromIndex,
            toIndex: moveToIndex,
          })
        },
      }}
      onClick={({ pill }) => {
        void toggleColumn(pill.name)
      }}
      pills={pills}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Combobox/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .combobox {
    &__content {
      display: flex;
      flex-direction: column;
    }

    &__search-wrapper {
      padding-top: var(--popup-padding);
      padding-bottom: calc(var(--base) * 0.5);
      border-bottom: 1px solid var(--theme-elevation-150);
      margin-bottom: calc(var(--base) * 0.5);

      &--no-results {
        border-bottom: none;
        margin-bottom: 0;
      }
    }

    &__search-input {
      width: 100%;
      background: var(--theme-elevation-50);
      color: var(--theme-text);
      border: none;
      border-radius: var(--style-radius-s);
      padding: calc(var(--base) * 0.25) calc(var(--base) * 0.5);
      outline: none;
      box-shadow: none;

      &::placeholder {
        color: var(--theme-elevation-400);
      }

      &:focus,
      &:focus-visible {
        background: var(--theme-elevation-100);
        outline: none;
        border: none;
        box-shadow: none;
      }
    }

    &__entry {
      cursor: pointer;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Combobox/index.tsx
Signals: React

```typescript
'use client'
import React, { useMemo, useRef, useState } from 'react'

import type { PopupProps } from '../Popup/index.js'

import { Popup, PopupList } from '../Popup/index.js'
import './index.scss'

const baseClass = 'combobox'

/**
 * @internal
 * @experimental
 */
export type ComboboxEntry = {
  Component: React.ReactNode
  name: string
}

/**
 * @internal
 * @experimental
 */
export type ComboboxProps = {
  entries: ComboboxEntry[]
  /** Minimum number of entries required to show search */
  minEntriesForSearch?: number
  onSelect?: (entry: ComboboxEntry) => void
  searchPlaceholder?: string
} & Omit<PopupProps, 'children' | 'render'>

/**
 * A wrapper on top of Popup + PopupList.ButtonGroup that adds search functionality.
 *
 * @internal - this component may be removed or receive breaking changes in minor releases.
 * @experimental
 */
export const Combobox: React.FC<ComboboxProps> = (props) => {
  const {
    entries,
    minEntriesForSearch = 8,
    onSelect,
    onToggleClose,
    onToggleOpen,
    searchPlaceholder = 'Search...',
    ...popupProps
  } = props
  const [searchValue, setSearchValue] = useState('')
  const isOpenRef = useRef(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredEntries = useMemo(() => {
    if (!searchValue) {
      return entries
    }
    const search = searchValue.toLowerCase()
    return entries.filter((entry) => entry.name.toLowerCase().includes(search))
  }, [entries, searchValue])

  const showSearch = entries.length >= minEntriesForSearch
  const hasResults = filteredEntries.length > 0

  const handleToggleOpen = React.useCallback(
    (active: boolean) => {
      isOpenRef.current = active
      if (active && showSearch) {
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 100)
      }
      onToggleOpen?.(active)
    },
    [showSearch, onToggleOpen],
  )

  const handleToggleClose = React.useCallback(() => {
    isOpenRef.current = false
    setSearchValue('')
    onToggleClose?.()
  }, [onToggleClose])

  return (
    <Popup
      {...popupProps}
      className={`${baseClass} ${popupProps.className || ''}`}
      onToggleClose={handleToggleClose}
      onToggleOpen={handleToggleOpen}
      render={({ close }) => (
        <div className={`${baseClass}__content`}>
          {showSearch && (
            <div
              className={`${baseClass}__search-wrapper${!hasResults ? ` ${baseClass}__search-wrapper--no-results` : ''}`}
            >
              <input
                aria-label={searchPlaceholder}
                className={`${baseClass}__search-input`}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchPlaceholder}
                ref={searchInputRef}
                type="text"
                value={searchValue}
              />
            </div>
          )}
          <PopupList.ButtonGroup>
            {filteredEntries.map((entry, index) => {
              const handleClick = () => {
                if (onSelect) {
                  onSelect(entry)
                }
                close()
              }

              return (
                <div
                  className={`${baseClass}__entry`}
                  key={`${entry.name}-${index}`}
                  onClick={handleClick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleClick()
                    }
                  }}
                  role="menuitem"
                  tabIndex={0}
                >
                  {entry.Component}
                </div>
              )
            })}
          </PopupList.ButtonGroup>
        </div>
      )}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ConfirmationModal/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .confirmation-modal {
    @include blur-bg;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    &__wrapper {
      z-index: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: base(0.8);
      padding: base(2);
      max-width: base(36);
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: base(0.4);

      > * {
        margin: 0;
      }
    }

    &__controls {
      display: flex;
      gap: base(0.4);

      .btn {
        margin: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ConfirmationModal/index.tsx
Signals: React

```typescript
'use client'
import { Modal, useModal } from '@faceless-ui/modal'
import React, { useCallback } from 'react'

import { useTranslation } from '../../providers/Translation/index.js'
import { Button } from '../Button/index.js'
import { drawerZBase, useDrawerDepth } from '../Drawer/index.js'
import './index.scss'

const baseClass = 'confirmation-modal'

export type OnCancel = () => void

export type ConfirmationModalProps = {
  body: React.ReactNode
  cancelLabel?: string
  className?: string
  confirmingLabel?: string
  confirmLabel?: string
  heading: React.ReactNode
  modalSlug: string
  onCancel?: OnCancel
  onConfirm: () => Promise<void> | void
}

export function ConfirmationModal(props: ConfirmationModalProps) {
  const {
    body,
    cancelLabel,
    className,
    confirmingLabel,
    confirmLabel,
    heading,
    modalSlug,
    onCancel: onCancelFromProps,
    onConfirm: onConfirmFromProps,
  } = props

  const editDepth = useDrawerDepth()

  const [confirming, setConfirming] = React.useState(false)

  const { closeModal, isModalOpen } = useModal()
  const { t } = useTranslation()

  const onConfirm = useCallback(async () => {
    if (!confirming) {
      setConfirming(true)

      if (typeof onConfirmFromProps === 'function') {
        await onConfirmFromProps()
      }

      setConfirming(false)
      closeModal(modalSlug)
    }
  }, [confirming, onConfirmFromProps, closeModal, modalSlug])

  const onCancel = useCallback(() => {
    if (!confirming) {
      closeModal(modalSlug)

      if (typeof onCancelFromProps === 'function') {
        onCancelFromProps()
      }
    }
  }, [confirming, onCancelFromProps, closeModal, modalSlug])

  if (!isModalOpen(modalSlug)) {
    return null
  }

  return (
    <Modal
      className={[baseClass, className].filter(Boolean).join(' ')}
      // Fixes https://github.com/payloadcms/payload/issues/13778
      closeOnBlur={false}
      slug={modalSlug}
      style={{
        zIndex: drawerZBase + editDepth,
      }}
    >
      <div className={`${baseClass}__wrapper`}>
        <div className={`${baseClass}__content`}>
          {typeof heading === 'string' ? <h1>{heading}</h1> : heading}
          {typeof body === 'string' ? <p>{body}</p> : body}
        </div>
        <div className={`${baseClass}__controls`}>
          <Button
            buttonStyle="secondary"
            disabled={confirming}
            id="confirm-cancel"
            onClick={onCancel}
            size="large"
            type="button"
          >
            {cancelLabel || t('general:cancel')}
          </Button>
          <Button id="confirm-action" onClick={onConfirm} size="large">
            {confirming
              ? confirmingLabel || `${t('general:loading')}...`
              : confirmLabel || t('general:confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/CopyLocaleData/index.scss

```text
@import '../../scss/styles.scss';

.copy-locale-data {
  &__sub-header {
    padding: 0 var(--gutter-h);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--theme-border-color);
  }

  &__content {
    padding: calc(var(--base) * 1.5) var(--gutter-h);
    display: flex;
    flex-direction: column;
    gap: var(--base);

    > * {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) * 0.25);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/CopyLocaleData/index.tsx
Signals: React, Next.js

```typescript
'use client'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React, { useCallback } from 'react'
import { toast } from 'sonner'

import { CheckboxField } from '../../fields/Checkbox/index.js'
import { SelectInput } from '../../fields/Select/index.js'
import { useFormModified } from '../../forms/Form/context.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useRouteTransition } from '../../providers/RouteTransition/index.js'
import { useServerFunctions } from '../../providers/ServerFunctions/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { DrawerHeader } from '../BulkUpload/Header/index.js'
import { Button } from '../Button/index.js'
import { Drawer } from '../Drawer/index.js'
import { PopupList } from '../Popup/index.js'
import './index.scss'

const baseClass = 'copy-locale-data'

const drawerSlug = 'copy-locale'
export const CopyLocaleData: React.FC = () => {
  const {
    config: {
      localization,
      routes: { admin },
      serverURL,
    },
  } = useConfig()
  const { code } = useLocale()
  const { id, collectionSlug, globalSlug } = useDocumentInfo()
  const { i18n, t } = useTranslation()
  const modified = useFormModified()
  const { toggleModal } = useModal()
  const { copyDataFromLocale } = useServerFunctions()
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()

  const localeOptions =
    (localization &&
      localization.locales.map((locale) => ({ label: locale.label, value: locale.code }))) ||
    []

  const localeOptionsWithoutCurrent = localeOptions.filter((locale) => locale.value !== code)

  const getLocaleLabel = (code: string) => {
    const locale = localization && localization.locales.find((l) => l.code === code)
    return locale && locale.label ? getTranslation(locale.label, i18n) : code
  }

  const [copying, setCopying] = React.useState(false)
  const [toLocale, setToLocale] = React.useState<null | string>(null)
  const [fromLocale, setFromLocale] = React.useState<null | string>(code)
  const [overwriteExisting, setOverwriteExisting] = React.useState(false)

  React.useEffect(() => {
    if (fromLocale !== code) {
      setFromLocale(code)
    }
  }, [code, fromLocale])

  const copyLocaleData = useCallback(
    async ({ from, to }) => {
      setCopying(true)

      try {
        await copyDataFromLocale({
          collectionSlug,
          docID: id,
          fromLocale: from,
          globalSlug,
          overrideData: overwriteExisting,
          toLocale: to,
        })

        setCopying(false)

        startRouteTransition(() =>
          router.push(
            formatAdminURL({
              adminRoute: admin,
              path: `/${collectionSlug ? `collections/${collectionSlug}/${id}` : `globals/${globalSlug}`}`,
              serverURL,
            }) + `?locale=${to}`,
          ),
        )

        toggleModal(drawerSlug)
      } catch (error) {
        toast.error(error.message)
      }
    },
    [
      copyDataFromLocale,
      collectionSlug,
      id,
      globalSlug,
      overwriteExisting,
      toggleModal,
      router,
      serverURL,
      admin,
      startRouteTransition,
    ],
  )

  if (!id && !globalSlug) {
    return null
  }

  return (
    <React.Fragment>
      <PopupList.Button
        id={`${baseClass}__button`}
        onClick={() => {
          if (modified) {
            toast.info(t('general:unsavedChanges'))
          } else {
            toggleModal(drawerSlug)
          }
        }}
      >
        {t('localization:copyToLocale')}
      </PopupList.Button>
      <Drawer
        className={baseClass}
        gutter={false}
        Header={
          <DrawerHeader
            onClose={() => {
              toggleModal(drawerSlug)
            }}
            title={t('localization:copyToLocale')}
          />
        }
        slug={drawerSlug}
      >
        <div className={`${baseClass}__sub-header`}>
          <span>
            {fromLocale && toLocale ? (
              <div>
                {t('localization:copyFromTo', {
                  from: getLocaleLabel(fromLocale),
                  to: getLocaleLabel(toLocale),
                })}
              </div>
            ) : (
              t('localization:selectLocaleToCopy')
            )}
          </span>
          <Button
            buttonStyle="primary"
            disabled={!fromLocale || !toLocale}
            iconPosition="left"
            onClick={async () => {
              if (fromLocale === toLocale) {
                toast.error(t('localization:cannotCopySameLocale'))
                return
              }
              if (!copying) {
                await copyLocaleData({
                  from: fromLocale,
                  to: toLocale,
                })
              }
            }}
            size="medium"
          >
            {copying ? t('general:copying') + '...' : t('general:copy')}
          </Button>
        </div>

        <div className={`${baseClass}__content`}>
          <SelectInput
            label={t('localization:copyFrom')}
            name={'fromLocale'}
            onChange={(selectedOption: { value: string }) => {
              if (selectedOption?.value) {
                setFromLocale(selectedOption.value)
              }
            }}
            options={localeOptions}
            path="fromLocale"
            readOnly
            value={fromLocale}
          />
          <SelectInput
            label={t('localization:copyTo')}
            name="toLocale"
            onChange={(selectedOption: { value: string }) => {
              if (selectedOption?.value) {
                setToLocale(selectedOption.value)
              }
            }}
            options={localeOptionsWithoutCurrent}
            path="toLocale"
            value={toLocale}
          />
          <CheckboxField
            checked={overwriteExisting}
            field={{
              name: 'overwriteExisting',
              label: t('general:overwriteExistingData'),
            }}
            onChange={() => setOverwriteExisting(!overwriteExisting)}
            path={'overwriteExisting'}
          />
        </div>
      </Drawer>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/CopyToClipboard/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .copy-to-clipboard {
    @extend %btn-reset;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
    border-radius: 100%;

    &:focus,
    &:active {
      outline: none;
    }

    &:focus-visible {
      outline: var(--accessibility-outline);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/CopyToClipboard/index.tsx
Signals: React

```typescript
'use client'
import React, { useState } from 'react'

import { CopyIcon } from '../../icons/Copy/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Tooltip } from '../Tooltip/index.js'
import './index.scss'

const baseClass = 'copy-to-clipboard'

export type Props = {
  defaultMessage?: string
  successMessage?: string
  value?: string
}

export const CopyToClipboard: React.FC<Props> = ({ defaultMessage, successMessage, value }) => {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { t } = useTranslation()

  if (value) {
    return (
      <button
        className={baseClass}
        onClick={async () => {
          await navigator.clipboard.writeText(value)
          setCopied(true)
        }}
        onMouseEnter={() => {
          setHovered(true)
          setCopied(false)
        }}
        onMouseLeave={() => {
          setHovered(false)
          setCopied(false)
        }}
        type="button"
      >
        <CopyIcon />
        <Tooltip delay={copied ? 0 : undefined} show={hovered || copied}>
          {copied && (successMessage ?? t('general:copied'))}
          {!copied && (defaultMessage ?? t('general:copy'))}
        </Tooltip>
      </button>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: DatePicker.tsx]---
Location: payload-main/packages/ui/src/elements/DatePicker/DatePicker.tsx
Signals: React

```typescript
'use client'
import type { DatePickerProps } from 'react-datepicker'

import React from 'react'
import ReactDatePickerDefaultImport, { registerLocale, setDefaultLocale } from 'react-datepicker'
const ReactDatePicker =
  'default' in ReactDatePickerDefaultImport
    ? ReactDatePickerDefaultImport.default
    : ReactDatePickerDefaultImport

import type { Props } from './types.js'

import { CalendarIcon } from '../../icons/Calendar/index.js'
import { XIcon } from '../../icons/X/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import './library.scss'
import './index.scss'
import { getFormattedLocale } from './getFormattedLocale.js'

const baseClass = 'date-time-picker'

const DatePicker: React.FC<Props> = (props) => {
  const {
    id,
    displayFormat: customDisplayFormat,
    maxDate,
    maxTime,
    minDate,
    minTime,
    monthsToShow = 1,
    onChange: onChangeFromProps,
    overrides,
    pickerAppearance = 'default',
    placeholder: placeholderText,
    readOnly,
    timeFormat = 'h:mm aa',
    timeIntervals = 30,
    value,
  } = props

  // Use the user's AdminUI language preference for the locale
  const { i18n } = useTranslation()

  let dateFormat = customDisplayFormat

  if (!customDisplayFormat) {
    // when no displayFormat is provided, determine format based on the picker appearance
    if (pickerAppearance === 'default') {
      dateFormat = 'MM/dd/yyyy'
    } else if (pickerAppearance === 'dayAndTime') {
      dateFormat = 'MMM d, yyy h:mm a'
    } else if (pickerAppearance === 'timeOnly') {
      dateFormat = 'h:mm a'
    } else if (pickerAppearance === 'dayOnly') {
      dateFormat = 'MMM dd'
    } else if (pickerAppearance === 'monthOnly') {
      dateFormat = 'MMMM'
    }
  }

  const onChange: Extract<
    DatePickerProps,
    { selectsMultiple?: never; selectsRange?: never }
  >['onChange'] = (incomingDate) => {
    const newDate = incomingDate
    if (newDate instanceof Date && ['dayOnly', 'default', 'monthOnly'].includes(pickerAppearance)) {
      const tzOffset = incomingDate.getTimezoneOffset() / 60
      newDate.setHours(12 - tzOffset, 0)
    }

    if (newDate instanceof Date && !dateFormat.includes('SSS')) {
      // Unless the dateFormat includes milliseconds, set milliseconds to 0
      // This is to ensure that the timestamp is consistent with the displayFormat
      newDate.setMilliseconds(0)
    }

    if (typeof onChangeFromProps === 'function') {
      onChangeFromProps(newDate)
    }
  }

  const dateTimePickerProps: Extract<
    DatePickerProps,
    { selectsMultiple?: never; selectsRange?: never }
  > = {
    customInputRef: 'ref',
    dateFormat,
    disabled: readOnly,
    maxDate,
    maxTime,
    minDate,
    minTime,
    monthsShown: Math.min(2, monthsToShow),
    onChange,
    placeholderText,
    popperPlacement: 'bottom-start',
    selected: value && new Date(value),
    showMonthYearPicker: pickerAppearance === 'monthOnly',
    showPopperArrow: false,
    showTimeSelect: pickerAppearance === 'dayAndTime' || pickerAppearance === 'timeOnly',
    timeFormat,
    timeIntervals,
    ...(overrides as Extract<
      DatePickerProps,
      { selectsMultiple?: never; selectsRange?: never } // to satisfy TypeScript. Overrides can enable selectsMultiple or selectsRange but then it's up to the user to ensure they pass in the correct onChange
    >),
  }

  const classes = [baseClass, `${baseClass}__appearance--${pickerAppearance}`]
    .filter(Boolean)
    .join(' ')

  React.useEffect(() => {
    if (i18n.dateFNS) {
      try {
        const datepickerLocale = getFormattedLocale(i18n.language)
        registerLocale(datepickerLocale, i18n.dateFNS)
        setDefaultLocale(datepickerLocale)
      } catch (e) {
        console.warn(`Could not find DatePicker locale for ${i18n.language}`)
      }
    }
  }, [i18n.language, i18n.dateFNS])

  return (
    <div className={classes} id={id}>
      <div className={`${baseClass}__icon-wrap`}>
        {dateTimePickerProps.selected && (
          <button
            className={`${baseClass}__clear-button`}
            onClick={() => onChange(null)}
            type="button"
          >
            <XIcon />
          </button>
        )}
        <CalendarIcon />
      </div>
      <div className={`${baseClass}__input-wrapper`}>
        <ReactDatePicker
          {...dateTimePickerProps}
          dropdownMode="select"
          showMonthDropdown
          showYearDropdown
        />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-restricted-exports
export default DatePicker
```

--------------------------------------------------------------------------------

---[FILE: getFormattedLocale.ts]---
Location: payload-main/packages/ui/src/elements/DatePicker/getFormattedLocale.ts

```typescript
'use client'
export const getFormattedLocale = (language = 'enUS') => {
  const formattedLocales = {
    en: 'enUS',
    my: 'enUS', // Burmese is not currently supported
    ua: 'uk',
    zh: 'zhCN',
  }

  const formattedLocale = formattedLocales[language] || language

  return formattedLocale
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/DatePicker/index.scss

```text
@import '../../scss/styles';

$cal-icon-width: 18px;

@layer payload-default {
  [dir='rtl'] {
    .date-time-picker {
      .react-datepicker__input-container input {
        padding-right: base(3.4);
      }
    }
  }

  .date-time-picker {
    .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box,
    .react-datepicker__time-container {
      width: 120px;
    }

    &__icon-wrap {
      position: relative;
      z-index: 1;
    }

    .icon--calendar,
    &__clear-button {
      position: absolute;
    }

    .icon--calendar,
    .icon--x {
      @include color-svg(var(--theme-elevation-800));
      height: auto;
    }

    &__clear-button {
      top: base(0.5);
      right: base(2);
    }

    .icon--calendar {
      top: base(0.5);
      right: base(0.75);
      width: $cal-icon-width;
      pointer-events: none;
    }

    .icon--x {
      width: base(1);
    }

    &__clear-button {
      appearance: none;
      background-color: transparent;
      border: none;
      outline: none;
      padding: 0;
      display: flex;
      cursor: pointer;
    }

    &__appearance--timeOnly {
      .react-datepicker {
        width: 100%;

        &__month-container,
        &__navigation--previous,
        &__navigation--next {
          display: none;
          visibility: hidden;
        }

        &-popper,
        &__time-container,
        &__time-box {
          width: base(6);
        }

        &__time-container {
          .react-datepicker__time {
            .react-datepicker__time-box {
              width: 100%;
            }
          }
        }
      }
    }

    .react-datepicker-wrapper {
      display: block;
    }

    .react-datepicker-wrapper,
    .react-datepicker__input-container {
      width: 100%;
    }

    .react-datepicker__input-container input {
      @include formInput;
      padding-right: calc(#{base(0.75)} + #{$cal-icon-width});
    }

    &--has-error {
      .react-datepicker__input-container input {
        background-color: var(--theme-error-200);
      }
    }

    .react-datepicker {
      @include shadow-lg;
      border: 1px solid var(--theme-elevation-100);
      background: var(--theme-input-bg);
      display: inline-flex;
      font-family: var(--font-body);
      font-weight: 100;
      border-radius: 0;
      color: var(--theme-elevation-800);

      &__header {
        padding-top: 0;
        text-transform: none;
        text-align: center;
        border-radius: 0;
        border: none;
        background-color: var(--theme-input-bg);

        &--time {
          padding: 10px 0;
          border-bottom: 1px solid var(--theme-elevation-150);
          font-weight: 600;
        }
      }

      &__navigation {
        background: none;
        line-height: 1.7rem;
        text-align: center;
        cursor: pointer;
        position: absolute;
        top: 10px;
        width: 0;
        padding: 0;
        border: 0.45rem solid transparent;
        z-index: 1;
        height: 10px;
        width: 10px;
        text-indent: -999em;
        overflow: hidden;
        top: 15px;

        &--next {
          border-left-color: var(--theme-elevation-400);

          &:focus {
            border-left-color: var(--theme-elevation-500);
            outline: none;
          }
        }

        &--previous {
          border-right-color: var(--theme-elevation-400);

          &:focus {
            border-right-color: var(--theme-elevation-500);
            outline: none;
          }
        }
      }

      &__current-month,
      &__header,
      &-year-header,
      &__day-name,
      &__day,
      &__time-name,
      &-time__header {
        color: var(--theme-elevation-1000);
      }

      &__current-month {
        display: none;
      }

      &__header__dropdown,
      &-year-header {
        padding: 10px 0;
        font-weight: bold;
      }

      &__month-container {
        border-right: 1px solid var(--theme-elevation-150);
      }

      &__time,
      &__time-container,
      .react-datepicker__time-container .react-datepicker__time {
        background: none;
      }

      &__time-container {
        border-left: none;
      }

      &__month-text {
        padding: base(0.3);
        margin: base(0.15);
        font-size: base(0.55);
        &:hover {
          background: var(--theme-elevation-100);
        }
      }

      &__month-select,
      &__year-select {
        min-width: 70px;
        border: none;
        background: none;
        outline: none;
        cursor: pointer;

        option {
          background-color: var(--theme-elevation-50);
        }
      }

      &__day-names {
        background-color: var(--theme-elevation-100);
      }

      &__day {
        box-shadow: inset 0px 0px 0px 1px var(--theme-elevation-150);
        font-size: base(0.55);

        &:hover {
          background: var(--theme-elevation-100);
        }

        &:focus {
          outline: 0;
          background: var(--theme-elevation-400);
        }

        &--selected {
          font-weight: bold;

          &:focus {
            background-color: var(--theme-elevation-150);
          }
        }

        &--keyboard-selected {
          color: var(--theme-elevation-0);
          font-weight: bold;

          &:focus {
            background-color: var(--theme-elevation-150);
            box-shadow:
              inset 0px 0px 0px 1px var(--theme-elevation-800),
              0px 0px 0px 1px var(--theme-elevation-800);
          }
        }

        &--today {
          font-weight: bold;
        }
      }

      &__day,
      &__day-name {
        width: base(1.5);
        margin: base(0.15);
        line-height: base(1.25);
      }
    }

    .react-datepicker-popper {
      z-index: 10;
      border: none;
    }

    .react-datepicker__time-container
      .react-datepicker__time
      .react-datepicker__time-box
      ul.react-datepicker__time-list {
      max-height: 100%;
    }

    .react-datepicker__day--keyboard-selected,
    .react-datepicker__month-text--keyboard-selected,
    .react-datepicker__time-container
      .react-datepicker__time
      .react-datepicker__time-box
      ul.react-datepicker__time-list
      li.react-datepicker__time-list-item--selected {
      box-shadow: none;
      background-color: var(--theme-elevation-150);
      font-weight: bold;
      color: var(--theme-elevation-800);
      border-radius: 0;
    }

    .react-datepicker__time-container
      .react-datepicker__time
      .react-datepicker__time-box
      ul.react-datepicker__time-list
      li.react-datepicker__time-list-item--selected,
    .react-datepicker__day--selected,
    .react-datepicker__day--in-selecting-range,
    .react-datepicker__day--in-range,
    .react-datepicker__month-text--selected,
    .react-datepicker__month-text--in-selecting-range,
    .react-datepicker__month-text--in-range {
      box-shadow: none;
      background-color: var(--theme-elevation-150);
      color: var(--theme-elevation-800);
      font-weight: bold;
      border-radius: 0;
    }

    .react-datepicker__time-container
      .react-datepicker__time
      .react-datepicker__time-box
      ul.react-datepicker__time-list
      li.react-datepicker__time-list-item:hover {
      background: var(--theme-elevation-100);
    }

    .react-datepicker__day:hover,
    .react-datepicker__month-text:hover {
      border-radius: 0;
    }

    .react-datepicker__month .react-datepicker__day {
      &.react-datepicker__day--disabled {
        color: var(--theme-elevation-200);

        &:hover {
          background: none;
        }
      }
    }

    .react-datepicker__navigation--next--with-time:not(
        .react-datepicker__navigation--next--with-today-button
      ) {
      right: 130px;
    }

    .react-datepicker__time-container
      .react-datepicker__time
      .react-datepicker__time-box
      ul.react-datepicker__time-list
      li.react-datepicker__time-list-item {
      line-height: 20px;
      font-size: base(0.5);

      &.react-datepicker__time-list-item--disabled {
        color: var(--theme-elevation-200);
        &:hover {
          background: none;
        }
      }
    }

    &__appearance--dayOnly,
    &__appearance--monthOnly {
      .react-datepicker {
        &__month-container {
          border-right: none;
        }
      }
    }

    @include small-break {
      .react-datepicker {
        flex-direction: column;
      }
      .react-datepicker__month-container {
        border-right: 0;
      }
      .react-datepicker__time-container {
        width: auto;
      }
      .react-datepicker__header--time {
        background-color: var(--theme-elevation-100);
        padding: 8px 0;
        border-bottom: none;
      }
      .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
        height: 120px;
        width: unset;
        > ul {
          height: 120px;
        }
      }
      .react-datepicker__navigation--next--with-time:not(
          .react-datepicker__navigation--next--with-today-button
        ) {
        right: 0px;
      }
      &__input-wrapper {
        .icon {
          top: calc(50% - #{base(0.25)});
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/DatePicker/index.tsx
Signals: React

```typescript
'use client'
import React, { lazy, Suspense } from 'react'

import type { Props } from './types.js'

import { ShimmerEffect } from '../ShimmerEffect/index.js'

const DatePicker = lazy(() => import('./DatePicker.js'))

export const DatePickerField: React.FC<Props> = (props) => (
  <Suspense fallback={<ShimmerEffect height={50} />}>
    <DatePicker {...props} />
  </Suspense>
)
```

--------------------------------------------------------------------------------

````
