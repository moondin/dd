# FULLSTACK WEBSITE TYPES - PART 11: LEGAL, AGRICULTURE, MANUFACTURING & TRAVEL

**Category:** Professional Services & Industry-Specific  
**Total Types:** 25  
**Complexity:** Medium to Very High

---

## 📋 LEGAL TECH (5 types)

1. **Case Management System**
2. **Document Automation Platform**
3. **E-Discovery Tool**
4. **Legal Marketplace**
5. **Contract Management System**

## 📋 AGRICULTURE (5 types)

6. **Farm Management System**
7. **Crop Monitoring Platform**
8. **Livestock Tracking**
9. **Equipment Management**
10. **Agricultural Marketplace**

## 📋 MANUFACTURING (5 types)

11. **Production Planning System (MES)**
12. **Quality Control Platform**
13. **Supply Chain Management**
14. **Equipment Maintenance (CMMS)**
15. **Factory IoT Dashboard**

## 📋 TRAVEL & BOOKING (5 types)

16. **Trip Planning Platform**
17. **Travel Blog/Community**
18. **Accommodation Aggregator**
19. **Tour Booking Platform**
20. **Travel Insurance Marketplace**

## 📋 MEDIA & PUBLISHING (5 types)

21. **Magazine/News Platform**
22. **Podcast Network**
23. **Newsletter Platform**
24. **Digital Library**
25. **Content Syndication Platform**

---

## 1. CASE MANAGEMENT SYSTEM (Legal)

### Tech Stack
- **Framework:** Next.js + TypeScript
- **Database:** PostgreSQL + Drizzle
- **Document Storage:** S3 with encryption
- **Build Time:** 12-18 weeks

### Schema
```typescript
export const cases = pgTable("cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseNumber: text("case_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  
  // Type
  caseType: text("case_type").notNull(), // civil, criminal, family, corporate
  practiceArea: text("practice_area"), // litigation, contract, IP, etc.
  
  // Parties
  clientId: uuid("client_id").references(() => clients.id).notNull(),
  opposingParty: text("opposing_party"),
  
  // Status
  status: text("status").default("open"), // open, pending, closed, archived
  priority: text("priority").default("medium"),
  
  // Court details
  court: text("court"),
  judge: text("judge"),
  caseFiledDate: timestamp("case_filed_date"),
  
  // Team
  leadAttorneyId: uuid("lead_attorney_id").references(() => users.id).notNull(),
  
  // Financial
  retainerAmount: integer("retainer_amount"),
  hourlyRate: integer("hourly_rate"),
  totalBilled: integer("total_billed").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
  
  @@index([clientId])
  @@index([leadAttorneyId])
  @@index([status])
})

export const clients = pgTable("legal_clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Client details (individual or company)
  type: text("type").notNull(), // individual, company
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  
  // Company specific
  companyName: text("company_name"),
  taxId: text("tax_id"),
  
  // Address
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const caseDocuments = pgTable("case_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => cases.id).notNull(),
  
  title: text("title").notNull(),
  documentType: text("document_type").notNull(), // pleading, evidence, contract, correspondence
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  
  // Version control
  version: integer("version").default(1),
  parentDocumentId: uuid("parent_document_id"),
  
  uploadedById: uuid("uploaded_by_id").references(() => users.id).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  
  @@index([caseId])
})

export const caseEvents = pgTable("case_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => cases.id).notNull(),
  
  eventType: text("event_type").notNull(), // hearing, deposition, filing, deadline
  title: text("title").notNull(),
  description: text("description"),
  
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration"), // minutes
  location: text("location"),
  
  // Reminders
  reminderSent: boolean("reminder_sent").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@index([caseId, scheduledAt])
})

export const timeEntries = pgTable("legal_time_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => cases.id).notNull(),
  attorneyId: uuid("attorney_id").references(() => users.id).notNull(),
  
  description: text("description").notNull(),
  hours: real("hours").notNull(),
  rate: integer("rate").notNull(), // hourly rate in cents
  amount: integer("amount").notNull(), // hours * rate
  
  billable: boolean("billable").default(true),
  billed: boolean("billed").default(false),
  
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@index([caseId])
  @@index([attorneyId])
})

export const invoices = pgTable("legal_invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => cases.id).notNull(),
  clientId: uuid("client_id").references(() => clients.id).notNull(),
  
  invoiceNumber: text("invoice_number").notNull().unique(),
  
  totalAmount: integer("total_amount").notNull(),
  paidAmount: integer("paid_amount").default(0),
  
  status: text("status").default("draft"), // draft, sent, paid, overdue
  
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
```

**DB Parts:** PART1, PART5 (documents), PART3 (billing)  
**Build Time:** 12-18 weeks

---

## 6. FARM MANAGEMENT SYSTEM

