---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 144
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 144 of 695)

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
Location: payload-main/packages/drizzle/src/transform/read/traverseFields.ts

```typescript
import type { FlattenedBlock, FlattenedField, JoinQuery, SanitizedConfig } from 'payload'

import { fieldIsVirtual, fieldShouldBeLocalized } from 'payload/shared'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from '../../types.js'
import type { BlocksMap } from '../../utilities/createBlocksMap.js'

import { getArrayRelationName } from '../../utilities/getArrayRelationName.js'
import { resolveBlockTableName } from '../../utilities/validateExistingBlockIsIdentical.js'
import { transformHasManyNumber } from './hasManyNumber.js'
import { transformHasManyText } from './hasManyText.js'
import { transformRelationship } from './relationship.js'

type TraverseFieldsArgs = {
  /**
   * The DB adapter
   */
  adapter: DrizzleAdapter
  /**
   * Pre-formatted blocks map
   */
  blocks: BlocksMap
  /**
   * The full Payload config
   */
  config: SanitizedConfig
  currentTableName: string
  /**
   * The data reference to be mutated within this recursive function
   */
  dataRef: Record<string, unknown>
  /**
   * Data that needs to be removed from the result after all fields have populated
   */
  deletions: (() => void)[]
  /**
   * Column prefix can be built up by group and named tab fields
   */
  fieldPrefix: string
  /**
   * An array of Payload fields to traverse
   */
  fields: FlattenedField[]
  /**
   *
   */
  joinQuery?: JoinQuery
  /**
   * All hasMany number fields, as returned by Drizzle, keyed on an object by field path
   */
  numbers: Record<string, Record<string, unknown>[]>
  parentIsLocalized: boolean
  /**
   * The current field path (in dot notation), used to merge in relationships
   */
  path: string
  /**
   * All related documents, as returned by Drizzle, keyed on an object by field path
   */
  relationships: Record<string, Record<string, unknown>[]>
  /**
   * Data structure representing the nearest table from db
   */
  table: Record<string, unknown>
  tablePath: string
  /**
   * All hasMany text fields, as returned by Drizzle, keyed on an object by field path
   */
  texts: Record<string, Record<string, unknown>[]>
  topLevelTableName: string
  /**
   * Set to a locale if this group of fields is within a localized array or block.
   */
  withinArrayOrBlockLocale?: string
}

// Traverse fields recursively, transforming data
// for each field type into required Payload shape
export const traverseFields = <T extends Record<string, unknown>>({
  adapter,
  blocks,
  config,
  currentTableName,
  dataRef,
  deletions,
  fieldPrefix,
  fields,
  joinQuery,
  numbers,
  parentIsLocalized,
  path,
  relationships,
  table,
  tablePath,
  texts,
  topLevelTableName,
  withinArrayOrBlockLocale,
}: TraverseFieldsArgs): T => {
  const sanitizedPath = path ? `${path}.` : path
  const localeCodes =
    adapter.payload.config.localization && adapter.payload.config.localization.localeCodes

  const formatted = fields.reduce((result, field) => {
    if (fieldIsVirtual(field)) {
      return result
    }

    const fieldName = `${fieldPrefix || ''}${field.name}`
    let fieldData = table[fieldName]
    const localizedFieldData = {}
    const valuesToTransform: {
      ref: Record<string, unknown>
      table: Record<string, unknown>
    }[] = []

    if (fieldPrefix) {
      deletions.push(() => delete table[fieldName])
    }

    const isLocalized = fieldShouldBeLocalized({ field, parentIsLocalized })

    if (field.type === 'array') {
      const arrayTableName = adapter.tableNameMap.get(
        `${currentTableName}_${tablePath}${toSnakeCase(field.name)}`,
      )

      fieldData = table[getArrayRelationName({ field, path: fieldName, tableName: arrayTableName })]

      if (Array.isArray(fieldData)) {
        if (isLocalized) {
          result[field.name] = fieldData.reduce((arrayResult, row) => {
            if (typeof row._locale === 'string') {
              if (!arrayResult[row._locale]) {
                arrayResult[row._locale] = []
              }
              const locale = row._locale
              const data = {}
              delete row._locale
              if (row._uuid) {
                row.id = row._uuid
                delete row._uuid
              }

              const rowResult = traverseFields<T>({
                adapter,
                blocks,
                config,
                currentTableName: arrayTableName,
                dataRef: data,
                deletions,
                fieldPrefix: '',
                fields: field.flattenedFields,
                numbers,
                parentIsLocalized: parentIsLocalized || field.localized,
                path: `${sanitizedPath}${field.name}.${row._order - 1}`,
                relationships,
                table: row,
                tablePath: '',
                texts,
                topLevelTableName,
                withinArrayOrBlockLocale: locale,
              })

              if ('_order' in rowResult) {
                delete rowResult._order
              }

              arrayResult[locale].push(rowResult)
            }

            return arrayResult
          }, {})
        } else {
          result[field.name] = fieldData.reduce((acc, row, i) => {
            if (row._uuid) {
              row.id = row._uuid
              delete row._uuid
            }

            if ('_order' in row) {
              delete row._order
            }

            if (
              !withinArrayOrBlockLocale ||
              (withinArrayOrBlockLocale && withinArrayOrBlockLocale === row._locale)
            ) {
              if (row._locale) {
                delete row._locale
              }

              acc.push(
                traverseFields<T>({
                  adapter,
                  blocks,
                  config,
                  currentTableName: arrayTableName,
                  dataRef: row,
                  deletions,
                  fieldPrefix: '',
                  fields: field.flattenedFields,
                  numbers,
                  parentIsLocalized: parentIsLocalized || field.localized,
                  path: `${sanitizedPath}${field.name}.${i}`,
                  relationships,
                  table: row,
                  tablePath: '',
                  texts,
                  topLevelTableName,
                  withinArrayOrBlockLocale,
                }),
              )
            }

            return acc
          }, [])
        }
      }

      return result
    }

    if (field.type === 'blocks' && !adapter.blocksAsJSON) {
      const blockFieldPath = `${sanitizedPath}${field.name}`
      const blocksByPath = blocks[blockFieldPath]

      if (Array.isArray(blocksByPath)) {
        if (isLocalized) {
          result[field.name] = {}

          blocksByPath.forEach((row) => {
            if (row._uuid) {
              row.id = row._uuid
              delete row._uuid
            }
            if (typeof row._locale === 'string') {
              if (!result[field.name][row._locale]) {
                result[field.name][row._locale] = []
              }
              result[field.name][row._locale].push(row)
              delete row._locale
            }
          })

          Object.entries(result[field.name]).forEach(([locale, localizedBlocks]) => {
            result[field.name][locale] = localizedBlocks.map((row) => {
              const block =
                adapter.payload.blocks[row.blockType] ??
                ((field.blockReferences ?? field.blocks).find(
                  (block) => typeof block !== 'string' && block.slug === row.blockType,
                ) as FlattenedBlock | undefined)

              const tableName = resolveBlockTableName(
                block,
                adapter.tableNameMap.get(`${topLevelTableName}_blocks_${toSnakeCase(block.slug)}`),
              )

              if (block) {
                const blockResult = traverseFields<T>({
                  adapter,
                  blocks,
                  config,
                  currentTableName: tableName,
                  dataRef: row,
                  deletions,
                  fieldPrefix: '',
                  fields: block.flattenedFields,
                  numbers,
                  parentIsLocalized: parentIsLocalized || field.localized,
                  path: `${blockFieldPath}.${row._order - 1}`,
                  relationships,
                  table: row,
                  tablePath: '',
                  texts,
                  topLevelTableName,
                  withinArrayOrBlockLocale: locale,
                })

                delete blockResult._order
                return blockResult
              }

              return {}
            })
          })
        } else {
          // Add locale-specific index to have a proper blockFieldPath for current locale
          // because blocks can be in the same array for different locales!
          if (withinArrayOrBlockLocale && config.localization) {
            for (const locale of config.localization.localeCodes) {
              let localeIndex = 0

              for (let i = 0; i < blocksByPath.length; i++) {
                const row = blocksByPath[i]
                if (row._locale === locale) {
                  row._index = localeIndex
                  localeIndex++
                }
              }
            }
          }

          result[field.name] = blocksByPath.reduce((acc, row, i) => {
            delete row._order
            if (row._uuid) {
              row.id = row._uuid
              delete row._uuid
            }

            if (typeof row.blockType !== 'string') {
              return acc
            }

            const block =
              adapter.payload.blocks[row.blockType] ??
              ((field.blockReferences ?? field.blocks).find(
                (block) => typeof block !== 'string' && block.slug === row.blockType,
              ) as FlattenedBlock | undefined)

            if (block) {
              if (
                !withinArrayOrBlockLocale ||
                (withinArrayOrBlockLocale && withinArrayOrBlockLocale === row._locale)
              ) {
                if (row._locale) {
                  delete row._locale
                }
                if (typeof row._index === 'number') {
                  i = row._index
                  delete row._index
                }

                const tableName = resolveBlockTableName(
                  block,
                  adapter.tableNameMap.get(
                    `${topLevelTableName}_blocks_${toSnakeCase(block.slug)}`,
                  ),
                )

                acc.push(
                  traverseFields<T>({
                    adapter,
                    blocks,
                    config,
                    currentTableName: tableName,
                    dataRef: row,
                    deletions,
                    fieldPrefix: '',
                    fields: block.flattenedFields,
                    numbers,
                    parentIsLocalized: parentIsLocalized || field.localized,
                    path: `${blockFieldPath}.${i}`,
                    relationships,
                    table: row,
                    tablePath: '',
                    texts,
                    topLevelTableName,
                    withinArrayOrBlockLocale,
                  }),
                )

                return acc
              }
            } else {
              acc.push({})
            }

            return acc
          }, [])
        }
      }

      return result
    }

    if (
      (field.type === 'relationship' || field.type === 'upload') &&
      (Array.isArray(field.relationTo) || field.hasMany)
    ) {
      const relationPathMatch = relationships[`${sanitizedPath}${field.name}`]

      if (!relationPathMatch) {
        if ('hasMany' in field && field.hasMany) {
          if (isLocalized && config.localization && config.localization.locales) {
            result[field.name] = {
              [config.localization.defaultLocale]: [],
            }
          } else {
            result[field.name] = []
          }
        }

        return result
      }

      if (isLocalized) {
        result[field.name] = {}
        const relationsByLocale: Record<string, Record<string, unknown>[]> = {}

        relationPathMatch.forEach((row) => {
          if (typeof row.locale === 'string') {
            if (!relationsByLocale[row.locale]) {
              relationsByLocale[row.locale] = []
            }
            relationsByLocale[row.locale].push(row)
          }
        })

        Object.entries(relationsByLocale).forEach(([locale, relations]) => {
          transformRelationship({
            field,
            locale,
            ref: result,
            relations,
          })
        })
      } else {
        transformRelationship({
          field,
          ref: result,
          relations: relationPathMatch,
          withinArrayOrBlockLocale,
        })
      }
      return result
    }

    if (field.type === 'join') {
      const { count, limit = field.defaultLimit ?? 10 } =
        joinQuery?.[`${fieldPrefix.replaceAll('_', '.')}${field.name}`] || {}

      // raw hasMany results from SQLite
      if (typeof fieldData === 'string') {
        fieldData = JSON.parse(fieldData)
      }

      let fieldResult:
        | { docs: unknown[]; hasNextPage: boolean; totalDocs?: number }
        | Record<string, { docs: unknown[]; hasNextPage: boolean; totalDocs?: number }>
      if (Array.isArray(fieldData)) {
        if (isLocalized && adapter.payload.config.localization) {
          fieldResult = fieldData.reduce(
            (joinResult, row) => {
              if (typeof row.locale === 'string') {
                joinResult[row.locale].docs.push(row.id)
              }

              return joinResult
            },

            // initialize with defaults so empty won't be undefined
            adapter.payload.config.localization.localeCodes.reduce((acc, code) => {
              acc[code] = {
                docs: [],
                hasNextPage: false,
              }
              return acc
            }, {}),
          )
          Object.keys(fieldResult).forEach((locale) => {
            fieldResult[locale].hasNextPage = fieldResult[locale].docs.length > limit
            fieldResult[locale].docs = fieldResult[locale].docs.slice(0, limit)
          })
        } else {
          const hasNextPage = limit !== 0 && fieldData.length > limit
          fieldResult = {
            docs: (hasNextPage ? fieldData.slice(0, limit) : fieldData).map(
              ({ id, relationTo }) => {
                if (relationTo) {
                  return { relationTo, value: id }
                }
                return { id }
              },
            ),
            hasNextPage,
          }
        }
      }

      if (count) {
        const countPath = `${fieldName}_count`
        if (typeof table[countPath] !== 'undefined') {
          let value = Number(table[countPath])
          if (Number.isNaN(value)) {
            value = 0
          }
          fieldResult.totalDocs = value
        }
      }

      result[field.name] = fieldResult
      return result
    }

    if (field.type === 'text' && field?.hasMany) {
      const textPathMatch = texts[`${sanitizedPath}${field.name}`]
      if (!textPathMatch) {
        result[field.name] =
          isLocalized && localeCodes
            ? Object.fromEntries(localeCodes.map((locale) => [locale, []]))
            : []
        return result
      }

      if (isLocalized) {
        result[field.name] = {}
        const textsByLocale: Record<string, Record<string, unknown>[]> = {}

        textPathMatch.forEach((row) => {
          if (typeof row.locale === 'string') {
            if (!textsByLocale[row.locale]) {
              textsByLocale[row.locale] = []
            }
            textsByLocale[row.locale].push(row)
          }
        })

        Object.entries(textsByLocale).forEach(([locale, texts]) => {
          transformHasManyText({
            field,
            locale,
            ref: result,
            textRows: texts,
          })
        })
      } else {
        transformHasManyText({
          field,
          ref: result,
          textRows: textPathMatch,
          withinArrayOrBlockLocale,
        })
      }

      return result
    }

    if (field.type === 'number' && field.hasMany) {
      const numberPathMatch = numbers[`${sanitizedPath}${field.name}`]
      if (!numberPathMatch) {
        result[field.name] =
          isLocalized && localeCodes
            ? Object.fromEntries(localeCodes.map((locale) => [locale, []]))
            : []
        return result
      }

      if (isLocalized) {
        result[field.name] = {}
        const numbersByLocale: Record<string, Record<string, unknown>[]> = {}

        numberPathMatch.forEach((row) => {
          if (typeof row.locale === 'string') {
            if (!numbersByLocale[row.locale]) {
              numbersByLocale[row.locale] = []
            }
            numbersByLocale[row.locale].push(row)
          }
        })

        Object.entries(numbersByLocale).forEach(([locale, numbers]) => {
          transformHasManyNumber({
            field,
            locale,
            numberRows: numbers,
            ref: result,
          })
        })
      } else {
        transformHasManyNumber({
          field,
          numberRows: numberPathMatch,
          ref: result,
          withinArrayOrBlockLocale,
        })
      }

      return result
    }

    if (field.type === 'select' && field.hasMany) {
      if (Array.isArray(fieldData)) {
        if (isLocalized) {
          result[field.name] = fieldData.reduce((selectResult, row) => {
            if (typeof row.locale === 'string') {
              if (!selectResult[row.locale]) {
                selectResult[row.locale] = []
              }
              selectResult[row.locale].push(row.value)
            }

            return selectResult
          }, {})
        } else {
          let selectData = fieldData
          if (withinArrayOrBlockLocale) {
            selectData = selectData.filter(({ locale }) => locale === withinArrayOrBlockLocale)
          }
          result[field.name] = selectData.map(({ value }) => value)
        }
      }
      return result
    }

    if (isLocalized && Array.isArray(table._locales)) {
      if (!table._locales.length && localeCodes) {
        localeCodes.forEach((_locale) => (table._locales as unknown[]).push({ _locale }))
      }

      table._locales.forEach((localeRow) => {
        valuesToTransform.push({
          ref: localizedFieldData,
          table: {
            ...table,
            ...localeRow,
          },
        })
      })
    } else {
      valuesToTransform.push({ ref: result, table })
    }

    valuesToTransform.forEach(({ ref, table }) => {
      const fieldData = table[`${fieldPrefix || ''}${field.name}`]
      const locale = table?._locale
      let val = fieldData

      switch (field.type) {
        case 'date': {
          if (typeof fieldData === 'string') {
            val = new Date(fieldData).toISOString()
          }

          break
        }

        case 'group':
        case 'tab': {
          const groupFieldPrefix = `${fieldPrefix || ''}${field.name}_`
          const groupData = {}
          const locale = table._locale as string
          const refKey = isLocalized && locale ? locale : field.name

          if (isLocalized && locale) {
            delete table._locale
          }
          ref[refKey] = traverseFields<Record<string, unknown>>({
            adapter,
            blocks,
            config,
            currentTableName,
            dataRef: groupData as Record<string, unknown>,
            deletions,
            fieldPrefix: groupFieldPrefix,
            fields: field.flattenedFields,
            joinQuery,
            numbers,
            parentIsLocalized: parentIsLocalized || field.localized,
            path: `${sanitizedPath}${field.name}`,
            relationships,
            table,
            tablePath: `${tablePath}${toSnakeCase(field.name)}_`,
            texts,
            topLevelTableName,
            withinArrayOrBlockLocale: locale || withinArrayOrBlockLocale,
          })

          return
        }

        case 'number': {
          if (typeof fieldData === 'string') {
            val = Number.parseFloat(fieldData)
          }

          break
        }

        case 'point': {
          if (typeof fieldData === 'string') {
            val = JSON.parse(fieldData)
          }

          break
        }

        case 'relationship':
        case 'upload': {
          if (
            val &&
            typeof field.relationTo === 'string' &&
            adapter.payload.collections[field.relationTo].customIDType === 'number'
          ) {
            val = Number(val)
          }

          break
        }
        case 'text': {
          if (typeof fieldData === 'string') {
            val = String(fieldData)
          }

          break
        }

        default: {
          break
        }
      }
      if (typeof locale === 'string') {
        ref[locale] = val
      } else {
        result[field.name] = val
      }
    })

    if (Object.keys(localizedFieldData).length > 0) {
      result[field.name] = localizedFieldData
    }

    return result
  }, dataRef)

  if (Array.isArray(table._locales)) {
    deletions.push(() => delete table._locales)
  }

  return formatted as T
}
```

