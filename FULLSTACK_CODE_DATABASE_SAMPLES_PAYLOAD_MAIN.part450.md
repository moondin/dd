---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 450
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 450 of 695)

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

---[FILE: field-type-guards.md]---
Location: payload-main/templates/website/.cursor/rules/field-type-guards.md

```text
---
title: Field Type Guards
description: Runtime field type checking and safe type narrowing
tags: [payload, typescript, type-guards, fields]
---

# Payload Field Type Guards

Type guards for runtime field type checking and safe type narrowing.

## Most Common Guards

### fieldAffectsData

**Most commonly used guard.** Checks if field stores data (has name and is not UI-only).

```typescript
import { fieldAffectsData } from 'payload'

function generateSchema(fields: Field[]) {
  fields.forEach((field) => {
    if (fieldAffectsData(field)) {
      // Safe to access field.name
      schema[field.name] = getFieldType(field)
    }
  })
}

// Filter data fields
const dataFields = fields.filter(fieldAffectsData)
```

### fieldHasSubFields

Checks if field contains nested fields (group, array, row, or collapsible).

```typescript
import { fieldHasSubFields } from 'payload'

function traverseFields(fields: Field[]): void {
  fields.forEach((field) => {
    if (fieldHasSubFields(field)) {
      // Safe to access field.fields
      traverseFields(field.fields)
    }
  })
}
```

### fieldIsArrayType

Checks if field type is `'array'`.

```typescript
import { fieldIsArrayType } from 'payload'

if (fieldIsArrayType(field)) {
  // field.type === 'array'
  console.log(`Min rows: ${field.minRows}`)
  console.log(`Max rows: ${field.maxRows}`)
}
```

## Capability Guards

### fieldSupportsMany

Checks if field can have multiple values (select, relationship, or upload with `hasMany`).

```typescript
import { fieldSupportsMany } from 'payload'

if (fieldSupportsMany(field)) {
  // field.type is 'select' | 'relationship' | 'upload'
  if (field.hasMany) {
    console.log('Field accepts multiple values')
  }
}
```

### fieldHasMaxDepth

Checks if field is relationship/upload/join with numeric `maxDepth` property.

```typescript
import { fieldHasMaxDepth } from 'payload'

if (fieldHasMaxDepth(field)) {
  // field.type is 'upload' | 'relationship' | 'join'
  // AND field.maxDepth is number
  const remainingDepth = field.maxDepth - currentDepth
}
```

### fieldIsVirtual

Checks if field is virtual (computed or virtual relationship).

```typescript
import { fieldIsVirtual } from 'payload'

if (fieldIsVirtual(field)) {
  // field.virtual is truthy
  if (typeof field.virtual === 'string') {
    console.log(`Virtual path: ${field.virtual}`)
  }
}
```

## Type Checking Guards

### fieldIsBlockType

```typescript
import { fieldIsBlockType } from 'payload'

if (fieldIsBlockType(field)) {
  // field.type === 'blocks'
  field.blocks.forEach((block) => {
    console.log(`Block: ${block.slug}`)
  })
}
```

### fieldIsGroupType

```typescript
import { fieldIsGroupType } from 'payload'

if (fieldIsGroupType(field)) {
  // field.type === 'group'
  console.log(`Interface: ${field.interfaceName}`)
}
```

### fieldIsPresentationalOnly

```typescript
import { fieldIsPresentationalOnly } from 'payload'

if (fieldIsPresentationalOnly(field)) {
  // field.type === 'ui'
  // Skip in data operations, GraphQL schema, etc.
  return
}
```

## Common Patterns

### Recursive Field Traversal

```typescript
import { fieldAffectsData, fieldHasSubFields } from 'payload'

function traverseFields(fields: Field[], callback: (field: Field) => void) {
  fields.forEach((field) => {
    if (fieldAffectsData(field)) {
      callback(field)
    }

    if (fieldHasSubFields(field)) {
      traverseFields(field.fields, callback)
    }
  })
}
```

### Filter Data-Bearing Fields

```typescript
import { fieldAffectsData, fieldIsPresentationalOnly, fieldIsHiddenOrDisabled } from 'payload'

