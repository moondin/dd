---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 449
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 449 of 695)

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

---[FILE: access-control.md]---
Location: payload-main/templates/website/.cursor/rules/access-control.md

```text
---
title: Access Control
description: Collection, field, and global access control patterns
tags: [payload, access-control, security, permissions, rbac]
---

# Payload CMS Access Control

## Access Control Layers

1. **Collection-Level**: Controls operations on entire documents (create, read, update, delete, admin)
2. **Field-Level**: Controls access to individual fields (create, read, update)
3. **Global-Level**: Controls access to global documents (read, update)

## Collection Access Control

```typescript
import type { Access } from 'payload'

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
  },
}
```

## Common Access Patterns

```typescript
// Anyone
export const anyone: Access = () => true

// Authenticated only
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

// Admin only
export const adminOnly: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin')
}

// Admin or self
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) return true
  return { id: { equals: user?.id } }
}

// Published or authenticated
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
```

## Row-Level Security

```typescript
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

## Field Access Control

**Field access ONLY returns boolean** (no query constraints).

```typescript
{
  name: 'salary',
  type: 'number',
  access: {
    read: ({ req: { user }, doc }) => {
      // Self can read own salary
      if (user?.id === doc?.id) return true
      // Admin can read all
      return user?.roles?.includes('admin')
    },
    update: ({ req: { user } }) => {
      // Only admins can update
      return user?.roles?.includes('admin')
    },
  },
}
```

## RBAC Pattern

Payload does NOT provide a roles system by default. Add a `roles` field to your auth collection:

```typescript
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true, // Include in JWT for fast access checks
      access: {
        update: ({ req: { user } }) => user?.roles?.includes('admin'),
      },
    },
  ],
}
```

## Multi-Tenant Access Control

```typescript
interface User {
  id: string
  tenantId: string
  roles?: string[]
}

const tenantAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.roles?.includes('super-admin')) return true

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
    {
      name: 'tenant',
      type: 'text',
      required: true,
      access: {
        update: ({ req: { user } }) => user?.roles?.includes('super-admin'),
      },
      hooks: {
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

## Important Notes

1. **Local API Default**: Access control is **skipped by default** in Local API (`overrideAccess: true`). When passing a `user` parameter, you must set `overrideAccess: false`:

```typescript
// ❌ WRONG: Passes user but bypasses access control
await payload.find({
  collection: 'posts',
  user: someUser,
})

// ✅ CORRECT: Respects the user's permissions
await payload.find({
  collection: 'posts',
  user: someUser,
  overrideAccess: false, // Required to enforce access control
})
```

2. **Field Access Limitations**: Field-level access does NOT support query constraints - only boolean returns.

3. **Admin Panel Visibility**: The `admin` access control determines if a collection appears in the admin panel for a user.
```

--------------------------------------------------------------------------------

---[FILE: adapters.md]---
Location: payload-main/templates/website/.cursor/rules/adapters.md

```text
---
title: Database Adapters & Transactions
description: Database adapters, storage, email, and transaction patterns
tags: [payload, database, mongodb, postgres, sqlite, transactions]
---

# Payload CMS Adapters

## Database Adapters

### MongoDB

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
```

### Postgres

```typescript
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

```typescript
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

Payload automatically uses transactions for all-or-nothing database operations.

### Threading req Through Operations

**CRITICAL**: When performing nested operations in hooks, always pass `req` to maintain transaction context.

```typescript
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

### Manual Transaction Control

```typescript
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

## Storage Adapters

Available storage adapters:

- **@payloadcms/storage-s3** - AWS S3
- **@payloadcms/storage-azure** - Azure Blob Storage
- **@payloadcms/storage-gcs** - Google Cloud Storage
- **@payloadcms/storage-r2** - Cloudflare R2
- **@payloadcms/storage-vercel-blob** - Vercel Blob
- **@payloadcms/storage-uploadthing** - Uploadthing

### AWS S3

