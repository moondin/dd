---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 782
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 782 of 867)

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

---[FILE: tenants.ts]---
Location: prowler-master/ui/actions/users/tenants.ts
Signals: Zod

```typescript
"use server";

import { z } from "zod";

import { apiBaseUrl, getAuthHeaders } from "@/lib/helper";
import { handleApiError, handleApiResponse } from "@/lib/server-actions-helper";

export const getAllTenants = async () => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/tenants`);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tenants data: ${response.statusText}`);
    }

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return undefined;
  }
};

const editTenantFormSchema = z
  .object({
    tenantId: z.string(),
    name: z.string().trim().min(1, { message: "Name is required" }),
    currentName: z.string(),
  })
  .refine((data) => data.name !== data.currentName, {
    message: "Name must be different from the current name",
    path: ["name"],
  });

export async function updateTenantName(_prevState: any, formData: FormData) {
  const headers = await getAuthHeaders({ contentType: true });
  const formDataObject = Object.fromEntries(formData);
  const validatedData = editTenantFormSchema.safeParse(formDataObject);

  if (!validatedData.success) {
    const formFieldErrors = validatedData.error.flatten().fieldErrors;

    return {
      errors: {
        name: formFieldErrors?.name?.[0],
      },
    };
  }

  const { tenantId, name } = validatedData.data;

  const payload = {
    data: {
      type: "tenants",
      id: tenantId,
      attributes: {
        name: name.trim(),
      },
    },
  };

  try {
    const url = new URL(`${apiBaseUrl}/tenants/${tenantId}`);
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update tenant name: ${response.statusText}`);
    }

    await handleApiResponse(response, "/profile", false);
    return { success: "Tenant name updated successfully!" };
  } catch (error) {
    return handleApiError(error);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: users.ts]---
Location: prowler-master/ui/actions/users/users.ts
Signals: Next.js

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiError, handleApiResponse } from "@/lib/server-actions-helper";

export const getUsers = async ({
  page = 1,
  query = "",
  sort = "",
  filters = {},
  pageSize = 10,
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  if (isNaN(Number(page)) || page < 1) redirect("/users?include=roles");

  const url = new URL(`${apiBaseUrl}/users?include=roles`);

  if (page) url.searchParams.append("page[number]", page.toString());
  if (pageSize) url.searchParams.append("page[size]", pageSize.toString());
  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  // Handle multiple filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key !== "filter[search]") {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const users = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return undefined;
  }
};

export const updateUser = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });

  const userId = formData.get("userId") as string; // Ensure userId is a string
  const userName = formData.get("name") as string | null;
  const userPassword = formData.get("password") as string | null;
  const userEmail = formData.get("email") as string | null;
  const userCompanyName = formData.get("company_name") as string | null;

  const url = new URL(`${apiBaseUrl}/users/${userId}`);

  // Prepare attributes to send based on changes
  const attributes: Record<string, any> = {};

  // Add only changed fields
  if (userName !== null) attributes.name = userName;
  if (userEmail !== null) attributes.email = userEmail;
  if (userCompanyName !== null) attributes.company_name = userCompanyName;
  if (userPassword !== null) attributes.password = userPassword;

  // If no fields have changed, don't send the request
  if (Object.keys(attributes).length === 0) {
    return { error: "No changes detected" };
  }

  try {
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        data: {
          type: "users",
          id: userId,
          attributes: attributes,
        },
      }),
    });

    return handleApiResponse(response, "/users");
  } catch (error) {
    handleApiError(error);
  }
};

export const updateUserRole = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });

  const userId = formData.get("userId") as string;
  const roleId = formData.get("roleId") as string;

  // Validate required fields
  if (!userId || !roleId) {
    return { error: "userId and roleId are required" };
  }

  const url = new URL(`${apiBaseUrl}/users/${userId}/relationships/roles`);

  const requestBody = {
    data: [
      {
        type: "roles",
        id: roleId,
      },
    ],
  };

  try {
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify(requestBody),
    });

    return handleApiResponse(response, "/users");
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteUser = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: false });
  const userId = formData.get("userId");

  if (!userId) {
    return { error: "User ID is required" };
  }

  const url = new URL(`${apiBaseUrl}/users/${userId}`);

  try {
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      // Parse error response
      const errorData = await response.json();
      return {
        errors: errorData.errors || [{ detail: "Failed to delete the user" }],
      };
    }

    let data = null;
    if (response.status !== 204) {
      data = await response.json();
    }

    revalidatePath("/users");
    return data || { success: true };
  } catch (error) {
    handleApiError(error);
  }
};

