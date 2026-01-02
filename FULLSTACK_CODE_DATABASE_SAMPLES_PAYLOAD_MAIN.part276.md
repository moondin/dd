---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 276
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 276 of 695)

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
Location: payload-main/packages/richtext-lexical/src/features/debug/testRecorder/client/plugin/index.tsx
Signals: React

```typescript
'use client'
import type { BaseSelection, LexicalEditor } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { $createParagraphNode, $createTextNode, $getRoot, getDOMSelection } from 'lexical'
import * as React from 'react'
import { type JSX, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import type { PluginComponent } from '../../../../typesClient.js'

import { IS_APPLE } from '../../../../../lexical/utils/environment.js'
import './index.scss'

const copy = (text: null | string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text || ''
  textArea.style.position = 'absolute'
  textArea.style.opacity = '0'
  document.body?.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    const result = document.execCommand('copy')
    // eslint-disable-next-line no-console
    console.log(result)
  } catch (error) {
    console.error(error)
  }
  document.body?.removeChild(textArea)
}

const download = (filename: string, text: null | string) => {
  const a = document.createElement('a')
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text || ''))
  a.setAttribute('download', filename)
  a.style.display = 'none'
  document.body?.appendChild(a)
  a.click()
  document.body?.removeChild(a)
}

const formatStep = (step: Step) => {
  const formatOneStep = (name: string, value: Step['value']) => {
    switch (name) {
      case 'click': {
        return `      await page.mouse.click(${value.x}, ${value.y});`
      }
      case 'keydown': {
        return `      await page.keyboard.keydown('${value}');`
      }
      case 'keyup': {
        return `      await page.keyboard.keyup('${value}');`
      }
      case 'press': {
        return `      await page.keyboard.press('${value}');`
      }
      case 'selectAll': {
        return `      await selectAll(page);`
      }
      case 'snapshot': {
        return `      await assertHTMLSnapshot(page);
      await assertSelection(page, {
        anchorPath: [${value.anchorPath.toString()}],
        anchorOffset: ${value.anchorOffset},
        focusPath: [${value.focusPath.toString()}],
        focusOffset: ${value.focusOffset},
      });
