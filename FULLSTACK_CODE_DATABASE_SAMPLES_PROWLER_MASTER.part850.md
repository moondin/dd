---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 850
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 850 of 867)

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

---[FILE: test-connection-helper.ts]---
Location: prowler-master/ui/lib/integrations/test-connection-helper.ts

```typescript
import {
  pollConnectionTestStatus,
  testIntegrationConnection,
} from "@/actions/integrations";

// Integration configuration type
export interface IntegrationMessages {
  testingMessage: string;
  successMessage: string;
  errorMessage: string;
}

// Configuration map for integration-specific messages
const INTEGRATION_CONFIG: Record<string, IntegrationMessages> = {
  "amazon-s3": {
    testingMessage: "Testing connection to Amazon S3 bucket...",
    successMessage: "Successfully connected to Amazon S3 bucket.",
    errorMessage: "Failed to connect to Amazon S3 bucket.",
  },
  "aws-security-hub": {
    testingMessage: "Testing connection to AWS Security Hub...",
    successMessage: "Successfully connected to AWS Security Hub.",
    errorMessage: "Failed to connect to AWS Security Hub.",
  },
  // Legacy mappings for backward compatibility
  s3: {
    testingMessage: "Testing connection to Amazon S3 bucket...",
    successMessage: "Successfully connected to Amazon S3 bucket.",
    errorMessage: "Failed to connect to Amazon S3 bucket.",
  },
  security_hub: {
    testingMessage: "Testing connection to AWS Security Hub...",
    successMessage: "Successfully connected to AWS Security Hub.",
    errorMessage: "Failed to connect to AWS Security Hub.",
  },
  // Add new integrations here as needed
};

// Helper function to register new integration types
export const registerIntegrationType = (
  type: string,
  messages: IntegrationMessages,
): void => {
  INTEGRATION_CONFIG[type] = messages;
};

// Helper function to get supported integration types
export const getSupportedIntegrationTypes = (): string[] => {
  return Object.keys(INTEGRATION_CONFIG);
};

interface TestConnectionOptions {
  integrationId: string;
  integrationType: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onStart?: () => void;
  onComplete?: () => void;
}

export const runTestConnection = async ({
  integrationId,
  integrationType,
  onSuccess,
  onError,
  onStart,
  onComplete,
}: TestConnectionOptions) => {
  try {
    // Start the test without waiting for completion
    const result = await testIntegrationConnection(integrationId, false);

    if (!result || (!result.success && !result.error)) {
      onError?.("Connection test could not be started. Please try again.");
      onComplete?.();
      return;
    }

    if (result.error) {
      onError?.(result.error);
      onComplete?.();
      return;
    }

    if (!result.taskId) {
      onError?.("Failed to start connection test. No task ID received.");
      onComplete?.();
      return;
    }

    // Notify that test has started
    onStart?.();

    // Poll for the test completion
    const pollResult = await pollConnectionTestStatus(result.taskId);

    if (pollResult.success) {
      const config = INTEGRATION_CONFIG[integrationType];
      const defaultMessage =
        config?.successMessage ||
        `Successfully connected to ${integrationType}.`;
      onSuccess?.(pollResult.message || defaultMessage);
    } else {
      const config = INTEGRATION_CONFIG[integrationType];
      const defaultError =
        config?.errorMessage || `Failed to connect to ${integrationType}.`;
      onError?.(pollResult.error || defaultError);
    }
  } catch (error) {
    onError?.(
      "Failed to start connection test. You can try manually using the Test Connection button.",
    );
  } finally {
    onComplete?.();
  }
};

export const triggerTestConnectionWithDelay = (
  integrationId: string | undefined,
  shouldTestConnection: boolean | undefined,
  integrationType: string,
  toast: any,
  delay = 200,
  onComplete?: () => void,
) => {
  if (!integrationId || !shouldTestConnection) {
    onComplete?.();
    return;
  }

  setTimeout(() => {
    runTestConnection({
      integrationId,
      integrationType,
      onStart: () => {
        const config = INTEGRATION_CONFIG[integrationType];
        const description =
          config?.testingMessage ||
          `Testing connection to ${integrationType}...`;
        toast({
          title: "Connection test started!",
          description,
        });
      },
      onSuccess: (message) => {
        toast({
          title: "Connection test successful!",
          description: message,
        });
      },
      onError: (message) => {
        toast({
          variant: "destructive",
          title: "Connection test failed",
          description: message,
        });
      },
      onComplete,
    });
  }, delay);
};
```

