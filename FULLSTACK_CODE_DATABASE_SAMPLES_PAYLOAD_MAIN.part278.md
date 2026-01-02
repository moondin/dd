---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 278
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 278 of 695)

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
Location: payload-main/packages/richtext-lexical/src/features/experimental_table/client/plugins/TableHoverActionsPlugin/index.tsx
Signals: React

```typescript
'use client'

import type { TableCellNode, TableRowNode } from '@lexical/table'
import type { EditorConfig, NodeKey } from 'lexical'
import type { JSX } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import {
  $getTableAndElementByKey,
  $getTableColumnIndexFromTableCellNode,
  $getTableRowIndexFromTableCellNode,
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
  $isTableCellNode,
  $isTableNode,
  getTableElement,
  TableNode,
} from '@lexical/table'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import { $getNearestNodeFromDOMNode, isHTMLElement } from 'lexical'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { useEditorConfigContext } from '../../../../../lexical/config/client/EditorConfigProvider.js'
import { useDebounce } from '../../utils/useDebounce.js'

const BUTTON_WIDTH_PX = 20

function TableHoverActionsContainer({
  anchorElem,
}: {
  anchorElem: HTMLElement
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const isEditable = useLexicalEditable()

  const editorConfig = useEditorConfigContext()
  const [isShownRow, setShownRow] = useState<boolean>(false)
  const [isShownColumn, setShownColumn] = useState<boolean>(false)
  const [shouldListenMouseMove, setShouldListenMouseMove] = useState<boolean>(false)
  const [position, setPosition] = useState({})
  const tableSetRef = useRef<Set<NodeKey>>(new Set())
  const tableCellDOMNodeRef = useRef<HTMLElement | null>(null)

  const debouncedOnMouseMove = useDebounce(
    (event: MouseEvent) => {
      const { isOutside, tableDOMNode } = getMouseInfo(event, editorConfig.editorConfig?.lexical)

      if (isOutside) {
        setShownRow(false)
        setShownColumn(false)
        return
      }

      if (!tableDOMNode) {
        return
      }

      tableCellDOMNodeRef.current = tableDOMNode

      let hoveredRowNode: null | TableCellNode = null
      let hoveredColumnNode: null | TableCellNode = null
      let tableDOMElement: HTMLElement | null = null

      editor.getEditorState().read(
        () => {
          const maybeTableCell = $getNearestNodeFromDOMNode(tableDOMNode)

          if ($isTableCellNode(maybeTableCell)) {
            const table = $findMatchingParent(maybeTableCell, (node) => $isTableNode(node))
            if (!$isTableNode(table)) {
              return
            }

            tableDOMElement = getTableElement(table, editor.getElementByKey(table.getKey()))

            if (tableDOMElement) {
              const rowCount = table.getChildrenSize()
              const colCount = (table.getChildAtIndex(0) as TableRowNode)?.getChildrenSize()

              const rowIndex = $getTableRowIndexFromTableCellNode(maybeTableCell)
              const colIndex = $getTableColumnIndexFromTableCellNode(maybeTableCell)

              if (rowIndex === rowCount - 1) {
                hoveredRowNode = maybeTableCell
              } else if (colIndex === colCount - 1) {
                hoveredColumnNode = maybeTableCell
              }
            }
          }
        },
        { editor },
      )

      if (!tableDOMElement) {
        return
      }

      // this is the scrollable div container of the table (in case of overflow)
      const tableContainerElement = (tableDOMElement as HTMLTableElement).parentElement

      if (!tableContainerElement) {
        return
      }

      const {
        bottom: tableElemBottom,
        height: tableElemHeight,
        left: tableElemLeft,
        right: tableElemRight,
        width: tableElemWidth,
        y: tableElemY,
      } = (tableDOMElement as HTMLTableElement).getBoundingClientRect()

      let tableHasScroll = false
      if (
        tableContainerElement &&
        tableContainerElement.classList.contains('LexicalEditorTheme__tableScrollableWrapper')
      ) {
        tableHasScroll = tableContainerElement.scrollWidth > tableContainerElement.clientWidth
      }

      const { left: editorElemLeft, y: editorElemY } = anchorElem.getBoundingClientRect()

      if (hoveredRowNode) {
        setShownColumn(false)
        setShownRow(true)
        setPosition({
          height: BUTTON_WIDTH_PX,
          left:
            tableHasScroll && tableContainerElement
              ? tableContainerElement.offsetLeft
              : tableElemLeft - editorElemLeft,
          top: tableElemBottom - editorElemY + 5,
          width:
            tableHasScroll && tableContainerElement
              ? tableContainerElement.offsetWidth
              : tableElemWidth,
        })
      } else if (hoveredColumnNode) {
        setShownColumn(true)
        setShownRow(false)
        setPosition({
          height: tableElemHeight,
          left: tableElemRight - editorElemLeft + 5,
          top: tableElemY - editorElemY,
          width: BUTTON_WIDTH_PX,
        })
      }
    },
    50,
    250,
  )

  // Hide the buttons on any table dimensions change to prevent last row cells
  // overlap behind the 'Add Row' button when text entry changes cell height
  const tableResizeObserver = useMemo(() => {
    return new ResizeObserver(() => {
      setShownRow(false)
      setShownColumn(false)
    })
  }, [])

  useEffect(() => {
    if (!shouldListenMouseMove) {
      return
    }

    document.addEventListener('mousemove', debouncedOnMouseMove)

    return () => {
      setShownRow(false)
      setShownColumn(false)

      document.removeEventListener('mousemove', debouncedOnMouseMove)
    }
  }, [shouldListenMouseMove, debouncedOnMouseMove])

  useEffect(() => {
    return mergeRegister(
      editor.registerMutationListener(
        TableNode,
        (mutations) => {
          editor.getEditorState().read(
            () => {
              let resetObserver = false
              for (const [key, type] of mutations) {
                switch (type) {
                  case 'created': {
                    tableSetRef.current.add(key)
                    resetObserver = true
                    break
                  }
                  case 'destroyed': {
                    tableSetRef.current.delete(key)
                    resetObserver = true
                    break
                  }
                  default:
                    break
                }
              }
              if (resetObserver) {
                // Reset resize observers
                tableResizeObserver.disconnect()
                for (const tableKey of tableSetRef.current) {
                  const { tableElement } = $getTableAndElementByKey(tableKey)
                  tableResizeObserver.observe(tableElement)
                }
                setShouldListenMouseMove(tableSetRef.current.size > 0)
              }
            },
            { editor },
          )
        },
        { skipInitialization: false },
      ),
    )
  }, [editor, tableResizeObserver])

  const insertAction = (insertRow: boolean) => {
    editor.update(() => {
      if (tableCellDOMNodeRef.current) {
        const maybeTableNode = $getNearestNodeFromDOMNode(tableCellDOMNodeRef.current)
        maybeTableNode?.selectEnd()
        if (insertRow) {
          $insertTableRowAtSelection()
          setShownRow(false)
        } else {
          $insertTableColumnAtSelection()
          setShownColumn(false)
        }
      }
    })
  }

  if (!isEditable) {
    return null
  }

  return (
    <>
      {isShownRow && (
        <button
          aria-label="Add Row"
          className={editorConfig.editorConfig.lexical.theme.tableAddRows}
          onClick={() => insertAction(true)}
          style={{ ...position }}
          type="button"
        />
      )}
      {isShownColumn && (
        <button
          aria-label="Add Column"
          className={editorConfig.editorConfig.lexical.theme.tableAddColumns}
          onClick={() => insertAction(false)}
          style={{ ...position }}
          type="button"
        />
      )}
    </>
  )
}

function getMouseInfo(
  event: MouseEvent,
  editorConfig: EditorConfig,
): {
  isOutside: boolean
  tableDOMNode: HTMLElement | null
} {
  const target = event.target

  if (isHTMLElement(target)) {
    const tableDOMNode = target.closest<HTMLElement>(
      `td.${editorConfig.theme.tableCell}, th.${editorConfig.theme.tableCell}`,
    )

    const isOutside = !(
      tableDOMNode ||
      target.closest<HTMLElement>(`button.${editorConfig.theme.tableAddRows}`) ||
      target.closest<HTMLElement>(`button.${editorConfig.theme.tableAddColumns}`) ||
      target.closest<HTMLElement>(`div.${editorConfig.theme.tableCellResizer}`)
    )

    return { isOutside, tableDOMNode }
  } else {
    return { isOutside: true, tableDOMNode: null }
  }
}

export function TableHoverActionsPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement
}): null | React.ReactPortal {
  const isEditable = useLexicalEditable()

  if (!isEditable) {
    return null
  }

  return createPortal(<TableHoverActionsContainer anchorElem={anchorElem} />, anchorElem)
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/experimental_table/client/plugins/TablePlugin/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .LexicalEditorTheme {
    &__tableScrollableWrapper {
      overflow-x: auto;
      margin: 0px 25px 30px 0px;
    }
    &__tableScrollableWrapper > .LexicalEditorTheme__table {
      /* Remove the table's vertical margin and put it on the wrapper */
      margin-top: 0;
      margin-bottom: 0;
    }

    &__tableAlignmentCenter {
      margin-left: auto;
      margin-right: auto;
    }
    &__tableAlignmentRight {
      margin-left: auto;
    }

    &__tableSelection *::selection {
      background-color: transparent;
    }

    &__table {
      border-collapse: collapse;
      max-width: 100%;
      border-spacing: 0;
      overflow-y: scroll;
      overflow-x: scroll;
      table-layout: fixed;
      width: fit-content;
      margin-top: 25px;
      margin-bottom: 30px;

      ::selection {
        background: rgba(172, 206, 247);
      }

      br::selection {
        background: unset;
      }
    }

    &__tableFrozenColumn tr > td:first-child {
      background-color: var(--theme-bg);
      position: sticky;
      z-index: 2;
      left: 0;
    }
    &__tableFrozenColumn tr > th:first-child {
      background-color: var(--theme-elevation-50);
      position: sticky;
      z-index: 2;
      left: 0;
    }
    &__tableFrozenColumn tr > :first-child::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 100%;
      border-right: 1px solid var(--theme-elevation-400);
    }

    &__tableRowStriping tr:nth-child(even) {
      background-color: var(--theme-elevation-100);
    }

    &__tableSelected {
      outline: 2px solid rgb(60, 132, 244);
    }

    &__tableCell {
      border: 1px solid var(--theme-elevation-200);
      vertical-align: top;
      text-align: start;
      padding: 6px 8px;
      position: relative;
      cursor: default;
      outline: none;
    }

    /*
    * A firefox workaround to allow scrolling of overflowing table cell
    * ref: https://bugzilla.mozilla.org/show_bug.cgi?id=1904159
    */
    &__tableCell > * {
      overflow: inherit;
    }

    &__tableCellResizer {
      position: absolute;
      right: -4px;
      height: 100%;
      width: 8px;
      cursor: ew-resize;
      z-index: 10;
      top: 0;
    }

    &__tableCellHeader {
      background-color: #f2f3f5;
      text-align: start;
    }

    &__tableCellSelected {
      caret-color: transparent;
    }

    &__tableCellSelected::after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background-color: var(--color-success-250);
      mix-blend-mode: multiply;
      content: '';
      pointer-events: none;
    }

    &__tableAddColumns {
      height: 100%;
    }

    &__tableAddColumns,
    &__tableAddRows {
      position: absolute;
      background-color: var(--theme-elevation-100);
      animation: table-controls 0.2s ease;
      border: 0;
      cursor: pointer;
      min-width: 24px;
      min-height: 24px;
    }

    &__tableAddColumns:after,
    &__tableAddRows:after {
      display: flex;
      content: '+';
      font-size: 1.4rem;
      border-radius: $style-radius-s;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: var(--theme-elevation-500);
    }

    &__tableAddColumns:hover,
    &__tableAddRows:hover {
      background-color: var(--theme-elevation-150);
    }

    &__tableAddRows {
      width: calc(100% - 25px);
    }

    @keyframes table-controls {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    &__tableCellResizeRuler {
      display: block;
      position: absolute;
      width: 1px;
      background-color: rgb(60, 132, 244);
      height: 100%;
      top: 0;
    }

    &__tableCellActionButtonContainer {
      display: block;
      right: 5px;
      top: 6px;
      position: absolute;
      z-index: 4;
      width: 20px;
      height: 20px;
    }

    &__tableCellActionButton {
      background-color: #eee;
      display: block;
      border: 0;
      border-radius: 20px;
      width: 20px;
      height: 20px;
      color: #222;
      cursor: pointer;
    }

    &__tableCellActionButton:hover {
      background-color: #ddd;
    }
  }

  html[data-theme='dark'] {
    .LexicalEditorTheme {
      &__tableCellHeader {
        background-color: var(--theme-elevation-50);
      }

      &__tableCellSelected::after {
        background-color: var(--color-success-700);
        mix-blend-mode: screen;
      }

      &__tableAddColumns,
      &__tableAddRows {
        background-color: var(--theme-elevation-50);
      }

      &__tableAddColumns:hover,
      &__tableAddRows:hover {
        background-color: var(--theme-elevation-100);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/experimental_table/client/plugins/TablePlugin/index.tsx
Signals: React

```typescript
'use client'

