---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 540
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 540 of 695)

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

---[FILE: int.spec.ts]---
Location: payload-main/test/create-payload-app/int.spec.ts

```typescript
/* eslint-disable jest/no-conditional-in-test */
import type { CompilerOptions } from 'typescript'

import * as CommentJson from 'comment-json'
import { initNext } from 'create-payload-app/commands'
import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import shelljs from 'shelljs'
import tempy from 'tempy'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const commonNextCreateParams =
  '--typescript --eslint --no-tailwind --app --import-alias="@/*" --turbo --yes'

const commandKeys = ['srcDir', 'noSrcDir', 'srcDirCanary', 'noSrcDirCanary'] as const
type NextCmdKey = (typeof commandKeys)[number]

const nextCreateCommands: Record<NextCmdKey, string> = {
  srcDir: `pnpm create next-app@latest . ${commonNextCreateParams} --src-dir`,
  noSrcDir: `pnpm create next-app@latest . ${commonNextCreateParams} --no-src-dir`,
  srcDirCanary: `pnpm create next-app@canary . ${commonNextCreateParams} --src-dir`,
  noSrcDirCanary: `pnpm create next-app@latest . ${commonNextCreateParams} --no-src-dir`,
}

describe('create-payload-app', () => {
  beforeAll(() => {
    // Runs copyfiles copy app/(payload) -> dist/app/(payload)
    shelljs.exec('pnpm build:create-payload-app')
  })

  describe.each(commandKeys)(`--init-next with %s`, (nextCmdKey) => {
    const projectDir = tempy.directory()
    beforeEach(async () => {
      if (fs.existsSync(projectDir)) {
        fs.rmSync(projectDir, { recursive: true })
      }

      // Create dir for Next.js project
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir)
      }

      // Create a new Next.js project with default options
      console.log(`Running: ${nextCreateCommands[nextCmdKey]} in ${projectDir}`)
      const [cmd, ...args] = nextCreateCommands[nextCmdKey].split(' ')
      console.log(`Running: ${cmd} ${args.join(' ')}`)
      const { exitCode, stderr } = await execa(cmd as string, [...args], {
        cwd: projectDir,
        stdio: 'inherit',
      })
      if (exitCode !== 0) {
        console.error({ exitCode, stderr })
      }

      // WARNING: Big WTF here. Replace improper path string inside tsconfig.json.
      // For some reason two double quotes are used for the src path when executed in the test environment.
      // This is likely ESM-related
      const tsConfigPath = path.resolve(projectDir, 'tsconfig.json')
      let userTsConfigContent = await readFile(tsConfigPath, { encoding: 'utf8' })
      userTsConfigContent = userTsConfigContent.replace('""@/*""', '"@/*"')
      await writeFile(tsConfigPath, userTsConfigContent, { encoding: 'utf8' })
    })

    afterEach(() => {
      if (fs.existsSync(projectDir)) {
        fs.rmSync(projectDir, { recursive: true })
      }
    })

    it('should install payload app in Next.js project', async () => {
      expect(fs.existsSync(projectDir)).toBe(true)

      const firstResult = await initNext({
        '--debug': true,
        dbType: 'mongodb',
        packageManager: 'pnpm',
        projectDir,
        useDistFiles: true, // create-payload-app/dist/template
      })

      // Will fail because we detect top-level layout.tsx file
      expect(firstResult.success).toEqual(false)

      // Move all files from app to top-level directory named `(app)`
      if (firstResult.success === false && firstResult.nextAppDir) {
        const nextAppDir = firstResult.nextAppDir
        fs.mkdirSync(path.resolve(nextAppDir, '(app)'))
        fs.readdirSync(path.resolve(nextAppDir)).forEach((file) => {
          if (file === '(app)') {
            return
          }
          fs.renameSync(path.resolve(nextAppDir, file), path.resolve(nextAppDir, '(app)', file))
        })
      }

      // Rerun after moving files
      const result = await initNext({
        '--debug': true,
        dbType: 'mongodb',
        packageManager: 'pnpm',
        projectDir,
        useDistFiles: true, // create-payload-app/dist/app/(payload)
      })

      assertAndExpectToBeTrue(result.success) // Narrowing for TS
      expect(result.nextAppDir).toEqual(
        path.resolve(projectDir, result.isSrcDir ? 'src/app' : 'app'),
      )

      const payloadFilesPath = path.resolve(result.nextAppDir, '(payload)')
      // shelljs.exec(`tree ${projectDir}`)
      expect(fs.existsSync(payloadFilesPath)).toBe(true)

      const payloadConfig = path.resolve(
        projectDir,
        result.isSrcDir ? 'src/payload.config.ts' : 'payload.config.ts',
      )
      expect(fs.existsSync(payloadConfig)).toBe(true)

      const tsConfigPath = path.resolve(projectDir, 'tsconfig.json')
      const userTsConfigContent = await readFile(tsConfigPath, { encoding: 'utf8' })
      const userTsConfig = CommentJson.parse(userTsConfigContent) as {
        compilerOptions?: CompilerOptions
      }

      // Check that `@payload-config` path is added to tsconfig
      expect(userTsConfig.compilerOptions?.paths?.['@payload-config']).toStrictEqual([
        `./${result.isSrcDir ? 'src/' : ''}payload.config.ts`,
      ])

      // Payload dependencies should be installed
      const packageJson = fse.readJsonSync(path.resolve(projectDir, 'package.json')) as {
        dependencies: Record<string, string>
      }
      expect(packageJson.dependencies).toMatchObject({
        '@payloadcms/db-mongodb': expect.any(String),
        '@payloadcms/next': expect.any(String),
        '@payloadcms/richtext-lexical': expect.any(String),
        payload: expect.any(String),
      })
    })

    it('should install payload app with postgres adapter', async () => {
      expect(fs.existsSync(projectDir)).toBe(true)

      const firstResult = await initNext({
        '--debug': true,
        dbType: 'postgres',
        packageManager: 'pnpm',
        projectDir,
        useDistFiles: true,
      })

      expect(firstResult.success).toEqual(false)

      // Move files to (app) directory
      if (firstResult.success === false && firstResult.nextAppDir) {
        const nextAppDir = firstResult.nextAppDir
        fs.mkdirSync(path.resolve(nextAppDir, '(app)'))
        fs.readdirSync(path.resolve(nextAppDir)).forEach((file) => {
          if (file === '(app)') {
            return
          }
          fs.renameSync(path.resolve(nextAppDir, file), path.resolve(nextAppDir, '(app)', file))
        })
      }

      // Rerun with postgres
      const result = await initNext({
        '--debug': true,
        dbType: 'postgres',
        packageManager: 'pnpm',
        projectDir,
        useDistFiles: true,
      })

      assertAndExpectToBeTrue(result.success)

      // Configure payload config to use postgres (mimics main.ts flow)
      const { configurePayloadConfig: configureFromLib } = await import(
        '../../packages/create-payload-app/src/lib/configure-payload-config.js'
      )
      await configureFromLib({
        dbType: 'postgres',
        projectDirOrConfigPath: {
          payloadConfigPath: result.payloadConfigPath,
        },
      })

      const payloadConfig = path.resolve(
        projectDir,
        result.isSrcDir ? 'src/payload.config.ts' : 'payload.config.ts',
      )
      const configContent = fs.readFileSync(payloadConfig, 'utf-8')
      expect(configContent).toContain('postgresAdapter')
      expect(configContent).toContain('@payloadcms/db-postgres')

      // Postgres dependencies should be installed
      const packageJson = fse.readJsonSync(path.resolve(projectDir, 'package.json')) as {
        dependencies: Record<string, string>
      }
      expect(packageJson.dependencies).toMatchObject({
        '@payloadcms/db-postgres': expect.any(String),
        '@payloadcms/next': expect.any(String),
        '@payloadcms/richtext-lexical': expect.any(String),
        payload: expect.any(String),
      })
      expect(packageJson.dependencies['@payloadcms/db-mongodb']).toBeUndefined()
    })
  })

  describe('adapter replacement', () => {
    const projectDir = tempy.directory()

    beforeEach(async () => {
      if (fs.existsSync(projectDir)) {
        fs.rmSync(projectDir, { recursive: true })
      }

      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir)
      }

      // Create Next.js project
      console.log(`Creating test project in ${projectDir}`)
      const [cmd, ...args] = nextCreateCommands.srcDir.split(' ')
      const { exitCode, stderr } = await execa(cmd as string, [...args], {
        cwd: projectDir,
        stdio: 'inherit',
      })
      if (exitCode !== 0) {
        console.error({ exitCode, stderr })
      }

      // Fix tsconfig.json path issue
      const tsConfigPath = path.resolve(projectDir, 'tsconfig.json')
      let userTsConfigContent = await readFile(tsConfigPath, { encoding: 'utf8' })
      userTsConfigContent = userTsConfigContent.replace('""@/*""', '"@/*"')
      await writeFile(tsConfigPath, userTsConfigContent, { encoding: 'utf8' })
    })

    afterEach(() => {
      if (fs.existsSync(projectDir)) {
        fs.rmSync(projectDir, { recursive: true })
      }
    })

    it('should replace mongodb with postgres adapter', async () => {
      // First install with mongodb
      const firstResult = await initNext({
        '--debug': true,
        dbType: 'mongodb',
        packageManager: 'pnpm',
        projectDir,
        useDistFiles: true,
      })

      expect(firstResult.success).toEqual(false)

      // Move files to (app)
      if (firstResult.success === false && firstResult.nextAppDir) {
        const nextAppDir = firstResult.nextAppDir
        fs.mkdirSync(path.resolve(nextAppDir, '(app)'))
        fs.readdirSync(path.resolve(nextAppDir)).forEach((file) => {
          if (file === '(app)') {
            return
          }
          fs.renameSync(path.resolve(nextAppDir, file), path.resolve(nextAppDir, '(app)', file))
        })
      }

      // Install with mongodb
      const mongoResult = await initNext({
        '--debug': true,
        dbType: 'mongodb',
        packageManager: 'pnpm',
        projectDir,
        useDistFiles: true,
      })

      assertAndExpectToBeTrue(mongoResult.success)

      // Verify mongodb is installed
      const packageJson = fse.readJsonSync(path.resolve(projectDir, 'package.json')) as {
        dependencies: Record<string, string>
      }
      expect(packageJson.dependencies['@payloadcms/db-mongodb']).toBeDefined()

      // Now replace with postgres using AST (simulates manual adapter replacement)
      const { configurePayloadConfig } = await import(
        '../../packages/create-payload-app/src/lib/ast/payload-config.js'
      )
      const payloadConfig = path.resolve(
        projectDir,
        mongoResult.isSrcDir ? 'src/payload.config.ts' : 'payload.config.ts',
      )

      const replaceResult = await configurePayloadConfig(payloadConfig, {
        db: { type: 'postgres', envVarName: 'DATABASE_URL' },
      })

      expect(replaceResult.success).toBe(true)

      // Verify config file was updated
      const configContent = fs.readFileSync(payloadConfig, 'utf-8')
      expect(configContent).toContain('postgresAdapter')
      expect(configContent).toContain('@payloadcms/db-postgres')
      expect(configContent).not.toContain('mongooseAdapter')
      expect(configContent).not.toContain('@payloadcms/db-mongodb')
    })
  })
})

// Expect and assert that actual is true for type narrowing
function assertAndExpectToBeTrue(actual: unknown): asserts actual is true {
  expect(actual).toBe(true)
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/create-payload-app/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/create-payload-app/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: minimal.ts]---
Location: payload-main/test/create-payload-app/fixtures/payload-configs/minimal.ts

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'

export default buildConfig({
  collections: [],
  db: mongooseAdapter({ url: process.env.DATABASE_URI || '' }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
})
```