`
      }
      case 'type': {
        return `      await page.keyboard.type('${value}');`
      }
      default:
        return ``
    }
  }
  const formattedStep = formatOneStep(step.name, step.value)
  switch (step.count) {
    case 1:
      return formattedStep
    case 2:
      return [formattedStep, formattedStep].join(`\n`)
    default:
      return `      await repeat(${step.count}, async () => {
  ${formattedStep}
      );`
  }
}

export function isSelectAll(event: KeyboardEvent): boolean {
  return event.key.toLowerCase() === 'a' && (IS_APPLE ? event.metaKey : event.ctrlKey)
}

// stolen from LexicalSelection-test
function sanitizeSelection(selection: Selection) {
  const { anchorNode, focusNode } = selection
  let { anchorOffset, focusOffset } = selection
  if (anchorOffset !== 0) {
    anchorOffset--
  }
  if (focusOffset !== 0) {
    focusOffset--
  }
  return { anchorNode, anchorOffset, focusNode, focusOffset }
}

function getPathFromNodeToEditor(node: Node, rootElement: HTMLElement | null) {
  let currentNode: Node | null | undefined = node
  const path: number[] = []
  while (currentNode !== rootElement) {
    if (currentNode !== null && currentNode !== undefined) {
      path.unshift(
        Array.from(currentNode?.parentNode?.childNodes ?? []).indexOf(currentNode as ChildNode),
      )
    }
    currentNode = currentNode?.parentNode
  }
  return path
}

const keyPresses = new Set([
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'Backspace',
  'Delete',
  'Enter',
  'Escape',
])

type Step = {
  count: number
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}

type Steps = Step[]

function useTestRecorder(editor: LexicalEditor): [JSX.Element, JSX.Element | null] {
  const [steps, setSteps] = useState<Steps>([])
  const [isRecording, setIsRecording] = useState(false)
  const [, setCurrentInnerHTML] = useState('')
  const [templatedTest, setTemplatedTest] = useState('')
  const previousSelectionRef = useRef<BaseSelection | null>(null)
  const skipNextSelectionChangeRef = useRef(false)
  const preRef = useRef<HTMLPreElement>(null)

  const getCurrentEditor = useCallback(() => {
    return editor
  }, [editor])

  const generateTestContent = useCallback(() => {
    const rootElement = editor.getRootElement()
    const browserSelection = getDOMSelection(editor._window)

    if (
      rootElement == null ||
      browserSelection == null ||
      browserSelection.anchorNode == null ||
      browserSelection.focusNode == null ||
      !rootElement.contains(browserSelection.anchorNode) ||
      !rootElement.contains(browserSelection.focusNode)
    ) {
      return null
    }

    return `
import {
  initializeE2E,
  assertHTMLSnapshot,
  assertSelection,
  repeat,
} from '../utils';
import {selectAll} from '../keyboardShortcuts';
import { RangeSelection } from 'lexical';
import { NodeSelection } from 'lexical';

describe('Test case', () => {
  initializeE2E((e2e) => {
    it('Should pass this test', async () => {
      const {page} = e2e;

      await page.focus('div[contenteditable="true"]');
${steps.map(formatStep).join(`\n`)}
    });
});
    `
  }, [editor, steps])

  // just a wrapper around inserting new actions so that we can
  // coalesce some actions like insertText/moveNativeSelection
  const pushStep = useCallback(
    (name: string, value: Step['value']) => {
      setSteps((currentSteps) => {
        // trying to group steps
        const currentIndex = steps.length - 1
        const lastStep = steps[currentIndex]
        if (lastStep) {
          if (lastStep.name === name) {
            if (name === 'type') {
              // for typing events we just append the text
              return [
                ...steps.slice(0, currentIndex),
                { ...lastStep, value: lastStep.value + value },
              ]
            } else {
              // for other events we bump the counter if their values are the same
              if (lastStep.value === value) {
                return [...steps.slice(0, currentIndex), { ...lastStep, count: lastStep.count + 1 }]
              }
            }
          }
        }
        // could not group, just append a new one
        return [...currentSteps, { name, count: 1, value }]
      })
    },
    [steps, setSteps],
  )

  useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isRecording) {
        return
      }
      const key = event.key
      if (isSelectAll(event)) {
        pushStep('selectAll', '')
      } else if (keyPresses.has(key)) {
        pushStep('press', event.key)
      } else if ([...key].length > 1) {
        pushStep('keydown', event.key)
      } else {
        pushStep('type', event.key)
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (!isRecording) {
        return
      }
      const key = event.key
      if (!keyPresses.has(key) && [...key].length > 1) {
        pushStep('keyup', event.key)
      }
    }

    return editor.registerRootListener(
      (rootElement: HTMLElement | null, prevRootElement: HTMLElement | null) => {
        if (prevRootElement !== null) {
          prevRootElement.removeEventListener('keydown', onKeyDown)
          prevRootElement.removeEventListener('keyup', onKeyUp)
        }
        if (rootElement !== null) {
          rootElement.addEventListener('keydown', onKeyDown)
          rootElement.addEventListener('keyup', onKeyUp)
        }
      },
    )
  }, [editor, isRecording, pushStep])

  useLayoutEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTo(0, preRef.current.scrollHeight)
    }
  }, [generateTestContent])

  useEffect(() => {
    if (steps) {
      const testContent = generateTestContent()
      if (testContent !== null) {
        setTemplatedTest(testContent)
      }
      if (preRef.current) {
        preRef.current.scrollTo(0, preRef.current.scrollHeight)
      }
    }
  }, [generateTestContent, steps])

  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(
      ({ dirtyElements, dirtyLeaves, editorState }) => {
        if (!isRecording) {
          return
        }
        const currentSelection = editorState._selection
        const previousSelection = previousSelectionRef.current
        const skipNextSelectionChange = skipNextSelectionChangeRef.current
        if (previousSelection !== currentSelection) {
          if (dirtyLeaves.size === 0 && dirtyElements.size === 0 && !skipNextSelectionChange) {
            const browserSelection = getDOMSelection(editor._window)
            if (
              browserSelection &&
              (browserSelection.anchorNode == null || browserSelection.focusNode == null)
            ) {
              return
            }
          }
          previousSelectionRef.current = currentSelection
        }
        skipNextSelectionChangeRef.current = false
        const testContent = generateTestContent()
        if (testContent !== null) {
          setTemplatedTest(testContent)
        }
      },
    )
    return removeUpdateListener
  }, [editor, generateTestContent, isRecording, pushStep])

  // save innerHTML
  useEffect(() => {
    if (!isRecording) {
      return
    }
    const removeUpdateListener = editor.registerUpdateListener(() => {
      const rootElement = editor.getRootElement()
      if (rootElement !== null) {
        setCurrentInnerHTML(rootElement?.innerHTML)
      }
    })
    return removeUpdateListener
  }, [editor, isRecording])

  // clear editor and start recording
  const toggleEditorSelection = useCallback(
    (currentEditor: LexicalEditor) => {
      if (!isRecording) {
        currentEditor.update(() => {
          const root = $getRoot()
          root.clear()
          const text = $createTextNode()
          root.append($createParagraphNode().append(text))
          text.select()
        })
        setSteps([])
      }
      setIsRecording((currentIsRecording) => !currentIsRecording)
    },
    [isRecording],
  )

  const onSnapshotClick = useCallback(() => {
    if (!isRecording) {
      return
    }
    const browserSelection = getDOMSelection(editor._window)
    if (
      browserSelection === null ||
      browserSelection.anchorNode == null ||
      browserSelection.focusNode == null
    ) {
      return
    }
    const { anchorNode, anchorOffset, focusNode, focusOffset } = sanitizeSelection(browserSelection)
    const rootElement = getCurrentEditor().getRootElement()
    let anchorPath
    if (anchorNode !== null) {
      anchorPath = getPathFromNodeToEditor(anchorNode, rootElement)
    }
    let focusPath
    if (focusNode !== null) {
      focusPath = getPathFromNodeToEditor(focusNode, rootElement)
    }
    pushStep('snapshot', {
      anchorNode,
      anchorOffset,
      anchorPath,
      focusNode,
      focusOffset,
      focusPath,
    })
  }, [pushStep, isRecording, getCurrentEditor])

  const onCopyClick = useCallback(() => {
    copy(generateTestContent())
  }, [generateTestContent])

  const onDownloadClick = useCallback(() => {
    download('test.js', generateTestContent())
  }, [generateTestContent])

  const button = (
    <button
      className={`editor-dev-button ${isRecording ? 'active' : ''}`}
      id="test-recorder-button"
      onClick={(e) => {
        toggleEditorSelection(getCurrentEditor())
        e.preventDefault()
      }}
      title={isRecording ? 'Disable test recorder' : 'Enable test recorder'}
      type="button"
    >
      {isRecording ? 'Disable test recorder' : 'Enable test recorder'}
    </button>
  )
  const output = isRecording ? (
    <div className="test-recorder-output">
      <div className="test-recorder-toolbar">
        <button
          className="test-recorder-button"
          id="test-recorder-button-snapshot"
          onClick={(e) => {
            onSnapshotClick()
            e.preventDefault()
          }}
          title="Insert snapshot"
          type="button"
        >
          Insert Snapshot
        </button>
        <button
          className="test-recorder-button"
          id="test-recorder-button-copy"
          onClick={(e) => {
            onCopyClick()
            e.preventDefault()
          }}
          title="Copy to clipboard"
          type="button"
        >
          Copy
        </button>
        <button
          className="test-recorder-button"
          id="test-recorder-button-download"
          onClick={(e) => {
            onDownloadClick()
            e.preventDefault()
          }}
          title="Download as a file"
          type="button"
        >
          Download
        </button>
      </div>
      <pre id="test-recorder" ref={preRef}>
        {templatedTest}
      </pre>
    </div>
  ) : null

  return [button, output]
}
export const TestRecorderPlugin: PluginComponent<undefined> = () => {
  const [editor] = useLexicalComposerContext()
  const [testRecorderButton, testRecorderOutput] = useTestRecorder(editor)

  return (
    <React.Fragment>
      <p>HI</p>
      {testRecorderButton}
      {testRecorderOutput}
      <p>DONE</p>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/debug/testRecorder/server/index.ts

```typescript
import { createServerFeature } from '../../../../utilities/createServerFeature.js'

export const TestRecorderFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#TestRecorderFeatureClient',
  },
  key: 'testRecorder',
})
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/debug/treeView/client/index.tsx