export const getUserInfo = async () => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(
    `${apiBaseUrl}/users/me?include=roles,memberships,memberships.tenant`,
  );

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return undefined;
  }
};

export const getUserMemberships = async (userId: string) => {
  if (!userId) {
    return { data: [] };
  }

  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/users/${userId}/memberships`);
  url.searchParams.append("page[size]", "100");

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching user memberships:", error);
    return { data: [] };
  }
};
```

--------------------------------------------------------------------------------

---[FILE: global-error.tsx]---
Location: prowler-master/ui/app/global-error.tsx
Signals: React, Next.js

```typescript
"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

import { SentryErrorSource, SentryErrorType } from "@/sentry";

export default function GlobalError({
  error,
  reset: _reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: {
        error_boundary: "global",
        error_type: SentryErrorType.APPLICATION_ERROR,
        error_source: SentryErrorSource.ERROR_BOUNDARY,
        digest: error.digest,
      },
      level: "error",
      contexts: {
        react: {
          componentStack: error.stack,
        },
      },
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <NextError statusCode={500} />
      </body>
    </html>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: instrumentation.client.ts]---
Location: prowler-master/ui/app/instrumentation.client.ts

```typescript
"use client";

/**
 * Client-side Sentry instrumentation
 *
 * This file is automatically loaded by Next.js in the browser via the instrumentation hook.
 * It configures Sentry for client-side error tracking and performance monitoring.
 *
 * For server-side configuration, see: instrumentation.ts
 * For runtime-specific configs, see: sentry/sentry.server.config.ts and sentry/sentry.edge.config.ts
 */

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry in the browser (not during SSR)
if (typeof window !== "undefined" && SENTRY_DSN) {
  const isDevelopment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT === "local";

  /**
   * Initialize Sentry error tracking and performance monitoring
   *
   * This setup includes:
   * - Performance monitoring with Web Vitals tracking (LCP, FID, CLS, INP)
   * - Long task detection for UI-blocking operations
   * - beforeSend hook to filter noise
   */
  Sentry.init({
    // 📍 DSN - Data Source Name (identifies your Sentry project)
    dsn: SENTRY_DSN,

    // 🌍 Environment - Separate dev errors from production
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "local",

    // 📦 Release - Track which version has the error
    release: process.env.NEXT_PUBLIC_PROWLER_RELEASE_VERSION,

    // 🐛 Debug - Detailed logs in development console
    debug: isDevelopment,

    // 📊 Sample Rates - Performance monitoring
    // 100% in dev (test everything), 50% in production (balance visibility with costs)
    tracesSampleRate: isDevelopment ? 1.0 : 0.5,
    profilesSampleRate: isDevelopment ? 1.0 : 0.5,

    // 🔌 Integrations - browserTracingIntegration is client-only
    integrations: [
      // 📊 Performance Monitoring: Core Web Vitals + RUM
      // Tracks LCP, FID, CLS, INP
      // Real User Monitoring captures actual user experience, not synthetic tests
      Sentry.browserTracingIntegration({
        enableLongTask: true, // Detect tasks that block UI (>50ms)
        enableInp: true, // Interaction to Next Paint (Core Web Vital)
      }),
    ],

    // 🎣 beforeSend Hook - Filter or modify events before sending to Sentry
    ignoreErrors: [
      // Browser extensions
      "top.GLOBALS",
      // Random network errors
      "Network request failed",
      "NetworkError",
      "Failed to fetch",
      // User canceled actions
      "AbortError",
      "Non-Error promise rejection captured",
      // NextAuth expected errors
      "NEXT_REDIRECT",
      // ResizeObserver errors (common browser quirk, not real bugs)
      "ResizeObserver",
    ],

    beforeSend(event, hint) {
      // Filter out noise: ResizeObserver errors (common browser quirk, not real bugs)
      if (event.message?.includes("ResizeObserver")) {
        return null; // Don't send to Sentry
      }

      // Filter out non-actionable errors
      if (event.exception) {
        const error = hint.originalException;

        // Don't send cancelled requests
        if (
          error &&
          typeof error === "object" &&
          "name" in error &&
          error.name === "AbortError"
        ) {
          return null;
        }

        // Add additional context for API errors
        if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string" &&
          error.message.includes("Request failed")
        ) {
          event.tags = {
            ...event.tags,
            error_type: "api_error",
          };
        }
      }

      return event; // Send to Sentry
    },
  });

  // 👤 Set user context (identifies who experienced the error)
  // In production, this will be updated after authentication
  if (isDevelopment) {
    Sentry.setUser({
      id: "dev-user",
    });
  }
}
```

--------------------------------------------------------------------------------

---[FILE: providers.tsx]---
Location: prowler-master/ui/app/providers.tsx
Signals: React, Next.js

```typescript
"use client";

