---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 792
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 792 of 867)

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

---[FILE: feeds-client.tsx]---
Location: prowler-master/ui/components/feeds/feeds-client.tsx
Signals: React, Next.js

```typescript
"use client";

import { formatDistanceToNow, parseISO } from "date-fns";
import { BellRing, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { FeedItem, ParsedFeed } from "@/actions/feeds";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Separator,
} from "@/components/shadcn";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { hasNewFeeds, markFeedsAsSeen } from "@/lib/feeds-storage";
import { cn } from "@/lib/utils";

interface FeedsClientProps {
  feedData: ParsedFeed;
  error?: string;
}

export function FeedsClient({ feedData, error }: FeedsClientProps) {
  const { items, totalCount } = feedData;
  const hasFeeds = totalCount > 0 && !error;

  // State to track if there are new unseen feeds
  const [hasUnseenFeeds, setHasUnseenFeeds] = useState(false);

  // Check for new feeds on mount
  useEffect(() => {
    if (hasFeeds) {
      const currentFeedIds = items.map((item) => item.id);
      const isNew = hasNewFeeds(currentFeedIds);
      setHasUnseenFeeds(isNew);
    }
  }, [hasFeeds, items]);

  // Mark feeds as seen when dropdown opens
  const handleOpenChange = (open: boolean) => {
    if (open && hasFeeds) {
      const currentFeedIds = items.map((item) => item.id);
      markFeedsAsSeen(currentFeedIds);
      setHasUnseenFeeds(false);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-border-input-primary-fill relative h-8 w-8 rounded-full bg-transparent p-2"
              aria-label={
                hasUnseenFeeds
                  ? "New updates available - Click to view"
                  : "Check for updates"
              }
            >
              <BellRing
                size={18}
                className={cn(
                  hasFeeds &&
                    hasUnseenFeeds &&
                    "text-button-primary animate-pulse",
                )}
              />
              {hasFeeds && hasUnseenFeeds && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="bg-button-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                  <span className="bg-button-primary relative inline-flex h-2 w-2 rounded-full"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {hasUnseenFeeds ? "New updates available" : "Latest Updates"}
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent
        align="end"
        className="w-96 gap-2 overflow-x-hidden border-slate-200 bg-white px-[18px] pt-3 pb-4 dark:border-zinc-900 dark:bg-stone-950"
      >
        <div className="pb-2">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Latest Updates
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recent releases and announcements
          </p>
        </div>

        <Separator />

        <div className="minimal-scrollbar max-h-[500px] overflow-x-hidden overflow-y-auto">
          {error && (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {!error && items.length === 0 && (
            <div className="px-3 py-8 text-center">
              <BellRing className="mx-auto mb-2 h-8 w-8 text-slate-400" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                No updates available
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Check back later for new releases
              </p>
            </div>
          )}

          {hasFeeds && (
            <div className="relative py-2">
              {items.map((item, index) => (
                <FeedTimelineItem
                  key={item.id}
                  item={item}
                  isLast={index === items.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface FeedTimelineItemProps {
  item: FeedItem;
  isLast: boolean;
}

function FeedTimelineItem({ item, isLast }: FeedTimelineItemProps) {
  const relativeTime = formatDistanceToNow(parseISO(item.pubDate), {
    addSuffix: true,
  });

  // Extract version from title if it's a GitHub release
  const versionMatch = item.title.match(/v?(\d+\.\d+\.\d+)/);
  const version = versionMatch ? versionMatch[1] : null;

  return (
    <div className="group relative flex gap-3 px-3 py-2">
      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <div className="border-button-primary bg-button-primary z-10 h-2 w-2 rounded-full border-2" />
        {!isLast && (
          <div className="h-full w-px bg-slate-200 dark:bg-slate-700" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pb-4">
        <Link
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="backdrop-blur-0 block space-y-1 rounded-[12px] border border-transparent p-2 transition-all hover:border-slate-300 hover:bg-[#F8FAFC80] hover:backdrop-blur-[46px] dark:hover:border-[rgba(38,38,38,0.70)] dark:hover:bg-[rgba(23,23,23,0.50)]"
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="group-hover:text-button-primary dark:group-hover:text-button-primary min-w-0 flex-1 text-sm leading-tight font-semibold break-words text-slate-900 dark:text-white">
              {item.title}
            </h4>
            {version && (
              <Badge
                variant="secondary"
                className="border-button-primary bg-button-primary/10 text-button-primary dark:bg-button-primary/20 shrink-0 text-[10px] font-semibold"
              >
                v{version}
              </Badge>
            )}
          </div>

          {item.description && (
            <p className="line-clamp-2 text-xs leading-relaxed break-words text-slate-600 dark:text-slate-400">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <time className="text-[11px] text-slate-500 dark:text-slate-500">
              {relativeTime}
            </time>

            <div className="text-button-primary flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[11px] font-medium">Read more</span>
              <ExternalLink size={10} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: feeds-server.tsx]---
Location: prowler-master/ui/components/feeds/feeds-server.tsx

```typescript
import { fetchFeeds } from "@/actions/feeds";

