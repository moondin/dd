---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 781
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 781 of 867)

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

---[FILE: processors.ts]---
Location: prowler-master/ui/actions/processors/processors.ts

```typescript
"use server";

import { apiBaseUrl, getAuthHeaders } from "@/lib/helper";
import { mutedFindingsConfigFormSchema } from "@/types/formSchemas";
import {
  DeleteMutedFindingsConfigActionState,
  MutedFindingsConfigActionState,
  ProcessorData,
} from "@/types/processors";

export const createMutedFindingsConfig = async (
  _prevState: MutedFindingsConfigActionState,
  formData: FormData,
): Promise<MutedFindingsConfigActionState> => {
  const headers = await getAuthHeaders({ contentType: true });
  const formDataObject = Object.fromEntries(formData);
  const validatedData = mutedFindingsConfigFormSchema.safeParse(formDataObject);

  if (!validatedData.success) {
    const formFieldErrors = validatedData.error.flatten().fieldErrors;
    return {
      errors: {
        configuration: formFieldErrors?.configuration?.[0],
      },
    };
  }

  const { configuration } = validatedData.data;

  try {
    const url = new URL(`${apiBaseUrl}/processors`);

    const bodyData = {
      data: {
        type: "processors",
        attributes: {
          processor_type: "mutelist",
          configuration: configuration,
        },
      },
    };

    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(
          errorData?.errors?.[0]?.detail ||
            errorData?.message ||
            `Failed to create Mutelist configuration: ${response.statusText}`,
        );
      } catch {
        throw new Error(
          `Failed to create Mutelist configuration: ${response.statusText}`,
        );
      }
    }

    await response.json();
    return { success: "Mutelist configuration created successfully!" };
  } catch (error) {
    console.error("Error creating Mutelist config:", error);
    return {
      errors: {
        configuration:
          error instanceof Error
            ? error.message
            : "Error creating Mutelist configuration. Please try again.",
      },
    };
  }
};

export const updateMutedFindingsConfig = async (
  _prevState: MutedFindingsConfigActionState,
  formData: FormData,
): Promise<MutedFindingsConfigActionState> => {
  const headers = await getAuthHeaders({ contentType: true });
  const formDataObject = Object.fromEntries(formData);
  const validatedData = mutedFindingsConfigFormSchema.safeParse(formDataObject);

  if (!validatedData.success) {
    const formFieldErrors = validatedData.error.flatten().fieldErrors;
    return {
      errors: {
        configuration: formFieldErrors?.configuration?.[0],
      },
    };
  }

  const { configuration, id } = validatedData.data;

  if (!id) {
    return {
      errors: {
        general: "Configuration ID is required for update",
      },
    };
  }

  try {
    const url = new URL(`${apiBaseUrl}/processors/${id}`);

    const bodyData = {
      data: {
        type: "processors",
        id,
        attributes: {
          configuration: configuration,
        },
      },
    };

    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(
          errorData?.errors?.[0]?.detail ||
            errorData?.message ||
            `Failed to update Mutelist configuration: ${response.statusText}`,
        );
      } catch {
        throw new Error(
          `Failed to update Mutelist configuration: ${response.statusText}`,
        );
      }
    }

    await response.json();
    return { success: "Mutelist configuration updated successfully!" };
  } catch (error) {
    console.error("Error updating Mutelist config:", error);
    return {
      errors: {
        configuration:
          error instanceof Error
            ? error.message
            : "Error updating Mutelist configuration. Please try again.",
      },
    };
  }
};

export const getMutedFindingsConfig = async (): Promise<
  ProcessorData | undefined
> => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/processors`);
  url.searchParams.append("filter[processor_type]", "mutelist");

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Mutelist config: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.data[0];
  } catch (error) {
    console.error("Error fetching Mutelist config:", error);
    return undefined;
  }
};