const dataFields = fields.filter(
  (field) =>
    fieldAffectsData(field) && !fieldIsPresentationalOnly(field) && !fieldIsHiddenOrDisabled(field),
)
```

### Container Type Switching

```typescript
import { fieldIsArrayType, fieldIsBlockType, fieldHasSubFields } from 'payload'

if (fieldIsArrayType(field)) {
  // Handle array-specific logic
} else if (fieldIsBlockType(field)) {
  // Handle blocks-specific logic
} else if (fieldHasSubFields(field)) {
  // Handle group/row/collapsible
}
```

### Safe Property Access

```typescript
import { fieldSupportsMany, fieldHasMaxDepth } from 'payload'

// With guard - safe access
if (fieldSupportsMany(field) && field.hasMany) {
  console.log('Multiple values supported')
}

if (fieldHasMaxDepth(field)) {
  const depth = field.maxDepth // TypeScript knows this is number
}
```

## All Available Guards

| Type Guard                  | Checks For                        | Use When                                 |
| --------------------------- | --------------------------------- | ---------------------------------------- |
| `fieldAffectsData`          | Field stores data (has name)      | Need to access field data or name        |
| `fieldHasSubFields`         | Field contains nested fields      | Recursively traverse fields              |
| `fieldIsArrayType`          | Field is array type               | Distinguish arrays from other containers |
| `fieldIsBlockType`          | Field is blocks type              | Handle blocks-specific logic             |
| `fieldIsGroupType`          | Field is group type               | Handle group-specific logic              |
| `fieldSupportsMany`         | Field can have multiple values    | Check for `hasMany` support              |
| `fieldHasMaxDepth`          | Field supports depth control      | Control relationship/upload/join depth   |
| `fieldIsPresentationalOnly` | Field is UI-only                  | Exclude from data operations             |
| `fieldIsSidebar`            | Field positioned in sidebar       | Separate sidebar rendering               |
| `fieldIsID`                 | Field name is 'id'                | Special ID field handling                |
| `fieldIsHiddenOrDisabled`   | Field is hidden or disabled       | Filter from UI operations                |
| `fieldShouldBeLocalized`    | Field needs localization          | Proper locale table checks               |
| `fieldIsVirtual`            | Field is virtual                  | Skip in database transforms              |
| `tabHasName`                | Tab is named (stores data)        | Distinguish named vs unnamed tabs        |
| `groupHasName`              | Group is named (stores data)      | Distinguish named vs unnamed groups      |
| `optionIsObject`            | Option is `{label, value}`        | Access option properties safely          |
| `optionsAreObjects`         | All options are objects           | Batch option processing                  |
| `optionIsValue`             | Option is string value            | Handle string options                    |
| `valueIsValueWithRelation`  | Value is polymorphic relationship | Handle polymorphic relationships         |
```

--------------------------------------------------------------------------------

---[FILE: fields.md]---
Location: payload-main/templates/website/.cursor/rules/fields.md

```text
---
title: Fields
description: Field types, patterns, and configurations
tags: [payload, fields, validation, conditional]
---

# Payload CMS Fields

## Common Field Patterns

```typescript
// Auto-generate slugs
import { slugField } from 'payload'
slugField({ fieldToUse: 'title' })

// Relationship with filtering
{
  name: 'category',
  type: 'relationship',
  relationTo: 'categories',
  filterOptions: { active: { equals: true } },
}

// Conditional field
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  admin: {
    condition: (data) => data.featured === true,
  },
}

// Virtual field
{
  name: 'fullName',
  type: 'text',
  virtual: true,
  hooks: {
    afterRead: [({ siblingData }) => `${siblingData.firstName} ${siblingData.lastName}`],
  },
}
```

## Field Types

### Text Field

```typescript
{
  name: 'title',
  type: 'text',
  required: true,
  unique: true,
  minLength: 5,
  maxLength: 100,
  index: true,
  localized: true,
  defaultValue: 'Default Title',
  validate: (value) => Boolean(value) || 'Required',
  admin: {
    placeholder: 'Enter title...',
    position: 'sidebar',
    condition: (data) => data.showTitle === true,
  },
}
```

### Rich Text (Lexical)

```typescript
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { HeadingFeature, LinkFeature } from '@payloadcms/richtext-lexical'

