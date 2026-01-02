---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 859
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 859 of 867)

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

---[FILE: formSchemas.ts]---
Location: prowler-master/ui/types/formSchemas.ts
Signals: Zod

```typescript
import { z } from "zod";

import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";
import { validateMutelistYaml, validateYaml } from "@/lib/yaml";

import { PROVIDER_TYPES, ProviderType } from "./providers";

export const addRoleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  manage_users: z.boolean().default(false),
  manage_account: z.boolean().default(false),
  manage_billing: z.boolean().default(false),
  manage_providers: z.boolean().default(false),
  manage_integrations: z.boolean().default(false),
  manage_scans: z.boolean().default(false),
  unlimited_visibility: z.boolean().default(false),
  groups: z.array(z.string()).optional(),
});

export const editRoleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  manage_users: z.boolean().default(false),
  manage_account: z.boolean().default(false),
  manage_billing: z.boolean().default(false),
  manage_providers: z.boolean().default(false),
  manage_integrations: z.boolean().default(false),
  manage_scans: z.boolean().default(false),
  unlimited_visibility: z.boolean().default(false),
  groups: z.array(z.string()).optional(),
});

export const editScanFormSchema = (currentName: string) =>
  z.object({
    scanName: z
      .string()
      .refine((val) => val === "" || val.length >= 3, {
        message: "Must be empty or have at least 3 characters.",
      })
      .refine((val) => val === "" || val.length <= 32, {
        message: "Must not exceed 32 characters.",
      })
      .refine((val) => val !== currentName, {
        message: "The new name must be different from the current one.",
      })
      .optional(),
    scanId: z.string(),
  });

export const onDemandScanFormSchema = () =>
  z.object({
    [ProviderCredentialFields.PROVIDER_ID]: z.string(),
    scanName: z.string().optional(),
    scannerArgs: z
      .object({
        checksToExecute: z.array(z.string()),
      })
      .optional(),
  });

export const scheduleScanFormSchema = () =>
  z.object({
    providerId: z.string(),
    scheduleDate: z.string(),
  });

export const awsCredentialsTypeSchema = z.object({
  awsCredentialsType: z.string().min(1, {
    message: "Please select the type of credentials you want to use",
  }),
});

export const addProviderFormSchema = z
  .object({
    providerType: z.enum(PROVIDER_TYPES, {
      error: "Please select a provider type",
    }),
  })
  .and(
    z.discriminatedUnion("providerType", [
      z.object({
        providerType: z.literal("aws"),
        [ProviderCredentialFields.PROVIDER_ALIAS]: z.string(),
        providerUid: z.string(),
      }),
      z.object({
        providerType: z.literal("azure"),
        [ProviderCredentialFields.PROVIDER_ALIAS]: z.string(),
        providerUid: z.string(),
        awsCredentialsType: z.string().optional(),
      }),
      z.object({
        providerType: z.literal("m365"),
        [ProviderCredentialFields.PROVIDER_ALIAS]: z.string(),
        providerUid: z.string(),
      }),
      z.object({
        providerType: z.literal("gcp"),
        [ProviderCredentialFields.PROVIDER_ALIAS]: z.string(),
        providerUid: z.string(),
        awsCredentialsType: z.string().optional(),
      }),
      z.object({
        providerType: z.literal("kubernetes"),
        [ProviderCredentialFields.PROVIDER_ALIAS]: z.string(),
        providerUid: z.string(),
        awsCredentialsType: z.string().optional(),
      }),
      z.object({
        providerType: z.literal("github"),
        [ProviderCredentialFields.PROVIDER_ALIAS]: z.string(),
        providerUid: z.string(),
      }),
      z.object({
        providerType: z.literal("iac"),
        [ProviderCredentialFields.PROVIDER_ALIAS]: z.string(),
        providerUid: z.string(),
      }),
      z.object({
        providerType: z.literal("oraclecloud"),
        [ProviderCredentialFields.PROVIDER_ALIAS]: z.string(),
        providerUid: z.string(),
      }),
      z.object({
        providerType: z.literal("mongodbatlas"),
        [ProviderCredentialFields.PROVIDER_ALIAS]: z.string(),
        providerUid: z.string(),
      }),
    ]),
  );

export const addCredentialsFormSchema = (
  providerType: ProviderType,
  via?: string | null,
) =>
  z
    .object({
      [ProviderCredentialFields.PROVIDER_ID]: z.string(),
      [ProviderCredentialFields.PROVIDER_TYPE]: z.string(),
      ...(providerType === "aws"
        ? {
            [ProviderCredentialFields.AWS_ACCESS_KEY_ID]: z
              .string()
              .min(1, "AWS Access Key ID is required"),
            [ProviderCredentialFields.AWS_SECRET_ACCESS_KEY]: z
              .string()
              .min(1, "AWS Secret Access Key is required"),
            [ProviderCredentialFields.AWS_SESSION_TOKEN]: z.string().optional(),
          }
        : providerType === "azure"
          ? {
              [ProviderCredentialFields.CLIENT_ID]: z
                .string()
                .min(1, "Client ID is required"),
              [ProviderCredentialFields.CLIENT_SECRET]: z
                .string()
                .min(1, "Client Secret is required"),
              [ProviderCredentialFields.TENANT_ID]: z
                .string()
                .min(1, "Tenant ID is required"),
            }
          : providerType === "gcp"
            ? {
                [ProviderCredentialFields.CLIENT_ID]: z
                  .string()
                  .min(1, "Client ID is required"),
                [ProviderCredentialFields.CLIENT_SECRET]: z
                  .string()
                  .min(1, "Client Secret is required"),
                [ProviderCredentialFields.REFRESH_TOKEN]: z
                  .string()
                  .min(1, "Refresh Token is required"),
              }
            : providerType === "kubernetes"
              ? {
                  [ProviderCredentialFields.KUBECONFIG_CONTENT]: z
                    .string()
                    .min(1, "Kubeconfig Content is required"),
                }
              : providerType === "m365"
                ? {
                    [ProviderCredentialFields.CLIENT_ID]: z
                      .string()
                      .min(1, "Client ID is required"),
                    [ProviderCredentialFields.CLIENT_SECRET]: z
                      .string()
                      .optional(),
                    [ProviderCredentialFields.CERTIFICATE_CONTENT]: z
                      .string()
                      .optional(),
                    [ProviderCredentialFields.TENANT_ID]: z
                      .string()
                      .min(1, "Tenant ID is required"),
                  }
                : providerType === "github"
                  ? {
                      [ProviderCredentialFields.PERSONAL_ACCESS_TOKEN]: z
                        .string()
                        .optional(),
                      [ProviderCredentialFields.OAUTH_APP_TOKEN]: z
                        .string()
                        .optional(),
                      [ProviderCredentialFields.GITHUB_APP_ID]: z
                        .string()
                        .optional(),
                      [ProviderCredentialFields.GITHUB_APP_KEY]: z
                        .string()
                        .optional(),
                    }
                  : providerType === "iac"
                    ? {
                        [ProviderCredentialFields.REPOSITORY_URL]: z
                          .string()
                          .optional(),
                        [ProviderCredentialFields.ACCESS_TOKEN]: z
                          .string()
                          .optional(),
                      }
                    : providerType === "oraclecloud"
                      ? {
                          [ProviderCredentialFields.OCI_USER]: z
                            .string()
                            .min(1, "User OCID is required"),
                          [ProviderCredentialFields.OCI_FINGERPRINT]: z
                            .string()
                            .min(1, "Fingerprint is required"),
                          [ProviderCredentialFields.OCI_KEY_CONTENT]: z
                            .string()
                            .min(1, "Private Key Content is required"),
                          [ProviderCredentialFields.OCI_TENANCY]: z
                            .string()
                            .min(1, "Tenancy OCID is required"),
                          [ProviderCredentialFields.OCI_REGION]: z
                            .string()
                            .min(1, "Region is required"),
                          [ProviderCredentialFields.OCI_PASS_PHRASE]: z
                            .union([z.string(), z.literal("")])
                            .optional(),
                        }
                      : providerType === "mongodbatlas"
                        ? {
                            [ProviderCredentialFields.ATLAS_PUBLIC_KEY]: z
                              .string()
                              .min(1, "Atlas Public Key is required"),
                            [ProviderCredentialFields.ATLAS_PRIVATE_KEY]: z
                              .string()
                              .min(1, "Atlas Private Key is required"),
                          }
                        : {}),
    })
    .superRefine((data: Record<string, any>, ctx) => {
      if (providerType === "m365") {
        // Validate based on the via parameter
        if (via === "app_client_secret") {
          const clientSecret = data[ProviderCredentialFields.CLIENT_SECRET];
          if (!clientSecret || clientSecret.trim() === "") {
            ctx.addIssue({
              code: "custom",
              message: "Client Secret is required",
              path: [ProviderCredentialFields.CLIENT_SECRET],
            });
          }
        } else if (via === "app_certificate") {
          const certificateContent =
            data[ProviderCredentialFields.CERTIFICATE_CONTENT];
          if (!certificateContent || certificateContent.trim() === "") {
            ctx.addIssue({
              code: "custom",
              message: "Certificate Content is required",
              path: [ProviderCredentialFields.CERTIFICATE_CONTENT],
            });
          }
        }
      }

      if (providerType === "github") {
        // For GitHub, validation depends on the 'via' parameter
        if (via === "personal_access_token") {
          if (!data[ProviderCredentialFields.PERSONAL_ACCESS_TOKEN]) {
            ctx.addIssue({
              code: "custom",
              message: "Personal Access Token is required",
              path: [ProviderCredentialFields.PERSONAL_ACCESS_TOKEN],
            });
          }
        } else if (via === "oauth_app") {
          if (!data[ProviderCredentialFields.OAUTH_APP_TOKEN]) {
            ctx.addIssue({
              code: "custom",
              message: "OAuth App Token is required",
              path: [ProviderCredentialFields.OAUTH_APP_TOKEN],
            });
          }
        } else if (via === "github_app") {
          if (!data[ProviderCredentialFields.GITHUB_APP_ID]) {
            ctx.addIssue({
              code: "custom",
              message: "GitHub App ID is required",
              path: [ProviderCredentialFields.GITHUB_APP_ID],
            });
          }
          if (!data[ProviderCredentialFields.GITHUB_APP_KEY]) {
            ctx.addIssue({
              code: "custom",
              message: "GitHub App Private Key is required",
              path: [ProviderCredentialFields.GITHUB_APP_KEY],
            });
          }
        }
      }
    });

export const addCredentialsRoleFormSchema = (providerType: string) =>
  providerType === "aws"
    ? z
        .object({
          [ProviderCredentialFields.PROVIDER_ID]: z.string(),
          [ProviderCredentialFields.PROVIDER_TYPE]: z.string(),
          [ProviderCredentialFields.ROLE_ARN]: z
            .string()
            .min(1, "AWS Role ARN is required"),
          [ProviderCredentialFields.EXTERNAL_ID]: z.string().optional(),
          [ProviderCredentialFields.AWS_ACCESS_KEY_ID]: z.string().optional(),
          [ProviderCredentialFields.AWS_SECRET_ACCESS_KEY]: z
            .string()
            .optional(),
          [ProviderCredentialFields.AWS_SESSION_TOKEN]: z.string().optional(),
          [ProviderCredentialFields.SESSION_DURATION]: z.string().optional(),
          [ProviderCredentialFields.ROLE_SESSION_NAME]: z.string().optional(),
          [ProviderCredentialFields.CREDENTIALS_TYPE]: z.string().optional(),
        })
        .refine(
          (data) =>
            data[ProviderCredentialFields.CREDENTIALS_TYPE] !==
              "access-secret-key" ||
            (data[ProviderCredentialFields.AWS_ACCESS_KEY_ID] &&
              data[ProviderCredentialFields.AWS_SECRET_ACCESS_KEY]),
          {
            message: "AWS Access Key ID and Secret Access Key are required.",
            path: [ProviderCredentialFields.AWS_ACCESS_KEY_ID],
          },
        )
    : z.object({
        providerId: z.string(),
        providerType: z.string(),
      });

export const addCredentialsServiceAccountFormSchema = (
  providerType: ProviderType,
) =>
  providerType === "gcp"
    ? z.object({
        [ProviderCredentialFields.PROVIDER_ID]: z.string(),
        [ProviderCredentialFields.PROVIDER_TYPE]: z.string(),
        [ProviderCredentialFields.SERVICE_ACCOUNT_KEY]: z.string().refine(
          (val) => {
            try {
              const parsed = JSON.parse(val);
              return (
                typeof parsed === "object" &&
                parsed !== null &&
                !Array.isArray(parsed)
              );
            } catch {
              return false;
            }
          },
          {
            message: "Invalid JSON format. Please provide a valid JSON object.",
          },
        ),
      })
    : z.object({
        [ProviderCredentialFields.PROVIDER_ID]: z.string(),
        [ProviderCredentialFields.PROVIDER_TYPE]: z.string(),
      });

export const testConnectionFormSchema = z.object({
  [ProviderCredentialFields.PROVIDER_ID]: z.string(),
  runOnce: z.boolean().default(false),
});

export const launchScanFormSchema = () =>
  z.object({
    [ProviderCredentialFields.PROVIDER_ID]: z.string(),
    [ProviderCredentialFields.PROVIDER_TYPE]: z.string(),
    scannerArgs: z
      .object({
        checksToExecute: z.array(z.string()).optional(),
      })
      .optional(),
  });

export const editProviderFormSchema = (currentAlias: string) =>
  z.object({
    [ProviderCredentialFields.PROVIDER_ALIAS]: z
      .string()
      .refine((val) => val === "" || val.length >= 3, {
        message: "The alias must be empty or have at least 3 characters.",
      })
      .refine((val) => val !== currentAlias, {
        message: "The new alias must be different from the current one.",
      })
      .optional(),
    [ProviderCredentialFields.PROVIDER_ID]: z.string(),
  });

export const editInviteFormSchema = z.object({
  invitationId: z.uuid(),
  invitationEmail: z.email(),
  expires_at: z.string().optional(),
  role: z.string().optional(),
});

export const editUserFormSchema = () =>
  z.object({
    name: z
      .string()
      .min(3, { message: "The name must have at least 3 characters." })
      .max(150, { message: "The name cannot exceed 150 characters." })
      .optional(),
    email: z.email({ error: "Please enter a valid email address." }).optional(),
    password: z
      .string()
      .min(1, { message: "The password cannot be empty." })
      .optional(),
    company_name: z.string().optional(),
    userId: z.string(),
    role: z.string().optional(),
  });

export const samlConfigFormSchema = z.object({
  email_domain: z
    .string()
    .trim()
    .min(1, { message: "Email domain is required" }),
  metadata_xml: z
    .string()
    .trim()
    .min(1, { message: "Metadata XML is required" }),
});

export const mutedFindingsConfigFormSchema = z.object({
  configuration: z
    .string()
    .trim()
    .min(1, { message: "Configuration is required" })
    .superRefine((val, ctx) => {
      const yamlValidation = validateYaml(val);
      if (!yamlValidation.isValid) {
        ctx.addIssue({
          code: "custom",
          message: `Invalid YAML format: ${yamlValidation.error}`,
        });
        return;
      }

      const mutelistValidation = validateMutelistYaml(val);
      if (!mutelistValidation.isValid) {
        ctx.addIssue({
          code: "custom",
          message: `Invalid mutelist structure: ${mutelistValidation.error}`,
        });
      }
    }),
  id: z.string().optional(),
});
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/types/index.ts

```typescript
export * from "./authFormSchema";
export * from "./components";
export * from "./filters";
export * from "./formSchemas";
export * from "./processors";
export * from "./providers";
export * from "./resources";
export * from "./scans";
```

--------------------------------------------------------------------------------

---[FILE: integrations.ts]---
Location: prowler-master/ui/types/integrations.ts
Signals: Zod

```typescript
import { z } from "zod";

