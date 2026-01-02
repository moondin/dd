---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 860
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 860 of 867)

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

---[FILE: users.ts]---
Location: prowler-master/ui/types/users.ts

```typescript
export interface UserAttributes {
  name: string;
  email: string;
  company_name: string;
  date_joined: string;
}

export interface MembershipData {
  type: string;
  id: string;
}

export interface MembershipMeta {
  count: number;
}

export interface UserRelationships {
  memberships: {
    meta: MembershipMeta;
    data: MembershipData[];
  };
}

export interface UserData {
  type: string;
  id: string;
  attributes: UserAttributes;
  relationships: UserRelationships;
}

export interface Meta {
  version: string;
}

export interface UserProps {
  data: UserData;
  meta: Meta;
}

export interface TokenAttributes {
  refreshToken: string;
  accessToken: string;
}

export interface TokenData {
  type: string;
  attributes: TokenAttributes;
}

export interface SignInResponse {
  data: TokenData;
}

export interface RoleData {
  type: "roles";
  id: string;
}

export type PermissionKey =
  | "manage_users"
  | "manage_account"
  | "manage_providers"
  | "manage_scans"
  | "manage_integrations"
  | "manage_billing"
  | "unlimited_visibility";

export type RolePermissionAttributes = Pick<
  RoleDetail["attributes"],
  PermissionKey
>;

export interface RoleDetail {
  id: string;
  type: "roles";
  attributes: {
    name: string;
    manage_users: boolean;
    manage_account: boolean;
    manage_providers: boolean;
    manage_scans: boolean;
    manage_integrations: boolean;
    manage_billing?: boolean;
    unlimited_visibility: boolean;
    permission_state?: string;
    inserted_at?: string;
    updated_at?: string;
  };
}

export interface MembershipDetailData {
  id: string;
  type: "memberships";
  attributes: {
    role: string;
    date_joined: string;
    [key: string]: any;
  };
  relationships: {
    tenant: {
      data: {
        type: string;
        id: string;
      };
    };
    [key: string]: any;
  };
}

export interface UserDataWithRoles
  extends Omit<UserData, "attributes" | "relationships"> {
  attributes: UserAttributes & {
    role?: {
      name: string;
    };
  };
  relationships: {
    memberships: UserRelationships["memberships"];
    roles?: {
      meta: {
        count: number;
      };
      data: RoleData[];
    };
  };
}

export interface UserInfoProps {
  user: UserDataWithRoles | null;
  roleDetails?: RoleDetail[];
  membershipDetails?: MembershipDetailData[];
}

export interface TenantDetailData {
  type: string;
  id: string;
  attributes: {
    name: string;
  };
  relationships: {
    memberships: {
      meta: {
        count: number;
      };
      data: Array<{
        type: string;
        id: string;
      }>;
    };
  };
}

export type IncludedItem = RoleDetail | MembershipDetailData | TenantDetailData;

export interface UserProfileResponse {
  data: UserDataWithRoles;
  included?: IncludedItem[];
  meta?: {
    version: string;
  };
}
```

--------------------------------------------------------------------------------

---[FILE: credentials.ts]---
Location: prowler-master/ui/types/lighthouse/credentials.ts
Signals: Zod

