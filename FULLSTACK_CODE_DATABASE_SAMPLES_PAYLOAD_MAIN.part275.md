---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 275
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 275 of 695)

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

---[FILE: upload.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToJSX/converter/converters/upload.tsx

```typescript
import type { FileData, FileSizeImproved, TypeWithID } from 'payload'

import type { SerializedUploadNode } from '../../../../../nodeTypes.js'
import type { UploadDataImproved } from '../../../../upload/server/nodes/UploadNode.js'
import type { JSXConverters } from '../types.js'

export const UploadJSXConverter: JSXConverters<SerializedUploadNode> = {
  upload: ({ node }) => {
    // TO-DO (v4): SerializedUploadNode should use UploadData_P4
    const uploadNode = node as UploadDataImproved
    if (typeof uploadNode.value !== 'object') {
      return null
    }

    const uploadDoc = uploadNode.value as FileData & TypeWithID

    const url = uploadDoc.url

    /**
     * If the upload is not an image, return a link to the upload
     */
    if (!uploadDoc.mimeType.startsWith('image')) {
      return (
        <a href={url} rel="noopener noreferrer">
          {uploadDoc.filename}
        </a>
      )
    }

    /**
     * If the upload is a simple image with no different sizes, return a simple img tag
     */
    if (!uploadDoc.sizes || !Object.keys(uploadDoc.sizes).length) {
      return (
        <img alt={uploadDoc.filename} height={uploadDoc.height} src={url} width={uploadDoc.width} />
      )
    }

    /**
     * If the upload is an image with different sizes, return a picture element
     */
    const pictureJSX: React.ReactNode[] = []

    // Iterate through each size in the data.sizes object
    for (const size in uploadDoc.sizes) {
      const imageSize = uploadDoc.sizes[size] as FileSizeImproved

      // Skip if any property of the size object is null
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
      const imageSizeURL = imageSize?.url

      pictureJSX.push(
        <source
          key={size}
          media={`(max-width: ${imageSize.width}px)`}
          srcSet={imageSizeURL}
          type={imageSize.mimeType}
        />,
      )
    }

    // Add the default img tag
    pictureJSX.push(
      <img
        alt={uploadDoc?.filename}
        height={uploadDoc?.height}
        key={'image'}
        src={url}
        width={uploadDoc?.width}
      />,
    )
    return <picture>{pictureJSX}</picture>
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToMarkdown/index.ts

```typescript
import type { SerializedEditorState } from 'lexical'

import { createHeadlessEditor } from '@lexical/headless'

import type { SanitizedServerEditorConfig } from '../../../lexical/config/types.js'

import { getEnabledNodes } from '../../../lexical/nodes/index.js'
import { $convertToMarkdownString } from '../../../packages/@lexical/markdown/index.js'

export const convertLexicalToMarkdown = ({
  data,
  editorConfig,
}: {
  data: SerializedEditorState
  editorConfig: SanitizedServerEditorConfig
}): string => {
  const headlessEditor = createHeadlessEditor({
    nodes: getEnabledNodes({
      editorConfig,
    }),
  })

  headlessEditor.update(
    () => {
      headlessEditor.setEditorState(headlessEditor.parseEditorState(data))
    },
    { discrete: true },
  )

  let markdown: string = ''
  headlessEditor.getEditorState().read(() => {
    markdown = $convertToMarkdownString(editorConfig?.features?.markdownTransformers)
  })

  return markdown
}
```

--------------------------------------------------------------------------------

---[FILE: convertLexicalToPlaintext.spec.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToPlaintext/convertLexicalToPlaintext.spec.ts

```typescript
import type {
  DefaultNodeTypes,
  DefaultTypedEditorState,
  SerializedTabNode,
  SerializedParagraphNode,
  SerializedTextNode,
  SerializedLineBreakNode,
  SerializedHeadingNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedTableRowNode,
  SerializedTableNode,
  SerializedTableCellNode,
} from '../../../nodeTypes.js'
import { convertLexicalToPlaintext } from './sync/index.js'

function textNode(text: string, bold?: boolean): SerializedTextNode {
  return {
    type: 'text',
    detail: 0,
    format: bold ? 1 : 0,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  }
}

function linebreakNode(): SerializedLineBreakNode {
  return {
    type: 'linebreak',
    version: 1,
  }
}

function tabNode(): SerializedTabNode {
  return {
    type: 'tab',
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text: '',
    version: 1,
  }
}

function paragraphNode(children: DefaultNodeTypes[]): SerializedParagraphNode {
  return {
    type: 'paragraph',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

function headingNode(children: DefaultNodeTypes[]): SerializedHeadingNode {
  return {
    type: 'heading',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    tag: 'h1',
    version: 1,
  }
}

function listItemNode(children: DefaultNodeTypes[]): SerializedListItemNode {
  return {
    type: 'listitem',
    children,
    checked: false,
    direction: 'ltr',
    format: '',
    indent: 0,
    value: 0,
    version: 1,
  }
}

function listNode(children: DefaultNodeTypes[]): SerializedListNode {
  return {
    type: 'list',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    listType: 'bullet',
    start: 0,
    tag: 'ul',
    version: 1,
  }
}

function tableNode(children: (DefaultNodeTypes | SerializedTableRowNode)[]): SerializedTableNode {
  return {
    type: 'table',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }
}

function tableRowNode(
  children: (DefaultNodeTypes | SerializedTableCellNode)[],
): SerializedTableRowNode {
  return {
    type: 'tablerow',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }
}

function tableCellNode(children: DefaultNodeTypes[]): SerializedTableCellNode {
  return {
    type: 'tablecell',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    headerState: 0,
    version: 1,
  }
}

function rootNode(nodes: (DefaultNodeTypes | SerializedTableNode)[]): DefaultTypedEditorState {
  return {
    root: {
      type: 'root',
      children: nodes,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

describe('convertLexicalToPlaintext', () => {
  it('ensure paragraph with text is correctly converted', () => {
    const data: DefaultTypedEditorState = rootNode([paragraphNode([textNode('Basic Text')])])

    const plaintext = convertLexicalToPlaintext({
      data,
    })

    expect(plaintext).toBe('Basic Text')
  })

  it('ensure paragraph with multiple text nodes is correctly converted', () => {
    const data: DefaultTypedEditorState = rootNode([
      paragraphNode([textNode('Basic Text'), textNode(' Bold', true), textNode(' Text')]),
    ])

    const plaintext = convertLexicalToPlaintext({
      data,
    })

    expect(plaintext).toBe('Basic Text Bold Text')
  })

  it('ensure linebreaks are converted correctly', () => {
    const data: DefaultTypedEditorState = rootNode([
      paragraphNode([textNode('Basic Text'), linebreakNode(), textNode('Next Line')]),
    ])

    const plaintext = convertLexicalToPlaintext({
      data,
    })

    expect(plaintext).toBe('Basic Text\nNext Line')
  })

  it('ensure tabs are converted correctly', () => {
    const data: DefaultTypedEditorState = rootNode([
      paragraphNode([textNode('Basic Text'), tabNode(), textNode('Next Line')]),
    ])

    const plaintext = convertLexicalToPlaintext({
      data,
    })

    expect(plaintext).toBe('Basic Text\tNext Line')
  })

  it('ensure new lines are added between paragraphs', () => {
    const data: DefaultTypedEditorState = rootNode([
      paragraphNode([textNode('Basic text')]),
      paragraphNode([textNode('Next block-node')]),
    ])

    const plaintext = convertLexicalToPlaintext({
      data,
    })

    expect(plaintext).toBe('Basic text\n\nNext block-node')
  })

  it('ensure new lines are added between heading nodes', () => {
    const data: DefaultTypedEditorState = rootNode([
      headingNode([textNode('Basic text')]),
      headingNode([textNode('Next block-node')]),
    ])

    const plaintext = convertLexicalToPlaintext({
      data,
    })

    expect(plaintext).toBe('Basic text\n\nNext block-node')
  })

  it('ensure new lines are added between list items and lists', () => {
    const data: DefaultTypedEditorState = rootNode([
      listNode([listItemNode([textNode('First item')]), listItemNode([textNode('Second item')])]),
      listNode([listItemNode([textNode('Next list')])]),
    ])

    const plaintext = convertLexicalToPlaintext({
      data,
    })

    expect(plaintext).toBe('First item\nSecond item\n\nNext list')
  })

  it('ensure new lines are added between tables, table rows, and table cells', () => {
    const data: DefaultTypedEditorState = rootNode([
      tableNode([
        tableRowNode([
          tableCellNode([textNode('Cell 1, Row 1')]),
          tableCellNode([textNode('Cell 2, Row 1')]),
        ]),
        tableRowNode([
          tableCellNode([textNode('Cell 1, Row 2')]),
          tableCellNode([textNode('Cell 2, Row 2')]),
        ]),
      ]),
      tableNode([tableRowNode([tableCellNode([textNode('Cell in Table 2')])])]),
    ])

    const plaintext = convertLexicalToPlaintext({
      data,
    })

    expect(plaintext).toBe(
      'Cell 1, Row 1 | Cell 2, Row 1\nCell 1, Row 2 | Cell 2, Row 2\n\nCell in Table 2',
    )
  })
})
```

--------------------------------------------------------------------------------

---[FILE: findConverterForNode.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToPlaintext/shared/findConverterForNode.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'

import type { SerializedBlockNode, SerializedInlineBlockNode } from '../../../../nodeTypes.js'
import type { PlaintextConverter, PlaintextConverters } from '../sync/types.js'

export function findConverterForNode<
  TConverters extends PlaintextConverters,
  TConverter extends PlaintextConverter<any>,
>({
  converters,

  node,
}: {
  converters: TConverters
  node: SerializedLexicalNode
}): TConverter | undefined {
  let converterForNode: TConverter | undefined
  if (node.type === 'block') {
    converterForNode = converters?.blocks?.[
      (node as SerializedBlockNode)?.fields?.blockType
    ] as TConverter
  } else if (node.type === 'inlineBlock') {
    converterForNode = converters?.inlineBlocks?.[
      (node as SerializedInlineBlockNode)?.fields?.blockType
    ] as TConverter
  } else {
    converterForNode = converters[node.type] as TConverter
  }

  return converterForNode
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToPlaintext/shared/types.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'
export type SerializedLexicalNodeWithParent = {
  parent?: SerializedLexicalNode
} & SerializedLexicalNode
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToPlaintext/sync/index.ts

```typescript
/* eslint-disable no-console */
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'

import type { SerializedLexicalNodeWithParent } from '../shared/types.js'
import type { PlaintextConverters } from './types.js'

import { hasText } from '../../../../validate/hasText.js'
import { findConverterForNode } from '../shared/findConverterForNode.js'

export type ConvertLexicalToPlaintextArgs = {
  /**
   * A map of node types to their corresponding plaintext converter functions.
   * This is optional - if not provided, the following heuristic will be used:
   *
   * - If the node has a `text` property, it will be used as the plaintext.
   * - If the node has a `children` property, the children will be recursively converted to plaintext.
   * - If the node has neither, it will be ignored.
   **/
  converters?: PlaintextConverters
  data: SerializedEditorState
}

export function convertLexicalToPlaintext({
  converters,
  data,
}: ConvertLexicalToPlaintextArgs): string {
  if (hasText(data)) {
    const plaintext = convertLexicalNodesToPlaintext({
      converters: converters ?? {},
      nodes: data?.root?.children,
      parent: data?.root,
    }).join('')

    return plaintext
  }
  return ''
}

export function convertLexicalNodesToPlaintext({
  converters,
  nodes,
  parent,
}: {
  converters: PlaintextConverters
  nodes: SerializedLexicalNode[]
  parent: SerializedLexicalNodeWithParent
}): string[] {
  const plainTextArray: string[] = []

  let i = -1
  for (const node of nodes) {
    i++

    const converter = findConverterForNode({
      converters,
      node,
    })

    if (converter) {
      try {
        const converted =
          typeof converter === 'function'
            ? converter({
                childIndex: i,
                converters,
                node,
                nodesToPlaintext: (args) => {
                  return convertLexicalNodesToPlaintext({
                    converters: args.converters ?? converters,
                    nodes: args.nodes,
                    parent: args.parent ?? {
                      ...node,
                      parent,
                    },
                  })
                },
                parent,
              })
            : converter

        if (converted && typeof converted === 'string') {
          plainTextArray.push(converted)
        }
      } catch (error) {
        console.error('Error converting lexical node to plaintext:', error, 'node:', node)
      }
    } else {
      // Default plaintext converter heuristic
      if (
        node.type === 'paragraph' ||
        node.type === 'heading' ||
        node.type === 'list' ||
        node.type === 'table'
      ) {
        if (plainTextArray?.length) {
          // Only add a new line if there is already text in the array
          plainTextArray.push('\n\n')
        }
      } else if (node.type === 'listitem' || node.type === 'tablerow') {
        if (plainTextArray?.length) {
          // Only add a new line if there is already text in the array
          plainTextArray.push('\n')
        }
      } else if (node.type === 'tablecell') {
        if (plainTextArray?.length) {
          plainTextArray.push(' | ')
        }
      } else if (node.type === 'linebreak') {
        plainTextArray.push('\n')
      } else if (node.type === 'tab') {
        plainTextArray.push('\t')
      } else if ('text' in node && node.text) {
        plainTextArray.push(node.text as string)
      }

      if ('children' in node && node.children) {
        plainTextArray.push(
          ...convertLexicalNodesToPlaintext({
            converters,
            nodes: node.children as SerializedLexicalNode[],
            parent: node,
          }),
        )
      }
    }
  }

  return plainTextArray.filter(Boolean)
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/lexicalToPlaintext/sync/types.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'

import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '../../../../nodeTypes.js'
import type { SerializedLexicalNodeWithParent } from '../shared/types.js'

export type PlaintextConverter<
  T extends { [key: string]: any; type?: string } = SerializedLexicalNode,
> =
  | ((args: {
      childIndex: number
      converters: PlaintextConverters
      node: T
      nodesToPlaintext: (args: {
        converters?: PlaintextConverters
        nodes: SerializedLexicalNode[]
        parent?: SerializedLexicalNodeWithParent
      }) => string[]
      parent: SerializedLexicalNodeWithParent
    }) => string)
  | string

export type DefaultPlaintextNodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<{ blockName?: null | string; blockType: string }> // need these to ensure types for blocks and inlineBlocks work if no generics are provided
  | SerializedInlineBlockNode<{ blockName?: null | string; blockType: string }>

export type PlaintextConverters<
  T extends { [key: string]: any; type?: string } = DefaultPlaintextNodeTypes,
> = {
  [key: string]:
    | {
        [blockSlug: string]: PlaintextConverter<any>
      }
    | PlaintextConverter<any>
    | undefined
} & {
  [nodeType in Exclude<NonNullable<T['type']>, 'block' | 'inlineBlock'>]?: PlaintextConverter<
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
    >]?: PlaintextConverter<
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
    >]?: PlaintextConverter<
      Extract<T, { type: 'inlineBlock' }> extends SerializedInlineBlockNode<infer B>
        ? SerializedInlineBlockNode<Extract<B, { blockType: K }>>
        : SerializedInlineBlockNode
    >
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/markdownToLexical/index.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'

import { createHeadlessEditor } from '@lexical/headless'

import type { SanitizedServerEditorConfig } from '../../../lexical/config/types.js'
import type { DefaultNodeTypes, TypedEditorState } from '../../../nodeTypes.js'

import { getEnabledNodes } from '../../../lexical/nodes/index.js'
import { $convertFromMarkdownString } from '../../../packages/@lexical/markdown/index.js'

export const convertMarkdownToLexical = <
  TNodeTypes extends SerializedLexicalNode = DefaultNodeTypes,
>({
  editorConfig,
  markdown,
}: {
  editorConfig: SanitizedServerEditorConfig
  markdown: string
}): TypedEditorState<TNodeTypes> => {
  const headlessEditor = createHeadlessEditor({
    nodes: getEnabledNodes({
      editorConfig,
    }),
  })

  headlessEditor.update(
    () => {
      $convertFromMarkdownString(markdown, editorConfig.features.markdownTransformers)
    },
    { discrete: true },
  )

  const editorJSON = headlessEditor.getEditorState().toJSON()

  return editorJSON as TypedEditorState<TNodeTypes>
}
```

--------------------------------------------------------------------------------

---[FILE: payloadPopulateFn.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/utilities/payloadPopulateFn.ts

```typescript
import { createLocalReq, type Payload, type PayloadRequest, type TypedLocale } from 'payload'

import type { HTMLPopulateFn } from '../lexicalToHtml/async/types.js'

import { populate } from '../../../populateGraphQL/populate.js'

export const getPayloadPopulateFn: (
  args: {
    currentDepth: number
    depth: number
    draft?: boolean
    locale?: TypedLocale

    overrideAccess?: boolean
    showHiddenFields?: boolean
  } & (
    | {
        /**
         * This payload property will only be used if req is undefined. If localization is enabled, you must pass `req` instead.
         */
        payload: Payload
        /**
         * When the converter is called, req CAN be passed in depending on where it's run.
         * If this is undefined and config is passed through, lexical will create a new req object for you.
         */
        req?: never
      }
    | {
        /**
         * This payload property will only be used if req is undefined. If localization is enabled, you must pass `req` instead.
         */
        payload?: never
        /**
         * When the converter is called, req CAN be passed in depending on where it's run.
         * If this is undefined and config is passed through, lexical will create a new req object for you.
         */
        req: PayloadRequest
      }
  ),
) => Promise<HTMLPopulateFn> = async ({
  currentDepth,
  depth,
  draft,
  overrideAccess,
  payload,
  req,
  showHiddenFields,
}) => {
  let reqToUse: PayloadRequest | undefined = req
  if (req === undefined && payload) {
    reqToUse = await createLocalReq({}, payload)
  }

  if (!reqToUse) {
    throw new Error('No req or payload provided')
  }

  const populateFn: HTMLPopulateFn = async ({ id, collectionSlug, select }) => {
    const dataContainer: {
      value?: any
    } = {}

    await populate({
      id,
      collectionSlug,
      currentDepth,
      data: dataContainer,
      depth,
      draft: draft ?? false,
      key: 'value',
      overrideAccess: overrideAccess ?? true,
      req: reqToUse,
      select,
      showHiddenFields: showHiddenFields ?? false,
    })

    return dataContainer.value
  }

  return populateFn
}
```

--------------------------------------------------------------------------------

---[FILE: restPopulateFn.ts]---
Location: payload-main/packages/richtext-lexical/src/features/converters/utilities/restPopulateFn.ts

```typescript
import { stringify } from 'qs-esm'

import type { HTMLPopulateFn } from '../lexicalToHtml/async/types.js'

export const getRestPopulateFn: (args: {
  /**
   * E.g. `http://localhost:3000/api`
   */
  apiURL: string
  depth?: number
  draft?: boolean
  locale?: string
}) => HTMLPopulateFn = ({ apiURL, depth, draft, locale }) => {
  const populateFn: HTMLPopulateFn = async ({ id, collectionSlug, select }) => {
    const query = stringify(
      { depth: depth ?? 0, draft: draft ?? false, locale, select },
      { addQueryPrefix: true },
    )

    const res = await fetch(`${apiURL}/${collectionSlug}/${id}${query}`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }).then((res) => res.json())

    return res
  }

  return populateFn
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/debug/jsxConverter/client/index.tsx

```typescript
'use client'

import { createClientFeature } from '../../../../utilities/createClientFeature.js'
import { RichTextPlugin } from './plugin/index.js'

export const DebugJsxConverterFeatureClient = createClientFeature({
  plugins: [
    {
      Component: RichTextPlugin,
      position: 'bottom',
    },
  ],
})
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/debug/jsxConverter/client/plugin/index.tsx
Signals: React

```typescript
'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect, useState } from 'react'

// eslint-disable-next-line payload/no-imports-from-exports-dir
import { defaultJSXConverters, RichText } from '../../../../../exports/react/index.js'
import './style.scss'

export function RichTextPlugin() {
  const [editor] = useLexicalComposerContext()
  const [editorState, setEditorState] = useState(editor.getEditorState().toJSON())

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      setEditorState(editorState.toJSON())
    })
  }, [editor])

  return (
    <div className="debug-jsx-converter">
      <RichText converters={defaultJSXConverters} data={editorState} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: style.scss]---
Location: payload-main/packages/richtext-lexical/src/features/debug/jsxConverter/client/plugin/style.scss

```text
.debug-jsx-converter {
  // this is to match the editor component, and be able to compare aligned styles
  padding-left: 36px;

  // We revert to the browser defaults (user-agent), because we want to see
  // the indentations look good without the need for CSS.
  ul,
  ol {
    padding-left: revert;
    margin: revert;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/debug/jsxConverter/server/index.ts

```typescript
import { createServerFeature } from '../../../../utilities/createServerFeature.js'

export const DebugJsxConverterFeature = createServerFeature({
  feature: {
    ClientFeature: '@payloadcms/richtext-lexical/client#DebugJsxConverterFeatureClient',
  },
  key: 'jsxConverter',
})
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/debug/testRecorder/client/index.tsx

```typescript
'use client'

import { createClientFeature } from '../../../../utilities/createClientFeature.js'
import { TestRecorderPlugin } from './plugin/index.js'

export const TestRecorderFeatureClient = createClientFeature({
  plugins: [
    {
      Component: TestRecorderPlugin,
      position: 'bottom',
    },
  ],
})
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/debug/testRecorder/client/plugin/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .test-recorder-output {
    margin: 20px auto 20px auto;
    width: 100%;
  }
  .test-recorder-toolbar {
    display: flex;
  }

  .test-recorder-button {
    position: relative;
    display: block;
    font-size: 10px;
    padding: 6px 6px;
    border-radius: $style-radius-m;
    border: none;
    cursor: pointer;
    outline: none;
    box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.4);
    background-color: #222;
    color: white;
    transition: box-shadow 50ms ease-out;
  }

  .test-recorder-button:active {
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.4);
  }

  .test-recorder-button + .test-recorder-button {
    margin-left: 4px;
  }

  .test-recorder-button::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 8px;
    bottom: 8px;
    left: 8px;
    display: block;
    background-size: contain;
    filter: invert(1);
  }
  #test-recorder-button {
    position: relative;
  }

  #test-recorder-button-snapshot {
    margin-right: auto;
  }
}
```

--------------------------------------------------------------------------------

````
