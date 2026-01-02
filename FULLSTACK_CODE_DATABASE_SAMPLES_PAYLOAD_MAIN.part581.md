---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 581
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 581 of 695)

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

---[FILE: rest.ts]---
Location: payload-main/test/helpers/rest.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PaginatedDocs, TypedUser, Where } from 'payload'

import * as qs from 'qs-esm'

import { devUser } from '../credentials.js'

type Args = {
  defaultSlug: string
  serverURL: string
}

type LoginArgs = {
  collection: string
  email: string
  password: string
}

type LogoutArgs = {
  collection: string
}

type CreateArgs<T = any> = {
  auth?: boolean
  data: T
  file?: boolean
  slug?: string
}

type FindArgs = {
  auth?: boolean
  depth?: number
  limit?: number
  page?: number
  query?: Where
  slug?: string
  sort?: string
}

type FindByIDArgs = {
  auth?: boolean
  id: number | string
  options?: {
    depth?: number
    limit?: number
    page?: number
  }
  query?: Where
  slug?: string
}

type UpdateArgs<T = any> = {
  auth?: boolean
  data: Partial<T>
  id: string
  query?: any
  slug?: string
}

type UpdateManyArgs<T = any> = {
  auth?: boolean
  data: Partial<T>
  slug?: string
  where: any
}

type DeleteArgs = {
  auth?: boolean
  id: string
  slug?: string
}

type DeleteManyArgs = {
  auth?: boolean
  slug?: string
  where: any
}

type FindGlobalArgs<T = any> = {
  auth?: boolean
  slug?: string
}

type UpdateGlobalArgs<T = any> = {
  auth?: boolean
  data: Partial<T>
  slug?: string
}

type DocResponse<T> = {
  doc: T
  errors?: { data: any; message: string; name: string }[]
  status: number
}

type DocsResponse<T> = {
  docs: T[]
  errors?: { data: any; id: number | string; message: string; name: string }[]
  status: number
}

const headers = {
  Authorization: '',
  'Content-Type': 'application/json',
}

type QueryResponse<T> = {
  result: PaginatedDocs<T>
  status: number
}

export class RESTClient {
  private defaultSlug: string

  private token: string

  serverURL: string

  public user: TypedUser

  constructor(args: Args) {
    this.serverURL = args.serverURL
    this.defaultSlug = args.defaultSlug
  }

  async create<T = any>(args: CreateArgs): Promise<DocResponse<T>> {
    const options = {
      body: args.file ? args.data : JSON.stringify(args.data),
      headers: {
        ...(args.file ? [] : headers),
        Authorization: '',
      },
      method: 'POST',
    }

    if (args?.auth !== false && this.token) {
      options.headers.Authorization = `JWT ${this.token}`
    }

    const slug = args.slug || this.defaultSlug
    const response = await fetch(`${this.serverURL}/api/${slug}`, options)
    const { status } = response
    const { doc } = await response.json()
    return { doc, status }
  }

  async delete<T = any>(id: string, args?: DeleteArgs): Promise<DocResponse<T>> {
    const options = {
      headers: { ...headers },
      method: 'DELETE',
    }

    if (args?.auth !== false && this.token) {
      options.headers.Authorization = `JWT ${this.token}`
    }

    const slug = args?.slug || this.defaultSlug
    const response = await fetch(`${this.serverURL}/api/${slug}/${id}`, options)
    const { status } = response
    const doc = await response.json()
    return { doc, status }
  }

  async deleteMany<T = any>(args: DeleteManyArgs): Promise<DocsResponse<T>> {
    const { where } = args
    const options = {
      headers: { ...headers },
      method: 'DELETE',
    }

    if (args?.auth !== false && this.token) {
      options.headers.Authorization = `JWT ${this.token}`
    }

    const formattedQs = qs.stringify(
      {
        ...(where ? { where } : {}),
      },
      {
        addQueryPrefix: true,
      },
    )

    const slug = args?.slug || this.defaultSlug
    const response = await fetch(`${this.serverURL}/api/${slug}${formattedQs}`, options)
    const { status } = response
    const json = await response.json()
    return { docs: json.docs, errors: json.errors, status }
  }

  async endpoint<T = any>(
    path: string,
    method = 'GET',
    params: any = undefined,
  ): Promise<{ data: T; status: number }> {
    const options = {
      body: JSON.stringify(params),
      headers: { ...headers },
      method,
    }

    const response = await fetch(`${this.serverURL}${path}`, options)
    const { status } = response
    const data = await response.json()
    return { data, status }
  }

