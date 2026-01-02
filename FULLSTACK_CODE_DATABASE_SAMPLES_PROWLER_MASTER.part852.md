---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 852
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 852 of 867)

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

---[FILE: provider-credential-fields.ts]---
Location: prowler-master/ui/lib/provider-credentials/provider-credential-fields.ts

```typescript
/**
 * Centralized credential field names to avoid hardcoded strings
 * and provide type safety across the application
 */

// Provider credential field names
export const ProviderCredentialFields = {
  CREDENTIALS_TYPE: "credentials_type",
  CREDENTIALS_TYPE_AWS: "aws-sdk-default",
  CREDENTIALS_TYPE_ACCESS_SECRET_KEY: "access-secret-key",

  // Base fields for all providers
  PROVIDER_ID: "providerId",
  PROVIDER_TYPE: "providerType",
  PROVIDER_ALIAS: "providerAlias",
  PROVIDER_UID: "providerUid",

  // AWS fields
  AWS_ACCESS_KEY_ID: "aws_access_key_id",
  AWS_SECRET_ACCESS_KEY: "aws_secret_access_key",
  AWS_SESSION_TOKEN: "aws_session_token",
  ROLE_ARN: "role_arn",
  EXTERNAL_ID: "external_id",
  SESSION_DURATION: "session_duration",
  ROLE_SESSION_NAME: "role_session_name",

  // Azure/M365 fields
  CLIENT_ID: "client_id",
  CLIENT_SECRET: "client_secret",
  TENANT_ID: "tenant_id",
  USER: "user",
  PASSWORD: "password",
  CERTIFICATE_CONTENT: "certificate_content",

  // GCP fields
  REFRESH_TOKEN: "refresh_token",
  SERVICE_ACCOUNT_KEY: "service_account_key",

  // Kubernetes fields
  KUBECONFIG_CONTENT: "kubeconfig_content",

  // GitHub fields
  PERSONAL_ACCESS_TOKEN: "personal_access_token",
  OAUTH_APP_TOKEN: "oauth_app_token",
  GITHUB_APP_ID: "github_app_id",
  GITHUB_APP_KEY: "github_app_key_content",

  // MongoDB Atlas fields
  ATLAS_PUBLIC_KEY: "atlas_public_key",
  ATLAS_PRIVATE_KEY: "atlas_private_key",

  // IaC fields
  REPOSITORY_URL: "repository_url",
  ACCESS_TOKEN: "access_token",

  // OCI fields
  OCI_USER: "user",
  OCI_FINGERPRINT: "fingerprint",
  OCI_KEY_FILE: "key_file",
  OCI_KEY_CONTENT: "key_content",
  OCI_TENANCY: "tenancy",
  OCI_REGION: "region",
  OCI_PASS_PHRASE: "pass_phrase",
} as const;

// Type for credential field values
export type ProviderCredentialField =
  (typeof ProviderCredentialFields)[keyof typeof ProviderCredentialFields];

// API error pointer paths
export const ErrorPointers = {
  // Secret fields
  AWS_ACCESS_KEY_ID: "/data/attributes/secret/aws_access_key_id",
  AWS_SECRET_ACCESS_KEY: "/data/attributes/secret/aws_secret_access_key",
  AWS_SESSION_TOKEN: "/data/attributes/secret/aws_session_token",
  CLIENT_ID: "/data/attributes/secret/client_id",
  CLIENT_SECRET: "/data/attributes/secret/client_secret",
  USER: "/data/attributes/secret/user",
  PASSWORD: "/data/attributes/secret/password",
  TENANT_ID: "/data/attributes/secret/tenant_id",
  KUBECONFIG_CONTENT: "/data/attributes/secret/kubeconfig_content",
  REFRESH_TOKEN: "/data/attributes/secret/refresh_token",
  ROLE_ARN: "/data/attributes/secret/role_arn",
  EXTERNAL_ID: "/data/attributes/secret/external_id",
  SESSION_DURATION: "/data/attributes/secret/session_duration",
  ROLE_SESSION_NAME: "/data/attributes/secret/role_session_name",
  SERVICE_ACCOUNT_KEY: "/data/attributes/secret/service_account_key",
  PERSONAL_ACCESS_TOKEN: "/data/attributes/secret/personal_access_token",
  OAUTH_APP_TOKEN: "/data/attributes/secret/oauth_app_token",
  GITHUB_APP_ID: "/data/attributes/secret/github_app_id",
  GITHUB_APP_KEY: "/data/attributes/secret/github_app_key_content",
  REPOSITORY_URL: "/data/attributes/secret/repository_url",
  ACCESS_TOKEN: "/data/attributes/secret/access_token",
  CERTIFICATE_CONTENT: "/data/attributes/secret/certificate_content",
  OCI_USER: "/data/attributes/secret/user",
  OCI_FINGERPRINT: "/data/attributes/secret/fingerprint",
  OCI_KEY_FILE: "/data/attributes/secret/key_file",
  OCI_KEY_CONTENT: "/data/attributes/secret/key_content",
  OCI_TENANCY: "/data/attributes/secret/tenancy",
  OCI_REGION: "/data/attributes/secret/region",
  OCI_PASS_PHRASE: "/data/attributes/secret/pass_phrase",
  ATLAS_PUBLIC_KEY: "/data/attributes/secret/atlas_public_key",
  ATLAS_PRIVATE_KEY: "/data/attributes/secret/atlas_private_key",
} as const;

export type ErrorPointer = (typeof ErrorPointers)[keyof typeof ErrorPointers];
```

