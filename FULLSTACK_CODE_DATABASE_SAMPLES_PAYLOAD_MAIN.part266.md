---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 266
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 266 of 695)

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

---[FILE: nodeTypes.ts]---
Location: payload-main/packages/richtext-lexical/src/nodeTypes.ts

```typescript
import type {
  SerializedLineBreakNode as _SerializedLineBreakNode,
  SerializedTabNode as _SerializedTabNode,
  SerializedTextNode as _SerializedTextNode,
  SerializedEditorState,
  SerializedElementNode,
  SerializedLexicalNode,
} from 'lexical'

import type { SerializedQuoteNode } from './features/blockquote/server/index.js'
import type { SerializedBlockNode } from './features/blocks/server/nodes/BlocksNode.js'
import type { SerializedInlineBlockNode } from './features/blocks/server/nodes/InlineBlocksNode.js'
import type {
  SerializedTableCellNode,
  SerializedTableNode,
  SerializedTableRowNode,
} from './features/experimental_table/server/index.js'
import type { SerializedHeadingNode } from './features/heading/server/index.js'
import type { SerializedHorizontalRuleNode } from './features/horizontalRule/server/nodes/HorizontalRuleNode.js'
import type { SerializedAutoLinkNode, SerializedLinkNode } from './features/link/nodes/types.js'
import type { SerializedListItemNode, SerializedListNode } from './features/lists/plugin/index.js'
import type { SerializedRelationshipNode } from './features/relationship/server/nodes/RelationshipNode.js'
import type { SerializedUploadNode } from './features/upload/server/nodes/UploadNode.js'

/**
 * Helper type to create strongly typed serialized nodes with flexible children types.
 * Omits 'children' and 'type' from the base node type and redeclares them with proper typing.
 *
 * @param TBase - The base Lexical node type (e.g., _SerializedHeadingNode)
 * @param TType - The node type string (e.g., 'heading')
 * @param TChildren - The type for children (defaults to SerializedLexicalNode)
 */
export type StronglyTypedElementNode<
  TBase,
  TType extends string,
  TChildren extends SerializedLexicalNode = SerializedLexicalNode,
> = {
  children: TChildren[]
  type: TType
} & Omit<TBase, 'children' | 'type'>

/**
 * Helper type to create strongly typed leaf nodes (nodes without children).
 * Omits 'children' and 'type' from the base node type and redeclares 'type' with a literal.
 *
 * @param TBase - The base Lexical node type (e.g., _SerializedTextNode)
 * @param TType - The node type string (e.g., 'text')
 */
export type StronglyTypedLeafNode<TBase, TType extends string> = {
  type: TType
} & Omit<TBase, 'children' | 'type'>

export type {
  SerializedAutoLinkNode,
  SerializedBlockNode,
  SerializedHeadingNode,
  SerializedHorizontalRuleNode,
  SerializedInlineBlockNode,
  SerializedLinkNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedQuoteNode,
  SerializedRelationshipNode,
  SerializedTableCellNode,
  SerializedTableNode,
  SerializedTableRowNode,
  SerializedUploadNode,
}

export type SerializedParagraphNode<T extends SerializedLexicalNode = SerializedLexicalNode> = {
  textFormat: number
} & StronglyTypedElementNode<SerializedElementNode, 'paragraph', T>

export type SerializedTextNode = StronglyTypedLeafNode<_SerializedTextNode, 'text'>

export type SerializedTabNode = StronglyTypedLeafNode<_SerializedTabNode, 'tab'>

export type SerializedLineBreakNode = StronglyTypedLeafNode<_SerializedLineBreakNode, 'linebreak'>

/**
 * Recursively adds typed children to nodes up to a specified depth.
 *
 * Key behaviors:
 * - `T extends any`: Distributive - processes each union member individually
 * - `OriginalUnion`: Preserves full union so nested children accept all node types, not just parent's type. If we just used `T`, the type would be narrowed to the parent's type and the children would only consist of the parent's type.
 * - `'children' extends keyof T`: Only adds children to container nodes; respects leaf nodes that use `Omit<_, 'children'>`
 * - `Depth`: Limits recursion to prevent infinite types (default: 4 levels)
 *
 * @internal - this type may change or be removed in a minor release
 */
export type RecursiveNodes<
  T extends SerializedLexicalNode,
  Depth extends number = 4,
  OriginalUnion extends SerializedLexicalNode = T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = T extends any // Make distributive over unions
  ? Depth extends 0
    ? T
    : 'children' extends keyof T
      ? { children?: RecursiveNodes<OriginalUnion, DecrementDepth<Depth>, OriginalUnion>[] } & T
      : T // Skip leaf nodes
  : never

/** Decrements depth: 4→3, 3→2, 2→1, 1→0, 0→0 */
type DecrementDepth<N extends number> = [0, 0, 1, 2, 3, 4][N]

/**
 * Alternative type to `SerializedEditorState` that automatically types your nodes
 * more strictly, narrowing down nodes based on the `type` without having to manually
 * type-cast.
 */
export type TypedEditorState<T extends SerializedLexicalNode = SerializedLexicalNode> = {
  [k: string]: unknown
} & SerializedEditorState<RecursiveNodes<T>>

/**
 * All node types included by default in a lexical editor without configuration.
 */
export type DefaultNodeTypes =
  | SerializedAutoLinkNode
  //| SerializedBlockNode // Not included by default
  | SerializedHeadingNode
  | SerializedHorizontalRuleNode
  | SerializedLineBreakNode
  | SerializedLinkNode
  | SerializedListItemNode
  | SerializedListNode
  | SerializedParagraphNode
  | SerializedQuoteNode
  | SerializedRelationshipNode
  | SerializedTabNode
  | SerializedTextNode
  | SerializedUploadNode

/**
 * Like `TypedEditorState` but includes all default node types.
 * You can pass *additional* node types as a generic parameter.
 */
export type DefaultTypedEditorState<
  TAdditionalNodeTypes extends null | SerializedLexicalNode = null,
> = [TAdditionalNodeTypes] extends null
  ? TypedEditorState<DefaultNodeTypes>
  : TypedEditorState<DefaultNodeTypes | NonNullable<TAdditionalNodeTypes>>
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/types.ts

```typescript
import type { EditorConfig as LexicalEditorConfig, SerializedEditorState } from 'lexical'
import type {
  ClientField,
  DefaultServerCellComponentProps,
  LabelFunction,
  RichTextAdapter,
  RichTextField,
  RichTextFieldClient,
  RichTextFieldClientProps,
  SanitizedConfig,
  ServerFieldBase,
  StaticLabel,
} from 'payload'

