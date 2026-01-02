---
blueprint: "ERP Scheduled Jobs Monitor (cron jobs + state + retries)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART13_ODOO_BUSINESS_LOGIC.part01.md
  - FULLSTACK_CODE_DATABASE_PART11_ODOO_HTTP.md
  - FULLSTACK_CODE_DATABASE_PART12_ODOO_SECURITY.part01.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
---

# Blueprint Part 53 — ERP Scheduled Jobs Monitor

## Goal
A backoffice monitor for scheduled actions where admins can:
- view scheduled jobs
- see last run status
- trigger a run (if permitted)

## Backend Patterns (As Documented)
From Part 13:
- scheduled actions (cron jobs) patterns
- batch processing patterns
- transaction management patterns

Security (Part 12):
- admin-only access via groups/ACL

HTTP (Part 11):
- expose list/detail and “run now” controller endpoints

## UI
From Part 7:
- Jobs list (DataTable)
- Job detail modal with last run info

## Notes / Constraints
- Keep the monitor aligned with the documented cron/job patterns; do not assume a distributed job queue unless present in the database.
