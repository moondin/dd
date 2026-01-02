---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 796
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 796 of 867)

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

---[FILE: sankey-chart.tsx]---
Location: prowler-master/ui/components/graphs/sankey-chart.tsx
Signals: React, Next.js

```typescript
"use client";

import { Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Rectangle, ResponsiveContainer, Sankey, Tooltip } from "recharts";

import { PROVIDER_ICONS } from "@/components/icons/providers-badge";
import { initializeChartColors } from "@/lib/charts/colors";
import { mapProviderFiltersForFindings } from "@/lib/provider-helpers";
import { PROVIDER_DISPLAY_NAMES } from "@/types/providers";
import { SEVERITY_FILTER_MAP } from "@/types/severities";

import { ChartTooltip } from "./shared/chart-tooltip";

// Reverse mapping from display name to provider type for URL filters
const PROVIDER_TYPE_MAP: Record<string, string> = Object.entries(
  PROVIDER_DISPLAY_NAMES,
).reduce(
  (acc, [type, displayName]) => {
    acc[displayName] = type;
    return acc;
  },
  {} as Record<string, string>,
);

interface SankeyNode {
  name: string;
  newFindings?: number;
  change?: number;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface ZeroDataProvider {
  id: string;
  displayName: string;
}

interface SankeyChartProps {
  data: {
    nodes: SankeyNode[];
    links: SankeyLink[];
  };
  zeroDataProviders?: ZeroDataProvider[];
  height?: number;
}

interface LinkTooltipState {
  show: boolean;
  x: number;
  y: number;
  sourceName: string;
  targetName: string;
  value: number;
  color: string;
}

interface NodeTooltipState {
  show: boolean;
  x: number;
  y: number;
  name: string;
  value: number;
  color: string;
  newFindings?: number;
  change?: number;
}

const TOOLTIP_OFFSET_PX = 10;
const MIN_LINK_WIDTH = 4;

interface TooltipPayload {
  payload: {
    source?: { name: string };
    target?: { name: string };
    value?: number;
    name?: string;
  };
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

interface CustomNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: SankeyNode & {
    value: number;
    newFindings?: number;
    change?: number;
  };
  containerWidth: number;
  colors: Record<string, string>;
  onNodeHover?: (data: Omit<NodeTooltipState, "show">) => void;
  onNodeMove?: (position: { x: number; y: number }) => void;
  onNodeLeave?: () => void;
  onNodeClick?: (nodeName: string) => void;
}

interface CustomLinkProps {
  sourceX: number;
  targetX: number;
  sourceY: number;
  targetY: number;
  sourceControlX: number;
  targetControlX: number;
  linkWidth: number;
  index: number;
  payload: {
    source?: { name: string };
    target?: { name: string };
    value?: number;
  };
  hoveredLink: number | null;
  colors: Record<string, string>;
  onLinkHover?: (index: number, data: Omit<LinkTooltipState, "show">) => void;
  onLinkMove?: (position: { x: number; y: number }) => void;
  onLinkLeave?: () => void;
  onLinkClick?: (sourceName: string, targetName: string) => void;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const sourceName = data.source?.name || data.name;
    const targetName = data.target?.name;
    const value = data.value;

    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-title">
          {sourceName}
          {targetName ? ` → ${targetName}` : ""}
        </p>
        {value && <p className="chart-tooltip-subtitle">{value}</p>}
      </div>
    );
  }
  return null;
};

const CustomNode = ({
  x,
  y,
  width,
  height,
  payload,
  containerWidth,
  colors,
  onNodeHover,
  onNodeMove,
  onNodeLeave,
  onNodeClick,
}: CustomNodeProps) => {
  const isOut = x + width + 6 > containerWidth;
  const nodeName = payload.name;
  const color = colors[nodeName] || "var(--color-text-neutral-tertiary)";
  const isHidden = nodeName === "";
  const hasTooltip = !isHidden && payload.newFindings;
  const isClickable = SEVERITY_FILTER_MAP[nodeName] !== undefined;

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!hasTooltip) return;

    const rect = e.currentTarget.closest("svg") as SVGSVGElement;
    if (rect) {
      const bbox = rect.getBoundingClientRect();
      onNodeHover?.({
        x: e.clientX - bbox.left,
        y: e.clientY - bbox.top,
        name: nodeName,
        value: payload.value,
        color,
        newFindings: payload.newFindings,
        change: payload.change,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hasTooltip) return;

    const rect = e.currentTarget.closest("svg") as SVGSVGElement;
    if (rect) {
      const bbox = rect.getBoundingClientRect();
      onNodeMove?.({
        x: e.clientX - bbox.left,
        y: e.clientY - bbox.top,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!hasTooltip) return;
    onNodeLeave?.();
  };

  const handleClick = () => {
    if (isClickable) {
      onNodeClick?.(nodeName);
    }
  };

  const IconComponent = PROVIDER_ICONS[nodeName];
  const hasIcon = IconComponent !== undefined;
  const iconSize = 24;
  const iconGap = 8;

  // Calculate text position accounting for icon
  const textOffsetX = isOut ? x - 6 : x + width + 6;
  const iconOffsetX = isOut
    ? textOffsetX - iconSize - iconGap
    : textOffsetX + iconGap;

  return (
    <g
      style={{ cursor: isClickable || hasTooltip ? "pointer" : "default" }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        fillOpacity={isHidden ? "0" : "1"}
      />
      {!isHidden && (
        <>
          {hasIcon && (
            <foreignObject
              x={isOut ? iconOffsetX : textOffsetX}
              y={y + height / 2 - iconSize / 2 - 2}
              width={iconSize}
              height={iconSize}
            >
              <div className="flex items-center justify-center">
                <IconComponent width={iconSize} height={iconSize} />
              </div>
            </foreignObject>
          )}
          <text
            textAnchor={isOut ? "end" : "start"}
            x={
              hasIcon
                ? isOut
                  ? iconOffsetX - iconGap
                  : textOffsetX + iconSize + iconGap * 2
                : textOffsetX
            }
            y={y + height / 2}
            fontSize="14"
            fill="var(--color-text-neutral-primary)"
          >
            {nodeName}
          </text>
          <text
            textAnchor={isOut ? "end" : "start"}
            x={
              hasIcon
                ? isOut
                  ? iconOffsetX - iconGap
                  : textOffsetX + iconSize + iconGap * 2
                : textOffsetX
            }
            y={y + height / 2 + 13}
            fontSize="12"
            fill="var(--color-text-neutral-secondary)"
          >
            {payload.value}
          </text>
        </>
      )}
    </g>
  );
};

const CustomLink = ({
  sourceX,
  targetX,
  sourceY,
  targetY,
  sourceControlX,
  targetControlX,
  linkWidth,
  index,
  payload,
  hoveredLink,
  colors,
  onLinkHover,
  onLinkMove,
  onLinkLeave,
  onLinkClick,
}: CustomLinkProps) => {
  const sourceName = payload.source?.name || "";
  const targetName = payload.target?.name || "";
  const value = payload.value || 0;
  const color = colors[sourceName] || "var(--color-text-neutral-tertiary)";
  const isHidden = targetName === "";

  const isHovered = hoveredLink !== null && hoveredLink === index;
  const hasHoveredLink = hoveredLink !== null;

  // Ensure minimum link width for better visibility of small values
  const effectiveLinkWidth = Math.max(linkWidth, MIN_LINK_WIDTH);

  const pathD = `
    M${sourceX},${sourceY + effectiveLinkWidth / 2}
    C${sourceControlX},${sourceY + effectiveLinkWidth / 2}
      ${targetControlX},${targetY + effectiveLinkWidth / 2}
      ${targetX},${targetY + effectiveLinkWidth / 2}
    L${targetX},${targetY - effectiveLinkWidth / 2}
    C${targetControlX},${targetY - effectiveLinkWidth / 2}
      ${sourceControlX},${sourceY - effectiveLinkWidth / 2}
      ${sourceX},${sourceY - effectiveLinkWidth / 2}
    Z
  `;

  const getOpacity = () => {
    if (isHidden) return "0";
    if (!hasHoveredLink) return "0.4";
    return isHovered ? "0.8" : "0.1";
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.parentElement?.parentElement
      ?.parentElement as unknown as SVGSVGElement;
    if (rect) {
      const bbox = rect.getBoundingClientRect();
      onLinkHover?.(index, {
        x: e.clientX - bbox.left,
        y: e.clientY - bbox.top,
        sourceName,
        targetName,
        value,
        color,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.parentElement?.parentElement
      ?.parentElement as unknown as SVGSVGElement;
    if (rect && isHovered) {
      const bbox = rect.getBoundingClientRect();
      onLinkMove?.({
        x: e.clientX - bbox.left,
        y: e.clientY - bbox.top,
      });
    }
  };

  const handleMouseLeave = () => {
    onLinkLeave?.();
  };

  const handleClick = () => {
    if (!isHidden && onLinkClick) {
      onLinkClick(sourceName, targetName);
    }
  };

  return (
    <g>
      <path
        d={pathD}
        fill={color}
        fillOpacity={getOpacity()}
        stroke="none"
        style={{ cursor: "pointer", transition: "fill-opacity 0.2s" }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
    </g>
  );
};

export function SankeyChart({
  data,
  zeroDataProviders = [],
  height = 400,
}: SankeyChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [linkTooltip, setLinkTooltip] = useState<LinkTooltipState>({
    show: false,
    x: 0,
    y: 0,
    sourceName: "",
    targetName: "",
    value: 0,
    color: "",
  });

  const [nodeTooltip, setNodeTooltip] = useState<NodeTooltipState>({
    show: false,
    x: 0,
    y: 0,
    name: "",
    value: 0,
    color: "",
  });

  // Initialize colors from CSS variables on mount
  useEffect(() => {
    setColors(initializeChartColors());
  }, []);

  const handleLinkHover = (
    index: number,
    data: Omit<LinkTooltipState, "show">,
  ) => {
    setHoveredLink(index);
    setLinkTooltip({ show: true, ...data });
  };

  const handleLinkMove = (position: { x: number; y: number }) => {
    setLinkTooltip((prev) => ({
      ...prev,
      x: position.x,
      y: position.y,
    }));
  };

  const handleLinkLeave = () => {
    setHoveredLink(null);
    setLinkTooltip((prev) => ({ ...prev, show: false }));
  };

  const handleNodeHover = (data: Omit<NodeTooltipState, "show">) => {
    setNodeTooltip({ show: true, ...data });
  };

  const handleNodeMove = (position: { x: number; y: number }) => {
    setNodeTooltip((prev) => ({
      ...prev,
      x: position.x,
      y: position.y,
    }));
  };

  const handleNodeLeave = () => {
    setNodeTooltip((prev) => ({ ...prev, show: false }));
  };

  const handleNodeClick = (nodeName: string) => {
    const severityFilter = SEVERITY_FILTER_MAP[nodeName];
    if (severityFilter) {
      const params = new URLSearchParams(searchParams.toString());

      mapProviderFiltersForFindings(params);

      params.set("filter[severity__in]", severityFilter);
      params.set("filter[status__in]", "FAIL");
      params.set("filter[muted]", "false");
      router.push(`/findings?${params.toString()}`);
    }
  };

  const handleLinkClick = (sourceName: string, targetName: string) => {
    const providerType = PROVIDER_TYPE_MAP[sourceName];
    const severityFilter = SEVERITY_FILTER_MAP[targetName];

    if (severityFilter) {
      const params = new URLSearchParams(searchParams.toString());

      mapProviderFiltersForFindings(params);

      // Always set provider_type filter based on the clicked link's source (provider)
      // This ensures clicking "AWS → High" filters by AWS even when no global filter is set
      const hasProviderIdFilter = searchParams.has("filter[provider_id__in]");
      if (providerType && !hasProviderIdFilter) {
        params.set("filter[provider_type__in]", providerType);
      }

      params.set("filter[severity__in]", severityFilter);
      params.set("filter[status__in]", "FAIL");
      params.set("filter[muted]", "false");
      router.push(`/findings?${params.toString()}`);
    }
  };

  // Create callback references that wrap custom props and Recharts-injected props
  const wrappedCustomNode = (
    props: Omit<
      CustomNodeProps,
      "colors" | "onNodeHover" | "onNodeMove" | "onNodeLeave" | "onNodeClick"
    >,
  ) => (
    <CustomNode
      {...props}
      colors={colors}
      onNodeHover={handleNodeHover}
      onNodeMove={handleNodeMove}
      onNodeLeave={handleNodeLeave}
      onNodeClick={handleNodeClick}
    />
  );

  const wrappedCustomLink = (
    props: Omit<
      CustomLinkProps,
      | "colors"
      | "hoveredLink"
      | "onLinkHover"
      | "onLinkMove"
      | "onLinkLeave"
      | "onLinkClick"
    >,
  ) => (
    <CustomLink
      {...props}
      colors={colors}
      hoveredLink={hoveredLink}
      onLinkHover={handleLinkHover}
      onLinkMove={handleLinkMove}
      onLinkLeave={handleLinkLeave}
      onLinkClick={handleLinkClick}
    />
  );

  // Check if there's actual data to display (links with values > 0)
  const hasData = data.links.some((link) => link.value > 0);

  if (!hasData) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Info size={48} className="text-text-neutral-tertiary" />
          <p className="text-text-neutral-secondary text-sm">
            No failed findings to display
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <Sankey
          data={data}
          node={wrappedCustomNode}
          link={wrappedCustomLink}
          nodePadding={50}
          margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
          sort={false}
        >
          <Tooltip content={<CustomTooltip />} />
        </Sankey>
      </ResponsiveContainer>
      {linkTooltip.show && (
        <div
          className="pointer-events-none absolute z-50"
          style={{
            left: `${Math.max(TOOLTIP_OFFSET_PX, linkTooltip.x)}px`,
            top: `${Math.max(TOOLTIP_OFFSET_PX, linkTooltip.y)}px`,
            transform: `translate(${TOOLTIP_OFFSET_PX}px, -100%)`,
          }}
        >
          <ChartTooltip
            active={true}
            payload={[
              {
                payload: {
                  name: linkTooltip.targetName,
                  value: linkTooltip.value,
                  color: linkTooltip.color,
                },
                color: linkTooltip.color,
              },
            ]}
            label={`${linkTooltip.sourceName} → ${linkTooltip.targetName}`}
          />
        </div>
      )}
      {nodeTooltip.show && (
        <div
          className="pointer-events-none absolute z-50"
          style={{
            left: `${Math.max(TOOLTIP_OFFSET_PX, nodeTooltip.x)}px`,
            top: `${Math.max(TOOLTIP_OFFSET_PX, nodeTooltip.y)}px`,
            transform: `translate(${TOOLTIP_OFFSET_PX}px, -100%)`,
          }}
        >
          <ChartTooltip
            active={true}
            payload={[
              {
                payload: {
                  name: nodeTooltip.name,
                  value: nodeTooltip.value,
                  color: nodeTooltip.color,
                  newFindings: nodeTooltip.newFindings,
                  change: nodeTooltip.change,
                },
                color: nodeTooltip.color,
              },
            ]}
          />
        </div>
      )}
      {zeroDataProviders.length > 0 && (
        <div className="border-divider-primary mt-4 border-t pt-4">
          <p className="text-text-neutral-tertiary mb-3 text-xs font-medium tracking-wide uppercase">
            Providers with no failed findings
          </p>
          <div className="flex flex-wrap gap-4">
            {zeroDataProviders.map((provider) => {
              const IconComponent = PROVIDER_ICONS[provider.displayName];
              return (
                <div
                  key={provider.id}
                  className="flex items-center gap-2 text-sm"
                >
                  {IconComponent && <IconComponent width={20} height={20} />}
                  <span className="text-text-neutral-secondary">
                    {provider.displayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: scatter-plot.tsx]---
Location: prowler-master/ui/components/graphs/scatter-plot.tsx

```typescript
"use client";

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AlertPill } from "./shared/alert-pill";
import { ChartLegend } from "./shared/chart-legend";
import { getSeverityColorByRiskScore } from "./shared/utils";
import type { ScatterDataPoint } from "./types";

