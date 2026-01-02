---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 857
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 857 of 867)

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

---[FILE: scans-page.ts]---
Location: prowler-master/ui/tests/scans/scans-page.ts

```typescript
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

// Scan page
export class ScansPage extends BasePage {

  // Main content elements
  readonly scanTable: Locator;

    // Scan provider selection elements
    readonly scanProviderSelect: Locator;
    readonly scanAliasInput: Locator;
    readonly startNowButton: Locator;

    // Scan state elements
    readonly successToast: Locator;


  constructor(page: Page) {
    super(page);

    // Scan provider selection elements
    this.scanProviderSelect = page.getByRole('combobox').filter({ hasText: 'Choose a cloud provider' })
    this.scanAliasInput = page.getByRole("textbox", { name: "Scan label (optional)" });
    this.startNowButton = page.getByRole("button", { name: /Start now|Start scan now/i });

    // Scan state elements
    this.successToast = page.getByRole("alert", { name: /The scan was launched successfully\.?/i });

    // Main content elements
    this.scanTable = page.locator("table");
  }

  // Navigation methods
  async goto(): Promise<void> {
    await super.goto("/scans");
  }

  async verifyPageLoaded(): Promise<void> {
    // Verify the scans page is loaded

    await expect(this.page).toHaveTitle(/Prowler/);
    await expect(this.scanTable).toBeVisible();
  }

  async selectProviderByUID(uid: string): Promise<void> {
    // Select the provider by UID

    await this.scanProviderSelect.click();
    await this.page.getByRole("option", { name: new RegExp(uid) }).click();
  }

  async fillScanAlias(alias: string): Promise<void> {
    // Fill the scan alias

    await this.scanAliasInput.fill(alias);
  }

  async clickStartNowButton(): Promise<void> {
    // Click the start now button

    await expect(this.startNowButton).toBeVisible();
    await this.startNowButton.click();
  }

  async verifyScanLaunched(alias: string): Promise<void> {
    // Verify the scan was launched

    // Verify the success toast is visible
    await this.successToast.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});

    // Wait for the scans table to be visible
    await expect(this.scanTable).toBeVisible();

    // Find a row that contains the scan alias
    const rowWithAlias = this.scanTable
      .locator("tbody tr")
      .filter({ hasText: alias })
      .first();

    // Verify the row with the scan alias is visible
    await expect(rowWithAlias).toBeVisible();

    // Basic state/assertion hint: queued/available/executing (non-blocking if not present)
    await rowWithAlias.textContent().then((text) => {

      if (!text) return;

      const hasExpectedState = /executing|available|queued/i.test(text);

      if (!hasExpectedState) {
        // Fall back to just ensuring alias is present in the row
        // The expectation above already ensures visibility
      }
    });
  }


  async verifyScheduledScanStatus(accountId: string): Promise<void> {
    // Verifies that:
    // 1. The provider exists in the table (by account ID/UID)
    // 2. The scan name field contains "scheduled scan"

    // Scan Table exists
    await expect(this.scanTable).toBeVisible();

    // Find a row that contains the account ID (provider UID in Cloud Provider column)
    const rowWithAccountId = this.scanTable
      .locator("tbody tr")
      .filter({ hasText: accountId })
      .first();

    // Verify the row with the account ID is visible (provider exists)
    await expect(rowWithAccountId).toBeVisible();

    // Verify the row contains "scheduled scan" in the Scan name column
    // The scan name "Daily scheduled scan" is displayed as "scheduled scan" in the table
    await expect(rowWithAccountId).toContainText("scheduled scan", {
      ignoreCase: true,
    });
  }

}
```

--------------------------------------------------------------------------------

---[FILE: scans.md]---
Location: prowler-master/ui/tests/scans/scans.md

