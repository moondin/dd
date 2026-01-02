---
blueprint: "Inventory Manager (ERP-style patterns + audit + ACL)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_ODOO_INDEX.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 32 — Inventory Manager

## Goal
An inventory backoffice with:
- products (SKU, name, category)
- stock moves (in/out/adjustments)
- audit trail (who changed what)
- access control by role/group

## Backend Patterns (Odoo Index)
### Transactions + Consistency
Use the Odoo transaction patterns:
- CRUD methods with rollback behavior
- server-side constraints to prevent negative stock (constraint pattern)

### Security + Audit
Use:
- ACL and record rules for restricting who can adjust stock
- audit fields (`create_uid`, `create_date`, `write_uid`, `write_date` pattern)

### Aggregates / Reporting
Use group/aggregate patterns:
- “read_group”-style grouping for stock on hand by product/category (pattern described in index)

## UI
- Product list: DataTable + Pagination
- Stock adjustment: Modal form
- Notifications: SnackBar context

## Minimal Screens
- Products:
  - list + create/edit
- Stock Moves:
  - list filtered by product
  - create move (in/out/adjust)
- Reports:
  - on-hand by product

## Notes / Constraints
- This blueprint stays within Odoo-extracted patterns; it’s a blueprint for a site you can implement using those patterns.
- It does not assume a prebuilt UI kit beyond Part 7 components.
