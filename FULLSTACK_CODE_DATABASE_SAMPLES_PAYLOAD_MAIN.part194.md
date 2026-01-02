---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 194
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 194 of 695)

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

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/database/types.ts

```typescript
import type { TypeWithID } from '../collections/config/types.js'
import type { CollectionSlug, GlobalSlug, Job } from '../index.js'
import type {
  Document,
  JoinQuery,
  JsonObject,
  Payload,
  PayloadRequest,
  SelectType,
  Sort,
  Where,
} from '../types/index.js'
import type { TypeWithVersion } from '../versions/types.js'

export type { TypeWithVersion }

export interface BaseDatabaseAdapter {
  allowIDOnCreate?: boolean
  /**
   * Start a transaction, requiring commitTransaction() to be called for any changes to be made.
   * @returns an identifier for the transaction or null if one cannot be established
   */
  beginTransaction: BeginTransaction

  /**
   * Persist the changes made since the start of the transaction.
   */
  commitTransaction: CommitTransaction

  /**
   * Open the connection to the database
   */
  connect?: Connect
  count: Count
  countGlobalVersions: CountGlobalVersions
  countVersions: CountVersions

  create: Create

  createGlobal: CreateGlobal

  createGlobalVersion: CreateGlobalVersion
  /**
   * Output a migration file
   */
  createMigration: CreateMigration

  createVersion: CreateVersion

  /**
   * Specify if the ID is a text or number field by default within this database adapter.
   */
  defaultIDType: 'number' | 'text'

  deleteMany: DeleteMany

  deleteOne: DeleteOne
  deleteVersions: DeleteVersions

  /**
   * Terminate the connection with the database
   */
  destroy?: Destroy

  find: Find

  findDistinct: FindDistinct

  findGlobal: FindGlobal

  findGlobalVersions: FindGlobalVersions

  findOne: FindOne

  findVersions: FindVersions

  generateSchema?: GenerateSchema

  /**
   * Perform startup tasks required to interact with the database such as building Schema and models
   */
  init?: Init

  /**
   * Run any migration up functions that have not yet been performed and update the status
   */
  migrate: (args?: { migrations?: Migration[] }) => Promise<void>
  /**
   * Run any migration down functions that have been performed
   */
  migrateDown: () => Promise<void>

  /**
   * Drop the current database and run all migrate up functions
   */
  migrateFresh: (args: { forceAcceptWarning?: boolean }) => Promise<void>
  /**
   * Run all migration down functions before running up
   */
  migrateRefresh: () => Promise<void>
  /**
   * Run all migrate down functions
   */
  migrateReset: () => Promise<void>
  /**
   * Read the current state of migrations and output the result to show which have been run
   */
  migrateStatus: () => Promise<void>

  /**
   * Path to read and write migration files from
   */
  migrationDir: string

  /**
   * The name of the database adapter
   */
  name: string
  /**
   * Full package name of the database adapter
   *
   * @example @payloadcms/db-postgres
   */
  packageName: string
  /**
   * reference to the instance of payload
   */
  payload: Payload

  queryDrafts: QueryDrafts

  /**
   * Abort any changes since the start of the transaction.
   */
  rollbackTransaction: RollbackTransaction

  /**
   * A key-value store of all sessions open (used for transactions)
   */
  sessions?: {
    [id: string]: {
      db: unknown
      reject: () => Promise<void>
      resolve: () => Promise<void>
    }
  }

  /**
   * Updates a global that exists. If the global doesn't exist yet, this will not work - you should use `createGlobal` instead.
   */
  updateGlobal: UpdateGlobal

  updateGlobalVersion: UpdateGlobalVersion

  updateJobs: UpdateJobs

  updateMany: UpdateMany

  updateOne: UpdateOne
  updateVersion: UpdateVersion
  upsert: Upsert
}

export type Init = () => Promise<void> | void

type ConnectArgs = {
  hotReload: boolean
}

export type Connect = (args?: ConnectArgs) => Promise<void>

export type Destroy = () => Promise<void>

export type CreateMigration = (args: {
  file?: string
  forceAcceptWarning?: boolean
  migrationName?: string
  payload: Payload
  /**
   * Skips the prompt asking to create empty migrations
   */
  skipEmpty?: boolean
}) => Promise<void> | void

export type Transaction = (
  callback: () => Promise<void>,
  options?: Record<string, unknown>,
) => Promise<void>

export type BeginTransaction = (
  options?: Record<string, unknown>,
) => Promise<null | number | string>

export type RollbackTransaction = (id: number | Promise<number | string> | string) => Promise<void>

export type CommitTransaction = (id: number | Promise<number | string> | string) => Promise<void>

export type QueryDraftsArgs = {
  collection: CollectionSlug
  joins?: JoinQuery
  limit?: number
  locale?: string
  page?: number
  pagination?: boolean
  req?: Partial<PayloadRequest>
  select?: SelectType
  sort?: Sort
  where?: Where
}

export type QueryDrafts = <T = TypeWithID>(args: QueryDraftsArgs) => Promise<PaginatedDocs<T>>

export type FindOneArgs = {
  collection: CollectionSlug
  draftsEnabled?: boolean
  joins?: JoinQuery
  locale?: string
  req?: Partial<PayloadRequest>
  select?: SelectType
  where?: Where
}

export type FindOne = <T extends TypeWithID>(args: FindOneArgs) => Promise<null | T>

export type FindArgs = {
  collection: CollectionSlug
  draftsEnabled?: boolean
  joins?: JoinQuery
  /** Setting limit to 1 is equal to the previous Model.findOne(). Setting limit to 0 disables the limit */
  limit?: number
  locale?: string
  page?: number
  pagination?: boolean
  projection?: Record<string, unknown>
  req?: Partial<PayloadRequest>
  select?: SelectType
  skip?: number
  sort?: Sort
  versions?: boolean
  where?: Where
}

export type Find = <T = TypeWithID>(args: FindArgs) => Promise<PaginatedDocs<T>>

export type CountArgs = {
  collection: CollectionSlug
  locale?: string
  req?: Partial<PayloadRequest>
  where?: Where
}

export type Count = (args: CountArgs) => Promise<{ totalDocs: number }>

export type CountVersions = (args: CountArgs) => Promise<{ totalDocs: number }>

export type CountGlobalVersionArgs = {
  global: string
  locale?: string
  req?: Partial<PayloadRequest>
  where?: Where
}

export type CountGlobalVersions = (args: CountGlobalVersionArgs) => Promise<{ totalDocs: number }>

type BaseVersionArgs = {
  limit?: number
  locale?: string
  page?: number
  pagination?: boolean
  req?: Partial<PayloadRequest>
  select?: SelectType
  skip?: number
  sort?: Sort
  versions?: boolean
  where?: Where
}

export type FindVersionsArgs = {
  collection: CollectionSlug
} & BaseVersionArgs

export type FindVersions = <T = JsonObject>(
  args: FindVersionsArgs,
) => Promise<PaginatedDocs<TypeWithVersion<T>>>

export type FindGlobalVersionsArgs = {
  global: GlobalSlug
} & BaseVersionArgs

export type FindGlobalArgs = {
  locale?: string
  req?: Partial<PayloadRequest>
  select?: SelectType
  slug: string
  where?: Where
}

export type UpdateGlobalVersionArgs<T extends JsonObject = JsonObject> = {
  global: GlobalSlug
  locale?: string
  /**
   * Additional database adapter specific options to pass to the query
   */
  options?: Record<string, unknown>
  req?: Partial<PayloadRequest>
  /**
   * If true, returns the updated documents
   *
   * @default true
   */
  returning?: boolean
  select?: SelectType
  versionData: {
    createdAt?: string
    latest?: boolean
    parent?: number | string
    publishedLocale?: string
    updatedAt?: string
    version: T
  }
} & (
  | {
      id: number | string
      where?: never
    }
  | {
      id?: never
      where: Where
    }
)

/**
 * @todo type as Promise<TypeWithVersion<T> | null> in 4.0
 */
export type UpdateGlobalVersion = <T extends JsonObject = JsonObject>(
  args: UpdateGlobalVersionArgs<T>,
) => Promise<TypeWithVersion<T>>

export type FindGlobal = <T extends Record<string, unknown> = any>(
  args: FindGlobalArgs,
) => Promise<T>

export type CreateGlobalArgs<T extends Record<string, unknown> = any> = {
  data: T
  req?: Partial<PayloadRequest>
  /**
   * If true, returns the updated documents
   *
   * @default true
   */
  returning?: boolean
  slug: string
}
export type CreateGlobal = <T extends Record<string, unknown> = any>(
  args: CreateGlobalArgs<T>,
) => Promise<T>

export type UpdateGlobalArgs<T extends Record<string, unknown> = any> = {
  data: T
  /**
   * Additional database adapter specific options to pass to the query
   */
  options?: Record<string, unknown>
  req?: Partial<PayloadRequest>
  /**
   * If true, returns the updated documents
   *
   * @default true
   */
  returning?: boolean
  select?: SelectType
  slug: string
}
/**
 * @todo type as Promise<T | null> in 4.0
 */
export type UpdateGlobal = <T extends Record<string, unknown> = any>(
  args: UpdateGlobalArgs<T>,
) => Promise<T>
// export type UpdateOne = (args: UpdateOneArgs) => Promise<Document>

export type FindGlobalVersions = <T = JsonObject>(
  args: FindGlobalVersionsArgs,
) => Promise<PaginatedDocs<TypeWithVersion<T>>>

export type DeleteVersionsArgs = {
  collection?: CollectionSlug
  globalSlug?: GlobalSlug
  locale?: string
  req?: Partial<PayloadRequest>
  sort?: {
    [key: string]: string
  }
  where: Where
}

export type CreateVersionArgs<T extends JsonObject = JsonObject> = {
  autosave: boolean
  collectionSlug: CollectionSlug
  createdAt: string
  /** ID of the parent document for which the version should be created for */
  parent: number | string
  publishedLocale?: string
  req?: Partial<PayloadRequest>
  /**
   * If true, returns the updated documents
   *
   * @default true
   */
  returning?: boolean
  select?: SelectType
  /**
   * If provided, the snapshot will be created
   * after a version is created (not during autosave)
   */
  snapshot?: true
  updatedAt: string
  versionData: T
}

export type CreateVersion = <T extends JsonObject = JsonObject>(
  args: CreateVersionArgs<T>,
) => Promise<TypeWithVersion<T>>

export type CreateGlobalVersionArgs<T extends JsonObject = JsonObject> = {
  autosave: boolean
  createdAt: string
  globalSlug: GlobalSlug
  publishedLocale?: string
  req?: Partial<PayloadRequest>
  /**
   * If true, returns the updated documents
   *
   * @default true
   */
  returning?: boolean
  select?: SelectType
  /**
   * If provided, the snapshot will be created
   * after a version is created (not during autosave)
   */
  snapshot?: true
  updatedAt: string
  versionData: T
}

export type CreateGlobalVersion = <T extends JsonObject = JsonObject>(
  args: CreateGlobalVersionArgs<T>,
) => Promise<Omit<TypeWithVersion<T>, 'parent'>>

export type DeleteVersions = (args: DeleteVersionsArgs) => Promise<void>

export type UpdateVersionArgs<T extends JsonObject = JsonObject> = {
  collection: CollectionSlug
  locale?: string
  /**
   * Additional database adapter specific options to pass to the query
   */
  options?: Record<string, unknown>
  req?: Partial<PayloadRequest>
  /**
   * If true, returns the updated documents
   *
   * @default true
   */
  returning?: boolean
  select?: SelectType
  versionData: {
    createdAt?: string
    latest?: boolean
    parent?: number | string
    publishedLocale?: string
    updatedAt?: string
    version: T
  }
} & (
  | {
      id: number | string
      where?: never
    }
  | {
      id?: never
      where: Where
    }
)

/**
 * @todo type as Promise<TypeWithVersion<T> | null> in 4.0
 */
export type UpdateVersion = <T extends JsonObject = JsonObject>(
  args: UpdateVersionArgs<T>,
) => Promise<TypeWithVersion<T>>

export type CreateArgs = {
  collection: CollectionSlug
  data: Record<string, unknown>
  draft?: boolean
  locale?: string
  req?: Partial<PayloadRequest>
  /**
   * If true, returns the updated documents
   *
   * @default true
   */
  returning?: boolean
  select?: SelectType
}

export type FindDistinctArgs = {
  collection: CollectionSlug
  field: string
  limit?: number
  locale?: string
  page?: number
  req?: Partial<PayloadRequest>
  sort?: Sort
  where?: Where
}

export type PaginatedDistinctDocs<T extends Record<string, unknown>> = {
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage?: null | number | undefined
  page: number
  pagingCounter: number
  prevPage?: null | number | undefined
  totalDocs: number
  totalPages: number
  values: T[]
}

export type FindDistinct = (
  args: FindDistinctArgs,
) => Promise<PaginatedDistinctDocs<Record<string, any>>>

export type Create = (args: CreateArgs) => Promise<Document>

export type UpdateOneArgs = {
  collection: CollectionSlug
  data: Record<string, unknown>
  draft?: boolean
  joins?: JoinQuery
  locale?: string
  /**
   * Additional database adapter specific options to pass to the query
   */
  options?: Record<string, unknown>
  req?: Partial<PayloadRequest>
  /**
   * If true, returns the updated documents
   *
   * @default true
   */
  returning?: boolean
  select?: SelectType
} & (
  | {
      id: number | string
      where?: never
    }
  | {
      id?: never
      where: Where
    }
)

/**
 * @todo type as Promise<Document | null> in 4.0
 */
export type UpdateOne = (args: UpdateOneArgs) => Promise<Document>

export type UpdateManyArgs = {
  collection: CollectionSlug
  data: Record<string, unknown>
  draft?: boolean
  joins?: JoinQuery
  limit?: number
  locale?: string
  /**
   * Additional database adapter specific options to pass to the query
   */
  options?: Record<string, unknown>
  req?: Partial<PayloadRequest>
  /**
   * If true, returns the updated documents
   *
   * @default true
   */
  returning?: boolean
  select?: SelectType
  sort?: Sort
  where: Where
}

export type UpdateMany = (args: UpdateManyArgs) => Promise<Document[] | null>

export type UpdateJobsArgs = {
  data: Record<string, unknown>
  req?: Partial<PayloadRequest>
  /**
   * If true, returns the updated documents
   *
   * @default true
   */
  returning?: boolean
} & (
  | {
      id: number | string
      limit?: never
      sort?: never
      where?: never
    }
  | {
      id?: never
      limit?: number
      sort?: Sort
      where: Where
    }
)

export type UpdateJobs = (args: UpdateJobsArgs) => Promise<Job[] | null>

export type UpsertArgs = {
  collection: CollectionSlug
  data: Record<string, unknown>
  joins?: JoinQuery
  locale?: string
  req?: Partial<PayloadRequest>
  /**
   * If true, returns the updated documents
   *
   * @default true
   */
  returning?: boolean
  select?: SelectType
  where: Where
}

export type Upsert = (args: UpsertArgs) => Promise<Document>

export type DeleteOneArgs = {
  collection: CollectionSlug
  joins?: JoinQuery
  req?: Partial<PayloadRequest>
  /**
   * If true, returns the updated documents
   *
   * @default true
   */
  returning?: boolean
  select?: SelectType
  where: Where
}

/**
 * @todo type as Promise<Document | null> in 4.0
 */
export type DeleteOne = (args: DeleteOneArgs) => Promise<Document>

export type DeleteManyArgs = {
  collection: CollectionSlug
  joins?: JoinQuery
  req?: Partial<PayloadRequest>
  where: Where
}

export type DeleteMany = (args: DeleteManyArgs) => Promise<void>

export type Migration = {
  down: (args: unknown) => Promise<void>
  up: (args: unknown) => Promise<void>
} & MigrationData

export type MigrationData = {
  batch?: number
  id?: string
  name: string
}

export type PaginatedDocs<T = any> = {
  docs: T[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage?: null | number | undefined
  page?: number
  pagingCounter: number
  prevPage?: null | number | undefined
  totalDocs: number
  totalPages: number
}

export type DatabaseAdapterResult<T = BaseDatabaseAdapter> = {
  allowIDOnCreate?: boolean
  defaultIDType: 'number' | 'text'
  init: (args: { payload: Payload }) => T
  /**
   * The name of the database adapter. For example, "postgres" or "mongoose".
   *
   * @todo make required in 4.0
   */
  name?: string
}

export type DBIdentifierName =
  | ((Args: {
      /** The name of the parent table when using relational DBs */
      tableName?: string
    }) => string)
  | string

export type MigrationTemplateArgs = {
  downSQL?: string
  imports?: string
  packageName?: string
  upSQL?: string
}

export type GenerateSchemaArgs = {
  log?: boolean
  outputFile?: string
  prettify?: boolean
}

export type GenerateSchema = (args?: GenerateSchemaArgs) => Promise<void>
```

