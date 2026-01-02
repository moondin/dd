---
source_txt: FULLSTACK_CODE_DATABASE_PART1_AUTHENTICATION.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART1 AUTHENTICATION

## Verbatim Content

````text
================================================================================
FULLSTACK CODE DATABASE - PART 1: AUTHENTICATION SYSTEMS
================================================================================
Generated: December 16, 2025
Projects Analyzed: Fullstack-SaaS-Boilerplate, DigitalHippo, Breadit
================================================================================

TABLE OF CONTENTS:
1. COMPLETE AUTHENTICATION SYSTEM (Better Auth + tRPC + Drizzle + React)
   - Database Schema
   - Backend Authentication Setup
   - Backend tRPC Routers
   - Frontend Authentication Client  
   - Frontend Auth Components
   - Session Management

================================================================================
1. COMPLETE AUTHENTICATION SYSTEM (Better Auth + tRPC + Drizzle + React)
================================================================================
Source: Fullstack-SaaS-Boilerplate
Tech Stack: Better Auth, Fastify, tRPC, Drizzle ORM, PostgreSQL, React, Vite
================================================================================

---[FILE: Database Schema - schema.ts]---
Location: packages/drizzle/src/db/schema.ts
Purpose: Complete database schema for authentication with Better Auth

```typescript
import { pgTable, text, integer, uuid, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import * as t from "drizzle-orm/pg-core"

export const rolesEnum = pgEnum("roles", ["user", "admin"])

// USER TABLE - Core user information
export const userTable = pgTable(
  "user",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text("name").notNull(),
    age: integer(),
    image: text("image"),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    role: rolesEnum().default("user"),
  },
  (table) => [t.uniqueIndex("email_idx").on(table.email)]
)

// SESSION TABLE - User session management
export const sessionTable = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const sessionToUserRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}))

// ACCOUNT TABLE - OAuth and credential management
export const accountTable = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// VERIFICATION TABLE - Email verification and password resets
export const verificationTable = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
```

USAGE NOTES:
- Uses UUID for all primary keys
- Email has unique constraint and index for fast lookups
- Session table tracks IP and user agent for security
- Account table supports both OAuth and password authentication
- Verification table can be used for email verification and password resets
- All tables have timestamps for audit trails

---[FILE: Backend Authentication Setup - auth.ts]---
Location: server/src/lib/auth.ts
Purpose: Better Auth configuration with Drizzle adapter

```typescript
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../context"
import * as schema from "@fsb/drizzle"

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // don't allow user to set role
      },
    },
  },
  emailAndPassword: { enabled: true },
  advanced: {
    database: { generateId: false },
    useSecureCookies: false,
    disableCSRFCheck: true,
    cookies: {
      session_token: {
        name: "fsb",
        attributes: {
          sameSite: "none",
          httpOnly: false,
          secure: true,
        },
      },
    },
    defaultCookieAttributes: {
      sameSite: "none",
      httpOnly: false,
      secure: true,
    },
    cookiePrefix: "fsb",
  },
  trustedOrigins: ["http://localhost:3000", "https://fsb-client.onrender.com"],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.userTable,
      session: schema.sessionTable,
      account: schema.accountTable,
      verification: schema.verificationTable,
    },
  }),
})
```

USAGE NOTES:
- Configured for cross-origin requests (SameSite: none)
- Custom role field added to user with default "user" value
- Users cannot set their own role (security)
- Email/password authentication enabled
- Cookie prefix "fsb" for all auth cookies
- Trusted origins list prevents CSRF on specific domains

---[FILE: Backend Auth Handler - auth.ts]---
Location: server/src/handlers/auth.ts
Purpose: Fastify handler that bridges Better Auth with Fastify requests

```typescript
import { FastifyRequest, FastifyReply } from "fastify"
import { auth } from "../lib/auth"

export async function authHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Construct request URL
    const url = new URL(request.url, `http://${request.headers.host}`)

    // Convert Fastify headers to standard Headers object
    const headers = new Headers()
    Object.entries(request.headers).forEach(([key, value]) => {
      if (value) headers.append(key, value.toString())
    })

    // Create Fetch API-compatible request
    const req = new Request(url.toString(), {
      method: request.method,
      headers,
      body: request.body ? JSON.stringify(request.body) : undefined,
    })

    // Process authentication request
    const response = await auth.handler(req)

    // Forward response to client
    reply.status(response.status)
    response.headers.forEach((value, key) => reply.header(key, value))
    reply.send(response.body ? await response.text() : null)
  } catch (error) {
    console.error("Authentication Error:", error)
    reply.status(500).send({
      error: "Internal authentication error",
      code: "AUTH_FAILURE",
    })
  }
}
```

USAGE NOTES:
- Converts Fastify request format to Fetch API format
- Better Auth uses Web Standards (Fetch API)
- Forwards all auth requests (/api/auth/*) to Better Auth
- Handles errors gracefully with proper error codes
- Transfers all headers and status codes correctly

---[FILE: Frontend Auth Client - auth-client.ts]---
Location: client/src/lib/auth-client.ts
Purpose: Better Auth client for React applications

```typescript
import { createAuthClient } from "better-auth/react"
const url = import.meta.env.VITE_URL_BACKEND
import { inferAdditionalFields } from "better-auth/client/plugins"
import { auth } from "../../../server/src/lib/auth"

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
  baseURL: url,
})
```

USAGE NOTES:
- Infers additional fields (like role) from server auth config
- Type-safe with TypeScript inference
- baseURL points to backend server
- Can be used with React hooks provided by better-auth/react

================================================================================
CONTINUED IN PART 1B...
================================================================================

````
