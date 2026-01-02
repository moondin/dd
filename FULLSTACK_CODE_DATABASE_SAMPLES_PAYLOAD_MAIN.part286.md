---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 286
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 286 of 695)

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
Location: payload-main/packages/richtext-lexical/src/features/toolbars/fixed/client/index.tsx

```typescript
'use client'

import type { FixedToolbarFeatureProps } from '../server/index.js'

import { createClientFeature } from '../../../../utilities/createClientFeature.js'
import { FixedToolbarPlugin } from './Toolbar/index.js'

export const FixedToolbarFeatureClient = createClientFeature<FixedToolbarFeatureProps>({
  plugins: [
    {
      Component: FixedToolbarPlugin,
      position: 'aboveContainer',
    },
  ],
})
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/fixed/client/Toolbar/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  html[data-theme='dark'] {
    .fixed-toolbar {
      &__dropdown-items {
        background: var(--theme-elevation-0);
        transition: background 0.2s cubic-bezier(0, 0.2, 0.2, 1);

        .toolbar-popup__dropdown-item {
          color: var(--theme-elevation-900);

          &:hover:not([disabled]),
          &.active {
            background: var(--theme-elevation-100);
          }

          .icon {
            color: var(--theme-elevation-600);
          }
        }
      }

      .toolbar-popup {
        &__dropdown {
          transition: background-color 0.15s cubic-bezier(0, 0.2, 0.2, 1);

          &:hover:not([disabled]) {
            background: var(--theme-elevation-100);
          }

          &-caret:after {
            filter: invert(1);
          }

          &-label {
            color: var(--theme-elevation-750);
          }
        }
      }
    }
  }

  .fixed-toolbar.fixed-toolbar--hide {
    visibility: hidden; // Still needs to take up space so content does not jump, thus we cannot use display: none
    // make sure you cant interact with it
    pointer-events: none;
    user-select: none;
  }

  .fixed-toolbar {
    @include blur-bg(var(--theme-elevation-0));
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: calc(var(--base) / 4);
    vertical-align: middle;
    position: sticky;
    z-index: 2;
    top: var(--doc-controls-height);
    border: $style-stroke-width-s solid var(--theme-elevation-150);
    // Make it so border itself is round too and not cut off at the corners
    border-collapse: unset;
    transform: translateY(1px); // aligns with top bar pixel line when stuck
    min-height: 40px; // Reduces shift when saving document if toolbar items did not load yet

    &__group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 2px;
      z-index: 1;

      .icon {
        min-width: 20px;
        height: 20px;
        color: var(--theme-elevation-600);
      }

      .divider {
        width: 1px;
        height: 15px;
        background-color: var(--theme-elevation-100);
        margin: 0 6.25px 0 4.25px; // substract 2px from the gap
      }
    }

    + .editor-container {
      > .editor-scroller > .editor {
        > .ContentEditable__root {
          padding-top: calc(var(--base) * 1.25);
        }
      }

      > .editor-scroller > .editor > div > .LexicalEditorTheme__placeholder {
        top: calc(var(--base) * 1.25);
      }
    }
  }

  .rich-text-lexical--show-gutter {
    .fixed-toolbar {
      + .editor-container {
        > .editor-scroller > .editor {
          > .ContentEditable__root::before {
            top: calc(var(--base) * 1.25) !important;
            height: calc(100% - calc(var(--base) * 1.25) - 8px) !important;
          }
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/fixed/client/Toolbar/index.tsx
Signals: React

```typescript
'use client'
import type { LexicalEditor } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { useScrollInfo, useThrottledEffect, useTranslation } from '@payloadcms/ui'
import * as React from 'react'
import { useMemo } from 'react'

import type { EditorConfigContextType } from '../../../../../lexical/config/client/EditorConfigProvider.js'
import type { SanitizedClientEditorConfig } from '../../../../../lexical/config/types.js'
import type { PluginComponent } from '../../../../typesClient.js'
import type { ToolbarGroup, ToolbarGroupItem } from '../../../types.js'
import type { FixedToolbarFeatureProps } from '../../server/index.js'

