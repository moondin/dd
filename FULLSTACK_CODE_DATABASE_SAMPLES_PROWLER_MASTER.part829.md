---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 829
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 829 of 867)

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

---[FILE: column-new-findings-to-date.tsx]---
Location: prowler-master/ui/components/overview/new-findings-table/table/column-new-findings-to-date.tsx
Signals: Next.js

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Database } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Muted } from "@/components/findings/muted";
import { DataTableRowDetails } from "@/components/findings/table";
import { DeltaIndicator } from "@/components/findings/table/delta-indicator";
import { InfoIcon } from "@/components/icons";
import {
  DateWithTime,
  EntityInfo,
  SnippetChip,
} from "@/components/ui/entities";
import { TriggerSheet } from "@/components/ui/sheet";
import {
  DataTableColumnHeader,
  SeverityBadge,
  StatusFindingBadge,
} from "@/components/ui/table";
import { FindingProps, ProviderType } from "@/types";

const getFindingsData = (row: { original: FindingProps }) => {
  return row.original;
};

const getFindingsMetadata = (row: { original: FindingProps }) => {
  return row.original.attributes.check_metadata;
};

const getResourceData = (
  row: { original: FindingProps },
  field: keyof FindingProps["relationships"]["resource"]["attributes"],
) => {
  return (
    row.original.relationships?.resource?.attributes?.[field] ||
    `No ${field} found in resource`
  );
};

const getProviderData = (
  row: { original: FindingProps },
  field: keyof FindingProps["relationships"]["provider"]["attributes"],
) => {
  return (
    row.original.relationships?.provider?.attributes?.[field] ||
    `No ${field} found in provider`
  );
};

const FindingDetailsCell = ({ row }: { row: any }) => {
  const searchParams = useSearchParams();
  const findingId = searchParams.get("id");
  const isOpen = findingId === row.original.id;

  return (
    <div className="flex justify-center">
      <TriggerSheet
        triggerComponent={
          <InfoIcon className="text-button-primary" size={16} />
        }
        title="Finding Details"
        description="View the finding details"
        defaultOpen={isOpen}
      >
        <DataTableRowDetails
          entityId={row.original.id}
          findingDetails={row.original}
        />
      </TriggerSheet>
    </div>
  );
};

