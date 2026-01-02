---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 825
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 825 of 867)

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

---[FILE: llm-provider-registry.ts]---
Location: prowler-master/ui/components/lighthouse/llm-provider-registry.ts

```typescript
"use client";

import type { LighthouseProvider } from "@/types/lighthouse";

export type LLMProviderFieldType = "text" | "password";

export interface LLMProviderField {
  name: string;
  type: LLMProviderFieldType;
  label: string;
  placeholder: string;
  required: boolean;
  requiresConnectionTest?: boolean;
}

export interface LLMProviderConfig {
  id: LighthouseProvider;
  name: string;
  description: string;
  icon: string;
  fields: LLMProviderField[];
}

export const LLM_PROVIDER_REGISTRY: Record<
  LighthouseProvider,
  LLMProviderConfig
> = {
  openai: {
    id: "openai",
    name: "OpenAI",
    description: "Industry-leading GPT models for general-purpose AI",
    icon: "simple-icons:openai",
    fields: [
      {
        name: "api_key",
        type: "password",
        label: "API Key",
        placeholder: "Enter your API key",
        required: true,
        requiresConnectionTest: true,
      },
    ],
  },
  bedrock: {
    id: "bedrock",
    name: "Amazon Bedrock",
    description: "AWS-managed AI with Claude, Llama, Titan & more",
    icon: "simple-icons:amazonwebservices",
    fields: [
      {
        name: "access_key_id",
        type: "text",
        label: "AWS Access Key ID",
        placeholder: "Enter the AWS Access Key ID",
        required: true,
        requiresConnectionTest: true,
      },
      {
        name: "secret_access_key",
        type: "password",
        label: "AWS Secret Access Key",
        placeholder: "Enter the AWS Secret Access Key",
        required: true,
        requiresConnectionTest: true,
      },
      {
        name: "region",
        type: "text",
        label: "AWS Region",
        placeholder: "Enter the AWS Region",
        required: true,
        requiresConnectionTest: true,
      },
    ],
  },
  openai_compatible: {
    id: "openai_compatible",
    name: "OpenAI Compatible",
    description: "Connect to custom OpenAI-compatible endpoints",
    icon: "simple-icons:openai",
    fields: [
      {
        name: "api_key",
        type: "password",
        label: "API Key",
        placeholder: "Enter your API key",
        required: true,
        requiresConnectionTest: true,
      },
      {
        name: "base_url",
        type: "text",
        label: "Base URL",
        placeholder: "https://openrouter.ai/api/v1",
        required: true,
        requiresConnectionTest: false,
      },
    ],
  },
};

export const getProviderConfig = (
  providerType: LighthouseProvider,
): LLMProviderConfig | undefined => {
  return LLM_PROVIDER_REGISTRY[providerType];
};

export const getAllProviders = (): LLMProviderConfig[] => {
  return Object.values(LLM_PROVIDER_REGISTRY);
};

export const getMainFields = (
  providerType: LighthouseProvider,
): LLMProviderField[] => {
  const config = getProviderConfig(providerType);
  return config?.fields ?? [];
};
```

--------------------------------------------------------------------------------

---[FILE: llm-provider-utils.ts]---
Location: prowler-master/ui/components/lighthouse/llm-provider-utils.ts

