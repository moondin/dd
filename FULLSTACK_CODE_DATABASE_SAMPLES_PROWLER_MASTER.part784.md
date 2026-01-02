---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 784
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 784 of 867)

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

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/lighthouse/config/(connect-llm)/connect/page.tsx
Signals: React, Next.js

```typescript
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { ConnectLLMProvider } from "@/components/lighthouse/connect-llm-provider";
import { SelectBedrockAuthMethod } from "@/components/lighthouse/select-bedrock-auth-method";
import type { LighthouseProvider } from "@/types/lighthouse";

const BEDROCK_AUTH_MODES = {
  IAM: "iam",
  API_KEY: "api_key",
} as const;

type BedrockAuthMode =
  (typeof BEDROCK_AUTH_MODES)[keyof typeof BEDROCK_AUTH_MODES];

function ConnectContent() {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider") as LighthouseProvider | null;
  const mode = searchParams.get("mode") || "create";
  const auth = searchParams.get("auth") as BedrockAuthMode | null;

  if (!provider) {
    return null;
  }

  const isBedrockCreateMode = provider === "bedrock" && mode !== "edit";

  if (isBedrockCreateMode && !auth) {
    return <SelectBedrockAuthMethod />;
  }

  const initialAuthMode = isBedrockCreateMode && auth ? auth : undefined;

  return (
    <ConnectLLMProvider
      provider={provider}
      mode={mode}
      initialAuthMode={initialAuthMode}
    />
  );
}

export default function ConnectLLMProviderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConnectContent />
    </Suspense>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/lighthouse/config/(connect-llm)/select-model/page.tsx
Signals: React, Next.js

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { SelectModel } from "@/components/lighthouse/select-model";
import type { LighthouseProvider } from "@/types/lighthouse";

function SelectModelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const provider = searchParams.get("provider") as LighthouseProvider | null;
  const mode = searchParams.get("mode") || "create";

  if (!provider) {
    return null;
  }

  return (
    <SelectModel
      provider={provider}
      mode={mode}
      onSelect={() => router.push("/lighthouse/config")}
    />
  );
}

export default function SelectModelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectModelContent />
    </Suspense>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: prowler-master/ui/app/(prowler)/manage-groups/layout.tsx
Signals: React

```typescript
import "@/styles/globals.css";

import React from "react";

import { ContentLayout } from "@/components/ui";

