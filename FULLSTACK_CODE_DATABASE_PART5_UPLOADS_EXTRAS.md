---
source_txt: FULLSTACK_CODE_DATABASE_PART5_UPLOADS_EXTRAS.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART5 UPLOADS EXTRAS

## Verbatim Content

````text
================================================================================
FULLSTACK CODE DATABASE - PART 5: FILE UPLOADS & ADDITIONAL FEATURES
================================================================================
Generated: December 16, 2025
================================================================================

TABLE OF CONTENTS:
1. File Upload System (UploadThing)
2. User Router (CRUD Operations)
3. Protected Routes
4. Error Handling Patterns

================================================================================
1. FILE UPLOAD SYSTEM (UploadThing)
================================================================================
Source: Breadit
Tech Stack: UploadThing, Next.js, NextAuth
================================================================================

---[FILE: UploadThing Helper - uploadthing.ts]---
Location: src/lib/uploadthing.ts
Purpose: React helpers for file uploads

```typescript
import { generateReactHelpers } from '@uploadthing/react/hooks'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

export const { uploadFiles } = generateReactHelpers<OurFileRouter>()
```

---[FILE: UploadThing Core - core.ts]---
Location: src/app/api/uploadthing/core.ts
Purpose: Backend file upload configuration with authentication

```typescript
import { getToken } from 'next-auth/jwt'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async (req) => {
      // Authenticate user before upload
      const user = await getToken({ req })

      if (!user) throw new Error('Unauthorized')

      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Can process file after upload (e.g., image optimization)
      console.log('Upload complete for userId:', metadata.userId)
      console.log('File URL:', file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
```

USAGE IN COMPONENT:
```typescript
import { uploadFiles } from '@/lib/uploadthing'

async function handleFileUpload(file: File) {
  const [res] = await uploadFiles({
    files: [file],
    endpoint: "imageUploader"
  })
  
  console.log('Uploaded file URL:', res.fileUrl)
}
```

USAGE NOTES:
- Type-safe file uploads
- Built-in authentication middleware
- Automatic file size validation
- Supports multiple file types
- CDN hosting included
- Progress tracking built-in

ALTERNATIVES:
- AWS S3 with presigned URLs
- Cloudinary for images/videos
- Azure Blob Storage
- Google Cloud Storage

================================================================================
2. USER ROUTER (CRUD OPERATIONS)
================================================================================
Source: Fullstack-SaaS-Boilerplate
Purpose: Complete user management with tRPC

---[FILE: User Router - userRouter.ts]---
Location: server/src/router/userRouter.ts

```typescript
import { protectedProcedure, router } from "../trpc"
import { z } from "zod"
import { userTable, drizzleOrm } from "@fsb/drizzle"
const { eq, or, count, asc, ilike, and } = drizzleOrm

const userRouter = router({
  // UPDATE USER
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email("Invalid email").optional(),
        name: z.string()
          .min(2, "Name must be at least 2 chars")
          .max(50, "Name must be at max 50 chars")
          .optional(),
        age: z.number()
          .min(2, "Age must be at least 2")
          .max(120, "Age must be at max 120")
          .optional(),
      })
    )
    .mutation(async (opts) => {
      const db = opts.ctx.db

      const user = await db
        .update(userTable)
        .set({ 
          name: opts.input.name, 
          age: opts.input.age, 
          email: opts.input.email 
        })
        .where(eq(userTable.id, opts.input.id))
        .returning()

      return user
    }),

  // GET USERS (with pagination and search)
  getUsers: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        search: z.string().optional(),
        userId: z.string().optional(),
      })
    )
    .query(async (opts) => {
      const page = opts.input.page
      const limit = 12
      const db = opts.ctx.db
      
      const users = await db.query.userTable.findMany({
        limit,
        offset: (page - 1) * limit,
        orderBy: [asc(userTable.name)],
        columns: { 
          id: true, 
          name: true, 
          email: true, 
          image: true, 
          createdAt: true, 
          role: true 
        },
        where: and(
          opts.input.search
            ? or(
                ilike(userTable.name, `%${opts.input.search}%`), 
                ilike(userTable.email, `%${opts.input.search}%`)
              )
            : undefined,
          opts.input.userId 
            ? eq(userTable.id, opts.input.userId) 
            : undefined
        ),
      })
      
      const totalData = await db
        .select({ count: count() })
        .from(userTable)
        .where(
          and(
            opts.input.search
              ? or(
                  ilike(userTable.name, `%${opts.input.search}%`), 
                  ilike(userTable.email, `%${opts.input.search}%`)
                )
              : undefined,
            opts.input.userId 
              ? eq(userTable.id, opts.input.userId) 
              : undefined
          )
        )
      
      const total = totalData[0].count

      return { users, page, limit, total }
    }),

  // GET SINGLE USER PROFILE
  getUserProfile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const id = opts.input.id
      const db = opts.ctx.db
      
      const user = await db.query.userTable.findFirst({
        columns: { 
          id: true, 
          name: true, 
          age: true, 
          email: true, 
          image: true, 
          createdAt: true, 
          role: true 
        },
        where: eq(userTable.id, id),
      })

      if (!user) throw new Error("User not found")

      return user
    }),

  // GET USER (minimal data)
  getUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const id = opts.input.id
      const db = opts.ctx.db
      
      const user = await db.query.userTable.findFirst({
        columns: { id: true, name: true, image: true },
        where: eq(userTable.id, id),
      })

      if (!user) throw new Error("User not found")

      return user
    }),
})

export default userRouter
```

