---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 272
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 272 of 695)

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

---[FILE: markdownTransformer.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/server/markdown/markdownTransformer.ts

```typescript
import type { ElementNode, SerializedLexicalNode } from 'lexical'
import type { Block } from 'payload'

import { $parseSerializedNode } from 'lexical'

import type { NodeWithHooks } from '../../../typesServer.js'

import { getEnabledNodesFromServerNodes } from '../../../../lexical/nodes/index.js'
import {
  type MultilineElementTransformer,
  type TextMatchTransformer,
  type Transformer,
} from '../../../../packages/@lexical/markdown/index.js'
import { extractPropsFromJSXPropsString } from '../../../../utilities/jsx/extractPropsFromJSXPropsString.js'
import { propsToJSXString } from '../../../../utilities/jsx/jsx.js'
import { getLexicalToMarkdown } from '../../client/markdown/getLexicalToMarkdown.js'
import { getMarkdownToLexical } from '../../client/markdown/getMarkdownToLexical.js'
import { $createServerBlockNode, $isServerBlockNode, ServerBlockNode } from '../nodes/BlocksNode.js'
import {
  $createServerInlineBlockNode,
  $isServerInlineBlockNode,
  ServerInlineBlockNode,
} from '../nodes/InlineBlocksNode.js'
import { linesFromStartToContentAndPropsString } from './linesFromMatchToContentAndPropsString.js'

export function createTagRegexes(tagName: string) {
  const escapedTagName = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Regex components
  const openingTag = `<${escapedTagName}`
  const closingTag = `</${escapedTagName}`
  const optionalWhitespace = `\\s*`
  const mandatoryClosingBracket = `>`

  // Assembled regex patterns
  const startPattern = `${openingTag}(?=\\s|>|$)` // Only match the tag name
  const endPattern = `${closingTag}${optionalWhitespace}${mandatoryClosingBracket}`

  return {
    regExpEnd: new RegExp(endPattern, 'i'),
    regExpStart: new RegExp(startPattern, 'i'),
  }
}
export const getBlockMarkdownTransformers = ({
  blocks,
  inlineBlocks,
}: {
  blocks: Block[]
  inlineBlocks: Block[]
}): ((props: {
  allNodes: Array<NodeWithHooks>
  allTransformers: Transformer[]
}) => MultilineElementTransformer | TextMatchTransformer)[] => {
  if (!blocks?.length && !inlineBlocks?.length) {
    return []
  }

  let transformers: ((props: {
    allNodes: Array<NodeWithHooks>
    allTransformers: Transformer[]
  }) => MultilineElementTransformer | TextMatchTransformer)[] = []

  if (blocks?.length) {
    for (const block of blocks) {
      const transformer = getMarkdownTransformerForBlock(block, false)

      if (transformer) {
        transformers = transformers.concat(transformer)
      }
    }
  }

  if (inlineBlocks?.length) {
    for (const block of inlineBlocks) {
      const transformer = getMarkdownTransformerForBlock(block, true)

      if (transformer) {
        transformers = transformers.concat(transformer)
      }
    }
  }

  return transformers
}

function getMarkdownTransformerForBlock(
  block: Block,
  isInlineBlock: boolean,
): Array<
  (props: {
    allNodes: Array<NodeWithHooks>
    allTransformers: Transformer[]
  }) => MultilineElementTransformer | TextMatchTransformer
> | null {
  if (!block.jsx) {
    return null
  }

  const regex = createTagRegexes(block.slug)
  const toReturn: Array<
    (props: {
      allNodes: Array<NodeWithHooks>
      allTransformers: Transformer[]
    }) => MultilineElementTransformer | TextMatchTransformer
  > = []

  if (isInlineBlock) {
    toReturn.push(({ allNodes, allTransformers }) => ({
      type: 'text-match',
      dependencies: [ServerInlineBlockNode],
      export: (node) => {
        if (!$isServerInlineBlockNode(node)) {
          return null
        }

        if (node.getFields()?.blockType?.toLowerCase() !== block.slug.toLowerCase()) {
          return null
        }

        const nodeFields = node.getFields()
        const lexicalToMarkdown = getLexicalToMarkdown(
          getEnabledNodesFromServerNodes({
            nodes: allNodes,
          }),
          allTransformers,
        )

        const exportResult = block.jsx!.export({
          fields: nodeFields,
          lexicalToMarkdown,
        })
        if (exportResult === false) {
          return null
        }
        if (typeof exportResult === 'string') {
          return exportResult
        }

        const hasProps = exportResult.props && Object.keys(exportResult.props)?.length > 0
        const props = exportResult.props ?? {}

        if (exportResult?.children?.length) {
          return `<${nodeFields.blockType}${hasProps ? ' ' + propsToJSXString({ props }) : ''}>${exportResult.children}</${nodeFields.blockType}>`
        }

        return `<${nodeFields.blockType}${hasProps ? ' ' + propsToJSXString({ props }) : ''}/>`
      },
      getEndIndex: (node, match) => {
        const { endlineLastCharIndex } = linesFromStartToContentAndPropsString({
          isEndOptional: false,
          lines: [node.getTextContent()],
          regexpEndRegex: regex.regExpEnd,
          startLineIndex: 0,
          startMatch: match,
          trimChildren: false,
        })

        return endlineLastCharIndex
      },
      importRegExp: block.jsx?.customStartRegex ?? regex.regExpStart,
      regExp: /___ignoreignoreignore___/g,
      replace(node, match) {
        const { content, propsString } = linesFromStartToContentAndPropsString({
          isEndOptional: false,
          lines: [node.getTextContent()],
          regexpEndRegex: regex.regExpEnd,
          startLineIndex: 0,
          startMatch: {
            ...match,
            index: 0,
          },
          trimChildren: false,
        })

        if (!block?.jsx?.import) {
          // No multiline transformer handled this line successfully
          return
        }

        const markdownToLexical = getMarkdownToLexical(
          getEnabledNodesFromServerNodes({
            nodes: allNodes,
          }),
          allTransformers,
        )

        const blockFields = block.jsx.import({
          children: content,
          closeMatch: null,
          htmlToLexical: null, // TODO
          markdownToLexical,
          openMatch: match,
          props: propsString
            ? extractPropsFromJSXPropsString({
                propsString,
              })
            : {},
        })
        if (blockFields === false) {
          return
        }

        const inlineBlockNode = $createServerInlineBlockNode({
          blockType: block.slug,
          ...(blockFields as any),
        })

        node.replace(inlineBlockNode)
      },
    }))

    return toReturn
  }

  toReturn.push(({ allNodes, allTransformers }) => ({
    dependencies: [ServerBlockNode],
    export: (node) => {
      if (!$isServerBlockNode(node)) {
        return null
      }

      if (node.getFields()?.blockType?.toLowerCase() !== block.slug.toLowerCase()) {
        return null
      }

      const nodeFields = node.getFields()
      const lexicalToMarkdown = getLexicalToMarkdown(
        getEnabledNodesFromServerNodes({
          nodes: allNodes,
        }),
        allTransformers,
      )

      const exportResult = block.jsx!.export({
        fields: nodeFields,
        lexicalToMarkdown,
      })
      if (exportResult === false) {
        return null
      }
      if (typeof exportResult === 'string') {
        return exportResult
      }

      const hasProps = exportResult.props && Object.keys(exportResult.props)?.length > 0
      const props = exportResult.props ?? {}

      if (exportResult?.children?.length) {
        const children = exportResult.children
        let sanitizedChildren = ''

        // Ensure it has a leftpad of at least 2 spaces. The data is saved without those spaces, so we can just blindly add it to every child
        if (children.includes('\n')) {
          for (const child of children.split('\n')) {
            let sanitizedChild = ''
            if (!block?.jsx?.doNotTrimChildren && child !== '') {
              sanitizedChild = '  '
            }
            sanitizedChild += child + '\n'

            sanitizedChildren += sanitizedChild
          }
        } else {
          sanitizedChildren = (block?.jsx?.doNotTrimChildren ? '' : '  ') + children + '\n'
        }

        return `<${nodeFields.blockType}${hasProps ? ' ' + propsToJSXString({ props }) : ''}>\n${sanitizedChildren}</${nodeFields.blockType}>`
      }

      return `<${nodeFields.blockType}${hasProps ? ' ' + propsToJSXString({ props }) : ''}/>`
    },
    handleImportAfterStartMatch: block.jsx?.customEndRegex
      ? undefined
      : ({ lines, rootNode, startLineIndex, startMatch, transformer }) => {
          const regexpEndRegex: RegExp | undefined =
            typeof transformer.regExpEnd === 'object' && 'regExp' in transformer.regExpEnd
              ? transformer.regExpEnd.regExp
              : transformer.regExpEnd

          const isEndOptional =
            transformer.regExpEnd &&
            typeof transformer.regExpEnd === 'object' &&
            'optional' in transformer.regExpEnd
              ? transformer.regExpEnd.optional
              : !transformer.regExpEnd

          const {
            afterEndLine,
            beforeStartLine,
            content: unsanitizedContent,
            endLineIndex,
            propsString,
          } = linesFromStartToContentAndPropsString({
            isEndOptional,
            lines,
            regexpEndRegex,
            startLineIndex,
            startMatch,
            trimChildren: false,
          })

          let content = ''

          if (block?.jsx?.doNotTrimChildren) {
            content = unsanitizedContent.endsWith('\n')
              ? unsanitizedContent.slice(0, -1)
              : unsanitizedContent
          } else {
            // Ensure it has a leftpad of at least 2 spaces. The data is saved without those spaces, so we can just blindly add it to every child
            if (unsanitizedContent.includes('\n')) {
              const split = unsanitizedContent.split('\n')
              let index = 0
              for (const child of split) {
                index++

                if (child.startsWith('  ')) {
                  content += child.slice(2)
                } else {
                  // If one child is misaligned, skip aligning completely, unless it's just empty
                  if (child === '') {
                    content += child
                  } else {
                    content = unsanitizedContent.endsWith('\n')
                      ? unsanitizedContent.slice(0, -1)
                      : unsanitizedContent
                    break
                  }
                }

                content += index === split.length ? '' : '\n'
              }
            } else {
              content =
                (!unsanitizedContent.startsWith('  ')
                  ? unsanitizedContent
                  : unsanitizedContent.slice(2)) + '\n'
            }
          }

          if (!block?.jsx?.import) {
            // No multiline transformer handled this line successfully
            return [false, startLineIndex]
          }

          const markdownToLexical = getMarkdownToLexical(
            getEnabledNodesFromServerNodes({
              nodes: allNodes,
            }),
            allTransformers,
          )

          const blockFields = block.jsx.import({
            children: content,
            closeMatch: null,
            htmlToLexical: null, // TODO
            markdownToLexical,
            openMatch: startMatch,
            props: propsString
              ? extractPropsFromJSXPropsString({
                  propsString,
                })
              : {},
          })
          if (blockFields === false) {
            return [false, startLineIndex]
          }

          const node = $createServerBlockNode({
            blockType: block.slug,
            ...blockFields,
          } as any)

          if (node) {
            // Now handle beforeStartLine and afterEndLine. If those are not empty, we need to add them as text nodes before and after the block node.
            // However, those themselves can contain other markdown matches, so we need to parse them as well.
            // Example where this is needed: "Hello <InlineCode>inline code</InlineCode> test."
            let prevNodes: null | SerializedLexicalNode[] = null
            let nextNodes: null | SerializedLexicalNode[] = null
            // TODO: Might not need this prevNodes and nextNodes handling if inline nodes are handled by textmatch transformers

            if (beforeStartLine?.length) {
              prevNodes = markdownToLexical({ markdown: beforeStartLine })?.root?.children ?? []

              const firstPrevNode = prevNodes?.[0]
              if (firstPrevNode) {
                rootNode.append($parseSerializedNode(firstPrevNode))
              }
            }

            rootNode.append(node)

            if (afterEndLine?.length) {
              nextNodes = markdownToLexical({ markdown: afterEndLine })?.root?.children
              const lastChild = rootNode.getChildren()[rootNode.getChildren().length - 1]

              const children = ($parseSerializedNode(nextNodes[0]!) as ElementNode)?.getChildren()
              if (children?.length) {
                for (const child of children) {
                  ;(lastChild as ElementNode).append(child)
                }
              }
            }
          }

          return [true, endLineIndex]
        },
    regExpEnd: block.jsx?.customEndRegex ?? regex.regExpEnd,
    regExpStart: block.jsx?.customStartRegex ?? regex.regExpStart,
    // This replace is ONLY run for ``` code blocks (so any blocks with custom start and end regexes). For others, we use the special JSX handling above:
    type: 'multiline-element',
    replace: (rootNode, children, openMatch, closeMatch, linesInBetween) => {
      if (block?.jsx?.import) {
        if (!linesInBetween) {
          // convert children to linesInBetween
          let line = ''
          if (children) {
            for (const child of children) {
              line += child.getTextContent()
            }
          }

          linesInBetween = [line]
        }

        let childrenString = ''
        if (block?.jsx?.doNotTrimChildren) {
          childrenString = linesInBetween.join('\n')
        } else {
          childrenString = linesInBetween.join('\n').trim()
        }

        const propsString = openMatch[1]?.trim()

        const markdownToLexical = getMarkdownToLexical(
          getEnabledNodesFromServerNodes({
            nodes: allNodes,
          }),
          allTransformers,
        )

        const blockFields = block.jsx.import({
          children: childrenString,
          closeMatch: closeMatch as RegExpMatchArray,
          htmlToLexical: null, // TODO
          markdownToLexical,
          openMatch: openMatch as RegExpMatchArray,
          props: propsString
            ? extractPropsFromJSXPropsString({
                propsString,
              })
            : {},
        })
        if (blockFields === false) {
          return false
        }

        const node = $createServerBlockNode({
          blockType: block.slug,
          ...blockFields,
        } as any)

        if (node) {
          rootNode.append(node)
        }

        return
      }
      return false // Run next transformer
    },
  }))

  return toReturn
}
```

--------------------------------------------------------------------------------

---[FILE: BlocksNode.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/server/nodes/BlocksNode.tsx
Signals: React

```typescript
import type { SerializedDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode.js'
import type { JsonObject } from 'payload'
import type { JSX } from 'react'

import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode.js'
import { addClassNamesToElement } from '@lexical/utils'
import ObjectID from 'bson-objectid'
import {
  $applyNodeReplacement,
  type DOMConversionMap,
  type DOMExportOutput,
  type EditorConfig,
  type ElementFormatType,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
} from 'lexical'

import type { StronglyTypedLeafNode } from '../../../../nodeTypes.js'

type BaseBlockFields<TBlockFields extends JsonObject = JsonObject> = {
  /** Block form data */
  blockName: string
  blockType: string
} & TBlockFields

export type BlockFields<TBlockFields extends JsonObject = JsonObject> = {
  id: string
} & BaseBlockFields<TBlockFields>

export type BlockFieldsOptionalID<TBlockFields extends JsonObject = JsonObject> = {
  id?: string
} & BaseBlockFields<TBlockFields>

export type SerializedBlockNode<TBlockFields extends JsonObject = JsonObject> = {
  fields: BlockFields<TBlockFields>
} & StronglyTypedLeafNode<SerializedDecoratorBlockNode, 'block'>

export class ServerBlockNode extends DecoratorBlockNode {
  __cacheBuster: number
  __fields: BlockFields

  constructor({
    cacheBuster,
    fields,
    format,
    key,
  }: {
    cacheBuster?: number
    fields: BlockFields
    format?: ElementFormatType
    key?: NodeKey
  }) {
    super(format, key)
    this.__fields = fields
    this.__cacheBuster = cacheBuster || 0
  }

  static override clone(node: ServerBlockNode): ServerBlockNode {
    return new this({
      cacheBuster: node.__cacheBuster,
      fields: node.__fields,
      format: node.__format,
      key: node.__key,
    })
  }

  static override getType(): string {
    return 'block'
  }

  static override importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {}
  }

  static override importJSON(serializedNode: SerializedBlockNode): ServerBlockNode {
    if (serializedNode.version === 1) {
      // Convert (version 1 had the fields wrapped in another, unnecessary data property)
      serializedNode = {
        ...serializedNode,
        fields: {
          ...(serializedNode as any).fields.data,
        },
        version: 2,
      }
    }
    const node = $createServerBlockNode(serializedNode.fields)
    node.setFormat(serializedNode.format)
    return node
  }

  static isInline(): false {
    return false
  }

  override createDOM(config?: EditorConfig): HTMLElement {
    const element = document.createElement('div')
    addClassNamesToElement(element, config?.theme?.block)
    return element
  }

  override decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return null as unknown as JSX.Element
  }

  override exportDOM(): DOMExportOutput {
    const element = document.createElement('div')

    const text = document.createTextNode(this.getTextContent())
    element.append(text)
    return { element }
  }

  override exportJSON(): SerializedBlockNode {
    return {
      ...super.exportJSON(),
      type: 'block',
      fields: this.getFields(),
      version: 2,
    }
  }

  getCacheBuster(): number {
    return this.getLatest().__cacheBuster
  }

  getFields(): BlockFields {
    return this.getLatest().__fields
  }

  override getTextContent(): string {
    return `Block Field`
  }

  setFields(fields: BlockFields, preventFormStateUpdate?: boolean): void {
    const writable = this.getWritable()
    writable.__fields = fields
    if (!preventFormStateUpdate) {
      writable.__cacheBuster++
    }
  }
}