export const deleteMutedFindingsConfig = async (
  _prevState: DeleteMutedFindingsConfigActionState,
  formData: FormData,
): Promise<DeleteMutedFindingsConfigActionState> => {
  const headers = await getAuthHeaders({ contentType: true });
  const formDataObject = Object.fromEntries(formData);
  const processorId = formDataObject.id as string;

  if (!processorId) {
    return {
      errors: {
        general: "Configuration ID is required for deletion",
      },
    };
  }

  try {
    const url = new URL(`${apiBaseUrl}/processors/${processorId}`);
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.errors?.[0]?.detail ||
          `Failed to delete Mutelist configuration: ${response.statusText}`,
      );
    }

    return { success: "Mutelist configuration deleted successfully!" };
  } catch (error) {
    console.error("Error deleting Mutelist config:", error);
    return {
      errors: {
        general:
          error instanceof Error
            ? error.message
            : "Error deleting Mutelist configuration. Please try again.",
      },
    };
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/providers/index.ts

```typescript
export * from "./providers";
```

--------------------------------------------------------------------------------

---[FILE: providers.ts]---
Location: prowler-master/ui/actions/providers/providers.ts
Signals: Next.js

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { apiBaseUrl, getAuthHeaders, getFormValue, wait } from "@/lib";
import { buildSecretConfig } from "@/lib/provider-credentials/build-crendentials";
import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";
import { handleApiError, handleApiResponse } from "@/lib/server-actions-helper";
import { ProvidersApiResponse, ProviderType } from "@/types/providers";

export const getProviders = async ({
  page = 1,
  query = "",
  sort = "",
  filters = {},
  pageSize = 10,
}): Promise<ProvidersApiResponse | undefined> => {
  const headers = await getAuthHeaders({ contentType: false });

  if (isNaN(Number(page)) || page < 1) redirect("/providers");

  const url = new URL(`${apiBaseUrl}/providers?include=provider_groups`);

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

    return (await handleApiResponse(response)) as
      | ProvidersApiResponse
      | undefined;
  } catch (error) {
    console.error("Error fetching providers:", error);
    return undefined;
  }
};

export const getProvider = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: false });
  const providerId = formData.get("id");

  const url = new URL(`${apiBaseUrl}/providers/${providerId}`);

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateProvider = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });
  const providerId = formData.get(ProviderCredentialFields.PROVIDER_ID);
  const providerAlias = formData.get(ProviderCredentialFields.PROVIDER_ALIAS);
  const url = new URL(`${apiBaseUrl}/providers/${providerId}`);

  try {
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        data: {
          type: "providers",
          id: providerId,
          attributes: { alias: providerAlias },
        },
      }),
    });

    return handleApiResponse(response, "/providers");
  } catch (error) {
    return handleApiError(error);
  }
};

export const addProvider = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });

  const providerType = formData.get("providerType") as ProviderType;
  const providerUid = formData.get("providerUid") as string;
  const providerAlias = formData.get("providerAlias") as string;

  const url = new URL(`${apiBaseUrl}/providers`);

  try {
    const bodyData = {
      data: {
        type: "providers",
        attributes: {
          provider: providerType,
          uid: providerUid,
          ...(providerAlias?.trim() && { alias: providerAlias.trim() }),
        },
      },
    };

    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(bodyData),
    });

    return handleApiResponse(response, "/providers");
  } catch (error) {
    return handleApiError(error);
  }
};

export const addCredentialsProvider = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });
  const url = new URL(`${apiBaseUrl}/providers/secrets`);

  const providerId = getFormValue(
    formData,
    ProviderCredentialFields.PROVIDER_ID,
  );
  const providerType = getFormValue(
    formData,
    ProviderCredentialFields.PROVIDER_TYPE,
  ) as ProviderType;
  const providerUid = getFormValue(
    formData,
    ProviderCredentialFields.PROVIDER_UID,
  ) as string | undefined;

  try {
    // For IaC provider, fetch the provider data to get the repository URL from uid
    if (providerType === "iac") {
      const providerUrl = new URL(`${apiBaseUrl}/providers/${providerId}`);
      const providerResponse = await fetch(providerUrl.toString(), {
        headers: await getAuthHeaders({ contentType: false }),
      });

      if (providerResponse.ok) {
        const providerData = await providerResponse.json();
        const providerUid = providerData?.data?.attributes?.uid;

        // Add the repository URL to formData using the provider's uid
        if (providerUid) {
          formData.append(ProviderCredentialFields.REPOSITORY_URL, providerUid);
        }
      }
    }

    const { secretType, secret } = buildSecretConfig(
      formData,
      providerType,
      providerUid,
    );

    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "provider-secrets",
          attributes: { secret_type: secretType, secret },
          relationships: {
            provider: {
              data: { id: providerId, type: "providers" },
            },
          },
        },
      }),
    });

    return handleApiResponse(response, "/providers");
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateCredentialsProvider = async (
  credentialsId: string,
  formData: FormData,
) => {
  const headers = await getAuthHeaders({ contentType: true });
  const url = new URL(`${apiBaseUrl}/providers/secrets/${credentialsId}`);
  const providerType = getFormValue(
    formData,
    ProviderCredentialFields.PROVIDER_TYPE,
  ) as ProviderType;

  try {
    const { secretType, secret } = buildSecretConfig(formData, providerType);
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        data: {
          type: "provider-secrets",
          id: credentialsId,
          attributes: { secret_type: secretType, secret },
        },
      }),
    });

    return handleApiResponse(response, "/providers");
  } catch (error) {
    return handleApiError(error);
  }
};