import type {
  BaseClientFeatureProps,
  FeatureProviderProviderClient,
} from './features/typesClient.js'
import type { FeatureProviderServer } from './features/typesServer.js'
import type { SanitizedServerEditorConfig } from './lexical/config/types.js'
import type { InitialLexicalFormState } from './utilities/buildInitialState.js'

export type LexicalFieldAdminProps = {
  /**
   * Controls if the add block button should be hidden. @default false
   */
  hideAddBlockButton?: boolean
  /**
   * Controls if the draggable block element should be hidden. @default false
   */
  hideDraggableBlockElement?: boolean
  /**
   * Controls if the gutter (padding to the left & gray vertical line) should be hidden. @default false
   */
  hideGutter?: boolean
  /**
   * Controls if the insert paragraph at the end button should be hidden. @default false
   */
  hideInsertParagraphAtEnd?: boolean
  /**
   * Changes the placeholder text in the editor if no content is present.
   */
  placeholder?: LabelFunction | StaticLabel
}

export type LexicalFieldAdminClientProps = {
  placeholder?: string
} & Omit<LexicalFieldAdminProps, 'placeholder'>

export type FeaturesInput =
  | (({
      defaultFeatures,
      rootFeatures,
    }: {
      /**
       * This opinionated array contains all "recommended" default features.
       *
       * @Example
       *
       * ```ts
       *  editor: lexicalEditor({
       *    features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
       *  })
       *  ```
       */
      defaultFeatures: FeatureProviderServer<any, any, any>[]
      /**
       * This array contains all features that are enabled in the root richText editor (the one defined in the payload.config.ts).
       * If this field is the root richText editor, or if the root richText editor is not a lexical editor, this array will be empty.
       *
       * @Example
       *
       * ```ts
       *  editor: lexicalEditor({
       *    features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature()],
       *  })
       *  ```
       */
      rootFeatures: FeatureProviderServer<any, any, any>[]
    }) => FeatureProviderServer<any, any, any>[])
  | FeatureProviderServer<any, any, any>[]

