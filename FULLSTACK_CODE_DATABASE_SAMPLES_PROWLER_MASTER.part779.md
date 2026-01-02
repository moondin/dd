---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 779
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 779 of 867)

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

---[FILE: lighthouse.ts]---
Location: prowler-master/ui/actions/lighthouse/lighthouse.ts

```typescript
"use server";

import { apiBaseUrl, getAuthHeaders } from "@/lib/helper";
import {
  validateBaseUrl,
  validateCredentials,
} from "@/lib/lighthouse/validation";
import { handleApiError, handleApiResponse } from "@/lib/server-actions-helper";
import {
  type LighthouseProvider,
  PROVIDER_DISPLAY_NAMES,
} from "@/types/lighthouse";
import type {
  BedrockCredentials,
  OpenAICompatibleCredentials,
  OpenAICredentials,
} from "@/types/lighthouse/credentials";

// API Response Types
type ProviderCredentials =
  | OpenAICredentials
  | BedrockCredentials
  | OpenAICompatibleCredentials;

interface ApiError {
  detail: string;
}

interface ApiLinks {
  next?: string;
}

interface ApiResponse<T> {
  data?: T;
  errors?: ApiError[];
  links?: ApiLinks;
}

interface LighthouseModelAttributes {
  model_id: string;
  model_name: string;
}

interface LighthouseModel {
  id: string;
  attributes: LighthouseModelAttributes;
}

interface LighthouseProviderAttributes {
  provider_type: string;
  credentials: ProviderCredentials;
  base_url?: string;
  is_active: boolean;
}

interface LighthouseProviderResource {
  id: string;
  attributes: LighthouseProviderAttributes;
}

interface ModelOption {
  id: string;
  name: string;
}

interface ProviderCredentialsAttributes {
  credentials: ProviderCredentials;
  base_url?: string;
}

interface ProviderCredentialsResponse {
  attributes: ProviderCredentialsAttributes;
}

/**
 * Create a new lighthouse provider configuration
 */
export const createLighthouseProvider = async (config: {
  provider_type: LighthouseProvider;
  credentials: ProviderCredentials;
  base_url?: string;
}) => {
  const headers = await getAuthHeaders({ contentType: true });
  const url = new URL(`${apiBaseUrl}/lighthouse/providers`);

  try {
    // Validate credentials
    const credentialsValidation = validateCredentials(
      config.provider_type,
      config.credentials,
    );
    if (!credentialsValidation.success) {
      return {
        errors: [{ detail: credentialsValidation.error }],
      };
    }

    // Validate base_url if provided
    if (config.base_url) {
      const baseUrlValidation = validateBaseUrl(config.base_url);
      if (!baseUrlValidation.success) {
        return {
          errors: [{ detail: baseUrlValidation.error }],
        };
      }
    }

    const payload = {
      data: {
        type: "lighthouse-providers",
        attributes: {
          provider_type: config.provider_type,
          credentials: config.credentials,
          base_url: config.base_url || null,
        },
      },
    };

    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    return handleApiResponse(response, "/lighthouse/config");
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Test provider connection (returns task)
 */
export const testProviderConnection = async (providerId: string) => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(
    `${apiBaseUrl}/lighthouse/providers/${providerId}/connection`,
  );

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Refresh provider models (returns task)
 */
export const refreshProviderModels = async (providerId: string) => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(
    `${apiBaseUrl}/lighthouse/providers/${providerId}/refresh-models`,
  );

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all lighthouse providers
 */
export const getLighthouseProviders = async () => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/lighthouse/providers`);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get only model identifiers and names for a provider type.
 * Uses sparse fieldsets to only fetch model_id and model_name, avoiding over-fetching.
 * Fetches all pages automatically.
 */