// Import Sentry client-side initialization
import "@/app/instrumentation.client";

import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import * as React from "react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <SessionProvider>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: prowler-master/ui/app/(auth)/layout.tsx
Signals: React, Next.js

```typescript
import "@/styles/globals.css";

import { GoogleTagManager } from "@next/third-parties/google";
import { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { auth } from "@/auth.config";
import { NavigationProgress, Toaster } from "@/components/ui";
import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib";

import { Providers } from "../providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        suppressHydrationWarning
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <NavigationProgress />
          {children}
          <Toaster />
          <GoogleTagManager
            gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ""}
          />
        </Providers>
      </body>
    </html>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(auth)/sign-in/page.tsx

```typescript
import { AuthForm } from "@/components/auth/oss";
import {
  getAuthUrl,
  isGithubOAuthEnabled,
  isGoogleOAuthEnabled,
} from "@/lib/helper";

const SignIn = () => {
  const GOOGLE_AUTH_URL = getAuthUrl("google");
  const GITHUB_AUTH_URL = getAuthUrl("github");
  return (
    <AuthForm
      type="sign-in"
      googleAuthUrl={GOOGLE_AUTH_URL}
      githubAuthUrl={GITHUB_AUTH_URL}
      isGoogleOAuthEnabled={isGoogleOAuthEnabled}
      isGithubOAuthEnabled={isGithubOAuthEnabled}
    />
  );
};

export default SignIn;
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(auth)/sign-up/page.tsx

```typescript
import { AuthForm } from "@/components/auth/oss";
import { getAuthUrl, isGithubOAuthEnabled } from "@/lib/helper";
import { isGoogleOAuthEnabled } from "@/lib/helper";
import { SearchParamsProps } from "@/types";

const SignUp = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) => {
  const resolvedSearchParams = await searchParams;
  const invitationToken =
    typeof resolvedSearchParams?.invitation_token === "string"
      ? resolvedSearchParams.invitation_token
      : null;

  const GOOGLE_AUTH_URL = getAuthUrl("google");
  const GITHUB_AUTH_URL = getAuthUrl("github");

  return (
    <AuthForm
      type="sign-up"
      invitationToken={invitationToken}
      googleAuthUrl={GOOGLE_AUTH_URL}
      githubAuthUrl={GITHUB_AUTH_URL}
      isGoogleOAuthEnabled={isGoogleOAuthEnabled}
      isGithubOAuthEnabled={isGithubOAuthEnabled}
    />
  );
};

export default SignUp;
```

--------------------------------------------------------------------------------

---[FILE: error.tsx]---
Location: prowler-master/ui/app/(prowler)/error.tsx
Signals: React