import type { TaskState } from "@/types/tasks";

export type IntegrationType = "amazon_s3" | "aws_security_hub" | "jira";

export interface IntegrationProps {
  type: "integrations";
  id: string;
  attributes: {
    inserted_at: string;
    updated_at: string;
    enabled: boolean;
    connected: boolean;
    connection_last_checked_at: string | null;
    integration_type: IntegrationType;
    configuration: {
      bucket_name?: string;
      output_directory?: string;
      credentials?: {
        aws_access_key_id?: string;
        aws_secret_access_key?: string;
        aws_session_token?: string;
        role_arn?: string;
        external_id?: string;
        role_session_name?: string;
        session_duration?: number;
      };
      // Jira specific configuration
      domain?: string;
      projects?: { [key: string]: string };
      issue_types?: string[];
      [key: string]: unknown;
    };
    url?: string;
  };
  relationships?: { providers?: { data: { type: "providers"; id: string }[] } };
  links: { self: string };
}

// Jira dispatch types
export interface JiraDispatchRequest {
  data: {
    type: "integrations-jira-dispatches";
    attributes: {
      project_key: string;
      issue_type: string;
    };
  };
}

export interface JiraDispatchResponse {
  data: {
    type: "tasks";
    id: string;
    attributes: {
      inserted_at: string;
      completed_at: string | null;
      name: string;
      state: TaskState;
      result: {
        success?: boolean;
        error?: string;
        message?: string;
        issue_url?: string;
        issue_key?: string;
      } | null;
      task_args: Record<string, unknown> | null;
      metadata: Record<string, unknown> | null;
    };
  };
}

