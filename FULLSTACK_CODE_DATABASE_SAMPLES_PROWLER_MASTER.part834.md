---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 834
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 834 of 867)

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

---[FILE: skeleton-table-roles.tsx]---
Location: prowler-master/ui/components/roles/table/skeleton-table-roles.tsx
Signals: React

```typescript
import React from "react";

import { Card } from "@/components/shadcn/card/card";
import { Skeleton } from "@/components/shadcn/skeleton/skeleton";

export const SkeletonTableRoles = () => {
  return (
    <Card variant="base" padding="md" className="flex flex-col gap-4">
      {/* Table headers */}
      <div className="hidden gap-4 md:flex">
        <Skeleton className="h-8 w-2/12" />
        <Skeleton className="h-8 w-2/12" />
        <Skeleton className="h-8 w-2/12" />
        <Skeleton className="h-8 w-2/12" />
        <Skeleton className="h-8 w-2/12" />
        <Skeleton className="h-8 w-1/12" />
      </div>

      {/* Table body */}
      <div className="flex flex-col gap-3">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 md:flex-row md:items-center"
          >
            <Skeleton className="h-12 w-full md:w-2/12" />
            <Skeleton className="h-12 w-full md:w-2/12" />
            <Skeleton className="hidden h-12 md:block md:w-2/12" />
            <Skeleton className="hidden h-12 md:block md:w-2/12" />
            <Skeleton className="hidden h-12 md:block md:w-2/12" />
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
Location: prowler-master/ui/components/roles/workflow/index.ts

```typescript
export * from "./skeleton-role-form";
export * from "./vertical-steps";
export * from "./workflow-add-edit-role";
```

--------------------------------------------------------------------------------

---[FILE: skeleton-role-form.tsx]---
Location: prowler-master/ui/components/roles/workflow/skeleton-role-form.tsx
Signals: React

```typescript
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import React from "react";

export const SkeletonRoleForm = () => {
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

---[FILE: vertical-steps.tsx]---
Location: prowler-master/ui/components/roles/workflow/vertical-steps.tsx
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
                                borderColor: "var(--active-border-color)",
                                color: "var(--active-color)",
                              },
                              complete: {
                                backgroundColor:
                                  "var(--complete-background-color)",
                                borderColor: "var(--complete-border-color)",
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

---[FILE: workflow-add-edit-role.tsx]---
Location: prowler-master/ui/components/roles/workflow/workflow-add-edit-role.tsx
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
    title: "Create a new role",
    description: "Enter the name of the role you want to add.",
    href: "/roles/new",
  },
  {
    title: "Edit a existing role",
    description:
      "Update the role's details, including its name and permissions.",
    href: "/roles/edit",
  },
];

