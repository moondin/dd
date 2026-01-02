---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 846
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 846 of 867)

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

---[FILE: error-mappings.ts]---
Location: prowler-master/ui/lib/error-mappings.ts

```typescript
import {
  ErrorPointers,
  ProviderCredentialFields,
} from "./provider-credentials/provider-credential-fields";

/**
 * Error pointer to field name mappings for different types of forms
 * These can be imported and used with the useFormServerErrors hook
 */

// Mapping for provider credentials forms
export const PROVIDER_CREDENTIALS_ERROR_MAPPING: Record<string, string> = {
  [ErrorPointers.AWS_ACCESS_KEY_ID]: ProviderCredentialFields.AWS_ACCESS_KEY_ID,
  [ErrorPointers.AWS_SECRET_ACCESS_KEY]:
    ProviderCredentialFields.AWS_SECRET_ACCESS_KEY,
  [ErrorPointers.AWS_SESSION_TOKEN]: ProviderCredentialFields.AWS_SESSION_TOKEN,
  [ErrorPointers.CLIENT_ID]: ProviderCredentialFields.CLIENT_ID,
  [ErrorPointers.CLIENT_SECRET]: ProviderCredentialFields.CLIENT_SECRET,
  [ErrorPointers.USER]: ProviderCredentialFields.USER,
  [ErrorPointers.PASSWORD]: ProviderCredentialFields.PASSWORD,
  [ErrorPointers.TENANT_ID]: ProviderCredentialFields.TENANT_ID,
  [ErrorPointers.KUBECONFIG_CONTENT]:
    ProviderCredentialFields.KUBECONFIG_CONTENT,
  [ErrorPointers.REFRESH_TOKEN]: ProviderCredentialFields.REFRESH_TOKEN,
  [ErrorPointers.ROLE_ARN]: ProviderCredentialFields.ROLE_ARN,
  [ErrorPointers.EXTERNAL_ID]: ProviderCredentialFields.EXTERNAL_ID,
  [ErrorPointers.SESSION_DURATION]: ProviderCredentialFields.SESSION_DURATION,
  [ErrorPointers.ROLE_SESSION_NAME]: ProviderCredentialFields.ROLE_SESSION_NAME,
  [ErrorPointers.SERVICE_ACCOUNT_KEY]:
    ProviderCredentialFields.SERVICE_ACCOUNT_KEY,
  [ErrorPointers.ATLAS_PUBLIC_KEY]: ProviderCredentialFields.ATLAS_PUBLIC_KEY,
  [ErrorPointers.ATLAS_PRIVATE_KEY]: ProviderCredentialFields.ATLAS_PRIVATE_KEY,
};
```

--------------------------------------------------------------------------------

---[FILE: external-urls.ts]---
Location: prowler-master/ui/lib/external-urls.ts

