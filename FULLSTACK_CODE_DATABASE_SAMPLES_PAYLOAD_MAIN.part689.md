---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 689
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 689 of 695)

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

---[FILE: ACCESS-CONTROL.md]---
Location: payload-main/tools/claude-plugin/skills/payload/reference/ACCESS-CONTROL.md

```text
# Payload CMS Access Control Reference

Complete reference for access control patterns across collections, fields, and globals.

## At a Glance

| Feature               | Scope                                                     | Returns                | Use Case                           |
| --------------------- | --------------------------------------------------------- | ---------------------- | ---------------------------------- |
| **Collection Access** | create, read, update, delete, admin, unlock, readVersions | boolean \| Where query | Document-level permissions         |
| **Field Access**      | create, read, update                                      | boolean only           | Field-level visibility/editability |
| **Global Access**     | read, update, readVersions                                | boolean \| Where query | Global document permissions        |

## Three Layers of Access Control

Payload provides three distinct access control layers:

1. **Collection-Level**: Controls operations on entire documents (create, read, update, delete, admin, unlock, readVersions)
2. **Field-Level**: Controls access to individual fields (create, read, update)
3. **Global-Level**: Controls access to global documents (read, update, readVersions)

## Return Value Types

Access control functions can return:

- **Boolean**: `true` (allow) or `false` (deny)
- **Query Constraint**: `Where` object for row-level security (collection-level only)

Field-level access does NOT support query constraints - only boolean returns.

## Operation Decision Tree

```txt
User makes request
    │
    ├─ Collection access check
    │   ├─ Returns false? → Deny entire operation
    │   ├─ Returns true? → Continue
    │   └─ Returns Where? → Apply query constraint
    │
    ├─ Field access check (if applicable)
    │   ├─ Returns false? → Field omitted from result
    │   └─ Returns true? → Include field
    │
    └─ Operation completed
```

## Collection Access Control

### Basic Patterns

```ts
import type { CollectionConfig, Access } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    // Boolean: Only authenticated users can create
    create: ({ req: { user } }) => Boolean(user),

    // Query constraint: Public sees published, users see all
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },

    // User-specific: Admins or document owner
    update: ({ req: { user }, id }) => {
      if (user?.roles?.includes('admin')) return true
      return { author: { equals: user?.id } }
    },

    // Async: Check related data
    delete: async ({ req, id }) => {
      const hasComments = await req.payload.count({
        collection: 'comments',
        where: { post: { equals: id } },
      })
      return hasComments === 0
    },

    // Admin panel visibility
    admin: ({ req: { user } }) => {
      return user?.roles?.includes('admin') || user?.roles?.includes('editor')
    },
  },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'status', type: 'select', options: ['draft', 'published'] },
    { name: 'author', type: 'relationship', relationTo: 'users' },
  ],
}
```

### Role-Based Access Control (RBAC) Pattern

Payload does NOT provide a roles system by default. The following is a commonly accepted pattern for implementing role-based access control in auth collections:

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
      defaultValue: ['user'],
      required: true,
      // Save roles to JWT for access control without database lookups
      saveToJWT: true,
      access: {
        // Only admins can update roles
        update: ({ req: { user } }) => user?.roles?.includes('admin'),
      },
    },
  ],
}
```

**Important Notes:**

1. **Not Built-In**: Payload does not provide a roles system out of the box. You must add a `roles` field to your auth collection.
2. **Save to JWT**: Use `saveToJWT: true` to include roles in the JWT token, enabling role checks without database queries.
3. **Default Value**: Set a `defaultValue` to automatically assign new users a default role.
4. **Access Control**: Restrict who can modify roles (typically only admins).
5. **Role Options**: Define your own role hierarchy based on your application needs.

**Using Roles in Access Control:**

```ts
import type { Access } from 'payload'

// Check for specific role
export const adminOnly: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin')
}

// Check for multiple roles
export const adminOrEditor: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.some((role) => ['admin', 'editor'].includes(role)))
}

// Role hierarchy check
export const hasMinimumRole: Access = ({ req: { user } }, minRole: string) => {
  const roleHierarchy = ['user', 'editor', 'admin']
  const userHighestRole = Math.max(...(user?.roles?.map((r) => roleHierarchy.indexOf(r)) || [-1]))
  const requiredRoleIndex = roleHierarchy.indexOf(minRole)

  return userHighestRole >= requiredRoleIndex
}
```

