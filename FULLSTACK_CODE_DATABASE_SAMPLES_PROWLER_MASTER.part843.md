---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 843
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 843 of 867)

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

---[FILE: Toaster.tsx]---
Location: prowler-master/ui/components/ui/toast/Toaster.tsx

```typescript
"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui";

import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: use-toast.ts]---
Location: prowler-master/ui/components/ui/toast/use-toast.ts
Signals: React

```typescript
"use client";

// Inspired by react-hot-toast library
import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui";

const TOAST_LIMIT = 6;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { toast, useToast };
```

--------------------------------------------------------------------------------

---[FILE: tooltip.tsx]---
Location: prowler-master/ui/components/ui/tooltip/tooltip.tsx
Signals: React

```typescript
"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "bg-bg-neutral-secondary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
```

--------------------------------------------------------------------------------

---[FILE: user-nav.tsx]---
Location: prowler-master/ui/components/ui/user-nav/user-nav.tsx

```typescript
"use client";

import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";

import { logOut } from "@/actions/auth";
import { Button } from "@/components/shadcn/button/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import { CustomLink } from "@/components/ui/custom/custom-link";

export const UserNav = () => {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const { name } = session.user;

  const initials = name.includes(" ")
    ? name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
    : name.charAt(0);

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            className="border-border-input-primary-fill rounded-full"
            asChild
          >
            <CustomLink href="/profile" target="_self" aria-label="Account">
              <Avatar className="h-8 w-8">
                <AvatarImage src="#" alt="Avatar" />
                <AvatarFallback className="bg-transparent text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </CustomLink>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Account Settings</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="border-border-input-primary-fill rounded-full"
            onClick={() => logOut()}
            aria-label="Sign out"
          >
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sign Out</TooltipContent>
      </Tooltip>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/users/index.ts

```typescript
// Users exports
```

--------------------------------------------------------------------------------

---[FILE: delete-form.tsx]---
Location: prowler-master/ui/components/users/forms/delete-form.tsx
Signals: React, Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { deleteUser } from "@/actions/users/users";
import { DeleteIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { Form } from "@/components/ui/form";

const formSchema = z.object({
  userId: z.string(),
});

export const DeleteForm = ({
  userId,
  setIsOpen,
}: {
  userId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId,
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
    const data = await deleteUser(formData);

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
        description: "The user was removed successfully.",
      });
    }
    setIsOpen(false); // Close the modal on success
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitClient)}>
        <input type="hidden" name="id" value={userId} />
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
Location: prowler-master/ui/components/users/forms/edit-form.tsx
Signals: React, Zod

