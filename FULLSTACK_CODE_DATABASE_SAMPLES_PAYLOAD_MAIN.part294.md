---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 294
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 294 of 695)

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

---[FILE: LexicalMenu.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/SlashMenu/LexicalTypeaheadMenuPlugin/LexicalMenu.tsx
Signals: React

```typescript
'use client'
import type { BaseSelection, LexicalCommand, LexicalEditor, TextNode } from 'lexical'
import type { JSX, ReactPortal, RefObject } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  KEY_TAB_COMMAND,
} from 'lexical'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { MenuTextMatch } from '../useMenuTriggerMatch.js'
import type { SlashMenuGroupInternal, SlashMenuItem, SlashMenuItemInternal } from './types.js'

import { CAN_USE_DOM } from '../../../utils/canUseDOM.js'

export type MenuResolution = {
  getRect: () => DOMRect
  match?: MenuTextMatch
}

const baseClass = 'slash-menu-popup'

export type MenuRenderFn = (
  anchorElementRef: RefObject<HTMLElement | null>,
  itemProps: {
    groups: Array<SlashMenuGroupInternal>
    selectedItemKey: null | string
    selectItemAndCleanUp: (selectedItem: SlashMenuItem) => void
    setSelectedItemKey: (itemKey: string) => void
  },
  matchingString: null | string,
) => JSX.Element | null | ReactPortal

const scrollIntoViewIfNeeded = (target: HTMLElement) => {
  const typeaheadContainerNode = document.getElementById('slash-menu')
  if (!typeaheadContainerNode) {
    return
  }

  const typeaheadRect = typeaheadContainerNode.getBoundingClientRect()

  if (typeaheadRect.top + typeaheadRect.height > window.innerHeight) {
    typeaheadContainerNode.scrollIntoView({
      block: 'center',
    })
  }

  if (typeaheadRect.top < 0) {
    typeaheadContainerNode.scrollIntoView({
      block: 'center',
    })
  }

  target.scrollIntoView({ block: 'nearest' })
}

/**
 * Walk backwards along user input and forward through entity title to try
 * and replace more of the user's text with entity.
 */
function getFullMatchOffset(documentText: string, entryText: string, offset: number) {
  let triggerOffset = offset
  for (let i = triggerOffset; i <= entryText.length; i++) {
    if (documentText.substring(documentText.length - i) === entryText.substring(0, i)) {
      triggerOffset = i
    }
  }
  return triggerOffset
}

/**
 * Split Lexical TextNode and return a new TextNode only containing matched text.
 * Common use cases include: removing the node, replacing with a new node.
 */
function $splitNodeContainingQuery(match: MenuTextMatch): TextNode | undefined {
  const selection = $getSelection()
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    return
  }
  const anchor = selection.anchor
  if (anchor.type !== 'text') {
    return
  }
  const anchorNode = anchor.getNode()
  if (!anchorNode.isSimpleText()) {
    return
  }
  const selectionOffset = anchor.offset
  const textContent = anchorNode.getTextContent().slice(0, selectionOffset)
  const characterOffset = match.replaceableString.length
  const queryOffset = getFullMatchOffset(textContent, match.matchingString, characterOffset)
  const startOffset = selectionOffset - queryOffset
  if (startOffset < 0) {
    return
  }
  let newNode
  if (startOffset === 0) {
    ;[newNode] = anchorNode.splitText(selectionOffset)
  } else {
    ;[, newNode] = anchorNode.splitText(startOffset, selectionOffset)
  }

  return newNode
}

// Got from https://stackoverflow.com/a/42543908/2013580
export function getScrollParent(
  element: HTMLElement,
  includeHidden: boolean,
): HTMLBodyElement | HTMLElement {
  let style = getComputedStyle(element)
  const excludeStaticParent = style.position === 'absolute'
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/
  if (style.position === 'fixed') {
    return document.body
  }
  for (let parent: HTMLElement | null = element; (parent = parent.parentElement); ) {
    style = getComputedStyle(parent)
    if (excludeStaticParent && style.position === 'static') {
      continue
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent
    }
  }
  return document.body
}

function isTriggerVisibleInNearestScrollContainer(
  targetElement: HTMLElement,
  containerElement: HTMLElement,
): boolean {
  const tRect = targetElement.getBoundingClientRect()
  const cRect = containerElement.getBoundingClientRect()
  return tRect.top > cRect.top && tRect.top < cRect.bottom
}

// Reposition the menu on scroll, window resize, and element resize.
export function useDynamicPositioning(
  resolution: MenuResolution | null,
  targetElementRef: RefObject<HTMLElement | null>,
  onReposition: () => void,
  onVisibilityChange?: (isInView: boolean) => void,
) {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    const targetElement = targetElementRef.current
    if (targetElement != null && resolution != null) {
      const rootElement = editor.getRootElement()
      const rootScrollParent =
        rootElement != null ? getScrollParent(rootElement, false) : document.body
      let ticking = false
      let previousIsInView = isTriggerVisibleInNearestScrollContainer(
        targetElement,
        rootScrollParent,
      )
      const handleScroll = function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            onReposition()
            ticking = false
          })
          ticking = true
        }
        const isInView = isTriggerVisibleInNearestScrollContainer(targetElement, rootScrollParent)
        if (isInView !== previousIsInView) {
          previousIsInView = isInView
          if (onVisibilityChange != null) {
            onVisibilityChange(isInView)
          }
        }
      }
      const resizeObserver = new ResizeObserver(onReposition)
      window.addEventListener('resize', onReposition)
      document.addEventListener('scroll', handleScroll, {
        capture: true,
        passive: true,
      })
      resizeObserver.observe(targetElement)
      return () => {
        resizeObserver.disconnect()
        window.removeEventListener('resize', onReposition)
        document.removeEventListener('scroll', handleScroll, true)
      }
    }
  }, [editor, onVisibilityChange, onReposition, resolution, targetElementRef])
}

export const SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND: LexicalCommand<{
  index: number
  item: SlashMenuItemInternal
}> = createCommand('SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND')

export function LexicalMenu({
  anchorElementRef,
  close,
  editor,
  // groups filtering is already handled in SlashMenu/index.tsx. Thus, groups always contains the matching items.
  groups,
  menuRenderFn,
  resolution,
  shouldSplitNodeWithQuery = false,
}: {
  anchorElementRef: RefObject<HTMLElement | null>
  close: () => void
  editor: LexicalEditor
  groups: Array<SlashMenuGroupInternal>
  menuRenderFn: MenuRenderFn
  resolution: MenuResolution
  shouldSplitNodeWithQuery?: boolean
}): JSX.Element | null {
  const [selectedItemKey, setSelectedItemKey] = useState<null | string>(null)

  const matchingString = (resolution.match && resolution.match.matchingString) || ''

  const updateSelectedItem = useCallback(
    (item: SlashMenuItem) => {
      const rootElem = editor.getRootElement()
      if (rootElem !== null) {
        rootElem.setAttribute('aria-activedescendant', `${baseClass}__item-${item.key}`)
        setSelectedItemKey(item.key)
      }
    },
    [editor],
  )

  const setSelectedItemKeyToFirstMatchingItem = useCallback(() => {
    // set selected item to the first of the matching ones
    if (groups !== null && matchingString != null) {
      // groups filtering is already handled in SlashMenu/index.tsx. Thus, groups always contains the matching items.
      const allItems = groups.flatMap((group) => group.items)

      if (allItems.length) {
        const firstMatchingItem = allItems[0]!
        updateSelectedItem(firstMatchingItem)
      }
    }
  }, [groups, updateSelectedItem, matchingString])

  useEffect(() => {
    setSelectedItemKeyToFirstMatchingItem()
  }, [matchingString, setSelectedItemKeyToFirstMatchingItem])

  const selectItemAndCleanUp = useCallback(
    (selectedItem: SlashMenuItem) => {
      close()

      editor.update(() => {
        const textNodeContainingQuery =
          resolution.match != null && shouldSplitNodeWithQuery
            ? $splitNodeContainingQuery(resolution.match)
            : null

        if (textNodeContainingQuery) {
          textNodeContainingQuery.remove()
        }
      })

      setTimeout(() => {
        // Needed in Firefox. See https://github.com/payloadcms/payload/issues/10724
        let selection: BaseSelection | undefined
        editor.read(() => {
          selection = $getSelection()?.clone()
        })
        editor.update(() => {
          if (selection) {
            $setSelection(selection)
          }
        })

        selectedItem.onSelect({
          editor,
          queryString: resolution.match ? resolution.match.matchingString : '',
        })
      }, 0)
    },
    [editor, shouldSplitNodeWithQuery, resolution.match, close],
  )

  useEffect(() => {
    return () => {
      const rootElem = editor.getRootElement()
      if (rootElem !== null) {
        rootElem.removeAttribute('aria-activedescendant')
      }
    }
  }, [editor])

  useLayoutEffect(() => {
    if (groups === null) {
      setSelectedItemKey(null)
    } else if (selectedItemKey === null) {
      setSelectedItemKeyToFirstMatchingItem()
    }
  }, [groups, selectedItemKey, updateSelectedItem, setSelectedItemKeyToFirstMatchingItem])

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND,
        ({ item }) => {
          if (item.ref && item.ref.current != null) {
            scrollIntoViewIfNeeded(item.ref.current)
            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, updateSelectedItem])

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_DOWN_COMMAND,
        (payload) => {
          const event = payload
          if (groups !== null && groups.length && selectedItemKey !== null) {
            const allItems = groups.flatMap((group) => group.items)
            const selectedIndex = allItems.findIndex((item) => item.key === selectedItemKey)

            const newSelectedIndex = selectedIndex !== allItems.length - 1 ? selectedIndex + 1 : 0

            const newSelectedItem = allItems[newSelectedIndex]
            if (!newSelectedItem) {
              return false
            }

            updateSelectedItem(newSelectedItem)
            if (newSelectedItem.ref != null && newSelectedItem.ref.current) {
              editor.dispatchCommand(SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND, {
                index: newSelectedIndex,
                item: newSelectedItem,
              })
            }
            event.preventDefault()
            event.stopImmediatePropagation()
          }
          return true
        },
        COMMAND_PRIORITY_NORMAL,
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_UP_COMMAND,
        (payload) => {
          const event = payload
          if (groups !== null && groups.length && selectedItemKey !== null) {
            const allItems = groups.flatMap((group) => group.items)
            const selectedIndex = allItems.findIndex((item) => item.key === selectedItemKey)

            const newSelectedIndex = selectedIndex !== 0 ? selectedIndex - 1 : allItems.length - 1

            const newSelectedItem = allItems[newSelectedIndex]
            if (!newSelectedItem) {
              return false
            }

            updateSelectedItem(newSelectedItem)
            if (newSelectedItem.ref != null && newSelectedItem.ref.current) {
              scrollIntoViewIfNeeded(newSelectedItem.ref.current)
            }
            event.preventDefault()
            event.stopImmediatePropagation()
          }
          return true
        },
        COMMAND_PRIORITY_NORMAL,
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ESCAPE_COMMAND,
        (payload) => {
          const event = payload
          event.preventDefault()
          event.stopImmediatePropagation()
          close()
          return true
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_TAB_COMMAND,
        (payload) => {
          const event = payload

          if (groups === null || selectedItemKey === null) {
            return false
          }
          const allItems = groups.flatMap((group) => group.items)
          const selectedItem = allItems.find((item) => item.key === selectedItemKey)
          if (!selectedItem) {
            return false
          }

          event.preventDefault()
          event.stopImmediatePropagation()
          selectItemAndCleanUp(selectedItem)
          return true
        },
        COMMAND_PRIORITY_NORMAL,
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event: KeyboardEvent | null) => {
          if (groups === null || selectedItemKey === null) {
            return false
          }
          const allItems = groups.flatMap((group) => group.items)
          const selectedItem = allItems.find((item) => item.key === selectedItemKey)
          if (!selectedItem) {
            return false
          }

          if (event !== null) {
            event.preventDefault()
            event.stopImmediatePropagation()
          }
          selectItemAndCleanUp(selectedItem)
          return true
        },
        COMMAND_PRIORITY_NORMAL,
      ),
    )
  }, [selectItemAndCleanUp, close, editor, groups, selectedItemKey, updateSelectedItem])

  const listItemProps = useMemo(
    () => ({
      groups,
      selectedItemKey,
      selectItemAndCleanUp,
      setSelectedItemKey,
    }),
    [selectItemAndCleanUp, selectedItemKey, groups],
  )

  return menuRenderFn(
    anchorElementRef,
    listItemProps,
    resolution.match ? resolution.match.matchingString : '',
  )
}

function setContainerDivAttributes(containerDiv: HTMLElement, className?: string) {
  if (className != null) {
    containerDiv.className = className
  }
  containerDiv.setAttribute('aria-label', 'Slash menu')
  containerDiv.setAttribute('role', 'listbox')
  containerDiv.style.display = 'block'
  containerDiv.style.position = 'absolute'
}

export function useMenuAnchorRef(
  anchorElem: HTMLElement,
  resolution: MenuResolution | null,
  setResolution: (r: MenuResolution | null) => void,
  className?: string,
): RefObject<HTMLElement | null> {
  const [editor] = useLexicalComposerContext()
  const anchorElementRef = useRef<HTMLElement | null>(
    CAN_USE_DOM ? document.createElement('div') : null,
  )
  const positionMenu = useCallback(() => {
    if (anchorElementRef.current === null || parent === undefined) {
      return
    }
    const rootElement = editor.getRootElement()
    const containerDiv = anchorElementRef.current

    const VERTICAL_OFFSET = 32

    const menuEle = containerDiv.firstChild as Element
    if (rootElement !== null && resolution !== null) {
      const { height, width } = resolution.getRect()
      let { left, top } = resolution.getRect()

      const rawTop = top
      top -= anchorElem.getBoundingClientRect().top + window.scrollY
      left -= anchorElem.getBoundingClientRect().left + window.scrollX
      containerDiv.style.left = `${left + window.scrollX}px`
      containerDiv.style.height = `${height}px`
      containerDiv.style.width = `${width}px`
      if (menuEle !== null) {
        const menuRect = menuEle.getBoundingClientRect()
        const menuHeight = menuRect.height
        const menuWidth = menuRect.width

        const rootElementRect = rootElement.getBoundingClientRect()

        const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl'
        const anchorRect = anchorElem.getBoundingClientRect()
        const leftBoundary = Math.max(0, rootElementRect.left)

        if (!isRTL && left + menuWidth > rootElementRect.right) {
          containerDiv.style.left = `${rootElementRect.right - menuWidth + window.scrollX}px`
        } else if (isRTL && menuRect.left < leftBoundary) {
          const newLeft = leftBoundary + menuWidth - anchorRect.left
          containerDiv.style.left = `${newLeft + window.scrollX}px`
        }

        const wouldGoOffBottomOfScreen = rawTop + menuHeight + VERTICAL_OFFSET > window.innerHeight
        //const wouldGoOffBottomOfContainer = top + menuHeight > rootElementRect.bottom
        const wouldGoOffTopOfScreen = rawTop < 0

        // Position slash menu above the cursor instead of below (default) if it would otherwise go off the bottom of the screen.
        if (wouldGoOffBottomOfScreen && !wouldGoOffTopOfScreen) {
          const margin = 24
          containerDiv.style.top = `${
            top + VERTICAL_OFFSET - menuHeight + window.scrollY - (height + margin)
          }px`
        } else {
          containerDiv.style.top = `${top + window.scrollY + VERTICAL_OFFSET}px`
        }
      }

      if (!containerDiv.isConnected) {
        setContainerDivAttributes(containerDiv, className)
        anchorElem.append(containerDiv)
      }
      containerDiv.setAttribute('id', 'slash-menu')
      anchorElementRef.current = containerDiv
      rootElement.setAttribute('aria-controls', 'slash-menu')
    }
  }, [editor, resolution, className, anchorElem])

  useEffect(() => {
    const rootElement = editor.getRootElement()
    if (resolution !== null) {
      positionMenu()
      return () => {
        if (rootElement !== null) {
          rootElement.removeAttribute('aria-controls')
        }

        const containerDiv = anchorElementRef.current
        if (containerDiv !== null && containerDiv.isConnected) {
          containerDiv.remove()
          containerDiv.removeAttribute('id')
        }
      }
    }
  }, [editor, positionMenu, resolution])

  const onVisibilityChange = useCallback(
    (isInView: boolean) => {
      if (resolution !== null) {
        if (!isInView) {
          setResolution(null)
        }
      }
    },
    [resolution, setResolution],
  )

  useDynamicPositioning(resolution, anchorElementRef, positionMenu, onVisibilityChange)

  return anchorElementRef
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/SlashMenu/LexicalTypeaheadMenuPlugin/types.ts
Signals: React

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type { LexicalEditor, Spread } from 'lexical'
import type React from 'react'
import type { RefObject } from 'react'

import type { FeatureClientSchemaMap } from '../../../../types.js'

export type SlashMenuItem = {
  /** The icon which is rendered in your slash menu item. */
  Icon: React.FC
  /** Each slash menu item needs to have a unique key. The key will be matched when typing, displayed if no `label` property is set, and used for classNames. */
  key: string
  /**
   * Keywords are used to match the item for different texts typed after the '/'.
   * E.g. you might want to show a horizontal rule item if you type both /hr, /separator, /horizontal etc.
   * In addition to the keywords, the label and key will be used to find the right slash menu item.
   */
  keywords?: Array<string>
  /** The label will be displayed in your slash menu item. In order to make use of i18n, this can be a function. */
  label?:
    | ((args: {
        featureClientSchemaMap: FeatureClientSchemaMap
        i18n: I18nClient<{}, string>
        schemaPath: string
      }) => string)
    | string
  /** A function which is called when the slash menu item is selected. */
  onSelect: ({ editor, queryString }: { editor: LexicalEditor; queryString: string }) => void
}

export type SlashMenuGroup = {
  /**
   * An array of `SlashMenuItem`'s which will be displayed in the slash menu.
   */
  items: Array<SlashMenuItem>
  /**
   * Used for class names and, if label is not provided, for display. Slash menus with the same key will have their items merged together.
   */
  key: string
  /** The label will be displayed before your Slash Menu group. In order to make use of i18n, this can be a function. */
  label?:
    | ((args: {
        featureClientSchemaMap: FeatureClientSchemaMap
        i18n: I18nClient<{}, string>
        schemaPath: string
      }) => string)
    | string
}

export type SlashMenuItemInternal = {
  ref: RefObject<HTMLButtonElement | null>
} & SlashMenuItem

export type SlashMenuGroupInternal = Spread<
  {
    items: Array<SlashMenuItemInternal>
  },
  SlashMenuGroup
>
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/TextPlugin/index.tsx
Signals: React

```typescript
'use client'
import type { TextFormatType } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TEXT_TYPE_TO_FORMAT, TextNode } from 'lexical'
import { useEffect } from 'react'

