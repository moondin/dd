---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 775
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 775 of 867)

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

---[FILE: instrumentation.ts]---
Location: prowler-master/ui/instrumentation.ts

```typescript
/**
 * Next.js Instrumentation Hook
 *
 * This file is automatically executed by Next.js at startup to initialize server-side SDKs.
 *
 * Configuration Flow:
 * 1. This file (instrumentation.ts) - Server-side initialization
 * 2. Runtime-specific configs:
 *    - sentry/sentry.server.config.ts (Node.js runtime)
 *    - sentry/sentry.edge.config.ts (Edge runtime)
 * 3. Client-side init:
 *    - app/instrumentation.client.ts (Browser/Client)
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

export async function register() {
  // Skip Sentry initialization if DSN is not configured
  if (!SENTRY_DSN) {
    return;
  }

  // The Sentry SDK automatically loads the appropriate config based on runtime
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry/sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry/sentry.edge.config");
  }
}

// Only capture request errors if Sentry is configured
export const onRequestError = SENTRY_DSN
  ? Sentry.captureRequestError
  : undefined;
```

--------------------------------------------------------------------------------

---[FILE: middleware.ts]---
Location: prowler-master/ui/middleware.ts
Signals: Next.js

```typescript
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth.config";

const publicRoutes = [
  "/sign-in",
  "/sign-up",
  // In Cloud uncomment the following lines:
  // "/reset-password",
  // "/email-verification",
  // "/set-password",
];

const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some((route) => pathname.startsWith(route));
};

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;
  const sessionError = req.auth?.error;

  // If there's a session error (e.g., RefreshAccessTokenError), redirect to login with error info
  if (sessionError && !isPublicRoute(pathname)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("error", sessionError);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (!user && !isPublicRoute(pathname)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (user?.permissions) {
    const permissions = user.permissions;

    if (pathname.startsWith("/billing") && !permissions.manage_billing) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    if (
      pathname.startsWith("/integrations") &&
      !permissions.manage_integrations
    ) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - *.png, *.jpg, *.jpeg, *.svg, *.ico (image files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|css|js)$).*)",
  ],
};
```

--------------------------------------------------------------------------------

---[FILE: next.config.js]---
Location: prowler-master/ui/next.config.js

```javascript
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
dotenvExpand.expand(dotenv.config({ path: "../.env", quiet: true }));
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */

// HTTP Security Headers
// 'unsafe-eval' is configured under `script-src` because it is required by NextJS for development mode
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://browser.sentry-cdn.com;
  connect-src 'self' https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com https://js.stripe.com https://www.googletagmanager.com https://*.sentry.io https://*.ingest.sentry.io;
  img-src 'self' https://www.google-analytics.com https://www.googletagmanager.com;
  font-src 'self';
  style-src 'self' 'unsafe-inline';
  frame-src 'self' https://js.stripe.com https://www.googletagmanager.com;
  frame-ancestors 'none';
  report-to csp-endpoint;
`;

// Get Sentry CSP report endpoint if DSN is configured
const getSentryReportEndpoint = () => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return null;
  try {
    const sentryKey =
      process.env.NEXT_PUBLIC_SENTRY_DSN.split("@")[0]?.split("//")[1];
    return sentryKey
      ? `https://o0.ingest.sentry.io/api/0/security/?sentry_key=${sentryKey}`
      : null;
  } catch {
    return null;
  }
};

const nextConfig = {
  poweredByHeader: false,
  // Use standalone only in production deployments, not for CI/testing
  ...(process.env.NODE_ENV === "production" &&
    !process.env.CI && {
      output: "standalone",
      outputFileTracingRoot: __dirname,
    }),
  experimental: {
    reactCompiler: true,
  },
  turbopack: {
    root: __dirname,
  },
  async headers() {
    const sentryEndpoint = getSentryReportEndpoint();
    const headers = [
      {
        key: "Content-Security-Policy",
        value: cspHeader.replace(/\n/g, ""),
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
    ];

    // Add Reporting-Endpoints header if Sentry is configured
    if (sentryEndpoint) {
      headers.push({
        key: "Reporting-Endpoints",
        value: `csp-endpoint="${sentryEndpoint}"`,
      });
    }

    return [
      {
        source: "/(.*)",
        headers,
      },
    ];
  },
};

// Sentry configuration options
const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true, // Suppresses all logs
  hideSourceMaps: true, // Hides source maps from generated client bundles
  disableLogger: true, // Automatically tree-shake Sentry logger statements to reduce bundle size
  widenClientFileUpload: true, // Upload a larger set of source maps for prettier stack traces
};

