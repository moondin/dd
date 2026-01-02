---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 849
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 849 of 867)

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

---[FILE: generic.tsx]---
Location: prowler-master/ui/lib/compliance/generic.tsx

```typescript
import { ClientAccordionContent } from "@/components/compliance/compliance-accordion/client-accordion-content";
import { ComplianceAccordionRequirementTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-requeriment-title";
import { ComplianceAccordionTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-title";
import { AccordionItemProps } from "@/components/ui/accordion/Accordion";
import { FindingStatus } from "@/components/ui/table/status-finding-badge";
import {
  AttributesData,
  Framework,
  GenericAttributesMetadata,
  Requirement,
  REQUIREMENT_STATUS,
  RequirementsData,
  RequirementStatus,
} from "@/types/compliance";

import {
  calculateFrameworkCounters,
  createRequirementsMap,
  findOrCreateCategory,
  findOrCreateControl,
  findOrCreateFramework,
  updateCounters,
} from "./commons";

interface ProcessedItem {
  id: string;
  attrs: GenericAttributesMetadata;
  attributeItem: any;
  requirementData: any;
}

const createRequirement = (itemData: ProcessedItem): Requirement => {
  const { id, attrs, attributeItem, requirementData } = itemData;
  const name = attributeItem.attributes.name || id;
  const description = attributeItem.attributes.description;
  const status = requirementData.attributes.status || "";
  const checks = attributeItem.attributes.attributes.check_ids || [];
  const finalStatus: RequirementStatus = status as RequirementStatus;

  return {
    name: attributeItem.attributes.framework === "PCI" ? id : name,
    description: description,
    status: finalStatus,
    check_ids: checks,
    pass: finalStatus === REQUIREMENT_STATUS.PASS ? 1 : 0,
    fail: finalStatus === REQUIREMENT_STATUS.FAIL ? 1 : 0,
    manual: finalStatus === REQUIREMENT_STATUS.MANUAL ? 1 : 0,
    item_id: attrs.ItemId,
    subsection: attrs.SubSection,
    subgroup: attrs.SubGroup || undefined,
    service: attrs.Service || undefined,
    type: attrs.Type || undefined,
  };
};

const shouldUseThreeLevelHierarchy = (items: ProcessedItem[]): boolean => {
  const itemsWithSection = items.filter(
    (item) =>
      item.attrs.Section &&
      item.attrs.Section !== (item.attributeItem.attributes.name || item.id),
  );
  return (
    itemsWithSection.length > 0 &&
    itemsWithSection.every((item) => item.attrs.SubSection)
  );
};

export const mapComplianceData = (
  attributesData: AttributesData,
  requirementsData: RequirementsData,
): Framework[] => {
  const attributes = attributesData?.data || [];
  const requirementsMap = createRequirementsMap(requirementsData);
  const frameworks: Framework[] = [];
  const itemsByFramework = new Map<string, ProcessedItem[]>();

  // First pass: collect all data
  for (const attributeItem of attributes) {
    const id = attributeItem.id;
    const metadataArray = attributeItem.attributes?.attributes
      ?.metadata as unknown as GenericAttributesMetadata[];
    const attrs = metadataArray?.[0];
    if (!attrs) continue;

    const requirementData = requirementsMap.get(id);
    if (!requirementData) continue;

    const frameworkName = attributeItem.attributes.framework;

    if (!itemsByFramework.has(frameworkName)) {
      itemsByFramework.set(frameworkName, []);
    }

    itemsByFramework.get(frameworkName)!.push({
      id,
      attrs,
      attributeItem,
      requirementData,
    });
  }

  // Process each framework
  for (const [frameworkName, items] of Array.from(itemsByFramework.entries())) {
    const framework = findOrCreateFramework(frameworks, frameworkName);
    const allHaveSubsection = shouldUseThreeLevelHierarchy(items);

    // Process each item in the framework
    for (const itemData of items) {
      const requirement = createRequirement(itemData);
      const sectionName = itemData.attrs.Section;
      const subSectionName = itemData.attrs.SubSection;

      // Determine structure: flat, 2-level, or 3-level hierarchy
      if (!sectionName || sectionName === requirement.name) {
        // Flat structure: store requirements directly in framework
        (framework as any).requirements = (framework as any).requirements || [];
        (framework as any).requirements.push(requirement);
        updateCounters(framework, requirement.status);
      } else if (allHaveSubsection && subSectionName) {
        // 3-level hierarchy: Section -> SubSection -> Requirements
        const category = findOrCreateCategory(
          framework.categories,
          sectionName,
        );
        const control = findOrCreateControl(category.controls, subSectionName);
        control.requirements.push(requirement);
        updateCounters(control, requirement.status);
      } else {
        // 2-level hierarchy: Section -> Requirements
        const category = findOrCreateCategory(
          framework.categories,
          sectionName,
        );
        const control = {
          label: requirement.name,
          pass: 0,
          fail: 0,
          manual: 0,
          requirements: [requirement],
        };
        updateCounters(control, requirement.status);
        category.controls.push(control);
      }
    }
  }

  // Calculate counters using common helper
  calculateFrameworkCounters(frameworks);

  return frameworks;
};

// Helper function to create accordion item for requirement
const createRequirementAccordionItem = (
  requirement: Requirement,
  itemKey: string,
  scanId: string,
  frameworkName: string,
): AccordionItemProps => ({
  key: itemKey,
  title: (
    <ComplianceAccordionRequirementTitle
      type=""
      name={requirement.name}
      status={requirement.status as FindingStatus}
    />
  ),
  content: (
    <ClientAccordionContent
      key={`content-${itemKey}`}
      requirement={requirement}
      scanId={scanId}
      framework={frameworkName}
      disableFindings={
        requirement.check_ids.length === 0 && requirement.manual === 0
      }
    />
  ),
  items: [],
});

export const toAccordionItems = (
  data: Framework[],
  scanId: string | undefined,
): AccordionItemProps[] => {
  return data.flatMap((framework) => {
    const directRequirements = (framework as any).requirements || [];

    // Flat structure - requirements directly
    if (directRequirements.length > 0) {
      return directRequirements.map((requirement: Requirement, i: number) =>
        createRequirementAccordionItem(
          requirement,
          `${framework.name}-req-${i}`,
          scanId || "",
          framework.name,
        ),
      );
    }

    // Hierarchical structure - categories with controls
    return framework.categories.map((category) => ({
      key: `${framework.name}-${category.name}`,
      title: (
        <ComplianceAccordionTitle
          label={category.name}
          pass={category.pass}
          fail={category.fail}
          manual={category.manual}
          isParentLevel={true}
        />
      ),
      content: "",
      items: category.controls.map((control, i: number) => {
        const baseKey = `${framework.name}-${category.name}-control-${i}`;

        // 3-level hierarchy: control has multiple requirements
        if (control.requirements.length > 1) {
          return {
            key: baseKey,
            title: (
              <ComplianceAccordionTitle
                label={control.label}
                pass={control.pass}
                fail={control.fail}
                manual={control.manual}
              />
            ),
            content: "",
            items: control.requirements.map((requirement, j: number) =>
              createRequirementAccordionItem(
                requirement,
                `${baseKey}-req-${j}`,
                scanId || "",
                framework.name,
              ),
            ),
            isDisabled:
              control.pass === 0 && control.fail === 0 && control.manual === 0,
          };
        }

        // 2-level hierarchy: direct requirement
        const requirement = control.requirements[0];
        return {
          key: baseKey,
          title: (
            <ComplianceAccordionRequirementTitle
              type=""
              name={control.label}
              status={requirement.status as FindingStatus}
            />
          ),
          content: (
            <ClientAccordionContent
              requirement={requirement}
              scanId={scanId || ""}
              framework={framework.name}
              disableFindings={
                requirement.check_ids.length === 0 && requirement.manual === 0
              }
            />
          ),
          items: [],
        };
      }),
    }));
  });
};
```