--------------------------------------------------------------------------------

---[FILE: createMigration.ts]---
Location: payload-main/packages/payload/src/database/migrations/createMigration.ts

```typescript
import fs from 'fs'

import type { CreateMigration } from '../types.js'

import { writeMigrationIndex } from '../../index.js'
import { migrationTemplate } from './migrationTemplate.js'

export const createMigration: CreateMigration = function createMigration({
  migrationName,
  payload,
}) {
  const dir = payload.db.migrationDir
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const [yyymmdd, hhmmss] = new Date().toISOString().split('T')
  const formattedDate = yyymmdd!.replace(/\D/g, '')
  const formattedTime = hhmmss!.split('.')[0]!.replace(/\D/g, '')

  const timestamp = `${formattedDate}_${formattedTime}`

  const formattedName = migrationName!.replace(/\W/g, '_')
  const fileName = `${timestamp}_${formattedName}.ts`
  const filePath = `${dir}/${fileName}`
  fs.writeFileSync(filePath, migrationTemplate)

  writeMigrationIndex({ migrationsDir: payload.db.migrationDir })

  payload.logger.info({ msg: `Migration created at ${filePath}` })
}
```

--------------------------------------------------------------------------------

---[FILE: findMigrationDir.spec.ts]---
Location: payload-main/packages/payload/src/database/migrations/findMigrationDir.spec.ts