--------------------------------------------------------------------------------

---[FILE: analyst-stream.ts]---
Location: prowler-master/ui/lib/lighthouse/analyst-stream.ts

```typescript
/**
 * Utilities for handling Lighthouse analyst stream events
 * Server-side only (used in API routes)
 */

import {
  CHAIN_OF_THOUGHT_ACTIONS,
  type ChainOfThoughtAction,
  ERROR_PREFIX,
  LIGHTHOUSE_AGENT_TAG,
  META_TOOLS,
  STREAM_MESSAGE_ID,
} from "@/lib/lighthouse/constants";
import type { ChainOfThoughtData, StreamEvent } from "@/lib/lighthouse/types";

// Re-export for convenience
export { CHAIN_OF_THOUGHT_ACTIONS, ERROR_PREFIX, STREAM_MESSAGE_ID };

/**
 * Extracts the actual tool name from meta-tool input.
 *
 * Meta-tools (describe_tool, execute_tool) wrap actual tool calls.
 * This function parses the input to extract the real tool name.
 *
 * @param metaToolName - The name of the meta-tool or actual tool
 * @param toolInput - The input data for the tool
 * @returns The actual tool name, or null if it cannot be determined
 */
export function extractActualToolName(
  metaToolName: string,
  toolInput: unknown,
): string | null {
  // Check if this is a meta-tool
  if (
    metaToolName === META_TOOLS.DESCRIBE ||
    metaToolName === META_TOOLS.EXECUTE
  ) {
    // Meta-tool: Parse the JSON string in input.input
    try {
      if (
        toolInput &&
        typeof toolInput === "object" &&
        "input" in toolInput &&
        typeof toolInput.input === "string"
      ) {
        const parsedInput = JSON.parse(toolInput.input);
        return parsedInput.toolName || null;
      }
    } catch {
      // Failed to parse, return null
      return null;
    }
  }

  // Actual tool execution: use the name directly
  return metaToolName;
}

/**
 * Creates a text-start event
 */
export function createTextStartEvent(messageId: string): StreamEvent {
  return {
    type: "text-start",
    id: messageId,
  };
}

/**
 * Creates a text-delta event
 */
export function createTextDeltaEvent(
  messageId: string,
  delta: string,
): StreamEvent {
  return {
    type: "text-delta",
    id: messageId,
    delta,
  };
}

/**
 * Creates a text-end event
 */
export function createTextEndEvent(messageId: string): StreamEvent {
  return {
    type: "text-end",
    id: messageId,
  };
}

/**
 * Creates a chain-of-thought event
 */
export function createChainOfThoughtEvent(
  data: ChainOfThoughtData,
): StreamEvent {
  return {
    type: "data-chain-of-thought",
    data,
  };
}

// Event Handler Types
interface StreamController {
  enqueue: (event: StreamEvent) => void;
}

interface ChatModelStreamData {
  chunk?: {
    content?: string | unknown;
  };
}

interface ChatModelEndData {
  output?: {
    tool_calls?: Array<{
      id: string;
      name: string;
      args: Record<string, unknown>;
    }>;
  };
}

/**
 * Handles chat model stream events - processes token-by-token text streaming
 *
 * @param controller - The ReadableStream controller
 * @param data - The event data containing the chunk
 * @param tags - Tags associated with the event
 * @returns True if the event was handled and should mark stream as started
 */
export function handleChatModelStreamEvent(
  controller: StreamController,
  data: ChatModelStreamData,
  tags: string[] | undefined,
): boolean {
  if (data.chunk?.content && tags && tags.includes(LIGHTHOUSE_AGENT_TAG)) {
    const content =
      typeof data.chunk.content === "string" ? data.chunk.content : "";

    if (content) {
      controller.enqueue(createTextDeltaEvent(STREAM_MESSAGE_ID, content));
      return true;
    }
  }
  return false;
}

/**
 * Handles chat model end events - detects and emits tool planning events
 *
 * @param controller - The ReadableStream controller
 * @param data - The event data containing AI message output
 */
export function handleChatModelEndEvent(
  controller: StreamController,
  data: ChatModelEndData,
): void {
  const aiMessage = data?.output;

  if (
    aiMessage &&
    typeof aiMessage === "object" &&
    "tool_calls" in aiMessage &&
    Array.isArray(aiMessage.tool_calls) &&
    aiMessage.tool_calls.length > 0
  ) {
    // Emit data annotation for tool planning
    for (const toolCall of aiMessage.tool_calls) {
      const metaToolName = toolCall.name;
      const toolArgs = toolCall.args;

      // Extract actual tool name from toolArgs.toolName (camelCase)
      const actualToolName =
        toolArgs && typeof toolArgs === "object" && "toolName" in toolArgs
          ? (toolArgs.toolName as string)
          : null;

      controller.enqueue(
        createChainOfThoughtEvent({
          action: CHAIN_OF_THOUGHT_ACTIONS.PLANNING,
          metaTool: metaToolName,
          tool: actualToolName,
          toolCallId: toolCall.id,
        }),
      );
    }
  }
}

/**
 * Handles tool start/end events - emits chain-of-thought events for tool execution
 *
 * @param controller - The ReadableStream controller
 * @param action - The action type (START or COMPLETE)
 * @param name - The name of the tool
 * @param toolInput - The input data for the tool
 */
export function handleToolEvent(
  controller: StreamController,
  action: ChainOfThoughtAction,
  name: string | undefined,
  toolInput: unknown,
): void {
  const metaToolName = typeof name === "string" ? name : "unknown";
  const actualToolName = extractActualToolName(metaToolName, toolInput);

  controller.enqueue(
    createChainOfThoughtEvent({
      action,
      metaTool: metaToolName,
      tool: actualToolName,
    }),
  );
}
```