--------------------------------------------------------------------------------

---[FILE: iso.tsx]---
Location: prowler-master/ui/lib/compliance/iso.tsx

```typescript
import { ClientAccordionContent } from "@/components/compliance/compliance-accordion/client-accordion-content";
import { ComplianceAccordionRequirementTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-requeriment-title";
import { ComplianceAccordionTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-title";
import { AccordionItemProps } from "@/components/ui/accordion/Accordion";
import { FindingStatus } from "@/components/ui/table/status-finding-badge";
import {
  AttributesData,
  Framework,
  ISO27001AttributesMetadata,
  Requirement,
  REQUIREMENT_STATUS,
  RequirementsData,
  RequirementStatus,
} from "@/types/compliance";

import {
  calculateFrameworkCounters,
  createRequirementsMap,
  findOrCreateCategory,
  findOrCreateControl,
  findOrCreateFramework,
} from "./commons";

export const mapComplianceData = (
  attributesData: AttributesData,
  requirementsData: RequirementsData,
): Framework[] => {
  const attributes = attributesData?.data || [];
  const requirementsMap = createRequirementsMap(requirementsData);
  const frameworks: Framework[] = [];

  // Process attributes and merge with requirements data
  for (const attributeItem of attributes) {
    const id = attributeItem.id;
    const metadataArray = attributeItem.attributes?.attributes
      ?.metadata as unknown as ISO27001AttributesMetadata[];
    const attrs = metadataArray?.[0];
    if (!attrs) continue;

    // Get corresponding requirement data
    const requirementData = requirementsMap.get(id);
    if (!requirementData) continue;

    const frameworkName = attributeItem.attributes.framework;
    const categoryName = attrs.Category;
    const controlLabel = `${attrs.Objetive_ID} - ${attrs.Objetive_Name}`;
    const description = attributeItem.attributes.description;
    const status = requirementData.attributes.status || "";
    const checks = attributeItem.attributes.attributes.check_ids || [];
    const requirementName = id;
    const objetiveName = attrs.Objetive_Name;
    const checkSummary = attrs.Check_Summary;

    // Find or create framework using common helper
    const framework = findOrCreateFramework(frameworks, frameworkName);

    // Find or create category using common helper
    const category = findOrCreateCategory(framework.categories, categoryName);

    // Find or create control using common helper
    const control = findOrCreateControl(category.controls, controlLabel);

    // Create requirement
    const finalStatus: RequirementStatus = status as RequirementStatus;
    const requirement: Requirement = {
      name: requirementName,
      description: description,
      status: finalStatus,
      check_ids: checks,
      pass: finalStatus === REQUIREMENT_STATUS.PASS ? 1 : 0,
      fail: finalStatus === REQUIREMENT_STATUS.FAIL ? 1 : 0,
      manual: finalStatus === REQUIREMENT_STATUS.MANUAL ? 1 : 0,
      objetive_name: objetiveName,
      check_summary: checkSummary,
      control_label: controlLabel,
    };

    control.requirements.push(requirement);
  }

  // Calculate counters using common helper
  calculateFrameworkCounters(frameworks);

  return frameworks;
};

export const toAccordionItems = (
  data: Framework[],
  scanId: string | undefined,
): AccordionItemProps[] => {
  return data.flatMap((framework) =>
    framework.categories.map((category) => {
      const allRequirements = category.controls.flatMap(
        (control) => control.requirements,
      );

      return {
        key: `${framework.name}-${category.name}`,
        title: (
          <ComplianceAccordionTitle
            label={category.name}
            pass={category.pass}
            fail={category.fail}
            manual={category.manual}
            isParentLevel={true}
          />
        ),
        content: "",
        items: allRequirements.map((requirement, j: number) => {
          const itemKey = `${framework.name}-${category.name}-req-${j}`;

          return {
            key: itemKey,
            title: (
              <ComplianceAccordionRequirementTitle
                type=""
                name={(requirement.control_label as string) || requirement.name}
                status={requirement.status as FindingStatus}
              />
            ),
            content: (
              <ClientAccordionContent
                key={`content-${itemKey}`}
                requirement={requirement}
                scanId={scanId || ""}
                framework={framework.name}
                disableFindings={
                  requirement.check_ids.length === 0 && requirement.manual === 0
                }
              />
            ),
            items: [],
          };
        }),
      };
    }),
  );
};
```