// Shared AWS credential fields schema
const awsCredentialFields = {
  credentials_type: z.enum(["aws-sdk-default", "access-secret-key"]),
  aws_access_key_id: z.string().optional(),
  aws_secret_access_key: z.string().optional(),
  aws_session_token: z.string().optional(),
  role_arn: z.string().optional(),
  external_id: z.string().optional(),
  role_session_name: z.string().optional(),
  session_duration: z.string().optional(),
  show_role_section: z.boolean().optional(),
};

// Shared validation helper for AWS credentials (create mode)
type AwsCredentialsData = {
  credentials_type?: "aws-sdk-default" | "access-secret-key";
  aws_access_key_id?: string;
  aws_secret_access_key?: string;
  aws_session_token?: string;
  role_arn?: string;
  external_id?: string;
  role_session_name?: string;
  session_duration?: string;
  show_role_section?: boolean;
};

const validateAwsCredentialsCreate = (
  data: AwsCredentialsData,
  ctx: z.RefinementCtx,
  requireCredentials: boolean = true,
) => {
  if (data.credentials_type === "access-secret-key" && requireCredentials) {
    if (!data.aws_access_key_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "AWS Access Key ID is required when using access and secret key",
        path: ["aws_access_key_id"],
      });
    }
    if (!data.aws_secret_access_key) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "AWS Secret Access Key is required when using access and secret key",
        path: ["aws_secret_access_key"],
      });
    }
  }
};