```typescript
"use client";

import { Select, SelectItem } from "@heroui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldIcon, UserIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { updateUser, updateUserRole } from "@/actions/users/users";
import { Card } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { Form, FormButtons } from "@/components/ui/form";
import { editUserFormSchema } from "@/types";

export const EditForm = ({
  userId,
  userName,
  userEmail,
  userCompanyName,
  roles = [],
  currentRole = "",
  setIsOpen,
}: {
  userId: string;
  userName?: string;
  userEmail?: string;
  userCompanyName?: string;
  roles: Array<{ id: string; name: string }>;
  currentRole?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const formSchema = editUserFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userId,
      name: userName,
      email: userEmail,
      company_name: userCompanyName,
      role: roles.find((role) => role.name === currentRole)?.id || "",
    },
  });

  const { toast } = useToast();

  const isLoading = form.formState.isSubmitting;

  const onSubmitClient = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    // Update basic user data
    if (values.name !== undefined) {
      formData.append("name", values.name);
    }
    if (values.email !== undefined) {
      formData.append("email", values.email);
    }
    if (values.company_name !== undefined) {
      formData.append("company_name", values.company_name);
    }

    // Always include userId
    formData.append("userId", userId);

    // Handle role updates separately
    if (values.role !== roles.find((role) => role.name === currentRole)?.id) {
      const roleFormData = new FormData();
      roleFormData.append("userId", userId);
      roleFormData.append("roleId", values.role || "");

      const roleUpdateResponse = await updateUserRole(roleFormData);

      if (roleUpdateResponse?.errors && roleUpdateResponse.errors.length > 0) {
        const error = roleUpdateResponse.errors[0];
        toast({
          variant: "destructive",
          title: "Role Update Failed",
          description: `${error.detail}`,
        });
        return;
      }
    }

    // Update other user attributes
    const data = await updateUser(formData);

    if (data?.errors && data.errors.length > 0) {
      const error = data.errors[0];
      const errorMessage = `${error.detail}`;
      // Show error
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: errorMessage,
      });
    } else {
      toast({
        title: "Success!",
        description: "The user was updated successfully.",
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
        <Card
          variant="inner"
          className="flex flex-row items-center justify-center gap-4"
        >
          <div className="text-small flex items-center">
            <UserIcon className="mr-2 h-4 w-4" />
            <span className="text-text-neutral-secondary">Name:</span>
            <span className="ml-2 font-semibold">{userName}</span>
          </div>
          <div className="text-small flex items-center">
            <ShieldIcon className="mr-2 h-4 w-4" />
            <span className="text-text-neutral-secondary">Role:</span>
            <span className="ml-2 font-semibold">
              {currentRole ? currentRole : "No role"}
            </span>
          </div>
        </Card>
        <div className="flex flex-row gap-4">
          <div className="w-1/2">
            <CustomInput
              control={form.control}
              name="name"
              type="text"
              label="Name"
              labelPlacement="outside"
              placeholder={userName}
              variant="bordered"
              isRequired={false}
            />
          </div>
          <div className="w-1/2">
            <CustomInput
              control={form.control}
              name="company_name"
              type="text"
              label="Company Name"
              labelPlacement="outside"
              placeholder={userCompanyName}
              variant="bordered"
              isRequired={false}
            />
          </div>
        </div>

        <div>
          <CustomInput
            control={form.control}
            name="email"
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder={userEmail}
            variant="bordered"
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
                labelPlacement="outside"
                placeholder="Select a role"
                classNames={{
                  selectorIcon: "right-2",
                }}
                variant="bordered"
                selectedKeys={[field.value || ""]}
                onSelectionChange={(selected) => {
                  const selectedKey = Array.from(selected).pop();
                  field.onChange(selectedKey || "");
                }}
              >
                {roles.map((role: { id: string; name: string }) => (
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
        <input type="hidden" name="userId" value={userId} />

        <FormButtons setIsOpen={setIsOpen} isDisabled={isLoading} />
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: edit-tenant-form.tsx]---
Location: prowler-master/ui/components/users/forms/edit-tenant-form.tsx
Signals: React

```typescript
"use client";

import { Dispatch, SetStateAction, useActionState, useEffect } from "react";

import { updateTenantName } from "@/actions/users/tenants";
import { useToast } from "@/components/ui";
import { CustomServerInput } from "@/components/ui/custom";
import { FormButtons } from "@/components/ui/form";

export const EditTenantForm = ({
  tenantId,
  tenantName,
  setIsOpen,
}: {
  tenantId: string;
  tenantName?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [state, formAction] = useActionState(updateTenantName, null);
  const { toast } = useToast();

  useEffect(() => {
    if (state && "success" in state) {
      toast({
        title: "Changed successfully",
        description: state.success,
      });
      setIsOpen(false);
    } else if (state && "error" in state) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: state.error,
      });
    }
  }, [state, toast, setIsOpen]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="text-md">
        Current name: <span className="font-bold">{tenantName}</span>
      </div>

      <CustomServerInput
        name="name"
        label="Organization name"
        placeholder="Enter the new name"
        labelPlacement="outside"
        variant="bordered"
        isRequired={true}
        isInvalid={!!(state && "error" in state)}
        errorMessage={state && "error" in state ? state.error : undefined}
      />

      {/* Hidden inputs for Server Action */}
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="currentName" value={tenantName || ""} />

      <FormButtons setIsOpen={setIsOpen} />
    </form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/users/forms/index.ts

```typescript
export * from "./delete-form";
export * from "./edit-form";
export * from "./edit-tenant-form";
```

--------------------------------------------------------------------------------

---[FILE: api-key-success-modal.tsx]---
Location: prowler-master/ui/components/users/profile/api-key-success-modal.tsx