--------------------------------------------------------------------------------

---[FILE: kisa.tsx]---
Location: prowler-master/ui/lib/compliance/kisa.tsx

```typescript
import { ClientAccordionContent } from "@/components/compliance/compliance-accordion/client-accordion-content";
import { ComplianceAccordionRequirementTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-requeriment-title";
import { ComplianceAccordionTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-title";
import { AccordionItemProps } from "@/components/ui/accordion/Accordion";
import { FindingStatus } from "@/components/ui/table/status-finding-badge";
import {
  AttributesData,
  Framework,
  KISAAttributesMetadata,
  Requirement,
  REQUIREMENT_STATUS,
  RequirementsData,
  RequirementStatus,
} from "@/types/compliance";

import {
  calculateFrameworkCounters,
  createRequirementsMap,
  findOrCreateCategory,
  findOrCreateControl,
  findOrCreateFramework,
} from "./commons";

export const mapComplianceData = (
  attributesData: AttributesData,
  requirementsData: RequirementsData,
): Framework[] => {
  const attributes = attributesData?.data || [];
  const requirementsMap = createRequirementsMap(requirementsData);
  const frameworks: Framework[] = [];

  // Process attributes and merge with requirements data
  for (const attributeItem of attributes) {
    const id = attributeItem.id;
    const metadataArray = attributeItem.attributes?.attributes
      ?.metadata as unknown as KISAAttributesMetadata[];
    const attrs = metadataArray?.[0];
    if (!attrs) continue;

    // Get corresponding requirement data
    const requirementData = requirementsMap.get(id);
    if (!requirementData) continue;

    const frameworkName = attributeItem.attributes.framework;
    const categoryName = attrs.Domain; // Level 1: Domain
    const controlLabel = attrs.Subdomain; // Level 2: Subdomain
    const sectionName = attrs.Section; // Level 3: Section
    const description = attributeItem.attributes.description;
    const status = requirementData.attributes.status || "";
    const checks = attributeItem.attributes.attributes.check_ids || [];
    const requirementName = id;

    // Find or create framework using common helper
    const framework = findOrCreateFramework(frameworks, frameworkName);

    // Find or create category (Domain) using common helper
    const category = findOrCreateCategory(framework.categories, categoryName);

    // Find or create control (Subdomain) using common helper
    const control = findOrCreateControl(category.controls, controlLabel);

    // Create requirement (Section)
    const finalStatus: RequirementStatus = status as RequirementStatus;
    const requirement: Requirement = {
      name: requirementName,
      description: description,
      status: finalStatus,
      check_ids: checks,
      pass: finalStatus === REQUIREMENT_STATUS.PASS ? 1 : 0,
      fail: finalStatus === REQUIREMENT_STATUS.FAIL ? 1 : 0,
      manual: finalStatus === REQUIREMENT_STATUS.MANUAL ? 1 : 0,
      section: sectionName,
      audit_checklist: attrs.AuditChecklist,
      related_regulations: attrs.RelatedRegulations,
      audit_evidence: attrs.AuditEvidence,
      non_compliance_cases: attrs.NonComplianceCases,
    };

    control.requirements.push(requirement);
  }

  // Calculate counters using common helper
  calculateFrameworkCounters(frameworks);

  return frameworks;
};

export const toAccordionItems = (
  data: Framework[],
  scanId: string | undefined,
): AccordionItemProps[] => {
  return data.flatMap((framework) =>
    framework.categories.map((category) => {
      return {
        key: `${framework.name}-${category.name}`,
        title: (
          <ComplianceAccordionTitle
            label={category.name}
            pass={category.pass}
            fail={category.fail}
            manual={category.manual}
            isParentLevel={true}
          />
        ),
        content: "",
        items: category.controls.map((control, i: number) => {
          return {
            key: `${framework.name}-${category.name}-control-${i}`,
            title: (
              <ComplianceAccordionTitle
                label={control.label}
                pass={control.pass}
                fail={control.fail}
                manual={control.manual}
              />
            ),
            content: "",
            items: control.requirements.map((requirement, j: number) => {
              const itemKey = `${framework.name}-${category.name}-control-${i}-req-${j}`;

              return {
                key: itemKey,
                title: (
                  <ComplianceAccordionRequirementTitle
                    type=""
                    name={requirement.section as string}
                    status={requirement.status as FindingStatus}
                  />
                ),
                content: (
                  <ClientAccordionContent
                    key={`content-${itemKey}`}
                    requirement={requirement}
                    scanId={scanId || ""}
                    framework={framework.name}
                    disableFindings={
                      requirement.check_ids.length === 0 &&
                      requirement.manual === 0
                    }
                  />
                ),
                items: [],
              };
            }),
            isDisabled:
              control.pass === 0 && control.fail === 0 && control.manual === 0,
          };
        }),
      };
    }),
  );
};
```

