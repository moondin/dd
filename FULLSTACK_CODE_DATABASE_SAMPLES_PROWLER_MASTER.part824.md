---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 824
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 824 of 867)

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

---[FILE: chat.tsx]---
Location: prowler-master/ui/components/lighthouse/chat.tsx
Signals: React

```typescript
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getLighthouseModelIds } from "@/actions/lighthouse/lighthouse";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/lighthouse/ai-elements/prompt-input";
import {
  ERROR_PREFIX,
  MESSAGE_ROLES,
  MESSAGE_STATUS,
} from "@/components/lighthouse/chat-utils";
import { Loader } from "@/components/lighthouse/loader";
import { MessageItem } from "@/components/lighthouse/message-item";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Combobox,
} from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomLink } from "@/components/ui/custom/custom-link";
import type { LighthouseProvider } from "@/types/lighthouse";

interface Model {
  id: string;
  name: string;
}

interface Provider {
  id: LighthouseProvider;
  name: string;
  models: Model[];
}

interface SuggestedAction {
  title: string;
  label: string;
  action: string;
}

interface ChatProps {
  hasConfig: boolean;
  providers: Provider[];
  defaultProviderId?: LighthouseProvider;
  defaultModelId?: string;
}

interface SelectedModel {
  providerType: LighthouseProvider | "";
  modelId: string;
  modelName: string;
}

interface ExtendedError extends Error {
  status?: number;
  body?: Record<string, unknown>;
}

const SUGGESTED_ACTIONS: SuggestedAction[] = [
  {
    title: "Are there any exposed S3",
    label: "buckets in my AWS accounts?",
    action: "List exposed S3 buckets in my AWS accounts",
  },
  {
    title: "What is the risk of having",
    label: "RDS databases unencrypted?",
    action: "What is the risk of having RDS databases unencrypted?",
  },
  {
    title: "What is the CIS 1.10 compliance status",
    label: "of my Kubernetes cluster?",
    action: "What is the CIS 1.10 compliance status of my Kubernetes cluster?",
  },
  {
    title: "List my highest privileged",
    label: "AWS IAM users with full admin access?",
    action: "List my highest privileged AWS IAM users with full admin access",
  },
];

export const Chat = ({
  hasConfig,
  providers: initialProviders,
  defaultProviderId,
  defaultModelId,
}: ChatProps) => {
  const { toast } = useToast();

  // Consolidated UI state
  const [uiState, setUiState] = useState<{
    inputValue: string;
  }>({
    inputValue: "",
  });

  // Error handling
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Provider and model management
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const loadedProvidersRef = useRef<Set<LighthouseProvider>>(new Set());
  const [loadingProviders, setLoadingProviders] = useState<
    Set<LighthouseProvider>
  >(new Set());

  // Initialize selectedModel with defaults from props
  const [selectedModel, setSelectedModel] = useState<SelectedModel>(() => {
    const defaultProvider =
      initialProviders.find((p) => p.id === defaultProviderId) ||
      initialProviders[0];
    const defaultModel =
      defaultProvider?.models.find((m) => m.id === defaultModelId) ||
      defaultProvider?.models[0];

    return {
      providerType: defaultProvider?.id || "",
      modelId: defaultModel?.id || "",
      modelName: defaultModel?.name || "",
    };
  });

  // Keep ref in sync with selectedModel for stable access in callbacks
  const selectedModelRef = useRef(selectedModel);
  selectedModelRef.current = selectedModel;

  // Load models for all providers on mount
  useEffect(() => {
    initialProviders.forEach((provider) => {
      loadModelsForProvider(provider.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load all models for a specific provider
  const loadModelsForProvider = async (providerType: LighthouseProvider) => {
    // Skip if already loaded
    if (loadedProvidersRef.current.has(providerType)) {
      return;
    }

    // Mark as loaded
    loadedProvidersRef.current.add(providerType);
    setLoadingProviders((prev) => new Set(prev).add(providerType));

    try {
      const response = await getLighthouseModelIds(providerType);

      if (response.errors) {
        console.error(
          `Error loading models for ${providerType}:`,
          response.errors,
        );
        return;
      }

      if (response.data && Array.isArray(response.data)) {
        // Use the model data directly from the API
        const models: Model[] = response.data;

        // Update the provider's models
        setProviders((prev) =>
          prev.map((p) => (p.id === providerType ? { ...p, models } : p)),
        );
      }
    } catch (error) {
      console.error(`Error loading models for ${providerType}:`, error);
      // Remove from loaded on error so it can be retried
      loadedProvidersRef.current.delete(providerType);
    } finally {
      setLoadingProviders((prev) => {
        const next = new Set(prev);
        next.delete(providerType);
        return next;
      });
    }
  };

  const {
    messages,
    sendMessage,
    status,
    error,
    setMessages,
    regenerate,
    stop,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/lighthouse/analyst",
      credentials: "same-origin",
      body: () => ({
        model: selectedModelRef.current.modelId,
        provider: selectedModelRef.current.providerType,
      }),
    }),
    experimental_throttle: 100,
    onFinish: ({ message }) => {
      // There is no specific way to output the error message from langgraph supervisor
      // Hence, all error messages are sent as normal messages with the prefix [LIGHTHOUSE_ANALYST_ERROR]:
      // Detect error messages sent from backend using specific prefix and display the error
      // Use includes() instead of startsWith() to catch errors that occur mid-stream (after text has been sent)
      const firstTextPart = message.parts.find((p) => p.type === "text");
      if (
        firstTextPart &&
        "text" in firstTextPart &&
        firstTextPart.text.includes(ERROR_PREFIX)
      ) {
        // Extract error text - handle both start-of-message and mid-stream errors
        const fullText = firstTextPart.text;
        const errorIndex = fullText.indexOf(ERROR_PREFIX);
        const errorText = fullText
          .substring(errorIndex + ERROR_PREFIX.length)
          .trim();
        setErrorMessage(errorText);
        // Remove error message from chat history
        setMessages((prev) =>
          prev.filter((m) => {
            const textPart = m.parts.find((p) => p.type === "text");
            return !(
              textPart &&
              "text" in textPart &&
              textPart.text.includes(ERROR_PREFIX)
            );
          }),
        );
        restoreLastUserMessage();
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);

      if (
        error?.message?.includes("<html>") &&
        error?.message?.includes("<title>403 Forbidden</title>")
      ) {
        restoreLastUserMessage();
        setErrorMessage("403 Forbidden");
        return;
      }

      restoreLastUserMessage();
      setErrorMessage(
        error?.message || "An error occurred. Please retry your message.",
      );
    },
  });

  const restoreLastUserMessage = () => {
    let restoredText = "";

    setMessages((currentMessages) => {
      const nextMessages = [...currentMessages];

      for (let index = nextMessages.length - 1; index >= 0; index -= 1) {
        const current = nextMessages[index];

        if (current.role !== "user") {
          continue;
        }

        const textPart = current.parts.find(
          (part): part is { type: "text"; text: string } =>
            part.type === "text" && "text" in part,
        );

        if (textPart) {
          restoredText = textPart.text;
        }

        nextMessages.splice(index, 1);
        break;
      }

      return nextMessages;
    });

    if (restoredText) {
      setUiState((prev) => ({ ...prev, inputValue: restoredText }));
    }
  };

  const stopGeneration = () => {
    if (
      status === MESSAGE_STATUS.STREAMING ||
      status === MESSAGE_STATUS.SUBMITTED
    ) {
      stop();
    }
  };

  // Handlers
  const handleNewChat = () => {
    setMessages([]);
    setErrorMessage(null);
    setUiState((prev) => ({ ...prev, inputValue: "" }));
  };

  const handleModelSelect = (
    providerType: LighthouseProvider,
    modelId: string,
    modelName: string,
  ) => {
    setSelectedModel({ providerType, modelId, modelName });
  };

  return (
    <div className="relative flex h-full min-w-0 flex-col overflow-hidden">
      {/* Header with New Chat button */}
      {messages.length > 0 && (
        <div className="border-default-200 dark:border-default-100 border-b px-2 py-3 sm:px-4">
          <div className="flex items-center justify-end">
            <Button
              aria-label="Start new chat"
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
        </div>
      )}

      {!hasConfig && (
        <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <Card
            variant="base"
            padding="lg"
            className="max-w-md text-center shadow-lg"
          >
            <CardHeader>
              <CardTitle>LLM Provider Configuration Required</CardTitle>
              <CardDescription>
                Please configure an LLM provider to use Lighthouse AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomLink
                href="/lighthouse/config"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2"
                target="_self"
                size="sm"
              >
                Configure Provider
              </CustomLink>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Banner */}
      {(error || errorMessage) && (
        <div className="border-border-error-primary bg-bg-fail-secondary mx-2 mt-4 rounded-lg border p-4 sm:mx-4">
          <div className="flex items-start">
            <div className="shrink-0">
              <svg
                className="text-text-error h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-text-error text-sm font-medium">Error</h3>
              <p className="text-text-neutral-secondary mt-1 text-sm">
                {errorMessage ||
                  error?.message ||
                  "An error occurred. Please retry your message."}
              </p>
              {/* Original error details for native errors */}
              {error && (error as ExtendedError).status && (
                <p className="text-text-neutral-tertiary mt-1 text-xs">
                  Status: {(error as ExtendedError).status}
                </p>
              )}
              {error && (error as ExtendedError).body && (
                <details className="mt-2">
                  <summary className="text-text-neutral-tertiary hover:text-text-neutral-secondary cursor-pointer text-xs">
                    Show details
                  </summary>
                  <pre className="bg-bg-neutral-tertiary text-text-neutral-secondary mt-1 max-h-20 overflow-auto rounded p-2 text-xs">
                    {JSON.stringify((error as ExtendedError).body, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )}

      {messages.length === 0 && !errorMessage && !error ? (
        <div className="flex flex-1 items-center justify-center px-2 py-4 sm:p-4">
          <div className="w-full max-w-2xl">
            <h2 className="mb-4 text-center font-sans text-xl">Suggestions</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {SUGGESTED_ACTIONS.map((action, index) => (
                <Button
                  key={`suggested-action-${index}`}
                  aria-label={`Send message: ${action.action}`}
                  onClick={() => {
                    sendMessage({
                      text: action.action,
                    });
                  }}
                  variant="outline"
                  className="flex h-auto w-full flex-col items-start justify-start rounded-xl px-4 py-3.5 text-left font-sans text-sm"
                >
                  <span>{action.title}</span>
                  <span className="text-muted-foreground">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Conversation className="flex-1">
          <ConversationContent className="gap-4 px-2 py-4 sm:p-4">
            {messages.map((message, idx) => (
              <MessageItem
                key={`${message.id}-${idx}-${message.role}`}
                message={message}
                index={idx}
                isLastMessage={idx === messages.length - 1}
                status={status}
                onCopy={(text) => {
                  navigator.clipboard.writeText(text);
                  toast({
                    title: "Copied",
                    description: "Message copied to clipboard",
                  });
                }}
                onRegenerate={regenerate}
              />
            ))}
            {/* Show loader only if no assistant message exists yet */}
            {(status === MESSAGE_STATUS.SUBMITTED ||
              status === MESSAGE_STATUS.STREAMING) &&
              messages.length > 0 &&
              messages[messages.length - 1].role === MESSAGE_ROLES.USER && (
                <div className="flex justify-start">
                  <div className="bg-muted max-w-[80%] rounded-lg px-4 py-2">
                    <Loader size="default" text="Thinking..." />
                  </div>
                </div>
              )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      <div className="mx-auto w-full px-4 pb-16 md:max-w-3xl md:pb-16">
        <PromptInput
          onSubmit={(message) => {
            if (
              status === MESSAGE_STATUS.STREAMING ||
              status === MESSAGE_STATUS.SUBMITTED
            ) {
              return;
            }
            if (message.text?.trim()) {
              setErrorMessage(null);
              sendMessage({
                text: message.text,
              });
              setUiState((prev) => ({ ...prev, inputValue: "" }));
            }
          }}
        >
          <PromptInputBody>
            <PromptInputTextarea
              placeholder={
                error || errorMessage
                  ? "Edit your message and try again..."
                  : "Type your message..."
              }
              value={uiState.inputValue}
              onChange={(e) =>
                setUiState((prev) => ({ ...prev, inputValue: e.target.value }))
              }
            />
          </PromptInputBody>

          <PromptInputToolbar>
            <PromptInputTools>
              {/* Model Selector - Combobox */}
              <Combobox
                value={`${selectedModel.providerType}:${selectedModel.modelId}`}
                onValueChange={(value) => {
                  const separatorIndex = value.indexOf(":");
                  if (separatorIndex === -1) return;

                  const providerType = value.slice(
                    0,
                    separatorIndex,
                  ) as LighthouseProvider;
                  const modelId = value.slice(separatorIndex + 1);
                  const provider = providers.find((p) => p.id === providerType);
                  const model = provider?.models.find((m) => m.id === modelId);
                  if (provider && model) {
                    handleModelSelect(providerType, modelId, model.name);
                  }
                }}
                groups={providers.map((provider) => ({
                  heading: provider.name,
                  options: provider.models.map((model) => ({
                    value: `${provider.id}:${model.id}`,
                    label: model.name,
                  })),
                }))}
                loading={loadingProviders.size > 0}
                loadingMessage="Loading models..."
                placeholder={selectedModel.modelName || "Select model..."}
                searchPlaceholder="Search models..."
                emptyMessage="No model found."
                showSelectedFirst={true}
              />
            </PromptInputTools>

            {/* Submit Button */}
            <PromptInputSubmit
              status={status}
              type={
                status === MESSAGE_STATUS.STREAMING ||
                status === MESSAGE_STATUS.SUBMITTED
                  ? "button"
                  : "submit"
              }
              onClick={(event) => {
                if (
                  status === MESSAGE_STATUS.STREAMING ||
                  status === MESSAGE_STATUS.SUBMITTED
                ) {
                  event.preventDefault();
                  stopGeneration();
                }
              }}
              disabled={
                !uiState.inputValue?.trim() &&
                status !== MESSAGE_STATUS.STREAMING &&
                status !== MESSAGE_STATUS.SUBMITTED
              }
            />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default Chat;
```

