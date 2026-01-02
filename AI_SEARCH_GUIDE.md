# AI Agent Search Cheat Sheet

**Quick reference for efficiently searching the Fullstack Code Database**

---

## 🎯 Common Search Patterns

### Authentication & Security

```
Query: "How to implement JWT authentication?"
→ Start: FULLSTACK_CODE_DATABASE_PART1_AUTHENTICATION.md
→ Keywords: JWT, token, session, cookie, middleware

Query: "Role-based access control patterns?"
→ Start: FULLSTACK_CODE_DATABASE_PART12_ODOO_SECURITY.index.md
→ Keywords: RBAC, ACL, permissions, groups, access-control
```

### Real-time Communication

```
Query: "WebSocket implementation?"
→ Start: FULLSTACK_CODE_DATABASE_PART2_TRPC_REALTIME.md
→ Also check: ZULIP samples (real-time chat)
→ Keywords: websocket, socket.io, real-time, pub-sub, subscription

Query: "Server-Sent Events (SSE)?"
→ Check: PART2, Zulip samples
→ Keywords: SSE, event-stream, push, real-time
```

### Database & ORM

```
Query: "Complex SQL queries?"
→ Start: FULLSTACK_CODE_DATABASE_PART10_ODOO_ORM.index.md
→ Keywords: ORM, query, join, aggregate, transaction

Query: "Database migrations?"
→ Check: Odoo ORM parts, Zulip samples
→ Keywords: migration, schema, versioning, alter-table
```

### State Management

```
Query: "Redux with TypeScript?"
→ Start: FULLSTACK_CODE_DATABASE_PART6_REDUX_APIS.md
→ Keywords: redux, RTK, slice, thunk, typescript

Query: "Lightweight state management?"
→ Start: FULLSTACK_CODE_DATABASE_PART17_OPENCUT_EDITOR_STATE_ZUSTAND.md
→ Keywords: zustand, jotai, valtio, local-state
```

### UI Components

```
Query: "Form validation patterns?"
→ Start: FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.index.md
→ Keywords: form, validation, react-hook-form, zod, yup

Query: "Data table with sorting/filtering?"
→ Start: PART7_UI_COMPONENTS
→ Keywords: table, grid, sorting, filtering, pagination
```

### File Operations

```
Query: "File upload with progress?"
→ Start: FULLSTACK_CODE_DATABASE_PART5_UPLOADS_EXTRAS.md
→ Also: PART40_ASSET_LIBRARY_UPLOADTHING.md
→ Keywords: upload, multipart, progress, chunked, S3

Query: "Image processing?"
→ Check: ShareX samples
→ Keywords: image, resize, crop, compress, thumbnail
```

---

## 📂 Collections by Size

### Massive (500+ parts)
- **Zulip** - 1,290 parts → Team chat, Python/Django/TypeScript
- **SIM** - 933 parts → Media manager, Node.js/Electron
- **Prowler** - 867 parts → Security audit, Python/AWS
- **ShareX** - 650 parts → Screen capture, C#/.NET
- **VSCode** - 552 parts → Editor, TypeScript/Electron

**Search strategy:** Always start with `.index.md` file

### Medium (10-100 parts)
- **ToolJet** - 37 parts → Low-code, React/Node
- **Vert** - 18 parts → 3D viz, WebGL/Three.js
- **Umami** - 6 parts → Analytics, Next.js

### Small (1-5 parts)
- All PART files (1-23, 24-54)
- Single-concept implementations

---

## 🔑 Keyword Mapping

### Frontend Technologies

| Technology | Keywords | Where to Find |
|------------|----------|---------------|
| **React** | `react`, `component`, `jsx`, `hooks` | PART7, PART8, Zulip, VSCode |
| **TypeScript** | `typescript`, `type`, `interface` | VSCode, Zulip, PART samples |
| **State Management** | `redux`, `zustand`, `context` | PART6, PART17 |
| **Styling** | `tailwind`, `css`, `styled` | PART7, UI samples |
| **Forms** | `form`, `validation`, `react-hook-form` | PART7 |

### Backend Technologies

