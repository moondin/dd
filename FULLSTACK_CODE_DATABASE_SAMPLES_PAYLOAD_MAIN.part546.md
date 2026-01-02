---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 546
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 546 of 695)

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

---[FILE: 20241219_161510.json]---
Location: payload-main/test/database/postgres-relationships-v2-v3-migration/migrations/20241219_161510.json

```json
{
  "id": "94b1db32-b521-40d0-9f45-866a14cb53cc",
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

---[FILE: 20241219_161510.ts]---
Location: payload-main/test/database/postgres-relationships-v2-v3-migration/migrations/20241219_161510.ts

```typescript
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Migration code
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Migration code
}
```

--------------------------------------------------------------------------------

---[FILE: 20241219_161711_relationships_v2_v3.ts]---
Location: payload-main/test/database/postgres-relationships-v2-v3-migration/migrations/20241219_161711_relationships_v2_v3.ts

```typescript
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { migratePostgresV2toV3 } from '@payloadcms/db-postgres/migration-utils'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await migratePostgresV2toV3({
    // enables logging of changes that will be made to the database
    debug: true,
    payload,
    req,
  })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Migration code
}
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/database/up-down-migration/int.spec.ts

```typescript
/* eslint-disable jest/require-top-level-describe */
import { existsSync, rmdirSync, rmSync } from 'fs'
import path from 'path'
import { buildConfig, getPayload } from 'payload'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const describe =
  process.env.PAYLOAD_DATABASE === 'postgres' ? global.describe : global.describe.skip

const clearMigrations = () => {
  if (existsSync(path.resolve(dirname, 'migrations'))) {
    rmSync(path.resolve(dirname, 'migrations'), { force: true, recursive: true })
  }
}

describe('SQL migrations', () => {
  // If something fails - an error will be thrown.
  // eslint-disable-next-line jest/expect-expect
  it('should up and down migration successfully', async () => {
    clearMigrations()

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

    await payload.db.createMigration({ payload })
    await payload.db.migrate()
    await payload.db.migrateDown()

    await payload.db.dropDatabase({ adapter: payload.db as any })
    await payload.destroy()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: 20250811_134524.json]---
Location: payload-main/test/database/up-down-migration/migrations/20250811_134524.json

```json
{
  "id": "fc114c71-8138-46c6-b83a-4d70e79e0ea5",
  "prevId": "00000000-0000-0000-0000-000000000000",
  "version": "7",
  "dialect": "postgresql",
  "tables": {
    "public.users_sessions": {
      "name": "users_sessions",
      "schema": "",
      "columns": {
        "_order": {
          "name": "_order",
          "type": "integer",
          "primaryKey": false,
          "notNull": true
        },
        "_parent_id": {
          "name": "_parent_id",
          "type": "integer",
          "primaryKey": false,
          "notNull": true
        },
        "id": {
          "name": "id",
          "type": "varchar",
          "primaryKey": true,
          "notNull": true
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp(3) with time zone",
          "primaryKey": false,
          "notNull": false
        },
        "expires_at": {
          "name": "expires_at",
          "type": "timestamp(3) with time zone",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {
        "users_sessions_order_idx": {
          "name": "users_sessions_order_idx",
          "columns": [
            {
              "expression": "_order",
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
        "users_sessions_parent_id_idx": {
          "name": "users_sessions_parent_id_idx",
          "columns": [
            {
              "expression": "_parent_id",
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
        "users_sessions_parent_id_fk": {
          "name": "users_sessions_parent_id_fk",
          "tableFrom": "users_sessions",
          "tableTo": "users",
          "columnsFrom": ["_parent_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
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
          "notNull": false,
          "default": 0
        },
        "lock_until": {
          "name": "lock_until",
          "type": "timestamp(3) with time zone",
          "primaryKey": false,
          "notNull": false
        }
      },
      "indexes": {
        "users_updated_at_idx": {
          "name": "users_updated_at_idx",
          "columns": [
            {
              "expression": "updated_at",
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
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.payload_locked_documents": {
      "name": "payload_locked_documents",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "serial",
          "primaryKey": true,
          "notNull": true
        },
        "global_slug": {
          "name": "global_slug",
          "type": "varchar",
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
        "payload_locked_documents_global_slug_idx": {
          "name": "payload_locked_documents_global_slug_idx",
          "columns": [
            {
              "expression": "global_slug",
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
        "payload_locked_documents_updated_at_idx": {
          "name": "payload_locked_documents_updated_at_idx",
          "columns": [
            {
              "expression": "updated_at",
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
        "payload_locked_documents_created_at_idx": {
          "name": "payload_locked_documents_created_at_idx",
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
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    },
    "public.payload_locked_documents_rels": {
      "name": "payload_locked_documents_rels",
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
        "payload_locked_documents_rels_order_idx": {
          "name": "payload_locked_documents_rels_order_idx",
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
        "payload_locked_documents_rels_parent_idx": {
          "name": "payload_locked_documents_rels_parent_idx",
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
        "payload_locked_documents_rels_path_idx": {
          "name": "payload_locked_documents_rels_path_idx",
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
        "payload_locked_documents_rels_users_id_idx": {
          "name": "payload_locked_documents_rels_users_id_idx",
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
        "payload_locked_documents_rels_parent_fk": {
          "name": "payload_locked_documents_rels_parent_fk",
          "tableFrom": "payload_locked_documents_rels",
          "tableTo": "payload_locked_documents",
          "columnsFrom": ["parent_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        },
        "payload_locked_documents_rels_users_fk": {
          "name": "payload_locked_documents_rels_users_fk",
          "tableFrom": "payload_locked_documents_rels",
          "tableTo": "users",
          "columnsFrom": ["users_id"],
          "columnsTo": ["id"],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
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
        "payload_preferences_updated_at_idx": {
          "name": "payload_preferences_updated_at_idx",
          "columns": [
            {
              "expression": "updated_at",
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
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
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
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
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
        "payload_migrations_updated_at_idx": {
          "name": "payload_migrations_updated_at_idx",
          "columns": [
            {
              "expression": "updated_at",
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
      "uniqueConstraints": {},
      "policies": {},
      "checkConstraints": {},
      "isRLSEnabled": false
    }
  },
  "enums": {},
  "schemas": {},
  "sequences": {},
  "roles": {},
  "policies": {},
  "views": {},
  "_meta": {
    "schemas": {},
    "tables": {},
    "columns": {}
  }
}
```

--------------------------------------------------------------------------------

---[FILE: 20250811_134524.ts]---
Location: payload-main/test/database/up-down-migration/migrations/20250811_134524.ts

```typescript
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;`)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/database/up-down-migration/migrations/index.ts

```typescript
import * as migration_20250811_134524 from './20250811_134524.js'

export const migrations = [
  {
    up: migration_20250811_134524.up,
    down: migration_20250811_134524.down,
    name: '20250811_134524',
  },
]
```

--------------------------------------------------------------------------------

````
