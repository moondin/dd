---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 299
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 299 of 695)

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

---[FILE: utils.ts]---
Location: payload-main/packages/richtext-lexical/src/packages/@lexical/markdown/utils.ts

```typescript
/* eslint-disable regexp/no-obscure-range */
/* eslint-disable regexp/no-empty-group */
/* eslint-disable regexp/no-empty-capturing-group */
/* eslint-disable regexp/optimal-quantifier-concatenation */
/* eslint-disable regexp/no-misleading-capturing-group */
/* eslint-disable regexp/no-contradiction-with-assertion */
/* eslint-disable regexp/no-super-linear-backtracking */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ListNode } from '@lexical/list'

import { $isListItemNode, $isListNode } from '@lexical/list'
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text'
import {
  $isParagraphNode,
  $isTextNode,
  type ElementNode,
  type LexicalNode,
  type TextFormatType,
} from 'lexical'

import type {
  ElementTransformer,
  MultilineElementTransformer,
  TextFormatTransformer,
  TextMatchTransformer,
  Transformer,
} from './MarkdownTransformers.js'

type MarkdownFormatKind =
  | 'bold'
  | 'code'
  | 'horizontalRule'
  | 'italic'
  | 'italic_bold'
  | 'link'
  | 'noTransformation'
  | 'paragraphBlockQuote'
  | 'paragraphCodeBlock'
  | 'paragraphH1'
  | 'paragraphH2'
  | 'paragraphH3'
  | 'paragraphH4'
  | 'paragraphH5'
  | 'paragraphH6'
  | 'paragraphOrderedList'
  | 'paragraphUnorderedList'
  | 'strikethrough'
  | 'strikethrough_bold'
  | 'strikethrough_italic'
  | 'strikethrough_italic_bold'
  | 'underline'

type MarkdownCriteria = Readonly<{
  export?: (
    node: LexicalNode,
    traverseChildren: (elementNode: ElementNode) => string,
  ) => null | string
  exportFormat?: TextFormatType
  exportTag?: string
  exportTagClose?: string
  markdownFormatKind: MarkdownFormatKind | null | undefined
  regEx: RegExp
  regExForAutoFormatting: RegExp
  requiresParagraphStart: boolean | null | undefined
}>

type MarkdownCriteriaArray = Array<MarkdownCriteria>

const autoFormatBase: MarkdownCriteria = {
  markdownFormatKind: null,
  regEx: /(?:)/,
  regExForAutoFormatting: /(?:)/,
  requiresParagraphStart: false,
}

const paragraphStartBase: MarkdownCriteria = {
  ...autoFormatBase,
  requiresParagraphStart: true,
}

const markdownHeader1: MarkdownCriteria = {
  ...paragraphStartBase,
  export: createHeadingExport(1),
  markdownFormatKind: 'paragraphH1',
  regEx: /^# /,
  regExForAutoFormatting: /^# /,
}

const markdownHeader2: MarkdownCriteria = {
  ...paragraphStartBase,
  export: createHeadingExport(2),
  markdownFormatKind: 'paragraphH2',
  regEx: /^## /,
  regExForAutoFormatting: /^## /,
}

const markdownHeader3: MarkdownCriteria = {
  ...paragraphStartBase,
  export: createHeadingExport(3),
  markdownFormatKind: 'paragraphH3',
  regEx: /^### /,
  regExForAutoFormatting: /^### /,
}

const markdownHeader4: MarkdownCriteria = {
  ...paragraphStartBase,
  export: createHeadingExport(4),
  markdownFormatKind: 'paragraphH4',
  regEx: /^#### /,
  regExForAutoFormatting: /^#### /,
}

const markdownHeader5: MarkdownCriteria = {
  ...paragraphStartBase,
  export: createHeadingExport(5),
  markdownFormatKind: 'paragraphH5',
  regEx: /^##### /,
  regExForAutoFormatting: /^##### /,
}

const markdownHeader6: MarkdownCriteria = {
  ...paragraphStartBase,
  export: createHeadingExport(6),
  markdownFormatKind: 'paragraphH6',
  regEx: /^###### /,
  regExForAutoFormatting: /^###### /,
}

const markdownBlockQuote: MarkdownCriteria = {
  ...paragraphStartBase,
  export: blockQuoteExport,
  markdownFormatKind: 'paragraphBlockQuote',
  regEx: /^> /,
  regExForAutoFormatting: /^> /,
}

const markdownUnorderedListDash: MarkdownCriteria = {
  ...paragraphStartBase,
  export: listExport,
  markdownFormatKind: 'paragraphUnorderedList',
  regEx: /^(\s{0,10})- /,
  regExForAutoFormatting: /^(\s{0,10})- /,
}

const markdownUnorderedListAsterisk: MarkdownCriteria = {
  ...paragraphStartBase,
  export: listExport,
  markdownFormatKind: 'paragraphUnorderedList',
  regEx: /^(\s{0,10})\* /,
  regExForAutoFormatting: /^(\s{0,10})\* /,
}

const markdownOrderedList: MarkdownCriteria = {
  ...paragraphStartBase,
  export: listExport,
  markdownFormatKind: 'paragraphOrderedList',
  regEx: /^(\s{0,10})(\d+)\.\s/,
  regExForAutoFormatting: /^(\s{0,10})(\d+)\.\s/,
}

const markdownHorizontalRule: MarkdownCriteria = {
  ...paragraphStartBase,
  markdownFormatKind: 'horizontalRule',
  regEx: /^\*\*\*$/,
  regExForAutoFormatting: /^\*\*\* /,
}

const markdownHorizontalRuleUsingDashes: MarkdownCriteria = {
  ...paragraphStartBase,
  markdownFormatKind: 'horizontalRule',
  regEx: /^---$/,
  regExForAutoFormatting: /^--- /,
}

const markdownInlineCode: MarkdownCriteria = {
  ...autoFormatBase,
  exportFormat: 'code',
  exportTag: '`',
  markdownFormatKind: 'code',
  regEx: /(`)(\s*)([^`]*)(\s*)(`)()/,
  regExForAutoFormatting: /(`)(\s*\b)([^`]*)(\b\s*)(`)(\s)$/,
}

