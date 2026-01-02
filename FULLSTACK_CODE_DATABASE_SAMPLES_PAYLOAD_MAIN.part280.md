---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 280
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 280 of 695)

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

---[FILE: IndentPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/indent/client/IndentPlugin.tsx
Signals: React

```typescript
import type { ElementNode } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  INDENT_CONTENT_COMMAND,
  KEY_TAB_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  TabNode,
} from 'lexical'
import { useEffect } from 'react'

import type { PluginComponent } from '../../typesClient.js'
import type { IndentFeatureProps } from '../server/index.js'

export const IndentPlugin: PluginComponent<IndentFeatureProps> = ({ clientProps }) => {
  const [editor] = useLexicalComposerContext()
  const { disabledNodes, disableTabNode } = clientProps

  useEffect(() => {
    if (!editor || !disabledNodes?.length) {
      return
    }
    return mergeRegister(
      editor.registerCommand(
        INDENT_CONTENT_COMMAND,
        () => {
          return $handleIndentAndOutdent((block) => {
            if (!disabledNodes.includes(block.getType())) {
              const indent = block.getIndent()
              block.setIndent(indent + 1)
            }
          })
        },
        COMMAND_PRIORITY_LOW,
      ),
      // If we disable indenting for certain nodes, we need to ensure that these are not indented,
      // if they get transformed from an indented state (e.g. an indented list node gets transformed into a
      // paragraph node for which indenting is disabled).
      editor.registerUpdateListener(({ dirtyElements, editorState }) => {
        editor.update(() => {
          for (const [nodeKey] of dirtyElements) {
            const node = editorState._nodeMap.get(nodeKey)
            if ($isElementNode(node) && disabledNodes.includes(node.getType())) {
              const currentIndent = node.getIndent()
              if (currentIndent > 0) {
                node.setIndent(0)
              }
            }
          }
        })
      }),
    )
  }, [editor, disabledNodes])

  useEffect(() => {
    if (!editor || !disableTabNode) {
      return
    }
    return mergeRegister(
      // This is so that when you press Tab in the middle of a paragraph,
      // it indents the paragraph, instead of inserting a TabNode.
      editor.registerCommand<KeyboardEvent>(
        KEY_TAB_COMMAND,
        (event) => {
          event.preventDefault()
          return editor.dispatchCommand(
            event.shiftKey ? OUTDENT_CONTENT_COMMAND : INDENT_CONTENT_COMMAND,
            undefined,
          )
        },
        COMMAND_PRIORITY_LOW,
      ),
      // Tab isn't the only way to insert a TabNode. We have to make sure
      // it doesn't happen, for example, when pasting from the clipboard.
      editor.registerNodeTransform(TabNode, (node) => {
        node.remove()
      }),
    )
  }, [editor, disableTabNode])

  return <TabIndentationPlugin />
}

function $handleIndentAndOutdent(indentOrOutdent: (block: ElementNode) => void): boolean {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) {
    return false
  }
  const alreadyHandled = new Set()
  const nodes = selection.getNodes()
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!
    const key = node.getKey()
    if (alreadyHandled.has(key)) {
      continue
    }
    const parentBlock = $findMatchingParent(
      node,
      (parentNode): parentNode is ElementNode =>
        $isElementNode(parentNode) && !parentNode.isInline(),
    )
    if (parentBlock === null) {
      continue
    }
    const parentKey = parentBlock.getKey()
    if (parentBlock.canIndent() && !alreadyHandled.has(parentKey)) {
      alreadyHandled.add(parentKey)
      indentOrOutdent(parentBlock)
    }
  }
  return alreadyHandled.size > 0
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/indent/client/index.tsx

```typescript
'use client'

import type { ElementNode, LexicalNode } from 'lexical'

import { $findMatchingParent } from '@lexical/utils'
import { $isElementNode, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND } from 'lexical'

import type { ToolbarGroup } from '../../toolbars/types.js'

import { IndentDecreaseIcon } from '../../../lexical/ui/icons/IndentDecrease/index.js'
import { IndentIncreaseIcon } from '../../../lexical/ui/icons/IndentIncrease/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { type IndentFeatureProps } from '../server/index.js'
import { IndentPlugin } from './IndentPlugin.js'
import { toolbarIndentGroupWithItems } from './toolbarIndentGroup.js'

const toolbarGroups = ({ disabledNodes }: IndentFeatureProps): ToolbarGroup[] => [
  toolbarIndentGroupWithItems([
    {
      ChildComponent: IndentDecreaseIcon,
      isActive: () => false,
      isEnabled: ({ selection }) => {
        const nodes = selection?.getNodes() ?? []

        const isOutdentable = (node: LexicalNode) => {
          return isIndentable(node) && node.getIndent() > 0
        }

        return nodes.some((node) => {
          return isOutdentable(node) || Boolean($findMatchingParent(node, isOutdentable))
        })
      },
      key: 'indentDecrease',
      label: ({ i18n }) => {
        return i18n.t('lexical:indent:decreaseLabel')
      },
      onSelect: ({ editor }) => {
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
      },
      order: 1,
    },
    {
      ChildComponent: IndentIncreaseIcon,
      isActive: () => false,
      isEnabled: ({ selection }) => {
        const nodes = selection?.getNodes() ?? []

        const isIndentableAndNotDisabled = (node: LexicalNode) => {
          return isIndentable(node) && !(disabledNodes ?? []).includes(node.getType())
        }

        return nodes.some((node) => {
          return (
            isIndentableAndNotDisabled(node) ||
            Boolean($findMatchingParent(node, isIndentableAndNotDisabled))
          )
        })
      },
      key: 'indentIncrease',
      label: ({ i18n }) => {
        return i18n.t('lexical:indent:increaseLabel')
      },
      onSelect: ({ editor }) => {
        editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
      },
      order: 2,
    },
  ]),
]

export const IndentFeatureClient = createClientFeature<IndentFeatureProps>(({ props }) => {
  const disabledNodes = props.disabledNodes ?? []
  return {
    plugins: [
      {
        Component: IndentPlugin,
        position: 'normal',
      },
    ],
    sanitizedClientFeatureProps: props,
    toolbarFixed: {
      groups: toolbarGroups({ disabledNodes }),
    },
    toolbarInline: {
      groups: toolbarGroups({ disabledNodes }),
    },
  }
})

const isIndentable = (node: LexicalNode): node is ElementNode =>
  $isElementNode(node) && node.canIndent()
```

--------------------------------------------------------------------------------

---[FILE: toolbarIndentGroup.ts]---
Location: payload-main/packages/richtext-lexical/src/features/indent/client/toolbarIndentGroup.ts

```typescript
'use client'
import type { ToolbarGroup, ToolbarGroupItem } from '../../toolbars/types.js'

export const toolbarIndentGroupWithItems = (items: ToolbarGroupItem[]): ToolbarGroup => {
  return {
    type: 'buttons',
    items,
    key: 'indent',
    order: 35,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: i18n.ts]---
Location: payload-main/packages/richtext-lexical/src/features/indent/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    decreaseLabel: 'تقليل المسافة البادئة',
    increaseLabel: 'زيادة المسافة البادئة',
  },
  az: {
    decreaseLabel: 'İntervalı Azaltın',
    increaseLabel: 'Girintiyi Artırın',
  },
  bg: {
    decreaseLabel: 'Намали отстоянието',
    increaseLabel: 'Увеличете отстоянието',
  },
  cs: {
    decreaseLabel: 'Zmenšit odsazení',
    increaseLabel: 'Zvětšit odsazení',
  },
  da: {
    decreaseLabel: 'Reducer Indrykning',
    increaseLabel: 'Forøg indrykning',
  },
  de: {
    decreaseLabel: 'Einzug verkleinern',
    increaseLabel: 'Einzug erhöhen',
  },
  en: {
    decreaseLabel: 'Decrease Indent',
    increaseLabel: 'Increase Indent',
  },
  es: {
    decreaseLabel: 'Disminuir Sangría',
    increaseLabel: 'Aumentar Sangría',
  },
  et: {
    decreaseLabel: 'Taande vähendamine',
    increaseLabel: 'Taande suurendamine',
  },
  fa: {
    decreaseLabel: 'کاهش تورفتگی',
    increaseLabel: 'افزایش تورفتگی',
  },
  fr: {
    decreaseLabel: "Diminuer l'indentation",
    increaseLabel: "Augmenter l'indentation",
  },
  he: {
    decreaseLabel: 'הקטן הזחה',
    increaseLabel: 'הגדל כניסה',
  },
  hr: {
    decreaseLabel: 'Smanji uvlačenje',
    increaseLabel: 'Povećaj uvlačenje',
  },
  hu: {
    decreaseLabel: 'Csökkentse a behúzást',
    increaseLabel: 'Behúzás növelése',
  },
  is: {
    decreaseLabel: 'Minnka inndrátt',
    increaseLabel: 'Auka inndrátt',
  },
  it: {
    decreaseLabel: 'Diminuisci rientro',
    increaseLabel: 'Aumenta Rientro',
  },
  ja: {
    decreaseLabel: 'インデントを減らす',
    increaseLabel: 'インデントを増やす',
  },
  ko: {
    decreaseLabel: '들여쓰기 줄이기',
    increaseLabel: '들여쓰기 늘리기',
  },
  my: {
    decreaseLabel: 'Kurangkan Inden',
    increaseLabel: 'Tingkatkan Inden',
  },
  nb: {
    decreaseLabel: 'Reduser innrykk',
    increaseLabel: 'Øke innrykk',
  },
  nl: {
    decreaseLabel: 'Verminder Inspringing',
    increaseLabel: 'Inspring verhogen',
  },
  pl: {
    decreaseLabel: 'Zmniejsz wcięcie',
    increaseLabel: 'Zwiększ wcięcie',
  },
  pt: {
    decreaseLabel: 'Diminuir recuo',
    increaseLabel: 'Aumentar Indentação',
  },
  ro: {
    decreaseLabel: 'Reducere indentare',
    increaseLabel: 'Crește indentarea',
  },
  rs: {
    decreaseLabel: 'Смањи увлачење',
    increaseLabel: 'Повећај увлачење',
  },
  'rs-latin': {
    decreaseLabel: 'Smanji uvlačenje',
    increaseLabel: 'Povećaj uvlačenje',
  },
  ru: {
    decreaseLabel: 'Уменьшить отступ',
    increaseLabel: 'Увеличить отступ',
  },
  sk: {
    decreaseLabel: 'Znížiť odsadenie',
    increaseLabel: 'Zväčšiť odsadenie',
  },
  sl: {
    decreaseLabel: 'Zmanjšaj zamik',
    increaseLabel: 'Povečaj zamik',
  },
  sv: {
    decreaseLabel: 'Minska indrag',
    increaseLabel: 'Öka indrag',
  },
  ta: {
    decreaseLabel: 'இடதுபுறச் செருகலை குறைக்கவும்',
    increaseLabel: 'இடதுபுறச் செருகலை அதிகரிக்கவும்',
  },
  th: {
    decreaseLabel: 'ลดการเยื้อง',
    increaseLabel: 'เพิ่มการเยื้อง',
  },
  tr: {
    decreaseLabel: 'Girintiyi Azalt',
    increaseLabel: 'Girintiyi Artır',
  },
  uk: {
    decreaseLabel: 'Зменшити відступ',
    increaseLabel: 'Збільшити відступ',
  },
  vi: {
    decreaseLabel: 'Giảm lề',
    increaseLabel: 'Tăng lề',
  },
  zh: {
    decreaseLabel: '减少缩进',
    increaseLabel: '增加缩进',
  },
  'zh-TW': {
    decreaseLabel: '減少縮排',
    increaseLabel: '增加縮排',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/indent/server/index.ts

```typescript
import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { i18n } from './i18n.js'

export type IndentFeatureProps = {
  /**
   * The nodes that should not be indented. "type" property of the nodes you don't want to be indented.
   * These can be: "paragraph", "heading", "listitem", "quote" or other indentable nodes if they exist.
   */
  disabledNodes?: string[]
  /**
   * If true, pressing Tab in the middle of a block such as a paragraph or heading will not insert a tabNode.
   * Instead, Tab will only be used for block-level indentation.
   *
   * @default false
   */
  disableTabNode?: boolean
}

export const IndentFeature = createServerFeature<
  IndentFeatureProps,
  IndentFeatureProps,
  IndentFeatureProps
>({
  feature: ({ props }) => {
    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#IndentFeatureClient',
      clientFeatureProps: props,
      i18n,
    }
  },
  key: 'indent',
})
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformer.ts]---
Location: payload-main/packages/richtext-lexical/src/features/link/markdownTransformer.ts

```typescript
/**
 * Code taken from https://github.com/facebook/lexical/blob/main/packages/lexical-markdown/src/MarkdownTransformers.ts#L357
 */

// Order of text transformers matters:
//
// - code should go first as it prevents any transformations inside

import { $createTextNode, $isTextNode } from 'lexical'

import type { TextMatchTransformer } from '../../packages/@lexical/markdown/MarkdownTransformers.js'

import { $createLinkNode, $isLinkNode, LinkNode } from './nodes/LinkNode.js'

// - then longer tags match (e.g. ** or __ should go before * or _)
export const LinkMarkdownTransformer: TextMatchTransformer = {
  type: 'text-match',
  dependencies: [LinkNode],
  export: (_node, exportChildren) => {
    if (!$isLinkNode(_node)) {
      return null
    }
    const node: LinkNode = _node
    const { url } = node.getFields()

    const textContent = exportChildren(node)

    const linkContent = `[${textContent}](${url})`

    return linkContent
  },
  importRegExp: /\[([^[]+)\]\(([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?\)/,
  regExp: /\[([^[]+)\]\(([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?\)$/,
  replace: (textNode, match) => {
    const [, linkText, linkUrl] = match
    const linkNode = $createLinkNode({
      fields: {
        doc: null,
        linkType: 'custom',
        newTab: false,
        url: linkUrl,
      },
    })
    const linkTextNode = $createTextNode(linkText)
    linkTextNode.setFormat(textNode.getFormat())
    linkNode.append(linkTextNode)
    textNode.replace(linkNode)

    return linkTextNode
  },
  trigger: ')',
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/link/client/index.tsx

```typescript
'use client'

import type { Klass, LexicalNode } from 'lexical'

import { $findMatchingParent } from '@lexical/utils'
import { $getSelection, $isRangeSelection } from 'lexical'

import type { ToolbarGroup } from '../../toolbars/types.js'
import type { ClientFeature } from '../../typesClient.js'
import type { LinkFields } from '../nodes/types.js'
import type { ExclusiveLinkCollectionsProps } from '../server/index.js'

import { LinkIcon } from '../../../lexical/ui/icons/Link/index.js'
import { getSelectedNode } from '../../../lexical/utils/getSelectedNode.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { toolbarFeatureButtonsGroupWithItems } from '../../shared/toolbar/featureButtonsGroup.js'
import { LinkMarkdownTransformer } from '../markdownTransformer.js'
import { AutoLinkNode } from '../nodes/AutoLinkNode.js'
import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from '../nodes/LinkNode.js'
import { AutoLinkPlugin } from './plugins/autoLink/index.js'
import { ClickableLinkPlugin } from './plugins/clickableLink/index.js'
import { FloatingLinkEditorPlugin } from './plugins/floatingLinkEditor/index.js'
import { TOGGLE_LINK_WITH_MODAL_COMMAND } from './plugins/floatingLinkEditor/LinkEditor/commands.js'
import { LinkPlugin } from './plugins/link/index.js'

export type ClientProps = {
  defaultLinkType?: string
  defaultLinkURL?: string
  disableAutoLinks?: 'creationOnly' | true
} & ExclusiveLinkCollectionsProps

const toolbarGroups: ToolbarGroup[] = [
  toolbarFeatureButtonsGroupWithItems([
    {
      ChildComponent: LinkIcon,
      isActive: ({ selection }) => {
        if ($isRangeSelection(selection)) {
          const selectedNode = getSelectedNode(selection)
          const linkParent = $findMatchingParent(selectedNode, $isLinkNode)
          return linkParent != null
        }
        return false
      },
      isEnabled: ({ selection }) => {
        return !!($isRangeSelection(selection) && $getSelection()?.getTextContent()?.length)
      },
      key: 'link',
      label: ({ i18n }) => {
        return i18n.t('lexical:link:label')
      },
      onSelect: ({ editor, isActive }) => {
        if (!isActive) {
          let selectedText: string | undefined
          let selectedNodes: LexicalNode[] = []
          editor.getEditorState().read(() => {
            selectedText = $getSelection()?.getTextContent()
            // We need to selected nodes here before the drawer opens, as clicking around in the drawer may change the original selection
            selectedNodes = $getSelection()?.getNodes() ?? []
          })

          if (!selectedText?.length) {
            return
          }

          const linkFields: Partial<LinkFields> = {
            doc: null,
          }

          editor.dispatchCommand(TOGGLE_LINK_WITH_MODAL_COMMAND, {
            fields: linkFields,
            selectedNodes,
            text: selectedText,
          })
        } else {
          // remove link
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
        }
      },
      order: 1,
    },
  ]),
]

export const LinkFeatureClient = createClientFeature<ClientProps>(({ props }) => ({
  markdownTransformers: [LinkMarkdownTransformer],
  nodes: [LinkNode, props?.disableAutoLinks === true ? null : AutoLinkNode].filter(
    Boolean,
  ) as Array<Klass<LexicalNode>>,
  plugins: [
    {
      Component: LinkPlugin,
      position: 'normal',
    },
    props?.disableAutoLinks === true || props?.disableAutoLinks === 'creationOnly'
      ? null
      : {
          Component: AutoLinkPlugin,
          position: 'normal',
        },
    {
      Component: ClickableLinkPlugin,
      position: 'normal',
    },
    {
      Component: FloatingLinkEditorPlugin,
      position: 'floatingAnchorElem',
    },
  ].filter(Boolean) as ClientFeature<ClientProps>['plugins'],
  sanitizedClientFeatureProps: props,
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
}))
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/link/client/plugins/autoLink/index.tsx
Signals: React

```typescript
'use client'
import type { ElementNode, LexicalEditor, LexicalNode, TextNode } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { mergeRegister } from '@lexical/utils'
import {
  $createTextNode,
  $getSelection,
  $isElementNode,
  $isLineBreakNode,
  $isNodeSelection,
  $isRangeSelection,
  $isTextNode,
  TextNode as TextNodeValue,
} from 'lexical'
import { useEffect } from 'react'

import type { PluginComponent } from '../../../../typesClient.js'
import type { LinkFields } from '../../../nodes/types.js'
import type { ClientProps } from '../../index.js'

import { $createAutoLinkNode, $isAutoLinkNode, AutoLinkNode } from '../../../nodes/AutoLinkNode.js'
import { $isLinkNode } from '../../../nodes/LinkNode.js'

type ChangeHandler = (url: null | string, prevUrl: null | string) => void

interface LinkMatcherResult {
  fields?: LinkFields
  index: number
  length: number
  text: string
  url: string
}

export type LinkMatcher = (text: string) => LinkMatcherResult | null

export function createLinkMatcherWithRegExp(
  regExp: RegExp,
  urlTransformer: (text: string) => string = (text) => text,
) {
  return (text: string) => {
    const match = regExp.exec(text)
    if (match === null) {
      return null
    }
    return {
      index: match.index,
      length: match[0].length,
      text: match[0],
      url: urlTransformer(match[0]),
    }
  }
}

function findFirstMatch(text: string, matchers: LinkMatcher[]): LinkMatcherResult | null {
  for (const matcher of matchers) {
    const match = matcher(text)

    if (match != null) {
      return match
    }
  }

  return null
}

const PUNCTUATION_OR_SPACE = /[.,;\s]/

function isSeparator(char: string | undefined): boolean {
  return char !== undefined && PUNCTUATION_OR_SPACE.test(char)
}

function endsWithSeparator(textContent: string): boolean {
  return isSeparator(textContent[textContent.length - 1])
}

function startsWithSeparator(textContent: string): boolean {
  return isSeparator(textContent[0])
}

/**
 * Check if the text content starts with a fullstop followed by a top-level domain.
 * Meaning if the text content can be a beginning of a top level domain.
 * @param textContent
 * @param isEmail
 * @returns boolean
 */
function startsWithTLD(textContent: string, isEmail: boolean): boolean {
  if (isEmail) {
    return /^\.[a-z]{2,}/i.test(textContent)
  } else {
    return /^\.[a-z0-9]+/i.test(textContent)
  }
}

function isPreviousNodeValid(node: LexicalNode): boolean {
  let previousNode = node.getPreviousSibling()
  if ($isElementNode(previousNode)) {
    previousNode = previousNode.getLastDescendant()
  }
  return (
    previousNode === null ||
    $isLineBreakNode(previousNode) ||
    ($isTextNode(previousNode) && endsWithSeparator(previousNode.getTextContent()))
  )
}

function isNextNodeValid(node: LexicalNode): boolean {
  let nextNode = node.getNextSibling()
  if ($isElementNode(nextNode)) {
    nextNode = nextNode.getFirstDescendant()
  }
  return (
    nextNode === null ||
    $isLineBreakNode(nextNode) ||
    ($isTextNode(nextNode) && startsWithSeparator(nextNode.getTextContent()))
  )
}

function isContentAroundIsValid(
  matchStart: number,
  matchEnd: number,
  text: string,
  nodes: TextNode[],
): boolean {
  const contentBeforeIsValid =
    matchStart > 0 ? isSeparator(text[matchStart - 1]) : isPreviousNodeValid(nodes[0]!)
  if (!contentBeforeIsValid) {
    return false
  }

  const contentAfterIsValid =
    matchEnd < text.length ? isSeparator(text[matchEnd]) : isNextNodeValid(nodes[nodes.length - 1]!)
  return contentAfterIsValid
}

function extractMatchingNodes(
  nodes: TextNode[],
  startIndex: number,
  endIndex: number,
): [
  matchingOffset: number,
  unmodifiedBeforeNodes: TextNode[],
  matchingNodes: TextNode[],
  unmodifiedAfterNodes: TextNode[],
] {
  const unmodifiedBeforeNodes: TextNode[] = []
  const matchingNodes: TextNode[] = []
  const unmodifiedAfterNodes: TextNode[] = []
  let matchingOffset = 0

  let currentOffset = 0
  const currentNodes = [...nodes]

  while (currentNodes.length > 0) {
    const currentNode = currentNodes[0]!
    const currentNodeText = currentNode.getTextContent()
    const currentNodeLength = currentNodeText.length
    const currentNodeStart = currentOffset
    const currentNodeEnd = currentOffset + currentNodeLength

    if (currentNodeEnd <= startIndex) {
      unmodifiedBeforeNodes.push(currentNode)
      matchingOffset += currentNodeLength
    } else if (currentNodeStart >= endIndex) {
      unmodifiedAfterNodes.push(currentNode)
    } else {
      matchingNodes.push(currentNode)
    }
    currentOffset += currentNodeLength
    currentNodes.shift()
  }
  return [matchingOffset, unmodifiedBeforeNodes, matchingNodes, unmodifiedAfterNodes]
}

function $createAutoLinkNode_(
  nodes: TextNode[],
  startIndex: number,
  endIndex: number,
  match: LinkMatcherResult,
): TextNode | undefined {
  const fields = {
    linkType: 'custom',
    url: match.url,
    ...match.fields,
  } as LinkFields

  const linkNode = $createAutoLinkNode({ fields })
  if (nodes.length === 1) {
    const remainingTextNode = nodes[0]!
    let linkTextNode: TextNode | undefined
    if (startIndex === 0) {
      ;[linkTextNode] = remainingTextNode.splitText(endIndex)
    } else {
      ;[, linkTextNode] = remainingTextNode.splitText(startIndex, endIndex)
    }
    if (linkTextNode) {
      const textNode = $createTextNode(match.text)
      textNode.setFormat(linkTextNode.getFormat())
      textNode.setDetail(linkTextNode.getDetail())
      textNode.setStyle(linkTextNode.getStyle())
      linkNode.append(textNode)
      linkTextNode.replace(linkNode)
    }
    return remainingTextNode
  } else if (nodes.length > 1) {
    const firstTextNode = nodes[0]!
    let offset = firstTextNode.getTextContent().length
    let firstLinkTextNode
    if (startIndex === 0) {
      firstLinkTextNode = firstTextNode
    } else {
      ;[, firstLinkTextNode] = firstTextNode.splitText(startIndex)
    }
    const linkNodes: LexicalNode[] = []
    let remainingTextNode
    nodes.forEach((currentNode) => {
      const currentNodeText = currentNode.getTextContent()
      const currentNodeLength = currentNodeText.length
      const currentNodeStart = offset
      const currentNodeEnd = offset + currentNodeLength
      if (currentNodeStart < endIndex) {
        if (currentNodeEnd <= endIndex) {
          linkNodes.push(currentNode)
        } else {
          const [linkTextNode, endNode] = currentNode.splitText(endIndex - currentNodeStart)
          if (linkTextNode) {
            linkNodes.push(linkTextNode)
          }
          remainingTextNode = endNode
        }
      }
      offset += currentNodeLength
    })

    if (firstLinkTextNode) {
      const selection = $getSelection()
      const selectedTextNode = selection ? selection.getNodes().find($isTextNode) : undefined
      const textNode = $createTextNode(firstLinkTextNode.getTextContent())
      textNode.setFormat(firstLinkTextNode.getFormat())
      textNode.setDetail(firstLinkTextNode.getDetail())
      textNode.setStyle(firstLinkTextNode.getStyle())
      linkNode.append(textNode, ...linkNodes)
      // it does not preserve caret position if caret was at the first text node
      // so we need to restore caret position
      if (selectedTextNode && selectedTextNode === firstLinkTextNode) {
        if ($isRangeSelection(selection)) {
          textNode.select(selection.anchor.offset, selection.focus.offset)
        } else if ($isNodeSelection(selection)) {
          textNode.select(0, textNode.getTextContent().length)
        }
      }
      firstLinkTextNode.replace(linkNode)
      return remainingTextNode
    }
  }
  return undefined
}

function $handleLinkCreation(
  nodes: TextNode[],
  matchers: LinkMatcher[],
  onChange: ChangeHandler,
): void {
  let currentNodes = [...nodes]
  const initialText = currentNodes.map((node) => node.getTextContent()).join('')
  let text = initialText

  let match
  let invalidMatchEnd = 0

  while ((match = findFirstMatch(text, matchers)) != null && match !== null) {
    const matchStart: number = match.index
    const matchLength: number = match.length
    const matchEnd = matchStart + matchLength
    const isValid = isContentAroundIsValid(
      invalidMatchEnd + matchStart,
      invalidMatchEnd + matchEnd,
      initialText,
      currentNodes,
    )

    if (isValid) {
      const [matchingOffset, , matchingNodes, unmodifiedAfterNodes] = extractMatchingNodes(
        currentNodes,
        invalidMatchEnd + matchStart,
        invalidMatchEnd + matchEnd,
      )

      const actualMatchStart = invalidMatchEnd + matchStart - matchingOffset
      const actualMatchEnd = invalidMatchEnd + matchEnd - matchingOffset
      const remainingTextNode = $createAutoLinkNode_(
        matchingNodes,
        actualMatchStart,
        actualMatchEnd,
        match,
      )
      currentNodes = remainingTextNode
        ? [remainingTextNode, ...unmodifiedAfterNodes]
        : unmodifiedAfterNodes
      onChange(match.url, null)
      invalidMatchEnd = 0
    } else {
      invalidMatchEnd += matchEnd
    }

    text = text.substring(matchEnd)
  }
}

function handleLinkEdit(
  linkNode: AutoLinkNode,
  matchers: LinkMatcher[],
  onChange: ChangeHandler,
): void {
  // Check children are simple text
  const children = linkNode.getChildren()
  const childrenLength = children.length
  for (let i = 0; i < childrenLength; i++) {
    const child = children[i]
    if (!$isTextNode(child) || !child.isSimpleText()) {
      replaceWithChildren(linkNode)
      onChange(null, linkNode.getFields()?.url ?? null)
      return
    }
  }

  // Check text content fully matches
  const text = linkNode.getTextContent()
  const match = findFirstMatch(text, matchers)
  if (match === null || match.text !== text) {
    replaceWithChildren(linkNode)
    onChange(null, linkNode.getFields()?.url ?? null)
    return
  }

  // Check neighbors
  if (!isPreviousNodeValid(linkNode) || !isNextNodeValid(linkNode)) {
    replaceWithChildren(linkNode)
    onChange(null, linkNode.getFields()?.url ?? null)
    return
  }

  const url = linkNode.getFields()?.url
  if (url !== match?.url) {
    const flds = linkNode.getFields()
    flds.url = match?.url
    linkNode.setFields(flds)
    onChange(match.url, url ?? null)
  }
}

// Bad neighbors are edits in neighbor nodes that make AutoLinks incompatible.
// Given the creation preconditions, these can only be simple text nodes.
function handleBadNeighbors(
  textNode: TextNode,
  matchers: LinkMatcher[],
  onChange: ChangeHandler,
): void {
  const previousSibling = textNode.getPreviousSibling()
  const nextSibling = textNode.getNextSibling()
  const text = textNode.getTextContent()

  if ($isAutoLinkNode(previousSibling)) {
    const isEmailURI = previousSibling.getFields()?.url
      ? (previousSibling.getFields()?.url?.startsWith('mailto:') ?? false)
      : false
    if (!startsWithSeparator(text) || startsWithTLD(text, isEmailURI)) {
      previousSibling.append(textNode)
      handleLinkEdit(previousSibling, matchers, onChange)
      onChange(null, previousSibling.getFields()?.url ?? null)
    }
  }

  if ($isAutoLinkNode(nextSibling) && !endsWithSeparator(text)) {
    replaceWithChildren(nextSibling)
    handleLinkEdit(nextSibling, matchers, onChange)
    onChange(null, nextSibling.getFields()?.url ?? null)
  }
}

function replaceWithChildren(node: ElementNode): LexicalNode[] {
  const children = node.getChildren()
  const childrenLength = children.length

  for (let j = childrenLength - 1; j >= 0; j--) {
    node.insertAfter(children[j]!)
  }

  node.remove()
  return children.map((child) => child.getLatest())
}

function getTextNodesToMatch(textNode: TextNode): TextNode[] {
  // check if next siblings are simple text nodes till a node contains a space separator
  const textNodesToMatch = [textNode]
  let nextSibling = textNode.getNextSibling()
  while (nextSibling !== null && $isTextNode(nextSibling) && nextSibling.isSimpleText()) {
    textNodesToMatch.push(nextSibling)
    if (/\s/.test(nextSibling.getTextContent())) {
      break
    }
    nextSibling = nextSibling.getNextSibling()
  }
  return textNodesToMatch
}

function useAutoLink(
  editor: LexicalEditor,
  matchers: LinkMatcher[],
  onChange?: ChangeHandler,
): void {
  useEffect(() => {
    if (!editor.hasNodes([AutoLinkNode])) {
      throw new Error('LexicalAutoLinkPlugin: AutoLinkNode not registered on editor')
    }

    const onChangeWrapped = (url: null | string, prevUrl: null | string): void => {
      if (onChange != null) {
        onChange(url, prevUrl)
      }
    }

    return mergeRegister(
      editor.registerNodeTransform(TextNodeValue, (textNode: TextNode) => {
        const parent = textNode.getParentOrThrow()
        const previous = textNode.getPreviousSibling()
        if ($isAutoLinkNode(parent)) {
          handleLinkEdit(parent, matchers, onChangeWrapped)
        } else if (!$isLinkNode(parent)) {
          if (
            textNode.isSimpleText() &&
            (startsWithSeparator(textNode.getTextContent()) || !$isAutoLinkNode(previous))
          ) {
            const textNodesToMatch = getTextNodesToMatch(textNode)
            $handleLinkCreation(textNodesToMatch, matchers, onChangeWrapped)
          }

          handleBadNeighbors(textNode, matchers, onChangeWrapped)
        }
      }),
    )
  }, [editor, matchers, onChange])
}

const URL_REGEX =
  /((https?:\/\/(www\.)?)|(www\.))[-\w@:%.+~#=]{1,256}\.[a-zA-Z\d()]{1,6}\b([-\w()@:%+.~#?&/=]*)(?<![-.+():%])/

const EMAIL_REGEX =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-\d]+\.)+[a-z]{2,}))/i

const MATCHERS = [
  createLinkMatcherWithRegExp(URL_REGEX, (text) => {
    return text.startsWith('http') ? text : `https://${text}`
  }),
  createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
    return `mailto:${text}`
  }),
]

export const AutoLinkPlugin: PluginComponent<ClientProps> = () => {
  const [editor] = useLexicalComposerContext()

  useAutoLink(editor, MATCHERS)

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/link/client/plugins/clickableLink/index.tsx
Signals: React

```typescript
'use client'
import { ClickableLinkPlugin as LexicalClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin.js'
import React from 'react'

import type { PluginComponent } from '../../../../typesClient.js'
import type { ClientProps } from '../../index.js'

export const ClickableLinkPlugin: PluginComponent<ClientProps> = () => {
  return <LexicalClickableLinkPlugin />
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/link/client/plugins/floatingLinkEditor/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .link-editor {
    z-index: 1;
    display: flex;
    align-items: center;
    background: var(--theme-input-bg);
    padding: 4px 4px 4px 12px;
    vertical-align: middle;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    border-radius: $style-radius-m;
    transition: opacity 0.2s;
    will-change: transform;
    box-shadow:
      0px 1px 2px 1px rgba(0, 0, 0, 0.1),
      0px 4px 16px 0px rgba(0, 0, 0, 0.1),
      0px -4px 16px 0px rgba(0, 0, 0, 0.1);

    .link-input {
      display: flex;
      align-items: center;
      flex-direction: row;
      flex-wrap: nowrap;
      min-height: 28px;
      box-sizing: border-box;
      @extend %body;
      border: 0;
      outline: 0;
      position: relative;
      font-family: var(--font-body);

      .icon--externalLink {
        margin-right: 5px;
      }

      &__label-pure {
        color: var(--theme-elevation-1000);
        margin-right: 15px;
        display: block;
        white-space: nowrap;
        overflow: hidden;
      }

      a {
        text-decoration: underline;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        margin-right: base(0.4);
        text-overflow: ellipsis;
        color: var(--theme-success-750);

        &:hover {
          color: var(--theme-success-850);
        }
      }
    }

    button {
      all: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      background-size: 16px;
      background-position: center;
      background-repeat: no-repeat;
      width: 30px;
      height: 30px;
      cursor: pointer;
      color: var(--theme-elevation-600);
      border-radius: $style-radius-m;

      &:hover:not([disabled]) {
        color: var(--theme-elevation-800);
        background-color: var(--theme-elevation-100);
      }
    }
  }

  html[data-theme='light'] {
    .link-editor {
      box-shadow:
        0px 1px 2px 1px rgba(0, 0, 0, 0.05),
        0px 4px 8px 0px rgba(0, 0, 0, 0.05),
        0px -4px 16px 0px rgba(0, 0, 0, 0.05);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/link/client/plugins/floatingLinkEditor/index.tsx
Signals: React

```typescript
'use client'
import * as React from 'react'
import { createPortal } from 'react-dom'

import type { PluginComponentWithAnchor } from '../../../../typesClient.js'
import type { ClientProps } from '../../index.js'

import './index.scss'
import { LinkEditor } from './LinkEditor/index.js'

export const FloatingLinkEditorPlugin: PluginComponentWithAnchor<ClientProps> = (props) => {
  const { anchorElem = document.body } = props

  return createPortal(<LinkEditor anchorElem={anchorElem} />, anchorElem)
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/features/link/client/plugins/floatingLinkEditor/types.ts

```typescript
import type { LexicalNode } from 'lexical'

import type { LinkFields } from '../../../nodes/types.js'

/**
 * The payload of a link node
 * This can be delivered from the link node to the drawer, or from the drawer/anything to the TOGGLE_LINK_COMMAND
 */
export type LinkPayload = {
  /**
   * The fields of the link node. Undefined fields will be taken from the default values of the link node
   */
  fields: Partial<LinkFields>
  selectedNodes?: LexicalNode[]
  /**
   * The text content of the link node - will be displayed in the drawer
   */
  text: null | string
} | null
```

--------------------------------------------------------------------------------

---[FILE: commands.ts]---
Location: payload-main/packages/richtext-lexical/src/features/link/client/plugins/floatingLinkEditor/LinkEditor/commands.ts

```typescript
'use client'
import type { LexicalCommand } from 'lexical'

import { createCommand } from 'lexical'

import type { LinkPayload } from '../types.js'

export const TOGGLE_LINK_WITH_MODAL_COMMAND: LexicalCommand<LinkPayload | null> = createCommand(
  'TOGGLE_LINK_WITH_MODAL_COMMAND',
)
```

--------------------------------------------------------------------------------

````