export function $createServerBlockNode(fields: BlockFieldsOptionalID): ServerBlockNode {
  return $applyNodeReplacement(
    new ServerBlockNode({
      fields: {
        ...fields,
        id: fields?.id || new ObjectID.default().toHexString(),
      },
    }),
  )
}

export function $isServerBlockNode(
  node: LexicalNode | null | ServerBlockNode | undefined,
): node is ServerBlockNode {
  return node instanceof ServerBlockNode
}
```

--------------------------------------------------------------------------------

---[FILE: InlineBlocksNode.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/server/nodes/InlineBlocksNode.tsx
Signals: React

```typescript
import type {
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from 'lexical'
import type { JsonObject } from 'payload'
import type React from 'react'
import type { JSX } from 'react'

import { addClassNamesToElement } from '@lexical/utils'
import ObjectID from 'bson-objectid'
import { $applyNodeReplacement, DecoratorNode } from 'lexical'

import type { StronglyTypedLeafNode } from '../../../../nodeTypes.js'

export type InlineBlockFields<TInlineBlockFields extends JsonObject = JsonObject> = {
  blockType: string
  id: string
} & TInlineBlockFields

export type SerializedInlineBlockNode<TBlockFields extends JsonObject = JsonObject> = {
  fields: InlineBlockFields<TBlockFields>
} & StronglyTypedLeafNode<SerializedLexicalNode, 'inlineBlock'>

export class ServerInlineBlockNode extends DecoratorNode<null | React.ReactElement> {
  __cacheBuster: number
  __fields: InlineBlockFields

  constructor({
    cacheBuster,
    fields,
    key,
  }: {
    cacheBuster?: number
    fields: InlineBlockFields
    key?: NodeKey
  }) {
    super(key)
    this.__fields = fields
    this.__cacheBuster = cacheBuster || 0
  }

  static override clone(node: ServerInlineBlockNode): ServerInlineBlockNode {
    return new this({
      cacheBuster: node.__cacheBuster,
      fields: node.__fields,
      key: node.__key,
    })
  }

  static override getType(): string {
    return 'inlineBlock'
  }

  static override importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {}
  }

  static override importJSON(serializedNode: SerializedInlineBlockNode): ServerInlineBlockNode {
    const node = $createServerInlineBlockNode(serializedNode.fields)
    return node
  }

  static isInline(): false {
    return false
  }

  canIndent() {
    return true
  }

  override createDOM(config?: EditorConfig): HTMLElement {
    const element = document.createElement('span')
    addClassNamesToElement(element, config?.theme?.inlineBlock)
    return element
  }

  override decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element | null {
    return null
  }

  override exportDOM(): DOMExportOutput {
    const element = document.createElement('span')
    element.classList.add('inline-block-container')

    const text = document.createTextNode(this.getTextContent())
    element.append(text)
    return { element }
  }

  override exportJSON(): SerializedInlineBlockNode {
    return {
      type: 'inlineBlock',
      fields: this.getFields(),
      version: 1,
    }
  }

  getCacheBuster(): number {
    return this.getLatest().__cacheBuster
  }

  getFields(): InlineBlockFields {
    return this.getLatest().__fields
  }

  override getTextContent(): string {
    return `Block Field`
  }

  override isInline() {
    return true
  }

  setFields(fields: InlineBlockFields, preventFormStateUpdate?: boolean): void {
    const writable = this.getWritable()
    writable.__fields = fields
    if (!preventFormStateUpdate) {
      writable.__cacheBuster++
    }
  }

  override updateDOM(): boolean {
    return false
  }
}

