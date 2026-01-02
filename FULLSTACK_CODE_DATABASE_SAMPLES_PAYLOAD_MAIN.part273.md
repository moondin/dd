---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 273
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 273 of 695)

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

---[FILE: list.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/converters/list.ts

```typescript
import { v4 as uuidv4 } from 'uuid'

import type { SerializedListItemNode, SerializedListNode } from '../../../../../nodeTypes.js'
import type { HTMLConvertersAsync } from '../types.js'

export const ListHTMLConverterAsync: HTMLConvertersAsync<
  SerializedListItemNode | SerializedListNode
> = {
  list: async ({ node, nodesToHTML, providedStyleTag }) => {
    const children = (
      await nodesToHTML({
        nodes: node.children,
      })
    ).join('')

    return `<${node.tag}${providedStyleTag} class="list-${node.listType}">${children}</${node.tag}>`
  },
  listitem: async ({ node, nodesToHTML, parent, providedCSSString }) => {
    const hasSubLists = node.children.some((child) => child.type === 'list')

    const children = (
      await nodesToHTML({
        nodes: node.children,
      })
    ).join('')

    if ('listType' in parent && parent?.listType === 'check') {
      const uuid = uuidv4()
      return `<li
          aria-checked="${node.checked ? 'true' : 'false'}"
          class="list-item-checkbox${node.checked ? ' list-item-checkbox-checked' : ' list-item-checkbox-unchecked'}${hasSubLists ? ' nestedListItem' : ''}"
          role="checkbox"
          style="list-style-type: none;${providedCSSString}"
          tabIndex="-1"
          value="${node.value}"
        >
          ${
            hasSubLists
              ? children
              : `<input${node.checked ? ' checked' : ''} id="${uuid}" readOnly="true" type="checkbox" />
            <label htmlFor="${uuid}">${children}</label>
            <br />`
          }
        </li>`
    } else {
      return `<li
          class="${hasSubLists ? 'nestedListItem' : ''}"
          style="${hasSubLists ? `list-style-type: none;${providedCSSString}` : providedCSSString}"
          value="${node.value}"
        >${children}</li>`
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: paragraph.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/converters/paragraph.ts

```typescript
import type { SerializedParagraphNode } from '../../../../../nodeTypes.js'
import type { HTMLConvertersAsync } from '../types.js'

export const ParagraphHTMLConverterAsync: HTMLConvertersAsync<SerializedParagraphNode> = {
  paragraph: async ({ node, nodesToHTML, providedStyleTag }) => {
    const children = await nodesToHTML({
      nodes: node.children,
    })

    if (!children?.length) {
      return `<p${providedStyleTag}><br /></p>`
    }

    return `<p${providedStyleTag}>${children.join('')}</p>`
  },
}
```

--------------------------------------------------------------------------------

---[FILE: tab.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/converters/tab.ts

```typescript
import type { SerializedTabNode } from '../../../../../nodeTypes.js'
import type { HTMLConvertersAsync } from '../types.js'

export const TabHTMLConverterAsync: HTMLConvertersAsync<SerializedTabNode> = {
  tab: '\t',
}
```

--------------------------------------------------------------------------------

---[FILE: table.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/converters/table.ts

```typescript
import type {
  SerializedTableCellNode,
  SerializedTableNode,
  SerializedTableRowNode,
} from '../../../../../nodeTypes.js'
import type { HTMLConvertersAsync } from '../types.js'

export const TableHTMLConverterAsync: HTMLConvertersAsync<
  SerializedTableCellNode | SerializedTableNode | SerializedTableRowNode
> = {
  table: async ({ node, nodesToHTML, providedStyleTag }) => {
    const children = (
      await nodesToHTML({
        nodes: node.children,
      })
    ).join('')

    return `<div${providedStyleTag} class="lexical-table-container">
        <table class="lexical-table" style="border-collapse: collapse;">
          <tbody>${children}</tbody>
        </table>
      </div>`
  },

  tablecell: async ({ node, nodesToHTML, providedCSSString }) => {
    const children = (
      await nodesToHTML({
        nodes: node.children,
      })
    ).join('')

    const TagName = node.headerState > 0 ? 'th' : 'td'
    const headerStateClass = `lexical-table-cell-header-${node.headerState}`

    let style = 'border: 1px solid #ccc; padding: 8px;' + providedCSSString
    if (node.backgroundColor) {
      style += ` background-color: ${node.backgroundColor};`
    }

    const colSpanAttr = node.colSpan && node.colSpan > 1 ? ` colspan="${node.colSpan}"` : ''
    const rowSpanAttr = node.rowSpan && node.rowSpan > 1 ? ` rowspan="${node.rowSpan}"` : ''

    return `<${TagName}
        class="lexical-table-cell ${headerStateClass}"
        ${colSpanAttr}
        ${rowSpanAttr}
        style="${style}"
      >
        ${children}
      </${TagName}>
    `
  },

  tablerow: async ({ node, nodesToHTML, providedStyleTag }) => {
    const children = (
      await nodesToHTML({
        nodes: node.children,
      })
    ).join('')

    return `<tr${providedStyleTag} class="lexical-table-row">
        ${children}
      </tr>`
  },
}
```

--------------------------------------------------------------------------------

---[FILE: text.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/converters/text.ts

```typescript
import type { SerializedTextNode } from '../../../../../nodeTypes.js'
import type { HTMLConvertersAsync } from '../types.js'

import { NodeFormat } from '../../../../../lexical/utils/nodeFormat.js'

export const TextHTMLConverterAsync: HTMLConvertersAsync<SerializedTextNode> = {
  text: ({ node }) => {
    let text = node.text

    if (node.format & NodeFormat.IS_BOLD) {
      text = `<strong>${text}</strong>`
    }
    if (node.format & NodeFormat.IS_ITALIC) {
      text = `<em>${text}</em>`
    }
    if (node.format & NodeFormat.IS_STRIKETHROUGH) {
      text = `<span style="text-decoration: line-through;">${text}</span>`
    }
    if (node.format & NodeFormat.IS_UNDERLINE) {
      text = `<span style="text-decoration: underline;">${text}</span>`
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
}
```

--------------------------------------------------------------------------------

---[FILE: upload.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/converters/upload.ts

```typescript
import type { FileData, FileSizeImproved, TypeWithID } from 'payload'

import type { SerializedUploadNode } from '../../../../../nodeTypes.js'
import type { UploadDataImproved } from '../../../../upload/server/nodes/UploadNode.js'
import type { HTMLConvertersAsync } from '../types.js'

export const UploadHTMLConverterAsync: HTMLConvertersAsync<SerializedUploadNode> = {
  upload: async ({ node, populate, providedStyleTag }) => {
    const uploadNode = node as UploadDataImproved

    let uploadDoc: (FileData & TypeWithID) | undefined = undefined

    // If there's no valid upload data, populate return an empty string
    if (typeof uploadNode.value !== 'object') {
      if (!populate) {
        return ''
      }
      uploadDoc = await populate<FileData & TypeWithID>({
        id: uploadNode.value,
        collectionSlug: uploadNode.relationTo,
      })
    } else {
      uploadDoc = uploadNode.value as unknown as FileData & TypeWithID
    }

    if (!uploadDoc) {
      return ''
    }

    const url = uploadDoc.url

    // 1) If upload is NOT an image, return a link
    if (!uploadDoc.mimeType.startsWith('image')) {
      return `<a${providedStyleTag} href="${url}" rel="noopener noreferrer">${uploadDoc.filename}</a$>`
    }

    // 2) If image has no different sizes, return a simple <img />
    if (!uploadDoc.sizes || !Object.keys(uploadDoc.sizes).length) {
      return `
        <img${providedStyleTag}
          alt="${uploadDoc.filename}"
          height="${uploadDoc.height}"
          src="${url}"
          width="${uploadDoc.width}"
        />
      `
    }

    // 3) If image has different sizes, build a <picture> element with <source> tags
    let pictureHTML = ''

    for (const size in uploadDoc.sizes) {
      const imageSize = uploadDoc.sizes[size] as FileSizeImproved

      if (
        !imageSize ||
        !imageSize.width ||
        !imageSize.height ||
        !imageSize.mimeType ||
        !imageSize.filesize ||
        !imageSize.filename ||
        !imageSize.url
      ) {
        continue
      }

      pictureHTML += `
        <source
          media="(max-width: ${imageSize.width}px)"
          srcset="${imageSize.url}"
          type="${imageSize.mimeType}"
        />
      `
    }

    pictureHTML += `
      <img
        alt="${uploadDoc.filename}"
        height="${uploadDoc.height}"
        src="${url}"
        width="${uploadDoc.width}"
      />
    `

    return `<picture${providedStyleTag}>${pictureHTML}</picture>`
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/async/field/index.ts

```typescript
import type { SerializedEditorState } from 'lexical'
import type { Field } from 'payload'

import type { HTMLConvertersAsync, HTMLConvertersFunctionAsync } from '../types.js'

import { getPayloadPopulateFn } from '../../../utilities/payloadPopulateFn.js'
import { convertLexicalToHTMLAsync } from '../index.js'

type Args = {
  converters?: HTMLConvertersAsync | HTMLConvertersFunctionAsync
  /**
   * Whether the lexicalHTML field should be hidden in the admin panel
   *
   * @default true
   */
  hidden?: boolean
  htmlFieldName: string
  /**
   * A string which matches the lexical field name you want to convert to HTML.
   *
   * This has to be a sibling field of this lexicalHTML field - otherwise, it won't be able to find the lexical field.
   **/
  lexicalFieldName: string
  /**
   * Whether the HTML should be stored in the database
   *
   * @default false
   */
  storeInDB?: boolean
}

/**
 *
 * Field that converts a sibling lexical field to HTML
 *
 * @todo will be renamed to lexicalHTML in 4.0, replacing the deprecated `lexicalHTML` converter
 */
export const lexicalHTMLField: (args: Args) => Field = (args) => {
  const { converters, hidden = true, htmlFieldName, lexicalFieldName, storeInDB = false } = args
  const field: Field = {
    name: htmlFieldName,
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
          overrideAccess,
          req,
          showHiddenFields,
          siblingData,
        }) => {
          const lexicalFieldData: SerializedEditorState = siblingData[lexicalFieldName]

          if (!lexicalFieldData) {
            return ''
          }

          const htmlPopulateFn = await getPayloadPopulateFn({
            currentDepth: currentDepth ?? 0,
            depth: depth ?? req.payload.config.defaultDepth,
            draft: draft ?? false,
            overrideAccess: overrideAccess ?? false,
            req,
            showHiddenFields: showHiddenFields ?? false,
          })

          return await convertLexicalToHTMLAsync({
            converters,
            data: lexicalFieldData,
            populate: htmlPopulateFn,
          })
        },
      ],
    },
  }

  if (!storeInDB) {
    field.hooks = field.hooks ?? {}
    field.hooks.beforeChange = [
      ({ siblingData }) => {
        delete siblingData[htmlFieldName]
        return null
      },
    ]
  }

  return field
}
```

--------------------------------------------------------------------------------

---[FILE: findConverterForNode.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/shared/findConverterForNode.ts

```typescript
/* eslint-disable no-console */
import type { SerializedLexicalNode } from 'lexical'

import type { SerializedBlockNode, SerializedInlineBlockNode } from '../../../../nodeTypes.js'
import type { HTMLConverterAsync, HTMLConvertersAsync } from '../async/types.js'
import type { HTMLConverter, HTMLConverters } from '../sync/types.js'
import type { ProvidedCSS } from './types.js'

export function findConverterForNode<
  TConverters extends HTMLConverters | HTMLConvertersAsync,
  TConverter extends HTMLConverter | HTMLConverterAsync,
>({
  converters,
  disableIndent,
  disableTextAlign,
  node,
  unknownConverter,
}: {
  converters: TConverters
  disableIndent?: boolean | string[]
  disableTextAlign?: boolean | string[]
  node: SerializedLexicalNode
  unknownConverter: TConverter
}): {
  converterForNode: TConverter | undefined
  providedCSSString: string
  providedStyleTag: string
} {
  let converterForNode: TConverter | undefined
  if (node.type === 'block') {
    converterForNode = converters?.blocks?.[
      (node as SerializedBlockNode)?.fields?.blockType
    ] as TConverter
    if (!converterForNode && !unknownConverter) {
      console.error(
        `Lexical => HTML converter: Blocks converter: found ${(node as SerializedBlockNode)?.fields?.blockType} block, but no converter is provided`,
      )
    }
  } else if (node.type === 'inlineBlock') {
    converterForNode = converters?.inlineBlocks?.[
      (node as SerializedInlineBlockNode)?.fields?.blockType
    ] as TConverter
    if (!converterForNode && !unknownConverter) {
      console.error(
        `Lexical => HTML converter: Inline Blocks converter: found ${(node as SerializedInlineBlockNode)?.fields?.blockType} inline block, but no converter is provided`,
      )
    }
  } else {
    converterForNode = converters[node.type] as TConverter
  }

  const style: ProvidedCSS = {}

  // Check if disableTextAlign is not true and does not include node type
  if (
    !disableTextAlign &&
    (!Array.isArray(disableTextAlign) || !disableTextAlign?.includes(node.type))
  ) {
    if ('format' in node && node.format) {
      switch (node.format) {
        case 'center':
          style['text-align'] = 'center'
          break
        case 'end':
          style['text-align'] = 'right'
          break
        case 'justify':
          style['text-align'] = 'justify'
          break
        case 'left':
          //style['text-align'] = 'left'
          // Do nothing, as left is the default
          break
        case 'right':
          style['text-align'] = 'right'
          break
        case 'start':
          style['text-align'] = 'left'
          break
      }
    }
  }

  if (!disableIndent && (!Array.isArray(disableIndent) || !disableIndent?.includes(node.type))) {
    if ('indent' in node && node.indent && node.type !== 'listitem') {
      // the unit should be px. Do not change it to rem, em, or something else.
      // The quantity should be 40px. Do not change it either.
      // See rationale in
      // https://github.com/payloadcms/payload/issues/13130#issuecomment-3058348085
      style['padding-inline-start'] = `${Number(node.indent) * 40}px`
    }
  }

  let providedCSSString: string = ''
  for (const key of Object.keys(style)) {
    // @ts-expect-error we're iterating over the keys of the object
    providedCSSString += `${key}: ${style[key]};`
  }
  const providedStyleTag = providedCSSString?.length ? ` style="${providedCSSString}"` : ''

  return {
    converterForNode: converterForNode ?? unknownConverter,
    providedCSSString,
    providedStyleTag,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/shared/types.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'

export type ProvidedCSS = {
  'padding-inline-start'?: string
  'text-align'?: string
}

export type SerializedLexicalNodeWithParent = {
  parent?: SerializedLexicalNode
} & SerializedLexicalNode
```

--------------------------------------------------------------------------------

---[FILE: defaultConverters.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/defaultConverters.ts

```typescript
import type { DefaultNodeTypes } from '../../../../nodeTypes.js'
import type { HTMLConverters } from './types.js'

import { BlockquoteHTMLConverter } from './converters/blockquote.js'
import { HeadingHTMLConverter } from './converters/heading.js'
import { HorizontalRuleHTMLConverter } from './converters/horizontalRule.js'
import { LinebreakHTMLConverter } from './converters/linebreak.js'
import { LinkHTMLConverter } from './converters/link.js'
import { ListHTMLConverter } from './converters/list.js'
import { ParagraphHTMLConverter } from './converters/paragraph.js'
import { TabHTMLConverter } from './converters/tab.js'
import { TableHTMLConverter } from './converters/table.js'
import { TextHTMLConverter } from './converters/text.js'
import { UploadHTMLConverter } from './converters/upload.js'

export const defaultHTMLConverters: HTMLConverters<DefaultNodeTypes> = {
  ...ParagraphHTMLConverter,
  ...TextHTMLConverter,
  ...LinebreakHTMLConverter,
  ...BlockquoteHTMLConverter,
  ...TableHTMLConverter,
  ...HeadingHTMLConverter,
  ...HorizontalRuleHTMLConverter,
  ...ListHTMLConverter,
  ...LinkHTMLConverter({}),
  ...UploadHTMLConverter,
  ...TabHTMLConverter,
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/index.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'

import type { SerializedLexicalNodeWithParent } from '../shared/types.js'
import type { HTMLConverter, HTMLConverters, HTMLConvertersFunction } from './types.js'

import { hasText } from '../../../../validate/hasText.js'
import { findConverterForNode } from '../shared/findConverterForNode.js'
import { defaultHTMLConverters } from './defaultConverters.js'

export type ConvertLexicalToHTMLArgs = {
  /**
   * Override class names for the container.
   */
  className?: string
  converters?: HTMLConverters | HTMLConvertersFunction
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

export function convertLexicalToHTML({
  className,
  converters,
  data,
  disableContainer,
  disableIndent,
  disableTextAlign,
}: ConvertLexicalToHTMLArgs): string {
  if (hasText(data)) {
    let finalConverters: HTMLConverters = {}
    if (converters) {
      if (typeof converters === 'function') {
        finalConverters = converters({ defaultConverters: defaultHTMLConverters })
      } else {
        finalConverters = converters
      }
    } else {
      finalConverters = defaultHTMLConverters
    }

    const html = convertLexicalNodesToHTML({
      converters: finalConverters,
      disableIndent,
      disableTextAlign,
      nodes: data?.root?.children,
      parent: data?.root,
    }).join('')

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

export function convertLexicalNodesToHTML({
  converters,
  disableIndent,
  disableTextAlign,
  nodes,
  parent,
}: {
  converters: HTMLConverters
  disableIndent?: boolean | string[]
  disableTextAlign?: boolean | string[]
  nodes: SerializedLexicalNode[]
  parent: SerializedLexicalNodeWithParent
}): string[] {
  const unknownConverter: HTMLConverter<any> = converters.unknown as HTMLConverter<any>

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
            ? converterForNode({
                childIndex: i,
                converters,
                node,
                nodesToHTML: (args) => {
                  return convertLexicalNodesToHTML({
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
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/types.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'

import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '../../../../nodeTypes.js'
import type { SerializedLexicalNodeWithParent } from '../shared/types.js'

export type HTMLConverter<T extends { [key: string]: any; type?: string } = SerializedLexicalNode> =

    | ((args: {
        childIndex: number
        converters: HTMLConverters
        node: T
        nodesToHTML: (args: {
          converters?: HTMLConverters
          disableIndent?: boolean | string[]
          disableTextAlign?: boolean | string[]
          nodes: SerializedLexicalNode[]
          parent?: SerializedLexicalNodeWithParent
        }) => string[]
        parent: SerializedLexicalNodeWithParent
        providedCSSString: string
        providedStyleTag: string
      }) => string)
    | string

export type HTMLConverters<
  T extends { [key: string]: any; type?: string } =
    | DefaultNodeTypes
    | SerializedBlockNode<{ blockName?: null | string; blockType: string }> // need these to ensure types for blocks and inlineBlocks work if no generics are provided
    | SerializedInlineBlockNode<{ blockName?: null | string; blockType: string }>, // need these to ensure types for blocks and inlineBlocks work if no generics are provided
> = {
  [key: string]:
    | {
        [blockSlug: string]: HTMLConverter<any>
      }
    | HTMLConverter<any>
    | undefined
} & {
  [nodeType in Exclude<NonNullable<T['type']>, 'block' | 'inlineBlock'>]?: HTMLConverter<
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
    >]?: HTMLConverter<
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
    >]?: HTMLConverter<
      Extract<T, { type: 'inlineBlock' }> extends SerializedInlineBlockNode<infer B>
        ? SerializedInlineBlockNode<Extract<B, { blockType: K }>>
        : SerializedInlineBlockNode
    >
  }
  unknown?: HTMLConverter<SerializedLexicalNode>
}

export type HTMLConvertersFunction<
  T extends { [key: string]: any; type?: string } =
    | DefaultNodeTypes
    | SerializedBlockNode<{ blockName?: null | string }>
    | SerializedInlineBlockNode<{ blockName?: null | string; blockType: string }>,
> = (args: { defaultConverters: HTMLConverters<DefaultNodeTypes> }) => HTMLConverters<T>
```

--------------------------------------------------------------------------------

---[FILE: blockquote.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/converters/blockquote.ts

```typescript
import type { SerializedQuoteNode } from '../../../../../nodeTypes.js'
import type { HTMLConverters } from '../types.js'

export const BlockquoteHTMLConverter: HTMLConverters<SerializedQuoteNode> = {
  quote: ({ node, nodesToHTML, providedStyleTag }) => {
    const children = nodesToHTML({
      nodes: node.children,
    }).join('')

    return `<blockquote${providedStyleTag}>${children}</blockquote>`
  },
}
```

--------------------------------------------------------------------------------

---[FILE: heading.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/converters/heading.ts

```typescript
import type { SerializedHeadingNode } from '../../../../../nodeTypes.js'
import type { HTMLConverters } from '../types.js'

export const HeadingHTMLConverter: HTMLConverters<SerializedHeadingNode> = {
  heading: ({ node, nodesToHTML, providedStyleTag }) => {
    const children = nodesToHTML({
      nodes: node.children,
    }).join('')

    return `<${node.tag}${providedStyleTag}>${children}</${node.tag}>`
  },
}
```

--------------------------------------------------------------------------------

---[FILE: horizontalRule.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/converters/horizontalRule.ts

```typescript
import type { SerializedHorizontalRuleNode } from '../../../../../nodeTypes.js'
import type { HTMLConverters } from '../types.js'
export const HorizontalRuleHTMLConverter: HTMLConverters<SerializedHorizontalRuleNode> = {
  horizontalrule: '<hr />',
}
```

--------------------------------------------------------------------------------

---[FILE: linebreak.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/converters/linebreak.ts

```typescript
import type { SerializedLineBreakNode } from '../../../../../nodeTypes.js'
import type { HTMLConverters } from '../types.js'

export const LinebreakHTMLConverter: HTMLConverters<SerializedLineBreakNode> = {
  linebreak: '<br />',
}
```

--------------------------------------------------------------------------------

---[FILE: link.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/converters/link.ts

```typescript
import type { SerializedAutoLinkNode, SerializedLinkNode } from '../../../../../nodeTypes.js'
import type { HTMLConverters } from '../types.js'

export const LinkHTMLConverter: (args: {
  internalDocToHref?: (args: { linkNode: SerializedLinkNode }) => string
}) => HTMLConverters<SerializedAutoLinkNode | SerializedLinkNode> = ({ internalDocToHref }) => ({
  autolink: ({ node, nodesToHTML, providedStyleTag }) => {
    const children = nodesToHTML({
      nodes: node.children,
    }).join('')

    return `<a${providedStyleTag} href="${node.fields.url}"${node.fields.newTab ? ' rel="noopener noreferrer" target="_blank"' : ''}>${children}</a>`
  },
  link: ({ node, nodesToHTML, providedStyleTag }) => {
    const children = nodesToHTML({
      nodes: node.children,
    }).join('')

    let href: string = node.fields.url ?? ''
    if (node.fields.linkType === 'internal') {
      if (internalDocToHref) {
        href = internalDocToHref({ linkNode: node })
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

---[FILE: list.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/converters/list.ts

```typescript
import { v4 as uuidv4 } from 'uuid'

import type { SerializedListItemNode, SerializedListNode } from '../../../../../nodeTypes.js'
import type { HTMLConverters } from '../types.js'

export const ListHTMLConverter: HTMLConverters<SerializedListItemNode | SerializedListNode> = {
  list: ({ node, nodesToHTML, providedStyleTag }) => {
    const children = nodesToHTML({
      nodes: node.children,
    }).join('')

    return `<${node.tag}${providedStyleTag} class="list-${node.listType}">${children}</${node.tag}>`
  },
  listitem: ({ node, nodesToHTML, parent, providedCSSString }) => {
    const hasSubLists = node.children.some((child) => child.type === 'list')

    const children = nodesToHTML({
      nodes: node.children,
    }).join('')

    if ('listType' in parent && parent?.listType === 'check') {
      const uuid = uuidv4()
      return `<li
          aria-checked="${node.checked ? 'true' : 'false'}"
          class="list-item-checkbox${node.checked ? ' list-item-checkbox-checked' : ' list-item-checkbox-unchecked'}${hasSubLists ? ' nestedListItem' : ''}"
          role="checkbox"
          style="list-style-type: none;${providedCSSString}"
          tabIndex="-1"
          value="${node.value}"
        >
          ${
            hasSubLists
              ? children
              : `<input${node.checked ? ' checked' : ''} id="${uuid}" readOnly="true" type="checkbox" />
            <label htmlFor="${uuid}">${children}</label>
            <br />`
          }
        </li>`
    } else {
      return `<li
          class="${hasSubLists ? 'nestedListItem' : ''}"
          style="${hasSubLists ? `list-style-type: none;${providedCSSString}` : providedCSSString}"
          value="${node.value}"
        >${children}</li>`
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: paragraph.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/converters/paragraph.ts

```typescript
import type { SerializedParagraphNode } from '../../../../../nodeTypes.js'
import type { HTMLConverters } from '../types.js'

export const ParagraphHTMLConverter: HTMLConverters<SerializedParagraphNode> = {
  paragraph: ({ node, nodesToHTML, providedStyleTag }) => {
    const children = nodesToHTML({
      nodes: node.children,
    })

    if (!children?.length) {
      return `<p${providedStyleTag}><br /></p>`
    }

    return `<p${providedStyleTag}>${children.join('')}</p>`
  },
}
```

--------------------------------------------------------------------------------

---[FILE: tab.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/converters/tab.ts

```typescript
import type { SerializedTabNode } from '../../../../../nodeTypes.js'
import type { HTMLConverters } from '../types.js'

export const TabHTMLConverter: HTMLConverters<SerializedTabNode> = {
  tab: '\t',
}
```

--------------------------------------------------------------------------------

---[FILE: table.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/converters/table.ts

```typescript
import type {
  SerializedTableCellNode,
  SerializedTableNode,
  SerializedTableRowNode,
} from '../../../../../nodeTypes.js'
import type { HTMLConverters } from '../types.js'

export const TableHTMLConverter: HTMLConverters<
  SerializedTableCellNode | SerializedTableNode | SerializedTableRowNode
> = {
  table: ({ node, nodesToHTML, providedStyleTag }) => {
    const children = nodesToHTML({
      nodes: node.children,
    }).join('')

    return `<div${providedStyleTag} class="lexical-table-container">
        <table class="lexical-table" style="border-collapse: collapse;">
          <tbody>${children}</tbody>
        </table>
      </div>`
  },

  tablecell: ({ node, nodesToHTML, providedCSSString }) => {
    const children = nodesToHTML({
      nodes: node.children,
    }).join('')

    const TagName = node.headerState > 0 ? 'th' : 'td'
    const headerStateClass = `lexical-table-cell-header-${node.headerState}`

    let style = 'border: 1px solid #ccc; padding: 8px;' + providedCSSString
    if (node.backgroundColor) {
      style += ` background-color: ${node.backgroundColor};`
    }

    const colSpanAttr = node.colSpan && node.colSpan > 1 ? ` colspan="${node.colSpan}"` : ''
    const rowSpanAttr = node.rowSpan && node.rowSpan > 1 ? ` rowspan="${node.rowSpan}"` : ''

    return `<${TagName}
        class="lexical-table-cell ${headerStateClass}"
        ${colSpanAttr}
        ${rowSpanAttr}
        style="${style}"
      >
        ${children}
      </${TagName}>
    `
  },

  tablerow: ({ node, nodesToHTML, providedStyleTag }) => {
    const children = nodesToHTML({
      nodes: node.children,
    }).join('')

    return `<tr${providedStyleTag} class="lexical-table-row">
        ${children}
      </tr>`
  },
}
```

--------------------------------------------------------------------------------

---[FILE: text.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/converters/text.ts

```typescript
import type { SerializedTextNode } from '../../../../../nodeTypes.js'
import type { HTMLConverters } from '../types.js'

import { NodeFormat } from '../../../../../lexical/utils/nodeFormat.js'

export const TextHTMLConverter: HTMLConverters<SerializedTextNode> = {
  text: ({ node }) => {
    let text = node.text

    if (node.format & NodeFormat.IS_BOLD) {
      text = `<strong>${text}</strong>`
    }
    if (node.format & NodeFormat.IS_ITALIC) {
      text = `<em>${text}</em>`
    }
    if (node.format & NodeFormat.IS_STRIKETHROUGH) {
      text = `<span style="text-decoration: line-through;">${text}</span>`
    }
    if (node.format & NodeFormat.IS_UNDERLINE) {
      text = `<span style="text-decoration: underline;">${text}</span>`
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
}
```

--------------------------------------------------------------------------------

---[FILE: upload.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml/sync/converters/upload.ts

```typescript
import type { FileData, FileSizeImproved, TypeWithID } from 'payload'

import type { SerializedUploadNode } from '../../../../../nodeTypes.js'
import type { UploadDataImproved } from '../../../../upload/server/nodes/UploadNode.js'
import type { HTMLConverters } from '../types.js'

export const UploadHTMLConverter: HTMLConverters<SerializedUploadNode> = {
  upload: ({ node, providedStyleTag }) => {
    const uploadNode = node as UploadDataImproved

    let uploadDoc: (FileData & TypeWithID) | undefined = undefined

    // If there's no valid upload data, populate return an empty string
    if (typeof uploadNode.value !== 'object') {
      return ''
    } else {
      uploadDoc = uploadNode.value as unknown as FileData & TypeWithID
    }

    if (!uploadDoc) {
      return ''
    }

    const url = uploadDoc.url

    // 1) If upload is NOT an image, return a link
    if (!uploadDoc.mimeType.startsWith('image')) {
      return `<a${providedStyleTag} href="${url}" rel="noopener noreferrer">${uploadDoc.filename}</a$>`
    }

    // 2) If image has no different sizes, return a simple <img />
    if (!uploadDoc.sizes || !Object.keys(uploadDoc.sizes).length) {
      return `
        <img${providedStyleTag}
          alt="${uploadDoc.filename}"
          height="${uploadDoc.height}"
          src="${url}"
          width="${uploadDoc.width}"
        />
      `
    }

    // 3) If image has different sizes, build a <picture> element with <source> tags
    let pictureHTML = ''

    for (const size in uploadDoc.sizes) {
      const imageSize = uploadDoc.sizes[size] as FileSizeImproved

      if (
        !imageSize ||
        !imageSize.width ||
        !imageSize.height ||
        !imageSize.mimeType ||
        !imageSize.filesize ||
        !imageSize.filename ||
        !imageSize.url
      ) {
        continue
      }

      pictureHTML += `
        <source
          media="(max-width: ${imageSize.width}px)"
          srcset="${imageSize.url}"
          type="${imageSize.mimeType}"
        />
      `
    }

    pictureHTML += `
      <img
        alt="${uploadDoc.filename}"
        height="${uploadDoc.height}"
        src="${url}"
        width="${uploadDoc.width}"
      />
    `

    return `<picture${providedStyleTag}>${pictureHTML}</picture>`
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml_deprecated/index.ts

```typescript
import type { HTMLConverter } from './converter/types.js'

import { createServerFeature } from '../../../utilities/createServerFeature.js'

export type HTMLConverterFeatureProps = {
  converters?:
    | (({ defaultConverters }: { defaultConverters: HTMLConverter<any>[] }) => HTMLConverter<any>[])
    | HTMLConverter<any>[]
}

// This is just used to save the props on the richText field
/**
 * @deprecated - will be removed in 4.0. Please refer to https://payloadcms.com/docs/rich-text/converting-html
 * to see all the ways to convert lexical to HTML.
 */
export const HTMLConverterFeature = createServerFeature<HTMLConverterFeatureProps>({
  feature: {},
  key: 'htmlConverter',
})
```

--------------------------------------------------------------------------------

---[FILE: defaultConverters.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToHtml_deprecated/converter/defaultConverters.ts

```typescript
import type { HTMLConverter } from './types.js'

import { LinebreakHTMLConverter } from './converters/linebreak.js'
import { ParagraphHTMLConverter } from './converters/paragraph.js'
import { TabHTMLConverter } from './converters/tab.js'
import { TextHTMLConverter } from './converters/text.js'

/**
 * @deprecated - will be removed in 4.0
 */
export const defaultHTMLConverters: HTMLConverter<any>[] = [
  ParagraphHTMLConverter,
  TextHTMLConverter,
  LinebreakHTMLConverter,
  TabHTMLConverter,
]
```

--------------------------------------------------------------------------------

````
