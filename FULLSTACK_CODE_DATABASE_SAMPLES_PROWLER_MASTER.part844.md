---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 844
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 844 of 867)

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

---[FILE: revoke-api-key-modal.tsx]---
Location: prowler-master/ui/components/users/profile/revoke-api-key-modal.tsx

```typescript
"use client";

import { Snippet } from "@heroui/snippet";
import { Trash2Icon } from "lucide-react";

import { revokeApiKey } from "@/actions/api-keys/api-keys";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert/Alert";
import { CustomAlertModal } from "@/components/ui/custom/custom-alert-modal";
import { ModalButtons } from "@/components/ui/custom/custom-modal-buttons";

import { FALLBACK_VALUES } from "./api-keys/constants";
import { EnrichedApiKey } from "./api-keys/types";
import { useModalForm } from "./api-keys/use-modal-form";

interface RevokeApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: EnrichedApiKey | null;
  onSuccess: () => void;
}

export const RevokeApiKeyModal = ({
  isOpen,
  onClose,
  apiKey,
  onSuccess,
}: RevokeApiKeyModalProps) => {
  const { isLoading, error, handleSubmit, handleClose } = useModalForm({
    initialData: {},
    onSubmit: async () => {
      if (!apiKey) {
        throw new Error("No API key selected");
      }

      const result = await revokeApiKey(apiKey.id);

      if (result.error) {
        throw new Error(result.error);
      }

      onSuccess();
    },
    onSuccess,
    onClose,
  });

  return (
    <CustomAlertModal
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="Revoke API Key"
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <Alert variant="destructive">
          <AlertTitle>⚠️ Warning</AlertTitle>
          <AlertDescription>
            This action cannot be undone. This API key will be revoked and will
            no longer work.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-2">
          <p>Are you sure you want to revoke this API key?</p>

          <Snippet
            hideSymbol
            hideCopyButton={true}
            classNames={{
              pre: "font-mono text-sm break-all whitespace-pre-wrap",
            }}
          >
            <p>{apiKey?.attributes.name || FALLBACK_VALUES.UNNAMED_KEY}</p>
            <p className="mt-1 text-xs">Prefix: {apiKey?.attributes.prefix}</p>
          </Snippet>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <ModalButtons
        onCancel={handleClose}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isDisabled={!apiKey}
        submitText="Revoke API Key"
        submitColor="danger"
        submitIcon={<Trash2Icon size={24} />}
      />
    </CustomAlertModal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: role-item.tsx]---
Location: prowler-master/ui/components/users/profile/role-item.tsx
Signals: React

```typescript
"use client";

import { Chip } from "@heroui/chip";
import { Ban, Check } from "lucide-react";
import { useState } from "react";

import { Button, Card } from "@/components/shadcn";
import { getRolePermissions } from "@/lib/permissions";
import { RoleData, RoleDetail } from "@/types/users";

interface PermissionItemProps {
  enabled: boolean;
  label: string;
}

export const PermissionIcon = ({ enabled }: { enabled: boolean }) => (
  <span
    className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}
  >
    {enabled ? <Check /> : <Ban />}
  </span>
);

const PermissionItem = ({ enabled, label }: PermissionItemProps) => (
  <div className="flex items-center gap-2 whitespace-nowrap">
    <PermissionIcon enabled={enabled} />
    <span className="text-xs">{label}</span>
  </div>
);