  async endpointWithAuth<T = any>(
    path: string,
    method = 'GET',
    params: any = undefined,
  ): Promise<{ data: T; status: number }> {
    const options = {
      body: JSON.stringify(params),
      headers: { ...headers },
      method,
    }

    if (this.token) {
      options.headers.Authorization = `JWT ${this.token}`
    }

    const response = await fetch(`${this.serverURL}${path}`, options)
    const { status } = response
    const data = await response.json()
    return { data, status }
  }

  async find<T = any>(args?: FindArgs): Promise<QueryResponse<T>> {
    const options = {
      headers: { ...headers },
    }

    if (args?.auth !== false && this.token) {
      options.headers.Authorization = `JWT ${this.token}`
    }

    const whereQuery = qs.stringify(
      {
        ...(args?.query ? { where: args.query } : {}),
        limit: args?.limit,
        page: args?.page,
        sort: args?.sort,
      },
      {
        addQueryPrefix: true,
      },
    )

    const slug = args?.slug || this.defaultSlug
    const response = await fetch(`${this.serverURL}/api/${slug}${whereQuery}`, options)
    const { status } = response
    const result = await response.json()
    if (result.errors) {
      throw new Error(result.errors[0].message)
    }
    return { result, status }
  }

  async findByID<T = any>(args: FindByIDArgs): Promise<DocResponse<T>> {
    const options = {
      headers: { ...headers },
    }

    if (args?.auth !== false && this.token) {
      options.headers.Authorization = `JWT ${this.token}`
    }

    const slug = args?.slug || this.defaultSlug
    const formattedOpts = qs.stringify(args?.options || {}, { addQueryPrefix: true })
    const response = await fetch(
      `${this.serverURL}/api/${slug}/${args.id}${formattedOpts}`,
      options,
    )
    const { status } = response
    const doc = await response.json()
    return { doc, status }
  }

  async findGlobal<T = any>(args?: FindGlobalArgs): Promise<DocResponse<T>> {
    const options = {
      headers: { ...headers },
    }

    if (args?.auth !== false && this.token) {
      options.headers.Authorization = `JWT ${this.token}`
    }

    const slug = args?.slug || this.defaultSlug
    const response = await fetch(`${this.serverURL}/api/globals/${slug}`, options)
    const { status } = response
    const doc = await response.json()
    return { doc, status }
  }

  async login(incomingArgs?: LoginArgs): Promise<string> {
    const args = incomingArgs ?? {
      collection: 'users',
      email: devUser.email,
      password: devUser.password,
    }

    const response = await fetch(`${this.serverURL}/api/${args.collection}/login`, {
      body: JSON.stringify({
        email: args.email,
        password: args.password,
      }),
      headers,
      method: 'POST',
    })

    const { user } = await response.json()

    let token = user.token

    // If the token is not in the response body, then we can extract it from the cookies
    if (!token) {
      const setCookie = response.headers.get('Set-Cookie')
      const tokenMatchResult = setCookie?.match(/payload-token=(?<token>.+?);/)
      token = tokenMatchResult?.groups?.token
    }

    this.user = user
    this.token = token

    return token
  }

  async logout(incomingArgs?: LogoutArgs): Promise<void> {
    const args = incomingArgs ?? {
      collection: 'users',
    }

    await fetch(`${this.serverURL}/api/${args.collection}/logout`, {
      headers,
      method: 'POST',
    })

    this.token = ''
  }

  async update<T = any>(args: UpdateArgs<T>): Promise<DocResponse<T>> {
    const { id, data, query } = args

    const options = {
      body: JSON.stringify(data),
      headers: { ...headers },
      method: 'PATCH',
    }

    if (args?.auth !== false && this.token) {
      options.headers.Authorization = `JWT ${this.token}`
    }

    const formattedQs = qs.stringify(query)
    const slug = args.slug || this.defaultSlug
    const response = await fetch(`${this.serverURL}/api/${slug}/${id}${formattedQs}`, options)
    const { status } = response
    const json = await response.json()
    return { doc: json.doc, errors: json.errors, status }
  }

  async updateGlobal<T = any>(args: UpdateGlobalArgs): Promise<DocResponse<T>> {
    const { data } = args
    const options = {
      body: JSON.stringify(data),
      headers: { ...headers },
      method: 'POST',
    }

    if (args?.auth !== false && this.token) {
      options.headers.Authorization = `JWT ${this.token}`
    }

    const slug = args?.slug || this.defaultSlug
    const response = await fetch(`${this.serverURL}/api/globals/${slug}`, options)
    const { status } = response
    const { result } = await response.json()
    return { doc: result, status }
  }

