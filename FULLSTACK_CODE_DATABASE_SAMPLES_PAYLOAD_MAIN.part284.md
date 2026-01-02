---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 284
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 284 of 695)

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

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/converters/link/converter.ts

```typescript
import type { SerializedLinkNode } from '../../../../../link/nodes/types.js'
import type { SlateNodeConverter } from '../../types.js'

import { convertSlateNodesToLexical } from '../../index.js'

export const SlateLinkConverter: SlateNodeConverter = {
  converter({ converters, slateNode }) {
    return {
      type: 'link',
      children: convertSlateNodesToLexical({
        canContainParagraphs: false,
        converters,
        parentNodeType: 'link',
        slateNodes: slateNode.children!,
      }),
      direction: 'ltr',
      fields: {
        ...(slateNode.fields || {}),
        doc: slateNode.doc || null,
        linkType: slateNode.linkType || 'custom',
        newTab: slateNode.newTab || false,
        url: (slateNode.linkType || 'custom') === 'custom' ? slateNode.url || 'https' : undefined, // can be undefined only if linkType is not custom, otherwise: validation error
      },
      format: '',
      indent: 0,
      version: 2,
    } as const as SerializedLinkNode
  },
  nodeTypes: ['link'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/converters/listItem/converter.ts

```typescript
import type { SerializedListItemNode } from '../../../../../lists/plugin/index.js'
import type { SlateNodeConverter } from '../../types.js'

import { convertSlateNodesToLexical } from '../../index.js'