export const getLighthouseModelIds = async (
  providerType: LighthouseProvider,
) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/lighthouse/models`);
  url.searchParams.set("filter[provider_type]", providerType);
  url.searchParams.set("fields[lighthouse-models]", "model_id,model_name");

  try {
    // Fetch first page
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    const data = await handleApiResponse(response);

    if (data.errors) {
      return data;
    }

    const allModels: LighthouseModel[] = [...(data.data || [])];

    // Fetch remaining pages
    let nextUrl = data.links?.next;
    while (nextUrl) {
      const pageResponse = await fetch(nextUrl, {
        method: "GET",
        headers,
      });

      const pageData = await handleApiResponse(pageResponse);

      if (pageData.errors) {
        return pageData;
      }

      if (pageData.data && Array.isArray(pageData.data)) {
        allModels.push(...pageData.data);
      }

      nextUrl = pageData.links?.next;
    }

    // Transform to minimal format
    const models: ModelOption[] = allModels
      .map((m: LighthouseModel) => ({
        id: m.attributes.model_id,
        name: m.attributes.model_name || m.attributes.model_id,
      }))
      .filter((v: ModelOption) => typeof v.id === "string");

    return { data: models };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get tenant lighthouse configuration
 */
export const getTenantConfig = async () => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/lighthouse/configuration`);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update tenant lighthouse configuration
 */
