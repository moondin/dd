---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 283
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 283 of 695)

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
Location: payload-main/packages/richtext-lexical/src/features/lists/unorderedList/client/index.tsx

```typescript
'use client'

import { $isListNode, INSERT_UNORDERED_LIST_COMMAND, ListItemNode, ListNode } from '@lexical/list'
import { $isRangeSelection } from 'lexical'

import type { ToolbarGroup } from '../../../toolbars/types.js'

import { UnorderedListIcon } from '../../../../lexical/ui/icons/UnorderedList/index.js'
import { createClientFeature } from '../../../../utilities/createClientFeature.js'
import { toolbarTextDropdownGroupWithItems } from '../../../shared/toolbar/textDropdownGroup.js'
import { LexicalListPlugin } from '../../plugin/index.js'
import { slashMenuListGroupWithItems } from '../../shared/slashMenuListGroup.js'
import { UNORDERED_LIST } from '../markdownTransformer.js'

const toolbarGroups: ToolbarGroup[] = [
  toolbarTextDropdownGroupWithItems([
    {
      ChildComponent: UnorderedListIcon,
      isActive: ({ selection }) => {
        if (!$isRangeSelection(selection)) {
          return false
        }
        for (const node of selection.getNodes()) {
          if ($isListNode(node) && node.getListType() === 'bullet') {
            continue
          }

          const parent = node.getParent()

          if ($isListNode(parent) && parent.getListType() === 'bullet') {
            continue
          }

          const parentParent = parent?.getParent()
          // Example scenario: Node = textNode, parent = listItemNode, parentParent = listNode
          if ($isListNode(parentParent) && parentParent.getListType() === 'bullet') {
            continue
          }

          return false
        }
        return true
      },
      key: 'unorderedList',
      label: ({ i18n }) => {
        return i18n.t('lexical:unorderedList:label')
      },
      onSelect: ({ editor }) => {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
      },
      order: 11,
    },
  ]),
]

export const UnorderedListFeatureClient = createClientFeature({
  markdownTransformers: [UNORDERED_LIST],
  nodes: [ListNode, ListItemNode],
  plugins: [
    {
      Component: LexicalListPlugin,
      position: 'normal',
    },
  ],
  slashMenu: {
    groups: [
      slashMenuListGroupWithItems([
        {
          Icon: UnorderedListIcon,
          key: 'unorderedList',
          keywords: ['unordered list', 'ul'],
          label: ({ i18n }) => {
            return i18n.t('lexical:unorderedList:label')
          },
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
          },
        },
      ]),
    ],
  },
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
```

--------------------------------------------------------------------------------

