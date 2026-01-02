---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 545
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 545 of 695)

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

---[FILE: postgres-logs.int.spec.ts]---
Location: payload-main/test/database/postgres-logs.int.spec.ts

```typescript
import type { Payload } from 'payload'

/* eslint-disable jest/require-top-level-describe */
import assert from 'assert'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

import type { Post } from './payload-types.js'

import { initPayloadInt } from '../helpers/initPayloadInt.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const describePostgres = process.env.PAYLOAD_DATABASE?.startsWith('postgres')
  ? describe
  : describe.skip

let payload: Payload

describePostgres('database - postgres logs', () => {
  beforeAll(async () => {
    const initialized = await initPayloadInt(
      dirname,
      undefined,
      undefined,
      'config.postgreslogs.ts',
    )
    assert(initialized.payload)
    assert(initialized.restClient)
    ;({ payload } = initialized)
  })

  afterAll(async () => {
    await payload.destroy()
  })

  it('ensure simple update uses optimized upsertRow with returning()', async () => {
    const doc = await payload.create({
      collection: 'simple',
      data: {
        text: 'Some title',
        number: 5,
      },
    })

    // Count every console log
    const consoleCount = jest.spyOn(console, 'log').mockImplementation(() => {})

    const result: any = await payload.db.updateOne({
      collection: 'simple',
      id: doc.id,
      data: {
        text: 'Updated Title',
        number: 5,
      },
    })

    expect(result.text).toEqual('Updated Title')
    expect(result.number).toEqual(5) // Ensure the update did not reset the number field

    expect(consoleCount).toHaveBeenCalledTimes(1) // Should be 1 single sql call if the optimization is used. If not, this would be 2 calls
    consoleCount.mockRestore()
  })

  it('ensure simple update of complex collection uses optimized upsertRow without returning()', async () => {
    const doc = await payload.create({
      collection: 'posts',
      data: {
        title: 'Some title',
        number: 5,
      },
    })

    // Count every console log
    const consoleCount = jest.spyOn(console, 'log').mockImplementation(() => {})

    const result: any = await payload.db.updateOne({
      collection: 'posts',
      id: doc.id,
      data: {
        title: 'Updated Title',
        number: 5,
      },
    })

    expect(result.title).toEqual('Updated Title')
    expect(result.number).toEqual(5) // Ensure the update did not reset the number field

    expect(consoleCount).toHaveBeenCalledTimes(2) // Should be 2 sql call if the optimization is used (update + find). If not, this would be 5 calls
    consoleCount.mockRestore()
  })

  it('ensure deleteMany is done in single db query - no where query', async () => {
    await payload.create({
      collection: 'posts',
      data: {
        title: 'Some title',
        number: 5,
      },
    })
    await payload.create({
      collection: 'posts',
      data: {
        title: 'Some title 2',
        number: 5,
      },
    })
    await payload.create({
      collection: 'posts',
      data: {
        title: 'Some title 2',
        number: 5,
      },
    })
    // Count every console log
    const consoleCount = jest.spyOn(console, 'log').mockImplementation(() => {})

    await payload.db.deleteMany({
      collection: 'posts',
      where: {},
    })

    expect(consoleCount).toHaveBeenCalledTimes(1)
    consoleCount.mockRestore()

    const allPosts = await payload.find({
      collection: 'posts',
    })

    expect(allPosts.docs).toHaveLength(0)
  })

  it('ensure deleteMany is done in single db query while respecting where query', async () => {
    const doc1 = await payload.create({
      collection: 'posts',
      data: {
        title: 'Some title',
        number: 5,
      },
    })
    await payload.create({
      collection: 'posts',
      data: {
        title: 'Some title 2',
        number: 5,
      },
    })
    await payload.create({
      collection: 'posts',
      data: {
        title: 'Some title 2',
        number: 5,
      },
    })
    // Count every console log
    const consoleCount = jest.spyOn(console, 'log').mockImplementation(() => {})

    await payload.db.deleteMany({
      collection: 'posts',
      where: {
        title: { equals: 'Some title 2' },
      },
    })

    expect(consoleCount).toHaveBeenCalledTimes(1)
    consoleCount.mockRestore()

    const allPosts = await payload.find({
      collection: 'posts',
    })

    expect(allPosts.docs).toHaveLength(1)
    expect(allPosts.docs[0]?.id).toEqual(doc1.id)
  })

  it('ensure array update using $push is done in single db call', async () => {
    const post = await payload.create({
      collection: 'posts',
      data: {
        arrayWithIDs: [
          {
            text: 'some text',
          },
        ],
        title: 'post',
      },
    })
    const consoleCount = jest.spyOn(console, 'log').mockImplementation(() => {})

    await payload.db.updateOne({
      data: {
        // Ensure db adapter does not automatically set updatedAt - one less db call
        updatedAt: null,
        arrayWithIDs: {
          $push: {
            text: 'some text 2',
            id: new mongoose.Types.ObjectId().toHexString(),
          },
        },
      },
      collection: 'posts',
      id: post.id,
      returning: false,
    })

    // 1 Update:
    // 1. (updatedAt for posts row.) - skipped because we explicitly set updatedAt to null
    // 2. arrayWithIDs.$push for posts row
    expect(consoleCount).toHaveBeenCalledTimes(1)
    consoleCount.mockRestore()

    const updatedPost = (await payload.db.findOne({
      collection: 'posts',
      where: { id: { equals: post.id } },
    })) as unknown as Post

    expect(updatedPost.title).toBe('post')
    expect(updatedPost.arrayWithIDs).toHaveLength(2)
    expect(updatedPost.arrayWithIDs?.[0]?.text).toBe('some text')
    expect(updatedPost.arrayWithIDs?.[1]?.text).toBe('some text 2')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: postgres-vector.int.spec.ts]---
Location: payload-main/test/database/postgres-vector.int.spec.ts

```typescript
/* eslint-disable jest/no-conditional-in-test */
/* eslint-disable jest/expect-expect */
/* eslint-disable jest/require-top-level-describe */
import type { PostgresAdapter } from '@payloadcms/db-postgres'
import type { PostgresDB } from '@payloadcms/drizzle'