--------------------------------------------------------------------------------

---[FILE: mitre.tsx]---
Location: prowler-master/ui/lib/compliance/mitre.tsx

```typescript
import { ClientAccordionContent } from "@/components/compliance/compliance-accordion/client-accordion-content";
import { ComplianceAccordionRequirementTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-requeriment-title";
import { AccordionItemProps } from "@/components/ui/accordion/Accordion";
import { FindingStatus } from "@/components/ui/table/status-finding-badge";
import {
  AttributesData,
  CategoryData,
  FailedSection,
  Framework,
  MITREAttributesMetadata,
  Requirement,
  REQUIREMENT_STATUS,
  RequirementsData,
  RequirementStatus,
  TOP_FAILED_DATA_TYPE,
  TopFailedResult,
} from "@/types/compliance";

import {
  calculateFrameworkCounters,
  createRequirementsMap,
  findOrCreateFramework,
} from "./commons";

// Type for the internal map used in getTopFailedSections
interface FailedSectionData {
  total: number;
  types: Record<string, number>;
}

export const mapComplianceData = (
  attributesData: AttributesData,
  requirementsData: RequirementsData,
): Framework[] => {
  const attributes = attributesData?.data || [];
  const requirementsMap = createRequirementsMap(requirementsData);

  const frameworks: Framework[] = [];

  // Process ALL attributes to ensure consistent counters for charts
  for (const attributeItem of attributes) {
    const id = attributeItem.id;
    const metadataArray = attributeItem.attributes?.attributes
      ?.metadata as unknown as MITREAttributesMetadata[];

    // Get corresponding requirement data
    const requirementData = requirementsMap.get(id);
    if (!requirementData) continue;

    const frameworkName = attributeItem.attributes.framework;
    const techniqueName = attributeItem.attributes.name || id;
    const description = attributeItem.attributes.description;
    const status = requirementData.attributes.status || "";
    const checks = attributeItem.attributes.attributes.check_ids || [];
    const techniqueDetails =
      attributeItem.attributes.attributes.technique_details;
    const tactics = techniqueDetails?.tactics || [];
    const subtechniques = techniqueDetails?.subtechniques || [];
    const platforms = techniqueDetails?.platforms || [];
    const techniqueUrl = techniqueDetails?.technique_url || "";
    const requirementName = `${id} - ${techniqueName}`;

    // Find or create framework using common helper
    const framework = findOrCreateFramework(frameworks, frameworkName);

    // Create requirement directly (flat structure - no categories)
    // Include ALL requirements, even those without metadata (for accurate chart counts)
    const finalStatus: RequirementStatus = status as RequirementStatus;
    const requirement: Requirement = {
      name: requirementName,
      description: description,
      status: finalStatus,
      check_ids: checks,
      pass: finalStatus === REQUIREMENT_STATUS.PASS ? 1 : 0,
      fail: finalStatus === REQUIREMENT_STATUS.FAIL ? 1 : 0,
      manual: finalStatus === REQUIREMENT_STATUS.MANUAL ? 1 : 0,
      // MITRE specific fields
      technique_id: id,
      technique_name: techniqueName,
      tactics: tactics,
      subtechniques: subtechniques,
      platforms: platforms,
      technique_url: techniqueUrl,
      // Mark items without metadata so accordion can filter them out
      hasMetadata: !!(metadataArray && metadataArray.length > 0),
      cloud_services:
        metadataArray?.map((m) => {
          // Dynamically find the service field (AWSService, GCPService, AzureService, etc.)
          const serviceKey = Object.keys(m).find((key) =>
            key.toLowerCase().includes("service"),
          );
          const serviceName = serviceKey ? m[serviceKey] : "Unknown Service";

          return {
            service: serviceName,
            category: m.Category,
            value: m.Value,
            comment: m.Comment,
          };
        }) || [],
    };

    // Add requirement directly to framework (flat structure - no categories)
    framework.requirements = framework.requirements ?? [];
    framework.requirements.push(requirement);
  }

  // Calculate counters using common helper (works with flat structure)
  calculateFrameworkCounters(frameworks);

  return frameworks;
};

export const toAccordionItems = (
  data: Framework[],
  scanId: string | undefined,
): AccordionItemProps[] => {
  return data.flatMap((framework) => {
    const requirements = framework.requirements ?? [];

    // Filter out requirements without metadata (can't be displayed in accordion)
    const displayableRequirements = requirements.filter(
      (requirement) => requirement.hasMetadata !== false,
    );

    return displayableRequirements.map((requirement, i) => {
      const itemKey = `${framework.name}-req-${i}`;

      return {
        key: itemKey,
        title: (
          <ComplianceAccordionRequirementTitle
            type=""
            name={requirement.name}
            status={requirement.status as FindingStatus}
          />
        ),
        content: (
          <ClientAccordionContent
            key={`content-${itemKey}`}
            requirement={requirement}
            scanId={scanId || ""}
            framework={framework.name}
            disableFindings={
              requirement.check_ids.length === 0 && requirement.manual === 0
            }
          />
        ),
        items: [],
      };
    });
  });
};

// Custom function for MITRE to get top failed sections grouped by tactics
export const getTopFailedSections = (
  mappedData: Framework[],
): TopFailedResult => {
  const failedSectionMap = new Map<string, FailedSectionData>();

  mappedData.forEach((framework) => {
    const requirements = framework.requirements ?? [];

    requirements.forEach((requirement) => {
      if (requirement.status === REQUIREMENT_STATUS.FAIL) {
        const tactics = Array.isArray(requirement.tactics)
          ? (requirement.tactics as string[])
          : [];

        tactics.forEach((tactic) => {
          if (!failedSectionMap.has(tactic)) {
            failedSectionMap.set(tactic, { total: 0, types: {} });
          }

          const sectionData = failedSectionMap.get(tactic)!;
          sectionData.total += 1;

          const type = "Fails";
          sectionData.types[type] = (sectionData.types[type] || 0) + 1;
        });
      }
    });
  });

  // Convert in descending order and slice top 5
  return {
    items: Array.from(failedSectionMap.entries())
      .map(([name, data]): FailedSection => ({ name, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5),
    type: TOP_FAILED_DATA_TYPE.SECTIONS,
  };
};

// Custom function for MITRE to calculate category heatmap data grouped by tactics
export const calculateCategoryHeatmapData = (
  complianceData: Framework[],
): CategoryData[] => {
  if (!complianceData?.length) {
    return [];
  }

  try {
    const tacticMap = new Map<
      string,
      { pass: number; fail: number; manual: number }
    >();

    // Aggregate data by tactics
    complianceData.forEach((framework) => {
      const requirements = framework.requirements ?? [];

      requirements.forEach((requirement) => {
        const tactics = Array.isArray(requirement.tactics)
          ? (requirement.tactics as string[])
          : [];

        tactics.forEach((tactic) => {
          const existing = tacticMap.get(tactic) || {
            pass: 0,
            fail: 0,
            manual: 0,
          };

          tacticMap.set(tactic, {
            pass: existing.pass + requirement.pass,
            fail: existing.fail + requirement.fail,
            manual: existing.manual + requirement.manual,
          });
        });
      });
    });

    const categoryData: CategoryData[] = Array.from(tacticMap.entries()).map(
      ([name, stats]) => {
        const totalRequirements = stats.pass + stats.fail + stats.manual;
        const failurePercentage =
          totalRequirements > 0
            ? Math.round((stats.fail / totalRequirements) * 100)
            : 0;

        return {
          name,
          failurePercentage,
          totalRequirements,
          failedRequirements: stats.fail,
        };
      },
    );

    const filteredData = categoryData
      .filter((category) => category.totalRequirements > 0)
      .sort((a, b) => b.failurePercentage - a.failurePercentage)
      .slice(0, 9); // Show top 9 tactics

    return filteredData;
  } catch (error) {
    console.error("Error calculating MITRE category heatmap data:", error);
    return [];
  }
};
```