interface ScatterPlotProps {
  data: ScatterDataPoint[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
  onSelectPoint?: (point: ScatterDataPoint | null) => void;
  selectedPoint?: ScatterDataPoint | null;
}

const PROVIDER_COLORS = {
  AWS: "var(--color-bg-data-aws)",
  Azure: "var(--color-bg-data-azure)",
  Google: "var(--color-bg-data-gcp)",
  Default: "var(--color-text-neutral-tertiary)",
};

interface ScatterTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ScatterDataPoint }>;
}

const CustomTooltip = ({ active, payload }: ScatterTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const severityColor = getSeverityColorByRiskScore(data.x);

    return (
      <div
        className="rounded-lg border p-3 shadow-lg"
        style={{
          borderColor: "var(--color-border-neutral-tertiary)",
          backgroundColor: "var(--color-bg-neutral-secondary)",
        }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--color-text-neutral-primary)" }}
        >
          {data.name}
        </p>
        <p
          className="mt-1 text-xs"
          style={{ color: "var(--color-text-neutral-secondary)" }}
        >
          <span style={{ color: severityColor }}>{data.x}</span> Risk Score
        </p>
        <div className="mt-2">
          <AlertPill value={data.y} />
        </div>
      </div>
    );
  }
  return null;
};

interface ScatterDotProps {
  cx: number;
  cy: number;
  payload: ScatterDataPoint;
  selectedPoint?: ScatterDataPoint | null;
  onSelectPoint?: (point: ScatterDataPoint) => void;
}

