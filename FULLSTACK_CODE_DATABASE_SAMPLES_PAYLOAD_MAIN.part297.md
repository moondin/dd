---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 297
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 297 of 695)

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

---[FILE: LexicalHorizontalRulePlugin.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalHorizontalRulePlugin.ts

```typescript
export * from '@lexical/react/LexicalHorizontalRulePlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalLinkPlugin.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalLinkPlugin.ts

```typescript
export * from '@lexical/react/LexicalLinkPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalListPlugin.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalListPlugin.ts

```typescript
export * from '@lexical/react/LexicalListPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalMarkdownShortcutPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalMarkdownShortcutPlugin.tsx

```typescript
export * from '@lexical/react/LexicalMarkdownShortcutPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalNestedComposer.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalNestedComposer.tsx

```typescript
export * from '@lexical/react/LexicalNestedComposer'
```

--------------------------------------------------------------------------------

---[FILE: LexicalNodeContextMenuPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalNodeContextMenuPlugin.tsx

```typescript
export * from '@lexical/react/LexicalNodeContextMenuPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalNodeEventPlugin.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalNodeEventPlugin.ts

```typescript
export * from '@lexical/react/LexicalNodeEventPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalNodeMenuPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalNodeMenuPlugin.tsx

```typescript
export * from '@lexical/react/LexicalNodeMenuPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalOnChangePlugin.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalOnChangePlugin.ts

```typescript
export * from '@lexical/react/LexicalOnChangePlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalPlainTextPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalPlainTextPlugin.tsx

```typescript
export * from '@lexical/react/LexicalPlainTextPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalRichTextPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalRichTextPlugin.tsx

```typescript
export * from '@lexical/react/LexicalRichTextPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalTabIndentationPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalTabIndentationPlugin.tsx

```typescript
export * from '@lexical/react/LexicalTabIndentationPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalTableOfContentsPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalTableOfContentsPlugin.tsx

```typescript
export * from '@lexical/react/LexicalTableOfContentsPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalTablePlugin.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalTablePlugin.ts

```typescript
export * from '@lexical/react/LexicalTablePlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalTreeView.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalTreeView.tsx

```typescript
export * from '@lexical/react/LexicalTreeView'
```

--------------------------------------------------------------------------------

---[FILE: LexicalTypeaheadMenuPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalTypeaheadMenuPlugin.tsx

```typescript
export * from '@lexical/react/LexicalTypeaheadMenuPlugin'
```

--------------------------------------------------------------------------------

---[FILE: useLexicalEditable.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/useLexicalEditable.ts

```typescript
export * from '@lexical/react/useLexicalEditable'
```

--------------------------------------------------------------------------------

---[FILE: useLexicalIsTextContentEmpty.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/useLexicalIsTextContentEmpty.ts

```typescript
export * from '@lexical/react/useLexicalIsTextContentEmpty'
```

--------------------------------------------------------------------------------

---[FILE: useLexicalNodeSelection.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/useLexicalNodeSelection.ts

```typescript
export * from '@lexical/react/useLexicalNodeSelection'
```

--------------------------------------------------------------------------------

---[FILE: useLexicalSubscription.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/useLexicalSubscription.tsx

```typescript
export * from '@lexical/react/useLexicalSubscription'
```

--------------------------------------------------------------------------------

---[FILE: useLexicalTextEntity.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/useLexicalTextEntity.ts

```typescript
export * from '@lexical/react/useLexicalTextEntity'
```

--------------------------------------------------------------------------------

---[FILE: importTextFormatTransformer.ts]---
Location: payload-main/packages/richtext-lexical/src/packages/@lexical/markdown/importTextFormatTransformer.ts

```typescript
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { TextNode } from 'lexical'

import type { TextFormatTransformersIndex } from './MarkdownImport.js'
import type { TextFormatTransformer } from './MarkdownTransformers.js'

import { PUNCTUATION_OR_SPACE } from './utils.js'

export function findOutermostTextFormatTransformer(
  textNode: TextNode,
  textFormatTransformersIndex: TextFormatTransformersIndex,
): {
  endIndex: number
  match: RegExpMatchArray
  startIndex: number
  transformer: TextFormatTransformer
} | null {
  const textContent = textNode.getTextContent()
  const match = findOutermostMatch(textContent, textFormatTransformersIndex)

  if (!match) {
    return null
  }

  const textFormatMatchStart: number = match.index || 0
  const textFormatMatchEnd = textFormatMatchStart + match[0].length

  // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
  const transformer: TextFormatTransformer = textFormatTransformersIndex.transformersByTag[match[1]]

  return {
    endIndex: textFormatMatchEnd,
    match,
    startIndex: textFormatMatchStart,
    transformer,
  }
}

// Finds first "<tag>content<tag>" match that is not nested into another tag
function findOutermostMatch(
  textContent: string,
  textTransformersIndex: TextFormatTransformersIndex,
): null | RegExpMatchArray {
  const openTagsMatch = textContent.match(textTransformersIndex.openTagsRegExp)

  if (openTagsMatch == null) {
    return null
  }

  for (const match of openTagsMatch) {
    // Open tags reg exp might capture leading space so removing it
    // before using match to find transformer
    const tag = match.replace(/^\s/, '')
    const fullMatchRegExp = textTransformersIndex.fullMatchRegExpByTag[tag]
    if (fullMatchRegExp == null) {
      continue
    }

    const fullMatch = textContent.match(fullMatchRegExp)
    const transformer = textTransformersIndex.transformersByTag[tag]
    if (fullMatch != null && transformer != null) {
      if (transformer.intraword !== false) {
        return fullMatch
      }

      // For non-intraword transformers checking if it's within a word
      // or surrounded with space/punctuation/newline
      const { index = 0 } = fullMatch
      const beforeChar = textContent[index - 1]
      const afterChar = textContent[index + fullMatch[0].length]

      if (
        (!beforeChar || PUNCTUATION_OR_SPACE.test(beforeChar)) &&
        (!afterChar || PUNCTUATION_OR_SPACE.test(afterChar))
      ) {
        return fullMatch
      }
    }
  }

  return null
}

export function importTextFormatTransformer(
  textNode: TextNode,
  startIndex: number,
  endIndex: number,
  transformer: TextFormatTransformer,
  match: RegExpMatchArray,
): {
  nodeAfter: TextNode | undefined // If split
  nodeBefore: TextNode | undefined // If split
  transformedNode: TextNode
} {
  const textContent = textNode.getTextContent()

  // No text matches - we can safely process the text format match
  let nodeAfter: TextNode | undefined
  let nodeBefore: TextNode | undefined
  let transformedNode: TextNode

  // If matching full content there's no need to run splitText and can reuse existing textNode
  // to update its content and apply format. E.g. for **_Hello_** string after applying bold
  // format (**) it will reuse the same text node to apply italic (_)
  if (match[0] === textContent) {
    transformedNode = textNode
  } else {
    if (startIndex === 0) {
      ;[transformedNode, nodeAfter] = textNode.splitText(endIndex) as [
        TextNode,
        TextNode | undefined,
      ]
    } else {
      ;[nodeBefore, transformedNode, nodeAfter] = textNode.splitText(startIndex, endIndex) as [
        TextNode,
        TextNode,
        TextNode | undefined,
      ]
    }
  }

  transformedNode.setTextContent(match[2]!)
  if (transformer) {
    for (const format of transformer.format) {
      if (!transformedNode.hasFormat(format)) {
        transformedNode.toggleFormat(format)
      }
    }
  }

  return {
    nodeAfter,
    nodeBefore,
    transformedNode,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: importTextMatchTransformer.ts]---
Location: payload-main/packages/richtext-lexical/src/packages/@lexical/markdown/importTextMatchTransformer.ts

```typescript
import { type TextNode } from 'lexical'

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { TextMatchTransformer } from './MarkdownTransformers.js'

export function findOutermostTextMatchTransformer(
  textNode_: TextNode,
  textMatchTransformers: Array<TextMatchTransformer>,
): {
  endIndex: number
  match: RegExpMatchArray
  startIndex: number
  transformer: TextMatchTransformer
} | null {
  const textNode = textNode_

  let foundMatchStartIndex: number | undefined = undefined
  let foundMatchEndIndex: number | undefined = undefined
  let foundMatchTransformer: TextMatchTransformer | undefined = undefined
  let foundMatch: RegExpMatchArray | undefined = undefined

  for (const transformer of textMatchTransformers) {
    if (!transformer.replace || !transformer.importRegExp) {
      continue
    }
    const match = textNode.getTextContent().match(transformer.importRegExp)

    if (!match) {
      continue
    }

    const startIndex = match.index || 0
    const endIndex = transformer.getEndIndex
      ? transformer.getEndIndex(textNode, match)
      : startIndex + match[0].length

    if (endIndex === false) {
      continue
    }

    if (
      foundMatchStartIndex === undefined ||
      foundMatchEndIndex === undefined ||
      (startIndex < foundMatchStartIndex && endIndex > foundMatchEndIndex)
    ) {
      foundMatchStartIndex = startIndex
      foundMatchEndIndex = endIndex
      foundMatchTransformer = transformer
      foundMatch = match
    }
  }

  if (
    foundMatchStartIndex === undefined ||
    foundMatchEndIndex === undefined ||
    foundMatchTransformer === undefined ||
    foundMatch === undefined
  ) {
    return null
  }

  return {
    endIndex: foundMatchEndIndex,
    match: foundMatch,
    startIndex: foundMatchStartIndex,
    transformer: foundMatchTransformer,
  }
}

export function importFoundTextMatchTransformer(
  textNode: TextNode,
  startIndex: number,
  endIndex: number,
  transformer: TextMatchTransformer,
  match: RegExpMatchArray,
): {
  nodeAfter: TextNode | undefined // If split
  nodeBefore: TextNode | undefined // If split
  transformedNode?: TextNode
} | null {
  let nodeAfter, nodeBefore, transformedNode

  if (startIndex === 0) {
    ;[transformedNode, nodeAfter] = textNode.splitText(endIndex)
  } else {
    ;[nodeBefore, transformedNode, nodeAfter] = textNode.splitText(startIndex, endIndex)
  }

  if (!transformer.replace) {
    return null
  }
  const potentialTransformedNode = transformedNode
    ? transformer.replace(transformedNode, match)
    : undefined

  return {
    nodeAfter,
    nodeBefore,
    transformedNode: potentialTransformedNode || undefined,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: importTextTransformers.ts]---
Location: payload-main/packages/richtext-lexical/src/packages/@lexical/markdown/importTextTransformers.ts

```typescript
import { $isTextNode, type TextNode } from 'lexical'

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { TextFormatTransformersIndex } from './MarkdownImport.js'
import type { TextMatchTransformer } from './MarkdownTransformers.js'

import {
  findOutermostTextFormatTransformer,
  importTextFormatTransformer,
} from './importTextFormatTransformer.js'
import {
  findOutermostTextMatchTransformer,
  importFoundTextMatchTransformer,
} from './importTextMatchTransformer.js'

/**
 * Handles applying both text format and text match transformers.
 * It finds the outermost text format or text match and applies it,
 * then recursively calls itself to apply the next outermost transformer,
 * until there are no more transformers to apply.
 */
export function importTextTransformers(
  textNode: TextNode,
  textFormatTransformersIndex: TextFormatTransformersIndex,
  textMatchTransformers: Array<TextMatchTransformer>,
) {
  let foundTextFormat = findOutermostTextFormatTransformer(textNode, textFormatTransformersIndex)

  let foundTextMatch = findOutermostTextMatchTransformer(textNode, textMatchTransformers)

  if (foundTextFormat && foundTextMatch) {
    // Find the outermost transformer
    if (
      foundTextFormat.startIndex <= foundTextMatch.startIndex &&
      foundTextFormat.endIndex >= foundTextMatch.endIndex
    ) {
      // foundTextFormat wraps foundTextMatch - apply foundTextFormat by setting foundTextMatch to null
      foundTextMatch = null
    } else {
      // foundTextMatch wraps foundTextFormat - apply foundTextMatch by setting foundTextFormat to null
      foundTextFormat = null
    }
  }

  if (foundTextFormat) {
    const result = importTextFormatTransformer(
      textNode,
      foundTextFormat.startIndex,
      foundTextFormat.endIndex,
      foundTextFormat.transformer,
      foundTextFormat.match,
    )

    if (result.nodeAfter && $isTextNode(result.nodeAfter) && !result.nodeAfter.hasFormat('code')) {
      importTextTransformers(result.nodeAfter, textFormatTransformersIndex, textMatchTransformers)
    }
    if (
      result.nodeBefore &&
      $isTextNode(result.nodeBefore) &&
      !result.nodeBefore.hasFormat('code')
    ) {
      importTextTransformers(result.nodeBefore, textFormatTransformersIndex, textMatchTransformers)
    }
    if (
      result.transformedNode &&
      $isTextNode(result.transformedNode) &&
      !result.transformedNode.hasFormat('code')
    ) {
      importTextTransformers(
        result.transformedNode,
        textFormatTransformersIndex,
        textMatchTransformers,
      )
    }
  } else if (foundTextMatch) {
    const result = importFoundTextMatchTransformer(
      textNode,
      foundTextMatch.startIndex,
      foundTextMatch.endIndex,
      foundTextMatch.transformer,
      foundTextMatch.match,
    )
    if (!result) {
      return
    }

    if (result.nodeAfter && $isTextNode(result.nodeAfter) && !result.nodeAfter.hasFormat('code')) {
      importTextTransformers(result.nodeAfter, textFormatTransformersIndex, textMatchTransformers)
    }
    if (
      result.nodeBefore &&
      $isTextNode(result.nodeBefore) &&
      !result.nodeBefore.hasFormat('code')
    ) {
      importTextTransformers(result.nodeBefore, textFormatTransformersIndex, textMatchTransformers)
    }
    if (
      result.transformedNode &&
      $isTextNode(result.transformedNode) &&
      !result.transformedNode.hasFormat('code')
    ) {
      importTextTransformers(
        result.transformedNode,
        textFormatTransformersIndex,
        textMatchTransformers,
      )
    }
  }
  // Handle escape characters
  const textContent = textNode.getTextContent()
  const escapedText = textContent.replace(/\\([*_`~])/g, '$1')
  textNode.setTextContent(escapedText)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/packages/@lexical/markdown/index.ts

```typescript
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementNode } from 'lexical'

import type {
  ElementTransformer,
  MultilineElementTransformer,
  TextFormatTransformer,
  TextMatchTransformer,
  Transformer,
} from './MarkdownTransformers.js'

import { createMarkdownExport } from './MarkdownExport.js'
import { createMarkdownImport } from './MarkdownImport.js'
import { registerMarkdownShortcuts } from './MarkdownShortcuts.js'
import {
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  CHECK_LIST,
  HEADING,
  HIGHLIGHT,
  INLINE_CODE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  normalizeMarkdown,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  UNORDERED_LIST,
} from './MarkdownTransformers.js'

const ELEMENT_TRANSFORMERS: Array<ElementTransformer> = [
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
]

const MULTILINE_ELEMENT_TRANSFORMERS: Array<MultilineElementTransformer> = []

// Order of text format transformers matters:
//
// - code should go first as it prevents any transformations inside
// - then longer tags match (e.g. ** or __ should go before * or _)
const TEXT_FORMAT_TRANSFORMERS: Array<TextFormatTransformer> = [
  INLINE_CODE,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  HIGHLIGHT,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
]

const TEXT_MATCH_TRANSFORMERS: Array<TextMatchTransformer> = []

const TRANSFORMERS: Array<Transformer> = [
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
]

/**
 * Renders markdown from a string. The selection is moved to the start after the operation.
 *
 *  @param {boolean} [shouldPreserveNewLines] By setting this to true, new lines will be preserved between conversions
 *  @param {boolean} [shouldMergeAdjacentLines] By setting this to true, adjacent non empty lines will be merged according to commonmark spec: https://spec.commonmark.org/0.24/#example-177. Not applicable if shouldPreserveNewLines = true.
 */
function $convertFromMarkdownString(
  markdown: string,
  transformers: Array<Transformer> = TRANSFORMERS,
  node?: ElementNode,
  shouldPreserveNewLines = false,
  shouldMergeAdjacentLines = true,
): void {
  const sanitizedMarkdown = shouldPreserveNewLines
    ? markdown
    : normalizeMarkdown(markdown, shouldMergeAdjacentLines)
  const importMarkdown = createMarkdownImport(transformers, shouldPreserveNewLines)
  return importMarkdown(sanitizedMarkdown, node)
}

/**
 * Renders string from markdown. The selection is moved to the start after the operation.
 */
function $convertToMarkdownString(
  transformers: Array<Transformer> = TRANSFORMERS,
  node?: ElementNode,
  shouldPreserveNewLines: boolean = false,
): string {
  const exportMarkdown = createMarkdownExport(transformers, shouldPreserveNewLines)
  return exportMarkdown(node)
}

export {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  type ElementTransformer,
  HEADING,
  HIGHLIGHT,
  INLINE_CODE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  MULTILINE_ELEMENT_TRANSFORMERS,
  type MultilineElementTransformer,
  ORDERED_LIST,
  QUOTE,
  registerMarkdownShortcuts,
  STRIKETHROUGH,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  type TextFormatTransformer,
  type TextMatchTransformer,
  type Transformer,
  TRANSFORMERS,
  UNORDERED_LIST,
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: payload-main/packages/richtext-lexical/src/packages/@lexical/markdown/LICENSE

```text
MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: MarkdownExport.ts]---
Location: payload-main/packages/richtext-lexical/src/packages/@lexical/markdown/MarkdownExport.ts

```typescript
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementNode, LexicalNode, TextFormatType, TextNode } from 'lexical'

import { $getRoot, $isDecoratorNode, $isElementNode, $isLineBreakNode, $isTextNode } from 'lexical'

import type {
  ElementTransformer,
  MultilineElementTransformer,
  TextFormatTransformer,
  TextMatchTransformer,
  Transformer,
} from './MarkdownTransformers.js'

import { isEmptyParagraph, transformersByType } from './utils.js'

/**
 * Renders string from markdown. The selection is moved to the start after the operation.
 */
export function createMarkdownExport(
  transformers: Array<Transformer>,
  shouldPreserveNewLines: boolean = false,
): (node?: ElementNode) => string {
  const byType = transformersByType(transformers)
  const elementTransformers = [...byType.multilineElement, ...byType.element]
  const isNewlineDelimited = !shouldPreserveNewLines

  // Export only uses text formats that are responsible for single format
  // e.g. it will filter out *** (bold, italic) and instead use separate ** and *
  const textFormatTransformers = byType.textFormat
    .filter((transformer) => transformer.format.length === 1)
    // Make sure all text transformers that contain 'code' in their format are at the end of the array. Otherwise, formatted code like
    // <strong><code>code</code></strong> will be exported as `**Bold Code**`, as the code format will be applied first, and the bold format
    // will be applied second and thus skipped entirely, as the code format will prevent any further formatting.
    .sort((a, b) => {
      if (a.format.includes('code') && !b.format.includes('code')) {
        return 1
      } else if (!a.format.includes('code') && b.format.includes('code')) {
        return -1
      } else {
        return 0
      }
    })

  return (node) => {
    const output: string[] = []
    const children = (node || $getRoot()).getChildren()

    children.forEach((child, i) => {
      const result = exportTopLevelElements(
        child,
        elementTransformers,
        textFormatTransformers,
        byType.textMatch,
      )

      if (result != null) {
        output.push(
          // separate consecutive group of texts with a line break: eg. ["hello", "world"] -> ["hello", "/nworld"]
          isNewlineDelimited &&
            i > 0 &&
            !isEmptyParagraph(child) &&
            !isEmptyParagraph(children[i - 1]!)
            ? '\n'.concat(result)
            : result,
        )
      }
    })
    // Ensure consecutive groups of texts are at least \n\n apart while each empty paragraph render as a newline.
    // Eg. ["hello", "", "", "hi", "\nworld"] -> "hello\n\n\nhi\n\nworld"
    return output.join('\n')
  }
}

function exportTopLevelElements(
  node: LexicalNode,
  elementTransformers: Array<ElementTransformer | MultilineElementTransformer>,
  textTransformersIndex: Array<TextFormatTransformer>,
  textMatchTransformers: Array<TextMatchTransformer>,
): null | string {
  for (const transformer of elementTransformers) {
    if (!transformer.export) {
      continue
    }
    const result = transformer.export(node, (_node) =>
      exportChildren(_node, textTransformersIndex, textMatchTransformers),
    )

    if (result != null) {
      return result
    }
  }

  if ($isElementNode(node)) {
    return exportChildren(node, textTransformersIndex, textMatchTransformers)
  } else if ($isDecoratorNode(node)) {
    return node.getTextContent()
  } else {
    return null
  }
}

function exportChildren(
  node: ElementNode,
  textTransformersIndex: Array<TextFormatTransformer>,
  textMatchTransformers: Array<TextMatchTransformer>,
  unclosedTags?: Array<{ format: TextFormatType; tag: string }>,
  unclosableTags?: Array<{ format: TextFormatType; tag: string }>,
): string {
  const output = []
  const children = node.getChildren()
  // keep track of unclosed tags from the very beginning
  if (!unclosedTags) {
    unclosedTags = []
  }
  if (!unclosableTags) {
    unclosableTags = []
  }

  mainLoop: for (const child of children) {
    for (const transformer of textMatchTransformers) {
      if (!transformer.export) {
        continue
      }

      const result = transformer.export(
        child,
        (parentNode) =>
          exportChildren(
            parentNode,
            textTransformersIndex,
            textMatchTransformers,
            unclosedTags,
            // Add current unclosed tags to the list of unclosable tags - we don't want nested tags from
            // textmatch transformers to close the outer ones, as that may result in invalid markdown.
            // E.g. **text [text**](https://lexical.io)
            // is invalid markdown, as the closing ** is inside the link.
            //
            [...unclosableTags, ...unclosedTags],
          ),
        (textNode, textContent) =>
          exportTextFormat(
            textNode,
            textContent,
            textTransformersIndex,
            unclosedTags,
            unclosableTags,
          ),
      )

      if (result != null) {
        output.push(result)
        continue mainLoop
      }
    }

    if ($isLineBreakNode(child)) {
      output.push('\n')
    } else if ($isTextNode(child)) {
      output.push(
        exportTextFormat(
          child,
          child.getTextContent(),
          textTransformersIndex,
          unclosedTags,
          unclosableTags,
        ),
      )
    } else if ($isElementNode(child)) {
      // empty paragraph returns ""
      output.push(
        exportChildren(
          child,
          textTransformersIndex,
          textMatchTransformers,
          unclosedTags,
          unclosableTags,
        ),
      )
    } else if ($isDecoratorNode(child)) {
      output.push(child.getTextContent())
    }
  }

  return output.join('')
}

function exportTextFormat(
  node: TextNode,
  textContent: string,
  textTransformers: Array<TextFormatTransformer>,
  // unclosed tags include the markdown tags that haven't been closed yet, and their associated formats
  unclosedTags: Array<{ format: TextFormatType; tag: string }>,
  unclosableTags?: Array<{ format: TextFormatType; tag: string }>,
): string {
  // This function handles the case of a string looking like this: "   foo   "
  // Where it would be invalid markdown to generate: "**   foo   **"
  // We instead want to trim the whitespace out, apply formatting, and then
  // bring the whitespace back. So our returned string looks like this: "   **foo**   "
  const frozenString = textContent.trim()
  let output = frozenString

  if (!node.hasFormat('code')) {
    // Escape any markdown characters in the text content
    output = output.replace(/([*_`~\\])/g, '\\$1')
  }

  // the opening tags to be added to the result
  let openingTags = ''
  // the closing tags to be added to the result
  let closingTagsBefore = ''
  let closingTagsAfter = ''

  const prevNode = getTextSibling(node, true)
  const nextNode = getTextSibling(node, false)

  const applied = new Set()

  for (const transformer of textTransformers) {
    const format = transformer.format[0]!
    const tag = transformer.tag

    // dedup applied formats
    if (hasFormat(node, format) && !applied.has(format)) {
      // Multiple tags might be used for the same format (*, _)
      applied.add(format)

      // append the tag to openningTags, if it's not applied to the previous nodes,
      // or the nodes before that (which would result in an unclosed tag)
      if (!hasFormat(prevNode, format) || !unclosedTags.find((element) => element.tag === tag)) {
        unclosedTags.push({ format, tag })
        openingTags += tag
      }
    }
  }

  // close any tags in the same order they were applied, if necessary
  for (let i = 0; i < unclosedTags.length; i++) {
    const unclosedTag = unclosedTags[i]!
    const nodeHasFormat = hasFormat(node, unclosedTag.format)
    const nextNodeHasFormat = hasFormat(nextNode, unclosedTag.format)

    // prevent adding closing tag if next sibling will do it
    if (nodeHasFormat && nextNodeHasFormat) {
      continue
    }

    const unhandledUnclosedTags = [...unclosedTags] // Shallow copy to avoid modifying the original array

    while (unhandledUnclosedTags.length > i) {
      const unclosedTag = unhandledUnclosedTags.pop()

      // If tag is unclosable, don't close it and leave it in the original array,
      // So that it can be closed when it's no longer unclosable
      if (
        unclosableTags &&
        unclosedTag &&
        unclosableTags.find((element) => element.tag === unclosedTag.tag)
      ) {
        continue
      }

      if (unclosedTag && typeof unclosedTag.tag === 'string') {
        if (!nodeHasFormat) {
          // Handles cases where the tag has not been closed before, e.g. if the previous node
          // was a text match transformer that did not account for closing tags of the next node (e.g. a link)
          closingTagsBefore += unclosedTag.tag
        } else if (!nextNodeHasFormat) {
          closingTagsAfter += unclosedTag.tag
        }
      }
      // Mutate the original array to remove the closed tag
      unclosedTags.pop()
    }
    break
  }

  output = openingTags + output + closingTagsAfter
  // Replace trimmed version of textContent ensuring surrounding whitespace is not modified
  return closingTagsBefore + textContent.replace(frozenString, () => output)
}

// Get next or previous text sibling a text node, including cases
// when it's a child of inline element (e.g. link)
function getTextSibling(node: TextNode, backward: boolean): null | TextNode {
  let sibling = backward ? node.getPreviousSibling() : node.getNextSibling()

  if (!sibling) {
    const parent = node.getParentOrThrow()

    if (parent.isInline()) {
      sibling = backward ? parent.getPreviousSibling() : parent.getNextSibling()
    }
  }

  while (sibling) {
    if ($isElementNode(sibling)) {
      if (!sibling.isInline()) {
        break
      }

      const descendant = backward ? sibling.getLastDescendant() : sibling.getFirstDescendant()

      if ($isTextNode(descendant)) {
        return descendant
      } else {
        sibling = backward ? sibling.getPreviousSibling() : sibling.getNextSibling()
      }
    }

    if ($isTextNode(sibling)) {
      return sibling
    }

    if (!$isElementNode(sibling)) {
      return null
    }
  }

  return null
}

function hasFormat(node: LexicalNode | null | undefined, format: TextFormatType): boolean {
  return $isTextNode(node) && node.hasFormat(format)
}
```

--------------------------------------------------------------------------------

````
