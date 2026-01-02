---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 567
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 567 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: useCreatePromptModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/useCreatePromptModal.tsx
Signals: React

```typescript
import {
  Alert,
  Button,
  ChevronDownIcon,
  ChevronRightIcon,
  FormUI,
  Modal,
  RHFControlledComponents,
  Spacer,
  SegmentedControlGroup,
  SegmentedControlButton,
} from '@databricks/design-system';
import { useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import type { ChatPromptMessage, PromptModelConfigFormData, RegisteredPrompt, RegisteredPromptVersion } from '../types';
import { useCreateRegisteredPromptMutation } from './useCreateRegisteredPromptMutation';
import {
  formDataToModelConfig,
  getChatPromptMessagesFromValue,
  getPromptContentTagValue,
  isChatPrompt,
  PROMPT_EXPERIMENT_IDS_TAG_KEY,
  PROMPT_MODEL_CONFIG_TAG_KEY,
  PROMPT_TYPE_CHAT,
  PROMPT_TYPE_TEXT,
  validateModelConfig,
} from '../utils';
import { ChatMessageCreator } from '../components/ChatMessageCreator';
import { ModelConfigForm } from '../components/ModelConfigForm';

export enum CreatePromptModalMode {
  CreatePrompt = 'CreatePrompt',
  CreatePromptVersion = 'CreatePromptVersion',
}

export const useCreatePromptModal = ({
  mode = CreatePromptModalMode.CreatePromptVersion,
  registeredPrompt,
  latestVersion,
  experimentId,
  onSuccess,
}: {
  mode: CreatePromptModalMode;
  registeredPrompt?: RegisteredPrompt;
  latestVersion?: RegisteredPromptVersion;
  experimentId?: string;
  onSuccess?: (result: { promptName: string; promptVersion?: string }) => void | Promise<any>;
}) => {
  const [open, setOpen] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const intl = useIntl();

  const form = useForm<{
    draftName: string;
    draftValue: string;
    chatMessages: ChatPromptMessage[];
    commitMessage: string;
    tags: { key: string; value: string }[];
    promptType: typeof PROMPT_TYPE_CHAT | typeof PROMPT_TYPE_TEXT;
    modelConfig: PromptModelConfigFormData;
  }>({
    defaultValues: {
      draftName: '',
      draftValue: '',
      chatMessages: [{ role: 'user', content: '' }],
      commitMessage: '',
      tags: [],
      promptType: PROMPT_TYPE_TEXT,
      modelConfig: {},
    },
  });

  const isCreatingNewPrompt = mode === CreatePromptModalMode.CreatePrompt;
  const isCreatingPromptVersion = mode === CreatePromptModalMode.CreatePromptVersion;

  const { mutate: mutateCreateVersion, error, reset: errorsReset, isLoading } = useCreateRegisteredPromptMutation();

  const modalElement = (
    <FormProvider {...form}>
      <Modal
        componentId="mlflow.prompts.create.modal"
        visible={open}
        onCancel={() => setOpen(false)}
        title={
          isCreatingPromptVersion ? (
            <FormattedMessage
              defaultMessage="Create prompt version"
              description="A header for the create prompt version modal in the prompt management UI"
            />
          ) : (
            <FormattedMessage
              defaultMessage="Create prompt"
              description="A header for the create prompt modal in the prompt management UI"
            />
          )
        }
        okText={
          <FormattedMessage
            defaultMessage="Create"
            description="A label for the confirm button in the create prompt modal in the prompt management UI"
          />
        }
        okButtonProps={{ loading: isLoading }}
        onOk={form.handleSubmit(async (values) => {
          const promptName =
            isCreatingPromptVersion && registeredPrompt?.name ? registeredPrompt?.name : values.draftName;

          if (values.promptType === PROMPT_TYPE_CHAT) {
            const hasEmptyMessage = values.chatMessages.some((m) => !m.content || !m.content.trim());
            if (hasEmptyMessage) {
              form.setError('chatMessages', {
                type: 'required',
                message: intl.formatMessage({
                  defaultMessage: 'Prompt content is required',
                  description: 'A validation state for the chat prompt content in the prompt creation modal',
                }),
              });
              return;
            }
          }

          // Validate model config if any field is provided
          const modelConfigErrors = validateModelConfig(values.modelConfig);
          if (Object.keys(modelConfigErrors).length > 0) {
            Object.entries(modelConfigErrors).forEach(([field, message]) => {
              form.setError(`modelConfig.${field}` as any, { type: 'validation', message });
            });
            return;
          }

          const chatMessages = values.chatMessages.map((message) => ({
            ...message,
            content: message.content.trim(),
          }));

          // Prepare experiment ID tag which has `,${experimentId},` format
          const promptTags = experimentId ? [{ key: PROMPT_EXPERIMENT_IDS_TAG_KEY, value: `,${experimentId},` }] : [];

          // Convert model config form data to backend format
          const modelConfig = formDataToModelConfig(values.modelConfig);
          const modelConfigTags = modelConfig
            ? [{ key: PROMPT_MODEL_CONFIG_TAG_KEY, value: JSON.stringify(modelConfig) }]
            : [];

          mutateCreateVersion(
            {
              createPromptEntity: isCreatingNewPrompt,
              content: values.promptType === PROMPT_TYPE_CHAT ? JSON.stringify(chatMessages) : values.draftValue,
              commitMessage: values.commitMessage,
              promptName,
              tags: [...values.tags, ...modelConfigTags],
              promptTags,
              promptType: values.promptType,
            },
            {
              onSuccess: (data) => {
                const promptVersion = data?.version;
                onSuccess?.({ promptName, promptVersion });
                setOpen(false);
              },
            },
          );
        })}
        cancelText={
          <FormattedMessage
            defaultMessage="Cancel"
            description="A label for the cancel button in the prompt creation modal in the prompt management UI"
          />
        }
        size="wide"
      >
        {error?.message && (
          <>
            <Alert componentId="mlflow.prompts.create.error" closable={false} message={error.message} type="error" />
            <Spacer />
          </>
        )}
        {isCreatingNewPrompt && (
          <>
            <FormUI.Label htmlFor="mlflow.prompts.create.name">Name:</FormUI.Label>
            <RHFControlledComponents.Input
              control={form.control}
              id="mlflow.prompts.create.name"
              componentId="mlflow.prompts.create.name"
              name="draftName"
              rules={{
                required: {
                  value: true,
                  message: intl.formatMessage({
                    defaultMessage: 'Name is required',
                    description: 'A validation state for the prompt name in the prompt creation modal',
                  }),
                },
                pattern: {
                  value: /^[a-zA-Z0-9_\-.]+$/,
                  message: intl.formatMessage({
                    defaultMessage: 'Only alphanumeric characters, underscores, hyphens, and dots are allowed',
                    description: 'A validation state for the prompt name format in the prompt creation modal',
                  }),
                },
              }}
              placeholder={intl.formatMessage({
                defaultMessage: 'Provide an unique prompt name',
                description: 'A placeholder for the prompt name in the prompt creation modal',
              })}
              validationState={form.formState.errors.draftName ? 'error' : undefined}
            />
            {form.formState.errors.draftName && (
              <FormUI.Message type="error" message={form.formState.errors.draftName.message} />
            )}
            <Spacer />
          </>
        )}
        <FormUI.Label>
          <FormattedMessage
            defaultMessage="Prompt type:"
            description="A label for selecting prompt type in the prompt creation modal"
          />
        </FormUI.Label>
        <Controller
          control={form.control}
          name="promptType"
          render={({ field }) => (
            <SegmentedControlGroup
              name="promptType"
              componentId="promptType"
              value={field.value}
              onChange={field.onChange}
            >
              <SegmentedControlButton value={PROMPT_TYPE_TEXT}>
                <FormattedMessage
                  defaultMessage="Text"
                  description="Label for text prompt type in the prompt creation modal"
                />
              </SegmentedControlButton>
              <SegmentedControlButton value={PROMPT_TYPE_CHAT}>
                <FormattedMessage
                  defaultMessage="Chat"
                  description="Label for chat prompt type in the prompt creation modal"
                />
              </SegmentedControlButton>
            </SegmentedControlGroup>
          )}
        />
        <Spacer />
        <FormUI.Label htmlFor="mlflow.prompts.create.content">Prompt:</FormUI.Label>
        {form.watch('promptType') === PROMPT_TYPE_CHAT ? (
          <ChatMessageCreator name="chatMessages" />
        ) : (
          <RHFControlledComponents.TextArea
            control={form.control}
            id="mlflow.prompts.create.content"
            componentId="mlflow.prompts.create.content"
            name="draftValue"
            autoSize={{ minRows: 3, maxRows: 10 }}
            rules={{
              required: {
                value: true,
                message: intl.formatMessage({
                  defaultMessage: 'Prompt content is required',
                  description: 'A validation state for the prompt content in the prompt creation modal',
                }),
              },
            }}
            placeholder={intl.formatMessage({
              defaultMessage: "Type prompt content here. Wrap variables with double curly brace e.g. '{{' name '}}'.",
              description: 'A placeholder for the prompt content in the prompt creation modal',
            })}
            validationState={form.formState.errors.draftValue ? 'error' : undefined}
          />
        )}
        {form.watch('promptType') === PROMPT_TYPE_TEXT && form.formState.errors.draftValue && (
          <FormUI.Message type="error" message={form.formState.errors.draftValue.message} />
        )}
        <Spacer />
        <FormUI.Label htmlFor="mlflow.prompts.create.commit_message">Commit message (optional):</FormUI.Label>
        <RHFControlledComponents.Input
          control={form.control}
          id="mlflow.prompts.create.commit_message"
          componentId="mlflow.prompts.create.commit_message"
          name="commitMessage"
        />
        <Spacer />
        {/* Advanced Settings Section */}
        <Button
          componentId="mlflow.prompts.create.toggle_advanced_settings"
          type="link"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          icon={showAdvancedSettings ? <ChevronDownIcon /> : <ChevronRightIcon />}
          css={{ padding: 0 }}
        >
          <FormattedMessage
            defaultMessage="Advanced settings (optional)"
            description="Toggle button for advanced settings in prompt creation modal"
          />
        </Button>
        {showAdvancedSettings && (
          <>
            <Spacer size="sm" />
            <ModelConfigForm />
          </>
        )}
      </Modal>
    </FormProvider>
  );

  const openModal = () => {
    errorsReset();
    const tagValue =
      mode === CreatePromptModalMode.CreatePromptVersion && latestVersion
        ? getPromptContentTagValue(latestVersion) ?? ''
        : '';
    const promptType = isChatPrompt(latestVersion) ? PROMPT_TYPE_CHAT : PROMPT_TYPE_TEXT;
    const parsedMessages = getChatPromptMessagesFromValue(tagValue);

    // Check if latest version has model config to auto-expand advanced settings
    const hasModelConfig =
      mode === CreatePromptModalMode.CreatePromptVersion &&
      latestVersion?.tags?.some((tag) => tag.key === PROMPT_MODEL_CONFIG_TAG_KEY && tag.value);

    form.reset({
      commitMessage: '',
      draftName: '',
      draftValue: parsedMessages ? '' : tagValue,
      chatMessages: parsedMessages
        ? parsedMessages.map((message) => ({ ...message }))
        : [{ role: 'user', content: '' }],
      tags: [],
      promptType,
      modelConfig: {},
    });
    setShowAdvancedSettings(!!hasModelConfig);
    setOpen(true);
  };

  return { CreatePromptModal: modalElement, openModal };
};
```

