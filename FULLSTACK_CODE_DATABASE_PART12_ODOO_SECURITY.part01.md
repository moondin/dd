---
source_txt: FULLSTACK_CODE_DATABASE_PART12_ODOO_SECURITY.txt
converted_utc: 2025-12-17T23:22:00Z
part: 1
parts_total: 2
---

# FULLSTACK CODE DATABASE PART12 ODOO SECURITY

## Verbatim Content (Part 1 of 2)

```text
========================================
FULLSTACK CODE DATABASE - PART 12
ODOO 19.0: SECURITY & ACCESS CONTROL PATTERNS
========================================

This document contains reusable security and access control patterns from Odoo 19.0,
an enterprise-grade ERP system. These patterns demonstrate advanced role-based access 
control (RBAC), row-level security (RLS), field-level security, and audit trails.

========================================
TABLE OF CONTENTS
========================================
1. Access Control Lists (ACL) - Model Level
2. Record Rules - Row-Level Security
3. Field-Level Security
4. Security Groups and Roles
5. Access Rights Checking
6. Security Evaluation Context
7. Multi-Company Security
8. Advanced Security Patterns

========================================
1. ACCESS CONTROL LISTS (ACL) - MODEL LEVEL
========================================

# CSV Format for Model Access Rights
# File: security/ir.model.access.csv

"""
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_partner_manager,Partner Manager,model_res_partner,group_partner_manager,1,1,1,1
access_partner_user,Partner User,model_res_partner,group_user,1,0,0,0
access_partner_public,Partner Public,model_res_partner,group_public,1,0,0,0
access_partner_portal,Partner Portal,model_res_partner,group_portal,1,0,0,0
"""

# Model Access Control Definition
class IrModelAccess(models.Model):
    _name = 'ir.model.access'
    _description = 'Model Access Rights'
    
    name = fields.Char(required=True, index=True)
    model_id = fields.Many2one('ir.model', required=True, index=True, ondelete='cascade')
    group_id = fields.Many2one('res.groups', ondelete='cascade')
    perm_read = fields.Boolean('Read Access')
    perm_write = fields.Boolean('Write Access') 
    perm_create = fields.Boolean('Create Access')
    perm_unlink = fields.Boolean('Delete Access')
    
    # Programmatic Access Rights Check
    @api.model
    def check(self, model_name, mode='read', raise_exception=True):
        """
        Verify access rights for given model and mode.
        
        Args:
            model_name: Name of the model (e.g., 'res.partner')
            mode: 'read', 'write', 'create', or 'unlink'
            raise_exception: Raise AccessError if access denied
            
        Returns:
            bool: True if access granted
        """
        if self.env.su:  # Superuser bypass
            return True
            
        # Get all access rules for this model and user's groups
        access_rules = self._get_access(model_name, mode)
        
        if not access_rules:
            if raise_exception:
                raise AccessError(f"Access Denied: {model_name} ({mode})")
            return False
        return True

# Example: Defining Access Rights in Python
class SalesOrder(models.Model):
    _name = 'sale.order'
    _description = 'Sales Order'
    
    # Automatic access rights check before operations
    @api.model
    def create(self, vals):
        self.check_access_rights('create')
        return super().create(vals)
    
    def write(self, vals):
        self.check_access_rights('write')
        return super().write(vals)
    
    def unlink(self):
        self.check_access_rights('unlink')
        return super().unlink()

========================================
2. RECORD RULES - ROW-LEVEL SECURITY
========================================

# Record Rule Model Definition
class IrRule(models.Model):
    _name = 'ir.rule'
    _description = 'Record Rule'
    _order = 'model_id DESC, id'
    
    name = fields.Char()
    active = fields.Boolean(default=True)
    model_id = fields.Many2one('ir.model', required=True, ondelete='cascade')
    groups = fields.Many2many('res.groups', 'rule_group_rel')
    domain_force = fields.Text('Domain')  # Python domain expression
    
    # Permission flags
    perm_read = fields.Boolean('Read', default=True)
    perm_write = fields.Boolean('Write', default=True)
    perm_create = fields.Boolean('Create', default=True)
    perm_unlink = fields.Boolean('Delete', default=True)
    
    @api.model
    def _eval_context(self):
        """
        Evaluation context for rule domains.
        Available in domain expressions.
        """
        return {
            'user': self.env.user.with_context({}),
            'company_ids': self.env.companies.ids,
            'company_id': self.env.company.id,
            'time': time,
        }
    
    @api.model
    def _compute_domain(self, model_name, mode='read'):
        """
        Compute combined domain from all applicable rules.
        
        Returns:
            Domain: Combined domain for access control
        """
        model = self.env[model_name]
        rules = self._get_rules(model_name, mode)
        
        if not rules:
            return Domain.TRUE
        
        eval_context = self._eval_context()
        user_groups = self.env.user.all_group_ids
        
        global_domains = []  # AND-ed together
        group_domains = []   # OR-ed together
        
        for rule in rules.sudo():
            if rule.groups and not (rule.groups & user_groups):
                continue
            
            dom = Domain(safe_eval(rule.domain_force, eval_context)) if rule.domain_force else Domain.TRUE
            
            if rule.groups:
                group_domains.append(dom)  # User in group, OR with other group rules
            else:
                global_domains.append(dom)  # Global rule, AND with all
        
        # Combine: global_rule1 AND global_rule2 AND (group_rule1 OR group_rule2)
        if group_domains:
            global_domains.append(Domain.OR(group_domains))
        
        return Domain.AND(global_domains).optimize(model)
    
    def _get_rules(self, model_name, mode='read'):
        """Get all applicable rules for model and mode."""
        if self.env.su:
            return self.browse(())
        
        sql = """
            SELECT r.id FROM ir_rule r
            JOIN ir_model m ON (r.model_id = m.id)
            WHERE m.model = %s 
                AND r.active 
                AND r.perm_%s
                AND (NOT r.global OR r.id IN (
                    SELECT rule_group_id FROM rule_group_rel 
                    WHERE group_id IN %s
                ))
        """
        self.env.cr.execute(sql, (model_name, mode, tuple(self.env.user._get_group_ids())))
        return self.browse([r[0] for r in self.env.cr.fetchall()])

# XML Record Rule Examples
"""
<!-- Global rule: Everyone sees only their own records -->
<record id="rule_my_records_only" model="ir.rule">
    <field name="name">My Records Only</field>
    <field name="model_id" ref="model_sale_order"/>
    <field name="domain_force">[('user_id', '=', user.id)]</field>
    <field name="perm_read" eval="True"/>
    <field name="perm_write" eval="True"/>
    <field name="perm_create" eval="True"/>
    <field name="perm_unlink" eval="True"/>
</record>

<!-- Group rule: Sales managers see all records -->
<record id="rule_sales_manager_all" model="ir.rule">
    <field name="name">Sales Manager: See All</field>
    <field name="model_id" ref="model_sale_order"/>
    <field name="groups" eval="[(4, ref('sales_team.group_sale_manager'))]"/>
    <field name="domain_force">[(1, '=', 1)]</field>  <!-- Always true -->
</record>

<!-- Multi-company rule -->
<record id="rule_company_records" model="ir.rule">
    <field name="name">Company Records</field>
    <field name="model_id" ref="model_res_partner"/>
    <field name="domain_force">['|', ('company_id', '=', False), ('company_id', 'in', company_ids)]</field>
</record>

<!-- Team-based access -->
<record id="rule_team_access" model="ir.rule">
    <field name="name">Team Access</field>
    <field name="model_id" ref="model_crm_lead"/>
    <field name="domain_force">[('team_id.member_ids', 'in', [user.id])]</field>
</record>
"""

# Advanced Record Rule Patterns
class ProjectTask(models.Model):
    _name = 'project.task'
    
    # Define record rules in Python (rare, usually XML)
    @api.model
    def _register_hook(self):
        """Create dynamic record rules on module load."""
        self.env['ir.rule'].create({
            'name': 'Task Access - Project Members',
            'model_id': self.env['ir.model']._get('project.task').id,
            'domain_force': "[('project_id.member_ids', 'in', [user.id])]",
            'groups': [(4, self.env.ref('project.group_project_user').id)],
        })

========================================
3. FIELD-LEVEL SECURITY
========================================

# Field-level access control using groups attribute
class Employee(models.Model):
    _name = 'hr.employee'
    
    name = fields.Char('Name', required=True)
    job_title = fields.Char('Job Title')
    
    # Only HR managers can read/write salary
    salary = fields.Monetary(
        'Salary',
        groups='hr.group_hr_manager'  # Field visible only to this group
    )
    
    # Multiple groups (OR logic)
    confidential_notes = fields.Text(
        'Confidential Notes',
        groups='hr.group_hr_manager,base.group_system'
    )
    
    # Computed field with security
    @api.depends('salary')
    def _compute_annual_salary(self):
        # Automatically inherits security from dependency
        for emp in self:
            emp.annual_salary = emp.salary * 12
    
    annual_salary = fields.Monetary(
        'Annual Salary',
        compute='_compute_annual_salary',
        groups='hr.group_hr_manager'
    )

# Dynamic field visibility based on user permissions
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    margin = fields.Float('Margin', groups='sales_team.group_sale_manager')
    cost_price = fields.Float('Cost', groups='sales_team.group_sale_manager')
    
    @api.model
    def fields_get(self, allfields=None, attributes=None):
        """
        Override to dynamically hide fields based on complex logic.
        """
        res = super().fields_get(allfields, attributes)
        
        # Hide sensitive fields for non-managers
        if not self.env.user.has_group('sales_team.group_sale_manager'):
            sensitive_fields = ['margin', 'cost_price']
            for field in sensitive_fields:
                if field in res:
                    res[field]['readonly'] = True
                    res[field]['searchable'] = False
        
        return res

========================================
4. SECURITY GROUPS AND ROLES
========================================

# Security Group Definition (XML)
"""
<!-- Category for organizing groups -->
<record id="module_category_sales" model="ir.module.category">
    <field name="name">Sales</field>
    <field name="sequence">5</field>
</record>

<!-- Base group -->
<record id="group_sale_salesman" model="res.groups">
    <field name="name">User: Own Documents Only</field>
    <field name="category_id" ref="module_category_sales"/>
    <field name="implied_ids" eval="[(4, ref('base.group_user'))]"/>
</record>

<!-- Advanced group (inherits base) -->
<record id="group_sale_salesman_all_leads" model="res.groups">
    <field name="name">User: All Documents</field>
    <field name="category_id" ref="module_category_sales"/>
    <field name="implied_ids" eval="[(4, ref('group_sale_salesman'))]"/>
</record>

<!-- Manager group (inherits all) -->
<record id="group_sale_manager" model="res.groups">
    <field name="name">Administrator</field>
    <field name="category_id" ref="module_category_sales"/>
    <field name="implied_ids" eval="[(4, ref('group_sale_salesman_all_leads'))]"/>
    <field name="users" eval="[(4, ref('base.user_admin'))]"/>
</record>
"""

# Programmatic Group Management
class ResUsers(models.Model):
    _inherit = 'res.users'
    
    def has_group(self, group_ext_id):
        """
        Check if user belongs to a group.
        
        Args:
            group_ext_id: External ID like 'sales_team.group_sale_manager'
        """
        group = self.env.ref(group_ext_id, raise_if_not_found=False)
        return group and group in self.groups_id
    
    def _get_group_ids(self):
        """Get all group IDs for the user (including implied groups)."""
        return self.all_group_ids.ids
    
    # Adding users to groups programmatically
    @api.model
    def assign_sales_manager(self, user_id):
        user = self.browse(user_id)
        manager_group = self.env.ref('sales_team.group_sale_manager')
        user.groups_id = [(4, manager_group.id)]  # Add to group

# Group Hierarchy Example
class ResGroups(models.Model):
    _inherit = 'res.groups'
    
    # implied_ids: Groups that are automatically granted
    # Users in this group automatically get all implied groups
    implied_ids = fields.Many2many(
        'res.groups',
        'res_groups_implied_rel',
        'gid',
        'hgid',
        string='Inherits'
    )

========================================
5. ACCESS RIGHTS CHECKING
========================================

# Checking Access Rights in Code
class SalesOrder(models.Model):
    _name = 'sale.order'
    
    def action_confirm(self):
        """Confirm sales order - requires write access."""
        # Check if user has write permission
        self.check_access_rights('write')
        
        # Check record rules
        self.check_access_rule('write')
        
        # Combined check
        self.check_access('write')  # Both rights + rules
        
        # Continue with business logic
        self.state = 'sale'
    
    def _check_custom_permission(self):
        """Custom permission check."""
        if not self.env.user.has_group('sales_team.group_sale_manager'):
            raise AccessError(_("Only sales managers can perform this action."))
    
    @api.model
    def check_access_rights(self, operation, raise_exception=True):
        """
        Check model-level access rights.
        
        Args:
            operation: 'read', 'write', 'create', 'unlink'
            raise_exception: Raise error if access denied
        """
        return self.env['ir.model.access'].check(
            self._name,
            operation,
            raise_exception
        )
    
    def check_access_rule(self, operation):
        """
        Check record-level access rules.
        Applies domain filters from ir.rule.
        """
        if self.env.su:  # Superuser bypass
            return
        
        domain = self.env['ir.rule']._compute_domain(self._name, operation)
        if domain:
            # Check if all records pass the domain
            failing = self.filtered_domain(domain.invert())
            if failing:
                raise AccessError(_("You cannot access these records."))

# Using sudo() to bypass security
class Invoice(models.Model):
    _name = 'account.move'
    
    def _post_processing(self):
        """Internal processing that needs elevated permissions."""
        # Bypass all security checks
        self.sudo().write({'posted': True})
        
        # Bypass specific checks, keep audit trail
        self.with_user(SUPERUSER_ID).write({'state': 'posted'})
    
    def get_sensitive_data(self):
        """Access data user normally couldn't see."""
        # Check permission first
        if not self.user_has_groups('account.group_account_manager'):
            raise AccessError("Access Denied")
        
        # Use sudo for specific query
        return self.env['account.move.line'].sudo().search([
            ('move_id', '=', self.id),
            ('account_id.internal_type', '=', 'receivable')
        ])

# Conditional access based on record state
class PurchaseOrder(models.Model):
    _name = 'purchase.order'
    
    state = fields.Selection([
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('confirmed', 'Confirmed'),
        ('done', 'Done'),
        ('cancel', 'Cancelled')
    ])
    
    def write(self, vals):
        """Restrict modifications based on state."""
        for order in self:
            if order.state in ['done', 'cancel']:
                if not self.env.user.has_group('purchase.group_purchase_manager'):
                    raise AccessError(_("Cannot modify completed orders."))
        
        return super().write(vals)

========================================
6. SECURITY EVALUATION CONTEXT
========================================

# Variables available in security rules (domain_force)
"""
user         - Current user record (res.users)
company_id   - Current company ID
company_ids  - List of allowed company IDs (multi-company)
time         - Python time module for date comparisons
"""

# Example security domains using context variables
"""
<!-- User's own records -->
[('user_id', '=', user.id)]

<!-- User's team records -->
[('team_id.member_ids', 'in', [user.id])]

<!-- Multi-company -->
['|', ('company_id', '=', False), ('company_id', 'in', company_ids)]

<!-- Date-based access -->
[('date_start', '<=', time.strftime('%Y-%m-%d'))]

<!-- Hierarchical access (manager sees team) -->
['|', ('user_id', '=', user.id), ('user_id.parent_id', '=', user.id)]

<!-- Complex OR conditions -->
['|', '|', 
    ('user_id', '=', user.id),
    ('team_id.user_id', '=', user.id),
    ('follower_ids', 'in', [user.partner_id.id])
]
"""

# Custom context for security checks
class SalesTeam(models.Model):
    _name = 'crm.team'
    
    def with_security_context(self):
        """Add custom variables to security context."""
        return self.with_context(
            allowed_team_ids=self.env.user.team_ids.ids,
            is_team_leader=self.env.user.is_team_leader,
        )

========================================
7. MULTI-COMPANY SECURITY
========================================

# Multi-company model pattern
class Product(models.Model):
    _name = 'product.product'
    
    # Company field enables multi-company security
    company_id = fields.Many2one(
        'res.company',
        'Company',
        index=True,
        default=lambda self: self.env.company
    )
    
    # Automatic multi-company record rule (XML)
    """
    <record id="product_comp_rule" model="ir.rule">
        <field name="name">Product: multi-company</field>
        <field name="model_id" ref="model_product_product"/>
        <field name="domain_force">
            ['|', ('company_id', '=', False), ('company_id', 'in', company_ids)]
        </field>
    </record>
    """
    
    # Company-dependent fields (different value per company)
    price = fields.Float('Price', company_dependent=True)
    # Stored as property: ir.property with company_id

# Switching companies
class ResUsers(models.Model):
    _inherit = 'res.users'
    
    def switch_company(self, company_id):
        """Switch user's active company."""
        self.ensure_one()
        if company_id not in self.company_ids.ids:
            raise AccessError(_("You don't have access to this company."))
        
        self.company_id = company_id
        # Security context updated automatically

# Multi-company aware searches
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    company_id = fields.Many2one('res.company', required=True)
    
    @api.model
    def _search(self, args, offset=0, limit=None, order=None, access_rights_uid=None):
        """Auto-filter by allowed companies."""
        # company_ids from context automatically applied via record rules
        return super()._search(args, offset, limit, order, access_rights_uid)

========================================
8. ADVANCED SECURITY PATTERNS
========================================

# 1. Audit Trail Pattern
class AuditMixin(models.AbstractModel):
    """Mixin for audit trail functionality."""
    _name = 'audit.mixin'
    _description = 'Audit Trail Mixin'
    
    create_uid = fields.Many2one('res.users', 'Created by', readonly=True)
    create_date = fields.Datetime('Created on', readonly=True)
    write_uid = fields.Many2one('res.users', 'Last Updated by', readonly=True)
    write_date = fields.Datetime('Last Updated on', readonly=True)
    
    def _track_changes(self, vals):
        """Track field changes for audit."""
        changes = []
        for field_name, new_value in vals.items():
            if field_name in self._fields:
                old_value = self[field_name]
                if old_value != new_value:
                    changes.append({
                        'field': field_name,
                        'old_value': old_value,
                        'new_value': new_value,
                        'user_id': self.env.user.id,
                        'timestamp': fields.Datetime.now(),
                    })
        return changes

# 2. Temporary Elevated Permissions
@contextmanager
def temporarily_allow_all(env):
    """Context manager for temporary superuser access."""
    old_uid = env.uid
    try:
        env.uid = SUPERUSER_ID
        yield
    finally:
        env.uid = old_uid

# Usage:
def process_system_data(self):
    with temporarily_allow_all(self.env):
        # Perform privileged operations
        self.env['ir.config_parameter'].set_param('key', 'value')

# 3. Field Value Security (Sanitization)
class MailMessage(models.Model):
    _name = 'mail.message'
    
    # HTML field with automatic sanitization
    body = fields.Html(
        'Contents',
        sanitize=True,              # Remove dangerous HTML
        sanitize_tags=True,         # Whitelist tags
        sanitize_attributes=True,   # Whitelist attributes
        sanitize_style=False,       # Allow style
        strip_classes=False         # Keep classes
    )

# 4. API Key Security
class ResUsers(models.Model):
    _inherit = 'res.users'
    
    api_key_ids = fields.One2many('res.users.apikeys', 'user_id')
    
    def _check_credentials(self, password, env):
        """Check password or API key."""
        try:
            # Standard password check
            return super()._check_credentials(password, env)
        except AccessDenied:
            # Try API key authentication
            self.env.cr.execute("""
                SELECT id FROM res_users_apikeys
                WHERE user_id = %s AND key = %s
            """, (self.id, password))
            if not self.env.cr.fetchone():
                raise
            return True

# 5. Rate Limiting / Brute Force Protection
class IrHttp(models.AbstractModel):
    _inherit = 'ir.http'
    
    @classmethod
    def _auth_method_api_key(cls):
        """API key authentication with rate limiting."""
        api_key = request.httprequest.headers.get('X-API-Key')
        if not api_key:
            raise AccessDenied()
        
        # Check rate limit
        attempts = cls._get_auth_attempts(api_key)
        if attempts > 10:  # Max 10 attempts per minute
            raise AccessDenied("Rate limit exceeded")
        
        # Authenticate
        user = request.env['res.users'].sudo().search([
            ('api_key_ids.key', '=', api_key)
        ], limit=1)
        
        if not user:
            cls._record_auth_attempt(api_key)
            raise AccessDenied()
        
        request.uid = user.id

# 6. Delegation Pattern
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    user_id = fields.Many2one('res.users', 'Salesperson')
    delegate_to_id = fields.Many2one('res.users', 'Delegated To')
    
    def _get_authorized_users(self):
        """Get users who can access this record."""
        authorized = self.user_id
        if self.delegate_to_id:
            authorized |= self.delegate_to_id
        if self.user_id.parent_id:  # Manager
            authorized |= self.user_id.parent_id
        return authorized
    
    @api.model
    def _get_my_orders_domain(self):
        """Domain for 'my orders' view including delegated orders."""
        return [
            '|', '|',
            ('user_id', '=', self.env.user.id),
            ('delegate_to_id', '=', self.env.user.id),
            ('user_id.parent_id', '=', self.env.user.id)
        ]

========================================
INTEGRATION EXAMPLES
========================================

# Complete Security Setup for Custom Module

# 1. security/security.xml - Define groups
"""
<?xml version="1.0" encoding="utf-8"?>
<odoo>

```