import { cosineDistance, desc, gt, jaccardDistance, l2Distance, lt, sql } from 'drizzle-orm'
import path from 'path'
import { BasePayload, buildConfig, type DatabaseAdapterObj } from 'payload'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const describePostgres = process.env.PAYLOAD_DATABASE?.startsWith('postgres')
  ? describe
  : describe.skip

describePostgres('postgres vector custom column', () => {
  const vectorColumnQueryTest = async (vectorType: string) => {
    const {
      databaseAdapter,
    }: {
      databaseAdapter: DatabaseAdapterObj<PostgresAdapter>
    } = await import(path.resolve(dirname, '../databaseAdapter.js'))

    const init = databaseAdapter.init

    // set options
    databaseAdapter.init = ({ payload }) => {
      const adapter = init({ payload })

      adapter.extensions = {
        vector: true,
      }
      adapter.beforeSchemaInit = [
        ({ schema, adapter }) => {
          if (adapter?.rawTables?.posts?.columns) {
            adapter.rawTables.posts.columns.embedding = {
              type: vectorType,
              dimensions: 5,
              name: 'embedding',
            }
          }
          return schema
        },
      ]
      return adapter
    }

    const config = await buildConfig({
      db: databaseAdapter,
      secret: 'secret',
      collections: [
        {
          slug: 'users',
          auth: true,
          fields: [],
        },
        {
          slug: 'posts',
          fields: [
            {
              type: 'json',
              name: 'embedding',
            },
            {
              name: 'title',
              type: 'text',
            },
          ],
        },
      ],
    })

    // do not use getPayload to avoid caching and re-using payload instance from previous tests
    const payload = await new BasePayload().init({ config })

    const catEmbedding = [1.5, -0.4, 7.2, 19.6, 20.2]

    await payload.create({
      collection: 'posts',
      data: {
        embedding: [-5.2, 3.1, 0.2, 8.1, 3.5],
        title: 'apple',
      },
    })

    await payload.create({
      collection: 'posts',
      data: {
        embedding: catEmbedding,
        title: 'cat',
      },
    })

    await payload.create({
      collection: 'posts',
      data: {
        embedding: [-5.1, 2.9, 0.8, 7.9, 3.1],
        title: 'fruit',
      },
    })

    await payload.create({
      collection: 'posts',
      data: {
        embedding: [1.7, -0.3, 6.9, 19.1, 21.1],
        title: 'dog',
      },
    })

    const similarity = sql<number>`1 - (${cosineDistance(payload.db.tables.posts.embedding, catEmbedding)})`

    const db = payload.db.drizzle as PostgresDB

    const res = await db
      .select()
      .from(payload.db.tables.posts)
      .where(gt(similarity, 0.9))
      .orderBy(desc(similarity))

    // Only cat and dog
    expect(res).toHaveLength(2)

    // similarity sort
    expect(res?.[0]?.title).toBe('cat')
    expect(res?.[1]?.title).toBe('dog')
  }

  it('should add a vector column and query it', async () => {
    await vectorColumnQueryTest('vector')
  })

  it('should add a halfvec column and query it', async () => {
    await vectorColumnQueryTest('halfvec')
  })

  it('should add a sparsevec column and query it', async () => {
    const {
      databaseAdapter,
    }: {
      databaseAdapter: DatabaseAdapterObj<PostgresAdapter>
    } = await import(path.resolve(dirname, '../databaseAdapter.js'))

    const init = databaseAdapter.init

    databaseAdapter.init = ({ payload }) => {
      const adapter = init({ payload })

      adapter.extensions = {
        vector: true,
      }

      adapter.beforeSchemaInit = [
        ({ schema, adapter }) => {
          if (adapter?.rawTables?.posts?.columns) {
            adapter.rawTables.posts.columns.embedding = {
              type: 'sparsevec',
              dimensions: 5,
              name: 'embedding',
            }
          }
          return schema
        },
      ]

      return adapter
    }

    const config = await buildConfig({
      db: databaseAdapter,
      secret: 'secret',
      collections: [
        {
          slug: 'users',
          auth: true,
          fields: [],
        },
        {
          slug: 'posts',
          fields: [
            {
              name: 'embedding',
              type: 'text',
            },
            {
              name: 'title',
              type: 'text',
            },
          ],
        },
      ],
    })

    const payload = await new BasePayload().init({ config })

    // sparse-vector format: '{index:value,...}/dims'
    const catEmbedding = '{1:1,3:2,5:3}/5'

    await payload.create({
      collection: 'posts',
      data: {
        embedding: '{2:1,4:2}/5',
        title: 'apple',
      },
    })

    await payload.create({
      collection: 'posts',
      data: {
        embedding: catEmbedding,
        title: 'cat',
      },
    })

    await payload.create({
      collection: 'posts',
      data: {
        embedding: '{2:4,4:6}/5',
        title: 'fruit',
      },
    })

    await payload.create({
      collection: 'posts',
      data: {
        embedding: '{1:1,3:2,5:2}/5',
        title: 'dog',
      },
    })

    const distance = sql<number>`(${l2Distance(payload.db.tables.posts.embedding, catEmbedding)})`

    const db = payload.db.drizzle as PostgresDB

    const res = await db
      .select()
      .from(payload.db.tables.posts)
      .where(lt(distance, 1.1))
      .orderBy(distance)
      .execute()

    // should return cat (distance 0) then dog
    expect(res).toHaveLength(2)
    expect(res?.[0]?.title).toBe('cat')
    expect(res?.[1]?.title).toBe('dog')
  })

  it('should add a binaryvec column and query it', async () => {
    const {
      databaseAdapter,
    }: {
      databaseAdapter: DatabaseAdapterObj<PostgresAdapter>
    } = await import(path.resolve(dirname, '../databaseAdapter.js'))

    const init = databaseAdapter.init

    // set options
    databaseAdapter.init = ({ payload }) => {
      const adapter = init({ payload })

      adapter.extensions = {
        vector: true,
      }
      adapter.beforeSchemaInit = [
        ({ schema, adapter }) => {
          if (adapter?.rawTables?.posts?.columns) {
            adapter.rawTables.posts.columns.embedding = {
              type: 'bit',
              dimensions: 5,
              name: 'embedding',
            }
          }
          return schema
        },
      ]
      return adapter
    }

    const config = await buildConfig({
      db: databaseAdapter,
      secret: 'secret',
      collections: [
        {
          slug: 'users',
          auth: true,
          fields: [],
        },
        {
          slug: 'posts',
          fields: [
            {
              type: 'text',
              name: 'embedding',
            },
            {
              name: 'title',
              type: 'text',
            },
          ],
        },
      ],
    })

    // do not use getPayload to avoid caching and re-using payload instance from previous tests
    const payload = await new BasePayload().init({ config })

    const catEmbedding = '10101'

    await payload.create({
      collection: 'posts',
      data: {
        embedding: '01010',
        title: 'apple',
      },
    })

    await payload.create({
      collection: 'posts',
      data: {
        embedding: '10101',
        title: 'cat',
      },
    })

    await payload.create({
      collection: 'posts',
      data: {
        embedding: '11111',
        title: 'fruit',
      },
    })

    await payload.create({
      collection: 'posts',
      data: {
        embedding: '10100',
        title: 'dog',
      },
    })

    const similarity = sql<number>`1 - (${jaccardDistance(payload.db.tables.posts.embedding, catEmbedding)})`

    const db = payload.db.drizzle as PostgresDB

    const res = await db
      .select()
      .from(payload.db.tables.posts)
      .where(gt(similarity, 0.6))
      .orderBy(desc(similarity))

    // Only cat and dog
    expect(res).toHaveLength(2)

    // similarity sort
    expect(res?.[0]?.title).toBe('cat')
    expect(res?.[1]?.title).toBe('dog')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: seed.ts]---
Location: payload-main/test/database/seed.ts

```typescript
import type { Payload } from 'payload'

import { devUser } from '../credentials.js'

export const _seed = async (_payload: Payload) => {
  await _payload.create({
    collection: 'users',
    data: {
      email: devUser.email,
      password: devUser.password,
    },
  })
}

export async function seed(_payload: Payload) {
  return await _seed(_payload)
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/database/shared.ts

```typescript
export const postsSlug = 'posts'
export const errorOnUnnamedFieldsSlug = 'error-on-unnamed-fields'

export const defaultValuesSlug = 'default-values'

export const relationASlug = 'relation-a'

export const relationBSlug = 'relation-b'

export const pgMigrationSlug = 'pg-migrations'

export const customSchemaSlug = 'custom-schema'

export const placesSlug = 'places'

export const fieldsPersistanceSlug = 'fields-persistance'

export const customIDsSlug = 'custom-ids'

export const fakeCustomIDsSlug = 'fake-custom-ids'

export const relationshipsMigrationSlug = 'relationships-migration'
```

--------------------------------------------------------------------------------

---[FILE: sqlite-bound-parameters-limit.int.spec.ts]---
Location: payload-main/test/database/sqlite-bound-parameters-limit.int.spec.ts

```typescript
import type { Payload } from 'payload'

/* eslint-disable jest/require-top-level-describe */
import path from 'path'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const describeSqlite = process.env.PAYLOAD_DATABASE?.startsWith('sqlite') ? describe : describe.skip

let payload: Payload

describeSqlite('database - sqlite bound parameters limit', () => {
  beforeAll(async () => {
    ;({ payload } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    await payload.destroy()
  })

  it('should not use bound parameters for where querying on ID with IN if limitedBoundParameters: true', async () => {
    const defaultExecute = payload.db.drizzle.$client.execute.bind(payload.db.drizzle.$client)

    // Limit bounds parameters length
    payload.db.drizzle.$client.execute = async function execute(...args) {
      const res = await defaultExecute(...args)
      const [{ args: boundParameters }] = args as [{ args: any[] }]

      // eslint-disable-next-line jest/no-conditional-in-test
      if (boundParameters.length > 100) {
        throw new Error('Exceeded limit of bound parameters!')
      }
      return res
    }

    payload.db.limitedBoundParameters = false

    const IN = Array.from({ length: 300 }, (_, i) => i)

    // Should fail here because too the length exceeds the limit
    await expect(
      payload.find({
        collection: 'simple',
        pagination: false,
        where: { id: { in: IN } },
      }),
    ).rejects.toBeTruthy()

    // Should fail here because too the length exceeds the limit
    await expect(
      payload.find({
        collection: 'simple',
        pagination: false,
        where: { id: { not_in: IN } },
      }),
    ).rejects.toBeTruthy()

    payload.db.limitedBoundParameters = true

    // Should not fail because limitedBoundParameters: true
    await expect(
      payload.find({
        collection: 'simple',
        pagination: false,
        where: { id: { in: IN } },
      }),
    ).resolves.toBeTruthy()

    // Should not fail because limitedBoundParameters: true
    await expect(
      payload.find({
        collection: 'simple',
        pagination: false,
        where: { id: { not_in: IN } },
      }),
    ).resolves.toBeTruthy()

    // Verify that "in" still works properly

    const docs = await Promise.all(
      Array.from({ length: 300 }, () => payload.create({ collection: 'simple', data: {} })),
    )

    const res = await payload.find({
      collection: 'simple',
      pagination: false,
      where: { id: { in: docs.map((e) => e.id) } },
    })

    expect(res.totalDocs).toBe(300)
    for (const docInRes of res.docs) {
      expect(docs.some((doc) => doc.id === docInRes.id)).toBeTruthy()
    }
  })
})
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/database/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/database/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: docker-compose.yaml]---
Location: payload-main/test/database/pg-replica/docker-compose.yaml
Signals: Docker

```yaml
# Copyright Broadcom, Inc. All Rights Reserved.
# SPDX-License-Identifier: APACHE-2.0

services:
  postgresql-master:
    image: docker.io/bitnami/postgresql:17
    ports:
      - '5433:5432'
    volumes:
      - 'postgresql_master_data:/bitnami/postgresql'
    environment:
      - POSTGRESQL_REPLICATION_MODE=master
      - POSTGRESQL_REPLICATION_USER=repl_user
      - POSTGRESQL_REPLICATION_PASSWORD=repl_password
      - POSTGRESQL_USERNAME=postgres
      - POSTGRESQL_PASSWORD=my_password
      - POSTGRESQL_DATABASE=my_database
      - ALLOW_EMPTY_PASSWORD=yes
  postgresql-slave:
    image: docker.io/bitnami/postgresql:17
    ports:
      - '5434:5432'
    depends_on:
      - postgresql-master
    environment:
      - POSTGRESQL_REPLICATION_MODE=slave
      - POSTGRESQL_REPLICATION_USER=repl_user
      - POSTGRESQL_REPLICATION_PASSWORD=repl_password
      - POSTGRESQL_MASTER_HOST=postgresql-master
      - POSTGRESQL_PASSWORD=my_password
      - POSTGRESQL_MASTER_PORT_NUMBER=5432
      - ALLOW_EMPTY_PASSWORD=yes

volumes:
  postgresql_master_data:
    driver: local
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/database/postgres-relationships-v2-v3-migration/int.spec.ts

```typescript
/* eslint-disable jest/require-top-level-describe */
import path from 'path'
import { buildConfig, getPayload } from 'payload'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const describe =
  process.env.PAYLOAD_DATABASE === 'postgres' ? global.describe : global.describe.skip

describe('Postgres relationships v2-v3 migration', () => {
  it('should execute relationships v2-v3 migration', async () => {
    const { databaseAdapter } = await import(path.resolve(dirname, '../../databaseAdapter.js'))

    const init = databaseAdapter.init

    // set options
    databaseAdapter.init = ({ payload }) => {
      const adapter = init({ payload })
      adapter.migrationDir = path.resolve(dirname, 'migrations')
      adapter.push = false
      return adapter
    }

    const config = await buildConfig({
      db: databaseAdapter,
      secret: 'secret',
      collections: [
        {
          slug: 'users',
          auth: true,
          fields: [],
        },
      ],
    })

    const payload = await getPayload({ config })

    let hasErr = false

    await payload.db.migrate().catch(() => {
      hasErr = true
    })

    expect(hasErr).toBeFalsy()

    await payload.db.dropDatabase({ adapter: payload.db as any })
    await payload.destroy()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: 20241219_161447.json]---
Location: payload-main/test/database/postgres-relationships-v2-v3-migration/migrations/20241219_161447.json

```json
{
  "id": "a74d7caa-6a62-4638-ac4b-d5a4d32db5ad",
  "prevId": "00000000-0000-0000-0000-000000000000",
  "version": "7",
  "dialect": "postgresql",
  "tables": {
    "public.users": {
      "name": "users",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "serial",
          "primaryKey": true,
          "notNull": true
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp(3) with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp(3) with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "email": {
          "name": "email",
          "type": "varchar",
          "primaryKey": false,
          "notNull": true
        },
        "reset_password_token": {
          "name": "reset_password_token",
          "type": "varchar",
          "primaryKey": false,
          "notNull": false
        },
        "reset_password_expiration": {
          "name": "reset_password_expiration",
          "type": "timestamp(3) with time zone",
          "primaryKey": false,
          "notNull": false
        },
        "salt": {
          "name": "salt",
          "type": "varchar",
          "primaryKey": false,
          "notNull": false
        },
        "hash": {
          "name": "hash",
          "type": "varchar",
          "primaryKey": false,
          "notNull": false
        },
        "login_attempts": {
          "name": "login_attempts",
          "type": "numeric",
          "primaryKey": false,
          "notNull": false
        },
        "lock_until": {
          "name": "lock_until",
          "type": "timestamp(3) with time zone",
          "primaryKey": false,
          "notNull": false
        }
      },
      "indexes": {
        "users_created_at_idx": {
          "name": "users_created_at_idx",
          "columns": [
            {
              "expression": "created_at",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": false,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "users_email_idx": {
          "name": "users_email_idx",
          "columns": [
            {
              "expression": "email",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": true,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {}
    },
    "public.payload_preferences": {
      "name": "payload_preferences",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "serial",
          "primaryKey": true,
          "notNull": true
        },
        "key": {
          "name": "key",
          "type": "varchar",
          "primaryKey": false,
          "notNull": false
        },
        "value": {
          "name": "value",
          "type": "jsonb",
          "primaryKey": false,
          "notNull": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp(3) with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp(3) with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {
        "payload_preferences_key_idx": {
          "name": "payload_preferences_key_idx",
          "columns": [
            {
              "expression": "key",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": false,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "payload_preferences_created_at_idx": {
          "name": "payload_preferences_created_at_idx",
          "columns": [
            {
              "expression": "created_at",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": false,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {}
    },
    "public.payload_preferences_rels": {
      "name": "payload_preferences_rels",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "serial",
          "primaryKey": true,
          "notNull": true
        },
        "order": {
          "name": "order",
          "type": "integer",
          "primaryKey": false,
          "notNull": false
        },
        "parent_id": {
          "name": "parent_id",
          "type": "integer",
          "primaryKey": false,
          "notNull": true
        },
        "path": {
          "name": "path",
          "type": "varchar",
          "primaryKey": false,
          "notNull": true
        },
        "users_id": {
          "name": "users_id",
          "type": "integer",
          "primaryKey": false,
          "notNull": false
        }
      },
      "indexes": {
        "payload_preferences_rels_order_idx": {
          "name": "payload_preferences_rels_order_idx",
          "columns": [
            {
              "expression": "order",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": false,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "payload_preferences_rels_parent_idx": {
          "name": "payload_preferences_rels_parent_idx",
          "columns": [
            {
              "expression": "parent_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": false,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "payload_preferences_rels_path_idx": {
          "name": "payload_preferences_rels_path_idx",
          "columns": [
            {
              "expression": "path",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": false,
          "concurrently": false,
          "method": "btree",
          "with": {}
        },
        "payload_preferences_rels_users_id_idx": {
          "name": "payload_preferences_rels_users_id_idx",
          "columns": [
            {
              "expression": "users_id",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": false,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {
        "payload_preferences_rels_parent_fk": {
          "name": "payload_preferences_rels_parent_fk",
          "tableFrom": "payload_preferences_rels",
          "tableTo": "payload_preferences",
          "columnsFrom": ["parent_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        },
        "payload_preferences_rels_users_fk": {
          "name": "payload_preferences_rels_users_fk",
          "tableFrom": "payload_preferences_rels",
          "tableTo": "users",
          "columnsFrom": ["users_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {}
    },
    "public.payload_migrations": {
      "name": "payload_migrations",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "serial",
          "primaryKey": true,
          "notNull": true
        },
        "name": {
          "name": "name",
          "type": "varchar",
          "primaryKey": false,
          "notNull": false
        },
        "batch": {
          "name": "batch",
          "type": "numeric",
          "primaryKey": false,
          "notNull": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp(3) with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp(3) with time zone",
          "primaryKey": false,
          "notNull": true,
          "default": "now()"
        }
      },
      "indexes": {
        "payload_migrations_created_at_idx": {
          "name": "payload_migrations_created_at_idx",
          "columns": [
            {
              "expression": "created_at",
              "isExpression": false,
              "asc": true,
              "nulls": "last"
            }
          ],
          "isUnique": false,
          "concurrently": false,
          "method": "btree",
          "with": {}
        }
      },
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {}
    }
  },
  "enums": {},
  "schemas": {},
  "sequences": {},
  "_meta": {
    "schemas": {},
    "tables": {},
    "columns": {}
  }
}
```

--------------------------------------------------------------------------------

---[FILE: 20241219_161447.ts]---
Location: payload-main/test/database/postgres-relationships-v2-v3-migration/migrations/20241219_161447.ts

```typescript
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres';

import { sql } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"login_attempts" numeric,
	"lock_until" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer
);

CREATE TABLE IF NOT EXISTS "payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`

DROP TABLE "users";
DROP TABLE "payload_preferences";
DROP TABLE "payload_preferences_rels";
DROP TABLE "payload_migrations";`)
}
```

--------------------------------------------------------------------------------

````
