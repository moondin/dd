---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 858
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 858 of 867)

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

---[FILE: authFormSchema.ts]---
Location: prowler-master/ui/types/authFormSchema.ts
Signals: Zod

```typescript
import { z } from "zod";

import { SPECIAL_CHARACTERS } from "@/lib/utils";

export type AuthSocialProvider = "google" | "github";

export const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  specialChars: SPECIAL_CHARACTERS,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
} as const;

export const passwordRequirementCheckers = {
  minLength: (password: string) =>
    password.length >= PASSWORD_REQUIREMENTS.minLength,
  specialChars: (password: string) =>
    PASSWORD_REQUIREMENTS.specialChars
      .split("")
      .some((char) => password.includes(char)),
  uppercase: (password: string) => /[A-Z]/.test(password),
  lowercase: (password: string) => /[a-z]/.test(password),
  numbers: (password: string) => /[0-9]/.test(password),
};

export const validatePassword = () => {
  const {
    minLength,
    specialChars,
    requireUppercase,
    requireLowercase,
    requireNumbers,
  } = PASSWORD_REQUIREMENTS;

  return z
    .string()
    .min(minLength, {
      message: `Password must contain at least ${minLength} characters.`,
    })
    .refine(passwordRequirementCheckers.specialChars, {
      message: `Password must contain at least one special character from: ${specialChars}`,
    })
    .refine(
      (password) =>
        !requireUppercase || passwordRequirementCheckers.uppercase(password),
      {
        message: "Password must contain at least one uppercase letter.",
      },
    )
    .refine(
      (password) =>
        !requireLowercase || passwordRequirementCheckers.lowercase(password),
      {
        message: "Password must contain at least one lowercase letter.",
      },
    )
    .refine(
      (password) =>
        !requireNumbers || passwordRequirementCheckers.numbers(password),
      {
        message: "Password must contain at least one number.",
      },
    );
};

const baseAuthSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email address." })
    .trim()
    .toLowerCase(),
  password: z.string(),
  isSamlMode: z.boolean().optional(),
});

export const signInSchema = baseAuthSchema
  .extend({
    password: z.string(),
  })
  .refine(
    (data) => {
      // If SAML mode, password is not required
      if (data.isSamlMode) return true;
      // Otherwise, password must be filled
      return data.password.length > 0;
    },
    {
      message: "Password is required.",
      path: ["password"],
    },
  );

export const signUpSchema = baseAuthSchema
  .extend({
    name: z
      .string()
      .min(3, {
        message: "The name must be at least 3 characters.",
      })
      .max(20),
    password: validatePassword(),
    confirmPassword: z.string().min(1, {
      message: "Please confirm your password.",
    }),
    company: z.string().optional(),
    invitationToken: z.string().optional(),
    termsAndConditions:
      process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true"
        ? z.boolean().refine((value) => value === true, {
            message: "You must accept the terms and conditions.",
          })
        : z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.isSamlMode) return true;
      return data.password === data.confirmPassword;
    },
    {
      message: "The password must match",
      path: ["confirmPassword"],
    },
  );

export const authFormSchema = (type: string) =>
  type === "sign-in" ? signInSchema : signUpSchema;

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
```

--------------------------------------------------------------------------------

---[FILE: compliance.ts]---
Location: prowler-master/ui/types/compliance.ts

