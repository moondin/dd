---
source_txt: FULLSTACK_CODE_DATABASE_PART14_OPENCUT_STACK_OVERVIEW.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART14 OPENCUT STACK OVERVIEW

## Verbatim Content

```text
========================================
FULLSTACK CODE DATABASE - PART 14
OPENCUT (MONOREPO) - STACK OVERVIEW + FULLSTACK ARCHITECTURE
========================================

Source folder:
- C:\Users\CPUEX\Desktop\pj\OpenCut-main\OpenCut-main

OpenCut is a monorepo (Turborepo) centered on a Next.js 15 web app for a client-side video editor, plus shared packages for auth + database, plus a separate Python transcription microservice.

========================================
1) REPO / WORKSPACE LAYOUT
========================================

Monorepo tooling:
- `turbo.json` (Turborepo)
- `bun.lock` + root `package.json` (Bun workspaces)
- `biome.jsonc` + `ultracite` (lint/format)
- `docker-compose.yaml` (local DB/redis services)

Workspace layout:
- apps/web/                 Next.js app (frontend + API routes)
- apps/transcription/       Python microservice (Modal + Whisper)
- packages/auth/            Better Auth integration (server + client)
- packages/db/              Drizzle ORM + schema + env keys

Key dependency choices (root):
- Next.js ^15.5.7
- Drizzle ORM ^0.44.x (Postgres)
- better-auth
- Upstash Redis + rate limiting
- mediabunny, ffmpeg.wasm (client-side media processing)

========================================
2) NEXT.JS APP SHAPE (apps/web)
========================================

Observed structure (apps/web/src):
- app/               Next.js App Router pages/routes
- components/        UI + editor components
- hooks/             editor-specific hooks (timeline zoom, drag/drop, etc.)
- stores/            Zustand stores for editor state (timeline/media/project/etc)
- lib/               core editor logic (rendering, export, media processing)
- middleware.ts      edge middleware for domain redirect
- env.ts             env validation (t3-env)

Design intent:
- Heavy client-side editor logic (timeline, rendering, export) runs in-browser.
- Backend is used for auth, persistence, waitlist, optional services (transcription).

========================================
3) ENV VALIDATION PATTERN (t3-env)
========================================

Pattern: share typed env “keys()” factories from packages and compose them in the app.

- packages/db/src/keys.ts defines DATABASE_URL requirement.
- packages/auth/src/keys.ts defines Better Auth secret + Upstash Redis, plus public auth URL.
- apps/web/src/env.ts composes multiple env schemas:

Key concept:
- `createEnv({ extends: [vercel(), auth(), db()] ... })`
- Avoids drifting env definitions across packages.

Reusable pattern:
- Create per-package env “keys” module.
- In the app, `extends` them into one env.

========================================
4) EDGE MIDDLEWARE PATTERN
========================================

apps/web/src/middleware.ts shows a minimal redirect middleware:
- Checks `request.headers.get("host")`
- Performs `NextResponse.redirect(url, 301)`
- Uses `config.matcher` to exclude API/static paths.

Reusable pattern:
- Domain redirect / canonicalization at the edge
- Minimal surface area (no auth logic in middleware)

========================================
5) CLIENT-SIDE DATA + LOCAL PERSISTENCE
========================================

Two layers (observed):
- Zustand stores for in-memory editor state (timeline/media/playback/etc)
- Browser storage service for persistence:
  - IndexedDB for metadata and project state
  - OPFS (Origin Private File System) for raw media files per project

This gives a privacy-first architecture:
- Video editing “project” state stays local
- Media files stay local
- Optional cloud services exist but can be avoided

========================================
6) OPTIONAL MICROSERVICE (TRANSCRIPTION)
========================================

apps/transcription/transcription.py:
- Modal app exposing a FastAPI endpoint
- Downloads audio from Cloudflare R2
- (Optionally) decrypts with AES-GCM “zero-knowledge” key/IV provided by client
- Runs OpenAI Whisper (GPU A10G)
- Deletes source file from R2 after processing

This is a clean pattern:
- Keep the web app lightweight
- Offload heavy GPU workloads to a managed function
- Keep privacy by deleting uploaded blobs and optionally encrypting client-side

========================================
7) WHAT’S REUSABLE FULLSTACK-WISE
========================================

High-value reusable patterns to port to other apps:
- Monorepo packages for auth + db with shared env validation
- Drizzle schema + Postgres + RLS enablement
- Better Auth + Drizzle adapter + Upstash secondary storage for rate limiting
- Upstash sliding-window rate limit helper
- Browser-local persistence (IndexedDB + OPFS) for privacy-first apps
- Client-side AES-GCM “zero knowledge” encryption utilities
- Python GPU microservice (Modal + FastAPI) integrated via env URL

========================================
END OF PART 14
========================================

```