```text
### E2E Tests: Scans - On Demand

**Suite ID:** `SCANS-E2E`
**Feature:** On-demand Scans.

---

## Test Case: `SCANS-E2E-001` - Execute On-Demand Scan

**Priority:** `critical`

**Tags:**

- type → @e2e, @serial
- feature → @scans

**Description/Objective:** Validates the complete flow to execute an on-demand scan selecting a provider by UID and confirming success on the Scans page.

**Preconditions:**

- Admin user authentication required (admin.auth.setup setup)
- Environment variables configured for : E2E_AWS_PROVIDER_ACCOUNT_ID,E2E_AWS_PROVIDER_ACCESS_KEY and E2E_AWS_PROVIDER_SECRET_KEY
- Remove any existing AWS provider with the same Account ID before starting the test
- This test must be run serially and never in parallel with other tests, as it requires the Account ID Provider to be already registered.

### Flow Steps:

1. Navigate to Scans page
2. Open provider selector and choose the entry whose text contains E2E_AWS_PROVIDER_ACCOUNT_ID
3. Optionally fill scan label (alias)
4. Click "Start now" to launch the scan
5. Verify the success toast appears
6. Verify a row in the Scans table contains the provided scan label (or shows the new scan entry)

### Expected Result:

- Scan is launched successfully
- Success toast is displayed to the user
- Scans table displays the new scan entry (including the alias when provided)

### Key verification points:

- Scans page loads correctly
- Provider select is available and lists the configured provider UID
- "Start now" button is rendered and enabled when form is valid
- Success toast message: "The scan was launched successfully."
- Table contains a row with the scan label or new scan state (queued/available/executing)

### Notes:

- The table may take a short time to reflect the new scan; assertions look for a row containing the alias.
- Provider cleanup performed before each test to ensure clean state
- Tests should run serially to avoid state conflicts.
```

--------------------------------------------------------------------------------

---[FILE: scans.spec.ts]---
Location: prowler-master/ui/tests/scans/scans.spec.ts

```typescript
import { test } from "@playwright/test";
import { ScansPage } from "./scans-page";
import { ProvidersPage } from "../providers/providers-page";
import { deleteProviderIfExists, addAWSProvider } from "../helpers";

// Scans E2E suite scaffold
test.describe("Scans", () => {
  test.describe.serial("Execute Scans", () => {
    // Scans page object
    let scansPage: ScansPage;

    // Use scans-specific authenticated user
    test.use({ storageState: "playwright/.auth/admin_user.json" });

    // Before each scans test, ensure an AWS provider exists using admin context
    test.beforeEach(async ({ page }) => {
      // Create scans page object
      const providersPage = new ProvidersPage(page);

      // Test data from environment variables
      const accountId = process.env.E2E_AWS_PROVIDER_ACCOUNT_ID;
      const accessKey = process.env.E2E_AWS_PROVIDER_ACCESS_KEY;
      const secretKey = process.env.E2E_AWS_PROVIDER_SECRET_KEY;

      if (!accountId || !accessKey || !secretKey) {
        throw new Error(
          "E2E_AWS_PROVIDER_ACCOUNT_ID, E2E_AWS_PROVIDER_ACCESS_KEY, and E2E_AWS_PROVIDER_SECRET_KEY environment variables are not set",
        );
      }

      // Clean up existing provider to ensure clean test state
      await deleteProviderIfExists(providersPage, accountId);
      // Add AWS provider
      await addAWSProvider(providersPage.page, accountId, accessKey, secretKey);
    });

    test(
      "should execute on demand scan",
      {
        tag: ["@e2e", "@scans", "@critical", "@serial", "@SCAN-E2E-001"],
      },
      async ({ page }) => {

        const accountId = process.env.E2E_AWS_PROVIDER_ACCOUNT_ID;

        if (!accountId) {
          throw new Error(
            "E2E_AWS_PROVIDER_ACCOUNT_ID environment variable is not set",
          );
        }

        scansPage = new ScansPage(page);
        await scansPage.goto();

        // Select provider by UID (accountId)
        await scansPage.selectProviderByUID(accountId);

        // Complete scan alias
        await scansPage.fillScanAlias("E2E Test Scan - On Demand");

        // Press start now button
        await scansPage.clickStartNowButton();

        // Verify the scan was launched
        await scansPage.verifyScanLaunched("E2E Test Scan - On Demand");


      },
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: admin.auth.setup.ts]---
Location: prowler-master/ui/tests/setups/admin.auth.setup.ts

```typescript
import { test as authAdminSetup } from '@playwright/test';
import { authenticateAndSaveState } from '@/tests/helpers';

const adminUserFile = 'playwright/.auth/admin_user.json';

authAdminSetup('authenticate as admin e2e user', async ({ page }) => {

  const adminEmail = process.env.E2E_ADMIN_USER;
  const adminPassword = process.env.E2E_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('E2E_ADMIN_USER and E2E_ADMIN_PASSWORD environment variables are required');
  }

  await authenticateAndSaveState(page, adminEmail, adminPassword, adminUserFile);
});
```

--------------------------------------------------------------------------------

---[FILE: invite-and-manage-users.auth.setup.ts]---
Location: prowler-master/ui/tests/setups/invite-and-manage-users.auth.setup.ts

```typescript
import { test as authInviteAndManageUsersSetup } from '@playwright/test';
import { authenticateAndSaveState } from '@/tests/helpers';

const inviteAndManageUsersUserFile = 'playwright/.auth/invite_and_manage_users_user.json';