```typescript
export const REQUIREMENT_STATUS = {
  PASS: "PASS",
  FAIL: "FAIL",
  MANUAL: "MANUAL",
  NO_FINDINGS: "No findings",
} as const;

export type RequirementStatus =
  (typeof REQUIREMENT_STATUS)[keyof typeof REQUIREMENT_STATUS];

export const COMPLIANCE_OVERVIEW_TYPE = {
  OVERVIEW: "compliance-overviews",
  REQUIREMENTS_STATUS: "compliance-requirements-status",
} as const;

export type ComplianceOverviewType =
  (typeof COMPLIANCE_OVERVIEW_TYPE)[keyof typeof COMPLIANCE_OVERVIEW_TYPE];

export interface CompliancesOverview {
  data: ComplianceOverviewData[];
}

export interface ComplianceOverviewData {
  type: ComplianceOverviewType;
  id: string;
  attributes: {
    framework: string;
    version: string;
    requirements_passed: number;
    requirements_failed: number;
    requirements_manual: number;
    total_requirements: number;
  };
}

export interface Requirement {
  name: string;
  description: string;
  status: RequirementStatus;
  pass: number;
  fail: number;
  manual: number;
  check_ids: string[];
  // This is to allow any key to be added to the requirement object
  // because each compliance has different keys
  [key: string]: string | string[] | number | boolean | object[] | undefined;
}

export interface Control {
  label: string;
  pass: number;
  fail: number;
  manual: number;
  requirements: Requirement[];
}

export interface Category {
  name: string;
  pass: number;
  fail: number;
  manual: number;
  controls: Control[];
}

export interface Framework {
  name: string;
  pass: number;
  fail: number;
  manual: number;
  categories: Category[];
  // Optional: flat structure for frameworks like MITRE that don't have categories
  requirements?: Requirement[];
}

export interface FailedSection {
  name: string;
  total: number;
  types?: Record<string, number>;
}

export const TOP_FAILED_DATA_TYPE = {
  SECTIONS: "sections",
  REQUIREMENTS: "requirements",
} as const;

export type TopFailedDataType =
  (typeof TOP_FAILED_DATA_TYPE)[keyof typeof TOP_FAILED_DATA_TYPE];

export interface TopFailedResult {
  items: FailedSection[];
  type: TopFailedDataType;
}

export interface RequirementsTotals {
  pass: number;
  fail: number;
  manual: number;
}

// API Responses types:
export interface ENSAttributesMetadata {
  IdGrupoControl: string;
  Marco: string;
  Categoria: string;
  DescripcionControl: string;
  Tipo: string;
  Nivel: string;
  Dimensiones: string[];
  ModoEjecucion: string;
  Dependencias: unknown[];
}

export interface ISO27001AttributesMetadata {
  Category: string;
  Objetive_ID: string;
  Objetive_Name: string;
  Check_Summary: string;
}

export interface CISAttributesMetadata {
  Section: string;
  SubSection: string | null;
  Profile: string; // "Level 1" or "Level 2"
  AssessmentStatus: string; // "Manual" or "Automated"
  Description: string;
  RationaleStatement: string;
  ImpactStatement: string;
  RemediationProcedure: string;
  AuditProcedure: string;
  AdditionalInformation: string;
  DefaultValue: string | null;
  References: string;
}

export interface AWSWellArchitectedAttributesMetadata {
  Name: string;
  WellArchitectedQuestionId: string;
  WellArchitectedPracticeId: string;
  Section: string;
  SubSection: string;
  LevelOfRisk: string;
  AssessmentMethod: string;
  Description: string;
  ImplementationGuidanceUrl: string;
}

export interface ThreatAttributesMetadata {
  Title: string;
  Section: string;
  SubSection: string;
  AttributeDescription: string;
  AdditionalInformation: string;
  LevelOfRisk: number;
  Weight: number;
}

export interface KISAAttributesMetadata {
  Domain: string;
  Subdomain: string;
  Section: string;
  AuditChecklist: string[];
  RelatedRegulations: string[];
  AuditEvidence: string[];
  NonComplianceCases: string[];
}

export interface C5AttributesMetadata {
  Section: string;
  SubSection: string;
  Type: string;
  AboutCriteria: string;
  ComplementaryCriteria: string;
}

export interface MITREAttributesMetadata {
  // Dynamic cloud service field - could be AWSService, GCPService, AzureService, etc.
  [key: string]: string;
  Category: string; // "Protect", "Detect", "Respond"
  Value: string; // "Minimal", "Partial", "Significant"
  Comment: string;
}

export interface GenericAttributesMetadata {
  ItemId: string;
  Section: string;
  SubSection: string;
  SubGroup: string | null;
  Service: string | null;
  Type: string | null;
}

export interface CCCAttributesMetadata {
  FamilyName: string;
  FamilyDescription: string;
  Section: string;
  SubSection: string;
  SubSectionObjective: string;
  Applicability: string[];
  Recommendation: string;
  SectionThreatMappings: Array<{
    ReferenceId: string;
    Identifiers: string[];
  }>;
  SectionGuidelineMappings: Array<{
    ReferenceId: string;
    Identifiers: string[];
  }>;
}

export interface AttributesItemData {
  type: "compliance-requirements-attributes";
  id: string;
  attributes: {
    framework_description: string;
    name?: string;
    framework: string;
    version: string;
    description: string;
    attributes: {
      metadata:
        | ENSAttributesMetadata[]
        | ISO27001AttributesMetadata[]
        | CISAttributesMetadata[]
        | AWSWellArchitectedAttributesMetadata[]
        | ThreatAttributesMetadata[]
        | KISAAttributesMetadata[]
        | C5AttributesMetadata[]
        | MITREAttributesMetadata[]
        | CCCAttributesMetadata[]
        | GenericAttributesMetadata[];
      check_ids: string[];
      // MITRE structure
      technique_details?: {
        tactics: string[];
        subtechniques: string[];
        platforms: string[];
        technique_url: string;
      };
    };
  };
}

export interface RequirementItemData {
  type: "compliance-requirements-details";
  id: string;
  attributes: {
    framework: string;
    version: string;
    description: string;
    status: RequirementStatus;
    // For Threat compliance:
    passed_findings?: number;
    total_findings?: number;
  };
}

export interface AttributesData {
  data: AttributesItemData[];
}

export interface RequirementsData {
  data: RequirementItemData[];
}

export interface RegionData {
  name: string;
  failurePercentage: number;
  totalRequirements: number;
  failedRequirements: number;
}

export interface CategoryData {
  name: string;
  failurePercentage: number;
  totalRequirements: number;
  failedRequirements: number;
}
```

