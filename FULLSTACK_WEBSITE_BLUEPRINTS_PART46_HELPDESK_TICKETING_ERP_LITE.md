---
blueprint: "Helpdesk / Ticketing (Odoo-style ORM + ACL + workflow)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_ODOO_INDEX.md
  - FULLSTACK_CODE_DATABASE_PART10_ODOO_ORM.part01.md
  - FULLSTACK_CODE_DATABASE_PART11_ODOO_HTTP.md
  - FULLSTACK_CODE_DATABASE_PART12_ODOO_SECURITY.part01.md
  - FULLSTACK_CODE_DATABASE_PART13_ODOO_BUSINESS_LOGIC.part01.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
---

# Blueprint Part 46 — Helpdesk / Ticketing (ERP-Lite)

## Goal
A backoffice ticketing system where:
- agents create/update tickets
- tickets move through a workflow (new → in_progress → resolved)
- access is controlled by ACL/record rules

This blueprint is grounded in the Odoo-style patterns captured in Parts 10–13.

## Backend Patterns (As Documented)
- ORM-style models
  - fields, relationships, computed fields (Part 10)
- HTTP routing/controller patterns (Part 11)
- Security
  - groups, ACL, record rules (Part 12)
- Business logic hooks
  - on-change, constraints, workflow transitions (Part 13)

## UI
- Ticket list (DataTable + Pagination)
- Ticket detail view
- Status transition actions

## Notes / Constraints
- This blueprint uses Odoo concepts as documented (models + ACL + workflows) and keeps UI minimal.
