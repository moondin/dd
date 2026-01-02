---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 293
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 293 of 695)

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

---[FILE: getNodeCloseToPoint.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/utils/getNodeCloseToPoint.ts

```typescript
'use client'
import type { LexicalEditor, LexicalNode } from 'lexical'

import { $getNodeByKey } from 'lexical'

import { Point } from '../../../utils/point.js'
import { Rect } from '../../../utils/rect.js'
import { getBoundingClientRectWithoutTransform } from '../DraggableBlockPlugin/getBoundingRectWithoutTransform.js'
import { getCollapsedMargins } from '../utils/getCollapsedMargins.js'
import { getTopLevelNodeKeys } from '../utils/getTopLevelNodeKeys.js'

// Directions
const Downward = 1
const Upward = -1
const Indeterminate = 0

type Props = {
  anchorElem: HTMLElement
  cache_threshold?: number
  editor: LexicalEditor
  /** fuzzy makes the search not exact. If no exact match found, find the closes node instead of returning null */
  fuzzy?: boolean
  horizontalOffset?: number
  point: Point
  /**
   * By default, empty paragraphs are not returned. Set this to true to return empty paragraphs. @default false
   */
  returnEmptyParagraphs?: boolean
  /**
   * The index to start searching from. It can be a considerable performance optimization to start searching from the index of the
   * previously found node, as the node is likely to be close to the next node.
   */
  startIndex?: number
  useEdgeAsDefault?: boolean
  verbose?: boolean
}

type Output = {
  blockElem: HTMLElement | null
  blockNode: LexicalNode | null
  foundAtIndex: number
  isFoundNodeEmptyParagraph: boolean
}

const cache = {
  props: null as null | Props,
  result: null as null | Output,
}

function isPointClose(previous: Point, current: Point, threshold: number = 20): boolean {
  const dx = previous.x - current.x
  const dy = previous.y - current.y
  return dx * dx + dy * dy <= threshold * threshold
}

export function getNodeCloseToPoint(props: Props): Output {
  const {
    anchorElem,
    cache_threshold = 20,
    editor,
    fuzzy = false,
    horizontalOffset = 0,
    point: { x, y },
    startIndex = 0,
    useEdgeAsDefault = false,
  } = props

  // Use cache
  if (
    cache_threshold > 0 &&
    cache.props &&
    cache.result &&
    cache.props.fuzzy === props.fuzzy &&
    cache.props.horizontalOffset === props.horizontalOffset &&
    cache.props.useEdgeAsDefault === props.useEdgeAsDefault &&
    isPointClose(cache.props.point, props.point, cache_threshold)
  ) {
    return cache.result
  }

  const anchorElementRect = anchorElem.getBoundingClientRect()
  const topLevelNodeKeys = getTopLevelNodeKeys(editor)

  const closestBlockElem: {
    blockElem: HTMLElement | null
    blockNode: LexicalNode | null
    distance: number
    foundAtIndex: number
    isFoundNodeEmptyParagraph: boolean
  } = {
    blockElem: null,
    blockNode: null,
    distance: Infinity,
    foundAtIndex: -1,
    isFoundNodeEmptyParagraph: false,
  }

  // Return null if matching block element is the first or last node
  editor.getEditorState().read(() => {
    if (useEdgeAsDefault) {
      const firstNode = editor.getElementByKey(topLevelNodeKeys[0]!)
      const lastNode = editor.getElementByKey(topLevelNodeKeys[topLevelNodeKeys.length - 1]!)

      if (firstNode && lastNode) {
        const [firstNodeRect, lastNodeRect] = [
          getBoundingClientRectWithoutTransform(firstNode),
          getBoundingClientRectWithoutTransform(lastNode),
        ]

        if (y < firstNodeRect.top) {
          closestBlockElem.blockElem = firstNode
          closestBlockElem.distance = firstNodeRect.top - y
          closestBlockElem.blockNode = $getNodeByKey(topLevelNodeKeys[0]!)
          closestBlockElem.foundAtIndex = 0
        } else if (y > lastNodeRect.bottom) {
          closestBlockElem.distance = y - lastNodeRect.bottom
          closestBlockElem.blockNode = $getNodeByKey(topLevelNodeKeys[topLevelNodeKeys.length - 1]!)
          closestBlockElem.blockElem = lastNode
          closestBlockElem.foundAtIndex = topLevelNodeKeys.length - 1
        }

        if (closestBlockElem?.blockElem) {
          return {
            blockElem: null,
            isFoundNodeEmptyParagraph: false,
          } as Output
        }
      }
    }

    // Find matching block element
    let index = startIndex
    let direction = Indeterminate

    while (index >= 0 && index < topLevelNodeKeys.length) {
      const key = topLevelNodeKeys[index]!
      const elem = editor.getElementByKey(key)
      if (elem === null) {
        break
      }
      const point = new Point(x + horizontalOffset, y)
      //const domRect = Rect.fromDOM(elem)
      // Do not consider transform of blocks when calculating distance
      const domRect = Rect.fromDOMRect(getBoundingClientRectWithoutTransform(elem))

      const { marginBottom, marginTop } = getCollapsedMargins(elem)

      const rect = domRect.generateNewRect({
        bottom: domRect.bottom + marginBottom,
        left: anchorElementRect.left,
        right: anchorElementRect.right,
        top: domRect.top - marginTop,
      })

      const { distance, isOnBottomSide, isOnTopSide } = rect.distanceFromPoint(point)

      if (distance === 0) {
        closestBlockElem.blockElem = elem
        closestBlockElem.blockNode = $getNodeByKey(key)
        closestBlockElem.foundAtIndex = index
        closestBlockElem.distance = distance

        // Check if blockNode is an empty text node
        if (
          closestBlockElem.blockNode &&
          closestBlockElem.blockNode.getType() === 'paragraph' &&
          closestBlockElem.blockNode.getTextContent() === ''
        ) {
          if (!fuzzy && !props.returnEmptyParagraphs) {
            closestBlockElem.blockElem = null
            closestBlockElem.blockNode = null
          }

          closestBlockElem.isFoundNodeEmptyParagraph = true
        }
        break
      } else if (fuzzy) {
        if (distance < closestBlockElem.distance) {
          closestBlockElem.blockElem = elem
          closestBlockElem.blockNode = $getNodeByKey(key)
          closestBlockElem.distance = distance
          closestBlockElem.foundAtIndex = index
        }
      }

      if (direction === Indeterminate) {
        if (isOnTopSide) {
          direction = Upward
        } else if (isOnBottomSide) {
          direction = Downward
        } else {
          // stop search block element
          direction = Infinity
        }
      }

      index += direction
    }
  })

  // Store in cache before returning
  cache.props = props
  cache.result = {
    blockElem: closestBlockElem.blockElem,
    blockNode: closestBlockElem.blockNode,
    foundAtIndex: closestBlockElem.foundAtIndex,
    isFoundNodeEmptyParagraph: closestBlockElem.isFoundNodeEmptyParagraph,
  }

  return {
    blockElem: closestBlockElem.blockElem,
    blockNode: closestBlockElem.blockNode,
    foundAtIndex: closestBlockElem.foundAtIndex,
    isFoundNodeEmptyParagraph: closestBlockElem.isFoundNodeEmptyParagraph,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getTopLevelNodeKeys.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/utils/getTopLevelNodeKeys.ts

```typescript
'use client'
import type { LexicalEditor } from 'lexical'

import { $getRoot } from 'lexical'

export function getTopLevelNodeKeys(editor: LexicalEditor): string[] {
  return editor.getEditorState().read(() => $getRoot().getChildrenKeys())
}
```

--------------------------------------------------------------------------------

---[FILE: isOnHandleElement.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/utils/isOnHandleElement.ts

```typescript
'use client'
export function isOnHandleElement(element: HTMLElement, handleElementClassName: string): boolean {
  return !!element.closest(`.${handleElementClassName}`)
}
```

--------------------------------------------------------------------------------

---[FILE: setHandlePosition.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/utils/setHandlePosition.ts

```typescript
'use client'
import { doesLineHeightAffectElement } from './doesLineHeightAffectElement.js'

export function setHandlePosition(
  targetElem: HTMLElement | null,
  handleElem: HTMLElement,
  anchorElem: HTMLElement,
  leftOffset: number = 0, // SPACE
) {
  if (!targetElem) {
    handleElem.style.opacity = '0'
    handleElem.style.transform = 'translate(-10000px, -10000px)'
    return
  }

  const targetRect = targetElem.getBoundingClientRect()
  const targetStyle = window.getComputedStyle(targetElem)
  const floatingElemRect = handleElem.getBoundingClientRect()
  const anchorElementRect = anchorElem.getBoundingClientRect()

  let top: number

  const isBlockStyle = [
    'LexicalEditorTheme__block',
    'LexicalEditorTheme__upload',
    'LexicalEditorTheme__relationship',
  ].some(
    (classes) =>
      targetElem.classList.contains(classes) ||
      targetElem.firstElementChild?.classList.contains(classes),
  )

  if (!isBlockStyle) {
    // No need to let line height affect the re-positioning of the floating element if line height has no
    // visual effect on the element. Otherwise, the floating element will be positioned incorrectly.
    const actualLineHeight = doesLineHeightAffectElement(targetElem)
      ? parseInt(targetStyle.lineHeight, 10)
      : 0

    top = targetRect.top + (actualLineHeight - floatingElemRect.height) / 2 - anchorElementRect.top
  } else {
    top = targetRect.top + 8 - anchorElementRect.top
  }

  const left = leftOffset

  handleElem.style.opacity = '1'
  handleElem.style.transform = `translate(${left}px, ${top}px)`
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/InsertParagraphAtEnd/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .rich-text-lexical--show-gutter {
    .insert-paragraph-at-end {
      padding: 4px 0px 2px 40px;
    }
  }
  .insert-paragraph-at-end {
    height: 24px;
    margin-top: -16px;
    width: 100%;
    z-index: 0;
    position: relative;
    padding: 4px 0px 2px 0px;

    &-inside {
      width: 100%;
      height: 100%;
      background-color: transparent;
      transition: background-color 0.1s ease-in-out;
      display: flex;
      justify-content: center;
      border-radius: $style-radius-s;
      color: var(--theme-elevation-500);

      span {
        display: none;
        justify-content: center;
        align-items: center;
      }
    }

    &:hover {
      cursor: pointer;

      .insert-paragraph-at-end-inside {
        background-color: var(--theme-elevation-100);

        span {
          display: flex;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .insert-paragraph-at-end:hover {
      .insert-paragraph-at-end-inside {
        background-color: var(--theme-elevation-50);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/InsertParagraphAtEnd/index.tsx
Signals: React

```typescript
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createParagraphNode, $getRoot } from 'lexical'
import React from 'react'

import './index.scss'
import { useEditorConfigContext } from '../../config/client/EditorConfigProvider.js'
const baseClass = 'insert-paragraph-at-end'

export const InsertParagraphAtEndPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext()
  const { editorConfig } = useEditorConfigContext()

  if (editorConfig?.admin?.hideInsertParagraphAtEnd) {
    return null
  }

  const onClick = () => {
    editor.update(() => {
      const paragraphNode = $createParagraphNode()
      $getRoot().append(paragraphNode)
      paragraphNode.select()
    })
  }

  return (
    // TODO: convert to button
    <div
      aria-label="Insert Paragraph"
      className={baseClass}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={`${baseClass}-inside`}>
        <span>+</span>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/MarkdownShortcut/index.tsx
Signals: React

```typescript
'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import * as React from 'react'

import { registerMarkdownShortcuts } from '../../../packages/@lexical/markdown/MarkdownShortcuts.js'
import { useEditorConfigContext } from '../../config/client/EditorConfigProvider.js'

export const MarkdownShortcutPlugin: React.FC = () => {
  const { editorConfig } = useEditorConfigContext()
  const [editor] = useLexicalComposerContext()

  React.useEffect(() => {
    return registerMarkdownShortcuts(editor, editorConfig.features.markdownTransformers ?? [])
  }, [editor, editorConfig.features.markdownTransformers])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/NormalizeSelection/index.tsx
Signals: React

```typescript
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, RootNode } from 'lexical'
import { useEffect } from 'react'

/**
 * By default, Lexical throws an error if the selection ends in deleted nodes.
 * This is very aggressive considering there are reasons why this can happen
 * outside of Payload's control (custom features or conflicting features, for example).
 * In the case of selections on nonexistent nodes, this plugin moves the selection to
 * the end of the editor and displays a warning instead of an error.
 */
export function NormalizeSelectionPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerNodeTransform(RootNode, (root) => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode()
        const focusNode = selection.focus.getNode()
        if (!anchorNode.isAttached() || !focusNode.isAttached()) {
          root.selectEnd()
          // eslint-disable-next-line no-console
          console.warn(
            'updateEditor: selection has been moved to the end of the editor because the previously selected nodes have been removed and ' +
              "selection wasn't moved to another node. Ensure selection changes after removing/replacing a selected node.",
          )
        }
      }
      return false
    })
  }, [editor])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/SelectAllPlugin/index.tsx
Signals: React

```typescript
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, COMMAND_PRIORITY_LOW, SELECT_ALL_COMMAND } from 'lexical'
import { useEffect } from 'react'

/**
 * Allows to select inputs with `ctrl+a` or `cmd+a`.
 * Required because Lexical preventDefault the event.
 * see: https://github.com/payloadcms/payload/issues/6871
 */
export function SelectAllPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      SELECT_ALL_COMMAND,
      () => {
        const selection = $getSelection()
        if (selection) {
          return false
        }
        const activeElement = document.activeElement
        if (activeElement instanceof HTMLInputElement) {
          activeElement.select()
        }
        return true
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [editor])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/SlashMenu/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .slash-menu-popup {
    background: var(--theme-input-bg);
    width: 200px;
    color: var(--theme-elevation-800);
    border-radius: $style-radius-m;
    list-style: none;
    font-family: var(--font-body);
    max-height: 300px;
    overflow-y: auto;
    z-index: 10;
    position: absolute;
    box-shadow:
      0px 1px 2px 1px rgba(0, 0, 0, 0.1),
      0px 4px 16px 0px rgba(0, 0, 0, 0.2),
      0px -4px 8px 0px rgba(0, 0, 0, 0.1);

    &__group {
      padding-bottom: 8px;
    }

    &__group-title {
      padding-left: 10px;
      color: var(--theme-elevation-600);
      font-size: 10px;
    }

    &__item {
      all: unset;
      padding-left: 12px;
      font-size: 13px;
      box-sizing: border-box;
      background: none;
      border: none;
      color: var(--theme-elevation-900);
      display: flex;
      align-items: center;
      height: 30px;
      width: 100%;
      cursor: pointer;

      &--selected {
        background: var(--theme-elevation-100);
      }

      &-text {
        margin-left: 6px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .icon {
        color: var(--theme-elevation-500);
      }
    }
  }

  html[data-theme='light'] {
    .slash-menu-popup {
      box-shadow:
        0px 1px 2px 1px rgba(0, 0, 0, 0.05),
        0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/SlashMenu/index.tsx
Signals: React

```typescript
'use client'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { useTranslation } from '@payloadcms/ui'
import { useCallback, useMemo, useState } from 'react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import type {
  SlashMenuGroup,
  SlashMenuGroupInternal,
  SlashMenuItemInternal,
  SlashMenuItem as SlashMenuItemType,
} from './LexicalTypeaheadMenuPlugin/types.js'

import { useEditorConfigContext } from '../../config/client/EditorConfigProvider.js'
import './index.scss'
import { LexicalTypeaheadMenuPlugin } from './LexicalTypeaheadMenuPlugin/index.js'
import { useMenuTriggerMatch } from './useMenuTriggerMatch.js'

const baseClass = 'slash-menu-popup'

function SlashMenuItem({
  isSelected,
  item,
  onClick,
  onMouseEnter,
  ref,
}: {
  index: number
  isSelected: boolean
  item: SlashMenuItemInternal
  onClick: () => void
  onMouseEnter: () => void
  ref?: React.Ref<HTMLButtonElement>
}) {
  const {
    fieldProps: { featureClientSchemaMap, schemaPath },
  } = useEditorConfigContext()

  const { i18n } = useTranslation<{}, string>()

  let className = `${baseClass}__item ${baseClass}__item-${item.key}`
  if (isSelected) {
    className += ` ${baseClass}__item--selected`
  }

  let title = item.key
  if (item.label) {
    title =
      typeof item.label === 'function'
        ? item.label({ featureClientSchemaMap, i18n, schemaPath })
        : item.label
  }
  // Crop title to max. 25 characters
  if (title.length > 25) {
    title = title.substring(0, 25) + '...'
  }

  return (
    <button
      aria-selected={isSelected}
      className={className}
      id={baseClass + '__item-' + item.key}
      key={item.key}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      ref={ref}
      role="option"
      tabIndex={-1}
      type="button"
    >
      {item?.Icon && <item.Icon />}

      <span className={`${baseClass}__item-text`}>{title}</span>
    </button>
  )
}

export function SlashMenuPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement
}): React.ReactElement {
  const [editor] = useLexicalComposerContext()
  const [queryString, setQueryString] = useState<null | string>(null)
  const { editorConfig } = useEditorConfigContext()
  const { i18n } = useTranslation<{}, string>()
  const {
    fieldProps: { featureClientSchemaMap, schemaPath },
  } = useEditorConfigContext()

  const checkForTriggerMatch = useMenuTriggerMatch('/', {
    minLength: 0,
  })

  const getDynamicItems = useCallback(() => {
    let groupWithItems: Array<SlashMenuGroup> = []

    for (const dynamicItem of editorConfig.features.slashMenu.dynamicGroups) {
      if (queryString) {
        const dynamicGroupWithItems = dynamicItem({
          editor,
          queryString,
        })
        groupWithItems = groupWithItems.concat(dynamicGroupWithItems)
      }
    }

    return groupWithItems
  }, [editor, queryString, editorConfig?.features])

  const groups: SlashMenuGroup[] = useMemo(() => {
    let groupsWithItems: SlashMenuGroup[] = []
    for (const groupWithItem of editorConfig?.features.slashMenu.groups ?? []) {
      groupsWithItems.push(groupWithItem)
    }

    if (queryString) {
      // Filter current groups first
      // @ts-expect-error - TODO: fix this
      groupsWithItems = groupsWithItems.map((group) => {
        const filteredItems = group.items.filter((item) => {
          let itemTitle = item.key
          if (item.label) {
            itemTitle =
              typeof item.label === 'function'
                ? item.label({ featureClientSchemaMap, i18n, schemaPath })
                : item.label
          }

          if (new RegExp(queryString, 'gi').exec(itemTitle)) {
            return true
          }
          if (item.keywords != null) {
            return item.keywords.some((keyword) => new RegExp(queryString, 'gi').exec(keyword))
          }
          return false
        })
        if (filteredItems.length) {
          return {
            ...group,
            items: filteredItems,
          }
        }
        return null
      })

      groupsWithItems = groupsWithItems.filter((group) => group != null)

      // Now add dynamic groups
      const dynamicItemGroups = getDynamicItems()

      // merge dynamic items into groups
      for (const dynamicGroup of dynamicItemGroups) {
        // 1. find the group with the same name or create new one
        let group = groupsWithItems.find((group) => group.key === dynamicGroup.key)
        if (!group) {
          group = {
            ...dynamicGroup,
            items: [],
          }
        } else {
          groupsWithItems = groupsWithItems.filter((group) => group.key !== dynamicGroup.key)
        }

        // 2. Add items to group items array and add to sanitized.slashMenu.groupsWithItems
        if (group?.items?.length) {
          group.items = group.items.concat(group.items)
        }
        groupsWithItems.push(group)
      }
    }

    return groupsWithItems
  }, [
    queryString,
    editorConfig?.features.slashMenu.groups,
    getDynamicItems,
    featureClientSchemaMap,
    i18n,
    schemaPath,
  ])

  return (
    <LexicalTypeaheadMenuPlugin
      anchorElem={anchorElem}
      groups={groups as SlashMenuGroupInternal[]}
      menuRenderFn={(
        anchorElementRef,
        { selectedItemKey, selectItemAndCleanUp, setSelectedItemKey },
      ) =>
        anchorElementRef.current && groups.length
          ? ReactDOM.createPortal(
              <div className={baseClass}>
                {groups.map((group) => {
                  let groupTitle = group.key
                  if (group.label && featureClientSchemaMap) {
                    groupTitle =
                      typeof group.label === 'function'
                        ? group.label({ featureClientSchemaMap, i18n, schemaPath })
                        : group.label
                  }

                  return (
                    <div
                      className={`${baseClass}__group ${baseClass}__group-${group.key}`}
                      key={group.key}
                    >
                      <div className={`${baseClass}__group-title`}>{groupTitle}</div>
                      {group.items.map((item, oi: number) => (
                        <SlashMenuItem
                          index={oi}
                          isSelected={selectedItemKey === item.key}
                          item={item as SlashMenuItemInternal}
                          key={item.key}
                          onClick={() => {
                            setSelectedItemKey(item.key)
                            selectItemAndCleanUp(item)
                          }}
                          onMouseEnter={() => {
                            setSelectedItemKey(item.key)
                          }}
                          ref={(el) => {
                            ;(item as SlashMenuItemInternal).ref = { current: el }
                          }}
                        />
                      ))}
                    </div>
                  )
                })}
              </div>,
              anchorElementRef.current,
            )
          : null
      }
      onQueryChange={setQueryString}
      triggerFn={checkForTriggerMatch}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: useMenuTriggerMatch.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/SlashMenu/useMenuTriggerMatch.ts
Signals: React

```typescript
'use client'
import type { LexicalEditor } from 'lexical'

import { useCallback } from 'react'

import { PUNCTUATION } from './LexicalTypeaheadMenuPlugin/index.js'

export type TriggerFn = ({
  editor,
  query,
}: {
  editor: LexicalEditor
  /** The query string is the POTENTIAL trigger AND the text after the trigger text. */
  query: string
}) => MenuTextMatch | null

export type MenuTextMatch = {
  leadOffset: number
  matchingString: string
  replaceableString: string
}

/**
 * Returns a function which checks if the trigger (e.g. '/') is present in the query and, if so, returns the matching string (text after the trigger)
 */
export function useMenuTriggerMatch(
  /**
   * Text which triggers the menu. Everything after this text will be used as the query.
   */
  trigger: string,
  { maxLength = 75, minLength = 1 }: { maxLength?: number; minLength?: number },
): TriggerFn {
  return useCallback(
    ({ query }) => {
      const validChars = '[^' + trigger + PUNCTUATION + '\\s]'
      const TypeaheadTriggerRegex = new RegExp(
        '(^|\\s|\\()(' +
          '[' +
          trigger +
          ']' +
          '((?:' +
          validChars +
          '){0,' +
          maxLength +
          '})' +
          ')$',
      )
      const match = TypeaheadTriggerRegex.exec(query)
      if (match !== null) {
        const maybeLeadingWhitespace = match[1]!

        /**
         * matchingString is only the text AFTER the trigger text. (So everything after the /)
         */
        const matchingString = match[3]!

        if (matchingString.length >= minLength) {
          return {
            leadOffset: match.index + maybeLeadingWhitespace.length,
            matchingString,
            replaceableString: match[2]!, // replaceableString is the trigger text + the matching string
          }
        }
      }
      return null
    },
    [maxLength, minLength, trigger],
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/SlashMenu/LexicalTypeaheadMenuPlugin/index.tsx
Signals: React

```typescript
'use client'
import type { LexicalCommand, LexicalEditor, ParagraphNode, RangeSelection } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  createCommand,
  getDOMSelection,
} from 'lexical'
import { type JSX, useCallback, useEffect, useState } from 'react'
import * as React from 'react'

import type { MenuTextMatch, TriggerFn } from '../useMenuTriggerMatch.js'
import type { MenuRenderFn, MenuResolution } from './LexicalMenu.js'
import type { SlashMenuGroupInternal } from './types.js'

import { LexicalMenu, useMenuAnchorRef } from './LexicalMenu.js'

export const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;'

function getTextUpToAnchor(selection: RangeSelection): null | string {
  const anchor = selection.anchor
  if (anchor.type !== 'text') {
    return null
  }
  const anchorNode = anchor.getNode()
  if (!anchorNode.isSimpleText()) {
    return null
  }
  const anchorOffset = anchor.offset
  return anchorNode.getTextContent().slice(0, anchorOffset)
}

function tryToPositionRange(leadOffset: number, range: Range, editorWindow: Window): boolean {
  const domSelection = getDOMSelection(editorWindow)
  if (domSelection === null || !domSelection.isCollapsed) {
    return false
  }

  const anchorNode = domSelection.anchorNode
  const startOffset = leadOffset
  const endOffset = domSelection.anchorOffset

  if (anchorNode == null || endOffset == null) {
    return false
  }

  try {
    range.setStart(anchorNode, startOffset)
    // if endOffset is 0, positioning the range for when you click the plus button to open the slash menu will fial
    range.setEnd(anchorNode, endOffset > 1 ? endOffset : 1)
  } catch (error) {
    return false
  }

  return true
}

function getQueryTextForSearch(editor: LexicalEditor): string | undefined {
  let text
  editor.getEditorState().read(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) {
      return
    }
    text = getTextUpToAnchor(selection)
  })
  return text
}

function isSelectionOnEntityBoundary(editor: LexicalEditor, offset: number): boolean {
  if (offset !== 0) {
    return false
  }
  return editor.getEditorState().read(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor
      const anchorNode = anchor.getNode()
      const prevSibling = anchorNode.getPreviousSibling()
      return $isTextNode(prevSibling) && prevSibling.isTextEntity()
    }
    return false
  })
}

function startTransition(callback: () => void) {
  if (React.startTransition) {
    React.startTransition(callback)
  } else {
    callback()
  }
}

export { useDynamicPositioning } from './LexicalMenu.js'

export type TypeaheadMenuPluginProps = {
  anchorClassName?: string
  anchorElem: HTMLElement
  groups: Array<SlashMenuGroupInternal>
  menuRenderFn: MenuRenderFn
  onClose?: () => void
  onOpen?: (resolution: MenuResolution) => void
  onQueryChange: (matchingString: null | string) => void
  triggerFn: TriggerFn
}

export const ENABLE_SLASH_MENU_COMMAND: LexicalCommand<{
  node: ParagraphNode
}> = createCommand('ENABLE_SLASH_MENU_COMMAND')

export function LexicalTypeaheadMenuPlugin({
  anchorClassName,
  anchorElem,
  groups,
  menuRenderFn,
  onClose,
  onOpen,
  onQueryChange,
  triggerFn,
}: TypeaheadMenuPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const [resolution, setResolution] = useState<MenuResolution | null>(null)
  const anchorElementRef = useMenuAnchorRef(anchorElem, resolution, setResolution, anchorClassName)

  const closeTypeahead = useCallback(() => {
    setResolution(null)
    if (onClose != null && resolution !== null) {
      onClose()
    }
  }, [onClose, resolution])

  const openTypeahead = useCallback(
    (res: MenuResolution) => {
      setResolution(res)
      if (onOpen != null && resolution === null) {
        onOpen(res)
      }
    },
    [onOpen, resolution],
  )

  // This is mainly used for the AddBlockHandlePlugin, so that the slash menu can be opened from there
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        ENABLE_SLASH_MENU_COMMAND,
        ({ node }) => {
          editor.getEditorState().read(() => {
            const match: MenuTextMatch = {
              leadOffset: 0,
              matchingString: '',
              replaceableString: '',
            }
            if (!isSelectionOnEntityBoundary(editor, match.leadOffset)) {
              if (node !== null) {
                const editorWindow = editor._window ?? window
                const range = editorWindow.document.createRange()

                const isRangePositioned = tryToPositionRange(match.leadOffset, range, editorWindow)
                if (isRangePositioned !== null) {
                  startTransition(() =>
                    openTypeahead({
                      getRect: () => {
                        return range.getBoundingClientRect()
                      },
                      match,
                    }),
                  )
                }

                return
              }
            }
          })

          return true
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, openTypeahead])

  useEffect(() => {
    const updateListener = () => {
      editor.getEditorState().read(() => {
        const editorWindow = editor._window ?? window
        const range = editorWindow.document.createRange()
        const selection = $getSelection()
        const text = getQueryTextForSearch(editor)

        if (
          !$isRangeSelection(selection) ||
          !selection.isCollapsed() ||
          text === undefined ||
          range === null
        ) {
          closeTypeahead()
          return
        }

        const match = triggerFn({ editor, query: text })
        onQueryChange(match ? match.matchingString : null)

        if (match !== null && !isSelectionOnEntityBoundary(editor, match.leadOffset)) {
          const isRangePositioned = tryToPositionRange(match.leadOffset, range, editorWindow)
          if (isRangePositioned !== null) {
            startTransition(() =>
              openTypeahead({
                getRect: () => {
                  return range.getBoundingClientRect()
                },
                match,
              }),
            )
            return
          }
        }
        closeTypeahead()
      })
    }

    const removeUpdateListener = editor.registerUpdateListener(updateListener)

    return () => {
      removeUpdateListener()
    }
  }, [editor, triggerFn, onQueryChange, resolution, closeTypeahead, openTypeahead])

  return anchorElementRef.current === null || resolution === null || editor === null ? null : (
    <LexicalMenu
      anchorElementRef={anchorElementRef}
      close={closeTypeahead}
      editor={editor}
      groups={groups}
      menuRenderFn={menuRenderFn}
      resolution={resolution}
      shouldSplitNodeWithQuery
    />
  )
}

export type { MenuRenderFn, MenuResolution, MenuTextMatch, TriggerFn }
```

--------------------------------------------------------------------------------

````