```typescript
import { findMigrationDir } from './findMigrationDir'
import fs from 'fs'
import path from 'path'

const workDir = path.resolve(import.meta.dirname, '_tmp')

describe('findMigrationDir', () => {
  beforeEach(() => {
    const cwdSpy = jest.spyOn(process, 'cwd')
    cwdSpy.mockReturnValue(workDir)
    fs.mkdirSync(workDir, { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(workDir, { force: true, recursive: true })
  })

  it('should return the passed directory', () => {
    const dir = path.resolve(workDir, 'custom_migrations')
    expect(findMigrationDir(dir)).toBe(dir)
  })

  it('should return src/migrations because that folder exists', () => {
    fs.mkdirSync(path.resolve(workDir, 'src/migrations'), { recursive: true })
    expect(findMigrationDir()).toBe(path.resolve(workDir, 'src/migrations'))
  })

  it('should return dist/migrations because that folder exists', () => {
    fs.mkdirSync(path.resolve(workDir, 'dist/migrations'), { recursive: true })
    expect(findMigrationDir()).toBe(path.resolve(workDir, 'dist/migrations'))
  })

  it('should return src/migrations because src exists', () => {
    fs.mkdirSync(path.resolve(workDir, 'src'), { recursive: true })
    expect(findMigrationDir()).toBe(path.resolve(workDir, 'src/migrations'))
  })

  it('should return migrations because src does not exist', () => {
    expect(findMigrationDir()).toBe(path.resolve(workDir, 'migrations'))
  })
})
```