```typescript
import { IntegrationType } from "../types/integrations";

export const getProviderHelpText = (provider: string) => {
  switch (provider) {
    case "aws":
      return {
        text: "Need help connecting your AWS account?",
        link: "https://goto.prowler.com/provider-aws",
      };
    case "azure":
      return {
        text: "Need help connecting your Azure subscription?",
        link: "https://goto.prowler.com/provider-azure",
      };
    case "m365":
      return {
        text: "Need help connecting your Microsoft 365 account?",
        link: "https://goto.prowler.com/provider-m365",
      };
    case "gcp":
      return {
        text: "Need help connecting your GCP project?",
        link: "https://goto.prowler.com/provider-gcp",
      };
    case "kubernetes":
      return {
        text: "Need help connecting your Kubernetes cluster?",
        link: "https://goto.prowler.com/provider-k8s",
      };
    case "github":
      return {
        text: "Need help connecting your GitHub account?",
        link: "https://goto.prowler.com/provider-github",
      };
    case "iac":
      return {
        text: "Need help scanning your Infrastructure as Code repository?",
        link: "https://goto.prowler.com/provider-iac",
      };
    case "oraclecloud":
      return {
        text: "Need help connecting your Oracle Cloud account?",
        link: "https://goto.prowler.com/provider-oraclecloud",
      };
    case "mongodbatlas":
      return {
        text: "Need help connecting your MongoDB Atlas organization?",
        link: "https://goto.prowler.com/provider-mongodbatlas",
      };
    default:
      return {
        text: "How to setup a provider?",
        link: "https://goto.prowler.com/provider-help",
      };
  }
};

export const getAWSCredentialsTemplateLinks = (
  externalId: string,
  bucketName?: string,
  integrationType?: IntegrationType,
): {
  cloudformation: string;
  terraform: string;
  cloudformationQuickLink: string;
} => {
  let links = {};

  if (integrationType === undefined || integrationType === "aws_security_hub") {
    links = {
      cloudformation:
        "https://github.com/prowler-cloud/prowler/blob/master/permissions/templates/cloudformation/prowler-scan-role.yml",
      terraform:
        "https://github.com/prowler-cloud/prowler/tree/master/permissions/templates/terraform",
    };
  }

  if (integrationType === "amazon_s3") {
    links = {
      cloudformation:
        "https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-s3-integration/",
      terraform:
        "https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-s3-integration/#terraform",
    };
  }

  return {
    ...(links as {
      cloudformation: string;
      terraform: string;
    }),
    cloudformationQuickLink: `https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateURL=https%3A%2F%2Fprowler-cloud-public.s3.eu-west-1.amazonaws.com%2Fpermissions%2Ftemplates%2Faws%2Fcloudformation%2Fprowler-scan-role.yml&stackName=Prowler&param_ExternalId=${externalId}${bucketName ? `&param_EnableS3Integration=true&param_S3IntegrationBucketName=${bucketName}` : ""}`,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: feeds-storage.ts]---
Location: prowler-master/ui/lib/feeds-storage.ts

```typescript
// Utility functions for managing feed state in localStorage

const STORAGE_KEY = "prowler-feeds-last-seen";

interface FeedStorage {
  lastSeenIds: string[];
  lastCheckTimestamp: number;
}

/**
 * Get the last seen feed IDs from localStorage
 */
export function getLastSeenFeedIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const data: FeedStorage = JSON.parse(stored);
    return data.lastSeenIds || [];
  } catch {
    return [];
  }
}

/**
 * Save the current feed IDs as seen
 */
export function markFeedsAsSeen(feedIds: string[]): void {
  if (typeof window === "undefined") return;

  try {
    const data: FeedStorage = {
      lastSeenIds: feedIds,
      lastCheckTimestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Check if there are new feeds (feeds that haven't been seen before)
 */
export function hasNewFeeds(currentFeedIds: string[]): boolean {
  const lastSeenIds = getLastSeenFeedIds();

  // If no feeds stored, everything is new
  if (lastSeenIds.length === 0 && currentFeedIds.length > 0) {
    return true;
  }

  // Check if there are any current feeds not in the last seen list
  return currentFeedIds.some((id) => !lastSeenIds.includes(id));
}
```

--------------------------------------------------------------------------------

---[FILE: helper-filters.ts]---
Location: prowler-master/ui/lib/helper-filters.ts

```typescript
import { ProviderProps, ProvidersApiResponse, ScanProps } from "@/types";
import { FilterEntity } from "@/types/filters";
import { ProviderConnectionStatus } from "@/types/providers";
import { ScanEntity } from "@/types/scans";

/**
 * Extracts normalized filters and search query from the URL search params.
 * Used Server Side Rendering (SSR). There is a hook (useUrlFilters) for client side.
 */
export const extractFiltersAndQuery = (
  searchParams: Record<string, unknown>,
) => {
  const filters: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(searchParams)
        .filter(([key]) => key.startsWith("filter["))
        .map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(",") : value?.toString() || "",
        ]),
    ),
  };

  const query = filters["filter[search]"] || "";
  return { filters, query };
};

/**
 * Returns true if there are any scan or inserted_at filters in the search params.
 * Used to determine whether to call the full findings endpoint.
 */
