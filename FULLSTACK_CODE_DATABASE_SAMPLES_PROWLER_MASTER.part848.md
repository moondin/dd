---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 848
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 848 of 867)

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

---[FILE: ccc.tsx]---
Location: prowler-master/ui/lib/compliance/ccc.tsx

```typescript
import { ClientAccordionContent } from "@/components/compliance/compliance-accordion/client-accordion-content";
import { ComplianceAccordionRequirementTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-requeriment-title";
import { ComplianceAccordionTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-title";
import { AccordionItemProps } from "@/components/ui/accordion/Accordion";
import { FindingStatus } from "@/components/ui/table/status-finding-badge";
import {
  AttributesData,
  CCCAttributesMetadata,
  Framework,
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
  attrs: CCCAttributesMetadata;
  attributeItem: any;
  requirementData: any;
}

// CCC-specific section configuration
export interface CCCTextSection {
  title: string;
  key: keyof Requirement;
  className?: string;
}

export interface CCCMappingSection {
  title: string;
  key: keyof Requirement;
  colorClasses: string;
}

export const CCC_TEXT_SECTIONS: CCCTextSection[] = [
  {
    title: "Description",
    key: "description",
  },
  {
    title: "Family Description",
    key: "family_description",
  },
  {
    title: "SubSection",
    key: "subsection",
  },
  {
    title: "SubSection Objective",
    key: "subsection_objective",
    className: "whitespace-pre-wrap",
  },
  {
    title: "Recommendation",
    key: "recommendation",
    className: "whitespace-pre-wrap",
  },
];

export const CCC_MAPPING_SECTIONS: CCCMappingSection[] = [
  {
    title: "Threat Mappings",
    key: "section_threat_mappings",
    colorClasses:
      "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20",
  },
  {
    title: "Guideline Mappings",
    key: "section_guideline_mappings",
    colorClasses:
      "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
  },
];

const createRequirement = (itemData: ProcessedItem): Requirement => {
  const { id, attrs, attributeItem, requirementData } = itemData;
  const description = attributeItem.attributes.description;
  const status = requirementData.attributes.status || "";
  const checks = attributeItem.attributes.attributes.check_ids || [];
  const finalStatus: RequirementStatus = status as RequirementStatus;

  return {
    name: id,
    description: description,
    status: finalStatus,
    check_ids: checks,
    pass: finalStatus === REQUIREMENT_STATUS.PASS ? 1 : 0,
    fail: finalStatus === REQUIREMENT_STATUS.FAIL ? 1 : 0,
    manual: finalStatus === REQUIREMENT_STATUS.MANUAL ? 1 : 0,
    family_name: attrs.FamilyName,
    family_description: attrs.FamilyDescription,
    subsection: attrs.SubSection,
    subsection_objective: attrs.SubSectionObjective,
    applicability: attrs.Applicability,
    recommendation: attrs.Recommendation,
    section_threat_mappings: attrs.SectionThreatMappings,
    section_guideline_mappings: attrs.SectionGuidelineMappings,
  };
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
      ?.metadata as unknown as CCCAttributesMetadata[];
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

    // Group by FamilyName (Category) -> Section (Control) -> Requirements
    for (const itemData of items) {
      const requirement = createRequirement(itemData);
      const familyName = itemData.attrs.FamilyName;
      const sectionName = itemData.attrs.Section;

      // Create 3-level hierarchy: FamilyName -> Section -> Requirements
      const category = findOrCreateCategory(framework.categories, familyName);
      const control = findOrCreateControl(category.controls, sectionName);

      control.requirements.push(requirement);
      updateCounters(control, requirement.status);
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
  return data.flatMap((framework) =>
    framework.categories.map((category) => ({
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
      }),
    })),
  );
};
```

--------------------------------------------------------------------------------

---[FILE: cis.tsx]---
Location: prowler-master/ui/lib/compliance/cis.tsx