| Technology | Keywords | Where to Find |
|------------|----------|---------------|
| **Node.js** | `express`, `fastify`, `koa` | PART2, Umami, ToolJet |
| **Python** | `django`, `flask`, `fastapi` | Odoo, Zulip, Prowler |
| **API** | `REST`, `GraphQL`, `tRPC`, `JSON-RPC` | PART2, PART11, samples |
| **Database** | `sql`, `postgres`, `prisma`, `drizzle` | PART1, PART10, samples |

### Infrastructure & DevOps

| Topic | Keywords | Where to Find |
|-------|----------|---------------|
| **Docker** | `docker`, `container`, `dockerfile` | Various samples |
| **CI/CD** | `github-actions`, `CI`, `deploy` | ShareX, VSCode, Zulip |
| **Testing** | `test`, `jest`, `pytest`, `vitest` | All major samples |
| **Monitoring** | `logging`, `metrics`, `sentry` | Odoo, Zulip |

### Architecture Patterns

| Pattern | Keywords | Where to Find |
|---------|----------|---------------|
| **Monorepo** | `workspace`, `turborepo`, `lerna` | VSCode, Zulip |
| **Microservices** | `service`, `API-gateway`, `message-queue` | Odoo HTTP |
| **Local-First** | `offline`, `sync`, `CRDT` | PART37, PART38, PART45 |
| **Real-time** | `websocket`, `SSE`, `push` | PART2, Zulip |

---

## 🗂️ Topic-to-File Quick Reference

### Authentication Flow
1. Database schema → `PART1_AUTHENTICATION.md` (line 45+)
2. Backend auth setup → `PART1_AUTHENTICATION.md` (line 100+)
3. Frontend components → `PART1B_AUTH_COMPONENTS.md`
4. Enterprise security → `PART12_ODOO_SECURITY.index.md`

### E-commerce System
1. Product catalog → `PART3_ECOMMERCE_SOCIAL.md`
2. Shopping cart → `PART3_ECOMMERCE_SOCIAL.md`
3. Payment integration → `PART39_SUBSCRIPTION_BILLING_DASHBOARD.md`
4. Order management → `PART33_ORDER_MANAGEMENT_CONSOLE.md`

### Social Features
1. User profiles → `PART4_SOCIAL_MEDIA.md`
2. Feed/timeline → `PART4_SOCIAL_MEDIA.md`
3. Messaging → `PART2_TRPC_REALTIME.md` + Zulip
4. Notifications → `PART49_REALTIME_NOTIFICATIONS_CENTER.md`

### Content Management
1. Rich text editor → `PART38_LOCAL_FIRST_EDITOR_SHELL.md`
2. File uploads → `PART5_UPLOADS_EXTRAS.md`
3. Media library → `PART40_ASSET_LIBRARY_UPLOADTHING.md`
4. Docs portal → `PART34_DOCS_KNOWLEDGE_BASE_PORTAL.md`

### Admin Dashboards
1. User management → `PART41_ADMIN_USER_MANAGEMENT.md`
2. Analytics → Umami samples
3. ERP backoffice → `PART30_ERP_LITE_BACKOFFICE.md`
4. Audit logs → `PART52_ERP_AUDIT_LOG_ACTIVITY.md`

---

## 🧠 Search Strategies

### Strategy 1: Top-Down (Conceptual)
1. Start with README.md → Find category
2. Go to category index file
3. Review overview and parts list
4. Read specific parts

**Best for:** Learning new concepts, broad understanding

### Strategy 2: Bottom-Up (Specific)
1. Use keyword search in file names
2. Check YAML frontmatter for context
3. Read specific code section
4. Follow references if needed

**Best for:** Finding specific implementation details

### Strategy 3: Technology-First
1. Find your tech stack in README
2. Check all files tagged with that tech
3. Compare implementations
4. Choose best pattern

**Best for:** Technology-specific questions

### Strategy 4: Sample-Based
1. Find similar project in samples
2. Read index for architecture overview
3. Search for specific feature
4. Extract pattern

**Best for:** Real-world examples

---

## 💡 Pro Tips

### Efficient File Navigation

```
✅ Good:
1. Check README.md first
2. Go to relevant .index.md
3. Find part number in index
4. Read specific part

❌ Avoid:
- Opening random part files
- Searching without context
- Ignoring metadata
```

### Keyword Selection

