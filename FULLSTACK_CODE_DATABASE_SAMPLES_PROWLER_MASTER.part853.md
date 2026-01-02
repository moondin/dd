---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 853
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 853 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: auth-refresh-token.spec.ts]---
Location: prowler-master/ui/tests/auth-refresh-token.spec.ts

```typescript
import { test, expect } from "@playwright/test";
import {
  goToLogin,
  login,
  verifySuccessfulLogin,
  getSession,
  verifySessionValid,
  TEST_CREDENTIALS,
  URLS,
} from "./helpers";

test.describe("Token Refresh Flow", () => {
  test("should refresh access token when expired", async ({ page }) => {
    // Login first
    await goToLogin(page);
    await login(page, TEST_CREDENTIALS.VALID);
    await verifySuccessfulLogin(page);

    // Get initial session using helper
    const initialSession = await verifySessionValid(page);
    const initialAccessToken = initialSession.accessToken;

    // Wait for some time to allow token to potentially expire
    // In a real scenario, you might want to manipulate the token expiry
    await page.waitForTimeout(2000);

    // Make a request that requires authentication
    // This should trigger token refresh if needed
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify we're still authenticated
    await expect(page).toHaveURL(URLS.DASHBOARD);

    // Get session after potential refresh using helper
    const refreshedSession = await verifySessionValid(page);

    // User data should be maintained
    expect(refreshedSession.user.email).toBe(initialSession.user.email);
    expect(refreshedSession.userId).toBe(initialSession.userId);
    expect(refreshedSession.tenantId).toBe(initialSession.tenantId);
  });

  test("should handle concurrent requests with token refresh", async ({
    page,
  }) => {
    // Login
    await goToLogin(page);
    await login(page, TEST_CREDENTIALS.VALID);
    await verifySuccessfulLogin(page);

    // Make multiple concurrent requests to the API
    const requests = Array(5)
      .fill(null)
      .map(() => page.request.get("/api/auth/session"));

    const responses = await Promise.all(requests);

    // All requests should succeed - verify using helper
    for (const response of responses) {
      expect(response.ok()).toBeTruthy();
      const session = await response.json();

      // Validate session structure
      expect(session).toBeTruthy();
      expect(session.user).toBeTruthy();
      expect(session.accessToken).toBeTruthy();
      expect(session.refreshToken).toBeTruthy();
      expect(session.error).toBeUndefined();
    }
  });

  test("should preserve user permissions after token refresh", async ({
    page,
  }) => {
    // Login
    await goToLogin(page);
    await login(page, TEST_CREDENTIALS.VALID);
    await verifySuccessfulLogin(page);

    // Get initial session with permissions using helper
    const initialSession = await verifySessionValid(page);
    const initialPermissions = initialSession.user.permissions;

    // Reload page to potentially trigger token refresh
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Get session after reload using helper
    const refreshedSession = await verifySessionValid(page);

    // Permissions should be preserved
    expect(refreshedSession.user.permissions).toEqual(initialPermissions);

    // All user data should be preserved
    expect(refreshedSession.user.email).toBe(initialSession.user.email);
    expect(refreshedSession.user.name).toBe(initialSession.user.name);
    expect(refreshedSession.user.companyName).toBe(
      initialSession.user.companyName,
    );
  });

  test("should clear session when cookies are removed", async ({
    page,
    context,
  }) => {
    // Login
    await goToLogin(page);
    await login(page, TEST_CREDENTIALS.VALID);
    await verifySuccessfulLogin(page);

    // Verify session is valid using helper
    await verifySessionValid(page);

    // Clear all cookies to simulate complete session expiry
    await context.clearCookies();

    // Verify session is null after clearing cookies
    const expiredSession = await getSession(page);
    expect(expiredSession).toBeNull();

    // Note: Middleware redirect behavior is tested in auth-middleware-error.spec.ts
  });
});
```

--------------------------------------------------------------------------------

---[FILE: auth-session-error-message.spec.ts]---
Location: prowler-master/ui/tests/auth-session-error-message.spec.ts

