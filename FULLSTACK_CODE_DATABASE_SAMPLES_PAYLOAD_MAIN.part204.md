---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 204
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 204 of 695)

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

---[FILE: traverseFields.ts]---
Location: payload-main/packages/payload/src/fields/hooks/afterRead/traverseFields.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../../../globals/config/types.js'
import type { RequestContext, TypedFallbackLocale } from '../../../index.js'
import type {
  JsonObject,
  PayloadRequest,
  PopulateType,
  SelectMode,
  SelectType,
} from '../../../types/index.js'
import type { Field, TabAsField } from '../../config/types.js'

import { promise } from './promise.js'

type Args = {
  /**
   * Data of the nearest parent block. If no parent block exists, this will be the `undefined`
   */
  blockData?: JsonObject
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  currentDepth: number
  depth: number
  doc: JsonObject
  draft: boolean
  fallbackLocale: TypedFallbackLocale
  /**
   * fieldPromises are used for things like field hooks. They should be awaited before awaiting populationPromises
   */
  fieldPromises: Promise<void>[]
  fields: (Field | TabAsField)[]
  findMany: boolean
  flattenLocales: boolean
  global: null | SanitizedGlobalConfig
  locale: null | string
  overrideAccess: boolean
  parentIndexPath: string
  /**
   * @todo make required in v4.0
   */
  parentIsLocalized?: boolean
  parentPath: string
  parentSchemaPath: string
  populate?: PopulateType
  populationPromises: Promise<void>[]
  req: PayloadRequest
  select?: SelectType
  selectMode?: SelectMode
  showHiddenFields: boolean
  siblingDoc: JsonObject
  triggerAccessControl?: boolean
  triggerHooks?: boolean
}

export const traverseFields = ({
  blockData,
  collection,
  context,
  currentDepth,
  depth,
  doc,
  draft,
  fallbackLocale,
  fieldPromises,
  fields,
  findMany,
  flattenLocales,
  global,
  locale,
  overrideAccess,
  parentIndexPath,
  parentIsLocalized,
  parentPath,
  parentSchemaPath,
  populate,
  populationPromises,
  req,
  select,
  selectMode,
  showHiddenFields,
  siblingDoc,
  triggerAccessControl = true,
  triggerHooks = true,
}: Args): void => {
  fields.forEach((field, fieldIndex) => {
    fieldPromises.push(
      promise({
        blockData,
        collection,
        context,
        currentDepth,
        depth,
        doc,
        draft,
        fallbackLocale,
        field,
        fieldIndex,
        fieldPromises,
        findMany,
        flattenLocales,
        global,
        locale,
        overrideAccess,
        parentIndexPath,
        parentIsLocalized,
        parentPath,
        parentSchemaPath,
        populate,
        populationPromises,
        req,
        select,
        selectMode,
        showHiddenFields,
        siblingDoc,
        siblingFields: fields,
        triggerAccessControl,
        triggerHooks,
      }),
    )
  })
}
```

--------------------------------------------------------------------------------

---[FILE: virtualFieldPopulationPromise.ts]---
Location: payload-main/packages/payload/src/fields/hooks/afterRead/virtualFieldPopulationPromise.ts

```typescript
import type { TypedFallbackLocale } from '../../../index.js'
import type { PayloadRequest } from '../../../types/index.js'
import type { FlattenedField } from '../../config/types.js'

import { createDataloaderCacheKey } from '../../../collections/dataloader.js'

