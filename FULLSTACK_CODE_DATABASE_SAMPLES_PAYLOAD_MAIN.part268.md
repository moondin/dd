---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 268
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 268 of 695)

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

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/align/server/index.ts

```typescript
import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { i18n } from './i18n.js'

export const AlignFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#AlignFeatureClient',
    i18n,
  },
  key: 'align',
})
```

--------------------------------------------------------------------------------

---[FILE: markdownTransformer.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blockquote/markdownTransformer.ts

```typescript
import { $createQuoteNode, $isQuoteNode, QuoteNode } from '@lexical/rich-text'

import type { ElementTransformer } from '../../packages/@lexical/markdown/index.js'

export const MarkdownTransformer: ElementTransformer = {
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
  regExp: /^>\s/,
  replace: (parentNode, children, _match, isImport) => {
    if (isImport) {
      const previousNode = parentNode.getPreviousSibling()
      if ($isQuoteNode(previousNode)) {
        previousNode.splice(previousNode.getChildrenSize(), 0, [...children])
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
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blockquote/client/index.tsx

```typescript
'use client'

import { $createQuoteNode, $isQuoteNode, QuoteNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $getSelection, $isRangeSelection } from 'lexical'

import type { ToolbarGroup } from '../../toolbars/types.js'

import { BlockquoteIcon } from '../../../lexical/ui/icons/Blockquote/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { slashMenuBasicGroupWithItems } from '../../shared/slashMenu/basicGroup.js'
import { toolbarTextDropdownGroupWithItems } from '../../shared/toolbar/textDropdownGroup.js'
import { MarkdownTransformer } from '../markdownTransformer.js'

const toolbarGroups: ToolbarGroup[] = [
  toolbarTextDropdownGroupWithItems([
    {
      ChildComponent: BlockquoteIcon,
      isActive: ({ selection }) => {
        if (!$isRangeSelection(selection)) {
          return false
        }
        for (const node of selection.getNodes()) {
          if (!$isQuoteNode(node) && !$isQuoteNode(node.getParent())) {
            return false
          }
        }
        return true
      },
      key: 'blockquote',
      label: ({ i18n }) => {
        return i18n.t('lexical:blockquote:label')
      },
      onSelect: ({ editor }) => {
        editor.update(() => {
          const selection = $getSelection()
          $setBlocksType(selection, () => $createQuoteNode())
        })
      },
      order: 20,
    },
  ]),
]

export const BlockquoteFeatureClient = createClientFeature({
  markdownTransformers: [MarkdownTransformer],
  nodes: [QuoteNode],

  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: BlockquoteIcon,
          key: 'blockquote',
          keywords: ['quote', 'blockquote'],
          label: ({ i18n }) => {
            return i18n.t('lexical:blockquote:label')
          },
          onSelect: ({ editor }) => {
            editor.update(() => {
              const selection = $getSelection()
              $setBlocksType(selection, () => $createQuoteNode())
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
Location: payload-main/packages/richtext-lexical/src/features/blockquote/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    label: 'اقتباس',
  },
  az: {
    label: 'Blokkvota',
  },
  bg: {
    label: 'Цитат',
  },
  cs: {
    label: 'Citace',
  },
  da: {
    label: 'Blokering',
  },
  de: {
    label: 'Blockzitat',
  },
  en: {
    label: 'Blockquote',
  },
  es: {
    label: 'Cita en bloque',
  },
  et: {
    label: 'Tsitaat',
  },
  fa: {
    label: 'نقل قول بلوکی',
  },
  fr: {
    label: 'Citation',
  },
  he: {
    label: 'בלוק ציטוט',
  },
  hr: {
    label: 'Blok citat',
  },
  hu: {
    label: 'Idézetblokk',
  },
  is: {
    label: 'Tilvitnun',
  },
  it: {
    label: 'Citazione',
  },
  ja: {
    label: 'ブロッククォート',
  },
  ko: {
    label: '인용구',
  },
  my: {
    label: 'ဒေါင်းချီးခြင်း',
  },
  nb: {
    label: 'Blokksitat',
  },
  nl: {
    label: 'Citaat',
  },
  pl: {
    label: 'Cytat blokowy',
  },
  pt: {
    label: 'Citação em bloco',
  },
  ro: {
    label: 'Citat',
  },
  rs: {
    label: 'Блок цитата',
  },
  'rs-latin': {
    label: 'Blok citata',
  },
  ru: {
    label: 'Цитата',
  },
  sk: {
    label: 'Citát',
  },
  sl: {
    label: 'Citat',
  },
  sv: {
    label: 'Blockcitat',
  },
  ta: {
    label: 'கட்டமைப்பு மேற்கோள்',
  },
  th: {
    label: 'ข้อความอ้างอิง',
  },
  tr: {
    label: 'Alıntı',
  },
  uk: {
    label: 'Блокцитата',
  },
  vi: {
    label: 'Trích dẫn',
  },
  zh: {
    label: '引用区块',
  },
  'zh-TW': {
    label: '引用塊',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blockquote/server/index.ts

```typescript
import type { SerializedQuoteNode as _SerializedQuoteNode } from '@lexical/rich-text'
import type { SerializedLexicalNode } from 'lexical'

import { QuoteNode } from '@lexical/rich-text'

import type { StronglyTypedElementNode } from '../../../nodeTypes.js'

import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { convertLexicalNodesToHTML } from '../../converters/lexicalToHtml_deprecated/converter/index.js'
import { createNode } from '../../typeUtilities.js'
import { MarkdownTransformer } from '../markdownTransformer.js'
import { i18n } from './i18n.js'

export type SerializedQuoteNode<T extends SerializedLexicalNode = SerializedLexicalNode> =
  StronglyTypedElementNode<_SerializedQuoteNode, 'quote', T>

export const BlockquoteFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#BlockquoteFeatureClient',
    clientFeatureProps: null,
    i18n,
    markdownTransformers: [MarkdownTransformer],
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

              return `<blockquote${style ? ` style='${style}'` : ''}>${childrenText}</blockquote>`
            },
            nodeTypes: [QuoteNode.getType()],
          },
        },
        node: QuoteNode,
      }),
    ],
  },
  key: 'blockquote',
})
```

--------------------------------------------------------------------------------

---[FILE: getBlockImageComponent.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/getBlockImageComponent.tsx
Signals: React

```typescript
import React from 'react'

import { BlockIcon } from '../../../lexical/ui/icons/Block/index.js'

export function getBlockImageComponent(imageURL?: string, imageAltText?: string) {
  if (!imageURL) {
    return BlockIcon
  }

  return () => (
    <img
      alt={imageAltText ?? 'Block Image'}
      className="lexical-block-custom-image"
      src={imageURL}
      style={{ maxHeight: 20, maxWidth: 20 }}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/index.tsx

```typescript
'use client'

import type { I18nClient } from '@payloadcms/translations'
import type { BlocksFieldClient, ClientBlock } from 'payload'

import { getTranslation } from '@payloadcms/translations'

import type {
  SlashMenuGroup,
  SlashMenuItem,
} from '../../../lexical/plugins/SlashMenu/LexicalTypeaheadMenuPlugin/types.js'
import type { ToolbarGroup, ToolbarGroupItem } from '../../toolbars/types.js'

import { BlockIcon } from '../../../lexical/ui/icons/Block/index.js'
import { InlineBlocksIcon } from '../../../lexical/ui/icons/InlineBlocks/index.js'
import { createClientFeature } from '../../../utilities/createClientFeature.js'
import { getBlockImageComponent } from './getBlockImageComponent.js'
import { getBlockMarkdownTransformers } from './markdown/markdownTransformer.js'
import { BlockNode } from './nodes/BlocksNode.js'
import { InlineBlockNode } from './nodes/InlineBlocksNode.js'
import { INSERT_BLOCK_COMMAND, INSERT_INLINE_BLOCK_COMMAND } from './plugin/commands.js'
import { BlocksPlugin } from './plugin/index.js'
export const BlocksFeatureClient = createClientFeature(
  ({ config, featureClientSchemaMap, props, schemaPath }) => {
    const schemaMapRenderedBlockPathPrefix = `${schemaPath}.lexical_internal_feature.blocks.lexical_blocks`
    const schemaMapRenderedInlineBlockPathPrefix = `${schemaPath}.lexical_internal_feature.blocks.lexical_inline_blocks`
    const clientSchema = featureClientSchemaMap['blocks']

    if (!clientSchema) {
      return {}
    }

    const blocksFields: BlocksFieldClient[] = Object.entries(clientSchema)
      .filter(
        ([key]) =>
          key.startsWith(schemaMapRenderedBlockPathPrefix + '.') &&
          !key.replace(schemaMapRenderedBlockPathPrefix + '.', '').includes('.'),
      )
      .map(([, value]) => value[0] as BlocksFieldClient)

    const inlineBlocksFields: BlocksFieldClient[] = Object.entries(clientSchema)
      .filter(
        ([key]) =>
          key.startsWith(schemaMapRenderedInlineBlockPathPrefix + '.') &&
          !key.replace(schemaMapRenderedInlineBlockPathPrefix + '.', '').includes('.'),
      )
      .map(([, value]) => value[0] as BlocksFieldClient)

    const clientBlocks: ClientBlock[] = blocksFields
      .map((field) => {
        return field.blockReferences
          ? typeof field.blockReferences[0] === 'string'
            ? config.blocksMap[field.blockReferences[0]]
            : field.blockReferences[0]
          : field.blocks[0]
      })
      .filter((block) => block !== undefined)

    const clientInlineBlocks: ClientBlock[] = inlineBlocksFields
      .map((field) => {
        return field.blockReferences
          ? typeof field.blockReferences[0] === 'string'
            ? config.blocksMap[field.blockReferences[0]]
            : field.blockReferences[0]
          : field.blocks[0]
      })
      .filter((block) => block !== undefined)

    return {
      markdownTransformers: getBlockMarkdownTransformers({
        blocks: clientBlocks,
        inlineBlocks: clientInlineBlocks,
      }),
      nodes: [BlockNode, InlineBlockNode],
      plugins: [
        {
          Component: BlocksPlugin,
          position: 'normal',
        },
      ],
      sanitizedClientFeatureProps: props,
      slashMenu: {
        groups: [
          clientBlocks?.length
            ? {
                items: clientBlocks.map((block) => {
                  return {
                    Icon: getBlockImageComponent(block.imageURL, block.imageAltText),
                    key: 'block-' + block.slug,
                    keywords: ['block', 'blocks', block.slug],
                    label: ({ i18n }) => {
                      const blockDisplayName = block?.labels?.singular
                        ? getTranslation(block.labels.singular, i18n)
                        : block?.slug

                      return blockDisplayName
                    },
                    onSelect: ({ editor }) => {
                      editor.dispatchCommand(INSERT_BLOCK_COMMAND, {
                        blockName: '',
                        blockType: block.slug,
                      })
                    },
                  } as SlashMenuItem
                }),
                key: 'blocks',
                label: ({ i18n }: { i18n: I18nClient<object, 'lexical:blocks:label'> }) => {
                  return i18n.t('lexical:blocks:label')
                },
              }
            : null,
          clientInlineBlocks?.length
            ? {
                items: clientInlineBlocks.map((inlineBlock) => {
                  return {
                    Icon: InlineBlocksIcon,
                    key: 'inlineBlocks-' + inlineBlock.slug,
                    keywords: ['inlineBlock', 'inline block', inlineBlock.slug],
                    label: ({ i18n }) => {
                      const blockDisplayName = inlineBlock?.labels?.singular
                        ? getTranslation(inlineBlock.labels.singular, i18n)
                        : inlineBlock?.slug

                      return blockDisplayName
                    },
                    onSelect: ({ editor }) => {
                      editor.dispatchCommand(INSERT_INLINE_BLOCK_COMMAND, {
                        blockName: '',
                        blockType: inlineBlock.slug,
                      })
                    },
                  } as SlashMenuItem
                }),
                key: 'inlineBlocks',
                label: ({
                  i18n,
                }: {
                  i18n: I18nClient<object, 'lexical:blocks:inlineBlocks:label'>
                }) => {
                  return i18n.t('lexical:blocks:inlineBlocks:label')
                },
              }
            : null,
        ].filter(Boolean) as SlashMenuGroup[],
      },
      toolbarFixed: {
        groups: [
          clientBlocks.length
            ? {
                type: 'dropdown',
                ChildComponent: BlockIcon,
                items: clientBlocks.map((block, index) => {
                  return {
                    ChildComponent: getBlockImageComponent(block.imageURL, block.imageAltText),
                    isActive: undefined, // At this point, we would be inside a sub-richtext-editor. And at this point this will be run against the focused sub-editor, not the parent editor which has the actual block. Thus, no point in running this
                    key: 'block-' + block.slug,
                    label: ({ i18n }) => {
                      const blockDisplayName = block?.labels?.singular
                        ? getTranslation(block.labels.singular, i18n)
                        : block?.slug

                      return blockDisplayName
                    },
                    onSelect: ({ editor }) => {
                      editor.dispatchCommand(INSERT_BLOCK_COMMAND, {
                        blockName: '',
                        blockType: block.slug,
                      })
                    },
                    order: index,
                  } as ToolbarGroupItem
                }),
                key: 'blocks',
                order: 20,
              }
            : null,
          clientInlineBlocks?.length
            ? {
                type: 'dropdown',
                ChildComponent: InlineBlocksIcon,
                items: clientInlineBlocks.map((inlineBlock, index) => {
                  return {
                    ChildComponent: inlineBlock.imageURL
                      ? getBlockImageComponent(inlineBlock.imageURL, inlineBlock.imageAltText)
                      : InlineBlocksIcon,
                    isActive: undefined,
                    key: 'inlineBlock-' + inlineBlock.slug,
                    label: ({ i18n }) => {
                      const blockDisplayName = inlineBlock?.labels?.singular
                        ? getTranslation(inlineBlock.labels.singular, i18n)
                        : inlineBlock?.slug

                      return blockDisplayName
                    },
                    onSelect: ({ editor }) => {
                      editor.dispatchCommand(INSERT_INLINE_BLOCK_COMMAND, {
                        blockName: '',
                        blockType: inlineBlock.slug,
                      })
                    },
                    order: index,
                  } as ToolbarGroupItem
                }),
                key: 'inlineBlocks',
                order: 25,
              }
            : null,
        ].filter(Boolean) as ToolbarGroup[],
      },
    }
  },
)
```

--------------------------------------------------------------------------------

---[FILE: BlockContent.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/component/BlockContent.tsx
Signals: React

```typescript
'use client'
import type { CollapsibleProps } from '@payloadcms/ui/elements/Collapsible'
import type { ClientField, FormState } from 'payload'

import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { RenderFields, useFormSubmitted } from '@payloadcms/ui'
import React, { createContext, useMemo } from 'react'

export type BlockCollapsibleProps = {
  /**
   * Replace the top-right portion of the header that renders the Edit and Remove buttons with custom content.
   * If this property is provided, the `removeButton` and `editButton` properties are ignored.
   */
  Actions?: React.ReactNode
  children?: React.ReactNode
  /**
   * Additional className to the collapsible wrapper
   */
  className?: string
  /**
   * Props to pass to the underlying Collapsible component. You could use this to override the `Header` entirely, for example.
   */
  collapsibleProps?: Partial<CollapsibleProps>
  /**
   * Whether to disable rendering the block name field in the header Label
   * @default false
   */
  disableBlockName?: boolean
  /**
   * Whether to show the Edit button
   * If `Actions` is provided, this property is ignored.
   * @default true
   */
  editButton?: boolean
  /**
   * Replace the default Label component with a custom Label
   */
  Label?: React.ReactNode
  /**
   * Replace the default Pill component component that's rendered within the default Label component with a custom Pill.
   * This property has no effect if you provide a custom Label component via the `Label` property.
   */
  Pill?: React.ReactNode
  /**
   * Whether to show the Remove button
   * If `Actions` is provided, this property is ignored.
   * @default true
   */
  removeButton?: boolean
}

export type BlockCollapsibleWithErrorProps = {
  errorCount?: number
  fieldHasErrors?: boolean
} & BlockCollapsibleProps

export type BlockContentProps = {
  baseClass: string
  BlockDrawer: React.FC
  Collapsible: React.FC<BlockCollapsibleWithErrorProps>
  CustomBlock: React.ReactNode
  EditButton: React.FC
  errorCount: number
  formSchema: ClientField[]
  initialState: false | FormState | undefined

  nodeKey: string
  RemoveButton: React.FC
}

type BlockComponentContextType = {
  BlockCollapsible: React.FC<BlockCollapsibleProps>
} & Omit<BlockContentProps, 'Collapsible'>

const BlockComponentContext = createContext<BlockComponentContextType>({
  baseClass: 'LexicalEditorTheme__block',
  BlockCollapsible: () => null,
  BlockDrawer: () => null,
  CustomBlock: null,
  EditButton: () => null,
  errorCount: 0,
  formSchema: [],
  initialState: false,
  nodeKey: '',
  RemoveButton: () => null,
})

export const useBlockComponentContext = () => React.use(BlockComponentContext)

/**
 * The actual content of the Block. This should be INSIDE a Form component,
 * scoped to the block. All format operations in here are thus scoped to the block's form, and
 * not the whole document.
 */
export const BlockContent: React.FC<BlockContentProps> = (props) => {
  const { Collapsible, ...contextProps } = props

  const { BlockDrawer, CustomBlock, errorCount, formSchema } = contextProps

  const hasSubmitted = useFormSubmitted()

  const fieldHasErrors = hasSubmitted && errorCount > 0
  const isEditable = useLexicalEditable()

  const CollapsibleWithErrorProps = useMemo(
    () => (props: BlockCollapsibleProps) => {
      const { children, ...rest } = props
      return (
        <Collapsible errorCount={errorCount} fieldHasErrors={fieldHasErrors} {...rest}>
          {children}
        </Collapsible>
      )
    },
    [Collapsible, fieldHasErrors, errorCount],
  )

  return CustomBlock ? (
    <BlockComponentContext
      value={{
        ...contextProps,
        BlockCollapsible: CollapsibleWithErrorProps,
      }}
    >
      {CustomBlock}
      <BlockDrawer />
    </BlockComponentContext>
  ) : (
    <CollapsibleWithErrorProps>
      <RenderFields
        fields={formSchema}
        forceRender={true}
        parentIndexPath=""
        parentPath={''}
        parentSchemaPath=""
        permissions={true}
        readOnly={!isEditable}
      />
    </CollapsibleWithErrorProps>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/client/component/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .LexicalEditorTheme__block {
    @extend %body;
    margin-block: base(0.4);
    // Fixes a bug where, if the block field has a Select field, the Select field's dropdown menu would be hidden behind the lexical editor.
    z-index: 1;
    color: var(--theme-text);

    &[data-lexical-decorator='true'] {
      // Increase specifity
      width: auto;
    }

    &__container {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 2);
    }

    &__row {
      .collapsible__toggle-wrap {
        padding-inline-start: base(0.4);
      }
    }

    &__header {
      h3 {
        margin: 0;
      }
    }

    &__header-wrap {
      display: flex;
      align-items: flex-end;
      width: 100%;
      justify-content: space-between;
    }

    &__heading-with-error {
      display: flex;
      align-items: center;
      gap: calc(var(--base) * 0.5);
    }

    &--has-no-error {
      > .array-field__header .array-field__heading-with-error {
        color: var(--theme-text);
      }
    }

    &--has-error {
      > .array-field__header {
        color: var(--theme-error-500);
      }
    }

    &__error-pill {
      align-self: center;
    }

    &__header-actions {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
    }

    &__header-action {
      @extend %btn-reset;
      cursor: pointer;
      margin-left: calc(var(--base) * 0.5);

      &:hover,
      &:focus-visible {
        text-decoration: underline;
      }
    }

    .collapsible {
      &__header-wrap {
        //  Make more space for the block header (default right: is `calc(var(--base) * 3)`) so that the remove button aligns nicely to the right
        right: calc(var(--base) * 1.5);
      }
    }

    &__removeButton.btn {
      margin: 0;
      &:hover {
        background-color: var(--theme-elevation-200);
      }
    }

    &__editButton.btn {
      margin: 0;
      width: 24px;

      &:hover {
        background-color: var(--theme-elevation-200);
      }
    }

    &__block-header {
      pointer-events: none;
    }

    &__block-header * {
      pointer-events: all;
    }

    &__block-header,
    &__block-header > div:first-child {
      display: flex;
      max-width: 100%;
      width: 100%;
      overflow: hidden;
      gap: calc(var(--base) * 0.375);
      justify-content: flex-start;
      pointer-events: none;

      & > * {
        pointer-events: all;
      }
    }

    &__block-header > div:nth-child(2) {
      display: flex;
      justify-content: flex-end;
    }

    &__block-number {
      flex-shrink: 0;
    }

    &__block-pill {
      flex-shrink: 0;
      display: block;
      line-height: unset;
    }

    &__rows {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) / 2);
    }

    &__drawer-toggler {
      background-color: transparent;
      margin: 0;
      padding: 0;
      border: none;
      align-self: flex-start;

      .btn {
        color: var(--theme-elevation-400);
        margin: 0;

        &:hover {
          color: var(--theme-elevation-800);
        }
      }
    }

    &-not-found {
      color: var(--theme-error-500);
      font-size: 1.1rem;
    }
  }

  html[data-theme='light'] {
    .blocks-field--has-error {
      .section-title__input,
      .blocks-field__heading-with-error {
        color: var(--theme-error-750);
      }
    }
  }

  html[data-theme='dark'] {
    .blocks-field--has-error {
      .section-title__input,
      .blocks-field__heading-with-error {
        color: var(--theme-error-500);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