```typescript
import { test, expect } from "@playwright/test";
import {
  goToLogin,
  login,
  verifySuccessfulLogin,
  TEST_CREDENTIALS,
  URLS,
} from "./helpers";

test.describe("Session Error Messages", () => {
  test("should show RefreshAccessTokenError message", async ({ page }) => {
    // Navigate to sign-in with RefreshAccessTokenError query param
    await page.goto("/sign-in?error=RefreshAccessTokenError");

    // Wait for toast notification
    await page.waitForTimeout(200);

    // Verify error toast appears
    const toast = page.locator('[role="status"], [role="alert"]').first();

    const isVisible = await toast.isVisible().catch(() => false);

    if (isVisible) {
      const text = await toast.textContent();
      expect(text).toContain("Session Expired");
      expect(text).toContain("Please sign in again");
    }

    // Verify sign-in form is displayed
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("should show MissingRefreshToken error message", async ({ page }) => {
    // Navigate to sign-in with MissingRefreshToken query param
    await page.goto("/sign-in?error=MissingRefreshToken");

    // Wait for toast notification
    await page.waitForTimeout(200);

    // Verify error toast appears
    const toast = page.locator('[role="status"], [role="alert"]').first();

    const isVisible = await toast.isVisible().catch(() => false);

    if (isVisible) {
      const text = await toast.textContent();
      expect(text).toContain("Session Error");
    }

    // Verify sign-in form is displayed
    await expect(page.getByLabel("Email")).toBeVisible();
  });

  test("should show generic error for unknown error types", async ({ page }) => {
    // Navigate to sign-in with unknown error type
    await page.goto("/sign-in?error=UnknownError");

    // Wait for toast notification
    await page.waitForTimeout(200);

    // Verify generic error toast appears
    const toast = page.locator('[role="status"], [role="alert"]').first();

    const isVisible = await toast.isVisible().catch(() => false);

    if (isVisible) {
      const text = await toast.textContent();
      expect(text).toContain("Authentication Error");
      expect(text).toContain("Please sign in again");
    }
  });

  test("should include callbackUrl in redirect", async ({
    page,
    context,
  }) => {
    // Login first
    await goToLogin(page);
    await login(page, TEST_CREDENTIALS.VALID);
    await verifySuccessfulLogin(page);

    // Navigate to a specific page
    await page.goto("/scans");
    await page.waitForLoadState("networkidle");

    // Clear cookies to simulate session expiry
    await context.clearCookies();

    // Try to navigate to a different protected route
    await page.goto("/providers");

    // Should be redirected to login with callbackUrl
    await expect(page).toHaveURL(/\/sign-in\?.*callbackUrl=/);

    // Verify callbackUrl contains the attempted route
    const url = new URL(page.url());
    const callbackUrl = url.searchParams.get("callbackUrl");
    expect(callbackUrl).toBe("/providers");
  });

});
```

--------------------------------------------------------------------------------

---[FILE: base-page.ts]---
Location: prowler-master/ui/tests/base-page.ts

