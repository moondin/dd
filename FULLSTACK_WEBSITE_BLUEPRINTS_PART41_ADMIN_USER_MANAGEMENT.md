---
blueprint: "Admin User Management Console (tRPC + Drizzle CRUD + RBAC)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART2_TRPC_REALTIME.md
  - FULLSTACK_CODE_DATABASE_PART5_UPLOADS_EXTRAS.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 41 — Admin User Management Console

## Goal
An internal admin site where admins can:
- search/list users
- update user fields (name/email/age)
- perform CRUD operations via protected routes

This blueprint is assembled from the admin/protected procedure patterns (Part 2) and the userRouter CRUD patterns (Part 5).

## Backend (As Documented)
- tRPC server initialization with:
  - `publicProcedure`, `protectedProcedure`, `adminProcedure` (Part 2)
- User CRUD router
  - `updateUser` with Zod validation (Part 5)

## UI
- Users table
  - DataTable listing
  - row actions: edit (Modal)
- Edit form
  - validates email format and field length (mirror server-side constraints)

## Feedback
- Use snackbar context for success/failure messages (Part 9)

## Notes / Constraints
- Role checks must match the `adminProcedure` middleware documented in Part 2.
- Only implement the CRUD operations that exist in Part 5’s router.
