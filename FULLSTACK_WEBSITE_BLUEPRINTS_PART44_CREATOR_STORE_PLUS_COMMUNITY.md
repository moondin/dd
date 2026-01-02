---
blueprint: "Creator Store + Community (Stripe/Payload ecommerce + Reddit-style social)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART3_ECOMMERCE_SOCIAL.md
  - FULLSTACK_CODE_DATABASE_PART4_SOCIAL_MEDIA.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 44 — Creator Store + Community

## Goal
A “creator hub” website combining:
- a digital product storefront (Stripe + Payload)
- a community forum (subreddits/posts/comments/votes)

All parts are grounded in Part 3 (DigitalHippo ecommerce) and Part 4 (Breadit social platform).

## Modules
### Storefront (As Documented)
- Product catalog via Payload (Part 3)
- Cart via Zustand (Part 3)
- Stripe checkout + webhook marking orders paid (Part 3)

### Community (As Documented)
- Prisma schema for users/subreddits/posts/comments (Part 4)
- Voting system with Redis caching (Part 4)

## UI
- Store pages: product grid + cart + checkout button
- Community pages: feed, post detail with nested comments

## Notes / Constraints
- Keep cross-linking minimal unless explicitly documented (e.g., “only buyers can post” is not assumed unless present in the database).