```typescript
"use client";

import { Icon } from "@iconify/react";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

import { Button } from "@/components/shadcn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card/card";
import { CustomLink } from "@/components/ui/custom/custom-link";
import { SentryErrorSource, SentryErrorType } from "@/sentry";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Check if it's a 500 error
    const is500Error =
      error.message?.includes("500") ||
      error.message?.includes("502") ||
      error.message?.includes("503") ||
      error.message?.toLowerCase().includes("server error");

    if (is500Error) {
      // Log 500 errors specifically for monitoring
      console.error("Server error detected:", {
        message: error.message,
        digest: error.digest,
        timestamp: new Date().toISOString(),
      });

      // Send to Sentry with high priority
      Sentry.captureException(error, {
        tags: {
          error_boundary: "app",
          error_type: SentryErrorType.SERVER_ERROR,
          error_source: SentryErrorSource.ERROR_BOUNDARY,
          status_code: "500",
          digest: error.digest,
        },
        level: "error",
        fingerprint: ["server-error", error.message],
        contexts: {
          error_details: {
            is_server_error: true,
            timestamp: new Date().toISOString(),
          },
        },
      });
    } else {
      console.error("Application error:", error);

      // Send other errors to Sentry with normal priority
      Sentry.captureException(error, {
        tags: {
          error_boundary: "app",
          error_type: SentryErrorType.APPLICATION_ERROR,
          error_source: SentryErrorSource.ERROR_BOUNDARY,
          digest: error.digest,
        },
        level: "warning",
        fingerprint: ["app-error", error.message],
      });
    }
  }, [error]);

  const is500Error =
    error.message?.includes("500") ||
    error.message?.includes("502") ||
    error.message?.includes("503") ||
    error.message?.toLowerCase().includes("server error");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card variant="base" className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-start gap-3">
            <Icon
              icon={is500Error ? "tabler:server-off" : "tabler:rocket-off"}
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
            />
            <div className="flex flex-col gap-2">
              <CardTitle className="text-lg">
                {is500Error
                  ? "Server temporarily unavailable"
                  : "An unexpected error occurred"}
              </CardTitle>
              <CardDescription className="text-sm">
                {is500Error
                  ? "The server is experiencing issues. Our team has been notified and is working on it. Please try again in a few moments."
                  : "We're sorry for the inconvenience. Please try again or contact support if the problem persists."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-start gap-3">
            <Button onClick={reset} size="sm" className="gap-2">
              <Icon icon="tabler:refresh" className="h-4 w-4" />
              Try Again
            </Button>
            <CustomLink href="/" target="_self" className="font-bold">
              Go to Overview
            </CustomLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: prowler-master/ui/app/(prowler)/layout.tsx
Signals: React, Next.js

```typescript
import "@/styles/globals.css";

import * as Sentry from "@sentry/nextjs";
import { Metadata, Viewport } from "next";
import { ReactNode } from "react";

import { getProviders } from "@/actions/providers";
import MainLayout from "@/components/ui/main-layout/main-layout";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { Toaster } from "@/components/ui/toast";
import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { StoreInitializer } from "@/store/ui/store-initializer";

import { Providers } from "../providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    ...Sentry.getTraceData(),
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const providersData = await getProviders({ page: 1, pageSize: 1 });
  const hasProviders = !!(providersData?.data && providersData.data.length > 0);

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        suppressHydrationWarning
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <NavigationProgress />
          <StoreInitializer values={{ hasProviders }} />
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/page.tsx
Signals: React

```typescript
import { Suspense } from "react";

import { getProviders } from "@/actions/providers";
import { ContentLayout } from "@/components/ui";
import { SearchParamsProps } from "@/types";

import { AccountsSelector } from "./_overview/_components/accounts-selector";
import { ProviderTypeSelector } from "./_overview/_components/provider-type-selector";
import {
  AttackSurfaceSkeleton,
  AttackSurfaceSSR,
} from "./_overview/attack-surface";
import { CheckFindingsSSR } from "./_overview/check-findings";
import { GraphsTabsWrapper } from "./_overview/graphs-tabs/graphs-tabs-wrapper";
import { RiskPipelineViewSkeleton } from "./_overview/graphs-tabs/risk-pipeline-view";
import {
  RiskSeverityChartSkeleton,
  RiskSeverityChartSSR,
} from "./_overview/risk-severity";
import {
  FindingSeverityOverTimeSkeleton,
  FindingSeverityOverTimeSSR,
} from "./_overview/severity-over-time/finding-severity-over-time.ssr";
import { StatusChartSkeleton } from "./_overview/status-chart";
import { ThreatScoreSkeleton, ThreatScoreSSR } from "./_overview/threat-score";
import {
  ServiceWatchlistSSR,
  WatchlistCardSkeleton,
} from "./_overview/watchlist";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const providersData = await getProviders({ page: 1, pageSize: 200 });

  return (
    <ContentLayout title="Overview" icon="lucide:square-chart-gantt">
      <div className="xxl:grid-cols-4 mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <ProviderTypeSelector providers={providersData?.data ?? []} />
        <AccountsSelector providers={providersData?.data ?? []} />
      </div>

      <div className="flex flex-col gap-6 xl:flex-row xl:flex-wrap xl:items-stretch">
        <Suspense fallback={<ThreatScoreSkeleton />}>
          <ThreatScoreSSR searchParams={resolvedSearchParams} />
        </Suspense>

        <Suspense fallback={<StatusChartSkeleton />}>
          <CheckFindingsSSR searchParams={resolvedSearchParams} />
        </Suspense>

        <Suspense fallback={<RiskSeverityChartSkeleton />}>
          <RiskSeverityChartSSR searchParams={resolvedSearchParams} />
        </Suspense>
      </div>

      <div className="mt-6">
        <Suspense fallback={<AttackSurfaceSkeleton />}>
          <AttackSurfaceSSR searchParams={resolvedSearchParams} />
        </Suspense>
      </div>

      <div className="mt-6 flex flex-col gap-6 xl:flex-row">
        <Suspense fallback={<WatchlistCardSkeleton />}>
          <ServiceWatchlistSSR searchParams={resolvedSearchParams} />
        </Suspense>
        <Suspense fallback={<FindingSeverityOverTimeSkeleton />}>
          <FindingSeverityOverTimeSSR searchParams={resolvedSearchParams} />
        </Suspense>
      </div>

      <div className="mt-6">
        <Suspense fallback={<RiskPipelineViewSkeleton />}>
          <GraphsTabsWrapper searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    </ContentLayout>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/compliance/page.tsx
Signals: React

```typescript
import { Suspense } from "react";