export const WorkflowAddEditRole = () => {
  const pathname = usePathname();

  // Calculate current step based on pathname
  const currentStepIndex = steps.findIndex((step) =>
    pathname.endsWith(step.href),
  );
  const currentStep = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <section className="max-w-sm">
      <h1 className="mb-2 text-xl font-medium" id="getting-started">
        Manage Role Permissions
      </h1>
      <p className="text-small text-default-500 mb-5">
        Define a new role with customized permissions or modify an existing one
        to meet your needs.
      </p>
      <Progress
        classNames={{
          base: "px-0.5 mb-5",
          label: "text-small",
          value: "text-small text-default-400",
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
        steps={steps}
      />
      <Spacer y={4} />
    </section>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: add-role-form.tsx]---
Location: prowler-master/ui/components/roles/workflow/forms/add-role-form.tsx
Signals: React, Next.js, Zod

```typescript
"use client";

import { Checkbox } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { addRole } from "@/actions/roles/roles";
import { useToast } from "@/components/ui";
import { CustomDropdownSelection, CustomInput } from "@/components/ui/custom";
import { Form, FormButtons } from "@/components/ui/form";
import { getErrorMessage, permissionFormFields } from "@/lib";
import { addRoleFormSchema, ApiError } from "@/types";

type FormValues = z.input<typeof addRoleFormSchema>;

export const AddRoleForm = ({
  groups,
}: {
  groups: { id: string; name: string }[];
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(addRoleFormSchema),
    defaultValues: {
      name: "",
      manage_users: false,
      manage_providers: false,
      manage_integrations: false,
      manage_scans: false,
      unlimited_visibility: false,
      groups: [],
      ...(process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true" && {
        manage_billing: false,
      }),
    },
  });

  const { watch, setValue } = form;

  const manageProviders = watch("manage_providers");
  const unlimitedVisibility = watch("unlimited_visibility");

  useEffect(() => {
    if (manageProviders && !unlimitedVisibility) {
      setValue("unlimited_visibility", true, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [manageProviders, unlimitedVisibility, setValue]);

  const isLoading = form.formState.isSubmitting;

  const onSelectAllChange = (checked: boolean) => {
    const permissions = [
      "manage_users",
      "manage_account",
      "manage_billing",
      "manage_providers",
      "manage_integrations",
      "manage_scans",
      "unlimited_visibility",
    ];
    permissions.forEach((permission) => {
      form.setValue(permission as keyof FormValues, checked, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    });
  };

  const onSubmitClient = async (values: FormValues) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("manage_users", String(values.manage_users));
    formData.append("manage_providers", String(values.manage_providers));
    formData.append("manage_integrations", String(values.manage_integrations));
    formData.append("manage_scans", String(values.manage_scans));
    formData.append("manage_account", String(values.manage_account));
    formData.append(
      "unlimited_visibility",
      String(values.unlimited_visibility),
    );

    // Conditionally append manage_account and manage_billing
    if (process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true") {
      formData.append("manage_billing", String(values.manage_billing));
    }

    if (values.groups && values.groups.length > 0) {
      values.groups.forEach((group) => {
        formData.append("groups[]", group);
      });
    }

    try {
      const data = await addRole(formData);

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
            default:
              toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
              });
          }
        });
      } else {
        toast({
          title: "Role Added",
          description: "The role was added successfully.",
        });
        router.push("/roles");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitClient)}
        className="flex flex-col gap-6"
      >
        <CustomInput
          control={form.control}
          name="name"
          type="text"
          label="Role Name"
          labelPlacement="inside"
          placeholder="Enter role name"
          variant="bordered"
          isRequired
        />

        <div className="flex flex-col gap-4">
          <span className="text-lg font-semibold">Admin Permissions</span>

          {/* Select All Checkbox */}
          <Checkbox
            isSelected={permissionFormFields.every((perm) =>
              form.watch(perm.field as keyof FormValues),
            )}
            onChange={(e) => onSelectAllChange(e.target.checked)}
            classNames={{
              label: "text-small",
              wrapper: "checkbox-update",
            }}
            color="default"
          >
            Grant all admin permissions
          </Checkbox>

          {/* Permissions Grid */}
          <div className="grid grid-cols-2 gap-4">
            {permissionFormFields
              .filter(
                (permission) =>
                  permission.field !== "manage_billing" ||
                  process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true",
              )
              .map(({ field, label, description }) => (
                <div key={field} className="flex items-center gap-2">
                  <Checkbox
                    {...form.register(field as keyof FormValues)}
                    isSelected={!!form.watch(field as keyof FormValues)}
                    classNames={{
                      label: "text-small",
                      wrapper: "checkbox-update",
                    }}
                    color="default"
                  >
                    {label}
                  </Checkbox>
                  <Tooltip content={description} placement="right">
                    <div className="flex w-fit items-center justify-center">
                      <InfoIcon
                        className={clsx(
                          "text-default-400 group-data-[selected=true]:text-foreground cursor-pointer",
                        )}
                        aria-hidden={"true"}
                        width={16}
                      />
                    </div>
                  </Tooltip>
                </div>
              ))}
          </div>
        </div>
        <Divider className="my-4" />

        {!unlimitedVisibility && (
          <div className="flex flex-col gap-4">
            <span className="text-lg font-semibold">
              Groups and Account Visibility
            </span>

            <p className="text-small text-default-700 font-medium">
              Select the groups this role will have access to. If no groups are
              selected and unlimited visibility is not enabled, the role will
              not have access to any accounts.
            </p>

            <Controller
              name="groups"
              control={form.control}
              render={({ field }) => (
                <CustomDropdownSelection
                  label="Select Groups"
                  name="groups"
                  values={groups}
                  selectedKeys={field.value || []}
                  onChange={(name, selectedValues) =>
                    field.onChange(selectedValues)
                  }
                />
              )}
            />
            {form.formState.errors.groups && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.groups.message}
              </p>
            )}
          </div>
        )}
        <FormButtons submitText="Add Role" isDisabled={isLoading} />
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: delete-role-form.tsx]---
Location: prowler-master/ui/components/roles/workflow/forms/delete-role-form.tsx
Signals: React, Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { deleteRole } from "@/actions/roles";
import { DeleteIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
  roleId: z.string(),
});

export const DeleteRoleForm = ({
  roleId,
  setIsOpen,
}: {
  roleId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();
  const isLoading = form.formState.isSubmitting;

  async function onSubmitClient(formData: FormData) {
    const roleId = formData.get("id") as string;
    const data = await deleteRole(roleId);

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
        description: "The role was removed successfully.",
      });
    }
    setIsOpen(false); // Close the modal on success
  }

  return (
    <Form {...form}>
      <form action={onSubmitClient}>
        <input type="hidden" name="id" value={roleId} />
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

---[FILE: edit-role-form.tsx]---
Location: prowler-master/ui/components/roles/workflow/forms/edit-role-form.tsx
Signals: React, Next.js, Zod

```typescript
"use client";

import { Checkbox } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { updateRole } from "@/actions/roles/roles";
import { useToast } from "@/components/ui";
import { CustomDropdownSelection, CustomInput } from "@/components/ui/custom";
import { Form, FormButtons } from "@/components/ui/form";
import { getErrorMessage, permissionFormFields } from "@/lib";
import { ApiError, editRoleFormSchema } from "@/types";

type FormValues = z.input<typeof editRoleFormSchema>;

export const EditRoleForm = ({
  roleId,
  roleData,
  groups,
}: {
  roleId: string;
  roleData: {
    data: {
      attributes: FormValues;
      relationships?: {
        provider_groups?: {
          data: Array<{ id: string; type: string }>;
        };
      };
    };
  };
  groups: { id: string; name: string }[];
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(editRoleFormSchema),
    defaultValues: {
      ...roleData.data.attributes,
      groups:
        roleData.data.relationships?.provider_groups?.data.map((g) => g.id) ||
        [],
    },
  });

  const { watch, setValue } = form;

  const manageProviders = watch("manage_providers");
  const unlimitedVisibility = watch("unlimited_visibility");

  useEffect(() => {
    if (manageProviders && !unlimitedVisibility) {
      setValue("unlimited_visibility", true, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [manageProviders, unlimitedVisibility, setValue]);

  const isLoading = form.formState.isSubmitting;

  const onSelectAllChange = (checked: boolean) => {
    const permissions = [
      "manage_users",
      "manage_account",
      "manage_billing",
      "manage_providers",
      "manage_integrations",
      "manage_scans",
      "unlimited_visibility",
    ];
    permissions.forEach((permission) => {
      form.setValue(permission as keyof FormValues, checked, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    });
  };

  const onSubmitClient = async (values: FormValues) => {
    try {
      const updatedFields: Partial<FormValues> = {};

      if (values.name !== roleData.data.attributes.name) {
        updatedFields.name = values.name;
      }

      updatedFields.manage_users = values.manage_users;
      updatedFields.manage_providers = values.manage_providers;
      updatedFields.manage_account = values.manage_account;
      updatedFields.manage_integrations = values.manage_integrations;
      updatedFields.manage_scans = values.manage_scans;
      updatedFields.unlimited_visibility = values.unlimited_visibility;

      if (process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true") {
        updatedFields.manage_billing = values.manage_billing;
      }

      if (
        JSON.stringify(values.groups) !==
        JSON.stringify(
          roleData.data.relationships?.provider_groups?.data.map((g) => g.id),
        )
      ) {
        updatedFields.groups = values.groups;
      }

      const formData = new FormData();

      Object.entries(updatedFields).forEach(([key, value]) => {
        if (key === "groups" && Array.isArray(value)) {
          value.forEach((group) => {
            formData.append("groups[]", group);
          });
        } else {
          formData.append(key, String(value));
        }
      });

      const data = await updateRole(formData, roleId);

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
            default:
              toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
              });
          }
        });
      } else {
        toast({
          title: "Role Updated",
          description: "The role was updated successfully.",
        });
        router.push("/roles");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitClient)}
        className="flex flex-col gap-6"
      >
        <CustomInput
          control={form.control}
          name="name"
          type="text"
          label="Role Name"
          labelPlacement="inside"
          placeholder="Enter role name"
          variant="bordered"
          isRequired
        />

        <div className="flex flex-col gap-4">
          <span className="text-lg font-semibold">Admin Permissions</span>

          {/* Select All Checkbox */}
          <Checkbox
            isSelected={permissionFormFields.every((perm) =>
              form.watch(perm.field as keyof FormValues),
            )}
            onChange={(e) => onSelectAllChange(e.target.checked)}
            classNames={{
              label: "text-small",
              wrapper: "checkbox-update",
            }}
            color="default"
          >
            Grant all admin permissions
          </Checkbox>

          {/* Permissions Grid */}
          <div className="grid grid-cols-2 gap-4">
            {permissionFormFields
              .filter(
                (permission) =>
                  permission.field !== "manage_billing" ||
                  process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true",
              )
              .map(({ field, label, description }) => (
                <div key={field} className="flex items-center gap-2">
                  <Checkbox
                    {...form.register(field as keyof FormValues)}
                    isSelected={!!form.watch(field as keyof FormValues)}
                    classNames={{
                      label: "text-small",
                      wrapper: "checkbox-update",
                    }}
                    color="default"
                  >
                    {label}
                  </Checkbox>
                  <Tooltip content={description} placement="right">
                    <div className="flex w-fit items-center justify-center">
                      <InfoIcon
                        className={clsx(
                          "text-default-400 group-data-[selected=true]:text-foreground cursor-pointer",
                        )}
                        aria-hidden={"true"}
                        width={16}
                      />
                    </div>
                  </Tooltip>
                </div>
              ))}
          </div>
        </div>
        <Divider className="my-4" />

        {!unlimitedVisibility && (
          <div className="flex flex-col gap-4">
            <span className="text-lg font-semibold">Groups visibility</span>

            <p className="text-small text-default-700 font-medium">
              Select the groups this role will have access to. If no groups are
              selected and unlimited visibility is not enabled, the role will
              not have access to any accounts.
            </p>

            <Controller
              name="groups"
              control={form.control}
              render={({ field }) => (
                <CustomDropdownSelection
                  label="Select Groups"
                  name="groups"
                  values={groups}
                  selectedKeys={field.value}
                  onChange={(name, selectedValues) => {
                    field.onChange(selectedValues);
                  }}
                />
              )}
            />

            {form.formState.errors.groups && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.groups.message}
              </p>
            )}
          </div>
        )}
        <FormButtons submitText="Update Role" isDisabled={isLoading} />
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/roles/workflow/forms/index.ts

