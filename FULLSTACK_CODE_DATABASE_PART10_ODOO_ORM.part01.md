---
source_txt: FULLSTACK_CODE_DATABASE_PART10_ODOO_ORM.txt
converted_utc: 2025-12-17T23:22:00Z
part: 1
parts_total: 2
---

# FULLSTACK CODE DATABASE PART10 ODOO ORM

## Verbatim Content (Part 1 of 2)

````text
================================================================================
FULLSTACK CODE DATABASE - PART 10: ODOO ORM PATTERNS
================================================================================
Source: Odoo 19.0 Enterprise ERP System
Tech Stack: Python, PostgreSQL, Custom ORM, XML/QWeb Templates
Generated: December 17, 2025
================================================================================

TABLE OF CONTENTS:
1. ODOO ORM ARCHITECTURE
   - Model Definition & Inheritance
   - Field Types & Declarations
   - Decorators & Method Patterns
   - CRUD Operations
   - Domain Filters

2. MODEL TYPES & INHERITANCE
   - Model (Persistent Database Records)
   - TransientModel (Temporary Records)
   - AbstractModel (Mixin Pattern)
   - Inheritance Mechanisms

3. FIELD TYPES COMPLETE REFERENCE
   - Basic Fields (Char, Integer, Float, Boolean, Text, Html)
   - Relational Fields (Many2one, One2many, Many2many)
   - Special Fields (Selection, Date, Datetime, Binary, Reference)
   - Computed Fields & Properties

4. DECORATORS & API PATTERNS
   - @api.depends (Computed Fields)
   - @api.constrains (Validation)
   - @api.onchange (UI Reactivity)
   - @api.model (Class Methods)
   - @api.model_create_multi (Batch Creation)

================================================================================
1. ODOO ORM ARCHITECTURE
================================================================================

---[FILE: Base Model Definition - models.py]---
Location: odoo/orm/models.py
Purpose: Core ORM architecture - BaseModel, Model, TransientModel