import { useEditorConfigContext } from '../../../../../lexical/config/client/EditorConfigProvider.js'
import { ToolbarButton } from '../../../shared/ToolbarButton/index.js'
import './index.scss'
import { ToolbarDropdown } from '../../../shared/ToolbarDropdown/index.js'

function ButtonGroupItem({
  anchorElem,
  editor,
  item,
}: {
  anchorElem: HTMLElement
  editor: LexicalEditor
  item: ToolbarGroupItem
}): React.ReactNode {
  if (item.Component) {
    return (
      item?.Component && (
        <item.Component anchorElem={anchorElem} editor={editor} item={item} key={item.key} />
      )
    )
  }

  if (!item.ChildComponent) {
    return null
  }

  return (
    <ToolbarButton editor={editor} item={item} key={item.key}>
      <item.ChildComponent />
    </ToolbarButton>
  )
}

function ToolbarGroupComponent({
  anchorElem,
  editor,
  editorConfig,
  group,
  index,
}: {
  anchorElem: HTMLElement
  editor: LexicalEditor
  editorConfig: SanitizedClientEditorConfig
  group: ToolbarGroup
  index: number
}): React.ReactNode {
  const { i18n } = useTranslation<{}, string>()
  const {
    fieldProps: { featureClientSchemaMap, schemaPath },
  } = useEditorConfigContext()

  const [dropdownLabel, setDropdownLabel] = React.useState<string | undefined>(undefined)
  const [DropdownIcon, setDropdownIcon] = React.useState<React.FC | undefined>(undefined)

  React.useEffect(() => {
    if (group?.type === 'dropdown' && group.items.length && group.ChildComponent) {
      setDropdownIcon(() => group.ChildComponent!)
    } else {
      setDropdownIcon(undefined)
    }
  }, [group])

  const onActiveChange = React.useCallback(
    ({ activeItems }: { activeItems: ToolbarGroupItem[] }) => {
      if (!activeItems.length) {
        if (group?.type === 'dropdown' && group.items.length && group.ChildComponent) {
          setDropdownIcon(() => group.ChildComponent!)
          setDropdownLabel(undefined)
        } else {
          setDropdownIcon(undefined)
          setDropdownLabel(undefined)
        }
        return
      }
      const item = activeItems[0]!

      let label = item.key
      if (item.label) {
        label =
          typeof item.label === 'function'
            ? item.label({ featureClientSchemaMap, i18n, schemaPath })
            : item.label
      }
      // Crop title to max. 25 characters
      if (label.length > 25) {
        label = label.substring(0, 25) + '...'
      }
      if (activeItems.length === 1) {
        setDropdownLabel(label)
        setDropdownIcon(() => item.ChildComponent)
      } else {
        setDropdownLabel(
          i18n.t('lexical:general:toolbarItemsActive', { count: activeItems.length }),
        )
        if (group?.type === 'dropdown' && group.items.length && group.ChildComponent) {
          setDropdownIcon(() => group.ChildComponent!)
        } else {
          setDropdownIcon(undefined)
        }
      }
    },
    [group, i18n, featureClientSchemaMap, schemaPath],
  )

  return (
    <div
      className={`fixed-toolbar__group fixed-toolbar__group-${group.key}`}
      data-toolbar-group-key={group.key}
      key={group.key}
    >
      {group.type === 'dropdown' && group.items.length ? (
        DropdownIcon ? (
          <ToolbarDropdown
            anchorElem={anchorElem}
            editor={editor}
            group={group}
            Icon={DropdownIcon}
            itemsContainerClassNames={['fixed-toolbar__dropdown-items']}
            label={dropdownLabel}
            maxActiveItems={group.maxActiveItems ?? 1}
            onActiveChange={onActiveChange}
          />
        ) : (
          <ToolbarDropdown
            anchorElem={anchorElem}
            editor={editor}
            group={group}
            itemsContainerClassNames={['fixed-toolbar__dropdown-items']}
            label={dropdownLabel}
            maxActiveItems={group.maxActiveItems ?? 1}
            onActiveChange={onActiveChange}
          />
        )
      ) : null}
      {group.type === 'buttons' && group.items.length
        ? group.items.map((item) => {
            return (
              <ButtonGroupItem anchorElem={anchorElem} editor={editor} item={item} key={item.key} />
            )
          })
        : null}
      {index < editorConfig.features.toolbarFixed?.groups.length - 1 && <div className="divider" />}
    </div>
  )
}

