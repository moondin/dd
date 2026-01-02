---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 791
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 791 of 867)

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

---[FILE: cis-details.tsx]---
Location: prowler-master/ui/components/compliance/compliance-custom-details/cis-details.tsx

```typescript
import ReactMarkdown from "react-markdown";

import { CustomLink } from "@/components/ui/custom/custom-link";
import { Requirement } from "@/types/compliance";

import {
  ComplianceBadge,
  ComplianceBadgeContainer,
  ComplianceDetailContainer,
  ComplianceDetailSection,
  ComplianceDetailText,
} from "./shared-components";

interface CISDetailsProps {
  requirement: Requirement;
}

export const CISCustomDetails = ({ requirement }: CISDetailsProps) => {
  const processReferences = (
    references: string | number | boolean | string[] | object[] | undefined,
  ): string[] => {
    if (typeof references !== "string") return [];

    // Use regex to extract all URLs that start with https://
    const urlRegex = /https:\/\/[^:]+/g;
    const urls = references.match(urlRegex);

    return urls || [];
  };

  return (
    <ComplianceDetailContainer>
      {requirement.description && (
        <ComplianceDetailSection title="Description">
          <ComplianceDetailText>{requirement.description}</ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      <ComplianceBadgeContainer>
        {requirement.profile && (
          <ComplianceBadge
            label="Profile"
            value={requirement.profile as string}
            color="purple"
          />
        )}

        {requirement.assessment_status && (
          <ComplianceBadge
            label="Assessment"
            value={requirement.assessment_status as string}
            color="blue"
          />
        )}
      </ComplianceBadgeContainer>

      {requirement.subsection && (
        <ComplianceDetailSection title="SubSection">
          <ComplianceDetailText>
            {requirement.subsection as string}
          </ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      {requirement.rationale_statement && (
        <ComplianceDetailSection title="Rationale Statement">
          <ComplianceDetailText>
            {requirement.rationale_statement as string}
          </ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      {requirement.impact_statement && (
        <ComplianceDetailSection title="Impact Statement">
          <ComplianceDetailText>
            {requirement.impact_statement as string}
          </ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      {requirement.remediation_procedure &&
        typeof requirement.remediation_procedure === "string" && (
          <ComplianceDetailSection title="Remediation Procedure">
            {/* Prettier -> "plugins": ["prettier-plugin-tailwindcss"] is not ready yet to "prose": */}
            {/* eslint-disable-next-line */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{requirement.remediation_procedure}</ReactMarkdown>
            </div>
          </ComplianceDetailSection>
        )}

      {requirement.audit_procedure &&
        typeof requirement.audit_procedure === "string" && (
          <ComplianceDetailSection title="Audit Procedure">
            {/* eslint-disable-next-line */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{requirement.audit_procedure}</ReactMarkdown>
            </div>
          </ComplianceDetailSection>
        )}

      {requirement.additional_information && (
        <ComplianceDetailSection title="Additional Information">
          <ComplianceDetailText className="whitespace-pre-wrap">
            {requirement.additional_information as string}
          </ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      {requirement.default_value && (
        <ComplianceDetailSection title="Default Value">
          <ComplianceDetailText>
            {requirement.default_value as string}
          </ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      {requirement.references && (
        <ComplianceDetailSection title="References">
          <div className="flex flex-col gap-1">
            {processReferences(requirement.references).map(
              (url: string, index: number) => (
                <div key={index}>
                  <CustomLink href={url}>{url}</CustomLink>
                </div>
              ),
            )}
          </div>
        </ComplianceDetailSection>
      )}
    </ComplianceDetailContainer>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ens-details.tsx]---
Location: prowler-master/ui/components/compliance/compliance-custom-details/ens-details.tsx

```typescript
import { translateType } from "@/lib/compliance/ens";
import { Requirement } from "@/types/compliance";

import {
  ComplianceBadge,
  ComplianceBadgeContainer,
  ComplianceChipContainer,
  ComplianceDetailContainer,
  ComplianceDetailSection,
  ComplianceDetailText,
} from "./shared-components";

