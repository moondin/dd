---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 847
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 847 of 867)

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

---[FILE: provider-helpers.ts]---
Location: prowler-master/ui/lib/provider-helpers.ts

```typescript
import {
  ProviderEntity,
  ProviderProps,
  ProvidersApiResponse,
  ProviderType,
} from "@/types/providers";

/**
 * Maps overview provider filters to findings page provider filters.
 * Converts provider_id__in to provider__in and removes provider_type__in
 * since provider__in is more specific.
 */
export const mapProviderFiltersForFindings = (
  params: URLSearchParams,
): void => {
  const providerIds = params.get("filter[provider_id__in]");
  if (providerIds) {
    params.delete("filter[provider_id__in]");
    params.delete("filter[provider_type__in]");
    params.set("filter[provider__in]", providerIds);
  }
};

/**
 * Maps overview provider filters to findings page provider filters (object version).
 * Converts provider_id__in to provider__in and removes provider_type__in
 * since provider__in is more specific.
 */
export const mapProviderFiltersForFindingsObject = <
  T extends Record<string, unknown>,
>(
  filters: T,
): T => {
  const result = { ...filters };
  const providerIdKey = "filter[provider_id__in]";
  const providerTypeKey = "filter[provider_type__in]";
  const providerKey = "filter[provider__in]";

  if (providerIdKey in result) {
    result[providerKey as keyof T] = result[providerIdKey as keyof T];
    delete result[providerIdKey as keyof T];
    delete result[providerTypeKey as keyof T];
  }

  return result;
};

export const extractProviderUIDs = (
  providersData: ProvidersApiResponse,
): string[] => {
  if (!providersData?.data) return [];

  return Array.from(
    new Set(
      providersData.data
        .map((provider: ProviderProps) => provider.attributes?.uid)
        .filter(Boolean),
    ),
  );
};

export const extractProviderIds = (
  providersData: ProvidersApiResponse,
): string[] => {
  if (!providersData?.data) return [];

  return providersData.data
    .map((provider: ProviderProps) => provider.id)
    .filter(Boolean);
};

export const createProviderDetailsMapping = (
  providerUIDs: string[],
  providersData: ProvidersApiResponse,
): Array<{ [uid: string]: ProviderEntity }> => {
  if (!providersData?.data) return [];

  return providerUIDs.map((uid) => {
    const provider = providersData.data.find(
      (p: { attributes: { uid: string } }) => p.attributes?.uid === uid,
    );

    return {
      [uid]: {
        provider: provider?.attributes?.provider || "aws",
        uid: uid,
        alias: provider?.attributes?.alias ?? null,
      },
    };
  });
};

export const createProviderDetailsMappingById = (
  providerIds: string[],
  providersData: ProvidersApiResponse,
): Array<{ [id: string]: ProviderEntity }> => {
  if (!providersData?.data) return [];

  return providerIds.map((id) => {
    const provider = providersData.data.find((p: ProviderProps) => p.id === id);

    return {
      [id]: {
        provider: provider?.attributes?.provider || "aws",
        uid: provider?.attributes?.uid || "",
        alias: provider?.attributes?.alias ?? null,
      },
    };
  });
};

// Helper function to determine which form type to show
export type ProviderFormType =
  | "selector"
  | "credentials"
  | "role"
  | "service-account"
  | null;

export const getProviderFormType = (
  providerType: ProviderType,
  via?: string,
): ProviderFormType => {
  // Providers that need credential type selection
  const needsSelector = ["aws", "gcp", "github", "m365"].includes(providerType);

  // Show selector if no via parameter and provider needs it
  if (needsSelector && !via) {
    return "selector";
  }

  // AWS specific forms
  if (providerType === "aws") {
    if (via === "role") return "role";
    if (via === "credentials") return "credentials";
  }

  // GCP specific forms
  if (providerType === "gcp") {
    if (via === "service-account") return "service-account";
    if (via === "credentials") return "credentials";
  }

  // GitHub credential types
  if (
    providerType === "github" &&
    ["personal_access_token", "oauth_app", "github_app"].includes(via || "")
  ) {
    return "credentials";
  }

  // M365 credential types
  if (
    providerType === "m365" &&
    ["app_client_secret", "app_certificate"].includes(via || "")
  ) {
    return "credentials";
  }

  // Other providers go directly to credentials form
  if (!needsSelector) {
    return "credentials";
  }

  return null;
};

// Helper to check if back button should be shown based on via parameter
export const requiresBackButton = (via?: string | null): boolean => {
  if (!via) return false;

  const validViaTypes = [
    "credentials",
    "role",
    "service-account",
    "personal_access_token",
    "oauth_app",
    "github_app",
    "app_client_secret",
    "app_certificate",
  ];

  return validViaTypes.includes(via);
};
```