--------------------------------------------------------------------------------

---[FILE: components.ts]---
Location: prowler-master/ui/types/components.ts
Signals: React

```typescript
import { LucideIcon } from "lucide-react";
import { MouseEvent, SVGProps } from "react";

import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type IconProps = {
  icon: React.FC<IconSvgProps>;
  style?: React.CSSProperties;
};

export type IconComponent = LucideIcon | React.FC<IconSvgProps>;

export type SubmenuProps = {
  href: string;
  target?: string;
  label: string;
  active?: boolean;
  icon: IconComponent;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export type MenuProps = {
  href: string;
  label: string;
  active?: boolean;
  icon: IconComponent;
  submenus?: SubmenuProps[];
  defaultOpen?: boolean;
  target?: string;
  tooltip?: string;
};

export type GroupProps = {
  groupLabel: string;
  menus: MenuProps[];
};

export interface CollapseMenuButtonProps {
  icon: IconComponent;
  label: string;
  submenus: SubmenuProps[];
  defaultOpen: boolean;
  isOpen: boolean | undefined;
}

export type NextUIVariants =
  | "solid"
  | "faded"
  | "bordered"
  | "light"
  | "flat"
  | "ghost"
  | "shadow";

export type NextUIColors =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "default";

export interface PermissionInfo {
  field: string;
  label: string;
  description: string;
}
export interface FindingsByStatusData {
  data: {
    type: "findings-overview";
    id: string;
    attributes: {
      fail: number;
      pass: number;
      muted: number;
      total: number;
      fail_new: number;
      pass_new: number;
      muted_new: number;
      [key: string]: number;
    };
  };
  meta: {
    version: string;
  };
}
export interface ManageGroupPayload {
  data: {
    type: "provider-groups";
    id: string;
    attributes?: {
      name: string;
    };
    relationships?: {
      providers?: { data: Array<{ id: string; type: string }> };
      roles?: { data: Array<{ id: string; type: string }> };
    };
  };
}
export interface ProviderGroup {
  type: "provider-groups";
  id: string;
  attributes: {
    name: string;
    inserted_at: string;
    updated_at: string;
  };
  relationships: {
    providers: {
      meta: {
        count: number;
      };
      data: {
        type: string;
        id: string;
      }[];
    };
    roles: {
      meta: {
        count: number;
      };
      data: {
        type: string;
        id: string;
      }[];
    };
  };
  links: {
    self: string;
  };
}

export interface ProviderGroupsResponse {
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
  data: ProviderGroup[];
  meta: {
    pagination: {
      page: number;
      pages: number;
      count: number;
    };
    version: string;
  };
}

export interface FindingsSeverityOverview {
  data: {
    type: "findings-severity-overview";
    id: string;
    attributes: {
      critical: number;
      high: number;
      medium: number;
      low: number;
      informational: number;
    };
  };
  meta: {
    version: string;
  };
}

export interface TaskDetails {
  attributes: {
    state: string;
    completed_at: string;
    result: {
      exc_type?: string;
      exc_message?: string[];
      exc_module?: string;
    };
    task_args: {
      scan_id: string;
      provider_id: string;
      checks_to_execute: string[];
    };
  };
}
export type AWSCredentials = {
  [ProviderCredentialFields.AWS_ACCESS_KEY_ID]: string;
  [ProviderCredentialFields.AWS_SECRET_ACCESS_KEY]: string;
  [ProviderCredentialFields.AWS_SESSION_TOKEN]: string;
  [ProviderCredentialFields.PROVIDER_ID]: string;
};

export type AWSCredentialsRole = {
  [ProviderCredentialFields.ROLE_ARN]?: string;
  [ProviderCredentialFields.AWS_ACCESS_KEY_ID]?: string;
  [ProviderCredentialFields.AWS_SECRET_ACCESS_KEY]?: string;
  [ProviderCredentialFields.AWS_SESSION_TOKEN]?: string;
  [ProviderCredentialFields.EXTERNAL_ID]?: string;
  [ProviderCredentialFields.ROLE_SESSION_NAME]?: string;
  [ProviderCredentialFields.SESSION_DURATION]?: number;
  [ProviderCredentialFields.CREDENTIALS_TYPE]?:
    | "aws-sdk-default"
    | "access-secret-key";
};

export type AzureCredentials = {
  [ProviderCredentialFields.CLIENT_ID]: string;
  [ProviderCredentialFields.CLIENT_SECRET]: string;
  [ProviderCredentialFields.TENANT_ID]: string;
  [ProviderCredentialFields.PROVIDER_ID]: string;
};

export type M365ClientSecretCredentials = {
  [ProviderCredentialFields.CLIENT_ID]: string;
  [ProviderCredentialFields.CLIENT_SECRET]: string;
  [ProviderCredentialFields.TENANT_ID]: string;
  [ProviderCredentialFields.PROVIDER_ID]: string;
};

export type M365CertificateCredentials = {
  [ProviderCredentialFields.CLIENT_ID]: string;
  [ProviderCredentialFields.CERTIFICATE_CONTENT]: string;
  [ProviderCredentialFields.TENANT_ID]: string;
  [ProviderCredentialFields.PROVIDER_ID]: string;
};

export type M365Credentials =
  | M365ClientSecretCredentials
  | M365CertificateCredentials;

export type GCPDefaultCredentials = {
  client_id: string;
  client_secret: string;
  refresh_token: string;
  [ProviderCredentialFields.PROVIDER_ID]: string;
};

export type GCPServiceAccountKey = {
  [ProviderCredentialFields.SERVICE_ACCOUNT_KEY]: string;
  [ProviderCredentialFields.PROVIDER_ID]: string;
};

export type KubernetesCredentials = {
  [ProviderCredentialFields.KUBECONFIG_CONTENT]: string;
  [ProviderCredentialFields.PROVIDER_ID]: string;
};

export type IacCredentials = {
  [ProviderCredentialFields.REPOSITORY_URL]: string;
  [ProviderCredentialFields.ACCESS_TOKEN]?: string;
  [ProviderCredentialFields.PROVIDER_ID]: string;
};

export type OCICredentials = {
  [ProviderCredentialFields.OCI_USER]: string;
  [ProviderCredentialFields.OCI_FINGERPRINT]: string;
  [ProviderCredentialFields.OCI_KEY_CONTENT]: string;
  [ProviderCredentialFields.OCI_TENANCY]: string;
  [ProviderCredentialFields.OCI_REGION]: string;
  [ProviderCredentialFields.OCI_PASS_PHRASE]?: string;
  [ProviderCredentialFields.PROVIDER_ID]: string;
};

export type MongoDBAtlasCredentials = {
  [ProviderCredentialFields.ATLAS_PUBLIC_KEY]: string;
  [ProviderCredentialFields.ATLAS_PRIVATE_KEY]: string;
  [ProviderCredentialFields.PROVIDER_ID]: string;
};

export type CredentialsFormSchema =
  | AWSCredentials
  | AzureCredentials
  | GCPDefaultCredentials
  | GCPServiceAccountKey
  | KubernetesCredentials
  | IacCredentials
  | M365Credentials
  | OCICredentials
  | MongoDBAtlasCredentials;

export interface SearchParamsProps {
  [key: string]: string | string[] | undefined;
}

export interface ApiError {
  detail: string;
  status: string;
  source: {
    pointer: string;
  };
  code: string;
}

export interface InvitationProps {
  type: "invitations";
  id: string;
  attributes: {
    inserted_at: string;
    updated_at: string;
    email: string;
    state: string;
    token: string;
    expires_at: string;
  };
  relationships: {
    inviter: {
      data: {
        type: "users";
        id: string;
      };
    };
    role?: {
      data: {
        type: "roles";
        id: string;
      };
      attributes?: {
        name: string;
        manage_users?: boolean;
        manage_account?: boolean;
        manage_billing?: boolean;
        manage_providers?: boolean;
        manage_integrations?: boolean;
        manage_scans?: boolean;
        permission_state?: "unlimited" | "limited" | "none";
      };
    };
  };
  links: {
    self: string;
  };
  roles?: {
    id: string;
    name: string;
  }[];
}

export interface Role {
  type: "roles";
  id: string;
  attributes: {
    name: string;
    manage_users: boolean;
    manage_account: boolean;
    manage_billing: boolean;
    manage_providers: boolean;
    manage_integrations: boolean;
    manage_scans: boolean;
    unlimited_visibility: boolean;
    permission_state: "unlimited" | "limited" | "none";
    inserted_at: string;
    updated_at: string;
  };
  relationships: {
    provider_groups: {
      meta: {
        count: number;
      };
      data: {
        type: string;
        id: string;
      }[];
    };
    users: {
      meta: {
        count: number;
      };
      data: {
        type: string;
        id: string;
      }[];
    };
    invitations: {
      meta: {
        count: number;
      };
      data: {
        type: string;
        id: string;
      }[];
    };
  };
  links: {
    self: string;
  };
}

export interface RolesProps {
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
  data: Role[];
  meta: {
    pagination: {
      page: number;
      pages: number;
      count: number;
    };
    version: string;
  };
}

export interface UserProfileProps {
  data: {
    type: "users";
    id: string;
    attributes: {
      name: string;
      email: string;
      company_name: string;
      date_joined: string;
      role: {
        name: string;
      };
    };
    relationships: {
      memberships: {
        meta: {
          count: number;
        };
        data: Array<{
          type: "memberships";
          id: string;
        }>;
      };
    };
  };
  meta: {
    version: string;
  };
}

export interface UserProps {
  type: "users";
  id: string;
  attributes: {
    name: string;
    email: string;
    company_name: string;
    date_joined: string;
    role: {
      name: string;
    };
  };
  relationships: {
    memberships: {
      meta: {
        count: number;
      };
      data: Array<{
        type: "memberships";
        id: string;
      }>;
    };
    roles: {
      meta: {
        count: number;
      };
      data: Array<{
        type: "roles";
        id: string;
      }>;
    };
  };
  roles: {
    id: string;
    name: string;
  }[];
}

export interface FindingsResponse {
  data: FindingProps[];
  meta: MetaDataProps;
}

export interface FindingProps {
  type: "findings";
  id: string;
  attributes: {
    uid: string;
    delta: "new" | "changed" | null;
    status: "PASS" | "FAIL" | "MANUAL";
    status_extended: string;
    severity: "informational" | "low" | "medium" | "high" | "critical";
    check_id: string;
    muted: boolean;
    muted_reason?: string;
    check_metadata: {
      risk: string;
      notes: string;
      checkid: string;
      provider: string;
      severity: "informational" | "low" | "medium" | "high" | "critical";
      checktype: string[];
      dependson: string[];
      relatedto: string[];
      categories: string[];
      checktitle: string;
      compliance: string | null;
      relatedurl: string;
      description: string;
      remediation: {
        code: {
          cli: string;
          other: string;
          nativeiac: string;
          terraform: string;
        };
        recommendation: {
          url: string;
          text: string;
        };
      };
      additionalurls?: string[];
      servicename: string;
      checkaliases: string[];
      resourcetype: string;
      subservicename: string;
      resourceidtemplate: string;
    };
    raw_result: object | null;
    inserted_at: string;
    updated_at: string;
    first_seen_at: string | null;
  };
  relationships: {
    resources: {
      data: {
        type: "resources";
        id: string;
      }[];
    };
    scan: {
      data: {
        type: "scans";
        id: string;
      };
      attributes: {
        name: string;
        trigger: string;
        state: string;
        unique_resource_count: number;
        progress: number;
        scanner_args: {
          checks_to_execute: string[];
        };
        duration: number;
        started_at: string;
        inserted_at: string;
        completed_at: string;
        scheduled_at: string | null;
        next_scan_at: string;
      };
    };
    resource: {
      data: {
        type: "resources";
        id: string;
      }[];
      id: string;
      attributes: {
        uid: string;
        name: string;
        region: string;
        service: string;
        tags: Record<string, string>;
        type: string;
        inserted_at: string;
        updated_at: string;
        details: string | null;
        partition: string | null;
      };
      relationships: {
        provider: {
          data: {
            type: "providers";
            id: string;
          };
        };
        findings: {
          meta: {
            count: number;
          };
          data: {
            type: "findings";
            id: string;
          }[];
        };
      };
      links: {
        self: string;
      };
    };
    provider: {
      data: {
        type: "providers";
        id: string;
      };
      attributes: {
        provider: string;
        uid: string;
        alias: string;
        connection: {
          connected: boolean;
          last_checked_at: string;
        };
        inserted_at: string;
        updated_at: string;
      };
      relationships: {
        secret: {
          data: {
            type: "provider-secrets";
            id: string;
          };
        };
      };
      links: {
        self: string;
      };
    };
  };
  links: {
    self: string;
  };
}

export interface MetaDataProps {
  pagination: {
    page: number;
    pages: number;
    count: number;
    itemsPerPage?: Array<number>;
  };
  version: string;
}

export interface UserProps {
  id: string;
  email: string;
  name: string;
  role: string;
  dateAdded: string;
  status: "active" | "inactive";
}
```

