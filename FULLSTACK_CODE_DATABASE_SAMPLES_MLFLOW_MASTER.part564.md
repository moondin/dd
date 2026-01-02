---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 564
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 564 of 991)

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

---[FILE: utils.test.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/utils.test.ts

```typescript
import { describe, test, expect } from '@jest/globals';
import { formDataToModelConfig, modelConfigToFormData, validateModelConfig, getModelConfigFromTags } from './utils';
import type { PromptModelConfig, PromptModelConfigFormData } from './types';

describe('Model Config Utils', () => {
  describe('formDataToModelConfig', () => {
    test('converts all fields correctly', () => {
      const formData: PromptModelConfigFormData = {
        provider: 'openai',
        modelName: 'gpt-4',
        temperature: '0.7',
        maxTokens: '2048',
        topP: '0.9',
        topK: '40',
        frequencyPenalty: '0.5',
        presencePenalty: '0.3',
        stopSequences: '\\n\\n, END, ###',
      };

      const result = formDataToModelConfig(formData);

      expect(result).toEqual({
        provider: 'openai',
        model_name: 'gpt-4',
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
        top_k: 40,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        stop_sequences: ['\\n\\n', 'END', '###'],
      });
    });

    test('returns undefined for empty form data', () => {
      const formData: PromptModelConfigFormData = {};
      expect(formDataToModelConfig(formData)).toBeUndefined();
    });

    test('handles partial data', () => {
      const formData: PromptModelConfigFormData = {
        modelName: 'claude-3',
        temperature: '1.0',
      };

      const result = formDataToModelConfig(formData);

      expect(result).toEqual({
        model_name: 'claude-3',
        temperature: 1.0,
      });
    });

    test('filters out invalid number strings', () => {
      const formData: PromptModelConfigFormData = {
        temperature: 'abc',
        maxTokens: 'xyz',
      };

      expect(formDataToModelConfig(formData)).toBeUndefined();
    });

    test('trims whitespace from strings', () => {
      const formData: PromptModelConfigFormData = {
        modelName: '  gpt-4  ',
        stopSequences: '  \\n\\n  ,  END  ',
      };

      const result = formDataToModelConfig(formData);

      expect(result).toEqual({
        model_name: 'gpt-4',
        stop_sequences: ['\\n\\n', 'END'],
      });
    });
  });

  describe('modelConfigToFormData', () => {
    test('converts all fields correctly', () => {
      const config: PromptModelConfig = {
        provider: 'openai',
        model_name: 'gpt-4',
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
        top_k: 40,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        stop_sequences: ['\\n\\n', 'END', '###'],
      };

      const result = modelConfigToFormData(config);

      expect(result).toEqual({
        provider: 'openai',
        modelName: 'gpt-4',
        temperature: '0.7',
        maxTokens: '2048',
        topP: '0.9',
        topK: '40',
        frequencyPenalty: '0.5',
        presencePenalty: '0.3',
        stopSequences: '\\n\\n, END, ###',
      });
    });

    test('returns empty object for undefined config', () => {
      expect(modelConfigToFormData(undefined)).toEqual({});
    });

    test('handles partial data', () => {
      const config: PromptModelConfig = {
        model_name: 'claude-3',
        temperature: 1.0,
      };

      const result = modelConfigToFormData(config);

      expect(result).toEqual({
        provider: '',
        modelName: 'claude-3',
        temperature: '1',
        maxTokens: '',
        topP: '',
        topK: '',
        frequencyPenalty: '',
        presencePenalty: '',
        stopSequences: '',
      });
    });
  });

  describe('validateModelConfig', () => {
    test('returns no errors for valid data', () => {
      const formData: PromptModelConfigFormData = {
        temperature: '0.7',
        maxTokens: '2048',
        topP: '0.9',
        topK: '40',
        frequencyPenalty: '0.5',
        presencePenalty: '0.3',
      };

      expect(validateModelConfig(formData)).toEqual({});
    });

    test('validates temperature range', () => {
      expect(validateModelConfig({ temperature: '-1' })).toHaveProperty('temperature');
      expect(validateModelConfig({ temperature: 'abc' })).toHaveProperty('temperature');
      expect(validateModelConfig({ temperature: '0' })).toEqual({});
    });

    test('validates maxTokens range', () => {
      expect(validateModelConfig({ maxTokens: '0' })).toHaveProperty('maxTokens');
      expect(validateModelConfig({ maxTokens: '-1' })).toHaveProperty('maxTokens');
      expect(validateModelConfig({ maxTokens: 'abc' })).toHaveProperty('maxTokens');
      expect(validateModelConfig({ maxTokens: '1' })).toEqual({});
    });

    test('validates topP range', () => {
      expect(validateModelConfig({ topP: '-0.1' })).toHaveProperty('topP');
      expect(validateModelConfig({ topP: '1.1' })).toHaveProperty('topP');
      expect(validateModelConfig({ topP: '0.5' })).toEqual({});
    });

    test('validates topK range', () => {
      expect(validateModelConfig({ topK: '0' })).toHaveProperty('topK');
      expect(validateModelConfig({ topK: '-1' })).toHaveProperty('topK');
      expect(validateModelConfig({ topK: '1' })).toEqual({});
    });

    test('validates frequency and presence penalty range', () => {
      expect(validateModelConfig({ frequencyPenalty: '-2.1' })).toHaveProperty('frequencyPenalty');
      expect(validateModelConfig({ frequencyPenalty: '2.1' })).toHaveProperty('frequencyPenalty');
      expect(validateModelConfig({ presencePenalty: '-2.1' })).toHaveProperty('presencePenalty');
      expect(validateModelConfig({ presencePenalty: '2.1' })).toHaveProperty('presencePenalty');
      expect(validateModelConfig({ frequencyPenalty: '0' })).toEqual({});
    });
  });

  describe('getModelConfigFromTags', () => {
    test('parses valid JSON tag', () => {
      const tags = [{ key: '_mlflow_prompt_model_config', value: '{"model_name":"gpt-4","temperature":0.7}' }];

      const result = getModelConfigFromTags(tags);

      expect(result).toEqual({
        model_name: 'gpt-4',
        temperature: 0.7,
      });
    });

    test('returns undefined for missing tag', () => {
      const tags = [{ key: 'other.tag', value: 'value' }];
      expect(getModelConfigFromTags(tags)).toBeUndefined();
    });

    test('returns undefined for invalid JSON', () => {
      const tags = [{ key: '_mlflow_prompt_model_config', value: 'not-json' }];
      expect(getModelConfigFromTags(tags)).toBeUndefined();
    });

    test('returns undefined for empty tags array', () => {
      expect(getModelConfigFromTags([])).toBeUndefined();
    });

    test('returns undefined for undefined tags', () => {
      expect(getModelConfigFromTags(undefined)).toBeUndefined();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/utils.ts

```typescript
import type { KeyValueEntity } from '@mlflow/mlflow/src/common/types';
import { parseJSONSafe } from '@mlflow/mlflow/src/common/utils/TagUtils';
import type {
  ChatPromptMessage,
  PromptModelConfig,
  PromptModelConfigFormData,
  RegisteredPrompt,
  RegisteredPromptVersion,
} from './types';
import { MLFLOW_LINKED_PROMPTS_TAG } from '../../constants';

export const REGISTERED_PROMPT_CONTENT_TAG_KEY = 'mlflow.prompt.text';
// Tag key used to store the run ID associated with a single prompt version
export const REGISTERED_PROMPT_SOURCE_RUN_ID = 'mlflow.prompt.run_id';
// Tak key used to store comma-separated run IDs associated with a prompt
export const REGISTERED_PROMPT_SOURCE_RUN_IDS = 'mlflow.prompt.run_ids';
export const IS_PROMPT_TAG_NAME = 'mlflow.prompt.is_prompt';
export const IS_PROMPT_TAG_VALUE = 'true';
export const PROMPT_TYPE_TEXT = 'text' as const;
export const PROMPT_TYPE_CHAT = 'chat' as const;
export const PROMPT_TYPE_TAG_KEY = '_mlflow_prompt_type';
// Tag key used to store comma-separated experiment IDs associated with a prompt
export const PROMPT_EXPERIMENT_IDS_TAG_KEY = '_mlflow_experiment_ids';
// Tag key used to store model config as JSON string (must match backend)
export const PROMPT_MODEL_CONFIG_TAG_KEY = '_mlflow_prompt_model_config';

export const MODEL_CONFIG_FIELD_LABELS: Record<Exclude<keyof PromptModelConfig, 'extra_params'>, string> = {
  provider: 'Provider',
  model_name: 'Model',
  temperature: 'Temperature',
  max_tokens: 'Max Tokens',
  top_p: 'Top P',
  top_k: 'Top K',
  frequency_penalty: 'Frequency Penalty',
  presence_penalty: 'Presence Penalty',
  stop_sequences: 'Stop Sequences',
} as const;

// Query parameter name for specifying prompt version in URLs
export const PROMPT_VERSION_QUERY_PARAM = 'promptVersion';

export type PromptsTableMetadata = {
  onEditTags: (editedEntity: RegisteredPrompt) => void;
  experimentId?: string;
};
export type PromptsVersionsTableMetadata = {
  showEditAliasesModal: (versionNumber: string) => void;
  aliasesByVersion: Record<string, string[]>;
  registeredPrompt: RegisteredPrompt;
};

export enum PromptVersionsTableMode {
  PREVIEW = 'preview',
  COMPARE = 'compare',
}

export const getPromptContentTagValue = (promptVersion: RegisteredPromptVersion) => {
  return promptVersion?.tags?.find((tag) => tag.key === REGISTERED_PROMPT_CONTENT_TAG_KEY)?.value;
};

export const isChatPrompt = (promptVersion?: RegisteredPromptVersion): boolean => {
  const tagValue = promptVersion?.tags?.find((tag) => tag.key === PROMPT_TYPE_TAG_KEY)?.value;
  return tagValue === PROMPT_TYPE_CHAT;
};

const isPromptChatMessage = (value: any): value is ChatPromptMessage => {
  return value && typeof value === 'object' && typeof value.role === 'string' && typeof value.content === 'string';
};

const isPromptChatMessages = (value: unknown): value is ChatPromptMessage[] => {
  return Array.isArray(value) && value.every((item) => isPromptChatMessage(item));
};

export const getChatPromptMessagesFromValue = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const parsedValue = parseJSONSafe(value);
  if (isPromptChatMessages(parsedValue)) {
    return parsedValue;
  }

  return undefined;
};

