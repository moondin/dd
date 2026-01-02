---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 298
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 298 of 695)

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

---[FILE: MarkdownImport.ts]---
Location: payload-main/packages/richtext-lexical/src/packages/@lexical/markdown/MarkdownImport.ts

```typescript
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ListItemNode } from '@lexical/list'
import type { ElementNode } from 'lexical'

import { $isListItemNode, $isListNode } from '@lexical/list'
import { $isQuoteNode } from '@lexical/rich-text'
import { $findMatchingParent } from '@lexical/utils'
import {
  $createLineBreakNode,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isParagraphNode,
} from 'lexical'

import type {
  ElementTransformer,
  MultilineElementTransformer,
  TextFormatTransformer,
  TextMatchTransformer,
  Transformer,
} from './MarkdownTransformers.js'

import { importTextTransformers } from './importTextTransformers.js'
import { isEmptyParagraph, transformersByType } from './utils.js'

export type TextFormatTransformersIndex = Readonly<{
  fullMatchRegExpByTag: Readonly<Record<string, RegExp>>
  openTagsRegExp: RegExp
  transformersByTag: Readonly<Record<string, TextFormatTransformer>>
}>

/**
 * Renders markdown from a string. The selection is moved to the start after the operation.
 */
export function createMarkdownImport(
  transformers: Array<Transformer>,
  shouldPreserveNewLines = false,
): (markdownString: string, node?: ElementNode) => void {
  const byType = transformersByType(transformers)
  const textFormatTransformersIndex = createTextFormatTransformersIndex(byType.textFormat)

  return (markdownString, node) => {
    const lines = markdownString.split('\n')
    const linesLength = lines.length
    const root = node || $getRoot()
    root.clear()

    for (let i = 0; i < linesLength; i++) {
      const lineText = lines[i]!

      const [imported, shiftedIndex] = $importMultiline(lines, i, byType.multilineElement, root)

      if (imported) {
        // If a multiline markdown element was imported, we don't want to process the lines that were part of it anymore.
        // There could be other sub-markdown elements (both multiline and normal ones) matching within this matched multiline element's children.
        // However, it would be the responsibility of the matched multiline transformer to decide how it wants to handle them.
        // We cannot handle those, as there is no way for us to know how to maintain the correct order of generated lexical nodes for possible children.
        i = shiftedIndex // Next loop will start from the line after the last line of the multiline element
        continue
      }

      $importBlocks(lineText, root, byType.element, textFormatTransformersIndex, byType.textMatch)
    }

    // By default, removing empty paragraphs as md does not really
    // allow empty lines and uses them as delimiter.
    // If you need empty lines set shouldPreserveNewLines = true.
    const children = root.getChildren()
    for (const child of children) {
      if (!shouldPreserveNewLines && isEmptyParagraph(child) && root.getChildrenSize() > 1) {
        child.remove()
      }
    }

    if ($getSelection() !== null) {
      root.selectStart()
    }
  }
}

/**
 *
 * @returns first element of the returned tuple is a boolean indicating if a multiline element was imported. The second element is the index of the last line that was processed.
 */
function $importMultiline(
  lines: Array<string>,
  startLineIndex: number,
  multilineElementTransformers: Array<MultilineElementTransformer>,
  rootNode: ElementNode,
): [boolean, number] {
  for (const transformer of multilineElementTransformers) {
    const { handleImportAfterStartMatch, regExpEnd, regExpStart, replace } = transformer

    const startMatch = lines[startLineIndex]?.match(regExpStart)
    if (!startMatch) {
      continue // Try next transformer
    }

    if (handleImportAfterStartMatch) {
      const result = handleImportAfterStartMatch({
        lines,
        rootNode,
        startLineIndex,
        startMatch,
        transformer,
      })
      if (result === null) {
        continue
      } else if (result) {
        return result
      }
    }

    const regexpEndRegex: RegExp | undefined =
      typeof regExpEnd === 'object' && 'regExp' in regExpEnd ? regExpEnd.regExp : regExpEnd

    const isEndOptional =
      regExpEnd && typeof regExpEnd === 'object' && 'optional' in regExpEnd
        ? regExpEnd.optional
        : !regExpEnd

    let endLineIndex = startLineIndex
    const linesLength = lines.length

    // check every single line for the closing match. It could also be on the same line as the opening match.
    while (endLineIndex < linesLength) {
      const endMatch = regexpEndRegex ? lines[endLineIndex]?.match(regexpEndRegex) : null
      if (!endMatch) {
        if (
          !isEndOptional ||
          (isEndOptional && endLineIndex < linesLength - 1) // Optional end, but didn't reach the end of the document yet => continue searching for potential closing match
        ) {
          endLineIndex++
          continue // Search next line for closing match
        }
      }

      // Now, check if the closing match matched is the same as the opening match.
      // If it is, we need to continue searching for the actual closing match.
      if (endMatch && startLineIndex === endLineIndex && endMatch.index === startMatch.index) {
        endLineIndex++
        continue // Search next line for closing match
      }

      // At this point, we have found the closing match. Next: calculate the lines in between open and closing match
      // This should not include the matches themselves, and be split up by lines
      const linesInBetween: string[] = []

      if (endMatch && startLineIndex === endLineIndex) {
        linesInBetween.push(lines[startLineIndex]!.slice(startMatch[0].length, -endMatch[0].length))
      } else {
        for (let i = startLineIndex; i <= endLineIndex; i++) {
          const line = lines[i]!
          if (i === startLineIndex) {
            const text = line.slice(startMatch[0].length)
            linesInBetween.push(text) // Also include empty text
          } else if (i === endLineIndex && endMatch) {
            const text = line.slice(0, -endMatch[0].length)
            linesInBetween.push(text) // Also include empty text
          } else {
            linesInBetween.push(line)
          }
        }
      }

      if (replace(rootNode, null, startMatch, endMatch!, linesInBetween, true) !== false) {
        // Return here. This $importMultiline function is run line by line and should only process a single multiline element at a time.
        return [true, endLineIndex]
      }

      // The replace function returned false, despite finding the matching open and close tags => this transformer does not want to handle it.
      // Thus, we continue letting the remaining transformers handle the passed lines of text from the beginning
      break
    }
  }

  // No multiline transformer handled this line successfully
  return [false, startLineIndex]
}

function $importBlocks(
  lineText: string,
  rootNode: ElementNode,
  elementTransformers: Array<ElementTransformer>,
  textFormatTransformersIndex: TextFormatTransformersIndex,
  textMatchTransformers: Array<TextMatchTransformer>,
) {
  const textNode = $createTextNode(lineText)
  const elementNode = $createParagraphNode()
  elementNode.append(textNode)
  rootNode.append(elementNode)

  for (const { regExp, replace } of elementTransformers) {
    const match = lineText.match(regExp)

    if (match) {
      textNode.setTextContent(lineText.slice(match[0].length))
      if (replace(elementNode, [textNode], match, true) !== false) {
        break
      }
    }
  }

  importTextTransformers(textNode, textFormatTransformersIndex, textMatchTransformers)

  // If no transformer found and we left with original paragraph node
  // can check if its content can be appended to the previous node
  // if it's a paragraph, quote or list
  if (elementNode.isAttached() && lineText.length > 0) {
    const previousNode = elementNode.getPreviousSibling()
    if ($isParagraphNode(previousNode) || $isQuoteNode(previousNode) || $isListNode(previousNode)) {
      let targetNode: ListItemNode | null | typeof previousNode = previousNode

      if ($isListNode(previousNode)) {
        const lastDescendant = previousNode.getLastDescendant()
        if (lastDescendant == null) {
          targetNode = null
        } else {
          targetNode = $findMatchingParent(lastDescendant, $isListItemNode)
        }
      }

      if (targetNode != null && targetNode.getTextContentSize() > 0) {
        targetNode.splice(targetNode.getChildrenSize(), 0, [
          $createLineBreakNode(),
          ...elementNode.getChildren(),
        ])
        elementNode.remove()
      }
    }
  }
}

function createTextFormatTransformersIndex(
  textTransformers: Array<TextFormatTransformer>,
): TextFormatTransformersIndex {
  const transformersByTag: Record<string, TextFormatTransformer> = {}
  const fullMatchRegExpByTag: Record<string, RegExp> = {}
  const openTagsRegExp: string[] = []
  const escapeRegExp = `(?<![\\\\])`

  for (const transformer of textTransformers) {
    const { tag } = transformer
    transformersByTag[tag] = transformer
    const tagRegExp = tag.replace(/([*^+])/g, '\\$1')
    openTagsRegExp.push(tagRegExp)

    // Single-char tag (e.g. "*"),
    if (tag.length === 1) {
      fullMatchRegExpByTag[tag] = new RegExp(
        `(?<![\\\\${tagRegExp}])(${tagRegExp})((\\\\${tagRegExp})?.*?[^${tagRegExp}\\s](\\\\${tagRegExp})?)((?<!\\\\)|(?<=\\\\\\\\))(${tagRegExp})(?![\\\\${tagRegExp}])`,
      )
    } else {
      // Multi‐char tags (e.g. "**")
      fullMatchRegExpByTag[tag] = new RegExp(
        `(?<!\\\\)(${tagRegExp})((\\\\${tagRegExp})?.*?[^\\s](\\\\${tagRegExp})?)((?<!\\\\)|(?<=\\\\\\\\))(${tagRegExp})(?!\\\\)`,
      )
    }
  }

  return {
    // Reg exp to find open tag + content + close tag
    fullMatchRegExpByTag,

    // Regexp to locate *any* potential opening tag (longest first).
    // eslint-disable-next-line regexp/no-useless-character-class, regexp/no-empty-capturing-group, regexp/no-empty-group
    openTagsRegExp: new RegExp(`${escapeRegExp}(${openTagsRegExp.join('|')})`, 'g'),
    transformersByTag,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MarkdownShortcuts.ts]---
Location: payload-main/packages/richtext-lexical/src/packages/@lexical/markdown/MarkdownShortcuts.ts

```typescript
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementNode, LexicalEditor, TextNode } from 'lexical'

