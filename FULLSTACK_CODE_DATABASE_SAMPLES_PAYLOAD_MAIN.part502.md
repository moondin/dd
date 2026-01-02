---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 502
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 502 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: Media.ts]---
Location: payload-main/templates/_template/src/collections/Media.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
```

--------------------------------------------------------------------------------

---[FILE: Users.ts]---
Location: payload-main/templates/_template/src/collections/Users.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: frontend.e2e.spec.ts]---
Location: payload-main/templates/_template/tests/e2e/frontend.e2e.spec.ts

```typescript
import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Payload Blank Template/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('Welcome to your new project.')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: api.int.spec.ts]---
Location: payload-main/templates/_template/tests/int/api.int.spec.ts

```typescript
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/test/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
**/payload-types.ts
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/test/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": "inline",
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: buildConfigWithDefaults.ts]---
Location: payload-main/test/buildConfigWithDefaults.ts

```typescript
import type { Config, SanitizedConfig } from 'payload'

import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  ChecklistFeature,
  HeadingFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  TreeViewFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
// import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload'
import { de } from 'payload/i18n/de'
import { en } from 'payload/i18n/en'
import { es } from 'payload/i18n/es'
import sharp from 'sharp'

import { databaseAdapter } from './databaseAdapter.js'
import { reInitEndpoint } from './helpers/reInitEndpoint.js'
import { localAPIEndpoint } from './helpers/sdk/endpoint.js'
import { testEmailAdapter } from './testEmailAdapter.js'

// process.env.POSTGRES_URL = 'postgres://postgres:postgres@127.0.0.1:5432/payloadtests'
// process.env.PAYLOAD_DATABASE = 'postgres'
// process.env.PAYLOAD_DATABASE = 'sqlite'

export async function buildConfigWithDefaults(
  testConfig?: Partial<Config>,
  options?: {
    disableAutoLogin?: boolean
  },
): Promise<SanitizedConfig> {
  const config: Config = {
    db: databaseAdapter,
    editor: lexicalEditor({
      features: [
        ParagraphFeature(),
        RelationshipFeature(),
        LinkFeature({
          fields: ({ defaultFields }) => [
            ...defaultFields,
            {
              name: 'description',
              type: 'text',
            },
          ],
        }),
        ChecklistFeature(),
        UnorderedListFeature(),
        OrderedListFeature(),
        AlignFeature(),
        BlockquoteFeature(),
        BoldFeature(),
        ItalicFeature(),
        UploadFeature({
          collections: {
            media: {
              fields: [
                {
                  name: 'alt',
                  type: 'text',
                },
              ],
            },
          },
        }),
        UnderlineFeature(),
        StrikethroughFeature(),
        SubscriptFeature(),
        SuperscriptFeature(),
        InlineCodeFeature(),
        InlineToolbarFeature(),
        TreeViewFeature(),
        HeadingFeature(),
        IndentFeature(),
        BlocksFeature({
          blocks: [
            {
              slug: 'myBlock',
              fields: [
                {
                  name: 'someText',
                  type: 'text',
                },
                {
                  name: 'someTextRequired',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'radios',
                  type: 'radio',
                  options: [
                    {
                      label: 'Option 1',
                      value: 'option1',
                    },
                    {
                      label: 'Option 2',
                      value: 'option2',
                    },
                    {
                      label: 'Option 3',
                      value: 'option3',
                    },
                  ],
                  validate: (value) => {
                    return value !== 'option2' ? true : 'Cannot be option2'
                  },
                },
              ],
            },
          ],
        }),
      ],
    }),
    email: testEmailAdapter,
    secret: 'TEST_SECRET',
    sharp,
    telemetry: false,
    ...testConfig,
    endpoints: [localAPIEndpoint, reInitEndpoint, ...(testConfig?.endpoints || [])],
    i18n: {
      supportedLanguages: {
        de,
        en,
        es,
        ...(testConfig?.i18n?.supportedLanguages || {}),
      },
      ...(testConfig?.i18n || {}),
    },
    typescript: {
      declare: {
        ignoreTSError: true,
        ...(testConfig?.typescript?.declare || {}),
      },
      ...testConfig?.typescript,
    },
  }

  if (!config.admin) {
    config.admin = {}
  }

  if (config.admin.autoLogin === undefined) {
    config.admin.autoLogin =
      process.env.PAYLOAD_PUBLIC_DISABLE_AUTO_LOGIN === 'true' || options?.disableAutoLogin
        ? false
        : {
            email: 'dev@payloadcms.com',
          }
  }

  if (process.env.PAYLOAD_DISABLE_ADMIN === 'true') {
    if (typeof config.admin !== 'object') {
      config.admin = {}
    }
    config.admin.disable = true
  }

  return await buildConfig(config)
}
```

--------------------------------------------------------------------------------

---[FILE: credentials.ts]---
Location: payload-main/test/credentials.ts

```typescript
export const devUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
  roles: ['admin'],
}
export const regularUser = {
  email: 'user@payloadcms.com',
  password: 'test2',
  roles: ['user'],
}
```

--------------------------------------------------------------------------------

---[FILE: CustomDashboard.tsx]---
Location: payload-main/test/CustomDashboard.tsx
Signals: React

```typescript
'use client'

