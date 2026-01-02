---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 4
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 4 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: README.md]---
Location: sim-main/README.md

```text
<p align="center">
  <a href="https://sim.ai" target="_blank" rel="noopener noreferrer">
    <img src="apps/sim/public/logo/reverse/text/large.png" alt="Sim Logo" width="500"/>
  </a>
</p>

<p align="center">Build and deploy AI agent workflows in minutes.</p>

<p align="center">
  <a href="https://sim.ai" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/sim.ai-6F3DFA" alt="Sim.ai"></a>
  <a href="https://discord.gg/Hr4UWYEcTT" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Discord-Join%20Server-5865F2?logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://x.com/simdotai" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/twitter/follow/simstudioai?style=social" alt="Twitter"></a>
  <a href="https://docs.sim.ai" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Docs-6F3DFA.svg" alt="Documentation"></a>
</p>

### Build Workflows with Ease
Design agent workflows visually on a canvas—connect agents, tools, and blocks, then run them instantly.

<p align="center">
  <img src="apps/sim/public/static/workflow.gif" alt="Workflow Builder Demo" width="800"/>
</p>

### Supercharge with Copilot
Leverage Copilot to generate nodes, fix errors, and iterate on flows directly from natural language.

<p align="center">
  <img src="apps/sim/public/static/copilot.gif" alt="Copilot Demo" width="800"/>
</p>

### Integrate Vector Databases
Upload documents to a vector store and let agents answer questions grounded in your specific content.

<p align="center">
  <img src="apps/sim/public/static/knowledge.gif" alt="Knowledge Uploads and Retrieval Demo" width="800"/>
</p>

## Quickstart

### Cloud-hosted: [sim.ai](https://sim.ai)

<a href="https://sim.ai" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/sim.ai-6F3DFA?logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iNjE2IiBoZWlnaHQ9IjYxNiIgdmlld0JveD0iMCAwIDYxNiA2MTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xMTU5XzMxMykiPgo8cGF0aCBkPSJNNjE2IDBIMFY2MTZINjE2VjBaIiBmaWxsPSIjNkYzREZBIi8+CjxwYXRoIGQ9Ik04MyAzNjUuNTY3SDExM0MxMTMgMzczLjgwNSAxMTYgMzgwLjM3MyAxMjIgMzg1LjI3MkMxMjggMzg5Ljk0OCAxMzYuMTExIDM5Mi4yODUgMTQ2LjMzMyAzOTIuMjg1QzE1Ny40NDQgMzkyLjI4NSAxNjYgMzkwLjE3MSAxNzIgMzg1LjkzOUMxNzcuOTk5IDM4MS40ODcgMTgxIDM3NS41ODYgMTgxIDM2OC4yMzlDMTgxIDM2Mi44OTUgMTc5LjMzMyAzNTguNDQyIDE3NiAzNTQuODhDMTcyLjg4OSAzNTEuMzE4IDE2Ny4xMTEgMzQ4LjQyMiAxNTguNjY3IDM0Ni4xOTZMMTMwIDMzOS41MTdDMTE1LjU1NSAzMzUuOTU1IDEwNC43NzggMzMwLjQ5OSA5Ny42NjY1IDMyMy4xNTFDOTAuNzc3NSAzMTUuODA0IDg3LjMzMzQgMzA2LjExOSA4Ny4zMzM0IDI5NC4wOTZDODcuMzMzNCAyODQuMDc2IDg5Ljg4OSAyNzUuMzkyIDk0Ljk5OTYgMjY4LjA0NUMxMDAuMzMzIDI2MC42OTcgMTA3LjU1NSAyNTUuMDIgMTE2LjY2NiAyNTEuMDEyQzEyNiAyNDcuMDA0IDEzNi42NjcgMjQ1IDE0OC42NjYgMjQ1QzE2MC42NjcgMjQ1IDE3MSAyNDcuMTE2IDE3OS42NjcgMjUxLjM0NkMxODguNTU1IDI1NS41NzYgMTk1LjQ0NCAyNjEuNDc3IDIwMC4zMzMgMjY5LjA0N0MyMDUuNDQ0IDI3Ni42MTcgMjA4LjExMSAyODUuNjM0IDIwOC4zMzMgMjk2LjA5OUgxNzguMzMzQzE3OC4xMTEgMjg3LjYzOCAxNzUuMzMzIDI4MS4wNyAxNjkuOTk5IDI3Ni4zOTRDMTY0LjY2NiAyNzEuNzE5IDE1Ny4yMjIgMjY5LjM4MSAxNDcuNjY3IDI2OS4zODFDMTM3Ljg4OSAyNjkuMzgxIDEzMC4zMzMgMjcxLjQ5NiAxMjUgMjc1LjcyNkMxMTkuNjY2IDI3OS45NTcgMTE3IDI4NS43NDYgMTE3IDI5My4wOTNDMTE3IDMwNC4wMDMgMTI1IDMxMS40NjIgMTQxIDMxNS40N0wxNjkuNjY3IDMyMi40ODNDMTgzLjQ0NSAzMjUuNiAxOTMuNzc4IDMzMC43MjIgMjAwLjY2NyAzMzcuODQ3QzIwNy41NTUgMzQ0Ljc0OSAyMTEgMzU0LjIxMiAyMTEgMzY2LjIzNUMyMTEgMzc2LjQ3NyAyMDguMjIyIDM4NS40OTQgMjAyLjY2NiAzOTMuMjg3QzE5Ny4xMTEgNDAwLjg1NyAxODkuNDQ0IDQwNi43NTggMTc5LjY2NyA0MTAuOTg5QzE3MC4xMTEgNDE0Ljk5NiAxNTguNzc4IDQxNyAxNDUuNjY3IDQxN0MxMjYuNTU1IDQxNyAxMTEuMzMzIDQxMi4zMjUgOTkuOTk5NyA0MDIuOTczQzg4LjY2NjggMzkzLjYyMSA4MyAzODEuMTUzIDgzIDM2NS41NjdaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjMyLjI5MSA0MTNWMjUwLjA4MkMyNDQuNjg0IDI1NC42MTQgMjUwLjE0OCAyNTQuNjE0IDI2My4zNzEgMjUwLjA4MlY0MTNIMjMyLjI5MVpNMjQ3LjUgMjM5LjMxM0MyNDEuOTkgMjM5LjMxMyAyMzcuMTQgMjM3LjMxMyAyMzIuOTUyIDIzMy4zMTZDMjI4Ljk4NCAyMjkuMDk1IDIyNyAyMjQuMjA5IDIyNyAyMTguNjU2QzIyNyAyMTIuODgyIDIyOC45ODQgMjA3Ljk5NSAyMzIuOTUyIDIwMy45OTdDMjM3LjE0IDE5OS45OTkgMjQxLjk5IDE5OCAyNDcuNSAxOThDMjUzLjIzMSAxOTggMjU4LjA4IDE5OS45OTkgMjYyLjA0OSAyMDMuOTk3QzI2Ni4wMTYgMjA3Ljk5NSAyNjggMjEyLjg4MiAyNjggMjE4LjY1NkMyNjggMjI0LjIwOSAyNjYuMDE2IDIyOS4wOTUgMjYyLjA0OSAyMzMuMzE2QzI1OC4wOCAyMzcuMzEzIDI1My4yMzEgMjM5LjMxMyAyNDcuNSAyMzkuMzEzWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTMxOS4zMzMgNDEzSDI4OFYyNDkuNjc2SDMxNlYyNzcuMjMzQzMxOS4zMzMgMjY4LjEwNCAzMjUuNzc4IDI2MC4zNjQgMzM0LjY2NyAyNTQuMzUyQzM0My43NzggMjQ4LjExNyAzNTQuNzc4IDI0NSAzNjcuNjY3IDI0NUMzODIuMTExIDI0NSAzOTQuMTEyIDI0OC44OTcgNDAzLjY2NyAyNTYuNjlDNDEzLjIyMiAyNjQuNDg0IDQxOS40NDQgMjc0LjgzNyA0MjIuMzM0IDI4Ny43NTJINDE2LjY2N0M0MTguODg5IDI3NC44MzcgNDI1IDI2NC40ODQgNDM1IDI1Ni42OUM0NDUgMjQ4Ljg5NyA0NTcuMzM0IDI0NSA0NzIgMjQ1QzQ5MC42NjYgMjQ1IDUwNS4zMzQgMjUwLjQ1NSA1MTYgMjYxLjM2NkM1MjYuNjY3IDI3Mi4yNzYgNTMyIDI4Ny4xOTUgNTMyIDMwNi4xMjFWNDEzSDUwMS4zMzNWMzEzLjgwNEM1MDEuMzMzIDMwMC44ODkgNDk4IDI5MC45ODEgNDkxLjMzMyAyODQuMDc4QzQ4NC44ODkgMjc2Ljk1MiA0NzYuMTExIDI3My4zOSA0NjUgMjczLjM5QzQ1Ny4yMjIgMjczLjM5IDQ1MC4zMzMgMjc1LjE3MSA0NDQuMzM0IDI3OC43MzRDNDM4LjU1NiAyODIuMDc0IDQzNCAyODYuOTcyIDQzMC42NjcgMjkzLjQzQzQyNy4zMzMgMjk5Ljg4NyA0MjUuNjY3IDMwNy40NTcgNDI1LjY2NyAzMTYuMTQxVjQxM0gzOTQuNjY3VjMxMy40NjlDMzk0LjY2NyAzMDAuNTU1IDM5MS40NDUgMjkwLjc1OCAzODUgMjg0LjA3OEMzNzguNTU2IDI3Ny4xNzUgMzY5Ljc3OCAyNzMuNzI0IDM1OC42NjcgMjczLjcyNEMzNTAuODg5IDI3My43MjQgMzQ0IDI3NS41MDUgMzM4IDI3OS4wNjhDMzMyLjIyMiAyODIuNDA4IDMyNy42NjcgMjg3LjMwNyAzMjQuMzMzIDI5My43NjNDMzIxIDI5OS45OTggMzE5LjMzMyAzMDcuNDU3IDMxOS4zMzMgMzE2LjE0MVY0MTNaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzExNTlfMzEzIj4KPHJlY3Qgd2lkdGg9IjYxNiIgaGVpZ2h0PSI2MTYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==&logoColor=white" alt="Sim.ai"></a>

### Self-hosted: NPM Package

```bash
npx simstudio
```
→ http://localhost:3000

#### Note
Docker must be installed and running on your machine.

#### Options

| Flag | Description |
|------|-------------|
| `-p, --port <port>` | Port to run Sim on (default `3000`) |
| `--no-pull` | Skip pulling latest Docker images |

### Self-hosted: Docker Compose

```bash
# Clone the repository
git clone https://github.com/simstudioai/sim.git