import {
  $createRangeSelection,
  $getSelection,
  $isLineBreakNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  $setSelection,
} from 'lexical'

import type {
  ElementTransformer,
  MultilineElementTransformer,
  TextFormatTransformer,
  TextMatchTransformer,
  Transformer,
} from './MarkdownTransformers.js'

import { TRANSFORMERS } from './index.js'
import { indexBy, PUNCTUATION_OR_SPACE, transformersByType } from './utils.js'

function runElementTransformers(
  parentNode: ElementNode,
  anchorNode: TextNode,
  anchorOffset: number,
  elementTransformers: ReadonlyArray<ElementTransformer>,
): boolean {
  const grandParentNode = parentNode.getParent()

  if (!$isRootOrShadowRoot(grandParentNode) || parentNode.getFirstChild() !== anchorNode) {
    return false
  }

  const textContent = anchorNode.getTextContent()

  // Checking for anchorOffset position to prevent any checks for cases when caret is too far
  // from a line start to be a part of block-level markdown trigger.
  //
  // TODO:
  // Can have a quick check if caret is close enough to the beginning of the string (e.g. offset less than 10-20)
  // since otherwise it won't be a markdown shortcut, but tables are exception
  if (textContent[anchorOffset - 1] !== ' ') {
    return false
  }

  for (const { regExp, replace } of elementTransformers) {
    const match = textContent.match(regExp)

    if (match && match[0].length === (match[0].endsWith(' ') ? anchorOffset : anchorOffset - 1)) {
      const nextSiblings = anchorNode.getNextSiblings()
      const [leadingNode, remainderNode] = anchorNode.splitText(anchorOffset)
      leadingNode?.remove()
      const siblings = remainderNode ? [remainderNode, ...nextSiblings] : nextSiblings
      if (replace(parentNode, siblings, match, false) !== false) {
        return true
      }
    }
  }

  return false
}

