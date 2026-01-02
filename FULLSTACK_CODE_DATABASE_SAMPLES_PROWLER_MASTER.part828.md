---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 828
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 828 of 867)

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

---[FILE: tooltip.tsx]---
Location: prowler-master/ui/components/lighthouse/ai-elements/tooltip.tsx
Signals: React

```typescript
"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
```

--------------------------------------------------------------------------------

---[FILE: delete-llm-provider-form.tsx]---
Location: prowler-master/ui/components/lighthouse/forms/delete-llm-provider-form.tsx
Signals: React, Next.js, Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { deleteLighthouseProviderByType } from "@/actions/lighthouse/lighthouse";
import { DeleteIcon } from "@/components/icons";
import { useToast } from "@/components/ui";
import { Form, FormButtons } from "@/components/ui/form";
import type { LighthouseProvider } from "@/types/lighthouse";

const formSchema = z.object({
  providerType: z.string(),
});

export const DeleteLLMProviderForm = ({
  providerType,
  setIsOpen,
}: {
  providerType: LighthouseProvider;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();
  const isLoading = form.formState.isSubmitting;

  async function onSubmitClient(formData: FormData) {
    const providerType = formData.get("providerType") as LighthouseProvider;
    const data = await deleteLighthouseProviderByType(providerType);

    if (data?.errors && data.errors.length > 0) {
      const error = data.errors[0];
      const errorMessage = `${error.detail}`;
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: errorMessage,
      });
    } else {
      toast({
        title: "Success!",
        description: "The LLM provider was removed successfully.",
      });

      setIsOpen(false);
      router.push("/lighthouse/config");
    }
  }

  return (
    <Form {...form}>
      <form action={onSubmitClient}>
        <input
          type="hidden"
          name="providerType"
          value={providerType}
          aria-label="Provider Type"
        />
        <FormButtons
          setIsOpen={setIsOpen}
          submitText="Delete"
          submitColor="danger"
          rightIcon={<DeleteIcon size={24} />}
          isDisabled={isLoading}
        />
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/lighthouse/workflow/index.ts

```typescript
export * from "./workflow-connect-llm";
```

--------------------------------------------------------------------------------

---[FILE: workflow-connect-llm.tsx]---
Location: prowler-master/ui/components/lighthouse/workflow/workflow-connect-llm.tsx
Signals: React, Next.js

```typescript
"use client";

import { Progress } from "@heroui/progress";
import { Spacer } from "@heroui/spacer";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

import { VerticalSteps } from "@/components/providers/workflow/vertical-steps";
import type { LighthouseProvider } from "@/types/lighthouse";

import { getProviderConfig } from "../llm-provider-registry";

const steps = [
  {
    title: "Enter Credentials",
    description:
      "Enter your API key and configure connection settings for the LLM provider.",
    href: "/lighthouse/config/connect",
  },
  {
    title: "Select Default Model",
    description:
      "Choose the default model to use for AI-powered features in Prowler.",
    href: "/lighthouse/config/select-model",
  },
];

const ROUTE_CONFIG: Record<
  string,
  {
    stepIndex: number;
  }
> = {
  "/lighthouse/config/connect": { stepIndex: 0 },
  "/lighthouse/config/select-model": { stepIndex: 1 },
};

export const WorkflowConnectLLM = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const config = ROUTE_CONFIG[pathname] || { stepIndex: 0 };
  const currentStep = config.stepIndex;

  const provider = searchParams.get("provider") as LighthouseProvider | null;
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit";

  // Get provider name from registry
  const providerConfig = provider ? getProviderConfig(provider) : null;
  const providerName = providerConfig?.name || "LLM Provider";

  return (
    <section className="max-w-sm">
      <h1 className="mb-2 text-xl font-medium" id="getting-started">
        {isEditMode ? `Configure ${providerName}` : `Connect ${providerName}`}
      </h1>
      <p className="text-small text-default-500 mb-5">
        {isEditMode
          ? "Update your LLM provider configuration and settings."
          : "Follow these steps to configure your LLM provider and enable AI-powered features."}
      </p>
      <Progress
        classNames={{
          base: "px-0.5 mb-5",
          label: "text-small",
          value: "text-small text-button-primary",
          indicator: "bg-button-primary",
        }}
        label="Steps"
        maxValue={steps.length}
        minValue={0}
        showValueLabel={true}
        size="md"
        value={currentStep + 1}
        valueLabel={`${currentStep + 1} of ${steps.length}`}
      />
      <VerticalSteps
        hideProgressBars
        currentStep={currentStep}
        stepClassName="border border-border-neutral-primary aria-[current]:bg-bg-neutral-primary cursor-default"
        steps={steps}
      />
      <Spacer y={4} />
    </section>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/manage-groups/index.ts

```typescript
export * from "./manage-groups-button";
export * from "./skeleton-manage-groups";
```

--------------------------------------------------------------------------------

---[FILE: manage-groups-button.tsx]---
Location: prowler-master/ui/components/manage-groups/manage-groups-button.tsx
Signals: Next.js

```typescript
"use client";

import { SettingsIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn";

export const ManageGroupsButton = () => {
  return (
    <Button asChild variant="outline">
      <Link href="/manage-groups">
        <SettingsIcon size={20} />
        Manage Groups
      </Link>
    </Button>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: skeleton-manage-groups.tsx]---
Location: prowler-master/ui/components/manage-groups/skeleton-manage-groups.tsx
Signals: React

```typescript
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import React from "react";

export const SkeletonManageGroups = () => {
  return (
    <Card className="flex h-full w-full flex-col gap-5 p-4" radius="sm">
      {/* Table headers */}
      <div className="hidden justify-between md:flex">
        <Skeleton className="w-1/12 rounded-lg">
          <div className="bg-default-200 h-8"></div>
        </Skeleton>
        <Skeleton className="w-2/12 rounded-lg">
          <div className="bg-default-200 h-8"></div>
        </Skeleton>
        <Skeleton className="w-2/12 rounded-lg">
          <div className="bg-default-200 h-8"></div>
        </Skeleton>
        <Skeleton className="w-2/12 rounded-lg">
          <div className="bg-default-200 h-8"></div>
        </Skeleton>
        <Skeleton className="w-2/12 rounded-lg">
          <div className="bg-default-200 h-8"></div>
        </Skeleton>
        <Skeleton className="w-1/12 rounded-lg">
          <div className="bg-default-200 h-8"></div>
        </Skeleton>
        <Skeleton className="w-1/12 rounded-lg">
          <div className="bg-default-200 h-8"></div>
        </Skeleton>
      </div>

      {/* Table body */}
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-between md:flex-row md:gap-4"
          >
            <Skeleton className="mb-2 w-full rounded-lg md:mb-0 md:w-1/12">
              <div className="bg-default-300 h-12"></div>
            </Skeleton>
            <Skeleton className="mb-2 w-full rounded-lg md:mb-0 md:w-2/12">
              <div className="bg-default-300 h-12"></div>
            </Skeleton>
            <Skeleton className="mb-2 hidden rounded-lg sm:flex md:mb-0 md:w-2/12">
              <div className="bg-default-300 h-12"></div>
            </Skeleton>
            <Skeleton className="mb-2 hidden rounded-lg sm:flex md:mb-0 md:w-2/12">
              <div className="bg-default-300 h-12"></div>
            </Skeleton>
            <Skeleton className="mb-2 hidden rounded-lg sm:flex md:mb-0 md:w-2/12">
              <div className="bg-default-300 h-12"></div>
            </Skeleton>
            <Skeleton className="mb-2 hidden rounded-lg sm:flex md:mb-0 md:w-1/12">
              <div className="bg-default-300 h-12"></div>
            </Skeleton>
            <Skeleton className="mb-2 hidden rounded-lg sm:flex md:mb-0 md:w-1/12">
              <div className="bg-default-300 h-12"></div>
            </Skeleton>
          </div>
        ))}
      </div>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: add-group-form.tsx]---
Location: prowler-master/ui/components/manage-groups/forms/add-group-form.tsx
Signals: Zod

```typescript
"use client";
import { Divider } from "@heroui/divider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { createProviderGroup } from "@/actions/manage-groups";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomDropdownSelection, CustomInput } from "@/components/ui/custom";
import { Form } from "@/components/ui/form";
import { ApiError } from "@/types";

const addGroupSchema = z.object({
  name: z.string().min(1, "Provider group name is required"),
  providers: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof addGroupSchema>;

export const AddGroupForm = ({
  roles = [],
  providers = [],
}: {
  roles: Array<{ id: string; name: string }>;
  providers: Array<{ id: string; name: string }>;
}) => {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: {
      name: "",
      providers: [],
      roles: [],
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmitClient = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);

      if (values.providers?.length) {
        const providersData = values.providers.map((id) => ({
          id,
          type: "providers",
        }));
        formData.append("providers", JSON.stringify(providersData));
      }

      if (values.roles?.length) {
        const rolesData = values.roles.map((id) => ({
          id,
          type: "roles",
        }));
        formData.append("roles", JSON.stringify(rolesData));
      }

      const data = await createProviderGroup(formData);

      if (data?.errors && data.errors.length > 0) {
        data.errors.forEach((error: ApiError) => {
          const errorMessage = error.detail;
          const pointer = error.source?.pointer;
          switch (pointer) {
            case "/data/attributes/name":
              form.setError("name", {
                type: "server",
                message: errorMessage,
              });
              break;
            case "/data/relationships/roles":
              form.setError("roles", {
                type: "server",
                message: errorMessage,
              });
              break;
            default:
              toast({
                variant: "destructive",
                title: "Oops! Something went wrong",
                description: errorMessage,
              });
          }
        });
      } else {
        form.reset();
        toast({
          title: "Success!",
          description: "The group was created successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitClient)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <CustomInput
            control={form.control}
            name="name"
            type="text"
            label="Provider group name"
            labelPlacement="inside"
            placeholder="Enter the provider group name"
            variant="flat"
            isRequired
          />
        </div>

        {/*Select Providers */}
        <Controller
          name="providers"
          control={form.control}
          render={({ field }) => (
            <CustomDropdownSelection
              label="Select Providers"
              name="providers"
              values={providers}
              selectedKeys={field.value || []}
              onChange={(name, selectedValues) =>
                field.onChange(selectedValues)
              }
            />
          )}
        />
        {form.formState.errors.providers && (
          <p className="mt-2 text-sm text-red-600">
            {form.formState.errors.providers.message}
          </p>
        )}
        <Divider orientation="horizontal" className="mb-2" />

        <p className="text-small text-default-500">
          Roles can also be associated with the group. This step is optional and
          can be completed later if needed or from the Roles page.
        </p>
        {/* Select Roles */}
        <Controller
          name="roles"
          control={form.control}
          render={({ field }) => (
            <CustomDropdownSelection
              label="Select Roles"
              name="roles"
              values={roles}
              selectedKeys={field.value || []}
              onChange={(name, selectedValues) =>
                field.onChange(selectedValues)
              }
            />
          )}
        />
        {form.formState.errors.roles && (
          <p className="mt-2 text-sm text-red-600">
            {form.formState.errors.roles.message}
          </p>
        )}

        {/* Submit Button */}
        <div className="flex w-full justify-end sm:gap-6">
          <Button type="submit" className="w-1/2" disabled={isLoading}>
            {!isLoading && <SaveIcon size={24} />}
            {isLoading ? "Loading" : "Create Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: delete-group-form.tsx]---
Location: prowler-master/ui/components/manage-groups/forms/delete-group-form.tsx
Signals: React, Next.js, Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { deleteProviderGroup } from "@/actions/manage-groups/manage-groups";
import { DeleteIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
  groupId: z.string(),
});

export const DeleteGroupForm = ({
  groupId,
  setIsOpen,
}: {
  groupId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();
  const router = useRouter();
  const isLoading = form.formState.isSubmitting;

  async function onSubmitClient(formData: FormData) {
    // client-side validation
    const data = await deleteProviderGroup(formData);

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
        description: "The provider group was removed successfully.",
      });
      router.push("/manage-groups");
    }
    setIsOpen(false); // Close the modal on success
  }

  return (
    <Form {...form}>
      <form action={onSubmitClient}>
        <input type="hidden" name="id" value={groupId} />
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

---[FILE: edit-group-form.tsx]---
Location: prowler-master/ui/components/manage-groups/forms/edit-group-form.tsx
Signals: Next.js, Zod

```typescript
"use client";

import { Divider } from "@heroui/divider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { updateProviderGroup } from "@/actions/manage-groups/manage-groups";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomDropdownSelection, CustomInput } from "@/components/ui/custom";
import { Form } from "@/components/ui/form";
import { ApiError } from "@/types";

const editGroupSchema = z.object({
  name: z.string().min(1, "Provider group name is required"),
  providers: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  roles: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
});

export type FormValues = z.infer<typeof editGroupSchema>;

export const EditGroupForm = ({
  providerGroupId,
  providerGroupData,
  allProviders,
  allRoles,
}: {
  providerGroupId: string;
  providerGroupData: FormValues;
  allProviders: { id: string; name: string }[];
  allRoles: { id: string; name: string }[];
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: providerGroupData,
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmitClient = async (values: FormValues) => {
    try {
      const updatedFields: Partial<FormValues> = {};

      // Detect changes in the name
      if (values.name !== providerGroupData.name) {
        updatedFields.name = values.name;
      }

      // Detect changes in providers
      if (
        JSON.stringify(values.providers) !==
        JSON.stringify(providerGroupData.providers)
      ) {
        updatedFields.providers = values.providers;
      }

      // Detect changes in roles
      if (
        JSON.stringify(values.roles) !== JSON.stringify(providerGroupData.roles)
      ) {
        updatedFields.roles = values.roles;
      }

      // If no changes, notify the user and exit
      if (Object.keys(updatedFields).length === 0) {
        toast({
          title: "No changes detected",
          description: "No updates were made to the provider group.",
        });
        return;
      }

      // Create FormData dynamically
      const formData = new FormData();
      if (updatedFields.name) {
        formData.append("name", updatedFields.name);
      }
      if (updatedFields.providers) {
        const providersData = updatedFields.providers.map((provider) => ({
          id: provider.id,
          type: "providers",
        }));
        formData.append("providers", JSON.stringify(providersData));
      }
      if (updatedFields.roles) {
        const rolesData = updatedFields.roles.map((role) => ({
          id: role.id,
          type: "roles",
        }));
        formData.append("roles", JSON.stringify(rolesData));
      }

      // Call the update action
      const data = await updateProviderGroup(providerGroupId, formData);

      if (data?.errors && data.errors.length > 0) {
        data.errors.forEach((error: ApiError) => {
          const errorMessage = error.detail;
          const pointer = error.source?.pointer;
          switch (pointer) {
            case "/data/attributes/name":
              form.setError("name", {
                type: "server",
                message: errorMessage,
              });
              break;
            case "/data/relationships/roles":
              form.setError("roles", {
                type: "server",
                message: errorMessage,
              });
              break;
            default:
              toast({
                variant: "destructive",
                title: "Oops! Something went wrong",
                description: errorMessage,
              });
          }
        });
      } else {
        toast({
          title: "Success!",
          description: "The group was updated successfully.",
        });
        router.push("/manage-groups");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitClient)}
        className="flex flex-col gap-4"
      >
        {/* Field for the name */}
        <div className="flex flex-col gap-2">
          <CustomInput
            control={form.control}
            name="name"
            type="text"
            label="Provider group name"
            labelPlacement="inside"
            placeholder="Enter the provider group name"
            variant="flat"
            isRequired
          />
        </div>

        {/* Providers selection */}
        <Controller
          name="providers"
          control={form.control}
          render={({ field }) => {
            const combinedProviders = [
              ...(providerGroupData.providers || []),
              ...allProviders.filter(
                (p) =>
                  !(providerGroupData.providers || []).some(
                    (sp) => sp.id === p.id,
                  ),
              ),
            ];

            return (
              <CustomDropdownSelection
                label="Select Providers"
                name="providers"
                values={combinedProviders}
                selectedKeys={field.value?.map((p) => p.id) || []}
                onChange={(name, selectedValues) => {
                  const selectedProviders = combinedProviders.filter(
                    (provider) => selectedValues.includes(provider.id),
                  );
                  field.onChange(selectedProviders);
                }}
              />
            );
          }}
        />
        {form.formState.errors.providers && (
          <p className="mt-2 text-sm text-red-600">
            {form.formState.errors.providers.message}
          </p>
        )}

        <Divider orientation="horizontal" className="mb-2" />
        <p className="text-small text-default-500">
          The roles associated with the group can be edited directly here or
          from the Roles page.
        </p>
        {/* Roles selection */}
        <Controller
          name="roles"
          control={form.control}
          render={({ field }) => {
            const combinedRoles = [
              ...(providerGroupData.roles || []),
              ...allRoles.filter(
                (r) =>
                  !(providerGroupData.roles || []).some((sr) => sr.id === r.id),
              ),
            ];

            return (
              <CustomDropdownSelection
                label="Select Roles"
                name="roles"
                values={combinedRoles}
                selectedKeys={field.value?.map((r) => r.id) || []}
                onChange={(name, selectedValues) => {
                  const selectedRoles = combinedRoles.filter((role) =>
                    selectedValues.includes(role.id),
                  );
                  field.onChange(selectedRoles);
                }}
              />
            );
          }}
        />
        {form.formState.errors.roles && (
          <p className="mt-2 text-sm text-red-600">
            {form.formState.errors.roles.message}
          </p>
        )}

        <div className="flex w-full justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              router.push("/manage-groups");
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-1/2" disabled={isLoading}>
            {!isLoading && <SaveIcon size={24} />}
            {isLoading ? "Loading" : "Update Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/manage-groups/forms/index.ts

```typescript
export * from "./add-group-form";
export * from "./delete-group-form";
export * from "./edit-group-form";
```

--------------------------------------------------------------------------------

---[FILE: column-groups.tsx]---
Location: prowler-master/ui/components/manage-groups/table/column-groups.tsx

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DateWithTime } from "@/components/ui/entities";
import { DataTableColumnHeader } from "@/components/ui/table";
import { ProviderGroup } from "@/types";

import { DataTableRowActions } from "./data-table-row-actions";

const getProviderData = (row: { original: ProviderGroup }) => {
  return row.original;
};

export const ColumnGroups: ColumnDef<ProviderGroup>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Name"} param="name" />
    ),
    cell: ({ row }) => {
      const {
        attributes: { name },
      } = getProviderData(row);
      return <p className="text-small font-medium">{name}</p>;
    },
  },

  {
    accessorKey: "providers_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Providers" param="name" />
    ),
    cell: ({ row }) => {
      const {
        relationships: { providers },
      } = getProviderData(row);
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {providers.meta.count}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "roles_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Roles" param="roles" />
    ),
    cell: ({ row }) => {
      const {
        relationships: { roles },
      } = getProviderData(row);
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {roles.meta.count}
          </span>
        </div>
      );
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
```

--------------------------------------------------------------------------------

---[FILE: data-table-row-actions.tsx]---
Location: prowler-master/ui/components/manage-groups/table/data-table-row-actions.tsx
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
  DeleteDocumentBulkIcon,
  EditDocumentBulkIcon,
} from "@heroui/shared-icons";
import { Row } from "@tanstack/react-table";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { VerticalDotsIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { CustomAlertModal } from "@/components/ui/custom";

import { DeleteGroupForm } from "../forms";

interface DataTableRowActionsProps<ProviderProps> {
  row: Row<ProviderProps>;
}
const iconClasses = "text-2xl text-default-500 pointer-events-none shrink-0";

export function DataTableRowActions<ProviderProps>({
  row,
}: DataTableRowActionsProps<ProviderProps>) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const groupId = (row.original as { id: string }).id;

  const router = useRouter();

  return (
    <>
      <CustomAlertModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your provider account and remove your data from the server."
      >
        <DeleteGroupForm groupId={groupId} setIsOpen={setIsDeleteOpen} />
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
            <DropdownSection title="Actions">
              <DropdownItem
                key="edit"
                description="Allows you to edit the provider group"
                textValue="Edit Provider Group"
                startContent={<EditDocumentBulkIcon className={iconClasses} />}
                onPress={() => router.push(`/manage-groups?groupId=${groupId}`)}
              >
                Edit Provider Group
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Danger zone">
              <DropdownItem
                key="delete"
                className="text-text-error"
                color="danger"
                description="Delete the provider group permanently"
                textValue="Delete Provider Group"
                startContent={
                  <DeleteDocumentBulkIcon
                    className={clsx(iconClasses, "!text-text-error")}
                  />
                }
                onPress={() => setIsDeleteOpen(true)}
              >
                Delete Provider Group
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
Location: prowler-master/ui/components/manage-groups/table/index.ts

```typescript
export * from "./column-groups";
export * from "./data-table-row-actions";
export * from "./skeleton-table-groups";
```

--------------------------------------------------------------------------------

---[FILE: skeleton-table-groups.tsx]---
Location: prowler-master/ui/components/manage-groups/table/skeleton-table-groups.tsx
Signals: React

```typescript
import React from "react";

import { Card } from "@/components/shadcn/card/card";
import { Skeleton } from "@/components/shadcn/skeleton/skeleton";

export const SkeletonTableGroups = () => {
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

---[FILE: index.ts]---
Location: prowler-master/ui/components/overview/index.ts

```typescript
export * from "./new-findings-table/link-to-findings/link-to-findings";
```

--------------------------------------------------------------------------------

---[FILE: link-to-findings.tsx]---
Location: prowler-master/ui/components/overview/new-findings-table/link-to-findings/link-to-findings.tsx
Signals: Next.js

```typescript
"use client";

import Link from "next/link";

import { Button } from "@/components/shadcn/button/button";

export const LinkToFindings = () => {
  return (
    <div className="mt-4 flex w-full items-center justify-end">
      <Button asChild variant="default" size="sm">
        <Link
          href="/findings?sort=severity,-inserted_at&filter[status__in]=FAIL&filter[delta__in]=new"
          aria-label="Go to Findings page"
        >
          Check out on Findings
        </Link>
      </Button>
    </div>
  );
};
```

--------------------------------------------------------------------------------

````
