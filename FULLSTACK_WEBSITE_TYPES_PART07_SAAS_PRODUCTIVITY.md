# FULLSTACK WEBSITE TYPES - PART 07: SAAS & PRODUCTIVITY

**Category:** SaaS & Productivity  
**Total Types:** 8  
**Complexity:** Medium to High  
**Database References:** PART1-8, Umami (6 parts), Zulip (1,290 parts)

---

## 📋 WEBSITE TYPES

1. **Analytics Platform** - Google Analytics alternative
2. **Form Builder** - Typeform-like
3. **Email Marketing Platform** - Mailchimp-like
4. **Customer Support/Helpdesk** - Zendesk-like
5. **Survey Platform** - SurveyMonkey-like
6. **Password Manager** - 1Password-like
7. **Note-Taking App** - Notion-like
8. **Calendar/Scheduling Tool** - Calendly-like

---

## 1. ANALYTICS PLATFORM

### Tech Stack (from Umami - 6 parts)
- **Framework:** Next.js 14+ + TypeScript
- **Database:** PostgreSQL + Prisma
- **Tracking:** Custom JavaScript snippet
- **Build Time:** 8-12 weeks

### Complete Schema (from Umami)
```prisma
model Website {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  domain    String?
  shareId   String?  @unique
  revShareToken String? @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  sessions  Session[]
  events    Event[]
  
  @@index([userId])
}

model Session {
  id          String   @id @default(cuid())
  websiteId   String
  website     Website  @relation(fields: [websiteId], references: [id], onDelete: Cascade)
  hostname    String
  browser     String
  os          String
  device      String
  screen      String
  language    String
  country     String?
  subdivision1 String?
  subdivision2 String?
  city        String?
  
  createdAt   DateTime @default(now())
  
  events      Event[]
  
  @@index([websiteId])
  @@index([createdAt])
}

model Event {
  id        String   @id @default(cuid())
  websiteId String
  website   Website  @relation(fields: [websiteId], references: [id], onDelete: Cascade)
  sessionId String
  session   Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  urlPath   String
  urlQuery  String?
  referrer  String?
  eventName String?
  eventData Json?
  
  createdAt DateTime @default(now())
  
  @@index([websiteId])
  @@index([sessionId])
  @@index([createdAt])
}
```

### Tracking Script
```typescript
// public/script.js
(function() {
  const website = '{{WEBSITE_ID}}'
  const endpoint = '{{API_ENDPOINT}}/api/collect'
  
  const data = {
    website,
    hostname: window.location.hostname,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    title: document.title,
    url: window.location.pathname,
    referrer: document.referrer
  }
  
  // Send initial pageview
  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'pageview', payload: data })
  })
  
  // Track custom events
  window.umami = {
    track: (eventName, eventData) => {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'event',
          payload: { ...data, eventName, eventData }
        })
      })
    }
  }
})()
```

**DB Parts:** Umami samples (6 parts), PART1, PART7 (dashboards)

---

## 2. FORM BUILDER

### Tech Stack
- **Framework:** Next.js + TypeScript
- **Database:** PostgreSQL + Drizzle
- **Form Renderer:** React Hook Form + Custom engine
- **Build Time:** 8-12 weeks

### Schema
```typescript
export const forms = pgTable("forms", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Form definition (fields, logic, styling)
  definition: json("definition").$type<FormDefinition>(),
  
  // Settings
  isPublic: boolean("is_public").default(true),
  allowMultipleSubmissions: boolean("allow_multiple_submissions").default(false),
  closedAt: timestamp("closed_at"),
  
  // Notifications
  notificationEmail: text("notification_email"),
  sendConfirmationEmail: boolean("send_confirmation_email").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const formSubmissions = pgTable("form_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  formId: uuid("form_id").references(() => forms.id).notNull(),
  
  // Response data
  data: json("data").$type<Record<string, any>>(),
  
  // Metadata
  ip: text("ip"),
  userAgent: text("user_agent"),
  submittedBy: uuid("submitted_by").references(() => users.id), // Optional auth
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@index([formId])
})

interface FormDefinition {
  fields: FormField[]
  logic?: ConditionalLogic[]
  styling?: FormStyling
}

interface FormField {
  id: string
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'file'
  label: string
  placeholder?: string
  required: boolean
  validation?: ValidationRule[]
  options?: string[] // For select, radio, checkbox
}
```

**DB Parts:** PART1, PART2, PART7

---

## 3. EMAIL MARKETING PLATFORM