function runMultilineElementTransformers(
  parentNode: ElementNode,
  anchorNode: TextNode,
  anchorOffset: number,
  elementTransformers: ReadonlyArray<MultilineElementTransformer>,
): boolean {
  const grandParentNode = parentNode.getParent()

  if (!$isRootOrShadowRoot(grandParentNode) || parentNode.getFirstChild() !== anchorNode) {
    return false
  }

  const textContent = anchorNode.getTextContent()

  // Checking for anchorOffset position to prevent any checks for cases when caret is too far
  // from a line start to be a part of block-level markdown trigger.
  //
  // TODO:
  // Can have a quick check if caret is close enough to the beginning of the string (e.g. offset less than 10-20)
  // since otherwise it won't be a markdown shortcut, but tables are exception
  if (textContent[anchorOffset - 1] !== ' ') {
    return false
  }

  for (const { regExpEnd, regExpStart, replace } of elementTransformers) {
    if (
      (regExpEnd && !('optional' in regExpEnd)) ||
      (regExpEnd && 'optional' in regExpEnd && !regExpEnd.optional)
    ) {
      continue
    }

    const match = textContent.match(regExpStart)

    if (match && match[0].length === (match[0].endsWith(' ') ? anchorOffset : anchorOffset - 1)) {
      const nextSiblings = anchorNode.getNextSiblings()
      const [leadingNode, remainderNode] = anchorNode.splitText(anchorOffset)
      leadingNode?.remove()
      const siblings = remainderNode ? [remainderNode, ...nextSiblings] : nextSiblings

      if (replace(parentNode, siblings, match, null, null, false) !== false) {
        return true
      }
    }
  }

  return false
}

function runTextMatchTransformers(
  anchorNode: TextNode,
  anchorOffset: number,
  transformersByTrigger: Readonly<Record<string, Array<TextMatchTransformer>>>,
): boolean {
  let textContent = anchorNode.getTextContent()
  const lastChar = textContent[anchorOffset - 1]!
  const transformers = transformersByTrigger[lastChar]

  if (transformers == null) {
    return false
  }

  // If typing in the middle of content, remove the tail to do
  // reg exp match up to a string end (caret position)
  if (anchorOffset < textContent.length) {
    textContent = textContent.slice(0, anchorOffset)
  }

  for (const transformer of transformers) {
    if (!transformer.replace || !transformer.regExp) {
      continue
    }
    const match = textContent.match(transformer.regExp)

    if (match === null) {
      continue
    }

    const startIndex = match.index || 0
    const endIndex = startIndex + match[0].length
    let replaceNode

    if (startIndex === 0) {
      ;[replaceNode] = anchorNode.splitText(endIndex)
    } else {
      ;[, replaceNode] = anchorNode.splitText(startIndex, endIndex)
    }
    if (replaceNode) {
      replaceNode.selectNext(0, 0)
      transformer.replace(replaceNode, match)
    }
    return true
  }

  return false
}