--------------------------------------------------------------------------------

---[FILE: array.ts]---
Location: payload-main/packages/drizzle/src/transform/write/array.ts

```typescript
import type { FlattenedArrayField } from 'payload'

import { fieldShouldBeLocalized } from 'payload/shared'

import type { DrizzleAdapter } from '../../types.js'
import type {
  ArrayRowToInsert,
  BlockRowToInsert,
  NumberToDelete,
  RelationshipToDelete,
  TextToDelete,
} from './types.js'

import { isArrayOfRows } from '../../utilities/isArrayOfRows.js'
import { traverseFields } from './traverseFields.js'

type Args = {
  adapter: DrizzleAdapter
  arrayTableName: string
  baseTableName: string
  blocks: {
    [blockType: string]: BlockRowToInsert[]
  }
  blocksToDelete: Set<string>
  data: unknown
  field: FlattenedArrayField
  locale?: string
  numbers: Record<string, unknown>[]
  numbersToDelete: NumberToDelete[]
  parentIsLocalized: boolean
  path: string
  relationships: Record<string, unknown>[]
  relationshipsToDelete: RelationshipToDelete[]
  selects: {
    [tableName: string]: Record<string, unknown>[]
  }
  texts: Record<string, unknown>[]
  textsToDelete: TextToDelete[]
  /**
   * Set to a locale code if this set of fields is traversed within a
   * localized array or block field
   */
  withinArrayOrBlockLocale?: string
}

export const transformArray = ({
  adapter,
  arrayTableName,
  baseTableName,
  blocks,
  blocksToDelete,
  data,
  field,
  locale,
  numbers,
  numbersToDelete,
  parentIsLocalized,
  path,
  relationships,
  relationshipsToDelete,
  selects,
  texts,
  textsToDelete,
  withinArrayOrBlockLocale,
}: Args) => {
  const newRows: ArrayRowToInsert[] = []

  const hasUUID = adapter.tables[arrayTableName]._uuid

  if (isArrayOfRows(data)) {
    data.forEach((arrayRow, i) => {
      const newRow: ArrayRowToInsert = {
        arrays: {},
        arraysToPush: {},
        locales: {},
        row: {
          _order: i + 1,
        },
      }

      // If we have declared a _uuid field on arrays,
      // that means the ID has to be unique,
      // and our ids within arrays are not unique.
      // So move the ID to a uuid field for storage
      // and allow the database to generate a serial id automatically
      if (hasUUID) {
        newRow.row._uuid = arrayRow.id
        delete arrayRow.id
      }

      if (locale) {
        newRow.locales[locale] = {
          _locale: locale,
        }
      }

      if (fieldShouldBeLocalized({ field, parentIsLocalized }) && locale) {
        newRow.row._locale = locale
      }

      if (withinArrayOrBlockLocale) {
        newRow.row._locale = withinArrayOrBlockLocale
      }

      traverseFields({
        adapter,
        arrays: newRow.arrays,
        arraysToPush: newRow.arraysToPush,
        baseTableName,
        blocks,
        blocksToDelete,
        columnPrefix: '',
        data: arrayRow,
        fieldPrefix: '',
        fields: field.flattenedFields,
        insideArrayOrBlock: true,
        locales: newRow.locales,
        numbers,
        numbersToDelete,
        parentIsLocalized: parentIsLocalized || field.localized,
        parentTableName: arrayTableName,
        path: `${path || ''}${field.name}.${i}.`,
        relationships,
        relationshipsToAppend: [],
        relationshipsToDelete,
        row: newRow.row,
        selects,
        texts,
        textsToDelete,
        withinArrayOrBlockLocale,
      })

      newRows.push(newRow)
    })
  }

  return newRows
}
```