import React from 'react'

export const CustomDashboard: React.FC = () => {
  return <h1>hello</h1>
}
```

--------------------------------------------------------------------------------

---[FILE: dev.ts]---
Location: payload-main/test/dev.ts
Signals: Next.js

```typescript
import nextEnvImport from '@next/env'
import chalk from 'chalk'
import { createServer } from 'http'
import minimist from 'minimist'
import nextImport from 'next'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import open from 'open'
import { loadEnv } from 'payload/node'
import { parse } from 'url'

import { getNextRootDir } from './helpers/getNextRootDir.js'
import startMemoryDB from './helpers/startMemoryDB.js'
import { runInit } from './runInit.js'
import { child } from './safelyRunScript.js'
import { createTestHooks } from './testHooks.js'

// @todo remove in 4.0 - will behave like this by default in 4.0
process.env.PAYLOAD_DO_NOT_SANITIZE_LOCALIZED_PROPERTY = 'true'

const prod = process.argv.includes('--prod')
if (prod) {
  process.argv = process.argv.filter((arg) => arg !== '--prod')
  process.env.PAYLOAD_TEST_PROD = 'true'
}

const shouldStartMemoryDB =
  process.argv.includes('--start-memory-db') || process.env.START_MEMORY_DB === 'true'
if (shouldStartMemoryDB) {
  process.argv = process.argv.filter((arg) => arg !== '--start-memory-db')
  process.env.START_MEMORY_DB = 'true'
}

loadEnv()

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const {
  _: [_testSuiteArg = '_community'],
  ...args
} = minimist(process.argv.slice(2))

let testSuiteArg: string | undefined
let testSuiteConfigOverride: string | undefined
if (_testSuiteArg.includes('#')) {
  ;[testSuiteArg, testSuiteConfigOverride] = _testSuiteArg.split('#')
} else {
  testSuiteArg = _testSuiteArg
}

if (!testSuiteArg || !fs.existsSync(path.resolve(dirname, testSuiteArg))) {
  console.log(chalk.red(`ERROR: The test folder "${testSuiteArg}" does not exist`))
  process.exit(0)
}

// Enable turbopack by default, unless --no-turbo is passed
const enableTurbo = args.turbo !== false

console.log(`Selected test suite: ${testSuiteArg}${enableTurbo ? ' [Turbopack]' : ' [Webpack]'}`)

if (enableTurbo) {
  process.env.TURBOPACK = '1'
}

const { beforeTest } = await createTestHooks(testSuiteArg, testSuiteConfigOverride)
await beforeTest()

const { rootDir, adminRoute } = getNextRootDir(testSuiteArg)

await runInit(testSuiteArg, true)

if (shouldStartMemoryDB) {
  await startMemoryDB()
}

// This is needed to forward the environment variables to the next process that were created after loadEnv()
// for example process.env.MONGODB_MEMORY_SERVER_URI otherwise app.prepare() will clear them
nextEnvImport.updateInitialEnv(process.env)

// Open the admin if the -o flag is passed
if (args.o) {
  await open(`http://localhost:3000${adminRoute}`)
}

const findOpenPort = (startPort: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.listen(startPort, () => {
      console.log(`✓ Running on port ${startPort}`)
      server.close(() => resolve(startPort))
    })
    server.on('error', () => {
      console.log(`⚠ Port ${startPort} is in use, trying ${startPort + 1} instead.`)
      findOpenPort(startPort + 1)
        .then(resolve)
        .catch(reject)
    })
  })
}

const port = process.env.PORT ? Number(process.env.PORT) : 3000

