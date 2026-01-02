---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 142
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 142 of 695)

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
Location: payload-main/packages/drizzle/src/schema/traverseFields.ts

```typescript
import type { FlattenedField } from 'payload'

import { InvalidConfiguration } from 'payload'
import {
  fieldAffectsData,
  fieldIsVirtual,
  fieldShouldBeLocalized,
  optionIsObject,
} from 'payload/shared'
import toSnakeCase from 'to-snake-case'

import type {
  DrizzleAdapter,
  IDType,
  RawColumn,
  RawForeignKey,
  RawIndex,
  RawRelation,
  RelationMap,
  SetColumnID,
} from '../types.js'

import { createTableName } from '../createTableName.js'
import { buildIndexName } from '../utilities/buildIndexName.js'
import { getArrayRelationName } from '../utilities/getArrayRelationName.js'
import { hasLocalesTable } from '../utilities/hasLocalesTable.js'
import {
  InternalBlockTableNameIndex,
  setInternalBlockIndex,
  validateExistingBlockIsIdentical,
} from '../utilities/validateExistingBlockIsIdentical.js'
import { buildTable } from './build.js'
import { idToUUID } from './idToUUID.js'
import { withDefault } from './withDefault.js'

type Args = {
  adapter: DrizzleAdapter
  blocksTableNameMap: Record<string, number>
  columnPrefix?: string
  columns: Record<string, RawColumn>
  disableNotNull: boolean
  disableRelsTableUnique?: boolean
  disableUnique?: boolean
  fieldPrefix?: string
  fields: FlattenedField[]
  forceLocalized?: boolean
  indexes: Record<string, RawIndex>
  localesColumns: Record<string, RawColumn>
  localesIndexes: Record<string, RawIndex>
  newTableName: string
  parentIsLocalized: boolean
  parentTableName: string
  relationships: Set<string>
  relationsToBuild: RelationMap
  rootRelationsToBuild?: RelationMap
  rootTableIDColType: IDType
  rootTableName: string
  setColumnID: SetColumnID
  uniqueRelationships: Set<string>
  versions: boolean
  /**
   * Tracks whether or not this table is built
   * from the result of a localized array or block field at some point
   */
  withinLocalizedArrayOrBlock?: boolean
}

type Result = {
  hasLocalizedField: boolean
  hasLocalizedManyNumberField: boolean
  hasLocalizedManyTextField: boolean
  hasLocalizedRelationshipField: boolean
  hasManyNumberField: 'index' | boolean
  hasManyTextField: 'index' | boolean
}

export const traverseFields = ({
  adapter,
  blocksTableNameMap,
  columnPrefix,
  columns,
  disableNotNull,
  disableRelsTableUnique,
  disableUnique = false,
  fieldPrefix,
  fields,
  forceLocalized,
  indexes,
  localesColumns,
  localesIndexes,
  newTableName,
  parentIsLocalized,
  parentTableName,
  relationships,
  relationsToBuild,
  rootRelationsToBuild,
  rootTableIDColType,
  rootTableName,
  setColumnID,
  uniqueRelationships,
  versions,
  withinLocalizedArrayOrBlock,
}: Args): Result => {
  const throwValidationError = true
  let hasLocalizedField = false
  let hasLocalizedRelationshipField = false
  let hasManyTextField: 'index' | boolean = false
  let hasLocalizedManyTextField = false
  let hasManyNumberField: 'index' | boolean = false
  let hasLocalizedManyNumberField = false

  let parentIDColType: IDType = 'integer'

  const idColumn = columns.id

  if (idColumn && ['numeric', 'text', 'uuid', 'varchar'].includes(idColumn.type)) {
    parentIDColType = idColumn.type as IDType
  }

  fields.forEach((field) => {
    if ('name' in field && field.name === 'id') {
      return
    }
    if (fieldIsVirtual(field)) {
      return
    }

    let targetTable = columns
    let targetIndexes = indexes

    const columnName = `${columnPrefix || ''}${field.name[0] === '_' ? '_' : ''}${toSnakeCase(
      field.name,
    )}`
    const fieldName = `${fieldPrefix?.replace('.', '_') || ''}${field.name}`

    const isFieldLocalized = fieldShouldBeLocalized({ field, parentIsLocalized })

    // If field is localized,
    // add the column to the locale table instead of main table
    if (
      adapter.payload.config.localization &&
      (isFieldLocalized || forceLocalized) &&
      field.type !== 'array' &&
      (field.type !== 'blocks' || adapter.blocksAsJSON) &&
      (('hasMany' in field && field.hasMany !== true) || !('hasMany' in field))
    ) {
      hasLocalizedField = true
      targetTable = localesColumns
      targetIndexes = localesIndexes
    }

    if (
      (field.unique || field.index || ['relationship', 'upload'].includes(field.type)) &&
      !['array', 'blocks', 'group'].includes(field.type) &&
      !('hasMany' in field && field.hasMany === true) &&
      !('relationTo' in field && Array.isArray(field.relationTo))
    ) {
      const unique = disableUnique !== true && field.unique
      if (unique) {
        const constraintValue = `${fieldPrefix || ''}${field.name}`
        if (!adapter.fieldConstraints?.[rootTableName]) {
          adapter.fieldConstraints[rootTableName] = {}
        }
        adapter.fieldConstraints[rootTableName][`${columnName}_idx`] = constraintValue
      }

      const indexName = buildIndexName({ name: `${newTableName}_${columnName}`, adapter })

      targetIndexes[indexName] = {
        name: indexName,
        on: isFieldLocalized ? [fieldName, '_locale'] : fieldName,
        unique,
      }
    }

    switch (field.type) {
      case 'array': {
        const disableNotNullFromHere = Boolean(field.admin?.condition) || disableNotNull

        const arrayTableName = createTableName({
          adapter,
          config: field,
          parentTableName: newTableName,
          prefix: `${newTableName}_`,
          throwValidationError,
          versionsCustomName: versions,
        })

        const baseColumns: Record<string, RawColumn> = {
          _order: {
            name: '_order',
            type: 'integer',
            notNull: true,
          },
          _parentID: {
            name: '_parent_id',
            type: parentIDColType,
            notNull: true,
          },
        }

        const baseIndexes: Record<string, RawIndex> = {
          _orderIdx: {
            name: `${arrayTableName}_order_idx`,
            on: ['_order'],
          },
          _parentIDIdx: {
            name: `${arrayTableName}_parent_id_idx`,
            on: '_parentID',
          },
        }

        const baseForeignKeys: Record<string, RawForeignKey> = {
          _parentIDFk: {
            name: `${arrayTableName}_parent_id_fk`,
            columns: ['_parentID'],
            foreignColumns: [
              {
                name: 'id',
                table: parentTableName,
              },
            ],
            onDelete: 'cascade',
          },
        }

        const isLocalized =
          Boolean(isFieldLocalized && adapter.payload.config.localization) ||
          withinLocalizedArrayOrBlock ||
          forceLocalized

        if (isLocalized) {
          baseColumns._locale = {
            name: '_locale',
            type: 'enum',
            locale: true,
            notNull: true,
          }

          baseIndexes._localeIdx = {
            name: `${arrayTableName}_locale_idx`,
            on: '_locale',
          }
        }

        const {
          hasLocalizedManyNumberField: subHasLocalizedManyNumberField,
          hasLocalizedManyTextField: subHasLocalizedManyTextField,
          hasLocalizedRelationshipField: subHasLocalizedRelationshipField,
          hasManyNumberField: subHasManyNumberField,
          hasManyTextField: subHasManyTextField,
          relationsToBuild: subRelationsToBuild,
        } = buildTable({
          adapter,
          baseColumns,
          baseForeignKeys,
          baseIndexes,
          blocksTableNameMap,
          disableNotNull: disableNotNullFromHere,
          disableRelsTableUnique: true,
          disableUnique,
          fields: disableUnique ? idToUUID(field.flattenedFields) : field.flattenedFields,
          parentIsLocalized: parentIsLocalized || field.localized,
          rootRelationships: relationships,
          rootRelationsToBuild,
          rootTableIDColType,
          rootTableName,
          rootUniqueRelationships: uniqueRelationships,
          setColumnID,
          tableName: arrayTableName,
          versions,
          withinLocalizedArrayOrBlock: isLocalized,
        })

        if (subHasLocalizedManyNumberField) {
          hasLocalizedManyNumberField = subHasLocalizedManyNumberField
        }

        if (subHasLocalizedRelationshipField) {
          hasLocalizedRelationshipField = subHasLocalizedRelationshipField
        }

        if (subHasLocalizedManyTextField) {
          hasLocalizedManyTextField = subHasLocalizedManyTextField
        }

        if (subHasManyTextField) {
          if (!hasManyTextField || subHasManyTextField === 'index') {
            hasManyTextField = subHasManyTextField
          }
        }
        if (subHasManyNumberField) {
          if (!hasManyNumberField || subHasManyNumberField === 'index') {
            hasManyNumberField = subHasManyNumberField
          }
        }

        const relationName = getArrayRelationName({
          field,
          path: fieldName,
          tableName: arrayTableName,
        })

        relationsToBuild.set(relationName, {
          type: 'many',
          // arrays have their own localized table, independent of the base table.
          localized: false,
          target: arrayTableName,
        })

        const arrayRelations: Record<string, RawRelation> = {
          _parentID: {
            type: 'one',
            fields: [
              {
                name: '_parentID',
                table: arrayTableName,
              },
            ],
            references: ['id'],
            relationName,
            to: parentTableName,
          },
        }

        if (
          hasLocalesTable({
            fields: field.fields,
            parentIsLocalized: parentIsLocalized || field.localized,
          })
        ) {
          arrayRelations._locales = {
            type: 'many',
            relationName: '_locales',
            to: `${arrayTableName}${adapter.localesSuffix}`,
          }
        }

        subRelationsToBuild.forEach(({ type, localized, target }, key) => {
          if (type === 'one') {
            const arrayWithLocalized = localized
              ? `${arrayTableName}${adapter.localesSuffix}`
              : arrayTableName

            arrayRelations[key] = {
              type: 'one',
              fields: [
                {
                  name: key,
                  table: arrayWithLocalized,
                },
              ],
              references: ['id'],
              relationName: key,
              to: target,
            }
          }

          if (type === 'many') {
            arrayRelations[key] = {
              type: 'many',
              relationName: key,
              to: target,
            }
          }
        })

        adapter.rawRelations[arrayTableName] = arrayRelations

        break
      }
      case 'blocks': {
        if (adapter.blocksAsJSON) {
          targetTable[fieldName] = withDefault(
            {
              name: columnName,
              type: 'jsonb',
            },
            field,
          )
          break
        }

        const disableNotNullFromHere = Boolean(field.admin?.condition) || disableNotNull

        ;(field.blockReferences ?? field.blocks).forEach((_block) => {
          const block = typeof _block === 'string' ? adapter.payload.blocks[_block] : _block

          let blockTableName = createTableName({
            adapter,
            config: block,
            parentTableName: rootTableName,
            prefix: `${rootTableName}_blocks_`,
            throwValidationError,
            versionsCustomName: versions,
          })

          if (typeof blocksTableNameMap[blockTableName] === 'undefined') {
            blocksTableNameMap[blockTableName] = 1
          } else if (
            !adapter.rawTables[blockTableName] ||
            !validateExistingBlockIsIdentical({
              block,
              localized: field.localized,
              rootTableName,
              table: adapter.rawTables[blockTableName],
              tableLocales: adapter.rawTables[`${blockTableName}${adapter.localesSuffix}`],
            })
          ) {
            blocksTableNameMap[blockTableName]++
            setInternalBlockIndex(block, blocksTableNameMap[blockTableName])
            blockTableName = `${blockTableName}_${blocksTableNameMap[blockTableName]}`
          }
          let relationName = `_blocks_${block.slug}`
          if (typeof block[InternalBlockTableNameIndex] !== 'undefined') {
            relationName = `_blocks_${block.slug}_${block[InternalBlockTableNameIndex]}`
          }

          if (!adapter.rawTables[blockTableName]) {
            const baseColumns: Record<string, RawColumn> = {
              _order: {
                name: '_order',
                type: 'integer',
                notNull: true,
              },
              _parentID: {
                name: '_parent_id',
                type: rootTableIDColType,
                notNull: true,
              },
              _path: {
                name: '_path',
                type: 'text',
                notNull: true,
              },
            }

            const baseIndexes: Record<string, RawIndex> = {
              _orderIdx: {
                name: `${blockTableName}_order_idx`,
                on: '_order',
              },
              _parentIDIdx: {
                name: `${blockTableName}_parent_id_idx`,
                on: ['_parentID'],
              },
              _pathIdx: {
                name: `${blockTableName}_path_idx`,
                on: '_path',
              },
            }

            const baseForeignKeys: Record<string, RawForeignKey> = {
              _parentIdFk: {
                name: `${blockTableName}_parent_id_fk`,
                columns: ['_parentID'],
                foreignColumns: [
                  {
                    name: 'id',
                    table: rootTableName,
                  },
                ],
                onDelete: 'cascade',
              },
            }

            const isLocalized =
              Boolean(isFieldLocalized && adapter.payload.config.localization) ||
              withinLocalizedArrayOrBlock ||
              forceLocalized

            if (isLocalized) {
              baseColumns._locale = {
                name: '_locale',
                type: 'enum',
                locale: true,
                notNull: true,
              }

              baseIndexes._localeIdx = {
                name: `${blockTableName}_locale_idx`,
                on: '_locale',
              }
            }

            const {
              hasLocalizedManyNumberField: subHasLocalizedManyNumberField,
              hasLocalizedManyTextField: subHasLocalizedManyTextField,
              hasLocalizedRelationshipField: subHasLocalizedRelationshipField,
              hasManyNumberField: subHasManyNumberField,
              hasManyTextField: subHasManyTextField,
              relationsToBuild: subRelationsToBuild,
            } = buildTable({
              adapter,
              baseColumns,
              baseForeignKeys,
              baseIndexes,
              blocksTableNameMap,
              disableNotNull: disableNotNullFromHere,
              disableRelsTableUnique: true,
              disableUnique,
              fields: disableUnique ? idToUUID(block.flattenedFields) : block.flattenedFields,
              parentIsLocalized: parentIsLocalized || field.localized,
              rootRelationships: relationships,
              rootRelationsToBuild,
              rootTableIDColType,
              rootTableName,
              rootUniqueRelationships: uniqueRelationships,
              setColumnID,
              tableName: blockTableName,
              versions,
              withinLocalizedArrayOrBlock: isLocalized,
            })

            if (subHasLocalizedManyNumberField) {
              hasLocalizedManyNumberField = subHasLocalizedManyNumberField
            }

            if (subHasLocalizedRelationshipField) {
              hasLocalizedRelationshipField = subHasLocalizedRelationshipField
            }

            if (subHasLocalizedManyTextField) {
              hasLocalizedManyTextField = subHasLocalizedManyTextField
            }

            if (subHasManyTextField) {
              if (!hasManyTextField || subHasManyTextField === 'index') {
                hasManyTextField = subHasManyTextField
              }
            }

            if (subHasManyNumberField) {
              if (!hasManyNumberField || subHasManyNumberField === 'index') {
                hasManyNumberField = subHasManyNumberField
              }
            }

            const blockRelations: Record<string, RawRelation> = {
              _parentID: {
                type: 'one',
                fields: [
                  {
                    name: '_parentID',
                    table: blockTableName,
                  },
                ],
                references: ['id'],
                relationName,
                to: rootTableName,
              },
            }

            if (
              hasLocalesTable({
                fields: block.fields,
                parentIsLocalized: parentIsLocalized || field.localized,
              })
            ) {
              blockRelations._locales = {
                type: 'many',
                relationName: '_locales',
                to: `${blockTableName}${adapter.localesSuffix}`,
              }
            }

            subRelationsToBuild.forEach(({ type, localized, target }, key) => {
              if (type === 'one') {
                const blockWithLocalized = localized
                  ? `${blockTableName}${adapter.localesSuffix}`
                  : blockTableName

                blockRelations[key] = {
                  type: 'one',
                  fields: [
                    {
                      name: key,
                      table: blockWithLocalized,
                    },
                  ],
                  references: ['id'],
                  relationName: key,
                  to: target,
                }
              }

              if (type === 'many') {
                blockRelations[key] = {
                  type: 'many',
                  relationName: key,
                  to: target,
                }
              }
            })

            adapter.rawRelations[blockTableName] = blockRelations
          }

          // blocks relationships are defined from the collection or globals table down to the block, bypassing any subBlocks
          rootRelationsToBuild.set(relationName, {
            type: 'many',
            // blocks are not localized on the parent table
            localized: false,
            target: blockTableName,
          })
        })

        break
      }
      case 'checkbox': {
        targetTable[fieldName] = withDefault(
          {
            name: columnName,
            type: 'boolean',
          },
          field,
        )

        break
      }

      case 'code':
      case 'email':
      case 'textarea': {
        targetTable[fieldName] = withDefault(
          {
            name: columnName,
            type: 'varchar',
          },
          field,
        )

        break
      }

      case 'date': {
        targetTable[fieldName] = withDefault(
          {
            name: columnName,
            type: 'timestamp',
            mode: 'string',
            precision: 3,
            withTimezone: true,
          },
          field,
        )

        break
      }

      case 'group':
      case 'tab': {
        const disableNotNullFromHere = Boolean(field.admin?.condition) || disableNotNull

        const {
          hasLocalizedField: groupHasLocalizedField,
          hasLocalizedManyNumberField: groupHasLocalizedManyNumberField,
          hasLocalizedManyTextField: groupHasLocalizedManyTextField,
          hasLocalizedRelationshipField: groupHasLocalizedRelationshipField,
          hasManyNumberField: groupHasManyNumberField,
          hasManyTextField: groupHasManyTextField,
        } = traverseFields({
          adapter,
          blocksTableNameMap,
          columnPrefix: `${columnName}_`,
          columns,
          disableNotNull: disableNotNullFromHere,
          disableUnique,
          fieldPrefix: `${fieldName}.`,
          fields: field.flattenedFields,
          forceLocalized: isFieldLocalized,
          indexes,
          localesColumns,
          localesIndexes,
          newTableName: `${parentTableName}_${columnName}`,
          parentIsLocalized: parentIsLocalized || field.localized,
          parentTableName,
          relationships,
          relationsToBuild,
          rootRelationsToBuild,
          rootTableIDColType,
          rootTableName,
          setColumnID,
          uniqueRelationships,
          versions,
          withinLocalizedArrayOrBlock: withinLocalizedArrayOrBlock || isFieldLocalized,
        })

        if (groupHasLocalizedField) {
          hasLocalizedField = true
        }
        if (groupHasLocalizedRelationshipField) {
          hasLocalizedRelationshipField = true
        }
        if (groupHasManyTextField) {
          hasManyTextField = true
        }
        if (groupHasLocalizedManyTextField) {
          hasLocalizedManyTextField = true
        }
        if (groupHasManyNumberField) {
          hasManyNumberField = true
        }
        if (groupHasLocalizedManyNumberField) {
          hasLocalizedManyNumberField = true
        }
        break
      }

      case 'json':
      case 'richText': {
        targetTable[fieldName] = withDefault(
          {
            name: columnName,
            type: 'jsonb',
          },
          field,
        )

        break
      }

      case 'number': {
        if (field.hasMany) {
          const isLocalized =
            Boolean(isFieldLocalized && adapter.payload.config.localization) ||
            withinLocalizedArrayOrBlock ||
            forceLocalized

          if (isLocalized) {
            hasLocalizedManyNumberField = true
          }

          if (field.index) {
            hasManyNumberField = 'index'
          } else if (!hasManyNumberField) {
            hasManyNumberField = true
          }

          if (field.unique) {
            throw new InvalidConfiguration(
              'Unique is not supported in Postgres for hasMany number fields.',
            )
          }
        } else {
          targetTable[fieldName] = withDefault(
            {
              name: columnName,
              type: 'numeric',
            },
            field,
          )
        }

        break
      }

      case 'point': {
        targetTable[fieldName] = withDefault(
          {
            name: columnName,
            type: 'geometry',
          },
          field,
        )

        break
      }

      case 'radio':
      case 'select': {
        const enumName = createTableName({
          adapter,
          config: field,
          parentTableName: newTableName,
          prefix: `enum_${newTableName}_`,
          target: 'enumName',
          throwValidationError,
        })

        const options = field.options.map((option) => {
          if (optionIsObject(option)) {
            return option.value
          }

          return option
        })

        if (field.type === 'select' && field.hasMany) {
          const selectTableName = createTableName({
            adapter,
            config: field,
            parentTableName: newTableName,
            prefix: `${newTableName}_`,
            throwValidationError,
            versionsCustomName: versions,
          })

          const baseColumns: Record<string, RawColumn> = {
            order: {
              name: 'order',
              type: 'integer',
              notNull: true,
            },
            parent: {
              name: 'parent_id',
              type: parentIDColType,
              notNull: true,
            },
            value: {
              name: 'value',
              type: 'enum',
              enumName: createTableName({
                adapter,
                config: field,
                parentTableName: newTableName,
                prefix: `enum_${newTableName}_`,
                target: 'enumName',
                throwValidationError,
              }),
              options,
            },
          }

          const baseIndexes: Record<string, RawIndex> = {
            orderIdx: {
              name: `${selectTableName}_order_idx`,
              on: 'order',
            },
            parentIdx: {
              name: `${selectTableName}_parent_idx`,
              on: 'parent',
            },
          }

          const baseForeignKeys: Record<string, RawForeignKey> = {
            parentFk: {
              name: `${selectTableName}_parent_fk`,
              columns: ['parent'],
              foreignColumns: [
                {
                  name: 'id',
                  table: parentTableName,
                },
              ],
              onDelete: 'cascade',
            },
          }

          const isLocalized =
            Boolean(isFieldLocalized && adapter.payload.config.localization) ||
            withinLocalizedArrayOrBlock ||
            forceLocalized

          if (isLocalized) {
            baseColumns.locale = {
              name: 'locale',
              type: 'enum',
              locale: true,
              notNull: true,
            }

            baseIndexes.localeIdx = {
              name: `${selectTableName}_locale_idx`,
              on: 'locale',
            }
          }

          if (field.index) {
            baseIndexes.value = {
              name: `${selectTableName}_value_idx`,
              on: 'value',
            }
          }

          buildTable({
            adapter,
            baseColumns,
            baseForeignKeys,
            baseIndexes,
            blocksTableNameMap,
            disableNotNull,
            disableUnique,
            fields: [],
            parentIsLocalized: parentIsLocalized || field.localized,
            rootTableName,
            setColumnID,
            tableName: selectTableName,
            versions,
          })

          relationsToBuild.set(fieldName, {
            type: 'many',
            // selects have their own localized table, independent of the base table.
            localized: false,
            target: selectTableName,
          })

          adapter.rawRelations[selectTableName] = {
            parent: {
              type: 'one',
              fields: [
                {
                  name: 'parent',
                  table: selectTableName,
                },
              ],
              references: ['id'],
              relationName: fieldName,
              to: parentTableName,
            },
          }
        } else {
          targetTable[fieldName] = withDefault(
            {
              name: columnName,
              type: 'enum',
              enumName,
              options,
            },
            field,
          )
        }
        break
      }

      case 'relationship':
      case 'upload':
        if (Array.isArray(field.relationTo)) {
          field.relationTo.forEach((relation) => {
            relationships.add(relation)
            if (field.unique && !disableUnique && !disableRelsTableUnique) {
              uniqueRelationships.add(relation)
            }
          })
        } else if (field.hasMany) {
          relationships.add(field.relationTo)
          if (field.unique && !disableUnique && !disableRelsTableUnique) {
            uniqueRelationships.add(field.relationTo)
          }
        } else {
          // simple relationships get a column on the targetTable with a foreign key to the relationTo table
          const relationshipConfig = adapter.payload.collections[field.relationTo].config

          const tableName = adapter.tableNameMap.get(toSnakeCase(field.relationTo))

          // get the id type of the related collection
          let colType: IDType = adapter.idType === 'uuid' ? 'uuid' : 'integer'
          const relatedCollectionCustomID = relationshipConfig.fields.find(
            (field) => fieldAffectsData(field) && field.name === 'id',
          )
          if (relatedCollectionCustomID?.type === 'number') {
            colType = 'numeric'
          }
          if (relatedCollectionCustomID?.type === 'text') {
            colType = 'varchar'
          }

          // make the foreign key column for relationship using the correct id column type
          targetTable[fieldName] = {
            name: `${columnName}_id`,
            type: colType,
            reference: {
              name: 'id',
              onDelete: 'set null',
              table: tableName,
            },
          }

          // add relationship to table
          relationsToBuild.set(fieldName, {
            type: 'one',
            localized: adapter.payload.config.localization && (isFieldLocalized || forceLocalized),
            target: tableName,
          })

          // add notNull when not required
          if (!disableNotNull && field.required && !field.admin?.condition) {
            targetTable[fieldName].notNull = true
          }
          break
        }

        if (
          Boolean(isFieldLocalized && adapter.payload.config.localization) ||
          withinLocalizedArrayOrBlock
        ) {
          hasLocalizedRelationshipField = true
        }

        break

      case 'text': {
        if (field.hasMany) {
          const isLocalized =
            Boolean(isFieldLocalized && adapter.payload.config.localization) ||
            withinLocalizedArrayOrBlock ||
            forceLocalized

          if (isLocalized) {
            hasLocalizedManyTextField = true
          }

          if (field.index) {
            hasManyTextField = 'index'
          } else if (!hasManyTextField) {
            hasManyTextField = true
          }

          if (field.unique) {
            throw new InvalidConfiguration(
              'Unique is not supported in Postgres for hasMany text fields.',
            )
          }
        } else {
          targetTable[fieldName] = withDefault(
            {
              name: columnName,
              type: 'varchar',
            },
            field,
          )
        }
        break
      }

      default:
        break
    }

    const condition = field.admin && field.admin.condition

    if (
      !disableNotNull &&
      targetTable[fieldName] &&
      'required' in field &&
      field.required &&
      !condition
    ) {
      targetTable[fieldName].notNull = true
    }
  })

  return {
    hasLocalizedField,
    hasLocalizedManyNumberField,
    hasLocalizedManyTextField,
    hasLocalizedRelationshipField,
    hasManyNumberField,
    hasManyTextField,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: withDefault.ts]---
Location: payload-main/packages/drizzle/src/schema/withDefault.ts

```typescript
import type { FieldAffectingData } from 'payload'