--------------------------------------------------------------------------------

---[FILE: sentry-breadcrumbs.ts]---
Location: prowler-master/ui/lib/sentry-breadcrumbs.ts

```typescript
/**
 * Sentry Breadcrumb Utilities
 *
 * Provides helper functions to add breadcrumbs for tracking critical paths
 * and user actions throughout the application.
 *
 * Usage:
 * ```typescript
 * import { addUserAction, addApiCall, addTaskEvent } from '@/lib/sentry-breadcrumbs';
 *
 * addUserAction('clicked_create_scan', { provider: 'aws' });
 * addApiCall('POST /scans', 'success');
 * addTaskEvent('scan_started', 'scan-123');
 * ```
 */

import * as Sentry from "@sentry/nextjs";

export interface BreadcrumbContext {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Add breadcrumb for user actions
 * @param action - User action identifier
 * @param context - Additional context data
 */
export function addUserAction(action: string, context?: BreadcrumbContext) {
  Sentry.addBreadcrumb({
    message: `User action: ${action}`,
    category: "user.action",
    level: "info",
    data: context,
  });
}

/**
 * Add breadcrumb for API calls
 * @param endpoint - API endpoint (e.g., "GET /scans")
 * @param status - Status of the call (success, error, timeout)
 * @param context - Additional context data
 */
export function addApiCall(
  endpoint: string,
  status: "success" | "error" | "timeout",
  context?: BreadcrumbContext,
) {
  Sentry.addBreadcrumb({
    message: `API ${endpoint}`,
    category: "api",
    level: status === "error" ? "warning" : "info",
    data: {
      status,
      ...context,
    },
  });
}

/**
 * Add breadcrumb for task events
 * @param event - Task event (started, completed, failed)
 * @param taskId - Task identifier
 * @param context - Additional context data
 */
export function addTaskEvent(
  event: "started" | "completed" | "failed" | "timeout",
  taskId: string,
  context?: BreadcrumbContext,
) {
  Sentry.addBreadcrumb({
    message: `Task ${event}: ${taskId}`,
    category: "task",
    level: event === "failed" ? "warning" : "info",
    data: {
      task_id: taskId,
      ...context,
    },
  });
}

/**
 * Add breadcrumb for authentication events
 * @param event - Auth event (login, logout, signup)
 * @param context - Additional context data
 */
export function addAuthEvent(
  event: "login" | "logout" | "signup" | "error",
  context?: BreadcrumbContext,
) {
  Sentry.addBreadcrumb({
    message: `Auth event: ${event}`,
    category: "auth",
    level: event === "error" ? "warning" : "info",
    data: context,
  });
}

/**
 * Add breadcrumb for form submissions
 * @param formName - Name of the form
 * @param status - Status of submission
 * @param context - Additional context data
 */
export function addFormSubmission(
  formName: string,
  status: "started" | "success" | "error",
  context?: BreadcrumbContext,
) {
  Sentry.addBreadcrumb({
    message: `Form submission: ${formName}`,
    category: "form",
    level: status === "error" ? "warning" : "info",
    data: {
      status,
      ...context,
    },
  });
}

/**
 * Add breadcrumb for navigation
 * @param from - Source path
 * @param to - Destination path
 */
export function addNavigation(from: string, to: string) {
  Sentry.addBreadcrumb({
    message: `Navigation: ${from} → ${to}`,
    category: "navigation",
    level: "info",
  });
}

/**
 * Add breadcrumb for scan operations
 * @param operation - Operation type (create, start, cancel, etc.)
 * @param scanId - Scan identifier
 * @param context - Additional context data
 */
export function addScanOperation(
  operation: "create" | "start" | "cancel" | "pause" | "resume",
  scanId?: string,
  context?: BreadcrumbContext,
) {
  Sentry.addBreadcrumb({
    message: `Scan ${operation}${scanId ? `: ${scanId}` : ""}`,
    category: "scan",
    level: "info",
    data: {
      scan_id: scanId,
      ...context,
    },
  });
}

/**
 * Add breadcrumb for data mutations
 * @param entity - Entity type (provider, scan, role, etc.)
 * @param action - Action type (create, update, delete)
 * @param entityId - Entity identifier
 * @param context - Additional context data
 */
export function addDataMutation(
  entity: string,
  action: "create" | "update" | "delete",
  entityId?: string,
  context?: BreadcrumbContext,
) {
  Sentry.addBreadcrumb({
    message: `Data mutation: ${action} ${entity}${entityId ? ` (${entityId})` : ""}`,
    category: "data",
    level: "info",
    data: {
      entity,
      action,
      entity_id: entityId,
      ...context,
    },
  });
}
```

