---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 302
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 302 of 695)

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
Location: payload-main/packages/richtext-slate/src/index.tsx

```typescript
import type { Config, RichTextAdapterProvider } from 'payload'

import { sanitizeFields, withNullableJSONSchemaType } from 'payload'

import type { AdapterArguments } from './types.js'

import { richTextRelationshipPromise } from './data/richTextRelationshipPromise.js'
import { richTextValidate } from './data/validation.js'
import { elements as elementTypes } from './field/elements/index.js'
import { transformExtraFields } from './field/elements/link/utilities.js'
import { defaultLeaves as leafTypes } from './field/leaves/index.js'
import { getGenerateSchemaMap } from './generateSchemaMap.js'

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export function slateEditor(
  args: AdapterArguments,
): RichTextAdapterProvider<any[], AdapterArguments, any> {
  return async ({ config }) => {
    const validRelationships = config.collections.map((c) => c.slug) || []

    if (!args.admin) {
      args.admin = {}
    }
    if (!args.admin.link) {
      args.admin.link = {}
    }
    if (!args.admin.link.fields) {
      args.admin.link.fields = []
    }
    args.admin.link.fields = await sanitizeFields({
      config: config as unknown as Config,
      fields: transformExtraFields(args.admin?.link?.fields, config),
      parentIsLocalized: false,
      validRelationships,
    })

    if (args?.admin?.upload?.collections) {
      for (const collection of Object.keys(args.admin.upload.collections)) {
        if (args?.admin?.upload?.collections[collection]?.fields) {
          args.admin.upload.collections[collection].fields = await sanitizeFields({
            config: config as unknown as Config,
            fields: args.admin?.upload?.collections[collection]?.fields,
            parentIsLocalized: false,
            validRelationships,
          })
        }
      }
    }

    return {
      CellComponent: '@payloadcms/richtext-slate/rsc#RscEntrySlateCell',
      FieldComponent: {
        path: '@payloadcms/richtext-slate/rsc#RscEntrySlateField',
        serverProps: {
          args,
        },
      },
      generateImportMap: ({ addToImportMap }) => {
        addToImportMap('@payloadcms/richtext-slate/rsc#RscEntrySlateCell')
        addToImportMap('@payloadcms/richtext-slate/rsc#RscEntrySlateField')
        Object.values(leafTypes).forEach((leaf) => {
          if (leaf.Button) {
            addToImportMap(leaf.Button)
          }
          if (leaf.Leaf) {
            addToImportMap(leaf.Leaf)
          }
          if (Array.isArray(leaf.plugins) && leaf.plugins?.length) {
            addToImportMap(leaf.plugins)
          }
        })
        args?.admin?.leaves?.forEach((leaf) => {
          if (typeof leaf === 'object') {
            if (leaf.Button) {
              addToImportMap(leaf.Button)
            }
            if (leaf.Leaf) {
              addToImportMap(leaf.Leaf)
            }
            if (Array.isArray(leaf.plugins) && leaf.plugins?.length) {
              addToImportMap(leaf.plugins)
            }
          }
        })

        Object.values(elementTypes).forEach((element) => {
          if (element.Button) {
            addToImportMap(element.Button)
          }
          if (element.Element) {
            addToImportMap(element.Element)
          }
          if (Array.isArray(element.plugins) && element.plugins?.length) {
            addToImportMap(element.plugins)
          }
        })

        args?.admin?.elements?.forEach((element) => {
          if (typeof element === 'object') {
            if (element.Button) {
              addToImportMap(element.Button)
            }
            if (element.Element) {
              addToImportMap(element.Element)
            }
            if (Array.isArray(element.plugins) && element.plugins?.length) {
              addToImportMap(element.plugins)
            }
          }
        })
      },
      generateSchemaMap: getGenerateSchemaMap(args),
      graphQLPopulationPromises({
        context,
        currentDepth,
        depth,
        draft,
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
      }) {
        if (
          field.admin?.elements?.includes('relationship') ||
          field.admin?.elements?.includes('upload') ||
          field.admin?.elements?.includes('link') ||
          !field?.admin?.elements
        ) {
          richTextRelationshipPromise({
            context,
            currentDepth,
            depth,
            draft,
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
          })
        }
      },
      hooks: {
        afterRead: [
          ({
            context: _context,
            currentDepth,
            depth,
            draft,
            field: _field,
            fieldPromises,
            findMany,
            flattenLocales,
            overrideAccess,
            parentIsLocalized,
            populate,
            populationPromises,
            req,
            showHiddenFields,
            siblingData,
          }) => {
            const context: any = _context
            const field = _field as any
            if (
              field.admin?.elements?.includes('relationship') ||
              field.admin?.elements?.includes('upload') ||
              field.admin?.elements?.includes('link') ||
              !field?.admin?.elements
            ) {
              richTextRelationshipPromise({
                context,
                currentDepth,
                depth,
                draft,
                field,
                fieldPromises,
                findMany,
                flattenLocales,
                overrideAccess,
                parentIsLocalized,
                populateArg: populate,
                populationPromises,
                req,
                showHiddenFields,
                siblingDoc: siblingData,
              })
            }
          },
        ],
      },
      outputSchema: ({ isRequired }) => {
        return {
          type: withNullableJSONSchemaType('array', isRequired),
          items: {
            type: 'object',
          },
        }
      },
      validate: richTextValidate,
    }
  }
}

export type {
  AdapterArguments,
  ElementNode,
  RichTextCustomElement,
  RichTextCustomLeaf,
  RichTextElement,
  RichTextLeaf,
  RichTextPlugin,
  RichTextPluginComponent,
  SlateFieldProps,
  TextNode,
} from './types.js'

export { nodeIsTextNode } from './types.js'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/richtext-slate/src/types.ts

```typescript
import type {
  ClientField,
  Field,
  PayloadComponent,
  RichTextFieldClientProps,
  SanitizedConfig,
} from 'payload'
import type { Editor } from 'slate'

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export type TextNode = { [x: string]: unknown; text: string }

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export type ElementNode = { children: (ElementNode | TextNode)[]; type?: string }

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export function nodeIsTextNode(node: ElementNode | TextNode): node is TextNode {
  return 'text' in node
}

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export type RichTextPluginComponent = PayloadComponent

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export type RichTextPlugin = (editor: Editor) => Editor

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export type RichTextCustomElement = {
  Button?: PayloadComponent
  Element: PayloadComponent
  name: string
  plugins?: RichTextPluginComponent[]
}

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export type RichTextCustomLeaf = {
  Button: PayloadComponent
  Leaf: PayloadComponent
  name: string
  plugins?: RichTextPluginComponent[]
}

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export type RichTextElement =
  | 'blockquote'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'indent'
  | 'li'
  | 'link'
  | 'ol'
  | 'relationship'
  | 'textAlign'
  | 'ul'
  | 'upload'
  | RichTextCustomElement

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export type RichTextLeaf =
  | 'bold'
  | 'code'
  | 'italic'
  | 'strikethrough'
  | 'underline'
  | RichTextCustomLeaf

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export type AdapterArguments = {
  admin?: {
    elements?: RichTextElement[]
    hideGutter?: boolean
    leaves?: RichTextLeaf[]
    link?: {
      fields?: ((args: { config: SanitizedConfig; defaultFields: Field[] }) => Field[]) | Field[]
    }
    placeholder?: Record<string, string> | string
    rtl?: boolean
    upload?: {
      collections: {
        [collection: string]: {
          fields: Field[]
        }
      }
    }
  }
}

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export type SlateFieldProps = {
  componentMap: {
    [x: string]: ClientField[] | React.ReactNode
  }
} & RichTextFieldClientProps<any[], AdapterArguments, AdapterArguments>
```

--------------------------------------------------------------------------------

---[FILE: rscEntry.tsx]---
Location: payload-main/packages/richtext-slate/src/cell/rscEntry.tsx
Signals: React

```typescript
import type { DefaultServerCellComponentProps, Payload } from 'payload'

