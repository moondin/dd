---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 842
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 842 of 867)

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

---[FILE: submenu-item.tsx]---
Location: prowler-master/ui/components/ui/sidebar/submenu-item.tsx
Signals: React, Next.js

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent } from "react";

import { Button } from "@/components/shadcn/button/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { IconComponent } from "@/types";

interface SubmenuItemProps {
  href: string;
  label: string;
  icon: IconComponent;
  active?: boolean;
  target?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export const SubmenuItem = ({
  href,
  label,
  icon: Icon,
  active,
  target,
  disabled,
  onClick,
}: SubmenuItemProps) => {
  const pathname = usePathname();
  const isActive = active !== undefined ? active : pathname === href;

  // Special case: Mutelist with tooltip when disabled
  if (disabled && label === "Mutelist") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="pointer-events-none mt-1 w-[calc(100%-12px)] cursor-not-allowed justify-start py-1"
            disabled
          >
            <span className="mr-2">
              <Icon size={16} />
            </span>
            <p className="max-w-[170px] truncate">{label}</p>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          The mutelist will be enabled after adding a provider
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button
      variant={isActive ? "menu-active" : "menu-inactive"}
      className="mt-1 w-[calc(100%-12px)] justify-start py-1"
      asChild={!disabled}
      disabled={disabled}
    >
      <Link
        href={href}
        target={target}
        className="flex items-center"
        onClick={onClick}
      >
        <span className="mr-2">
          <Icon size={16} />
        </span>
        <p className="max-w-[170px] truncate">{label}</p>
      </Link>
    </Button>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: skeleton.tsx]---
Location: prowler-master/ui/components/ui/skeleton/skeleton.tsx

```typescript
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "card" | "table" | "text" | "circle" | "rectangular";
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function Skeleton({
  className,
  variant = "default",
  width,
  height,
  animate = true,
}: SkeletonProps) {
  const variantClasses = {
    default: "w-full h-4 rounded-lg",
    card: "w-full h-40 rounded-xl",
    table: "w-full h-60 rounded-lg",
    text: "w-24 h-4 rounded-full",
    circle: "rounded-full w-8 h-8",
    rectangular: "rounded-md",
  };

  return (
    <div
      style={{
        width: width
          ? typeof width === "number"
            ? `${width}px`
            : width
          : undefined,
        height: height
          ? typeof height === "number"
            ? `${height}px`
            : height
          : undefined,
      }}
      className={cn(
        "dark:bg-prowler-blue-800 animate-pulse bg-gray-200",
        variantClasses[variant],
        !animate && "animate-none",
        className,
      )}
    />
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
  roundedCells = true,
}: {
  rows?: number;
  columns?: number;
  className?: string;
  roundedCells?: boolean;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-4 pb-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={`header-${index}`}
            className={cn("h-8", roundedCells && "rounded-lg")}
            width={`${100 / columns}%`}
            variant={roundedCells ? "default" : "rectangular"}
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex items-center gap-4 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className={cn("h-6", roundedCells && "rounded-lg")}
              width={`${100 / columns}%`}
              variant={roundedCells ? "default" : "rectangular"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Skeleton variant="card" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function SkeletonText({
  lines = 3,
  className,
  lastLineWidth = "w-1/2",
}: {
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines - 1 }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" variant="text" />
      ))}
      <Skeleton className={cn("h-4", lastLineWidth)} variant="text" />
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: data-table-column-header.tsx]---
Location: prowler-master/ui/components/ui/table/data-table-column-header.tsx
Signals: React, Next.js

```typescript
"use client";

import { Column } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HTMLAttributes } from "react";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsLeftRightIcon,
} from "@/components/icons";
import { Button } from "@/components/shadcn";

interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  param?: string;
}

