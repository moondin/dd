---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 362
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 362 of 695)

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
Location: payload-main/packages/ui/src/elements/Button/types.ts
Signals: React

```typescript
import type { ElementType, MouseEvent } from 'react'
import type React from 'react'

type secondaryAction = {
  label: string
  onClick: (event: MouseEvent) => void
}

export type Props = {
  'aria-label'?: string
  buttonId?: string
  buttonStyle?:
    | 'error'
    | 'icon-label'
    | 'none'
    | 'pill'
    | 'primary'
    | 'secondary'
    | 'subtle'
    | 'tab'
    | 'transparent'
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  el?: 'anchor' | 'link' | ElementType
  /**
   * Setting to `true` will allow the submenu to be opened when the button is disabled
   */
  enableSubMenu?: boolean
  extraButtonProps?: Record<string, any>
  icon?: ['chevron' | 'edit' | 'plus' | 'x'] | React.ReactNode
  iconPosition?: 'left' | 'right'
  iconStyle?: 'none' | 'with-border' | 'without-border'
  id?: string
  /**
   * @deprecated
   * This prop is deprecated and will be removed in the next major version.
   * Components now import their own `Link` directly from `next/link`.
   */
  Link?: React.ElementType
  margin?: boolean
  newTab?: boolean
  onClick?: (event: MouseEvent) => void
  onMouseDown?: (event: MouseEvent) => void
  /**
   * Enables form submission via an onClick handler. This is only needed if
   * type="submit" does not trigger form submission, e.g. if the button DOM
   * element is not a direct child of the form element.
   *
   * @default false
   */
  programmaticSubmit?: boolean
  ref?: React.RefObject<HTMLAnchorElement | HTMLButtonElement | null>
  round?: boolean
  secondaryActions?: secondaryAction | secondaryAction[]
  size?: 'large' | 'medium' | 'small' | 'xsmall'
  SubMenuPopupContent?: (props: { close: () => void }) => React.ReactNode
  to?: string
  tooltip?: string
  type?: 'button' | 'submit'
  url?: string
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Card/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .card {
    background: var(--theme-elevation-50);
    padding: base(0.8);
    width: 100%;
    min-height: base(4);
    position: relative;
    border-radius: var(--style-radius-m);
    border: 1px solid var(--theme-border-color);
    transition-property: border, box-shadow, background;
    transition-duration: 100ms;
    transition-timing-function: cubic-bezier(0, 0.2, 0.2, 1);
    display: flex;
    justify-content: space-between;
    align-self: start;
    gap: base(0.8);

    &__title {
      @extend %h5;
      letter-spacing: 0;
      font-weight: 600;
      line-height: base(0.8);
      width: 100%;
      margin: base(0.1) 0;
    }

    &__actions {
      position: relative;
      z-index: 2;
      display: inline-flex;
      .btn {
        margin: 0;
        flex-shrink: 0;
      }

      .btn__icon {
        border: 1px solid var(--theme-border-color);
        transition-property: border, box-shadow, color, background;
        transition-duration: 100ms;
        transition-timing-function: cubic-bezier(0, 0.2, 0.2, 1);

        &:hover {
          border: 1px solid var(--theme-elevation-500);
          background-color: var(--theme-elevation-0);
          color: currentColor;
          @include shadow-sm;
        }
      }
    }

    &--has-onclick {
      cursor: pointer;

      &:hover {
        background: var(--theme-elevation-50);
        border: 1px solid var(--theme-elevation-250);
        box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.05);
      }
    }

    &__click {
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      margin: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Card/index.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { Button } from '../Button/index.js'
import './index.scss'

export type Props = {
  actions?: React.ReactNode
  buttonAriaLabel?: string
  href?: string
  id?: string
  /**
   * @deprecated
   * This prop is deprecated and will be removed in the next major version.
   * Components now import their own `Link` directly from `next/link`.
   */
  Link?: React.ElementType
  onClick?: () => void
  title: string
  titleAs?: React.ElementType
}

const baseClass = 'card'

export const Card: React.FC<Props> = (props) => {
  const { id, actions, buttonAriaLabel, href, onClick, title, titleAs } = props

  const classes = [baseClass, id, (onClick || href) && `${baseClass}--has-onclick`]
    .filter(Boolean)
    .join(' ')

  const Tag = titleAs ?? 'div'

  return (
    <div className={classes} id={id}>
      <Tag className={`${baseClass}__title`}>{title}</Tag>
      {actions && <div className={`${baseClass}__actions`}>{actions}</div>}
      {(onClick || href) && (
        <Button
          aria-label={buttonAriaLabel}
          buttonStyle="none"
          className={`${baseClass}__click`}
          el="link"
          onClick={onClick}
          to={href}
        />
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/CheckboxPopup/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .checkbox-popup {
    &__options {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) * 0.5);
      padding: 0 3px;
    }

    .checkbox-input {
      align-items: center;
      label {
        padding-bottom: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/CheckboxPopup/index.tsx

```typescript
import type { PopupProps } from '../Popup/index.js'

