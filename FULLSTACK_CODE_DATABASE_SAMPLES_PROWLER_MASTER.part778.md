---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 778
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 778 of 867)

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

---[FILE: feeds.ts]---
Location: prowler-master/ui/actions/feeds/feeds.ts
Signals: Next.js, Zod

```typescript
"use server";

import { unstable_cache } from "next/cache";
import Parser from "rss-parser";
import { z } from "zod";

import type { FeedError, FeedItem, FeedSource, ParsedFeed } from "./types";
import { FEED_SOURCE_TYPES } from "./types";

const feedSourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum([
    FEED_SOURCE_TYPES.GITHUB_RELEASES,
    FEED_SOURCE_TYPES.BLOG,
    FEED_SOURCE_TYPES.CUSTOM,
  ]),
  url: z.url(),
  enabled: z.boolean(),
});

const feedSourcesSchema = z.array(feedSourceSchema);

// Parse feed sources from environment variable
function getFeedSources(): FeedSource[] {
  const feedSourcesEnv = process.env.RSS_FEED_SOURCES;

  if (!feedSourcesEnv || feedSourcesEnv.trim().length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(feedSourcesEnv);
    const validated = feedSourcesSchema.parse(parsed);
    return validated.filter((source) => source.enabled);
  } catch {
    return [];
  }
}

// Parse a single RSS/Atom feed
async function parseSingleFeed(
  source: FeedSource,
): Promise<{ items: FeedItem[]; error?: FeedError }> {
  const parser = new Parser({
    timeout: 10000,
    headers: {
      "User-Agent": "Prowler-UI/1.0",
    },
  });

  try {
    const feed = await parser.parseURL(source.url);

    // Map RSS items to our FeedItem type
    const items: FeedItem[] = (feed.items || []).map((item) => {
      // Validate and parse date with fallback to current date
      const parsePubDate = (): string => {
        const dateString = item.isoDate || item.pubDate;
        if (!dateString) return new Date().toISOString();

        const parsed = new Date(dateString);
        return isNaN(parsed.getTime())
          ? new Date().toISOString()
          : parsed.toISOString();
      };

      return {
        id: item.guid || item.link || `${source.id}-${item.title}`,
        title: item.title || "Untitled",
        description:
          item.contentSnippet || item.content || item.description || "",
        link: item.link || "",
        pubDate: parsePubDate(),
        sourceId: source.id,
        sourceName: source.name,
        sourceType: source.type,
        author: item.creator || item.author,
        categories: item.categories || [],
        contentSnippet: item.contentSnippet || undefined,
      };
    });

    return { items };
  } catch (error) {
    return {
      items: [],
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        sourceId: source.id,
        sourceName: source.name,
      },
    };
  }
}

// Fetch and parse all enabled feeds
async function fetchAllFeeds(): Promise<ParsedFeed> {
  const sources = getFeedSources();

  if (sources.length === 0) {
    return {
      items: [],
      totalCount: 0,
      sources: [],
    };
  }

  // Fetch all feeds in parallel
  const results = await Promise.all(
    sources.map((source) => parseSingleFeed(source)),
  );

  // Combine all items from all sources (errors are handled gracefully by returning empty items)
  const allItems: FeedItem[] = results.flatMap((result) => result.items);

  // Sort by publication date (newest first)
  allItems.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );

  return {
    items: allItems,
    totalCount: allItems.length,
    sources,
  };
}

// Cached version of fetchAllFeeds with 5-minute revalidation
const getCachedFeeds = unstable_cache(
  async () => fetchAllFeeds(),
  ["rss-feeds"],
  {
    revalidate: 300, // 5 minutes
    tags: ["feeds"],
  },
);

// Public API: Fetch feeds with optional limit
export async function fetchFeeds(limit?: number): Promise<ParsedFeed> {
  const allFeeds = await getCachedFeeds();

  if (limit && limit > 0) {
    return {
      ...allFeeds,
      items: allFeeds.items.slice(0, limit),
    };
  }

  return allFeeds;
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/feeds/index.ts

```typescript
export * from "./feeds";
export * from "./types";
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: prowler-master/ui/actions/feeds/types.ts