export const hasDateOrScanFilter = (searchParams: Record<string, unknown>) =>
  Object.keys(searchParams).some(
    (key) => key.includes("inserted_at") || key.includes("scan__in"),
  );

/**
 * Encodes sort strings by removing leading "+" symbols.
 */
export const encodeSort = (sort?: string) => sort?.replace(/^\+/, "") || "";

/**
 * Extracts the sort string and the stable key to use in Suspense boundaries.
 */
export const extractSortAndKey = (searchParams: Record<string, unknown>) => {
  const searchParamsKey = JSON.stringify(searchParams || {});
  const rawSort = searchParams.sort?.toString();
  const encodedSort = encodeSort(rawSort);

  return { searchParamsKey, rawSort, encodedSort };
};

/**
 * Replaces a specific field name inside a filter-style key of an object.
 * @param obj - The input object with filter-style keys (e.g., { 'filter[inserted_at]': '2025-05-21' }).
 * @param oldField - The field name to be replaced (e.g., 'inserted_at').
 * @param newField - The field name to replace with (e.g., 'updated_at').
 * @returns A new object with the updated filter key if a match is found.
 */
export function replaceFieldKey(
  obj: Record<string, string>,
  oldField: string,
  newField: string,
): Record<string, string> {
  const fieldObj: Record<string, string> = {};

  for (const key in obj) {
    const match = key.match(/^filter\[(.+)\]$/);
    if (match && match[1] === oldField) {
      const newKey = `filter[${newField}]`;
      fieldObj[newKey] = obj[key];
    } else {
      fieldObj[key] = obj[key];
    }
  }

  return fieldObj;
}
export const isScanEntity = (entity: ScanEntity) => {
  return entity && entity.providerInfo && entity.attributes;
};

/**
 * Creates a scan details mapping for filters from completed scans.
 * Used to provide detailed information for scan filters in the UI.
 */
export const createScanDetailsMapping = (
  completedScans: ScanProps[],
  providersData?: ProvidersApiResponse,
) => {
  if (!completedScans || completedScans.length === 0) {
    return [];
  }

  const scanMappings = completedScans.map((scan: ScanProps) => {
    // Get provider info from providerInfo if available, or find from providers data
    let providerInfo = scan.providerInfo;

    if (!providerInfo && scan.relationships?.provider?.data?.id) {
      const provider = providersData?.data?.find(
        (p: ProviderProps) => p.id === scan.relationships.provider.data.id,
      );
      if (provider) {
        providerInfo = {
          provider: provider.attributes.provider,
          alias: provider.attributes.alias,
          uid: provider.attributes.uid,
        };
      }
    }

    return {
      [scan.id]: {
        id: scan.id,
        providerInfo: {
          provider: providerInfo?.provider || "aws",
          alias: providerInfo?.alias,
          uid: providerInfo?.uid,
        },
        attributes: {
          name: scan.attributes.name,
          completed_at: scan.attributes.completed_at,
        },
      },
    };
  });

  return scanMappings;
};

// Helper to check if entity is a ProviderConnectionStatus (simple label/value object)
export const isConnectionStatus = (
  entity: FilterEntity,
): entity is ProviderConnectionStatus => {
  return !!(entity && "label" in entity && "value" in entity);
};

/**
 * Connection status mapping for provider filters.
 * Maps boolean string values to user-friendly labels.
 */
export const CONNECTION_STATUS_MAPPING: Array<{
  [key: string]: FilterEntity;
}> = [
  {
    true: { label: "Connected", value: "true" } as ProviderConnectionStatus,
  },
  {
    false: {
      label: "Disconnected",
      value: "false",
    } as ProviderConnectionStatus,
  },
];
```

--------------------------------------------------------------------------------

---[FILE: helper.ts]---
Location: prowler-master/ui/lib/helper.ts

```typescript
import {
  getComplianceCsv,
  getCompliancePdfReport,
  getExportsZip,
} from "@/actions/scans";
import { getTask } from "@/actions/task";
import { auth } from "@/auth.config";
import { useToast } from "@/components/ui";
import {
  COMPLIANCE_REPORT_DISPLAY_NAMES,
  type ComplianceReportType,
} from "@/lib/compliance/compliance-report-types";
import { AuthSocialProvider, MetaDataProps, PermissionInfo } from "@/types";

