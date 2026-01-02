---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 786
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 786 of 867)

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

---[FILE: risk-plot-client.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/risk-plot/risk-plot-client.tsx
Signals: React, Next.js

```typescript
"use client";

/**
 * Risk Plot Client Component
 *
 * NOTE: This component uses CSS variables (var()) for Recharts styling.
 * Recharts SVG-based components (Scatter, XAxis, YAxis, CartesianGrid, etc.)
 * do not support Tailwind classes and require raw color values or CSS variables.
 * This is a documented limitation of the Recharts library.
 * @see https://recharts.org/en-US/api
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RiskPlotPoint } from "@/actions/overview/risk-plot";
import { HorizontalBarChart } from "@/components/graphs/horizontal-bar-chart";
import { AlertPill } from "@/components/graphs/shared/alert-pill";
import { ChartLegend } from "@/components/graphs/shared/chart-legend";
import {
  AXIS_FONT_SIZE,
  CustomXAxisTick,
} from "@/components/graphs/shared/custom-axis-tick";
import type { BarDataPoint } from "@/components/graphs/types";
import { mapProviderFiltersForFindings } from "@/lib/provider-helpers";
import { SEVERITY_FILTER_MAP } from "@/types/severities";

// ThreatScore colors (0-100 scale, higher = better)
const THREAT_COLORS = {
  DANGER: "var(--bg-fail-primary)", // 0-30
  WARNING: "var(--bg-warning-primary)", // 31-60
  SUCCESS: "var(--bg-pass-primary)", // 61-100
} as const;

/**
 * Get color based on ThreatScore (0-100 scale, higher = better)
 */
function getThreatScoreColor(score: number): string {
  if (score > 60) return THREAT_COLORS.SUCCESS;
  if (score > 30) return THREAT_COLORS.WARNING;
  return THREAT_COLORS.DANGER;
}

// Provider colors from globals.css
const PROVIDER_COLORS: Record<string, string> = {
  AWS: "var(--bg-data-aws)",
  Azure: "var(--bg-data-azure)",
  "Google Cloud": "var(--bg-data-gcp)",
  Kubernetes: "var(--bg-data-kubernetes)",
  "Microsoft 365": "var(--bg-data-m365)",
  GitHub: "var(--bg-data-github)",
  "MongoDB Atlas": "var(--bg-data-azure)",
  "Infrastructure as Code": "var(--bg-data-kubernetes)",
  "Oracle Cloud Infrastructure": "var(--bg-data-gcp)",
};

interface RiskPlotClientProps {
  data: RiskPlotPoint[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: RiskPlotPoint }>;
}

// Props that Recharts passes to the shape component
interface RechartsScatterDotProps {
  cx: number;
  cy: number;
  payload: RiskPlotPoint;
}

// Extended props for our custom scatter dot component
interface ScatterDotProps extends RechartsScatterDotProps {
  selectedPoint: RiskPlotPoint | null;
  onSelectPoint: (point: RiskPlotPoint) => void;
  allData: RiskPlotPoint[];
  selectedProvider: string | null;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null;

  const { name, x, y } = payload[0].payload;
  const scoreColor = getThreatScoreColor(x);

  return (
    <div className="border-border-neutral-tertiary bg-bg-neutral-tertiary pointer-events-none min-w-[200px] rounded-xl border p-3 shadow-lg">
      <p className="text-text-neutral-primary mb-2 text-sm font-semibold">
        {name}
      </p>
      <p className="text-text-neutral-secondary text-sm font-medium">
        <span style={{ color: scoreColor, fontWeight: "bold" }}>{x}%</span>{" "}
        Prowler ThreatScore
      </p>
      <div className="mt-2">
        <AlertPill value={y} />
      </div>
    </div>
  );
};

const CustomScatterDot = ({
  cx,
  cy,
  payload,
  selectedPoint,
  onSelectPoint,
  allData,
  selectedProvider,
}: ScatterDotProps) => {
  const isSelected = selectedPoint?.name === payload.name;
  const size = isSelected ? 18 : 8;
  const selectedColor = "var(--bg-button-primary)";
  const fill = isSelected
    ? selectedColor
    : PROVIDER_COLORS[payload.provider] || "var(--color-text-neutral-tertiary)";
  const isFaded =
    selectedProvider !== null && payload.provider !== selectedProvider;

  const handleClick = () => {
    const fullDataItem = allData?.find((d) => d.name === payload.name);
    onSelectPoint?.(fullDataItem || payload);
  };

  return (
    <g
      style={{
        cursor: "pointer",
        opacity: isFaded ? 0.2 : 1,
        transition: "opacity 0.2s",
      }}
      onClick={handleClick}
    >
      {isSelected && (
        <>
          <circle
            cx={cx}
            cy={cy}
            r={size / 2 + 4}
            fill="none"
            stroke={selectedColor}
            strokeWidth={1}
            opacity={0.4}
          />
          <circle
            cx={cx}
            cy={cy}
            r={size / 2 + 8}
            fill="none"
            stroke={selectedColor}
            strokeWidth={1}
            opacity={0.2}
          />
        </>
      )}
      <circle
        cx={cx}
        cy={cy}
        r={size / 2}
        fill={fill}
        stroke={isSelected ? selectedColor : "transparent"}
        strokeWidth={2}
      />
    </g>
  );
};

/**
 * Factory function that creates a scatter dot shape component with closure over selection state.
 * Recharts shape prop types the callback parameter as `unknown` due to its flexible API.
 * We safely cast to RechartsScatterDotProps since we know the actual shape of props passed by Scatter.
 * @see https://recharts.org/en-US/api/Scatter#shape
 */
function createScatterDotShape(
  selectedPoint: RiskPlotPoint | null,
  onSelectPoint: (point: RiskPlotPoint) => void,
  allData: RiskPlotPoint[],
  selectedProvider: string | null,
): (props: unknown) => React.JSX.Element {
  const ScatterDotShape = (props: unknown) => (
    <CustomScatterDot
      {...(props as RechartsScatterDotProps)}
      selectedPoint={selectedPoint}
      onSelectPoint={onSelectPoint}
      allData={allData}
      selectedProvider={selectedProvider}
    />
  );
  ScatterDotShape.displayName = "ScatterDotShape";
  return ScatterDotShape;
}

export function RiskPlotClient({ data }: RiskPlotClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPoint, setSelectedPoint] = useState<RiskPlotPoint | null>(
    null,
  );
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  // Group data by provider for separate Scatter series
  const dataByProvider = data.reduce<Record<string, RiskPlotPoint[]>>(
    (acc, point) => {
      (acc[point.provider] ??= []).push(point);
      return acc;
    },
    {},
  );

  const providers = Object.keys(dataByProvider);

  const handleSelectPoint = (point: RiskPlotPoint) => {
    setSelectedPoint((current) =>
      current?.name === point.name ? null : point,
    );
  };

  const handleProviderClick = (provider: string) => {
    setSelectedProvider((current) => (current === provider ? null : provider));
  };

  const handleBarClick = (dataPoint: BarDataPoint) => {
    if (!selectedPoint) return;

    // Build the URL with current filters
    const params = new URLSearchParams(searchParams.toString());

    // Transform provider filters (provider_id__in -> provider__in)
    mapProviderFiltersForFindings(params);

    // Add severity filter
    const severity = SEVERITY_FILTER_MAP[dataPoint.name];
    if (severity) {
      params.set("filter[severity__in]", severity);
    }

    // Add provider filter for the selected point
    params.set("filter[provider__in]", selectedPoint.providerId);

    // Add exclude muted findings filter
    params.set("filter[muted]", "false");

    // Filter by FAIL findings
    params.set("filter[status__in]", "FAIL");

    // Navigate to findings page
    router.push(`/findings?${params.toString()}`);
  };

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex flex-1 gap-12">
        {/* Plot Section - in Card */}
        <div className="flex basis-[70%] flex-col">
          <div className="border-border-neutral-primary bg-bg-neutral-secondary flex flex-1 flex-col rounded-lg border p-4">
            <div className="mb-4">
              <h3 className="text-text-neutral-primary text-lg font-semibold">
                Risk Plot
              </h3>
              <p className="text-text-neutral-tertiary mt-1 text-xs">
                Prowler ThreatScore is severity-weighted, not quantity-based.
                Higher severity findings have greater impact on the score.
              </p>
            </div>

            <div className="relative min-h-[400px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
                >
                  <CartesianGrid
                    horizontal={true}
                    vertical={false}
                    strokeOpacity={1}
                    stroke="var(--border-neutral-secondary)"
                  />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Prowler ThreatScore"
                    label={{
                      value: "Prowler ThreatScore",
                      position: "bottom",
                      offset: 10,
                      fill: "var(--color-text-neutral-secondary)",
                    }}
                    tick={CustomXAxisTick}
                    tickLine={false}
                    domain={[0, 100]}
                    axisLine={false}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Fail Findings"
                    label={{
                      value: "Fail Findings",
                      angle: -90,
                      position: "left",
                      offset: 10,
                      fill: "var(--color-text-neutral-secondary)",
                    }}
                    tick={{
                      fill: "var(--color-text-neutral-secondary)",
                      fontSize: AXIS_FONT_SIZE,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {Object.entries(dataByProvider).map(([provider, points]) => (
                    <Scatter
                      key={provider}
                      name={provider}
                      data={points}
                      fill={
                        PROVIDER_COLORS[provider] ||
                        "var(--color-text-neutral-tertiary)"
                      }
                      shape={createScatterDotShape(
                        selectedPoint,
                        handleSelectPoint,
                        data,
                        selectedProvider,
                      )}
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Interactive Legend - below chart */}
            <div className="mt-4 flex flex-col items-start gap-2">
              <p className="text-text-neutral-tertiary pl-2 text-xs">
                Click to filter by provider
              </p>
              <ChartLegend
                items={providers.map((p) => ({
                  label: p,
                  color:
                    PROVIDER_COLORS[p] || "var(--color-text-neutral-tertiary)",
                  dataKey: p,
                }))}
                selectedItem={selectedProvider}
                onItemClick={handleProviderClick}
              />
            </div>
          </div>
        </div>

        {/* Details Section - No Card */}
        <div className="flex basis-[30%] flex-col items-center justify-center overflow-hidden">
          {selectedPoint && selectedPoint.severityData ? (
            <div className="flex w-full flex-col">
              <div className="mb-4">
                <h4 className="text-text-neutral-primary text-base font-semibold">
                  {selectedPoint.name}
                </h4>
                <p className="text-text-neutral-tertiary text-xs">
                  Prowler ThreatScore: {selectedPoint.x}% | Fail Findings:{" "}
                  {selectedPoint.y}
                </p>
              </div>
              <HorizontalBarChart
                data={selectedPoint.severityData}
                onBarClick={handleBarClick}
              />
            </div>
          ) : (
            <div className="flex w-full items-center justify-center text-center">
              <p className="text-text-neutral-tertiary text-sm">
                Select a point on the plot to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: risk-plot.ssr.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/risk-plot/risk-plot.ssr.tsx

```typescript
import { Info } from "lucide-react";

import {
  adaptToRiskPlotData,
  getProvidersRiskData,
} from "@/actions/overview/risk-plot";
import { getProviders } from "@/actions/providers";
import { SearchParamsProps } from "@/types";

import { pickFilterParams } from "../../_lib/filter-params";
import { RiskPlotClient } from "./risk-plot-client";

export async function RiskPlotSSR({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const filters = pickFilterParams(searchParams);

  const providerTypeFilter = filters["filter[provider_type__in]"];
  const providerIdFilter = filters["filter[provider_id__in]"];

  // Fetch all providers
  const providersListResponse = await getProviders({ pageSize: 200 });
  const allProviders = providersListResponse?.data || [];

  // Filter providers based on search params
  let filteredProviders = allProviders;

  if (providerIdFilter) {
    // Filter by specific provider IDs
    const selectedIds = String(providerIdFilter)
      .split(",")
      .map((id) => id.trim());
    filteredProviders = allProviders.filter((p) => selectedIds.includes(p.id));
  } else if (providerTypeFilter) {
    // Filter by provider types
    const selectedTypes = String(providerTypeFilter)
      .split(",")
      .map((t) => t.trim().toLowerCase());
    filteredProviders = allProviders.filter((p) =>
      selectedTypes.includes(p.attributes.provider.toLowerCase()),
    );
  }

  // No providers to show
  if (filteredProviders.length === 0) {
    return (
      <div className="flex h-[460px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <Info size={48} className="text-text-neutral-tertiary" />
          <p className="text-text-neutral-secondary text-sm">
            No providers available for the selected filters
          </p>
        </div>
      </div>
    );
  }

  // Fetch risk data for all filtered providers in parallel
  const providersRiskData = await getProvidersRiskData(filteredProviders);

  // Transform to chart format
  const { points, providersWithoutData } =
    adaptToRiskPlotData(providersRiskData);

  // No data available
  if (points.length === 0) {
    return (
      <div className="flex h-[460px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <Info size={48} className="text-text-neutral-tertiary" />
          <p className="text-text-neutral-secondary text-sm">
            No risk data available for the selected providers
          </p>
          {providersWithoutData.length > 0 && (
            <p className="text-text-neutral-tertiary text-xs">
              {providersWithoutData.length} provider(s) have no completed scans
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 overflow-visible">
      <RiskPlotClient data={points} />
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: category-selector.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/risk-radar-view/category-selector.tsx

```typescript
"use client";

import type { RadarDataPoint } from "@/components/graphs/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select/select";

interface CategorySelectorProps {
  categories: RadarDataPoint[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function CategorySelector({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  const handleValueChange = (value: string) => {
    if (value === "" || value === "all") {
      onCategoryChange(null);
    } else {
      onCategoryChange(value);
    }
  };

  return (
    <Select value={selectedCategory ?? "all"} onValueChange={handleValueChange}>
      <SelectTrigger size="sm" className="w-[200px]">
        <SelectValue placeholder="All categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.categoryId} value={category.categoryId}>
            {category.category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: risk-radar-view-client.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/risk-radar-view/risk-radar-view-client.tsx
Signals: React, Next.js

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { HorizontalBarChart } from "@/components/graphs/horizontal-bar-chart";
import { RadarChart } from "@/components/graphs/radar-chart";
import type { BarDataPoint, RadarDataPoint } from "@/components/graphs/types";
import { Card } from "@/components/shadcn/card/card";
import { SEVERITY_FILTER_MAP } from "@/types/severities";

import { CategorySelector } from "./category-selector";

interface RiskRadarViewClientProps {
  data: RadarDataPoint[];
}

export function RiskRadarViewClient({ data }: RiskRadarViewClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPoint, setSelectedPoint] = useState<RadarDataPoint | null>(
    null,
  );

  const handleSelectPoint = (point: RadarDataPoint | null) => {
    setSelectedPoint(point);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    if (categoryId === null) {
      setSelectedPoint(null);
    } else {
      const point = data.find((d) => d.categoryId === categoryId);
      setSelectedPoint(point ?? null);
    }
  };

  const handleBarClick = (dataPoint: BarDataPoint) => {
    if (!selectedPoint) return;

    // Build the URL with current filters
    const params = new URLSearchParams(searchParams.toString());

    // Add severity filter
    const severity = SEVERITY_FILTER_MAP[dataPoint.name];
    if (severity) {
      params.set("filter[severity__in]", severity);
    }

    // Add category filter for the selected point
    params.set("filter[category__in]", selectedPoint.categoryId);

    // Add exclude muted findings filter
    params.set("filter[muted]", "false");

    // Filter by FAIL findings
    params.set("filter[status__in]", "FAIL");

    // Navigate to findings page
    router.push(`/findings?${params.toString()}`);
  };

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex flex-1 gap-12 overflow-hidden">
        {/* Radar Section */}
        <div className="flex basis-[70%] flex-col overflow-hidden">
          <Card variant="base" className="flex flex-1 flex-col overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-neutral-primary text-lg font-semibold">
                Risk Radar
              </h3>
              <CategorySelector
                categories={data}
                selectedCategory={selectedPoint?.categoryId ?? null}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            <div className="relative min-h-[400px] w-full flex-1">
              <RadarChart
                data={data}
                height={400}
                selectedPoint={selectedPoint}
                onSelectPoint={handleSelectPoint}
              />
            </div>
          </Card>
        </div>

        {/* Details Section - No Card */}
        <div className="flex basis-[30%] items-center overflow-hidden">
          {selectedPoint && selectedPoint.severityData ? (
            <div className="flex w-full flex-col">
              <div className="mb-4">
                <h4 className="text-neutral-primary text-base font-semibold">
                  {selectedPoint.category}
                </h4>
                <p className="text-neutral-tertiary text-xs">
                  {selectedPoint.value} Total Findings
                </p>
              </div>
              <HorizontalBarChart
                data={selectedPoint.severityData}
                onBarClick={handleBarClick}
              />
            </div>
          ) : (
            <div className="flex w-full items-center justify-center text-center">
              <p className="text-neutral-tertiary text-sm">
                Select a category on the radar to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: risk-radar-view.ssr.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/risk-radar-view/risk-radar-view.ssr.tsx

```typescript
import { Info } from "lucide-react";

import {
  adaptCategoryOverviewToRadarData,
  getCategoryOverview,
} from "@/actions/overview/risk-radar";
import { SearchParamsProps } from "@/types";

import { pickFilterParams } from "../../_lib/filter-params";
import { RiskRadarViewClient } from "./risk-radar-view-client";

export async function RiskRadarViewSSR({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const filters = pickFilterParams(searchParams);

  // Fetch category overview data
  const categoryResponse = await getCategoryOverview({ filters });

  // Transform to radar chart format
  const radarData = adaptCategoryOverviewToRadarData(categoryResponse);

  // No data available
  if (radarData.length === 0) {
    return (
      <div className="flex h-[460px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <Info size={48} className="text-text-neutral-tertiary" />
          <p className="text-text-neutral-secondary text-sm">
            No category data available for the selected filters
          </p>
        </div>
      </div>
    );
  }

  return <RiskRadarViewClient data={radarData} />;
}
```

--------------------------------------------------------------------------------

---[FILE: threat-map-view.ssr.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/threat-map-view/threat-map-view.ssr.tsx

```typescript
import {
  adaptRegionsOverviewToThreatMap,
  getRegionsOverview,
} from "@/actions/overview";
import { ThreatMap } from "@/components/graphs/threat-map";
import { SearchParamsProps } from "@/types";

import { pickFilterParams } from "../../_lib/filter-params";

export async function ThreatMapViewSSR({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const filters = pickFilterParams(searchParams);
  const regionsResponse = await getRegionsOverview({ filters });
  const threatMapData = adaptRegionsOverviewToThreatMap(regionsResponse);

  if (threatMapData.locations.length === 0) {
    return (
      <div className="flex h-[460px] w-full items-center justify-center">
        <p className="text-text-neutral-tertiary text-sm">
          No region data available
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 overflow-hidden">
      <ThreatMap data={threatMapData} height={460} />
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: graphs-tabs-client.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/_components/graphs-tabs-client.tsx
Signals: React

```typescript
"use client";

import { useRef, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn";

import { GRAPH_TABS, type TabId } from "../_config/graphs-tabs-config";

interface GraphsTabsClientProps {
  tabsContent: Record<TabId, React.ReactNode>;
}

export const GraphsTabsClient = ({ tabsContent }: GraphsTabsClientProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("findings");
  const contentRef = useRef<HTMLDivElement>(null);

  const handleValueChange = (value: string) => {
    setActiveTab(value as TabId);

    // Scroll to the end of the tab content after a short delay for render
    setTimeout(() => {
      contentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleValueChange}
      className="flex flex-1 flex-col"
    >
      <TabsList className="flex w-fit gap-2">
        {GRAPH_TABS.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="whitespace-nowrap"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div ref={contentRef}>
        {GRAPH_TABS.map((tab) =>
          activeTab === tab.id ? (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="mt-10 flex flex-1 overflow-visible"
            >
              {tabsContent[tab.id]}
            </TabsContent>
          ) : null,
        )}
      </div>
    </Tabs>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: graphs-tabs-config.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/graphs-tabs/_config/graphs-tabs-config.ts

```typescript
export const GRAPH_TABS = [
  {
    id: "findings",
    label: "New Findings",
  },
  {
    id: "threat-map",
    label: "Threat Map",
  },
  {
    id: "risk-radar",
    label: "Risk Radar",
  },
  {
    id: "risk-pipeline",
    label: "Risk Pipeline",
  },
  {
    id: "risk-plot",
    label: "Risk Plot",
  },
] as const;

export type TabId = (typeof GRAPH_TABS)[number]["id"];
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/risk-severity/index.ts

```typescript
export { RiskSeverityChart } from "./_components/risk-severity-chart";
export { RiskSeverityChartSkeleton } from "./_components/risk-severity-chart.skeleton";
export { RiskSeverityChartSSR } from "./risk-severity-chart.ssr";
```

--------------------------------------------------------------------------------

---[FILE: risk-severity-chart.ssr.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/risk-severity/risk-severity-chart.ssr.tsx

```typescript
import { getFindingsBySeverity } from "@/actions/overview";

import { pickFilterParams } from "../_lib/filter-params";
import { SSRComponentProps } from "../_types";
import { RiskSeverityChart } from "./_components/risk-severity-chart";

export const RiskSeverityChartSSR = async ({
  searchParams,
}: SSRComponentProps) => {
  const filters = pickFilterParams(searchParams);
  // Filter by FAIL findings
  filters["filter[status]"] = "FAIL";

  const findingsBySeverity = await getFindingsBySeverity({ filters });

  if (!findingsBySeverity) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-zinc-900 bg-stone-950">
        <p className="text-zinc-400">Failed to load severity data</p>
      </div>
    );
  }

  const {
    critical = 0,
    high = 0,
    medium = 0,
    low = 0,
    informational = 0,
  } = findingsBySeverity?.data?.attributes || {};

  return (
    <RiskSeverityChart
      critical={critical}
      high={high}
      medium={medium}
      low={low}
      informational={informational}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: risk-severity-chart.skeleton.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/risk-severity/_components/risk-severity-chart.skeleton.tsx

```typescript
import { Card, CardContent, CardHeader, Skeleton } from "@/components/shadcn";

export function RiskSeverityChartSkeleton() {
  return (
    <Card
      variant="base"
      className="flex min-h-[372px] min-w-[312px] flex-1 flex-col md:min-w-[380px]"
    >
      <CardHeader>
        <Skeleton className="h-7 w-[260px] rounded-xl" />
      </CardHeader>

      <CardContent className="flex flex-1 items-center justify-start px-6">
        <div className="flex w-full flex-col gap-6">
          {/* 5 horizontal bar skeletons */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex h-7 w-full gap-6">
              <Skeleton className="h-full w-28 shrink-0 rounded-xl" />
              <Skeleton className="h-full flex-1 rounded-xl" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: risk-severity-chart.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/risk-severity/_components/risk-severity-chart.tsx
Signals: Next.js

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { HorizontalBarChart } from "@/components/graphs/horizontal-bar-chart";
import { BarDataPoint } from "@/components/graphs/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";
import { mapProviderFiltersForFindings } from "@/lib/provider-helpers";
import { calculatePercentage } from "@/lib/utils";
import { SEVERITY_FILTER_MAP } from "@/types/severities";

interface RiskSeverityChartProps {
  critical: number;
  high: number;
  medium: number;
  low: number;
  informational: number;
}

export const RiskSeverityChart = ({
  critical,
  high,
  medium,
  low,
  informational,
}: RiskSeverityChartProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBarClick = (dataPoint: BarDataPoint) => {
    // Build the URL with current filters plus severity and muted
    const params = new URLSearchParams(searchParams.toString());

    mapProviderFiltersForFindings(params);

    const severity = SEVERITY_FILTER_MAP[dataPoint.name];
    if (severity) {
      params.set("filter[severity__in]", severity);
    }

    // Add exclude muted findings filter
    params.set("filter[muted]", "false");

    // Filter by FAIL findings
    params.set("filter[status__in]", "FAIL");

    // Navigate to findings page
    router.push(`/findings?${params.toString()}`);
  };
  // Calculate total findings
  const totalFindings = critical + high + medium + low + informational;

  // Transform data to BarDataPoint format
  const chartData: BarDataPoint[] = [
    {
      name: "Critical",
      value: critical,
      percentage: calculatePercentage(critical, totalFindings),
    },
    {
      name: "High",
      value: high,
      percentage: calculatePercentage(high, totalFindings),
    },
    {
      name: "Medium",
      value: medium,
      percentage: calculatePercentage(medium, totalFindings),
    },
    {
      name: "Low",
      value: low,
      percentage: calculatePercentage(low, totalFindings),
    },
    {
      name: "Info",
      value: informational,
      percentage: calculatePercentage(informational, totalFindings),
    },
  ];

  return (
    <Card
      variant="base"
      className="flex min-h-[372px] min-w-[312px] flex-1 flex-col md:min-w-[380px]"
    >
      <CardHeader>
        <CardTitle>Risk Severity</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 items-center justify-start px-6">
        <HorizontalBarChart data={chartData} onBarClick={handleBarClick} />
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: finding-severity-over-time.ssr.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/severity-over-time/finding-severity-over-time.ssr.tsx

```typescript
import { getSeverityTrendsByTimeRange } from "@/actions/overview/severity-trends";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";

import { pickFilterParams } from "../_lib/filter-params";
import { SSRComponentProps } from "../_types";
import { FindingSeverityOverTime } from "./_components/finding-severity-over-time";
import { FindingSeverityOverTimeSkeleton } from "./_components/finding-severity-over-time.skeleton";
import { DEFAULT_TIME_RANGE } from "./_constants/time-range.constants";

export { FindingSeverityOverTimeSkeleton };

const EmptyState = ({ message }: { message: string }) => (
  <Card variant="base" className="flex h-full min-h-[405px] flex-1 flex-col">
    <CardHeader className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <CardTitle>Findings Severity Over Time</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="flex flex-1 items-center justify-center">
      <p className="text-text-neutral-tertiary">{message}</p>
    </CardContent>
  </Card>
);

export const FindingSeverityOverTimeSSR = async ({
  searchParams,
}: SSRComponentProps) => {
  const filters = pickFilterParams(searchParams);

  const result = await getSeverityTrendsByTimeRange({
    timeRange: DEFAULT_TIME_RANGE,
    filters,
  });

  if (result.status === "error") {
    return <EmptyState message="Failed to load severity trends data" />;
  }

  if (result.status === "empty") {
    return <EmptyState message="No severity trends data available" />;
  }

  return (
    <Card variant="base" className="flex h-full flex-1 flex-col">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <CardTitle>Findings Severity Over Time</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col px-6">
        <FindingSeverityOverTime data={result.data.data} />
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/severity-over-time/index.ts

```typescript
export { FindingSeverityOverTime } from "./_components/finding-severity-over-time";
export { FindingSeverityOverTimeSkeleton } from "./_components/finding-severity-over-time.skeleton";
export { TimeRangeSelector } from "./_components/time-range-selector";
export { FindingSeverityOverTimeSSR } from "./finding-severity-over-time.ssr";
```

--------------------------------------------------------------------------------

---[FILE: finding-severity-over-time.skeleton.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/severity-over-time/_components/finding-severity-over-time.skeleton.tsx

```typescript
import { Skeleton } from "@/components/shadcn";

export function FindingSeverityOverTimeSkeleton() {
  return (
    <div role="status" aria-label="Loading severity trends">
      <div className="mb-8 w-fit">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-12 rounded-full" />
          ))}
        </div>
      </div>
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  );
}
```

--------------------------------------------------------------------------------

````