--------------------------------------------------------------------------------

---[FILE: server-actions-helper.ts]---
Location: prowler-master/ui/lib/server-actions-helper.ts
Signals: Next.js

```typescript
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

import { SentryErrorSource, SentryErrorType } from "@/sentry";

import { getErrorMessage, parseStringify } from "./helper";

/**
 * Helper function to handle API responses consistently
 * Includes Sentry error tracking for debugging
 */
export const handleApiResponse = async (
  response: Response,
  pathToRevalidate?: string,
  parse = true,
) => {
  if (!response.ok) {
    // Read error body safely; prefer JSON, fallback to plain text
    const rawErrorText = await response.text().catch(() => "");
    let errorData: any = null;
    try {
      errorData = rawErrorText ? JSON.parse(rawErrorText) : null;
    } catch {
      errorData = null;
    }

    const errorsArray = Array.isArray(errorData?.errors)
      ? (errorData.errors as any[])
      : undefined;
    const errorDetail =
      errorsArray?.[0]?.detail ||
      errorData?.error ||
      errorData?.message ||
      (rawErrorText && rawErrorText.trim()) ||
      response.statusText ||
      "Oops! Something went wrong.";

    // Capture error context for Sentry
    const errorContext = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorDetail,
      pathToRevalidate,
    };

    // 5XX errors - Server errors (high priority)
    if (response.status >= 500) {
      const serverError = new Error(
        errorDetail ||
          `Server error (${response.status}): The server encountered an error. Please try again later.`,
      );

      Sentry.captureException(serverError, {
        tags: {
          api_error: true,
          status_code: response.status.toString(),
          error_type: SentryErrorType.SERVER_ERROR,
          error_source: SentryErrorSource.HANDLE_API_RESPONSE,
        },
        level: "error",
        contexts: {
          api_response: errorContext,
        },
        fingerprint: [
          "api-server-error",
          response.status.toString(),
          response.url,
        ],
      });

      throw serverError;
    }

    // Client errors (4xx) - Only capture unexpected ones
    if (![401, 403, 404].includes(response.status)) {
      const clientError = new Error(
        errorDetail ||
          `Request failed (${response.status}): ${response.statusText}`,
      );

      Sentry.captureException(clientError, {
        tags: {
          api_error: true,
          status_code: response.status.toString(),
          error_type: SentryErrorType.CLIENT_ERROR,
          error_source: SentryErrorSource.HANDLE_API_RESPONSE,
        },
        level: "warning",
        contexts: {
          api_response: errorContext,
        },
        fingerprint: [
          "api-client-error",
          response.status.toString(),
          response.url,
        ],
      });
    }

    return errorsArray
      ? { error: errorDetail, errors: errorsArray, status: response.status }
      : ({ error: errorDetail, status: response.status } as any);
  }

  // Handle empty or no-content responses gracefully (e.g., 204, empty body)
  if (response.status === 204) {
    if (pathToRevalidate && pathToRevalidate !== "") {
      revalidatePath(pathToRevalidate);
    }
    return { success: true, status: response.status } as any;
  }

  // Read raw text to determine if there's a body to parse
  const rawText = await response.text();
  const hasBody = rawText && rawText.trim().length > 0;

  if (!hasBody) {
    if (pathToRevalidate && pathToRevalidate !== "") {
      revalidatePath(pathToRevalidate);
    }
    return { success: true, status: response.status } as any;
  }

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    // If body isn't valid JSON, return as text payload
    data = { data: rawText };
  }

  if (pathToRevalidate && pathToRevalidate !== "") {
    revalidatePath(pathToRevalidate);
  }

  return parse ? parseStringify(data) : data;
};

/**
 * Helper function to handle API errors consistently
 * Includes Sentry error tracking
 */
export const handleApiError = (error: unknown): { error: string } => {
  console.error(error);

  // Check if this error was already captured by handleApiResponse
  const isAlreadyCaptured =
    error instanceof Error &&
    (error.message.includes("Server error") ||
      error.message.includes("Request failed"));

  // Only capture if not already captured by handleApiResponse
  if (!isAlreadyCaptured) {
    if (error instanceof Error) {
      // Don't capture expected errors
      if (
        !error.message.includes("401") &&
        !error.message.includes("403") &&
        !error.message.includes("404")
      ) {
        Sentry.captureException(error, {
          tags: {
            error_source: SentryErrorSource.HANDLE_API_ERROR,
            error_type: SentryErrorType.UNEXPECTED_ERROR,
          },
          level: "error",
          contexts: {
            error_details: {
              message: error.message,
              stack: error.stack,
            },
          },
        });
      }
    } else {
      // Capture non-Error objects
      Sentry.captureMessage(
        `Non-Error object in handleApiError: ${String(error)}`,
        {
          level: "warning",
          tags: {
            error_source: SentryErrorSource.HANDLE_API_ERROR,
            error_type: SentryErrorType.NON_ERROR_OBJECT,
          },
          extra: {
            error: error,
          },
        },
      );
    }
  }

  return {
    error: getErrorMessage(error),
  };
};
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: prowler-master/ui/lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SPECIAL_CHARACTERS = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

/**
 * Calculates a percentage and rounds it to the nearest integer
 * @param value - The numerator value
 * @param total - The denominator value
 * @returns The rounded percentage (0-100), or 0 if total is 0
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
```

