---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 830
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 830 of 867)

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

---[FILE: muted-findings-config-form.tsx]---
Location: prowler-master/ui/components/providers/forms/muted-findings-config-form.tsx
Signals: React

```typescript
"use client";

import { Textarea } from "@heroui/input";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";

import {
  createMutedFindingsConfig,
  deleteMutedFindingsConfig,
  getMutedFindingsConfig,
  updateMutedFindingsConfig,
} from "@/actions/processors";
import { DeleteIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomLink } from "@/components/ui/custom/custom-link";
import { FormButtons } from "@/components/ui/form";
import { fontMono } from "@/config/fonts";
import {
  convertToYaml,
  defaultMutedFindingsConfig,
  parseYamlValidation,
} from "@/lib/yaml";
import {
  MutedFindingsConfigActionState,
  ProcessorData,
} from "@/types/processors";

interface MutedFindingsConfigFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onCancel?: () => void;
}

export const MutedFindingsConfigForm = ({
  setIsOpen,
  onCancel,
}: MutedFindingsConfigFormProps) => {
  const [config, setConfig] = useState<ProcessorData | null>(null);
  const [configText, setConfigText] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [yamlValidation, setYamlValidation] = useState<{
    isValid: boolean;
    error?: string;
  }>({ isValid: true });
  const [hasUserStartedTyping, setHasUserStartedTyping] = useState(false);

  const [state, formAction, isPending] = useActionState<
    MutedFindingsConfigActionState,
    FormData
  >(config ? updateMutedFindingsConfig : createMutedFindingsConfig, null);

  const { toast } = useToast();

  useEffect(() => {
    getMutedFindingsConfig().then((result) => {
      setConfig(result || null);
      const yamlConfig = convertToYaml(result?.attributes.configuration || "");
      setConfigText(yamlConfig);
      setHasUserStartedTyping(false); // Reset when loading initial config
      if (yamlConfig) {
        setYamlValidation(parseYamlValidation(yamlConfig));
      }
    });
  }, []);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Configuration saved successfully",
        description: state.success,
      });
      setIsOpen(false);
    } else if (state?.errors?.general) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: state.errors.general,
      });
    } else if (state?.errors?.configuration) {
      // Reset typing state when there are new server errors
      setHasUserStartedTyping(false);
    }
  }, [state, toast, setIsOpen]);

  const handleConfigChange = (value: string) => {
    setConfigText(value);
    // Clear server errors when user starts typing
    setHasUserStartedTyping(true);
    // Validate YAML in real-time
    const validation = parseYamlValidation(value);
    setYamlValidation(validation);
  };

  const handleDelete = async () => {
    if (!config) return;

    setIsDeleting(true);
    const formData = new FormData();
    formData.append("id", config.id);

    try {
      const result = await deleteMutedFindingsConfig(null, formData);
      if (result?.success) {
        toast({
          title: "Configuration deleted successfully",
          description: result.success,
        });
        setIsOpen(false);
      } else if (result?.errors?.general) {
        toast({
          variant: "destructive",
          title: "Oops! Something went wrong",
          description: result.errors.general,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: "Error deleting configuration. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  if (showDeleteConfirmation) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-default-700 text-lg font-semibold">
          Delete Mutelist Configuration
        </h3>
        <p className="text-default-600 text-sm">
          Are you sure you want to delete this configuration? This action cannot
          be undone.
        </p>
        <div className="flex w-full justify-center gap-6">
          <Button
            type="button"
            aria-label="Cancel"
            className="w-full bg-transparent"
            variant="outline"
            size="lg"
            onClick={() => setShowDeleteConfirmation(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            aria-label="Delete"
            className="w-full"
            variant="destructive"
            size="lg"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? (
              "Deleting"
            ) : (
              <>
                <DeleteIcon size={24} />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {config && <input type="hidden" name="id" value={config.id} />}

      <div className="flex flex-col gap-4">
        <div>
          <ul className="text-default-600 mb-4 list-disc pl-5 text-sm">
            <li>
              <strong>
                This Mutelist configuration will take effect on the next scan.
              </strong>
            </li>
            <li>
              Mutelist configuration can be modified at anytime on the Providers
              and Scans pages.
            </li>
            <li>
              Learn more about configuring the Mutelist{" "}
              <CustomLink href="https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-mute-findings">
                here
              </CustomLink>
              .
            </li>
            <li>
              A default Mutelist is used, to exclude certain predefined
              resources, if no Mutelist is provided.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="configuration"
            className="text-default-700 text-sm font-medium"
          >
            Mutelist Configuration
          </label>
          <div>
            <Textarea
              id="configuration"
              name="configuration"
              placeholder={defaultMutedFindingsConfig}
              variant="bordered"
              value={configText}
              onChange={(e) => handleConfigChange(e.target.value)}
              minRows={20}
              maxRows={20}
              isInvalid={
                (!hasUserStartedTyping && !!state?.errors?.configuration) ||
                !yamlValidation.isValid
              }
              errorMessage={
                (!hasUserStartedTyping && state?.errors?.configuration) ||
                (!yamlValidation.isValid ? yamlValidation.error : "")
              }
              classNames={{
                input: fontMono.className + " text-sm",
                base: "min-h-[400px]",
                errorMessage: "whitespace-pre-wrap",
              }}
            />
            {yamlValidation.isValid && configText && hasUserStartedTyping && (
              <div className="text-tiny text-success my-1 flex items-center px-1">
                <span>Valid YAML format</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <FormButtons
          setIsOpen={setIsOpen}
          onCancel={onCancel}
          submitText={config ? "Update" : "Save"}
          isDisabled={!yamlValidation.isValid || !configText.trim()}
        />

        {config && (
          <Button
            type="button"
            aria-label="Delete Configuration"
            className="w-full"
            variant="outline"
            size="default"
            onClick={() => setShowDeleteConfirmation(true)}
            disabled={isPending}
          >
            <DeleteIcon size={20} />
            Delete Configuration
          </Button>
        )}
      </div>
    </form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: column-providers.tsx]---
Location: prowler-master/ui/components/providers/table/column-providers.tsx

```typescript
"use client";

