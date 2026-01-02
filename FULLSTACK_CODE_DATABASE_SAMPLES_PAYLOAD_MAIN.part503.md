---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 503
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 503 of 695)

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

---[FILE: helpers.ts]---
Location: payload-main/test/helpers.ts

```typescript
import type {
  BrowserContext,
  CDPSession,
  ChromiumBrowserContext,
  Locator,
  Page,
} from '@playwright/test'
import type { Config } from 'payload'

import { expect } from '@playwright/test'
import { defaults } from 'payload'
import { wait } from 'payload/shared'
import shelljs from 'shelljs'
import { setTimeout } from 'timers/promises'

import { POLL_TOPASS_TIMEOUT } from './playwright.config.js'

export type AdminRoutes = NonNullable<Config['admin']>['routes']

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const networkConditions = {
  'Fast 3G': {
    download: ((1.6 * 1000 * 1000) / 8) * 0.9,
    latency: 1000,
    upload: ((750 * 1000) / 8) * 0.9,
  },
  'Slow 3G': {
    download: ((500 * 1000) / 8) * 0.8,
    latency: 2500,
    upload: ((500 * 1000) / 8) * 0.8,
  },
  'Slow 4G': {
    download: ((4 * 1000 * 1000) / 8) * 0.8,
    latency: 1000,
    upload: ((3 * 1000 * 1000) / 8) * 0.8,
  },
  'Fast 4G': {
    download: ((20 * 1000 * 1000) / 8) * 0.8,
    latency: 1000,
    upload: ((10 * 1000 * 1000) / 8) * 0.8,
  },
  None: {
    download: 0,
    latency: -1,
    upload: -1,
  },
}

/**
 * Ensure admin panel is loaded before running tests
 * @param page
 * @param serverURL
 */
export async function ensureCompilationIsDone({
  customAdminRoutes,
  customRoutes,
  page,
  serverURL,
  noAutoLogin,
  readyURL,
}: {
  customAdminRoutes?: AdminRoutes
  customRoutes?: Config['routes']
  noAutoLogin?: boolean
  page: Page
  readyURL?: string
  serverURL: string
}): Promise<void> {
  const { routes: { admin: adminRoute } = {} } = getRoutes({ customAdminRoutes, customRoutes })

  const adminURL = `${serverURL}${adminRoute}`

  const maxAttempts = 50
  let attempt = 1

  while (attempt <= maxAttempts) {
    try {
      console.log(
        `Checking if compilation is done (attempt ${attempt}/${maxAttempts})...`,
        readyURL ??
          (noAutoLogin ? `${adminURL + (adminURL.endsWith('/') ? '' : '/')}login` : adminURL),
      )

      await page.goto(adminURL)

      if (readyURL) {
        await page.waitForURL(readyURL)
      } else {
        await expect
          .poll(
            () => {
              if (noAutoLogin) {
                const baseAdminURL = adminURL + (adminURL.endsWith('/') ? '' : '/')
                return (
                  page.url() === `${baseAdminURL}create-first-user` ||
                  page.url() === `${baseAdminURL}login`
                )
              } else {
                return page.url() === adminURL
              }
            },
            { timeout: POLL_TOPASS_TIMEOUT },
          )
          .toBe(true)
      }

      console.log('Successfully compiled')
      return
    } catch (error) {
      console.error(`Compilation not done yet`)

      if (attempt === maxAttempts) {
        console.error('Max retry attempts reached. Giving up.')
        throw error
      }

      console.log('Retrying in 3 seconds...')
      await wait(3000)
      attempt++
    }
  }

  if (noAutoLogin) {
    return
  }
  await expect(() => expect(page.locator('.template-default')).toBeVisible()).toPass({
    timeout: POLL_TOPASS_TIMEOUT,
  })

  await expect(page.locator('.dashboard__label').first()).toBeVisible()
}

/**
 * CPU throttling & 2 different kinds of network throttling
 */
export async function throttleTest({
  context,
  delay,
  page,
}: {
  context: BrowserContext
  delay: keyof typeof networkConditions
  page: Page
}): Promise<CDPSession> {
  const cdpSession = await context.newCDPSession(page)

  await cdpSession.send('Network.emulateNetworkConditions', {
    downloadThroughput: networkConditions[delay].download,
    latency: networkConditions[delay].latency,
    offline: false,
    uploadThroughput: networkConditions[delay].upload,
  })

  await page.route('**/*', async (route) => {
    await setTimeout(random(500, 1000))
    await route.continue()
  })

  const client = await (page.context() as ChromiumBrowserContext).newCDPSession(page)
  await client.send('Emulation.setCPUThrottlingRate', { rate: 8 }) // 8x slowdown

  return client
}

export async function saveDocHotkeyAndAssert(page: Page): Promise<void> {
  const ua = page.evaluate(() => navigator.userAgent)
  const isMac = (await ua).includes('Mac OS X')
  if (isMac) {
    await page.keyboard.down('Meta')
  } else {
    await page.keyboard.down('Control')
  }
  await page.keyboard.press('s')
  if (isMac) {
    await page.keyboard.up('Meta')
  } else {
    await page.keyboard.up('Control')
  }
  await expect(page.locator('.payload-toast-container')).toContainText('successfully')
}

export async function saveDocAndAssert(
  page: Page,
  selector:
    | '#action-publish'
    | '#action-save'
    | '#action-save-draft'
    | '#publish-locale'
    | string = '#action-save',
  expectation: 'error' | 'success' = 'success',
): Promise<void> {
  await wait(500) // TODO: Fix this
  await page.click(selector, { delay: 100 })

  if (expectation === 'success') {
    await expect(page.locator('.payload-toast-container')).toContainText('successfully')
    await expect.poll(() => page.url(), { timeout: POLL_TOPASS_TIMEOUT }).not.toContain('/create')
  } else {
    await expect(page.locator('.payload-toast-container .toast-error')).toBeVisible()
  }
}

export async function openDocDrawer(page: Page, selector: string): Promise<void> {
  await wait(500) // wait for parent form state to initialize
  await page.locator(selector).click()
  await wait(500) // wait for drawer form state to initialize
}

export async function openCreateDocDrawer(page: Page, fieldSelector: string): Promise<void> {
  await wait(500) // wait for parent form state to initialize
  const relationshipField = page.locator(fieldSelector)
  await expect(relationshipField.locator('input')).toBeEnabled()
  const addNewButton = relationshipField.locator('.relationship-add-new__add-button')
  await expect(addNewButton).toBeVisible()
  await addNewButton.click()
  await wait(500) // wait for drawer form state to initialize
}

export async function openLocaleSelector(page: Page): Promise<void> {
  const button = page.locator('.localizer button.popup-button')
  const popup = page.locator('.popup__content')

  if (!(await popup.isVisible())) {
    await button.click()
    await expect(popup).toBeVisible()
  }
}

export async function closeLocaleSelector(page: Page): Promise<void> {
  const popup = page.locator('.popup__content')

  if (await popup.isVisible()) {
    await page.click('body', { position: { x: 0, y: 0 } })
    await expect(popup).toBeHidden()
  }
}

export async function changeLocale(page: Page, newLocale: string) {
  await openLocaleSelector(page)

  const currentlySelectedLocale = await page
    .locator(`.popup__content .popup-button-list__button--selected .localizer__locale-code`)
    .textContent()

  if (currentlySelectedLocale !== `(${newLocale})`) {
    const localeToSelect = page
      .locator('.popup__content .popup-button-list__button')
      .locator('.localizer__locale-code', {
        hasText: `${newLocale}`,
      })

    await expect(async () => await expect(localeToSelect).toBeEnabled()).toPass({
      timeout: POLL_TOPASS_TIMEOUT,
    })

    await localeToSelect.click()

    const regexPattern = new RegExp(`locale=${newLocale}`)

    await expect(page).toHaveURL(regexPattern)
  }

  await closeLocaleSelector(page)
}

export function exactText(text: string) {
  return new RegExp(`^${text}$`)
}

export const checkPageTitle = async (page: Page, title: string) => {
  await expect
    .poll(async () => await page.locator('.doc-header__title.render-title')?.first()?.innerText(), {
      timeout: POLL_TOPASS_TIMEOUT,
    })
    .toBe(title)
}

export const checkBreadcrumb = async (page: Page, text: string) => {
  await expect
    .poll(
      async () => await page.locator('.step-nav.app-header__step-nav .step-nav__last')?.innerText(),
      {
        timeout: POLL_TOPASS_TIMEOUT,
      },
    )
    .toBe(text)
}

export const selectTableRow = async (scope: Locator | Page, title: string): Promise<void> => {
  const selector = `tbody tr:has-text("${title}") .select-row__checkbox input[type=checkbox]`
  await scope.locator(selector).check()
  await expect(scope.locator(selector)).toBeChecked()
}

export const findTableCell = async (
  page: Page,
  fieldName: string,
  rowTitle?: string,
): Promise<Locator> => {
  const parentEl = rowTitle ? await findTableRow(page, rowTitle) : page.locator('tbody tr')
  const cell = parentEl.locator(`td.cell-${fieldName}`)
  await expect(cell).toBeVisible()
  return cell
}

export const findTableRow = async (page: Page, title: string): Promise<Locator> => {
  const row = page.locator(`tbody tr:has-text("${title}")`)
  await expect(row).toBeVisible()
  return row
}

export async function switchTab(page: Page, selector: string) {
  await page.locator(selector).click()
  await wait(300)
  await expect(page.locator(`${selector}.tabs-field__tab-button--active`)).toBeVisible()
}

export const openColumnControls = async (page: Page) => {
  await page.locator('.list-controls__toggle-columns').click()
  await expect(page.locator('.list-controls__columns.rah-static--height-auto')).toBeVisible()
}

/**
 * Throws an error when browser console error messages (with some exceptions) are thrown, thus resulting
 * in the e2e test failing.
 *
 * Useful to prevent the e2e test from passing when, for example, there are react missing key prop errors
 * @param page
 * @param options
 */
export function initPageConsoleErrorCatch(page: Page, options?: { ignoreCORS?: boolean }) {
  const { ignoreCORS = false } = options || {} // Default to not ignoring CORS errors
  const consoleErrors: string[] = []

  let shouldCollectErrors = false

  page.on('console', (msg) => {
    if (
      msg.type() === 'error' &&
      // Playwright is seemingly loading CJS files from React Select, but Next loads ESM.
      // This leads to classnames not matching. Ignore these God-awful errors
      // https://github.com/JedWatson/react-select/issues/3590
      !msg.text().includes('did not match. Server:') &&
      !msg.text().includes('the server responded with a status of') &&
      !msg.text().includes('Failed to fetch RSC payload for') &&
      !msg.text().includes('Error: NEXT_NOT_FOUND') &&
      !msg.text().includes('Error: NEXT_REDIRECT') &&
      !msg.text().includes('Error getting document data') &&
      !msg.text().includes('Failed trying to load default language strings') &&
      !msg.text().includes('TypeError: Failed to fetch') && // This happens when server actions are aborted
      !msg.text().includes('der-radius: 2px  Server   Error: Error getting do') && // This is a weird error that happens in the console
      // Conditionally ignore CORS errors based on the `ignoreCORS` option
      !(
        ignoreCORS &&
        msg.text().includes('Access to fetch at') &&
        msg.text().includes("No 'Access-Control-Allow-Origin' header is present")
      ) &&
      // Conditionally ignore network-related errors
      !msg.text().includes('Failed to load resource: net::ERR_FAILED')
    ) {
      // "Failed to fetch RSC payload for" happens seemingly randomly. There are lots of issues in the next.js repository for this. Causes e2e tests to fail and flake. Will ignore for now
      // the the server responded with a status of error happens frequently. Will ignore it for now.
      // Most importantly, this should catch react errors.
      throw new Error(`Browser console error: ${msg.text()}`)
    }

    // Log ignored CORS-related errors for visibility
    if (msg.type() === 'error' && msg.text().includes('Access to fetch at') && ignoreCORS) {
      console.log(`Ignoring expected CORS-related error: ${msg.text()}`)
    }

    // Log ignored network-related errors for visibility
    if (msg.type() === 'error' && msg.text().includes('Failed to load resource: net::ERR_FAILED')) {
      console.log(`Ignoring expected network error: ${msg.text()}`)
    }
  })

  // Capture uncaught errors that do not appear in the console
  page.on('pageerror', (error) => {
    if (shouldCollectErrors) {
      consoleErrors.push(`Page error: ${error.message}`)
    } else {
      throw new Error(`Page error: ${error.message}`)
    }
  })

  return {
    consoleErrors,
    collectErrors: () => (shouldCollectErrors = true), // Enable collection of errors for specific tests
    stopCollectingErrors: () => (shouldCollectErrors = false), // Disable collection of errors after the test
  }
}

export function describeIfInCIOrHasLocalstack(): jest.Describe {
  if (process.env.CI) {
    return describe
  }

  // Check that localstack is running
  const { code } = shelljs.exec(`docker ps | grep localstack`)

  if (code !== 0) {
    console.warn('Localstack is not running. Skipping test suite.')
    return describe.skip
  }

  console.log('Localstack is running. Running test suite.')

  return describe
}

export function getRoutes({
  customAdminRoutes,
  customRoutes,
}: {
  customAdminRoutes?: AdminRoutes
  customRoutes?: Config['routes']
}): {
  admin: {
    routes: AdminRoutes
  }
  routes: Config['routes']
} {
  let routes = defaults.routes
  let adminRoutes = defaults.admin?.routes

  if (customAdminRoutes) {
    adminRoutes = {
      ...adminRoutes,
      ...customAdminRoutes,
    }
  }

  if (customRoutes) {
    routes = {
      ...routes,
      ...customRoutes,
    }
  }

  return {
    admin: {
      routes: adminRoutes,
    },
    routes,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: initDevAndTest.ts]---
Location: payload-main/test/initDevAndTest.ts

```typescript
import fs from 'fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { generateImportMap, type SanitizedConfig } from 'payload'