function $runTextFormatTransformers(
  anchorNode: TextNode,
  anchorOffset: number,
  textFormatTransformers: Readonly<Record<string, ReadonlyArray<TextFormatTransformer>>>,
): boolean {
  const textContent = anchorNode.getTextContent()
  const closeTagEndIndex = anchorOffset - 1
  const closeChar = textContent[closeTagEndIndex]!
  // Quick check if we're possibly at the end of inline markdown style
  const matchers = textFormatTransformers[closeChar]

  if (!matchers) {
    return false
  }

  for (const matcher of matchers) {
    const { tag } = matcher
    const tagLength = tag.length
    const closeTagStartIndex = closeTagEndIndex - tagLength + 1

    // If tag is not single char check if rest of it matches with text content
    if (tagLength > 1) {
      if (!isEqualSubString(textContent, closeTagStartIndex, tag, 0, tagLength)) {
        continue
      }
    }

    // Space before closing tag cancels inline markdown
    if (textContent[closeTagStartIndex - 1] === ' ') {
      continue
    }

    // Some tags can not be used within words, hence should have newline/space/punctuation after it
    const afterCloseTagChar = textContent[closeTagEndIndex + 1]

    if (
      matcher.intraword === false &&
      afterCloseTagChar &&
      !PUNCTUATION_OR_SPACE.test(afterCloseTagChar)
    ) {
      continue
    }

    const closeNode = anchorNode
    let openNode = closeNode
    let openTagStartIndex = getOpenTagStartIndex(textContent, closeTagStartIndex, tag)

    // Go through text node siblings and search for opening tag
    // if haven't found it within the same text node as closing tag
    let sibling: null | TextNode = openNode

    while (openTagStartIndex < 0 && (sibling = sibling.getPreviousSibling<TextNode>())) {
      if ($isLineBreakNode(sibling)) {
        break
      }

      if ($isTextNode(sibling)) {
        const siblingTextContent = sibling.getTextContent()
        openNode = sibling
        openTagStartIndex = getOpenTagStartIndex(siblingTextContent, siblingTextContent.length, tag)
      }
    }

    // Opening tag is not found
    if (openTagStartIndex < 0) {
      continue
    }

    // No content between opening and closing tag
    if (openNode === closeNode && openTagStartIndex + tagLength === closeTagStartIndex) {
      continue
    }

    // Checking longer tags for repeating chars (e.g. *** vs **)
    const prevOpenNodeText = openNode.getTextContent()

    if (openTagStartIndex > 0 && prevOpenNodeText[openTagStartIndex - 1] === closeChar) {
      continue
    }

    // Some tags can not be used within words, hence should have newline/space/punctuation before it
    const beforeOpenTagChar = prevOpenNodeText[openTagStartIndex - 1]

    if (
      matcher.intraword === false &&
      beforeOpenTagChar &&
      !PUNCTUATION_OR_SPACE.test(beforeOpenTagChar)
    ) {
      continue
    }

    // Clean text from opening and closing tags (starting from closing tag
    // to prevent any offset shifts if we start from opening one)
    const prevCloseNodeText = closeNode.getTextContent()
    const closeNodeText =
      prevCloseNodeText.slice(0, closeTagStartIndex) + prevCloseNodeText.slice(closeTagEndIndex + 1)
    closeNode.setTextContent(closeNodeText)
    const openNodeText = openNode === closeNode ? closeNodeText : prevOpenNodeText
    openNode.setTextContent(
      openNodeText.slice(0, openTagStartIndex) + openNodeText.slice(openTagStartIndex + tagLength),
    )
    const selection = $getSelection()
    const nextSelection = $createRangeSelection()
    $setSelection(nextSelection)
    // Adjust offset based on deleted chars
    const newOffset = closeTagEndIndex - tagLength * (openNode === closeNode ? 2 : 1) + 1
    nextSelection.anchor.set(openNode.__key, openTagStartIndex, 'text')
    nextSelection.focus.set(closeNode.__key, newOffset, 'text')

    // Apply formatting to selected text
    for (const format of matcher.format) {
      if (!nextSelection.hasFormat(format)) {
        nextSelection.formatText(format)
      }
    }

    // Collapse selection up to the focus point
    nextSelection.anchor.set(
      nextSelection.focus.key,
      nextSelection.focus.offset,
      nextSelection.focus.type,
    )

    // Remove formatting from collapsed selection
    for (const format of matcher.format) {
      if (nextSelection.hasFormat(format)) {
        nextSelection.toggleFormat(format)
      }
    }

    if ($isRangeSelection(selection)) {
      nextSelection.format = selection.format
    }

    return true
  }

  return false
}