```typescript
import { ClientAccordionContent } from "@/components/compliance/compliance-accordion/client-accordion-content";
import { ComplianceAccordionRequirementTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-requeriment-title";
import { ComplianceAccordionTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-title";
import { AccordionItemProps } from "@/components/ui/accordion/Accordion";
import { FindingStatus } from "@/components/ui/table/status-finding-badge";
import {
  AttributesData,
  CISAttributesMetadata,
  Framework,
  Requirement,
  REQUIREMENT_STATUS,
  RequirementsData,
  RequirementStatus,
} from "@/types/compliance";

import {
  calculateFrameworkCounters,
  createRequirementsMap,
  findOrCreateCategory,
  findOrCreateFramework,
  updateCounters,
} from "./commons";

export const mapComplianceData = (
  attributesData: AttributesData,
  requirementsData: RequirementsData,
  filter?: string, // "Level 1" or "Level 2" or undefined (show all)
): Framework[] => {
  const attributes = attributesData?.data || [];
  const requirementsMap = createRequirementsMap(requirementsData);
  const frameworks: Framework[] = [];

  // Process attributes and merge with requirements data
  for (const attributeItem of attributes) {
    const id = attributeItem.id;
    const metadataArray = attributeItem.attributes?.attributes
      ?.metadata as unknown as CISAttributesMetadata[];
    const attrs = metadataArray?.[0];
    if (!attrs) continue;

    // Apply profile filter
    if (filter === "Level 1" && attrs.Profile !== "Level 1") {
      continue; // Skip Level 2 requirements when Level 1 is selected
    }

    // Get corresponding requirement data
    const requirementData = requirementsMap.get(id);
    if (!requirementData) continue;

    const frameworkName = attributeItem.attributes.framework;
    const sectionName = attrs.Section;
    const description = attributeItem.attributes.description;
    const status = requirementData.attributes.status || "";
    const checks = attributeItem.attributes.attributes.check_ids || [];
    const requirementName = id;

    // Find or create framework using common helper
    const framework = findOrCreateFramework(frameworks, frameworkName);

    const normalizedSectionName = sectionName.replace(/^(\d+)\s/, "$1. ");
    const category = findOrCreateCategory(
      framework.categories,
      normalizedSectionName,
    );

    // Create a control for this requirement (each requirement is its own control)
    const controlLabel = `${id} - ${description}`;
    const control = {
      label: controlLabel,
      pass: 0,
      fail: 0,
      manual: 0,
      requirements: [] as Requirement[],
    };

    // Create requirement
    const finalStatus: RequirementStatus = status as RequirementStatus;
    const requirement: Requirement = {
      name: requirementName,
      description: attrs.Description,
      status: finalStatus,
      check_ids: checks,
      pass: finalStatus === REQUIREMENT_STATUS.PASS ? 1 : 0,
      fail: finalStatus === REQUIREMENT_STATUS.FAIL ? 1 : 0,
      manual: finalStatus === REQUIREMENT_STATUS.MANUAL ? 1 : 0,
      profile: attrs.Profile,
      subsection: attrs.SubSection || "",
      assessment_status: attrs.AssessmentStatus,
      rationale_statement: attrs.RationaleStatement,
      impact_statement: attrs.ImpactStatement,
      remediation_procedure: attrs.RemediationProcedure,
      audit_procedure: attrs.AuditProcedure,
      additional_information: attrs.AdditionalInformation,
      default_value: attrs.DefaultValue || "",
      references: attrs.References,
    };

    control.requirements.push(requirement);

    // Update control counters using common helper
    updateCounters(control, requirement.status);

    category.controls.push(control);
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
          const requirement = control.requirements[0]; // Each control has one requirement
          const itemKey = `${framework.name}-${category.name}-control-${i}`;

          return {
            key: itemKey,
            title: (
              <ComplianceAccordionRequirementTitle
                type=""
                name={control.label}
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

---[FILE: commons.tsx]---
Location: prowler-master/ui/lib/compliance/commons.tsx

```typescript
import {
  Category,
  CategoryData,
  Control,
  FailedSection,
  Framework,
  REQUIREMENT_STATUS,
  RequirementItemData,
  RequirementsData,
  RequirementStatus,
  TOP_FAILED_DATA_TYPE,
  TopFailedDataType,
  TopFailedResult,
} from "@/types/compliance";

// Type for the internal map used in getTopFailedSections
interface FailedSectionData {
  total: number;
  types: Record<string, number>;
}

/**
 * Builds the TopFailedResult from the accumulated map data
 */