export const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Extracts a form value from a FormData object
 * @param formData - The FormData object to extract from
 * @param field - The name of the field to extract
 * @returns The value of the field
 */
export const getFormValue = (formData: FormData, field: string) =>
  formData.get(field);

/**
 * Filters out empty values from an object
 * @param obj - Object to filter
 * @returns New object with empty values removed
 * Avoids sending empty values to the API
 */
export function filterEmptyValues(
  obj: Record<string, any>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      // Keep number 0 and boolean false as they are valid values
      if (value === 0 || value === false) return true;

      // Filter out null, undefined, empty strings, and empty arrays
      if (value === null || value === undefined) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;

      return true;
    }),
  );
}

/**
 * Returns the authentication headers for API requests
 * @param options - Optional configuration options
 * @returns Authentication headers with Accept and Authorization
 */
export const getAuthHeaders = async (options?: { contentType?: boolean }) => {
  const session = await auth();

  const headers: Record<string, string> = {
    Accept: "application/vnd.api+json",
    Authorization: `Bearer ${session?.accessToken}`,
  };

  if (options?.contentType) {
    headers["Content-Type"] = "application/vnd.api+json";
  }

  return headers;
};

export const getAuthUrl = (provider: AuthSocialProvider) => {
  const config = {
    google: {
      baseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      params: {
        redirect_uri: process.env.SOCIAL_GOOGLE_OAUTH_CALLBACK_URL,
        prompt: "consent",
        response_type: "code",
        client_id: process.env.SOCIAL_GOOGLE_OAUTH_CLIENT_ID,
        scope: "openid email profile",
        access_type: "offline",
      },
    },
    github: {
      baseUrl: "https://github.com/login/oauth/authorize",
      params: {
        client_id: process.env.SOCIAL_GITHUB_OAUTH_CLIENT_ID,
        redirect_uri: process.env.SOCIAL_GITHUB_OAUTH_CALLBACK_URL,
        scope: "user:email",
      },
    },
  };

  const { baseUrl, params } = config[provider];
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value || "");
  });

  return url.toString();
};

export const downloadScanZip = async (
  scanId: string,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  const result = await getExportsZip(scanId);

  if (result?.pending) {
    toast({
      title: "The report is still being generated",
      description: "Please try again in a few minutes.",
    });
    return;
  }

  if (result?.success && result.data) {
    const binaryString = window.atob(result.data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: "Your scan report has been downloaded successfully.",
    });
  } else {
    toast({
      variant: "destructive",
      title: "Download Failed",
      description: result?.error || "An unknown error occurred.",
    });
  }
};

/**
 * Generic function to download a file from base64 data
 */
const downloadFile = async (
  result: any,
  outputType: string,
  successMessage: string,
  toast: ReturnType<typeof useToast>["toast"],
): Promise<void> => {
  if (result?.pending) {
    toast({
      title: "The report is still being generated",
      description: "Please try again in a few minutes.",
    });
    return;
  }

  if (result?.success && result.data) {
    try {
      const binaryString = window.atob(result.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: outputType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: successMessage,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "An error occurred while processing the file.",
      });
    }
    return;
  }

  if (result?.error) {
    toast({
      variant: "destructive",
      title: "Download Failed",
      description: result.error,
    });
    return;
  }

  // Unexpected case
  toast({
    variant: "destructive",
    title: "Download Failed",
    description: "Unexpected response. Please try again later.",
  });
};

export const downloadComplianceCsv = async (
  scanId: string,
  complianceId: string,
  toast: ReturnType<typeof useToast>["toast"],
): Promise<void> => {
  const result = await getComplianceCsv(scanId, complianceId);
  await downloadFile(
    result,
    "text/csv",
    "The compliance report has been downloaded successfully.",
    toast,
  );
};

