---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 146
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 146 of 695)

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
Location: payload-main/packages/drizzle/src/upsertRow/index.ts

```typescript
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type { SelectedFields } from 'drizzle-orm/sqlite-core'
import type { TypeWithID } from 'payload'

import { and, desc, eq, isNull, or } from 'drizzle-orm'
import { ValidationError } from 'payload'

import type { BlockRowToInsert } from '../transform/write/types.js'
import type { Args } from './types.js'

type RelationshipRow = {
  [key: string]: number | string | undefined // For relationship ID columns like categoriesID, moviesID, etc.
  id?: number | string
  locale?: string
  order: number
  parent: number | string // Drizzle table uses 'parent' key
  path: string
}

import { buildFindManyArgs } from '../find/buildFindManyArgs.js'
import { transform } from '../transform/read/index.js'
import { transformForWrite } from '../transform/write/index.js'
import { deleteExistingArrayRows } from './deleteExistingArrayRows.js'
import { deleteExistingRowsByPath } from './deleteExistingRowsByPath.js'
import { insertArrays } from './insertArrays.js'
import { shouldUseOptimizedUpsertRow } from './shouldUseOptimizedUpsertRow.js'

/**
 * If `id` is provided, it will update the row with that ID.
 * If `where` is provided, it will update the row that matches the `where`
 * If neither `id` nor `where` is provided, it will create a new row.
 *
 * adapter function replaces the entire row and does not support partial updates.
 */
export const upsertRow = async <T extends Record<string, unknown> | TypeWithID>({
  id,
  adapter,
  data,
  db,
  fields,
  ignoreResult,
  // TODO:
  // When we support joins for write operations (create/update) - pass collectionSlug to the buildFindManyArgs
  // Make a new argument in upsertRow.ts and pass the slug from every operation.
  joinQuery: _joinQuery,
  operation,
  path = '',
  req,
  select,
  tableName,
  upsertTarget,
  where,
}: Args): Promise<T> => {
  if (operation === 'create' && !data.createdAt) {
    data.createdAt = new Date().toISOString()
  }

  let insertedRow: Record<string, unknown> = { id }
  if (id && shouldUseOptimizedUpsertRow({ data, fields })) {
    const transformedForWrite = transformForWrite({
      adapter,
      data,
      enableAtomicWrites: true,
      fields,
      tableName,
    })
    const { row } = transformedForWrite
    const { arraysToPush } = transformedForWrite

    const drizzle = db as LibSQLDatabase

    // First, handle $push arrays

    if (arraysToPush && Object.keys(arraysToPush)?.length) {
      await insertArrays({
        adapter,
        arrays: [arraysToPush],
        db,
        parentRows: [insertedRow],
        uuidMap: {},
      })
    }

    // If row.updatedAt is not set, delete it to avoid triggering hasDataToUpdate. `updatedAt` may be explicitly set to null to
    // disable triggering hasDataToUpdate.
    if (typeof row.updatedAt === 'undefined' || row.updatedAt === null) {
      delete row.updatedAt
    }

    const hasDataToUpdate = row && Object.keys(row)?.length

    // Then, handle regular row update
    if (ignoreResult) {
      if (hasDataToUpdate) {
        // Only update row if there is something to update.
        // Example: if the data only consists of a single $push, calling insertArrays is enough - we don't need to update the row.
        await drizzle
          .update(adapter.tables[tableName])
          .set(row)
          .where(eq(adapter.tables[tableName].id, id))
      }
      return ignoreResult === 'idOnly' ? ({ id } as T) : null
    }

    const findManyArgs = buildFindManyArgs({
      adapter,
      depth: 0,
      fields,
      joinQuery: false,
      select,
      tableName,
    })

    const findManyKeysLength = Object.keys(findManyArgs).length
    const hasOnlyColumns = Object.keys(findManyArgs.columns || {}).length > 0

    if (!hasDataToUpdate) {
      // Nothing to update => just fetch current row and return
      findManyArgs.where = eq(adapter.tables[tableName].id, insertedRow.id)

      const doc = await db.query[tableName].findFirst(findManyArgs)

      return transform<T>({
        adapter,
        config: adapter.payload.config,
        data: doc,
        fields,
        joinQuery: false,
        tableName,
      })
    }

    if (findManyKeysLength === 0 || hasOnlyColumns) {
      // Optimization - No need for joins => can simply use returning(). This is optimal for very simple collections
      // without complex fields that live in separate tables like blocks, arrays, relationships, etc.

      const selectedFields: SelectedFields = {}
      if (hasOnlyColumns) {
        for (const [column, enabled] of Object.entries(findManyArgs.columns)) {
          if (enabled) {
            selectedFields[column] = adapter.tables[tableName][column]
          }
        }
      }

      const docs = await drizzle
        .update(adapter.tables[tableName])
        .set(row)
        .where(eq(adapter.tables[tableName].id, id))
        .returning(Object.keys(selectedFields).length ? selectedFields : undefined)

      return transform<T>({
        adapter,
        config: adapter.payload.config,
        data: docs[0],
        fields,
        joinQuery: false,
        tableName,
      })
    }

    // DB Update that needs the result, potentially with joins => need to update first, then find. returning() does not work with joins.

    await drizzle
      .update(adapter.tables[tableName])
      .set(row)
      .where(eq(adapter.tables[tableName].id, id))

    findManyArgs.where = eq(adapter.tables[tableName].id, insertedRow.id)

    const doc = await db.query[tableName].findFirst(findManyArgs)

    return transform<T>({
      adapter,
      config: adapter.payload.config,
      data: doc,
      fields,
      joinQuery: false,
      tableName,
    })
  }
  // Split out the incoming data into the corresponding:
  // base row, locales, relationships, blocks, and arrays
  const rowToInsert = transformForWrite({
    adapter,
    data,
    enableAtomicWrites: false,
    fields,
    path,
    tableName,
  })

  // First, we insert the main row
  try {
    if (operation === 'update') {
      const target = upsertTarget || adapter.tables[tableName].id

      // Check if we only have relationship operations and no main row data to update
      // Exclude timestamp-only updates when we only have relationship operations
      const rowKeys = Object.keys(rowToInsert.row)
      const hasMainRowData =
        rowKeys.length > 0 && !rowKeys.every((key) => key === 'updatedAt' || key === 'createdAt')

      if (hasMainRowData) {
        if (id) {
          rowToInsert.row.id = id
          ;[insertedRow] = await adapter.insert({
            db,
            onConflictDoUpdate: { set: rowToInsert.row, target },
            tableName,
            values: rowToInsert.row,
          })
        } else {
          ;[insertedRow] = await adapter.insert({
            db,
            onConflictDoUpdate: { set: rowToInsert.row, target, where },
            tableName,
            values: rowToInsert.row,
          })
        }
      } else {
        // No main row data to update, just use the existing ID
        insertedRow = { id }
      }
    } else {
      if (adapter.allowIDOnCreate && data.id) {
        rowToInsert.row.id = data.id
      }
      ;[insertedRow] = await adapter.insert({
        db,
        tableName,
        values: rowToInsert.row,
      })
    }

    const localesToInsert: Record<string, unknown>[] = []
    const relationsToInsert: Record<string, unknown>[] = []
    const textsToInsert: Record<string, unknown>[] = []
    const numbersToInsert: Record<string, unknown>[] = []
    const blocksToInsert: { [blockType: string]: BlockRowToInsert[] } = {}
    const selectsToInsert: { [selectTableName: string]: Record<string, unknown>[] } = {}

    // If there are locale rows with data, add the parent and locale to each
    if (Object.keys(rowToInsert.locales).length > 0) {
      Object.entries(rowToInsert.locales).forEach(([locale, localeRow]) => {
        localeRow._parentID = insertedRow.id
        localeRow._locale = locale
        localesToInsert.push(localeRow)
      })
    }

    // If there are relationships, add parent to each
    if (rowToInsert.relationships.length > 0) {
      rowToInsert.relationships.forEach((relation) => {
        relation.parent = insertedRow.id
        relationsToInsert.push(relation)
      })
    }

    // If there are texts, add parent to each
    if (rowToInsert.texts.length > 0) {
      rowToInsert.texts.forEach((textRow) => {
        textRow.parent = insertedRow.id
        textsToInsert.push(textRow)
      })
    }

    // If there are numbers, add parent to each
    if (rowToInsert.numbers.length > 0) {
      rowToInsert.numbers.forEach((numberRow) => {
        numberRow.parent = insertedRow.id
        numbersToInsert.push(numberRow)
      })
    }

    // If there are selects, add parent to each, and then
    // store by table name and rows
    if (Object.keys(rowToInsert.selects).length > 0) {
      Object.entries(rowToInsert.selects).forEach(([selectTableName, selectRows]) => {
        selectsToInsert[selectTableName] = []

        selectRows.forEach((row) => {
          if (typeof row.parent === 'undefined') {
            row.parent = insertedRow.id
          }

          selectsToInsert[selectTableName].push(row)
        })
      })
    }

    // If there are blocks, add parent to each, and then
    // store by table name and rows
    Object.keys(rowToInsert.blocks).forEach((tableName) => {
      rowToInsert.blocks[tableName].forEach((blockRow) => {
        blockRow.row._parentID = insertedRow.id
        if (!blocksToInsert[tableName]) {
          blocksToInsert[tableName] = []
        }
        if (blockRow.row.uuid) {
          delete blockRow.row.uuid
        }
        blocksToInsert[tableName].push(blockRow)
      })
    })

    // //////////////////////////////////
    // INSERT LOCALES
    // //////////////////////////////////

    if (localesToInsert.length > 0) {
      const localeTableName = `${tableName}${adapter.localesSuffix}`
      const localeTable = adapter.tables[`${tableName}${adapter.localesSuffix}`]

      if (operation === 'update') {
        await adapter.deleteWhere({
          db,
          tableName: localeTableName,
          where: eq(localeTable._parentID, insertedRow.id),
        })
      }

      await adapter.insert({
        db,
        tableName: localeTableName,
        values: localesToInsert,
      })
    }

    // //////////////////////////////////
    // INSERT RELATIONSHIPS
    // //////////////////////////////////

    const relationshipsTableName = `${tableName}${adapter.relationshipsSuffix}`

    if (operation === 'update') {
      // Filter out specific item deletions (those with itemToRemove) from general path deletions
      const generalRelationshipDeletes = rowToInsert.relationshipsToDelete.filter(
        (rel) => !('itemToRemove' in rel),
      )

      await deleteExistingRowsByPath({
        adapter,
        db,
        localeColumnName: 'locale',
        parentColumnName: 'parent',
        parentID: insertedRow.id,
        pathColumnName: 'path',
        rows: [...relationsToInsert, ...generalRelationshipDeletes],
        tableName: relationshipsTableName,
      })
    }

    if (relationsToInsert.length > 0) {
      await adapter.insert({
        db,
        tableName: relationshipsTableName,
        values: relationsToInsert,
      })
    }

    // //////////////////////////////////
    // HANDLE RELATIONSHIP $push OPERATIONS
    // //////////////////////////////////

    if (rowToInsert.relationshipsToAppend.length > 0) {
      // Prepare all relationships for batch insert (order will be set after max query)
      const relationshipsToInsert = rowToInsert.relationshipsToAppend.map((rel) => {
        const parentId = id || insertedRow.id
        const row: Record<string, unknown> = {
          parent: parentId as number | string, // Use 'parent' key for Drizzle table
          path: rel.path,
        }

        // Only add locale if this relationship table has a locale column
        const relationshipTable = adapter.rawTables[relationshipsTableName]
        if (rel.locale && relationshipTable && relationshipTable.columns.locale) {
          row.locale = rel.locale
        }

        if (rel.relationTo) {
          // Use camelCase key for Drizzle table (e.g., categoriesID not categories_id)
          row[`${rel.relationTo}ID`] = rel.value
        }

        return row
      })

      if (relationshipsToInsert.length > 0) {
        // Check for potential duplicates
        const relationshipTable = adapter.tables[relationshipsTableName]

        if (relationshipTable) {
          // Build conditions only if we have relationships to check
          if (relationshipsToInsert.length === 0) {
            return // No relationships to insert
          }

          const conditions = relationshipsToInsert.map((row: RelationshipRow) => {
            const parts = [
              eq(relationshipTable.parent, row.parent),
              eq(relationshipTable.path, row.path),
            ]

            // Add locale condition
            if (row.locale !== undefined && relationshipTable.locale) {
              parts.push(eq(relationshipTable.locale, row.locale))
            } else if (relationshipTable.locale) {
              parts.push(isNull(relationshipTable.locale))
            }

            // Add all relationship ID matches using schema fields
            for (const [key, value] of Object.entries(row)) {
              if (key.endsWith('ID') && value != null) {
                const column = relationshipTable[key]
                if (column && typeof column === 'object') {
                  parts.push(eq(column, value))
                }
              }
            }

            return and(...parts)
          })

          // Get both existing relationships AND max order in a single query
          let existingRels: Record<string, unknown>[] = []
          let maxOrder = 0

          if (conditions.length > 0) {
            // Query for existing relationships
            existingRels = await (db as any)
              .select()
              .from(relationshipTable)
              .where(or(...conditions))
          }

          // Get max order for this parent across all paths in a single query
          const parentId = id || insertedRow.id
          const maxOrderResult = await (db as any)
            .select({ maxOrder: relationshipTable.order })
            .from(relationshipTable)
            .where(eq(relationshipTable.parent, parentId))
            .orderBy(desc(relationshipTable.order))
            .limit(1)

          if (maxOrderResult.length > 0 && maxOrderResult[0].maxOrder) {
            maxOrder = maxOrderResult[0].maxOrder
          }

          // Set order values for all relationships based on max order
          relationshipsToInsert.forEach((row, index) => {
            row.order = maxOrder + index + 1
          })

          // Filter out relationships that already exist
          const relationshipsToActuallyInsert = relationshipsToInsert.filter((newRow) => {
            return !existingRels.some((existingRow: Record<string, unknown>) => {
              // Check if this relationship already exists
              let matches = existingRow.parent === newRow.parent && existingRow.path === newRow.path

              if (newRow.locale !== undefined) {
                matches = matches && existingRow.locale === newRow.locale
              }

              // Check relationship value matches - convert to camelCase for comparison
              for (const key of Object.keys(newRow)) {
                if (key.endsWith('ID')) {
                  // Now using camelCase keys
                  matches = matches && existingRow[key] === newRow[key]
                }
              }

              return matches
            })
          })

          // Insert only non-duplicate relationships
          if (relationshipsToActuallyInsert.length > 0) {
            await adapter.insert({
              db,
              tableName: relationshipsTableName,
              values: relationshipsToActuallyInsert,
            })
          }
        }
      }
    }

    // //////////////////////////////////
    // HANDLE RELATIONSHIP $remove OPERATIONS
    // //////////////////////////////////

    if (rowToInsert.relationshipsToDelete.some((rel) => 'itemToRemove' in rel)) {
      const relationshipTable = adapter.tables[relationshipsTableName]

      if (relationshipTable) {
        for (const relToDelete of rowToInsert.relationshipsToDelete) {
          if ('itemToRemove' in relToDelete && relToDelete.itemToRemove) {
            const item = relToDelete.itemToRemove
            const parentId = (id || insertedRow.id) as number | string

            const conditions = [
              eq(relationshipTable.parent, parentId),
              eq(relationshipTable.path, relToDelete.path),
            ]

            // Add locale condition if this relationship table has a locale column
            if (adapter.rawTables[relationshipsTableName]?.columns.locale) {
              if (relToDelete.locale) {
                conditions.push(eq(relationshipTable.locale, relToDelete.locale))
              } else {
                conditions.push(isNull(relationshipTable.locale))
              }
            }

            // Handle polymorphic vs simple relationships
            if (typeof item === 'object' && 'relationTo' in item) {
              // Polymorphic relationship - convert to camelCase key
              const camelKey = `${item.relationTo}ID`
              if (relationshipTable[camelKey]) {
                conditions.push(eq(relationshipTable[camelKey], item.value))
              }
            } else if (relToDelete.relationTo) {
              // Simple relationship - convert to camelCase key
              const camelKey = `${relToDelete.relationTo}ID`
              if (relationshipTable[camelKey]) {
                conditions.push(eq(relationshipTable[camelKey], item))
              }
            }

            // Execute DELETE using Drizzle query builder
            await adapter.deleteWhere({
              db,
              tableName: relationshipsTableName,
              where: and(...conditions),
            })
          }
        }
      }
    }

    // //////////////////////////////////
    // INSERT hasMany TEXTS
    // //////////////////////////////////

    const textsTableName = `${tableName}_texts`

    if (operation === 'update') {
      await deleteExistingRowsByPath({
        adapter,
        db,
        localeColumnName: 'locale',
        parentColumnName: 'parent',
        parentID: insertedRow.id,
        pathColumnName: 'path',
        rows: [...textsToInsert, ...rowToInsert.textsToDelete],
        tableName: textsTableName,
      })
    }

    if (textsToInsert.length > 0) {
      await adapter.insert({
        db,
        tableName: textsTableName,
        values: textsToInsert,
      })
    }

    // //////////////////////////////////
    // INSERT hasMany NUMBERS
    // //////////////////////////////////

    const numbersTableName = `${tableName}_numbers`

    if (operation === 'update') {
      await deleteExistingRowsByPath({
        adapter,
        db,
        localeColumnName: 'locale',
        parentColumnName: 'parent',
        parentID: insertedRow.id,
        pathColumnName: 'path',
        rows: [...numbersToInsert, ...rowToInsert.numbersToDelete],
        tableName: numbersTableName,
      })
    }

    if (numbersToInsert.length > 0) {
      await adapter.insert({
        db,
        tableName: numbersTableName,
        values: numbersToInsert,
      })
    }

    // //////////////////////////////////
    // INSERT BLOCKS
    // //////////////////////////////////

    const insertedBlockRows: Record<string, Record<string, unknown>[]> = {}

    if (operation === 'update') {
      for (const tableName of rowToInsert.blocksToDelete) {
        const blockTable = adapter.tables[tableName]
        await adapter.deleteWhere({
          db,
          tableName,
          where: eq(blockTable._parentID, insertedRow.id),
        })
      }
    }

    // When versions are enabled, adapter is used to track mapping between blocks/arrays ObjectID to their numeric generated representation, then we use it for nested to arrays/blocks select hasMany in versions.
    const arraysBlocksUUIDMap: Record<string, number | string> = {}

    for (const [tableName, blockRows] of Object.entries(blocksToInsert)) {
      insertedBlockRows[tableName] = await adapter.insert({
        db,
        tableName,
        values: blockRows.map(({ row }) => row),
      })

      insertedBlockRows[tableName].forEach((row, i) => {
        blockRows[i].row = row
        if (
          typeof row._uuid === 'string' &&
          (typeof row.id === 'string' || typeof row.id === 'number')
        ) {
          arraysBlocksUUIDMap[row._uuid] = row.id
        }
      })

      const blockLocaleIndexMap: number[] = []

      const blockLocaleRowsToInsert = blockRows.reduce((acc, blockRow, i) => {
        if (Object.entries(blockRow.locales).length > 0) {
          Object.entries(blockRow.locales).forEach(([blockLocale, blockLocaleData]) => {
            if (Object.keys(blockLocaleData).length > 0) {
              blockLocaleData._parentID = blockRow.row.id
              blockLocaleData._locale = blockLocale
              acc.push(blockLocaleData)
              blockLocaleIndexMap.push(i)
            }
          })
        }

        return acc
      }, [])

      if (blockLocaleRowsToInsert.length > 0) {
        await adapter.insert({
          db,
          tableName: `${tableName}${adapter.localesSuffix}`,
          values: blockLocaleRowsToInsert,
        })
      }

      await insertArrays({
        adapter,
        arrays: blockRows.map(({ arrays }) => arrays),
        db,
        parentRows: insertedBlockRows[tableName],
        uuidMap: arraysBlocksUUIDMap,
      })
    }

    // //////////////////////////////////
    // INSERT ARRAYS RECURSIVELY
    // //////////////////////////////////

    if (operation === 'update') {
      for (const arrayTableName of Object.keys(rowToInsert.arrays)) {
        await deleteExistingArrayRows({
          adapter,
          db,
          parentID: insertedRow.id,
          tableName: arrayTableName,
        })
      }
    }

    await insertArrays({
      adapter,
      arrays: [rowToInsert.arrays, rowToInsert.arraysToPush],
      db,
      parentRows: [insertedRow, insertedRow],
      uuidMap: arraysBlocksUUIDMap,
    })

    // //////////////////////////////////
    // INSERT hasMany SELECTS
    // //////////////////////////////////

    for (const [selectTableName, tableRows] of Object.entries(selectsToInsert)) {
      const selectTable = adapter.tables[selectTableName]
      if (operation === 'update') {
        await adapter.deleteWhere({
          db,
          tableName: selectTableName,
          where: eq(selectTable.parent, insertedRow.id),
        })
      }

      if (Object.keys(arraysBlocksUUIDMap).length > 0) {
        tableRows.forEach((row: RelationshipRow) => {
          if (row.parent in arraysBlocksUUIDMap) {
            row.parent = arraysBlocksUUIDMap[row.parent]
          }
        })
      }

      if (tableRows.length) {
        await adapter.insert({
          db,
          tableName: selectTableName,
          values: tableRows,
        })
      }
    }

    // //////////////////////////////////
    // Error Handling
    // //////////////////////////////////
  } catch (caughtError) {
    // Unique constraint violation error
    // '23505' is the code for PostgreSQL, and 'SQLITE_CONSTRAINT_UNIQUE' is for SQLite

    let error = caughtError
    if (typeof caughtError === 'object' && 'cause' in caughtError) {
      error = caughtError.cause
    }

    if (error.code === '23505' || error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      let fieldName: null | string = null
      // We need to try and find the right constraint for the field but if we can't we fallback to a generic message
      if (error.code === '23505') {
        // For PostgreSQL, we can try to extract the field name from the error constraint
        if (adapter.fieldConstraints?.[tableName]?.[error.constraint]) {
          fieldName = adapter.fieldConstraints[tableName]?.[error.constraint]
        } else {
          const replacement = `${tableName}_`

          if (error.constraint.includes(replacement)) {
            const replacedConstraint = error.constraint.replace(replacement, '')

            if (replacedConstraint && adapter.fieldConstraints[tableName]?.[replacedConstraint]) {
              fieldName = adapter.fieldConstraints[tableName][replacedConstraint]
            }
          }
        }

        if (!fieldName) {
          // Last case scenario we extract the key and value from the detail on the error
          const detail = error.detail
          const regex = /Key \(([^)]+)\)=\(([^)]+)\)/
          const match: string[] = detail.match(regex)

          if (match && match[1]) {
            const key = match[1]

            fieldName = key
          }
        }
      } else if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        /**
         * For SQLite, we can try to extract the field name from the error message
         * The message typically looks like:
         * "UNIQUE constraint failed: table_name.field_name"
         */
        const regex = /UNIQUE constraint failed: ([^.]+)\.([^.]+)/
        const match: string[] = error.message.match(regex)

        if (match && match[2]) {
          if (adapter.fieldConstraints[tableName]) {
            fieldName = adapter.fieldConstraints[tableName][`${match[2]}_idx`]
          }

          if (!fieldName) {
            fieldName = match[2]
          }
        }
      }

      throw new ValidationError(
        {
          id,
          errors: [
            {
              message: req?.t ? req.t('error:valueMustBeUnique') : 'Value must be unique',
              path: fieldName,
            },
          ],
          req,
        },
        req?.t,
      )
    } else {
      throw error
    }
  }

  if (ignoreResult === 'idOnly') {
    return { id: insertedRow.id } as T
  }

  if (ignoreResult) {
    return data as T
  }

  // //////////////////////////////////
  // RETRIEVE NEWLY UPDATED ROW
  // //////////////////////////////////

  const findManyArgs = buildFindManyArgs({
    adapter,
    depth: 0,
    fields,
    joinQuery: false,
    select,
    tableName,
  })

  findManyArgs.where = eq(adapter.tables[tableName].id, insertedRow.id)

  const doc = await db.query[tableName].findFirst(findManyArgs)

  // //////////////////////////////////
  // TRANSFORM DATA
  // //////////////////////////////////

  const result = transform<T>({
    adapter,
    config: adapter.payload.config,
    data: doc,
    fields,
    joinQuery: false,
    tableName,
  })

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: insertArrays.ts]---
Location: payload-main/packages/drizzle/src/upsertRow/insertArrays.ts

```typescript
import type { ArrayRowToInsert } from '../transform/write/types.js'
import type { DrizzleAdapter, DrizzleTransaction } from '../types.js'

