---
blueprint: "Zero-Knowledge File Drop (Client AES-GCM + object storage + cleanup)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART15_OPENCUT_AUTH_DB_SECURITY.md
  - FULLSTACK_CODE_DATABASE_PART16_OPENCUT_TRANSCRIPTION_SERVICE.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 36 — Zero-Knowledge File Drop

## Goal
A privacy-first file drop website where:
- users upload files that are encrypted in the browser
- the server stores ciphertext only
- decryption keys are never stored server-side
- optional processing jobs can be run only if the user supplies keys

## Core Building Blocks (As Documented)
From Part 15:
- Browser AES-GCM utility:
  - generates random 256-bit key and 96-bit IV
  - encrypts ArrayBuffer and returns `{ encryptedData, key, iv }`
  - base64 encode/decode helpers

From Part 16:
- A server-side worker can decrypt if the request includes base64 key+iv

## Minimal Features
- Auth optional:
  - Can be public or authenticated. If you want auth, use Better Auth patterns (Part 15/Part 1).
- Upload:
  - encrypt file in browser
  - upload ciphertext to object storage
- Share:
  - user receives a “download link” plus a key+iv “secret” they must store

## Notifications
Use SnackBar context (Part 9) for:
- upload complete
- copy-to-clipboard success/failure

## Notes / Constraints
- The database docs include the crypto utility and an example of a worker decrypting for transcription. They do not fully specify a generic download endpoint; this blueprint stays within the documented primitives.
