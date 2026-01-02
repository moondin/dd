---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 804
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 804 of 933)

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
Location: sim-main/packages/cli/README.md

```text
# Sim CLI

Sim CLI allows you to run [Sim](https://sim.ai) using Docker with a single command.

## Installation

To install the Sim CLI globally, use:

```bash
npm install -g simstudio
```

## Usage

To start Sim, simply run:

```bash
simstudio
```

### Options

- `-p, --port <port>`: Specify the port to run Sim on (default: 3000).
- `--no-pull`: Skip pulling the latest Docker images.

## Requirements

- Docker must be installed and running on your machine.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the Apache-2.0 License.
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: sim-main/packages/cli/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/packages/cli/src/index.ts

```typescript
#!/usr/bin/env node

import { execSync, spawn } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import { createInterface } from 'readline'
import chalk from 'chalk'
import { Command } from 'commander'

const NETWORK_NAME = 'simstudio-network'
const DB_CONTAINER = 'simstudio-db'
const MIGRATIONS_CONTAINER = 'simstudio-migrations'
const REALTIME_CONTAINER = 'simstudio-realtime'
const APP_CONTAINER = 'simstudio-app'
const DEFAULT_PORT = '3000'

const program = new Command()

program.name('simstudio').description('Run Sim using Docker').version('0.1.0')

program
  .option('-p, --port <port>', 'Port to run Sim on', DEFAULT_PORT)
  .option('-y, --yes', 'Skip interactive prompts and use defaults')
  .option('--no-pull', 'Skip pulling the latest Docker images')

function isDockerRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    const docker = spawn('docker', ['info'])

    docker.on('close', (code) => {
      resolve(code === 0)
    })
  })
}

async function runCommand(command: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    const process = spawn(command[0], command.slice(1), { stdio: 'inherit' })
    process.on('error', () => {
      resolve(false)
    })
    process.on('close', (code) => {
      resolve(code === 0)
    })
  })
}

async function ensureNetworkExists(): Promise<boolean> {
  try {
    const networks = execSync('docker network ls --format "{{.Name}}"').toString()
    if (!networks.includes(NETWORK_NAME)) {
      console.log(chalk.blue(`🔄 Creating Docker network '${NETWORK_NAME}'...`))
      return await runCommand(['docker', 'network', 'create', NETWORK_NAME])
    }
    return true
  } catch (error) {
    console.error('Failed to check networks:', error)
    return false
  }
}

async function pullImage(image: string): Promise<boolean> {
  console.log(chalk.blue(`🔄 Pulling image ${image}...`))
  return await runCommand(['docker', 'pull', image])
}

async function stopAndRemoveContainer(name: string): Promise<void> {
  try {
    execSync(`docker stop ${name} 2>/dev/null || true`)
    execSync(`docker rm ${name} 2>/dev/null || true`)
  } catch (_error) {
    // Ignore errors, container might not exist
  }
}

async function cleanupExistingContainers(): Promise<void> {
  console.log(chalk.blue('🧹 Cleaning up any existing containers...'))
  await stopAndRemoveContainer(APP_CONTAINER)
  await stopAndRemoveContainer(DB_CONTAINER)
  await stopAndRemoveContainer(MIGRATIONS_CONTAINER)
  await stopAndRemoveContainer(REALTIME_CONTAINER)
}