const availablePort = await findOpenPort(port)

// Assign the available port to process.env.PORT so that the next and our HMR server uses it
// @ts-expect-error - PORT is a string from somewhere
process.env.PORT = availablePort

// @ts-expect-error the same as in test/helpers/initPayloadE2E.ts
const app = nextImport({
  dev: true,
  hostname: 'localhost',
  port: availablePort,
  dir: rootDir,
  turbo: enableTurbo,
  turbopack: enableTurbo,
})

const handle = app.getRequestHandler()

let resolveServer: () => void

const serverPromise = new Promise<void>((res) => (resolveServer = res))

void app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url || '', true)
    await handle(req, res, parsedUrl)
  }).listen(availablePort, () => {
    resolveServer()
  })
})

await serverPromise
process.env.PAYLOAD_DROP_DATABASE = process.env.PAYLOAD_DROP_DATABASE === 'false' ? 'false' : 'true'

// fetch the admin url to force a render
void fetch(`http://localhost:${availablePort}${adminRoute}`)
void fetch(`http://localhost:${availablePort}/api/access`)
// This ensures that the next-server process is killed when this process is killed and doesn't linger around.
process.on('SIGINT', () => {
  if (child) {
    child.kill('SIGINT')
  }
  process.exit(0)
})
process.on('SIGTERM', () => {
  if (child) {
    child.kill('SIGINT')
  }
  process.exit(0) // Exit the parent process
})
```

--------------------------------------------------------------------------------

---[FILE: docker-compose.yml]---
Location: payload-main/test/docker-compose.yml
Signals: Docker

```yaml
version: '3.2'
services:
  localstack:
    image: localstack/localstack:latest
    container_name: localstack_demo
    ports:
      - '4563-4599:4563-4599'
      - '8055:8080'
    environment:
      - SERVICES=s3
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
    volumes:
      - './.localstack:/var/lib/localstack'
      - '/var/run/docker.sock:/var/run/docker.sock'

  azure-storage:
    image: mcr.microsoft.com/azure-storage/azurite:latest
    platform: linux/amd64
    restart: always
    command: 'azurite --loose --blobHost 0.0.0.0 --tableHost 0.0.0.0 --queueHost 0.0.0.0'
    ports:
      - '10000:10000'
      - '10001:10001'
      - '10002:10002'
    volumes:
      - ./azurestoragedata:/data"

  google-cloud-storage:
    image: fsouza/fake-gcs-server
    restart: always
    command:
      [
        '-scheme',
        'http',
        '-port',
        '4443',
        '-public-host',
        'http://localhost:4443',
        '-external-url',
        'http://localhost:4443',
        '-backend',
        'memory',
      ]
    ports:
      - '4443:4443'
    volumes:
      - ./google-cloud-storage/payload-bucket:/data/payload-bucket

volumes:
  google-cloud-storage:
  azurestoragedata:
```

--------------------------------------------------------------------------------

---[FILE: eslint.config.js]---
Location: payload-main/test/eslint.config.js

```javascript
import { defaultESLintIgnores, rootEslintConfig, rootParserOptions } from '../eslint.config.js'
import payloadPlugin from '@payloadcms/eslint-plugin'
import playwright from 'eslint-plugin-playwright'

/** @typedef {import('eslint').Linter.Config} Config */

