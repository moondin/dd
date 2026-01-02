---
source_txt: FULLSTACK_CODE_DATABASE_ODOO_INDEX.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE ODOO INDEX

## Verbatim Content

````text
========================================
FULLSTACK CODE DATABASE - ODOO 19.0 EXTRACTION INDEX
========================================

This index provides a comprehensive overview of the Odoo 19.0 enterprise ERP patterns
extracted and documented in Parts 10-13 of the fullstack code database.

========================================
EXTRACTION SUMMARY
========================================

Source: Odoo 19.0 (Enterprise-grade ERP System)
Location: C:\Users\CPUEX\Desktop\pj\odoo-19.0\odoo-19.0
Language: Python 3.10+
Database: PostgreSQL
Framework: Custom ORM, Werkzeug WSGI, QWeb Templates

Files Created:
- FULLSTACK_CODE_DATABASE_PART10_ODOO_ORM.txt (23KB) - Database & ORM Patterns
- FULLSTACK_CODE_DATABASE_PART11_ODOO_HTTP.txt (22KB) - HTTP & API Patterns  
- FULLSTACK_CODE_DATABASE_PART12_ODOO_SECURITY.txt (27KB) - Security & Access Control
- FULLSTACK_CODE_DATABASE_PART13_ODOO_BUSINESS_LOGIC.txt (29KB) - Workflows & Business Logic

Total: ~101KB of enterprise-grade fullstack patterns

========================================
PART 10: ORM & DATABASE PATTERNS
========================================

### Core ORM Architecture
- Model Classes: Model, TransientModel, AbstractModel
- Field Types: 30+ field types (Char, Integer, Float, Boolean, Date, Datetime, Many2one, One2many, Many2many, Binary, Html, Json, etc.)
- Relationships: Many2one, One2many, Many2many with relational integrity

### Advanced Features
- Inheritance: Classical (_inherit), Extension (_inherits), Delegation, Mixins
- Computed Fields: @api.depends with automatic recalculation
- Search Domains: Polish notation with operators (&, |, !)
- Recordsets: Lazy evaluation, batch operations, prefetching
- Transactions: Automatic savepoints, rollback support

### Database Operations
- CRUD: create(), read(), write(), unlink() with batch support
- Search: search(), search_count(), search_read() with complex domains
- Query Building: SQL builder with parameterization
- Aggregate Functions: read_group() for GROUP BY operations
- Raw SQL: env.cr.execute() with SQL injection prevention

### Key Decorators
- @api.model - Class methods
- @api.model_create_multi - Batch creation
- @api.depends - Computed field dependencies
- @api.constrains - Validation constraints
- @api.onchange - UI field change handlers
- @api.ondelete - Prevent deletion logic

========================================
PART 11: HTTP & API PATTERNS
========================================

### HTTP Framework
- Werkzeug WSGI Application
- @http.route decorator for URL routing
- Request/Response objects with session management
- JSON-RPC and XML-RPC protocols

### Authentication Types
- type='http' - Standard HTTP with CSRF protection
- type='json' - JSON-RPC endpoints
- auth='public' - No authentication required
- auth='user' - Authenticated user required
- auth='none' - Custom authentication

### Controller Patterns
```python
class WebsiteController(http.Controller):
    @http.route('/shop', type='http', auth='public', website=True)
    def shop(self, **kwargs):
        return request.render('website_sale.products', values)
    
    @http.route('/shop/cart/update_json', type='json', auth='public')
    def cart_update_json(self, product_id, quantity):
        return request.website.sale_get_order()._cart_update(product_id, quantity)
```

### Request Features
- File uploads: request.httprequest.files
- Session management: request.session
- Environment access: request.env
- CORS configuration: cors='*'
- Rate limiting support
- Transaction control per request

========================================
PART 12: SECURITY & ACCESS CONTROL
========================================

### Multi-Layer Security Model

1. **Model-Level Access (ACL)**
   - ir.model.access.csv defines CRUD permissions per model per group
   - Enforced at ORM level before any operation
   - CSV format: model, group, read, write, create, unlink

2. **Record-Level Security (RLS)**
   - ir.rule defines domain filters per model per group
   - Global rules (AND-ed) + Group rules (OR-ed)
   - Context variables: user, company_id, company_ids, time
   - Examples: Own records, team access, multi-company

3. **Field-Level Security**
   - groups attribute on fields restricts visibility
   - Multiple groups with OR logic
   - Computed fields inherit from dependencies

