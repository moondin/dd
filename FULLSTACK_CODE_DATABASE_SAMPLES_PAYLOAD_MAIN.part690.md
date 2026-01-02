---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 690
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 690 of 695)

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

---[FILE: COLLECTIONS.md]---
Location: payload-main/tools/claude-plugin/skills/payload/reference/COLLECTIONS.md

```text
# Payload CMS Collections Reference

Complete reference for collection configurations and patterns.

## Basic Collection

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'createdAt'],
    group: 'Content', // Organize in admin sidebar
    description: 'Blog posts and articles',
    listSearchableFields: ['title', 'slug'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
    },
  ],
  defaultSort: '-createdAt',
  timestamps: true,
}
```

## Auth Collection

```ts
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: true,
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
      required: true,
      defaultValue: ['user'],
      saveToJWT: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
```

## Upload Collection

```ts
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
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
  ],
}
```

## Live Preview

Enable real-time content preview during editing.

```ts
import type { CollectionConfig } from 'payload'

const generatePreviewPath = ({
  slug,
  collection,
  req,
}: {
  slug: string
  collection: string
  req: any
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
  return `${baseUrl}/api/preview?slug=${slug}&collection=${collection}`
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    // Live preview during editing
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug as string,
          collection: 'pages',
          req,
        }),
    },
    // Static preview button
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
  },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'slug', type: 'text' },
  ],
}
```

## Versioning & Drafts

Payload maintains version history and supports draft/publish workflows.

```ts
import type { CollectionConfig } from 'payload'

// Basic versioning (audit log only)
export const Users: CollectionConfig = {
  slug: 'users',
  versions: true, // or { maxPerDoc: 100 }
  fields: [{ name: 'name', type: 'text' }],
}

// Drafts enabled (draft/publish workflow)
export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: {
    drafts: true, // Enables _status field
    maxPerDoc: 50,
  },
  fields: [{ name: 'title', type: 'text' }],
}

// Full configuration with autosave and scheduled publish
export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: {
    drafts: {
      autosave: true, // Auto-save while editing
      schedulePublish: true, // Schedule future publish/unpublish
      validate: false, // Don't validate drafts (default)
    },
    maxPerDoc: 100, // Keep last 100 versions (0 = unlimited)
  },
  fields: [{ name: 'title', type: 'text' }],
}
```

### Draft API Usage

```ts
// Create draft
await payload.create({
  collection: 'posts',
  data: { title: 'Draft Post' },
  draft: true, // Saves as draft, skips required field validation
})

// Update as draft
await payload.update({
  collection: 'posts',
  id: '123',
  data: { title: 'Updated Draft' },
  draft: true,
})

// Read with drafts (returns newest draft if available)
const post = await payload.findByID({
  collection: 'posts',
  id: '123',
  draft: true, // Returns draft version if exists
})

// Query only published (REST API)
// GET /api/posts (returns only _status: 'published')

// Access control for drafts
export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: { drafts: true },
  access: {
    read: ({ req: { user } }) => {
      // Public can only see published
      if (!user) return { _status: { equals: 'published' } }
      // Authenticated can see all
      return true
    },
  },
  fields: [{ name: 'title', type: 'text' }],
}
```

### Document Status

The `_status` field is auto-injected when drafts are enabled:

- `draft` - Never published
- `published` - Published with no newer drafts
- `changed` - Published but has newer unpublished drafts

## Globals

Globals are single-instance documents (not collections).

```ts
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

---[FILE: ENDPOINTS.md]---
Location: payload-main/tools/claude-plugin/skills/payload/reference/ENDPOINTS.md

```text
# Payload Custom API Endpoints Reference

Custom REST API endpoints extend Payload's auto-generated CRUD operations with custom logic, authentication flows, webhooks, and integrations.

## Quick Reference

### Endpoint Configuration

| Property  | Type                                              | Description                                                     |
| --------- | ------------------------------------------------- | --------------------------------------------------------------- |
| `path`    | `string`                                          | Route path after collection/global slug (e.g., `/:id/tracking`) |
| `method`  | `'get' \| 'post' \| 'put' \| 'patch' \| 'delete'` | HTTP method (lowercase)                                         |
| `handler` | `(req: PayloadRequest) => Promise<Response>`      | Async function returning Web API Response                       |
| `custom`  | `Record<string, any>`                             | Extension point for plugins/metadata                            |

### Request Context