--------------------------------------------------------------------------------

---[FILE: useCreateRegisteredPromptMutation.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/useCreateRegisteredPromptMutation.tsx

```typescript
import { useMutation } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { RegisteredPromptsApi } from '../api';
import type { PROMPT_TYPE_CHAT, PROMPT_TYPE_TEXT } from '../utils';
import { PROMPT_TYPE_TAG_KEY, REGISTERED_PROMPT_CONTENT_TAG_KEY } from '../utils';

type UpdateContentPayload = {
  promptName: string;
  promptType: typeof PROMPT_TYPE_CHAT | typeof PROMPT_TYPE_TEXT;
  createPromptEntity?: boolean;
  content: string;
  commitMessage?: string;
  tags: { key: string; value: string }[];
  promptTags?: { key: string; value: string }[];
};

export const useCreateRegisteredPromptMutation = () => {
  const updateMutation = useMutation<{ version: string }, Error, UpdateContentPayload>({
    mutationFn: async ({
      promptName,
      promptType,
      createPromptEntity,
      content,
      commitMessage,
      tags,
      promptTags = [],
    }) => {
      if (createPromptEntity) {
        await RegisteredPromptsApi.createRegisteredPrompt(promptName, promptTags);
      }

      const version = await RegisteredPromptsApi.createRegisteredPromptVersion(
        promptName,
        [
          { key: REGISTERED_PROMPT_CONTENT_TAG_KEY, value: content },
          { key: PROMPT_TYPE_TAG_KEY, value: promptType },
          ...tags,
        ],
        commitMessage,
      );

      const newVersionNumber = version?.model_version?.version;
      if (!newVersionNumber) {
        throw new Error('Failed to create a new prompt version');
      }
      return { version: newVersionNumber };
    },
  });

  return updateMutation;
};
```

--------------------------------------------------------------------------------

---[FILE: useDeletePromptModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/useDeletePromptModal.tsx
Signals: React

```typescript
import { useMutation } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { Modal } from '@databricks/design-system';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import type { RegisteredPrompt } from '../types';
import { RegisteredPromptsApi } from '../api';

export const useDeletePromptModal = ({
  registeredPrompt,
  onSuccess,
}: {
  registeredPrompt?: RegisteredPrompt;
  onSuccess?: () => void | Promise<any>;
}) => {
  const [open, setOpen] = useState(false);

  const { mutate } = useMutation<
    unknown,
    Error,
    {
      promptName: string;
    }
  >({
    mutationFn: async ({ promptName }) => {
      await RegisteredPromptsApi.deleteRegisteredPrompt(promptName);
    },
  });

  const modalElement = (
    <Modal
      componentId="mlflow.prompts.delete_modal"
      visible={open}
      onCancel={() => setOpen(false)}
      title={<FormattedMessage defaultMessage="Delete prompt" description="A header for the delete prompt modal" />}
      okText={
        <FormattedMessage
          defaultMessage="Delete"
          description="A label for the confirm button in the delete prompt modal"
        />
      }
      okButtonProps={{ danger: true }}
      onOk={async () => {
        if (!registeredPrompt?.name) {
          setOpen(false);
          return;
        }
        mutate(
          {
            promptName: registeredPrompt.name,
          },
          {
            onSuccess: () => {
              onSuccess?.();
              setOpen(false);
            },
          },
        );
        setOpen(false);
      }}
      cancelText={
        <FormattedMessage
          defaultMessage="Cancel"
          description="A label for the cancel button in the delete prompt modal"
        />
      }
    >
      <FormattedMessage
        defaultMessage="Are you sure you want to delete the prompt?"
        description="A content for the delete prompt confirmation modal"
      />
    </Modal>
  );

  const openModal = () => setOpen(true);

  return { DeletePromptModal: modalElement, openModal };
};
```

--------------------------------------------------------------------------------

---[FILE: useDeletePromptVersionModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/useDeletePromptVersionModal.tsx
Signals: React

```typescript
import { useMutation } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { Modal } from '@databricks/design-system';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import type { RegisteredPromptVersion } from '../types';
import { RegisteredPromptsApi } from '../api';

export const useDeletePromptVersionModal = ({
  promptVersion,
  onSuccess,
}: {
  promptVersion?: RegisteredPromptVersion;
  onSuccess?: () => void | Promise<any>;
}) => {
  const [open, setOpen] = useState(false);

  const { mutate } = useMutation<
    unknown,
    Error,
    {
      promptName: string;
      version: string;
    }
  >({
    mutationFn: async ({ promptName, version }) => {
      await RegisteredPromptsApi.deleteRegisteredPromptVersion(promptName, version);
    },
  });

  const modalElement = (
    <Modal
      componentId="mlflow.prompts.delete_version_modal"
      visible={open}
      onCancel={() => setOpen(false)}
      title={
        <FormattedMessage
          defaultMessage="Delete prompt version"
          description="A header for the delete prompt version modal"
        />
      }
      okText={
        <FormattedMessage
          defaultMessage="Delete"
          description="A label for the confirm button in the delete prompt version modal"
        />
      }
      okButtonProps={{ danger: true }}
      onOk={async () => {
        if (!promptVersion?.name) {
          setOpen(false);
          return;
        }
        mutate(
          {
            promptName: promptVersion.name,
            version: promptVersion.version,
          },
          {
            onSuccess: () => {
              onSuccess?.();
              setOpen(false);
            },
          },
        );
        setOpen(false);
      }}
      cancelText={
        <FormattedMessage
          defaultMessage="Cancel"
          description="A label for the cancel button in the delete prompt version modal"
        />
      }
    >
      <FormattedMessage
        defaultMessage="Are you sure you want to delete the prompt version?"
        description="A content for the delete prompt version confirmation modal"
      />
    </Modal>
  );

  const openModal = () => setOpen(true);

  return { DeletePromptModal: modalElement, openModal };
};
```

--------------------------------------------------------------------------------

---[FILE: useEditModelConfigModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/useEditModelConfigModal.tsx
Signals: React

```typescript
import { useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Modal, Button, Spacer, Alert } from '@databricks/design-system';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { RegisteredPromptsApi } from '../api';
import { ModelConfigForm } from '../components/ModelConfigForm';
import {
  formDataToModelConfig,
  getModelConfigFromTags,
  modelConfigToFormData,
  PROMPT_MODEL_CONFIG_TAG_KEY,
  validateModelConfig,
} from '../utils';
import type { PromptModelConfigFormData, RegisteredPromptVersion } from '../types';

export const useEditModelConfigModal = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<RegisteredPromptVersion | null>(null);
  const intl = useIntl();

  const form = useForm<{ modelConfig: PromptModelConfigFormData }>({
    defaultValues: { modelConfig: {} },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      promptName,
      promptVersion,
      modelConfigJson,
    }: {
      promptName: string;
      promptVersion: string;
      modelConfigJson: string;
    }) => {
      return RegisteredPromptsApi.setRegisteredPromptVersionTag(
        promptName,
        promptVersion,
        PROMPT_MODEL_CONFIG_TAG_KEY,
        modelConfigJson,
      );
    },
  });

  const openModal = useCallback(
    (version: RegisteredPromptVersion) => {
      updateMutation.reset();
      setEditingVersion(version);
      const currentConfig = getModelConfigFromTags(version.tags);
      form.reset({ modelConfig: modelConfigToFormData(currentConfig) });
      setOpen(true);
    },
    [form, updateMutation],
  );

  const handleSave = form.handleSubmit(async (values) => {
    if (!editingVersion) return;

    // Validate
    const errors = validateModelConfig(values.modelConfig);
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        form.setError(`modelConfig.${field}` as any, { type: 'validation', message });
      });
      return;
    }

    // Convert to backend format
    const modelConfig = formDataToModelConfig(values.modelConfig);
    const modelConfigJson = modelConfig ? JSON.stringify(modelConfig) : '{}';

    updateMutation.mutate(
      {
        promptName: editingVersion.name,
        promptVersion: editingVersion.version,
        modelConfigJson,
      },
      {
        onSuccess: () => {
          setOpen(false);
          onSuccess?.();
        },
      },
    );
  });

  const EditModelConfigModal = (
    <FormProvider {...form}>
      <Modal
        componentId="mlflow.prompts.edit_model_config.modal"
        visible={open}
        onCancel={() => {
          setOpen(false);
          form.clearErrors();
        }}
        title={
          <FormattedMessage
            defaultMessage="Edit Model Configuration"
            description="Title for the edit model config modal"
          />
        }
        okText={<FormattedMessage defaultMessage="Save" description="Save button for the edit model config modal" />}
        okButtonProps={{ loading: updateMutation.isLoading }}
        onOk={handleSave}
        cancelText={
          <FormattedMessage defaultMessage="Cancel" description="Cancel button for the edit model config modal" />
        }
        size="normal"
      >
        {updateMutation.error && (
          <>
            <Alert
              componentId="mlflow.prompts.edit_model_config.error"
              closable={false}
              message={(updateMutation.error as Error).message}
              type="error"
            />
            <Spacer />
          </>
        )}
        <ModelConfigForm />
      </Modal>
    </FormProvider>
  );

  return { EditModelConfigModal, openEditModelConfigModal: openModal };
};
```

--------------------------------------------------------------------------------

---[FILE: usePromptDetailsPageViewState.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/usePromptDetailsPageViewState.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';
import { usePromptDetailsPageViewState } from './usePromptDetailsPageViewState';
import { PromptVersionsTableMode } from '../utils';
import type { RegisteredPromptDetailsResponse, RegisteredPromptVersion } from '../types';
import { act, renderHook } from '@testing-library/react';

describe('usePromptDetailsPageViewState', () => {
  const mockPromptDetailsData: RegisteredPromptDetailsResponse = {
    versions: [{ version: '1' }, { version: '2' }] as RegisteredPromptVersion[],
  };

  it('should initialize with preview mode', () => {
    const { result } = renderHook(() => usePromptDetailsPageViewState());
    expect(result.current.viewState.mode).toBe(PromptVersionsTableMode.PREVIEW);
  });

  it('should set preview mode with selected version', () => {
    const { result } = renderHook(() => usePromptDetailsPageViewState(mockPromptDetailsData));
    act(() => {
      result.current.setPreviewMode({ version: '1' });
    });
    expect(result.current.viewState.mode).toBe(PromptVersionsTableMode.PREVIEW);
    expect(result.current.viewState.selectedVersion).toBe('1');
  });

  it('should set compare mode with selected and compared versions', () => {
    const { result } = renderHook(() => usePromptDetailsPageViewState(mockPromptDetailsData));
    act(() => {
      result.current.setCompareMode();
    });
    expect(result.current.viewState.mode).toBe(PromptVersionsTableMode.COMPARE);
    expect(result.current.viewState.selectedVersion).toBe('2');
    expect(result.current.viewState.comparedVersion).toBe('1');
  });

  it('should switch sides', () => {
    const { result } = renderHook(() => usePromptDetailsPageViewState(mockPromptDetailsData));
    act(() => {
      result.current.setCompareMode();
    });
    act(() => {
      result.current.switchSides();
    });
    expect(result.current.viewState.selectedVersion).toBe('1');
    expect(result.current.viewState.comparedVersion).toBe('2');
  });

  it('should set selected version', () => {
    const { result } = renderHook(() => usePromptDetailsPageViewState());
    act(() => {
      result.current.setSelectedVersion('3');
    });
    expect(result.current.viewState.selectedVersion).toBe('3');
  });

  it('should set compared version', () => {
    const { result } = renderHook(() => usePromptDetailsPageViewState());
    act(() => {
      result.current.setComparedVersion('4');
    });
    expect(result.current.viewState.comparedVersion).toBe('4');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: usePromptDetailsPageViewState.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/usePromptDetailsPageViewState.tsx
Signals: React

```typescript
import { useCallback, useReducer } from 'react';
import { PromptVersionsTableMode } from '../utils';
import { first } from 'lodash';
import type { RegisteredPromptDetailsResponse } from '../types';

const promptDetailsViewStateReducer = (
  state: {
    mode: PromptVersionsTableMode;
    selectedVersion?: string;
    comparedVersion?: string;
  },
  action:
    | { type: 'switchSides' }
    | { type: 'setPreviewMode'; selectedVersion?: string }
    | { type: 'setCompareMode'; selectedVersion?: string; comparedVersion?: string }
    | { type: 'setSelectedVersion'; selectedVersion: string }
    | { type: 'setComparedVersion'; comparedVersion: string },
) => {
  if (action.type === 'switchSides') {
    return { ...state, selectedVersion: state.comparedVersion, comparedVersion: state.selectedVersion };
  }
  if (action.type === 'setPreviewMode') {
    return { ...state, mode: PromptVersionsTableMode.PREVIEW, selectedVersion: action.selectedVersion };
  }
  if (action.type === 'setCompareMode') {
    return {
      ...state,
      mode: PromptVersionsTableMode.COMPARE,
      selectedVersion: action.selectedVersion,
      comparedVersion: action.comparedVersion,
    };
  }
  if (action.type === 'setSelectedVersion') {
    return { ...state, selectedVersion: action.selectedVersion };
  }
  if (action.type === 'setComparedVersion') {
    return { ...state, comparedVersion: action.comparedVersion };
  }
  return state;
};

export const usePromptDetailsPageViewState = (promptDetailsData?: RegisteredPromptDetailsResponse) => {
  const [viewState, dispatchViewMode] = useReducer(promptDetailsViewStateReducer, {
    mode: PromptVersionsTableMode.PREVIEW,
  });

  const setPreviewMode = useCallback(
    (versionEntity?: { version: string }) => {
      const firstVersion = (versionEntity ?? first(promptDetailsData?.versions))?.version;
      dispatchViewMode({ type: 'setPreviewMode', selectedVersion: firstVersion });
    },
    [promptDetailsData],
  );
  const setSelectedVersion = useCallback((selectedVersion: string) => {
    dispatchViewMode({ type: 'setSelectedVersion', selectedVersion });
  }, []);
  const setComparedVersion = useCallback((comparedVersion: string) => {
    dispatchViewMode({ type: 'setComparedVersion', comparedVersion });
  }, []);
  const setCompareMode = useCallback(() => {
    // Last (highest) version will be the compared version
    const comparedVersion = first(promptDetailsData?.versions)?.version;
    // The one immediately before the last version will be the baseline version
    const baselineVersion = promptDetailsData?.versions[1]?.version;
    dispatchViewMode({ type: 'setCompareMode', selectedVersion: baselineVersion, comparedVersion });
  }, [promptDetailsData]);

  const switchSides = useCallback(() => dispatchViewMode({ type: 'switchSides' }), []);

  if (
    first(promptDetailsData?.versions) &&
    viewState.mode === PromptVersionsTableMode.PREVIEW &&
    !viewState.selectedVersion
  ) {
    setPreviewMode(first(promptDetailsData?.versions));
  }

  return {
    viewState,
    setPreviewMode,
    setCompareMode,
    switchSides,
    setSelectedVersion,
    setComparedVersion,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: usePromptDetailsQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/usePromptDetailsQuery.tsx

```typescript
import type { QueryFunctionContext, UseQueryOptions } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useQuery } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import type { RegisteredPromptDetailsResponse } from '../types';
import { RegisteredPromptsApi } from '../api';

const queryFn = async ({ queryKey }: QueryFunctionContext<PromptDetailsQueryKey>) => {
  const [, { promptName }] = queryKey;
  const [detailsResponse, versionsResponse] = await Promise.all([
    RegisteredPromptsApi.getPromptDetails(promptName),
    RegisteredPromptsApi.getPromptVersions(promptName),
  ]);

  return {
    prompt: detailsResponse.registered_model,
    versions: versionsResponse.model_versions ?? [],
  };
};

type PromptDetailsQueryKey = ['prompt_details', { promptName: string }];

export const usePromptDetailsQuery = (
  { promptName }: { promptName: string },
  options: UseQueryOptions<
    RegisteredPromptDetailsResponse,
    Error,
    RegisteredPromptDetailsResponse,
    PromptDetailsQueryKey
  > = {},
) => {
  const queryResult = useQuery<
    RegisteredPromptDetailsResponse,
    Error,
    RegisteredPromptDetailsResponse,
    PromptDetailsQueryKey
  >(['prompt_details', { promptName }], {
    queryFn,
    retry: false,
    ...options,
  });

  return {
    data: queryResult.data,
    error: queryResult.error ?? undefined,
    isLoading: queryResult.isLoading,
    refetch: queryResult.refetch,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: usePromptRunsInfo.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/usePromptRunsInfo.tsx

```typescript
import type { QueryFunctionContext } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useQueries } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { transformGetRunResponse } from '../../../sdk/FieldNameTransformers';
import { MlflowService } from '../../../sdk/MlflowService';
import type { GetRunApiResponse } from '../../../types';

type UseRegisteredModelRelatedRunNamesQueryKey = ['prompt_associated_runs', string];

export const usePromptRunsInfo = (runUuids: string[] = []) => {
  const queryResults = useQueries({
    queries: runUuids.map((runUuid) => ({
      queryKey: ['prompt_associated_runs', runUuid] as UseRegisteredModelRelatedRunNamesQueryKey,
      queryFn: async ({
        queryKey: [, runUuid],
      }: QueryFunctionContext<UseRegisteredModelRelatedRunNamesQueryKey>): Promise<GetRunApiResponse | null> => {
        try {
          const data = await MlflowService.getRun({ run_id: runUuid });
          return transformGetRunResponse(data);
        } catch (e) {
          return null;
        }
      },
    })),
  });

  // Create a map of run_id to run info
  const runInfoMap: Record<string, any | undefined> = {};

  queryResults.forEach((queryResult, index) => {
    const runUuid = runUuids[index];
    runInfoMap[runUuid] = queryResult.data?.run?.info;
  });

  return {
    isLoading: runUuids.length > 0 && queryResults.some((queryResult) => queryResult.isLoading),
    runInfoMap,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: usePromptsListQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/usePromptsListQuery.tsx
Signals: React

```typescript
import type { QueryFunctionContext } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useQuery } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useCallback, useRef, useState } from 'react';
import type { RegisteredPromptsListResponse } from '../types';
import { RegisteredPromptsApi } from '../api';

const queryFn = ({ queryKey }: QueryFunctionContext<PromptsListQueryKey>) => {
  const [, { searchFilter, pageToken, experimentId }] = queryKey;
  return RegisteredPromptsApi.listRegisteredPrompts(searchFilter, pageToken, experimentId);
};

type PromptsListQueryKey = ['prompts_list', { searchFilter?: string; pageToken?: string; experimentId?: string }];

export const usePromptsListQuery = ({
  searchFilter,
  experimentId,
}: {
  searchFilter?: string;
  experimentId?: string;
} = {}) => {
  const previousPageTokens = useRef<(string | undefined)[]>([]);

  const [currentPageToken, setCurrentPageToken] = useState<string | undefined>(undefined);

  const queryResult = useQuery<
    RegisteredPromptsListResponse,
    Error,
    RegisteredPromptsListResponse,
    PromptsListQueryKey
  >(['prompts_list', { searchFilter, pageToken: currentPageToken, experimentId }], {
    queryFn,
    retry: false,
  });

  const onNextPage = useCallback(() => {
    previousPageTokens.current.push(currentPageToken);
    setCurrentPageToken(queryResult.data?.next_page_token);
  }, [queryResult.data?.next_page_token, currentPageToken]);

  const onPreviousPage = useCallback(() => {
    const previousPageToken = previousPageTokens.current.pop();
    setCurrentPageToken(previousPageToken);
  }, []);

  return {
    data: queryResult.data?.registered_models,
    error: queryResult.error ?? undefined,
    isLoading: queryResult.isLoading,
    hasNextPage: queryResult.data?.next_page_token !== undefined,
    hasPreviousPage: Boolean(currentPageToken),
    onNextPage,
    onPreviousPage,
    refetch: queryResult.refetch,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: usePromptVersionsForRunQuery.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/usePromptVersionsForRunQuery.tsx

```typescript
import type { QueryFunctionContext, UseQueryOptions } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { useQuery } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import type { PromptVersionsForRunResponse, RegisteredPromptDetailsResponse, RegisteredPromptVersion } from '../types';
import { RegisteredPromptsApi } from '../api';

const queryFn = async ({ queryKey }: QueryFunctionContext<PromptVersionsForRunQueryKey>) => {
  const [, { runUuid }] = queryKey;
  return RegisteredPromptsApi.getPromptVersionsForRun(runUuid);
};

type PromptVersionsForRunQueryKey = ['run_uuid', { runUuid: string }];

export const usePromptVersionsForRunQuery = (
  { runUuid }: { runUuid: string },
  options: UseQueryOptions<
    PromptVersionsForRunResponse,
    Error,
    PromptVersionsForRunResponse,
    PromptVersionsForRunQueryKey
  > = {},
) => {
  const queryResult = useQuery<
    PromptVersionsForRunResponse,
    Error,
    PromptVersionsForRunResponse,
    PromptVersionsForRunQueryKey
  >(['run_uuid', { runUuid }], {
    queryFn,
    retry: false,
    ...options,
  });

  return {
    data: queryResult.data,
    error: queryResult.error ?? undefined,
    isLoading: queryResult.isLoading,
    refetch: queryResult.refetch,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: useSelectedPromptVersion.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/hooks/useSelectedPromptVersion.tsx
Signals: React

```typescript
import { useCallback } from 'react';
import { PROMPT_VERSION_QUERY_PARAM } from '../utils';
import { useSearchParams } from '@mlflow/mlflow/src/common/utils/RoutingUtils';

/**
 * Query param-powered hook that returns the selected prompt version.
 */
export const useSelectedPromptVersion = (latestVersion?: string) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedPromptVersion = searchParams.get(PROMPT_VERSION_QUERY_PARAM) ?? latestVersion;

  const setSelectedPromptVersion = useCallback(
    (selectedPromptVersion: string | undefined) => {
      setSearchParams(
        (params) => {
          if (selectedPromptVersion === undefined) {
            params.delete(PROMPT_VERSION_QUERY_PARAM);
            return params;
          }
          params.set(PROMPT_VERSION_QUERY_PARAM, selectedPromptVersion);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return [selectedPromptVersion, setSelectedPromptVersion] as const;
};
```

--------------------------------------------------------------------------------

````