```typescript
"use client";

import { Snippet } from "@heroui/snippet";

import { Button } from "@/components/shadcn";
import { Alert, AlertDescription } from "@/components/ui/alert/Alert";
import { CustomAlertModal } from "@/components/ui/custom/custom-alert-modal";

interface ApiKeySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
}

export const ApiKeySuccessModal = ({
  isOpen,
  onClose,
  apiKey,
}: ApiKeySuccessModalProps) => {
  return (
    <CustomAlertModal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="API Key Created Successfully"
    >
      <div className="flex flex-col gap-6">
        <Alert variant="destructive">
          <AlertDescription>
            This is the only time you will see this API key. Please copy it now
            and store it securely. Once you close this dialog, the key cannot be
            retrieved again.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-2">
          <p className="text-text-neutral-primary text-sm font-medium">
            Your API Key
          </p>
          <Snippet
            hideSymbol
            classNames={{
              pre: "font-mono text-sm break-all whitespace-pre-wrap p-2 text-text-neutral-primary",
            }}
            tooltipProps={{
              content: "Copy API key",
              color: "default",
            }}
          >
            {apiKey}
          </Snippet>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button aria-label="Close and confirm API key saved" onClick={onClose}>
          Acknowledged
        </Button>
      </div>
    </CustomAlertModal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: api-keys-card-client.tsx]---
Location: prowler-master/ui/components/users/profile/api-keys-card-client.tsx
Signals: React, Next.js

```typescript
"use client";

import { useDisclosure } from "@heroui/use-disclosure";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn";
import { CustomLink } from "@/components/ui/custom/custom-link";
import { DataTable } from "@/components/ui/table";
import { MetaDataProps } from "@/types";

import { ApiKeySuccessModal } from "./api-key-success-modal";
import { createApiKeyColumns } from "./api-keys/column-api-keys";
import { EnrichedApiKey } from "./api-keys/types";
import { CreateApiKeyModal } from "./create-api-key-modal";
import { EditApiKeyNameModal } from "./edit-api-key-name-modal";
import { RevokeApiKeyModal } from "./revoke-api-key-modal";

interface ApiKeysCardClientProps {
  initialApiKeys: EnrichedApiKey[];
  metadata?: MetaDataProps;
}

