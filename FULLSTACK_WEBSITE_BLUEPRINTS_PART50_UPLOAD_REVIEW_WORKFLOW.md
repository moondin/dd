---
blueprint: "Upload + Review Workflow (UploadThing + authenticated middleware + queue UI)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART5_UPLOADS_EXTRAS.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 50 — Upload + Review Workflow

## Goal
A lightweight internal workflow site where:
- users upload assets (authenticated)
- uploads appear in a “review queue”
- reviewers mark items approved/rejected

## Upload Layer (As Documented)
From Part 5:
- UploadThing `FileRouter` with auth middleware
- `uploadFiles` React helper

## UI
From Part 7:
- DataTable for review queue
- Modal for asset preview + approve/reject

From Part 9:
- snackbar for success/failure

## Notes / Constraints
- Part 5 shows uploads and logs URL/metadata; it does not define persistence for queue records. Keep the queue model minimal and only add storage if a documented pattern exists elsewhere.
