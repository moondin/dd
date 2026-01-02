---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 822
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 822 of 867)

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

---[FILE: integration-skeleton.tsx]---
Location: prowler-master/ui/components/integrations/shared/integration-skeleton.tsx
Signals: React

```typescript
"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { ReactNode } from "react";

interface IntegrationSkeletonProps {
  variant?: "main" | "manager";
  count?: number;
  icon: ReactNode;
  title?: string;
  subtitle?: string;
}

export const IntegrationSkeleton = ({
  variant = "main",
  count = 1,
  icon,
  title = "Integration",
  subtitle = "Loading integration details...",
}: IntegrationSkeletonProps) => {
  if (variant === "main") {
    return (
      <Card className="dark:bg-prowler-blue-400">
        <CardHeader className="gap-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              {icon}
              <div className="flex flex-col gap-1">
                <h4 className="text-lg font-bold">{title}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">{subtitle}</p>
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24 rounded" />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </CardBody>
      </Card>
    );
  }

  // Manager variant - for individual cards in integration managers
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="dark:bg-prowler-blue-400">
          <CardHeader className="pb-2">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {icon}
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-5 w-40 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="flex flex-col gap-3">
              {/* Region chips skeleton */}
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-18 rounded-full" />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-3 w-32 rounded" />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Skeleton className="h-7 w-16 rounded" />
                  <Skeleton className="h-7 w-20 rounded" />
                  <Skeleton className="h-7 w-24 rounded" />
                  <Skeleton className="h-7 w-20 rounded" />
                  <Skeleton className="h-7 w-20 rounded" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: link-card.tsx]---
Location: prowler-master/ui/components/integrations/shared/link-card.tsx
Signals: Next.js

```typescript
"use client";

import { ExternalLinkIcon, LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn";
import { CustomLink } from "@/components/ui/custom/custom-link";

import { Card, CardContent, CardHeader } from "../../shadcn";

interface LinkCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  learnMoreUrl: string;
  learnMoreAriaLabel: string;
  bodyText: string;
  linkHref: string;
  linkText: string;
}

export const LinkCard = ({
  icon: Icon,
  title,
  description,
  learnMoreUrl,
  learnMoreAriaLabel,
  bodyText,
  linkHref,
  linkText,
}: LinkCardProps) => {
  return (
    <Card variant="base" padding="lg">
      <CardHeader>
        <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="dark:bg-prowler-blue-800 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <Icon size={24} className="text-gray-700 dark:text-gray-200" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {title}
              </h4>
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                <p className="text-xs text-nowrap text-gray-500 dark:text-gray-300">
                  {description}
                </p>
                <CustomLink
                  href={learnMoreUrl}
                  aria-label={learnMoreAriaLabel}
                  size="xs"
                >
                  Learn more
                </CustomLink>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button asChild size="sm">
              <Link href={linkHref}>
                <ExternalLinkIcon size={14} />
                {linkText}
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300">{bodyText}</p>
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: sso-link-card.tsx]---
Location: prowler-master/ui/components/integrations/sso/sso-link-card.tsx

```typescript
"use client";

import { ShieldCheckIcon } from "lucide-react";

import { LinkCard } from "../shared/link-card";

export const SsoLinkCard = () => {
  return (
    <LinkCard
      icon={ShieldCheckIcon}
      title="SSO Configuration"
      description="Configure SAML Single Sign-On for your organization."
      learnMoreUrl="https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-sso/"
      learnMoreAriaLabel="Learn more about SSO configuration"
      bodyText="SSO configuration is available in your User Profile. Enable SAML Single Sign-On to allow users to authenticate using your organization's identity provider."
      linkHref="/profile"
      linkText="Go to Profile"
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/invitations/index.ts

```typescript
export * from "./invitation-details";
```

--------------------------------------------------------------------------------

---[FILE: invitation-details.tsx]---
Location: prowler-master/ui/components/invitations/invitation-details.tsx
Signals: Next.js

```typescript
"use client";

import { Snippet } from "@heroui/snippet";
import Link from "next/link";

import { AddIcon } from "../icons";
import { Button, Card, CardContent, CardHeader } from "../shadcn";
import { Separator } from "../shadcn/separator/separator";
import { DateWithTime } from "../ui/entities";

interface InvitationDetailsProps {
  attributes: {
    email: string;
    state: string;
    token: string;
    expires_at: string;
    inserted_at: string;
    updated_at: string;
  };
  relationships?: {
    inviter: {
      data: {
        id: string;
      };
    };
  };
  selfLink: string;
}

const InfoField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-text-neutral-secondary text-xs font-bold">
      {label}
    </span>
    <div className="border-border-input-primary bg-bg-input-primary flex items-center rounded-lg border p-3">
      <span className="text-small text-text-neutral-primary">{children}</span>
    </div>
  </div>
);

