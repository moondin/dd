---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 783
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 783 of 867)

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
Location: prowler-master/ui/app/(prowler)/compliance/[compliancetitle]/page.tsx
Signals: React

```typescript
import { Spacer } from "@heroui/spacer";
import { Suspense } from "react";

import {
  getComplianceAttributes,
  getComplianceOverviewMetadataInfo,
  getComplianceRequirements,
} from "@/actions/compliances";
import {
  ClientAccordionWrapper,
  ComplianceDownloadButton,
  ComplianceHeader,
  RequirementsStatusCard,
  RequirementsStatusCardSkeleton,
  // SectionsFailureRateCard,
  // SectionsFailureRateCardSkeleton,
  SkeletonAccordion,
  TopFailedSectionsCard,
  TopFailedSectionsCardSkeleton,
} from "@/components/compliance";
import { getComplianceIcon } from "@/components/icons/compliance/IconCompliance";
import { ContentLayout } from "@/components/ui";
import { getComplianceMapper } from "@/lib/compliance/compliance-mapper";
import { getReportTypeForFramework } from "@/lib/compliance/compliance-report-types";
import {
  AttributesData,
  Framework,
  RequirementsTotals,
} from "@/types/compliance";
import { ScanEntity } from "@/types/scans";

interface ComplianceDetailSearchParams {
  complianceId: string;
  version?: string;
  scanId?: string;
  scanData?: string;
  "filter[region__in]"?: string;
  "filter[cis_profile_level]"?: string;
  page?: string;
  pageSize?: string;
}

export default async function ComplianceDetail({
  params,
  searchParams,
}: {
  params: Promise<{ compliancetitle: string }>;
  searchParams: Promise<ComplianceDetailSearchParams>;
}) {
  const { compliancetitle } = await params;
  const resolvedSearchParams = await searchParams;
  const { complianceId, version, scanId, scanData } = resolvedSearchParams;
  const regionFilter = resolvedSearchParams["filter[region__in]"];
  const cisProfileFilter = resolvedSearchParams["filter[cis_profile_level]"];
  const logoPath = getComplianceIcon(compliancetitle);

  // Create a key that excludes pagination parameters to preserve accordion state avoiding reloads with pagination
  const paramsForKey = Object.fromEntries(
    Object.entries(resolvedSearchParams).filter(
      ([key]) => key !== "page" && key !== "pageSize",
    ),
  );
  const searchParamsKey = JSON.stringify(paramsForKey);

  const formattedTitle = compliancetitle.split("-").join(" ");
  const pageTitle = version
    ? `${formattedTitle} - ${version}`
    : `${formattedTitle}`;

  let selectedScan: ScanEntity | null = null;

  if (scanData) {
    selectedScan = JSON.parse(decodeURIComponent(scanData));
  }

  const selectedScanId = scanId || selectedScan?.id || null;

  const [metadataInfoData, attributesData] = await Promise.all([
    getComplianceOverviewMetadataInfo({
      filters: {
        "filter[scan_id]": selectedScanId,
      },
    }),
    getComplianceAttributes(complianceId),
  ]);

  const uniqueRegions = metadataInfoData?.data?.attributes?.regions || [];

  // Use compliance_name from attributes if available, otherwise fallback to formatted title
  const complianceName = attributesData?.data?.[0]?.attributes?.compliance_name;
  const finalPageTitle = complianceName ? `${complianceName}` : pageTitle;

  return (
    <ContentLayout title={finalPageTitle}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <ComplianceHeader
            scans={[]}
            uniqueRegions={uniqueRegions}
            showSearch={false}
            framework={compliancetitle}
            showProviders={false}
            logoPath={logoPath}
            complianceTitle={compliancetitle}
            selectedScan={selectedScan}
          />
        </div>
        {(() => {
          const framework = attributesData?.data?.[0]?.attributes?.framework;
          const reportType = getReportTypeForFramework(framework);

          return selectedScanId && reportType ? (
            <div className="flex-shrink-0 pt-1">
              <ComplianceDownloadButton
                scanId={selectedScanId}
                reportType={reportType}
              />
            </div>
          ) : null;
        })()}
      </div>

      <Suspense
        key={searchParamsKey}
        fallback={
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:items-stretch">
              <RequirementsStatusCardSkeleton />
              <TopFailedSectionsCardSkeleton />
              {/* <SectionsFailureRateCardSkeleton /> */}
            </div>
            <SkeletonAccordion />
          </div>
        }
      >
        <SSRComplianceContent
          complianceId={complianceId}
          scanId={selectedScanId || ""}
          region={regionFilter}
          filter={cisProfileFilter}
          attributesData={attributesData}
        />
      </Suspense>
    </ContentLayout>
  );
}

const SSRComplianceContent = async ({
  complianceId,
  scanId,
  region,
  filter,
  attributesData,
}: {
  complianceId: string;
  scanId: string;
  region?: string;
  filter?: string;
  attributesData: AttributesData;
}) => {
  const requirementsData = await getComplianceRequirements({
    complianceId,
    scanId,
    region,
  });
  const type = requirementsData?.data?.[0]?.type;

  if (!scanId || type === "tasks") {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:items-stretch">
          <RequirementsStatusCard pass={0} fail={0} manual={0} />
          <TopFailedSectionsCard sections={[]} />
          {/* <SectionsFailureRateCard categories={[]} /> */}
        </div>
        <ClientAccordionWrapper items={[]} defaultExpandedKeys={[]} />
      </div>
    );
  }

  const framework = attributesData?.data?.[0]?.attributes?.framework;
  const mapper = getComplianceMapper(framework);
  const data = mapper.mapComplianceData(
    attributesData,
    requirementsData,
    filter,
  );
  // const categoryHeatmapData = mapper.calculateCategoryHeatmapData(data);
  const totalRequirements: RequirementsTotals = data.reduce(
    (acc: RequirementsTotals, framework: Framework) => ({
      pass: acc.pass + framework.pass,
      fail: acc.fail + framework.fail,
      manual: acc.manual + framework.manual,
    }),
    { pass: 0, fail: 0, manual: 0 },
  );
  const accordionItems = mapper.toAccordionItems(data, scanId);
  const topFailedResult = mapper.getTopFailedSections(data);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
        <RequirementsStatusCard
          pass={totalRequirements.pass}
          fail={totalRequirements.fail}
          manual={totalRequirements.manual}
        />
        <TopFailedSectionsCard
          sections={topFailedResult.items}
          dataType={topFailedResult.type}
        />
        {/* <SectionsFailureRateCard categories={categoryHeatmapData} /> */}
      </div>

      <Spacer className="bg-border-neutral-primary h-1 w-full rounded-full" />
      <ClientAccordionWrapper
        hideExpandButton={complianceId.includes("mitre_attack")}
        items={accordionItems}
        defaultExpandedKeys={[]}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/findings/page.tsx
Signals: React

```typescript
import { Spacer } from "@heroui/spacer";
import { Suspense } from "react";