--------------------------------------------------------------------------------

---[FILE: filters.ts]---
Location: prowler-master/ui/types/filters.ts

```typescript
import { ProviderConnectionStatus, ProviderEntity } from "./providers";
import { ScanEntity } from "./scans";

export type FilterEntity =
  | ProviderEntity
  | ScanEntity
  | ProviderConnectionStatus;

export interface FilterOption {
  key: string;
  labelCheckboxGroup: string;
  values: string[];
  valueLabelMapping?: Array<{ [uid: string]: FilterEntity }>;
  labelFormatter?: (value: string) => string;
  index?: number;
  showSelectAll?: boolean;
  defaultToSelectAll?: boolean;
  defaultValues?: string[];
}

export interface CustomDropdownFilterProps {
  filter: FilterOption;
  onFilterChange: (key: string, values: string[]) => void;
}

export enum FilterType {
  SCAN = "scan__in",
  PROVIDER = "provider__in",
  PROVIDER_UID = "provider_uid__in",
  PROVIDER_TYPE = "provider_type__in",
  REGION = "region__in",
  SERVICE = "service__in",
  RESOURCE_TYPE = "resource_type__in",
  SEVERITY = "severity__in",
  STATUS = "status__in",
  DELTA = "delta__in",
  CATEGORY = "category__in",
}
```

--------------------------------------------------------------------------------

````
