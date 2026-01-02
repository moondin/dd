---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 141
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 141 of 695)

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

---[FILE: build.ts]---
Location: payload-main/packages/drizzle/src/schema/build.ts

```typescript
import type { FlattenedField, SanitizedCompoundIndex } from 'payload'

import { InvalidConfiguration } from 'payload'
import toSnakeCase from 'to-snake-case'

import type {
  DrizzleAdapter,
  IDType,
  RawColumn,
  RawForeignKey,
  RawIndex,
  RawRelation,
  RawTable,
  RelationMap,
  SetColumnID,
} from '../types.js'

import { createTableName } from '../createTableName.js'
import { buildForeignKeyName } from '../utilities/buildForeignKeyName.js'
import { buildIndexName } from '../utilities/buildIndexName.js'
import { traverseFields } from './traverseFields.js'

type Args = {
  adapter: DrizzleAdapter
  baseColumns?: Record<string, RawColumn>
  /**
   * After table is created, run these functions to add extra config to the table
   * ie. indexes, multiple columns, etc
   */
  baseForeignKeys?: Record<string, RawForeignKey>
  /**
   * After table is created, run these functions to add extra config to the table
   * ie. indexes, multiple columns, etc
   */
  baseIndexes?: Record<string, RawIndex>
  blocksTableNameMap: Record<string, number>
  buildNumbers?: boolean
  buildRelationships?: boolean
  compoundIndexes?: SanitizedCompoundIndex[]
  disableNotNull: boolean
  disableRelsTableUnique?: boolean
  disableUnique: boolean
  fields: FlattenedField[]
  parentIsLocalized: boolean
  rootRelationships?: Set<string>
  rootRelationsToBuild?: RelationMap
  rootTableIDColType?: IDType
  rootTableName?: string
  rootUniqueRelationships?: Set<string>
  setColumnID: SetColumnID
  tableName: string
  timestamps?: boolean
  versions: boolean
  /**
   * Tracks whether or not this table is built
   * from the result of a localized array or block field at some point
   */
  withinLocalizedArrayOrBlock?: boolean
}

type Result = {
  hasLocalizedManyNumberField: boolean
  hasLocalizedManyTextField: boolean
  hasLocalizedRelationshipField: boolean
  hasManyNumberField: 'index' | boolean
  hasManyTextField: 'index' | boolean
  relationsToBuild: RelationMap
}

export const buildTable = ({
  adapter,
  baseColumns = {},
  baseForeignKeys = {},
  baseIndexes = {},
  blocksTableNameMap,
  compoundIndexes,
  disableNotNull,
  disableRelsTableUnique = false,
  disableUnique = false,
  fields,
  parentIsLocalized,
  rootRelationships,
  rootRelationsToBuild,
  rootTableIDColType,
  rootTableName: incomingRootTableName,
  rootUniqueRelationships,
  setColumnID,
  tableName,
  timestamps,
  versions,
  withinLocalizedArrayOrBlock,
}: Args): Result => {
  const isRoot = !incomingRootTableName
  const rootTableName = incomingRootTableName || tableName
  const columns: Record<string, RawColumn> = baseColumns
  const indexes: Record<string, RawIndex> = baseIndexes

  const localesColumns: Record<string, RawColumn> = {}
  const localesIndexes: Record<string, RawIndex> = {}
  let localesTable: RawTable
  let textsTable: RawTable
  let numbersTable: RawTable

  // Relationships to the base collection
  const relationships: Set<string> = rootRelationships || new Set()

  // Unique relationships to the base collection
  const uniqueRelationships: Set<string> = rootUniqueRelationships || new Set()

  let relationshipsTable: RawTable

  // Drizzle relations
  const relationsToBuild: RelationMap = new Map()

  const idColType: IDType = setColumnID({ adapter, columns, fields })

  const {
    hasLocalizedField,
    hasLocalizedManyNumberField,
    hasLocalizedManyTextField,
    hasLocalizedRelationshipField,
    hasManyNumberField,
    hasManyTextField,
  } = traverseFields({
    adapter,
    blocksTableNameMap,
    columns,
    disableNotNull,
    disableRelsTableUnique,
    disableUnique,
    fields,
    indexes,
    localesColumns,
    localesIndexes,
    newTableName: tableName,
    parentIsLocalized,
    parentTableName: tableName,
    relationships,
    relationsToBuild,
    rootRelationsToBuild: rootRelationsToBuild || relationsToBuild,
    rootTableIDColType: rootTableIDColType || idColType,
    rootTableName,
    setColumnID,
    uniqueRelationships,
    versions,
    withinLocalizedArrayOrBlock,
  })

  // split the relationsToBuild by localized and non-localized
  const localizedRelations = new Map()
  const nonLocalizedRelations = new Map()

  relationsToBuild.forEach(({ type, localized, relationName, target }, key) => {
    const map = localized ? localizedRelations : nonLocalizedRelations
    map.set(key, { type, relationName, target })
  })

  if (timestamps) {
    columns.createdAt = {
      name: 'created_at',
      type: 'timestamp',
      defaultNow: true,
      mode: 'string',
      notNull: true,
      precision: 3,
      withTimezone: true,
    }

    columns.updatedAt = {
      name: 'updated_at',
      type: 'timestamp',
      defaultNow: true,
      mode: 'string',
      notNull: true,
      precision: 3,
      withTimezone: true,
    }
  }

  const table: RawTable = {
    name: tableName,
    columns,
    foreignKeys: baseForeignKeys,
    indexes,
  }

  adapter.rawTables[tableName] = table

  if (hasLocalizedField || localizedRelations.size) {
    const localeTableName = `${tableName}${adapter.localesSuffix}`
    adapter.rawTables[localeTableName] = localesTable

    localesColumns.id = {
      name: 'id',
      type: 'serial',
      primaryKey: true,
    }

    localesColumns._locale = {
      name: '_locale',
      type: 'enum',
      locale: true,
      notNull: true,
    }

    localesColumns._parentID = {
      name: '_parent_id',
      type: idColType,
      notNull: true,
    }

    localesIndexes._localeParent = {
      name: buildIndexName({
        name: `${localeTableName}_locale_parent_id_unique`,
        adapter,
        appendSuffix: false,
      }),
      on: ['_locale', '_parentID'],
      unique: true,
    }

    localesTable = {
      name: localeTableName,
      columns: localesColumns,
      foreignKeys: {
        _parentIdFk: {
          name: buildForeignKeyName({ name: `${localeTableName}_parent_id`, adapter }),
          columns: ['_parentID'],
          foreignColumns: [
            {
              name: 'id',
              table: tableName,
            },
          ],
          onDelete: 'cascade',
        },
      },
      indexes: localesIndexes,
    }

    adapter.rawTables[localeTableName] = localesTable

    const localeRelations: Record<string, RawRelation> = {
      _parentID: {
        type: 'one',
        fields: [
          {
            name: '_parentID',
            table: localeTableName,
          },
        ],
        references: ['id'],
        relationName: '_locales',
        to: tableName,
      },
    }

    localizedRelations.forEach(({ type, target }, key) => {
      if (type === 'one') {
        localeRelations[key] = {
          type: 'one',
          fields: [
            {
              name: key,
              table: localeTableName,
            },
          ],
          references: ['id'],
          relationName: key,
          to: target,
        }
      }
      if (type === 'many') {
        localeRelations[key] = {
          type: 'many',
          relationName: key,
          to: target,
        }
      }
    })
    adapter.rawRelations[localeTableName] = localeRelations
  }

  if (compoundIndexes) {
    for (const index of compoundIndexes) {
      let someLocalized: boolean | null = null
      const columns: string[] = []

      const getTableToUse = () => {
        if (someLocalized) {
          return localesTable
        }

        return table
      }

      for (const { path, pathHasLocalized } of index.fields) {
        if (someLocalized === null) {
          someLocalized = pathHasLocalized
        }

        if (someLocalized !== pathHasLocalized) {
          throw new InvalidConfiguration(
            `Compound indexes within localized and non localized fields are not supported in SQL. Expected ${path} to be ${someLocalized ? 'non' : ''} localized.`,
          )
        }

        const columnPath = path.replaceAll('.', '_')

        if (!getTableToUse().columns[columnPath]) {
          throw new InvalidConfiguration(
            `Column ${columnPath} for compound index on ${path} was not found in the ${getTableToUse().name} table.`,
          )
        }

        columns.push(columnPath)
      }

      if (someLocalized) {
        columns.push('_locale')
      }

      let name = columns.join('_')
      // truncate against the limit, buildIndexName will handle collisions
      if (name.length > 63) {
        name = 'compound_index'
      }

      const indexName = buildIndexName({ name, adapter })

      getTableToUse().indexes[indexName] = {
        name: indexName,
        on: columns,
        unique: disableUnique ? false : index.unique,
      }
    }
  }

  if (isRoot) {
    if (hasManyTextField) {
      const textsTableName = `${rootTableName}_texts`
      adapter.rawTables[textsTableName] = textsTable

      const columns: Record<string, RawColumn> = {
        id: {
          name: 'id',
          type: 'serial',
          primaryKey: true,
        },
        order: {
          name: 'order',
          type: 'integer',
          notNull: true,
        },
        parent: {
          name: 'parent_id',
          type: idColType,
          notNull: true,
        },
        path: {
          name: 'path',
          type: 'varchar',

          notNull: true,
        },
        text: {
          name: 'text',
          type: 'varchar',
        },
      }

      if (hasLocalizedManyTextField) {
        columns.locale = {
          name: 'locale',
          type: 'enum',
          locale: true,
        }
      }

      const textsTableIndexes: Record<string, RawIndex> = {
        orderParentIdx: {
          name: buildIndexName({
            name: `${textsTableName}_order_parent`,
            adapter,
            appendSuffix: false,
          }),
          on: ['order', 'parent'],
        },
      }

      if (hasManyTextField === 'index') {
        textsTableIndexes.text_idx = {
          name: buildIndexName({ name: `${textsTableName}_text`, adapter }),
          on: 'text',
        }
      }

      if (hasLocalizedManyTextField) {
        textsTableIndexes.localeParent = {
          name: buildIndexName({
            name: `${textsTableName}_locale_parent`,
            adapter,
            appendSuffix: false,
          }),
          on: ['locale', 'parent'],
        }
      }

      textsTable = {
        name: textsTableName,
        columns,
        foreignKeys: {
          parentFk: {
            name: buildForeignKeyName({ name: `${textsTableName}_parent`, adapter }),
            columns: ['parent'],
            foreignColumns: [
              {
                name: 'id',
                table: tableName,
              },
            ],
            onDelete: 'cascade',
          },
        },
        indexes: textsTableIndexes,
      }

      adapter.rawTables[textsTableName] = textsTable

      adapter.rawRelations[textsTableName] = {
        parent: {
          type: 'one',
          fields: [
            {
              name: 'parent',
              table: textsTableName,
            },
          ],
          references: ['id'],
          relationName: '_texts',
          to: tableName,
        },
      }
    }

    if (hasManyNumberField) {
      const numbersTableName = `${rootTableName}_numbers`
      adapter.rawTables[numbersTableName] = numbersTable
      const columns: Record<string, RawColumn> = {
        id: {
          name: 'id',
          type: 'serial',
          primaryKey: true,
        },
        number: {
          name: 'number',
          type: 'numeric',
        },
        order: {
          name: 'order',
          type: 'integer',
          notNull: true,
        },
        parent: {
          name: 'parent_id',
          type: idColType,
          notNull: true,
        },
        path: {
          name: 'path',
          type: 'varchar',
          notNull: true,
        },
      }

      if (hasLocalizedManyNumberField) {
        columns.locale = {
          name: 'locale',
          type: 'enum',
          locale: true,
        }
      }

      const numbersTableIndexes: Record<string, RawIndex> = {
        orderParentIdx: {
          name: buildIndexName({ name: `${numbersTableName}_order_parent`, adapter }),
          on: ['order', 'parent'],
        },
      }

      if (hasManyNumberField === 'index') {
        numbersTableIndexes.numberIdx = {
          name: buildIndexName({ name: `${numbersTableName}_number`, adapter }),
          on: 'number',
        }
      }

      if (hasLocalizedManyNumberField) {
        numbersTableIndexes.localeParent = {
          name: buildIndexName({
            name: `${numbersTableName}_locale_parent`,
            adapter,
            appendSuffix: false,
          }),
          on: ['locale', 'parent'],
        }
      }

      numbersTable = {
        name: numbersTableName,
        columns,
        foreignKeys: {
          parentFk: {
            name: buildForeignKeyName({ name: `${numbersTableName}_parent`, adapter }),
            columns: ['parent'],
            foreignColumns: [
              {
                name: 'id',
                table: tableName,
              },
            ],
            onDelete: 'cascade',
          },
        },
        indexes: numbersTableIndexes,
      }

      adapter.rawTables[numbersTableName] = numbersTable

      adapter.rawRelations[numbersTableName] = {
        parent: {
          type: 'one',
          fields: [
            {
              name: 'parent',
              table: numbersTableName,
            },
          ],
          references: ['id'],
          relationName: '_numbers',
          to: tableName,
        },
      }
    }

    if (relationships.size) {
      const relationshipColumns: Record<string, RawColumn> = {
        id: {
          name: 'id',
          type: 'serial',
          primaryKey: true,
        },
        order: {
          name: 'order',
          type: 'integer',
        },
        parent: {
          name: 'parent_id',
          type: idColType,
          notNull: true,
        },
        path: {
          name: 'path',
          type: 'varchar',
          notNull: true,
        },
      }

      if (hasLocalizedRelationshipField) {
        relationshipColumns.locale = {
          name: 'locale',
          type: 'enum',
          locale: true,
        }
      }

      const relationshipsTableName = `${tableName}${adapter.relationshipsSuffix}`

      const relationshipIndexes: Record<string, RawIndex> = {
        order: {
          name: buildIndexName({ name: `${relationshipsTableName}_order`, adapter }),
          on: 'order',
        },
        parentIdx: {
          name: buildIndexName({ name: `${relationshipsTableName}_parent`, adapter }),
          on: 'parent',
        },
        pathIdx: {
          name: buildIndexName({ name: `${relationshipsTableName}_path`, adapter }),
          on: 'path',
        },
      }

      if (hasLocalizedRelationshipField) {
        relationshipIndexes.localeIdx = {
          name: buildIndexName({ name: `${relationshipsTableName}_locale`, adapter }),
          on: 'locale',
        }
      }

      const relationshipForeignKeys: Record<string, RawForeignKey> = {
        parentFk: {
          name: buildForeignKeyName({ name: `${relationshipsTableName}_parent`, adapter }),
          columns: ['parent'],
          foreignColumns: [
            {
              name: 'id',
              table: tableName,
            },
          ],
          onDelete: 'cascade',
        },
      }

      relationships.forEach((relationTo) => {
        const relationshipConfig = adapter.payload.collections[relationTo].config
        const formattedRelationTo = createTableName({
          adapter,
          config: relationshipConfig,
          throwValidationError: true,
        })
        let colType: 'integer' | 'numeric' | 'uuid' | 'varchar' =
          adapter.idType === 'uuid' ? 'uuid' : 'integer'
        const relatedCollectionCustomIDType =
          adapter.payload.collections[relationshipConfig.slug]?.customIDType

        if (relatedCollectionCustomIDType === 'number') {
          colType = 'numeric'
        }
        if (relatedCollectionCustomIDType === 'text') {
          colType = 'varchar'
        }

        const colName = `${relationTo}ID`

        relationshipColumns[colName] = {
          name: `${formattedRelationTo}_id`,
          type: colType,
        }

        relationshipForeignKeys[`${relationTo}IdFk`] = {
          name: buildForeignKeyName({
            name: `${relationshipsTableName}_${toSnakeCase(relationTo)}`,
            adapter,
          }),
          columns: [colName],
          foreignColumns: [
            {
              name: 'id',
              table: formattedRelationTo,
            },
          ],
          onDelete: 'cascade',
        }

        const indexColumns = [colName]

        const unique = !disableUnique && uniqueRelationships.has(relationTo)

        if (unique) {
          indexColumns.push('path')
        }
        if (hasLocalizedRelationshipField) {
          indexColumns.push('locale')
        }

        const indexName = buildIndexName({
          name: `${relationshipsTableName}_${formattedRelationTo}_id`,
          adapter,
        })

        relationshipIndexes[indexName] = {
          name: indexName,
          on: indexColumns,
          unique,
        }
      })

      relationshipsTable = {
        name: relationshipsTableName,
        columns: relationshipColumns,
        foreignKeys: relationshipForeignKeys,
        indexes: relationshipIndexes,
      }

      adapter.rawTables[relationshipsTableName] = relationshipsTable

      const relationshipsTableRelations: Record<string, RawRelation> = {
        parent: {
          type: 'one',
          fields: [
            {
              name: 'parent',
              table: relationshipsTableName,
            },
          ],
          references: ['id'],
          relationName: '_rels',
          to: tableName,
        },
      }

      relationships.forEach((relationTo) => {
        const relatedTableName = createTableName({
          adapter,
          config: adapter.payload.collections[relationTo].config,
          throwValidationError: true,
        })
        const idColumnName = `${relationTo}ID`

        relationshipsTableRelations[idColumnName] = {
          type: 'one',
          fields: [
            {
              name: idColumnName,
              table: relationshipsTableName,
            },
          ],
          references: ['id'],
          relationName: relationTo,
          to: relatedTableName,
        }
      })
      adapter.rawRelations[relationshipsTableName] = relationshipsTableRelations
    }
  }

  const tableRelations: Record<string, RawRelation> = {}

  nonLocalizedRelations.forEach(({ type, relationName, target }, key) => {
    if (type === 'one') {
      tableRelations[key] = {
        type: 'one',
        fields: [
          {
            name: key,
            table: tableName,
          },
        ],
        references: ['id'],
        relationName: key,
        to: target,
      }
    }
    if (type === 'many') {
      tableRelations[key] = {
        type: 'many',
        relationName: relationName || key,
        to: target,
      }
    }
  })

  if (hasLocalizedField) {
    tableRelations._locales = {
      type: 'many',
      relationName: '_locales',
      to: localesTable.name,
    }
  }

  if (isRoot && textsTable) {
    tableRelations._texts = {
      type: 'many',
      relationName: '_texts',
      to: textsTable.name,
    }
  }

  if (isRoot && numbersTable) {
    tableRelations._numbers = {
      type: 'many',
      relationName: '_numbers',
      to: numbersTable.name,
    }
  }

  if (relationships.size && relationshipsTable) {
    tableRelations._rels = {
      type: 'many',
      relationName: '_rels',
      to: relationshipsTable.name,
    }
  }

  adapter.rawRelations[tableName] = tableRelations

  return {
    hasLocalizedManyNumberField,
    hasLocalizedManyTextField,
    hasLocalizedRelationshipField,
    hasManyNumberField,
    hasManyTextField,
    relationsToBuild,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: buildDrizzleRelations.ts]---
Location: payload-main/packages/drizzle/src/schema/buildDrizzleRelations.ts

```typescript
import type { Relation } from 'drizzle-orm'