export const parseLinkedPromptsFromRunTags = (
  tags: Record<string, KeyValueEntity>,
): { name: string; version: string }[] => {
  const linkedPromptsTag = tags[MLFLOW_LINKED_PROMPTS_TAG];
  if (!linkedPromptsTag || !linkedPromptsTag.value) {
    return [];
  }

  try {
    const promptVersions = JSON.parse(linkedPromptsTag.value);
    if (Array.isArray(promptVersions)) {
      return promptVersions.filter(
        (prompt: any) => prompt && typeof prompt.name === 'string' && typeof prompt.version === 'string',
      );
    }
  } catch (error) {
    // do nothing, just don't display any linked prompts
  }

  return [];
};

/**
 * Builds a filter clause from a search string.
 * If the search string contains SQL-like keywords (ILIKE, LIKE, =, !=),
 * it's treated as a raw filter query. Otherwise, it's treated as a simple
 * name search and wrapped with ILIKE pattern matching.
 *
 * @param searchFilter - The search string to process
 * @returns The filter clause, or an empty string if searchFilter is empty
 */
export const buildSearchFilterClause = (searchFilter?: string): string => {
  if (!searchFilter) {
    return '';
  }

  // Check if the search filter looks like a SQL-like query
  // If so, treat it as a raw filter query; otherwise, treat it as a simple name search
  const sqlKeywordPattern = /(\s+(ILIKE|LIKE)\s+)|=|!=/i;

  if (sqlKeywordPattern.test(searchFilter)) {
    // User provided a SQL-like filter, use it directly
    return searchFilter;
  } else {
    // Simple name search
    return `name ILIKE '%${searchFilter}%'`;
  }
};