```typescript
import { z } from "zod";

/**
 * Valid AWS regions for Bedrock
 * Reference: https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html
 */
const AWS_BEDROCK_REGIONS = [
  // US Regions
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "us-gov-east-1",
  "us-gov-west-1",
  "ap-taipei-1",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "ap-south-1",
  "ap-south-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-southeast-3",
  "ap-southeast-4",
  "ap-southeast-5",
  "ap-southeast-6",
  "ca-central-1",
  "eu-central-1",
  "eu-central-2",
  "eu-north-1",
  "eu-south-1",
  "eu-south-2",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "il-central-1",
  "me-central-1",
  "sa-east-1",
] as const;

/**
 * OpenAI API Key validation
 * Format: sk-... or sk-proj-... (32+ characters after prefix)
 */
export const openAIApiKeySchema = z
  .string()
  .min(1, "API key is required")
  .regex(
    /^sk-(proj-)?[A-Za-z0-9_-]{32,}$/,
    "Invalid API key format. OpenAI keys should start with 'sk-' or 'sk-proj-' followed by at least 32 characters",
  );

/**
 * AWS Access Key ID validation (long-term credentials only)
 * Format: AKIA... (20 characters total)
 */
export const awsAccessKeyIdSchema = z
  .string()
  .min(1, "AWS Access Key ID is required")
  .regex(/^AKIA[A-Z0-9]{16}$/, "Invalid AWS Access Key ID");

/**
 * AWS Secret Access Key validation
 * Format: 40 characters (alphanumeric + special chars)
 */
export const awsSecretAccessKeySchema = z
  .string()
  .min(1, "AWS Secret Access Key is required")
  .regex(/^[A-Za-z0-9/+=]{40}$/, "Invalid AWS Secret Access Key");

/**
 * AWS Region validation for Bedrock
 */
export const awsRegionSchema = z
  .string()
  .min(1, "AWS Region is required")
  .refine((region) => AWS_BEDROCK_REGIONS.includes(region as any), {
    message: `Invalid AWS region. Must be one of: ${AWS_BEDROCK_REGIONS.join(", ")}`,
  });

/**
 * Base URL validation for OpenAI-compatible providers
 * Must be a valid HTTP/HTTPS URL
 */
export const baseUrlSchema = z
  .string()
  .min(1, "Base URL is required")
  .refine((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }, "Invalid URL format. Must be a valid HTTP or HTTPS URL");

/**
 * Generic API Key validation (for OpenAI-compatible providers with unknown formats)
 */
export const genericApiKeySchema = z
  .string()
  .min(8, "API key must be at least 8 characters")
  .max(512, "API key cannot exceed 512 characters");

/**
 * OpenAI Provider Credentials Schema
 */
export const openAICredentialsSchema = z.object({
  api_key: openAIApiKeySchema,
});

/**
 * Amazon Bedrock Provider Credentials Schema
 */
export const bedrockIamCredentialsSchema = z.object({
  access_key_id: awsAccessKeyIdSchema,
  secret_access_key: awsSecretAccessKeySchema,
  region: awsRegionSchema,
});

export const bedrockApiKeyCredentialsSchema = z.object({
  api_key: genericApiKeySchema,
  region: awsRegionSchema,
});

export const bedrockCredentialsSchema = z.union([
  bedrockIamCredentialsSchema,
  bedrockApiKeyCredentialsSchema,
]);

/**
 * OpenAI Compatible Provider Credentials Schema
 */
export const openAICompatibleCredentialsSchema = z.object({
  api_key: genericApiKeySchema,
});

/**
 * Full OpenAI Compatible Config (includes base_url)
 */
export const openAICompatibleConfigSchema = z.object({
  credentials: openAICompatibleCredentialsSchema,
  base_url: baseUrlSchema,
});

/**
 * Type exports for all provider credentials
 */
export type OpenAICredentials = z.infer<typeof openAICredentialsSchema>;
export type BedrockCredentials = z.infer<typeof bedrockCredentialsSchema>;
export type OpenAICompatibleCredentials = z.infer<
  typeof openAICompatibleCredentialsSchema
>;
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/types/lighthouse/index.ts

```typescript
export * from "./credentials";
export * from "./lighthouse-providers";
export * from "./model-params";
```

--------------------------------------------------------------------------------

---[FILE: lighthouse-providers.ts]---
Location: prowler-master/ui/types/lighthouse/lighthouse-providers.ts

```typescript
export const LIGHTHOUSE_PROVIDERS = [
  "openai",
  "bedrock",
  "openai_compatible",
] as const;

export type LighthouseProvider = (typeof LIGHTHOUSE_PROVIDERS)[number];

export const PROVIDER_DISPLAY_NAMES = {
  openai: "OpenAI",
  bedrock: "Amazon Bedrock",
  openai_compatible: "OpenAI Compatible",
} as const satisfies Record<LighthouseProvider, string>;
```

--------------------------------------------------------------------------------

---[FILE: model-params.ts]---
Location: prowler-master/ui/types/lighthouse/model-params.ts

```typescript
export type ModelParams = {
  maxTokens: number | undefined;
  temperature: number | undefined;
  reasoningEffort: "minimal" | "low" | "medium" | "high" | undefined;
};
```

--------------------------------------------------------------------------------

---[FILE: replicate_pypi_package.py]---
Location: prowler-master/util/replicate_pypi_package.py

```python
import toml

