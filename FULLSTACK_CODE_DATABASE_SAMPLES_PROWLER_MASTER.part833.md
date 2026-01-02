---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 833
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 833 of 867)

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

---[FILE: k8s-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/via-credentials/k8s-credentials-form.tsx

```typescript
import { Control } from "react-hook-form";

import { CustomTextarea } from "@/components/ui/custom";
import { KubernetesCredentials } from "@/types";

export const KubernetesCredentialsForm = ({
  control,
}: {
  control: Control<KubernetesCredentials>;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          Connect via Credentials
        </div>
        <div className="text-default-500 text-sm">
          Please provide the kubeconfig content for your Kubernetes credentials.
        </div>
      </div>
      <CustomTextarea
        control={control}
        name="kubeconfig_content"
        label="Kubeconfig Content"
        labelPlacement="inside"
        placeholder="Paste your Kubeconfig YAML content here"
        variant="bordered"
        minRows={10}
        isRequired
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: mongodbatlas-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/via-credentials/mongodbatlas-credentials-form.tsx

```typescript
import { Control } from "react-hook-form";

import { CustomInput } from "@/components/ui/custom";
import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";
import { MongoDBAtlasCredentials } from "@/types";

export const MongoDBAtlasCredentialsForm = ({
  control,
}: {
  control: Control<MongoDBAtlasCredentials>;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          Connect via API Keys
        </div>
        <div className="text-default-500 text-sm">
          Provide an organization-level MongoDB Atlas API public and private key
          with read access to the resources you want Prowler to assess.
        </div>
      </div>
      <CustomInput
        control={control}
        name={ProviderCredentialFields.ATLAS_PUBLIC_KEY}
        type="text"
        label="Atlas Public Key"
        labelPlacement="inside"
        placeholder="e.g. abcdefgh"
        variant="bordered"
        isRequired
      />
      <CustomInput
        control={control}
        name={ProviderCredentialFields.ATLAS_PRIVATE_KEY}
        type="password"
        label="Atlas Private Key"
        labelPlacement="inside"
        placeholder="Enter the private key"
        variant="bordered"
        isRequired
      />
      <div className="text-default-400 text-xs">
        Keys never leave your browser unencrypted and are stored as secrets in
        the backend. Rotate the key from MongoDB Atlas anytime if needed.
      </div>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: oraclecloud-credentials-form.tsx]---
Location: prowler-master/ui/components/providers/workflow/forms/via-credentials/oraclecloud-credentials-form.tsx

```typescript
import { Control, Controller } from "react-hook-form";

import { CustomInput, CustomTextarea } from "@/components/ui/custom";
import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";
import { OCICredentials } from "@/types";

export const OracleCloudCredentialsForm = ({
  control,
}: {
  control: Control<OCICredentials>;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="text-md text-default-foreground leading-9 font-bold">
          Connect via API Key
        </div>
        <div className="text-default-500 text-sm">
          Please provide your Oracle Cloud Infrastructure API key credentials.
        </div>
      </div>
      {/* Hidden input for tenancy - auto-populated from provider UID */}
      <Controller
        control={control}
        name={ProviderCredentialFields.OCI_TENANCY}
        render={({ field }) => <input type="hidden" {...field} />}
      />
      <CustomInput
        control={control}
        name={ProviderCredentialFields.OCI_USER}
        type="text"
        label="User OCID"
        labelPlacement="inside"
        placeholder="ocid1.user.oc1..aaaaaaa..."
        variant="bordered"
        isRequired
      />
      <CustomInput
        control={control}
        name={ProviderCredentialFields.OCI_FINGERPRINT}
        type="text"
        label="Fingerprint"
        labelPlacement="inside"
        placeholder="Enter the API key fingerprint"
        variant="bordered"
        isRequired
      />
      <CustomInput
        control={control}
        name={ProviderCredentialFields.OCI_REGION}
        type="text"
        label="Region"
        labelPlacement="inside"
        placeholder="e.g. us-ashburn-1"
        variant="bordered"
        isRequired
      />
      <CustomTextarea
        control={control}
        name={ProviderCredentialFields.OCI_KEY_CONTENT}
        label="Private Key Content"
        labelPlacement="inside"
        placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;MIIEpAIBAAKCAQEA...&#10;-----END RSA PRIVATE KEY-----"
        variant="bordered"
        minRows={6}
        isRequired
      />
      <CustomInput
        control={control}
        name={ProviderCredentialFields.OCI_PASS_PHRASE}
        type="password"
        label="Passphrase (Optional)"
        labelPlacement="inside"
        placeholder="Enter passphrase if key is encrypted"
        variant="bordered"
        isRequired={false}
      />
      <div className="text-default-400 text-xs">
        Paste the raw content of your OCI private key file (PEM format). The key
        will be automatically encoded for secure transmission.
      </div>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: skeleton-finding-details.tsx]---
Location: prowler-master/ui/components/resources/skeleton/skeleton-finding-details.tsx
Signals: React

```typescript
import React from "react";

export const SkeletonFindingDetails = () => {
  return (
    <div className="dark:bg-prowler-blue-400 flex animate-pulse flex-col gap-6 rounded-lg p-4 shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="bg-default-200 h-6 w-2/3 rounded" />
        <div className="flex items-center gap-x-4">
          <div className="bg-default-200 h-5 w-6 rounded-full" />
          <div className="bg-default-200 h-6 w-20 rounded" />
        </div>
      </div>

      {/* Metadata Section */}
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="bg-default-200 h-4 w-20 rounded" />
            <div className="bg-default-200 h-5 w-40 rounded" />
          </div>
        ))}
      </div>

      {/* InfoField Blocks */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="bg-default-200 h-4 w-28 rounded" />
          <div className="bg-default-200 h-5 w-full rounded" />
        </div>
      ))}

      {/* Risk and Description Sections */}
      <div className="flex flex-col gap-2">
        <div className="bg-default-200 h-4 w-28 rounded" />
        <div className="bg-default-200 h-16 w-full rounded" />
      </div>

      <div className="bg-default-200 h-4 w-36 rounded" />

      <div className="flex flex-col gap-2">
        <div className="bg-default-200 h-4 w-24 rounded" />
        <div className="bg-default-200 h-5 w-2/3 rounded" />
        <div className="bg-default-200 h-4 w-24 rounded" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="bg-default-200 h-4 w-28 rounded" />
        <div className="bg-default-200 h-10 w-full rounded" />
      </div>

      {/* Additional Resources */}
      <div className="flex flex-col gap-2">
        <div className="bg-default-200 h-4 w-36 rounded" />
        <div className="bg-default-200 h-5 w-32 rounded" />
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-2">
        <div className="bg-default-200 h-4 w-24 rounded" />
        <div className="bg-default-200 h-5 w-1/3 rounded" />
      </div>

      {/* Provider Info Section */}
      <div className="mt-4 flex items-center gap-2">
        <div className="bg-default-200 relative h-8 w-8 rounded-full">
          <div className="bg-default-300 absolute top-0 right-0 h-2 w-2 rounded-full" />
        </div>
        <div className="flex max-w-[120px] flex-col gap-1">
          <div className="bg-default-200 h-4 w-full rounded" />
          <div className="bg-default-200 h-4 w-16 rounded" />
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: skeleton-finding-summary.tsx]---
Location: prowler-master/ui/components/resources/skeleton/skeleton-finding-summary.tsx
Signals: React