const CustomScatterDot = ({
  cx,
  cy,
  payload,
  selectedPoint,
  onSelectPoint,
}: ScatterDotProps) => {
  const isSelected = selectedPoint?.name === payload.name;
  const size = isSelected ? 18 : 8;
  const fill = isSelected
    ? "#86DA26"
    : PROVIDER_COLORS[payload.provider as keyof typeof PROVIDER_COLORS] ||
      "var(--color-text-neutral-tertiary)";

  return (
    <circle
      cx={cx}
      cy={cy}
      r={size / 2}
      fill={fill}
      stroke={isSelected ? "#86DA26" : "transparent"}
      strokeWidth={2}
      className={isSelected ? "drop-shadow-[0_0_8px_#86da26]" : ""}
      style={{ cursor: "pointer" }}
      onClick={() => onSelectPoint?.(payload)}
    />
  );
};

interface LegendPayloadItem {
  value: string;
  color: string;
}

interface LegendProps {
  payload?: LegendPayloadItem[];
}

const CustomLegend = ({ payload }: LegendProps) => {
  const items = (payload || []).map((entry) => ({
    label: entry.value,
    color: entry.color,
  }));

  return <ChartLegend items={items} />;
};

export function ScatterPlot({
  data,
  xLabel = "Risk Score",
  yLabel = "Failed Findings",
  height = 400,
  onSelectPoint,
  selectedPoint,
}: ScatterPlotProps) {
  const handlePointClick = (point: ScatterDataPoint) => {
    if (onSelectPoint) {
      if (selectedPoint?.name === point.name) {
        onSelectPoint(null);
      } else {
        onSelectPoint(point);
      }
    }
  };

  const dataByProvider = data.reduce(
    (acc, point) => {
      const provider = point.provider;
      if (!acc[provider]) {
        acc[provider] = [];
      }
      acc[provider].push(point);
      return acc;
    },
    {} as Record<string, ScatterDataPoint[]>,
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border-neutral-tertiary)"
        />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          label={{
            value: xLabel,
            position: "bottom",
            offset: 10,
            fill: "var(--color-text-neutral-secondary)",
          }}
          tick={{ fill: "var(--color-text-neutral-secondary)" }}
          domain={[0, 10]}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          label={{
            value: yLabel,
            angle: -90,
            position: "left",
            offset: 10,
            fill: "var(--color-text-neutral-secondary)",
          }}
          tick={{ fill: "var(--color-text-neutral-secondary)" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        {Object.entries(dataByProvider).map(([provider, points]) => (
          <Scatter
            key={provider}
            name={provider}
            data={points}
            fill={
              PROVIDER_COLORS[provider as keyof typeof PROVIDER_COLORS] ||
              PROVIDER_COLORS.Default
            }
            shape={(props: unknown) => {
              const dotProps = props as ScatterDotProps;
              return (
                <CustomScatterDot
                  {...dotProps}
                  selectedPoint={selectedPoint}
                  onSelectPoint={handlePointClick}
                />
              );
            }}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: threat-map.tsx]---
Location: prowler-master/ui/components/graphs/threat-map.tsx
Signals: React, Next.js

```typescript
"use client";

import { geoPath } from "d3";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import { AlertTriangle, ChevronDown, Info, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Card } from "@/components/shadcn/card/card";
import { mapProviderFiltersForFindings } from "@/lib/provider-helpers";

import { HorizontalBarChart } from "./horizontal-bar-chart";
import {
  DEFAULT_MAP_COLORS,
  LocationPoint,
  MAP_CONFIG,
  MapColorsConfig,
  STATUS_FILTER_MAP,
  ThreatMapProps,
} from "./threat-map.types";
import {
  createProjection,
  createSVGElement,
  fetchWorldData,
  getMapColors,
} from "./threat-map.utils";
import { BarDataPoint } from "./types";

// Sub-components
function MapTooltip({
  location,
  position,
}: {
  location: LocationPoint;
  position: { x: number; y: number };
}) {
  return (
    <div
      className="border-border-neutral-tertiary bg-bg-neutral-tertiary pointer-events-none absolute z-50 min-w-[200px] rounded-xl border p-3 shadow-lg"
      style={{
        left: `${position.x + 15}px`,
        top: `${position.y + 15}px`,
        transform: "translate(0, -50%)",
      }}
    >
      <div className="flex items-center gap-2">
        <MapPin size={14} className="text-text-neutral-secondary" />
        <span className="text-text-neutral-primary text-sm font-semibold">
          {location.name}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <AlertTriangle size={14} className="text-bg-data-critical" />
        <span className="text-text-neutral-secondary text-sm font-medium">
          {location.failFindings.toLocaleString()} Fail Findings
        </span>
      </div>
      {location.change !== undefined && (
        <p className="text-text-neutral-secondary mt-1 text-sm font-medium">
          <span
            className={`font-bold ${location.change > 0 ? "text-pass-primary" : "text-fail-primary"}`}
          >
            {location.change > 0 ? "+" : ""}
            {location.change}%{" "}
          </span>
          since last scan
        </p>
      )}
    </div>
  );
}

function LocationDetails({
  location,
  onBarClick,
}: {
  location: Pick<LocationPoint, "name" | "totalFindings" | "severityData">;
  onBarClick: (dataPoint: BarDataPoint) => void;
}) {
  return (
    <div className="flex w-full flex-col">
      <div className="mb-4">
        <div className="mb-1 flex items-center">
          <MapPin size={21} className="text-text-error" />
          <div
            aria-hidden="true"
            className="bg-pass-primary h-2 w-2 rounded-full"
          />
          <h4 className="text-neutral-primary text-base font-semibold">
            {location.name}
          </h4>
        </div>
        <p className="text-neutral-tertiary text-xs">
          {location.totalFindings.toLocaleString()} Total Findings
        </p>
      </div>
      <HorizontalBarChart
        data={location.severityData}
        onBarClick={onBarClick}
      />
    </div>
  );
}

export function ThreatMap({
  data,
  height = MAP_CONFIG.defaultHeight,
}: ThreatMapProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedLocation, setSelectedLocation] =
    useState<LocationPoint | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<LocationPoint | null>(
    null,
  );
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [worldData, setWorldData] = useState<FeatureCollection | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: MAP_CONFIG.defaultWidth,
    height,
  });
  const [mapColors, setMapColors] =
    useState<MapColorsConfig>(DEFAULT_MAP_COLORS);

  const isGlobalSelected = selectedRegion.toLowerCase() === "global";
  const isAllRegions = selectedRegion === "All Regions";

  // For display count only (not used in useEffect to avoid infinite loop)
  const locationCount = data.locations.filter((loc) => {
    if (loc.region.toLowerCase() === "global") return false;
    if (isAllRegions) return true;
    if (isGlobalSelected) return false;
    return loc.region === selectedRegion;
  }).length;

  const sortedRegions = [...data.regions].sort((a, b) => {
    if (a.toLowerCase() === "global") return -1;
    if (b.toLowerCase() === "global") return 1;
    return a.localeCompare(b);
  });

  // Compute global aggregated data
  const globalLocations = data.locations.filter(
    (loc) => loc.region.toLowerCase() === "global",
  );

  const globalAggregatedData =
    globalLocations.length > 0
      ? (() => {
          const aggregate = (name: string) =>
            globalLocations.reduce(
              (sum, loc) =>
                sum +
                (loc.severityData.find((d) => d.name === name)?.value || 0),
              0,
            );
          const failValue = aggregate("Fail");
          const passValue = aggregate("Pass");
          const total = failValue + passValue;
          return {
            name: "Global Regions",
            regionCode: "global",
            providerType: "global",
            totalFindings: total,
            failFindings: failValue,
            severityData: [
              {
                name: "Fail",
                value: failValue,
                percentage:
                  total > 0 ? Math.round((failValue / total) * 100) : 0,
                color: "var(--color-bg-fail)",
              },
              {
                name: "Pass",
                value: passValue,
                percentage:
                  total > 0 ? Math.round((passValue / total) * 100) : 0,
                color: "var(--color-bg-pass)",
              },
            ],
          };
        })()
      : null;

  // Reset selected location when region changes
  useEffect(() => {
    setSelectedLocation(null);
  }, [selectedRegion]);

  // Theme colors
  useEffect(() => {
    setMapColors(getMapColors());
    const observer = new MutationObserver(() => setMapColors(getMapColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Fetch world data
  useEffect(() => {
    let mounted = true;
    fetchWorldData()
      .then((d) => mounted && d && setWorldData(d))
      .finally(() => mounted && setIsLoadingMap(false));
    return () => {
      mounted = false;
    };
  }, []);

  // Resize handler
  useEffect(() => {
    const update = () =>
      containerRef.current &&
      setDimensions({ width: containerRef.current.clientWidth, height });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [height]);

  // Render map
  useEffect(() => {
    if (!svgRef.current || !worldData || isLoadingMap) return;

    const svg = svgRef.current;
    svg.innerHTML = "";

    // Compute filtered locations inside useEffect to avoid infinite loop
    const isGlobal = selectedRegion.toLowerCase() === "global";
    const isAll = selectedRegion === "All Regions";
    const locationsToRender = data.locations.filter((loc) => {
      if (loc.region.toLowerCase() === "global") return false;
      if (isAll) return true;
      if (isGlobal) return false;
      return loc.region === selectedRegion;
    });

    const projection = createProjection(dimensions.width, dimensions.height);
    const path = geoPath().projection(projection);

    // Countries
    const mapGroup = createSVGElement<SVGGElement>("g", {
      class: "map-countries",
    });
    const fillColor = isGlobal ? mapColors.pointDefault : mapColors.landFill;

    worldData.features?.forEach(
      (feat: Feature<Geometry, GeoJsonProperties>) => {
        const pathData = path(feat);
        if (pathData) {
          const el = createSVGElement<SVGPathElement>("path", {
            d: pathData,
            fill: fillColor,
            stroke: mapColors.landStroke,
            "stroke-width": "0.5",
          });
          mapGroup.appendChild(el);
        }
      },
    );
    svg.appendChild(mapGroup);

    // Helper to create glow rings
    const createGlowRing = (
      cx: string,
      cy: string,
      r: number,
      color: string,
      opacity: string,
    ) =>
      createSVGElement<SVGCircleElement>("circle", {
        cx,
        cy,
        r: r.toString(),
        fill: "none",
        stroke: color,
        "stroke-width": "1",
        opacity,
      });

    // Points
    const pointsGroup = createSVGElement<SVGGElement>("g", {
      class: "threat-points",
    });

    const createPoint = (loc: LocationPoint) => {
      const proj = projection(loc.coordinates);
      if (
        !proj ||
        proj[0] < 0 ||
        proj[0] > dimensions.width ||
        proj[1] < 0 ||
        proj[1] > dimensions.height
      ) {
        return null;
      }

      const [x, y] = proj;
      const isSelected = selectedLocation?.id === loc.id;
      const radius = isSelected
        ? MAP_CONFIG.selectedPointRadius
        : MAP_CONFIG.pointRadius;
      const color = isSelected
        ? mapColors.pointSelected
        : mapColors.pointDefault;

      const group = createSVGElement<SVGGElement>("g", {
        class: "cursor-pointer",
      });
      group.appendChild(
        createGlowRing(x.toString(), y.toString(), radius + 4, color, "0.4"),
      );
      group.appendChild(
        createGlowRing(x.toString(), y.toString(), radius + 8, color, "0.2"),
      );

      const circle = createSVGElement<SVGCircleElement>("circle", {
        cx: x.toString(),
        cy: y.toString(),
        r: radius.toString(),
        fill: color,
      });
      group.appendChild(circle);

      group.addEventListener("click", () =>
        setSelectedLocation(isSelected ? null : loc),
      );
      group.addEventListener("mouseenter", (e) => {
        setHoveredLocation(loc);
        const rect = svg.getBoundingClientRect();
        setTooltipPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      });
      group.addEventListener("mousemove", (e) => {
        const rect = svg.getBoundingClientRect();
        setTooltipPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      });
      group.addEventListener("mouseleave", () => {
        setHoveredLocation(null);
        setTooltipPosition(null);
      });

      return group;
    };

    locationsToRender.forEach((loc) => {
      if (selectedLocation?.id !== loc.id) {
        const point = createPoint(loc);
        if (point) pointsGroup.appendChild(point);
      }
    });

    if (selectedLocation) {
      const loc = locationsToRender.find((l) => l.id === selectedLocation.id);
      if (loc) {
        const point = createPoint(loc);
        if (point) pointsGroup.appendChild(point);
      }
    }

    svg.appendChild(pointsGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dimensions,
    data.locations,
    selectedRegion,
    selectedLocation,
    worldData,
    isLoadingMap,
    mapColors,
  ]);

  const navigateToFindings = (
    status: string,
    regionCode: string,
    providerType?: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    mapProviderFiltersForFindings(params);
    if (providerType) params.set("filter[provider_type__in]", providerType);
    params.set("filter[region__in]", regionCode);
    params.set("filter[status__in]", status);
    params.set("filter[muted]", "false");
    router.push(`/findings?${params.toString()}`);
  };

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex flex-1 gap-12 overflow-hidden">
        <div className="flex basis-[70%] flex-col overflow-hidden">
          <Card
            ref={containerRef}
            variant="base"
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-text-neutral-primary text-lg font-semibold">
                Threat Map
              </h3>
              <div className="relative">
                <select
                  aria-label="Filter threat map by region"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="border-border-neutral-primary bg-bg-neutral-secondary text-text-neutral-primary appearance-none rounded-lg border px-4 py-2 pr-10 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <option value="All Regions">All Regions</option>
                  {sortedRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="text-text-neutral-tertiary pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
                />
              </div>
            </div>

            <div className="relative w-full flex-1">
              {isLoadingMap ? (
                <div
                  className="flex items-center justify-center"
                  style={{ height: dimensions.height }}
                >
                  <div className="text-text-neutral-tertiary mb-2">
                    Loading map...
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <svg
                    ref={svgRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    className="h-full w-full"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                    preserveAspectRatio="xMidYMid meet"
                  />
                  {hoveredLocation && tooltipPosition && (
                    <MapTooltip
                      location={hoveredLocation}
                      position={tooltipPosition}
                    />
                  )}
                  <div className="border-border-neutral-primary bg-bg-neutral-secondary absolute bottom-4 left-4 flex items-center gap-2 rounded-full border px-3 py-1.5">
                    <div
                      aria-hidden="true"
                      className="bg-data-critical h-3 w-3 rounded"
                    />
                    <span className="text-text-neutral-primary text-sm font-medium">
                      {locationCount} Locations
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="flex basis-[30%] items-center overflow-hidden">
          {selectedLocation ? (
            <LocationDetails
              location={selectedLocation}
              onBarClick={(dp) => {
                const status = STATUS_FILTER_MAP[dp.name];
                if (status && selectedLocation.providerType) {
                  navigateToFindings(
                    status,
                    selectedLocation.regionCode,
                    selectedLocation.providerType,
                  );
                }
              }}
            />
          ) : isGlobalSelected && globalAggregatedData ? (
            <LocationDetails
              location={globalAggregatedData}
              onBarClick={(dp) => {
                const status = STATUS_FILTER_MAP[dp.name];
                if (status) {
                  navigateToFindings(status, "global");
                }
              }}
            />
          ) : (
            <div className="flex h-full min-h-[400px] w-full items-center justify-center">
              <div className="text-center">
                <Info
                  size={48}
                  className="text-text-neutral-secondary mx-auto mb-2"
                />
                <p className="text-text-neutral-tertiary text-sm">
                  Select a location on the map to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

````