import type {
  EditorThemeClasses,
  Klass,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
} from 'lexical'
import type { JSX } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TablePlugin as LexicalReactTablePlugin } from '@lexical/react/LexicalTablePlugin'
import { INSERT_TABLE_COMMAND, TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { mergeRegister } from '@lexical/utils'
import { formatDrawerSlug, useEditDepth } from '@payloadcms/ui'
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical'
import { createContext, use, useEffect, useMemo, useState } from 'react'
import * as React from 'react'

import type { PluginComponent } from '../../../../typesClient.js'

import { useEditorConfigContext } from '../../../../../lexical/config/client/EditorConfigProvider.js'
import { FieldsDrawer } from '../../../../../utilities/fieldsDrawer/Drawer.js'
import { useLexicalDrawer } from '../../../../../utilities/fieldsDrawer/useLexicalDrawer.js'
import './index.scss'

export type CellContextShape = {
  cellEditorConfig: CellEditorConfig | null
  cellEditorPlugins: Array<JSX.Element> | JSX.Element | null
  set: (
    cellEditorConfig: CellEditorConfig | null,
    cellEditorPlugins: Array<JSX.Element> | JSX.Element | null,
  ) => void
}

export type CellEditorConfig = Readonly<{
  namespace: string
  nodes?: ReadonlyArray<Klass<LexicalNode>>
  onError: (error: Error, editor: LexicalEditor) => void
  readOnly?: boolean
  theme?: EditorThemeClasses
}>

export const OPEN_TABLE_DRAWER_COMMAND: LexicalCommand<{}> = createCommand(
  'OPEN_EMBED_DRAWER_COMMAND',
)

export const CellContext = createContext<CellContextShape>({
  cellEditorConfig: null,
  cellEditorPlugins: null,
  set: () => {
    // Empty
  },
})

export function TableContext({ children }: { children: JSX.Element }) {
  const [contextValue, setContextValue] = useState<{
    cellEditorConfig: CellEditorConfig | null
    cellEditorPlugins: Array<JSX.Element> | JSX.Element | null
  }>({
    cellEditorConfig: null,
    cellEditorPlugins: null,
  })
  return (
    <CellContext
      value={useMemo(
        () => ({
          cellEditorConfig: contextValue.cellEditorConfig,
          cellEditorPlugins: contextValue.cellEditorPlugins,
          set: (cellEditorConfig, cellEditorPlugins) => {
            setContextValue({ cellEditorConfig, cellEditorPlugins })
          },
        }),
        [contextValue.cellEditorConfig, contextValue.cellEditorPlugins],
      )}
    >
      {children}
    </CellContext>
  )
}

export const TablePlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext()
  const cellContext = use(CellContext)
  const editDepth = useEditDepth()
  const {
    fieldProps: { schemaPath },
    uuid,
  } = useEditorConfigContext()

  const drawerSlug = formatDrawerSlug({
    slug: 'lexical-table-create-' + uuid,
    depth: editDepth,
  })
  const { toggleDrawer } = useLexicalDrawer(drawerSlug, true)

  useEffect(() => {
    if (!editor.hasNodes([TableNode, TableRowNode, TableCellNode])) {
      throw new Error(
        'TablePlugin: TableNode, TableRowNode, or TableCellNode is not registered on editor',
      )
    }

    return mergeRegister(
      editor.registerCommand(
        OPEN_TABLE_DRAWER_COMMAND,
        () => {
          let rangeSelection: null | RangeSelection = null

          editor.getEditorState().read(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              rangeSelection = selection
            }
          })

          if (rangeSelection) {
            toggleDrawer()
          }
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [cellContext, editor, toggleDrawer])

  return (
    <React.Fragment>
      <FieldsDrawer
        drawerSlug={drawerSlug}
        drawerTitle="Create Table"
        featureKey="experimental_table"
        handleDrawerSubmit={(_fields, data) => {
          if (!data.columns || !data.rows) {
            return
          }

          editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns: String(data.columns),
            rows: String(data.rows),
          })
        }}
        schemaPath={schemaPath}
        schemaPathSuffix="fields"
      />
      <LexicalReactTablePlugin
        hasCellBackgroundColor={false}
        hasCellMerge
        hasHorizontalScroll={true}
      />
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: debounce.ts]---
Location: payload-main/packages/richtext-lexical/src/features/experimental_table/client/utils/debounce.ts

```typescript
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck - not worth it migrate jsdoc to tsdoc
'use client'
// Copied & modified from https://github.com/lodash/lodash/blob/main/src/debounce.ts
/*
The MIT License

Copyright JS Foundation and other contributors <https://js.foundation/>

Based on Underscore.js, copyright Jeremy Ashkenas,
DocumentCloud and Investigative Reporters & Editors <http://underscorejs.org/>

This software consists of voluntary contributions made by many
individuals. For exact contribution history, see the revision history
available at https://github.com/lodash/lodash

The following license applies to all parts of this software except as
documented below:

====

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

====

Copyright and related rights for sample code are waived via CC0. Sample
code is defined as all source code displayed within the prose of the
documentation.

CC0: http://creativecommons.org/publicdomain/zero/1.0/

====

Files located in the node_modules and vendor directories are externally
maintained libraries used by this software which have their own
licenses; we recommend you read them, as their terms may differ from the
terms above.
 */

/** Error message constants. */
const FUNC_ERROR_TEXT = 'Expected a function'

/* Built-in method references for those with the same name as other `lodash` methods. */
const nativeMax = Math.max,
  nativeMin = Math.min

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [sortOnOptions={}] The options object.
 * @param {boolean} [sortOnOptions.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [sortOnOptions.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [sortOnOptions.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  let lastArgs,
    lastCallTime,
    lastInvokeTime = 0,
    lastThis,
    leading = false,
    maxing = false,
    maxWait,
    result,
    timerID,
    trailing = true

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT)
  }
  wait = wait || 0
  if (typeof options === 'object') {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? nativeMax(options.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc(time) {
    const args = lastArgs,
      thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerID = setTimeout(timerExpired, wait)
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime,
      timeWaiting = wait - timeSinceLastCall

    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerID = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timerID = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timerID !== undefined) {
      clearTimeout(timerID)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerID = undefined
  }

  function flush() {
    return timerID === undefined ? result : trailingEdge(Date.now())
  }

  function debounced() {
    const time = Date.now(),
      isInvoking = shouldInvoke(time)

    // eslint-disable-next-line prefer-rest-params
    lastArgs = arguments
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerID === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerID)
        timerID = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerID === undefined) {
      timerID = setTimeout(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  return debounced
}

// eslint-disable-next-line no-restricted-exports
export default debounce
```

--------------------------------------------------------------------------------

---[FILE: useDebounce.ts]---
Location: payload-main/packages/richtext-lexical/src/features/experimental_table/client/utils/useDebounce.ts
Signals: React

```typescript
'use client'
import { useCallback, useEffect, useRef } from 'react'

import debounce from './debounce.js'

// Define the type for debounced function that includes cancel method
interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>
  cancel: () => void
}

export function useDebounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
  maxWait?: number,
) {
  // Update the ref type to include cancel method
  const debouncedRef = useRef<DebouncedFunction<T> | null>(null)

  useEffect(() => {
    debouncedRef.current = debounce(fn, ms, { maxWait }) as DebouncedFunction<T>

    return () => {
      debouncedRef.current?.cancel()
    }
  }, [fn, ms, maxWait])

  const callback = useCallback((...args: Parameters<T>) => {
    if (debouncedRef.current) {
      debouncedRef.current(...args)
    }
  }, [])

  return callback
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/experimental_table/server/index.ts

```typescript
import type {
  SerializedTableCellNode as _SerializedTableCellNode,
  SerializedTableNode as _SerializedTableNode,
  SerializedTableRowNode as _SerializedTableRowNode,
} from '@lexical/table'
import type { SerializedLexicalNode } from 'lexical'
import type { Config, Field, FieldSchemaMap } from 'payload'

import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { sanitizeFields } from 'payload'

import type { StronglyTypedElementNode } from '../../../nodeTypes.js'

import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { convertLexicalNodesToHTML } from '../../converters/lexicalToHtml_deprecated/converter/index.js'
import { createNode } from '../../typeUtilities.js'
import { TableMarkdownTransformer } from '../markdownTransformer.js'

const fields: Field[] = [
  {
    name: 'rows',
    type: 'number',
    defaultValue: 5,
    required: true,
  },
  {
    name: 'columns',
    type: 'number',
    defaultValue: 5,
    required: true,
  },
]

export type SerializedTableCellNode<T extends SerializedLexicalNode = SerializedLexicalNode> =
  StronglyTypedElementNode<_SerializedTableCellNode, 'tablecell', T>

export type SerializedTableNode<T extends SerializedLexicalNode = SerializedLexicalNode> =
  StronglyTypedElementNode<_SerializedTableNode, 'table', T>

export type SerializedTableRowNode<T extends SerializedLexicalNode = SerializedLexicalNode> =
  StronglyTypedElementNode<_SerializedTableRowNode, 'tablerow', T>
export const EXPERIMENTAL_TableFeature = createServerFeature({
  feature: async ({ config, isRoot, parentIsLocalized }) => {
    const validRelationships = config.collections.map((c) => c.slug) || []

    const sanitizedFields = await sanitizeFields({
      config: config as unknown as Config,
      fields,
      parentIsLocalized,
      requireFieldLevelRichTextEditor: isRoot,
      validRelationships,
    })
    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#TableFeatureClient',
      generateSchemaMap: () => {
        const schemaMap: FieldSchemaMap = new Map()

        schemaMap.set('fields', {
          fields: sanitizedFields,
        })

        return schemaMap
      },
      markdownTransformers: [TableMarkdownTransformer],
      nodes: [
        createNode({
          converters: {
            html: {
              converter: async ({
                converters,
                currentDepth,
                depth,
                draft,
                node,
                overrideAccess,
                parent,
                req,
                showHiddenFields,
              }) => {
                const childrenText = await convertLexicalNodesToHTML({
                  converters,
                  currentDepth,
                  depth,
                  draft,
                  lexicalNodes: node.children,
                  overrideAccess,
                  parent: {
                    ...node,
                    parent,
                  },
                  req,
                  showHiddenFields,
                })
                return `<div class="lexical-table-container"><table class="lexical-table" style="border-collapse: collapse;">${childrenText}</table></div>`
              },
              nodeTypes: [TableNode.getType()],
            },
          },
          node: TableNode,
        }),
        createNode({
          converters: {
            html: {
              converter: async ({
                converters,
                currentDepth,
                depth,
                draft,
                node,
                overrideAccess,
                parent,
                req,
                showHiddenFields,
              }) => {
                const childrenText = await convertLexicalNodesToHTML({
                  converters,
                  currentDepth,
                  depth,
                  draft,
                  lexicalNodes: node.children,
                  overrideAccess,
                  parent: {
                    ...node,
                    parent,
                  },
                  req,
                  showHiddenFields,
                })

                const tagName = node.headerState > 0 ? 'th' : 'td'
                const headerStateClass = `lexical-table-cell-header-${node.headerState}`
                const backgroundColor = node.backgroundColor
                  ? `background-color: ${node.backgroundColor};`
                  : ''
                const colSpan = node.colSpan && node.colSpan > 1 ? `colspan="${node.colSpan}"` : ''
                const rowSpan = node.rowSpan && node.rowSpan > 1 ? `rowspan="${node.rowSpan}"` : ''

                return `<${tagName} class="lexical-table-cell ${headerStateClass}" style="border: 1px solid #ccc; padding: 8px; ${backgroundColor}" ${colSpan} ${rowSpan}>${childrenText}</${tagName}>`
              },
              nodeTypes: [TableCellNode.getType()],
            },
          },
          node: TableCellNode,
        }),
        createNode({
          converters: {
            html: {
              converter: async ({
                converters,
                currentDepth,
                depth,
                draft,
                node,
                overrideAccess,
                parent,
                req,
                showHiddenFields,
              }) => {
                const childrenText = await convertLexicalNodesToHTML({
                  converters,
                  currentDepth,
                  depth,
                  draft,
                  lexicalNodes: node.children,
                  overrideAccess,
                  parent: {
                    ...node,
                    parent,
                  },
                  req,
                  showHiddenFields,
                })
                return `<tr class="lexical-table-row">${childrenText}</tr>`
              },
              nodeTypes: [TableRowNode.getType()],
            },
          },
          node: TableRowNode,
        }),
      ],
    }
  },
  key: 'experimental_table',
})
```

--------------------------------------------------------------------------------

---[FILE: feature.client.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/format/bold/feature.client.tsx

```typescript
'use client'
import { $isTableSelection } from '@lexical/table'
import { $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'

import type { ToolbarGroup } from '../../toolbars/types.js'

import { BoldIcon } from '../../../lexical/ui/icons/Bold/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { toolbarFormatGroupWithItems } from '../shared/toolbarFormatGroup.js'
import {
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
} from './markdownTransformers.js'

const toolbarGroups: ToolbarGroup[] = [
  toolbarFormatGroupWithItems([
    {
      ChildComponent: BoldIcon,
      isActive: ({ selection }) => {
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
          return selection.hasFormat('bold')
        }
        return false
      },
      key: 'bold',
      onSelect: ({ editor }) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
      },
      order: 1,
    },
  ]),
]