// Shared validation helper for AWS credentials (edit mode)
const validateAwsCredentialsEdit = (
  data: AwsCredentialsData,
  ctx: z.RefinementCtx,
) => {
  if (data.credentials_type === "access-secret-key") {
    const hasAccessKey = !!data.aws_access_key_id;
    const hasSecretKey = !!data.aws_secret_access_key;

    if (hasAccessKey && !hasSecretKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "AWS Secret Access Key is required when providing Access Key ID",
        path: ["aws_secret_access_key"],
      });
    }

    if (hasSecretKey && !hasAccessKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "AWS Access Key ID is required when providing Secret Access Key",
        path: ["aws_access_key_id"],
      });
    }
  }
};

// Shared validation helper for IAM Role fields
const validateIamRole = (
  data: AwsCredentialsData,
  ctx: z.RefinementCtx,
  checkShowSection: boolean = true,
) => {
  const shouldValidate = checkShowSection
    ? data.show_role_section === true
    : true;

  if (shouldValidate && data.role_arn) {
    if (data.role_arn.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Role ARN is required",
        path: ["role_arn"],
      });
    } else if (!data.external_id || data.external_id.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "External ID is required when using Role ARN",
        path: ["external_id"],
      });
    }
  }

  if (checkShowSection && data.show_role_section === true) {
    if (!data.role_arn || data.role_arn.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Role ARN is required",
        path: ["role_arn"],
      });
    }
    if (!data.external_id || data.external_id.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "External ID is required",
        path: ["external_id"],
      });
    }
  }
};

