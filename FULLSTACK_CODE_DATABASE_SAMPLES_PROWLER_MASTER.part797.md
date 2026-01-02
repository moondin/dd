---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 797
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 797 of 867)

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

---[FILE: threat-map.types.ts]---
Location: prowler-master/ui/components/graphs/threat-map.types.ts

```typescript
import { BarDataPoint } from "./types";

export const MAP_CONFIG = {
  defaultWidth: 688,
  defaultHeight: 400,
  pointRadius: 6,
  selectedPointRadius: 8,
  transitionDuration: 300,
} as const;

export const RISK_LEVELS = {
  LOW_HIGH: "low-high",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export type RiskLevel = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS];

export interface LocationPoint {
  id: string;
  name: string;
  region: string;
  regionCode: string;
  providerType: string;
  coordinates: [number, number];
  totalFindings: number;
  failFindings: number;
  riskLevel: RiskLevel;
  severityData: BarDataPoint[];
  change?: number;
}

export interface ThreatMapData {
  locations: LocationPoint[];
  regions: string[];
}

export interface ThreatMapProps {
  data: ThreatMapData;
  height?: number;
  onLocationSelect?: (location: LocationPoint | null) => void;
}

export interface MapColorsConfig {
  landFill: string;
  landStroke: string;
  pointDefault: string;
  pointSelected: string;
  pointHover: string;
}

// SVG fill/stroke attributes require actual color values, not Tailwind classes
// These hex fallbacks are used during SSR when CSS variables aren't available
// At runtime, getMapColors() retrieves computed CSS variable values
export const DEFAULT_MAP_COLORS: MapColorsConfig = {
  landFill: "#d1d5db", // --bg-neutral-map fallback
  landStroke: "#cbd5e1", // --border-neutral-tertiary fallback
  pointDefault: "#dc2626", // --text-text-error fallback
  pointSelected: "#10b981", // --bg-button-primary fallback
  pointHover: "#dc2626", // --text-text-error fallback
};

export const STATUS_FILTER_MAP: Record<string, string> = {
  Fail: "FAIL",
  Pass: "PASS",
};
```

--------------------------------------------------------------------------------

---[FILE: threat-map.utils.ts]---
Location: prowler-master/ui/components/graphs/threat-map.utils.ts

```typescript
import { geoNaturalEarth1 } from "d3";
import type { FeatureCollection } from "geojson";
import { feature } from "topojson-client";
import type {
  GeometryCollection,
  Objects,
  Topology,
} from "topojson-specification";

import { DEFAULT_MAP_COLORS, MapColorsConfig } from "./threat-map.types";

export function createProjection(width: number, height: number) {
  return geoNaturalEarth1()
    .fitExtent(
      [
        [1, 1],
        [width - 1, height - 1],
      ],
      { type: "Sphere" },
    )
    .precision(0.2);
}

export async function fetchWorldData(): Promise<FeatureCollection | null> {
  try {
    const worldAtlasModule = await import("world-atlas/countries-110m.json");
    const worldData = worldAtlasModule.default || worldAtlasModule;
    const topology = worldData as unknown as Topology<Objects>;
    return feature(
      topology,
      topology.objects.countries as GeometryCollection,
    ) as FeatureCollection;
  } catch (error) {
    console.error("Error loading world map data:", error);
    return null;
  }
}

export function createSVGElement<T extends SVGElement>(
  type: string,
  attributes: Record<string, string>,
): T {
  const element = document.createElementNS(
    "http://www.w3.org/2000/svg",
    type,
  ) as T;
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

export function getMapColors(): MapColorsConfig {
  if (typeof document === "undefined") return DEFAULT_MAP_COLORS;

  const root = document.documentElement;
  const style = getComputedStyle(root);
  const getVar = (varName: string): string => {
    const value = style.getPropertyValue(varName).trim();
    return value && value.length > 0 ? value : "";
  };

  return {
    landFill: getVar("--bg-neutral-map") || DEFAULT_MAP_COLORS.landFill,
    landStroke:
      getVar("--border-neutral-tertiary") || DEFAULT_MAP_COLORS.landStroke,
    pointDefault:
      getVar("--text-text-error") || DEFAULT_MAP_COLORS.pointDefault,
    pointSelected:
      getVar("--bg-button-primary") || DEFAULT_MAP_COLORS.pointSelected,
    pointHover: getVar("--text-text-error") || DEFAULT_MAP_COLORS.pointHover,
  };
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: prowler-master/ui/components/graphs/types.ts

```typescript
import { LAYOUT_OPTIONS, SORT_OPTIONS } from "./shared/constants";

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

