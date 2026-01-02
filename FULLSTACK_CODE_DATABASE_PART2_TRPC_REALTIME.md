---
source_txt: FULLSTACK_CODE_DATABASE_PART2_TRPC_REALTIME.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART2 TRPC REALTIME

## Verbatim Content

````text
================================================================================
FULLSTACK CODE DATABASE - PART 2: TRPC SETUP & REAL-TIME CHAT
================================================================================
Generated: December 16, 2025
Tech Stack: tRPC, Fastify, React, TypeScript, Server-Sent Events (SSE)
================================================================================

TABLE OF CONTENTS:
1. COMPLETE TRPC SETUP (Backend + Frontend)
   - Backend tRPC Initialization
   - Backend Context Setup
   - Backend Server Setup
   - Frontend tRPC Client Setup
   - Frontend App Configuration

2. REAL-TIME CHAT SYSTEM
   - Backend Message Router with SSE
   - Frontend Chat Component
   - Message Persistence with Drizzle

================================================================================
1. COMPLETE TRPC SETUP (Backend + Frontend)
================================================================================

---[FILE: Backend tRPC Initialization - trpc.ts]---
Location: server/src/trpc.ts
Purpose: Initialize tRPC with context and create procedures with auth middleware

```typescript
import { initTRPC, TRPCError } from "@trpc/server"
import createContext from "./context"

const t = initTRPC.context<Context>().create()

type Context = Awaited<ReturnType<typeof createContext>>

export default t

// PUBLIC PROCEDURE - No authentication required
export const publicProcedure = t.procedure

// ROUTER CREATOR
export const router = t.router

// PROTECTED PROCEDURE - Requires authentication
export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
  if (!opts.ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return opts.next({ ctx: { user: opts.ctx.user } })
})

// ADMIN PROCEDURE - Requires admin role
export const adminProcedure = t.procedure.use(async function isAuthed(opts) {
  if (!opts.ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  if (opts.ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "You must be an admin" })
  }
  return opts.next({ ctx: { user: opts.ctx.user } })
})
```

USAGE NOTES:
- Three procedure types: public, protected, admin
- Context typing ensures type safety across all procedures
- Middleware chains for authentication/authorization
- TRPCError with proper codes for error handling

---[FILE: Backend Context Setup - context.ts]---
Location: server/src/context.ts
Purpose: Create tRPC context with database, user session, and request/response objects

```typescript
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify"
import { drizzleOrm_NodePostgres } from "@fsb/drizzle"
import { drizzleOrm } from "@fsb/drizzle"
const { eq } = drizzleOrm
const { drizzle } = drizzleOrm_NodePostgres
import { userTable } from "@fsb/drizzle"
import * as schema from "@fsb/drizzle"
import dotenv from "dotenv"
dotenv.config({ path: "../server.env" })
import { fromNodeHeaders } from "better-auth/node"
import { auth } from "./lib/auth"

let databaseUrl = process.env.DATABASE_URL!
if (!databaseUrl) throw new Error("databaseUrl is not defined. Make sure server.env is loaded.")
databaseUrl = process.env.SSL_MODE === "require" ? databaseUrl + "?sslmode=require" : databaseUrl

if (!databaseUrl) throw new Error("DATABASE_URL is not defined")
const config = { databaseUrl }

// Initialize Drizzle ORM with PostgreSQL
export const db = drizzle(databaseUrl, { schema })

const createContext = async ({ req, res }: CreateFastifyContextOptions) => {
  // Convert Fastify headers to Better Auth format
  const headers = fromNodeHeaders(req.headers)
  
  // Get session from Better Auth
  const data = await auth.api.getSession({
    headers,
  })

  if (data) {
    try {
      // Fetch full user data from database
      const user = await db.query.userTable.findFirst({ 
        where: eq(userTable.id, data.user.id) 
      })
      
      if (!user) throw new Error("User not found")

      // Return context with authenticated user
      return { req, res, user, db, config }
    } catch (error) {
      console.log("error", error)
    }
  }
  
  // Return context without user (for public procedures)
  return { req, res, db, config }
}

export default createContext
```

USAGE NOTES:
- Context created for every request
- Includes Fastify req/res for direct access
- Database connection (db) available in all procedures
- User automatically fetched if authenticated
- Handles both authenticated and unauthenticated requests

