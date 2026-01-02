---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 793
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 793 of 867)

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

---[FILE: send-to-jira-modal.tsx]---
Location: prowler-master/ui/components/findings/send-to-jira-modal.tsx
Signals: React, Zod

```typescript
"use client";

import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Selection } from "@react-types/shared";
import { Search, Send } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  getJiraIntegrations,
  pollJiraDispatchTask,
  sendFindingToJira,
} from "@/actions/integrations/jira-dispatch";
import { JiraIcon } from "@/components/icons/services/IconServices";
import { useToast } from "@/components/ui";
import { CustomAlertModal } from "@/components/ui/custom";
import { CustomBanner } from "@/components/ui/custom/custom-banner";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { FormButtons } from "@/components/ui/form/form-buttons";
import { IntegrationProps } from "@/types/integrations";

interface SendToJiraModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  findingId: string;
  findingTitle?: string;
}

const sendToJiraSchema = z.object({
  integration: z.string().min(1, "Please select a Jira integration"),
  project: z.string().min(1, "Please select a project"),
  issueType: z.string().min(1, "Please select an issue type"),
});

type SendToJiraFormData = z.infer<typeof sendToJiraSchema>;

const selectorClassNames = {
  trigger: "min-h-12",
  popoverContent: "bg-bg-neutral-secondary",
  listboxWrapper: "max-h-[300px] bg-bg-neutral-secondary",
  listbox: "gap-0",
  label: "tracking-tight font-light !text-text-neutral-secondary text-xs z-0!",
  value: "text-text-neutral-secondary text-small",
};

// The commented code is related to issue types, which are not required for the first implementation, but will be used in the future
export const SendToJiraModal = ({
  isOpen,
  onOpenChange,
  findingId,
  findingTitle,
}: SendToJiraModalProps) => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<IntegrationProps[]>([]);
  const [isFetchingIntegrations, setIsFetchingIntegrations] = useState(false);
  const [searchProjectValue, setSearchProjectValue] = useState("");
  // const [searchIssueTypeValue, setSearchIssueTypeValue] = useState("");

  const form = useForm<SendToJiraFormData>({
    resolver: zodResolver(sendToJiraSchema),
    defaultValues: {
      integration: "",
      project: "",
      // Default to Task while issue types are not fetched/required
      issueType: "Task",
    },
  });

  const selectedIntegration = form.watch("integration");
  // const selectedProject = form.watch("project");

  const hasConnectedIntegration = integrations.some(
    (i) => i.attributes.connected === true,
  );

  const getSelectedValue = (keys: Selection): string => {
    if (keys === "all") return "";
    const first = Array.from(keys)[0];
    return first !== null ? String(first) : "";
  };

  const setOpenForFormButtons: Dispatch<SetStateAction<boolean>> = (value) => {
    const next = typeof value === "function" ? value(isOpen) : value;
    onOpenChange(next);
  };

  // Fetch Jira integrations when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchJiraIntegrations = async () => {
        setIsFetchingIntegrations(true);

        try {
          const result = await getJiraIntegrations();
          if (!result.success) {
            throw new Error(
              result.error || "Unable to fetch Jira integrations",
            );
          }
          setIntegrations(result.data);
          // Auto-select if only one integration
          if (result.data.length === 1) {
            form.setValue("integration", result.data[0].id);
          }
        } catch (error) {
          const message =
            error instanceof Error && error.message
              ? error.message
              : "Failed to load Jira integrations";
          toast({
            variant: "destructive",
            title: "Failed to load integrations",
            description: message,
          });
        } finally {
          setIsFetchingIntegrations(false);
        }
      };

      fetchJiraIntegrations();
    } else {
      // Reset form when modal closes
      form.reset();
      setSearchProjectValue("");
      // setSearchIssueTypeValue("");
    }
  }, [isOpen, form, toast]);

  const handleSubmit = async (data: SendToJiraFormData) => {
    // Close modal immediately; continue processing in background
    onOpenChange(false);

    void (async () => {
      try {
        // Send the finding to Jira
        const result = await sendFindingToJira(
          data.integration,
          findingId,
          data.project,
          data.issueType,
        );

        if (!result.success) {
          throw new Error(result.error || "Failed to send to Jira");
        }

        // Poll for task completion and notify once
        const taskResult = await pollJiraDispatchTask(result.taskId);

        if (!taskResult.success) {
          throw new Error(taskResult.error || "Failed to create Jira issue");
        }

        toast({
          title: "Success!",
          description:
            taskResult.message || "Finding sent to Jira successfully",
        });
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : "Failed to send finding to Jira";
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
      }
    })();
  };

  const selectedIntegrationData = integrations.find(
    (i) => i.id === selectedIntegration,
  );

  const projects: Record<string, string> =
    selectedIntegrationData?.attributes.configuration.projects ??
    ({} as Record<string, string>);

  const projectEntries = Object.entries(projects);
  const shouldShowProjectSearch = projectEntries.length > 5;
  // const issueTypes: string[] =
  //   selectedIntegrationData?.attributes.configuration.issue_types ||
  //   ([] as string[]);

  // Filter projects based on search
  const filteredProjects = (() => {
    if (!searchProjectValue) return projectEntries;

    const lowerSearch = searchProjectValue.toLowerCase();
    return projectEntries.filter(
      ([key, name]) =>
        key.toLowerCase().includes(lowerSearch) ||
        name.toLowerCase().includes(lowerSearch),
    );
  })();

  // Filter issue types based on search
  // const filteredIssueTypes = useMemo(() => {
  //   if (!searchIssueTypeValue) return issueTypes;

  //   const lowerSearch = searchIssueTypeValue.toLowerCase();
  //   return issueTypes.filter((type) =>
  //     type.toLowerCase().includes(lowerSearch),
  //   );
  // }, [issueTypes, searchIssueTypeValue]);

  return (
    <CustomAlertModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Send Finding to Jira"
      description={
        findingTitle
          ? `Create a Jira issue for: "${findingTitle}"`
          : "Select integration, project and issue type to create a Jira issue"
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Integration Selection */}
          {integrations.length > 1 && (
            <FormField
              control={form.control}
              name="integration"
              render={({ field }) => (
                <>
                  <FormControl>
                    <Select
                      label="Jira Integration"
                      placeholder="Select a Jira integration"
                      selectedKeys={
                        field.value ? new Set([field.value]) : new Set()
                      }
                      onSelectionChange={(keys: Selection) => {
                        const value = getSelectedValue(keys);
                        field.onChange(value);
                        // Reset dependent fields
                        form.setValue("project", "");
                        // Keep issue type defaulting to Task
                        form.setValue("issueType", "Task");
                        setSearchProjectValue("");
                        // setSearchIssueTypeValue("");
                      }}
                      variant="bordered"
                      labelPlacement="inside"
                      isDisabled={isFetchingIntegrations}
                      isInvalid={!!form.formState.errors.integration}
                      startContent={<JiraIcon size={16} />}
                      classNames={selectorClassNames}
                    >
                      {integrations.map((integration) => (
                        <SelectItem
                          key={integration.id}
                          textValue={
                            integration.attributes.configuration.domain
                          }
                        >
                          <div className="flex items-center gap-2">
                            <JiraIcon size={16} />
                            <span>
                              {integration.attributes.configuration.domain}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage className="text-text-error text-xs" />
                </>
              )}
            />
          )}

          {/* Project Selection - Enhanced Style */}
          {selectedIntegration && Object.keys(projects).length > 0 && (
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <>
                  <FormControl>
                    <Select
                      label="Project"
                      placeholder="Select a Jira project"
                      selectedKeys={
                        field.value ? new Set([field.value]) : new Set()
                      }
                      onSelectionChange={(keys: Selection) => {
                        const value = getSelectedValue(keys);
                        field.onChange(value);
                        // Keep issue type defaulting to Task when project changes
                        form.setValue("issueType", "Task");
                        // setSearchIssueTypeValue("");
                      }}
                      variant="bordered"
                      labelPlacement="inside"
                      isInvalid={!!form.formState.errors.project}
                      classNames={selectorClassNames}
                      listboxProps={{
                        topContent: shouldShowProjectSearch ? (
                          <div className="sticky top-0 z-10 py-2">
                            <Input
                              isClearable
                              placeholder="Search projects..."
                              size="sm"
                              variant="bordered"
                              startContent={<Search size={16} />}
                              value={searchProjectValue}
                              onValueChange={setSearchProjectValue}
                              onClear={() => setSearchProjectValue("")}
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
                      {filteredProjects.map(([key, name]) => (
                        <SelectItem key={key} textValue={`${key} - ${name}`}>
                          <div className="flex w-full items-center justify-between py-1">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-small font-semibold">
                                    {key}
                                  </span>
                                  <span className="text-tiny text-default-500">
                                    -
                                  </span>
                                  <span className="text-small truncate">
                                    {name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage className="text-text-error text-xs" />
                </>
              )}
            />
          )}

          {/* No integrations or none connected message */}
          {!isFetchingIntegrations &&
          (integrations.length === 0 || !hasConnectedIntegration) ? (
            <CustomBanner
              title="Jira integration is not available"
              message="Please add or connect an integration first"
              buttonLabel="Configure"
              buttonLink="/integrations/jira"
            />
          ) : (
            <FormButtons
              setIsOpen={setOpenForFormButtons}
              onCancel={() => onOpenChange(false)}
              submitText="Send to Jira"
              cancelText="Cancel"
              loadingText="Sending..."
              isDisabled={
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                isFetchingIntegrations ||
                integrations.length === 0 ||
                !hasConnectedIntegration
              }
              rightIcon={<Send size={20} />}
            />
          )}
        </form>
      </Form>
    </CustomAlertModal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: column-findings.tsx]---
Location: prowler-master/ui/components/findings/table/column-findings.tsx
Signals: Next.js

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Database } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { DataTableRowDetails } from "@/components/findings/table";
import { DataTableRowActions } from "@/components/findings/table/data-table-row-actions";
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

import { Muted } from "../muted";
import { DeltaIndicator } from "./delta-indicator";

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

  const handleOpenChange = (open: boolean) => {
    const params = new URLSearchParams(searchParams);

    if (open) {
      params.set("id", row.original.id);
    } else {
      params.delete("id");
    }

    window.history.pushState({}, "", `?${params.toString()}`);
  };

  return (
    <div className="flex max-w-10 justify-center">
      <TriggerSheet
        triggerComponent={
          <InfoIcon className="text-button-primary" size={16} />
        }
        title="Finding Details"
        description="View the finding details"
        defaultOpen={isOpen}
        onOpenChange={handleOpenChange}
      >
        <DataTableRowDetails
          entityId={row.original.id}
          findingDetails={row.original}
        />
      </TriggerSheet>
    </div>
  );
};

export const ColumnFindings: ColumnDef<FindingProps>[] = [
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
      <DataTableColumnHeader
        column={column}
        title={"Finding"}
        param="check_id"
      />
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
            ) : null}
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
          formatter={(value: string) => `...${value.slice(-10)}`}
          icon={<Database size={16} />}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "severity",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Severity"}
        param="severity"
      />
    ),
    cell: ({ row }) => {
      const {
        attributes: { severity },
      } = getFindingsData(row);
      return <SeverityBadge severity={severity} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Status"} param="status" />
    ),
    cell: ({ row }) => {
      const {
        attributes: { status },
      } = getFindingsData(row);

      return <StatusFindingBadge status={status} />;
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Last seen"}
        param="updated_at"
      />
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
  },
  // {
  //   accessorKey: "scanName",
  //   header: "Scan Name",
  //   cell: ({ row }) => {
  //     const name = getScanData(row, "name");

  //     return (
  //       <p className="text-small">
  //         {typeof name === "string" || typeof name === "number"
  //           ? name
  //           : "Invalid data"}
  //       </p>
  //     );
  //   },
  // },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Region" />
    ),
    cell: ({ row }) => {
      const region = getResourceData(row, "region");

      return (
        <div className="w-[80px] text-xs">
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
      return <p className="max-w-96 truncate text-xs">{servicename}</p>;
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
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    },
    enableSorting: false,
  },
];
```

