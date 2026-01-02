---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 785
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 785 of 867)

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

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/scans/page.tsx
Signals: React

```typescript
import { Spacer } from "@heroui/spacer";
import { Suspense } from "react";

import { getProviders } from "@/actions/providers";
import { getScans, getScansByState } from "@/actions/scans";
import { auth } from "@/auth.config";
import { MutedFindingsConfigButton } from "@/components/providers";
import {
  AutoRefresh,
  NoProvidersAdded,
  NoProvidersConnected,
  ScansFilters,
} from "@/components/scans";
import { LaunchScanWorkflow } from "@/components/scans/launch-workflow";
import { SkeletonTableScans } from "@/components/scans/table";
import { ColumnGetScans } from "@/components/scans/table/scans";
import { ContentLayout } from "@/components/ui";
import { CustomBanner } from "@/components/ui/custom/custom-banner";
import { DataTable } from "@/components/ui/table";
import {
  createProviderDetailsMapping,
  extractProviderUIDs,
} from "@/lib/provider-helpers";
import { ProviderProps, ScanProps, SearchParamsProps } from "@/types";

export default async function Scans({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const session = await auth();
  const resolvedSearchParams = await searchParams;
  const filteredParams = { ...resolvedSearchParams };
  delete filteredParams.scanId;

  const providersData = await getProviders({
    pageSize: 50,
  });

  const providerInfo =
    providersData?.data
      ?.filter(
        (provider: ProviderProps) =>
          provider.attributes.connection.connected === true,
      )
      .map((provider: ProviderProps) => ({
        providerId: provider.id,
        alias: provider.attributes.alias,
        providerType: provider.attributes.provider,
        uid: provider.attributes.uid,
        connected: provider.attributes.connection.connected,
      })) || [];

  const thereIsNoProviders =
    !providersData?.data || providersData.data.length === 0;

  const thereIsNoProvidersConnected = providersData?.data?.every(
    (provider: ProviderProps) => !provider.attributes.connection.connected,
  );

  const hasManageScansPermission = session?.user?.permissions?.manage_scans;

  // Get scans data to check for executing scans
  const scansData = await getScansByState();

  const hasExecutingScan = scansData?.data?.some(
    (scan: ScanProps) =>
      scan.attributes.state === "executing" ||
      scan.attributes.state === "available",
  );

  // Extract provider UIDs and create provider details mapping for filtering
  const providerUIDs = providersData ? extractProviderUIDs(providersData) : [];
  const providerDetails = providersData
    ? createProviderDetailsMapping(providerUIDs, providersData)
    : [];

  if (thereIsNoProviders) {
    return (
      <ContentLayout title="Scans" icon="lucide:timer">
        <NoProvidersAdded />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Scans" icon="lucide:timer">
      <AutoRefresh hasExecutingScan={hasExecutingScan} />
      <>
        {!hasManageScansPermission ? (
          <CustomBanner
            title={"Access Denied"}
            message={"You don't have permission to launch the scan."}
          />
        ) : thereIsNoProvidersConnected ? (
          <>
            <Spacer y={8} />
            <NoProvidersConnected />
            <Spacer y={8} />
          </>
        ) : (
          <LaunchScanWorkflow providers={providerInfo} />
        )}

        <ScansFilters
          providerUIDs={providerUIDs}
          providerDetails={providerDetails}
        />
        <Spacer y={8} />
        <div className="flex items-center justify-end gap-4">
          <MutedFindingsConfigButton />
        </div>
        <Spacer y={8} />
        <Suspense fallback={<SkeletonTableScans />}>
          <SSRDataTableScans searchParams={resolvedSearchParams} />
        </Suspense>
      </>
    </ContentLayout>
  );
}

const SSRDataTableScans = async ({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) => {
  const page = parseInt(searchParams.page?.toString() || "1", 10);
  const pageSize = parseInt(searchParams.pageSize?.toString() || "10", 10);
  const sort = searchParams.sort?.toString();

  // Extract all filter parameters, excluding scanId
  const filters = Object.fromEntries(
    Object.entries(searchParams).filter(
      ([key]) => key.startsWith("filter[") && key !== "scanId",
    ),
  );

  // Extract query from filters
  const query = (filters["filter[search]"] as string) || "";

  // Fetch scans data with provider information included
  const scansData = await getScans({
    query,
    page,
    sort,
    filters,
    pageSize,
    include: "provider",
  });

  const scans = scansData?.data;
  const included = scansData?.included;
  const meta = scansData && "meta" in scansData ? scansData.meta : undefined;

  const expandedScansData =
    scans?.map((scan: ScanProps) => {
      const providerId = scan.relationships?.provider?.data?.id;

      if (!providerId) {
        return { ...scan, providerInfo: null };
      }

      // Find the provider data in the included array
      const providerData = included?.find(
        (item: { type: string; id: string }) =>
          item.type === "providers" && item.id === providerId,
      );

      if (!providerData) {
        return { ...scan, providerInfo: null };
      }

      return {
        ...scan,
        providerInfo: {
          provider: providerData.attributes.provider,
          uid: providerData.attributes.uid,
          alias: providerData.attributes.alias,
        },
      };
    }) || [];

  return (
    <DataTable
      key={`scans-${Date.now()}`}
      columns={ColumnGetScans}
      data={expandedScansData || []}
      metadata={meta}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/services/page.tsx

```typescript
import { Spacer } from "@heroui/spacer";