```typescript
"use client";

import {
  getLighthouseProviderByType,
  refreshProviderModels,
  testProviderConnection,
} from "@/actions/lighthouse/lighthouse";
import { getTask } from "@/actions/task/tasks";
import { checkTaskStatus } from "@/lib/helper";
import type { LighthouseProvider } from "@/types/lighthouse";

import { getProviderConfig } from "./llm-provider-registry";

export type LLMCredentialsFormData = Record<string, string>;

export const isProviderFormValid = (
  providerType: LighthouseProvider,
  formData: LLMCredentialsFormData,
  isEditMode: boolean = false,
): boolean => {
  const config = getProviderConfig(providerType);

  if (!config) {
    return false;
  }

  if (isEditMode) {
    return true;
  }

  return config.fields
    .filter((field) => field.required)
    .every((field) => formData[field.name]?.trim());
};

export const shouldTestConnection = (
  providerType: LighthouseProvider,
  formData: LLMCredentialsFormData,
): boolean => {
  const config = getProviderConfig(providerType);

  if (!config) {
    return false;
  }

  const testFields = config.fields.filter(
    (field) => field.requiresConnectionTest,
  );

  return testFields.some((field) => formData[field.name]?.trim());
};

/**
 * Triggers a background job to refresh models from the LLM provider's API
 */
export const refreshModelsInBackground = async (
  providerId: string,
): Promise<void> => {
  const modelsResult = await refreshProviderModels(providerId);

  if (modelsResult.errors) {
    throw new Error(
      modelsResult.errors[0]?.detail || "Failed to start model refresh",
    );
  }

  if (!modelsResult.data?.id) {
    throw new Error("Failed to start model refresh");
  }

  // Wait for task to complete
  const modelsStatus = await checkTaskStatus(modelsResult.data.id, 40, 2000);
  if (!modelsStatus.completed) {
    throw new Error(modelsStatus.error || "Model refresh failed");
  }

  // Check final result
  const modelsTask = await getTask(modelsResult.data.id);
  if (modelsTask.data.attributes.result.error) {
    throw new Error(modelsTask.data.attributes.result.error);
  }
};

/**
 * Tests provider connection and refreshes models
 */
export const testAndRefreshModels = async (
  providerId: string,
): Promise<void> => {
  // Test connection
  const connectionResult = await testProviderConnection(providerId);

  if (connectionResult.errors) {
    throw new Error(
      connectionResult.errors[0]?.detail || "Failed to start connection test",
    );
  }

  if (!connectionResult.data?.id) {
    throw new Error("Failed to start connection test");
  }

  const connectionStatus = await checkTaskStatus(connectionResult.data.id);
  if (!connectionStatus.completed) {
    throw new Error(connectionStatus.error || "Connection test failed");
  }

  const connectionTask = await getTask(connectionResult.data.id);
  const { connected, error: connectionError } =
    connectionTask.data.attributes.result;
  if (!connected) {
    throw new Error(connectionError || "Connection test failed");
  }

  // Refresh models
  await refreshModelsInBackground(providerId);
};

/**
 * Gets the provider ID for a given provider type
 * @param providerType - The provider type (e.g., "openai", "anthropic")
 * @returns Promise that resolves with the provider ID
 * @throws Error if provider not found
 */
export const getProviderIdByType = async (
  providerType: LighthouseProvider,
): Promise<string> => {
  const result = await getLighthouseProviderByType(providerType);

  if (result.errors) {
    throw new Error(result.errors[0]?.detail || "Failed to fetch provider");
  }

  if (!result.data?.id) {
    throw new Error("Provider not found");
  }

  return result.data.id;
};
```

--------------------------------------------------------------------------------

---[FILE: llm-providers-table.tsx]---
Location: prowler-master/ui/components/lighthouse/llm-providers-table.tsx
Signals: React, Next.js