/**
 * Parse model config from tag value (JSON string).
 * Returns undefined if tag doesn't exist or JSON parsing fails.
 */
export const getModelConfigFromTags = (tags?: KeyValueEntity[]): PromptModelConfig | undefined => {
  const configTag = tags?.find((tag) => tag.key === PROMPT_MODEL_CONFIG_TAG_KEY);
  if (!configTag?.value) {
    return undefined;
  }

  try {
    return JSON.parse(configTag.value) as PromptModelConfig;
  } catch (error) {
    console.error('Failed to parse model config:', error);
    return undefined;
  }
};

/**
 * Convert form data to backend model config format.
 * Returns undefined if no fields have values.
 */
export const formDataToModelConfig = (formData: PromptModelConfigFormData): PromptModelConfig | undefined => {
  const hasAnyValue = Object.values(formData).some((v) => !!v);
  if (!hasAnyValue) {
    return undefined;
  }

  const config: PromptModelConfig = {};

  const provider = formData.provider?.trim();
  if (provider) {
    config.provider = provider;
  }
  const modelName = formData.modelName?.trim();
  if (modelName) {
    config.model_name = modelName;
  }
  if (formData.temperature?.trim()) {
    const temp = parseFloat(formData.temperature);
    if (!isNaN(temp)) config.temperature = temp;
  }
  if (formData.maxTokens?.trim()) {
    const tokens = parseInt(formData.maxTokens, 10);
    if (!isNaN(tokens)) config.max_tokens = tokens;
  }
  if (formData.topP?.trim()) {
    const topP = parseFloat(formData.topP);
    if (!isNaN(topP)) config.top_p = topP;
  }
  if (formData.topK?.trim()) {
    const topK = parseInt(formData.topK, 10);
    if (!isNaN(topK)) config.top_k = topK;
  }
  if (formData.frequencyPenalty?.trim()) {
    const freqPenalty = parseFloat(formData.frequencyPenalty);
    if (!isNaN(freqPenalty)) config.frequency_penalty = freqPenalty;
  }
  if (formData.presencePenalty?.trim()) {
    const presPenalty = parseFloat(formData.presencePenalty);
    if (!isNaN(presPenalty)) config.presence_penalty = presPenalty;
  }
  if (formData.stopSequences?.trim()) {
    // Split by comma and trim each value
    const sequences = formData.stopSequences
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (sequences.length > 0) config.stop_sequences = sequences;
  }

  return Object.keys(config).length > 0 ? config : undefined;
};