### Reusable Access Functions

```ts
import type { Access } from 'payload'

// Anyone (public)
export const anyone: Access = () => true

// Authenticated only
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

// Authenticated or published content
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

// Admin only
export const admins: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin')
}

// Admin or editor
export const adminsOrEditors: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.some((role) => ['admin', 'editor'].includes(role)))
}

// Self or admin
export const adminsOrSelf: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) return true
  return { id: { equals: user?.id } }
}

// Usage
export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: adminsOrEditors,
    delete: admins,
  },
  fields: [{ name: 'title', type: 'text' }],
}
```

### Row-Level Security with Complex Queries

```ts
import type { Access } from 'payload'

// Organization-scoped access
export const organizationScoped: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) return true

  // Users see only their organization's data
  return {
    organization: {
      equals: user?.organization,
    },
  }
}

// Multiple conditions with AND
export const complexAccess: Access = ({ req: { user } }) => {
  return {
    and: [
      { status: { equals: 'published' } },
      { 'author.isActive': { equals: true } },
      {
        or: [{ visibility: { equals: 'public' } }, { author: { equals: user?.id } }],
      },
    ],
  }
}

// Team-based access
export const teamMemberAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.roles?.includes('admin')) return true

  return {
    'team.members': {
      contains: user.id,
    },
  }
}
```

### Header-Based Access (API Keys)

```ts
import type { Access } from 'payload'

export const apiKeyAccess: Access = ({ req }) => {
  const apiKey = req.headers.get('x-api-key')

  if (!apiKey) return false

  // Validate against stored keys
  return apiKey === process.env.VALID_API_KEY
}

// Bearer token validation
export const bearerTokenAccess: Access = async ({ req }) => {
  const auth = req.headers.get('authorization')

  if (!auth?.startsWith('Bearer ')) return false

  const token = auth.slice(7)
  const isValid = await validateToken(token)

  return isValid
}
```

## Field Access Control

Field access does NOT support query constraints - only boolean returns.

### Basic Field Access

```ts
import type { NumberField, FieldAccess } from 'payload'

const salaryReadAccess: FieldAccess = ({ req: { user }, doc }) => {
  // Self can read own salary
  if (user?.id === doc?.id) return true
  // Admin can read all salaries
  return user?.roles?.includes('admin')
}

const salaryUpdateAccess: FieldAccess = ({ req: { user } }) => {
  // Only admins can update salary
  return user?.roles?.includes('admin')
}

const salaryField: NumberField = {
  name: 'salary',
  type: 'number',
  access: {
    read: salaryReadAccess,
    update: salaryUpdateAccess,
  },
}
```

### Sibling Data Access

```ts
import type { ArrayField, FieldAccess } from 'payload'

const contentReadAccess: FieldAccess = ({ req: { user }, siblingData }) => {
  // Authenticated users see all
  if (user) return true
  // Public sees only if marked public
  return siblingData?.isPublic === true
}

const arrayField: ArrayField = {
  name: 'sections',
  type: 'array',
  fields: [
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'content',
      type: 'text',
      access: {
        read: contentReadAccess,
      },
    },
  ],
}
```

### Nested Field Access

```ts
import type { GroupField, FieldAccess } from 'payload'

const internalOnlyAccess: FieldAccess = ({ req: { user } }) => {
  return user?.roles?.includes('admin') || user?.roles?.includes('internal')
}

const groupField: GroupField = {
  name: 'internalMetadata',
  type: 'group',
  access: {
    read: internalOnlyAccess,
    update: internalOnlyAccess,
  },
  fields: [
    { name: 'internalNotes', type: 'textarea' },
    { name: 'priority', type: 'select', options: ['low', 'medium', 'high'] },
  ],
}
```

### Hiding Admin Fields

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
      access: {
        // Hide from UI, but still saved/queried
        read: ({ req: { user } }) => user?.roles?.includes('admin'),
        // Only admins can update roles
        update: ({ req: { user } }) => user?.roles?.includes('admin'),
      },
    },
  ],
}
```

## Global Access Control

```ts
import type { GlobalConfig, Access } from 'payload'