import type { RawColumn } from '../types.js'

export const withDefault = (column: RawColumn, field: FieldAffectingData): RawColumn => {
  if (typeof field.defaultValue === 'undefined' || typeof field.defaultValue === 'function') {
    return column
  }

  return {
    ...column,
    default: field.defaultValue,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: columnToCodeConverter.ts]---
Location: payload-main/packages/drizzle/src/sqlite/columnToCodeConverter.ts

```typescript
import type { ColumnToCodeConverter } from '../types.js'

export const columnToCodeConverter: ColumnToCodeConverter = ({
  adapter,
  addImport,
  column,
  locales,
  tableKey,
}) => {
  let columnBuilderFn: string = column.type

  const columnBuilderArgsArray: string[] = []

  let defaultStatement: null | string = null

  switch (column.type) {
    case 'boolean': {
      columnBuilderFn = 'integer'
      columnBuilderArgsArray.push("mode: 'boolean'")
      break
    }

    case 'enum': {
      let options: string[]
      if ('locale' in column) {
        if (!locales?.length) {
          throw new Error('Locales must be defined for locale columns')
        }
        options = locales
      } else {
        options = column.options
      }

      columnBuilderFn = 'text'
      columnBuilderArgsArray.push(`enum: [${options.map((locale) => `'${locale}'`).join(', ')}]`)

      break
    }

    case 'geometry':
    case 'jsonb': {
      columnBuilderFn = 'text'
      columnBuilderArgsArray.push("mode: 'json'")
      break
    }

    case 'numeric': {
      columnBuilderArgsArray.push("mode: 'number'")
      break
    }

    case 'serial': {
      columnBuilderFn = 'integer'
      break
    }

    case 'timestamp': {
      columnBuilderFn = 'text'
      defaultStatement = `default(sql\`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))\`)`
      break
    }

    case 'uuid': {
      columnBuilderFn = 'text'

      if (column.defaultRandom) {
        addImport('crypto', 'randomUUID')
        defaultStatement = `$defaultFn(() => randomUUID())`
      }

      break
    }

    case 'varchar': {
      columnBuilderFn = 'text'
      break
    }

    default: {
      columnBuilderFn = column.type
    }
  }

  addImport(`${adapter.packageName}/drizzle/sqlite-core`, columnBuilderFn)

  let columnBuilderArgs = ''

  if (columnBuilderArgsArray.length) {
    columnBuilderArgs = `, {${columnBuilderArgsArray.join(',')}}`
  }

  let code = `${columnBuilderFn}('${column.name}'${columnBuilderArgs})`

  if (column.notNull) {
    code = `${code}.notNull()`
  }

  if (column.primaryKey) {
    let arg = ''

    if (column.type === 'integer' && column.autoIncrement) {
      arg = `{ autoIncrement: true }`
    }

    code = `${code}.primaryKey(${arg})`
  }

  if (defaultStatement) {
    code = `${code}.${defaultStatement}`
  } else if (typeof column.default !== 'undefined') {
    let sanitizedDefault = column.default

    if (column.type === 'jsonb' || column.type === 'geometry') {
      sanitizedDefault = `'${JSON.stringify(column.default)}'`
    } else if (typeof column.default === 'string') {
      sanitizedDefault = JSON.stringify(column.default)
    } else if (column.type === 'numeric') {
      sanitizedDefault = `${column.default}`
    }

    code = `${code}.default(${sanitizedDefault})`
  }

  if (column.reference) {
    let callback = `()`

    if (column.reference.table === tableKey) {
      addImport(`${adapter.packageName}/drizzle/sqlite-core`, 'type AnySQLiteColumn')
      callback = `${callback}: AnySQLiteColumn`
    }

    callback = `${callback} => ${column.reference.table}.${column.reference.name}`

    code = `${code}.references(${callback}, {
      ${column.reference.onDelete ? `onDelete: '${column.reference.onDelete}'` : ''}
  })`
  }

  return code
}
```

--------------------------------------------------------------------------------

---[FILE: countDistinct.ts]---
Location: payload-main/packages/drizzle/src/sqlite/countDistinct.ts

```typescript
import type { SQLiteSelect } from 'drizzle-orm/sqlite-core'