export const ColumnNewFindingsToDate: ColumnDef<FindingProps>[] = [
  {
    id: "moreInfo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
    cell: ({ row }) => <FindingDetailsCell row={row} />,
    enableSorting: false,
  },
  {
    accessorKey: "check",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Finding" />
    ),
    cell: ({ row }) => {
      const { checktitle } = getFindingsMetadata(row);
      const {
        attributes: { muted, muted_reason },
      } = getFindingsData(row);
      const { delta } = row.original.attributes;
      return (
        <div className="3xl:max-w-[660px] relative flex max-w-[410px] flex-row items-center gap-2">
          <div className="flex flex-row items-center gap-4">
            {delta === "new" || delta === "changed" ? (
              <DeltaIndicator delta={delta} />
            ) : (
              <div className="w-2" />
            )}
            <p className="mr-7 text-sm break-words whitespace-normal">
              {checktitle}
            </p>
          </div>
          <span className="absolute top-1/2 -right-2 -translate-y-1/2">
            <Muted isMuted={muted} mutedReason={muted_reason || ""} />
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "resourceName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resource name" />
    ),
    cell: ({ row }) => {
      const resourceName = getResourceData(row, "name");

      return (
        <SnippetChip
          value={resourceName as string}
          formatter={(value) => `...${value.slice(-10)}`}
          icon={<Database size={16} />}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "severity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Severity" />
    ),
    cell: ({ row }) => {
      const {
        attributes: { severity },
      } = getFindingsData(row);
      return <SeverityBadge severity={severity} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const {
        attributes: { status },
      } = getFindingsData(row);

      return <StatusFindingBadge size="sm" status={status} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last seen" />
    ),
    cell: ({ row }) => {
      const {
        attributes: { updated_at },
      } = getFindingsData(row);
      return (
        <div className="w-[100px]">
          <DateWithTime dateTime={updated_at} />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    cell: ({ row }) => {
      const region = getResourceData(row, "region");

      return (
        <div className="w-[80px]">
          {typeof region === "string" ? region : "Invalid region"}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "service",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service" />
    ),
    cell: ({ row }) => {
      const { servicename } = getFindingsMetadata(row);
      return <p className="text-small max-w-96 truncate">{servicename}</p>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "cloudProvider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cloud Provider" />
    ),
    cell: ({ row }) => {
      const provider = getProviderData(row, "provider");
      const alias = getProviderData(row, "alias");
      const uid = getProviderData(row, "uid");

      return (
        <>
          <EntityInfo
            cloudProvider={provider as ProviderType}
            entityAlias={alias as string}
            entityId={uid as string}
          />
        </>
      );
    },
    enableSorting: false,
  },
];
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/overview/new-findings-table/table/index.ts

```typescript
export * from "./column-new-findings-to-date";
export * from "./skeleton-table-new-findings";
```

--------------------------------------------------------------------------------

---[FILE: skeleton-table-new-findings.tsx]---
Location: prowler-master/ui/components/overview/new-findings-table/table/skeleton-table-new-findings.tsx
Signals: React

```typescript
import React from "react";

import { Card } from "@/components/shadcn/card/card";
import { Skeleton } from "@/components/shadcn/skeleton/skeleton";

export const SkeletonTableNewFindings = () => {
  const columns = 7;
  const rows = 3;

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

---[FILE: add-provider-button.tsx]---
Location: prowler-master/ui/components/providers/add-provider-button.tsx
Signals: Next.js

```typescript
"use client";

import Link from "next/link";

import { Button } from "@/components/shadcn";

import { AddIcon } from "../icons";

export const AddProviderButton = () => {
  return (
    <Button asChild>
      <Link href="/providers/connect-account">
        Add Cloud Provider
        <AddIcon size={20} />
      </Link>
    </Button>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: credentials-update-info.tsx]---
Location: prowler-master/ui/components/providers/credentials-update-info.tsx

```typescript
"use client";

import { SelectViaAWS } from "@/components/providers/workflow/forms/select-credentials-type/aws";
import { SelectViaGCP } from "@/components/providers/workflow/forms/select-credentials-type/gcp";
import { SelectViaGitHub } from "@/components/providers/workflow/forms/select-credentials-type/github";
import { SelectViaM365 } from "@/components/providers/workflow/forms/select-credentials-type/m365";
import { ProviderType } from "@/types/providers";

interface UpdateCredentialsInfoProps {
  providerType: ProviderType;
  initialVia?: string;
}

export const CredentialsUpdateInfo = ({
  providerType,
  initialVia,
}: UpdateCredentialsInfoProps) => {
  const renderSelectComponent = () => {
    if (providerType === "aws") {
      return <SelectViaAWS initialVia={initialVia} />;
    }
    if (providerType === "gcp") {
      return <SelectViaGCP initialVia={initialVia} />;
    }
    if (providerType === "github") {
      return <SelectViaGitHub initialVia={initialVia} />;
    }
    if (providerType === "m365") {
      return <SelectViaM365 initialVia={initialVia} />;
    }
    return null;
  };

  return <div className="flex flex-col gap-4">{renderSelectComponent()}</div>;
};
```

--------------------------------------------------------------------------------

---[FILE: enhanced-provider-selector.tsx]---
Location: prowler-master/ui/components/providers/enhanced-provider-selector.tsx
Signals: React

```typescript
"use client";

import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { CheckSquare, Search, Square } from "lucide-react";
import { useMemo, useState } from "react";
import { Control } from "react-hook-form";

import { Button } from "@/components/shadcn";
import { FormControl, FormField, FormMessage } from "@/components/ui/form";
import { ProviderProps, ProviderType } from "@/types/providers";

const providerTypeLabels: Record<ProviderType, string> = {
  aws: "Amazon Web Services",
  gcp: "Google Cloud Platform",
  azure: "Microsoft Azure",
  m365: "Microsoft 365",
  kubernetes: "Kubernetes",
  github: "GitHub",
  iac: "Infrastructure as Code",
  oraclecloud: "Oracle Cloud Infrastructure",
  mongodbatlas: "MongoDB Atlas",
};

interface EnhancedProviderSelectorProps {
  control: Control<any>;
  name: string;
  providers: ProviderProps[];
  label?: string;
  placeholder?: string;
  isInvalid?: boolean;
  showFormMessage?: boolean;
  selectionMode?: "single" | "multiple";
  providerType?: ProviderType;
  enableSearch?: boolean;
  disabledProviderIds?: string[];
}

export const EnhancedProviderSelector = ({
  control,
  name,
  providers,
  label = "Provider",
  placeholder = "Select provider",
  isInvalid = false,
  showFormMessage = true,
  selectionMode = "single",
  providerType,
  enableSearch = false,
  disabledProviderIds = [],
}: EnhancedProviderSelectorProps) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredProviders = useMemo(() => {
    let filtered = providers;

    // Filter by provider type if specified
    if (providerType) {
      filtered = filtered.filter((p) => p.attributes.provider === providerType);
    }

    // Filter by search value
    if (searchValue && enableSearch) {
      const lowerSearch = searchValue.toLowerCase();
      filtered = filtered.filter((p) => {
        const displayName = p.attributes.alias || p.attributes.uid;
        const typeLabel = providerTypeLabels[p.attributes.provider];
        return (
          displayName.toLowerCase().includes(lowerSearch) ||
          typeLabel.toLowerCase().includes(lowerSearch)
        );
      });
    }

    // Sort providers
    return filtered.sort((a, b) => {
      const typeComparison = a.attributes.provider.localeCompare(
        b.attributes.provider,
      );
      if (typeComparison !== 0) return typeComparison;

      const nameA = a.attributes.alias || a.attributes.uid;
      const nameB = b.attributes.alias || b.attributes.uid;
      return nameA.localeCompare(nameB);
    });
  }, [providers, providerType, searchValue, enableSearch]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => {
        const isMultiple = selectionMode === "multiple";
        const selectedIds = isMultiple ? value || [] : value ? [value] : [];
        const allProviderIds = filteredProviders
          .filter((p) => !disabledProviderIds.includes(p.id))
          .map((p) => p.id);
        const isAllSelected =
          isMultiple &&
          allProviderIds.length > 0 &&
          allProviderIds.every((id) => selectedIds.includes(id));

        const handleSelectAll = () => {
          if (isAllSelected) {
            onChange([]);
          } else {
            onChange(allProviderIds);
          }
        };

        const handleSelectionChange = (keys: any) => {
          if (isMultiple) {
            const selectedArray = Array.from(keys);
            onChange(selectedArray);
          } else {
            const selectedValue = Array.from(keys)[0];
            onChange(selectedValue || "");
          }
        };

        return (
          <>
            <FormControl>
              <div className="flex flex-col gap-2">
                {isMultiple && filteredProviders.length > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-neutral-primary text-sm font-medium">
                      {label}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSelectAll}
                      className="h-7 text-xs"
                    >
                      {isAllSelected ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                      {isAllSelected ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                )}
                <Select
                  label={label}
                  placeholder={placeholder}
                  selectionMode={isMultiple ? "multiple" : "single"}
                  selectedKeys={
                    new Set(isMultiple ? value || [] : value ? [value] : [])
                  }
                  onSelectionChange={handleSelectionChange}
                  onBlur={onBlur}
                  variant="bordered"
                  labelPlacement="inside"
                  isRequired={false}
                  isInvalid={isInvalid}
                  classNames={{
                    trigger: "min-h-12",
                    popoverContent: "bg-bg-neutral-secondary",
                    listboxWrapper: "max-h-[300px] bg-bg-neutral-secondary",
                    listbox: "gap-0",
                    label:
                      "tracking-tight font-light !text-text-neutral-secondary text-xs z-0!",
                    value: "text-text-neutral-secondary text-small",
                  }}
                  renderValue={(items) => {
                    if (!isMultiple && value) {
                      const provider = providers.find((p) => p.id === value);
                      if (provider) {
                        const displayName =
                          provider.attributes.alias || provider.attributes.uid;
                        return (
                          <div className="flex items-center gap-2">
                            <span className="truncate">{displayName}</span>
                          </div>
                        );
                      }
                    }

                    if (items.length === 0) {
                      return (
                        <span className="text-default-500">{placeholder}</span>
                      );
                    }

                    if (isMultiple) {
                      if (items.length === 1) {
                        const provider = providers.find(
                          (p) => p.id === items[0].key,
                        );
                        if (provider) {
                          const displayName =
                            provider.attributes.alias ||
                            provider.attributes.uid;
                          return (
                            <div className="flex items-center gap-2">
                              <span className="truncate">{displayName}</span>
                            </div>
                          );
                        }
                      }

                      return (
                        <span className="text-small">
                          {items.length} provider{items.length !== 1 ? "s" : ""}{" "}
                          selected
                        </span>
                      );
                    }

                    return null;
                  }}
                  listboxProps={{
                    topContent: enableSearch ? (
                      <div className="sticky top-0 z-10 py-2">
                        <Input
                          isClearable
                          placeholder="Search providers..."
                          size="sm"
                          variant="bordered"
                          startContent={<Search size={16} />}
                          value={searchValue}
                          onValueChange={setSearchValue}
                          onClear={() => setSearchValue("")}
                          classNames={{
                            inputWrapper:
                              "border-border-input-primary bg-bg-input-primary hover:bg-bg-neutral-secondary",
                            input: "text-small",
                            clearButton: "text-default-400",
                          }}
                        />
                      </div>
                    ) : null,
                  }}
                >
                  {filteredProviders.map((provider) => {
                    const providerType = provider.attributes.provider;
                    const displayName =
                      provider.attributes.alias || provider.attributes.uid;
                    const typeLabel = providerTypeLabels[providerType];
                    const isDisabled = disabledProviderIds.includes(
                      provider.id,
                    );

                    return (
                      <SelectItem
                        key={provider.id}
                        textValue={`${displayName} ${typeLabel}`}
                        className={`py-2 ${isDisabled ? "pointer-events-none cursor-not-allowed opacity-50" : ""}`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="text-small truncate font-medium">
                                {displayName}
                              </div>
                              <div className="text-tiny text-text-neutral-secondary truncate">
                                {typeLabel}
                                {isDisabled && (
                                  <span className="text-text-error ml-2">
                                    (Already used)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="ml-2 flex shrink-0 items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                provider.attributes.connection.connected
                                  ? "bg-bg-pass"
                                  : "bg-bg-fail"
                              }`}
                              title={
                                provider.attributes.connection.connected
                                  ? "Connected"
                                  : "Disconnected"
                              }
                            />
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </Select>
              </div>
            </FormControl>
            {showFormMessage && (
              <FormMessage className="text-text-error max-w-full text-xs" />
            )}
          </>
        );
      }}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/index.ts

```typescript
export * from "../../store/ui/store-initializer";
export * from "./add-provider-button";
export * from "./credentials-update-info";
export * from "./forms/delete-form";
export * from "./link-to-scans";
export * from "./muted-findings-config-button";
export * from "./provider-info";
export * from "./radio-group-provider";
```

--------------------------------------------------------------------------------

---[FILE: link-to-scans.tsx]---
Location: prowler-master/ui/components/providers/link-to-scans.tsx
Signals: Next.js

```typescript
"use client";

import Link from "next/link";

import { Button } from "@/components/shadcn";

interface LinkToScansProps {
  providerUid?: string;
}

export const LinkToScans = ({ providerUid }: LinkToScansProps) => {
  return (
    <Button asChild variant="link" size="sm" className="text-xs">
      <Link href={`/scans?filter[provider_uid]=${providerUid}`}>
        View Scan Jobs
      </Link>
    </Button>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: muted-findings-config-button.tsx]---
Location: prowler-master/ui/components/providers/muted-findings-config-button.tsx
Signals: React, Next.js

```typescript
"use client";

import { SettingsIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/shadcn";
import { CustomAlertModal } from "@/components/ui/custom";
import { useUIStore } from "@/store/ui/store";

import { MutedFindingsConfigForm } from "./forms";

export const MutedFindingsConfigButton = () => {
  const pathname = usePathname();
  const {
    isMutelistModalOpen,
    openMutelistModal,
    closeMutelistModal,
    hasProviders,
    shouldAutoOpenMutelist,
    resetMutelistModalRequest,
  } = useUIStore();

  useEffect(() => {
    if (!shouldAutoOpenMutelist) {
      return;
    }

    if (pathname !== "/providers") {
      return;
    }

    if (hasProviders) {
      openMutelistModal();
    }

    resetMutelistModalRequest();
  }, [
    hasProviders,
    openMutelistModal,
    pathname,
    resetMutelistModalRequest,
    shouldAutoOpenMutelist,
  ]);

  const handleOpenModal = () => {
    if (hasProviders) {
      openMutelistModal();
    }
  };

  return (
    <>
      <CustomAlertModal
        isOpen={isMutelistModalOpen}
        onOpenChange={closeMutelistModal}
        title="Configure Mutelist"
        size="3xl"
      >
        <MutedFindingsConfigForm
          setIsOpen={closeMutelistModal}
          onCancel={closeMutelistModal}
        />
      </CustomAlertModal>

      <Button
        variant="outline"
        onClick={handleOpenModal}
        disabled={!hasProviders}
      >
        <SettingsIcon size={20} />
        Configure Mutelist
      </Button>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: provider-info.tsx]---
Location: prowler-master/ui/components/providers/provider-info.tsx

```typescript
import { Tooltip } from "@heroui/tooltip";

import { ProviderType } from "@/types";

import { ConnectionFalse, ConnectionPending, ConnectionTrue } from "../icons";
import { getProviderLogo } from "../ui/entities";

interface ProviderInfoProps {
  connected: boolean | null;
  provider: ProviderType;
  providerAlias: string;
  providerUID?: string;
}

export const ProviderInfo = ({
  connected,
  provider,
  providerAlias,
  providerUID,
}: ProviderInfoProps) => {
  const getIcon = () => {
    switch (connected) {
      case true:
        return (
          <Tooltip content="Provider connected" className="text-xs">
            <div className="rounded-medium border-system-success bg-system-success-lighter flex items-center justify-center border-2 p-1">
              <ConnectionTrue className="text-system-success" size={24} />
            </div>
          </Tooltip>
        );
      case false:
        return (
          <Tooltip content="Provider connection failed" className="text-xs">
            <div className="rounded-medium border-border-error flex items-center justify-center border-2 p-1">
              <ConnectionFalse className="text-text-error-primary" size={24} />
            </div>
          </Tooltip>
        );
      case null:
        return (
          <Tooltip content="Provider not connected" className="text-xs">
            <div className="bg-info-lighter border-info-lighter rounded-medium flex items-center justify-center border p-1">
              <ConnectionPending className="text-info" size={24} />
            </div>
          </Tooltip>
        );
      default:
        return <ConnectionPending size={24} />;
    }
  };

  return (
    <div className="flex items-center text-sm">
      <div className="flex items-center gap-4">
        {getProviderLogo(provider)}
        {getIcon()}
        <span className="font-medium">{providerAlias || providerUID}</span>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: radio-group-provider.tsx]---
Location: prowler-master/ui/components/providers/radio-group-provider.tsx
Signals: React, Zod

```typescript
"use client";

import { RadioGroup } from "@heroui/radio";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { z } from "zod";

import { addProviderFormSchema } from "@/types";

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
import { CustomRadio } from "../ui/custom";
import { FormMessage } from "../ui/form";

interface RadioGroupProviderProps {
  control: Control<z.infer<typeof addProviderFormSchema>>;
  isInvalid: boolean;
  errorMessage?: string;
}

export const RadioGroupProvider: React.FC<RadioGroupProviderProps> = ({
  control,
  isInvalid,
  errorMessage,
}) => {
  return (
    <Controller
      name="providerType"
      control={control}
      render={({ field }) => (
        <>
          <RadioGroup
            className="flex flex-wrap"
            isInvalid={isInvalid}
            {...field}
            value={field.value || ""}
          >
            <div className="flex flex-col gap-4">
              <CustomRadio description="Amazon Web Services" value="aws">
                <div className="flex items-center">
                  <AWSProviderBadge size={26} />
                  <span className="ml-2">Amazon Web Services</span>
                </div>
              </CustomRadio>
              <CustomRadio description="Google Cloud Platform" value="gcp">
                <div className="flex items-center">
                  <GCPProviderBadge size={26} />
                  <span className="ml-2">Google Cloud Platform</span>
                </div>
              </CustomRadio>
              <CustomRadio description="Microsoft Azure" value="azure">
                <div className="flex items-center">
                  <AzureProviderBadge size={26} />
                  <span className="ml-2">Microsoft Azure</span>
                </div>
              </CustomRadio>
              <CustomRadio description="Microsoft 365" value="m365">
                <div className="flex items-center">
                  <M365ProviderBadge size={26} />
                  <span className="ml-2">Microsoft 365</span>
                </div>
              </CustomRadio>
              <CustomRadio description="MongoDB Atlas" value="mongodbatlas">
                <div className="flex items-center">
                  <MongoDBAtlasProviderBadge size={26} />
                  <span className="ml-2">MongoDB Atlas</span>
                </div>
              </CustomRadio>
              <CustomRadio description="Kubernetes" value="kubernetes">
                <div className="flex items-center">
                  <KS8ProviderBadge size={26} />
                  <span className="ml-2">Kubernetes</span>
                </div>
              </CustomRadio>
              <CustomRadio description="GitHub" value="github">
                <div className="flex items-center">
                  <GitHubProviderBadge size={26} />
                  <span className="ml-2">GitHub</span>
                </div>
              </CustomRadio>
              <CustomRadio description="Infrastructure as Code" value="iac">
                <div className="flex items-center">
                  <IacProviderBadge size={26} />
                  <span className="ml-2">Infrastructure as Code</span>
                </div>
              </CustomRadio>
              <CustomRadio
                description="Oracle Cloud Infrastructure"
                value="oraclecloud"
              >
                <div className="flex items-center">
                  <OracleCloudProviderBadge size={26} />
                  <span className="ml-2">Oracle Cloud Infrastructure</span>
                </div>
              </CustomRadio>
            </div>
          </RadioGroup>
          {errorMessage && (
            <FormMessage className="text-text-error">
              {errorMessage}
            </FormMessage>
          )}
        </>
      )}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: delete-form.tsx]---
Location: prowler-master/ui/components/providers/forms/delete-form.tsx
Signals: React, Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { deleteProvider } from "@/actions/providers";
import { DeleteIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { Form } from "@/components/ui/form";
import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";

const formSchema = z.object({
  [ProviderCredentialFields.PROVIDER_ID]: z.string(),
});

export const DeleteForm = ({
  providerId,
  setIsOpen,
}: {
  providerId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();
  const isLoading = form.formState.isSubmitting;

  async function onSubmitClient(formData: FormData) {
    // client-side validation
    const data = await deleteProvider(formData);

    if (data?.errors && data.errors.length > 0) {
      const error = data.errors[0];
      const errorMessage = `${error.detail}`;
      // show error
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: errorMessage,
      });
    } else {
      toast({
        title: "Success!",
        description: "The provider was removed successfully.",
      });
    }
    setIsOpen(false); // Close the modal on success
  }

  return (
    <Form {...form}>
      <form action={onSubmitClient}>
        <input
          type="hidden"
          name={ProviderCredentialFields.PROVIDER_ID}
          value={providerId}
        />
        <div className="flex w-full justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="destructive"
            size="lg"
            disabled={isLoading}
          >
            {!isLoading && <DeleteIcon size={24} />}
            {isLoading ? "Loading" : "Delete"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: edit-form.tsx]---
Location: prowler-master/ui/components/providers/forms/edit-form.tsx
Signals: React, Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { updateProvider } from "@/actions/providers";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { Form, FormButtons } from "@/components/ui/form";
import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";
import { editProviderFormSchema } from "@/types";

export const EditForm = ({
  providerId,
  providerAlias,
  setIsOpen,
}: {
  providerId: string;
  providerAlias?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const formSchema = editProviderFormSchema(providerAlias ?? "");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [ProviderCredentialFields.PROVIDER_ID]: providerId,
      [ProviderCredentialFields.PROVIDER_ALIAS]: providerAlias,
    },
  });

  const { toast } = useToast();

  const isLoading = form.formState.isSubmitting;

  const onSubmitClient = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    Object.entries(values).forEach(
      ([key, value]) => value !== undefined && formData.append(key, value),
    );

    const data = await updateProvider(formData);

    if (data?.errors && data.errors.length > 0) {
      const error = data.errors[0];
      const errorMessage = `${error.detail}`;
      // show error
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: errorMessage,
      });
    } else {
      toast({
        title: "Success!",
        description: "The provider was updated successfully.",
      });
      setIsOpen(false); // Close the modal on success
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitClient)}
        className="flex flex-col gap-4"
      >
        <div className="text-md">
          Current alias: <span className="font-bold">{providerAlias}</span>
        </div>
        <div>
          <CustomInput
            control={form.control}
            name={ProviderCredentialFields.PROVIDER_ALIAS}
            type="text"
            label="Alias"
            labelPlacement="outside"
            placeholder={providerAlias}
            variant="bordered"
            isRequired={false}
          />
        </div>
        <input type="hidden" name="providerId" value={providerId} />

        <FormButtons setIsOpen={setIsOpen} isDisabled={isLoading} />
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/forms/index.ts

```typescript
export * from "./delete-form";
export * from "./edit-form";
export { MutedFindingsConfigForm } from "./muted-findings-config-form";
```

--------------------------------------------------------------------------------

````
