---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 477
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 477 of 695)

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

---[FILE: playwright.config.ts]---
Location: payload-main/templates/with-vercel-postgres/playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import 'dotenv/config'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    reuseExistingServer: true,
    url: 'http://localhost:3000',
  },
})
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/templates/with-vercel-postgres/README.md

```text
# Payload Blank Starter

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/payloadcms/payload/tree/main/templates/with-vercel-postgres&project-name=payload-project&env=PAYLOAD_SECRET&build-command=pnpm%20run%20ci&stores=%5B%7B%22type%22:%22postgres%22%7D,%7B%22type%22:%22blob%22%7D%5D)

This template comes configured with the bare minimum to get started on anything you need.

## Quick start

Click the 'Deploy' button above to spin up this template directly into Vercel hosting. It will first prompt you save this template into your own Github repo so that you own the code and can make any changes you want to it.

Set up the following services and secrets and then once the app has been built and deployed you will be able to visit your site at the generated URL.
From this point on you can access your admin panel at `/admin` of your app URL, create an admin user and then click the 'Seed the database' button in the dashboard to add content into your app.

### Services

This project uses the following services integrated into Vercel which you will need to click "Add" and "Connect" for:

Neon Database - Postgres-based cloud database used to host your data

Vercel Blob Storage - object storage used to host your files such as images and videos

The connection variables will automatically be setup for you on Vercel when these services are connected.

#### Secrets

You will be prompted to add the following secret values to your project. These should be long unguessable strong passwords, you can also use a password manager to generate one for these.

PAYLOAD_SECRET - used by Payload to sign secrets like JWT tokens

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
2. `cd my-project && cp .env.example .env` to copy the example environment variables. You'll need to add the `POSTGRES_URL` and `BLOB_READ_WRITE_TOKEN` from your Vercel project to your `.env` if you want to use Vercel Blob and the Neon database that was created for you.

   > _NOTE: If the connection string value includes `localhost` or `127.0.0.1`, the code will automatically use a normal postgres adapter instead of Vercel._. You can override this functionality by setting `forceUseVercelPostgres: true` if desired.

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local Postgres instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `POSTGRES_URL` in your `.env` file to `postgres://postgres@localhost:54320/<dbname>`
- Modify the `docker-compose.yml` file's `POSTGRES_DB` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

## Working with Postgres

Postgres and other SQL-based databases follow a strict schema for managing your data. In comparison to our MongoDB adapter, this means that there's a few extra steps to working with Postgres.

Note that often times when making big schema changes you can run the risk of losing data if you're not manually migrating it.

### Local development

Ideally we recommend running a local copy of your database so that schema updates are as fast as possible. By default the Postgres adapter has `push: true` for development environments. This will let you add, modify and remove fields and collections without needing to run any data migrations.

If your database is pointed to production you will want to set `push: false` otherwise you will risk losing data or having your migrations out of sync.

#### Migrations

[Migrations](https://payloadcms.com/docs/database/migrations) are essentially SQL code versions that keeps track of your schema. When deploy with Postgres you will need to make sure you create and then run your migrations.

Locally create a migration

```bash
pnpm payload migrate:create
```

This creates the migration files you will need to push alongside with your new configuration.

On the server after building and before running `pnpm start` you will want to run your migrations

```bash
pnpm payload migrate
```

This command will check for any migrations that have not yet been run and try to run them and it will keep a record of migrations that have been run in the database.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/templates/with-vercel-postgres/tsconfig.json
Signals: Next.js

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "lib": [
      "DOM",
      "DOM.Iterable",
      "ES2022"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@payload-config": [
        "./src/payload.config.ts"
      ]
    },
    "target": "ES2022",
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: vitest.config.mts]---
Location: payload-main/templates/with-vercel-postgres/vitest.config.mts

```text
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
  },
})
```

--------------------------------------------------------------------------------

---[FILE: vitest.setup.ts]---
Location: payload-main/templates/with-vercel-postgres/vitest.setup.ts

```typescript
// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'
```

--------------------------------------------------------------------------------

---[FILE: access-control-advanced.md]---
Location: payload-main/templates/with-vercel-postgres/.cursor/rules/access-control-advanced.md

