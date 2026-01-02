---
blueprint: "Asset Library (UploadThing authenticated uploads + gallery)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART5_UPLOADS_EXTRAS.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART8_HOOKS_ADVANCED.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 40 — Asset Library (UploadThing)

## Goal
A website where authenticated users can upload images and browse them in a simple library.

This blueprint is grounded in the UploadThing setup shown in Part 5 (including auth middleware in the upload router).

## Architecture (As Documented)
- Upload backend: UploadThing `FileRouter` with middleware that authenticates (Part 5)
- Client: `generateReactHelpers` + `uploadFiles` helper (Part 5)
- UI: Modal / DataTable / Pagination building blocks (Part 7)
- Feedback: snackbar context for success/failure (Part 9)

## Core Screens
- Upload page
  - select file
  - call `uploadFiles({ files: [file], endpoint: "imageUploader" })`
  - show progress and final URL
- Library page
  - table of uploaded assets (at minimum: URL + uploadedAt)
  - optional pagination (Part 7)

## Notes / Constraints
- Part 5’s UploadThing example shows returning `metadata.userId` and logging `file.url`; it does not specify a database table for persisting asset records, so this blueprint keeps the storage model minimal.