export type LayoutOption = (typeof LAYOUT_OPTIONS)[keyof typeof LAYOUT_OPTIONS];

export interface BaseDataPoint {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
  change?: number;
  newFindings?: number;
}

export interface BarDataPoint extends BaseDataPoint {}

export interface DonutDataPoint {
  name: string;
  value: number;
  color: string;
  percentage?: number;
  new?: number;
  muted?: number;
  change?: number;
}

export interface LineDataPoint {
  date: string;
  [key: string]: string | number | string[];
}

export interface RadarDataPoint {
  category: string;
  categoryId: string;
  value: number;
  change?: number;
  severityData?: BarDataPoint[];
}

export interface ScatterDataPoint {
  x: number;
  y: number;
  provider: string;
  name: string;
  size?: number;
}

export interface LineConfig {
  dataKey: string;
  color: string;
  label: string;
}

export interface TooltipData {
  name: string;
  value: number | string;
  color?: string;
  percentage?: number;
  newFindings?: number;
  new?: number;
  muted?: number;
  change?: number;
  [key: string]: string | number | boolean | string[] | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: useSortableData.ts]---
Location: prowler-master/ui/components/graphs/hooks/useSortableData.ts
Signals: React

```typescript
import { useState } from "react";

import { DEFAULT_SORT_OPTION, SORT_OPTIONS } from "../shared/constants";

type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

interface SortableItem {
  name: string;
  value: number;
}

export function useSortableData<T extends SortableItem>(data: T[]) {
  const [sortBy, setSortBy] = useState<SortOption>(DEFAULT_SORT_OPTION);

  const sortedData = [...data].sort((a, b) => {
    switch (sortBy) {
      case SORT_OPTIONS.highLow:
        return b.value - a.value;
      case SORT_OPTIONS.lowHigh:
        return a.value - b.value;
      case SORT_OPTIONS.alphabetical:
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return {
    sortBy,
    setSortBy,
    sortedData,
  };
}
```

--------------------------------------------------------------------------------

---[FILE: alert-pill.tsx]---
Location: prowler-master/ui/components/graphs/shared/alert-pill.tsx

```typescript
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib";

interface AlertPillProps {
  value: number;
  label?: string;
  iconSize?: number;
  textSize?: "xs" | "sm" | "base";
}

const TEXT_SIZE_CLASSES = {
  sm: "text-sm",
  base: "text-base",
  xs: "text-xs",
} as const;

export function AlertPill({
  value,
  label = "Fail Findings",
  iconSize = 12,
  textSize = "xs",
}: AlertPillProps) {
  const textSizeClass = TEXT_SIZE_CLASSES[textSize];

  // Chart alert colors are theme-aware variables from globals.css
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1 rounded-full px-2 py-1"
        style={{ backgroundColor: "var(--color-bg-fail-secondary)" }}
      >
        <AlertTriangle
          size={iconSize}
          style={{ color: "var(--color-text-error-primary)" }}
        />
        <span
          className={cn(textSizeClass, "font-semibold")}
          style={{ color: "var(--color-text-error-primary)" }}
        >
          {value}
        </span>
      </div>
      <span className="text-text-neutral-secondary text-sm font-medium">
        {label}
      </span>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: chart-legend.tsx]---
Location: prowler-master/ui/components/graphs/shared/chart-legend.tsx

```typescript
export interface ChartLegendItem {
  label: string;
  color: string;
  dataKey?: string;
}