--------------------------------------------------------------------------------

---[FILE: next.svg]---
Location: prowler-master/ui/public/next.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: vercel.svg]---
Location: prowler-master/ui/public/vercel.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 283 64"><path fill="black" d="M141 16c-11 0-19 7-19 18s9 18 20 18c7 0 13-3 16-7l-7-5c-2 3-6 4-9 4-5 0-9-3-10-7h28v-3c0-11-8-18-19-18zm-9 15c1-4 4-7 9-7s8 3 9 7h-18zm117-15c-11 0-19 7-19 18s9 18 20 18c6 0 12-3 16-7l-8-5c-2 3-5 4-8 4-5 0-9-3-11-7h28l1-3c0-11-8-18-19-18zm-10 15c2-4 5-7 10-7s8 3 9 7h-19zm-39 3c0 6 4 10 10 10 4 0 7-2 9-5l8 5c-3 5-9 8-17 8-11 0-19-7-19-18s8-18 19-18c8 0 14 3 17 8l-8 5c-2-3-5-5-9-5-6 0-10 4-10 10zm83-29v46h-9V5h9zM37 0l37 64H0L37 0zm92 5-27 48L74 5h10l18 30 17-30h10zm59 12v10l-3-1c-6 0-10 4-10 10v15h-9V17h9v9c0-5 6-9 13-9z"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: postinstall.js]---
Location: prowler-master/ui/scripts/postinstall.js

```javascript
#!/usr/bin/env node

/**
 * Post-install script for Prowler UI
 *
 * This script runs after npm install to:
 * 1. Update dependency log (if the script exists)
 * 2. Setup git hooks (if the script exists)
 */

const fs = require("fs");
const path = require("path");

function runScriptIfExists(scriptPath, scriptName) {
  const fullPath = path.join(__dirname, scriptPath);

  if (fs.existsSync(fullPath)) {
    try {
      require(fullPath);
    } catch (error) {
      console.warn(`⚠️  Error running ${scriptName}:`, error.message);
    }
  } else {
    console.log(`Skip ${scriptName} (script missing)`);
  }
}

// Run dependency log update
runScriptIfExists("./update-dependency-log.js", "deps:log");

// Run git hooks setup
runScriptIfExists("./setup-git-hooks.js", "setup-git-hooks");
```

--------------------------------------------------------------------------------

---[FILE: setup-git-hooks.js]---
Location: prowler-master/ui/scripts/setup-git-hooks.js

```javascript
#!/usr/bin/env node

/**
 * Setup Git Hooks for Prowler UI
 *
 * This script checks if Python pre-commit is managing git hooks.
 * If not, it runs the repository's setup script to install pre-commit.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Check if Python pre-commit framework is managing git hooks
 */
function isPreCommitInstalled(gitRoot) {
  const hookPath = path.join(gitRoot, '.git', 'hooks', 'pre-commit');

  try {
    if (!fs.existsSync(hookPath)) return false;

    const content = fs.readFileSync(hookPath, 'utf8');
    return content.includes('pre-commit') || content.includes('INSTALL_PYTHON');
  } catch {
    return false;
  }
}

/**
 * Get git repository root directory
 */
function getGitRoot() {
  try {
    return execSync('git rev-parse --show-toplevel', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Run the repository setup script
 */
function runSetupScript(gitRoot) {
  const setupScript = path.join(gitRoot, 'scripts', 'setup-git-hooks.sh');

  if (!fs.existsSync(setupScript)) {
    throw new Error('Setup script not found');
  }

  execSync(`bash "${setupScript}"`, {
    cwd: gitRoot,
    stdio: 'inherit'
  });
}

// Main execution

// Skip in Docker/CI environments
if (process.env.DOCKER || process.env.CI || process.env.KUBERNETES_SERVICE_HOST) {
  console.log('⚠️  Running in containerized environment. Skipping git hooks setup.');
  process.exit(0);
}

const gitRoot = getGitRoot();

if (!gitRoot) {
  console.log('⚠️  Not in a git repository. Skipping git hooks setup.');
  process.exit(0);
}

if (isPreCommitInstalled(gitRoot)) {
  console.log('✅ Git hooks managed by Python pre-commit framework');
  console.log('   Husky hooks will be called automatically for UI files');
  process.exit(0);
}

// Pre-commit not installed - set it up
console.log('⚠️  Pre-commit hooks not installed');
console.log('📦 Installing pre-commit hooks from project dependencies...');
console.log('');

try {
  runSetupScript(gitRoot);
  console.log('');
  console.log('✅ Pre-commit hooks installed successfully');
} catch (error) {
  console.error('❌ Failed to setup git hooks');
  console.error('   Please run manually from repo root: ./scripts/setup-git-hooks.sh');
  process.exit(1);
}
```