import {
  getComplianceAttributes,
  getComplianceOverviewMetadataInfo,
  getComplianceRequirements,
  getCompliancesOverview,
} from "@/actions/compliances";
import { getScans } from "@/actions/scans";
import {
  ComplianceCard,
  ComplianceSkeletonGrid,
  NoScansAvailable,
  ThreatScoreBadge,
} from "@/components/compliance";
import { ComplianceHeader } from "@/components/compliance/compliance-header/compliance-header";
import { ContentLayout } from "@/components/ui";
import { calculateThreatScore } from "@/lib/compliance/threatscore-calculator";
import {
  ExpandedScanData,
  ScanEntity,
  ScanProps,
  SearchParamsProps,
} from "@/types";
import { ComplianceOverviewData } from "@/types/compliance";

export default async function Compliance({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchParamsKey = JSON.stringify(resolvedSearchParams || {});

  const filters = Object.fromEntries(
    Object.entries(resolvedSearchParams).filter(([key]) =>
      key.startsWith("filter["),
    ),
  );

  const scansData = await getScans({
    filters: {
      "filter[state]": "completed",
    },
    pageSize: 50,
    fields: {
      scans: "name,completed_at,provider",
    },
    include: "provider",
  });

  if (!scansData?.data) {
    return <NoScansAvailable />;
  }

  // Process scans with provider information from included data
  const expandedScansData: ExpandedScanData[] = scansData.data
    .filter((scan: ScanProps) => scan.relationships?.provider?.data?.id)
    .map((scan: ScanProps) => {
      const providerId = scan.relationships!.provider!.data!.id;

      // Find the provider data in the included array
      const providerData = scansData.included?.find(
        (item: { type: string; id: string }) =>
          item.type === "providers" && item.id === providerId,
      );

      if (!providerData) {
        return null;
      }

      return {
        ...scan,
        providerInfo: {
          provider: providerData.attributes.provider,
          uid: providerData.attributes.uid,
          alias: providerData.attributes.alias,
        },
      };
    })
    .filter(Boolean) as ExpandedScanData[];

  // Use scanId from URL, or select the first scan if not provided
  const selectedScanId =
    resolvedSearchParams.scanId || expandedScansData[0]?.id || null;
  const query = (filters["filter[search]"] as string) || "";

  // Find the selected scan
  const selectedScan = expandedScansData.find(
    (scan) => scan.id === selectedScanId,
  );

  const selectedScanData: ScanEntity | undefined = selectedScan?.providerInfo
    ? {
        id: selectedScan.id,
        providerInfo: selectedScan.providerInfo,
        attributes: {
          name: selectedScan.attributes.name,
          completed_at: selectedScan.attributes.completed_at,
        },
      }
    : undefined;

  // Fetch metadata if we have a selected scan
  const metadataInfoData = selectedScanId
    ? await getComplianceOverviewMetadataInfo({
        query,
        filters: {
          "filter[scan_id]": selectedScanId,
        },
      })
    : { data: { attributes: { regions: [] } } };

  const uniqueRegions = metadataInfoData?.data?.attributes?.regions || [];

  // Fetch ThreatScore data if we have a selected scan
  let threatScoreData = null;
  if (
    selectedScanId &&
    typeof selectedScanId === "string" &&
    selectedScan?.providerInfo?.provider
  ) {
    const complianceId = `prowler_threatscore_${selectedScan.providerInfo.provider.toLowerCase()}`;

    const [attributesData, requirementsData] = await Promise.all([
      getComplianceAttributes(complianceId),
      getComplianceRequirements({
        complianceId,
        scanId: selectedScanId,
      }),
    ]);

    threatScoreData = calculateThreatScore(attributesData, requirementsData);
  }

  return (
    <ContentLayout title="Compliance" icon="lucide:shield-check">
      {selectedScanId ? (
        <>
          <div className="mb-6 flex flex-col gap-6">
            <div className="flex flex-col items-start justify-between lg:flex-row lg:gap-6">
              <div className="flex-1">
                <ComplianceHeader
                  scans={expandedScansData}
                  uniqueRegions={uniqueRegions}
                />
              </div>
              {threatScoreData &&
                typeof selectedScanId === "string" &&
                selectedScan && (
                  <div className="w-[360px] flex-shrink-0">
                    <ThreatScoreBadge
                      score={threatScoreData.score}
                      scanId={selectedScanId}
                      provider={selectedScan.providerInfo.provider}
                      selectedScan={selectedScanData}
                    />
                  </div>
                )}
            </div>
          </div>
          <Suspense key={searchParamsKey} fallback={<ComplianceSkeletonGrid />}>
            <SSRComplianceGrid
              searchParams={resolvedSearchParams}
              selectedScan={selectedScanData}
            />
          </Suspense>
        </>
      ) : (
        <NoScansAvailable />
      )}
    </ContentLayout>
  );
}

const SSRComplianceGrid = async ({
  searchParams,
  selectedScan,
}: {
  searchParams: SearchParamsProps;
  selectedScan?: ScanEntity;
}) => {
  const scanId = searchParams.scanId?.toString() || "";
  const regionFilter = searchParams["filter[region__in]"]?.toString() || "";

  // Extract all filter parameters
  const filters = Object.fromEntries(
    Object.entries(searchParams).filter(([key]) => key.startsWith("filter[")),
  );

  // Extract query from filters
  const query = (filters["filter[search]"] as string) || "";

  // Only fetch compliance data if we have a valid scanId
  const compliancesData =
    scanId && scanId.trim() !== ""
      ? await getCompliancesOverview({
          scanId,
          region: regionFilter,
          query,
        })
      : { data: [], errors: [] };

  const type = compliancesData?.data?.type;

  // Check if the response contains no data
  if (
    !compliancesData ||
    !compliancesData.data ||
    compliancesData.data.length === 0 ||
    type === "tasks"
  ) {
    return (
      <div className="flex h-full items-center">
        <div className="text-default-500 text-sm">
          No compliance data available for the selected scan.
        </div>
      </div>
    );
  }

  // Handle errors returned by the API
  if (compliancesData?.errors?.length > 0) {
    return (
      <div className="flex h-full items-center">
        <div className="text-default-500 text-sm">Provide a valid scan ID.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {compliancesData.data
        .filter((compliance: ComplianceOverviewData) => {
          // Filter out ProwlerThreatScore from the grid
          return compliance.attributes.framework !== "ProwlerThreatScore";
        })
        .sort((a: ComplianceOverviewData, b: ComplianceOverviewData) =>
          a.attributes.framework.localeCompare(b.attributes.framework),
        )
        .map((compliance: ComplianceOverviewData) => {
          const { attributes, id } = compliance;
          const {
            framework,
            version,
            requirements_passed,
            total_requirements,
          } = attributes;

          return (
            <ComplianceCard
              key={id}
              title={framework}
              version={version}
              passingRequirements={requirements_passed}
              totalRequirements={total_requirements}
              prevPassingRequirements={requirements_passed}
              prevTotalRequirements={total_requirements}
              scanId={scanId}
              complianceId={id}
              id={id}
              selectedScan={selectedScan}
            />
          );
        })}
    </div>
  );
};
```

--------------------------------------------------------------------------------

````