data = toml.load("pyproject.toml")
# Modify field
data["project"]["name"] = "prowler-cloud"

# To use the dump function, you need to open the file in 'write' mode
f = open("pyproject.toml", "w")
toml.dump(data, f)
f.close()
```

--------------------------------------------------------------------------------

---[FILE: update_aws_services_regions.py]---
Location: prowler-master/util/update_aws_services_regions.py

```python
import json
import logging
import os
import sys

import boto3

# Logging config
logging.basicConfig(
    stream=sys.stdout,
    format="%(asctime)s [File: %(filename)s:%(lineno)d] \t[Module: %(module)s]\t %(levelname)s: %(message)s",
    datefmt="%m/%d/%Y %I:%M:%S %p",
    level=logging.INFO,
)

regions_by_service = {"services": {}}

logging.info("Recovering AWS Regions by Service")
client = boto3.client("ssm", region_name="us-east-1")
get_parameters_by_path_paginator = client.get_paginator("get_parameters_by_path")
# Get all AWS Available Services
for page in get_parameters_by_path_paginator.paginate(
    Path="/aws/service/global-infrastructure/services"
):
    for service in page["Parameters"]:
        regions_by_service["services"][service["Value"]] = {}
        # Get all AWS Regions for the specific service
        regions = {"aws": [], "aws-cn": [], "aws-us-gov": []}
        for page in get_parameters_by_path_paginator.paginate(
            Path="/aws/service/global-infrastructure/services/"
            + service["Value"]
            + "/regions"
        ):
            for region in page["Parameters"]:
                if "cn" in region["Value"]:
                    regions["aws-cn"].append(region["Value"])
                elif "gov" in region["Value"]:
                    regions["aws-us-gov"].append(region["Value"])
                else:
                    regions["aws"].append(region["Value"])
                # Sort regions per partition
                regions["aws"] = sorted(regions["aws"])
                regions["aws-cn"] = sorted(regions["aws-cn"])
                regions["aws-us-gov"] = sorted(regions["aws-us-gov"])
        regions_by_service["services"][service["Value"]]["regions"] = regions

# Include the regions for the subservices and the services not present
logging.info("Updating subservices and the services not present in the original matrix")
# macie2 --> macie
regions_by_service["services"]["macie2"] = regions_by_service["services"]["macie"]
# bedrock-agent is not in SSM, and has different availability than bedrock
# See: https://docs.aws.amazon.com/bedrock/latest/userguide/agents-supported.html
regions_by_service["services"]["bedrock-agent"] = {
    "regions": {
        "aws": [
            "ap-northeast-1",
            "ap-northeast-2",
            "ap-south-1",
            "ap-southeast-1",
            "ap-southeast-2",
            "ca-central-1",
            "eu-central-1",
            "eu-central-2",
            "eu-west-1",
            "eu-west-2",
            "eu-west-3",
            "sa-east-1",
            "us-east-1",
            "us-west-2",
        ],
        "aws-cn": [],
        "aws-us-gov": [
            "us-gov-west-1",
        ],
    }
}
# cognito --> cognito-idp
regions_by_service["services"]["cognito"] = regions_by_service["services"][
    "cognito-idp"
]
# opensearch --> es
regions_by_service["services"]["opensearch"] = regions_by_service["services"]["es"]
# elbv2 --> elb
regions_by_service["services"]["elbv2"] = regions_by_service["services"]["elb"]
# wafv2 --> waf
regions_by_service["services"]["wafv2"] = regions_by_service["services"]["waf"]
# wellarchitected --> wellarchitectedtool
regions_by_service["services"]["wellarchitected"] = regions_by_service["services"][
    "wellarchitectedtool"
]
# sesv2 --> ses
regions_by_service["services"]["sesv2"] = regions_by_service["services"]["ses"]

# Write to file
parsed_matrix_regions_aws = f"{os.path.dirname(os.path.realpath(__name__))}/prowler/providers/aws/aws_regions_by_service.json"
logging.info(f"Writing {parsed_matrix_regions_aws}")
with open(parsed_matrix_regions_aws, "w") as outfile:
    json.dump(regions_by_service, outfile, indent=2, sort_keys=True)