/**
 * Generic function to download a compliance PDF report (ThreatScore, ENS, etc.)
 * @param scanId - The scan ID
 * @param reportType - Type of report (from COMPLIANCE_REPORT_TYPES)
 * @param toast - Toast notification function
 */
export const downloadComplianceReportPdf = async (
  scanId: string,
  reportType: ComplianceReportType,
  toast: ReturnType<typeof useToast>["toast"],
): Promise<void> => {
  const result = await getCompliancePdfReport(scanId, reportType);
  const reportName = COMPLIANCE_REPORT_DISPLAY_NAMES[reportType];
  await downloadFile(
    result,
    "application/pdf",
    `The ${reportName} PDF report has been downloaded successfully.`,
    toast,
  );
};

export const isGoogleOAuthEnabled =
  !!process.env.SOCIAL_GOOGLE_OAUTH_CLIENT_ID &&
  !!process.env.SOCIAL_GOOGLE_OAUTH_CLIENT_SECRET;

export const isGithubOAuthEnabled =
  !!process.env.SOCIAL_GITHUB_OAUTH_CLIENT_ID &&
  !!process.env.SOCIAL_GITHUB_OAUTH_CLIENT_SECRET;

export const checkTaskStatus = async (
  taskId: string,
  maxRetries: number = 20,
  retryDelay: number = 1500,
): Promise<{ completed: boolean; error?: string }> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const task = await getTask(taskId);

    if (task.error) {
      // eslint-disable-next-line no-console
      console.error(`Error retrieving task: ${task.error}`);
      return { completed: false, error: task.error };
    }

    const state = task.data.attributes.state;

    switch (state) {
      case "completed":
        return { completed: true };
      case "failed":
        return { completed: false, error: task.data.attributes.result.error };
      case "available":
      case "scheduled":
      case "executing":
        // Continue waiting if the task is still in progress
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        break;
      default:
        return { completed: false, error: "Unexpected task state" };
    }
  }

  return { completed: false, error: "Max retries exceeded" };
};

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to create dictionaries by type
export function createDict(type: string, data: any) {
  const includedField = data?.included?.filter(
    (item: { type: string }) => item.type === type,
  );

  if (!includedField || includedField.length === 0) {
    return {};
  }

  return Object.fromEntries(
    includedField.map((item: { id: string }) => [item.id, item]),
  );
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const getPaginationInfo = (metadata: MetaDataProps) => {
  const currentPage = metadata?.pagination.page ?? "1";
  const totalPages = metadata?.pagination.pages;
  const totalEntries = metadata?.pagination.count;
  const itemsPerPageOptions = metadata?.pagination.itemsPerPage ?? [
    10, 20, 30, 50, 100,
  ];

  return { currentPage, totalPages, totalEntries, itemsPerPageOptions };
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  } else if (typeof error === "string") {
    return error;
  } else {
    return "Oops! Something went wrong.";
  }
};

export const permissionFormFields: PermissionInfo[] = [
  {
    field: "manage_users",
    label: "Invite and Manage Users",
    description: "Allows inviting new users and managing existing user details",
  },
  {
    field: "manage_account",
    label: "Manage Account",
    description: "Provides access to account settings and RBAC configuration",
  },
  {
    field: "unlimited_visibility",
    label: "Unlimited Visibility",
    description:
      "Provides complete visibility across all the providers and its related resources",
  },
  {
    field: "manage_providers",
    label: "Manage Cloud Providers",
    description:
      "Allows configuration and management of cloud provider connections",
  },
  {
    field: "manage_integrations",
    label: "Manage Integrations",
    description:
      "Allows configuration and management of third-party integrations",
  },
  {
    field: "manage_scans",
    label: "Manage Scans",
    description: "Allows launching and configuring scans security scans",
  },

  {
    field: "manage_billing",
    label: "Manage Billing",
    description: "Provides access to billing settings and invoices",
  },
];
```

--------------------------------------------------------------------------------

---[FILE: iac-utils.ts]---
Location: prowler-master/ui/lib/iac-utils.ts

```typescript
/**
 * Extracts line range from a Finding UID
 * Finding UID format: {CheckID}-{resource_name}-{line_range}
 * Example: "AVD-AWS-0001-main.tf-10:15" -> "10:15"
 *
 * @param findingUid - The finding UID
 * @returns Line range string or null if not found
 */
