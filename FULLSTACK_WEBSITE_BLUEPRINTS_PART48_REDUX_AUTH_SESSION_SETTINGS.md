---
blueprint: "Redux Auth Session + Settings (localStorage-synced slices + auth headers)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART6_REDUX_APIS.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 48 — Redux Auth Session + Settings

## Goal
A simple account/settings website where:
- user session is stored in Redux and persisted to localStorage
- API calls automatically attach `Authorization: Bearer <token>`
- user can edit profile settings in a modal

## Architecture (As Documented)
From Part 6:
- Redux Toolkit slice with reducers that sync state to localStorage
- `authHeaders()` that reads the active user from localStorage and returns Axios headers

From Part 7:
- Modal UI for editing settings

## Screens
- Profile page
  - show current active user state
  - open settings modal
- Settings modal
  - update persisted settings via Redux action
- API test page (optional)
  - call a protected endpoint using Axios request helpers and `authHeaders()`

## Notes / Constraints
- This blueprint is focused on client/session state + request utility patterns; it does not assume any specific auth provider beyond what Part 6 shows.
