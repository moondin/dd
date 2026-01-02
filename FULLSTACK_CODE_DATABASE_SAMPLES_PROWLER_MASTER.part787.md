---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 787
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 787 of 867)

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

---[FILE: finding-severity-over-time.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/severity-over-time/_components/finding-severity-over-time.tsx
Signals: React, Next.js

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { getSeverityTrendsByTimeRange } from "@/actions/overview/severity-trends";
import { LineChart } from "@/components/graphs/line-chart";
import { LineConfig, LineDataPoint } from "@/components/graphs/types";
import {
  SEVERITY_LEVELS,
  SEVERITY_LINE_CONFIGS,
  SeverityLevel,
} from "@/types/severities";

import { DEFAULT_TIME_RANGE } from "../_constants/time-range.constants";
import { type TimeRange, TimeRangeSelector } from "./time-range-selector";

interface FindingSeverityOverTimeProps {
  data: LineDataPoint[];
}

export const FindingSeverityOverTime = ({
  data: initialData,
}: FindingSeverityOverTimeProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timeRange, setTimeRange] = useState<TimeRange>(DEFAULT_TIME_RANGE);
  const [data, setData] = useState<LineDataPoint[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePointClick = ({
    point,
    dataKey,
  }: {
    point: LineDataPoint;
    dataKey?: string;
  }) => {
    const params = new URLSearchParams();

    // Always filter by FAIL status since this chart shows failed findings
    params.set("filter[status__in]", "FAIL");

    // Exclude muted findings
    params.set("filter[muted]", "false");

    // Add scan_ids filter
    if (
      point.scan_ids &&
      Array.isArray(point.scan_ids) &&
      point.scan_ids.length > 0
    ) {
      params.set("filter[scan__in]", point.scan_ids.join(","));
    }

    // Add severity filter if clicked on a specific severity line
    if (dataKey && SEVERITY_LEVELS.includes(dataKey as SeverityLevel)) {
      params.set("filter[severity__in]", dataKey);
    }

    // Preserve provider filters from overview
    const providerType = searchParams.get("filter[provider_type__in]");
    const providerId = searchParams.get("filter[provider_id__in]");

    if (providerType) {
      params.set("filter[provider_type__in]", providerType);
    }
    if (providerId) {
      params.set("filter[provider__in]", providerId);
    }

    router.push(`/findings?${params.toString()}`);
  };

  const handleTimeRangeChange = async (newRange: TimeRange) => {
    setTimeRange(newRange);
    setIsLoading(true);
    setError(null);

    try {
      const result = await getSeverityTrendsByTimeRange({
        timeRange: newRange,
      });

      if (result.status === "success") {
        setData(result.data.data);
      } else if (result.status === "empty") {
        setData([]);
        setError("No severity trends data available for this time range");
      } else {
        setError("Failed to load severity trends. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching severity trends:", err);
      setError("Failed to load severity trends. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Build line configurations from shared severity configs
  const lines: LineConfig[] = [...SEVERITY_LINE_CONFIGS];

  // Calculate x-axis interval based on data length to show all labels without overlap
  const getXAxisInterval = (): number => {
    const dataLength = data.length;
    if (dataLength <= 7) return 0; // Show all labels for 5D and 1W
    return 0; // Show all labels for 1M too
  };

  return (
    <>
      <div className="mb-8 w-fit">
        <TimeRangeSelector
          value={timeRange}
          onChange={handleTimeRangeChange}
          isLoading={isLoading}
        />
      </div>
      {error ? (
        <div
          role="alert"
          className="flex h-[400px] w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
        >
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <div className="mb-4 w-full">
          <LineChart
            data={data}
            lines={lines}
            height={400}
            xAxisInterval={getXAxisInterval()}
            onPointClick={handlePointClick}
          />
        </div>
      )}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: time-range-selector.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/severity-over-time/_components/time-range-selector.tsx

```typescript
"use client";

import { cn } from "@/lib/utils";

import {
  TIME_RANGE_OPTIONS,
  type TimeRange,
} from "../_constants/time-range.constants";

export type { TimeRange };

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void | Promise<void>;
  isLoading?: boolean;
}

const BUTTON_STYLES = {
  base: "relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  border: "border-r border-border-neutral-primary last:border-r-0",
  text: "text-text-neutral-secondary hover:text-text-neutral-primary",
  active: "data-[state=active]:text-text-neutral-primary",
  underline:
    "after:absolute after:bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-emerald-400 after:transition-all data-[state=active]:after:w-8",
  focus:
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
} as const;

export const TimeRangeSelector = ({
  value,
  onChange,
  isLoading = false,
}: TimeRangeSelectorProps) => {
  return (
    <div className="border-border-neutral-tertiary bg-bg-neutral-tertiary inline-flex items-center gap-2 rounded-full border">
      {Object.entries(TIME_RANGE_OPTIONS).map(([key, range]) => (
        <button
          key={key}
          onClick={() => onChange(range as TimeRange)}
          disabled={isLoading || false}
          data-state={value === range ? "active" : "inactive"}
          className={cn(
            BUTTON_STYLES.base,
            BUTTON_STYLES.border,
            BUTTON_STYLES.text,
            BUTTON_STYLES.active,
            BUTTON_STYLES.underline,
            BUTTON_STYLES.focus,
            isLoading && "cursor-not-allowed opacity-50",
          )}
        >
          {range}
        </button>
      ))}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/severity-over-time/_constants/index.ts

```typescript
export * from "./time-range.constants";
```

--------------------------------------------------------------------------------

---[FILE: time-range.constants.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/severity-over-time/_constants/time-range.constants.ts

```typescript
export const TIME_RANGE_OPTIONS = {
  FIVE_DAYS: "5D",
  ONE_WEEK: "1W",
  ONE_MONTH: "1M",
} as const;

export type TimeRange =
  (typeof TIME_RANGE_OPTIONS)[keyof typeof TIME_RANGE_OPTIONS];

export const TIME_RANGE_DAYS: Record<TimeRange, number> = {
  "5D": 5,
  "1W": 7,
  "1M": 30,
};

export const DEFAULT_TIME_RANGE: TimeRange = "5D";

export const getDateFromForTimeRange = (timeRange: TimeRange): string => {
  const days = TIME_RANGE_DAYS[timeRange];
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/status-chart/index.ts

```typescript
export { StatusChart } from "./_components/status-chart";
export { StatusChartSkeleton } from "./_components/status-chart.skeleton";
```

--------------------------------------------------------------------------------

---[FILE: status-chart.skeleton.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/status-chart/_components/status-chart.skeleton.tsx

```typescript
import { Card, CardContent, CardHeader, Skeleton } from "@/components/shadcn";

export function StatusChartSkeleton() {
  return (
    <Card
      variant="base"
      className="flex min-h-[372px] min-w-[312px] flex-1 flex-col justify-between md:min-w-[380px]"
    >
      <CardHeader>
        <Skeleton className="h-7 w-[260px] rounded-xl" />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        {/* Circular skeleton for donut chart */}
        <div className="mx-auto h-[172px] w-[172px]">
          <Skeleton className="size-[172px] rounded-full" />
        </div>

        {/* Bottom info box skeleton */}
        <Skeleton className="h-[97px] w-full shrink-0 rounded-xl" />
      </CardContent>
    </Card>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: status-chart.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/status-chart/_components/status-chart.tsx
Signals: Next.js

```typescript
"use client";

import { Bell, ShieldCheck, TriangleAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { DonutChart } from "@/components/graphs/donut-chart";
import { DonutDataPoint } from "@/components/graphs/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardVariant,
  ResourceStatsCard,
} from "@/components/shadcn";
import { mapProviderFiltersForFindings } from "@/lib/provider-helpers";
import { calculatePercentage } from "@/lib/utils";
interface FindingsData {
  total: number;
  new: number;
}

interface StatusChartProps {
  failFindingsData: FindingsData;
  passFindingsData: FindingsData;
}

export const StatusChart = ({
  failFindingsData,
  passFindingsData,
}: StatusChartProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Calculate total from displayed findings (fail + pass)
  const totalFindings = failFindingsData.total + passFindingsData.total;

  const handleSegmentClick = (dataPoint: DonutDataPoint) => {
    // Build the URL with current filters plus status and muted
    const params = new URLSearchParams(searchParams.toString());

    mapProviderFiltersForFindings(params);

    // Add status filter based on which segment was clicked
    if (dataPoint.name === "Fail Findings") {
      params.set("filter[status__in]", "FAIL");
    } else if (dataPoint.name === "Pass Findings") {
      params.set("filter[status__in]", "PASS");
    }

    // Add exclude muted findings filter
    params.set("filter[muted]", "false");

    // Navigate to findings page
    router.push(`/findings?${params.toString()}`);
  };

  // Calculate percentages
  const failPercentage = calculatePercentage(
    failFindingsData.total,
    totalFindings,
  );
  const passPercentage = calculatePercentage(
    passFindingsData.total,
    totalFindings,
  );

  // Calculate change percentages (new findings as percentage change)
  const failChange = calculatePercentage(
    failFindingsData.new,
    failFindingsData.total,
  );
  const passChange = calculatePercentage(
    passFindingsData.new,
    passFindingsData.total,
  );

  // Mock data for DonutChart
  const donutData: DonutDataPoint[] = [
    {
      name: "Fail Findings",
      value: failFindingsData.total,
      color: "var(--bg-fail-primary)",
      percentage: Number(failPercentage),
      change: Number(failChange),
    },
    {
      name: "Pass Findings",
      value: passFindingsData.total,
      color: "var(--bg-pass-primary)",
      percentage: Number(passPercentage),
      change: Number(passChange),
    },
  ];

  return (
    <Card
      variant="base"
      className="flex min-h-[372px] min-w-[312px] flex-1 flex-col justify-between md:min-w-[380px]"
    >
      <CardHeader>
        <CardTitle>Check Findings</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        <div className="mx-auto h-[172px] w-[172px]">
          <DonutChart
            data={donutData}
            showLegend={false}
            innerRadius={66}
            outerRadius={86}
            centerLabel={{
              value: totalFindings.toLocaleString(),
              label: "Total Findings",
            }}
            onSegmentClick={handleSegmentClick}
          />
        </div>

        <Card
          variant="inner"
          padding="md"
          className="flex w-full flex-col items-start justify-center gap-4 lg:flex-row lg:justify-between"
        >
          <ResourceStatsCard
            containerless
            badge={{
              icon: TriangleAlert,
              count: failFindingsData.total,
              variant: CardVariant.fail,
            }}
            label="Fail Findings"
            stats={[{ icon: Bell, label: `${failFindingsData.new} New` }]}
            emptyState={
              failFindingsData.total === 0
                ? { message: "No failed findings to display" }
                : undefined
            }
            className="w-full lg:min-w-0 lg:flex-1"
          />

          <div className="flex w-full items-center justify-center lg:w-auto lg:self-stretch">
            <div className="bg-border-neutral-primary h-px w-full lg:h-full lg:w-px" />
          </div>

          <ResourceStatsCard
            containerless
            badge={{
              icon: ShieldCheck,
              count: passFindingsData.total,
              variant: CardVariant.pass,
            }}
            label="Pass Findings"
            stats={[{ icon: Bell, label: `${passFindingsData.new} New` }]}
            emptyState={
              passFindingsData.total === 0
                ? { message: "No passed findings to display" }
                : undefined
            }
            className="w-full lg:min-w-0 lg:flex-1"
          />
        </Card>
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/threat-score/index.ts

```typescript
export { ThreatScore } from "./_components/threat-score";
export { ThreatScoreSkeleton } from "./_components/threat-score.skeleton";
export { ThreatScoreSSR } from "./threat-score.ssr";
```

--------------------------------------------------------------------------------

---[FILE: threat-score.ssr.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/threat-score/threat-score.ssr.tsx

```typescript
import { getThreatScore } from "@/actions/overview";

import { pickFilterParams } from "../_lib/filter-params";
import { SSRComponentProps } from "../_types";
import { ThreatScore } from "./_components/threat-score";

export const ThreatScoreSSR = async ({ searchParams }: SSRComponentProps) => {
  const filters = pickFilterParams(searchParams);
  const threatScoreData = await getThreatScore({ filters });

  // If no data, pass undefined score and let component handle empty state
  if (!threatScoreData?.data || threatScoreData.data.length === 0) {
    return <ThreatScore />;
  }

  // Get the first snapshot (aggregated or single provider)
  const snapshot = threatScoreData.data[0];
  const attributes = snapshot.attributes;

  // Parse score from decimal string to number
  const score = parseFloat(attributes.overall_score);
  const scoreDelta = attributes.score_delta
    ? parseFloat(attributes.score_delta)
    : null;

  return (
    <ThreatScore
      score={score}
      scoreDelta={scoreDelta}
      sectionScores={attributes.section_scores}
      criticalRequirements={attributes.critical_requirements}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: threat-score.skeleton.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/threat-score/_components/threat-score.skeleton.tsx

```typescript
import { Card, CardContent, CardHeader, Skeleton } from "@/components/shadcn";

export function ThreatScoreSkeleton() {
  return (
    <Card
      variant="base"
      className="flex min-h-[372px] w-full flex-col justify-between lg:max-w-[312px]"
    >
      <CardHeader>
        <Skeleton className="h-7 w-36 rounded-xl" />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        {/* Circular skeleton for radial chart */}
        <div className="relative mx-auto h-[172px] w-full max-w-[250px]">
          <Skeleton className="mx-auto size-[170px] rounded-full" />
        </div>

        {/* Bottom info box skeleton */}
        <Skeleton className="h-[97px] w-full shrink-0 rounded-xl" />
      </CardContent>
    </Card>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: threat-score.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/threat-score/_components/threat-score.tsx

```typescript
"use client";

import { MessageCircleWarning, ThumbsUp } from "lucide-react";

import type {
  CriticalRequirement,
  SectionScores,
} from "@/actions/overview/threat-score";
import { RadialChart } from "@/components/graphs/radial-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";

// CSS variables are required here as they're passed to RadialChart component
// which uses Recharts library that needs actual color values, not Tailwind classes
const THREAT_COLORS = {
  DANGER: "var(--bg-fail-primary)",
  WARNING: "var(--bg-warning-primary)",
  SUCCESS: "var(--bg-pass-primary)",
  NEUTRAL: "var(--bg-neutral-tertiary)",
} as const;

const THREAT_LEVEL_CONFIG = {
  DANGER: {
    label: "Critical Risk",
    color: THREAT_COLORS.DANGER,
    minScore: 0,
    maxScore: 30,
  },
  WARNING: {
    label: "Moderate Risk",
    color: THREAT_COLORS.WARNING,
    minScore: 31,
    maxScore: 60,
  },
  SUCCESS: {
    label: "Secure",
    color: THREAT_COLORS.SUCCESS,
    minScore: 61,
    maxScore: 100,
  },
} as const;

type ThreatLevelKey = keyof typeof THREAT_LEVEL_CONFIG;

interface ThreatScoreProps {
  score?: number | null;
  scoreDelta?: number | null;
  sectionScores?: SectionScores;
  criticalRequirements?: CriticalRequirement[];
  onViewRemediationPlan?: () => void;
  className?: string;
}

function getThreatLevel(score: number): ThreatLevelKey {
  for (const [key, config] of Object.entries(THREAT_LEVEL_CONFIG)) {
    if (score >= config.minScore && score <= config.maxScore) {
      return key as ThreatLevelKey;
    }
  }
  return "WARNING";
}

// Convert section scores to tooltip data for the radial chart
function convertSectionScoresToTooltipData(
  sectionScores?: SectionScores,
): Array<{ name: string; value: number; color: string }> {
  if (!sectionScores) return [];

  return Object.entries(sectionScores).map(([name, value]) => {
    // Determine color based on the same ranges as THREAT_LEVEL_CONFIG
    const threatLevel = getThreatLevel(value);
    const color = THREAT_LEVEL_CONFIG[threatLevel].color;

    return { name, value, color };
  });
}

// Extract top gap names from critical requirements
function extractTopGaps(
  criticalRequirements?: CriticalRequirement[],
  limit = 2,
): string[] {
  if (!criticalRequirements || criticalRequirements.length === 0) return [];

  // Sort by risk_level descending, then by weight descending
  const sorted = [...criticalRequirements].sort((a, b) => {
    if (b.risk_level !== a.risk_level) {
      return b.risk_level - a.risk_level;
    }
    return b.weight - a.weight;
  });

  return sorted.slice(0, limit).map((req) => req.title);
}

export function ThreatScore({
  score,
  scoreDelta,
  sectionScores,
  criticalRequirements,
}: ThreatScoreProps) {
  const hasData = score !== null && score !== undefined;
  const displayScore = hasData ? score : 0;

  const threatLevel = getThreatLevel(displayScore);
  const config = THREAT_LEVEL_CONFIG[threatLevel];

  // Convert section scores to tooltip data
  const tooltipData = convertSectionScoresToTooltipData(sectionScores);

  // Extract top gaps from critical requirements
  const gaps = extractTopGaps(criticalRequirements, 2);

  return (
    <Card
      variant="base"
      className="flex min-h-[372px] w-full flex-col justify-between lg:max-w-[312px]"
    >
      <CardHeader>
        <CardTitle>Prowler ThreatScore</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        {/* Radial Chart */}
        <div className="relative mx-auto h-[172px] w-full max-w-[250px]">
          <div className="absolute top-0 left-1/2 z-1 w-full -translate-x-1/2">
            <RadialChart
              percentage={displayScore}
              label="Score"
              color={config.color}
              backgroundColor={THREAT_COLORS.NEUTRAL}
              height={206}
              innerRadius={90}
              outerRadius={115}
              startAngle={200}
              endAngle={-20}
              hasDots
              tooltipData={tooltipData}
            />
          </div>
          {/* Overlaid Text (centered) */}
          {hasData && (
            <div className="pointer-events-none absolute top-[65%] left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-text-neutral-secondary text-sm text-nowrap">
                {config.label}
              </p>
            </div>
          )}
        </div>

        {/* Info Box or Empty State */}
        {hasData ? (
          <Card
            variant="inner"
            padding="md"
            className="items-center justify-center"
          >
            <div className="text-text-neutral-secondary flex flex-col gap-1.5 text-sm leading-6">
              {/* Improvement Message */}
              {scoreDelta !== undefined &&
                scoreDelta !== null &&
                scoreDelta !== 0 && (
                  <div className="flex items-start gap-1.5">
                    <ThumbsUp
                      size={16}
                      className="mt-0.5 min-h-4 min-w-4 shrink-0"
                    />
                    <p>
                      Prowler ThreatScore has{" "}
                      {scoreDelta > 0 ? "improved" : "decreased"} by{" "}
                      {Math.abs(scoreDelta)}%
                    </p>
                  </div>
                )}

              {/* Gaps Message */}
              {gaps.length > 0 && (
                <div className="flex items-start gap-1.5">
                  <MessageCircleWarning
                    size={16}
                    className="mt-0.5 min-h-4 min-w-4 shrink-0"
                  />
                  <p>
                    Major gaps include {gaps.slice(0, 2).join(", ")}
                    {gaps.length > 2 && ` & ${gaps.length - 2} more...`}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card
            variant="inner"
            padding="md"
            className="items-center justify-center"
          >
            <p className="text-text-neutral-secondary text-sm">
              Prowler ThreatScore Data Unavailable
            </p>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: compliance-watchlist.ssr.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/watchlist/compliance-watchlist.ssr.tsx

```typescript
import {
  adaptComplianceOverviewsResponse,
  getCompliancesOverview,
} from "@/actions/compliances";

import { pickFilterParams } from "../_lib/filter-params";
import { SSRComponentProps } from "../_types";
import { ComplianceWatchlist } from "./_components/compliance-watchlist";

export const ComplianceWatchlistSSR = async ({
  searchParams,
}: SSRComponentProps) => {
  const filters = pickFilterParams(searchParams);

  const response = await getCompliancesOverview({ filters });
  const { data } = adaptComplianceOverviewsResponse(response);

  // Filter out ProwlerThreatScore and limit to 5 items
  const items = data
    .filter((item) => item.framework !== "ProwlerThreatScore")
    .slice(0, 5)
    .map((compliance) => ({
      id: compliance.id,
      framework: compliance.framework,
      label: compliance.label,
      icon: compliance.icon,
      score: compliance.score,
    }));

  return <ComplianceWatchlist items={items} />;
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/app/(prowler)/_overview/watchlist/index.ts

```typescript
export type { ComplianceData } from "./_components/compliance-watchlist";
export { ComplianceWatchlist } from "./_components/compliance-watchlist";
export { ServiceWatchlist } from "./_components/service-watchlist";
export { SortToggleButton } from "./_components/sort-toggle-button";
export { WatchlistCardSkeleton } from "./_components/watchlist.skeleton";
export {
  WatchlistCard,
  type WatchlistCardProps,
  type WatchlistItem,
} from "./_components/watchlist-card";
export { ComplianceWatchlistSSR } from "./compliance-watchlist.ssr";
export { ServiceWatchlistSSR } from "./service-watchlist.ssr";
```

--------------------------------------------------------------------------------

---[FILE: service-watchlist.ssr.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/watchlist/service-watchlist.ssr.tsx

```typescript
import { getServicesOverview, ServiceOverview } from "@/actions/overview";

import { pickFilterParams } from "../_lib/filter-params";
import { SSRComponentProps } from "../_types";
import { ServiceWatchlist } from "./_components/service-watchlist";

export const ServiceWatchlistSSR = async ({
  searchParams,
}: SSRComponentProps) => {
  const filters = pickFilterParams(searchParams);

  const response = await getServicesOverview({ filters });

  const items: ServiceOverview[] = response?.data ?? [];

  return <ServiceWatchlist items={items} />;
};
```

--------------------------------------------------------------------------------

---[FILE: compliance-watchlist.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/watchlist/_components/compliance-watchlist.tsx
Signals: React, Next.js

```typescript
"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import { SortToggleButton } from "./sort-toggle-button";
import { WatchlistCard } from "./watchlist-card";

export interface ComplianceData {
  id: string;
  framework: string;
  label: string;
  icon?: string | StaticImageData;
  score: number;
}

export const ComplianceWatchlist = ({ items }: { items: ComplianceData[] }) => {
  const [isAsc, setIsAsc] = useState(true);

  const sortedItems = [...items]
    .sort((a, b) => (isAsc ? a.score - b.score : b.score - a.score))
    .map((item) => ({
      key: item.id,
      icon: item.icon ? (
        <div className="relative size-3">
          <Image
            src={item.icon}
            alt={`${item.framework} framework`}
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="bg-bg-data-muted size-3 rounded-sm" />
      ),
      label: item.label,
      value: `${item.score}%`,
    }));

  return (
    <WatchlistCard
      title="Compliance Watchlist"
      items={sortedItems}
      ctaLabel="Compliance Dashboard"
      ctaHref="/compliance"
      headerAction={
        <SortToggleButton
          isAscending={isAsc}
          onToggle={() => setIsAsc(!isAsc)}
          ascendingLabel="Sort by highest score"
          descendingLabel="Sort by lowest score"
        />
      }
      emptyState={{
        message: "This space is looking empty.",
        description: "to add compliance frameworks to your watchlist.",
        linkText: "Compliance Dashboard",
      }}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: service-watchlist.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/watchlist/_components/service-watchlist.tsx
Signals: React, Next.js

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { ServiceOverview } from "@/actions/overview";
import { mapProviderFiltersForFindings } from "@/lib/provider-helpers";

import { SortToggleButton } from "./sort-toggle-button";
import { WatchlistCard, WatchlistItem } from "./watchlist-card";

export const ServiceWatchlist = ({ items }: { items: ServiceOverview[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAsc, setIsAsc] = useState(false);

  const sortedItems = [...items]
    .sort((a, b) =>
      isAsc
        ? a.attributes.fail - b.attributes.fail
        : b.attributes.fail - a.attributes.fail,
    )
    .slice(0, 5)
    .map((item) => ({
      key: item.id,
      label: item.id,
      value: item.attributes.fail,
    }));

  const handleItemClick = (item: WatchlistItem) => {
    const params = new URLSearchParams(searchParams.toString());

    mapProviderFiltersForFindings(params);

    params.set("filter[service__in]", item.key);
    params.set("filter[status__in]", "FAIL");
    router.push(`/findings?${params.toString()}`);
  };

  return (
    <WatchlistCard
      title="Service Watchlist"
      items={sortedItems}
      headerAction={
        <SortToggleButton
          isAscending={isAsc}
          onToggle={() => setIsAsc(!isAsc)}
          ascendingLabel="Sort by highest failures"
          descendingLabel="Sort by lowest failures"
        />
      }
      emptyState={{
        message: "This space is looking empty.",
      }}
      onItemClick={handleItemClick}
      useFailureColoring
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: sort-toggle-button.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/watchlist/_components/sort-toggle-button.tsx

```typescript
"use client";

import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";

import { Button } from "@/components/shadcn/button/button";

interface SortToggleButtonProps {
  isAscending: boolean;
  onToggle: () => void;
  ascendingLabel?: string;
  descendingLabel?: string;
}

export const SortToggleButton = ({
  isAscending,
  onToggle,
  ascendingLabel = "Sort descending",
  descendingLabel = "Sort ascending",
}: SortToggleButtonProps) => {
  const SortIcon = isAscending ? ArrowUpNarrowWide : ArrowDownNarrowWide;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label={isAscending ? ascendingLabel : descendingLabel}
    >
      <SortIcon className="size-4" />
    </Button>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: watchlist-card.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/watchlist/_components/watchlist-card.tsx
Signals: React, Next.js

```typescript
import { SearchX } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { Button } from "@/components/shadcn/button/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/shadcn/card/card";
import { cn } from "@/lib/utils";

const SCORE_CONFIG = {
  FAIL: {
    textColor: "text-text-error-primary",
    minScore: 0,
    maxScore: 30,
  },
  WARNING: {
    textColor: "text-text-warning-primary",
    minScore: 31,
    maxScore: 60,
  },
  PASS: {
    textColor: "text-text-success-primary",
    minScore: 61,
    maxScore: 100,
  },
} as const;

const getScoreTextColor = (score: number): string => {
  for (const config of Object.values(SCORE_CONFIG)) {
    if (score >= config.minScore && score <= config.maxScore) {
      return config.textColor;
    }
  }

  return SCORE_CONFIG.WARNING.textColor;
};

const getFailureTextColor = (value: number): string => {
  return value === 0
    ? SCORE_CONFIG.PASS.textColor
    : SCORE_CONFIG.FAIL.textColor;
};

export interface WatchlistItem {
  icon?: ReactNode;
  label: string;
  key: string;
  value: string | number;
}

export interface WatchlistCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  items: WatchlistItem[];
  ctaLabel?: string;
  ctaHref?: string;
  headerAction?: React.ReactNode;
  emptyState?: {
    message?: string;
    description?: string;
    linkText?: string;
  };
  onItemClick?: (item: WatchlistItem) => void;
  /**
   * When true, uses failure-based coloring: green for 0, red otherwise.
   * When false (default), uses score-based coloring (0-30 red, 31-60 yellow, 61-100 green).
   */
  useFailureColoring?: boolean;
}

export const WatchlistCard = ({
  title,
  items,
  ctaLabel,
  ctaHref,
  headerAction,
  emptyState,
  onItemClick,
  useFailureColoring = false,
}: WatchlistCardProps) => {
  const isEmpty = items.length === 0;

  return (
    <Card variant="base" className="flex min-h-[405px] min-w-[312px] flex-col">
      <div className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {headerAction}
      </div>
      <CardContent className="flex flex-col">
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-12 py-6">
            {/* Icon and message */}
            <div className="flex flex-col items-center gap-6 pb-[18px]">
              <SearchX size={64} className="text-bg-data-muted" />
              <p className="text-text-neutral-tertiary w-full text-center text-sm leading-6">
                {emptyState?.message || "This space is looking empty."}
              </p>
            </div>

            {/* Description with link */}
            <p className="text-text-neutral-tertiary w-full text-sm leading-6">
              {emptyState?.description && ctaHref && (
                <>
                  Visit the{" "}
                  <Button variant="link" size="link-sm" asChild>
                    <Link href={ctaHref}>
                      {emptyState.linkText || ctaLabel}
                    </Link>
                  </Button>{" "}
                  {emptyState.description}
                </>
              )}
            </p>
          </div>
        ) : (
          <>
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              // Parse numeric value if it's a percentage string (e.g., "10%")
              const numericValue =
                typeof item.value === "string"
                  ? parseFloat(item.value.replace("%", ""))
                  : item.value;

              // Get color based on score or failure count
              const valueColorClass = !isNaN(numericValue)
                ? useFailureColoring
                  ? getFailureTextColor(numericValue)
                  : getScoreTextColor(numericValue)
                : "text-text-neutral-tertiary";

              const isClickable = !!onItemClick;

              return (
                <div
                  key={item.key}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onClick={() => onItemClick?.(item)}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onItemClick?.(item);
                    }
                  }}
                  className={cn(
                    "flex h-[54px] items-center justify-between gap-2 px-3 py-[11px]",
                    !isLast && "border-border-neutral-tertiary border-b",
                    isClickable &&
                      "hover:bg-bg-neutral-tertiary cursor-pointer",
                  )}
                >
                  {item.icon && (
                    <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                      {item.icon}
                    </div>
                  )}

                  <p className="text-text-neutral-secondary flex-1 truncate text-sm leading-6">
                    {item.label}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <p
                      className={cn(
                        "text-sm leading-6 font-bold",
                        valueColorClass,
                      )}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </CardContent>

      {ctaLabel && ctaHref && (
        <CardFooter className="mb-6">
          <Button variant="link" size="link-sm" asChild className="w-full">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: watchlist.skeleton.tsx]---
Location: prowler-master/ui/app/(prowler)/_overview/watchlist/_components/watchlist.skeleton.tsx

```typescript
import { Card, CardContent, CardTitle } from "@/components/shadcn/card/card";
import { Skeleton } from "@/components/shadcn/skeleton/skeleton";

export function WatchlistCardSkeleton() {
  return (
    <Card variant="base" className="flex min-h-[500px] min-w-[312px] flex-col">
      <CardTitle>
        <Skeleton className="h-7 w-[168px] rounded-xl" />
      </CardTitle>

      <CardContent className="flex flex-1 flex-col justify-center gap-8">
        {/* 6 skeleton rows */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex h-7 w-full items-start gap-6">
            <Skeleton className="h-7 w-[168px] rounded-xl" />
            <Skeleton className="h-7 flex-1 rounded-xl" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

--------------------------------------------------------------------------------

````