```text
---
title: Access Control - Advanced Patterns
description: Context-aware, time-based, subscription-based access, factory functions, templates
tags: [payload, access-control, security, advanced, performance]
priority: high
---

# Advanced Access Control Patterns

Advanced access control patterns including context-aware access, time-based restrictions, factory functions, and production templates.

## Context-Aware Access Patterns

### Locale-Specific Access

```typescript
import type { Access } from 'payload'

export const localeSpecificAccess: Access = ({ req: { user, locale } }) => {
  // Authenticated users can access all locales
  if (user) return true

  // Public users can only access English content
  if (locale === 'en') return true

  return false
}
```

### Device-Specific Access

```typescript
export const mobileOnlyAccess: Access = ({ req: { headers } }) => {
  const userAgent = headers?.get('user-agent') || ''
  return /mobile|android|iphone/i.test(userAgent)
}

export const desktopOnlyAccess: Access = ({ req: { headers } }) => {
  const userAgent = headers?.get('user-agent') || ''
  return !/mobile|android|iphone/i.test(userAgent)
}
```

### IP-Based Access

```typescript
export const restrictedIpAccess = (allowedIps: string[]): Access => {
  return ({ req: { headers } }) => {
    const ip = headers?.get('x-forwarded-for') || headers?.get('x-real-ip')
    return allowedIps.includes(ip || '')
  }
}

// Usage
const internalIps = ['192.168.1.0/24', '10.0.0.5']

export const InternalDocs: CollectionConfig = {
  slug: 'internal-docs',
  access: {
    read: restrictedIpAccess(internalIps),
  },
}
```

## Time-Based Access Patterns

### Today's Records Only

```typescript
export const todayOnlyAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)

  return {
    createdAt: {
      greater_than_equal: startOfDay.toISOString(),
      less_than: endOfDay.toISOString(),
    },
  }
}
```

### Recent Records (Last N Days)

```typescript
export const recentRecordsAccess = (days: number): Access => {
  return ({ req: { user } }) => {
    if (!user) return false
    if (user.roles?.includes('admin')) return true

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    return {
      createdAt: {
        greater_than_equal: cutoff.toISOString(),
      },
    }
  }
}

// Usage: Users see only last 30 days, admins see all
export const Logs: CollectionConfig = {
  slug: 'logs',
  access: {
    read: recentRecordsAccess(30),
  },
}
```

### Scheduled Content (Publish Date Range)

```typescript
export const scheduledContentAccess: Access = ({ req: { user } }) => {
  // Editors see all content
  if (user?.roles?.includes('admin') || user?.roles?.includes('editor')) {
    return true
  }

  const now = new Date().toISOString()

  // Public sees only content within publish window
  return {
    and: [
      { publishDate: { less_than_equal: now } },
      {
        or: [{ unpublishDate: { exists: false } }, { unpublishDate: { greater_than: now } }],
      },
    ],
  }
}
```

## Subscription-Based Access

### Active Subscription Required

```typescript
export const activeSubscriptionAccess: Access = async ({ req: { user } }) => {
  if (!user) return false
  if (user.roles?.includes('admin')) return true

  try {
    const subscription = await req.payload.findByID({
      collection: 'subscriptions',
      id: user.subscriptionId,
    })

    return subscription?.status === 'active'
  } catch {
    return false
  }
}
```

### Subscription Tier-Based Access

```typescript
export const tierBasedAccess = (requiredTier: string): Access => {
  const tierHierarchy = ['free', 'basic', 'pro', 'enterprise']

  return async ({ req: { user } }) => {
    if (!user) return false
    if (user.roles?.includes('admin')) return true

    try {
      const subscription = await req.payload.findByID({
        collection: 'subscriptions',
        id: user.subscriptionId,
      })

      if (subscription?.status !== 'active') return false

      const userTierIndex = tierHierarchy.indexOf(subscription.tier)
      const requiredTierIndex = tierHierarchy.indexOf(requiredTier)

      return userTierIndex >= requiredTierIndex
    } catch {
      return false
    }
  }
}