--------------------------------------------------------------------------------

---[FILE: data-table-row-actions.tsx]---
Location: prowler-master/ui/components/findings/table/data-table-row-actions.tsx
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
import { Row } from "@tanstack/react-table";
import { useState } from "react";

import { SendToJiraModal } from "@/components/findings/send-to-jira-modal";
import { VerticalDotsIcon } from "@/components/icons";
import { JiraIcon } from "@/components/icons/services/IconServices";
import { Button } from "@/components/shadcn";
import type { FindingProps } from "@/types/components";

interface DataTableRowActionsProps {
  row: Row<FindingProps>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const finding = row.original;
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);

  const findingTitle =
    finding.attributes.check_metadata?.checktitle || "Security Finding";

  return (
    <>
      <SendToJiraModal
        isOpen={isJiraModalOpen}
        onOpenChange={setIsJiraModalOpen}
        findingId={finding.id}
        findingTitle={findingTitle}
      />

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
            aria-label="Finding actions"
            color="default"
            variant="flat"
          >
            <DropdownSection title="Actions">
              <DropdownItem
                key="jira"
                description="Create a Jira issue for this finding"
                textValue="Send to Jira"
                startContent={
                  <JiraIcon
                    size={20}
                    className="text-default-500 pointer-events-none shrink-0"
                  />
                }
                onPress={() => setIsJiraModalOpen(true)}
              >
                Send to Jira
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
Location: prowler-master/ui/components/findings/table/data-table-row-details.tsx

```typescript
"use client";

import { FindingProps } from "@/types/components";

import { FindingDetail } from "./finding-detail";

export const DataTableRowDetails = ({
  findingDetails,
}: {
  entityId: string;
  findingDetails: FindingProps;
}) => {
  return <FindingDetail findingDetails={findingDetails} />;
};
```

--------------------------------------------------------------------------------

---[FILE: delta-indicator.tsx]---
Location: prowler-master/ui/components/findings/table/delta-indicator.tsx

```typescript
import { Tooltip } from "@heroui/tooltip";

import { Button } from "@/components/shadcn";
import { cn } from "@/lib/utils";

interface DeltaIndicatorProps {
  delta: string;
}

export const DeltaIndicator = ({ delta }: DeltaIndicatorProps) => {
  return (
    <Tooltip
      className="pointer-events-auto"
      content={
        <div className="flex gap-1 text-xs">
          <span>
            {delta === "new"
              ? "New finding."
              : "Status changed since the previous scan."}
          </span>
          <Button
            aria-label="Learn more about findings"
            variant="link"
            size="default"
            className="text-button-primary h-auto min-w-0 p-0 text-xs"
            asChild
          >
            <a
              href="https://docs.prowler.com/user-guide/tutorials/prowler-app#step-8:-analyze-the-findings"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </Button>
        </div>
      }
    >
      <div
        className={cn(
          "h-2 w-2 min-w-2 cursor-pointer rounded-full",
          delta === "new"
            ? "bg-system-severity-high"
            : delta === "changed"
              ? "bg-system-severity-low"
              : "bg-gray-500",
        )}
      />
    </Tooltip>
  );
};
```

--------------------------------------------------------------------------------

````