// Export with Sentry only if configuration is available
module.exports = process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;
```

--------------------------------------------------------------------------------

---[FILE: nextauth.d.ts]---
Location: prowler-master/ui/nextauth.d.ts

```typescript
import type { DefaultSession, User as NextAuthUser } from "next-auth";

import { RolePermissionAttributes } from "./types/users";

declare module "next-auth" {
  interface User extends NextAuthUser {
    name: string;
    email: string;
    company?: string;
    dateJoined: string;
    permissions?: RolePermissionAttributes;
  }

  type SessionUser = NonNullable<DefaultSession["user"]> & {
    companyName?: string;
    dateJoined?: string;
    permissions: RolePermissionAttributes;
  };

  interface Session extends DefaultSession {
    user?: SessionUser;
    userId?: string;
    tenantId?: string;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: prowler-master/ui/package.json
Signals: React, Next.js

```json
{
  "name": "prowler-next-app",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "start:standalone": "node .next/standalone/server.js",
    "deps:log": "node scripts/update-dependency-log.js",
    "postinstall": "node scripts/postinstall.js",
    "typecheck": "tsc",
    "healthcheck": "pnpm run typecheck && pnpm run lint:check",
    "lint:check": "eslint . --ext .ts,.tsx -c .eslintrc.cjs",
    "lint:fix": "eslint . --ext .ts,.tsx -c .eslintrc.cjs --fix",
    "format:check": "./node_modules/.bin/prettier --check ./app",
    "format:write": "./node_modules/.bin/prettier --config .prettierrc.json --write ./app",
    "prepare": "husky",
    "test:e2e": "playwright test --project=chromium --project=sign-up --project=providers --project=invitations --project=scans",
    "test:e2e:ui": "playwright test --project=chromium --project=sign-up --project=providers --project=invitations --project=scans --ui",
    "test:e2e:debug": "playwright test --project=chromium --project=sign-up --project=providers --project=invitations --project=scans --debug",
    "test:e2e:headed": "playwright test --project=chromium --project=sign-up --project=providers --project=invitations --project=scans --headed",
    "test:e2e:report": "playwright show-report",
    "test:e2e:install": "playwright install",
    "audit:fix": "pnpm audit fix"
  },
  "dependencies": {
    "@ai-sdk/react": "2.0.111",
    "@aws-sdk/client-bedrock-runtime": "3.948.0",
    "@heroui/react": "2.8.4",
    "@hookform/resolvers": "5.2.2",
    "@internationalized/date": "3.10.0",
    "@langchain/aws": "1.1.0",
    "@langchain/core": "1.1.4",
    "@langchain/mcp-adapters": "1.0.3",
    "@langchain/openai": "1.1.3",
    "@next/third-parties": "15.5.9",
    "@radix-ui/react-alert-dialog": "1.1.14",
    "@radix-ui/react-avatar": "1.1.11",
    "@radix-ui/react-collapsible": "1.1.12",
    "@radix-ui/react-dialog": "1.1.14",
    "@radix-ui/react-dropdown-menu": "2.1.15",
    "@radix-ui/react-icons": "1.3.2",
    "@radix-ui/react-label": "2.1.7",
    "@radix-ui/react-popover": "1.1.15",
    "@radix-ui/react-scroll-area": "1.2.10",
    "@radix-ui/react-select": "2.2.5",
    "@radix-ui/react-separator": "1.1.7",
    "@radix-ui/react-slot": "1.2.3",
    "@radix-ui/react-tabs": "1.1.13",
    "@radix-ui/react-toast": "1.2.14",
    "@radix-ui/react-tooltip": "1.2.8",
    "@radix-ui/react-use-controllable-state": "1.2.2",
    "@react-aria/i18n": "3.12.13",
    "@react-aria/ssr": "3.9.4",
    "@react-aria/visually-hidden": "3.8.12",
    "@react-stately/utils": "3.10.8",
    "@react-types/datepicker": "3.13.2",
    "@react-types/shared": "3.26.0",
    "@sentry/nextjs": "10.27.0",
    "@tailwindcss/postcss": "4.1.13",
    "@tailwindcss/typography": "0.5.16",
    "@tanstack/react-table": "8.21.3",
    "@types/js-yaml": "4.0.9",
    "ai": "5.0.109",
    "alert": "6.0.2",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "cmdk": "1.1.1",
    "d3": "7.9.0",
    "date-fns": "4.1.0",
    "framer-motion": "11.18.2",
    "import-in-the-middle": "2.0.0",
    "intl-messageformat": "10.7.16",
    "jose": "5.10.0",
    "js-yaml": "4.1.1",
    "jwt-decode": "4.0.0",
    "langchain": "1.1.5",
    "lucide-react": "0.543.0",
    "marked": "15.0.12",
    "nanoid": "5.1.6",
    "next": "15.5.9",
    "next-auth": "5.0.0-beta.30",
    "next-themes": "0.2.1",
    "radix-ui": "1.4.2",
    "react": "19.2.2",
    "react-dom": "19.2.2",
    "react-hook-form": "7.62.0",
    "react-markdown": "10.1.0",
    "recharts": "2.15.4",
    "require-in-the-middle": "8.0.1",
    "rss-parser": "3.13.0",
    "server-only": "0.0.1",
    "sharp": "0.33.5",
    "shiki": "3.20.0",
    "streamdown": "1.6.10",
    "tailwind-merge": "3.3.1",
    "tailwindcss-animate": "1.0.7",
    "topojson-client": "3.1.0",
    "tw-animate-css": "1.4.0",
    "use-stick-to-bottom": "1.1.1",
    "uuid": "11.1.0",
    "world-atlas": "2.0.2",
    "zod": "4.1.11",
    "zustand": "5.0.8"
  },
  "devDependencies": {
    "@iconify/react": "5.2.1",
    "@playwright/test": "1.56.1",
    "@types/d3": "7.4.3",
    "@types/geojson": "7946.0.16",
    "@types/node": "20.5.7",
    "@types/react": "19.1.13",
    "@types/react-dom": "19.1.9",
    "@types/topojson-client": "3.1.5",
    "@types/topojson-specification": "1.0.5",
    "@types/uuid": "10.0.0",
    "@typescript-eslint/eslint-plugin": "7.18.0",
    "@typescript-eslint/parser": "7.18.0",
    "autoprefixer": "10.4.19",
    "babel-plugin-react-compiler": "19.1.0-rc.3",
    "dotenv-expand": "12.0.3",
    "eslint": "8.57.1",
    "eslint-config-next": "15.5.9",
    "eslint-config-prettier": "10.1.5",
    "eslint-plugin-import": "2.32.0",
    "eslint-plugin-jsx-a11y": "6.10.2",
    "eslint-plugin-node": "11.1.0",
    "eslint-plugin-prettier": "5.5.1",
    "eslint-plugin-react": "7.37.5",
    "eslint-plugin-react-hooks": "7.0.1",
    "eslint-plugin-security": "3.0.1",
    "eslint-plugin-simple-import-sort": "12.1.1",
    "eslint-plugin-unused-imports": "3.2.0",
    "husky": "9.1.7",
    "lint-staged": "15.5.2",
    "postcss": "8.4.38",
    "prettier": "3.6.2",
    "prettier-plugin-tailwindcss": "0.6.14",
    "shadcn": "3.4.1",
    "tailwind-variants": "0.1.20",
    "tailwindcss": "4.1.13",
    "typescript": "5.5.4"
  },
  "pnpm": {
    "overrides": {
      "@react-types/shared": "3.26.0",
      "@internationalized/date": "3.10.0",
      "alert>react": "19.2.2",
      "alert>react-dom": "19.2.2",
      "@react-aria/ssr>react": "19.2.2",
      "@react-aria/ssr>react-dom": "19.2.2",
      "@react-aria/visually-hidden>react": "19.2.2",
      "@react-aria/interactions>react": "19.2.2"
    }
  },
  "version": "0.0.1"
}
```

--------------------------------------------------------------------------------

---[FILE: playwright.config.ts]---
Location: prowler-master/ui/playwright.config.ts

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  outputDir: "/tmp/playwright-tests",
  expect: {
    timeout: 20000,
  },