--------------------------------------------------------------------------------

---[FILE: auth-context.ts]---
Location: prowler-master/ui/lib/lighthouse/auth-context.ts

```typescript
import "server-only";

import { AsyncLocalStorage } from "async_hooks";

/**
 * AsyncLocalStorage instance for storing the access token in the current async context.
 * This enables authentication to flow through MCP tool calls without explicit parameter passing.
 *
 * @remarks This module is server-only as it uses Node.js AsyncLocalStorage
 */
export const authContextStorage = new AsyncLocalStorage<string>();

/**
 * Retrieves the access token from the current async context.
 *
 * @returns The access token if available, null otherwise
 *
 * @example
 * ```typescript
 * const token = getAuthContext();
 * if (token) {
 *   headers.Authorization = `Bearer ${token}`;
 * }
 * ```
 */
export function getAuthContext(): string | null {
  return authContextStorage.getStore() ?? null;
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: prowler-master/ui/lib/lighthouse/constants.ts

```typescript
/**
 * Shared constants for Lighthouse AI
 * Used by both server-side (API routes) and client-side (components)
 */

export const META_TOOLS = {
  DESCRIBE: "describe_tool",
  EXECUTE: "execute_tool",
} as const;

export type MetaTool = (typeof META_TOOLS)[keyof typeof META_TOOLS];

export const CHAIN_OF_THOUGHT_ACTIONS = {
  PLANNING: "tool_planning",
  START: "tool_start",
  COMPLETE: "tool_complete",
} as const;

export type ChainOfThoughtAction =
  (typeof CHAIN_OF_THOUGHT_ACTIONS)[keyof typeof CHAIN_OF_THOUGHT_ACTIONS];

export const MESSAGE_STATUS = {
  STREAMING: "streaming",
  SUBMITTED: "submitted",
  IDLE: "idle",
} as const;

export type MessageStatus =
  (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS];

export const MESSAGE_ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
} as const;

export type MessageRole = (typeof MESSAGE_ROLES)[keyof typeof MESSAGE_ROLES];

export const STREAM_EVENT_TYPES = {
  TEXT_START: "text-start",
  TEXT_DELTA: "text-delta",
  TEXT_END: "text-end",
  DATA_CHAIN_OF_THOUGHT: "data-chain-of-thought",
} as const;

