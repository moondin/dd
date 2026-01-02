# Technology Stack Mapping

**Quick reference for finding code by technology**

---

## JavaScript/TypeScript Ecosystem

### React & UI Frameworks

| Technology | Where to Find | File Count | Topics |
|------------|---------------|------------|--------|
| **React** | PART7, PART8, Zulip, VSCode, Umami | 2000+ | Components, Hooks, Context |
| **Next.js** | Umami | 6 | SSR, API Routes, App Router |
| **Vite** | PART1 samples | 10 | Build tool, HMR |
| **Remix** | Mentioned in blueprints | Limited | Full-stack React |

### State Management

| Technology | Files | Description |
|------------|-------|-------------|
| **Redux** | PART6_REDUX_APIS.md | RTK, slices, middleware, thunks |
| **Zustand** | PART17_OPENCUT_EDITOR_STATE_ZUSTAND.md | Lightweight state |
| **Context API** | PART8, samples | React built-in |
| **Jotai** | Mentioned | Atomic state |
| **Valtio** | Mentioned | Proxy-based state |

### API & Data Fetching

| Technology | Files | Description |
|------------|-------|-------------|
| **tRPC** | PART2_TRPC_REALTIME.md | Type-safe APIs |
| **React Query** | PART8, samples | Data fetching |
| **RTK Query** | PART6 | Redux data fetching |
| **SWR** | Mentioned | Stale-while-revalidate |
| **Axios** | Samples | HTTP client |

### UI Component Libraries

| Library | Files | Components |
|---------|-------|------------|
| **Shadcn/UI** | PART7_UI_COMPONENTS | Buttons, Forms, Tables, Modals |
| **Radix UI** | PART7 | Primitives |
| **Headless UI** | Mentioned | Unstyled components |
| **Material-UI** | Samples | Complete system |
| **Chakra UI** | Mentioned | Accessible components |

---

## Backend Frameworks

### Node.js

| Framework | Where to Find | Use Cases |
|-----------|---------------|-----------|
| **Express** | Various samples | Basic REST APIs |
| **Fastify** | PART1, PART2 | High-performance APIs |
| **NestJS** | Mentioned in samples | Enterprise Node.js |
| **Hono** | Modern samples | Edge-ready framework |
| **tRPC** | PART2 | End-to-end type safety |

### Python

| Framework | Where to Find | Use Cases |
|-----------|---------------|-----------|
| **Django** | Zulip (1290 parts) | Full-featured web framework |
| **FastAPI** | Mentioned | Modern async Python |
| **Flask** | Mentioned | Microframework |
| **Odoo** | PART10-13 | ERP framework |

### Other Languages

| Language | Framework | Files | Use Cases |
|----------|-----------|-------|-----------|
| **C#** | ASP.NET | ShareX (650 parts) | Desktop, Web |
| **Dart** | Flutter | Spotube | Mobile, Desktop |
| **Go** | Mentioned | - | High-performance services |
| **Rust** | Mentioned | - | Systems programming |

---

## Databases

### SQL Databases

| Database | Where to Find | Patterns |
|----------|---------------|----------|
| **PostgreSQL** | PART1, PART10, Odoo, Zulip | Most common choice |
| **MySQL/MariaDB** | Various samples | Alternative SQL |
| **SQLite** | Desktop apps | Local storage |

### ORMs & Query Builders

| Tool | Files | Language | Features |
|------|-------|----------|----------|
| **Drizzle ORM** | PART1_AUTHENTICATION | TypeScript | Type-safe, lightweight |
| **Prisma** | Umami, samples | TypeScript | Auto-generated client |
| **Odoo ORM** | PART10_ODOO_ORM | Python | Enterprise ORM |
| **TypeORM** | Samples | TypeScript | Decorators |
| **Knex.js** | Samples | JavaScript | Query builder |
| **SQLAlchemy** | Zulip | Python | Python ORM |

### NoSQL & Alternative Stores

| Database | Where | Use Cases |
|----------|-------|-----------|
| **Redis** | Mentioned in samples | Caching, sessions |
| **MongoDB** | Mentioned | Document store |
| **IndexedDB** | PART18_OPENCUT_LOCAL_PERSISTENCE | Browser storage |
| **OPFS** | PART18 | File system API |

---

## Real-time Technologies

| Technology | Files | Use Cases |
|------------|-------|-----------|
| **WebSocket** | PART2, Zulip | Bi-directional communication |
| **Socket.io** | Samples | WebSocket library |
| **Server-Sent Events** | PART2, Zulip | Server push |
| **WebRTC** | Mentioned | Peer-to-peer |
| **Pusher** | Mentioned | Hosted real-time |
| **Ably** | Mentioned | Hosted real-time |

---

## Authentication & Security