```typescript
// Feed type definitions using const-based pattern

export const FEED_SOURCE_TYPES = {
  GITHUB_RELEASES: "github_releases",
  BLOG: "blog",
  CUSTOM: "custom",
} as const;

export type FeedSourceType =
  (typeof FEED_SOURCE_TYPES)[keyof typeof FEED_SOURCE_TYPES];

export interface FeedSource {
  id: string;
  name: string;
  type: FeedSourceType;
  url: string;
  enabled: boolean;
}

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string; // ISO 8601 format
  sourceId: string;
  sourceName: string;
  sourceType: FeedSourceType;
  author?: string;
  categories?: string[];
  contentSnippet?: string;
}

export interface ParsedFeed {
  items: FeedItem[];
  totalCount: number;
  sources: FeedSource[];
}

export interface FeedError {
  message: string;
  sourceId?: string;
  sourceName?: string;
}
```

--------------------------------------------------------------------------------

---[FILE: findings.ts]---
Location: prowler-master/ui/actions/findings/findings.ts
Signals: Next.js

```typescript
"use server";

import { redirect } from "next/navigation";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiResponse } from "@/lib/server-actions-helper";
export const getFindings = async ({
  page = 1,
  pageSize = 10,
  query = "",
  sort = "",
  filters = {},
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  if (isNaN(Number(page)) || page < 1)
    redirect("findings?include=resources,scan.provider");

  const url = new URL(`${apiBaseUrl}/findings?include=resources,scan.provider`);

  if (page) url.searchParams.append("page[number]", page.toString());
  if (pageSize) url.searchParams.append("page[size]", pageSize.toString());

  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  Object.entries(filters).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const findings = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(findings);
  } catch (error) {
    console.error("Error fetching findings:", error);
    return undefined;
  }
};

export const getLatestFindings = async ({
  page = 1,
  pageSize = 10,
  query = "",
  sort = "",
  filters = {},
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  if (isNaN(Number(page)) || page < 1)
    redirect("findings?include=resources,scan.provider");

  const url = new URL(
    `${apiBaseUrl}/findings/latest?include=resources,scan.provider`,
  );

  if (page) url.searchParams.append("page[number]", page.toString());
  if (pageSize) url.searchParams.append("page[size]", pageSize.toString());

  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  Object.entries(filters).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const findings = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(findings);
  } catch (error) {
    console.error("Error fetching findings:", error);
    return undefined;
  }
};

export const getMetadataInfo = async ({
  query = "",
  sort = "",
  filters = {},
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/findings/metadata`);

  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  Object.entries(filters).forEach(([key, value]) => {
    // Define filters to exclude
    const excludedFilters = ["region__in", "service__in", "resource_type__in"];
    if (
      key !== "filter[search]" &&
      !excludedFilters.some((filter) => key.includes(filter))
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

  const url = new URL(`${apiBaseUrl}/findings/metadata/latest`);

  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  Object.entries(filters).forEach(([key, value]) => {
    // Define filters to exclude
    const excludedFilters = ["region__in", "service__in", "resource_type__in"];
    if (
      key !== "filter[search]" &&
      !excludedFilters.some((filter) => key.includes(filter))
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
    console.error("Error fetching metadata info:", error);
    return undefined;
  }
};

export const getFindingById = async (findingId: string, include = "") => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/findings/${findingId}`);
  if (include) url.searchParams.append("include", include);

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching finding by ID:", error);
    return undefined;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/findings/index.ts

```typescript
export * from "./findings";
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/integrations/index.ts

```typescript
export {
  createIntegration,
  deleteIntegration,
  getIntegrations,
  pollConnectionTestStatus,
  testIntegrationConnection,
  updateIntegration,
} from "./integrations";
export {
  createSamlConfig,
  deleteSamlConfig,
  getSamlConfig,
  initiateSamlAuth,
  updateSamlConfig,
} from "./saml";
```

--------------------------------------------------------------------------------

---[FILE: integrations.ts]---
Location: prowler-master/ui/actions/integrations/integrations.ts
Signals: Next.js

```typescript
"use server";

import { revalidatePath } from "next/cache";

import { pollTaskUntilSettled } from "@/actions/task/poll";
import { apiBaseUrl, getAuthHeaders, parseStringify } from "@/lib";
import { handleApiError, handleApiResponse } from "@/lib/server-actions-helper";
import { IntegrationType } from "@/types/integrations";
import type { TaskState } from "@/types/tasks";

type TaskStartResponse = {
  data: { id: string; type: "tasks" };
};

type TestConnectionResponse = {
  success: boolean;
  message?: string;
  taskId?: string;
  data?: TaskStartResponse;
  error?: string;
};

export const getIntegrations = async (searchParams?: URLSearchParams) => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/integrations`);

  if (searchParams) {
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  try {
    const response = await fetch(url.toString(), { method: "GET", headers });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching integrations:", error);
    return { data: [], meta: { pagination: { count: 0 } } };
  }
};

export const createIntegration = async (
  formData: FormData,
): Promise<{ success: string; integrationId?: string } | { error: string }> => {
  const headers = await getAuthHeaders({ contentType: true });
  const url = new URL(`${apiBaseUrl}/integrations`);

  try {
    const integration_type = formData.get("integration_type") as string;
    const configuration = JSON.parse(
      formData.get("configuration") as string,
    ) as Record<string, unknown>;
    const credentials = JSON.parse(
      formData.get("credentials") as string,
    ) as Record<string, unknown>;
    const providers = JSON.parse(
      formData.get("providers") as string,
    ) as string[];
    const enabled = formData.get("enabled")
      ? JSON.parse(formData.get("enabled") as string)
      : true;

    const integrationData: {
      data: {
        type: "integrations";
        attributes: {
          integration_type: string;
          configuration: Record<string, unknown>;
          credentials: Record<string, unknown>;
          enabled: boolean;
        };
        relationships?: {
          providers: { data: { id: string; type: "providers" }[] };
        };
      };
    } = {
      data: {
        type: "integrations",
        attributes: { integration_type, configuration, credentials, enabled },
      },
    };

    if (Array.isArray(providers) && providers.length > 0) {
      integrationData.data.relationships = {
        providers: {
          data: providers.map((providerId: string) => ({
            id: providerId,
            type: "providers",
          })),
        },
      };
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(integrationData),
    });

    if (response.ok) {
      const responseData = await response.json();
      const integrationId = responseData.data.id;

      // Revalidate the appropriate page based on integration type
      if (integration_type === "amazon_s3") {
        revalidatePath("/integrations/amazon-s3");
      } else if (integration_type === "aws_security_hub") {
        revalidatePath("/integrations/aws-security-hub");
      } else if (integration_type === "jira") {
        revalidatePath("/integrations/jira");
      }

      return {
        success: "Integration created successfully!",
        integrationId,
      };
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.errors?.[0]?.detail ||
      `Unable to create integration: ${response.statusText}`;
    return { error: errorMessage };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateIntegration = async (
  id: string,
  formData: FormData,
): Promise<{ success: string; integrationId?: string } | { error: string }> => {
  const headers = await getAuthHeaders({ contentType: true });
  const url = new URL(`${apiBaseUrl}/integrations/${id}`);

  try {
    const integration_type = formData.get("integration_type") as string;
    const configuration = formData.get("configuration")
      ? (JSON.parse(formData.get("configuration") as string) as Record<
          string,
          unknown
        >)
      : undefined;
    const credentials = formData.get("credentials")
      ? (JSON.parse(formData.get("credentials") as string) as Record<
          string,
          unknown
        >)
      : undefined;
    const providers = formData.get("providers")
      ? (JSON.parse(formData.get("providers") as string) as string[])
      : undefined;
    const enabled = formData.get("enabled")
      ? JSON.parse(formData.get("enabled") as string)
      : undefined;

    const integrationData: {
      data: {
        type: "integrations";
        id: string;
        attributes: {
          integration_type: string;
          configuration?: Record<string, unknown>;
          credentials?: Record<string, unknown>;
          enabled?: boolean;
        };
        relationships?: {
          providers: { data: { id: string; type: "providers" }[] };
        };
      };
    } = {
      data: {
        type: "integrations",
        id,
        attributes: { integration_type },
      },
    };

    if (configuration) {
      integrationData.data.attributes.configuration = configuration;
    }

    if (credentials) {
      integrationData.data.attributes.credentials = credentials;
    }

    if (enabled !== undefined) {
      integrationData.data.attributes.enabled = enabled;
    }

    if (providers) {
      integrationData.data.relationships = {
        providers: {
          data: providers.map((providerId: string) => ({
            id: providerId,
            type: "providers",
          })),
        },
      };
    }

    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify(integrationData),
    });

    if (response.ok) {
      // Revalidate the appropriate page based on integration type
      if (integration_type === "amazon_s3") {
        revalidatePath("/integrations/amazon-s3");
      } else if (integration_type === "aws_security_hub") {
        revalidatePath("/integrations/aws-security-hub");
      } else if (integration_type === "jira") {
        revalidatePath("/integrations/jira");
      }

      return {
        success: "Integration updated successfully!",
        integrationId: id,
      };
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.errors?.[0]?.detail ||
      `Unable to update integration: ${response.statusText}`;
    return { error: errorMessage };
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteIntegration = async (
  id: string,
  integration_type: IntegrationType,
) => {
  const headers = await getAuthHeaders({ contentType: true });
  const url = new URL(`${apiBaseUrl}/integrations/${id}`);

  try {
    const response = await fetch(url.toString(), { method: "DELETE", headers });

    if (response.ok) {
      // Revalidate the appropriate page based on integration type
      if (integration_type === "amazon_s3") {
        revalidatePath("/integrations/amazon-s3");
      } else if (integration_type === "aws_security_hub") {
        revalidatePath("/integrations/aws-security-hub");
      } else if (integration_type === "jira") {
        revalidatePath("/integrations/jira");
      }

      return { success: "Integration deleted successfully!" };
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.errors?.[0]?.detail ||
      `Unable to delete integration: ${response.statusText}`;
    return { error: errorMessage };
  } catch (error) {
    return handleApiError(error);
  }
};

type ConnectionTaskResult = { connected?: boolean; error?: string | null };

type PollConnectionResult =
  | {
      success: true;
      message: string;
      taskState: TaskState;
      result: ConnectionTaskResult | undefined;
    }
  | {
      success: false;
      message: string;
      taskState?: TaskState;
      result?: ConnectionTaskResult;
    }
  | { error: string };

const pollTaskUntilComplete = async (
  taskId: string,
): Promise<PollConnectionResult> => {
  const settled = await pollTaskUntilSettled<ConnectionTaskResult>(taskId, {
    maxAttempts: 10,
    delayMs: 3000,
  });

  if (!settled.ok) {
    return { error: settled.error };
  }

  const taskState = settled.state;
  const result = settled.result;

  const isSuccessful =
    taskState === "completed" &&
    result?.connected === true &&
    result?.error === null;

  const message = isSuccessful
    ? "Connection test completed successfully."
    : result?.error || "Connection test failed.";

  return { success: isSuccessful, message, taskState, result };
};

export const testIntegrationConnection = async (
  id: string,
  waitForCompletion = true,
): Promise<TestConnectionResponse> => {
  const headers = await getAuthHeaders({ contentType: true });
  const url = new URL(`${apiBaseUrl}/integrations/${id}/connection`);

  try {
    const response = await fetch(url.toString(), { method: "POST", headers });

    if (response.ok) {
      const data = await response.json();
      const taskId = data?.data?.id;

      if (taskId) {
        // If waitForCompletion is false, return immediately with task started status
        if (!waitForCompletion) {
          return {
            success: true,
            message:
              "Connection test started. It may take some time to complete.",
            taskId,
            data: parseStringify(data),
          };
        }

        // Poll the task until completion
        const pollResult = await pollTaskUntilComplete(taskId);

        revalidatePath("/integrations/amazon-s3");
        revalidatePath("/integrations/aws-security-hub");
        revalidatePath("/integrations/jira");

        if ("error" in pollResult) {
          return { success: false, error: pollResult.error };
        }

        if (pollResult.success) {
          return {
            success: true,
            message:
              pollResult.message || "Connection test completed successfully!",
            data: parseStringify(data),
          };
        } else {
          return {
            success: false,
            error: pollResult.message || "Connection test failed.",
          };
        }
      } else {
        return {
          success: false,
          error: "Failed to start connection test. No task ID received.",
        };
      }
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.errors?.[0]?.detail ||
      `Unable to test integration connection: ${response.statusText}`;
    return { success: false, error: errorMessage };
  } catch (error) {
    const handled = handleApiError(error);
    return { success: false, error: handled.error };
  }
};

export const pollConnectionTestStatus = async (
  taskId: string,
): Promise<TestConnectionResponse> => {
  try {
    const pollResult = await pollTaskUntilComplete(taskId);

    revalidatePath("/integrations/amazon-s3");
    revalidatePath("/integrations/aws-security-hub");
    revalidatePath("/integrations/jira");

    if ("error" in pollResult) {
      return { success: false, error: pollResult.error };
    }

    if (pollResult.success) {
      return {
        success: true,
        message:
          pollResult.message || "Connection test completed successfully!",
      };
    } else {
      return {
        success: false,
        error: pollResult.message || "Connection test failed.",
      };
    }
  } catch (error) {
    return { success: false, error: "Failed to check connection test status." };
  }
};
```

--------------------------------------------------------------------------------

---[FILE: jira-dispatch.ts]---
Location: prowler-master/ui/actions/integrations/jira-dispatch.ts

```typescript
"use server";

import { pollTaskUntilSettled } from "@/actions/task/poll";
import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiError } from "@/lib/server-actions-helper";
import type {
  IntegrationProps,
  JiraDispatchRequest,
  JiraDispatchResponse,
} from "@/types/integrations";

export const getJiraIntegrations = async (): Promise<
  | { success: true; data: IntegrationProps[] }
  | { success: false; error: string }
> => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/integrations`);

  // Filter for Jira integrations only
  url.searchParams.append("filter[integration_type]", "jira");

  try {
    const response = await fetch(url.toString(), { method: "GET", headers });

    if (response.ok) {
      const data: { data: IntegrationProps[] } = await response.json();
      // Filter for enabled integrations on the client side
      const enabledIntegrations = (data.data || []).filter(
        (integration: IntegrationProps) =>
          integration.attributes.enabled === true,
      );
      return { success: true, data: enabledIntegrations };
    }

    const errorData: unknown = await response.json().catch(() => ({}));
    const errorMessage =
      (errorData as { errors?: { detail?: string }[] }).errors?.[0]?.detail ||
      `Unable to fetch Jira integrations: ${response.statusText}`;
    return { success: false, error: errorMessage };
  } catch (error) {
    const errorResult = handleApiError(error);
    return { success: false, error: errorResult.error || "An error occurred" };
  }
};

export const sendFindingToJira = async (
  integrationId: string,
  findingId: string,
  projectKey: string,
  _issueType: string,
): Promise<
  | { success: true; taskId: string; message: string }
  | { success: false; error: string }
> => {
  const headers = await getAuthHeaders({ contentType: true });
  const url = new URL(
    `${apiBaseUrl}/integrations/${integrationId}/jira/dispatches`,
  );

  // Single finding: use direct filter without array notation
  url.searchParams.append("filter[finding_id]", findingId);

  const payload: JiraDispatchRequest = {
    data: {
      type: "integrations-jira-dispatches",
      attributes: {
        project_key: projectKey,
        // Temporarily hardcode to "Task" regardless of the provided value
        issue_type: "Task",
      },
    },
  };

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data: JiraDispatchResponse = await response.json();
      const taskId = data?.data?.id;

      if (taskId) {
        return {
          success: true,
          taskId,
          message: "Jira issue creation started. Processing...",
        };
      } else {
        return {
          success: false,
          error: "Failed to start Jira dispatch. No task ID received.",
        };
      }
    }

    const errorData: unknown = await response.json().catch(() => ({}));
    const errorMessage =
      (errorData as { errors?: { detail?: string }[] }).errors?.[0]?.detail ||
      `Unable to send finding to Jira: ${response.statusText}`;
    return { success: false, error: errorMessage };
  } catch (error) {
    const errorResult = handleApiError(error);
    return { success: false, error: errorResult.error || "An error occurred" };
  }
};

export const pollJiraDispatchTask = async (
  taskId: string,
): Promise<
  { success: true; message: string } | { success: false; error: string }
> => {
  const res = await pollTaskUntilSettled(taskId, {
    maxAttempts: 10,
    delayMs: 2000,
  });
  if (!res.ok) {
    return { success: false, error: res.error };
  }
  const { state, result } = res;
  type JiraTaskResult = JiraDispatchResponse["data"]["attributes"]["result"];
  const jiraResult = result as JiraTaskResult | undefined;

  if (state === "completed") {
    if (!jiraResult?.error) {
      return { success: true, message: "Finding successfully sent to Jira!" };
    }
    return {
      success: false,
      error: jiraResult?.error || "Failed to create Jira issue.",
    };
  }

  if (state === "failed") {
    return { success: false, error: jiraResult?.error || "Task failed." };
  }

  return { success: false, error: `Unknown task state: ${state}` };
};
```

--------------------------------------------------------------------------------

---[FILE: saml.ts]---
Location: prowler-master/ui/actions/integrations/saml.ts
Signals: Next.js

```typescript
"use server";

import { revalidatePath } from "next/cache";

import { apiBaseUrl, getAuthHeaders } from "@/lib/helper";
import { handleApiResponse } from "@/lib/server-actions-helper";
import { samlConfigFormSchema } from "@/types/formSchemas";

export const createSamlConfig = async (_prevState: any, formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });
  const formDataObject = Object.fromEntries(formData);
  const validatedData = samlConfigFormSchema.safeParse(formDataObject);

  if (!validatedData.success) {
    const formFieldErrors = validatedData.error.flatten().fieldErrors;

    return {
      errors: {
        email_domain: formFieldErrors?.email_domain?.[0],
        metadata_xml: formFieldErrors?.metadata_xml?.[0],
      },
    };
  }

  const { email_domain, metadata_xml } = validatedData.data;

  try {
    const url = new URL(`${apiBaseUrl}/saml-config`);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "saml-configurations",
          attributes: {
            email_domain: email_domain.trim(),
            metadata_xml: metadata_xml.trim(),
          },
        },
      }),
    });

    const result = await handleApiResponse(response, "/integrations", false);
    if (result.error) {
      return {
        errors: {
          general:
            result.error instanceof Error
              ? result.error.message
              : "Error creating SAML configuration. Please try again.",
        },
      };
    }

    return { success: "SAML configuration created successfully!" };
  } catch (error) {
    console.error("Error creating SAML config:", error);
    return {
      errors: {
        general:
          error instanceof Error
            ? error.message
            : "Error creating SAML configuration. Please try again.",
      },
    };
  }
};

export const updateSamlConfig = async (_prevState: any, formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });
  const formDataObject = Object.fromEntries(formData);
  const validatedData = samlConfigFormSchema.safeParse(formDataObject);

  if (!validatedData.success) {
    const formFieldErrors = validatedData.error.flatten().fieldErrors;

    return {
      errors: {
        email_domain: formFieldErrors?.email_domain?.[0],
        metadata_xml: formFieldErrors?.metadata_xml?.[0],
      },
    };
  }

  const { email_domain, metadata_xml } = validatedData.data;

  try {
    const url = new URL(`${apiBaseUrl}/saml-config/${formDataObject.id}`);
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        data: {
          type: "saml-configurations",
          id: formDataObject.id,
          attributes: {
            email_domain: email_domain.trim(),
            metadata_xml: metadata_xml.trim(),
          },
        },
      }),
    });

    await handleApiResponse(response, "/integrations", false);
    return { success: "SAML configuration updated successfully!" };
  } catch (error) {
    console.error("Error updating SAML config:", error);
    return {
      errors: {
        general:
          error instanceof Error
            ? error.message
            : "Error creating SAML configuration. Please try again.",
      },
    };
  }
};

export const getSamlConfig = async () => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/saml-config`);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching SAML config:", error);
    return undefined;
  }
};

export const deleteSamlConfig = async (id: string) => {
  const headers = await getAuthHeaders({ contentType: true });

  try {
    const url = new URL(`${apiBaseUrl}/saml-config/${id}`);
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.errors?.[0]?.detail ||
          `Failed to delete SAML config: ${response.statusText}`,
      );
    }

    revalidatePath("/integrations");
    return { success: "SAML configuration deleted successfully!" };
  } catch (error) {
    console.error("Error deleting SAML config:", error);
    return {
      errors: {
        general:
          error instanceof Error
            ? error.message
            : "Error deleting SAML configuration. Please try again.",
      },
    };
  }
};

export const initiateSamlAuth = async (email: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/auth/saml/initiate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "saml-initiate",
          attributes: {
            email_domain: email,
          },
        },
      }),
      redirect: "manual",
    });

    if (response.status === 302) {
      const location = response.headers.get("Location");

      if (location) {
        return {
          success: true,
          redirectUrl: location,
        };
      }
    }

    if (response.status === 403) {
      return {
        success: false,
        error: "Domain is not authorized for SAML authentication.",
      };
    }

    // Add error other error case:
    const errorData = await response.json().catch(() => ({}));
    return {
      success: false,
      error:
        errorData.errors?.[0]?.detail ||
        "An error occurred during SAML authentication.",
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to connect to authentication service.",
    };
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/invitations/index.ts