### Security Groups
- Hierarchical groups with implied_ids
- Categories for organization
- User assignment: groups_id Many2many
- Check: user.has_group('module.group_name')

### Access Control Methods
```python
# Check model access
self.check_access_rights('write')

# Check record rules  
self.check_access_rule('write')

# Combined check
self.check_access('write')

# Bypass security
self.sudo().write(vals)  # Use carefully!
```

### Common Security Patterns
- Own records only: [('user_id', '=', user.id)]
- Team access: [('team_id.member_ids', 'in', [user.id])]
- Manager sees all: [(1, '=', 1)] for manager group
- Multi-company: ['|', ('company_id', '=', False), ('company_id', 'in', company_ids)]
- Hierarchical: ['|', ('user_id', '=', user.id), ('user_id.parent_id', '=', user.id)]

### Audit Trail
- create_uid, create_date (automatic)
- write_uid, write_date (automatic)
- tracking=True on fields for change history
- message_post() for activity logs

========================================
PART 13: BUSINESS LOGIC & WORKFLOWS
========================================

### Computed Fields
```python
@api.depends('order_line.price_subtotal')
def _compute_amount_total(self):
    for order in self:
        order.amount_total = sum(order.order_line.mapped('price_subtotal'))

amount_total = fields.Monetary(compute='_compute_amount_total', store=True)
```

Features:
- Dependencies: Field names, related fields (dot notation), recursive
- Storage: store=True for database persistence
- Context-dependent: @api.depends_context
- Inverse methods: Two-way binding
- Search methods: Enable searching on computed fields

### Constraints & Validation

**Python Constraints:**
```python
@api.constrains('date_order', 'date_delivery')
def _check_dates(self):
    for order in self:
        if order.date_delivery < order.date_order:
            raise ValidationError("Invalid dates")
```

**SQL Constraints:**
```python
_unique_code = models.Constraint('UNIQUE(code)', 'Code must be unique!')
_check_positive = models.Constraint('CHECK(amount >= 0)', 'Amount must be positive')
```

**Onchange Handlers:**
```python
@api.onchange('product_id')
def _onchange_product_id(self):
    self.price = self.product_id.list_price
    return {'warning': {'title': 'Warning', 'message': 'Out of stock!'}}
```

### Lifecycle Hooks

**Create Override:**
```python
@api.model_create_multi
def create(self, vals_list):
    for vals in vals_list:
        vals['name'] = self.env['ir.sequence'].next_by_code('sale.order')
    return super().create(vals_list)
```

**Write Override:**
```python
def write(self, vals):
    # Pre-write validation
    for record in self:
        record._validate_modification()
    
    result = super().write(vals)
    
    # Post-write actions
    if 'state' in vals:
        self._after_state_change()
    
    return result
```

**Deletion Prevention:**
```python
@api.ondelete(at_uninstall=False)
def _unlink_if_draft(self):
    if any(order.state != 'draft' for order in self):
        raise UserError("Cannot delete confirmed orders")
```

### Scheduled Actions (Cron Jobs)

**XML Definition:**
```xml
<record id="cron_job" model="ir.cron">
    <field name="name">Daily Cleanup</field>
    <field name="model_id" ref="model_res_partner"/>
    <field name="code">model._cleanup_old_records()</field>
    <field name="interval_type">days</field>
    <field name="interval_number">1</field>
    <field name="active" eval="True"/>
</record>
```

**Implementation:**
```python
@api.model
def _cleanup_old_records(self):
    lastcall = self.env.context.get('lastcall')
    old_records = self.search([('create_date', '<', lastcall)])
    
    # Process in batches
    for record in old_records:
        record.unlink()
        self.env.cr.commit()  # Commit per record
```

### State Machines

```python
state = fields.Selection([
    ('draft', 'Draft'),
    ('confirmed', 'Confirmed'),
    ('done', 'Done'),
    ('cancel', 'Cancelled')
], default='draft', tracking=True)

def action_confirm(self):
    if self.state != 'draft':
        raise UserError("Invalid state transition")
    
    self._validate_confirmation()
    self.state = 'confirmed'
    self._send_confirmation_email()
```

State-based field attributes:
```python
partner_id = fields.Many2one(
    'res.partner',
    states={'draft': [('readonly', False)], 'done': [('readonly', True)]}
)
```

### Batch Processing

