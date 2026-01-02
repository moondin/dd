---
source_txt: FULLSTACK_CODE_DATABASE_PART1B_AUTH_COMPONENTS.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART1B AUTH COMPONENTS

## Verbatim Content

````text
================================================================================
FULLSTACK CODE DATABASE - PART 1B: AUTHENTICATION COMPONENTS & TRPC SETUP
================================================================================
Continued from Part 1
================================================================================

---[FILE: Frontend Login Component - Login.tsx]---
Location: client/src/components/auth/Login.tsx
Purpose: Complete login form with tRPC mutation

```tsx
import React from "react"
import { Link } from "react-router"
import { useNavigate } from "react-router"
import { SignInIcon } from "@phosphor-icons/react"
import { useMutation } from "@tanstack/react-query"
import { authClient } from "../../lib/auth-client"
import { tryCatch } from "../../lib/try-catch"
import { useTRPC } from "../../lib/trpc"

const Login = () => {
  const session = authClient.useSession()
  const trpc = useTRPC()
  const mutation = useMutation(trpc.session.login.mutationOptions())

  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState({
    password: "securePassword",
    email: "alan@example.com",
  })

  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await tryCatch(mutation.mutateAsync({ 
      email: formData.email, 
      password: formData.password 
    }))
    
    if (result.error) {
      setError(result.error.message)
    }
    if (result.data) {
      navigate("/profile")
      session.refetch()
    }

    setIsSubmitting(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center">
        <SignInIcon className="text-3xl mr-3" />
        <h1>Login</h1>
      </div>
      <form onSubmit={onSubmit} className="mt-4 space-y-2">
        <div>
          <input
            id="email-input"
            name="email"
            autoFocus
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={"input-default"}
            type="text"
            placeholder="Email"
          />
        </div>
        <div>
          <input
            id="password-input"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={"input-default"}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />
        </div>
        <div>
          <input
            type="checkbox"
            id="show-password-checkbox"
            name="show-password-checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="cursor-pointer"
          />
          <label htmlFor="show-password-checkbox" className="ml-2 cursor-pointer">
            Show Password
          </label>
        </div>
        <div>
          <button
            id="email-mutation-button"
            disabled={isSubmitting}
            type="submit"
            className="btn-blue flex items-center"
          >
            <SignInIcon className="mr-2" />
            {isSubmitting ? "Loading..." : "Login"}
          </button>
          {error && <p className="text-sm mt-6 text-red-500">{error}</p>}
        </div>
        <p className="text-sm mt-6">
          Don't have an account yet?{" "}
          <Link className="link" to="/signup">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
```

---[FILE: Frontend Signup Component - Signup.tsx]---
Location: client/src/components/auth/Signup.tsx
Purpose: Complete signup form with tRPC mutation

```tsx
import React from "react"
import { Link, useNavigate } from "react-router"
import { KeyIcon } from "@phosphor-icons/react"
import { authClient } from "../../lib/auth-client"
import { useTRPC } from "../../lib/trpc"
import { useMutation } from "@tanstack/react-query"
import { tryCatch } from "../../lib/try-catch"

const Signup = () => {
  const session = authClient.useSession()
  const trpc = useTRPC()
  const mutation = useMutation(trpc.session.signup.mutationOptions())
  const navigate = useNavigate()

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await tryCatch(
      mutation.mutateAsync({ 
        email: formData.email, 
        password: formData.password, 
        name: formData.name 
      })
    )
    
    if (result.error) {
      setError(result.error.message)
    }
    if (result.data) {
      navigate("/profile")
      session.refetch()
    }

    setIsSubmitting(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center">
        <KeyIcon className="text-3xl mr-3" />
        <h1>Sign up</h1>
      </div>
      <form onSubmit={onSubmit} className="mt-4 space-y-2">
        <div>
          <input
            id="name-input"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={"input-default"}
            type="text"
            placeholder="Name"
          />
        </div>

        <div>
          <input
            id="email-input"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={"input-default"}
            type="text"
            placeholder="Email"
          />
        </div>

        <div>
          <input
            id="password-input"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={"input-default"}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />
        </div>

        <div>
          <input
            type="checkbox"
            id="show-password-checkbox"
            name="show-password-checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="cursor-pointer"
          />
          <label htmlFor="show-password-checkbox" className="ml-2 cursor-pointer">
            Show Password
          </label>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-blue flex items-center">
          <KeyIcon className="mr-2" />
          {isSubmitting ? <span>Signing up...</span> : <span>Sign up</span>}
        </button>
        {error && <p className="text-sm mt-6 text-red-500">{error}</p>}
      </form>
      <p className="text-sm mt-6">
        I have an account{" "}
        <Link className="link" to="/login">
          Login
        </Link>
      </p>
    </div>
  )
}

export default Signup
```

USAGE NOTES:
- Uses Better Auth client for session management
- tRPC mutations for type-safe API calls
- Custom tryCatch helper for error handling
- Automatic session refetch after successful auth
- Navigation to profile after login/signup
- Show/hide password toggle
- Error display with styling
- Loading states during submission

---[FILE: Backend Session Router - sessionRouter.ts]---
Location: server/src/router/sessionRouter.ts
Purpose: tRPC router for authentication operations