const adminOnly: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin')
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true, // Anyone can read settings
    update: adminOnly, // Only admins can update
    readVersions: adminOnly, // Only admins can see version history
  },
  fields: [
    { name: 'siteName', type: 'text' },
    { name: 'maintenanceMode', type: 'checkbox' },
  ],
}
```

## Multi-Tenant Access Control

```ts
import type { Access, CollectionConfig } from 'payload'

// Add tenant field to user type
interface User {
  id: string
  tenantId: string
  roles?: string[]
}

// Tenant-scoped access
const tenantAccess: Access = ({ req: { user } }) => {
  // No user = no access
  if (!user) return false

  // Super admin sees all
  if (user.roles?.includes('super-admin')) return true

  // Users see only their tenant's data
  return {
    tenant: {
      equals: (user as User).tenantId,
    },
  }
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: tenantAccess,
    read: tenantAccess,
    update: tenantAccess,
    delete: tenantAccess,
  },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'tenant',
      type: 'text',
      required: true,
      access: {
        // Tenant field hidden from non-admins
        update: ({ req: { user } }) => user?.roles?.includes('super-admin'),
      },
      hooks: {
        // Auto-set tenant on create
        beforeChange: [
          ({ req, operation, value }) => {
            if (operation === 'create' && !value) {
              return (req.user as User)?.tenantId
            }
            return value
          },
        ],
      },
    },
  ],
}
```

## Auth Collection Patterns

### Self or Admin Pattern

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    // Anyone can read user profiles
    read: () => true,

    // Users can update themselves, admins can update anyone
    update: ({ req: { user }, id }) => {
      if (user?.roles?.includes('admin')) return true
      return user?.id === id
    },

    // Only admins can delete
    delete: ({ req: { user } }) => user?.roles?.includes('admin'),
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email' },
  ],
}
```

### Restrict Self-Updates

```ts
import type { CollectionConfig, FieldAccess } from 'payload'

const preventSelfRoleChange: FieldAccess = ({ req: { user }, id }) => {
  // Admins can change anyone's roles
  if (user?.roles?.includes('admin')) return true
  // Users cannot change their own roles
  if (user?.id === id) return false
  return false
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
      access: {
        update: preventSelfRoleChange,
      },
    },
  ],
}
```

## Cross-Collection Validation

```ts
import type { Access } from 'payload'

// Check if user is a project member before allowing access
export const projectMemberAccess: Access = async ({ req, id }) => {
  const { user, payload } = req

  if (!user) return false
  if (user.roles?.includes('admin')) return true

  // Check if document exists and user is member
  const project = await payload.findByID({
    collection: 'projects',
    id: id as string,
    depth: 0,
  })

  return project.members?.includes(user.id)
}

// Prevent deletion if document has dependencies
export const preventDeleteWithDependencies: Access = async ({ req, id }) => {
  const { payload } = req

  const dependencyCount = await payload.count({
    collection: 'related-items',
    where: {
      parent: { equals: id },
    },
  })

  return dependencyCount === 0
}
```

## Access Control Function Arguments

### Collection Create

```ts
create: ({ req, data }) => boolean | Where

// req: PayloadRequest
//   - req.user: Authenticated user (if any)
//   - req.payload: Payload instance for queries
//   - req.headers: Request headers
//   - req.locale: Current locale
// data: The data being created
```

### Collection Read

```ts
read: ({ req, id }) => boolean | Where

// req: PayloadRequest
// id: Document ID being read
//   - undefined during Access Operation (login check)
//   - string when reading specific document
```

### Collection Update

```ts
update: ({ req, id, data }) => boolean | Where

// req: PayloadRequest
// id: Document ID being updated
// data: New values being applied
```

### Collection Delete

```ts
delete: ({ req, id }) => boolean | Where

// req: PayloadRequest
// id: Document ID being deleted
```

### Field Create

```ts
access: {
  create: ({ req, data, siblingData }) => boolean
}

// req: PayloadRequest
// data: Full document data
// siblingData: Adjacent field values at same level
```

### Field Read

```ts
access: {
  read: ({ req, id, doc, siblingData }) => boolean
}

// req: PayloadRequest
// id: Document ID
// doc: Full document
// siblingData: Adjacent field values
```

### Field Update

