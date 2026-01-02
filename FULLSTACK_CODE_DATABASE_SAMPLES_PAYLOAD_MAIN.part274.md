---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 274
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 274 of 695)

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
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml_deprecated/converter/index.ts

```typescript
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import type { Payload, PayloadRequest } from 'payload'

import { createLocalReq } from 'payload'

import type { HTMLConverter, SerializedLexicalNodeWithParent } from './types.js'

import { hasText } from '../../../../validate/hasText.js'

/**
 * @deprecated - will be removed in 4.0
 */
export type ConvertLexicalToHTMLArgs = {
  converters: HTMLConverter[]
  currentDepth?: number
  data: SerializedEditorState
  depth?: number
  draft?: boolean // default false
  overrideAccess?: boolean // default false
  showHiddenFields?: boolean // default false
} & (
  | {
      /**
       * This payload property will only be used if req is undefined.
       */
      payload?: never
      /**
       * When the converter is called, req CAN be passed in depending on where it's run.
       * If this is undefined and config is passed through, lexical will create a new req object for you. If this is null or
       * config is undefined, lexical will not create a new req object for you and local API / server-side-only
       * functionality will be disabled.
       */
      req: PayloadRequest
    }
  | {
      /**
       * This payload property will only be used if req is undefined.
       */
      payload?: Payload
      /**
       * When the converter is called, req CAN be passed in depending on where it's run.
       * If this is undefined and config is passed through, lexical will create a new req object for you. If this is null or
       * config is undefined, lexical will not create a new req object for you and local API / server-side-only
       * functionality will be disabled.
       */
      req?: null | undefined
    }
)

/**
 * @deprecated - will be removed in 4.0. Use the function exported from `@payloadcms/richtext-lexical/html` instead.
 * @example
 * ```ts
 * // old (deprecated)
 * import { convertLexicalToHTML } from '@payloadcms/richtext-lexical'
 * // new (recommended)
 * import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
 * ```
 * For more details, you can refer to https://payloadcms.com/docs/rich-text/converting-html to see all the
 * ways to convert lexical to HTML.
 */
export async function convertLexicalToHTML({
  converters,
  currentDepth,
  data,
  depth,
  draft,
  overrideAccess,
  payload,
  req,
  showHiddenFields,
}: ConvertLexicalToHTMLArgs): Promise<string> {
  if (hasText(data)) {
    if (req === undefined && payload) {
      req = await createLocalReq({}, payload)
    }

    if (!currentDepth) {
      currentDepth = 0
    }

    if (!depth) {
      depth = req?.payload?.config?.defaultDepth
    }

    return await convertLexicalNodesToHTML({
      converters,
      currentDepth,
      depth: depth!,
      draft: draft === undefined ? false : draft,
      lexicalNodes: data?.root?.children,
      overrideAccess: overrideAccess === undefined ? false : overrideAccess,
      parent: data?.root,
      req: req!,
      showHiddenFields: showHiddenFields === undefined ? false : showHiddenFields,
    })
  }
  return ''
}

/**
 * @deprecated - will be removed in 4.0
 */
export async function convertLexicalNodesToHTML({
  converters,
  currentDepth,
  depth,
  draft,
  lexicalNodes,
  overrideAccess,
  parent,
  req,
  showHiddenFields,
}: {
  converters: HTMLConverter[]
  currentDepth: number
  depth: number
  draft: boolean
  lexicalNodes: SerializedLexicalNode[]
  overrideAccess: boolean
  parent: SerializedLexicalNodeWithParent
  /**
   * When the converter is called, req CAN be passed in depending on where it's run.
   */
  req: null | PayloadRequest
  showHiddenFields: boolean
}): Promise<string> {
  const unknownConverter = converters.find((converter) => converter.nodeTypes.includes('unknown'))

  const htmlArray = await Promise.all(
    lexicalNodes.map(async (node, i) => {
      const converterForNode = converters.find((converter) =>
        converter.nodeTypes.includes(node.type),
      )
      try {
        if (!converterForNode) {
          if (unknownConverter) {
            return await unknownConverter.converter({
              childIndex: i,
              converters,
              currentDepth,
              depth,
              draft,
              node,
              overrideAccess,
              parent,
              req,
              showHiddenFields,
            })
          }
          return '<span>unknown node</span>'
        }
        return await converterForNode.converter({
          childIndex: i,
          converters,
          currentDepth,
          depth,
          draft,
          node,
          overrideAccess,
          parent,
          req,
          showHiddenFields,
        })
      } catch (error) {
        console.error('Error converting lexical node to HTML:', error, 'node:', node)
        return ''
      }
    }),
  )

  return htmlArray.join('') || ''
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml_deprecated/converter/types.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'
import type { PayloadRequest } from 'payload'

/**
 * @deprecated - will be removed in 4.0
 */
export type HTMLConverter<T extends SerializedLexicalNode = SerializedLexicalNode> = {
  converter: (args: {
    childIndex: number
    converters: HTMLConverter<any>[]
    currentDepth: number
    depth: number
    draft: boolean
    node: T
    overrideAccess: boolean
    parent: SerializedLexicalNodeWithParent
    /**
     * When the converter is called, req CAN be passed in depending on where it's run.
     */
    req: null | PayloadRequest
    showHiddenFields: boolean
  }) => Promise<string> | string
  nodeTypes: string[]
}

export type SerializedLexicalNodeWithParent = {
  parent?: SerializedLexicalNode
} & SerializedLexicalNode
```

