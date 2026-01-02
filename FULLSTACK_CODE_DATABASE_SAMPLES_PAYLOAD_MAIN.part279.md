---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 279
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 279 of 695)

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

---[FILE: feature.server.ts]---
Location: payload-main/packages/richtext-lexical/src/features/format/inlineCode/feature.server.ts

```typescript
import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { INLINE_CODE } from './markdownTransformers.js'

export const InlineCodeFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#InlineCodeFeatureClient',
    markdownTransformers: [INLINE_CODE],
  },
  key: 'inlineCode',
})
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformers.ts]---
Location: payload-main/packages/richtext-lexical/src/features/format/inlineCode/markdownTransformers.ts

```typescript
import type { TextFormatTransformer } from '../../../packages/@lexical/markdown/MarkdownTransformers.js'

export const INLINE_CODE: TextFormatTransformer = {
  type: 'text-format',
  format: ['code'],
  tag: '`',
}
```

--------------------------------------------------------------------------------

---[FILE: feature.client.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/format/italic/feature.client.tsx

```typescript
'use client'

import { $isTableSelection } from '@lexical/table'
import { $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'

import type { ToolbarGroup } from '../../toolbars/types.js'

import { ItalicIcon } from '../../../lexical/ui/icons/Italic/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { toolbarFormatGroupWithItems } from '../shared/toolbarFormatGroup.js'
import { ITALIC_STAR, ITALIC_UNDERSCORE } from './markdownTransformers.js'

const toolbarGroups: ToolbarGroup[] = [
  toolbarFormatGroupWithItems([
    {
      ChildComponent: ItalicIcon,
      isActive: ({ selection }) => {
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
          return selection.hasFormat('italic')
        }
        return false
      },
      key: 'italic',
      onSelect: ({ editor }) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
      },
      order: 2,
    },
  ]),
]

export const ItalicFeatureClient = createClientFeature({
  enableFormats: ['italic'],
  markdownTransformers: [ITALIC_STAR, ITALIC_UNDERSCORE],
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
```

--------------------------------------------------------------------------------

---[FILE: feature.server.ts]---
Location: payload-main/packages/richtext-lexical/src/features/format/italic/feature.server.ts

```typescript
import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { ITALIC_STAR, ITALIC_UNDERSCORE } from './markdownTransformers.js'

export const ItalicFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#ItalicFeatureClient',
    markdownTransformers: [ITALIC_STAR, ITALIC_UNDERSCORE],
  },
  key: 'italic',
})
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformers.ts]---
Location: payload-main/packages/richtext-lexical/src/features/format/italic/markdownTransformers.ts

```typescript
import type { TextFormatTransformer } from '../../../packages/@lexical/markdown/MarkdownTransformers.js'

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
```

--------------------------------------------------------------------------------

---[FILE: toolbarFormatGroup.ts]---
Location: payload-main/packages/richtext-lexical/src/features/format/shared/toolbarFormatGroup.ts

```typescript
'use client'
import type { ToolbarGroup, ToolbarGroupItem } from '../../toolbars/types.js'

export const toolbarFormatGroupWithItems = (items: ToolbarGroupItem[]): ToolbarGroup => {
  return {
    type: 'buttons',
    items,
    key: 'format',
    order: 40,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: feature.client.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/format/strikethrough/feature.client.tsx

```typescript
'use client'

import { $isTableSelection } from '@lexical/table'
import { $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'

import { StrikethroughIcon } from '../../../lexical/ui/icons/Strikethrough/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { toolbarFormatGroupWithItems } from '../shared/toolbarFormatGroup.js'
import { STRIKETHROUGH } from './markdownTransformers.js'

const toolbarGroups = [
  toolbarFormatGroupWithItems([
    {
      ChildComponent: StrikethroughIcon,
      isActive: ({ selection }) => {
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
          return selection.hasFormat('strikethrough')
        }
        return false
      },
      key: 'strikethrough',
      onSelect: ({ editor }) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
      },
      order: 4,
    },
  ]),
]