--------------------------------------------------------------------------------

---[FILE: findMigrationDir.ts]---
Location: payload-main/packages/payload/src/database/migrations/findMigrationDir.ts

```typescript
import fs from 'fs'
import path from 'path'

/**
 * Attempt to find migrations directory.
 *
 * Checks for the following directories in order:
 * - `migrationDir` argument from Payload config
 * - `src/migrations`
 * - `dist/migrations`
 * - `migrations`
 *
 * @param migrationDir
 * @default src/migrations`, if the src folder does not exists - migrations.
 * @returns
 */
export const findMigrationDir = (migrationDir?: string): string => {
  const cwd = process.cwd()

  const srcMigrationsDir = path.resolve(cwd, 'src/migrations')
  const distMigrationsDir = path.resolve(cwd, 'dist/migrations')
  const relativeMigrations = path.resolve(cwd, 'migrations')

  // Use arg if provided
  if (migrationDir) {
    return migrationDir
  }

  // Check other common locations
  if (fs.existsSync(srcMigrationsDir)) {
    return srcMigrationsDir
  }

  if (fs.existsSync(distMigrationsDir)) {
    return distMigrationsDir
  }

  if (fs.existsSync(relativeMigrations)) {
    return relativeMigrations
  }

  if (fs.existsSync(path.resolve(cwd, 'src'))) {
    return srcMigrationsDir
  }

  return relativeMigrations
}
```

--------------------------------------------------------------------------------

---[FILE: getMigrations.ts]---
Location: payload-main/packages/payload/src/database/migrations/getMigrations.ts

```typescript
import type { Payload } from '../../index.js'
import type { MigrationData } from '../types.js'