---[FILE: i18n.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/unorderedList/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    label: 'قائمة غير مرتبة',
  },
  az: {
    label: 'Sırasız Siyahı',
  },
  bg: {
    label: 'Неподреден списък',
  },
  cs: {
    label: 'Neuspořádaný seznam',
  },
  da: {
    label: 'Usorteret Liste',
  },
  de: {
    label: 'Ungeordnete Liste',
  },
  en: {
    label: 'Unordered List',
  },
  es: {
    label: 'Lista desordenada',
  },
  et: {
    label: 'Sorteerimata loend',
  },
  fa: {
    label: 'لیست بدون ترتیب',
  },
  fr: {
    label: 'Liste non ordonnée',
  },
  he: {
    label: 'רשימה לא מסודרת',
  },
  hr: {
    label: 'Neuređeni popis',
  },
  hu: {
    label: 'Rendezetlen lista',
  },
  is: {
    label: 'Óraðaður listi',
  },
  it: {
    label: 'Elenco non ordinato',
  },
  ja: {
    label: '順不同リスト',
  },
  ko: {
    label: '비정렬 목록',
  },
  my: {
    label: 'Senarai Tidak Tertib',
  },
  nb: {
    label: 'Usortert liste',
  },
  nl: {
    label: 'Ongeordende lijst',
  },
  pl: {
    label: 'Nieuporządkowana lista',
  },
  pt: {
    label: 'Lista Não Ordenada',
  },
  ro: {
    label: 'Listă neordonată',
  },
  rs: {
    label: 'Неуређена листа',
  },
  'rs-latin': {
    label: 'Neuređena lista',
  },
  ru: {
    label: 'Несортированный список',
  },
  sk: {
    label: 'Neusporiadaný zoznam',
  },
  sl: {
    label: 'Neurejen seznam',
  },
  sv: {
    label: 'Oordnad lista',
  },
  ta: {
    label: 'வரிசைப்படுத்தப்படாத பட்டியல்',
  },
  th: {
    label: 'รายการที่ไม่ได้เรียงลำดับ',
  },
  tr: {
    label: 'Sırasız Liste',
  },
  uk: {
    label: 'Невпорядкований список',
  },
  vi: {
    label: 'Danh sách không theo thứ tự',
  },
  zh: {
    label: '无序列表',
  },
  'zh-TW': {
    label: '無順序列表',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/lists/unorderedList/server/index.ts

```typescript
import { ListItemNode, ListNode } from '@lexical/list'

import { createServerFeature } from '../../../../utilities/createServerFeature.js'
import { createNode } from '../../../typeUtilities.js'
import { ListHTMLConverter, ListItemHTMLConverter } from '../../htmlConverter.js'
import { UNORDERED_LIST } from '../markdownTransformer.js'
import { i18n } from './i18n.js'

export const UnorderedListFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#UnorderedListFeatureClient',
    i18n,
    markdownTransformers: [UNORDERED_LIST],
    nodes: [
      createNode({
        converters: {
          html: ListHTMLConverter as any, // ListHTMLConverter uses a different generic type than ListNode[exportJSON], thus we need to cast as any
        },
        node: ListNode,
      }),
      createNode({
        converters: {
          html: ListItemHTMLConverter as any,
        },
        node: ListItemNode,
      }),
    ],
  },
  key: 'unorderedList',
})
```

--------------------------------------------------------------------------------

---[FILE: feature.client.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/feature.client.tsx

```typescript
'use client'

import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { UnknownConvertedNode } from './nodes/unknownConvertedNode/index.js'

export const LexicalPluginToLexicalFeatureClient = createClientFeature(() => {
  return {
    nodes: [UnknownConvertedNode],
  }
})
```

--------------------------------------------------------------------------------

---[FILE: feature.server.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/feature.server.ts

```typescript
import type { LexicalPluginNodeConverter, PayloadPluginLexicalData } from './converter/types.js'

import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { defaultConverters } from './converter/defaultConverters.js'
import { convertLexicalPluginToLexical } from './converter/index.js'
import { UnknownConvertedNode } from './nodes/unknownConvertedNode/index.js'

export type LexicalPluginToLexicalFeatureProps = {
  converters?:
    | (({
        defaultConverters,
      }: {
        defaultConverters: LexicalPluginNodeConverter[]
      }) => LexicalPluginNodeConverter[])
    | LexicalPluginNodeConverter[]
  disableHooks?: boolean
  quiet?: boolean
}

export const LexicalPluginToLexicalFeature =
  createServerFeature<LexicalPluginToLexicalFeatureProps>({
    feature: ({ props }) => {
      if (!props) {
        props = {}
      }

      let converters: LexicalPluginNodeConverter[] = []

      if (props?.converters && typeof props?.converters === 'function') {
        converters = props.converters({ defaultConverters })
      } else if (props.converters && typeof props?.converters !== 'function') {
        converters = props.converters
      } else {
        converters = defaultConverters
      }

      props.converters = converters

      return {
        ClientFeature: '@payloadcms/richtext-lexical/client#LexicalPluginToLexicalFeatureClient',
        hooks: props.disableHooks
          ? undefined
          : {
              afterRead: [
                ({ value }) => {
                  if (!value || !('jsonContent' in value)) {
                    // incomingEditorState null or not from Lexical Plugin
                    return value
                  }

                  // Lexical Plugin => convert to lexical
                  return convertLexicalPluginToLexical({
                    converters: props.converters as LexicalPluginNodeConverter[],
                    lexicalPluginData: value as PayloadPluginLexicalData,
                    quiet: props?.quiet,
                  })
                },
              ],
            },
        nodes: [
          {
            node: UnknownConvertedNode,
          },
        ],
        sanitizedServerFeatureProps: props,
      }
    },
    key: 'lexicalPluginToLexical',
  })
```

--------------------------------------------------------------------------------

---[FILE: defaultConverters.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/converter/defaultConverters.ts

```typescript
import type { LexicalPluginNodeConverter } from './types.js'

import { HeadingConverter } from './converters/heading/converter.js'
import { LinkConverter } from './converters/link/converter.js'
import { ListConverter } from './converters/list/converter.js'
import { ListItemConverter } from './converters/listItem/converter.js'
import { QuoteConverter } from './converters/quote/converter.js'
import { UnknownConverter } from './converters/unknown/converter.js'
import { UploadConverter } from './converters/upload/converter.js'

export const defaultConverters: LexicalPluginNodeConverter[] = [
  HeadingConverter,
  LinkConverter,
  ListConverter,
  ListItemConverter,
  QuoteConverter,
  UnknownConverter,
  UploadConverter,
]
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/converter/index.ts

```typescript
import type {
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedParagraphNode,
  SerializedTextNode,
} from 'lexical'

import type { LexicalPluginNodeConverter, PayloadPluginLexicalData } from './types.js'

export function convertLexicalPluginToLexical({
  converters,
  lexicalPluginData,
  quiet,
}: {
  converters: LexicalPluginNodeConverter[]
  lexicalPluginData: PayloadPluginLexicalData
  quiet?: boolean
}): SerializedEditorState {
  return {
    root: {
      type: 'root',
      children: convertLexicalPluginNodesToLexical({
        converters,
        lexicalPluginNodes: lexicalPluginData?.jsonContent?.root?.children || [],
        parentNodeType: 'root',
        quiet,
      }),
      direction: lexicalPluginData?.jsonContent?.root?.direction || 'ltr',
      format: lexicalPluginData?.jsonContent?.root?.format || '',
      indent: lexicalPluginData?.jsonContent?.root?.indent || 0,
      version: 1,
    },
  }
}

export function convertLexicalPluginNodesToLexical({
  converters,
  lexicalPluginNodes,
  parentNodeType,
  quiet,
}: {
  converters: LexicalPluginNodeConverter[]
  lexicalPluginNodes: SerializedLexicalNode[] | undefined
  /**
   * Type of the parent lexical node (not the type of the original, parent payload-plugin-lexical type)
   */
  parentNodeType: string
  quiet?: boolean
}): SerializedLexicalNode[] {
  if (!lexicalPluginNodes?.length || !converters?.length) {
    return []
  }
  const unknownConverter = converters.find((converter) => converter.nodeTypes.includes('unknown'))
  // @ts-expect-error - vestiges of the migration to strict mode. Probably not important enough in this file to fix
  return (
    lexicalPluginNodes.map((lexicalPluginNode, i) => {
      if (lexicalPluginNode.type === 'paragraph') {
        return convertParagraphNode(converters, lexicalPluginNode, quiet)
      }
      if (lexicalPluginNode.type === 'text' || !lexicalPluginNode.type) {
        return convertTextNode(lexicalPluginNode)
      }

      const converter = converters.find((converter) =>
        converter.nodeTypes.includes(lexicalPluginNode.type),
      )

      if (converter) {
        return converter.converter({
          childIndex: i,
          converters,
          lexicalPluginNode,
          parentNodeType,
          quiet,
        })
      }

      if (!quiet) {
        console.warn(
          'lexicalPluginToLexical > No converter found for node type: ' + lexicalPluginNode.type,
        )
      }

      return unknownConverter?.converter({
        childIndex: i,
        converters,
        lexicalPluginNode,
        parentNodeType,
        quiet,
      })
    }) || []
  )
}

export function convertParagraphNode(
  converters: LexicalPluginNodeConverter[],
  node: SerializedLexicalNode,
  quiet?: boolean,
): SerializedParagraphNode {
  return {
    ...node,
    type: 'paragraph',

    children: convertLexicalPluginNodesToLexical({
      converters,
      lexicalPluginNodes: (node as any).children || [],
      parentNodeType: 'paragraph',
      quiet,
    }),
    version: 1,
  } as SerializedParagraphNode
}
export function convertTextNode(node: SerializedLexicalNode): SerializedTextNode {
  return node as SerializedTextNode
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/converter/types.ts

```typescript
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'

export type LexicalPluginNodeConverter<T extends SerializedLexicalNode = SerializedLexicalNode> = {
  converter: ({
    childIndex,
    converters,
    lexicalPluginNode,
    parentNodeType,
  }: {
    childIndex: number
    converters: LexicalPluginNodeConverter[]
    lexicalPluginNode: { children?: SerializedLexicalNode[] } & SerializedLexicalNode
    parentNodeType: string
    quiet?: boolean
  }) => T
  nodeTypes: string[]
}

export type PayloadPluginLexicalData = {
  characters: number
  comments: unknown[]
  html?: string
  jsonContent: SerializedEditorState
  markdown?: string
  preview: string
  words: number
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/converter/converters/heading/converter.ts

```typescript
import type { SerializedHeadingNode } from '../../../../../heading/server/index.js'
import type { LexicalPluginNodeConverter } from '../../types.js'

import { convertLexicalPluginNodesToLexical } from '../../index.js'

export const HeadingConverter: LexicalPluginNodeConverter = {
  converter({ converters, lexicalPluginNode, quiet }) {
    return {
      ...lexicalPluginNode,
      type: 'heading',
      children: convertLexicalPluginNodesToLexical({
        converters,
        lexicalPluginNodes: lexicalPluginNode.children,
        parentNodeType: 'heading',
        quiet,
      }),
      version: 1,
    } as const as SerializedHeadingNode
  },
  nodeTypes: ['heading'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/converter/converters/link/converter.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SerializedLinkNode } from '../../../../../link/nodes/types.js'
import type { LexicalPluginNodeConverter } from '../../types.js'

import { convertLexicalPluginNodesToLexical } from '../../index.js'

export const LinkConverter: LexicalPluginNodeConverter = {
  converter({ converters, lexicalPluginNode, quiet }) {
    return {
      type: 'link',
      children: convertLexicalPluginNodesToLexical({
        converters,
        lexicalPluginNodes: lexicalPluginNode.children,
        parentNodeType: 'link',
        quiet,
      }),
      direction: (lexicalPluginNode as any).direction || 'ltr',
      fields: {
        doc: (lexicalPluginNode as any).attributes?.doc
          ? {
              relationTo: (lexicalPluginNode as any).attributes?.doc?.relationTo,
              value: (lexicalPluginNode as any).attributes?.doc?.value,
            }
          : undefined,
        linkType: (lexicalPluginNode as any).attributes?.linkType || 'custom',
        newTab: (lexicalPluginNode as any).attributes?.newTab || false,
        url: (lexicalPluginNode as any).attributes?.url || undefined,
      },
      format: (lexicalPluginNode as any).format || '',
      indent: (lexicalPluginNode as any).indent || 0,
      version: 2,
    } as const as SerializedLinkNode
  },
  nodeTypes: ['link'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/converter/converters/list/converter.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SerializedListNode } from '../../../../../lists/plugin/index.js'
import type { LexicalPluginNodeConverter } from '../../types.js'

import { convertLexicalPluginNodesToLexical } from '../../index.js'

export const ListConverter: LexicalPluginNodeConverter = {
  converter({ converters, lexicalPluginNode, quiet }) {
    return {
      ...lexicalPluginNode,
      type: 'list',
      children: convertLexicalPluginNodesToLexical({
        converters,
        lexicalPluginNodes: lexicalPluginNode.children,
        parentNodeType: 'list',
        quiet,
      }),
      listType: (lexicalPluginNode as any)?.listType || 'number',
      tag: (lexicalPluginNode as any)?.tag || 'ol',
      version: 1,
    } as const as SerializedListNode
  },
  nodeTypes: ['list'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/converter/converters/listItem/converter.ts

```typescript
import type { SerializedListItemNode } from '../../../../../lists/plugin/index.js'
import type { LexicalPluginNodeConverter } from '../../types.js'

import { convertLexicalPluginNodesToLexical } from '../../index.js'

export const ListItemConverter: LexicalPluginNodeConverter = {
  converter({ childIndex, converters, lexicalPluginNode, quiet }) {
    return {
      ...lexicalPluginNode,
      type: 'listitem',
      checked: undefined,
      children: convertLexicalPluginNodesToLexical({
        converters,
        lexicalPluginNodes: lexicalPluginNode.children,
        parentNodeType: 'listitem',
        quiet,
      }),
      value: childIndex + 1,
      version: 1,
    } as const as SerializedListItemNode
  },
  nodeTypes: ['listitem'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/converter/converters/quote/converter.ts

```typescript
import type { SerializedQuoteNode } from '../../../../../blockquote/server/index.js'
import type { LexicalPluginNodeConverter } from '../../types.js'

import { convertLexicalPluginNodesToLexical } from '../../index.js'

export const QuoteConverter: LexicalPluginNodeConverter = {
  converter({ converters, lexicalPluginNode, quiet }) {
    return {
      ...lexicalPluginNode,
      type: 'quote',
      children: convertLexicalPluginNodesToLexical({
        converters,
        lexicalPluginNodes: lexicalPluginNode.children,
        parentNodeType: 'quote',
        quiet,
      }),
      version: 1,
    } as const as SerializedQuoteNode
  },
  nodeTypes: ['quote'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/converter/converters/unknown/converter.ts

```typescript
import type { SerializedUnknownConvertedNode } from '../../../nodes/unknownConvertedNode/index.js'
import type { LexicalPluginNodeConverter } from '../../types.js'

import { convertLexicalPluginNodesToLexical } from '../../index.js'

export const UnknownConverter: LexicalPluginNodeConverter = {
  converter({ converters, lexicalPluginNode, quiet }) {
    return {
      type: 'unknownConverted',
      children: convertLexicalPluginNodesToLexical({
        converters,
        lexicalPluginNodes: lexicalPluginNode.children,
        parentNodeType: 'unknownConverted',
        quiet,
      }),
      data: {
        nodeData: lexicalPluginNode,
        nodeType: lexicalPluginNode.type,
      },
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    } as const as SerializedUnknownConvertedNode
  },
  nodeTypes: ['unknown'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/converter/converters/upload/converter.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SerializedUploadNode } from '../../../../../upload/server/nodes/UploadNode.js'
import type { LexicalPluginNodeConverter } from '../../types.js'

export const UploadConverter: LexicalPluginNodeConverter = {
  converter({ lexicalPluginNode }) {
    let fields = {}
    if ((lexicalPluginNode as any)?.caption?.editorState) {
      fields = {
        caption: (lexicalPluginNode as any)?.caption,
      }
    }
    return {
      type: 'upload',
      fields,
      format: (lexicalPluginNode as any)?.format || '',
      relationTo: (lexicalPluginNode as any)?.rawImagePayload?.relationTo,
      value: (lexicalPluginNode as any)?.rawImagePayload?.value?.id || '',
      version: 2,
    } as const as SerializedUploadNode
  },
  nodeTypes: ['upload'],
}
```

--------------------------------------------------------------------------------

---[FILE: Component.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/nodes/unknownConvertedNode/Component.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import type { UnknownConvertedNodeData } from './index.js'

import './index.scss'

type Props = {
  data: UnknownConvertedNodeData
}

export const UnknownConvertedNodeComponent: React.FC<Props> = (props) => {
  const { data } = props

  return (
    <div>
      Unknown converted payload-plugin-lexical node: <strong>{data?.nodeType}</strong>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/nodes/unknownConvertedNode/index.scss

```text
@layer payload-default {
  span.unknownConverted {
    text-transform: uppercase;
    font-family: 'Roboto Mono', monospace;
    letter-spacing: 2px;
    font-size: calc(var(--base) * 0.5);
    margin: 0 0 var(--base);
    background: red;
    color: white;
    display: inline-block;

    div {
      background: red;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/lexicalPluginToLexical/nodes/unknownConvertedNode/index.tsx
Signals: React

```typescript
import type { EditorConfig, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from 'lexical'
import type { JSX } from 'react'

import { addClassNamesToElement } from '@lexical/utils'
import { $applyNodeReplacement, DecoratorNode } from 'lexical'
import * as React from 'react'

export type UnknownConvertedNodeData = {
  nodeData: unknown
  nodeType: string
}

export type SerializedUnknownConvertedNode = Spread<
  {
    data: UnknownConvertedNodeData
  },
  SerializedLexicalNode
>

const Component = React.lazy(() =>
  import('./Component.js').then((module) => ({
    default: module.UnknownConvertedNodeComponent,
  })),
)

/** @noInheritDoc */
export class UnknownConvertedNode extends DecoratorNode<JSX.Element> {
  __data: UnknownConvertedNodeData

  constructor({ data, key }: { data: UnknownConvertedNodeData; key?: NodeKey }) {
    super(key)
    this.__data = data
  }

  static override clone(node: UnknownConvertedNode): UnknownConvertedNode {
    return new this({
      data: node.__data,
      key: node.__key,
    })
  }

  static override getType(): string {
    return 'unknownConverted'
  }

  static override importJSON(serializedNode: SerializedUnknownConvertedNode): UnknownConvertedNode {
    const node = $createUnknownConvertedNode({ data: serializedNode.data })
    return node
  }

  canInsertTextAfter(): true {
    return true
  }

  canInsertTextBefore(): true {
    return true
  }

  override createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('span')
    addClassNamesToElement(element, 'unknownConverted')
    return element
  }

  override decorate(): JSX.Element {
    return <Component data={this.__data} />
  }

  override exportJSON(): SerializedUnknownConvertedNode {
    return {
      type: this.getType(),
      data: this.__data,
      version: 1,
    }
  }

  // Mutation

  override isInline(): boolean {
    return true
  }

  override updateDOM(prevNode: this, dom: HTMLElement): boolean {
    return false
  }
}

export function $createUnknownConvertedNode({
  data,
}: {
  data: UnknownConvertedNodeData
}): UnknownConvertedNode {
  return $applyNodeReplacement(
    new UnknownConvertedNode({
      data,
    }),
  )
}

export function $isUnknownConvertedNode(
  node: LexicalNode | null | undefined,
): node is UnknownConvertedNode {
  return node instanceof UnknownConvertedNode
}
```

--------------------------------------------------------------------------------

---[FILE: feature.client.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/feature.client.tsx

```typescript
'use client'

import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { UnknownConvertedNode } from './nodes/unknownConvertedNode/index.js'

export const SlateToLexicalFeatureClient = createClientFeature(() => {
  return {
    nodes: [UnknownConvertedNode],
  }
})
```

--------------------------------------------------------------------------------

---[FILE: feature.server.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/feature.server.ts

```typescript
import type { SlateNodeConverter } from './converter/types.js'

import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { defaultSlateConverters } from './converter/defaultConverters.js'
import { convertSlateToLexical } from './converter/index.js'
import { UnknownConvertedNode } from './nodes/unknownConvertedNode/index.js'

export type SlateToLexicalFeatureProps = {
  /**
   * Custom converters to transform Slate nodes to Lexical nodes.
   * Can be an array of converters or a function that receives default converters and returns an array.
   * @default defaultSlateConverters
   */
  converters?:
    | (({ defaultConverters }: { defaultConverters: SlateNodeConverter[] }) => SlateNodeConverter[])
    | SlateNodeConverter[]
  /**
   * When true, disables the afterRead hook that converts Slate data on-the-fly.
   * Set this to true when running the migration script. That way, this feature is only used
   * to "pass through" the converters to the migration script.
   * @default false
   */
  disableHooks?: boolean
}

/**
 * Enables on-the-fly conversion of Slate data to Lexical format through an afterRead hook.
 * Used for testing migrations before running the permanent migration script.
 * Only converts data that is in Slate format (arrays); Lexical data passes through unchanged.
 *
 * @example
 * ```ts
 * lexicalEditor({
 *   features: ({ defaultFeatures }) => [
 *     ...defaultFeatures,
 *     SlateToLexicalFeature({
 *       converters: [...defaultSlateConverters, MyCustomConverter],
 *       disableHooks: false, // Set to true during migration script
 *     }),
 *   ],
 * })
 * ```
 */
export const SlateToLexicalFeature = createServerFeature<
  SlateToLexicalFeatureProps,
  {
    converters?: SlateNodeConverter[]
  }
>({
  feature: ({ props }) => {
    if (!props) {
      props = {}
    }

    let converters: SlateNodeConverter[] = []
    if (props?.converters && typeof props?.converters === 'function') {
      converters = props.converters({ defaultConverters: defaultSlateConverters })
    } else if (props.converters && typeof props?.converters !== 'function') {
      converters = props.converters
    } else {
      converters = defaultSlateConverters
    }

    props.converters = converters

    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#SlateToLexicalFeatureClient',
      hooks: props.disableHooks
        ? undefined
        : {
            afterRead: [
              ({ value }) => {
                if (!value || !Array.isArray(value) || 'root' in value) {
                  // incomingEditorState null or not from Slate
                  return value
                }

                // Slate => convert to lexical
                return convertSlateToLexical({
                  converters: props.converters as SlateNodeConverter[],
                  slateData: value,
                })
              },
            ],
          },
      nodes: [
        {
          node: UnknownConvertedNode,
        },
      ],
      sanitizedServerFeatureProps: {
        converters,
      },
    }
  },
  key: 'slateToLexical',
})
```

--------------------------------------------------------------------------------

---[FILE: defaultConverters.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/defaultConverters.ts

```typescript
import type { SlateNodeConverter } from './types.js'

import { SlateBlockquoteConverter } from './converters/blockquote/converter.js'
import { SlateHeadingConverter } from './converters/heading/converter.js'
import { SlateIndentConverter } from './converters/indent/converter.js'
import { SlateLinkConverter } from './converters/link/converter.js'
import { SlateListItemConverter } from './converters/listItem/converter.js'
import { SlateOrderedListConverter } from './converters/orderedList/converter.js'
import { SlateRelationshipConverter } from './converters/relationship/converter.js'
import { SlateUnknownConverter } from './converters/unknown/converter.js'
import { SlateUnorderedListConverter } from './converters/unorderedList/converter.js'
import { SlateUploadConverter } from './converters/upload/converter.js'

export const defaultSlateConverters: SlateNodeConverter[] = [
  SlateBlockquoteConverter,
  SlateHeadingConverter,
  SlateIndentConverter,
  SlateLinkConverter,
  SlateListItemConverter,
  SlateOrderedListConverter,
  SlateRelationshipConverter,
  SlateUnorderedListConverter,
  SlateUploadConverter,
  SlateUnknownConverter,
]
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/index.ts

```typescript
import type {
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedParagraphNode,
  SerializedTextNode,
} from 'lexical'

import type { SlateNode, SlateNodeConverter } from './types.js'

import { NodeFormat } from '../../../../lexical/utils/nodeFormat.js'

export function convertSlateToLexical({
  converters,
  slateData,
}: {
  converters: SlateNodeConverter[]
  slateData: SlateNode[]
}): SerializedEditorState {
  return {
    root: {
      type: 'root',
      children: convertSlateNodesToLexical({
        canContainParagraphs: true,
        converters,
        parentNodeType: 'root',
        slateNodes: slateData,
      }),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

export function convertSlateNodesToLexical({
  canContainParagraphs,
  converters,
  parentNodeType,
  slateNodes,
}: {
  canContainParagraphs: boolean
  converters: SlateNodeConverter[] | undefined
  /**
   * Type of the parent lexical node (not the type of the original, parent slate type)
   */
  parentNodeType: string
  slateNodes: SlateNode[]
}): SerializedLexicalNode[] {
  if (!converters?.length || !slateNodes?.length) {
    return []
  }
  const unknownConverter = converters.find((converter) => converter.nodeTypes.includes('unknown'))
  // @ts-expect-error - vestiges of the migration to strict mode. Probably not important enough in this file to fix
  return (
    // Flatten in case we unwrap an array of child nodes
    slateNodes.flatMap((slateNode, i) => {
      if (!('type' in slateNode)) {
        if (canContainParagraphs) {
          // This is a paragraph node. They do not have a type property in Slate
          return convertParagraphNode(converters, slateNode)
        } else {
          // Unwrap generic Slate nodes recursively since depth wasn't guaranteed by Slate, especially when copy + pasting rich text
          // - If there are children and it can't be a paragraph in Lexical, assume that the generic node should be unwrapped until the text nodes, and only assume that its a text node when there are no more children
          if (slateNode.children) {
            return convertSlateNodesToLexical({
              canContainParagraphs,
              converters,
              parentNodeType,
              slateNodes: slateNode.children || [],
            })
          }
          // This is a simple text node. canContainParagraphs may be false if this is nested inside a paragraph already, since paragraphs cannot contain paragraphs
          return convertTextNode(slateNode)
        }
      }
      if (slateNode.type === 'p') {
        return convertParagraphNode(converters, slateNode)
      }

      const converter = converters.find((converter) =>
        converter.nodeTypes.includes(slateNode.type!),
      )

      if (converter) {
        return converter.converter({ childIndex: i, converters, parentNodeType, slateNode })
      }

      console.warn('slateToLexical > No converter found for node type: ' + slateNode.type)
      return unknownConverter?.converter({
        childIndex: i,
        converters,
        parentNodeType,
        slateNode,
      })
    }) || []
  )
}

export function convertParagraphNode(
  converters: SlateNodeConverter[],
  node: SlateNode,
): SerializedParagraphNode {
  return {
    type: 'paragraph',
    children: convertSlateNodesToLexical({
      canContainParagraphs: false,
      converters,
      parentNodeType: 'paragraph',
      slateNodes: node.children || [],
    }),
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
    version: 1,
  }
}
export function convertTextNode(node: SlateNode): SerializedTextNode {
  return {
    type: 'text',
    detail: 0,
    format: convertNodeToFormat(node),
    mode: 'normal',
    style: '',
    text: node.text ?? '',
    version: 1,
  }
}

export function convertNodeToFormat(node: SlateNode): number {
  let format = 0
  if (node.bold) {
    format = format | NodeFormat.IS_BOLD
  }
  if (node.italic) {
    format = format | NodeFormat.IS_ITALIC
  }
  if (node.strikethrough) {
    format = format | NodeFormat.IS_STRIKETHROUGH
  }
  if (node.underline) {
    format = format | NodeFormat.IS_UNDERLINE
  }
  if (node.subscript) {
    format = format | NodeFormat.IS_SUBSCRIPT
  }
  if (node.superscript) {
    format = format | NodeFormat.IS_SUPERSCRIPT
  }
  if (node.code) {
    format = format | NodeFormat.IS_CODE
  }
  return format
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/types.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'

export type SlateNodeConverter<T extends SerializedLexicalNode = SerializedLexicalNode> = {
  converter: ({
    childIndex,
    converters,
    parentNodeType,
    slateNode,
  }: {
    childIndex: number
    converters: SlateNodeConverter[]
    parentNodeType: string
    slateNode: SlateNode
  }) => T
  nodeTypes: string[]
}

export type SlateNode = {
  [key: string]: any
  children?: SlateNode[]
  type?: string // doesn't always have type, e.g. for paragraphs
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/converters/blockquote/converter.ts

```typescript
import type { SerializedQuoteNode } from '../../../../../blockquote/server/index.js'
import type { SlateNodeConverter } from '../../types.js'

import { convertSlateNodesToLexical } from '../../index.js'

export const SlateBlockquoteConverter: SlateNodeConverter = {
  converter({ converters, slateNode }) {
    return {
      type: 'quote',
      children: convertSlateNodesToLexical({
        canContainParagraphs: false,
        converters,
        parentNodeType: 'quote',
        slateNodes: slateNode.children!,
      }),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    } as const as SerializedQuoteNode
  },
  nodeTypes: ['blockquote'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/converters/heading/converter.ts

```typescript
import type { SerializedHeadingNode } from '../../../../../heading/server/index.js'
import type { SlateNodeConverter } from '../../types.js'

import { convertSlateNodesToLexical } from '../../index.js'

export const SlateHeadingConverter: SlateNodeConverter = {
  converter({ converters, slateNode }) {
    return {
      type: 'heading',
      children: convertSlateNodesToLexical({
        canContainParagraphs: false,
        converters,
        parentNodeType: 'heading',
        slateNodes: slateNode.children!,
      }),
      direction: 'ltr',
      format: '',
      indent: 0,
      tag: slateNode.type as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', // Slate puts the tag (h1 / h2 / ...) inside of node.type
      version: 1,
    } as const as SerializedHeadingNode
  },
  nodeTypes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/converters/indent/converter.ts

```typescript
import type { SerializedLexicalNode, SerializedParagraphNode } from 'lexical'

import type { SlateNodeConverter } from '../../types.js'

import { convertSlateNodesToLexical } from '../../index.js'

export const SlateIndentConverter: SlateNodeConverter = {
  converter({ converters, slateNode }) {
    const convertChildren = (node: any, indentLevel: number = 0): SerializedLexicalNode => {
      if (
        (node?.type && (!node.children || node.type !== 'indent')) ||
        (!node?.type && node?.text)
      ) {
        return {
          ...convertSlateNodesToLexical({
            canContainParagraphs: false,
            converters,
            parentNodeType: 'indent',
            slateNodes: [node],
          })[0],
          indent: indentLevel,
        } as const as SerializedLexicalNode
      }

      const children = node.children.map((child: any) => convertChildren(child, indentLevel + 1))
      return {
        type: 'paragraph',
        children,
        direction: 'ltr',
        format: '',
        indent: indentLevel,
        version: 1,
      } as const as SerializedParagraphNode
    }

    return convertChildren(slateNode)
  },
  nodeTypes: ['indent'],
}
```

--------------------------------------------------------------------------------

````
