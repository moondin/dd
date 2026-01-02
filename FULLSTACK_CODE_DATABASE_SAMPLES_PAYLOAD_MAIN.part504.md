---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 504
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 504 of 695)

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

---[FILE: safelyRunScript.ts]---
Location: payload-main/test/safelyRunScript.ts

```typescript
import { spawn } from 'child_process'
import path from 'path'

export let child

/**
 * Sometimes, running certain functions in certain scripts from the command line will cause the script to be terminated
 * with a "Detected unsettled top-level await" error. This often happens if that function imports the payload config.
 * It seems to be a bug in Node.js and I do not know how to properly fix it. As a workaround, this script automatically re-runs
 * the script if said function is not resolved within a certain time frame, and prevents the "Detected unsettled top-level await" error.
 */
export async function safelyRunScriptFunction(
  functionToRun: any,
  timeout: number = 4000,
  ...args: any[]
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      restartProcess(`runInit timed out after ${timeout / 1000} seconds`)
    }, timeout)

    functionToRun(...args)
      .then(() => {
        clearTimeout(timeoutId)
        resolve()
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        restartProcess(`runInit failed: ${error.message}`)
      })
  })
}

function restartProcess(reason: string) {
  console.warn(`Restarting process: ${reason}`)

  // Get the path to the current script
  const scriptPath = process.argv[1]
  const absoluteScriptPath = path.resolve(scriptPath)

  // Spawn a new process
  child = spawn('tsx', [absoluteScriptPath, ...process.argv.slice(2)], {
    stdio: 'inherit',
    // detached: true,
  })

  // Setup signal handlers to ensure child process exits correctly
  process.on('SIGINT', () => {
    child.kill('SIGINT') // Forward SIGINT to child process
    process.exit(0) // Exit the parent process
  })
  process.on('SIGTERM', () => {
    child.kill('SIGTERM') // Forward SIGTERM to child process
    process.exit(0) // Exit the parent process
  })
}
```

--------------------------------------------------------------------------------

---[FILE: setupProd.ts]---
Location: payload-main/test/setupProd.ts