import { count, sql } from 'drizzle-orm'

import type { BaseSQLiteAdapter, CountDistinct } from './types.js'

export const countDistinct: CountDistinct = async function countDistinct(
  this: BaseSQLiteAdapter,
  { column, db, joins, tableName, where },
) {
  // When we don't have any joins - use a simple COUNT(*) query.
  if (joins.length === 0) {
    const countResult = await db
      .select({
        count: column ? count(sql`DISTINCT ${column}`) : count(),
      })
      .from(this.tables[tableName])
      .where(where)
    return Number(countResult?.[0]?.count ?? 0)
  }

  let query: SQLiteSelect = db
    .select({
      count: sql`COUNT(1) OVER()`,
    })
    .from(this.tables[tableName])
    .where(where)
    .groupBy(column ?? this.tables[tableName].id)
    .limit(1)
    .$dynamic()

  joins.forEach(({ type, condition, table }) => {
    query = query[type ?? 'leftJoin'](table, condition)
  })

  // When we have any joins, we need to count each individual ID only once.
  // COUNT(*) doesn't work for this well in this case, as it also counts joined tables.
  // SELECT (COUNT DISTINCT id) has a very slow performance on large tables.
  // Instead, COUNT (GROUP BY id) can be used which is still slower than COUNT(*) but acceptable.
  const countResult = await query

  return Number(countResult?.[0]?.count ?? 0)
}
```

--------------------------------------------------------------------------------

---[FILE: defaultSnapshot.ts]---
Location: payload-main/packages/drizzle/src/sqlite/defaultSnapshot.ts

```typescript
import type { DrizzleSQLiteSnapshotJSON } from 'drizzle-kit/api'