  async updateMany<T = any>(args: UpdateManyArgs<T>): Promise<DocsResponse<T>> {
    const { data, where } = args
    const options = {
      body: JSON.stringify(data),
      headers: { ...headers },
      method: 'PATCH',
    }

    if (args?.auth !== false && this.token) {
      options.headers.Authorization = `JWT ${this.token}`
    }

    const formattedQs = qs.stringify(
      {
        ...(where ? { where } : {}),
      },
      {
        addQueryPrefix: true,
      },
    )

    const slug = args?.slug || this.defaultSlug
    const response = await fetch(`${this.serverURL}/api/${slug}${formattedQs}`, options)
    const { status } = response
    const json = await response.json()
    return { docs: json.docs, errors: json.errors, status }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: seed.ts]---
Location: payload-main/test/helpers/seed.ts

```typescript
import fs from 'fs'
import * as os from 'node:os'
import path from 'path'
import { type Payload } from 'payload'

import { isErrorWithCode } from './isErrorWithCode.js'
import { resetDB } from './reset.js'
import { createSnapshot, dbSnapshot, restoreFromSnapshot, uploadsDirCache } from './snapshot.js'

type SeedFunction = (_payload: Payload) => Promise<void> | void

export async function seedDB({
  _payload,
  collectionSlugs,
  seedFunction,
  snapshotKey,
  uploadsDir,
  /**
   * Always seeds, instead of restoring from snapshot for consecutive test runs
   */
  alwaysSeed = false,
  deleteOnly,
}: {
  _payload: Payload
  alwaysSeed?: boolean
  collectionSlugs: string[]
  deleteOnly?: boolean
  seedFunction: SeedFunction
  /**
   * Key to uniquely identify the kind of snapshot. Each test suite should pass in a unique key
   */
  snapshotKey: string
  uploadsDir?: string | string[]
}) {
  /**
   * Reset database
   */
  try {
    await resetDB(_payload, collectionSlugs)
  } catch (error) {
    console.error('Error in operation (resetting database):', error)
  }
  /**
   * Delete uploads directory if it exists
   */
  if (uploadsDir) {
    const uploadsDirs = Array.isArray(uploadsDir) ? uploadsDir : [uploadsDir]
    for (const dir of uploadsDirs) {
      try {
        await fs.promises.access(dir)
        const files = await fs.promises.readdir(dir)
        for (const file of files) {
          const filePath = path.join(dir, file)
          await fs.promises.rm(filePath, { recursive: true, force: true })
        }
      } catch (error) {
        if (isErrorWithCode(error, 'ENOENT')) {
          // Directory does not exist - that's okay, skip it
          continue
        } else {
          // Some other error occurred - rethrow it
          console.error('Error in operation (deleting uploads dir):', dir, error)
          throw error
        }
      }
    }
  }

  /**
   * Mongoose & Postgres: Restore snapshot of old data if available
   *
   * Note for postgres: For postgres, this needs to happen AFTER the tables were created.
   * This does not work if I run payload.db.init or payload.db.connect anywhere. Thus, when resetting the database, we are not dropping the schema, but are instead only deleting the table values
   */
  let restored = false
  if (
    !alwaysSeed &&
    dbSnapshot[snapshotKey] &&
    Object.keys(dbSnapshot[snapshotKey]).length &&
    !deleteOnly
  ) {
    await restoreFromSnapshot(_payload, snapshotKey, collectionSlugs)

    /**
     * Restore uploads dir if it exists
     */
    if (uploadsDirCache[snapshotKey]) {
      for (const cache of uploadsDirCache[snapshotKey]) {
        if (cache.originalDir && fs.existsSync(cache.cacheDir)) {
          // move all files from inside uploadsDirCacheFolder to uploadsDir
          await fs.promises
            .readdir(cache.cacheDir, { withFileTypes: true })
            .then(async (files) => {
              for (const file of files) {
                if (file.isDirectory()) {
                  await fs.promises.mkdir(path.join(cache.originalDir, file.name), {
                    recursive: true,
                  })
                  await fs.promises.copyFile(
                    path.join(cache.cacheDir, file.name),
                    path.join(cache.originalDir, file.name),
                  )
                } else {
                  await fs.promises.copyFile(
                    path.join(cache.cacheDir, file.name),
                    path.join(cache.originalDir, file.name),
                  )
                }
              }
            })
            .catch((err) => {
              console.error('Error in operation (restoring uploads dir):', err)
              throw err
            })
        }
      }
    }

    restored = true
  }

  /**
   * If a snapshot was restored, we don't need to seed the database
   */
  if (restored || deleteOnly) {
    return
  }

  /**
   * Seed the database with data and save it to a snapshot
   **/
  if (typeof seedFunction === 'function') {
    await seedFunction(_payload)
  }

  if (!alwaysSeed) {
    await createSnapshot(_payload, snapshotKey, collectionSlugs)
  }

  /**
   * Cache uploads dir to a cache folder if uploadsDir exists
   */
  if (!alwaysSeed && uploadsDir) {
    const uploadsDirs = Array.isArray(uploadsDir) ? uploadsDir : [uploadsDir]
    for (const dir of uploadsDirs) {
      if (dir && fs.existsSync(dir)) {
        if (!uploadsDirCache[snapshotKey]) {
          uploadsDirCache[snapshotKey] = []
        }
        let newObj: {
          cacheDir: string
          originalDir: string
        } | null = null
        if (!uploadsDirCache[snapshotKey].find((cache) => cache.originalDir === dir)) {
          // Define new cache folder path to the OS temp directory (well a random folder inside it)
          newObj = {
            originalDir: dir,
            cacheDir: path.join(os.tmpdir(), `${snapshotKey}`, `payload-e2e-tests-uploads-cache`),
          }
        }
        if (!newObj) {
          continue
        }

        // delete the cache folder if it exists
        if (fs.existsSync(newObj.cacheDir)) {
          await fs.promises.rm(newObj.cacheDir, { recursive: true })
        }
        await fs.promises.mkdir(newObj.cacheDir, { recursive: true })
        // recursively move all files and directories from uploadsDir to uploadsDirCacheFolder

        try {
          const files = await fs.promises.readdir(newObj.originalDir, { withFileTypes: true })

          for (const file of files) {
            if (file.isDirectory()) {
              await fs.promises.mkdir(path.join(newObj.cacheDir, file.name), {
                recursive: true,
              })
              await fs.promises.copyFile(
                path.join(newObj.originalDir, file.name),
                path.join(newObj.cacheDir, file.name),
              )
            } else {
              await fs.promises.copyFile(
                path.join(newObj.originalDir, file.name),
                path.join(newObj.cacheDir, file.name),
              )
            }
          }

          uploadsDirCache[snapshotKey].push(newObj)
        } catch (e) {
          console.error('Error in operation (creating snapshot of uploads dir):', e)
          throw e
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: setTestEnvPaths.ts]---
Location: payload-main/test/helpers/setTestEnvPaths.ts

```typescript
// Set config path and TS output path using test dir
import fs from 'fs'
import path from 'path'

export function setTestEnvPaths(dir: string) {
  const configPath = path.resolve(dir, 'config.ts')
  const outputPath = path.resolve(dir, 'payload-types.ts')
  const schemaPath = path.resolve(dir, 'schema.graphql')
  if (fs.existsSync(configPath)) {
    process.env.PAYLOAD_CONFIG_PATH = configPath
    process.env.PAYLOAD_TS_OUTPUT_PATH = outputPath
    process.env.PAYLOAD_GRAPHQL_SCHEMA_PATH = schemaPath
    return true
  }
  return false
}
```

--------------------------------------------------------------------------------

---[FILE: snapshot.ts]---
Location: payload-main/test/helpers/snapshot.ts

```typescript
import type { PostgresAdapter } from '@payloadcms/db-postgres/types'
import type { SQLiteAdapter } from '@payloadcms/db-sqlite/types'
import type { PgTable } from 'drizzle-orm/pg-core'
import type { SQLiteTable } from 'drizzle-orm/sqlite-core'
import type { Payload } from 'payload'

import { sql } from 'drizzle-orm'

import { isMongoose } from './isMongoose.js'

export const uploadsDirCache: {
  [key: string]: {
    cacheDir: string
    originalDir: string
  }[]
} = {}
export const dbSnapshot = {}

async function createMongooseSnapshot(collectionsObj, snapshotKey: string) {
  const snapshot = {}

  // Assuming `collectionsObj` is an object where keys are names and values are collection references
  for (const collectionName of Object.keys(collectionsObj)) {
    const collection = collectionsObj[collectionName]
    const documents = await collection.find({}).toArray() // Get all documents
    snapshot[collectionName] = documents
  }

  dbSnapshot[snapshotKey] = snapshot // Save the snapshot in memory
}

async function restoreFromMongooseSnapshot(collectionsObj, snapshotKey: string) {
  if (!dbSnapshot[snapshotKey]) {
    throw new Error('No snapshot found to restore from.')
  }

  // Assuming `collectionsObj` is an object where keys are names and values are collection references
  for (const [name, documents] of Object.entries(dbSnapshot[snapshotKey])) {
    const collection = collectionsObj[name]
    // You would typically clear the collection here, but as per your requirement, you do it manually
    if ((documents as any[]).length > 0) {
      await collection.insertMany(documents)
    }
  }
}

async function createDrizzleSnapshot(db: PostgresAdapter | SQLiteAdapter, snapshotKey: string) {
  const snapshot = {}

  const schema: Record<string, PgTable | SQLiteTable> = db.drizzle._.schema
  if (!schema) {
    return
  }

  for (const tableName in schema) {
    const table = db.drizzle.query[tableName]['fullSchema'][tableName] //db.drizzle._.schema[tableName]
    const records = await db.drizzle.select().from(table).execute()
    snapshot[tableName] = records
  }

  dbSnapshot[snapshotKey] = snapshot
}

async function restoreFromDrizzleSnapshot(
  adapter: PostgresAdapter | SQLiteAdapter,
  snapshotKey: string,
) {
  if (!dbSnapshot[snapshotKey]) {
    throw new Error('No snapshot found to restore from.')
  }
  const db = adapter.name === 'postgres' ? (adapter as PostgresAdapter) : (adapter as SQLiteAdapter)
  let disableFKConstraintChecksQuery
  let enableFKConstraintChecksQuery

  if (db.name === 'sqlite') {
    disableFKConstraintChecksQuery = 'PRAGMA foreign_keys = off'
    enableFKConstraintChecksQuery = 'PRAGMA foreign_keys = on'
  }
  if (db.name === 'postgres') {
    disableFKConstraintChecksQuery = 'SET session_replication_role = replica;'
    enableFKConstraintChecksQuery = 'SET session_replication_role = DEFAULT;'
  }

  // Temporarily disable foreign key constraint checks
  try {
    await db.execute({
      drizzle: db.drizzle,
      raw: disableFKConstraintChecksQuery,
    })
    for (const tableName in dbSnapshot[snapshotKey]) {
      const table = db.drizzle.query[tableName]['fullSchema'][tableName]
      await db.execute({
        drizzle: db.drizzle,
        sql: sql`DELETE FROM ${table}`,
      }) // This deletes all records from the table. Probably not necessary, as I'm deleting the table before restoring anyways

      const records = dbSnapshot[snapshotKey][tableName]
      if (records.length > 0) {
        await db.drizzle.insert(table).values(records).execute()
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    // Re-enable foreign key constraint checks
    await db.execute({
      drizzle: db.drizzle,
      raw: enableFKConstraintChecksQuery,
    })
  }
}

export async function createSnapshot(
  _payload: Payload,
  snapshotKey: string,
  collectionSlugs: string[],
) {
  if (isMongoose(_payload) && 'collections' in _payload.db) {
    const firstCollectionSlug = collectionSlugs?.[0]

    if (!firstCollectionSlug?.length) {
      throw new Error('No collection slugs provided to reset the database.')
    }

    const mongooseCollections = _payload.db.collections[firstCollectionSlug]?.db.collections

    await createMongooseSnapshot(mongooseCollections, snapshotKey)
  } else {
    const db: PostgresAdapter = _payload.db as unknown as PostgresAdapter
    await createDrizzleSnapshot(db, snapshotKey)
  }
}

/**
 * Make sure to delete the db before calling this function
 * @param _payload
 */
export async function restoreFromSnapshot(
  _payload: Payload,
  snapshotKey: string,
  collectionSlugs: string[],
) {
  if (isMongoose(_payload) && 'collections' in _payload.db) {
    const mongooseCollections = _payload.db.collections[collectionSlugs[0]].db.collections
    await restoreFromMongooseSnapshot(mongooseCollections, snapshotKey)
  } else {
    const db: PostgresAdapter = _payload.db as unknown as PostgresAdapter
    await restoreFromDrizzleSnapshot(db, snapshotKey)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: startMemoryDB.ts]---
Location: payload-main/test/helpers/startMemoryDB.ts

```typescript
import { D1DatabaseAPI } from '@miniflare/d1'
import { createSQLiteDB } from '@miniflare/shared'
import dotenv from 'dotenv'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

dotenv.config()

declare global {
  // Add the custom property to the NodeJS global type
  // eslint-disable-next-line no-var
  var _mongoMemoryServer: MongoMemoryReplSet | undefined
}

/**
 * WARNING: This file MUST export a default function.
 * @link https://jestjs.io/docs/configuration#globalsetup-string
 */
// eslint-disable-next-line no-restricted-exports
export default async () => {
  if (process.env.DATABASE_URI) {
    return
  }
  process.env.NODE_ENV = 'test'
  process.env.PAYLOAD_DROP_DATABASE = 'true'
  process.env.NODE_OPTIONS = '--no-deprecation'
  process.env.DISABLE_PAYLOAD_HMR = 'true'

  if (process.env.PAYLOAD_DATABASE === 'd1' && !global.d1) {
    process.env.PAYLOAD_DROP_DATABASE = 'false'
    console.log('Starting memory D1 db...')
    global.d1 = new D1DatabaseAPI(await createSQLiteDB(':memory'))
  }
  if (
    (!process.env.PAYLOAD_DATABASE ||
      ['cosmosdb', 'documentdb', 'firestore', 'mongodb'].includes(process.env.PAYLOAD_DATABASE)) &&
    !global._mongoMemoryServer
  ) {
    console.log('Starting memory db...')
    const db = await MongoMemoryReplSet.create({
      replSet: {
        count: 3,
        dbName: 'payloadmemory',
      },
    })

    await db.waitUntilRunning()

    global._mongoMemoryServer = db

    process.env.MONGODB_MEMORY_SERVER_URI = `${global._mongoMemoryServer.getUri()}&retryWrites=true`
    console.log('Started memory db')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: stopMemoryDB.ts]---
Location: payload-main/test/helpers/stopMemoryDB.ts

```typescript
/* eslint-disable no-restricted-exports */
import { spawn } from 'child_process'

/**
 * WARNING: This file MUST export a default function.
 * @link https://jestjs.io/docs/configuration#globalteardown-string
 */
export default function globalTeardown() {
  try {
    if (global._mongoMemoryServer) {
      const stopScript = `
        (async () => {
          await new Promise(resolve => setTimeout(resolve, 300));
          try {
            if (global._mongoMemoryServer) {
              await global._mongoMemoryServer.stop();
              console.log('Stopped memorydb');
            }
          } catch (error) {
            console.error('Error stopping memorydb:', error);
          }
        })();
      `

      const child = spawn(process.execPath, ['-e', stopScript], {
        detached: true,
        stdio: 'ignore',
      })

      child.unref()
      console.log('Spawned detached process to stop memorydb')
    }
  } catch (error) {
    console.error('Error in globalTeardown:', error)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/helpers/autoDedupeBlocksPlugin/index.ts

```typescript
import { dequal } from 'dequal/lite'
import { type Block, type BlockSlug, type Config, traverseFields } from 'payload'

export const autoDedupeBlocksPlugin =
  (args?: { debug?: boolean; disabled?: boolean; silent?: boolean }) =>
  (config: Config): Config => {
    if (!args) {
      args = {}
    }
    const { disabled = false, debug = false, silent = false } = args

    if (disabled) {
      return config
    }

    traverseFields({
      config,
      leavesFirst: true,
      parentIsLocalized: false,
      isTopLevel: true,
      fields: [
        ...(config.collections?.length
          ? config.collections.map((collection) => collection.fields).flat()
          : []),
        ...(config.globals?.length ? config.globals.map((global) => global.fields).flat() : []),
      ],
      callback: ({ field }) => {
        if (field.type === 'blocks') {
          if (field?.blocks?.length) {
            field.blockReferences = new Array(field.blocks.length)
            for (let i = 0; i < field.blocks.length; i++) {
              const block = field.blocks[i]
              if (!block) {
                continue
              }
              deduplicateBlock({ block, config, silent })
              field.blockReferences[i] = block.slug as BlockSlug
            }
            field.blocks = []
          }

          if (debug && !silent) {
            console.log('migrated field', field)
          }
        }
      },
    })
    return config
  }

export const deduplicateBlock = ({
  block: dedupedBlock,
  config,
  silent,
}: {
  block: Block
  config: Config
  silent?: boolean
}) => {
  /**
   * Will be true if a block with the same slug is found.
   */
  let alreadyDeduplicated = false

  if (config?.blocks?.length) {
    for (const existingBlock of config.blocks) {
      if (existingBlock.slug === dedupedBlock.slug) {
        alreadyDeduplicated = true

        // Check if the fields are the same
        const jsonExistingBlock = JSON.stringify(existingBlock, null, 2)
        const jsonBlockToDeduplicate = JSON.stringify(dedupedBlock, null, 2)
        // dequal check of blocks with functions removed (through JSON.stringify+JSON.parse). We cannot check the strings,
        // as the order of keys in the object is not guaranteed, yet it doesn't matter for the block fields.
        if (!dequal(JSON.parse(jsonExistingBlock), JSON.parse(jsonBlockToDeduplicate))) {
          console.error('Block with the same slug but different fields found', {
            slug: dedupedBlock.slug,
            existingBlock: jsonExistingBlock,
            dedupedBlock: jsonBlockToDeduplicate,
          })
          throw new Error('Block with the same slug but different fields found')
        }
        if (
          // Object reference check for just the block fields - it's more likely that top-level block keys have been spread
          !Object.is(existingBlock.fields, dedupedBlock.fields) &&
          !silent
        ) {
          // only throw warning:
          console.warn(
            'Block with the same slug but different fields found. JSON is different, but object references are equal. Please manually verify that things like functions passed to the blocks behave the same way.',
            {
              slug: dedupedBlock.slug,
              existingBlock: JSON.stringify(existingBlock, null, 2),
              dedupedBlock: JSON.stringify(dedupedBlock, null, 2),
            },
          )
        }
        break
      }
    }
  }
  if (!alreadyDeduplicated) {
    if (!config.blocks) {
      config.blocks = []
    }
    config.blocks.push(dedupedBlock)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: assertElementStaysVisible.ts]---
Location: payload-main/test/helpers/e2e/assertElementStaysVisible.ts

```typescript
import type { Page } from 'playwright'

export async function assertElementStaysVisible(
  page: Page,
  selector: string,
  durationMs: number = 3000,
  pollIntervalMs: number = 250,
): Promise<void> {
  const start = Date.now()

  // Ensure it appears at least once first
  await page.waitForSelector(selector, { state: 'visible' })

  // Start polling to confirm it stays visible
  while (Date.now() - start < durationMs) {
    const isVisible = await page.isVisible(selector)

    if (!isVisible) {
      throw new Error(`Element "${selector}" disappeared during the visibility duration.`)
    }

    await new Promise((res) => setTimeout(res, pollIntervalMs))
  }

  console.log(`Element "${selector}" remained visible for ${durationMs}ms.`)
}
```

--------------------------------------------------------------------------------

---[FILE: assertNetworkRequests.ts]---
Location: payload-main/test/helpers/e2e/assertNetworkRequests.ts

```typescript
import type { Page, Request } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * Counts the number of network requests every `interval` milliseconds until `timeout` is reached.
 * Useful to ensure unexpected network requests are not triggered by an action.
 * For example, an effect within a component might fetch data multiple times unnecessarily.
 * @param page The Playwright page
 * @param url The URL to match in the network requests
 * @param action The action to perform
 * @param options Options
 * @param options.allowedNumberOfRequests The number of requests that are allowed to be made, defaults to 1
 * @param options.beforePoll A function to run before polling the network requests
 * @param options.interval The interval in milliseconds to poll the network requests, defaults to 1000
 * @param options.timeout The timeout in milliseconds to poll the network requests, defaults to 5000
 * @returns The matched network requests
 */
export const assertNetworkRequests = async (
  page: Page,
  /**
   * The URL to match in the network requests. The request URL will need to *include* this URL.
   */
  url: string,
  action: () => Promise<any>,
  {
    beforePoll,
    allowedNumberOfRequests = 1,
    timeout = 5000,
    minimumNumberOfRequests,
    interval = 1000,
    requestFilter,
  }: {
    allowedNumberOfRequests?: number
    beforePoll?: () => Promise<any> | void
    interval?: number
    /**
     * If set, allows tests to pass if **less** than the allowed number of requests are made,
     * as long as at least this number of requests are made.
     */
    minimumNumberOfRequests?: number
    /**
     * If set, only consider requests that match the filter AND the URL.
     */
    requestFilter?: (request: Request) => boolean | Promise<boolean>
    timeout?: number
  } = {},
): Promise<Array<Request>> => {
  const matchedRequests: Request[] = []

  // begin tracking network requests
  page.on('request', async (request) => {
    if (request.url().includes(url) && (requestFilter ? await requestFilter(request) : true)) {
      matchedRequests.push(request)
    }
  })

  await action()

  if (typeof beforePoll === 'function') {
    await beforePoll()
  }

  const startTime = Date.now()

  // continuously poll even after a request has been matched
  // this will ensure no subsequent requests are made
  // such as a result of a `useEffect` within a component
  while (Date.now() - startTime < timeout) {
    if (matchedRequests.length > 0) {
      expect(matchedRequests.length).toBeLessThanOrEqual(allowedNumberOfRequests)
    }

    await new Promise((resolve) => setTimeout(resolve, interval))
  }

  if (!minimumNumberOfRequests) {
    expect(matchedRequests.length).toBe(allowedNumberOfRequests)
  } else {
    expect(matchedRequests.length).toBeLessThanOrEqual(allowedNumberOfRequests)
    expect(matchedRequests.length).toBeGreaterThanOrEqual(minimumNumberOfRequests)
  }

  return matchedRequests
}
```

--------------------------------------------------------------------------------

---[FILE: assertRequestBody.ts]---
Location: payload-main/test/helpers/e2e/assertRequestBody.ts

```typescript
import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * A helper function to assert the body of a network request.
 * This is useful for reading the body of a request and testing whether it is correct.
 * For example, if you have a form that submits data to an API, you can use this function to
 * assert that the data being sent is correct.
 * @param page The Playwright page
 * @param options Options
 * @param options.action The action to perform that will trigger the request
 * @param options.expect A function to run after the request is made to assert the request body
 * @returns The request body
 * @example
 * const requestBody = await assertRequestBody(page, {
 *   action: page.click('button'),
 *   expect: (requestBody) => expect(requestBody.foo).toBe('bar')
 * })
 */
export const assertRequestBody = async <T>(
  page: Page,
  options: {
    action: () => Promise<void> | void
    expect?: (
      requestBody: T,
      requestHeaders: {
        [key: string]: string
      },
    ) => boolean | Promise<boolean>
    requestMethod?: string
    url: string
  },
): Promise<T | undefined> => {
  const [request] = await Promise.all([
    page.waitForRequest((request) =>
      Boolean(
        request.url().startsWith(options.url) &&
          (request.method() === options.requestMethod || 'POST'),
      ),
    ),
    await options.action(),
  ])

  const requestBody = request.postData()

  if (typeof requestBody === 'string') {
    const parsedBody = JSON.parse(requestBody) as T

    if (typeof options.expect === 'function') {
      expect(await options.expect(parsedBody, request.headers())).toBeTruthy()
    }

    return parsedBody
  }
}
```

--------------------------------------------------------------------------------

---[FILE: assertResponseBody.ts]---
Location: payload-main/test/helpers/e2e/assertResponseBody.ts

```typescript
import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'

function parseRSC(rscText: string) {
  // Next.js streams use special delimiters like "\n"
  const chunks = rscText.split('\n').filter((line) => line.trim() !== '')

  // find the chunk starting with '1:', remove the '1:' prefix and parse the rest
  const match = chunks.find((chunk) => chunk.startsWith('1:'))

  if (match) {
    const jsonString = match.slice(2).trim()
    if (jsonString) {
      try {
        return JSON.parse(jsonString)
      } catch (err) {
        console.error('Failed to parse JSON:', err)
      }
    }
  }

  return null
}

/**
 * A helper function to assert the response of a network request.
 * This is useful for reading the response of a request and testing whether it is correct.
 * For example, if you have a form that submits data to an API, you can use this function to
 * assert that the data sent back is correct.
 * @param page The Playwright page
 * @param options Options
 * @param options.action The action to perform that will trigger the request
 * @param options.expect A function to run after the request is made to assert the response body
 * @param options.url The URL to match in the network requests
 * @returns The request body
 * @example
 * const responseBody = await assertResponseBody(page, {
 *   action: page.click('button'),
 *   expect: (responseBody) => expect(responseBody.foo).toBe('bar')
 * })
 */
export const assertResponseBody = async <T>(
  page: Page,
  options: {
    action: Promise<void> | void
    expect?: (requestBody: T) => boolean | Promise<boolean>
    requestMethod?: string
    responseContentType?: string
    url?: string
  },
): Promise<T | undefined> => {
  const [response] = await Promise.all([
    page.waitForResponse((response) =>
      Boolean(
        response.url().includes(options.url || '') &&
          response.status() === 200 &&
          response
            .headers()
            ['content-type']?.includes(options.responseContentType || 'application/json'),
      ),
    ),
    await options.action,
  ])

  if (!response) {
    throw new Error('No response received')
  }

  const responseBody = await response.text()
  const responseType = response.headers()['content-type']?.split(';')[0]

  let parsedBody: T = undefined as T

  if (responseType === 'text/x-component') {
    parsedBody = parseRSC(responseBody)
  } else if (typeof responseBody === 'string') {
    parsedBody = JSON.parse(responseBody) as T
  }

  if (typeof options.expect === 'function') {
    expect(await options.expect(parsedBody)).toBeTruthy()
  }

  return parsedBody
}
```

--------------------------------------------------------------------------------

````
