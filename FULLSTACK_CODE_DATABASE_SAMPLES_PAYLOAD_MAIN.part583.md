---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 583
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 583 of 695)

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

---[FILE: preferences.ts]---
Location: payload-main/test/helpers/e2e/preferences.ts

```typescript
import type { PayloadTestSDK } from 'helpers/sdk/index.js'
import type { GeneratedTypes } from 'helpers/sdk/types.js'
import type { TypedUser, User } from 'payload'

export const upsertPreferences = async <
  TConfig extends GeneratedTypes<any>,
  TGeneratedTypes extends GeneratedTypes<any>,
>({
  payload,
  user,
  value,
  key,
}: {
  key: string
  payload: PayloadTestSDK<TConfig>
  user: TypedUser
  value: any
}): Promise<TGeneratedTypes['collections']['payload-preferences']> => {
  try {
    let prefs = await payload
      .find({
        collection: 'payload-preferences',
        depth: 0,
        limit: 1,
        where: {
          and: [
            { key: { equals: key } },
            { 'user.value': { equals: user.id } },
            { 'user.relationTo': { equals: user.collection } },
          ],
        },
      })
      ?.then((res) => res.docs?.[0])

    if (!prefs) {
      prefs = await payload.create({
        collection: 'payload-preferences',
        depth: 0,
        data: {
          key,
          user: {
            relationTo: user.collection,
            value: user.id,
          },
          value,
        },
      })
    } else {
      const newValue = typeof value === 'object' ? { ...(prefs?.value || {}), ...value } : value

      prefs = await payload.update({
        collection: 'payload-preferences',
        id: prefs.id,
        data: {
          key,
          user: {
            collection: user.collection,
            value: user.id,
          },
          value: newValue,
        },
      })

      if (prefs?.status >= 400) {
        throw new Error(prefs.data?.errors?.[0]?.message)
      }

      return prefs
    }
  } catch (e) {
    console.error('Error upserting prefs', e)
  }
}

export const deletePreferences = async <TConfig extends GeneratedTypes<any>>({
  payload,
  user,
  key,
}: {
  key: string
  payload: PayloadTestSDK<TConfig>
  user: User
}): Promise<void> => {
  try {
    await payload.delete({
      collection: 'payload-preferences',
      where: {
        and: [
          { key: { equals: key } },
          { 'user.value': { equals: user.id } },
          { 'user.relationTo': { equals: user.collection } },
        ],
      },
    })
  } catch (e) {
    console.error('Error deleting prefs', e)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: runAxeScan.ts]---
Location: payload-main/test/helpers/e2e/runAxeScan.ts

```typescript
import type { Page, TestInfo } from '@playwright/test'

import AxeBuilder from '@axe-core/playwright'

type AxeProps = {
  defaultExcludes?: boolean
  exclude?: string[]
  include?: string[]
  page: Page
  screenshotViolations?: boolean
  testInfo: TestInfo
}

/**
 * Runs an accessibility scan using Axe and attaches the results to the test.
 * Optionally screenshots each violating element for visual debugging.
 *
 * @param page - Playwright page object
 * @param testInfo - Playwright test info object
 * @param screenshotViolations - Whether to screenshot each violating element (default: true)
 * @returns Promise<AxeResults> - The scan results including violations
 *
 * @example
 * ```typescript
 * test('should be accessible', async ({ page }, testInfo) => {
 *   await page.goto(url.create)
 *   const results = await runAxeScan({ page, testInfo })
 *   expect(results.violations.length).toBe(0)
 * })
 *
 * // Disable screenshots for faster tests
 * const results = await runAxeScan({ page, testInfo, screenshotViolations: false })
 * ```
 */
