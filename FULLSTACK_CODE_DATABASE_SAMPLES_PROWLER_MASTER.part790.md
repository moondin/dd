---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 790
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 790 of 867)

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

---[FILE: threatscore-logo.tsx]---
Location: prowler-master/ui/components/compliance/threatscore-logo.tsx
Signals: React

```typescript
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThreatScoreLogo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-14" style={{ width: "280px", height: "56px" }} />;
  }

  const prowlerColor = resolvedTheme === "dark" ? "#fff" : "#000";

  return (
    <svg
      viewBox="0 0 1000 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-14 w-auto"
      preserveAspectRatio="xMinYMid meet"
    >
      {/* Prowler logo from the new SVG - scaled and positioned to match THREATSCORE size */}
      <g transform="scale(0.50) translate(-60, 20)">
        <path
          fill={prowlerColor}
          d="M1222.86,185.51c20.76-12.21,34.44-34.9,34.44-59.79,0-38.18-31.06-69.25-69.25-69.25l-216.9.23v145.17h-64.8V56.47h-79.95s-47.14,95.97-47.14,95.97V56.47h-52.09s-47.14,95.97-47.14,95.97V56.47h-53.48v69.6c-12.72-41.96-51.75-72.6-97.81-72.6-42.63,0-79.24,26.25-94.54,63.43-4.35-34.03-33.48-60.43-68.67-60.43h-100.01v47.43c-9.16-27.52-35.14-47.43-65.71-47.43H53.47s46.34,46.33,46.34,46.33v151.64h53.47v-76.68l17.21,17.21h29.33c30.56,0,56.54-19.91,65.71-47.43v106.91h53.48v-81.51l76.01,81.51h69.62l-64.29-68.94c11.14-6.56,20.22-16.15,26.26-27.46,1.27,55.26,46.58,99.82,102.14,99.82,46.06,0,85.09-30.64,97.81-72.6v69.18h60.88l38.34-78.06v78.06h60.88l66.2-134.78v135.69h95.41l22.86-22.86v22.86h95.05l21.84-21.84v20.93h53.48v-81.5l76.01,81.5h69.62l-64.29-68.94ZM199.83,141.5h-46.54v-31.54h46.54c8.7,0,15.77,7.07,15.77,15.77s-7.07,15.77-15.77,15.77ZM365.55,141.5l-46.54-.18v-31.36h46.54c8.7,0,15.77,7.07,15.77,15.77s-7.08,15.77-15.77,15.77ZM528.76,204.39c-26.86,0-48.72-21.86-48.72-48.72s21.86-48.72,48.72-48.72,48.72,21.86,48.72,48.72-21.86,48.72-48.72,48.72ZM1088.03,201.88h-63.41v-20.35h42.91v-50.88h-42.91v-20.46h63.41v91.69ZM1188.05,141.5l-46.54-.18v-31.36h46.54c8.7,0,15.77,7.07,15.77,15.77s-7.07,15.77-15.77,15.77Z"
        />
      </g>

      {/* THREATSCORE text */}
      <text x="0" y="240" fontSize="80" fontWeight="700" fill="#22c55e">
        THREATSCORE
      </text>

      {/* Gauge icon - semicircular meter - 1.5x larger */}
      <g transform="translate(680, 0) scale(2)">
        {/* Gauge arcs - drawing from left to right (orange, red, green) */}
        <path
          d="M 20 80 A 60 60 0 0 1 50 29.6"
          stroke="#fb923c"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 50 29.6 A 60 60 0 0 1 110 29.6"
          stroke="#ef4444"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 110 29.6 A 60 60 0 0 1 140 80"
          stroke="#22c55e"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
        />

        {/* Checkmark */}
        <path
          d="M 60 80 L 72 92 L 104 60"
          stroke="#22c55e"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: client-accordion-content.tsx]---
Location: prowler-master/ui/components/compliance/compliance-accordion/client-accordion-content.tsx
Signals: React, Next.js

```typescript
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getFindings } from "@/actions/findings/findings";
import {
  ColumnFindings,
  SkeletonTableFindings,
} from "@/components/findings/table";
import { Accordion } from "@/components/ui/accordion/Accordion";
import { DataTable } from "@/components/ui/table";
import { createDict } from "@/lib";
import { getComplianceMapper } from "@/lib/compliance/compliance-mapper";
import { Requirement } from "@/types/compliance";
import { FindingProps, FindingsResponse } from "@/types/components";