| Property          | Type                    | Description                                            |
| ----------------- | ----------------------- | ------------------------------------------------------ |
| `req.user`        | `User \| null`          | Authenticated user (null if not authenticated)         |
| `req.payload`     | `Payload`               | Payload instance for operations (find, create...)      |
| `req.routeParams` | `Record<string, any>`   | Path parameters (e.g., `:id`)                          |
| `req.url`         | `string`                | Full request URL                                       |
| `req.method`      | `string`                | HTTP method                                            |
| `req.headers`     | `Headers`               | Request headers                                        |
| `req.json()`      | `() => Promise<any>`    | Parse JSON body                                        |
| `req.text()`      | `() => Promise<string>` | Read body as text                                      |
| `req.data`        | `any`                   | Parsed body (after `addDataAndFileToRequest()`)        |
| `req.file`        | `File`                  | Uploaded file (after `addDataAndFileToRequest()`)      |
| `req.locale`      | `string`                | Request locale (after `addLocalesToRequestFromData()`) |
| `req.i18n`        | `I18n`                  | i18n instance                                          |
| `req.t`           | `TFunction`             | Translation function                                   |

## Common Patterns

### Authentication Check

Custom endpoints are **not authenticated by default**. Check `req.user` to enforce authentication.

```ts
import { APIError } from 'payload'

export const authenticatedEndpoint = {
  path: '/protected',
  method: 'get',
  handler: async (req) => {
    if (!req.user) {
      throw new APIError('Unauthorized', 401)
    }

    // User is authenticated
    return Response.json({ message: 'Access granted' })
  },
}
```

### Using Payload Operations

Use `req.payload` for database operations with access control and hooks.

```ts
export const getRelatedPosts = {
  path: '/:id/related',
  method: 'get',
  handler: async (req) => {
    const { id } = req.routeParams

    // Find related posts
    const posts = await req.payload.find({
      collection: 'posts',
      where: {
        category: {
          equals: id,
        },
      },
      limit: 5,
      sort: '-createdAt',
    })

    return Response.json(posts)
  },
}
```

### Route Parameters

Access path parameters via `req.routeParams`.

```ts
export const getTrackingEndpoint = {
  path: '/:id/tracking',
  method: 'get',
  handler: async (req) => {
    const orderId = req.routeParams.id

    const tracking = await getTrackingInfo(orderId)

    if (!tracking) {
      return Response.json({ error: 'not found' }, { status: 404 })
    }

    return Response.json(tracking)
  },
}
```

### Request Body Handling

**Option 1: Manual JSON parsing**

```ts
export const createEndpoint = {
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
```

**Option 2: Using helper (handles JSON + files)**

```ts
import { addDataAndFileToRequest } from 'payload'

export const uploadEndpoint = {
  path: '/upload',
  method: 'post',
  handler: async (req) => {
    await addDataAndFileToRequest(req)

    // req.data now contains parsed body
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

### CORS Headers

Use `headersWithCors` helper to apply config CORS settings.

```ts
import { headersWithCors } from 'payload'