function getOpenTagStartIndex(string: string, maxIndex: number, tag: string): number {
  const tagLength = tag.length

  for (let i = maxIndex; i >= tagLength; i--) {
    const startIndex = i - tagLength

    if (
      isEqualSubString(string, startIndex, tag, 0, tagLength) && // Space after opening tag cancels transformation
      string[startIndex + tagLength] !== ' '
    ) {
      return startIndex
    }
  }

  return -1
}

function isEqualSubString(
  stringA: string,
  aStart: number,
  stringB: string,
  bStart: number,
  length: number,
): boolean {
  for (let i = 0; i < length; i++) {
    if (stringA[aStart + i] !== stringB[bStart + i]) {
      return false
    }
  }

  return true
}

export function registerMarkdownShortcuts(
  editor: LexicalEditor,
  transformers: Array<Transformer> = TRANSFORMERS,
): () => void {
  const byType = transformersByType(transformers)
  const textFormatTransformersByTrigger = indexBy(
    byType.textFormat,
    ({ tag }) => tag[tag.length - 1],
  )
  const textMatchTransformersByTrigger = indexBy(byType.textMatch, ({ trigger }) => trigger)

  for (const transformer of transformers) {
    const type = transformer.type
    if (type === 'element' || type === 'text-match' || type === 'multiline-element') {
      const dependencies = transformer.dependencies
      for (const node of dependencies) {
        if (!editor.hasNode(node)) {
          throw new Error(
            'MarkdownShortcuts: missing dependency %s for transformer. Ensure node dependency is included in editor initial config.' +
              node.getType(),
          )
        }
      }
    }
  }

  const $transform = (parentNode: ElementNode, anchorNode: TextNode, anchorOffset: number) => {
    if (runElementTransformers(parentNode, anchorNode, anchorOffset, byType.element)) {
      return
    }

    if (
      runMultilineElementTransformers(parentNode, anchorNode, anchorOffset, byType.multilineElement)
    ) {
      return
    }

    if (runTextMatchTransformers(anchorNode, anchorOffset, textMatchTransformersByTrigger)) {
      return
    }

    $runTextFormatTransformers(anchorNode, anchorOffset, textFormatTransformersByTrigger)
  }

  return editor.registerUpdateListener(({ dirtyLeaves, editorState, prevEditorState, tags }) => {
    // Ignore updates from collaboration and undo/redo (as changes already calculated)
    if (tags.has('collaboration') || tags.has('historic')) {
      return
    }

    // If editor is still composing (i.e. backticks) we must wait before the user confirms the key
    if (editor.isComposing()) {
      return
    }

    const selection = editorState.read($getSelection)
    const prevSelection = prevEditorState.read($getSelection)

    // We expect selection to be a collapsed range and not match previous one (as we want
    // to trigger transforms only as user types)
    if (
      !$isRangeSelection(prevSelection) ||
      !$isRangeSelection(selection) ||
      !selection.isCollapsed() ||
      selection.is(prevSelection)
    ) {
      return
    }

    const anchorKey = selection.anchor.key
    const anchorOffset = selection.anchor.offset

    const anchorNode = editorState._nodeMap.get(anchorKey)

    if (
      !$isTextNode(anchorNode) ||
      !dirtyLeaves.has(anchorKey) ||
      (anchorOffset !== 1 && anchorOffset > prevSelection.anchor.offset + 1)
    ) {
      return
    }

    editor.update(() => {
      // Markdown is not available inside code
      if (anchorNode.hasFormat('code')) {
        return
      }

      const parentNode = anchorNode.getParent()

      if (parentNode === null) {
        return
      }

      $transform(parentNode, anchorNode, selection.anchor.offset)
    })
  })
}
```

--------------------------------------------------------------------------------

---[FILE: MarkdownTransformers.ts]---
Location: payload-main/packages/richtext-lexical/src/packages/@lexical/markdown/MarkdownTransformers.ts

```typescript
/* eslint-disable regexp/no-unused-capturing-group */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ListType } from '@lexical/list'
import type { HeadingTagType } from '@lexical/rich-text'
import type { ElementNode, Klass, LexicalNode, TextFormatType, TextNode } from 'lexical'

import {
  $createListItemNode,
  $createListNode,
  $isListItemNode,
  $isListNode,
  ListItemNode,
  ListNode,
} from '@lexical/list'
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingNode,
  QuoteNode,
} from '@lexical/rich-text'
import { $createLineBreakNode } from 'lexical'

export type Transformer =
  | ElementTransformer
  | MultilineElementTransformer
  | TextFormatTransformer
  | TextMatchTransformer

export type ElementTransformer = {
  dependencies: Array<Klass<LexicalNode>>
  /**
   * `export` is called when the `$convertToMarkdownString` is called to convert the editor state into markdown.
   *
   * @return return null to cancel the export, even though the regex matched. Lexical will then search for the next transformer.
   */
  export: (
    node: LexicalNode,

    traverseChildren: (node: ElementNode) => string,
  ) => null | string
  regExp: RegExp
  /**
   * `replace` is called when markdown is imported or typed in the editor
   *
   * @return return false to cancel the transform, even though the regex matched. Lexical will then search for the next transformer.
   */
  replace: (
    parentNode: ElementNode,
    children: Array<LexicalNode>,
    match: Array<string>,
    /**
     * Whether the match is from an import operation (e.g. through `$convertFromMarkdownString`) or not (e.g. through typing in the editor).
     */
    isImport: boolean,
  ) => boolean | void
  type: 'element'
}