export const SlateListItemConverter: SlateNodeConverter = {
  converter({ childIndex, converters, slateNode }) {
    return {
      type: 'listitem',
      checked: undefined,
      children: convertSlateNodesToLexical({
        canContainParagraphs: false,
        converters,
        parentNodeType: 'listitem',
        slateNodes: slateNode.children!,
      }),
      direction: 'ltr',
      format: '',
      indent: 0,
      value: childIndex + 1,
      version: 1,
    } as const as SerializedListItemNode
  },
  nodeTypes: ['li'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/converters/orderedList/converter.ts

```typescript
import type { SerializedListNode } from '../../../../../lists/plugin/index.js'
import type { SlateNodeConverter } from '../../types.js'

import { convertSlateNodesToLexical } from '../../index.js'

export const SlateOrderedListConverter: SlateNodeConverter = {
  converter({ converters, slateNode }) {
    return {
      type: 'list',
      children: convertSlateNodesToLexical({
        canContainParagraphs: false,
        converters,
        parentNodeType: 'list',
        slateNodes: slateNode.children!,
      }),
      direction: 'ltr',
      format: '',
      indent: 0,
      listType: 'number',
      start: 1,
      tag: 'ol',
      version: 1,
    } as const as SerializedListNode
  },
  nodeTypes: ['ol'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/converters/relationship/converter.ts

```typescript
import type { SerializedRelationshipNode } from '../../../../../relationship/server/nodes/RelationshipNode.js'
import type { SlateNodeConverter } from '../../types.js'

export const SlateRelationshipConverter: SlateNodeConverter = {
  converter({ slateNode }) {
    return {
      type: 'relationship',
      format: '',
      relationTo: slateNode.relationTo,
      value: slateNode?.value?.id || '',
      version: 2,
    } as const as SerializedRelationshipNode
  },
  nodeTypes: ['relationship'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/converters/unknown/converter.ts

```typescript
import type { SerializedUnknownConvertedNode } from '../../../nodes/unknownConvertedNode/index.js'
import type { SlateNodeConverter } from '../../types.js'

import { convertSlateNodesToLexical } from '../../index.js'

export const SlateUnknownConverter: SlateNodeConverter = {
  converter({ converters, slateNode }) {
    return {
      type: 'unknownConverted',
      children: convertSlateNodesToLexical({
        canContainParagraphs: false,
        converters,
        parentNodeType: 'unknownConverted',
        slateNodes: slateNode.children!,
      }),
      data: {
        nodeData: slateNode,
        nodeType: slateNode.type,
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
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/converters/unorderedList/converter.ts

```typescript
import type { SerializedListNode } from '../../../../../lists/plugin/index.js'
import type { SlateNodeConverter } from '../../types.js'

import { convertSlateNodesToLexical } from '../../index.js'

export const SlateUnorderedListConverter: SlateNodeConverter = {
  converter({ converters, slateNode }) {
    return {
      type: 'list',
      children: convertSlateNodesToLexical({
        canContainParagraphs: false,
        converters,
        parentNodeType: 'list',
        slateNodes: slateNode.children!,
      }),
      direction: 'ltr',
      format: '',
      indent: 0,
      listType: 'bullet',
      start: 1,
      tag: 'ul',
      version: 1,
    } as const as SerializedListNode
  },
  nodeTypes: ['ul'],
}
```

--------------------------------------------------------------------------------

---[FILE: converter.ts]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/converter/converters/upload/converter.ts

```typescript
import type { SerializedUploadNode } from '../../../../../upload/server/nodes/UploadNode.js'
import type { SlateNodeConverter } from '../../types.js'

export const SlateUploadConverter: SlateNodeConverter = {
  converter({ slateNode }) {
    return {
      type: 'upload',
      fields: {
        ...slateNode.fields,
      },
      format: '',
      relationTo: slateNode.relationTo,
      value: slateNode.value?.id || '',
      version: 2,
    } as const as SerializedUploadNode
  },
  nodeTypes: ['upload'],
}
```

--------------------------------------------------------------------------------

---[FILE: Component.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/nodes/unknownConvertedNode/Component.tsx
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
      Unknown converted Slate node: <strong>{data?.nodeType}</strong>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/nodes/unknownConvertedNode/index.scss

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
Location: payload-main/packages/richtext-lexical/src/features/migrations/slateToLexical/nodes/unknownConvertedNode/index.tsx
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

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/paragraph/client/index.tsx

```typescript
'use client'

import { $setBlocksType } from '@lexical/selection'
import { $createParagraphNode, $getSelection, $isParagraphNode, $isRangeSelection } from 'lexical'

import type { ToolbarGroup } from '../../toolbars/types.js'

import { TextIcon } from '../../../lexical/ui/icons/Text/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { slashMenuBasicGroupWithItems } from '../../shared/slashMenu/basicGroup.js'
import { toolbarTextDropdownGroupWithItems } from '../../shared/toolbar/textDropdownGroup.js'

const toolbarGroups: ToolbarGroup[] = [
  toolbarTextDropdownGroupWithItems([
    {
      ChildComponent: TextIcon,
      isActive: ({ selection }) => {
        if (!$isRangeSelection(selection)) {
          return false
        }
        for (const node of selection.getNodes()) {
          if (!$isParagraphNode(node) && !$isParagraphNode(node.getParent())) {
            return false
          }
        }
        return true
      },
      key: 'paragraph',
      label: ({ i18n }) => {
        return i18n.t('lexical:paragraph:label2')
      },
      onSelect: ({ editor }) => {
        editor.update(() => {
          const selection = $getSelection()
          $setBlocksType(selection, () => $createParagraphNode())
        })
      },
      order: 1,
    },
  ]),
]

export const ParagraphFeatureClient = createClientFeature({
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: TextIcon,
          key: 'paragraph',
          keywords: ['normal', 'paragraph', 'p', 'text'],
          label: ({ i18n }) => {
            return i18n.t('lexical:paragraph:label')
          },
          onSelect: ({ editor }) => {
            editor.update(() => {
              const selection = $getSelection()
              $setBlocksType(selection, () => $createParagraphNode())
            })
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
Location: payload-main/packages/richtext-lexical/src/features/paragraph/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    label: 'فقرة',
    label2: 'نص عادي',
  },
  az: {
    label: 'Paraqraf',
    label2: 'Normal Mətn',
  },
  bg: {
    label: 'Параграф',
    label2: 'Нормален текст',
  },
  cs: {
    label: 'Odstavec',
    label2: 'Normální text',
  },
  da: {
    label: 'Afsnit',
    label2: 'Normal tekst',
  },
  de: {
    label: 'Paragraph',
    label2: 'Normaler Text',
  },
  en: {
    label: 'Paragraph',
    label2: 'Normal Text',
  },
  es: {
    label: 'Párrafo',
    label2: 'Texto normal',
  },
  et: {
    label: 'Paragrahv',
    label2: 'Tavaline tekst',
  },
  fa: {
    label: 'پاراگراف',
    label2: 'متن عادی',
  },
  fr: {
    label: 'Paragraphe',
    label2: 'Texte normal',
  },
  he: {
    label: 'פסקה',
    label2: 'טקסט רגיל',
  },
  hr: {
    label: 'Odlomak',
    label2: 'Normalan tekst',
  },
  hu: {
    label: 'Bekezdés',
    label2: 'Normál szöveg',
  },
  is: {
    label: 'Málsgrein',
    label2: 'Venjulegur texti',
  },
  it: {
    label: 'Paragrafo',
    label2: 'Testo normale',
  },
  ja: {
    label: '段落',
    label2: '通常のテキスト',
  },
  ko: {
    label: '문단',
    label2: '일반 텍스트',
  },
  my: {
    label: 'Perenggan',
    label2: 'ပုံမှန်စာသား',
  },
  nb: {
    label: 'Avsnitt',
    label2: 'Normal tekst',
  },
  nl: {
    label: 'Paragraaf',
    label2: 'Normale tekst',
  },
  pl: {
    label: 'Akapit',
    label2: 'Normalny tekst',
  },
  pt: {
    label: 'Parágrafo',
    label2: 'Texto Normal',
  },
  ro: {
    label: 'Paragraf',
    label2: 'Text normal',
  },
  rs: {
    label: 'Параграф',
    label2: 'Oбичан текст',
  },
  'rs-latin': {
    label: 'Paragraf',
    label2: 'Običan tekst',
  },
  ru: {
    label: 'Параграф',
    label2: 'Нормальный текст',
  },
  sk: {
    label: 'Odsek',
    label2: 'Normálny text',
  },
  sl: {
    label: 'Odstavek',
    label2: 'Navaden besedilo',
  },
  sv: {
    label: 'Stycke',
    label2: 'Normal Text',
  },
  ta: {
    label: 'பத்தி',
    label2: 'சாதாரண உரை',
  },
  th: {
    label: 'ย่อหน้า',
    label2: 'ข้อความธรรมดา',
  },
  tr: {
    label: 'Paragraf',
    label2: 'Normal Metin',
  },
  uk: {
    label: 'Абзац',
    label2: 'Звичайний текст',
  },
  vi: {
    label: 'Đoạn văn',
    label2: 'Văn bản bình thường',
  },
  zh: {
    label: '段落',
    label2: '正常文本',
  },
  'zh-TW': {
    label: '段落',
    label2: '正常文本',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/paragraph/server/index.ts

```typescript
import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { i18n } from './i18n.js'

export const ParagraphFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#ParagraphFeatureClient',
    clientFeatureProps: null,
    i18n,
  },
  key: 'paragraph',
})
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/relationship/client/index.tsx

```typescript
'use client'

import { $isNodeSelection } from 'lexical'

import type { RelationshipFeatureProps } from '../server/index.js'

import { RelationshipIcon } from '../../../lexical/ui/icons/Relationship/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { slashMenuBasicGroupWithItems } from '../../shared/slashMenu/basicGroup.js'
import { toolbarAddDropdownGroupWithItems } from '../../shared/toolbar/addDropdownGroup.js'
import { INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND } from './drawer/commands.js'
import { $isRelationshipNode, RelationshipNode } from './nodes/RelationshipNode.js'
import { RelationshipPlugin } from './plugins/index.js'

export const RelationshipFeatureClient = createClientFeature<RelationshipFeatureProps>({
  nodes: [RelationshipNode],
  plugins: [
    {
      Component: RelationshipPlugin,
      position: 'normal',
    },
  ],
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: RelationshipIcon,
          key: 'relationship',
          keywords: ['relationship', 'relation', 'rel'],
          label: ({ i18n }) => {
            return i18n.t('lexical:relationship:label')
          },
          onSelect: ({ editor }) => {
            // dispatch INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND
            editor.dispatchCommand(INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND, {
              replace: false,
            })
          },
        },
      ]),
    ],
  },
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems([
        {
          ChildComponent: RelationshipIcon,
          isActive: ({ selection }) => {
            if (!$isNodeSelection(selection) || !selection.getNodes().length) {
              return false
            }

            const firstNode = selection.getNodes()[0]
            return $isRelationshipNode(firstNode)
          },
          key: 'relationship',
          label: ({ i18n }) => {
            return i18n.t('lexical:relationship:label')
          },
          onSelect: ({ editor }) => {
            // dispatch INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND
            editor.dispatchCommand(INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND, {
              replace: false,
            })
          },
        },
      ]),
    ],
  },
})
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/relationship/client/components/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .LexicalEditorTheme__relationship {
    @extend %body;
    @include shadow-sm;
    padding: calc(var(--base) * 0.75);
    background: var(--theme-input-bg);
    border: 1px solid var(--theme-elevation-100);
    border-radius: $style-radius-m;
    max-width: calc(var(--base) * 15);
    font-family: var(--font-body);
    margin-block: base(0.5);
    color: var(--theme-text);

    &__contents {
      display: flex;
      align-items: center;
    }

    &:hover {
      border: 1px solid var(--theme-elevation-150);
    }

    &__label {
      margin-bottom: calc(var(--base) * 0.25);
    }

    &__title {
      margin: 0;
    }

    &__label,
    &__title {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 1 !important;
    }

    &__title {
      font-weight: bold;
    }

    &__wrap {
      flex-grow: 1;
      overflow: hidden;
    }

    &__doc-drawer-toggler {
      text-decoration: underline;
      pointer-events: all;
      line-height: inherit;
      & > * {
        margin: 0;
      }
    }

    &__swapButton.btn {
      margin: 0;
    }

    &__doc-drawer-toggler,
    &__swapButton {
      &:disabled {
        color: var(--theme-elevation-300);
        pointer-events: none;
      }
    }

    &__actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin-left: calc(var(--base) * 0.5);

      & > *:not(:last-child) {
        margin-right: calc(var(--base) * 0.25);
      }
    }

    &__removeButton.btn {
      margin: 0;

      line {
        stroke-width: $style-stroke-width-m;
      }

      &:disabled {
        color: var(--theme-elevation-300);
        pointer-events: none;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: RelationshipComponent.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/relationship/client/components/RelationshipComponent.tsx
Signals: React

```typescript
'use client'
import type { ElementFormatType } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { getTranslation } from '@payloadcms/translations'
import { Button, useConfig, usePayloadAPI, useTranslation } from '@payloadcms/ui'
import { $getNodeByKey } from 'lexical'
import React, { useCallback, useReducer, useRef, useState } from 'react'

import type { RelationshipData } from '../../server/nodes/RelationshipNode.js'

import { useLexicalDocumentDrawer } from '../../../../utilities/fieldsDrawer/useLexicalDocumentDrawer.js'
import './index.scss'
import { INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND } from '../drawer/commands.js'

const initialParams = {
  depth: 0,
}

type Props = {
  className: string
  data: RelationshipData
  format?: ElementFormatType
  nodeKey?: string
}

export const RelationshipComponent: React.FC<Props> = (props) => {
  const {
    className: baseClass,
    data: { relationTo, value },
    nodeKey,
  } = props

  if (typeof value === 'object') {
    throw new Error(
      'Relationship value should be a string or number. The Lexical Relationship component should not receive the populated value object.',
    )
  }

  const relationshipElemRef = useRef<HTMLDivElement | null>(null)

  const [editor] = useLexicalComposerContext()
  const isEditable = useLexicalEditable()
  const {
    config: {
      routes: { api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const [relatedCollection] = useState(() => getEntityConfig({ collectionSlug: relationTo }))

  const { i18n, t } = useTranslation()
  const [cacheBust, dispatchCacheBust] = useReducer((state) => state + 1, 0)
  const [{ data }, { setParams }] = usePayloadAPI(
    `${serverURL}${api}/${relatedCollection.slug}/${value}`,
    { initialParams },
  )

  const { closeDocumentDrawer, DocumentDrawer, DocumentDrawerToggler } = useLexicalDocumentDrawer({
    id: value,
    collectionSlug: relatedCollection.slug,
  })

  const removeRelationship = useCallback(() => {
    editor.update(() => {
      $getNodeByKey(nodeKey!)?.remove()
    })
  }, [editor, nodeKey])

  const updateRelationship = React.useCallback(() => {
    setParams({
      ...initialParams,
      cacheBust, // do this to get the usePayloadAPI to re-fetch the data even though the URL string hasn't changed
    })

    closeDocumentDrawer()
    dispatchCacheBust()
  }, [cacheBust, setParams, closeDocumentDrawer])

  return (
    <div className={`${baseClass}__contents`} contentEditable={false} ref={relationshipElemRef}>
      <div className={`${baseClass}__wrap`}>
        <p className={`${baseClass}__label`}>
          {t('fields:labelRelationship', {
            label: relatedCollection.labels?.singular
              ? getTranslation(relatedCollection.labels?.singular, i18n)
              : relatedCollection.slug,
          })}
        </p>
        <DocumentDrawerToggler className={`${baseClass}__doc-drawer-toggler`}>
          <p className={`${baseClass}__title`}>
            {data ? data[relatedCollection?.admin?.useAsTitle || 'id'] : value}
          </p>
        </DocumentDrawerToggler>
      </div>
      {isEditable && (
        <div className={`${baseClass}__actions`}>
          <Button
            buttonStyle="icon-label"
            className={`${baseClass}__swapButton`}
            disabled={!isEditable}
            el="button"
            icon="swap"
            onClick={() => {
              if (nodeKey) {
                editor.dispatchCommand(INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND, {
                  replace: { nodeKey },
                })
              }
            }}
            round
            tooltip={t('fields:swapRelationship')}
          />
          <Button
            buttonStyle="icon-label"
            className={`${baseClass}__removeButton`}
            disabled={!isEditable}
            icon="x"
            onClick={(e) => {
              e.preventDefault()
              removeRelationship()
            }}
            round
            tooltip={t('fields:removeRelationship')}
          />
        </div>
      )}

      {!!value && <DocumentDrawer onSave={updateRelationship} />}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: commands.ts]---
Location: payload-main/packages/richtext-lexical/src/features/relationship/client/drawer/commands.ts

```typescript
import type { LexicalCommand } from 'lexical'

import { createCommand } from 'lexical'

export const INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND: LexicalCommand<{
  replace: { nodeKey: string } | false
}> = createCommand('INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND')
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/relationship/client/drawer/index.tsx
Signals: React

```typescript
'use client'
import type { LexicalEditor } from 'lexical'
import type { CollectionSlug } from 'payload'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { type ListDrawerProps, toast } from '@payloadcms/ui'
import { $getNodeByKey, COMMAND_PRIORITY_EDITOR } from 'lexical'
import React, { useCallback, useEffect, useState } from 'react'

import { useLexicalListDrawer } from '../../../../utilities/fieldsDrawer/useLexicalListDrawer.js'
import { $createRelationshipNode } from '../nodes/RelationshipNode.js'
import { INSERT_RELATIONSHIP_COMMAND } from '../plugins/index.js'
import { INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND } from './commands.js'

const insertRelationship = ({
  editor,
  relationTo,
  replaceNodeKey,
  value,
}: {
  editor: LexicalEditor
  relationTo: string
  replaceNodeKey: null | string
  value: number | string
}) => {
  if (!replaceNodeKey) {
    editor.dispatchCommand(INSERT_RELATIONSHIP_COMMAND, {
      relationTo,
      value,
    })
  } else {
    editor.update(() => {
      const node = $getNodeByKey(replaceNodeKey)
      if (node) {
        node.replace($createRelationshipNode({ relationTo, value }))
      }
    })
  }
}

type Props = {
  enabledCollectionSlugs: CollectionSlug[]
}

const RelationshipDrawerComponent: React.FC<Props> = ({ enabledCollectionSlugs }) => {
  const [editor] = useLexicalComposerContext()

  const [replaceNodeKey, setReplaceNodeKey] = useState<null | string>(null)

  const { closeListDrawer, ListDrawer, openListDrawer } = useLexicalListDrawer({
    collectionSlugs: enabledCollectionSlugs,
    selectedCollection: enabledCollectionSlugs?.[0],
  })

  useEffect(() => {
    return editor.registerCommand<{
      replace: { nodeKey: string } | false
    }>(
      INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND,
      (payload) => {
        setReplaceNodeKey(payload?.replace ? payload?.replace.nodeKey : null)
        openListDrawer()
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor, openListDrawer])

  const onSelect = useCallback<NonNullable<ListDrawerProps['onSelect']>>(
    ({ collectionSlug, doc }) => {
      insertRelationship({
        editor,
        relationTo: collectionSlug,
        replaceNodeKey,
        value: doc.id,
      })
      closeListDrawer()
    },
    [editor, closeListDrawer, replaceNodeKey],
  )

  return <ListDrawer onSelect={onSelect} />
}

const RelationshipDrawerComponentFallback: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand<{
      replace: { nodeKey: string } | false
    }>(
      INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND,
      () => {
        toast.error('No relationship collections enabled')
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return null
}

export const RelationshipDrawer = ({ enabledCollectionSlugs }: Props): React.ReactNode => {
  if (!enabledCollectionSlugs?.length) {
    return <RelationshipDrawerComponentFallback />
  }

  return <RelationshipDrawerComponent enabledCollectionSlugs={enabledCollectionSlugs} />
}
```

--------------------------------------------------------------------------------

---[FILE: RelationshipNode.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/relationship/client/nodes/RelationshipNode.tsx
Signals: React

```typescript
'use client'
import type { JSX } from 'react'

import {
  $applyNodeReplacement,
  type DOMConversionMap,
  type DOMConversionOutput,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
} from 'lexical'
import * as React from 'react'

import type {
  RelationshipData,
  SerializedRelationshipNode,
} from '../../server/nodes/RelationshipNode.js'

import { RelationshipServerNode } from '../../server/nodes/RelationshipNode.js'

const RelationshipComponent = React.lazy(() =>
  import('../components/RelationshipComponent.js').then((module) => ({
    default: module.RelationshipComponent,
  })),
)

function $relationshipElementToNode(domNode: HTMLDivElement): DOMConversionOutput | null {
  const id = domNode.getAttribute('data-lexical-relationship-id')
  const relationTo = domNode.getAttribute('data-lexical-relationship-relationTo')

  if (id != null && relationTo != null) {
    const node = $createRelationshipNode({
      relationTo,
      value: id,
    })
    return { node }
  }
  return null
}

export class RelationshipNode extends RelationshipServerNode {
  static override clone(node: RelationshipServerNode): RelationshipServerNode {
    return super.clone(node)
  }

  static override getType(): string {
    return super.getType()
  }

  static override importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      div: (domNode: HTMLDivElement) => {
        if (
          !domNode.hasAttribute('data-lexical-relationship-relationTo') ||
          !domNode.hasAttribute('data-lexical-relationship-id')
        ) {
          return null
        }
        return {
          conversion: $relationshipElementToNode,
          priority: 2,
        }
      },
    }
  }

  static override importJSON(serializedNode: SerializedRelationshipNode): RelationshipNode {
    if (serializedNode.version === 1 && (serializedNode?.value as unknown as { id: string })?.id) {
      serializedNode.value = (serializedNode.value as unknown as { id: string }).id
    }

    const importedData: RelationshipData = {
      relationTo: serializedNode.relationTo,
      value: serializedNode.value,
    }
    const node = $createRelationshipNode(importedData)
    node.setFormat(serializedNode.format)
    return node
  }

  override decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return (
      <RelationshipComponent
        className={config.theme.relationship ?? 'LexicalEditorTheme__relationship'}
        data={this.__data}
        format={this.__format}
        nodeKey={this.getKey()}
      />
    )
  }

  override exportJSON(): SerializedRelationshipNode {
    return super.exportJSON()
  }
}

export function $createRelationshipNode(data: RelationshipData): RelationshipNode {
  return $applyNodeReplacement(
    new RelationshipNode({
      data,
    }),
  )
}

export function $isRelationshipNode(
  node: LexicalNode | null | RelationshipNode | undefined,
): node is RelationshipNode {
  return node instanceof RelationshipNode
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/relationship/client/plugins/index.tsx
Signals: React

```typescript
'use client'
import type { LexicalCommand } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { $insertNodeToNearestRoot } from '@lexical/utils'
import {
  $getPreviousSelection,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from 'lexical'
import { useEffect } from 'react'

import type { PluginComponent } from '../../../typesClient.js'
import type { RelationshipFeatureProps } from '../../server/index.js'
import type { RelationshipData } from '../../server/nodes/RelationshipNode.js'

import { RelationshipDrawer } from '../drawer/index.js'
import { $createRelationshipNode, RelationshipNode } from '../nodes/RelationshipNode.js'
import { useEnabledRelationships } from '../utils/useEnabledRelationships.js'

export const INSERT_RELATIONSHIP_COMMAND: LexicalCommand<RelationshipData> = createCommand(
  'INSERT_RELATIONSHIP_COMMAND',
)

export const RelationshipPlugin: PluginComponent<RelationshipFeatureProps> = ({ clientProps }) => {
  const [editor] = useLexicalComposerContext()

  const { enabledCollectionSlugs } = useEnabledRelationships({
    collectionSlugsBlacklist: clientProps?.disabledCollections,
    collectionSlugsWhitelist: clientProps?.enabledCollections,
  })

  useEffect(() => {
    if (!editor.hasNodes([RelationshipNode])) {
      throw new Error('RelationshipPlugin: RelationshipNode not registered on editor')
    }

    return editor.registerCommand<RelationshipData>(
      INSERT_RELATIONSHIP_COMMAND,
      (payload) => {
        const selection = $getSelection() || $getPreviousSelection()

        if ($isRangeSelection(selection)) {
          const relationshipNode = $createRelationshipNode(payload)
          // we need to get the focus node before inserting the block node, as $insertNodeToNearestRoot can change the focus node
          const { focus } = selection
          const focusNode = focus.getNode()
          // Insert relationship node BEFORE potentially removing focusNode, as $insertNodeToNearestRoot errors if the focusNode doesn't exist
          $insertNodeToNearestRoot(relationshipNode)

          // Delete the node it it's an empty paragraph
          if ($isParagraphNode(focusNode) && !focusNode.__first) {
            focusNode.remove()
          }
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return <RelationshipDrawer enabledCollectionSlugs={enabledCollectionSlugs} />
}
```

--------------------------------------------------------------------------------

---[FILE: useEnabledRelationships.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/relationship/client/utils/useEnabledRelationships.tsx
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig, CollectionSlug } from 'payload'

import { useConfig, useEntityVisibility } from '@payloadcms/ui'
import * as React from 'react'

type UseEnabledRelationshipsOptions = {
  collectionSlugsBlacklist?: string[]
  collectionSlugsWhitelist?: string[]
  uploads?: boolean
}

type UseEnabledRelationshipsResult = {
  enabledCollections: ClientCollectionConfig[]
  enabledCollectionSlugs: CollectionSlug[]
}

export const useEnabledRelationships = (
  options?: UseEnabledRelationshipsOptions,
): UseEnabledRelationshipsResult => {
  const { collectionSlugsBlacklist, collectionSlugsWhitelist, uploads = false } = options || {}
  const {
    config: { collections },
  } = useConfig()
  const { visibleEntities } = useEntityVisibility()

  const result = React.useMemo(() => {
    const enabledCollectionSlugs: string[] = []
    const enabledCollections: ClientCollectionConfig[] = []
    const whitelistSet = collectionSlugsWhitelist ? new Set(collectionSlugsWhitelist) : null
    const blacklistSet = collectionSlugsBlacklist ? new Set(collectionSlugsBlacklist) : null

    for (const collection of collections) {
      const {
        slug,
        admin: { enableRichTextRelationship },
        upload,
      } = collection

      // Check visibility
      if (!visibleEntities?.collections.includes(slug)) {
        continue
      }

      // Check rich text relationship and upload settings
      if (uploads) {
        if (!enableRichTextRelationship || !upload) {
          continue
        }
      } else {
        if (upload || !enableRichTextRelationship) {
          continue
        }
      }

      // Check whitelist (if provided, only include slugs in the whitelist)
      if (whitelistSet && !whitelistSet.has(slug)) {
        continue
      }

      // Check blacklist (if provided, exclude slugs in the blacklist)
      if (blacklistSet && blacklistSet.has(slug)) {
        continue
      }

      enabledCollectionSlugs.push(slug)
      enabledCollections.push(collection)
    }

    return { enabledCollections, enabledCollectionSlugs }
  }, [collections, visibleEntities, uploads, collectionSlugsWhitelist, collectionSlugsBlacklist])

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: graphQLPopulationPromise.ts]---
Location: payload-main/packages/richtext-lexical/src/features/relationship/server/graphQLPopulationPromise.ts

```typescript
import type { PopulationPromise } from '../../typesServer.js'
import type { RelationshipFeatureProps } from './index.js'
import type { SerializedRelationshipNode } from './nodes/RelationshipNode.js'

import { populate } from '../../../populateGraphQL/populate.js'

export const relationshipPopulationPromiseHOC = (
  props: RelationshipFeatureProps,
): PopulationPromise<SerializedRelationshipNode> => {
  const relationshipPopulationPromise: PopulationPromise<SerializedRelationshipNode> = ({
    currentDepth,
    depth,
    draft,
    node,
    overrideAccess,
    populationPromises,
    req,
    showHiddenFields,
  }) => {
    if (node?.value) {
      // @ts-expect-error
      const id = node?.value?.id || node?.value // for backwards-compatibility

      const collection = req.payload.collections[node?.relationTo]

      if (collection) {
        const populateDepth =
          props?.maxDepth !== undefined && props?.maxDepth < depth ? props?.maxDepth : depth

        populationPromises.push(
          populate({
            id,
            collectionSlug: collection.config.slug,
            currentDepth,
            data: node,
            depth: populateDepth,
            draft,
            key: 'value',
            overrideAccess,
            req,
            showHiddenFields,
          }),
        )
      }
    }
  }

  return relationshipPopulationPromise
}
```

--------------------------------------------------------------------------------

````
