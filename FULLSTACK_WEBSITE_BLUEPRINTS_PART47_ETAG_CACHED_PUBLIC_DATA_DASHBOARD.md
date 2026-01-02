---
blueprint: "ETag-Cached Public Data Dashboard (Axios utils + localStorage + DataTable)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART6_REDUX_APIS.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART8_HOOKS_ADVANCED.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 47 — ETag-Cached Public Data Dashboard

## Goal
A small dashboard that lists data from a public API (example: GitHub API) with:
- caching using ETag + `If-None-Match`
- fallback to cached JSON when server returns 304
- a paginated list UI

## Backend
- Optional. Part 6 documents a client-side GitHub API ETag caching pattern; this blueprint can be entirely frontend.

## Frontend (As Documented)
From Part 6:
- Axios request helpers
- localStorage helpers (`saveETagToLocalStorage`, `getLocalStorageItem`)
- ETag caching strategy for GitHub API

From Part 8:
- `useQueryParams` for `?page=`

From Part 7:
- DataTable + Pagination

## Screens
- Dashboard list
  - fetch list with ETag cache
  - render rows in DataTable
  - Pagination updates query params

## Notes / Constraints
- Only implement caching exactly as shown in Part 6 (ETag stored in localStorage and reused).