export type StreamEventType =
  (typeof STREAM_EVENT_TYPES)[keyof typeof STREAM_EVENT_TYPES];

export const MESSAGE_PART_TYPES = {
  TEXT: "text",
  DATA_CHAIN_OF_THOUGHT: "data-chain-of-thought",
} as const;

export type MessagePartType =
  (typeof MESSAGE_PART_TYPES)[keyof typeof MESSAGE_PART_TYPES];

export const CHAIN_OF_THOUGHT_STATUS = {
  COMPLETE: "complete",
  ACTIVE: "active",
  PENDING: "pending",
} as const;

export type ChainOfThoughtStatus =
  (typeof CHAIN_OF_THOUGHT_STATUS)[keyof typeof CHAIN_OF_THOUGHT_STATUS];

export const LIGHTHOUSE_AGENT_TAG = "lighthouse-agent";

export const STREAM_MESSAGE_ID = "msg-1";

export const ERROR_PREFIX = "[LIGHTHOUSE_ANALYST_ERROR]:";

export const TOOLS_UNAVAILABLE_MESSAGE =
  "\nProwler tools are unavailable. You cannot access cloud accounts or security scan data. If asked about security status or scan results, inform the user that this data is currently inaccessible.\n";
```

--------------------------------------------------------------------------------

---[FILE: data.ts]---
Location: prowler-master/ui/lib/lighthouse/data.ts

```typescript
import { getProviders } from "@/actions/providers/providers";
import { getScans } from "@/actions/scans/scans";
import { getUserInfo } from "@/actions/users/users";
import type { ProviderProps } from "@/types/providers";

interface ProviderEntry {
  alias: string;
  name: string;
  provider_type: string;
  id: string;
  last_checked_at: string;
}

interface ProviderWithScans extends ProviderEntry {
  scan_id?: string;
  scan_duration?: number;
  resource_count?: number;
}

export async function getCurrentDataSection(): Promise<string> {
  try {
    const profileData = await getUserInfo();

    if (!profileData || !profileData.data) {
      throw new Error("Unable to fetch user profile data");
    }

    const userData = {
      name: profileData.data.attributes?.name || "",
      email: profileData.data.attributes?.email || "",
      company: profileData.data.attributes?.company_name || "",
    };

    const providersData = await getProviders({});

    if (!providersData || !providersData.data) {
      throw new Error("Unable to fetch providers data");
    }

    const providerEntries: ProviderEntry[] = providersData.data.map(
      (provider: ProviderProps) => ({
        alias: provider.attributes?.alias || "Unknown",
        name: provider.attributes?.uid || "Unknown",
        provider_type: provider.attributes?.provider || "Unknown",
        id: provider.id || "Unknown",
        last_checked_at:
          provider.attributes?.connection?.last_checked_at || "Unknown",
      }),
    );

    const providersWithScans: ProviderWithScans[] = await Promise.all(
      providerEntries.map(async (provider: ProviderEntry) => {
        try {
          // Get scan data for this provider
          const scansData = await getScans({
            page: 1,
            sort: "-inserted_at",
            filters: {
              "filter[provider]": provider.id,
              "filter[state]": "completed",
            },
          });

          // If scans exist, add the scan information to the provider
          if (scansData && scansData.data && scansData.data.length > 0) {
            const latestScan = scansData.data[0];
            return {
              ...provider,
              scan_id: latestScan.id,
              scan_duration: latestScan.attributes?.duration,
              resource_count: latestScan.attributes?.unique_resource_count,
            };
          }

          return provider;
        } catch (error) {
          console.error(
            `Error fetching scans for provider ${provider.id}:`,
            error,
          );
          return provider;
        }
      }),
    );

    return `
**TODAY'S DATE:**
${new Date().toISOString()}

**CURRENT USER DATA:**
Information about the current user interacting with the chatbot:
User: ${userData.name}
Email: ${userData.email}
Company: ${userData.company}

**CURRENT PROVIDER DATA:**
${
  providersWithScans.length === 0
    ? "No Providers Connected"
    : providersWithScans
        .map(
          (provider, index) => `
Provider ${index + 1}:
- Name: ${provider.name}
- Type: ${provider.provider_type}
- Alias: ${provider.alias}
- Provider ID: ${provider.id}
- Last Checked: ${provider.last_checked_at}
${
  provider.scan_id
    ? `- Latest Scan ID: ${provider.scan_id} (informational only - findings tools automatically use latest data)
- Scan Duration: ${provider.scan_duration || "Unknown"}
- Resource Count: ${provider.resource_count || "Unknown"}`
    : "- No completed scans found"
}
`,
        )
        .join("\n")
}
`;
  } catch (error) {
    console.error("Failed to retrieve current data:", error);
    return "**CURRENT DATA: Not available**";
  }
}
```

--------------------------------------------------------------------------------

---[FILE: llm-factory.ts]---
Location: prowler-master/ui/lib/lighthouse/llm-factory.ts

```typescript
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { ChatBedrockConverse } from "@langchain/aws";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOpenAI } from "@langchain/openai";