export const virtualFieldPopulationPromise = async ({
  name,
  draft,
  fallbackLocale,
  fields,
  hasMany,
  locale,
  overrideAccess,
  ref,
  req,
  segments,
  showHiddenFields,
  siblingDoc,
}: {
  draft: boolean
  fallbackLocale: TypedFallbackLocale
  fields: FlattenedField[]
  hasMany?: boolean
  locale: string
  name: string
  overrideAccess: boolean
  ref: any
  req: PayloadRequest
  segments: string[]
  shift?: boolean
  showHiddenFields: boolean
  siblingDoc: Record<string, unknown>
}): Promise<void> => {
  const currentSegment = segments.shift()

  if (!currentSegment) {
    return
  }

  const currentValue = ref[currentSegment]

  if (typeof currentValue === 'undefined') {
    return
  }

  // Final step
  if (segments.length === 0) {
    if (hasMany) {
      if (!Array.isArray(siblingDoc[name])) {
        siblingDoc[name] = []
      }
      ;(siblingDoc[name] as any[]).push(currentValue)
    } else {
      siblingDoc[name] = currentValue
    }
    return
  }

  const currentField = fields.find((each) => each.name === currentSegment)

  if (!currentField) {
    return
  }

  if (currentField.type === 'group' || currentField.type === 'tab') {
    if (!currentValue || typeof currentValue !== 'object') {
      return
    }

    return virtualFieldPopulationPromise({
      name,
      draft,
      fallbackLocale,
      fields: currentField.flattenedFields,
      locale,
      overrideAccess,
      ref: currentValue,
      req,
      segments,
      showHiddenFields,
      siblingDoc,
    })
  }

  if (
    (currentField.type === 'relationship' || currentField.type === 'upload') &&
    typeof currentField.relationTo === 'string'
  ) {
    const select = {}
    let currentSelectRef: any = select
    const currentFields = req.payload.collections[currentField.relationTo]?.config.flattenedFields

    for (let i = 0; i < segments.length; i++) {
      const field = currentFields?.find((each) => each.name === segments[i])

      const shouldBreak =
        i === segments.length - 1 || field?.type === 'relationship' || field?.type === 'upload'

      currentSelectRef[segments[i]!] = shouldBreak ? true : {}
      currentSelectRef = currentSelectRef[segments[i]!]

      if (shouldBreak) {
        break
      }
    }

    if (currentField.hasMany) {
      if (!Array.isArray(currentValue)) {
        return
      }

      const docIDs = currentValue
        .map((e) => {
          if (!e) {
            return null
          }
          if (typeof e === 'object') {
            return e.id
          }
          return e
        })
        .filter((e) => typeof e === 'string' || typeof e === 'number')

      if (segments[0] === 'id' && segments.length === 0) {
        siblingDoc[name] = docIDs
        return
      }

      const collectionSlug = currentField.relationTo

      const populatedDocs = await Promise.all(
        docIDs.map((docID) => {
          return req.payloadDataLoader.load(
            createDataloaderCacheKey({
              collectionSlug,
              currentDepth: 0,
              depth: 0,
              docID,
              draft,
              fallbackLocale,
              locale,
              overrideAccess,
              select,
              showHiddenFields,
              transactionID: req.transactionID as number,
            }),
          )
        }),
      )

      for (const doc of populatedDocs) {
        if (!doc) {
          continue
        }

        await virtualFieldPopulationPromise({
          name,
          draft,
          fallbackLocale,
          fields: req.payload.collections[currentField.relationTo]!.config.flattenedFields,
          hasMany: true,
          locale,
          overrideAccess,
          ref: doc,
          req,
          segments: [...segments],
          showHiddenFields,
          siblingDoc,
        })
      }

      return
    }

    let docID: number | string

    if (typeof currentValue === 'object' && currentValue) {
      docID = currentValue.id
    } else {
      docID = currentValue
    }

    if (segments[0] === 'id' && segments.length === 0) {
      siblingDoc[name] = docID
      return
    }

    if (typeof docID !== 'string' && typeof docID !== 'number') {
      return
    }

    const populatedDoc = await req.payloadDataLoader.load(
      createDataloaderCacheKey({
        collectionSlug: currentField.relationTo,
        currentDepth: 0,
        depth: 0,
        docID,
        draft,
        fallbackLocale,
        locale,
        overrideAccess,
        select,
        showHiddenFields,
        transactionID: req.transactionID as number,
      }),
    )

    if (!populatedDoc) {
      return
    }

    return virtualFieldPopulationPromise({
      name,
      draft,
      fallbackLocale,
      fields: req.payload.collections[currentField.relationTo]!.config.flattenedFields,
      hasMany,
      locale,
      overrideAccess,
      ref: populatedDoc,
      req,
      segments,
      showHiddenFields,
      siblingDoc,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: cloneDataFromOriginalDoc.ts]---
Location: payload-main/packages/payload/src/fields/hooks/beforeChange/cloneDataFromOriginalDoc.ts

```typescript
import type { JsonArray, JsonObject } from '../../../types/index.js'

export const cloneDataFromOriginalDoc = (
  originalDocData: JsonArray | JsonObject,
): JsonArray | JsonObject => {
  if (Array.isArray(originalDocData)) {
    return originalDocData.map((row) => {
      if (typeof row === 'object' && row != null) {
        return {
          ...row,
        }
      }

      return row
    })
  }

  if (typeof originalDocData === 'object' && originalDocData !== null) {
    return { ...originalDocData }
  }

  return originalDocData
}
```

--------------------------------------------------------------------------------

---[FILE: getExistingRowDoc.ts]---
Location: payload-main/packages/payload/src/fields/hooks/beforeChange/getExistingRowDoc.ts

```typescript
/**
 * If there is an incoming row id,
 * and it matches the existing sibling doc id,
 * this is an existing row, so it should be merged.
 * Otherwise, return an empty object.
 */
import type { JsonObject } from '../../../types/index.js'

export const getExistingRowDoc = (incomingRow: JsonObject, existingRows?: unknown): JsonObject => {
  if (incomingRow.id && Array.isArray(existingRows)) {
    const matchedExistingRow = existingRows.find((existingRow) => {
      if (typeof existingRow === 'object' && 'id' in existingRow) {
        if (existingRow.id === incomingRow.id) {
          return existingRow
        }
      }

      return false
    })

    if (matchedExistingRow) {
      return matchedExistingRow
    }
  }

  return {}
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/fields/hooks/beforeChange/index.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { ValidationFieldError } from '../../../errors/index.js'
import type { SanitizedGlobalConfig } from '../../../globals/config/types.js'
import type { RequestContext } from '../../../index.js'
import type { JsonObject, Operation, PayloadRequest } from '../../../types/index.js'

import { ValidationError } from '../../../errors/index.js'
import { deepCopyObjectSimple } from '../../../utilities/deepCopyObject.js'
import { traverseFields } from './traverseFields.js'

export type Args<T extends JsonObject> = {
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  data: T
  doc: T
  docWithLocales: JsonObject
  global: null | SanitizedGlobalConfig
  id?: number | string
  operation: Operation
  overrideAccess?: boolean
  req: PayloadRequest
  skipValidation?: boolean
}

/**
 * This function is responsible for the following actions, in order:
 * - Run condition
 * - Execute field hooks
 * - Validate data
 * - Transform data for storage
 * - Unflatten locales. The input `data` is the normal document for one locale. The output result will become the document with locales.
 */

export const beforeChange = async <T extends JsonObject>({
  id,
  collection,
  context,
  data: incomingData,
  doc,
  docWithLocales,
  global,
  operation,
  overrideAccess,
  req,
  skipValidation,
}: Args<T>): Promise<T> => {
  const data = deepCopyObjectSimple(incomingData)
  const mergeLocaleActions: (() => Promise<void> | void)[] = []
  const errors: ValidationFieldError[] = []

  await traverseFields({
    id,
    collection,
    context,
    data,
    doc,
    docWithLocales,
    errors,
    fieldLabelPath: '',
    fields: (collection?.fields || global?.fields)!,
    global,
    mergeLocaleActions,
    operation,
    overrideAccess: overrideAccess!,
    parentIndexPath: '',
    parentIsLocalized: false,
    parentPath: '',
    parentSchemaPath: '',
    req,
    siblingData: data,
    siblingDoc: doc,
    siblingDocWithLocales: docWithLocales,
    skipValidation,
  })

  if (errors.length > 0) {
    throw new ValidationError(
      {
        id,
        collection: collection?.slug,
        errors,
        global: global?.slug,
        req,
      },
      req.t,
    )
  }

  for (const action of mergeLocaleActions) {
    await action()
  }

  return data
}
```

--------------------------------------------------------------------------------

---[FILE: promise.ts]---
Location: payload-main/packages/payload/src/fields/hooks/beforeChange/promise.ts

```typescript
import type { RichTextAdapter } from '../../../admin/RichText.js'
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { ValidationFieldError } from '../../../errors/index.js'
import type { SanitizedGlobalConfig } from '../../../globals/config/types.js'
import type { JsonObject, Operation, PayloadRequest } from '../../../types/index.js'
import type { Block, Field, TabAsField, Validate } from '../../config/types.js'

import { MissingEditorProp } from '../../../errors/index.js'
import { type RequestContext, validateBlocksFilterOptions } from '../../../index.js'
import { deepMergeWithSourceArrays } from '../../../utilities/deepMerge.js'
import { getTranslatedLabel } from '../../../utilities/getTranslatedLabel.js'
import { fieldAffectsData, fieldShouldBeLocalized, tabHasName } from '../../config/types.js'
import { getFieldPathsModified as getFieldPaths } from '../../getFieldPaths.js'
import { getExistingRowDoc } from './getExistingRowDoc.js'
import { traverseFields } from './traverseFields.js'

function buildFieldLabel(parentLabel: string, label: string | undefined): string {
  if (!label) {
    return parentLabel
  }
  const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1)
  return parentLabel && capitalizedLabel
    ? `${parentLabel} > ${capitalizedLabel}`
    : capitalizedLabel || parentLabel
}

type Args = {
  /**
   * Data of the nearest parent block. If no parent block exists, this will be the `undefined`
   */
  blockData?: JsonObject
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  data: JsonObject
  doc: JsonObject
  docWithLocales: JsonObject
  errors: ValidationFieldError[]
  field: Field | TabAsField
  fieldIndex: number
  /**
   * Built up labels of parent fields
   *
   * @example "Group Field > Tab Field > Text Field"
   */
  fieldLabelPath: string
  global: null | SanitizedGlobalConfig
  id?: number | string
  mergeLocaleActions: (() => Promise<void> | void)[]
  operation: Operation
  overrideAccess: boolean
  parentIndexPath: string
  parentIsLocalized: boolean
  parentPath: string
  parentSchemaPath: string
  req: PayloadRequest
  siblingData: JsonObject
  siblingDoc: JsonObject
  siblingDocWithLocales?: JsonObject
  siblingFields?: (Field | TabAsField)[]
  skipValidation: boolean
}

// This function is responsible for the following actions, in order:
// - Run condition
// - Execute field hooks
// - Validate data
// - Transform data for storage
// - beforeDuplicate hooks (if duplicate)
// - Unflatten locales

export const promise = async ({
  id,
  blockData,
  collection,
  context,
  data,
  doc,
  docWithLocales,
  errors,
  field,
  fieldIndex,
  fieldLabelPath,
  global,
  mergeLocaleActions,
  operation,
  overrideAccess,
  parentIndexPath,
  parentIsLocalized,
  parentPath,
  parentSchemaPath,
  req,
  siblingData,
  siblingDoc,
  siblingDocWithLocales,
  siblingFields,
  skipValidation,
}: Args): Promise<void> => {
  const { indexPath, path, schemaPath } = getFieldPaths({
    field,
    index: fieldIndex,
    parentIndexPath,
    parentPath,
    parentSchemaPath,
  })

  const { localization } = req.payload.config
  const defaultLocale = localization ? localization?.defaultLocale : 'en'
  const operationLocale = req.locale || defaultLocale

  const pathSegments = path ? path.split('.') : []
  const schemaPathSegments = schemaPath ? schemaPath.split('.') : []
  const indexPathSegments = indexPath ? indexPath.split('-').filter(Boolean)?.map(Number) : []

  const passesCondition = field.admin?.condition
    ? Boolean(
        field.admin.condition(data, siblingData, {
          blockData: blockData!,
          operation,
          path: pathSegments,
          user: req.user,
        }),
      )
    : true
  let skipValidationFromHere = skipValidation || !passesCondition

  if (fieldAffectsData(field)) {
    // skip validation if the field is localized and the incoming data is null
    if (fieldShouldBeLocalized({ field, parentIsLocalized }) && operationLocale !== defaultLocale) {
      if (['array', 'blocks'].includes(field.type) && siblingData[field.name!] === null) {
        skipValidationFromHere = true
      }
    }

    // Execute hooks
    if ('hooks' in field && field.hooks?.beforeChange) {
      for (const hook of field.hooks.beforeChange) {
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
          previousSiblingDoc: siblingDoc,
          previousValue: siblingDoc[field.name],
          req,
          schemaPath: schemaPathSegments,
          siblingData,
          siblingDocWithLocales,
          siblingFields: siblingFields!,
          value: siblingData[field.name],
        })

        if (hookedValue !== undefined) {
          siblingData[field.name] = hookedValue
        }
      }
    }

    // Validate
    if (!skipValidationFromHere && 'validate' in field && field.validate) {
      const valueToValidate = siblingData[field.name]
      let jsonError: object

      if (field.type === 'json' && typeof siblingData[field.name] === 'string') {
        try {
          JSON.parse(siblingData[field.name] as string)
        } catch (e) {
          jsonError = e as object
        }
      }

      const validateFn: Validate<object, object, object, object> = field.validate as Validate<
        object,
        object,
        object,
        object
      >

      const validationResult = await validateFn(valueToValidate as never, {
        ...field,
        id,
        blockData: blockData!,
        collectionSlug: collection?.slug,
        data: deepMergeWithSourceArrays(doc, data),
        event: 'submit',
        // @ts-expect-error
        jsonError,
        operation,
        overrideAccess,
        path: pathSegments,
        preferences: { fields: {} },
        previousValue: siblingDoc[field.name],
        req,
        siblingData: deepMergeWithSourceArrays(siblingDoc, siblingData),
      })

      if (typeof validationResult === 'string') {
        let filterOptionsError = false

        if (field.type === 'blocks' && field.filterOptions) {
          // Re-run filteroptions. If the validation error is due to filteroptions, we need to add error paths to all the blocks
          // that are no longer valid
          const validationResult = await validateBlocksFilterOptions({
            id,
            data,
            filterOptions: field.filterOptions,
            req,
            siblingData,
            value: siblingData[field.name],
          })
          if (validationResult?.invalidBlockSlugs?.length) {
            filterOptionsError = true
            let rowIndex = -1
            for (const block of siblingData[field.name] as JsonObject[]) {
              rowIndex++
              if (validationResult.invalidBlockSlugs.includes(block.blockType as string)) {
                const blockConfigOrSlug = (field.blockReferences ?? field.blocks).find(
                  (blockFromField) =>
                    typeof blockFromField === 'string'
                      ? blockFromField === block.blockType
                      : blockFromField.slug === block.blockType,
                ) as Block | undefined
                const blockConfig =
                  typeof blockConfigOrSlug !== 'string'
                    ? blockConfigOrSlug
                    : req.payload.config?.blocks?.[blockConfigOrSlug]

                const blockLabelPath =
                  field?.label === false
                    ? fieldLabelPath
                    : buildFieldLabel(
                        fieldLabelPath,
                        `${getTranslatedLabel(field?.label || field?.name, req.i18n)} > ${req.t('fields:block')} ${rowIndex + 1} (${getTranslatedLabel(blockConfig?.labels?.singular || block.blockType, req.i18n)})`,
                      )

                errors.push({
                  label: blockLabelPath,
                  message: req.t('validation:invalidBlock', { block: block.blockType }),
                  path: `${path}.${rowIndex}.id`,
                })
              }
            }
          }
        }

        if (!filterOptionsError) {
          // If the error is due to block filterOptions, we want to push the errors for each individual block, not the blocks
          // field itself => only push the error if the field is not a block field with validation failure due to filterOptions
          const fieldLabel = buildFieldLabel(
            fieldLabelPath,
            getTranslatedLabel(field?.label || field?.name, req.i18n),
          )

          errors.push({
            label: fieldLabel,
            message: validationResult,
            path,
          })
        }
      }
    }

    // Push merge locale action if applicable
    if (localization && fieldShouldBeLocalized({ field, parentIsLocalized })) {
      mergeLocaleActions.push(() => {
        const localeData: Record<string, unknown> = {}

        for (const locale of localization.localeCodes) {
          const fieldValue =
            locale === req.locale
              ? siblingData[field.name!]
              : siblingDocWithLocales?.[field.name!]?.[locale]

          // update locale value if it's not undefined
          if (typeof fieldValue !== 'undefined') {
            localeData[locale] = fieldValue
          }
        }

        // If there are locales with data, set the data
        if (Object.keys(localeData).length > 0) {
          siblingData[field.name!] = localeData
        }
      })
    }
  }

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
              docWithLocales,
              errors,
              fieldLabelPath:
                field?.label === false
                  ? fieldLabelPath
                  : buildFieldLabel(
                      fieldLabelPath,
                      `${getTranslatedLabel(field?.label || field?.name, req.i18n)} ${rowIndex + 1}`,
                    ),
              fields: field.fields,
              global,
              mergeLocaleActions,
              operation,
              overrideAccess,
              parentIndexPath: '',
              parentIsLocalized: parentIsLocalized || field.localized,
              parentPath: path + '.' + rowIndex,
              parentSchemaPath: schemaPath,
              req,
              siblingData: row as JsonObject,
              siblingDoc: getExistingRowDoc(row as JsonObject, siblingDoc[field.name]),
              siblingDocWithLocales: getExistingRowDoc(
                row as JsonObject,
                siblingDocWithLocales?.[field.name],
              ),
              skipValidation: skipValidationFromHere,
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

          const rowSiblingDocWithLocales = getExistingRowDoc(
            row as JsonObject,
            siblingDocWithLocales ? siblingDocWithLocales[field.name] : {},
          )

          const blockTypeToMatch = (row as JsonObject).blockType || rowSiblingDoc.blockType

          const block: Block | undefined =
            req.payload.blocks[blockTypeToMatch] ??
            ((field.blockReferences ?? field.blocks).find(
              (curBlock) => typeof curBlock !== 'string' && curBlock.slug === blockTypeToMatch,
            ) as Block | undefined)

          const blockLabelPath =
            field?.label === false
              ? fieldLabelPath
              : buildFieldLabel(
                  fieldLabelPath,
                  `${getTranslatedLabel(field?.label || field?.name, req.i18n)} > ${req.t('fields:block')} ${rowIndex + 1} (${getTranslatedLabel(block?.labels?.singular || blockTypeToMatch, req.i18n)})`,
                )

          if (block) {
            promises.push(
              traverseFields({
                id,
                blockData: row,
                collection,
                context,
                data,
                doc,
                docWithLocales,
                errors,
                fieldLabelPath: blockLabelPath,

                fields: block.fields,
                global,
                mergeLocaleActions,
                operation,
                overrideAccess,
                parentIndexPath: '',
                parentIsLocalized: parentIsLocalized || field.localized,
                parentPath: path + '.' + rowIndex,
                parentSchemaPath: schemaPath + '.' + block.slug,
                req,
                siblingData: row as JsonObject,
                siblingDoc: rowSiblingDoc,
                siblingDocWithLocales: rowSiblingDocWithLocales,
                skipValidation: skipValidationFromHere,
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
        docWithLocales,
        errors,
        fieldLabelPath:
          field.type === 'row' || field?.label === false
            ? fieldLabelPath
            : buildFieldLabel(
                fieldLabelPath,
                getTranslatedLabel(field?.label || field?.type, req.i18n),
              ),
        fields: field.fields,
        global,
        mergeLocaleActions,
        operation,
        overrideAccess,
        parentIndexPath: indexPath,
        parentIsLocalized,
        parentPath,
        parentSchemaPath: schemaPath,
        req,
        siblingData,
        siblingDoc,
        siblingDocWithLocales: siblingDocWithLocales!,
        skipValidation: skipValidationFromHere,
      })

      break
    }

    case 'group': {
      let groupSiblingData = siblingData
      let groupSiblingDoc = siblingDoc
      let groupSiblingDocWithLocales = siblingDocWithLocales

      const isNamedGroup = fieldAffectsData(field)

      if (isNamedGroup) {
        if (typeof siblingData[field.name] !== 'object') {
          siblingData[field.name] = {}
        }

        if (typeof siblingDoc[field.name] !== 'object') {
          siblingDoc[field.name] = {}
        }

        if (typeof siblingDocWithLocales![field.name] !== 'object') {
          siblingDocWithLocales![field.name] = {}
        }
        if (typeof siblingData[field.name] !== 'object') {
          siblingData[field.name] = {}
        }

        if (typeof siblingDoc[field.name] !== 'object') {
          siblingDoc[field.name] = {}
        }

        if (typeof siblingDocWithLocales![field.name] !== 'object') {
          siblingDocWithLocales![field.name] = {}
        }

        groupSiblingData = siblingData[field.name] as JsonObject
        groupSiblingDoc = siblingDoc[field.name] as JsonObject
        groupSiblingDocWithLocales = siblingDocWithLocales![field.name] as JsonObject
      }

      const fallbackLabel = field?.label || (isNamedGroup ? field.name : field?.type)

      await traverseFields({
        id,
        blockData,
        collection,
        context,
        data,
        doc,
        docWithLocales,
        errors,
        fieldLabelPath:
          field?.label === false
            ? fieldLabelPath
            : buildFieldLabel(fieldLabelPath, getTranslatedLabel(fallbackLabel, req.i18n)),
        fields: field.fields,
        global,
        mergeLocaleActions,
        operation,
        overrideAccess,
        parentIndexPath: isNamedGroup ? '' : indexPath,
        parentIsLocalized: parentIsLocalized || field.localized,
        parentPath: isNamedGroup ? path : parentPath,
        parentSchemaPath: schemaPath,
        req,
        siblingData: groupSiblingData,
        siblingDoc: groupSiblingDoc,
        siblingDocWithLocales: groupSiblingDocWithLocales!,
        skipValidation: skipValidationFromHere,
      })

      break
    }

    case 'point': {
      // Transform point data for storage
      if (
        Array.isArray(siblingData[field.name]) &&
        siblingData[field.name][0] !== null &&
        siblingData[field.name][1] !== null
      ) {
        siblingData[field.name] = {
          type: 'Point',
          coordinates: [
            parseFloat(siblingData[field.name][0]),
            parseFloat(siblingData[field.name][1]),
          ],
        }
      }

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

      if (editor?.hooks?.beforeChange?.length) {
        for (const hook of editor.hooks.beforeChange) {
          const hookedValue = await hook({
            collection,
            context,
            data,
            docWithLocales,
            errors,
            field,
            fieldLabelPath:
              field?.label === false
                ? fieldLabelPath
                : buildFieldLabel(
                    fieldLabelPath,
                    getTranslatedLabel(field?.label || field?.name, req.i18n),
                  ),
            global,
            indexPath: indexPathSegments,
            mergeLocaleActions,
            operation,
            originalDoc: doc,
            overrideAccess,
            parentIsLocalized,
            path: pathSegments,
            previousSiblingDoc: siblingDoc,
            previousValue: siblingDoc[field.name],
            req,
            schemaPath: schemaPathSegments,
            siblingData,
            siblingDocWithLocales,
            skipValidation,
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
      let tabSiblingData = siblingData
      let tabSiblingDoc = siblingDoc
      let tabSiblingDocWithLocales = siblingDocWithLocales

      const isNamedTab = tabHasName(field)

      if (isNamedTab) {
        if (typeof siblingData[field.name] !== 'object') {
          siblingData[field.name] = {}
        }

        if (typeof siblingDoc[field.name] !== 'object') {
          siblingDoc[field.name] = {}
        }

        if (typeof siblingDocWithLocales![field.name] !== 'object') {
          siblingDocWithLocales![field.name] = {}
        }

        tabSiblingData = siblingData[field.name] as JsonObject
        tabSiblingDoc = siblingDoc[field.name] as JsonObject
        tabSiblingDocWithLocales = siblingDocWithLocales![field.name] as JsonObject
      }

      await traverseFields({
        id,
        blockData,
        collection,
        context,
        data,
        doc,
        docWithLocales,
        errors,
        fieldLabelPath:
          field?.label === false
            ? fieldLabelPath
            : buildFieldLabel(
                fieldLabelPath,
                getTranslatedLabel(field?.label || field.name, req.i18n),
              ),
        fields: field.fields,
        global,
        mergeLocaleActions,
        operation,
        overrideAccess,
        parentIndexPath: isNamedTab ? '' : indexPath,
        parentIsLocalized: parentIsLocalized || field.localized,
        parentPath: isNamedTab ? path : parentPath,
        parentSchemaPath: schemaPath,
        req,
        siblingData: tabSiblingData,
        siblingDoc: tabSiblingDoc,
        siblingDocWithLocales: tabSiblingDocWithLocales!,
        skipValidation: skipValidationFromHere,
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
        docWithLocales,
        errors,
        fieldLabelPath:
          field?.label === false
            ? fieldLabelPath
            : buildFieldLabel(fieldLabelPath, getTranslatedLabel(field?.label || '', req.i18n)),
        fields: field.tabs.map((tab) => ({ ...tab, type: 'tab' })),
        global,
        mergeLocaleActions,
        operation,
        overrideAccess,
        parentIndexPath: indexPath,
        parentIsLocalized,
        parentPath: path,
        parentSchemaPath: schemaPath,
        req,
        siblingData,
        siblingDoc,
        siblingDocWithLocales: siblingDocWithLocales!,
        skipValidation: skipValidationFromHere,
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
Location: payload-main/packages/payload/src/fields/hooks/beforeChange/traverseFields.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { ValidationFieldError } from '../../../errors/index.js'
import type { SanitizedGlobalConfig } from '../../../globals/config/types.js'
import type { RequestContext } from '../../../index.js'
import type { JsonObject, Operation, PayloadRequest } from '../../../types/index.js'
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
  /**
   * The original data (not modified by any hooks)
   */
  doc: JsonObject
  /**
   * The original data with locales (not modified by any hooks)
   */
  docWithLocales: JsonObject
  errors: ValidationFieldError[]
  /**
   * Built up labels of parent fields
   *
   * @example "Group Field > Tab Field > Text Field"
   */
  fieldLabelPath: string
  fields: (Field | TabAsField)[]
  global: null | SanitizedGlobalConfig
  id?: number | string
  mergeLocaleActions: (() => Promise<void> | void)[]
  operation: Operation
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
  /**
   * The original siblingData with locales (not modified by any hooks)
   */
  siblingDocWithLocales: JsonObject
  skipValidation?: boolean
}

/**
 * This function is responsible for the following actions, in order:
 * - Run condition
 * - Execute field hooks
 * - Validate data
 * - Transform data for storage
 * - Unflatten locales. The input `data` is the normal document for one locale. The output result will become the document with locales.
 */
export const traverseFields = async ({
  id,
  blockData,
  collection,
  context,
  data,
  doc,
  docWithLocales,
  errors,
  fieldLabelPath,
  fields,
  global,
  mergeLocaleActions,
  operation,
  overrideAccess,
  parentIndexPath,
  parentIsLocalized,
  parentPath,
  parentSchemaPath,
  req,
  siblingData,
  siblingDoc,
  siblingDocWithLocales,
  skipValidation,
}: Args): Promise<void> => {
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
        docWithLocales,
        errors,
        field,
        fieldIndex,
        fieldLabelPath,
        global,
        mergeLocaleActions,
        operation,
        overrideAccess,
        parentIndexPath,
        parentIsLocalized: parentIsLocalized!,
        parentPath,
        parentSchemaPath,
        req,
        siblingData,
        siblingDoc,
        siblingDocWithLocales,
        siblingFields: fields,
        skipValidation: skipValidation!,
      }),
    )
  })

  await Promise.all(promises)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/fields/hooks/beforeDuplicate/index.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { RequestContext } from '../../../index.js'
import type { JsonObject, PayloadRequest } from '../../../types/index.js'

import { traverseFields } from './traverseFields.js'

type Args<T extends JsonObject> = {
  collection: null | SanitizedCollectionConfig
  context: RequestContext
  doc?: T
  id?: number | string
  overrideAccess: boolean
  req: PayloadRequest
}

/**
 * This function is responsible for running beforeDuplicate hooks
 * against a document including all locale data.
 * It will run each field's beforeDuplicate hook
 * and return the resulting docWithLocales.
 */
export const beforeDuplicate = async <T extends JsonObject>({
  id,
  collection,
  context,
  doc,
  overrideAccess,
  req,
}: Args<T>): Promise<T> => {
  await traverseFields({
    id,
    collection,
    context,
    doc,
    fields: collection!.fields,
    overrideAccess,
    parentIndexPath: '',
    parentIsLocalized: false,
    parentPath: '',
    parentSchemaPath: '',
    req,
    siblingDoc: doc!,
  })

  return doc!
}
```

--------------------------------------------------------------------------------

````
