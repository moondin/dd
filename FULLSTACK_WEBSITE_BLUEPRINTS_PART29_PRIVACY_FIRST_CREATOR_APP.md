---
blueprint: "Privacy-first Creator Web App (Local-first + Optional GPU Microservice)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART14_OPENCUT_STACK_OVERVIEW.md
  - FULLSTACK_CODE_DATABASE_PART15_OPENCUT_AUTH_DB_SECURITY.md
  - FULLSTACK_CODE_DATABASE_PART16_OPENCUT_TRANSCRIPTION_SERVICE.md
  - FULLSTACK_CODE_DATABASE_PART19_OPENCUT_EXPORT_RENDER_PIPELINE.md
---

# Blueprint Part 29 — Privacy-first Creator Web App

## Goal
A creator-focused web app that is intentionally “local-first”:
- projects and primary media stay on-device
- optional cloud/microservice is used only for heavy GPU tasks (e.g., transcription)
- export/render happens client-side in the browser

This blueprint is based on the OpenCut architecture described in Parts 14–16 and 19.

## Stack (As Documented)
- Next.js App Router (OpenCut apps/web)
- Drizzle + Postgres + Better Auth in shared packages
- Upstash rate limiting
- Browser local persistence (IndexedDB + OPFS)
- Optional GPU microservice: Modal + FastAPI + Whisper + Cloudflare R2

## Core Subsystems
### Auth + DB
From Part 15:
- shared `packages/db` and `packages/auth`
- env composition pattern (t3-env)
- RLS enabled on tables (schema-level enablement)

### Privacy-first Storage
From Part 14/15:
- local persistence pattern: IndexedDB (metadata) + OPFS (blob storage)
- optional “zero-knowledge” AES-GCM utility so uploads can be encrypted client-side

### Export / Render
From Part 19:
- canvas-based deterministic rendering at $fps$
- mediabunny pipeline for MP4/WebM
- optional ffmpeg.wasm audio mixing path

### Optional Microservice
From Part 16:
- POST endpoint receives `{ filename, language, decryptionKey?, iv? }`
- downloads blob from Cloudflare R2
- decrypts if keys provided
- runs Whisper
- deletes blob after processing

## Product Shapes You Can Build From This
- Local-first video editor
- Podcast/lecture editor with transcript generation
- Privacy-first “creator studio” where cloud is optional

## Notes / Constraints
- This blueprint only claims what’s present in Parts 14–16 and 19.
- OpenH264 parts in this database are library patterns and are not required for this webapp.