export const ENSCustomDetails = ({
  requirement,
}: {
  requirement: Requirement;
}) => {
  return (
    <ComplianceDetailContainer>
      {requirement.description && (
        <ComplianceDetailSection title="Description">
          <ComplianceDetailText>{requirement.description}</ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      <ComplianceBadgeContainer>
        {requirement.type && (
          <ComplianceBadge
            label="Type"
            value={translateType(requirement.type as string)}
            color="orange"
          />
        )}

        {requirement.nivel && (
          <ComplianceBadge
            label="Level"
            value={requirement.nivel as string}
            color="red"
          />
        )}
      </ComplianceBadgeContainer>

      <ComplianceChipContainer
        title="Dimensions"
        items={(requirement.dimensiones as string[]) || []}
      />
    </ComplianceDetailContainer>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: generic-details.tsx]---
Location: prowler-master/ui/components/compliance/compliance-custom-details/generic-details.tsx

```typescript
import { Requirement } from "@/types/compliance";

import {
  ComplianceBadge,
  ComplianceBadgeContainer,
  ComplianceDetailContainer,
  ComplianceDetailSection,
  ComplianceDetailText,
} from "./shared-components";

export const GenericCustomDetails = ({
  requirement,
}: {
  requirement: Requirement;
}) => {
  return (
    <ComplianceDetailContainer>
      {requirement.description && (
        <ComplianceDetailSection title="Description">
          <ComplianceDetailText>{requirement.description}</ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      <ComplianceBadgeContainer>
        {requirement.item_id && (
          <ComplianceBadge
            label="Item ID"
            value={requirement.item_id as string}
            color="indigo"
          />
        )}

        {requirement.service && (
          <ComplianceBadge
            label="Service"
            value={requirement.service as string}
            color="blue"
          />
        )}

        {requirement.type && (
          <ComplianceBadge
            label="Type"
            value={requirement.type as string}
            color="orange"
          />
        )}
      </ComplianceBadgeContainer>

      {requirement.subsection && (
        <ComplianceDetailSection title="SubSection">
          <ComplianceDetailText>
            {requirement.subsection as string}
          </ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      {requirement.subgroup && (
        <ComplianceDetailSection title="SubGroup">
          <ComplianceDetailText>
            {requirement.subgroup as string}
          </ComplianceDetailText>
        </ComplianceDetailSection>
      )}
    </ComplianceDetailContainer>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: iso-details.tsx]---
Location: prowler-master/ui/components/compliance/compliance-custom-details/iso-details.tsx

```typescript
import { Requirement } from "@/types/compliance";

import {
  ComplianceDetailContainer,
  ComplianceDetailSection,
  ComplianceDetailText,
} from "./shared-components";

export const ISOCustomDetails = ({
  requirement,
}: {
  requirement: Requirement;
}) => {
  return (
    <ComplianceDetailContainer>
      {requirement.description && (
        <ComplianceDetailSection title="Description">
          <ComplianceDetailText>{requirement.description}</ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      {requirement.objetive_name && (
        <ComplianceDetailSection title="Objective">
          <ComplianceDetailText>
            {requirement.objetive_name as string}
          </ComplianceDetailText>
        </ComplianceDetailSection>
      )}
    </ComplianceDetailContainer>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: kisa-details.tsx]---
Location: prowler-master/ui/components/compliance/compliance-custom-details/kisa-details.tsx

```typescript
import { Requirement } from "@/types/compliance";

import {
  ComplianceBulletList,
  ComplianceDetailContainer,
  ComplianceDetailSection,
  ComplianceDetailText,
} from "./shared-components";

export const KISACustomDetails = ({
  requirement,
}: {
  requirement: Requirement;
}) => {
  const auditChecklist = requirement.audit_checklist as string[] | undefined;
  const relatedRegulations = requirement.related_regulations as
    | string[]
    | undefined;
  const auditEvidence = requirement.audit_evidence as string[] | undefined;
  const nonComplianceCases = requirement.non_compliance_cases as
    | string[]
    | undefined;

  return (
    <ComplianceDetailContainer>
      {requirement.description && (
        <ComplianceDetailSection title="Description">
          <ComplianceDetailText>{requirement.description}</ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      <ComplianceBulletList
        title="Audit Checklist"
        items={auditChecklist || []}
      />

      <ComplianceBulletList
        title="Related Regulations"
        items={relatedRegulations || []}
      />

      <ComplianceBulletList
        title="Audit Evidence"
        items={auditEvidence || []}
      />

      <ComplianceBulletList
        title="Non-Compliance Cases"
        items={nonComplianceCases || []}
      />
    </ComplianceDetailContainer>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: mitre-details.tsx]---
Location: prowler-master/ui/components/compliance/compliance-custom-details/mitre-details.tsx

```typescript
import { CustomLink } from "@/components/ui/custom/custom-link";
import { Requirement } from "@/types/compliance";

import {
  ComplianceBadge,
  ComplianceBadgeContainer,
  ComplianceChipContainer,
  ComplianceDetailContainer,
  ComplianceDetailSection,
  ComplianceDetailText,
} from "./shared-components";

export const MITRECustomDetails = ({
  requirement,
}: {
  requirement: Requirement;
}) => {
  const cloudServices = requirement.cloud_services as
    | Array<{
        service: string;
        category: string;
        value: string;
        comment: string;
      }>
    | undefined;

  return (
    <ComplianceDetailContainer>
      {requirement.description && (
        <ComplianceDetailSection title="Description">
          <ComplianceDetailText>{requirement.description}</ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      <ComplianceBadgeContainer>
        {requirement.technique_id && (
          <ComplianceBadge
            label="Technique ID"
            value={requirement.technique_id as string}
            color="indigo"
          />
        )}
      </ComplianceBadgeContainer>

      <ComplianceChipContainer
        title="Tactics"
        items={(requirement.tactics as string[]) || []}
      />

      <ComplianceChipContainer
        title="Platforms"
        items={(requirement.platforms as string[]) || []}
      />

      {requirement.subtechniques &&
        Array.isArray(requirement.subtechniques) &&
        requirement.subtechniques.length > 0 && (
          <ComplianceChipContainer
            title="Subtechniques"
            items={requirement.subtechniques as string[]}
          />
        )}

      {requirement.technique_url && (
        <ComplianceDetailSection title="MITRE ATT&CK Reference">
          <CustomLink href={requirement.technique_url as string}>
            {requirement.technique_url as string}
          </CustomLink>
        </ComplianceDetailSection>
      )}

      {cloudServices && cloudServices.length > 0 && (
        <ComplianceDetailSection title="Cloud Security Mappings">
          <div className="flex flex-col gap-4">
            {cloudServices.map((service, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-lg border p-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <ComplianceBadge
                    label="Service"
                    value={service.service}
                    color="blue"
                  />
                  <ComplianceBadge
                    label="Category"
                    value={service.category}
                    color="indigo"
                  />
                  <ComplianceBadge
                    label="Coverage"
                    value={service.value}
                    color="orange"
                  />
                </div>
                {service.comment && (
                  <div>
                    <h5 className="text-muted-foreground mb-1 text-xs font-medium">
                      Details
                    </h5>
                    <ComplianceDetailText className="text-xs">
                      {service.comment}
                    </ComplianceDetailText>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ComplianceDetailSection>
      )}
    </ComplianceDetailContainer>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: shared-components.tsx]---
Location: prowler-master/ui/components/compliance/compliance-custom-details/shared-components.tsx

```typescript
import { cn } from "@/lib/utils";

export const ComplianceDetailContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex flex-col gap-4">{children}</div>;
};

export const ComplianceDetailSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <h4 className="text-muted-foreground mb-2 text-sm font-medium">
        {title}
      </h4>
      {children}
    </div>
  );
};

export const ComplianceDetailText = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <p className={`text-sm leading-relaxed ${className}`}>{children}</p>;
};

export const ComplianceBadgeContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
};

type BadgeColor =
  | "red" // Risk/Level/Severity
  | "blue" // Assessment/Method
  | "orange" // Type/Category
  | "green" // Weight/Score (positive)
  | "purple" // Profile
  | "indigo" // IDs/References
  | "gray"; // Additional Info/Neutral

export const ComplianceBadge = ({
  label,
  value,
  color,
  conditional = false,
}: {
  label: string;
  value: string | number;
  color: BadgeColor;
  conditional?: boolean;
}) => {
  const actualColor = conditional && Number(value) === 0 ? "gray" : color;

  const colorClasses = {
    red: "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20",
    blue: "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
    orange:
      "bg-orange-50 text-orange-700 ring-orange-600/10 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20",
    green:
      "bg-green-50 text-green-700 ring-green-600/10 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20",
    purple:
      "bg-purple-50 text-purple-700 ring-purple-600/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/20",
    indigo:
      "bg-indigo-50 text-indigo-700 ring-indigo-600/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/20",
    gray: "bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20",
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm font-medium">
        {label}:
      </span>
      <span
        className={cn(
          "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
          colorClasses[actualColor],
        )}
      >
        {value}
      </span>
    </div>
  );
};

export const ComplianceBulletList = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => {
  if (!items || items.length === 0) return null;

  return (
    <ComplianceDetailSection title={title}>
      <div className="flex flex-col gap-2">
        {items.map((item: string, index: number) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-muted-foreground mt-1 text-xs">•</span>
            <ComplianceDetailText>{item}</ComplianceDetailText>
          </div>
        ))}
      </div>
    </ComplianceDetailSection>
  );
};

export const ComplianceChipContainer = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => {
  if (!items || items.length === 0) return null;

  return (
    <ComplianceDetailSection title={title}>
      <div className="flex flex-wrap gap-2">
        {items.map((item: string, index: number) => (
          <span
            key={index}
            className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20"
          >
            {item}
          </span>
        ))}
      </div>
    </ComplianceDetailSection>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: threat-details.tsx]---
Location: prowler-master/ui/components/compliance/compliance-custom-details/threat-details.tsx

```typescript
import { Requirement } from "@/types/compliance";

import {
  ComplianceBadge,
  ComplianceBadgeContainer,
  ComplianceDetailContainer,
  ComplianceDetailSection,
  ComplianceDetailText,
} from "./shared-components";

export const ThreatCustomDetails = ({
  requirement,
}: {
  requirement: Requirement;
}) => {
  return (
    <ComplianceDetailContainer>
      {requirement.description && (
        <ComplianceDetailSection title="Description">
          <ComplianceDetailText>{requirement.description}</ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      {requirement.attributeDescription && (
        <ComplianceDetailSection title="Attribute Description">
          <ComplianceDetailText>
            {requirement.attributeDescription as string}
          </ComplianceDetailText>
        </ComplianceDetailSection>
      )}

      <ComplianceBadgeContainer>
        {typeof requirement.levelOfRisk === "number" && (
          <ComplianceBadge
            label="Risk Level"
            value={requirement.levelOfRisk}
            color="red"
          />
        )}

        {typeof requirement.weight === "number" && (
          <ComplianceBadge
            label="Weight"
            value={requirement.weight}
            color="green"
          />
        )}

        {typeof requirement.score === "number" && (
          <ComplianceBadge
            label="Score"
            value={requirement.score}
            color="green"
            conditional={true}
          />
        )}

        {typeof requirement.passedFindings === "number" &&
          typeof requirement.totalFindings === "number" && (
            <>
              <ComplianceBadge
                label="Findings"
                value={`${requirement.passedFindings}/${requirement.totalFindings}`}
                color="blue"
              />
              {requirement.totalFindings > 0 && (
                <ComplianceBadge
                  label="Pass Rate"
                  value={`${Math.round((requirement.passedFindings / requirement.totalFindings) * 100)}%`}
                  color="green"
                  conditional={true}
                />
              )}
            </>
          )}
      </ComplianceBadgeContainer>

      {requirement.additionalInformation && (
        <ComplianceDetailSection title="Additional Information">
          <ComplianceDetailText>
            {requirement.additionalInformation as string}
          </ComplianceDetailText>
        </ComplianceDetailSection>
      )}
    </ComplianceDetailContainer>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: compliance-header.tsx]---
Location: prowler-master/ui/components/compliance/compliance-header/compliance-header.tsx
Signals: Next.js

```typescript
"use client";

import { Spacer } from "@heroui/spacer";
import Image from "next/image";

import { DataTableFilterCustom } from "@/components/ui/table/data-table-filter-custom";
import { ScanEntity } from "@/types/scans";

import { ComplianceScanInfo } from "./compliance-scan-info";
import { DataCompliance } from "./data-compliance";
import { SelectScanComplianceDataProps } from "./scan-selector";

interface ComplianceHeaderProps {
  scans: SelectScanComplianceDataProps["scans"];
  uniqueRegions: string[];
  showSearch?: boolean;
  showRegionFilter?: boolean;
  framework?: string; // Framework name to show specific filters
  showProviders?: boolean;
  hideFilters?: boolean;
  logoPath?: string;
  complianceTitle?: string;
  selectedScan?: ScanEntity | null;
}

export const ComplianceHeader = ({
  scans,
  uniqueRegions,
  showSearch = true,
  showRegionFilter = true,
  framework,
  showProviders = true,
  hideFilters = false,
  logoPath,
  complianceTitle,
  selectedScan,
}: ComplianceHeaderProps) => {
  const frameworkFilters = [];

  // Add CIS Profile Level filter if framework is CIS
  if (framework === "CIS") {
    frameworkFilters.push({
      key: "cis_profile_level",
      labelCheckboxGroup: "Level",
      values: ["Level 1", "Level 2"],
      index: 0, // Show first
      showSelectAll: false, // No "Select All" option since Level 2 includes Level 1
      defaultValues: ["Level 2"], // Default to Level 2 selected (which includes Level 1)
    });
  }

  // Prepare region filters
  const regionFilters = showRegionFilter
    ? [
        {
          key: "region__in",
          labelCheckboxGroup: "Regions",
          values: uniqueRegions,
          index: 1, // Show after framework filters
        },
      ]
    : [];

  const allFilters = [...frameworkFilters, ...regionFilters];

  const hasContent =
    showProviders ||
    showSearch ||
    (!hideFilters && allFilters.length > 0) ||
    selectedScan;

  return (
    <>
      {hasContent && (
        <div className="flex w-full items-start justify-between gap-6">
          <div className="flex flex-1 flex-col justify-end gap-4">
            {selectedScan && <ComplianceScanInfo scan={selectedScan} />}

            {showProviders && <DataCompliance scans={scans} />}
            {!hideFilters && allFilters.length > 0 && (
              <DataTableFilterCustom filters={allFilters} />
            )}
          </div>
          {logoPath && complianceTitle && (
            <div className="hidden shrink-0 sm:block">
              <div className="relative h-24 w-24">
                <Image
                  src={logoPath}
                  alt={`${complianceTitle} logo`}
                  fill
                  className="rounded-lg border border-gray-300 bg-white object-contain p-0"
                />
              </div>
            </div>
          )}
        </div>
      )}
      {hasContent && <Spacer y={8} />}
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: compliance-scan-info.tsx]---
Location: prowler-master/ui/components/compliance/compliance-header/compliance-scan-info.tsx

```typescript
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";

import { DateWithTime, EntityInfo } from "@/components/ui/entities";
import { ProviderType } from "@/types";

interface ComplianceScanInfoProps {
  scan: {
    providerInfo: {
      provider: ProviderType;
      alias?: string;
      uid?: string;
    };
    attributes: {
      name?: string;
      completed_at: string;
    };
  };
}

export const ComplianceScanInfo = ({ scan }: ComplianceScanInfoProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex shrink-0 items-center">
        <EntityInfo
          cloudProvider={scan.providerInfo.provider}
          entityAlias={scan.providerInfo.alias}
          entityId={scan.providerInfo.uid}
          showCopyAction={false}
        />
      </div>
      <Divider orientation="vertical" className="h-8" />
      <div className="flex flex-col items-start whitespace-nowrap">
        <Tooltip
          content={scan.attributes.name || "- -"}
          placement="top"
          size="sm"
        >
          <p className="text-default-500 text-xs">
            {scan.attributes.name || "- -"}
          </p>
        </Tooltip>
        <DateWithTime inline dateTime={scan.attributes.completed_at} />
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: data-compliance.tsx]---
Location: prowler-master/ui/components/compliance/compliance-header/data-compliance.tsx
Signals: React, Next.js

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import {
  ScanSelector,
  SelectScanComplianceDataProps,
} from "@/components/compliance/compliance-header/index";
interface DataComplianceProps {
  scans: SelectScanComplianceDataProps["scans"];
}

export const DataCompliance = ({ scans }: DataComplianceProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const scanIdParam = searchParams.get("scanId");

  const selectedScanId = scanIdParam || (scans.length > 0 ? scans[0].id : "");

  // Don't auto-push scanId to URL - the server already handles the default scan selection
  // This avoids duplicate API calls caused by client-side navigation
  useEffect(() => {
    if (!scanIdParam && scans.length > 0) {
      const params = new URLSearchParams(searchParams);
      params.set("scanId", scans[0].id);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [scans, scanIdParam, searchParams, router]);

  const handleScanChange = (selectedKey: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("scanId", selectedKey);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex max-w-fit">
      <ScanSelector
        scans={scans}
        selectedScanId={selectedScanId}
        onSelectionChange={handleScanChange}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/compliance/compliance-header/index.ts

```typescript
export * from "./data-compliance";
export * from "./scan-selector";
```

--------------------------------------------------------------------------------

---[FILE: scan-selector.tsx]---
Location: prowler-master/ui/components/compliance/compliance-header/scan-selector.tsx

```typescript
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select/select";
import { ProviderType, ScanProps } from "@/types";

import { ComplianceScanInfo } from "./compliance-scan-info";

export interface SelectScanComplianceDataProps {
  scans: (ScanProps & {
    providerInfo: {
      provider: ProviderType;
      uid: string;
      alias: string;
    };
  })[];
  selectedScanId: string;
  onSelectionChange: (selectedKey: string) => void;
}

export const ScanSelector = ({
  scans,
  selectedScanId,
  onSelectionChange,
}: SelectScanComplianceDataProps) => {
  const selectedScan = scans.find((item) => item.id === selectedScanId);

  return (
    <Select
      value={selectedScanId}
      onValueChange={(value) => {
        if (value && value !== selectedScanId) {
          onSelectionChange(value);
        }
      }}
    >
      <SelectTrigger className="w-full min-w-[365px]">
        <SelectValue placeholder="Select a scan">
          {selectedScan ? (
            <ComplianceScanInfo scan={selectedScan} />
          ) : (
            "Select a scan"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {scans.map((scan) => (
          <SelectItem key={scan.id} value={scan.id}>
            <ComplianceScanInfo scan={scan} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: bar-chart-skeleton.tsx]---
Location: prowler-master/ui/components/compliance/skeletons/bar-chart-skeleton.tsx

```typescript
"use client";

import { Skeleton } from "@heroui/skeleton";

export const BarChartSkeleton = () => {
  return (
    <div className="flex w-[400px] flex-col items-center justify-between">
      {/* Title skeleton */}
      <Skeleton className="h-4 w-40 rounded-lg">
        <div className="bg-default-200 h-4" />
      </Skeleton>

      {/* Chart area skeleton */}
      <div className="ml-24 flex h-full flex-col justify-center gap-2 p-4">
        {/* Bar chart skeleton - 5 horizontal bars */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Bar skeleton with varying widths */}
            <Skeleton
              className={`h-10 rounded-lg ${
                index === 0
                  ? "w-48"
                  : index === 1
                    ? "w-40"
                    : index === 2
                      ? "w-32"
                      : index === 3
                        ? "w-24"
                        : "w-16"
              }`}
            >
              <div className="bg-default-200 h-6" />
            </Skeleton>
          </div>
        ))}

        {/* Legend skeleton */}
        <div className="flex justify-center gap-4 pt-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded-full">
                <div className="bg-default-200 h-3 w-3" />
              </Skeleton>
              <Skeleton className="h-3 w-16 rounded-lg">
                <div className="bg-default-200 h-3" />
              </Skeleton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: compliance-accordion-skeleton.tsx]---
Location: prowler-master/ui/components/compliance/skeletons/compliance-accordion-skeleton.tsx
Signals: React

```typescript
import { Skeleton } from "@heroui/skeleton";
import React from "react";

interface SkeletonAccordionProps {
  itemCount?: number;
  className?: string;
  isCompact?: boolean;
}

export const SkeletonAccordion = ({
  itemCount = 3,
  className = "",
  isCompact = false,
}: SkeletonAccordionProps) => {
  const itemHeight = isCompact ? "h-10" : "h-14";

  return (
    <div
      className={`flex w-full flex-col gap-2 ${className} rounded-xl border border-gray-300 p-2 dark:border-gray-700`}
    >
      {[...Array(itemCount)].map((_, index) => (
        <Skeleton key={index} className="rounded-lg">
          <div className={`${itemHeight} bg-default-300`}></div>
        </Skeleton>
      ))}
    </div>
  );
};

SkeletonAccordion.displayName = "SkeletonAccordion";
```

--------------------------------------------------------------------------------

---[FILE: compliance-grid-skeleton.tsx]---
Location: prowler-master/ui/components/compliance/skeletons/compliance-grid-skeleton.tsx
Signals: React

```typescript
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import React from "react";

export const ComplianceSkeletonGrid = () => {
  return (
    <Card className="h-fit w-full p-4">
      <div className="3xl:grid-cols-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {[...Array(28)].map((_, index) => (
          <div key={index} className="flex flex-col gap-4">
            <Skeleton className="h-28 rounded-lg">
              <div className="bg-default-300 h-full"></div>
            </Skeleton>
          </div>
        ))}
      </div>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: heatmap-chart-skeleton.tsx]---
Location: prowler-master/ui/components/compliance/skeletons/heatmap-chart-skeleton.tsx

```typescript
"use client";

import { Skeleton } from "@heroui/skeleton";

export const HeatmapChartSkeleton = () => {
  return (
    <div className="flex h-[320px] w-[400px] flex-col items-center justify-between lg:w-[400px]">
      {/* Title skeleton */}
      <Skeleton className="h-4 w-36 rounded-lg">
        <div className="bg-default-200 h-4" />
      </Skeleton>

      {/* Heatmap area skeleton - 3x3 grid like the real component */}
      <div className="h-full w-full p-4">
        <div className="grid h-full w-full grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton
              key={index}
              className="flex items-center justify-center rounded border"
            >
              <div className="bg-default-200 h-full w-full" />
            </Skeleton>
          ))}
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: pie-chart-skeleton.tsx]---
Location: prowler-master/ui/components/compliance/skeletons/pie-chart-skeleton.tsx

```typescript
"use client";

import { Skeleton } from "@heroui/skeleton";

export const PieChartSkeleton = () => {
  return (
    <div className="flex h-[320px] flex-col items-center justify-between">
      {/* Title skeleton */}
      <Skeleton className="h-4 w-32 rounded-lg">
        <div className="bg-default-200 h-4" />
      </Skeleton>

      {/* Pie chart skeleton */}
      <div className="relative flex aspect-square w-[200px] min-w-[200px] items-center justify-center">
        {/* Outer circle */}
        <Skeleton className="absolute h-[200px] w-[200px] rounded-full">
          <div className="bg-default-200 h-[200px] w-[200px]" />
        </Skeleton>

        {/* Inner circle (donut hole) */}
        <div className="bg-background absolute h-[140px] w-[140px] rounded-full"></div>

        {/* Center text skeleton */}
        <div className="absolute flex flex-col items-center">
          <Skeleton className="h-6 w-8 rounded-lg">
            <div className="bg-default-300 h-6" />
          </Skeleton>
          <Skeleton className="mt-1 h-3 w-6 rounded-lg">
            <div className="bg-default-300 h-3" />
          </Skeleton>
        </div>
      </div>

      {/* Bottom stats skeleton */}
      <div className="mt-2 grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
          <Skeleton className="h-4 w-8 rounded-lg">
            <div className="bg-default-200 h-4" />
          </Skeleton>
          <Skeleton className="mt-1 h-5 w-6 rounded-lg">
            <div className="bg-default-200 h-5" />
          </Skeleton>
        </div>
        <div className="flex flex-col items-center">
          <Skeleton className="h-4 w-6 rounded-lg">
            <div className="bg-default-200 h-4" />
          </Skeleton>
          <Skeleton className="mt-1 h-5 w-6 rounded-lg">
            <div className="bg-default-200 h-5" />
          </Skeleton>
        </div>
        <div className="flex flex-col items-center">
          <Skeleton className="h-4 w-12 rounded-lg">
            <div className="bg-default-200 h-4" />
          </Skeleton>
          <Skeleton className="mt-1 h-5 w-6 rounded-lg">
            <div className="bg-default-200 h-5" />
          </Skeleton>
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

````