```typescript
'use client'

import { createClientFeature } from '../../../../utilities/createClientFeature.js'
import { TreeViewPlugin } from './plugin/index.js'

export const TreeViewFeatureClient = createClientFeature({
  plugins: [
    {
      Component: TreeViewPlugin,
      position: 'bottom',
    },
  ],
})
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/debug/treeView/client/plugin/index.scss

```text
@layer payload-default {
  .tree-view-output {
    display: block;
    background: #222;
    color: #fff;
    padding: 0;
    font-size: 12px;
    margin: 1px auto 10px auto;
    position: relative;
    overflow: hidden;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    pre {
      line-height: 1.1;
      background: #222;
      color: #fff;
      margin: 0;
      padding: 10px;
      font-size: 12px;
      overflow: auto;
      max-height: 400px;
    }

    .debug-treetype-button {
      border: 0;
      padding: 0;
      font-size: 12px;
      top: 10px;
      right: 85px;
      position: absolute;
      background: none;
      color: #fff;

      &:hover {
        text-decoration: underline;
      }
    }

    .debug-timetravel-button {
      border: 0;
      padding: 0;
      font-size: 12px;
      top: 10px;
      right: 15px;
      position: absolute;
      background: none;
      color: #fff;

      &:hover {
        text-decoration: underline;
      }
    }

    .debug-timetravel-panel {
      overflow: hidden;
      padding: 0 0 10px;
      margin: auto;
      display: flex;

      &-button {
        padding: 0;
        border: 0;
        background: none;
        flex: 1;
        color: #fff;
        font-size: 12px;

        &:hover {
          text-decoration: underline;
        }
      }

      &-slider {
        padding: 0;
        flex: 8;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/debug/treeView/client/plugin/index.tsx
Signals: React

```typescript
'use client'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { TreeView } from '@lexical/react/LexicalTreeView.js'
import * as React from 'react'

import type { PluginComponent } from '../../../../typesClient.js'

import './index.scss'

export const TreeViewPlugin: PluginComponent<undefined> = () => {
  const [editor] = useLexicalComposerContext()
  return (
    <TreeView
      editor={editor}
      timeTravelButtonClassName="debug-timetravel-button"
      timeTravelPanelButtonClassName="debug-timetravel-panel-button"
      timeTravelPanelClassName="debug-timetravel-panel"
      timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
      treeTypeButtonClassName="debug-treetype-button"
      viewClassName="tree-view-output"
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/debug/treeView/server/index.ts

```typescript
import { createServerFeature } from '../../../../utilities/createServerFeature.js'

export const TreeViewFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#TreeViewFeatureClient',
  },
  key: 'treeView',
})
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformer.ts]---
Location: payload-main/packages/richtext-lexical/src/features/experimental_table/markdownTransformer.ts

