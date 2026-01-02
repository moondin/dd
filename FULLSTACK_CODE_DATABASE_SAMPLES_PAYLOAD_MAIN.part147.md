---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 147
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 147 of 695)

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

---[FILE: buildForeignKeyName.ts]---
Location: payload-main/packages/drizzle/src/utilities/buildForeignKeyName.ts

```typescript
import type { DrizzleAdapter } from '../types.js'

export const buildForeignKeyName = ({
  name,
  adapter,
  number = 0,
}: {
  adapter: DrizzleAdapter
  name: string
  number?: number
}): string => {
  let foreignKeyName = `${name}${number ? `_${number}` : ''}_fk`

  if (foreignKeyName.length > 60) {
    const suffix = `${number ? `_${number}` : ''}_fk`
    foreignKeyName = `${name.slice(0, 60 - suffix.length)}${suffix}`
  }

  if (!adapter.foreignKeys.has(foreignKeyName)) {
    adapter.foreignKeys.add(foreignKeyName)
    return foreignKeyName
  }

  return buildForeignKeyName({
    name,
    adapter,
    number: number + 1,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: buildIndexName.ts]---
Location: payload-main/packages/drizzle/src/utilities/buildIndexName.ts

```typescript
import type { DrizzleAdapter } from '../types.js'