import {
  getFindings,
  getLatestFindings,
  getLatestMetadataInfo,
  getMetadataInfo,
} from "@/actions/findings";
import { getProviders } from "@/actions/providers";
import { getScans } from "@/actions/scans";
import { FindingsFilters } from "@/components/findings/findings-filters";
import {
  ColumnFindings,
  SkeletonTableFindings,
} from "@/components/findings/table";
import { ContentLayout } from "@/components/ui";
import { DataTable } from "@/components/ui/table";
import {
  createDict,
  createScanDetailsMapping,
  extractFiltersAndQuery,
  extractSortAndKey,
  hasDateOrScanFilter,
} from "@/lib";
import {
  createProviderDetailsMappingById,
  extractProviderIds,
} from "@/lib/provider-helpers";
import { FilterEntity, ScanEntity, ScanProps } from "@/types";
import { FindingProps, SearchParamsProps } from "@/types/components";

export default async function Findings({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const { searchParamsKey, encodedSort } =
    extractSortAndKey(resolvedSearchParams);
  const { filters, query } = extractFiltersAndQuery(resolvedSearchParams);

  // Check if the searchParams contain any date or scan filter
  const hasDateOrScan = hasDateOrScanFilter(resolvedSearchParams);

  const [metadataInfoData, providersData, scansData] = await Promise.all([
    (hasDateOrScan ? getMetadataInfo : getLatestMetadataInfo)({
      query,
      sort: encodedSort,
      filters,
    }),
    getProviders({ pageSize: 50 }),
    getScans({ pageSize: 50 }),
  ]);

  // Extract unique regions, services, categories from the new endpoint
  const uniqueRegions = metadataInfoData?.data?.attributes?.regions || [];
  const uniqueServices = metadataInfoData?.data?.attributes?.services || [];
  const uniqueResourceTypes =
    metadataInfoData?.data?.attributes?.resource_types || [];
  const uniqueCategories = metadataInfoData?.data?.attributes?.categories || [];

  // Extract provider IDs and details using helper functions
  const providerIds = providersData ? extractProviderIds(providersData) : [];
  const providerDetails = providersData
    ? (createProviderDetailsMappingById(providerIds, providersData) as {
        [id: string]: FilterEntity;
      }[])
    : [];

  // Extract scan UUIDs with "completed" state and more than one resource
  const completedScans = scansData?.data?.filter(
    (scan: ScanProps) =>
      scan.attributes.state === "completed" &&
      scan.attributes.unique_resource_count > 1,
  );

  const completedScanIds =
    completedScans?.map((scan: ScanProps) => scan.id) || [];

  const scanDetails = createScanDetailsMapping(
    completedScans || [],
    providersData,
  ) as { [uid: string]: ScanEntity }[];

  return (
    <ContentLayout title="Findings" icon="lucide:tag">
      <FindingsFilters
        providerIds={providerIds}
        providerDetails={providerDetails}
        completedScans={completedScans || []}
        completedScanIds={completedScanIds}
        scanDetails={scanDetails}
        uniqueRegions={uniqueRegions}
        uniqueServices={uniqueServices}
        uniqueResourceTypes={uniqueResourceTypes}
        uniqueCategories={uniqueCategories}
      />
      <Spacer y={8} />
      <Suspense key={searchParamsKey} fallback={<SkeletonTableFindings />}>
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
  const defaultSort = "severity,status,-inserted_at";

  const { encodedSort } = extractSortAndKey({
    ...searchParams,
    sort: searchParams.sort ?? defaultSort,
  });

  const { filters, query } = extractFiltersAndQuery(searchParams);
  // Check if the searchParams contain any date or scan filter
  const hasDateOrScan = hasDateOrScanFilter(searchParams);

  const fetchFindings = hasDateOrScan ? getFindings : getLatestFindings;

  const findingsData = await fetchFindings({
    query,
    page,
    sort: encodedSort,
    filters,
    pageSize,
  });

  // Create dictionaries for resources, scans, and providers
  const resourceDict = createDict("resources", findingsData);
  const scanDict = createDict("scans", findingsData);
  const providerDict = createDict("providers", findingsData);

  // Expand each finding with its corresponding resource, scan, and provider
  const expandedFindings = findingsData?.data
    ? findingsData.data.map((finding: FindingProps) => {
        const scan = scanDict[finding.relationships?.scan?.data?.id];
        const resource =
          resourceDict[finding.relationships?.resources?.data?.[0]?.id];
        const provider = providerDict[scan?.relationships?.provider?.data?.id];

        return {
          ...finding,
          relationships: { scan, resource, provider },
        };
      })
    : [];

  // Create the new object while maintaining the original structure
  const expandedResponse = {
    ...findingsData,
    data: expandedFindings,
  };

  return (
    <>
      {findingsData?.errors && (
        <div className="text-small mb-4 flex rounded-lg border border-red-500 bg-red-100 p-2 text-red-700">
          <p className="mr-2 font-semibold">Error:</p>
          <p>{findingsData.errors[0].detail}</p>
        </div>
      )}
      <DataTable
        key={Date.now()}
        columns={ColumnFindings}
        data={expandedResponse?.data || []}
        metadata={findingsData?.meta}
      />
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/integrations/page.tsx

```typescript
import {
  ApiKeyLinkCard,
  JiraIntegrationCard,
  S3IntegrationCard,
  SecurityHubIntegrationCard,
  SsoLinkCard,
} from "@/components/integrations";
import { ContentLayout } from "@/components/ui";

export default async function Integrations() {
  return (
    <ContentLayout title="Integrations" icon="lucide:puzzle">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Connect external services to enhance your security workflow and
            automatically export your scan results.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Amazon S3 Integration */}
          <S3IntegrationCard />

          {/* AWS Security Hub Integration */}
          <SecurityHubIntegrationCard />

          {/* Jira Integration */}
          <JiraIntegrationCard />

          {/* SSO Configuration - redirects to Profile */}
          <SsoLinkCard />

          {/* API Keys - redirects to Profile */}
          <ApiKeyLinkCard />
        </div>
      </div>
    </ContentLayout>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/integrations/amazon-s3/page.tsx
Signals: React

```typescript
import React from "react";

import { getIntegrations } from "@/actions/integrations";
import { getProviders } from "@/actions/providers";
import { S3IntegrationsManager } from "@/components/integrations/s3/s3-integrations-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";
import { ContentLayout } from "@/components/ui";

interface S3IntegrationsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function S3Integrations({
  searchParams,
}: S3IntegrationsProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page?.toString() || "1", 10);
  const pageSize = parseInt(
    resolvedSearchParams.pageSize?.toString() || "10",
    10,
  );
  const sort = resolvedSearchParams.sort?.toString();

  // Extract all filter parameters
  const filters = Object.fromEntries(
    Object.entries(resolvedSearchParams).filter(([key]) =>
      key.startsWith("filter["),
    ),
  );

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set("filter[integration_type]", "amazon_s3");
  urlSearchParams.set("page[number]", page.toString());
  urlSearchParams.set("page[size]", pageSize.toString());

  if (sort) {
    urlSearchParams.set("sort", sort);
  }

  // Add any additional filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && key !== "filter[integration_type]") {
      const stringValue = Array.isArray(value) ? value[0] : String(value);
      urlSearchParams.set(key, stringValue);
    }
  });

  const [integrations, providers] = await Promise.all([
    getIntegrations(urlSearchParams),
    getProviders({ pageSize: 100 }),
  ]);

  const s3Integrations = integrations?.data || [];
  const availableProviders = providers?.data || [];
  const metadata = integrations?.meta;

  return (
    <ContentLayout title="Amazon S3">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Configure Amazon S3 integration to automatically export your scan
            results to S3 buckets.
          </p>

          <Card variant="base" padding="lg">
            <CardHeader className="mb-0 pb-3">
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="bg-button-primary h-1.5 w-1.5 rounded-full" />
                  Automated scan result exports
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-button-primary h-1.5 w-1.5 rounded-full" />
                  Multi-Cloud support
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-button-primary h-1.5 w-1.5 rounded-full" />
                  Configurable export paths
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-button-primary h-1.5 w-1.5 rounded-full" />
                  IAM role and static credentials
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <S3IntegrationsManager
          integrations={s3Integrations}
          providers={availableProviders}
          metadata={metadata}
        />
      </div>
    </ContentLayout>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/integrations/aws-security-hub/page.tsx
Signals: React

```typescript
import React from "react";

import { getIntegrations } from "@/actions/integrations";
import { getProviders } from "@/actions/providers";
import { SecurityHubIntegrationsManager } from "@/components/integrations/security-hub/security-hub-integrations-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";
import { ContentLayout } from "@/components/ui";

interface SecurityHubIntegrationsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SecurityHubIntegrations({
  searchParams,
}: SecurityHubIntegrationsProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page?.toString() || "1", 10);
  const pageSize = parseInt(
    resolvedSearchParams.pageSize?.toString() || "10",
    10,
  );
  const sort = resolvedSearchParams.sort?.toString();

  const filters = Object.fromEntries(
    Object.entries(resolvedSearchParams).filter(([key]) =>
      key.startsWith("filter["),
    ),
  );

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set("filter[integration_type]", "aws_security_hub");
  urlSearchParams.set("page[number]", page.toString());
  urlSearchParams.set("page[size]", pageSize.toString());

  if (sort) {
    urlSearchParams.set("sort", sort);
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && key !== "filter[integration_type]") {
      const stringValue = Array.isArray(value) ? value[0] : String(value);
      urlSearchParams.set(key, stringValue);
    }
  });

  const [integrations, providers] = await Promise.all([
    getIntegrations(urlSearchParams),
    getProviders({ pageSize: 100 }),
  ]);

  const securityHubIntegrations = integrations?.data || [];
  const availableProviders = providers?.data || [];
  const metadata = integrations?.meta;

  return (
    <ContentLayout title="AWS Security Hub">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Configure AWS Security Hub integration to automatically send your
            security findings for centralized monitoring and compliance.
          </p>

          <Card variant="base" padding="lg">
            <CardHeader className="mb-0 pb-3">
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="bg-button-primary h-1.5 w-1.5 rounded-full" />
                  Automated findings export
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-button-primary h-1.5 w-1.5 rounded-full" />
                  Multi-region support
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-button-primary h-1.5 w-1.5 rounded-full" />
                  Send failed findings only
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-button-primary h-1.5 w-1.5 rounded-full" />
                  Archive previous findings
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <SecurityHubIntegrationsManager
          integrations={securityHubIntegrations}
          providers={availableProviders}
          metadata={metadata}
        />
      </div>
    </ContentLayout>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/integrations/jira/page.tsx

```typescript
import { getIntegrations } from "@/actions/integrations";
import { JiraIntegrationsManager } from "@/components/integrations/jira/jira-integrations-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";
import { ContentLayout } from "@/components/ui";

interface JiraIntegrationsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JiraIntegrations({
  searchParams,
}: JiraIntegrationsProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page?.toString() || "1", 10);
  const pageSize = parseInt(
    resolvedSearchParams.pageSize?.toString() || "10",
    10,
  );
  const sort = resolvedSearchParams.sort?.toString();

  // Extract all filter parameters
  const filters = Object.fromEntries(
    Object.entries(resolvedSearchParams).filter(([key]) =>
      key.startsWith("filter["),
    ),
  );

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set("filter[integration_type]", "jira");
  urlSearchParams.set("page[number]", page.toString());
  urlSearchParams.set("page[size]", pageSize.toString());

  if (sort) {
    urlSearchParams.set("sort", sort);
  }

  // Add any additional filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && key !== "filter[integration_type]") {
      const stringValue = Array.isArray(value) ? value[0] : String(value);
      urlSearchParams.set(key, stringValue);
    }
  });

  const [integrations] = await Promise.all([getIntegrations(urlSearchParams)]);

  const jiraIntegrations = integrations?.data || [];
  const metadata = integrations?.meta;

  return (
    <ContentLayout title="Jira">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Configure Jira integration to automatically create issues for
            security findings in your Jira projects.
          </p>

          <Card variant="base" padding="lg">
            <CardHeader className="mb-0 pb-3">
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="bg-button-primary h-1.5 w-1.5 rounded-full" />
                  Automated issue creation
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-button-primary h-1.5 w-1.5 rounded-full" />
                  Multi-Cloud support
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-button-primary h-1.5 w-1.5 rounded-full" />
                  Flexible issue tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-button-primary h-1.5 w-1.5 rounded-full" />
                  Project-specific configuration
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <JiraIntegrationsManager
          integrations={jiraIntegrations}
          metadata={metadata}
        />
      </div>
    </ContentLayout>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/invitations/page.tsx
Signals: React, Next.js

```typescript
import { Spacer } from "@heroui/spacer";
import Link from "next/link";
import React, { Suspense } from "react";

import { getInvitations } from "@/actions/invitations/invitation";
import { getRoles } from "@/actions/roles";
import { FilterControls } from "@/components/filters";
import { filterInvitations } from "@/components/filters/data-filters";
import { AddIcon } from "@/components/icons";
import {
  ColumnsInvitation,
  SkeletonTableInvitation,
} from "@/components/invitations/table";
import { Button } from "@/components/shadcn";
import { ContentLayout } from "@/components/ui";
import { DataTable, DataTableFilterCustom } from "@/components/ui/table";
import { InvitationProps, Role, SearchParamsProps } from "@/types";

export default async function Invitations({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchParamsKey = JSON.stringify(resolvedSearchParams || {});

  return (
    <ContentLayout title="Invitations" icon="lucide:mail">
      <FilterControls search />

      <div className="flex flex-row items-center justify-between">
        <DataTableFilterCustom filters={filterInvitations || []} />

        <Button asChild>
          <Link href="/invitations/new">
            Send Invitation
            <AddIcon size={20} />
          </Link>
        </Button>
      </div>
      <Spacer y={8} />

      <Suspense key={searchParamsKey} fallback={<SkeletonTableInvitation />}>
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

  // Fetch invitations and roles
  const invitationsData = await getInvitations({
    query,
    page,
    sort,
    filters,
    pageSize,
  });
  const rolesData = await getRoles({});

  // Create a dictionary for roles by invitation ID
  const roleDict = (rolesData?.data || []).reduce(
    (acc: Record<string, Role>, role: Role) => {
      role.relationships.invitations.data.forEach((invitation: any) => {
        acc[invitation.id] = role;
      });
      return acc;
    },
    {},
  );

  // Generate the array of roles with all the roles available
  const roles = Array.from(
    new Map(
      (rolesData?.data || []).map((role: Role) => [
        role.id,
        { id: role.id, name: role.attributes?.name || "Unnamed Role" },
      ]),
    ).values(),
  );

  // Expand the invitations
  const expandedInvitations = invitationsData?.data?.map(
    (invitation: InvitationProps) => {
      const role = roleDict[invitation.id];

      return {
        ...invitation,
        relationships: {
          ...invitation.relationships,
          role,
        },
        roles, // Include all roles here for each invitation
      };
    },
  );

  // Create the expanded response
  const expandedResponse = {
    ...invitationsData,
    data: expandedInvitations,
    roles,
  };

  return (
    <DataTable
      key={Date.now()}
      columns={ColumnsInvitation}
      data={expandedResponse?.data || []}
      metadata={invitationsData?.meta}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: prowler-master/ui/app/(prowler)/invitations/(send-invite)/layout.tsx
Signals: React

```typescript
import "@/styles/globals.css";

import { Spacer } from "@heroui/spacer";
import React from "react";

import { WorkflowSendInvite } from "@/components/invitations/workflow";
import { NavigationHeader } from "@/components/ui";

interface InvitationLayoutProps {
  children: React.ReactNode;
}

export default function InvitationLayout({ children }: InvitationLayoutProps) {
  return (
    <>
      <NavigationHeader
        title="Send Invitation"
        icon="icon-park-outline:close-small"
        href="/invitations"
      />
      <Spacer y={16} />
      <div className="grid grid-cols-1 gap-8 px-4 lg:grid-cols-12 lg:px-0">
        <div className="order-1 my-auto h-full lg:col-span-4 lg:col-start-2">
          <WorkflowSendInvite />
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
Location: prowler-master/ui/app/(prowler)/invitations/(send-invite)/check-details/page.tsx
Signals: React

```typescript
import { Suspense } from "react";

import { getInvitationInfoById } from "@/actions/invitations/invitation";
import { InvitationDetails } from "@/components/invitations";
import { SkeletonInvitationInfo } from "@/components/invitations/workflow";
import { SearchParamsProps } from "@/types";

export default async function CheckDetailsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchParamsKey = JSON.stringify(resolvedSearchParams || {});

  return (
    <Suspense key={searchParamsKey} fallback={<SkeletonInvitationInfo />}>
      <SSRDataInvitation searchParams={resolvedSearchParams} />
    </Suspense>
  );
}

const SSRDataInvitation = async ({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) => {
  const invitationId = searchParams.id;

  if (!invitationId) {
    return <div>Invalid invitation ID</div>;
  }

  const invitationData = (await getInvitationInfoById(invitationId as string))
    .data;

  if (!invitationData) {
    return <div>Invitation not found</div>;
  }

  const { attributes, links } = invitationData;

  return <InvitationDetails attributes={attributes} selfLink={links.self} />;
};
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/invitations/(send-invite)/new/page.tsx
Signals: React

```typescript
import React from "react";
import { Suspense } from "react";

import { getRoles } from "@/actions/roles";
import { SkeletonInvitationInfo } from "@/components/invitations/workflow";
import { SendInvitationForm } from "@/components/invitations/workflow/forms/send-invitation-form";

export default async function SendInvitationPage() {
  const rolesData = await getRoles({});

  return (
    <Suspense fallback={<SkeletonInvitationInfo />}>
      <SSRSendInvitation rolesData={rolesData?.data || []} />
    </Suspense>
  );
}

const SSRSendInvitation = ({ rolesData }: { rolesData: Array<any> }) => {
  const hasRoles = rolesData && rolesData.length > 0;

  return (
    <SendInvitationForm
      roles={rolesData.map((role) => ({
        id: role.id,
        name: role.attributes.name,
      }))}
      defaultRole={!hasRoles ? "admin" : undefined}
      isSelectorDisabled={!hasRoles}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/lighthouse/page.tsx
Signals: Next.js

```typescript
import { redirect } from "next/navigation";

import {
  getLighthouseProvidersConfig,
  isLighthouseConfigured,
} from "@/actions/lighthouse/lighthouse";
import { LighthouseIcon } from "@/components/icons/Icons";
import { Chat } from "@/components/lighthouse";
import { ContentLayout } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AIChatbot() {
  const hasConfig = await isLighthouseConfigured();

  if (!hasConfig) {
    return redirect("/lighthouse/config");
  }

  // Fetch provider configuration with default models
  const providersConfig = await getLighthouseProvidersConfig();

  // Handle errors or missing configuration
  if (providersConfig.errors || !providersConfig.providers) {
    return redirect("/lighthouse/config");
  }

  return (
    <ContentLayout title="Lighthouse AI" icon={<LighthouseIcon />}>
      <div className="-mx-6 -my-4 h-[calc(100dvh-4.5rem)] sm:-mx-8">
        <Chat
          hasConfig={hasConfig}
          providers={providersConfig.providers}
          defaultProviderId={providersConfig.defaultProviderId}
          defaultModelId={providersConfig.defaultModelId}
        />
      </div>
    </ContentLayout>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: prowler-master/ui/app/(prowler)/lighthouse/config/page.tsx

```typescript
import { Spacer } from "@heroui/spacer";

import { LighthouseSettings, LLMProvidersTable } from "@/components/lighthouse";
import { ContentLayout } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ChatbotConfigPage() {
  return (
    <ContentLayout title="LLM Configuration">
      <LLMProvidersTable />
      <Spacer y={8} />
      <LighthouseSettings />
    </ContentLayout>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: prowler-master/ui/app/(prowler)/lighthouse/config/(connect-llm)/layout.tsx
Signals: React, Next.js

```typescript
"use client";

import "@/styles/globals.css";

import { Spacer } from "@heroui/spacer";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  getTenantConfig,
  updateTenantConfig,
} from "@/actions/lighthouse/lighthouse";
import { DeleteLLMProviderForm } from "@/components/lighthouse/forms/delete-llm-provider-form";
import { WorkflowConnectLLM } from "@/components/lighthouse/workflow";
import { Button } from "@/components/shadcn";
import { NavigationHeader } from "@/components/ui";
import { CustomAlertModal } from "@/components/ui/custom";
import type { LighthouseProvider } from "@/types/lighthouse";

interface ConnectLLMLayoutProps {
  children: React.ReactNode;
}

export default function ConnectLLMLayout({ children }: ConnectLLMLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const provider = searchParams.get("provider") as LighthouseProvider | null;
  const isEditMode = mode === "edit";
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDefaultProvider, setIsDefaultProvider] = useState(false);

  // Check if current provider is the default
  useEffect(() => {
    const checkDefaultProvider = async () => {
      if (!provider) return;

      try {
        const config = await getTenantConfig();
        const defaultProvider = config.data?.attributes?.default_provider || "";
        setIsDefaultProvider(provider === defaultProvider);
      } catch (error) {
        console.error("Error checking default provider:", error);
      }
    };

    checkDefaultProvider();
  }, [provider]);

  const handleSetDefault = async () => {
    if (!provider) return;

    await updateTenantConfig({
      default_provider: provider,
    });
    router.push("/lighthouse/config");
  };

  if (!provider) {
    return null;
  }

  return (
    <>
      <CustomAlertModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your LLM provider configuration and remove your data from the server."
      >
        <DeleteLLMProviderForm
          providerType={provider}
          setIsOpen={setIsDeleteOpen}
        />
      </CustomAlertModal>

      <NavigationHeader
        title={isEditMode ? "Configure LLM Provider" : "Connect LLM Provider"}
        icon="icon-park-outline:close-small"
        href="/lighthouse/config"
      />
      <Spacer y={8} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="order-1 my-auto hidden h-full lg:col-span-4 lg:col-start-2 lg:block">
          <WorkflowConnectLLM />
        </div>
        <div className="order-2 my-auto lg:col-span-5 lg:col-start-6">
          {isEditMode && provider && (
            <>
              <div className="flex flex-wrap gap-2">
                {!isDefaultProvider && (
                  <Button
                    aria-label="Set as Default Provider"
                    variant="outline"
                    size="sm"
                    onClick={handleSetDefault}
                    className="w-full sm:w-auto"
                  >
                    <Icon icon="heroicons:star" className="h-4 w-4" />
                    Set as Default
                  </Button>
                )}

                <Button
                  aria-label="Delete Provider"
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Icon icon="heroicons:trash" className="h-4 w-4" />
                  Delete Provider
                </Button>
              </div>
              <Spacer y={4} />
            </>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
```

--------------------------------------------------------------------------------

````