# Navigate to the project directory
cd sim

# Start Sim
docker compose -f docker-compose.prod.yml up -d
```

Access the application at [http://localhost:3000/](http://localhost:3000/)

#### Using Local Models with Ollama

Run Sim with local AI models using [Ollama](https://ollama.ai) - no external APIs required:

```bash
# Start with GPU support (automatically downloads gemma3:4b model)
docker compose -f docker-compose.ollama.yml --profile setup up -d

# For CPU-only systems:
docker compose -f docker-compose.ollama.yml --profile cpu --profile setup up -d
```

Wait for the model to download, then visit [http://localhost:3000](http://localhost:3000). Add more models with:
```bash
docker compose -f docker-compose.ollama.yml exec ollama ollama pull llama3.1:8b
```

#### Using an External Ollama Instance

If you already have Ollama running on your host machine (outside Docker), you need to configure the `OLLAMA_URL` to use `host.docker.internal` instead of `localhost`:

```bash
# Docker Desktop (macOS/Windows)
OLLAMA_URL=http://host.docker.internal:11434 docker compose -f docker-compose.prod.yml up -d

# Linux (add extra_hosts or use host IP)
docker compose -f docker-compose.prod.yml up -d  # Then set OLLAMA_URL to your host's IP
```

**Why?** When running inside Docker, `localhost` refers to the container itself, not your host machine. `host.docker.internal` is a special DNS name that resolves to the host.

For Linux users, you can either:
- Use your host machine's actual IP address (e.g., `http://192.168.1.100:11434`)
- Add `extra_hosts: ["host.docker.internal:host-gateway"]` to the simstudio service in your compose file