```ts
access: {
  update: ({ req, id, data, doc, siblingData }) => boolean
}

// req: PayloadRequest
// id: Document ID
// data: New values
// doc: Current document
// siblingData: Adjacent field values
```

## Important Notes

1. **Local API Default**: Access control is **skipped by default** in Local API (`overrideAccess: true`). When passing a `user` parameter, you almost always want to set `overrideAccess: false` to respect that user's permissions:

   ```ts
   // ❌ WRONG: Passes user but bypasses access control (default behavior)
   await payload.find({
     collection: 'posts',
     user: someUser, // User is ignored for access control!
   })

   // ✅ CORRECT: Respects the user's permissions
   await payload.find({
     collection: 'posts',
     user: someUser,
     overrideAccess: false, // Required to enforce access control
   })
   ```

   **Why this matters**: If you pass `user` without `overrideAccess: false`, the operation runs with admin privileges regardless of the user's actual permissions. This is a common security mistake.

2. **Field Access Limitations**: Field-level access does NOT support query constraints - only boolean returns.

3. **Admin Panel Visibility**: The `admin` access control determines if a collection appears in the admin panel for a user.

4. **Access Before Hooks**: Access control executes BEFORE hooks run, so hooks cannot modify access behavior.

5. **Query Constraints**: Only collection-level `read` access supports query constraints. All other operations and field-level access require boolean returns.

## Best Practices

1. **Reusable Functions**: Create named access functions for common patterns
2. **Fail Secure**: Default to `false` for sensitive operations
3. **Cache Checks**: Use `req.context` to cache expensive validation
4. **Type Safety**: Type your user object for better IDE support
5. **Test Thoroughly**: Write tests for complex access control logic
6. **Document Intent**: Add comments explaining access rules
7. **Audit Logs**: Track access control decisions for security review
8. **Performance**: Avoid N+1 queries in access functions
9. **Error Handling**: Access functions should not throw - return `false` instead
10. **Tenant Hooks**: Auto-set tenant fields in `beforeChange` hooks

## Advanced Patterns

For advanced access control patterns including context-aware access, time-based restrictions, subscription-based access, factory functions, configuration templates, debugging tips, and performance optimization, see [ACCESS-CONTROL-ADVANCED.md](ACCESS-CONTROL-ADVANCED.md).
```

--------------------------------------------------------------------------------

---[FILE: ADAPTERS.md]---
Location: payload-main/tools/claude-plugin/skills/payload/reference/ADAPTERS.md

```text
# Payload CMS Adapters Reference

Complete reference for database, storage, and email adapters.

## Database Adapters

### MongoDB

```ts
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
```

### Postgres

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    push: false, // Don't auto-push schema changes
    migrationDir: './migrations',
  }),
})
```

### SQLite

```ts
import { sqliteAdapter } from '@payloadcms/db-sqlite'

export default buildConfig({
  db: sqliteAdapter({
    client: {
      url: 'file:./payload.db',
    },
    transactionOptions: {}, // Enable transactions (disabled by default)
  }),
})
```

## Transactions

Payload automatically uses transactions for all-or-nothing database operations. Pass `req` to include operations in the same transaction.

```ts
import type { CollectionAfterChangeHook } from 'payload'

const afterChange: CollectionAfterChangeHook = async ({ req, doc }) => {
  // This will be part of the same transaction
  await req.payload.create({
    req, // Pass req to use same transaction
    collection: 'audit-log',
    data: { action: 'created', docId: doc.id },
  })
}

// Manual transaction control
const transactionID = await payload.db.beginTransaction()
try {
  await payload.create({
    collection: 'orders',
    data: orderData,
    req: { transactionID },
  })
  await payload.update({
    collection: 'inventory',
    id: itemId,
    data: { stock: newStock },
    req: { transactionID },
  })
  await payload.db.commitTransaction(transactionID)
} catch (error) {
  await payload.db.rollbackTransaction(transactionID)
  throw error
}
```

**Note**: MongoDB requires replicaset for transactions. SQLite requires `transactionOptions: {}` to enable.

### Threading req Through Operations

**Critical**: When performing nested operations in hooks, always pass `req` to maintain transaction context. Failing to do so breaks atomicity and can cause partial updates.

```ts
import type { CollectionAfterChangeHook } from 'payload'