export const InvitationDetails = ({ attributes }: InvitationDetailsProps) => {
  // window.location.origin to get the current base URL
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  const invitationLink = `${baseUrl}/sign-up?invitation_token=${attributes.token}`;

  return (
    <div className="flex flex-col gap-x-4 gap-y-8">
      <Card variant="base" padding="lg">
        <CardHeader>Invitation details</CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <InfoField label="Email">{attributes.email}</InfoField>

            <InfoField label="Token">{attributes.token}</InfoField>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InfoField label="State">
                <span className="capitalize">{attributes.state}</span>
              </InfoField>

              <InfoField label="Expires At">
                <DateWithTime dateTime={attributes.expires_at} inline />
              </InfoField>

              <InfoField label="Created At">
                <DateWithTime dateTime={attributes.inserted_at} inline />
              </InfoField>

              <InfoField label="Updated At">
                <DateWithTime dateTime={attributes.updated_at} inline />
              </InfoField>
            </div>
          </div>

          <Separator className="my-4" />
          <h3 className="text-text-neutral-primary pb-2 text-sm font-bold">
            Share this link with the user:
          </h3>

          <div className="flex flex-col items-start justify-between">
            <Snippet
              classNames={{
                base: "mx-auto",
              }}
              hideSymbol
              variant="bordered"
              className="bg-bg-neutral-secondary overflow-hidden py-1 text-ellipsis whitespace-nowrap"
            >
              <p className="no-scrollbar w-fit overflow-hidden overflow-x-scroll text-sm text-ellipsis whitespace-nowrap">
                {invitationLink}
              </p>
            </Snippet>
          </div>
        </CardContent>
      </Card>
      <div className="flex w-full items-center justify-end">
        <Button asChild size="default" className="gap-2">
          <Link href="/invitations/">
            Back to Invitations
            <AddIcon size={20} />
          </Link>
        </Button>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: delete-form.tsx]---
Location: prowler-master/ui/components/invitations/forms/delete-form.tsx
Signals: React, Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { revokeInvite } from "@/actions/invitations/invitation";
import { DeleteIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
  invitationId: z.string(),
});

export const DeleteForm = ({
  invitationId,
  setIsOpen,
}: {
  invitationId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invitationId,
    },
  });
  const { toast } = useToast();
  const isLoading = form.formState.isSubmitting;

  async function onSubmitClient(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    Object.entries(values).forEach(
      ([key, value]) => value !== undefined && formData.append(key, value),
    );
    // client-side validation
    const data = await revokeInvite(formData);

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
        description: "The invitation was revoked successfully.",
      });
    }
    setIsOpen(false); // Close the modal on success
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitClient)}>
        <input type="hidden" name="id" value={invitationId} />
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
            {isLoading ? "Loading" : "Revoke"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: edit-form.tsx]---
Location: prowler-master/ui/components/invitations/forms/edit-form.tsx
Signals: React, Zod

