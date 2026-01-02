---
blueprint: "Social Moderation Console (Posts/Comments/Votes + Redis caching)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART4_SOCIAL_MEDIA.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 43 — Social Moderation Console

## Goal
An internal moderation console for a Reddit-style community site where moderators can:
- review posts and comments
- inspect vote totals
- remove or flag content

This blueprint is derived from the Prisma schema + post/comment/vote patterns in Part 4.

## Data Model (As Documented)
- Users, Subreddits, Posts, Comments (nested replies), Votes, CommentVotes (Part 4)
- Redis/Upstash caching patterns for votes (Part 4)

## UI
- Queue pages
  - Posts queue (DataTable)
  - Comments queue (DataTable)
- Detail drawer/modal
  - show full post/comment
  - show vote score and recent activity

## Notes / Constraints
- Part 4 documents schema and voting/comment patterns; it does not fully define a moderation action API. Keep actions aligned to the documented data model and existing patterns.