export function extractLineRangeFromUid(findingUid: string): string | null {
  if (!findingUid) {
    return null;
  }

  // Split by dash and get the last part (line range)
  const parts = findingUid.split("-");
  const lastPart = parts[parts.length - 1];

  // Check if the last part is a line range in format "number:number"
  // This ensures we don't confuse numeric filenames with line ranges
  if (/^\d+:\d+$/.test(lastPart)) {
    return lastPart;
  }

  return null;
}

/**
 * Builds a Git repository URL with file path and line numbers
 * Supports GitHub, GitLab, Bitbucket, and generic Git URLs
 *
 * @param repoUrl - Repository URL (can be HTTPS or git@ format)
 * @param filePath - Path to the file in the repository
 * @param lineRange - Line range in format "10-15" or "10:15" or "10"
 * @param branch - Git branch name (defaults to "main" if not provided)
 * @returns Complete URL to the file with line numbers, or null if URL cannot be built
 */
export function buildGitFileUrl(
  repoUrl: string,
  filePath: string,
  lineRange: string,
  branch?: string,
): string | null {
  if (!repoUrl || !filePath) {
    return null;
  }

  try {
    // Normalize the repository URL
    let normalizedUrl = repoUrl.trim();

    // Convert git@ format to HTTPS (best effort)
    if (normalizedUrl.startsWith("git@")) {
      // git@github.com:user/repo.git -> https://github.com/user/repo
      normalizedUrl = normalizedUrl
        .replace(/^git@/, "https://")
        .replace(/\.git$/, "")
        .replace(/:([^:]+)$/, "/$1"); // Replace last : with /
    }

    // Remove .git suffix if present
    normalizedUrl = normalizedUrl.replace(/\.git$/, "");

    // Parse URL to determine provider
    const url = new URL(normalizedUrl);
    const hostname = url.hostname.toLowerCase();

    // Clean up file path (remove leading slashes)
    const cleanFilePath = filePath.replace(/^\/+/, "");

    // Parse line range
    const { startLine, endLine } = parseLineRange(lineRange);

    // Build URL based on Git provider
    if (hostname.includes("github")) {
      return buildGitHubUrl(
        normalizedUrl,
        cleanFilePath,
        startLine,
        endLine,
        branch,
      );
    } else if (hostname.includes("gitlab")) {
      return buildGitLabUrl(
        normalizedUrl,
        cleanFilePath,
        startLine,
        endLine,
        branch,
      );
    } else if (hostname.includes("bitbucket")) {
      return buildBitbucketUrl(
        normalizedUrl,
        cleanFilePath,
        startLine,
        endLine,
        branch,
      );
    } else {
      // Generic Git provider - try GitHub format as fallback
      return buildGitHubUrl(
        normalizedUrl,
        cleanFilePath,
        startLine,
        endLine,
        branch,
      );
    }
  } catch (error) {
    console.error("Error building Git file URL:", error);
    return null;
  }
}

/**
 * Parses line range string into start and end line numbers
 */
function parseLineRange(lineRange: string): {
  startLine: number | null;
  endLine: number | null;
} {
  if (!lineRange || lineRange === "file") {
    return { startLine: null, endLine: null };
  }

  // Handle formats: "10-15", "10:15", "10"
  // Safe regex: anchored pattern for line numbers only (no ReDoS risk)
  // eslint-disable-next-line security/detect-unsafe-regex
  const match = lineRange.match(/^(\d+)[-:]?(\d+)?$/);
  if (match) {
    const startLine = parseInt(match[1], 10);
    const endLine = match[2] ? parseInt(match[2], 10) : startLine;
    return { startLine, endLine };
  }

  return { startLine: null, endLine: null };
}