/** @type {Config[]} */
export const testEslintConfig = [
  ...rootEslintConfig,
  {
    ignores: [...defaultESLintIgnores, '**/payload-types.ts', 'jest.setup.js'],
  },
  {
    rules: {
      'payload/no-relative-monorepo-imports': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'payload/no-jsx-import-statements': 'warn',
      'payload/no-relative-monorepo-imports': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      // turn the @typescript-eslint/unbound-method rule off *only* for test files. See https://typescript-eslint.io/rules/unbound-method/#when-not-to-use-it
      '@typescript-eslint/unbound-method': 'off',
      'no-console': 'off',
      'perfectionist/sort-objects': 'off',
    },
  },
  {
    files: ['**/*.config.ts', '**/config.ts'],
    rules: {
      'no-restricted-exports': 'off',
    },
  },
  {
    files: ['**/*.int.spec.ts', '**/int.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'jest/prefer-strict-equal': 'off',
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['**/*.e2e.spec.ts', '**/e2e.spec.ts', 'helpers.ts'],
  },
  {
    files: ['**/*.e2e.spec.ts', '**/e2e.spec.ts', 'helpers.ts'],
    rules: {
      'payload/no-relative-monorepo-imports': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'jest/consistent-test-it': 'off',
      'jest/expect-expect': 'off',
      'jest/no-test-callback': 'off',
      'jest/prefer-strict-equal': 'off',
      'jest/require-top-level-describe': 'off',
      'jest-dom/prefer-to-have-attribute': 'off',
      'playwright/prefer-web-first-assertions': 'error',
      'payload/no-flaky-assertions': 'warn',
      'payload/no-wait-function': 'warn',
      // Enable the no-non-retryable-assertions rule ONLY for hunting for flakes
      // 'payload/no-non-retryable-assertions': 'error',
      'playwright/expect-expect': [
        'error',
        {
          assertFunctionNames: [
            'assertToastErrors',
            'saveDocAndAssert',
            'runFilterOptionsTest',
            'assertNetworkRequests',
            'assertRequestBody',
            'expectNoResultsAndCreateFolderButton',
            'createFolder',
            'createFolderFromDoc',
            'assertURLParams',
            'uploadImage',
            'getRowByCellValueAndAssert',
          ],
        },
      ],
    },
  },
  {
    files: ['*.e2e.ts'],
    rules: {
      'payload/no-relative-monorepo-imports': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'jest/expect-expect': 'off',
    },
  },
]

export default testEslintConfig
```

--------------------------------------------------------------------------------

---[FILE: generateDatabaseAdapter.ts]---
Location: payload-main/test/generateDatabaseAdapter.ts

```typescript
import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const mongooseAdapterArgs = `
    ensureIndexes: true,
    // required for connect to detect that we are using a memory server
    mongoMemoryServer:  global._mongoMemoryServer,
    url:
      process.env.MONGODB_MEMORY_SERVER_URI ||
      process.env.DATABASE_URI ||
      'mongodb://127.0.0.1/payloadtests',
`

export const allDatabaseAdapters = {
  mongodb: `
  import { mongooseAdapter } from '@payloadcms/db-mongodb'

  export const databaseAdapter = mongooseAdapter({
    ${mongooseAdapterArgs}
  })`,
  cosmosdb: `
  import { mongooseAdapter, compatibilityOptions } from '@payloadcms/db-mongodb'

  export const databaseAdapter = mongooseAdapter({
    ...compatibilityOptions.cosmosdb,
    ${mongooseAdapterArgs}
  })`,
  documentdb: `
  import { mongooseAdapter, compatibilityOptions } from '@payloadcms/db-mongodb'

  export const databaseAdapter = mongooseAdapter({
    ...compatibilityOptions.documentdb,
    ${mongooseAdapterArgs}
  })`,
  firestore: `
  import { mongooseAdapter, compatibilityOptions } from '@payloadcms/db-mongodb'

  export const databaseAdapter = mongooseAdapter({
    ...compatibilityOptions.firestore,
    ${mongooseAdapterArgs}
    // The following options prevent some tests from failing.
    // More work needed to get tests succeeding without these options.
    ensureIndexes: true,
    disableIndexHints: false,
    useAlternativeDropDatabase: false,
  })`,
  postgres: `
  import { postgresAdapter } from '@payloadcms/db-postgres'

  export const databaseAdapter = postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || 'postgres://127.0.0.1:5432/payloadtests',
    },
  })`,
  'postgres-custom-schema': `
  import { postgresAdapter } from '@payloadcms/db-postgres'

  export const databaseAdapter = postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || 'postgres://127.0.0.1:5432/payloadtests',
    },
    schemaName: 'custom',
  })`,
  'postgres-uuid': `
    import { postgresAdapter } from '@payloadcms/db-postgres'

  export const databaseAdapter = postgresAdapter({
    idType: 'uuid',
    pool: {
      connectionString: process.env.POSTGRES_URL || 'postgres://127.0.0.1:5432/payloadtests',
    },
  })`,
  'postgres-read-replica': `
  import { postgresAdapter } from '@payloadcms/db-postgres'

  export const databaseAdapter = postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL,
    },
    readReplicas: [process.env.POSTGRES_REPLICA_URL],
  })
  `,
  'vercel-postgres-read-replica': `
  import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'

  export const databaseAdapter = vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL,
    },
    readReplicas: [process.env.POSTGRES_REPLICA_URL],
  })
  `,
  sqlite: `
  import { sqliteAdapter } from '@payloadcms/db-sqlite'

  export const databaseAdapter = sqliteAdapter({
    client: {
      url: process.env.SQLITE_URL || 'file:./payloadtests.db',
    },
    autoIncrement: true
  })`,
  'sqlite-uuid': `
  import { sqliteAdapter } from '@payloadcms/db-sqlite'

  export const databaseAdapter = sqliteAdapter({
    idType: 'uuid',
    client: {
      url: process.env.SQLITE_URL || 'file:./payloadtests.db',
    },
  })`,
  supabase: `
  import { postgresAdapter } from '@payloadcms/db-postgres'

  export const databaseAdapter = postgresAdapter({
    pool: {
      connectionString:
        process.env.POSTGRES_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
    },
  })`,
  d1: `
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'

export const databaseAdapter = sqliteD1Adapter({ binding: global.d1 })
  `,
}

/**
 * Write to databaseAdapter.ts
 */
export function generateDatabaseAdapter(dbAdapter) {
  const databaseAdapter = allDatabaseAdapters[dbAdapter]
  if (!databaseAdapter) {
    throw new Error(`Unknown database adapter: ${dbAdapter}`)
  }
  fs.writeFileSync(
    path.resolve(dirname, 'databaseAdapter.js'),
    `
  // DO NOT MODIFY. This file is automatically generated by the test suite.

  ${databaseAdapter}
  `,
  )

  console.log('Wrote', dbAdapter, 'db adapter')
  return databaseAdapter
}
```

--------------------------------------------------------------------------------

---[FILE: generateDatabaseSchema.ts]---
Location: payload-main/test/generateDatabaseSchema.ts

```typescript
import path from 'path'
import { getPayload, type SanitizedConfig } from 'payload'
import { fileURLToPath } from 'url'

import { generateDatabaseAdapter } from './generateDatabaseAdapter.js'
import { setTestEnvPaths } from './helpers/setTestEnvPaths.js'

const [testConfigDir] = process.argv.slice(2)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const writeDBAdapter = process.env.WRITE_DB_ADAPTER !== 'false'
process.env.PAYLOAD_DROP_DATABASE = process.env.PAYLOAD_DROP_DATABASE || 'true'

if (process.env.PAYLOAD_DATABASE === 'mongodb' || process.env.PAYLOAD_DATABASE === 'firestore') {
  throw new Error('Not supported')
}

if (writeDBAdapter) {
  generateDatabaseAdapter(process.env.PAYLOAD_DATABASE || 'postgres')
  process.env.WRITE_DB_ADAPTER = 'false'
}

const loadConfig = async (configPath: string): Promise<SanitizedConfig> => {
  return await (
    await import(configPath)
  ).default
}

if (!testConfigDir) {
  throw new Error('Yo must Specify testConfigDir')
}

const testDir = path.resolve(dirname, testConfigDir)
const config = await loadConfig(path.resolve(testDir, 'config.ts'))

setTestEnvPaths(testDir)

const payload = await getPayload({ config })

// await payload.db.dropDatabase({ adapter: payload.db })

await payload.db.generateSchema({
  outputFile: path.resolve(testDir, 'payload-generated-schema.ts'),
})

process.exit(0)
```

--------------------------------------------------------------------------------

---[FILE: generateGraphQLSchema.ts]---
Location: payload-main/test/generateGraphQLSchema.ts

```typescript
import type { SanitizedConfig } from 'payload'

import { generateSchema } from '@payloadcms/graphql/utilities'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { setTestEnvPaths } from './helpers/setTestEnvPaths.js'

const [testConfigDir] = process.argv.slice(2)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const loadConfig = async (configPath: string): Promise<SanitizedConfig> => {
  return await (
    await import(configPath)
  ).default
}

let testDir: string
if (testConfigDir) {
  testDir = path.resolve(dirname, testConfigDir)
  const config = await loadConfig(path.resolve(testDir, 'config.ts'))

  setTestEnvPaths(testDir)
  generateSchema(config)
} else {
  // Generate graphql schema for entire directory
  testDir = dirname

  const config = await loadConfig(path.resolve(testDir, 'config.ts'))

  fs.readdirSync(dirname, { withFileTypes: true })
    .filter((f) => f.isDirectory())
    .forEach((dir) => {
      const suiteDir = path.resolve(testDir, dir.name)
      const configFound = setTestEnvPaths(suiteDir)
      if (configFound) generateSchema(config)
    })
}
```

--------------------------------------------------------------------------------

---[FILE: generateImportMap.ts]---
Location: payload-main/test/generateImportMap.ts

```typescript
import path from 'path'

const [testConfigDir] = process.argv.slice(2)

import type { SanitizedConfig } from 'payload'

import fs from 'fs'
import { generateImportMap } from 'payload'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

let testDir: string

async function run() {
  if (testConfigDir) {
    testDir = path.resolve(dirname, testConfigDir)

    const pathWithConfig = path.resolve(testDir, 'config.ts')
    console.log('Generating ad-hoc import map for config:', pathWithConfig)

    const config: SanitizedConfig = await (await import(pathWithConfig)).default

    let rootDir = ''

    if (
      testConfigDir === 'live-preview' ||
      testConfigDir === 'admin-root' ||
      testConfigDir === 'admin-bar'
    ) {
      rootDir = testDir

      if (process.env.PAYLOAD_TEST_PROD === 'true') {
        // If in prod mode, there may be a testSuite/prod folder. If so, use that as the rootDir
        const prodDir = path.resolve(testDir, 'prod')
        try {
          fs.accessSync(prodDir, fs.constants.F_OK)
          rootDir = prodDir
        } catch (err) {
          // Swallow err - no prod folder
        }
      }
    } else {
      rootDir = path.resolve(dirname, '..')
    }

    process.env.ROOT_DIR = rootDir
    await generateImportMap(config, { log: true, force: true })
  }
}

await run()
```

--------------------------------------------------------------------------------

---[FILE: generateTypes.ts]---
Location: payload-main/test/generateTypes.ts

```typescript
import fs from 'fs'
import { spawn } from 'node:child_process'
import path from 'path'
import { generateTypes } from 'payload/node'

import { setTestEnvPaths } from './helpers/setTestEnvPaths.js'

const [testConfigDir] = process.argv.slice(2)

import type { SanitizedConfig } from 'payload'

import { fileURLToPath } from 'url'

import { generateDatabaseAdapter } from './generateDatabaseAdapter.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

let testDir: string

const writeDBAdapter = process.env.WRITE_DB_ADAPTER !== 'false'
async function run() {
  if (writeDBAdapter) {
    generateDatabaseAdapter(process.env.PAYLOAD_DATABASE || 'mongodb')
    process.env.WRITE_DB_ADAPTER = 'false'
  }

  if (testConfigDir) {
    testDir = path.resolve(dirname, testConfigDir)

    const pathWithConfig = path.resolve(testDir, 'config.ts')
    console.log('Generating types for config:', pathWithConfig)

    const config: SanitizedConfig = await (await import(pathWithConfig)).default

    setTestEnvPaths(testDir)
    await generateTypes(config)
  } else {
    // Search through every folder in dirname, and if it has a config.ts file, generate types for it
    const foundDirs: string[] = []

    fs.readdirSync(dirname, { withFileTypes: true })
      .filter((f) => f.isDirectory())
      .forEach((dir) => {
        const suiteDir = path.resolve(dirname, dir.name)
        const configFound = fs.existsSync(path.resolve(suiteDir, 'config.ts'))
        if (configFound) {
          foundDirs.push(dir.name)
        }
      })

    let i = 0
    for (const suiteDir of foundDirs) {
      i++
      const pathWithConfig = path.resolve(suiteDir, 'config.ts')

      console.log(`Generating types for config ${i} / ${foundDirs.length}:`, pathWithConfig)

      // start a new node process which runs test/generateTypes with pathWithConfig as argument. Can't run it in this process, as there could otherwise be
      // breakage between tests, as node can cache things in between runs.
      // Make sure to wait until the process is done before starting the next one.
      const child = spawn('node', [
        '--no-deprecation',
        '--import',
        '@swc-node/register/esm-register',
        'test/generateTypes.ts',
        suiteDir,
      ])

      child.stdout.setEncoding('utf8')
      child.stdout.on('data', function (data) {
        console.log(suiteDir + ' stdout: ' + data)
      })

      child.stderr.setEncoding('utf8')
      child.stderr.on('data', function (data) {
        console.log(suiteDir + ' stderr: ' + data)
      })

      child.on('close', function (code) {
        console.log(suiteDir + ' closing code: ' + code)
      })
    }
  }
}

void run()
```

--------------------------------------------------------------------------------

````