--------------------------------------------------------------------------------

---[FILE: update-dependency-log.js]---
Location: prowler-master/ui/scripts/update-dependency-log.js

```javascript
const fs = require('fs');
const path = require('path');

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function getInstalledVersion(pkgName) {
  try {
    const parts = pkgName.split('/');
    const pkgPath = path.join('node_modules', ...parts, 'package.json');
    const meta = readJSON(pkgPath);
    return meta.version;
  } catch (e) {
    return null;
  }
}

function collect(sectionName, obj) {
  if (!obj) return [];
  return Object.entries(obj).map(([name, declared]) => {
    const installed = getInstalledVersion(name);
    return {
      section: sectionName,
      name,
      from: declared,
      to: installed || null,
      strategy: 'installed',
    };
  });
}

function main() {
  // If node_modules is missing, skip to avoid generating noisy diffs
  if (!fs.existsSync('node_modules')) {
    console.log('Skip: node_modules not found. Run npm install first.');
    return;
  }

  const pkg = readJSON('package.json');
  const entries = [
    ...collect('dependencies', pkg.dependencies),
    ...collect('devDependencies', pkg.devDependencies),
  ];

  // Stable sort by section then name
  entries.sort((a, b) =>
    a.section === b.section ? a.name.localeCompare(b.name) : a.section.localeCompare(b.section)
  );

  const outPath = path.join(process.cwd(), 'dependency-log.json');
  // Merge with previous to preserve generatedAt when unchanged
  let prevMap = new Map();
  if (fs.existsSync(outPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      for (const e of prev) {
        prevMap.set(`${e.section}::${e.name}`, e);
      }
    } catch {}
  }

  const now = new Date().toISOString();
  const merged = entries.map((e) => {
    const key = `${e.section}::${e.name}`;
    const prev = prevMap.get(key);
    if (!prev) {
      // New entry: keep declared as from
      return { ...e, generatedAt: now };
    }

    // If installed version changed, set from to previous installed version
    if (prev.to !== e.to) {
      return { ...e, from: prev.to, generatedAt: now };
    }

    // Otherwise preserve previous 'from' and timestamp
    return { ...e, from: prev.from, generatedAt: prev.generatedAt || now };
  });

  const nextContent = JSON.stringify(merged, null, 2) + '\n';
  if (fs.existsSync(outPath)) {
    try {
      const prevContent = fs.readFileSync(outPath, 'utf8');
      if (prevContent === nextContent) {
        console.log(`No changes for ${outPath} (entries: ${entries.length}).`);
        return;
      }
    } catch {}
  }
  fs.writeFileSync(outPath, nextContent);
  console.log(`Updated ${outPath} with ${entries.length} entries.`);
}

main();
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/sentry/index.ts

```typescript
// Re-export all Sentry utilities
export * from "./utils";
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/ui/sentry/README.md

```text
# Sentry Error Tracking Configuration

This folder contains all Sentry-related configuration and utilities for the Prowler UI.

## Files

- `sentry.server.config.ts` - Server-side error tracking configuration
- `sentry.edge.config.ts` - Edge runtime error tracking configuration
- `utils.ts` - Enums for standardized error types and sources
- `index.ts` - Main export file

## Client Configuration

The client-side configuration is located in `app/instrumentation.client.ts` following Next.js conventions.

## Usage

```typescript
// Import Sentry enums for error categorization
import { SentryErrorType, SentryErrorSource } from "@/sentry";