/**
 * Builds GitHub-style URL
 * Format: https://github.com/user/repo/blob/{branch}/path/file.tf#L10-L15
 */
function buildGitHubUrl(
  baseUrl: string,
  filePath: string,
  startLine: number | null,
  endLine: number | null,
  branch?: string,
): string {
  // Use provided branch, default to "main" if not provided
  const branchName = branch || "main";
  let url = `${baseUrl}/blob/${branchName}/${filePath}`;

  if (startLine !== null) {
    if (endLine !== null && endLine !== startLine) {
      url += `#L${startLine}-L${endLine}`;
    } else {
      url += `#L${startLine}`;
    }
  }

  return url;
}

/**
 * Builds GitLab-style URL
 * Format: https://gitlab.com/user/repo/-/blob/{branch}/path/file.tf#L10-15
 */
function buildGitLabUrl(
  baseUrl: string,
  filePath: string,
  startLine: number | null,
  endLine: number | null,
  branch?: string,
): string {
  const branchName = branch || "main";
  let url = `${baseUrl}/-/blob/${branchName}/${filePath}`;

  if (startLine !== null) {
    if (endLine !== null && endLine !== startLine) {
      url += `#L${startLine}-${endLine}`;
    } else {
      url += `#L${startLine}`;
    }
  }

  return url;
}

/**
 * Builds Bitbucket-style URL
 * Format: https://bitbucket.org/user/repo/src/{branch}/path/file.tf#lines-10:15
 */
