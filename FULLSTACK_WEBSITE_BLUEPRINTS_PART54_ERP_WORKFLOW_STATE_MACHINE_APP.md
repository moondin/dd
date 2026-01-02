---
blueprint: "ERP Workflow State Machine App (state transitions + constraints + audit)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART13_ODOO_BUSINESS_LOGIC.part01.md
  - FULLSTACK_CODE_DATABASE_PART10_ODOO_ORM.part01.md
  - FULLSTACK_CODE_DATABASE_PART12_ODOO_SECURITY.part01.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
---

# Blueprint Part 54 — ERP Workflow State Machine App

## Goal
A small ERP-lite app (e.g., approvals, requests, or tickets) where records:
- move through states (draft → submitted → approved/rejected)
- enforce validation constraints
- log changes

## Backend Patterns (As Documented)
From Part 13:
- state machines & workflows
- constraints & validation (`@api.constrains`)
- lifecycle hooks (CRUD overrides)

From Part 10:
- ORM model + fields + relationships

From Part 12:
- group-based permissions for who can approve

## UI
- List view (DataTable)
- Detail view
- Transition buttons (submit/approve/reject)

## Notes / Constraints
- This blueprint is intentionally generic; the business object can be “request”, “approval”, or “ticket”, but the state machine mechanics come directly from Part 13 patterns.