import { Chip } from "@heroui/chip";
import { ColumnDef } from "@tanstack/react-table";

import { DateWithTime, SnippetChip } from "@/components/ui/entities";
import { DataTableColumnHeader } from "@/components/ui/table";
import { ProviderProps } from "@/types";

import { LinkToScans } from "../link-to-scans";
import { ProviderInfo } from "../provider-info";
import { DataTableRowActions } from "./data-table-row-actions";

interface GroupNameChipsProps {
  groupNames?: string[];
}

const getProviderData = (row: { original: ProviderProps }) => {
  const provider = row.original;
  return {
    attributes: provider.attributes,
    groupNames: provider.groupNames,
  };
};

export const ColumnProviders: ColumnDef<ProviderProps>[] = [
  {
    accessorKey: "account",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Provider"} param="alias" />
    ),
    cell: ({ row }) => {
      const {
        attributes: { connection, provider, alias, uid },
      } = getProviderData(row);
      return (
        <ProviderInfo
          connected={connection.connected}
          provider={provider}
          providerAlias={alias}
          providerUID={uid}
        />
      );
    },
  },
  {
    accessorKey: "scanJobs",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Scan Jobs" />
    ),
    cell: ({ row }) => {
      const {
        attributes: { uid },
      } = getProviderData(row);
      return <LinkToScans providerUid={uid} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "groupNames",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Groups" />
    ),
    cell: ({ row }) => {
      const { groupNames } = getProviderData(row);
      return <GroupNameChips groupNames={groupNames || []} />;
    },
    enableSorting: false,
  },
  {
    accessorKey: "uid",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Provider UID"}
        param="uid"
      />
    ),
    cell: ({ row }) => {
      const {
        attributes: { uid },
      } = getProviderData(row);
      return <SnippetChip value={uid} className="h-7" />;
    },
  },
  {
    accessorKey: "added",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Added"}
        param="inserted_at"
      />
    ),
    cell: ({ row }) => {
      const {
        attributes: { inserted_at },
      } = getProviderData(row);
      return <DateWithTime dateTime={inserted_at} showTime={false} />;
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

export const GroupNameChips: React.FC<GroupNameChipsProps> = ({
  groupNames,
}) => {
  return (
    <div className="flex max-w-[300px] flex-wrap gap-1">
      {groupNames?.map((name, index) => (
        <Chip
          key={index}
          size="sm"
          variant="flat"
          classNames={{
            base: "bg-default-100",
          }}
        >
          {name}
        </Chip>
      ))}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: data-table-row-actions.tsx]---
Location: prowler-master/ui/components/providers/table/data-table-row-actions.tsx
Signals: React, Next.js

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
  AddNoteBulkIcon,
  DeleteDocumentBulkIcon,
  EditDocumentBulkIcon,
} from "@heroui/shared-icons";
import { Row } from "@tanstack/react-table";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { checkConnectionProvider } from "@/actions/providers/providers";
import { VerticalDotsIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { CustomAlertModal } from "@/components/ui/custom";

import { EditForm } from "../forms";
import { DeleteForm } from "../forms/delete-form";

interface DataTableRowActionsProps<ProviderProps> {
  row: Row<ProviderProps>;
}
const iconClasses = "text-2xl text-default-500 pointer-events-none shrink-0";

export function DataTableRowActions<ProviderProps>({
  row,
}: DataTableRowActionsProps<ProviderProps>) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const providerId = (row.original as { id: string }).id;
  const providerType = (row.original as any).attributes?.provider;
  const providerAlias = (row.original as any).attributes?.alias;
  const providerSecretId =
    (row.original as any).relationships?.secret?.data?.id || null;

  const handleTestConnection = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("providerId", providerId);
    await checkConnectionProvider(formData);
    setLoading(false);
  };

  const hasSecret = (row.original as any).relationships?.secret?.data;

  // Calculate disabled keys based on conditions
  const disabledKeys = [];
  if (!hasSecret || loading) {
    disabledKeys.push("new");
  }

  return (
    <>
      <CustomAlertModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit Provider Alias"
      >
        <EditForm
          providerId={providerId}
          providerAlias={providerAlias}
          setIsOpen={setIsEditOpen}
        />
      </CustomAlertModal>
      <CustomAlertModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your provider account and remove your data from the server."
      >
        <DeleteForm providerId={providerId} setIsOpen={setIsDeleteOpen} />
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
            aria-label="Actions"
            color="default"
            variant="flat"
            disabledKeys={disabledKeys}
            closeOnSelect={false}
          >
            <DropdownSection title="Actions">
              <DropdownItem
                key={hasSecret ? "update" : "add"}
                description={
                  hasSecret
                    ? "Update the provider credentials"
                    : "Add the provider credentials"
                }
                textValue={hasSecret ? "Update Credentials" : "Add Credentials"}
                startContent={<EditDocumentBulkIcon className={iconClasses} />}
                onPress={() =>
                  router.push(
                    `/providers/${hasSecret ? "update" : "add"}-credentials?type=${providerType}&id=${providerId}${providerSecretId ? `&secretId=${providerSecretId}` : ""}`,
                  )
                }
                closeOnSelect={true}
              >
                {hasSecret ? "Update Credentials" : "Add Credentials"}
              </DropdownItem>
              <DropdownItem
                key="new"
                description={
                  hasSecret && !loading
                    ? "Check the provider connection"
                    : loading
                      ? "Checking provider connection"
                      : "Add credentials to test the connection"
                }
                textValue="Check Connection"
                startContent={<AddNoteBulkIcon className={iconClasses} />}
                onPress={handleTestConnection}
                closeOnSelect={false}
              >
                {loading ? "Testing..." : "Test Connection"}
              </DropdownItem>
              <DropdownItem
                key="edit"
                description="Allows you to edit the provider"
                textValue="Edit Provider"
                startContent={<EditDocumentBulkIcon className={iconClasses} />}
                onPress={() => setIsEditOpen(true)}
                closeOnSelect={true}
              >
                Edit Provider Alias
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Danger zone">
              <DropdownItem
                key="delete"
                className="text-text-error"
                color="danger"
                description="Delete the provider permanently"
                textValue="Delete Provider"
                startContent={
                  <DeleteDocumentBulkIcon
                    className={clsx(iconClasses, "!text-text-error")}
                  />
                }
                onPress={() => setIsDeleteOpen(true)}
                closeOnSelect={true}
              >
                Delete Provider
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

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/table/index.ts

```typescript
export * from "./column-providers";
export * from "./data-table-row-actions";
export * from "./skeleton-table-provider";
```

--------------------------------------------------------------------------------

---[FILE: skeleton-table-provider.tsx]---
Location: prowler-master/ui/components/providers/table/skeleton-table-provider.tsx
Signals: React

```typescript
import React from "react";

import { Card } from "@/components/shadcn/card/card";
import { Skeleton } from "@/components/shadcn/skeleton/skeleton";

export const SkeletonTableProviders = () => {
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

---[FILE: credentials-role-helper.tsx]---
Location: prowler-master/ui/components/providers/workflow/credentials-role-helper.tsx

```typescript
"use client";

import { IdIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { SnippetChip } from "@/components/ui/entities";
import { IntegrationType } from "@/types/integrations";

interface CredentialsRoleHelperProps {
  externalId: string;
  templateLinks: {
    cloudformation: string;
    cloudformationQuickLink: string;
    terraform: string;
  };
  integrationType?: IntegrationType;
}

export const CredentialsRoleHelper = ({
  externalId,
  templateLinks,
  integrationType,
}: CredentialsRoleHelperProps) => {
  const isAmazonS3 = integrationType === "amazon_s3";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A <strong>read-only IAM role</strong> must be manually created
          {isAmazonS3 ? " or updated" : ""}
        </p>

        <Button
          aria-label="Use the following AWS CloudFormation Quick Link to deploy the IAM Role"
          variant="link"
          className="h-auto w-fit min-w-0 p-0"
          asChild
        >
          <a
            href={templateLinks.cloudformationQuickLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Use the following AWS CloudFormation Quick Link to create the IAM
            Role
          </a>
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs font-bold text-gray-900 dark:text-gray-300">
            or
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isAmazonS3
            ? "Refer to the documentation"
            : "Use one of the following templates to create the IAM role"}
        </p>

        <div className="flex w-fit flex-col gap-2">
          <Button
            aria-label="CloudFormation Template"
            variant="link"
            className="h-auto w-fit min-w-0 p-0"
            asChild
          >
            <a
              href={templateLinks.cloudformation}
              target="_blank"
              rel="noopener noreferrer"
            >
              CloudFormation {integrationType ? "" : "Template"}
            </a>
          </Button>
          <Button
            aria-label="Terraform Code"
            variant="link"
            className="h-auto w-fit min-w-0 p-0"
            asChild
          >
            <a
              href={templateLinks.terraform}
              target="_blank"
              rel="noopener noreferrer"
            >
              Terraform {integrationType ? "" : "Code"}
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-default-500 block text-xs font-medium">
            External ID:
          </span>
          <SnippetChip value={externalId} icon={<IdIcon size={16} />} />
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/providers/workflow/index.ts

```typescript
export * from "./credentials-role-helper";
export * from "./provider-title-docs";
export * from "./skeleton-provider-workflow";
export * from "./vertical-steps";
export * from "./workflow-add-provider";
```

--------------------------------------------------------------------------------

---[FILE: provider-title-docs.tsx]---
Location: prowler-master/ui/components/providers/workflow/provider-title-docs.tsx

```typescript
"use client";

import { CustomLink } from "@/components/ui/custom/custom-link";
import { getProviderName } from "@/components/ui/entities/get-provider-logo";
import { getProviderLogo } from "@/components/ui/entities/get-provider-logo";
import { getProviderHelpText } from "@/lib";
import { ProviderType } from "@/types";

export const ProviderTitleDocs = ({
  providerType,
}: {
  providerType: ProviderType;
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-4">
        {providerType && getProviderLogo(providerType as ProviderType)}
        <span className="text-lg font-semibold">
          {providerType
            ? getProviderName(providerType as ProviderType)
            : "Unknown Provider"}
        </span>
      </div>
      <div className="flex items-end gap-x-2">
        <p className="text-default-500 text-sm">
          {getProviderHelpText(providerType as string).text}
        </p>
        <CustomLink
          href={getProviderHelpText(providerType as string).link}
          size="sm"
          className="text-nowrap"
        >
          Read the docs
        </CustomLink>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: skeleton-provider-workflow.tsx]---
Location: prowler-master/ui/components/providers/workflow/skeleton-provider-workflow.tsx

```typescript
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export const SkeletonProviderWorkflow = () => {
  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-2">
        <Skeleton className="h-6 w-2/3 rounded-lg">
          <div className="bg-default-200 h-6"></div>
        </Skeleton>
        <Skeleton className="h-4 w-1/2 rounded-lg">
          <div className="bg-default-200 h-4"></div>
        </Skeleton>
      </CardHeader>
      <CardBody className="flex flex-col items-start gap-6">
        <div className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded-lg">
            <div className="bg-default-200 h-12 w-12"></div>
          </Skeleton>
          <Skeleton className="h-12 w-12 rounded-lg">
            <div className="bg-default-200 h-12 w-12"></div>
          </Skeleton>
        </div>
        <Skeleton className="h-5 w-3/4 rounded-lg">
          <div className="bg-default-200 h-5"></div>
        </Skeleton>
        <Skeleton className="h-12 w-40 self-end rounded-lg">
          <div className="bg-default-200 h-12"></div>
        </Skeleton>
      </CardBody>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: vertical-steps.tsx]---
Location: prowler-master/ui/components/providers/workflow/vertical-steps.tsx
Signals: React

```typescript
"use client";

import { cn } from "@heroui/theme";
import { useControlledState } from "@react-stately/utils";
import { domAnimation, LazyMotion, m } from "framer-motion";
import type { ComponentProps } from "react";
import React from "react";

export type VerticalStepProps = {
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
};

export interface VerticalStepsProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * An array of steps.
   *
   * @default []
   */
  steps?: VerticalStepProps[];
  /**
   * The color of the steps.
   *
   * @default "primary"
   */
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "default";
  /**
   * The current step index.
   */
  currentStep?: number;
  /**
   * The default step index.
   *
   * @default 0
   */
  defaultStep?: number;
  /**
   * Whether to hide the progress bars.
   *
   * @default false
   */
  hideProgressBars?: boolean;
  /**
   * The custom class for the steps wrapper.
   */
  className?: string;
  /**
   * The custom class for the step.
   */
  stepClassName?: string;
  /**
   * Callback function when the step index changes.
   */
  onStepChange?: (stepIndex: number) => void;
}

function CheckIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <m.path
        animate={{ pathLength: 1 }}
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        transition={{
          delay: 0.2,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
      />
    </svg>
  );
}

export const VerticalSteps = React.forwardRef<
  HTMLButtonElement,
  VerticalStepsProps
>(
  (
    {
      color = "primary",
      steps = [],
      defaultStep = 0,
      onStepChange,
      currentStep: currentStepProp,
      hideProgressBars = false,
      stepClassName,
      className,
      ...props
    },
    ref,
  ) => {
    const [currentStep, setCurrentStep] = useControlledState(
      currentStepProp,
      defaultStep,
      onStepChange,
    );

    const colors = React.useMemo(() => {
      let userColor;
      let fgColor;

      const colorsVars = [
        "[--active-fg-color:var(--step-fg-color)]",
        "[--active-border-color:var(--step-color)]",
        "[--active-color:var(--step-color)]",
        "[--complete-background-color:var(--step-color)]",
        "[--complete-border-color:var(--step-color)]",
        "[--inactive-border-color:hsl(var(--heroui-default-300))]",
        "[--inactive-color:hsl(var(--heroui-default-300))]",
      ];

      switch (color) {
        case "primary":
          userColor = "[--step-color:hsl(var(--heroui-primary))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-primary-foreground))]";
          break;
        case "secondary":
          userColor = "[--step-color:hsl(var(--heroui-secondary))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-secondary-foreground))]";
          break;
        case "success":
          userColor = "[--step-color:hsl(var(--heroui-success))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-success-foreground))]";
          break;
        case "warning":
          userColor = "[--step-color:hsl(var(--heroui-warning))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-warning-foreground))]";
          break;
        case "danger":
          userColor = "[--step-color:hsl(var(--heroui-error))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-error-foreground))]";
          break;
        case "default":
          userColor = "[--step-color:hsl(var(--heroui-default))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-default-foreground))]";
          break;
        default:
          userColor = "[--step-color:hsl(var(--heroui-primary))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-primary-foreground))]";
          break;
      }

      if (!className?.includes("--step-fg-color")) colorsVars.unshift(fgColor);
      if (!className?.includes("--step-color")) colorsVars.unshift(userColor);
      if (!className?.includes("--inactive-bar-color"))
        colorsVars.push(
          "[--inactive-bar-color:hsl(var(--heroui-default-300))]",
        );

      return colorsVars;
    }, [color, className]);

    return (
      <nav aria-label="Progress" className="max-w-fit">
        <ol className={cn("flex flex-col gap-y-3", colors, className)}>
          {steps?.map((step, stepIdx) => {
            const status =
              currentStep === stepIdx
                ? "active"
                : currentStep < stepIdx
                  ? "inactive"
                  : "complete";

            return (
              <li key={stepIdx} className="relative">
                <div className="flex w-full max-w-full items-center">
                  <button
                    key={stepIdx}
                    ref={ref}
                    aria-current={status === "active" ? "step" : undefined}
                    className={cn(
                      "group rounded-large flex w-full cursor-pointer items-center justify-center gap-4 px-3 py-2.5",
                      stepClassName,
                    )}
                    onClick={() => setCurrentStep(stepIdx)}
                    {...props}
                  >
                    <div className="flex h-full items-center">
                      <LazyMotion features={domAnimation}>
                        <div className="relative">
                          <m.div
                            animate={status}
                            className={cn(
                              "border-medium text-large text-default-foreground relative flex h-[34px] w-[34px] items-center justify-center rounded-full font-semibold",
                              {
                                "shadow-lg": status === "complete",
                              },
                            )}
                            data-status={status}
                            initial={false}
                            transition={{ duration: 0.25 }}
                            variants={{
                              inactive: {
                                backgroundColor: "transparent",
                                borderColor: "var(--inactive-border-color)",
                                color: "var(--inactive-color)",
                              },
                              active: {
                                backgroundColor: "transparent",
                                borderColor: "var(--bg-button-primary)",
                                color: "var(--bg-button-primary)",
                              },
                              complete: {
                                backgroundColor: "var(--bg-button-primary)",
                                borderColor: "var(--bg-button-primary)",
                              },
                            }}
                          >
                            <div className="flex items-center justify-center">
                              {status === "complete" ? (
                                <CheckIcon className="h-6 w-6 text-(--active-fg-color)" />
                              ) : (
                                <span>{stepIdx + 1}</span>
                              )}
                            </div>
                          </m.div>
                        </div>
                      </LazyMotion>
                    </div>
                    <div className="flex-1 text-left">
                      <div>
                        <div
                          className={cn(
                            "text-medium text-default-foreground font-medium transition-[color,opacity] duration-300 group-active:opacity-70",
                            {
                              "text-default-500": status === "inactive",
                            },
                          )}
                        >
                          {step.title}
                        </div>
                        <div
                          className={cn(
                            "text-tiny text-default-600 lg:text-small transition-[color,opacity] duration-300 group-active:opacity-70",
                            {
                              "text-default-500": status === "inactive",
                            },
                          )}
                        >
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
                {stepIdx < steps.length - 1 && !hideProgressBars && (
                  <div
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute top-[calc(64px*var(--idx)+1)] left-3 flex h-1/2 -translate-y-1/3 items-center px-4",
                    )}
                    style={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      "--idx": stepIdx,
                    }}
                  >
                    <div
                      className={cn(
                        "relative h-full w-0.5 bg-(--inactive-bar-color) transition-colors duration-300",
                        "after:absolute after:block after:h-0 after:w-full after:bg-(--active-border-color) after:transition-[height] after:duration-300 after:content-['']",
                        {
                          "after:h-full": stepIdx < currentStep,
                        },
                      )}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

VerticalSteps.displayName = "VerticalSteps";
```

--------------------------------------------------------------------------------

---[FILE: workflow-add-provider.tsx]---
Location: prowler-master/ui/components/providers/workflow/workflow-add-provider.tsx
Signals: React, Next.js

```typescript
"use client";

import { Progress } from "@heroui/progress";
import { Spacer } from "@heroui/spacer";
import { usePathname } from "next/navigation";
import React from "react";

import { VerticalSteps } from "./vertical-steps";

const steps = [
  {
    title: "Choose your Cloud Provider",
    description:
      "Select the cloud provider you wish to connect and specify your preferred authentication method from the supported options.",
    href: "/providers/connect-account",
  },
  {
    title: "Enter Authentication Details",
    description:
      "Provide the necessary credentials to establish a secure connection to your selected cloud provider.",
    href: "/providers/add-credentials",
  },
  {
    title: "Verify Connection & Start Scan",
    description:
      "Ensure your credentials are correct and start scanning your cloud environment.",
    href: "/providers/test-connection",
  },
];

const ROUTE_CONFIG: Record<
  string,
  {
    stepIndex: number;
    stepOverride?: { index: number; title: string; description: string };
  }
> = {
  "/providers/connect-account": { stepIndex: 0 },
  "/providers/add-credentials": { stepIndex: 1 },
  "/providers/test-connection": { stepIndex: 2 },
  "/providers/update-credentials": {
    stepIndex: 1,
    stepOverride: {
      index: 2,
      title: "Make sure the new credentials are valid",
      description: "Valid credentials will take you back to the providers page",
    },
  },
};

export const WorkflowAddProvider = () => {
  const pathname = usePathname();

  const config = ROUTE_CONFIG[pathname] || { stepIndex: 0 };
  const currentStep = config.stepIndex;

  const updatedSteps = steps.map((step, index) => {
    if (config.stepOverride && index === config.stepOverride.index) {
      return { ...step, ...config.stepOverride };
    }
    return step;
  });

  return (
    <section className="max-w-sm">
      <h1 className="mb-2 text-xl font-medium" id="getting-started">
        Add a Cloud Provider
      </h1>
      <p className="text-small text-default-500 mb-5">
        Complete these steps to configure your cloud provider and initiate your
        first scan.
      </p>
      <Progress
        classNames={{
          base: "px-0.5 mb-5",
          label: "text-small",
          value: "text-small text-button-primary",
          indicator: "bg-button-primary",
        }}
        label="Steps"
        maxValue={steps.length - 1}
        minValue={0}
        showValueLabel={true}
        size="md"
        value={currentStep}
        valueLabel={`${currentStep + 1} of ${steps.length}`}
      />
      <VerticalSteps
        hideProgressBars
        currentStep={currentStep}
        stepClassName="border border-border-neutral-primary aria-[current]:border-button-primary aria-[current]:text-text-neutral-primary cursor-default"
        steps={updatedSteps}
      />
      <Spacer y={4} />
    </section>
  );
};
```

--------------------------------------------------------------------------------

````