const markdownBold: MarkdownCriteria = {
  ...autoFormatBase,
  exportFormat: 'bold',
  exportTag: '**',
  markdownFormatKind: 'bold',
  regEx: /(\*\*)(\s*)([^*]*)(\s*)(\*\*)()/,
  regExForAutoFormatting: /(\*\*)(\s*\b)([^*]*)(\b\s*)(\*\*)(\s)$/,
}

const markdownItalic: MarkdownCriteria = {
  ...autoFormatBase,
  exportFormat: 'italic',
  exportTag: '*',
  markdownFormatKind: 'italic',
  regEx: /(\*)(\s*)([^*]*)(\s*)(\*)()/,
  regExForAutoFormatting: /(\*)(\s*\b)([^*]*)(\b\s*)(\*)(\s)$/,
}

const markdownBold2: MarkdownCriteria = {
  ...autoFormatBase,
  exportFormat: 'bold',
  exportTag: '_',
  markdownFormatKind: 'bold',
  regEx: /(__)(\s*)([^_]*)(\s*)(__)()/,
  regExForAutoFormatting: /(__)(\s*)([^_]*)(\s*)(__)(\s)$/,
}

const markdownItalic2: MarkdownCriteria = {
  ...autoFormatBase,
  exportFormat: 'italic',
  exportTag: '_',
  markdownFormatKind: 'italic',
  regEx: /(_)()([^_]*)()(_)()/,
  regExForAutoFormatting: /(_)()([^_]*)()(_)(\s)$/, // Maintain 7 groups.
}

const fakeMarkdownUnderline: MarkdownCriteria = {
  ...autoFormatBase,
  exportFormat: 'underline',
  exportTag: '<u>',
  exportTagClose: '</u>',
  markdownFormatKind: 'underline',
  regEx: /(<u>)(\s*)([^<]*)(\s*)(<\/u>)()/,
  regExForAutoFormatting: /(<u>)(\s*\b)([^<]*)(\b\s*)(<\/u>)(\s)$/,
}

const markdownStrikethrough: MarkdownCriteria = {
  ...autoFormatBase,
  exportFormat: 'strikethrough',
  exportTag: '~~',
  markdownFormatKind: 'strikethrough',
  regEx: /(~~)(\s*)([^~]*)(\s*)(~~)()/,
  regExForAutoFormatting: /(~~)(\s*\b)([^~]*)(\b\s*)(~~)(\s)$/,
}

const markdownStrikethroughItalicBold: MarkdownCriteria = {
  ...autoFormatBase,
  markdownFormatKind: 'strikethrough_italic_bold',
  regEx: /(~~_\*\*)(\s*\b)([^*_~]+)(\b\s*)(\*\*_~~)()/,
  regExForAutoFormatting: /(~~_\*\*)(\s*\b)([^*_~]+)(\b\s*)(\*\*_~~)(\s)$/,
}

const markdownItalicbold: MarkdownCriteria = {
  ...autoFormatBase,
  markdownFormatKind: 'italic_bold',
  regEx: /(_\*\*)(\s*\b)([^*_]+)(\b\s*)(\*\*_)/,
  regExForAutoFormatting: /(_\*\*)(\s*\b)([^*_]+)(\b\s*)(\*\*_)(\s)$/,
}

const markdownStrikethroughItalic: MarkdownCriteria = {
  ...autoFormatBase,
  markdownFormatKind: 'strikethrough_italic',
  regEx: /(~~_)(\s*)([^_~]+)(\s*)(_~~)/,
  regExForAutoFormatting: /(~~_)(\s*)([^_~]+)(\s*)(_~~)(\s)$/,
}

const markdownStrikethroughBold: MarkdownCriteria = {
  ...autoFormatBase,
  markdownFormatKind: 'strikethrough_bold',
  regEx: /(~~\*\*)(\s*\b)([^*~]+)(\b\s*)(\*\*~~)/,
  regExForAutoFormatting: /(~~\*\*)(\s*\b)([^*~]+)(\b\s*)(\*\*~~)(\s)$/,
}