```typescript
import { Page, Locator, expect } from "@playwright/test";

/**
 * Base page object class containing common functionality
 * that can be shared across all page objects
 */
export abstract class BasePage {
  readonly page: Page;

  // Common UI elements that appear on most pages
  readonly title: Locator;
  readonly loadingIndicator: Locator;
  readonly themeToggle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Common locators that most pages share
    this.title = page.locator("h1, h2, [role='heading']").first();
    this.loadingIndicator = page.getByRole("status", { name: "Loading" });
    this.themeToggle = page.getByRole("button", { name: "Toggle theme" });
  }

  // Common navigation methods
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async refresh(): Promise<void> {
    await this.page.reload();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  // Common verification methods
  async verifyPageTitle(expectedTitle: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async verifyLoadingState(): Promise<void> {
    await expect(this.loadingIndicator).toBeVisible();
  }

  async verifyNoLoadingState(): Promise<void> {
    await expect(this.loadingIndicator).not.toBeVisible();
  }

  // Common form interaction methods
  async clearInput(input: Locator): Promise<void> {
    await input.clear();
  }

  async fillInput(input: Locator, value: string): Promise<void> {
    await input.fill(value);
  }

  async clickButton(button: Locator): Promise<void> {
    await button.click();
  }

  // Common validation methods
  async verifyElementVisible(element: Locator): Promise<void> {
    await expect(element).toBeVisible();
  }

  async verifyElementNotVisible(element: Locator): Promise<void> {
    await expect(element).not.toBeVisible();
  }

  async verifyElementText(element: Locator, expectedText: string): Promise<void> {
    await expect(element).toHaveText(expectedText);
  }

  async verifyElementContainsText(element: Locator, expectedText: string): Promise<void> {
    await expect(element).toContainText(expectedText);
  }

  // Common accessibility methods
  async verifyKeyboardNavigation(elements: Locator[]): Promise<void> {
    for (const element of elements) {
      await this.page.keyboard.press("Tab");
      await expect(element).toBeFocused();
    }
  }

  async verifyAriaLabels(elements: { locator: Locator; expectedLabel: string }[]): Promise<void> {
    for (const { locator, expectedLabel } of elements) {
      await expect(locator).toHaveAttribute("aria-label", expectedLabel);
    }
  }

  // Common utility methods
  async getElementText(element: Locator): Promise<string> {
    return await element.textContent() || "";
  }

  async getElementValue(element: Locator): Promise<string> {
    return await element.inputValue();
  }

  async isElementVisible(element: Locator): Promise<boolean> {
    return await element.isVisible();
  }

  async isElementEnabled(element: Locator): Promise<boolean> {
    return await element.isEnabled();
  }

  // Common error handling methods
  async getFormErrors(): Promise<string[]> {
    const errorElements = await this.page.locator('[role="alert"], .error-message, [data-testid="error"]').all();
    const errors: string[] = [];

    for (const element of errorElements) {
      const text = await element.textContent();
      if (text) {
        errors.push(text.trim());
      }
    }

    return errors;
  }

  async verifyNoErrors(): Promise<void> {
    const errors = await this.getFormErrors();
    expect(errors).toHaveLength(0);
  }

  // Common wait methods
  async waitForElement(element: Locator, timeout: number = 5000): Promise<void> {
    
    await element.waitFor({ timeout });
  }

  async waitForElementToDisappear(element: Locator, timeout: number = 5000): Promise<void> {
    
    await element.waitFor({ state: "hidden", timeout });
  }

  async waitForUrl(expectedUrl: string | RegExp, timeout: number = 5000): Promise<void> {
    
    await this.page.waitForURL(expectedUrl, { timeout });
  }

  // Common screenshot methods
  async takeScreenshot(name: string): Promise<void> {
    
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  async takeElementScreenshot(element: Locator, name: string): Promise<void> {
    
    await element.screenshot({ path: `screenshots/${name}.png` });
  }
}
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: prowler-master/ui/tests/helpers.ts

```typescript
import { Locator, Page, expect } from "@playwright/test";
import { SignInPage, SignInCredentials } from "./sign-in/sign-in-page";
import { AWSProviderCredential, AWSProviderData, AWS_CREDENTIAL_OPTIONS, ProvidersPage } from "./providers/providers-page";
import { ScansPage } from "./scans/scans-page";

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  INVALID_EMAIL: "Please enter a valid email address.",
  PASSWORD_REQUIRED: "Password is required.",
} as const;

export const URLS = {
  LOGIN: "/sign-in",
  SIGNUP: "/sign-up",
  DASHBOARD: "/",
  PROFILE: "/profile",
} as const;

export const TEST_CREDENTIALS = {
  VALID: {
    email: process.env.E2E_USER || "e2e@prowler.com",
    password: process.env.E2E_PASSWORD || "Thisisapassword123@",
  },
  INVALID: {
    email: "invalid@example.com",
    password: "wrongPassword",
  },
  INVALID_EMAIL_FORMAT: {
    email: "invalid-email",
    password: "somepassword",
  },
} as const;

export async function goToLogin(page: Page) {
  await page.goto("/sign-in");
}

export async function goToSignUp(page: Page) {
  await page.goto("/sign-up");
}

export async function fillLoginForm(
  page: Page,
  email: string,
  password: string,
) {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
}

export async function submitLoginForm(page: Page) {
  await page.getByRole("button", { name: "Log in" }).click();
}

export async function login(
  page: Page,
  credentials: { email: string; password: string } = TEST_CREDENTIALS.VALID,
) {
  await fillLoginForm(page, credentials.email, credentials.password);
  await submitLoginForm(page);
}

export async function verifySuccessfulLogin(page: Page) {
  await expect(page).toHaveURL("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(
    page
      .getByLabel("Breadcrumbs")
      .getByRole("heading", { name: "Overview", exact: true }),
  ).toBeVisible();
}