export const checkConnectionProvider = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: false });
  const providerId = formData.get(ProviderCredentialFields.PROVIDER_ID);
  const url = new URL(`${apiBaseUrl}/providers/${providerId}/connection`);

  try {
    const response = await fetch(url.toString(), { method: "POST", headers });
    await wait(2000);

    return handleApiResponse(response, "/providers");
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteCredentials = async (secretId: string) => {
  const headers = await getAuthHeaders({ contentType: false });

  if (!secretId) {
    return { error: "Secret ID is required" };
  }

  const url = new URL(`${apiBaseUrl}/providers/secrets/${secretId}`);

  try {
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || "Failed to delete the credentials",
        );
      } catch {
        throw new Error("Failed to delete the credentials");
      }
    }

    let data = null;
    if (response.status !== 204) {
      data = await response.json();
    }

    revalidatePath("/providers");
    return data || { success: true };
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteProvider = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: false });
  const providerId = formData.get(ProviderCredentialFields.PROVIDER_ID);

  if (!providerId) {
    return { error: "Provider ID is required" };
  }

  const url = new URL(`${apiBaseUrl}/providers/${providerId}`);

  try {
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to delete the provider");
      } catch {
        throw new Error("Failed to delete the provider");
      }
    }

    let data = null;
    if (response.status !== 204) {
      data = await response.json();
    }

    revalidatePath("/providers");
    return data || { success: true };
  } catch (error) {
    handleApiError(error);
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/resources/index.ts

```typescript
export {
  getLatestMetadataInfo,
  getLatestResources,
  getMetadataInfo,
  getResourceById,
  getResources,
} from "./resources";
```

--------------------------------------------------------------------------------

---[FILE: resources.ts]---
Location: prowler-master/ui/actions/resources/resources.ts
Signals: Next.js

```typescript
"use server";

import { redirect } from "next/navigation";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiResponse } from "@/lib/server-actions-helper";

export const getResources = async ({
  page = 1,
  query = "",
  sort = "",
  filters = {},
  pageSize = 10,
  include = "",
  fields = [],
}: {
  page?: number;
  query?: string;
  sort?: string;
  filters?: Record<string, string>;
  pageSize?: number;
  include?: string;
  fields?: string[];
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  if (isNaN(Number(page)) || page < 1) redirect("resources");

  const url = new URL(`${apiBaseUrl}/resources`);

  if (fields.length > 0) {
    url.searchParams.append("fields[resources]", fields.join(","));
  }

  if (page) url.searchParams.append("page[number]", page.toString());
  if (pageSize) url.searchParams.append("page[size]", pageSize.toString());
  if (include) url.searchParams.append("include", include);
  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  Object.entries(filters).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return undefined;
  }
};

export const getLatestResources = async ({
  page = 1,
  query = "",
  sort = "",
  include = "",
  filters = {},
  pageSize = 10,
  fields = [],
}: {
  page?: number;
  query?: string;
  sort?: string;
  filters?: Record<string, string>;
  pageSize?: number;
  include?: string;
  fields?: string[];
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  if (isNaN(Number(page)) || page < 1) redirect("resources");

  const url = new URL(`${apiBaseUrl}/resources/latest`);

  if (fields.length > 0) {
    url.searchParams.append("fields[resources]", fields.join(","));
  }

  if (page) url.searchParams.append("page[number]", page.toString());
  if (pageSize) url.searchParams.append("page[size]", pageSize.toString());
  if (include) url.searchParams.append("include", include);
  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  Object.entries(filters).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching latest resources:", error);
    return undefined;
  }
};

export const getMetadataInfo = async ({
  query = "",
  sort = "",
  filters = {},
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/resources/metadata`);

  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  Object.entries(filters).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching metadata info:", error);
    return undefined;
  }
};