// S3 Integration Schemas
const baseS3IntegrationSchema = z.object({
  integration_type: z.literal("amazon_s3"),
  bucket_name: z.string().min(1, "Bucket name is required"),
  output_directory: z.string().min(1, "Output directory is required"),
  providers: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
  ...awsCredentialFields,
});

export const s3IntegrationFormSchema = baseS3IntegrationSchema
  .extend({
    enabled: z.boolean().default(true),
    credentials_type: z
      .enum(["aws-sdk-default", "access-secret-key"])
      .default("aws-sdk-default"),
  })
  .superRefine((data, ctx) => {
    validateAwsCredentialsCreate(data, ctx);
    validateIamRole(data, ctx);
  });

export const editS3IntegrationFormSchema = baseS3IntegrationSchema
  .extend({
    bucket_name: z.string().min(1, "Bucket name is required").optional(),
    output_directory: z
      .string()
      .min(1, "Output directory is required")
      .optional(),
    providers: z.array(z.string()).optional(),
    credentials_type: z
      .enum(["aws-sdk-default", "access-secret-key"])
      .optional(),
  })
  .superRefine((data, ctx) => {
    validateAwsCredentialsEdit(data, ctx);
    validateIamRole(data, ctx);
  });

// Security Hub Integration Schemas
const baseSecurityHubIntegrationSchema = z.object({
  integration_type: z.literal("aws_security_hub"),
  provider_id: z.string().min(1, "AWS Provider is required"),
  send_only_fails: z.boolean().optional(),
  archive_previous_findings: z.boolean().optional(),
  use_custom_credentials: z.boolean().optional(),
  enabled: z.boolean().optional(),
  ...awsCredentialFields,
});

