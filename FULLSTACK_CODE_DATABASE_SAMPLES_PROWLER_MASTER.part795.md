---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 795
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 795 of 867)

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

---[FILE: line-chart.tsx]---
Location: prowler-master/ui/components/graphs/line-chart.tsx
Signals: React

```typescript
"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLine,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart/Chart";

import { AlertPill } from "./shared/alert-pill";
import { ChartLegend } from "./shared/chart-legend";
import { CustomActiveDot, PointClickData } from "./shared/custom-active-dot";
import {
  AXIS_FONT_SIZE,
  CustomXAxisTickWithToday,
} from "./shared/custom-axis-tick";
import { CustomDot } from "./shared/custom-dot";
import { LineConfig, LineDataPoint } from "./types";

interface LineChartProps {
  data: LineDataPoint[];
  lines: LineConfig[];
  height?: number;
  xAxisInterval?: number | "preserveStart" | "preserveEnd" | "preserveStartEnd";
  onPointClick?: (data: PointClickData) => void;
}

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
  stroke: string;
  name: string;
  payload: LineDataPoint;
}

const formatTooltipDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

interface CustomLineTooltipProps extends TooltipProps<number, string> {
  filterLine?: string | null;
}

const CustomLineTooltip = ({
  active,
  payload,
  label,
  filterLine,
}: CustomLineTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const typedPayload = payload as unknown as TooltipPayloadItem[];

  // Filter payload if a line is selected or hovered
  const filteredPayload = filterLine
    ? typedPayload.filter((item) => item.dataKey === filterLine)
    : typedPayload;

  // Sort by severity order: critical, high, medium, low, informational
  const severityOrder = [
    "critical",
    "high",
    "medium",
    "low",
    "informational",
  ] as const;
  const displayPayload = [...filteredPayload].sort((a, b) => {
    const aIndex = severityOrder.indexOf(
      a.dataKey as (typeof severityOrder)[number],
    );
    const bIndex = severityOrder.indexOf(
      b.dataKey as (typeof severityOrder)[number],
    );
    // Items not in severityOrder go to the end
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  if (displayPayload.length === 0) {
    return null;
  }

  const totalValue = displayPayload.reduce((sum, item) => sum + item.value, 0);
  const formattedDate = formatTooltipDate(String(label));

  return (
    <div className="border-border-neutral-tertiary bg-bg-neutral-tertiary pointer-events-none min-w-[200px] rounded-xl border p-3 shadow-lg">
      <p className="text-text-neutral-secondary mb-3 text-xs">
        {formattedDate}
      </p>

      <div className="mb-3">
        <AlertPill value={totalValue} textSize="sm" />
      </div>

      <div className="space-y-3">
        {displayPayload.map((item) => {
          const newFindings = item.payload[`${item.dataKey}_newFindings`];
          const change = item.payload[`${item.dataKey}_change`];

          return (
            <div key={item.dataKey} className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.stroke }}
                  />
                  <span className="text-text-neutral-secondary text-sm">
                    {item.name}
                  </span>
                </div>
                <span className="text-text-neutral-primary text-sm font-medium">
                  {item.value}
                </span>
              </div>
              {newFindings !== undefined && (
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-text-neutral-secondary" />
                  <span className="text-text-neutral-secondary text-xs">
                    {newFindings} New Findings
                  </span>
                </div>
              )}
              {change !== undefined && typeof change === "number" && (
                <p className="text-text-neutral-secondary text-xs">
                  <span className="font-bold">
                    {(change as number) > 0 ? "+" : ""}
                    {change}%
                  </span>{" "}
                  Since Last Scan
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const chartConfig = {
  default: {
    color: "var(--color-bg-data-azure)",
  },
} satisfies ChartConfig;

export function LineChart({
  data,
  lines,
  height = 400,
  xAxisInterval = "preserveStartEnd",
  onPointClick,
}: LineChartProps) {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  // Active line is either selected (persistent) or hovered (temporary)
  const activeLine = selectedLine ?? hoveredLine;

  const legendItems = lines.map((line) => ({
    label: line.label,
    color: line.color,
    dataKey: line.dataKey,
  }));

  const handleLegendClick = (dataKey: string) => {
    // Toggle selection: if already selected, deselect; otherwise select
    setSelectedLine((current) => (current === dataKey ? null : dataKey));
  };

  return (
    <div className="w-full">
      <ChartContainer
        config={chartConfig}
        className="w-full overflow-hidden"
        style={{ height, aspectRatio: "auto" }}
      >
        <RechartsLine
          data={data}
          margin={{
            top: 10,
            left: 0,
            right: 30,
            bottom: 40,
          }}
          style={{ cursor: onPointClick ? "pointer" : "default" }}
        >
          <CartesianGrid
            vertical={false}
            strokeOpacity={1}
            stroke="var(--border-neutral-secondary)"
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={xAxisInterval}
            tick={(props) => (
              <CustomXAxisTickWithToday {...props} data={data} />
            )}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{
              fill: "var(--color-text-neutral-secondary)",
              fontSize: AXIS_FONT_SIZE,
            }}
          />
          <ChartTooltip
            cursor={{
              stroke: "var(--color-text-neutral-tertiary)",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
            content={<CustomLineTooltip filterLine={activeLine} />}
          />
          {lines.map((line) => {
            const isActive = activeLine === line.dataKey;
            const isFaded = activeLine !== null && !isActive;
            return (
              <Line
                key={line.dataKey}
                type="natural"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={2}
                strokeOpacity={isFaded ? 0.2 : 1}
                name={line.label}
                dot={({
                  key,
                  ...props
                }: {
                  key?: string;
                  cx?: number;
                  cy?: number;
                }) => (
                  <CustomDot
                    key={key}
                    {...props}
                    color={line.color}
                    isFaded={isFaded}
                  />
                )}
                activeDot={(props: {
                  cx?: number;
                  cy?: number;
                  payload?: LineDataPoint;
                }) => (
                  <CustomActiveDot
                    {...props}
                    dataKey={line.dataKey}
                    color={line.color}
                    isFaded={isFaded}
                    onPointClick={onPointClick}
                    onMouseEnter={() => setHoveredLine(line.dataKey)}
                    onMouseLeave={() => setHoveredLine(null)}
                  />
                )}
                style={{ transition: "stroke-opacity 0.2s" }}
              />
            );
          })}
        </RechartsLine>
      </ChartContainer>

      <div className="mt-4 flex flex-col items-start gap-2">
        <p className="text-text-neutral-tertiary pl-2 text-xs">
          Click to filter by severity
        </p>
        <ChartLegend
          items={legendItems}
          selectedItem={selectedLine}
          onItemClick={handleLegendClick}
        />
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: map-chart.tsx]---
Location: prowler-master/ui/components/graphs/map-chart.tsx
Signals: React

```typescript
"use client";