#### Using vLLM

Sim also supports [vLLM](https://docs.vllm.ai/) for self-hosted models with OpenAI-compatible API:

```bash
# Set these environment variables
VLLM_BASE_URL=http://your-vllm-server:8000
VLLM_API_KEY=your_optional_api_key  # Only if your vLLM instance requires auth
```

When running with Docker, use `host.docker.internal` if vLLM is on your host machine (same as Ollama above).

### Self-hosted: Dev Containers

1. Open VS Code with the [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open the project and click "Reopen in Container" when prompted
3. Run `bun run dev:full` in the terminal or use the `sim-start` alias
   - This starts both the main application and the realtime socket server

### Self-hosted: Manual Setup

**Requirements:**
- [Bun](https://bun.sh/) runtime
- [Node.js](https://nodejs.org/) v20+ (required for sandboxed code execution)
- PostgreSQL 12+ with [pgvector extension](https://github.com/pgvector/pgvector) (required for AI embeddings)

**Note:** Sim uses vector embeddings for AI features like knowledge bases and semantic search, which requires the `pgvector` PostgreSQL extension.

1. Clone and install dependencies:

```bash
git clone https://github.com/simstudioai/sim.git
cd sim
bun install
```

2. Set up PostgreSQL with pgvector:

You need PostgreSQL with the `vector` extension for embedding support. Choose one option:

**Option A: Using Docker (Recommended)**
```bash
# Start PostgreSQL with pgvector extension
docker run --name simstudio-db \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=simstudio \
  -p 5432:5432 -d \
  pgvector/pgvector:pg17
```

**Option B: Manual Installation**
- Install PostgreSQL 12+ and the pgvector extension
- See [pgvector installation guide](https://github.com/pgvector/pgvector#installation)

3. Set up environment:

```bash
cd apps/sim
cp .env.example .env  # Configure with required variables (DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL)
```

Update your `.env` file with the database URL:
```bash
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/simstudio"
```

4. Set up the database:

First, configure the database package environment:
```bash
cd packages/db
cp .env.example .env 
```

Update your `packages/db/.env` file with the database URL:
```bash
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/simstudio"
```

Then run the migrations:
```bash
cd apps/sim # Required so drizzle picks correct .env file
bunx drizzle-kit migrate --config=./drizzle.config.ts
```

5. Start the development servers:

**Recommended approach - run both servers together (from project root):**

```bash
bun run dev:full
```

This starts both the main Next.js application and the realtime socket server required for full functionality.

**Alternative - run servers separately:**

Next.js app (from project root):
```bash
bun run dev
```

Realtime socket server (from `apps/sim` directory in a separate terminal):
```bash
cd apps/sim
bun run dev:sockets
```

## Copilot API Keys

Copilot is a Sim-managed service. To use Copilot on a self-hosted instance:

- Go to https://sim.ai → Settings → Copilot and generate a Copilot API key
- Set `COPILOT_API_KEY` environment variable in your self-hosted apps/sim/.env file to that value

## Environment Variables

Key environment variables for self-hosted deployments (see `apps/sim/.env.example` for full list):

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string with pgvector |
| `BETTER_AUTH_SECRET` | Yes | Auth secret (`openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | Yes | Your app URL (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL (same as above) |
| `ENCRYPTION_KEY` | Yes | Encryption key (`openssl rand -hex 32`) |
| `OLLAMA_URL` | No | Ollama server URL (default: `http://localhost:11434`) |
| `VLLM_BASE_URL` | No | vLLM server URL for self-hosted models |
| `COPILOT_API_KEY` | No | API key from sim.ai for Copilot features |

## Troubleshooting

### Ollama models not showing in dropdown (Docker)

If you're running Ollama on your host machine and Sim in Docker, change `OLLAMA_URL` from `localhost` to `host.docker.internal`:

```bash
OLLAMA_URL=http://host.docker.internal:11434 docker compose -f docker-compose.prod.yml up -d
```

See [Using an External Ollama Instance](#using-an-external-ollama-instance) for details.

### Database connection issues

Ensure PostgreSQL has the pgvector extension installed. When using Docker, wait for the database to be healthy before running migrations.

### Port conflicts

If ports 3000, 3002, or 5432 are in use, configure alternatives:

```bash
# Custom ports
NEXT_PUBLIC_APP_URL=http://localhost:3100 POSTGRES_PORT=5433 docker compose up -d
```

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Runtime**: [Bun](https://bun.sh/)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team)
- **Authentication**: [Better Auth](https://better-auth.com)
- **UI**: [Shadcn](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Flow Editor**: [ReactFlow](https://reactflow.dev/)
- **Docs**: [Fumadocs](https://fumadocs.vercel.app/)
- **Monorepo**: [Turborepo](https://turborepo.org/)
- **Realtime**: [Socket.io](https://socket.io/)
- **Background Jobs**: [Trigger.dev](https://trigger.dev/)
- **Remote Code Execution**: [E2B](https://www.e2b.dev/)

## Contributing

We welcome contributions! Please see our [Contributing Guide](.github/CONTRIBUTING.md) for details.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

<p align="center">Made with ❤️ by the Sim Team</p>
```

--------------------------------------------------------------------------------

---[FILE: turbo.json]---
Location: sim-main/turbo.json
Signals: Next.js

```json
{
  "$schema": "https://turbo.build/schema.json",
  "envMode": "loose",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    },
    "start": {
      "cache": false
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "format": {
      "outputs": []
    },
    "format:check": {
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "outputs": []
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: emcn-components.mdc]---
Location: sim-main/.cursor/rules/emcn-components.mdc

```text
---
description: EMCN component library patterns with CVA
globs: ["apps/sim/components/emcn/**"]
---

# EMCN Component Guidelines

## When to Use CVA vs Direct Styles

**Use CVA (class-variance-authority) when:**
- 2+ visual variants (primary, secondary, outline)
- Multiple sizes or state variations
- Example: Button with variants

**Use direct className when:**
- Single consistent style
- No variations needed
- Example: Label with one style

## Patterns

**With CVA:**
```tsx
const buttonVariants = cva('base-classes', {
  variants: { 
    variant: { default: '...', primary: '...' },
    size: { sm: '...', md: '...' }
  }
})
export { Button, buttonVariants }
```

**Without CVA:**
```tsx
function Label({ className, ...props }) {
  return <Primitive className={cn('single-style-classes', className)} {...props} />
}
```

## Rules
- Use Radix UI primitives for accessibility
- Export component and variants (if using CVA)
- TSDoc with usage examples
- Consistent tokens: `font-medium`, `text-[12px]`, `rounded-[4px]`
- Always use `transition-colors` for hover states
```

--------------------------------------------------------------------------------

---[FILE: global.mdc]---
Location: sim-main/.cursor/rules/global.mdc

```text
---
description: Global coding standards that apply to all files
alwaysApply: true
---

# Global Standards

You are a professional software engineer. All code must follow best practices: accurate, readable, clean, and efficient.

## Logging
Use `logger.info`, `logger.warn`, `logger.error` instead of `console.log`.

## Comments
Use TSDoc for documentation. No `====` separators. No non-TSDoc comments.

## Styling
Never update global styles. Keep all styling local to components.

## Package Manager
Use `bun` and `bunx`, not `npm` and `npx`.
```

--------------------------------------------------------------------------------

---[FILE: sim-architecture.mdc]---
Location: sim-main/.cursor/rules/sim-architecture.mdc

```text
---
description: Core architecture principles for the Sim app
globs: ["apps/sim/**"]
---

# Sim App Architecture

## Core Principles
1. **Single Responsibility**: Each component, hook, store has one clear purpose
2. **Composition Over Complexity**: Break down complex logic into smaller pieces
3. **Type Safety First**: TypeScript interfaces for all props, state, return types
4. **Predictable State**: Zustand for global state, useState for UI-only concerns
5. **Performance by Default**: useMemo, useCallback, refs appropriately

## File Organization

```
feature/
├── components/        # Feature components
│   └── sub-feature/   # Sub-feature with own components
├── hooks/             # Custom hooks
└── feature.tsx        # Main component
```

## Naming Conventions
- **Components**: PascalCase (`WorkflowList`, `TriggerPanel`)
- **Hooks**: camelCase with `use` prefix (`useWorkflowOperations`)
- **Files**: kebab-case matching export (`workflow-list.tsx`)
- **Stores**: kebab-case in stores/ (`sidebar/store.ts`)
- **Constants**: SCREAMING_SNAKE_CASE
- **Interfaces**: PascalCase with suffix (`WorkflowListProps`)

## State Management

**useState**: UI-only concerns (dropdown open, hover, form inputs)
**Zustand**: Shared state, persistence, global app state
**useRef**: DOM refs, avoiding dependency issues, mutable non-reactive values

## Component Extraction

**Extract to separate file when:**
- Complex (50+ lines)
- Used across 2+ files
- Has own state/logic

**Keep inline when:**
- Simple (< 10 lines)
- Used in only 1 file
- Purely presentational

**Never import utilities from another component file.** Extract shared helpers to `lib/` or `utils/`.

## Utils Files

**Never create a `utils.ts` file for a single consumer.** Inline the logic directly in the consuming component.

**Create `utils.ts` when:**
- 2+ files import the same helper

**Prefer existing sources of truth:**
- Before duplicating logic, check if a centralized helper already exists (e.g., `lib/logs/get-trigger-options.ts`)
- Import from the source of truth rather than creating wrapper functions

**Location hierarchy:**
- `lib/` — App-wide utilities (auth, billing, core)
- `feature/utils.ts` — Feature-scoped utilities (used by 2+ components in the feature)
- Inline — Single-use helpers (define directly in the component)
```

--------------------------------------------------------------------------------

---[FILE: sim-components.mdc]---
Location: sim-main/.cursor/rules/sim-components.mdc

```text
---
description: Component patterns and structure for React components
globs: ["apps/sim/**/*.tsx"]
---

# Component Patterns

## Structure Order
```typescript
'use client' // Only if using hooks

// 1. Imports (external → internal → relative)
// 2. Constants at module level
const CONFIG = { SPACING: 8 } as const

// 3. Props interface with TSDoc
interface ComponentProps {
  /** Description */
  requiredProp: string
  optionalProp?: boolean
}

// 4. Component with TSDoc
export function Component({ requiredProp, optionalProp = false }: ComponentProps) {
  // a. Refs
  // b. External hooks (useParams, useRouter)
  // c. Store hooks
  // d. Custom hooks
  // e. Local state
  // f. useMemo computations
  // g. useCallback handlers
  // h. useEffect
  // i. Return JSX
}
```

## Rules
1. Add `'use client'` when using React hooks
2. Always define props interface
3. TSDoc on component: description, @param, @returns
4. Extract constants with `as const`
5. Use Tailwind only, no inline styles
6. Semantic HTML (`aside`, `nav`, `article`)
7. Include ARIA attributes where appropriate
8. Optional chain callbacks: `onAction?.(id)`

## Factory Pattern with Caching

When generating components for a specific signature (e.g., icons):

```typescript
const cache = new Map<string, React.ComponentType<{ className?: string }>>()

function getColorIcon(color: string) {
  if (cache.has(color)) return cache.get(color)!
  
  const Icon = ({ className }: { className?: string }) => (
    <div className={cn(className, 'rounded-[3px]')} style={{ backgroundColor: color, width: 10, height: 10 }} />
  )
  Icon.displayName = `ColorIcon(${color})`
  cache.set(color, Icon)
  return Icon
}
```
```

--------------------------------------------------------------------------------

---[FILE: sim-hooks.mdc]---
Location: sim-main/.cursor/rules/sim-hooks.mdc

```text
---
description: Custom hook patterns and best practices
globs: ["apps/sim/**/use-*.ts", "apps/sim/**/hooks/**/*.ts"]
---

# Hook Patterns

## Structure
```typescript
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useFeatureName')

interface UseFeatureProps {
  id: string
  onSuccess?: (result: Result) => void
}

/**
 * Hook description.
 * @param props - Configuration
 * @returns State and operations
 */
export function useFeature({ id, onSuccess }: UseFeatureProps) {
  // 1. Refs for stable dependencies
  const idRef = useRef(id)
  const onSuccessRef = useRef(onSuccess)

  // 2. State
  const [data, setData] = useState<Data | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // 3. Sync refs
  useEffect(() => {
    idRef.current = id
    onSuccessRef.current = onSuccess
  }, [id, onSuccess])

  // 4. Operations with useCallback
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await fetch(`/api/${idRef.current}`).then(r => r.json())
      setData(result)
      onSuccessRef.current?.(result)
    } catch (err) {
      setError(err as Error)
      logger.error('Failed', { error: err })
    } finally {
      setIsLoading(false)
    }
  }, []) // Empty deps - using refs

  // 5. Return grouped by state/operations
  return { data, isLoading, error, fetchData }
}
```

## Rules
1. Single responsibility per hook
2. Props interface required
3. TSDoc required
4. Use logger, not console.log
5. Refs for stable callback dependencies
6. Wrap returned functions in useCallback
7. Always try/catch async operations
8. Track loading/error states
```

--------------------------------------------------------------------------------

---[FILE: sim-imports.mdc]---
Location: sim-main/.cursor/rules/sim-imports.mdc

```text
---
description: Import patterns for the Sim application
globs: ["apps/sim/**/*.ts", "apps/sim/**/*.tsx"]
---

# Import Patterns

## EMCN Components
Import from `@/components/emcn`, never from subpaths like `@/components/emcn/components/modal/modal`.

**Exception**: CSS imports use actual file paths: `import '@/components/emcn/components/code/code.css'`

## Feature Components
Import from central folder indexes, not specific subfolders:
```typescript
// ✅ Correct
import { Dashboard, Sidebar } from '@/app/workspace/[workspaceId]/logs/components'

// ❌ Wrong
import { Dashboard } from '@/app/workspace/[workspaceId]/logs/components/dashboard'
```

## Internal vs External
- **Cross-feature**: Absolute paths through central index
- **Within feature**: Relative paths (`./components/...`, `../utils`)

## Import Order
1. React/core libraries
2. External libraries
3. UI components (`@/components/emcn`, `@/components/ui`)
4. Utilities (`@/lib/...`)
5. Feature imports from indexes
6. Relative imports
7. CSS imports

## Types
Use `type` keyword: `import type { WorkflowLog } from '...'`
```

--------------------------------------------------------------------------------

---[FILE: sim-stores.mdc]---
Location: sim-main/.cursor/rules/sim-stores.mdc

```text
---
description: Zustand store patterns
globs: ["apps/sim/**/store.ts", "apps/sim/**/stores/**/*.ts"]
---

# Zustand Store Patterns

## Structure
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FeatureState {
  // State
  items: Item[]
  activeId: string | null
  
  // Actions
  setItems: (items: Item[]) => void
  addItem: (item: Item) => void
  clearState: () => void
}

const createInitialState = () => ({
  items: [],
  activeId: null,
})

export const useFeatureStore = create<FeatureState>()(
  persist(
    (set) => ({
      ...createInitialState(),

      setItems: (items) => set({ items }),

      addItem: (item) => set((state) => ({
        items: [...state.items, item],
      })),

      clearState: () => set(createInitialState()),
    }),
    {
      name: 'feature-state',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
```

## Rules
1. Interface includes state and actions
2. Extract config to module constants
3. TSDoc on store
4. Only persist what's needed
5. Immutable updates only - never mutate
6. Use `set((state) => ...)` when depending on previous state
7. Provide clear/reset actions
```

--------------------------------------------------------------------------------

---[FILE: sim-styling.mdc]---
Location: sim-main/.cursor/rules/sim-styling.mdc

```text
---
description: Tailwind CSS and styling conventions
globs: ["apps/sim/**/*.tsx", "apps/sim/**/*.css"]
---

# Styling Rules

## Tailwind
1. **No inline styles** - Use Tailwind classes exclusively
2. **No duplicate dark classes** - Don't add `dark:` when value matches light mode
3. **Exact values** - Use design system values (`text-[14px]`, `h-[25px]`)
4. **Prefer px** - Use `px-[4px]` over `px-1`
5. **Transitions** - Add `transition-colors` for interactive states

## Conditional Classes
```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  disabled ? 'opacity-60' : 'hover:bg-accent'
)} />
```

## CSS Variables for Dynamic Styles
```typescript
// In store setter
setSidebarWidth: (width) => {
  set({ sidebarWidth: width })
  document.documentElement.style.setProperty('--sidebar-width', `${width}px`)
}

// In component
<aside style={{ width: 'var(--sidebar-width)' }} />
```

## Anti-Patterns
```typescript
// ❌ Bad
<div style={{ width: 200 }}>
<div className='text-[var(--text-primary)] dark:text-[var(--text-primary)]'>

// ✅ Good
<div className='w-[200px]'>
<div className='text-[var(--text-primary)]'>
```
```

--------------------------------------------------------------------------------

---[FILE: sim-typescript.mdc]---
Location: sim-main/.cursor/rules/sim-typescript.mdc

```text
---
description: TypeScript conventions and type safety
globs: ["apps/sim/**/*.ts", "apps/sim/**/*.tsx"]
---

# TypeScript Rules

1. **No `any`** - Use proper types or `unknown` with type guards
2. **Props interface** - Always define, even for simple components
3. **Callback types** - Full signature with params and return type
4. **Generics** - Use for reusable components/hooks
5. **Const assertions** - `as const` for constant objects/arrays
6. **Ref types** - Explicit: `useRef<HTMLDivElement>(null)`

## Anti-Patterns
```typescript
// ❌ Bad
const handleClick = (e: any) => {}
useEffect(() => { doSomething(prop) }, []) // Missing dep

// ✅ Good  
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {}
useEffect(() => { doSomething(prop) }, [prop])
```
```

--------------------------------------------------------------------------------

---[FILE: devcontainer.json]---
Location: sim-main/.devcontainer/devcontainer.json
Signals: React, Next.js, Docker

```json
{
  "name": "Sim Dev Environment",
  "dockerComposeFile": "docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/workspace",
  "workspaceMount": "source=${localWorkspaceFolder},target=/workspace,type=bind,consistency=cached",

  "customizations": {
    "vscode": {
      "settings": {
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
          "source.fixAll.biome": "explicit",
          "source.organizeImports.biome": "explicit"
        },
        "terminal.integrated.shellIntegration.enabled": true
      },
      "extensions": [
        "biomejs.biome",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-typescript-next",
        "github.copilot",
        "github.copilot-chat",
        "mikestead.dotenv",
        "dsznajder.es7-react-js-snippets",
        "steoates.autoimport",
        "oven.bun-vscode"
      ]
    }
  },

  "forwardPorts": [3000, 3002, 5432],

  "postCreateCommand": "bash -c 'bash .devcontainer/post-create.sh || true'",

  "remoteUser": "bun"
}
```

--------------------------------------------------------------------------------

---[FILE: docker-compose.yml]---
Location: sim-main/.devcontainer/docker-compose.yml
Signals: Docker

```yaml
services:
  app:
    build:
      context: ..
      dockerfile: .devcontainer/Dockerfile
    volumes:
      - ..:/workspace:cached
      - bun-cache:/home/bun/.bun/cache:delegated
    command: sleep infinity
    deploy:
      resources:
        limits:
          memory: 8G
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/simstudio
      - BETTER_AUTH_URL=http://localhost:3000
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-your_auth_secret_here}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY:-your_encryption_key_here}
      - COPILOT_API_KEY=${COPILOT_API_KEY}
      - SIM_AGENT_API_URL=${SIM_AGENT_API_URL}
      - OLLAMA_URL=${OLLAMA_URL:-http://localhost:11434}
      - NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL:-http://localhost:3002}
      - BUN_INSTALL_CACHE_DIR=/home/bun/.bun/cache
    depends_on:
      db:
        condition: service_healthy
      migrations:
        condition: service_completed_successfully
    ports:
      - "3000:3000"
      - "3001:3001"
    working_dir: /workspace

  realtime:
    build:
      context: ..
      dockerfile: .devcontainer/Dockerfile
    volumes:
      - ..:/workspace:cached
      - bun-cache:/home/bun/.bun/cache:delegated
    command: sleep infinity
    deploy:
      resources:
        limits:
          memory: 4G
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/simstudio
      - BETTER_AUTH_URL=http://localhost:3000
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-your_auth_secret_here}
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "3002:3002"
    working_dir: /workspace

  migrations:
    build:
      context: ..
      dockerfile: docker/db.Dockerfile
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/simstudio
    depends_on:
      db:
        condition: service_healthy
    command: ['bun', 'run', 'db:migrate']
    restart: 'no'

  db:
    image: pgvector/pgvector:pg17
    restart: unless-stopped
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=simstudio
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
  bun-cache:
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: sim-main/.devcontainer/Dockerfile

```text
FROM oven/bun:1.3.3-alpine

# Install necessary packages for development
RUN apk add --no-cache \
    git \
    curl \
    wget \
    jq \
    sudo \
    postgresql-client \
    vim \
    nano \
    bash \
    bash-completion \
    zsh \
    zsh-vcs \
    ca-certificates \
    shadow

# Create a non-root user with matching UID/GID
ARG USERNAME=bun
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Create user group if it doesn't exist
RUN if ! getent group $USER_GID >/dev/null; then \
        addgroup -g $USER_GID $USERNAME; \
    fi

# Create user if it doesn't exist
RUN if ! getent passwd $USER_UID >/dev/null; then \
        adduser -D -u $USER_UID -G $(getent group $USER_GID | cut -d: -f1) $USERNAME; \
    fi

# Add sudo support
RUN echo "$USERNAME ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Set up shell environment
RUN echo "export PATH=\$PATH:/home/$USERNAME/.bun/bin" >> /etc/profile

WORKDIR /workspace

# Expose the ports we're interested in
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
```

--------------------------------------------------------------------------------

---[FILE: post-create.sh]---
Location: sim-main/.devcontainer/post-create.sh

```bash
#!/bin/bash

# Exit on error, but with some error handling
set -e

echo "🔧 Setting up Sim development environment..."

# Change to the workspace root directory
cd /workspace

# Install global packages for development (done at runtime, not build time)
echo "📦 Installing global development tools..."
bun install -g turbo drizzle-kit typescript @types/node 2>/dev/null || {
  echo "⚠️ Some global packages may already be installed, continuing..."
}

# Set up bun completions (with proper shell detection)
echo "🔧 Setting up shell completions..."
if [ -n "$SHELL" ] && [ -f "$SHELL" ]; then
  SHELL=/bin/bash bun completions 2>/dev/null | sudo tee /etc/bash_completion.d/bun > /dev/null || {
    echo "⚠️ Could not install bun completions, but continuing..."
  }
fi

# Add project commands to shell profile
echo "📄 Setting up project commands..."
# Add sourcing of sim-commands.sh to user's shell config files if they exist
for rcfile in ~/.bashrc ~/.zshrc; do
  if [ -f "$rcfile" ]; then
    # Check if already added
    if ! grep -q "sim-commands.sh" "$rcfile"; then
      echo "" >> "$rcfile"
      echo "# Sim project commands" >> "$rcfile"
      echo "if [ -f /workspace/.devcontainer/sim-commands.sh ]; then" >> "$rcfile"
      echo "  source /workspace/.devcontainer/sim-commands.sh" >> "$rcfile"
      echo "fi" >> "$rcfile"
    fi
  fi
done

# If no rc files exist yet, create a minimal one
if [ ! -f ~/.bashrc ] && [ ! -f ~/.zshrc ]; then
  echo "# Source Sim project commands" > ~/.bashrc
  echo "if [ -f /workspace/.devcontainer/sim-commands.sh ]; then" >> ~/.bashrc
  echo "  source /workspace/.devcontainer/sim-commands.sh" >> ~/.bashrc
  echo "fi" >> ~/.bashrc
fi

# Clean and reinstall dependencies to ensure platform compatibility
echo "📦 Cleaning and reinstalling dependencies..."
if [ -d "node_modules" ]; then
  echo "Removing existing node_modules to ensure platform compatibility..."
  rm -rf node_modules
  rm -rf apps/sim/node_modules
  rm -rf apps/docs/node_modules
fi

# Ensure Bun cache directory exists and has correct permissions
mkdir -p ~/.bun/cache
chmod 700 ~/.bun ~/.bun/cache

# Install dependencies with platform-specific binaries
echo "Installing dependencies with Bun..."
bun install

# Check for native dependencies
echo "Checking for native dependencies compatibility..."
if grep -q '"trustedDependencies"' apps/sim/package.json 2>/dev/null; then
  echo "⚠️ Native dependencies detected. Bun will handle compatibility during install."
fi

# Set up environment variables if .env doesn't exist for the sim app
if [ ! -f "apps/sim/.env" ]; then
  echo "📄 Creating .env file from template..."
  if [ -f "apps/sim/.env.example" ]; then
    cp apps/sim/.env.example apps/sim/.env
  else
    echo "DATABASE_URL=postgresql://postgres:postgres@db:5432/simstudio" > apps/sim/.env
  fi
fi

# Generate schema and run database migrations
echo "🗃️ Running database schema generation and migrations..."
echo "Generating schema..."
cd apps/sim
bunx drizzle-kit generate
cd ../..

echo "Waiting for database to be ready..."
# Try to connect to the database, but don't fail the script if it doesn't work
(
  timeout=60
  while [ $timeout -gt 0 ]; do
    if PGPASSWORD=postgres psql -h db -U postgres -c '\q' 2>/dev/null; then
      echo "Database is ready!"
      cd apps/sim
      DATABASE_URL=postgresql://postgres:postgres@db:5432/simstudio bunx drizzle-kit push
      cd ../..
      break
    fi
    echo "Database is unavailable - sleeping (${timeout}s remaining)"
    sleep 5
    timeout=$((timeout - 5))
  done
  
  if [ $timeout -le 0 ]; then
    echo "⚠️ Database connection timed out, skipping migrations"
  fi
) || echo "⚠️ Database setup had issues but continuing..."

# Clear the welcome message flag to ensure it shows after setup
unset SIM_WELCOME_SHOWN

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Sim development environment setup complete!"
echo ""
echo "Your environment is now ready. A new terminal session will show"
echo "available commands. You can start the development server with:"
echo ""
echo "  sim-start"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Exit successfully regardless of any previous errors
exit 0
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: sim-main/.devcontainer/README.md

```text
# Sim Development Container

Development container configuration for VS Code Dev Containers and GitHub Codespaces.

## Prerequisites

- Visual Studio Code
- Docker Desktop or Podman Desktop
- VS Code Dev Containers extension

## Getting Started

1. Open this project in VS Code
2. Click "Reopen in Container" when prompted (or press `F1` → "Dev Containers: Reopen in Container")
3. Wait for the container to build and initialize
4. Start developing with `sim-start`

The setup script will automatically install dependencies and run migrations.

## Development Commands

### Running Services

You have two options for running the development environment:

**Option 1: Run everything together (recommended for most development)**
```bash
sim-start  # Runs both app and socket server using concurrently
```

**Option 2: Run services separately (useful for debugging individual services)**
- In the **app** container terminal: `sim-app` (starts Next.js app on port 3000)
- In the **realtime** container terminal: `sim-sockets` (starts socket server on port 3002)

### Other Commands

- `sim-migrate` - Push schema changes to the database
- `sim-generate` - Generate new migrations
- `build` - Build the application
- `pgc` - Connect to PostgreSQL database

## Troubleshooting

**Build errors**: Rebuild the container with `F1` → "Dev Containers: Rebuild Container"

**Port conflicts**: Ensure ports 3000, 3002, and 5432 are available

**Container runtime issues**: Verify Docker Desktop or Podman Desktop is running

## Technical Details

Services:
- **App container** (8GB memory limit) - Main Next.js application
- **Realtime container** (4GB memory limit) - Socket.io server for real-time features
- **Database** - PostgreSQL with pgvector extension
- **Migrations** - Runs automatically on container creation

You can develop with services running together or independently.

### Personalization

**Project commands** (`sim-start`, `sim-app`, etc.) are automatically available via `/workspace/.devcontainer/sim-commands.sh`.

**Personal shell customization** (aliases, prompts, etc.) should use VS Code's dotfiles feature:
1. Create a dotfiles repository (e.g., `github.com/youruser/dotfiles`)
2. Add your `.bashrc`, `.zshrc`, or other configs
3. Configure in VS Code Settings:
   ```json
   {
     "dotfiles.repository": "youruser/dotfiles",
     "dotfiles.installCommand": "install.sh"
   }
   ```

This separates project-specific commands from personal preferences, following VS Code best practices.
```

--------------------------------------------------------------------------------

````