export async function verifyLoginError(
  page: Page,
  errorMessage = "Invalid email or password",
) {
  // There may be multiple field-level errors with the same text; assert at least one is visible
  await expect(page.getByText(errorMessage).first()).toBeVisible();
  await expect(page).toHaveURL("/sign-in");
}

export async function toggleSamlMode(page: Page) {
  await page.getByText("Continue with SAML SSO").click();
}

export async function goBackFromSaml(page: Page) {
  await page.getByText("Back").click();
}

export async function verifySamlModeActive(page: Page) {
  await expect(page.getByText("Sign in with SAML SSO")).toBeVisible();
  await expect(page.getByLabel("Password")).not.toBeVisible();
  await expect(page.getByText("Back")).toBeVisible();
}

export async function verifyNormalModeActive(page: Page) {
  await expect(page.getByText("Sign in", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
}

export async function logout(page: Page) {
  const navbar = page.locator("header");
  await navbar.waitFor({ state: "visible" });
  await navbar.getByRole("button", { name: "Sign out" }).click();
}

export async function verifyLogoutSuccess(page: Page) {
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByText("Sign in", { exact: true })).toBeVisible();
}

export async function verifyLoadingState(page: Page) {
  const submitButton = page.getByRole("button", { name: "Log in" });
  await expect(submitButton).toHaveAttribute("aria-disabled", "true");
  await expect(page.getByText("Loading")).toBeVisible();
}

export async function verifyLoginFormElements(page: Page) {
  await expect(page).toHaveTitle(/Prowler/);
  await expect(page.locator('svg[width="300"]')).toBeVisible();

  // Verify form elements
  await expect(page.getByText("Sign in", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();

  // Verify OAuth buttons
  await expect(page.getByText("Continue with Google")).toBeVisible();
  await expect(page.getByText("Continue with Github")).toBeVisible();
  await expect(page.getByText("Continue with SAML SSO")).toBeVisible();

  // Verify navigation links
  await expect(page.getByText("Need to create an account?")).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
}

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState("networkidle");
}

export async function verifyDashboardRoute(page: Page) {
  await expect(page).toHaveURL("/");
}

export async function authenticateAndSaveState(
  page: Page,
  email: string,
  password: string,
  storagePath: string,
) {
  if (!email || !password) {
    throw new Error(
      "Email and password are required for authentication and save state",
    );
  }

  // Create SignInPage instance
  const signInPage = new SignInPage(page);
  const credentials: SignInCredentials = { email, password };

  // Perform authentication steps using Page Object Model
  await signInPage.goto();
  await signInPage.login(credentials);
  await signInPage.verifySuccessfulLogin();

  // Save authentication state
  await page.context().storageState({ path: storagePath });
}

/**
 * Generate a random base36 suffix of specified length
 * Used for creating unique test data to avoid conflicts
 */
export function makeSuffix(len: number): string {
  let s = "";
  while (s.length < len) {
    s += Math.random().toString(36).slice(2);
  }
  return s.slice(0, len);
}

export async function getSession(page: Page) {
  const response = await page.request.get("/api/auth/session");
  return response.json();
}

export async function verifySessionValid(page: Page) {
  const session = await getSession(page);
  expect(session).toBeTruthy();
  expect(session.user).toBeTruthy();
  expect(session.accessToken).toBeTruthy();
  expect(session.refreshToken).toBeTruthy();
  return session;
}


export async function addAWSProvider(
  page: Page,
  accountId: string,
  accessKey: string,
  secretKey: string,
): Promise<void> {
  // Prepare test data for AWS provider
  const awsProviderData: AWSProviderData = {
    accountId: accountId,
    alias: "Test E2E AWS Account - Credentials",
  };

  // Prepare static credentials
  const staticCredentials: AWSProviderCredential = {
    type: AWS_CREDENTIAL_OPTIONS.AWS_CREDENTIALS,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  };

  // Create providers page object
  const providersPage = new ProvidersPage(page);

  // Navigate to providers page
  await providersPage.goto();
  await providersPage.verifyPageLoaded();

  // Start adding new provider
  await providersPage.clickAddProvider();
  await providersPage.verifyConnectAccountPageLoaded();

  // Select AWS provider
  await providersPage.selectAWSProvider();

  // Fill provider details
  await providersPage.fillAWSProviderDetails(awsProviderData);
  await providersPage.clickNext();

  // Verify credentials page is loaded
  await providersPage.verifyCredentialsPageLoaded();

  // Select static credentials type
  await providersPage.selectCredentialsType(
    AWS_CREDENTIAL_OPTIONS.AWS_CREDENTIALS,
  );
  // Fill static credentials
  await providersPage.fillStaticCredentials(staticCredentials);
  await providersPage.clickNext();

  // Launch scan
  await providersPage.verifyLaunchScanPageLoaded();
  await providersPage.clickNext();

  // Wait for redirect to provider page
  const scansPage = new ScansPage(page);
  await scansPage.verifyPageLoaded();
}

export async function deleteProviderIfExists(page: ProvidersPage, providerUID: string): Promise<void> {
  // Delete the provider if it exists

  // Navigate to providers page
  await page.goto();
  await expect(page.providersTable).toBeVisible({ timeout: 10000 });

  // Find and use the search input to filter the table
  const searchInput = page.page.getByPlaceholder(/search|filter/i);

  await expect(searchInput).toBeVisible({ timeout: 5000 });

  // Clear and search for the specific provider
  await searchInput.clear();
  await searchInput.fill(providerUID);
  await searchInput.press("Enter");

  // Additional wait for React table to re-render with the server-filtered data
  // The filtering happens on the server, but the table component needs time
  // to process the response and update the DOM after network idle
  await page.page.waitForTimeout(1500);

  // Get all rows from the table
  const allRows = page.providersTable.locator("tbody tr");

  // Helper function to check if a row is the "No results" row
  const isNoResultsRow = async (row: Locator): Promise<boolean> => {
    const text = await row.textContent();
    return text?.includes("No results") || text?.includes("No data") || false;
  };

  // Helper function to find the row with the specific UID
  const findProviderRow = async (): Promise<Locator | null> => {
    const count = await allRows.count();

    for (let i = 0; i < count; i++) {
      const row = allRows.nth(i);

      // Skip "No results" rows
      if (await isNoResultsRow(row)) {
        continue;
      }

      // Check if this row contains the UID in the UID column (column 3)
      const uidCell = row.locator("td").nth(3);
      const uidText = await uidCell.textContent();

      if (uidText?.includes(providerUID)) {
        return row;
      }
    }

    return null;
  };

  // Wait for filtering to complete (max 0 or 1 data rows)
  await expect(async () => {

    await findProviderRow();
    const count = await allRows.count();

    // Count only real data rows (not "No results")
    let dataRowCount = 0;
    for (let i = 0; i < count; i++) {
      if (!(await isNoResultsRow(allRows.nth(i)))) {
        dataRowCount++;
      }
    }

    // Should have 0 or 1 data row
    expect(dataRowCount).toBeLessThanOrEqual(1);
  }).toPass({ timeout: 20000 });

  // Find the provider row
  const targetRow = await findProviderRow();

  if (!targetRow) {
    // Provider not found, nothing to delete
    // Navigate back to providers page to ensure clean state
    await page.goto();
    await expect(page.providersTable).toBeVisible({ timeout: 10000 });
    return;
  }

  // Find and click the action button (last cell = actions column)
  const actionButton = targetRow
    .locator("td")
    .last()
    .locator("button")
    .first();

  // Ensure the button is in view before clicking (handles horizontal scroll)
  await actionButton.scrollIntoViewIfNeeded();
  // Verify the button is visible
  await expect(actionButton).toBeVisible({ timeout: 5000 });
  await actionButton.click();

  // Wait for dropdown menu to appear and find delete option
  const deleteMenuItem = page.page.getByRole("menuitem", {
    name: /delete.*provider/i,
  });

  await expect(deleteMenuItem).toBeVisible({ timeout: 5000 });
  await deleteMenuItem.click();

  // Wait for confirmation modal to appear
  const modal = page.page
    .locator('[role="dialog"], .modal, [data-testid*="modal"]')
    .first();

  await expect(modal).toBeVisible({ timeout: 10000 });

  // Find and click the delete confirmation button
  await expect(page.deleteProviderConfirmationButton).toBeVisible({
    timeout: 5000,
  });
  await page.deleteProviderConfirmationButton.click();

  // Wait for modal to close (this indicates deletion was initiated)
  await expect(modal).not.toBeVisible({ timeout: 10000 });

  // Navigate back to providers page to ensure clean state
  await page.goto();
  await expect(page.providersTable).toBeVisible({ timeout: 10000 });
}
```

--------------------------------------------------------------------------------

---[FILE: home-page.ts]---
Location: prowler-master/ui/tests/home/home-page.ts

```typescript
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

export class HomePage extends BasePage {
  
  // Main content elements
  readonly mainContent: Locator;
  readonly breadcrumbs: Locator;
  readonly overviewHeading: Locator;
  
  // Navigation elements
  readonly navigationMenu: Locator;
  readonly userMenu: Locator;
  readonly signOutButton: Locator;
  
  // Dashboard elements
  readonly dashboardCards: Locator;
  readonly overviewSection: Locator;
  
  // UI elements
  readonly logo: Locator;

  constructor(page: Page) {
    super(page);
    
    // Main content elements
    this.mainContent = page.locator("main");
    this.breadcrumbs = page.getByRole("navigation", { name: "Breadcrumbs" });
    this.overviewHeading = page.getByRole("heading", { name: "Overview", exact: true });
    
    // Navigation elements
    this.navigationMenu = page.locator("nav");
    this.userMenu = page.getByRole("button", { name: /user menu/i });
    this.signOutButton = page.getByRole("button", { name: "Sign out" });
    
    // Dashboard elements
    this.dashboardCards = page.locator('[data-testid="dashboard-card"]');
    this.overviewSection = page.locator('[data-testid="overview-section"]');
    
    // UI elements
    this.logo = page.locator('svg[width="300"]');
  }

  // Navigation methods
  async goto(): Promise<void> {
    await super.goto("/");
  }

  // Verification methods
  async verifyPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL("/");
    await expect(this.mainContent).toBeVisible();
    await expect(this.overviewHeading).toBeVisible();
  }

  async verifyBreadcrumbs(): Promise<void> {
    await expect(this.breadcrumbs).toBeVisible();
    await expect(this.overviewHeading).toBeVisible();
  }

  async verifyMainContent(): Promise<void> {
    await expect(this.mainContent).toBeVisible();
  }

  // Navigation methods
  async navigateToOverview(): Promise<void> {
    await this.overviewHeading.click();
  }

  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }

  async signOut(): Promise<void> {
    await this.openUserMenu();
    await this.signOutButton.click();
  }

  // Dashboard methods
  async verifyDashboardCards(): Promise<void> {
    await expect(this.dashboardCards.first()).toBeVisible();
  }

  async verifyOverviewSection(): Promise<void> {
    await expect(this.overviewSection).toBeVisible();
  }

  // Utility methods

  // Accessibility methods
  async verifyKeyboardNavigation(): Promise<void> {
    // Test tab navigation through main elements
    await this.page.keyboard.press("Tab");
    await expect(this.themeToggle).toBeFocused();
  }

  async waitForContentLoad(): Promise<void> {
    await this.page.waitForFunction(() => {
      const main = document.querySelector("main");
      return main && main.offsetHeight > 0;
    });
  }
}
```

--------------------------------------------------------------------------------

---[FILE: invitations-page.ts]---
Location: prowler-master/ui/tests/invitations/invitations-page.ts

```typescript
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";


