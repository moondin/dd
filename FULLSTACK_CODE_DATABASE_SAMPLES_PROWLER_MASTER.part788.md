---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 788
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 788 of 867)

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

---[FILE: accounts-selector.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/_components/accounts-selector.tsx
Signals: React, Next.js

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

import {
  AWSProviderBadge,
  AzureProviderBadge,
  GCPProviderBadge,
  GitHubProviderBadge,
  IacProviderBadge,
  KS8ProviderBadge,
  M365ProviderBadge,
  MongoDBAtlasProviderBadge,
  OracleCloudProviderBadge,
} from "@/components/icons/providers-badge";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/shadcn/select/multiselect";
import type { ProviderProps, ProviderType } from "@/types/providers";

const PROVIDER_ICON: Record<ProviderType, ReactNode> = {
  aws: <AWSProviderBadge width={18} height={18} />,
  azure: <AzureProviderBadge width={18} height={18} />,
  gcp: <GCPProviderBadge width={18} height={18} />,
  kubernetes: <KS8ProviderBadge width={18} height={18} />,
  m365: <M365ProviderBadge width={18} height={18} />,
  github: <GitHubProviderBadge width={18} height={18} />,
  iac: <IacProviderBadge width={18} height={18} />,
  oraclecloud: <OracleCloudProviderBadge width={18} height={18} />,
  mongodbatlas: <MongoDBAtlasProviderBadge width={18} height={18} />,
};

interface AccountsSelectorProps {
  providers: ProviderProps[];
}

export function AccountsSelector({ providers }: AccountsSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get("filter[provider_id__in]") || "";
  const selectedTypes = searchParams.get("filter[provider_type__in]") || "";
  const selectedTypesList = selectedTypes
    ? selectedTypes.split(",").filter(Boolean)
    : [];
  const selectedIds = current ? current.split(",").filter(Boolean) : [];
  const visibleProviders = providers
    // .filter((p) => p.attributes.connection?.connected)
    .filter((p) =>
      selectedTypesList.length > 0
        ? selectedTypesList.includes(p.attributes.provider)
        : true,
    );

  const handleMultiValueChange = (ids: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (ids.length > 0) {
      params.set("filter[provider_id__in]", ids.join(","));
    } else {
      params.delete("filter[provider_id__in]");
    }

    // Auto-deselect provider types that no longer have any selected accounts
    if (selectedTypesList.length > 0) {
      // Get provider types of currently selected accounts
      const selectedProviders = providers.filter((p) => ids.includes(p.id));
      const selectedProviderTypes = new Set(
        selectedProviders.map((p) => p.attributes.provider),
      );

      // Keep only provider types that still have selected accounts
      const remainingProviderTypes = selectedTypesList.filter((type) =>
        selectedProviderTypes.has(type as ProviderType),
      );

      // Update provider_type__in filter
      if (remainingProviderTypes.length > 0) {
        params.set(
          "filter[provider_type__in]",
          remainingProviderTypes.join(","),
        );
      } else {
        params.delete("filter[provider_type__in]");
      }
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const selectedLabel = () => {
    if (selectedIds.length === 0) return null;
    if (selectedIds.length === 1) {
      const p = providers.find((pr) => pr.id === selectedIds[0]);
      const name = p ? p.attributes.alias || p.attributes.uid : selectedIds[0];
      return <span className="truncate">{name}</span>;
    }
    return (
      <span className="truncate">{selectedIds.length} accounts selected</span>
    );
  };

  const filterDescription =
    selectedTypesList.length > 0
      ? `Showing accounts for ${selectedTypesList.join(", ")} providers`
      : "All connected cloud provider accounts";

  return (
    <div className="relative">
      <label
        htmlFor="accounts-selector"
        className="sr-only"
        id="accounts-label"
      >
        Filter by cloud provider account. {filterDescription}. Select one or
        more accounts to view findings.
      </label>
      <MultiSelect values={selectedIds} onValuesChange={handleMultiValueChange}>
        <MultiSelectTrigger
          id="accounts-selector"
          aria-labelledby="accounts-label"
        >
          {selectedLabel() || <MultiSelectValue placeholder="All accounts" />}
        </MultiSelectTrigger>
        <MultiSelectContent search={false}>
          {visibleProviders.length > 0 ? (
            <>
              <div
                role="option"
                aria-selected={selectedIds.length === 0}
                aria-label="Select all accounts (clears current selection to show all)"
                tabIndex={0}
                className="text-text-neutral-secondary flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700/50"
                onClick={() => handleMultiValueChange([])}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMultiValueChange([]);
                  }
                }}
              >
                Select All
              </div>
              {visibleProviders.map((p) => {
                const id = p.id;
                const displayName = p.attributes.alias || p.attributes.uid;
                const providerType = p.attributes.provider as ProviderType;
                const icon = PROVIDER_ICON[providerType];
                return (
                  <MultiSelectItem
                    key={id}
                    value={id}
                    badgeLabel={displayName}
                    aria-label={`${displayName} account (${providerType.toUpperCase()})`}
                  >
                    <span aria-hidden="true">{icon}</span>
                    <span className="truncate">{displayName}</span>
                  </MultiSelectItem>
                );
              })}
            </>
          ) : (
            <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
              {selectedTypesList.length > 0
                ? "No accounts available for selected providers"
                : "No connected accounts available"}
            </div>
          )}
        </MultiSelectContent>
      </MultiSelect>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: provider-type-selector.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/_components/provider-type-selector.tsx
Signals: React, Next.js

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { lazy, Suspense } from "react";

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/shadcn/select/multiselect";
import { type ProviderProps, ProviderType } from "@/types/providers";

const AWSProviderBadge = lazy(() =>
  import("@/components/icons/providers-badge").then((m) => ({
    default: m.AWSProviderBadge,
  })),
);
const AzureProviderBadge = lazy(() =>
  import("@/components/icons/providers-badge").then((m) => ({
    default: m.AzureProviderBadge,
  })),
);
const GCPProviderBadge = lazy(() =>
  import("@/components/icons/providers-badge").then((m) => ({
    default: m.GCPProviderBadge,
  })),
);
const KS8ProviderBadge = lazy(() =>
  import("@/components/icons/providers-badge").then((m) => ({
    default: m.KS8ProviderBadge,
  })),
);
const M365ProviderBadge = lazy(() =>
  import("@/components/icons/providers-badge").then((m) => ({
    default: m.M365ProviderBadge,
  })),
);
const GitHubProviderBadge = lazy(() =>
  import("@/components/icons/providers-badge").then((m) => ({
    default: m.GitHubProviderBadge,
  })),
);
const IacProviderBadge = lazy(() =>
  import("@/components/icons/providers-badge").then((m) => ({
    default: m.IacProviderBadge,
  })),
);
const OracleCloudProviderBadge = lazy(() =>
  import("@/components/icons/providers-badge").then((m) => ({
    default: m.OracleCloudProviderBadge,
  })),
);
const MongoDBAtlasProviderBadge = lazy(() =>
  import("@/components/icons/providers-badge").then((m) => ({
    default: m.MongoDBAtlasProviderBadge,
  })),
);

type IconProps = { width: number; height: number };

const IconPlaceholder = ({ width, height }: IconProps) => (
  <div style={{ width, height }} />
);

const PROVIDER_DATA: Record<
  ProviderType,
  { label: string; icon: React.ComponentType<IconProps> }
> = {
  aws: {
    label: "Amazon Web Services",
    icon: AWSProviderBadge,
  },
  azure: {
    label: "Microsoft Azure",
    icon: AzureProviderBadge,
  },
  gcp: {
    label: "Google Cloud Platform",
    icon: GCPProviderBadge,
  },
  kubernetes: {
    label: "Kubernetes",
    icon: KS8ProviderBadge,
  },
  m365: {
    label: "Microsoft 365",
    icon: M365ProviderBadge,
  },
  github: {
    label: "GitHub",
    icon: GitHubProviderBadge,
  },
  iac: {
    label: "Infrastructure as Code",
    icon: IacProviderBadge,
  },
  oraclecloud: {
    label: "Oracle Cloud Infrastructure",
    icon: OracleCloudProviderBadge,
  },
  mongodbatlas: {
    label: "MongoDB Atlas",
    icon: MongoDBAtlasProviderBadge,
  },
};

type ProviderTypeSelectorProps = {
  providers: ProviderProps[];
};

export const ProviderTypeSelector = ({
  providers,
}: ProviderTypeSelectorProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentProviders = searchParams.get("filter[provider_type__in]") || "";
  const selectedTypes = currentProviders
    ? currentProviders.split(",").filter(Boolean)
    : [];

  const handleMultiValueChange = (values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update provider_type__in
    if (values.length > 0) {
      params.set("filter[provider_type__in]", values.join(","));
    } else {
      params.delete("filter[provider_type__in]");
    }

    // Clear account selection when changing provider types
    // User should manually select accounts if they want to filter by specific accounts
    params.delete("filter[provider_id__in]");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const availableTypes = Array.from(
    new Set(
      providers
        // .filter((p) => p.attributes.connection?.connected)
        .map((p) => p.attributes.provider),
    ),
  ) as ProviderType[];

  const renderIcon = (providerType: ProviderType) => {
    const IconComponent = PROVIDER_DATA[providerType].icon;
    return (
      <Suspense fallback={<IconPlaceholder width={24} height={24} />}>
        <IconComponent width={24} height={24} />
      </Suspense>
    );
  };

  const selectedLabel = () => {
    if (selectedTypes.length === 0) return null;
    if (selectedTypes.length === 1) {
      const providerType = selectedTypes[0] as ProviderType;
      return (
        <span className="flex items-center gap-2">
          {renderIcon(providerType)}
          <span>{PROVIDER_DATA[providerType].label}</span>
        </span>
      );
    }
    return (
      <span className="truncate">
        {selectedTypes.length} providers selected
      </span>
    );
  };

  return (
    <div className="relative">
      <label
        htmlFor="provider-type-selector"
        className="sr-only"
        id="provider-type-label"
      >
        Filter by cloud provider type. Select one or more providers to view
        findings.
      </label>
      <MultiSelect
        values={selectedTypes}
        onValuesChange={handleMultiValueChange}
      >
        <MultiSelectTrigger
          id="provider-type-selector"
          aria-labelledby="provider-type-label"
        >
          {selectedLabel() || <MultiSelectValue placeholder="All providers" />}
        </MultiSelectTrigger>
        <MultiSelectContent search={false}>
          {availableTypes.length > 0 ? (
            <>
              <div
                role="option"
                aria-selected={selectedTypes.length === 0}
                aria-label="Select all providers (clears current selection to show all)"
                tabIndex={0}
                className="text-text-neutral-secondary flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700/50"
                onClick={() => handleMultiValueChange([])}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMultiValueChange([]);
                  }
                }}
              >
                Select All
              </div>
              {availableTypes.map((providerType) => (
                <MultiSelectItem
                  key={providerType}
                  value={providerType}
                  badgeLabel={PROVIDER_DATA[providerType].label}
                  aria-label={`${PROVIDER_DATA[providerType].label} provider`}
                >
                  <span aria-hidden="true">{renderIcon(providerType)}</span>
                  <span>{PROVIDER_DATA[providerType].label}</span>
                </MultiSelectItem>
              ))}
            </>
          ) : (
            <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
              No connected providers available
            </div>
          )}
        </MultiSelectContent>
      </MultiSelect>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: filter-params.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/_lib/filter-params.ts

```typescript
import { SearchParamsProps } from "@/types";

const FILTER_PREFIX = "filter[";

export function pickFilterParams(
  params: SearchParamsProps | undefined | null,
): Record<string, string | string[] | undefined> {
  if (!params) return {};
  return Object.fromEntries(
    Object.entries(params).filter(([key]) => key.startsWith(FILTER_PREFIX)),
  );
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: prowler-master/ui/app/api/auth/callback/github/route.ts
Signals: Next.js

```typescript
"use server";

import { NextResponse } from "next/server";

import { signIn } from "@/auth.config";
import { apiBaseUrl, baseUrl } from "@/lib/helper";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");

  const params = new URLSearchParams();
  params.append("code", code || "");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${apiBaseUrl}/tokens/github`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for tokens");
    }

    const data = await response.json();
    const { access, refresh } = data.data.attributes;

    try {
      const result = await signIn("social-oauth", {
        accessToken: access,
        refreshToken: refresh,
        redirect: false,
        callbackUrl: `${baseUrl}/`,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return NextResponse.redirect(new URL("/", baseUrl));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("SignIn error:", error);
      return NextResponse.redirect(
        new URL("/sign-in?error=AuthenticationFailed", baseUrl),
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in Github callback:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: prowler-master/ui/app/api/auth/callback/google/route.ts
Signals: Next.js

```typescript
"use server";

import { NextResponse } from "next/server";

import { signIn } from "@/auth.config";
import { apiBaseUrl, baseUrl } from "@/lib/helper";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");

  const params = new URLSearchParams();
  params.append("code", code || "");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${apiBaseUrl}/tokens/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for tokens");
    }

    const data = await response.json();
    const { access, refresh } = data.data.attributes;

    try {
      const result = await signIn("social-oauth", {
        accessToken: access,
        refreshToken: refresh,
        redirect: false,
        callbackUrl: `${baseUrl}/`,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return NextResponse.redirect(new URL("/", baseUrl));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("SignIn error:", error);
      return NextResponse.redirect(
        new URL("/sign-in?error=AuthenticationFailed", baseUrl),
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in Google callback:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: prowler-master/ui/app/api/auth/callback/saml/route.ts
Signals: Next.js

```typescript
"use server";

import { NextResponse } from "next/server";

import { signIn } from "@/auth.config";
import { apiBaseUrl, baseUrl } from "@/lib/helper";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID parameter is missing" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${apiBaseUrl}/tokens/saml?id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tokens: ${response.statusText}`);
    }

    const tokenData = await response.json();
    const { access, refresh } = tokenData.data;

    if (!access || !refresh) {
      throw new Error("Tokens not found in response");
    }

    const result = await signIn("social-oauth", {
      accessToken: access,
      refreshToken: refresh,
      redirect: false,
      callbackUrl: `${baseUrl}/`,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return NextResponse.redirect(new URL("/", baseUrl));
  } catch (error) {
    console.error("SAML authentication failed:", error);
    return NextResponse.redirect(new URL("/sign-in", baseUrl));
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: prowler-master/ui/app/api/auth/[...nextauth]/route.ts

```typescript
import { handlers } from "@/auth.config";

export const { GET, POST } = handlers;
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: prowler-master/ui/app/api/lighthouse/analyst/route.ts

```typescript
import * as Sentry from "@sentry/nextjs";
import { createUIMessageStreamResponse, UIMessage } from "ai";

import { getTenantConfig } from "@/actions/lighthouse/lighthouse";
import { auth } from "@/auth.config";
import { getErrorMessage } from "@/lib/helper";
import {
  CHAIN_OF_THOUGHT_ACTIONS,
  createTextDeltaEvent,
  createTextEndEvent,
  createTextStartEvent,
  ERROR_PREFIX,
  handleChatModelEndEvent,
  handleChatModelStreamEvent,
  handleToolEvent,
  STREAM_MESSAGE_ID,
} from "@/lib/lighthouse/analyst-stream";
import { authContextStorage } from "@/lib/lighthouse/auth-context";
import { getCurrentDataSection } from "@/lib/lighthouse/data";
import { convertVercelMessageToLangChainMessage } from "@/lib/lighthouse/utils";
import {
  initLighthouseWorkflow,
  type RuntimeConfig,
} from "@/lib/lighthouse/workflow";
import { SentryErrorSource, SentryErrorType } from "@/sentry";

export async function POST(req: Request) {
  try {
    const {
      messages,
      model,
      provider,
    }: {
      messages: UIMessage[];
      model?: string;
      provider?: string;
    } = await req.json();

    if (!messages) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.accessToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.accessToken;

    return await authContextStorage.run(accessToken, async () => {
      // Get AI configuration to access business context
      const tenantConfigResult = await getTenantConfig();
      const businessContext =
        tenantConfigResult?.data?.attributes?.business_context;

      // Get current user data
      const currentData = await getCurrentDataSection();

      // Pass context to workflow instead of injecting as assistant messages
      const runtimeConfig: RuntimeConfig = {
        model,
        provider,
        businessContext,
        currentData,
      };

      const app = await initLighthouseWorkflow(runtimeConfig);

      // Use streamEvents to get token-by-token streaming + tool events
      const agentStream = app.streamEvents(
        {
          messages: messages
            .filter(
              (message: UIMessage) =>
                message.role === "user" || message.role === "assistant",
            )
            .map(convertVercelMessageToLangChainMessage),
        },
        {
          version: "v2",
        },
      );

      // Custom stream transformer that handles both text and tool events
      const stream = new ReadableStream({
        async start(controller) {
          let hasStarted = false;

          try {
            // Emit text-start at the beginning
            controller.enqueue(createTextStartEvent(STREAM_MESSAGE_ID));

            for await (const streamEvent of agentStream) {
              const { event, data, tags, name } = streamEvent;

              // Stream model tokens (smooth text streaming)
              if (event === "on_chat_model_stream") {
                const wasHandled = handleChatModelStreamEvent(
                  controller,
                  data,
                  tags,
                );
                if (wasHandled) {
                  hasStarted = true;
                }
              }
              // Model finished - check for tool calls
              else if (event === "on_chat_model_end") {
                handleChatModelEndEvent(controller, data);
              }
              // Tool execution started
              else if (event === "on_tool_start") {
                handleToolEvent(
                  controller,
                  CHAIN_OF_THOUGHT_ACTIONS.START,
                  name,
                  data?.input,
                );
              }
              // Tool execution completed
              else if (event === "on_tool_end") {
                handleToolEvent(
                  controller,
                  CHAIN_OF_THOUGHT_ACTIONS.COMPLETE,
                  name,
                  data?.input,
                );
              }
            }

            // Emit text-end at the end
            controller.enqueue(createTextEndEvent(STREAM_MESSAGE_ID));

            controller.close();
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);

            // Capture stream processing errors
            Sentry.captureException(error, {
              tags: {
                api_route: "lighthouse_analyst",
                error_type: SentryErrorType.STREAM_PROCESSING,
                error_source: SentryErrorSource.API_ROUTE,
              },
              level: "error",
              contexts: {
                lighthouse: {
                  event_type: "stream_error",
                  message_count: messages.length,
                },
              },
            });

            // Emit error as text with consistent prefix
            // Use consistent ERROR_PREFIX for both scenarios so client can detect errors
            if (hasStarted) {
              controller.enqueue(
                createTextDeltaEvent(
                  STREAM_MESSAGE_ID,
                  `\n\n${ERROR_PREFIX} ${errorMessage}`,
                ),
              );
            } else {
              controller.enqueue(
                createTextDeltaEvent(
                  STREAM_MESSAGE_ID,
                  `${ERROR_PREFIX} ${errorMessage}`,
                ),
              );
            }

            controller.enqueue(createTextEndEvent(STREAM_MESSAGE_ID));

            controller.close();
          }
        },
      });

      return createUIMessageStreamResponse({ stream });
    });
  } catch (error) {
    console.error("Error in POST request:", error);

    // Capture API route errors
    Sentry.captureException(error, {
      tags: {
        api_route: "lighthouse_analyst",
        error_type: SentryErrorType.REQUEST_PROCESSING,
        error_source: SentryErrorSource.API_ROUTE,
        method: "POST",
      },
      level: "error",
      contexts: {
        request: {
          method: req.method,
          url: req.url,
          headers: Object.fromEntries(req.headers.entries()),
        },
      },
    });

    return Response.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: prowler-master/ui/app/api/services/route.ts
Signals: Next.js

```typescript
import { NextResponse } from "next/server";

import data from "../../../dataServices.json";

export async function GET() {
  // Simulate fetching data with a delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json({ services: data });
}
```

--------------------------------------------------------------------------------

---[FILE: ThemeSwitch.tsx]---
Location: prowler-master/ui/components/ThemeSwitch.tsx
Signals: React

```typescript
"use client";

import type { SwitchProps } from "@heroui/switch";
import { useSwitch } from "@heroui/switch";
import { useIsSSR } from "@react-aria/ssr";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { FC } from "react";
import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";

import { MoonFilledIcon, SunFilledIcon } from "./icons";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const onChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === "light" || isSSR,
    "aria-label": `Switch to ${theme === "light" || isSSR ? "dark" : "light"} mode`,
    onChange,
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Component
          {...getBaseProps({
            className: clsx(
              "px-px transition-opacity hover:opacity-80 cursor-pointer",
              className,
              classNames?.base,
            ),
          })}
        >
          <VisuallyHidden>
            <input {...getInputProps()} />
          </VisuallyHidden>
          <div
            {...getWrapperProps()}
            className={slots.wrapper({
              class: clsx(
                [
                  "h-auto w-auto",
                  "bg-transparent",
                  "rounded-lg",
                  "flex items-center justify-center",
                  "group-data-[selected=true]:bg-transparent",
                  "!text-default-500",
                  "pt-px",
                  "px-0",
                  "mx-0",
                ],
                classNames?.wrapper,
              ),
            })}
          >
            {!isSelected || isSSR ? (
              <SunFilledIcon size={22} />
            ) : (
              <MoonFilledIcon size={22} />
            )}
          </div>
        </Component>
      </TooltipTrigger>
      <TooltipContent>
        {isSelected || isSSR ? "Switch to Dark Mode" : "Switch to Light Mode"}
      </TooltipContent>
    </Tooltip>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: chain-of-thought.tsx]---
Location: prowler-master/ui/components/ai-elements/chain-of-thought.tsx
Signals: React

```typescript
"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  BrainIcon,
  ChevronDownIcon,
  DotIcon,
  type LucideIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { createContext, memo, useContext, useMemo } from "react";

import { Badge } from "@/components/shadcn/badge/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn/collapsible";
import { cn } from "@/lib/utils";

type ChainOfThoughtContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const ChainOfThoughtContext = createContext<ChainOfThoughtContextValue | null>(
  null,
);

const useChainOfThought = () => {
  const context = useContext(ChainOfThoughtContext);
  if (!context) {
    throw new Error(
      "ChainOfThought components must be used within ChainOfThought",
    );
  }
  return context;
};

export type ChainOfThoughtProps = ComponentProps<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const ChainOfThought = memo(
  ({
    className,
    open,
    defaultOpen = false,
    onOpenChange,
    children,
    ...props
  }: ChainOfThoughtProps) => {
    const [isOpen, setIsOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });

    const chainOfThoughtContext = useMemo(
      () => ({ isOpen, setIsOpen }),
      [isOpen, setIsOpen],
    );

    return (
      <ChainOfThoughtContext.Provider value={chainOfThoughtContext}>
        <div
          className={cn("not-prose max-w-prose space-y-4", className)}
          {...props}
        >
          {children}
        </div>
      </ChainOfThoughtContext.Provider>
    );
  },
);

export type ChainOfThoughtHeaderProps = ComponentProps<
  typeof CollapsibleTrigger
>;

export const ChainOfThoughtHeader = memo(
  ({ className, children, ...props }: ChainOfThoughtHeaderProps) => {
    const { isOpen, setIsOpen } = useChainOfThought();

    return (
      <Collapsible onOpenChange={setIsOpen} open={isOpen}>
        <CollapsibleTrigger
          className={cn(
            "text-muted-foreground hover:text-foreground flex w-full items-center gap-2 text-sm transition-colors",
            className,
          )}
          {...props}
        >
          <BrainIcon className="size-4" />
          <span className="flex-1 text-left">
            {children ?? "Chain of Thought"}
          </span>
          <ChevronDownIcon
            className={cn(
              "size-4 transition-transform",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </CollapsibleTrigger>
      </Collapsible>
    );
  },
);

export type ChainOfThoughtStepProps = ComponentProps<"div"> & {
  icon?: LucideIcon;
  label: ReactNode;
  description?: ReactNode;
  status?: "complete" | "active" | "pending";
};

export const ChainOfThoughtStep = memo(
  ({
    className,
    icon: Icon = DotIcon,
    label,
    description,
    status = "complete",
    children,
    ...props
  }: ChainOfThoughtStepProps) => {
    const statusStyles = {
      complete: "text-muted-foreground",
      active: "text-foreground",
      pending: "text-muted-foreground/50",
    };

    return (
      <div
        className={cn(
          "flex gap-2 text-sm",
          statusStyles[status],
          "fade-in-0 slide-in-from-top-2 animate-in",
          className,
        )}
        {...props}
      >
        <div className="relative mt-0.5">
          <Icon className="size-4" />
          <div className="bg-border absolute top-7 bottom-0 left-1/2 -mx-px w-px" />
        </div>
        <div className="flex-1 space-y-2 overflow-hidden">
          <div>{label}</div>
          {description && (
            <div className="text-muted-foreground text-xs">{description}</div>
          )}
          {children}
        </div>
      </div>
    );
  },
);

export type ChainOfThoughtSearchResultsProps = ComponentProps<"div">;

export const ChainOfThoughtSearchResults = memo(
  ({ className, ...props }: ChainOfThoughtSearchResultsProps) => (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  ),
);

export type ChainOfThoughtSearchResultProps = ComponentProps<typeof Badge>;

export const ChainOfThoughtSearchResult = memo(
  ({ className, children, ...props }: ChainOfThoughtSearchResultProps) => (
    <Badge
      className={cn("gap-1 px-2 py-0.5 text-xs font-normal", className)}
      variant="secondary"
      {...props}
    >
      {children}
    </Badge>
  ),
);

export type ChainOfThoughtContentProps = ComponentProps<
  typeof CollapsibleContent
>;

export const ChainOfThoughtContent = memo(
  ({ className, children, ...props }: ChainOfThoughtContentProps) => {
    const { isOpen } = useChainOfThought();

    return (
      <Collapsible open={isOpen}>
        <CollapsibleContent
          className={cn(
            "mt-2 space-y-3",
            "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in outline-none",
            className,
          )}
          {...props}
        >
          {children}
        </CollapsibleContent>
      </Collapsible>
    );
  },
);

export type ChainOfThoughtImageProps = ComponentProps<"div"> & {
  caption?: string;
};

export const ChainOfThoughtImage = memo(
  ({ className, children, caption, ...props }: ChainOfThoughtImageProps) => (
    <div className={cn("mt-2 space-y-2", className)} {...props}>
      <div className="bg-muted relative flex max-h-[22rem] items-center justify-center overflow-hidden rounded-lg p-3">
        {children}
      </div>
      {caption && <p className="text-muted-foreground text-xs">{caption}</p>}
    </div>
  ),
);

ChainOfThought.displayName = "ChainOfThought";
ChainOfThoughtHeader.displayName = "ChainOfThoughtHeader";
ChainOfThoughtStep.displayName = "ChainOfThoughtStep";
ChainOfThoughtSearchResults.displayName = "ChainOfThoughtSearchResults";
ChainOfThoughtSearchResult.displayName = "ChainOfThoughtSearchResult";
ChainOfThoughtContent.displayName = "ChainOfThoughtContent";
ChainOfThoughtImage.displayName = "ChainOfThoughtImage";
```

--------------------------------------------------------------------------------

---[FILE: conversation.tsx]---
Location: prowler-master/ui/components/ai-elements/conversation.tsx
Signals: React

```typescript
"use client";

import { ArrowDownIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

import { Button } from "@/components/shadcn/button/button";
import { cn } from "@/lib/utils";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("relative flex-1 overflow-y-hidden", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content
    className={cn("flex flex-col gap-8 p-4", className)}
    {...props}
  />
);

export type ConversationEmptyStateProps = ComponentProps<"div"> & {
  title?: string;
  description?: string;
  icon?: ReactNode;
};

export const ConversationEmptyState = ({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
      className,
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="space-y-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      </>
    )}
  </div>
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = () => {
    scrollToBottom();
  };

  return (
    !isAtBottom && (
      <Button
        aria-label="Scroll to bottom"
        className={cn(
          "absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full",
          className,
        )}
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...props}
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  );
};
```

--------------------------------------------------------------------------------

---[FILE: auth-divider.tsx]---
Location: prowler-master/ui/components/auth/oss/auth-divider.tsx

```typescript
import { Divider } from "@heroui/divider";

export const AuthDivider = () => {
  return (
    <div className="flex items-center gap-4 py-2">
      <Divider className="flex-1" />
      <p className="text-tiny text-default-500 shrink-0">OR</p>
      <Divider className="flex-1" />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: auth-footer-link.tsx]---
Location: prowler-master/ui/components/auth/oss/auth-footer-link.tsx

```typescript
import { CustomLink } from "@/components/ui/custom/custom-link";

interface AuthFooterLinkProps {
  text: string;
  linkText: string;
  href: string;
}

export const AuthFooterLink = ({
  text,
  linkText,
  href,
}: AuthFooterLinkProps) => {
  return (
    <p className="text-small text-center">
      {text}&nbsp;
      <CustomLink size="md" href={href} target="_self">
        {linkText}
      </CustomLink>
    </p>
  );
};
```

--------------------------------------------------------------------------------

````