### Schema
```typescript
export const farms = pgTable("farms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  
  // Location
  address: text("address"),
  totalArea: real("total_area"), // hectares
  latitude: real("latitude"),
  longitude: real("longitude"),
  
  ownerId: uuid("owner_id").references(() => users.id).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const fields = pgTable("fields", {
  id: uuid("id").defaultRandom().primaryKey(),
  farmId: uuid("farm_id").references(() => farms.id).notNull(),
  
  name: text("name").notNull(),
  area: real("area").notNull(), // hectares
  soilType: text("soil_type"),
  
  // Boundaries (GeoJSON)
  boundaries: json("boundaries"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const crops = pgTable("crops", {
  id: uuid("id").defaultRandom().primaryKey(),
  fieldId: uuid("field_id").references(() => fields.id).notNull(),
  
  cropType: text("crop_type").notNull(), // wheat, corn, soybeans
  variety: text("variety"),
  
  plantingDate: timestamp("planting_date").notNull(),
  expectedHarvestDate: timestamp("expected_harvest_date"),
  actualHarvestDate: timestamp("actual_harvest_date"),
  
  // Yields
  expectedYield: real("expected_yield"), // tons
  actualYield: real("actual_yield"),
  
  status: text("status").default("planted"), // planted, growing, harvested
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const activities = pgTable("farm_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  fieldId: uuid("field_id").references(() => fields.id),
  cropId: uuid("crop_id").references(() => crops.id),
  
  activityType: text("activity_type").notNull(), // planting, irrigation, fertilizing, spraying, harvesting
  description: text("description"),
  
  // Resources used
  laborHours: real("labor_hours"),
  cost: integer("cost"), // in cents
  
  // Materials
  materials: json("materials").$type<{name: string, quantity: number, unit: string}[]>(),
  
  performedAt: timestamp("performed_at").notNull(),
  performedBy: uuid("performed_by").references(() => users.id),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const livestock = pgTable("livestock", {
  id: uuid("id").defaultRandom().primaryKey(),
  farmId: uuid("farm_id").references(() => farms.id).notNull(),
  
  tagNumber: text("tag_number").notNull().unique(),
  type: text("type").notNull(), // cattle, sheep, pig, chicken
  breed: text("breed"),
  
  birthDate: timestamp("birth_date"),
  acquisitionDate: timestamp("acquisition_date").notNull(),
  
  gender: text("gender"),
  weight: real("weight"), // kg
  
  status: text("status").default("active"), // active, sold, deceased
  
  healthRecords: json("health_records"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const equipmentRegistry = pgTable("equipment_registry", {
  id: uuid("id").defaultRandom().primaryKey(),
  farmId: uuid("farm_id").references(() => farms.id).notNull(),
  
  name: text("name").notNull(),
  type: text("type").notNull(), // tractor, harvester, sprayer
  make: text("make"),
  model: text("model"),
  year: integer("year"),
  
  purchaseDate: timestamp("purchase_date"),
  purchasePrice: integer("purchase_price"),
  
  currentValue: integer("current_value"),
  
  status: text("status").default("operational"),
  
  hoursUsed: real("hours_used").default(0),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
```

**DB Parts:** PART1, PART2, PostGIS for field mapping  
**Build Time:** 10-14 weeks

---

## 11. PRODUCTION PLANNING SYSTEM (MES - Manufacturing)

### Schema
```typescript
export const products = pgTable("manufactured_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  
  // Bill of Materials (BOM)
  billOfMaterials: json("bill_of_materials").$type<{materialId: string, quantity: number}[]>(),
  
  // Production
  standardProductionTime: integer("standard_production_time"), // minutes
  laborCost: integer("labor_cost"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const productionOrders = pgTable("production_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  
  productId: uuid("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  
  // Scheduling
  plannedStartDate: timestamp("planned_start_date").notNull(),
  plannedEndDate: timestamp("planned_end_date").notNull(),
  actualStartDate: timestamp("actual_start_date"),
  actualEndDate: timestamp("actual_end_date"),
  
  // Status
  status: text("status").default("planned"), // planned, in_progress, completed, cancelled
  priority: text("priority").default("normal"),
  
  // Production line
  workstationId: uuid("workstation_id").references(() => workstations.id),
  
  // Quality
  quantityProduced: integer("quantity_produced").default(0),
  quantityDefective: integer("quantity_defective").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const workstations = pgTable("workstations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // assembly, machining, packaging
  
  capacity: integer("capacity"), // units per hour
  status: text("status").default("operational"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const qualityChecks = pgTable("quality_checks", {
  id: uuid("id").defaultRandom().primaryKey(),
  productionOrderId: uuid("production_order_id").references(() => productionOrders.id).notNull(),
  
  checkType: text("check_type").notNull(), // dimensional, visual, functional
  result: text("result").notNull(), // pass, fail
  
  defects: json("defects").$type<{type: string, severity: string, description: string}[]>(),
  
  inspectedBy: uuid("inspected_by").references(() => users.id).notNull(),
  inspectedAt: timestamp("inspected_at").defaultNow().notNull(),
})

export const materials = pgTable("raw_materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  
  unit: text("unit").notNull(), // kg, meters, pieces
  quantityOnHand: real("quantity_on_hand").default(0),
  reorderPoint: real("reorder_point"),
  
  unitCost: integer("unit_cost"),
  
  supplierId: uuid("supplier_id").references(() => suppliers.id),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const suppliers = pgTable("suppliers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  
  rating: real("rating"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
```

