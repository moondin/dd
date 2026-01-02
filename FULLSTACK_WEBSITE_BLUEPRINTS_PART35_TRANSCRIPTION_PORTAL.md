---
blueprint: "Transcription Portal (Auth + R2 + optional ZK + Whisper microservice)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART16_OPENCUT_TRANSCRIPTION_SERVICE.md
  - FULLSTACK_CODE_DATABASE_PART15_OPENCUT_AUTH_DB_SECURITY.md
  - FULLSTACK_CODE_DATABASE_PART1_AUTHENTICATION.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 35 — Transcription Portal

## Goal
A small fullstack website where authenticated users can:
- upload an audio file for transcription
- optionally encrypt client-side (“zero knowledge”) before upload
- receive transcript text + segments

This blueprint uses the documented Modal + FastAPI + Whisper microservice pattern (Part 16) and the client-side AES-GCM utility pattern (Part 15).

## Architecture (As Documented)
### Backend Web App
- Auth: Better Auth patterns (Part 15 / Part 1)
- Storage: Cloudflare R2 via S3-compatible API (Part 16)
- Rate limiting: Upstash sliding-window helper exists in Part 15

### Microservice
From Part 16:
- Request contract: `{ filename, language="auto", decryptionKey?, iv? }`
- Download blob from R2
- Decrypt if `decryptionKey` + `iv` provided
- Run Whisper
- Delete blob from R2 after processing

## User Flow
1) User signs in
2) User selects audio file
3) Web app uploads audio blob to R2 under a unique filename
   - If user enabled “ZK mode”, encrypt in browser first using AES-GCM (Part 15 pattern)
4) Web app calls transcription microservice with:
   - `filename`
   - optional `decryptionKey` and `iv` (if encrypted)
5) Web app displays transcript and segments

## UI
Use Part 7 components:
- Upload form
- Modal for “transcription settings” (language)
- DataTable for segment list (start/end/text)

Use Part 9 snackbar:
- upload success/failure
- transcription success/failure

## Notes / Constraints
- Upload mechanism to R2 is described in Part 16’s microservice (boto3). The exact web-app upload path is not fully specified in the database docs, so this blueprint keeps it at the architectural level.
- All cryptography claims are limited to the documented AES-GCM WebCrypto utility (Part 15).
