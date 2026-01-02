---
source_txt: FULLSTACK_CODE_DATABASE_PART13_ODOO_BUSINESS_LOGIC.txt
converted_utc: 2025-12-17T23:22:00Z
part: 2
parts_total: 2
---

# FULLSTACK CODE DATABASE PART13 ODOO BUSINESS LOGIC

## Verbatim Content (Part 2 of 2)

```text
    def action_approve(self):
        """Approve purchase order."""
        self.ensure_one()
        
        # Check user permission
        if not self.env.user.has_group('purchase.group_purchase_manager'):
            if self.amount_total > 10000:
                raise UserError(_("Only managers can approve orders over $10,000."))
        
        # Track approver
        self.approved_by_ids = [(4, self.env.user.id)]
        
        # Check if enough approvals
        required_approvals = self._get_required_approval_count()
        if len(self.approved_by_ids) >= required_approvals:
            self.state = 'approved'
            self.action_confirm()
        else:
            self.approval_level += 1
        
        return True

========================================
6. BATCH PROCESSING PATTERNS
========================================

# Batch Processing with Commits
class Invoice(models.Model):
    _name = 'account.move'
    
    @api.model
    def _batch_process_invoices(self):
        """Process invoices in batches to avoid timeout."""
        domain = [('state', '=', 'draft'), ('auto_post', '=', True)]
        invoices = self.search(domain, limit=1000)
        
        batch_size = 50
        for i in range(0, len(invoices), batch_size):
            batch = invoices[i:i+batch_size]
            
            try:
                for invoice in batch:
                    invoice.action_post()
                
                # Commit after each batch
                self.env.cr.commit()
                _logger.info(f"Processed batch {i//batch_size + 1}")
                
            except Exception as e:
                _logger.error(f"Batch failed: {e}")
                self.env.cr.rollback()

# Progress Tracking
class MassOperation(models.TransientModel):
    _name = 'mass.operation.wizard'
    
    total_records = fields.Integer('Total')
    processed_records = fields.Integer('Processed', default=0)
    failed_records = fields.Integer('Failed', default=0)
    progress = fields.Float('Progress %', compute='_compute_progress')
    
    @api.depends('processed_records', 'total_records')
    def _compute_progress(self):
        for wizard in self:
            if wizard.total_records:
                wizard.progress = (wizard.processed_records / wizard.total_records) * 100
            else:
                wizard.progress = 0
    
    def process_records(self):
        """Process records with progress tracking."""
        records = self.env['sale.order'].browse(self.env.context.get('active_ids'))
        self.total_records = len(records)
        
        for record in records:
            try:
                record.action_confirm()
                self.processed_records += 1
            except Exception as e:
                self.failed_records += 1
                _logger.error(f"Failed to process {record.name}: {e}")
            
            # Update progress every 10 records
            if self.processed_records % 10 == 0:
                self.env.cr.commit()
        
        return {
            'type': 'ir.actions.client',
            'tag': 'display_notification',
            'params': {
                'title': _("Processing Complete"),
                'message': _(
                    "Processed: %d\nFailed: %d",
                    self.processed_records,
                    self.failed_records
                ),
                'type': 'success',
            }
        }

# Parallel Processing (Careful!)
class ReportGeneration(models.Model):
    _name = 'report.generation'
    
    @api.model
    def generate_reports_parallel(self, company_ids):
        """Generate reports for multiple companies in parallel."""
        from multiprocessing import Pool
        
        def process_company(company_id):
            """Worker function - runs in separate process."""
            with self.pool.cursor() as new_cr:
                env = api.Environment(new_cr, self.env.uid, self.env.context)
                company = env['res.company'].browse(company_id)
                company._generate_monthly_report()
                new_cr.commit()
        
        # Process companies in parallel (max 4 at once)
        with Pool(processes=4) as pool:
            pool.map(process_company, company_ids)

========================================
7. TRANSACTION MANAGEMENT
========================================

# Manual Commit/Rollback
class DataImport(models.Model):
    _name = 'data.import'
    
    def import_data(self, data_list):
        """Import data with transaction control."""
        success_count = 0
        error_count = 0
        
        for data in data_list:
            try:
                # Create record
                self.env['product.product'].create(data)
                success_count += 1
                
                # Commit every 100 records
                if success_count % 100 == 0:
                    self.env.cr.commit()
                    _logger.info(f"Committed {success_count} records")
                    
            except Exception as e:
                error_count += 1
                _logger.error(f"Import failed for {data.get('name')}: {e}")
                
                # Rollback this transaction
                self.env.cr.rollback()
        
        # Final commit
        self.env.cr.commit()
        
        return {'success': success_count, 'errors': error_count}

# Savepoint Pattern
class ComplexOperation(models.Model):
    _name = 'complex.operation'
    
    def perform_operation(self):
        """Use savepoints for nested transactions."""
        try:
            # Main operation
            self._step1()
            
            # Create savepoint before risky operation
            self.env.cr.execute("SAVEPOINT step2")
            try:
                self._step2()
            except Exception:
                # Rollback to savepoint, continue main transaction
                self.env.cr.execute("ROLLBACK TO SAVEPOINT step2")
                _logger.warning("Step 2 failed, continuing...")
            
            self._step3()
            self.env.cr.commit()
            
        except Exception as e:
            self.env.cr.rollback()
            raise

# Context Manager for Transactions
from contextlib import contextmanager

@contextmanager
def new_transaction(env):
    """Context manager for separate transaction."""
    with env.registry.cursor() as new_cr:
        new_env = api.Environment(new_cr, env.uid, env.context)
        try:
            yield new_env
            new_cr.commit()
        except Exception:
            new_cr.rollback()
            raise

# Usage:
def process_in_new_transaction(self):
    with new_transaction(self.env) as new_env:
        # Work in separate transaction
        new_env['account.move'].create({'name': 'Test'})
        # Auto-commits on success, rollback on exception

========================================
8. BUSINESS LOGIC BEST PRACTICES
========================================

# Single Responsibility Models
class OrderProcessor(models.AbstractModel):
    """Abstract model for order processing logic."""
    _name = 'order.processor'
    _description = 'Order Processing Logic'
    
    @api.model
    def validate_order(self, order):
        """Validate order before processing."""
        if not order.order_line:
            raise ValidationError(_("Order must have at least one line."))
        
        if order.amount_total <= 0:
            raise ValidationError(_("Order total must be positive."))
        
        if not order.partner_id.email:
            raise ValidationError(_("Customer must have an email."))
    
    @api.model
    def calculate_taxes(self, order):
        """Calculate taxes for order."""
        tax_amount = 0
        for line in order.order_line:
            taxes = line.tax_id.compute_all(
                line.price_unit, order.currency_id,
                line.product_uom_qty, line.product_id, order.partner_id
            )
            tax_amount += sum(t.get('amount', 0) for t in taxes['taxes'])
        return tax_amount
    
    @api.model
    def create_delivery(self, order):
        """Create delivery order from sale order."""
        return self.env['stock.picking'].create({
            'partner_id': order.partner_shipping_id.id,
            'origin': order.name,
            'move_lines': [(0, 0, {
                'product_id': line.product_id.id,
                'product_uom_qty': line.product_uom_qty,
            }) for line in order.order_line if line.product_id.type != 'service']
        })

# Use Mixins for Shared Behavior
class MailActivityMixin(models.AbstractModel):
    """Mixin for models that support activities."""
    _name = 'mail.activity.mixin'
    
    activity_ids = fields.One2many('mail.activity', 'res_id', 'Activities')
    activity_state = fields.Selection([
        ('overdue', 'Overdue'),
        ('today', 'Today'),
        ('planned', 'Planned')
    ], compute='_compute_activity_state')
    
    @api.depends('activity_ids.date_deadline')
    def _compute_activity_state(self):
        for record in self:
            activities = record.activity_ids
            if not activities:
                record.activity_state = False
            elif any(a.date_deadline < fields.Date.today() for a in activities):
                record.activity_state = 'overdue'
            elif any(a.date_deadline == fields.Date.today() for a in activities):
                record.activity_state = 'today'
            else:
                record.activity_state = 'planned'

# DRY Principle with Helpers
class SaleOrder(models.Model):
    _name = 'sale.order'
    
    def _get_invoice_vals(self):
        """Helper method for invoice values."""
        return {
            'partner_id': self.partner_invoice_id.id,
            'currency_id': self.pricelist_id.currency_id.id,
            'fiscal_position_id': self.fiscal_position_id.id,
            'payment_term_id': self.payment_term_id.id,
            'user_id': self.user_id.id,
            'invoice_origin': self.name,
            'invoice_line_ids': [(0, 0, line._get_invoice_line_vals()) for line in self.order_line],
        }
    
    def _create_invoices(self):
        """Create invoices from order."""
        return self.env['account.move'].create([
            order._get_invoice_vals() for order in self
        ])

# Error Handling Patterns
class SafeProcessor(models.Model):
    _name = 'safe.processor'
    
    def process_with_fallback(self, record):
        """Process with fallback strategy."""
        strategies = [
            self._try_primary_method,
            self._try_secondary_method,
            self._try_default_method,
        ]
        
        for strategy in strategies:
            try:
                return strategy(record)
            except Exception as e:
                _logger.warning(f"Strategy failed: {e}")
                continue
        
        raise UserError(_("All processing strategies failed."))

========================================
END OF PART 13 - BUSINESS LOGIC & WORKFLOWS
========================================

Key Takeaways:
- Computed fields use @api.depends for automatic recalculation
- Constraints enforce business rules at Python or SQL level
- Lifecycle hooks (create/write/unlink) enable custom CRUD logic
- Cron jobs automate recurring tasks with failure handling
- State machines manage complex workflows with validation
- Batch processing prevents timeouts on large datasets
- Transaction control ensures data consistency
- Mixins and abstract models promote code reuse

Related Parts:
- PART10: ORM patterns for model foundations
- PART11: HTTP patterns for triggering actions
- PART12: Security for restricting state transitions

```
