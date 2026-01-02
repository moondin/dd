---
blueprint: "Realtime Notifications Center (SSE stream + UI hooks)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART2_TRPC_REALTIME.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART8_HOOKS_ADVANCED.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 49 — Realtime Notifications Center

## Goal
A website that shows live notifications using Server-Sent Events (SSE):
- a notifications list
- a bell/badge indicator
- real-time updates without websockets

## Backend (As Documented)
From Part 2:
- SSE-based stream pattern used for real-time chat
- tRPC router/mutations pattern

Blueprint adaptation:
- use the same SSE mechanism, but publish “notification” events instead of chat messages

## Frontend (As Documented)
From Part 8:
- event listener hook (`useEventListener`) for keyboard shortcuts (e.g., `Escape` to close)
- boolean hook (`useBooleanState`) to open/close panel

From Part 7:
- Modal/panel presentation

## Screens
- Top bar
  - bell icon opens notifications modal/panel
- Notifications panel
  - list recent notifications (DataTable or simple list)
  - appends new items as SSE events arrive

## Notes / Constraints
- Stays strictly within the “SSE stream” pattern described in Part 2.