```python
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import models, fields, api
from odoo.exceptions import ValidationError, UserError

# BASIC MODEL DEFINITION
class Product(models.Model):
    """
    Model: Persistent database records with full CRUD
    _name: Database table name (product in this case)
    _description: Human-readable model description
    _order: Default ordering for queries
    _rec_name: Field used as record name (default: 'name')
    """
    _name = 'product.product'
    _description = 'Product'
    _order = 'name'
    _rec_name = 'name'
    
    # BASIC FIELDS
    name = fields.Char(
        string='Product Name',
        required=True,
        index=True,              # Database index for faster queries
        translate=True,          # Multi-language support
        help='Name of the product'
    )
    
    description = fields.Text(
        string='Description',
        translate=True
    )
    
    active = fields.Boolean(
        string='Active',
        default=True,
        help='If unchecked, it will allow you to hide the product without removing it.'
    )
    
    # NUMERIC FIELDS
    list_price = fields.Float(
        string='Sales Price',
        digits='Product Price',   # Precision configuration
        default=0.0,
        help='Base price to compute the customer price'
    )
    
    standard_price = fields.Float(
        string='Cost',
        digits='Product Price',
        default=0.0,
        groups='base.group_user',  # Only visible to internal users
        help='Cost of the product for accounting'
    )
    
    # SELECTION FIELD (Dropdown)
    type = fields.Selection([
        ('consu', 'Consumable'),
        ('service', 'Service'),
        ('product', 'Storable Product')
    ], string='Product Type', default='consu', required=True)
    
    # RELATIONAL FIELDS
    category_id = fields.Many2one(
        'product.category',      # Related model
        string='Product Category',
        ondelete='restrict',     # Prevent deletion if products exist
        index=True
    )
    
    # One2many (inverse of Many2one)
    variant_ids = fields.One2many(
        'product.product',       # Related model
        'product_tmpl_id',       # Field on related model
        string='Product Variants'
    )
    
    # Many2many (junction table)
    tag_ids = fields.Many2many(
        'product.tag',           # Related model
        'product_tag_rel',       # Junction table name
        'product_id',            # Column in junction table for this model
        'tag_id',                # Column in junction table for related model
        string='Tags'
    )
    
    # DATE FIELDS
    create_date = fields.Datetime(
        string='Created on',
        readonly=True
    )
    
    write_date = fields.Datetime(
        string='Last Updated on',
        readonly=True
    )
    
    # COMPUTED FIELDS
    qty_available = fields.Float(
        string='Quantity On Hand',
        compute='_compute_quantities',
        compute_sudo=True,       # Compute with admin rights
        store=True,              # Store in database for performance
        digits='Product Unit of Measure'
    )
    
    @api.depends('stock_move_ids.product_qty', 'stock_move_ids.state')
    def _compute_quantities(self):
        """
        Computed field decorator pattern
        - @api.depends specifies field dependencies
        - Automatically recomputed when dependencies change
        """
        for product in self:
            # Computation logic here
            product.qty_available = sum(
                move.product_qty 
                for move in product.stock_move_ids 
                if move.state == 'done'
            )
    
    # INVERSE COMPUTED FIELD (Writable Computed Field)
    display_name = fields.Char(
        compute='_compute_display_name',
        inverse='_inverse_display_name',
        store=True
    )
    
    def _inverse_display_name(self):
        """Allow writing to computed field"""
        for product in self:
            product.name = product.display_name
    
    # RELATED FIELD (Shortcut to related record field)
    categ_name = fields.Char(
        related='category_id.name',
        string='Category Name',
        store=True,              # Optionally store for performance
        readonly=True
    )
    
    # CONSTRAINTS
    _sql_constraints = [
        ('name_uniq', 'unique(name)', 'Product name must be unique!'),
        ('price_check', 'CHECK(list_price >= 0)', 'Sales price must be positive!')
    ]
    
    @api.constrains('list_price', 'standard_price')
    def _check_prices(self):
        """Python constraint - runs on every write"""
        for product in self:
            if product.list_price < 0:
                raise ValidationError("Sales price must be positive!")
            if product.standard_price < 0:
                raise ValidationError("Cost price must be positive!")
    
    # CRUD OPERATIONS OVERRIDE
    @api.model
    def create(self, vals):
        """Override create method"""
        # Pre-processing
        if 'name' in vals:
            vals['name'] = vals['name'].upper()
        
        # Call super to create record
        record = super(Product, self).create(vals)
        
        # Post-processing
        record._do_something_after_create()
        
        return record
    
    def write(self, vals):
        """Override write method"""
        # Pre-processing
        if 'list_price' in vals:
            # Notify price change
            self._notify_price_change(vals['list_price'])
        
        # Call super to write
        result = super(Product, self).write(vals)
        
        # Post-processing
        self._recompute_related_records()
        
        return result
    
    def unlink(self):
        """Override unlink (delete) method"""
        # Check if deletion is allowed
        if any(product.qty_available > 0 for product in self):
            raise UserError("Cannot delete products with stock!")
        
        # Call super to delete
        return super(Product, self).unlink()
    
    # ONCHANGE - UI REACTIVITY
    @api.onchange('category_id')
    def _onchange_category(self):
        """
        Executed in UI when category changes
        Updates other fields without saving to database
        """
        if self.category_id:
            # Update related fields
            self.list_price = self.category_id.default_price
            
            # Return warning to user
            return {
                'warning': {
                    'title': 'Price Updated',
                    'message': 'Default price from category has been applied'
                }
            }
```

USAGE NOTES:
- Model class inherits from models.Model
- _name is required and defines database table
- Fields are class attributes using fields.* types
- Methods with @api decorators provide reactivity
- SQL constraints for database-level validation
- Python constraints for complex business rules

---[FILE: Model Inheritance Patterns]---
Purpose: Three types of inheritance in Odoo ORM