export const getLatestMetadataInfo = async ({
  query = "",
  sort = "",
  filters = {},
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/resources/metadata/latest`);

  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  Object.entries(filters).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching latest metadata info:", error);
    return undefined;
  }
};

export const getResourceById = async (
  id: string,
  {
    fields = [],
    include = [],
  }: {
    fields?: string[];
    include?: string[];
  } = {},
) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/resources/${id}`);

  if (fields.length > 0) {
    url.searchParams.append("fields[resources]", fields.join(","));
  }

  if (include.length > 0) {
    url.searchParams.append("include", include.join(","));
  }

  try {
    const resource = await fetch(url.toString(), {
      headers,
    });

    if (!resource.ok) {
      throw new Error(`Error fetching resource: ${resource.status}`);
    }

    return handleApiResponse(resource);
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    return undefined;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/roles/index.ts

```typescript
export * from "./roles";
```

--------------------------------------------------------------------------------

---[FILE: roles.ts]---
Location: prowler-master/ui/actions/roles/roles.ts
Signals: Next.js

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiError, handleApiResponse } from "@/lib/server-actions-helper";

export const getRoles = async ({
  page = 1,
  query = "",
  sort = "",
  filters = {},
  pageSize = 10,
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  if (isNaN(Number(page)) || page < 1) redirect("/roles");

  const url = new URL(`${apiBaseUrl}/roles`);

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
    console.error("Error fetching roles:", error);
    return undefined;
  }
};

export const getRoleInfoById = async (roleId: string) => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/roles/${roleId}`);

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

export const getRolesByIds = async (roleIds: string[]) => {
  if (!roleIds || roleIds.length === 0) {
    return { data: [] };
  }

  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/roles`);

  // Add filter for role IDs
  url.searchParams.append("filter[id__in]", roleIds.join(","));
  // Request all results on a single page with reasonable size
  url.searchParams.append("page[size]", "100");

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching roles by IDs:", error);
    return { data: [] };
  }
};

export const addRole = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });

  const name = formData.get("name") as string;
  const groups = formData.getAll("groups[]") as string[];

  const payload: any = {
    data: {
      type: "roles",
      attributes: {
        name,
        manage_users: formData.get("manage_users") === "true",
        manage_providers: formData.get("manage_providers") === "true",
        manage_scans: formData.get("manage_scans") === "true",
        manage_account: formData.get("manage_account") === "true",
        manage_integrations: formData.get("manage_integrations") === "true",
        unlimited_visibility: formData.get("unlimited_visibility") === "true",
      },
      relationships: {},
    },
  };

  // Conditionally include manage_billing for cloud environment
  if (process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true") {
    payload.data.attributes.manage_billing =
      formData.get("manage_billing") === "true";
  }

  // Add provider groups relationships only if there are items
  if (groups.length > 0) {
    payload.data.relationships.provider_groups = {
      data: groups.map((groupId: string) => ({
        type: "provider-groups",
        id: groupId,
      })),
    };
  }

  const body = JSON.stringify(payload);

  try {
    const url = new URL(`${apiBaseUrl}/roles`);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body,
    });

    return handleApiResponse(response, "/roles", false);
  } catch (error) {
    handleApiError(error);
  }
};

