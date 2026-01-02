---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 277
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 277 of 695)

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
Location: payload-main/packages/richtext-lexical/src/features/experimental_table/client/plugins/TableActionMenuPlugin/index.tsx
Signals: React

```typescript
'use client'

import type { TableObserver, TableSelection } from '@lexical/table'
import type { ElementNode } from 'lexical'
import type { JSX } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import {
  $computeTableMapSkipCellCheck,
  $deleteTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $getNodeTriplet,
  $getTableCellNodeFromLexicalNode,
  $getTableColumnIndexFromTableCellNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowIndexFromTableCellNode,
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
  $isTableCellNode,
  $isTableSelection,
  $mergeCells,
  $unmergeCell,
  getTableElement,
  getTableObserverFromTableElement,
  TableCellHeaderStates,
  TableCellNode,
} from '@lexical/table'
import { mergeRegister } from '@lexical/utils'
import { useScrollInfo } from '@payloadcms/ui'
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  COMMAND_PRIORITY_CRITICAL,
  getDOMSelection,
  isDOMNode,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { PluginComponentWithAnchor } from '../../../../typesClient.js'

import './index.scss'
import { MeatballsIcon } from '../../../../../lexical/ui/icons/Meatballs/index.js'

function computeSelectionCount(selection: TableSelection): {
  columns: number
  rows: number
} {
  const selectionShape = selection.getShape()
  return {
    columns: selectionShape.toX - selectionShape.fromX + 1,
    rows: selectionShape.toY - selectionShape.fromY + 1,
  }
}

function $canUnmerge(): boolean {
  const selection = $getSelection()
  if (
    ($isRangeSelection(selection) && !selection.isCollapsed()) ||
    ($isTableSelection(selection) && !selection.anchor.is(selection.focus)) ||
    (!$isRangeSelection(selection) && !$isTableSelection(selection))
  ) {
    return false
  }
  const [cell] = $getNodeTriplet(selection.anchor)
  return cell.__colSpan > 1 || cell.__rowSpan > 1
}

function $selectLastDescendant(node: ElementNode): void {
  const lastDescendant = node.getLastDescendant()
  if ($isTextNode(lastDescendant)) {
    lastDescendant.select()
  } else if ($isElementNode(lastDescendant)) {
    lastDescendant.selectEnd()
  } else if (lastDescendant !== null) {
    lastDescendant.selectNext()
  }
}

type TableCellActionMenuProps = Readonly<{
  cellMerge: boolean
  contextRef: { current: HTMLElement | null }
  onClose: () => void
  setIsMenuOpen: (isOpen: boolean) => void
  tableCellNode: TableCellNode
}>

function TableActionMenu({
  cellMerge,
  contextRef,
  onClose,
  setIsMenuOpen,
  tableCellNode: _tableCellNode,
}: TableCellActionMenuProps) {
  const [editor] = useLexicalComposerContext()
  const dropDownRef = useRef<HTMLDivElement | null>(null)
  const [tableCellNode, updateTableCellNode] = useState(_tableCellNode)
  const [selectionCounts, updateSelectionCounts] = useState({
    columns: 1,
    rows: 1,
  })
  const [canMergeCells, setCanMergeCells] = useState(false)
  const [canUnmergeCell, setCanUnmergeCell] = useState(false)
  const { y } = useScrollInfo()

  useEffect(() => {
    return editor.registerMutationListener(
      TableCellNode,
      (nodeMutations) => {
        const nodeUpdated = nodeMutations.get(tableCellNode.getKey()) === 'updated'

        if (nodeUpdated) {
          editor.getEditorState().read(() => {
            updateTableCellNode(tableCellNode.getLatest())
          })
        }
      },
      { skipInitialization: true },
    )
  }, [editor, tableCellNode])

  useEffect(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection()
      // Merge cells
      if ($isTableSelection(selection)) {
        const currentSelectionCounts = computeSelectionCount(selection)
        updateSelectionCounts(computeSelectionCount(selection))

        setCanMergeCells(currentSelectionCounts.columns > 1 || currentSelectionCounts.rows > 1)
      }
      // Unmerge cell
      setCanUnmergeCell($canUnmerge())
    })
  }, [editor])

  useEffect(() => {
    const menuButtonElement = contextRef.current
    const dropDownElement = dropDownRef.current
    const rootElement = editor.getRootElement()

    if (menuButtonElement != null && dropDownElement != null && rootElement != null) {
      const rootEleRect = rootElement.getBoundingClientRect()
      const menuButtonRect = menuButtonElement.getBoundingClientRect()
      dropDownElement.style.opacity = '1'
      const dropDownElementRect = dropDownElement.getBoundingClientRect()
      const margin = 5
      let leftPosition = menuButtonRect.right + margin
      if (
        leftPosition + dropDownElementRect.width > window.innerWidth ||
        leftPosition + dropDownElementRect.width > rootEleRect.right
      ) {
        const position = menuButtonRect.left - dropDownElementRect.width - margin
        leftPosition = (position < 0 ? margin : position) + window.pageXOffset
      }
      dropDownElement.style.left = `${leftPosition + window.pageXOffset}px`

      let topPosition = menuButtonRect.top
      if (topPosition + dropDownElementRect.height > window.innerHeight) {
        const position = menuButtonRect.bottom - dropDownElementRect.height
        topPosition = position < 0 ? margin : position
      }
      dropDownElement.style.top = `${topPosition}px`
    }
  }, [contextRef, dropDownRef, editor, y])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropDownRef.current != null &&
        contextRef.current != null &&
        isDOMNode(event.target) &&
        !dropDownRef.current.contains(event.target) &&
        !contextRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('click', handleClickOutside)

    return () => window.removeEventListener('click', handleClickOutside)
  }, [setIsMenuOpen, contextRef])

  const clearTableSelection = useCallback(() => {
    editor.update(() => {
      if (tableCellNode.isAttached()) {
        const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode)
        const tableElement = getTableElement(tableNode, editor.getElementByKey(tableNode.getKey()))

        if (tableElement === null) {
          throw new Error('Expected to find tableElement in DOM')
        }

        const tableObserver = getTableObserverFromTableElement(tableElement)
        if (tableObserver !== null) {
          tableObserver.$clearHighlight()
        }

        tableNode.markDirty()
        updateTableCellNode(tableCellNode.getLatest())
      }

      $setSelection(null)
    })
  }, [editor, tableCellNode])

  const mergeTableCellsAtSelection = () => {
    editor.update(() => {
      const selection = $getSelection()
      if (!$isTableSelection(selection)) {
        return
      }
      const nodes = selection.getNodes()
      const tableCells = nodes.filter($isTableCellNode)
      const targetCell = $mergeCells(tableCells)

      if (targetCell) {
        $selectLastDescendant(targetCell)
        onClose()
      }
    })
  }

  const unmergeTableCellsAtSelection = () => {
    editor.update(() => {
      $unmergeCell()
    })
  }

  const insertTableRowAtSelection = useCallback(
    (shouldInsertAfter: boolean) => {
      editor.update(() => {
        for (let i = 0; i < selectionCounts.rows; i++) {
          $insertTableRowAtSelection(shouldInsertAfter)
        }
        onClose()
      })
    },
    [editor, onClose, selectionCounts.rows],
  )

  const insertTableColumnAtSelection = useCallback(
    (shouldInsertAfter: boolean) => {
      editor.update(() => {
        for (let i = 0; i < selectionCounts.columns; i++) {
          $insertTableColumnAtSelection(shouldInsertAfter)
        }
        onClose()
      })
    },
    [editor, onClose, selectionCounts.columns],
  )

  const deleteTableRowAtSelection = useCallback(() => {
    editor.update(() => {
      $deleteTableRowAtSelection()
      onClose()
    })
  }, [editor, onClose])

  const deleteTableAtSelection = useCallback(() => {
    editor.update(() => {
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode)
      tableNode.remove()

      clearTableSelection()
      onClose()
    })
  }, [editor, tableCellNode, clearTableSelection, onClose])

  const deleteTableColumnAtSelection = useCallback(() => {
    editor.update(() => {
      $deleteTableColumnAtSelection()
      onClose()
    })
  }, [editor, onClose])

  const toggleTableRowIsHeader = useCallback(() => {
    editor.update(() => {
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode)

      const tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode)

      const [gridMap] = $computeTableMapSkipCellCheck(tableNode, null, null)

      const rowCells = new Set<TableCellNode>()

      const newStyle = tableCellNode.getHeaderStyles() ^ TableCellHeaderStates.ROW
      if (gridMap[tableRowIndex]) {
        for (let col = 0; col < gridMap[tableRowIndex].length; col++) {
          const mapCell = gridMap[tableRowIndex][col]

          if (!mapCell?.cell) {
            continue
          }

          if (!rowCells.has(mapCell.cell)) {
            rowCells.add(mapCell.cell)
            mapCell.cell.setHeaderStyles(newStyle, TableCellHeaderStates.ROW)
          }
        }
      }

      clearTableSelection()
      onClose()
    })
  }, [editor, tableCellNode, clearTableSelection, onClose])

  const toggleTableColumnIsHeader = useCallback(() => {
    editor.update(() => {
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode)

      const tableColumnIndex = $getTableColumnIndexFromTableCellNode(tableCellNode)

      const [gridMap] = $computeTableMapSkipCellCheck(tableNode, null, null)

      const columnCells = new Set<TableCellNode>()

      const newStyle = tableCellNode.getHeaderStyles() ^ TableCellHeaderStates.COLUMN
      if (gridMap) {
        for (let row = 0; row < gridMap.length; row++) {
          const mapCell = gridMap?.[row]?.[tableColumnIndex]

          if (!mapCell?.cell) {
            continue
          }

          if (!columnCells.has(mapCell.cell)) {
            columnCells.add(mapCell.cell)
            mapCell.cell.setHeaderStyles(newStyle, TableCellHeaderStates.COLUMN)
          }
        }
      }

      clearTableSelection()
      onClose()
    })
  }, [editor, tableCellNode, clearTableSelection, onClose])

  const toggleRowStriping = useCallback(() => {
    editor.update(() => {
      if (tableCellNode.isAttached()) {
        const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode)
        if (tableNode) {
          tableNode.setRowStriping(!tableNode.getRowStriping())
        }
      }

      clearTableSelection()
      onClose()
    })
  }, [editor, tableCellNode, clearTableSelection, onClose])

  const toggleFirstColumnFreeze = useCallback(() => {
    editor.update(() => {
      if (tableCellNode.isAttached()) {
        const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode)
        if (tableNode) {
          tableNode.setFrozenColumns(tableNode.getFrozenColumns() === 0 ? 1 : 0)
        }
      }
      clearTableSelection()
      onClose()
    })
  }, [editor, tableCellNode, clearTableSelection, onClose])

  let mergeCellButton: JSX.Element | null = null
  if (cellMerge) {
    if (canMergeCells) {
      mergeCellButton = (
        <button
          className="item"
          data-test-id="table-merge-cells"
          onClick={() => mergeTableCellsAtSelection()}
          type="button"
        >
          <span className="text">Merge cells</span>
        </button>
      )
    } else if (canUnmergeCell) {
      mergeCellButton = (
        <button
          className="item"
          data-test-id="table-unmerge-cells"
          onClick={() => unmergeTableCellsAtSelection()}
          type="button"
        >
          <span className="text">Unmerge cells</span>
        </button>
      )
    }
  }

  return createPortal(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
    <div
      className="table-action-menu-dropdown"
      onClick={(e) => {
        e.stopPropagation()
      }}
      ref={dropDownRef}
    >
      {mergeCellButton ? (
        <React.Fragment>
          {mergeCellButton}
          <hr />
        </React.Fragment>
      ) : null}

      <button
        className="item"
        data-test-id="table-row-striping"
        onClick={() => toggleRowStriping()}
        type="button"
      >
        <span className="text">Toggle Row Striping</span>
      </button>
      <button
        className="item"
        data-test-id="table-freeze-first-column"
        onClick={() => toggleFirstColumnFreeze()}
        type="button"
      >
        <span className="text">Toggle First Column Freeze</span>
      </button>
      <button
        className="item"
        data-test-id="table-insert-row-above"
        onClick={() => insertTableRowAtSelection(false)}
        type="button"
      >
        <span className="text">
          Insert {selectionCounts.rows === 1 ? 'row' : `${selectionCounts.rows} rows`} above
        </span>
      </button>
      <button
        className="item"
        data-test-id="table-insert-row-below"
        onClick={() => insertTableRowAtSelection(true)}
        type="button"
      >
        <span className="text">
          Insert {selectionCounts.rows === 1 ? 'row' : `${selectionCounts.rows} rows`} below
        </span>
      </button>
      <hr />
      <button
        className="item"
        data-test-id="table-insert-column-before"
        onClick={() => insertTableColumnAtSelection(false)}
        type="button"
      >
        <span className="text">
          Insert {selectionCounts.columns === 1 ? 'column' : `${selectionCounts.columns} columns`}{' '}
          left
        </span>
      </button>
      <button
        className="item"
        data-test-id="table-insert-column-after"
        onClick={() => insertTableColumnAtSelection(true)}
        type="button"
      >
        <span className="text">
          Insert {selectionCounts.columns === 1 ? 'column' : `${selectionCounts.columns} columns`}{' '}
          right
        </span>
      </button>
      <hr />
      <button
        className="item"
        data-test-id="table-delete-columns"
        onClick={() => deleteTableColumnAtSelection()}
        type="button"
      >
        <span className="text">Delete column</span>
      </button>
      <button
        className="item"
        data-test-id="table-delete-rows"
        onClick={() => deleteTableRowAtSelection()}
        type="button"
      >
        <span className="text">Delete row</span>
      </button>
      <button
        className="item"
        data-test-id="table-delete"
        onClick={() => deleteTableAtSelection()}
        type="button"
      >
        <span className="text">Delete table</span>
      </button>
      <hr />
      <button
        className="item"
        data-test-id="table-row-header"
        onClick={() => toggleTableRowIsHeader()}
        type="button"
      >
        <span className="text">
          {(tableCellNode.__headerState & TableCellHeaderStates.ROW) === TableCellHeaderStates.ROW
            ? 'Remove'
            : 'Add'}{' '}
          row header
        </span>
      </button>
      <button
        className="item"
        data-test-id="table-column-header"
        onClick={() => toggleTableColumnIsHeader()}
        type="button"
      >
        <span className="text">
          {(tableCellNode.__headerState & TableCellHeaderStates.COLUMN) ===
          TableCellHeaderStates.COLUMN
            ? 'Remove'
            : 'Add'}{' '}
          column header
        </span>
      </button>
    </div>,
    document.body,
  )
}

function TableCellActionMenuContainer({
  anchorElem,
  cellMerge,
}: {
  anchorElem: HTMLElement
  cellMerge: boolean
}): JSX.Element {
  const [editor] = useLexicalComposerContext()

  const menuButtonRef = useRef<HTMLDivElement | null>(null)
  const menuRootRef = useRef<HTMLButtonElement | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [tableCellNode, setTableMenuCellNode] = useState<null | TableCellNode>(null)

  const $moveMenu = useCallback(() => {
    const menu = menuButtonRef.current
    const selection = $getSelection()
    const nativeSelection = getDOMSelection(editor._window)
    const activeElement = document.activeElement
    function disable() {
      if (menu) {
        menu.classList.remove('table-cell-action-button-container--active')
        menu.classList.add('table-cell-action-button-container--inactive')
      }
      setTableMenuCellNode(null)
    }

    if (selection == null || menu == null) {
      return disable()
    }

    const rootElement = editor.getRootElement()
    let tableObserver: null | TableObserver = null
    let tableCellParentNodeDOM: HTMLElement | null = null

    if (
      $isRangeSelection(selection) &&
      rootElement !== null &&
      nativeSelection !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const tableCellNodeFromSelection = $getTableCellNodeFromLexicalNode(
        selection.anchor.getNode(),
      )

      if (tableCellNodeFromSelection == null) {
        return disable()
      }

      tableCellParentNodeDOM = editor.getElementByKey(tableCellNodeFromSelection.getKey())

      if (tableCellParentNodeDOM == null || !tableCellNodeFromSelection.isAttached()) {
        return disable()
      }

      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNodeFromSelection)
      const tableElement = getTableElement(tableNode, editor.getElementByKey(tableNode.getKey()))

      if (tableElement === null) {
        throw new Error('TableActionMenu: Expected to find tableElement in DOM')
      }

      tableObserver = getTableObserverFromTableElement(tableElement)
      setTableMenuCellNode(tableCellNodeFromSelection)
    } else if ($isTableSelection(selection)) {
      const anchorNode = $getTableCellNodeFromLexicalNode(selection.anchor.getNode())
      if (!$isTableCellNode(anchorNode)) {
        throw new Error('TableSelection anchorNode must be a TableCellNode')
      }
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(anchorNode)
      const tableElement = getTableElement(tableNode, editor.getElementByKey(tableNode.getKey()))

      if (tableElement === null) {
        throw new Error('TableActionMenu: Expected to find tableElement in DOM')
      }

      tableObserver = getTableObserverFromTableElement(tableElement)
      tableCellParentNodeDOM = editor.getElementByKey(anchorNode.getKey())
    } else if (!activeElement) {
      return disable()
    }
    if (tableObserver === null || tableCellParentNodeDOM === null) {
      return disable()
    }
    const enabled = !tableObserver || !tableObserver.isSelecting
    menu.classList.toggle('table-cell-action-button-container--active', enabled)
    menu.classList.toggle('table-cell-action-button-container--inactive', !enabled)
    if (enabled) {
      const tableCellRect = tableCellParentNodeDOM.getBoundingClientRect()
      const anchorRect = anchorElem.getBoundingClientRect()
      const top = tableCellRect.top - anchorRect.top
      const left = tableCellRect.right - anchorRect.left
      menu.style.transform = `translate(${left}px, ${top}px)`
    }
  }, [editor, anchorElem])

  useEffect(() => {
    // We call the $moveMenu callback every time the selection changes,
    // once up front, and once after each pointerup
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined
    const callback = () => {
      timeoutId = undefined
      editor.getEditorState().read($moveMenu)
    }
    const delayedCallback = () => {
      if (timeoutId === undefined) {
        timeoutId = setTimeout(callback, 0)
      }
      return false
    }
    return mergeRegister(
      editor.registerUpdateListener(delayedCallback),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, delayedCallback, COMMAND_PRIORITY_CRITICAL),
      editor.registerRootListener((rootElement, prevRootElement) => {
        if (prevRootElement) {
          prevRootElement.removeEventListener('pointerup', delayedCallback)
        }
        if (rootElement) {
          rootElement.addEventListener('pointerup', delayedCallback)
          delayedCallback()
        }
      }),
      () => clearTimeout(timeoutId),
    )
  })

  const prevTableCellDOM = useRef(tableCellNode)

  useEffect(() => {
    if (prevTableCellDOM.current !== tableCellNode) {
      setIsMenuOpen(false)
    }

    prevTableCellDOM.current = tableCellNode
  }, [prevTableCellDOM, tableCellNode])

  return (
    <div className="table-cell-action-button-container" ref={menuButtonRef}>
      {tableCellNode != null && (
        <React.Fragment>
          <button
            className="table-cell-action-button"
            onClick={(e) => {
              e.stopPropagation()
              setIsMenuOpen(!isMenuOpen)
            }}
            ref={menuRootRef}
            type="button"
          >
            <MeatballsIcon />
          </button>
          {isMenuOpen && (
            <TableActionMenu
              cellMerge={cellMerge}
              contextRef={menuRootRef}
              onClose={() => setIsMenuOpen(false)}
              setIsMenuOpen={setIsMenuOpen}
              tableCellNode={tableCellNode}
            />
          )}
        </React.Fragment>
      )}
    </div>
  )
}

export const TableActionMenuPlugin: PluginComponentWithAnchor = ({ anchorElem }) => {
  const isEditable = useLexicalEditable()
  return createPortal(
    isEditable ? (
      <TableCellActionMenuContainer anchorElem={anchorElem ?? document.body} cellMerge />
    ) : null,
    anchorElem ?? document.body,
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/experimental_table/client/plugins/TableCellResizerPlugin/index.scss

```text
.TableCellResizer__resizer {
  position: absolute;
  touch-action: none;
}