--------------------------------------------------------------------------------

---[FILE: blocks.ts]---
Location: payload-main/packages/drizzle/src/transform/write/blocks.ts

```typescript
import type { FlattenedBlock, FlattenedBlocksField } from 'payload'

import { fieldShouldBeLocalized } from 'payload/shared'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from '../../types.js'
import type {
  BlockRowToInsert,
  NumberToDelete,
  RelationshipToDelete,
  TextToDelete,
} from './types.js'

import { resolveBlockTableName } from '../../utilities/validateExistingBlockIsIdentical.js'
import { traverseFields } from './traverseFields.js'

type Args = {
  adapter: DrizzleAdapter
  baseTableName: string
  blocks: {
    [blockType: string]: BlockRowToInsert[]
  }
  blocksToDelete: Set<string>
  data: Record<string, unknown>[]
  field: FlattenedBlocksField
  locale?: string
  numbers: Record<string, unknown>[]
  numbersToDelete: NumberToDelete[]
  parentIsLocalized: boolean
  path: string
  relationships: Record<string, unknown>[]
  relationshipsToDelete: RelationshipToDelete[]
  selects: {
    [tableName: string]: Record<string, unknown>[]
  }
  texts: Record<string, unknown>[]
  textsToDelete: TextToDelete[]
  /**
   * Set to a locale code if this set of fields is traversed within a
   * localized array or block field
   */
  withinArrayOrBlockLocale?: string
}
export const transformBlocks = ({
  adapter,
  baseTableName,
  blocks,
  blocksToDelete,
  data,
  field,
  locale,
  numbers,
  numbersToDelete,
  parentIsLocalized,
  path,
  relationships,
  relationshipsToDelete,
  selects,
  texts,
  textsToDelete,
  withinArrayOrBlockLocale,
}: Args) => {
  data.forEach((blockRow, i) => {
    if (typeof blockRow.blockType !== 'string') {
      return
    }

    const matchedBlock =
      adapter.payload.blocks[blockRow.blockType] ??
      ((field.blockReferences ?? field.blocks).find(
        (block) => typeof block !== 'string' && block.slug === blockRow.blockType,
      ) as FlattenedBlock | undefined)

    if (!matchedBlock) {
      return
    }
    const blockType = toSnakeCase(blockRow.blockType)

    const newRow: BlockRowToInsert = {
      arrays: {},
      arraysToPush: {},
      locales: {},
      row: {
        _order: i + 1,
        _path: `${path}${field.name}`,
      },
    }

    if (fieldShouldBeLocalized({ field, parentIsLocalized }) && locale) {
      newRow.row._locale = locale
    }
    if (withinArrayOrBlockLocale) {
      newRow.row._locale = withinArrayOrBlockLocale
    }

    const blockTableName = resolveBlockTableName(
      matchedBlock,
      adapter.tableNameMap.get(`${baseTableName}_blocks_${blockType}`),
    )

    if (!blocks[blockTableName]) {
      blocks[blockTableName] = []
    }

    const hasUUID = adapter.tables[blockTableName]._uuid

    // If we have declared a _uuid field on arrays,
    // that means the ID has to be unique,
    // and our ids within arrays are not unique.
    // So move the ID to a uuid field for storage
    // and allow the database to generate a serial id automatically
    if (hasUUID) {
      newRow.row._uuid = blockRow.id
      delete blockRow.id
    }

    traverseFields({
      adapter,
      arrays: newRow.arrays,
      arraysToPush: newRow.arraysToPush,
      baseTableName,
      blocks,
      blocksToDelete,
      columnPrefix: '',
      data: blockRow,
      fieldPrefix: '',
      fields: matchedBlock.flattenedFields,
      insideArrayOrBlock: true,
      locales: newRow.locales,
      numbers,
      numbersToDelete,
      parentIsLocalized: parentIsLocalized || field.localized,
      parentTableName: blockTableName,
      path: `${path || ''}${field.name}.${i}.`,
      relationships,
      relationshipsToAppend: [],
      relationshipsToDelete,
      row: newRow.row,
      selects,
      texts,
      textsToDelete,
      withinArrayOrBlockLocale,
    })

    blocks[blockTableName].push(newRow)
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/drizzle/src/transform/write/index.ts

```typescript
import type { FlattenedField } from 'payload'

