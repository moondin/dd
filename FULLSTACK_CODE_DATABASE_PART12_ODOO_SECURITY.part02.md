---
source_txt: FULLSTACK_CODE_DATABASE_PART12_ODOO_SECURITY.txt
converted_utc: 2025-12-17T23:22:00Z
part: 2
parts_total: 2
---

# FULLSTACK CODE DATABASE PART12 ODOO SECURITY

## Verbatim Content (Part 2 of 2)

```text
    <record id="module_category_project" model="ir.module.category">
        <field name="name">Project Management</field>
    </record>
    
    <record id="group_project_user" model="res.groups">
        <field name="name">User</field>
        <field name="category_id" ref="module_category_project"/>
        <field name="implied_ids" eval="[(4, ref('base.group_user'))]"/>
    </record>
    
    <record id="group_project_manager" model="res.groups">
        <field name="name">Manager</field>
        <field name="category_id" ref="module_category_project"/>
        <field name="implied_ids" eval="[(4, ref('group_project_user'))]"/>
    </record>
</odoo>
"""

# 2. security/ir.model.access.csv - Model permissions
"""
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_project_user,project.project.user,model_project_project,group_project_user,1,1,1,0
access_project_manager,project.project.manager,model_project_project,group_project_manager,1,1,1,1
access_task_user,project.task.user,model_project_task,group_project_user,1,1,1,0
access_task_manager,project.task.manager,model_project_task,group_project_manager,1,1,1,1
"""

# 3. security/project_security.xml - Record rules
"""
<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <!-- Users see projects they're members of -->
    <record id="project_project_rule_members" model="ir.rule">
        <field name="name">Project: members</field>
        <field name="model_id" ref="model_project_project"/>
        <field name="groups" eval="[(4, ref('group_project_user'))]"/>
        <field name="domain_force">[('member_ids', 'in', [user.id])]</field>
    </record>
    
    <!-- Managers see all -->
    <record id="project_project_rule_manager" model="ir.rule">
        <field name="name">Project: manager all</field>
        <field name="model_id" ref="model_project_project"/>
        <field name="groups" eval="[(4, ref('group_project_manager'))]"/>
        <field name="domain_force">[(1, '=', 1)]</field>
    </record>
    
    <!-- Global: Multi-company -->
    <record id="project_comp_rule" model="ir.rule">
        <field name="name">Project: multi-company</field>
        <field name="model_id" ref="model_project_project"/>
        <field name="domain_force">
            ['|', ('company_id', '=', False), ('company_id', 'in', company_ids)]
        </field>
    </record>
</odoo>
"""

# 4. models/project.py - Python model with security
"""
class Project(models.Model):
    _name = 'project.project'
    _description = 'Project'
    
    name = fields.Char('Name', required=True)
    user_id = fields.Many2one('res.users', 'Project Manager')
    member_ids = fields.Many2many('res.users', string='Members')
    company_id = fields.Many2one('res.company', default=lambda s: s.env.company)
    
    # Field-level security
    budget = fields.Monetary('Budget', groups='group_project_manager')
    
    def action_archive(self):
        '''Only managers can archive.'''
        self.check_access_rights('write')
        if not self.user_has_groups('project.group_project_manager'):
            raise AccessError(_('Only managers can archive projects.'))
        self.active = False
"""

========================================
END OF PART 12 - SECURITY & ACCESS CONTROL
========================================

Key Takeaways:
- Multi-layer security: Model access (ACL) + Record rules (RLS) + Field security
- Record rules use domain expressions evaluated in context (user, company_ids, etc.)
- Groups can imply other groups (inheritance)
- sudo() bypasses security but should be used carefully
- Multi-company support via company_id field and record rules
- Audit trail via create_uid, write_uid, create_date, write_date
- Complex security patterns: delegation, rate limiting, API keys

Related Parts:
- PART10: ORM patterns for models referenced here
- PART11: HTTP authentication and session security
- PART13: UI components and view security (next)

```