  use: {
    baseURL: process.env.AUTH_URL
      ? process.env.AUTH_URL
      : "http://localhost:3000",
    trace: "off",
    screenshot: "off",
    video: "off",
  },

  projects: [
    // ===========================================
    // Authentication Setup Projects
    // ===========================================
    // These projects handle user authentication for different permission levels
    // Each setup creates authenticated state files that can be reused by test suites

    // Admin user authentication setup
    // Creates authenticated state for admin users with full system permissions
    {
      name: "admin.auth.setup",
      testMatch: "admin.auth.setup.ts",
    },

    // Scans management user authentication setup
    // Creates authenticated state for users with scan management permissions
    {
      name: "manage-scans.auth.setup",
      testMatch: "manage-scans.auth.setup.ts",
    },

    // Integrations management user authentication setup
    // Creates authenticated state for users with integration management permissions
    {
      name: "manage-integrations.auth.setup",
      testMatch: "manage-integrations.auth.setup.ts",
    },

    // Account management user authentication setup
    // Creates authenticated state for users with account management permissions
    {
      name: "manage-account.auth.setup",
      testMatch: "manage-account.auth.setup.ts",
    },

    // Cloud providers management user authentication setup
    // Creates authenticated state for users with cloud provider management permissions
    {
      name: "manage-cloud-providers.auth.setup",
      testMatch: "manage-cloud-providers.auth.setup.ts",
    },

    // Unlimited visibility user authentication setup
    // Creates authenticated state for users with unlimited visibility permissions
    {
      name: "unlimited-visibility.auth.setup",
      testMatch: "unlimited-visibility.auth.setup.ts",
    },

    // Invite and manage users authentication setup
    // Creates authenticated state for users with user invitation and management permissions
    {
      name: "invite-and-manage-users.auth.setup",
      testMatch: "invite-and-manage-users.auth.setup.ts",
    },

    // All authentication setups combined
    // Runs all authentication setup files to create all user states
    {
      name: "all.auth.setup",
      testMatch: "**/*.auth.setup.ts",
    },

    // ===========================================
    // Test Suite Projects
    // ===========================================
    // These projects run the actual test suites
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "auth-login.spec.ts",
    },
    // This project runs the sign-up test suite
    {
      name: "sign-up",
      testMatch: "sign-up.spec.ts",
    },
    // This project runs the scans test suite
    {
      name: "scans",
      testMatch: "scans.spec.ts",
      dependencies: ["admin.auth.setup"],
    },
    // This project runs the providers test suite
    {
      name: "providers",
      testMatch: "providers.spec.ts",
      dependencies: ["admin.auth.setup"],
    },
    // This project runs the invitations test suite
    {
      name: "invitations",
      testMatch: "invitations.spec.ts",
      dependencies: ["admin.auth.setup"],
    },
  ],

  webServer: {
    command: process.env.CI ? "npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NEXT_PUBLIC_API_BASE_URL:
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1",
      AUTH_SECRET: process.env.AUTH_SECRET || "fallback-ci-secret-for-testing",
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST || "true",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
      E2E_USER: process.env.E2E_USER || "e2e@prowler.com",
      E2E_PASSWORD: process.env.E2E_PASSWORD || "Thisisapassword123@",
    },
  },
});
```

--------------------------------------------------------------------------------

````