export const StrikethroughFeatureClient = createClientFeature({
  enableFormats: ['strikethrough'],
  markdownTransformers: [STRIKETHROUGH],
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
```

--------------------------------------------------------------------------------

---[FILE: feature.server.ts]---
Location: payload-main/packages/richtext-lexical/src/features/format/strikethrough/feature.server.ts

```typescript
import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { STRIKETHROUGH } from './markdownTransformers.js'

export const StrikethroughFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#StrikethroughFeatureClient',

    markdownTransformers: [STRIKETHROUGH],
  },
  key: 'strikethrough',
})
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformers.ts]---
Location: payload-main/packages/richtext-lexical/src/features/format/strikethrough/markdownTransformers.ts

```typescript
import type { TextFormatTransformer } from '../../../packages/@lexical/markdown/MarkdownTransformers.js'

export const STRIKETHROUGH: TextFormatTransformer = {
  type: 'text-format',
  format: ['strikethrough'],
  tag: '~~',
}
```

--------------------------------------------------------------------------------

---[FILE: feature.client.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/format/subscript/feature.client.tsx

```typescript
'use client'

import { $isTableSelection } from '@lexical/table'
import { $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'

import type { ToolbarGroup } from '../../toolbars/types.js'

import { SubscriptIcon } from '../../../lexical/ui/icons/Subscript/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { toolbarFormatGroupWithItems } from '../shared/toolbarFormatGroup.js'

const toolbarGroups: ToolbarGroup[] = [
  toolbarFormatGroupWithItems([
    {
      ChildComponent: SubscriptIcon,
      isActive: ({ selection }) => {
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
          return selection.hasFormat('subscript')
        }
        return false
      },
      key: 'subscript',
      onSelect: ({ editor }) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
      },
      order: 5,
    },
  ]),
]

export const SubscriptFeatureClient = createClientFeature({
  enableFormats: ['subscript'],
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
```

--------------------------------------------------------------------------------

---[FILE: feature.server.ts]---
Location: payload-main/packages/richtext-lexical/src/features/format/subscript/feature.server.ts

```typescript
import { createServerFeature } from '../../../utilities/createServerFeature.js'

export const SubscriptFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#SubscriptFeatureClient',
  },
  key: 'subscript',
})
```

--------------------------------------------------------------------------------

---[FILE: feature.client.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/format/superscript/feature.client.tsx

```typescript
'use client'

import { $isTableSelection } from '@lexical/table'
import { $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'

import type { ToolbarGroup } from '../../toolbars/types.js'

import { SuperscriptIcon } from '../../../lexical/ui/icons/Superscript/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { toolbarFormatGroupWithItems } from '../shared/toolbarFormatGroup.js'

const toolbarGroups: ToolbarGroup[] = [
  toolbarFormatGroupWithItems([
    {
      ChildComponent: SuperscriptIcon,
      isActive: ({ selection }) => {
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
          return selection.hasFormat('superscript')
        }
        return false
      },
      key: 'superscript',
      onSelect: ({ editor }) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
      },
      order: 6,
    },
  ]),
]

export const SuperscriptFeatureClient = createClientFeature({
  enableFormats: ['superscript'],
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
```

--------------------------------------------------------------------------------

---[FILE: feature.server.ts]---
Location: payload-main/packages/richtext-lexical/src/features/format/superscript/feature.server.ts

```typescript
import { createServerFeature } from '../../../utilities/createServerFeature.js'

export const SuperscriptFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#SuperscriptFeatureClient',
  },
  key: 'superscript',
})
```

--------------------------------------------------------------------------------

---[FILE: feature.client.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/format/underline/feature.client.tsx

```typescript
'use client'

import { $isTableSelection } from '@lexical/table'
import { $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'

import type { ToolbarGroup } from '../../toolbars/types.js'

import { UnderlineIcon } from '../../../lexical/ui/icons/Underline/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { toolbarFormatGroupWithItems } from '../shared/toolbarFormatGroup.js'

const toolbarGroups: ToolbarGroup[] = [
  toolbarFormatGroupWithItems([
    {
      ChildComponent: UnderlineIcon,
      isActive: ({ selection }) => {
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
          return selection.hasFormat('underline')
        }
        return false
      },
      key: 'underline',
      onSelect: ({ editor }) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
      },
      order: 3,
    },
  ]),
]

export const UnderlineFeatureClient = createClientFeature({
  enableFormats: ['underline'],
  toolbarFixed: {
    groups: toolbarGroups,
  },
  toolbarInline: {
    groups: toolbarGroups,
  },
})
```

--------------------------------------------------------------------------------

---[FILE: feature.server.ts]---
Location: payload-main/packages/richtext-lexical/src/features/format/underline/feature.server.ts

```typescript
import { createServerFeature } from '../../../utilities/createServerFeature.js'

export const UnderlineFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#UnderlineFeatureClient',
  },
  key: 'underline',
})
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformer.ts]---
Location: payload-main/packages/richtext-lexical/src/features/heading/markdownTransformer.ts

```typescript
import type { HeadingTagType } from '@lexical/rich-text'

import { $createHeadingNode, $isHeadingNode, HeadingNode } from '@lexical/rich-text'

import type { ElementTransformer } from '../../packages/@lexical/markdown/MarkdownTransformers.js'

import { createBlockNode } from '../../lexical/utils/markdown/createBlockNode.js'

export const MarkdownTransformer: (enabledHeadingSizes: HeadingTagType[]) => ElementTransformer = (
  enabledHeadingSizes,
) => {
  // Convert enabledHeadingSizes to a list of numbers (1 for h1, 2 for h2, etc.)
  const enabledSizes = enabledHeadingSizes.map((tag) => Number(tag.slice(1)))

  // Create a regex pattern that matches any of the enabled sizes
  const pattern = `^(${enabledSizes.map((size) => `#{${size}}`).join('|')})\\s`
  const regExp = new RegExp(pattern)

  return {
    type: 'element',
    dependencies: [HeadingNode],
    export: (node, exportChildren) => {
      if (!$isHeadingNode(node)) {
        return null
      }
      const level = Number(node.getTag().slice(1))
      return '#'.repeat(level) + ' ' + exportChildren(node)
    },
    regExp,
    replace: createBlockNode((match) => {
      const tag = ('h' + match[1]?.length) as HeadingTagType
      return $createHeadingNode(tag)
    }),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/heading/client/index.tsx
Signals: React

```typescript
'use client'

import type { HeadingTagType } from '@lexical/rich-text'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode, $isHeadingNode, HeadingNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $getSelection, $isRangeSelection } from 'lexical'
import { useEffect } from 'react'

import type { ToolbarGroup } from '../../toolbars/types.js'
import type { PluginComponent } from '../../typesClient.js'
import type { HeadingFeatureProps } from '../server/index.js'

import { H1Icon } from '../../../lexical/ui/icons/H1/index.js'
import { H2Icon } from '../../../lexical/ui/icons/H2/index.js'
import { H3Icon } from '../../../lexical/ui/icons/H3/index.js'
import { H4Icon } from '../../../lexical/ui/icons/H4/index.js'
import { H5Icon } from '../../../lexical/ui/icons/H5/index.js'
import { H6Icon } from '../../../lexical/ui/icons/H6/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { slashMenuBasicGroupWithItems } from '../../shared/slashMenu/basicGroup.js'
import { toolbarTextDropdownGroupWithItems } from '../../shared/toolbar/textDropdownGroup.js'
import { MarkdownTransformer } from '../markdownTransformer.js'

const $setHeading = (headingSize: HeadingTagType) => {
  const selection = $getSelection()
  $setBlocksType(selection, () => $createHeadingNode(headingSize))
}

const iconImports = {
  h1: H1Icon,
  h2: H2Icon,
  h3: H3Icon,
  h4: H4Icon,
  h5: H5Icon,
  h6: H6Icon,
}

export const HeadingFeatureClient = createClientFeature<HeadingFeatureProps>(({ props }) => {
  const { enabledHeadingSizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] } = props

  const toolbarGroups: ToolbarGroup[] = [
    toolbarTextDropdownGroupWithItems(
      enabledHeadingSizes.map((headingSize, i) => {
        return {
          ChildComponent: iconImports[headingSize],
          isActive: ({ selection }) => {
            if (!$isRangeSelection(selection)) {
              return false
            }
            for (const node of selection.getNodes()) {
              if ($isHeadingNode(node) && node.getTag() === headingSize) {
                continue
              }

              const parent = node.getParent()
              if ($isHeadingNode(parent) && parent.getTag() === headingSize) {
                continue
              }

              return false
            }
            return true
          },
          key: headingSize,
          label: ({ i18n }) => {
            return i18n.t('lexical:heading:label', { headingLevel: headingSize.charAt(1) })
          },
          onSelect: ({ editor }) => {
            editor.update(() => {
              $setHeading(headingSize)
            })
          },
          order: i + 2,
        }
      }),
    ),
  ]

  return {
    markdownTransformers: [MarkdownTransformer(enabledHeadingSizes)],
    nodes: [HeadingNode],
    plugins: [
      {
        Component: HeadingPlugin,
        position: 'normal',
      },
    ],
    sanitizedClientFeatureProps: props,
    slashMenu: {
      groups: enabledHeadingSizes?.length
        ? [
            slashMenuBasicGroupWithItems(
              enabledHeadingSizes.map((headingSize) => {
                return {
                  Icon: iconImports[headingSize],
                  key: `heading-${headingSize.charAt(1)}`,
                  keywords: ['heading', headingSize],
                  label: ({ i18n }) => {
                    return i18n.t('lexical:heading:label', {
                      headingLevel: headingSize.charAt(1),
                    })
                  },
                  onSelect: ({ editor }) => {
                    editor.update(() => {
                      $setHeading(headingSize)
                    })
                  },
                }
              }),
            ),
          ]
        : [],
    },
    toolbarFixed: {
      groups: enabledHeadingSizes?.length ? toolbarGroups : [],
    },
    toolbarInline: {
      groups: enabledHeadingSizes?.length ? toolbarGroups : [],
    },
  }
})

const HeadingPlugin: PluginComponent<HeadingFeatureProps> = ({ clientProps }) => {
  const { enabledHeadingSizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] } = clientProps
  const lowestAllowed = enabledHeadingSizes.at(-1)
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!lowestAllowed || enabledHeadingSizes.length === 6) {
      return
    }
    return editor.registerNodeTransform(HeadingNode, (node) => {
      if (!enabledHeadingSizes.includes(node.getTag())) {
        node.setTag(lowestAllowed)
      }
    })
  }, [editor, enabledHeadingSizes, lowestAllowed])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: i18n.ts]---
Location: payload-main/packages/richtext-lexical/src/features/heading/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    label: 'العنوان {{headingLevel}}',
  },
  az: {
    label: 'Başlıq {{headingLevel}}',
  },
  bg: {
    label: 'Заглавие {{headingLevel}}',
  },
  cs: {
    label: 'Nadpis {{headingLevel}}',
  },
  da: {
    label: 'Overskrift {{overskriftNiveau}}',
  },
  de: {
    label: 'Überschrift {{headingLevel}}',
  },
  en: {
    label: 'Heading {{headingLevel}}',
  },
  es: {
    label: 'Encabezado {{headingLevel}}',
  },
  et: {
    label: 'Pealkiri {{headingLevel}}',
  },
  fa: {
    label: '[SKIPPED]',
  },
  fr: {
    label: 'En-tête {{headingLevel}}',
  },
  he: {
    label: 'כותרת {{רמת כותרת}}',
  },
  hr: {
    label: 'Naslov {{headingLevel}}',
  },
  hu: {
    label: 'Címsor {{headingLevel}}',
  },
  is: {
    label: 'Fyrirsögn {{headingLevel}}',
  },
  it: {
    label: 'Intestazione {{headingLevel}}',
  },
  ja: {
    label: '見出し{{headingLevel}}',
  },
  ko: {
    label: '제목 {{headingLevel}}',
  },
  my: {
    label: '[SURAT]\n\nKepala {{headingLevel}}',
  },
  nb: {
    label: 'Overskrift {{headingLevel}}',
  },
  nl: {
    label: 'Kop {{headingLevel}}',
  },
  pl: {
    label: 'Nagłówek {{headingLevel}}',
  },
  pt: {
    label: 'Cabeçalho {{headingLevel}}',
  },
  ro: {
    label: 'Titlu {{headingLevel}}',
  },
  rs: {
    label: 'Наслов {{headingLevel}}',
  },
  'rs-latin': {
    label: 'Naslov {{headingLevel}}',
  },
  ru: {
    label: 'Заголовок {{headingLevel}}',
  },
  sk: {
    label: 'Nadpis {{headingLevel}}',
  },
  sl: {
    label: 'Naslov {{headingLevel}}',
  },
  sv: {
    label: 'Rubrik {{headingLevel}}',
  },
  ta: {
    label: 'தலைப்பு {{headingLevel}}',
  },
  th: {
    label: 'หัวข้อ {{headingLevel}}',
  },
  tr: {
    label: 'Başlık {{headingLevel}}',
  },
  uk: {
    label: 'Заголовок {{headingLevel}}',
  },
  vi: {
    label: 'Tiêu đề {{headingLevel}}',
  },
  zh: {
    label: '标题 {{headingLevel}}',
  },
  'zh-TW': {
    label: '標題 {{headingLevel}}',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/heading/server/index.ts

```typescript
import type {
  SerializedHeadingNode as _SerializedHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text'
import type { SerializedLexicalNode } from 'lexical'

import { HeadingNode } from '@lexical/rich-text'

import type { StronglyTypedElementNode } from '../../../nodeTypes.js'

import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { convertLexicalNodesToHTML } from '../../converters/lexicalToHtml_deprecated/converter/index.js'
import { createNode } from '../../typeUtilities.js'
import { MarkdownTransformer } from '../markdownTransformer.js'
import { i18n } from './i18n.js'

export type SerializedHeadingNode<T extends SerializedLexicalNode = SerializedLexicalNode> =
  StronglyTypedElementNode<_SerializedHeadingNode, 'heading', T>

export type HeadingFeatureProps = {
  enabledHeadingSizes?: HeadingTagType[]
}

export const HeadingFeature = createServerFeature<
  HeadingFeatureProps,
  HeadingFeatureProps,
  HeadingFeatureProps
>({
  feature: ({ props }) => {
    if (!props) {
      props = {}
    }

    const { enabledHeadingSizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] } = props

    enabledHeadingSizes.sort()

    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#HeadingFeatureClient',
      clientFeatureProps: props,
      i18n,
      markdownTransformers: [MarkdownTransformer(enabledHeadingSizes)],
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
                const style = [
                  node.format ? `text-align: ${node.format};` : '',
                  // the unit should be px. Do not change it to rem, em, or something else.
                  // The quantity should be 40px. Do not change it either.
                  // See rationale in
                  // https://github.com/payloadcms/payload/issues/13130#issuecomment-3058348085
                  node.indent > 0 ? `padding-inline-start: ${node.indent * 40}px;` : '',
                ]
                  .filter(Boolean)
                  .join(' ')
                return `<${node?.tag}${style ? ` style='${style}'` : ''}>${childrenText}</${node?.tag}>`
              },
              nodeTypes: [HeadingNode.getType()],
            },
          },
          node: HeadingNode,
        }),
      ],
      sanitizedServerFeatureProps: props,
    }
  },
  key: 'heading',
})
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/horizontalRule/client/index.tsx