export const buildIndexName = ({
  name,
  adapter,
  appendSuffix = true,
  number = 0,
}: {
  adapter: DrizzleAdapter
  appendSuffix?: boolean
  name: string
  number?: number
}): string => {
  let indexName = `${name}${number ? `_${number}` : ''}${appendSuffix ? '_idx' : ''}`

  if (indexName.length > 60) {
    const suffix = `${number ? `_${number}` : ''}${appendSuffix ? '_idx' : ''}`
    indexName = `${name.slice(0, 60 - suffix.length)}${suffix}`
  }

  if (!adapter.indexes.has(indexName) && !(indexName in adapter.rawTables)) {
    adapter.indexes.add(indexName)
    return indexName
  }

  return buildIndexName({
    name,
    adapter,
    appendSuffix,
    number: number + 1,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: createBlocksMap.ts]---
Location: payload-main/packages/drizzle/src/utilities/createBlocksMap.ts

```typescript
export type BlocksMap = {
  [path: string]: Record<string, unknown>[]
}

export const createBlocksMap = (data: Record<string, unknown>): BlocksMap => {
  const blocksMap: BlocksMap = {}

  Object.entries(data).forEach(([key, rows]) => {
    if (key.startsWith('_blocks_') && Array.isArray(rows)) {
      let blockType = key.replace('_blocks_', '')
      const parsed = blockType.split('_')
      if (parsed.length === 2 && Number.isInteger(Number(parsed[1]))) {
        blockType = parsed[0]
      }

      rows.forEach((row) => {
        if ('_path' in row) {
          if (!(row._path in blocksMap)) {
            blocksMap[row._path] = []
          }

          row.blockType = blockType
          blocksMap[row._path].push(row)

          delete row._path
        }
      })

      delete data[key]
    }
  })

  Object.entries(blocksMap).reduce((sortedBlocksMap, [path, blocks]) => {
    sortedBlocksMap[path] = blocks.sort((a, b) => {
      if (typeof a._order === 'number' && typeof b._order === 'number') {
        return a._order - b._order
      }

      return 0
    })

    return sortedBlocksMap
  }, {})

  return blocksMap
}
```

--------------------------------------------------------------------------------

---[FILE: createRelationshipMap.ts]---
Location: payload-main/packages/drizzle/src/utilities/createRelationshipMap.ts

```typescript
// Flatten rows to object with path keys
// for easier retrieval
export const createPathMap = (rows: unknown): Record<string, Record<string, unknown>[]> => {
  let rowsByPath = {}

  if (Array.isArray(rows)) {
    rowsByPath = rows.reduce((res, row) => {
      const formattedRow = {
        ...row,
      }

      delete formattedRow.path

      if (!res[row.path]) {
        res[row.path] = []
      }
      res[row.path].push(row)

      return res
    }, {})
  }

  return rowsByPath
}
```

--------------------------------------------------------------------------------

---[FILE: createSchemaGenerator.ts]---
Location: payload-main/packages/drizzle/src/utilities/createSchemaGenerator.ts

```typescript
import type { GenerateSchema } from 'payload'

import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import path from 'path'

import type { ColumnToCodeConverter, DrizzleAdapter } from '../types.js'

/**
 * @example
 * console.log(sanitizeObjectKey("oneTwo"));   // oneTwo
 * console.log(sanitizeObjectKey("one-two"));  // 'one-two'
 * console.log(sanitizeObjectKey("_one$Two3")); // _one$Two3
 * console.log(sanitizeObjectKey("3invalid")); // '3invalid'
 */
const sanitizeObjectKey = (key: string) => {
  // Regular expression for a valid identifier
  const identifierRegex = /^[a-z_$][\w$]*$/i
  if (identifierRegex.test(key)) {
    return key
  }

  return `'${key}'`
}

/**
 * @example
 * (columns default-valuesID) -> columns['default-valuesID']
 * (columns defaultValues) -> columns.defaultValues
 */
const accessProperty = (objName: string, key: string) => {
  const sanitized = sanitizeObjectKey(key)

  if (sanitized.startsWith("'")) {
    return `${objName}[${sanitized}]`
  }

  return `${objName}.${key}`
}

export const createSchemaGenerator = ({
  columnToCodeConverter,
  corePackageSuffix,
  defaultOutputFile,
  enumImport,
  schemaImport,
  tableImport,
}: {
  columnToCodeConverter: ColumnToCodeConverter
  corePackageSuffix: string
  defaultOutputFile?: string
  enumImport?: string
  schemaImport?: string
  tableImport: string
}): GenerateSchema => {
  return async function generateSchema(
    this: DrizzleAdapter,
    { log = true, outputFile = defaultOutputFile, prettify = true } = {},
  ) {
    const importDeclarations: Record<string, Set<string>> = {}

    const tableDeclarations: string[] = []
    const enumDeclarations: string[] = []
    const relationsDeclarations: string[] = []

    const addImport = (from: string, name: string) => {
      if (!importDeclarations[from]) {
        importDeclarations[from] = new Set()
      }

      importDeclarations[from].add(name)
    }

    const corePackage = `${this.packageName}/drizzle/${corePackageSuffix}`

    let schemaDeclaration: null | string = null

    if (this.schemaName) {
      addImport(corePackage, schemaImport)
      schemaDeclaration = `export const db_schema = ${schemaImport}('${this.schemaName}')`
    }

    const enumFn = this.schemaName ? `db_schema.enum` : enumImport

    const enumsList: string[] = []
    const addEnum = (name: string, options: string[]) => {
      if (enumsList.some((each) => each === name)) {
        return
      }
      enumsList.push(name)
      enumDeclarations.push(
        `export const ${name} = ${enumFn}('${name}', [${options.map((option) => `'${option}'`).join(', ')}])`,
      )
    }

    if (this.payload.config.localization && enumImport) {
      addEnum('enum__locales', this.payload.config.localization.localeCodes)
    }

    const tableFn = this.schemaName ? `db_schema.table` : tableImport

    if (!this.schemaName) {
      addImport(corePackage, tableImport)
    }

    addImport(corePackage, 'index')
    addImport(corePackage, 'uniqueIndex')
    addImport(corePackage, 'foreignKey')

    addImport(`${this.packageName}/drizzle`, 'sql')
    addImport(`${this.packageName}/drizzle`, 'relations')

    for (const tableName in this.rawTables) {
      const table = this.rawTables[tableName]

      const extrasDeclarations: string[] = []

      if (table.indexes) {
        for (const key in table.indexes) {
          const index = table.indexes[key]
          let indexDeclaration = `${index.unique ? 'uniqueIndex' : 'index'}('${index.name}')`
          indexDeclaration += `.on(${typeof index.on === 'string' ? `${accessProperty('columns', index.on)}` : `${index.on.map((on) => `${accessProperty('columns', on)}`).join(', ')}`}),`
          extrasDeclarations.push(indexDeclaration)
        }
      }

      if (table.foreignKeys) {
        for (const key in table.foreignKeys) {
          const foreignKey = table.foreignKeys[key]

          let foreignKeyDeclaration = `foreignKey({
      columns: [${foreignKey.columns.map((col) => `columns['${col}']`).join(', ')}],
      foreignColumns: [${foreignKey.foreignColumns.map((col) => `${accessProperty(col.table, col.name)}`).join(', ')}],
      name: '${foreignKey.name}'
    })`

          if (foreignKey.onDelete) {
            foreignKeyDeclaration += `.onDelete('${foreignKey.onDelete}')`
          }
          if (foreignKey.onUpdate) {
            foreignKeyDeclaration += `.onUpdate('${foreignKey.onDelete}')`
          }

          foreignKeyDeclaration += ','

          extrasDeclarations.push(foreignKeyDeclaration)
        }
      }

      const tableCode = `
export const ${tableName} = ${tableFn}('${tableName}', {
${Object.entries(table.columns)
  .map(
    ([key, column]) =>
      `  ${sanitizeObjectKey(key)}: ${columnToCodeConverter({
        adapter: this,
        addEnum,
        addImport,
        column,
        locales: this.payload.config.localization
          ? this.payload.config.localization.localeCodes
          : undefined,
        tableKey: tableName,
      })},`,
  )
  .join('\n')}
}${
        extrasDeclarations.length
          ? `, (columns) => [
    ${extrasDeclarations.join(' ')}
]`
          : ''
      }
)
`

      tableDeclarations.push(tableCode)
    }

    for (const tableName in this.rawRelations) {
      const relations = this.rawRelations[tableName]
      const properties: string[] = []

      for (const key in relations) {
        const relation = relations[key]
        let declaration: string

        if (relation.type === 'one') {
          declaration = `${sanitizeObjectKey(key)}: one(${relation.to}, {
    ${relation.fields.some((field) => field.table !== tableName) ? '// @ts-expect-error Drizzle TypeScript bug for ONE relationships with a field in different table' : ''}
    fields: [${relation.fields.map((field) => `${accessProperty(field.table, field.name)}`).join(', ')}],
    references: [${relation.references.map((col) => `${accessProperty(relation.to, col)}`).join(', ')}],
    ${relation.relationName ? `relationName: '${relation.relationName}',` : ''}
    }),`
        } else {
          declaration = `${sanitizeObjectKey(key)}: many(${relation.to}, {
            ${relation.relationName ? `relationName: '${relation.relationName}',` : ''}
    }),`
        }

        properties.push(declaration)
      }

      // beautify / lintify relations callback output, when no many for example, don't add it
      const args = []

      if (Object.values(relations).some((rel) => rel.type === 'one')) {
        args.push('one')
      }

      if (Object.values(relations).some((rel) => rel.type === 'many')) {
        args.push('many')
      }

      const arg = args.length ? `{ ${args.join(', ')} }` : ''

      const declaration = `export const relations_${tableName} = relations(${tableName}, (${arg}) => ({
  ${properties.join('\n    ')}
      }))`

      relationsDeclarations.push(declaration)
    }

    if (enumDeclarations.length && !this.schemaName) {
      addImport(corePackage, enumImport)
    }

    const importDeclarationsSanitized: string[] = []

    for (const moduleName in importDeclarations) {
      const moduleImports = importDeclarations[moduleName]

      importDeclarationsSanitized.push(
        `import { ${Array.from(moduleImports).join(', ')} } from '${moduleName}'`,
      )
    }

    const schemaType = `
type DatabaseSchema = {
  ${[
    this.schemaName ? 'db_schema' : null,
    ...enumsList,
    ...Object.keys(this.rawTables),
    ...Object.keys(this.rawRelations).map((table) => `relations_${table}`),
  ]
    .filter(Boolean)
    .map((name) => `${name}: typeof ${name}`)
    .join('\n  ')}
}
    `

    const finalDeclaration = `
declare module '${this.packageName}' {
  export interface GeneratedDatabaseSchema {
    schema: DatabaseSchema
  }
}
    `

    const warning = `
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run \`payload generate:db-schema\` to regenerate this file.
 */
`

    const importTypes = `import type {} from '${this.packageName}'`

    let code = [
      warning,
      importTypes,
      ...importDeclarationsSanitized,
      schemaDeclaration,
      ...enumDeclarations,
      ...tableDeclarations,
      ...relationsDeclarations,
      schemaType,
      finalDeclaration,
    ]
      .filter(Boolean)
      .join('\n')

    if (!outputFile) {
      const cwd = process.cwd()
      const srcDir = path.resolve(cwd, 'src')

      if (existsSync(srcDir)) {
        outputFile = path.resolve(srcDir, 'payload-generated-schema.ts')
      } else {
        outputFile = path.resolve(cwd, 'payload-generated-schema.ts')
      }
    }

    if (prettify) {
      try {
        const prettier = await eval('import("prettier")')
        const configPath = await prettier.resolveConfigFile()
        const config = configPath ? await prettier.resolveConfig(configPath) : {}
        code = await prettier.format(code, { ...config, parser: 'typescript' })
      } catch {
        /* empty */
      }
    }

    await writeFile(outputFile, code, 'utf-8')

    if (log) {
      this.payload.logger.info(`Written ${outputFile}`)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: executeSchemaHooks.ts]---
Location: payload-main/packages/drizzle/src/utilities/executeSchemaHooks.ts

```typescript
import type { DrizzleAdapter } from '../types.js'

import { extendDrizzleTable } from './extendDrizzleTable.js'

type DatabaseSchema = {
  enums?: DrizzleAdapter['enums']
  relations: Record<string, any>
  tables: DrizzleAdapter['tables']
}

type Adapter = {
  afterSchemaInit: DatabaseSchemaHook[]
  beforeSchemaInit: DatabaseSchemaHook[]
} & DatabaseSchema

type DatabaseSchemaHookArgs = {
  adapter: Record<string, unknown>
  extendTable: typeof extendDrizzleTable
  schema: DatabaseSchema
}

type DatabaseSchemaHook = (args: DatabaseSchemaHookArgs) => DatabaseSchema | Promise<DatabaseSchema>

type Args = {
  adapter: Adapter
  type: 'afterSchemaInit' | 'beforeSchemaInit'
}

export const executeSchemaHooks = async ({ type, adapter }: Args): Promise<void> => {
  for (const hook of (adapter as unknown as Adapter)[type]) {
    const result = await hook({
      adapter: adapter as unknown as Adapter,
      extendTable: extendDrizzleTable,
      schema: {
        enums: adapter.enums,
        relations: adapter.relations,
        tables: adapter.tables,
      },
    })
    if (result.enums) {
      adapter.enums = result.enums
    }

    adapter.tables = result.tables
    adapter.relations = result.relations
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extendDrizzleTable.ts]---
Location: payload-main/packages/drizzle/src/utilities/extendDrizzleTable.ts

```typescript
/**
 * Implemented from:
 * https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/pg-core/table.ts#L73
 * Drizzle uses @internal JSDoc to remove their internal methods from types, for example
 * Table.Symbol, columnBuilder.build - but they actually exist.
 */
import type { ColumnBuilderBase } from 'drizzle-orm'

import { Table } from 'drizzle-orm'
import { APIError } from 'payload'

const { Symbol: DrizzleSymbol } = Table as unknown as {
  Symbol: {
    Columns: symbol
    ExtraConfigBuilder: symbol
    ExtraConfigColumns: symbol
  }
}

type Args = {
  columns?: Record<string, ColumnBuilderBase<any>>
  extraConfig?: (self: Record<string, any>) => object
  table: Table
}

/**
 * Extends the passed table with additional columns / extra config
 */
export const extendDrizzleTable = ({ columns, extraConfig, table }: Args): void => {
  const InlineForeignKeys = Object.getOwnPropertySymbols(table).find((symbol) => {
    return symbol.description?.includes('InlineForeignKeys')
  })

  if (!InlineForeignKeys) {
    throw new APIError(`Error when finding InlineForeignKeys Symbol`, 500)
  }

  if (columns) {
    for (const [name, columnBuilder] of Object.entries(columns) as [string, any][]) {
      const column = columnBuilder.build(table)

      table[name] = column
      table[InlineForeignKeys].push(...columnBuilder.buildForeignKeys(column, table))
      table[DrizzleSymbol.Columns][name] = column

      table[DrizzleSymbol.ExtraConfigColumns][name] =
        'buildExtraConfigColumn' in columnBuilder
          ? columnBuilder.buildExtraConfigColumn(table)
          : column
    }
  }

  if (extraConfig) {
    const originalExtraConfigBuilder = table[DrizzleSymbol.ExtraConfigBuilder]

    table[DrizzleSymbol.ExtraConfigBuilder] = (t) => {
      return {
        ...originalExtraConfigBuilder(t),
        ...extraConfig(t),
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getArrayRelationName.ts]---
Location: payload-main/packages/drizzle/src/utilities/getArrayRelationName.ts

```typescript
import type { ArrayField } from 'payload'

export const getArrayRelationName = ({
  field,
  path,
  tableName,
}: {
  field: ArrayField
  path: string
  tableName: string
}) => {
  if (field.dbName && path.length > 63) {
    return `_${tableName}`
  }

  return path
}
```

--------------------------------------------------------------------------------

---[FILE: getCollectionIdType.ts]---
Location: payload-main/packages/drizzle/src/utilities/getCollectionIdType.ts

```typescript
import type { Collection } from 'payload'

import type { DrizzleAdapter } from '../types.js'

const typeMap: Record<string, 'number' | 'text'> = {
  number: 'number',
  serial: 'number',
  text: 'text',
  uuid: 'text',
}

export const getCollectionIdType = ({
  adapter,
  collection,
}: {
  adapter: DrizzleAdapter
  collection: Collection
}) => {
  return collection.customIDType ?? typeMap[adapter.idType]
}
```

--------------------------------------------------------------------------------

---[FILE: getMigrationTemplate.ts]---
Location: payload-main/packages/drizzle/src/utilities/getMigrationTemplate.ts

```typescript
import type { MigrationTemplateArgs } from 'payload'

export const indent = (text: string) =>
  text
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')

export const getMigrationTemplate = ({
  downSQL,
  imports,
  packageName,
  upSQL,
}: MigrationTemplateArgs): string => `import { MigrateUpArgs, MigrateDownArgs, sql } from '${packageName}'
${imports ? `${imports}\n` : ''}
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
${indent(upSQL)}
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
${indent(downSQL)}
}
`
```

--------------------------------------------------------------------------------

---[FILE: getNameFromDrizzleTable.ts]---
Location: payload-main/packages/drizzle/src/utilities/getNameFromDrizzleTable.ts

```typescript
import type { Table } from 'drizzle-orm'

import { getTableName } from 'drizzle-orm'

export const getNameFromDrizzleTable = (table: Table): string => {
  return getTableName(table)
}
```

--------------------------------------------------------------------------------

---[FILE: getTransaction.ts]---
Location: payload-main/packages/drizzle/src/utilities/getTransaction.ts

```typescript
import type { PayloadRequest } from 'payload'

import type { DrizzleAdapter } from '../types.js'

/**
 * Returns current db transaction instance from req or adapter.drizzle itself
 *
 * If a transaction session doesn't exist (e.g., it was already committed/rolled back),
 * falls back to the default adapter.drizzle instance to prevent errors.
 */
export const getTransaction = async <T extends DrizzleAdapter = DrizzleAdapter>(
  adapter: T,
  req?: Partial<PayloadRequest>,
): Promise<T['drizzle']> => {
  if (!req?.transactionID) {
    return adapter.drizzle
  }

  return (adapter.sessions[await req.transactionID]?.db as T['drizzle']) || adapter.drizzle
}
```

--------------------------------------------------------------------------------

---[FILE: hasLocalesTable.ts]---
Location: payload-main/packages/drizzle/src/utilities/hasLocalesTable.ts

```typescript
import type { Field } from 'payload'

import { fieldAffectsData, fieldHasSubFields, fieldShouldBeLocalized } from 'payload/shared'

export const hasLocalesTable = ({
  fields,
  parentIsLocalized,
}: {
  fields: Field[]
  /**
   * @todo make required in v4.0. Usually you'd wanna pass this in
   */
  parentIsLocalized?: boolean
}): boolean => {
  return fields.some((field) => {
    // arrays always get a separate table
    if (field.type === 'array') {
      return false
    }
    if (fieldAffectsData(field) && fieldShouldBeLocalized({ field, parentIsLocalized })) {
      return true
    }
    if (fieldHasSubFields(field)) {
      return hasLocalesTable({
        fields: field.fields,
        parentIsLocalized: parentIsLocalized || ('localized' in field && field.localized),
      })
    }
    if (field.type === 'tabs') {
      return field.tabs.some((tab) =>
        hasLocalesTable({
          fields: tab.fields,
          parentIsLocalized: parentIsLocalized || tab.localized,
        }),
      )
    }
    return false
  })
}
```

--------------------------------------------------------------------------------

---[FILE: isArrayOfRows.ts]---
Location: payload-main/packages/drizzle/src/utilities/isArrayOfRows.ts

```typescript
export function isArrayOfRows(data: unknown): data is Record<string, unknown>[] {
  return Array.isArray(data)
}
```

--------------------------------------------------------------------------------

---[FILE: isPolymorphicRelationship.ts]---
Location: payload-main/packages/drizzle/src/utilities/isPolymorphicRelationship.ts

```typescript
import type { CollectionSlug } from 'payload'

export const isPolymorphicRelationship = (
  value: unknown,
): value is {
  relationTo: CollectionSlug
  value: number | string
} => {
  return (
    value &&
    typeof value === 'object' &&
    'relationTo' in value &&
    typeof value.relationTo === 'string' &&
    'value' in value
  )
}
```

--------------------------------------------------------------------------------

---[FILE: isValidStringID.spec.ts]---
Location: payload-main/packages/drizzle/src/utilities/isValidStringID.spec.ts

```typescript
import { isValidStringID } from './isValidStringID.js'

describe('isValidStringID', () => {
  it('should pass', () => {
    expect(isValidStringID('1')).toBe(true)
    expect(isValidStringID('a_b_c')).toBe(true)
    expect(isValidStringID('8cc2df6d-6e07-4da4-be48-5fa747c3b92b')).toBe(true)
  })

  it('should not pass', () => {
    expect(isValidStringID('1 2 3')).toBe(false)
    expect(isValidStringID('1@')).toBe(false)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: isValidStringID.ts]---
Location: payload-main/packages/drizzle/src/utilities/isValidStringID.ts

```typescript
export function isValidStringID(value: string) {
  return /^[\w-]+$/.test(value)
}
```

--------------------------------------------------------------------------------

---[FILE: json.ts]---
Location: payload-main/packages/drizzle/src/utilities/json.ts

```typescript
import type { Column, SQL } from 'drizzle-orm'

import { sql } from 'drizzle-orm'

import type { DrizzleAdapter } from '../types.js'

export function jsonAgg(adapter: DrizzleAdapter, expression: SQL) {
  if (adapter.name === 'sqlite') {
    return sql`coalesce(json_group_array(${expression}), '[]')`
  }

  return sql`coalesce(json_agg(${expression}), '[]'::json)`
}

/**
 * @param shape Potential for SQL injections, so you shouldn't allow user-specified key names
 */
export function jsonBuildObject<T extends Record<string, Column | SQL>>(
  adapter: DrizzleAdapter,
  shape: T,
) {
  const chunks: SQL[] = []

  Object.entries(shape).forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(','))
    }
    chunks.push(sql.raw(`'${key}',`))
    chunks.push(sql`${value}`)
  })

  if (adapter.name === 'sqlite') {
    return sql`json_object(${sql.join(chunks)})`
  }

  return sql`json_build_object(${sql.join(chunks)})`
}