export const BoldFeatureClient = createClientFeature(({ featureProviderMap }) => {
  const markdownTransformers = [BOLD_STAR, BOLD_UNDERSCORE]
  if (featureProviderMap.get('italic')) {
    markdownTransformers.push(BOLD_ITALIC_UNDERSCORE, BOLD_ITALIC_STAR)
  }

  return {
    enableFormats: ['bold'],
    markdownTransformers,
    toolbarFixed: {
      groups: toolbarGroups,
    },
    toolbarInline: {
      groups: toolbarGroups,
    },
  }
})
```

--------------------------------------------------------------------------------

---[FILE: feature.server.ts]---
Location: payload-main/packages/richtext-lexical/src/features/format/bold/feature.server.ts

```typescript
import { createServerFeature } from '../../../utilities/createServerFeature.js'
import {
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
} from './markdownTransformers.js'

export const BoldFeature = createServerFeature({
  dependenciesSoft: ['italic'],
  feature: ({ featureProviderMap }) => {
    const markdownTransformers = [BOLD_STAR, BOLD_UNDERSCORE]
    if (featureProviderMap.get('italic')) {
      markdownTransformers.push(BOLD_ITALIC_UNDERSCORE, BOLD_ITALIC_STAR)
    }

    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#BoldFeatureClient',
      markdownTransformers,
    }
  },
  key: 'bold',
})
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformers.ts]---
Location: payload-main/packages/richtext-lexical/src/features/format/bold/markdownTransformers.ts