```python
# 1. CLASSICAL INHERITANCE (_inherit + _name)
# Creates a new model that inherits from another
class ProductTemplate(models.Model):
    _name = 'product.template'
    _description = 'Product Template'
    
    name = fields.Char('Name', required=True)
    type = fields.Selection([...], required=True)

class ProductProduct(models.Model):
    _name = 'product.product'         # New model name
    _inherit = 'product.template'     # Inherit from
    _description = 'Product Variant'
    
    # Adds new fields to the child model
    barcode = fields.Char('Barcode')
    default_code = fields.Char('Internal Reference')
    
    # All fields from product.template are available
    # Creates separate database table


# 2. EXTENSION INHERITANCE (_inherit only)
# Extends existing model in-place (same table)
class ProductExtension(models.Model):
    _inherit = 'product.product'      # Extend existing model
    
    # Add new fields to existing model
    warranty_period = fields.Integer('Warranty (months)')
    is_featured = fields.Boolean('Featured Product')
    
    # Override existing methods
    def write(self, vals):
        # Custom logic before save
        result = super(ProductExtension, self).write(vals)
        # Custom logic after save
        return result
    
    # No new table created - fields added to product.product table


# 3. DELEGATION INHERITANCE (_inherits)
# Composition pattern - embeds another model
class ProductPackaging(models.Model):
    _name = 'product.packaging'
    _description = 'Product Packaging'
    
    # Delegation to product.product
    _inherits = {
        'product.product': 'product_id',  # Link field
    }
    
    product_id = fields.Many2one(
        'product.product',
        'Product',
        required=True,
        ondelete='cascade'
    )
    
    # Additional fields specific to packaging
    qty = fields.Float('Quantity per Package')
    package_type = fields.Selection([...], 'Package Type')
    
    # All product.product fields accessible via composition
    # product_packaging.name works (delegates to product_id.name)
    # Separate tables with foreign key


# 4. ABSTRACT MODEL (MIXIN)
# No database table - used as mixin
class MailThread(models.AbstractModel):
    _name = 'mail.thread'
    _description = 'Email Thread'
    
    message_ids = fields.One2many(
        'mail.message',
        'res_id',
        string='Messages'
    )
    
    def message_post(self, body='', subject=None, **kwargs):
        """Post a message on this record"""
        # Implementation
        pass

# Use the mixin in other models
class SaleOrder(models.Model):
    _name = 'sale.order'
    _inherit = ['mail.thread']  # Inherit mixin
    
    # Now has message_ids and message_post() method
    name = fields.Char('Order Reference')
    
    def action_confirm(self):
        result = super().action_confirm()
        # Use inherited mixin method
        self.message_post(body='Order confirmed')
        return result
```

================================================================================
2. FIELD TYPES COMPLETE REFERENCE
================================================================================