```typescript
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

## Email Adapters

### Nodemailer (SMTP)

```typescript
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

```typescript
import { resendAdapter } from '@payloadcms/email-resend'

export default buildConfig({
  email: resendAdapter({
    defaultFromAddress: 'noreply@example.com',
    defaultFromName: 'My App',
    apiKey: process.env.RESEND_API_KEY,
  }),
})
```

## Important Notes

1. **MongoDB Transactions**: Require replica set configuration
2. **SQLite Transactions**: Disabled by default, enable with `transactionOptions: {}`
3. **Pass req**: Always pass `req` to nested operations in hooks for transaction safety
4. **Point Fields**: Not supported in SQLite
```

--------------------------------------------------------------------------------

---[FILE: collections.md]---
Location: payload-main/templates/website/.cursor/rules/collections.md

```text
---
title: Collections
description: Collection configurations and patterns
tags: [payload, collections, auth, upload, drafts]
---

# Payload CMS Collections

## Basic Collection

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'createdAt'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'content', type: 'richText' },
    { name: 'author', type: 'relationship', relationTo: 'users' },
  ],
  timestamps: true,
}
```

## Auth Collection with RBAC

```typescript
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true, // Include in JWT for fast access checks
      access: {
        update: ({ req: { user } }) => user?.roles?.includes('admin'),
      },
    },
  ],
}
```

## Upload Collection

```typescript
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
      },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
  },
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
}
```

## Versioning & Drafts

```typescript
export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
      validate: false, // Don't validate drafts
    },
    maxPerDoc: 100,
  },
  access: {
    read: ({ req: { user } }) => {
      // Public sees only published
      if (!user) return { _status: { equals: 'published' } }
      // Authenticated sees all
      return true
    },
  },
}
```

### Draft API Usage

```typescript
// Create draft
await payload.create({
  collection: 'posts',
  data: { title: 'Draft Post' },
  draft: true, // Skips required field validation
})

// Read with drafts
const page = await payload.findByID({
  collection: 'pages',
  id: '123',
  draft: true, // Returns draft version if exists
})
```

## Globals

Globals are single-instance documents (not collections).

```typescript
import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'nav',
      type: 'array',
      maxRows: 8,
      fields: [
        {
          name: 'link',
          type: 'relationship',
          relationTo: 'pages',
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
  ],
}
```
```

--------------------------------------------------------------------------------

---[FILE: components.md]---
Location: payload-main/templates/website/.cursor/rules/components.md

```text
# Custom Components in Payload CMS

Custom Components allow you to fully customize the Admin Panel by swapping in your own React components. You can replace nearly every part of the interface or add entirely new functionality.

## Component Types

There are four main types of Custom Components:

1. **Root Components** - Affect the Admin Panel globally (logo, nav, header)
2. **Collection Components** - Specific to collection views
3. **Global Components** - Specific to global document views
4. **Field Components** - Custom field UI and cells

## Defining Custom Components

### Component Paths

Components are defined using file paths (not direct imports) to keep the config lightweight and Node.js compatible.

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  admin: {
    components: {
      logout: {
        Button: '/src/components/Logout#MyComponent', // Named export
      },
      Nav: '/src/components/Nav', // Default export
    },
  },
})
```

**Component Path Rules:**

1. Paths are relative to project root (or `config.admin.importMap.baseDir`)
2. For **named exports**: append `#ExportName` or use `exportName` property
3. For **default exports**: no suffix needed
4. File extensions can be omitted

### Component Config Object

Instead of a string path, you can pass a config object:

```typescript
{
  logout: {
    Button: {
      path: '/src/components/Logout',
      exportName: 'MyComponent',
      clientProps: { customProp: 'value' },
      serverProps: { asyncData: someData },
    },
  },
}
```

**Config Properties:**

| Property      | Description                                           |
| ------------- | ----------------------------------------------------- |
| `path`        | File path to component (named exports via `#`)        |
| `exportName`  | Named export (alternative to `#` in path)             |
| `clientProps` | Props for Client Components (must be serializable)    |
| `serverProps` | Props for Server Components (can be non-serializable) |