{
  name: 'content',
  type: 'richText',
  required: true,
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      HeadingFeature({
        enabledHeadingSizes: ['h1', 'h2', 'h3'],
      }),
      LinkFeature({
        enabledCollections: ['posts', 'pages'],
      }),
    ],
  }),
}
```

### Relationship

```typescript
// Single relationship
{
  name: 'author',
  type: 'relationship',
  relationTo: 'users',
  required: true,
  maxDepth: 2,
}

// Multiple relationships (hasMany)
{
  name: 'categories',
  type: 'relationship',
  relationTo: 'categories',
  hasMany: true,
  filterOptions: {
    active: { equals: true },
  },
}

// Polymorphic relationship
{
  name: 'relatedContent',
  type: 'relationship',
  relationTo: ['posts', 'pages'],
  hasMany: true,
}
```

### Array

```typescript
{
  name: 'slides',
  type: 'array',
  minRows: 2,
  maxRows: 10,
  labels: {
    singular: 'Slide',
    plural: 'Slides',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  admin: {
    initCollapsed: true,
  },
}
```

### Blocks

```typescript
import type { Block } from 'payload'

const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

const ContentBlock: Block = {
  slug: 'content',
  fields: [
    {
      name: 'text',
      type: 'richText',
    },
  ],
}

{
  name: 'layout',
  type: 'blocks',
  blocks: [HeroBlock, ContentBlock],
}
```

### Select

```typescript
{
  name: 'status',
  type: 'select',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
  defaultValue: 'draft',
  required: true,
}

// Multiple select
{
  name: 'tags',
  type: 'select',
  hasMany: true,
  options: ['tech', 'news', 'sports'],
}
```

### Upload

```typescript
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  required: true,
  filterOptions: {
    mimeType: { contains: 'image' },
  },
}
```

### Point (Geolocation)

```typescript
{
  name: 'location',
  type: 'point',
  label: 'Location',
  required: true,
}

// Query by distance
const nearbyLocations = await payload.find({
  collection: 'stores',
  where: {
    location: {
      near: [10, 20], // [longitude, latitude]
      maxDistance: 5000, // in meters
      minDistance: 1000,
    },
  },
})
```

### Join Fields (Reverse Relationships)

```typescript
// From Users collection - show user's orders
{
  name: 'orders',
  type: 'join',
  collection: 'orders',
  on: 'customer', // The field in 'orders' that references this user
}
```

### Tabs & Groups

```typescript
// Tabs
{
  type: 'tabs',
  tabs: [
    {
      label: 'Content',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'body', type: 'richText' },
      ],
    },
    {
      label: 'SEO',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
  ],
}

// Group (named)
{
  name: 'meta',
  type: 'group',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
  ],
}
```

## Validation

```typescript
{
  name: 'email',
  type: 'email',
  validate: (value, { operation, data, siblingData }) => {
    if (operation === 'create' && !value) {
      return 'Email is required'
    }
    if (value && !value.includes('@')) {
      return 'Invalid email format'
    }
    return true
  },
}
```
```

--------------------------------------------------------------------------------

---[FILE: hooks.md]---
Location: payload-main/templates/website/.cursor/rules/hooks.md

```text
---
title: Hooks
description: Collection hooks, field hooks, and context patterns
tags: [payload, hooks, lifecycle, context]
---

# Payload CMS Hooks

## Collection Hooks

```typescript
export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    // Before validation - format data
    beforeValidate: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],

    // Before save - business logic
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (operation === 'update' && data.status === 'published') {
          data.publishedAt = new Date()
        }
        return data
      },
    ],

    // After save - side effects
    afterChange: [
      async ({ doc, req, operation, previousDoc, context }) => {
        // Check context to prevent loops
        if (context.skipNotification) return

        if (operation === 'create') {
          await sendNotification(doc)
        }
        return doc
      },
    ],

    // After read - computed fields
    afterRead: [
      async ({ doc, req }) => {
        doc.viewCount = await getViewCount(doc.id)
        return doc
      },
    ],

    // Before delete - cascading deletes
    beforeDelete: [
      async ({ req, id }) => {
        await req.payload.delete({
          collection: 'comments',
          where: { post: { equals: id } },
          req, // Important for transaction
        })
      },
    ],
  },
}
```

## Field Hooks

```typescript
import type { FieldHook } from 'payload'

