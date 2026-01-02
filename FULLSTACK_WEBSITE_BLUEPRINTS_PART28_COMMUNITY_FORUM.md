---
blueprint: "Community Forum / Reddit-style Social App"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART4_SOCIAL_MEDIA.md
  - FULLSTACK_CODE_DATABASE_PART5_UPLOADS_EXTRAS.md
---

# Blueprint Part 28 — Community Forum / Reddit-style Social App

## Goal
A Reddit-like community site featuring:
- communities (subreddits)
- posts with validation
- nested comments
- voting on posts and comments
- optional authenticated image uploads

## Stack (As Documented)
- Next.js (13+) app-router style endpoints
- Prisma + MySQL
- Redis (Upstash) caching patterns
- NextAuth-based auth patterns exist in Part 4/5 source context

## Data Model
Use the Prisma schema from Part 4:
- `User`, `Subreddit`, `Subscription`, `Post`, `Comment`
- `Vote` (post) and `CommentVote`

Key documented patterns:
- JSON content storage for rich text (`Post.content`)
- self-referential `Comment` for nested replies
- composite primary keys for votes

## API Endpoints
Part 4 includes:
- Zod validators for type-safe create
- Next.js route handlers for post creation and access checks

Minimum endpoints:
- create post (requires subscription)
- create comment / reply
- vote endpoints

## Uploads
From Part 5 UploadThing:
- authenticated `imageUploader`
- can attach to:
  - user avatars
  - subreddit icons
  - images embedded in posts

## Notes / Constraints
- This blueprint describes a social app that matches what is explicitly documented in Part 4 and Part 5.
- Moderation tooling is not assumed unless explicitly present in the source docs.