import { CheckboxInput } from '../../fields/Checkbox/Input.js'
import { Popup } from '../Popup/index.js'
import './index.scss'

const baseClass = 'checkbox-popup'

type CheckboxPopupProps = {
  Button: React.ReactNode
  onChange: (args: { close: () => void; selectedValues: string[] }) => void
  options: {
    label: string
    value: string
  }[]
  selectedValues: string[]
} & Omit<PopupProps, 'button' | 'render'>
export function CheckboxPopup({
  Button,
  className,
  onChange,
  options,
  selectedValues,
  ...popupProps
}: CheckboxPopupProps) {
  return (
    <Popup
      button={Button}
      className={[baseClass, className].filter(Boolean).join(' ')}
      horizontalAlign="right"
      render={({ close }) => (
        <div className={`${baseClass}__options`}>
          {options.map(({ label, value }) => (
            <CheckboxInput
              checked={selectedValues?.includes(value)}
              key={value}
              label={label}
              onToggle={() => {
                const newSelectedValues = selectedValues?.includes(value)
                  ? selectedValues.filter((v) => v !== value)
                  : [...selectedValues, value]
                onChange({ close, selectedValues: newSelectedValues })
              }}
            />
          ))}
        </div>
      )}
      showScrollbar
      verticalAlign="bottom"
      {...popupProps}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: ClipboardActionLabel.tsx]---
Location: payload-main/packages/ui/src/elements/ClipboardAction/ClipboardActionLabel.tsx
Signals: React

```typescript
'use client'

import { Fragment } from 'react'

import { CopyIcon } from '../../icons/Copy/index.js'
import { EditIcon } from '../../icons/Edit/index.js'
import { useTranslation } from '../../providers/Translation/index.js'

export const ClipboardActionLabel = ({
  isPaste,
  isRow,
}: {
  isPaste?: boolean
  isRow?: boolean
}) => {
  const { t } = useTranslation()

  let label = t('general:copyField')
  if (!isRow && isPaste) {
    label = t('general:pasteField')
  } else if (isRow && !isPaste) {
    label = t('general:copyRow')
  } else if (isRow && isPaste) {
    label = t('general:pasteRow')
  }

  return (
    <Fragment>
      {isPaste ? <EditIcon /> : <CopyIcon />} {label}
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: clipboardUtilities.ts]---
Location: payload-main/packages/ui/src/elements/ClipboardAction/clipboardUtilities.ts

```typescript
import type {
  ClipboardCopyActionArgs,
  ClipboardPasteActionArgs,
  ClipboardPasteActionValidateArgs,
  ClipboardPasteData,
} from './types.js'

import { isClipboardDataValid } from './isClipboardDataValid.js'

const localStorageClipboardKey = '_payloadClipboard'

/**
 * @note This function doesn't use the Clipboard API, but localStorage. See rationale in #11513
 */
export function clipboardCopy(args: ClipboardCopyActionArgs): string | true {
  const { getDataToCopy, t, ...rest } = args

  const dataToWrite = {
    data: getDataToCopy(),
    ...rest,
  }

  try {
    localStorage.setItem(localStorageClipboardKey, JSON.stringify(dataToWrite))
    return true
  } catch (_err) {
    return t('error:unableToCopy')
  }
}

/**
 * @note This function doesn't use the Clipboard API, but localStorage. See rationale in #11513
 */
export function clipboardPaste({
  onPaste,
  path: fieldPath,
  t,
  ...args
}: ClipboardPasteActionArgs): string | true {
  let dataToPaste: ClipboardPasteData

  try {
    const jsonFromClipboard = localStorage.getItem(localStorageClipboardKey)

    if (!jsonFromClipboard) {
      return t('error:invalidClipboardData')
    }

    dataToPaste = JSON.parse(jsonFromClipboard)
  } catch (_err) {
    return t('error:invalidClipboardData')
  }

  const dataToValidate = {
    ...dataToPaste,
    ...args,
    fieldPath,
  } as ClipboardPasteActionValidateArgs

  if (!isClipboardDataValid(dataToValidate)) {
    return t('error:invalidClipboardData')
  }

  onPaste(dataToPaste)

  return true
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ClipboardAction/index.tsx
Signals: React

```typescript
'use client'

import type { FormStateWithoutComponents } from 'payload'

import { type FC, useCallback } from 'react'
import { toast } from 'sonner'

import type { ClipboardCopyData, OnPasteFn } from './types.js'

import { MoreIcon } from '../../icons/More/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Popup, PopupList } from '../Popup/index.js'
import { ClipboardActionLabel } from './ClipboardActionLabel.js'
import { clipboardCopy, clipboardPaste } from './clipboardUtilities.js'

const baseClass = 'clipboard-action'

type Props = {
  allowCopy?: boolean
  allowPaste?: boolean
  className?: string
  copyClassName?: string
  disabled?: boolean
  getDataToCopy: () => FormStateWithoutComponents
  isRow?: boolean
  onPaste: OnPasteFn
  pasteClassName?: string
} & ClipboardCopyData

/**
 * Menu actions for copying and pasting fields. Currently, this is only used in Arrays and Blocks.
 * @note This component doesn't use the Clipboard API, but localStorage. See rationale in #11513
 */
export const ClipboardAction: FC<Props> = ({
  allowCopy,
  allowPaste,
  className,
  copyClassName,
  disabled,
  isRow,
  onPaste,
  pasteClassName,
  path,
  ...rest
}) => {
  const { t } = useTranslation()

  const classes = [`${baseClass}__popup`, className].filter(Boolean).join(' ')

  const handleCopy = useCallback(() => {
    const clipboardResult = clipboardCopy({
      path,
      t,
      ...rest,
    })

    if (typeof clipboardResult === 'string') {
      toast.error(clipboardResult)
    } else {
      toast.success(t('general:copied'))
    }
  }, [t, rest, path])

  const handlePaste = useCallback(() => {
    const clipboardResult = clipboardPaste(
      rest.type === 'array'
        ? {
            onPaste,
            path,
            schemaFields: rest.fields,
            t,
          }
        : {
            onPaste,
            path,
            schemaBlocks: rest.blocks,
            t,
          },
    )

    if (typeof clipboardResult === 'string') {
      toast.error(clipboardResult)
    }
  }, [onPaste, rest, path, t])

  if (!allowPaste && !allowCopy) {
    return null
  }

  return (
    <Popup
      button={<MoreIcon />}
      className={classes}
      disabled={disabled}
      horizontalAlign="center"
      render={({ close }) => (
        <PopupList.ButtonGroup>
          <PopupList.Button
            className={copyClassName}
            disabled={!allowCopy}
            onClick={() => {
              void handleCopy()
              close()
            }}
          >
            <ClipboardActionLabel isRow={isRow} />
          </PopupList.Button>
          <PopupList.Button
            className={pasteClassName}
            disabled={!allowPaste}
            onClick={() => {
              void handlePaste()
              close()
            }}
          >
            <ClipboardActionLabel isPaste isRow={isRow} />
          </PopupList.Button>
        </PopupList.ButtonGroup>
      )}
      size="large"
      verticalAlign="bottom"
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: isClipboardDataValid.ts]---
Location: payload-main/packages/ui/src/elements/ClipboardAction/isClipboardDataValid.ts

```typescript
import type { ClientBlock, ClientField } from 'payload'

import { fieldAffectsData, fieldHasSubFields } from 'payload/shared'

import type { ClipboardPasteActionValidateArgs } from './types.js'

/**
 * Validates whether clipboard data is compatible with the target schema.
 * For this to be true, the copied field and the target to be pasted must
 * be structurally equivalent (same schema)
 *
 * @returns True if the clipboard data is valid and can be pasted, false otherwise
 */
export function isClipboardDataValid({ data, path, ...args }: ClipboardPasteActionValidateArgs) {
  if (typeof data === 'undefined' || !path || !args.type) {
    return false
  }

  if (args.type === 'blocks') {
    return isClipboardBlocksValid({
      blocksFromClipboard: args.blocks,
      blocksFromConfig: args.schemaBlocks,
    })
  } else {
    return isClipboardFieldsValid({
      fieldsFromClipboard: args.fields,
      fieldsFromConfig: args.schemaFields,
    })
  }
}

function isClipboardFieldsValid({
  fieldsFromClipboard,
  fieldsFromConfig,
}: {
  fieldsFromClipboard: ClientField[]
  fieldsFromConfig?: ClientField[]
}): boolean {
  if (!fieldsFromConfig || fieldsFromClipboard.length !== fieldsFromConfig?.length) {
    return false
  }

  return fieldsFromClipboard.every((clipboardField, i) => {
    const configField = fieldsFromConfig[i]

    if (clipboardField.type !== configField.type) {
      return false
    }

    const affectsData = fieldAffectsData(clipboardField) && fieldAffectsData(configField)
    if (affectsData && clipboardField.name !== configField.name) {
      return false
    }

    const hasNestedFieldsConfig = fieldHasSubFields(configField)
    const hasNestedFieldsClipboard = fieldHasSubFields(clipboardField)
    if (hasNestedFieldsClipboard !== hasNestedFieldsConfig) {
      return false
    }

    if (hasNestedFieldsClipboard && hasNestedFieldsConfig) {
      return isClipboardFieldsValid({
        fieldsFromClipboard: clipboardField.fields,
        fieldsFromConfig: configField.fields,
      })
    }

    return true
  })
}

function isClipboardBlocksValid({
  blocksFromClipboard,
  blocksFromConfig,
}: {
  blocksFromClipboard: ClientBlock[]
  blocksFromConfig?: ClientBlock[]
}) {
  const configBlockMap = new Map(blocksFromConfig?.map((block) => [block.slug, block]))

  if (!configBlockMap.size) {
    return false
  }

  const checkedSlugs = new Set<string>()

  for (const currBlock of blocksFromClipboard) {
    const currSlug = currBlock.slug

    if (!checkedSlugs.has(currSlug)) {
      const configBlock = configBlockMap.get(currSlug)
      if (!configBlock) {
        return false
      }

      if (
        !isClipboardFieldsValid({
          fieldsFromClipboard: currBlock.fields,
          fieldsFromConfig: configBlock.fields,
        })
      ) {
        return false
      }

      checkedSlugs.add(currSlug)
    }
  }
  return true
}
```

--------------------------------------------------------------------------------

---[FILE: mergeFormStateFromClipboard.ts]---
Location: payload-main/packages/ui/src/elements/ClipboardAction/mergeFormStateFromClipboard.ts

```typescript
import type { FieldState, FormState } from 'payload'

import type { ClipboardPasteData } from './types.js'

export function reduceFormStateByPath({
  formState,
  path,
  rowIndex,
}: {
  formState: FormState
  path: string
  rowIndex?: number
}) {
  const filteredState: Record<string, FieldState> = {}
  const prefix = typeof rowIndex !== 'number' ? path : `${path}.${rowIndex}`

  for (const key in formState) {
    if (!key.startsWith(prefix)) {
      continue
    }

    const { customComponents: _, validate: __, ...field } = formState[key]

    if (Array.isArray(field.rows)) {
      field.rows = field.rows.map((row) => {
        if (!row || typeof row !== 'object') {
          return row
        }
        const { customComponents: _, ...serializableRow } = row
        return serializableRow
      })
    }

    filteredState[key] = field
  }

  return filteredState
}

export function mergeFormStateFromClipboard({
  dataFromClipboard: clipboardData,
  formState,
  path,
  rowIndex,
}: {
  dataFromClipboard: ClipboardPasteData
  formState: FormState
  path: string
  rowIndex?: number
}) {
  const {
    type: typeFromClipboard,
    data: dataFromClipboard,
    path: pathFromClipboard,
    rowIndex: rowIndexFromClipboard,
  } = clipboardData

  const copyFromField = typeof rowIndexFromClipboard !== 'number'
  const pasteIntoField = typeof rowIndex !== 'number'
  const fromRowToField = !copyFromField && pasteIntoField
  const isArray = typeFromClipboard === 'array'

  let pathToReplace: string
  if (copyFromField && pasteIntoField) {
    pathToReplace = pathFromClipboard
  } else if (copyFromField) {
    pathToReplace = `${pathFromClipboard}.${rowIndex}`
  } else {
    pathToReplace = `${pathFromClipboard}.${rowIndexFromClipboard}`
  }

  let targetSegment: string
  if (!pasteIntoField) {
    targetSegment = `${path}.${rowIndex}`
  } else if (fromRowToField) {
    targetSegment = `${path}.0`
  } else {
    targetSegment = path
  }

  if (fromRowToField) {
    const lastRenderedPath = `${path}.0`
    const rowIDFromClipboard = dataFromClipboard[`${pathToReplace}.id`].value as string
    const hasRows = formState[path].rows?.length

    formState[path].rows = [
      {
        ...(hasRows && isArray ? formState[path].rows[0] : {}),
        id: rowIDFromClipboard,
        isLoading: false,
        lastRenderedPath,
      },
    ]
    formState[path].value = 1
    formState[path].initialValue = 1
    formState[path].disableFormData = true

    for (const fieldPath in formState) {
      if (
        fieldPath !== path &&
        !fieldPath.startsWith(lastRenderedPath) &&
        fieldPath.startsWith(path)
      ) {
        delete formState[fieldPath]
      }
    }
  }

  for (const clipboardPath in dataFromClipboard) {
    // Pasting a row id, skip overwriting
    if (
      (!pasteIntoField && clipboardPath.endsWith('.id')) ||
      !clipboardPath.startsWith(pathToReplace)
    ) {
      continue
    }

    const newPath = clipboardPath.replace(pathToReplace, targetSegment)

    const customComponents = isArray ? formState[newPath]?.customComponents : undefined
    const validate = isArray ? formState[newPath]?.validate : undefined

    formState[newPath] = {
      customComponents,
      validate,
      ...dataFromClipboard[clipboardPath],
    }
  }

  return formState
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/ClipboardAction/types.ts

```typescript
import type { TFunction } from '@payloadcms/translations'
import type { ClientBlock, ClientField, FormStateWithoutComponents } from 'payload'

export type ClipboardCopyBlocksSchema = {
  schemaBlocks: ClientBlock[]
}

export type ClipboardCopyBlocksData = {
  blocks: ClientBlock[]
  type: 'blocks'
}

export type ClipboardCopyFieldsSchema = {
  schemaFields: ClientField[]
}

export type ClipboardCopyFieldsData = {
  fields: ClientField[]
  type: 'array'
}

export type ClipboardCopyData = {
  path: string
  rowIndex?: number
} & (ClipboardCopyBlocksData | ClipboardCopyFieldsData)

export type ClipboardCopyActionArgs = {
  getDataToCopy: () => FormStateWithoutComponents
  t: TFunction
} & ClipboardCopyData

export type ClipboardPasteData = {
  data: FormStateWithoutComponents
  path: string
  rowIndex?: number
} & (ClipboardCopyBlocksData | ClipboardCopyFieldsData)

export type OnPasteFn = (data: ClipboardPasteData) => void

export type ClipboardPasteActionArgs = {
  onPaste: OnPasteFn
  path: string
  t: TFunction
} & (ClipboardCopyBlocksSchema | ClipboardCopyFieldsSchema)

export type ClipboardPasteActionValidateArgs = {
  fieldPath: string
} & (
  | {
      schemaBlocks: ClientBlock[]
      type: 'blocks'
    }
  | {
      schemaFields: ClientField[]
      type: 'array'
    }
) &
  ClipboardPasteData
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/CloseModalButton/index.scss

```text
.close-modal-button {
  flex-shrink: 0;
  border: 0;
  background-color: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
  overflow: hidden;
  width: var(--base);
  height: var(--base);
  align-self: flex-start;

  svg {
    width: calc(var(--base) * 2);
    height: calc(var(--base) * 2);
    position: relative;
    inset-inline-start: calc(var(--base) * -0.5);
    top: calc(var(--base) * -0.5);

    .stroke {
      stroke-width: 2px;
      vector-effect: non-scaling-stroke;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/CloseModalButton/index.tsx

```typescript
import { useModal } from '@faceless-ui/modal'

import { XIcon } from '../../icons/X/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'close-modal-button'

export function CloseModalButton({ slug, className }: { className?: string; slug: string }) {
  const { closeModal } = useModal()
  const { t } = useTranslation()

  return (
    <button
      aria-label={t('general:close')}
      className={[baseClass, className].filter(Boolean).join(' ')}
      key="close-button"
      onClick={() => {
        closeModal(slug)
      }}
      type="button"
    >
      <XIcon />
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/CloseModalOnRouteChange/index.tsx
Signals: React, Next.js

```typescript
'use client'

import { useModal } from '@faceless-ui/modal'
import { usePathname } from 'next/navigation.js'
import { useEffect, useRef } from 'react'

import { useEffectEvent } from '../../hooks/useEffectEvent.js'

export function CloseModalOnRouteChange() {
  const { closeAllModals } = useModal()
  const pathname = usePathname()

  const closeAllModalsEffectEvent = useEffectEvent(() => {
    closeAllModals()
  })

  const initialRenderRef = useRef(true)

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }

    closeAllModalsEffectEvent()
  }, [pathname])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: CodeEditor.tsx]---
Location: payload-main/packages/ui/src/elements/CodeEditor/CodeEditor.tsx
Signals: React

```typescript
'use client'
import EditorImport from '@monaco-editor/react'
import React, { useState } from 'react'

import type { Props } from './types.js'

import { useTheme } from '../../providers/Theme/index.js'
import { ShimmerEffect } from '../ShimmerEffect/index.js'
import { defaultGlobalEditorOptions, defaultOptions } from './constants.js'
import './index.scss'

const Editor = 'default' in EditorImport ? EditorImport.default : EditorImport

const baseClass = 'code-editor'

const CodeEditor: React.FC<Props> = (props) => {
  const {
    className,
    maxHeight,
    minHeight,
    options,
    readOnly,
    recalculatedHeightAt,
    value,
    ...rest
  } = props
  const MIN_HEIGHT = minHeight ?? 56 // equivalent to 3 lines
  const prevCalculatedHeightAt = React.useRef<number | undefined>(recalculatedHeightAt)

  // Extract per-model settings to avoid global conflicts
  const { insertSpaces, tabSize, trimAutoWhitespace, ...globalEditorOptions } = options || {}
  const paddingFromProps = options?.padding
    ? (options.padding.top || 0) + (options.padding?.bottom || 0)
    : 0

  const [dynamicHeight, setDynamicHeight] = useState(MIN_HEIGHT)
  const { theme } = useTheme()

  const classes = [
    baseClass,
    className,
    rest?.defaultLanguage ? `language--${rest.defaultLanguage}` : '',
    readOnly && 'read-only',
  ]
    .filter(Boolean)
    .join(' ')

  React.useEffect(() => {
    if (recalculatedHeightAt && recalculatedHeightAt > prevCalculatedHeightAt.current) {
      setDynamicHeight(
        value
          ? Math.max(MIN_HEIGHT, value.split('\n').length * 18 + 2 + paddingFromProps)
          : MIN_HEIGHT,
      )
      prevCalculatedHeightAt.current = recalculatedHeightAt
    }
  }, [value, MIN_HEIGHT, paddingFromProps, recalculatedHeightAt])

  return (
    <Editor
      className={classes}
      height={maxHeight ? Math.min(dynamicHeight, maxHeight) : dynamicHeight}
      loading={<ShimmerEffect height={dynamicHeight} />}
      options={{
        ...defaultGlobalEditorOptions,
        ...globalEditorOptions,
        readOnly: Boolean(readOnly),
        /**
         * onMount the model will set:
         * - insertSpaces
         * - tabSize
         * - trimAutoWhitespace
         */
        detectIndentation: false,
        insertSpaces: undefined,
        tabSize: undefined,
        trimAutoWhitespace: undefined,
      }}
      theme={theme === 'dark' ? 'vs-dark' : 'vs'}
      value={value}
      {...rest}
      // Since we are not building an IDE and the container
      // can already have scrolling, we want the height of the
      // editor to fit its content.
      // See: https://github.com/microsoft/monaco-editor/discussions/3677
      onChange={(value, ev) => {
        rest.onChange?.(value, ev)
        setDynamicHeight(
          value
            ? Math.max(MIN_HEIGHT, value.split('\n').length * 18 + 2 + paddingFromProps)
            : MIN_HEIGHT,
        )
      }}
      onMount={(editor, monaco) => {
        rest.onMount?.(editor, monaco)

        // Set per-model options to avoid global conflicts
        const model = editor.getModel()
        if (model) {
          model.updateOptions({
            insertSpaces: insertSpaces ?? defaultOptions.insertSpaces,
            tabSize: tabSize ?? defaultOptions.tabSize,
            trimAutoWhitespace: trimAutoWhitespace ?? defaultOptions.trimAutoWhitespace,
          })
        }

        setDynamicHeight(
          Math.max(MIN_HEIGHT, editor.getValue().split('\n').length * 18 + 2 + paddingFromProps),
        )
      }}
    />
  )
}

// eslint-disable-next-line no-restricted-exports
export default CodeEditor
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: payload-main/packages/ui/src/elements/CodeEditor/constants.ts

```typescript
import type { EditorProps } from '@monaco-editor/react'

export const defaultOptions: Pick<
  EditorProps['options'],
  'insertSpaces' | 'tabSize' | 'trimAutoWhitespace'
> = {
  insertSpaces: false,
  tabSize: 4,
  trimAutoWhitespace: false,
}

export const defaultGlobalEditorOptions: Omit<
  EditorProps['options'],
  'detectIndentation' | 'insertSpaces' | 'tabSize' | 'trimAutoWhitespace'
> = {
  hideCursorInOverviewRuler: true,
  minimap: {
    enabled: false,
  },
  overviewRulerBorder: false,
  readOnly: false,
  scrollbar: {
    alwaysConsumeMouseWheel: false,
  },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/CodeEditor/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .code-editor {
    direction: ltr;
    @include formInput;
    height: auto;
    padding: 0;

    .monaco-editor {
      .view-overlays .current-line {
        max-width: calc(100% - 14px);
        border-width: 0px;
      }

      &:focus-within {
        .view-overlays .current-line {
          border-right: 0;
          border-width: 1px;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/CodeEditor/index.tsx
Signals: React

```typescript
'use client'
import React, { lazy, Suspense } from 'react'

import type { Props } from './types.js'

import { ShimmerEffect } from '../ShimmerEffect/index.js'

const LazyEditor = lazy(() => import('./CodeEditor.js'))

export type { Props }

export const CodeEditor: React.FC<Props> = (props) => {
  return (
    <Suspense fallback={<ShimmerEffect />}>
      <LazyEditor {...props} />
    </Suspense>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/CodeEditor/types.ts

```typescript
import type { EditorProps } from '@monaco-editor/react'

export type Props = {
  maxHeight?: number
  /**
   * @default 56 (3 lines)
   */
  minHeight?: number
  readOnly?: boolean
  recalculatedHeightAt?: number
} & EditorProps
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Collapsible/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .collapsible {
    position: relative;
    --toggle-pad-h: #{base(0.75)};
    --toggle-pad-v: #{base(0.6)};

    border-radius: $style-radius-m;

    &__toggle-wrap {
      position: relative;
      padding: base(0.4) base(0.4) base(0.4) base(0.8);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--theme-elevation-50);
      line-height: base(1.2);
      gap: base(0.2);
      border-top-right-radius: $style-radius-m;
      border-top-left-radius: $style-radius-m;
      width: 100%;

      &:not(.toggle-disabled):hover {
        background: var(--theme-elevation-100);
      }

      &:has(.collapsible__drag) {
        padding-inline-start: base(0.4);
      }
    }

    &__drag {
      display: flex;
      opacity: 0.5;
      top: var(--toggle-pad-v);
      width: base(1.2);
      height: base(1.2);
      padding: base(0.1);

      icon {
        width: 100%;
        height: 100%;
      }
    }

    &__toggle {
      @extend %btn-reset;
      @extend %body;
      text-align: left;
      border-top-right-radius: $style-radius-m;
      border-top-left-radius: $style-radius-m;
      width: 100%;
      height: 100%;
      color: transparent;
      position: absolute;
      top: 0;
      left: 0;

      &:not(.toggle-disabled) {
        cursor: pointer;
      }

      span {
        user-select: none;
      }
    }

    &--style-default {
      border: 1px solid var(--theme-elevation-200);
      &:hover {
        border: 1px solid var(--theme-elevation-300);
      }

      > .collapsible__toggle-wrap {
        .row-label {
          color: var(--theme-text);
        }
      }
    }

    &--style-error {
      border: 1px solid var(--theme-error-400);
      > .collapsible__toggle-wrap {
        background-color: var(--theme-error-100);

        &:hover {
          background: var(--theme-error-150);
        }

        .row-label {
          color: var(--theme-error-950);
        }
      }
    }

    &__header-wrap {
      top: 0;
      right: base(3);
      bottom: 0;
      left: 0;
      pointer-events: none;
      width: 100%;
      overflow: hidden;
      max-width: 100%;
    }

    &__header-wrap--has-drag-handle {
      left: base(1);
    }

    &--collapsed {
      .collapsible__toggle-wrap {
        border-bottom-right-radius: $style-radius-m;
        border-bottom-left-radius: $style-radius-m;
      }
    }

    &__actions-wrap {
      pointer-events: none;
      display: flex;
      gap: base(0.2);
      margin-inline-end: base(0.2);
    }

    &__actions {
      pointer-events: all;
      display: flex;
      align-items: center;
      justify-content: center;
      width: base(1.2);
      height: base(1.2);

      &.icon {
        padding: base(0.1);
      }
    }

    &__indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      width: base(1.2);
      height: base(1.2);

      &.icon {
        padding: base(0.1);
      }
    }

    &__content {
      background-color: var(--theme-elevation-0);
      border-bottom-left-radius: $style-radius-m;
      border-bottom-right-radius: $style-radius-m;
      padding: var(--base);
    }

    @include small-break {
      &__content {
        padding: var(--gutter-h);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Collapsible/index.tsx
Signals: React

```typescript
'use client'
import React, { useState } from 'react'

import type { DragHandleProps } from '../DraggableSortable/DraggableSortableItem/types.js'

import { ChevronIcon } from '../../icons/Chevron/index.js'
import { DragHandleIcon } from '../../icons/DragHandle/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import './index.scss'
import { AnimateHeight } from '../AnimateHeight/index.js'
import { CollapsibleProvider, useCollapsible } from './provider.js'

const baseClass = 'collapsible'

export { CollapsibleProvider, useCollapsible }

export type CollapsibleProps = {
  actions?: React.ReactNode
  /**
   * Components that will be rendered within the collapsible provider but after the wrapper.
   */
  AfterCollapsible?: React.ReactNode
  children: React.ReactNode
  className?: string
  collapsibleStyle?: 'default' | 'error'
  /**
   * If set to true, clicking on the collapsible header will not toggle the collapsible state.
   * This is useful if the collapsible state is controlled externally (e.g. from a parent component or custom button).
   */
  disableHeaderToggle?: boolean
  /**
   * If set to true, the toggle indicator (chevron) on the right side of the header will be hidden.
   */
  disableToggleIndicator?: boolean
  dragHandleProps?: DragHandleProps
  header?: React.ReactNode
  initCollapsed?: boolean
  isCollapsed?: boolean
  onToggle?: (collapsed: boolean) => Promise<void> | void
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  actions,
  AfterCollapsible,
  children,
  className,
  collapsibleStyle = 'default',
  disableHeaderToggle = false,
  disableToggleIndicator = false,
  dragHandleProps,
  header,
  initCollapsed,
  isCollapsed: collapsedFromProps,
  onToggle,
}) => {
  const [collapsedLocal, setCollapsedLocal] = useState(Boolean(initCollapsed))
  const [hoveringToggle, setHoveringToggle] = useState(false)
  const { isWithinCollapsible } = useCollapsible()
  const { t } = useTranslation()

  const isCollapsed = typeof collapsedFromProps === 'boolean' ? collapsedFromProps : collapsedLocal

  const toggleCollapsible = React.useCallback(() => {
    if (typeof onToggle === 'function') {
      void onToggle(!isCollapsed)
    }
    setCollapsedLocal(!isCollapsed)
  }, [onToggle, isCollapsed])

  return (
    <div
      className={[
        baseClass,
        className,
        dragHandleProps && `${baseClass}--has-drag-handle`,
        isCollapsed && `${baseClass}--collapsed`,
        isWithinCollapsible && `${baseClass}--nested`,
        hoveringToggle && !disableHeaderToggle && `${baseClass}--hovered`,
        `${baseClass}--style-${collapsibleStyle}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <CollapsibleProvider isCollapsed={isCollapsed} toggle={toggleCollapsible}>
        <div
          className={`${baseClass}__toggle-wrap${disableHeaderToggle ? ' toggle-disabled' : ''}`}
          onMouseEnter={() => setHoveringToggle(true)}
          onMouseLeave={() => setHoveringToggle(false)}
        >
          {!disableHeaderToggle && (
            <button
              className={[
                `${baseClass}__toggle`,
                `${baseClass}__toggle--${isCollapsed ? 'collapsed' : 'open'}`,
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={toggleCollapsible}
              type="button"
            >
              <span>{t('fields:toggleBlock')}</span>
            </button>
          )}

          {dragHandleProps && (
            <div
              className={`${baseClass}__drag`}
              {...dragHandleProps.attributes}
              {...dragHandleProps.listeners}
            >
              <DragHandleIcon />
            </div>
          )}
          {header ? (
            <div
              className={[
                `${baseClass}__header-wrap`,
                dragHandleProps && `${baseClass}__header-wrap--has-drag-handle`,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {header}
            </div>
          ) : null}
          <div className={`${baseClass}__actions-wrap`}>
            {actions ? <div className={`${baseClass}__actions`}>{actions}</div> : null}
            {!disableToggleIndicator && (
              <div className={`${baseClass}__indicator`}>
                <ChevronIcon direction={!isCollapsed ? 'up' : undefined} />
              </div>
            )}
          </div>
        </div>
        <AnimateHeight height={isCollapsed ? 0 : 'auto'}>
          <div className={`${baseClass}__content`}>{children}</div>
        </AnimateHeight>
        {AfterCollapsible}
      </CollapsibleProvider>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: provider.tsx]---
Location: payload-main/packages/ui/src/elements/Collapsible/provider.tsx
Signals: React

```typescript
'use client'
import React, { createContext, use } from 'react'

type ContextType = {
  isCollapsed: boolean
  isVisible: boolean
  isWithinCollapsible: boolean
  toggle: () => void
}

const Context = createContext({
  isCollapsed: undefined,
  isVisible: undefined,
  isWithinCollapsible: undefined,
  toggle: () => {},
} as ContextType)

export const CollapsibleProvider: React.FC<{
  children?: React.ReactNode
  isCollapsed?: boolean
  isWithinCollapsible?: boolean
  toggle: () => void
}> = ({ children, isCollapsed, isWithinCollapsible = true, toggle }) => {
  const { isCollapsed: parentIsCollapsed, isVisible } = useCollapsible()

  const contextValue = React.useMemo((): ContextType => {
    return {
      isCollapsed,
      isVisible: isVisible && !parentIsCollapsed,
      isWithinCollapsible,
      toggle,
    }
  }, [isCollapsed, isWithinCollapsible, toggle, parentIsCollapsed, isVisible])

  return <Context value={contextValue}>{children}</Context>
}

export const useCollapsible = (): ContextType => use(Context)
```

--------------------------------------------------------------------------------

````