type Args = {
  adapter: DrizzleAdapter
  arrays: {
    [tableName: string]: ArrayRowToInsert[]
  }[]
  db: DrizzleAdapter['drizzle'] | DrizzleTransaction
  parentRows: Record<string, unknown>[]
  uuidMap?: Record<string, number | string>
}

type RowsByTable = {
  [tableName: string]: {
    arrays: {
      [tableName: string]: ArrayRowToInsert[]
    }[]
    locales: Record<string, unknown>[]
    rows: Record<string, unknown>[]
  }
}

export const insertArrays = async ({
  adapter,
  arrays,
  db,
  parentRows,
  uuidMap = {},
}: Args): Promise<void> => {
  // Maintain a map of flattened rows by table
  const rowsByTable: RowsByTable = {}

  arrays.forEach((arraysByTable, parentRowIndex) => {
    if (!arraysByTable || Object.keys(arraysByTable).length === 0) {
      return
    }
    Object.entries(arraysByTable).forEach(([tableName, arrayRows]) => {
      // If the table doesn't exist in map, initialize it
      if (!rowsByTable[tableName]) {
        rowsByTable[tableName] = {
          arrays: [],
          locales: [],
          rows: [],
        }
      }

      const parentID = parentRows[parentRowIndex].id

      // Add any sub arrays that need to be created
      // We will call this recursively below
      arrayRows.forEach((arrayRow) => {
        if (Object.keys(arrayRow.arrays).length > 0) {
          rowsByTable[tableName].arrays.push(arrayRow.arrays)
        }

        // Set up parent IDs for both row and locale row
        arrayRow.row._parentID = parentID
        rowsByTable[tableName].rows.push(arrayRow.row)

        Object.entries(arrayRow.locales).forEach(([arrayRowLocale, arrayRowLocaleData]) => {
          arrayRowLocaleData._parentID = arrayRow.row.id
          arrayRowLocaleData._locale = arrayRowLocale
          rowsByTable[tableName].locales.push(arrayRowLocaleData)
          if (!arrayRow.row.id) {
            arrayRowLocaleData._getParentID = (rows: { _uuid: string; id: number }[]) => {
              const { id } = rows.find((each) => each._uuid === arrayRow.row._uuid)
              return id
            }
          }
        })
      })
    })
  })

  // Insert all corresponding arrays
  // (one insert per array table)
  for (const [tableName, row] of Object.entries(rowsByTable)) {
    // the nested arrays need the ID for the parentID foreign key
    let insertedRows: Args['parentRows']
    if (row.rows.length > 0) {
      insertedRows = await adapter.insert({
        db,
        tableName,
        values: row.rows,
      })

      insertedRows.forEach((row) => {
        if (
          typeof row._uuid === 'string' &&
          (typeof row.id === 'string' || typeof row.id === 'number')
        ) {
          uuidMap[row._uuid] = row.id
        }
      })
    }

    // Insert locale rows
    if (adapter.tables[`${tableName}${adapter.localesSuffix}`] && row.locales.length > 0) {
      if (!row.locales[0]._parentID) {
        row.locales = row.locales.map((localeRow) => {
          if (typeof localeRow._getParentID === 'function') {
            localeRow._parentID = localeRow._getParentID(insertedRows)
            delete localeRow._getParentID
          }
          return localeRow
        })
      }
      await adapter.insert({
        db,
        tableName: `${tableName}${adapter.localesSuffix}`,
        values: row.locales,
      })
    }

    // If there are sub arrays, call this function recursively
    if (row.arrays.length > 0) {
      await insertArrays({
        adapter,
        arrays: row.arrays,
        db,
        parentRows: insertedRows,
      })
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: shouldUseOptimizedUpsertRow.ts]---
Location: payload-main/packages/drizzle/src/upsertRow/shouldUseOptimizedUpsertRow.ts

```typescript
import type { FlattenedField } from 'payload'

/**
 * Checks whether we should use the upsertRow function for the passed data and otherwise use a simple SQL SET call.
 * We need to use upsertRow only when the data has arrays, blocks, hasMany select/text/number, localized fields, complex relationships.
 */
export const shouldUseOptimizedUpsertRow = ({
  data,
  fields,
}: {
  data: Record<string, unknown>
  fields: FlattenedField[]
}) => {
  let fieldsMatched = false

  for (const key in data) {
    const value = data[key]
    const field = fields.find((each) => each.name === key)

    if (!field) {
      continue
    }

    fieldsMatched = true

    if (
      field.type === 'blocks' ||
      ((field.type === 'text' ||
        field.type === 'relationship' ||
        field.type === 'upload' ||
        field.type === 'select' ||
        field.type === 'number') &&
        field.hasMany) ||
      ((field.type === 'relationship' || field.type === 'upload') &&
        Array.isArray(field.relationTo)) ||
      field.localized
    ) {
      return false
    }

    if (field.type === 'array') {
      if (typeof value === 'object' && '$push' in value && value.$push) {
        return shouldUseOptimizedUpsertRow({
          // Only check first row - this function cares about field definitions. Each array row will have the same field definitions.
          data: Array.isArray(value.$push) ? value.$push?.[0] : value.$push,
          fields: field.flattenedFields,
        })
      }
      return false
    }

    // Handle relationship $push and $remove operations
    if ((field.type === 'relationship' || field.type === 'upload') && field.hasMany) {
      if (typeof value === 'object' && ('$push' in value || '$remove' in value)) {
        return false // Use full upsertRow for relationship operations
      }
    }

    if (
      (field.type === 'group' || field.type === 'tab') &&
      value &&
      typeof value === 'object' &&
      !shouldUseOptimizedUpsertRow({
        data: value as Record<string, unknown>,
        fields: field.flattenedFields,
      })
    ) {
      return false
    }
  }

  // Handle dot-notation paths when no fields matched
  if (!fieldsMatched) {
    for (const key in data) {
      if (key.includes('.')) {
        // Split on first dot only
        const firstDotIndex = key.indexOf('.')
        const fieldName = key.substring(0, firstDotIndex)
        const remainingPath = key.substring(firstDotIndex + 1)

        const nestedData = { [fieldName]: { [remainingPath]: data[key] } }
        return shouldUseOptimizedUpsertRow({
          data: nestedData,
          fields,
        })
      }
    }
  }

  return true
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/drizzle/src/upsertRow/types.ts

```typescript
import type { SQL } from 'drizzle-orm'
import type { FlattenedField, JoinQuery, PayloadRequest, SelectType } from 'payload'

import type { DrizzleAdapter, DrizzleTransaction, GenericColumn } from '../types.js'

type BaseArgs = {
  adapter: DrizzleAdapter
  data: Record<string, unknown>
  db: DrizzleAdapter['drizzle'] | DrizzleTransaction
  fields: FlattenedField[]
  /**
   * When true, skips reading the data back from the database and returns the input data
   * @default false
   */
  ignoreResult?: 'idOnly' | boolean
  joinQuery?: JoinQuery
  path?: string
  req?: Partial<PayloadRequest>
  tableName: string
}

type CreateArgs = {
  id?: never
  joinQuery?: never
  operation: 'create'
  select?: SelectType
  upsertTarget?: never
  where?: never
} & BaseArgs

type UpdateArgs = {
  id?: number | string
  joinQuery?: JoinQuery
  operation: 'update'
  select?: SelectType
  upsertTarget?: GenericColumn
  where?: SQL<unknown>
} & BaseArgs

export type Args = CreateArgs | UpdateArgs
```

--------------------------------------------------------------------------------

---[FILE: appendPrefixToKeys.ts]---
Location: payload-main/packages/drizzle/src/utilities/appendPrefixToKeys.ts

```typescript
export const appendPrefixToObjectKeys = <T>(obj: Record<string, unknown>, prefix: string): T =>
  Object.entries(obj).reduce((res, [key, val]) => {
    res[`${prefix}_${key}`] = val
    return res
  }, {} as T)
```

--------------------------------------------------------------------------------

---[FILE: buildCreateMigration.ts]---
Location: payload-main/packages/drizzle/src/utilities/buildCreateMigration.ts

```typescript
import type { DrizzleSnapshotJSON } from 'drizzle-kit/api'
import type { CreateMigration } from 'payload'

import fs from 'fs'
import path from 'path'
import { getPredefinedMigration, writeMigrationIndex } from 'payload'
import prompts from 'prompts'

import type { DrizzleAdapter } from '../types.js'

import { getMigrationTemplate } from './getMigrationTemplate.js'

export const buildCreateMigration = ({
  executeMethod,
  filename,
  sanitizeStatements,
}: {
  executeMethod: string
  filename: string
  sanitizeStatements: (args: { sqlExecute: string; statements: string[] }) => string
}): CreateMigration => {
  const dirname = path.dirname(filename)
  return async function createMigration(
    this: DrizzleAdapter,
    { file, forceAcceptWarning, migrationName, payload, skipEmpty },
  ) {
    const dir = payload.db.migrationDir
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    const { generateDrizzleJson, generateMigration, upSnapshot } = this.requireDrizzleKit()

    const drizzleJsonAfter = await generateDrizzleJson(this.schema)

    const [yyymmdd, hhmmss] = new Date().toISOString().split('T')
    const formattedDate = yyymmdd.replace(/\D/g, '')
    const formattedTime = hhmmss.split('.')[0].replace(/\D/g, '')
    let imports: string = ''
    let downSQL: string
    let upSQL: string
    ;({ downSQL, imports, upSQL } = await getPredefinedMigration({
      dirname,
      file,
      migrationName,
      payload,
    }))

    const timestamp = `${formattedDate}_${formattedTime}`

    const name = migrationName || file?.split('/').slice(2).join('/')
    const fileName = `${timestamp}${name ? `_${name.replace(/\W/g, '_')}` : ''}`

    const filePath = `${dir}/${fileName}`

    let drizzleJsonBefore = this.defaultDrizzleSnapshot as DrizzleSnapshotJSON

    if (this.schemaName) {
      drizzleJsonBefore.schemas = {
        [this.schemaName]: this.schemaName,
      }
    }

    if (!upSQL) {
      // Get latest migration snapshot
      const latestSnapshot = fs
        .readdirSync(dir)
        .filter((file) => file.endsWith('.json'))
        .sort()
        .reverse()?.[0]

      if (latestSnapshot) {
        drizzleJsonBefore = JSON.parse(fs.readFileSync(`${dir}/${latestSnapshot}`, 'utf8'))

        if (upSnapshot && drizzleJsonBefore.version < drizzleJsonAfter.version) {
          drizzleJsonBefore = upSnapshot(drizzleJsonBefore)
        }
      }

      const sqlStatementsUp = await generateMigration(drizzleJsonBefore, drizzleJsonAfter)
      const sqlStatementsDown = await generateMigration(drizzleJsonAfter, drizzleJsonBefore)
      const sqlExecute = `await db.${executeMethod}(` + 'sql`'

      if (sqlStatementsUp?.length) {
        upSQL = sanitizeStatements({ sqlExecute, statements: sqlStatementsUp })
      }
      if (sqlStatementsDown?.length) {
        downSQL = sanitizeStatements({ sqlExecute, statements: sqlStatementsDown })
      }

      if (!upSQL?.length && !downSQL?.length && !forceAcceptWarning) {
        if (skipEmpty) {
          process.exit(0)
        }

        const { confirm: shouldCreateBlankMigration } = await prompts(
          {
            name: 'confirm',
            type: 'confirm',
            initial: false,
            message: 'No schema changes detected. Would you like to create a blank migration file?',
          },
          {
            onCancel: () => {
              process.exit(0)
            },
          },
        )

        if (!shouldCreateBlankMigration) {
          process.exit(0)
        }
      }

      // write schema
      fs.writeFileSync(`${filePath}.json`, JSON.stringify(drizzleJsonAfter, null, 2))
    }

    const data = getMigrationTemplate({
      downSQL: downSQL || `  // Migration code`,
      imports,
      packageName: payload.db.packageName,
      upSQL: upSQL || `  // Migration code`,
    })

    const fullPath = `${filePath}.ts`

    // write migration
    fs.writeFileSync(fullPath, data)

    writeMigrationIndex({ migrationsDir: payload.db.migrationDir })

    payload.logger.info({ msg: `Migration created at ${fullPath}` })
  }
}
```

--------------------------------------------------------------------------------

````