import { relations } from 'drizzle-orm'

import type { DrizzleAdapter } from '../types.js'

export const buildDrizzleRelations = ({ adapter }: { adapter: DrizzleAdapter }) => {
  for (const tableName in adapter.rawRelations) {
    const rawRelations = adapter.rawRelations[tableName]

    adapter.relations[`relations_${tableName}`] = relations(
      adapter.tables[tableName],
      ({ many, one }) => {
        const result: Record<string, Relation<string>> = {}

        for (const key in rawRelations) {
          const relation = rawRelations[key]

          if (relation.type === 'one') {
            result[key] = one(adapter.tables[relation.to], {
              fields: relation.fields.map(
                (field) => adapter.tables[field.table][field.name],
              ) as any,
              references: relation.references.map(
                (reference) => adapter.tables[relation.to][reference],
              ),
              relationName: relation.relationName,
            })
          } else {
            result[key] = many(adapter.tables[relation.to], {
              relationName: relation.relationName,
            })
          }
        }

        return result
      },
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: buildRawSchema.ts]---
Location: payload-main/packages/drizzle/src/schema/buildRawSchema.ts

```typescript
import {
  buildVersionCollectionFields,
  buildVersionCompoundIndexes,
  buildVersionGlobalFields,
} from 'payload'
import { hasDraftsEnabled } from 'payload/shared'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter, RawIndex, SetColumnID } from '../types.js'

import { createTableName } from '../createTableName.js'
import { buildIndexName } from '../utilities/buildIndexName.js'
import { buildTable } from './build.js'

/**
 * Builds abstract Payload SQL schema
 */
export const buildRawSchema = ({
  adapter,
  setColumnID,
}: {
  adapter: DrizzleAdapter
  setColumnID: SetColumnID
}) => {
  adapter.indexes = new Set()
  adapter.foreignKeys = new Set()

  adapter.payload.config.collections.forEach((collection) => {
    createTableName({
      adapter,
      config: collection,
    })

    if (collection.versions) {
      createTableName({
        adapter,
        config: collection,
        versions: true,
        versionsCustomName: true,
      })
    }
  })

  adapter.payload.config.collections.forEach((collection) => {
    const tableName = adapter.tableNameMap.get(toSnakeCase(collection.slug))
    const config = adapter.payload.config

    const baseIndexes: Record<string, RawIndex> = {}

    if (collection.upload.filenameCompoundIndex) {
      const indexName = buildIndexName({ name: `${tableName}_filename_compound_idx`, adapter })

      baseIndexes.filename_compound_index = {
        name: indexName,
        on: collection.upload.filenameCompoundIndex.map((f) => f),
        unique: true,
      }
    }

    buildTable({
      adapter,
      blocksTableNameMap: {},
      compoundIndexes: collection.sanitizedIndexes,
      disableNotNull: !!collection?.versions?.drafts,
      disableUnique: false,
      fields: collection.flattenedFields,
      parentIsLocalized: false,
      setColumnID,
      tableName,
      timestamps: collection.timestamps,
      versions: false,
    })

    if (collection.versions) {
      const versionsTableName = adapter.tableNameMap.get(
        `_${toSnakeCase(collection.slug)}${adapter.versionsSuffix}`,
      )
      const versionFields = buildVersionCollectionFields(config, collection, true)

      buildTable({
        adapter,
        blocksTableNameMap: {},
        compoundIndexes: buildVersionCompoundIndexes({ indexes: collection.sanitizedIndexes }),
        disableNotNull: !!collection.versions?.drafts,
        disableUnique: true,
        fields: versionFields,
        parentIsLocalized: false,
        setColumnID,
        tableName: versionsTableName,
        timestamps: true,
        versions: true,
      })
    }
  })

  adapter.payload.config.globals.forEach((global) => {
    const tableName = createTableName({
      adapter,
      config: global,
    })

    buildTable({
      adapter,
      blocksTableNameMap: {},
      disableNotNull: hasDraftsEnabled(global),
      disableUnique: false,
      fields: global.flattenedFields,
      parentIsLocalized: false,
      setColumnID,
      tableName,
      timestamps: false,
      versions: false,
    })

    if (global.versions) {
      const versionsTableName = createTableName({
        adapter,
        config: global,
        versions: true,
        versionsCustomName: true,
      })
      const config = adapter.payload.config
      const versionFields = buildVersionGlobalFields(config, global, true)

      buildTable({
        adapter,
        blocksTableNameMap: {},
        disableNotNull: !!global.versions?.drafts,
        disableUnique: true,
        fields: versionFields,
        parentIsLocalized: false,
        setColumnID,
        tableName: versionsTableName,
        timestamps: true,
        versions: true,
      })
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: idToUUID.ts]---
Location: payload-main/packages/drizzle/src/schema/idToUUID.ts

```typescript
import type { FlattenedField } from 'payload'

export const idToUUID = (fields: FlattenedField[]): FlattenedField[] =>
  fields.map((field) => {
    if ('name' in field && field.name === 'id') {
      return {
        ...field,
        name: '_uuid',
      }
    }

    return field
  })
```

--------------------------------------------------------------------------------

````
