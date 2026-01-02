---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 270
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 270 of 695)

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

---[FILE: InlineBlockContainer.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/componentInline/components/InlineBlockContainer.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { useInlineBlockComponentContext } from '../index.js'

export const InlineBlockContainer = ({ children }: { children: React.ReactNode }) => {
  const { InlineBlockContainer } = useInlineBlockComponentContext()

  return InlineBlockContainer ? <InlineBlockContainer>{children}</InlineBlockContainer> : null
}
```

--------------------------------------------------------------------------------

---[FILE: InlineBlockEditButton.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/componentInline/components/InlineBlockEditButton.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { useInlineBlockComponentContext } from '../index.js'

export const InlineBlockEditButton = () => {
  const { EditButton } = useInlineBlockComponentContext()

  return EditButton ? <EditButton /> : null
}
```

--------------------------------------------------------------------------------

---[FILE: InlineBlockLabel.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/componentInline/components/InlineBlockLabel.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { useInlineBlockComponentContext } from '../index.js'

export const InlineBlockLabel = () => {
  const { Label } = useInlineBlockComponentContext()

  return Label ? <Label /> : null
}
```

--------------------------------------------------------------------------------

---[FILE: InlineBlockRemoveButton.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/componentInline/components/InlineBlockRemoveButton.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { useInlineBlockComponentContext } from '../index.js'

export const InlineBlockRemoveButton = () => {
  const { RemoveButton } = useInlineBlockComponentContext()

  return RemoveButton ? <RemoveButton /> : null
}
```

--------------------------------------------------------------------------------

---[FILE: getLexicalToMarkdown.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/markdown/getLexicalToMarkdown.ts

```typescript
import type { Klass, LexicalNode, LexicalNodeReplacement } from 'lexical'

import { createHeadlessEditor } from '@lexical/headless'

import {
  $convertToMarkdownString,
  type Transformer,
} from '../../../../packages/@lexical/markdown/index.js'

export function getLexicalToMarkdown(
  allNodes: Array<Klass<LexicalNode> | LexicalNodeReplacement>,
  allTransformers: Transformer[],
): (args: { editorState: Record<string, any> }) => string {
  const lexicalToMarkdown = ({ editorState }: { editorState: Record<string, any> }): string => {
    const headlessEditor = createHeadlessEditor({
      nodes: allNodes,
    })

    try {
      headlessEditor.setEditorState(headlessEditor.parseEditorState(editorState as any)) // This should commit the editor state immediately
    } catch (e) {
      console.error('getLexicalToMarkdown: ERROR parsing editor state', e)
    }

    let markdown: string = ''
    headlessEditor.getEditorState().read(() => {
      markdown = $convertToMarkdownString(allTransformers)
    })

    return markdown
  }
  return lexicalToMarkdown
}
```

--------------------------------------------------------------------------------

---[FILE: getMarkdownToLexical.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/markdown/getMarkdownToLexical.ts

```typescript
import type { Klass, LexicalNode, LexicalNodeReplacement, SerializedEditorState } from 'lexical'

import { createHeadlessEditor } from '@lexical/headless'

import {
  $convertFromMarkdownString,
  type Transformer,
} from '../../../../packages/@lexical/markdown/index.js'

export function getMarkdownToLexical(
  allNodes: Array<Klass<LexicalNode> | LexicalNodeReplacement>,
  allTransformers: Transformer[],
): (args: { markdown: string }) => SerializedEditorState {
  const markdownToLexical = ({ markdown }: { markdown: string }): SerializedEditorState => {
    const headlessEditor = createHeadlessEditor({
      nodes: allNodes,
    })

    headlessEditor.update(
      () => {
        $convertFromMarkdownString(markdown, allTransformers)
      },
      { discrete: true },
    )

    const editorJSON = headlessEditor.getEditorState().toJSON()

    return editorJSON
  }
  return markdownToLexical
}
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformer.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/markdown/markdownTransformer.ts

```typescript
import type { ClientBlock } from 'payload'

import {
  $parseSerializedNode,
  type ElementNode,
  type Klass,
  type LexicalNode,
  type LexicalNodeReplacement,
  type SerializedLexicalNode,
} from 'lexical'

import type { Transformer } from '../../../../packages/@lexical/markdown/index.js'
import type {
  MultilineElementTransformer,
  TextMatchTransformer,
} from '../../../../packages/@lexical/markdown/MarkdownTransformers.js'

import { extractPropsFromJSXPropsString } from '../../../../utilities/jsx/extractPropsFromJSXPropsString.js'
import { propsToJSXString } from '../../../../utilities/jsx/jsx.js'
import { linesFromStartToContentAndPropsString } from '../../server/markdown/linesFromMatchToContentAndPropsString.js'
import { $createBlockNode, $isBlockNode, BlockNode } from '../nodes/BlocksNode.js'
import {
  $createInlineBlockNode,
  $isInlineBlockNode,
  InlineBlockNode,
} from '../nodes/InlineBlocksNode.js'
import { getLexicalToMarkdown } from './getLexicalToMarkdown.js'
import { getMarkdownToLexical } from './getMarkdownToLexical.js'

function createTagRegexes(tagName: string) {
  const escapedTagName = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return {
    regExpEnd: new RegExp(`</(${escapedTagName})\\s*>|<${escapedTagName}[^>]*?/>`, 'i'),
    regExpStart: new RegExp(`<(${escapedTagName})([^>]*?)\\s*(/?)>`, 'i'),
  }
}
export const getBlockMarkdownTransformers = ({
  blocks,
  inlineBlocks,
}: {
  blocks: ClientBlock[]
  inlineBlocks: ClientBlock[]
}): ((props: {
  allNodes: Array<Klass<LexicalNode> | LexicalNodeReplacement>
  allTransformers: Transformer[]
}) => MultilineElementTransformer | TextMatchTransformer)[] => {
  if (!blocks?.length && !inlineBlocks?.length) {
    return []
  }
  let transformers: ((props: {
    allNodes: Array<Klass<LexicalNode> | LexicalNodeReplacement>
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
  block: ClientBlock,
  isInlineBlock: boolean,
): Array<
  (props: {
    allNodes: Array<Klass<LexicalNode> | LexicalNodeReplacement>
    allTransformers: Transformer[]
  }) => MultilineElementTransformer | TextMatchTransformer
> | null {
  if (!block.jsx) {
    return null
  }
  const regex = createTagRegexes(block.slug)
  const toReturn: Array<
    (props: {
      allNodes: Array<Klass<LexicalNode> | LexicalNodeReplacement>
      allTransformers: Transformer[]
    }) => MultilineElementTransformer | TextMatchTransformer
  > = []

  if (isInlineBlock) {
    toReturn.push(({ allNodes, allTransformers }) => ({
      type: 'text-match',
      dependencies: [InlineBlockNode],
      export: (node) => {
        if (!$isInlineBlockNode(node)) {
          return null
        }

        if (node.getFields()?.blockType?.toLowerCase() !== block.slug.toLowerCase()) {
          return null
        }

        const nodeFields = node.getFields()
        const lexicalToMarkdown = getLexicalToMarkdown(allNodes, allTransformers)

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

        const markdownToLexical = getMarkdownToLexical(allNodes, allTransformers)

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

        const inlineBlockNode = $createInlineBlockNode({
          blockType: block.slug,
          ...(blockFields as any),
        })

        node.replace(inlineBlockNode)
      },
    }))

    return toReturn
  }

  toReturn.push(({ allNodes, allTransformers }) => ({
    dependencies: [BlockNode],
    export: (node) => {
      if (!$isBlockNode(node)) {
        return null
      }

      if (node.getFields()?.blockType?.toLowerCase() !== block.slug.toLowerCase()) {
        return null
      }

      const nodeFields = node.getFields()
      const lexicalToMarkdown = getLexicalToMarkdown(allNodes, allTransformers)

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

          const markdownToLexical = getMarkdownToLexical(allNodes, allTransformers)

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

          const node = $createBlockNode({
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

        const markdownToLexical = getMarkdownToLexical(allNodes, allTransformers)

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

        const node = $createBlockNode({
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
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/nodes/BlocksNode.tsx
Signals: React

```typescript
'use client'
import ObjectID from 'bson-objectid'
import {
  $applyNodeReplacement,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
} from 'lexical'
import React, { type JSX } from 'react'

import type { BlockFieldsOptionalID, SerializedBlockNode } from '../../server/nodes/BlocksNode.js'

import { ServerBlockNode } from '../../server/nodes/BlocksNode.js'
import { BlockComponent } from '../component/index.js'

export class BlockNode extends ServerBlockNode {
  static override clone(node: ServerBlockNode): ServerBlockNode {
    return super.clone(node)
  }

  static override getType(): string {
    return super.getType()
  }

  static override importJSON(serializedNode: SerializedBlockNode): BlockNode {
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
    const node = $createBlockNode(serializedNode.fields)
    node.setFormat(serializedNode.format)
    return node
  }

  override decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return (
      <BlockComponent
        cacheBuster={this.getCacheBuster()}
        className={config.theme.block ?? 'LexicalEditorTheme__block'}
        formData={this.getFields()}
        nodeKey={this.getKey()}
      />
    )
  }

  override exportJSON(): SerializedBlockNode {
    return super.exportJSON()
  }
}

export function $createBlockNode(fields: BlockFieldsOptionalID): BlockNode {
  return $applyNodeReplacement(
    new BlockNode({
      fields: {
        ...fields,
        id: fields?.id || new ObjectID.default().toHexString(),
      },
    }),
  )
}

export function $isBlockNode(node: BlockNode | LexicalNode | null | undefined): node is BlockNode {
  return node instanceof BlockNode
}
```

--------------------------------------------------------------------------------

---[FILE: InlineBlocksNode.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/nodes/InlineBlocksNode.tsx
Signals: React

```typescript
'use client'
import ObjectID from 'bson-objectid'
import {
  $applyNodeReplacement,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
} from 'lexical'
import React, { type JSX } from 'react'

import type {
  InlineBlockFields,
  SerializedInlineBlockNode,
} from '../../server/nodes/InlineBlocksNode.js'

import { ServerInlineBlockNode } from '../../server/nodes/InlineBlocksNode.js'

const InlineBlockComponent = React.lazy(() =>
  import('../componentInline/index.js').then((module) => ({
    default: module.InlineBlockComponent,
  })),
)

export class InlineBlockNode extends ServerInlineBlockNode {
  static override clone(node: ServerInlineBlockNode): ServerInlineBlockNode {
    return super.clone(node)
  }

  static override getType(): string {
    return super.getType()
  }

  static override importJSON(serializedNode: SerializedInlineBlockNode): InlineBlockNode {
    const node = $createInlineBlockNode(serializedNode.fields)
    return node
  }

  override decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return (
      <InlineBlockComponent
        cacheBuster={this.getCacheBuster()}
        className={config.theme.inlineBlock ?? 'LexicalEditorTheme__inlineBlock'}
        formData={this.getFields()}
        nodeKey={this.getKey()}
      />
    )
  }

  override exportJSON(): SerializedInlineBlockNode {
    return super.exportJSON()
  }
}

export function $createInlineBlockNode(fields: Exclude<InlineBlockFields, 'id'>): InlineBlockNode {
  return $applyNodeReplacement(
    new InlineBlockNode({
      fields: {
        ...fields,
        id: fields?.id || new ObjectID.default().toHexString(),
      },
    }),
  )
}

export function $isInlineBlockNode(
  node: InlineBlockNode | LexicalNode | null | undefined,
): node is InlineBlockNode {
  return node instanceof InlineBlockNode
}
```

--------------------------------------------------------------------------------

---[FILE: commands.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/plugin/commands.ts

```typescript
'use client'
import type { LexicalCommand } from 'lexical'

import { createCommand } from 'lexical'

import type { InsertBlockPayload } from './index.js'

export const INSERT_BLOCK_COMMAND: LexicalCommand<InsertBlockPayload> =
  createCommand('INSERT_BLOCK_COMMAND')

export const INSERT_INLINE_BLOCK_COMMAND: LexicalCommand<Partial<InsertBlockPayload>> =
  createCommand('INSERT_INLINE_BLOCK_COMMAND')
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/plugin/index.tsx
Signals: React

```typescript
'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { $insertNodeToNearestRoot, $wrapNodeInElement, mergeRegister } from '@lexical/utils'
import { formatDrawerSlug, useEditDepth } from '@payloadcms/ui'
import {
  $createParagraphNode,
  $getNodeByKey,
  $getPreviousSelection,
  $getSelection,
  $insertNodes,
  $isParagraphNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical'
import { useEffect, useState } from 'react'

import type { PluginComponent } from '../../../typesClient.js'
import type { BlockFields, BlockFieldsOptionalID } from '../../server/nodes/BlocksNode.js'

import { useEditorConfigContext } from '../../../../lexical/config/client/EditorConfigProvider.js'
import { useLexicalDrawer } from '../../../../utilities/fieldsDrawer/useLexicalDrawer.js'
import { $createBlockNode, BlockNode } from '../nodes/BlocksNode.js'
import { $createInlineBlockNode, $isInlineBlockNode } from '../nodes/InlineBlocksNode.js'
import { INSERT_BLOCK_COMMAND, INSERT_INLINE_BLOCK_COMMAND } from './commands.js'

export type InsertBlockPayload = BlockFieldsOptionalID

export const BlocksPlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext()

  const [targetNodeKey, setTargetNodeKey] = useState<null | string>(null)

  const { setCreatedInlineBlock, uuid } = useEditorConfigContext()
  const editDepth = useEditDepth()

  const drawerSlug = formatDrawerSlug({
    slug: `lexical-inlineBlocks-create-` + uuid,
    depth: editDepth,
  })

  const { toggleDrawer } = useLexicalDrawer(drawerSlug, true)

  useEffect(() => {
    if (!editor.hasNodes([BlockNode])) {
      throw new Error('BlocksPlugin: BlocksNode not registered on editor')
    }

    return mergeRegister(
      editor.registerCommand<InsertBlockPayload>(
        INSERT_BLOCK_COMMAND,
        (payload: InsertBlockPayload) => {
          editor.update(() => {
            const selection = $getSelection() || $getPreviousSelection()

            if ($isRangeSelection(selection)) {
              const blockNode = $createBlockNode(payload)

              // we need to get the focus node before inserting the block node, as $insertNodeToNearestRoot can change the focus node
              const { focus } = selection
              const focusNode = focus.getNode()
              // Insert blocks node BEFORE potentially removing focusNode, as $insertNodeToNearestRoot errors if the focusNode doesn't exist
              $insertNodeToNearestRoot(blockNode)

              // Delete the node it it's an empty paragraph
              if ($isParagraphNode(focusNode) && !focusNode.__first) {
                focusNode.remove()
              }
            }
          })

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        INSERT_INLINE_BLOCK_COMMAND,
        (fields) => {
          if (targetNodeKey) {
            const node = $getNodeByKey(targetNodeKey)

            if (!node || !$isInlineBlockNode(node)) {
              return false
            }

            node.setFields(fields as BlockFields)

            setTargetNodeKey(null)
            return true
          }

          const inlineBlockNode = $createInlineBlockNode(fields as BlockFields)
          setCreatedInlineBlock?.(inlineBlockNode)
          $insertNodes([inlineBlockNode])
          if ($isRootOrShadowRoot(inlineBlockNode.getParentOrThrow())) {
            $wrapNodeInElement(inlineBlockNode, $createParagraphNode).selectEnd()
          }

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor, setCreatedInlineBlock, targetNodeKey, toggleDrawer])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/premade/CodeBlock/converter.ts

```typescript
import type { BlockJSX } from 'payload'

/**
 * @internal
 * @experimental - API may change in minor releases
 */
export const codeConverter: BlockJSX = {
  customEndRegex: {
    optional: true,
    regExp: /[ \t]*```$/,
  },
  customStartRegex: /^[ \t]*```(\w+)?/,
  doNotTrimChildren: true,
  export: ({ fields }) => {
    const isSingleLine = !fields.code.includes('\n') && !fields.language?.length
    if (isSingleLine) {
      return '```' + fields.code + '```'
    }

    return '```' + (fields.language || '') + (fields.code ? '\n' + fields.code : '') + '\n' + '```'
  },
  import: ({ children, closeMatch, openMatch }) => {
    const language = openMatch?.[1]

    // Removed first and last \n from children if present
    if (children.startsWith('\n')) {
      children = children.slice(1)
    }
    if (children.endsWith('\n')) {
      children = children.slice(0, -1)
    }

    const isSingleLineAndComplete =
      !!closeMatch && !children.includes('\n') && openMatch?.input?.trim() !== '```' + language

    if (isSingleLineAndComplete) {
      return {
        code: language + (children?.length ? children : ''), // No need to add space to children as they are not trimmed
        language: '',
      }
    }

    return {
      code: children,
      language,
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: converterClient.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/premade/CodeBlock/converterClient.ts

```typescript
'use client'

export { codeConverter as codeConverterClient } from './converter.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/premade/CodeBlock/index.ts

```typescript
import type { Block } from 'payload'

import type { AdditionalCodeComponentProps } from './Component/Code.js'

import { defaultLanguages } from './Component/defaultLanguages.js'
import { codeConverter } from './converter.js'

/**
 * @experimental - this API may change in future, minor releases
 */
export const CodeBlock: (
  args?: {
    fieldOverrides?: Partial<Block>
  } & AdditionalCodeComponentProps,
) => Block = (_args) => {
  const { fieldOverrides, ...args } = _args || {}
  const languages = args?.languages || defaultLanguages

  return {
    slug: args?.slug || 'Code',
    admin: {
      components: {
        Block: {
          clientProps: {
            // If default languages are used, return undefined (=> do not pass `languages` variable) in order to reduce data sent to the client
            languages: args?.languages,
          },
          path: '@payloadcms/richtext-lexical/client#CodeBlockBlockComponent',
        },
      },
      jsx: '@payloadcms/richtext-lexical/client#codeConverterClient',
    },
    fields: [
      {
        name: 'language',
        type: 'select',
        admin: {
          // We'll manually render this field into the block component header
          hidden: true,
        },
        defaultValue: args?.defaultLanguage || Object.keys(languages)[0],
        options: Object.entries(languages).map(([key, value]) => ({
          label: value,
          value: key,
        })),
      },
      {
        name: 'code',
        type: 'code',
        admin: {
          components: {
            Field: {
              clientProps: args,
              path: '@payloadcms/richtext-lexical/client#CodeComponent',
            },
          },
        },
        label: '',
      },
    ],
    jsx: codeConverter,
    ...(fieldOverrides || {}),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Block.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/premade/CodeBlock/Component/Block.tsx
Signals: React

```typescript
'use client'
import type { ComboboxEntry } from '@payloadcms/ui'
import type {} from 'payload'

import './index.scss'

import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import {
  ChevronIcon,
  Combobox,
  CopyToClipboard,
  PopupList,
  RenderFields,
  useForm,
  useFormFields,
  useTranslation,
} from '@payloadcms/ui'
import React from 'react'

import type { AdditionalCodeComponentProps } from './Code.js'

import { CodeBlockIcon } from '../../../../../lexical/ui/icons/CodeBlock/index.js'
import { useBlockComponentContext } from '../../../client/component/BlockContent.js'
import { Collapse } from './Collapse/index.js'
import { defaultLanguages } from './defaultLanguages.js'
import { FloatingCollapse } from './FloatingCollapse/index.js'

const baseClass = 'payload-richtext-code-block'
export const CodeBlockBlockComponent: React.FC<Pick<AdditionalCodeComponentProps, 'languages'>> = (
  args,
) => {
  const { languages: languagesFromProps } = args
  const languages = languagesFromProps || defaultLanguages

  const { BlockCollapsible, formSchema, RemoveButton } = useBlockComponentContext()
  const { setModified } = useForm()
  const { t } = useTranslation()

  const { codeField } = useFormFields(([fields]) => ({
    codeField: fields?.code,
  }))

  const { selectedLanguageField, setSelectedLanguage } = useFormFields(([fields, dispatch]) => ({
    selectedLanguageField: fields?.language,
    setSelectedLanguage: (language: string) => {
      dispatch({
        type: 'UPDATE',
        path: 'language',
        value: language,
      })
      setModified(true)
    },
  }))

  const selectedLanguageLabel = languages[selectedLanguageField?.value as keyof typeof languages]

  const isEditable = useLexicalEditable()

  const languageEntries = React.useMemo<ComboboxEntry[]>(() => {
    return Object.entries(languages).map(([languageCode, languageLabel]) => ({
      name: `${languageCode} ${languageLabel}`,
      Component: (
        <PopupList.Button
          active={false}
          disabled={false}
          onClick={() => {
            setSelectedLanguage(languageCode)
          }}
        >
          <span className={`${baseClass}__language-code`} data-language={languageCode}>
            {languageLabel}
          </span>
        </PopupList.Button>
      ),
    }))
  }, [languages, setSelectedLanguage])

  return (
    <BlockCollapsible
      Actions={
        <div className={`${baseClass}__actions`}>
          <Combobox
            button={
              <div
                className={`${baseClass}__language-selector-button`}
                data-selected-language={selectedLanguageField?.value}
              >
                <span>{selectedLanguageLabel}</span>
                <ChevronIcon className={`${baseClass}__chevron`} />
              </div>
            }
            buttonType="custom"
            className={`${baseClass}__language-selector`}
            disabled={!isEditable}
            entries={languageEntries}
            horizontalAlign="right"
            minEntriesForSearch={8}
            searchPlaceholder={t('fields:searchForLanguage')}
            showScrollbar
            size="large"
          />
          <CopyToClipboard value={(codeField?.value as string) ?? ''} />

          <Collapse />

          {isEditable && <RemoveButton />}
        </div>
      }
      className={baseClass}
      collapsibleProps={{
        AfterCollapsible: <FloatingCollapse />,
        disableHeaderToggle: true,
        disableToggleIndicator: true,
      }}
      Pill={
        <div className={`${baseClass}__pill`}>
          <CodeBlockIcon />
        </div>
      }
    >
      <RenderFields
        fields={formSchema}
        forceRender={true}
        parentIndexPath=""
        parentPath={''}
        parentSchemaPath=""
        permissions={true}
        readOnly={!isEditable}
      />
    </BlockCollapsible>
  )
}
```

--------------------------------------------------------------------------------

````