```python
from odoo import models, fields, api

class FieldTypesDemo(models.Model):
    _name = 'demo.fields'
    _description = 'All Field Types Demo'
    
    # ==================== BASIC FIELDS ====================
    
    # CHAR - String field (limited length)
    char_field = fields.Char(
        string='Text Field',
        size=64,                 # Max length (optional)
        required=True,
        index=True,
        default='Default Value',
        translate=True,          # Multi-language
        trim=True,               # Auto-trim whitespace
        help='Help text shown on hover'
    )
    
    # TEXT - Long text field (unlimited)
    text_field = fields.Text(
        string='Long Text',
        translate=True
    )
    
    # HTML - Rich text editor
    html_field = fields.Html(
        string='HTML Content',
        sanitize=True,           # Remove dangerous HTML
        sanitize_attributes=True,
        sanitize_style=True
    )
    
    # INTEGER
    integer_field = fields.Integer(
        string='Integer Number',
        default=0,
        group_operator='sum'     # Aggregation function
    )
    
    # FLOAT
    float_field = fields.Float(
        string='Decimal Number',
        digits=(16, 2),          # (total digits, decimal places)
        default=0.0
    )
    
    # MONETARY - Currency field
    monetary_field = fields.Monetary(
        string='Amount',
        currency_field='currency_id',  # Reference to currency field
        default=0.0
    )
    currency_id = fields.Many2one(
        'res.currency',
        string='Currency'
    )
    
    # BOOLEAN
    boolean_field = fields.Boolean(
        string='Yes/No',
        default=False
    )
    
    # ==================== DATE/TIME FIELDS ====================
    
    # DATE
    date_field = fields.Date(
        string='Date',
        default=fields.Date.context_today,  # Today in user's timezone
        index=True
    )
    
    # DATETIME
    datetime_field = fields.Datetime(
        string='Date & Time',
        default=fields.Datetime.now,  # Current datetime
        index=True
    )
    
    # ==================== SELECTION FIELDS ====================
    
    # SELECTION - Dropdown (static options)
    selection_field = fields.Selection([
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed'),
        ('done', 'Done'),
        ('cancel', 'Cancelled')
    ], string='Status', default='draft', required=True)
    
    # SELECTION - Dynamic options
    selection_dynamic = fields.Selection(
        selection='_get_selection_values',
        string='Dynamic Selection'
    )
    
    @api.model
    def _get_selection_values(self):
        """Dynamic selection values"""
        return [('opt1', 'Option 1'), ('opt2', 'Option 2')]
    
    # ==================== RELATIONAL FIELDS ====================
    
    # MANY2ONE - Foreign Key
    partner_id = fields.Many2one(
        'res.partner',           # Target model
        string='Customer',
        required=True,
        index=True,
        ondelete='cascade',      # cascade, restrict, set null
        domain="[('customer', '=', True)]",  # Filter options
        context={'default_customer': True}   # Default values
    )
    
    # ONE2MANY - Reverse Many2one
    line_ids = fields.One2many(
        'demo.line',             # Target model
        'demo_id',               # Field on target model
        string='Lines',
        copy=True                # Copy lines when duplicating record
    )
    
    # MANY2MANY
    tag_ids = fields.Many2many(
        'demo.tag',              # Target model
        'demo_tag_rel',          # Junction table name
        'demo_id',               # This model's column
        'tag_id',                # Target model's column
        string='Tags',
        domain=[('active', '=', True)]
    )
    
    # ==================== SPECIAL FIELDS ====================
    
    # BINARY - File/Image storage
    image = fields.Binary(
        string='Image',
        attachment=True,         # Store in ir.attachment (separate table)
        max_width=1024,
        max_height=1024
    )
    
    # REFERENCE - Dynamic relation (multiple models)
    reference_field = fields.Reference(
        selection=[
            ('res.partner', 'Partner'),
            ('product.product', 'Product'),
        ],
        string='Reference To'
    )
    
    # ==================== COMPUTED FIELDS ====================
    
    # COMPUTED - Read-only by default
    total = fields.Float(
        string='Total',
        compute='_compute_total',
        store=True,              # Store in database
        digits=(16, 2)
    )
    
    @api.depends('line_ids.subtotal')
    def _compute_total(self):
        for record in self:
            record.total = sum(line.subtotal for line in record.line_ids)
    
    # COMPUTED with INVERSE - Read/write computed field
    full_name = fields.Char(
        compute='_compute_full_name',
        inverse='_inverse_full_name',
        search='_search_full_name',
        store=True
    )
    
    first_name = fields.Char('First Name')
    last_name = fields.Char('Last Name')
    
    @api.depends('first_name', 'last_name')
    def _compute_full_name(self):
        for record in self:
            record.full_name = f"{record.first_name or ''} {record.last_name or ''}".strip()
    
    def _inverse_full_name(self):
        """Allow writing to computed field"""
        for record in self:
            if record.full_name:
                parts = record.full_name.split(' ', 1)
                record.first_name = parts[0]
                record.last_name = parts[1] if len(parts) > 1 else ''
    
    def _search_full_name(self, operator, value):
        """Enable search on computed field"""
        return ['|',
            ('first_name', operator, value),
            ('last_name', operator, value)
        ]
    
    # RELATED - Shortcut to related record's field
    partner_email = fields.Char(
        related='partner_id.email',
        string='Email',
        readonly=False,          # Allow editing related field
        store=True               # Store for faster access
    )
    
    # ==================== COMPANY-DEPENDENT FIELDS ====================
    
    # PROPERTY - Different value per company
    property_account = fields.Many2one(
        'account.account',
        string='Income Account',
        company_dependent=True   # Separate value for each company
    )
```

================================================================================
3. DECORATORS & API PATTERNS
================================================================================