USAGE NOTES:
- Full CRUD operations
- Pagination with limit/offset
- Search across multiple fields
- Column selection for performance
- Type-safe with Zod validation
- Case-insensitive search with ilike

FRONTEND USAGE:
```typescript
// Get users with search
const { data } = trpc.user.getUsers.useQuery({
  page: 1,
  search: "john"
})

// Update user
const mutation = useMutation(trpc.user.updateUser.mutationOptions())
await mutation.mutateAsync({
  id: userId,
  name: "New Name",
  age: 25
})
```

================================================================================
3. PROTECTED ROUTES
================================================================================

---[FILE: Private Route Component - PrivateRoute.tsx]---
Location: client/src/PrivateRoute.tsx
Purpose: Route guard for authenticated pages

```typescript
import { Navigate } from "react-router"
import { authClient } from "./lib/auth-client"
import LoadingTemplate from "./template/LoadingTemplate"

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const session = authClient.useSession()

  if (session.isPending) {
    return <LoadingTemplate />
  }

  if (!session.data) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
```

USAGE IN ROUTER:
```typescript
import { Routes, Route } from 'react-router'
import PrivateRoute from './PrivateRoute'

<Routes>
  <Route path="/login" element={<Login />} />
  <Route 
    path="/profile" 
    element={
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    } 
  />
</Routes>
```

================================================================================
4. ERROR HANDLING PATTERNS
================================================================================

---[FILE: Try-Catch Helper - try-catch.ts]---
Location: client/src/lib/try-catch.ts
Purpose: Consistent error handling wrapper

```typescript
export async function tryCatch<T>(
  promise: Promise<T>
): Promise<{ data?: T; error?: Error }> {
  try {
    const data = await promise
    return { data }
  } catch (error) {
    return { 
      error: error instanceof Error 
        ? error 
        : new Error('Unknown error') 
    }
  }
}
```

USAGE:
```typescript
const result = await tryCatch(
  mutation.mutateAsync({ email, password })
)

if (result.error) {
  setError(result.error.message)
  return
}

if (result.data) {
  // Success
  navigate('/dashboard')
}
```

BENEFITS:
- No try-catch blocks in components
- Consistent error handling
- Type-safe results
- Works with any Promise

================================================================================
5. ENVIRONMENT CONFIGURATION
================================================================================

---[ENV FILE: Backend - server.env]---
```
DATABASE_URL=postgresql://user:password@localhost:5432/database
PORT=2022
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
BETTER_AUTH_SECRET=... (generate with `openssl rand -base64 32`)
BETTER_AUTH_URL=http://localhost:2022
```

---[ENV FILE: Frontend - .env]---
```
VITE_URL_BACKEND=http://localhost:2022
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
```

================================================================================
6. UTILITIES AND HELPERS
================================================================================

---[FILE: Utils - utils.ts]---
Location: src/lib/utils.ts
Purpose: Common utilities (Tailwind cn helper)

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

USAGE:
```typescript
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>
```

================================================================================
END OF PART 5
================================================================================

ADDITIONAL FEATURES DOCUMENTED:
✅ File uploads with UploadThing
✅ User CRUD operations
✅ Protected routes/route guards
✅ Error handling patterns
✅ Environment configuration
✅ Utility functions
✅ Pagination patterns
✅ Search functionality

````