export const jsonAggBuildObject = <T extends Record<string, Column | SQL>>(
  adapter: DrizzleAdapter,
  shape: T,
) => {
  return jsonAgg(adapter, jsonBuildObject(adapter, shape))
}
```

--------------------------------------------------------------------------------

---[FILE: migrationTableExists.ts]---
Location: payload-main/packages/drizzle/src/utilities/migrationTableExists.ts

```typescript
import type { LibSQLDatabase } from 'drizzle-orm/libsql'

import type { DrizzleAdapter, PostgresDB } from '../types.js'

export const migrationTableExists = async (
  adapter: DrizzleAdapter,
  db?: LibSQLDatabase | PostgresDB,
): Promise<boolean> => {
  let statement

  if (adapter.name === 'postgres') {
    const prependSchema = adapter.schemaName ? `"${adapter.schemaName}".` : ''
    statement = `SELECT to_regclass('${prependSchema}"payload_migrations"') AS exists;`
  }

  if (adapter.name === 'sqlite') {
    statement = `
      SELECT CASE
               WHEN COUNT(*) > 0 THEN 1
               ELSE 0
               END AS 'exists'
      FROM sqlite_master
      WHERE type = 'table'
        AND name = 'payload_migrations';`
  }

  const result = await adapter.execute({
    drizzle: db ?? adapter.drizzle,
    raw: statement,
  })

  const [row] = result.rows

  return row && typeof row === 'object' && 'exists' in row && !!row.exists
}
```

--------------------------------------------------------------------------------

---[FILE: parseError.ts]---
Location: payload-main/packages/drizzle/src/utilities/parseError.ts

```typescript
/**
 * Format error message with hint if available
 */