/**
 * Gets all existing migrations from the database, excluding the dev migration
 */
export async function getMigrations({
  payload,
}: {
  payload: Payload
}): Promise<{ existingMigrations: MigrationData[]; latestBatch: number }> {
  const migrationQuery = await payload.find({
    collection: 'payload-migrations',
    limit: 0,
    sort: ['-batch', '-name'],
    where: {
      batch: {
        not_equals: -1,
      },
    },
  })

  const existingMigrations = migrationQuery.docs as unknown as MigrationData[]

  // Get the highest batch number from existing migrations
  const latestBatch = Number(existingMigrations?.[0]?.batch) || 0

  return {
    existingMigrations,
    latestBatch,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getPredefinedMigration.ts]---
Location: payload-main/packages/payload/src/database/migrations/getPredefinedMigration.ts

```typescript
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

import type { Payload } from '../../index.js'
import type { MigrationTemplateArgs } from '../types.js'

/**
 * Get predefined migration 'up', 'down' and 'imports'
 */
export const getPredefinedMigration = async ({
  dirname,
  file,
  migrationName: migrationNameArg,
  payload,
}: {
  dirname: string
  file?: string
  migrationName?: string
  payload: Payload
}): Promise<MigrationTemplateArgs> => {
  // Check for predefined migration.
  // Either passed in via --file or prefixed with '@payloadcms/db-mongodb/' for example
  const importPath = file ?? migrationNameArg

  if (importPath?.startsWith('@payloadcms/db-')) {
    // removes the package name from the migrationName.
    const migrationName = importPath.split('/').slice(2).join('/')
    let cleanPath = path.join(dirname, `./predefinedMigrations/${migrationName}`)
    if (fs.existsSync(`${cleanPath}.mjs`)) {
      cleanPath = `${cleanPath}.mjs`
    } else if (fs.existsSync(`${cleanPath}.js`)) {
      cleanPath = `${cleanPath}.js`
    } else {
      payload.logger.error({
        msg: `Canned migration ${migrationName} not found.`,
      })
      process.exit(1)
    }
    cleanPath = cleanPath.replaceAll('\\', '/')
    const moduleURL = pathToFileURL(cleanPath)
    try {
      const { downSQL, imports, upSQL } = await eval(`import('${moduleURL.href}')`)
      return {
        downSQL,
        imports,
        upSQL,
      }
    } catch (err) {
      payload.logger.error({
        err,
        msg: `Error loading predefined migration ${migrationName}`,
      })
      process.exit(1)
    }
  } else if (importPath) {
    try {
      const { downSQL, imports, upSQL } = await eval(`import('${importPath}')`)
      return {
        downSQL,
        imports,
        upSQL,
      }
    } catch (_err) {
      if (importPath?.includes('/')) {
        // We can assume that the intent was to import a file, thus we throw an error.
        throw new Error(`Error importing migration file from ${importPath}`)
      }
      // Silently fail. If the migration cannot be imported, it will be created as a blank migration and the import path will be used as the migration name.
      return {}
    }
  }
  return {}
}
```

--------------------------------------------------------------------------------

---[FILE: migrate.ts]---
Location: payload-main/packages/payload/src/database/migrations/migrate.ts

```typescript
import type { BaseDatabaseAdapter } from '../types.js'

import { commitTransaction } from '../../utilities/commitTransaction.js'
import { createLocalReq } from '../../utilities/createLocalReq.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { getMigrations } from './getMigrations.js'
import { readMigrationFiles } from './readMigrationFiles.js'

export const migrate: BaseDatabaseAdapter['migrate'] = async function migrate(
  this: BaseDatabaseAdapter,
  args,
): Promise<void> {
  const { payload } = this
  const migrationFiles = args?.migrations || (await readMigrationFiles({ payload }))
  const { existingMigrations, latestBatch } = await getMigrations({ payload })

  const newBatch = latestBatch + 1

  // Execute 'up' function for each migration sequentially
  for (const migration of migrationFiles) {
    const existingMigration = existingMigrations.find(
      (existing) => existing.name === migration.name,
    )

    // Run migration if not found in database
    if (existingMigration) {
      continue
    }

    const start = Date.now()
    const req = await createLocalReq({}, payload)

    payload.logger.info({ msg: `Migrating: ${migration.name}` })

    try {
      await initTransaction(req)
      const session = payload.db.sessions?.[await req.transactionID!]
      await migration.up({ payload, req, session })
      payload.logger.info({ msg: `Migrated:  ${migration.name} (${Date.now() - start}ms)` })
      await payload.create({
        collection: 'payload-migrations',
        data: {
          name: migration.name,
          batch: newBatch,
        },
        req,
      })
      await commitTransaction(req)
    } catch (err: unknown) {
      await killTransaction(req)
      payload.logger.error({ err, msg: `Error running migration ${migration.name}` })
      throw err
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: migrateDown.ts]---
Location: payload-main/packages/payload/src/database/migrations/migrateDown.ts

```typescript
import type { BaseDatabaseAdapter } from '../types.js'

import { commitTransaction } from '../../utilities/commitTransaction.js'
import { createLocalReq } from '../../utilities/createLocalReq.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { getMigrations } from './getMigrations.js'
import { readMigrationFiles } from './readMigrationFiles.js'

export async function migrateDown(this: BaseDatabaseAdapter): Promise<void> {
  const { payload } = this
  const migrationFiles = await readMigrationFiles({ payload })

  const { existingMigrations, latestBatch } = await getMigrations({
    payload,
  })

  if (!existingMigrations?.length) {
    payload.logger.info({ msg: 'No migrations to rollback.' })
    return
  }

  payload.logger.info({
    msg: `Rolling back batch ${latestBatch} consisting of ${existingMigrations.length} migration(s).`,
  })

  const latestBatchMigrations = existingMigrations.filter(({ batch }) => batch === latestBatch)

  for (const migration of latestBatchMigrations) {
    const migrationFile = migrationFiles.find((m) => m.name === migration.name)
    if (!migrationFile) {
      throw new Error(`Migration ${migration.name} not found locally.`)
    }

    const start = Date.now()
    const req = await createLocalReq({}, payload)

    try {
      payload.logger.info({ msg: `Migrating down: ${migrationFile.name}` })
      await initTransaction(req)
      const session = payload.db.sessions?.[await req.transactionID!]
      await migrationFile.down({ payload, req, session })
      payload.logger.info({
        msg: `Migrated down:  ${migrationFile.name} (${Date.now() - start}ms)`,
      })
      // Waiting for implementation here
      await payload.delete({
        id: migration.id!,
        collection: 'payload-migrations',
        req,
      })

      await commitTransaction(req)
    } catch (err: unknown) {
      await killTransaction(req)
      payload.logger.error({
        err,
        msg: `Error running migration ${migrationFile.name}`,
      })
      process.exit(1)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: migrateRefresh.ts]---
Location: payload-main/packages/payload/src/database/migrations/migrateRefresh.ts

```typescript
import type { BaseDatabaseAdapter } from '../types.js'

import { commitTransaction } from '../../utilities/commitTransaction.js'
import { createLocalReq } from '../../utilities/createLocalReq.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { getMigrations } from './getMigrations.js'
import { readMigrationFiles } from './readMigrationFiles.js'

/**
 * Run all migration down functions before running up
 */
export async function migrateRefresh(this: BaseDatabaseAdapter) {
  const { payload } = this
  const migrationFiles = await readMigrationFiles({ payload })

  const { existingMigrations } = await getMigrations({
    payload,
  })

  const req = await createLocalReq({}, payload)

  if (existingMigrations?.length) {
    payload.logger.info({
      msg: `Rolling back all ${existingMigrations.length} migration(s).`,
    })
    // Reverse order of migrations to rollback
    existingMigrations.reverse()

    for (const migration of existingMigrations) {
      try {
        const migrationFile = migrationFiles.find((m) => m.name === migration.name)
        if (!migrationFile) {
          throw new Error(`Migration ${migration.name} not found locally.`)
        }

        payload.logger.info({ msg: `Migrating down: ${migration.name}` })
        const start = Date.now()
        await initTransaction(req)
        const session = payload.db.sessions?.[await req.transactionID!]
        await migrationFile.down({ payload, req, session })
        payload.logger.info({
          msg: `Migrated down:  ${migration.name} (${Date.now() - start}ms)`,
        })
        await payload.delete({
          collection: 'payload-migrations',
          req,
          where: {
            name: {
              equals: migration.name,
            },
          },
        })
      } catch (err: unknown) {
        await killTransaction(req)
        let msg = `Error running migration ${migration.name}. Rolling back.`
        if (err instanceof Error) {
          msg += ` ${err.message}`
        }
        payload.logger.error({
          err,
          msg,
        })
        process.exit(1)
      }
    }
  } else {
    payload.logger.info({ msg: 'No migrations to rollback.' })
  }

  // Run all migrate up
  for (const migration of migrationFiles) {
    payload.logger.info({ msg: `Migrating: ${migration.name}` })
    try {
      const start = Date.now()
      await initTransaction(req)
      await migration.up({ payload, req })
      await payload.create({
        collection: 'payload-migrations',
        data: {
          name: migration.name,
          executed: true,
        },
        req,
      })
      await commitTransaction(req)

      payload.logger.info({ msg: `Migrated:  ${migration.name} (${Date.now() - start}ms)` })
    } catch (err: unknown) {
      await killTransaction(req)
      let msg = `Error running migration ${migration.name}. Rolling back.`
      if (err instanceof Error) {
        msg += ` ${err.message}`
      }
      payload.logger.error({
        err,
        msg,
      })
      process.exit(1)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: migrateReset.ts]---
Location: payload-main/packages/payload/src/database/migrations/migrateReset.ts

```typescript
import type { BaseDatabaseAdapter } from '../types.js'

import { commitTransaction } from '../../utilities/commitTransaction.js'
import { createLocalReq } from '../../utilities/createLocalReq.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { getMigrations } from './getMigrations.js'
import { readMigrationFiles } from './readMigrationFiles.js'

export async function migrateReset(this: BaseDatabaseAdapter): Promise<void> {
  const { payload } = this
  const migrationFiles = await readMigrationFiles({ payload })

  const { existingMigrations } = await getMigrations({ payload })

  if (!existingMigrations?.length) {
    payload.logger.info({ msg: 'No migrations to reset.' })
    return
  }

  const req = await createLocalReq({}, payload)

  migrationFiles.reverse()

  // Rollback all migrations in order
  for (const migration of migrationFiles) {
    // Create or update migration in database
    const existingMigration = existingMigrations.find(
      (existing) => existing.name === migration.name,
    )
    if (existingMigration) {
      payload.logger.info({ msg: `Migrating down: ${migration.name}` })
      try {
        const start = Date.now()
        await initTransaction(req)
        const session = payload.db.sessions?.[await req.transactionID!]
        await migration.down({ payload, req, session })
        await payload.delete({
          collection: 'payload-migrations',
          req,
          where: {
            id: {
              equals: existingMigration.id,
            },
          },
        })
        await commitTransaction(req)
        payload.logger.info({ msg: `Migrated down:  ${migration.name} (${Date.now() - start}ms)` })
      } catch (err: unknown) {
        await killTransaction(req)
        payload.logger.error({ err, msg: `Error running migration ${migration.name}` })
        throw err
      }
    }
  }

  // Delete dev migration
  try {
    await payload.delete({
      collection: 'payload-migrations',
      where: {
        batch: {
          equals: -1,
        },
      },
    })
  } catch (err: unknown) {
    payload.logger.error({ err, msg: 'Error deleting dev migration' })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: migrateStatus.ts]---
Location: payload-main/packages/payload/src/database/migrations/migrateStatus.ts

```typescript
import { Table } from 'console-table-printer'

import type { BaseDatabaseAdapter } from '../types.js'

import { getMigrations } from './getMigrations.js'
import { readMigrationFiles } from './readMigrationFiles.js'

export async function migrateStatus(this: BaseDatabaseAdapter): Promise<void> {
  const { payload } = this
  const migrationFiles = await readMigrationFiles({ payload })

  payload.logger.debug({
    msg: `Found ${migrationFiles.length} migration files.`,
  })

  const { existingMigrations } = await getMigrations({ payload })

  if (!migrationFiles.length) {
    payload.logger.info({ msg: 'No migrations found.' })
    return
  }

  // Compare migration files to existing migrations
  const statuses = migrationFiles.map((migration) => {
    const existingMigration = existingMigrations.find((m) => m.name === migration.name)
    return {
      Name: migration.name,

      Batch: existingMigration?.batch,
      Ran: existingMigration ? 'Yes' : 'No',
    }
  })

  const p = new Table()

  statuses.forEach((s) => {
    p.addRow(s, {
      color: s.Ran === 'Yes' ? 'green' : 'red',
    })
  })
  p.printTable()
}
```

--------------------------------------------------------------------------------

---[FILE: migrationsCollection.ts]---
Location: payload-main/packages/payload/src/database/migrations/migrationsCollection.ts

```typescript
import type { CollectionConfig } from '../../collections/config/types.js'

export const migrationsCollection: CollectionConfig = {
  slug: 'payload-migrations',
  admin: {
    hidden: true,
  },
  endpoints: false,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'batch',
      type: 'number',
      // NOTE: This value is -1 if it is a "dev push"
    },
  ],
  graphQL: false,
  lockDocuments: false,
}
```

--------------------------------------------------------------------------------

---[FILE: migrationTemplate.ts]---
Location: payload-main/packages/payload/src/database/migrations/migrationTemplate.ts

```typescript
export const migrationTemplate = `
import {
  MigrateUpArgs,
  MigrateDownArgs,
} from "@payloadcms/db-mongodb";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // Migration code
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Migration code
};
`
```

--------------------------------------------------------------------------------

---[FILE: readMigrationFiles.ts]---
Location: payload-main/packages/payload/src/database/migrations/readMigrationFiles.ts

```typescript
import fs from 'fs'
import { pathToFileURL } from 'node:url'
import path from 'path'

import type { Payload } from '../../index.js'
import type { Migration } from '../types.js'

/**
 * Read the migration files from disk
 */
export const readMigrationFiles = async ({
  payload,
}: {
  payload: Payload
}): Promise<Migration[]> => {
  if (!fs.existsSync(payload.db.migrationDir)) {
    payload.logger.error({
      msg: `No migration directory found at ${payload.db.migrationDir}`,
    })
    return []
  }

  payload.logger.info({
    msg: `Reading migration files from ${payload.db.migrationDir}`,
  })

  const files = fs
    .readdirSync(payload.db.migrationDir)
    .sort()
    .filter((f) => {
      return (f.endsWith('.ts') || f.endsWith('.js')) && f !== 'index.js' && f !== 'index.ts'
    })
    .map((file) => {
      return path.resolve(payload.db.migrationDir, file)
    })

  return Promise.all(
    files.map(async (filePath) => {
      // eval used to circumvent errors bundling
      let migration =
        typeof require === 'function'
          ? await eval(`require('${filePath.replaceAll('\\', '/')}')`)
          : await eval(`import('${pathToFileURL(filePath).href}')`)
      if ('default' in migration) {
        migration = migration.default
      }

      const result: Migration = {
        name: path.basename(filePath).split('.')[0]!,
        down: migration.down,
        up: migration.up,
      }

      return result
    }),
  )
}
```

--------------------------------------------------------------------------------

---[FILE: writeMigrationIndex.ts]---
Location: payload-main/packages/payload/src/database/migrations/writeMigrationIndex.ts

```typescript
import fs from 'fs'
import { getTsconfig } from 'get-tsconfig'
import path from 'path'

// Function to get all migration files (TS or JS) excluding 'index'
const getMigrationFiles = (dir: string) => {
  return fs
    .readdirSync(dir)
    .filter(
      (file) =>
        (file.endsWith('.ts') || file.endsWith('.js')) &&
        file !== 'index.ts' &&
        file !== 'index.js',
    )
    .sort()
}

// Function to generate the index.ts content
const generateIndexContent = (files: string[]) => {
  const tsconfig = getTsconfig()
  const importExt = tsconfig?.config?.compilerOptions?.moduleResolution === 'NodeNext' ? '.js' : ''

  let imports = ''
  let exportsArray = 'export const migrations = [\n'

  files.forEach((file, index) => {
    const fileNameWithoutExt = file.replace(/\.[^/.]+$/, '')
    imports += `import * as migration_${fileNameWithoutExt} from './${fileNameWithoutExt}${importExt}';\n`
    exportsArray += `  {
    up: migration_${fileNameWithoutExt}.up,
    down: migration_${fileNameWithoutExt}.down,
    name: '${fileNameWithoutExt}'${index !== files.length - 1 ? ',' : ''}\n  },\n`
  })

  exportsArray += '];\n'
  return imports + '\n' + exportsArray
}

// Main function to create the index.ts file
export const writeMigrationIndex = (args: { migrationsDir: string }) => {
  const migrationFiles = getMigrationFiles(args.migrationsDir)
  const indexContent = generateIndexContent(migrationFiles)

  fs.writeFileSync(path.join(args.migrationsDir, 'index.ts'), indexContent)
}
```

--------------------------------------------------------------------------------

````