interface ChartLegendProps {
  items: ChartLegendItem[];
  selectedItem?: string | null;
  onItemClick?: (dataKey: string) => void;
}

export function ChartLegend({
  items,
  selectedItem,
  onItemClick,
}: ChartLegendProps) {
  const isInteractive = !!onItemClick;

  return (
    <div className="border-border-neutral-tertiary bg-bg-neutral-tertiary inline-flex items-center gap-2 rounded-full border">
      {items.map((item, index) => {
        const dataKey = item.dataKey ?? item.label.toLowerCase();
        const isSelected = selectedItem === dataKey;
        const isFaded = selectedItem !== null && !isSelected;

        return (
          <button
            key={`legend-${index}`}
            type="button"
            className={`flex items-center gap-2 px-4 py-3 transition-opacity duration-200 ${
              isInteractive
                ? "cursor-pointer hover:opacity-80"
                : "cursor-default"
            } ${isFaded ? "opacity-30" : "opacity-100"}`}
            onClick={() => onItemClick?.(dataKey)}
            disabled={!isInteractive}
          >
            <div
              className={`h-3 w-3 rounded ${isSelected ? "ring-2 ring-offset-1" : ""}`}
              style={{
                backgroundColor: item.color,
                // @ts-expect-error ring-color is a valid Tailwind CSS variable
                "--tw-ring-color": item.color,
              }}
            />
            <span className="text-text-neutral-secondary text-sm font-medium">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: chart-tooltip.tsx]---
Location: prowler-master/ui/components/graphs/shared/chart-tooltip.tsx

```typescript
import { Bell, VolumeX } from "lucide-react";

import { cn } from "@/lib/utils";

import { TooltipData } from "../types";

interface MultiSeriesPayloadEntry {
  color?: string;
  name?: string;
  value?: string | number;
  dataKey?: string;
  payload?: Record<string, string | number | undefined>;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: MultiSeriesPayloadEntry[];
  label?: string;
  showColorIndicator?: boolean;
  colorIndicatorShape?: "circle" | "square";
}

export function ChartTooltip({
  active,
  payload,
  label,
  showColorIndicator = true,
  colorIndicatorShape = "square",
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data: TooltipData = (payload[0].payload || payload[0]) as TooltipData;
  const color = payload[0].color || data.color;

  return (
    <div className="border-border-neutral-tertiary bg-bg-neutral-tertiary pointer-events-none min-w-[200px] rounded-xl border p-3 shadow-lg">
      <div className="flex items-center gap-2">
        {showColorIndicator && color && (
          <div
            className={cn(
              "h-3 w-3",
              colorIndicatorShape === "circle" ? "rounded-full" : "rounded-sm",
            )}
            style={{ backgroundColor: color }}
          />
        )}
        <p className="text-text-neutral-primary text-sm font-semibold">
          {label || data.name}
        </p>
      </div>

      <p className="text-text-neutral-secondary mt-1 text-sm font-medium">
        {typeof data.value === "number"
          ? data.value.toLocaleString()
          : data.value}
        {data.percentage !== undefined && ` (${data.percentage}%)`}
      </p>

      {data.newFindings !== undefined && data.newFindings > 0 && (
        <div className="mt-1 flex items-center gap-2">
          <Bell size={14} className="text-text-neutral-secondary" />
          <span className="text-text-neutral-secondary text-sm font-medium">
            {data.newFindings} New Findings
          </span>
        </div>
      )}

      {data.new !== undefined && data.new > 0 && (
        <div className="mt-1 flex items-center gap-2">
          <Bell size={14} className="text-text-neutral-secondary" />
          <span className="text-text-neutral-secondary text-sm font-medium">
            {data.new} New
          </span>
        </div>
      )}

      {data.muted !== undefined && data.muted > 0 && (
        <div className="mt-1 flex items-center gap-2">
          <VolumeX size={14} className="text-text-neutral-secondary" />
          <span className="text-text-neutral-secondary text-sm font-medium">
            {data.muted} Muted
          </span>
        </div>
      )}

      {data.change !== undefined && (
        <p className="text-text-neutral-secondary mt-1 text-sm font-medium">
          <span className="font-bold">
            {(data.change as number) > 0 ? "+" : ""}
            {data.change}%
          </span>{" "}
          Since Last Scan
        </p>
      )}
    </div>
  );
}

/**
 * Tooltip for charts with multiple data series (like LineChart)
 */
export function MultiSeriesChartTooltip({
  active,
  payload,
  label,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="border-border-neutral-tertiary bg-bg-neutral-tertiary pointer-events-none min-w-[200px] rounded-xl border p-3 shadow-lg">
      <p className="text-text-neutral-primary mb-2 text-sm font-semibold">
        {label}
      </p>

      {payload.map((entry: MultiSeriesPayloadEntry, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-text-neutral-secondary text-sm font-medium">
            {entry.name}:
          </span>
          <span className="text-text-neutral-secondary text-sm font-semibold">
            {entry.value}
          </span>
          {entry.payload && entry.payload[`${entry.dataKey}_change`] && (
            <span className="text-text-neutral-secondary text-sm font-medium">
              (
              {(entry.payload[`${entry.dataKey}_change`] as number) > 0
                ? "+"
                : ""}
              {entry.payload[`${entry.dataKey}_change`]}%)
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: prowler-master/ui/components/graphs/shared/constants.ts

```typescript
export const CHART_DIMENSIONS = {
  defaultHeight: 400,
  tooltipMinWidth: "200px",
  borderRadius: "8px",
} as const;

export const SORT_OPTIONS = {
  highLow: "high-low",
  lowHigh: "low-high",
  alphabetical: "alphabetical",
} as const;

export const DEFAULT_SORT_OPTION = SORT_OPTIONS.highLow;

export const SEVERITY_ORDER = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
  Informational: 4,
  Info: 4,
} as const;

export const LAYOUT_OPTIONS = {
  horizontal: "horizontal",
  vertical: "vertical",
} as const;
```

--------------------------------------------------------------------------------

---[FILE: custom-active-dot.tsx]---
Location: prowler-master/ui/components/graphs/shared/custom-active-dot.tsx

```typescript
import { Dot } from "recharts";

import { LineDataPoint } from "../types";

export interface PointClickData {
  point: LineDataPoint;
  dataKey?: string;
}

interface CustomActiveDotProps {
  cx?: number;
  cy?: number;
  payload?: LineDataPoint;
  dataKey: string;
  color: string;
  isFaded: boolean;
  onPointClick?: (data: PointClickData) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const CustomActiveDot = ({
  cx,
  cy,
  payload,
  dataKey,
  color,
  isFaded,
  onPointClick,
  onMouseEnter,
  onMouseLeave,
}: CustomActiveDotProps) => {
  if (cx === undefined || cy === undefined) return null;

  // Don't render active dot for faded lines
  if (isFaded) return null;

  return (
    <Dot
      cx={cx}
      cy={cy}
      r={6}
      fill={color}
      style={{ cursor: onPointClick ? "pointer" : "default" }}
      onClick={() => {
        if (onPointClick && payload) {
          onPointClick({ point: payload, dataKey });
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-axis-tick.tsx]---
Location: prowler-master/ui/components/graphs/shared/custom-axis-tick.tsx

```typescript
export const AXIS_FONT_SIZE = 14;
const TODAY_FONT_SIZE = 12;
const MONTH_FONT_SIZE = 11;

interface CustomXAxisTickProps {
  x: number;
  y: number;
  index?: number;
  payload: {
    value: string | number;
  };
  visibleTicksCount?: number;
}

const getTodayISO = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getMonthName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short" });
};

const getDayNumber = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.getDate();
};

const getMonthFromDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.getMonth();
};

export const CustomXAxisTickWithToday = Object.assign(
  function CustomXAxisTickWithToday(
    props: CustomXAxisTickProps & { data?: Array<{ date: string }> },
  ) {
    const { x, y, payload, index = 0, data = [] } = props;
    const dateStr = String(payload.value);
    const todayISO = getTodayISO();
    const isToday = dateStr === todayISO;

    const dayNumber = getDayNumber(dateStr);
    const currentMonth = getMonthFromDate(dateStr);

    // Show month name if it's the first tick or if the month changed from previous tick
    const isFirstTick = index === 0;
    const previousDate = index > 0 && data[index - 1]?.date;
    const previousMonth = previousDate ? getMonthFromDate(previousDate) : -1;
    const monthChanged = currentMonth !== previousMonth;
    const showMonth = isFirstTick || monthChanged;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={20}
          dy={4}
          textAnchor="middle"
          fill="var(--color-text-neutral-secondary)"
          fontSize={AXIS_FONT_SIZE}
        >
          {dayNumber}
        </text>
        {showMonth && (
          <text
            x={0}
            y={42}
            textAnchor="middle"
            fill="var(--color-text-neutral-tertiary)"
            fontSize={MONTH_FONT_SIZE}
          >
            {getMonthName(dateStr)}
          </text>
        )}
        {isToday && (
          <text
            x={0}
            y={showMonth ? 56 : 42}
            textAnchor="middle"
            fill="var(--color-text-neutral-secondary)"
            fontSize={TODAY_FONT_SIZE}
            fontWeight={400}
          >
            (today)
          </text>
        )}
      </g>
    );
  },
  { displayName: "CustomXAxisTickWithToday" },
);

export const CustomXAxisTick = Object.assign(
  function CustomXAxisTick(props: CustomXAxisTickProps) {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={20}
          dy={4}
          textAnchor="middle"
          fill="var(--color-text-neutral-secondary)"
          fontSize={AXIS_FONT_SIZE}
        >
          {payload.value}
        </text>
      </g>
    );
  },
  { displayName: "CustomXAxisTick" },
);
```

--------------------------------------------------------------------------------

---[FILE: custom-dot.tsx]---
Location: prowler-master/ui/components/graphs/shared/custom-dot.tsx

```typescript
import { Dot } from "recharts";

interface CustomDotProps {
  cx?: number;
  cy?: number;
  color: string;
  isFaded: boolean;
}

export const CustomDot = ({ cx, cy, color, isFaded }: CustomDotProps) => {
  if (cx === undefined || cy === undefined) return null;

  return <Dot cx={cx} cy={cy} r={4} fill={color} opacity={isFaded ? 0.2 : 1} />;
};
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: prowler-master/ui/components/graphs/shared/utils.ts

```typescript
const SEVERITY_COLORS = {
  Critical: "var(--color-bg-data-critical)",
  High: "var(--color-bg-data-high)",
  Medium: "var(--color-bg-data-medium)",
  Low: "var(--color-bg-data-low)",
  Informational: "var(--color-bg-data-info)",
  Info: "var(--color-bg-data-info)",
  Muted: "var(--color-bg-data-muted)",
};

export function getSeverityColorByRiskScore(riskScore: number): string {
  if (riskScore >= 7) return SEVERITY_COLORS.Critical;
  if (riskScore >= 5) return SEVERITY_COLORS.High;
  if (riskScore >= 3) return SEVERITY_COLORS.Medium;
  if (riskScore >= 1) return SEVERITY_COLORS.Low;
  return SEVERITY_COLORS.Informational;
}

export function getSeverityColorByName(name: string): string | undefined {
  return SEVERITY_COLORS[name as keyof typeof SEVERITY_COLORS];
}
```

--------------------------------------------------------------------------------

````