```python
@api.model
def _batch_process(self):
    records = self.search(domain, limit=1000)
    batch_size = 50
    
    for i in range(0, len(records), batch_size):
        batch = records[i:i+batch_size]
        
        try:
            for record in batch:
                record.process()
            
            self.env.cr.commit()  # Commit per batch
            
        except Exception as e:
            _logger.error(f"Batch failed: {e}")
            self.env.cr.rollback()
```

========================================
INTEGRATION WITH EXISTING DATABASE
========================================

The Odoo patterns complement existing fullstack database patterns:

### Comparing to Next.js/React Patterns (Parts 1-9)

**ORM Comparison:**
- Odoo ORM ←→ Prisma ORM
- Model.search() ←→ prisma.findMany()
- @api.depends ←→ React useMemo/useEffect
- Recordsets ←→ Array methods (map, filter, reduce)

**HTTP/API:**
- @http.route ←→ Next.js API routes
- JSON-RPC ←→ tRPC procedures
- request.session ←→ next-auth session
- CSRF protection ←→ Next.js CSRF tokens

**Security:**
- ir.rule domains ←→ Prisma middleware filtering
- ir.model.access ←→ tRPC middleware auth checks
- Field groups ←→ Selective field exposure in APIs
- Multi-company ←→ Tenant isolation patterns

**Business Logic:**
- @api.constrains ←→ Zod schema validation
- Computed fields ←→ Derived state in React/Zustand
- State machines ←→ State management (useState, Zustand)
- Cron jobs ←→ Serverless scheduled functions

### Use Cases for Odoo Patterns

1. **E-commerce Platform** (FULLSTACK_WEBSITE_POSSIBILITIES_PART1)
   - Product catalog with variants (PART10: Many2many)
   - Shopping cart (PART11: JSON-RPC cart_update)
   - Order workflow (PART13: State machine)
   - Multi-company support (PART12: company_ids filtering)

2. **CRM System** (crm_lite project)
   - Lead qualification (PART13: Kanban stages)
   - Team-based access (PART12: team record rules)
   - Activity tracking (PART13: mail.activity.mixin)
   - Scheduled follow-ups (PART13: Cron jobs)

3. **Inventory Manager** (inventory_manager project)
   - Stock moves (PART10: One2many relationships)
   - Warehouse rules (PART13: Automated actions)
   - Batch processing (PART13: Mass operations)
   - Multi-location (PART12: Location-based rules)

4. **Admin Dashboard** (Admin_Dashboard project)
   - Role-based access (PART12: Security groups)
   - Reporting (PART10: read_group aggregations)
   - Audit logs (PART12: Tracking)
   - System settings (PART11: Configuration controllers)

========================================
ADVANCED PATTERNS EXTRACTED
========================================

### 1. Domain Filtering System
Polish notation with prefix operators:
```python
[
    '&', ('state', '=', 'draft'),
    '|', ('user_id', '=', uid), ('team_id', 'in', teams)
]
# Reads as: state=draft AND (user_id=uid OR team_id IN teams)
```

### 2. Inheritance Patterns
- Classical: _inherit = 'res.partner' (extend existing)
- Delegation: _inherits = {'res.partner': 'partner_id'} (embed)
- Mixins: _name = 'mail.thread' + _inherit = ['mail.thread'] (compose)
- Abstract: _name = 'abstract.model' (no table)

### 3. Recordset Operations
```python
# Lazy evaluation
partners = self.env['res.partner'].search([])

# Batch operations
partners.write({'active': True})

# Mapping
emails = partners.mapped('email')
companies = partners.mapped('company_id.name')

# Filtering
active = partners.filtered(lambda p: p.active)
recent = partners.filtered_domain([('create_date', '>', date)])

# Sorting
sorted_partners = partners.sorted(key=lambda p: p.name)
```

### 4. Environment Context
```python
# Current user
self.env.user

# Sudo (bypass security)
self.env['model'].sudo()

# With context
self.env['model'].with_context(lang='fr_FR')

# With company
self.env['model'].with_company(company_id)

# Reference to other models
self.env['res.partner'].search([])
```

### 5. Transaction Control
```python
# Auto-commit in cron
self.env.cr.commit()

# Manual rollback
self.env.cr.rollback()

# Savepoints
self.env.cr.execute("SAVEPOINT my_savepoint")
self.env.cr.execute("ROLLBACK TO SAVEPOINT my_savepoint")

# New cursor for separate transaction
with self.pool.cursor() as new_cr:
    new_env = api.Environment(new_cr, self.env.uid, {})
    new_env['model'].create(vals)
    new_cr.commit()
```