```typescript
import React from "react";

export const SkeletonFindingSummary = () => {
  return (
    <div className="dark:bg-prowler-blue-400 flex animate-pulse flex-col gap-4 rounded-lg p-4 shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="bg-default-200 h-5 w-1/3 rounded" />
        <div className="flex items-center gap-2">
          <div className="bg-default-200 h-5 w-16 rounded" />
          <div className="bg-default-200 h-5 w-16 rounded" />
          <div className="bg-default-200 h-5 w-5 rounded-full" />
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: skeleton-table-resources.tsx]---
Location: prowler-master/ui/components/resources/skeleton/skeleton-table-resources.tsx
Signals: React

```typescript
import React from "react";

import { Card } from "@/components/shadcn/card/card";
import { Skeleton } from "@/components/shadcn/skeleton/skeleton";

export const SkeletonTableResources = () => {
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

---[FILE: column-resources.tsx]---
Location: prowler-master/ui/components/resources/table/column-resources.tsx
Signals: Next.js

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Database } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { InfoIcon } from "@/components/icons";
import { EntityInfo, SnippetChip } from "@/components/ui/entities";
import { TriggerSheet } from "@/components/ui/sheet";
import { DataTableColumnHeader } from "@/components/ui/table";
import { ProviderType, ResourceProps } from "@/types";