```typescript
import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const tgzToPkgNameMap = {
  payload: 'payload-*',
  '@payloadcms/admin-bar': 'payloadcms-admin-bar-*',
  '@payloadcms/db-mongodb': 'payloadcms-db-mongodb-*',
  '@payloadcms/db-postgres': 'payloadcms-db-postgres-*',
  '@payloadcms/db-vercel-postgres': 'payloadcms-db-vercel-postgres-*',
  '@payloadcms/db-sqlite': 'payloadcms-db-sqlite-*',
  '@payloadcms/db-d1-sqlite': 'payloadcms-db-d1-sqlite-*',
  '@payloadcms/drizzle': 'payloadcms-drizzle-*',
  '@payloadcms/email-nodemailer': 'payloadcms-email-nodemailer-*',
  '@payloadcms/email-resend': 'payloadcms-email-resend-*',
  '@payloadcms/eslint-config': 'payloadcms-eslint-config-*',
  '@payloadcms/eslint-plugin': 'payloadcms-eslint-plugin-*',
  '@payloadcms/graphql': 'payloadcms-graphql-*',
  '@payloadcms/live-preview': 'payloadcms-live-preview-*',
  '@payloadcms/live-preview-react': 'payloadcms-live-preview-react-*',
  '@payloadcms/kv-redis': 'payloadcms-kv-redis-*',
  '@payloadcms/next': 'payloadcms-next-*',
  '@payloadcms/payload-cloud': 'payloadcms-payload-cloud-*',
  '@payloadcms/plugin-cloud-storage': 'payloadcms-plugin-cloud-storage-*',
  '@payloadcms/plugin-form-builder': 'payloadcms-plugin-form-builder-*',
  '@payloadcms/plugin-ecommerce': 'payloadcms-plugin-ecommerce-*',
  '@payloadcms/plugin-import-export': 'payloadcms-plugin-import-export-*',
  '@payloadcms/plugin-mcp': 'payloadcms-plugin-mcp-*',
  '@payloadcms/plugin-multi-tenant': 'payloadcms-plugin-multi-tenant-*',
  '@payloadcms/plugin-nested-docs': 'payloadcms-plugin-nested-docs-*',
  '@payloadcms/plugin-redirects': 'payloadcms-plugin-redirects-*',
  '@payloadcms/plugin-search': 'payloadcms-plugin-search-*',
  '@payloadcms/plugin-sentry': 'payloadcms-plugin-sentry-*',
  '@payloadcms/plugin-seo': 'payloadcms-plugin-seo-*',
  '@payloadcms/plugin-stripe': 'payloadcms-plugin-stripe-*',
  '@payloadcms/richtext-lexical': 'payloadcms-richtext-lexical-*',
  '@payloadcms/richtext-slate': 'payloadcms-richtext-slate-*',
  '@payloadcms/sdk': 'payloadcms-sdk-*',
  '@payloadcms/storage-azure': 'payloadcms-storage-azure-*',
  '@payloadcms/storage-gcs': 'payloadcms-storage-gcs-*',
  '@payloadcms/storage-r2': 'payloadcms-storage-r2-*',
  '@payloadcms/storage-s3': 'payloadcms-storage-s3-*',
  '@payloadcms/storage-uploadthing': 'payloadcms-storage-uploadthing-*',
  '@payloadcms/storage-vercel-blob': 'payloadcms-storage-vercel-blob-*',
  '@payloadcms/translations': 'payloadcms-translations-*',
  '@payloadcms/ui': 'payloadcms-ui-*',
  'create-payload-app': 'create-payload-app-*',
}

function findActualTgzName(pattern: string) {
  const packedDir = path.resolve(dirname, 'packed')
  const files = fs.readdirSync(packedDir)
  const matchingFile = files.find((file) => file.startsWith(pattern.replace('*', '')))
  return matchingFile ? `file:packed/${matchingFile}` : null
}

/**
 * This does the following:
 * - installs all packages from test/packed to test/package.json
 */
export function setupProd() {
  const packageJsonString = fs.readFileSync(path.resolve(dirname, 'package.json'), 'utf8')
  const packageJson = JSON.parse(packageJsonString)

  const allDependencies = {}
  // Go through all the dependencies and devDependencies, replace the normal package entry with the tgz entry
  for (const key of ['dependencies', 'devDependencies']) {
    const dependencies = packageJson[key]
    if (dependencies) {
      for (const [packageName, _packageVersion] of Object.entries(dependencies)) {
        if (tgzToPkgNameMap[packageName]) {
          const actualTgzPath = findActualTgzName(tgzToPkgNameMap[packageName])
          if (actualTgzPath) {
            dependencies[packageName] = actualTgzPath
            allDependencies[packageName] = actualTgzPath
          } else {
            console.warn(`Warning: No matching tgz found for ${packageName}`)
          }
        }
      }
    }
  }

  // now add them all to overrides and pnpm.overrides as well
  packageJson.pnpm = packageJson.pnpm || {}
  packageJson.pnpm.overrides = packageJson.pnpm.overrides || {}
  packageJson.overrides = packageJson.overrides || {}
  for (const [packageName, packageVersion] of Object.entries(allDependencies)) {
    packageJson.pnpm.overrides[packageName] = packageVersion
    packageJson.overrides[packageName] = packageVersion
  }

  // write it out
  fs.writeFileSync(path.resolve(dirname, 'package.json'), JSON.stringify(packageJson, null, 2))
}

setupProd()
```

--------------------------------------------------------------------------------

---[FILE: test.env]---
Location: payload-main/test/test.env

```bash
NODE_OPTIONS="--no-deprecation --no-experimental-strip-types"
```

--------------------------------------------------------------------------------

---[FILE: testEmailAdapter.ts]---
Location: payload-main/test/testEmailAdapter.ts