export async function runAxeScan({
  page,
  testInfo,
  defaultExcludes = true,
  include,
  exclude,
  screenshotViolations = true,
}: AxeProps) {
  const axeBuilder = new AxeBuilder({ page })

  axeBuilder.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])

  if (defaultExcludes) {
    axeBuilder.exclude('.template-default > .nav')
    axeBuilder.exclude('.app-header')
  }

  if (include) {
    include.forEach((selector) => {
      axeBuilder.include(selector)
    })
  }

  if (exclude) {
    exclude.forEach((selector) => {
      axeBuilder.exclude(selector)
    })
  }

  const scanResults = await axeBuilder.analyze()

  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(scanResults, null, 2),
    contentType: 'application/json',
  })

  await testInfo.attach('accessibility-scan-results-violations', {
    body: JSON.stringify(scanResults.violations, null, 2),
    contentType: 'application/json',
  })

  // Screenshot each violating element
  if (screenshotViolations && scanResults.violations.length > 0) {
    const screenshotPromises: Promise<void>[] = []

    scanResults.violations.forEach((violation, violationIdx) => {
      violation.nodes.forEach((node, nodeIdx) => {
        const selector = node.target.join(' ')

        // Create a promise for each screenshot
        const screenshotPromise = (async () => {
          try {
            const element = page.locator(selector).first()

            // Check if element exists and is visible
            const isVisible = await element.isVisible().catch(() => false)

            if (isVisible) {
              const screenshot = await element.screenshot({ timeout: 5000 })

              // Create a descriptive filename
              const filename = `axe-violation-${violation.id}-${violationIdx + 1}-${nodeIdx + 1}`

              await testInfo.attach(filename, {
                body: screenshot,
                contentType: 'image/png',
              })
            }
          } catch (error) {
            // Silently fail if screenshot cannot be taken
            // This can happen with elements that are off-screen, too small, etc.
            console.warn(
              `Could not screenshot element for ${violation.id} (${selector}):`,
              error instanceof Error ? error.message : error,
            )
          }
        })()

        screenshotPromises.push(screenshotPromise)
      })
    })

    // Wait for all screenshots to complete
    await Promise.all(screenshotPromises)
  }

  return scanResults
}
```

--------------------------------------------------------------------------------

---[FILE: scrollEntirePage.ts]---
Location: payload-main/test/helpers/e2e/scrollEntirePage.ts

```typescript
import type { Page } from '@playwright/test'

import { waitForPageStability } from './waitForPageStability.js'

/**
 * Scroll to bottom of the page continuously until no new content is loaded.
 * This is needed because we conditionally render fields as they enter the viewport.
 * This will ensure that all fields are rendered and fully loaded before we start testing.
 * Without this step, Playwright's `locator.scrollIntoView()` might not work as expected.
 * @param page - Playwright page object
 * @returns Promise<void>
 */
export const scrollEntirePage = async (page: Page) => {
  let previousHeight = await page.evaluate(() => document.body.scrollHeight)

  while (true) {
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    })

    // Wait for the page to stabilize after scrolling
    await waitForPageStability({ page })

    // Get the new page height after stability check
    const newHeight = await page.evaluate(() => document.body.scrollHeight)

    // Stop if the height hasn't changed, meaning no new content was loaded
    if (newHeight === previousHeight) {
      break
    }

    previousHeight = newHeight
  }
}
```

--------------------------------------------------------------------------------

---[FILE: selectInput.ts]---
Location: payload-main/test/helpers/e2e/selectInput.ts

```typescript
import type { Locator } from '@playwright/test'

import { exactText } from '../../helpers.js'

type SelectReactOptionsParams = {
  filter?: string // Optional filter text to narrow down options
  selectLocator: Locator // Locator for the react-select component
  selectType?: 'relationship' | 'select'
} & (
  | {
      clear?: boolean // Whether to clear the selection before selecting new options
      multiSelect: true // Multi-selection mode
      option?: never
      options: string[] // Array of visible labels to select
    }
  | {
      clear?: never
      multiSelect: false | undefined // Single selection mode
      option: string // Single visible label to select
      options?: never
    }
)

const selectors = {
  hasMany: {
    relationship: '.relationship--multi-value-label__text',
    select: '.multi-value-label__text',
  },
  hasOne: {
    relationship: '.relationship--single-value__text',
    select: '.react-select--single-value',
  },
}

export async function selectInput({
  selectLocator,
  options,
  option,
  multiSelect = true,
  clear = true,
  filter,
  selectType = 'select',
}: SelectReactOptionsParams) {
  if (filter) {
    // Open the select menu to access the input field
    await openSelectMenu({ selectLocator })

    // Type the filter text into the input field
    const inputLocator = selectLocator.locator('.rs__input[type="text"]')
    await inputLocator.fill(filter)
  }

  if (multiSelect && options) {
    if (clear) {
      await clearSelectInput({
        selectLocator,
      })
    }

    for (const optionText of options) {
      // Check if the option is already selected
      const alreadySelected = await selectLocator
        .locator(selectors.hasMany[selectType], {
          hasText: optionText,
        })
        .count()

      if (alreadySelected === 0) {
        await selectOption({
          selectLocator,
          optionText,
        })
      }
    }
  } else if (option) {
    // For single selection, ensure only one option is selected
    const alreadySelected = await selectLocator
      .locator(selectors.hasOne[selectType], {
        hasText: option,
      })
      .count()

    if (alreadySelected === 0) {
      await selectOption({
        selectLocator,
        optionText: option,
      })
    }
  }
}

export async function openSelectMenu({ selectLocator }: { selectLocator: Locator }): Promise<void> {
  if (await selectLocator.locator('.rs__menu').isHidden()) {
    // Open the react-select dropdown
    await selectLocator.locator('button.dropdown-indicator').click()
  }

  // Wait for the dropdown menu to appear
  const menu = selectLocator.locator('.rs__menu')
  await menu.waitFor({ state: 'visible', timeout: 2000 })
}