### Tech Stack
- **Framework:** Next.js + TypeScript
- **Database:** PostgreSQL + Drizzle
- **Email Service:** Resend, SendGrid, or AWS SES
- **Build Time:** 10-14 weeks

### Schema
```typescript
export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  fromName: text("from_name").notNull(),
  fromEmail: text("from_email").notNull(),
  replyTo: text("reply_to"),
  
  // Content
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content"),
  
  // Scheduling
  status: text("status").default("draft"), // draft, scheduled, sending, sent
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  
  userId: uuid("user_id").references(() => users.id).notNull(),
  listIds: uuid("list_ids").array(), // Target lists
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const lists = pgTable("lists", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: uuid("user_id").references(() => users.id).notNull(),
  subscriberCount: integer("subscriber_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  status: text("status").default("subscribed"), // subscribed, unsubscribed, bounced
  userId: uuid("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@unique([userId, email])
})

export const listSubscribers = pgTable("list_subscribers", {
  listId: uuid("list_id").references(() => lists.id).notNull(),
  subscriberId: uuid("subscriber_id").references(() => subscribers.id).notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  
  @@unique([listId, subscriberId])
})

export const campaignStats = pgTable("campaign_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id").references(() => campaigns.id).notNull(),
  subscriberId: uuid("subscriber_id").references(() => subscribers.id).notNull(),
  
  sent: boolean("sent").default(false),
  delivered: boolean("delivered").default(false),
  opened: boolean("opened").default(false),
  clicked: boolean("clicked").default(false),
  bounced: boolean("bounced").default(false),
  unsubscribed: boolean("unsubscribed").default(false),
  
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  
  @@unique([campaignId, subscriberId])
})
```

**DB Parts:** PART1, PART2, PART3 (email patterns)

---

## 4. CUSTOMER SUPPORT/HELPDESK

### Tech Stack
- **Framework:** Next.js + TypeScript
- **Database:** PostgreSQL + Drizzle
- **Real-time:** tRPC subscriptions or WebSockets
- **Build Time:** 10-14 weeks

### Schema
```typescript
export const tickets = pgTable("tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  subject: text("subject").notNull(),
  status: text("status").default("open"), // open, pending, resolved, closed
  priority: text("priority").default("medium"), // low, medium, high, urgent
  
  customerId: uuid("customer_id").references(() => users.id).notNull(),
  assignedToId: uuid("assigned_to_id").references(() => users.id),
  
  tags: text("tags").array(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
})

export const ticketMessages = pgTable("ticket_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketId: uuid("ticket_id").references(() => tickets.id).notNull(),
  content: text("content").notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  isInternal: boolean("is_internal").default(false), // Internal notes vs customer-visible
  attachments: text("attachments").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@index([ticketId])
})

export const macros = pgTable("macros", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  isShared: boolean("is_shared").default(false),
})
```

**DB Parts:** PART1, PART2, Zulip patterns for real-time

---

## 5-8. ADDITIONAL SAAS TYPES

### 5. Survey Platform
- **Stack:** Next.js + PostgreSQL
- **Build Time:** 8-10 weeks
- **Key:** Question branching logic, analytics
- **DB Parts:** PART1, PART2, PART7

### 6. Password Manager
- **Stack:** Electron/Web + E2E Encryption + PostgreSQL
- **Build Time:** 12-16 weeks
- **Key:** Zero-knowledge encryption, auto-fill
- **DB Parts:** PART1 (auth), Electron patterns

### 7. Note-Taking App (Notion-like)
- **Stack:** Next.js + Block-based editor + PostgreSQL
- **Build Time:** 14-20 weeks
- **Key:** Block editor, real-time collaboration
- **DB Parts:** PART1, PART2, PART7

### 8. Calendar/Scheduling Tool
- **Stack:** Next.js + PostgreSQL + Calendar APIs
- **Build Time:** 8-12 weeks
- **Key:** Availability sync, timezone handling
- **DB Parts:** PART1, PART2

---

**Quick Reference:**
- Analytics: 8-12 weeks (Umami samples)
- Form Builder: 8-12 weeks (PART1, PART2, PART7)
- Email Marketing: 10-14 weeks (PART1, PART2)
- Helpdesk: 10-14 weeks (PART1, PART2, Zulip)
- Survey Platform: 8-10 weeks (PART1, PART2)
- Password Manager: 12-16 weeks (PART1, Electron)
- Note-Taking: 14-20 weeks (PART1, PART2, PART7)
- Scheduling: 8-12 weeks (PART1, PART2)

---

**Next:** [PART 08 - Specialized Applications →](FULLSTACK_WEBSITE_TYPES_PART08_SPECIALIZED.md)