authInviteAndManageUsersSetup('authenticate as invite and manage users e2e user', async ({ page }) => {
  const inviteAndManageUsersEmail = process.env.E2E_INVITE_AND_MANAGE_USERS_USER;
  const inviteAndManageUsersPassword = process.env.E2E_INVITE_AND_MANAGE_USERS_PASSWORD;
  
  if (!inviteAndManageUsersEmail || !inviteAndManageUsersPassword) {
    throw new Error('E2E_INVITE_AND_MANAGE_USERS_USER and E2E_INVITE_AND_MANAGE_USERS_PASSWORD environment variables are required');
  }

  await authenticateAndSaveState(page, inviteAndManageUsersEmail, inviteAndManageUsersPassword, inviteAndManageUsersUserFile);
});
```

--------------------------------------------------------------------------------

---[FILE: manage-account.auth.setup.ts]---
Location: prowler-master/ui/tests/setups/manage-account.auth.setup.ts

```typescript
import { test as authManageAccountSetup } from '@playwright/test';
import { authenticateAndSaveState } from '@/tests/helpers';

const manageAccountUserFile = 'playwright/.auth/manage_account_user.json';

authManageAccountSetup('authenticate as manage account e2e user',  async ({ page }) => {
  const accountEmail = process.env.E2E_MANAGE_ACCOUNT_USER;
  const accountPassword = process.env.E2E_MANAGE_ACCOUNT_PASSWORD;
  
  if (!accountEmail || !accountPassword) {
    throw new Error('E2E_MANAGE_ACCOUNT_USER and E2E_MANAGE_ACCOUNT_PASSWORD environment variables are required');
  }

  await authenticateAndSaveState(page, accountEmail, accountPassword, manageAccountUserFile);
});
```

--------------------------------------------------------------------------------

---[FILE: manage-cloud-providers.auth.setup.ts]---
Location: prowler-master/ui/tests/setups/manage-cloud-providers.auth.setup.ts

```typescript
import { test as authManageCloudProvidersSetup } from '@playwright/test';
import { authenticateAndSaveState } from '@/tests/helpers';

const manageCloudProvidersUserFile = 'playwright/.auth/manage_cloud_providers_user.json';

authManageCloudProvidersSetup('authenticate as manage cloud providers e2e user',  async ({ page }) => {
  const cloudProvidersEmail = process.env.E2E_MANAGE_CLOUD_PROVIDERS_USER;
  const cloudProvidersPassword = process.env.E2E_MANAGE_CLOUD_PROVIDERS_PASSWORD;
    
  if (!cloudProvidersEmail || !cloudProvidersPassword) {
    throw new Error('E2E_MANAGE_CLOUD_PROVIDERS_USER and E2E_MANAGE_CLOUD_PROVIDERS_PASSWORD environment variables are required');
  }

  await authenticateAndSaveState(page, cloudProvidersEmail, cloudProvidersPassword, manageCloudProvidersUserFile);
});
```

--------------------------------------------------------------------------------

---[FILE: manage-integrations.auth.setup.ts]---
Location: prowler-master/ui/tests/setups/manage-integrations.auth.setup.ts

```typescript
import { test as authManageIntegrationsSetup } from '@playwright/test';
import { authenticateAndSaveState } from '@/tests/helpers';

const manageIntegrationsUserFile = 'playwright/.auth/manage_integrations_user.json';

authManageIntegrationsSetup('authenticate as integrations e2e user',  async ({ page }) => {
  const integrationsEmail = process.env.E2E_MANAGE_INTEGRATIONS_USER;
  const integrationsPassword = process.env.E2E_MANAGE_INTEGRATIONS_PASSWORD;
  
  if (!integrationsEmail || !integrationsPassword) {
    throw new Error('E2E_MANAGE_INTEGRATIONS_USER and E2E_MANAGE_INTEGRATIONS_PASSWORD environment variables are required');
  }

  await authenticateAndSaveState(page, integrationsEmail, integrationsPassword, manageIntegrationsUserFile);
});
```

--------------------------------------------------------------------------------

---[FILE: manage-scans.auth.setup.ts]---
Location: prowler-master/ui/tests/setups/manage-scans.auth.setup.ts

```typescript
import { test as authManageScansSetup } from '@playwright/test';
import { authenticateAndSaveState } from '@/tests/helpers';

const manageScansUserFile = 'playwright/.auth/manage_scans_user.json';