import { getTranslation, type I18nClient } from '@payloadcms/translations'
import { Link } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

/**
 * @deprecated - slate will be removed in 4.0. Please [migrate our new, lexical-based rich text editor](https://payloadcms.com/docs/rich-text/migration#migrating-from-slate).
 */
export const RscEntrySlateCell: React.FC<
  {
    i18n: I18nClient
    payload: Payload
  } & DefaultServerCellComponentProps
> = (props) => {
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

  let textContent = ''

  if (cellData) {
    textContent = cellData?.map((i) => i?.children?.map((c) => c.text)).join(' ')
  }

  if (!cellData || !textContent?.length) {
    textContent = i18n.t('general:noLabel', {
      label: getTranslation(('label' in field ? field.label : null) || 'data', i18n),
    })
  }

  return <WrapElement {...wrapElementProps}>{textContent}</WrapElement>
}
```

--------------------------------------------------------------------------------

---[FILE: defaultValue.ts]---
Location: payload-main/packages/richtext-slate/src/data/defaultValue.ts

```typescript
export const defaultRichTextValue = [
  {
    children: [{ text: '' }],
  },
]
```

--------------------------------------------------------------------------------

---[FILE: populate.ts]---
Location: payload-main/packages/richtext-slate/src/data/populate.ts

```typescript
import type { Collection, Field, PayloadRequest, RichTextField, SelectType } from 'payload'