### Setting Base Directory

```typescript
import path from 'path'
import { fileURLToPath } from 'node:url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, 'src'), // Set base directory
    },
    components: {
      Nav: '/components/Nav', // Now relative to src/
    },
  },
})
```

## Server vs Client Components

**All components are React Server Components by default.**

### Server Components (Default)

Can use Local API directly, perform async operations, and access full Payload instance.

```tsx
import React from 'react'
import type { Payload } from 'payload'

async function MyServerComponent({ payload }: { payload: Payload }) {
  const page = await payload.findByID({
    collection: 'pages',
    id: '123',
  })

  return <p>{page.title}</p>
}

export default MyServerComponent
```

### Client Components

Use the `'use client'` directive for interactivity, hooks, state, etc.

```tsx
'use client'
import React, { useState } from 'react'

export function MyClientComponent() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
}
```

**Important:** Client Components cannot receive non-serializable props (functions, class instances, etc.). Payload automatically strips these when passing to client components.

## Default Props

All Custom Components receive these props by default:

| Prop      | Description                              | Type      |
| --------- | ---------------------------------------- | --------- |
| `payload` | Payload instance (Local API access)      | `Payload` |
| `i18n`    | Internationalization object              | `I18n`    |
| `locale`  | Current locale (if localization enabled) | `string`  |

**Server Component Example:**

```tsx
async function MyComponent({ payload, i18n, locale }) {
  const data = await payload.find({
    collection: 'posts',
    locale,
  })

  return <div>{data.docs.length} posts</div>
}
```

**Client Component Example:**

```tsx
'use client'
import { usePayload, useLocale, useTranslation } from '@payloadcms/ui'

export function MyComponent() {
  // Access via hooks in client components
  const { getLocal, getByID } = usePayload()
  const locale = useLocale()
  const { t, i18n } = useTranslation()

  return <div>{t('myKey')}</div>
}
```

## Custom Props

Pass additional props using `clientProps` or `serverProps`:

```typescript
{
  logout: {
    Button: {
      path: '/components/Logout',
      clientProps: {
        buttonText: 'Sign Out',
        onLogout: () => console.log('Logged out'),
      },
    },
  },
}
```

Receive in component:

```tsx
'use client'
export function Logout({ buttonText, onLogout }) {
  return <button onClick={onLogout}>{buttonText}</button>
}
```

## Root Components

Root Components affect the entire Admin Panel.

### Available Root Components

| Component         | Description                      | Config Path                        |
| ----------------- | -------------------------------- | ---------------------------------- |
| `Nav`             | Entire navigation sidebar        | `admin.components.Nav`             |
| `graphics.Icon`   | Small icon (used in nav)         | `admin.components.graphics.Icon`   |
| `graphics.Logo`   | Full logo (used on login)        | `admin.components.graphics.Logo`   |
| `logout.Button`   | Logout button                    | `admin.components.logout.Button`   |
| `actions`         | Header actions (array)           | `admin.components.actions`         |
| `header`          | Above header (array)             | `admin.components.header`          |
| `beforeDashboard` | Before dashboard content (array) | `admin.components.beforeDashboard` |
| `afterDashboard`  | After dashboard content (array)  | `admin.components.afterDashboard`  |
| `beforeLogin`     | Before login form (array)        | `admin.components.beforeLogin`     |
| `afterLogin`      | After login form (array)         | `admin.components.afterLogin`      |
| `beforeNavLinks`  | Before nav links (array)         | `admin.components.beforeNavLinks`  |
| `afterNavLinks`   | After nav links (array)          | `admin.components.afterNavLinks`   |
| `settingsMenu`    | Settings menu items (array)      | `admin.components.settingsMenu`    |
| `providers`       | Custom React Context providers   | `admin.components.providers`       |
| `views`           | Custom views (dashboard, etc.)   | `admin.components.views`           |