export type LexicalEditorProps = {
  admin?: LexicalFieldAdminProps
  features?: FeaturesInput
  lexical?: LexicalEditorConfig
}

export type LexicalRichTextAdapter = {
  editorConfig: SanitizedServerEditorConfig
  features: FeatureProviderServer<any, any, any>[]
} & RichTextAdapter<SerializedEditorState, AdapterProps>

export type LexicalRichTextAdapterProvider =
  /**
   * This is being called during the payload sanitization process
   */
  ({
    config,
    isRoot,
    parentIsLocalized,
  }: {
    config: SanitizedConfig
    isRoot?: boolean
    parentIsLocalized: boolean
  }) => Promise<LexicalRichTextAdapter>

export type SingleFeatureClientSchemaMap = {
  [key: string]: ClientField[]
}
export type FeatureClientSchemaMap = {
  [featureKey: string]: SingleFeatureClientSchemaMap
}

export type LexicalRichTextFieldProps = {
  admin?: LexicalFieldAdminClientProps
  // clientFeatures is added through the rsc field
  clientFeatures: {
    [featureKey: string]: {
      clientFeatureProps?: BaseClientFeatureProps<Record<string, any>>
      clientFeatureProvider?: FeatureProviderProviderClient<any, any>
    }
  }
  /**
   * Part of the import map that contains client components for all lexical features of this field that
   * have been added through `feature.componentImports`.
   */
  featureClientImportMap?: Record<string, any>
  featureClientSchemaMap: FeatureClientSchemaMap
  initialLexicalFormState: InitialLexicalFormState
  lexicalEditorConfig: LexicalEditorConfig | undefined // Undefined if default lexical editor config should be used
} & Pick<ServerFieldBase, 'permissions'> &
  RichTextFieldClientProps<SerializedEditorState, AdapterProps, object>

export type LexicalRichTextCellProps = DefaultServerCellComponentProps<
  RichTextFieldClient<SerializedEditorState, AdapterProps, object>,
  SerializedEditorState
>

export type AdapterProps = {
  editorConfig: SanitizedServerEditorConfig
}

export type GeneratedFeatureProviderComponent = {
  clientFeature: FeatureProviderProviderClient<any, any>
  clientFeatureProps: BaseClientFeatureProps<object>
}

export type LexicalRichTextField = RichTextField<SerializedEditorState, AdapterProps>
```

--------------------------------------------------------------------------------

---[FILE: rscEntry.tsx]---
Location: payload-main/packages/richtext-lexical/src/cell/rscEntry.tsx
Signals: React

```typescript
import type { SerializedLexicalNode } from 'lexical'

import { getTranslation } from '@payloadcms/translations'
import { Link } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import type { LexicalRichTextCellProps } from '../types.js'