export const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
  param,
}: DataTableColumnHeaderProps<TData, TValue>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getToggleSortingHandler = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const currentSortParam = currentParams.get("sort");
    let newSortParam = "";

    if (currentSortParam === `${param}`) {
      // If already sorting ascending, switch to descending
      newSortParam = `-${param}`;
    } else if (currentSortParam === `-${param}`) {
      // If already sorting descending, remove sorting
      newSortParam = "";
    } else {
      // Sort ascending for the first time or switch to a different column
      newSortParam = `${param}`;
    }

    // Update or remove the sort parameter
    if (newSortParam) {
      currentParams.set("sort", newSortParam);
    } else {
      currentParams.delete("sort");
    }

    // Construct the new URL with all parameters
    const newUrl = `${pathname}?${currentParams.toString()}`;

    router.push(newUrl, {
      scroll: false,
    });
  };

  const renderSortIcon = () => {
    const currentSortParam = searchParams.get("sort");
    if (
      !currentSortParam ||
      currentSortParam === "" ||
      (currentSortParam !== param && currentSortParam !== `-${param}`)
    ) {
      return <ChevronsLeftRightIcon size={14} className="ml-2 rotate-90" />;
    }
    return currentSortParam === `-${param}` ? (
      <ArrowDownIcon size={12} className="ml-2" />
    ) : (
      <ArrowUpIcon size={12} className="ml-2" />
    );
  };

  if (!column.getCanSort()) {
    return (
      <div className="text-text-neutral-primary flex items-center justify-between px-0 text-left align-middle text-sm font-semibold whitespace-nowrap outline-none">
        <span className="block break-normal whitespace-nowrap">{title}</span>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-text-neutral-primary hover:text-text-neutral-tertiary -ml-3 flex items-center justify-between px-0 text-left align-middle text-sm font-semibold whitespace-nowrap outline-none hover:bg-transparent"
      onClick={getToggleSortingHandler}
    >
      <span className="block break-normal whitespace-nowrap">{title}</span>
      {renderSortIcon()}
    </Button>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: data-table-filter-custom.tsx]---
Location: prowler-master/ui/components/ui/table/data-table-filter-custom.tsx
Signals: Next.js, TypeORM

```typescript
"use client";

import { useSearchParams } from "next/navigation";

import { ComplianceScanInfo } from "@/components/compliance/compliance-header/compliance-scan-info";
import { ActiveFilterBadges } from "@/components/filters/active-filter-badge";
import { ClearFiltersButton } from "@/components/filters/clear-filters-button";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectSelectAll,
  MultiSelectSeparator,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/shadcn/select/multiselect";
import { EntityInfo } from "@/components/ui/entities/entity-info";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { isConnectionStatus, isScanEntity } from "@/lib/helper-filters";
import {
  FilterEntity,
  FilterOption,
  ProviderEntity,
  ScanEntity,
} from "@/types";
import { ProviderConnectionStatus } from "@/types/providers";

export interface DataTableFilterCustomProps {
  filters: FilterOption[];
}

export const DataTableFilterCustom = ({
  filters,
}: DataTableFilterCustomProps) => {
  const { updateFilter } = useUrlFilters();
  const searchParams = useSearchParams();

  // Helper function to get entity from valueLabelMapping
  const getEntityForValue = (
    filter: FilterOption,
    value: string,
  ): FilterEntity | undefined => {
    if (!filter.valueLabelMapping) return undefined;
    const entry = filter.valueLabelMapping.find((mapping) => mapping[value]);
    return entry ? entry[value] : undefined;
  };

  // Helper function to get badge label from entity
  const getBadgeLabel = (
    entity: FilterEntity | undefined,
    value: string,
  ): string => {
    if (!entity) return value;

    if (isScanEntity(entity as ScanEntity)) {
      const scanEntity = entity as ScanEntity;
      return (
        scanEntity.providerInfo?.alias || scanEntity.providerInfo?.uid || value
      );
    }
    if (isConnectionStatus(entity)) {
      const connectionStatus = entity as ProviderConnectionStatus;
      return connectionStatus.label;
    }
    // Provider entity
    const providerEntity = entity as ProviderEntity;
    return providerEntity.alias || providerEntity.uid || value;
  };

  // Render custom content for entity (scan, provider, or connection status)
  const renderEntityContent = (entity: FilterEntity) => {
    if (isScanEntity(entity as ScanEntity)) {
      return <ComplianceScanInfo scan={entity as ScanEntity} />;
    }
    if (isConnectionStatus(entity)) {
      const connectionStatus = entity as ProviderConnectionStatus;
      return <span>{connectionStatus.label}</span>;
    }
    // Provider entity
    const providerEntity = entity as ProviderEntity;
    return (
      <EntityInfo
        cloudProvider={providerEntity.provider}
        entityAlias={providerEntity.alias ?? undefined}
        entityId={providerEntity.uid}
        showCopyAction={false}
      />
    );
  };

  // Sort filters by index property, with fallback to original order for filters without index
  const sortedFilters = () => {
    return [...filters].sort((a, b) => {
      // If both have index, sort by index
      if (a.index !== undefined && b.index !== undefined) {
        return a.index - b.index;
      }
      // If only one has index, prioritize the one with index
      if (a.index !== undefined) return -1;
      if (b.index !== undefined) return 1;
      // If neither has index, maintain original order
      return 0;
    });
  };

  const pushDropdownFilter = (filter: FilterOption, values: string[]) => {
    // If this filter defaults to "all selected" and the user selected all items,
    // clear the URL param to represent "no specific filter" (i.e., all).
    const allSelected =
      filter.values.length > 0 && values.length === filter.values.length;

    if (filter.defaultToSelectAll && allSelected) {
      updateFilter(filter.key, null);
      return;
    }

    updateFilter(filter.key, values.length > 0 ? values : null);
  };

  const getSelectedValues = (filter: FilterOption): string[] => {
    const filterKey = filter.key.startsWith("filter[")
      ? filter.key
      : `filter[${filter.key}]`;
    const paramValue = searchParams.get(filterKey);

    // If defaultToSelectAll is true and no filter param exists,
    // treat it as "all selected" by returning all values
    if (!paramValue && filter.defaultToSelectAll) {
      return filter.values;
    }

    return paramValue ? paramValue.split(",") : [];
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {sortedFilters().map((filter) => {
        const selectedValues = getSelectedValues(filter);

        return (
          <MultiSelect
            key={filter.key}
            values={selectedValues}
            onValuesChange={(values) => pushDropdownFilter(filter, values)}
          >
            <MultiSelectTrigger size="default">
              <MultiSelectValue placeholder={filter.labelCheckboxGroup} />
            </MultiSelectTrigger>
            <MultiSelectContent search={false}>
              <MultiSelectSelectAll>Select All</MultiSelectSelectAll>
              <MultiSelectSeparator />
              {filter.values.map((value) => {
                const entity = getEntityForValue(filter, value);
                const displayLabel = filter.labelFormatter
                  ? filter.labelFormatter(value)
                  : value;
                return (
                  <MultiSelectItem
                    key={value}
                    value={value}
                    badgeLabel={getBadgeLabel(entity, displayLabel)}
                  >
                    {entity ? renderEntityContent(entity) : displayLabel}
                  </MultiSelectItem>
                );
              })}
            </MultiSelectContent>
          </MultiSelect>
        );
      })}
      <div className="flex items-center justify-start gap-2">
        <ActiveFilterBadges />
        <ClearFiltersButton />
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: data-table-pagination.tsx]---
Location: prowler-master/ui/components/ui/table/data-table-pagination.tsx
Signals: React, Next.js

```typescript
"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select/select";
import { getPaginationInfo } from "@/lib";
import { MetaDataProps } from "@/types";

interface DataTablePaginationProps {
  metadata?: MetaDataProps;
  disableScroll?: boolean;
}

const baseLinkClass =
  "relative block rounded border-0 bg-transparent px-3 py-1.5 text-button-primary outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none";

const disabledLinkClass =
  "text-gray-300 dark:text-gray-600 hover:bg-transparent hover:text-gray-300 dark:hover:text-gray-600 cursor-default pointer-events-none";

export function DataTablePagination({
  metadata,
  disableScroll = false,
}: DataTablePaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPageSize = searchParams.get("pageSize") ?? "10";

  const [selectedPageSize, setSelectedPageSize] = useState(initialPageSize);

  if (!metadata) return null;

  const { currentPage, totalPages, totalEntries, itemsPerPageOptions } =
    getPaginationInfo(metadata);

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);

    // Preserve all important parameters
    const scanId = searchParams.get("scanId");
    const id = searchParams.get("id");
    const version = searchParams.get("version");

    if (+pageNumber > totalPages) {
      return `${pathname}?${params.toString()}`;
    }

    params.set("page", pageNumber.toString());

    // Ensure that scanId, id and version are preserved
    if (scanId) params.set("scanId", scanId);
    if (id) params.set("id", id);
    if (version) params.set("version", version);

    return `${pathname}?${params.toString()}`;
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
      <div className="text-sm whitespace-nowrap">
        {totalEntries} entries in total
      </div>
      {totalEntries > 10 && (
        <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium whitespace-nowrap">
              Rows per page
            </p>
            <Select
              value={selectedPageSize}
              onValueChange={(value) => {
                setSelectedPageSize(value);

                const params = new URLSearchParams(searchParams);

                // Preserve all important parameters
                const scanId = searchParams.get("scanId");
                const id = searchParams.get("id");
                const version = searchParams.get("version");

                params.set("pageSize", value);
                params.set("page", "1");

                // Ensure that scanId, id and version are preserved
                if (scanId) params.set("scanId", scanId);
                if (id) params.set("id", id);
                if (version) params.set("version", version);

                // This pushes the URL without reloading the page
                if (disableScroll) {
                  const url = `${pathname}?${params.toString()}`;
                  router.push(url, { scroll: false });
                } else {
                  router.push(`${pathname}?${params.toString()}`);
                }
              }}
            >
              <SelectTrigger className="h-8 w-[6rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {itemsPerPageOptions.map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={`${pageSize}`}
                    className="cursor-pointer"
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Link
              aria-label="Go to first page"
              className={`${baseLinkClass} ${isFirstPage ? disabledLinkClass : ""}`}
              href={
                isFirstPage
                  ? pathname + "?" + searchParams.toString()
                  : createPageUrl(1)
              }
              scroll={!disableScroll}
              aria-disabled={isFirstPage}
              onClick={(e) => isFirstPage && e.preventDefault()}
            >
              <DoubleArrowLeftIcon className="size-4" aria-hidden="true" />
            </Link>
            <Link
              aria-label="Go to previous page"
              className={`${baseLinkClass} ${isFirstPage ? disabledLinkClass : ""}`}
              href={
                isFirstPage
                  ? pathname + "?" + searchParams.toString()
                  : createPageUrl(currentPage - 1)
              }
              scroll={!disableScroll}
              aria-disabled={isFirstPage}
              onClick={(e) => isFirstPage && e.preventDefault()}
            >
              <ChevronLeftIcon className="size-4" aria-hidden="true" />
            </Link>
            <Link
              aria-label="Go to next page"
              className={`${baseLinkClass} ${isLastPage ? disabledLinkClass : ""}`}
              href={
                isLastPage
                  ? pathname + "?" + searchParams.toString()
                  : createPageUrl(currentPage + 1)
              }
              scroll={!disableScroll}
              aria-disabled={isLastPage}
              onClick={(e) => isLastPage && e.preventDefault()}
            >
              <ChevronRightIcon className="size-4" aria-hidden="true" />
            </Link>
            <Link
              aria-label="Go to last page"
              className={`${baseLinkClass} ${isLastPage ? disabledLinkClass : ""}`}
              href={
                isLastPage
                  ? pathname + "?" + searchParams.toString()
                  : createPageUrl(totalPages)
              }
              scroll={!disableScroll}
              aria-disabled={isLastPage}
              onClick={(e) => isLastPage && e.preventDefault()}
            >
              <DoubleArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: data-table.tsx]---
Location: prowler-master/ui/components/ui/table/data-table.tsx
Signals: React

```typescript
"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/table/data-table-pagination";
import { FilterOption, MetaDataProps } from "@/types";

interface DataTableProviderProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  metadata?: MetaDataProps;
  customFilters?: FilterOption[];
  disableScroll?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  metadata,
  disableScroll = false,
}: DataTableProviderProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <div className="minimal-scrollbar rounded-large shadow-small border-border-neutral-secondary bg-bg-neutral-secondary relative z-0 flex w-full flex-col justify-between gap-4 overflow-auto border p-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {metadata && (
        <div className="flex w-full items-center gap-2 py-4">
          <DataTablePagination
            metadata={metadata}
            disableScroll={disableScroll}
          />
        </div>
      )}
    </>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/ui/table/index.ts

```typescript
export * from "./data-table";
export * from "./data-table-column-header";
export * from "./data-table-filter-custom";
export * from "./data-table-pagination";
export * from "./severity-badge";
export * from "./status-badge";
export * from "./status-finding-badge";
export * from "./table";
```

--------------------------------------------------------------------------------

---[FILE: severity-badge.tsx]---
Location: prowler-master/ui/components/ui/table/severity-badge.tsx
Signals: React

```typescript
import { Chip } from "@heroui/chip";
import clsx from "clsx";
import React from "react";

import { AlertIcon } from "@/components/icons";

type Severity = "informational" | "low" | "medium" | "high" | "critical";

const severityIconMap = {
  critical: <AlertIcon size={14} className="mr-1" />,
} as const;

const getSeverityColor = (
  severity: Severity,
): "danger" | "warning" | "default" => {
  switch (severity) {
    case "critical":
      return "danger";
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
      return "default";
    default:
      return "default"; // this is a fallback, though unnecessary due to typing
  }
};

const getSeverityIcon = (severity: Severity): React.ReactNode | null => {
  return severity === "critical" ? severityIconMap.critical : null;
};

export const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const color = getSeverityColor(severity);

  return (
    <Chip
      className={clsx("text-default-600 gap-1 border-none capitalize", {
        "bg-system-severity-critical text-white dark:text-white":
          severity === "critical",
      })}
      size="sm"
      variant="flat"
      color={color}
      endContent={getSeverityIcon(severity)}
    >
      <span className="text-text-neutral-primary text-xs font-light tracking-wide">
        {severity}
      </span>
    </Chip>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: status-badge.tsx]---
Location: prowler-master/ui/components/ui/table/status-badge.tsx

```typescript
import { Chip } from "@heroui/chip";

import { SpinnerIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type Status =
  | "available"
  | "queued"
  | "scheduled"
  | "executing"
  | "completed"
  | "failed"
  | "cancelled";

const statusDisplayMap: Record<Status, string> = {
  available: "Queued",
  queued: "Queued",
  scheduled: "scheduled",
  executing: "executing",
  completed: "completed",
  failed: "failed",
  cancelled: "cancelled",
};

const statusColorMap: Record<
  Status,
  "danger" | "warning" | "success" | "default"
> = {
  available: "default",
  queued: "default",
  scheduled: "warning",
  executing: "default",
  completed: "success",
  failed: "danger",
  cancelled: "danger",
};

export const StatusBadge = ({
  status,
  size = "sm",
  loadingProgress,
  className,
  ...props
}: {
  status: Status;
  size?: "sm" | "md" | "lg";
  loadingProgress?: number;
  className?: string;
}) => {
  const color = statusColorMap[status as keyof typeof statusColorMap];

  return (
    <Chip
      className={cn(
        "text-default-600 relative w-full max-w-full border-none text-xs capitalize",
        status === "executing" && "border border-solid border-transparent",
        className,
      )}
      size={size}
      variant="flat"
      color={color}
      {...props}
    >
      {status === "executing" ? (
        <div className="relative flex items-center justify-center gap-1">
          <SpinnerIcon size={16} className="text-default-500 animate-spin" />
          <span className="text-default-500 pointer-events-none text-[0.6rem]">
            {loadingProgress}%
          </span>
          <span>executing</span>
        </div>
      ) : (
        <span className="flex items-center justify-center">
          {statusDisplayMap[status as keyof typeof statusDisplayMap] || status}
        </span>
      )}
    </Chip>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: status-finding-badge.tsx]---
Location: prowler-master/ui/components/ui/table/status-finding-badge.tsx
Signals: React

```typescript
import { Chip } from "@heroui/chip";
import React from "react";

export type FindingStatus = "FAIL" | "PASS" | "MANUAL" | "MUTED";

const statusColorMap: Record<
  FindingStatus,
  "danger" | "warning" | "success" | "default"
> = {
  FAIL: "danger",
  PASS: "success",
  MANUAL: "warning",
  MUTED: "default",
};

export const StatusFindingBadge = ({
  status,
  size = "sm",
  value,
  ...props
}: {
  status: FindingStatus;
  size?: "sm" | "md" | "lg";
  value?: string | number;
}) => {
  const color = statusColorMap[status];

  return (
    <Chip
      className="border-none px-2 py-0"
      size={size}
      variant="flat"
      color={color}
      {...props}
    >
      <span className="text-default-600 text-xs font-light tracking-wide">
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        {value !== undefined && `: ${value}`}
      </span>
    </Chip>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: table.tsx]---
Location: prowler-master/ui/components/ui/table/table.tsx
Signals: React

```typescript
import { cn } from "@heroui/theme";
import * as React from "react";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-lg">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&>tr]:first:rounded-lg", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "font-medium dark:bg-slate-800/50 [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "bg-bg-neutral-secondary text-tiny text-foreground-500 data-[hover=true]:text-foreground-400 data-[focus-visible=true]:outline-focus h-10 px-2 text-left align-middle font-semibold whitespace-nowrap outline-none first:rounded-l-lg last:rounded-r-lg data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-offset-2 rtl:text-right rtl:first:rounded-l-[unset] rtl:first:rounded-r-lg rtl:last:rounded-l-lg rtl:last:rounded-r-[unset] dark:text-slate-400 [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-2 py-2.5 align-middle [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-2 text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/ui/toast/index.ts

```typescript
export * from "./Toast";
export * from "./Toaster";
export * from "./use-toast";
```

--------------------------------------------------------------------------------

---[FILE: Toast.tsx]---
Location: prowler-master/ui/components/ui/toast/Toast.tsx
Signals: React

```typescript
"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { CrossIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-md border border-slate-200 p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full dark:border-slate-800",
  {
    variants: {
      variant: {
        default:
          "border border-border-neutral-secondary bg-bg-neutral-secondary text-text-neutral-primary",
        destructive:
          "border border-border-error bg-bg-fail-secondary text-text-neutral-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-transparent px-3 text-sm font-medium transition-colors group-[.destructive]:border-slate-100/40 hover:bg-slate-100 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-slate-50 focus:ring-1 focus:ring-slate-950 focus:outline-none group-[.destructive]:focus:ring-red-500 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800 dark:group-[.destructive]:border-slate-800/40 dark:hover:bg-slate-800 dark:group-[.destructive]:hover:border-red-900/30 dark:group-[.destructive]:hover:bg-red-900 dark:group-[.destructive]:hover:text-slate-50 dark:focus:ring-slate-300 dark:group-[.destructive]:focus:ring-red-900",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute top-1 right-1 rounded-md p-1 text-slate-950/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-slate-950 group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:ring-1 focus:outline-none group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 dark:text-slate-50/50 dark:hover:text-slate-50",
      className,
    )}
    toast-close=""
    {...props}
  >
    <CrossIcon />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("[&+div]:text-md font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-small opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  Toast,
  ToastAction,
  type ToastActionElement,
  ToastClose,
  ToastDescription,
  type ToastProps,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};
```

--------------------------------------------------------------------------------

````
