---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 835
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 835 of 867)

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

---[FILE: no-providers-connected.tsx]---
Location: prowler-master/ui/components/scans/no-providers-connected.tsx
Signals: Next.js

```typescript
"use client";

import Link from "next/link";

import { Button, Card, CardContent } from "@/components/shadcn";

import { InfoIcon } from "../icons/Icons";

export const NoProvidersConnected = () => {
  return (
    <Card variant="base">
      <CardContent className="flex w-full flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-start gap-3">
            <InfoIcon className="h-6 w-6 text-gray-800 dark:text-white" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              No Connected Cloud Providers
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            No cloud providers are currently connected. Connecting a cloud
            provider is required to launch on-demand scans.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Once the cloud providers are correctly configured, this message will
            disappear, and on-demand scans can be launched.
          </p>
        </div>
        <div className="w-full md:w-auto md:shrink-0">
          <Button
            asChild
            className="w-full justify-center md:w-fit"
            aria-label="Go to Cloud providers page"
          >
            <Link href="/providers">Review Cloud Providers</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: scans-filters.tsx]---
Location: prowler-master/ui/components/scans/scans-filters.tsx

```typescript
"use client";

import { filterScans } from "@/components/filters/data-filters";
import { FilterControls } from "@/components/filters/filter-controls";
import { useRelatedFilters } from "@/hooks";
import { FilterEntity, FilterType } from "@/types";

interface ScansFiltersProps {
  providerUIDs: string[];
  providerDetails: { [uid: string]: FilterEntity }[];
}