const beforeValidateHook: FieldHook = ({ value }) => {
  return value.trim().toLowerCase()
}

const afterReadHook: FieldHook = ({ value, req }) => {
  // Hide email from non-admins
  if (!req.user?.roles?.includes('admin')) {
    return value.replace(/(.{2})(.*)(@.*)/, '$1***$3')
  }
  return value
}

{
  name: 'email',
  type: 'email',
  hooks: {
    beforeValidate: [beforeValidateHook],
    afterRead: [afterReadHook],
  },
}
```

## Hook Context

Share data between hooks or control hook behavior using request context:

```typescript
export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    beforeChange: [
      async ({ context }) => {
        context.expensiveData = await fetchExpensiveData()
      },
    ],
    afterChange: [
      async ({ context, doc }) => {
        // Reuse from previous hook
        await processData(doc, context.expensiveData)
      },
    ],
  },
}
```

## Next.js Revalidation Pattern

```typescript
import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidatePage: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
      payload.logger.info(`Revalidating page at path: ${path}`)
      revalidatePath(path)
    }

    // Revalidate old path if unpublished
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
      revalidatePath(oldPath)
    }
  }
  return doc
}
```

## Date Field Auto-Set

```typescript
{
  name: 'publishedOn',
  type: 'date',
  hooks: {
    beforeChange: [
      ({ siblingData, value }) => {
        if (siblingData._status === 'published' && !value) {
          return new Date()
        }
        return value
      },
    ],
  },
}
```

## Best Practices

- Use `beforeValidate` for data formatting
- Use `beforeChange` for business logic
- Use `afterChange` for side effects
- Use `afterRead` for computed fields
- Store expensive operations in `context`
- Pass `req` to nested operations for transaction safety
- Use context flags to prevent infinite loops
```

--------------------------------------------------------------------------------

---[FILE: payload-overview.md]---
Location: payload-main/templates/website/.cursor/rules/payload-overview.md

```text
---
title: Payload CMS Overview
description: Core principles and quick reference for Payload CMS development
tags: [payload, overview, quickstart]
---

# Payload CMS Development Rules

You are an expert Payload CMS developer. When working with Payload projects, follow these rules:

## Core Principles

1. **TypeScript-First**: Always use TypeScript with proper types from Payload
2. **Security-Critical**: Follow all security patterns, especially access control
3. **Type Generation**: Run `generate:types` script after schema changes
4. **Transaction Safety**: Always pass `req` to nested operations in hooks
5. **Access Control**: Understand Local API bypasses access control by default

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Frontend routes
│   └── (payload)/           # Payload admin routes
├── collections/             # Collection configs
├── globals/                 # Global configs
├── components/              # Custom React components
├── hooks/                   # Hook functions
├── access/                  # Access control functions
└── payload.config.ts        # Main config
```

## Minimal Config Pattern

```typescript
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
```

## Getting Payload Instance

```typescript
// In API routes (Next.js)
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
  })

  return Response.json(posts)
}

// In Server Components
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function Page() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'posts' })

  return <div>{docs.map(post => <h1 key={post.id}>{post.title}</h1>)}</div>
}
```

## Quick Reference