function FixedToolbar({
  anchorElem,
  clientProps,
  editor,
  editorConfig,
  parentWithFixedToolbar,
}: {
  anchorElem: HTMLElement
  clientProps?: FixedToolbarFeatureProps
  editor: LexicalEditor
  editorConfig: SanitizedClientEditorConfig
  parentWithFixedToolbar: EditorConfigContextType | false
}): React.ReactNode {
  const currentToolbarRef = React.useRef<HTMLDivElement>(null)
  const isEditable = useLexicalEditable()

  const { y } = useScrollInfo()

  // Memoize the parent toolbar element
  const parentToolbarElem = useMemo(() => {
    if (!parentWithFixedToolbar || clientProps?.disableIfParentHasFixedToolbar) {
      return null
    }

    const parentEditorElem = parentWithFixedToolbar.editorContainerRef.current
    let sibling = parentEditorElem.previousElementSibling
    while (sibling) {
      if (sibling.classList.contains('fixed-toolbar')) {
        return sibling
      }
      sibling = sibling.previousElementSibling
    }
    return null
  }, [clientProps?.disableIfParentHasFixedToolbar, parentWithFixedToolbar])

  useThrottledEffect(
    () => {
      if (!parentToolbarElem) {
        // this also checks for clientProps?.disableIfParentHasFixedToolbar indirectly, see the parentToolbarElem useMemo
        return
      }
      const currentToolbarElem = currentToolbarRef.current
      if (!currentToolbarElem) {
        return
      }

      const currentRect = currentToolbarElem.getBoundingClientRect()
      const parentRect = parentToolbarElem.getBoundingClientRect()

      // we only need to check for vertical overlap
      const overlapping = !(
        currentRect.bottom < parentRect.top || currentRect.top > parentRect.bottom
      )

      if (overlapping) {
        currentToolbarElem.classList.remove('fixed-toolbar')
        currentToolbarElem.classList.add('fixed-toolbar', 'fixed-toolbar--overlapping')
        parentToolbarElem.classList.remove('fixed-toolbar')
        parentToolbarElem.classList.add('fixed-toolbar', 'fixed-toolbar--hide')
      } else {
        if (!currentToolbarElem.classList.contains('fixed-toolbar--overlapping')) {
          return
        }
        currentToolbarElem.classList.remove('fixed-toolbar--overlapping')
        currentToolbarElem.classList.add('fixed-toolbar')
        parentToolbarElem.classList.remove('fixed-toolbar--hide')
        parentToolbarElem.classList.add('fixed-toolbar')
      }
    },
    50,
    [currentToolbarRef, parentToolbarElem, y],
  )

  return (
    <div
      className="fixed-toolbar"
      onFocus={(event) => {
        // Prevent other focus events being triggered. Otherwise, if this was to be clicked while in a child editor,
        // the parent editor will be focused, and the child editor will lose focus.
        event.stopPropagation()
      }}
      ref={currentToolbarRef}
    >
      {isEditable && (
        <React.Fragment>
          {editorConfig?.features &&
            editorConfig.features?.toolbarFixed?.groups.map((group, i) => {
              return (
                <ToolbarGroupComponent
                  anchorElem={anchorElem}
                  editor={editor}
                  editorConfig={editorConfig}
                  group={group}
                  index={i}
                  key={group.key}
                />
              )
            })}
        </React.Fragment>
      )}
    </div>
  )
}