interface ClientAccordionContentProps {
  requirement: Requirement;
  scanId: string;
  framework: string;
  disableFindings?: boolean;
}

export const ClientAccordionContent = ({
  requirement,
  framework,
  scanId,
  disableFindings = false,
}: ClientAccordionContentProps) => {
  const [findings, setFindings] = useState<FindingsResponse | null>(null);
  const [expandedFindings, setExpandedFindings] = useState<FindingProps[]>([]);
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page") || "1";
  const complianceId = searchParams.get("complianceId");
  const defaultSort = "severity,status,-inserted_at";
  const sort = searchParams.get("sort") || defaultSort;
  const loadedPageRef = useRef<string | null>(null);
  const loadedSortRef = useRef<string | null>(null);
  const isExpandedRef = useRef(false);
  const region = searchParams.get("filter[region__in]") || "";

  useEffect(() => {
    async function loadFindings() {
      if (
        !disableFindings &&
        requirement.check_ids?.length > 0 &&
        requirement.status !== "No findings" &&
        (loadedPageRef.current !== pageNumber ||
          loadedSortRef.current !== sort ||
          !isExpandedRef.current)
      ) {
        loadedPageRef.current = pageNumber;
        loadedSortRef.current = sort;
        isExpandedRef.current = true;

        try {
          const checkIds = requirement.check_ids;
          const encodedSort = sort.replace(/^\+/, "");
          const findingsData = await getFindings({
            filters: {
              "filter[check_id__in]": checkIds.join(","),
              "filter[scan]": scanId,
              ...(region && { "filter[region__in]": region }),
            },
            page: parseInt(pageNumber, 10),
            sort: encodedSort,
          });

          setFindings(findingsData);

          if (findingsData?.data) {
            // Create dictionaries for resources, scans, and providers
            const resourceDict = createDict("resources", findingsData);
            const scanDict = createDict("scans", findingsData);
            const providerDict = createDict("providers", findingsData);

            // Expand each finding with its corresponding resource, scan, and provider
            const expandedData = findingsData.data.map(
              (finding: FindingProps) => {
                const scan = scanDict[finding.relationships?.scan?.data?.id];
                const resource =
                  resourceDict[finding.relationships?.resources?.data?.[0]?.id];
                const provider =
                  providerDict[scan?.relationships?.provider?.data?.id];

                return {
                  ...finding,
                  relationships: { scan, resource, provider },
                };
              },
            );
            setExpandedFindings(expandedData);
          }
        } catch (error) {
          console.error("Error loading findings:", error);
        }
      }
    }

    loadFindings();
  }, [requirement, scanId, pageNumber, sort, region, disableFindings]);

  const renderDetails = () => {
    if (!complianceId) {
      return null;
    }

    const mapper = getComplianceMapper(framework);
    const detailsComponent = mapper.getDetailsComponent(requirement);

    return <div className="w-full">{detailsComponent}</div>;
  };

  if (disableFindings) {
    return (
      <div className="w-full">
        {renderDetails()}
        <p className="mt-3 mb-1 text-sm font-medium text-gray-800 dark:text-gray-200">
          ⚠️ This requirement has no checks; therefore, there are no findings.
        </p>
      </div>
    );
  }

  const checks = requirement.check_ids || [];
  const checksList = (
    <div className="flex items-center px-2 text-sm">
      <div className="w-full flex-col">
        <div className="mt-[-8px] mb-1 h-1 w-full border-b border-gray-200 dark:border-gray-800" />
        <span className="text-gray-600 dark:text-gray-200" aria-label="Checks">
          {checks.join(", ")}
        </span>
      </div>
    </div>
  );

  const accordionChecksItems = [
    {
      key: "checks",
      title: (
        <div className="flex items-center gap-2">
          <span className="text-primary">{checks.length}</span>
          {checks.length > 1 ? <span>Checks</span> : <span>Check</span>}
        </div>
      ),
      content: checksList,
    },
  ];

  const renderFindingsTable = () => {
    if (findings === null && requirement.status !== "MANUAL") {
      return <SkeletonTableFindings />;
    }

    if (findings?.data?.length && findings.data.length > 0) {
      return (
        <>
          <h4 className="mb-2 text-sm font-medium">Findings</h4>

          <DataTable
            // Remove the updated_at column as compliance is for the last scan
            columns={ColumnFindings.filter((_, index) => index !== 7)}
            data={expandedFindings || []}
            metadata={findings?.meta}
            disableScroll={true}
          />
        </>
      );
    }

    return (
      <div className="mt-3 mb-1 text-sm font-medium text-gray-800 dark:text-gray-200">
        ⚠️ There are no findings for these regions
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderDetails()}

      {checks.length > 0 && (
        <div className="my-4">
          <Accordion
            items={accordionChecksItems}
            variant="light"
            defaultExpandedKeys={[""]}
            className="dark:bg-prowler-blue-400 rounded-lg bg-gray-50"
          />
        </div>
      )}

      {renderFindingsTable()}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: client-accordion-wrapper.tsx]---
Location: prowler-master/ui/components/compliance/compliance-accordion/client-accordion-wrapper.tsx
Signals: React

```typescript
"use client";

import { useState } from "react";

import { Button } from "@/components/shadcn";
import { Accordion, AccordionItemProps } from "@/components/ui";

export const ClientAccordionWrapper = ({
  items,
  defaultExpandedKeys,
  hideExpandButton = false,
}: {
  items: AccordionItemProps[];
  defaultExpandedKeys: string[];
  hideExpandButton?: boolean;
}) => {
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultExpandedKeys);
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to get all keys except the last level (requirements)
  const getAllKeysExceptLastLevel = (items: AccordionItemProps[]): string[] => {
    const keys: string[] = [];

    const traverse = (items: AccordionItemProps[], level: number = 0) => {
      items.forEach((item) => {
        // Add current item key if it's not the last level
        if (item.items && item.items.length > 0) {
          keys.push(item.key);
          // Check if the children have their own children (not the last level)
          const hasGrandChildren = item.items.some(
            (child) => child.items && child.items.length > 0,
          );
          if (hasGrandChildren) {
            traverse(item.items, level + 1);
          }
        }
      });
    };

    traverse(items);
    return keys;
  };

  const handleToggleExpand = () => {
    if (isExpanded) {
      setSelectedKeys(defaultExpandedKeys);
    } else {
      const allKeys = getAllKeysExceptLastLevel(items);
      setSelectedKeys(allKeys);
    }
    setIsExpanded(!isExpanded);
  };

  const handleSelectionChange = (keys: string[]) => {
    setSelectedKeys(keys);
  };

  return (
    <div>
      {!hideExpandButton && (
        <div className="text-text-neutral-tertiary hover:text-text-neutral-primary mt-[-16px] flex justify-end text-xs font-medium transition-colors">
          <Button
            onClick={handleToggleExpand}
            aria-label={isExpanded ? "Collapse all" : "Expand all"}
            variant="ghost"
            size="sm"
            className="mb-1"
          >
            {isExpanded ? "Collapse all" : "Expand all"}
          </Button>
        </div>
      )}
      <Accordion
        items={items}
        variant="light"
        selectionMode="multiple"
        defaultExpandedKeys={defaultExpandedKeys}
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: compliance-accordion-requeriment-title.tsx]---
Location: prowler-master/ui/components/compliance/compliance-accordion/compliance-accordion-requeriment-title.tsx

```typescript
import { FindingStatus, StatusFindingBadge } from "@/components/ui/table";

interface ComplianceAccordionRequirementTitleProps {
  type: string;
  name: string;
  status: FindingStatus;
}

export const ComplianceAccordionRequirementTitle = ({
  type,
  name,
  status,
}: ComplianceAccordionRequirementTitleProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex w-5/6 items-center gap-2">
        {type && (
          <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium">
            {type}
          </span>
        )}
        <span>{name}</span>
      </div>
      <StatusFindingBadge status={status} />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: compliance-accordion-title.tsx]---
Location: prowler-master/ui/components/compliance/compliance-accordion/compliance-accordion-title.tsx

```typescript
import { Tooltip } from "@heroui/tooltip";

interface ComplianceAccordionTitleProps {
  label: string;
  pass: number;
  fail: number;
  manual?: number;
  isParentLevel?: boolean;
}

export const ComplianceAccordionTitle = ({
  label,
  pass,
  fail,
  manual = 0,
  isParentLevel = false,
}: ComplianceAccordionTitleProps) => {
  const total = pass + fail + manual;
  const passPercentage = (pass / total) * 100;
  const failPercentage = (fail / total) * 100;
  const manualPercentage = (manual / total) * 100;

  return (
    <div className="flex flex-col items-start justify-between gap-1 md:flex-row md:items-center md:gap-2">
      <div className="overflow-hidden md:min-w-0 md:flex-1">
        <span
          className="block max-w-[200px] truncate text-sm text-ellipsis sm:max-w-[300px] md:max-w-[400px] lg:max-w-[600px]"
          title={label}
        >
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
      </div>
      <div className="mr-4 flex items-center gap-2">
        <div className="hidden lg:block">
          {total > 0 && isParentLevel && (
            <span className="text-xs font-medium whitespace-nowrap text-gray-600">
              Requirements:
            </span>
          )}
        </div>

        <div className="flex h-1.5 w-[200px] overflow-hidden rounded-full bg-gray-100 shadow-inner">
          {total > 0 ? (
            <div className="flex w-full">
              {pass > 0 && (
                <Tooltip
                  content={
                    <div className="px-1 py-0.5">
                      <div className="text-xs font-medium">Pass</div>
                      <div className="text-tiny text-default-400">
                        {pass} ({passPercentage.toFixed(1)}%)
                      </div>
                    </div>
                  }
                  size="sm"
                  placement="top"
                  delay={0}
                  closeDelay={0}
                >
                  <span
                    className="inline-block h-full bg-[#3CEC6D] transition-all duration-200 hover:brightness-110"
                    style={{
                      width: `${passPercentage}%`,
                      marginRight: pass > 0 ? "2px" : "0",
                    }}
                  />
                </Tooltip>
              )}
              {fail > 0 && (
                <Tooltip
                  content={
                    <div className="px-1 py-0.5">
                      <div className="text-xs font-medium">Fail</div>
                      <div className="text-tiny text-default-400">
                        {fail} ({failPercentage.toFixed(1)}%)
                      </div>
                    </div>
                  }
                  size="sm"
                  placement="top"
                  delay={0}
                  closeDelay={0}
                >
                  <span
                    className="inline-block h-full bg-[#FB718F] transition-all duration-200 hover:brightness-110"
                    style={{
                      width: `${failPercentage}%`,
                      marginRight: manual > 0 ? "2px" : "0",
                    }}
                  />
                </Tooltip>
              )}
              {manual > 0 && (
                <Tooltip
                  content={
                    <div className="px-1 py-0.5">
                      <div className="text-xs font-medium">Manual</div>
                      <div className="text-tiny text-default-400">
                        {manual} ({manualPercentage.toFixed(1)}%)
                      </div>
                    </div>
                  }
                  size="sm"
                  placement="top"
                  delay={0}
                  closeDelay={0}
                >
                  <span
                    className="inline-block h-full bg-[#868994] transition-all duration-200 hover:brightness-110"
                    style={{ width: `${manualPercentage}%` }}
                  />
                </Tooltip>
              )}
            </div>
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>

        <Tooltip
          content={
            <div className="px-1 py-0.5">
              <div className="text-xs font-medium">Total requirements</div>
              <div className="text-tiny text-default-400">{total}</div>
            </div>
          }
          size="sm"
          placement="top"
        >
          <div className="text-default-600 min-w-[32px] text-center text-xs font-medium">
            {total > 0 ? total : "—"}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: chart-skeletons.tsx]---
Location: prowler-master/ui/components/compliance/compliance-charts/chart-skeletons.tsx

```typescript
import { Card, CardContent, CardHeader, Skeleton } from "@/components/shadcn";

export function RequirementsStatusCardSkeleton() {
  return (
    <Card
      variant="base"
      className="flex min-h-[372px] min-w-[328px] flex-col justify-between md:max-w-[312px]"
    >
      <CardHeader>
        <Skeleton className="h-7 w-[260px] rounded-xl" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        {/* Circular skeleton for donut chart */}
        <div className="mx-auto h-[172px] w-[172px]">
          <Skeleton className="size-[172px] rounded-full" />
        </div>

        {/* Bottom info box skeleton - inner card with horizontal items */}
        <Skeleton className="h-[97px] w-full shrink-0 rounded-xl" />
      </CardContent>
    </Card>
  );
}

export function TopFailedSectionsCardSkeleton() {
  return (
    <Card
      variant="base"
      className="flex min-h-[372px] min-w-[328px] flex-1 flex-col"
    >
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-[22px] flex-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SectionsFailureRateCardSkeleton() {
  return (
    <Card variant="base" className="flex min-h-[372px] min-w-[328px] flex-col">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center p-6">
        <div className="grid h-full w-full grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-full w-full rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: heatmap-chart.tsx]---
Location: prowler-master/ui/components/compliance/compliance-charts/heatmap-chart.tsx
Signals: React

```typescript
"use client";

import { cn } from "@heroui/theme";
import { useTheme } from "next-themes";
import { useState } from "react";

import { CategoryData } from "@/types/compliance";

interface HeatmapChartProps {
  categories?: CategoryData[];
}

const getHeatmapColor = (percentage: number): string => {
  if (percentage === 0) return "#3CEC6D";
  if (percentage <= 25) return "#fcd34d";
  if (percentage <= 50) return "#FA7315";
  if (percentage <= 100) return "#F31260";
  return "#F31260";
};
const capitalizeFirstLetter = (text: string): string => {
  const lowerText = text.toLowerCase();
  const firstLetterIndex = lowerText.search(/[a-zA-Z]/);
  if (firstLetterIndex === -1) return text; // No letters found

  return (
    lowerText.slice(0, firstLetterIndex) +
    lowerText.charAt(firstLetterIndex).toUpperCase() +
    lowerText.slice(firstLetterIndex + 1)
  );
};

export const HeatmapChart = ({ categories = [] }: HeatmapChartProps) => {
  const { theme } = useTheme();
  const [hoveredItem, setHoveredItem] = useState<CategoryData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Use categories data and prepare it
  const heatmapData = categories
    .filter((item) => item.totalRequirements > 0)
    .sort((a, b) => b.failurePercentage - a.failurePercentage)
    .slice(0, 9); // Exactly 9 items for 3x3 grid

  // Check if there are no items with data
  if (!categories.length || heatmapData.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex h-[250px] w-full items-center justify-center">
          <p className="text-sm text-slate-400">No category data available</p>
        </div>
      </div>
    );
  }

  const handleMouseEnter = (item: CategoryData, event: React.MouseEvent) => {
    setHoveredItem(item);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="h-full w-full p-2">
        <div
          className={cn(
            "grid h-full w-full gap-1",
            heatmapData.length < 3 ? "grid-cols-1" : "grid-cols-3",
          )}
          style={{
            gridTemplateRows:
              heatmapData.length < 3
                ? `repeat(${heatmapData.length}, ${heatmapData.length}fr)`
                : `repeat(${Math.min(Math.ceil(heatmapData.length / 3), 3)}, 1fr)`,
          }}
        >
          {heatmapData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-center rounded border p-1"
              style={{
                backgroundColor: getHeatmapColor(item.failurePercentage),
                borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
              }}
              onMouseEnter={(e) => handleMouseEnter(item, e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="w-full px-1 text-center antialiased">
                <div
                  className="truncate text-xs font-semibold"
                  style={{
                    color: theme === "dark" ? "#ffffff" : "#000000",
                  }}
                  title={capitalizeFirstLetter(item.name)}
                >
                  {capitalizeFirstLetter(item.name)}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: theme === "dark" ? "#ffffff" : "#000000",
                  }}
                >
                  {item.failurePercentage}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Tooltip */}
        {hoveredItem && (
          <div
            className="pointer-events-none fixed z-50 rounded border px-3 py-2 text-xs shadow-lg"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
              backgroundColor: theme === "dark" ? "#1e293b" : "white",
              borderColor: theme === "dark" ? "#475569" : "rgba(0, 0, 0, 0.1)",
              color: theme === "dark" ? "white" : "black",
            }}
          >
            <div
              className="mb-1 font-semibold"
              style={{ color: theme === "dark" ? "white" : "black" }}
            >
              {capitalizeFirstLetter(hoveredItem.name)}
            </div>
            <div>
              <span
                style={{
                  color: getHeatmapColor(hoveredItem.failurePercentage),
                }}
              >
                Failure Rate: {hoveredItem.failurePercentage}%
              </span>
            </div>
            <div>
              <span
                style={{
                  color: getHeatmapColor(hoveredItem.failurePercentage),
                }}
              >
                Failed: {hoveredItem.failedRequirements}/
                {hoveredItem.totalRequirements}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: requirements-status-card.tsx]---
Location: prowler-master/ui/components/compliance/compliance-charts/requirements-status-card.tsx

```typescript
"use client";

import { ShieldCheck, TriangleAlert, User } from "lucide-react";

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
import { calculatePercentage } from "@/lib/utils";

interface RequirementsStatusCardProps {
  pass: number;
  fail: number;
  manual: number;
}

export function RequirementsStatusCard({
  pass,
  fail,
  manual,
}: RequirementsStatusCardProps) {
  const total = pass + fail + manual;

  const passPercentage = calculatePercentage(pass, total);
  const failPercentage = calculatePercentage(fail, total);
  const manualPercentage = calculatePercentage(manual, total);

  const donutData: DonutDataPoint[] = [
    {
      name: "Pass",
      value: pass,
      color: "var(--bg-pass-primary)",
      percentage: Number(passPercentage),
    },
    {
      name: "Fail",
      value: fail,
      color: "var(--bg-fail-primary)",
      percentage: Number(failPercentage),
    },
    {
      name: "Manual",
      value: manual,
      color: "var(--color-bg-data-muted)",
      percentage: Number(manualPercentage),
    },
  ];

  return (
    <Card
      variant="base"
      className="flex min-h-[372px] flex-col justify-between"
    >
      <CardHeader>
        <CardTitle>Requirements Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        <div className="mx-auto h-[172px] w-[172px]">
          <DonutChart
            data={donutData}
            showLegend={false}
            innerRadius={66}
            outerRadius={86}
            centerLabel={{
              value: total.toLocaleString(),
              label: "Total",
            }}
          />
        </div>

        <Card
          variant="inner"
          className="flex w-full flex-col items-center justify-around md:flex-row"
        >
          <ResourceStatsCard
            containerless
            badge={{
              icon: ShieldCheck,
              count: pass,
              variant: CardVariant.pass,
            }}
            label="Pass"
            emptyState={
              pass === 0 ? { message: "No passed requirements" } : undefined
            }
            className="w-full"
          />

          <ResourceStatsCard
            containerless
            badge={{
              icon: TriangleAlert,
              count: fail,
              variant: CardVariant.fail,
            }}
            label="Fail"
            emptyState={
              fail === 0 ? { message: "No failed requirements" } : undefined
            }
            className="w-full"
          />

          <ResourceStatsCard
            containerless
            badge={{
              icon: User,
              count: manual,
              variant: CardVariant.default,
            }}
            label="Manual"
            emptyState={
              manual === 0 ? { message: "No manual requirements" } : undefined
            }
            className="w-full"
          />
        </Card>
      </CardContent>
    </Card>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: sections-failure-rate-card.tsx]---
Location: prowler-master/ui/components/compliance/compliance-charts/sections-failure-rate-card.tsx

```typescript
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";
import { CategoryData } from "@/types/compliance";

import { HeatmapChart } from "./heatmap-chart";

interface SectionsFailureRateCardProps {
  categories: CategoryData[];
}

export function SectionsFailureRateCard({
  categories,
}: SectionsFailureRateCardProps) {
  return (
    <Card variant="base" className="flex min-h-[372px] min-w-[328px] flex-col">
      <CardHeader>
        <CardTitle>Sections Failure Rate</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-start">
        <HeatmapChart categories={categories} />
      </CardContent>
    </Card>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: top-failed-sections-card.tsx]---
Location: prowler-master/ui/components/compliance/compliance-charts/top-failed-sections-card.tsx

```typescript
"use client";

import { HorizontalBarChart } from "@/components/graphs/horizontal-bar-chart";
import { BarDataPoint } from "@/components/graphs/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";
import {
  FailedSection,
  TOP_FAILED_DATA_TYPE,
  TopFailedDataType,
} from "@/types/compliance";

interface TopFailedSectionsCardProps {
  sections: FailedSection[];
  dataType?: TopFailedDataType;
}

export function TopFailedSectionsCard({
  sections,
  dataType = TOP_FAILED_DATA_TYPE.SECTIONS,
}: TopFailedSectionsCardProps) {
  // Transform FailedSection[] to BarDataPoint[]
  const total = sections.reduce((sum, section) => sum + section.total, 0);

  const barData: BarDataPoint[] = sections.map((section) => ({
    name: section.name,
    value: section.total,
    percentage: total > 0 ? Math.round((section.total / total) * 100) : 0,
    color: "var(--bg-fail-primary)",
  }));

  const title =
    dataType === TOP_FAILED_DATA_TYPE.REQUIREMENTS
      ? "Top Failed Requirements"
      : "Top Failed Sections";

  return (
    <Card
      variant="base"
      className="flex min-h-[372px] w-full flex-col sm:min-w-[500px]"
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-start">
        <HorizontalBarChart data={barData} />
      </CardContent>
    </Card>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: aws-well-architected-details.tsx]---
Location: prowler-master/ui/components/compliance/compliance-custom-details/aws-well-architected-details.tsx

```typescript
import { CustomLink } from "@/components/ui/custom/custom-link";
import { SeverityBadge } from "@/components/ui/table";
import { Requirement } from "@/types/compliance";

import {
  ComplianceBadge,
  ComplianceBadgeContainer,
  ComplianceDetailContainer,
  ComplianceDetailSection,
  ComplianceDetailText,
} from "./shared-components";

export const AWSWellArchitectedCustomDetails = ({
  requirement,
}: {
  requirement: Requirement;
}) => {
  return (
    <ComplianceDetailContainer>
      {requirement.description && (
        <ComplianceDetailSection title="Description">
          <ComplianceDetailText>{requirement.description}</ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      {requirement.well_architected_name && (
        <ComplianceDetailSection title="Best Practice">
          <ComplianceDetailText>
            {requirement.well_architected_name as string}
          </ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      <ComplianceBadgeContainer>
        {requirement.level_of_risk && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">
              Risk Level:
            </span>
            <SeverityBadge
              severity={
                requirement.level_of_risk.toString().toLowerCase() as
                  | "low"
                  | "medium"
                  | "high"
              }
            />
          </div>
        )}

        {requirement.well_architected_question_id && (
          <ComplianceBadge
            label="Question ID"
            value={requirement.well_architected_question_id as string}
            color="indigo"
          />
        )}

        {requirement.well_architected_practice_id && (
          <ComplianceBadge
            label="Practice ID"
            value={requirement.well_architected_practice_id as string}
            color="indigo"
          />
        )}

        {requirement.assessment_method && (
          <ComplianceBadge
            label="Assessment"
            value={requirement.assessment_method as string}
            color="blue"
          />
        )}
      </ComplianceBadgeContainer>

      {requirement.implementation_guidance_url && (
        <ComplianceDetailSection title="Implementation Guidance">
          <CustomLink href={requirement.implementation_guidance_url as string}>
            {requirement.implementation_guidance_url as string}
          </CustomLink>
        </ComplianceDetailSection>
      )}
    </ComplianceDetailContainer>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: c5-details.tsx]---
Location: prowler-master/ui/components/compliance/compliance-custom-details/c5-details.tsx

```typescript
import { Requirement } from "@/types/compliance";

import {
  ComplianceDetailContainer,
  ComplianceDetailSection,
  ComplianceDetailText,
} from "./shared-components";

export const C5CustomDetails = ({
  requirement,
}: {
  requirement: Requirement;
}) => {
  const sections = [
    {
      title: "Description",
      content: requirement.description,
    },
    {
      title: "About Criteria",
      content: requirement.about_criteria as string | undefined,
    },
    {
      title: "Complementary Criteria",
      content: requirement.complementary_criteria as string | undefined,
    },
  ].filter((section) => section.content);

  return (
    <ComplianceDetailContainer>
      {sections.map((section) => (
        <ComplianceDetailSection key={section.title} title={section.title}>
          <ComplianceDetailText>{section.content}</ComplianceDetailText>
        </ComplianceDetailSection>
      ))}
    </ComplianceDetailContainer>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ccc-details.tsx]---
Location: prowler-master/ui/components/compliance/compliance-custom-details/ccc-details.tsx

```typescript
import { cn } from "@/lib";
import { CCC_MAPPING_SECTIONS, CCC_TEXT_SECTIONS } from "@/lib/compliance/ccc";
import { Requirement } from "@/types/compliance";

import {
  ComplianceBadge,
  ComplianceBadgeContainer,
  ComplianceChipContainer,
  ComplianceDetailContainer,
  ComplianceDetailSection,
  ComplianceDetailText,
} from "./shared-components";

interface CCCDetailsProps {
  requirement: Requirement;
}

export const CCCCustomDetails = ({ requirement }: CCCDetailsProps) => {
  // Map text sections with requirement data
  const textSections = CCC_TEXT_SECTIONS.map((section) => ({
    ...section,
    content: requirement[section.key] as string | undefined,
  })).filter((section) => section.content);

  // Map mapping sections with requirement data
  const mappingSections = CCC_MAPPING_SECTIONS.map((section) => ({
    ...section,
    data: requirement[section.key] as Array<{
      ReferenceId: string;
      Identifiers: string[];
    }>,
  })).filter((section) => section.data);

  return (
    <ComplianceDetailContainer>
      {textSections.map((section) => (
        <ComplianceDetailSection key={section.title} title={section.title}>
          <ComplianceDetailText className={section.className}>
            {section.content}
          </ComplianceDetailText>
        </ComplianceDetailSection>
      ))}

      {requirement.family_name && (
        <ComplianceBadgeContainer>
          <ComplianceBadge
            label="Family"
            value={requirement.family_name as string}
            color="purple"
          />
        </ComplianceBadgeContainer>
      )}

      {requirement.applicability && (
        <ComplianceChipContainer
          title="Applicability"
          items={requirement.applicability as string[]}
        />
      )}

      {mappingSections.map((section) => (
        <ComplianceDetailSection key={section.title} title={section.title}>
          <div className="flex flex-col gap-3">
            {section.data.map((mapping, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs font-medium">
                  {mapping.ReferenceId}
                </span>
                <div className="flex flex-wrap gap-2">
                  {mapping.Identifiers.map((identifier, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        section.colorClasses,
                      )}
                    >
                      {identifier}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ComplianceDetailSection>
      ))}
    </ComplianceDetailContainer>
  );
};
```

--------------------------------------------------------------------------------

````