async function selectOption({
  selectLocator,
  optionText,
}: {
  optionText: string
  selectLocator: Locator
}) {
  await openSelectMenu({ selectLocator })

  // Find and click the desired option by visible text
  const optionLocator = selectLocator.locator('.rs__option', {
    hasText: exactText(optionText),
  })

  if (optionLocator) {
    await optionLocator.click()
  }
}

type GetSelectInputValueFunction = <TMultiSelect = true>(args: {
  multiSelect: TMultiSelect
  selectLocator: Locator
  selectType?: 'relationship' | 'select'
  valueLabelClass?: string
}) => Promise<TMultiSelect extends true ? string[] : string | undefined>

export const getSelectInputValue: GetSelectInputValueFunction = async ({
  selectLocator,
  multiSelect = false,
  selectType = 'select',
}) => {
  if (multiSelect) {
    // For multi-select, get all selected options
    const selectedOptions = await selectLocator
      .locator(selectors.hasMany[selectType])
      .allTextContents()
    return selectedOptions || []
  }

  // For single-select, get the selected value
  const singleValue = await selectLocator.locator(selectors.hasOne[selectType]).textContent()
  return (singleValue ?? undefined) as any
}

export const getSelectInputOptions = async ({
  selectLocator,
}: {
  selectLocator: Locator
}): Promise<string[]> => {
  await openSelectMenu({ selectLocator })
  const options = await selectLocator.locator('.rs__option').allTextContents()
  return options.map((option) => option.trim()).filter(Boolean)
}