// Usage
export const EnterpriseFeatures: CollectionConfig = {
  slug: 'enterprise-features',
  access: {
    read: tierBasedAccess('enterprise'),
  },
}
```

## Factory Functions

### createRoleBasedAccess

```typescript
export function createRoleBasedAccess(roles: string[]): Access {
  return ({ req: { user } }) => {
    if (!user) return false
    return roles.some((role) => user.roles?.includes(role))
  }
}

// Usage
const adminOrEditor = createRoleBasedAccess(['admin', 'editor'])
const moderatorAccess = createRoleBasedAccess(['admin', 'moderator'])
```

### createOrgScopedAccess

```typescript
export function createOrgScopedAccess(allowAdmin = true): Access {
  return ({ req: { user } }) => {
    if (!user) return false
    if (allowAdmin && user.roles?.includes('admin')) return true

    return {
      organizationId: { in: user.organizationIds || [] },
    }
  }
}

// Usage
const orgScoped = createOrgScopedAccess() // Admins bypass
const strictOrgScoped = createOrgScopedAccess(false) // Admins also scoped
```

### createTeamBasedAccess

```typescript
export function createTeamBasedAccess(teamField = 'teamId'): Access {
  return ({ req: { user } }) => {
    if (!user) return false
    if (user.roles?.includes('admin')) return true

    return {
      [teamField]: { in: user.teamIds || [] },
    }
  }
}
```

### createTimeLimitedAccess

```typescript
export function createTimeLimitedAccess(daysAccess: number): Access {
  return ({ req: { user } }) => {
    if (!user) return false
    if (user.roles?.includes('admin')) return true

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - daysAccess)

    return {
      createdAt: {
        greater_than_equal: cutoff.toISOString(),
      },
    }
  }
}
```

## Configuration Templates

### Public + Authenticated Collection

```typescript
export const PublicAuthCollection: CollectionConfig = {
  slug: 'posts',
  access: {
    // Only admins/editors can create
    create: ({ req: { user } }) => {
      return user?.roles?.some((role) => ['admin', 'editor'].includes(role)) || false
    },

    // Authenticated users see all, public sees only published
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },

    // Only admins/editors can update
    update: ({ req: { user } }) => {
      return user?.roles?.some((role) => ['admin', 'editor'].includes(role)) || false
    },

    // Only admins can delete
    delete: ({ req: { user } }) => {
      return user?.roles?.includes('admin') || false
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'richText', required: true },
    { name: 'author', type: 'relationship', relationTo: 'users' },
  ],
}
```

### Self-Service Collection

```typescript
export const SelfServiceCollection: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    // Admins can create users
    create: ({ req: { user } }) => user?.roles?.includes('admin') || false,

    // Anyone can read user profiles
    read: () => true,

    // Users can update self, admins can update anyone
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return user.id === id
    },

    // Only admins can delete
    delete: ({ req: { user } }) => user?.roles?.includes('admin') || false,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
      access: {
        // Only admins can read/update roles
        read: ({ req: { user } }) => user?.roles?.includes('admin') || false,
        update: ({ req: { user } }) => user?.roles?.includes('admin') || false,
      },
    },
  ],
}
```

## Performance Considerations

### Avoid Async Operations in Hot Paths

```typescript
// ❌ Slow: Multiple sequential async calls
export const slowAccess: Access = async ({ req: { user } }) => {
  const org = await req.payload.findByID({ collection: 'orgs', id: user.orgId })
  const team = await req.payload.findByID({ collection: 'teams', id: user.teamId })
  const subscription = await req.payload.findByID({ collection: 'subs', id: user.subId })

  return org.active && team.active && subscription.active
}

// ✅ Fast: Use query constraints or cache in context
export const fastAccess: Access = ({ req: { user, context } }) => {
  // Cache expensive lookups
  if (!context.orgStatus) {
    context.orgStatus = checkOrgStatus(user.orgId)
  }

  return context.orgStatus
}
```

### Query Constraint Optimization

```typescript
// ❌ Avoid: Non-indexed fields in constraints
export const slowQuery: Access = () => ({
  'metadata.internalCode': { equals: 'ABC123' }, // Slow if not indexed
})