export const updateTenantConfig = async (config: {
  default_models?: Record<string, string>;
  default_provider?: LighthouseProvider;
  business_context?: string;
}) => {
  const headers = await getAuthHeaders({ contentType: true });
  const url = new URL(`${apiBaseUrl}/lighthouse/configuration`);

  try {
    const payload = {
      data: {
        type: "lighthouse-configurations",
        attributes: config,
      },
    };

    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    return handleApiResponse(response, "/lighthouse/config");
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get credentials and configuration from the specified provider (or first active provider)
 * Returns an object containing:
 * - credentials: varies by provider type
 *   - OpenAI: { api_key: string }
 *   - Bedrock: { access_key_id: string, secret_access_key: string, region: string }
 *   - OpenAI Compatible: { api_key: string }
 * - base_url: string | undefined (for OpenAI Compatible providers)
 */
export const getProviderCredentials = async (
  providerType?: LighthouseProvider,
): Promise<{
  credentials: ProviderCredentials | Record<string, never>;
  base_url?: string;
}> => {
  const headers = await getAuthHeaders({ contentType: false });

  // Note: fields[lighthouse-providers]=credentials is required to get decrypted credentials
  // base_url is not sensitive and is returned by default
  const url = new URL(`${apiBaseUrl}/lighthouse/providers`);
  if (providerType) {
    url.searchParams.append("filter[provider_type]", providerType);
  }
  url.searchParams.append("filter[is_active]", "true");
  url.searchParams.append(
    "fields[lighthouse-providers]",
    "credentials,base_url",
  );

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    const data: ApiResponse<ProviderCredentialsResponse[]> =
      await response.json();

    if (data?.data && data.data.length > 0) {
      const provider = data.data[0]?.attributes;
      return {
        credentials: provider.credentials || {},
        base_url: provider.base_url,
      };
    }

    return { credentials: {} };
  } catch (error) {
    console.error("[Server] Error in getProviderCredentials:", error);
    return { credentials: {} };
  }
};

/**
 * Check if lighthouse is properly configured
 * Returns true if tenant config exists AND there's at least one active provider
 */
export const isLighthouseConfigured = async () => {
  try {
    const [tenantConfig, providers] = await Promise.all([
      getTenantConfig(),
      getLighthouseProviders(),
    ]);

    const hasTenantConfig = !!tenantConfig?.data;
    const hasActiveProvider =
      providers?.data &&
      Array.isArray(providers.data) &&
      providers.data.some(
        (p: LighthouseProviderResource) => p.attributes?.is_active,
      );

    return hasTenantConfig && hasActiveProvider;
  } catch (error) {
    console.error("[Server] Error in isLighthouseConfigured:", error);
    return false;
  }
};

/**
 * Get a single lighthouse provider by provider type
 * Server-side only - never exposes internal IDs to client
 */
export const getLighthouseProviderByType = async (
  providerType: LighthouseProvider,
) => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/lighthouse/providers`);
  url.searchParams.set("filter[provider_type]", providerType);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    const data = await handleApiResponse(response);

    if (data.errors) {
      return data;
    }

    // Should only be one config per provider type per tenant
    if (data.data && data.data.length > 0) {
      return { data: data.data[0] };
    }

    return { errors: [{ detail: "Provider configuration not found" }] };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update a lighthouse provider configuration by provider type
 * Looks up the provider server-side, never exposes ID to client
 */
export const updateLighthouseProviderByType = async (
  providerType: LighthouseProvider,
  config: {
    credentials?: ProviderCredentials;
    base_url?: string;
    is_active?: boolean;
  },
) => {
  try {
    // Validate credentials if provided
    if (config.credentials && Object.keys(config.credentials).length > 0) {
      const credentialsValidation = validateCredentials(
        providerType,
        config.credentials as Record<string, string>,
      );
      if (!credentialsValidation.success) {
        return {
          errors: [{ detail: credentialsValidation.error }],
        };
      }
    }

    // Validate base_url if provided
    if (config.base_url) {
      const baseUrlValidation = validateBaseUrl(config.base_url);
      if (!baseUrlValidation.success) {
        return {
          errors: [{ detail: baseUrlValidation.error }],
        };
      }
    }

    // First, get the provider by type
    const providerResult = await getLighthouseProviderByType(providerType);

    if (providerResult.errors || !providerResult.data) {
      return providerResult;
    }

    const providerId = providerResult.data.id;

    // Now update it
    const headers = await getAuthHeaders({ contentType: true });
    const url = new URL(`${apiBaseUrl}/lighthouse/providers/${providerId}`);

    const payload = {
      data: {
        type: "lighthouse-providers",
        id: providerId,
        attributes: config,
      },
    };

    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    return handleApiResponse(response, "/lighthouse/config");
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete a lighthouse provider configuration by provider type
 * Looks up the provider server-side, never exposes ID to client
 */
export const deleteLighthouseProviderByType = async (
  providerType: LighthouseProvider,
) => {
  try {
    // First, get the provider by type
    const providerResult = await getLighthouseProviderByType(providerType);

    if (providerResult.errors || !providerResult.data) {
      return providerResult;
    }

    const providerId = providerResult.data.id;

    // Now delete it
    const headers = await getAuthHeaders({ contentType: false });
    const url = new URL(`${apiBaseUrl}/lighthouse/providers/${providerId}`);

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    return handleApiResponse(response, "/lighthouse/config");
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get lighthouse providers configuration with all available models
 * Fetches all models for each provider to populate the model selector
 */
export const getLighthouseProvidersConfig = async () => {
  try {
    const [tenantConfig, providers] = await Promise.all([
      getTenantConfig(),
      getLighthouseProviders(),
    ]);

    if (tenantConfig.errors || providers.errors) {
      return {
        errors: tenantConfig.errors || providers.errors,
      };
    }

    const tenantData = tenantConfig?.data?.attributes;
    const defaultProvider = tenantData?.default_provider || "";
    const defaultModels = tenantData?.default_models || {};

    // Filter only active providers
    const activeProviders =
      providers?.data?.filter(
        (p: LighthouseProviderResource) => p.attributes?.is_active,
      ) || [];

    const providersConfig = await Promise.all(
      activeProviders.map(async (provider: LighthouseProviderResource) => {
        const providerType = provider.attributes
          .provider_type as LighthouseProvider;

        // Fetch all models for this provider
        const modelsResponse = await getLighthouseModelIds(providerType);
        const models: ModelOption[] = modelsResponse.data || [];

        return {
          id: providerType,
          name: PROVIDER_DISPLAY_NAMES[providerType],
          models: models,
        };
      }),
    );

    // Filter out providers with no models
    const validProviders = providersConfig.filter((p) => p.models.length > 0);

    return {
      providers: validProviders,
      defaultProviderId: defaultProvider,
      defaultModelId: defaultModels[defaultProvider],
    };
  } catch (error) {
    console.error("[Server] Error in getLighthouseProvidersConfig:", error);
    return {
      errors: [{ detail: String(error) }],
    };
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/manage-groups/index.ts

```typescript
export * from "./manage-groups";
```

--------------------------------------------------------------------------------

---[FILE: manage-groups.ts]---
Location: prowler-master/ui/actions/manage-groups/manage-groups.ts
Signals: Next.js

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { apiBaseUrl, getAuthHeaders, getErrorMessage } from "@/lib";
import { handleApiError, handleApiResponse } from "@/lib/server-actions-helper";
import { ManageGroupPayload, ProviderGroupsResponse } from "@/types/components";

export const getProviderGroups = async ({
  page = 1,
  query = "",
  sort = "",
  filters = {},
  pageSize = 10,
}: {
  page?: number;
  query?: string;
  sort?: string;
  filters?: Record<string, string | number>;
  pageSize?: number;
}): Promise<ProviderGroupsResponse | undefined> => {
  const headers = await getAuthHeaders({ contentType: false });

  if (isNaN(Number(page)) || page < 1) redirect("/manage-groups");

  const url = new URL(`${apiBaseUrl}/provider-groups`);

  if (page) url.searchParams.append("page[number]", page.toString());
  if (pageSize) url.searchParams.append("page[size]", pageSize.toString());
  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  // Handle multiple filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key !== "filter[search]") {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching provider groups:", error);
    return undefined;
  }
};

export const getProviderGroupInfoById = async (providerGroupId: string) => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/provider-groups/${providerGroupId}`);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error);
  }
};