import type { DrizzleAdapter } from '../../types.js'
import type { RowToInsert } from './types.js'

import { traverseFields } from './traverseFields.js'

type Args = {
  adapter: DrizzleAdapter
  data: Record<string, unknown>
  enableAtomicWrites?: boolean
  fields: FlattenedField[]
  parentIsLocalized?: boolean
  path?: string
  tableName: string
}

export const transformForWrite = ({
  adapter,
  data,
  enableAtomicWrites,
  fields,
  parentIsLocalized,
  path = '',
  tableName,
}: Args): RowToInsert => {
  // Split out the incoming data into rows to insert / delete
  const rowToInsert: RowToInsert = {
    arrays: {},
    arraysToPush: {},
    blocks: {},
    blocksToDelete: new Set(),
    locales: {},
    numbers: [],
    numbersToDelete: [],
    relationships: [],
    relationshipsToAppend: [],
    relationshipsToDelete: [],
    row: {},
    selects: {},
    texts: [],
    textsToDelete: [],
  }

  // This function is responsible for building up the
  // above rowToInsert
  traverseFields({
    adapter,
    arrays: rowToInsert.arrays,
    arraysToPush: rowToInsert.arraysToPush,
    baseTableName: tableName,
    blocks: rowToInsert.blocks,
    blocksToDelete: rowToInsert.blocksToDelete,
    columnPrefix: '',
    data,
    enableAtomicWrites,
    fieldPrefix: '',
    fields,
    locales: rowToInsert.locales,
    numbers: rowToInsert.numbers,
    numbersToDelete: rowToInsert.numbersToDelete,
    parentIsLocalized,
    parentTableName: tableName,
    path,
    relationships: rowToInsert.relationships,
    relationshipsToAppend: rowToInsert.relationshipsToAppend,
    relationshipsToDelete: rowToInsert.relationshipsToDelete,
    row: rowToInsert.row,
    selects: rowToInsert.selects,
    texts: rowToInsert.texts,
    textsToDelete: rowToInsert.textsToDelete,
  })

  return rowToInsert
}
```

--------------------------------------------------------------------------------

---[FILE: numbers.ts]---
Location: payload-main/packages/drizzle/src/transform/write/numbers.ts

```typescript
type Args = {
  baseRow: Record<string, unknown>
  data: unknown[]
  numbers: Record<string, unknown>[]
}