```typescript
'use client'

import { $isNodeSelection } from 'lexical'

import { HorizontalRuleIcon } from '../../../lexical/ui/icons/HorizontalRule/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { slashMenuBasicGroupWithItems } from '../../shared/slashMenu/basicGroup.js'
import { toolbarAddDropdownGroupWithItems } from '../../shared/toolbar/addDropdownGroup.js'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '../server/nodes/HorizontalRuleNode.js'
import { MarkdownTransformer } from './markdownTransformer.js'
import { $isHorizontalRuleNode, HorizontalRuleNode } from './nodes/HorizontalRuleNode.js'
import { HorizontalRulePlugin } from './plugin/index.js'

export const HorizontalRuleFeatureClient = createClientFeature({
  markdownTransformers: [MarkdownTransformer],
  nodes: [HorizontalRuleNode],
  plugins: [
    {
      Component: HorizontalRulePlugin,
      position: 'normal',
    },
  ],
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: HorizontalRuleIcon,
          key: 'horizontalRule',
          keywords: ['hr', 'horizontal rule', 'line', 'separator'],
          label: ({ i18n }) => {
            return i18n.t('lexical:horizontalRule:label')
          },

          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
          },
        },
      ]),
    ],
  },
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems([
        {
          ChildComponent: HorizontalRuleIcon,
          isActive: ({ selection }) => {
            if (!$isNodeSelection(selection) || !selection.getNodes().length) {
              return false
            }

            const firstNode = selection.getNodes()[0]
            return $isHorizontalRuleNode(firstNode)
          },
          key: 'horizontalRule',
          label: ({ i18n }) => {
            return i18n.t('lexical:horizontalRule:label')
          },
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
          },
        },
      ]),
    ],
  },
})
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformer.ts]---
Location: payload-main/packages/richtext-lexical/src/features/horizontalRule/client/markdownTransformer.ts

```typescript
import type { ElementTransformer } from '../../../packages/@lexical/markdown/MarkdownTransformers.js'