```typescript
import type { LexicalNode } from 'lexical'

import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  TableCellHeaderStates,
  TableCellNode,
  TableNode,
  TableRowNode,
} from '@lexical/table'
import { $isParagraphNode, $isTextNode } from 'lexical'

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  type ElementTransformer,
  type Transformer,
} from '../../packages/@lexical/markdown/index.js'

// Very primitive table setup
const TABLE_ROW_REG_EXP = /^\|(.+)\|\s?$/
// eslint-disable-next-line regexp/no-unused-capturing-group
const TABLE_ROW_DIVIDER_REG_EXP = /^(\| ?:?-*:? ?)+\|\s?$/

export const TableMarkdownTransformer: (props: {
  allTransformers: Transformer[]
}) => ElementTransformer = ({ allTransformers }) => ({
  type: 'element',
  dependencies: [TableNode, TableRowNode, TableCellNode],
  export: (node: LexicalNode) => {
    if (!$isTableNode(node)) {
      return null
    }

    const output: string[] = []

    for (const row of node.getChildren()) {
      const rowOutput: string[] = []
      if (!$isTableRowNode(row)) {
        continue
      }

      let isHeaderRow = false
      for (const cell of row.getChildren()) {
        // It's TableCellNode, so it's just to make flow happy
        if ($isTableCellNode(cell)) {
          rowOutput.push(
            $convertToMarkdownString(allTransformers, cell).replace(/\n/g, '\\n').trim(),
          )

          if (cell.__headerState === TableCellHeaderStates.ROW) {
            isHeaderRow = true
          }
        }
      }

      output.push(`| ${rowOutput.join(' | ')} |`)
      if (isHeaderRow) {
        output.push(`| ${rowOutput.map((_) => '---').join(' | ')} |`)
      }
    }

    return output.join('\n')
  },
  regExp: TABLE_ROW_REG_EXP,
  replace: (parentNode, _1, match) => {
    const match0 = match[0]
    if (!match0) {
      return
    }
    // Header row
    if (TABLE_ROW_DIVIDER_REG_EXP.test(match0)) {
      const table = parentNode.getPreviousSibling()
      if (!table || !$isTableNode(table)) {
        return
      }

      const rows = table.getChildren()
      const lastRow = rows[rows.length - 1]
      if (!lastRow || !$isTableRowNode(lastRow)) {
        return
      }

      // Add header state to row cells
      lastRow.getChildren().forEach((cell) => {
        if (!$isTableCellNode(cell)) {
          return
        }
        cell.setHeaderStyles(TableCellHeaderStates.ROW, TableCellHeaderStates.ROW)
      })

      // Remove line
      parentNode.remove()
      return
    }

    const matchCells = mapToTableCells(match0, allTransformers)

    if (matchCells == null) {
      return
    }

    const rows = [matchCells]
    let sibling = parentNode.getPreviousSibling()
    let maxCells = matchCells.length

    while (sibling) {
      if (!$isParagraphNode(sibling)) {
        break
      }

      if (sibling.getChildrenSize() !== 1) {
        break
      }

      const firstChild = sibling.getFirstChild()

      if (!$isTextNode(firstChild)) {
        break
      }

      const cells = mapToTableCells(firstChild.getTextContent(), allTransformers)

      if (cells == null) {
        break
      }

      maxCells = Math.max(maxCells, cells.length)
      rows.unshift(cells)
      const previousSibling = sibling.getPreviousSibling()
      sibling.remove()
      sibling = previousSibling
    }

    const table = $createTableNode()

    for (const cells of rows) {
      const tableRow = $createTableRowNode()
      table.append(tableRow)

      for (let i = 0; i < maxCells; i++) {
        tableRow.append(i < cells.length ? cells[i]! : $createTableCell('', allTransformers))
      }
    }

    const previousSibling = parentNode.getPreviousSibling()
    if ($isTableNode(previousSibling) && getTableColumnsSize(previousSibling) === maxCells) {
      previousSibling.append(...table.getChildren())
      parentNode.remove()
    } else {
      parentNode.replace(table)
    }

    table.selectEnd()
  },
})

function getTableColumnsSize(table: TableNode) {
  const row = table.getFirstChild()
  return $isTableRowNode(row) ? row.getChildrenSize() : 0
}

const $createTableCell = (textContent: string, allTransformers: Transformer[]): TableCellNode => {
  textContent = textContent.replace(/\\n/g, '\n')
  const cell = $createTableCellNode(TableCellHeaderStates.NO_STATUS)
  $convertFromMarkdownString(textContent, allTransformers, cell)
  return cell
}

const mapToTableCells = (
  textContent: string,
  allTransformers: Transformer[],
): Array<TableCellNode> | null => {
  const match = textContent.match(TABLE_ROW_REG_EXP)
  if (!match || !match[1]) {
    return null
  }
  return match[1].split('|').map((text) => $createTableCell(text, allTransformers))
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/experimental_table/client/index.ts

```typescript
'use client'