export const ScansFilters = ({
  providerUIDs,
  providerDetails,
}: ScansFiltersProps) => {
  const { availableProviderUIDs } = useRelatedFilters({
    providerUIDs,
    providerDetails,
    enableScanRelation: false,
    providerFilterType: FilterType.PROVIDER_UID,
  });

  return (
    <FilterControls
      customFilters={[
        ...filterScans,
        {
          key: FilterType.PROVIDER_UID,
          labelCheckboxGroup: "Provider UID",
          values: availableProviderUIDs,
          valueLabelMapping: providerDetails,
          index: 1,
        },
      ]}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: trigger-icon.tsx]---
Location: prowler-master/ui/components/scans/trigger-icon.tsx

```typescript
import { Tooltip } from "@heroui/tooltip";

import { ManualIcon, ScheduleIcon } from "@/components/icons";

interface TriggerIconProps {
  trigger: "scheduled" | "manual";
  iconSize?: number;
}

export function TriggerIcon({ trigger, iconSize = 24 }: TriggerIconProps) {
  return (
    <Tooltip
      className="text-xs"
      content={trigger === "scheduled" ? "Scheduled" : "Manual"}
    >
      <div className="h-fit">
        {trigger === "scheduled" ? (
          <ScheduleIcon size={iconSize} />
        ) : (
          <ManualIcon size={iconSize} />
        )}
      </div>
    </Tooltip>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: edit-scan-form.tsx]---
Location: prowler-master/ui/components/scans/forms/edit-scan-form.tsx
Signals: React, Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { updateScan } from "@/actions/scans";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { Form, FormButtons } from "@/components/ui/form";
import { editScanFormSchema } from "@/types";

export const EditScanForm = ({
  scanId,
  scanName,
  setIsOpen,
}: {
  scanId: string;
  scanName: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const formSchema = editScanFormSchema(scanName);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scanId: scanId,
      scanName: scanName || "",
    },
  });

  const { toast } = useToast();

  const isLoading = form.formState.isSubmitting;

  const onSubmitClient = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    Object.entries(values).forEach(
      ([key, value]) => value !== undefined && formData.append(key, value),
    );

    const data = await updateScan(formData);

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
        description: "The scan was updated successfully.",
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
          Current name:{" "}
          <span className="font-bold">{scanName || "Unnamed"}</span>
        </div>
        <div>
          <CustomInput
            control={form.control}
            name="scanName"
            type="text"
            label="Name"
            labelPlacement="outside"
            placeholder={scanName || "Enter scan name"}
            variant="bordered"
            isRequired={false}
          />
        </div>
        <input type="hidden" name="scanId" value={scanId} />

        <FormButtons setIsOpen={setIsOpen} isDisabled={isLoading} />
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/scans/forms/index.ts

```typescript
export * from "./edit-scan-form";
export * from "./schedule-form";
```

--------------------------------------------------------------------------------

---[FILE: schedule-form.tsx]---
Location: prowler-master/ui/components/scans/forms/schedule-form.tsx
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
import { scheduleScanFormSchema } from "@/types";

export const ScheduleForm = ({
  providerId,
  scheduleDate,
  setIsOpen,
}: {
  providerId: string;
  scheduleDate: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const formSchema = scheduleScanFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      providerId: providerId,
      scheduleDate: scheduleDate,
    },
  });

  const { toast } = useToast();

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
        description: "The scan was scheduled successfully.",
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
        <input type="hidden" name="providerId" value={providerId} />
        <CustomInput
          control={form.control}
          name="scheduleDate"
          type="date"
          label="Schedule Date"
          labelPlacement="inside"
          variant="bordered"
          isRequired={false}
        />

        <FormButtons
          setIsOpen={setIsOpen}
          submitText="Schedule"
          isDisabled={true}
        />
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/scans/launch-workflow/index.ts

```typescript
export * from "./launch-scan-workflow-form";
export * from "./select-scan-provider";
```

--------------------------------------------------------------------------------

---[FILE: launch-scan-workflow-form.tsx]---
Location: prowler-master/ui/components/scans/launch-workflow/launch-scan-workflow-form.tsx
Signals: Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { scanOnDemand } from "@/actions/scans";
import { RocketIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { CustomInput } from "@/components/ui/custom";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/toast";
import { onDemandScanFormSchema } from "@/types";

import { SelectScanProvider } from "./select-scan-provider";

type ProviderInfo = {
  providerId: string;
  alias: string;
  providerType: string;
  uid: string;
  connected: boolean;
};

export const LaunchScanWorkflow = ({
  providers,
}: {
  providers: ProviderInfo[];
}) => {
  const formSchema = z.object({
    ...onDemandScanFormSchema().shape,
    scanName: z
      .union([
        z
          .string()
          .min(3, "Must be at least 3 characters")
          .max(32, "Must not exceed 32 characters"),
        z.literal(""),
      ])
      .optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      providerId: "",
      scanName: "",
      scannerArgs: undefined,
    },
  });

  const providerId = useWatch({ control: form.control, name: "providerId" });
  const hasProviderSelected = Boolean(providerId);

  const isLoading = form.formState.isSubmitting;

  const onSubmitClient = async (values: z.infer<typeof formSchema>) => {
    const formValues = { ...values };

    const formData = new FormData();

    // Loop through form values and add to formData
    Object.entries(formValues).forEach(
      ([key, value]) =>
        value !== undefined &&
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : value,
        ),
    );

    const data = await scanOnDemand(formData);

    if (data?.error) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: data.error,
      });
    } else {
      toast({
        title: "Success!",
        description: "The scan was launched successfully.",
      });
      // Reset form after successful submission
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitClient)}
        className="flex flex-wrap justify-start gap-4"
      >
        <div className="w-72">
          <SelectScanProvider
            providers={providers}
            control={form.control}
            name="providerId"
          />
        </div>
        <AnimatePresence>
          {hasProviderSelected && (
            <>
              <div className="flex flex-wrap gap-6 md:gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="h-[3.4rem] min-w-[15.2rem] self-end"
                >
                  <CustomInput
                    control={form.control}
                    name="scanName"
                    type="text"
                    label="Scan label (optional)"
                    labelPlacement="outside"
                    placeholder="Scan label"
                    size="sm"
                    variant="bordered"
                    isRequired={false}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-end gap-4"
                >
                  <Button
                    type="submit"
                    size="default"
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {!isLoading && <RocketIcon size={16} />}
                    {isLoading ? "Loading..." : "Start now"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => form.reset()}
                    variant="outline"
                    size="default"
                  >
                    Cancel
                  </Button>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: select-scan-provider.tsx]---
Location: prowler-master/ui/components/scans/launch-workflow/select-scan-provider.tsx

```typescript
"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn";
import { EntityInfo } from "@/components/ui/entities";
import { FormControl, FormField, FormMessage } from "@/components/ui/form";

interface SelectScanProviderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  providers: {
    providerId: string;
    alias: string;
    providerType: string;
    uid: string;
    connected: boolean;
  }[];
  control: Control<TFieldValues>;
  name: TName;
}