--------------------------------------------------------------------------------

---[FILE: yaml.ts]---
Location: prowler-master/ui/lib/yaml.ts

```typescript
import yaml from "js-yaml";

import { mutedFindingsConfigFormSchema } from "@/types/formSchemas";

/**
 * Validates if a string is valid YAML and returns detailed validation result
 */
export const validateYaml = (
  val: string,
): { isValid: boolean; error?: string } => {
  try {
    const parsed = yaml.load(val);

    if (parsed === null || parsed === undefined) {
      return { isValid: false, error: "YAML content is empty or null" };
    }

    if (typeof parsed !== "object" || Array.isArray(parsed)) {
      return {
        isValid: false,
        error: "YAML must be an object, not an array or primitive value",
      };
    }

    return { isValid: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown YAML parsing error";
    return { isValid: false, error: errorMessage };
  }
};

/**
 * Validates if a YAML string contains a valid mutelist structure and returns detailed validation result
 */
export const validateMutelistYaml = (
  val: string,
): { isValid: boolean; error?: string } => {
  try {
    const parsed = yaml.load(val) as Record<string, any>;

    // yaml.load() can return null, arrays, or primitives
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { isValid: false, error: "YAML content must be a valid object" };
    }

    // Verify structure using optional chaining
    const accounts = parsed.Mutelist?.Accounts;
    if (!accounts || typeof accounts !== "object" || Array.isArray(accounts)) {
      return {
        isValid: false,
        error: "Missing or invalid 'Mutelist.Accounts' structure",
      };
    }

    const accountKeys = Object.keys(accounts);
    if (accountKeys.length === 0) {
      return {
        isValid: false,
        error: "At least one account must be defined in 'Mutelist.Accounts'",
      };
    }

    for (const accountKey of accountKeys) {
      const account = accounts[accountKey];
      if (!account || typeof account !== "object" || Array.isArray(account)) {
        return {
          isValid: false,
          error: `Account '${accountKey}' must be a valid object`,
        };
      }

      const checks = account.Checks;
      if (!checks || typeof checks !== "object" || Array.isArray(checks)) {
        return {
          isValid: false,
          error: `Missing or invalid 'Checks' structure for account '${accountKey}'`,
        };
      }

      const checkKeys = Object.keys(checks);
      if (checkKeys.length === 0) {
        return {
          isValid: false,
          error: `At least one check must be defined for account '${accountKey}'`,
        };
      }

      for (const checkKey of checkKeys) {
        const check = checks[checkKey];
        if (!check || typeof check !== "object" || Array.isArray(check)) {
          return {
            isValid: false,
            error: `Check '${checkKey}' in account '${accountKey}' must be a valid object`,
          };
        }

        const { Regions: regions, Resources: resources } = check;
        if (!Array.isArray(regions)) {
          return {
            isValid: false,
            error: `'Regions' must be an array in check '${checkKey}' for account '${accountKey}'`,
          };
        }
        if (!Array.isArray(resources)) {
          return {
            isValid: false,
            error: `'Resources' must be an array in check '${checkKey}' for account '${accountKey}'`,
          };
        }
      }
    }

    return { isValid: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error validating mutelist structure";
    return { isValid: false, error: errorMessage };
  }
};

/**
 * Validates YAML using the mutelist schema and returns detailed error information
 */
export const parseYamlValidation = (
  yamlString: string,
): { isValid: boolean; error?: string } => {
  try {
    const result = mutedFindingsConfigFormSchema.safeParse({
      configuration: yamlString,
    });

    if (result.success) {
      return { isValid: true };
    } else {
      const firstError = result.error.issues[0];
      return {
        isValid: false,
        error: firstError.message,
      };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown validation error";
    return { isValid: false, error: errorMessage };
  }
};

/**
 * Converts a configuration (string or object) to YAML format
 */
export const convertToYaml = (config: string | object): string => {
  if (!config) return "";

  try {
    // If it's already an object, convert directly to YAML
    if (typeof config === "object") {
      return yaml.dump(config, { indent: 2 });
    }

    // If it's a string, try to parse as JSON first
    try {
      const jsonConfig = JSON.parse(config);
      return yaml.dump(jsonConfig, { indent: 2 });
    } catch {
      // If it's not JSON, assume it's already YAML
      return config;
    }
  } catch (error) {
    return config.toString();
  }
};

export const defaultMutedFindingsConfig = `# If no Mutelist is provided, a default one is used for AWS accounts to exclude certain predefined resources.