```typescript
export * from "./add-role-form";
export * from "./delete-role-form";
export * from "./edit-role-form";
```

--------------------------------------------------------------------------------

---[FILE: auto-refresh.tsx]---
Location: prowler-master/ui/components/scans/auto-refresh.tsx
Signals: React, Next.js

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface AutoRefreshProps {
  hasExecutingScan: boolean;
}

export function AutoRefresh({ hasExecutingScan }: AutoRefreshProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!hasExecutingScan) return;

    // Don't auto-refresh if scan details drawer is open
    const scanId = searchParams.get("scanId");
    if (scanId) return;

    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [hasExecutingScan, router, searchParams]);

  return null;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/scans/index.ts

```typescript
export * from "./auto-refresh";
export * from "./no-providers-added";
export * from "./no-providers-connected";
export * from "./scans-filters";
```

--------------------------------------------------------------------------------

---[FILE: no-providers-added.tsx]---
Location: prowler-master/ui/components/scans/no-providers-added.tsx
Signals: Next.js

```typescript
"use client";

import Link from "next/link";

import { Button, Card, CardContent } from "@/components/shadcn";

import { InfoIcon } from "../icons/Icons";

export const NoProvidersAdded = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card variant="base" className="mx-auto w-full max-w-3xl">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
          <div className="flex flex-col items-center gap-4">
            <InfoIcon className="h-10 w-10 text-gray-800 dark:text-white" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              No Cloud Providers Configured
            </h2>
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="text-md leading-relaxed text-gray-600 dark:text-gray-300">
              No cloud providers have been configured. Start by setting up a
              cloud provider.
            </p>
          </div>

          <Button
            asChild
            aria-label="Go to Add Cloud Provider page"
            className="w-full max-w-xs justify-center"
            size="lg"
          >
            <Link href="/providers/connect-account">Get Started</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
```

--------------------------------------------------------------------------------

````