/**
 * Convert backend model config to form data format.
 * Returns empty object if config is undefined.
 */
export const modelConfigToFormData = (config?: PromptModelConfig): PromptModelConfigFormData => {
  if (!config) {
    return {};
  }

  return {
    provider: config.provider ?? '',
    modelName: config.model_name ?? '',
    temperature: config.temperature !== undefined ? String(config.temperature) : '',
    maxTokens: config.max_tokens !== undefined ? String(config.max_tokens) : '',
    topP: config.top_p !== undefined ? String(config.top_p) : '',
    topK: config.top_k !== undefined ? String(config.top_k) : '',
    frequencyPenalty: config.frequency_penalty !== undefined ? String(config.frequency_penalty) : '',
    presencePenalty: config.presence_penalty !== undefined ? String(config.presence_penalty) : '',
    stopSequences: config.stop_sequences ? config.stop_sequences.join(', ') : '',
  };
};

/**
 * Validate model config form values.
 * Returns an object with field names as keys and error messages as values.
 */
export const validateModelConfig = (formData: PromptModelConfigFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (formData['temperature']?.trim()) {
    const temp = parseFloat(formData['temperature']);
    if (isNaN(temp) || temp < 0) {
      errors['temperature'] = 'Temperature must be a number >= 0';
    }
  }

  if (formData['maxTokens']?.trim()) {
    const tokens = parseInt(formData['maxTokens'], 10);
    if (isNaN(tokens) || tokens <= 0) {
      errors['maxTokens'] = 'Max tokens must be an integer > 0';
    }
  }

  if (formData['topP']?.trim()) {
    const topP = parseFloat(formData['topP']);
    if (isNaN(topP) || topP < 0 || topP > 1) {
      errors['topP'] = 'Top P must be a number between 0 and 1';
    }
  }

  if (formData['topK']?.trim()) {
    const topK = parseInt(formData['topK'], 10);
    if (isNaN(topK) || topK <= 0) {
      errors['topK'] = 'Top K must be an integer > 0';
    }
  }

  if (formData['frequencyPenalty']?.trim()) {
    const freqPenalty = parseFloat(formData['frequencyPenalty']);
    if (isNaN(freqPenalty) || freqPenalty < -2 || freqPenalty > 2) {
      errors['frequencyPenalty'] = 'Frequency penalty must be a number between -2 and 2';
    }
  }

  if (formData['presencePenalty']?.trim()) {
    const presPenalty = parseFloat(formData['presencePenalty']);
    if (isNaN(presPenalty) || presPenalty < -2 || presPenalty > 2) {
      errors['presencePenalty'] = 'Presence penalty must be a number between -2 and 2';
    }
  }

  return errors;
};
```

--------------------------------------------------------------------------------

---[FILE: ChatMessageCreator.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/ChatMessageCreator.test.tsx

```typescript
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { IntlProvider } from 'react-intl';
import { DesignSystemProvider } from '@databricks/design-system';
import { ChatMessageCreator } from './ChatMessageCreator';