export const corsEndpoint = {
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

### Error Handling

Throw `APIError` with status codes for proper error responses.

```ts
import { APIError } from 'payload'

export const validateEndpoint = {
  path: '/validate',
  method: 'post',
  handler: async (req) => {
    const data = await req.json()

    if (!data.email) {
      throw new APIError('Email is required', 400)
    }

    // Validation passed
    return Response.json({ valid: true })
  },
}
```

### Query Parameters

Extract query params from URL.

```ts
export const searchEndpoint = {
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

## Helper Functions

### addDataAndFileToRequest

Parses request body and attaches to `req.data` and `req.file`.

```ts
import { addDataAndFileToRequest } from 'payload'

export const endpoint = {
  path: '/process',
  method: 'post',
  handler: async (req) => {
    await addDataAndFileToRequest(req)

    // req.data: parsed JSON or form data
    // req.file: uploaded file (if multipart)

    console.log(req.data) // { title: 'My Post' }
    console.log(req.file) // File object or undefined
  },
}
```

**Handles:**

- JSON bodies (`Content-Type: application/json`)
- Form data (`Content-Type: multipart/form-data`)
- File uploads

### addLocalesToRequestFromData

Extracts locale from request data and validates against config.

```ts
import { addLocalesToRequestFromData } from 'payload'

export const endpoint = {
  path: '/translate',
  method: 'post',
  handler: async (req) => {
    await addLocalesToRequestFromData(req)

    // req.locale: validated locale string
    // req.fallbackLocale: fallback locale string

    const result = await req.payload.find({
      collection: 'posts',
      locale: req.locale,
    })

    return Response.json(result)
  },
}
```

### headersWithCors

Applies CORS headers from Payload config.

```ts
import { headersWithCors } from 'payload'

export const endpoint = {
  path: '/data',
  method: 'get',
  handler: async (req) => {
    const data = { message: 'Hello' }

    return Response.json(data, {
      headers: headersWithCors({
        headers: new Headers({
          'Cache-Control': 'public, max-age=3600',
        }),
        req,
      }),
    })
  },
}
```

## Real-World Examples

### Multi-Tenant Login Endpoint

From `examples/multi-tenant`:

```ts
import { APIError, generatePayloadCookie, headersWithCors } from 'payload'

export const externalUsersLogin = {
  path: '/login-external',
  method: 'post',
  handler: async (req) => {
    const { email, password, tenant } = await req.json()

    if (!email || !password || !tenant) {
      throw new APIError('Missing credentials', 400)
    }

    // Find user with tenant constraint
    const userQuery = await req.payload.find({
      collection: 'users',
      where: {
        and: [
          { email: { equals: email } },
          {
            or: [{ tenants: { equals: tenant } }, { 'tenants.tenant': { equals: tenant } }],
          },
        ],
      },
    })

    if (!userQuery.docs.length) {
      throw new APIError('Invalid credentials', 401)
    }

    // Authenticate user
    const result = await req.payload.login({
      collection: 'users',
      data: { email, password },
    })

    return Response.json(result, {
      headers: headersWithCors({
        headers: new Headers({
          'Set-Cookie': generatePayloadCookie({
            collectionAuthConfig: req.payload.config.collections.find((c) => c.slug === 'users')
              .auth,
            cookiePrefix: req.payload.config.cookiePrefix,
            token: result.token,
          }),
        }),
        req,
      }),
    })
  },
}
```

### Webhook Handler (Stripe)

From `packages/plugin-ecommerce`:

```ts
export const webhookEndpoint = {
  path: '/webhooks',
  method: 'post',
  handler: async (req) => {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    try {
      const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

      // Process event
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentSuccess(req.payload, event.data.object)
          break
        case 'payment_intent.failed':
          await handlePaymentFailure(req.payload, event.data.object)
          break
      }

      return Response.json({ received: true })
    } catch (err) {
      req.payload.logger.error(`Webhook error: ${err.message}`)
      return Response.json({ error: err.message }, { status: 400 })
    }
  },
}
```

### Data Preview Endpoint

From `packages/plugin-import-export`:

```ts
import { addDataAndFileToRequest } from 'payload'

export const previewEndpoint = {
  path: '/preview',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      throw new APIError('Unauthorized', 401)
    }

    await addDataAndFileToRequest(req)

    const { collection, where, limit = 10 } = req.data

    // Validate collection exists
    const collectionConfig = req.payload.config.collections.find((c) => c.slug === collection)
    if (!collectionConfig) {
      throw new APIError('Collection not found', 404)
    }

    // Preview data
    const results = await req.payload.find({
      collection,
      where,
      limit,
      depth: 0,
    })

    return Response.json({
      docs: results.docs,
      totalDocs: results.totalDocs,
      fields: collectionConfig.fields,
    })
  },
}
```

### Reindex Action Endpoint

From `packages/plugin-search`:

```ts
export const reindexEndpoint = (pluginConfig) => ({
  path: '/reindex',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      throw new APIError('Unauthorized', 401)
    }

    const { collection } = req.routeParams

    // Reindex collection
    const result = await reindexCollection(req.payload, collection, pluginConfig)

    return Response.json({
      message: `Reindexed ${result.count} documents`,
      count: result.count,
    })
  },
})
```

## Endpoint Placement

### Collection Endpoints

Mounted at `/api/{collection-slug}/{path}`.

```ts
import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  fields: [
    /* ... */
  ],
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