| Technology | Files | Features |
|------------|-------|----------|
| **Better Auth** | PART1_AUTHENTICATION | Modern auth solution |
| **NextAuth.js** | Mentioned | Next.js auth |
| **Passport.js** | Samples | Node.js middleware |
| **JWT** | PART1, PART12 | Token-based auth |
| **OAuth 2.0** | PART1, samples | Third-party auth |
| **Session Auth** | PART1, Odoo | Cookie-based |

### Security Tools

| Tool | Where to Find | Purpose |
|------|---------------|---------|
| **Helmet.js** | Samples | Security headers |
| **CORS** | PART11_ODOO_HTTP | Cross-origin |
| **Rate Limiting** | PART11 | DoS prevention |
| **Prowler** | Prowler samples (867 parts) | Cloud security audit |
| **CSP** | Samples | Content Security Policy |

---

## Testing Frameworks

### JavaScript/TypeScript

| Framework | Where to Find | Type |
|-----------|---------------|------|
| **Jest** | VSCode, Zulip | Unit testing |
| **Vitest** | Modern samples | Vite-native testing |
| **Playwright** | VSCode | E2E testing |
| **Cypress** | Mentioned | E2E testing |
| **Testing Library** | React samples | Component testing |

### Python

| Framework | Where to Find | Type |
|-----------|---------------|------|
| **pytest** | Zulip, Odoo | Unit/integration |
| **unittest** | Python samples | Built-in testing |
| **Selenium** | Mentioned | Browser automation |

---

## Build Tools & Bundlers

| Tool | Where to Find | Features |
|------|---------------|----------|
| **Vite** | Modern samples | Fast HMR, ESM |
| **Webpack** | Older samples | Mature bundler |
| **Turbopack** | Mentioned | Next.js bundler |
| **esbuild** | VSCode, modern apps | Fast JS bundler |
| **Rollup** | Libraries | Library bundling |
| **Parcel** | Mentioned | Zero-config |

---

## CSS & Styling

### Frameworks

| Framework | Files | Approach |
|-----------|-------|----------|
| **Tailwind CSS** | PART7, most samples | Utility-first |
| **CSS Modules** | VSCode, samples | Scoped CSS |
| **Styled Components** | Mentioned | CSS-in-JS |
| **Emotion** | Mentioned | CSS-in-JS |
| **Sass/SCSS** | Various | CSS preprocessor |

### UI Kits

| Kit | Files | Type |
|-----|-------|------|
| **Shadcn/UI** | PART7 | Tailwind-based |
| **Tabler** | Tabler sample | Admin template |
| **Material-UI** | Samples | Complete system |
| **Bootstrap** | Older samples | Classic framework |

---

## Desktop Technologies

| Technology | Where to Find | Platform |
|------------|---------------|----------|
| **Electron** | VSCode (552 parts), SIM (933 parts) | Cross-platform |
| **Tauri** | Mentioned | Rust + Web |
| **WinForms** | ShareX (650 parts) | Windows .NET |
| **WPF** | Mentioned | Windows .NET |
| **Qt** | Mentioned | Cross-platform C++ |

---

## Mobile Development

| Technology | Where to Find | Platform |
|------------|---------------|----------|
| **Flutter** | Spotube | Cross-platform |
| **React Native** | Mentioned | Cross-platform |
| **Ionic** | Mentioned | Hybrid apps |

---

## Cloud & Infrastructure

### Cloud Providers

| Provider | Where to Find | Services |
|----------|---------------|----------|
| **AWS** | Prowler (867 parts) | Security auditing |
| **Azure** | Mentioned | Cloud platform |
| **GCP** | Mentioned | Cloud platform |
| **Vercel** | Mentioned | Hosting |
| **Netlify** | Mentioned | Hosting |

### Infrastructure as Code

| Tool | Files | Purpose |
|------|-------|---------|
| **Docker** | Various samples | Containerization |
| **Kubernetes** | Mentioned | Orchestration |
| **Terraform** | Mentioned | IaC |

---

## File Storage & Media

| Service | Files | Features |
|---------|-------|----------|
| **UploadThing** | PART40_ASSET_LIBRARY | File uploads |
| **Cloudinary** | Mentioned | Image hosting |
| **S3** | PART5, samples | Object storage |
| **Local Storage** | PART18 | Browser storage |
| **OPFS** | PART18 | File system API |

---

## Payment Processing

| Service | Files | Features |
|---------|-------|----------|
| **Stripe** | PART39, PART51 | Payment processing |
| **PayPal** | Mentioned | Payment gateway |
| **Paddle** | Mentioned | Merchant of record |

---

## Monitoring & Analytics

| Tool | Where to Find | Purpose |
|------|---------------|---------|
| **Umami** | Umami sample (6 parts) | Privacy-focused analytics |
| **Sentry** | Samples | Error tracking |
| **Grafana** | Mentioned | Metrics visualization |
| **Prometheus** | Mentioned | Metrics collection |

---

## Communication & Messaging

