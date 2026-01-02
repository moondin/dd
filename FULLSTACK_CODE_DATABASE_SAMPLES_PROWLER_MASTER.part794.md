---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 794
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 794 of 867)

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

---[FILE: finding-detail.tsx]---
Location: prowler-master/ui/components/findings/table/finding-detail.tsx

```typescript
"use client";

import { Snippet } from "@heroui/snippet";
import { Tooltip } from "@heroui/tooltip";
import { ExternalLink, Link } from "lucide-react";
import ReactMarkdown from "react-markdown";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn";
import { CodeSnippet } from "@/components/ui/code-snippet/code-snippet";
import { CustomLink } from "@/components/ui/custom/custom-link";
import { EntityInfo, InfoField } from "@/components/ui/entities";
import { DateWithTime } from "@/components/ui/entities/date-with-time";
import { SeverityBadge } from "@/components/ui/table/severity-badge";
import { buildGitFileUrl, extractLineRangeFromUid } from "@/lib/iac-utils";
import { FindingProps, ProviderType } from "@/types";

import { Muted } from "../muted";
import { DeltaIndicator } from "./delta-indicator";

const MarkdownContainer = ({ children }: { children: string }) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words whitespace-normal">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
};

const renderValue = (value: string | null | undefined) => {
  return value && value.trim() !== "" ? value : "-";
};

// Add new utility function for duration formatting
const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0)
    parts.push(`${remainingSeconds}s`);

  return parts.join(" ");
};

export const FindingDetail = ({
  findingDetails,
}: {
  findingDetails: FindingProps;
}) => {
  const finding = findingDetails;
  const attributes = finding.attributes;
  const resource = finding.relationships.resource.attributes;
  const scan = finding.relationships.scan.attributes;
  const providerDetails = finding.relationships.provider.attributes;
  const currentUrl = new URL(window.location.href);
  const params = new URLSearchParams(currentUrl.search);
  params.set("id", findingDetails.id);
  const url = `${window.location.origin}${currentUrl.pathname}?${params.toString()}`;

  // Build Git URL for IaC findings
  const gitUrl =
    providerDetails.provider === "iac"
      ? buildGitFileUrl(
          providerDetails.uid,
          resource.name,
          extractLineRangeFromUid(attributes.uid) || "",
          resource.region,
        )
      : null;

  return (
    <div className="flex flex-col gap-6 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="dark:text-prowler-theme-pale/90 line-clamp-2 flex items-center gap-2 text-lg leading-tight font-medium text-gray-800">
            {renderValue(attributes.check_metadata.checktitle)}
            <Tooltip content="Copy finding link to clipboard" size="sm">
              <button
                onClick={() => navigator.clipboard.writeText(url)}
                className="text-bg-data-info inline-flex cursor-pointer transition-opacity hover:opacity-80"
                aria-label="Copy finding link to clipboard"
              >
                <Link size={16} />
              </button>
            </Tooltip>
          </h2>
        </div>
        <div className="flex items-center gap-x-4">
          <Muted
            isMuted={attributes.muted}
            mutedReason={attributes.muted_reason || ""}
          />
        </div>
      </div>

      {/* Check Metadata */}
      <Card variant="base" padding="lg">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Finding Details</CardTitle>
          <div
            className={`rounded-lg px-3 py-1 text-sm font-semibold ${
              attributes.status === "PASS"
                ? "bg-green-100 text-green-600"
                : attributes.status === "MANUAL"
                  ? "bg-gray-100 text-gray-600"
                  : "text-system-severity-critical bg-red-100"
            }`}
          >
            {renderValue(attributes.status)}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <EntityInfo
              cloudProvider={providerDetails.provider as ProviderType}
              entityAlias={providerDetails.alias}
              entityId={providerDetails.uid}
              showConnectionStatus={providerDetails.connection.connected}
            />
            <InfoField label="Service">
              {attributes.check_metadata.servicename}
            </InfoField>
            <InfoField label="Region">{resource.region}</InfoField>
            <InfoField label="First Seen">
              <DateWithTime inline dateTime={attributes.first_seen_at || "-"} />
            </InfoField>
            {attributes.delta && (
              <InfoField
                label="Delta"
                tooltipContent="Indicates whether the finding is new (NEW), has changed status (CHANGED), or remains unchanged (NONE) compared to previous scans."
                className="capitalize"
              >
                <div className="flex items-center gap-2">
                  <DeltaIndicator delta={attributes.delta} />
                  {attributes.delta}
                </div>
              </InfoField>
            )}
            <InfoField label="Severity" variant="simple">
              <SeverityBadge severity={attributes.severity || "-"} />
            </InfoField>
          </div>
          <InfoField label="Finding ID" variant="simple">
            <CodeSnippet value={findingDetails.id} />
          </InfoField>
          <InfoField label="Check ID" variant="simple">
            <CodeSnippet value={attributes.check_id} />
          </InfoField>
          <InfoField label="Finding UID" variant="simple">
            <CodeSnippet value={attributes.uid} />
          </InfoField>
          <InfoField label="Resource ID" variant="simple">
            <CodeSnippet value={resource.uid} />
          </InfoField>

          {attributes.status === "FAIL" && (
            <InfoField label="Risk" variant="simple">
              <Snippet
                className="max-w-full py-2"
                color="danger"
                hideCopyButton
                hideSymbol
              >
                <MarkdownContainer>
                  {attributes.check_metadata.risk}
                </MarkdownContainer>
              </Snippet>
            </InfoField>
          )}

          <InfoField label="Description">
            <MarkdownContainer>
              {attributes.check_metadata.description}
            </MarkdownContainer>
          </InfoField>

          <InfoField label="Status Extended">
            {renderValue(attributes.status_extended)}
          </InfoField>

          {attributes.check_metadata.remediation && (
            <div className="flex flex-col gap-4">
              <h4 className="dark:text-prowler-theme-pale/90 text-sm font-bold text-gray-700">
                Remediation Details
              </h4>

              {/* Recommendation section */}
              {attributes.check_metadata.remediation.recommendation.text && (
                <InfoField label="Recommendation">
                  <div className="flex flex-col gap-2">
                    <MarkdownContainer>
                      {
                        attributes.check_metadata.remediation.recommendation
                          .text
                      }
                    </MarkdownContainer>

                    {attributes.check_metadata.remediation.recommendation
                      .url && (
                      <CustomLink
                        href={
                          attributes.check_metadata.remediation.recommendation
                            .url
                        }
                        size="sm"
                      >
                        Learn more
                      </CustomLink>
                    )}
                  </div>
                </InfoField>
              )}

              {/* CLI Command section */}
              {attributes.check_metadata.remediation.code.cli && (
                <InfoField label="CLI Command" variant="simple">
                  <Snippet>
                    <span className="text-xs whitespace-pre-line">
                      {attributes.check_metadata.remediation.code.cli}
                    </span>
                  </Snippet>
                </InfoField>
              )}

              {/* Remediation Steps section */}
              {attributes.check_metadata.remediation.code.other && (
                <InfoField label="Remediation Steps">
                  <MarkdownContainer>
                    {attributes.check_metadata.remediation.code.other}
                  </MarkdownContainer>
                </InfoField>
              )}

              {/* Additional URLs section */}
              {attributes.check_metadata.additionalurls &&
                attributes.check_metadata.additionalurls.length > 0 && (
                  <InfoField label="References">
                    <ul className="list-inside list-disc space-y-1">
                      {attributes.check_metadata.additionalurls.map(
                        (link, idx) => (
                          <li key={idx}>
                            <CustomLink
                              href={link}
                              size="sm"
                              className="break-all whitespace-normal!"
                            >
                              {link}
                            </CustomLink>
                          </li>
                        ),
                      )}
                    </ul>
                  </InfoField>
                )}
            </div>
          )}

          <InfoField label="Categories">
            {attributes.check_metadata.categories?.join(", ") || "none"}
          </InfoField>
        </CardContent>
      </Card>

      {/* Resource Details */}
      <Card variant="base" padding="lg">
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
          {providerDetails.provider === "iac" && gitUrl && (
            <CardAction>
              <Tooltip content="Go to Resource in the Repository" size="sm">
                <a
                  href={gitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bg-data-info inline-flex cursor-pointer"
                  aria-label="Open resource in repository"
                >
                  <ExternalLink size={16} className="inline" />
                </a>
              </Tooltip>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoField label="Resource Name">
              {renderValue(resource.name)}
            </InfoField>
            <InfoField label="Resource Type">
              {renderValue(resource.type)}
            </InfoField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoField label="Service">
              {renderValue(resource.service)}
            </InfoField>
            <InfoField label="Region">{renderValue(resource.region)}</InfoField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoField label="Partition">
              {renderValue(resource.partition)}
            </InfoField>
            <InfoField label="Details">
              {renderValue(resource.details)}
            </InfoField>
          </div>

          {resource.tags && Object.entries(resource.tags).length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400">
                Tags
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Object.entries(resource.tags).map(([key, value]) => (
                  <InfoField key={key} label={key}>
                    {renderValue(value)}
                  </InfoField>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoField label="Created At">
              <DateWithTime inline dateTime={resource.inserted_at || "-"} />
            </InfoField>
            <InfoField label="Last Updated">
              <DateWithTime inline dateTime={resource.updated_at || "-"} />
            </InfoField>
          </div>
        </CardContent>
      </Card>

      {/* Add new Scan Details section */}
      <Card variant="base" padding="lg">
        <CardHeader>
          <CardTitle>Scan Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoField label="Scan Name">{scan.name || "N/A"}</InfoField>
            <InfoField label="Resources Scanned">
              {scan.unique_resource_count}
            </InfoField>
            <InfoField label="Progress">{scan.progress}%</InfoField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoField label="Trigger">{scan.trigger}</InfoField>
            <InfoField label="State">{scan.state}</InfoField>
            <InfoField label="Duration">
              {formatDuration(scan.duration)}
            </InfoField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoField label="Started At">
              <DateWithTime inline dateTime={scan.started_at || "-"} />
            </InfoField>
            <InfoField label="Completed At">
              <DateWithTime inline dateTime={scan.completed_at || "-"} />
            </InfoField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoField label="Launched At">
              <DateWithTime inline dateTime={scan.inserted_at || "-"} />
            </InfoField>
            {scan.scheduled_at && (
              <InfoField label="Scheduled At">
                <DateWithTime inline dateTime={scan.scheduled_at} />
              </InfoField>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/findings/table/index.ts

```typescript
export * from "./column-findings";
export * from "./data-table-row-actions";
export * from "./data-table-row-details";
export * from "./finding-detail";
export * from "./skeleton-table-findings";
```

--------------------------------------------------------------------------------

---[FILE: skeleton-table-findings.tsx]---
Location: prowler-master/ui/components/findings/table/skeleton-table-findings.tsx
Signals: React

```typescript
import React from "react";