export const SelectScanProvider = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  providers,
  control,
  name,
}: SelectScanProviderProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedItem = providers.find(
          (item) => item.providerId === field.value,
        );

        return (
          <div className="flex flex-col gap-2">
            <span className="text-text-neutral-primary text-sm font-medium">
              Select a cloud provider to launch a scan
            </span>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a cloud provider">
                    {selectedItem ? (
                      <EntityInfo
                        cloudProvider={
                          selectedItem.providerType as
                            | "aws"
                            | "azure"
                            | "gcp"
                            | "kubernetes"
                        }
                        entityAlias={selectedItem.alias}
                        entityId={selectedItem.uid}
                        showCopyAction={false}
                      />
                    ) : (
                      "Choose a cloud provider"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {providers.map((item) => (
                    <SelectItem key={item.providerId} value={item.providerId}>
                      <EntityInfo
                        cloudProvider={
                          item.providerType as
                            | "aws"
                            | "azure"
                            | "gcp"
                            | "kubernetes"
                        }
                        entityAlias={item.alias}
                        entityId={item.uid}
                        showCopyAction={false}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage className="text-sm text-red-600 dark:text-red-400" />
          </div>
        );
      }}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/scans/table/index.ts

```typescript
export * from "./scan-detail";
export * from "./skeleton-table-scans";
```

--------------------------------------------------------------------------------

---[FILE: scan-detail.tsx]---
Location: prowler-master/ui/components/scans/table/scan-detail.tsx

```typescript
"use client";

import { Snippet } from "@heroui/snippet";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";
import { DateWithTime, EntityInfo, InfoField } from "@/components/ui/entities";
import { StatusBadge } from "@/components/ui/table/status-badge";
import { ProviderProps, ProviderType, ScanProps, TaskDetails } from "@/types";

const renderValue = (value: string | null | undefined) => {
  return value && value.trim() !== "" ? value : "-";
};

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

export const ScanDetail = ({
  scanDetails,
}: {
  scanDetails: ScanProps & {
    taskDetails?: TaskDetails;
    // TODO: Remove the "?" once we have a proper provider details type
    providerDetails?: ProviderProps;
  };
}) => {
  const scan = scanDetails.attributes;
  const taskDetails = scanDetails.taskDetails;
  const providerDetails = scanDetails.providerDetails?.attributes;

  return (
    <div className="flex flex-col gap-6 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <StatusBadge
            size="md"
            className="w-fit"
            status={scan.state}
            loadingProgress={scan.progress}
          />
        </div>
        <EntityInfo
          cloudProvider={providerDetails?.provider as ProviderType}
          entityAlias={providerDetails?.alias}
          entityId={providerDetails?.uid}
          showConnectionStatus={providerDetails?.connection.connected}
        />
      </div>

      {/* Scan Details */}
      <Card variant="base" padding="lg">
        <CardHeader>
          <CardTitle>Scan Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoField label="Scan Name">{renderValue(scan.name)}</InfoField>
            <InfoField label="Resources Scanned">
              {scan.unique_resource_count}
            </InfoField>
            <InfoField label="Progress">{scan.progress}%</InfoField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoField label="Trigger">{renderValue(scan.trigger)}</InfoField>
            <InfoField label="State">{renderValue(scan.state)}</InfoField>
            <InfoField label="Duration">
              {formatDuration(scan.duration)}
            </InfoField>
          </div>

          <InfoField label="Scan ID" variant="simple">
            <Snippet hideSymbol>{scanDetails.id}</Snippet>
          </InfoField>

          {scan.state === "failed" && taskDetails?.attributes.result && (
            <>
              {taskDetails.attributes.result.exc_message && (
                <InfoField label="Error Message" variant="simple">
                  <Snippet hideSymbol>
                    <span className="text-xs whitespace-pre-line">
                      {taskDetails.attributes.result.exc_message.join("\n")}
                    </span>
                  </Snippet>
                </InfoField>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoField label="Error Type">
                  {renderValue(taskDetails.attributes.result.exc_type)}
                </InfoField>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoField label="Started At">
              <DateWithTime inline dateTime={scan.started_at || "-"} />
            </InfoField>
            <InfoField label="Completed At">
              <DateWithTime inline dateTime={scan.completed_at || "-"} />
            </InfoField>
            <InfoField label="Scheduled At">
              <DateWithTime inline dateTime={scan.scheduled_at || "-"} />
            </InfoField>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: skeleton-table-scans.tsx]---
Location: prowler-master/ui/components/scans/table/skeleton-table-scans.tsx
Signals: React

```typescript
import React from "react";

import { Card } from "@/components/shadcn/card/card";
import { Skeleton } from "@/components/shadcn/skeleton/skeleton";

export const SkeletonTableScans = () => {
  return (
    <Card variant="base" padding="md" className="flex flex-col gap-4">
      {/* Table headers */}
      <div className="hidden gap-4 md:flex">
        <Skeleton className="h-8 w-1/12" />
        <Skeleton className="h-8 w-2/12" />
        <Skeleton className="h-8 w-2/12" />
        <Skeleton className="h-8 w-2/12" />
        <Skeleton className="h-8 w-2/12" />
        <Skeleton className="h-8 w-1/12" />
        <Skeleton className="h-8 w-1/12" />
      </div>

      {/* Table body */}
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 md:flex-row md:items-center"
          >
            <Skeleton className="h-12 w-full md:w-1/12" />
            <Skeleton className="h-12 w-full md:w-2/12" />
            <Skeleton className="hidden h-12 md:block md:w-2/12" />
            <Skeleton className="hidden h-12 md:block md:w-2/12" />
            <Skeleton className="hidden h-12 md:block md:w-2/12" />
            <Skeleton className="hidden h-12 md:block md:w-1/12" />
            <Skeleton className="hidden h-12 md:block md:w-1/12" />
          </div>
        ))}
      </div>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: column-get-scans.tsx]---
Location: prowler-master/ui/components/scans/table/scans/column-get-scans.tsx
Signals: Next.js

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";

import { InfoIcon } from "@/components/icons";
import { TableLink } from "@/components/ui/custom";
import { DateWithTime, EntityInfo } from "@/components/ui/entities";
import { TriggerSheet } from "@/components/ui/sheet";
import { DataTableColumnHeader, StatusBadge } from "@/components/ui/table";
import { ProviderType, ScanProps } from "@/types";

import { TriggerIcon } from "../../trigger-icon";
import { DataTableDownloadDetails } from "./data-table-download-details";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableRowDetails } from "./data-table-row-details";