// ✅ Better: Use indexed fields
export const fastQuery: Access = () => ({
  status: { equals: 'active' }, // Indexed field
  organizationId: { in: ['org1', 'org2'] }, // Indexed field
})
```

### Field Access on Large Arrays

```typescript
// ❌ Slow: Complex access on array fields
{
  name: 'items',
  type: 'array',
  fields: [
    {
      name: 'secretData',
      type: 'text',
      access: {
        read: async ({ req }) => {
          // Async call runs for EVERY array item
          const result = await expensiveCheck()
          return result
        },
      },
    },
  ],
}

// ✅ Fast: Simple checks or cache result
{
  name: 'items',
  type: 'array',
  fields: [
    {
      name: 'secretData',
      type: 'text',
      access: {
        read: ({ req: { user }, context }) => {
          // Cache once, reuse for all items
          if (context.canReadSecret === undefined) {
            context.canReadSecret = user?.roles?.includes('admin')
          }
          return context.canReadSecret
        },
      },
    },
  ],
}
```

### Avoid N+1 Queries

```typescript
// ❌ N+1 Problem: Query per access check
export const n1Access: Access = async ({ req, id }) => {
  // Runs for EACH document in list
  const doc = await req.payload.findByID({ collection: 'docs', id })
  return doc.isPublic
}

// ✅ Better: Use query constraint to filter at DB level
export const efficientAccess: Access = () => {
  return { isPublic: { equals: true } }
}
```

## Debugging Tips

### Log Access Check Execution

```typescript
export const debugAccess: Access = ({ req: { user }, id }) => {
  console.log('Access check:', {
    userId: user?.id,
    userRoles: user?.roles,
    docId: id,
    timestamp: new Date().toISOString(),
  })
  return true
}
```

### Verify Arguments Availability

```typescript
export const checkArgsAccess: Access = (args) => {
  console.log('Available arguments:', {
    hasReq: 'req' in args,
    hasUser: args.req?.user ? 'yes' : 'no',
    hasId: args.id ? 'provided' : 'undefined',
    hasData: args.data ? 'provided' : 'undefined',
  })
  return true
}
```

### Test Access Without User

```typescript
// In test/development
const testAccess = await payload.find({
  collection: 'posts',
  overrideAccess: false, // Enforce access control
  user: undefined, // Simulate no user
})

console.log('Public access result:', testAccess.docs.length)
```

## Best Practices

1. **Default Deny**: Start with restrictive access, gradually add permissions
2. **Type Guards**: Use TypeScript for user type safety
3. **Validate Data**: Never trust frontend-provided IDs or data
4. **Async for Critical Checks**: Use async operations for important security decisions
5. **Consistent Logic**: Apply same rules at field and collection levels
6. **Test Edge Cases**: Test with no user, wrong user, admin user scenarios
7. **Monitor Access**: Log failed access attempts for security review
8. **Regular Audit**: Review access rules quarterly or after major changes
9. **Cache Wisely**: Use `req.context` for expensive operations
10. **Document Intent**: Add comments explaining complex access rules
11. **Avoid Secrets in Client**: Never expose sensitive logic to client-side
12. **Handle Errors Gracefully**: Access functions should return `false` on error, not throw
13. **Test Local API**: Remember to set `overrideAccess: false` when testing
14. **Consider Performance**: Measure impact of async operations
15. **Principle of Least Privilege**: Grant minimum access required

## Performance Summary

**Minimize Async Operations**: Use query constraints over async lookups when possible

**Cache Expensive Checks**: Store results in `req.context` for reuse

**Index Query Fields**: Ensure fields in query constraints are indexed

**Avoid Complex Logic in Array Fields**: Simple boolean checks preferred

**Use Query Constraints**: Let database filter rather than loading all records
```

--------------------------------------------------------------------------------

---[FILE: access-control.md]---
Location: payload-main/templates/with-vercel-postgres/.cursor/rules/access-control.md

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
Location: payload-main/templates/with-vercel-postgres/.cursor/rules/adapters.md

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
Location: payload-main/templates/with-vercel-postgres/.cursor/rules/collections.md

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

````