import { FeedsClient } from "./feeds-client";

interface FeedsServerProps {
  limit?: number;
}

export async function FeedsServer({ limit = 15 }: FeedsServerProps) {
  const feedData = await fetchFeeds(limit);
  return <FeedsClient feedData={feedData} />;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/feeds/index.ts

```typescript
export * from "./feeds-client";
export * from "./feeds-server";
```

--------------------------------------------------------------------------------

---[FILE: active-filter-badge.tsx]---
Location: prowler-master/ui/components/filters/active-filter-badge.tsx
Signals: Next.js

```typescript
"use client";

import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Badge } from "@/components/shadcn";
import { useUrlFilters } from "@/hooks/use-url-filters";

export interface FilterBadgeConfig {
  /**
   * The filter key without the "filter[]" wrapper.
   * Example: "scan__in", "check_id__in", "provider__in"
   */
  filterKey: string;

  /**
   * Label to display before the value.
   * Example: "Scan", "Check ID", "Provider"
   */
  label: string;

  /**
   * Optional function to format a single value for display.
   * Useful for truncating UUIDs, etc.
   * Default: shows value as-is
   */
  formatValue?: (value: string) => string;

  /**
   * Optional function to format the display when multiple values are selected.
   * Default: "{count} {label}s filtered"
   */
  formatMultiple?: (count: number, label: string) => string;
}

/**
 * Default filter badge configurations for common use cases.
 * Add new filters here to automatically show them as badges.
 */
export const DEFAULT_FILTER_BADGES: FilterBadgeConfig[] = [
  {
    filterKey: "check_id__in",
    label: "Check ID",
    formatMultiple: (count) => `${count} Check IDs filtered`,
  },
  {
    filterKey: "scan__in",
    label: "Scan",
    formatValue: (id) => `${id.slice(0, 8)}...`,
  },
];

interface ActiveFilterBadgeProps {
  config: FilterBadgeConfig;
}

/**
 * Single filter badge component that reads from URL and displays if active.
 */
const ActiveFilterBadge = ({ config }: ActiveFilterBadgeProps) => {
  const searchParams = useSearchParams();
  const { clearFilter } = useUrlFilters();

  const {
    filterKey,
    label,
    formatValue = (v) => v,
    formatMultiple = (count, lbl) => `${count} ${lbl}s filtered`,
  } = config;

  const fullKey = filterKey.startsWith("filter[")
    ? filterKey
    : `filter[${filterKey}]`;

  const filterValue = searchParams.get(fullKey);

  if (!filterValue) {
    return null;
  }

  const values = filterValue.split(",");
  const displayText =
    values.length > 1
      ? formatMultiple(values.length, label)
      : `${label}: ${formatValue(values[0])}`;

  return (
    <Badge
      variant="outline"
      className="flex cursor-pointer items-center gap-1 px-3 py-1.5"
      onClick={() => clearFilter(filterKey)}
    >
      <span className="max-w-[200px] truncate text-sm">{displayText}</span>
      <X className="size-3.5 shrink-0" />
    </Badge>
  );
};

interface ActiveFilterBadgesProps {
  /**
   * Filter configurations to render as badges.
   * Defaults to DEFAULT_FILTER_BADGES if not provided.
   */
  filters?: FilterBadgeConfig[];
}

/**
 * Renders filter badges for all configured filters that are active in the URL.
 * Only shows badges for filters that have values in the URL params.
 */
export const ActiveFilterBadges = ({
  filters = DEFAULT_FILTER_BADGES,
}: ActiveFilterBadgesProps) => {
  return (
    <>
      {filters.map((config) => (
        <ActiveFilterBadge key={config.filterKey} config={config} />
      ))}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: clear-filters-button.tsx]---
Location: prowler-master/ui/components/filters/clear-filters-button.tsx

```typescript
"use client";

import { XCircle } from "lucide-react";

import { useUrlFilters } from "@/hooks/use-url-filters";

import { Button } from "../shadcn";

export interface ClearFiltersButtonProps {
  className?: string;
  text?: string;
  ariaLabel?: string;
}

export const ClearFiltersButton = ({
  text = "Clear all filters",
  ariaLabel = "Reset",
}: ClearFiltersButtonProps) => {
  const { clearAllFilters, hasFilters } = useUrlFilters();

  if (!hasFilters()) {
    return null;
  }

  return (
    <Button aria-label={ariaLabel} onClick={clearAllFilters} variant="link">
      <XCircle className="mr-0.5 size-4" />
      {text}
    </Button>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-account-selection.tsx]---
Location: prowler-master/ui/components/filters/custom-account-selection.tsx

```typescript
"use client";
import { Select, SelectItem } from "@heroui/select";

const accounts = [
  { key: "audit-test-1", label: "740350143844" },
  { key: "audit-test-2", label: "890837126756" },
  { key: "audit-test-3", label: "563829104923" },
  { key: "audit-test-4", label: "678943217543" },
  { key: "audit-test-5", label: "932187465320" },
  { key: "audit-test-6", label: "492837106587" },
  { key: "audit-test-7", label: "812736459201" },
  { key: "audit-test-8", label: "374829106524" },
  { key: "audit-test-9", label: "926481053298" },
  { key: "audit-test-10", label: "748192364579" },
  { key: "audit-test-11", label: "501374829106" },
];
export const CustomAccountSelection = () => {
  return (
    <Select
      label="Account"
      aria-label="Select an Account"
      placeholder="Select an account"
      classNames={{
        selectorIcon: "right-2",
      }}
      selectionMode="multiple"
      className="w-full"
      size="sm"
    >
      {accounts.map((acc) => (
        <SelectItem key={acc.key}>{acc.label}</SelectItem>
      ))}
    </Select>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-checkbox-muted-findings.tsx]---
Location: prowler-master/ui/components/filters/custom-checkbox-muted-findings.tsx
Signals: React, Next.js

```typescript
"use client";

import { Checkbox } from "@heroui/checkbox";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useUrlFilters } from "@/hooks/use-url-filters";

export const CustomCheckboxMutedFindings = () => {
  const { updateFilter, clearFilter } = useUrlFilters();
  const searchParams = useSearchParams();
  const [excludeMuted, setExcludeMuted] = useState(
    searchParams.get("filter[muted]") === "false",
  );

  const handleMutedChange = (value: boolean) => {
    setExcludeMuted(value);

    // Only URL  update if value is false else remove filter
    if (value) {
      updateFilter("muted", "false");
    } else {
      clearFilter("muted");
    }
  };

  return (
    <div className="flex h-full text-nowrap">
      <Checkbox
        classNames={{
          label: "text-small",
          wrapper: "checkbox-update",
        }}
        size="md"
        color="primary"
        aria-label="Include Mutelist"
        isSelected={excludeMuted}
        onValueChange={handleMutedChange}
      >
        Exclude muted findings
      </Checkbox>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-date-picker.tsx]---
Location: prowler-master/ui/components/filters/custom-date-picker.tsx
Signals: React, Next.js

```typescript
"use client";

import { Button, ButtonGroup } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import {
  getLocalTimeZone,
  parseDate,
  startOfMonth,
  startOfWeek,
  today,
} from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import type { DateValue } from "@react-types/datepicker";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useUrlFilters } from "@/hooks/use-url-filters";

export const CustomDatePicker = () => {
  const searchParams = useSearchParams();
  const { updateFilter } = useUrlFilters();

  const [value, setValue] = useState<DateValue | null>(() => {
    const dateParam = searchParams.get("filter[inserted_at]");
    if (!dateParam) return null;
    try {
      return parseDate(dateParam);
    } catch {
      return null;
    }
  });

  const { locale } = useLocale();

  const now = today(getLocalTimeZone());
  const nextWeek = startOfWeek(now.add({ weeks: 1 }), locale);
  const nextMonth = startOfMonth(now.add({ months: 1 }));

  const applyDateFilter = (date: DateValue | null) => {
    if (date) {
      updateFilter("inserted_at", date.toString());
    } else {
      updateFilter("inserted_at", null);
    }
  };

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (params.size === 0) {
      setValue(null);
    }
  }, [searchParams]);

  const handleDateChange = (newValue: DateValue | null) => {
    setValue(newValue);
    applyDateFilter(newValue);
  };

  return (
    <div className="flex w-full flex-col md:gap-2">
      <DatePicker
        style={{
          borderRadius: "0.5rem",
        }}
        aria-label="Select a Date"
        classNames={{
          base: "w-full [&]:!rounded-lg [&>*]:!rounded-lg",
          selectorButton: "text-bg-button-secondary shrink-0",
          input:
            "text-bg-button-secondary placeholder:text-bg-button-secondary text-sm",
          innerWrapper: "[&]:!rounded-lg",
          inputWrapper:
            "!border-border-input-primary !bg-bg-input-primary dark:!bg-input/30 dark:hover:!bg-input/50 hover:!bg-bg-neutral-secondary !border [&]:!rounded-lg !shadow-xs !transition-[color,box-shadow] focus-within:!border-border-input-primary-press focus-within:!ring-1 focus-within:!ring-border-input-primary-press focus-within:!ring-offset-1 !h-10 !px-4 !py-3 !outline-none",
          segment: "text-bg-button-secondary",
        }}
        popoverProps={{
          classNames: {
            content:
              "border-border-input-primary bg-bg-input-primary border rounded-lg",
          },
        }}
        CalendarTopContent={
          <ButtonGroup
            fullWidth
            className="bg-bg-neutral-secondary [&>button]:border-border-neutral-secondary [&>button]:text-bg-button-secondary px-3 pt-3 pb-2"
            radius="full"
            size="sm"
            variant="flat"
          >
            <Button onPress={() => handleDateChange(now)}>Today</Button>
            <Button onPress={() => handleDateChange(nextWeek)}>
              Next week
            </Button>
            <Button onPress={() => handleDateChange(nextMonth)}>
              Next month
            </Button>
          </ButtonGroup>
        }
        calendarProps={{
          focusedValue: value || undefined,
          onFocusChange: setValue,
          nextButtonProps: {
            variant: "bordered",
          },
          prevButtonProps: {
            variant: "bordered",
          },
        }}
        value={value}
        onChange={handleDateChange}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-provider-inputs.tsx]---
Location: prowler-master/ui/components/filters/custom-provider-inputs.tsx
Signals: React

```typescript
import React from "react";

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
} from "../icons/providers-badge";

export const CustomProviderInputAWS = () => {
  return (
    <div className="flex items-center gap-x-2">
      <AWSProviderBadge width={25} height={25} />
      <p className="text-sm">Amazon Web Services</p>
    </div>
  );
};

export const CustomProviderInputAzure = () => {
  return (
    <div className="flex items-center gap-x-2">
      <AzureProviderBadge width={25} height={25} />
      <p className="text-sm">Azure</p>
    </div>
  );
};

export const CustomProviderInputM365 = () => {
  return (
    <div className="flex items-center gap-x-2">
      <M365ProviderBadge width={25} height={25} />
      <p className="text-sm">Microsoft 365</p>
    </div>
  );
};

export const CustomProviderInputMongoDBAtlas = () => {
  return (
    <div className="flex items-center gap-x-2">
      <MongoDBAtlasProviderBadge width={25} height={25} />
      <p className="text-sm">MongoDB Atlas</p>
    </div>
  );
};

export const CustomProviderInputGCP = () => {
  return (
    <div className="flex items-center gap-x-2">
      <GCPProviderBadge width={25} height={25} />
      <p className="text-sm">Google Cloud Platform</p>
    </div>
  );
};

export const CustomProviderInputKubernetes = () => {
  return (
    <div className="flex items-center gap-x-2">
      <KS8ProviderBadge width={25} height={25} />
      <p className="text-sm">Kubernetes</p>
    </div>
  );
};

export const CustomProviderInputGitHub = () => {
  return (
    <div className="flex items-center gap-x-2">
      <GitHubProviderBadge width={25} height={25} />
      <p className="text-sm">GitHub</p>
    </div>
  );
};

export const CustomProviderInputIac = () => {
  return (
    <div className="flex items-center gap-x-2">
      <IacProviderBadge width={25} height={25} />
      <p className="text-sm">Infrastructure as Code</p>
    </div>
  );
};

export const CustomProviderInputOracleCloud = () => {
  return (
    <div className="flex items-center gap-x-2">
      <OracleCloudProviderBadge width={25} height={25} />
      <p className="text-sm">Oracle Cloud Infrastructure</p>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-region-selection.tsx]---
Location: prowler-master/ui/components/filters/custom-region-selection.tsx
Signals: React, Next.js

```typescript
"use client";

import { Select, SelectItem } from "@heroui/select";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo } from "react";

export const CustomRegionSelection: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const region = "none";
  // Memoize selected keys based on the URL
  const selectedKeys = useMemo(() => {
    const params = searchParams.get("filter[regions]");
    return params ? params.split(",") : [];
  }, [searchParams]);

  const applyRegionFilter = useCallback(
    (values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (values.length > 0) {
        params.set("filter[regions]", values.join(","));
      } else {
        params.delete("filter[regions]");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <Select
      label="Region"
      aria-label="Select a Region"
      placeholder="Select a region"
      classNames={{
        selectorIcon: "right-2",
      }}
      className="w-full"
      size="sm"
      selectedKeys={selectedKeys}
      onSelectionChange={(keys) =>
        applyRegionFilter(Array.from(keys) as string[])
      }
    >
      <SelectItem key={region}>{region}</SelectItem>
    </Select>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-search-input.tsx]---
Location: prowler-master/ui/components/filters/custom-search-input.tsx
Signals: React, Next.js

```typescript
import { Input } from "@heroui/input";
import { SearchIcon, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { useUrlFilters } from "@/hooks/use-url-filters";

export const CustomSearchInput: React.FC = () => {
  const searchParams = useSearchParams();
  const { updateFilter } = useUrlFilters();
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const applySearch = useCallback(
    (query: string) => {
      if (query) {
        updateFilter("search", query);
      } else {
        updateFilter("search", null);
      }
    },
    [updateFilter],
  );

  const debouncedChangeHandler = useCallback(
    (value: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        applySearch(value);
      }, 300);
    },
    [applySearch],
  );

  const clearIconSearch = () => {
    setSearchQuery("");
    applySearch("");
  };

  useEffect(() => {
    const searchFromUrl = searchParams.get("filter[search]") || "";
    setSearchQuery(searchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Input
      style={{
        borderRadius: "0.5rem",
      }}
      classNames={{
        base: "w-full [&]:!rounded-lg [&>*]:!rounded-lg",
        input:
          "text-bg-button-secondary placeholder:text-bg-button-secondary text-sm",
        inputWrapper:
          "!border-border-input-primary !bg-bg-input-primary dark:!bg-input/30 dark:hover:!bg-input/50 hover:!bg-bg-neutral-secondary !border [&]:!rounded-lg !shadow-xs !transition-[color,box-shadow] focus-within:!border-border-input-primary-press focus-within:!ring-1 focus-within:!ring-border-input-primary-press focus-within:!ring-offset-1 !h-10 !px-4 !py-3 !outline-none",
        clearButton: "text-bg-button-secondary",
      }}
      aria-label="Search"
      placeholder="Search..."
      value={searchQuery}
      startContent={
        <SearchIcon className="text-bg-button-secondary shrink-0" width={16} />
      }
      onChange={(e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedChangeHandler(value);
      }}
      endContent={
        searchQuery && (
          <button
            onClick={clearIconSearch}
            className="text-bg-button-secondary shrink-0 focus:outline-none"
          >
            <XCircle className="text-bg-button-secondary h-4 w-4" />
          </button>
        )
      }
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-select-provider.tsx]---
Location: prowler-master/ui/components/filters/custom-select-provider.tsx
Signals: React, Next.js

```typescript
"use client";

import { Select, SelectItem } from "@heroui/select";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo } from "react";

import { PROVIDER_TYPES, ProviderType } from "@/types/providers";

import {
  CustomProviderInputAWS,
  CustomProviderInputAzure,
  CustomProviderInputGCP,
  CustomProviderInputGitHub,
  CustomProviderInputIac,
  CustomProviderInputKubernetes,
  CustomProviderInputM365,
  CustomProviderInputMongoDBAtlas,
  CustomProviderInputOracleCloud,
} from "./custom-provider-inputs";

const providerDisplayData: Record<
  ProviderType,
  { label: string; component: React.ReactElement }
> = {
  aws: {
    label: "Amazon Web Services",
    component: <CustomProviderInputAWS />,
  },
  azure: {
    label: "Microsoft Azure",
    component: <CustomProviderInputAzure />,
  },
  gcp: {
    label: "Google Cloud Platform",
    component: <CustomProviderInputGCP />,
  },
  github: {
    label: "GitHub",
    component: <CustomProviderInputGitHub />,
  },
  iac: {
    label: "Infrastructure as Code",
    component: <CustomProviderInputIac />,
  },
  kubernetes: {
    label: "Kubernetes",
    component: <CustomProviderInputKubernetes />,
  },
  m365: {
    label: "Microsoft 365",
    component: <CustomProviderInputM365 />,
  },
  mongodbatlas: {
    label: "MongoDB Atlas",
    component: <CustomProviderInputMongoDBAtlas />,
  },
  oraclecloud: {
    label: "Oracle Cloud Infrastructure",
    component: <CustomProviderInputOracleCloud />,
  },
};

const dataInputsProvider = PROVIDER_TYPES.map((providerType) => ({
  key: providerType,
  label: providerDisplayData[providerType].label,
  value: providerDisplayData[providerType].component,
}));

export const CustomSelectProvider: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const applyProviderFilter = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("filter[provider_type]", value);
      } else {
        params.delete("filter[provider_type]");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const currentProvider = searchParams.get("filter[provider_type]") || "";

  const selectedKeys = useMemo(() => {
    return dataInputsProvider.some(
      (provider) => provider.key === currentProvider,
    )
      ? [currentProvider]
      : [];
  }, [currentProvider]);

  return (
    <Select
      items={dataInputsProvider}
      aria-label="Select a Provider"
      placeholder="Select a provider"
      classNames={{
        selectorIcon: "right-2",
        label: "z-0! mb-2",
      }}
      label="Provider"
      labelPlacement="inside"
      size="sm"
      onChange={(e) => {
        const value = e.target.value;
        applyProviderFilter(value);
      }}
      selectedKeys={selectedKeys}
      renderValue={(items) => {
        return items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            {item.data?.value}
          </div>
        ));
      }}
    >
      {(item) => (
        <SelectItem key={item.key} textValue={item.key} aria-label={item.label}>
          <div className="flex items-center gap-2">{item.value}</div>
        </SelectItem>
      )}
    </Select>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: data-filters.ts]---
Location: prowler-master/ui/components/filters/data-filters.ts

```typescript
import { CONNECTION_STATUS_MAPPING } from "@/lib/helper-filters";
import { FilterOption, FilterType } from "@/types/filters";
import {
  PROVIDER_DISPLAY_NAMES,
  PROVIDER_TYPES,
  ProviderType,
} from "@/types/providers";

// Create a mapping for provider types to display with icons and labels
const PROVIDER_TYPE_MAPPING = PROVIDER_TYPES.map((providerType) => ({
  [providerType]: {
    provider: providerType as ProviderType,
    uid: "",
    alias: PROVIDER_DISPLAY_NAMES[providerType],
  },
}));

export const filterProviders: FilterOption[] = [
  {
    key: "connected",
    labelCheckboxGroup: "Connection",
    values: ["true", "false"],
    valueLabelMapping: CONNECTION_STATUS_MAPPING,
  },
  {
    key: "provider__in",
    labelCheckboxGroup: "Cloud Provider",
    values: [...PROVIDER_TYPES],
    valueLabelMapping: PROVIDER_TYPE_MAPPING,
  },
  // Add more filter categories as needed
];

export const filterScans = [
  {
    key: "provider_type__in",
    labelCheckboxGroup: "Cloud Provider",
    values: [...PROVIDER_TYPES],
    valueLabelMapping: PROVIDER_TYPE_MAPPING,
    index: 0,
  },
  {
    key: "state__in",
    labelCheckboxGroup: "Status",
    values: [
      "available",
      "scheduled",
      "executing",
      "completed",
      "failed",
      "cancelled",
    ],
    index: 2,
  },
  {
    key: "trigger",
    labelCheckboxGroup: "Trigger",
    values: ["scheduled", "manual"],
    index: 3,
  },
  // Add more filter categories as needed
];

//Static filters for findings
export const filterFindings = [
  {
    key: FilterType.SEVERITY,
    labelCheckboxGroup: "Severity",
    values: ["critical", "high", "medium", "low", "informational"],
    index: 0,
  },
  {
    key: FilterType.STATUS,
    labelCheckboxGroup: "Status",
    values: ["PASS", "FAIL", "MANUAL"],
    index: 1,
  },
  {
    key: FilterType.PROVIDER_TYPE,
    labelCheckboxGroup: "Cloud Provider",
    values: [...PROVIDER_TYPES],
    valueLabelMapping: PROVIDER_TYPE_MAPPING,
    index: 5,
  },
  {
    key: FilterType.DELTA,
    labelCheckboxGroup: "Delta",
    values: ["new", "changed"],
    index: 2,
  },
];

export const filterUsers = [
  {
    key: "is_active",
    labelCheckboxGroup: "Status",
    values: ["true", "false"],
  },
];

export const filterInvitations = [
  {
    key: "state",
    labelCheckboxGroup: "State",
    values: ["pending", "accepted", "expired", "revoked"],
  },
];

export const filterRoles = [
  {
    key: "permission_state",
    labelCheckboxGroup: "Permissions",
    values: ["unlimited", "limited", "none"],
  },
];
```

--------------------------------------------------------------------------------

---[FILE: filter-controls.tsx]---
Location: prowler-master/ui/components/filters/filter-controls.tsx
Signals: React

```typescript
"use client";

import { Spacer } from "@heroui/spacer";
import React from "react";

import { FilterOption } from "@/types";

import { DataTableFilterCustom } from "../ui/table";
import { CustomAccountSelection } from "./custom-account-selection";
import { CustomCheckboxMutedFindings } from "./custom-checkbox-muted-findings";
import { CustomDatePicker } from "./custom-date-picker";
import { CustomRegionSelection } from "./custom-region-selection";
import { CustomSearchInput } from "./custom-search-input";
import { CustomSelectProvider } from "./custom-select-provider";

export interface FilterControlsProps {
  search?: boolean;
  providers?: boolean;
  date?: boolean;
  regions?: boolean;
  accounts?: boolean;
  mutedFindings?: boolean;
  customFilters?: FilterOption[];
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  search = false,
  providers = false,
  date = false,
  regions = false,
  accounts = false,
  mutedFindings = false,
  customFilters,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        <div className="grid w-full flex-1 grid-cols-1 items-center gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-4">
          {search && <CustomSearchInput />}
          {providers && <CustomSelectProvider />}
          {date && <CustomDatePicker />}
          {regions && <CustomRegionSelection />}
          {accounts && <CustomAccountSelection />}
          {mutedFindings && <CustomCheckboxMutedFindings />}
        </div>
      </div>
      <Spacer y={8} />
      {customFilters && <DataTableFilterCustom filters={customFilters} />}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/filters/index.ts

```typescript
export * from "./active-filter-badge";
export * from "./clear-filters-button";
export * from "./custom-account-selection";
export * from "./custom-checkbox-muted-findings";
export * from "./custom-date-picker";
export * from "./custom-provider-inputs";
export * from "./custom-region-selection";
export * from "./custom-select-provider";
export * from "./data-filters";
export * from "./filter-controls";
```

--------------------------------------------------------------------------------

---[FILE: findings-filters.tsx]---
Location: prowler-master/ui/components/findings/findings-filters.tsx

```typescript
"use client";

import { filterFindings } from "@/components/filters/data-filters";
import { FilterControls } from "@/components/filters/filter-controls";
import { useRelatedFilters } from "@/hooks";
import { getCategoryLabel } from "@/lib/categories";
import { FilterEntity, FilterType, ScanEntity, ScanProps } from "@/types";

interface FindingsFiltersProps {
  providerIds: string[];
  providerDetails: { [id: string]: FilterEntity }[];
  completedScans: ScanProps[];
  completedScanIds: string[];
  scanDetails: { [key: string]: ScanEntity }[];
  uniqueRegions: string[];
  uniqueServices: string[];
  uniqueResourceTypes: string[];
  uniqueCategories: string[];
}

export const FindingsFilters = ({
  providerIds,
  providerDetails,
  completedScanIds,
  scanDetails,
  uniqueRegions,
  uniqueServices,
  uniqueResourceTypes,
  uniqueCategories,
}: FindingsFiltersProps) => {
  const { availableProviderIds, availableScans } = useRelatedFilters({
    providerIds,
    providerDetails,
    completedScanIds,
    scanDetails,
    enableScanRelation: true,
  });

  return (
    <>
      <FilterControls
        search
        date
        mutedFindings
        customFilters={[
          ...filterFindings,
          {
            key: FilterType.PROVIDER,
            labelCheckboxGroup: "Provider",
            values: availableProviderIds,
            valueLabelMapping: providerDetails,
            index: 6,
          },
          {
            key: FilterType.REGION,
            labelCheckboxGroup: "Regions",
            values: uniqueRegions,
            index: 3,
          },
          {
            key: FilterType.SERVICE,
            labelCheckboxGroup: "Services",
            values: uniqueServices,
            index: 4,
          },
          {
            key: FilterType.RESOURCE_TYPE,
            labelCheckboxGroup: "Resource Type",
            values: uniqueResourceTypes,
            index: 8,
          },
          {
            key: FilterType.CATEGORY,
            labelCheckboxGroup: "Category",
            values: uniqueCategories,
            labelFormatter: getCategoryLabel,
            index: 5,
          },
          {
            key: FilterType.SCAN,
            labelCheckboxGroup: "Scan ID",
            values: availableScans,
            valueLabelMapping: scanDetails,
            index: 7,
          },
        ]}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/findings/index.ts

```typescript
export * from "./muted";
```

--------------------------------------------------------------------------------

---[FILE: muted.tsx]---
Location: prowler-master/ui/components/findings/muted.tsx

```typescript
import { Tooltip } from "@heroui/tooltip";

import { MutedIcon } from "../icons";

interface MutedProps {
  isMuted: boolean;
  mutedReason: string;
}

export const Muted = ({
  isMuted,
  mutedReason = "This finding is muted",
}: MutedProps) => {
  if (isMuted === false) return null;

  return (
    <Tooltip content={mutedReason} className="text-xs">
      <div className="border-system-severity-critical/40 w-fit rounded-full border p-1">
        <MutedIcon className="text-system-severity-critical h-4 w-4" />
      </div>
    </Tooltip>
  );
};
```

--------------------------------------------------------------------------------

````