import { ResourceDetail } from "./resource-detail";

const getResourceData = (
  row: { original: ResourceProps },
  field: keyof ResourceProps["attributes"],
) => {
  return row.original.attributes?.[field];
};

const getChipStyle = (count: number) => {
  if (count === 0) return "bg-green-100 text-green-800";
  if (count >= 10) return "bg-red-100 text-red-800";
  if (count >= 1) return "bg-yellow-100 text-yellow-800";
};

const getProviderData = (
  row: { original: ResourceProps },
  field: keyof ResourceProps["relationships"]["provider"]["data"]["attributes"],
) => {
  return (
    row.original.relationships?.provider?.data?.attributes?.[field] ??
    `No ${field} found in provider`
  );
};

const ResourceDetailsCell = ({ row }: { row: any }) => {
  const searchParams = useSearchParams();
  const resourceId = searchParams.get("resourceId");
  const isOpen = resourceId === row.original.id;

  return (
    <div className="flex w-9 items-center justify-center">
      <TriggerSheet
        triggerComponent={
          <InfoIcon className="text-button-primary" size={16} />
        }
        title="Resource Details"
        description="View the Resource details"
        defaultOpen={isOpen}
      >
        <ResourceDetail
          resourceId={row.original.id}
          initialResourceData={row.original}
        />
      </TriggerSheet>
    </div>
  );
};