```
✅ Specific keywords work best:
- "JWT authentication middleware"
- "React table with server-side pagination"
- "Websocket reconnection logic"

❌ Avoid vague terms:
- "auth" (too broad)
- "code" (everything)
- "function" (not descriptive)
```

### Reading Large Collections

```
For 500+ part collections:
1. Read .index.md (gives structure)
2. Use part number for navigation
3. Check frontmatter for context
4. Use grep/search within collection
```

---

## 📋 Common Queries Solved

### "How do I implement..."

| Query | Go To | Part/Line |
|-------|-------|-----------|
| User login | PART1 | Line 100+ |
| File upload | PART5 | Line 1+ |
| Real-time chat | PART2 + Zulip | Multiple |
| Redux store | PART6 | Line 50+ |
| Protected routes | PART1B | Line 200+ |
| Database migrations | Odoo PART10 | part02 |
| API rate limiting | PART11 | Line 300+ |
| Form validation | PART7 | part01 |

### "Where can I find..."

| Looking For | Check | Notes |
|-------------|-------|-------|
| TypeScript patterns | VSCode, Zulip | 500+ parts each |
| Python best practices | Odoo, Zulip, Prowler | Enterprise patterns |
| React components | PART7, samples | Reusable UI |
| Database schemas | PART1, PART10 | Multiple patterns |
| API designs | PART2, PART11 | REST, GraphQL, tRPC |

### "What's the best way to..."

| Task | Recommended Files | Why |
|------|-------------------|-----|
| Build a chat app | PART2 + Zulip | Real implementation |
| Create admin panel | PART25, PART41 | Complete blueprints |
| Handle payments | PART39, PART51 | Stripe integration |
| Manage state | PART6, PART17 | Multiple approaches |
| Upload files | PART5, PART40 | Various strategies |

---

## 🎓 Learning Paths

### Beginner Path
1. Start: README.md
2. Read: PART1 (Authentication)
3. Then: PART7 (UI Components)
4. Practice: Small blueprints (PART27-29)

### Intermediate Path
1. Review: PART2 (Real-time)
2. Study: PART6 (State Management)
3. Explore: Medium samples (Umami, ToolJet)
4. Build: Complex blueprints (PART30-33)

### Advanced Path
1. Deep dive: Odoo PART10-13
2. Analyze: Large samples (Zulip, VSCode)
3. Master: Architecture patterns
4. Implement: ERP features (PART52-54)

---

## 🔧 Tools & Techniques

### Fast Text Search
```powershell
# Find all files with "websocket"
Get-ChildItem -Recurse -Filter "*.md" | Select-String "websocket"

# Search specific collection
Select-String "authentication" FULLSTACK_CODE_DATABASE_PART*.md
```

### Content Filtering
```
Look for these markers:
- `---[FILE: filename]---` = New file starts
- `Location: path/to/file` = File location
- `Purpose:` = What this code does
- Keywords: in README for quick filtering
```

### Metadata Reading
```yaml
# Every file has this at top:
---
source_txt: original_file.txt
converted_utc: timestamp
part: N
parts_total: M
---

Use this to know:
- What you're reading
- How much more exists
- When it was created
```

---

## 📈 Coverage Matrix

| Topic | Coverage | Best Files |
|-------|----------|-----------|
| **Frontend** | ⭐⭐⭐⭐⭐ | PART7, PART8, VSCode, Zulip |
| **Backend** | ⭐⭐⭐⭐⭐ | PART1-6, PART10-13, Odoo, Zulip |
| **Database** | ⭐⭐⭐⭐⭐ | PART10, Odoo ORM, samples |
| **Auth** | ⭐⭐⭐⭐⭐ | PART1, PART12, samples |
| **Real-time** | ⭐⭐⭐⭐ | PART2, Zulip |
| **Testing** | ⭐⭐⭐ | Scattered across samples |
| **DevOps** | ⭐⭐⭐ | Various samples |
| **Mobile** | ⭐⭐ | Spotube (Flutter) |
| **Desktop** | ⭐⭐⭐⭐ | VSCode, ShareX, SIM, Drawio |
| **Security** | ⭐⭐⭐⭐⭐ | PART12, Prowler, Odoo |

---

**Remember:** This database is optimized for AI agent search. Use the structure, metadata, and keywords to navigate efficiently!

---

**Last Updated:** December 19, 2025  
**Version:** 2.0