// ✅ CORRECT: Thread req through nested operations
const resaveChildren: CollectionAfterChangeHook = async ({ collection, doc, req }) => {
  // Find children - pass req
  const children = await req.payload.find({
    collection: 'children',
    where: { parent: { equals: doc.id } },
    req, // Maintains transaction context
  })

  // Update each child - pass req
  for (const child of children.docs) {
    await req.payload.update({
      id: child.id,
      collection: 'children',
      data: { updatedField: 'value' },
      req, // Same transaction as parent operation
    })
  }
}

// ❌ WRONG: Missing req breaks transaction
const brokenHook: CollectionAfterChangeHook = async ({ collection, doc, req }) => {
  const children = await req.payload.find({
    collection: 'children',
    where: { parent: { equals: doc.id } },
    // Missing req - separate transaction or no transaction
  })

  for (const child of children.docs) {
    await req.payload.update({
      id: child.id,
      collection: 'children',
      data: { updatedField: 'value' },
      // Missing req - if parent operation fails, these updates persist
    })
  }
}
```

**Why This Matters:**

- **MongoDB (with replica sets)**: Creates atomic session across operations
- **PostgreSQL**: All operations use same Drizzle transaction
- **SQLite (with transactions enabled)**: Ensures rollback on errors
- **Without req**: Each operation runs independently, breaking atomicity

**When req is Required:**

- All mutating operations in hooks (create, update, delete)
- Operations that must succeed/fail together
- When using MongoDB replica sets or Postgres
- Any operation that relies on `req.context` or `req.user`

**When req is Optional:**

- Read-only lookups independent of current transaction
- Operations with `disableTransaction: true`
- Administrative operations with `overrideAccess: true`

## Storage Adapters

Available storage adapters:

- **@payloadcms/storage-s3** - AWS S3
- **@payloadcms/storage-azure** - Azure Blob Storage
- **@payloadcms/storage-gcs** - Google Cloud Storage
- **@payloadcms/storage-r2** - Cloudflare R2
- **@payloadcms/storage-vercel-blob** - Vercel Blob
- **@payloadcms/storage-uploadthing** - Uploadthing

### AWS S3

```ts
import { s3Storage } from '@payloadcms/storage-s3'

export default buildConfig({
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION,
      },
    }),
  ],
})
```

### Azure Blob Storage

```ts
import { azureStorage } from '@payloadcms/storage-azure'

export default buildConfig({
  plugins: [
    azureStorage({
      collections: {
        media: true,
      },
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
    }),
  ],
})
```

### Google Cloud Storage

```ts
import { gcsStorage } from '@payloadcms/storage-gcs'

export default buildConfig({
  plugins: [
    gcsStorage({
      collections: {
        media: true,
      },
      bucket: process.env.GCS_BUCKET,
      options: {
        projectId: process.env.GCS_PROJECT_ID,
        credentials: JSON.parse(process.env.GCS_CREDENTIALS),
      },
    }),
  ],
})
```

### Cloudflare R2

```ts
import { r2Storage } from '@payloadcms/storage-r2'

export default buildConfig({
  plugins: [
    r2Storage({
      collections: {
        media: true,
      },
      bucket: process.env.R2_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT,
      },
    }),
  ],
})
```

### Vercel Blob

```ts
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export default buildConfig({
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
```

### Uploadthing

```ts
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'

export default buildConfig({
  plugins: [
    uploadthingStorage({
      collections: {
        media: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
  ],
})
```

## Email Adapters

### Nodemailer (SMTP)

```ts
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: 'noreply@example.com',
    defaultFromName: 'My App',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
})
```

### Resend

```ts
import { resendAdapter } from '@payloadcms/email-resend'

export default buildConfig({
  email: resendAdapter({
    defaultFromAddress: 'noreply@example.com',
    defaultFromName: 'My App',
    apiKey: process.env.RESEND_API_KEY,
  }),
})
```
```

--------------------------------------------------------------------------------

---[FILE: ADVANCED.md]---
Location: payload-main/tools/claude-plugin/skills/payload/reference/ADVANCED.md

```text
# Payload CMS Advanced Features

Complete reference for authentication, jobs, custom endpoints, components, plugins, and localization.

## Authentication

### Login

```ts
// REST API
const response = await fetch('/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password',
  }),
})

