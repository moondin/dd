---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 292
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 292 of 695)

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
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/AddBlockHandlePlugin/index.tsx
Signals: React

```typescript
'use client'
import type { LexicalEditor, LexicalNode, ParagraphNode } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { $createParagraphNode, isHTMLElement } from 'lexical'
import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useEditorConfigContext } from '../../../config/client/EditorConfigProvider.js'
import { Point } from '../../../utils/point.js'
import { ENABLE_SLASH_MENU_COMMAND } from '../../SlashMenu/LexicalTypeaheadMenuPlugin/index.js'
import { calculateDistanceFromScrollerElem } from '../utils/calculateDistanceFromScrollerElem.js'
import { getNodeCloseToPoint } from '../utils/getNodeCloseToPoint.js'
import { getTopLevelNodeKeys } from '../utils/getTopLevelNodeKeys.js'
import { isOnHandleElement } from '../utils/isOnHandleElement.js'
import { setHandlePosition } from '../utils/setHandlePosition.js'
import './index.scss'

const ADD_BLOCK_MENU_CLASSNAME = 'add-block-menu'

let prevIndex = Infinity

function getCurrentIndex(keysLength: number): number {
  if (keysLength === 0) {
    return Infinity
  }
  if (prevIndex >= 0 && prevIndex < keysLength) {
    return prevIndex
  }

  return Math.floor(keysLength / 2)
}

function useAddBlockHandle(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  isEditable: boolean,
): React.ReactElement {
  const scrollerElem = anchorElem.parentElement

  const { editorConfig } = useEditorConfigContext()
  const blockHandleHorizontalOffset = editorConfig?.admin?.hideGutter ? -24 : 12

  const menuRef = useRef<HTMLButtonElement>(null)
  const [hoveredElement, setHoveredElement] = useState<{
    elem: HTMLElement
    node: LexicalNode
  } | null>(null)

  useEffect(() => {
    function onDocumentMouseMove(event: MouseEvent) {
      const target = event.target
      if (!isHTMLElement(target)) {
        return
      }

      const distanceFromScrollerElem = calculateDistanceFromScrollerElem(
        scrollerElem,
        event.pageX,
        event.pageY,
        target,
      )

      if (distanceFromScrollerElem === -1) {
        setHoveredElement(null)
        return
      }

      if (isOnHandleElement(target, ADD_BLOCK_MENU_CLASSNAME)) {
        return
      }
      const topLevelNodeKeys = getTopLevelNodeKeys(editor)

      const {
        blockElem: _emptyBlockElem,
        blockNode,
        foundAtIndex,
      } = getNodeCloseToPoint({
        anchorElem,
        cache_threshold: 0,
        editor,
        horizontalOffset: -distanceFromScrollerElem,
        point: new Point(event.x, event.y),
        returnEmptyParagraphs: true,
        startIndex: getCurrentIndex(topLevelNodeKeys.length),
        useEdgeAsDefault: false,
      })

      prevIndex = foundAtIndex

      if (!_emptyBlockElem) {
        return
      }
      if (
        blockNode &&
        (hoveredElement?.node !== blockNode || hoveredElement?.elem !== _emptyBlockElem)
      ) {
        setHoveredElement({
          elem: _emptyBlockElem,
          node: blockNode,
        })
      }
    }

    // Since the draggableBlockElem is outside the actual editor, we need to listen to the document
    // to be able to detect when the mouse is outside the editor and respect a buffer around
    // the scrollerElem to avoid the draggableBlockElem disappearing too early.
    document?.addEventListener('mousemove', onDocumentMouseMove)

    return () => {
      document?.removeEventListener('mousemove', onDocumentMouseMove)
    }
  }, [scrollerElem, anchorElem, editor, hoveredElement])

  useEffect(() => {
    if (menuRef.current && hoveredElement?.node) {
      setHandlePosition(
        hoveredElement?.elem,
        menuRef.current,
        anchorElem,
        blockHandleHorizontalOffset,
      )
    }
  }, [anchorElem, hoveredElement, blockHandleHorizontalOffset])

  const handleAddClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      let hoveredElementToUse = hoveredElement
      if (!hoveredElementToUse?.node) {
        return
      }

      // 1. Update hoveredElement.node to a new paragraph node if the hoveredElement.node is not a paragraph node
      editor.update(() => {
        // Check if blockNode is an empty text node
        let isEmptyParagraph = true
        if (
          hoveredElementToUse?.node.getType() !== 'paragraph' ||
          hoveredElementToUse.node.getTextContent() !== ''
        ) {
          isEmptyParagraph = false
        }

        if (!isEmptyParagraph) {
          const newParagraph = $createParagraphNode()
          hoveredElementToUse?.node.insertAfter(newParagraph)

          setTimeout(() => {
            hoveredElementToUse = {
              elem: editor.getElementByKey(newParagraph.getKey())!,
              node: newParagraph,
            }
            setHoveredElement(hoveredElementToUse)
          }, 0)
        }
      })

      // 2. Focus on the new paragraph node
      setTimeout(() => {
        editor.update(() => {
          editor.focus()

          if (
            hoveredElementToUse?.node &&
            'select' in hoveredElementToUse.node &&
            typeof hoveredElementToUse.node.select === 'function'
          ) {
            hoveredElementToUse.node.select()
          }
        })
      }, 1)

      // Make sure this is called AFTER the focusing has been processed by the browser
      // Otherwise, this won't work
      setTimeout(() => {
        editor.dispatchCommand(ENABLE_SLASH_MENU_COMMAND, {
          node: hoveredElementToUse?.node as ParagraphNode,
        })
      }, 2)

      event.stopPropagation()
      event.preventDefault()
    },
    [editor, hoveredElement],
  )

  return createPortal(
    <React.Fragment>
      <button
        aria-label="Add block"
        className="icon add-block-menu"
        onClick={(event) => {
          handleAddClick(event)
        }}
        ref={menuRef}
        type="button"
      >
        <div className={isEditable ? 'icon' : ''} />
      </button>
    </React.Fragment>,
    anchorElem,
  )
}

export function AddBlockHandlePlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement
}): React.ReactElement {
  const [editor] = useLexicalComposerContext()
  return useAddBlockHandle(editor, anchorElem, editor._editable)
}
```

