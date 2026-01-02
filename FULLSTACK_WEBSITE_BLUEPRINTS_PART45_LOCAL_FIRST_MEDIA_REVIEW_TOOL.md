---
blueprint: "Local-First Media Review Tool (IndexedDB + OPFS + optimistic tagging)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART17_OPENCUT_EDITOR_STATE_ZUSTAND.md
  - FULLSTACK_CODE_DATABASE_PART18_OPENCUT_LOCAL_PERSISTENCE_IDB_OPFS.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 45 — Local-First Media Review Tool

## Goal
A browser-based review tool where users can:
- import media into a local library
- tag/approve/reject items
- work fully offline

This blueprint uses the local persistence split (IDB + OPFS) from Part 18 and the store patterns (optimistic updates + cleanup) from Part 17.

## Storage
- OPFS: store imported media blobs
- IndexedDB: store metadata (tags, status, timestamps)

## State/UX
- Domain stores for:
  - media catalog
  - selection
  - tag/status editor
- Optimistic UI + rollback on persistence failure
- Object URL revoke hygiene (Part 18/Part 17)

## UI
- Library list (DataTable)
- Item detail modal
- Tag editor + status controls

## Notes / Constraints
- This blueprint is intentionally local-only; it does not assume any sync service.