--------------------------------------------------------------------------------

---[FILE: multiple-buildconfig.ts]---
Location: payload-main/test/create-payload-app/fixtures/payload-configs/multiple-buildconfig.ts

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'

// This is a helper config (not the main one)
const helperConfig = buildConfig({
  collections: [],
})

export default buildConfig({
  collections: [],
  db: mongooseAdapter({ url: process.env.DATABASE_URI || '' }),
})
```

--------------------------------------------------------------------------------

---[FILE: postgres-adapter.ts]---
Location: payload-main/test/create-payload-app/fixtures/payload-configs/postgres-adapter.ts

```typescript
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'

export default buildConfig({
  collections: [],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  editor: lexicalEditor(),
})
```

--------------------------------------------------------------------------------

---[FILE: with-alias.ts]---
Location: payload-main/test/create-payload-app/fixtures/payload-configs/with-alias.ts

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig as createConfig } from 'payload'

export default createConfig({
  collections: [],
  db: mongooseAdapter({ url: process.env.DATABASE_URI || '' }),
})
```

--------------------------------------------------------------------------------

---[FILE: with-other-imports.ts]---
Location: payload-main/test/create-payload-app/fixtures/payload-configs/with-other-imports.ts

```typescript
import type { CollectionConfig } from 'payload'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  fields: [],
}

export default buildConfig({
  collections: [Users],
  db: mongooseAdapter({ url: process.env.DATABASE_URI || '' }),
  editor: lexicalEditor(),
})
```