import * as d3 from "d3";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import { AlertTriangle, Info, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { feature } from "topojson-client";
import type {
  GeometryCollection,
  Objects,
  Topology,
} from "topojson-specification";

import { HorizontalBarChart } from "./horizontal-bar-chart";
import { BarDataPoint } from "./types";

// Constants
const MAP_CONFIG = {
  defaultWidth: 688,
  defaultHeight: 400,
  pointRadius: 6,
  selectedPointRadius: 8,
  transitionDuration: 300,
} as const;

const MAP_COLORS = {
  landFill: "var(--border-neutral-tertiary)",
  landStroke: "var(--border-neutral-secondary)",
  pointDefault: "var(--bg-fail)",
  pointSelected: "var(--bg-pass)",
  pointHover: "var(--bg-fail)",
} as const;

const RISK_LEVELS = {
  LOW_HIGH: "low-high",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

type RiskLevel = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS];

interface LocationPoint {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number];
  totalFindings: number;
  riskLevel: RiskLevel;
  severityData: BarDataPoint[];
  change?: number;
}

export interface MapChartData {
  locations: LocationPoint[];
  regions: string[];
}

export interface MapChartProps {
  data: MapChartData;
  height?: number;
  onLocationSelect?: (location: LocationPoint | null) => void;
}

// Utility functions
function createProjection(width: number, height: number) {
  return d3
    .geoNaturalEarth1()
    .fitExtent(
      [
        [1, 1],
        [width - 1, height - 1],
      ],
      { type: "Sphere" },
    )
    .precision(0.2);
}