export const updateRole = async (formData: FormData, roleId: string) => {
  const headers = await getAuthHeaders({ contentType: true });

  const name = formData.get("name") as string;
  const groups = formData.getAll("groups[]") as string[];

  const payload: any = {
    data: {
      type: "roles",
      id: roleId,
      attributes: {
        ...(name && { name }), // Include name only if provided
        manage_users: formData.get("manage_users") === "true",
        manage_providers: formData.get("manage_providers") === "true",
        manage_account: formData.get("manage_account") === "true",
        manage_scans: formData.get("manage_scans") === "true",
        manage_integrations: formData.get("manage_integrations") === "true",
        unlimited_visibility: formData.get("unlimited_visibility") === "true",
      },
      relationships: {},
    },
  };

  // Conditionally include manage_billing for cloud environments
  if (process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true") {
    payload.data.attributes.manage_billing =
      formData.get("manage_billing") === "true";
  }

  // Add provider groups relationships only if there are items
  if (groups.length > 0) {
    payload.data.relationships.provider_groups = {
      data: groups.map((groupId: string) => ({
        type: "provider-groups",
        id: groupId,
      })),
    };
  }

  const body = JSON.stringify(payload);

  try {
    const url = new URL(`${apiBaseUrl}/roles/${roleId}`);
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body,
    });

    return handleApiResponse(response, "/roles", false);
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteRole = async (roleId: string) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/roles/${roleId}`);
  try {
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to delete the role");
      } catch {
        throw new Error("Failed to delete the role");
      }
    }

    let data = null;
    if (response.status !== 204) {
      data = await response.json();
    }

    revalidatePath("/roles");
    return data || { success: true };
  } catch (error) {
    handleApiError(error);
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/scans/index.ts

```typescript
export * from "./scans";
```

--------------------------------------------------------------------------------

---[FILE: scans.ts]---
Location: prowler-master/ui/actions/scans/scans.ts
Signals: Next.js

```typescript
"use server";

import { redirect } from "next/navigation";

import { apiBaseUrl, getAuthHeaders, getErrorMessage } from "@/lib";
import {
  COMPLIANCE_REPORT_DISPLAY_NAMES,
  type ComplianceReportType,
} from "@/lib/compliance/compliance-report-types";
import { addScanOperation } from "@/lib/sentry-breadcrumbs";
import { handleApiError, handleApiResponse } from "@/lib/server-actions-helper";
export const getScans = async ({
  page = 1,
  query = "",
  sort = "",
  filters = {},
  pageSize = 10,
  fields = {},
  include = "",
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  if (isNaN(Number(page)) || page < 1) redirect("/scans");

  const url = new URL(`${apiBaseUrl}/scans`);

  if (page) url.searchParams.append("page[number]", page.toString());
  if (pageSize) url.searchParams.append("page[size]", pageSize.toString());
  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);
  if (include) url.searchParams.append("include", include);

  // Handle fields parameters
  Object.entries(fields).forEach(([key, value]) => {
    url.searchParams.append(`fields[${key}]`, String(value));
  });

  // Add dynamic filters (e.g., "filter[state]", "fields[scans]")
  Object.entries(filters).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const response = await fetch(url.toString(), { headers });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching scans:", error);
    return undefined;
  }
};

export const getScansByState = async () => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/scans`);
  // Request only the necessary fields to optimize the response
  url.searchParams.append("fields[scans]", "state");

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching scans by state:", error);
    return undefined;
  }
};

export const getScan = async (scanId: string) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/scans/${scanId}`);

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export const scanOnDemand = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });
  const providerId = formData.get("providerId");
  const scanName = formData.get("scanName") || undefined;

  if (!providerId) {
    return { error: "Provider ID is required" };
  }

  addScanOperation("create", undefined, {
    provider_id: String(providerId),
    scan_name: scanName ? String(scanName) : undefined,
  });

  const url = new URL(`${apiBaseUrl}/scans`);

  try {
    const requestBody = {
      data: {
        type: "scans",
        attributes: scanName ? { name: scanName } : {},
        relationships: {
          provider: {
            data: {
              type: "providers",
              id: providerId,
            },
          },
        },
      },
    };

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    const result = await handleApiResponse(response, "/scans");
    if (result?.data?.id) {
      addScanOperation("start", result.data.id);
    }
    return result;
  } catch (error) {
    addScanOperation("create");
    return handleApiError(error);
  }
};

export const scheduleDaily = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });

  const providerId = formData.get("providerId");

  const url = new URL(`${apiBaseUrl}/schedules/daily`);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "daily-schedules",
          attributes: {
            provider_id: providerId,
          },
        },
      }),
    });

    return handleApiResponse(response, "/scans");
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateScan = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });

  const scanId = formData.get("scanId");
  const scanName = formData.get("scanName");

  const url = new URL(`${apiBaseUrl}/scans/${scanId}`);

  try {
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        data: {
          type: "scans",
          id: scanId,
          attributes: {
            name: scanName,
          },
        },
      }),
    });

    return handleApiResponse(response, "/scans");
  } catch (error) {
    return handleApiError(error);
  }
};