const getScanData = (row: { original: ScanProps }) => {
  return row.original;
};

const ScanDetailsCell = ({ row }: { row: any }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId");
  const isOpen = scanId === row.original.id;
  const scanState = row.original.attributes?.state;
  const isExecuting = scanState === "executing" || scanState === "available";

  const handleOpenChange = (open: boolean) => {
    if (isExecuting) return;

    const params = new URLSearchParams(searchParams.toString());

    if (open) {
      params.set("scanId", row.original.id);
    } else {
      params.delete("scanId");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex w-9 items-center justify-center">
      <TriggerSheet
        triggerComponent={
          <InfoIcon
            className={
              isExecuting ? "cursor-default text-gray-400" : "text-primary"
            }
            size={16}
          />
        }
        title="Scan Details"
        description="View the scan details"
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        {isOpen && <DataTableRowDetails entityId={row.original.id} />}
      </TriggerSheet>
    </div>
  );
};

export const ColumnGetScans: ColumnDef<ScanProps>[] = [
  {
    id: "moreInfo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
    cell: ({ row }) => <ScanDetailsCell row={row} />,
    enableSorting: false,
  },
  {
    accessorKey: "cloudProvider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cloud Provider" />
    ),
    cell: ({ row }) => {
      const providerInfo = row.original.providerInfo;

      if (!providerInfo) {
        return <span className="font-medium">No provider info</span>;
      }

      const { provider, uid, alias } = providerInfo;

      return (
        <EntityInfo
          cloudProvider={provider as ProviderType}
          entityAlias={alias}
          entityId={uid}
        />
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "started_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Started at" />
    ),
    cell: ({ row }) => {
      const {
        attributes: { started_at },
      } = getScanData(row);

      return (
        <div className="w-[100px]">
          <DateWithTime dateTime={started_at} />
        </div>
      );
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
        attributes: { state },
      } = getScanData(row);
      return (
        <div className="flex items-center justify-center">
          <StatusBadge
            status={state}
            loadingProgress={row.original.attributes.progress}
          />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "findings",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Findings" />
    ),
    cell: ({ row }) => {
      const { id } = getScanData(row);
      const scanState = row.original.attributes?.state;
      return (
        <TableLink
          href={`/findings?filter[scan__in]=${id}&filter[status__in]=FAIL`}
          isDisabled={scanState !== "completed"}
          label="See Findings"
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "compliance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Compliance" />
    ),
    cell: ({ row }) => {
      const { id } = getScanData(row);
      const scanState = row.original.attributes?.state;
      return (
        <TableLink
          href={`/compliance?scanId=${id}`}
          isDisabled={!["completed"].includes(scanState)}
          label="See Compliance"
        />
      );
    },
    enableSorting: false,
  },
  {
    id: "download",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Download" />
    ),
    cell: ({ row }) => {
      return (
        <div className="mx-auto w-fit">
          <DataTableDownloadDetails row={row} />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "resources",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resources" />
    ),
    cell: ({ row }) => {
      const {
        attributes: { unique_resource_count },
      } = getScanData(row);
      return (
        <div className="flex w-fit items-center justify-center">
          <span className="text-xs font-medium">{unique_resource_count}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "scheduled_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Scheduled at" />
    ),
    cell: ({ row }) => {
      const {
        attributes: { scheduled_at },
      } = getScanData(row);
      return <DateWithTime dateTime={scheduled_at} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "completed_at",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Completed at"}
        param="updated_at"
      />
    ),
    cell: ({ row }) => {
      const {
        attributes: { completed_at },
      } = getScanData(row);
      return <DateWithTime dateTime={completed_at} />;
    },
  },
  {
    accessorKey: "trigger",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Trigger"}
        param="trigger"
      />
    ),
    cell: ({ row }) => {
      const {
        attributes: { trigger },
      } = getScanData(row);
      return (
        <div className="flex w-9 items-center justify-center">
          <TriggerIcon trigger={trigger} iconSize={16} />
        </div>
      );
    },
  },
  {
    accessorKey: "scanName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Scan name"} param="name" />
    ),
    cell: ({ row }) => {
      const {
        attributes: { name },
      } = getScanData(row);

      if (!name || name.length === 0) {
        return <span className="font-medium">-</span>;
      }
      return (
        <div className="flex w-fit items-center justify-center">
          <span className="text-xs font-medium">
            {name === "Daily scheduled scan" ? "scheduled scan" : name}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    },
    enableSorting: false,
  },
];
```

--------------------------------------------------------------------------------

---[FILE: data-table-download-details.tsx]---
Location: prowler-master/ui/components/scans/table/scans/data-table-download-details.tsx
Signals: React

```typescript
import { Row } from "@tanstack/react-table";
import { useState } from "react";

import { DownloadIconButton, useToast } from "@/components/ui";
import { downloadScanZip } from "@/lib";

interface DataTableDownloadDetailsProps<ScanProps> {
  row: Row<ScanProps>;
}

export function DataTableDownloadDetails<ScanProps>({
  row,
}: DataTableDownloadDetailsProps<ScanProps>) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const scanId = (row.original as { id: string }).id;
  const scanState = (row.original as any).attributes?.state;

  const handleDownload = async () => {
    setIsDownloading(true);
    await downloadScanZip(scanId, toast);
    setIsDownloading(false);
  };

  return (
    <DownloadIconButton
      paramId={scanId}
      onDownload={handleDownload}
      isDownloading={isDownloading}
      isDisabled={scanState !== "completed"}
    />
  );
}
```

--------------------------------------------------------------------------------

---[FILE: data-table-row-actions.tsx]---
Location: prowler-master/ui/components/scans/table/scans/data-table-row-actions.tsx
Signals: React

```typescript
"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/dropdown";
import {
  // DeleteDocumentBulkIcon,
  EditDocumentBulkIcon,
} from "@heroui/shared-icons";
import { Row } from "@tanstack/react-table";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";

import { VerticalDotsIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomAlertModal } from "@/components/ui/custom";
import { downloadScanZip } from "@/lib/helper";

import { EditScanForm } from "../../forms";

interface DataTableRowActionsProps<ScanProps> {
  row: Row<ScanProps>;
}
const iconClasses = "text-2xl text-default-500 pointer-events-none shrink-0";

export function DataTableRowActions<ScanProps>({
  row,
}: DataTableRowActionsProps<ScanProps>) {
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const scanId = (row.original as { id: string }).id;
  const scanName = (row.original as any).attributes?.name;
  const scanState = (row.original as any).attributes?.state;

  return (
    <>
      <CustomAlertModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit Scan Name"
      >
        <EditScanForm
          scanId={scanId}
          scanName={scanName}
          setIsOpen={setIsEditOpen}
        />
      </CustomAlertModal>

      <div className="relative flex items-center justify-end gap-2">
        <Dropdown
          className="border-border-neutral-secondary bg-bg-neutral-secondary border shadow-xl"
          placement="bottom"
        >
          <DropdownTrigger>
            <Button variant="ghost" size="icon-sm" className="rounded-full">
              <VerticalDotsIcon className="text-slate-400" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            closeOnSelect
            aria-label="Actions"
            color="default"
            variant="flat"
          >
            <DropdownSection title="Download reports">
              <DropdownItem
                key="export"
                description="Available only for completed scans"
                textValue="Download .zip"
                startContent={<DownloadIcon className={iconClasses} />}
                onPress={() => downloadScanZip(scanId, toast)}
                isDisabled={scanState !== "completed"}
              >
                Download .zip
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Actions">
              <DropdownItem
                key="edit"
                description="Allows you to edit the scan name"
                textValue="Edit Scan Name"
                startContent={<EditDocumentBulkIcon className={iconClasses} />}
                onPress={() => setIsEditOpen(true)}
              >
                Edit scan name
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: data-table-row-details.tsx]---
Location: prowler-master/ui/components/scans/table/scans/data-table-row-details.tsx
Signals: React

```typescript
"use client";

import { useEffect, useState } from "react";

import { getProvider } from "@/actions/providers";
import { getScan } from "@/actions/scans";
import { getTask } from "@/actions/task";
import { ScanDetail } from "@/components/scans/table";
import { checkTaskStatus } from "@/lib";
import { ScanProps } from "@/types";

import { SkeletonScanDetail } from "./skeleton-scan-detail";

export const DataTableRowDetails = ({ entityId }: { entityId: string }) => {
  const [scanDetails, setScanDetails] = useState<ScanProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScanDetails = async () => {
      try {
        const result = await getScan(entityId);

        const taskId = result.data.relationships.task?.data?.id;
        const providerId = result.data.relationships.provider?.data?.id;

        let providerDetails = null;
        if (providerId) {
          const formData = new FormData();
          formData.append("id", providerId);
          const providerResult = await getProvider(formData);
          providerDetails = providerResult.data;
        }

        if (taskId) {
          const taskResult = await checkTaskStatus(taskId);

          if (taskResult.completed !== undefined) {
            const task = await getTask(taskId);
            setScanDetails({
              ...result.data,
              taskDetails: task.data,
              providerDetails: providerDetails,
            });
          }
        } else {
          setScanDetails({
            ...result.data,
            providerDetails: providerDetails,
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error in fetchScanDetails:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScanDetails();
  }, [entityId]);

  if (isLoading) {
    return <SkeletonScanDetail />;
  }

  if (!scanDetails) {
    return <div>No scan details available</div>;
  }

  return <ScanDetail scanDetails={scanDetails} />;
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/scans/table/scans/index.ts

```typescript
export * from "./column-get-scans";
export * from "./data-table-row-actions";
export * from "./data-table-row-details";
```

--------------------------------------------------------------------------------

````