```ts
import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  fields: [
    /* ... */
  ],
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

## Advanced Patterns

### Factory Functions

Create reusable endpoint factories for plugins.

```ts
export const createWebhookEndpoint = (config) => ({
  path: '/webhook',
  method: 'post',
  handler: async (req) => {
    const signature = req.headers.get('x-webhook-signature')

    if (!verifySignature(signature, config.secret)) {
      throw new APIError('Invalid signature', 401)
    }

    const data = await req.json()
    await processWebhook(req.payload, data, config)

    return Response.json({ received: true })
  },
})
```

### Conditional Endpoints

Add endpoints based on config options.

```ts
export const MyCollection: CollectionConfig = {
  slug: 'posts',
  fields: [
    /* ... */
  ],
  endpoints: [
    // Always included
    {
      path: '/public',
      method: 'get',
      handler: async (req) => Response.json({ data: [] }),
    },
    // Conditionally included
    ...(process.env.ENABLE_ANALYTICS
      ? [
          {
            path: '/analytics',
            method: 'get',
            handler: async (req) => Response.json({ analytics: [] }),
          },
        ]
      : []),
  ],
}
```

### OpenAPI Documentation

Use `custom` property for API documentation metadata.

```ts
export const endpoint = {
  path: '/search',
  method: 'get',
  handler: async (req) => {
    // Handler implementation
  },
  custom: {
    openapi: {
      summary: 'Search posts',
      parameters: [
        {
          name: 'q',
          in: 'query',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'Search results',
          content: {
            'application/json': {
              schema: { type: 'array' },
            },
          },
        },
      },
    },
  },
}
```

## Best Practices

1. **Always check authentication** - Custom endpoints are not authenticated by default
2. **Use `req.payload` for operations** - Ensures access control and hooks execute
3. **Use helpers for common tasks** - `addDataAndFileToRequest`, `headersWithCors`, etc.
4. **Throw `APIError` for errors** - Provides consistent error responses
5. **Return Web API `Response`** - Use `Response.json()` for consistent responses
6. **Validate input** - Check required fields, validate types
7. **Handle CORS** - Use `headersWithCors` for cross-origin requests
8. **Log errors** - Use `req.payload.logger` for debugging
9. **Document with `custom`** - Add OpenAPI metadata for API docs
10. **Factory pattern for reuse** - Create endpoint factories for plugins

## Resources

- REST API Overview: <https://payloadcms.com/docs/rest-api/overview>
- Custom Endpoints: <https://payloadcms.com/docs/rest-api/overview#custom-endpoints>
- Access Control: <https://payloadcms.com/docs/access-control/overview>
- Local API: <https://payloadcms.com/docs/local-api/overview>
```

--------------------------------------------------------------------------------

---[FILE: FIELD-TYPE-GUARDS.md]---
Location: payload-main/tools/claude-plugin/skills/payload/reference/FIELD-TYPE-GUARDS.md

```text
# Payload Field Type Guards Reference

Complete reference with detailed examples and patterns. See [FIELDS.md](FIELDS.md#field-type-guards) for quick reference table of all guards.

## Structural Guards

### fieldHasSubFields

Checks if field contains nested fields (group, array, row, or collapsible).

```ts
import type { Field } from 'payload'
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

**Signature:**

```ts
fieldHasSubFields<TField extends ClientField | Field>(
  field: TField
): field is TField & (FieldWithSubFieldsClient | FieldWithSubFields)
```

**Common Pattern - Exclude Arrays:**

```ts
if (fieldHasSubFields(field) && !fieldIsArrayType(field)) {
  // Groups, rows, collapsibles only (not arrays)
}
```

### fieldIsArrayType

Checks if field type is `'array'`.

```ts
import { fieldIsArrayType } from 'payload'

if (fieldIsArrayType(field)) {
  // field.type === 'array'
  console.log(`Min rows: ${field.minRows}`)
  console.log(`Max rows: ${field.maxRows}`)
}
```

**Signature:**

```ts
fieldIsArrayType<TField extends ClientField | Field>(
  field: TField
): field is TField & (ArrayFieldClient | ArrayField)
```

### fieldIsBlockType

Checks if field type is `'blocks'`.

```ts
import { fieldIsBlockType } from 'payload'

if (fieldIsBlockType(field)) {
  // field.type === 'blocks'
  field.blocks.forEach((block) => {
    console.log(`Block: ${block.slug}`)
  })
}
```

**Signature:**

```ts
fieldIsBlockType<TField extends ClientField | Field>(
  field: TField
): field is TField & (BlocksFieldClient | BlocksField)
```

**Common Pattern - Distinguish Containers:**

```ts
if (fieldIsArrayType(field)) {
  // Handle array rows
} else if (fieldIsBlockType(field)) {
  // Handle block types
}
```

### fieldIsGroupType

Checks if field type is `'group'`.

```ts
import { fieldIsGroupType } from 'payload'

if (fieldIsGroupType(field)) {
  // field.type === 'group'
  console.log(`Interface: ${field.interfaceName}`)
}
```