const getParentEditorWithFixedToolbar = (
  editorConfigContext: EditorConfigContextType,
): EditorConfigContextType | false => {
  if (editorConfigContext.parentEditor?.editorConfig) {
    if (editorConfigContext.parentEditor?.editorConfig.resolvedFeatureMap.has('toolbarFixed')) {
      return editorConfigContext.parentEditor
    } else {
      if (editorConfigContext.parentEditor) {
        return getParentEditorWithFixedToolbar(editorConfigContext.parentEditor)
      }
    }
  }
  return false
}

export const FixedToolbarPlugin: PluginComponent<FixedToolbarFeatureProps> = ({ clientProps }) => {
  const [currentEditor] = useLexicalComposerContext()
  const editorConfigContext = useEditorConfigContext()
  const isEditable = useLexicalEditable()
  if (!isEditable) {
    return null
  }

  const { editorConfig: currentEditorConfig } = editorConfigContext

  const editor = clientProps.applyToFocusedEditor
    ? editorConfigContext.focusedEditor?.editor || currentEditor
    : currentEditor

  const editorConfig = clientProps.applyToFocusedEditor
    ? editorConfigContext.focusedEditor?.editorConfig || currentEditorConfig
    : currentEditorConfig

  const parentWithFixedToolbar = getParentEditorWithFixedToolbar(editorConfigContext)

  if (clientProps?.disableIfParentHasFixedToolbar) {
    if (parentWithFixedToolbar) {
      return null
    }
  }

  if (!editorConfig?.features?.toolbarFixed?.groups?.length) {
    return null
  }

  return (
    <FixedToolbar
      anchorElem={document.body}
      editor={editor}
      editorConfig={editorConfig}
      parentWithFixedToolbar={parentWithFixedToolbar}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/fixed/server/index.ts

```typescript
import type { CustomGroups } from '../../types.js'

import { createServerFeature } from '../../../../utilities/createServerFeature.js'

export type FixedToolbarFeatureProps = {
  /**
   * @default false
   *
   * If this is enabled, the toolbar will apply to the focused editor, not the editor with the FixedToolbarFeature.
   *
   * This means that if the editor has a child-editor, and the child-editor is focused, the toolbar will apply to the child-editor, not the parent editor with this feature added.
   */
  applyToFocusedEditor?: boolean
  /**
   * Custom configurations for toolbar groups
   * Key is the group key (e.g. 'format', 'indent', 'align')
   * Value is a partial ToolbarGroup object that will be merged with the default configuration
   *
   * @note Props passed via customGroups must be serializable. Avoid using functions or dynamic components.
   * ChildComponent, if provided, must be a serializable server component.
   */
  customGroups?: CustomGroups
  /**
   * @default false
   *
   * If there is a parent editor with a fixed toolbar, this will disable the toolbar for this editor.
   */
  disableIfParentHasFixedToolbar?: boolean
}

export const FixedToolbarFeature = createServerFeature<
  FixedToolbarFeatureProps,
  FixedToolbarFeatureProps,
  FixedToolbarFeatureProps
>({
  feature: ({ props }) => {
    const sanitizedProps: FixedToolbarFeatureProps = {
      applyToFocusedEditor:
        props?.applyToFocusedEditor === undefined ? false : props.applyToFocusedEditor,
      customGroups: props?.customGroups,
      disableIfParentHasFixedToolbar:
        props?.disableIfParentHasFixedToolbar === undefined
          ? false
          : props.disableIfParentHasFixedToolbar,
    }

    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#FixedToolbarFeatureClient',
      clientFeatureProps: sanitizedProps,
      sanitizedServerFeatureProps: sanitizedProps,
    }
  },
  key: 'toolbarFixed',
})
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/inline/client/index.tsx

```typescript
'use client'

import { createClientFeature } from '../../../../utilities/createClientFeature.js'
import { InlineToolbarPlugin } from './Toolbar/index.js'

export const InlineToolbarFeatureClient = createClientFeature({
  plugins: [
    {
      Component: InlineToolbarPlugin,
      position: 'floatingAnchorElem',
    },
  ],
})
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/inline/client/Toolbar/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .inline-toolbar-popup {
    display: flex;
    align-items: center;
    background: var(--theme-input-bg);
    padding: base(0.2);
    vertical-align: middle;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    opacity: 0;
    border-radius: $style-radius-m;
    transition: opacity 0.2s;
    will-change: transform;
    box-shadow:
      0px 1px 2px 1px rgba(0, 0, 0, 0.1),
      0px 4px 16px 0px rgba(0, 0, 0, 0.2),
      0px -4px 8px 0px rgba(0, 0, 0, 0.1);

    .caret {
      z-index: 93;
      position: absolute;
      top: calc(100% - 24px);
      border: base(0.4) solid transparent;
      pointer-events: none;
      border-top-color: var(--theme-input-bg);
    }

    &__group {
      display: flex;
      align-items: center;
      gap: 2px;

      .icon {
        min-width: 20px;
        height: 20px;
        color: var(--theme-elevation-600);
      }

      .divider {
        width: 1px;
        height: 15px;
        background-color: var(--theme-border-color);
        margin: 0 6.25px;
      }
    }
  }
  html[data-theme='light'] {
    .inline-toolbar-popup {
      box-shadow:
        0px 1px 2px 1px rgba(0, 0, 0, 0.05),
        0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/inline/client/Toolbar/index.tsx
Signals: React

```typescript
'use client'
import type { LexicalEditor } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  getDOMSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { createPortal } from 'react-dom'

import type { PluginComponentWithAnchor } from '../../../../typesClient.js'
import type { ToolbarGroup, ToolbarGroupItem } from '../../../types.js'

import { useEditorConfigContext } from '../../../../../lexical/config/client/EditorConfigProvider.js'
import { getDOMRangeRect } from '../../../../../lexical/utils/getDOMRangeRect.js'
import { setFloatingElemPosition } from '../../../../../lexical/utils/setFloatingElemPosition.js'
import { ToolbarButton } from '../../../shared/ToolbarButton/index.js'
import './index.scss'
import { ToolbarDropdown } from '../../../shared/ToolbarDropdown/index.js'

function ButtonGroupItem({
  anchorElem,
  editor,
  item,
}: {
  anchorElem: HTMLElement
  editor: LexicalEditor
  item: ToolbarGroupItem
}): React.ReactNode {
  if (item.Component) {
    return (
      item?.Component && (
        <item.Component anchorElem={anchorElem} editor={editor} item={item} key={item.key} />
      )
    )
  }
  if (!item.ChildComponent) {
    return null
  }

  return (
    <ToolbarButton editor={editor} item={item} key={item.key}>
      <item.ChildComponent />
    </ToolbarButton>
  )
}

function ToolbarGroupComponent({
  anchorElem,
  editor,
  group,
  index,
}: {
  anchorElem: HTMLElement
  editor: LexicalEditor
  group: ToolbarGroup
  index: number
}): React.ReactNode {
  const { editorConfig } = useEditorConfigContext()

  const [DropdownIcon, setDropdownIcon] = React.useState<React.FC | undefined>()

  React.useEffect(() => {
    if (group?.type === 'dropdown' && group.items.length && group.ChildComponent) {
      setDropdownIcon(() => group.ChildComponent)
    } else {
      setDropdownIcon(undefined)
    }
  }, [group])

  const onActiveChange = useCallback(
    ({ activeItems }: { activeItems: ToolbarGroupItem[] }) => {
      if (!activeItems.length) {
        if (group?.type === 'dropdown' && group.items.length && group.ChildComponent) {
          setDropdownIcon(() => group.ChildComponent)
        } else {
          setDropdownIcon(undefined)
        }
        return
      }
      const item = activeItems[0]
      setDropdownIcon(() => item?.ChildComponent)
    },
    [group],
  )

  return (
    <div
      className={`inline-toolbar-popup__group inline-toolbar-popup__group-${group.key}`}
      data-toolbar-group-key={group.key}
      key={group.key}
    >
      {group.type === 'dropdown' && group.items.length ? (
        DropdownIcon ? (
          <ToolbarDropdown
            anchorElem={anchorElem}
            editor={editor}
            group={group}
            Icon={DropdownIcon}
            maxActiveItems={group.maxActiveItems ?? 1}
            onActiveChange={onActiveChange}
          />
        ) : (
          <ToolbarDropdown
            anchorElem={anchorElem}
            editor={editor}
            group={group}
            maxActiveItems={group.maxActiveItems ?? 1}
            onActiveChange={onActiveChange}
          />
        )
      ) : null}
      {group.type === 'buttons' && group.items.length
        ? group.items.map((item) => {
            return (
              <ButtonGroupItem anchorElem={anchorElem} editor={editor} item={item} key={item.key} />
            )
          })
        : null}
      {index < editorConfig.features.toolbarInline?.groups.length - 1 && (
        <div className="divider" />
      )}
    </div>
  )
}

function InlineToolbar({
  anchorElem,
  editor,
}: {
  anchorElem: HTMLElement
  editor: LexicalEditor
}): React.ReactNode {
  const floatingToolbarRef = useRef<HTMLDivElement | null>(null)
  const caretRef = useRef<HTMLDivElement | null>(null)

  const { editorConfig } = useEditorConfigContext()

  const closeFloatingToolbar = useCallback(() => {
    if (floatingToolbarRef?.current) {
      const isOpacityZero = floatingToolbarRef.current.style.opacity === '0'
      const isPointerEventsNone = floatingToolbarRef.current.style.pointerEvents === 'none'

      if (!isOpacityZero) {
        floatingToolbarRef.current.style.opacity = '0'
      }
      if (!isPointerEventsNone) {
        floatingToolbarRef.current.style.pointerEvents = 'none'
      }
    }
  }, [floatingToolbarRef])

  const mouseMoveListener = useCallback(
    (e: MouseEvent) => {
      if (floatingToolbarRef?.current && (e.buttons === 1 || e.buttons === 3)) {
        const isOpacityZero = floatingToolbarRef.current.style.opacity === '0'
        const isPointerEventsNone = floatingToolbarRef.current.style.pointerEvents === 'none'
        if (!isOpacityZero || !isPointerEventsNone) {
          // Check if the mouse is not over the popup
          const x = e.clientX
          const y = e.clientY
          const elementUnderMouse = document.elementFromPoint(x, y)
          if (!floatingToolbarRef.current.contains(elementUnderMouse)) {
            // Mouse is not over the target element => not a normal click, but probably a drag
            closeFloatingToolbar()
          }
        }
      }
    },
    [closeFloatingToolbar],
  )

  const mouseUpListener = useCallback(() => {
    if (floatingToolbarRef?.current) {
      if (floatingToolbarRef.current.style.opacity !== '1') {
        floatingToolbarRef.current.style.opacity = '1'
      }
      if (floatingToolbarRef.current.style.pointerEvents !== 'auto') {
        floatingToolbarRef.current.style.pointerEvents = 'auto'
      }
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', mouseMoveListener)
    document.addEventListener('mouseup', mouseUpListener)

    return () => {
      document.removeEventListener('mousemove', mouseMoveListener)
      document.removeEventListener('mouseup', mouseUpListener)
    }
  }, [floatingToolbarRef, mouseMoveListener, mouseUpListener])

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection()

    const nativeSelection = getDOMSelection(editor._window)

    if (floatingToolbarRef.current === null) {
      return
    }

    const possibleLinkEditor = anchorElem.querySelector(':scope > .link-editor')
    const isLinkEditorVisible =
      possibleLinkEditor !== null &&
      'style' in possibleLinkEditor &&
      possibleLinkEditor?.style?.['opacity' as keyof typeof possibleLinkEditor.style] === '1'

    const rootElement = editor.getRootElement()
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement)

      // Position floating toolbar
      const offsetIfFlipped = setFloatingElemPosition({
        alwaysDisplayOnTop: isLinkEditorVisible,
        anchorElem,
        floatingElem: floatingToolbarRef.current,
        horizontalPosition: 'center',
        targetRect: rangeRect,
      })

      // Position caret
      if (caretRef.current) {
        setFloatingElemPosition({
          anchorElem: floatingToolbarRef.current,
          anchorFlippedOffset: offsetIfFlipped,
          floatingElem: caretRef.current,
          horizontalOffset: 5,
          horizontalPosition: 'center',
          specialHandlingForCaret: true,
          targetRect: rangeRect,
          verticalGap: 8,
        })
      }
    } else {
      closeFloatingToolbar()
    }
  }, [editor, closeFloatingToolbar, anchorElem])

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement

    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar()
      })
    }

    window.addEventListener('resize', update)
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update)
    }

    return () => {
      window.removeEventListener('resize', update)
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update)
      }
    }
  }, [editor, $updateTextFormatFloatingToolbar, anchorElem])

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar()
    })
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateTextFormatFloatingToolbar()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar()
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, $updateTextFormatFloatingToolbar])

  return (
    <div className="inline-toolbar-popup" ref={floatingToolbarRef}>
      <div className="caret" ref={caretRef} />
      {editorConfig?.features &&
        editorConfig.features?.toolbarInline?.groups.map((group, i) => {
          return (
            <ToolbarGroupComponent
              anchorElem={anchorElem}
              editor={editor}
              group={group}
              index={i}
              key={group.key}
            />
          )
        })}
    </div>
  )
}

function useInlineToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
): null | React.ReactElement {
  const [isText, setIsText] = useState(false)
  const isEditable = useLexicalEditable()

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return
      }
      const selection = $getSelection()
      const nativeSelection = getDOMSelection(editor._window)
      const rootElement = editor.getRootElement()

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false)
        return
      }

      if (!$isRangeSelection(selection)) {
        return
      }

      if (selection.getTextContent() !== '') {
        const nodes = selection.getNodes()
        let foundNodeWithText = false
        for (const node of nodes) {
          if ($isTextNode(node)) {
            setIsText(true)
            foundNodeWithText = true
            break
          }
        }
        if (!foundNodeWithText) {
          setIsText(false)
        }
      } else {
        setIsText(false)
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, '')
      if (!selection.isCollapsed() && rawTextContent === '') {
        setIsText(false)
        return
      }
    })
  }, [editor])

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup)
    document.addEventListener('mouseup', updatePopup)
    return () => {
      document.removeEventListener('selectionchange', updatePopup)
      document.removeEventListener('mouseup', updatePopup)
    }
  }, [updatePopup])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup()
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false)
        }
      }),
    )
  }, [editor, updatePopup])

  if (!isText || !isEditable) {
    return null
  }

  return createPortal(<InlineToolbar anchorElem={anchorElem} editor={editor} />, anchorElem)
}

export const InlineToolbarPlugin: PluginComponentWithAnchor<undefined> = ({ anchorElem }) => {
  const [editor] = useLexicalComposerContext()

  return useInlineToolbar(editor, anchorElem)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/inline/server/index.ts

```typescript
import { createServerFeature } from '../../../../utilities/createServerFeature.js'

export const InlineToolbarFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient',
  },
  key: 'toolbarInline',
})
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/shared/ToolbarButton/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .toolbar-popup__button {
    display: flex;
    align-items: center;
    vertical-align: middle;
    justify-content: center;
    height: 30px;
    width: 30px;
    border: 0;
    background: none;
    border-radius: $style-radius-m;
    cursor: pointer;
    padding: 0;
    transition: background-color 0.15s cubic-bezier(0, 0.2, 0.2, 1);

    &.spaced {
      margin-right: 2px;
    }

    &:hover:not(.disabled) {
      background-color: var(--theme-elevation-100);
    }

    &.active {
      background-color: var(--theme-elevation-150);
      color: var(--theme-text);
      &:hover {
        background-color: var(--theme-elevation-200);
      }

      .icon {
        opacity: 1;
      }
    }

    &.disabled {
      cursor: not-allowed;

      .icon {
        opacity: 0.2;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/toolbars/shared/ToolbarButton/index.tsx
Signals: React

```typescript
'use client'
import type { LexicalEditor } from 'lexical'

import { mergeRegister } from '@lexical/utils'
import { $addUpdateTag, $getSelection } from 'lexical'
import React, { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'

import type { ToolbarGroupItem } from '../../types.js'

import { useEditorConfigContext } from '../../../../lexical/config/client/EditorConfigProvider.js'
import './index.scss'
import { useRunDeprioritized } from '../../../../utilities/useRunDeprioritized.js'

const baseClass = 'toolbar-popup__button'

export const ToolbarButton = ({
  children,
  editor,
  item,
}: {
  children: React.JSX.Element
  editor: LexicalEditor
  item: ToolbarGroupItem
}) => {
  const [_state, setState] = useState({ active: false, enabled: true })
  const deferredState = useDeferredValue(_state)

  const editorConfigContext = useEditorConfigContext()

  const className = useMemo(() => {
    return [
      baseClass,
      !deferredState.enabled ? 'disabled' : '',
      deferredState.active ? 'active' : '',
      item.key ? `${baseClass}-${item.key}` : '',
    ]
      .filter(Boolean)
      .join(' ')
  }, [deferredState, item.key])
  const updateStates = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection()
      if (!selection) {
        return
      }
      const newActive = item.isActive
        ? item.isActive({ editor, editorConfigContext, selection })
        : false

      const newEnabled = item.isEnabled
        ? item.isEnabled({ editor, editorConfigContext, selection })
        : true

      setState((prev) => {
        if (prev.active === newActive && prev.enabled === newEnabled) {
          return prev
        }
        return { active: newActive, enabled: newEnabled }
      })
    })
  }, [editor, editorConfigContext, item])

  const runDeprioritized = useRunDeprioritized()

  useEffect(() => {
    // Run on mount
    void runDeprioritized(updateStates)

    const listener = () => runDeprioritized(updateStates)

    const cleanup = mergeRegister(editor.registerUpdateListener(listener))
    document.addEventListener('mouseup', listener)

    return () => {
      cleanup()
      document.removeEventListener('mouseup', listener)
    }
  }, [editor, runDeprioritized, updateStates])

  const handleClick = useCallback(() => {
    if (!_state.enabled) {
      return
    }

    editor.focus(() => {
      editor.update(() => {
        $addUpdateTag('toolbar')
      })
      // We need to wrap the onSelect in the callback, so the editor is properly focused before the onSelect is called.
      item.onSelect?.({
        editor,
        isActive: _state.active,
      })
    })
  }, [editor, item, _state])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // This fixes a bug where you are unable to click the button if you are in a NESTED editor (editor in blocks field in editor).
    // Thus only happens if you click on the SVG of the button. Clicking on the outside works. Related issue: https://github.com/payloadcms/payload/issues/4025
    // TODO: Find out why exactly it happens and why e.preventDefault() on the mouseDown fixes it. Write that down here, or potentially fix a root cause, if there is any.
    e.preventDefault()
  }, [])

  return (
    <button
      className={className}
      data-button-key={item.key}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      type="button"
    >
      {children}
    </button>
  )
}
```

--------------------------------------------------------------------------------

````