export const parseError = (err: unknown, msg: string): string => {
  let formattedMsg = `${msg}`
  if (err instanceof Error) {
    formattedMsg += ` ${err.message}.`
    // Check if the error has a hint property
    if ('hint' in err && typeof err.hint === 'string') {
      formattedMsg += ` ${err.hint}.`
    }
  }
  return formattedMsg
}
```

--------------------------------------------------------------------------------

---[FILE: pushDevSchema.ts]---
Location: payload-main/packages/drizzle/src/utilities/pushDevSchema.ts

```typescript
import { dequal } from 'dequal'
import prompts from 'prompts'

import type { BasePostgresAdapter } from '../postgres/types.js'
import type { DrizzleAdapter, PostgresDB, RawTable } from '../types.js'

const previousSchema: {
  localeCodes: null | string[]
  rawTables: null | Record<string, RawTable>
} = {
  localeCodes: null,
  rawTables: null,
}

/**
 * Pushes the development schema to the database using Drizzle.
 *
 * @param {DrizzleAdapter} adapter - The PostgresAdapter instance connected to the database.
 * @returns {Promise<void>} - A promise that resolves once the schema push is complete.
 */
export const pushDevSchema = async (adapter: DrizzleAdapter) => {
  if (process.env.PAYLOAD_FORCE_DRIZZLE_PUSH !== 'true') {
    const localeCodes =
      adapter.payload.config.localization && adapter.payload.config.localization.localeCodes

    const equal = dequal(previousSchema, {
      localeCodes,
      rawTables: adapter.rawTables,
    })

    if (equal) {
      if (adapter.logger) {
        adapter.payload.logger.info('No changes detected in schema, skipping schema push.')
      }

      return
    } else {
      previousSchema.localeCodes = localeCodes
      previousSchema.rawTables = adapter.rawTables
    }
  }

  const { pushSchema } = adapter.requireDrizzleKit()

  const { extensions = {}, tablesFilter } = adapter as BasePostgresAdapter

  // This will prompt if clarifications are needed for Drizzle to push new schema
  const { apply, hasDataLoss, warnings } = await pushSchema(
    adapter.schema,
    adapter.drizzle,
    adapter.schemaName ? [adapter.schemaName] : undefined,
    tablesFilter,
    // Drizzle extensionsFilter supports only postgis for now
    // https://github.com/drizzle-team/drizzle-orm/blob/83daf2d5cf023112de878bc2249ee2c41a2a5b1b/drizzle-kit/src/cli/validations/cli.ts#L26
    extensions.postgis ? ['postgis'] : undefined,
  )

  if (warnings.length) {
    let message = `Warnings detected during schema push: \n\n${warnings.join('\n')}\n\n`

    if (hasDataLoss) {
      message += `DATA LOSS WARNING: Possible data loss detected if schema is pushed.\n\n`
    }

    message += `Accept warnings and push schema to database?`

    const { confirm: acceptWarnings } = await prompts(
      {
        name: 'confirm',
        type: 'confirm',
        initial: false,
        message,
      },
      {
        onCancel: () => {
          process.exit(0)
        },
      },
    )

    // Exit if user does not accept warnings.
    // Q: Is this the right type of exit for this interaction?
    if (!acceptWarnings) {
      process.exit(0)
    }
  }

  await apply()
  const migrationsTable = adapter.schemaName
    ? `"${adapter.schemaName}"."payload_migrations"`
    : '"payload_migrations"'

  const drizzle = adapter.drizzle as PostgresDB

  const result = await adapter.execute({
    drizzle,
    raw: `SELECT * FROM ${migrationsTable} WHERE batch = '-1'`,
  })

  const devPush = result.rows

  if (!devPush.length) {
    // Use drizzle for insert so $defaultFn's are called
    await drizzle.insert(adapter.tables.payload_migrations).values({
      name: 'dev',
      batch: -1,
    })
  } else {
    await adapter.execute({
      drizzle,
      raw: `UPDATE ${migrationsTable} SET updated_at = CURRENT_TIMESTAMP WHERE batch = '-1'`,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: rawConstraint.ts]---
Location: payload-main/packages/drizzle/src/utilities/rawConstraint.ts

```typescript
const RawConstraintSymbol = Symbol('RawConstraint')

export const DistinctSymbol = Symbol('DistinctSymbol')

/**
 * You can use this to inject a raw query to where
 */
export const rawConstraint = (value: unknown) => ({
  type: RawConstraintSymbol,
  value,
})

export const isRawConstraint = (value: unknown): value is ReturnType<typeof rawConstraint> => {
  return value && typeof value === 'object' && 'type' in value && value.type === RawConstraintSymbol
}
```

--------------------------------------------------------------------------------

---[FILE: validateExistingBlockIsIdentical.ts]---
Location: payload-main/packages/drizzle/src/utilities/validateExistingBlockIsIdentical.ts

```typescript
import type { Block, Field, FlattenedBlock } from 'payload'

import {
  fieldAffectsData,
  fieldHasSubFields,
  fieldShouldBeLocalized,
  tabHasName,
} from 'payload/shared'

import type { RawTable } from '../types.js'

type Args = {
  block: Block
  localized: boolean
  /**
   * @todo make required in v4.0. Usually you'd wanna pass this in
   */
  parentIsLocalized?: boolean
  rootTableName: string
  table: RawTable
  tableLocales?: RawTable
}

const getFlattenedFieldNames = (args: {
  fields: Field[]
  parentIsLocalized: boolean
  prefix?: string
}): { localized?: boolean; name: string }[] => {
  const { fields, parentIsLocalized, prefix = '' } = args
  return fields.reduce((fieldsToUse, field) => {
    let fieldPrefix = prefix

    if (
      ['array', 'blocks', 'relationship', 'upload'].includes(field.type) ||
      ('hasMany' in field && field.hasMany === true)
    ) {
      return fieldsToUse
    }

    if (fieldHasSubFields(field)) {
      fieldPrefix = 'name' in field ? `${prefix}${field.name}_` : prefix
      return [
        ...fieldsToUse,
        ...getFlattenedFieldNames({
          fields: field.fields,
          parentIsLocalized: parentIsLocalized || ('localized' in field && field.localized),
          prefix: fieldPrefix,
        }),
      ]
    }

    if (field.type === 'tabs') {
      return [
        ...fieldsToUse,
        ...field.tabs.reduce((tabFields, tab) => {
          fieldPrefix = 'name' in tab ? `${prefix}_${tab.name}` : prefix
          return [
            ...tabFields,
            ...(tabHasName(tab)
              ? [{ ...tab, type: 'tab' }]
              : getFlattenedFieldNames({
                  fields: tab.fields,
                  parentIsLocalized: parentIsLocalized || tab.localized,
                  prefix: fieldPrefix,
                })),
          ]
        }, []),
      ]
    }

    if (fieldAffectsData(field)) {
      return [
        ...fieldsToUse,
        {
          name: `${fieldPrefix}${field.name}`,
          localized: fieldShouldBeLocalized({ field, parentIsLocalized }),
        },
      ]
    }

    return fieldsToUse
  }, [])
}

/**
 * returns true if all the fields in a block are identical to the existing table
 */
export const validateExistingBlockIsIdentical = ({
  block,
  localized,
  parentIsLocalized,
  table,
  tableLocales,
}: Args): boolean => {
  const fieldNames = getFlattenedFieldNames({
    fields: block.fields,
    parentIsLocalized: parentIsLocalized || localized,
  })

  const missingField =
    // ensure every field from the config is in the matching table
    fieldNames.find(({ name, localized }) => {
      const fieldTable = localized && tableLocales ? tableLocales : table
      return Object.keys(fieldTable.columns).indexOf(name) === -1
    }) ||
    // ensure every table column is matched for every field from the config
    Object.keys(table).find((fieldName) => {
      if (!['_locale', '_order', '_parentID', '_path', '_uuid'].includes(fieldName)) {
        return fieldNames.findIndex((field) => field.name) === -1
      }
    })

  if (missingField) {
    return false
  }

  return Boolean(localized) === Boolean(table.columns._locale)
}

export const InternalBlockTableNameIndex = Symbol('InternalBlockTableNameIndex')
export const setInternalBlockIndex = (block: FlattenedBlock, index: number) => {
  block[InternalBlockTableNameIndex] = index
}

export const resolveBlockTableName = (block: FlattenedBlock, originalTableName: string) => {
  if (!block[InternalBlockTableNameIndex]) {
    return originalTableName
  }

  return `${originalTableName}_${block[InternalBlockTableNameIndex]}`
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/email-nodemailer/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/email-nodemailer/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/email-nodemailer/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/packages/email-nodemailer/package.json

```json
{
  "name": "@payloadcms/email-nodemailer",
  "version": "3.68.5",
  "description": "Payload Nodemailer Email Adapter",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/email-nodemailer"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm build:types && pnpm build:swc",
    "build:clean": "find . \\( -type d \\( -name build -o -name dist -o -name .cache \\) -o -type f -name tsconfig.tsbuildinfo \\) -exec rm -rf {} + && pnpm build",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "nodemailer": "7.0.9"
  },
  "devDependencies": {
    "@types/nodemailer": "7.0.2",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

````