# The default AWS Mutelist is defined here: https://github.com/prowler-cloud/prowler/blob/master/prowler/config/aws_mutelist.yaml

Mutelist:
  Accounts:
    "*":
      ########################### AWS CONTROL TOWER ###########################
      ### The following entries includes all resources created by AWS Control Tower when setting up a landing zone ###
      # https://docs.aws.amazon.com/controltower/latest/userguide/shared-account-resources.html #
      Checks:
        "awslambda_function_*":
          Regions:
            - "*"
          Resources:
            - "aws-controltower-NotificationForwarder"
          Description: "Checks from AWS lambda functions muted by default"
        "cloudformation_stack*":
          Regions:
            - "*"
          Resources:
            - "StackSet-AWSControlTowerGuardrailAWS-*"
            - "StackSet-AWSControlTowerBP-*"
            - "StackSet-AWSControlTowerSecurityResources-*"
            - "StackSet-AWSControlTowerLoggingResources-*"
            - "StackSet-AWSControlTowerExecutionRole-*"
            - "AWSControlTowerBP-BASELINE-CLOUDTRAIL-MASTER*"
            - "AWSControlTowerBP-BASELINE-CONFIG-MASTER*"
            - "StackSet-AWSControlTower*"
            - "CLOUDTRAIL-ENABLED-ON-SHARED-ACCOUNTS-*"
            - "AFT-Backend*"
        "cloudtrail_*":
          Regions:
            - "*"
          Resources:
            - "aws-controltower-BaselineCloudTrail"
        "cloudwatch_log_group_*":
          Regions:
            - "*"
          Resources:
            - "aws-controltower/CloudTrailLogs"
            - "/aws/lambda/aws-controltower-NotificationForwarder"
            - "StackSet-AWSControlTowerBP-*"
        "iam_inline_policy_no_administrative_privileges":
          Regions:
            - "*"
          Resources:
            - "aws-controltower-ForwardSnsNotificationRole/sns"
            - "aws-controltower-AuditAdministratorRole/AssumeRole-aws-controltower-AuditAdministratorRole"
            - "aws-controltower-AuditReadOnlyRole/AssumeRole-aws-controltower-AuditReadOnlyRole"
        "iam.*policy_*":
          Regions:
            - "*"
          Resources:
            - "AWSControlTowerAccountServiceRolePolicy"
            - "AWSControlTowerServiceRolePolicy"
            - "AWSControlTowerStackSetRolePolicy"
            - "AWSControlTowerAdminPolicy"
            - "AWSLoadBalancerControllerIAMPolicy"
            - "AWSControlTowerCloudTrailRolePolicy"
        "iam_role_*":
          Regions:
            - "*"
          Resources:
            - "aws-controltower-AdministratorExecutionRole"
            - "aws-controltower-AuditAdministratorRole"
            - "aws-controltower-AuditReadOnlyRole"
            - "aws-controltower-CloudWatchLogsRole"
            - "aws-controltower-ConfigRecorderRole"
            - "aws-controltower-ForwardSnsNotificationRole"
            - "aws-controltower-ReadOnlyExecutionRole"
            - "AWSControlTower_VPCFlowLogsRole"
            - "AWSControlTowerExecution"
            - "AWSControlTowerCloudTrailRole"
            - "AWSControlTowerConfigAggregatorRoleForOrganizations"
            - "AWSControlTowerStackSetRole"
            - "AWSControlTowerAdmin"
            - "AWSAFTAdmin"
            - "AWSAFTExecution"
            - "AWSAFTService"
        "s3_bucket_*":
          Regions:
            - "*"
          Resources:
            - "aws-controltower-logs-*"
            - "aws-controltower-s3-access-logs-*"
        "sns_*":
          Regions:
            - "*"
          Resources:
            - "aws-controltower-AggregateSecurityNotifications"
            - "aws-controltower-AllConfigNotifications"
            - "aws-controltower-SecurityNotifications"
        "vpc_*":
          Regions:
            - "*"
          Resources:
            - "*"
          Tags:
            - "Name=aws-controltower-VPC"`;
```