### 6. Multi-Model Operations
```python
# Cross-model search
orders = self.env['sale.order'].search([
    ('partner_id.country_id.code', '=', 'US')
])

# Cascade operations
order.order_line.unlink()  # Delete all lines
order.invoice_ids.action_post()  # Post all invoices

# Bulk creation with relations
self.env['sale.order'].create([{
    'partner_id': partner.id,
    'order_line': [(0, 0, {
        'product_id': product.id,
        'quantity': qty
    }) for product, qty in products]
} for partner in partners])
```

========================================
DEPLOYMENT & SCALING PATTERNS
========================================

### Database Optimization
- store=True on computed fields for read-heavy operations
- Indexes: index=True on searchable fields
- Prefetching: Automatic for performance
- Read groups: Aggregate at database level
- SQL constraints: Database-level validation

### Caching Strategies
- @tools.ormcache for method results
- self.env.cache for ORM cache
- Registry cache invalidation
- Computed field cache

### Multi-Processing
- Cron jobs in separate processes
- Database connection pooling
- Transaction isolation per request
- Async task queues (external)

### High Availability
- Master-slave PostgreSQL replication
- Connection failover
- Session persistence
- Stateless HTTP handlers

========================================
MIGRATION TO MODERN STACK
========================================

### Odoo → Next.js/Prisma/tRPC Migration

**Models → Prisma Schema:**
```python
# Odoo
class Partner(models.Model):
    _name = 'res.partner'
    name = fields.Char(required=True)
    email = fields.Char()
```

```prisma
// Prisma
model Partner {
  id    Int     @id @default(autoincrement())
  name  String
  email String?
}
```

**@http.route → Next.js API:**
```python
# Odoo
@http.route('/api/partners', type='json', auth='user')
def get_partners(self):
    return request.env['res.partner'].search_read([])
```

```typescript
// Next.js API Route
export async function GET(request: NextRequest) {
  const session = await getSession();
  const partners = await prisma.partner.findMany();
  return NextResponse.json(partners);
}
```

**Security → tRPC Middleware:**
```python
# Odoo record rule
domain_force = [('user_id', '=', user.id)]
```

```typescript
// tRPC middleware
const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});
```

========================================
CONCLUSION
========================================

The Odoo 19.0 extraction provides enterprise-grade patterns for:

✅ Advanced ORM with inheritance, computed fields, and recordsets
✅ Multi-layer security (model/record/field level)
✅ HTTP framework with JSON-RPC and session management
✅ Business logic: State machines, workflows, batch processing
✅ Scheduled automation with cron jobs
✅ Transaction management and data integrity
✅ Multi-company and multi-user architectures

These patterns are production-tested in thousands of enterprise deployments
and can be adapted to modern fullstack frameworks like Next.js, React, 
Prisma, and tRPC.

### Next Steps

1. **Review existing projects** (crm_lite, inventory_manager, order_management)
   and identify where Odoo patterns can enhance functionality

2. **Implement selected patterns** such as:
   - Record rules for row-level security
   - State machines for order/project workflows
   - Batch processing for mass operations
   - Cron jobs for scheduled tasks

3. **Create hybrid patterns** combining:
   - Odoo domain filtering + Prisma where clauses
   - Odoo computed fields + React derived state
   - Odoo security groups + tRPC middleware
   - Odoo cron + Next.js scheduled functions

========================================
DOCUMENT VERSIONS
========================================

PART10: FULLSTACK_CODE_DATABASE_PART10_ODOO_ORM.txt (23KB)
PART11: FULLSTACK_CODE_DATABASE_PART11_ODOO_HTTP.txt (22KB)
PART12: FULLSTACK_CODE_DATABASE_PART12_ODOO_SECURITY.txt (27KB)
PART13: FULLSTACK_CODE_DATABASE_PART13_ODOO_BUSINESS_LOGIC.txt (29KB)
INDEX: FULLSTACK_CODE_DATABASE_ODOO_INDEX.txt (This file)

Total extraction: ~102KB of reusable enterprise patterns
Source: Odoo 19.0 Community Edition
Date: 2024
License: LGPL v3 (Odoo), MIT (Documentation)

========================================
END OF ODOO EXTRACTION INDEX
========================================

````