```typescript
import { Select, SelectItem } from "@heroui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, ShieldIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { updateInvite } from "@/actions/invitations/invitation";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { Form, FormButtons } from "@/components/ui/form";
import { editInviteFormSchema } from "@/types";

import { Card, CardContent } from "../../shadcn";

export const EditForm = ({
  invitationId,
  invitationEmail,
  roles = [],
  currentRole = "",
  setIsOpen,
}: {
  invitationId: string;
  invitationEmail?: string;
  roles: Array<{ id: string; name: string }>;
  currentRole?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const formSchema = editInviteFormSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invitationId,
      invitationEmail: invitationEmail || "",
      role: roles.find((role) => role.name === currentRole)?.id || "",
    },
  });

  const { toast } = useToast();

  const isLoading = form.formState.isSubmitting;

  const onSubmitClient = async (values: z.infer<typeof formSchema>) => {
    const changedFields: { [key: string]: any } = {};

    // Check if the email changed
    if (values.invitationEmail && values.invitationEmail !== invitationEmail) {
      changedFields.invitationEmail = values.invitationEmail;
    }

    // Check if the role changed
    const currentRoleId =
      roles.find((role) => role.name === currentRole)?.id || "";
    if (values.role && values.role !== currentRoleId) {
      changedFields.role = values.role;
    }

    // If there are no changes, avoid the request
    if (Object.keys(changedFields).length === 0) {
      toast({
        title: "No changes detected",
        description: "Please modify at least one field before saving.",
      });
      return;
    }

    changedFields.invitationId = invitationId; // Always include the ID

    const formData = new FormData();
    Object.entries(changedFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const data = await updateInvite(formData);

    if (data?.error) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: `${data.error}`,
      });
    } else {
      toast({
        title: "Success!",
        description: "The invitation was updated successfully.",
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
        <Card variant="inner">
          <CardContent className="flex flex-row justify-center gap-4">
            <div className="text-small text-text-neutral-secondary flex items-center">
              <MailIcon className="text-text-neutral-secondary mr-2 h-4 w-4" />
              <span className="text-text-neutral-secondary">Email:</span>
              <span className="text-text-neutral-secondary ml-2 font-semibold">
                {invitationEmail}
              </span>
            </div>
            <div className="text-small flex items-center text-gray-600">
              <ShieldIcon className="text-text-neutral-secondary mr-2 h-4 w-4" />
              <span className="text-text-neutral-secondary">Role:</span>
              <span className="text-text-neutral-secondary ml-2 font-semibold">
                {currentRole}
              </span>
            </div>
          </CardContent>
        </Card>

        <div>
          <CustomInput
            control={form.control}
            name="invitationEmail"
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder={invitationEmail}
            variant="flat"
            isRequired={false}
          />
        </div>
        <div>
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                label="Role"
                placeholder="Select a role"
                classNames={{
                  selectorIcon: "right-2",
                }}
                variant="flat"
                selectedKeys={[field.value || ""]}
                onSelectionChange={(selected) =>
                  field.onChange(selected?.currentKey || "")
                }
              >
                {roles.map((role) => (
                  <SelectItem key={role.id}>{role.name}</SelectItem>
                ))}
              </Select>
            )}
          />

          {form.formState.errors.role && (
            <p className="mt-2 text-sm text-red-600">
              {form.formState.errors.role.message}
            </p>
          )}
        </div>
        <input type="hidden" name="invitationId" value={invitationId} />

        <FormButtons setIsOpen={setIsOpen} isDisabled={isLoading} />
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/invitations/forms/index.ts

```typescript
export * from "./delete-form";
export * from "./edit-form";
```

--------------------------------------------------------------------------------

---[FILE: column-invitations.tsx]---
Location: prowler-master/ui/components/invitations/table/column-invitations.tsx

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DateWithTime } from "@/components/ui/entities";
import { DataTableColumnHeader } from "@/components/ui/table";
import { InvitationProps } from "@/types";

import { DataTableRowActions } from "./data-table-row-actions";

const getInvitationData = (row: { original: InvitationProps }) => {
  return row.original.attributes;
};

export const ColumnsInvitation: ColumnDef<InvitationProps>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const data = getInvitationData(row);
      return <p className="font-semibold">{data?.email || "N/A"}</p>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"State"} param="state" />
    ),
    cell: ({ row }) => {
      const { state } = getInvitationData(row);
      return <p className="font-semibold">{state}</p>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const roleName =
        row.original.relationships?.role?.attributes?.name || "No Role";
      return <p className="font-semibold">{roleName}</p>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "inserted_at",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Inserted At"}
        param="inserted_at"
      />
    ),
    cell: ({ row }) => {
      const { inserted_at } = getInvitationData(row);
      return <DateWithTime dateTime={inserted_at} showTime={false} />;
    },
  },

  {
    accessorKey: "expires_at",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Expires At"}
        param="expires_at"
      />
    ),
    cell: ({ row }) => {
      const { expires_at } = getInvitationData(row);
      return <DateWithTime dateTime={expires_at} showTime={false} />;
    },
  },
  {
    accessorKey: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    id: "actions",
    cell: ({ row }) => {
      const roles = row.original.roles;
      return <DataTableRowActions row={row} roles={roles} />;
    },
    enableSorting: false,
  },
];
```