export async function clearSelectInput({ selectLocator }: { selectLocator: Locator }) {
  // Clear the selection if clear is true
  const clearButton = selectLocator.locator('.clear-indicator')
  if (await clearButton.isVisible()) {
    const clearButtonCount = await clearButton.count()
    if (clearButtonCount > 0) {
      await clearButton.click()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: toggleCollapsible.ts]---
Location: payload-main/test/helpers/e2e/toggleCollapsible.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * Works for all collapsible field types, including `collapsible`, `array`, and `blocks`.
 * For arrays and blocks, use the `toggleBlockOrArrayRow` helper instead. It will call this function internally.
 */
export const toggleCollapsible = async ({
  toggler,
  targetState: targetStateFromArgs,
}: {
  targetState?: 'collapsed' | 'open'
  toggler: Locator
}) => {
  const isCollapsedBeforeClick = await toggler.evaluate((el) =>
    el.classList.contains('collapsible__toggle--collapsed'),
  )

  const targetState =
    targetStateFromArgs !== undefined
      ? targetStateFromArgs
      : isCollapsedBeforeClick
        ? 'open'
        : 'collapsed'

  const requiresToggle =
    (isCollapsedBeforeClick && targetState === 'open') ||
    (!isCollapsedBeforeClick && targetState === 'collapsed')

  if (requiresToggle) {
    await toggler.click()
  }

  if (targetState === 'collapsed') {
    await expect(toggler).not.toHaveClass(/collapsible__toggle--open/)
    await expect(toggler).toHaveClass(/collapsible__toggle--collapsed/)
  } else {
    await expect(toggler).toHaveClass(/collapsible__toggle--open/)
    await expect(toggler).not.toHaveClass(/collapsible__toggle--collapsed/)
  }
}

export const toggleBlockOrArrayRow = async ({
  page,
  rowIndex,
  fieldName,
  targetState: targetStateFromArgs,
}: {
  fieldName: string
  page: Page
  rowIndex: number
  targetState?: 'collapsed' | 'open'
}) => {
  const row = page.locator(`#${fieldName}-row-${rowIndex}`)

  const toggler = row.locator('button.collapsible__toggle')

  await toggleCollapsible({ toggler, targetState: targetStateFromArgs })
}
```

--------------------------------------------------------------------------------

---[FILE: toggleDocDrawer.ts]---
Location: payload-main/test/helpers/e2e/toggleDocDrawer.ts

```typescript
import type { Page } from '@playwright/test'

import { wait } from 'payload/shared'

export async function openDocDrawer({
  page,
  selector,
  withMetaKey = false,
}: {
  page: Page
  selector: string
  withMetaKey?: boolean
}): Promise<void> {
  let clickProperties = {}
  if (withMetaKey) {
    clickProperties = { modifiers: ['ControlOrMeta'] }
  }
  await wait(500) // wait for parent form state to initialize
  await page.locator(selector).click(clickProperties)
  await wait(500) // wait for drawer form state to initialize
}
```

--------------------------------------------------------------------------------

---[FILE: toggleListDrawer.ts]---
Location: payload-main/test/helpers/e2e/toggleListDrawer.ts

```typescript
import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * Closes the list drawer by clicking the close button in the header.
 */
export const closeListDrawer = async ({
  page,
  drawerSelector = '[id^=list-drawer_1_]',
}: {
  drawerSelector?: string
  page: Page
}): Promise<any> => {
  await page.locator('[id^=list-drawer_1_] .list-drawer__header .close-modal-button').click()
  await expect(page.locator(drawerSelector)).not.toBeVisible()
}
```

--------------------------------------------------------------------------------

---[FILE: toggleListMenu.ts]---
Location: payload-main/test/helpers/e2e/toggleListMenu.ts

```typescript
import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { exactText } from 'helpers.js'

export async function openListMenu({ page }: { page: Page }) {
  const listMenu = page.locator('#list-menu')
  await listMenu.locator('button.popup-button').click()
  await expect(listMenu.locator('.popup__content')).toBeVisible()
}

export async function clickListMenuItem({
  page,
  menuItemLabel,
}: {
  menuItemLabel: string
  page: Page
}) {
  const menuItem = page.locator('.popup__content').locator('button', {
    hasText: exactText(menuItemLabel),
  })

  await menuItem.click()
}
```

--------------------------------------------------------------------------------

---[FILE: toggleNav.ts]---
Location: payload-main/test/helpers/e2e/toggleNav.ts

```typescript
import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'

export async function openNav(page: Page): Promise<{ nav: ReturnType<Page['locator']> }> {
  // wait for the preferences/media queries to either open or close the nav
  await expect(page.locator('.template-default--nav-hydrated')).toBeVisible()

  // close all open modals
  const dialogs = await page.locator('dialog[open]').elementHandles()

  for (let i = 0; i < dialogs.length; i++) {
    await page.keyboard.press('Escape')
  }

  // check to see if the nav is already open and if not, open it
  // use the `--nav-open` modifier class to check if the nav is open
  // this will prevent clicking nav links that are bleeding off the screen
  const nav = page.locator('.template-default.template-default--nav-open')

  if (await nav.isVisible()) {
    return {
      nav,
    }
  }

  // playwright: get first element with .nav-toggler which is VISIBLE (not hidden), could be 2 elements with .nav-toggler on mobile and desktop but only one is visible
  await page.locator('.nav-toggler >> visible=true').click()
  await expect(page.locator('.nav--nav-animate[inert], .nav--nav-hydrated[inert]')).toBeHidden()
  await expect(page.locator('.template-default.template-default--nav-open')).toBeVisible()

  return {
    nav,
  }
}

export async function closeNav(page: Page): Promise<void> {
  // wait for the preferences/media queries to either open or close the nav
  await expect(page.locator('.template-default--nav-hydrated')).toBeVisible()

  // check to see if the nav is already closed and if so, return early
  if (!(await page.locator('.template-default.template-default--nav-open').isVisible())) {
    return
  }

  // playwright: get first element with .nav-toggler which is VISIBLE (not hidden), could be 2 elements with .nav-toggler on mobile and desktop but only one is visible
  await page.locator('.nav-toggler >> visible=true').click()
  await expect(page.locator('.template-default.template-default--nav-open')).toBeHidden()
}
```

--------------------------------------------------------------------------------

---[FILE: waitForAutoSaveToRunAndComplete.ts]---
Location: payload-main/test/helpers/e2e/waitForAutoSaveToRunAndComplete.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { wait } from 'payload/shared'
import { POLL_TOPASS_TIMEOUT } from 'playwright.config.js'

export async function waitForAutoSaveToRunAndComplete(
  page: Locator | Page,
  expectation: 'error' | 'success' = 'success',
) {
  await expect(async () => {
    await expect(page.locator('.autosave:has-text("Saving...")')).toBeVisible()
  }).toPass({
    timeout: POLL_TOPASS_TIMEOUT,
    intervals: [50],
  })

  await wait(500)

  if (expectation === 'success') {
    await expect(async () => {
      await expect(
        page.locator('.autosave:has-text("Last saved less than a minute ago")'),
      ).toBeVisible()
    }).toPass({
      timeout: POLL_TOPASS_TIMEOUT,
    })
  } else {
    await expect(async () => {
      await expect(page.locator('.payload-toast-container .toast-error')).toBeVisible()
    }).toPass({
      timeout: POLL_TOPASS_TIMEOUT,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: waitForPageStability.ts]---
Location: payload-main/test/helpers/e2e/waitForPageStability.ts

```typescript
import type { Page } from '@playwright/test'

/**
 * Checks if the page is stable by continually polling until the page size remains constant in size and there are no loading shimmers.
 * A page is considered stable if it passes this test multiple times.
 * This will ensure that the page won't unexpectedly change while testing.
 * @param page - Playwright page object
 * @param intervalMs - Polling interval in milliseconds
 * @param stableChecksRequired - Number of stable checks required to consider page stable
 * @returns Promise<void>
 */
export const waitForPageStability = async ({
  page,
  interval = 1000,
  stableChecksRequired = 3,
}: {
  interval?: number
  page: Page
  stableChecksRequired?: number
}) => {
  await page.waitForLoadState('networkidle') // Wait for network to be idle

  await page.waitForFunction(
    async ({ interval, stableChecksRequired }) => {
      return new Promise((resolve) => {
        let previousHeight = document.body.scrollHeight
        let stableChecks = 0

        const checkStability = () => {
          const currentHeight = document.body.scrollHeight
          const loadingShimmers = document.querySelectorAll('.shimmer-effect')
          const pageSizeChanged = currentHeight !== previousHeight

          if (!pageSizeChanged && loadingShimmers.length === 0) {
            stableChecks++ // Increment stability count
          } else {
            stableChecks = 0 // Reset stability count if page changes
          }

          previousHeight = currentHeight

          if (stableChecks >= stableChecksRequired) {
            resolve(true) // Only resolve after multiple stable checks
          } else {
            setTimeout(checkStability, interval) // Poll again
          }
        }

        checkStability()
      })
    },
    { interval, stableChecksRequired },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: login.ts]---
Location: payload-main/test/helpers/e2e/auth/login.ts

```typescript
import type { AdminRoutes } from 'helpers.js'
import type { Config } from 'payload'
import type { Page } from 'playwright/test'

import { devUser } from 'credentials.js'
import { getRoutes } from 'helpers.js'
import { formatAdminURL, wait } from 'payload/shared'
import { POLL_TOPASS_TIMEOUT } from 'playwright.config.js'
import { expect } from 'playwright/test'

import { openNav } from '../toggleNav.js'

type LoginArgs = {
  customAdminRoutes?: AdminRoutes
  customRoutes?: Config['routes']
  data?: {
    email: string
    password: string
  }
  page: Page
  serverURL: string
}

export async function login(args: LoginArgs): Promise<void> {
  const { customAdminRoutes, customRoutes, data = devUser, page, serverURL } = args

  const {
    admin: {
      routes: { createFirstUser, login: incomingLoginRoute, logout: incomingLogoutRoute } = {},
    },
    routes: { admin: incomingAdminRoute } = {},
  } = getRoutes({ customAdminRoutes, customRoutes })

  const logoutRoute = formatAdminURL({
    serverURL,
    adminRoute: incomingAdminRoute,
    path: incomingLogoutRoute,
  })

  await page.goto(logoutRoute)
  await wait(500)

  const adminRoute = formatAdminURL({ serverURL, adminRoute: incomingAdminRoute, path: '' })
  const loginRoute = formatAdminURL({
    serverURL,
    adminRoute: incomingAdminRoute,
    path: incomingLoginRoute,
  })
  const createFirstUserRoute = formatAdminURL({
    serverURL,
    adminRoute: incomingAdminRoute,
    path: createFirstUser,
  })

  await page.goto(loginRoute)
  await wait(500)
  await page.fill('#field-email', data.email)
  await page.fill('#field-password', data.password)
  await wait(500)
  await page.click('[type=submit]')
  await page.waitForURL(adminRoute)

  await expect(() => expect(page.url()).not.toContain(loginRoute)).toPass({
    timeout: POLL_TOPASS_TIMEOUT,
  })

  await expect(() => expect(page.url()).not.toContain(createFirstUserRoute)).toPass({
    timeout: POLL_TOPASS_TIMEOUT,
  })
}

/**
 * Logs a user in by navigating via click-ops instead of using page.goto()
 */
export async function loginClientSide(args: LoginArgs): Promise<void> {
  const { customAdminRoutes, customRoutes, data = devUser, page, serverURL } = args
  const {
    routes: { admin: incomingAdminRoute } = {},
    admin: { routes: { login: incomingLoginRoute, createFirstUser } = {} },
  } = getRoutes({ customAdminRoutes, customRoutes })

  const adminRoute = formatAdminURL({ serverURL, adminRoute: incomingAdminRoute, path: '' })
  const loginRoute = formatAdminURL({
    serverURL,
    adminRoute: incomingAdminRoute,
    path: incomingLoginRoute,
  })
  const createFirstUserRoute = formatAdminURL({
    serverURL,
    adminRoute: incomingAdminRoute,
    path: createFirstUser,
  })

  if ((await page.locator('#nav-toggler').count()) > 0) {
    // a user is already logged in - log them out
    await openNav(page)
    await expect(page.locator('.nav__controls [aria-label="Log out"]')).toBeVisible()
    await page.locator('.nav__controls [aria-label="Log out"]').click()

    if (await page.locator('dialog#leave-without-saving').isVisible()) {
      await page.locator('dialog#leave-without-saving #confirm-action').click()
    }

    await page.waitForURL(loginRoute)
  }

  await wait(500)
  await page.fill('#field-email', data.email)
  await page.fill('#field-password', data.password)
  await wait(500)
  await page.click('[type=submit]')

  await expect(page.locator('.step-nav__home')).toBeVisible()
  if ((await page.locator('a.step-nav__home').count()) > 0) {
    await page.locator('a.step-nav__home').click()
  }

  await page.waitForURL(adminRoute)

  await expect(() => expect(page.url()).not.toContain(loginRoute)).toPass({
    timeout: POLL_TOPASS_TIMEOUT,
  })
  await expect(() => expect(page.url()).not.toContain(createFirstUserRoute)).toPass({
    timeout: POLL_TOPASS_TIMEOUT,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: logout.ts]---
Location: payload-main/test/helpers/e2e/auth/logout.ts

```typescript
import type { Page } from 'playwright'

import { POLL_TOPASS_TIMEOUT } from 'playwright.config.js'
import { expect } from 'playwright/test'

import { openNav } from '../toggleNav.js'

export const logout = async (page: Page, serverURL: string) => {
  await page.goto(`${serverURL}/admin/logout`)

  await expect.poll(() => page.url(), { timeout: POLL_TOPASS_TIMEOUT }).toContain('/admin/login')

  await expect(page.locator('.login')).toBeVisible()
}

export const logoutViaNav = async (page: Page) => {
  const { nav } = await openNav(page)
  const logoutAnchor = nav.locator('a[title="Log out"]')
  await expect(logoutAnchor).toBeVisible()
  await logoutAnchor.click()

  await expect.poll(() => page.url(), { timeout: POLL_TOPASS_TIMEOUT }).toContain('/admin/login')

  await expect(page.locator('.login')).toBeVisible()
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/helpers/e2e/columns/index.ts

```typescript
export { openListColumns } from './openListColumns.js'
export { reorderColumns } from './reorderColumns.js'
export { sortColumn } from './sortColumn.js'
export { toggleColumn } from './toggleColumn.js'
export { waitForColumnInURL } from './waitForColumnsInURL.js'
```

--------------------------------------------------------------------------------

---[FILE: openListColumns.ts]---
Location: payload-main/test/helpers/e2e/columns/openListColumns.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

export const openListColumns = async (
  page: Page,
  {
    togglerSelector = '.list-controls__toggle-columns',
    columnContainerSelector = '.list-controls__columns',
  }: {
    columnContainerSelector?: string
    togglerSelector?: string
  },
): Promise<{
  columnContainer: Locator
}> => {
  const columnContainer = page.locator(columnContainerSelector).first()

  const isAlreadyOpen = await columnContainer.isVisible()

  if (!isAlreadyOpen) {
    await page.locator(togglerSelector).first().click()
  }

  await expect(page.locator(`${columnContainerSelector}.rah-static--height-auto`)).toBeVisible()

  return { columnContainer }
}
```

--------------------------------------------------------------------------------

---[FILE: reorderColumns.ts]---
Location: payload-main/test/helpers/e2e/columns/reorderColumns.ts

```typescript
import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { wait } from 'payload/shared'

import { exactText } from '../../../helpers.js'

export const reorderColumns = async (
  page: Page,
  {
    togglerSelector = '.list-controls__toggle-columns',
    columnContainerSelector = '.list-controls__columns',
    fromColumn = 'Number',
    toColumn = 'ID',
  }: {
    columnContainerSelector?: string
    fromColumn: string
    toColumn: string
    togglerSelector?: string
  },
) => {
  const columnContainer = page.locator(columnContainerSelector).first()
  const isAlreadyOpen = await columnContainer.isVisible()

  if (!isAlreadyOpen) {
    await page.locator(togglerSelector).first().click()
  }

  await expect(page.locator(`${columnContainerSelector}.rah-static--height-auto`)).toBeVisible()

  const fromBoundingBox = await columnContainer
    .locator(`.pill-selector .pill-selector__pill`, {
      hasText: exactText(fromColumn),
    })
    .boundingBox()

  const toBoundingBox = await columnContainer
    .locator(`.pill-selector .pill-selector__pill`, {
      hasText: exactText(toColumn),
    })
    .boundingBox()

  if (!fromBoundingBox || !toBoundingBox) {
    return
  }

  // drag the "from" column to the left of the "to" column
  await page.mouse.move(fromBoundingBox.x + 2, fromBoundingBox.y + 2, { steps: 10 })
  await page.mouse.down()
  await wait(300)
  await page.mouse.move(toBoundingBox.x - 2, toBoundingBox.y - 2, { steps: 10 })
  await page.mouse.up()

  await expect(columnContainer.locator('.pill-selector .pill-selector__pill').first()).toHaveText(
    fromColumn,
  )

  await expect(page.locator('table thead tr th').nth(1).first()).toHaveText(fromColumn)
  // TODO: This wait makes sure the preferences are actually saved. Just waiting for the UI to update is not enough. We should replace this wait
  await wait(1000)
}
```

--------------------------------------------------------------------------------

---[FILE: sortColumn.ts]---
Location: payload-main/test/helpers/e2e/columns/sortColumn.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

/**
 * Sort by columns within the list view.
 * Will search for that field's heading in the selector, and click the appropriate sort button.
 */
export const sortColumn = async (
  page: Page,
  options: {
    fieldPath: string
    /**
     * Scope the sorting to a specific DOM tree.
     * If not provided, will search the whole page for the column heading.
     */
    scope?: Locator
    targetState: 'asc' | 'desc'
  },
) => {
  const pathAsClassName = options.fieldPath.replace(/\./g, '__')
  const columnHeading = (options.scope || page).locator(`#heading-${pathAsClassName}`)

  const upChevron = columnHeading.locator('button.sort-column__asc')
  const downChevron = columnHeading.locator('button.sort-column__desc')

  if (options.targetState === 'asc') {
    await upChevron.click()
    await expect(columnHeading.locator('button.sort-column__asc.sort-column--active')).toBeVisible()
    await page.waitForURL(() => page.url().includes(`sort=${options.fieldPath}`))
  } else if (options.targetState === 'desc') {
    await downChevron.click()
    await expect(
      columnHeading.locator('button.sort-column__desc.sort-column--active'),
    ).toBeVisible()
    await page.waitForURL(() => page.url().includes(`sort=-${options.fieldPath}`))
  }
}
```

--------------------------------------------------------------------------------

---[FILE: toggleColumn.ts]---
Location: payload-main/test/helpers/e2e/columns/toggleColumn.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect } from '@playwright/test'

import { exactText } from '../../../helpers.js'
import { openListColumns } from './openListColumns.js'
import { waitForColumnInURL } from './waitForColumnsInURL.js'

export const toggleColumn = async (
  page: Page,
  {
    togglerSelector,
    columnContainerSelector,
    columnLabel,
    targetState: targetStateFromArgs,
    columnName,
    expectURLChange = true,
  }: {
    columnContainerSelector?: string
    columnLabel: string
    columnName?: string
    expectURLChange?: boolean
    targetState?: 'off' | 'on'
    togglerSelector?: string
  },
): Promise<{
  columnContainer: Locator
}> => {
  const { columnContainer } = await openListColumns(page, {
    togglerSelector,
    columnContainerSelector,
  })

  const column = columnContainer.locator(`.pill-selector .pill-selector__pill`, {
    hasText: exactText(columnLabel),
  })

  const isActiveBeforeClick = await column.evaluate((el) =>
    el.classList.contains('pill-selector__pill--selected'),
  )

  const targetState =
    targetStateFromArgs !== undefined ? targetStateFromArgs : isActiveBeforeClick ? 'off' : 'on'

  await expect(column).toBeVisible()

  const requiresToggle =
    (isActiveBeforeClick && targetState === 'off') || (!isActiveBeforeClick && targetState === 'on')

  if (requiresToggle) {
    await column.click()
  }

  if (targetState === 'off') {
    // no class
    await expect(column).not.toHaveClass(/pill-selector__pill--selected/)
  } else {
    // has class
    await expect(column).toHaveClass(/pill-selector__pill--selected/)
  }

  if (expectURLChange && columnName && requiresToggle) {
    await waitForColumnInURL({ page, columnName, state: targetState })
  }

  return { columnContainer }
}
```

--------------------------------------------------------------------------------

---[FILE: waitForColumnsInURL.ts]---
Location: payload-main/test/helpers/e2e/columns/waitForColumnsInURL.ts

```typescript
import type { Page } from 'playwright'

export const waitForColumnInURL = async ({
  page,
  columnName,
  state,
}: {
  columnName: string
  page: Page
  state: 'off' | 'on'
}): Promise<void> => {
  await page.waitForURL(/.*\?.*/)

  const identifier = `${state === 'off' ? '-' : ''}${columnName}`

  // Test that the identifier is in the URL
  // It must appear in the `columns` query parameter, i.e. after `columns=...` and before the next `&`
  // It must also appear in it entirety to prevent partially matching other values, i.e. between quotation marks
  const regex = new RegExp(`columns=([^&]*${encodeURIComponent(`"${identifier}"`)}[^&]*)`)

  await page.waitForURL(regex)
}
```

--------------------------------------------------------------------------------

---[FILE: addArrayRow.ts]---
Location: payload-main/test/helpers/e2e/fields/array/addArrayRow.ts

```typescript
import type { Locator, Page } from 'playwright'

import { wait } from 'payload/shared'
import { expect } from 'playwright/test'

import { openArrayRowActions } from './openArrayRowActions.js'

/**
 * Does not wait after adding the row for the row to appear and fully load in. Simply clicks the primary "Add Row" button and moves on.
 */
export const addArrayRowAsync = async (page: Page, fieldName: string) => {
  await page.locator(`#field-${fieldName} > .array-field__add-row`).first().click()
}

/**
 * Adds an array row to the end of the array using the primary "Add Row" button.
 */
export const addArrayRow = async (
  page: Page,
  { fieldName }: Omit<Parameters<typeof openArrayRowActions>[1], 'rowIndex'>,
) => {
  const rowLocator = page.locator(`#field-${fieldName} .array-field__row`)
  const numberOfPrevRows = await rowLocator.count()

  await addArrayRowAsync(page, fieldName)

  expect(await rowLocator.count()).toBe(numberOfPrevRows + 1)
}

/**
 * Like `addArrayRow`, but inserts the row at the specified index using the row actions menu.
 */
export const addArrayRowBelow = async (
  page: Page,
  { fieldName, rowIndex = 0 }: Parameters<typeof openArrayRowActions>[1],
): Promise<{ popupContentLocator: Locator; rowActionsButtonLocator: Locator }> => {
  const rowLocator = page.locator(`#field-${fieldName} .array-field__row`)
  const numberOfPrevRows = await rowLocator.count()

  const { popupContentLocator, rowActionsButtonLocator } = await openArrayRowActions(page, {
    fieldName,
    rowIndex,
  })

  await popupContentLocator.locator('.array-actions__action.array-actions__add').click()

  await expect(rowLocator).toHaveCount(numberOfPrevRows + 1)

  // TODO: test the array row has appeared in the _correct position_ (immediately below the original row)
  await wait(300)

  return { popupContentLocator, rowActionsButtonLocator }
}
```

--------------------------------------------------------------------------------

---[FILE: duplicateArrayRow.ts]---
Location: payload-main/test/helpers/e2e/fields/array/duplicateArrayRow.ts

```typescript
import type { Locator, Page } from 'playwright'

import { expect } from 'playwright/test'

import { openArrayRowActions } from './openArrayRowActions.js'

/**
 * Duplicates the array row at the specified index.
 */
export const duplicateArrayRow = async (
  page: Page,
  { fieldName, rowIndex = 0 }: Parameters<typeof openArrayRowActions>[1],
): Promise<{
  popupContentLocator: Locator
  rowActionsButtonLocator: Locator
}> => {
  const rowLocator = page.locator(`#field-${fieldName} > .array-field__draggable-rows > *`)

  const numberOfPrevRows = await rowLocator.count()

  const { popupContentLocator, rowActionsButtonLocator } = await openArrayRowActions(page, {
    fieldName,
    rowIndex,
  })

  await popupContentLocator.locator('.array-actions__action.array-actions__duplicate').click()

  expect(await rowLocator.count()).toBe(numberOfPrevRows + 1)

  // TODO: test the array row's field input values have been duplicated as well

  return { popupContentLocator, rowActionsButtonLocator }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/helpers/e2e/fields/array/index.ts

```typescript
export { addArrayRow, addArrayRowAsync, addArrayRowBelow } from './addArrayRow.js'
export { duplicateArrayRow } from './duplicateArrayRow.js'
export { openArrayRowActions } from './openArrayRowActions.js'
export { removeArrayRow } from './removeArrayRow.js'
```

--------------------------------------------------------------------------------

---[FILE: openArrayRowActions.ts]---
Location: payload-main/test/helpers/e2e/fields/array/openArrayRowActions.ts

```typescript
import type { Locator, Page } from 'playwright'

import { expect } from 'playwright/test'

/**
 * Opens the row actions menu for the specified array row.
 * If already open, does nothing.
 */
export const openArrayRowActions = async (
  page: Page,
  {
    fieldName,
    rowIndex = 0,
  }: {
    fieldName: string
    rowIndex?: number
  },
): Promise<{
  popupContentLocator: Locator
  rowActionsButtonLocator: Locator
}> => {
  // replace double underscores with single hyphens for the row ID
  const formattedRowID = fieldName.toString().replace(/__/g, '-')

  const rowActions = page
    .locator(`#field-${fieldName} #${formattedRowID}-row-${rowIndex} .array-actions`)
    .first()

  const popupContentLocator = page.locator('.popup__content')

  if (await popupContentLocator.isVisible()) {
    throw new Error(`Row actions for field "${fieldName}" at index ${rowIndex} are already open.`)
  }

  const rowActionsButtonLocator = rowActions.locator(`.array-actions__button`)

  await rowActionsButtonLocator.click()

  await expect(popupContentLocator).toBeVisible()

  return {
    rowActionsButtonLocator,
    popupContentLocator,
  }
}
```

--------------------------------------------------------------------------------

````