const buildTopFailedResult = (
  map: Map<string, FailedSectionData>,
  type: TopFailedDataType,
): TopFailedResult => ({
  items: Array.from(map.entries())
    .map(([name, data]): FailedSection => ({ name, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5),
  type,
});

/**
 * Checks if the framework uses a flat structure (requirements directly on framework)
 * vs hierarchical structure (categories -> controls -> requirements)
 */
const hasFlatStructure = (frameworks: Framework[]): boolean =>
  frameworks.some(
    (framework) =>
      (framework.requirements?.length ?? 0) > 0 &&
      framework.categories.length === 0,
  );

/**
 * Increments the failed count for a given name in the map
 */
const incrementFailedCount = (
  map: Map<string, FailedSectionData>,
  name: string,
  type: string,
): void => {
  if (!map.has(name)) {
    map.set(name, { total: 0, types: {} });
  }
  const data = map.get(name)!;
  data.total += 1;
  data.types[type] = (data.types[type] || 0) + 1;
};

export const updateCounters = (
  target: { pass: number; fail: number; manual: number },
  status: RequirementStatus,
) => {
  if (status === REQUIREMENT_STATUS.MANUAL) {
    target.manual++;
  } else if (status === REQUIREMENT_STATUS.PASS) {
    target.pass++;
  } else if (status === REQUIREMENT_STATUS.FAIL) {
    target.fail++;
  }
};

export const getTopFailedSections = (
  mappedData: Framework[],
): TopFailedResult => {
  const failedSectionMap = new Map<string, FailedSectionData>();

  if (hasFlatStructure(mappedData)) {
    // Handle flat structure: count failed requirements directly
    mappedData.forEach((framework) => {
      const directRequirements = framework.requirements ?? [];

      directRequirements.forEach((requirement) => {
        if (requirement.status === REQUIREMENT_STATUS.FAIL) {
          const type =
            typeof requirement.type === "string" ? requirement.type : "Fails";
          incrementFailedCount(failedSectionMap, requirement.name, type);
        }
      });
    });

    return buildTopFailedResult(
      failedSectionMap,
      TOP_FAILED_DATA_TYPE.REQUIREMENTS,
    );
  }

  // Handle hierarchical structure: count by category (section)
  mappedData.forEach((framework) => {
    framework.categories.forEach((category) => {
      category.controls.forEach((control) => {
        control.requirements.forEach((requirement) => {
          if (requirement.status === REQUIREMENT_STATUS.FAIL) {
            const type =
              typeof requirement.type === "string" ? requirement.type : "Fails";
            incrementFailedCount(failedSectionMap, category.name, type);
          }
        });
      });
    });
  });

  return buildTopFailedResult(failedSectionMap, TOP_FAILED_DATA_TYPE.SECTIONS);
};

export const calculateCategoryHeatmapData = (
  complianceData: Framework[],
): CategoryData[] => {
  if (!complianceData?.length) {
    return [];
  }

  try {
    const categoryMap = new Map<
      string,
      { pass: number; fail: number; manual: number }
    >();

    // Aggregate data by category
    complianceData.forEach((framework) => {
      framework.categories.forEach((category) => {
        const existing = categoryMap.get(category.name) || {
          pass: 0,
          fail: 0,
          manual: 0,
        };
        categoryMap.set(category.name, {
          pass: existing.pass + category.pass,
          fail: existing.fail + category.fail,
          manual: existing.manual + category.manual,
        });
      });
    });

    const categoryData: CategoryData[] = Array.from(categoryMap.entries()).map(
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
      .slice(0, 9); // Show top 9 categories

    return filteredData;
  } catch (error) {
    console.error("Error calculating category heatmap data:", error);
    return [];
  }
};

export const createRequirementsMap = (
  requirementsData: RequirementsData,
): Map<string, RequirementItemData> => {
  const requirementsMap = new Map<string, RequirementItemData>();
  const requirements = requirementsData?.data || [];
  requirements.forEach((req: RequirementItemData) => {
    requirementsMap.set(req.id, req);
  });
  return requirementsMap;
};

export const findOrCreateFramework = (
  frameworks: Framework[],
  frameworkName: string,
): Framework => {
  let framework = frameworks.find((f) => f.name === frameworkName);
  if (!framework) {
    framework = {
      name: frameworkName,
      pass: 0,
      fail: 0,
      manual: 0,
      categories: [],
    };
    frameworks.push(framework);
  }
  return framework;
};

export const findOrCreateCategory = (
  categories: Category[],
  categoryName: string,
): Category => {
  let category = categories.find((c) => c.name === categoryName);
  if (!category) {
    category = {
      name: categoryName,
      pass: 0,
      fail: 0,
      manual: 0,
      controls: [],
    };
    categories.push(category);
  }
  return category;
};

export const findOrCreateControl = (
  controls: Control[],
  controlLabel: string,
): Control => {
  let control = controls.find((c) => c.label === controlLabel);
  if (!control) {
    control = {
      label: controlLabel,
      pass: 0,
      fail: 0,
      manual: 0,
      requirements: [],
    };
    controls.push(control);
  }
  return control;
};

export const calculateFrameworkCounters = (frameworks: Framework[]): void => {
  frameworks.forEach((framework) => {
    // Reset framework counters
    framework.pass = 0;
    framework.fail = 0;
    framework.manual = 0;

    // Handle flat structure (requirements directly in framework)
    const directRequirements = framework.requirements ?? [];
    if (directRequirements.length > 0) {
      directRequirements.forEach((requirement) => {
        updateCounters(framework, requirement.status);
      });
      return;
    }

    // Handle hierarchical structure (categories -> controls -> requirements)
    framework.categories.forEach((category) => {
      category.pass = 0;
      category.fail = 0;
      category.manual = 0;

      category.controls.forEach((control) => {
        control.pass = 0;
        control.fail = 0;
        control.manual = 0;

        control.requirements.forEach((requirement) => {
          updateCounters(control, requirement.status);
        });

        category.pass += control.pass;
        category.fail += control.fail;
        category.manual += control.manual;
      });

      framework.pass += category.pass;
      framework.fail += category.fail;
      framework.manual += category.manual;
    });
  });
};
```

--------------------------------------------------------------------------------

---[FILE: compliance-mapper.ts]---
Location: prowler-master/ui/lib/compliance/compliance-mapper.ts
Signals: React

```typescript
import { createElement, ReactNode } from "react";

import { AWSWellArchitectedCustomDetails } from "@/components/compliance/compliance-custom-details/aws-well-architected-details";
import { C5CustomDetails } from "@/components/compliance/compliance-custom-details/c5-details";
import { CCCCustomDetails } from "@/components/compliance/compliance-custom-details/ccc-details";
import { CISCustomDetails } from "@/components/compliance/compliance-custom-details/cis-details";
import { ENSCustomDetails } from "@/components/compliance/compliance-custom-details/ens-details";
import { GenericCustomDetails } from "@/components/compliance/compliance-custom-details/generic-details";
import { ISOCustomDetails } from "@/components/compliance/compliance-custom-details/iso-details";
import { KISACustomDetails } from "@/components/compliance/compliance-custom-details/kisa-details";
import { MITRECustomDetails } from "@/components/compliance/compliance-custom-details/mitre-details";
import { ThreatCustomDetails } from "@/components/compliance/compliance-custom-details/threat-details";
import { AccordionItemProps } from "@/components/ui/accordion/Accordion";
import {
  AttributesData,
  CategoryData,
  Framework,
  Requirement,
  RequirementsData,
  TopFailedResult,
} from "@/types/compliance";

import {
  mapComplianceData as mapAWSWellArchitectedComplianceData,
  toAccordionItems as toAWSWellArchitectedAccordionItems,
} from "./aws-well-architected";
import {
  mapComplianceData as mapC5ComplianceData,
  toAccordionItems as toC5AccordionItems,
} from "./c5";
import {
  mapComplianceData as mapCCCComplianceData,
  toAccordionItems as toCCCAccordionItems,
} from "./ccc";
import {
  mapComplianceData as mapCISComplianceData,
  toAccordionItems as toCISAccordionItems,
} from "./cis";
import { calculateCategoryHeatmapData, getTopFailedSections } from "./commons";
import {
  mapComplianceData as mapENSComplianceData,
  toAccordionItems as toENSAccordionItems,
} from "./ens";
import {
  mapComplianceData as mapGenericComplianceData,
  toAccordionItems as toGenericAccordionItems,
} from "./generic";
import {
  mapComplianceData as mapISOComplianceData,
  toAccordionItems as toISOAccordionItems,
} from "./iso";
import {
  mapComplianceData as mapKISAComplianceData,
  toAccordionItems as toKISAAccordionItems,
} from "./kisa";
import {
  calculateCategoryHeatmapData as calculateMITRECategoryHeatmapData,
  getTopFailedSections as getMITRETopFailedSections,
  mapComplianceData as mapMITREComplianceData,
  toAccordionItems as toMITREAccordionItems,
} from "./mitre";
import {
  mapComplianceData as mapThetaComplianceData,
  toAccordionItems as toThetaAccordionItems,
} from "./threat";

export interface ComplianceMapper {
  mapComplianceData: (
    attributesData: AttributesData,
    requirementsData: RequirementsData,
    filter?: string,
  ) => Framework[];
  toAccordionItems: (
    data: Framework[],
    scanId: string | undefined,
  ) => AccordionItemProps[];
  getTopFailedSections: (mappedData: Framework[]) => TopFailedResult;
  calculateCategoryHeatmapData: (complianceData: Framework[]) => CategoryData[];
  getDetailsComponent: (requirement: Requirement) => ReactNode;
}

const getDefaultMapper = (): ComplianceMapper => ({
  mapComplianceData: mapGenericComplianceData,
  toAccordionItems: toGenericAccordionItems,
  getTopFailedSections,
  calculateCategoryHeatmapData: (data: Framework[]) =>
    calculateCategoryHeatmapData(data),
  getDetailsComponent: (requirement: Requirement) =>
    createElement(GenericCustomDetails, { requirement }),
});

const getComplianceMappers = (): Record<string, ComplianceMapper> => ({
  C5: {
    mapComplianceData: mapC5ComplianceData,
    toAccordionItems: toC5AccordionItems,
    getTopFailedSections,
    calculateCategoryHeatmapData: (data: Framework[]) =>
      calculateCategoryHeatmapData(data),
    getDetailsComponent: (requirement: Requirement) =>
      createElement(C5CustomDetails, { requirement }),
  },
  ENS: {
    mapComplianceData: mapENSComplianceData,
    toAccordionItems: toENSAccordionItems,
    getTopFailedSections,
    calculateCategoryHeatmapData: (data: Framework[]) =>
      calculateCategoryHeatmapData(data),
    getDetailsComponent: (requirement: Requirement) =>
      createElement(ENSCustomDetails, { requirement }),
  },
  ISO27001: {
    mapComplianceData: mapISOComplianceData,
    toAccordionItems: toISOAccordionItems,
    getTopFailedSections,
    calculateCategoryHeatmapData: (data: Framework[]) =>
      calculateCategoryHeatmapData(data),
    getDetailsComponent: (requirement: Requirement) =>
      createElement(ISOCustomDetails, { requirement }),
  },
  CIS: {
    mapComplianceData: mapCISComplianceData,
    toAccordionItems: toCISAccordionItems,
    getTopFailedSections,
    calculateCategoryHeatmapData: (data: Framework[]) =>
      calculateCategoryHeatmapData(data),
    getDetailsComponent: (requirement: Requirement) =>
      createElement(CISCustomDetails, { requirement }),
  },
  "AWS-Well-Architected-Framework-Security-Pillar": {
    mapComplianceData: mapAWSWellArchitectedComplianceData,
    toAccordionItems: toAWSWellArchitectedAccordionItems,
    getTopFailedSections,
    calculateCategoryHeatmapData: (data: Framework[]) =>
      calculateCategoryHeatmapData(data),
    getDetailsComponent: (requirement: Requirement) =>
      createElement(AWSWellArchitectedCustomDetails, { requirement }),
  },
  "AWS-Well-Architected-Framework-Reliability-Pillar": {
    mapComplianceData: mapAWSWellArchitectedComplianceData,
    toAccordionItems: toAWSWellArchitectedAccordionItems,
    getTopFailedSections,
    calculateCategoryHeatmapData: (data: Framework[]) =>
      calculateCategoryHeatmapData(data),
    getDetailsComponent: (requirement: Requirement) =>
      createElement(AWSWellArchitectedCustomDetails, { requirement }),
  },
  "KISA-ISMS-P": {
    mapComplianceData: mapKISAComplianceData,
    toAccordionItems: toKISAAccordionItems,
    getTopFailedSections,
    calculateCategoryHeatmapData: (data: Framework[]) =>
      calculateCategoryHeatmapData(data),
    getDetailsComponent: (requirement: Requirement) =>
      createElement(KISACustomDetails, { requirement }),
  },
  "MITRE-ATTACK": {
    mapComplianceData: mapMITREComplianceData,
    toAccordionItems: toMITREAccordionItems,
    getTopFailedSections: getMITRETopFailedSections,
    calculateCategoryHeatmapData: calculateMITRECategoryHeatmapData,
    getDetailsComponent: (requirement: Requirement) =>
      createElement(MITRECustomDetails, { requirement }),
  },
  ProwlerThreatScore: {
    mapComplianceData: mapThetaComplianceData,
    toAccordionItems: toThetaAccordionItems,
    getTopFailedSections,
    calculateCategoryHeatmapData: (complianceData: Framework[]) =>
      calculateCategoryHeatmapData(complianceData),
    getDetailsComponent: (requirement: Requirement) =>
      createElement(ThreatCustomDetails, { requirement }),
  },
  CCC: {
    mapComplianceData: mapCCCComplianceData,
    toAccordionItems: toCCCAccordionItems,
    getTopFailedSections,
    calculateCategoryHeatmapData: (data: Framework[]) =>
      calculateCategoryHeatmapData(data),
    getDetailsComponent: (requirement: Requirement) =>
      createElement(CCCCustomDetails, { requirement }),
  },
});

/**
 * Get the appropriate compliance mapper based on the framework name
 * @param framework - The framework name (e.g., "ENS", "ISO27001", "CIS")
 * @returns ComplianceMapper object with specific functions for the framework
 */
export const getComplianceMapper = (framework?: string): ComplianceMapper => {
  if (!framework) {
    return getDefaultMapper();
  }

  const complianceMappers = getComplianceMappers();
  return complianceMappers[framework] || getDefaultMapper();
};
```

--------------------------------------------------------------------------------

---[FILE: compliance-report-types.ts]---
Location: prowler-master/ui/lib/compliance/compliance-report-types.ts

```typescript
/**
 * Compliance Report Type Constants
 *
 * This file defines the available compliance report types and their metadata.
 * When adding new compliance PDF reports, add entries here to maintain consistency.
 */

/**
 * Available compliance report types
 * Add new report types here as they become available
 */
export const COMPLIANCE_REPORT_TYPES = {
  THREATSCORE: "threatscore",
  ENS: "ens",
  NIS2: "nis2",
  // Future report types can be added here:
  // CIS: "cis",
  // NIST: "nist",
} as const;

/**
 * Type-safe report type extracted from COMPLIANCE_REPORT_TYPES
 */
export type ComplianceReportType =
  (typeof COMPLIANCE_REPORT_TYPES)[keyof typeof COMPLIANCE_REPORT_TYPES];

/**
 * Display names for each report type (user-facing)
 */
export const COMPLIANCE_REPORT_DISPLAY_NAMES: Record<
  ComplianceReportType,
  string
> = {
  [COMPLIANCE_REPORT_TYPES.THREATSCORE]: "ThreatScore",
  [COMPLIANCE_REPORT_TYPES.ENS]: "ENS RD2022",
  [COMPLIANCE_REPORT_TYPES.NIS2]: "NIS2",
  // Add display names for future report types here
};

/**
 * Default button labels for download buttons
 */
export const COMPLIANCE_REPORT_BUTTON_LABELS: Record<
  ComplianceReportType,
  string
> = {
  [COMPLIANCE_REPORT_TYPES.THREATSCORE]: "PDF ThreatScore Report",
  [COMPLIANCE_REPORT_TYPES.ENS]: "PDF ENS Report",
  [COMPLIANCE_REPORT_TYPES.NIS2]: "PDF NIS2 Report",
  // Add button labels for future report types here
};

/**
 * Maps compliance framework names (from API) to their report types
 * This mapping determines which frameworks support PDF reporting
 */
const FRAMEWORK_TO_REPORT_TYPE: Record<string, ComplianceReportType> = {
  ProwlerThreatScore: COMPLIANCE_REPORT_TYPES.THREATSCORE,
  ENS: COMPLIANCE_REPORT_TYPES.ENS,
  NIS2: COMPLIANCE_REPORT_TYPES.NIS2,
  // Add new framework mappings here as PDF support is added:
  // "CIS-1.5": COMPLIANCE_REPORT_TYPES.CIS,
  // "NIST-800-53": COMPLIANCE_REPORT_TYPES.NIST,
};

/**
 * Helper function to get report type from framework name
 * Returns undefined if framework doesn't support PDF reporting
 */
export const getReportTypeForFramework = (
  framework: string | undefined,
): ComplianceReportType | undefined => {
  if (!framework) return undefined;
  return FRAMEWORK_TO_REPORT_TYPE[framework];
};
```

--------------------------------------------------------------------------------

---[FILE: ens.tsx]---
Location: prowler-master/ui/lib/compliance/ens.tsx

```typescript
import { ClientAccordionContent } from "@/components/compliance/compliance-accordion/client-accordion-content";
import { ComplianceAccordionRequirementTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-requeriment-title";
import { ComplianceAccordionTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-title";
import { AccordionItemProps } from "@/components/ui/accordion/Accordion";
import { FindingStatus } from "@/components/ui/table/status-finding-badge";
import {
  AttributesData,
  ENSAttributesMetadata,
  Framework,
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

export const translateType = (type: string) => {
  if (!type) {
    return "";
  }

  switch (type.toLowerCase()) {
    case "requisito":
      return "Requirement";
    case "recomendacion":
      return "Recommendation";
    case "refuerzo":
      return "Reinforcement";
    case "medida":
      return "Measure";
    default:
      return type;
  }
};

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
    const attrs = attributeItem.attributes?.attributes
      ?.metadata?.[0] as ENSAttributesMetadata;

    if (!attrs) continue;

    // Get corresponding requirement data
    const requirementData = requirementsMap.get(id);
    if (!requirementData) continue;

    const frameworkName = attrs.Marco;
    const categoryName = attrs.Categoria;
    const groupControl = attrs.IdGrupoControl;
    const type = attrs.Tipo;
    const description = attributeItem.attributes.description;
    const status = requirementData.attributes.status || "";
    const controlDescription = attrs.DescripcionControl || "";
    const checks = attributeItem.attributes.attributes.check_ids || [];
    const isManual = attrs.ModoEjecucion === "manual";
    const requirementName = id;
    const groupControlLabel = `${groupControl} - ${description}`;

    // Find or create framework using common helper
    const framework = findOrCreateFramework(frameworks, frameworkName);

    // Find or create category using common helper
    const category = findOrCreateCategory(framework.categories, categoryName);

    // Find or create control using common helper
    const control = findOrCreateControl(category.controls, groupControlLabel);

    // Create requirement
    const finalStatus: RequirementStatus = isManual
      ? REQUIREMENT_STATUS.MANUAL
      : (status as RequirementStatus);
    const requirement: Requirement = {
      name: requirementName,
      description: controlDescription,
      status: finalStatus,
      type,
      check_ids: checks,
      pass: finalStatus === REQUIREMENT_STATUS.PASS ? 1 : 0,
      fail: finalStatus === REQUIREMENT_STATUS.FAIL ? 1 : 0,
      manual: finalStatus === REQUIREMENT_STATUS.MANUAL ? 1 : 0,
      nivel: attrs.Nivel || "",
      dimensiones: attrs.Dimensiones || [],
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
  return data.map((framework) => {
    return {
      key: framework.name,
      title: (
        <ComplianceAccordionTitle
          label={framework.name}
          pass={framework.pass}
          fail={framework.fail}
          manual={framework.manual}
          isParentLevel={true}
        />
      ),
      content: "",
      items: framework.categories.map((category) => {
        return {
          key: `${framework.name}-${category.name}`,
          title: (
            <ComplianceAccordionTitle
              label={category.name}
              pass={category.pass}
              fail={category.fail}
              manual={category.manual}
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
                      type={requirement.type as string}
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
                        requirement.check_ids.length === 0 &&
                        requirement.manual === 0
                      }
                    />
                  ),
                };
              }),
              isDisabled:
                control.pass === 0 &&
                control.fail === 0 &&
                control.manual === 0,
            };
          }),
        };
      }),
    };
  });
};
```

--------------------------------------------------------------------------------

````