--------------------------------------------------------------------------------

---[FILE: colors.ts]---
Location: prowler-master/ui/lib/charts/colors.ts

```typescript
// CSS variable names for chart colors defined in globals.css
export const CHART_COLOR_MAP: Record<string, string> = {
  // Status colors
  Success: "--color-bg-pass",
  Pass: "--color-bg-pass",
  Fail: "--color-bg-fail",
  // Provider colors
  AWS: "--color-bg-data-aws",
  Azure: "--color-bg-data-azure",
  "Google Cloud": "--color-bg-data-gcp",
  Kubernetes: "--color-bg-data-kubernetes",
  "Microsoft 365": "--color-bg-data-m365",
  GitHub: "--color-bg-data-github",
  "Infrastructure as Code": "--color-bg-data-muted",
  "Oracle Cloud Infrastructure": "--color-bg-data-muted",
  // Severity colors
  Critical: "--color-bg-data-critical",
  High: "--color-bg-data-high",
  Medium: "--color-bg-data-medium",
  Low: "--color-bg-data-low",
  Info: "--color-bg-data-info",
  Informational: "--color-bg-data-info",
};

/**
 * Compute color value from CSS variable name at runtime.
 * SVG fill attributes cannot directly resolve CSS variables,
 * so we extract computed values from globals.css CSS variables.
 * Falls back to black (#000000) if variable not found or access fails.
 */
export function getChartColor(colorName: string): string {
  const varName = CHART_COLOR_MAP[colorName];
  if (!varName) return "#000000";

  try {
    if (typeof document === "undefined") {
      return "#000000";
    }
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim() || "#000000"
    );
  } catch {
    return "#000000";
  }
}

export function initializeChartColors(): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const [colorName] of Object.entries(CHART_COLOR_MAP)) {
    colors[colorName] = getChartColor(colorName);
  }
  return colors;
}
```

