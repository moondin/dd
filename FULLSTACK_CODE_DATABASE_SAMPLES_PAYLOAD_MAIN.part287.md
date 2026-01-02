---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 287
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 287 of 695)

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

---[FILE: DropDown.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/shared/ToolbarDropdown/DropDown.tsx
Signals: React

```typescript
'use client'
import { Button } from '@payloadcms/ui'
import { $addUpdateTag, isDOMNode, type LexicalEditor } from 'lexical'
import React, { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { ToolbarGroupItem } from '../../types.js'

const baseClass = 'toolbar-popup__dropdown-item'

interface DropDownContextType {
  registerItem: (ref: React.RefObject<HTMLButtonElement | null>) => void
}

const DropDownContext = React.createContext<DropDownContextType | null>(null)

export function DropDownItem({
  active,
  children,
  editor,
  enabled,
  Icon,
  item,
  itemKey,
  tooltip,
}: {
  active?: boolean
  children: React.ReactNode
  editor: LexicalEditor
  enabled?: boolean
  Icon: React.ReactNode
  item: ToolbarGroupItem
  itemKey: string
  tooltip?: string
}): React.ReactNode {
  const className = useMemo(() => {
    return [
      baseClass,
      enabled === false ? 'disabled' : '',
      active ? 'active' : '',
      item?.key ? `${baseClass}-${item.key}` : '',
    ]
      .filter(Boolean)
      .join(' ')
  }, [enabled, active, item.key])

  const ref = useRef<HTMLButtonElement>(null)

  const dropDownContext = React.use(DropDownContext)

  if (dropDownContext === null) {
    throw new Error('DropDownItem must be used within a DropDown')
  }

  const { registerItem } = dropDownContext

  useEffect(() => {
    if (ref?.current != null) {
      registerItem(ref)
    }
  }, [ref, registerItem])

  return (
    <Button
      aria-label={tooltip}
      buttonStyle="none"
      className={className}
      disabled={enabled === false}
      extraButtonProps={{
        'data-item-key': itemKey,
      }}
      icon={Icon}
      iconPosition="left"
      iconStyle="none"
      onClick={() => {
        if (enabled !== false) {
          editor.focus(() => {
            editor.update(() => {
              $addUpdateTag('toolbar')
            })
            // We need to wrap the onSelect in the callback, so the editor is properly focused before the onSelect is called.
            item.onSelect?.({
              editor,
              isActive: active!,
            })
          })
        }
      }}
      onMouseDown={(e) => {
        // This is required for Firefox compatibility. Without it, the dropdown will disappear without the onClick being called.
        // This only happens in Firefox. Must be something about how Firefox handles focus events differently.
        e.preventDefault()
      }}
      ref={ref}
      tooltip={tooltip}
      type="button"
    >
      {children}
    </Button>
  )
}

function DropDownItems({
  children,
  dropDownRef,
  itemsContainerClassNames,
  onClose,
}: {
  children: React.ReactNode
  dropDownRef: React.Ref<HTMLDivElement>
  itemsContainerClassNames?: string[]
  onClose: () => void
}): React.ReactElement {
  const [items, setItems] = useState<Array<React.RefObject<HTMLButtonElement | null>>>()
  const [highlightedItem, setHighlightedItem] =
    useState<React.RefObject<HTMLButtonElement | null>>()

  const registerItem = useCallback(
    (itemRef: React.RefObject<HTMLButtonElement | null>) => {
      setItems((prev) => (prev != null ? [...prev, itemRef] : [itemRef]))
    },
    [setItems],
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (items == null) {
      return
    }

    const { key } = event

    if (['ArrowDown', 'ArrowUp', 'Escape', 'Tab'].includes(key)) {
      event.preventDefault()
    }

    if (key === 'Escape' || key === 'Tab') {
      onClose()
    } else if (key === 'ArrowUp') {
      setHighlightedItem((prev) => {
        if (prev == null) {
          return items[0]
        }
        const index = items.indexOf(prev) - 1
        return items[index === -1 ? items.length - 1 : index]
      })
    } else if (key === 'ArrowDown') {
      setHighlightedItem((prev) => {
        if (prev == null) {
          return items[0]
        }
        return items[items.indexOf(prev) + 1]
      })
    }
  }

  const contextValue = useMemo(
    () => ({
      registerItem,
    }),
    [registerItem],
  )

  useEffect(() => {
    if (items != null && highlightedItem == null) {
      setHighlightedItem(items[0])
    }

    if (highlightedItem != null && highlightedItem?.current != null) {
      highlightedItem.current.focus()
    }
  }, [items, highlightedItem])

  return (
    <DropDownContext value={contextValue}>
      <div
        className={(itemsContainerClassNames ?? ['toolbar-popup__dropdown-items']).join(' ')}
        onKeyDown={handleKeyDown}
        ref={dropDownRef}
      >
        {children}
      </div>
    </DropDownContext>
  )
}

export function DropDown({
  buttonAriaLabel,
  buttonClassName,
  children,
  disabled = false,
  dropdownKey,
  Icon,
  itemsContainerClassNames,
  label,
  stopCloseOnClickSelf,
}: {
  buttonAriaLabel?: string
  buttonClassName: string
  children: ReactNode
  disabled?: boolean
  dropdownKey: string
  Icon?: React.FC
  itemsContainerClassNames?: string[]
  label?: string
  stopCloseOnClickSelf?: boolean
}): React.ReactNode {
  const dropDownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [showDropDown, setShowDropDown] = useState(false)

  const handleClose = (): void => {
    setShowDropDown(false)
    if (buttonRef?.current != null) {
      buttonRef.current.focus()
    }
  }

  useEffect(() => {
    const button = buttonRef.current
    const dropDown = dropDownRef.current

    if (showDropDown && button !== null && dropDown !== null) {
      const { left, top } = button.getBoundingClientRect()
      const scrollTopOffset = window.scrollY || document.documentElement.scrollTop
      dropDown.style.top = `${top + scrollTopOffset + button.offsetHeight + 5}px`
      dropDown.style.left = `${Math.min(left - 5, window.innerWidth - dropDown.offsetWidth - 20)}px`
    }
  }, [dropDownRef, buttonRef, showDropDown])

  useEffect(() => {
    const button = buttonRef.current

    if (button !== null && showDropDown) {
      const handle = (event: MouseEvent): void => {
        const target = event.target
        if (!isDOMNode(target)) {
          return
        }
        if (stopCloseOnClickSelf) {
          if (dropDownRef.current && dropDownRef.current.contains(target)) {
            return
          }
        }
        if (!button.contains(target)) {
          setShowDropDown(false)
        }
      }
      document.addEventListener('click', handle)

      return () => {
        document.removeEventListener('click', handle)
      }
    }
  }, [dropDownRef, buttonRef, showDropDown, stopCloseOnClickSelf])

  const portal = createPortal(
    <DropDownItems
      dropDownRef={dropDownRef}
      itemsContainerClassNames={itemsContainerClassNames}
      onClose={handleClose}
    >
      {children}
    </DropDownItems>,
    document.body,
  )

  return (
    <React.Fragment>
      <button
        aria-label={buttonAriaLabel}
        className={buttonClassName + (showDropDown ? ' active' : '')}
        data-dropdown-key={dropdownKey}
        disabled={disabled}
        onClick={(event) => {
          event.preventDefault()
          setShowDropDown(!showDropDown)
        }}
        onMouseDown={(e) => {
          // This fixes a bug where you are unable to click the button if you are in a NESTED editor (editor in blocks field in editor).
          // Thus only happens if you click on the SVG of the button. Clicking on the outside works. Related issue: https://github.com/payloadcms/payload/issues/4025
          // TODO: Find out why exactly it happens and why e.preventDefault() on the mouseDown fixes it. Write that down here, or potentially fix a root cause, if there is any.
          e.preventDefault()
        }}
        ref={buttonRef}
        type="button"
      >
        {Icon && <Icon />}
        {label && <span className="toolbar-popup__dropdown-label">{label}</span>}
        <i className="toolbar-popup__dropdown-caret" />
      </button>

      {showDropDown && <React.Fragment>{portal}</React.Fragment>}
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/shared/ToolbarDropdown/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .toolbar-popup__dropdown {
    display: flex;
    align-items: center;
    vertical-align: middle;
    justify-content: center;
    gap: base(0.2);
    height: base(1.5);
    border: 0;
    background: none;
    border-radius: $style-radius-m;
    cursor: pointer;
    position: relative;
    padding: 0 base(0.4) 0 base(0.3);
    transition: background-color 0.15s cubic-bezier(0, 0.2, 0.2, 1);

    &-label {
      color: var(--theme-elevation-600);
      padding-block: 0;
      padding-inline: base(0.2) base(0.4);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.2;
    }

    &:hover:not([disabled]) {
      background-color: var(--theme-elevation-100);
    }

    .active {
      background-color: var(--theme-elevation-100);

      .toolbar-popup__dropdown-caret {
        &:after {
          transform: rotate(0deg);
        }
      }
    }

    &-caret {
      width: base(0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(45deg);
      &:after {
        display: block;
        content: ' ';
        position: absolute;

        /* Vector 3 */

        width: 4px;
        height: 4px;
        transform: translateY(-2px);
        border: solid 1px var(--theme-elevation-600);
        border-width: 0 1px 1px 0;
      }
    }

    &-items {
      position: absolute;
      background: var(--theme-elevation-0);
      border-radius: $style-radius-m;
      min-width: 132.5px;
      max-width: 200px;
      z-index: 100;

      .toolbar-popup__dropdown-item {
        all: unset; // reset all default button styles
        cursor: pointer;
        color: var(--theme-elevation-900);
        transition: background-color 0.15s cubic-bezier(0, 0.2, 0.2, 1);
        position: relative;

        .text {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        &:hover:not([disabled]),
        &.active {
          background-color: var(--theme-elevation-100);
        }
        &.disabled {
          cursor: not-allowed;
          opacity: 0.2;
        }

        .btn__icon {
          // Override default button icon styles that
          // set a background color when focused
          background: none !important;
          background-color: none !important;
        }

        padding-left: 6.25px;
        padding-right: 6.25px;
        width: 100%;
        height: 30px;
        border-radius: $style-radius-m;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 6.25px;

        .icon {
          min-width: 20px;
          height: 20px;
          color: var(--theme-elevation-600);
        }
      }
    }
  }

  html[data-theme='light'] {
    .toolbar-popup__dropdown {
      &-items {
        position: absolute;
        @include shadow-m;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/shared/ToolbarDropdown/index.tsx
Signals: React

```typescript
'use client'
import React, { useCallback, useDeferredValue, useEffect, useMemo } from 'react'

const baseClass = 'toolbar-popup__dropdown'

import type { LexicalEditor } from 'lexical'

import { mergeRegister } from '@lexical/utils'
import { useTranslation } from '@payloadcms/ui'
import { $getSelection } from 'lexical'

import type { ToolbarDropdownGroup, ToolbarGroupItem } from '../../types.js'

import { useEditorConfigContext } from '../../../../lexical/config/client/EditorConfigProvider.js'
import { useRunDeprioritized } from '../../../../utilities/useRunDeprioritized.js'
import './index.scss'
import { DropDown, DropDownItem } from './DropDown.js'

const ToolbarItem = ({
  active,
  anchorElem,
  editor,
  enabled,
  item,
}: {
  active?: boolean
  anchorElem: HTMLElement
  editor: LexicalEditor
  enabled?: boolean
  item: ToolbarGroupItem
}) => {
  const { i18n } = useTranslation<{}, string>()
  const {
    fieldProps: { featureClientSchemaMap, schemaPath },
  } = useEditorConfigContext()

  if (item.Component) {
    return (
      item?.Component && (
        <item.Component
          active={active}
          anchorElem={anchorElem}
          editor={editor}
          enabled={enabled}
          item={item}
          key={item.key}
        />
      )
    )
  }

  let title = item.key
  let croppedTitle = item.key
  if (item.label) {
    title =
      typeof item.label === 'function'
        ? item.label({ featureClientSchemaMap, i18n, schemaPath })
        : item.label
  }
  // Crop title to max. 25 characters
  if (title.length > 25) {
    croppedTitle = title.substring(0, 25) + '...'
  } else {
    croppedTitle = title
  }

  return (
    <DropDownItem
      active={active}
      editor={editor}
      enabled={enabled}
      Icon={item?.ChildComponent ? <item.ChildComponent /> : undefined}
      item={item}
      itemKey={item.key}
      key={item.key}
      tooltip={title}
    >
      <span className="text">{croppedTitle}</span>
    </DropDownItem>
  )
}

const MemoToolbarItem = React.memo(ToolbarItem)

export const ToolbarDropdown = ({
  anchorElem,
  classNames,
  editor,
  group,
  Icon,
  itemsContainerClassNames,
  label,
  maxActiveItems,
  onActiveChange,
}: {
  anchorElem: HTMLElement
  classNames?: string[]
  editor: LexicalEditor
  group: ToolbarDropdownGroup
  Icon?: React.FC
  itemsContainerClassNames?: string[]
  label?: string
  /**
   * Maximum number of active items allowed. This is a performance optimization to prevent
   * unnecessary item active checks when the maximum number of active items is reached.
   */
  maxActiveItems?: number
  onActiveChange?: ({ activeItems }: { activeItems: ToolbarGroupItem[] }) => void
}) => {
  const [toolbarState, setToolbarState] = React.useState<{
    activeItemKeys: string[]
    enabledGroup: boolean
    enabledItemKeys: string[]
  }>({
    activeItemKeys: [],
    enabledGroup: true,
    enabledItemKeys: [],
  })
  const deferredToolbarState = useDeferredValue(toolbarState)

  const editorConfigContext = useEditorConfigContext()
  const { items, key: groupKey } = group

  const runDeprioritized = useRunDeprioritized()

  const updateStates = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection()
      if (!selection) {
        return
      }

      const _activeItemKeys: string[] = []
      const _activeItems: ToolbarGroupItem[] = []
      const _enabledItemKeys: string[] = []

      for (const item of items) {
        if (item.isActive && (!maxActiveItems || _activeItemKeys.length < maxActiveItems)) {
          const isActive = item.isActive({ editor, editorConfigContext, selection })
          if (isActive) {
            _activeItemKeys.push(item.key)
            _activeItems.push(item)
          }
        }
        if (item.isEnabled) {
          const isEnabled = item.isEnabled({ editor, editorConfigContext, selection })
          if (isEnabled) {
            _enabledItemKeys.push(item.key)
          }
        } else {
          _enabledItemKeys.push(item.key)
        }
      }

      setToolbarState({
        activeItemKeys: _activeItemKeys,
        enabledGroup: group.isEnabled
          ? group.isEnabled({ editor, editorConfigContext, selection })
          : true,
        enabledItemKeys: _enabledItemKeys,
      })

      if (onActiveChange) {
        onActiveChange({ activeItems: _activeItems })
      }
    })
  }, [editor, editorConfigContext, group, items, maxActiveItems, onActiveChange])

  useEffect(() => {
    // Run on mount in order to update states when dropdown is opened
    void runDeprioritized(updateStates)

    return mergeRegister(
      editor.registerUpdateListener(async () => {
        await runDeprioritized(updateStates)
      }),
    )
  }, [editor, runDeprioritized, updateStates])

  const renderedItems = useMemo(() => {
    return items?.length
      ? items.map((item) => (
          <MemoToolbarItem
            active={deferredToolbarState.activeItemKeys.includes(item.key)}
            anchorElem={anchorElem}
            editor={editor}
            enabled={deferredToolbarState.enabledItemKeys.includes(item.key)}
            item={item}
            key={item.key}
          />
        ))
      : null
  }, [items, deferredToolbarState, anchorElem, editor])

  return (
    <DropDown
      buttonAriaLabel={`${groupKey} dropdown`}
      buttonClassName={[baseClass, `${baseClass}-${groupKey}`, ...(classNames || [])]
        .filter(Boolean)
        .join(' ')}
      disabled={!deferredToolbarState.enabledGroup}
      dropdownKey={groupKey}
      Icon={Icon}
      itemsContainerClassNames={[`${baseClass}-items`, ...(itemsContainerClassNames || [])]}
      key={groupKey}
      label={label}
    >
      {renderedItems}
    </DropDown>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/upload/client/index.tsx

```typescript
'use client'

import { $isNodeSelection } from 'lexical'

import type { ExclusiveUploadFeatureProps } from '../server/index.js'

import { UploadIcon } from '../../../lexical/ui/icons/Upload/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { slashMenuBasicGroupWithItems } from '../../shared/slashMenu/basicGroup.js'
import { toolbarAddDropdownGroupWithItems } from '../../shared/toolbar/addDropdownGroup.js'
import { INSERT_UPLOAD_WITH_DRAWER_COMMAND } from './drawer/commands.js'
import { $isUploadNode, UploadNode } from './nodes/UploadNode.js'
import { UploadPlugin } from './plugin/index.js'

export type UploadFeaturePropsClient = {
  collections: {
    [collection: string]: {
      hasExtraFields: boolean
    }
  }
} & ExclusiveUploadFeatureProps

export const UploadFeatureClient = createClientFeature<UploadFeaturePropsClient>({
  nodes: [UploadNode],
  plugins: [
    {
      Component: UploadPlugin,
      position: 'normal',
    },
  ],
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: UploadIcon,
          key: 'upload',
          keywords: ['upload', 'image', 'file', 'img', 'picture', 'photo', 'media'],
          label: ({ i18n }) => {
            return i18n.t('lexical:upload:label')
          },
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_UPLOAD_WITH_DRAWER_COMMAND, {
              replace: false,
            })
          },
        },
      ]),
    ],
  },
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems([
        {
          ChildComponent: UploadIcon,
          isActive: ({ selection }) => {
            if (!$isNodeSelection(selection) || !selection.getNodes().length) {
              return false
            }

            const firstNode = selection.getNodes()[0]
            return $isUploadNode(firstNode)
          },
          key: 'upload',
          label: ({ i18n }) => {
            return i18n.t('lexical:upload:label')
          },
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_UPLOAD_WITH_DRAWER_COMMAND, {
              replace: false,
            })
          },
        },
      ]),
    ],
  },
})
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/upload/client/component/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .LexicalEditorTheme__upload {
    @extend %body;
    @include shadow-sm;

    border-radius: $style-radius-m;
    border: 1px solid var(--theme-elevation-100);
    position: relative;
    font-family: var(--font-body);
    margin-block: base(0.5);

    // Alignment support using :has() selector
    &:has([data-align='center']) {
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
    }

    &:has([data-align='right']),
    &:has([data-align='end']) {
      width: fit-content;
      margin-left: auto;
      margin-right: 0;
    }

    &:has([data-align='left']),
    &:has([data-align='start']) {
      width: fit-content;
      margin-left: 0;
      margin-right: auto;
    }

    &:hover {
      border: 1px solid var(--theme-elevation-150);
    }

    img,
    svg {
      border-radius: $style-radius-s;
      width: auto;
    }

    &__contents {
      &--landscape {
        img,
        svg {
          max-width: 450px;
          min-width: 450px;
        }
      }
      &--portrait {
        img,
        svg {
          max-height: 450px;
          min-height: 450px;
        }
      }
    }

    button {
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__card {
      @include soft-shadow-bottom;
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    &__floater {
      @include shadow-lg;
      position: absolute;
      color: var(--theme-text);

      /* hidden by default */
      opacity: 0;
      transition:
        opacity 0.15s ease,
        transform 0.15s ease;
      pointer-events: none;
    }

    &:hover .LexicalEditorTheme__upload__floater,
    &__media:focus-within .LexicalEditorTheme__upload__floater {
      opacity: 1;
      pointer-events: auto;
    }

    /* --- Floating Action Buttons (top-right) ------------------------------------- */
    &__overlay {
      display: flex;
      top: calc(var(--base) * 0.5);
      right: calc(var(--base) * 0.5);
      padding: calc(var(--base) * 0.2) calc(var(--base) * 0.2);

      background: var(--theme-elevation-50);
      border-radius: $style-radius-m;
      transform: translateY(-6px);
    }
    &:hover .LexicalEditorTheme__upload__overlay,
    &__media:focus-within .LexicalEditorTheme__upload__overlay {
      transform: translateY(0);
    }

    &__actions {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      gap: calc(var(--base) * 0.3);

      .btn:hover {
        background: var(--theme-elevation-100);
      }
    }
    /* --- Floating Metadata (bottom-center) ------------------------------------- */
    &__metaOverlay {
      display: inline-flex;
      left: 50%;
      bottom: 0;
      width: 100%;
      padding: calc(var(--base) * 0.5) calc(var(--base) * 0.75);
      transform: translateX(-50%);

      flex-wrap: wrap;
      gap: calc(var(--base) * 0.5);
      row-gap: 0;

      background: color-mix(in oklab, var(--theme-elevation-50) 55%, transparent);
      border-radius: 0 0 $style-radius-s $style-radius-s;
      backdrop-filter: saturate(1.2) blur(8px);
    }

    html[data-theme='light'] & {
      &__metaOverlay {
        background: color-mix(in oklab, var(--theme-elevation-800) 55%, transparent);
        color: var(--theme-elevation-50);
      }

      &__collectionLabel {
        color: var(--theme-elevation-300);
      }
    }

    &__filename {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-decoration: underline;
      cursor: pointer;
    }

    &__collectionLabel {
      color: var(--theme-elevation-500);
      font-size: 0.9em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @include small-break {
      img,
      svg {
        // Allow images to shrink < 450px on small screens to
        // maintain aspect ratio
        min-width: unset;
        min-height: unset;
      }

      &__metaOverlay {
        gap: 0;
        padding: calc(var(--base) * 0.5) calc(var(--base) * 0.6);
        flex-direction: column;

        button {
          display: flex;
          justify-content: flex-start;
        }
      }

      &__collectionLabel {
        max-width: 100%;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/upload/client/component/index.tsx
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig, Data, FormState, JsonObject } from 'payload'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { getTranslation } from '@payloadcms/translations'
import {
  Button,
  formatDrawerSlug,
  Thumbnail,
  useConfig,
  useEditDepth,
  usePayloadAPI,
  useTranslation,
} from '@payloadcms/ui'
import { $getNodeByKey, type ElementFormatType } from 'lexical'
import { isImage } from 'payload/shared'
import React, { useCallback, useId, useReducer, useRef, useState } from 'react'

import type { BaseClientFeatureProps } from '../../../typesClient.js'
import type { UploadData } from '../../server/nodes/UploadNode.js'
import type { UploadFeaturePropsClient } from '../index.js'
import type { UploadNode } from '../nodes/UploadNode.js'

import { useEditorConfigContext } from '../../../../lexical/config/client/EditorConfigProvider.js'
import { FieldsDrawer } from '../../../../utilities/fieldsDrawer/Drawer.js'
import { useLexicalDocumentDrawer } from '../../../../utilities/fieldsDrawer/useLexicalDocumentDrawer.js'
import { useLexicalDrawer } from '../../../../utilities/fieldsDrawer/useLexicalDrawer.js'
import { INSERT_UPLOAD_WITH_DRAWER_COMMAND } from '../drawer/commands.js'
import './index.scss'

const initialParams = {
  depth: 0,
}

export type ElementProps = {
  className: string
  data: UploadData
  format?: ElementFormatType
  nodeKey: string
}

export const UploadComponent: React.FC<ElementProps> = (props) => {
  const {
    className: baseClass,
    data: { fields, relationTo, value },
    format,
    nodeKey,
  } = props

  if (typeof value === 'object') {
    throw new Error(
      'Upload value should be a string or number. The Lexical Upload component should not receive the populated value object.',
    )
  }

  const {
    config: {
      routes: { api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()
  const uploadRef = useRef<HTMLDivElement | null>(null)
  const { uuid } = useEditorConfigContext()
  const editDepth = useEditDepth()
  const [editor] = useLexicalComposerContext()

  const {
    editorConfig,
    fieldProps: { schemaPath },
  } = useEditorConfigContext()
  const isEditable = useLexicalEditable()
  const { i18n, t } = useTranslation()
  const [cacheBust, dispatchCacheBust] = useReducer((state) => state + 1, 0)
  const [relatedCollection] = useState<ClientCollectionConfig>(() =>
    getEntityConfig({ collectionSlug: relationTo }),
  )

  const componentID = useId()

  const extraFieldsDrawerSlug = formatDrawerSlug({
    slug: `lexical-upload-drawer-` + uuid + componentID, // There can be multiple upload components, each with their own drawer, in one single editor => separate them by componentID
    depth: editDepth,
  })

  // Need to use hook to initialize useEffect that restores cursor position
  const { toggleDrawer } = useLexicalDrawer(extraFieldsDrawerSlug, true)

  const { closeDocumentDrawer, DocumentDrawer, DocumentDrawerToggler } = useLexicalDocumentDrawer({
    id: value,
    collectionSlug: relatedCollection.slug,
  })

  // Get the referenced document
  const [{ data }, { setParams }] = usePayloadAPI(
    `${serverURL}${api}/${relatedCollection.slug}/${value}`,
    { initialParams },
  )

  const thumbnailSRC = data?.thumbnailURL || data?.url

  const removeUpload = useCallback(() => {
    editor.update(() => {
      $getNodeByKey(nodeKey)?.remove()
    })
  }, [editor, nodeKey])

  const updateUpload = useCallback(
    (_data: Data) => {
      setParams({
        ...initialParams,
        cacheBust, // do this to get the usePayloadAPI to re-fetch the data even though the URL string hasn't changed
      })

      dispatchCacheBust()
      closeDocumentDrawer()
    },
    [setParams, cacheBust, closeDocumentDrawer],
  )

  const hasExtraFields = (
    editorConfig?.resolvedFeatureMap?.get('upload')
      ?.sanitizedClientFeatureProps as BaseClientFeatureProps<UploadFeaturePropsClient>
  ).collections?.[relatedCollection.slug]?.hasExtraFields

  const onExtraFieldsDrawerSubmit = useCallback(
    (_: FormState, data: JsonObject) => {
      // Update lexical node (with key nodeKey) with new data
      editor.update(() => {
        const uploadNode: null | UploadNode = $getNodeByKey(nodeKey)
        if (uploadNode) {
          const newData: UploadData = {
            ...uploadNode.getData(),
            fields: data,
          }
          uploadNode.setData(newData)
        }
      })
    },
    [editor, nodeKey],
  )

  const aspectRatio =
    thumbnailSRC && data?.width && data?.height
      ? data.width > data.height
        ? 'landscape'
        : 'portrait'
      : 'landscape'

  return (
    <div
      className={`${baseClass}__contents ${baseClass}__contents--${aspectRatio}`}
      data-align={format || undefined}
      data-filename={data?.filename}
      ref={uploadRef}
    >
      <div className={`${baseClass}__card`}>
        <div className={`${baseClass}__media`}>
          <Thumbnail
            collectionSlug={relationTo}
            fileSrc={isImage(data?.mimeType) ? thumbnailSRC : null}
            height={data?.height}
            size="none"
            width={data?.width}
          />

          {isEditable && (
            <div className={`${baseClass}__overlay ${baseClass}__floater`}>
              <div className={`${baseClass}__actions`} role="toolbar">
                {hasExtraFields ? (
                  <Button
                    buttonStyle="icon-label"
                    className={`${baseClass}__upload-drawer-toggler`}
                    disabled={!isEditable}
                    el="button"
                    icon="edit"
                    onClick={toggleDrawer}
                    round
                    size="medium"
                    tooltip={t('fields:editRelationship')}
                  />
                ) : null}

                <Button
                  buttonStyle="icon-label"
                  className={`${baseClass}__swap-drawer-toggler`}
                  disabled={!isEditable}
                  el="button"
                  icon="swap"
                  onClick={() => {
                    editor.dispatchCommand(INSERT_UPLOAD_WITH_DRAWER_COMMAND, {
                      replace: { nodeKey },
                    })
                  }}
                  round
                  size="medium"
                  tooltip={t('fields:swapUpload')}
                />

                <Button
                  buttonStyle="icon-label"
                  className={`${baseClass}__removeButton`}
                  disabled={!isEditable}
                  icon="x"
                  onClick={(e) => {
                    e.preventDefault()
                    removeUpload()
                  }}
                  round
                  size="medium"
                  tooltip={t('fields:removeUpload')}
                />
              </div>
            </div>
          )}
        </div>

        <div className={`${baseClass}__metaOverlay ${baseClass}__floater`}>
          <DocumentDrawerToggler className={`${baseClass}__doc-drawer-toggler`}>
            <strong className={`${baseClass}__filename`}>
              {data?.filename || t('general:untitled')}
            </strong>
          </DocumentDrawerToggler>
          <div className={`${baseClass}__collectionLabel`}>
            {getTranslation(relatedCollection.labels.singular, i18n)}
          </div>
        </div>
      </div>

      {value ? <DocumentDrawer onSave={updateUpload} /> : null}
      {hasExtraFields ? (
        <FieldsDrawer
          data={fields}
          drawerSlug={extraFieldsDrawerSlug}
          drawerTitle={t('general:editLabel', {
            label: getTranslation(relatedCollection.labels.singular, i18n),
          })}
          featureKey="upload"
          handleDrawerSubmit={onExtraFieldsDrawerSubmit}
          schemaPath={schemaPath}
          schemaPathSuffix={relatedCollection.slug}
        />
      ) : null}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/upload/client/component/pending/index.tsx

```typescript
'use client'

import { ShimmerEffect } from '@payloadcms/ui'

import '../index.scss'

export const PendingUploadComponent = (): React.ReactNode => {
  return (
    <div className={'lexical-upload'}>
      <ShimmerEffect height={'95px'} width={'203px'} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: commands.ts]---
Location: payload-main/packages/richtext-lexical/src/features/upload/client/drawer/commands.ts

```typescript
'use client'
import type { LexicalCommand } from 'lexical'

import { createCommand } from 'lexical'

export const INSERT_UPLOAD_WITH_DRAWER_COMMAND: LexicalCommand<{
  replace: { nodeKey: string } | false
}> = createCommand('INSERT_UPLOAD_WITH_DRAWER_COMMAND')
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/upload/client/drawer/index.tsx
Signals: React

```typescript
'use client'
import type { ListDrawerProps } from '@payloadcms/ui'
import type { LexicalEditor } from 'lexical'
import type { UploadCollectionSlug } from 'payload'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { toast } from '@payloadcms/ui'
import { $getNodeByKey, COMMAND_PRIORITY_EDITOR } from 'lexical'
import React, { useCallback, useEffect, useState } from 'react'

import { useLexicalListDrawer } from '../../../../utilities/fieldsDrawer/useLexicalListDrawer.js'
import { $createUploadNode } from '../nodes/UploadNode.js'
import { INSERT_UPLOAD_COMMAND } from '../plugin/index.js'
import { INSERT_UPLOAD_WITH_DRAWER_COMMAND } from './commands.js'

const insertUpload = ({
  editor,
  relationTo,
  replaceNodeKey,
  value,
}: {
  editor: LexicalEditor
  relationTo: string
  replaceNodeKey: null | string
  value: number | string
}) => {
  if (!replaceNodeKey) {
    editor.dispatchCommand(INSERT_UPLOAD_COMMAND, {
      // @ts-expect-error - TODO: fix this
      fields: null,
      relationTo,
      value,
    })
  } else {
    editor.update(() => {
      const node = $getNodeByKey(replaceNodeKey)
      if (node) {
        node.replace(
          $createUploadNode({
            data: {
              // @ts-expect-error - TODO: fix this
              fields: null,
              relationTo,
              value,
            },
          }),
        )
      }
    })
  }
}

type Props = {
  enabledCollectionSlugs: UploadCollectionSlug[]
}

const UploadDrawerComponent: React.FC<Props> = ({ enabledCollectionSlugs }) => {
  const [editor] = useLexicalComposerContext()

  const [replaceNodeKey, setReplaceNodeKey] = useState<null | string>(null)

  const { closeListDrawer, ListDrawer, openListDrawer } = useLexicalListDrawer({
    collectionSlugs: enabledCollectionSlugs,
    uploads: true,
  })

  useEffect(() => {
    return editor.registerCommand<{
      replace: { nodeKey: string } | false
    }>(
      INSERT_UPLOAD_WITH_DRAWER_COMMAND,
      (payload) => {
        setReplaceNodeKey(payload?.replace ? payload?.replace.nodeKey : null)
        openListDrawer()
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor, openListDrawer])

  const onSelect = useCallback<NonNullable<ListDrawerProps['onSelect']>>(
    ({ collectionSlug, doc }) => {
      closeListDrawer()
      insertUpload({
        editor,
        relationTo: collectionSlug,
        replaceNodeKey,
        value: doc.id,
      })
    },
    [editor, closeListDrawer, replaceNodeKey],
  )

  return <ListDrawer onSelect={onSelect} />
}

const UploadDrawerComponentFallback: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand<{
      replace: { nodeKey: string } | false
    }>(
      INSERT_UPLOAD_WITH_DRAWER_COMMAND,
      () => {
        toast.error('No upload collections enabled')
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return null
}

export const UploadDrawer = ({ enabledCollectionSlugs }: Props): React.ReactNode => {
  if (!enabledCollectionSlugs?.length) {
    return <UploadDrawerComponentFallback />
  }

  return <UploadDrawerComponent enabledCollectionSlugs={enabledCollectionSlugs} />
}
```

--------------------------------------------------------------------------------

---[FILE: UploadNode.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/upload/client/nodes/UploadNode.tsx
Signals: React

```typescript
'use client'
import type { DOMConversionMap, EditorConfig, LexicalEditor, LexicalNode } from 'lexical'
import type { JSX } from 'react'

import ObjectID from 'bson-objectid'
import { $applyNodeReplacement } from 'lexical'
import * as React from 'react'

import type {
  Internal_UploadData,
  SerializedUploadNode,
  UploadData,
} from '../../server/nodes/UploadNode.js'

import { $convertUploadElement } from '../../server/nodes/conversions.js'
import { UploadServerNode } from '../../server/nodes/UploadNode.js'
import { PendingUploadComponent } from '../component/pending/index.js'

const RawUploadComponent = React.lazy(() =>
  import('../../client/component/index.js').then((module) => ({ default: module.UploadComponent })),
)

export class UploadNode extends UploadServerNode {
  static override clone(node: UploadServerNode): UploadServerNode {
    return super.clone(node)
  }

  static override getType(): string {
    return super.getType()
  }

  static override importDOM(): DOMConversionMap<HTMLImageElement> {
    return {
      img: (node) => ({
        conversion: (domNode) => $convertUploadElement(domNode, $createUploadNode),
        priority: 0,
      }),
    }
  }

  static override importJSON(serializedNode: SerializedUploadNode): UploadNode {
    if (serializedNode.version === 1 && (serializedNode?.value as unknown as { id: string })?.id) {
      serializedNode.value = (serializedNode.value as unknown as { id: string }).id
    }
    if (serializedNode.version === 2 && !serializedNode?.id) {
      serializedNode.id = new ObjectID.default().toHexString()
      serializedNode.version = 3
    }

    const importedData: Internal_UploadData = {
      id: serializedNode.id,
      fields: serializedNode.fields,
      pending: (serializedNode as Internal_UploadData).pending,
      relationTo: serializedNode.relationTo,
      value: serializedNode.value,
    }

    const node = $createUploadNode({ data: importedData })
    node.setFormat(serializedNode.format)

    return node
  }

  override decorate(editor?: LexicalEditor, config?: EditorConfig): JSX.Element {
    if ((this.__data as Internal_UploadData).pending) {
      return <PendingUploadComponent />
    }
    return (
      <RawUploadComponent
        className={config?.theme?.upload ?? 'LexicalEditorTheme__upload'}
        data={this.__data}
        format={this.__format}
        nodeKey={this.getKey()}
      />
    )
  }

  override exportJSON(): SerializedUploadNode {
    return super.exportJSON()
  }
}

export function $createUploadNode({
  data,
}: {
  data: Omit<UploadData, 'id'> & Partial<Pick<UploadData, 'id'>>
}): UploadNode {
  if (!data?.id) {
    data.id = new ObjectID.default().toHexString()
  }

  return $applyNodeReplacement(new UploadNode({ data: data as UploadData }))
}

export function $isUploadNode(node: LexicalNode | null | undefined): node is UploadNode {
  return node instanceof UploadNode
}
```

--------------------------------------------------------------------------------

````