const PROVIDER_TYPES = {
  OPENAI: "openai",
  BEDROCK: "bedrock",
  OPENAI_COMPATIBLE: "openai_compatible",
} as const;

export type ProviderType = (typeof PROVIDER_TYPES)[keyof typeof PROVIDER_TYPES];

export interface LLMCredentials {
  api_key?: string;
  access_key_id?: string;
  secret_access_key?: string;
  region?: string;
}

export interface LLMConfig {
  provider: ProviderType;
  model: string;
  credentials: LLMCredentials;
  baseUrl?: string;
  streaming?: boolean;
  tags?: string[];
  modelParams?: {
    maxTokens?: number;
    temperature?: number;
    reasoningEffort?: string;
  };
}

function createBedrockClient(
  credentials: LLMCredentials,
): BedrockRuntimeClient {
  if (!credentials.region) {
    throw new Error("Bedrock provider requires region");
  }

  if (credentials.api_key) {
    return new BedrockRuntimeClient({
      region: credentials.region,
      token: async () => ({ token: credentials.api_key as string }),
      authSchemePreference: ["httpBearerAuth"],
    });
  }

  if (!credentials.access_key_id || !credentials.secret_access_key) {
    throw new Error(
      "Bedrock provider requires either api_key or access_key_id and secret_access_key",
    );
  }

  return new BedrockRuntimeClient({
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.access_key_id,
      secretAccessKey: credentials.secret_access_key,
    },
  });
}

function createBedrockLLM(config: LLMConfig): ChatBedrockConverse {
  const client = createBedrockClient(config.credentials);

  return new ChatBedrockConverse({
    model: config.model,
    client,
    region: config.credentials.region!,
    streaming: config.streaming,
    tags: config.tags,
    maxTokens: config.modelParams?.maxTokens,
    temperature: config.modelParams?.temperature,
  });
}