export const createProviderGroup = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });

  const name = formData.get("name") as string;
  const providersJson = formData.get("providers") as string;
  const rolesJson = formData.get("roles") as string;

  // Parse JSON strings and handle empty cases
  const providers = providersJson ? JSON.parse(providersJson) : [];
  const roles = rolesJson ? JSON.parse(rolesJson) : [];

  // Prepare base payload
  const payload: any = {
    data: {
      type: "provider-groups",
      attributes: {
        name,
      },
      relationships: {},
    },
  };

  // Add relationships only if there are items
  if (providers.length > 0) {
    payload.data.relationships.providers = {
      data: providers,
    };
  }

  if (roles.length > 0) {
    payload.data.relationships.roles = {
      data: roles,
    };
  }

  const body = JSON.stringify(payload);

  try {
    const url = new URL(`${apiBaseUrl}/provider-groups`);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body,
    });

    return handleApiResponse(response, "/manage-groups");
  } catch (error) {
    handleApiError(error);
  }
};

export const updateProviderGroup = async (
  providerGroupId: string,
  formData: FormData,
) => {
  const headers = await getAuthHeaders({ contentType: true });

  const name = formData.get("name") as string;
  const providersJson = formData.get("providers") as string;
  const rolesJson = formData.get("roles") as string;

  const providers = providersJson ? JSON.parse(providersJson) : null;
  const roles = rolesJson ? JSON.parse(rolesJson) : null;

  const payload: Partial<ManageGroupPayload> = {
    data: {
      type: "provider-groups",
      id: providerGroupId,
      attributes: name ? { name } : undefined,
      relationships: {},
    },
  };

  // Add relationships only if changes are detected
  if (providers) {
    payload.data!.relationships!.providers = { data: providers };
  }

  if (roles) {
    payload.data!.relationships!.roles = { data: roles };
  }

  try {
    const url = `${apiBaseUrl}/provider-groups/${providerGroupId}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteProviderGroup = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: false });
  const providerGroupId = formData.get("id");

  if (!providerGroupId) {
    return {
      errors: [{ detail: "Provider Group ID is required." }],
    };
  }

  const url = new URL(`${apiBaseUrl}/provider-groups/${providerGroupId}`);

  try {
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || "Failed to delete the provider group",
        );
      } catch {
        throw new Error("Failed to delete the provider group");
      }
    }

    let data = null;
    if (response.status !== 204) {
      data = await response.json();
    }

    revalidatePath("/manage-groups");
    return data || { success: true };
  } catch (error) {
    console.error("Error deleting provider group:", error);
    const message = getErrorMessage(error);
    return { errors: [{ detail: message }] };
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/index.ts

```typescript
// Re-export all overview actions from feature-based subfolders
export * from "./attack-surface";
export * from "./findings";
export * from "./providers";
export * from "./regions";
export * from "./risk-plot";
export * from "./risk-radar";
export * from "./services";
export * from "./severity-trends";
export * from "./threat-score";
```

--------------------------------------------------------------------------------

---[FILE: attack-surface.adapter.ts]---
Location: prowler-master/ui/actions/overview/attack-surface/attack-surface.adapter.ts

```typescript
import { AttackSurfaceOverview, AttackSurfaceOverviewResponse } from "./types";

const ATTACK_SURFACE_IDS = {
  INTERNET_EXPOSED: "internet-exposed",
  SECRETS: "secrets",
  PRIVILEGE_ESCALATION: "privilege-escalation",
  EC2_IMDSV1: "ec2-imdsv1",
} as const;

export type AttackSurfaceId =
  (typeof ATTACK_SURFACE_IDS)[keyof typeof ATTACK_SURFACE_IDS];

export interface AttackSurfaceItem {
  id: AttackSurfaceId;
  label: string;
  failedFindings: number;
  totalFindings: number;
}

const ATTACK_SURFACE_LABELS: Record<AttackSurfaceId, string> = {
  [ATTACK_SURFACE_IDS.INTERNET_EXPOSED]: "Internet Exposed Resources",
  [ATTACK_SURFACE_IDS.SECRETS]: "Exposed Secrets",
  [ATTACK_SURFACE_IDS.PRIVILEGE_ESCALATION]: "IAM Policy Privilege Escalation",
  [ATTACK_SURFACE_IDS.EC2_IMDSV1]: "EC2 with IMDSv1 Enabled",
};

const ATTACK_SURFACE_ORDER: AttackSurfaceId[] = [
  ATTACK_SURFACE_IDS.INTERNET_EXPOSED,
  ATTACK_SURFACE_IDS.SECRETS,
  ATTACK_SURFACE_IDS.PRIVILEGE_ESCALATION,
  ATTACK_SURFACE_IDS.EC2_IMDSV1,
];

function mapAttackSurfaceItem(item: AttackSurfaceOverview): AttackSurfaceItem {
  const id = item.id as AttackSurfaceId;
  return {
    id,
    label: ATTACK_SURFACE_LABELS[id] || item.id,
    failedFindings: item.attributes.failed_findings,
    totalFindings: item.attributes.total_findings,
  };
}

/**
 * Adapts the attack surface overview API response to a format suitable for the UI.
 * Returns the items in a consistent order as defined by ATTACK_SURFACE_ORDER.
 *
 * @param response - The attack surface overview API response
 * @returns An array of AttackSurfaceItem objects sorted by the predefined order
 */
export function adaptAttackSurfaceOverview(
  response: AttackSurfaceOverviewResponse | undefined,
): AttackSurfaceItem[] {
  if (!response?.data || response.data.length === 0) {
    return [];
  }

  // Create a map for quick lookup
  const itemsMap = new Map<string, AttackSurfaceOverview>();
  for (const item of response.data) {
    itemsMap.set(item.id, item);
  }

  // Return items in the predefined order
  const sortedItems: AttackSurfaceItem[] = [];
  for (const id of ATTACK_SURFACE_ORDER) {
    const item = itemsMap.get(id);
    if (item) {
      sortedItems.push(mapAttackSurfaceItem(item));
    }
  }

  // Include any items that might be in the response but not in our predefined order
  for (const item of response.data) {
    if (!ATTACK_SURFACE_ORDER.includes(item.id as AttackSurfaceId)) {
      sortedItems.push(mapAttackSurfaceItem(item));
    }
  }

  return sortedItems;
}
```

--------------------------------------------------------------------------------

---[FILE: attack-surface.ts]---
Location: prowler-master/ui/actions/overview/attack-surface/attack-surface.ts

```typescript
"use server";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiResponse } from "@/lib/server-actions-helper";

import { AttackSurfaceOverviewResponse } from "./types";

export const getAttackSurfaceOverview = async ({
  filters = {},
}: {
  filters?: Record<string, string | string[] | undefined>;
} = {}): Promise<AttackSurfaceOverviewResponse | undefined> => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/overviews/attack-surfaces`);

  // Handle multiple filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key !== "filter[search]" && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching attack surface overview:", error);
    return undefined;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/attack-surface/index.ts

```typescript
export * from "./attack-surface";
export * from "./attack-surface.adapter";
export * from "./types";
```

--------------------------------------------------------------------------------

---[FILE: attack-surface.types.ts]---
Location: prowler-master/ui/actions/overview/attack-surface/types/attack-surface.types.ts

```typescript
// Attack Surface Overview Types
// Corresponds to the /overviews/attack-surfaces endpoint

interface OverviewResponseMeta {
  version: string;
}

export interface AttackSurfaceOverviewAttributes {
  total_findings: number;
  failed_findings: number;
  muted_failed_findings: number;
  check_ids: string[];
}

export interface AttackSurfaceOverview {
  type: "attack-surface-overviews";
  id: string;
  attributes: AttackSurfaceOverviewAttributes;
}

export interface AttackSurfaceOverviewResponse {
  data: AttackSurfaceOverview[];
  meta: OverviewResponseMeta;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/attack-surface/types/index.ts

```typescript
export * from "./attack-surface.types";
```

--------------------------------------------------------------------------------

---[FILE: findings.ts]---
Location: prowler-master/ui/actions/overview/findings/findings.ts
Signals: Next.js

```typescript
"use server";

import { redirect } from "next/navigation";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiResponse } from "@/lib/server-actions-helper";

import { FindingsSeverityOverviewResponse } from "./types";

export const getFindingsByStatus = async ({
  page = 1,
  query = "",
  sort = "",
  filters = {},
}: {
  page?: number;
  query?: string;
  sort?: string;
  filters?: Record<string, string | string[] | undefined>;
} = {}) => {
  const headers = await getAuthHeaders({ contentType: false });

  if (isNaN(Number(page)) || page < 1) redirect("/");

  const url = new URL(`${apiBaseUrl}/overviews/findings`);

  if (page) url.searchParams.append("page[number]", page.toString());
  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  // Handle multiple filters, but exclude muted filter as overviews endpoint doesn't support it
  Object.entries(filters).forEach(([key, value]) => {
    // The overviews/findings endpoint does not support status or muted filters
    // (allowed filters include date, region, provider fields). Exclude unsupported ones.
    if (
      key !== "filter[search]" &&
      key !== "filter[muted]" &&
      key !== "filter[status]"
    ) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching findings severity overview:", error);
    return undefined;
  }
};

export const getFindingsBySeverity = async ({
  filters = {},
}: {
  filters?: Record<string, string | string[] | undefined>;
} = {}): Promise<FindingsSeverityOverviewResponse | undefined> => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/overviews/findings_severity`);

  // Handle multiple filters, but exclude unsupported filters
  Object.entries(filters).forEach(([key, value]) => {
    if (
      key !== "filter[search]" &&
      key !== "filter[muted]" &&
      value !== undefined
    ) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching findings severity overview:", error);
    return undefined;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/findings/index.ts

```typescript
export * from "./findings";
export * from "./types";
```

--------------------------------------------------------------------------------

---[FILE: findings.types.ts]---
Location: prowler-master/ui/actions/overview/findings/types/findings.types.ts

```typescript
// Findings Severity Overview Types
// Corresponds to the /overviews/findings_severity endpoint

interface OverviewResponseMeta {
  version: string;
}

export interface FindingsSeverityAttributes {
  critical: number;
  high: number;
  medium: number;
  low: number;
  informational: number;
}

export interface FindingsSeverityOverview {
  type: "findings-severity-overview";
  id: string;
  attributes: FindingsSeverityAttributes;
}

export interface FindingsSeverityOverviewResponse {
  data: FindingsSeverityOverview;
  meta: OverviewResponseMeta;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/findings/types/index.ts

```typescript
export * from "./findings.types";
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/providers/index.ts

```typescript
export * from "./providers";
export * from "./sankey.adapter";
export * from "./types";
```

--------------------------------------------------------------------------------

---[FILE: providers.ts]---
Location: prowler-master/ui/actions/overview/providers/providers.ts
Signals: Next.js

```typescript
"use server";

import { redirect } from "next/navigation";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiResponse } from "@/lib/server-actions-helper";

import { ProvidersOverviewResponse } from "./types";

export const getProvidersOverview = async ({
  page = 1,
  query = "",
  sort = "",
  filters = {},
}: {
  page?: number;
  query?: string;
  sort?: string;
  filters?: Record<string, string | string[] | undefined>;
} = {}): Promise<ProvidersOverviewResponse | undefined> => {
  const headers = await getAuthHeaders({ contentType: false });

  if (isNaN(Number(page)) || page < 1) redirect("/providers-overview");

  const url = new URL(`${apiBaseUrl}/overviews/providers`);

  if (page) url.searchParams.append("page[number]", page.toString());
  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  Object.entries(filters).forEach(([key, value]) => {
    if (key !== "filter[search]" && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching providers overview:", error);
    return undefined;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: sankey.adapter.ts]---
Location: prowler-master/ui/actions/overview/providers/sankey.adapter.ts

```typescript
import { getProviderDisplayName } from "@/types/providers";

export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface ZeroDataProvider {
  id: string;
  displayName: string;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
  zeroDataProviders: ZeroDataProvider[];
}

export interface SeverityData {
  critical: number;
  high: number;
  medium: number;
  low: number;
  informational: number;
}

export interface SeverityByProviderType {
  [providerType: string]: SeverityData;
}

const SEVERITY_ORDER = [
  "Critical",
  "High",
  "Medium",
  "Low",
  "Informational",
] as const;

const SEVERITY_KEYS: (keyof SeverityData)[] = [
  "critical",
  "high",
  "medium",
  "low",
  "informational",
];

/**
 * Adapts severity by provider type data to Sankey chart format.
 *
 * @param severityByProviderType - Severity breakdown per provider type from the API
 * @param selectedProviderTypes - Provider types that were selected but may have no data
 */
export function adaptToSankeyData(
  severityByProviderType: SeverityByProviderType,
  selectedProviderTypes?: string[],
): SankeyData {
  if (Object.keys(severityByProviderType).length === 0) {
    // No data - check if there are selected providers to show as zero-data
    const zeroDataProviders: ZeroDataProvider[] = (
      selectedProviderTypes || []
    ).map((type) => ({
      id: type.toLowerCase(),
      displayName: getProviderDisplayName(type),
    }));
    return { nodes: [], links: [], zeroDataProviders };
  }

  // Calculate total fails per provider to identify which have data
  const providersWithData: {
    id: string;
    displayName: string;
    totalFail: number;
  }[] = [];
  const providersWithoutData: ZeroDataProvider[] = [];

  for (const [providerType, severity] of Object.entries(
    severityByProviderType,
  )) {
    const totalFail =
      severity.critical +
      severity.high +
      severity.medium +
      severity.low +
      severity.informational;

    const normalizedType = providerType.toLowerCase();

    if (totalFail > 0) {
      providersWithData.push({
        id: normalizedType,
        displayName: getProviderDisplayName(normalizedType),
        totalFail,
      });
    } else {
      providersWithoutData.push({
        id: normalizedType,
        displayName: getProviderDisplayName(normalizedType),
      });
    }
  }

  // Add selected provider types that are not in the response at all
  if (selectedProviderTypes && selectedProviderTypes.length > 0) {
    const existingProviderIds = new Set(
      Object.keys(severityByProviderType).map((t) => t.toLowerCase()),
    );

    for (const selectedType of selectedProviderTypes) {
      const normalizedType = selectedType.toLowerCase();
      if (!existingProviderIds.has(normalizedType)) {
        providersWithoutData.push({
          id: normalizedType,
          displayName: getProviderDisplayName(normalizedType),
        });
      }
    }
  }

  // If no providers have failures, return empty chart with zero-data legends
  if (providersWithData.length === 0) {
    return { nodes: [], links: [], zeroDataProviders: providersWithoutData };
  }

  // Build nodes: providers first, then severities
  const providerNodes: SankeyNode[] = providersWithData.map((p) => ({
    name: p.displayName,
  }));
  const severityNodes: SankeyNode[] = SEVERITY_ORDER.map((severity) => ({
    name: severity,
  }));
  const nodes = [...providerNodes, ...severityNodes];

  // Build links
  const severityStartIndex = providerNodes.length;
  const links: SankeyLink[] = [];

  providersWithData.forEach((provider, sourceIndex) => {
    const severity =
      severityByProviderType[provider.id] ||
      severityByProviderType[provider.id.toUpperCase()];

    if (severity) {
      SEVERITY_KEYS.forEach((key, severityIndex) => {
        const value = severity[key];
        if (value > 0) {
          links.push({
            source: sourceIndex,
            target: severityStartIndex + severityIndex,
            value,
          });
        }
      });
    }
  });

  return { nodes, links, zeroDataProviders: providersWithoutData };
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/providers/types/index.ts

```typescript
export * from "./providers.types";
```

--------------------------------------------------------------------------------

---[FILE: providers.types.ts]---
Location: prowler-master/ui/actions/overview/providers/types/providers.types.ts

```typescript
// Providers Overview Types
// Corresponds to the /overviews/providers endpoint

interface OverviewResponseMeta {
  version: string;
}

export interface ProviderOverviewFindings {
  pass: number;
  fail: number;
  muted: number;
  total: number;
}

export interface ProviderOverviewResources {
  total: number;
}

export interface ProviderOverviewAttributes {
  findings: ProviderOverviewFindings;
  resources: ProviderOverviewResources;
}

export interface ProviderOverview {
  type: "providers-overview";
  id: string;
  attributes: ProviderOverviewAttributes;
}

export interface ProvidersOverviewResponse {
  data: ProviderOverview[];
  meta: OverviewResponseMeta;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/overview/regions/index.ts

```typescript
export * from "./regions";
export * from "./threat-map.adapter";
export * from "./types";
```

--------------------------------------------------------------------------------

---[FILE: regions.ts]---
Location: prowler-master/ui/actions/overview/regions/regions.ts

```typescript
"use server";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiResponse } from "@/lib/server-actions-helper";

import { RegionsOverviewResponse } from "./types";

export const getRegionsOverview = async ({
  filters = {},
}: {
  filters?: Record<string, string | string[] | undefined>;
} = {}): Promise<RegionsOverviewResponse | undefined> => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/overviews/regions`);

  // Handle multiple filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key !== "filter[search]" && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching regions overview:", error);
    return undefined;
  }
};
```

--------------------------------------------------------------------------------

````