```typescript
import type { TextFormatTransformer } from '../../../packages/@lexical/markdown/MarkdownTransformers.js'

export const BOLD_ITALIC_STAR: TextFormatTransformer = {
  type: 'text-format',
  format: ['bold', 'italic'],
  tag: '***',
}

export const BOLD_ITALIC_UNDERSCORE: TextFormatTransformer = {
  type: 'text-format',
  format: ['bold', 'italic'],
  intraword: false,
  tag: '___',
}

export const BOLD_STAR: TextFormatTransformer = {
  type: 'text-format',
  format: ['bold'],
  tag: '**',
}

export const BOLD_UNDERSCORE: TextFormatTransformer = {
  type: 'text-format',
  format: ['bold'],
  intraword: false,
  tag: '__',
}
```

--------------------------------------------------------------------------------

---[FILE: feature.client.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/format/inlineCode/feature.client.tsx

```typescript
'use client'

import { $isTableSelection } from '@lexical/table'
import { $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'

import type { ToolbarGroup } from '../../toolbars/types.js'

import { CodeIcon } from '../../../lexical/ui/icons/Code/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { toolbarFormatGroupWithItems } from '../shared/toolbarFormatGroup.js'
import { INLINE_CODE } from './markdownTransformers.js'

const toolbarGroups: ToolbarGroup[] = [
  toolbarFormatGroupWithItems([
    {
      ChildComponent: CodeIcon,
      isActive: ({ selection }) => {
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
          return selection.hasFormat('code')
        }
        return false
      },
      key: 'inlineCode',
      onSelect: ({ editor }) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
      },
      order: 7,
    },
  ]),
]

export const InlineCodeFeatureClient = createClientFeature({
  enableFormats: ['code'],
  markdownTransformers: [INLINE_CODE],
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
```

--------------------------------------------------------------------------------

````