export const securityHubIntegrationFormSchema = baseSecurityHubIntegrationSchema
  .extend({
    enabled: z.boolean().default(true),
    send_only_fails: z.boolean().default(true),
    archive_previous_findings: z.boolean().default(false),
    use_custom_credentials: z.boolean().default(false),
    credentials_type: z
      .enum(["aws-sdk-default", "access-secret-key"])
      .default("aws-sdk-default"),
  })
  .superRefine((data, ctx) => {
    if (data.use_custom_credentials) {
      validateAwsCredentialsCreate(data, ctx);
      validateIamRole(data, ctx);
    }
    // Always validate role if role_arn is provided
    if (!data.use_custom_credentials && data.role_arn) {
      validateIamRole(data, ctx, false);
    }
  });

export const editSecurityHubIntegrationFormSchema =
  baseSecurityHubIntegrationSchema
    .extend({
      provider_id: z.string().optional(),
      send_only_fails: z.boolean().optional(),
      archive_previous_findings: z.boolean().optional(),
      use_custom_credentials: z.boolean().optional(),
      credentials_type: z
        .enum(["aws-sdk-default", "access-secret-key"])
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.use_custom_credentials !== false) {
        validateAwsCredentialsEdit(data, ctx);
      }
      // Always validate role if role_arn is provided
      validateIamRole(data, ctx, false);
    });

// Jira Integration Schemas
export const jiraIntegrationFormSchema = z.object({
  integration_type: z.literal("jira"),
  domain: z.string().min(1, "Domain is required"),
  user_mail: z.email({ error: "Invalid email format" }),
  api_token: z.string().min(1, "API token is required"),
  enabled: z.boolean().default(true),
});

export const editJiraIntegrationFormSchema = z.object({
  integration_type: z.literal("jira"),
  domain: z.string().min(1, "Domain is required").optional(),
  user_mail: z.email({ error: "Invalid email format" }).optional(),
  api_token: z.string().min(1, "API token is required").optional(),
});

export type CreateValues = z.infer<typeof jiraIntegrationFormSchema>;
export type EditValues = z.infer<typeof editJiraIntegrationFormSchema>;
export type FormValues = CreateValues | EditValues;

export interface JiraCredentialsPayload {
  domain?: string;
  user_mail?: string;
  api_token?: string;
}
```

--------------------------------------------------------------------------------

---[FILE: processors.ts]---
Location: prowler-master/ui/types/processors.ts

```typescript
export interface ProcessorAttributes {
  inserted_at: string;
  updated_at: string;
  processor_type: "mutelist";
  configuration: string;
}

export interface ProcessorData {
  type: "processors";
  id: string;
  attributes: ProcessorAttributes;
}

export type MutedFindingsConfigActionState = {
  errors?: {
    configuration?: string;
    general?: string;
  };
  success?: string;
} | null;

export type DeleteMutedFindingsConfigActionState = {
  errors?: {
    general?: string;
  };
  success?: string;
} | null;
```

--------------------------------------------------------------------------------

---[FILE: providers.ts]---
Location: prowler-master/ui/types/providers.ts

```typescript
export const PROVIDER_TYPES = [
  "aws",
  "azure",
  "gcp",
  "kubernetes",
  "m365",
  "mongodbatlas",
  "github",
  "iac",
  "oraclecloud",
] as const;

export type ProviderType = (typeof PROVIDER_TYPES)[number];

export const PROVIDER_DISPLAY_NAMES: Record<ProviderType, string> = {
  aws: "AWS",
  azure: "Azure",
  gcp: "Google Cloud",
  kubernetes: "Kubernetes",
  m365: "Microsoft 365",
  mongodbatlas: "MongoDB Atlas",
  github: "GitHub",
  iac: "Infrastructure as Code",
  oraclecloud: "Oracle Cloud Infrastructure",
};