--------------------------------------------------------------------------------

---[FILE: connect-llm-provider.tsx]---
Location: prowler-master/ui/components/lighthouse/connect-llm-provider.tsx
Signals: React, Next.js

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  createLighthouseProvider,
  getLighthouseProviderByType,
  updateLighthouseProviderByType,
} from "@/actions/lighthouse/lighthouse";
import { FormButtons } from "@/components/ui/form";
import type { LighthouseProvider } from "@/types/lighthouse";

import { getMainFields, getProviderConfig } from "./llm-provider-registry";
import {
  isProviderFormValid,
  type LLMCredentialsFormData,
  shouldTestConnection,
  testAndRefreshModels,
} from "./llm-provider-utils";

const BEDROCK_CREDENTIAL_MODES = {
  API_KEY: "api_key",
  IAM: "iam",
} as const;

type BedrockCredentialMode =
  (typeof BEDROCK_CREDENTIAL_MODES)[keyof typeof BEDROCK_CREDENTIAL_MODES];

const CONNECTION_STATUS = {
  IDLE: "idle",
  CONNECTING: "connecting",
  VERIFYING: "verifying",
  LOADING_MODELS: "loading-models",
} as const;

type ConnectionStatus =
  (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS];

const STATUS_MESSAGES: Record<Exclude<ConnectionStatus, "idle">, string> = {
  [CONNECTION_STATUS.CONNECTING]: "Connecting...",
  [CONNECTION_STATUS.VERIFYING]: "Verifying...",
  [CONNECTION_STATUS.LOADING_MODELS]: "Loading models...",
};