import { createDataloaderCacheKey } from 'payload'

import type { AdapterArguments } from '../types.js'

type Arguments = {
  currentDepth?: number
  data: unknown
  depth: number
  draft: boolean
  field: RichTextField<any[], AdapterArguments, AdapterArguments>
  key: number | string
  overrideAccess?: boolean
  req: PayloadRequest
  select?: SelectType
  showHiddenFields: boolean
}

export const populate = async ({
  id,
  collection,
  currentDepth,
  data,
  depth,
  draft,
  key,
  overrideAccess,
  req,
  select,
  showHiddenFields,
}: {
  collection: Collection
  field: Field
  id: string
} & Omit<Arguments, 'field'>): Promise<void> => {
  const dataRef = data as Record<string, unknown>

  const doc = await req.payloadDataLoader.load(
    createDataloaderCacheKey({
      collectionSlug: collection.config.slug,
      currentDepth: currentDepth + 1,
      depth,
      docID: id,
      draft,
      fallbackLocale: req.fallbackLocale,
      locale: req.locale,
      overrideAccess: typeof overrideAccess === 'undefined' ? false : overrideAccess,
      select,
      showHiddenFields,
      transactionID: req.transactionID,
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

---[FILE: recurseNestedFields.ts]---
Location: payload-main/packages/richtext-slate/src/data/recurseNestedFields.ts

```typescript
import type { Field, FlattenedBlock, PayloadRequest, PopulateType } from 'payload'

import { fieldAffectsData, fieldHasSubFields, fieldIsArrayType, tabHasName } from 'payload/shared'

import { populate } from './populate.js'
import { recurseRichText } from './richTextRelationshipPromise.js'

type NestedRichTextFieldsArgs = {
  currentDepth?: number
  data: unknown
  depth: number
  draft: boolean
  fields: Field[]
  overrideAccess: boolean
  populateArg?: PopulateType
  populationPromises: Promise<void>[]
  req: PayloadRequest
  showHiddenFields: boolean
}

export const recurseNestedFields = ({
  currentDepth = 0,
  data,
  depth,
  draft,
  fields,
  overrideAccess = false,
  populateArg,
  populationPromises,
  req,
  showHiddenFields,
}: NestedRichTextFieldsArgs): void => {
  fields.forEach((field) => {
    if (field.type === 'relationship' || field.type === 'upload') {
      if (field.type === 'relationship') {
        if (field.hasMany && Array.isArray(data[field.name])) {
          if (Array.isArray(field.relationTo)) {
            data[field.name].forEach(({ relationTo, value }, i) => {
              const collection = req.payload.collections[relationTo]
              if (collection) {
                populationPromises.push(
                  populate({
                    id: value,
                    collection,
                    currentDepth,
                    data: data[field.name],
                    depth,
                    draft,
                    field,
                    key: i,
                    overrideAccess,
                    req,
                    select:
                      populateArg?.[collection.config.slug] ?? collection.config.defaultPopulate,
                    showHiddenFields,
                  }),
                )
              }
            })
          } else {
            data[field.name].forEach((id, i) => {
              const collection = req.payload.collections[field.relationTo as string]
              if (collection) {
                populationPromises.push(
                  populate({
                    id,
                    collection,
                    currentDepth,
                    data: data[field.name],
                    depth,
                    draft,
                    field,
                    key: i,
                    overrideAccess,
                    req,
                    select:
                      populateArg?.[collection.config.slug] ?? collection.config.defaultPopulate,
                    showHiddenFields,
                  }),
                )
              }
            })
          }
        } else if (
          Array.isArray(field.relationTo) &&
          data[field.name]?.value &&
          data[field.name]?.relationTo
        ) {
          if (!('hasMany' in field) || !field.hasMany) {
            const collection = req.payload.collections[data[field.name].relationTo]
            populationPromises.push(
              populate({
                id: data[field.name].value,
                collection,
                currentDepth,
                data: data[field.name],
                depth,
                draft,
                field,
                key: 'value',
                overrideAccess,
                req,
                select: populateArg?.[collection.config.slug] ?? collection.config.defaultPopulate,
                showHiddenFields,
              }),
            )
          }
        }
      }
      if (typeof data[field.name] !== 'undefined' && typeof field.relationTo === 'string') {
        const collection = req.payload.collections[field.relationTo]
        populationPromises.push(
          populate({
            id: data[field.name],
            collection,
            currentDepth,
            data,
            depth,
            draft,
            field,
            key: field.name,
            overrideAccess,
            req,
            select: populateArg?.[collection.config.slug] ?? collection.config.defaultPopulate,
            showHiddenFields,
          }),
        )
      }
    } else if (fieldHasSubFields(field) && !fieldIsArrayType(field)) {
      if (fieldAffectsData(field) && typeof data[field.name] === 'object') {
        recurseNestedFields({
          currentDepth,
          data: data[field.name],
          depth,
          draft,
          fields: field.fields,
          overrideAccess,
          populateArg,
          populationPromises,
          req,
          showHiddenFields,
        })
      } else {
        recurseNestedFields({
          currentDepth,
          data,
          depth,
          draft,
          fields: field.fields,
          overrideAccess,
          populateArg,
          populationPromises,
          req,
          showHiddenFields,
        })
      }
    } else if (field.type === 'tabs') {
      field.tabs.forEach((tab) => {
        recurseNestedFields({
          currentDepth,
          data: tabHasName(tab) ? data[tab.name] : data,
          depth,
          draft,
          fields: tab.fields,
          overrideAccess,
          populateArg,
          populationPromises,
          req,
          showHiddenFields,
        })
      })
    } else if (Array.isArray(data[field.name])) {
      if (field.type === 'blocks') {
        data[field.name].forEach((row, i) => {
          const block =
            req.payload.blocks[row?.blockType] ??
            ((field.blockReferences ?? field.blocks).find(
              (block) => typeof block !== 'string' && block.slug === row?.blockType,
            ) as FlattenedBlock | undefined)
          if (block) {
            recurseNestedFields({
              currentDepth,
              data: data[field.name][i],
              depth,
              draft,
              fields: block.fields,
              overrideAccess,
              populateArg,
              populationPromises,
              req,
              showHiddenFields,
            })
          }
        })
      }

      if (field.type === 'array') {
        data[field.name].forEach((_, i) => {
          recurseNestedFields({
            currentDepth,
            data: data[field.name][i],
            depth,
            draft,
            fields: field.fields,
            overrideAccess,
            populateArg,
            populationPromises,
            req,
            showHiddenFields,
          })
        })
      }
    }

    if (field.type === 'richText' && Array.isArray(data[field.name])) {
      data[field.name].forEach((node) => {
        if (Array.isArray(node.children)) {
          recurseRichText({
            children: node.children,
            currentDepth,
            depth,
            draft,
            field,
            overrideAccess,
            populationPromises,
            req,
            showHiddenFields,
          })
        }
      })
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: richTextRelationshipPromise.ts]---
Location: payload-main/packages/richtext-slate/src/data/richTextRelationshipPromise.ts

```typescript
import type {
  CollectionConfig,
  PayloadRequest,
  PopulateType,
  RichTextAdapter,
  RichTextField,
} from 'payload'

import type { AdapterArguments } from '../types.js'

import { populate } from './populate.js'
import { recurseNestedFields } from './recurseNestedFields.js'

export type Args = Parameters<
  RichTextAdapter<any[], AdapterArguments>['graphQLPopulationPromises']
>[0]

type RecurseRichTextArgs = {
  children: unknown[]
  currentDepth: number
  depth: number
  draft: boolean
  field: RichTextField<any[], any, any>
  overrideAccess: boolean
  populateArg?: PopulateType
  populationPromises: Promise<void>[]
  req: PayloadRequest
  showHiddenFields: boolean
}

export const recurseRichText = ({
  children,
  currentDepth = 0,
  depth,
  draft,
  field,
  overrideAccess = false,
  populateArg,
  populationPromises,
  req,
  showHiddenFields,
}: RecurseRichTextArgs): void => {
  if (depth <= 0 || currentDepth > depth) {
    return
  }

  if (Array.isArray(children)) {
    ;(children as any[]).forEach((element) => {
      if ((element.type === 'relationship' || element.type === 'upload') && element?.value?.id) {
        const collection = req.payload.collections[element?.relationTo]

        if (collection) {
          populationPromises.push(
            populate({
              id: element.value.id,
              collection,
              currentDepth,
              data: element,
              depth,
              draft,
              field,
              key: 'value',
              overrideAccess,
              req,
              select:
                req.payloadAPI !== 'GraphQL'
                  ? (populateArg?.[collection.config.slug] ?? collection.config.defaultPopulate)
                  : undefined,
              showHiddenFields,
            }),
          )
        }
        if (
          element.type === 'upload' &&
          Array.isArray(field.admin?.upload?.collections?.[element?.relationTo]?.fields)
        ) {
          recurseNestedFields({
            currentDepth,
            data: element.fields || {},
            depth,
            draft,
            fields: field.admin.upload.collections[element.relationTo].fields,
            overrideAccess,
            populateArg,
            populationPromises,
            req,
            showHiddenFields,
          })
        }
      }

      if (element.type === 'link') {
        if (element?.doc?.value && element?.doc?.relationTo) {
          const collection = req.payload.collections[element?.doc?.relationTo]

          if (collection) {
            populationPromises.push(
              populate({
                id: element.doc.value,
                collection,
                currentDepth,
                data: element.doc,
                depth,
                draft,
                field,
                key: 'value',
                overrideAccess,
                req,
                select:
                  req.payloadAPI !== 'GraphQL'
                    ? (populateArg?.[collection.config.slug] ?? collection.config.defaultPopulate)
                    : undefined,
                showHiddenFields,
              }),
            )
          }
        }

        if (Array.isArray(field.admin?.link?.fields)) {
          recurseNestedFields({
            currentDepth,
            data: element.fields || {},
            depth,
            draft,
            fields: field.admin?.link?.fields,
            overrideAccess,
            populateArg,
            populationPromises,
            req,
            showHiddenFields,
          })
        }
      }

      if (element?.children) {
        recurseRichText({
          children: element.children,
          currentDepth,
          depth,
          draft,
          field,
          overrideAccess,
          populateArg,
          populationPromises,
          req,
          showHiddenFields,
        })
      }
    })
  }
}

export const richTextRelationshipPromise = ({
  currentDepth,
  depth,
  draft,
  field,
  overrideAccess,
  parentIsLocalized,
  populateArg,
  populationPromises,
  req,
  showHiddenFields,
  siblingDoc,
}: Args) => {
  recurseRichText({
    children: siblingDoc[field.name] as unknown[],
    currentDepth,
    depth,
    draft,
    field,
    overrideAccess,
    populateArg,
    populationPromises,
    req,
    showHiddenFields,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: validation.ts]---
Location: payload-main/packages/richtext-slate/src/data/validation.ts

```typescript
import type { RichTextField, Validate } from 'payload'

import type { AdapterArguments } from '../types.js'

import { defaultRichTextValue } from './defaultValue.js'

export const richTextValidate: Validate<
  unknown[],
  unknown,
  RichTextField<any[], AdapterArguments>,
  RichTextField<any[], AdapterArguments>
> = (value, { req, required }) => {
  const { t } = req
  if (required) {
    const stringifiedDefaultValue = JSON.stringify(defaultRichTextValue)
    if (value && JSON.stringify(value) !== stringifiedDefaultValue) {
      return true
    }
    return t('validation:required')
  }

  return true
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-slate/src/exports/client/index.ts

```typescript
'use client'

export { BlockquoteElementButton } from '../../field/elements/blockquote/Button.js'
export { BlockquoteElement } from '../../field/elements/blockquote/Element.js'
export { ElementButton } from '../../field/elements/Button.js'
export { H1ElementButton } from '../../field/elements/h1/Button.js'
export { Heading1Element } from '../../field/elements/h1/Heading1.js'
export { H2ElementButton } from '../../field/elements/h2/Button.js'
export { Heading2Element } from '../../field/elements/h2/Heading2.js'
export { H3ElementButton } from '../../field/elements/h3/Button.js'
export { Heading3Element } from '../../field/elements/h3/Heading3.js'
export { H4ElementButton } from '../../field/elements/h4/Button.js'
export { Heading4Element } from '../../field/elements/h4/Heading4.js'
export { H5ElementButton } from '../../field/elements/h5/Button.js'

export { Heading5Element } from '../../field/elements/h5/Heading5.js'
export { H6ElementButton } from '../../field/elements/h6/Button.js'

export { Heading6Element } from '../../field/elements/h6/Heading6.js'

export { IndentButton } from '../../field/elements/indent/Button.js'
export { IndentElement } from '../../field/elements/indent/Element.js'
export { ListItemElement } from '../../field/elements/li/ListItem.js'

export { LinkButton } from '../../field/elements/link/Button/index.js'

export { LinkElement } from '../../field/elements/link/Element/index.js'

export { WithLinks } from '../../field/elements/link/WithLinks.js'
export { OLElementButton } from '../../field/elements/ol/Button.js'
export { OrderedListElement } from '../../field/elements/ol/OrderedList.js'

export { RelationshipButton } from '../../field/elements/relationship/Button/index.js'

export { RelationshipElement } from '../../field/elements/relationship/Element/index.js'
export { WithRelationship } from '../../field/elements/relationship/plugin.js'

export { TextAlignElementButton } from '../../field/elements/textAlign/Button.js'
export { toggleElement } from '../../field/elements/toggle.js'
export { ULElementButton } from '../../field/elements/ul/Button.js'
export { UnorderedListElement } from '../../field/elements/ul/UnorderedList.js'
export { UploadElementButton } from '../../field/elements/upload/Button/index.js'
export { UploadElement } from '../../field/elements/upload/Element/index.js'
export { WithUpload } from '../../field/elements/upload/plugin.js'
export { RichTextField } from '../../field/index.js'
export { BoldLeaf } from '../../field/leaves/bold/Bold/index.js'
export { BoldLeafButton } from '../../field/leaves/bold/LeafButton.js'

export { LeafButton } from '../../field/leaves/Button.js'

export { CodeLeaf } from '../../field/leaves/code/Code/index.js'

export { CodeLeafButton } from '../../field/leaves/code/LeafButton.js'

export { ItalicLeaf } from '../../field/leaves/italic/Italic/index.js'
export { ItalicLeafButton } from '../../field/leaves/italic/LeafButton.js'

export { StrikethroughLeafButton } from '../../field/leaves/strikethrough/LeafButton.js'
export { StrikethroughLeaf } from '../../field/leaves/strikethrough/Strikethrough/index.js'

export { UnderlineLeafButton } from '../../field/leaves/underline/LeafButton.js'
export { UnderlineLeaf } from '../../field/leaves/underline/Underline/index.js'

export { useElementButton } from '../../field/providers/ElementButtonProvider.js'
export { useElement } from '../../field/providers/ElementProvider.js'
export { useLeafButton } from '../../field/providers/LeafButtonProvider.js'
export { useLeaf } from '../../field/providers/LeafProvider.js'
export { useSlatePlugin } from '../../utilities/useSlatePlugin.js'
```

--------------------------------------------------------------------------------

---[FILE: rsc.ts]---
Location: payload-main/packages/richtext-slate/src/exports/server/rsc.ts

```typescript
export { RscEntrySlateCell } from '../../cell/rscEntry.js'
export { RscEntrySlateField } from '../../field/rscEntry.js'
```

--------------------------------------------------------------------------------

---[FILE: buttons.scss]---
Location: payload-main/packages/richtext-slate/src/field/buttons.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .rich-text__button {
    position: relative;
    cursor: pointer;

    svg {
      width: base(0.75);
      height: base(0.75);
    }

    &--disabled {
      opacity: 0.4;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: createFeatureMap.ts]---
Location: payload-main/packages/richtext-slate/src/field/createFeatureMap.ts

```typescript
import type { ClientField } from 'payload'

import type { EnabledFeatures } from './types.js'

export const createFeatureMap = (
  richTextComponentMap: Map<string, ClientField[] | React.ReactNode>,
): EnabledFeatures => {
  const features: EnabledFeatures = {
    elements: {},
    leaves: {},
    plugins: [],
  }

  for (const [key, value] of richTextComponentMap) {
    if (Array.isArray(value)) {
      continue // We only wanna process react nodes here
    }
    if (key.startsWith('leaf.button') || key.startsWith('leaf.component.')) {
      const leafName = key.replace('leaf.button.', '').replace('leaf.component.', '')

      if (!features.leaves[leafName]) {
        features.leaves[leafName] = {
          name: leafName,
          Button: null,
          Leaf: null,
        }
      }

      if (key.startsWith('leaf.button.')) {
        features.leaves[leafName].Button = value
      }
      if (key.startsWith('leaf.component.')) {
        features.leaves[leafName].Leaf = value
      }
    }

    if (key.startsWith('element.button.') || key.startsWith('element.component.')) {
      const elementName = key.replace('element.button.', '').replace('element.component.', '')

      if (!features.elements[elementName]) {
        features.elements[elementName] = {
          name: elementName,
          Button: null,
          Element: null,
        }
      }

      if (key.startsWith('element.button.')) {
        features.elements[elementName].Button = value
      }
      if (key.startsWith('element.component.')) {
        features.elements[elementName].Element = value
      }
    }

    if (key.startsWith('leaf.plugin.') || key.startsWith('element.plugin.')) {
      features.plugins.push(value)
    }
  }

  return features
}
```

--------------------------------------------------------------------------------

---[FILE: hotkeys.tsx]---
Location: payload-main/packages/richtext-slate/src/field/hotkeys.tsx

```typescript
export const hotkeys = {
  'mod+`': 'code',
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-slate/src/field/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .rich-text {
    margin-bottom: base(2);
    display: flex;
    flex-direction: column;
    isolation: isolate;

    &__toolbar {
      @include blur-bg(var(--theme-elevation-0));
      margin-bottom: $baseline;
      border: $style-stroke-width-s solid var(--theme-elevation-150);
      position: sticky;
      z-index: 1;
      top: var(--doc-controls-height);
    }

    &__toolbar-wrap {
      padding: base(0.25);
      display: flex;
      flex-wrap: wrap;
      align-items: stretch;
      position: relative;
      z-index: 1;

      &:after {
        content: ' ';
        opacity: 0.8;
        position: absolute;
        top: calc(100% + 1px);
        background: linear-gradient(var(--theme-elevation-0), transparent);
        display: block;
        left: -1px;
        right: -1px;
        height: base(1);
      }
    }

    &__editor {
      font-family: var(--font-serif);
      font-size: base(0.8);
      line-height: 1.5;

      *[data-slate-node='element'] {
        margin-top: 0.75em;
        position: relative;
        line-height: 1.5;
        letter-spacing: normal;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: 700;
        letter-spacing: normal;
      }

      h1[data-slate-node='element'] {
        font-size: base(1.4);
        margin-block: 0.5em 0.4em;
        line-height: base(1.2);
        letter-spacing: normal;
      }

      h2[data-slate-node='element'] {
        font-size: base(1.25);
        margin-block: 0.55em 0.4em;
        line-height: base(1.2);
        letter-spacing: normal;
      }

      h3[data-slate-node='element'] {
        font-size: base(1.1);
        margin-block: 0.6em 0.4em;
        line-height: base(1.3);
        letter-spacing: normal;
      }

      h4[data-slate-node='element'] {
        font-size: base(1);
        margin-block: 0.65em 0.4em;
        line-height: base(1.4);
        letter-spacing: normal;
      }

      h5[data-slate-node='element'] {
        font-size: base(0.9);
        margin-block: 0.7em 0.4em;
        line-height: base(1.5);
        letter-spacing: normal;
      }

      h6[data-slate-node='element'] {
        font-size: base(0.8);
        margin-block: 0.75em 0.4em;
        line-height: base(1.5);
      }
    }

    &--gutter {
      .rich-text__editor {
        padding-left: $baseline;
        border-left: 1px solid var(--theme-elevation-100);
      }
    }

    &__input {
      min-height: base(10);
    }

    &__wrap {
      width: 100%;
      position: relative;
    }

    &__wrapper {
      width: 100%;
    }

    &--read-only {
      .rich-text__editor {
        background: var(--theme-elevation-200);
        color: var(--theme-elevation-450);
        padding: base(0.5);

        .popup button {
          display: none;
        }
      }

      .rich-text__toolbar {
        pointer-events: none;
        position: relative;
        top: 0;

        &::after {
          content: ' ';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--theme-elevation-200);
          opacity: 0.85;
          z-index: 2;
          backdrop-filter: unset;
        }
      }
    }

    &__button {
      @extend %btn-reset;
      padding: base(0.25);

      svg {
        @include color-svg(var(--theme-elevation-800));
        width: base(0.75);
        height: base(0.75);
      }

      &:hover {
        background-color: var(--theme-elevation-100);
      }

      &__button--active,
      &__button--active:hover {
        background-color: var(--theme-elevation-150);
      }
    }

    &__drawerIsOpen {
      top: base(1);
    }

    @include mid-break {
      &__toolbar {
        top: base(3);
      }

      &__drawerIsOpen {
        top: base(1);
      }
    }
  }

  [data-slate-node='element'] {
    margin-bottom: base(0.25);
  }

  html[data-theme='light'] {
    .rich-text {
      &.error {
        .rich-text__editor,
        .rich-text__toolbar {
          @include lightInputError;
        }
      }
    }
  }

  html[data-theme='dark'] {
    .rich-text {
      &.error {
        .rich-text__editor,
        .rich-text__toolbar {
          @include darkInputError;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
