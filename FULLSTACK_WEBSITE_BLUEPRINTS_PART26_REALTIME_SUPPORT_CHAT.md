---
blueprint: "Realtime Support Chat / Team Inbox"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART2_TRPC_REALTIME.md
  - FULLSTACK_CODE_DATABASE_PART1_AUTHENTICATION.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 26 — Realtime Support Chat / Team Inbox

## Goal
A simple support chat / internal team inbox that supports:
- authenticated access
- realtime message stream to connected clients
- message persistence (where documented)

## Stack (As Documented)
- Backend: Fastify + tRPC, Server-Sent Events (SSE)
- Auth: Better Auth session in tRPC context (Part 2)
- UI: basic React components; optional DataTable for message history listing

## Backend Design
### Context + Auth Gate
- Use Part 2 context creation:
  - `auth.api.getSession({ headers })`
  - fetch full user from DB
- Enforce auth via `protectedProcedure`.

### Chat Router Shape
Part 2 documents a realtime chat system using SSE. The reusable pattern:
- An endpoint that keeps an SSE connection open.
- A broadcast mechanism that pushes new messages to subscribed clients.
- A mutation that creates a message and triggers broadcast.

## Minimal Routes
- `message.send` (protected mutation)
- `message.stream` (protected subscription-like SSE endpoint)
- (optional) `message.history` (protected query)

## Frontend Design
- Chat page:
  - message list
  - input box + send button
  - subscribe to SSE stream and append new messages

## UI Feedback
- Use SnackBar context (Part 9) for:
  - send failures
  - reconnect notices

## Notes / Constraints
- This blueprint sticks to the SSE + tRPC patterns present in Part 2.
- If you want WebSockets instead, that is not part of the documented source here.