export class InvitationsPage extends BasePage {
  
  // Page heading
  readonly pageHeadingSendInvitation: Locator;
  readonly pageHeadingInvitations: Locator;

  // UI elements
  readonly sendInviteButton: Locator;
  readonly inviteButton: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;

  // Invitation details
  readonly reviewInvitationDetailsButton: Locator;
  readonly shareUrl: Locator;


  constructor(page: Page) {
    super(page);

    // Page heading
    this.pageHeadingInvitations = page.getByRole("heading", { name: "Invitations" });
    this.pageHeadingSendInvitation = page.getByRole("heading", { name: "Send Invitation" });

    // Button to invite a new user
    this.inviteButton = page.getByRole("link", { name: "Send Invitation", exact: true });
    this.sendInviteButton = page.getByRole("button", { name: "Send Invitation", exact: true });

    // Form inputs
    this.emailInput = page.getByRole("textbox", { name: "Email" });

    // Form select
    this.roleSelect = page.getByRole("button", { name: /Role|Select a role/i });

    // Form details
    this.reviewInvitationDetailsButton = page.getByRole('button', { name: /Review Invitation Details/i });

    // Multiple strategies to find the share URL
    this.shareUrl = page.locator('a[href*="/sign-up?invitation_token="], [data-testid="share-url"], .share-url, code, pre').first();
  }