// Use in error handling
Sentry.captureException(error, {
  tags: {
    error_type: SentryErrorType.SERVER_ERROR,
    error_source: SentryErrorSource.API_ROUTE,
  },
});
```

## Environment Variables

Required environment variables (add to `.env`):

```env
SENTRY_DSN=https://YOUR_KEY@o0.ingest.sentry.io/0
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_KEY@o0.ingest.sentry.io/0
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=sntrys_YOUR_AUTH_TOKEN
SENTRY_ENVIRONMENT=development
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
```

## Ignored Errors

The following errors are intentionally ignored as they are expected behavior:
- `NEXT_REDIRECT` - Next.js redirect mechanism
- `NEXT_NOT_FOUND` - Next.js 404 handling
- `401` - Unauthorized (expected when token expires)
- `403` - Forbidden (expected for permission checks)
- `404` - Not Found (expected for missing resources)
```

--------------------------------------------------------------------------------

---[FILE: sentry.edge.config.ts]---
Location: prowler-master/ui/sentry/sentry.edge.config.ts

```typescript
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

// Only initialize Sentry if DSN is configured
if (SENTRY_DSN) {
  const isProduction = process.env.SENTRY_ENVIRONMENT === "pro";

  /**
   * Edge runtime Sentry configuration
   *
   * Edge runtime has stricter constraints than Node.js:
   * - Limited execution time (~10-30 seconds)
   * - Lower memory availability
   * - Reduced sample rates to minimize overhead
   * - No complex integrations
   */
  Sentry.init({
    // 📍 DSN - Data Source Name (identifies your Sentry project)
    dsn: SENTRY_DSN,

    // 🌍 Environment configuration
    environment: process.env.SENTRY_ENVIRONMENT || "local",

    // 📦 Release tracking
    release: process.env.SENTRY_RELEASE,

    // 📊 Sample Rates - Reduced for edge runtime constraints
    // 50% in dev, 25% in production (edge has lower overhead limits than server)
    tracesSampleRate: isProduction ? 0.25 : 0.5,

    // 🔌 Integrations - Edge runtime doesn't support all integrations
    integrations: [],

    // 🎣 Filter expected errors - Don't send noise to Sentry
    ignoreErrors: [
      // NextAuth redirect errors - Expected behavior in auth flow
      "NEXT_REDIRECT",
      "NEXT_NOT_FOUND",
      // Expected HTTP errors - Expected when users lack permissions
      "401", // Unauthorized - expected when token expires
      "403", // Forbidden - expected when no permissions
      "404", // Not Found - expected for missing resources
    ],

    beforeSend(event, hint) {
      // Add edge runtime context for debugging
      event.tags = {
        ...event.tags,
        runtime: "edge",
      };

      const error = hint.originalException;

      // Don't send NextAuth expected errors
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string" &&
        error.message.includes("NEXT_REDIRECT")
      ) {
        return null;
      }

      return event;
    },
  });
}
```

--------------------------------------------------------------------------------

---[FILE: sentry.server.config.ts]---
Location: prowler-master/ui/sentry/sentry.server.config.ts

```typescript
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

// Only initialize Sentry if DSN is configured
if (SENTRY_DSN) {
  const isProduction = process.env.SENTRY_ENVIRONMENT === "pro";

  /**
   * Server-side Sentry configuration
   *
   * This setup includes:
   * - Performance monitoring for server-side operations
   * - Error tracking for API routes and server actions
   * - beforeSend hook to filter noise and add context
   */
  Sentry.init({
    // 📍 DSN - Data Source Name (identifies your Sentry project)
    dsn: SENTRY_DSN,

    // 🌍 Environment configuration
    environment: process.env.SENTRY_ENVIRONMENT || "local",

    // 📦 Release tracking
    release: process.env.SENTRY_RELEASE,

    // 📊 Sample Rates - Performance monitoring
    // 100% in dev (test everything), 50% in production (balance visibility with costs)
    tracesSampleRate: isProduction ? 0.5 : 1.0,
    profilesSampleRate: isProduction ? 0.5 : 1.0,

    // 🔌 Integrations
    integrations: [
      Sentry.extraErrorDataIntegration({
        depth: 5, // Include up to 5 levels of nested objects
      }),
    ],

    // 🎣 Filter expected errors - Don't send noise to Sentry
    ignoreErrors: [
      // NextAuth redirect errors - Expected behavior
      "NEXT_REDIRECT",
      "NEXT_NOT_FOUND",
      // Expected HTTP errors - Expected when users lack permissions
      "401", // Unauthorized
      "403", // Forbidden
      "404", // Not Found
    ],

    beforeSend(event, hint) {
      // Add server context and tag errors appropriately
      if (event.exception) {
        const error = hint.originalException;

        // Tag API errors for better filtering in Sentry dashboard
        if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string"
        ) {
          if (error.message.includes("Server error")) {
            event.tags = {
              ...event.tags,
              error_type: "server_error",
              severity: "high",
            };
          } else if (error.message.includes("Request failed")) {
            event.tags = {
              ...event.tags,
              error_type: "api_error",
            };
          }

          // Don't send NextAuth expected errors
          if (error.message.includes("NEXT_REDIRECT")) {
            return null;
          }
        }
      }

      return event;
    },
  });
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: prowler-master/ui/sentry/utils.ts

```typescript
/**
 * Enum for standardized error types across the application
 */
