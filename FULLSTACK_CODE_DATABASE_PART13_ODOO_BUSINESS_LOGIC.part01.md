---
source_txt: FULLSTACK_CODE_DATABASE_PART13_ODOO_BUSINESS_LOGIC.txt
converted_utc: 2025-12-17T23:22:00Z
part: 1
parts_total: 2
---

# FULLSTACK CODE DATABASE PART13 ODOO BUSINESS LOGIC

## Verbatim Content (Part 1 of 2)

```text
========================================
FULLSTACK CODE DATABASE - PART 13
ODOO 19.0: BUSINESS LOGIC & WORKFLOW PATTERNS
========================================

This document contains reusable business logic patterns and workflow automation
from Odoo 19.0, demonstrating computed fields, constraints, lifecycle hooks,
scheduled actions (cron jobs), and state machines.

========================================
TABLE OF CONTENTS
========================================
1. Computed Fields & Dependencies
2. Constraints & Validation
3. Lifecycle Hooks (CRUD Overrides)
4. Scheduled Actions (Cron Jobs)
5. State Machines & Workflows
6. Batch Processing Patterns
7. Transaction Management
8. Business Logic Best Practices

========================================
1. COMPUTED FIELDS & DEPENDENCIES
========================================

# Basic Computed Field
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    order_line = fields.One2many('sale.order.line', 'order_id', 'Order Lines')
    
    # Computed field depends on related records
    @api.depends('order_line.price_subtotal')
    def _compute_amount_total(self):
        """Calculate total from order lines."""
        for order in self:
            order.amount_total = sum(order.order_line.mapped('price_subtotal'))
    
    amount_total = fields.Monetary(
        'Total',
        compute='_compute_amount_total',
        store=True,  # Stored in database for performance
        readonly=True
    )

# Nested Dependencies
class SaleOrderLine(models.Model):
    _name = 'sale.order.line'
    
    order_id = fields.Many2one('sale.order', required=True)
    product_id = fields.Many2one('product.product', required=True)
    quantity = fields.Float('Quantity', default=1.0)
    
    # Depends on related model fields (dot notation)
    @api.depends('product_id.list_price', 'quantity', 'order_id.pricelist_id')
    def _compute_price_unit(self):
        """Get price from product, adjusted by pricelist."""
        for line in self:
            product = line.product_id
            pricelist = line.order_id.pricelist_id
            line.price_unit = pricelist.get_product_price(
                product, line.quantity, line.order_id.partner_id
            )
    
    price_unit = fields.Monetary(compute='_compute_price_unit', store=True)
    
    @api.depends('price_unit', 'quantity', 'order_id.discount')
    def _compute_price_subtotal(self):
        """Calculate line subtotal with discount."""
        for line in self:
            price = line.price_unit * line.quantity
            discount = line.order_id.discount / 100
            line.price_subtotal = price * (1 - discount)
    
    price_subtotal = fields.Monetary(compute='_compute_price_subtotal', store=True)

# Context-Dependent Computed Fields
class Product(models.Model):
    _name = 'product.product'
    
    list_price = fields.Float('Sale Price')
    
    # Depends on context variables
    @api.depends_context('pricelist', 'quantity', 'partner_id')
    def _compute_price(self):
        """Calculate price based on context (varies per user)."""
        pricelist = self.env.context.get('pricelist')
        for product in self:
            if pricelist:
                product.price = pricelist.get_product_price(product)
            else:
                product.price = product.list_price
    
    price = fields.Float(
        'Price',
        compute='_compute_price',
        store=False  # Never stored, always computed
    )

# Inverse Methods (Two-way Computed Fields)
class Partner(models.Model):
    _name = 'res.partner'
    
    @api.depends('child_ids.email')
    def _compute_child_emails(self):
        """Get comma-separated child emails."""
        for partner in self:
            emails = partner.child_ids.mapped('email')
            partner.child_emails = ', '.join(filter(None, emails))
    
    def _inverse_child_emails(self):
        """Parse and assign emails back to children."""
        for partner in self:
            emails = [e.strip() for e in partner.child_emails.split(',')]
            for child, email in zip(partner.child_ids, emails):
                child.email = email
    
    child_emails = fields.Char(
        'Child Emails',
        compute='_compute_child_emails',
        inverse='_inverse_child_emails',
        store=False
    )

# Search Methods for Computed Fields
class Product(models.Model):
    _name = 'product.product'
    
    @api.depends('product_tmpl_id.name', 'variant_value_ids.name')
    def _compute_display_name(self):
        for product in self:
            names = [product.product_tmpl_id.name]
            names.extend(product.variant_value_ids.mapped('name'))
            product.display_name = ' - '.join(names)
    
    def _search_display_name(self, operator, value):
        """Enable searching on computed field."""
        if operator == 'ilike':
            return ['|',
                ('product_tmpl_id.name', operator, value),
                ('variant_value_ids.name', operator, value)
            ]
        return []
    
    display_name = fields.Char(
        compute='_compute_display_name',
        search='_search_display_name',
        store=False
    )

# Recursive Dependencies
class Category(models.Model):
    _name = 'product.category'
    
    name = fields.Char('Name', required=True)
    parent_id = fields.Many2one('product.category', 'Parent Category')
    
    # Recursive dependency - depends on itself
    @api.depends('name', 'parent_id.display_name')
    def _compute_display_name(self):
        """Full hierarchical path."""
        for category in self:
            if category.parent_id:
                category.display_name = f"{category.parent_id.display_name} / {category.name}"
            else:
                category.display_name = category.name
    
    display_name = fields.Char(compute='_compute_display_name', store=True)

========================================
2. CONSTRAINTS & VALIDATION
========================================

# Python Constraints
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    date_order = fields.Date('Order Date', required=True)
    date_delivery = fields.Date('Delivery Date')
    amount_total = fields.Monetary('Total')
    
    # Constraint on multiple fields
    @api.constrains('date_order', 'date_delivery')
    def _check_dates(self):
        """Delivery date must be after order date."""
        for order in self:
            if order.date_delivery and order.date_delivery < order.date_order:
                raise ValidationError(_(
                    "Delivery date (%s) cannot be before order date (%s)",
                    order.date_delivery,
                    order.date_order
                ))
    
    @api.constrains('amount_total')
    def _check_amount_positive(self):
        """Total amount must be positive."""
        for order in self:
            if order.amount_total < 0:
                raise ValidationError(_("Order total cannot be negative."))

# SQL Constraints (Database Level)
class Product(models.Model):
    _name = 'product.product'
    
    name = fields.Char('Name', required=True)
    default_code = fields.Char('Internal Reference')
    barcode = fields.Char('Barcode')
    active = fields.Boolean('Active', default=True)
    
    # Define SQL constraints with new Constraint class
    _unique_default_code = models.Constraint(
        'UNIQUE(default_code)',
        'Internal Reference must be unique!'
    )
    
    _unique_barcode_active = models.Constraint(
        'UNIQUE(barcode) WHERE active = true',
        'Barcode must be unique for active products!'
    )
    
    _check_positive_weight = models.Constraint(
        'CHECK(weight >= 0)',
        'Product weight must be positive!'
    )

# Onchange Methods (UI Validation)
class SaleOrderLine(models.Model):
    _name = 'sale.order.line'
    
    product_id = fields.Many2one('product.product', 'Product')
    quantity = fields.Float('Quantity', default=1.0)
    price_unit = fields.Monetary('Unit Price')
    discount = fields.Float('Discount %')
    
    @api.onchange('product_id')
    def _onchange_product_id(self):
        """Update fields when product changes."""
        if self.product_id:
            # Set defaults from product
            self.price_unit = self.product_id.list_price
            self.product_uom_qty = 1.0
            
            # Return warning if needed
            if self.product_id.qty_available <= 0:
                return {
                    'warning': {
                        'title': _("No Stock"),
                        'message': _("Product is out of stock!")
                    }
                }
    
    @api.onchange('quantity', 'price_unit')
    def _onchange_discount(self):
        """Suggest discount for bulk orders."""
        if self.quantity >= 100:
            self.discount = 10.0
        elif self.quantity >= 50:
            self.discount = 5.0

# Complex Validation Logic
class Invoice(models.Model):
    _name = 'account.move'
    
    @api.constrains('line_ids', 'amount_total')
    def _check_balance(self):
        """Ensure invoice lines balance."""
        for invoice in self:
            debit = sum(invoice.line_ids.mapped('debit'))
            credit = sum(invoice.line_ids.mapped('credit'))
            
            if abs(debit - credit) > 0.01:  # Allow rounding errors
                raise ValidationError(_(
                    "Invoice lines must balance:\n"
                    "Debit: %(debit).2f\n"
                    "Credit: %(credit).2f\n"
                    "Difference: %(diff).2f",
                    debit=debit,
                    credit=credit,
                    diff=debit - credit
                ))

========================================
3. LIFECYCLE HOOKS (CRUD OVERRIDES)
========================================

# Create Override
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    @api.model_create_multi
    def create(self, vals_list):
        """Override create to add custom logic."""
        for vals in vals_list:
            # Generate sequence number
            if not vals.get('name') or vals['name'] == '/':
                vals['name'] = self.env['ir.sequence'].next_by_code('sale.order')
            
            # Set default values
            if not vals.get('date_order'):
                vals['date_order'] = fields.Date.today()
            
            # Auto-assign salesperson
            if not vals.get('user_id'):
                vals['user_id'] = self.env.user.id
        
        # Call super to actually create records
        orders = super().create(vals_list)
        
        # Post-creation actions
        for order in orders:
            order._send_order_confirmation()
            order.message_post(body="Order created")
        
        return orders

# Write Override
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    def write(self, vals):
        """Override write to track changes."""
        # Pre-write logic
        for order in self:
            # Prevent modification of confirmed orders
            if order.state != 'draft' and not self.env.user.has_group('sales.group_manager'):
                raise UserError(_("Cannot modify confirmed orders."))
            
            # Track important changes
            if 'amount_total' in vals and vals['amount_total'] != order.amount_total:
                order.message_post(
                    body=f"Total changed from {order.amount_total} to {vals['amount_total']}"
                )
        
        # Perform write
        result = super().write(vals)
        
        # Post-write logic
        if 'state' in vals:
            self._after_state_change(vals['state'])
        
        return result

# Unlink Override
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    def unlink(self):
        """Override unlink to prevent deletion."""
        # Check if any order is confirmed
        if any(order.state != 'draft' for order in self):
            raise UserError(_("Cannot delete confirmed orders. Cancel them first."))
        
        # Archive related records instead of deleting
        self.mapped('order_line').write({'active': False})
        
        # Perform deletion
        return super().unlink()

# Name_get Override (Display Name)
class Partner(models.Model):
    _inherit = 'res.partner'
    
    def name_get(self):
        """Customize how records are displayed."""
        result = []
        for partner in self:
            # Format: "Name [Reference]" or "Name, City"
            name = partner.name
            if partner.ref:
                name = f"{name} [{partner.ref}]"
            elif partner.city:
                name = f"{name}, {partner.city}"
            result.append((partner.id, name))
        return result

# Ondelete Decorators (Prevent Deletion)
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    @api.ondelete(at_uninstall=False)
    def _unlink_if_draft_or_cancel(self):
        """Prevent deletion unless draft or cancelled."""
        for order in self:
            if order.state not in ('draft', 'cancel'):
                raise UserError(_(
                    "Cannot delete order %(name)s in state %(state)s",
                    name=order.name,
                    state=order.state
                ))

# Copy Override (Duplication)
class Project(models.Model):
    _name = 'project.project'
    
    name = fields.Char('Name', required=True, copy=True)
    description = fields.Html('Description', copy=True)
    date_start = fields.Date('Start Date', copy=False)  # Don't copy dates
    task_ids = fields.One2many('project.task', 'project_id', 'Tasks')
    
    def copy(self, default=None):
        """Override copy to customize duplication."""
        default = dict(default or {})
        
        # Append "Copy" to name
        default.setdefault('name', f"{self.name} (Copy)")
        
        # Reset dates
        default.setdefault('date_start', fields.Date.today())
        
        # Create copy
        new_project = super().copy(default)
        
        # Copy tasks manually with modifications
        for task in self.task_ids:
            task.copy({'project_id': new_project.id, 'stage_id': False})
        
        return new_project

========================================
4. SCHEDULED ACTIONS (CRON JOBS)
========================================

# Cron Job Model Definition
class IrCron(models.Model):
    _name = 'ir.cron'
    _description = 'Scheduled Actions'
    
    cron_name = fields.Char('Name', required=True)
    user_id = fields.Many2one('res.users', 'User', default=lambda self: self.env.user)
    active = fields.Boolean('Active', default=True)
    
    # Interval configuration
    interval_number = fields.Integer('Interval Number', default=1)
    interval_type = fields.Selection([
        ('minutes', 'Minutes'),
        ('hours', 'Hours'),
        ('days', 'Days'),
        ('weeks', 'Weeks'),
        ('months', 'Months')
    ], default='days')
    
    nextcall = fields.Datetime('Next Execution', default=fields.Datetime.now)
    lastcall = fields.Datetime('Last Execution')
    priority = fields.Integer('Priority', default=5)  # Lower = higher priority
    
    # Action to execute
    model_id = fields.Many2one('ir.model', 'Model', required=True)
    code = fields.Text('Python Code', default='model.method()')

# XML Cron Definition
"""
<odoo>
    <record id="ir_cron_cleanup_expired_sessions" model="ir.cron">
        <field name="name">Clean Expired Sessions</field>
        <field name="model_id" ref="model_ir_http"/>
        <field name="state">code</field>
        <field name="code">model._gc_sessions()</field>
        <field name="interval_number">1</field>
        <field name="interval_type">days</field>
        <field name="numbercall">-1</field>  <!-- Unlimited runs -->
        <field name="active" eval="True"/>
        <field name="priority">10</field>
    </record>
    
    <record id="ir_cron_check_pending_invoices" model="ir.cron">
        <field name="name">Check Pending Invoices</field>
        <field name="model_id" ref="account.model_account_move"/>
        <field name="state">code</field>
        <field name="code">model._check_pending_invoices()</field>
        <field name="interval_number">1</field>
        <field name="interval_type">hours</field>
        <field name="user_id" ref="base.user_admin"/>
    </record>
</odoo>
"""

# Cron Method Implementation
class AccountMove(models.Model):
    _name = 'account.move'
    
    @api.model
    def _check_pending_invoices(self):
        """Scheduled method to process pending invoices."""
        _logger.info("Starting pending invoice check...")
        
        # Get context from cron (last execution time)
        lastcall = self.env.context.get('lastcall')
        
        # Find invoices to process
        domain = [
            ('state', '=', 'draft'),
            ('date_invoice', '<=', fields.Date.today()),
        ]
        if lastcall:
            domain.append(('create_date', '>', lastcall))
        
        invoices = self.search(domain)
        _logger.info(f"Found {len(invoices)} invoices to process")
        
        # Process in batches
        for invoice in invoices:
            try:
                invoice.action_post()
                self.env.cr.commit()  # Commit after each to avoid losing progress
            except Exception as e:
                _logger.error(f"Failed to post invoice {invoice.name}: {e}")
                self.env.cr.rollback()
        
        _logger.info("Finished pending invoice check")

# Manual Cron Trigger
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    def action_schedule_reminder(self):
        """Schedule a reminder cron for this order."""
        cron = self.env['ir.cron'].create({
            'name': f"Reminder: {self.name}",
            'model_id': self.env['ir.model']._get('sale.order').id,
            'code': f"model.browse({self.id})._send_reminder()",
            'interval_type': 'days',
            'interval_number': 7,
            'numbercall': 1,  # Run only once
            'nextcall': fields.Datetime.now() + timedelta(days=7),
        })
        return True

# Cron Failure Handling
class IrCron(models.Model):
    _inherit = 'ir.cron'
    
    failure_count = fields.Integer('Failure Count', default=0)
    first_failure_date = fields.Datetime('First Failure')
    
    def _process_job(self, cron_cr, job):
        """Process one cron job with error handling."""
        try:
            # Execute the job
            super()._process_job(cron_cr, job)
            
            # Reset failure counter on success
            self.browse(job['id']).write({
                'failure_count': 0,
                'first_failure_date': False,
            })
        except Exception as e:
            # Increment failure counter
            cron = self.browse(job['id'])
            cron.failure_count += 1
            
            if not cron.first_failure_date:
                cron.first_failure_date = fields.Datetime.now()
            
            # Deactivate if too many failures
            if cron.failure_count >= 10:
                cron.active = False
                _logger.error(f"Cron {cron.name} deactivated after 10 failures")
            
            raise

========================================
5. STATE MACHINES & WORKFLOWS
========================================

# State Field Definition
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    state = fields.Selection([
        ('draft', 'Quotation'),
        ('sent', 'Quotation Sent'),
        ('sale', 'Sales Order'),
        ('done', 'Locked'),
        ('cancel', 'Cancelled'),
    ], string='Status', default='draft', required=True, tracking=True)
    
    # State transition methods
    def action_quotation_send(self):
        """Send quotation and change state."""
        self.ensure_one()
        if self.state != 'draft':
            raise UserError(_("Only draft orders can be sent."))
        
        # Send email
        self._send_quotation_email()
        
        # Update state
        self.state = 'sent'
        return True
    
    def action_confirm(self):
        """Confirm order."""
        for order in self:
            if order.state not in ('draft', 'sent'):
                raise UserError(_("Only quotations can be confirmed."))
            
            # Validate
            order._validate_before_confirm()
            
            # Generate sequence number if needed
            if order.name == '/':
                order.name = self.env['ir.sequence'].next_by_code('sale.order')
            
            # Create deliveries, invoices, etc.
            order._create_deliveries()
            
        self.state = 'sale'
        return True
    
    def action_done(self):
        """Mark as done."""
        self.ensure_one()
        if self.state != 'sale':
            raise UserError(_("Only confirmed orders can be locked."))
        
        self.state = 'done'
        return True
    
    def action_cancel(self):
        """Cancel order."""
        for order in self:
            if order.state == 'done':
                raise UserError(_("Cannot cancel locked orders."))
            
            # Cancel related records
            order.picking_ids.action_cancel()
            order.invoice_ids.button_cancel()
        
        self.state = 'cancel'
        return True
    
    def action_draft(self):
        """Reset to draft."""
        for order in self:
            if order.state == 'done':
                raise UserError(_("Cannot reset locked orders."))
        
        self.state = 'draft'
        return True

# State-Based Field Attributes
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    partner_id = fields.Many2one(
        'res.partner',
        states={'draft': [('readonly', False)], 'sent': [('readonly', False)]}
    )
    
    order_line = fields.One2many(
        'sale.order.line',
        'order_id',
        states={'cancel': [('readonly', True)], 'done': [('readonly', True)]}
    )

# Activity Tracking (Kanban States)
class Task(models.Model):
    _name = 'project.task'
    
    stage_id = fields.Many2one('project.task.type', 'Stage', tracking=True)
    kanban_state = fields.Selection([
        ('normal', 'In Progress'),
        ('done', 'Ready'),
        ('blocked', 'Blocked'),
    ], default='normal', tracking=True)
    
    def action_next_stage(self):
        """Move to next stage."""
        self.ensure_one()
        stages = self.project_id.type_ids
        current_index = stages.ids.index(self.stage_id.id)
        
        if current_index < len(stages) - 1:
            self.stage_id = stages[current_index + 1]
            self.kanban_state = 'normal'
        else:
            self.stage_id = stages[-1]
            self.kanban_state = 'done'

# Approval Workflows
class PurchaseOrder(models.Model):
    _name = 'purchase.order'
    
    state = fields.Selection([
        ('draft', 'Draft'),
        ('to_approve', 'To Approve'),
        ('approved', 'Approved'),
        ('purchase', 'Purchase Order'),
        ('done', 'Done'),
        ('cancel', 'Cancelled'),
    ], default='draft')
    
    approval_level = fields.Integer('Approval Level', default=0)
    approved_by_ids = fields.Many2many('res.users', 'Approved By')
    
    def action_request_approval(self):
        """Request approval."""
        self.ensure_one()
        if self.state != 'draft':
            raise UserError(_("Only draft orders can request approval."))
        
        # Check amount threshold
        if self.amount_total < 1000:
            # Auto-approve small orders
            return self.action_approve()
        
        self.state = 'to_approve'
        self.approval_level = 1
        
        # Notify approvers
        approvers = self._get_required_approvers()
        self.message_subscribe(partner_ids=approvers.mapped('partner_id').ids)
        self.message_post(
            body=_("Approval requested for %s", self.name),
            subject=_("Purchase Order Approval"),
            message_type='notification',
        )
        return True
    

```