| Technology | Where to Find | Use Case |
|------------|---------------|----------|
| **Zulip** | Zulip samples (1290 parts) | Team chat |
| **Socket.io** | PART2, samples | Real-time messaging |
| **SendGrid** | Mentioned | Email delivery |
| **Twilio** | Mentioned | SMS, Voice |

---

## Search & Indexing

| Technology | Files | Features |
|------------|-------|----------|
| **Elasticsearch** | Zulip | Full-text search |
| **Algolia** | Mentioned | Hosted search |
| **Meilisearch** | Mentioned | Open-source search |

---

## Media Processing

### Video

| Tool | Where to Find | Purpose |
|------|---------------|---------|
| **FFmpeg** | SIM, mentioned | Video processing |
| **Video.js** | Video.js sample | Video player |
| **HLS** | Mentioned | Streaming |

### Images

| Tool | Where to Find | Purpose |
|------|---------------|---------|
| **Sharp** | Samples | Image processing |
| **ImageMagick** | ShareX | Image manipulation |
| **Pillow** | Python samples | Image library |

### Audio

| Tool | Files | Purpose |
|------|-------|---------|
| **FFmpeg** | SIM | Audio processing |
| **Transcription APIs** | PART35 | Speech-to-text |

---

## Development Tools

### Version Control

| Tool | Where | Purpose |
|------|-------|---------|
| **Git** | All samples | Version control |
| **GitHub Actions** | VSCode, ShareX | CI/CD |
| **GitLab CI** | Mentioned | CI/CD |

### Code Quality

| Tool | Where | Purpose |
|------|-------|---------|
| **ESLint** | JavaScript samples | Linting |
| **Prettier** | Samples | Code formatting |
| **TypeScript** | VSCode, modern samples | Type checking |
| **Pylint** | Python samples | Python linting |

### Documentation

| Tool | Where | Purpose |
|------|-------|---------|
| **TypeDoc** | TypeScript projects | API docs |
| **Sphinx** | Python projects | Documentation |
| **Docusaurus** | PART34 | Docs site |
| **VitePress** | Mentioned | Docs site |

---

## Architecture Patterns

| Pattern | Where to Find | Description |
|---------|---------------|-------------|
| **Monorepo** | VSCode, Zulip | Multiple packages |
| **Microservices** | Odoo HTTP (PART11) | Service architecture |
| **Local-First** | PART37, PART38, PART45 | Offline-capable |
| **JAMstack** | Umami, Next.js samples | Static + APIs |
| **MVC** | Django (Zulip), Odoo | Model-View-Controller |
| **MVVM** | Desktop apps | Model-View-ViewModel |

---

## Workflow & Automation

| Tool | Where to Find | Purpose |
|------|---------------|---------|
| **Bull/BullMQ** | Mentioned | Job queues |
| **Cron** | PART53_SCHEDULED_JOBS | Scheduled tasks |
| **Temporal** | Mentioned | Workflow engine |
| **State Machines** | PART54_WORKFLOW_STATE_MACHINE | Workflow logic |

---

## API Standards

| Standard | Files | Features |
|----------|-------|----------|
| **REST** | PART11, most samples | HTTP APIs |
| **GraphQL** | Mentioned | Query language |
| **gRPC** | Mentioned | RPC framework |
| **JSON-RPC** | PART11_ODOO_HTTP | RPC over JSON |
| **tRPC** | PART2 | Type-safe RPC |

---

## Package Managers

| Manager | Platform | Where |
|---------|----------|-------|
| **npm** | Node.js | All JS projects |
| **pnpm** | Node.js | Modern projects |
| **Yarn** | Node.js | Alternative |
| **pip** | Python | All Python |
| **Poetry** | Python | Modern Python |
| **Cargo** | Rust | Mentioned |

---

## Quick Tech Stack Combos

### Modern Full-Stack (2024+)
```
Frontend: React + TypeScript + Vite + Tailwind
State: Zustand or Redux Toolkit
API: tRPC
Database: PostgreSQL + Drizzle ORM
Auth: Better Auth
Deployment: Vercel/Railway
```
**Where:** PART1, PART2, PART6, PART7, PART17

### Traditional SaaS
```
Frontend: Next.js + TypeScript
State: Redux Toolkit
API: REST + Next.js API Routes
Database: PostgreSQL + Prisma
Auth: NextAuth.js
Deployment: Vercel
```
**Where:** Umami sample, various blueprints

### Enterprise Python
```
Backend: Django or Odoo
Frontend: Django templates + minimal JS
Database: PostgreSQL
Auth: Built-in Django auth
Deployment: Traditional server
```
**Where:** Zulip (1290 parts), Odoo (PART10-13)

### Desktop App
```
Framework: Electron or Tauri
Frontend: React + TypeScript
Local DB: SQLite or IndexedDB
Build: Electron Builder
```
**Where:** VSCode (552 parts), SIM (933 parts)

---

**Last Updated:** December 19, 2025  
**Use this file to:** Quickly find which files contain code for specific technologies