--------------------------------------------------------------------------------

---[FILE: aws-well-architected.tsx]---
Location: prowler-master/ui/lib/compliance/aws-well-architected.tsx

```typescript
import { ClientAccordionContent } from "@/components/compliance/compliance-accordion/client-accordion-content";
import { ComplianceAccordionRequirementTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-requeriment-title";
import { ComplianceAccordionTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-title";
import { AccordionItemProps } from "@/components/ui/accordion/Accordion";
import { FindingStatus } from "@/components/ui/table/status-finding-badge";
import {
  AttributesData,
  AWSWellArchitectedAttributesMetadata,
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
      ?.metadata as unknown as AWSWellArchitectedAttributesMetadata[];
    const attrs = metadataArray?.[0];
    if (!attrs) continue;

    // Get corresponding requirement data
    const requirementData = requirementsMap.get(id);
    if (!requirementData) continue;

    const frameworkName = attributeItem.attributes.framework;
    const sectionName = attrs.Section || "";
    const subSectionName = attrs.SubSection || "";
    const description = attributeItem.attributes.description;
    const status = requirementData.attributes.status || "";
    const checks = attributeItem.attributes.attributes.check_ids || [];
    const requirementName = id;

    if (!sectionName || !subSectionName) {
      continue;
    }

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
      well_architected_name: attrs.Name,
      well_architected_question_id: attrs.WellArchitectedQuestionId,
      well_architected_practice_id: attrs.WellArchitectedPracticeId,
      level_of_risk: attrs.LevelOfRisk,
      assessment_method: attrs.AssessmentMethod,
      implementation_guidance_url: attrs.ImplementationGuidanceUrl,
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
                    name={
                      (requirement.well_architected_name as string) ||
                      requirement.name
                    }
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

---[FILE: c5.tsx]---
Location: prowler-master/ui/lib/compliance/c5.tsx

```typescript
import { ClientAccordionContent } from "@/components/compliance/compliance-accordion/client-accordion-content";
import { ComplianceAccordionRequirementTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-requeriment-title";
import { ComplianceAccordionTitle } from "@/components/compliance/compliance-accordion/compliance-accordion-title";
import { AccordionItemProps } from "@/components/ui/accordion/Accordion";
import { FindingStatus } from "@/components/ui/table/status-finding-badge";
import {
  AttributesData,
  C5AttributesMetadata,
  Control,
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

const getStatusCounters = (status: RequirementStatus) => ({
  pass: status === REQUIREMENT_STATUS.PASS ? 1 : 0,
  fail: status === REQUIREMENT_STATUS.FAIL ? 1 : 0,
  manual: status === REQUIREMENT_STATUS.MANUAL ? 1 : 0,
});

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
      ?.metadata as unknown as C5AttributesMetadata[];
    const attrs = metadataArray?.[0];
    if (!attrs) continue;

    // Get corresponding requirement data
    const requirementData = requirementsMap.get(id);
    if (!requirementData) continue;

    const frameworkName = attributeItem.attributes.framework;
    const categoryName = attrs.Section; // Level 1: Section (e.g., "Organisation of Information Security (OIS)")
    const controlLabel = attrs.SubSection; // Level 2: SubSection (e.g., "OIS-01 Information Security Management System (ISMS)")
    const description = attributeItem.attributes.description;
    const status = requirementData.attributes.status || "";
    const checks = attributeItem.attributes.attributes.check_ids || [];
    const requirementName = id;

    // Find or create framework using common helper
    const framework = findOrCreateFramework(frameworks, frameworkName);

    // Find or create category (Section) using common helper
    const category = findOrCreateCategory(framework.categories, categoryName);

    // Find or create control (SubSection) using common helper
    const control = findOrCreateControl(category.controls, controlLabel);

    // Create requirement
    const finalStatus: RequirementStatus = status as RequirementStatus;
    const requirement: Requirement = {
      name: requirementName,
      description,
      status: finalStatus,
      check_ids: checks,
      ...getStatusCounters(finalStatus),
      type: attrs.Type,
      about_criteria: attrs.AboutCriteria,
      complementary_criteria: attrs.ComplementaryCriteria,
    };

    control.requirements.push(requirement);
  }

  // Calculate counters using common helper
  calculateFrameworkCounters(frameworks);

  return frameworks;
};

