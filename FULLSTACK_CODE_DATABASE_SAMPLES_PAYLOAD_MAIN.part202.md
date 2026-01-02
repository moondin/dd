---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 202
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 202 of 695)

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
Location: payload-main/packages/payload/src/fields/hooks/afterChange/index.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../../../globals/config/types.js'
import type { RequestContext } from '../../../index.js'
import type { JsonObject, PayloadRequest } from '../../../types/index.js'

import { traverseFields } from './traverseFields.js'

type Args<T extends JsonObject> = {
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  /**
   * The data before hooks
   */
  data: T
  /**
   * The data after hooks
   */
  doc: T
  global: null | SanitizedGlobalConfig
  operation: 'create' | 'update'
  previousDoc: T
  req: PayloadRequest
}

/**
 * This function is responsible for the following actions, in order:
 * - Execute field hooks
 */
export const afterChange = async <T extends JsonObject>({
  collection,
  context,
  data,
  doc: incomingDoc,
  global,
  operation,
  previousDoc,
  req,
}: Args<T>): Promise<T> => {
  await traverseFields({
    collection,
    context,
    data,
    doc: incomingDoc,
    fields: (collection?.fields || global?.fields)!,
    global,
    operation,
    parentIndexPath: '',
    parentIsLocalized: false,
    parentPath: '',
    parentSchemaPath: '',
    previousDoc,
    previousSiblingDoc: previousDoc,
    req,
    siblingData: data,
    siblingDoc: incomingDoc,
  })

  return incomingDoc
}
```

--------------------------------------------------------------------------------

---[FILE: promise.ts]---
Location: payload-main/packages/payload/src/fields/hooks/afterChange/promise.ts

```typescript
import type { RichTextAdapter } from '../../../admin/RichText.js'
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../../../globals/config/types.js'
import type { RequestContext } from '../../../index.js'
import type { JsonObject, PayloadRequest } from '../../../types/index.js'
import type { Block, Field, TabAsField } from '../../config/types.js'

import { MissingEditorProp } from '../../../errors/index.js'
import { fieldAffectsData, tabHasName } from '../../config/types.js'
import { getFieldPathsModified as getFieldPaths } from '../../getFieldPaths.js'
import { traverseFields } from './traverseFields.js'

type Args = {
  /**
   * Data of the nearest parent block. If no parent block exists, this will be the `undefined`
   */
  blockData?: JsonObject
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  data: JsonObject
  doc: JsonObject
  field: Field | TabAsField
  fieldIndex: number
  global: null | SanitizedGlobalConfig
  operation: 'create' | 'update'
  parentIndexPath: string
  parentIsLocalized: boolean
  parentPath: string
  parentSchemaPath: string
  previousDoc: JsonObject
  previousSiblingDoc: JsonObject
  req: PayloadRequest
  siblingData: JsonObject
  siblingDoc: JsonObject
  siblingFields?: (Field | TabAsField)[]
}

// This function is responsible for the following actions, in order:
// - Execute field hooks