interface ProviderLayoutProps {
  children: React.ReactNode;
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  return (
    <ContentLayout title="Manage Groups" icon="lucide:group">
      {children}
    </ContentLayout>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/manage-groups/page.tsx
Signals: React, Next.js

```typescript
import { Divider } from "@heroui/divider";
import { Spacer } from "@heroui/spacer";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

import {
  getProviderGroupInfoById,
  getProviderGroups,
} from "@/actions/manage-groups/manage-groups";
import { getProviders } from "@/actions/providers";
import { getRoles } from "@/actions/roles";
import { FilterControls } from "@/components/filters/filter-controls";
import { AddGroupForm, EditGroupForm } from "@/components/manage-groups/forms";
import { SkeletonManageGroups } from "@/components/manage-groups/skeleton-manage-groups";
import { ColumnGroups } from "@/components/manage-groups/table";
import { DataTable } from "@/components/ui/table";
import { ProviderProps, Role, SearchParamsProps } from "@/types";

export default async function ManageGroupsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchParamsKey = JSON.stringify(resolvedSearchParams);
  const providerGroupId = resolvedSearchParams.groupId;

  return (
    <div className="grid min-h-[70vh] grid-cols-1 items-center justify-center gap-4 md:grid-cols-12">
      <div className="col-span-1 flex justify-end md:col-span-4">
        <Suspense key={searchParamsKey} fallback={<SkeletonManageGroups />}>
          {providerGroupId ? (
            <SSRDataEditGroup searchParams={resolvedSearchParams} />
          ) : (
            <div className="flex flex-col">
              <h1 className="mb-2 text-xl font-medium" id="getting-started">
                Create a new provider group
              </h1>
              <p className="text-small text-default-500 mb-5">
                Create a new provider group to manage the providers and roles.
              </p>
              <SSRAddGroupForm />
            </div>
          )}
        </Suspense>
      </div>

      <Divider orientation="vertical" className="mx-auto h-full" />

      <div className="col-span-1 flex-col justify-start md:col-span-6">
        <FilterControls />
        <Spacer y={8} />
        <h3 className="mb-4 text-sm font-bold uppercase">Provider Groups</h3>
        <Suspense key={searchParamsKey} fallback={<SkeletonManageGroups />}>
          <SSRDataTable searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    </div>
  );
}

const SSRAddGroupForm = async () => {
  const providersResponse = await getProviders({ pageSize: 50 });
  const rolesResponse = await getRoles({});

  const providersData =
    providersResponse?.data?.map((provider: ProviderProps) => ({
      id: provider.id,
      name: provider.attributes.alias || provider.attributes.uid,
    })) || [];

  const rolesData =
    rolesResponse?.data?.map((role: Role) => ({
      id: role.id,
      name: role.attributes.name,
    })) || [];

  return <AddGroupForm providers={providersData} roles={rolesData} />;
};

const SSRDataEditGroup = async ({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) => {
  const providerGroupId = searchParams.groupId;

  // Redirect if no group ID is provided or if the parameter is invalid
  if (!providerGroupId || Array.isArray(providerGroupId)) {
    redirect("/manage-groups");
  }

  // Fetch the provider group details
  const providerGroupData = await getProviderGroupInfoById(providerGroupId);

  if (!providerGroupData || providerGroupData.error) {
    return <div>Provider group not found</div>;
  }

  const providersResponse = await getProviders({ pageSize: 50 });
  const rolesResponse = await getRoles({});

  const providersList =
    providersResponse?.data?.map((provider: ProviderProps) => ({
      id: provider.id,
      name: provider.attributes.alias || provider.attributes.uid,
    })) || [];

  const rolesList =
    rolesResponse?.data?.map((role: Role) => ({
      id: role.id,
      name: role.attributes.name,
    })) || [];

  const { attributes, relationships } = providerGroupData.data;

  const associatedProviders = relationships.providers?.data.map(
    (provider: ProviderProps) => {
      const matchingProvider = providersList.find(
        (p: { id: string; name: string }) => p.id === provider.id,
      );
      return {
        id: provider.id,
        name: matchingProvider?.name || "Unavailable for your role",
      };
    },
  );

  const associatedRoles = relationships.roles?.data.map((role: Role) => {
    const matchingRole = rolesList.find((r: Role) => r.id === role.id);
    return {
      id: role.id,
      name: matchingRole?.name || "Unavailable for your role",
    };
  });

  const formData = {
    name: attributes.name,
    providers: associatedProviders,
    roles: associatedRoles,
  };

  return (
    <div className="flex flex-col">
      <h1 className="mb-2 text-xl font-medium" id="getting-started">
        Edit provider group
      </h1>
      <p className="text-small text-default-500 mb-5">
        Edit the provider group to manage the providers and roles.
      </p>
      <EditGroupForm
        providerGroupId={providerGroupId}
        providerGroupData={formData}
        allProviders={providersList}
        allRoles={rolesList}
      />
    </div>
  );
};

const SSRDataTable = async ({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) => {
  const page = parseInt(searchParams.page?.toString() || "1", 10);
  const sort = searchParams.sort?.toString();
  const pageSize = parseInt(searchParams.pageSize?.toString() || "10", 10);

  // Convert filters to the correct type
  const filters: Record<string, string> = {};
  Object.entries(searchParams)
    .filter(([key]) => key.startsWith("filter["))
    .forEach(([key, value]) => {
      filters[key] = value?.toString() || "";
    });

  const query = (filters["filter[search]"] as string) || "";
  const providerGroupsData = await getProviderGroups({
    query,
    page,
    sort,
    filters,
    pageSize,
  });

  return (
    <>
      <DataTable
        key={`groups-${Date.now()}`}
        columns={ColumnGroups}
        data={providerGroupsData?.data || []}
        metadata={providerGroupsData?.meta}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/profile/page.tsx
Signals: React

```typescript
import React, { Suspense } from "react";

import { getSamlConfig } from "@/actions/integrations/saml";
import { getUserInfo } from "@/actions/users/users";
import { SamlIntegrationCard } from "@/components/integrations/saml/saml-integration-card";
import { ContentLayout } from "@/components/ui";
import { ApiKeysCard, UserBasicInfoCard } from "@/components/users/profile";
import { MembershipsCard } from "@/components/users/profile/memberships-card";
import { RolesCard } from "@/components/users/profile/roles-card";
import { SkeletonUserInfo } from "@/components/users/profile/skeleton-user-info";
import { SearchParamsProps } from "@/types";
import {
  MembershipDetailData,
  RoleDetail,
  TenantDetailData,
  UserProfileResponse,
} from "@/types/users";

export default async function Profile({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <ContentLayout title="User Profile" icon="lucide:users">
      <Suspense fallback={<SkeletonUserInfo />}>
        <SSRDataUser searchParams={resolvedSearchParams} />
      </Suspense>
    </ContentLayout>
  );
}

const SSRDataUser = async ({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) => {
  const userProfile = (await getUserInfo()) as UserProfileResponse | undefined;
  if (!userProfile?.data) {
    return null;
  }

  const userData = userProfile.data;

  const roleDetails =
    userProfile.included?.filter(
      (item): item is RoleDetail => item.type === "roles",
    ) || [];

  const membershipsIncluded =
    userProfile.included?.filter(
      (item): item is MembershipDetailData => item.type === "memberships",
    ) || [];

  const tenantsIncluded =
    userProfile.included?.filter(
      (item): item is TenantDetailData => item.type === "tenants",
    ) || [];

  const roleDetailsMap = roleDetails.reduce<Record<string, RoleDetail>>(
    (acc, role) => {
      acc[role.id] = role;
      return acc;
    },
    {},
  );

  const tenantsMap = tenantsIncluded.reduce<Record<string, TenantDetailData>>(
    (acc, tenant) => {
      acc[tenant.id] = tenant;
      return acc;
    },
    {},
  );

  const firstUserMembership = membershipsIncluded.find(
    (m) => m.relationships?.user?.data?.id === userData.id,
  );

  const userTenantId = firstUserMembership?.relationships?.tenant?.data?.id;

  const userRoleIds =
    userData.relationships?.roles?.data?.map((r) => r.id) || [];

  const hasManageAccount = roleDetails.some(
    (role) =>
      role.attributes.manage_account === true && userRoleIds.includes(role.id),
  );

  const hasManageIntegrations = roleDetails.some(
    (role) =>
      role.attributes.manage_integrations === true &&
      userRoleIds.includes(role.id),
  );

  const isOwner = membershipsIncluded.some(
    (m) =>
      m.attributes.role === "owner" &&
      m.relationships?.user?.data?.id === userData.id,
  );

  const samlConfig = hasManageIntegrations ? await getSamlConfig() : undefined;

  return (
    <div className="flex w-full flex-col gap-6">
      <UserBasicInfoCard user={userData} tenantId={userTenantId || ""} />
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex w-full flex-col gap-6 xl:max-w-[50%]">
          <RolesCard roles={roleDetails} roleDetails={roleDetailsMap} />
          {hasManageIntegrations && (
            <SamlIntegrationCard samlConfig={samlConfig?.data?.[0]} />
          )}
        </div>
        <div className="flex w-full flex-col gap-6 xl:max-w-[50%]">
          <MembershipsCard
            memberships={membershipsIncluded}
            tenantsMap={tenantsMap}
            isOwner={isOwner && hasManageAccount}
          />
          {hasManageAccount && <ApiKeysCard searchParams={searchParams} />}
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/providers/page.tsx
Signals: React

```typescript
import { Spacer } from "@heroui/spacer";
import { Suspense } from "react";

import { getProviders } from "@/actions/providers";
import { FilterControls, filterProviders } from "@/components/filters";
import { ManageGroupsButton } from "@/components/manage-groups";
import {
  AddProviderButton,
  MutedFindingsConfigButton,
} from "@/components/providers";
import {
  ColumnProviders,
  SkeletonTableProviders,
} from "@/components/providers/table";
import { ContentLayout } from "@/components/ui";
import { DataTable } from "@/components/ui/table";
import { ProviderProps, SearchParamsProps } from "@/types";

export default async function Providers({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchParamsKey = JSON.stringify(resolvedSearchParams || {});

  return (
    <ContentLayout title="Cloud Providers" icon="lucide:cloud-cog">
      <FilterControls search customFilters={filterProviders || []} />
      <Spacer y={8} />
      <ProvidersActions />
      <Spacer y={8} />
      <Suspense key={searchParamsKey} fallback={<ProvidersTableFallback />}>
        <ProvidersTable searchParams={resolvedSearchParams} />
      </Suspense>
    </ContentLayout>
  );
}

const ProvidersActions = () => {
  return (
    <div className="flex items-center gap-4 md:justify-end">
      <ManageGroupsButton />
      <MutedFindingsConfigButton />
      <AddProviderButton />
    </div>
  );
};

const ProvidersTableFallback = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <SkeletonTableProviders />
      </div>
    </div>
  );
};

const ProvidersTable = async ({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) => {
  const page = parseInt(searchParams.page?.toString() || "1", 10);
  const sort = searchParams.sort?.toString();
  const pageSize = parseInt(searchParams.pageSize?.toString() || "10", 10);

  // Extract all filter parameters
  const filters = Object.fromEntries(
    Object.entries(searchParams).filter(([key]) => key.startsWith("filter[")),
  );

  // Extract query from filters
  const query = (filters["filter[search]"] as string) || "";

  const providersData = await getProviders({
    query,
    page,
    sort,
    filters,
    pageSize,
  });

  const providerGroupDict =
    providersData?.included
      ?.filter((item: any) => item.type === "provider-groups")
      .reduce((acc: Record<string, string>, group: any) => {
        acc[group.id] = group.attributes.name;
        return acc;
      }, {}) || {};

  const enrichedProviders =
    providersData?.data?.map((provider: ProviderProps) => {
      const groupNames =
        provider.relationships?.provider_groups?.data?.map(
          (group: { id: string }) =>
            providerGroupDict[group.id] || "Unknown Group",
        ) || [];
      return { ...provider, groupNames };
    }) || [];

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <DataTable
            key={`providers-${Date.now()}`}
            columns={ColumnProviders}
            data={enrichedProviders || []}
            metadata={providersData?.meta}
          />
        </div>
      </div>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: prowler-master/ui/app/(prowler)/providers/(set-up-provider)/layout.tsx
Signals: React

```typescript
import "@/styles/globals.css";

import { Spacer } from "@heroui/spacer";
import React from "react";

import { WorkflowAddProvider } from "@/components/providers/workflow";
import { NavigationHeader } from "@/components/ui";

interface ProviderLayoutProps {
  children: React.ReactNode;
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  return (
    <>
      <NavigationHeader
        title="Connect a Cloud Provider"
        icon="icon-park-outline:close-small"
        href="/providers"
      />
      <Spacer y={8} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="order-1 my-auto hidden h-full lg:col-span-4 lg:col-start-2 lg:block">
          <WorkflowAddProvider />
        </div>
        <div className="order-2 my-auto lg:col-span-5 lg:col-start-6">
          {children}
        </div>
      </div>
    </>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/providers/(set-up-provider)/add-credentials/page.tsx
Signals: React

```typescript
import React from "react";

import { getProvider } from "@/actions/providers/providers";
import {
  AddViaCredentialsForm,
  AddViaRoleForm,
} from "@/components/providers/workflow/forms";
import { SelectViaAWS } from "@/components/providers/workflow/forms/select-credentials-type/aws";
import {
  AddViaServiceAccountForm,
  SelectViaGCP,
} from "@/components/providers/workflow/forms/select-credentials-type/gcp";
import { SelectViaGitHub } from "@/components/providers/workflow/forms/select-credentials-type/github";
import { SelectViaM365 } from "@/components/providers/workflow/forms/select-credentials-type/m365";
import { getProviderFormType } from "@/lib/provider-helpers";
import { ProviderType } from "@/types/providers";

interface Props {
  searchParams: Promise<{ type: ProviderType; id: string; via?: string }>;
}

export default async function AddCredentialsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const { type: providerType, via, id: providerId } = resolvedSearchParams;
  const formType = getProviderFormType(providerType, via);

  // Fetch provider data to get the UID (needed for OCI)
  let providerUid: string | undefined;
  if (providerId) {
    const formData = new FormData();
    formData.append("id", providerId);
    const providerResponse = await getProvider(formData);
    if (providerResponse?.data?.attributes?.uid) {
      providerUid = providerResponse.data.attributes.uid;
    }
  }

  switch (formType) {
    case "selector":
      if (providerType === "aws") return <SelectViaAWS initialVia={via} />;
      if (providerType === "gcp") return <SelectViaGCP initialVia={via} />;
      if (providerType === "github")
        return <SelectViaGitHub initialVia={via} />;
      if (providerType === "m365") return <SelectViaM365 initialVia={via} />;
      return null;

    case "credentials":
      return (
        <AddViaCredentialsForm
          searchParams={resolvedSearchParams}
          providerUid={providerUid}
        />
      );

    case "role":
      return (
        <AddViaRoleForm
          searchParams={resolvedSearchParams}
          providerUid={providerUid}
        />
      );

    case "service-account":
      return (
        <AddViaServiceAccountForm
          searchParams={resolvedSearchParams}
          providerUid={providerUid}
        />
      );

    default:
      return null;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/providers/(set-up-provider)/connect-account/page.tsx
Signals: React

```typescript
import React from "react";

import { ConnectAccountForm } from "@/components/providers/workflow/forms";

export default function ConnectAccountPage() {
  return <ConnectAccountForm />;
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/providers/(set-up-provider)/test-connection/page.tsx
Signals: React, Next.js

```typescript
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

import { getProvider } from "@/actions/providers";
import { SkeletonProviderWorkflow } from "@/components/providers/workflow";
import { TestConnectionForm } from "@/components/providers/workflow/forms";

interface Props {
  searchParams: Promise<{ type: string; id: string; updated: string }>;
}

export default async function TestConnectionPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const providerId = resolvedSearchParams.id;

  if (!providerId) {
    redirect("/providers/connect-account");
  }

  return (
    <Suspense fallback={<SkeletonProviderWorkflow />}>
      <SSRTestConnection searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

async function SSRTestConnection({
  searchParams,
}: {
  searchParams: { type: string; id: string; updated: string };
}) {
  const formData = new FormData();
  formData.append("id", searchParams.id);

  const providerData = await getProvider(formData);
  if (providerData.errors) {
    redirect("/providers/connect-account");
  }

  return (
    <TestConnectionForm
      searchParams={searchParams}
      providerData={providerData}
    />
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/providers/(set-up-provider)/update-credentials/page.tsx
Signals: React

```typescript
import React from "react";

import { CredentialsUpdateInfo } from "@/components/providers";
import {
  UpdateViaCredentialsForm,
  UpdateViaRoleForm,
} from "@/components/providers/workflow/forms";
import { UpdateViaServiceAccountForm } from "@/components/providers/workflow/forms/update-via-service-account-key-form";
import { getProviderFormType } from "@/lib/provider-helpers";
import { ProviderType } from "@/types/providers";

interface Props {
  searchParams: Promise<{
    type: ProviderType;
    id: string;
    via?: string;
    secretId?: string;
  }>;
}

export default async function UpdateCredentialsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const { type: providerType, via } = resolvedSearchParams;
  const formType = getProviderFormType(providerType, via);

  switch (formType) {
    case "selector":
      return (
        <CredentialsUpdateInfo providerType={providerType} initialVia={via} />
      );

    case "credentials":
      return <UpdateViaCredentialsForm searchParams={resolvedSearchParams} />;

    case "role":
      return <UpdateViaRoleForm searchParams={resolvedSearchParams} />;

    case "service-account":
      return (
        <UpdateViaServiceAccountForm searchParams={resolvedSearchParams} />
      );

    default:
      return null;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/resources/page.tsx
Signals: React

```typescript
import { Spacer } from "@heroui/spacer";
import { Suspense } from "react";

import {
  getLatestMetadataInfo,
  getLatestResources,
  getMetadataInfo,
  getResources,
} from "@/actions/resources";
import { FilterControls } from "@/components/filters";
import { SkeletonTableResources } from "@/components/resources/skeleton/skeleton-table-resources";
import { ColumnResources } from "@/components/resources/table/column-resources";
import { ContentLayout } from "@/components/ui";
import { DataTable, DataTableFilterCustom } from "@/components/ui/table";
import {
  createDict,
  extractFiltersAndQuery,
  extractSortAndKey,
  hasDateOrScanFilter,
  replaceFieldKey,
} from "@/lib";
import { ResourceProps, SearchParamsProps } from "@/types";

export default async function Resources({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const { searchParamsKey, encodedSort } =
    extractSortAndKey(resolvedSearchParams);
  const { filters, query } = extractFiltersAndQuery(resolvedSearchParams);
  const outputFilters = replaceFieldKey(filters, "inserted_at", "updated_at");

  // Check if the searchParams contain any date or scan filter
  const hasDateOrScan = hasDateOrScanFilter(resolvedSearchParams);

  const metadataInfoData = await (
    hasDateOrScan ? getMetadataInfo : getLatestMetadataInfo
  )({
    query,
    filters: outputFilters,
    sort: encodedSort,
  });

  // Extract unique regions, services, types, and names from the metadata endpoint
  const uniqueRegions = metadataInfoData?.data?.attributes?.regions || [];
  const uniqueServices = metadataInfoData?.data?.attributes?.services || [];
  const uniqueResourceTypes = metadataInfoData?.data?.attributes?.types || [];

  return (
    <ContentLayout title="Resources" icon="lucide:warehouse">
      <FilterControls search date />
      <DataTableFilterCustom
        filters={[
          {
            key: "region",
            labelCheckboxGroup: "Region",
            values: uniqueRegions,
          },
          {
            key: "type",
            labelCheckboxGroup: "Type",
            values: uniqueResourceTypes,
          },
          {
            key: "service",
            labelCheckboxGroup: "Service",
            values: uniqueServices,
          },
        ]}
      />
      <Spacer y={8} />
      <Suspense key={searchParamsKey} fallback={<SkeletonTableResources />}>
        <SSRDataTable searchParams={resolvedSearchParams} />
      </Suspense>
    </ContentLayout>
  );
}

const SSRDataTable = async ({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) => {
  const page = parseInt(searchParams.page?.toString() || "1", 10);
  const pageSize = parseInt(searchParams.pageSize?.toString() || "10", 10);
  const { encodedSort } = extractSortAndKey({
    ...searchParams,
    ...(searchParams.sort && { sort: searchParams.sort }),
  });

  const { filters, query } = extractFiltersAndQuery(searchParams);
  // Check if the searchParams contain any date or scan filter
  const hasDateOrScan = hasDateOrScanFilter(searchParams);

  const outputFilters = replaceFieldKey(filters, "inserted_at", "updated_at");

  const fetchResources = hasDateOrScan ? getResources : getLatestResources;

  const resourcesData = await fetchResources({
    query,
    page,
    sort: encodedSort,
    filters: outputFilters,
    pageSize,
    include: "provider",
    fields: [
      "name",
      "failed_findings_count",
      "region",
      "service",
      "type",
      "provider",
      "inserted_at",
      "updated_at",
      "uid",
      "partition",
      "details",
      "metadata",
    ],
  });

  // Create dictionary for providers (removed findings dict since we're not including findings anymore)
  const providerDict = createDict("providers", resourcesData);

  // Expand each resource with its corresponding provider (removed findings expansion)
  const expandedResources = resourcesData?.data
    ? resourcesData.data.map((resource: ResourceProps) => {
        const provider = {
          data: providerDict[resource.relationships.provider.data.id],
        };

        return {
          ...resource,
          relationships: {
            ...resource.relationships,
            provider,
          },
        };
      })
    : [];

  return (
    <>
      {resourcesData?.errors && (
        <div className="text-small mb-4 flex rounded-lg border border-red-500 bg-red-100 p-2 text-red-700">
          <p className="mr-2 font-semibold">Error:</p>
          <p>{resourcesData.errors[0].detail}</p>
        </div>
      )}
      <DataTable
        key={`resources-${Date.now()}`}
        columns={ColumnResources}
        data={expandedResources || []}
        metadata={resourcesData?.meta}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/roles/page.tsx
Signals: React, Next.js

```typescript
import { Spacer } from "@heroui/spacer";
import Link from "next/link";
import { Suspense } from "react";

import { getRoles } from "@/actions/roles";
import { FilterControls } from "@/components/filters";
import { filterRoles } from "@/components/filters/data-filters";
import { AddIcon } from "@/components/icons";
import { ColumnsRoles } from "@/components/roles/table";
import { SkeletonTableRoles } from "@/components/roles/table";
import { Button } from "@/components/shadcn";
import { ContentLayout } from "@/components/ui";
import { DataTable, DataTableFilterCustom } from "@/components/ui/table";
import { SearchParamsProps } from "@/types";

export default async function Roles({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchParamsKey = JSON.stringify(resolvedSearchParams || {});

  return (
    <ContentLayout title="Roles" icon="lucide:user-cog">
      <FilterControls search />

      <div className="flex flex-row items-center justify-between">
        <DataTableFilterCustom filters={filterRoles || []} />

        <Button asChild>
          <Link href="/roles/new">
            Add Role
            <AddIcon size={20} />
          </Link>
        </Button>
      </div>
      <Spacer y={8} />

      <Suspense key={searchParamsKey} fallback={<SkeletonTableRoles />}>
        <SSRDataTable searchParams={resolvedSearchParams} />
      </Suspense>
    </ContentLayout>
  );
}

const SSRDataTable = async ({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) => {
  const page = parseInt(searchParams.page?.toString() || "1", 10);
  const sort = searchParams.sort?.toString();
  const pageSize = parseInt(searchParams.pageSize?.toString() || "10", 10);

  // Extract all filter parameters
  const filters = Object.fromEntries(
    Object.entries(searchParams).filter(([key]) => key.startsWith("filter[")),
  );

  // Extract query from filters
  const query = (filters["filter[search]"] as string) || "";

  const rolesData = await getRoles({ query, page, sort, filters, pageSize });

  return (
    <DataTable
      key={`roles-${Date.now()}`}
      columns={ColumnsRoles}
      data={rolesData?.data || []}
      metadata={rolesData?.meta}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: prowler-master/ui/app/(prowler)/roles/(add-role)/layout.tsx
Signals: React

```typescript
import "@/styles/globals.css";

import { Spacer } from "@heroui/spacer";
import React from "react";

import { WorkflowAddEditRole } from "@/components/roles/workflow";
import { NavigationHeader } from "@/components/ui";

interface RoleLayoutProps {
  children: React.ReactNode;
}

export default function RoleLayout({ children }: RoleLayoutProps) {
  return (
    <>
      <NavigationHeader
        title="Role Management"
        icon="icon-park-outline:close-small"
        href="/roles"
      />
      <Spacer y={16} />
      <div className="grid grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:px-0">
        <div className="order-1 my-auto hidden h-full lg:col-span-4 lg:col-start-2 lg:block">
          <WorkflowAddEditRole />
        </div>
        <div className="order-2 my-auto lg:col-span-5 lg:col-start-6">
          {children}
        </div>
      </div>
    </>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/roles/(add-role)/edit/page.tsx
Signals: React, Next.js

```typescript
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getProviderGroups } from "@/actions/manage-groups/manage-groups";
import { getRoleInfoById } from "@/actions/roles/roles";
import { SkeletonRoleForm } from "@/components/roles/workflow";
import { EditRoleForm } from "@/components/roles/workflow/forms/edit-role-form";
import { SearchParamsProps } from "@/types";

export default async function EditRolePage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchParamsKey = JSON.stringify(resolvedSearchParams || {});

  return (
    <Suspense key={searchParamsKey} fallback={<SkeletonRoleForm />}>
      <SSRDataRole searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

const SSRDataRole = async ({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) => {
  const roleId = searchParams.roleId;

  if (!roleId || Array.isArray(roleId)) {
    redirect("/roles");
  }

  const roleData = await getRoleInfoById(roleId as string);

  if (!roleData || roleData.error) {
    return <div>Role not found</div>;
  }

  const groupsResponse = await getProviderGroups({});
  const groups =
    groupsResponse?.data?.map(
      (group: { id: string; attributes: { name: string } }) => ({
        id: group.id,
        name: group.attributes.name,
      }),
    ) || [];

  return <EditRoleForm roleId={roleId} roleData={roleData} groups={groups} />;
};
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/roles/(add-role)/new/page.tsx
Signals: React

```typescript
import React from "react";

import { getProviderGroups } from "@/actions/manage-groups/manage-groups";
import { AddRoleForm } from "@/components/roles/workflow/forms/add-role-form";
import { ProviderGroup } from "@/types";

export default async function AddRolePage() {
  const groupsResponse = await getProviderGroups({});

  const groupsData =
    groupsResponse?.data?.map((group: ProviderGroup) => ({
      id: group.id,
      name: group.attributes.name,
    })) || [];

  return <AddRoleForm groups={groupsData} />;
}
```

--------------------------------------------------------------------------------

````