import type { allDatabaseAdapters } from './generateDatabaseAdapter.js'

import { generateDatabaseAdapter } from './generateDatabaseAdapter.js'
import { getNextRootDir } from './helpers/getNextRootDir.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const runImmediately = process.argv[2]

export async function initDevAndTest(
  testSuiteArg: string,
  writeDBAdapter: string,
  skipGenImportMap: string,
  configFile?: string,
): Promise<void> {
  const importMapPath: string = path.resolve(
    getNextRootDir(testSuiteArg).rootDir,
    './app/(payload)/admin/importMap.js',
  )

  try {
    fs.writeFileSync(importMapPath, 'export const importMap = {}')
  } catch (error) {
    console.log('Error writing importMap.js', error)
  }

  if (writeDBAdapter === 'true') {
    const dbAdapter: keyof typeof allDatabaseAdapters =
      (process.env.PAYLOAD_DATABASE as keyof typeof allDatabaseAdapters) || 'mongodb'
    generateDatabaseAdapter(dbAdapter)
  }

  if (skipGenImportMap === 'true') {
    console.log('Done')
    return
  }

  // Generate importMap
  const testDir = path.resolve(dirname, testSuiteArg)
  console.log('Generating import map for config:', testDir)

  const configUrl = pathToFileURL(path.resolve(testDir, configFile ?? 'config.ts')).href
  const config: SanitizedConfig = await (await import(configUrl)).default

  process.env.ROOT_DIR = getNextRootDir(testSuiteArg).rootDir

  await generateImportMap(config, { log: true, force: true })

  console.log('Done')
}