| Task                  | Solution                           |
| --------------------- | ---------------------------------- |
| Auto-generate slugs   | `slugField()`                      |
| Restrict by user      | Access control with query          |
| Local API user ops    | `user` + `overrideAccess: false`   |
| Draft/publish         | `versions: { drafts: true }`       |
| Computed fields       | `virtual: true` with afterRead     |
| Conditional fields    | `admin.condition`                  |
| Custom validation     | `validate` function                |
| Filter relationships  | `filterOptions` on field           |
| Select fields         | `select` parameter                 |
| Auto-set dates        | beforeChange hook                  |
| Prevent loops         | `req.context` check                |
| Cascading deletes     | beforeDelete hook                  |
| Geospatial queries    | `point` field with `near`/`within` |
| Reverse relationships | `join` field type                  |
| Query relationships   | Nested property syntax             |
| Complex queries       | AND/OR logic                       |
| Transactions          | Pass `req` to operations           |
| Background jobs       | Jobs queue with tasks              |
| Custom routes         | Collection custom endpoints        |
| Cloud storage         | Storage adapter plugins            |
| Multi-language        | `localization` + `localized: true` |

## Resources

- Docs: https://payloadcms.com/docs
- LLM Context: https://payloadcms.com/llms-full.txt
- GitHub: https://github.com/payloadcms/payload
- Examples: https://github.com/payloadcms/payload/tree/main/examples
- Templates: https://github.com/payloadcms/payload/tree/main/templates
```

--------------------------------------------------------------------------------

---[FILE: plugin-development.md]---
Location: payload-main/templates/website/.cursor/rules/plugin-development.md

```text
---
title: Plugin Development
description: Creating Payload CMS plugins with TypeScript patterns
tags: [payload, plugins, architecture, patterns]
---

# Payload Plugin Development

## Plugin Architecture

Plugins are functions that receive configuration options and return a function that transforms the Payload config:

```typescript
import type { Config, Plugin } from 'payload'

interface MyPluginConfig {
  enabled?: boolean
  collections?: string[]
}

export const myPlugin =
  (options: MyPluginConfig): Plugin =>
  (config: Config): Config => ({
    ...config,
    // Transform config here
  })
```

**Key Pattern:** Double arrow function (currying)

- First function: Accepts plugin options, returns plugin function
- Second function: Accepts Payload config, returns modified config

## Adding Fields to Collections

```typescript
export const seoPlugin =
  (options: { collections?: string[] }): Plugin =>
  (config: Config): Config => {
    const seoFields: Field[] = [
      {
        name: 'meta',
        type: 'group',
        fields: [
          { name: 'title', type: 'text' },
          { name: 'description', type: 'textarea' },
        ],
      },
    ]

    return {
      ...config,
      collections: config.collections?.map((collection) => {
        if (options.collections?.includes(collection.slug)) {
          return {
            ...collection,
            fields: [...(collection.fields || []), ...seoFields],
          }
        }
        return collection
      }),
    }
  }
```

## Adding New Collections

```typescript
export const redirectsPlugin =
  (options: { overrides?: Partial<CollectionConfig> }): Plugin =>
  (config: Config): Config => {
    const redirectsCollection: CollectionConfig = {
      slug: 'redirects',
      access: { read: () => true },
      fields: [
        { name: 'from', type: 'text', required: true, unique: true },
        { name: 'to', type: 'text', required: true },
      ],
      ...options.overrides,
    }

    return {
      ...config,
      collections: [...(config.collections || []), redirectsCollection],
    }
  }
```

## Adding Hooks

```typescript
const resaveChildrenHook: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === 'update') {
    const children = await req.payload.find({
      collection: 'pages',
      where: { parent: { equals: doc.id } },
    })

    for (const child of children.docs) {
      await req.payload.update({
        collection: 'pages',
        id: child.id,
        data: child,
      })
    }
  }
  return doc
}

export const nestedDocsPlugin =
  (options: { collections: string[] }): Plugin =>
  (config: Config): Config => ({
    ...config,
    collections: (config.collections || []).map((collection) => {
      if (options.collections.includes(collection.slug)) {
        return {
          ...collection,
          hooks: {
            ...(collection.hooks || {}),
            afterChange: [resaveChildrenHook, ...(collection.hooks?.afterChange || [])],
          },
        }
      }
      return collection
    }),
  })
```

## Adding Root-Level Endpoints