### Example: Custom Logo

```typescript
export default buildConfig({
  admin: {
    components: {
      graphics: {
        Logo: '/components/Logo',
        Icon: '/components/Icon',
      },
    },
  },
})
```

```tsx
// components/Logo.tsx
export default function Logo() {
  return <img src="/logo.png" alt="My Brand" width={200} />
}
```

### Example: Header Actions

```typescript
export default buildConfig({
  admin: {
    components: {
      actions: ['/components/ClearCacheButton', '/components/PreviewButton'],
    },
  },
})
```

```tsx
// components/ClearCacheButton.tsx
'use client'
export default function ClearCacheButton() {
  return (
    <button
      onClick={async () => {
        await fetch('/api/clear-cache', { method: 'POST' })
        alert('Cache cleared!')
      }}
    >
      Clear Cache
    </button>
  )
}
```

## Collection Components

Collection Components are specific to a collection's views.

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    components: {
      // Edit view components
      edit: {
        PreviewButton: '/components/PostPreview',
        SaveButton: '/components/CustomSave',
        SaveDraftButton: '/components/CustomSaveDraft',
        PublishButton: '/components/CustomPublish',
      },

      // List view components
      list: {
        Header: '/components/PostsListHeader',
        beforeList: ['/components/ListFilters'],
        afterList: ['/components/ListFooter'],
      },
    },
  },
  fields: [
    // ...
  ],
}
```

## Global Components

Similar to Collection Components but for Global documents.

```typescript
import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  admin: {
    components: {
      edit: {
        PreviewButton: '/components/SettingsPreview',
        SaveButton: '/components/SettingsSave',
      },
    },
  },
  fields: [
    // ...
  ],
}
```

## Field Components

Customize how fields render in Edit and List views.

### Field Component (Edit View)

```typescript
{
  name: 'status',
  type: 'select',
  options: ['draft', 'published'],
  admin: {
    components: {
      Field: '/components/StatusField',
    },
  },
}
```

```tsx
// components/StatusField.tsx
'use client'
import { useField } from '@payloadcms/ui'
import type { SelectFieldClientComponent } from 'payload'