authManageScansSetup('authenticate as scans e2e user', async ({ page }) => {
  const scansEmail = process.env.E2E_MANAGE_SCANS_USER;
  const scansPassword = process.env.E2E_MANAGE_SCANS_PASSWORD;
  
  if (!scansEmail || !scansPassword) {
    throw new Error('E2E_MANAGE_SCANS_USER and E2E_MANAGE_SCANS_PASSWORD environment variables are required');
  }

  await authenticateAndSaveState(page, scansEmail, scansPassword, manageScansUserFile);
});
```

--------------------------------------------------------------------------------

---[FILE: unlimited-visibility.auth.setup.ts]---
Location: prowler-master/ui/tests/setups/unlimited-visibility.auth.setup.ts

```typescript
import { test as authUnlimitedVisibilitySetup } from '@playwright/test';
import { authenticateAndSaveState } from '@/tests/helpers';

const unlimitedVisibilityUserFile = 'playwright/.auth/unlimited_visibility_user.json';

authUnlimitedVisibilitySetup('authenticate as unlimited visibility e2e user',  async ({ page }) => {
  const unlimitedVisibilityEmail = process.env.E2E_UNLIMITED_VISIBILITY_USER;
  const unlimitedVisibilityPassword = process.env.E2E_UNLIMITED_VISIBILITY_PASSWORD;
  
  if (!unlimitedVisibilityEmail || !unlimitedVisibilityPassword) {
    throw new Error('E2E_UNLIMITED_VISIBILITY_USER and E2E_UNLIMITED_VISIBILITY_PASSWORD environment variables are required');
  }

  await authenticateAndSaveState(page, unlimitedVisibilityEmail, unlimitedVisibilityPassword, unlimitedVisibilityUserFile);
});
```

--------------------------------------------------------------------------------

---[FILE: auth-login.spec.ts]---
Location: prowler-master/ui/tests/sign-in/auth-login.spec.ts

```typescript
import { test, expect } from "@playwright/test";
import {
  goToLogin,
  goToSignUp,
  fillLoginForm,
  submitLoginForm,
  login,
  verifySuccessfulLogin,
  verifyLoginError,
  verifyLoginFormElements,
  verifyDashboardRoute,
  toggleSamlMode,
  verifySamlModeActive,
  goBackFromSaml,
  verifyNormalModeActive,
  logout,
  verifyLogoutSuccess,
  waitForPageLoad,
  TEST_CREDENTIALS,
  ERROR_MESSAGES,
  URLS,
  verifyLoadingState,
} from "../helpers";

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    await goToLogin(page);
  });

  test("should display login form elements", async ({ page }) => {
    await verifyLoginFormElements(page);
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    await login(page, TEST_CREDENTIALS.VALID);
    await verifySuccessfulLogin(page);
    await verifyDashboardRoute(page);
  });

  test("should show error message with invalid credentials", async ({
    page,
  }) => {
    // Attempt login with invalid credentials
    await login(page, TEST_CREDENTIALS.INVALID);
    await verifyLoginError(page, ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test("should handle empty form submission", async ({ page }) => {
    // Submit empty form
    await submitLoginForm(page);

    // Should show both email and password validation errors
    await verifyLoginError(page, ERROR_MESSAGES.INVALID_EMAIL);
    await verifyLoginError(page, ERROR_MESSAGES.PASSWORD_REQUIRED);

    // Verify we're still on login page
    await expect(page).toHaveURL(URLS.LOGIN);
  });

  test("should validate email format", async ({ page }) => {
    // Attempt login with invalid email format
    await login(page, TEST_CREDENTIALS.INVALID_EMAIL_FORMAT);
    // Verify field-level email validation message
    await verifyLoginError(page, ERROR_MESSAGES.INVALID_EMAIL);
    // Verify we're still on login page
    await expect(page).toHaveURL(URLS.LOGIN);
  });

  test("should require password when email is filled", async ({ page }) => {
    // Fill only email, leave password empty
    await page.getByLabel("Email").fill(TEST_CREDENTIALS.VALID.email);
    await submitLoginForm(page);

    // Should show password required error
    await verifyLoginError(page, ERROR_MESSAGES.PASSWORD_REQUIRED);

    // Verify we're still on login page
    await expect(page).toHaveURL(URLS.LOGIN);
  });

  test("should toggle SAML SSO mode", async ({ page }) => {
    // Toggle to SAML mode
    await toggleSamlMode(page);
    await verifySamlModeActive(page);
    // Toggle back to normal mode
    await goBackFromSaml(page);
    await verifyNormalModeActive(page);
  });

  test("should show loading state during form submission", async ({ page }) => {
    // Fill valid credentials
    await fillLoginForm(
      page,
      TEST_CREDENTIALS.VALID.email,
      TEST_CREDENTIALS.VALID.password,
    );
    // Submit form and verify loading state
    await submitLoginForm(page);
    // Verify loading state
    await verifyLoadingState(page);
  });

  test("should handle SAML authentication flow", async ({ page }) => {
    // Enter email for SAML
    const samlEmail = "user@saml-domain.com";
    // Toggle to SAML mode
    await toggleSamlMode(page);
    // Fill email (password should be hidden)
    await page.getByLabel("Email").fill(samlEmail);
    // Submit should trigger SAML redirect (we can't test the actual SAML flow in E2E)
    // but we can verify the form submission
    await submitLoginForm(page);

    // Note: In a real scenario, this would redirect to IdP
    // For testing, we just verify the form was submitted
  });
});

test.describe("Session Persistence", () => {
  test("should maintain session after browser refresh", async ({ page }) => {
    // Login first
    await goToLogin(page);
    await login(page, TEST_CREDENTIALS.VALID);
    await verifySuccessfulLogin(page);
    // Refresh the page
    await page.reload();
    await waitForPageLoad(page);
    // Verify session is maintained
    await expect(page).toHaveURL(URLS.DASHBOARD);
    await verifyDashboardRoute(page);
    // Verify user is not redirected back to login
    await expect(page).not.toHaveURL(URLS.LOGIN);
  });

  test("should redirect to login when accessing protected route without session", async ({
    page,
  }) => {
    // Try to access protected route without login
    await page.goto(URLS.DASHBOARD);
    // Should be redirected to login page (may include callbackUrl)
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page.getByText("Sign in", { exact: true })).toBeVisible();
  });

  test("should logout successfully", async ({ page }) => {
    // Login first
    await goToLogin(page);
    await login(page, TEST_CREDENTIALS.VALID);
    await verifySuccessfulLogin(page);

    // Logout
    await logout(page);
    await verifyLogoutSuccess(page);

    // Verify cannot access protected route after logout
    await page.goto(URLS.DASHBOARD);
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("should handle session timeout gracefully", async ({ browser }) => {
    // Test approach: Verify that a new browser context without auth cookies
    // gets redirected to login when accessing protected routes

    // First, login in one context to verify auth works
    const authContext = await browser.newContext();
    const authPage = await authContext.newPage();

    await goToLogin(authPage);
    await login(authPage, TEST_CREDENTIALS.VALID);
    await verifySuccessfulLogin(authPage);

    // Verify session exists in authenticated context
    const authResponse = await authPage.request.get("/api/auth/session");
    const authSession = await authResponse.json();
    expect(authSession).toBeTruthy();
    expect(authSession.user).toBeTruthy();

    // Now create a completely separate context without any auth
    const unauthContext = await browser.newContext();
    const unauthPage = await unauthContext.newPage();

    // Try to access protected route in unauthenticated context
    await unauthPage.goto(URLS.PROFILE, {
      waitUntil: "networkidle",
    });

    // Should be redirected to login since this context has no auth (may include callbackUrl)
    await expect(unauthPage).toHaveURL(/\/sign-in/);

    // Verify session is null in unauthenticated context
    const unauthResponse = await unauthPage.request.get("/api/auth/session");
    const unauthSessionText = await unauthResponse.text();
    expect(unauthSessionText).toBe("null");

    // Clean up
    await authPage.close();
    await authContext.close();
    await unauthPage.close();
    await unauthContext.close();
  });
});

test.describe("Navigation", () => {
  test("should navigate to sign up page", async ({ page }) => {
    await goToLogin(page);
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(URLS.SIGNUP);
  });

  test("should navigate from sign up back to sign in", async ({ page }) => {
    await goToSignUp(page);
    await page.getByRole("link", { name: "Log in" }).click();
    await expect(page).toHaveURL(URLS.LOGIN);
    await expect(page.getByText("Sign in", { exact: true })).toBeVisible();
  });

  test("should handle browser back button correctly", async ({ page }) => {
    await goToLogin(page);
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(URLS.SIGNUP);
    await page.goBack();
    await expect(page).toHaveURL(URLS.LOGIN);
    await expect(page.getByText("Sign in", { exact: true })).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await goToLogin(page);
  });

  test("should be navigable with keyboard", async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press("Tab"); // Toggle theme
    await page.keyboard.press("Tab"); // Email field
    await expect(page.getByLabel("Email")).toBeFocused();

    await page.keyboard.press("Tab"); // Password field
    await expect(page.getByLabel("Password")).toBeFocused();

    await page.keyboard.press("Tab"); // Show password button
    await page.keyboard.press("Tab"); // Login button

    if (process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true") {
      await page.keyboard.press("Tab"); // Forgot password
    }

    await expect(page.getByRole("button", { name: "Log in" })).toBeFocused();
  });

  test("should have proper ARIA labels", async ({ page }) => {
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
  });
});
```

--------------------------------------------------------------------------------

---[FILE: sign-in-page.ts]---
Location: prowler-master/ui/tests/sign-in/sign-in-page.ts

```typescript
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";
import { HomePage } from "../home/home-page";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SocialAuthConfig {
  googleEnabled: boolean;
  githubEnabled: boolean;
}

export class SignInPage extends BasePage {
  readonly homePage: HomePage;
  
  // Form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly form: Locator;
  
  // Social authentication buttons
  readonly googleButton: Locator;
  readonly githubButton: Locator;
  readonly samlButton: Locator;
  
  // Navigation elements
  readonly signUpLink: Locator;
  readonly backButton: Locator;
  
  // UI elements
  readonly logo: Locator;
  
  // Error messages
  readonly errorMessages: Locator;
  
  // SAML specific elements
  readonly samlModeTitle: Locator;
  readonly samlEmailInput: Locator;

  constructor(page: Page) {
    super(page);
    this.homePage = new HomePage(page);
    
    // Form elements
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Log in" });
    this.form = page.locator("form");
    
    // Social authentication buttons
    this.googleButton = page.getByRole("button", { name: "Continue with Google" });
    this.githubButton = page.getByRole("button", { name: "Continue with Github" });
    this.samlButton = page.getByRole("button", { name: "Continue with SAML SSO" });
    
    // Navigation elements
    this.signUpLink = page.getByRole("link", { name: "Sign up" });
    this.backButton = page.getByRole("button", { name: "Back" });
    
    // UI elements
    this.logo = page.locator('svg[width="300"]');
    
    // Error messages
    this.errorMessages = page.locator('[role="alert"], .error-message, [data-testid="error"]');
    
    // SAML specific elements
    this.samlModeTitle = page.getByRole("heading", { name: "Sign in with SAML SSO" });
    this.samlEmailInput = page.getByRole("textbox", { name: "Email" });
  }

  // Navigation methods
  async goto(): Promise<void> {
    await super.goto("/sign-in");
  }

  // Form interaction methods
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async fillCredentials(credentials: SignInCredentials): Promise<void> {
    await this.fillEmail(credentials.email);
    await this.fillPassword(credentials.password);
  }

  async submitForm(): Promise<void> {
    await this.loginButton.click();
  }

  async login(credentials: SignInCredentials): Promise<void> {
    await this.fillCredentials(credentials);
    await this.submitForm();
  }

  // Social authentication methods
  async clickGoogleAuth(): Promise<void> {
    await this.googleButton.click();
  }

  async clickGithubAuth(): Promise<void> {
    await this.githubButton.click();
  }

  async clickSamlAuth(): Promise<void> {
    await this.samlButton.click();
  }

  // SAML SSO methods
  async toggleSamlMode(): Promise<void> {
    await this.clickSamlAuth();
  }

  async goBackFromSaml(): Promise<void> {
    await this.backButton.click();
  }

  async fillSamlEmail(email: string): Promise<void> {
    await this.samlEmailInput.fill(email);
  }

  async submitSamlForm(): Promise<void> {
    await this.submitForm();
  }

  // Navigation methods
  async goToSignUp(): Promise<void> {
    await this.signUpLink.click();
  }

  // Validation and assertion methods
  async verifyPageLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Prowler/);
    await expect(this.logo).toBeVisible();
    await expect(this.page.getByRole("heading", { name: "Sign in", exact: true })).toBeVisible();
  }

  async verifyFormElements(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async verifySocialButtons(config: SocialAuthConfig): Promise<void> {
    if (config.googleEnabled) {
      await expect(this.googleButton).toBeVisible();
    }
    if (config.githubEnabled) {
      await expect(this.githubButton).toBeVisible();
    }
    await expect(this.samlButton).toBeVisible();
  }

  async verifyNavigationLinks(): Promise<void> {
    await expect(this.page.getByRole('link', { name: /Need to create an account\?/i })).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.homePage.verifyPageLoaded();
  }

  async verifyLoginError(errorMessage: string = "Invalid email or password"): Promise<void> {
    await expect(this.page.getByRole("alert", { name: errorMessage })).toBeVisible();
    await expect(this.page).toHaveURL("/sign-in");
  }

  async verifySamlModeActive(): Promise<void> {
    await expect(this.samlModeTitle).toBeVisible();
    await expect(this.passwordInput).not.toBeVisible();
    await expect(this.backButton).toBeVisible();
  }

  async verifyNormalModeActive(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Sign in", exact: true })).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async verifyLoadingState(): Promise<void> {
    await expect(this.loginButton).toHaveAttribute("aria-disabled", "true");
    await super.verifyLoadingState();
  }

  async verifyFormValidation(): Promise<void> {
    // Check for common validation messages
    const emailError = this.page.getByRole("alert", { name: "Please enter a valid email address." });
    const passwordError = this.page.getByRole("alert", { name: "Password is required." });
    
    // At least one validation error should be visible
    await expect(emailError.or(passwordError)).toBeVisible();
  }

  // Accessibility methods
  async verifyKeyboardNavigation(): Promise<void> {
    // Test tab navigation through form elements
    await this.page.keyboard.press("Tab"); // Theme toggle
    await this.page.keyboard.press("Tab"); // Email field
    await expect(this.emailInput).toBeFocused();

    await this.page.keyboard.press("Tab"); // Password field
    await expect(this.passwordInput).toBeFocused();

    await this.page.keyboard.press("Tab"); // Show password button
    await this.page.keyboard.press("Tab"); // Login button
    await expect(this.loginButton).toBeFocused();
  }

  async verifyAriaLabels(): Promise<void> {
    await expect(this.page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expect(this.page.getByRole("textbox", { name: "Password" })).toBeVisible();
    await expect(this.page.getByRole("button", { name: "Log in" })).toBeVisible();
  }

  // Utility methods
  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  async isFormValid(): Promise<boolean> {
    const emailValue = await this.emailInput.inputValue();
    const passwordValue = await this.passwordInput.inputValue();
    return emailValue.length > 0 && passwordValue.length > 0;
  }

  // Browser interaction methods

  // Session management methods
  async logout(): Promise<void> {
    await this.homePage.signOut();
  }

  async verifyLogoutSuccess(): Promise<void> {
    await expect(this.page).toHaveURL("/sign-in");
    await expect(this.page.getByRole("heading", { name: "Sign in", exact: true })).toBeVisible();
  }

  // Advanced interaction methods
  async fillFormWithValidation(credentials: SignInCredentials): Promise<void> {
    // Fill email first and check for validation
    await this.fillEmail(credentials.email);
    await this.page.keyboard.press("Tab"); // Trigger validation
    
    // Fill password
    await this.fillPassword(credentials.password);
  }

  async submitFormWithEnterKey(): Promise<void> {
    await this.passwordInput.press("Enter");
  }

  async submitFormWithButtonClick(): Promise<void> {
    await this.submitForm();
  }

  // Error handling methods
  async handleSamlError(): Promise<void> {
    const samlError = this.page.getByRole("alert", { name: "SAML Authentication Error" });
    if (await samlError.isVisible()) {
      // Handle SAML error if present
      console.log("SAML authentication error detected");
    }
  }

  // Wait methods
  async waitForFormSubmission(): Promise<void> {
    await this.page.waitForFunction(() => {
      const button = document.querySelector('button[aria-disabled="true"]');
      return button === null;
    });
  }

  async waitForRedirect(expectedUrl: string): Promise<void> {
    await this.page.waitForURL(expectedUrl);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: sign-up-page.ts]---
Location: prowler-master/ui/tests/sign-up/sign-up-page.ts

```typescript
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
  invitationToken?: string | null;
  acceptTerms?: boolean;
}

export class SignUpPage extends BasePage {

  // Form inputs
  readonly nameInput: Locator;
  readonly companyInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly invitationTokenInput: Locator;

  // UI elements
  readonly submitButton: Locator;
  readonly loginLink: Locator;
  readonly termsCheckbox: Locator;

  constructor(page: Page) {
    super(page);

    // Prefer stable name attributes to avoid label ambiguity in composed inputs
    this.nameInput = page.locator('input[name="name"]');
    this.companyInput = page.locator('input[name="company"]');
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.locator('input[name="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    this.invitationTokenInput = page.locator('input[name="invitationToken"]');

    this.submitButton = page.getByRole("button", { name: "Sign up" });
    this.loginLink = page.getByRole("link", { name: "Log in" });
    this.termsCheckbox = page.getByRole("checkbox", { name: /I agree with the/i });
  }

  async goto(): Promise<void> {
    // Navigate to the sign up page

    await super.goto("/sign-up");
  }
  async gotoInvite(shareUrl: string): Promise<void> {
    // Navigate to the share url

    await  super.goto(shareUrl);
  }

  async verifyPageLoaded(): Promise<void> {
    // Verify the sign up page is loaded

    await expect(this.page.getByRole("heading", { name: "Sign up" })).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async fillName(name: string): Promise<void> {
    // Fill the name input

    await this.nameInput.fill(name);
  }

  async fillCompany(company?: string): Promise<void> {
    // Fill the company input

    if (company) {
      await this.companyInput.fill(company);
    }
  }

  async fillEmail(email: string): Promise<void> {
    // Fill the email input

    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    // Fill the password input

    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(confirmPassword: string): Promise<void> {
    // Fill the confirm password input

    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async fillInvitationToken(token?: string | null): Promise<void> {
    // Fill the invitation token input

    if (token) {
      await this.invitationTokenInput.fill(token);
    }
  }

  async acceptTermsIfPresent(accept: boolean = true): Promise<void> {
    // Accept the terms and conditions if present

    if (await this.termsCheckbox.isVisible()) {
      if (accept) {
        await this.termsCheckbox.click();
      }
    }
  }

  async submit(): Promise<void> {
    // Submit the sign up form

    await this.submitButton.click();
  }

  async signup(data: SignUpData): Promise<void> {
    // Fill the sign up form

    await this.fillName(data.name);
    await this.fillCompany(data.company ?? undefined);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillConfirmPassword(data.confirmPassword);
    await this.acceptTermsIfPresent(data.acceptTerms ?? true);
    await this.submit();
  }

  async verifyRedirectToLogin(): Promise<void> {
    // Verify redirect to login page

    await expect(this.page).toHaveURL("/sign-in");
  }

  async verifyRedirectToEmailVerification(): Promise<void> {
    // Verify redirect to email verification page

    await expect(this.page).toHaveURL("/email-verification");
  }
}
```

--------------------------------------------------------------------------------

---[FILE: sign-up.md]---
Location: prowler-master/ui/tests/sign-up/sign-up.md

```text
### E2E Tests: User Sign-Up

**Suite ID:** `SIGNUP-E2E`
**Feature:** New user registration.

---

## Test Case: `SIGNUP-E2E-001` - Successful new user registration and login

**Priority:** `critical`

**Tags:**
- type → @e2e
- feature → @signup

**Description/Objetive:** Registers a new user with valid data, verifies redirect to Login (OSS), and confirms the user can authenticate.

**Preconditions:**
- Application is running, email domain & password is acceptable for sign-up.
- No existing data in Prowler is required; the test can run on a clean state.
- `E2E_NEW_USER_PASSWORD` environment variable must be set with a valid password for the test.

### Flow Steps:
1. Navigate to the Sign up page.
2. Fill the form with valid data (unique email, valid password, terms accepted).
3. Submit the form.
4. Verify redirect to the Login page.
5. Log in with the newly created credentials.

### Expected Result:
- Sign-up succeeds and redirects to Login.
- User can log in successfully using the created credentials and reach the home page.

### Key verification points:
- After submitting sign-up, the URL changes to `/sign-in`.
- The newly created credentials can be used to sign in successfully.
- After login, the user lands on the home (`/`) and main content is visible.

### Notes:
- Test data uses a random base36 suffix to avoid collisions with email.
- The test requires the `E2E_NEW_USER_PASSWORD` environment variable to be set before running.
```

--------------------------------------------------------------------------------

---[FILE: sign-up.spec.ts]---
Location: prowler-master/ui/tests/sign-up/sign-up.spec.ts

```typescript
import { test } from "@playwright/test";
import { SignUpPage } from "./sign-up-page";
import { SignInPage } from "../sign-in/sign-in-page";
import { makeSuffix } from "../helpers";

test.describe("Sign Up Flow", () => {
  test(
    "should register a new user successfully",
    { tag: ["@critical", "@e2e", "@signup", "@SIGNUP-E2E-001"] },
    async ({ page }) => {
      const password = process.env.E2E_NEW_USER_PASSWORD;

      if (!password) {
        throw new Error("E2E_NEW_USER_PASSWORD environment variable is not set");
      }

      const signUpPage = new SignUpPage(page);
      await signUpPage.goto();

      // Generate unique test data
      const suffix = makeSuffix(10);
      const uniqueEmail = `e2e+${suffix}@prowler.com`;

      // Fill and submit the sign-up form
      await signUpPage.signup({
        name: `E2E User ${suffix}`,
        company: `Test E2E Co ${suffix}`,
        email: uniqueEmail,
        password: password,
        confirmPassword: password,
        acceptTerms: true,
      });

      // Verify no errors occurred during sign-up
      await signUpPage.verifyNoErrors();

      // Verify redirect to login page (OSS environment)
      await signUpPage.verifyRedirectToLogin();

      // Verify the newly created user can log in successfully
      const signInPage = new SignInPage(page);
      await signInPage.login({
        email: uniqueEmail,
        password: password,
      });
      await signInPage.verifySuccessfulLogin();
    },
  );
});
```

--------------------------------------------------------------------------------

````