```typescript
"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getLighthouseProviders,
  getTenantConfig,
} from "@/actions/lighthouse/lighthouse";
import { Button, Card, CardContent, CardHeader } from "@/components/shadcn";

import { getAllProviders } from "./llm-provider-registry";

interface LighthouseProviderResource {
  id: string;
  attributes: {
    provider_type: string;
    is_active: boolean;
  };
}

type LLMProvider = {
  id: string;
  provider: string;
  description: string;
  defaultModel: string;
  icon: string;
  isConnected: boolean;
  isActive: boolean;
  isDefaultProvider: boolean;
};

export const LLMProvidersTable = () => {
  const [providers, setProviders] = useState<LLMProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      try {
        // Fetch connected providers from API
        const result = await getLighthouseProviders();
        const connectedProviders = new Map<
          string,
          LighthouseProviderResource
        >();

        if (result.data && !result.errors) {
          result.data.forEach((provider: LighthouseProviderResource) => {
            connectedProviders.set(provider.attributes.provider_type, provider);
          });
        }

        // Fetch tenant config for default models and default provider
        const configResult = await getTenantConfig();
        const defaultModels =
          configResult.data?.attributes?.default_models || {};
        const defaultProvider =
          configResult.data?.attributes?.default_provider || "";

        // Build provider list from registry
        const allProviders: LLMProvider[] = getAllProviders().map((config) => {
          const connected = connectedProviders.get(config.id);
          const defaultModel = defaultModels[config.id] || "";

          return {
            id: config.id,
            provider: config.name,
            description: config.description,
            icon: config.icon,
            defaultModel,
            isConnected: !!connected,
            isActive: connected?.attributes?.is_active || false,
            isDefaultProvider: config.id === defaultProvider,
          };
        });

        setProviders(allProviders);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
        // Fallback to showing all providers from registry as not connected
        const allProviders: LLMProvider[] = getAllProviders().map((config) => ({
          id: config.id,
          provider: config.name,
          description: config.description,
          icon: config.icon,
          defaultModel: "",
          isConnected: false,
          isActive: false,
          isDefaultProvider: false,
        }));
        setProviders(allProviders);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold">LLM Providers</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="base" padding="lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-bg-neutral-tertiary h-10 w-10 animate-pulse rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="bg-bg-neutral-tertiary h-5 w-32 animate-pulse rounded" />
                    <div className="bg-bg-neutral-tertiary h-3 w-48 animate-pulse rounded" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <div className="flex-grow space-y-3">
                  <div>
                    <div className="bg-bg-neutral-tertiary mb-2 h-4 w-16 animate-pulse rounded" />
                    <div className="bg-bg-neutral-tertiary h-4 w-28 animate-pulse rounded" />
                  </div>
                  <div>
                    <div className="bg-bg-neutral-tertiary mb-2 h-4 w-24 animate-pulse rounded" />
                    <div className="bg-bg-neutral-tertiary h-4 w-36 animate-pulse rounded" />
                  </div>
                </div>

                <div className="bg-bg-neutral-tertiary h-10 w-full animate-pulse rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">LLM Providers</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => {
          // Show Connect button if not connected, Configure if connected
          const showConnect = !provider.isConnected;
          const showConfigure = provider.isConnected;

          return (
            <Card
              key={provider.id}
              variant="base"
              padding="lg"
              className="h-full"
            >
              {/* Header */}
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon icon={provider.icon} width={40} height={40} />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {provider.provider}
                      </h3>
                      {provider.isDefaultProvider && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {provider.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                {/* Status and Model Info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-text-neutral-secondary text-sm">
                      Status
                    </p>
                    <p
                      className={`text-sm ${
                        provider.isConnected && provider.isActive
                          ? "text-button-primary font-bold"
                          : "text-text-neutral-secondary text-sm"
                      }`}
                    >
                      {provider.isConnected
                        ? provider.isActive
                          ? "Connected"
                          : "Connection Failed"
                        : "Not configured"}
                    </p>
                  </div>

                  {provider.defaultModel && (
                    <div>
                      <p className="text-text-neutral-secondary text-sm">
                        Default Model
                      </p>
                      <p className="text-text-neutral-secondary text-sm">
                        {provider.defaultModel}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {showConnect && (
                  <Button
                    aria-label={`Connect ${provider.provider}`}
                    className="w-full"
                    asChild
                  >
                    <Link
                      href={`/lighthouse/config/connect?provider=${provider.id}`}
                    >
                      Connect
                    </Link>
                  </Button>
                )}

                {showConfigure && (
                  <Button
                    aria-label={`Configure ${provider.provider}`}
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link
                      href={`/lighthouse/config/connect?provider=${provider.id}&mode=edit`}
                    >
                      Configure
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: loader.tsx]---
Location: prowler-master/ui/components/lighthouse/loader.tsx

```typescript
"use client";

import { SpinnerIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the loader spinner
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  /**
   * Optional loading text to display
   */
  text?: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const loaderSizes = {
  sm: 16,
  default: 24,
  lg: 32,
};

const Loader = ({
  size = "default",
  text,
  className,
  ref,
  ...props
}: LoaderProps) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      role="status"
      aria-live="polite"
      aria-label={text || "Loading"}
      {...props}
    >
      <SpinnerIcon
        size={loaderSizes[size]}
        className="text-muted-foreground animate-spin"
      />
      {text && <span className="text-muted-foreground text-sm">{text}</span>}
      <span className="sr-only">{text || "Loading..."}</span>
    </div>
  );
};

