---
blueprint: "SaaS Admin Portal"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART1_AUTHENTICATION.md
  - FULLSTACK_CODE_DATABASE_PART1B_AUTH_COMPONENTS.md
  - FULLSTACK_CODE_DATABASE_PART2_TRPC_REALTIME.md
  - FULLSTACK_CODE_DATABASE_PART5_UPLOADS_EXTRAS.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part02.md
  - FULLSTACK_CODE_DATABASE_PART8_HOOKS_ADVANCED.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 25 — SaaS Admin Portal

## Goal
A production-style admin portal with:
- email/password auth
- role-based access (`user` vs `admin`)
- user list + search + pagination
- user profile edit
- authenticated image uploads

This blueprint is grounded in the Better Auth + Fastify + tRPC + Drizzle patterns in Part 1 / Part 2, plus the user router and UploadThing patterns in Part 5.

## Stack (As Documented)
- Backend: Fastify + tRPC + Drizzle(Postgres) + Better Auth
- Frontend: React + TanStack Query (via tRPC client), React Router components present in Part 1B
- UI: reusable DataTable/Modal/Pagination primitives (Part 7)

## Data Model
Use the Drizzle schema from Part 1:
- `user`, `session`, `account`, `verification`

Role:
- Part 1 includes a `rolesEnum` (`user`, `admin`) and a `role` field on user.

## Backend Surface
### Auth
- Mount Better Auth handler at `/api/auth/*` (Part 2 server setup pattern).

### tRPC Procedures
- Use three procedure levels from Part 2:
  - `publicProcedure`
  - `protectedProcedure`
  - `adminProcedure`

### Core Admin Routers
From Part 5 user router:
- `getUsers(page, search?, userId?)` (pagination + search)
- `getUserProfile(id)`
- `updateUser(id, email?, name?, age?)`

## Frontend Pages (Minimal)
- `/login` and `/signup` using the components in Part 1B
- `/users`
  - DataTable columns: ID, Name, Email, Role, CreatedAt
  - Pagination component from Part 7
  - Search input (simple text field feeding `search` param)
- `/users/:id`
  - profile display using `getUserProfile`
  - edit modal (Part 7 Modal) calling `updateUser`

## Uploads
Use UploadThing patterns from Part 5:
- authenticated upload middleware
- `imageUploader` endpoint (max 4MB images)

UI integration:
- call `uploadFiles({ endpoint: 'imageUploader', files: [file] })`
- on success, store returned URL in the user profile field you choose

## UI + UX Primitives (From Part 7 / Part 9)
- Modal: portal + Escape-to-close
- DataTable + Pagination
- Global snackbars (Part 9) for success/error feedback

## Notes / Constraints
- This blueprint intentionally stays within what’s documented: it does not assume a complete admin design system beyond the Part 7 components.
- If you want Next.js instead of React Router, use the Next.js-based patterns from Parts 3–5 instead, but that becomes a different blueprint.