// Local API
const result = await payload.login({
  collection: 'users',
  data: {
    email: 'user@example.com',
    password: 'password',
  },
})
```

### Forgot Password

```ts
await payload.forgotPassword({
  collection: 'users',
  data: {
    email: 'user@example.com',
  },
})
```

### Custom Strategy

```ts
import type { CollectionConfig, Strategy } from 'payload'

const customStrategy: Strategy = {
  name: 'custom',
  authenticate: async ({ payload, headers }) => {
    const token = headers.get('authorization')?.split(' ')[1]
    if (!token) return { user: null }

    const user = await verifyToken(token)
    return { user }
  },
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    strategies: [customStrategy],
  },
  fields: [],
}
```

### API Keys

```ts
import type { CollectionConfig } from 'payload'

export const APIKeys: CollectionConfig = {
  slug: 'api-keys',
  auth: {
    disableLocalStrategy: true,
    useAPIKey: true,
  },
  fields: [],
}
```

## Jobs Queue

Offload long-running or scheduled tasks to background workers.

### Tasks

```ts
import { buildConfig } from 'payload'
import type { TaskConfig } from 'payload'

export default buildConfig({
  jobs: {
    tasks: [
      {
        slug: 'sendWelcomeEmail',
        inputSchema: [
          { name: 'userEmail', type: 'text', required: true },
          { name: 'userName', type: 'text', required: true },
        ],
        outputSchema: [{ name: 'emailSent', type: 'checkbox', required: true }],
        retries: 2, // Retry up to 2 times on failure
        handler: async ({ input, req }) => {
          await sendEmail({
            to: input.userEmail,
            subject: `Welcome ${input.userName}`,
          })
          return { output: { emailSent: true } }
        },
      } as TaskConfig<'sendWelcomeEmail'>,
    ],
  },
})
```

### Queueing Jobs

```ts
// In a hook or endpoint
await req.payload.jobs.queue({
  task: 'sendWelcomeEmail',
  input: {
    userEmail: 'user@example.com',
    userName: 'John',
  },
  waitUntil: new Date('2024-12-31'), // Optional: schedule for future
})
```

### Workflows

Multi-step jobs that run in sequence:

```ts
{
  slug: 'onboardUser',
  inputSchema: [{ name: 'userId', type: 'text' }],
  handler: async ({ job, req }) => {
    const results = await job.runInlineTask({
      task: async ({ input }) => {
        // Step 1: Send welcome email
        await sendEmail(input.userId)
        return { output: { emailSent: true } }
      },
    })

    await job.runInlineTask({
      task: async () => {
        // Step 2: Create onboarding tasks
        await createTasks()
        return { output: { tasksCreated: true } }
      },
    })
  },
}
```

## Custom Endpoints

Add custom REST API routes to collections, globals, or root config. See [ENDPOINTS.md](ENDPOINTS.md) for detailed patterns, authentication, helpers, and real-world examples.

### Root Endpoints

```ts
import { buildConfig } from 'payload'
import type { Endpoint } from 'payload'

const helloEndpoint: Endpoint = {
  path: '/hello',
  method: 'get',
  handler: () => {
    return Response.json({ message: 'Hello!' })
  },
}

const greetEndpoint: Endpoint = {
  path: '/greet/:name',
  method: 'get',
  handler: (req) => {
    return Response.json({
      message: `Hello ${req.routeParams.name}!`,
    })
  },
}

export default buildConfig({
  endpoints: [helloEndpoint, greetEndpoint],
  collections: [],
  secret: process.env.PAYLOAD_SECRET || '',
})
```

### Collection Endpoints

```ts
import type { CollectionConfig, Endpoint } from 'payload'

const featuredEndpoint: Endpoint = {
  path: '/featured',
  method: 'get',
  handler: async (req) => {
    const posts = await req.payload.find({
      collection: 'posts',
      where: { featured: { equals: true } },
    })
    return Response.json(posts)
  },
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  endpoints: [featuredEndpoint],
  fields: [
    { name: 'title', type: 'text' },
    { name: 'featured', type: 'checkbox' },
  ],
}
```

## Custom Components

### Field Component (Client)

```tsx
'use client'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