  async goto(): Promise<void> {
    // Navigate to the invitations page
    
    await super.goto("/invitations");
  }

  async clickSendInviteButton(): Promise<void> {
    // Click the send invitation button

    await this.sendInviteButton.click();
  }

  async clickInviteButton(): Promise<void> {
    // Click the invitation button

    await this.inviteButton.click();
  }

  async verifyPageLoaded(): Promise<void> {
    // Verify the invitations page is loaded

    await expect(this.pageHeadingInvitations).toBeVisible();
  }

  async verifyInvitePageLoaded(): Promise<void> {
    // Verify the invite page is loaded

    await expect(this.emailInput).toBeVisible();
    await expect(this.sendInviteButton).toBeVisible();
  }

  async fillEmail(email: string): Promise<void> {
    // Fill the email input
    await this.emailInput.fill(email);
  }

  async selectRole(role: string): Promise<void> {
    // Select the role option

    // Open the role dropdown
    await this.roleSelect.click();

    // Prefer ARIA role option inside listbox
    const option = this.page.getByRole("option", { name: new RegExp(`^${role}$`, "i") });

    if (await option.count()) {
      await option.first().click();
    } else {
      throw new Error(`Role option ${role} not found`);
    }
    // Ensure the combobox now shows the chosen value
    await expect(this.roleSelect).toContainText(new RegExp(role, "i"));
  }