```typescript
export const seoPlugin =
  (options: { generateTitle?: (doc: any) => string }): Plugin =>
  (config: Config): Config => {
    const generateTitleEndpoint: Endpoint = {
      path: '/plugin-seo/generate-title',
      method: 'post',
      handler: async (req) => {
        const data = await req.json?.()
        const result = options.generateTitle ? options.generateTitle(data.doc) : ''
        return Response.json({ result })
      },
    }

    return {
      ...config,
      endpoints: [...(config.endpoints ?? []), generateTitleEndpoint],
    }
  }
```

## Field Overrides with Defaults

```typescript
type FieldsOverride = (args: { defaultFields: Field[] }) => Field[]

interface PluginConfig {
  collections?: string[]
  fields?: FieldsOverride
}

export const myPlugin =
  (options: PluginConfig): Plugin =>
  (config: Config): Config => {
    const defaultFields: Field[] = [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
    ]

    const fields =
      options.fields && typeof options.fields === 'function'
        ? options.fields({ defaultFields })
        : defaultFields

    return {
      ...config,
      collections: config.collections?.map((collection) => {
        if (options.collections?.includes(collection.slug)) {
          return {
            ...collection,
            fields: [...(collection.fields || []), ...fields],
          }
        }
        return collection
      }),
    }
  }
```

## Disable Plugin Pattern

```typescript
interface PluginConfig {
  disabled?: boolean
  collections?: string[]
}

export const myPlugin =
  (options: PluginConfig): Plugin =>
  (config: Config): Config => {
    // Always add collections/fields for database schema consistency
    if (!config.collections) {
      config.collections = []
    }

    config.collections.push({
      slug: 'plugin-collection',
      fields: [{ name: 'title', type: 'text' }],
    })

    // If disabled, return early but keep schema changes
    if (options.disabled) {
      return config
    }

    // Add endpoints, hooks, components only when enabled
    config.endpoints = [
      ...(config.endpoints ?? []),
      {
        path: '/my-endpoint',
        method: 'get',
        handler: async () => Response.json({ message: 'Hello' }),
      },
    ]

    return config
  }
```

## Admin Components

```typescript
export const myPlugin =
  (options: PluginConfig): Plugin =>
  (config: Config): Config => {
    if (!config.admin) config.admin = {}
    if (!config.admin.components) config.admin.components = {}
    if (!config.admin.components.beforeDashboard) {
      config.admin.components.beforeDashboard = []
    }

    // Add client component
    config.admin.components.beforeDashboard.push('my-plugin-name/client#BeforeDashboardClient')

    // Add server component (RSC)
    config.admin.components.beforeDashboard.push('my-plugin-name/rsc#BeforeDashboardServer')

    return config
  }
```

## onInit Hook

```typescript
export const myPlugin =
  (options: PluginConfig): Plugin =>
  (config: Config): Config => {
    const incomingOnInit = config.onInit

    config.onInit = async (payload) => {
      // IMPORTANT: Call existing onInit first
      if (incomingOnInit) await incomingOnInit(payload)

      // Plugin initialization
      payload.logger.info('Plugin initialized')

      // Example: Seed data
      const { totalDocs } = await payload.count({
        collection: 'plugin-collection',
        where: { id: { equals: 'seeded-by-plugin' } },
      })

      if (totalDocs === 0) {
        await payload.create({
          collection: 'plugin-collection',
          data: { id: 'seeded-by-plugin' },
        })
      }
    }

    return config
  }
```

## Best Practices

### Preserve Existing Config

```typescript
// ✅ Good
collections: [...(config.collections || []), newCollection]

// ❌ Bad
collections: [newCollection]
```

### Respect User Overrides

```typescript
const collection: CollectionConfig = {
  slug: 'redirects',
  fields: defaultFields,
  ...options.overrides, // User overrides last
}
```

### Hook Composition

```typescript
hooks: {
  ...collection.hooks,
  afterChange: [
    myHook,
    ...(collection.hooks?.afterChange || []),
  ],
}
```

### Type Safety