export const getExportsZip = async (scanId: string) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/scans/${scanId}/report`);

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    if (response.status === 202) {
      const json = await response.json();
      const taskId = json?.data?.id;
      const state = json?.data?.attributes?.state;
      return {
        pending: true,
        state,
        taskId,
      };
    }

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData?.errors?.detail ||
          "Unable to fetch scan report. Contact support if the issue continues.",
      );
    }

    // Get the blob data as an array buffer
    const arrayBuffer = await response.arrayBuffer();
    // Convert to base64
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      success: true,
      data: base64,
      filename: `scan-${scanId}-report.zip`,
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const getComplianceCsv = async (
  scanId: string,
  complianceId: string,
) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(
    `${apiBaseUrl}/scans/${scanId}/compliance/${complianceId}`,
  );

  try {
    const response = await fetch(url.toString(), { headers });

    if (response.status === 202) {
      const json = await response.json();
      const taskId = json?.data?.id;
      const state = json?.data?.attributes?.state;
      return {
        pending: true,
        state,
        taskId,
      };
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.errors?.detail ||
          "Unable to retrieve compliance report. Contact support if the issue continues.",
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      success: true,
      data: base64,
      filename: `scan-${scanId}-compliance-${complianceId}.csv`,
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

/**
 * Generic function to get a compliance PDF report (ThreatScore, ENS, etc.)
 * @param scanId - The scan ID
 * @param reportType - Type of report (from COMPLIANCE_REPORT_TYPES)
 * @returns Promise with the PDF data or error
 */
export const getCompliancePdfReport = async (
  scanId: string,
  reportType: ComplianceReportType,
) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/scans/${scanId}/${reportType}`);

  try {
    const response = await fetch(url.toString(), { headers });

    if (response.status === 202) {
      const json = await response.json();
      const taskId = json?.data?.id;
      const state = json?.data?.attributes?.state;
      return {
        pending: true,
        state,
        taskId,
      };
    }

    if (!response.ok) {
      const errorData = await response.json();
      const reportName = COMPLIANCE_REPORT_DISPLAY_NAMES[reportType];
      throw new Error(
        errorData?.errors?.detail ||
          `Unable to retrieve ${reportName} PDF report. Contact support if the issue continues.`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      success: true,
      data: base64,
      filename: `scan-${scanId}-${reportType}.pdf`,
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/task/index.ts

```typescript
export * from "./poll";
export * from "./tasks";
```

--------------------------------------------------------------------------------

---[FILE: poll.ts]---
Location: prowler-master/ui/actions/task/poll.ts

```typescript
"use server";

import { getTask } from "@/actions/task/tasks";
import { addTaskEvent } from "@/lib/sentry-breadcrumbs";
import type {
  GetTaskResponse,
  PollOptions,
  PollSettledResult,
  TaskState,
} from "@/types/tasks";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function pollTaskUntilSettled<R = unknown>(
  taskId: string,
  { maxAttempts = 10, delayMs = 2000 }: PollOptions = {},
): Promise<PollSettledResult<R>> {
  addTaskEvent("started", taskId, { max_attempts: maxAttempts });
  let attempts = 0;
  while (attempts < maxAttempts) {
    const resp = (await getTask(taskId)) as GetTaskResponse<R>;
    if ("error" in resp) {
      addTaskEvent("failed", taskId, { error: resp.error });
      return { ok: false, error: resp.error };
    }
    const task = resp.data;
    const state: TaskState | undefined = task?.attributes?.state;
    const result = task?.attributes?.result;

    if (!state) {
      addTaskEvent("failed", taskId, { error: "Task state unavailable" });
      return { ok: false, error: "Task state unavailable", task };
    }

    if (state !== "executing" && state !== "available") {
      addTaskEvent("completed", taskId, { state });
      return { ok: true, state, task, result };
    }

    attempts++;
    await sleep(delayMs);
  }
  addTaskEvent("timeout", taskId, { attempts: attempts });
  return { ok: false, error: "Task timeout" };
}
```

--------------------------------------------------------------------------------

---[FILE: tasks.ts]---
Location: prowler-master/ui/actions/task/tasks.ts

```typescript
"use server";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiError, handleApiResponse } from "@/lib/server-actions-helper";

export const getTask = async (taskId: string) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/tasks/${taskId}`);

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/users/index.ts

```typescript
export * from "./tenants";
export * from "./users";
```

--------------------------------------------------------------------------------

````