```typescript
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../trpc"
import { z } from "zod"
import { sessionTable } from "@fsb/drizzle"
import { drizzleOrm } from "@fsb/drizzle"
import { auth } from "../lib/auth"
const { count, eq } = drizzleOrm

const sessionRouter = router({
  // LOGIN ENDPOINT
  login: publicProcedure
    .input(z.object({ 
      email: z.string(), 
      password: z.string() 
    }))
    .mutation(async (opts) => {
      console.log("login", opts.input)
      
      // Call Better Auth sign in API
      const response = await auth.api.signInEmail({
        body: {
          email: opts.input.email,
          password: opts.input.password,
        },
        asResponse: true, // returns a response object instead of data
      })
      
      console.log("response", response)

      // Set the cookie from the response headers
      const setCookieHeader = response.headers.get("set-cookie")
      if (setCookieHeader) {
        opts.ctx.res.header("Set-Cookie", setCookieHeader)
      }

      // Extract user agent and IP address from request headers
      const userAgent = Array.isArray(opts.ctx.req.headers["user-agent"])
        ? opts.ctx.req.headers["user-agent"][0]
        : opts.ctx.req.headers["user-agent"] || ""

      const ipAddress =
        (Array.isArray(opts.ctx.req.headers["x-forwarded-for"])
          ? opts.ctx.req.headers["x-forwarded-for"][0]
          : opts.ctx.req.headers["x-forwarded-for"]
        )
          ?.split(",")[0]
          ?.trim() ||
        (Array.isArray(opts.ctx.req.headers["x-real-ip"])
          ? opts.ctx.req.headers["x-real-ip"][0]
          : opts.ctx.req.headers["x-real-ip"]) ||
        ""

      console.log("Login userAgent:", userAgent)
      console.log("Login ipAddress:", ipAddress)

      // Update the session with user agent and IP address
      try {
        const headers = new Headers()
        Object.entries(opts.ctx.req.headers).forEach(([key, value]) => {
          if (value) headers.append(key, Array.isArray(value) ? value.join(", ") : value)
        })

        const sessionData = await auth.api.getSession({
          headers,
        })

        if (sessionData?.session?.id) {
          await opts.ctx.db
            .update(sessionTable)
            .set({
              userAgent: userAgent,
              ipAddress: ipAddress,
            })
            .where(eq(sessionTable.id, sessionData.session.id))

          console.log("Updated session with userAgent and ipAddress")
        }
      } catch (error) {
        console.log("Error updating session:", error)
      }

      return true
    }),

  // SIGNUP ENDPOINT
  signup: publicProcedure
    .input(z.object({ 
      email: z.string(), 
      password: z.string(), 
      name: z.string() 
    }))
    .mutation(async (opts) => {
      console.log("signup", opts.input)
      
      const response = await auth.api.signUpEmail({
        body: {
          email: opts.input.email,
          password: opts.input.password,
          name: opts.input.name,
        },
        asResponse: true,
      })
      
      console.log("response", response)
      
      // Set the cookie from the response headers
      const setCookieHeader = response.headers.get("set-cookie")
      if (setCookieHeader) {
        opts.ctx.res.header("Set-Cookie", setCookieHeader)
      }

      // Extract user agent and IP address
      const userAgent = Array.isArray(opts.ctx.req.headers["user-agent"])
        ? opts.ctx.req.headers["user-agent"][0]
        : opts.ctx.req.headers["user-agent"] || ""

      const ipAddress =
        (Array.isArray(opts.ctx.req.headers["x-forwarded-for"])
          ? opts.ctx.req.headers["x-forwarded-for"][0]
          : opts.ctx.req.headers["x-forwarded-for"]
        )
          ?.split(",")[0]
          ?.trim() ||
        ""

      // Update session with tracking info
      try {
        const headers = new Headers()
        Object.entries(opts.ctx.req.headers).forEach(([key, value]) => {
          if (value) headers.append(key, Array.isArray(value) ? value.join(", ") : value)
        })

        const sessionData = await auth.api.getSession({
          headers,
        })

        if (sessionData?.session?.id) {
          await opts.ctx.db
            .update(sessionTable)
            .set({
              userAgent: userAgent,
              ipAddress: ipAddress,
            })
            .where(eq(sessionTable.id, sessionData.session.id))

          console.log("Updated signup session with userAgent and ipAddress")
        }
      } catch (error) {
        console.log("Error updating signup session:", error)
      }

      return true
    }),

  // DELETE SESSION (Admin only)
  deleteSession: adminProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async (opts) => {
      const db = opts.ctx.db
      await db.delete(sessionTable).where(eq(sessionTable.id, opts.input.sessionId))
      return true
    }),

  // GET SESSIONS (Protected)
  getSessions: protectedProcedure
    .input(z.object({
      page: z.number(),
      search: z.string().optional(),
      userId: z.string().optional(),
    }))
    .query(async (opts) => {
      const page = opts.input.page
      const limit = 12
      const db = opts.ctx.db
      
      const sessions = await db.query.sessionTable.findMany({
        limit,
        offset: (page - 1) * limit,
        columns: { 
          id: true, 
          createdAt: true, 
          userAgent: true, 
          ipAddress: true 
        },
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        where: opts.input.userId ? eq(sessionTable.userId, opts.input.userId) : undefined,
      })

      const totalData = await db.select({ count: count() }).from(sessionTable)
      const total = totalData[0].count

      return { sessions, page, limit, total }
    }),
})

export default sessionRouter
```

USAGE NOTES:
- Public procedures: login, signup (no auth required)
- Protected procedure: getSessions (requires authentication)
- Admin procedure: deleteSession (requires admin role)
- Tracks IP address and user agent for security
- Automatic cookie handling for sessions
- Pagination support in getSessions
- Type-safe with Zod validation

================================================================================
CONTINUED IN PART 2...
================================================================================

````