--------------------------------------------------------------------------------

---[FILE: with-storage.ts]---
Location: payload-main/test/create-payload-app/fixtures/payload-configs/with-storage.ts

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'

export default buildConfig({
  collections: [],
  db: mongooseAdapter({ url: process.env.DATABASE_URI || '' }),
  plugins: [
    s3Storage({
      bucket: process.env.S3_BUCKET || '',
      collections: {
        media: true,
      },
      config: {
        region: process.env.S3_REGION || '',
      },
    }),
  ],
})
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/custom-graphql/config.ts

```typescript
import { GraphQLJSON } from '@payloadcms/graphql/types'
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { commitTransaction, initTransaction, killTransaction } from 'payload'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'

const resolveTransactionId = async (_obj, _args, context) => {
  try {
    const shouldCommit = await initTransaction(context.req)
    const transactionID = context.req.transactionID
    if (shouldCommit) {
      await commitTransaction(context.req)
    }
    return transactionID ? String(transactionID) : null
  } catch (e) {
    await killTransaction(context.req)
    throw e
  }
}

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [],
  globals: [],
  graphQL: {
    mutations: (GraphQL) => {
      return {
        MutateTransactionID1: {
          type: GraphQL.GraphQLString,
          resolve: resolveTransactionId,
        },
        MutateTransactionID2: {
          type: GraphQL.GraphQLString,
          resolve: resolveTransactionId,
        },
      }
    },
    queries: (GraphQL) => {
      return {
        TransactionID1: {
          type: GraphQL.GraphQLString,
          resolve: resolveTransactionId,
        },
        TransactionID2: {
          type: GraphQL.GraphQLString,
          resolve: resolveTransactionId,
        },
        foo: {
          type: GraphQLJSON,
          args: {},
          resolve: () => 'json test',
        },
      }
    },
  },
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/custom-graphql/int.spec.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import type { NextRESTClient } from '../helpers/NextRESTClient.js'

import { initPayloadInt } from '../helpers/initPayloadInt.js'

let restClient: NextRESTClient
let payload: Payload

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Custom GraphQL', () => {
  beforeAll(async () => {
    ;({ payload, restClient } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    await payload.destroy()
  })

  if (
    !['cosmosdb', 'firestore', 'sqlite', 'sqlite-uuid'].includes(process.env.PAYLOAD_DATABASE || '')
  ) {
    describe('Isolated Transaction ID', () => {
      it('should isolate transaction IDs between queries in the same request', async () => {
        const query = `query {
          TransactionID1
          TransactionID2
      }`
        const { data } = await restClient
          .GRAPHQL_POST({
            body: JSON.stringify({ query }),
          })
          .then((res) => res.json())
        // either no transactions at all or they are different
        expect(
          (data.TransactionID2 === null && data.TransactionID1 === null) ||
            data.TransactionID2 !== data.TransactionID1,
        ).toBe(true)
      })
      it('should isolate transaction IDs between mutations in the same request', async () => {
        const query = `mutation {
          MutateTransactionID1
          MutateTransactionID2
      }`
        const { data } = await restClient
          .GRAPHQL_POST({
            body: JSON.stringify({ query }),
          })
          .then((res) => res.json())
        // either no transactions at all or they are different
        expect(
          (data.MutateTransactionID2 === null && data.MutateTransactionID1 === null) ||
            data.MutateTransactionID2 !== data.MutateTransactionID1,
        ).toBe(true)
      })
    })
  } else {
    it('should not run isolated transaction ID tests for sqlite/firestore/cosmosdb', () => {
      expect(true).toBe(true)
    })
  }
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/custom-graphql/payload-types.ts

```typescript
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?: {
    relationTo: 'users';
    value: string | User;
  } | null;
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  // @ts-ignore 
  export interface GeneratedTypes extends Config {}
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/custom-graphql/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/custom-graphql/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/database/.gitignore

```text
/migrations
*.generated-schema.ts
```

--------------------------------------------------------------------------------

---[FILE: config.postgreslogs.ts]---
Location: payload-main/test/database/config.postgreslogs.ts

```typescript
/* eslint-disable no-restricted-exports */
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { getConfig } from './getConfig.js'

const config = getConfig()

import { postgresAdapter } from '@payloadcms/db-postgres'

export const databaseAdapter = postgresAdapter({
  pool: {
    connectionString: process.env.POSTGRES_URL || 'postgres://127.0.0.1:5432/payloadtests',
  },
  logger: true,
})

export default buildConfigWithDefaults({
  ...config,
  db: databaseAdapter,
})
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/database/config.ts

```typescript
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { getConfig } from './getConfig.js'

export default buildConfigWithDefaults(getConfig())
```

--------------------------------------------------------------------------------

````