import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
  HorizontalRuleNode,
} from './nodes/HorizontalRuleNode.js'

export const MarkdownTransformer: ElementTransformer = {
  type: 'element',
  dependencies: [HorizontalRuleNode],
  export: (node, exportChildren) => {
    if (!$isHorizontalRuleNode(node)) {
      return null
    }
    return '---'
  },
  // match ---
  regExp: /^---\s*$/,
  replace: (parentNode) => {
    const node = $createHorizontalRuleNode()
    if (node) {
      parentNode.replace(node)
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: HorizontalRuleNode.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/horizontalRule/client/nodes/HorizontalRuleNode.tsx
Signals: React

```typescript
'use client'
import type { DOMConversionOutput, LexicalNode, SerializedLexicalNode } from 'lexical'

import { $applyNodeReplacement } from 'lexical'
import * as React from 'react'

import type { SerializedHorizontalRuleNode } from '../../server/nodes/HorizontalRuleNode.js'

import { HorizontalRuleServerNode } from '../../server/nodes/HorizontalRuleNode.js'

export class HorizontalRuleNode extends HorizontalRuleServerNode {
  static override clone(node: HorizontalRuleServerNode): HorizontalRuleServerNode {
    return super.clone(node)
  }

  static override getType(): string {
    return super.getType()
  }

  /**
   * The data for this node is stored serialized as JSON. This is the "load function" of that node: it takes the saved data and converts it into a node.
   */
  static override importJSON(serializedNode: SerializedHorizontalRuleNode): HorizontalRuleNode {
    return $createHorizontalRuleNode()
  }

  /**
   * Allows you to render a React component within whatever createDOM returns.
   */
  override decorate() {
    return null
  }

  override exportJSON(): SerializedLexicalNode {
    return super.exportJSON()
  }
}

function $convertHorizontalRuleElement(): DOMConversionOutput {
  return { node: $createHorizontalRuleNode() }
}

export function $createHorizontalRuleNode(): HorizontalRuleNode {
  return $applyNodeReplacement(new HorizontalRuleNode())
}

export function $isHorizontalRuleNode(
  node: LexicalNode | null | undefined,
): node is HorizontalRuleNode {
  return node instanceof HorizontalRuleNode
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/horizontalRule/client/plugin/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .LexicalEditorTheme__hr {
    width: auto !important;
    padding: 2px 2px;
    border: none;
    margin: 1rem 0;
    cursor: pointer;
  }

  .LexicalEditorTheme__hr:after {
    content: '';
    display: block;
    height: 2px;
    background-color: var(--theme-elevation-250);
  }

  .LexicalEditorTheme__hr.LexicalEditorTheme__hrSelected {
    outline: 2px solid var(--theme-success-250);
    user-select: none;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/horizontalRule/client/plugin/index.tsx
Signals: React

```typescript
'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { $insertNodeToNearestRoot } from '@lexical/utils'
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR } from 'lexical'
import { useEffect } from 'react'

import type { PluginComponent } from '../../../typesClient.js'

import { INSERT_HORIZONTAL_RULE_COMMAND } from '../../server/nodes/HorizontalRuleNode.js'
import { $createHorizontalRuleNode } from '../nodes/HorizontalRuleNode.js'
import './index.scss'

/**
 * Registers the INSERT_HORIZONTAL_RULE_COMMAND lexical command and defines the behavior for when it is called.
 */
export const HorizontalRulePlugin: PluginComponent<undefined> = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_HORIZONTAL_RULE_COMMAND,
      (type) => {
        const selection = $getSelection()

        if (!$isRangeSelection(selection)) {
          return false
        }

        const focusNode = selection.focus.getNode()

        if (focusNode !== null) {
          const horizontalRuleNode = $createHorizontalRuleNode()
          $insertNodeToNearestRoot(horizontalRuleNode)
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: i18n.ts]---
Location: payload-main/packages/richtext-lexical/src/features/horizontalRule/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    label: 'القاعدة الأفقية',
  },
  az: {
    label: 'Üfüqi Xətt',
  },
  bg: {
    label: 'Хоризонтална линия',
  },
  cs: {
    label: 'Vodorovný pravítko',
  },
  da: {
    label: 'Horisontal Regel',
  },
  de: {
    label: 'Trennlinie',
  },
  en: {
    label: 'Horizontal Rule',
  },
  es: {
    label: 'Regla Horizontal',
  },
  et: {
    label: 'Horisontaalne reegel',
  },
  fa: {
    label: 'قاعده افقی',
  },
  fr: {
    label: 'Règle horizontale',
  },
  he: {
    label: 'קו אופקי',
  },
  hr: {
    label: 'Vodoravna linija',
  },
  hu: {
    label: 'Vízszintes vonal',
  },
  is: {
    label: 'Lárétt lína',
  },
  it: {
    label: 'Regola Orizzontale',
  },
  ja: {
    label: '水平線',
  },
  ko: {
    label: '수평 규칙',
  },
  my: {
    label: 'Peraturan Mendatar',
  },
  nb: {
    label: 'Horisontal Regel',
  },
  nl: {
    label: 'Horizontale Regel',
  },
  pl: {
    label: 'Pozioma Linia',
  },
  pt: {
    label: 'Regra Horizontal',
  },
  ro: {
    label: 'Linie orizontală',
  },
  rs: {
    label: 'Хоризонтална линија',
  },
  'rs-latin': {
    label: 'Horizontalna linija',
  },
  ru: {
    label: 'Горизонтальная линия',
  },
  sk: {
    label: 'Vodorovná čiara',
  },
  sl: {
    label: 'Vodoravna črta',
  },
  sv: {
    label: 'Horisontell linje',
  },
  ta: {
    label: 'குறுக்கு வரி',
  },
  th: {
    label: 'เส้นขอบแนวนอน',
  },
  tr: {
    label: 'Yatay Çizgi',
  },
  uk: {
    label: 'Горизонтальна лінія',
  },
  vi: {
    label: 'Quy tắc ngang',
  },
  zh: {
    label: '水平线',
  },
  'zh-TW': {
    label: '水平線',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/horizontalRule/server/index.ts

```typescript
import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { createNode } from '../../typeUtilities.js'
import { i18n } from './i18n.js'
import { MarkdownTransformer } from './markdownTransformer.js'
import { HorizontalRuleServerNode } from './nodes/HorizontalRuleNode.js'

export const HorizontalRuleFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient',
    i18n,
    markdownTransformers: [MarkdownTransformer],
    nodes: [
      createNode({
        converters: {
          html: {
            converter: () => {
              return `<hr/>`
            },
            nodeTypes: [HorizontalRuleServerNode.getType()],
          },
        },
        node: HorizontalRuleServerNode,
      }),
    ],
  },
  key: 'horizontalRule',
})
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformer.ts]---
Location: payload-main/packages/richtext-lexical/src/features/horizontalRule/server/markdownTransformer.ts

```typescript
import type { ElementTransformer } from '../../../packages/@lexical/markdown/MarkdownTransformers.js'

import {
  $createHorizontalRuleServerNode,
  $isHorizontalRuleServerNode,
  HorizontalRuleServerNode,
} from './nodes/HorizontalRuleNode.js'

export const MarkdownTransformer: ElementTransformer = {
  type: 'element',
  dependencies: [HorizontalRuleServerNode],
  export: (node, exportChildren) => {
    if (!$isHorizontalRuleServerNode(node)) {
      return null
    }
    return '---'
  },
  // match ---
  regExp: /^---\s*$/,
  replace: (parentNode) => {
    const node = $createHorizontalRuleServerNode()
    if (node) {
      parentNode.replace(node)
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: HorizontalRuleNode.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/horizontalRule/server/nodes/HorizontalRuleNode.tsx
Signals: React

```typescript
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalCommand,
  LexicalNode,
  SerializedLexicalNode,
} from 'lexical'
import type * as React from 'react'

import { addClassNamesToElement } from '@lexical/utils'
import { $applyNodeReplacement, createCommand, DecoratorNode } from 'lexical'

import type { StronglyTypedLeafNode } from '../../../../nodeTypes.js'

/**
 * Serialized representation of a horizontal rule node. Serialized = converted to JSON. This is what is stored in the database / in the lexical editor state.
 */
export type SerializedHorizontalRuleNode = StronglyTypedLeafNode<
  SerializedLexicalNode,
  'horizontalrule'
>

export const INSERT_HORIZONTAL_RULE_COMMAND: LexicalCommand<void> = createCommand(
  'INSERT_HORIZONTAL_RULE_COMMAND',
)

/**
 * This node is a DecoratorNode. DecoratorNodes allow you to render React components in the editor.
 *
 * They need both createDom and decorate functions. createDom => outside of the html. decorate => React Component inside of the html.
 *
 * If we used DecoratorBlockNode instead, we would only need a decorate method
 */
export class HorizontalRuleServerNode extends DecoratorNode<null | React.ReactElement> {
  static override clone(node: HorizontalRuleServerNode): HorizontalRuleServerNode {
    return new this(node.__key)
  }

  static override getType(): string {
    return 'horizontalrule'
  }

  /**
   * Defines what happens if you copy an hr element from another page and paste it into the lexical editor
   *
   * This also determines the behavior of lexical's internal HTML -> Lexical converter
   */
  static override importDOM(): DOMConversionMap | null {
    return {
      hr: () => ({
        conversion: $convertHorizontalRuleElement,
        priority: 0,
      }),
    }
  }

  /**
   * The data for this node is stored serialized as JSON. This is the "load function" of that node: it takes the saved data and converts it into a node.
   */
  static override importJSON(
    serializedNode: SerializedHorizontalRuleNode,
  ): HorizontalRuleServerNode {
    return $createHorizontalRuleServerNode()
  }

  /**
   * Determines how the hr element is rendered in the lexical editor. This is only the "initial" / "outer" HTML element.
   */
  override createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('hr')
    addClassNamesToElement(element, config.theme.hr)
    return element
  }

  override decorate(): null | React.ReactElement {
    return null
  }

  /**
   * Opposite of importDOM, this function defines what happens when you copy an hr element from the lexical editor and paste it into another page.
   *
   * This also determines the behavior of lexical's internal Lexical -> HTML converter
   */
  override exportDOM(): DOMExportOutput {
    return { element: document.createElement('hr') }
  }
  /**
   * Opposite of importJSON. This determines what data is saved in the database / in the lexical editor state.
   */
  override exportJSON(): SerializedLexicalNode {
    return {
      type: 'horizontalrule',
      version: 1,
    }
  }

  override getTextContent(): string {
    return '\n'
  }

  override isInline(): false {
    return false
  }

  override updateDOM(): boolean {
    return false
  }
}

function $convertHorizontalRuleElement(): DOMConversionOutput {
  return { node: $createHorizontalRuleServerNode() }
}

export function $createHorizontalRuleServerNode(): HorizontalRuleServerNode {
  return $applyNodeReplacement(new HorizontalRuleServerNode())
}

export function $isHorizontalRuleServerNode(
  node: LexicalNode | null | undefined,
): node is HorizontalRuleServerNode {
  return node instanceof HorizontalRuleServerNode
}
```

--------------------------------------------------------------------------------

````
