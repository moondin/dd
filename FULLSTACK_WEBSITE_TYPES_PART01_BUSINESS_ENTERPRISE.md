# FULLSTACK WEBSITE TYPES - PART 01: BUSINESS & ENTERPRISE APPLICATIONS

**Category:** Business & Enterprise  
**Total Types:** 10  
**Complexity:** Medium to Very High  
**Database References:** PART1, PART10-13 (Odoo), PART2 (tRPC), ToolJet samples

---

## 📋 WEBSITE TYPES IN THIS CATEGORY

1. [ERP System (Enterprise Resource Planning)](#1-erp-system)
2. [CRM Platform (Customer Relationship Management)](#2-crm-platform)
3. [Project Management System](#3-project-management-system)
4. [HR Management System](#4-hr-management-system)
5. [Inventory Management System](#5-inventory-management-system)
6. [Invoicing & Billing Platform](#6-invoicing--billing-platform)
7. [Business Intelligence Dashboard](#7-business-intelligence-dashboard)
8. [Workflow Automation Platform](#8-workflow-automation-platform)
9. [Document Management System](#9-document-management-system)
10. [Time Tracking & Payroll System](#10-time-tracking--payroll-system)

---

## 1. ERP SYSTEM

### Description
Complete enterprise resource planning system for managing business operations including accounting, procurement, inventory, manufacturing, HR, and sales.

### Tech Stack
- **Framework:** Python (Odoo 19.0) or Node.js + TypeScript
- **Auth:** Odoo Security Framework or Better Auth
- **Database:** PostgreSQL + Custom ORM or Drizzle
- **Frontend:** QWeb templates or React + Next.js
- **API:** XML-RPC/JSON-RPC or tRPC

### Database Parts
- **Core:** PART10 (Odoo ORM), PART11 (Odoo HTTP), PART12 (Odoo Security), PART13 (Business Logic)
- **Alternative:** PART1 (Auth), PART2 (tRPC), PART5 (File uploads)

### Project Scaffold (Odoo-based)

```
erp-system/
├── odoo/
│   ├── addons/
│   │   ├── accounting/
│   │   │   ├── models/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── account_move.py
│   │   │   │   └── account_payment.py
│   │   │   ├── views/
│   │   │   │   ├── account_views.xml
│   │   │   │   └── payment_views.xml
│   │   │   ├── security/
│   │   │   │   └── ir.model.access.csv
│   │   │   └── __manifest__.py
│   │   ├── inventory/
│   │   │   ├── models/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── product.py
│   │   │   │   ├── stock_move.py
│   │   │   │   └── warehouse.py
│   │   │   ├── views/
│   │   │   │   └── inventory_views.xml
│   │   │   ├── security/
│   │   │   └── __manifest__.py
│   │   ├── hr/
│   │   │   ├── models/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── employee.py
│   │   │   │   └── attendance.py
│   │   │   └── __manifest__.py
│   │   ├── sales/
│   │   │   ├── models/
│   │   │   │   ├── sale_order.py
│   │   │   │   └── sale_order_line.py
│   │   │   └── __manifest__.py
│   │   └── purchase/
│   ├── odoo-bin
│   └── odoo.conf
├── custom_addons/          # Your custom modules
│   └── company_custom/
├── docker-compose.yml
└── requirements.txt
```

### Core Database Schema (Odoo ORM)

```python
# models/account_move.py
from odoo import models, fields, api

class AccountMove(models.Model):
    _name = 'account.move'
    _description = 'Journal Entry'
    
    name = fields.Char(string='Number', required=True, copy=False, default='/')
    date = fields.Date(required=True, default=fields.Date.context_today)
    ref = fields.Char(string='Reference')
    journal_id = fields.Many2one('account.journal', string='Journal', required=True)
    company_id = fields.Many2one('res.company', string='Company', required=True)
    currency_id = fields.Many2one('res.currency', string='Currency')
    
    partner_id = fields.Many2one('res.partner', string='Partner')
    amount_total = fields.Monetary(string='Total', compute='_compute_amount')
    state = fields.Selection([
        ('draft', 'Draft'),
        ('posted', 'Posted'),
        ('cancel', 'Cancelled')
    ], string='Status', default='draft')
    
    line_ids = fields.One2many('account.move.line', 'move_id', string='Journal Items')
    
    @api.depends('line_ids.debit', 'line_ids.credit')
    def _compute_amount(self):
        for move in self:
            move.amount_total = sum(move.line_ids.mapped('debit'))
    
    def action_post(self):
        for move in self:
            if move.state != 'posted':
                move.state = 'posted'
                # Additional posting logic

# models/product.py
class Product(models.Model):
    _name = 'product.product'
    _description = 'Product'
    
    name = fields.Char('Name', required=True)
    default_code = fields.Char('Internal Reference')
    barcode = fields.Char('Barcode')
    
    categ_id = fields.Many2one('product.category', 'Product Category')
    list_price = fields.Float('Sales Price')
    standard_price = fields.Float('Cost')
    
    type = fields.Selection([
        ('consu', 'Consumable'),
        ('service', 'Service'),
        ('product', 'Storable Product')
    ], string='Product Type', default='consu')
    
    qty_available = fields.Float('Quantity On Hand', compute='_compute_quantities')
    virtual_available = fields.Float('Forecast Quantity', compute='_compute_quantities')
    
    @api.depends('stock_move_ids.product_qty', 'stock_move_ids.state')
    def _compute_quantities(self):
        for product in self:
            # Calculate inventory quantities
            product.qty_available = sum(
                product.stock_move_ids.filtered(
                    lambda m: m.state == 'done'
                ).mapped('product_qty')
            )
```

### Dependencies (requirements.txt)

```txt
# Odoo 19.0
odoo==19.0
psycopg2-binary==2.9.9
python-dateutil==2.8.2
pytz==2023.3
lxml==4.9.3
Pillow==10.1.0
reportlab==4.0.7
Werkzeug==3.0.1
```

### Docker Compose

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=erp_database
      - POSTGRES_USER=odoo
      - POSTGRES_PASSWORD=odoo
    volumes:
      - odoo-db-data:/var/lib/postgresql/data

  odoo:
    image: odoo:19.0
    depends_on:
      - db
    ports:
      - "8069:8069"
    environment:
      - HOST=db
      - USER=odoo
      - PASSWORD=odoo
    volumes:
      - ./addons:/mnt/extra-addons
      - odoo-web-data:/var/lib/odoo

volumes:
  odoo-db-data:
  odoo-web-data:
```

### Estimated Build Time
- **MVP:** 12-16 weeks
- **Production:** 24-40 weeks

### Key Features
- Multi-company support
- Role-based access control
- Automated workflows
- Real-time reporting
- Mobile responsive
- Multi-currency support
- Audit trails
- API integrations

---

## 2. CRM PLATFORM

### Description
Customer relationship management system for sales pipeline, lead tracking, customer communications, and sales analytics.

### Tech Stack
- **Framework:** Next.js 15 + TypeScript
- **Auth:** Better Auth with team roles
- **Database:** PostgreSQL + Drizzle ORM
- **Frontend:** React + Shadcn/UI
- **API:** tRPC
- **Real-time:** Server-Sent Events
- **Email:** Resend or SendGrid

### Database Parts
- **Core:** PART1 (Auth), PART2 (tRPC), PART7 (UI Components)
- **Advanced:** PART6 (State), PART8 (Hooks)

### Project Scaffold

```
crm-platform/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/
│       │   │   │   ├── login/
│       │   │   │   └── register/
│       │   │   ├── (dashboard)/
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── page.tsx
│       │   │   │   ├── leads/
│       │   │   │   ├── contacts/
│       │   │   │   ├── deals/
│       │   │   │   ├── activities/
│       │   │   │   └── reports/
│       │   │   └── api/
│       │   │       └── trpc/[trpc]/route.ts
│       │   ├── components/
│       │   │   ├── leads/
│       │   │   │   ├── lead-card.tsx
│       │   │   │   ├── lead-form.tsx
│       │   │   │   └── lead-list.tsx
│       │   │   ├── deals/
│       │   │   │   ├── deal-pipeline.tsx
│       │   │   │   └── deal-stage.tsx
│       │   │   └── ui/          # Shadcn components
│       │   ├── lib/
│       │   │   ├── trpc/
│       │   │   │   ├── client.ts
│       │   │   │   └── server.ts
│       │   │   └── auth.ts
│       │   └── server/
│       │       ├── context.ts
│       │       └── routers/
│       │           ├── lead.ts
│       │           ├── contact.ts
│       │           ├── deal.ts
│       │           └── activity.ts
│       └── package.json
├── packages/
│   ├── database/
│   │   ├── drizzle.config.ts
│   │   ├── schema.ts
│   │   └── migrations/
│   └── auth/
│       └── index.ts
├── docker-compose.yml
└── turbo.json
```

### Core Database Schema

```typescript
// packages/database/schema.ts
import { pgTable, text, uuid, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const leadStatusEnum = pgEnum("lead_status", [
  "new", "contacted", "qualified", "converted", "lost"
])

export const dealStageEnum = pgEnum("deal_stage", [
  "prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"
])

// USERS (from PART1)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("sales_rep"), // admin, manager, sales_rep
  teamId: uuid("team_id").references(() => teams.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// LEADS
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  title: text("title"),
  status: leadStatusEnum("status").default("new").notNull(),
  source: text("source"), // website, referral, cold_call, etc.
  assignedToId: uuid("assigned_to_id").references(() => users.id),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// DEALS
export const deals = pgTable("deals", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  amount: integer("amount").notNull(), // in cents
  stage: dealStageEnum("stage").default("prospecting").notNull(),
  probability: integer("probability").default(0), // 0-100
  expectedCloseDate: timestamp("expected_close_date"),
  contactId: uuid("contact_id").references(() => contacts.id),
  assignedToId: uuid("assigned_to_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// CONTACTS (converted leads)
export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  company: text("company"),
  title: text("title"),
  leadId: uuid("lead_id").references(() => leads.id), // Original lead
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ACTIVITIES (emails, calls, meetings)
export const activities = pgTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull(), // email, call, meeting, note
  subject: text("subject").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  leadId: uuid("lead_id").references(() => leads.id),
  contactId: uuid("contact_id").references(() => contacts.id),
  dealId: uuid("deal_id").references(() => deals.id),
  assignedToId: uuid("assigned_to_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Relations
export const leadsRelations = relations(leads, ({ one, many }) => ({
  assignedTo: one(users, { fields: [leads.assignedToId], references: [users.id] }),
  createdBy: one(users, { fields: [leads.createdById], references: [users.id] }),
  activities: many(activities),
}))

export const dealsRelations = relations(deals, ({ one, many }) => ({
  contact: one(contacts, { fields: [deals.contactId], references: [contacts.id] }),
  assignedTo: one(users, { fields: [deals.assignedToId], references: [users.id] }),
  activities: many(activities),
}))
```

### Core tRPC Routers

```typescript
// server/routers/lead.ts
import { router, protectedProcedure } from "../trpc"
import { z } from "zod"
import { leads, leadStatusEnum } from "@/packages/database/schema"
import { eq, desc, and, ilike } from "drizzle-orm"

export const leadRouter = router({
  // List leads with filtering
  list: protectedProcedure
    .input(z.object({
      status: z.enum(leadStatusEnum.enumValues).optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ ctx, input }) => {
      const conditions = []
      
      if (input.status) {
        conditions.push(eq(leads.status, input.status))
      }
      
      if (input.search) {
        conditions.push(
          or(
            ilike(leads.firstName, `%${input.search}%`),
            ilike(leads.lastName, `%${input.search}%`),
            ilike(leads.email, `%${input.search}%`),
            ilike(leads.company, `%${input.search}%`)
          )
        )
      }
      
      const results = await ctx.db
        .select()
        .from(leads)
        .where(and(...conditions))
        .orderBy(desc(leads.createdAt))
        .limit(input.limit)
        .offset(input.offset)
      
      return results
    }),

  // Create lead
  create: protectedProcedure
    .input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      company: z.string().optional(),
      title: z.string().optional(),
      source: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [lead] = await ctx.db
        .insert(leads)
        .values({
          ...input,
          createdById: ctx.user.id,
          assignedToId: ctx.user.id,
        })
        .returning()
      
      return lead
    }),

  // Update lead status
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      status: z.enum(leadStatusEnum.enumValues),
    }))
    .mutation(async ({ ctx, input }) => {
      const [lead] = await ctx.db
        .update(leads)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(leads.id, input.id))
        .returning()
      
      return lead
    }),

  // Convert lead to contact
  convert: protectedProcedure
    .input(z.object({
      leadId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [lead] = await ctx.db
        .select()
        .from(leads)
        .where(eq(leads.id, input.leadId))
      
      if (!lead) {
        throw new Error("Lead not found")
      }
      
      // Create contact
      const [contact] = await ctx.db
        .insert(contacts)
        .values({
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          title: lead.title,
          leadId: lead.id,
        })
        .returning()
      
      // Update lead status
      await ctx.db
        .update(leads)
        .set({ status: "converted" })
        .where(eq(leads.id, input.leadId))
      
      return contact
    }),
})
```

### Estimated Build Time
- **MVP:** 4-6 weeks
- **Production:** 8-12 weeks

### Key Features
- Lead scoring and routing
- Sales pipeline visualization
- Activity tracking
- Email integration
- Reporting and analytics
- Team collaboration
- Mobile responsive
- API for integrations

---

## 3. PROJECT MANAGEMENT SYSTEM

### Description
Comprehensive project management tool with tasks, sprints, kanban boards, time tracking, and team collaboration.

### Tech Stack
- **Framework:** Next.js 15 + TypeScript
- **Auth:** Better Auth
- **Database:** PostgreSQL + Drizzle
- **Real-time:** tRPC subscriptions
- **Frontend:** React + Drag-and-Drop (dnd-kit)
- **API:** tRPC

### Database Parts
- **Core:** PART1, PART2, PART7, PART8
- **Reference:** ToolJet samples

### Project Scaffold

```
project-management/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── projects/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── board/
│   │   │   │   │   ├── list/
│   │   │   │   │   ├── gantt/
│   │   │   │   │   └── timeline/
│   │   │   │   └── page.tsx
│   │   │   ├── tasks/
│   │   │   └── team/
│   │   └── api/trpc/[trpc]/route.ts
│   ├── components/
│   │   ├── board/
│   │   │   ├── kanban-board.tsx
│   │   │   ├── kanban-column.tsx
│   │   │   └── task-card.tsx
│   │   ├── tasks/
│   │   └── gantt/
│   └── server/
│       └── routers/
│           ├── project.ts
│           ├── task.ts
│           ├── sprint.ts
│           └── comment.ts
└── package.json
```

### Core Schema

```typescript
export const projectStatusEnum = pgEnum("project_status", [
  "planning", "active", "on_hold", "completed", "cancelled"
])

export const taskStatusEnum = pgEnum("task_status", [
  "todo", "in_progress", "in_review", "done"
])

export const taskPriorityEnum = pgEnum("task_priority", [
  "low", "medium", "high", "urgent"
])

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: projectStatusEnum("status").default("planning").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  ownerId: uuid("owner_id").references(() => users.id).notNull(),
  teamId: uuid("team_id").references(() => teams.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("todo").notNull(),
  priority: taskPriorityEnum("priority").default("medium").notNull(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  sprintId: uuid("sprint_id").references(() => sprints.id),
  assigneeId: uuid("assignee_id").references(() => users.id),
  reporterId: uuid("reporter_id").references(() => users.id).notNull(),
  estimatedHours: integer("estimated_hours"),
  actualHours: integer("actual_hours"),
  dueDate: timestamp("due_date"),
  position: integer("position").notNull().default(0), // For drag-and-drop ordering
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const sprints = pgTable("sprints", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  goal: text("goal"),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("planned").notNull(), // planned, active, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  taskId: uuid("task_id").references(() => tasks.id).notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const timeEntries = pgTable("time_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id").references(() => tasks.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  hours: integer("hours").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
```

### Estimated Build Time
- **MVP:** 6-8 weeks
- **Production:** 12-16 weeks

---

## 4-10. ADDITIONAL BUSINESS SYSTEMS

Due to length constraints, here are the scaffolds for the remaining systems:

### 4. HR Management System
- **Stack:** Next.js + Better Auth + PostgreSQL
- **Features:** Employee profiles, leave management, performance reviews, onboarding
- **Build Time:** 8-12 weeks
- **DB Parts:** PART1, PART2, PART5 (document uploads)

### 5. Inventory Management System
- **Stack:** Odoo or Next.js + PostgreSQL
- **Features:** Stock tracking, warehouse management, barcode scanning, reorder alerts
- **Build Time:** 6-10 weeks
- **DB Parts:** PART10-13 (Odoo) or PART1-2

### 6. Invoicing & Billing Platform
- **Stack:** Next.js + Stripe + PostgreSQL
- **Features:** Invoice generation, payment processing, recurring billing, tax calculation
- **Build Time:** 4-6 weeks
- **DB Parts:** PART1, PART3 (Stripe), PART2

### 7. Business Intelligence Dashboard
- **Stack:** Next.js + PostgreSQL + Chart libraries
- **Features:** Data visualization, custom reports, KPI tracking, data export
- **Build Time:** 6-8 weeks
- **DB Parts:** PART1, PART2, PART7 (UI)

### 8. Workflow Automation Platform
- **Stack:** Node.js + React + PostgreSQL
- **Features:** Visual workflow builder, triggers, actions, integrations
- **Build Time:** 10-14 weeks
- **DB Parts:** ToolJet samples (37 parts), PART2

### 9. Document Management System
- **Stack:** Next.js + S3/UploadThing + PostgreSQL
- **Features:** File versioning, permissions, search, collaboration
- **Build Time:** 6-8 weeks
- **DB Parts:** PART1, PART5 (uploads), PART2

### 10. Time Tracking & Payroll System
- **Stack:** Next.js + Better Auth + PostgreSQL
- **Features:** Time tracking, expense management, payroll calculation, reporting
- **Build Time:** 8-10 weeks
- **DB Parts:** PART1, PART2, PART3 (payment processing)

---

## 🎯 QUICK SELECTION GUIDE

| Need | Choose | Build Time |
|------|--------|------------|
| All-in-one business solution | ERP System | 24+ weeks |
| Sales & customer management | CRM Platform | 8-12 weeks |
| Team task management | Project Management | 12-16 weeks |
| Employee management | HR System | 8-12 weeks |
| Stock & warehouse | Inventory System | 6-10 weeks |
| Billing & payments | Invoicing Platform | 4-6 weeks |
| Data analysis | BI Dashboard | 6-8 weeks |
| Process automation | Workflow Platform | 10-14 weeks |
| File management | Document System | 6-8 weeks |
| Timesheet & payroll | Time Tracking | 8-10 weeks |

---

**Next:** [PART 02 - Social & Community Platforms →](FULLSTACK_WEBSITE_TYPES_PART02_SOCIAL_COMMUNITY.md)
