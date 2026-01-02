---
blueprint: "CRM-Lite (ERP-style patterns + basic UI)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_ODOO_INDEX.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART6_REDUX_APIS.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 31 — CRM-Lite

## Goal
A simple CRM backoffice with:
- lead list + detail view
- basic pipeline stages
- activity logging
- role-based access controls

This blueprint is intentionally pattern-first and based on the Odoo extraction (Parts 10–13 summarized in the Odoo index), with UI primitives from Part 7.

## Backend Architecture (As Documented in Odoo Index)
### Data Model Patterns
Use the Odoo-style modeling patterns (fields, constraints, computed fields):
- computed totals / KPIs via dependency tracking (`@api.depends` pattern)
- validation via python constraints (`@api.constrains` pattern)
- lifecycle hooks (create/write overrides)

### HTTP / API Patterns
Use the Odoo HTTP patterns:
- route decorator approach (`@http.route` pattern)
- request/session environment access pattern
- JSON endpoints for actions where appropriate

### Security Model
Use the layered security model:
- Model ACLs (CRUD permissions per group)
- Record rules (domain filters)
- Field-level group restrictions

## UI (Reusable Components From Part 7)
- List view: DataTable
- Create/Edit: Modal (Formik integration pattern)
- Pagination component
- Global snackbar for success/failure notifications (Part 9)

## Minimal Screens
- Leads list:
  - DataTable columns: Name, Stage, Owner, Last Activity
  - Search input (client side filtering is acceptable if server filtering not implemented)
- Lead detail:
  - editable fields in a modal
  - activities section

## State / API Helpers (Part 6)
If you build the UI as a React SPA, reuse:
- Redux store pattern with localStorage persistence
- Axios request helpers (standard headers, auth headers)

## Notes / Constraints
- This blueprint does not introduce a new, undocumented ORM—only the Odoo-extracted patterns for modeling, security, and HTTP routing.
- If you want a Node/tRPC CRM, that requires creating new Drizzle tables/routers beyond what’s explicitly present; this file stays within the Odoo-pattern material.