export { Loader };
```

--------------------------------------------------------------------------------

---[FILE: message-item.tsx]---
Location: prowler-master/ui/components/lighthouse/message-item.tsx

```typescript
/**
 * MessageItem component
 * Renders individual chat messages with actions for assistant messages
 */

import { Copy, RotateCcw } from "lucide-react";
import { Streamdown } from "streamdown";

import { Action, Actions } from "@/components/lighthouse/ai-elements/actions";
import { ChainOfThoughtDisplay } from "@/components/lighthouse/chain-of-thought-display";
import {
  extractChainOfThoughtEvents,
  extractMessageText,
  type Message,
  MESSAGE_ROLES,
  MESSAGE_STATUS,
} from "@/components/lighthouse/chat-utils";
import { Loader } from "@/components/lighthouse/loader";

interface MessageItemProps {
  message: Message;
  index: number;
  isLastMessage: boolean;
  status: string;
  onCopy: (text: string) => void;
  onRegenerate: () => void;
}

export function MessageItem({
  message,
  index,
  isLastMessage,
  status,
  onCopy,
  onRegenerate,
}: MessageItemProps) {
  const messageText = extractMessageText(message);

  // Check if this is the streaming assistant message
  const isStreamingAssistant =
    isLastMessage &&
    message.role === MESSAGE_ROLES.ASSISTANT &&
    status === MESSAGE_STATUS.STREAMING;

  // Use a composite key to ensure uniqueness even if IDs are duplicated temporarily
  const uniqueKey = `${message.id}-${index}-${message.role}`;

  // Extract chain-of-thought events from message parts
  const chainOfThoughtEvents = extractChainOfThoughtEvents(message);

  return (
    <div key={uniqueKey}>
      <div
        className={`flex ${
          message.role === MESSAGE_ROLES.USER ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-[80%] rounded-lg px-4 py-2 ${
            message.role === MESSAGE_ROLES.USER
              ? "bg-bg-neutral-tertiary border-border-neutral-secondary border"
              : "bg-muted"
          }`}
        >
          {/* Chain of Thought for assistant messages */}
          {message.role === MESSAGE_ROLES.ASSISTANT && (
            <ChainOfThoughtDisplay
              events={chainOfThoughtEvents}
              isStreaming={isStreamingAssistant}
              messageKey={uniqueKey}
            />
          )}

          {/* Show loader only if streaming with no text AND no chain-of-thought events */}
          {isStreamingAssistant &&
          !messageText &&
          chainOfThoughtEvents.length === 0 ? (
            <Loader size="default" text="Thinking..." />
          ) : messageText ? (
            <div>
              <Streamdown
                parseIncompleteMarkdown={true}
                shikiTheme={["github-light", "github-dark"]}
                controls={{
                  code: true,
                  table: true,
                  mermaid: true,
                }}
                isAnimating={isStreamingAssistant}
              >
                {messageText}
              </Streamdown>
            </div>
          ) : null}
        </div>
      </div>

      {/* Actions for assistant messages */}
      {message.role === MESSAGE_ROLES.ASSISTANT &&
        isLastMessage &&
        messageText &&
        status !== MESSAGE_STATUS.STREAMING && (
          <div className="mt-2 flex justify-start">
            <Actions className="max-w-[80%]">
              <Action
                tooltip="Copy message"
                label="Copy"
                onClick={() => onCopy(messageText)}
              >
                <Copy className="h-3 w-3" />
              </Action>
              <Action
                tooltip="Regenerate response"
                label="Retry"
                onClick={onRegenerate}
              >
                <RotateCcw className="h-3 w-3" />
              </Action>
            </Actions>
          </div>
        )}
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: select-bedrock-auth-method.tsx]---
Location: prowler-master/ui/components/lighthouse/select-bedrock-auth-method.tsx
Signals: Next.js

```typescript
"use client";

import { RadioGroup } from "@heroui/radio";
import { useRouter, useSearchParams } from "next/navigation";

import { CustomRadio } from "@/components/ui/custom";

const BEDROCK_AUTH_METHODS = {
  API_KEY: "api_key",
  IAM: "iam",
} as const;

type BedrockAuthMethod =
  (typeof BEDROCK_AUTH_METHODS)[keyof typeof BEDROCK_AUTH_METHODS];

export const SelectBedrockAuthMethod = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentAuth = searchParams.get("auth") as BedrockAuthMethod | null;

  const handleSelectionChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("auth", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h2 className="mb-2 text-xl font-semibold">Connect Amazon Bedrock</h2>
        <p className="text-text-neutral-secondary text-sm">
          Choose how you want to authenticate with Amazon Bedrock. You can use a
          dedicated Bedrock API key or long-term AWS access keys.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <RadioGroup
          className="flex flex-col gap-3"
          value={currentAuth || ""}
          onValueChange={handleSelectionChange}
        >
          <CustomRadio value={BEDROCK_AUTH_METHODS.API_KEY}>
            <div className="flex items-center">
              <span className="ml-2">Use Bedrock API Key</span>
            </div>
          </CustomRadio>

          <CustomRadio value={BEDROCK_AUTH_METHODS.IAM}>
            <div className="flex items-center">
              <span className="ml-2">Use AWS Access Key & Secret</span>
            </div>
          </CustomRadio>
        </RadioGroup>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: select-model.tsx]---
Location: prowler-master/ui/components/lighthouse/select-model.tsx
Signals: React

```typescript
"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

import {
  getLighthouseModelIds,
  getTenantConfig,
  updateTenantConfig,
} from "@/actions/lighthouse/lighthouse";
import { Button } from "@/components/shadcn";
import type { LighthouseProvider } from "@/types/lighthouse";

import {
  getProviderIdByType,
  refreshModelsInBackground,
} from "./llm-provider-utils";

// Recommended models per provider
const RECOMMENDED_MODELS: Record<LighthouseProvider, Set<string>> = {
  openai: new Set(["gpt-5"]),
  bedrock: new Set([]),
  openai_compatible: new Set([]),
};

interface SelectModelProps {
  provider: LighthouseProvider;
  mode?: string;
  onSelect: () => void;
}

interface Model {
  id: string;
  name: string;
}

export const SelectModel = ({
  provider,
  mode = "create",
  onSelect,
}: SelectModelProps) => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isEditMode = mode === "edit";

  const isRecommended = (modelId: string) => {
    return RECOMMENDED_MODELS[provider]?.has(modelId) || false;
  };

  const fetchModels = async (triggerRefresh: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // If triggerRefresh is true, trigger background job to refetch models from LLM provider API
      if (triggerRefresh) {
        const providerId = await getProviderIdByType(provider);
        await refreshModelsInBackground(providerId);
      }

      // Fetch models from database
      const result = await getLighthouseModelIds(provider);

      if (result.errors) {
        throw new Error(result.errors[0]?.detail || "Failed to fetch models");
      }

      const models = result.data || [];
      setModels(models);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setModels([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = async () => {
    if (!selectedModel) return;

    setIsSaving(true);
    setError(null);

    try {
      const currentConfig = await getTenantConfig();
      const existingDefaults =
        currentConfig?.data?.attributes?.default_models || {};
      const existingDefaultProvider =
        currentConfig?.data?.attributes?.default_provider || "";

      const mergedDefaults = {
        ...existingDefaults,
        [provider]: selectedModel,
      };

      // Prepare update payload
      const updatePayload: {
        default_models: Record<string, string>;
        default_provider?: LighthouseProvider;
      } = {
        default_models: mergedDefaults,
      };

      // Set this provider as default if no default provider is currently set
      if (!existingDefaultProvider) {
        updatePayload.default_provider = provider;
      }

      const result = await updateTenantConfig(updatePayload);

      if (result.errors) {
        throw new Error(
          result.errors[0]?.detail || "Failed to save default model",
        );
      }

      onSelect();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSaving(false);
    }
  };

  // Filter models based on search query and sort with recommended models first
  const filteredModels = models
    .filter(
      (model) =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.id.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      const aRecommended = isRecommended(a.id);
      const bRecommended = isRecommended(b.id);
      // Recommended models first
      if (aRecommended && !bRecommended) return -1;
      if (!aRecommended && bRecommended) return 1;
      // Then alphabetically by name
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="mb-2 text-xl font-semibold">
            {isEditMode ? "Update Default Model" : "Select Default Model"}
          </h2>
          <p className="text-text-neutral-secondary text-sm">
            {isEditMode
              ? "Update the default model to use with this provider."
              : "Choose the default model to use with this provider."}
          </p>
        </div>
        <button
          onClick={() => fetchModels(true)}
          disabled={isLoading}
          className="text-text-neutral-secondary hover:bg-bg-neutral-tertiary flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50"
          aria-label="Refresh models"
        >
          <Icon
            icon="heroicons:arrow-path"
            className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {error && (
        <div className="border-border-error-primary bg-bg-fail-secondary rounded-lg border p-4">
          <p className="text-text-error text-sm">{error}</p>
        </div>
      )}

      {!isLoading && models.length > 0 && (
        <div className="relative">
          <Icon
            icon="heroicons:magnifying-glass"
            className="text-text-neutral-tertiary pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border-neutral-primary bg-bg-neutral-primary focus:border-button-primary focus:ring-button-primary w-full rounded-lg border py-2.5 pr-4 pl-11 text-sm focus:ring-1 focus:outline-none"
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Icon
            icon="heroicons:arrow-path"
            className="text-text-neutral-tertiary h-8 w-8 animate-spin"
          />
        </div>
      ) : models.length === 0 ? (
        <div className="border-border-neutral-secondary bg-bg-neutral-tertiary rounded-lg border p-8 text-center">
          <p className="text-text-neutral-secondary text-sm">
            No models available. Click refresh to fetch models.
          </p>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="border-border-neutral-secondary bg-bg-neutral-tertiary rounded-lg border p-8 text-center">
          <p className="text-text-neutral-secondary text-sm">
            No models found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      ) : (
        <div className="border-border-neutral-secondary minimal-scrollbar max-h-[calc(100vh-380px)] overflow-y-auto rounded-lg border">
          {filteredModels.map((model) => (
            <label
              key={model.id}
              htmlFor={`model-${provider}-${model.id}`}
              aria-label={model.name}
              className={`border-border-neutral-primary block cursor-pointer border-b px-6 py-4 transition-colors last:border-b-0 ${
                selectedModel === model.id
                  ? "bg-bg-neutral-secondary"
                  : "hover:bg-bg-neutral-tertiary"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  id={`model-${provider}-${model.id}`}
                  name="model"
                  type="radio"
                  checked={selectedModel === model.id}
                  onChange={() => setSelectedModel(model.id)}
                  className="h-4 w-4 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{model.name}</span>
                  {isRecommended(model.id) && (
                    <span className="bg-bg-data-info text-text-success-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                      <Icon icon="heroicons:star-solid" className="h-3 w-3" />
                      Recommended
                    </span>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Button
            aria-label="Select Model"
            disabled={!selectedModel || isSaving}
            onClick={handleSelect}
          >
            {isSaving ? "Saving..." : "Select"}
          </Button>
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: actions.tsx]---
Location: prowler-master/ui/components/lighthouse/ai-elements/actions.tsx
Signals: React

```typescript
"use client";

import type { ComponentProps } from "react";

import { Button } from "@/components/shadcn/button/button";
import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export type ActionsProps = ComponentProps<"div">;

export const Actions = ({ className, children, ...props }: ActionsProps) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
);

export type ActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
};

export const Action = ({
  tooltip,
  children,
  label,
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: ActionProps) => {
  const button = (
    <Button
      className={cn(
        "text-muted-foreground hover:text-foreground relative size-9 p-1.5",
        className,
      )}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};
```

--------------------------------------------------------------------------------

````
