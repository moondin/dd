---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 647
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 647 of 991)

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

---[FILE: SpanNameDetailViewLink.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/SpanNameDetailViewLink.tsx

```typescript
import { Typography, useDesignSystemTheme } from '@databricks/design-system';

import type { ModelTraceSpanNode } from '../ModelTrace.types';
import { ModelSpanType } from '../ModelTrace.types';
import { getIconTypeForSpan, getSpanExceptionCount } from '../ModelTraceExplorer.utils';
import { ModelTraceExplorerIcon } from '../ModelTraceExplorerIcon';
import { useModelTraceExplorerViewState } from '../ModelTraceExplorerViewStateContext';

export const SpanNameDetailViewLink = ({ node }: { node: ModelTraceSpanNode }) => {
  const { theme } = useDesignSystemTheme();
  const { setSelectedNode, setActiveView, setShowTimelineTreeGantt } = useModelTraceExplorerViewState();
  const hasException = getSpanExceptionCount(node) > 0;

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        marginRight: theme.spacing.xs,
        gap: theme.spacing.xs,
        '&:hover': {
          textDecoration: 'underline',
          textDecorationColor: hasException
            ? theme.colors.actionDangerDefaultTextDefault
            : theme.colors.actionDefaultTextDefault,
          cursor: 'pointer',
        },
      }}
      onClick={() => {
        setSelectedNode(node);
        setActiveView('detail');
        setShowTimelineTreeGantt(false);
      }}
    >
      <ModelTraceExplorerIcon
        hasException={hasException}
        type={getIconTypeForSpan(node.type ?? ModelSpanType.UNKNOWN)}
      />
      <Typography.Text
        color={hasException ? 'error' : 'primary'}
        css={{ marginLeft: theme.spacing.xs, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {node.title}
      </Typography.Text>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/utils.tsx

```typescript
import { SparkleIcon, UserIcon, CodeIcon } from '@databricks/design-system';

import type { Assessment } from '../ModelTrace.types';

export const getAssessmentValue = (assessment: Assessment) => {
  if ('feedback' in assessment && assessment.feedback) {
    return assessment.feedback.value;
  }

  if ('expectation' in assessment) {
    if (assessment.expectation && 'value' in assessment.expectation) {
      return assessment.expectation.value;
    }
    return assessment.expectation.serialized_value.value;
  }

  return undefined;
};

export const getSourceIcon = (source: Assessment['source']) => {
  switch (source.source_type) {
    case 'HUMAN':
      return UserIcon;
    case 'LLM_JUDGE':
      return SparkleIcon;
    default:
      return CodeIcon;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: BooleanInput.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/components/BooleanInput.tsx

```typescript
import { SegmentedControlButton, SegmentedControlGroup } from '@databricks/design-system';

import type { AssessmentValueInputFieldProps } from './types';

export const BooleanInput = ({
  value,
  valueError,
  setValue,
  setValueError,
  isSubmitting,
}: AssessmentValueInputFieldProps) => {
  return (
    <div>
      <SegmentedControlGroup
        data-testid="assessment-value-boolean-input"
        componentId="shared.model-trace-explorer.assessment-value-boolean-input"
        name="shared.model-trace-explorer.assessment-value-boolean-input"
        value={value}
        disabled={isSubmitting}
        onChange={(e) => {
          setValue(e.target.value);
          setValueError(null);
        }}
      >
        <SegmentedControlButton value>True</SegmentedControlButton>
        <SegmentedControlButton value={false}>False</SegmentedControlButton>
      </SegmentedControlGroup>
      {valueError && <div css={{ marginTop: '8px', color: 'red' }}>{valueError}</div>}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: JsonInput.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/components/JsonInput.tsx

```typescript
import { FormUI, Input } from '@databricks/design-system';

import type { AssessmentValueInputFieldProps } from './types';

export const JsonInput = ({
  value,
  valueError,
  setValue,
  setValueError,
  isSubmitting,
}: AssessmentValueInputFieldProps) => {
  return (
    <div>
      <Input.TextArea
        data-testid="assessment-value-json-input"
        componentId="shared.model-trace-explorer.assessment-edit-value-string-input"
        value={String(value)}
        autoSize={{ minRows: 1, maxRows: 5 }}
        onKeyDown={(e) => e.stopPropagation()}
        onChange={(e) => {
          setValue(e.target.value);
          setValueError(null);
        }}
        validationState={valueError ? 'error' : undefined}
        disabled={isSubmitting}
      />
      {valueError && (
        <FormUI.Message
          id="shared.model-trace-explorer.assessment-edit-value-json-error"
          message={valueError}
          type="error"
        />
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: NumericInput.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/components/NumericInput.tsx

```typescript
import { Input } from '@databricks/design-system';

import type { AssessmentValueInputFieldProps } from './types';

export const NumericInput = ({
  value,
  valueError,
  setValue,
  setValueError,
  isSubmitting,
}: AssessmentValueInputFieldProps) => {
  return (
    <div>
      <Input
        data-testid="assessment-value-number-input"
        componentId="shared.model-trace-explorer.assessment-value-number-input"
        value={String(value)}
        onKeyDown={(e) => e.stopPropagation()}
        onChange={(e) => {
          setValue(e.target.value ? Number(e.target.value) : '');
          setValueError(null);
        }}
        type="number"
        disabled={isSubmitting}
        allowClear
      />
      {valueError && <div css={{ marginTop: '8px', color: 'red' }}>{valueError}</div>}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: TextInput.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/components/TextInput.tsx

```typescript
import { Input } from '@databricks/design-system';

import type { AssessmentValueInputFieldProps } from './types';

export const TextInput = ({
  value,
  valueError,
  setValue,
  setValueError,
  isSubmitting,
}: AssessmentValueInputFieldProps) => {
  return (
    <div>
      <Input
        data-testid="assessment-value-string-input"
        componentId="shared.model-trace-explorer.assessment-value-string-input"
        value={String(value)}
        onKeyDown={(e) => e.stopPropagation()}
        onChange={(e) => {
          setValue(e.target.value);
          setValueError(null);
        }}
        disabled={isSubmitting}
        allowClear
      />
      {valueError && <div css={{ marginTop: '8px', color: 'red' }}>{valueError}</div>}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: types.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/assessments-pane/components/types.tsx

```typescript
// common types for all assessment value input fields
export type AssessmentValueInputFieldProps = {
  value: string | number | boolean;
  valueError?: React.ReactNode;
  setValue: (value: string | number | boolean) => void;
  setValueError: (error: string | null) => void;
  isSubmitting: boolean;
};
```

--------------------------------------------------------------------------------

---[FILE: anthropic.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/anthropic.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';

const MOCK_ANTHROPIC_INPUT = {
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'url',
            url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg',
          },
        },
        {
          type: 'text',
          text: 'Describe this image.',
        },
      ],
    },
  ],
  model: 'claude-sonnet-4-20250514',
};

const MOCK_ANTHROPIC_OUTPUT = {
  id: 'msg_01QU6qxHJ25f73LPeRMF94vd',
  content: [
    {
      citations: null,
      text: "This is a close-up macro photograph of an ant captured in a defensive or alert posture. The ant appears to be rearing up on its hind legs with its front legs raised, creating a dramatic silhouette against the blurred background. The ant has a dark, segmented body with the characteristic three main body parts (head, thorax, and abdomen) clearly visible. Its long, thin antennae are extended forward, and its legs are positioned in what appears to be a threatening or defensive stance.\n\nThe photograph is taken at ground level, showing the ant on what looks like a concrete or stone surface with a shallow depth of field that creates a soft, warm-toned bokeh effect in the background. The lighting emphasizes the ant's form and creates nice contrast, making the subject stand out prominently. This type of behavior is typical of certain ant species when they feel threatened or are defending their territory.",
      type: 'text',
    },
  ],
  model: 'claude-sonnet-4-20250514',
  role: 'assistant',
  stop_reason: 'end_turn',
  stop_sequence: null,
  type: 'message',
  usage: {
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
    input_tokens: 1552,
    output_tokens: 194,
    server_tool_use: null,
    service_tier: 'standard',
  },
};

describe('normalizeConversation', () => {
  it('should handle anthropic input', () => {
    expect(normalizeConversation(MOCK_ANTHROPIC_INPUT, 'anthropic')).toEqual([
      expect.objectContaining({
        role: 'user',
        content: expect.stringMatching(/describe this image/i),
      }),
    ]);
  });

  it('should handle anthropic output', () => {
    expect(normalizeConversation(MOCK_ANTHROPIC_OUTPUT, 'anthropic')).toEqual([
      expect.objectContaining({
        content: expect.stringMatching(/this is a close-up macro photograph of an ant/i),
        role: 'assistant',
      }),
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: anthropic.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/anthropic.ts

```typescript
import { has, isArray, isNil, isObject, isString } from 'lodash';

import type { ModelTraceChatMessage, ModelTraceContentParts } from '../ModelTrace.types';
import { prettyPrintChatMessage } from '../ModelTraceExplorer.utils';

export type AnthropicMessagesInput = {
  messages: AnthropicMessageParam[];
};

export type AnthropicMessagesOutput = {
  id: string;
  content: AnthropicContentBlock[];
  role: 'assistant';
  type: 'message';
  // model: Model;
  // stop_reason: StopReason | null;
  // stop_sequence: string | null;
  // usage: Usage;
};

type AnthropicContentBlock = AnthropicTextBlock | AnthropicToolUseBlock;
// | ThinkingBlock
// | RedactedThinkingBlock
// | ServerToolUseBlock
// | WebSearchToolResultBlock;

type AnthropicMessageParam = {
  content: string | AnthropicContentBlockParam[];
  role: 'user' | 'assistant';
};

type AnthropicContentBlockParam =
  | AnthropicTextBlockParam
  | AnthropicImageBlockParam
  | AnthropicToolUseBlockParam
  | AnthropicToolResultBlockParam;
// | DocumentBlockParam
// | ThinkingBlockParam
// | RedactedThinkingBlockParam
// | ServerToolUseBlockParam
// | WebSearchToolResultBlockParam;

type AnthropicTextBlockParam = {
  text: string;
  type: 'text';
};

type AnthropicTextBlock = {
  text: string;
  type: 'text';
};

type AnthropicImageBlockParam = {
  source: AnthropicBase64ImageSource | AnthropicURLImageSource;
  type: 'image';
};

type AnthropicBase64ImageSource = {
  type: 'base64';
  data: string;
  media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
};

type AnthropicURLImageSource = {
  type: 'url';
  url: string;
};

type AnthropicToolUseBlockParam = {
  id: string;
  input: Record<string, any>;
  name: string;
  type: 'tool_use';
};

type AnthropicToolUseBlock = {
  id: string;
  input: Record<string, any>;
  name: string;
  type: 'tool_use';
};

type AnthropicToolResultBlockParam = {
  content: string;
  tool_use_id: string;
  type: 'tool_result';
};

const isAnthropicContentBlockParam = (obj: unknown): obj is AnthropicContentBlockParam => {
  if (isNil(obj)) {
    return false;
  }

  if (has(obj, 'type')) {
    if (obj.type === 'text' && has(obj, 'text') && isString(obj.text)) {
      return true;
    }

    if (obj.type === 'image' && has(obj, 'source') && has(obj.source, 'type')) {
      if (
        obj.source.type === 'base64' &&
        has(obj.source, 'media_type') &&
        isString(obj.source.media_type) &&
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(obj.source.media_type) &&
        has(obj.source, 'data') &&
        isString(obj.source.data)
      ) {
        return true;
      }

      if (obj.source.type === 'url' && has(obj.source, 'url') && isString(obj.source.url)) {
        return true;
      }
    }

    if (obj.type === 'tool_use' && has(obj, 'id') && has(obj, 'name') && has(obj, 'input')) {
      return isString(obj.id) && isString(obj.name) && isObject(obj.input);
    }

    if (obj.type === 'tool_result' && has(obj, 'tool_use_id') && has(obj, 'content')) {
      return isString(obj.tool_use_id) && isString(obj.content);
    }
  }
  return false;
};

const isAnthropicMessageParam = (obj: unknown): obj is AnthropicMessageParam => {
  if (!isObject(obj)) {
    return false;
  }

  const hasRole = has(obj, 'role') && isString(obj.role) && ['user', 'assistant'].includes(obj.role);
  const hasContent =
    'content' in obj &&
    (isString(obj.content) || (isArray(obj.content) && obj.content.every(isAnthropicContentBlockParam)));

  return hasRole && hasContent;
};

const normalizeAnthropicContentBlockParam = (item: AnthropicContentBlockParam): ModelTraceContentParts => {
  switch (item.type) {
    case 'text': {
      return { type: 'text', text: item.text };
    }
    case 'image': {
      switch (item.source.type) {
        case 'base64': {
          return {
            type: 'image_url',
            image_url: { url: `data:${item.source.media_type};base64,${item.source.data}` },
          };
        }
        case 'url': {
          return { type: 'image_url', image_url: { url: item.source.url } };
        }
      }
    }
  }
  throw new Error(`Unsupported content block type: ${(item as any).type}`);
};

const processAnthropicMessageContent = (
  content: AnthropicContentBlockParam[],
): {
  messages: ModelTraceChatMessage[];
  textParts: ModelTraceContentParts[];
  toolCalls: any[];
} => {
  const messages: ModelTraceChatMessage[] = [];
  const textParts: ModelTraceContentParts[] = [];
  const toolCalls: any[] = [];

  for (const item of content) {
    if (item.type === 'text' || item.type === 'image') {
      textParts.push(normalizeAnthropicContentBlockParam(item));
    } else if (item.type === 'tool_use') {
      toolCalls.push({
        id: item.id,
        function: {
          name: item.name,
          arguments: JSON.stringify(item.input),
        },
      });
    } else if (item.type === 'tool_result') {
      messages.push({
        role: 'tool',
        tool_call_id: item.tool_use_id,
        content: item.content,
      });
    }
  }

  return { messages, textParts, toolCalls };
};

const processAnthropicMessage = (message: AnthropicMessageParam): ModelTraceChatMessage[] => {
  const messages: ModelTraceChatMessage[] = [];

  if (typeof message.content === 'string') {
    const chatMessage = prettyPrintChatMessage({
      type: 'message',
      content: message.content,
      role: message.role,
    });
    if (chatMessage) messages.push(chatMessage);
  } else {
    const { messages: toolMessages, textParts, toolCalls } = processAnthropicMessageContent(message.content);
    messages.push(...toolMessages);

    if (textParts.length > 0 || toolCalls.length > 0) {
      const chatMessage = prettyPrintChatMessage({
        type: 'message',
        content: textParts.length > 0 ? textParts : undefined,
        role: message.role,
        ...(toolCalls.length > 0 && { tool_calls: toolCalls }),
      });
      if (chatMessage) messages.push(chatMessage);
    }
  }

  return messages;
};

export const normalizeAnthropicChatInput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (!isObject(obj)) {
    return null;
  }

  if ('messages' in obj && isArray(obj.messages) && obj.messages.every(isAnthropicMessageParam)) {
    const messages: ModelTraceChatMessage[] = [];

    for (const message of obj.messages) {
      messages.push(...processAnthropicMessage(message));
    }

    return messages;
  }

  return null;
};

export const normalizeAnthropicChatOutput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (!isObject(obj)) {
    return null;
  }

  if (has(obj, 'type') && obj.type === 'message' && isAnthropicMessageParam(obj)) {
    return processAnthropicMessage(obj);
  }

  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: autogen.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/autogen.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';

const MOCK_AUTOGEN_INPUT = {
  messages: [
    {
      content: 'You are a helpful assistant.',
      type: 'SystemMessage',
    },
    {
      content: "Say 'Hello World!'",
      source: 'user',
      type: 'UserMessage',
    },
  ],
  tools: [],
  json_output: null,
  cancellation_token: '<autogen_core._cancellation_token.CancellationToken object at 0x161f644d0>',
};

const MOCK_AUTOGEN_OUTPUT = {
  finish_reason: 'stop',
  content: 'Hello World!',
  usage: {
    prompt_tokens: 23,
    completion_tokens: 3,
  },
  cached: false,
  logprobs: null,
  thought: null,
};

const MOCK_AUTOGEN_COMPLEX_INPUT = {
  messages: [
    {
      content: 'You are a helpful assistant that can use tools to get information.',
      type: 'SystemMessage',
    },
    {
      content: 'What is the weather like in Tokyo today?',
      source: 'user',
      type: 'UserMessage',
    },
    {
      content: [
        {
          id: 'tool_call_1',
          name: 'get_weather',
          arguments: '{"city": "Tokyo"}',
        },
      ],
      source: 'assistant',
      type: 'AssistantMessage',
    },
    {
      content: {
        weather: 'sunny',
        temperature: 25,
        humidity: 60,
      },
      source: 'function',
      type: 'FunctionMessage',
    },
  ],
  tools: [
    {
      name: 'get_weather',
      description: 'Get weather information for a city',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'The city name',
          },
        },
        required: ['city'],
      },
    },
  ],
  json_output: null,
  cancellation_token: '<autogen_core._cancellation_token.CancellationToken object at 0x161f644d1>',
};

describe('normalizeConversation', () => {
  it('handles an AutoGen request formats', () => {
    expect(normalizeConversation(MOCK_AUTOGEN_INPUT, 'autogen')).toEqual([
      expect.objectContaining({
        role: 'system',
        content: 'You are a helpful assistant.',
      }),
      expect.objectContaining({
        role: 'user',
        content: "Say 'Hello World!'",
      }),
    ]);
  });

  it('handles an AutoGen response formats', () => {
    expect(normalizeConversation(MOCK_AUTOGEN_OUTPUT, 'autogen')).toEqual([
      expect.objectContaining({
        content: 'Hello World!',
        role: 'assistant',
      }),
    ]);
  });

  it('handles an AutoGen complex input formats', () => {
    const result = normalizeConversation(MOCK_AUTOGEN_COMPLEX_INPUT, 'autogen');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(4);
    expect(result![0]).toEqual(
      expect.objectContaining({
        role: 'system',
        content: 'You are a helpful assistant that can use tools to get information.',
      }),
    );
    expect(result![1]).toEqual(
      expect.objectContaining({
        role: 'user',
        content: 'What is the weather like in Tokyo today?',
      }),
    );
    expect(result![2]).toEqual(
      expect.objectContaining({
        role: 'assistant',
        tool_calls: expect.arrayContaining([
          expect.objectContaining({
            id: 'tool_call_1',
            function: expect.objectContaining({
              name: 'get_weather',
              arguments: expect.stringContaining('"city": "Tokyo"'),
            }),
          }),
        ]),
      }),
    );
    expect(result![3]).toEqual(
      expect.objectContaining({
        role: 'user',
        content: '{"weather":"sunny","temperature":25,"humidity":60}',
      }),
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: autogen.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/autogen.ts

```typescript
import { compact, get, has, isArray, isNil, isObject, isString } from 'lodash';

import type { ModelTraceChatMessage } from '../ModelTrace.types';
import { prettyPrintChatMessage, prettyPrintToolCall } from '../ModelTraceExplorer.utils';

interface AutogenFunctionCall {
  id: string;
  name: string;
  arguments: string;
}

interface AutogenSystemMessage {
  source: 'system';
  content: string;
}

interface AutogenUserMessage {
  source: 'user';
  content: string | any[];
}

interface AutogenAssistantMessage {
  source: 'assistant';
  content: string | AutogenFunctionCall[];
}

interface AutogenFunctionExecutionResultMessage {
  source: 'function';
  content: any;
}

type AutogenMessage =
  | AutogenSystemMessage
  | AutogenUserMessage
  | AutogenAssistantMessage
  | AutogenFunctionExecutionResultMessage;

const isAutogenFunctionCall = (obj: unknown): obj is AutogenFunctionCall => {
  return isObject(obj) && isString(get(obj, 'id')) && isString(get(obj, 'name')) && isString(get(obj, 'arguments'));
};

const isAutogenMessage = (obj: unknown): obj is AutogenMessage => {
  if (!isObject(obj)) {
    return false;
  }

  // Handle messages with 'type' field (new format)
  const messageType = get(obj, 'type');
  if (messageType) {
    if (messageType === 'SystemMessage') {
      return isString(get(obj, 'content'));
    }
    if (messageType === 'UserMessage') {
      return has(obj, 'content') && has(obj, 'source');
    }
    if (messageType === 'AssistantMessage') {
      return has(obj, 'content') && has(obj, 'source');
    }
    if (messageType === 'FunctionMessage') {
      return has(obj, 'content') && has(obj, 'source');
    }
  }

  // Handle messages with 'source' field (old format)
  if (has(obj, 'source') && ['system', 'user', 'assistant', 'function'].includes(get(obj, 'source'))) {
    return has(obj, 'content');
  }

  return false;
};

const convertAssistantMessageToChatMessage = (
  content: string | AutogenFunctionCall[],
): ModelTraceChatMessage | null => {
  if (isString(content)) {
    return prettyPrintChatMessage({ type: 'message', content, role: 'assistant' });
  }

  if (isArray(content) && content.every(isAutogenFunctionCall)) {
    return {
      role: 'assistant',
      tool_calls: content.map((f) =>
        prettyPrintToolCall({
          id: f.id,
          function: {
            name: f.name,
            arguments: f.arguments,
          },
        }),
      ),
    };
  }

  return null;
};

const normalizeAutogenMessage = (message: any): ModelTraceChatMessage | null => {
  // Handle messages with 'type' field (new format)
  if (message.type === 'SystemMessage') {
    return prettyPrintChatMessage({ type: 'message', content: message.content, role: 'system' });
  }

  if (message.type === 'UserMessage') {
    if (isString(message.content)) {
      return prettyPrintChatMessage({ type: 'message', content: message.content, role: 'user' });
    }

    if (isArray(message.content)) {
      // Handle content that might be an array of text/image parts
      const textParts = message.content
        .filter((part: any) => isString(part) || (isObject(part) && (part as any).type === 'text'))
        .map((part: any) => (isString(part) ? { type: 'text' as const, text: part } : part));

      if (textParts.length > 0) {
        return prettyPrintChatMessage({ type: 'message', content: textParts, role: 'user' });
      }
    }
  }

  if (message.type === 'AssistantMessage') {
    return convertAssistantMessageToChatMessage(message.content);
  }

  if (message.type === 'FunctionMessage') {
    // Function execution result messages are typically logged as user messages
    return prettyPrintChatMessage({ type: 'message', content: JSON.stringify(message.content), role: 'user' });
  }

  // Handle messages with 'source' field (old format)
  if (message.source === 'system') {
    return prettyPrintChatMessage({ type: 'message', content: message.content, role: 'system' });
  }

  if (message.source === 'user') {
    if (isString(message.content)) {
      return prettyPrintChatMessage({ type: 'message', content: message.content, role: 'user' });
    }

    if (isArray(message.content)) {
      // Handle content that might be an array of text/image parts
      const textParts = message.content
        .filter((part: any) => isString(part))
        .map((part: any) => ({ type: 'text' as const, text: part }));

      if (textParts.length > 0) {
        return prettyPrintChatMessage({ type: 'message', content: textParts, role: 'user' });
      }
    }
  }

  if (message.source === 'assistant') {
    return convertAssistantMessageToChatMessage(message.content);
  }

  if (message.source === 'function') {
    // Function execution result messages are typically logged as user messages
    return prettyPrintChatMessage({ type: 'message', content: JSON.stringify(message.content), role: 'user' });
  }

  return null;
};

export const normalizeAutogenChatInput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (isNil(obj)) {
    return null;
  }

  // Handle case where input is directly an array of messages
  if (isArray(obj) && obj.length > 0 && obj.every(isAutogenMessage)) {
    return compact(obj.map(normalizeAutogenMessage));
  }

  // Handle case where input is wrapped in an object with 'messages' key
  if (isObject(obj) && 'messages' in obj) {
    const messages = (obj as any).messages;
    if (isArray(messages) && messages.length > 0 && messages.every(isAutogenMessage)) {
      return compact(messages.map(normalizeAutogenMessage));
    }
  }

  return null;
};

export const normalizeAutogenChatOutput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (isNil(obj)) {
    return null;
  }

  // Handle case where output is directly an array of messages
  if (isArray(obj) && obj.length > 0 && obj.every(isAutogenMessage)) {
    return compact(obj.map(normalizeAutogenMessage));
  }

  // Handle case where output is wrapped in an object with 'messages' key
  if (isObject(obj) && 'content' in obj) {
    const message = prettyPrintChatMessage({ role: 'assistant', content: obj.content as string, type: 'message' });
    return message ? [message] : null;
  }

  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: bedrock.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/bedrock.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';

const MOCK_BEDROCK_INPUT = {
  messages: [
    {
      role: 'user',
      content: [
        {
          text: 'What is the weather like in Tokyo today?',
        },
      ],
    },
  ],
};

const MOCK_BEDROCK_OUTPUT = {
  output: {
    message: {
      role: 'assistant',
      content: [
        {
          text: 'The weather in Tokyo is sunny with a temperature of 25°C.',
        },
      ],
    },
  },
};

const MOCK_BEDROCK_TOOL_USE_INPUT = {
  messages: [
    {
      role: 'user',
      content: [
        {
          text: 'Please check the weather in Tokyo and book a flight.',
        },
      ],
    },
    {
      role: 'assistant',
      content: [
        {
          text: 'I will help you check the weather and book a flight.',
        },
        {
          toolUse: {
            toolUseId: 'weather_tool_1',
            name: 'get_weather',
            input: {
              city: 'Tokyo',
            },
          },
        },
      ],
    },
    {
      role: 'user',
      content: [
        {
          toolResult: {
            toolUseId: 'weather_tool_1',
            content: [
              {
                text: 'The weather in Tokyo is sunny with 25°C.',
              },
            ],
          },
        },
      ],
    },
  ],
};

const MOCK_BEDROCK_TOOL_USE_OUTPUT = {
  output: {
    message: {
      role: 'assistant',
      content: [
        {
          text: 'Based on the weather information, I can help you book a flight to Tokyo.',
        },
        {
          toolUse: {
            toolUseId: 'flight_tool_1',
            name: 'book_flight',
            input: {
              destination: 'Tokyo',
              date: '2024-01-15',
            },
          },
        },
      ],
    },
  },
};

const MOCK_BEDROCK_IMAGE_INPUT = {
  messages: [
    {
      role: 'user',
      content: [
        {
          text: 'Describe this image:',
        },
        {
          image: {
            source: {
              bytes: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
            },
            format: 'jpeg',
          },
        },
      ],
    },
  ],
};

const MOCK_BEDROCK_REASONING_OUTPUT = {
  ResponseMetadata: {
    RequestId: '3be62cb5-d4e6-4af4-985f-3c0f57087dea',
    HTTPStatusCode: 200,
  },
  output: {
    message: {
      role: 'assistant',
      content: [
        {
          reasoningContent: {
            reasoningText: 'The user is asking for the sum of 1955 and 3865. Let me calculate:\n\n1955 + 3865 = 5820',
            signature: {
              algorithm: 'HmacSHA256',
              signature: 'RZ7n5nslCu12b5vQ7yDYfrHR1XhJ9LYRCJvZM1jF3oM=',
            },
          },
        },
        {
          text: 'The sum of 1955 and 3865 is 5820.',
        },
      ],
    },
  },
};

describe('normalizeConversation', () => {
  it('handles a Bedrock input format', () => {
    expect(normalizeConversation(MOCK_BEDROCK_INPUT, 'bedrock')).toEqual([
      expect.objectContaining({
        role: 'user',
        content: 'What is the weather like in Tokyo today?',
      }),
    ]);
  });

  it('handles a Bedrock output format', () => {
    expect(normalizeConversation(MOCK_BEDROCK_OUTPUT, 'bedrock')).toEqual([
      expect.objectContaining({
        role: 'assistant',
        content: 'The weather in Tokyo is sunny with a temperature of 25°C.',
      }),
    ]);
  });

  it('handles a Bedrock tool use input format', () => {
    const result = normalizeConversation(MOCK_BEDROCK_TOOL_USE_INPUT, 'bedrock');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);

    expect(result![0]).toEqual(
      expect.objectContaining({
        role: 'user',
        content: 'Please check the weather in Tokyo and book a flight.',
      }),
    );

    expect(result![1]).toEqual(
      expect.objectContaining({
        role: 'assistant',
        content: 'I will help you check the weather and book a flight.',
        tool_calls: expect.arrayContaining([
          expect.objectContaining({
            id: 'weather_tool_1',
            function: expect.objectContaining({
              name: 'get_weather',
              arguments: expect.stringContaining('"city"'),
            }),
          }),
        ]),
      }),
    );

    expect(result![2]).toEqual(
      expect.objectContaining({
        role: 'tool',
        content: 'The weather in Tokyo is sunny with 25°C.',
        tool_call_id: 'weather_tool_1',
      }),
    );
  });

  it('handles a Bedrock tool use output format', () => {
    const result = normalizeConversation(MOCK_BEDROCK_TOOL_USE_OUTPUT, 'bedrock');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);

    expect(result![0]).toEqual(
      expect.objectContaining({
        role: 'assistant',
        content: 'Based on the weather information, I can help you book a flight to Tokyo.',
        tool_calls: expect.arrayContaining([
          expect.objectContaining({
            id: 'flight_tool_1',
            function: expect.objectContaining({
              name: 'book_flight',
              arguments: expect.stringContaining('"destination"'),
            }),
          }),
        ]),
      }),
    );
  });

  it('handles a Bedrock image input format', () => {
    const result = normalizeConversation(MOCK_BEDROCK_IMAGE_INPUT, 'bedrock');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);

    expect(result![0]).toEqual(
      expect.objectContaining({
        role: 'user',
        content: expect.stringContaining('Describe this image: [Image: data:image/jpeg;base64,'),
      }),
    );
  });

  it('handles a Bedrock reasoning output format', () => {
    const result = normalizeConversation(MOCK_BEDROCK_REASONING_OUTPUT, 'bedrock');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);

    expect(result![0]).toEqual(
      expect.objectContaining({
        role: 'assistant',
        content: 'The sum of 1955 and 3865 is 5820.',
      }),
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: bedrock.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/bedrock.ts

```typescript
import { compact, has, isArray, isNil, isObject, isString } from 'lodash';

import type { ModelTraceChatMessage, ModelTraceContentParts } from '../ModelTrace.types';
import { prettyPrintToolCall } from '../ModelTraceExplorer.utils';

interface BedrockToolUse {
  toolUseId: string;
  name: string;
  input: string | Record<string, any>;
}

interface BedrockToolResult {
  toolUseId: string;
  content: BedrockContentBlock[];
}

interface BedrockContentBlock {
  text?: string;
  json?: any;
  image?: {
    source: {
      bytes: string | Uint8Array;
    };
    format: string;
  };
  toolUse?: BedrockToolUse;
  toolResult?: BedrockToolResult;
}

interface BedrockMessage {
  role: 'user' | 'assistant' | 'system';
  content: BedrockContentBlock[];
}

const parseBedrockContent = (content: BedrockContentBlock): ModelTraceContentParts | null => {
  if (content.text) {
    return { type: 'text', text: content.text };
  }

  if (content.json) {
    return { type: 'text', text: JSON.stringify(content.json) };
  }

  if (content.image) {
    const bytes = content.image.source.bytes;
    const format = content.image.format;
    let data: string;

    if (typeof bytes === 'string') {
      data = bytes;
    } else {
      // Convert Uint8Array to base64 string
      const buffer = Buffer.from(bytes);
      data = buffer.toString('base64');
    }

    const imageFormat = `image/${format}`;
    return {
      type: 'image_url',
      image_url: { url: `data:${imageFormat};base64,${data}` },
    };
  }

  // Unsupported content types (video, document) are ignored
  return null;
};

const convertBedrockMessageToChatMessage = (message: BedrockMessage): ModelTraceChatMessage => {
  let role: 'user' | 'assistant' | 'system' | 'tool' = message.role;
  const contents: ModelTraceContentParts[] = [];
  const toolCalls: any[] = [];
  let toolCallId: string | undefined;

  for (const content of message.content) {
    if (content.toolUse) {
      const toolCall = content.toolUse;
      const input = typeof toolCall.input === 'string' ? toolCall.input : JSON.stringify(toolCall.input);

      toolCalls.push(
        prettyPrintToolCall({
          id: toolCall.toolUseId,
          function: {
            name: toolCall.name,
            arguments: input,
          },
        }),
      );
    } else if (content.toolResult) {
      toolCallId = content.toolResult.toolUseId;
      role = 'tool';

      for (const resultContent of content.toolResult.content) {
        const parsedContent = parseBedrockContent(resultContent);
        if (parsedContent) {
          contents.push(parsedContent);
        }
      }
    } else {
      const parsedContent = parseBedrockContent(content);
      if (parsedContent) {
        contents.push(parsedContent);
      }
    }
  }

  // Convert content parts to string
  let contentString = '';
  if (contents.length > 0) {
    contentString = contents
      .map((part) => {
        if (part.type === 'text') {
          return part.text;
        } else if (part.type === 'image_url') {
          return `[Image: ${part.image_url.url}]`;
        }
        return '';
      })
      .filter((text) => text.length > 0)
      .join(' ');
  }

  const chatMessage: ModelTraceChatMessage = {
    role: role,
    content: contentString,
  };

  if (toolCalls.length > 0) {
    chatMessage.tool_calls = toolCalls;
  }

  if (toolCallId) {
    chatMessage.tool_call_id = toolCallId;
  }

  return chatMessage;
};

const isBedrockMessage = (obj: unknown): obj is BedrockMessage => {
  if (!isObject(obj)) {
    return false;
  }

  const hasRole = has(obj, 'role') && isString(obj.role) && ['user', 'assistant', 'system'].includes(obj.role);
  const hasContent = has(obj, 'content') && isArray(obj.content);

  return hasRole && hasContent;
};

export const normalizeBedrockChatInput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (isNil(obj)) {
    return null;
  }

  // Handle case where input has 'messages' key
  if (isObject(obj) && 'messages' in obj) {
    const messages = (obj as any).messages;
    if (isArray(messages) && messages.length > 0 && messages.every(isBedrockMessage)) {
      return compact(messages.map(convertBedrockMessageToChatMessage));
    }
  }

  return null;
};

export const normalizeBedrockChatOutput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (isNil(obj)) {
    return null;
  }

  // Handle case where output has 'output' -> 'message' structure
  if (isObject(obj) && 'output' in obj) {
    const output = (obj as any).output;
    if (isObject(output) && 'message' in output) {
      const message = output.message;
      if (isBedrockMessage(message)) {
        return [convertBedrockMessageToChatMessage(message)];
      }
    }
  }

  return null;
};
```

--------------------------------------------------------------------------------

````