export function getProviderDisplayName(providerId: string): string {
  return (
    PROVIDER_DISPLAY_NAMES[providerId.toLowerCase() as ProviderType] ||
    providerId
  );
}

export interface ProviderProps {
  id: string;
  type: "providers";
  attributes: {
    provider: ProviderType;
    uid: string;
    alias: string;
    status: "completed" | "pending" | "cancelled";
    resources: number;
    connection: {
      connected: boolean;
      last_checked_at: string;
    };
    scanner_args: {
      only_logs: boolean;
      excluded_checks: string[];
      aws_retries_max_attempts: number;
    };
    inserted_at: string;
    updated_at: string;
    created_by: {
      object: string;
      id: string;
    };
  };
  relationships: {
    secret: {
      data: {
        type: string;
        id: string;
      } | null;
    };
    provider_groups: {
      meta: {
        count: number;
      };
      data: Array<{
        type: string;
        id: string;
      }>;
    };
  };
  groupNames?: string[];
}

export interface ProviderEntity {
  provider: ProviderType;
  uid: string;
  alias: string | null;
}

export interface ProviderConnectionStatus {
  label: string;
  value: string;
}

export interface ProvidersApiResponse {
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
  data: ProviderProps[];
  included?: Array<{
    type: string;
    id: string;
    attributes: Record<string, unknown>;
    relationships?: Record<string, unknown>;
  }>;
  meta: {
    pagination: {
      page: number;
      pages: number;
      count: number;
    };
    version: string;
  };
}
```

--------------------------------------------------------------------------------

---[FILE: resources.ts]---
Location: prowler-master/ui/types/resources.ts

```typescript
export interface ResourceProps {
  type: "resources";
  id: string;
  attributes: {
    inserted_at: string;
    updated_at: string;
    uid: string;
    name: string;
    region: string;
    service: string;
    tags: Record<string, string>;
    type: string;
    failed_findings_count: number;
    details: string | null;
    partition: string | null;
    metadata: Record<string, unknown> | null;
  };
  relationships: {
    provider: {
      data: {
        type: "providers";
        id: string;
        attributes: {
          inserted_at: string;
          updated_at: string;
          provider: string;
          uid: string;
          alias: string | null;
          connection: {
            connected: boolean;
            last_checked_at: string;
          };
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
    findings: {
      meta: {
        count: number;
      };
      data: {
        type: "findings";
        id: string;
        attributes: { status: string; delta: string };
      }[];
    };
  };
  links: {
    self: string;
  };
}

interface ResourceItemProps {
  type: "providers" | "findings";
  id: string;
  attributes: {
    uid: string;
    delta: string;
    status: "PASS" | "FAIL" | "MANUAL";
    status_extended: string;
    severity: "informational" | "low" | "medium" | "high" | "critical";
    check_id: string;
    check_metadata: CheckMetadataProps;
    raw_result: Record<string, unknown>;
    inserted_at: string;
    updated_at: string;
    first_seen_at: string;
    muted: boolean;
  };
  relationships: {
    secret: {
      data: {
        type: string;
        id: string;
      };
    };
    scan: {
      data: {
        type: string;
        id: string;
      };
    };
    provider_groups: {
      meta: {
        count: number;
      };
      data: [];
    };
  };
  links: {
    self: string;
  };
}

interface CheckMetadataProps {
  risk: string;
  notes: string;
  checkid: string;
  provider: string;
  severity: string;
  checktype: string[];
  dependson: string[];
  relatedto: string[];
  categories: string[];
  checktitle: string;
  compliance: unknown;
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
  servicename: string;
  checkaliases: string[];
  resourcetype: string;
  subservicename: string;
  resourceidtemplate: string;
}

interface Meta {
  version: string;
}

export interface ResourceApiResponse {
  data: ResourceProps;
  included: ResourceItemProps[];
  meta: Meta;
}
```

--------------------------------------------------------------------------------

---[FILE: scans.ts]---
Location: prowler-master/ui/types/scans.ts

```typescript
import { ProviderType } from "./providers";

export interface ScanProps {
  type: "scans";
  id: string;
  attributes: {
    name: string;
    trigger: "scheduled" | "manual";
    state:
      | "available"
      | "scheduled"
      | "executing"
      | "completed"
      | "failed"
      | "cancelled";
    unique_resource_count: number;
    progress: number;
    scanner_args: {
      only_logs?: boolean;
      excluded_checks?: string[];
      aws_retries_max_attempts?: number;
    } | null;
    duration: number;
    started_at: string;
    inserted_at: string;
    completed_at: string;
    scheduled_at: string;
    next_scan_at: string;
  };
  relationships: {
    provider: {
      data: {
        id: string;
        type: "providers";
      };
    };
    task: {
      data: {
        id: string;
        type: "tasks";
      };
    };
  };
  providerInfo?: {
    provider: ProviderType;
    uid: string;
    alias: string;
  };
}

export interface ScanEntity {
  id: string;
  providerInfo: {
    provider: ProviderType;
    alias?: string;
    uid?: string;
  };
  attributes: {
    name?: string;
    completed_at: string;
  };
}
export interface ExpandedScanData extends ScanProps {
  providerInfo: {
    provider: ProviderType;
    uid: string;
    alias: string;
  };
}

export interface ScansApiResponse {
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
  data: ScanProps[];
  included?: Array<{
    type: string;
    id: string;
    attributes: any;
    relationships?: any;
  }>;
  meta: {
    pagination: {
      page: number;
      pages: number;
      count: number;
    };
    version: string;
  };
}
```

--------------------------------------------------------------------------------

---[FILE: severities.ts]---
Location: prowler-master/ui/types/severities.ts

```typescript
export const SEVERITY_LEVELS = [
  "critical",
  "high",
  "medium",
  "low",
  "informational",
] as const;

export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

export const SEVERITY_DISPLAY_NAMES: Record<SeverityLevel, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  informational: "Informational",
};

// CSS variables for chart libraries (Recharts) that require inline style color values
export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  critical: "var(--color-bg-data-critical)",
  high: "var(--color-bg-data-high)",
  medium: "var(--color-bg-data-medium)",
  low: "var(--color-bg-data-low)",
  informational: "var(--color-bg-data-info)",
};

// Muted color for charts - uses CSS var() for Recharts inline style compatibility (same pattern as SEVERITY_COLORS)
export const MUTED_COLOR = "var(--color-bg-data-muted)";

export const SEVERITY_FILTER_MAP: Record<string, SeverityLevel> = {
  Critical: "critical",
  High: "high",
  Medium: "medium",
  Low: "low",
  Info: "informational",
  Informational: "informational",
};

export interface SeverityLineConfig {
  dataKey: SeverityLevel;
  color: string;
  label: string;
}

// Pre-built line configs for charts (ordered from lowest to highest severity)
export const SEVERITY_LINE_CONFIGS: SeverityLineConfig[] = [
  {
    dataKey: "informational",
    color: SEVERITY_COLORS.informational,
    label: SEVERITY_DISPLAY_NAMES.informational,
  },
  {
    dataKey: "low",
    color: SEVERITY_COLORS.low,
    label: SEVERITY_DISPLAY_NAMES.low,
  },
  {
    dataKey: "medium",
    color: SEVERITY_COLORS.medium,
    label: SEVERITY_DISPLAY_NAMES.medium,
  },
  {
    dataKey: "high",
    color: SEVERITY_COLORS.high,
    label: SEVERITY_DISPLAY_NAMES.high,
  },
  {
    dataKey: "critical",
    color: SEVERITY_COLORS.critical,
    label: SEVERITY_DISPLAY_NAMES.critical,
  },
];
```

--------------------------------------------------------------------------------

---[FILE: tasks.ts]---
Location: prowler-master/ui/types/tasks.ts

```typescript
export type TaskState =
  | "available"
  | "scheduled"
  | "executing"
  | "completed"
  | "failed"
  | "cancelled";

export interface TaskAttributes<R = unknown> {
  state?: TaskState;
  result?: R;
}

export interface TaskData<R = unknown> {
  attributes?: TaskAttributes<R>;
}

export type GetTaskResponse<R = unknown> =
  | { data: TaskData<R> }
  | { error: string };

export interface PollOptions {
  maxAttempts?: number;
  delayMs?: number;
}

export type PollSettledResult<R = unknown> =
  | {
      ok: true;
      state: TaskState;
      task: TaskData<R>;
      result: R | undefined;
    }
  | {
      ok: false;
      error: string;
      state?: TaskState;
      task?: TaskData<R>;
      result?: R;
    };
```

--------------------------------------------------------------------------------

````