import type { SanitizedClientFeatures } from '../../../features/typesClient.js'

export function TextPlugin({ features }: { features: SanitizedClientFeatures }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const disabledFormats = getDisabledFormats(features.enabledFormats)
    if (disabledFormats.length === 0) {
      return
    }
    // Ideally override the TextNode with our own TextNode (changing its setFormat or toggleFormat methods),
    // would be more performant. If we find a noticeable perf regression we can switch to that option.
    // Overriding the FORMAT_TEXT_COMMAND and PASTE_COMMAND commands is not an option I considered because
    // there might be other forms of mutation that we might not be considering. For example:
    // browser extensions or Payload/Lexical plugins that have their own commands.
    return editor.registerNodeTransform(TextNode, (textNode) => {
      disabledFormats.forEach((disabledFormat) => {
        if (textNode.hasFormat(disabledFormat)) {
          textNode.toggleFormat(disabledFormat)
        }
      })
    })
  }, [editor, features])

  return null
}

function getDisabledFormats(enabledFormats: TextFormatType[]): TextFormatType[] {
  const allFormats = Object.keys(TEXT_TYPE_TO_FORMAT) as TextFormatType[]
  const enabledSet = new Set(enabledFormats)

  return allFormats.filter((format) => !enabledSet.has(format))
}
```

--------------------------------------------------------------------------------

---[FILE: EditorTheme.scss]---
Location: payload-main/packages/richtext-lexical/src/lexical/theme/EditorTheme.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .LexicalEditorTheme {
    &__ltr {
      text-align: left;
    }

    &__rtl {
      text-align: right;
    }

    &__paragraph {
      font-size: base(0.8);
      margin-bottom: 0.55em;
      position: relative;
      line-height: 1.5;
      letter-spacing: normal;
      color: var(--theme-text);
    }

    &__quote {
      color: var(--theme-text);
      font-size: base(0.8);
      margin-block: base(0.8);
      margin-inline: base(0.2);
      border-inline-start-color: var(--theme-elevation-150);
      border-inline-start-width: base(0.2);
      border-inline-start-style: solid;
      padding-inline-start: base(0.6);
      padding-block: base(0.2);
    }

    &__h1,
    &__h2,
    &__h3,
    &__h4,
    &__h5,
    &__h6 {
      font-family: var(--font-body);
      line-height: 1.125;
      letter-spacing: 0;
      color: var(--theme-text);
    }

    &__h1 {
      font-size: base(1.4);
      font-weight: 700;
      margin-block: 0.5em 0.4em;
    }

    &__h2 {
      font-size: base(1.25);
      font-weight: 700;
      margin-block: 0.55em 0.4em;
    }

    &__h3 {
      font-size: base(1.1);
      font-weight: 700;
      margin-block: 0.6em 0.4em;
    }

    &__h4 {
      font-size: base(1);
      font-weight: 700;
      margin-block: 0.65em 0.4em;
    }

    &__h5 {
      font-size: base(0.9);
      font-weight: 700;
      margin-block: 0.7em 0.4em;
    }

    &__h6 {
      font-size: base(0.8);
      font-weight: 700;
      margin-block: 0.75em 0.4em;
    }

    &__indent {
      --lexical-indent-base-value: 40px;
    }

    &__textBold {
      font-weight: bold;
    }

    &__textItalic {
      font-style: italic;
    }

    &__textUnderline {
      text-decoration: underline;
    }

    &__textStrikethrough {
      text-decoration: line-through;
    }

    &__textUnderlineStrikethrough {
      text-decoration: underline line-through;
    }

    &__tabNode {
      position: relative;
      text-decoration: none;
    }

    &__tabNode.LexicalEditorTheme__textUnderline::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.15em;
      border-bottom: 0.1em solid currentColor;
    }

    &__tabNode.LexicalEditorTheme__textStrikethrough::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0.69em;
      border-top: 0.1em solid currentColor;
    }

    &__tabNode.LexicalEditorTheme__textUnderlineStrikethrough::before,
    &__tabNode.LexicalEditorTheme__textUnderlineStrikethrough::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
    }

    &__tabNode.LexicalEditorTheme__textUnderlineStrikethrough::before {
      top: 0.69em;
      border-top: 0.1em solid currentColor;
    }

    &__tabNode.LexicalEditorTheme__textUnderlineStrikethrough::after {
      bottom: 0.05em;
      border-bottom: 0.1em solid currentColor;
    }

    &__textSubscript {
      font-size: 0.8em;
      vertical-align: sub !important;
    }

    &__textSuperscript {
      font-size: 0.8em;
      vertical-align: super;
    }

    &__textCode {
      background-color: var(--theme-elevation-50);
      border: 1px solid var(--theme-elevation-150);
      color: var(--theme-error-600);
      padding: base(0.1) base(0.2);
      font-family: 'SF Mono', Menlo, Consolas, Monaco, monospace;
      font-size: 0.875em;
      border-radius: var(--style-radius-s);
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }

    &__link {
      color: var(--theme-success-750);
      text-decoration: none;
      border-bottom: 1px dotted;
      pointer-events: none;
    }

    // Renders cursor when native browser does not. See https://github.com/facebook/lexical/issues/3417
    &__blockCursor {
      display: block;
      pointer-events: none;
      position: absolute;

      &:after {
        content: '';
        display: block;
        position: absolute;
        top: -2px;
        width: 20px;
        border-top: 1px solid var(--theme-text);
        animation: CursorBlink 1.1s steps(2, start) infinite;
      }
    }

    @keyframes CursorBlink {
      to {
        visibility: hidden;
      }
    }

    &__ol1 {
      padding: 0;
      list-style-position: outside;
      margin: base(0.4) 0 base(0.8);
    }

    &__ol2 {
      padding: 0;
      margin: 0;
      list-style-type: upper-alpha;
      list-style-position: outside;
    }

    &__ol3 {
      padding: 0;
      margin: 0;
      list-style-type: lower-alpha;
      list-style-position: outside;
    }

    &__ol4 {
      padding: 0;
      margin: 0;
      list-style-type: upper-roman;
      list-style-position: outside;
    }

    &__ol5 {
      padding: 0;
      margin: 0;
      list-style-type: lower-roman;
      list-style-position: outside;
    }

    &__ul {
      padding: 0;
      margin: base(0.4) 0 base(0.8);
      list-style-position: outside;
    }

    &__ul ul {
      margin: 0;
    }

    &__listItem {
      font-size: base(0.8);
      margin: 0 0 0.4em 40px;
      color: var(--theme-text);
    }

    &__listItem::marker {
      // See https://github.com/facebook/lexical/pull/7325/files#diff-915a0be0588ee3ceb38aca4ae182f51291c8885e7af5f8dca2a91f8d92a95e0c
      // These are applied by the ListItemNode
      color: var(--listitem-marker-color);
      background-color: var(--listitem-marker-background-color);
      font-family: var(--listitem-marker-font-family);
      font-size: var(--listitem-marker-font-size);
    }

    &__listItem[dir='rtl'] {
      margin: 0 40px 0.4em 0;
    }

    &__listItemChecked,
    &__listItemUnchecked {
      position: relative;
      // Instead of having margin-left: 40px like other list-items or indented paragraphs,
      // we use padding-left: 25px + margin-left: 15px = 40px, so that the click position
      // calculation in `CheckListPlugin` matches the checkbox
      margin-left: 15px;
      padding-left: 25px;
      list-style-type: none;
      outline: none;
    }

    // See comment above for why we need this
    &__listItemUnchecked[dir='rtl'],
    &__listItemChecked[dir='rtl'] {
      margin-left: 0;
      padding-left: 0;
      padding-right: 25px;
      margin-right: 15px;
    }

    &__listItemChecked {
      text-decoration: line-through;
    }

    &__listItemUnchecked:before,
    &__listItemChecked:before {
      content: '';
      width: base(0.8);
      height: base(0.8);
      top: base(0.1);
      left: 0;
      cursor: pointer;
      display: block;
      background-size: cover;
      position: absolute;
    }

    &__listItemUnchecked[dir='rtl']:before,
    &__listItemChecked[dir='rtl']:before {
      left: auto;
      right: 0;
    }

    &__listItemUnchecked:focus:before,
    &__listItemChecked:focus:before {
      outline: 0;
      box-shadow: 0 0 3px 3px var(--theme-success-400);
      border: 1px solid var(--theme-elevation-250);
      border-radius: var(--style-radius-s);
    }

    &__listItemUnchecked:before {
      border: 1px solid var(--theme-elevation-250);
      border-radius: $style-radius-s;
    }

    &__listItemChecked:before {
      border: 1px solid var(--theme-elevation-500);
      border-radius: $style-radius-s;
      background-color: var(--theme-elevation-100);
      background-repeat: no-repeat;
    }

    &__listItemChecked:after {
      content: '';
      cursor: pointer;
      border-color: var(--theme-text);
      border-style: solid;
      position: absolute;
      display: block;
      top: 6px;
      width: 3px;
      left: 7px;
      right: 7px;
      height: 6px;
      transform: rotate(45deg);
      border-width: 0 2px 2px 0;
    }

    &__nestedListItem {
      list-style-type: none;
    }

    &__nestedListItem:before,
    &__nestedListItem:after {
      display: none;
    }
  }

  html[data-theme='dark'] {
    .LexicalEditorTheme__textCode {
      color: var(--theme-warning-600);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: EditorTheme.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/theme/EditorTheme.tsx

```typescript
import type { EditorThemeClasses } from 'lexical'

