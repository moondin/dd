---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 422
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 422 of 695)

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

---[FILE: components.md]---
Location: payload-main/templates/blank/.cursor/rules/components.md

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
Location: payload-main/templates/blank/.cursor/rules/endpoints.md

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

---[FILE: field-type-guards.md]---
Location: payload-main/templates/blank/.cursor/rules/field-type-guards.md

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
Location: payload-main/templates/blank/.cursor/rules/fields.md

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
Location: payload-main/templates/blank/.cursor/rules/hooks.md

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

````