async function main() {
  const options = program.parse().opts()

  console.log(chalk.blue('🚀 Starting Sim...'))

  // Check if Docker is installed and running
  const dockerRunning = await isDockerRunning()
  if (!dockerRunning) {
    console.error(
      chalk.red('❌ Docker is not running or not installed. Please start Docker and try again.')
    )
    process.exit(1)
  }

  // Use port from options, with 3000 as default
  const port = options.port

  // Pull latest images if not skipped
  if (options.pull) {
    await pullImage('ghcr.io/simstudioai/simstudio:latest')
    await pullImage('ghcr.io/simstudioai/migrations:latest')
    await pullImage('ghcr.io/simstudioai/realtime:latest')
    await pullImage('pgvector/pgvector:pg17')
  }

  // Ensure Docker network exists
  if (!(await ensureNetworkExists())) {
    console.error(chalk.red('❌ Failed to create Docker network'))
    process.exit(1)
  }

  // Clean up any existing containers
  await cleanupExistingContainers()

  // Create data directory
  const dataDir = join(homedir(), '.simstudio', 'data')
  if (!existsSync(dataDir)) {
    try {
      mkdirSync(dataDir, { recursive: true })
    } catch (_error) {
      console.error(chalk.red(`❌ Failed to create data directory: ${dataDir}`))
      process.exit(1)
    }
  }

  // Start PostgreSQL container
  console.log(chalk.blue('🔄 Starting PostgreSQL database...'))
  const dbSuccess = await runCommand([
    'docker',
    'run',
    '-d',
    '--name',
    DB_CONTAINER,
    '--network',
    NETWORK_NAME,
    '-e',
    'POSTGRES_USER=postgres',
    '-e',
    'POSTGRES_PASSWORD=postgres',
    '-e',
    'POSTGRES_DB=simstudio',
    '-v',
    `${dataDir}/postgres:/var/lib/postgresql/data`,
    '-p',
    '5432:5432',
    'pgvector/pgvector:pg17',
  ])

  if (!dbSuccess) {
    console.error(chalk.red('❌ Failed to start PostgreSQL'))
    process.exit(1)
  }

  // Wait for PostgreSQL to be ready
  console.log(chalk.blue('⏳ Waiting for PostgreSQL to be ready...'))
  let pgReady = false
  for (let i = 0; i < 30; i++) {
    try {
      execSync(`docker exec ${DB_CONTAINER} pg_isready -U postgres`)
      pgReady = true
      break
    } catch (_error) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  if (!pgReady) {
    console.error(chalk.red('❌ PostgreSQL failed to become ready'))
    process.exit(1)
  }

  // Run migrations
  console.log(chalk.blue('🔄 Running database migrations...'))
  const migrationsSuccess = await runCommand([
    'docker',
    'run',
    '--rm',
    '--name',
    MIGRATIONS_CONTAINER,
    '--network',
    NETWORK_NAME,
    '-e',
    `DATABASE_URL=postgresql://postgres:postgres@${DB_CONTAINER}:5432/simstudio`,
    'ghcr.io/simstudioai/migrations:latest',
    'bun',
    'run',
    'db:migrate',
  ])

  if (!migrationsSuccess) {
    console.error(chalk.red('❌ Failed to run migrations'))
    process.exit(1)
  }

  // Start the realtime server
  console.log(chalk.blue('🔄 Starting Realtime Server...'))
  const realtimeSuccess = await runCommand([
    'docker',
    'run',
    '-d',
    '--name',
    REALTIME_CONTAINER,
    '--network',
    NETWORK_NAME,
    '-p',
    '3002:3002',
    '-e',
    `DATABASE_URL=postgresql://postgres:postgres@${DB_CONTAINER}:5432/simstudio`,
    '-e',
    `BETTER_AUTH_URL=http://localhost:${port}`,
    '-e',
    `NEXT_PUBLIC_APP_URL=http://localhost:${port}`,
    '-e',
    'BETTER_AUTH_SECRET=your_auth_secret_here',
    'ghcr.io/simstudioai/realtime:latest',
  ])

  if (!realtimeSuccess) {
    console.error(chalk.red('❌ Failed to start Realtime Server'))
    process.exit(1)
  }

  // Start the main application
  console.log(chalk.blue('🔄 Starting Sim...'))
  const appSuccess = await runCommand([
    'docker',
    'run',
    '-d',
    '--name',
    APP_CONTAINER,
    '--network',
    NETWORK_NAME,
    '-p',
    `${port}:3000`,
    '-e',
    `DATABASE_URL=postgresql://postgres:postgres@${DB_CONTAINER}:5432/simstudio`,
    '-e',
    `BETTER_AUTH_URL=http://localhost:${port}`,
    '-e',
    `NEXT_PUBLIC_APP_URL=http://localhost:${port}`,
    '-e',
    'BETTER_AUTH_SECRET=your_auth_secret_here',
    '-e',
    'ENCRYPTION_KEY=your_encryption_key_here',
    'ghcr.io/simstudioai/simstudio:latest',
  ])

  if (!appSuccess) {
    console.error(chalk.red('❌ Failed to start Sim'))
    process.exit(1)
  }

  console.log(chalk.green(`✅ Sim is now running at ${chalk.bold(`http://localhost:${port}`)}`))
  console.log(
    chalk.yellow(
      `🛑 To stop all containers, run: ${chalk.bold('docker stop simstudio-app simstudio-db simstudio-realtime')}`
    )
  )

  // Handle Ctrl+C
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.on('SIGINT', async () => {
    console.log(chalk.yellow('\n🛑 Stopping Sim...'))

    // Stop containers
    await stopAndRemoveContainer(APP_CONTAINER)
    await stopAndRemoveContainer(DB_CONTAINER)
    await stopAndRemoveContainer(REALTIME_CONTAINER)

    console.log(chalk.green('✅ Sim has been stopped'))
    process.exit(0)
  })
}

main().catch((error) => {
  console.error(chalk.red('❌ An error occurred:'), error)
  process.exit(1)
})
```

--------------------------------------------------------------------------------

---[FILE: .env.example]---
Location: sim-main/packages/db/.env.example

```text
# Database URL (Required for migrations and database operations)
DATABASE_URL="postgresql://postgres:password@localhost:5432/simstudio"
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/packages/db/constants.ts

```typescript
/**
 * Database-only constants used in schema definitions and migrations.
 * These constants are independent of application logic to keep migrations container lightweight.
 */

/**
 * Default free credits (in dollars) for new users
 */
export const DEFAULT_FREE_CREDITS = 10

/**
 * Storage limit constants (in GB)
 * Can be overridden via environment variables
 */
export const DEFAULT_FREE_STORAGE_LIMIT_GB = 5
export const DEFAULT_PRO_STORAGE_LIMIT_GB = 50
export const DEFAULT_TEAM_STORAGE_LIMIT_GB = 500
export const DEFAULT_ENTERPRISE_STORAGE_LIMIT_GB = 500

/**
 * Tag slots available for knowledge base documents and embeddings
 */
export const TAG_SLOTS = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7'] as const

/**
 * Type for tag slot names
 */
export type TagSlot = (typeof TAG_SLOTS)[number]
```

--------------------------------------------------------------------------------

---[FILE: drizzle.config.ts]---
Location: sim-main/packages/db/drizzle.config.ts

```typescript
import type { Config } from 'drizzle-kit'

export default {
  schema: './schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/packages/db/index.ts

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export * from './schema'

const connectionString = process.env.DATABASE_URL!
if (!connectionString) {
  throw new Error('Missing DATABASE_URL environment variable')
}

const postgresClient = postgres(connectionString, {
  prepare: false,
  idle_timeout: 20,
  connect_timeout: 30,
  max: 30,
  onnotice: () => {},
})

export const db = drizzle(postgresClient, { schema })
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: sim-main/packages/db/package.json

```json
{
  "name": "@sim/db",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "license": "Apache-2.0",
  "engines": {
    "bun": ">=1.2.13",
    "node": ">=20.0.0"
  },
  "exports": {
    ".": {
      "types": "./index.ts",
      "default": "./index.ts"
    },
    "./schema": {
      "types": "./schema.ts",
      "default": "./schema.ts"
    }
  },
  "scripts": {
    "db:push": "bunx drizzle-kit push --config=./drizzle.config.ts",
    "db:migrate": "bunx drizzle-kit migrate --config=./drizzle.config.ts",
    "db:studio": "bunx drizzle-kit studio --config=./drizzle.config.ts",
    "type-check": "tsc --noEmit"
  },
  "peerDependencies": {
    "drizzle-orm": "^0.44.5",
    "postgres": "^3.4.5"
  },
  "devDependencies": {
    "typescript": "^5.7.3"
  },
  "overrides": {
    "drizzle-orm": "^0.44.5",
    "postgres": "^3.4.5"
  }
}
```

--------------------------------------------------------------------------------

````
