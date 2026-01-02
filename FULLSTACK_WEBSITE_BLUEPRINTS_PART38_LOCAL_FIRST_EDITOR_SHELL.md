---
blueprint: "Local-First Editor Shell (Zustand domain stores + undo/redo + playback loop)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART17_OPENCUT_EDITOR_STATE_ZUSTAND.md
  - FULLSTACK_CODE_DATABASE_PART18_OPENCUT_LOCAL_PERSISTENCE_IDB_OPFS.md
  - FULLSTACK_CODE_DATABASE_PART19_OPENCUT_EXPORT_RENDER_PIPELINE.md
---

# Blueprint Part 38 — Local-First Editor Shell

## Goal
A website with “desktop-app style” editor behavior:
- domain-split state stores
- selection-first commands
- undo/redo
- playback loop decoupled from DOM via events
- background autosave

This blueprint is grounded in Part 17 (Zustand architecture) plus Part 18 (storage) and Part 19 (export).

## State Architecture (As Documented)
From Part 17:
- Project store: orchestration of load/clear and active project settings
- Media store: media catalog + URL revoke + cascade delete into timeline
- Timeline store: tracks/elements, history/redo stack, autosave
- Playback store: requestAnimationFrame time loop + DOM event bus
- Keybindings store: persisted shortcut mapping + conflict validation

## Persistence
From Part 18:
- fast UI + slow persistence
- autosave via short setTimeout delay
- store metadata in IndexedDB, blobs in OPFS

## Export
From Part 19:
- deterministic canvas renderer (timeline/time → pixels)
- mediabunny encode pipeline
- optional ffmpeg.wasm audio mixing approach

## Notes / Constraints
- This is a blueprint for an editor shell; it intentionally does not claim additional UI components beyond what is documented.
- For a complete editor product, combine this with the UI primitives in Part 7 and hooks/utilities in Parts 8–9.