export const StatusField: SelectFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField({ path })

  return (
    <div>
      <label>{field.label}</label>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
```

### Cell Component (List View)

```typescript
{
  name: 'status',
  type: 'select',
  options: ['draft', 'published'],
  admin: {
    components: {
      Cell: '/components/StatusCell',
    },
  },
}
```

```tsx
// components/StatusCell.tsx
import type { SelectFieldCellComponent } from 'payload'

export const StatusCell: SelectFieldCellComponent = ({ data, cellData }) => {
  const isPublished = cellData === 'published'

  return (
    <span
      style={{
        color: isPublished ? 'green' : 'orange',
        fontWeight: 'bold',
      }}
    >
      {cellData}
    </span>
  )
}
```

### UI Field (Presentational Only)

Special field type for adding custom UI without affecting data:

```typescript
{
  name: 'refundButton',
  type: 'ui',
  admin: {
    components: {
      Field: '/components/RefundButton',
    },
  },
}
```

```tsx
// components/RefundButton.tsx
'use client'
import { useDocumentInfo } from '@payloadcms/ui'

export default function RefundButton() {
  const { id } = useDocumentInfo()

  return (
    <button
      onClick={async () => {
        await fetch(`/api/orders/${id}/refund`, { method: 'POST' })
        alert('Refund processed')
      }}
    >
      Process Refund
    </button>
  )
}
```

## Using Hooks

Payload provides many React hooks for Client Components:

```tsx
'use client'
import {
  useAuth, // Current user
  useConfig, // Payload config (client-safe)
  useDocumentInfo, // Current document info (id, slug, etc.)
  useField, // Field value and setValue
  useForm, // Form state and dispatch
  useFormFields, // Multiple field values (optimized)
  useLocale, // Current locale
  useTranslation, // i18n translations
  usePayload, // Local API methods
} from '@payloadcms/ui'

export function MyComponent() {
  const { user } = useAuth()
  const { config } = useConfig()
  const { id, collection } = useDocumentInfo()
  const locale = useLocale()
  const { t } = useTranslation()

  return <div>Hello {user?.email}</div>
}
```

**Important:** These hooks only work in Client Components within the Admin Panel context.

## Accessing Payload Config

**In Server Components:**

```tsx
async function MyServerComponent({ payload }) {
  const { config } = payload
  return <div>{config.serverURL}</div>
}
```

**In Client Components:**

```tsx
'use client'
import { useConfig } from '@payloadcms/ui'

export function MyClientComponent() {
  const { config } = useConfig() // Client-safe config
  return <div>{config.serverURL}</div>
}
```

**Important:** Client Components receive a serializable version of the config (functions, validation, etc. are stripped).

## Field Config Access

**Server Component:**

```tsx
import type { TextFieldServerComponent } from 'payload'

export const MyFieldComponent: TextFieldServerComponent = ({ field }) => {
  return <div>Field name: {field.name}</div>
}
```

**Client Component:**

```tsx
'use client'
import type { TextFieldClientComponent } from 'payload'

export const MyFieldComponent: TextFieldClientComponent = ({ clientField }) => {
  // clientField has non-serializable props removed
  return <div>Field name: {clientField.name}</div>
}
```

## Translations (i18n)

**Server Component:**

```tsx
import { getTranslation } from '@payloadcms/translations'

async function MyServerComponent({ i18n }) {
  const translatedTitle = getTranslation(myTranslation, i18n)
  return <p>{translatedTitle}</p>
}
```

**Client Component:**

```tsx
'use client'
import { useTranslation } from '@payloadcms/ui'

export function MyClientComponent() {
  const { t, i18n } = useTranslation()

  return (
    <div>
      <p>{t('namespace:key', { variable: 'value' })}</p>
      <p>Language: {i18n.language}</p>
    </div>
  )
}
```

## Styling Components

### Using CSS Variables

```tsx
import './styles.scss'

export function MyComponent() {
  return <div className="my-component">Custom Component</div>
}
```

```scss
// styles.scss
.my-component {
  background-color: var(--theme-elevation-500);
  color: var(--theme-text);
  padding: var(--base);
  border-radius: var(--border-radius-m);
}
```

### Importing Payload SCSS

```scss
@import '~@payloadcms/ui/scss';

.my-component {
  @include mid-break {
    background-color: var(--theme-elevation-900);
  }
}
```

## Common Patterns

### Conditional Field Visibility

```tsx
'use client'
import { useFormFields } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

export const ConditionalField: TextFieldClientComponent = ({ path }) => {
  const showField = useFormFields(([fields]) => fields.enableFeature?.value)

  if (!showField) return null

  return <input type="text" />
}
```

### Loading Data from API

```tsx
'use client'
import { useState, useEffect } from 'react'

export function DataLoader() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/custom-data')
      .then((res) => res.json())
      .then(setData)
  }, [])

  return <div>{JSON.stringify(data)}</div>
}
```

### Using Local API in Server Components

```tsx
import type { Payload } from 'payload'

