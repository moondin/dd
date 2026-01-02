---
blueprint: "ERP-Lite Backoffice (Odoo-style patterns)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_ODOO_INDEX.md
  - FULLSTACK_CODE_DATABASE_PART10_ODOO_ORM.index.md
  - FULLSTACK_CODE_DATABASE_PART11_ODOO_HTTP.md
  - FULLSTACK_CODE_DATABASE_PART12_ODOO_SECURITY.index.md
  - FULLSTACK_CODE_DATABASE_PART13_ODOO_BUSINESS_LOGIC.index.md
---

# Blueprint Part 30 — ERP-Lite Backoffice

## Goal
A backoffice web app (ERP-lite) built around enterprise-grade patterns documented from Odoo:
- ORM-based domain models with computed fields and constraints
- HTTP routing with explicit auth modes
- ACL + record rules + field-level security concepts
- workflow-style business logic hooks (create/write overrides)

## Stack (As Documented)
- Python 3.10+
- PostgreSQL
- Werkzeug WSGI
- Custom ORM + request/session environment patterns

## Core Architecture
### ORM + Models
From Odoo Parts 10–13 (overview in the index):
- model classes and field types
- domain filtering and recordset operations
- transactional savepoints

### HTTP Layer
From Part 11 (summarized in index):
- `@http.route` decorator
- routes with `type='http'|'json'` and auth modes
- request/session and environment access

### Security
From Part 12 (summarized in index):
- model ACLs (CRUD per group)
- record rules (domain filters)
- field-level group restrictions
- `sudo()` escape hatch pattern

### Business Logic
From Part 13 (summarized in index):
- computed fields with dependency tracking
- constraints (`@api.constrains`)
- lifecycle hooks (create/write overrides)

## Example ERP-Lite Modules You Can Build
These are module shapes that match the documented patterns (not new code):
- CRM-lite: leads, activities, pipeline stage transitions
- Inventory-lite: stock moves and validations
- Order management: order lines, totals computed fields, basic approvals

## Notes / Constraints
- This blueprint is intentionally “pattern-first”: it describes the architecture you can implement using the extracted Odoo patterns.
- It does not claim that the complete Odoo codebase is present here—only the extracted patterns documented in the database.