--------------------------------------------------------------------------------

---[FILE: linebreak.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml_deprecated/converter/converters/linebreak.ts

```typescript
import type { SerializedLineBreakNode } from '../../../../../nodeTypes.js'
import type { HTMLConverter } from '../types.js'

export const LinebreakHTMLConverter: HTMLConverter<SerializedLineBreakNode> = {
  converter() {
    return `<br>`
  },
  nodeTypes: ['linebreak'],
}
```

--------------------------------------------------------------------------------

---[FILE: paragraph.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml_deprecated/converter/converters/paragraph.ts

```typescript
import type { SerializedParagraphNode } from '../../../../../nodeTypes.js'
import type { HTMLConverter } from '../types.js'

import { convertLexicalNodesToHTML } from '../index.js'

export const ParagraphHTMLConverter: HTMLConverter<SerializedParagraphNode> = {
  async converter({
    converters,
    currentDepth,
    depth,
    draft,
    node,
    overrideAccess,
    parent,
    req,
    showHiddenFields,
  }) {
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
    return `<p${style ? ` style='${style}'` : ''}>${childrenText}</p>`
  },
  nodeTypes: ['paragraph'],
}
```

--------------------------------------------------------------------------------

---[FILE: tab.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml_deprecated/converter/converters/tab.ts

```typescript
import type { SerializedTabNode } from '../../../../../nodeTypes.js'
import type { HTMLConverter } from '../types.js'

export const TabHTMLConverter: HTMLConverter<SerializedTabNode> = {
  converter({ node }) {
    return node.text
  },
  nodeTypes: ['tab'],
}
```

--------------------------------------------------------------------------------

---[FILE: text.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml_deprecated/converter/converters/text.ts

```typescript
import escapeHTML from 'escape-html'

import type { SerializedTextNode } from '../../../../../nodeTypes.js'
import type { HTMLConverter } from '../types.js'

import { NodeFormat } from '../../../../../lexical/utils/nodeFormat.js'

export const TextHTMLConverter: HTMLConverter<SerializedTextNode> = {
  converter({ node }) {
    let text = escapeHTML(node.text)

    if (node.format & NodeFormat.IS_BOLD) {
      text = `<strong>${text}</strong>`
    }
    if (node.format & NodeFormat.IS_ITALIC) {
      text = `<em>${text}</em>`
    }
    if (node.format & NodeFormat.IS_STRIKETHROUGH) {
      text = `<span style="text-decoration: line-through">${text}</span>`
    }
    if (node.format & NodeFormat.IS_UNDERLINE) {
      text = `<span style="text-decoration: underline">${text}</span>`
    }
    if (node.format & NodeFormat.IS_CODE) {
      text = `<code>${text}</code>`
    }
    if (node.format & NodeFormat.IS_SUBSCRIPT) {
      text = `<sub>${text}</sub>`
    }
    if (node.format & NodeFormat.IS_SUPERSCRIPT) {
      text = `<sup>${text}</sup>`
    }

    return text
  },
  nodeTypes: ['text'],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml_deprecated/field/index.ts

```typescript
import type { SerializedEditorState } from 'lexical'
import type { Field } from 'payload'

import type { SanitizedServerEditorConfig } from '../../../../lexical/config/types.js'
import type { LexicalRichTextAdapter, LexicalRichTextField } from '../../../../types.js'
import type { HTMLConverter } from '../converter/types.js'
import type { HTMLConverterFeatureProps } from '../index.js'

import { defaultHTMLConverters } from '../converter/defaultConverters.js'
import { convertLexicalToHTML } from '../converter/index.js'

type Args = {
  /**
   * Whether the lexicalHTML field should be hidden in the admin panel
   *
   * @default true
   */
  hidden?: boolean
  name: string
  /**
   * Whether the HTML should be stored in the database
   *
   * @default false
   */
  storeInDB?: boolean
}

/**
 * Combines the default HTML converters with HTML converters found in the features, and with HTML converters configured in the htmlConverter feature.
 *
 * @deprecated - will be removed in 4.0
 * @param editorConfig
 */
export const consolidateHTMLConverters = ({
  editorConfig,
}: {
  editorConfig: SanitizedServerEditorConfig
}): HTMLConverter[] => {
  const htmlConverterFeature = editorConfig.resolvedFeatureMap.get('htmlConverter')
  const htmlConverterFeatureProps: HTMLConverterFeatureProps =
    htmlConverterFeature?.sanitizedServerFeatureProps

  const defaultConvertersWithConvertersFromFeatures = [...defaultHTMLConverters]

  for (const converter of editorConfig.features.converters.html) {
    defaultConvertersWithConvertersFromFeatures.push(converter)
  }

  const finalConverters =
    htmlConverterFeatureProps?.converters &&
    typeof htmlConverterFeatureProps?.converters === 'function'
      ? htmlConverterFeatureProps.converters({
          defaultConverters: defaultConvertersWithConvertersFromFeatures,
        })
      : (htmlConverterFeatureProps?.converters as HTMLConverter[]) ||
        defaultConvertersWithConvertersFromFeatures

  // filter converters by nodeTypes. The last converter in the list wins. If there are multiple converters for the same nodeType, the last one will be used and the node types will be removed from
  // previous converters. If previous converters do not have any nodeTypes left, they will be removed from the list.
  // This guarantees that user-added converters which are added after the default ones will always have precedence
  const foundNodeTypes: string[] = []
  const filteredConverters: HTMLConverter[] = []
  for (const converter of finalConverters.reverse()) {
    if (!converter.nodeTypes?.length) {
      continue
    }
    const newConverter: HTMLConverter = {
      converter: converter.converter,
      nodeTypes: [...converter.nodeTypes],
    }
    newConverter.nodeTypes = newConverter.nodeTypes.filter((nodeType) => {
      if (foundNodeTypes.includes(nodeType)) {
        return false
      }
      foundNodeTypes.push(nodeType)
      return true
    })

    if (newConverter.nodeTypes.length) {
      filteredConverters.push(newConverter)
    }
  }

  return filteredConverters
}

/**
 * @deprecated - will be removed in 4.0
 */
export const lexicalHTML: (
  /**
   * A string which matches the lexical field name you want to convert to HTML.
   *
   * This has to be a sibling field of this lexicalHTML field - otherwise, it won't be able to find the lexical field.
   **/
  lexicalFieldName: string,
  args: Args,
) => Field = (lexicalFieldName, args) => {
  const { name = 'lexicalHTML', hidden = true, storeInDB = false } = args
  return {
    name,
    type: 'code',
    admin: {
      editorOptions: {
        language: 'html',
      },
      hidden,
    },
    hooks: {
      afterRead: [
        async ({
          currentDepth,
          depth,
          draft,
          field,
          overrideAccess,
          req,
          showHiddenFields,
          siblingData,
          siblingFields,
        }) => {
          if (!siblingFields) {
            throw new Error(
              `Could not find sibling fields of current lexicalHTML field with name ${field?.name}`,
            )
          }

          const lexicalField: LexicalRichTextField = siblingFields.find(
            (field) => 'name' in field && field.name === lexicalFieldName,
          ) as LexicalRichTextField

          const lexicalFieldData: SerializedEditorState = siblingData[lexicalFieldName]

          if (!lexicalFieldData) {
            return ''
          }

          if (!lexicalField) {
            throw new Error(
              'You cannot use the lexicalHTML field because the referenced lexical field was not found',
            )
          }

          const config = (lexicalField?.editor as LexicalRichTextAdapter)?.editorConfig

          if (!config) {
            throw new Error(
              'The linked lexical field does not have an editorConfig. This is needed for the lexicalHTML field.',
            )
          }

          if (!config?.resolvedFeatureMap?.has('htmlConverter')) {
            throw new Error(
              'You cannot use the lexicalHTML field because the linked lexical field does not have a HTMLConverterFeature',
            )
          }

          const finalConverters = consolidateHTMLConverters({
            editorConfig: config,
          })

          return await convertLexicalToHTML({
            converters: finalConverters,
            currentDepth,
            data: lexicalFieldData,
            depth,
            draft,
            overrideAccess,
            req,
            showHiddenFields,
          })
        },
      ],
      beforeChange: [
        ({ siblingData, value }) => {
          if (storeInDB) {
            return value
          }
          delete siblingData[name]
          return null
        },
      ],
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/Component/index.tsx
Signals: React

```typescript
import type { SerializedEditorState } from 'lexical'

import React from 'react'

import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '../../../../nodeTypes.js'
import type { JSXConverters } from '../converter/types.js'

import { defaultJSXConverters } from '../converter/defaultConverters.js'
import { convertLexicalToJSX } from '../converter/index.js'

export type JSXConvertersFunction<
  T extends { [key: string]: any; type?: string } =
    | DefaultNodeTypes
    | SerializedBlockNode<{ blockName?: null | string }>
    | SerializedInlineBlockNode<{ blockName?: null | string }>,
> = (args: { defaultConverters: JSXConverters<DefaultNodeTypes> }) => JSXConverters<T>

type RichTextProps = {
  /**
   * Override class names for the container.
   */
  className?: string
  /**
   * Custom converters to transform your nodes to JSX. Can be an object or a function that receives the default converters.
   */
  converters?: JSXConverters | JSXConvertersFunction
  /**
   * Serialized editor state to render.
   */
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
}

export const RichText: React.FC<RichTextProps> = ({
  className,
  converters,
  data: editorState,
  disableContainer,
  disableIndent,
  disableTextAlign,
}) => {
  if (!editorState) {
    return null
  }

  let finalConverters: JSXConverters = {}
  if (converters) {
    if (typeof converters === 'function') {
      finalConverters = converters({ defaultConverters: defaultJSXConverters })
    } else {
      finalConverters = converters
    }
  } else {
    finalConverters = defaultJSXConverters
  }

  const content =
    editorState &&
    !Array.isArray(editorState) &&
    typeof editorState === 'object' &&
    'root' in editorState &&
    convertLexicalToJSX({
      converters: finalConverters,
      data: editorState,
      disableIndent,
      disableTextAlign,
    })

  if (disableContainer) {
    return <>{content}</>
  }

  return <div className={className ?? 'payload-richtext'}>{content}</div>
}
```

--------------------------------------------------------------------------------

---[FILE: defaultConverters.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/defaultConverters.ts

```typescript
import type { DefaultNodeTypes } from '../../../../nodeTypes.js'
import type { JSXConverters } from './types.js'

import { BlockquoteJSXConverter } from './converters/blockquote.js'
import { HeadingJSXConverter } from './converters/heading.js'
import { HorizontalRuleJSXConverter } from './converters/horizontalRule.js'
import { LinebreakJSXConverter } from './converters/linebreak.js'
import { LinkJSXConverter } from './converters/link.js'
import { ListJSXConverter } from './converters/list.js'
import { ParagraphJSXConverter } from './converters/paragraph.js'
import { TabJSXConverter } from './converters/tab.js'
import { TableJSXConverter } from './converters/table.js'
import { TextJSXConverter } from './converters/text.js'
import { UploadJSXConverter } from './converters/upload.js'

export const defaultJSXConverters: JSXConverters<DefaultNodeTypes> = {
  ...ParagraphJSXConverter,
  ...TextJSXConverter,
  ...LinebreakJSXConverter,
  ...BlockquoteJSXConverter,
  ...TableJSXConverter,
  ...HeadingJSXConverter,
  ...HorizontalRuleJSXConverter,
  ...ListJSXConverter,
  ...LinkJSXConverter({}),
  ...UploadJSXConverter,
  ...TabJSXConverter,
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/index.tsx
Signals: React

```typescript
/* eslint-disable no-console */
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'

import React from 'react'

import type { SerializedBlockNode, SerializedInlineBlockNode } from '../../../../nodeTypes.js'
import type { JSXConverter, JSXConverters, SerializedLexicalNodeWithParent } from './types.js'

import { hasText } from '../../../../validate/hasText.js'

export type ConvertLexicalToJSXArgs = {
  converters: JSXConverters
  data: SerializedEditorState
  disableIndent?: boolean | string[]
  disableTextAlign?: boolean | string[]
}

export function convertLexicalToJSX({
  converters,
  data,
  disableIndent,
  disableTextAlign,
}: ConvertLexicalToJSXArgs): React.ReactNode {
  if (hasText(data)) {
    return convertLexicalNodesToJSX({
      converters,
      disableIndent,
      disableTextAlign,
      nodes: data?.root?.children,
      parent: data?.root,
    })
  }
  return <></>
}

export function convertLexicalNodesToJSX({
  converters,
  disableIndent,
  disableTextAlign,
  nodes,
  parent,
}: {
  converters: JSXConverters
  disableIndent?: boolean | string[]
  disableTextAlign?: boolean | string[]
  nodes: SerializedLexicalNode[]
  parent: SerializedLexicalNodeWithParent
}): React.ReactNode[] {
  const unknownConverter: JSXConverter<any> = converters.unknown as JSXConverter<any>

  const jsxArray: React.ReactNode[] = nodes.map((node, i) => {
    let converterForNode: JSXConverter<any> | undefined
    if (node.type === 'block') {
      converterForNode = converters?.blocks?.[(node as SerializedBlockNode)?.fields?.blockType]
      if (!converterForNode && !unknownConverter) {
        console.error(
          `Lexical => JSX converter: Blocks converter: found ${(node as SerializedBlockNode)?.fields?.blockType} block, but no converter is provided`,
        )
      }
    } else if (node.type === 'inlineBlock') {
      converterForNode =
        converters?.inlineBlocks?.[(node as SerializedInlineBlockNode)?.fields?.blockType]
      if (!converterForNode && !unknownConverter) {
        console.error(
          `Lexical => JSX converter: Inline Blocks converter: found ${(node as SerializedInlineBlockNode)?.fields?.blockType} inline block, but no converter is provided`,
        )
      }
    } else {
      converterForNode = converters[node.type] as JSXConverter<any>
    }

    try {
      if (!converterForNode && unknownConverter) {
        converterForNode = unknownConverter
      }

      let reactNode: React.ReactNode
      if (converterForNode) {
        const converted =
          typeof converterForNode === 'function'
            ? converterForNode({
                childIndex: i,
                converters,
                node,
                nodesToJSX: (args) => {
                  return convertLexicalNodesToJSX({
                    converters: args.converters ?? converters,
                    disableIndent: args.disableIndent ?? disableIndent,
                    disableTextAlign: args.disableTextAlign ?? disableTextAlign,
                    nodes: args.nodes,
                    parent: args.parent ?? {
                      ...node,
                      parent,
                    },
                  })
                },
                parent,
              })
            : converterForNode
        reactNode = converted
      } else {
        reactNode = <span key={i}>unknown node</span>
      }

      const style: React.CSSProperties = {}

      // Check if disableTextAlign is not true and does not include node type
      if (
        !disableTextAlign &&
        (!Array.isArray(disableTextAlign) || !disableTextAlign?.includes(node.type))
      ) {
        if ('format' in node && node.format) {
          switch (node.format) {
            case 'center':
              style.textAlign = 'center'
              break
            case 'end':
              style.textAlign = 'right'
              break
            case 'justify':
              style.textAlign = 'justify'
              break
            case 'left':
              //style.textAlign = 'left'
              // Do nothing, as left is the default
              break
            case 'right':
              style.textAlign = 'right'
              break
            case 'start':
              style.textAlign = 'left'
              break
          }
        }
      }

      if (
        !disableIndent &&
        (!Array.isArray(disableIndent) || !disableIndent?.includes(node.type))
      ) {
        if ('indent' in node && node.indent && node.type !== 'listitem') {
          // the unit should be px. Do not change it to rem, em, or something else.
          // The quantity should be 40px. Do not change it either.
          // See rationale in
          // https://github.com/payloadcms/payload/issues/13130#issuecomment-3058348085
          style.paddingInlineStart = `${Number(node.indent) * 40}px`
        }
      }

      if (React.isValidElement(reactNode)) {
        // Inject style into reactNode
        if (style.textAlign || style.paddingInlineStart) {
          const newStyle = {
            ...style,
            // @ts-expect-error type better later
            ...(reactNode?.props?.style ?? {}),
            // reactNode style comes after, thus a textAlign specified in the converter has priority over the one we inject here
          }

          return React.cloneElement(reactNode, {
            key: i,
            // @ts-expect-error type better later
            style: newStyle,
          })
        }
        return React.cloneElement(reactNode, {
          key: i,
        })
      }

      return reactNode
    } catch (error) {
      console.error('Error converting lexical node to JSX:', error, 'node:', node)
      return null
    }
  })

  return jsxArray.filter(Boolean)
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/types.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'

import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '../../../../nodeTypes.js'
export type JSXConverter<T extends { [key: string]: any; type?: string } = SerializedLexicalNode> =
  | ((args: {
      childIndex: number
      converters: JSXConverters
      node: T
      nodesToJSX: (args: {
        converters?: JSXConverters
        disableIndent?: boolean | string[]
        disableTextAlign?: boolean | string[]
        nodes: SerializedLexicalNode[]
        parent?: SerializedLexicalNodeWithParent
      }) => React.ReactNode[]
      parent: SerializedLexicalNodeWithParent
    }) => React.ReactNode)
  | React.ReactNode

export type JSXConverters<
  T extends { [key: string]: any; type?: string } =
    | DefaultNodeTypes
    | SerializedBlockNode<{ blockName?: null | string; blockType: string }> // need these to ensure types for blocks and inlineBlocks work if no generics are provided
    | SerializedInlineBlockNode<{ blockName?: null | string; blockType: string }>, // need these to ensure types for blocks and inlineBlocks work if no generics are provided
> = {
  [key: string]:
    | {
        [blockSlug: string]: JSXConverter<any>
      }
    | JSXConverter<any>
    | undefined
} & {
  [nodeType in Exclude<NonNullable<T['type']>, 'block' | 'inlineBlock'>]?: JSXConverter<
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
    >]?: JSXConverter<
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
    >]?: JSXConverter<
      Extract<T, { type: 'inlineBlock' }> extends SerializedInlineBlockNode<infer B>
        ? SerializedInlineBlockNode<Extract<B, { blockType: K }>>
        : SerializedInlineBlockNode
    >
  }
  unknown?: JSXConverter<SerializedLexicalNode>
}
export type SerializedLexicalNodeWithParent = {
  parent?: SerializedLexicalNode
} & SerializedLexicalNode
```

--------------------------------------------------------------------------------

---[FILE: blockquote.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/converters/blockquote.tsx

```typescript
import type { SerializedQuoteNode } from '../../../../../nodeTypes.js'
import type { JSXConverters } from '../types.js'

export const BlockquoteJSXConverter: JSXConverters<SerializedQuoteNode> = {
  quote: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    return <blockquote>{children}</blockquote>
  },
}
```

--------------------------------------------------------------------------------

---[FILE: heading.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/converters/heading.tsx

```typescript
import type { SerializedHeadingNode } from '../../../../../nodeTypes.js'
import type { JSXConverters } from '../types.js'

export const HeadingJSXConverter: JSXConverters<SerializedHeadingNode> = {
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    const NodeTag = node.tag

    return <NodeTag>{children}</NodeTag>
  },
}
```

--------------------------------------------------------------------------------

---[FILE: horizontalRule.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/converters/horizontalRule.tsx

```typescript
import type { SerializedHorizontalRuleNode } from '../../../../../nodeTypes.js'
import type { JSXConverters } from '../types.js'
export const HorizontalRuleJSXConverter: JSXConverters<SerializedHorizontalRuleNode> = {
  horizontalrule: <hr />,
}
```

--------------------------------------------------------------------------------

---[FILE: linebreak.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/converters/linebreak.tsx

```typescript
import type { SerializedLineBreakNode } from '../../../../../nodeTypes.js'
import type { JSXConverters } from '../types.js'

export const LinebreakJSXConverter: JSXConverters<SerializedLineBreakNode> = {
  linebreak: <br />,
}
```

--------------------------------------------------------------------------------

---[FILE: link.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/converters/link.tsx

```typescript
import type { SerializedAutoLinkNode, SerializedLinkNode } from '../../../../../nodeTypes.js'
import type { JSXConverters } from '../types.js'

export const LinkJSXConverter: (args: {
  internalDocToHref?: (args: { linkNode: SerializedLinkNode }) => string
}) => JSXConverters<SerializedAutoLinkNode | SerializedLinkNode> = ({ internalDocToHref }) => ({
  autolink: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    const rel: string | undefined = node.fields.newTab ? 'noopener noreferrer' : undefined
    const target: string | undefined = node.fields.newTab ? '_blank' : undefined

    return (
      <a href={node.fields.url} {...{ rel, target }}>
        {children}
      </a>
    )
  },
  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    const rel: string | undefined = node.fields.newTab ? 'noopener noreferrer' : undefined
    const target: string | undefined = node.fields.newTab ? '_blank' : undefined

    let href: string = node.fields.url ?? ''
    if (node.fields.linkType === 'internal') {
      if (internalDocToHref) {
        href = internalDocToHref({ linkNode: node })
      } else {
        console.error(
          'Lexical => JSX converter: Link converter: found internal link, but internalDocToHref is not provided',
        )
        href = '#' // fallback
      }
    }

    return (
      <a href={href} {...{ rel, target }}>
        {children}
      </a>
    )
  },
})
```

--------------------------------------------------------------------------------

---[FILE: list.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/converters/list.tsx

```typescript
import { v4 as uuidv4 } from 'uuid'

import type { SerializedListItemNode, SerializedListNode } from '../../../../../nodeTypes.js'
import type { JSXConverters } from '../types.js'

export const ListJSXConverter: JSXConverters<SerializedListItemNode | SerializedListNode> = {
  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    const NodeTag = node.tag

    return <NodeTag className={`list-${node?.listType}`}>{children}</NodeTag>
  },
  listitem: ({ node, nodesToJSX, parent }) => {
    const hasSubLists = node.children.some((child) => child.type === 'list')

    const children = nodesToJSX({
      nodes: node.children,
    })

    if ('listType' in parent && parent?.listType === 'check') {
      const uuid = uuidv4()

      return (
        <li
          aria-checked={node.checked ? 'true' : 'false'}
          className={`list-item-checkbox${node.checked ? ' list-item-checkbox-checked' : ' list-item-checkbox-unchecked'}${hasSubLists ? ' nestedListItem' : ''}`}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
          role="checkbox"
          style={{ listStyleType: 'none' }}
          tabIndex={-1}
          value={node?.value}
        >
          {hasSubLists ? (
            children
          ) : (
            <>
              <input checked={node.checked} id={uuid} readOnly={true} type="checkbox" />
              <label htmlFor={uuid}>{children}</label>
              <br />
            </>
          )}
        </li>
      )
    } else {
      return (
        <li
          className={`${hasSubLists ? 'nestedListItem' : ''}`}
          style={hasSubLists ? { listStyleType: 'none' } : undefined}
          value={node?.value}
        >
          {children}
        </li>
      )
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: paragraph.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/converters/paragraph.tsx

```typescript
import type { SerializedParagraphNode } from '../../../../../nodeTypes.js'
import type { JSXConverters } from '../types.js'

export const ParagraphJSXConverter: JSXConverters<SerializedParagraphNode> = {
  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    if (!children?.length) {
      return (
        <p>
          <br />
        </p>
      )
    }

    return <p>{children}</p>
  },
}
```

--------------------------------------------------------------------------------

---[FILE: tab.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/converters/tab.tsx

```typescript
import type { SerializedTabNode } from '../../../../../nodeTypes.js'
import type { JSXConverters } from '../types.js'

export const TabJSXConverter: JSXConverters<SerializedTabNode> = {
  tab: '\t',
}
```

--------------------------------------------------------------------------------

---[FILE: table.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/converters/table.tsx

```typescript
import type {
  SerializedTableCellNode,
  SerializedTableNode,
  SerializedTableRowNode,
} from '../../../../../nodeTypes.js'
import type { JSXConverters } from '../types.js'

export const TableJSXConverter: JSXConverters<
  SerializedTableCellNode | SerializedTableNode | SerializedTableRowNode
> = {
  table: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })
    return (
      <div className="lexical-table-container">
        <table className="lexical-table" style={{ borderCollapse: 'collapse' }}>
          <tbody>{children}</tbody>
        </table>
      </div>
    )
  },
  tablecell: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    const TagName = node.headerState > 0 ? 'th' : 'td' // Use capital letter to denote a component
    const headerStateClass = `lexical-table-cell-header-${node.headerState}`
    const style = {
      backgroundColor: node.backgroundColor || undefined, // Use undefined to avoid setting the style property if not needed
      border: '1px solid #ccc',
      padding: '8px',
    }

    // Note: JSX does not support setting attributes directly as strings, so you must convert the colSpan and rowSpan to numbers
    const colSpan = node.colSpan && node.colSpan > 1 ? node.colSpan : undefined
    const rowSpan = node.rowSpan && node.rowSpan > 1 ? node.rowSpan : undefined

    return (
      <TagName
        className={`lexical-table-cell ${headerStateClass}`}
        colSpan={colSpan} // colSpan and rowSpan will only be added if they are not null
        rowSpan={rowSpan}
        style={style}
      >
        {children}
      </TagName>
    )
  },
  tablerow: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })
    return <tr className="lexical-table-row">{children}</tr>
  },
}
```

--------------------------------------------------------------------------------

---[FILE: text.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/converters/text.tsx
Signals: React

```typescript
import React from 'react'

import type { SerializedTextNode } from '../../../../../nodeTypes.js'
import type { JSXConverters } from '../types.js'

import { NodeFormat } from '../../../../../lexical/utils/nodeFormat.js'

export const TextJSXConverter: JSXConverters<SerializedTextNode> = {
  text: ({ node }) => {
    let text: React.ReactNode = node.text

    if (node.format & NodeFormat.IS_BOLD) {
      text = <strong>{text}</strong>
    }
    if (node.format & NodeFormat.IS_ITALIC) {
      text = <em>{text}</em>
    }
    if (node.format & NodeFormat.IS_STRIKETHROUGH) {
      text = <span style={{ textDecoration: 'line-through' }}>{text}</span>
    }
    if (node.format & NodeFormat.IS_UNDERLINE) {
      text = <span style={{ textDecoration: 'underline' }}>{text}</span>
    }
    if (node.format & NodeFormat.IS_CODE) {
      text = <code>{text}</code>
    }
    if (node.format & NodeFormat.IS_SUBSCRIPT) {
      text = <sub>{text}</sub>
    }
    if (node.format & NodeFormat.IS_SUPERSCRIPT) {
      text = <sup>{text}</sup>
    }

    return text
  },
}
```

--------------------------------------------------------------------------------

````