async function RelatedPosts({ payload, id }: { payload: Payload; id: string }) {
  const post = await payload.findByID({
    collection: 'posts',
    id,
    depth: 0,
  })

  const related = await payload.find({
    collection: 'posts',
    where: {
      category: { equals: post.category },
      id: { not_equals: id },
    },
    limit: 5,
  })

  return (
    <div>
      <h3>Related Posts</h3>
      <ul>
        {related.docs.map((doc) => (
          <li key={doc.id}>{doc.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default RelatedPosts
```

## Performance Best Practices

### 1. Minimize Client Bundle Size

```tsx
// ❌ BAD: Imports entire package
'use client'
import { Button } from '@payloadcms/ui'

// ✅ GOOD: Tree-shakeable import for frontend
import { Button } from '@payloadcms/ui/elements/Button'
```

**Rule:** In Admin Panel UI, import from `@payloadcms/ui`. In frontend code, use specific paths.

### 2. Optimize Re-renders

```tsx
// ❌ BAD: Re-renders on every form change
'use client'
import { useForm } from '@payloadcms/ui'

export function MyComponent() {
  const { fields } = useForm()
  // Re-renders on ANY field change
}

// ✅ GOOD: Only re-renders when specific field changes
;('use client')
import { useFormFields } from '@payloadcms/ui'

export function MyComponent({ path }) {
  const value = useFormFields(([fields]) => fields[path])
  // Only re-renders when this field changes
}
```

### 3. Use Server Components When Possible

```tsx
// ✅ GOOD: No JavaScript sent to client
async function PostCount({ payload }) {
  const { totalDocs } = await payload.find({
    collection: 'posts',
    limit: 0,
  })

  return <p>{totalDocs} posts</p>
}

// Only use client components when you need:
// - State (useState, useReducer)
// - Effects (useEffect)
// - Event handlers (onClick, onChange)
// - Browser APIs (localStorage, window)
```

### 4. React Best Practices

- Use React.memo() for expensive components
- Implement proper key props in lists
- Avoid inline function definitions in renders
- Use Suspense boundaries for async operations

## Import Map

Payload generates an import map at `app/(payload)/admin/importMap.js` that resolves all component paths.

**Regenerate manually:**

```bash
payload generate:importmap
```

**Override location:**

```typescript
export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, 'src'),
      importMapFile: path.resolve(dirname, 'app', 'custom-import-map.js'),
    },
  },
})
```

## Type Safety

Use Payload's TypeScript types for components:

```tsx
import type {
  TextFieldServerComponent,
  TextFieldClientComponent,
  TextFieldCellComponent,
} from 'payload'

export const MyFieldComponent: TextFieldServerComponent = (props) => {
  // Fully typed props
}
```

## Troubleshooting

### "useConfig is undefined" or similar hook errors

**Cause:** Dependency version mismatch between Payload packages.

**Solution:** Pin all `@payloadcms/*` packages to the exact same version:

```json
{
  "dependencies": {
    "payload": "3.0.0",
    "@payloadcms/ui": "3.0.0",
    "@payloadcms/richtext-lexical": "3.0.0"
  }
}
```

### Component not loading

1. Check file path is correct (relative to baseDir)
2. Verify named export syntax: `/path/to/file#ExportName`
3. Run `payload generate:importmap` to regenerate
4. Check for TypeScript errors in component file

## Resources

- [Custom Components Docs](https://payloadcms.com/docs/custom-components/overview)
- [Root Components](https://payloadcms.com/docs/custom-components/root-components)
- [Custom Views](https://payloadcms.com/docs/custom-components/custom-views)
- [React Hooks](https://payloadcms.com/docs/admin/react-hooks)
- [Custom CSS](https://payloadcms.com/docs/admin/customizing-css)
```

--------------------------------------------------------------------------------

---[FILE: endpoints.md]---
Location: payload-main/templates/website/.cursor/rules/endpoints.md

```text
---
title: Custom Endpoints
description: Custom REST API endpoints with authentication and helpers
tags: [payload, endpoints, api, routes, webhooks]
---

# Payload Custom Endpoints

## Basic Endpoint Pattern

Custom endpoints are **not authenticated by default**. Always check `req.user`.

```typescript
import { APIError } from 'payload'
import type { Endpoint } from 'payload'

export const protectedEndpoint: Endpoint = {
  path: '/protected',
  method: 'get',
  handler: async (req) => {
    if (!req.user) {
      throw new APIError('Unauthorized', 401)
    }

    // Use req.payload for database operations
    const data = await req.payload.find({
      collection: 'posts',
      where: { author: { equals: req.user.id } },
    })

    return Response.json(data)
  },
}
```

## Route Parameters

```typescript
export const trackingEndpoint: Endpoint = {
  path: '/:id/tracking',
  method: 'get',
  handler: async (req) => {
    const { id } = req.routeParams

    const tracking = await getTrackingInfo(id)

    if (!tracking) {
      return Response.json({ error: 'not found' }, { status: 404 })
    }

    return Response.json(tracking)
  },
}
```

## Request Body Handling

```typescript
// Manual JSON parsing
export const createEndpoint: Endpoint = {
  path: '/create',
  method: 'post',
  handler: async (req) => {
    const data = await req.json()

    const result = await req.payload.create({
      collection: 'posts',
      data,
    })

    return Response.json(result)
  },
}

// Using helper (handles JSON + files)
import { addDataAndFileToRequest } from 'payload'

export const uploadEndpoint: Endpoint = {
  path: '/upload',
  method: 'post',
  handler: async (req) => {
    await addDataAndFileToRequest(req)

    // req.data contains parsed body
    // req.file contains uploaded file (if multipart)

    const result = await req.payload.create({
      collection: 'media',
      data: req.data,
      file: req.file,
    })

    return Response.json(result)
  },
}
```

## Query Parameters

```typescript
export const searchEndpoint: Endpoint = {
  path: '/search',
  method: 'get',
  handler: async (req) => {
    const url = new URL(req.url)
    const query = url.searchParams.get('q')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    const results = await req.payload.find({
      collection: 'posts',
      where: {
        title: {
          contains: query,
        },
      },
      limit,
    })

    return Response.json(results)
  },
}
```

## CORS Headers

```typescript
import { headersWithCors } from 'payload'

export const corsEndpoint: Endpoint = {
  path: '/public-data',
  method: 'get',
  handler: async (req) => {
    const data = await fetchPublicData()

    return Response.json(data, {
      headers: headersWithCors({
        headers: new Headers(),
        req,
      }),
    })
  },
}
```

## Error Handling

```typescript
import { APIError } from 'payload'

export const validateEndpoint: Endpoint = {
  path: '/validate',
  method: 'post',
  handler: async (req) => {
    const data = await req.json()

    if (!data.email) {
      throw new APIError('Email is required', 400)
    }

    return Response.json({ valid: true })
  },
}
```

## Endpoint Placement

### Collection Endpoints

Mounted at `/api/{collection-slug}/{path}`.

```typescript
export const Orders: CollectionConfig = {
  slug: 'orders',
  endpoints: [
    {
      path: '/:id/tracking',
      method: 'get',
      handler: async (req) => {
        // Available at: /api/orders/:id/tracking
        const orderId = req.routeParams.id
        return Response.json({ orderId })
      },
    },
  ],
}
```

### Global Endpoints

Mounted at `/api/globals/{global-slug}/{path}`.

```typescript
export const Settings: GlobalConfig = {
  slug: 'settings',
  endpoints: [
    {
      path: '/clear-cache',
      method: 'post',
      handler: async (req) => {
        // Available at: /api/globals/settings/clear-cache
        await clearCache()
        return Response.json({ message: 'Cache cleared' })
      },
    },
  ],
}
```

### Root Endpoints

Mounted at `/api/{path}`.

```typescript
export default buildConfig({
  endpoints: [
    {
      path: '/hello',
      method: 'get',
      handler: () => {
        // Available at: /api/hello
        return Response.json({ message: 'Hello!' })
      },
    },
  ],
})
```

## Best Practices

1. **Always check authentication** - Custom endpoints are not authenticated by default
2. **Use `req.payload` for operations** - Ensures access control and hooks execute
3. **Use helpers for common tasks** - `addDataAndFileToRequest`, `headersWithCors`
4. **Throw `APIError` for errors** - Provides consistent error responses
5. **Return Web API `Response`** - Use `Response.json()` for consistent responses
6. **Validate input** - Check required fields, validate types
7. **Log errors** - Use `req.payload.logger` for debugging
```

--------------------------------------------------------------------------------

````