function recurseEditorState(
  editorState: SerializedLexicalNode[],
  textContent: React.ReactNode[],
  i: number = 0,
): React.ReactNode[] {
  for (const node of editorState) {
    i++
    if ('text' in node && node.text) {
      textContent.push(node.text as string)
    } else {
      if (!('children' in node)) {
        textContent.push(<code key={i}>&#32;[{node.type}]</code>)
      }
    }
    if ('children' in node && node.children) {
      textContent = recurseEditorState(node.children as SerializedLexicalNode[], textContent, i)
    }
  }
  return textContent
}

export const RscEntryLexicalCell: React.FC<LexicalRichTextCellProps> = (props) => {
  const {
    cellData,
    className: classNameFromProps,
    collectionConfig,
    field: { admin },
    field,
    i18n,
    link,
    onClick: onClickFromProps,
    payload,
    rowData,
  } = props

  const classNameFromConfigContext = admin && 'className' in admin ? admin.className : undefined

  const className =
    classNameFromProps ||
    (field.admin && 'className' in field.admin ? field.admin.className : null) ||
    classNameFromConfigContext
  const adminRoute = payload.config.routes.admin
  const serverURL = payload.config.serverURL

  const onClick = onClickFromProps

  let WrapElement: React.ComponentType<any> | string = 'span'

  const wrapElementProps: {
    className?: string
    href?: string
    onClick?: () => void
    prefetch?: false
    type?: 'button'
  } = {
    className,
  }

  if (link) {
    wrapElementProps.prefetch = false
    WrapElement = Link
    wrapElementProps.href = collectionConfig?.slug
      ? formatAdminURL({
          adminRoute,
          path: `/collections/${collectionConfig?.slug}/${rowData.id}`,
          serverURL,
        })
      : ''
  }

  if (typeof onClick === 'function') {
    WrapElement = 'button'
    wrapElementProps.type = 'button'
    wrapElementProps.onClick = () => {
      onClick({
        cellData,
        collectionSlug: collectionConfig?.slug,
        rowData,
      })
    }
  }

  let textContent: React.ReactNode[] = []

  if (cellData?.root?.children) {
    textContent = recurseEditorState(cellData?.root?.children, textContent)
  }

  if (!textContent?.length) {
    textContent = [
      i18n.t('general:noLabel', {
        label: getTranslation(('label' in field ? field.label : null) || 'data', i18n),
      }),
    ]
  }

  return <WrapElement {...wrapElementProps}>{textContent}</WrapElement>
}
```

--------------------------------------------------------------------------------

---[FILE: cssEntry.ts]---
Location: payload-main/packages/richtext-lexical/src/exports/cssEntry.ts

```typescript
// The purpose of this file is to export all modules that may contain SCSS.
// These will then be bundled into one CSS file by our bundler.

export * from './client/index.js'
export * from './server/rsc.js'
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/packages/richtext-lexical/src/exports/shared.ts

```typescript
export { collectTopLevelJSXInLines } from '../utilities/jsx/collectTopLevelJSXInLines.js'

export { extractPropsFromJSXPropsString } from '../utilities/jsx/extractPropsFromJSXPropsString.js'
export {
  extractFrontmatter,
  frontmatterToObject,
  objectToFrontmatter,
  propsToJSXString,
} from '../utilities/jsx/jsx.js'
export { hasText } from '../validate/hasText.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/exports/client/index.ts

```typescript
/* eslint-disable perfectionist/sort-exports */
'use client'

export { slashMenuBasicGroupWithItems } from '../../features/shared/slashMenu/basicGroup.js'

export { AlignFeatureClient } from '../../features/align/client/index.js'
export { BlockquoteFeatureClient } from '../../features/blockquote/client/index.js'
export { BlocksFeatureClient } from '../../features/blocks/client/index.js'
export {
  INSERT_BLOCK_COMMAND,
  INSERT_INLINE_BLOCK_COMMAND,
} from '../../features/blocks/client/plugin/commands.js'

export { TestRecorderFeatureClient } from '../../features/debug/testRecorder/client/index.js'
export { TreeViewFeatureClient } from '../../features/debug/treeView/client/index.js'
export { BoldFeatureClient } from '../../features/format/bold/feature.client.js'
export { InlineCodeFeatureClient } from '../../features/format/inlineCode/feature.client.js'
export { ItalicFeatureClient } from '../../features/format/italic/feature.client.js'
export { StrikethroughFeatureClient } from '../../features/format/strikethrough/feature.client.js'
export { SubscriptFeatureClient } from '../../features/format/subscript/feature.client.js'
export { SuperscriptFeatureClient } from '../../features/format/superscript/feature.client.js'
export { UnderlineFeatureClient } from '../../features/format/underline/feature.client.js'
export { TextStateFeatureClient } from '../../features/textState/feature.client.js'
export { HeadingFeatureClient } from '../../features/heading/client/index.js'
export { HorizontalRuleFeatureClient } from '../../features/horizontalRule/client/index.js'
export { IndentFeatureClient } from '../../features/indent/client/index.js'
export { LinkFeatureClient } from '../../features/link/client/index.js'
export { ChecklistFeatureClient } from '../../features/lists/checklist/client/index.js'
export { OrderedListFeatureClient } from '../../features/lists/orderedList/client/index.js'
export { UnorderedListFeatureClient } from '../../features/lists/unorderedList/client/index.js'
export { LexicalPluginToLexicalFeatureClient } from '../../features/migrations/lexicalPluginToLexical/feature.client.js'
export { SlateToLexicalFeatureClient } from '../../features/migrations/slateToLexical/feature.client.js'
export { ParagraphFeatureClient } from '../../features/paragraph/client/index.js'
export { DebugJsxConverterFeatureClient } from '../../features/debug/jsxConverter/client/index.js'
export { defaultColors } from '../../features/textState/defaultColors.js'

export { RelationshipFeatureClient } from '../../features/relationship/client/index.js'

export { toolbarFormatGroupWithItems } from '../../features/format/shared/toolbarFormatGroup.js'
export { toolbarAddDropdownGroupWithItems } from '../../features/shared/toolbar/addDropdownGroup.js'
export { toolbarFeatureButtonsGroupWithItems } from '../../features/shared/toolbar/featureButtonsGroup.js'
export { toolbarTextDropdownGroupWithItems } from '../../features/shared/toolbar/textDropdownGroup.js'
export { FixedToolbarFeatureClient } from '../../features/toolbars/fixed/client/index.js'
export { InlineToolbarFeatureClient } from '../../features/toolbars/inline/client/index.js'
export { ToolbarButton } from '../../features/toolbars/shared/ToolbarButton/index.js'
export { TableFeatureClient } from '../../features/experimental_table/client/index.js'

export { ToolbarDropdown } from '../../features/toolbars/shared/ToolbarDropdown/index.js'
export { UploadFeatureClient } from '../../features/upload/client/index.js'

export { RichTextField } from '../../field/index.js'
export {
  EditorConfigProvider,
  useEditorConfigContext,
} from '../../lexical/config/client/EditorConfigProvider.js'
export { defaultEditorLexicalConfig } from '../../lexical/config/client/default.js'

export {
  sanitizeClientEditorConfig,
  sanitizeClientFeatures,
} from '../../lexical/config/client/sanitize.js'
export { CAN_USE_DOM } from '../../lexical/utils/canUseDOM.js'
export { getDOMRangeRect } from '../../lexical/utils/getDOMRangeRect.js'
export { getSelectedNode } from '../../lexical/utils/getSelectedNode.js'
export { isHTMLElement } from '../../lexical/utils/guard.js'
export { joinClasses } from '../../lexical/utils/joinClasses.js'

export { createBlockNode } from '../../lexical/utils/markdown/createBlockNode.js'
export { isPoint, Point } from '../../lexical/utils/point.js'
export { Rect } from '../../lexical/utils/rect.js'
export { setFloatingElemPosition } from '../../lexical/utils/setFloatingElemPosition.js'
export { setFloatingElemPositionForLinkEditor } from '../../lexical/utils/setFloatingElemPositionForLinkEditor.js'

export {
  addSwipeDownListener,
  addSwipeLeftListener,
  addSwipeRightListener,
  addSwipeUpListener,
} from '../../lexical/utils/swipe.js'
export { createClientFeature } from '../../utilities/createClientFeature.js'

export {
  DETAIL_TYPE_TO_DETAIL,
  DOUBLE_LINE_BREAK,
  ELEMENT_FORMAT_TO_TYPE,
  ELEMENT_TYPE_TO_FORMAT,
  IS_ALL_FORMATTING,
  LTR_REGEX,
  NodeFormat,
  NON_BREAKING_SPACE,
  RTL_REGEX,
  TEXT_MODE_TO_TYPE,
  TEXT_TYPE_TO_FORMAT,
  TEXT_TYPE_TO_MODE,
} from '../../lexical/utils/nodeFormat.js'

export { ENABLE_SLASH_MENU_COMMAND } from '../../lexical/plugins/SlashMenu/LexicalTypeaheadMenuPlugin/index.js'

export { getEnabledNodes } from '../../lexical/nodes/index.js'

export {
  $createUploadNode,
  $isUploadNode,
  UploadNode,
} from '../../features/upload/client/nodes/UploadNode.js'

export {
  $createRelationshipNode,
  $isRelationshipNode,
  RelationshipNode,
} from '../../features/relationship/client/nodes/RelationshipNode.js'

export {
  $createLinkNode,
  $isLinkNode,
  LinkNode,
  TOGGLE_LINK_COMMAND,
} from '../../features/link/nodes/LinkNode.js'

export {
  $createAutoLinkNode,
  $isAutoLinkNode,
  AutoLinkNode,
} from '../../features/link/nodes/AutoLinkNode.js'

export {
  $createBlockNode,
  $isBlockNode,
  BlockNode,
} from '../../features/blocks/client/nodes/BlocksNode.js'

export {
  $createInlineBlockNode,
  $isInlineBlockNode,
  InlineBlockNode,
} from '../../features/blocks/client/nodes/InlineBlocksNode.js'

export {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
  HorizontalRuleNode,
} from '../../features/horizontalRule/client/nodes/HorizontalRuleNode.js'

export { FieldsDrawer } from '../../utilities/fieldsDrawer/Drawer.js'
export { useLexicalDocumentDrawer } from '../../utilities/fieldsDrawer/useLexicalDocumentDrawer.js'
export { useLexicalDrawer } from '../../utilities/fieldsDrawer/useLexicalDrawer.js'
export { useLexicalListDrawer } from '../../utilities/fieldsDrawer/useLexicalListDrawer.js'

export { InlineBlockEditButton } from '../../features/blocks/client/componentInline/components/InlineBlockEditButton.js'
export { InlineBlockRemoveButton } from '../../features/blocks/client/componentInline/components/InlineBlockRemoveButton.js'
export { InlineBlockLabel } from '../../features/blocks/client/componentInline/components/InlineBlockLabel.js'
export { InlineBlockContainer } from '../../features/blocks/client/componentInline/components/InlineBlockContainer.js'
export { useInlineBlockComponentContext } from '../../features/blocks/client/componentInline/index.js'
export { BlockCollapsible } from '../../features/blocks/client/component/components/BlockCollapsible.js'
export { BlockEditButton } from '../../features/blocks/client/component/components/BlockEditButton.js'
export { BlockRemoveButton } from '../../features/blocks/client/component/components/BlockRemoveButton.js'
export { useBlockComponentContext } from '../../features/blocks/client/component/BlockContent.js'
export { getRestPopulateFn } from '../../features/converters/utilities/restPopulateFn.js'
export { codeConverterClient } from '../../features/blocks/premade/CodeBlock/converterClient.js'
export { CodeComponent } from '../../features/blocks/premade/CodeBlock/Component/Code.js'
export { CodeBlockBlockComponent } from '../../features/blocks/premade/CodeBlock/Component/Block.js'

export { RenderLexical } from '../../field/RenderLexical/index.js'
export { buildDefaultEditorState, buildEditorState } from '../../utilities/buildEditorState.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/exports/html/index.ts

```typescript
export type {
  ProvidedCSS,
  SerializedLexicalNodeWithParent,
} from '../../features/converters/lexicalToHtml/shared/types.js'
export { BlockquoteHTMLConverter } from '../../features/converters/lexicalToHtml/sync/converters/blockquote.js'
export { HeadingHTMLConverter } from '../../features/converters/lexicalToHtml/sync/converters/heading.js'
export { HorizontalRuleHTMLConverter } from '../../features/converters/lexicalToHtml/sync/converters/horizontalRule.js'
export { LinebreakHTMLConverter } from '../../features/converters/lexicalToHtml/sync/converters/linebreak.js'
export { LinkHTMLConverter } from '../../features/converters/lexicalToHtml/sync/converters/link.js'
export { ListHTMLConverter } from '../../features/converters/lexicalToHtml/sync/converters/list.js'
export { ParagraphHTMLConverter } from '../../features/converters/lexicalToHtml/sync/converters/paragraph.js'
export { TabHTMLConverter } from '../../features/converters/lexicalToHtml/sync/converters/tab.js'
export { TableHTMLConverter } from '../../features/converters/lexicalToHtml/sync/converters/table.js'

export { TextHTMLConverter } from '../../features/converters/lexicalToHtml/sync/converters/text.js'

export { UploadHTMLConverter } from '../../features/converters/lexicalToHtml/sync/converters/upload.js'
export { defaultHTMLConverters } from '../../features/converters/lexicalToHtml/sync/defaultConverters.js'
export { convertLexicalToHTML } from '../../features/converters/lexicalToHtml/sync/index.js'

export type {
  HTMLConverter,
  HTMLConverters,
  HTMLConvertersFunction,
} from '../../features/converters/lexicalToHtml/sync/types.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/exports/html-async/index.ts

```typescript
export { BlockquoteHTMLConverterAsync } from '../../features/converters/lexicalToHtml/async/converters/blockquote.js'
export { HeadingHTMLConverterAsync } from '../../features/converters/lexicalToHtml/async/converters/heading.js'
export { HorizontalRuleHTMLConverterAsync } from '../../features/converters/lexicalToHtml/async/converters/horizontalRule.js'
export { LinebreakHTMLConverterAsync } from '../../features/converters/lexicalToHtml/async/converters/linebreak.js'
export { LinkHTMLConverterAsync } from '../../features/converters/lexicalToHtml/async/converters/link.js'
export { ListHTMLConverterAsync } from '../../features/converters/lexicalToHtml/async/converters/list.js'
export { ParagraphHTMLConverterAsync } from '../../features/converters/lexicalToHtml/async/converters/paragraph.js'
export { TabHTMLConverterAsync } from '../../features/converters/lexicalToHtml/async/converters/tab.js'
export { TableHTMLConverterAsync } from '../../features/converters/lexicalToHtml/async/converters/table.js'
export { TextHTMLConverterAsync } from '../../features/converters/lexicalToHtml/async/converters/text.js'

export { UploadHTMLConverterAsync } from '../../features/converters/lexicalToHtml/async/converters/upload.js'

export { defaultHTMLConvertersAsync } from '../../features/converters/lexicalToHtml/async/defaultConverters.js'
export { convertLexicalToHTMLAsync } from '../../features/converters/lexicalToHtml/async/index.js'
export type {
  HTMLConverterAsync,
  HTMLConvertersAsync,
  HTMLConvertersFunctionAsync,
} from '../../features/converters/lexicalToHtml/async/types.js'

export type {
  ProvidedCSS,
  SerializedLexicalNodeWithParent,
} from '../../features/converters/lexicalToHtml/shared/types.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/exports/plaintext/index.ts

```typescript
export { convertLexicalToPlaintext } from '../../features/converters/lexicalToPlaintext/sync/index.js'

export type {
  PlaintextConverter,
  PlaintextConverters,
} from '../../features/converters/lexicalToPlaintext/sync/types.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/exports/react/index.ts

```typescript
export {
  type JSXConvertersFunction,
  RichText,
} from '../../features/converters/lexicalToJSX/Component/index.js'
export { BlockquoteJSXConverter } from '../../features/converters/lexicalToJSX/converter/converters/blockquote.js'
export { HeadingJSXConverter } from '../../features/converters/lexicalToJSX/converter/converters/heading.js'
export { HorizontalRuleJSXConverter } from '../../features/converters/lexicalToJSX/converter/converters/horizontalRule.js'
export { LinebreakJSXConverter } from '../../features/converters/lexicalToJSX/converter/converters/linebreak.js'
export { LinkJSXConverter } from '../../features/converters/lexicalToJSX/converter/converters/link.js'
export { ListJSXConverter } from '../../features/converters/lexicalToJSX/converter/converters/list.js'
export { ParagraphJSXConverter } from '../../features/converters/lexicalToJSX/converter/converters/paragraph.js'
export { TabJSXConverter } from '../../features/converters/lexicalToJSX/converter/converters/tab.js'
export { TableJSXConverter } from '../../features/converters/lexicalToJSX/converter/converters/table.js'

export { TextJSXConverter } from '../../features/converters/lexicalToJSX/converter/converters/text.js'

export { UploadJSXConverter } from '../../features/converters/lexicalToJSX/converter/converters/upload.js'
export { defaultJSXConverters } from '../../features/converters/lexicalToJSX/converter/defaultConverters.js'
export { convertLexicalNodesToJSX } from '../../features/converters/lexicalToJSX/converter/index.js'
export type {
  JSXConverter,
  JSXConverters,
  SerializedLexicalNodeWithParent,
} from '../../features/converters/lexicalToJSX/converter/types.js'
```

--------------------------------------------------------------------------------

---[FILE: migrate.ts]---
Location: payload-main/packages/richtext-lexical/src/exports/server/migrate.ts

```typescript
export { LexicalPluginToLexicalFeature } from '../../features/migrations/lexicalPluginToLexical/feature.server.js'
export { SlateBlockquoteConverter } from '../../features/migrations/slateToLexical/converter/converters/blockquote/converter.js'
export { SlateHeadingConverter } from '../../features/migrations/slateToLexical/converter/converters/heading/converter.js'
export { SlateIndentConverter } from '../../features/migrations/slateToLexical/converter/converters/indent/converter.js'
export { SlateLinkConverter } from '../../features/migrations/slateToLexical/converter/converters/link/converter.js'
export { SlateListItemConverter } from '../../features/migrations/slateToLexical/converter/converters/listItem/converter.js'
export { SlateOrderedListConverter } from '../../features/migrations/slateToLexical/converter/converters/orderedList/converter.js'
export { SlateRelationshipConverter } from '../../features/migrations/slateToLexical/converter/converters/relationship/converter.js'
export { SlateUnknownConverter } from '../../features/migrations/slateToLexical/converter/converters/unknown/converter.js'
export { SlateUnorderedListConverter } from '../../features/migrations/slateToLexical/converter/converters/unorderedList/converter.js'
export { SlateUploadConverter } from '../../features/migrations/slateToLexical/converter/converters/upload/converter.js'
export { defaultSlateConverters } from '../../features/migrations/slateToLexical/converter/defaultConverters.js'
export {
  convertSlateNodesToLexical,
  convertSlateToLexical,
} from '../../features/migrations/slateToLexical/converter/index.js'

export { SlateToLexicalFeature } from '../../features/migrations/slateToLexical/feature.server.js'
export { migrateSlateToLexical } from '../../utilities/migrateSlateToLexical/index.js'
```

--------------------------------------------------------------------------------

---[FILE: rsc.ts]---
Location: payload-main/packages/richtext-lexical/src/exports/server/rsc.ts

```typescript
export { RscEntryLexicalCell } from '../../cell/rscEntry.js'
export { LexicalDiffComponent } from '../../field/Diff/index.js'
export { RscEntryLexicalField } from '../../field/rscEntry.js'
```

--------------------------------------------------------------------------------

---[FILE: mdx.ts]---
Location: payload-main/packages/richtext-lexical/src/exports/server/ast/mdx.ts

```typescript
import * as acorn from 'acorn'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { mdxJsxFromMarkdown } from 'mdast-util-mdx-jsx'
import { mdxJsx } from 'micromark-extension-mdx-jsx'

export type AST = ReturnType<typeof fromMarkdown>

export function parseJSXToAST({
  jsxString,
  keepPositions,
}: {
  jsxString: string
  keepPositions?: boolean
}): AST {
  const treeComplex: AST = fromMarkdown(jsxString, {
    // @ts-expect-error
    extensions: [mdxJsx({ acorn, addResult: false })],
    mdastExtensions: [mdxJsxFromMarkdown()],
  })

  // Remove "position" keys
  const parseTree = (tree: object) => {
    for (const key in tree) {
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      if (key === 'position' && tree[key].start && tree[key].end) {
        // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
        delete tree[key]
        // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      } else if (typeof tree[key] === 'object') {
        // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
        parseTree(tree[key])
        // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      } else if (Array.isArray(tree[key])) {
        // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
        for (const item of tree[key]) {
          parseTree(item)
        }
      }
    }
  }

  const tree: AST = treeComplex

  if (keepPositions !== true) {
    parseTree(tree)
  }

  return tree
}
```

--------------------------------------------------------------------------------

````