export type MultilineElementTransformer = {
  dependencies: Array<Klass<LexicalNode>>
  /**
   * `export` is called when the `$convertToMarkdownString` is called to convert the editor state into markdown.
   *
   * @return return null to cancel the export, even though the regex matched. Lexical will then search for the next transformer.
   */
  export?: (
    node: LexicalNode,

    traverseChildren: (node: ElementNode) => string,
  ) => null | string
  /**
   * Use this function to manually handle the import process, once the `regExpStart` has matched successfully.
   * Without providing this function, the default behavior is to match until `regExpEnd` is found, or until the end of the document if `regExpEnd.optional` is true.
   *
   * @returns a tuple or null. The first element of the returned tuple is a boolean indicating if a multiline element was imported. The second element is the index of the last line that was processed. If null is returned, the next multilineElementTransformer will be tried. If undefined is returned, the default behavior will be used.
   */
  handleImportAfterStartMatch?: (args: {
    lines: Array<string>
    rootNode: ElementNode
    startLineIndex: number
    startMatch: RegExpMatchArray
    transformer: MultilineElementTransformer
  }) => [boolean, number] | null | undefined
  /**
   * This regex determines when to stop matching. Anything in between regExpStart and regExpEnd will be matched
   */
  regExpEnd?:
    | {
        /**
         * Whether the end match is optional. If true, the end match is not required to match for the transformer to be triggered.
         * The entire text from regexpStart to the end of the document will then be matched.
         */
        optional?: true
        regExp: RegExp
      }
    | RegExp
  /**
   * This regex determines when to start matching
   */
  regExpStart: RegExp
  /**
   * `replace` is called only when markdown is imported in the editor, not when it's typed
   *
   * @return return false to cancel the transform, even though the regex matched. Lexical will then search for the next transformer.
   */
  replace: (
    rootNode: ElementNode,
    /**
     * During markdown shortcut transforms, children nodes may be provided to the transformer. If this is the case, no `linesInBetween` will be provided and
     * the children nodes should be used instead of the `linesInBetween` to create the new node.
     */
    children: Array<LexicalNode> | null,
    startMatch: Array<string>,
    endMatch: Array<string> | null,
    /**
     * linesInBetween includes the text between the start & end matches, split up by lines, not including the matches themselves.
     * This is null when the transformer is triggered through markdown shortcuts (by typing in the editor)
     */
    linesInBetween: Array<string> | null,
    /**
     * Whether the match is from an import operation (e.g. through `$convertFromMarkdownString`) or not (e.g. through typing in the editor).
     */
    isImport: boolean,
  ) => boolean | void
  type: 'multiline-element'
}

export type TextFormatTransformer = Readonly<{
  format: ReadonlyArray<TextFormatType>
  intraword?: boolean
  tag: string
  type: 'text-format'
}>

export type TextMatchTransformer = Readonly<{
  dependencies: Array<Klass<LexicalNode>>
  /**
   * Determines how a node should be exported to markdown
   */
  export?: (
    node: LexicalNode,

    exportChildren: (node: ElementNode) => string,

    exportFormat: (node: TextNode, textContent: string) => string,
  ) => null | string
  /**
   * For import operations, this function can be used to determine the end index of the match, after `importRegExp` has matched.
   * Without this function, the end index will be determined by the length of the match from `importRegExp`. Manually determining the end index can be useful if
   * the match from `importRegExp` is not the entire text content of the node. That way, `importRegExp` can be used to match only the start of the node, and `getEndIndex`
   * can be used to match the end of the node.
   *
   * @returns The end index of the match, or false if the match was unsuccessful and a different transformer should be tried.
   */
  getEndIndex?: (node: TextNode, match: RegExpMatchArray) => false | number
  /**
   * This regex determines what text is matched during markdown imports
   */
  importRegExp?: RegExp
  /**
   * This regex determines what text is matched for markdown shortcuts while typing in the editor
   */
  regExp: RegExp
  /**
   * Determines how the matched markdown text should be transformed into a node during the markdown import process
   *
   * @returns nothing, or a TextNode that may be a child of the new node that is created.
   * If a TextNode is returned, text format matching will be applied to it (e.g. bold, italic, etc.)
   */
  replace?: (node: TextNode, match: RegExpMatchArray) => TextNode | void
  /**
   * Single character that allows the transformer to trigger when typed in the editor. This does not affect markdown imports outside of the markdown shortcut plugin.
   * If the trigger is matched, the `regExp` will be used to match the text in the second step.
   */
  trigger?: string
  type: 'text-match'
}>