describe('ChatMessageCreator', () => {
  const renderComponent = () => {
    const Wrapper = () => {
      const methods = useForm({ defaultValues: { messages: [{ role: 'user', content: '' }] } });
      return (
        <IntlProvider locale="en">
          <DesignSystemProvider>
            <FormProvider {...methods}>
              <ChatMessageCreator name="messages" />
            </FormProvider>
          </DesignSystemProvider>
        </IntlProvider>
      );
    };
    render(<Wrapper />);
  };

  it('allows adding and removing messages', async () => {
    renderComponent();
    expect(screen.getAllByPlaceholderText('role')).toHaveLength(1);

    await userEvent.click(screen.getAllByRole('button', { name: 'Add message' })[0]);
    expect(screen.getAllByPlaceholderText('role')).toHaveLength(2);

    await userEvent.click(screen.getAllByRole('button', { name: 'Remove message' })[1]);
    expect(screen.getAllByPlaceholderText('role')).toHaveLength(1);
  });

  it('supports custom roles', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('role');
    await userEvent.clear(input);
    await userEvent.type(input, 'wizard');
    expect(input).toHaveValue('wizard');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: ChatMessageCreator.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/ChatMessageCreator.tsx
Signals: React

```typescript
import {
  Button,
  PlusIcon,
  TrashIcon,
  RHFControlledComponents,
  useDesignSystemTheme,
  FormUI,
  TypeaheadComboboxInput,
  TypeaheadComboboxMenu,
  TypeaheadComboboxMenuItem,
  TypeaheadComboboxRoot,
  useComboboxState,
} from '@databricks/design-system';
import { Fragment } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import type { ChatPromptMessage } from '../types';

const SUGGESTED_ROLES = ['system', 'user', 'assistant'];

const ChatRoleTypeaheadField = ({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder: string;
}) => {
  const comboboxState = useComboboxState<string>({
    componentId: id,
    items: SUGGESTED_ROLES,
    allItems: SUGGESTED_ROLES,
    setItems: () => {},
    setInputValue: (val) => {
      if (typeof val === 'string') {
        onChange(val);
      }
    },
    multiSelect: false,
    allowNewValue: true,
    preventUnsetOnBlur: true,
    itemToString: (item) => item ?? '',
    matcher: (item, query) => item?.toLowerCase().includes(query.toLowerCase()) ?? false,
    formValue: value ?? '',
    initialInputValue: value ?? '',
    formOnChange: (item) => {
      if (typeof item === 'string') {
        onChange(item);
      } else if (!item) {
        onChange('');
      }
    },
  });

  return (
    <TypeaheadComboboxRoot id={id} comboboxState={comboboxState}>
      <TypeaheadComboboxInput
        placeholder={placeholder}
        comboboxState={comboboxState}
        formOnChange={(item) => {
          if (typeof item === 'string') {
            onChange(item);
          } else if (!item) {
            onChange('');
          }
        }}
        onBlur={onBlur}
        allowClear
        showComboboxToggleButton
      />
      <TypeaheadComboboxMenu comboboxState={comboboxState} matchTriggerWidth>
        {SUGGESTED_ROLES.map((role, roleIndex) => (
          <TypeaheadComboboxMenuItem key={role} item={role} index={roleIndex} comboboxState={comboboxState}>
            {role}
          </TypeaheadComboboxMenuItem>
        ))}
      </TypeaheadComboboxMenu>
    </TypeaheadComboboxRoot>
  );
};

/**
 * Provides a small UI for composing chat-style prompts as a list of role/content pairs.
 */
export const ChatMessageCreator = ({ name }: { name: string }) => {
  const { control, formState } = useFormContext<{ [key: string]: ChatPromptMessage[] }>();
  const { fields, insert, remove, replace } = useFieldArray({ control, name });
  const { theme } = useDesignSystemTheme();
  const { formatMessage } = useIntl();

  const addMessageAfter = (index: number) => insert(index + 1, { role: 'user', content: '' });

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
      {fields.map((field, index) => (
        <div
          key={field.id}
          css={{ display: 'grid', gridTemplateColumns: '120px 1fr auto auto', gap: theme.spacing.sm }}
        >
          <Fragment>
            <Controller
              control={control}
              name={`${name}.${index}.role`}
              render={({ field: { value, onChange, onBlur } }) => (
                <ChatRoleTypeaheadField
                  id={`mlflow.prompts.chat_creator.role_${index}`}
                  placeholder={formatMessage({
                    defaultMessage: 'role',
                    description: 'Placeholder for chat message role input',
                  })}
                  value={value ?? ''}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Fragment>
          <RHFControlledComponents.TextArea
            componentId="mlflow.prompts.chat_creator.content"
            name={`${name}.${index}.content`}
            control={control}
            autoSize={{ minRows: 1, maxRows: 6 }}
            css={{ width: '100%' }}
          />
          <Button
            componentId="mlflow.prompts.chat_creator.add_after"
            type="tertiary"
            icon={<PlusIcon />}
            aria-label={formatMessage({
              defaultMessage: 'Add message',
              description: 'Button to insert a new chat message row',
            })}
            onClick={() => addMessageAfter(index)}
          />
          <Button
            componentId="mlflow.prompts.chat_creator.remove"
            type="tertiary"
            icon={<TrashIcon />}
            aria-label={formatMessage({
              defaultMessage: 'Remove message',
              description: 'Button to remove a chat message row',
            })}
            onClick={() => remove(index)}
            disabled={fields.length === 1}
          />
        </div>
      ))}
      {formState.errors?.[name] && <FormUI.Message type="error" message={(formState.errors as any)[name]?.message} />}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelConfigForm.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/ModelConfigForm.tsx

```typescript
import {
  FormUI,
  InfoSmallIcon,
  Popover,
  RHFControlledComponents,
  Typography,
  useDesignSystemTheme,
} from '@databricks/design-system';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';

export const ModelConfigForm = () => {
  const { theme } = useDesignSystemTheme();
  const intl = useIntl();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const getFieldName = (name: string) => `modelConfig.${name}`;

  /**
   * Gets validation error for a model config field.
   * Errors are stored as errors.modelConfig.fieldName by the parent form validation.
   */
  const getError = (name: string) => {
    return (errors?.['modelConfig'] as any)?.[name];
  };

  return (
    <div
      css={{
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.general.borderRadiusBase,
        padding: theme.spacing.md,
      }}
    >
      <div css={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginBottom: theme.spacing.sm }}>
        <Typography.Title level={4} css={{ marginBottom: 0 }}>
          <FormattedMessage
            defaultMessage="Model Configuration"
            description="Section header for model configuration in prompt creation"
          />
        </Typography.Title>
        <Popover.Root componentId="mlflow.prompts.model_config.help">
          <Popover.Trigger aria-label="Model configuration help" css={{ border: 0, background: 'none', padding: 0 }}>
            <InfoSmallIcon />
          </Popover.Trigger>
          <Popover.Content align="start">
            <FormattedMessage
              defaultMessage="Model configuration stores the LLM settings associated with this prompt."
              description="Help text explaining model configuration purpose"
            />
            <Popover.Arrow />
          </Popover.Content>
        </Popover.Root>
      </div>

      <div css={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
        <div>
          <FormUI.Label htmlFor="mlflow.prompts.model_config.provider">
            <FormattedMessage defaultMessage="Provider" description="Label for model provider input" />
          </FormUI.Label>
          <RHFControlledComponents.Input
            control={control}
            id="mlflow.prompts.model_config.provider"
            componentId="mlflow.prompts.model_config.provider"
            name={getFieldName('provider')}
            placeholder={intl.formatMessage({
              defaultMessage: 'e.g., openai, anthropic, google',
              description: 'Placeholder for provider input',
            })}
          />
        </div>

        <div>
          <FormUI.Label htmlFor="mlflow.prompts.model_config.modelName">
            <FormattedMessage
              defaultMessage="Model Name"
              description="Label for model name input in model config form"
            />
          </FormUI.Label>
          <RHFControlledComponents.Input
            control={control}
            id="mlflow.prompts.model_config.modelName"
            componentId="mlflow.prompts.model_config.modelName"
            name={getFieldName('modelName')}
            placeholder={intl.formatMessage({
              defaultMessage: 'e.g., gpt-4, claude-3-opus',
              description: 'Placeholder for model name input',
            })}
          />
        </div>

        {/* 2 Column Grid for Parameters */}
        <div css={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.sm }}>
          {/* Temperature */}
          <div>
            <FormUI.Label htmlFor="mlflow.prompts.model_config.temperature">
              <FormattedMessage defaultMessage="Temperature" description="Label for temperature input" />
            </FormUI.Label>
            <RHFControlledComponents.Input
              control={control}
              id="mlflow.prompts.model_config.temperature"
              componentId="mlflow.prompts.model_config.temperature"
              name={getFieldName('temperature')}
              validationState={getError('temperature') ? 'error' : undefined}
            />
            {getError('temperature') && <FormUI.Message type="error" message={getError('temperature')?.message} />}
          </div>

          {/* Max Tokens */}
          <div>
            <FormUI.Label htmlFor="mlflow.prompts.model_config.maxTokens">
              <FormattedMessage defaultMessage="Max Tokens" description="Label for max tokens input" />
            </FormUI.Label>
            <RHFControlledComponents.Input
              control={control}
              id="mlflow.prompts.model_config.maxTokens"
              componentId="mlflow.prompts.model_config.maxTokens"
              name={getFieldName('maxTokens')}
              validationState={getError('maxTokens') ? 'error' : undefined}
            />
            {getError('maxTokens') && <FormUI.Message type="error" message={getError('maxTokens')?.message} />}
          </div>

          {/* Top P */}
          <div>
            <FormUI.Label htmlFor="mlflow.prompts.model_config.topP">
              <FormattedMessage defaultMessage="Top P" description="Label for top P input" />
            </FormUI.Label>
            <RHFControlledComponents.Input
              control={control}
              id="mlflow.prompts.model_config.topP"
              componentId="mlflow.prompts.model_config.topP"
              name={getFieldName('topP')}
              validationState={getError('topP') ? 'error' : undefined}
            />
            {getError('topP') && <FormUI.Message type="error" message={getError('topP')?.message} />}
          </div>

          {/* Top K */}
          <div>
            <FormUI.Label htmlFor="mlflow.prompts.model_config.topK">
              <FormattedMessage defaultMessage="Top K" description="Label for top K input" />
            </FormUI.Label>
            <RHFControlledComponents.Input
              control={control}
              id="mlflow.prompts.model_config.topK"
              componentId="mlflow.prompts.model_config.topK"
              name={getFieldName('topK')}
              validationState={getError('topK') ? 'error' : undefined}
            />
            {getError('topK') && <FormUI.Message type="error" message={getError('topK')?.message} />}
          </div>

          {/* Frequency Penalty */}
          <div>
            <FormUI.Label htmlFor="mlflow.prompts.model_config.frequencyPenalty">
              <FormattedMessage defaultMessage="Frequency Penalty" description="Label for frequency penalty input" />
            </FormUI.Label>
            <RHFControlledComponents.Input
              control={control}
              id="mlflow.prompts.model_config.frequencyPenalty"
              componentId="mlflow.prompts.model_config.frequencyPenalty"
              name={getFieldName('frequencyPenalty')}
              validationState={getError('frequencyPenalty') ? 'error' : undefined}
            />
            {getError('frequencyPenalty') && (
              <FormUI.Message type="error" message={getError('frequencyPenalty')?.message} />
            )}
          </div>

          {/* Presence Penalty */}
          <div>
            <FormUI.Label htmlFor="mlflow.prompts.model_config.presencePenalty">
              <FormattedMessage defaultMessage="Presence Penalty" description="Label for presence penalty input" />
            </FormUI.Label>
            <RHFControlledComponents.Input
              control={control}
              id="mlflow.prompts.model_config.presencePenalty"
              componentId="mlflow.prompts.model_config.presencePenalty"
              name={getFieldName('presencePenalty')}
              validationState={getError('presencePenalty') ? 'error' : undefined}
            />
            {getError('presencePenalty') && (
              <FormUI.Message type="error" message={getError('presencePenalty')?.message} />
            )}
          </div>
        </div>

        {/* Stop Sequences */}
        <div>
          <FormUI.Label htmlFor="mlflow.prompts.model_config.stopSequences">
            <FormattedMessage
              defaultMessage="Stop Sequences (comma-separated)"
              description="Label for stop sequences input"
            />
          </FormUI.Label>
          <RHFControlledComponents.Input
            control={control}
            id="mlflow.prompts.model_config.stopSequences"
            componentId="mlflow.prompts.model_config.stopSequences"
            name={getFieldName('stopSequences')}
            placeholder={intl.formatMessage({
              defaultMessage: 'e.g., END, ###, STOP',
              description: 'Placeholder for stop sequences input',
            })}
            validationState={getError('stopSequences') ? 'error' : undefined}
          />
          {getError('stopSequences') && <FormUI.Message type="error" message={getError('stopSequences')?.message} />}
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: OptimizeModal.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/OptimizeModal.test.tsx

```typescript
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { DesignSystemProvider } from '@databricks/design-system';
import { OptimizeModal } from './OptimizeModal';

describe('OptimizeModal', () => {
  const renderComponent = (props: {
    visible: boolean;
    promptName: string;
    promptVersion: string;
    onCancel: jest.Mock;
  }) => {
    return render(
      <IntlProvider locale="en">
        <DesignSystemProvider>
          <OptimizeModal {...props} />
        </DesignSystemProvider>
      </IntlProvider>,
    );
  };

  it('renders modal when visible is true', () => {
    const onCancel = jest.fn();
    renderComponent({
      visible: true,
      promptName: 'my-prompt',
      promptVersion: '1',
      onCancel,
    });

    expect(screen.getByText('Optimize Prompt')).toBeInTheDocument();
    expect(
      screen.getByText("Here's how to optimize your prompt with your dataset in your Python code:"),
    ).toBeInTheDocument();
  });

  it('does not render modal when visible is false', () => {
    const onCancel = jest.fn();
    renderComponent({
      visible: false,
      promptName: 'my-prompt',
      promptVersion: '1',
      onCancel,
    });

    expect(screen.queryByText('Optimize Prompt')).not.toBeInTheDocument();
  });

  it('displays pip install command', () => {
    const onCancel = jest.fn();
    renderComponent({
      visible: true,
      promptName: 'my-prompt',
      promptVersion: '1',
      onCancel,
    });

    expect(screen.getByText(/pip install -U 'mlflow>=3.5.0' 'dspy>=3.0.0' openai/)).toBeInTheDocument();
  });

  it('displays Python code with interpolated prompt name and version', () => {
    const onCancel = jest.fn();
    renderComponent({
      visible: true,
      promptName: 'my-prompt',
      promptVersion: '2',
      onCancel,
    });

    expect(screen.getAllByText('prompts:/my-prompt/2', { exact: false })).toHaveLength(2);
  });

  it('calls onCancel when modal is closed', async () => {
    const onCancel = jest.fn();
    renderComponent({
      visible: true,
      promptName: 'my-prompt',
      promptVersion: '1',
      onCancel,
    });

    // Find and click the close button (X button in the modal header)
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: OptimizeModal.tsx]---
Location: mlflow-master/mlflow/server/js/src/experiment-tracking/pages/prompts/components/OptimizeModal.tsx

```typescript
import { CopyIcon, Modal, Typography, useDesignSystemTheme } from '@databricks/design-system';
import { CodeSnippet, type CodeSnippetLanguage } from '@databricks/web-shared/snippet';
import { CopyButton } from '@mlflow/mlflow/src/shared/building_blocks/CopyButton';
import { FormattedMessage } from 'react-intl';

interface Props {
  visible: boolean;
  promptName: string;
  promptVersion: string;
  onCancel: () => void;
}

const CodeSnippetWithCopy = ({ code, language }: { code: string; language: CodeSnippetLanguage }) => {
  const { theme } = useDesignSystemTheme();

  return (
    <div css={{ position: 'relative' }}>
      <CopyButton
        css={{ zIndex: 1, position: 'absolute', top: theme.spacing.xs, right: theme.spacing.xs }}
        showLabel={false}
        copyText={code}
        icon={<CopyIcon />}
      />
      <CodeSnippet
        language={language}
        showLineNumbers={false}
        style={{
          padding: theme.spacing.sm,
          color: theme.colors.textPrimary,
          backgroundColor: theme.colors.backgroundSecondary,
          whiteSpace: 'pre-wrap',
        }}
        wrapLongLines
      >
        {code}
      </CodeSnippet>
    </div>
  );
};

export const OptimizeModal = ({ visible, promptName, promptVersion, onCancel }: Props) => {
  const { theme } = useDesignSystemTheme();

  const bashCode = `pip install -U 'mlflow>=3.5.0' 'dspy>=3.0.0' openai`;

  const pythonCode = `import os
from typing import Any
import openai
import mlflow
from mlflow.genai.scorers import Correctness, Safety
from mlflow.genai.optimize import GepaPromptOptimizer
from mlflow.genai import datasets

EVAL_DATASET_NAME='<YOUR DATASET NAME>' # Replace with your dataset
dataset = datasets.get_dataset(EVAL_DATASET_NAME)

# Define your prediction function
def predict_fn(**kwargs) -> str:
    prompt = mlflow.genai.load_prompt("prompts:/${promptName}/${promptVersion}")
    completion = openai.OpenAI().chat.completions.create(
        model="gpt-5-mini", # Replace with your model
        messages=[{"role": "user", "content": prompt.format(**kwargs)}],
    )
    return completion.choices[0].message.content

# Optimize your prompt
result = mlflow.genai.optimize_prompts(
    predict_fn=predict_fn,
    train_data=dataset,
    prompt_uris=["prompts:/${promptName}/${promptVersion}"],
    optimizer=GepaPromptOptimizer(reflection_model="openai:/gpt-5"),
    scorers=[Correctness(model="openai:/gpt-5")), Safety(model="openai:/gpt-5"))],
)

# Open the prompt registry page to check the new prompt
print(f"The new prompt URI: {result.optimized_prompts[0].uri}")`;

  return (
    <Modal
      componentId="mlflow.experiment.prompt.optimize-modal"
      title={<FormattedMessage defaultMessage="Optimize Prompt" description="Title of the optimize prompt modal" />}
      footer={null}
      visible={visible}
      onCancel={onCancel}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
        <Typography.Paragraph>
          <FormattedMessage
            defaultMessage="Here's how to optimize your prompt with your dataset in your Python code:"
            description="Description of how to optimize a prompt with a dataset in Python"
          />
        </Typography.Paragraph>
        <CodeSnippetWithCopy code={bashCode} language="text" />
        <CodeSnippetWithCopy code={pythonCode} language="python" />
        <Typography.Paragraph>
          <FormattedMessage
            defaultMessage="See {mlflowLink} for more details."
            description="Link to MLflow prompt optimization documentation"
            values={{
              mlflowLink: (
                <Typography.Link
                  componentId="mlflow.experiment.prompt.optimize-modal.mlflow-link"
                  target="_blank"
                  href="https://mlflow.org/docs/latest/genai/prompt-registry/optimize-prompts/"
                >
                  <FormattedMessage defaultMessage="MLflow documentation" description="Link to MLflow documentation" />
                </Typography.Link>
              ),
            }}
          />
        </Typography.Paragraph>
      </div>
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

````