interface ConnectLLMProviderProps {
  provider: LighthouseProvider;
  mode?: string;
  initialAuthMode?: BedrockCredentialMode;
}

type FormData = Record<string, string>;

export const ConnectLLMProvider = ({
  provider,
  mode = "create",
  initialAuthMode,
}: ConnectLLMProviderProps) => {
  const router = useRouter();
  const providerConfig = getProviderConfig(provider);
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<FormData>({});
  const [existingProviderId, setExistingProviderId] = useState<string | null>(
    null,
  );
  const [status, setStatus] = useState<ConnectionStatus>(
    CONNECTION_STATUS.IDLE,
  );
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bedrockMode, setBedrockMode] = useState<BedrockCredentialMode>(() => {
    if (provider === "bedrock" && mode !== "edit" && initialAuthMode) {
      return initialAuthMode;
    }
    return BEDROCK_CREDENTIAL_MODES.API_KEY;
  });

  // Fetch existing provider ID in edit mode
  useEffect(() => {
    if (!isEditMode || !providerConfig) return;

    const fetchProvider = async () => {
      setIsFetching(true);
      try {
        const result = await getLighthouseProviderByType(provider);
        if (result.errors) {
          throw new Error(
            result.errors[0]?.detail || "Failed to fetch provider",
          );
        }
        setExistingProviderId(result.data.id);

        // For Bedrock, detect existing credential mode (API key vs IAM)
        if (provider === "bedrock") {
          const attributes = (result.data as any)?.attributes;
          const credentials = attributes?.credentials as
            | LLMCredentialsFormData
            | undefined;

          if (credentials) {
            if (credentials.api_key) {
              setBedrockMode(BEDROCK_CREDENTIAL_MODES.API_KEY);
            } else if (
              credentials.access_key_id ||
              credentials.secret_access_key
            ) {
              setBedrockMode(BEDROCK_CREDENTIAL_MODES.IAM);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsFetching(false);
      }
    };

    fetchProvider();
  }, [isEditMode, provider, providerConfig]);

  const buildBedrockPayload = (): Record<string, any> => {
    const credentials: LLMCredentialsFormData = {};

    if (bedrockMode === BEDROCK_CREDENTIAL_MODES.API_KEY) {
      if (formData.api_key) credentials.api_key = formData.api_key;
      if (formData.region) credentials.region = formData.region;
    } else {
      if (formData.access_key_id) {
        credentials.access_key_id = formData.access_key_id;
      }
      if (formData.secret_access_key) {
        credentials.secret_access_key = formData.secret_access_key;
      }
      if (formData.region) credentials.region = formData.region;
    }

    return Object.keys(credentials).length > 0 ? { credentials } : {};
  };

  const buildGenericPayload = (): Record<string, any> => {
    const credentials: Record<string, string> = {};
    const otherFields: Record<string, string> = {};

    providerConfig?.fields.forEach((field) => {
      if (formData[field.name]) {
        if (field.requiresConnectionTest) {
          credentials[field.name] = formData[field.name];
        } else {
          otherFields[field.name] = formData[field.name];
        }
      }
    });

    return {
      ...(Object.keys(credentials).length > 0 && { credentials }),
      ...otherFields,
    };
  };

  const buildPayload = (): Record<string, any> => {
    if (!providerConfig) return {};
    return provider === "bedrock"
      ? buildBedrockPayload()
      : buildGenericPayload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerConfig) return;

    setStatus(CONNECTION_STATUS.CONNECTING);
    setError(null);

    try {
      let providerId: string;
      const payload = buildPayload();

      // Update if we have an existing provider, otherwise create
      if (existingProviderId) {
        if (Object.keys(payload).length > 0) {
          await updateLighthouseProviderByType(provider, payload);
        }
        providerId = existingProviderId;
      } else {
        const result = await createLighthouseProvider({
          provider_type: provider,
          credentials: payload.credentials || {},
          ...(payload.base_url && { base_url: payload.base_url }),
        });

        if (result.errors) {
          throw new Error(
            result.errors[0]?.detail || "Failed to create provider",
          );
        }
        if (!result.data?.id) {
          throw new Error("Failed to create provider");
        }

        providerId = result.data.id;
        setExistingProviderId(providerId);
      }

      const shouldTestBedrock =
        (bedrockMode === BEDROCK_CREDENTIAL_MODES.API_KEY &&
          !!formData.api_key?.trim()) ||
        (bedrockMode === BEDROCK_CREDENTIAL_MODES.IAM &&
          (!!formData.access_key_id?.trim() ||
            !!formData.secret_access_key?.trim()));

      const shouldTest =
        provider === "bedrock"
          ? shouldTestBedrock
          : shouldTestConnection(provider, formData);

      // Test connection if credentials provided
      if (shouldTest) {
        setStatus(CONNECTION_STATUS.VERIFYING);
        await testAndRefreshModels(providerId);
        setStatus(CONNECTION_STATUS.LOADING_MODELS);
      }

      // Navigate to model selection on success
      router.push(
        `/lighthouse/config/select-model?provider=${provider}${isEditMode ? "&mode=edit" : ""}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus(CONNECTION_STATUS.IDLE);
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (error) setError(null);
  };

  const getSubmitText = () => {
    if (error && existingProviderId) return "Retry Connection";
    return isEditMode ? "Continue" : "Connect";
  };

  const getLoadingText = () => {
    if (status === CONNECTION_STATUS.IDLE) {
      return "";
    }
    return (
      STATUS_MESSAGES[status] || STATUS_MESSAGES[CONNECTION_STATUS.CONNECTING]
    );
  };

  const renderFormField = (
    id: string,
    label: string,
    type: string,
    placeholder: string,
    required = true,
  ) => (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}{" "}
        {!isEditMode && required && <span className="text-text-error">*</span>}
        {isEditMode && (
          <span className="text-text-neutral-tertiary text-xs">
            (leave empty to keep existing)
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={formData[id] || ""}
        onChange={(e) => handleFieldChange(id, e.target.value)}
        placeholder={
          isEditMode ? `Enter new ${label} or leave empty` : placeholder
        }
        className="border-border-neutral-primary bg-bg-neutral-primary w-full rounded-lg border px-3 py-2"
      />
    </div>
  );

  if (!providerConfig) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-text-error text-sm">
          Provider configuration not found: {provider}
        </div>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-text-neutral-secondary text-sm">
          Loading provider configuration...
        </div>
      </div>
    );
  }

  const mainFields = getMainFields(provider);

  const isBedrockProvider = provider === "bedrock";

  const isBedrockFormValid = (): boolean => {
    if (isEditMode) return true;

    const hasRegion = !!formData.region?.trim();

    if (bedrockMode === BEDROCK_CREDENTIAL_MODES.API_KEY) {
      return !!formData.api_key?.trim() && hasRegion;
    }

    return (
      !!formData.access_key_id?.trim() &&
      !!formData.secret_access_key?.trim() &&
      hasRegion
    );
  };

  const isFormValid = isBedrockProvider
    ? isBedrockFormValid()
    : isProviderFormValid(provider, formData, isEditMode);
  const isLoading = status !== CONNECTION_STATUS.IDLE;

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          {isEditMode
            ? `Update ${providerConfig.name}`
            : `Connect to ${providerConfig.name}`}
        </h2>
        <p className="text-text-neutral-secondary text-sm">
          {isEditMode
            ? `Update your API credentials or settings for ${providerConfig.name}.`
            : `Enter your API credentials to connect to ${providerConfig.name}.`}
        </p>
      </div>

      {error && (
        <div className="border-border-error-primary bg-bg-fail-secondary rounded-lg border p-4">
          <p className="text-text-error text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isBedrockProvider ? (
          <>
            {bedrockMode === BEDROCK_CREDENTIAL_MODES.API_KEY && (
              <div className="border-border-warning-primary bg-bg-warning-secondary rounded-lg border p-4">
                <p className="text-text-warning text-sm font-medium">
                  Recommended only for exploration of Amazon Bedrock.
                </p>
                <p className="text-text-warning mt-1 text-xs">
                  Please ensure you&apos;re using long-term Bedrock API keys.
                </p>
              </div>
            )}
            {bedrockMode === BEDROCK_CREDENTIAL_MODES.API_KEY ? (
              <>
                {renderFormField(
                  "api_key",
                  "API key (long-term)",
                  "password",
                  "Enter your long-term API key",
                )}
                {renderFormField(
                  "region",
                  "AWS region",
                  "text",
                  "Enter the AWS region",
                )}
              </>
            ) : (
              <>
                {renderFormField(
                  "access_key_id",
                  "AWS access key ID",
                  "password",
                  "Enter the AWS Access Key ID",
                )}
                {renderFormField(
                  "secret_access_key",
                  "AWS secret access key",
                  "password",
                  "Enter the AWS Secret Access Key",
                )}
                {renderFormField(
                  "region",
                  "AWS region",
                  "text",
                  "Enter the AWS Region",
                )}
              </>
            )}
          </>
        ) : (
          mainFields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="mb-2 block text-sm font-medium"
              >
                {field.label}{" "}
                {!isEditMode && field.required && (
                  <span className="text-text-error">*</span>
                )}
                {isEditMode && (
                  <span className="text-text-neutral-tertiary text-xs">
                    (leave empty to keep existing)
                  </span>
                )}
              </label>
              <input
                id={field.name}
                type={field.type}
                value={formData[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={
                  isEditMode
                    ? `Enter new ${field.label} or leave empty`
                    : field.placeholder
                }
                className="border-border-neutral-primary bg-bg-neutral-primary w-full rounded-lg border px-3 py-2"
              />
            </div>
          ))
        )}

        <FormButtons
          onCancel={() => router.push("/lighthouse/config")}
          submitText={isLoading ? getLoadingText() : getSubmitText()}
          loadingText={getLoadingText()}
          isDisabled={!isFormValid || isLoading}
        />
      </form>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/lighthouse/index.ts

```typescript
export * from "./banner";
export * from "./chat";
export * from "./connect-llm-provider";
export * from "./lighthouse-settings";
export * from "./llm-provider-registry";
export * from "./llm-provider-utils";
export * from "./llm-providers-table";
export * from "./select-model";
```

--------------------------------------------------------------------------------

---[FILE: lighthouse-settings.tsx]---
Location: prowler-master/ui/components/lighthouse/lighthouse-settings.tsx
Signals: React, Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  getTenantConfig,
  updateTenantConfig,
} from "@/actions/lighthouse/lighthouse";
import { SaveIcon } from "@/components/icons";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomTextarea } from "@/components/ui/custom";
import { Form } from "@/components/ui/form";

const lighthouseSettingsSchema = z.object({
  businessContext: z
    .string()
    .max(1000, "Business context cannot exceed 1000 characters")
    .optional(),
});

type FormValues = z.infer<typeof lighthouseSettingsSchema>;

export const LighthouseSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(lighthouseSettingsSchema),
    defaultValues: {
      businessContext: "",
    },
    mode: "onChange",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsFetchingData(true);
      try {
        // Fetch tenant config
        const configResult = await getTenantConfig();
        if (configResult.data && !configResult.errors) {
          const config = configResult.data.attributes;
          form.reset({
            businessContext: config?.business_context || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchData();
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const config: Record<string, string> = {
        business_context: data.businessContext || "",
      };

      const result = await updateTenantConfig(config);

      if (result.errors) {
        const errorMessage =
          result.errors[0]?.detail || "Failed to save settings";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Lighthouse settings saved successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Lighthouse settings: " + String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <Card variant="base" padding="lg">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Icon
              icon="heroicons:arrow-path"
              className="h-8 w-8 animate-spin text-gray-400"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="base" padding="lg">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <CustomTextarea
              control={form.control}
              name="businessContext"
              label="Business Context"
              labelPlacement="inside"
              placeholder="Enter business context and relevant information for the chatbot (max 1000 characters)"
              variant="bordered"
              minRows={4}
              maxRows={8}
              description={`${form.watch("businessContext")?.length || 0}/1000 characters`}
            />

            <div className="flex w-full justify-end">
              <Button
                type="submit"
                aria-label="Save Settings"
                disabled={isLoading}
              >
                {!isLoading && <SaveIcon size={20} />}
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

````