export const RoleItem = ({
  role,
  roleDetail,
}: {
  role: RoleData;
  roleDetail?: RoleDetail;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!roleDetail) {
    return (
      <Chip key={role.id} size="sm" variant="flat" color="primary">
        {role.id}
      </Chip>
    );
  }

  const { attributes } = roleDetail;
  const roleName = attributes?.name || role.id;
  const permissionState = attributes?.permission_state || "";
  const detailsId = `role-details-${role.id}`;

  const permissions = getRolePermissions(attributes);

  return (
    <Card variant="inner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Chip size="sm" variant="flat" color="primary">
            {roleName}
          </Chip>
          <span className="text-xs text-gray-500 capitalize">
            {permissionState}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide details" : "Show details"}
        </Button>
      </div>

      {isExpanded && (
        <div
          id={detailsId}
          className="animate-fadeIn border-border-neutral-primary border-t pt-4"
          role="region"
          aria-label={`Details for role ${roleName}`}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2">
            {permissions.map(({ key, label, enabled }) => (
              <PermissionItem key={key} label={label} enabled={enabled} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: roles-card.tsx]---
Location: prowler-master/ui/components/users/profile/roles-card.tsx

```typescript
import { Card, CardContent } from "@/components/shadcn";
import { RoleData, RoleDetail } from "@/types/users";

import { RoleItem } from "./role-item";

export const RolesCard = ({
  roles,
  roleDetails,
}: {
  roles: RoleData[];
  roleDetails: Record<string, RoleDetail>;
}) => {
  return (
    <Card variant="base" padding="none" className="p-4">
      <CardContent>
        <div className="mb-6 flex flex-col gap-1">
          <h4 className="text-lg font-bold">Active roles</h4>
          <p className="text-xs text-gray-500">
            Roles assigned to this user account
          </p>
        </div>
        {roles.length === 0 ? (
          <div className="text-sm text-gray-500">No roles assigned.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {roles.map((role) => (
              <RoleItem
                key={role.id}
                role={role}
                roleDetail={roleDetails[role.id]}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: skeleton-user-info.tsx]---
Location: prowler-master/ui/components/users/profile/skeleton-user-info.tsx

```typescript
import { Card, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export const SkeletonUserInfo = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* User Information */}
      <Card>
        <CardBody>
          <div className="flex flex-col gap-3">
            {/* Name */}
            <div className="flex items-center justify-between">
              <p className="text-default-600 text-sm font-semibold">Name:</p>
              <Skeleton className="h-5 w-24 rounded-lg">
                <div className="bg-default-200 h-5 w-24"></div>
              </Skeleton>
            </div>
            {/* Email */}
            <div className="flex items-center justify-between">
              <p className="text-default-600 text-sm font-semibold">Email:</p>
              <Skeleton className="h-5 w-32 rounded-lg">
                <div className="bg-default-200 h-5 w-32"></div>
              </Skeleton>
            </div>
            {/* Company */}
            <div className="flex items-center justify-between">
              <p className="text-default-600 text-sm font-semibold">Company:</p>
              <Skeleton className="h-5 w-28 rounded-lg">
                <div className="bg-default-200 h-5 w-28"></div>
              </Skeleton>
            </div>
            {/* Date Joined */}
            <div className="flex items-center justify-between">
              <p className="text-default-600 text-sm font-semibold">
                Date Joined:
              </p>
              <Skeleton className="h-5 w-36 rounded-lg">
                <div className="bg-default-200 h-5 w-36"></div>
              </Skeleton>
            </div>
            {/* Tenant ID */}
            <div className="flex items-center justify-between">
              <p className="text-default-600 text-sm font-semibold">
                Tenant ID:
              </p>
              <Skeleton className="h-5 w-32 rounded-lg">
                <div className="bg-default-200 h-5 w-32"></div>
              </Skeleton>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Roles */}
      <Card>
        <CardBody>
          <h4 className="mb-3 text-sm font-semibold">Roles</h4>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full">
                <div className="bg-default-200 h-6 w-20 rounded-full"></div>
              </Skeleton>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Memberships */}
      <Card>
        <CardBody>
          <h4 className="mb-3 text-sm font-semibold">Memberships</h4>
          <div className="flex flex-col gap-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md">
                <div className="bg-default-200 h-16 w-full rounded-md"></div>
              </Skeleton>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: user-basic-info-card.tsx]---
Location: prowler-master/ui/components/users/profile/user-basic-info-card.tsx

```typescript
"use client";

import { Divider } from "@heroui/divider";

import { ProwlerShort } from "@/components/icons";
import { Card, CardContent } from "@/components/shadcn";
import { DateWithTime, InfoField, SnippetChip } from "@/components/ui/entities";
import { UserDataWithRoles } from "@/types/users";

const TenantIdCopy = ({ id }: { id: string }) => {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap md:flex-col md:items-start md:justify-start">
      <SnippetChip value={id} />
    </div>
  );
};

export const UserBasicInfoCard = ({
  user,
  tenantId,
}: {
  user: UserDataWithRoles;
  tenantId: string;
}) => {
  const { name, email, company_name, date_joined } = user.attributes;

  return (
    <Card variant="base" padding="none" className="p-4">
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-3 border-black p-1 dark:border-white">
            <ProwlerShort />
          </div>
          <div className="flex flex-col">
            <span className="text-md font-bold">{name}</span>
            <span className="text-xs font-light">
              {email}
              {company_name && ` | ${company_name}`}
            </span>
          </div>
        </div>
        <Divider className="my-4" />
        <div className="flex flex-row gap-4 md:items-start md:justify-start md:gap-8">
          <div className="flex gap-2 whitespace-nowrap md:flex-col md:items-start md:justify-start">
            <div className="flex items-center gap-2">
              <InfoField label="Date Joined" variant="simple">
                <DateWithTime inline dateTime={date_joined} />
              </InfoField>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <InfoField label="Organization ID" variant="transparent">
              {tenantId ? (
                <TenantIdCopy id={tenantId} />
              ) : (
                <span className="text-xs font-light">No organization</span>
              )}
            </InfoField>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: column-api-keys.tsx]---
Location: prowler-master/ui/components/users/profile/api-keys/column-api-keys.tsx

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/table";

import { DataTableRowActions } from "./data-table-row-actions";
import {
  DateCell,
  EmailCell,
  LastUsedCell,
  NameCell,
  PrefixCell,
  StatusCell,
} from "./table-cells";
import { EnrichedApiKey } from "./types";

export const createApiKeyColumns = (
  onEdit: (apiKey: EnrichedApiKey) => void,
  onRevoke: (apiKey: EnrichedApiKey) => void,
): ColumnDef<EnrichedApiKey>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" param="name" />
    ),
    cell: ({ row }) => <NameCell apiKey={row.original} />,
  },
  {
    accessorKey: "prefix",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prefix" param="prefix" />
    ),
    cell: ({ row }) => <PrefixCell apiKey={row.original} />,
  },
  {
    id: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <EmailCell apiKey={row.original} />,
    enableSorting: false,
  },
  {
    accessorKey: "inserted_at",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created"
        param="inserted_at"
      />
    ),
    cell: ({ row }) => <DateCell date={row.original.attributes.inserted_at} />,
  },
  {
    accessorKey: "last_used_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Used" />
    ),
    cell: ({ row }) => <LastUsedCell apiKey={row.original} />,
    enableSorting: false,
  },
  {
    accessorKey: "expires_at",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Expires"
        param="expires_at"
      />
    ),
    cell: ({ row }) => <DateCell date={row.original.attributes.expires_at} />,
  },
  {
    accessorKey: "revoked",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" param="revoked" />
    ),
    cell: ({ row }) => <StatusCell apiKey={row.original} />,
  },
  {
    id: "actions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => {
      return (
        <DataTableRowActions row={row} onEdit={onEdit} onRevoke={onRevoke} />
      );
    },
    enableSorting: false,
  },
];
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: prowler-master/ui/components/users/profile/api-keys/constants.ts

```typescript
export const DEFAULT_EXPIRY_DAYS = "365";
export const ICON_SIZE = 16;

// Fallback values for display
export const FALLBACK_VALUES = {
  UNNAMED: "Unnamed",
  UNNAMED_KEY: "Unnamed Key",
  NEVER: "Never",
  UNKNOWN: "Unknown",
} as const;
```

--------------------------------------------------------------------------------

---[FILE: data-table-row-actions.tsx]---
Location: prowler-master/ui/components/users/profile/api-keys/data-table-row-actions.tsx

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

import { VerticalDotsIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";

import { EnrichedApiKey } from "./types";

interface DataTableRowActionsProps {
  row: Row<EnrichedApiKey>;
  onEdit: (apiKey: EnrichedApiKey) => void;
  onRevoke: (apiKey: EnrichedApiKey) => void;
}

const iconClasses = "text-2xl text-default-500 pointer-events-none shrink-0";

export function DataTableRowActions({
  row,
  onEdit,
  onRevoke,
}: DataTableRowActionsProps) {
  const apiKey = row.original;
  const isRevoked = apiKey.attributes.revoked;
  const isExpired = new Date(apiKey.attributes.expires_at) < new Date();
  const canRevoke = !isRevoked && !isExpired;

  return (
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
          aria-label="API Key actions"
          color="default"
          variant="flat"
        >
          <DropdownSection title="Actions">
            <DropdownItem
              key="edit"
              description="Edit the API key name"
              textValue="Edit name"
              startContent={<EditDocumentBulkIcon className={iconClasses} />}
              onPress={() => onEdit(apiKey)}
            >
              Edit name
            </DropdownItem>
          </DropdownSection>
          {canRevoke ? (
            <DropdownSection title="Danger zone">
              <DropdownItem
                key="revoke"
                className="text-text-error"
                color="danger"
                description="Revoke this API key permanently"
                textValue="Revoke"
                startContent={
                  <DeleteDocumentBulkIcon
                    className={clsx(iconClasses, "!text-text-error")}
                  />
                }
                onPress={() => onRevoke(apiKey)}
              >
                Revoke
              </DropdownItem>
            </DropdownSection>
          ) : null}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: table-cells.tsx]---
Location: prowler-master/ui/components/users/profile/api-keys/table-cells.tsx

```typescript
import { Chip } from "@heroui/chip";

import { FALLBACK_VALUES } from "./constants";
import { EnrichedApiKey, getApiKeyStatus } from "./types";
import { formatRelativeTime, getStatusColor, getStatusLabel } from "./utils";

export const NameCell = ({ apiKey }: { apiKey: EnrichedApiKey }) => (
  <p className="text-sm font-medium">
    {apiKey.attributes.name || FALLBACK_VALUES.UNNAMED}
  </p>
);

export const PrefixCell = ({ apiKey }: { apiKey: EnrichedApiKey }) => (
  <code className="rounded px-2 py-1 font-mono text-xs">
    {apiKey.attributes.prefix}
  </code>
);

export const DateCell = ({ date }: { date: string | null }) => (
  <p className="text-sm">{formatRelativeTime(date)}</p>
);

export const LastUsedCell = ({ apiKey }: { apiKey: EnrichedApiKey }) => (
  <DateCell date={apiKey.attributes.last_used_at} />
);

export const StatusCell = ({ apiKey }: { apiKey: EnrichedApiKey }) => {
  const status = getApiKeyStatus(apiKey);
  return (
    <Chip color={getStatusColor(status)} size="sm" variant="flat">
      {getStatusLabel(status)}
    </Chip>
  );
};

export const EmailCell = ({ apiKey }: { apiKey: EnrichedApiKey }) => (
  <p className="text-sm">{apiKey.userEmail}</p>
);
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: prowler-master/ui/components/users/profile/api-keys/types.ts

```typescript
// API Key types following JSON:API specification

export interface ApiKeyAttributes {
  name: string | null;
  prefix: string;
  expires_at: string;
  revoked: boolean;
  inserted_at: string;
  last_used_at: string | null;
}

export interface ApiKeyRelationships {
  entity: {
    data: {
      type: "users";
      id: string;
    } | null;
  };
}

export interface ApiKeyData {
  type: "api-keys";
  id: string;
  attributes: ApiKeyAttributes;
  relationships?: ApiKeyRelationships;
}

// Included resource types
export interface UserAttributes {
  name: string;
  email: string;
  company_name: string;
  date_joined: string;
}

export interface RoleAttributes {
  name: string;
  manage_users: boolean;
  manage_account: boolean;
}

export interface UserData {
  type: "users";
  id: string;
  attributes: UserAttributes;
  relationships?: {
    roles: {
      data: Array<{
        type: "roles";
        id: string;
      }>;
      meta?: {
        count: number;
      };
    };
  };
}

export interface RoleData {
  type: "roles";
  id: string;
  attributes: RoleAttributes;
}

export type IncludedResource = UserData | RoleData;

export interface ApiKeyResponse {
  data: ApiKeyData[];
  included?: IncludedResource[];
  meta?: {
    pagination?: {
      page: number;
      pages: number;
      count: number;
    };
  };
}

/**
 * Enriched API Key with user data already resolved
 * This type extends the base ApiKeyData with additional fields
 * populated from the included resources in the API response
 */
export interface EnrichedApiKey extends ApiKeyData {
  userEmail: string;
}

export interface SingleApiKeyResponse {
  data: ApiKeyData;
}

export interface CreateApiKeyResponse {
  data: ApiKeyData & {
    attributes: ApiKeyAttributes & {
      api_key: string; // Only present on creation
    };
  };
}

export interface CreateApiKeyPayload {
  name: string;
  expires_at?: string; // ISO date string
}

export interface UpdateApiKeyPayload {
  name: string;
}

// Status for UI display
export const API_KEY_STATUS = {
  ACTIVE: "active",
  REVOKED: "revoked",
  EXPIRED: "expired",
} as const;

export type ApiKeyStatus = (typeof API_KEY_STATUS)[keyof typeof API_KEY_STATUS];

// Helper to determine API key status
export const getApiKeyStatus = (apiKey: ApiKeyData): ApiKeyStatus => {
  if (apiKey.attributes.revoked) {
    return API_KEY_STATUS.REVOKED;
  }

  const expiryDate = new Date(apiKey.attributes.expires_at);
  const now = new Date();

  if (expiryDate < now) {
    return API_KEY_STATUS.EXPIRED;
  }

  return API_KEY_STATUS.ACTIVE;
};
```

--------------------------------------------------------------------------------

---[FILE: use-modal-form.ts]---
Location: prowler-master/ui/components/users/profile/api-keys/use-modal-form.ts
Signals: React

```typescript
import { useState } from "react";

interface UseModalFormOptions<TFormData> {
  initialData: TFormData;
  onSubmit: (data: TFormData) => Promise<void>;
  onSuccess?: () => void;
  onClose: () => void;
}

interface UseModalFormReturn<TFormData> {
  formData: TFormData;
  setFormData: React.Dispatch<React.SetStateAction<TFormData>>;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
  resetForm: () => void;
}

/**
 * Custom hook to manage modal form state and submission logic
 * Reduces boilerplate in modal components
 */
export const useModalForm = <TFormData>({
  initialData,
  onSubmit,
  onSuccess,
  onClose,
}: UseModalFormOptions<TFormData>): UseModalFormReturn<TFormData> => {
  const [formData, setFormData] = useState<TFormData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData(initialData);
    setError(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return {
    formData,
    setFormData,
    isLoading,
    error,
    setError,
    handleSubmit,
    handleClose,
    resetForm,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: prowler-master/ui/components/users/profile/api-keys/utils.ts

```typescript
import { formatDistanceToNow } from "date-fns";

import { FALLBACK_VALUES } from "./constants";
import {
  API_KEY_STATUS,
  ApiKeyData,
  ApiKeyStatus,
  IncludedResource,
  UserData,
} from "./types";

export const getStatusColor = (
  status: ApiKeyStatus,
): "success" | "danger" | "warning" => {
  const colorMap: Record<ApiKeyStatus, "success" | "danger" | "warning"> = {
    [API_KEY_STATUS.ACTIVE]: "success",
    [API_KEY_STATUS.REVOKED]: "danger",
    [API_KEY_STATUS.EXPIRED]: "warning",
  };

  return colorMap[status] || "success";
};

export const getStatusLabel = (status: ApiKeyStatus): string => {
  const labelMap: Record<ApiKeyStatus, string> = {
    [API_KEY_STATUS.ACTIVE]: "Active",
    [API_KEY_STATUS.REVOKED]: "Revoked",
    [API_KEY_STATUS.EXPIRED]: "Expired",
  };

  return labelMap[status] || FALLBACK_VALUES.UNKNOWN;
};

export const formatRelativeTime = (date: string | null): string => {
  if (!date) return FALLBACK_VALUES.NEVER;
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const calculateExpiryDate = (days: number): string => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt.toISOString();
};

/**
 * Generic utility to find a resource in the included array by type and ID
 */
export const findIncludedResource = <T extends IncludedResource>(
  included: IncludedResource[] | undefined,
  type: string,
  id: string,
): T | undefined => {
  if (!included) return undefined;
  return included.find(
    (resource): resource is T => resource.type === type && resource.id === id,
  );
};

/**
 * Extracts the email from the included resources based on the API key's entity relationship
 */
export const getApiKeyUserEmail = (
  apiKey: ApiKeyData,
  included?: IncludedResource[],
): string => {
  if (!apiKey.relationships?.entity?.data) {
    return FALLBACK_VALUES.UNKNOWN;
  }

  const userId = apiKey.relationships.entity.data.id;
  const user = findIncludedResource<UserData>(included, "users", userId);

  return user?.attributes.email || FALLBACK_VALUES.UNKNOWN;
};

/**
 * Checks if an API key name already exists in the list
 * @param name - The name to check
 * @param existingApiKeys - List of existing API keys
 * @param excludeId - Optional ID to exclude from the check (for edit scenarios)
 * @returns true if the name already exists, false otherwise
 */
export const isApiKeyNameDuplicate = (
  name: string,
  existingApiKeys: ApiKeyData[],
  excludeId?: string,
): boolean => {
  const trimmedName = name.trim().toLowerCase();

  return existingApiKeys.some(
    (key) =>
      key.id !== excludeId &&
      key.attributes.name?.toLowerCase() === trimmedName,
  );
};
```

--------------------------------------------------------------------------------

---[FILE: column-users.tsx]---
Location: prowler-master/ui/components/users/table/column-users.tsx

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DateWithTime } from "@/components/ui/entities";
import { DataTableColumnHeader } from "@/components/ui/table";
import { UserProps } from "@/types";

import { DataTableRowActions } from "./data-table-row-actions";

const getUserData = (row: { original: UserProps }) => {
  return row.original.attributes;
};

export const ColumnsUser: ColumnDef<UserProps>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Name"} param="name" />
    ),
    cell: ({ row }) => {
      const data = getUserData(row);
      return <p className="font-semibold">{data?.name || "N/A"}</p>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Email"} param="email" />
    ),
    cell: ({ row }) => {
      const { email } = getUserData(row);
      return <p className="font-semibold">{email}</p>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const { role } = getUserData(row);
      return <p className="font-semibold">{role?.name || "No Role"}</p>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Company name"}
        param="company_name"
      />
    ),
    cell: ({ row }) => {
      const { company_name } = getUserData(row);
      return <p className="font-semibold">{company_name}</p>;
    },
  },
  {
    accessorKey: "date_joined",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Joined"}
        param="date_joined"
      />
    ),
    cell: ({ row }) => {
      const { date_joined } = getUserData(row);
      return <DateWithTime dateTime={date_joined} showTime={false} />;
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
Location: prowler-master/ui/components/users/table/data-table-row-actions.tsx
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
  DeleteDocumentBulkIcon,
  EditDocumentBulkIcon,
} from "@heroui/shared-icons";
import { Row } from "@tanstack/react-table";
import clsx from "clsx";
import { useState } from "react";

import { VerticalDotsIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";
import { CustomAlertModal } from "@/components/ui/custom";

import { DeleteForm, EditForm } from "../forms";

interface DataTableRowActionsProps<UserProps> {
  row: Row<UserProps>;
  roles?: { id: string; name: string }[];
}
const iconClasses = "text-2xl text-default-500 pointer-events-none shrink-0";

export function DataTableRowActions<UserProps>({
  row,
  roles,
}: DataTableRowActionsProps<UserProps>) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const userId = (row.original as { id: string }).id;
  const userName = (row.original as any).attributes?.name;
  const userEmail = (row.original as any).attributes?.email;
  const userCompanyName = (row.original as any).attributes?.company_name;
  const userRole = (row.original as any).attributes?.role?.name;

  return (
    <>
      <CustomAlertModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit user details"
      >
        <EditForm
          userId={userId}
          userName={userName}
          userEmail={userEmail}
          userCompanyName={userCompanyName}
          currentRole={userRole}
          roles={roles || []}
          setIsOpen={setIsEditOpen}
        />
      </CustomAlertModal>
      <CustomAlertModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your user account and remove your data from the server."
      >
        <DeleteForm userId={userId} setIsOpen={setIsDeleteOpen} />
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
                description="Allows you to edit the user"
                textValue="Edit User"
                startContent={<EditDocumentBulkIcon className={iconClasses} />}
                onPress={() => setIsEditOpen(true)}
              >
                Edit User
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Danger zone">
              <DropdownItem
                key="delete"
                className="text-text-error"
                color="danger"
                description="Delete the user permanently"
                textValue="Delete User"
                startContent={
                  <DeleteDocumentBulkIcon
                    className={clsx(iconClasses, "!text-text-error")}
                  />
                }
                onPress={() => setIsDeleteOpen(true)}
              >
                Delete User
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
Location: prowler-master/ui/components/users/table/index.ts

```typescript
export * from "./column-users";
export * from "./data-table-row-actions";
export * from "./skeleton-table-user";
```

--------------------------------------------------------------------------------

---[FILE: skeleton-table-user.tsx]---
Location: prowler-master/ui/components/users/table/skeleton-table-user.tsx
Signals: React

```typescript
import React from "react";

import { Card } from "@/components/shadcn/card/card";
import { Skeleton } from "@/components/shadcn/skeleton/skeleton";

export const SkeletonTableUser = () => {
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

---[FILE: fonts.ts]---
Location: prowler-master/ui/config/fonts.ts
Signals: Next.js

```typescript
import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  preload: false,
  display: "swap",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: false,
});
```

--------------------------------------------------------------------------------

---[FILE: site.ts]---
Location: prowler-master/ui/config/site.ts

```typescript
export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Prowler",
  description:
    "The most comprehensive, free tool for AWS security. ProwlerPro is trusted by leading organizations to make cloud security effortless.",
};
```

--------------------------------------------------------------------------------

---[FILE: CODE_REVIEW_QUICK_START.md]---
Location: prowler-master/ui/docs/code-review/CODE_REVIEW_QUICK_START.md

```text
# Code Review - Quick Start

## 3 Steps to Enable

### 1. Open `.env`
```bash
nano ui/.env
# or your favorite editor
```

### 2. Find this line
```bash
CODE_REVIEW_ENABLED=false
```

### 3. Change it to
```bash
CODE_REVIEW_ENABLED=true
```

**Done! ✅**

---

## What Happens Now

Every time you `git commit`:

```
✅ If your code complies with AGENTS.md standards:
   → Commit executes normally

❌ If there are standard violations:
   → Commit is BLOCKED
   → You see the errors in the terminal
   → Fix the code
   → Commit again
```

---

## Example

```bash
$ git commit -m "feat: add new component"

🏁 Prowler UI - Pre-Commit Hook

ℹ️  Code Review Status: true

🔍 Running Claude Code standards validation...

📋 Files to validate:
  - components/my-feature.tsx

📤 Sending to Claude Code for validation...

STATUS: FAILED
- File: components/my-feature.tsx:45
  Rule: React Imports
  Issue: Using 'import * as React'
  Expected: import { useState } from "react"

❌ VALIDATION FAILED
Fix violations before committing

# Fix the file and commit again
$ git commit -m "feat: add new component"

🏁 Prowler UI - Pre-Commit Hook

ℹ️  Code Review Status: true

🔍 Running Claude Code standards validation...

✅ VALIDATION PASSED

# Commit successful ✅
```

---

## Disable Temporarily

If you need to commit without validation:

```bash
# Option 1: Change in .env
CODE_REVIEW_ENABLED=false

# Option 2: Bypass (use with caution!)
git commit --no-verify
```

---

## What Gets Validated

- ✅ Correct React imports
- ✅ TypeScript patterns (const-based types)
- ✅ Tailwind CSS (no var() or hex in className)
- ✅ cn() utility (only for conditionals)
- ✅ No useMemo/useCallback without reason
- ✅ Zod v4 syntax
- ✅ File organization
- ✅ Directives "use client"/"use server"

---

## More Info

Read `CODE_REVIEW_SETUP.md` for:
- Troubleshooting
- Complete details
- Advanced configuration
```

--------------------------------------------------------------------------------

````