import { FilterControls } from "@/components/filters";
import { ContentLayout } from "@/components/ui";

export default async function Services() {
  // const searchParamsKey = JSON.stringify(searchParams || {});
  return (
    <ContentLayout
      title="Services"
      icon="material-symbols:linked-services-outline"
    >
      <Spacer y={4} />
      <FilterControls />
      <Spacer y={4} />
      {/* <Suspense key={searchParamsKey} fallback={<ServiceSkeletonGrid />}>
        <SSRServiceGrid />
      </Suspense> */}
    </ContentLayout>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/users/page.tsx
Signals: React, Next.js

```typescript
import { Spacer } from "@heroui/spacer";
import Link from "next/link";
import { Suspense } from "react";

import { getRoles } from "@/actions/roles/roles";
import { getUsers } from "@/actions/users/users";
import { FilterControls } from "@/components/filters";
import { filterUsers } from "@/components/filters/data-filters";
import { AddIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { ContentLayout } from "@/components/ui";
import { DataTable, DataTableFilterCustom } from "@/components/ui/table";
import { ColumnsUser, SkeletonTableUser } from "@/components/users/table";
import { Role, SearchParamsProps, UserProps } from "@/types";

export default async function Users({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchParamsKey = JSON.stringify(resolvedSearchParams || {});

  return (
    <ContentLayout title="Users" icon="lucide:user">
      <FilterControls search />

      <div className="flex flex-row items-center justify-between">
        <DataTableFilterCustom filters={filterUsers || []} />

        <Button asChild>
          <Link href="/invitations/new">
            Invite User
            <AddIcon size={20} />
          </Link>
        </Button>
      </div>
      <Spacer y={8} />

      <Suspense key={searchParamsKey} fallback={<SkeletonTableUser />}>
        <SSRDataTable searchParams={resolvedSearchParams} />
      </Suspense>
    </ContentLayout>
  );
}

const SSRDataTable = async ({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) => {
  const page = parseInt(searchParams.page?.toString() || "1", 10);
  const sort = searchParams.sort?.toString();
  const pageSize = parseInt(searchParams.pageSize?.toString() || "10", 10);

  // Extract all filter parameters
  const filters = Object.fromEntries(
    Object.entries(searchParams).filter(([key]) => key.startsWith("filter[")),
  );

  // Extract query from filters
  const query = (filters["filter[search]"] as string) || "";

  const usersData = await getUsers({ query, page, sort, filters, pageSize });
  const rolesData = await getRoles({});

  // Create a dictionary for roles by user ID
  const roleDict = (usersData?.included || []).reduce(
    (acc: Record<string, any>, item: Role) => {
      if (item.type === "roles") {
        acc[item.id] = item.attributes;
      }
      return acc;
    },
    {} as Record<string, Role>,
  );

  // Generate the array of roles with all the roles available
  const roles = Array.from(
    new Map(
      (rolesData?.data || []).map((role: Role) => [
        role.id,
        { id: role.id, name: role.attributes?.name || "Unnamed Role" },
      ]),
    ).values(),
  );

  // Expand the users with their roles
  const expandedUsers = (usersData?.data || []).map((user: UserProps) => {
    // Check if the user has a role
    const roleId = user?.relationships?.roles?.data?.[0]?.id;
    const role = roleDict?.[roleId] || null;

    return {
      ...user,
      attributes: {
        ...(user?.attributes || {}),
        role,
      },
      roles,
    };
  });

  return (
    <DataTable
      key={`scans-${Date.now()}`}
      columns={ColumnsUser}
      data={expandedUsers || []}
      metadata={usersData?.meta}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/workloads/page.tsx

```typescript
import { ContentLayout } from "@/components/ui";

export default async function Workloads() {
  return (
    <ContentLayout title="Workloads" icon="lucide:tags">
      <p>Workloads</p>
    </ContentLayout>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: _types.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/_types.ts

```typescript
import { SearchParamsProps } from "@/types";

/**
 * Common props interface for SSR components that receive search params
 * from the page component for filter handling.
 */
export interface SSRComponentProps {
  searchParams: SearchParamsProps | undefined | null;
}
```

--------------------------------------------------------------------------------

---[FILE: attack-surface-skeleton.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/attack-surface/attack-surface-skeleton.tsx

```typescript
import { Card, CardContent, Skeleton } from "@/components/shadcn";

export function AttackSurfaceSkeleton() {
  return (
    <Card
      variant="base"
      className="flex w-full flex-col"
      role="status"
      aria-label="Loading attack surface data"
    >
      <Skeleton className="h-7 w-32 rounded-xl" />
      <CardContent className="mt-4 flex flex-wrap gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            variant="inner"
            padding="md"
            className="flex min-h-[120px] min-w-[200px] flex-1 flex-col justify-between"
            aria-hidden="true"
          >
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-20 rounded-xl" />
              <Skeleton className="h-5 w-40 rounded-xl" />
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: attack-surface.ssr.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/attack-surface/attack-surface.ssr.tsx

```typescript
import {
  adaptAttackSurfaceOverview,
  getAttackSurfaceOverview,
} from "@/actions/overview";

import { pickFilterParams } from "../_lib/filter-params";
import { SSRComponentProps } from "../_types";
import { AttackSurface } from "./_components/attack-surface";

export const AttackSurfaceSSR = async ({ searchParams }: SSRComponentProps) => {
  const filters = pickFilterParams(searchParams);

  const response = await getAttackSurfaceOverview({ filters });

  const items = adaptAttackSurfaceOverview(response);

  return <AttackSurface items={items} filters={filters} />;
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/attack-surface/index.ts

```typescript
export { AttackSurfaceSSR } from "./attack-surface.ssr";
export { AttackSurfaceSkeleton } from "./attack-surface-skeleton";
```

--------------------------------------------------------------------------------

---[FILE: attack-surface-card-item.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/attack-surface/_components/attack-surface-card-item.tsx
Signals: Next.js

```typescript
import Link from "next/link";

import { AttackSurfaceItem } from "@/actions/overview";
import { Card, CardContent } from "@/components/shadcn";
import { mapProviderFiltersForFindings } from "@/lib";

interface AttackSurfaceCardItemProps {
  item: AttackSurfaceItem;
  filters?: Record<string, string | string[] | undefined>;
}

export function AttackSurfaceCardItem({
  item,
  filters = {},
}: AttackSurfaceCardItemProps) {
  // Build URL with current filters + attack surface specific filters
  const buildFindingsUrl = () => {
    const params = new URLSearchParams();

    // Add attack surface category filter
    params.set("filter[category__in]", item.id);
    params.set("filter[status__in]", "FAIL");
    params.set("filter[muted]", "false");

    // Add current page filters (provider, account, etc.)
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && !params.has(key)) {
        params.set(key, String(value));
      }
    });

    // Map provider filters for findings page compatibility
    mapProviderFiltersForFindings(params);

    return `/findings?${params.toString()}`;
  };

  const findingsUrl = buildFindingsUrl();

  const hasFindings = item.failedFindings > 0;

  const getCardStyles = () => {
    if (hasFindings) {
      return "cursor-pointer border-rose-500/40 shadow-rose-500/20 shadow-lg transition-all hover:border-rose-500/60 hover:shadow-rose-500/30";
    }
    return "cursor-pointer transition-colors hover:bg-accent";
  };

  const cardContent = (
    <Card
      variant="inner"
      padding="md"
      className={`flex min-h-[120px] min-w-[200px] flex-1 flex-col justify-between ${getCardStyles()}`}
      aria-label={`${item.label}: ${item.failedFindings} failed findings`}
    >
      <CardContent className="flex flex-col gap-2 p-0">
        <span
          className="text-5xl leading-none font-light tracking-tight"
          aria-hidden="true"
        >
          {item.failedFindings}
        </span>
        <span className="text-text-neutral-tertiary text-sm leading-6">
          {item.label}
        </span>
      </CardContent>
    </Card>
  );

  return (
    <Link href={findingsUrl} className="flex min-w-[200px] flex-1">
      {cardContent}
    </Link>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: attack-surface.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/attack-surface/_components/attack-surface.tsx

```typescript
import { AttackSurfaceItem } from "@/actions/overview";
import { Card, CardContent, CardTitle } from "@/components/shadcn";

import { AttackSurfaceCardItem } from "./attack-surface-card-item";

interface AttackSurfaceProps {
  items: AttackSurfaceItem[];
  filters?: Record<string, string | string[] | undefined>;
}

export function AttackSurface({ items, filters }: AttackSurfaceProps) {
  const isEmpty = items.length === 0;

  return (
    <Card variant="base" className="flex w-full flex-col">
      <CardTitle>Attack Surface</CardTitle>
      <CardContent className="mt-4 flex flex-wrap gap-4">
        {isEmpty ? (
          <div
            className="flex w-full items-center justify-center py-8"
            role="status"
          >
            <p className="text-text-neutral-tertiary text-sm">
              No attack surface data available.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <AttackSurfaceCardItem
              key={item.id}
              item={item}
              filters={filters}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: check-findings.ssr.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/check-findings/check-findings.ssr.tsx

```typescript
import { getFindingsByStatus } from "@/actions/overview";

import { pickFilterParams } from "../_lib/filter-params";
import { SSRComponentProps } from "../_types";
import { StatusChart } from "../status-chart/_components/status-chart";

export const CheckFindingsSSR = async ({ searchParams }: SSRComponentProps) => {
  const filters = pickFilterParams(searchParams);

  const findingsByStatus = await getFindingsByStatus({ filters });

  if (!findingsByStatus) {
    return (
      <div className="flex h-[400px] w-full max-w-md items-center justify-center rounded-xl border border-zinc-900 bg-stone-950">
        <p className="text-zinc-400">Failed to load findings data</p>
      </div>
    );
  }

  const attributes = findingsByStatus?.data?.attributes || {};

  const { fail = 0, pass = 0, fail_new = 0, pass_new = 0 } = attributes;

  return (
    <StatusChart
      failFindingsData={{
        total: fail,
        new: fail_new,
      }}
      passFindingsData={{
        total: pass,
        new: pass_new,
      }}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/check-findings/index.ts

```typescript
export { CheckFindingsSSR } from "./check-findings.ssr";
```

--------------------------------------------------------------------------------

---[FILE: graphs-tabs-wrapper.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/graphs-tabs-wrapper.tsx
Signals: React

```typescript
import { Skeleton } from "@heroui/skeleton";
import { Suspense } from "react";

import { SearchParamsProps } from "@/types";

import { GraphsTabsClient } from "./_components/graphs-tabs-client";
import { GRAPH_TABS, type TabId } from "./_config/graphs-tabs-config";
import { FindingsViewSSR } from "./findings-view";
import { RiskPipelineViewSSR } from "./risk-pipeline-view/risk-pipeline-view.ssr";
import { RiskPlotSSR } from "./risk-plot/risk-plot.ssr";
import { RiskRadarViewSSR } from "./risk-radar-view/risk-radar-view.ssr";
import { ThreatMapViewSSR } from "./threat-map-view/threat-map-view.ssr";

const LoadingFallback = () => (
  <div className="border-border-neutral-primary bg-bg-neutral-secondary flex w-full flex-col space-y-4 rounded-lg border p-4">
    <Skeleton className="bg-bg-neutral-tertiary h-6 w-1/3 rounded" />
    <Skeleton className="bg-bg-neutral-tertiary h-[457px] w-full rounded" />
  </div>
);

type GraphComponent = React.ComponentType<{ searchParams: SearchParamsProps }>;

const GRAPH_COMPONENTS: Record<TabId, GraphComponent> = {
  findings: FindingsViewSSR as GraphComponent,
  "risk-pipeline": RiskPipelineViewSSR as GraphComponent,
  "threat-map": ThreatMapViewSSR as GraphComponent,
  "risk-plot": RiskPlotSSR as GraphComponent,
  "risk-radar": RiskRadarViewSSR as GraphComponent,
};

interface GraphsTabsWrapperProps {
  searchParams: SearchParamsProps;
}

export const GraphsTabsWrapper = async ({
  searchParams,
}: GraphsTabsWrapperProps) => {
  const tabsContent = Object.fromEntries(
    GRAPH_TABS.map((tab) => {
      const Component = GRAPH_COMPONENTS[tab.id];
      return [
        tab.id,
        <Suspense key={tab.id} fallback={<LoadingFallback />}>
          <Component searchParams={searchParams} />
        </Suspense>,
      ];
    }),
  ) as Record<TabId, React.ReactNode>;

  return <GraphsTabsClient tabsContent={tabsContent} />;
};
```

--------------------------------------------------------------------------------

---[FILE: findings-view.ssr.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/findings-view/findings-view.ssr.tsx

```typescript
"use server";

import { Spacer } from "@heroui/spacer";

import { getLatestFindings } from "@/actions/findings/findings";
import { LighthouseBanner } from "@/components/lighthouse/banner";
import { LinkToFindings } from "@/components/overview";
import { ColumnNewFindingsToDate } from "@/components/overview/new-findings-table/table/column-new-findings-to-date";
import { DataTable } from "@/components/ui/table";
import { createDict } from "@/lib/helper";
import { mapProviderFiltersForFindingsObject } from "@/lib/provider-helpers";
import { FindingProps, SearchParamsProps } from "@/types";

import { pickFilterParams } from "../../_lib/filter-params";

interface FindingsViewSSRProps {
  searchParams: SearchParamsProps;
}

export async function FindingsViewSSR({ searchParams }: FindingsViewSSRProps) {
  const page = 1;
  const sort = "severity,-inserted_at";

  const defaultFilters = {
    "filter[status]": "FAIL",
    "filter[delta]": "new",
  };

  const filters = pickFilterParams(searchParams);
  const mappedFilters = mapProviderFiltersForFindingsObject(filters);
  const combinedFilters = { ...defaultFilters, ...mappedFilters };

  const findingsData = await getLatestFindings({
    query: undefined,
    page,
    sort,
    filters: combinedFilters,
  });

  const resourceDict = createDict("resources", findingsData);
  const scanDict = createDict("scans", findingsData);
  const providerDict = createDict("providers", findingsData);

  const expandedFindings = findingsData?.data
    ? (findingsData.data as FindingProps[]).map((finding) => {
        const scan = scanDict[finding.relationships?.scan?.data?.id];
        const resource =
          resourceDict[finding.relationships?.resources?.data?.[0]?.id];
        const provider = providerDict[scan?.relationships?.provider?.data?.id];

        return {
          ...finding,
          relationships: { scan, resource, provider },
        };
      })
    : [];

  const expandedResponse = {
    ...findingsData,
    data: expandedFindings,
  };

  return (
    <div className="flex w-full flex-col">
      <LighthouseBanner />
      <div className="relative flex w-full">
        <div className="flex w-full items-center gap-2">
          <h3 className="text-sm font-bold uppercase">
            Latest new failing findings
          </h3>
          <p className="text-text-neutral-tertiary text-xs">
            Showing the latest 10 new failing findings by severity.
          </p>
        </div>
        <div className="absolute -top-6 right-0">
          <LinkToFindings />
        </div>
      </div>
      <Spacer y={4} />

      <DataTable
        key={`dashboard-findings-${Date.now()}`}
        columns={ColumnNewFindingsToDate}
        data={(expandedResponse?.data || []) as FindingProps[]}
      />
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/findings-view/index.ts

```typescript
export { FindingsViewSSR } from "./findings-view.ssr";
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/risk-pipeline-view/index.ts

```typescript
export { RiskPipelineViewSSR } from "./risk-pipeline-view.ssr";
export { RiskPipelineViewSkeleton } from "./risk-pipeline-view-skeleton";
```

--------------------------------------------------------------------------------

---[FILE: risk-pipeline-view-skeleton.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/risk-pipeline-view/risk-pipeline-view-skeleton.tsx

```typescript
import { Skeleton } from "@/components/shadcn/skeleton/skeleton";

export function RiskPipelineViewSkeleton() {
  return (
    <div className="border-border-neutral-primary bg-bg-neutral-secondary flex h-[460px] w-full flex-col space-y-4 rounded-lg border p-4">
      <Skeleton className="h-6 w-1/4 rounded" />
      <div className="flex flex-1 items-center justify-center">
        <Skeleton className="h-[380px] w-full rounded" />
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: risk-pipeline-view.ssr.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/risk-pipeline-view/risk-pipeline-view.ssr.tsx

```typescript
import {
  adaptToSankeyData,
  getFindingsBySeverity,
  SeverityByProviderType,
} from "@/actions/overview";
import { getProviders } from "@/actions/providers";
import { SankeyChart } from "@/components/graphs/sankey-chart";
import { SearchParamsProps } from "@/types";

import { pickFilterParams } from "../../_lib/filter-params";

export async function RiskPipelineViewSSR({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const filters = pickFilterParams(searchParams);

  const providerTypeFilter = filters["filter[provider_type__in]"];
  const providerIdFilter = filters["filter[provider_id__in]"];

  // Fetch providers list to know account types
  const providersListResponse = await getProviders({ pageSize: 200 });
  const allProviders = providersListResponse?.data || [];

  // Build severityByProviderType based on filters
  const severityByProviderType: SeverityByProviderType = {};
  let selectedProviderTypes: string[] | undefined;

  if (providerIdFilter) {
    // Case: Accounts are selected - group by provider type and make parallel calls
    const selectedAccountIds = String(providerIdFilter)
      .split(",")
      .map((id) => id.trim());

    // Group selected accounts by provider type
    const accountsByType: Record<string, string[]> = {};
    for (const accountId of selectedAccountIds) {
      const provider = allProviders.find((p) => p.id === accountId);
      if (provider) {
        const type = provider.attributes.provider.toLowerCase();
        if (!accountsByType[type]) {
          accountsByType[type] = [];
        }
        accountsByType[type].push(accountId);
      }
    }

    selectedProviderTypes = Object.keys(accountsByType);

    // Make parallel calls for each provider type
    const severityPromises = Object.entries(accountsByType).map(
      async ([providerType, accountIds]) => {
        const response = await getFindingsBySeverity({
          filters: {
            "filter[provider_id__in]": accountIds.join(","),
            "filter[status]": "FAIL", // Only count failed findings
          },
        });
        return { providerType, data: response?.data?.attributes };
      },
    );

    const severityResults = await Promise.all(severityPromises);

    for (const result of severityResults) {
      if (result.data) {
        severityByProviderType[result.providerType] = result.data;
      }
    }
  } else if (providerTypeFilter) {
    // Case: Provider types are selected - make parallel calls for each type
    selectedProviderTypes = String(providerTypeFilter)
      .split(",")
      .map((t) => t.trim().toLowerCase());

    const severityPromises = selectedProviderTypes.map(async (providerType) => {
      const response = await getFindingsBySeverity({
        filters: {
          ...filters,
          "filter[provider_type__in]": providerType,
          "filter[status]": "FAIL", // Only count failed findings
        },
      });
      return { providerType, data: response?.data?.attributes };
    });

    const severityResults = await Promise.all(severityPromises);

    for (const result of severityResults) {
      if (result.data) {
        severityByProviderType[result.providerType] = result.data;
      }
    }
  } else {
    // Case: No filters - get all provider types and make parallel calls
    const allProviderTypes = Array.from(
      new Set(allProviders.map((p) => p.attributes.provider.toLowerCase())),
    );

    const severityPromises = allProviderTypes.map(async (providerType) => {
      const response = await getFindingsBySeverity({
        filters: {
          ...filters,
          "filter[provider_type__in]": providerType,
          "filter[status]": "FAIL", // Only count failed findings
        },
      });
      return { providerType, data: response?.data?.attributes };
    });

    const severityResults = await Promise.all(severityPromises);

    for (const result of severityResults) {
      if (result.data) {
        severityByProviderType[result.providerType] = result.data;
      }
    }
  }

  const sankeyData = adaptToSankeyData(
    severityByProviderType,
    selectedProviderTypes,
  );

  // If no chart data and no zero-data providers, show empty state message
  if (
    sankeyData.nodes.length === 0 &&
    sankeyData.zeroDataProviders.length === 0
  ) {
    return (
      <div className="flex h-[460px] w-full items-center justify-center">
        <p className="text-text-neutral-tertiary text-sm">
          No findings data available for the selected filters
        </p>
      </div>
    );
  }

  // If no chart data but there are zero-data providers, show only the legend
  if (sankeyData.nodes.length === 0) {
    return (
      <div className="flex h-[460px] w-full items-center justify-center">
        <div className="text-center">
          <p className="text-text-neutral-tertiary mb-4 text-sm">
            No failed findings for the selected accounts
          </p>
          <SankeyChart
            data={sankeyData}
            zeroDataProviders={sankeyData.zeroDataProviders}
            height={100}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 overflow-visible">
      <SankeyChart
        data={sankeyData}
        zeroDataProviders={sankeyData.zeroDataProviders}
        height={460}
      />
    </div>
  );
}
```

--------------------------------------------------------------------------------

````