--------------------------------------------------------------------------------

---[FILE: data-table-row-actions.tsx]---
Location: prowler-master/ui/components/invitations/table/data-table-row-actions.tsx
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

import { VerticalDotsIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { CustomAlertModal } from "@/components/ui/custom";

import { DeleteForm, EditForm } from "../forms";

interface DataTableRowActionsProps<InvitationProps> {
  row: Row<InvitationProps>;
  roles?: { id: string; name: string }[];
}
const iconClasses = "text-2xl text-default-500 pointer-events-none shrink-0";

export function DataTableRowActions<InvitationProps>({
  row,
  roles,
}: DataTableRowActionsProps<InvitationProps>) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const invitationId = (row.original as { id: string }).id;
  const invitationEmail = (row.original as any).attributes?.email;
  const invitationRole = (row.original as any).relationships?.role?.attributes
    ?.name;
  const invitationAccepted = (row.original as any).attributes?.state;

  return (
    <>
      <CustomAlertModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit invitation details"
      >
        <EditForm
          invitationId={invitationId}
          invitationEmail={invitationEmail}
          currentRole={invitationRole}
          roles={roles || []}
          setIsOpen={setIsEditOpen}
        />
      </CustomAlertModal>
      <CustomAlertModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently revoke your invitation."
      >
        <DeleteForm invitationId={invitationId} setIsOpen={setIsDeleteOpen} />
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
                key="check-details"
                description="View invitation details"
                textValue="Check Details"
                startContent={<AddNoteBulkIcon className={iconClasses} />}
                onPress={() =>
                  router.push(`/invitations/check-details?id=${invitationId}`)
                }
              >
                Check Details
              </DropdownItem>

              <DropdownItem
                key="edit"
                description="Allows you to edit the invitation"
                textValue="Edit Invitation"
                startContent={<EditDocumentBulkIcon className={iconClasses} />}
                onPress={() => setIsEditOpen(true)}
                isDisabled={invitationAccepted === "accepted"}
              >
                Edit Invitation
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Danger zone">
              <DropdownItem
                key="delete"
                className="text-text-error"
                color="danger"
                description="Delete the invitation permanently"
                textValue="Delete Invitation"
                startContent={
                  <DeleteDocumentBulkIcon
                    className={clsx(iconClasses, "!text-text-error")}
                  />
                }
                onPress={() => setIsDeleteOpen(true)}
                isDisabled={invitationAccepted === "accepted"}
              >
                Revoke Invitation
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
Location: prowler-master/ui/components/invitations/table/index.ts

```typescript
export * from "./column-invitations";
export * from "./data-table-row-actions";
export * from "./skeleton-table-invitations";
```

--------------------------------------------------------------------------------

---[FILE: skeleton-table-invitations.tsx]---
Location: prowler-master/ui/components/invitations/table/skeleton-table-invitations.tsx
Signals: React

```typescript
import React from "react";

import { Card } from "@/components/shadcn/card/card";
import { Skeleton } from "@/components/shadcn/skeleton/skeleton";

export const SkeletonTableInvitation = () => {
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
Location: prowler-master/ui/components/invitations/workflow/index.ts

```typescript
export * from "./skeleton-invitation-info";
export * from "./vertical-steps";
export * from "./workflow-send-invite";
```

--------------------------------------------------------------------------------

---[FILE: skeleton-invitation-info.tsx]---
Location: prowler-master/ui/components/invitations/workflow/skeleton-invitation-info.tsx
Signals: React

```typescript
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import React from "react";

export const SkeletonInvitationInfo = () => {
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

````