async function fetchWorldData(): Promise<FeatureCollection | null> {
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

// Helper: Create SVG element
function createSVGElement<T extends SVGElement>(
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

// Components
function MapTooltip({
  location,
  position,
}: {
  location: LocationPoint;
  position: { x: number; y: number };
}) {
  const CHART_COLORS = {
    tooltipBorder: "var(--border-neutral-tertiary)",
    tooltipBackground: "var(--bg-neutral-secondary)",
    textPrimary: "var(--text-neutral-primary)",
    textSecondary: "var(--text-neutral-secondary)",
  };

  return (
    <div
      className="pointer-events-none absolute z-50 min-w-[200px] rounded-lg border p-3 shadow-lg"
      style={{
        left: `${position.x + 15}px`,
        top: `${position.y + 15}px`,
        transform: "translate(0, -50%)",
        borderColor: CHART_COLORS.tooltipBorder,
        backgroundColor: CHART_COLORS.tooltipBackground,
      }}
    >
      <div className="flex items-center gap-2">
        <MapPin size={14} style={{ color: CHART_COLORS.textSecondary }} />
        <span
          className="text-sm font-semibold"
          style={{ color: CHART_COLORS.textPrimary }}
        >
          {location.name}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <AlertTriangle size={14} className="text-[#DB2B49]" />
        <span className="text-sm" style={{ color: CHART_COLORS.textPrimary }}>
          {location.totalFindings.toLocaleString()} Fail Findings
        </span>
      </div>
      {location.change !== undefined && (
        <p
          className="mt-1 text-xs"
          style={{ color: CHART_COLORS.textSecondary }}
        >
          <span className="font-bold">
            {location.change > 0 ? "+" : ""}
            {location.change}%
          </span>{" "}
          since last scan
        </p>
      )}
    </div>
  );
}

function EmptyState() {
  const CHART_COLORS = {
    tooltipBorder: "var(--border-neutral-tertiary)",
    tooltipBackground: "var(--bg-neutral-secondary)",
    textSecondary: "var(--text-neutral-secondary)",
  };

  return (
    <div
      className="flex h-full min-h-[400px] w-full items-center justify-center rounded-lg border p-6"
      style={{
        borderColor: CHART_COLORS.tooltipBorder,
        backgroundColor: CHART_COLORS.tooltipBackground,
      }}
    >
      <div className="text-center">
        <Info
          size={48}
          className="mx-auto mb-2"
          style={{ color: CHART_COLORS.textSecondary }}
        />
        <p className="text-sm" style={{ color: CHART_COLORS.textSecondary }}>
          Select a location on the map to view details
        </p>
      </div>
    </div>
  );
}

function LoadingState({ height }: { height: number }) {
  const CHART_COLORS = {
    textSecondary: "var(--text-neutral-secondary)",
  };

  return (
    <div className="flex items-center justify-center" style={{ height }}>
      <div className="text-center">
        <div className="mb-2" style={{ color: CHART_COLORS.textSecondary }}>
          Loading map...
        </div>
      </div>
    </div>
  );
}

export function MapChart({
  data,
  height = MAP_CONFIG.defaultHeight,
}: MapChartProps) {
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
  const [worldData, setWorldData] = useState<FeatureCollection | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: MAP_CONFIG.defaultWidth,
    height,
  });

  // Fetch world data once on mount
  useEffect(() => {
    let isMounted = true;
    fetchWorldData()
      .then((data) => {
        if (isMounted && data) setWorldData(data);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setIsLoadingMap(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.clientWidth, height });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);

  // Render the map
  useEffect(() => {
    if (!svgRef.current || !worldData || isLoadingMap) return;

    const svg = svgRef.current;
    const { width, height } = dimensions;
    svg.innerHTML = "";

    const projection = createProjection(width, height);
    const path = d3.geoPath().projection(projection);

    // Render countries
    const mapGroup = createSVGElement<SVGGElement>("g", {
      class: "map-countries",
    });
    worldData.features?.forEach(
      (feature: Feature<Geometry, GeoJsonProperties>) => {
        const pathData = path(feature);
        if (pathData) {
          const pathElement = createSVGElement<SVGPathElement>("path", {
            d: pathData,
            fill: MAP_COLORS.landFill,
            stroke: MAP_COLORS.landStroke,
            "stroke-width": "0.5",
          });
          mapGroup.appendChild(pathElement);
        }
      },
    );
    svg.appendChild(mapGroup);

    // Helper to update tooltip position
    const updateTooltip = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    // Helper to create circle
    const createCircle = (location: LocationPoint) => {
      const projected = projection(location.coordinates);
      if (!projected) return null;

      const [x, y] = projected;
      if (x < 0 || x > width || y < 0 || y > height) return null;

      const isSelected = selectedLocation?.id === location.id;
      const isHovered = hoveredLocation?.id === location.id;
      const classes = ["cursor-pointer"];

      if (isSelected) classes.push("drop-shadow-[0_0_8px_#86da26]");
      if (isHovered && !isSelected) classes.push("opacity-70");

      const circle = createSVGElement<SVGCircleElement>("circle", {
        cx: x.toString(),
        cy: y.toString(),
        r: (isSelected
          ? MAP_CONFIG.selectedPointRadius
          : MAP_CONFIG.pointRadius
        ).toString(),
        fill: isSelected ? MAP_COLORS.pointSelected : MAP_COLORS.pointDefault,
        class: classes.join(" "),
      });

      circle.addEventListener("click", () =>
        setSelectedLocation(isSelected ? null : location),
      );
      circle.addEventListener("mouseenter", (e) => {
        setHoveredLocation(location);
        updateTooltip(e);
      });
      circle.addEventListener("mousemove", updateTooltip);
      circle.addEventListener("mouseleave", () => {
        setHoveredLocation(null);
        setTooltipPosition(null);
      });

      return circle;
    };

    // Render points
    const pointsGroup = createSVGElement<SVGGElement>("g", {
      class: "threat-points",
    });

    // Unselected points first
    data.locations.forEach((location) => {
      if (selectedLocation?.id !== location.id) {
        const circle = createCircle(location);
        if (circle) pointsGroup.appendChild(circle);
      }
    });

    // Selected point last (on top)
    if (selectedLocation) {
      const selectedData = data.locations.find(
        (loc) => loc.id === selectedLocation.id,
      );
      if (selectedData) {
        const circle = createCircle(selectedData);
        if (circle) pointsGroup.appendChild(circle);
      }
    }

    svg.appendChild(pointsGroup);
  }, [
    data.locations,
    dimensions,
    selectedLocation,
    hoveredLocation,
    worldData,
    isLoadingMap,
  ]);

  const CHART_COLORS = {
    tooltipBorder: "var(--border-neutral-tertiary)",
    tooltipBackground: "var(--bg-neutral-secondary)",
    textPrimary: "var(--text-neutral-primary)",
    textSecondary: "var(--text-neutral-secondary)",
  };

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start">
      {/* Map Section */}
      <div className="flex-1">
        <h3
          className="mb-4 text-lg font-semibold"
          style={{ color: CHART_COLORS.textPrimary }}
        >
          Threat Map
        </h3>

        <div
          ref={containerRef}
          className="rounded-lg border p-4"
          style={{
            borderColor: CHART_COLORS.tooltipBorder,
            backgroundColor: CHART_COLORS.tooltipBackground,
          }}
        >
          {isLoadingMap ? (
            <LoadingState height={dimensions.height} />
          ) : (
            <>
              <div className="relative">
                <svg
                  ref={svgRef}
                  width={dimensions.width}
                  height={dimensions.height}
                  className="w-full"
                  style={{ maxWidth: "100%" }}
                />
                {hoveredLocation && tooltipPosition && (
                  <MapTooltip
                    location={hoveredLocation}
                    position={tooltipPosition}
                  />
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#DB2B49]" />
                <span
                  className="text-sm"
                  style={{ color: CHART_COLORS.textSecondary }}
                >
                  {data.locations.length} Locations
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="w-full lg:w-[400px]">
        <div className="mb-4 h-10" />
        {selectedLocation ? (
          <div
            className="rounded-lg border p-6"
            style={{
              borderColor: CHART_COLORS.tooltipBorder,
              backgroundColor: CHART_COLORS.tooltipBackground,
            }}
          >
            <div className="mb-6">
              <div className="mb-1 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#86DA26]" />
                <h4
                  className="text-base font-semibold"
                  style={{ color: CHART_COLORS.textPrimary }}
                >
                  {selectedLocation.name}
                </h4>
              </div>
              <p
                className="text-sm"
                style={{ color: CHART_COLORS.textSecondary }}
              >
                {selectedLocation.totalFindings.toLocaleString()} Total Findings
              </p>
            </div>
            <HorizontalBarChart data={selectedLocation.severityData} />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: map-region-filter.tsx]---
Location: prowler-master/ui/components/graphs/map-region-filter.tsx

```typescript
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select/Select";

interface MapRegionFilterProps {
  regions: string[];
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  chartColors: {
    tooltipBorder: string;
    tooltipBackground: string;
    textPrimary: string;
  };
}

export function MapRegionFilter({
  regions,
  selectedRegion,
  onRegionChange,
  chartColors,
}: MapRegionFilterProps) {
  return (
    <Select value={selectedRegion} onValueChange={onRegionChange}>
      <SelectTrigger
        className="min-w-[200px] rounded-lg"
        style={{
          borderColor: chartColors.tooltipBorder,
          backgroundColor: chartColors.tooltipBackground,
          color: chartColors.textPrimary,
        }}
      >
        <SelectValue placeholder="All Regions" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All Regions">All Regions</SelectItem>
        {regions.map((region) => (
          <SelectItem key={region} value={region}>
            {region}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: radar-chart.tsx]---
Location: prowler-master/ui/components/graphs/radar-chart.tsx
Signals: React

```typescript
"use client";

import { type MouseEvent } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadar,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart/Chart";

import { AlertPill } from "./shared/alert-pill";
import { RadarDataPoint } from "./types";

interface RadarChartProps {
  data: RadarDataPoint[];
  height?: number;
  dataKey?: string;
  onSelectPoint?: (point: RadarDataPoint | null) => void;
  selectedPoint?: RadarDataPoint | null;
}

const chartConfig = {
  value: {
    label: "Findings",
    color: "var(--chart-radar-primary)",
  },
} satisfies ChartConfig;

interface TooltipPayloadItem {
  payload: RadarDataPoint;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="border-border-neutral-tertiary bg-bg-neutral-tertiary pointer-events-none min-w-[200px] rounded-xl border p-3 shadow-lg">
        <p className="text-text-neutral-primary text-sm font-semibold">
          {data.payload.category}
        </p>
        <div className="mt-1">
          <AlertPill value={data.payload.value} />
        </div>
        {data.payload.change !== undefined && (
          <p className="text-text-neutral-secondary mt-1 text-sm font-medium">
            <span
              style={{
                color:
                  data.payload.change > 0
                    ? "var(--bg-pass-primary)"
                    : "var(--bg-data-critical)",
                fontWeight: "bold",
              }}
            >
              {(data.payload.change as number) > 0 ? "+" : ""}
              {data.payload.change}%{" "}
            </span>
            since last scan
          </p>
        )}
      </div>
    );
  }
  return null;
};

interface DotShapeProps {
  cx: number;
  cy: number;
  payload: RadarDataPoint & { name?: string };
  key: string;
}

interface CustomDotProps extends DotShapeProps {
  selectedPoint?: RadarDataPoint | null;
  onSelectPoint?: (point: RadarDataPoint | null) => void;
  data?: RadarDataPoint[];
}

const CustomDot = ({
  cx,
  cy,
  payload,
  selectedPoint,
  onSelectPoint,
  data,
}: CustomDotProps) => {
  const currentCategory = payload.name || payload.category;
  const isSelected = selectedPoint?.category === currentCategory;
  const isFaded = selectedPoint !== null && !isSelected;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (onSelectPoint) {
      // Re-evaluate selection status at click time, not from closure
      const currentlySelected = selectedPoint?.category === currentCategory;
      if (currentlySelected) {
        onSelectPoint(null);
      } else {
        const fullDataItem = data?.find(
          (d: RadarDataPoint) => d.category === currentCategory,
        );
        const point: RadarDataPoint = {
          category: currentCategory,
          categoryId: fullDataItem?.categoryId || payload.categoryId || "",
          value: payload.value,
          change: payload.change,
          severityData: fullDataItem?.severityData || payload.severityData,
        };
        onSelectPoint(point);
      }
    }
  };

  return (
    <circle
      cx={cx}
      cy={cy}
      r={isSelected ? 9 : 6}
      style={{
        fill: isSelected
          ? "var(--bg-button-primary)"
          : "var(--bg-radar-button)",
        fillOpacity: isFaded ? 0.3 : 1,
        cursor: onSelectPoint ? "pointer" : "default",
        pointerEvents: "all",
        transition: "fill-opacity 200ms ease-in-out",
      }}
      onClick={onSelectPoint ? handleClick : undefined}
    />
  );
};

export function RadarChart({
  data,
  height = 400,
  dataKey = "value",
  onSelectPoint,
  selectedPoint,
}: RadarChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto w-full"
      style={{ height }}
    >
      <RechartsRadar data={data}>
        <ChartTooltip cursor={false} content={<CustomTooltip />} />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: "var(--color-text-neutral-primary)" }}
        />
        <PolarGrid strokeOpacity={0.3} />
        <Radar
          dataKey={dataKey}
          fill="var(--bg-radar-map)"
          fillOpacity={1}
          activeDot={false}
          dot={
            onSelectPoint
              ? (dotProps: DotShapeProps) => {
                  const { key, cx, cy, payload } = dotProps;
                  return (
                    <CustomDot
                      key={key}
                      cx={cx}
                      cy={cy}
                      payload={payload}
                      selectedPoint={selectedPoint}
                      onSelectPoint={onSelectPoint}
                      data={data}
                    />
                  );
                }
              : {
                  r: 6,
                  fill: "var(--bg-radar-map)",
                  fillOpacity: 1,
                }
          }
        />
      </RechartsRadar>
    </ChartContainer>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: radial-chart.tsx]---
Location: prowler-master/ui/components/graphs/radial-chart.tsx

```typescript
"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface TooltipItem {
  name: string;
  value: number;
  color?: string;
}

interface RadialChartProps {
  percentage: number;
  label?: string;
  color?: string;
  backgroundColor?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  hasDots?: boolean;
  tooltipData?: TooltipItem[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const tooltipItems = payload[0]?.payload?.tooltipData;
  if (
    !tooltipItems ||
    !Array.isArray(tooltipItems) ||
    tooltipItems.length === 0
  )
    return null;

  return (
    <div className="bg-bg-neutral-tertiary border-border-neutral-tertiary rounded-xl border px-3 py-1.5 shadow-lg">
      <div className="flex flex-col gap-0.5">
        {tooltipItems.map((item: TooltipItem, index: number) => (
          <div key={index} className="flex items-end gap-1">
            <p className="text-text-neutral-primary text-xs leading-5 font-medium">
              {item.name}
            </p>
            <div className="border-text-neutral-primary mb-[4px] flex-1 border-b border-dotted" />
            <p
              className="text-xs leading-5 font-medium"
              style={{
                color: item.color || "var(--text-neutral-primary)",
              }}
            >
              {item.value}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export function RadialChart({
  percentage,
  color = "var(--bg-pass-primary)",
  backgroundColor = "var(--bg-neutral-tertiary)",
  height = 250,
  innerRadius = 60,
  outerRadius = 100,
  startAngle = 90,
  endAngle = -270,
  hasDots = false,
  tooltipData,
}: RadialChartProps) {
  // Calculate the real barSize based on the difference
  const barSize = outerRadius - innerRadius;
  const data = [
    {
      value: percentage,
      tooltipData,
    },
  ];
  const middleRadius = innerRadius;
  const viewBoxWidth = height;
  const viewBoxHeight = height;
  const centerX = viewBoxWidth / 2;
  const centerY = viewBoxHeight / 2;
  const arcAngle = Math.abs(startAngle - endAngle);
  const dotSpacing = 20; // 4px dot + 8px space
  const arcCircumference = (arcAngle / 360) * (2 * Math.PI * middleRadius);
  const numberOfDots = Math.floor(arcCircumference / dotSpacing);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        barSize={barSize}
        data={data}
        startAngle={startAngle}
        endAngle={endAngle}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />

        {tooltipData && (
          <Tooltip
            content={<CustomTooltip />}
            wrapperStyle={{ zIndex: 1000 }}
            cursor={false}
          />
        )}

        <RadialBar
          background={{ fill: backgroundColor }}
          dataKey="value"
          fill={color}
          cornerRadius={10}
          isAnimationActive={false}
        />

        {hasDots &&
          Array.from({ length: numberOfDots })
            .slice(1, -1)
            .map((_, i) => {
              // Calculate the angle for this point
              // Adjust the index since we now start from 1
              const angleProgress = (i + 1) / (numberOfDots - 1 || 1);
              const currentAngle =
                startAngle - angleProgress * (startAngle - endAngle);

              // Show dots only in the background part (after the percentage value)
              const valueAngleEnd =
                startAngle - (percentage / 100) * (startAngle - endAngle);
              if (currentAngle > valueAngleEnd) {
                return null; // Don't show dots in the part with value
              }

              const currentAngleRad = (currentAngle * Math.PI) / 180;

              // Calculate absolute position in the viewBox
              const x = centerX + middleRadius * Math.cos(currentAngleRad) + 22;
              const y = centerY - middleRadius * Math.sin(currentAngleRad);

              return (
                <circle key={i} cx={x} cy={y} r={2} fill="var(--chart-dots)" />
              );
            })}

        <text
          x="50%"
          y="38%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold"
          style={{
            fill: "var(--text-neutral-secondary)",
          }}
        >
          {percentage}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
```

--------------------------------------------------------------------------------

````