--------------------------------------------------------------------------------

---[FILE: debounce.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/DraggableBlockPlugin/debounce.ts

```typescript
'use client'
export function debounce(func: (...args: undefined[]) => void, wait: number) {
  let timeout: number | string | undefined
  return function (...args: undefined[]) {
    const later = () => {
      clearTimeout(timeout)
      timeout = undefined
      func(...args)
    }

    clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getBoundingRectWithoutTransform.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/DraggableBlockPlugin/getBoundingRectWithoutTransform.ts

```typescript
'use client'
export function getBoundingClientRectWithoutTransform(elem: HTMLElement): DOMRect {
  const rect = elem.getBoundingClientRect()

  // Extract the translation value from the transform style
  const transformValue = getComputedStyle(elem).getPropertyValue('transform')
  if (!transformValue || transformValue === 'none') {
    return rect
  }

  const lastNumberOfTransformValue = transformValue.split(',').pop()
  rect.y = rect.y - Number(lastNumberOfTransformValue?.replace(')', ''))

  // Return the original bounding rect if no translation is applied
  return rect
}
```

--------------------------------------------------------------------------------

---[FILE: highlightElemOriginalPosition.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/DraggableBlockPlugin/highlightElemOriginalPosition.ts
Signals: React

```typescript
'use client'
import type React from 'react'

import { getBoundingClientRectWithoutTransform } from './getBoundingRectWithoutTransform.js'

export function highlightElemOriginalPosition(
  debugHighlightRef: React.RefObject<HTMLDivElement | null>,
  htmlElem: HTMLElement,
  anchorElem: HTMLElement,
) {
  if (!debugHighlightRef.current) {
    // If the ref doesn't point to an existing element, we can't set styles
    return
  }

  const { left: anchorLeft, top: anchorTop } = anchorElem.getBoundingClientRect()

  // Get computed styles of the given element
  const boundingRect = getBoundingClientRectWithoutTransform(htmlElem)

  // Extract necessary styles (ignoring transform)
  const width = boundingRect.width
  const height = boundingRect.height
  const top = boundingRect.top - anchorTop
  const left = boundingRect.left - anchorLeft

  debugHighlightRef.current.style.border = '2px solid green'
  debugHighlightRef.current.style.boxSizing = 'border-box'
  debugHighlightRef.current.style.height = height + 'px'
  debugHighlightRef.current.style.pointerEvents = 'none'
  debugHighlightRef.current.style.position = 'absolute'
  debugHighlightRef.current.style.top = top + 'px'
  debugHighlightRef.current.style.left = left + 'px'
  debugHighlightRef.current.style.width = width + 'px'
  debugHighlightRef.current.style.zIndex = '1000'
  debugHighlightRef.current.style.opacity = '0.5'
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/DraggableBlockPlugin/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .draggable-block-menu {
    border: none;
    border-radius: $style-radius-m;
    padding: 0;
    cursor: grab;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    will-change: transform;
    background-color: var(--theme-bg);

    &:active {
      cursor: grabbing;
    }

    &:hover {
      background-color: var(--theme-elevation-100);
      .icon {
        opacity: 1;
      }
    }

    .icon {
      background-color: transparent;
      width: 18px;
      height: 24px;
      opacity: 0.3;
      background-image: url(../../../ui/icons/DraggableBlock/index.svg);
    }

    html[data-theme='dark'] & {
      .icon {
        background-image: url(../../../ui/icons/DraggableBlock/light.svg);
      }
    }
  }

  .rich-text-lexical--show-gutter
    > .rich-text-lexical__wrap
    > .editor-container
    > .editor-scroller
    > .editor {
    > .draggable-block-target-line {
      left: 3rem;
    }
  }

  .draggable-block-target-line {
    pointer-events: none;
    background: var(--theme-success-400);
    border-radius: 1px;
    height: base(0.2);
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    will-change: transform;
    transition: transform 0.1s;
  }

  /* This targets Firefox 57+. The transition looks ugly on firefox, thus we disable it here */
  @-moz-document url-prefix() {
    .draggable-block-target-line {
      transition: none;
    }
  }

  .rich-text-lexical {
    .ContentEditable__root > * {
      will-change: margin-top, margin-bottom;
      transition:
        margin-top 0.08s,
        margin-bottom 0.08s;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/DraggableBlockPlugin/index.tsx
Signals: React

```typescript
'use client'
import type { LexicalEditor } from 'lexical'
import type { DragEvent as ReactDragEvent } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { eventFiles } from '@lexical/rich-text'
import { $getNearestNodeFromDOMNode, $getNodeByKey, isHTMLElement } from 'lexical'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useEditorConfigContext } from '../../../config/client/EditorConfigProvider.js'
import { Point } from '../../../utils/point.js'
import { calculateDistanceFromScrollerElem } from '../utils/calculateDistanceFromScrollerElem.js'
import { getNodeCloseToPoint } from '../utils/getNodeCloseToPoint.js'
import { getTopLevelNodeKeys } from '../utils/getTopLevelNodeKeys.js'
import { isOnHandleElement } from '../utils/isOnHandleElement.js'
import { setHandlePosition } from '../utils/setHandlePosition.js'
import { getBoundingClientRectWithoutTransform } from './getBoundingRectWithoutTransform.js'
import './index.scss'
import { setTargetLine } from './setTargetLine.js'

const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu'
const DRAG_DATA_FORMAT = 'application/x-lexical-drag-block'

let prevIndex = Infinity

function getCurrentIndex(keysLength: number): number {
  if (keysLength === 0) {
    return Infinity
  }
  if (prevIndex >= 0 && prevIndex < keysLength) {
    return prevIndex
  }

  return Math.floor(keysLength / 2)
}

function setDragImage(dataTransfer: DataTransfer, draggableBlockElem: HTMLElement) {
  const { transform } = draggableBlockElem.style

  // Remove dragImage borders
  dataTransfer.setDragImage(draggableBlockElem, 0, 0)

  setTimeout(() => {
    draggableBlockElem.style.transform = transform
  })
}

function hideTargetLine(
  targetLineElem: HTMLElement | null,
  lastTargetBlockElem: HTMLElement | null,
) {
  if (targetLineElem) {
    targetLineElem.style.opacity = '0'
  }
  if (lastTargetBlockElem) {
    lastTargetBlockElem.style.opacity = ''
    // Delete marginBottom and marginTop values we set
    lastTargetBlockElem.style.marginBottom = ''
    lastTargetBlockElem.style.marginTop = ''
    //lastTargetBlock.style.border = 'none'
  }
}

function useDraggableBlockMenu(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  isEditable: boolean,
): React.ReactElement {
  const scrollerElem = anchorElem.parentElement

  const menuRef = useRef<HTMLButtonElement>(null)
  const targetLineRef = useRef<HTMLDivElement>(null)
  const debugHighlightRef = useRef<HTMLDivElement>(null)
  const isDraggingBlockRef = useRef<boolean>(false)
  const [draggableBlockElem, setDraggableBlockElem] = useState<HTMLElement | null>(null)
  const [lastTargetBlock, setLastTargetBlock] = useState<{
    boundingBox?: DOMRect
    elem: HTMLElement | null
    isBelow: boolean
  } | null>(null)

  const { editorConfig } = useEditorConfigContext()

  const blockHandleHorizontalOffset = editorConfig?.admin?.hideGutter ? -44 : -8

  useEffect(() => {
    /**
     * Handles positioning of the drag handle
     */
    function onDocumentMouseMove(event: MouseEvent) {
      const target = event.target
      if (!isHTMLElement(target)) {
        return
      }

      const distanceFromScrollerElem = calculateDistanceFromScrollerElem(
        scrollerElem,
        event.pageX,
        event.pageY,
        target,
      )
      if (distanceFromScrollerElem === -1) {
        setDraggableBlockElem(null)
        return
      }

      if (isOnHandleElement(target, DRAGGABLE_BLOCK_MENU_CLASSNAME)) {
        return
      }

      const topLevelNodeKeys = getTopLevelNodeKeys(editor)

      const {
        blockElem: _draggableBlockElem,
        foundAtIndex,
        isFoundNodeEmptyParagraph,
      } = getNodeCloseToPoint({
        anchorElem,
        cache_threshold: 0,
        editor,
        horizontalOffset: -distanceFromScrollerElem,
        point: new Point(event.x, event.y),
        startIndex: getCurrentIndex(topLevelNodeKeys.length),
        useEdgeAsDefault: false,
        verbose: false,
      })

      prevIndex = foundAtIndex

      //if (DEBUG && _draggableBlockElem) {
      //targetBlockElem.style.border = '3px solid red'
      // highlightElemOriginalPosition(debugHighlightRef, _draggableBlockElem, anchorElem)
      //}

      if (!_draggableBlockElem && !isFoundNodeEmptyParagraph) {
        return
      }

      if (draggableBlockElem !== _draggableBlockElem) {
        setDraggableBlockElem(_draggableBlockElem)
      }
    }

    // Since the draggableBlockElem is outside the actual editor, we need to listen to the document
    // to be able to detect when the mouse is outside the editor and respect a buffer around
    // the scrollerElem to avoid the draggableBlockElem disappearing too early.
    document?.addEventListener('mousemove', onDocumentMouseMove)

    return () => {
      document?.removeEventListener('mousemove', onDocumentMouseMove)
    }
  }, [scrollerElem, anchorElem, editor, draggableBlockElem])

  useEffect(() => {
    if (menuRef.current) {
      setHandlePosition(
        draggableBlockElem,
        menuRef.current,
        anchorElem,
        blockHandleHorizontalOffset,
      )
    }
  }, [anchorElem, draggableBlockElem, blockHandleHorizontalOffset])

  useEffect(() => {
    function onDragover(event: DragEvent): boolean {
      if (!isDraggingBlockRef.current) {
        return false
      }
      const [isFileTransfer] = eventFiles(event)
      if (isFileTransfer) {
        return false
      }

      const { pageY, target } = event
      if (!isHTMLElement(target)) {
        return false
      }

      const distanceFromScrollerElem = calculateDistanceFromScrollerElem(
        scrollerElem,
        event.pageX,
        event.pageY,
        target,
        100,
        50,
      )

      const topLevelNodeKeys = getTopLevelNodeKeys(editor)

      const {
        blockElem: targetBlockElem,
        foundAtIndex,
        isFoundNodeEmptyParagraph,
      } = getNodeCloseToPoint({
        anchorElem,
        editor,
        fuzzy: true,
        horizontalOffset: -distanceFromScrollerElem,
        point: new Point(event.x, event.y),
        startIndex: getCurrentIndex(topLevelNodeKeys.length),
        useEdgeAsDefault: true,
        verbose: true,
      })

      prevIndex = foundAtIndex

      const targetLineElem = targetLineRef.current
      // targetBlockElem === null shouldn't happen
      if (targetBlockElem === null || targetLineElem === null) {
        return false
      }

      if (draggableBlockElem !== targetBlockElem) {
        const { isBelow, willStayInSamePosition } = setTargetLine(
          editorConfig?.admin?.hideGutter ? '0px' : '3rem',
          blockHandleHorizontalOffset +
            (editorConfig?.admin?.hideGutter
              ? (menuRef?.current?.getBoundingClientRect()?.width ?? 0)
              : -(menuRef?.current?.getBoundingClientRect()?.width ?? 0)),
          targetLineElem,
          targetBlockElem,
          lastTargetBlock!,
          pageY,
          anchorElem,
          event,
          debugHighlightRef,
          isFoundNodeEmptyParagraph,
        )

        // Prevent default event to be able to trigger onDrop events
        // Calling preventDefault() adds the green plus icon to the cursor,
        // indicating that the drop is allowed.
        event.preventDefault()

        if (!willStayInSamePosition) {
          setLastTargetBlock({
            boundingBox: targetBlockElem.getBoundingClientRect(),
            elem: targetBlockElem,
            isBelow,
          })
        }
      } else if (lastTargetBlock?.elem) {
        hideTargetLine(targetLineElem, lastTargetBlock.elem)
        setLastTargetBlock({
          boundingBox: targetBlockElem.getBoundingClientRect(),
          elem: targetBlockElem,
          isBelow: false,
        })
      }

      return true
    }

    function onDrop(event: DragEvent): boolean {
      if (!isDraggingBlockRef.current) {
        return false
      }
      const [isFileTransfer] = eventFiles(event)
      if (isFileTransfer) {
        return false
      }
      const { dataTransfer, pageY, target } = event
      const dragData = dataTransfer?.getData(DRAG_DATA_FORMAT) || ''

      editor.update(() => {
        const draggedNode = $getNodeByKey(dragData)
        if (!draggedNode) {
          return false
        }
        if (!isHTMLElement(target)) {
          return false
        }
        const distanceFromScrollerElem = calculateDistanceFromScrollerElem(
          scrollerElem,
          event.pageX,
          event.pageY,
          target,
          100,
          50,
        )

        const { blockElem: targetBlockElem, isFoundNodeEmptyParagraph } = getNodeCloseToPoint({
          anchorElem,
          editor,
          fuzzy: true,
          horizontalOffset: -distanceFromScrollerElem,
          point: new Point(event.x, event.y),
          useEdgeAsDefault: true,
        })

        if (!targetBlockElem) {
          return false
        }
        const targetNode = $getNearestNodeFromDOMNode(targetBlockElem)
        if (!targetNode) {
          return false
        }
        if (targetNode === draggedNode) {
          return true
        }

        const { height: targetBlockElemHeight, top: targetBlockElemTop } =
          getBoundingClientRectWithoutTransform(targetBlockElem)

        const mouseY = pageY
        const isBelow = mouseY >= targetBlockElemTop + targetBlockElemHeight / 2 + window.scrollY

        if (!isFoundNodeEmptyParagraph) {
          if (isBelow) {
            // below targetBlockElem
            targetNode.insertAfter(draggedNode)
          } else {
            // above targetBlockElem
            targetNode.insertBefore(draggedNode)
          }
        } else {
          //
          targetNode.insertBefore(draggedNode)
          targetNode.remove()
        }

        /*
        if (pageY >= targetBlockElemTop + targetBlockElemHeight / 2) {
          targetNode.insertAfter(draggedNode)
        } else {
          targetNode.insertBefore(draggedNode)
        }*/
        if (draggableBlockElem !== null) {
          setDraggableBlockElem(null)
        }

        // find all previous elements with lexical-block-highlighter class and remove them
        const allPrevHighlighters = document.querySelectorAll('.lexical-block-highlighter')
        allPrevHighlighters.forEach((highlighter) => {
          highlighter.remove()
        })

        const newInsertedElem = editor.getElementByKey(draggedNode.getKey())
        setTimeout(() => {
          // add new temp html element to newInsertedElem with the same height and width and the class block-selected
          // to highlight the new inserted element
          const newInsertedElemRect = newInsertedElem?.getBoundingClientRect()
          if (!newInsertedElemRect) {
            return
          }
          const highlightElem = document.createElement('div')
          highlightElem.className = 'lexical-block-highlighter'

          highlightElem.style.backgroundColor = 'var(--theme-elevation-1000'
          highlightElem.style.transition = 'opacity 0.5s ease-in-out'
          highlightElem.style.zIndex = '1'
          highlightElem.style.pointerEvents = 'none'
          highlightElem.style.boxSizing = 'border-box'
          highlightElem.style.borderRadius = '4px'
          highlightElem.style.position = 'absolute'
          document.body.appendChild(highlightElem)

          highlightElem.style.opacity = '0.1'

          highlightElem.style.height = `${newInsertedElemRect.height + 8}px`
          highlightElem.style.width = `${newInsertedElemRect.width + 8}px`
          highlightElem.style.top = `${newInsertedElemRect.top + window.scrollY - 4}px`
          highlightElem.style.left = `${newInsertedElemRect.left - 4}px`

          setTimeout(() => {
            highlightElem.style.opacity = '0'
            setTimeout(() => {
              highlightElem.remove()
            }, 500)
          }, 1000)
        }, 120)
      })

      return true
    }

    // register onDragover event listeners:
    document.addEventListener('dragover', onDragover)
    // register onDrop event listeners:
    document.addEventListener('drop', onDrop)

    return () => {
      document.removeEventListener('dragover', onDragover)
      document.removeEventListener('drop', onDrop)
    }
  }, [
    scrollerElem,
    blockHandleHorizontalOffset,
    anchorElem,
    editor,
    lastTargetBlock,
    draggableBlockElem,
    editorConfig?.admin?.hideGutter,
  ])

  function onDragStart(event: ReactDragEvent<HTMLButtonElement>): void {
    const dataTransfer = event.dataTransfer
    if (!dataTransfer || !draggableBlockElem) {
      return
    }
    setDragImage(dataTransfer, draggableBlockElem)
    let nodeKey = ''
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(draggableBlockElem)
      if (node) {
        nodeKey = node.getKey()
      }
    })
    isDraggingBlockRef.current = true
    dataTransfer.setData(DRAG_DATA_FORMAT, nodeKey)
  }

  function onDragEnd(): void {
    isDraggingBlockRef.current = false
    if (lastTargetBlock?.elem) {
      hideTargetLine(targetLineRef.current, lastTargetBlock?.elem)
    }
  }

  return createPortal(
    <React.Fragment>
      <button
        aria-label="Drag to move"
        className="icon draggable-block-menu"
        draggable
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        ref={menuRef}
        type="button"
      >
        <div className={isEditable ? 'icon' : ''} />
      </button>
      <div className="draggable-block-target-line" ref={targetLineRef} />
      <div className="debug-highlight" ref={debugHighlightRef} />
    </React.Fragment>,
    anchorElem,
  )
}

export function DraggableBlockPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement
}): React.ReactElement {
  const [editor] = useLexicalComposerContext()
  return useDraggableBlockMenu(editor, anchorElem, editor._editable)
}
```

--------------------------------------------------------------------------------

---[FILE: setTargetLine.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/DraggableBlockPlugin/setTargetLine.ts

```typescript
'use client'
import { getCollapsedMargins } from '../utils/getCollapsedMargins.js'
const TARGET_LINE_HALF_HEIGHT = 0
const TEXT_BOX_HORIZONTAL_PADDING = -24
const DEBUG = false

let animationTimer = 0

export function setTargetLine(
  offsetWidth: string,
  offsetLeft: number,
  targetLineElem: HTMLElement,
  targetBlockElem: HTMLElement,
  lastTargetBlock: {
    boundingBox?: DOMRect
    elem: HTMLElement | null
    isBelow: boolean
  },
  mouseY: number,
  anchorElem: HTMLElement,
  event: DragEvent,
  debugHighlightRef: React.RefObject<HTMLDivElement | null>,
  isFoundNodeEmptyParagraph: boolean = false,
) {
  const { height: targetBlockElemHeight, top: targetBlockElemTop } =
    targetBlockElem.getBoundingClientRect() // used to be getBoundingClientRectWithoutTransform. Not sure what's better, but the normal getBoundingClientRect seems to work fine
  const { top: anchorTop, width: anchorWidth } = anchorElem.getBoundingClientRect()

  const { marginBottom, marginTop } = getCollapsedMargins(targetBlockElem)
  let lineTop = targetBlockElemTop

  const isBelow = mouseY >= targetBlockElemTop + targetBlockElemHeight / 2 + window.scrollY

  let willStayInSamePosition = false

  /**
   * Do not run any transform or changes if the actual new line position would be the same (even if it's now inserted BEFORE rather than AFTER - position would still be the same)
   * This prevents unnecessary flickering.
   *
   * We still need to let it run even if the position (IGNORING the transform) would not change, as the transform animation is not finished yet. This is what animationTimer does. Otherwise, the positioning will be inaccurate
   */
  if (lastTargetBlock?.elem) {
    if (targetBlockElem !== lastTargetBlock?.elem) {
      if (
        isBelow &&
        lastTargetBlock?.elem &&
        lastTargetBlock?.elem === targetBlockElem.nextElementSibling
      ) {
        animationTimer++

        if (animationTimer < 200) {
          willStayInSamePosition = true
        }
      } else if (
        !isBelow &&
        lastTargetBlock?.elem &&
        lastTargetBlock?.elem === targetBlockElem.previousElementSibling
      ) {
        animationTimer++
        if (animationTimer < 200) {
          willStayInSamePosition = true
        }
      }
    } else {
      animationTimer++

      const lastBoundingBoxPosition = lastTargetBlock?.boundingBox?.y
      const currentBoundingBoxPosition = targetBlockElem.getBoundingClientRect().y

      if (
        (isBelow === lastTargetBlock?.isBelow &&
          lastBoundingBoxPosition === currentBoundingBoxPosition) ||
        animationTimer < 200
      ) {
        willStayInSamePosition = false
      }
    }
  }
  if (willStayInSamePosition) {
    return {
      isBelow,
      willStayInSamePosition,
    }
  }

  /**
   * Paragraphs need no isBelow/above handling,
   */
  if (!isFoundNodeEmptyParagraph) {
    //if (!isFoundNodeEmptyParagraph) {
    if (isBelow) {
      // below targetBlockElem
      lineTop += targetBlockElemHeight + marginBottom / 2
    } else {
      // above targetBlockElem
      lineTop -= marginTop / 2
    }
  } else {
    lineTop += targetBlockElemHeight / 2
  }

  let targetElemTranslate2 = 0

  if (!isFoundNodeEmptyParagraph) {
    if (isBelow) {
      targetElemTranslate2 = -TARGET_LINE_HALF_HEIGHT
    } else {
      targetElemTranslate2 = TARGET_LINE_HALF_HEIGHT
    }
  }

  const top = lineTop - anchorTop + targetElemTranslate2

  const left = TEXT_BOX_HORIZONTAL_PADDING - offsetLeft

  targetLineElem.style.width = `calc(${anchorWidth}px - ${offsetWidth})`
  targetLineElem.style.opacity = '.8'

  // if (DEBUG) {
  //   //targetBlockElem.style.border = '3px solid red'
  //   highlightElemOriginalPosition(debugHighlightRef, targetBlockElem, anchorElem)
  // }

  targetLineElem.style.transform = `translate(${left}px, calc(${top}px - ${'2px'}))`

  /**
   * Properly reset previous targetBlockElem styles
   */
  if (lastTargetBlock?.elem) {
    lastTargetBlock.elem.style.opacity = ''

    if (lastTargetBlock?.elem === targetBlockElem) {
      if (isBelow) {
        lastTargetBlock.elem.style.marginTop = ''
      } else {
        lastTargetBlock.elem.style.marginBottom = ''
      }
    } else {
      lastTargetBlock.elem.style.marginBottom = ''
      lastTargetBlock.elem.style.marginTop = ''
    }
  }

  animationTimer = 0
  return {
    isBelow,
    willStayInSamePosition,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: calculateDistanceFromScrollerElem.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/utils/calculateDistanceFromScrollerElem.ts

```typescript
'use client'
/**
 * Calculate distance between scrollerElem and target if target is not in scrollerElem
 */
export const calculateDistanceFromScrollerElem = (
  scrollerElem: HTMLElement | null,
  pageX: number,
  pageY: number,
  target: HTMLElement,
  horizontalBuffer: number = 50,
  verticalBuffer: number = 25,
): number => {
  let distanceFromScrollerElem = 0
  if (scrollerElem && !scrollerElem.contains(target)) {
    const { bottom, left, right, top } = scrollerElem.getBoundingClientRect()

    const adjustedTop = top + window.scrollY
    const adjustedBottom = bottom + window.scrollY

    if (
      pageY < adjustedTop - verticalBuffer ||
      pageY > adjustedBottom + verticalBuffer ||
      pageX < left - horizontalBuffer ||
      pageX > right + horizontalBuffer
    ) {
      return -1
    }

    // This is used to allow the _draggableBlockElem to be found when the mouse is in the
    // buffer zone around the scrollerElem.
    if (pageX < left || pageX > right) {
      distanceFromScrollerElem = pageX < left ? pageX - left : pageX - right
    }
  }
  return distanceFromScrollerElem
}
```

--------------------------------------------------------------------------------

---[FILE: doesLineHeightAffectElement.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/utils/doesLineHeightAffectElement.ts

```typescript
'use client'
const replacedElements = [
  'IMG',
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'BUTTON',
  'VIDEO',
  'OBJECT',
  'EMBED',
  'IFRAME',
  'HR',
]

/**
 * From ChatGPT, only that verified it works for HR elements.
 *
 * HTML Elements can have CSS lineHeight applied to them, but it doesn't always affect the visual layout.
 * This function checks if the line-height property has an effect on the element's layout.
 * @param htmlElem
 */
export function doesLineHeightAffectElement(htmlElem: HTMLElement) {
  if (!htmlElem) {
    return false
  }

  // Check for replaced elements, elements that typically don't support line-height adjustments,
  // and elements without visible content

  if (
    replacedElements.includes(htmlElem.tagName) ||
    htmlElem.offsetHeight === 0 ||
    htmlElem.offsetWidth === 0
  ) {
    return false
  }

  // Check for specific CSS properties that negate line-height's visual effects
  const style = window.getComputedStyle(htmlElem)
  if (
    style.display === 'table-cell' ||
    style.position === 'absolute' ||
    style.visibility === 'hidden' ||
    style.opacity === '0'
  ) {
    return false
  }

  // This is a basic check, and there can be more complex scenarios where line-height doesn't have an effect.
  return true
}
```

--------------------------------------------------------------------------------

---[FILE: getCollapsedMargins.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/plugins/handles/utils/getCollapsedMargins.ts

```typescript
'use client'
export function getCollapsedMargins(elem: HTMLElement): {
  marginBottom: number
  marginTop: number
} {
  const getMargin = (element: Element | null, margin: 'marginBottom' | 'marginTop'): number =>
    element ? parseFloat(window.getComputedStyle(element)[margin]) : 0

  const { marginBottom, marginTop } = window.getComputedStyle(elem)
  const prevElemSiblingMarginBottom = getMargin(elem.previousElementSibling, 'marginBottom')
  const nextElemSiblingMarginTop = getMargin(elem.nextElementSibling, 'marginTop')
  const collapsedTopMargin = Math.max(parseFloat(marginTop), prevElemSiblingMarginBottom)
  const collapsedBottomMargin = Math.max(parseFloat(marginBottom), nextElemSiblingMarginTop)

  return { marginBottom: collapsedBottomMargin, marginTop: collapsedTopMargin }
}
```

--------------------------------------------------------------------------------

````