export function createLLM(config: LLMConfig): BaseChatModel {
  switch (config.provider) {
    case PROVIDER_TYPES.OPENAI:
      return new ChatOpenAI({
        modelName: config.model,
        apiKey: config.credentials.api_key,
        streaming: config.streaming,
        tags: config.tags,
        maxTokens: config.modelParams?.maxTokens,
        temperature: config.modelParams?.temperature,
      });

    case PROVIDER_TYPES.OPENAI_COMPATIBLE:
      return new ChatOpenAI({
        modelName: config.model,
        apiKey: config.credentials.api_key,
        configuration: {
          baseURL: config.baseUrl,
        },
        streaming: config.streaming,
        tags: config.tags,
        maxTokens: config.modelParams?.maxTokens,
        temperature: config.modelParams?.temperature,
      });

    case PROVIDER_TYPES.BEDROCK:
      return createBedrockLLM(config);

    default:
      throw new Error(`Unknown provider type: ${config.provider}`);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: mcp-client.ts]---
Location: prowler-master/ui/lib/lighthouse/mcp-client.ts

```typescript
import "server-only";

import type { StructuredTool } from "@langchain/core/tools";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import {
  addBreadcrumb,
  captureException,
  captureMessage,
} from "@sentry/nextjs";

import { getAuthContext } from "@/lib/lighthouse/auth-context";
import { SentryErrorSource, SentryErrorType } from "@/sentry";

/** Maximum number of retry attempts for MCP connection */
const MAX_RETRY_ATTEMPTS = 3;

/** Delay between retry attempts in milliseconds */
const RETRY_DELAY_MS = 2000;

/** Time after which to attempt reconnection if MCP is unavailable (5 minutes) */
const RECONNECT_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Delays execution for specified milliseconds
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * MCP Client State
 * Using a class-based singleton for better encapsulation and testability
 */
class MCPClientManager {
  private client: MultiServerMCPClient | null = null;
  private tools: StructuredTool[] = [];
  private available = false;
  private initializationAttempted = false;
  private initializationPromise: Promise<void> | null = null;
  private lastAttemptTime: number | null = null;

  /**
   * Validates the MCP server URL from environment variables
   */
  private validateMCPServerUrl(): string | null {
    const mcpServerUrl = process.env.PROWLER_MCP_SERVER_URL;

    if (!mcpServerUrl) {
      // MCP is optional - not an error if not configured
      return null;
    }

    try {
      new URL(mcpServerUrl);
      return mcpServerUrl;
    } catch {
      captureMessage(`Invalid PROWLER_MCP_SERVER_URL: ${mcpServerUrl}`, {
        level: "error",
        tags: {
          error_source: SentryErrorSource.MCP_CLIENT,
          error_type: SentryErrorType.MCP_CONNECTION_ERROR,
        },
      });
      return null;
    }
  }

  /**
   * Checks if enough time has passed to allow a reconnection attempt
   */
  private shouldAttemptReconnection(): boolean {
    if (!this.lastAttemptTime) return true;
    if (this.available) return false;

    const timeSinceLastAttempt = Date.now() - this.lastAttemptTime;
    return timeSinceLastAttempt >= RECONNECT_INTERVAL_MS;
  }

  /**
   * Injects auth headers for Prowler App tools
   */
  private handleBeforeToolCall = ({
    name,
    args,
  }: {
    serverName: string;
    name: string;
    args?: unknown;
  }) => {
    // Only inject auth for Prowler App tools (user-specific data)
    // Prowler Hub and Prowler Docs tools don't require authentication
    if (!name.startsWith("prowler_app_")) {
      return { args };
    }

    const accessToken = getAuthContext();
    if (!accessToken) {
      addBreadcrumb({
        category: "mcp-client",
        message: `Auth context missing for tool: ${name}`,
        level: "warning",
      });
      return { args };
    }

    return {
      args,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  };

  /**
   * Attempts to connect to the MCP server with retry logic
   */
  private async connectWithRetry(mcpServerUrl: string): Promise<boolean> {
    for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
      try {
        this.client = new MultiServerMCPClient({
          additionalToolNamePrefix: "",
          mcpServers: {
            prowler: {
              transport: "http",
              url: mcpServerUrl,
              defaultToolTimeout: 180000, // 3 minutes
            },
          },
          beforeToolCall: this.handleBeforeToolCall,
        });

        this.tools = await this.client.getTools();
        this.available = true;

        addBreadcrumb({
          category: "mcp-client",
          message: `MCP client connected successfully (attempt ${attempt})`,
          level: "info",
          data: { toolCount: this.tools.length },
        });

        return true;
      } catch (error) {
        const isLastAttempt = attempt === MAX_RETRY_ATTEMPTS;
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        addBreadcrumb({
          category: "mcp-client",
          message: `MCP connection attempt ${attempt}/${MAX_RETRY_ATTEMPTS} failed`,
          level: "warning",
          data: { error: errorMessage },
        });

        if (isLastAttempt) {
          const isConnectionError =
            errorMessage.includes("ECONNREFUSED") ||
            errorMessage.includes("ENOTFOUND") ||
            errorMessage.includes("timeout") ||
            errorMessage.includes("network");

          captureException(error, {
            tags: {
              error_type: isConnectionError
                ? SentryErrorType.MCP_CONNECTION_ERROR
                : SentryErrorType.MCP_DISCOVERY_ERROR,
              error_source: SentryErrorSource.MCP_CLIENT,
            },
            level: "error",
            contexts: {
              mcp: {
                server_url: mcpServerUrl,
                attempts: MAX_RETRY_ATTEMPTS,
                error_message: errorMessage,
                is_connection_error: isConnectionError,
              },
            },
          });

          console.error(`[MCP Client] Failed to initialize: ${errorMessage}`);
        } else {
          await delay(RETRY_DELAY_MS);
        }
      }
    }

    return false;
  }

  async initialize(): Promise<void> {
    // Return if already initialized and available
    if (this.available) {
      return;
    }

    // If initialization in progress, wait for it
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // Check if we should attempt reconnection (rate limiting)
    if (this.initializationAttempted && !this.shouldAttemptReconnection()) {
      return;
    }

    this.initializationPromise = this.performInitialization();

    try {
      await this.initializationPromise;
    } finally {
      this.initializationPromise = null;
    }
  }

  private async performInitialization(): Promise<void> {
    this.initializationAttempted = true;
    this.lastAttemptTime = Date.now();

    // Validate URL before attempting connection
    const mcpServerUrl = this.validateMCPServerUrl();
    if (!mcpServerUrl) {
      this.available = false;
      this.client = null;
      this.tools = [];
      return;
    }

    // Attempt connection with retry logic
    const connected = await this.connectWithRetry(mcpServerUrl);

    if (!connected) {
      this.available = false;
      this.client = null;
      this.tools = [];
    }
  }

  getTools(): StructuredTool[] {
    return this.tools;
  }

  getToolsByPattern(pattern: RegExp): StructuredTool[] {
    return this.tools.filter((tool) => pattern.test(tool.name));
  }

  getToolByName(name: string): StructuredTool | undefined {
    return this.tools.find((tool) => tool.name === name);
  }

  getToolsByNames(names: string[]): StructuredTool[] {
    return this.tools.filter((tool) => names.includes(tool.name));
  }

  isAvailable(): boolean {
    return this.available;
  }

  /**
   * Gets detailed status of the MCP connection
   * Useful for debugging and health monitoring
   */
  getConnectionStatus(): {
    available: boolean;
    toolCount: number;
    lastAttemptTime: number | null;
    initializationAttempted: boolean;
    canRetry: boolean;
  } {
    return {
      available: this.available,
      toolCount: this.tools.length,
      lastAttemptTime: this.lastAttemptTime,
      initializationAttempted: this.initializationAttempted,
      canRetry: this.shouldAttemptReconnection(),
    };
  }

  /**
   * Forces a reconnection attempt to the MCP server
   * Useful when the server has been restarted or connection was lost
   */
  async reconnect(): Promise<boolean> {
    // Reset state to allow reconnection
    this.available = false;
    this.initializationAttempted = false;
    this.lastAttemptTime = null;

    // Attempt to initialize
    await this.initialize();

    return this.available;
  }

  reset(): void {
    this.client = null;
    this.tools = [];
    this.available = false;
    this.initializationAttempted = false;
    this.initializationPromise = null;
    this.lastAttemptTime = null;
  }
}

// Singleton instance using global for HMR support in development
const globalForMCP = global as typeof global & {
  mcpClientManager?: MCPClientManager;
};

function getManager(): MCPClientManager {
  if (!globalForMCP.mcpClientManager) {
    globalForMCP.mcpClientManager = new MCPClientManager();
  }
  return globalForMCP.mcpClientManager;
}

// Public API - maintains backwards compatibility
export async function initializeMCPClient(): Promise<void> {
  return getManager().initialize();
}

export function getMCPTools(): StructuredTool[] {
  return getManager().getTools();
}

export function getMCPToolsByPattern(namePattern: RegExp): StructuredTool[] {
  return getManager().getToolsByPattern(namePattern);
}

export function getMCPToolByName(name: string): StructuredTool | undefined {
  return getManager().getToolByName(name);
}

export function getMCPToolsByNames(names: string[]): StructuredTool[] {
  return getManager().getToolsByNames(names);
}

export function isMCPAvailable(): boolean {
  return getManager().isAvailable();
}

export function getMCPConnectionStatus(): {
  available: boolean;
  toolCount: number;
  lastAttemptTime: number | null;
  initializationAttempted: boolean;
  canRetry: boolean;
} {
  return getManager().getConnectionStatus();
}

export async function reconnectMCPClient(): Promise<boolean> {
  return getManager().reconnect();
}

export function resetMCPClient(): void {
  getManager().reset();
}
```

--------------------------------------------------------------------------------

````