---[FILE: Backend Server Setup - index.ts]---
Location: server/src/index.ts
Purpose: Fastify server with tRPC and Better Auth integration

```typescript
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify"
import Fastify, { FastifyRequest, FastifyReply } from "fastify"
import fastifyCookie from "@fastify/cookie"
import fastifyCors from "@fastify/cors"
import { authHandler } from "./handlers/auth"
import dotenv from "dotenv"
dotenv.config({ path: "../server.env" })
import createContext from "./context"
import { AppRouter, appRouter } from "./router"

const fastify = Fastify({
  maxParamLength: 5000,
  // logger: true,
})

const start = async () => {
  try {
    // CORS Configuration
    await fastify.register(fastifyCors, {
      credentials: true,
      origin: true, // Accept all origins (adjust for production)
    })

    // Cookie Support
    await fastify.register(fastifyCookie)

    // Better Auth Routes (/api/auth/*)
    fastify.route({
      method: ["GET", "POST"],
      url: "/api/auth/*",
      handler: authHandler,
    })

    // Health Check Route
    fastify.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({ message: "Hello world!" })
    })

    // tRPC Plugin
    await fastify.register(fastifyTRPCPlugin, {
      prefix: "/",
      trpcOptions: {
        router: appRouter,
        createContext,
      } as FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
    })

    // Start Server
    const port = Number(process.env.PORT) || 2022
    await fastify.listen({
      port,
      host: "0.0.0.0",
    })
    console.log("Server is running on port " + port)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
```

USAGE NOTES:
- Fastify as HTTP server (fast alternative to Express)
- CORS enabled for cross-origin requests
- Cookie support for Better Auth sessions
- tRPC mounted at root path "/"
- Auth routes at "/api/auth/*"
- Listens on all interfaces (0.0.0.0)

---[FILE: Backend Router Index - index.ts]---
Location: server/src/router/index.ts
Purpose: Combine all tRPC routers into single app router

```typescript
import userRouter from "./userRouter"
import sessionRouter from "./sessionRouter"
import healthRouter from "./healthRouter"
import gameRouter from "./gameRouter"
import messageRouter from "./messageRouter"
import { router } from "../trpc"

export const appRouter = router({
  session: sessionRouter,
  health: healthRouter,
  game: gameRouter,
  user: userRouter,
  message: messageRouter,
})

export type AppRouter = typeof appRouter
```

USAGE NOTES:
- Modular router structure (one router per feature)
- Exported AppRouter type for frontend type inference
- Each router is namespaced (e.g., session.login, user.getUsers)

---[FILE: Frontend tRPC Client - trpc.ts]---
Location: client/src/lib/trpc.ts
Purpose: Type-safe tRPC client for React

```typescript
import { createTRPCContext } from "@trpc/tanstack-react-query"
import type { AppRouter } from "../../../server/src/router"
import { inferRouterOutputs } from "@trpc/server"

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>()
export type RouterOutput = inferRouterOutputs<AppRouter>
```

USAGE NOTES:
- Imports AppRouter type from backend for full type safety
- TRPCProvider: Wrapper component for React app
- useTRPC: Hook to access tRPC client in components
- useTRPCClient: Direct access to tRPC client
- RouterOutput: Infer return types of all procedures

---[FILE: Frontend App Setup - App.tsx]---
Location: client/src/App.tsx
Purpose: React app with tRPC and React Query setup

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router"
import LayoutApp from "./layout/LayoutApp"
import LogoApp from "./layout/LogoApp"
import { createTRPCClient, httpBatchLink, httpSubscriptionLink, splitLink } from "@trpc/client"
import { AppRouter } from "../../server/src/router"
import { TRPCProvider } from "./lib/trpc"
import { useThemeStore } from "./store/useThemeStore"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: false,
        gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