export const ColumnResources: ColumnDef<ResourceProps>[] = [
  {
    id: "moreInfo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
    cell: ({ row }) => <ResourceDetailsCell row={row} />,
    enableSorting: false,
  },
  {
    accessorKey: "resourceName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resource name" />
    ),
    cell: ({ row }) => {
      const resourceName = getResourceData(row, "name");
      const displayName =
        typeof resourceName === "string" && resourceName.trim().length > 0
          ? resourceName
          : "Unnamed resource";

      return (
        <SnippetChip
          value={displayName}
          className="max-w-[320px]"
          icon={<Database size={16} />}
        />
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "failedFindings",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Failed Findings" />
    ),
    cell: ({ row }) => {
      const failedFindingsCount = getResourceData(
        row,
        "failed_findings_count",
      ) as number;

      return (
        <span
          className={`ml-10 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs font-semibold text-yellow-800 ${getChipStyle(failedFindingsCount)}`}
        >
          {failedFindingsCount}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Region"} param="region" />
    ),
    cell: ({ row }) => {
      const region = getResourceData(row, "region");

      return (
        <div className="w-[80px] text-xs">
          {typeof region === "string" ? region : "Invalid region"}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Type"} param="type" />
    ),
    cell: ({ row }) => {
      const type = getResourceData(row, "type");

      return (
        <div className="max-w-[150px] text-xs break-words whitespace-nowrap">
          {typeof type === "string" ? type : "Invalid type"}
        </div>
      );
    },
  },
  {
    accessorKey: "service",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Service"}
        param="service"
      />
    ),
    cell: ({ row }) => {
      const service = getResourceData(row, "service");

      return (
        <div className="max-w-96 truncate text-xs">
          {typeof service === "string" ? service : "Invalid region"}
        </div>
      );
    },
  },
  {
    accessorKey: "provider",
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
            entityAlias={alias && typeof alias === "string" ? alias : undefined}
            entityId={uid && typeof uid === "string" ? uid : undefined}
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
Location: prowler-master/ui/components/resources/table/index.ts

```typescript
export * from "../skeleton/skeleton-table-resources";
export * from "./column-resources";
export * from "./resource-detail";
```

--------------------------------------------------------------------------------

---[FILE: resource-detail.tsx]---
Location: prowler-master/ui/components/resources/table/resource-detail.tsx
Signals: React

```typescript
"use client";

import { Snippet } from "@heroui/snippet";
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";
import { ExternalLink, InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { getFindingById } from "@/actions/findings";
import { getResourceById } from "@/actions/resources";
import { FindingDetail } from "@/components/findings/table/finding-detail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";
import { BreadcrumbNavigation, CustomBreadcrumbItem } from "@/components/ui";
import {
  DateWithTime,
  getProviderLogo,
  InfoField,
} from "@/components/ui/entities";
import { SeverityBadge, StatusFindingBadge } from "@/components/ui/table";
import { createDict } from "@/lib";
import { buildGitFileUrl } from "@/lib/iac-utils";
import { FindingProps, ProviderType, ResourceProps } from "@/types";

const SEVERITY_ORDER = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  informational: 4,
} as const;

type SeverityLevel = keyof typeof SEVERITY_ORDER;

interface ResourceFinding {
  type: "findings";
  id: string;
  attributes: {
    status: "PASS" | "FAIL" | "MANUAL";
    severity: SeverityLevel;
    check_metadata?: {
      checktitle?: string;
    };
  };
}

interface FindingReference {
  id: string;
}

const renderValue = (value: string | null | undefined) => {
  return value && value.trim() !== "" ? value : "-";
};

const parseMetadata = (
  metadata: Record<string, unknown> | string | null | undefined,
): Record<string, unknown> | null => {
  if (!metadata) return null;

  if (typeof metadata === "string") {
    try {
      const parsed = JSON.parse(metadata);
      return typeof parsed === "object" && parsed !== null ? parsed : null;
    } catch {
      return null;
    }
  }

  if (typeof metadata === "object" && metadata !== null) {
    return metadata as Record<string, unknown>;
  }

  return null;
};

const buildCustomBreadcrumbs = (
  _resourceName: string,
  findingTitle?: string,
  onBackToResource?: () => void,
): CustomBreadcrumbItem[] => {
  const breadcrumbs: CustomBreadcrumbItem[] = [
    {
      name: "Resource Details",
      isClickable: !!findingTitle,
      onClick: findingTitle ? onBackToResource : undefined,
      isLast: !findingTitle,
    },
  ];

  if (findingTitle) {
    breadcrumbs.push({
      name: findingTitle,
      isLast: true,
      isClickable: false,
    });
  }

  return breadcrumbs;
};

export const ResourceDetail = ({
  resourceId,
  initialResourceData,
}: {
  resourceId: string;
  initialResourceData: ResourceProps;
}) => {
  const [findingsData, setFindingsData] = useState<ResourceFinding[]>([]);
  const [resourceTags, setResourceTags] = useState<Record<string, string>>({});
  const [findingsLoading, setFindingsLoading] = useState(true);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(
    null,
  );
  const [findingDetails, setFindingDetails] = useState<FindingProps | null>(
    null,
  );

  useEffect(() => {
    const loadFindings = async () => {
      setFindingsLoading(true);

      try {
        const resourceData = await getResourceById(resourceId, {
          include: ["findings"],
          fields: ["tags", "findings"],
        });

        if (resourceData?.data) {
          // Get tags from the detailed resource data
          setResourceTags(resourceData.data.attributes.tags || {});

          // Create dictionary for findings and expand them
          if (resourceData.data.relationships?.findings) {
            const findingsDict = createDict("findings", resourceData);
            const findings =
              resourceData.data.relationships.findings.data?.map(
                (finding: FindingReference) => findingsDict[finding.id],
              ) || [];
            setFindingsData(findings as ResourceFinding[]);
          } else {
            setFindingsData([]);
          }
        } else {
          setFindingsData([]);
          setResourceTags({});
        }
      } catch (err) {
        console.error("Error loading findings:", err);
        setFindingsData([]);
        setResourceTags({});
      } finally {
        setFindingsLoading(false);
      }
    };

    if (resourceId) {
      loadFindings();
    }
  }, [resourceId]);

  const navigateToFinding = async (findingId: string) => {
    setSelectedFindingId(findingId);

    try {
      const findingData = await getFindingById(
        findingId,
        "resources,scan.provider",
      );
      if (findingData?.data) {
        // Create dictionaries for resources, scans, and providers
        const resourceDict = createDict("resources", findingData);
        const scanDict = createDict("scans", findingData);
        const providerDict = createDict("providers", findingData);

        // Expand the finding with its corresponding resource, scan, and provider
        const finding = findingData.data;
        const scan = scanDict[finding.relationships?.scan?.data?.id];
        const resource =
          resourceDict[finding.relationships?.resources?.data?.[0]?.id];
        const provider = providerDict[scan?.relationships?.provider?.data?.id];

        const expandedFinding = {
          ...finding,
          relationships: { scan, resource, provider },
        };

        setFindingDetails(expandedFinding);
      }
    } catch (error) {
      console.error("Error fetching finding:", error);
    }
  };

  const handleBackToResource = () => {
    setSelectedFindingId(null);
    setFindingDetails(null);
  };

  if (!initialResourceData) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4 rounded-lg p-8">
        <Spinner size="lg" />
        <p className="dark:text-prowler-theme-pale/80 text-sm text-gray-600">
          Loading resource details...
        </p>
      </div>
    );
  }

  const resource = initialResourceData;
  const attributes = resource.attributes;
  const providerData = resource.relationships.provider.data.attributes;

  // Filter only failed findings and sort by severity
  const failedFindings = findingsData
    .filter(
      (finding: ResourceFinding) => finding?.attributes?.status === "FAIL",
    )
    .sort((a: ResourceFinding, b: ResourceFinding) => {
      const severityA = (a?.attributes?.severity?.toLowerCase() ||
        "informational") as SeverityLevel;
      const severityB = (b?.attributes?.severity?.toLowerCase() ||
        "informational") as SeverityLevel;
      return (
        (SEVERITY_ORDER[severityA] ?? 999) - (SEVERITY_ORDER[severityB] ?? 999)
      );
    });

  // Build Git URL for IaC resources
  const gitUrl =
    providerData.provider === "iac"
      ? buildGitFileUrl(
          providerData.uid,
          attributes.name,
          "",
          attributes.region,
        )
      : null;

  if (selectedFindingId) {
    const findingTitle =
      findingDetails?.attributes?.check_metadata?.checktitle ||
      "Finding Detail";

    return (
      <div className="flex flex-col gap-4">
        <BreadcrumbNavigation
          mode="custom"
          customItems={buildCustomBreadcrumbs(
            attributes.name,
            findingTitle,
            handleBackToResource,
          )}
        />

        {findingDetails && <FindingDetail findingDetails={findingDetails} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-lg">
      {/* Resource Details section */}
      <Card variant="base" padding="lg">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-center justify-start gap-2">
            <CardTitle>Resource Details</CardTitle>
            {providerData.provider === "iac" && gitUrl && (
              <Tooltip content="Go to Resource in the Repository" size="sm">
                <a
                  href={gitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bg-data-info mt-1 inline-flex cursor-pointer"
                  aria-label="Open resource in repository"
                >
                  <ExternalLink size={16} className="inline" />
                </a>
              </Tooltip>
            )}
          </div>
          {getProviderLogo(providerData.provider as ProviderType)}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <InfoField label="Resource UID" variant="simple">
            <Snippet
              className="border-border-neutral-tertiary bg-bg-neutral-tertiary rounded-lg border py-1"
              hideSymbol
            >
              <span className="text-xs whitespace-pre-line">
                {renderValue(attributes.uid)}
              </span>
            </Snippet>
          </InfoField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoField label="Resource Name">
              {renderValue(attributes.name)}
            </InfoField>
            <InfoField label="Resource Type">
              {renderValue(attributes.type)}
            </InfoField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoField label="Service">
              {renderValue(attributes.service)}
            </InfoField>
            <InfoField label="Region">
              {renderValue(attributes.region)}
            </InfoField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoField label="Partition">
              {renderValue(attributes.partition)}
            </InfoField>
            <InfoField label="Details">
              {renderValue(attributes.details)}
            </InfoField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoField label="Created At">
              <DateWithTime inline dateTime={attributes.inserted_at} />
            </InfoField>
            <InfoField label="Last Updated">
              <DateWithTime inline dateTime={attributes.updated_at} />
            </InfoField>
          </div>

          {(() => {
            const parsedMetadata = parseMetadata(attributes.metadata);
            return parsedMetadata &&
              Object.entries(parsedMetadata).length > 0 ? (
              <InfoField label="Metadata" variant="simple">
                <div className="border-border-neutral-tertiary bg-bg-neutral-tertiary relative w-full rounded-lg border">
                  <Snippet
                    className="absolute top-2 right-2 z-10 bg-transparent"
                    classNames={{
                      base: "bg-transparent p-0 min-w-0",
                      pre: "hidden",
                    }}
                  >
                    {JSON.stringify(parsedMetadata, null, 2)}
                  </Snippet>
                  <pre className="minimal-scrollbar mr-10 max-h-[100px] overflow-auto p-3 text-xs break-words whitespace-pre-wrap">
                    {JSON.stringify(parsedMetadata, null, 2)}
                  </pre>
                </div>
              </InfoField>
            ) : null;
          })()}

          {resourceTags && Object.entries(resourceTags).length > 0 ? (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400">
                Tags
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Object.entries(resourceTags).map(([key, value]) => (
                  <InfoField key={key} label={key}>
                    {renderValue(value)}
                  </InfoField>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Failed findings associated with this resource section */}
      <Card variant="base" padding="lg">
        <CardHeader>
          <CardTitle>Failed findings associated with this resource</CardTitle>
        </CardHeader>
        <CardContent>
          {findingsLoading ? (
            <div className="flex items-center justify-center gap-2 py-8">
              <Spinner size="sm" />
              <p className="dark:text-prowler-theme-pale/80 text-sm text-gray-600">
                Loading findings...
              </p>
            </div>
          ) : failedFindings.length > 0 ? (
            <div className="flex flex-col gap-4">
              <p className="dark:text-prowler-theme-pale/80 text-sm text-gray-600">
                Total failed findings: {failedFindings.length}
              </p>
              {failedFindings.map((finding: ResourceFinding, index: number) => {
                const { attributes: findingAttrs, id } = finding;

                // Handle cases where finding might not have all attributes
                if (!findingAttrs) {
                  return (
                    <div
                      key={index}
                      className="shadow-small dark:bg-prowler-blue-400 flex flex-col gap-2 rounded-lg px-4 py-2"
                    >
                      <p className="text-sm text-red-600">
                        Finding {id} - No attributes available
                      </p>
                    </div>
                  );
                }

                const { severity, check_metadata, status } = findingAttrs;
                const checktitle =
                  check_metadata?.checktitle || "Unknown check";

                return (
                  <button
                    key={index}
                    onClick={() => navigateToFinding(id)}
                    className="shadow-small border-border-neutral-tertiary bg-bg-neutral-tertiary flex w-full cursor-pointer flex-col gap-2 rounded-lg px-4 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="dark:text-prowler-theme-pale/90 text-left text-sm font-medium text-gray-800">
                        {checktitle}
                      </h3>
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={severity || "-"} />
                        <StatusFindingBadge status={status || "-"} />
                        <InfoIcon
                          className="text-button-primary cursor-pointer"
                          size={16}
                          onClick={() => navigateToFinding(id)}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="dark:text-prowler-theme-pale/80 text-gray-600">
              No failed findings found for this resource.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/roles/index.ts

```typescript
// Roles exports
```

--------------------------------------------------------------------------------

---[FILE: column-roles.tsx]---
Location: prowler-master/ui/components/roles/table/column-roles.tsx

```typescript
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DateWithTime } from "@/components/ui/entities";
import { DataTableColumnHeader } from "@/components/ui/table";
import { RolesProps } from "@/types";

import { DataTableRowActions } from "./data-table-row-actions";

const getRoleAttributes = (row: { original: RolesProps["data"][number] }) => {
  return row.original.attributes;
};

const getRoleRelationships = (row: {
  original: RolesProps["data"][number];
}) => {
  return row.original.relationships;
};

export const ColumnsRoles: ColumnDef<RolesProps["data"][number]>[] = [
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Role"} param="name" />
    ),
    cell: ({ row }) => {
      const data = getRoleAttributes(row);
      return <p className="font-semibold">{data.name}</p>;
    },
  },
  {
    accessorKey: "users",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Users"} param="users" />
    ),
    cell: ({ row }) => {
      const relationships = getRoleRelationships(row);
      const count = relationships.users.meta.count;
      return (
        <p className="text-xs font-semibold">
          {count === 0
            ? "No Users"
            : `${count} ${count === 1 ? "User" : "Users"}`}
        </p>
      );
    },
  },
  {
    accessorKey: "invitations",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Invitations"}
        param="invitations"
      />
    ),
    cell: ({ row }) => {
      const relationships = getRoleRelationships(row);
      return (
        <p className="text-xs font-semibold">
          {relationships.invitations.meta.count === 0
            ? "No Invitations"
            : `${relationships.invitations.meta.count} ${
                relationships.invitations.meta.count === 1
                  ? "Invitation"
                  : "Invitations"
              }`}
        </p>
      );
    },
  },
  {
    accessorKey: "permission_state",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Permissions"}
        param="permission_state"
      />
    ),
    cell: ({ row }) => {
      const { permission_state } = getRoleAttributes(row);
      return (
        <p className="text-xs font-semibold">
          {permission_state[0].toUpperCase() +
            permission_state.slice(1).toLowerCase()}
        </p>
      );
    },
  },
  {
    accessorKey: "inserted_at",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Added"}
        param="inserted_at"
      />
    ),
    cell: ({ row }) => {
      const { inserted_at } = getRoleAttributes(row);
      return <DateWithTime dateTime={inserted_at} showTime={false} />;
    },
  },
  {
    accessorKey: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    id: "actions",
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    },
    enableSorting: false,
  },
];
```

--------------------------------------------------------------------------------

---[FILE: data-table-row-actions.tsx]---
Location: prowler-master/ui/components/roles/table/data-table-row-actions.tsx
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
import { CustomAlertModal } from "@/components/ui/custom/custom-alert-modal";

import { DeleteRoleForm } from "../workflow/forms";
interface DataTableRowActionsProps<RoleProps> {
  row: Row<RoleProps>;
}
const iconClasses = "text-2xl text-default-500 pointer-events-none shrink-0";

export function DataTableRowActions<RoleProps>({
  row,
}: DataTableRowActionsProps<RoleProps>) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const roleId = (row.original as { id: string }).id;
  return (
    <>
      <CustomAlertModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your role and remove your data from the server."
      >
        <DeleteRoleForm roleId={roleId} setIsOpen={setIsDeleteOpen} />
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
                description="Edit the role details"
                textValue="Edit Role"
                startContent={<EditDocumentBulkIcon className={iconClasses} />}
                onPress={() => router.push(`/roles/edit?roleId=${roleId}`)}
              >
                Edit Role
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Danger zone">
              <DropdownItem
                key="delete"
                className="text-text-error"
                color="danger"
                description="Delete the role permanently"
                textValue="Delete Role"
                startContent={
                  <DeleteDocumentBulkIcon
                    className={clsx(iconClasses, "!text-text-error")}
                  />
                }
                onPress={() => setIsDeleteOpen(true)}
              >
                Delete Role
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
Location: prowler-master/ui/components/roles/table/index.ts

```typescript
export * from "./column-roles";
export * from "./data-table-row-actions";
export * from "./skeleton-table-roles";
```

--------------------------------------------------------------------------------

````