@media (pointer: coarse) {
  .TableCellResizer__resizer {
    background-color: #adf;
    mix-blend-mode: color;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/experimental_table/client/plugins/TableCellResizerPlugin/index.tsx
Signals: React

```typescript
'use client'

import type { TableCellNode, TableDOMCell, TableMapType } from '@lexical/table'
import type { LexicalEditor, NodeKey } from 'lexical'
import type { JSX, MouseEventHandler } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import {
  $computeTableMapSkipCellCheck,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowIndexFromTableCellNode,
  $isTableCellNode,
  $isTableRowNode,
  getDOMCellFromTarget,
  getTableElement,
  TableNode,
} from '@lexical/table'
import { calculateZoomLevel, mergeRegister } from '@lexical/utils'
import { $getNearestNodeFromDOMNode, isHTMLElement, SKIP_SCROLL_INTO_VIEW_TAG } from 'lexical'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { PluginComponent } from '../../../../typesClient.js'

import './index.scss'
import { useEditorConfigContext } from '../../../../../lexical/config/client/EditorConfigProvider.js'

type MousePosition = {
  x: number
  y: number
}

type MouseDraggingDirection = 'bottom' | 'right'

const MIN_ROW_HEIGHT = 33
const MIN_COLUMN_WIDTH = 92

function TableCellResizer({ editor }: { editor: LexicalEditor }): JSX.Element {
  const targetRef = useRef<HTMLElement | null>(null)
  const resizerRef = useRef<HTMLDivElement | null>(null)
  const tableRectRef = useRef<ClientRect | null>(null)
  const [hasTable, setHasTable] = useState(false)
  const editorConfig = useEditorConfigContext()

  const mouseStartPosRef = useRef<MousePosition | null>(null)
  const [mouseCurrentPos, updateMouseCurrentPos] = useState<MousePosition | null>(null)

  const [activeCell, updateActiveCell] = useState<null | TableDOMCell>(null)
  const [isMouseDown, updateIsMouseDown] = useState<boolean>(false)
  const [draggingDirection, updateDraggingDirection] = useState<MouseDraggingDirection | null>(null)

  const resetState = useCallback(() => {
    updateActiveCell(null)
    targetRef.current = null
    updateDraggingDirection(null)
    mouseStartPosRef.current = null
    tableRectRef.current = null
  }, [])

  const isMouseDownOnEvent = (event: MouseEvent) => {
    return (event.buttons & 1) === 1
  }

  useEffect(() => {
    const tableKeys = new Set<NodeKey>()
    return mergeRegister(
      editor.registerMutationListener(TableNode, (nodeMutations) => {
        for (const [nodeKey, mutation] of nodeMutations) {
          if (mutation === 'destroyed') {
            tableKeys.delete(nodeKey)
          } else {
            tableKeys.add(nodeKey)
          }
        }
        setHasTable(tableKeys.size > 0)
      }),
      editor.registerNodeTransform(TableNode, (tableNode) => {
        if (tableNode.getColWidths()) {
          return tableNode
        }

        const numColumns = tableNode.getColumnCount()
        const columnWidth = MIN_COLUMN_WIDTH

        tableNode.setColWidths(Array(numColumns).fill(columnWidth))
        return tableNode
      }),
    )
  }, [editor])

  useEffect(() => {
    if (!hasTable) {
      return
    }

    const onMouseMove = (event: MouseEvent) => {
      const target = event.target
      if (!isHTMLElement(target)) {
        return
      }

      if (draggingDirection) {
        updateMouseCurrentPos({
          x: event.clientX,
          y: event.clientY,
        })
        return
      }
      updateIsMouseDown(isMouseDownOnEvent(event))
      if (resizerRef.current && resizerRef.current.contains(target)) {
        return
      }

      if (targetRef.current !== target) {
        targetRef.current = target
        const cell = getDOMCellFromTarget(target)

        if (cell && activeCell !== cell) {
          editor.getEditorState().read(
            () => {
              const tableCellNode = $getNearestNodeFromDOMNode(cell.elem)

              if (!tableCellNode) {
                throw new Error('TableCellResizer: Table cell node not found.')
              }

              const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode)
              const tableElement = getTableElement(
                tableNode,
                editor.getElementByKey(tableNode.getKey()),
              )
              if (!tableElement) {
                throw new Error('TableCellResizer: Table element not found.')
              }

              targetRef.current = target
              tableRectRef.current = tableElement.getBoundingClientRect()
              updateActiveCell(cell)
            },
            { editor },
          )
        } else if (cell == null) {
          resetState()
        }
      }
    }

    const onMouseDown = (event: MouseEvent) => {
      updateIsMouseDown(true)
    }

    const onMouseUp = (event: MouseEvent) => {
      updateIsMouseDown(false)
    }

    const removeRootListener = editor.registerRootListener((rootElement, prevRootElement) => {
      prevRootElement?.removeEventListener('mousemove', onMouseMove)
      prevRootElement?.removeEventListener('mousedown', onMouseDown)
      prevRootElement?.removeEventListener('mouseup', onMouseUp)
      rootElement?.addEventListener('mousemove', onMouseMove)
      rootElement?.addEventListener('mousedown', onMouseDown)
      rootElement?.addEventListener('mouseup', onMouseUp)
    })

    return () => {
      removeRootListener()
    }
  }, [activeCell, draggingDirection, editor, hasTable, resetState])

  const isHeightChanging = (direction: MouseDraggingDirection) => {
    if (direction === 'bottom') {
      return true
    }
    return false
  }

  const updateRowHeight = useCallback(
    (heightChange: number) => {
      if (!activeCell) {
        throw new Error('TableCellResizer: Expected active cell.')
      }

      editor.update(
        () => {
          const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem)
          if (!$isTableCellNode(tableCellNode)) {
            throw new Error('TableCellResizer: Table cell node not found.')
          }

          const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode)

          const baseRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode)
          const tableRows = tableNode.getChildren()

          // Determine if this is a full row merge by checking colspan
          const isFullRowMerge = tableCellNode.getColSpan() === tableNode.getColumnCount()

          // For full row merges, apply to first row. For partial merges, apply to last row
          const tableRowIndex = isFullRowMerge
            ? baseRowIndex
            : baseRowIndex + tableCellNode.getRowSpan() - 1

          if (tableRowIndex >= tableRows.length || tableRowIndex < 0) {
            throw new Error('Expected table cell to be inside of table row.')
          }

          const tableRow = tableRows[tableRowIndex]

          if (!$isTableRowNode(tableRow)) {
            throw new Error('Expected table row')
          }

          let height = tableRow.getHeight()
          if (height === undefined) {
            const rowCells = tableRow.getChildren<TableCellNode>()
            height = Math.min(
              ...rowCells.map((cell) => getCellNodeHeight(cell, editor) ?? Infinity),
            )
          }

          const newHeight = Math.max(height + heightChange, MIN_ROW_HEIGHT)
          tableRow.setHeight(newHeight)
        },
        { tag: SKIP_SCROLL_INTO_VIEW_TAG },
      )
    },
    [activeCell, editor],
  )

  const getCellNodeHeight = (
    cell: TableCellNode,
    activeEditor: LexicalEditor,
  ): number | undefined => {
    const domCellNode = activeEditor.getElementByKey(cell.getKey())
    return domCellNode?.clientHeight
  }

  const getCellColumnIndex = (tableCellNode: TableCellNode, tableMap: TableMapType) => {
    let columnIndex: number | undefined
    tableMap.forEach((row) => {
      row.forEach((cell, columnIndexInner) => {
        if (cell.cell === tableCellNode) {
          columnIndex = columnIndexInner
        }
      })
    })
    return columnIndex
  }

  const updateColumnWidth = useCallback(
    (widthChange: number) => {
      if (!activeCell) {
        throw new Error('TableCellResizer: Expected active cell.')
      }
      editor.update(
        () => {
          const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem)
          if (!$isTableCellNode(tableCellNode)) {
            throw new Error('TableCellResizer: Table cell node not found.')
          }

          const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode)
          const [tableMap] = $computeTableMapSkipCellCheck(tableNode, null, null)
          const columnIndex = getCellColumnIndex(tableCellNode, tableMap)
          if (columnIndex === undefined) {
            throw new Error('TableCellResizer: Table column not found.')
          }

          const colWidths = tableNode.getColWidths()
          if (!colWidths) {
            return
          }
          const width = colWidths[columnIndex]
          if (width === undefined) {
            return
          }
          const newColWidths = [...colWidths]
          const newWidth = Math.max(width + widthChange, MIN_COLUMN_WIDTH)
          newColWidths[columnIndex] = newWidth
          tableNode.setColWidths(newColWidths)
        },
        { tag: SKIP_SCROLL_INTO_VIEW_TAG },
      )
    },
    [activeCell, editor],
  )

  const mouseUpHandler = useCallback(
    (direction: MouseDraggingDirection) => {
      const handler = (event: MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()

        if (!activeCell) {
          throw new Error('TableCellResizer: Expected active cell.')
        }

        if (mouseStartPosRef.current) {
          const { x, y } = mouseStartPosRef.current

          if (activeCell === null) {
            return
          }
          const zoom = calculateZoomLevel(event.target as Element)

          if (isHeightChanging(direction)) {
            const heightChange = (event.clientY - y) / zoom
            updateRowHeight(heightChange)
          } else {
            const widthChange = (event.clientX - x) / zoom
            updateColumnWidth(widthChange)
          }

          resetState()
          document.removeEventListener('mouseup', handler)
        }
      }
      return handler
    },
    [activeCell, resetState, updateColumnWidth, updateRowHeight],
  )

  const toggleResize = useCallback(
    (direction: MouseDraggingDirection): MouseEventHandler<HTMLDivElement> =>
      (event) => {
        event.preventDefault()
        event.stopPropagation()

        if (!activeCell) {
          throw new Error('TableCellResizer: Expected active cell.')
        }

        mouseStartPosRef.current = {
          x: event.clientX,
          y: event.clientY,
        }
        updateMouseCurrentPos(mouseStartPosRef.current)
        updateDraggingDirection(direction)

        document.addEventListener('mouseup', mouseUpHandler(direction))
      },
    [activeCell, mouseUpHandler],
  )

  const [resizerStyles, setResizerStyles] = useState<{
    bottom?: null | React.CSSProperties
    left?: null | React.CSSProperties
    right?: null | React.CSSProperties
    top?: null | React.CSSProperties
  }>({
    bottom: null,
    left: null,
    right: null,
    top: null,
  })

  useEffect(() => {
    if (activeCell) {
      const { height, left, top, width } = activeCell.elem.getBoundingClientRect()
      const zoom = calculateZoomLevel(activeCell.elem)
      const zoneWidth = 10 // Pixel width of the zone where you can drag the edge
      const styles = {
        bottom: {
          backgroundColor: 'none',
          cursor: 'row-resize',
          height: `${zoneWidth}px`,
          left: `${window.scrollX + left}px`,
          top: `${window.scrollY + top + height - zoneWidth / 2}px`,
          width: `${width}px`,
        },
        right: {
          backgroundColor: 'none',
          cursor: 'col-resize',
          height: `${height}px`,
          left: `${window.scrollX + left + width - zoneWidth / 2}px`,
          top: `${window.scrollY + top}px`,
          width: `${zoneWidth}px`,
        },
      }

      const tableRect = tableRectRef.current

      if (draggingDirection && mouseCurrentPos && tableRect) {
        if (isHeightChanging(draggingDirection)) {
          styles[draggingDirection].left = `${window.scrollX + tableRect.left}px`
          styles[draggingDirection].top = `${window.scrollY + mouseCurrentPos.y / zoom}px`
          styles[draggingDirection].height = '3px'
          styles[draggingDirection].width = `${tableRect.width}px`
        } else {
          styles[draggingDirection].top = `${window.scrollY + tableRect.top}px`
          styles[draggingDirection].left = `${window.scrollX + mouseCurrentPos.x / zoom}px`
          styles[draggingDirection].width = '3px'
          styles[draggingDirection].height = `${tableRect.height}px`
        }

        styles[draggingDirection].backgroundColor = '#adf'
      }

      setResizerStyles(styles)
    } else {
      setResizerStyles({
        bottom: null,
        left: null,
        right: null,
        top: null,
      })
    }
  }, [activeCell, draggingDirection, mouseCurrentPos])

  return (
    <div ref={resizerRef}>
      {activeCell != null && !isMouseDown && (
        <React.Fragment>
          <div
            className={`${editorConfig.editorConfig.lexical.theme.tableCellResizer} TableCellResizer__ui`}
            onMouseDown={toggleResize('right')}
            style={resizerStyles.right || undefined}
          />
          <div
            className={`${editorConfig.editorConfig.lexical.theme.tableCellResizer} TableCellResizer__ui`}
            onMouseDown={toggleResize('bottom')}
            style={resizerStyles.bottom || undefined}
          />
        </React.Fragment>
      )}
    </div>
  )
}

export const TableCellResizerPlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext()
  const isEditable = useLexicalEditable()

  return useMemo(
    () => (isEditable ? createPortal(<TableCellResizer editor={editor} />, document.body) : null),
    [editor, isEditable],
  )
}
```

--------------------------------------------------------------------------------

````