**Signature:**

```ts
fieldIsGroupType<TField extends ClientField | Field>(
  field: TField
): field is TField & (GroupFieldClient | GroupField)
```

## Capability Guards

### fieldSupportsMany

Checks if field can have multiple values (select, relationship, or upload with `hasMany`).

```ts
import { fieldSupportsMany } from 'payload'

if (fieldSupportsMany(field)) {
  // field.type is 'select' | 'relationship' | 'upload'
  // Safe to check field.hasMany
  if (field.hasMany) {
    console.log('Field accepts multiple values')
  }
}
```

**Signature:**

```ts
fieldSupportsMany<TField extends ClientField | Field>(
  field: TField
): field is TField & (FieldWithManyClient | FieldWithMany)
```

### fieldHasMaxDepth

Checks if field is relationship/upload/join with numeric `maxDepth` property.

```ts
import { fieldHasMaxDepth } from 'payload'

if (fieldHasMaxDepth(field)) {
  // field.type is 'upload' | 'relationship' | 'join'
  // AND field.maxDepth is number
  const remainingDepth = field.maxDepth - currentDepth
}
```

**Signature:**

```ts
fieldHasMaxDepth<TField extends ClientField | Field>(
  field: TField
): field is TField & (FieldWithMaxDepthClient | FieldWithMaxDepth)
```

### fieldShouldBeLocalized

Checks if field needs localization handling (accounts for parent localization).

```ts
import { fieldShouldBeLocalized } from 'payload'

function processField(field: Field, parentIsLocalized: boolean) {
  if (fieldShouldBeLocalized({ field, parentIsLocalized })) {
    // Create locale-specific table or index
  }
}
```

**Signature:**

```ts
fieldShouldBeLocalized({
  field,
  parentIsLocalized,
}: {
  field: ClientField | ClientTab | Field | Tab
  parentIsLocalized: boolean
}): boolean
```

```ts
// Accounts for parent localization
if (fieldShouldBeLocalized({ field, parentIsLocalized: false })) {
  /* ... */
}
```

### fieldIsVirtual

Checks if field is virtual (computed or virtual relationship).

```ts
import { fieldIsVirtual } from 'payload'

if (fieldIsVirtual(field)) {
  // field.virtual is truthy
  if (typeof field.virtual === 'string') {
    // Virtual relationship path
    console.log(`Virtual path: ${field.virtual}`)
  } else {
    // Computed virtual field (uses hooks)
  }
}
```

**Signature:**

```ts
fieldIsVirtual(field: Field | Tab): boolean
```

## Data Guards

### fieldAffectsData

**Most commonly used guard.** Checks if field stores data (has name and is not UI-only).

```ts
import { fieldAffectsData } from 'payload'

function generateSchema(fields: Field[]) {
  fields.forEach((field) => {
    if (fieldAffectsData(field)) {
      // Safe to access field.name
      schema[field.name] = getFieldType(field)
    }
  })
}
```

**Signature:**

```ts
fieldAffectsData<TField extends ClientField | Field | TabAsField | TabAsFieldClient>(
  field: TField
): field is TField & (FieldAffectingDataClient | FieldAffectingData)
```

**Pattern - Data Fields Only:**

```ts
const dataFields = fields.filter(fieldAffectsData)
```

### fieldIsPresentationalOnly

Checks if field is UI-only (type `'ui'`).

```ts
import { fieldIsPresentationalOnly } from 'payload'

if (fieldIsPresentationalOnly(field)) {
  // field.type === 'ui'
  // Skip in data operations, GraphQL schema, etc.
  return
}
```

**Signature:**

```ts
fieldIsPresentationalOnly<TField extends ClientField | Field | TabAsField | TabAsFieldClient>(
  field: TField
): field is TField & (UIFieldClient | UIField)
```

### fieldIsID

Checks if field name is exactly `'id'`.

```ts
import { fieldIsID } from 'payload'

if (fieldIsID(field)) {
  // field.name === 'id'
  // Special handling for ID field
}
```

**Signature:**

```ts
fieldIsID<TField extends ClientField | Field>(
  field: TField
): field is { name: 'id' } & TField
```

### fieldIsHiddenOrDisabled

Checks if field is hidden or admin-disabled.

```ts
import { fieldIsHiddenOrDisabled } from 'payload'

const visibleFields = fields.filter((field) => !fieldIsHiddenOrDisabled(field))
```