--------------------------------------------------------------------------------

---[FILE: threat.tsx]---
Location: prowler-master/ui/lib/compliance/threat.tsx

```typescript
import { ClientAccordionContent } from "@/components/compliance/compliance-accordion/client-accordion-content";
import { ComplianceAccordionRequirementTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-requeriment-title";
import { ComplianceAccordionTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-title";
import { AccordionItemProps } from "@/components/ui/accordion/Accordion";
import { FindingStatus } from "@/components/ui/table/status-finding-badge";
import {
  AttributesData,
  Framework,
  Requirement,
  REQUIREMENT_STATUS,
  RequirementsData,
  RequirementStatus,
  ThreatAttributesMetadata,
} from "@/types/compliance";

import {
  createRequirementsMap,
  findOrCreateCategory,
  findOrCreateControl,
  findOrCreateFramework,
  updateCounters,
} from "./commons";

export const mapComplianceData = (
  attributesData: AttributesData,
  requirementsData: RequirementsData,
): Framework[] => {
  const attributes = attributesData?.data || [];
  const requirementsMap = createRequirementsMap(requirementsData);
  const frameworks: Framework[] = [];

  // Process attributes and merge with requirements data
  for (const attributeItem of attributes) {
    const id = attributeItem.id;
    const metadataArray = attributeItem.attributes?.attributes
      ?.metadata as unknown as ThreatAttributesMetadata[];
    const attrs = metadataArray?.[0];
    if (!attrs) continue;

    // Get corresponding requirement data
    const requirementData = requirementsMap.get(id);
    if (!requirementData) continue;

    const frameworkName = attributeItem.attributes.framework;
    const sectionName = attrs.Section;
    const subSectionName = attrs.SubSection;
    const title = attrs.Title;
    const description = attributeItem.attributes.description;
    const status = requirementData.attributes.status || "";
    const checks = attributeItem.attributes.attributes.check_ids || [];
    const requirementName = id;
    const levelOfRisk = attrs.LevelOfRisk;
    const weight = attrs.Weight;
    const attributeDescription = attrs.AttributeDescription;
    const additionalInformation = attrs.AdditionalInformation;
    const passedFindings = requirementData.attributes.passed_findings || 0;
    const totalFindings = requirementData.attributes.total_findings || 0;

    // Calculate score: if PASS = levelOfRisk * weight, if FAIL = 0
    const score = status === REQUIREMENT_STATUS.PASS ? levelOfRisk * weight : 0;

    // Find or create framework using common helper
    const framework = findOrCreateFramework(frameworks, frameworkName);

    // Find or create category (Section) using common helper
    const category = findOrCreateCategory(framework.categories, sectionName);

    // Find or create control (SubSection) using common helper
    const control = findOrCreateControl(category.controls, subSectionName);

    // Create requirement
    const finalStatus: RequirementStatus = status as RequirementStatus;
    const requirement: Requirement = {
      name: requirementName,
      description: description,
      status: finalStatus,
      check_ids: checks,
      pass: finalStatus === REQUIREMENT_STATUS.PASS ? 1 : 0,
      fail: finalStatus === REQUIREMENT_STATUS.FAIL ? 1 : 0,
      manual: finalStatus === REQUIREMENT_STATUS.MANUAL ? 1 : 0,
      title: title,
      levelOfRisk: levelOfRisk,
      weight: weight,
      score: score,
      attributeDescription: attributeDescription,
      additionalInformation: additionalInformation,
      passedFindings: passedFindings,
      totalFindings: totalFindings,
    };

    control.requirements.push(requirement);
  }

  // Calculate counters and percentualScore (Threat-specific logic)
  frameworks.forEach((framework) => {
    framework.pass = 0;
    framework.fail = 0;
    framework.manual = 0;

    framework.categories.forEach((category) => {
      category.pass = 0;
      category.fail = 0;
      category.manual = 0;

      // Calculate ThreatScore using the new formula
      let numerator = 0;
      let denominator = 0;
      let hasFindings = false;

      category.controls.forEach((control) => {
        control.pass = 0;
        control.fail = 0;
        control.manual = 0;

        control.requirements.forEach((requirement) => {
          updateCounters(control, requirement.status);

          // Extract values for ThreatScore calculation
          const pass_i = (requirement.passedFindings as number) || 0;
          const total_i = (requirement.totalFindings as number) || 0;

          // Skip if no findings (avoid division by zero)
          if (total_i === 0) return;

          hasFindings = true;
          const rate_i = pass_i / total_i;
          const weight_i = (requirement.weight as number) || 1;
          const levelOfRisk = (requirement.levelOfRisk as number) || 0;

          // Map levelOfRisk to risk factor (rfac_i)
          // Formula: rfac_i = 1 + (k * levelOfRisk) where k = 0.25
          const rfac_i = 1 + 0.25 * levelOfRisk;

          // Accumulate weighted values
          numerator += rate_i * total_i * weight_i * rfac_i;
          denominator += total_i * weight_i * rfac_i;
        });

        category.pass += control.pass;
        category.fail += control.fail;
        category.manual += control.manual;
      });

      // Calculate ThreatScore (percentualScore) for this section
      // If no findings exist, consider it 100% (PASS)
      const percentualScore = !hasFindings
        ? 100
        : denominator > 0
          ? (numerator / denominator) * 100
          : 0;

      // Add percentualScore to category (we can extend the type or use a custom property)
      (category as any).percentualScore =
        Math.round(percentualScore * 100) / 100; // Round to 2 decimal places

      framework.pass += category.pass;
      framework.fail += category.fail;
      framework.manual += category.manual;
    });
  });

  return frameworks;
};

export const toAccordionItems = (
  data: Framework[],
  scanId: string | undefined,
): AccordionItemProps[] => {
  return data.flatMap((framework) =>
    framework.categories.map((category) => {
      const percentualScore = (category as any).percentualScore || 0;

      return {
        key: `${framework.name}-${category.name}`,
        title: (
          <ComplianceAccordionTitle
            label={`${category.name} - ${percentualScore}%`}
            pass={category.pass}
            fail={category.fail}
            manual={category.manual}
            isParentLevel={true}
          />
        ),
        content: "",
        items: category.controls.map((control, i: number) => {
          return {
            key: `${framework.name}-${category.name}-control-${i}`,
            title: (
              <ComplianceAccordionTitle
                label={control.label}
                pass={control.pass}
                fail={control.fail}
                manual={control.manual}
              />
            ),
            content: "",
            items: control.requirements.map((requirement, j: number) => {
              const itemKey = `${framework.name}-${category.name}-control-${i}-req-${j}`;

              return {
                key: itemKey,
                title: (
                  <ComplianceAccordionRequirementTitle
                    type=""
                    name={`${requirement.name} - ${requirement.title || requirement.description}`}
                    status={requirement.status as FindingStatus}
                  />
                ),
                content: (
                  <ClientAccordionContent
                    key={`content-${itemKey}`}
                    requirement={requirement}
                    scanId={scanId || ""}
                    framework={framework.name}
                    disableFindings={
                      requirement.check_ids.length === 0 &&
                      requirement.manual === 0
                    }
                  />
                ),
                items: [],
              };
            }),
            isDisabled:
              control.pass === 0 && control.fail === 0 && control.manual === 0,
          };
        }),
      };
    }),
  );
};
```

