---
blueprint: "Local-First Project Manager (IndexedDB + OPFS + optimistic UI)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART17_OPENCUT_EDITOR_STATE_ZUSTAND.md
  - FULLSTACK_CODE_DATABASE_PART18_OPENCUT_LOCAL_PERSISTENCE_IDB_OPFS.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART8_HOOKS_ADVANCED.md
---

# Blueprint Part 37 — Local-First Project Manager

## Goal
A browser-based “projects” website where:
- project metadata is stored in IndexedDB
- large files are stored in OPFS
- the UI supports optimistic updates + rollback

This blueprint is derived directly from the local persistence architecture documented in Part 18.

## Storage Model (As Documented)
- IndexedDB stores:
  - projects, timelines, media metadata
- OPFS stores:
  - per-project file directory `media-files-${projectId}`

## Key Reusable Components
From Part 18:
- `IndexedDBAdapter<T>`
- `OPFSAdapter`
- `StorageService` orchestration:
  - per-project adapter factories
  - scene-aware naming
  - Date serialization boundary
  - SVG MIME edge-case handling

## UI
- Project list: DataTable + Pagination
- Project create/edit: Modal
- Media library: simple list + upload

## UX Patterns
From Part 18 (and referenced Part 17 behavior):
- Optimistic UI: update state immediately
- Persist in background
- Roll back on error

## Notes / Constraints
- This blueprint is fully local-first. If you want sync/multi-device, that’s not documented here.