```typescript
import type { EmailAdapter, SendEmailOptions } from 'payload'

/**
 * Logs all emails to stdout
 */
export const testEmailAdapter: EmailAdapter<void> = ({ payload }) => ({
  name: 'test-email-adapter',
  defaultFromAddress: 'dev@payloadcms.com',
  defaultFromName: 'Payload Test',
  sendEmail: async (message) => {
    const stringifiedTo = getStringifiedToAddress(message)
    const res = `Test email to: '${stringifiedTo}', Subject: '${message.subject}'`
    payload.logger.info({ msg: res, content: message })
    return Promise.resolve()
  },
})

export function getStringifiedToAddress(message: SendEmailOptions): string | undefined {
  let stringifiedTo: string | undefined

  if (typeof message.to === 'string') {
    stringifiedTo = message.to
  } else if (Array.isArray(message.to)) {
    stringifiedTo = message.to
      .map((to) => {
        if (typeof to === 'string') {
          return to
        } else if (to.address) {
          return to.address
        }
        return ''
      })
      .join(', ')
  } else if (message.to.address) {
    stringifiedTo = message.to.address
  }
  return stringifiedTo
}
```

--------------------------------------------------------------------------------

---[FILE: testHooks.ts]---
Location: payload-main/test/testHooks.ts

