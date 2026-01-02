---
blueprint: "ERP Audit Log / Activity Feed (create/write metadata + tracking + message_post)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_ODOO_INDEX.md
  - FULLSTACK_CODE_DATABASE_PART12_ODOO_SECURITY.part01.md
  - FULLSTACK_CODE_DATABASE_PART10_ODOO_ORM.part01.md
  - FULLSTACK_CODE_DATABASE_PART11_ODOO_HTTP.md
---

# Blueprint Part 52 — ERP Audit Log / Activity Feed

## Goal
A backoffice site that provides:
- an activity feed showing record changes
- per-record audit metadata
- access controlled by groups/ACL

## Backend Patterns (As Documented)
From the Odoo index (Parts 10–12):
- audit metadata fields:
  - `create_uid`, `create_date`, `write_uid`, `write_date`
- change tracking:
  - `tracking=True` fields
- activity logs:
  - `message_post()`

Security (Part 12):
- ACL/record rules to restrict who can view audit logs

HTTP (Part 11):
- controller routes for list/detail endpoints

## UI
- Activity list (DataTable)
- Record detail view shows audit fields and tracked changes

## Notes / Constraints
- This blueprint stays within the documented Odoo audit concepts; it does not assume a separate external logging system.