const markdownLink: MarkdownCriteria = {
  ...autoFormatBase,
  markdownFormatKind: 'link',
  regEx: /(\[)([^\]]*)(\]\()([^)]*)(\)*)()/,
  regExForAutoFormatting: /(\[)([^\]]*)(\]\()([^)]*)(\)*)(\s)$/,
}

const allMarkdownCriteriaForTextNodes: MarkdownCriteriaArray = [
  // Place the combination formats ahead of the individual formats.
  // Combos
  markdownStrikethroughItalicBold,
  markdownItalicbold,
  markdownStrikethroughItalic,
  markdownStrikethroughBold, // Individuals
  markdownInlineCode,
  markdownBold,
  markdownItalic, // Must appear after markdownBold
  markdownBold2,
  markdownItalic2, // Must appear after markdownBold2.
  fakeMarkdownUnderline,
  markdownStrikethrough,
  markdownLink,
]

const allMarkdownCriteriaForParagraphs: MarkdownCriteriaArray = [
  markdownHeader1,
  markdownHeader2,
  markdownHeader3,
  markdownHeader4,
  markdownHeader5,
  markdownHeader6,
  markdownBlockQuote,
  markdownUnorderedListDash,
  markdownUnorderedListAsterisk,
  markdownOrderedList,
  markdownHorizontalRule,
  markdownHorizontalRuleUsingDashes,
]

export function getAllMarkdownCriteriaForParagraphs(): MarkdownCriteriaArray {
  return allMarkdownCriteriaForParagraphs
}

export function getAllMarkdownCriteriaForTextNodes(): MarkdownCriteriaArray {
  return allMarkdownCriteriaForTextNodes
}

type Block = (
  node: LexicalNode,
  exportChildren: (elementNode: ElementNode) => string,
) => null | string

function createHeadingExport(level: number): Block {
  return (node, exportChildren) => {
    return $isHeadingNode(node) && node.getTag() === 'h' + level
      ? '#'.repeat(level) + ' ' + exportChildren(node)
      : null
  }
}

function listExport(node: LexicalNode, exportChildren: (_node: ElementNode) => string) {
  return $isListNode(node) ? processNestedLists(node, exportChildren, 0) : null
}

// TODO: should be param
const LIST_INDENT_SIZE = 4

function processNestedLists(
  listNode: ListNode,
  exportChildren: (node: ElementNode) => string,
  depth: number,
): string {
  const output: string[] = []
  const children = listNode.getChildren()
  let index = 0

  for (const listItemNode of children) {
    if ($isListItemNode(listItemNode)) {
      if (listItemNode.getChildrenSize() === 1) {
        const firstChild = listItemNode.getFirstChild()

        if ($isListNode(firstChild)) {
          output.push(processNestedLists(firstChild, exportChildren, depth + 1))
          continue
        }
      }

      const indent = ' '.repeat(depth * LIST_INDENT_SIZE)
      const prefix = listNode.getListType() === 'bullet' ? '- ' : `${listNode.getStart() + index}. `
      output.push(indent + prefix + exportChildren(listItemNode))
      index++
    }
  }

  return output.join('\n')
}

function blockQuoteExport(node: LexicalNode, exportChildren: (_node: ElementNode) => string) {
  return $isQuoteNode(node) ? '> ' + exportChildren(node) : null
}

export function indexBy<T>(
  list: Array<T>,
  callback: (arg0: T) => string | undefined,
): Readonly<Record<string, Array<T>>> {
  const index: Record<string, Array<T>> = {}

  for (const item of list) {
    const key = callback(item)

    if (!key) {
      continue
    }

    if (index[key]) {
      index[key].push(item)
    } else {
      index[key] = [item]
    }
  }

  return index
}

export function transformersByType(transformers: Array<Transformer>): Readonly<{
  element: Array<ElementTransformer>
  multilineElement: Array<MultilineElementTransformer>
  textFormat: Array<TextFormatTransformer>
  textMatch: Array<TextMatchTransformer>
}> {
  const byType = indexBy(transformers, (t) => t.type)

  return {
    element: (byType.element || []) as Array<ElementTransformer>,
    multilineElement: (byType['multiline-element'] || []) as Array<MultilineElementTransformer>,
    textFormat: (byType['text-format'] || []) as Array<TextFormatTransformer>,
    textMatch: (byType['text-match'] || []) as Array<TextMatchTransformer>,
  }
}