  async verifyInviteDataPageLoaded(): Promise<void> {
    // Verify the invite data page is loaded

    await expect(this.reviewInvitationDetailsButton).toBeVisible();
  }

  async getShareUrl(): Promise<string> {
    // Get the share url

    // Get the share url text content
    const text = await this.shareUrl.textContent();
    
    if (!text) {
      throw new Error("Share url not found");
    }
    return text;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: invitations.md]---
Location: prowler-master/ui/tests/invitations/invitations.md

```text
### E2E Tests: Invitations Management

**Suite ID:** `INVITATION-E2E`
**Feature:** User Invitations.

---

## Test Case: `INVITATION-E2E-001` - Invite New User and Complete Sign-Up

**Priority:** `critical`

**Tags:**

- type → @e2e
- feature → @invitations
- id → @INVITATION-E2E-001

**Description/Objective:** Validates the full flow to invite a new user from the admin session, consume the invitation link, sign up as the invited user, authenticate, and verify the user is associated to the expected organization.

**Preconditions:**

- Admin authentication state available: `playwright/.auth/admin_user.json` (admin.auth.setup)
- Environment variables configured:
  - `E2E_NEW_USER_PASSWORD` (password for the invited user)
  - `E2E_ORGANIZATION_ID` (expected organization for membership verification)
- Application running with accessible UI/API endpoints

### Flow Steps:

1. Navigate to invitations page
2. Click "Send Invitation" button
3. Fill unique email address for the invite
4. Select role `e2e_admin`
5. Click "Send Invitation" to generate invitation
6. Read the generated share URL from the invitation details
7. Open a new browser context (no admin cookies) and navigate to the share URL
8. Complete sign-up with provided password and accept terms
9. Verify sign-up success (no errors) and redirect to login page
10. Log in with the newly created credentials in the new context
11. Verify successful login
12. Navigate to user profile and verify `organizationId` matches `E2E_ORGANIZATION_ID`

### Expected Result:

- Invitation is created and a valid share URL is provided
- Invited user can sign up successfully using the invitation link
- User is redirected to the login page after sign-up (OSS flow)
- Login succeeds with the new credentials
- User profile shows membership in the expected organization

### Key verification points:

- Invitations page loads and displays the heading
- Send Invitation form is visible (email + role select)
- Invitation details page shows share URL
- Sign-up page loads from invitation link and submits without errors
- Post sign-up, redirect to login is performed
- Login with the new account succeeds
- Profile page shows the expected organization id

### Notes:

- Test uses a fresh browser context for the invitee to avoid admin session leakage
- Email should be unique per run (the test uses a random suffix)
- Ensure `E2E_NEW_USER_PASSWORD` and `E2E_ORGANIZATION_ID` are set before execution
- The role `e2e_admin` must be available in the environment
```

--------------------------------------------------------------------------------

---[FILE: invitations.spec.ts]---
Location: prowler-master/ui/tests/invitations/invitations.spec.ts

```typescript
import { test } from "@playwright/test";
import { InvitationsPage } from "./invitations-page";
import { makeSuffix } from "../helpers";
import { SignUpPage } from "../sign-up/sign-up-page";
import { SignInPage } from "../sign-in/sign-in-page";
import { UserProfilePage } from "../profile/profile-page";

test.describe("New user invitation", () => {
  // Invitations page object
  let invitationsPage: InvitationsPage;

  // Setup before each test
  test.beforeEach(async ({ page }) => {
    invitationsPage = new InvitationsPage(page);
  });

  // Use admin authentication for invitations management
  test.use({ storageState: "playwright/.auth/admin_user.json" });

  test(
    "should invite a new user",
    {
      tag: ["@critical", "@e2e", "@invitations", "@INVITATION-E2E-001"],
    },
    async ({ page, browser }) => {

      // Test data from environment variables
      const password = process.env.E2E_NEW_USER_PASSWORD;
      const organizationId = process.env.E2E_ORGANIZATION_ID;

      // Validate required environment variables
      if (!password || !organizationId) {
        throw new Error(
          "E2E_NEW_USER_PASSWORD or E2E_ORGANIZATION_ID environment variable is not set",
        );
      }

      // Generate unique test data
      const suffix = makeSuffix(10);
      const uniqueEmail = `e2e+${suffix}@prowler.com`;

      // Navigate to providers page
      await invitationsPage.goto();
      await invitationsPage.verifyPageLoaded();

      // Press the invite button
      await invitationsPage.clickInviteButton();
      await invitationsPage.verifyInvitePageLoaded();

      // Fill the email
      await invitationsPage.fillEmail(uniqueEmail);

      // Select the role option
      await invitationsPage.selectRole("e2e_admin");

      // Press the send invitation button
      await invitationsPage.clickSendInviteButton();
      await invitationsPage.verifyInviteDataPageLoaded();

      // Get the share url
      const shareUrl = await invitationsPage.getShareUrl();

      // Navigate to the share url with a new context to avoid cookies from the admin context
      const inviteContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
      const signUpPage = new SignUpPage(await inviteContext.newPage());

      // Navigate to the share url
      await signUpPage.gotoInvite(shareUrl);

      // Fill and submit the sign-up form
      await signUpPage.signup({
        name: `E2E User ${suffix}`,
        email: uniqueEmail,
        password: password,
        confirmPassword: password,
        acceptTerms: true,
      });

      // Verify no errors occurred during sign-up
      await signUpPage.verifyNoErrors();

      // Verify redirect to login page (OSS environment)
      await signUpPage.verifyRedirectToLogin();

      // Verify the newly created user can log in successfully with the new context
      const signInPage = new SignInPage(await inviteContext.newPage());
      await signInPage.goto();
      await signInPage.login({
        email: uniqueEmail,
        password: password,
      });
      await signInPage.verifySuccessfulLogin();
      
      // Navigate to the user profile page
      const userProfilePage = new UserProfilePage(await inviteContext.newPage());
      await userProfilePage.goto();

      // Verify if user is added to the organization
      await userProfilePage.verifyOrganizationId(organizationId);

      // Close the invite context
      await inviteContext.close();
    },
  );
});
```

--------------------------------------------------------------------------------

---[FILE: profile-page.ts]---
Location: prowler-master/ui/tests/profile/profile-page.ts

```typescript
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

export class UserProfilePage extends BasePage {
  // Page heading
  readonly pageHeadingUserProfile: Locator;

  constructor(page: Page) {
    super(page);

    // Page heading
    this.pageHeadingUserProfile = page.getByRole("heading", {
      name: "User Profile",
    });
  }

  async goto(): Promise<void> {
    // Navigate to the user profile page

    await super.goto("/profile");
  }

  async verifyOrganizationId(organizationId: string): Promise<void> {
    // Verify the organization ID is visible

    await expect(this.page.getByText(organizationId)).toBeVisible();
  }
}
```

--------------------------------------------------------------------------------

````