```

--------------------------------------------------------------------------------

---[FILE: from_yaml_to_json.py]---
Location: prowler-master/util/compliance/ccc/from_yaml_to_json.py

```python
"""
Script to convert CCC security controls YAML files to JSON format.
"""

import json
import sys
from pathlib import Path

import yaml


def load_yaml(file_path):
    """Load YAML file."""
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return yaml.safe_load(file)
    except Exception as e:
        print(f"Error loading YAML file: {e}")
        return None


def transform_yaml_to_json(yaml_data):
    """Transform YAML structure to JSON."""

    result = {
        "Framework": "CCC",
        "Version": "",
        "Provider": "<todo>",
        "Description": "The best practices for Common Cloud Controls Catalog (CCC) for <todo>",
        "Requirements": [],
    }

    control_families = yaml_data.get("control-families", [])

    for family in control_families:
        family_name = family.get("title", "")
        family_description = family.get("description", "")
        controls = family.get("controls", [])

        for control in controls:
            control_id = control.get("id", "")
            control_title = control.get("title", "")
            control_objective = control.get("objective", "")

            threat_mappings = control.get("threat-mappings", [])
            guideline_mappings = control.get("guideline-mappings", [])

            assessment_reqs = control.get("assessment-requirements", [])

            for req in assessment_reqs:
                req_id = req.get("id", "")
                req_text = req.get("text", "").strip()
                applicability = req.get("applicability", [])
                recommendation = req.get("recommendation", "")

                section_threat_mappings = []
                for tm in threat_mappings:
                    ref_id = tm.get("reference-id", "")
                    entries = tm.get("entries", [])
                    identifiers = []
                    for entry in entries:
                        entry_ref = entry.get("reference-id", "")
                        if entry_ref:
                            if "Core." in entry_ref:
                                entry_ref = entry_ref.replace("Core.", "")
                            identifiers.append(entry_ref)

                    if identifiers:
                        section_threat_mappings.append(
                            {"ReferenceId": ref_id, "Identifiers": identifiers}
                        )

                section_guideline_mappings = []
                for gm in guideline_mappings:
                    ref_id = gm.get("reference-id", "")
                    entries = gm.get("entries", [])
                    identifiers = []
                    for entry in entries:
                        entry_ref = entry.get("reference-id", "")
                        if entry_ref:
                            identifiers.append(entry_ref)

                    if identifiers:
                        section_guideline_mappings.append(
                            {"ReferenceId": ref_id, "Identifiers": identifiers}
                        )

                checks = []

                requirement = {
                    "Id": req_id,
                    "Description": req_text,
                    "Attributes": [
                        {
                            "FamilyName": family_name,
                            "FamilyDescription": family_description,
                            "Section": f"{control_id} {control_title}",
                            "SubSection": "",
                            "SubSectionObjective": control_objective.strip(),
                            "Applicability": applicability,
                            "Recommendation": recommendation,
                            "SectionThreatMappings": section_threat_mappings,
                            "SectionGuidelineMappings": section_guideline_mappings,
                        }
                    ],
                    "Checks": checks,
                }

                result["Requirements"].append(requirement)

    return result


def save_json(data, file_path):
    """Save data as JSON."""
    try:
        with open(file_path, "w", encoding="utf-8") as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving JSON file: {e}")
        return False


def main():
    """Main function."""
    if len(sys.argv) < 2:
        print("Usage: python from_yaml_to_json.py <yaml_file> [output_file.json]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "output.json"

    if not Path(input_file).exists():
        print(f"Error: File {input_file} does not exist.")
        sys.exit(1)

    print(f"Loading {input_file}...")
    yaml_data = load_yaml(input_file)

    if yaml_data is None:
        print("Could not load YAML file.")
        sys.exit(1)

    print("Transforming YAML to JSON...")
    json_data = transform_yaml_to_json(yaml_data)

    print(f"Saving result to {output_file}...")
    if save_json(json_data, output_file):
        print("Conversion completed successfully!")
        print(f"Generated file: {output_file}")
        print(f"Total requirements processed: {len(json_data['Requirements'])}")
    else:
        print("Error saving JSON file.")
        sys.exit(1)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

````