export enum SentryErrorType {
  // API Errors
  API_ERROR = "api_error",
  SERVER_ERROR = "server_error",
  CLIENT_ERROR = "client_error",

  // Request Processing
  REQUEST_PROCESSING = "request_processing",
  STREAM_PROCESSING = "stream_processing",

  // Application Errors
  APPLICATION_ERROR = "application_error",
  UNEXPECTED_ERROR = "unexpected_error",
  NON_ERROR_OBJECT = "non_error_object",

  // Authentication
  AUTH_ERROR = "auth_error",
  PERMISSION_ERROR = "permission_error",

  // Server Actions
  SERVER_ACTION_ERROR = "server_action_error",

  // MCP Client
  MCP_CONNECTION_ERROR = "mcp_connection_error",
  MCP_DISCOVERY_ERROR = "mcp_discovery_error",
}

/**
 * Enum for error sources
 */
export enum SentryErrorSource {
  ERROR_BOUNDARY = "error_boundary",
  API_ROUTE = "api_route",
  SERVER_ACTION = "server_action",
  HANDLE_API_ERROR = "handleApiError",
  HANDLE_API_RESPONSE = "handleApiResponse",
  MCP_CLIENT = "mcp_client",
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/store/index.ts

```typescript
export * from "./ui/store";
```

--------------------------------------------------------------------------------

---[FILE: store-initializer.tsx]---
Location: prowler-master/ui/store/ui/store-initializer.tsx
Signals: React

```typescript
"use client";

import { useEffect } from "react";

import { useUIStore } from "@/store/ui/store";

interface StoreInitializerProps {
  values: {
    hasProviders?: boolean;
    // Add more properties here as needed
    // otherProperty?: string;
  };
}

export function StoreInitializer({ values }: StoreInitializerProps) {
  const setHasProviders = useUIStore((state) => state.setHasProviders);

  useEffect(() => {
    // Initialize store values from server
    if (values.hasProviders !== undefined) {
      setHasProviders(values.hasProviders);
    }
    // Add more setters here as needed in the future
  }, [values.hasProviders, setHasProviders]);

  return null;
}
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: prowler-master/ui/store/ui/store.ts

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStoreState {
  isSideMenuOpen: boolean;
  isMutelistModalOpen: boolean;
  hasProviders: boolean;
  shouldAutoOpenMutelist: boolean;

  openSideMenu: () => void;
  closeSideMenu: () => void;
  openMutelistModal: () => void;
  closeMutelistModal: () => void;
  setHasProviders: (value: boolean) => void;
  requestMutelistModalOpen: () => void;
  resetMutelistModalRequest: () => void;
}

export const useUIStore = create<UIStoreState>()(
  persist(
    (set) => ({
      isSideMenuOpen: false,
      isMutelistModalOpen: false,
      hasProviders: false,
      shouldAutoOpenMutelist: false,
      openSideMenu: () => set({ isSideMenuOpen: true }),
      closeSideMenu: () => set({ isSideMenuOpen: false }),
      openMutelistModal: () =>
        set({
          isMutelistModalOpen: true,
          shouldAutoOpenMutelist: false,
        }),
      closeMutelistModal: () => set({ isMutelistModalOpen: false }),
      setHasProviders: (value: boolean) => set({ hasProviders: value }),
      requestMutelistModalOpen: () => set({ shouldAutoOpenMutelist: true }),
      resetMutelistModalRequest: () => set({ shouldAutoOpenMutelist: false }),
    }),
    {
      name: "ui-store",
    },
  ),
);
```

--------------------------------------------------------------------------------

---[FILE: globals.css]---
Location: prowler-master/ui/styles/globals.css

```text
@import "tailwindcss";
@config "../tailwind.config.js";
@source "../node_modules/streamdown/dist/*.js";

@custom-variant dark (&:where(.dark, .dark *));

/* ===== LIGHT THEME (ROOT) ===== */
:root {
  /* Button Colors */
  --bg-button-primary: var(--color-emerald-300);
  --bg-button-primary-hover: var(--color-teal-200);
  --bg-button-primary-press: var(--color-emerald-400);
  --bg-button-secondary: var(--color-slate-950);
  --bg-button-secondary-press: var(--color-slate-800);
  --bg-button-tertiary: var(--color-blue-600);
  --bg-button-tertiary-hover: var(--color-blue-500);
  --bg-button-tertiary-active: var(--color-indigo-600);
  --bg-button-disabled: var(--color-neutral-300);

  /* Radar Map */
  --bg-radar-map: #b51c8033;
  --bg-radar-button: #b51c80;

  /* Neutral Map */
  --bg-neutral-map: var(--color-neutral-300);

  /* Input Colors */
  --bg-input-primary: var(--color-white);
  --border-input-primary: var(--color-slate-400);
  --border-input-primary-press: var(--color-slate-700);
  --border-input-primary-fill: var(--color-slate-500);

  /* Text Colors */
  --text-neutral-primary: var(--color-slate-950);
  --text-neutral-secondary: var(--color-zinc-800);
  --text-neutral-tertiary: var(--color-zinc-500);
  --text-error-primary: var(--color-red-600);
  --text-warning-primary: var(--color-orange-500);
  --text-success-primary: var(--color-green-600);

  /* Border Colors */
  --border-error-primary: var(--color-red-500);
  --border-neutral-primary: var(--color-neutral-200);
  --border-neutral-secondary: var(--color-slate-200);
  --border-neutral-tertiary: var(--color-slate-300);
  --border-tag-primary: var(--color-gray-400);
  --border-data-emphasis: rgba(0, 0, 0, 0.1);

  /* Background Colors */
  --bg-neutral-primary: #fdfdfd;
  --bg-neutral-secondary: var(--color-white);
  --bg-neutral-tertiary: #fbfdfd;
  --bg-tag-primary: var(--color-slate-50);
  --bg-pass-primary: var(--color-emerald-400);
  --bg-pass-secondary: var(--color-emerald-50);
  --bg-warning-primary: var(--color-orange-500);
  --bg-fail-primary: var(--color-rose-500);
  --bg-fail-secondary: var(--color-rose-50);

  /* Data Background Colors */
  --bg-data-azure: var(--color-sky-400);
  --bg-data-kubernetes: var(--color-indigo-600);
  --bg-data-aws: var(--color-amber-500);
  --bg-data-gcp: var(--color-red-500);
  --bg-data-m365: var(--color-green-400);
  --bg-data-github: var(--color-slate-950);

  /* Severity Colors */
  --bg-data-critical: #ff006a;
  --bg-data-high: #f77852;
  --bg-data-medium: #fdd34f;
  --bg-data-low: #f5f3ce;
  --bg-data-info: #3c8dff;
  --bg-data-muted: var(--color-neutral-500);

  /* Chart Dots */
  --chart-dots: var(--color-neutral-200);

  /* Progress Bar */
  --shadow-progress-glow: 0 0 10px var(--bg-button-primary), 0 0 5px var(--bg-button-primary);
}

/* ===== DARK THEME ===== */
.dark {
  /* Button Colors */
  --bg-button-primary: var(--color-emerald-300);
  --bg-button-primary-hover: var(--color-teal-200);
  --bg-button-primary-press: var(--color-emerald-400);
  --bg-button-secondary: var(--color-white);
  --bg-button-secondary-press: var(--color-emerald-100);
  --bg-button-tertiary: var(--color-blue-300);
  --bg-button-tertiary-hover: var(--color-blue-400);
  --bg-button-tertiary-active: var(--color-blue-600);
  --bg-button-disabled: var(--color-neutral-700);

  /* Neutral Map */
  --bg-neutral-map: var(--color-gray-800);

  /* Input Colors */
  --bg-input-primary: var(--color-neutral-900);
  --border-input-primary: var(--color-neutral-800);
  --border-input-primary-press: var(--color-neutral-800);
  --border-input-primary-fill: var(--color-neutral-300);

  /* Text Colors */
  --text-neutral-primary: var(--color-zinc-100);
  --text-neutral-secondary: var(--color-zinc-300);
  --text-neutral-tertiary: var(--color-zinc-400);
  --text-error-primary: var(--color-red-500);
  --text-warning-primary: var(--color-orange-500);
  --text-success-primary: var(--color-green-500);

  /* Border Colors */
  --border-error-primary: var(--color-red-400);
  --border-neutral-primary: var(--color-zinc-800);
  --border-neutral-secondary: var(--color-zinc-900);
  --border-neutral-tertiary: var(--color-zinc-900);
  --border-tag-primary: var(--color-slate-700);
  --border-data-emphasis: rgba(255, 255, 255, 0.1);

  /* Background Colors */
  --bg-neutral-primary: var(--color-zinc-950);
  --bg-neutral-secondary: var(--color-stone-950);
  --bg-neutral-tertiary: #121110;
  --bg-tag-primary: var(--color-slate-950);
  --bg-pass-primary: var(--color-green-400);
  --bg-pass-secondary: var(--color-emerald-900);
  --bg-warning-primary: var(--color-orange-400);
  --bg-fail-primary: var(--color-rose-500);
  --bg-fail-secondary: #432232;

  /* Data Background Colors */
  --bg-data-azure: var(--color-sky-400);
  --bg-data-kubernetes: var(--color-indigo-600);
  --bg-data-aws: var(--color-amber-500);
  --bg-data-gcp: var(--color-red-500);
  --bg-data-m365: var(--color-green-400);
  --bg-data-github: var(--color-neutral-100);

  /* Severity Colors */
  --bg-data-critical: #ff006a;
  --bg-data-high: #f77852;
  --bg-data-medium: #fec94d;
  --bg-data-low: #fdfbd4;
  --bg-data-info: #3c8dff;
  --bg-data-muted: var(--color-neutral-500);

  /* Chart Dots */
  --chart-dots: var(--text-neutral-primary);

  /* Progress Bar */
  --shadow-progress-glow: 0 0 10px var(--bg-button-primary), 0 0 5px var(--bg-button-primary);
}

/* ===== TAILWIND THEME MAPPINGS ===== */
@theme {
  /* Data Background Colors */
  --color-bg-data-azure: var(--bg-data-azure);
  --color-bg-data-kubernetes: var(--bg-data-kubernetes);
  --color-bg-data-aws: var(--bg-data-aws);
  --color-bg-data-gcp: var(--bg-data-gcp);
  --color-bg-data-m365: var(--bg-data-m365);
  --color-bg-data-github: var(--bg-data-github);
  --color-bg-data-critical: var(--bg-data-critical);
  --color-bg-data-high: var(--bg-data-high);
  --color-bg-data-medium: var(--bg-data-medium);
  --color-bg-data-low: var(--bg-data-low);
  --color-bg-data-info: var(--bg-data-info);
  --color-bg-data-muted: var(--bg-data-muted);

  /* Button Colors */
  --color-button-primary: var(--bg-button-primary);
  --color-button-primary-hover: var(--bg-button-primary-hover);
  --color-button-primary-press: var(--bg-button-primary-press);
  --color-button-secondary: var(--bg-button-secondary);
  --color-button-secondary-press: var(--bg-button-secondary-press);
  --color-button-tertiary: var(--bg-button-tertiary);
  --color-button-tertiary-hover: var(--bg-button-tertiary-hover);
  --color-button-tertiary-active: var(--bg-button-tertiary-active);
  --color-button-disabled: var(--bg-button-disabled);

  /* Input Colors */
  --color-bg-input-primary: var(--bg-input-primary);
  --color-border-input-primary: var(--border-input-primary);
  --color-border-input-primary-press: var(--border-input-primary-press);
  --color-border-input-primary-fill: var(--border-input-primary-fill);

  /* Neutral Map Colors */
  --color-bg-neutral-map: var(--bg-neutral-map);

  /* Success Colors */
  --color-text-success: var(--text-success-primary);

  /* Border Colors */
  --color-border-error: var(--border-error-primary);
  --color-border-neutral-primary: var(--border-neutral-primary);
  --color-border-neutral-secondary: var(--border-neutral-secondary);
  --color-border-neutral-tertiary: var(--border-neutral-tertiary);
  --color-border-tag: var(--border-tag-primary);
  --color-border-data-emphasis: var(--border-data-emphasis);

  /* Text Colors */
  --color-text-neutral-primary: var(--text-neutral-primary);
  --color-text-neutral-secondary: var(--text-neutral-secondary);
  --color-text-neutral-tertiary: var(--text-neutral-tertiary);
  --color-text-error-primary: var(--text-error-primary);
  --color-text-warning-primary: var(--text-warning-primary);
  --color-text-success-primary: var(--text-success-primary);

  /* Background Colors */
  --color-bg-neutral-primary: var(--bg-neutral-primary);
  --color-bg-neutral-secondary: var(--bg-neutral-secondary);
  --color-bg-neutral-tertiary: var(--bg-neutral-tertiary);
  --color-bg-tag: var(--bg-tag-primary);
  --color-bg-pass: var(--bg-pass-primary);
  --color-bg-pass-secondary: var(--bg-pass-secondary);
  --color-bg-warning: var(--bg-warning-primary);
  --color-bg-fail: var(--bg-fail-primary);
  --color-bg-fail-secondary: var(--bg-fail-secondary);

  /* Shadows */
  --shadow-progress-glow: var(--shadow-progress-glow);
}

/* ===== CONTAINER UTILITY ===== */
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}

/* ===== COMPONENT LAYER ===== */
@layer components {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}

/* ===== UTILITY LAYER ===== */
@layer utilities {
  /* Screen reader only - visually hidden but accessible */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Hide scrollbar */
  .no-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* Minimal scrollbar styles */
  .minimal-scrollbar {
    scrollbar-width: thin; /* Firefox */
    scrollbar-color: rgb(203 213 225 / 0.5) transparent; /* thumb and track for Firefox */
  }

  .minimal-scrollbar:hover {
    scrollbar-color: rgb(148 163 184 / 0.7) transparent; /* darker thumb on hover */
  }

  /* Webkit browsers (Chrome, Safari, Edge) */
  .minimal-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .minimal-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .minimal-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgb(203 213 225 / 0.5);
    border-radius: 3px;
    transition: background-color 0.2s ease;
  }

  .minimal-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgb(148 163 184 / 0.7);
  }

  /* Dark mode */
  .dark .minimal-scrollbar {
    scrollbar-color: rgb(71 85 105 / 0.5) transparent;
  }

  .dark .minimal-scrollbar:hover {
    scrollbar-color: rgb(100 116 139 / 0.7) transparent;
  }

  .dark .minimal-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgb(71 85 105 / 0.5);
  }

  .dark .minimal-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgb(100 116 139 / 0.7);
  }

  .checkbox-update {
    margin-right: 0.5rem;
    background-color: var(--background);
  }

  /* Download icon animation */
  .animate-download-icon polyline,
  .animate-download-icon line {
    animation: dropArrow 0.6s ease-out infinite;
    transform-box: fill-box;
    transform-origin: center;
  }
}

/* ===== BASE LAYER ===== */
@layer base {
  /* Global base styles */
  body {
    @apply bg-background text-foreground;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: auth-middleware-error.spec.ts]---
Location: prowler-master/ui/tests/auth-middleware-error.spec.ts

```typescript
import { test, expect } from "@playwright/test";
import {
  goToLogin,
  login,
  verifySuccessfulLogin,
  verifySessionValid,
  TEST_CREDENTIALS,
  URLS,
} from "./helpers";

test.describe("Middleware Error Handling", () => {
  test("should allow access to public routes without session", async ({
    page,
    context,
  }) => {
    // Ensure no session exists
    await context.clearCookies();

    // Try to access login page (public route)
    await page.goto(URLS.LOGIN);
    await expect(page).toHaveURL(URLS.LOGIN);
    await expect(page.getByText("Sign in", { exact: true })).toBeVisible();

    // Try to access sign-up page (public route)
    await page.goto(URLS.SIGNUP);
    await expect(page).toHaveURL(URLS.SIGNUP);
  });

  test("should maintain protection after session error", async ({
    page,
    context,
  }) => {
    // Login
    await goToLogin(page);
    await login(page, TEST_CREDENTIALS.VALID);
    await verifySuccessfulLogin(page);

    // Navigate to a protected page
    await page.goto("/providers");
    await expect(page).toHaveURL("/providers");

    // Simulate session error by corrupting cookie
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) =>
      c.name.includes("authjs.session-token"),
    );

    if (sessionCookie) {
      await context.clearCookies();
      await context.addCookies([
        {
          ...sessionCookie,
          value: "invalid-session-token",
        },
      ]);

      // Try to navigate to another protected page
      await page.goto("/scans", { waitUntil: "networkidle" });

      // Should be redirected to login (may include callbackUrl)
      await expect(page).toHaveURL(/\/sign-in/);
    }
  });

  test("should handle permission-based redirects", async ({ page }) => {
    // Login with valid credentials
    await goToLogin(page);
    await login(page, TEST_CREDENTIALS.VALID);
    await verifySuccessfulLogin(page);

    // Get user permissions using helper
    const session = await verifySessionValid(page);
    const permissions = session.user.permissions;

    // Test billing route if user doesn't have permission
    if (!permissions.manage_billing) {
      await page.goto("/billing", { waitUntil: "networkidle" });

      // Should be redirected to profile (as per middleware logic)
      await expect(page).toHaveURL("/profile");
    }

    // Test integrations route if user doesn't have permission
    if (!permissions.manage_integrations) {
      await page.goto("/integrations", { waitUntil: "networkidle" });

      // Should be redirected to profile (as per middleware logic)
      await expect(page).toHaveURL("/profile");
    }
  });

});
```

--------------------------------------------------------------------------------

````