export const defaultDrizzleSnapshot: DrizzleSQLiteSnapshotJSON = {
  id: '00000000-0000-0000-0000-000000000000',
  _meta: {
    columns: {},
    tables: {},
  },
  dialect: 'sqlite',
  enums: {},
  prevId: '00000000-0000-0000-0000-00000000000',
  tables: {},
  version: '6',
  views: {},
}
```

--------------------------------------------------------------------------------

---[FILE: deleteWhere.ts]---
Location: payload-main/packages/drizzle/src/sqlite/deleteWhere.ts

```typescript
import type { BaseSQLiteAdapter, DeleteWhere } from './types.js'

export const deleteWhere: DeleteWhere = async function (
  // Here 'this' is not a parameter. See:
  // https://www.typescriptlang.org/docs/handbook/2/classes.html#this-parameters
  this: BaseSQLiteAdapter,
  { db, tableName, where },
) {
  const table = this.tables[tableName]
  await db.delete(table).where(where)
}
```

--------------------------------------------------------------------------------

---[FILE: dropDatabase.ts]---
Location: payload-main/packages/drizzle/src/sqlite/dropDatabase.ts

```typescript
import type { Row } from '@libsql/client'

import type { BaseSQLiteAdapter, DropDatabase } from './types.js'

const getTables = (adapter: BaseSQLiteAdapter) => {
  return adapter.client.execute(`SELECT name
                                 FROM sqlite_master
                                 WHERE type = 'table'
                                   AND name NOT LIKE 'sqlite_%';`)
}

const dropTables = (adapter: BaseSQLiteAdapter, rows: Row[]) => {
  const multi = `
  PRAGMA foreign_keys = OFF;\n
  ${rows.map(({ name }) => `DROP TABLE IF EXISTS ${name as string}`).join(';\n ')};\n
  PRAGMA foreign_keys = ON;`
  return adapter.client.executeMultiple(multi)
}

export const dropDatabase: DropDatabase = async function ({ adapter }) {
  const result = await getTables(adapter)
  await dropTables(adapter, result.rows)
}
```

--------------------------------------------------------------------------------

---[FILE: execute.ts]---
Location: payload-main/packages/drizzle/src/sqlite/execute.ts

```typescript
import { sql } from 'drizzle-orm'

import type { Execute } from './types.js'

export const execute: Execute<any> = function execute({ db, drizzle, raw, sql: statement }) {
  const executeFrom = (db ?? drizzle)

  if (raw) {
    const result = executeFrom.run(sql.raw(raw))
    return result
  } else {
    const result = executeFrom.run(statement)
    return result
  }
}
```

--------------------------------------------------------------------------------

````