import { Card } from "@/components/shadcn/card/card";
import { Skeleton } from "@/components/shadcn/skeleton/skeleton";

export const SkeletonTableFindings = () => {
  const columns = 7;
  const rows = 4;

  return (
    <Card variant="base" padding="md" className="flex flex-col gap-4">
      {/* Table headers */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={`header-${index}`}
            className="h-8"
            style={{ width: `${100 / columns}%` }}
          />
        ))}
      </div>

      {/* Table body */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-12"
                style={{ width: `${100 / columns}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: donut-chart.tsx]---
Location: prowler-master/ui/components/graphs/donut-chart.tsx
Signals: React

```typescript
"use client";

import { useState } from "react";
import { Cell, Label, Pie, PieChart, Tooltip } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart/Chart";

import { ChartLegend } from "./shared/chart-legend";
import { DonutDataPoint } from "./types";

const CHART_COLORS = {
  emptyState: "var(--border-neutral-tertiary)",
};

interface TooltipPayloadData {
  percentage?: number;
  change?: number;
  color?: string;
}

interface TooltipPayloadEntry {
  name: string;
  color?: string;
  payload?: TooltipPayloadData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}

interface LegendPayloadData {
  percentage?: number;
}

interface LegendPayloadEntry {
  value: string;
  color: string;
  payload: LegendPayloadData;
}

interface CustomLegendProps {
  payload: LegendPayloadEntry[];
}

interface CenterLabel {
  value: string | number;
  label: string;
}

interface DonutChartProps {
  data: DonutDataPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  centerLabel?: CenterLabel;
  onSegmentClick?: (dataPoint: DonutDataPoint, index: number) => void;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const entry = payload[0];
  const name = entry.name;
  const percentage = entry.payload?.percentage;
  const color = entry.color || entry.payload?.color;
  const change = entry.payload?.change;

  return (
    <div className="border-border-neutral-tertiary bg-bg-neutral-tertiary rounded-xl border px-3 py-1.5 shadow-lg">
      <div className="flex flex-col gap-0.5">
        {/* Title with color chip */}
        <div className="flex items-center gap-1">
          <div
            className="size-3 shrink-0 rounded"
            style={{ backgroundColor: color }}
          />
          <p className="text-text-neutral-primary text-xs leading-5 font-medium">
            {percentage}% {name}
          </p>
        </div>

        {/* Change percentage row */}
        {change !== undefined && (
          <div className="flex items-start">
            <p className="text-text-neutral-primary text-xs leading-5 font-medium">
              {change > 0 ? "+" : ""}
              {change}% Since last scan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomLegend = ({ payload }: CustomLegendProps) => {
  const items = payload.map((entry: LegendPayloadEntry) => ({
    label: `${entry.value} (${entry.payload.percentage ?? 0}%)`,
    color: entry.color,
  }));

  return <ChartLegend items={items} />;
};

export function DonutChart({
  data,
  innerRadius = 68,
  outerRadius = 86,
  showLegend = true,
  centerLabel,
  onSegmentClick,
}: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartConfig = data.reduce(
    (config, item) => ({
      ...config,
      [item.name]: {
        label: item.name,
        color: item.color,
      },
    }),
    {} as ChartConfig,
  );

  const chartData = data.map((item) => ({
    name: item.name,
    value: item.value,
    fill: item.color,
    color: item.color,
    percentage: item.percentage,
    change: item.change,
  }));

  const total = chartData.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const isEmpty = total <= 0;

  const emptyData = [
    {
      name: "No data",
      value: 1,
      fill: CHART_COLORS.emptyState,
      color: CHART_COLORS.emptyState,
      percentage: 0,
      change: undefined,
    },
  ];

  const legendPayload = (isEmpty ? emptyData : chartData).map((entry) => ({
    value: isEmpty ? "No data" : entry.name,
    color: entry.color,
    payload: {
      percentage: isEmpty ? 0 : entry.percentage,
    },
  }));

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[350px]"
      >
        <PieChart>
          {!isEmpty && <Tooltip content={<CustomTooltip />} />}
          <Pie
            data={isEmpty ? emptyData : chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            strokeWidth={0}
            paddingAngle={0}
          >
            {(isEmpty ? emptyData : chartData).map((entry, index) => {
              const opacity =
                hoveredIndex === null ? 1 : hoveredIndex === index ? 1 : 0.5;
              const isClickable = !isEmpty && onSegmentClick;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  opacity={opacity}
                  className={isClickable ? "cursor-pointer" : ""}
                  style={{
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    if (isClickable) {
                      onSegmentClick(data[index], index);
                    }
                  }}
                />
              );
            })}
            {(centerLabel || isEmpty) && (
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const centerValue = centerLabel ? centerLabel.value : 0;
                    const centerText = centerLabel
                      ? centerLabel.label
                      : "No data";
                    const formattedValue =
                      typeof centerValue === "number"
                        ? centerValue.toLocaleString()
                        : centerValue;

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 6}
                          className="text-text-neutral-secondary text-2xl font-bold"
                          style={{
                            fill: "currentColor",
                          }}
                        >
                          {formattedValue}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="text-text-neutral-secondary text-sm text-nowrap"
                          style={{
                            fill: "currentColor",
                          }}
                        >
                          {centerText}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            )}
          </Pie>
        </PieChart>
      </ChartContainer>
      {showLegend && <CustomLegend payload={legendPayload} />}
    </>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: horizontal-bar-chart.tsx]---
Location: prowler-master/ui/components/graphs/horizontal-bar-chart.tsx
Signals: React

```typescript
"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { SEVERITY_ORDER } from "./shared/constants";
import { getSeverityColorByName } from "./shared/utils";
import { BarDataPoint } from "./types";

interface HorizontalBarChartProps {
  data: BarDataPoint[];
  height?: number;
  title?: string;
  onBarClick?: (dataPoint: BarDataPoint, index: number) => void;
}

export function HorizontalBarChart({
  data,
  title,
  onBarClick,
}: HorizontalBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const isEmpty = total <= 0;

  const emptyData: BarDataPoint[] = [
    { name: "Critical", value: 1, percentage: 100 },
    { name: "High", value: 1, percentage: 100 },
    { name: "Medium", value: 1, percentage: 100 },
    { name: "Low", value: 1, percentage: 100 },
    { name: "Informational", value: 1, percentage: 100 },
  ];

  const sortedData = (isEmpty ? emptyData : [...data]).sort((a, b) => {
    const orderA = SEVERITY_ORDER[a.name as keyof typeof SEVERITY_ORDER] ?? 999;
    const orderB = SEVERITY_ORDER[b.name as keyof typeof SEVERITY_ORDER] ?? 999;
    return orderA - orderB;
  });

  return (
    <div className="w-full space-y-6">
      {title && (
        <div>
          <h3 className="text-text-neutral-primary text-lg font-semibold">
            {title}
          </h3>
        </div>
      )}

      <div className="space-y-6">
        {sortedData.map((item, index) => {
          const isHovered = !isEmpty && hoveredIndex === index;
          const isFaded = !isEmpty && hoveredIndex !== null && !isHovered;
          const barColor = isEmpty
            ? "var(--bg-neutral-tertiary)"
            : item.color ||
              getSeverityColorByName(item.name) ||
              "var(--bg-neutral-tertiary)";

          const isClickable = !isEmpty && onBarClick;
          const maxValue =
            data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;
          const calculatedWidth = isEmpty
            ? item.percentage
            : (item.percentage ??
              (maxValue > 0 ? (item.value / maxValue) * 100 : 0));
          // Calculate display percentage (value / total * 100)
          const displayPercentage = isEmpty
            ? 0
            : (item.percentage ??
              (total > 0 ? Math.round((item.value / total) * 100) : 0));
          return (
            <div
              key={item.name}
              className={cn(
                "flex items-center gap-6",
                isClickable && "cursor-pointer",
              )}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onMouseEnter={() => !isEmpty && setHoveredIndex(index)}
              onMouseLeave={() => !isEmpty && setHoveredIndex(null)}
              onClick={() => {
                if (isClickable) {
                  const originalIndex = data.findIndex(
                    (d) => d.name === item.name,
                  );
                  onBarClick(data[originalIndex], originalIndex);
                }
              }}
              onKeyDown={(e) => {
                if (isClickable && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  const originalIndex = data.findIndex(
                    (d) => d.name === item.name,
                  );
                  onBarClick(data[originalIndex], originalIndex);
                }
              }}
            >
              {/* Label */}
              <div className="w-20 shrink-0">
                <span
                  className="text-text-neutral-secondary block truncate text-sm font-medium"
                  style={{
                    opacity: isFaded ? 0.5 : 1,
                    transition: "opacity 0.2s",
                  }}
                  title={item.name}
                >
                  {item.name === "Informational" ? "Info" : item.name}
                </span>
              </div>

              {/* Bar - flexible */}
              <div className="relative h-[22px] flex-1">
                <div className="bg-bg-neutral-tertiary absolute inset-0 h-[22px] w-full rounded-sm" />
                {(item.value > 0 || isEmpty) && (
                  <div
                    className="relative h-[22px] rounded-sm border border-black/10 transition-all duration-300"
                    style={{
                      width: `${calculatedWidth}%`,
                      backgroundColor: barColor,
                      opacity: isFaded ? 0.5 : 1,
                    }}
                  />
                )}

                {isHovered && (
                  <div className="border-border-neutral-tertiary bg-bg-neutral-tertiary absolute top-10 left-0 z-10 rounded-xl border px-3 py-1.5 shadow-lg">
                    <div className="flex flex-col gap-0.5">
                      {/* Title with color chip */}
                      <div className="flex items-center gap-1">
                        <div
                          className="size-3 shrink-0 rounded"
                          style={{ backgroundColor: barColor }}
                        />
                        <p className="text-text-neutral-primary text-xs leading-5 font-medium">
                          {item.value.toLocaleString()}{" "}
                          {item.name === "Informational" ? "Info" : item.name}{" "}
                          {item.name === "Fail" || item.name === "Pass"
                            ? "Findings"
                            : "Risk"}
                        </p>
                      </div>

                      {/* New Findings row */}
                      {item.newFindings !== undefined && (
                        <div className="flex items-center gap-1">
                          <Bell
                            size={12}
                            className="text-text-neutral-secondary shrink-0"
                          />
                          <p className="text-text-neutral-secondary text-xs leading-5 font-medium">
                            {item.newFindings} New Findings
                          </p>
                        </div>
                      )}

                      {/* Change percentage row */}
                      {item.change !== undefined && (
                        <div className="flex items-start">
                          <p className="text-text-neutral-secondary text-xs leading-5 font-medium">
                            {item.change > 0 ? "+" : ""}
                            {item.change}% Since last scan
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Percentage and Count */}
              <div
                className="text-text-neutral-secondary ml-6 flex min-w-[90px] shrink-0 items-center gap-2 text-sm"
                style={{
                  opacity: isFaded ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <span className="min-w-[26px] text-right font-medium">
                  {displayPercentage}%
                </span>
                <span className="shrink-0 font-medium">•</span>
                <span className="font-bold whitespace-nowrap">
                  {isEmpty ? "0" : item.value.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/graphs/index.ts

```typescript
export { DonutChart } from "./donut-chart";
export { HorizontalBarChart } from "./horizontal-bar-chart";
export { LineChart } from "./line-chart";
export { MapChart, type MapChartData, type MapChartProps } from "./map-chart";
export { RadarChart } from "./radar-chart";
export { RadialChart } from "./radial-chart";
export { SankeyChart } from "./sankey-chart";
export { ScatterPlot } from "./scatter-plot";
export { ChartLegend, type ChartLegendItem } from "./shared/chart-legend";
export { ThreatMap } from "./threat-map";
```

--------------------------------------------------------------------------------

````