```typescript
export * from "./invitation";
```

--------------------------------------------------------------------------------

---[FILE: invitation.ts]---
Location: prowler-master/ui/actions/invitations/invitation.ts
Signals: Next.js

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiError, handleApiResponse } from "@/lib/server-actions-helper";

export const getInvitations = async ({
  page = 1,
  query = "",
  sort = "",
  filters = {},
  pageSize = 10,
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  if (isNaN(Number(page)) || page < 1) redirect("/invitations");

  const url = new URL(`${apiBaseUrl}/tenants/invitations`);

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
    console.error("Error fetching invitations:", error);
    return undefined;
  }
};

export const sendInvite = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });

  const email = formData.get("email");
  const role = formData.get("role");
  const url = new URL(`${apiBaseUrl}/tenants/invitations`);

  const body = JSON.stringify({
    data: {
      type: "invitations",
      attributes: {
        email,
      },
      relationships: {
        roles: {
          data: role
            ? [
                {
                  id: role,
                  type: "roles",
                },
              ]
            : [],
        },
      },
    },
  });

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body,
    });

    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error);
  }
};

export const updateInvite = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: true });

  const invitationId = formData.get("invitationId");
  const invitationEmail = formData.get("invitationEmail");
  const roleId = formData.get("role");
  const expiresAt =
    formData.get("expires_at") ||
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const url = new URL(`${apiBaseUrl}/tenants/invitations/${invitationId}`);

  const body: any = {
    data: {
      type: "invitations",
      id: invitationId,
      attributes: {},
      relationships: {},
    },
  };

  // Only add attributes that exist in the formData
  if (invitationEmail) {
    body.data.attributes.email = invitationEmail;
  }
  if (expiresAt) {
    body.data.attributes.expires_at = expiresAt;
  }
  if (roleId) {
    body.data.relationships.roles = {
      data: [
        {
          id: roleId,
          type: "roles",
        },
      ],
    };
  }

  try {
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error };
    }

    return handleApiResponse(response, "/invitations");
  } catch (error) {
    handleApiError(error);
  }
};

export const getInvitationInfoById = async (invitationId: string) => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/tenants/invitations/${invitationId}`);

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

export const revokeInvite = async (formData: FormData) => {
  const headers = await getAuthHeaders({ contentType: false });
  const invitationId = formData.get("invitationId");

  if (!invitationId) {
    return { error: "Invitation ID is required" };
  }

  const url = new URL(`${apiBaseUrl}/tenants/invitations/${invitationId}`);

  try {
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || "Failed to revoke the invitation",
        );
      } catch {
        throw new Error("Failed to revoke the invitation");
      }
    }

    let data = null;
    if (response.status !== 204) {
      data = await response.json();
    }

    revalidatePath("/invitations");
    return data || { success: true };
  } catch (error) {
    handleApiError(error);
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/lighthouse/index.ts

```typescript
export * from "./lighthouse";
```

--------------------------------------------------------------------------------

````