**Signature:**

```ts
fieldIsHiddenOrDisabled<TField extends ClientField | Field | TabAsField | TabAsFieldClient>(
  field: TField
): field is { admin: { hidden: true } } & TField
```

## Layout Guards

### fieldIsSidebar

Checks if field is positioned in sidebar.

```ts
import { fieldIsSidebar } from 'payload'

const [mainFields, sidebarFields] = fields.reduce(
  ([main, sidebar], field) => {
    if (fieldIsSidebar(field)) {
      return [main, [...sidebar, field]]
    }
    return [[...main, field], sidebar]
  },
  [[], []],
)
```

**Signature:**

```ts
fieldIsSidebar<TField extends ClientField | Field | TabAsField | TabAsFieldClient>(
  field: TField
): field is { admin: { position: 'sidebar' } } & TField
```

## Tab & Group Guards

### tabHasName

Checks if tab is named (stores data under tab name).

```ts
import { tabHasName } from 'payload'

tabs.forEach((tab) => {
  if (tabHasName(tab)) {
    // tab.name exists
    dataPath.push(tab.name)
  }
  // Process tab.fields
})
```

**Signature:**

```ts
tabHasName<TField extends ClientTab | Tab>(
  tab: TField
): tab is NamedTab & TField
```

### groupHasName

Checks if group is named (stores data under group name).

```ts
import { groupHasName } from 'payload'

if (groupHasName(group)) {
  // group.name exists
  return data[group.name]
}
```

**Signature:**

```ts
groupHasName(group: Partial<NamedGroupFieldClient>): group is NamedGroupFieldClient
```

## Option & Value Guards

### optionIsObject

Checks if option is object format `{label, value}` vs string.

```ts
import { optionIsObject } from 'payload'

field.options.forEach((option) => {
  if (optionIsObject(option)) {
    console.log(`${option.label}: ${option.value}`)
  } else {
    console.log(option) // string value
  }
})
```

**Signature:**

```ts
optionIsObject(option: Option): option is OptionObject
```

### optionsAreObjects

Checks if entire options array contains objects.

```ts
import { optionsAreObjects } from 'payload'

if (optionsAreObjects(field.options)) {
  // All options are OptionObject[]
  const labels = field.options.map((opt) => opt.label)
}
```

**Signature:**

```ts
optionsAreObjects(options: Option[]): options is OptionObject[]
```

### optionIsValue

Checks if option is string value (not object).

```ts
import { optionIsValue } from 'payload'

if (optionIsValue(option)) {
  // option is string
  const value = option
}
```

**Signature:**

```ts
optionIsValue(option: Option): option is string
```

### valueIsValueWithRelation

Checks if relationship value is polymorphic format `{relationTo, value}`.

```ts
import { valueIsValueWithRelation } from 'payload'

if (valueIsValueWithRelation(fieldValue)) {
  // fieldValue.relationTo exists
  // fieldValue.value exists
  console.log(`Related to ${fieldValue.relationTo}: ${fieldValue.value}`)
}
```

**Signature:**

```ts
valueIsValueWithRelation(value: unknown): value is ValueWithRelation
```

## Common Patterns

### Recursive Field Traversal

```ts
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

```ts
import { fieldAffectsData, fieldIsPresentationalOnly, fieldIsHiddenOrDisabled } from 'payload'

const dataFields = fields.filter(
  (field) =>
    fieldAffectsData(field) && !fieldIsPresentationalOnly(field) && !fieldIsHiddenOrDisabled(field),
)
```

### Container Type Switching

```ts
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

```ts
import { fieldSupportsMany, fieldHasMaxDepth } from 'payload'

// Without guard - TypeScript error
// if (field.hasMany) { /* ... */ }

// With guard - safe access
if (fieldSupportsMany(field) && field.hasMany) {
  console.log('Multiple values supported')
}

if (fieldHasMaxDepth(field)) {
  const depth = field.maxDepth // TypeScript knows this is number
}
```

## Type Preservation

All guards preserve the original type constraint:

```ts
import type { ClientField, Field } from 'payload'
import { fieldHasSubFields } from 'payload'

function processServerField(field: Field) {
  if (fieldHasSubFields(field)) {
    // field is Field & FieldWithSubFields (not ClientField)
  }
}

function processClientField(field: ClientField) {
  if (fieldHasSubFields(field)) {
    // field is ClientField & FieldWithSubFieldsClient
  }
}
```
```

--------------------------------------------------------------------------------

````