--------------------------------------------------------------------------------

---[FILE: threatscore-calculator.ts]---
Location: prowler-master/ui/lib/compliance/threatscore-calculator.ts

```typescript
import { AttributesData, RequirementsData } from "@/types/compliance";

export interface ThreatScoreResult {
  score: number;
}

/**
 * Calculates the ThreatScore for a given provider's compliance data.
 * This function replicates the calculation logic from the server-side getThreatScore
 * but operates on already-fetched attribute and requirement data.
 *
 * @param attributesData - Compliance attributes containing metadata like Weight and LevelOfRisk
 * @param requirementsData - Compliance requirements containing passed and total findings
 * @returns The calculated ThreatScore or null if calculation fails
 */
export function calculateThreatScore(
  attributesData: AttributesData | undefined,
  requirementsData: RequirementsData | undefined,
): ThreatScoreResult | null {
  if (!attributesData?.data || !requirementsData?.data) {
    return null;
  }

  // Create requirements map for fast lookup
  const requirementsMap = new Map();
  for (const req of requirementsData.data) {
    requirementsMap.set(req.id, req);
  }

  // Calculate ThreatScore using the same formula as the server-side version
  let numerator = 0;
  let denominator = 0;
  let hasFindings = false;

  for (const attributeItem of attributesData.data) {
    const id = attributeItem.id;
    const metadataArray = attributeItem.attributes?.attributes
      ?.metadata as any[];
    const attrs = metadataArray?.[0];
    if (!attrs) continue;

    const requirementData = requirementsMap.get(id);
    if (!requirementData) continue;

    const pass_i = requirementData.attributes.passed_findings || 0;
    const total_i = requirementData.attributes.total_findings || 0;

    if (total_i === 0) continue;

    hasFindings = true;
    const rate_i = pass_i / total_i;
    const weight_i = attrs.Weight || 1;
    const levelOfRisk = attrs.LevelOfRisk || 0;
    const rfac_i = 1 + 0.25 * levelOfRisk;

    numerator += rate_i * total_i * weight_i * rfac_i;
    denominator += total_i * weight_i * rfac_i;
  }

  const score = !hasFindings
    ? 100
    : denominator > 0
      ? (numerator / denominator) * 100
      : 0;

  return {
    score: Math.round(score * 100) / 100,
  };
}
```

--------------------------------------------------------------------------------

````