export const promise = async ({
  blockData,
  collection,
  context,
  data,
  doc,
  field,
  fieldIndex,
  global,
  operation,
  parentIndexPath,
  parentIsLocalized,
  parentPath,
  parentSchemaPath,
  previousDoc,
  previousSiblingDoc,
  req,
  siblingData,
  siblingDoc,
  siblingFields,
}: Args): Promise<void> => {
  const { indexPath, path, schemaPath } = getFieldPaths({
    field,
    index: fieldIndex,
    parentIndexPath,
    parentPath,
    parentSchemaPath,
  })

  const pathSegments = path ? path.split('.') : []
  const schemaPathSegments = schemaPath ? schemaPath.split('.') : []
  const indexPathSegments = indexPath ? indexPath.split('-').filter(Boolean)?.map(Number) : []
  const getNestedValue = (data: JsonObject, path: string[]) =>
    path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), data)
  const previousValData =
    previousSiblingDoc && Object.keys(previousSiblingDoc).length > 0
      ? previousSiblingDoc
      : previousDoc

  if (fieldAffectsData(field)) {
    // Execute hooks
    if ('hooks' in field && field.hooks?.afterChange) {
      for (const hook of field.hooks.afterChange) {
        const hookedValue = await hook({
          blockData,
          collection,
          context,
          data,
          field,
          global,
          indexPath: indexPathSegments,
          operation,
          originalDoc: doc,
          path: pathSegments,
          previousDoc,
          previousSiblingDoc,
          previousValue:
            getNestedValue(previousValData, pathSegments) ?? previousValData?.[field.name],
          req,
          schemaPath: schemaPathSegments,
          siblingData,
          siblingFields: siblingFields!,
          value: getNestedValue(siblingDoc, pathSegments) ?? siblingDoc?.[field.name],
        })

        if (hookedValue !== undefined) {
          siblingDoc[field.name] = hookedValue
        }
      }
    }
  }

  // Traverse subfields
  switch (field.type) {
    case 'array': {
      const rows = siblingDoc[field.name]

      if (Array.isArray(rows)) {
        const promises: Promise<void>[] = []
        rows.forEach((row, rowIndex) => {
          promises.push(
            traverseFields({
              blockData,
              collection,
              context,
              data,
              doc,
              fields: field.fields,
              global,
              operation,
              parentIndexPath: '',
              parentIsLocalized: parentIsLocalized || field.localized,
              parentPath: path + '.' + rowIndex,
              parentSchemaPath: schemaPath,
              previousDoc,
              previousSiblingDoc: previousDoc?.[field.name]?.[rowIndex] || ({} as JsonObject),
              req,
              siblingData: siblingData?.[field.name]?.[rowIndex] || {},
              siblingDoc: row ? { ...row } : {},
            }),
          )
        })
        await Promise.all(promises)
      }

      break
    }

    case 'blocks': {
      const rows = siblingDoc[field.name]

      if (Array.isArray(rows)) {
        const promises: Promise<void>[] = []

        rows.forEach((row, rowIndex) => {
          const blockTypeToMatch = (row as JsonObject).blockType

          const block: Block | undefined =
            req.payload.blocks[blockTypeToMatch] ??
            ((field.blockReferences ?? field.blocks).find(
              (curBlock) => typeof curBlock !== 'string' && curBlock.slug === blockTypeToMatch,
            ) as Block | undefined)

          if (block) {
            promises.push(
              traverseFields({
                blockData: siblingData?.[field.name]?.[rowIndex],
                collection,
                context,
                data,
                doc,
                fields: block.fields,
                global,
                operation,
                parentIndexPath: '',
                parentIsLocalized: parentIsLocalized || field.localized,
                parentPath: path + '.' + rowIndex,
                parentSchemaPath: schemaPath + '.' + block.slug,
                previousDoc,
                previousSiblingDoc: previousValData?.[field.name]?.[rowIndex] || ({} as JsonObject),
                req,
                siblingData: siblingData?.[field.name]?.[rowIndex] || {},
                siblingDoc: row ? { ...row } : {},
              }),
            )
          }
        })

        await Promise.all(promises)
      }

      break
    }

    case 'collapsible':
    case 'row': {
      await traverseFields({
        blockData,
        collection,
        context,
        data,
        doc,
        fields: field.fields,
        global,
        operation,
        parentIndexPath: indexPath,
        parentIsLocalized,
        parentPath,
        parentSchemaPath: schemaPath,
        previousDoc,
        previousSiblingDoc: { ...previousSiblingDoc },
        req,
        siblingData: siblingData || {},
        siblingDoc: { ...siblingDoc },
      })

      break
    }

    case 'group': {
      if (fieldAffectsData(field)) {
        await traverseFields({
          blockData,
          collection,
          context,
          data,
          doc,
          fields: field.fields,
          global,
          operation,
          parentIndexPath: '',
          parentIsLocalized: parentIsLocalized || field.localized,
          parentPath: path,
          parentSchemaPath: schemaPath,
          previousDoc,
          previousSiblingDoc: (previousDoc?.[field.name] as JsonObject) || {},
          req,
          siblingData: (siblingData?.[field.name] as JsonObject) || {},
          siblingDoc: (siblingDoc?.[field.name] as JsonObject) || {},
        })
      } else {
        await traverseFields({
          blockData,
          collection,
          context,
          data,
          doc,
          fields: field.fields,
          global,
          operation,
          parentIndexPath: indexPath,
          parentIsLocalized,
          parentPath,
          parentSchemaPath: schemaPath,
          previousDoc,
          previousSiblingDoc: { ...previousSiblingDoc },
          req,
          siblingData: siblingData || {},
          siblingDoc: { ...siblingDoc },
        })
      }

      break
    }

    case 'richText': {
      if (!field?.editor) {
        throw new MissingEditorProp(field) // while we allow disabling editor functionality, you should not have any richText fields defined if you do not have an editor
      }

      if (typeof field.editor === 'function') {
        throw new Error('Attempted to access unsanitized rich text editor.')
      }

      const editor: RichTextAdapter = field.editor

      if (editor?.hooks?.afterChange?.length) {
        for (const hook of editor.hooks.afterChange) {
          const hookedValue = await hook({
            collection,
            context,
            data,
            field,
            global,
            indexPath: indexPathSegments,
            operation,
            originalDoc: doc,
            parentIsLocalized,
            path: pathSegments,
            previousDoc,
            previousSiblingDoc,
            previousValue: previousDoc?.[field.name],
            req,
            schemaPath: schemaPathSegments,
            siblingData,
            value: siblingDoc?.[field.name],
          })

          if (hookedValue !== undefined) {
            siblingDoc[field.name] = hookedValue
          }
        }
      }
      break
    }

    case 'tab': {
      let tabSiblingData = siblingData
      let tabSiblingDoc = siblingDoc
      let tabPreviousSiblingDoc = siblingDoc

      const isNamedTab = tabHasName(field)

      if (isNamedTab) {
        tabSiblingData = (siblingData?.[field.name] ?? {}) as JsonObject
        tabSiblingDoc = (siblingDoc?.[field.name] ?? {}) as JsonObject
        tabPreviousSiblingDoc = (previousDoc?.[field.name] ?? {}) as JsonObject
      }

      await traverseFields({
        blockData,
        collection,
        context,
        data,
        doc,
        fields: field.fields,
        global,
        operation,
        parentIndexPath: isNamedTab ? '' : indexPath,
        parentIsLocalized: parentIsLocalized || field.localized,
        parentPath: isNamedTab ? path : parentPath,
        parentSchemaPath: schemaPath,
        previousDoc,
        previousSiblingDoc: tabPreviousSiblingDoc,
        req,
        siblingData: tabSiblingData,
        siblingDoc: tabSiblingDoc,
      })

      break
    }

    case 'tabs': {
      await traverseFields({
        blockData,
        collection,
        context,
        data,
        doc,
        fields: field.tabs.map((tab) => ({ ...tab, type: 'tab' })),
        global,
        operation,
        parentIndexPath: indexPath,
        parentIsLocalized,
        parentPath: path,
        parentSchemaPath: schemaPath,
        previousDoc,
        previousSiblingDoc: { ...previousSiblingDoc },
        req,
        siblingData: siblingData || {},
        siblingDoc: { ...siblingDoc },
      })

      break
    }

    default: {
      break
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: traverseFields.ts]---
Location: payload-main/packages/payload/src/fields/hooks/afterChange/traverseFields.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../../../globals/config/types.js'
import type { RequestContext } from '../../../index.js'
import type { JsonObject, PayloadRequest } from '../../../types/index.js'
import type { Field, TabAsField } from '../../config/types.js'

import { promise } from './promise.js'

type Args = {
  /**
   * Data of the nearest parent block. If no parent block exists, this will be the `undefined`
   */
  blockData?: JsonObject
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  data: JsonObject
  doc: JsonObject
  fields: (Field | TabAsField)[]
  global: null | SanitizedGlobalConfig
  operation: 'create' | 'update'
  parentIndexPath: string
  /**
   * @todo make required in v4.0
   */
  parentIsLocalized?: boolean
  parentPath: string
  parentSchemaPath: string
  previousDoc: JsonObject
  previousSiblingDoc: JsonObject
  req: PayloadRequest
  siblingData: JsonObject
  siblingDoc: JsonObject
  siblingFields?: (Field | TabAsField)[]
}

export const traverseFields = async ({
  blockData,
  collection,
  context,
  data,
  doc,
  fields,
  global,
  operation,
  parentIndexPath,
  parentIsLocalized,
  parentPath,
  parentSchemaPath,
  previousDoc,
  previousSiblingDoc,
  req,
  siblingData,
  siblingDoc,
  siblingFields,
}: Args): Promise<void> => {
  const promises: Promise<void>[] = []

  fields.forEach((field, fieldIndex) => {
    promises.push(
      promise({
        blockData,
        collection,
        context,
        data,
        doc,
        field,
        fieldIndex,
        global,
        operation,
        parentIndexPath,
        parentIsLocalized: parentIsLocalized!,
        parentPath,
        parentSchemaPath,
        previousDoc,
        previousSiblingDoc,
        req,
        siblingData,
        siblingDoc,
        siblingFields,
      }),
    )
  })

  await Promise.all(promises)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/fields/hooks/afterRead/index.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../../../globals/config/types.js'
import type { RequestContext, TypedFallbackLocale } from '../../../index.js'
import type { JsonObject, PayloadRequest, PopulateType, SelectType } from '../../../types/index.js'

import { getSelectMode } from '../../../utilities/getSelectMode.js'
import { traverseFields } from './traverseFields.js'

export type AfterReadArgs<T extends JsonObject> = {
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  currentDepth?: number
  depth: number
  doc: T
  draft: boolean
  fallbackLocale: TypedFallbackLocale
  findMany?: boolean
  /**
   * Controls whether locales should be flattened into the requested locale.
   * E.g.: { [locale]: fields } -> fields
   *
   * @default true
   */
  flattenLocales?: boolean
  global: null | SanitizedGlobalConfig
  locale: string
  overrideAccess: boolean
  populate?: PopulateType
  req: PayloadRequest
  select?: SelectType
  showHiddenFields: boolean
}

/**
 * This function is responsible for the following actions, in order:
 * - Remove hidden fields from response
 * - Flatten locales into requested locale. If the input doc contains all locales, the output doc after this function will only contain the requested locale.
 * - Sanitize outgoing data (point field, etc.)
 * - Execute field hooks
 * - Execute read access control
 * - Populate relationships
 */

export async function afterRead<T extends JsonObject>(args: AfterReadArgs<T>): Promise<T> {
  const {
    collection,
    context,
    currentDepth: incomingCurrentDepth,
    depth: incomingDepth,
    doc: incomingDoc,
    draft,
    fallbackLocale,
    findMany,
    flattenLocales = true,
    global,
    locale,
    overrideAccess,
    populate,
    req,
    select,
    showHiddenFields,
  } = args

  const fieldPromises: Promise<void>[] = []
  const populationPromises: Promise<void>[] = []

  let depth =
    incomingDepth || incomingDepth === 0
      ? parseInt(String(incomingDepth), 10)
      : req.payload.config.defaultDepth
  if (depth > req.payload.config.maxDepth) {
    depth = req.payload.config.maxDepth
  }

  const currentDepth = incomingCurrentDepth || 1

  traverseFields({
    collection,
    context,
    currentDepth,
    depth,
    doc: incomingDoc,
    draft,
    fallbackLocale,
    fieldPromises,
    fields: (collection?.fields || global?.fields)!,
    findMany: findMany!,
    flattenLocales,
    global,
    locale,
    overrideAccess,
    parentIndexPath: '',
    parentIsLocalized: false,
    parentPath: '',
    parentSchemaPath: '',
    populate,
    populationPromises,
    req,
    select,
    selectMode: select ? getSelectMode(select) : undefined,
    showHiddenFields,
    siblingDoc: incomingDoc,
  })

  /**
   * Await all field and population promises in parallel.
   * A field promise is able to add more field promises to the fieldPromises array, which will not be
   * awaited in the first run.
   * This is why we need to loop again to process the new field promises, until there are no more field promises left.
   */
  let iterations = 0
  while (fieldPromises.length > 0 || populationPromises.length > 0) {
    const currentFieldPromises = fieldPromises.splice(0, fieldPromises.length)
    const currentPopulationPromises = populationPromises.splice(0, populationPromises.length)

    await Promise.all(currentFieldPromises)
    await Promise.all(currentPopulationPromises)

    iterations++
    if (iterations >= 100) {
      throw new Error(
        'Infinite afterRead promise loop detected. A hook is likely adding field promises in an infinitely recursive way.',
      )
    }
  }
  return incomingDoc
}
```

--------------------------------------------------------------------------------

````