export function $createServerInlineBlockNode(
  fields: Exclude<InlineBlockFields, 'id'>,
): ServerInlineBlockNode {
  return $applyNodeReplacement(
    new ServerInlineBlockNode({
      fields: {
        ...fields,
        id: fields?.id || new ObjectID.default().toHexString(),
      },
    }),
  )
}

export function $isServerInlineBlockNode(
  node: LexicalNode | null | ServerInlineBlockNode | undefined,
): node is ServerInlineBlockNode {
  return node instanceof ServerInlineBlockNode
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/htmlToLexical/index.ts

```typescript
import { createHeadlessEditor } from '@lexical/headless'
import { $getRoot, $getSelection, type SerializedLexicalNode } from 'lexical'

import type { SanitizedServerEditorConfig } from '../../../lexical/config/types.js'
import type { DefaultNodeTypes, TypedEditorState } from '../../../nodeTypes.js'

import { getEnabledNodes } from '../../../lexical/nodes/index.js'
import { $generateNodesFromDOM } from '../../../lexical-proxy/@lexical-html.js'

export const convertHTMLToLexical = <TNodeTypes extends SerializedLexicalNode = DefaultNodeTypes>({
  editorConfig,
  html,
  JSDOM,
}: {
  editorConfig: SanitizedServerEditorConfig
  html: string
  JSDOM: new (html: string) => {
    window: {
      document: Document
    }
  }
}): TypedEditorState<TNodeTypes> => {
  const headlessEditor = createHeadlessEditor({
    nodes: getEnabledNodes({
      editorConfig,
    }),
  })

  headlessEditor.update(
    () => {
      const dom = new JSDOM(html)

      const nodes = $generateNodesFromDOM(headlessEditor, dom.window.document)

      $getRoot().select()

      const selection = $getSelection()
      if (selection === null) {
        throw new Error('Selection is null')
      }
      selection.insertNodes(nodes)
    },
    { discrete: true },
  )

  const editorJSON = headlessEditor.getEditorState().toJSON()

  return editorJSON as TypedEditorState<TNodeTypes>
}
```

--------------------------------------------------------------------------------

---[FILE: defaultConverters.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/defaultConverters.ts

```typescript
import type { DefaultNodeTypes } from '../../../../nodeTypes.js'
import type { HTMLConvertersAsync } from './types.js'

import { BlockquoteHTMLConverterAsync } from './converters/blockquote.js'
import { HeadingHTMLConverterAsync } from './converters/heading.js'
import { HorizontalRuleHTMLConverterAsync } from './converters/horizontalRule.js'
import { LinebreakHTMLConverterAsync } from './converters/linebreak.js'
import { LinkHTMLConverterAsync } from './converters/link.js'
import { ListHTMLConverterAsync } from './converters/list.js'
import { ParagraphHTMLConverterAsync } from './converters/paragraph.js'
import { TabHTMLConverterAsync } from './converters/tab.js'
import { TableHTMLConverterAsync } from './converters/table.js'
import { TextHTMLConverterAsync } from './converters/text.js'
import { UploadHTMLConverterAsync } from './converters/upload.js'

export const defaultHTMLConvertersAsync: HTMLConvertersAsync<DefaultNodeTypes> = {
  ...ParagraphHTMLConverterAsync,
  ...TextHTMLConverterAsync,
  ...LinebreakHTMLConverterAsync,
  ...BlockquoteHTMLConverterAsync,
  ...TableHTMLConverterAsync,
  ...HeadingHTMLConverterAsync,
  ...HorizontalRuleHTMLConverterAsync,
  ...ListHTMLConverterAsync,
  ...LinkHTMLConverterAsync({}),
  ...UploadHTMLConverterAsync,
  ...TabHTMLConverterAsync,
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/index.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'

import type { SerializedLexicalNodeWithParent } from '../shared/types.js'
import type {
  HTMLConverterAsync,
  HTMLConvertersAsync,
  HTMLConvertersFunctionAsync,
  HTMLPopulateFn,
} from './types.js'

import { hasText } from '../../../../validate/hasText.js'
import { findConverterForNode } from '../shared/findConverterForNode.js'
import { defaultHTMLConvertersAsync } from './defaultConverters.js'

export type ConvertLexicalToHTMLAsyncArgs = {
  /**
   * Override class names for the container.
   */
  className?: string
  converters?: HTMLConvertersAsync | HTMLConvertersFunctionAsync
  data: SerializedEditorState
  /**
   * If true, removes the container div wrapper.
   */
  disableContainer?: boolean
  /**
   * If true, disables indentation globally. If an array, disables for specific node `type` values.
   */
  disableIndent?: boolean | string[]
  /**
   * If true, disables text alignment globally. If an array, disables for specific node `type` values.
   */
  disableTextAlign?: boolean | string[]
  populate?: HTMLPopulateFn
}

export async function convertLexicalToHTMLAsync({
  className,
  converters,
  data,
  disableContainer,
  disableIndent,
  disableTextAlign,
  populate,
}: ConvertLexicalToHTMLAsyncArgs): Promise<string> {
  if (hasText(data)) {
    let finalConverters: HTMLConvertersAsync = {}
    if (converters) {
      if (typeof converters === 'function') {
        finalConverters = converters({ defaultConverters: defaultHTMLConvertersAsync })
      } else {
        finalConverters = converters
      }
    } else {
      finalConverters = defaultHTMLConvertersAsync
    }

    const html = (
      await convertLexicalNodesToHTMLAsync({
        converters: finalConverters,
        disableIndent,
        disableTextAlign,
        nodes: data?.root?.children,
        parent: data?.root,
        populate,
      })
    ).join('')

    if (disableContainer) {
      return html
    } else {
      return `<div class="${className ?? 'payload-richtext'}">${html}</div>`
    }
  }
  if (disableContainer) {
    return ''
  } else {
    return `<div class="${className ?? 'payload-richtext'}"></div>`
  }
}

export async function convertLexicalNodesToHTMLAsync({
  converters,
  disableIndent,
  disableTextAlign,
  nodes,
  parent,
  populate,
}: {
  converters: HTMLConvertersAsync
  disableIndent?: boolean | string[]
  disableTextAlign?: boolean | string[]
  nodes: SerializedLexicalNode[]
  parent: SerializedLexicalNodeWithParent
  populate?: HTMLPopulateFn
}): Promise<string[]> {
  const unknownConverter: HTMLConverterAsync<any> = converters.unknown as HTMLConverterAsync<any>

  const htmlArray: string[] = []

  let i = -1
  for (const node of nodes) {
    i++
    const { converterForNode, providedCSSString, providedStyleTag } = findConverterForNode({
      converters,
      disableIndent,
      disableTextAlign,
      node,
      unknownConverter,
    })

    try {
      let nodeHTML: string

      if (converterForNode) {
        const converted =
          typeof converterForNode === 'function'
            ? await converterForNode({
                childIndex: i,
                converters,
                node,
                populate,

                nodesToHTML: async (args) => {
                  return await convertLexicalNodesToHTMLAsync({
                    converters: args.converters ?? converters,
                    disableIndent: args.disableIndent ?? disableIndent,
                    disableTextAlign: args.disableTextAlign ?? disableTextAlign,
                    nodes: args.nodes,
                    parent: args.parent ?? {
                      ...node,
                      parent,
                    },
                    populate,
                  })
                },
                parent,
                providedCSSString,
                providedStyleTag,
              })
            : converterForNode
        nodeHTML = converted
      } else {
        nodeHTML = '<span>unknown node</span>'
      }

      htmlArray.push(nodeHTML)
    } catch (error) {
      console.error('Error converting lexical node to HTML:', error, 'node:', node)
      htmlArray.push('')
    }
  }

  return htmlArray.filter(Boolean)
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/types.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'
import type { SelectType, TypeWithID } from 'payload'

import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '../../../../nodeTypes.js'
import type { SerializedLexicalNodeWithParent } from '../shared/types.js'
export type HTMLPopulateArguments = {
  collectionSlug: string
  id: number | string
  select?: SelectType
}

export type HTMLPopulateFn = <TData extends object = TypeWithID>(
  args: HTMLPopulateArguments,
) => Promise<TData | undefined>

export type HTMLConverterAsync<
  T extends { [key: string]: any; type?: string } = SerializedLexicalNode,
> =
  | ((args: {
      childIndex: number
      converters: HTMLConvertersAsync
      node: T
      nodesToHTML: (args: {
        converters?: HTMLConvertersAsync
        disableIndent?: boolean | string[]
        disableTextAlign?: boolean | string[]
        nodes: SerializedLexicalNode[]
        parent?: SerializedLexicalNodeWithParent
      }) => Promise<string[]>
      parent: SerializedLexicalNodeWithParent
      populate?: HTMLPopulateFn
      providedCSSString: string
      providedStyleTag: string
    }) => Promise<string> | string)
  | string

export type HTMLConvertersAsync<
  T extends { [key: string]: any; type?: string } =
    | DefaultNodeTypes
    | SerializedBlockNode<{ blockName?: null | string; blockType: string }> // need these to ensure types for blocks and inlineBlocks work if no generics are provided
    | SerializedInlineBlockNode<{ blockName?: null | string; blockType: string }>, // need these to ensure types for blocks and inlineBlocks work if no generics are provided
> = {
  [key: string]:
    | {
        [blockSlug: string]: HTMLConverterAsync<any>
      }
    | HTMLConverterAsync<any>
    | undefined
} & {
  [nodeType in Exclude<NonNullable<T['type']>, 'block' | 'inlineBlock'>]?: HTMLConverterAsync<
    Extract<T, { type: nodeType }>
  >
} & {
  blocks?: {
    [K in Extract<
      Extract<T, { type: 'block' }> extends SerializedBlockNode<infer B>
        ? B extends { blockType: string }
          ? B['blockType']
          : never
        : never,
      string
    >]?: HTMLConverterAsync<
      Extract<T, { type: 'block' }> extends SerializedBlockNode<infer B>
        ? SerializedBlockNode<Extract<B, { blockType: K }>>
        : SerializedBlockNode
    >
  }
  inlineBlocks?: {
    [K in Extract<
      Extract<T, { type: 'inlineBlock' }> extends SerializedInlineBlockNode<infer B>
        ? B extends { blockType: string }
          ? B['blockType']
          : never
        : never,
      string
    >]?: HTMLConverterAsync<
      Extract<T, { type: 'inlineBlock' }> extends SerializedInlineBlockNode<infer B>
        ? SerializedInlineBlockNode<Extract<B, { blockType: K }>>
        : SerializedInlineBlockNode
    >
  }
  unknown?: HTMLConverterAsync<SerializedLexicalNode>
}

export type HTMLConvertersFunctionAsync<
  T extends { [key: string]: any; type?: string } =
    | DefaultNodeTypes
    | SerializedBlockNode<{ blockName?: null | string }>
    | SerializedInlineBlockNode<{ blockName?: null | string; blockType: string }>,
> = (args: { defaultConverters: HTMLConvertersAsync<DefaultNodeTypes> }) => HTMLConvertersAsync<T>
```

--------------------------------------------------------------------------------

---[FILE: blockquote.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/converters/blockquote.ts

```typescript
import type { SerializedQuoteNode } from '../../../../../nodeTypes.js'
import type { HTMLConvertersAsync } from '../types.js'

export const BlockquoteHTMLConverterAsync: HTMLConvertersAsync<SerializedQuoteNode> = {
  quote: async ({ node, nodesToHTML, providedStyleTag }) => {
    const children = (
      await nodesToHTML({
        nodes: node.children,
      })
    ).join('')

    return `<blockquote${providedStyleTag}>${children}</blockquote>`
  },
}
```

--------------------------------------------------------------------------------

---[FILE: heading.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/converters/heading.ts

```typescript
import type { SerializedHeadingNode } from '../../../../../nodeTypes.js'
import type { HTMLConvertersAsync } from '../types.js'

export const HeadingHTMLConverterAsync: HTMLConvertersAsync<SerializedHeadingNode> = {
  heading: async ({ node, nodesToHTML, providedStyleTag }) => {
    const children = (
      await nodesToHTML({
        nodes: node.children,
      })
    ).join('')

    return `<${node.tag}${providedStyleTag}>${children}</${node.tag}>`
  },
}
```

--------------------------------------------------------------------------------

---[FILE: horizontalRule.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/converters/horizontalRule.ts

```typescript
import type { SerializedHorizontalRuleNode } from '../../../../../nodeTypes.js'
import type { HTMLConvertersAsync } from '../types.js'
export const HorizontalRuleHTMLConverterAsync: HTMLConvertersAsync<SerializedHorizontalRuleNode> = {
  horizontalrule: '<hr />',
}
```

--------------------------------------------------------------------------------

---[FILE: linebreak.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/converters/linebreak.ts

```typescript
import type { SerializedLineBreakNode } from '../../../../../nodeTypes.js'
import type { HTMLConvertersAsync } from '../types.js'

export const LinebreakHTMLConverterAsync: HTMLConvertersAsync<SerializedLineBreakNode> = {
  linebreak: '<br />',
}
```

--------------------------------------------------------------------------------

---[FILE: link.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/converters/link.ts

```typescript
import type { SerializedAutoLinkNode, SerializedLinkNode } from '../../../../../nodeTypes.js'
import type { HTMLConvertersAsync, HTMLPopulateFn } from '../types.js'

export const LinkHTMLConverterAsync: (args: {
  internalDocToHref?: (args: {
    linkNode: SerializedLinkNode
    populate?: HTMLPopulateFn
  }) => Promise<string> | string
}) => HTMLConvertersAsync<SerializedAutoLinkNode | SerializedLinkNode> = ({
  internalDocToHref,
}) => ({
  autolink: async ({ node, nodesToHTML, providedStyleTag }) => {
    const children = (
      await nodesToHTML({
        nodes: node.children,
      })
    ).join('')

    return `<a${providedStyleTag} href="${node.fields.url}"${node.fields.newTab ? ' rel="noopener noreferrer" target="_blank"' : ''}>${children}</a>`
  },
  link: async ({ node, nodesToHTML, populate, providedStyleTag }) => {
    const children = (
      await nodesToHTML({
        nodes: node.children,
      })
    ).join('')

    let href: string = node.fields.url ?? ''
    if (node.fields.linkType === 'internal') {
      if (internalDocToHref) {
        href = await internalDocToHref({ linkNode: node, populate })
      } else {
        console.error(
          'Lexical => HTML converter: Link converter: found internal link, but internalDocToHref is not provided',
        )
        href = '#' // fallback
      }
    }

    return `<a${providedStyleTag} href="${href}"${node.fields.newTab ? ' rel="noopener noreferrer" target="_blank"' : ''}>${children}</a>`
  },
})
```

--------------------------------------------------------------------------------

````