export const LexicalEditorTheme: EditorThemeClasses = {
  block: 'LexicalEditorTheme__block',
  blockCursor: 'LexicalEditorTheme__blockCursor',
  characterLimit: 'LexicalEditorTheme__characterLimit',
  code: 'LexicalEditorTheme__code',
  inlineBlock: 'LexicalEditorTheme__inlineBlock',

  heading: {
    h1: 'LexicalEditorTheme__h1',
    h2: 'LexicalEditorTheme__h2',
    h3: 'LexicalEditorTheme__h3',
    h4: 'LexicalEditorTheme__h4',
    h5: 'LexicalEditorTheme__h5',
    h6: 'LexicalEditorTheme__h6',
  },
  hr: 'LexicalEditorTheme__hr',
  hrSelected: 'LexicalEditorTheme__hrSelected',
  indent: 'LexicalEditorTheme__indent',
  link: 'LexicalEditorTheme__link',
  list: {
    checklist: 'LexicalEditorTheme__checklist',
    listitem: 'LexicalEditorTheme__listItem',
    listitemChecked: 'LexicalEditorTheme__listItemChecked',
    listitemUnchecked: 'LexicalEditorTheme__listItemUnchecked',
    nested: {
      listitem: 'LexicalEditorTheme__nestedListItem',
    },
    olDepth: [
      'LexicalEditorTheme__ol1',
      'LexicalEditorTheme__ol2',
      'LexicalEditorTheme__ol3',
      'LexicalEditorTheme__ol4',
      'LexicalEditorTheme__ol5',
    ],
    ul: 'LexicalEditorTheme__ul',
  },
  ltr: 'LexicalEditorTheme__ltr',
  mark: 'LexicalEditorTheme__mark',
  markOverlap: 'LexicalEditorTheme__markOverlap',
  paragraph: 'LexicalEditorTheme__paragraph',
  placeholder: 'LexicalEditorTheme__placeholder',
  quote: 'LexicalEditorTheme__quote',
  relationship: 'LexicalEditorTheme__relationship',
  rtl: 'LexicalEditorTheme__rtl',
  tab: 'LexicalEditorTheme__tabNode',
  table: 'LexicalEditorTheme__table',
  tableAddColumns: 'LexicalEditorTheme__tableAddColumns',
  tableAddRows: 'LexicalEditorTheme__tableAddRows',
  tableAlignment: {
    center: 'LexicalEditorTheme__tableAlignmentCenter',
    right: 'LexicalEditorTheme__tableAlignmentRight',
  },
  tableCell: 'LexicalEditorTheme__tableCell',
  tableCellActionButton: 'LexicalEditorTheme__tableCellActionButton',
  tableCellActionButtonContainer: 'LexicalEditorTheme__tableCellActionButtonContainer',
  tableCellHeader: 'LexicalEditorTheme__tableCellHeader',
  tableCellResizer: 'LexicalEditorTheme__tableCellResizer',
  tableCellSelected: 'LexicalEditorTheme__tableCellSelected',
  tableFrozenColumn: 'LexicalEditorTheme__tableFrozenColumn',
  tableRowStriping: 'LexicalEditorTheme__tableRowStriping',
  tableScrollableWrapper: 'LexicalEditorTheme__tableScrollableWrapper',
  tableSelected: 'LexicalEditorTheme__tableSelected',
  tableSelection: 'LexicalEditorTheme__tableSelection',
  text: {
    bold: 'LexicalEditorTheme__textBold',
    code: 'LexicalEditorTheme__textCode',
    italic: 'LexicalEditorTheme__textItalic',
    strikethrough: 'LexicalEditorTheme__textStrikethrough',
    subscript: 'LexicalEditorTheme__textSubscript',
    superscript: 'LexicalEditorTheme__textSuperscript',
    underline: 'LexicalEditorTheme__textUnderline',
    underlineStrikethrough: 'LexicalEditorTheme__textUnderlineStrikethrough',
  },
  upload: 'LexicalEditorTheme__upload',
}
```

--------------------------------------------------------------------------------

---[FILE: ContentEditable.scss]---
Location: payload-main/packages/richtext-lexical/src/lexical/ui/ContentEditable.scss

```text
@import '~@payloadcms/ui/scss';