const EMPTY_OR_WHITESPACE_ONLY = /^[\t ]*$/
const ORDERED_LIST_REGEX = /^(\s*)(\d+)\.\s/
const UNORDERED_LIST_REGEX = /^(\s*)[-*+]\s/
const CHECK_LIST_REGEX = /^(\s*)(?:-\s)?\s?(\[(\s|x)?\])\s/i
const HEADING_REGEX = /^(#{1,6})\s/
const QUOTE_REGEX = /^>\s/
const CODE_START_REGEX = /^[ \t]*(\\`\\`\\`|```)(\w+)?/
const CODE_END_REGEX = /[ \t]*(\\`\\`\\`|```)$/
const CODE_SINGLE_LINE_REGEX = /^[ \t]*```[^`]+(?:(?:`{1,2}|`{4,})[^`]+)*```(?:[^`]|$)/
const TABLE_ROW_REG_EXP = /^\|(.+)\|\s?$/
const TABLE_ROW_DIVIDER_REG_EXP = /^(\| ?:?-*:? ?)+\|\s?$/
const TAG_START_REGEX = /^[ \t]*<[a-z_][\w-]*(?:\s[^<>]*)?\/?>/i
const TAG_END_REGEX = /^[ \t]*<\/[a-z_][\w-]*\s*>/i

const createBlockNode = (
  createNode: (match: Array<string>) => ElementNode,
): ElementTransformer['replace'] => {
  return (parentNode, children, match) => {
    const node = createNode(match)
    node.append(...children)
    parentNode.replace(node)
    node.select(0, 0)
  }
}

// Amount of spaces that define indentation level
// TODO: should be an option
const LIST_INDENT_SIZE = 4

function getIndent(whitespaces: string): number {
  const tabs = whitespaces.match(/\t/g)
  const spaces = whitespaces.match(/ /g)

  let indent = 0

  if (tabs) {
    indent += tabs.length
  }

  if (spaces) {
    indent += Math.floor(spaces.length / LIST_INDENT_SIZE)
  }

  return indent
}

const listReplace = (listType: ListType): ElementTransformer['replace'] => {
  return (parentNode, children, match) => {
    const previousNode = parentNode.getPreviousSibling()
    const nextNode = parentNode.getNextSibling()
    const listItem = $createListItemNode(listType === 'check' ? match[3] === 'x' : undefined)
    if ($isListNode(nextNode) && nextNode.getListType() === listType) {
      const firstChild = nextNode.getFirstChild()
      if (firstChild !== null) {
        firstChild.insertBefore(listItem)
      } else {
        // should never happen, but let's handle gracefully, just in case.
        nextNode.append(listItem)
      }
      parentNode.remove()
    } else if ($isListNode(previousNode) && previousNode.getListType() === listType) {
      previousNode.append(listItem)
      parentNode.remove()
    } else {
      const list = $createListNode(listType, listType === 'number' ? Number(match[2]) : undefined)
      list.append(listItem)
      parentNode.replace(list)
    }
    listItem.append(...children)
    listItem.select(0, 0)
    const indent = getIndent(match[1]!)
    if (indent) {
      listItem.setIndent(indent)
    }
  }
}

const listExport = (
  listNode: ListNode,
  exportChildren: (node: ElementNode) => string,
  depth: number,
): string => {
  const output: string[] = []
  const children = listNode.getChildren()
  let index = 0
  for (const listItemNode of children) {
    if ($isListItemNode(listItemNode)) {
      if (listItemNode.getChildrenSize() === 1) {
        const firstChild = listItemNode.getFirstChild()
        if ($isListNode(firstChild)) {
          output.push(listExport(firstChild, exportChildren, depth + 1))
          continue
        }
      }
      const indent = ' '.repeat(depth * LIST_INDENT_SIZE)
      const listType = listNode.getListType()
      const prefix =
        listType === 'number'
          ? `${listNode.getStart() + index}. `
          : listType === 'check'
            ? `- [${listItemNode.getChecked() ? 'x' : ' '}] `
            : '- '
      output.push(indent + prefix + exportChildren(listItemNode))
      index++
    }
  }

  return output.join('\n')
}

export const HEADING: ElementTransformer = {
  type: 'element',
  dependencies: [HeadingNode],
  export: (node, exportChildren) => {
    if (!$isHeadingNode(node)) {
      return null
    }
    const level = Number(node.getTag().slice(1))
    return '#'.repeat(level) + ' ' + exportChildren(node)
  },
  regExp: HEADING_REGEX,
  replace: createBlockNode((match) => {
    const tag = ('h' + match[1]!.length) as HeadingTagType
    return $createHeadingNode(tag)
  }),
}

export const QUOTE: ElementTransformer = {
  type: 'element',
  dependencies: [QuoteNode],
  export: (node, exportChildren) => {
    if (!$isQuoteNode(node)) {
      return null
    }

    const lines = exportChildren(node).split('\n')
    const output: string[] = []
    for (const line of lines) {
      output.push('> ' + line)
    }
    return output.join('\n')
  },
  regExp: QUOTE_REGEX,
  replace: (parentNode, children, _match, isImport) => {
    if (isImport) {
      const previousNode = parentNode.getPreviousSibling()
      if ($isQuoteNode(previousNode)) {
        previousNode.splice(previousNode.getChildrenSize(), 0, [
          $createLineBreakNode(),
          ...children,
        ])
        previousNode.select(0, 0)
        parentNode.remove()
        return
      }
    }

    const node = $createQuoteNode()
    node.append(...children)
    parentNode.replace(node)
    node.select(0, 0)
  },
}

export const UNORDERED_LIST: ElementTransformer = {
  type: 'element',
  dependencies: [ListNode, ListItemNode],
  export: (node, exportChildren) => {
    return $isListNode(node) ? listExport(node, exportChildren, 0) : null
  },
  regExp: UNORDERED_LIST_REGEX,
  replace: listReplace('bullet'),
}

export const CHECK_LIST: ElementTransformer = {
  type: 'element',
  dependencies: [ListNode, ListItemNode],
  export: (node, exportChildren) => {
    return $isListNode(node) ? listExport(node, exportChildren, 0) : null
  },
  regExp: CHECK_LIST_REGEX,
  replace: listReplace('check'),
}

export const ORDERED_LIST: ElementTransformer = {
  type: 'element',
  dependencies: [ListNode, ListItemNode],
  export: (node, exportChildren) => {
    return $isListNode(node) ? listExport(node, exportChildren, 0) : null
  },
  regExp: ORDERED_LIST_REGEX,
  replace: listReplace('number'),
}

export const INLINE_CODE: TextFormatTransformer = {
  type: 'text-format',
  format: ['code'],
  tag: '`',
}

export const HIGHLIGHT: TextFormatTransformer = {
  type: 'text-format',
  format: ['highlight'],
  tag: '==',
}

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

export const STRIKETHROUGH: TextFormatTransformer = {
  type: 'text-format',
  format: ['strikethrough'],
  tag: '~~',
}

export const ITALIC_STAR: TextFormatTransformer = {
  type: 'text-format',
  format: ['italic'],
  tag: '*',
}

export const ITALIC_UNDERSCORE: TextFormatTransformer = {
  type: 'text-format',
  format: ['italic'],
  intraword: false,
  tag: '_',
}

export function normalizeMarkdown(input: string, shouldMergeAdjacentLines: boolean): string {
  const lines = input.split('\n')
  let inCodeBlock = false
  const sanitizedLines: string[] = []
  let nestedDeepCodeBlock = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    const lastLine = sanitizedLines[sanitizedLines.length - 1]

    // Code blocks of ```single line``` don't toggle the inCodeBlock flag
    if (CODE_SINGLE_LINE_REGEX.test(line)) {
      sanitizedLines.push(line)
      continue
    }

    if (CODE_END_REGEX.test(line)) {
      if (nestedDeepCodeBlock === 0) {
        inCodeBlock = true
      }
      if (nestedDeepCodeBlock === 1) {
        inCodeBlock = false
      }
      if (nestedDeepCodeBlock > 0) {
        nestedDeepCodeBlock--
      }
      sanitizedLines.push(line)
      continue
    }

    // Toggle inCodeBlock state when encountering start or end of a code block
    if (CODE_START_REGEX.test(line)) {
      inCodeBlock = true
      nestedDeepCodeBlock++
      sanitizedLines.push(line)
      continue
    }

    // If we are inside a code block, keep the line unchanged
    if (inCodeBlock) {
      sanitizedLines.push(line)
      continue
    }

    // In markdown the concept of "empty paragraphs" does not exist.
    // Blocks must be separated by an empty line. Non-empty adjacent lines must be merged.
    if (
      EMPTY_OR_WHITESPACE_ONLY.test(line) ||
      EMPTY_OR_WHITESPACE_ONLY.test(lastLine!) ||
      !lastLine ||
      HEADING_REGEX.test(lastLine) ||
      HEADING_REGEX.test(line) ||
      QUOTE_REGEX.test(line) ||
      ORDERED_LIST_REGEX.test(line) ||
      UNORDERED_LIST_REGEX.test(line) ||
      CHECK_LIST_REGEX.test(line) ||
      TABLE_ROW_REG_EXP.test(line) ||
      TABLE_ROW_DIVIDER_REG_EXP.test(line) ||
      !shouldMergeAdjacentLines ||
      TAG_START_REGEX.test(line) ||
      TAG_END_REGEX.test(line) ||
      TAG_START_REGEX.test(lastLine) ||
      TAG_END_REGEX.test(lastLine) ||
      CODE_END_REGEX.test(lastLine)
    ) {
      sanitizedLines.push(line)
    } else {
      sanitizedLines[sanitizedLines.length - 1] = lastLine + ' ' + line.trim()
    }
  }

  return sanitizedLines.join('\n')
}
```

--------------------------------------------------------------------------------

````