const createRequirementItem = (
  requirement: Requirement,
  frameworkName: string,
  categoryName: string,
  controlIndex: number,
  reqIndex: number,
  scanId: string,
): AccordionItemProps => ({
  key: `${frameworkName}-${categoryName}-control-${controlIndex}-req-${reqIndex}`,
  title: (
    <ComplianceAccordionRequirementTitle
      type={requirement.type as string}
      name={requirement.name}
      status={requirement.status as FindingStatus}
    />
  ),
  content: (
    <ClientAccordionContent
      key={`content-${frameworkName}-${categoryName}-control-${controlIndex}-req-${reqIndex}`}
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

const createControlItem = (
  control: Control,
  frameworkName: string,
  categoryName: string,
  controlIndex: number,
  scanId: string,
): AccordionItemProps => ({
  key: `${frameworkName}-${categoryName}-control-${controlIndex}`,
  title: (
    <ComplianceAccordionTitle
      label={control.label}
      pass={control.pass}
      fail={control.fail}
      manual={control.manual}
    />
  ),
  content: "",
  items: control.requirements.map((requirement, reqIndex) =>
    createRequirementItem(
      requirement,
      frameworkName,
      categoryName,
      controlIndex,
      reqIndex,
      scanId,
    ),
  ),
  isDisabled: control.pass === 0 && control.fail === 0 && control.manual === 0,
});

export const toAccordionItems = (
  data: Framework[],
  scanId: string | undefined,
): AccordionItemProps[] => {
  const safeId = scanId || "";

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
      items: category.controls.map((control, controlIndex) =>
        createControlItem(
          control,
          framework.name,
          category.name,
          controlIndex,
          safeId,
        ),
      ),
    })),
  );
};
```

--------------------------------------------------------------------------------

````