```typescript
import { parse, stringify } from 'comment-json'
import { existsSync, promises } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { getNextRootDir } from './helpers/getNextRootDir.js'

const { readFile, writeFile, rm } = promises
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const createTestHooks = async (
  testSuiteName = '_community',
  testSuiteConfig = 'config.ts',
) => {
  const rootDir = getNextRootDir().rootDir
  const tsConfigBasePath = path.resolve(rootDir, './tsconfig.base.json')
  const tsConfigPath = existsSync(tsConfigBasePath)
    ? tsConfigBasePath
    : path.resolve(rootDir, './tsconfig.json')

  const tsConfigContent = await readFile(tsConfigPath, 'utf8')
  const tsConfig = parse(tsConfigContent)

  return {
    /**
     * Clear next webpack cache and set '@payload-config' path in tsconfig.json
     */
    beforeTest: async () => {
      // Delete entire .next cache folder
      const nextCache = path.resolve(rootDir, './.next')
      if (existsSync(nextCache)) {
        await rm(nextCache, { recursive: true })
      }

      // Set '@payload-config' in tsconfig.json

      // @ts-expect-error
      tsConfig.compilerOptions.paths['@payload-config'] = [
        process.env.PAYLOAD_TEST_PROD === 'true'
          ? `./${testSuiteName}/${testSuiteConfig}`
          : `./test/${testSuiteName}/${testSuiteConfig}`,
      ]
      await writeFile(tsConfigPath, stringify(tsConfig, null, 2) + '\n')

      process.env.PAYLOAD_CONFIG_PATH = path.resolve(dirname, testSuiteName, testSuiteConfig)
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/tsconfig.eslint.json

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
Location: payload-main/test/tsconfig.json
Signals: Next.js

```json
{
  "compilerOptions": {
    /* Strictness */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    "noEmit": true,
    "rootDir": ".",
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowJs": true,
    "checkJs": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "preserve",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "types": ["jest", "node", "@types/jest"],
    "incremental": true,
    "isolatedModules": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@payload-config": ["./_community/config.ts"]
    }
  },
  "exclude": [
    "dist",
    "build",
    "node_modules",
    "eslint.config.js",
    "dist/**/*.js",
    "**/dist/**/*.js"
  ],
  "include": ["./**/*.ts", "./**/*.tsx", "next-env.d.ts", ".next/types/**/*.ts", "setup.js"],
  "references": []
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.typecheck.json]---
Location: payload-main/test/tsconfig.typecheck.json
Signals: React, Next.js

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "incremental": false
  },
  "exclude": ["dist", "build", "temp", "node_modules"],
  "include": [
    // "./test/_community/**/*.ts"
    // "./_community/**/*.ts"
    "/**/*.ts"
    // "../packages/**/src/**/*.ts",
    // "../packages/**/src/**/*.tsx"
  ],
  "references": [
    {
      "path": "../packages/admin-bar"
    },
    {
      "path": "../packages/create-payload-app"
    },
    {
      "path": "../packages/db-mongodb"
    },
    {
      "path": "../packages/db-postgres"
    },
    {
      "path": "../packages/graphql"
    },
    {
      "path": "../packages/live-preview"
    },
    {
      "path": "../packages/live-preview-react"
    },
    {
      "path": "../packages/next"
    },
    {
      "path": "../packages/payload"
    },
    {
      "path": "../packages/plugin-cloud-storage"
    },
    {
      "path": "../packages/payload-cloud"
    },
    {
      "path": "../packages/plugin-form-builder"
    },
    {
      "path": "../packages/plugin-nested-docs"
    },
    {
      "path": "../packages/plugin-redirects"
    },
    {
      "path": "../packages/plugin-search"
    },
    {
      "path": "../packages/plugin-sentry"
    },
    {
      "path": "../packages/plugin-seo"
    },
    {
      "path": "../packages/plugin-stripe"
    },
    {
      "path": "../packages/richtext-slate"
    },
    {
      "path": "../packages/richtext-lexical"
    },
    {
      "path": "../packages/translations"
    },
    {
      "path": "../packages/ui"
    },
    {
      "path": "../packages/plugin-ecommerce"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/a11y/.gitignore

```text
/media
/media-gif
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/a11y/config.ts

```typescript
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { MediaCollection } from './collections/Media/index.js'
import { PostsCollection, postsSlug } from './collections/Posts/index.js'
import { MenuGlobal } from './globals/Menu/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [PostsCollection, MediaCollection],
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        FocusIndicatorsView: {
          path: '/focus-indicators',
          Component: '/components/FocusIndicatorsView.js#FocusIndicatorsView',
        },
      },
    },
  },
  editor: lexicalEditor({}),
  globals: [
    // ...add more globals here
    MenuGlobal,
  ],
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await payload.create({
      collection: postsSlug,
      data: {
        title: 'example post',
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/a11y/e2e.spec.ts

```typescript
import type { Page, TestInfo } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { openNav } from 'helpers/e2e/toggleNav.js'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { ensureCompilationIsDone, initPageConsoleErrorCatch } from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { checkFocusIndicators } from '../helpers/e2e/checkFocusIndicators.js'
import { checkHorizontalOverflow } from '../helpers/e2e/checkHorizontalOverflow.js'
import { runAxeScan } from '../helpers/e2e/runAxeScan.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

test.describe('A11y', () => {
  let page: Page
  let postsUrl: AdminUrlUtil
  let mediaUrl: AdminUrlUtil
  let serverURL: string

  const DEFAULT_VIEWPORT = { width: 1280, height: 720 }

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)

    const { serverURL: url } = await initPayloadE2ENoConfig({ dirname })
    serverURL = url
    postsUrl = new AdminUrlUtil(serverURL, 'posts')
    mediaUrl = new AdminUrlUtil(serverURL, 'media')

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)
    await ensureCompilationIsDone({ page, serverURL })
  })

  // Reset viewport before each test to ensure consistent starting state
  test.beforeEach(async () => {
    await page.setViewportSize(DEFAULT_VIEWPORT)
  })

  test('Dashboard', async ({}, testInfo) => {
    await page.goto(postsUrl.admin)

    await page.locator('.dashboard').waitFor()

    const accessibilityScanResults = await runAxeScan({ page, testInfo })

    expect.soft(accessibilityScanResults.violations.length).toEqual(0)
  })

  test.fixme('Collection API tab', async ({}, testInfo) => {
    await page.goto(postsUrl.list)

    await page.locator('.cell-title a').first().click()

    await page.locator('.doc-tabs__tabs a', { hasText: 'API' }).click()

    const accessibilityScanResults = await runAxeScan({ page, testInfo })

    expect.soft(accessibilityScanResults.violations.length).toEqual(0)
  })

  test.fixme('Account page', async ({}, testInfo) => {
    await page.goto(postsUrl.account)

    await page.locator('.auth-fields').waitFor()

    const accessibilityScanResults = await runAxeScan({
      page,
      testInfo,
      exclude: ['.react-select'],
    })

    expect.soft(accessibilityScanResults.violations.length).toBe(0)
  })

  test.describe('Posts Collection', () => {
    test.fixme('list view', async ({}, testInfo) => {
      await page.goto(postsUrl.list)

      await page.locator('.list-controls').waitFor()

      const accessibilityScanResults = await runAxeScan({ page, testInfo })

      expect.soft(accessibilityScanResults.violations.length).toBe(0)
    })

    test.fixme('create view', async ({}, testInfo) => {
      await page.goto(postsUrl.create)

      await page.locator('#field-title').waitFor()

      const accessibilityScanResults = await runAxeScan({ page, testInfo })

      expect.soft(accessibilityScanResults.violations.length).toBe(0)
    })

    test.fixme('edit view', async ({}, testInfo) => {
      await page.goto(postsUrl.list)

      await page.locator('.table a').first().click()
      await page.locator('#field-title').waitFor()

      const accessibilityScanResults = await runAxeScan({ page, testInfo })

      expect.soft(accessibilityScanResults.violations.length).toBe(0)
    })
  })

  test.describe('Media Collection', () => {
    test('list view', async ({}, testInfo) => {
      await page.goto(mediaUrl.list)

      await page.locator('.list-controls').waitFor()

      const accessibilityScanResults = await runAxeScan({ page, testInfo })

      expect.soft(accessibilityScanResults.violations.length).toBe(0)
    })

    test.fixme('create view', async ({}, testInfo) => {
      await page.goto(mediaUrl.create)

      await page.locator('.file-field').first().waitFor()

      const accessibilityScanResults = await runAxeScan({ page, testInfo })

      expect.soft(accessibilityScanResults.violations.length).toBe(0)
    })
  })

  test.describe('Keyboard Navigation & Focus Indicators', () => {
    test('Dashboard - should have visible focus indicators', async ({}, testInfo) => {
      await page.goto(postsUrl.admin)

      await page.locator('.dashboard').waitFor()

      const result = await checkFocusIndicators({
        page,
        testInfo,
        verbose: false,
        selector: '.dashboard',
      })

      expect.soft(result.totalFocusableElements).toBeGreaterThan(0)
      expect.soft(result.elementsWithoutIndicators).toBe(0)
    })

    test('Posts create view - fields should have visible focus indicators', async ({}, testInfo) => {
      await page.goto(postsUrl.create)

      await page.locator('#field-title').waitFor()

      const result = await checkFocusIndicators({
        page,
        selector: 'main.collection-edit',
        testInfo,
      })

      expect.soft(result.totalFocusableElements).toBeGreaterThan(0)
      expect.soft(result.elementsWithoutIndicators).toBe(0)
    })

    test.fixme(
      'Posts create view - breadcrumbs should have visible focus indicators',
      async ({}, testInfo) => {
        await page.goto(postsUrl.create)

        await page.locator('#field-title').waitFor()

        const result = await checkFocusIndicators({
          page,
          selector: '.app-header__controls-wrapper',
          testInfo,
        })

        expect.soft(result.totalFocusableElements).toBeGreaterThan(0)
        expect.soft(result.elementsWithoutIndicators).toBe(0)
      },
    )

    test.fixme(
      'Navigation sidebar - should have visible focus indicators',
      async ({}, testInfo) => {
        await page.goto(postsUrl.admin)

        await page.locator('.nav').waitFor()

        await openNav(page)

        const result = await checkFocusIndicators({
          page,
          selector: '.nav',
          testInfo,
        })

        expect.soft(result.totalFocusableElements).toBeGreaterThan(0)
        expect.soft(result.elementsWithoutIndicators).toBe(0)
      },
    )

    test.fixme('Account page - should have visible focus indicators', async ({}, testInfo) => {
      await page.goto(postsUrl.account)

      await page.locator('.auth-fields').waitFor()

      const result = await checkFocusIndicators({
        page,
        testInfo,
        verbose: false,
      })

      expect.soft(result.totalFocusableElements).toBeGreaterThan(0)
      expect.soft(result.elementsWithoutIndicators).toBe(0)
    })
  })

  test.describe('WCAG 2.1 - Reflow (320px width)', () => {
    test('Dashboard - should not have horizontal overflow at 320px', async ({}, testInfo) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto(postsUrl.admin)
      await page.locator('.dashboard').waitFor()

      const result = await checkHorizontalOverflow(page, testInfo)

      expect(result.hasHorizontalOverflow).toBe(false)
      expect(result.overflowingElements.length).toBe(0)
    })

    test('Account page - should not have horizontal overflow at 320px', async ({}, testInfo) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto(postsUrl.account)
      await page.locator('.auth-fields').waitFor()

      const result = await checkHorizontalOverflow(page, testInfo)

      expect(result.hasHorizontalOverflow).toBe(false)
      expect(result.overflowingElements.length).toBe(0)
    })

    test('Posts list view - should not have horizontal overflow at 320px', async ({}, testInfo) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto(postsUrl.list)
      await page.locator('.collection-list').waitFor()

      const result = await checkHorizontalOverflow(page, testInfo)

      expect(result.hasHorizontalOverflow).toBe(false)
      expect(result.overflowingElements.length).toBe(0)
    })

    test('Posts create view - should not have horizontal overflow at 320px', async ({}, testInfo) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto(postsUrl.create)
      await page.locator('#field-title').waitFor()

      const result = await checkHorizontalOverflow(page, testInfo)

      expect(result.hasHorizontalOverflow).toBe(false)
      expect(result.overflowingElements.length).toBe(0)
    })

    test('Posts edit view - should not have horizontal overflow at 320px', async ({}, testInfo) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto(postsUrl.list)
      await page.locator('.table a').first().click()
      await page.locator('#field-title').waitFor()

      const result = await checkHorizontalOverflow(page, testInfo)

      expect(result.hasHorizontalOverflow).toBe(false)
      expect(result.overflowingElements.length).toBe(0)
    })

    test('Media list view - should not have horizontal overflow at 320px', async ({}, testInfo) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto(mediaUrl.list)
      await page.locator('.list-controls').waitFor()

      const result = await checkHorizontalOverflow(page, testInfo)

      expect(result.hasHorizontalOverflow).toBe(false)
      expect(result.overflowingElements.length).toBe(0)
    })

    test('Media create view - should not have horizontal overflow at 320px', async ({}, testInfo) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto(mediaUrl.create)
      await page.locator('.file-field').first().waitFor()

      const result = await checkHorizontalOverflow(page, testInfo)

      expect(result.hasHorizontalOverflow).toBe(false)
      expect(result.overflowingElements.length).toBe(0)
    })

    test('Navigation sidebar - should not have horizontal overflow at 320px', async ({}, testInfo) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto(postsUrl.admin)
      await page.locator('.nav').waitFor()

      const result = await checkHorizontalOverflow(page, testInfo)

      expect(result.hasHorizontalOverflow).toBe(false)
      expect(result.overflowingElements.length).toBe(0)
    })
  })

  test.describe('WCAG 2.1 - Resize Text (Zoom Levels)', () => {
    const zoomLevels = [
      { level: 100, scale: 1 },
      { level: 200, scale: 2 },
      { level: 300, scale: 3 },
      { level: 400, scale: 4 },
    ]

    test.describe('Dashboard', () => {
      for (const { level, scale } of zoomLevels) {
        test(`should be usable at ${level}% zoom`, async ({}, testInfo) => {
          await page.goto(postsUrl.admin)
          await page.locator('.dashboard').waitFor()

          // Simulate zoom by setting device scale factor
          await page.evaluate((zoomScale) => {
            document.body.style.zoom = String(zoomScale)
          }, scale)

          // Check for horizontal overflow after zoom
          const overflowResult = await checkHorizontalOverflow(page, testInfo)

          // At high zoom levels, some horizontal overflow might be acceptable
          // but we should at least verify the page is still functional
          if (level <= 200) {
            // At 200% or less, should not have overflow
            expect(overflowResult.hasHorizontalOverflow).toBe(false)
          }

          // Run axe scan at this zoom level
          const axeResults = await runAxeScan({ page, testInfo })
          expect(axeResults.violations.length).toBe(0)
        })
      }
    })

    test.describe('Posts create view', () => {
      for (const { level, scale } of zoomLevels) {
        test(`should be usable at ${level}% zoom`, async ({}, testInfo) => {
          await page.goto(postsUrl.create)
          await page.locator('#field-title').waitFor()

          await page.evaluate((zoomScale) => {
            document.body.style.zoom = String(zoomScale)
          }, scale)

          const overflowResult = await checkHorizontalOverflow(page, testInfo)

          if (level <= 200) {
            expect(overflowResult.hasHorizontalOverflow).toBe(false)
          }

          // Verify title field is still accessible
          const titleField = page.locator('#field-title')
          await expect(titleField).toBeVisible()

          // @todo: Excluding field descriptions due to known issue
          const axeResults = await runAxeScan({ page, testInfo, exclude: ['.field-description'] })
          expect(axeResults.violations.length).toBe(0)
        })
      }
    })

    test.describe('Posts list view', () => {
      for (const { level, scale } of zoomLevels) {
        test(`should be usable at ${level}% zoom`, async ({}, testInfo) => {
          await page.goto(postsUrl.list)
          await page.locator('.list-controls').waitFor()

          await page.evaluate((zoomScale) => {
            document.body.style.zoom = String(zoomScale)
          }, scale)

          const overflowResult = await checkHorizontalOverflow(page, testInfo)

          if (level <= 200) {
            expect(overflowResult.hasHorizontalOverflow).toBe(false)
          }

          // Verify list controls are still accessible
          const listControls = page.locator('.list-controls')
          await expect(listControls).toBeVisible()

          // @todo: Excluding checkbox-input due to known issue with bulk edit checkboxes
          const axeResults = await runAxeScan({ page, testInfo, exclude: ['.checkbox-input'] })
          expect(axeResults.violations.length).toBe(0)
        })
      }
    })

    test.describe('Account page', () => {
      for (const { level, scale } of zoomLevels) {
        test.fixme(`should be usable at ${level}% zoom`, async ({}, testInfo) => {
          await page.goto(postsUrl.account)
          await page.locator('.auth-fields').waitFor()

          await page.evaluate((zoomScale) => {
            document.body.style.zoom = String(zoomScale)
          }, scale)

          const overflowResult = await checkHorizontalOverflow(page, testInfo)

          if (level <= 200) {
            expect(overflowResult.hasHorizontalOverflow).toBe(false)
          }

          const axeResults = await runAxeScan({ page, testInfo })
          expect(axeResults.violations.length).toBe(0)
        })
      }
    })

    test.describe('Media collection', () => {
      for (const { level, scale } of zoomLevels) {
        test(`Media list view should be usable at ${level}% zoom`, async ({}, testInfo) => {
          await page.goto(mediaUrl.list)
          await page.locator('.collection-list').waitFor()

          await page.evaluate((zoomScale) => {
            document.body.style.zoom = String(zoomScale)
          }, scale)

          const overflowResult = await checkHorizontalOverflow(page, testInfo)

          if (level <= 200) {
            expect(overflowResult.hasHorizontalOverflow).toBe(false)
          }

          const axeResults = await runAxeScan({ page, testInfo })
          expect(axeResults.violations.length).toBe(0)
        })
      }
    })

    test.describe('Navigation sidebar', () => {
      for (const { level, scale } of zoomLevels) {
        test(`should be usable at ${level}% zoom`, async ({}, testInfo) => {
          await page.goto(postsUrl.admin)
          await page.locator('.nav').waitFor()

          await page.evaluate((zoomScale) => {
            document.body.style.zoom = String(zoomScale)
          }, scale)

          const overflowResult = await checkHorizontalOverflow(page, testInfo)

          if (level <= 200) {
            expect(overflowResult.hasHorizontalOverflow).toBe(false)
          }

          // Verify navigation is still accessible
          const nav = page.locator('.nav')
          await expect(nav).toBeVisible()

          const axeResults = await runAxeScan({ page, testInfo })
          expect(axeResults.violations.length).toBe(0)
        })
      }
    })
  })
})
```

--------------------------------------------------------------------------------

````