export const transformNumbers = ({ baseRow, data, numbers }: Args) => {
  data.forEach((val, i) => {
    numbers.push({
      ...baseRow,
      number: val,
      order: i + 1,
    })
  })
}
```

--------------------------------------------------------------------------------

---[FILE: relationships.ts]---
Location: payload-main/packages/drizzle/src/transform/write/relationships.ts

```typescript
import type { RelationshipField, UploadField } from 'payload'

import { valueIsValueWithRelation } from 'payload/shared'

type Args = {
  baseRow: Record<string, unknown>
  data: unknown
  field: RelationshipField | UploadField
  relationships: Record<string, unknown>[]
}

export const transformRelationship = ({ baseRow, data, field, relationships }: Args) => {
  const relations = Array.isArray(data) ? data : [data]

  relations.forEach((relation, i) => {
    if (relation) {
      const relationRow = { ...baseRow }
      if ('hasMany' in field && field.hasMany) {
        relationRow.order = i + 1
      }

      if (Array.isArray(field.relationTo) && valueIsValueWithRelation(relation)) {
        relationRow[`${relation.relationTo}ID`] = relation.value
        relationships.push(relationRow)
      } else if (typeof field.relationTo === 'string') {
        relationRow[`${field.relationTo}ID`] = relation
        if (relation) {
          relationships.push(relationRow)
        }
      }
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: selects.ts]---
Location: payload-main/packages/drizzle/src/transform/write/selects.ts

```typescript
import { isArrayOfRows } from '../../utilities/isArrayOfRows.js'

type Args = {
  data: unknown
  id?: unknown
  locale?: string
}

export const transformSelects = ({ id, data, locale }: Args) => {
  const newRows: Record<string, unknown>[] = []

  if (isArrayOfRows(data)) {
    data.forEach((value, i) => {
      const newRow: Record<string, unknown> = {
        order: i + 1,
        parent: id,
        value,
      }

      if (locale) {
        newRow.locale = locale
      }

      newRows.push(newRow)
    })
  }

  return newRows
}
```

--------------------------------------------------------------------------------

---[FILE: texts.ts]---
Location: payload-main/packages/drizzle/src/transform/write/texts.ts

```typescript
type Args = {
  baseRow: Record<string, unknown>
  data: unknown[]
  texts: Record<string, unknown>[]
}

export const transformTexts = ({ baseRow, data, texts }: Args) => {
  data.forEach((val, i) => {
    texts.push({
      ...baseRow,
      order: i + 1,
      text: val,
    })
  })
}
```

--------------------------------------------------------------------------------

````