```typescript
import type { Config, Plugin, CollectionConfig, Field } from 'payload'
```
```

--------------------------------------------------------------------------------

---[FILE: queries.md]---
Location: payload-main/templates/website/.cursor/rules/queries.md

```text
---
title: Queries
description: Local API, REST, and GraphQL query patterns
tags: [payload, queries, local-api, rest, graphql]
---

# Payload CMS Queries

## Query Operators

```typescript
// Equals
{ color: { equals: 'blue' } }

// Not equals
{ status: { not_equals: 'draft' } }

// Greater/less than
{ price: { greater_than: 100 } }
{ age: { less_than_equal: 65 } }

// Contains (case-insensitive)
{ title: { contains: 'payload' } }

// Like (all words present)
{ description: { like: 'cms headless' } }

// In/not in
{ category: { in: ['tech', 'news'] } }

// Exists
{ image: { exists: true } }

// Near (point fields)
{ location: { near: [10, 20, 5000] } } // [lng, lat, maxDistance]
```

## AND/OR Logic

```typescript
{
  or: [
    { color: { equals: 'mint' } },
    {
      and: [
        { color: { equals: 'white' } },
        { featured: { equals: false } },
      ],
    },
  ],
}
```

## Nested Properties

```typescript
{
  'author.role': { equals: 'editor' },
  'meta.featured': { exists: true },
}
```

## Local API

```typescript
// Find documents
const posts = await payload.find({
  collection: 'posts',
  where: {
    status: { equals: 'published' },
    'author.name': { contains: 'john' },
  },
  depth: 2, // Populate relationships
  limit: 10,
  page: 1,
  sort: '-createdAt',
  locale: 'en',
  select: {
    title: true,
    author: true,
  },
})

// Find by ID
const post = await payload.findByID({
  collection: 'posts',
  id: '123',
  depth: 2,
})

// Create
const post = await payload.create({
  collection: 'posts',
  data: {
    title: 'New Post',
    status: 'draft',
  },
})

// Update
await payload.update({
  collection: 'posts',
  id: '123',
  data: {
    status: 'published',
  },
})

// Delete
await payload.delete({
  collection: 'posts',
  id: '123',
})

// Count
const count = await payload.count({
  collection: 'posts',
  where: {
    status: { equals: 'published' },
  },
})
```

## Access Control in Local API

**CRITICAL**: Local API bypasses access control by default (`overrideAccess: true`).

```typescript
// ❌ WRONG: User is passed but access control is bypassed
const posts = await payload.find({
  collection: 'posts',
  user: currentUser,
  // Result: Operation runs with ADMIN privileges
})

// ✅ CORRECT: Respects user's access control permissions
const posts = await payload.find({
  collection: 'posts',
  user: currentUser,
  overrideAccess: false, // Required to enforce access control
})

// Administrative operation (intentionally bypass access control)
const allPosts = await payload.find({
  collection: 'posts',
  // No user parameter, overrideAccess defaults to true
})
```

**When to use `overrideAccess: false`:**

- Performing operations on behalf of a user
- Testing access control logic
- API routes that should respect user permissions

## REST API

```typescript
import { stringify } from 'qs-esm'

const query = {
  status: { equals: 'published' },
}

const queryString = stringify(
  {
    where: query,
    depth: 2,
    limit: 10,
  },
  { addQueryPrefix: true },
)

const response = await fetch(`https://api.example.com/api/posts${queryString}`)
const data = await response.json()
```

### REST Endpoints

```
GET    /api/{collection}           - Find documents
GET    /api/{collection}/{id}      - Find by ID
POST   /api/{collection}           - Create
PATCH  /api/{collection}/{id}      - Update
DELETE /api/{collection}/{id}      - Delete
GET    /api/{collection}/count     - Count documents

GET    /api/globals/{slug}         - Get global
POST   /api/globals/{slug}         - Update global
```

## GraphQL

```graphql
query {
  Posts(where: { status: { equals: published } }, limit: 10, sort: "-createdAt") {
    docs {
      id
      title
      author {
        name
      }
    }
    totalDocs
    hasNextPage
  }
}