function buildBitbucketUrl(
  baseUrl: string,
  filePath: string,
  startLine: number | null,
  endLine: number | null,
  branch?: string,
): string {
  const branchName = branch || "main";
  let url = `${baseUrl}/src/${branchName}/${filePath}`;

  if (startLine !== null) {
    if (endLine !== null && endLine !== startLine) {
      url += `#lines-${startLine}:${endLine}`;
    } else {
      url += `#lines-${startLine}`;
    }
  }

  return url;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/lib/index.ts

```typescript
export * from "./error-mappings";
export * from "./external-urls";
export * from "./helper";
export * from "./helper-filters";
export * from "./menu-list";
export * from "./permissions";
export * from "./provider-helpers";
export * from "./utils";
```

--------------------------------------------------------------------------------

---[FILE: menu-list.ts]---
Location: prowler-master/ui/lib/menu-list.ts
Signals: React

```typescript
import {
  CloudCog,
  Cog,
  Group,
  Mail,
  MessageCircleQuestion,
  Puzzle,
  Settings,
  ShieldCheck,
  SquareChartGantt,
  Tag,
  Timer,
  User,
  UserCog,
  Users,
  VolumeX,
  Warehouse,
} from "lucide-react";
import type { MouseEvent } from "react";

import { ProwlerShort } from "@/components/icons";
import {
  APIdocIcon,
  DocIcon,
  GithubIcon,
  LighthouseIcon,
  SupportIcon,
} from "@/components/icons/Icons";
import { GroupProps } from "@/types";

interface MenuListOptions {
  pathname: string;
  hasProviders?: boolean;
  openMutelistModal?: () => void;
  requestMutelistModalOpen?: () => void;
}

export const getMenuList = ({
  pathname,
  hasProviders,
  openMutelistModal,
  requestMutelistModalOpen,
}: MenuListOptions): GroupProps[] => {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Overview",
          icon: SquareChartGantt,
          active: pathname === "/",
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/compliance",
          label: "Compliance",
          icon: ShieldCheck,
          active: pathname === "/compliance",
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/lighthouse",
          label: "Lighthouse AI",
          icon: LighthouseIcon,
          active: pathname === "/lighthouse",
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/findings",
          label: "Findings",
          icon: Tag,
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/resources",
          label: "Resources",
          icon: Warehouse,
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "",
          label: "Configuration",
          icon: Settings,
          submenus: [
            { href: "/providers", label: "Cloud Providers", icon: CloudCog },
            {
              href: "/providers",
              label: "Mutelist",
              icon: VolumeX,
              disabled: hasProviders === false,
              active: false,
              onClick: (event: MouseEvent<HTMLAnchorElement>) => {
                if (hasProviders === false) {
                  event.preventDefault();
                  event.stopPropagation();
                  return;
                }

                requestMutelistModalOpen?.();

                if (pathname !== "/providers") {
                  return;
                }

                event.preventDefault();
                event.stopPropagation();
                openMutelistModal?.();
              },
            },
            { href: "/manage-groups", label: "Provider Groups", icon: Group },
            { href: "/scans", label: "Scan Jobs", icon: Timer },
            { href: "/integrations", label: "Integrations", icon: Puzzle },
            { href: "/roles", label: "Roles", icon: UserCog },
            { href: "/lighthouse/config", label: "Lighthouse AI", icon: Cog },
          ],
          defaultOpen: true,
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "",
          label: "Organization",
          icon: Users,
          submenus: [
            { href: "/users", label: "Users", icon: User },
            { href: "/invitations", label: "Invitations", icon: Mail },
          ],
          defaultOpen: false,
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "",
          label: "Support & Help",
          icon: SupportIcon,
          submenus: [
            {
              href: "https://docs.prowler.com/",
              target: "_blank",
              label: "Documentation",
              icon: DocIcon,
            },
            {
              href:
                process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true"
                  ? "https://api.prowler.com/api/v1/docs"
                  : `${process.env.NEXT_PUBLIC_API_DOCS_URL}`,
              target: "_blank",
              label: "API reference",
              icon: APIdocIcon,
            },
            {
              href: "https://customer.support.prowler.com/servicedesk/customer/portal/9/create/102",
              target: "_blank",
              label: "Customer Support",
              icon: MessageCircleQuestion,
            },
            {
              href: "https://github.com/prowler-cloud/prowler/issues",
              target: "_blank",
              label: "Community Support",
              icon: GithubIcon,
            },
          ],
          defaultOpen: false,
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "https://hub.prowler.com/",
          label: "Prowler Hub",
          icon: ProwlerShort,
          target: "_blank",
          tooltip: "Looking for all available checks? learn more.",
        },
      ],
    },
  ];
};
```

--------------------------------------------------------------------------------

---[FILE: permissions.ts]---
Location: prowler-master/ui/lib/permissions.ts

```typescript
import { RolePermissionAttributes } from "@/types/users";

export const isUserOwnerAndHasManageAccount = (
  roles: any[],
  memberships: any[],
  userId: string,
): boolean => {
  const isOwner = memberships.some(
    (membership) =>
      membership.attributes.role === "owner" &&
      membership.relationships?.user?.data?.id === userId,
  );

  const hasManageAccount = roles.some(
    (role) =>
      role.attributes.manage_account === true &&
      role.relationships?.users?.data?.some((user: any) => user.id === userId),
  );

  return isOwner && hasManageAccount;
};

/**
 * Get the permissions for a user role
 * @param attributes - The attributes of the user role
 * @returns The permissions for the user role
 */
export const getRolePermissions = (attributes: RolePermissionAttributes) => {
  const permissions = [
    {
      key: "manage_users",
      label: "Manage Users",
      enabled: attributes.manage_users,
    },
    {
      key: "manage_account",
      label: "Manage Account",
      enabled: attributes.manage_account,
    },
    {
      key: "manage_providers",
      label: "Manage Providers",
      enabled: attributes.manage_providers,
    },
    {
      key: "manage_scans",
      label: "Manage Scans",
      enabled: attributes.manage_scans,
    },

    {
      key: "manage_integrations",
      label: "Manage Integrations",
      enabled: attributes.manage_integrations,
    },
    {
      key: "unlimited_visibility",
      label: "Unlimited Visibility",
      enabled: attributes.unlimited_visibility,
    },
  ];

  return permissions;
};
```

--------------------------------------------------------------------------------

````