export const ApiKeysCardClient = ({
  initialApiKeys,
  metadata,
}: ApiKeysCardClientProps) => {
  const router = useRouter();
  const [selectedApiKey, setSelectedApiKey] = useState<EnrichedApiKey | null>(
    null,
  );
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);

  const createModal = useDisclosure();
  const successModal = useDisclosure();
  const revokeModal = useDisclosure();
  const editModal = useDisclosure();

  const handleCreateSuccess = (apiKey: string) => {
    setCreatedApiKey(apiKey);
    successModal.onOpen();
    router.refresh();
  };

  const handleRevokeSuccess = () => {
    router.refresh();
  };

  const handleEditSuccess = () => {
    router.refresh();
  };

  const handleRevokeClick = (apiKey: EnrichedApiKey) => {
    setSelectedApiKey(apiKey);
    revokeModal.onOpen();
  };

  const handleEditClick = (apiKey: EnrichedApiKey) => {
    setSelectedApiKey(apiKey);
    editModal.onOpen();
  };

  const columns = createApiKeyColumns(handleEditClick, handleRevokeClick);

  return (
    <>
      <Card variant="base" padding="none" className="p-4">
        <CardHeader>
          <div className="flex flex-col gap-2">
            <CardTitle>API Keys</CardTitle>
            <p className="text-xs text-gray-500">
              Manage API keys for programmatic access.{" "}
              <CustomLink href="https://docs.prowler.com/user-guide/tutorials/prowler-app-api-keys">
                Read the docs
              </CustomLink>
            </p>
          </div>
          <CardAction>
            <Button variant="default" size="sm" onClick={createModal.onOpen}>
              Create API Key
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {initialApiKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <p className="text-sm">No API keys created yet.</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={initialApiKeys}
              metadata={metadata}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateApiKeyModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        onSuccess={handleCreateSuccess}
      />

      {createdApiKey && (
        <ApiKeySuccessModal
          isOpen={successModal.isOpen}
          onClose={successModal.onClose}
          apiKey={createdApiKey}
        />
      )}

      <RevokeApiKeyModal
        isOpen={revokeModal.isOpen}
        onClose={revokeModal.onClose}
        apiKey={selectedApiKey}
        onSuccess={handleRevokeSuccess}
      />

      <EditApiKeyNameModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        apiKey={selectedApiKey}
        onSuccess={handleEditSuccess}
        existingApiKeys={initialApiKeys}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: api-keys-card.tsx]---
Location: prowler-master/ui/components/users/profile/api-keys-card.tsx

```typescript
import { getApiKeys } from "@/actions/api-keys/api-keys";
import { SearchParamsProps } from "@/types";

import { ApiKeysCardClient } from "./api-keys-card-client";

export const ApiKeysCard = async ({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) => {
  const page = parseInt(searchParams.page?.toString() || "1", 10);
  const pageSize = parseInt(searchParams.pageSize?.toString() || "10", 10);
  const sort = searchParams.sort?.toString();

  const apiKeysResponse = await getApiKeys({ page, pageSize, sort });

  return (
    <ApiKeysCardClient
      initialApiKeys={apiKeysResponse.data}
      metadata={apiKeysResponse.metadata}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: create-api-key-modal.tsx]---
Location: prowler-master/ui/components/users/profile/create-api-key-modal.tsx
Signals: Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createApiKey } from "@/actions/api-keys/api-keys";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { CustomAlertModal } from "@/components/ui/custom/custom-alert-modal";
import { CustomLink } from "@/components/ui/custom/custom-link";
import { Form, FormButtons } from "@/components/ui/form";

import { DEFAULT_EXPIRY_DAYS } from "./api-keys/constants";
import { calculateExpiryDate } from "./api-keys/utils";

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (apiKey: string) => void;
}

const createApiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
  expiresInDays: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 1 && num <= 3650;
  }, "Must be between 1 and 3650 days"),
});

type FormValues = z.infer<typeof createApiKeySchema>;

export const CreateApiKeyModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateApiKeyModalProps) => {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: "",
      expiresInDays: DEFAULT_EXPIRY_DAYS,
    },
  });

  const onSubmitClient = async (values: FormValues) => {
    try {
      const result = await createApiKey({
        name: values.name.trim(),
        expires_at: calculateExpiryDate(parseInt(values.expiresInDays)),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.data) {
        throw new Error("Failed to create API key");
      }

      const apiKey = result.data.data.attributes.api_key;
      if (!apiKey) {
        throw new Error("Failed to retrieve API key");
      }

      form.reset();
      onSuccess(apiKey);
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <CustomAlertModal
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="Create API Key"
      size="lg"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitClient)}
          className="flex flex-col gap-4"
        >
          <p className="text-xs text-gray-500">
            Need help configuring API Keys?{" "}
            <CustomLink href="https://docs.prowler.com/user-guide/tutorials/prowler-app-api-keys">
              Read the docs
            </CustomLink>
          </p>

          <div className="flex w-full justify-center gap-6">
            <CustomInput
              control={form.control}
              name="name"
              type="text"
              label="Name"
              labelPlacement="outside"
              placeholder="My API Key"
              variant="bordered"
              isRequired
            />
          </div>

          <div className="flex flex-col gap-2">
            <CustomInput
              control={form.control}
              name="expiresInDays"
              type="number"
              label="Expires in (days)"
              labelPlacement="outside"
              placeholder="365"
              variant="bordered"
              isRequired
            />
          </div>

          <FormButtons
            onCancel={handleClose}
            submitText="Create API Key"
            cancelText="Cancel"
            loadingText="Processing..."
            isDisabled={!form.formState.isValid}
          />
        </form>
      </Form>
    </CustomAlertModal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: edit-api-key-name-modal.tsx]---
Location: prowler-master/ui/components/users/profile/edit-api-key-name-modal.tsx
Signals: React, Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { updateApiKey } from "@/actions/api-keys/api-keys";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { CustomAlertModal } from "@/components/ui/custom/custom-alert-modal";
import { Form, FormButtons } from "@/components/ui/form";

import { EnrichedApiKey } from "./api-keys/types";
import { isApiKeyNameDuplicate } from "./api-keys/utils";

interface EditApiKeyNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: EnrichedApiKey | null;
  onSuccess: () => void;
  existingApiKeys: EnrichedApiKey[];
}

const editApiKeyNameSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormValues = z.infer<typeof editApiKeyNameSchema>;

export const EditApiKeyNameModal = ({
  isOpen,
  onClose,
  apiKey,
  onSuccess,
  existingApiKeys,
}: EditApiKeyNameModalProps) => {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(editApiKeyNameSchema),
    defaultValues: {
      name: apiKey?.attributes.name || "",
    },
  });

  // Sync form data when apiKey changes or modal opens
  useEffect(() => {
    if (isOpen && apiKey) {
      form.reset({ name: apiKey.attributes.name || "" });
    }
  }, [isOpen, apiKey, form]);

  const onSubmitClient = async (values: FormValues) => {
    try {
      if (!apiKey) {
        throw new Error("API key not found");
      }

      if (isApiKeyNameDuplicate(values.name, existingApiKeys, apiKey.id)) {
        throw new Error(
          "An API key with this name already exists. Please choose a different name.",
        );
      }

      const result = await updateApiKey(apiKey.id, {
        name: values.name.trim(),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <CustomAlertModal
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="Edit API Key Name"
      size="lg"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitClient)}
          className="flex flex-col gap-4"
        >
          <div className="text-sm text-slate-400">
            Prefix: {apiKey?.attributes.prefix}
          </div>

          <div className="flex flex-col gap-2">
            <CustomInput
              control={form.control}
              name="name"
              type="text"
              label="Name"
              labelPlacement="outside"
              placeholder="My API Key"
              variant="bordered"
              isRequired
            />
          </div>

          <FormButtons
            onCancel={handleClose}
            submitText="Save Changes"
            cancelText="Cancel"
            loadingText="Processing..."
            isDisabled={!form.formState.isValid}
          />
        </form>
      </Form>
    </CustomAlertModal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/users/profile/index.ts

```typescript
export * from "./api-key-success-modal";
export * from "./api-keys-card";
export * from "./api-keys-card-client";
export * from "./create-api-key-modal";
export * from "./edit-api-key-name-modal";
export * from "./membership-item";
export * from "./memberships-card";
export * from "./revoke-api-key-modal";
export * from "./role-item";
export * from "./roles-card";
export * from "./user-basic-info-card";
```

--------------------------------------------------------------------------------

---[FILE: membership-item.tsx]---
Location: prowler-master/ui/components/users/profile/membership-item.tsx
Signals: React

```typescript
"use client";

import { Chip } from "@heroui/chip";
import { useState } from "react";

import { Button, Card } from "@/components/shadcn";
import { CustomAlertModal } from "@/components/ui/custom";
import { DateWithTime, InfoField } from "@/components/ui/entities";
import { MembershipDetailData } from "@/types/users";

import { EditTenantForm } from "../forms";

export const MembershipItem = ({
  membership,
  tenantName,
  tenantId,
  isOwner,
}: {
  membership: MembershipDetailData;
  tenantName: string;
  tenantId: string;
  isOwner: boolean;
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <CustomAlertModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        title=""
      >
        <EditTenantForm
          tenantId={tenantId}
          tenantName={tenantName}
          setIsOpen={setIsEditOpen}
        />
      </CustomAlertModal>
      <Card variant="inner" className="min-w-[320px] p-2">
        <div className="flex w-full items-center gap-4">
          <Chip size="sm" variant="flat" color="secondary">
            {membership.attributes.role}
          </Chip>

          <div className="flex flex-row flex-wrap gap-1 gap-x-4">
            <InfoField label="Name" inline variant="transparent">
              <span className="font-semibold whitespace-nowrap">
                {tenantName}
              </span>
            </InfoField>
            <InfoField label="Joined on" inline variant="transparent">
              <DateWithTime
                inline
                showTime={false}
                dateTime={membership.attributes.date_joined}
              />
            </InfoField>
          </div>

          {isOwner && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="ml-auto"
            >
              Edit
            </Button>
          )}
        </div>
      </Card>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: memberships-card.tsx]---
Location: prowler-master/ui/components/users/profile/memberships-card.tsx

```typescript
import { Card, CardContent } from "@/components/shadcn";
import { MembershipDetailData, TenantDetailData } from "@/types/users";

import { MembershipItem } from "./membership-item";

export const MembershipsCard = ({
  memberships,
  tenantsMap,
  isOwner,
}: {
  memberships: MembershipDetailData[];
  tenantsMap: Record<string, TenantDetailData>;
  isOwner: boolean;
}) => {
  return (
    <Card variant="base" padding="none" className="p-4">
      <CardContent>
        <div className="mb-6 flex flex-col gap-1">
          <h4 className="text-lg font-bold">Organizations</h4>
          <p className="text-xs text-gray-500">
            Organizations this user is associated with
          </p>
        </div>
        {memberships.length === 0 ? (
          <div className="text-sm text-gray-500">No memberships found.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {memberships.map((membership) => {
              const tenantId = membership.relationships.tenant.data.id;
              return (
                <MembershipItem
                  key={membership.id}
                  membership={membership}
                  tenantId={tenantId}
                  tenantName={tenantsMap[tenantId]?.attributes.name}
                  isOwner={isOwner}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

````