import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'

import { TableIcon } from '../../../lexical/ui/icons/Table/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { slashMenuBasicGroupWithItems } from '../../shared/slashMenu/basicGroup.js'
import { toolbarAddDropdownGroupWithItems } from '../../shared/toolbar/addDropdownGroup.js'
import { TableMarkdownTransformer } from '../markdownTransformer.js'
import { TableActionMenuPlugin } from './plugins/TableActionMenuPlugin/index.js'
import { TableCellResizerPlugin } from './plugins/TableCellResizerPlugin/index.js'
import { TableHoverActionsPlugin } from './plugins/TableHoverActionsPlugin/index.js'
import {
  OPEN_TABLE_DRAWER_COMMAND,
  TableContext,
  TablePlugin,
} from './plugins/TablePlugin/index.js'

export const TableFeatureClient = createClientFeature({
  markdownTransformers: [TableMarkdownTransformer],
  nodes: [TableNode, TableCellNode, TableRowNode],
  plugins: [
    {
      Component: TablePlugin,
      position: 'normal',
    },
    {
      Component: TableCellResizerPlugin,
      position: 'normal',
    },
    {
      Component: TableActionMenuPlugin,
      position: 'floatingAnchorElem',
    },
    {
      Component: TableHoverActionsPlugin,
      position: 'floatingAnchorElem',
    },
  ],
  providers: [TableContext],
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: TableIcon,
          key: 'table',
          keywords: ['table'],
          label: 'Table',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(OPEN_TABLE_DRAWER_COMMAND, {})
          },
        },
      ]),
    ],
  },
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems([
        {
          ChildComponent: TableIcon,
          key: 'table',
          label: 'Table',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(OPEN_TABLE_DRAWER_COMMAND, {})
          },
        },
      ]),
    ],
  },
})
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/experimental_table/client/plugins/TableActionMenuPlugin/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .table-cell-action-button-container {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    will-change: transform;
  }

  .table-cell-action-button-container.table-cell-action-button-container--active {
    pointer-events: auto;
    opacity: 1;
  }
  .table-cell-action-button-container.table-cell-action-button-container--inactive {
    pointer-events: none;
    opacity: 0;
  }

  .table-cell-action-button {
    //background-color: var(--theme-elevation-200);
    border: 0;
    padding: 2px;
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: $style-radius-m;
    color: var(--theme-elevation-800);
    display: inline-block;
    cursor: pointer;

    &:hover {
      background-color: var(--theme-elevation-300);
    }
  }

  html[data-theme='light'] {
    .table-action-menu-dropdown {
      box-shadow:
        0px 1px 2px 1px rgba(0, 0, 0, 0.05),
        0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    }
  }

  .table-action-menu-dropdown {
    z-index: 100;
    display: block;
    position: fixed;
    background: var(--theme-input-bg);
    min-width: 160px;
    border-radius: $style-radius-m;
    min-height: 40px;
    overflow-y: auto;
    box-shadow:
      0px 1px 2px 1px rgba(0, 0, 0, 0.1),
      0px 4px 16px 0px rgba(0, 0, 0, 0.2),
      0px -4px 8px 0px rgba(0, 0, 0, 0.1);

    hr {
      border: none;
      height: 1px;
      background-color: var(--theme-elevation-200);
    }

    .item {
      padding: 8px;
      color: var(--theme-elevation-900);
      background: var(--theme-input-bg);
      cursor: pointer;
      font-size: 13px;
      font-family: var(--font-body);
      display: flex;
      align-content: center;
      flex-direction: row;
      flex-shrink: 0;
      justify-content: space-between;
      border: 0;
      height: 30px;
      width: 100%;

      &:hover {
        background: var(--theme-elevation-100);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