export const PUNCTUATION_OR_SPACE = /[!-/:-@[-`{-~\s]/

const MARKDOWN_EMPTY_LINE_REG_EXP = /^\s{0,3}$/

export function isEmptyParagraph(node: LexicalNode): boolean {
  if (!$isParagraphNode(node)) {
    return false
  }

  const firstChild = node.getFirstChild()
  return (
    firstChild == null ||
    (node.getChildrenSize() === 1 &&
      $isTextNode(firstChild) &&
      MARKDOWN_EMPTY_LINE_REG_EXP.test(firstChild.getTextContent()))
  )
}
```

--------------------------------------------------------------------------------

---[FILE: defaultValue.ts]---
Location: payload-main/packages/richtext-lexical/src/populateGraphQL/defaultValue.ts

```typescript
import type { SerializedEditorState, SerializedParagraphNode, SerializedTextNode } from 'lexical'

export const defaultRichTextValue: SerializedEditorState = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: '',
            version: 1,
          } as SerializedTextNode,
        ],
        direction: null,
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      } as SerializedParagraphNode,
    ],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: populate.ts]---
Location: payload-main/packages/richtext-lexical/src/populateGraphQL/populate.ts

```typescript
import type { PayloadRequest, SelectType } from 'payload'

import { createDataloaderCacheKey } from 'payload'

type PopulateArguments = {
  collectionSlug: string
  currentDepth?: number
  data: unknown
  depth: number
  draft: boolean
  id: number | string
  key: number | string
  overrideAccess: boolean
  req: PayloadRequest
  select?: SelectType
  showHiddenFields: boolean
}

type PopulateFn = (args: PopulateArguments) => Promise<void>

export const populate: PopulateFn = async ({
  id,
  collectionSlug,
  currentDepth,
  data,
  depth,
  draft,
  key,
  overrideAccess,
  req,
  select,
  showHiddenFields,
}) => {
  const shouldPopulate = depth && currentDepth! <= depth
  // usually depth is checked within recursivelyPopulateFieldsForGraphQL. But since this populate function can be called outside of that (in rest afterRead node hooks) we need to check here too
  if (!shouldPopulate) {
    return
  }

  const dataRef = data as Record<string, unknown>

  const doc = await req.payloadDataLoader?.load(
    createDataloaderCacheKey({
      collectionSlug,
      currentDepth: currentDepth! + 1,
      depth,
      docID: id as string,
      draft,
      fallbackLocale: req.fallbackLocale!,
      locale: req.locale!,
      overrideAccess,
      select,
      showHiddenFields,
      transactionID: req.transactionID!,
    }),
  )

  if (doc) {
    dataRef[key] = doc
  } else {
    dataRef[key] = null
  }
}
```

--------------------------------------------------------------------------------

---[FILE: populateLexicalPopulationPromises.ts]---
Location: payload-main/packages/richtext-lexical/src/populateGraphQL/populateLexicalPopulationPromises.ts

```typescript
import type { SerializedEditorState } from 'lexical'
import type { RichTextAdapter } from 'payload'

import type { PopulationPromise } from '../features/typesServer.js'
import type { AdapterProps } from '../types.js'

import { recurseNodes } from '../utilities/forEachNodeRecursively.js'

export type Args = {
  editorPopulationPromises: Map<string, Array<PopulationPromise>>
  parentIsLocalized: boolean
} & Parameters<
  NonNullable<RichTextAdapter<SerializedEditorState, AdapterProps>['graphQLPopulationPromises']>
>[0]

/**
 * Appends all new populationPromises to the populationPromises prop
 */
export const populateLexicalPopulationPromises = ({
  context,
  currentDepth,
  depth,
  draft,
  editorPopulationPromises,
  field,
  fieldPromises,
  findMany,
  flattenLocales,
  overrideAccess,
  parentIsLocalized,
  populationPromises,
  req,
  showHiddenFields,
  siblingDoc,
}: Args) => {
  const shouldPopulate = depth && currentDepth! <= depth

  if (!shouldPopulate) {
    return
  }

  recurseNodes({
    callback: (node) => {
      const editorPopulationPromisesOfNodeType = editorPopulationPromises?.get(node.type)
      if (editorPopulationPromisesOfNodeType) {
        for (const promise of editorPopulationPromisesOfNodeType) {
          promise({
            context,
            currentDepth: currentDepth!,
            depth,
            draft,
            editorPopulationPromises,
            field,
            fieldPromises,
            findMany,
            flattenLocales,
            node,
            overrideAccess: overrideAccess!,
            parentIsLocalized,
            populationPromises,
            req,
            showHiddenFields,
            siblingDoc,
          })
        }
      }
    },

    nodes: (siblingDoc[field?.name] as SerializedEditorState)?.root?.children ?? [],
  })
}
```

--------------------------------------------------------------------------------

---[FILE: recursivelyPopulateFieldsForGraphQL.ts]---
Location: payload-main/packages/richtext-lexical/src/populateGraphQL/recursivelyPopulateFieldsForGraphQL.ts

```typescript
import type { Field, JsonObject, PayloadRequest, RequestContext } from 'payload'

import { afterReadTraverseFields } from 'payload'

import type { PopulationPromise } from '../features/typesServer.js'

type NestedRichTextFieldsArgs = {
  context: RequestContext
  currentDepth?: number
  data: unknown
  depth: number
  draft: boolean
  /**
   * This maps all the population promises to the node types
   */
  editorPopulationPromises: Map<string, Array<PopulationPromise>>
  /**
   * fieldPromises are used for things like field hooks. They should be awaited before awaiting populationPromises
   */
  fieldPromises: Promise<void>[]
  fields: Field[]
  findMany: boolean
  flattenLocales: boolean
  overrideAccess: boolean
  parentIsLocalized: boolean
  populationPromises: Promise<void>[]
  req: PayloadRequest
  showHiddenFields: boolean
  siblingDoc: JsonObject
}

export const recursivelyPopulateFieldsForGraphQL = ({
  context,
  currentDepth = 0,
  data,
  depth,
  draft,
  fieldPromises,
  fields,
  findMany,
  flattenLocales,
  overrideAccess = false,
  parentIsLocalized,
  populationPromises,
  req,
  showHiddenFields,
  siblingDoc,
}: NestedRichTextFieldsArgs): void => {
  afterReadTraverseFields({
    collection: null, // Pass from core? This is only needed for hooks, so we can leave this null for now
    context,
    currentDepth,
    depth,
    doc: data as any, // Looks like it's only needed for hooks and access control, so doesn't matter what we pass here right now
    draft,
    fallbackLocale: req.fallbackLocale!,
    fieldPromises,
    fields,
    findMany,
    flattenLocales,
    global: null, // Pass from core? This is only needed for hooks, so we can leave this null for now
    locale: req.locale!,
    overrideAccess,
    parentIndexPath: '',
    parentIsLocalized,
    parentPath: '',
    parentSchemaPath: '',
    populationPromises, // This is not the same as populationPromises passed into this recurseNestedFields. These are just promises resolved at the very end.
    req,
    showHiddenFields,
    siblingDoc,
    triggerHooks: false,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: buildEditorState.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/buildEditorState.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'

import type { DefaultNodeTypes, DefaultTypedEditorState, TypedEditorState } from '../nodeTypes.js'

/**
 * Helper to build lexical editor state JSON from text and/or nodes.
 *
 * @param nodes - The nodes to include in the editor state. If you pass the `text` argument, this will append your nodes after the first paragraph node.
 * @param text - The text content to include in the editor state. This will create a paragraph node with a text node for you and set that as the first node.
 * @returns The constructed editor state JSON.
 *
 * @example
 *
 * just passing text:
 *
 * ```ts
 * const editorState = buildEditorState<DefaultNodeTypes>({ text: 'Hello world' }) // result typed as DefaultTypedEditorState
 * ```
 *
 * @example
 *
 * passing nodes:
 *
 * ```ts
 * const editorState = // result typed as TypedEditorState<DefaultNodeTypes | SerializedBlockNode> (or TypedEditorState<SerializedBlockNode>)
 * buildEditorState<DefaultNodeTypes | SerializedBlockNode>({ // or just buildEditorState<SerializedBlockNode> if you *only* want to allow block nodes
 *   nodes: [
 *     {
 *       type: 'block',
 *        fields: {
 *          id: 'id',
 *          blockName: 'Cool block',
 *          blockType: 'myBlock',
 *        },
 *        format: 'left',
 *        version: 1,
 *      }
 *   ],
 * })
 * ```
 */
export function buildEditorState<T extends SerializedLexicalNode>({
  nodes,
  text,
}: {
  nodes?: TypedEditorState<T>['root']['children']
  text?: string
}): TypedEditorState<T> {
  const editorJSON: DefaultTypedEditorState = {
    root: {
      type: 'root',
      children: [],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }

  if (text) {
    editorJSON.root.children.push({
      type: 'paragraph',
      children: [
        {
          type: 'text',
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      textStyle: '',
      version: 1,
    })
  }

  if (nodes?.length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editorJSON.root.children.push(...(nodes as any))
  }

  return editorJSON as TypedEditorState<T>
}

/**
 *
 * Alias for `buildEditorState<DefaultNodeTypes>`
 *
 * @experimental this API may change or be removed in a minor release
 * @internal
 */
export const buildDefaultEditorState: typeof buildEditorState<DefaultNodeTypes> =
  buildEditorState<DefaultNodeTypes>
```

--------------------------------------------------------------------------------

---[FILE: buildInitialState.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/buildInitialState.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'
import type {
  ClientFieldSchemaMap,
  DocumentPreferences,
  FieldSchemaMap,
  FormState,
  Operation,
  PayloadRequest,
  RichTextField,
  SanitizedFieldPermissions,
} from 'payload'

import { fieldSchemasToFormState } from '@payloadcms/ui/forms/fieldSchemasToFormState'

import type { SerializedBlockNode } from '../nodeTypes.js'

export type InitialLexicalFormState = {
  [nodeID: string]: {
    [key: string]: any
    formState?: FormState
  }
}

type Props = {
  context: {
    clientFieldSchemaMap: ClientFieldSchemaMap
    collectionSlug: string
    disabled?: boolean
    documentData?: any
    field: RichTextField
    fieldSchemaMap: FieldSchemaMap
    id?: number | string
    lexicalFieldSchemaPath: string
    operation: Operation
    permissions?: SanitizedFieldPermissions
    preferences: DocumentPreferences
    renderFieldFn: any
    req: PayloadRequest
  }
  initialState?: InitialLexicalFormState
  nodeData: SerializedLexicalNode[]
}

export async function buildInitialState({
  context,
  initialState: initialStateFromArgs,
  nodeData,
}: Props): Promise<InitialLexicalFormState> {
  let initialState: InitialLexicalFormState = initialStateFromArgs ?? {}
  for (const node of nodeData) {
    if ('children' in node) {
      initialState = await buildInitialState({
        context,
        initialState,
        nodeData: node.children as SerializedLexicalNode[],
      })
    }

    if (node.type === 'block' || node.type === 'inlineBlock') {
      const blockNode = node as SerializedBlockNode
      const id = blockNode?.fields?.id
      if (!id) {
        continue
      }

      const schemaFieldsPath =
        node.type === 'block'
          ? `${context.lexicalFieldSchemaPath}.lexical_internal_feature.blocks.lexical_blocks.${blockNode.fields.blockType}.fields`
          : `${context.lexicalFieldSchemaPath}.lexical_internal_feature.blocks.lexical_inline_blocks.${blockNode.fields.blockType}.fields`

      // Build form state for the block

      const formStateResult = await fieldSchemasToFormState({
        id: context.id,
        clientFieldSchemaMap: context.clientFieldSchemaMap,
        collectionSlug: context.collectionSlug,
        data: blockNode.fields,
        documentData: context.documentData,
        fields: (context.fieldSchemaMap.get(schemaFieldsPath) as any)?.fields,
        fieldSchemaMap: context.fieldSchemaMap,
        initialBlockData: blockNode.fields,
        operation: context.operation as any, // TODO: Type
        permissions: true,
        preferences: context.preferences,
        readOnly: context.disabled,
        renderAllFields: true, // If this function runs, the parent lexical field is being re-rendered => thus we can assume all its sub-fields need to be re-rendered
        renderFieldFn: context.renderFieldFn,
        req: context.req,
        schemaPath: schemaFieldsPath,
      })

      if (!initialState[id]) {
        initialState[id] = {}
      }

      initialState[id].formState = formStateResult

      if (node.type === 'block') {
        const currentFieldPreferences = context.preferences?.fields?.[context.field.name]
        const collapsedArray = currentFieldPreferences?.collapsed
        if (Array.isArray(collapsedArray) && collapsedArray.includes(id)) {
          initialState[id].collapsed = true
        }
      }
    }
  }
  return initialState
}
```

--------------------------------------------------------------------------------

---[FILE: createClientFeature.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/createClientFeature.ts

```typescript
import type { ClientConfig, RichTextFieldClient } from 'payload'

import type {
  BaseClientFeatureProps,
  ClientFeature,
  ClientFeatureProviderMap,
  FeatureProviderClient,
  FeatureProviderProviderClient,
  ResolvedClientFeatureMap,
} from '../features/typesClient.js'
import type { ClientEditorConfig } from '../lexical/config/types.js'
import type { FeatureClientSchemaMap } from '../types.js'

export type CreateClientFeatureArgs<UnSanitizedClientProps, ClientProps> =
  | ((props: {
      config: ClientConfig
      featureClientImportMap: Record<string, any>
      featureClientSchemaMap: FeatureClientSchemaMap
      /** unSanitizedEditorConfig.features, but mapped */
      featureProviderMap: ClientFeatureProviderMap
      field?: RichTextFieldClient
      props: BaseClientFeatureProps<UnSanitizedClientProps>
      // other resolved features, which have been loaded before this one. All features declared in 'dependencies' should be available here
      resolvedFeatures: ResolvedClientFeatureMap
      schemaPath: string
      // unSanitized EditorConfig,
      unSanitizedEditorConfig: ClientEditorConfig
    }) => ClientFeature<ClientProps>)
  | Omit<ClientFeature<ClientProps>, 'sanitizedClientFeatureProps'>

export const createClientFeature: <
  UnSanitizedClientProps = undefined,
  ClientProps = UnSanitizedClientProps,
>(
  args: CreateClientFeatureArgs<UnSanitizedClientProps, ClientProps>,
) => FeatureProviderProviderClient<UnSanitizedClientProps, ClientProps> = (feature) => {
  const featureProviderProvideClient: FeatureProviderProviderClient<any, any> = (props) => {
    const featureProviderClient: Partial<FeatureProviderClient<any, any>> = {
      clientFeatureProps: props,
    }

    if (typeof feature === 'function') {
      featureProviderClient.feature = ({
        config,
        featureClientImportMap,
        featureClientSchemaMap,
        featureProviderMap,
        field,
        resolvedFeatures,
        schemaPath,
        unSanitizedEditorConfig,
      }) => {
        const toReturn = feature({
          config,
          featureClientImportMap,
          featureClientSchemaMap,
          featureProviderMap,
          field,
          props,
          resolvedFeatures,
          schemaPath,
          unSanitizedEditorConfig,
        })

        if (toReturn.sanitizedClientFeatureProps === null) {
          toReturn.sanitizedClientFeatureProps = props
        }

        return toReturn
      }
    } else {
      // We have to spread feature here! Otherwise, if the arg of createClientFeature is not a function, and 2
      // richText editors have the same feature (even if both call it, e.g. both call UploadFeature()),
      // the second richText editor here will override sanitizedClientFeatureProps of the first feature, as both richText
      // editor features share the same reference to the feature object.
      // Example: richText editor 1 and 2 both have UploadFeature. richText editor 1 calls UploadFeature() with custom fields,
      // richText editor 2 calls UploadFeature() with NO custom fields. If we don't spread feature here, richText editor 1
      // will not have any custom fields, as richText editor 2 will override the feature object.
      const newFeature: ClientFeature<any> = { ...feature }
      newFeature.sanitizedClientFeatureProps = props
      featureProviderClient.feature = newFeature
    }
    return featureProviderClient as FeatureProviderClient<any, any>
  }

  return featureProviderProvideClient
}
```

--------------------------------------------------------------------------------

---[FILE: createServerFeature.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/createServerFeature.ts

```typescript
import type { SanitizedConfig } from 'payload'

import type {
  FeatureProviderProviderServer,
  FeatureProviderServer,
  ResolvedServerFeatureMap,
  ServerFeature,
  ServerFeatureProviderMap,
} from '../features/typesServer.js'
import type { ServerEditorConfig } from '../lexical/config/types.js'

export type CreateServerFeatureArgs<UnSanitizedProps, SanitizedProps, ClientProps> = {
  feature:
    | ((props: {
        config: SanitizedConfig
        /** unSanitizedEditorConfig.features, but mapped */
        featureProviderMap: ServerFeatureProviderMap
        isRoot?: boolean
        parentIsLocalized: boolean
        props: UnSanitizedProps
        // other resolved features, which have been loaded before this one. All features declared in 'dependencies' should be available here
        resolvedFeatures: ResolvedServerFeatureMap
        // unSanitized EditorConfig,
        unSanitizedEditorConfig: ServerEditorConfig
      }) =>
        | Promise<ServerFeature<SanitizedProps, ClientProps>>
        | ServerFeature<SanitizedProps, ClientProps>)
    | Omit<ServerFeature<SanitizedProps, ClientProps>, 'sanitizedServerFeatureProps'>
} & Pick<
  FeatureProviderServer<UnSanitizedProps, ClientProps>,
  'dependencies' | 'dependenciesPriority' | 'dependenciesSoft' | 'key'
>

export const createServerFeature: <
  UnSanitizedProps = undefined,
  SanitizedProps = UnSanitizedProps,
  ClientProps = undefined,
>(
  args: CreateServerFeatureArgs<UnSanitizedProps, SanitizedProps, ClientProps>,
) => FeatureProviderProviderServer<UnSanitizedProps, SanitizedProps, ClientProps> = ({
  dependencies,
  dependenciesPriority,
  dependenciesSoft,
  feature,
  key,
}) => {
  const featureProviderProviderServer: FeatureProviderProviderServer<any, any, any> = (props) => {
    const featureProviderServer: Partial<FeatureProviderServer<any, any, any>> = {
      dependencies,
      dependenciesPriority,
      dependenciesSoft,
      key,
      serverFeatureProps: props,
    }

    if (typeof feature === 'function') {
      featureProviderServer.feature = async ({
        config,
        featureProviderMap,
        isRoot,
        parentIsLocalized,
        resolvedFeatures,
        unSanitizedEditorConfig,
      }) => {
        const toReturn = await feature({
          config,
          featureProviderMap,
          isRoot,
          parentIsLocalized,
          props,
          resolvedFeatures,
          unSanitizedEditorConfig,
        })

        if (toReturn.sanitizedServerFeatureProps === null) {
          toReturn.sanitizedServerFeatureProps = props
        }
        return toReturn
      }
    } else {
      // For explanation why we have to spread feature, see createClientFeature.ts
      const newFeature: ServerFeature<any, any> = { ...feature }

      newFeature.sanitizedServerFeatureProps = props
      featureProviderServer.feature = newFeature
    }
    return featureProviderServer as FeatureProviderServer<any, any, any>
  }

  return featureProviderProviderServer
}
```

--------------------------------------------------------------------------------

---[FILE: editorConfigFactory.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/editorConfigFactory.ts

```typescript
import type { EditorConfig as LexicalEditorConfig } from 'lexical'
import type { RichTextAdapterProvider, RichTextField, SanitizedConfig } from 'payload'

import type { FeatureProviderServer, ResolvedServerFeatureMap } from '../features/typesServer.js'
import type { SanitizedServerEditorConfig } from '../lexical/config/types.js'
import type {
  FeaturesInput,
  LexicalRichTextAdapter,
  LexicalRichTextAdapterProvider,
} from '../types.js'

import { defaultEditorConfig, defaultEditorFeatures } from '../lexical/config/server/default.js'
import { loadFeatures } from '../lexical/config/server/loader.js'
import { sanitizeServerFeatures } from '../lexical/config/server/sanitize.js'
import { getDefaultSanitizedEditorConfig } from './getDefaultSanitizedEditorConfig.js'

export const editorConfigFactory = {
  default: async (args: {
    config: SanitizedConfig
    parentIsLocalized?: boolean
  }): Promise<SanitizedServerEditorConfig> => {
    return getDefaultSanitizedEditorConfig({
      config: args.config,
      parentIsLocalized: args.parentIsLocalized ?? false,
    })
  },
  /**
   * If you have instantiated a lexical editor and are accessing it outside a field (=> this is the unsanitized editor),
   * you can extract the editor config from it.
   * This is common if you define the editor in a re-usable module scope variable and pass it to the richText field.
   *
   * This is the least efficient way to get the editor config, and not recommended. It is recommended to extract the `features` arg
   * into a separate variable and use `fromFeatures` instead.
   */
  fromEditor: async (args: {
    config: SanitizedConfig
    editor: LexicalRichTextAdapterProvider
    isRoot?: boolean
    lexical?: LexicalEditorConfig
    parentIsLocalized?: boolean
  }): Promise<SanitizedServerEditorConfig> => {
    const lexicalAdapter: LexicalRichTextAdapter = await args.editor({
      config: args.config,
      isRoot: args.isRoot ?? false,
      parentIsLocalized: args.parentIsLocalized ?? false,
    })

    const sanitizedServerEditorConfig: SanitizedServerEditorConfig = lexicalAdapter.editorConfig
    return sanitizedServerEditorConfig
  },
  /**
   * Create a new editor config - behaves just like instantiating a new `lexicalEditor`
   */
  fromFeatures: async (args: {
    config: SanitizedConfig
    features?: FeaturesInput
    isRoot?: boolean
    lexical?: LexicalEditorConfig
    parentIsLocalized?: boolean
  }): Promise<SanitizedServerEditorConfig> => {
    return (await featuresInputToEditorConfig(args)).sanitizedConfig
  },
  fromField: (args: { field: RichTextField }): SanitizedServerEditorConfig => {
    const lexicalAdapter: LexicalRichTextAdapter = args.field.editor as LexicalRichTextAdapter

    const sanitizedServerEditorConfig: SanitizedServerEditorConfig = lexicalAdapter.editorConfig
    return sanitizedServerEditorConfig
  },
  fromUnsanitizedField: async (args: {
    config: SanitizedConfig
    field: RichTextField
    isRoot?: boolean
    parentIsLocalized?: boolean
  }): Promise<SanitizedServerEditorConfig> => {
    const lexicalAdapterProvider: RichTextAdapterProvider = args.field
      .editor as RichTextAdapterProvider

    const lexicalAdapter: LexicalRichTextAdapter = (await lexicalAdapterProvider({
      config: args.config,
      isRoot: args.isRoot ?? false,
      parentIsLocalized: args.parentIsLocalized ?? false,
    })) as LexicalRichTextAdapter

    const sanitizedServerEditorConfig: SanitizedServerEditorConfig = lexicalAdapter.editorConfig
    return sanitizedServerEditorConfig
  },
}

export const featuresInputToEditorConfig = async (args: {
  config: SanitizedConfig
  features?: FeaturesInput
  isRoot?: boolean
  lexical?: LexicalEditorConfig
  parentIsLocalized?: boolean
}): Promise<{
  features: FeatureProviderServer<unknown, unknown, unknown>[]
  resolvedFeatureMap: ResolvedServerFeatureMap
  sanitizedConfig: SanitizedServerEditorConfig
}> => {
  let features: FeatureProviderServer<unknown, unknown, unknown>[] = []
  if (args.features && typeof args.features === 'function') {
    const rootEditor = args.config.editor
    let rootEditorFeatures: FeatureProviderServer<unknown, unknown, unknown>[] = []
    if (typeof rootEditor === 'object' && 'features' in rootEditor) {
      rootEditorFeatures = (rootEditor as LexicalRichTextAdapter).features
    }
    features = args.features({
      defaultFeatures: defaultEditorFeatures,
      rootFeatures: rootEditorFeatures,
    })
  } else {
    features = args.features as FeatureProviderServer<unknown, unknown, unknown>[]
  }

  if (!features) {
    features = defaultEditorFeatures
  }

  const lexical = args.lexical ?? defaultEditorConfig.lexical

  const resolvedFeatureMap = await loadFeatures({
    config: args.config,
    isRoot: args.isRoot ?? false,
    parentIsLocalized: args.parentIsLocalized ?? false,
    unSanitizedEditorConfig: {
      features,
      lexical,
    },
  })

  return {
    features,
    resolvedFeatureMap,
    sanitizedConfig: {
      features: sanitizeServerFeatures(resolvedFeatureMap),
      lexical: args.lexical,
      resolvedFeatureMap,
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: forEachNodeRecursively.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/forEachNodeRecursively.ts

```typescript
import type { SerializedLexicalNode } from 'lexical'

export function recurseNodes({
  callback,
  nodes,
}: {
  callback: (node: SerializedLexicalNode) => void
  nodes: SerializedLexicalNode[]
}) {
  for (const node of nodes) {
    callback(node)

    if ('children' in node && Array.isArray(node?.children) && node?.children?.length) {
      recurseNodes({ callback, nodes: node.children as SerializedLexicalNode[] })
    }
  }
}

export async function recurseNodesAsync({
  callback,
  nodes,
}: {
  callback: (node: SerializedLexicalNode) => Promise<void>
  nodes: SerializedLexicalNode[]
}) {
  for (const node of nodes) {
    await callback(node)

    if ('children' in node && Array.isArray(node?.children) && node?.children?.length) {
      await recurseNodesAsync({ callback, nodes: node.children as SerializedLexicalNode[] })
    }
  }
}
```

--------------------------------------------------------------------------------

````