```python
from odoo import models, fields, api
from odoo.exceptions import ValidationError, UserError

class DecoratorPatterns(models.Model):
    _name = 'demo.decorators'
    
    name = fields.Char('Name')
    quantity = fields.Float('Quantity')
    price = fields.Float('Price')
    total = fields.Float('Total', compute='_compute_total')
    state = fields.Selection([
        ('draft', 'Draft'),
        ('confirmed', 'Confirmed')
    ], default='draft')
    
    # ==================== @api.depends ====================
    # Computed field dependency tracking
    
    @api.depends('quantity', 'price')
    def _compute_total(self):
        """
        - Automatically called when quantity or price changes
        - Can depend on related fields: 'line_ids.subtotal'
        - Can depend on computed fields
        - Must update all records in self
        """
        for record in self:
            record.total = record.quantity * record.price
    
    # ==================== @api.depends_context ====================
    # Recompute when context values change
    
    display_name = fields.Char(compute='_compute_display_name')
    
    @api.depends('name')
    @api.depends_context('lang', 'show_details')
    def _compute_display_name(self):
        """Recompute when context.lang or context.show_details changes"""
        for record in self:
            name = record.name
            if self.env.context.get('show_details'):
                name = f"{name} ({record.quantity} pcs)"
            record.display_name = name
    
    # ==================== @api.constrains ====================
    # Field validation
    
    @api.constrains('quantity', 'price')
    def _check_values(self):
        """
        - Called on create() and write() when listed fields change
        - Should raise ValidationError if invalid
        - Runs for each record in self
        """
        for record in self:
            if record.quantity < 0:
                raise ValidationError("Quantity cannot be negative!")
            if record.price < 0:
                raise ValidationError("Price cannot be negative!")
    
    # ==================== @api.onchange ====================
    # UI field change reaction (before save)
    
    @api.onchange('quantity')
    def _onchange_quantity(self):
        """
        - Called in UI when quantity changes
        - Updates other fields WITHOUT saving
        - Can return warning/error to user
        - Self is a single record (NewId in create form)
        """
        if self.quantity > 100:
            return {
                'warning': {
                    'title': 'Large Quantity',
                    'message': 'You are ordering more than 100 units'
                }
            }
        
        # Update other fields
        if self.quantity >= 10:
            self.price = self.price * 0.9  # 10% discount
    
    # ==================== @api.model ====================
    # Class method (not bound to specific records)
    
    @api.model
    def create(self, vals):
        """
        - Standard create override
        - Receives dict of values
        - Returns created record
        """
        # Modify values before creation
        if 'name' not in vals:
            vals['name'] = self.env['ir.sequence'].next_by_code('demo.decorators')
        
        record = super(DecoratorPatterns, self).create(vals)
        
        # Post-creation actions
        record._send_notification()
        
        return record
    
    @api.model
    def _cron_job(self):
        """Scheduled action method"""
        records = self.search([('state', '=', 'draft')])
        records.write({'state': 'confirmed'})
    
    # ==================== @api.model_create_multi ====================
    # Batch creation optimization
    
    @api.model_create_multi
    def create(self, vals_list):
        """
        - Handles multiple records creation efficiently
        - vals_list is list of dicts
        - Returns recordset
        """
        # Process all records at once
        for vals in vals_list:
            if 'name' not in vals:
                vals['name'] = self.env['ir.sequence'].next_by_code('demo')
        
        records = super(DecoratorPatterns, self).create(vals_list)
        
        # Batch post-processing
        records._batch_notify()
        
        return records
    
    # ==================== @api.ondelete ====================
    # Prevent deletion under certain conditions
    
    @api.ondelete(at_uninstall=False)
    def _unlink_if_draft(self):
        """
        - Called before unlink()
        - Raise error to prevent deletion
        """
        if any(record.state != 'draft' for record in self):
            raise UserError("Can only delete draft records!")
    
    # ==================== @api.returns ====================
    # Specify return type for proper recordset handling
    
    @api.returns('demo.decorators')
    def get_related_records(self):
        """Return recordset of same model"""
        return self.search([('id', '!=', self.id)])
    
    # ==================== @api.readonly ====================
    # Make method read-only (doesn't modify database)
    
    @api.readonly
    def compute_statistics(self):
        """Read-only method - uses read-only cursor"""
        return {
            'total': sum(self.mapped('total')),
            'count': len(self),
            'average': sum(self.mapped('total')) / len(self) if self else 0
        }
```

================================================================================
4. SEARCH DOMAINS & QUERY PATTERNS

````