**DB Parts:** PART1, PART2, Inventory management  
**Build Time:** 14-20 weeks

---

## 16. TRIP PLANNING PLATFORM (Travel)

### Schema
```typescript
export const trips = pgTable("travel_trips", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  title: text("title").notNull(),
  description: text("description"),
  
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  
  destinations: json("destinations").$type<{city: string, country: string, days: number}[]>(),
  
  budget: integer("budget"),
  travelers: integer("travelers").default(1),
  
  visibility: text("visibility").default("private"), // private, friends, public
  
  coverImage: text("cover_image"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const itineraryItems = pgTable("itinerary_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  tripId: uuid("trip_id").references(() => trips.id).notNull(),
  
  date: timestamp("date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  
  type: text("type").notNull(), // flight, accommodation, activity, restaurant
  title: text("title").notNull(),
  description: text("description"),
  
  location: text("location"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  
  cost: integer("cost"),
  bookingReference: text("booking_reference"),
  bookingUrl: text("booking_url"),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@index([tripId, date])
})

export const tripCollaborators = pgTable("trip_collaborators", {
  tripId: uuid("trip_id").references(() => trips.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  role: text("role").default("viewer"), // editor, viewer
  
  @@unique([tripId, userId])
})
```

**DB Parts:** PART1, PART2, Maps integration  
**Build Time:** 8-12 weeks

---

## 21. MAGAZINE/NEWS PLATFORM (Media)

### Schema
```typescript
export const publications = pgTable("publications", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  
  type: text("type").notNull(), // magazine, newspaper, journal
  frequency: text("frequency"), // daily, weekly, monthly
  
  logo: text("logo"),
  coverImage: text("cover_image"),
  
  ownerId: uuid("owner_id").references(() => users.id).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const issues = pgTable("issues", {
  id: uuid("id").defaultRandom().primaryKey(),
  publicationId: uuid("publication_id").references(() => publications.id).notNull(),
  
  issueNumber: integer("issue_number").notNull(),
  volume: integer("volume"),
  
  title: text("title").notNull(),
  coverImage: text("cover_image"),
  
  publishDate: timestamp("publish_date").notNull(),
  
  status: text("status").default("draft"), // draft, published, archived
  
  @@unique([publicationId, issueNumber, volume])
})

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  publicationId: uuid("publication_id").references(() => publications.id).notNull(),
  issueId: uuid("issue_id").references(() => issues.id),
  
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  subtitle: text("subtitle"),
  
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  
  // Media
  featuredImage: text("featured_image"),
  
  // Author
  authorId: uuid("author_id").references(() => users.id).notNull(),
  
  // Categorization
  category: text("category"),
  tags: text("tags").array(),
  
  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  
  // Status
  status: text("status").default("draft"),
  publishedAt: timestamp("published_at"),
  
  // Engagement
  views: integer("views").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  @@unique([publicationId, slug])
})

export const subscriptions = pgTable("publication_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  publicationId: uuid("publication_id").references(() => publications.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  plan: text("plan").notNull(), // free, monthly, annual
  status: text("status").default("active"),
  
  stripeSubscriptionId: text("stripe_subscription_id"),
  
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  
  @@unique([publicationId, userId])
})
```

**DB Parts:** PART1, PART3 (subscriptions), CMS patterns  
**Build Time:** 8-12 weeks

---

## QUICK REFERENCE SUMMARY

### Legal Tech (5 types)
- Case Management: 12-18 weeks
- Document Automation: 10-14 weeks
- E-Discovery: 16-24 weeks
- Legal Marketplace: 8-12 weeks
- Contract Management: 10-14 weeks

### Agriculture (5 types)
- Farm Management: 10-14 weeks
- Crop Monitoring: 12-16 weeks (with IoT)
- Livestock Tracking: 8-12 weeks
- Equipment Management: 6-8 weeks
- Ag Marketplace: 8-10 weeks

### Manufacturing (5 types)
- Production Planning (MES): 14-20 weeks
- Quality Control: 10-14 weeks
- Supply Chain: 14-20 weeks
- Equipment Maintenance (CMMS): 10-12 weeks
- Factory IoT: 12-18 weeks

### Travel (5 types)
- Trip Planning: 8-12 weeks
- Travel Blog: 6-8 weeks
- Accommodation Aggregator: 12-16 weeks
- Tour Booking: 10-14 weeks
- Travel Insurance: 10-12 weeks

### Media & Publishing (5 types)
- Magazine Platform: 8-12 weeks
- Podcast Network: 10-14 weeks
- Newsletter Platform: 6-8 weeks
- Digital Library: 10-14 weeks
- Content Syndication: 8-12 weeks

**Total Additional Types: 25**  
**Grand Total So Far: 100+ Website Types**

---

**Next:** [Return to Comprehensive Index ←](FULLSTACK_WEBSITE_TYPES_COMPREHENSIVE_INDEX.md)
