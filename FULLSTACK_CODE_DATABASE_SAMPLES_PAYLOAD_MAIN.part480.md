---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 480
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 480 of 695)

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

---[FILE: route.ts]---
Location: payload-main/templates/with-vercel-postgres/src/app/(payload)/api/graphql/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)

export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/templates/with-vercel-postgres/src/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/templates/with-vercel-postgres/src/app/(payload)/api/[...slug]/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/templates/with-vercel-postgres/src/app/my-route/route.ts

```typescript
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async (request: Request) => {
  const payload = await getPayload({
    config: configPromise,
  })

  return Response.json({
    message: 'This is an example of a custom route.',
  })
}
```

--------------------------------------------------------------------------------

---[FILE: Media.ts]---
Location: payload-main/templates/with-vercel-postgres/src/collections/Media.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
```

--------------------------------------------------------------------------------

---[FILE: Users.ts]---
Location: payload-main/templates/with-vercel-postgres/src/collections/Users.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: 20251216_194325_initial.json]---
Location: payload-main/templates/with-vercel-postgres/src/migrations/20251216_194325_initial.json

```json
{
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
    "public.media": {
      "name": "media",
      "schema": "",
      "columns": {
        "id": {
          "name": "id",
          "type": "serial",
          "primaryKey": true,
          "notNull": true
        },
        "alt": {
          "name": "alt",
          "type": "varchar",
          "primaryKey": false,
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
        "url": {
          "name": "url",
          "type": "varchar",
          "primaryKey": false,
          "notNull": false
        },
        "thumbnail_u_r_l": {
          "name": "thumbnail_u_r_l",
          "type": "varchar",
          "primaryKey": false,
          "notNull": false
        },
        "filename": {
          "name": "filename",
          "type": "varchar",
          "primaryKey": false,
          "notNull": false
        },
        "mime_type": {
          "name": "mime_type",
          "type": "varchar",
          "primaryKey": false,
          "notNull": false
        },
        "filesize": {
          "name": "filesize",
          "type": "numeric",
          "primaryKey": false,
          "notNull": false
        },
        "width": {
          "name": "width",
          "type": "numeric",
          "primaryKey": false,
          "notNull": false
        },
        "height": {
          "name": "height",
          "type": "numeric",
          "primaryKey": false,
          "notNull": false
        },
        "focal_x": {
          "name": "focal_x",
          "type": "numeric",
          "primaryKey": false,
          "notNull": false
        },
        "focal_y": {
          "name": "focal_y",
          "type": "numeric",
          "primaryKey": false,
          "notNull": false
        }
      },
      "indexes": {
        "media_updated_at_idx": {
          "name": "media_updated_at_idx",
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
        "media_created_at_idx": {
          "name": "media_created_at_idx",
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
        "media_filename_idx": {
          "name": "media_filename_idx",
          "columns": [
            {
              "expression": "filename",
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
    "public.payload_kv": {
      "name": "payload_kv",
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
          "notNull": true
        },
        "data": {
          "name": "data",
          "type": "jsonb",
          "primaryKey": false,
          "notNull": true
        }
      },
      "indexes": {
        "payload_kv_key_idx": {
          "name": "payload_kv_key_idx",
          "columns": [
            {
              "expression": "key",
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
        },
        "media_id": {
          "name": "media_id",
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
        },
        "payload_locked_documents_rels_media_id_idx": {
          "name": "payload_locked_documents_rels_media_id_idx",
          "columns": [
            {
              "expression": "media_id",
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
        },
        "payload_locked_documents_rels_media_fk": {
          "name": "payload_locked_documents_rels_media_fk",
          "tableFrom": "payload_locked_documents_rels",
          "tableTo": "media",
          "columnsFrom": ["media_id"],
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
  },
  "id": "633ac0dd-e243-41bc-8339-c40677f18590",
  "prevId": "00000000-0000-0000-0000-000000000000"
}
```

--------------------------------------------------------------------------------

---[FILE: 20251216_194325_initial.ts]---
Location: payload-main/templates/with-vercel-postgres/src/migrations/20251216_194325_initial.ts

```typescript
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

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
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
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
  	"users_id" integer,
  	"media_id" integer
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
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
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
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;`)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/templates/with-vercel-postgres/src/migrations/index.ts

```typescript
import * as migration_20251216_194325_initial from './20251216_194325_initial'

export const migrations = [
  {
    up: migration_20251216_194325_initial.up,
    down: migration_20251216_194325_initial.down,
    name: '20251216_194325_initial',
  },
]
```

--------------------------------------------------------------------------------

---[FILE: frontend.e2e.spec.ts]---
Location: payload-main/templates/with-vercel-postgres/tests/e2e/frontend.e2e.spec.ts

```typescript
import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Payload Blank Template/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('Welcome to your new project.')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: api.int.spec.ts]---
Location: payload-main/templates/with-vercel-postgres/tests/int/api.int.spec.ts

```typescript
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: .editorconfig]---
Location: payload-main/templates/with-vercel-website/.editorconfig

```text
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
end_of_line = lf
max_line_length = null
```

--------------------------------------------------------------------------------

---[FILE: .env.example]---
Location: payload-main/templates/with-vercel-website/.env.example

```text
# Database connection string
POSTGRES_URL=postgresql://127.0.0.1:5432/your-database-name
# Used to encrypt JWT tokens
PAYLOAD_SECRET=YOUR_SECRET_HERE
# Used to configure CORS, format links and more. No trailing slash
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
# Secret used to authenticate cron jobs
CRON_SECRET=YOUR_CRON_SECRET_HERE
# Used to validate preview requests
PREVIEW_SECRET=YOUR_SECRET_HERE
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/templates/with-vercel-website/.gitignore

```text
build
dist / media
node_modules
.DS_Store
.env
.next
.vercel

# Payload default media upload directory
public/media/

public/robots.txt
public/sitemap*.xml


# Playwright
node_modules/
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

--------------------------------------------------------------------------------

---[FILE: .npmrc]---
Location: payload-main/templates/with-vercel-website/.npmrc

```text
legacy-peer-deps=true
enable-pre-post-scripts=true
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/templates/with-vercel-website/.prettierignore

```text
**/payload-types.ts
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
**/docs/**
tsconfig.json
```

--------------------------------------------------------------------------------

---[FILE: .prettierrc.json]---
Location: payload-main/templates/with-vercel-website/.prettierrc.json

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": false
}
```

--------------------------------------------------------------------------------

````