if (runImmediately === 'true') {
  const testSuiteArg = process.argv[3]
  const writeDBAdapter = process.argv[4]
  const skipGenImportMap = process.argv[5]
  void initDevAndTest(testSuiteArg, writeDBAdapter, skipGenImportMap)
}
```

--------------------------------------------------------------------------------

---[FILE: jest-spec-reporter.cjs]---
Location: payload-main/test/jest-spec-reporter.cjs

```text
// From https://github.com/robertbradleyux/jest-ci-spec-reporter/blob/main/src/jest-ci-spec-reporter.ts
/*
MIT License

Copyright (c) 2023 Robert Bradley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class JestCiSpecReporter {
  onRunStart({ numTotalTestSuites }) {
    console.log()
    console.log(`Found ${numTotalTestSuites} test suites.`)
    console.log()
  }
  onRunComplete(_, results) {
    const {
      numFailedTests,
      numPassedTests,
      numPendingTests,
      testResults,
      numTotalTests,
      startTime,
    } = results
    testResults.forEach(({ failureMessage }) => {
      if (failureMessage) {
        console.log(failureMessage)
      }
    })
    const testResultText = numFailedTests === 0 ? 'SUCCESS' : 'FAILED'
    const numNotSkippedTests = numPassedTests + numFailedTests
    const runDuration = this._getRunDuration(startTime)
    console.log()
    console.log(
      `Executed ${numNotSkippedTests} of ${numTotalTests} (skipped ${numPendingTests}) ${testResultText} (${runDuration})`,
    )
    console.log(`TOTAL: ${numFailedTests || numNotSkippedTests} ${testResultText}`)
  }
  onTestResult(test, { testResults }) {
    // Log pretty ALL RESULTS message
    console.log('\n\n\x1b[1m\x1b[30mALL RESULTS\x1b[0m')
    testResults.forEach((result) => {
      var _a, _b
      const { title, duration, status, ancestorTitles } = result
      const { name } =
        (_b = (_a = test.context.config) === null || _a === void 0 ? void 0 : _a.displayName) !==
          null && _b !== void 0
          ? _b
          : {}
      if (name) {
        ancestorTitles.unshift(name)
      }
      const breadcrumbs = `${ancestorTitles.join(' > ')} >`

      console.log(
        `    ${this._getTestStatus(status)} ${breadcrumbs} ${title} ${this._getTestDuration(duration)}`,
      )
    })
  }

  onTestCaseResult(test, result) {
    var _a, _b
    const { title, duration, status, ancestorTitles } = result
    const { name } =
      (_b = (_a = test.context.config) === null || _a === void 0 ? void 0 : _a.displayName) !==
        null && _b !== void 0
        ? _b
        : {}
    if (name) {
      ancestorTitles.unshift(name)
    }
    const breadcrumbs = `${ancestorTitles.join(' > ')} >`

    console.log(
      `    ${this._getTestStatus(status)} ${breadcrumbs} ${title} ${this._getTestDuration(duration)}`,
    )
  }

  getLastError() {
    return undefined
  }
  _getRunDuration(startTime) {
    const deltaInMillis = new Date().getTime() - new Date(startTime).getTime()
    const seconds = ((deltaInMillis % 60000) / 1000).toFixed(3)
    return `${seconds} secs`
  }
  _getTestDuration(duration) {
    return `\x1b[1m\x1b[30m(${duration !== null && duration !== void 0 ? duration : 0}ms)\x1b[0m`
  }
  _getTestStatus(status) {
    switch (status) {
      case 'passed':
        return '\x1b[1m\x1b[32m[PASS]\x1b[0m'
      case 'pending':
        return '\x1b[1m\x1b[33m[SKIP]\x1b[0m'
      case 'todo':
        return '\x1b[1m\x1b[34m[TODO]\x1b[0m'
      case 'failed':
      default:
        return '\x1b[1m\x1b[31m[FAIL]\x1b[0m'
    }
  }
}
exports.default = JestCiSpecReporter
```

--------------------------------------------------------------------------------

---[FILE: jest.config.js]---
Location: payload-main/test/jest.config.js

```javascript
import path from 'path'
import { fileURLToPath } from 'url'
import jestBaseConfig from '../jest.config.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/** @type {import('jest').Config} */
const customJestConfig = {
  ...jestBaseConfig,
  testMatch: ['<rootDir>/**/*int.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  globalSetup: path.resolve(dirname, './helpers/startMemoryDB.ts'),
  globalTeardown: path.resolve(dirname, './helpers/stopMemoryDB.ts'),

  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/helpers/mocks/emptyModule.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/helpers/mocks/fileMock.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}

export default customJestConfig
```

--------------------------------------------------------------------------------

---[FILE: jest.setup.js]---
Location: payload-main/test/jest.setup.js

```javascript
import { jest } from '@jest/globals'
import console from 'console'
global.console = console

import dotenv from 'dotenv'
dotenv.config()

import nodemailer from 'nodemailer'

import { generateDatabaseAdapter } from './generateDatabaseAdapter.js'

process.env.PAYLOAD_DISABLE_ADMIN = 'true'

process.env.PAYLOAD_DROP_DATABASE = 'true'

process.env.PAYLOAD_PUBLIC_CLOUD_STORAGE_ADAPTER = 's3'

process.env.NODE_OPTIONS = '--no-deprecation'
process.env.PAYLOAD_CI_DEPENDENCY_CHECKER = 'true'
// @todo remove in 4.0 - will behave like this by default in 4.0
process.env.PAYLOAD_DO_NOT_SANITIZE_LOCALIZED_PROPERTY = 'true'

// Mock createTestAccount to prevent calling external services
jest.spyOn(nodemailer, 'createTestAccount').mockImplementation(() => {
  return Promise.resolve({
    imap: { host: 'imap.test.com', port: 993, secure: true },
    pass: 'testpass',
    pop3: { host: 'pop3.test.com', port: 995, secure: true },
    smtp: { host: 'smtp.test.com', port: 587, secure: false },
    user: 'testuser',
    web: 'https://webmail.test.com',
  })
})

if (!process.env.PAYLOAD_DATABASE) {
  // Mutate env so we can use conditions by DB adapter in tests properly without ignoring // eslint no-jest-conditions.
  process.env.PAYLOAD_DATABASE = 'mongodb'
}
process.env.REDIS_URL = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379'

generateDatabaseAdapter(process.env.PAYLOAD_DATABASE)
```

--------------------------------------------------------------------------------

---[FILE: jestreporter.cjs]---
Location: payload-main/test/jestreporter.cjs

```text
class CustomReporter {
  constructor(globalConfig, reporterOptions, reporterContext) {
    this._globalConfig = globalConfig
    this._options = reporterOptions
    this._context = reporterContext
  }

  onTestCaseResult(test, testCaseResult) {
    if (testCaseResult.status === 'passed') {
      return
    }
    console.log('Test case result:', testCaseResult)
  }
}

module.exports = CustomReporter
```

--------------------------------------------------------------------------------

---[FILE: next-env.d.ts]---
Location: payload-main/test/next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

--------------------------------------------------------------------------------

---[FILE: next.config.mjs]---
Location: payload-main/test/next.config.mjs

```text
import bundleAnalyzer from '@next/bundle-analyzer'

import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(
  withPayload(
    {
      devIndicators: {
        position: 'bottom-right',
      },
      eslint: {
        ignoreDuringBuilds: true,
      },
      typescript: {
        ignoreBuildErrors: true,
      },
      experimental: {
        fullySpecified: true,
        serverActions: {
          bodySizeLimit: '5mb',
        },
      },
      env: {
        PAYLOAD_CORE_DEV: 'true',
        ROOT_DIR: path.resolve(dirname),
        // @todo remove in 4.0 - will behave like this by default in 4.0
        PAYLOAD_DO_NOT_SANITIZE_LOCALIZED_PROPERTY: 'true',
      },
      async redirects() {
        return [
          {
            destination: '/admin',
            permanent: true,
            source: '/',
          },
        ]
      },
      images: {
        remotePatterns: [
          {
            hostname: 'localhost',
          },
        ],
      },
      webpack: (webpackConfig) => {
        webpackConfig.resolve.extensionAlias = {
          '.cjs': ['.cts', '.cjs'],
          '.js': ['.ts', '.tsx', '.js', '.jsx'],
          '.mjs': ['.mts', '.mjs'],
        }

        return webpackConfig
      },
    },
    { devBundleServerPackages: false },
  ),
)
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/test/package.json
Signals: React, Next.js

```json
{
  "name": "payload-test-suite",
  "version": "0.0.1",
  "private": true,
  "description": "Payload test suite",
  "type": "module",
  "scripts": {
    "dev": "cross-env NODE_OPTIONS=--no-deprecation node ./dev.js",
    "test": "pnpm -C \"../\" run test",
    "test:e2e": "pnpm -C \"../\" run test:e2e",
    "test:int": "pnpm -C \"../\" run test:int",
    "typecheck": "pnpm turbo build --filter payload-test-suite && tsc --project tsconfig.typecheck.json"
  },
  "lint-staged": {
    "**/package.json": "sort-package-json",
    "*.{md,mdx,yml,json}": "prettier --write",
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --cache --fix"
    ],
    "templates/website/**/*": "sh -c \"cd templates/website; pnpm install --ignore-workspace --frozen-lockfile; pnpm run lint --fix\"",
    "tsconfig.json": "node scripts/reset-tsconfig.js"
  },
  "devDependencies": {
    "@aws-sdk/client-s3": "^3.614.0",
    "@azure/storage-blob": "^12.11.0",
    "@date-fns/tz": "1.2.0",
    "@miniflare/d1": "2.14.4",
    "@miniflare/shared": "2.14.4",
    "@modelcontextprotocol/sdk": "^1.17.2",
    "@next/env": "15.4.7",
    "@opennextjs/cloudflare": "1.9.2",
    "@payloadcms/admin-bar": "workspace:*",
    "@payloadcms/db-d1-sqlite": "workspace:*",
    "@payloadcms/db-mongodb": "workspace:*",
    "@payloadcms/db-postgres": "workspace:*",
    "@payloadcms/db-sqlite": "workspace:*",
    "@payloadcms/db-vercel-postgres": "workspace:*",
    "@payloadcms/drizzle": "workspace:*",
    "@payloadcms/email-nodemailer": "workspace:*",
    "@payloadcms/email-resend": "workspace:*",
    "@payloadcms/eslint-config": "workspace:*",
    "@payloadcms/eslint-plugin": "workspace:*",
    "@payloadcms/graphql": "workspace:*",
    "@payloadcms/kv-redis": "workspace:*",
    "@payloadcms/live-preview": "workspace:*",
    "@payloadcms/live-preview-react": "workspace:*",
    "@payloadcms/next": "workspace:*",
    "@payloadcms/payload-cloud": "workspace:*",
    "@payloadcms/plugin-cloud-storage": "workspace:*",
    "@payloadcms/plugin-ecommerce": "workspace:*",
    "@payloadcms/plugin-form-builder": "workspace:*",
    "@payloadcms/plugin-import-export": "workspace:*",
    "@payloadcms/plugin-mcp": "workspace:*",
    "@payloadcms/plugin-multi-tenant": "workspace:*",
    "@payloadcms/plugin-nested-docs": "workspace:*",
    "@payloadcms/plugin-redirects": "workspace:*",
    "@payloadcms/plugin-search": "workspace:*",
    "@payloadcms/plugin-sentry": "workspace:*",
    "@payloadcms/plugin-seo": "workspace:*",
    "@payloadcms/plugin-stripe": "workspace:*",
    "@payloadcms/richtext-lexical": "workspace:*",
    "@payloadcms/richtext-slate": "workspace:*",
    "@payloadcms/sdk": "workspace:*",
    "@payloadcms/storage-azure": "workspace:*",
    "@payloadcms/storage-gcs": "workspace:*",
    "@payloadcms/storage-r2": "workspace:*",
    "@payloadcms/storage-s3": "workspace:*",
    "@payloadcms/storage-uploadthing": "workspace:*",
    "@payloadcms/storage-vercel-blob": "workspace:*",
    "@payloadcms/translations": "workspace:*",
    "@payloadcms/ui": "workspace:*",
    "@sentry/nextjs": "^8.33.1",
    "@sentry/react": "^7.77.0",
    "@stripe/react-stripe-js": "3.7.0",
    "@stripe/stripe-js": "7.3.1",
    "@types/jest": "29.5.12",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "babel-plugin-react-compiler": "19.1.0-rc.3",
    "better-sqlite3": "11.10.0",
    "comment-json": "^4.2.3",
    "create-payload-app": "workspace:*",
    "csv-parse": "^5.6.0",
    "dequal": "2.0.3",
    "dotenv": "16.4.7",
    "drizzle-kit": "0.31.7",
    "drizzle-orm": "0.44.7",
    "escape-html": "1.0.3",
    "eslint-plugin-playwright": "2.3.0",
    "execa": "5.1.1",
    "file-type": "19.3.0",
    "http-status": "2.1.0",
    "jest": "29.7.0",
    "jwt-decode": "4.0.0",
    "mongoose": "8.15.1",
    "next": "15.4.10",
    "nodemailer": "7.0.9",
    "object-to-formdata": "4.5.1",
    "payload": "workspace:*",
    "pg": "8.16.3",
    "qs-esm": "7.0.2",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "sass": "1.77.4",
    "server-only": "^0.0.1",
    "sharp": "0.32.6",
    "slate": "0.91.4",
    "tempy": "^1.0.1",
    "ts-essentials": "10.0.3",
    "typescript": "5.7.3",
    "uuid": "10.0.0",
    "wrangler": "~4.42.0",
    "zod": "^3.25.5"
  },
  "pnpm": {
    "neverBuiltDependencies": []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: playwright.bail.config.ts]---
Location: payload-main/test/playwright.bail.config.ts

```typescript
import type { PlaywrightTestConfig } from '@playwright/test'

import baseConfig from './playwright.config.js'

const config: PlaywrightTestConfig = {
  ...baseConfig,
  maxFailures: process.env.CI ? undefined : 1,
}

export default config
```

--------------------------------------------------------------------------------

---[FILE: playwright.config.ts]---
Location: payload-main/test/playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({ path: path.resolve(dirname, 'test.env') })

let multiplier = process.env.CI ? 4 : 1
let smallMultiplier = process.env.CI ? 3 : 1

export const TEST_TIMEOUT_LONG = 640000 * multiplier // 8*3 minutes - used as timeOut for the beforeAll
export const TEST_TIMEOUT = 40000 * multiplier
export const EXPECT_TIMEOUT = 6000 * smallMultiplier
export const POLL_TOPASS_TIMEOUT = EXPECT_TIMEOUT * 4 // That way expect.poll() or expect().toPass can retry 4 times. 4x higher than default expect timeout => can retry 4 times if retryable expects are used inside

export default defineConfig({
  // Look for test files in the "test" directory, relative to this configuration file
  testDir: '',
  testMatch: '*e2e.spec.ts',
  timeout: TEST_TIMEOUT, // 1 minute
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  expect: {
    timeout: EXPECT_TIMEOUT,
  },
  workers: 16,
  maxFailures: process.env.CI ? undefined : undefined,
  retries: process.env.CI ? 5 : undefined,
  reporter: process.env.CI
    ? [['list', { printSteps: true }], ['json']]
    : [['list', { printSteps: true }]],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
})
```

--------------------------------------------------------------------------------

---[FILE: runE2E.ts]---
Location: payload-main/test/runE2E.ts

```typescript
import { spawn } from 'child_process'
import globby from 'globby'
import minimist from 'minimist'
import path from 'path'
import shelljs from 'shelljs'
import slash from 'slash'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// @todo remove in 4.0 - will behave like this by default in 4.0
process.env.PAYLOAD_DO_NOT_SANITIZE_LOCALIZED_PROPERTY = 'true'

shelljs.env.DISABLE_LOGGING = 'true'

const prod = process.argv.includes('--prod')
if (prod) {
  process.env.PAYLOAD_TEST_PROD = 'true'
  shelljs.env.PAYLOAD_TEST_PROD = 'true'
}

const turbo = process.argv.includes('--no-turbo') ? false : true

process.argv = process.argv.filter((arg) => arg !== '--prod' && arg !== '--no-turbo')

const playwrightBin = path.resolve(dirname, '../node_modules/.bin/playwright')

const testRunCodes: { code: number; suiteName: string }[] = []
const { _: args, bail, part } = minimist(process.argv.slice(2))
const suiteName = args[0]

// Run all
if (!suiteName) {
  let files = await globby(`${path.resolve(dirname).replace(/\\/g, '/')}/**/*e2e.spec.ts`)

  const totalFiles = files.length

  if (part) {
    if (!part.includes('/')) {
      throw new Error('part must be in the format of "1/2"')
    }

    const [partToRun, totalParts] = part.split('/').map((n: string) => parseInt(n))

    if (partToRun > totalParts) {
      throw new Error('part cannot be greater than totalParts')
    }

    const partSize = Math.ceil(files.length / totalParts)
    const start = (partToRun - 1) * partSize
    const end = start + partSize
    files = files.slice(start, end)
  }

  if (files.length !== totalFiles) {
    console.log(`\n\nExecuting part ${part}: ${files.length} of ${totalFiles} E2E tests...\n\n`)
  } else {
    console.log(`\n\nExecuting all ${files.length} E2E tests...\n\n`)
  }
  console.log(`${files.join('\n')}\n`)

  for (const file of files) {
    clearWebpackCache()

    const baseTestFolder = file?.split('/test/')?.[1]?.split('/')?.[0]
    if (!baseTestFolder) {
      throw new Error(`No base test folder found for ${file}`)
    }
    executePlaywright(file, baseTestFolder, bail)
  }
} else {
  let inputSuitePath: string | undefined = suiteName
  let suiteConfigPath: string | undefined = 'config.ts'
  if (suiteName.includes('#')) {
    ;[inputSuitePath, suiteConfigPath] = suiteName.split('#')
  }

  if (!inputSuitePath) {
    throw new Error(`No test suite found for ${suiteName}`)
  }

  // Run specific suite
  clearWebpackCache()
  const suiteFolderPath: string | undefined = path
    .resolve(dirname, inputSuitePath)
    .replaceAll('__', '/')

  const allSuitesInFolder = await globby(`${suiteFolderPath.replace(/\\/g, '/')}/*e2e.spec.ts`)

  const baseTestFolder = inputSuitePath.split('__')[0]

  if (!baseTestFolder || !allSuitesInFolder?.length) {
    throw new Error(`No test suite found for ${suiteName}`)
  }

  console.log(`\n\nExecuting all ${allSuitesInFolder.length} E2E tests...\n\n`)

  console.log(`${allSuitesInFolder.join('\n')}\n`)

  for (const file of allSuitesInFolder) {
    clearWebpackCache()
    executePlaywright(file, baseTestFolder, false, suiteConfigPath)
  }
}

console.log('\nRESULTS:')
testRunCodes.forEach((tr) => {
  console.log(`\tSuite: ${tr.suiteName}, Success: ${tr.code === 0}`)
})
console.log('\n')

// baseTestFolder is the most top level folder of the test suite, that contains the payload config.
// We need this because pnpm dev for a given test suite will always be run from the top level test folder,
// not from a nested suite folder.
function executePlaywright(
  suitePath: string,
  baseTestFolder: string,
  bail = false,
  suiteConfigPath?: string,
) {
  console.log(`Executing ${suitePath}...`)
  const playwrightCfg = path.resolve(
    dirname,
    `${bail ? 'playwright.bail.config.ts' : 'playwright.config.ts'}`,
  )

  const spawnDevArgs: string[] = [
    'dev',
    suiteConfigPath ? `${baseTestFolder}#${suiteConfigPath}` : baseTestFolder,
    '--start-memory-db',
  ]
  if (prod) {
    spawnDevArgs.push('--prod')
  }

  if (!turbo) {
    spawnDevArgs.push('--no-turbo')
  }

  process.env.START_MEMORY_DB = 'true'

  const child = spawn('pnpm', spawnDevArgs, {
    stdio: 'inherit',
    cwd: path.resolve(dirname, '..'),
    env: {
      ...process.env,
    },
  })

  const cmd = slash(`${playwrightBin} test ${suitePath} -c ${playwrightCfg}`)
  console.log('\n', cmd)
  const { code, stdout } = shelljs.exec(cmd, {
    cwd: path.resolve(dirname, '..'),
  })
  const suite = path.basename(path.dirname(suitePath))
  const results = { code, suiteName: suite }

  if (code) {
    if (bail) {
      console.error(`TEST FAILURE DURING ${suite} suite.`)
    }
    child.kill(1)
    process.exit(1)
  } else {
    child.kill()
  }
  testRunCodes.push(results)

  return stdout
}

function clearWebpackCache() {
  const webpackCachePath = path.resolve(dirname, '../node_modules/.cache/webpack')
  shelljs.rm('-rf', webpackCachePath)
}
```

--------------------------------------------------------------------------------

---[FILE: runInit.ts]---
Location: payload-main/test/runInit.ts

```typescript
import { initDevAndTest } from './initDevAndTest.js'

export async function runInit(
  testSuiteArg: string,
  writeDBAdapter: boolean,
  skipGenImportMap: boolean = false,
  configFile?: string,
): Promise<void> {
  await initDevAndTest(testSuiteArg, String(writeDBAdapter), String(skipGenImportMap), configFile)
}
```

--------------------------------------------------------------------------------

---[FILE: runInitSeparateProcess.ts]---
Location: payload-main/test/runInitSeparateProcess.ts

```typescript
import child_process from 'node:child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export async function runInitSeparateProcess(
  testSuiteArg: string,
  writeDBAdapter: boolean,
  skipGenImportMap: boolean = false,
): Promise<void> {
  let done = false

  // Now use node & swc-node/register to execute initDevAndTest and wait until it console logs "Done". use child_process
  // 1. execute
  // 2. wait until console.log("Done")
  const child = child_process.spawn(
    'node',
    [
      '--no-deprecation',
      '--import',
      '@swc-node/register/esm-register',
      'test/initDevAndTest.ts',
      'true',
      testSuiteArg,
      writeDBAdapter ? 'true' : 'false',
      skipGenImportMap ? 'true' : 'false',
    ],
    {
      stdio: 'pipe',
      cwd: path.resolve(dirname, '..'),
    },
  )

  child.stdout.on('data', (data) => {
    console.log('initDevAndTest data', data.toString())
    if (data.toString().includes('Done')) {
      child.kill()
      done = true
    }
  })

  // on error
  child.stderr.on('data', (data) => {
    console.error('initDevAndTest error', data.toString())
  })

  child.on('close', (code) => {
    console.log(`Child process closed with code ${code}`)
  })

  // wait for done to be true
  await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (done) {
        clearInterval(interval)
        resolve(undefined)
      }
    }, 100)
  })
}
```

--------------------------------------------------------------------------------

````