$lexical-contenteditable-top-padding: 8px;
$lexical-contenteditable-bottom-padding: 8px;

@layer payload-default {
  .ContentEditable__root {
    border: 0;
    display: block;
    position: relative;
    tab-size: 1;
    outline: 0;
    padding-top: $lexical-contenteditable-top-padding;
    padding-bottom: $lexical-contenteditable-bottom-padding;
    padding-left: 0;
    padding-right: 0;

    &:focus-visible {
      outline: none !important;
    }

    & > * {
      transition: transform 0.2s ease-in-out;
      // will-change: transform; // breaks cursor rendering for empty paragraph blocks in safari, and creates other issues
    }
  }

  .rich-text-lexical--show-gutter
    > .rich-text-lexical__wrap
    > .editor-container
    > .editor-scroller
    > .editor {
    > .ContentEditable__root {
      padding-left: 3rem;
    }
    > .ContentEditable__root::before {
      content: ' ';
      position: absolute;
      top: $lexical-contenteditable-top-padding;
      left: 0;
      height: calc(
        100% - #{$lexical-contenteditable-top-padding} - #{$lexical-contenteditable-bottom-padding}
      );
      border-left: 1px solid var(--theme-elevation-100);
    }
  }

  html[data-theme='light'] {
    .rich-text-lexical.rich-text-lexical--show-gutter {
      &.error:not(:hover) {
        > .rich-text-lexical__wrap
          > .editor-container
          > .editor-scroller
          > .editor
          > .ContentEditable__root::before {
          border-left: 2px solid var(--theme-error-400);
        }
      }

      &.error:hover {
        > .rich-text-lexical__wrap
          > .editor-container
          > .editor-scroller
          > .editor
          > .ContentEditable__root::before {
          border-left: 2px solid var(--theme-error-500);
        }
      }
    }

    @include small-break {
      .rich-text-lexical {
        &.error {
          > .rich-text-lexical__wrap {
            @include lightInputError;
          }
        }
      }
    }
  }

  html[data-theme='dark'] {
    .rich-text-lexical.rich-text-lexical--show-gutter {
      &.error {
        > .rich-text-lexical__wrap
          > .editor-container
          > .editor-scroller
          > .editor
          > .ContentEditable__root::before {
          border-left: 2px solid var(--theme-error-500);
        }
      }
    }

    @include small-break {
      .rich-text-lexical {
        &.error {
          > .rich-text-lexical__wrap {
            @include darkInputError;
          }
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ContentEditable.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/ui/ContentEditable.tsx
Signals: React

```typescript
'use client'
import type { JSX } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable.js'
import { useTranslation } from '@payloadcms/ui'

import './ContentEditable.scss'

import * as React from 'react'

import type { SanitizedClientEditorConfig } from '../config/types.js'

export function LexicalContentEditable({
  className,
  editorConfig,
}: {
  className?: string
  editorConfig: SanitizedClientEditorConfig
}): JSX.Element {
  const { t } = useTranslation<{}, string>()
  const [_, { getTheme }] = useLexicalComposerContext()
  const theme = getTheme()

  return (
    <ContentEditable
      aria-placeholder={t('lexical:general:placeholder')}
      className={className ?? 'ContentEditable__root'}
      placeholder={
        <p className={theme?.placeholder}>
          {editorConfig?.admin?.placeholder ?? t('lexical:general:placeholder')}
        </p>
      }
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.svg]---
Location: payload-main/packages/richtext-lexical/src/lexical/ui/icons/Add/index.svg

```text
<svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5,12h8" stroke="#000000" />
    <path d="M9,16V8" stroke="#000000" />
</svg>
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/ui/icons/Add/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

export const AddIcon: React.FC = () => (
  <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 10h10" stroke="currentColor" />
    <path d="M10 15V5" stroke="currentColor" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: light.svg]---
Location: payload-main/packages/richtext-lexical/src/lexical/ui/icons/Add/light.svg

```text
<svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5,12h8" stroke="#ffffff" />
    <path d="M9,16V8" stroke="#ffffff" />
</svg>
```

--------------------------------------------------------------------------------

````
