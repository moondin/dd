---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 205
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 205 of 695)

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

---[FILE: promise.ts]---
Location: payload-main/packages/payload/src/fields/hooks/beforeDuplicate/promise.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { RequestContext } from '../../../index.js'
import type { JsonObject, PayloadRequest } from '../../../types/index.js'
import type { Block, Field, FieldHookArgs, TabAsField } from '../../config/types.js'

import { fieldAffectsData, fieldShouldBeLocalized } from '../../config/types.js'
import { getFieldPathsModified as getFieldPaths } from '../../getFieldPaths.js'
import { traverseFields } from './traverseFields.js'

type Args<T> = {
  /**
   * Data of the nearest parent block. If no parent block exists, this will be the `undefined`
   */
  blockData?: JsonObject
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  doc: T
  field: Field | TabAsField
  fieldIndex: number
  id?: number | string
  overrideAccess: boolean
  parentIndexPath: string
  parentIsLocalized: boolean
  parentPath: string
  parentSchemaPath: string
  req: PayloadRequest
  siblingDoc: JsonObject
  siblingFields?: (Field | TabAsField)[]
}

export const promise = async <T>({
  id,
  blockData,
  collection,
  context,
  doc,
  field,
  fieldIndex,
  overrideAccess,
  parentIndexPath,
  parentIsLocalized,
  parentPath,
  parentSchemaPath,
  req,
  siblingDoc,
  siblingFields,
}: Args<T>): Promise<void> => {
  const { indexPath, path, schemaPath } = getFieldPaths({
    field,
    index: fieldIndex,
    parentIndexPath,
    parentPath,
    parentSchemaPath,
  })

  const { localization } = req.payload.config

  const pathSegments = path ? path.split('.') : []
  const schemaPathSegments = schemaPath ? schemaPath.split('.') : []
  const indexPathSegments = indexPath ? indexPath.split('-').filter(Boolean)?.map(Number) : []

  if (fieldAffectsData(field)) {
    let fieldData = siblingDoc?.[field.name!]
    const fieldIsLocalized = localization && fieldShouldBeLocalized({ field, parentIsLocalized })

    // Run field beforeDuplicate hooks.
    // These hooks are responsible for resetting the `id` field values of array and block rows. See `baseIDField`.
    if (Array.isArray('hooks' in field && field.hooks?.beforeDuplicate)) {
      if (fieldIsLocalized) {
        const localeData: JsonObject = {}

        for (const locale of localization.localeCodes) {
          const beforeDuplicateArgs: FieldHookArgs = {
            blockData,
            collection,
            context,
            data: doc as Partial<T>,
            field,
            global: undefined!,
            indexPath: indexPathSegments,
            path: pathSegments,
            previousSiblingDoc: siblingDoc,
            previousValue: siblingDoc[field.name!]?.[locale],
            req,
            schemaPath: schemaPathSegments,
            siblingData: siblingDoc,
            siblingDocWithLocales: siblingDoc,
            siblingFields: siblingFields!,
            value: siblingDoc[field.name!]?.[locale],
          }

          let hookResult
          if ('hooks' in field && field.hooks?.beforeDuplicate) {
            for (const hook of field.hooks.beforeDuplicate) {
              hookResult = await hook(beforeDuplicateArgs)
            }
          }

          if (typeof hookResult !== 'undefined') {
            localeData[locale] = hookResult
          }
        }

        siblingDoc[field.name!] = localeData
      } else {
        const beforeDuplicateArgs: FieldHookArgs = {
          blockData,
          collection,
          context,
          data: doc as Partial<T>,
          field,
          global: undefined!,
          indexPath: indexPathSegments,
          path: pathSegments,
          previousSiblingDoc: siblingDoc,
          previousValue: siblingDoc[field.name!]!,
          req,
          schemaPath: schemaPathSegments,
          siblingData: siblingDoc,
          siblingDocWithLocales: siblingDoc,
          siblingFields: siblingFields!,
          value: siblingDoc[field.name!]!,
        }

        let hookResult
        if ('hooks' in field && field.hooks?.beforeDuplicate) {
          for (const hook of field.hooks.beforeDuplicate) {
            hookResult = await hook(beforeDuplicateArgs)
          }
        }

        if (typeof hookResult !== 'undefined') {
          siblingDoc[field.name!] = hookResult
        }
      }
    }

    // First, for any localized fields, we will loop over locales
    // and if locale data is present, traverse the sub fields.
    // There are only a few different fields where this is possible.
    if (fieldIsLocalized) {
      if (typeof fieldData !== 'object' || fieldData === null) {
        siblingDoc[field.name!] = {}
        fieldData = siblingDoc[field.name!]
      }

      const promises: Promise<void>[] = []

      localization.localeCodes.forEach((locale) => {
        if (fieldData[locale]) {
          switch (field.type) {
            case 'array': {
              const rows = fieldData[locale]

              if (Array.isArray(rows)) {
                const promises: Promise<void>[] = []

                rows.forEach((row, rowIndex) => {
                  promises.push(
                    traverseFields({
                      id,
                      blockData,
                      collection,
                      context,
                      doc,
                      fields: field.fields,
                      overrideAccess,
                      parentIndexPath: '',
                      parentIsLocalized: parentIsLocalized || field.localized!,
                      parentPath: path + '.' + rowIndex,
                      parentSchemaPath: schemaPath,
                      req,
                      siblingDoc: row,
                    }),
                  )
                })
              }

              break
            }

            case 'blocks': {
              const rows = fieldData[locale]

              if (Array.isArray(rows)) {
                const promises: Promise<void>[] = []

                rows.forEach((row, rowIndex) => {
                  const blockTypeToMatch = row.blockType

                  const block: Block | undefined =
                    req.payload.blocks[blockTypeToMatch] ??
                    ((field.blockReferences ?? field.blocks).find(
                      (curBlock) =>
                        typeof curBlock !== 'string' && curBlock.slug === blockTypeToMatch,
                    ) as Block | undefined)

                  promises.push(
                    traverseFields({
                      id,
                      blockData: row,
                      collection,
                      context,
                      doc,
                      fields: block!.fields,
                      overrideAccess,
                      parentIndexPath: '',
                      parentIsLocalized: parentIsLocalized || field.localized!,
                      parentPath: path + '.' + rowIndex,
                      parentSchemaPath: schemaPath + '.' + block!.slug,
                      req,
                      siblingDoc: row,
                    }),
                  )
                })
              }
              break
            }

            case 'group':
            case 'tab': {
              promises.push(
                traverseFields({
                  id,
                  blockData,
                  collection,
                  context,
                  doc,
                  fields: field.fields,
                  overrideAccess,
                  parentIndexPath: '',
                  parentIsLocalized: parentIsLocalized || field.localized!,
                  parentPath: path,
                  parentSchemaPath: schemaPath,
                  req,
                  siblingDoc: fieldData[locale],
                }),
              )

              break
            }
          }
        }
      })

      await Promise.all(promises)
    } else {
      // If the field is not localized, but it affects data,
      // we need to further traverse its children
      // so the child fields can run beforeDuplicate hooks
      switch (field.type) {
        case 'array': {
          const rows = siblingDoc[field.name]

          if (Array.isArray(rows)) {
            const promises: Promise<void>[] = []

            rows.forEach((row, rowIndex) => {
              promises.push(
                traverseFields({
                  id,
                  blockData,
                  collection,
                  context,
                  doc,
                  fields: field.fields,
                  overrideAccess,
                  parentIndexPath: '',
                  parentIsLocalized: parentIsLocalized || field.localized!,
                  parentPath: path + '.' + rowIndex,
                  parentSchemaPath: schemaPath,
                  req,
                  siblingDoc: row,
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
              const blockTypeToMatch = row.blockType

              const block: Block | undefined =
                req.payload.blocks[blockTypeToMatch] ??
                ((field.blockReferences ?? field.blocks).find(
                  (curBlock) => typeof curBlock !== 'string' && curBlock.slug === blockTypeToMatch,
                ) as Block | undefined)

              if (block) {
                ;(row as JsonObject).blockType = blockTypeToMatch

                promises.push(
                  traverseFields({
                    id,
                    blockData: row,
                    collection,
                    context,
                    doc,
                    fields: block.fields,
                    overrideAccess,
                    parentIndexPath: '',
                    parentIsLocalized: parentIsLocalized || field.localized!,
                    parentPath: path + '.' + rowIndex,
                    parentSchemaPath: schemaPath + '.' + block.slug,
                    req,
                    siblingDoc: row,
                  }),
                )
              }
            })

            await Promise.all(promises)
          }

          break
        }

        case 'group': {
          if (typeof siblingDoc[field.name] !== 'object') {
            siblingDoc[field.name] = {}
          }

          const groupDoc = siblingDoc[field.name] as JsonObject

          await traverseFields({
            id,
            blockData,
            collection,
            context,
            doc,
            fields: field.fields,
            overrideAccess,
            parentIndexPath: '',
            parentIsLocalized: parentIsLocalized || field.localized!,
            parentPath: path,
            parentSchemaPath: schemaPath,
            req,
            siblingDoc: groupDoc,
          })

          break
        }

        case 'tab': {
          if (typeof siblingDoc[field.name!] !== 'object') {
            siblingDoc[field.name!] = {}
          }

          const tabDoc = siblingDoc[field.name!] as JsonObject

          await traverseFields({
            id,
            blockData,
            collection,
            context,
            doc,
            fields: field.fields,
            overrideAccess,
            parentIndexPath: '',
            parentIsLocalized: parentIsLocalized || field.localized!,
            parentPath: path,
            parentSchemaPath: schemaPath,
            req,
            siblingDoc: tabDoc,
          })

          break
        }
      }
    }
  } else {
    // Finally, we traverse fields which do not affect data here - collapsibles, rows, unnamed groups
    switch (field.type) {
      case 'collapsible':
      case 'group':
      case 'row': {
        await traverseFields({
          id,
          blockData,
          collection,
          context,
          doc,
          fields: field.fields,
          overrideAccess,
          parentIndexPath: indexPath,
          parentIsLocalized,
          parentPath,
          parentSchemaPath: schemaPath,
          req,
          siblingDoc,
        })

        break
      }

      // Unnamed Tab
      // @ts-expect-error `fieldAffectsData` inferred return type doesn't account for TabAsField
      case 'tab': {
        await traverseFields({
          id,
          blockData,
          collection,
          context,
          doc,
          // @ts-expect-error `fieldAffectsData` inferred return type doesn't account for TabAsField
          fields: field.fields,
          overrideAccess,
          parentIndexPath: indexPath,
          parentIsLocalized,
          parentPath,
          parentSchemaPath: schemaPath,
          req,
          siblingDoc,
        })

        break
      }

      case 'tabs': {
        await traverseFields({
          id,
          blockData,
          collection,
          context,
          doc,
          fields: field.tabs.map((tab) => ({ ...tab, type: 'tab' })),
          overrideAccess,
          parentIndexPath: indexPath,
          parentIsLocalized,
          parentPath: path,
          parentSchemaPath: schemaPath,
          req,
          siblingDoc,
        })

        break
      }

      default: {
        break
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: traverseFields.ts]---
Location: payload-main/packages/payload/src/fields/hooks/beforeDuplicate/traverseFields.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { RequestContext } from '../../../index.js'
import type { JsonObject, PayloadRequest } from '../../../types/index.js'
import type { Field, TabAsField } from '../../config/types.js'

import { promise } from './promise.js'

type Args<T> = {
  /**
   * Data of the nearest parent block. If no parent block exists, this will be the `undefined`
   */
  blockData?: JsonObject
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  doc: T
  fields: (Field | TabAsField)[]
  id?: number | string
  overrideAccess: boolean
  parentIndexPath: string
  parentIsLocalized: boolean
  parentPath: string
  parentSchemaPath: string
  req: PayloadRequest
  siblingDoc: JsonObject
}

export const traverseFields = async <T>({
  id,
  blockData,
  collection,
  context,
  doc,
  fields,
  overrideAccess,
  parentIndexPath,
  parentIsLocalized,
  parentPath,
  parentSchemaPath,
  req,
  siblingDoc,
}: Args<T>): Promise<void> => {
  const promises: Promise<void>[] = []

  fields.forEach((field, fieldIndex) => {
    promises.push(
      promise({
        id,
        blockData,
        collection,
        context,
        doc,
        field,
        fieldIndex,
        overrideAccess,
        parentIndexPath,
        parentIsLocalized,
        parentPath,
        parentSchemaPath,
        req,
        siblingDoc,
        siblingFields: fields,
      }),
    )
  })
  await Promise.all(promises)
}
```

--------------------------------------------------------------------------------

---[FILE: getFallbackValue.ts]---
Location: payload-main/packages/payload/src/fields/hooks/beforeValidate/getFallbackValue.ts

```typescript
import type { JsonObject, JsonValue, PayloadRequest } from '../../../types/index.js'
import type { FieldAffectingData } from '../../config/types.js'

import { getDefaultValue } from '../../getDefaultValue.js'
import { cloneDataFromOriginalDoc } from '../beforeChange/cloneDataFromOriginalDoc.js'

export async function getFallbackValue({
  field,
  req,
  siblingDoc,
}: {
  field: FieldAffectingData
  req: PayloadRequest
  siblingDoc: JsonObject
}): Promise<JsonValue> {
  let fallbackValue: JsonValue = undefined
  if ('name' in field && field.name) {
    if (typeof siblingDoc[field.name] !== 'undefined') {
      fallbackValue = cloneDataFromOriginalDoc(siblingDoc[field.name])
    } else if ('defaultValue' in field && typeof field.defaultValue !== 'undefined') {
      fallbackValue = await getDefaultValue({
        defaultValue: field.defaultValue,
        locale: req.locale || '',
        req,
        user: req.user,
      })
    }
  }

  return fallbackValue
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/fields/hooks/beforeValidate/index.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../../../globals/config/types.js'
import type { JsonObject, PayloadRequest } from '../../../types/index.js'

import { type RequestContext } from '../../../index.js'
import { traverseFields } from './traverseFields.js'

type Args<T extends JsonObject> = {
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  data: T
  doc?: T
  duplicate?: boolean
  global: null | SanitizedGlobalConfig
  id?: number | string
  operation: 'create' | 'update'
  overrideAccess: boolean
  req: PayloadRequest
}

/**
 * This function is responsible for the following actions, in order:
 * - Sanitize incoming data
 * - Execute field hooks
 * - Execute field access control
 * - Merge original document data into incoming data
 * - Compute default values for undefined fields
 */
export const beforeValidate = async <T extends JsonObject>({
  id,
  collection,
  context,
  data: incomingData,
  doc,
  global,
  operation,
  overrideAccess,
  req,
}: Args<T>): Promise<T> => {
  await traverseFields({
    id,
    collection,
    context,
    data: incomingData,
    doc,
    fields: (collection?.fields || global?.fields)!,
    global,
    operation,
    overrideAccess,
    parentIndexPath: '',
    parentIsLocalized: false,
    parentPath: '',
    parentSchemaPath: '',
    req,
    siblingData: incomingData,
    siblingDoc: doc!,
  })

  return incomingData
}
```

--------------------------------------------------------------------------------

---[FILE: promise.ts]---
Location: payload-main/packages/payload/src/fields/hooks/beforeValidate/promise.ts

```typescript
import type { RichTextAdapter } from '../../../admin/RichText.js'
import type { SanitizedCollectionConfig, TypeWithID } from '../../../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../../../globals/config/types.js'
import type { RequestContext } from '../../../index.js'
import type { JsonObject, JsonValue, PayloadRequest } from '../../../types/index.js'
import type { Block, Field, TabAsField } from '../../config/types.js'

import { MissingEditorProp } from '../../../errors/index.js'
import { fieldAffectsData, tabHasName, valueIsValueWithRelation } from '../../config/types.js'
import { getFieldPathsModified as getFieldPaths } from '../../getFieldPaths.js'
import { getExistingRowDoc } from '../beforeChange/getExistingRowDoc.js'
import { getFallbackValue } from './getFallbackValue.js'
import { traverseFields } from './traverseFields.js'

type Args<T> = {
  /**
   * Data of the nearest parent block. If no parent block exists, this will be the `undefined`
   */
  blockData?: JsonObject
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  data: T
  /**
   * The original data (not modified by any hooks)
   */
  doc: T
  field: Field | TabAsField
  fieldIndex: number
  global: null | SanitizedGlobalConfig
  id?: number | string
  operation: 'create' | 'update'
  overrideAccess: boolean
  parentIndexPath: string
  parentIsLocalized: boolean
  parentPath: string
  parentSchemaPath: string
  req: PayloadRequest
  siblingData: JsonObject
  /**
   * The original siblingData (not modified by any hooks)
   */
  siblingDoc: JsonObject
  siblingFields?: (Field | TabAsField)[]
}

// This function is responsible for the following actions, in order:
// - Sanitize incoming data
// - Execute field hooks
// - Execute field access control
// - Merge original document data into incoming data
// - Compute default values for undefined fields

export const promise = async <T>({
  id,
  blockData,
  collection,
  context,
  data,
  doc,
  field,
  fieldIndex,
  global,
  operation,
  overrideAccess,
  parentIndexPath,
  parentIsLocalized,
  parentPath,
  parentSchemaPath,
  req,
  siblingData,
  siblingDoc,
  siblingFields,
}: Args<T>): Promise<void> => {
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

  if (fieldAffectsData(field)) {
    if (field.name === 'id') {
      if (field.type === 'number' && typeof siblingData[field.name] === 'string') {
        const value = siblingData[field.name] as string

        siblingData[field.name] = parseFloat(value)
      }

      if (
        field.type === 'text' &&
        typeof siblingData[field.name]?.toString === 'function' &&
        typeof siblingData[field.name] !== 'string'
      ) {
        siblingData[field.name] = siblingData[field.name].toString()
      }
    }

    // Sanitize incoming data
    switch (field.type) {
      case 'array':
      case 'blocks': {
        // Handle cases of arrays being intentionally set to 0
        if (siblingData[field.name] === '0' || siblingData[field.name] === 0) {
          siblingData[field.name] = []
        }

        break
      }

      case 'checkbox': {
        if (siblingData[field.name] === 'true') {
          siblingData[field.name] = true
        }
        if (siblingData[field.name] === 'false') {
          siblingData[field.name] = false
        }
        if (siblingData[field.name] === '') {
          siblingData[field.name] = false
        }

        break
      }

      case 'number': {
        if (typeof siblingData[field.name] === 'string') {
          const value = siblingData[field.name] as string
          const trimmed = value.trim()
          siblingData[field.name] = trimmed.length === 0 ? null : parseFloat(trimmed)
        }

        break
      }

      case 'point': {
        if (Array.isArray(siblingData[field.name])) {
          siblingData[field.name] = (siblingData[field.name] as string[]).map((coordinate, i) => {
            if (typeof coordinate === 'string') {
              const value = siblingData[field.name][i] as string
              const trimmed = value.trim()
              return trimmed.length === 0 ? null : parseFloat(trimmed)
            }
            return coordinate
          })
        }

        break
      }
      case 'relationship':
      case 'upload': {
        if (
          siblingData[field.name] === '' ||
          siblingData[field.name] === 'none' ||
          siblingData[field.name] === 'null' ||
          siblingData[field.name] === null
        ) {
          if (field.hasMany === true) {
            siblingData[field.name] = []
          } else {
            siblingData[field.name] = null
          }
        }

        const value = siblingData[field.name]

        if (Array.isArray(field.relationTo)) {
          if (Array.isArray(value)) {
            value.forEach((relatedDoc: { relationTo: string; value: JsonValue }, i) => {
              const relatedCollection = req.payload.collections?.[relatedDoc.relationTo]?.config

              if (
                typeof relatedDoc.value === 'object' &&
                relatedDoc.value &&
                'id' in relatedDoc.value
              ) {
                relatedDoc.value = relatedDoc.value.id
              }

              if (relatedCollection?.fields) {
                const relationshipIDField = relatedCollection.fields.find(
                  (collectionField) =>
                    fieldAffectsData(collectionField) && collectionField.name === 'id',
                )
                if (relationshipIDField?.type === 'number') {
                  siblingData[field.name][i] = {
                    ...relatedDoc,
                    value: parseFloat(relatedDoc.value as string),
                  }
                }
              }
            })
          }
          if (field.hasMany !== true && valueIsValueWithRelation(value)) {
            const relatedCollection = req.payload.collections?.[value.relationTo]?.config

            if (typeof value.value === 'object' && value.value && 'id' in value.value) {
              value.value = (value.value as TypeWithID).id
            }

            if (relatedCollection?.fields) {
              const relationshipIDField = relatedCollection.fields.find(
                (collectionField) =>
                  fieldAffectsData(collectionField) && collectionField.name === 'id',
              )
              if (relationshipIDField?.type === 'number') {
                siblingData[field.name] = { ...value, value: parseFloat(value.value as string) }
              }
            }
          }
        } else {
          if (Array.isArray(value)) {
            value.forEach((relatedDoc: unknown, i) => {
              const relatedCollection = Array.isArray(field.relationTo)
                ? undefined
                : req.payload.collections?.[field.relationTo]?.config

              if (typeof relatedDoc === 'object' && relatedDoc && 'id' in relatedDoc) {
                value[i] = relatedDoc.id
              }

              if (relatedCollection?.fields) {
                const relationshipIDField = relatedCollection.fields.find(
                  (collectionField) =>
                    fieldAffectsData(collectionField) && collectionField.name === 'id',
                )
                if (relationshipIDField?.type === 'number') {
                  siblingData[field.name][i] = parseFloat(relatedDoc as string)
                }
              }
            })
          }
          if (field.hasMany !== true && value) {
            const relatedCollection = req.payload.collections?.[field.relationTo]?.config

            if (typeof value === 'object' && value && 'id' in value) {
              siblingData[field.name] = value.id
            }

            if (relatedCollection?.fields) {
              const relationshipIDField = relatedCollection.fields.find(
                (collectionField) =>
                  fieldAffectsData(collectionField) && collectionField.name === 'id',
              )
              if (relationshipIDField?.type === 'number') {
                siblingData[field.name] = parseFloat(value as string)
              }
            }
          }
        }
        break
      }
      case 'richText': {
        if (typeof siblingData[field.name] === 'string') {
          try {
            const richTextJSON = JSON.parse(siblingData[field.name] as string)
            siblingData[field.name] = richTextJSON
          } catch {
            // Disregard this data as it is not valid.
            // Will be reported to user by field validation
          }
        }

        break
      }

      default: {
        break
      }
    }

    // ensure the fallback value is only computed one time
    // either here or when access control returns false
    const fallbackResult: { executed: boolean; value: unknown } = {
      executed: false,
      value: undefined,
    }
    if (typeof siblingData[field.name!] === 'undefined') {
      fallbackResult.value = await getFallbackValue({ field, req, siblingDoc })
      fallbackResult.executed = true
    }

    // Execute hooks
    if ('hooks' in field && field.hooks?.beforeValidate) {
      for (const hook of field.hooks.beforeValidate) {
        const hookedValue = await hook({
          blockData,
          collection,
          context,
          data: data as Partial<T>,
          field,
          global,
          indexPath: indexPathSegments,
          operation,
          originalDoc: doc,
          overrideAccess,
          path: pathSegments,
          previousSiblingDoc: siblingDoc,
          previousValue: siblingDoc[field.name],
          req,
          schemaPath: schemaPathSegments,
          siblingData,
          siblingFields: siblingFields!,
          value:
            typeof siblingData[field.name] === 'undefined'
              ? fallbackResult.value
              : siblingData[field.name],
        })

        if (hookedValue !== undefined) {
          siblingData[field.name] = hookedValue
        }
      }
    }

    // Execute access control
    if (field.access && field.access[operation]) {
      const result = overrideAccess
        ? true
        : await field.access[operation]({
            id,
            blockData,
            data: data as Partial<T>,
            doc,
            req,
            siblingData,
          })

      if (!result) {
        delete siblingData[field.name!]
      }
    }

    if (typeof siblingData[field.name!] === 'undefined') {
      siblingData[field.name!] = !fallbackResult.executed
        ? await getFallbackValue({ field, req, siblingDoc })
        : fallbackResult.value
    }
  }

  // Traverse subfields
  switch (field.type) {
    case 'array': {
      const rows = siblingData[field.name]

      if (Array.isArray(rows)) {
        const promises: Promise<void>[] = []

        rows.forEach((row, rowIndex) => {
          promises.push(
            traverseFields({
              id,
              blockData,
              collection,
              context,
              data,
              doc,
              fields: field.fields,
              global,
              operation,
              overrideAccess,
              parentIndexPath: '',
              parentIsLocalized: parentIsLocalized || field.localized,
              parentPath: path + '.' + rowIndex,
              parentSchemaPath: schemaPath,
              req,
              siblingData: row as JsonObject,
              siblingDoc: getExistingRowDoc(row as JsonObject, siblingDoc[field.name]),
            }),
          )
        })

        await Promise.all(promises)
      }
      break
    }

    case 'blocks': {
      const rows = siblingData[field.name]

      if (Array.isArray(rows)) {
        const promises: Promise<void>[] = []

        rows.forEach((row, rowIndex) => {
          const rowSiblingDoc = getExistingRowDoc(row as JsonObject, siblingDoc[field.name])
          const blockTypeToMatch = (row as JsonObject).blockType || rowSiblingDoc.blockType

          const block: Block | undefined =
            req.payload.blocks[blockTypeToMatch] ??
            ((field.blockReferences ?? field.blocks).find(
              (curBlock) => typeof curBlock !== 'string' && curBlock.slug === blockTypeToMatch,
            ) as Block | undefined)

          if (block) {
            ;(row as JsonObject).blockType = blockTypeToMatch

            promises.push(
              traverseFields({
                id,
                blockData: row,
                collection,
                context,
                data,
                doc,
                fields: block.fields,
                global,
                operation,
                overrideAccess,
                parentIndexPath: '',
                parentIsLocalized: parentIsLocalized || field.localized,
                parentPath: path + '.' + rowIndex,
                parentSchemaPath: schemaPath + '.' + block.slug,
                req,
                siblingData: row as JsonObject,
                siblingDoc: rowSiblingDoc,
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
        id,
        blockData,
        collection,
        context,
        data,
        doc,
        fields: field.fields,
        global,
        operation,
        overrideAccess,
        parentIndexPath: indexPath,
        parentIsLocalized,
        parentPath,
        parentSchemaPath: schemaPath,
        req,
        siblingData,
        siblingDoc,
      })

      break
    }

    case 'group': {
      let groupSiblingData = siblingData
      let groupSiblingDoc = siblingDoc

      const isNamedGroup = fieldAffectsData(field)

      if (isNamedGroup) {
        if (typeof siblingData[field.name] !== 'object') {
          siblingData[field.name] = {}
        }

        if (typeof siblingDoc[field.name] !== 'object') {
          siblingDoc[field.name] = {}
        }

        groupSiblingData = siblingData[field.name] as Record<string, unknown>
        groupSiblingDoc = siblingDoc[field.name] as Record<string, unknown>
      }

      await traverseFields({
        id,
        blockData,
        collection,
        context,
        data,
        doc,
        fields: field.fields,
        global,
        operation,
        overrideAccess,
        parentIndexPath: isNamedGroup ? '' : indexPath,
        parentIsLocalized: parentIsLocalized || field.localized,
        parentPath: isNamedGroup ? path : parentPath,
        parentSchemaPath: schemaPath,
        req,
        siblingData: groupSiblingData,
        siblingDoc: groupSiblingDoc,
      })

      break
    }

    case 'richText': {
      if (!field?.editor) {
        throw new MissingEditorProp(field) // while we allow disabling editor functionality, you should not have any richText fields defined if you do not have an editor
      }

      if (typeof field?.editor === 'function') {
        throw new Error('Attempted to access unsanitized rich text editor.')
      }

      const editor: RichTextAdapter = field?.editor

      if (editor?.hooks?.beforeValidate?.length) {
        for (const hook of editor.hooks.beforeValidate) {
          const hookedValue = await hook({
            collection,
            context,
            data: data as Partial<T>,
            field,
            global,
            indexPath: indexPathSegments,
            operation,
            originalDoc: doc,
            overrideAccess,
            parentIsLocalized,
            path: pathSegments,
            previousSiblingDoc: siblingDoc,
            previousValue: siblingData[field.name],
            req,
            schemaPath: schemaPathSegments,
            siblingData,
            value: siblingData[field.name],
          })

          if (hookedValue !== undefined) {
            siblingData[field.name] = hookedValue
          }
        }
      }
      break
    }

    case 'tab': {
      let tabSiblingData
      let tabSiblingDoc

      const isNamedTab = tabHasName(field)

      if (isNamedTab) {
        if (typeof siblingData[field.name] !== 'object') {
          siblingData[field.name] = {}
        }

        if (typeof siblingDoc[field.name] !== 'object') {
          siblingDoc[field.name] = {}
        }

        tabSiblingData = siblingData[field.name] as Record<string, unknown>
        tabSiblingDoc = siblingDoc[field.name] as Record<string, unknown>
      } else {
        tabSiblingData = siblingData
        tabSiblingDoc = siblingDoc
      }

      await traverseFields({
        id,
        blockData,
        collection,
        context,
        data,
        doc,
        fields: field.fields,
        global,
        operation,
        overrideAccess,
        parentIndexPath: isNamedTab ? '' : indexPath,
        parentIsLocalized: parentIsLocalized || field.localized,
        parentPath: isNamedTab ? path : parentPath,
        parentSchemaPath: schemaPath,
        req,
        siblingData: tabSiblingData,
        siblingDoc: tabSiblingDoc,
      })

      break
    }

    case 'tabs': {
      await traverseFields({
        id,
        blockData,
        collection,
        context,
        data,
        doc,
        fields: field.tabs.map((tab) => ({ ...tab, type: 'tab' })),
        global,
        operation,
        overrideAccess,
        parentIndexPath: indexPath,
        parentIsLocalized,
        parentPath: path,
        parentSchemaPath: schemaPath,
        req,
        siblingData,
        siblingDoc,
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
Location: payload-main/packages/payload/src/fields/hooks/beforeValidate/traverseFields.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../../../globals/config/types.js'
import type { RequestContext } from '../../../index.js'
import type { JsonObject, PayloadRequest } from '../../../types/index.js'
import type { Field, TabAsField } from '../../config/types.js'

import { promise } from './promise.js'

type Args<T> = {
  /**
   * Data of the nearest parent block. If no parent block exists, this will be the `undefined`
   */
  blockData?: JsonObject
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  data: T
  /**
   * The original data (not modified by any hooks)
   */
  doc: T
  fields: (Field | TabAsField)[]
  global: null | SanitizedGlobalConfig
  id?: number | string
  operation: 'create' | 'update'
  overrideAccess: boolean
  parentIndexPath: string
  /**
   * @todo make required in v4.0
   */
  parentIsLocalized?: boolean
  parentPath: string
  parentSchemaPath: string
  req: PayloadRequest
  siblingData: JsonObject
  /**
   * The original siblingData (not modified by any hooks)
   */
  siblingDoc: JsonObject
}

export const traverseFields = async <T>({
  id,
  blockData,
  collection,
  context,
  data,
  doc,
  fields,
  global,
  operation,
  overrideAccess,
  parentIndexPath,
  parentIsLocalized,
  parentPath,
  parentSchemaPath,
  req,
  siblingData,
  siblingDoc,
}: Args<T>): Promise<void> => {
  const promises: Promise<void>[] = []

  fields.forEach((field, fieldIndex) => {
    promises.push(
      promise({
        id,
        blockData,
        collection,
        context,
        data,
        doc,
        field,
        fieldIndex,
        global,
        operation,
        overrideAccess,
        parentIndexPath,
        parentIsLocalized: parentIsLocalized!,
        parentPath,
        parentSchemaPath,
        req,
        siblingData,
        siblingDoc,
        siblingFields: fields,
      }),
    )
  })

  await Promise.all(promises)
}
```

--------------------------------------------------------------------------------

---[FILE: addFolderCollection.ts]---
Location: payload-main/packages/payload/src/folders/addFolderCollection.ts

```typescript
import type { Config, SanitizedConfig } from '../config/types.js'
import type { CollectionConfig } from '../index.js'

import { sanitizeCollection } from '../collections/config/sanitize.js'
import { createFolderCollection } from './createFolderCollection.js'

export async function addFolderCollection({
  collectionSpecific,
  config,
  folderEnabledCollections,
  richTextSanitizationPromises = [],
  validRelationships = [],
}: {
  collectionSpecific: boolean
  config: NonNullable<Config>
  folderEnabledCollections: CollectionConfig[]
  richTextSanitizationPromises?: Array<(config: SanitizedConfig) => Promise<void>>
  validRelationships?: string[]
}): Promise<void> {
  if (config.folders === false) {
    return
  }

  let folderCollectionConfig = createFolderCollection({
    slug: config.folders!.slug as string,
    collectionSpecific,
    debug: config.folders!.debug,
    folderEnabledCollections,
    folderFieldName: config.folders!.fieldName as string,
  })

  const collectionIndex = config.collections!.push(folderCollectionConfig)

  if (
    Array.isArray(config.folders?.collectionOverrides) &&
    config?.folders.collectionOverrides.length
  ) {
    for (const override of config.folders.collectionOverrides) {
      folderCollectionConfig = await override({ collection: folderCollectionConfig })
    }
  }

  const sanitizedCollectionWithOverrides = await sanitizeCollection(
    config as unknown as Config,
    folderCollectionConfig,
    richTextSanitizationPromises,
    validRelationships,
  )

  config.collections![collectionIndex - 1] = sanitizedCollectionWithOverrides
}
```

--------------------------------------------------------------------------------

````
