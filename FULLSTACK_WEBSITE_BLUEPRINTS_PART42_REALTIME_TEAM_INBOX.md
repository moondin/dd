---
blueprint: "Realtime Team Inbox (tRPC + SSE + message persistence)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART2_TRPC_REALTIME.md
  - FULLSTACK_CODE_DATABASE_PART1_AUTHENTICATION.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART8_HOOKS_ADVANCED.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 42 — Realtime Team Inbox

## Goal
A multi-user support/team inbox where:
- agents can send/receive messages in realtime
- new messages stream via SSE
- messages are stored in the database

This blueprint uses the exact “real-time chat system” described in Part 2.

## Architecture (As Documented)
- Backend:
  - tRPC router provides a message mutation
  - SSE endpoint streams new messages (Part 2)
  - Drizzle persists messages (Part 2)
- Frontend:
  - Chat component subscribes to SSE stream
  - optimistic UI send + append on receipt

## UI
- Conversation list (DataTable)
- Active conversation view
- Message composer

## Notes / Constraints
- This blueprint stays within the single-stream SSE chat pattern described in Part 2 (no WebSockets assumed).
