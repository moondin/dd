---
source_txt: FULLSTACK_CODE_DATABASE_PART10_ODOO_ORM.txt
converted_utc: 2025-12-17T23:22:00Z
part: 2
parts_total: 2
---

# FULLSTACK CODE DATABASE PART10 ODOO ORM

## Verbatim Content (Part 2 of 2)

````text
================================================================================

```python
from odoo import models, fields, api

class SearchPatterns(models.Model):
    _name = 'demo.search'
    
    # ==================== BASIC DOMAIN SYNTAX ====================
    
    def demo_search_domains(self):
        """Domain is a list of tuples (field, operator, value)"""
        
        # Simple equality
        records = self.search([('name', '=', 'Product A')])
        
        # Inequality operators
        records = self.search([('quantity', '>', 10)])
        records = self.search([('price', '<=', 100)])
        records = self.search([('active', '!=', False)])
        
        # IN operator (multiple values)
        records = self.search([('state', 'in', ['draft', 'confirmed'])])
        records = self.search([('id', 'not in', [1, 2, 3])])
        
        # LIKE operators (pattern matching)
        records = self.search([('name', 'like', 'Product%')])      # Starts with
        records = self.search([('name', 'ilike', '%product%')])    # Contains (case-insensitive)
        records = self.search([('name', 'not like', 'Test%')])
        
        # Boolean operators
        records = self.search([('active', '=', True)])
        records = self.search([('is_featured', '!=', False)])
        
        # Date comparisons
        from datetime import datetime, timedelta
        today = fields.Date.today()
        records = self.search([('date', '=', today)])
        records = self.search([('date', '>=', today - timedelta(days=7))])
        
        # ==================== COMPLEX DOMAINS (AND/OR/NOT) ====================
        
        # AND (default) - all conditions must be true
        records = self.search([
            ('state', '=', 'confirmed'),
            ('quantity', '>', 0),
            ('price', '<', 1000)
        ])
        
        # OR - at least one condition must be true
        records = self.search([
            '|',  # OR operator prefix
            ('state', '=', 'draft'),
            ('state', '=', 'confirmed')
        ])
        
        # Complex OR with multiple conditions
        records = self.search([
            '|',  # Main OR
            ('name', 'like', 'Product%'),
            '&',  # AND nested in OR
            ('quantity', '>', 10),
            ('price', '<', 100)
        ])
        
        # NOT operator
        records = self.search([
            '!',  # NOT operator
            ('state', '=', 'cancelled')
        ])
        
        # Multiple ORs and ANDs (Polish notation)
        records = self.search([
            '|', '|',  # OR(OR(...))
            ('state', '=', 'draft'),
            ('state', '=', 'confirmed'),
            ('state', '=', 'done'),
            ('active', '=', True)  # AND with above OR
        ])
        
        # ==================== RELATIONAL FIELD SEARCHES ====================
        
        # Many2one - search by ID
        records = self.search([('partner_id', '=', 5)])
        records = self.search([('partner_id', 'in', [1, 2, 3])])
        records = self.search([('partner_id', '!=', False)])  # Has partner
        records = self.search([('partner_id', '=', False)])   # No partner
        
        # Many2one - search by related field
        records = self.search([('partner_id.country_id.code', '=', 'US')])
        records = self.search([('partner_id.name', 'ilike', 'microsoft')])
        
        # One2many / Many2many - exists
        records = self.search([('line_ids', '!=', False)])  # Has lines
        records = self.search([('line_ids', '=', False)])   # No lines
        
        # Many2many - search by related record
        records = self.search([('tag_ids', 'in', [tag_id])])
        records = self.search([('tag_ids.name', '=', 'Important')])
        
        # ==================== SEARCH OPTIONS ====================
        
        # Limit results
        records = self.search(domain, limit=10)
        
        # Offset (pagination)
        records = self.search(domain, offset=20, limit=10)
        
        # Ordering
        records = self.search(domain, order='name ASC')
        records = self.search(domain, order='date DESC, name ASC')
        
        # Count only (no records)
        count = self.search_count(domain)
        
        # ==================== READ & FETCH PATTERNS ====================
        
        # read() - Fetch specific fields as list of dicts
        data = records.read(['name', 'quantity', 'price'])
        # Returns: [{'id': 1, 'name': 'A', 'quantity': 10, 'price': 100}, ...]
        
        # mapped() - Extract field values
        names = records.mapped('name')  # ['Name1', 'Name2', ...]
        partners = records.mapped('partner_id')  # recordset of partners
        
        # filtered() - Filter recordset in Python
        active_records = records.filtered(lambda r: r.active)
        expensive = records.filtered(lambda r: r.price > 100)
        
        # sorted() - Sort recordset in Python
        sorted_records = records.sorted(key=lambda r: r.date)
        sorted_desc = records.sorted(key=lambda r: r.price, reverse=True)
        
        # ==================== AGGREGATE FUNCTIONS ====================
        
        # read_group() - SQL GROUP BY
        groups = self.read_group(
            domain=[('state', '!=', 'cancelled')],
            fields=['quantity:sum', 'price:avg'],
            groupby=['partner_id', 'state']
        )
        # Returns: [
        #   {'partner_id': (1, 'Partner A'), 'state': 'draft', 
        #    'quantity': 100, 'price': 50, '__count': 5},
        #   ...
        # ]
        
        # search_read() - Combined search and read
        data = self.search_read(
            domain=[('active', '=', True)],
            fields=['name', 'price'],
            limit=10
        )
        # Returns list of dicts (same as read())
```

USAGE NOTES:
- Domain syntax uses Polish notation for boolean operators
- Always use '=' and '!=' for boolean fields, not True/False
- Related fields use dot notation: 'partner_id.country_id.code'
- search() returns recordset, search_count() returns integer
- Use limit/offset for pagination
- read_group() for analytics and reporting


````