export const CustomField: TextFieldClientComponent = () => {
  const { value, setValue } = useField()

  return <input value={value || ''} onChange={(e) => setValue(e.target.value)} />
}
```

### Custom View

```tsx
'use client'
import { DefaultTemplate } from '@payloadcms/next/templates'

export const CustomView = () => {
  return (
    <DefaultTemplate>
      <h1>Custom Dashboard</h1>
      {/* Your content */}
    </DefaultTemplate>
  )
}
```

### Admin Config

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  admin: {
    components: {
      beforeDashboard: ['/components/BeforeDashboard'],
      beforeLogin: ['/components/BeforeLogin'],
      views: {
        custom: {
          Component: '/views/Custom',
          path: '/custom',
        },
      },
    },
  },
  collections: [],
  secret: process.env.PAYLOAD_SECRET || '',
})
```

## Plugins

### Available Plugins

- **@payloadcms/plugin-seo** - SEO fields with meta title/description, Open Graph, preview generation
- **@payloadcms/plugin-redirects** - Manage URL redirects (301/302) for Next.js apps
- **@payloadcms/plugin-nested-docs** - Hierarchical document structures with breadcrumbs
- **@payloadcms/plugin-form-builder** - Dynamic form builder with submissions and validation
- **@payloadcms/plugin-search** - Full-text search integration (Algolia support)
- **@payloadcms/plugin-stripe** - Stripe payments, subscriptions, webhooks
- **@payloadcms/plugin-ecommerce** - Complete ecommerce solution (products, variants, carts, orders)
- **@payloadcms/plugin-import-export** - Import/export data via CSV
- **@payloadcms/plugin-multi-tenant** - Multi-tenancy with tenant isolation
- **@payloadcms/plugin-sentry** - Sentry error tracking integration
- **@payloadcms/plugin-mcp** - Model Context Protocol for AI integrations

### Using Plugins

```ts
import { buildConfig } from 'payload'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'

export default buildConfig({
  plugins: [
    seoPlugin({
      collections: ['posts', 'pages'],
    }),
    redirectsPlugin({
      collections: ['pages'],
    }),
  ],
  collections: [],
  secret: process.env.PAYLOAD_SECRET || '',
})
```

### Creating Plugins

```ts
import type { Config } from 'payload'

interface PluginOptions {
  enabled?: boolean
}

export const myPlugin =
  (options: PluginOptions) =>
  (config: Config): Config => ({
    ...config,
    collections: [
      ...(config.collections || []),
      {
        slug: 'plugin-collection',
        fields: [{ name: 'title', type: 'text' }],
      },
    ],
    onInit: async (payload) => {
      if (config.onInit) await config.onInit(payload)
      // Plugin initialization
    },
  })
```

## Localization

```ts
import { buildConfig } from 'payload'
import type { Field, Payload } from 'payload'

export default buildConfig({
  localization: {
    locales: ['en', 'es', 'de'],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [],
  secret: process.env.PAYLOAD_SECRET || '',
})

// Localized field
const localizedField: TextField = {
  name: 'title',
  type: 'text',
  localized: true,
}

// Query with locale
const posts = await payload.find({
  collection: 'posts',
  locale: 'es',
})
```

## TypeScript Type References

For complete TypeScript type definitions and signatures, reference these files from the Payload source:

### Core Configuration Types

- **[All Commonly-Used Types](https://github.com/payloadcms/payload/blob/main/packages/payload/src/index.ts)** - Check here first for commonly used types and interfaces. All core types are exported from this file.

### Database & Adapters

- **[Database Adapter Types](https://github.com/payloadcms/payload/blob/main/packages/payload/src/database/types.ts)** - Base adapter interface
- **[MongoDB Adapter](https://github.com/payloadcms/payload/blob/main/packages/db-mongodb/src/index.ts)** - MongoDB-specific options
- **[Postgres Adapter](https://github.com/payloadcms/payload/blob/main/packages/db-postgres/src/index.ts)** - Postgres-specific options

### Rich Text & Plugins

- **[Lexical Types](https://github.com/payloadcms/payload/blob/main/packages/richtext-lexical/src/exports/server/index.ts)** - Lexical editor configuration

When users need detailed type information, fetch these URLs to provide complete signatures and optional parameters.
```

--------------------------------------------------------------------------------

````