mutation {
  createPost(data: { title: "New Post", status: draft }) {
    id
    title
  }
}
```

## Performance Best Practices

- Set `maxDepth` on relationships to prevent over-fetching
- Use `select` to limit returned fields
- Index frequently queried fields
- Use `virtual` fields for computed data
- Cache expensive operations in hook `context`
```

--------------------------------------------------------------------------------

---[FILE: security-critical.mdc]---
Location: payload-main/templates/website/.cursor/rules/security-critical.mdc

```text
---
title: Critical Security Patterns
description: The three most important security patterns in Payload CMS
tags: [payload, security, critical, access-control, transactions, hooks]
priority: high
---

# CRITICAL SECURITY PATTERNS

These are the three most critical security patterns that MUST be followed in every Payload CMS project.

## 1. Local API Access Control (MOST IMPORTANT)

**By default, Local API operations bypass ALL access control**, even when passing a user.

```typescript
// ❌ SECURITY BUG: Passes user but ignores their permissions
await payload.find({
  collection: 'posts',
  user: someUser, // Access control is BYPASSED!
})

// ✅ SECURE: Actually enforces the user's permissions
await payload.find({
  collection: 'posts',
  user: someUser,
  overrideAccess: false, // REQUIRED for access control
})

// ✅ Administrative operation (intentional bypass)
await payload.find({
  collection: 'posts',
  // No user, overrideAccess defaults to true
})
```

**When to use each:**

- `overrideAccess: true` (default) - Server-side operations you trust (cron jobs, system tasks)
- `overrideAccess: false` - When operating on behalf of a user (API routes, webhooks)

**Rule**: When passing `user` to Local API, ALWAYS set `overrideAccess: false`

## 2. Transaction Safety in Hooks

**Nested operations in hooks without `req` break transaction atomicity.**

```typescript
// ❌ DATA CORRUPTION RISK: Separate transaction
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.create({
        collection: 'audit-log',
        data: { docId: doc.id },
        // Missing req - runs in separate transaction!
      })
    },
  ]
}

// ✅ ATOMIC: Same transaction
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.create({
        collection: 'audit-log',
        data: { docId: doc.id },
        req, // Maintains atomicity
      })
    },
  ]
}
```

**Why This Matters:**

- **MongoDB (with replica sets)**: Creates atomic session across operations
- **PostgreSQL**: All operations use same Drizzle transaction
- **SQLite (with transactions enabled)**: Ensures rollback on errors
- **Without req**: Each operation runs independently, breaking atomicity

**Rule**: ALWAYS pass `req` to nested operations in hooks

## 3. Prevent Infinite Hook Loops

**Hooks triggering operations that trigger the same hooks create infinite loops.**

```typescript
// ❌ INFINITE LOOP
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.update({
        collection: 'posts',
        id: doc.id,
        data: { views: doc.views + 1 },
        req,
      }) // Triggers afterChange again!
    },
  ]
}

// ✅ SAFE: Use context flag
hooks: {
  afterChange: [
    async ({ doc, req, context }) => {
      if (context.skipHooks) return

      await req.payload.update({
        collection: 'posts',
        id: doc.id,
        data: { views: doc.views + 1 },
        context: { skipHooks: true },
        req,
      })
    },
  ]
}
```

**Rule**: Use `req.context` flags to prevent hook loops
```

--------------------------------------------------------------------------------

---[FILE: extensions.json]---
Location: payload-main/templates/website/.vscode/extensions.json

```json
{
  "recommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
}
```

--------------------------------------------------------------------------------

---[FILE: launch.json]---
Location: payload-main/templates/website/.vscode/launch.json
Signals: Next.js

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "action": "debugWithChrome",
        "killOnServerStop": true,
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "webRoot": "${workspaceFolder}"
      },
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: settings.json]---
Location: payload-main/templates/website/.vscode/settings.json

```json
{
  "npm.packageManager": "pnpm",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "editor.formatOnSaveMode": "file",
  "typescript.tsdk": "node_modules/typescript/lib",
  "[javascript][typescript][typescriptreact]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  }
}
```

--------------------------------------------------------------------------------

````