const App = () => {
  const { isDarkMode } = useThemeStore()
  const url = import.meta.env.VITE_URL_BACKEND
  
  if (!url) {
    return (
      <div className="p-6">
        <LogoApp />
        <div className="flex flex-col items-center mt-12">
          <h1>Error</h1>
          <p>URL_BACKEND not set in env file</p>
        </div>
      </div>
    )
  }

  const queryClient = getQueryClient()
  
  // Create tRPC client with batch link and subscription support
  const trpcClient = createTRPCClient<AppRouter>({
    links: [
      splitLink({
        // Uses httpSubscriptionLink for subscriptions (SSE)
        condition: (op) => op.type === "subscription",
        true: httpSubscriptionLink({
          url,
        }),
        // Uses httpBatchLink for queries and mutations
        false: httpBatchLink({
          url,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include", // Include cookies for auth
            })
          },
        }),
      }),
    ],
  })

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <div className={isDarkMode ? "dark" : "light"}>
            <QueryClientProvider client={queryClient}>
              <LayoutApp />
            </QueryClientProvider>
          </div>
        </TRPCProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
```

USAGE NOTES:
- React Query for cache management
- Batch link combines multiple requests into one
- Subscription link for real-time features (SSE)
- credentials: "include" sends cookies with every request
- Theme support (dark/light mode)
- Error handling for missing env variables

================================================================================
2. REAL-TIME CHAT SYSTEM WITH SERVER-SENT EVENTS (SSE)
================================================================================

---[FILE: Backend Message Router - messageRouter.ts]---
Location: server/src/router/messageRouter.ts
Purpose: Real-time chat with SSE subscriptions and message persistence

```typescript
import { protectedProcedure, publicProcedure, router } from "../trpc"
import { z } from "zod"
import { messageTable, drizzleOrm } from "@fsb/drizzle"
import { EventEmitter } from "events"

const ee = new EventEmitter()
const { desc, lt } = drizzleOrm

type ChatMessage = {
  id: string
  name: string
  image: string
  message: string
  createdAt: Date
}

const messageRouter = router({
  // SEND MESSAGE - Protected (requires auth)
  sendMessage: protectedProcedure
    .input(z.object({
      message: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // Save message to database
      await ctx.db.insert(messageTable).values({
        message: input.message,
        senderId: ctx.user.id,
      })
      
      // Broadcast message to all subscribers via EventEmitter
      const message: ChatMessage = {
        id: ctx.user.id,
        name: ctx.user.name,
        image: ctx.user.image || "",
        message: input.message,
        createdAt: new Date(),
      }
      ee.emit("fsb-chat", message)

      return { success: true }
    }),

  // GET MESSAGES - Public (pagination with cursor)
  getMessages: publicProcedure
    .input(z.object({
      before: z.string().datetime().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.query.messageTable.findMany({
        where: input.before ? lt(messageTable.createdAt, new Date(input.before)) : undefined,
        orderBy: [desc(messageTable.createdAt)],
        limit: 20,
        with: {
          sender: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })
      return messages
    }),

  // SSE SUBSCRIPTION - Real-time messages
  sseMessages: publicProcedure.subscription(async function* () {
    while (true) {
      // Wait for new message event
      const message = await new Promise<ChatMessage>((resolve) => {
        ee.once("fsb-chat", resolve)
      })
      
      // Yield message to subscriber
      yield message
    }
  }),
})

export default messageRouter
```

USAGE NOTES:
- EventEmitter for in-memory pub/sub
- SSE subscription sends messages to all connected clients
- Messages persisted to database with Drizzle
- Cursor-based pagination with "before" parameter
- Includes sender information in message queries
- Generator function (async function*) for streaming

---[FILE: Message Schema Addition]---
Location: packages/drizzle/src/db/schema.ts
Purpose: Database schema for messages

```typescript
export const messageTable = pgTable("message", {
  id: uuid().defaultRandom().primaryKey(),
  message: text("message").notNull(),
  senderId: uuid("sender_id").references(() => userTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const messageToUserRelations = relations(messageTable, ({ one }) => ({
  sender: one(userTable, {
    fields: [messageTable.senderId],
    references: [userTable.id],
  }),
}))
```

REUSABILITY NOTES:
- This complete tRPC setup can be copied to any project
- Change import paths and database schemas as needed
- SSE pattern works for any real-time feature (notifications, live updates)
- EventEmitter can be replaced with Redis pub/sub for multi-server deployments
- All type safety maintained through TypeScript inference

================================================================================
CONTINUED IN PART 3...
================================================================================

````
