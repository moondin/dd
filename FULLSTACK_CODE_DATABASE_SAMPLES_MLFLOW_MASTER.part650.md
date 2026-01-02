---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 650
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 650 of 991)

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

---[FILE: pydanticai.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/pydanticai.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';

// Mock PydanticAI messages based on the actual structure from pydantic_ai.messages module
const MOCK_PYDANTIC_AI_REQUEST = {
  kind: 'request',
  parts: [
    {
      part_kind: 'system-prompt',
      content: 'You are a helpful assistant.',
      timestamp: '2025-11-10T03:25:10.268933',
      dynamic_ref: null,
    },
    {
      part_kind: 'user-prompt',
      content: 'Hello, how are you?',
      timestamp: '2025-11-10T03:25:10.268955',
    },
  ],
};

const MOCK_PYDANTIC_AI_RESPONSE = {
  kind: 'response',
  parts: [
    {
      part_kind: 'text',
      content: 'I am doing well, thank you!',
      id: null,
    },
  ],
  usage: {
    input_tokens: 20,
    output_tokens: 10,
    total_tokens: 30,
  },
  model_name: 'claude-3-7-sonnet-latest',
  timestamp: '2025-11-10T03:25:10.268957',
  provider_name: 'anthropic',
  provider_details: null,
  provider_response_id: 'msg_123',
  finish_reason: 'stop',
};

const MOCK_PYDANTIC_AI_REQUEST_WITH_TOOL_RETURN = {
  kind: 'request',
  parts: [
    {
      part_kind: 'user-prompt',
      content: "What's the weather in San Francisco?",
      timestamp: '2025-11-10T03:25:25.690753',
    },
  ],
};

const MOCK_PYDANTIC_AI_RESPONSE_WITH_TOOL_CALL = {
  kind: 'response',
  parts: [
    {
      part_kind: 'tool-call',
      tool_name: 'get_weather',
      args: {
        location: 'San Francisco',
        unit: 'celsius',
      },
      tool_call_id: 'call_abc123',
      id: null,
    },
  ],
  usage: {
    input_tokens: 30,
    output_tokens: 15,
    total_tokens: 45,
  },
  model_name: 'claude-3-7-sonnet-latest',
  timestamp: '2025-11-10T03:25:25.690777',
  provider_name: 'anthropic',
  finish_reason: 'tool_calls',
};

const MOCK_PYDANTIC_AI_REQUEST_WITH_TOOL_RESULT = {
  kind: 'request',
  parts: [
    {
      part_kind: 'tool-return',
      tool_name: 'get_weather',
      content: {
        temperature: 18,
        condition: 'sunny',
      },
      tool_call_id: 'call_abc123',
      metadata: null,
      timestamp: '2025-11-10T03:25:25.690777',
    },
  ],
};

const MOCK_PYDANTIC_AI_RESPONSE_FINAL = {
  kind: 'response',
  parts: [
    {
      part_kind: 'text',
      content: 'The weather in San Francisco is 18°C and sunny.',
      id: null,
    },
  ],
  usage: {
    input_tokens: 45,
    output_tokens: 12,
    total_tokens: 57,
  },
  model_name: 'claude-3-7-sonnet-latest',
  timestamp: '2025-11-10T03:25:25.690779',
  provider_name: 'anthropic',
  finish_reason: 'stop',
};

describe('PydanticAI message normalization', () => {
  describe('normalizeConversation with pydantic_ai format', () => {
    it('should normalize a simple request with system and user prompts', () => {
      const result = normalizeConversation(MOCK_PYDANTIC_AI_REQUEST, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);

      expect(result![0]).toEqual({
        role: 'system',
        content: 'You are a helpful assistant.',
      });

      expect(result![1]).toEqual({
        role: 'user',
        content: 'Hello, how are you?',
      });
    });

    it('should normalize a simple response with text', () => {
      const result = normalizeConversation(MOCK_PYDANTIC_AI_RESPONSE, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      expect(result![0]).toEqual({
        role: 'assistant',
        content: 'I am doing well, thank you!',
      });
    });

    it('should normalize an array of messages (request + response)', () => {
      const messages = [MOCK_PYDANTIC_AI_REQUEST, MOCK_PYDANTIC_AI_RESPONSE];
      const result = normalizeConversation(messages, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(3); // system + user + assistant

      expect(result![0].role).toBe('system');
      expect(result![1].role).toBe('user');
      expect(result![2].role).toBe('assistant');
    });

    it('should normalize a response with tool calls', () => {
      const result = normalizeConversation(MOCK_PYDANTIC_AI_RESPONSE_WITH_TOOL_CALL, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      expect(result![0]).toMatchObject({
        role: 'assistant',
        tool_calls: [
          {
            id: 'call_abc123',
            function: {
              name: 'get_weather',
              arguments: expect.stringContaining('San Francisco'),
            },
          },
        ],
      });

      const args = JSON.parse(result![0].tool_calls![0].function.arguments);
      expect(args).toEqual({
        location: 'San Francisco',
        unit: 'celsius',
      });
    });

    it('should normalize a request with tool return', () => {
      const result = normalizeConversation(MOCK_PYDANTIC_AI_REQUEST_WITH_TOOL_RESULT, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      expect(result![0]).toMatchObject({
        role: 'tool',
        tool_call_id: 'call_abc123',
        content: expect.stringContaining('temperature'),
      });

      const content = JSON.parse(result![0].content!);
      expect(content).toEqual({
        temperature: 18,
        condition: 'sunny',
      });
    });

    it('should normalize a complete conversation with tool calls', () => {
      const messages = [
        MOCK_PYDANTIC_AI_REQUEST_WITH_TOOL_RETURN,
        MOCK_PYDANTIC_AI_RESPONSE_WITH_TOOL_CALL,
        MOCK_PYDANTIC_AI_REQUEST_WITH_TOOL_RESULT,
        MOCK_PYDANTIC_AI_RESPONSE_FINAL,
      ];

      const result = normalizeConversation(messages, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(4);

      expect(result![0].role).toBe('user');

      expect(result![1].role).toBe('assistant');
      expect(result![1].tool_calls).toBeDefined();
      expect(result![1].tool_calls).toHaveLength(1);

      expect(result![2].role).toBe('tool');
      expect(result![2].tool_call_id).toBe('call_abc123');

      expect(result![3].role).toBe('assistant');
      expect(result![3].content).toBe('The weather in San Francisco is 18°C and sunny.');
    });

    it('should handle inputs with message_history field', () => {
      const inputWithMessageHistory = {
        user_prompt: 'I am doing well thank you.',
        message_history: [MOCK_PYDANTIC_AI_REQUEST, MOCK_PYDANTIC_AI_RESPONSE],
      };

      const result = normalizeConversation(inputWithMessageHistory, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(3); // system + user + assistant from message_history

      expect(result![0].role).toBe('system');
      expect(result![1].role).toBe('user');
      expect(result![2].role).toBe('assistant');
    });

    it('should handle response with thinking parts', () => {
      const responseWithThinking = {
        kind: 'response',
        parts: [
          {
            part_kind: 'thinking',
            content: 'Let me think about this...',
            id: null,
            signature: null,
            provider_name: 'anthropic',
          },
          {
            part_kind: 'text',
            content: 'Here is my answer.',
            id: null,
          },
        ],
        usage: {
          input_tokens: 10,
          output_tokens: 20,
        },
        model_name: 'claude-3-7-sonnet-latest',
      };

      const result = normalizeConversation(responseWithThinking, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      expect(result![0]).toMatchObject({
        role: 'assistant',
        content: expect.stringContaining('[Thinking]'),
      });
      expect(result![0].content).toContain('Here is my answer.');
    });

    it('should handle builtin tool calls', () => {
      const responseWithBuiltinTool = {
        kind: 'response',
        parts: [
          {
            part_kind: 'builtin-tool-call',
            tool_name: 'web_search',
            args: { query: 'latest news' },
            tool_call_id: 'builtin_123',
            id: null,
            provider_name: 'anthropic',
          },
        ],
        usage: {
          input_tokens: 10,
          output_tokens: 5,
        },
      };

      const result = normalizeConversation(responseWithBuiltinTool, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      expect(result![0]).toMatchObject({
        role: 'assistant',
        tool_calls: [
          {
            id: 'builtin_123',
            function: {
              name: 'web_search',
              arguments: expect.stringContaining('latest news'),
            },
          },
        ],
      });
    });

    it('should return null for non-PydanticAI messages', () => {
      const invalidInput = {
        some_field: 'some_value',
      };

      const result = normalizeConversation(invalidInput, 'pydantic_ai');
      expect(result).toBeNull();
    });

    it('should return null for empty array', () => {
      const result = normalizeConversation([], 'pydantic_ai');
      expect(result).toBeNull();
    });

    it('should handle tool call with string arguments', () => {
      const responseWithStringArgs = {
        kind: 'response',
        parts: [
          {
            part_kind: 'tool-call',
            tool_name: 'search',
            args: '{"query": "test"}',
            tool_call_id: 'call_str',
            id: null,
          },
        ],
        usage: {
          input_tokens: 10,
          output_tokens: 5,
        },
      };

      const result = normalizeConversation(responseWithStringArgs, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      expect(result![0].role).toBe('assistant');
      expect(result![0].tool_calls).toBeDefined();
      expect(result![0].tool_calls).toHaveLength(1);
      expect(result![0].tool_calls![0].id).toBe('call_str');
      expect(result![0].tool_calls![0].function.name).toBe('search');
      const args = JSON.parse(result![0].tool_calls![0].function.arguments);
      expect(args).toEqual({ query: 'test' });
    });

    it('should handle tool call with null arguments', () => {
      const responseWithNullArgs = {
        kind: 'response',
        parts: [
          {
            part_kind: 'tool-call',
            tool_name: 'no_args_tool',
            args: null,
            tool_call_id: 'call_null',
            id: null,
          },
        ],
        usage: {
          input_tokens: 10,
          output_tokens: 5,
        },
      };

      const result = normalizeConversation(responseWithNullArgs, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      expect(result![0]).toMatchObject({
        role: 'assistant',
        tool_calls: [
          {
            id: 'call_null',
            function: {
              name: 'no_args_tool',
              arguments: '{}',
            },
          },
        ],
      });
    });

    it('should handle outputs with _new_messages_serialized field', () => {
      const outputWithSerializedMessages = {
        data: 'Paris',
        output: 'Paris',
        _new_messages_serialized: [MOCK_PYDANTIC_AI_REQUEST, MOCK_PYDANTIC_AI_RESPONSE],
      };

      const result = normalizeConversation(outputWithSerializedMessages, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(3); // system + user + assistant

      expect(result![0].role).toBe('system');
      expect(result![1].role).toBe('user');
      expect(result![2].role).toBe('assistant');
    });

    it('should handle outputs with _new_messages_serialized for first call without history', () => {
      const firstCallOutput = {
        data: 'I am doing well, thank you!',
        output: 'I am doing well, thank you!',
        _new_messages_serialized: [
          {
            kind: 'request',
            parts: [
              {
                part_kind: 'system-prompt',
                content: 'You are a helpful assistant.',
                timestamp: '2025-11-10T03:25:10.268933',
                dynamic_ref: null,
              },
              {
                part_kind: 'user-prompt',
                content: 'Hello, how are you?',
                timestamp: '2025-11-10T03:25:10.268955',
              },
            ],
          },
          {
            kind: 'response',
            parts: [
              {
                part_kind: 'text',
                content: 'I am doing well, thank you!',
                id: null,
              },
            ],
            usage: {
              input_tokens: 20,
              output_tokens: 10,
            },
            model_name: 'claude-3-7-sonnet-latest',
            timestamp: '2025-11-10T03:25:10.268957',
          },
        ],
      };

      const result = normalizeConversation(firstCallOutput, 'pydantic_ai');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(3); // system + user + assistant

      expect(result![0]).toMatchObject({
        role: 'system',
        content: 'You are a helpful assistant.',
      });

      expect(result![1]).toMatchObject({
        role: 'user',
        content: 'Hello, how are you?',
      });

      expect(result![2]).toMatchObject({
        role: 'assistant',
        content: 'I am doing well, thank you!',
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: pydanticai.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/pydanticai.ts

```typescript
import { has, isArray, isNil, isObject, isString } from 'lodash';

import type { ModelTraceChatMessage, ModelTraceToolCall } from '../ModelTrace.types';
import { prettyPrintChatMessage } from '../ModelTraceExplorer.utils';

// Request part types
type SystemPromptPart = {
  part_kind: 'system-prompt';
  content: string;
};

type UserPromptPart = {
  part_kind: 'user-prompt';
  content: string;
};

type ToolReturnPart = {
  part_kind: 'tool-return';
  content: any;
  tool_call_id: string;
};

type BuiltinToolReturnPart = {
  part_kind: 'builtin-tool-return';
  content: any;
  tool_call_id: string;
};

type ModelRequestPart = SystemPromptPart | UserPromptPart | ToolReturnPart | BuiltinToolReturnPart;

// Response part types
type TextPart = {
  part_kind: 'text';
  content: string;
};

type ThinkingPart = {
  part_kind: 'thinking';
  content: string;
};

type ToolCallPart = {
  part_kind: 'tool-call';
  tool_name: string;
  args: string | { [key: string]: any } | null;
  tool_call_id: string;
};

type BuiltinToolCallPart = {
  part_kind: 'builtin-tool-call';
  tool_name: string;
  args: string | { [key: string]: any } | null;
  tool_call_id: string;
};

type FilePart = {
  part_kind: 'file';
};

type ModelResponsePart = TextPart | ThinkingPart | ToolCallPart | BuiltinToolCallPart | FilePart;

// Message types
export type PydanticAIModelRequest = {
  kind: 'request';
  parts: ModelRequestPart[];
};

export type PydanticAIModelResponse = {
  kind: 'response';
  parts: ModelResponsePart[];
};

export type PydanticAIMessage = PydanticAIModelRequest | PydanticAIModelResponse;

// Type guards
const isPydanticAIModelRequest = (obj: any): obj is PydanticAIModelRequest => {
  return isObject(obj) && has(obj, 'kind') && obj.kind === 'request' && has(obj, 'parts') && isArray(obj.parts);
};

const isPydanticAIModelResponse = (obj: any): obj is PydanticAIModelResponse => {
  return isObject(obj) && has(obj, 'kind') && obj.kind === 'response' && has(obj, 'parts') && isArray(obj.parts);
};

// Normalization helpers
const normalizeToolCallArgs = (args: string | { [key: string]: any } | null): string => {
  if (isNil(args)) {
    return '{}';
  }
  if (isString(args)) {
    return args;
  }
  return JSON.stringify(args, null, 2);
};

const normalizePydanticAIToolCall = (part: ToolCallPart | BuiltinToolCallPart): ModelTraceToolCall => {
  return {
    id: part.tool_call_id,
    function: {
      name: part.tool_name,
      arguments: normalizeToolCallArgs(part.args),
    },
  };
};

const normalizeModelRequest = (request: PydanticAIModelRequest): ModelTraceChatMessage[] => {
  const messages: ModelTraceChatMessage[] = [];

  for (const part of request.parts) {
    switch (part.part_kind) {
      case 'system-prompt': {
        const message = prettyPrintChatMessage({
          role: 'system',
          content: part.content,
        });
        if (message) messages.push(message);
        break;
      }
      case 'user-prompt': {
        const message = prettyPrintChatMessage({
          role: 'user',
          content: part.content,
        });
        if (message) messages.push(message);
        break;
      }
      case 'tool-return':
      case 'builtin-tool-return': {
        const contentStr = isString(part.content) ? part.content : JSON.stringify(part.content, null, 2);
        const message = prettyPrintChatMessage({
          role: 'tool',
          content: contentStr,
          tool_call_id: part.tool_call_id,
        });
        if (message) messages.push(message);
        break;
      }
    }
  }

  return messages;
};

const normalizeModelResponse = (response: PydanticAIModelResponse): ModelTraceChatMessage[] => {
  const messages: ModelTraceChatMessage[] = [];
  const textParts: string[] = [];
  const toolCalls: ModelTraceToolCall[] = [];

  for (const part of response.parts) {
    switch (part.part_kind) {
      case 'text': {
        textParts.push(part.content);
        break;
      }
      case 'thinking': {
        textParts.push(`[Thinking] ${part.content}`);
        break;
      }
      case 'tool-call':
      case 'builtin-tool-call': {
        toolCalls.push(normalizePydanticAIToolCall(part));
        break;
      }
      case 'file': {
        textParts.push('[file]');
        break;
      }
    }
  }

  const content = textParts.length > 0 ? textParts.join('\n\n') : undefined;
  const message = prettyPrintChatMessage({
    role: 'assistant',
    content,
    ...(toolCalls.length > 0 && { tool_calls: toolCalls }),
  });

  if (message) {
    messages.push(message);
  }

  return messages;
};

export const normalizePydanticAIChatInput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (!obj) {
    return null;
  }

  if (isObject(obj) && has(obj, 'message_history')) {
    const messageHistory = (obj as any).message_history;
    if (isArray(messageHistory) && messageHistory.length > 0) {
      const messages: ModelTraceChatMessage[] = [];

      for (const item of messageHistory) {
        if (isPydanticAIModelRequest(item)) {
          messages.push(...normalizeModelRequest(item));
        } else if (isPydanticAIModelResponse(item)) {
          messages.push(...normalizeModelResponse(item));
        }
      }

      return messages.length > 0 ? messages : null;
    }
  }

  if (isArray(obj) && obj.length > 0) {
    const messages: ModelTraceChatMessage[] = [];

    for (const item of obj) {
      if (isPydanticAIModelRequest(item)) {
        messages.push(...normalizeModelRequest(item));
      } else if (isPydanticAIModelResponse(item)) {
        messages.push(...normalizeModelResponse(item));
      }
    }

    return messages.length > 0 ? messages : null;
  }

  if (isPydanticAIModelRequest(obj)) {
    return normalizeModelRequest(obj);
  }

  return null;
};

export const normalizePydanticAIChatOutput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (!obj) {
    return null;
  }

  if (isObject(obj) && has(obj, '_new_messages_serialized')) {
    const newMessages = (obj as any)._new_messages_serialized;
    if (isArray(newMessages) && newMessages.length > 0) {
      const messages: ModelTraceChatMessage[] = [];

      for (const item of newMessages) {
        if (isPydanticAIModelRequest(item)) {
          messages.push(...normalizeModelRequest(item));
        } else if (isPydanticAIModelResponse(item)) {
          messages.push(...normalizeModelResponse(item));
        }
      }

      return messages.length > 0 ? messages : null;
    }
  }

  if (isArray(obj) && obj.length > 0) {
    const messages: ModelTraceChatMessage[] = [];

    for (const item of obj) {
      if (isPydanticAIModelRequest(item)) {
        messages.push(...normalizeModelRequest(item));
      } else if (isPydanticAIModelResponse(item)) {
        messages.push(...normalizeModelResponse(item));
      }
    }

    return messages.length > 0 ? messages : null;
  }

  if (isPydanticAIModelResponse(obj)) {
    return normalizeModelResponse(obj);
  }

  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: vercelai.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/vercelai.test.ts

```typescript
import { describe, expect, it } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';

// Mock Vercel AI input with messages format
const MOCK_VERCEL_AI_MESSAGES_INPUT = {
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What is the weather like today?',
        },
      ],
    },
    {
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: 'I need more information. Where are you located?',
        },
      ],
    },
  ],
};

// Mock Vercel AI input with image content
const MOCK_VERCEL_AI_IMAGE_INPUT = {
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What is in this image?',
        },
        {
          type: 'image',
          image: 'https://example.com/image.jpg',
        },
      ],
    },
  ],
};

// Mock Vercel AI output with text
const MOCK_VERCEL_AI_TEXT_OUTPUT = {
  text: 'This is the response from the AI',
};

// Mock Vercel AI input with tool call and tool result
const MOCK_VERCEL_AI_TOOL_CALL_INPUT = {
  messages: [
    {
      role: 'user',
      content: [{ type: 'text', text: 'Please check the weather in Tokyo.' }],
    },
    {
      role: 'assistant',
      content: [
        { type: 'text', text: 'Calling weather tool…' },
        {
          type: 'tool-call',
          toolCallId: 'weather_tool_1',
          toolName: 'get_weather',
          input: '{"city":"Tokyo"}',
          providerOptions: {},
        },
      ],
    },
    {
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId: 'weather_tool_1',
          toolName: 'get_weather',
          output: { temp: 25, condition: 'Sunny' },
        },
      ],
    },
  ],
};

// Mock Vercel AI output with toolCalls array
const MOCK_VERCEL_AI_TOOL_CALLS_OUTPUT = {
  toolCalls: [
    {
      type: 'tool-call',
      toolCallId: 'calc_1',
      toolName: 'add',
      input: '{"a":2,"b":3}',
      providerOptions: {},
    },
  ],
};

describe('normalizeConversation - Vercel AI', () => {
  describe('Input formats', () => {
    it('should handle Vercel AI messages input with content array', () => {
      const result = normalizeConversation(MOCK_VERCEL_AI_MESSAGES_INPUT, 'vercel_ai');
      expect(result).toEqual([
        expect.objectContaining({
          role: 'user',
          content: expect.stringMatching(/what is the weather like today/i),
        }),
        expect.objectContaining({
          role: 'assistant',
          content: expect.stringMatching(/i need more information/i),
        }),
      ]);
    });

    it('should handle Vercel AI input with image content', () => {
      const result = normalizeConversation(MOCK_VERCEL_AI_IMAGE_INPUT, 'vercel_ai');
      expect(result).toEqual([
        expect.objectContaining({
          role: 'user',
          content: expect.stringMatching(/what is in this image/i),
        }),
      ]);
    });
  });

  describe('Output formats', () => {
    it('should handle Vercel AI output with text', () => {
      const result = normalizeConversation(MOCK_VERCEL_AI_TEXT_OUTPUT, 'vercel_ai');
      expect(result).toEqual([
        expect.objectContaining({
          role: 'assistant',
          content: 'This is the response from the AI',
        }),
      ]);
    });

    it('should handle Vercel AI output with toolCalls array', () => {
      const result = normalizeConversation(MOCK_VERCEL_AI_TOOL_CALLS_OUTPUT, 'vercel_ai');
      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);

      const msg = result![0] as any;
      expect(msg.role).toBe('assistant');
      expect(msg.content).toBe('');
      expect(Array.isArray(msg.tool_calls)).toBe(true);
      expect(msg.tool_calls).toHaveLength(1);
      expect(msg.tool_calls[0].id).toBe('calc_1');
      expect(msg.tool_calls[0].function.name).toBe('add');
      expect(typeof msg.tool_calls[0].function.arguments).toBe('string');
      // Arguments are stringified twice in pipeline, so parse twice to verify shape
      const parsedOnce = JSON.parse(msg.tool_calls[0].function.arguments);
      const parsedTwice = JSON.parse(parsedOnce);
      expect(parsedTwice).toEqual({ a: 2, b: 3 });
    });
  });

  describe('Edge cases', () => {
    it('should return null for invalid input', () => {
      expect(normalizeConversation({ invalid: 'data' }, 'vercel_ai')).toBeNull();
    });

    it('should return null for null input', () => {
      expect(normalizeConversation(null, 'vercel_ai')).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(normalizeConversation(undefined, 'vercel_ai')).toBeNull();
    });
  });

  describe('Tool call cases', () => {
    it('should handle Vercel AI input with tool-call and tool-result parts', () => {
      const result = normalizeConversation(MOCK_VERCEL_AI_TOOL_CALL_INPUT, 'vercel_ai');
      expect(result).not.toBeNull();
      expect(result).toHaveLength(3);

      // User message
      expect(result![0]).toEqual(
        expect.objectContaining({
          role: 'user',
          content: expect.stringContaining('Please check the weather in Tokyo.'),
        }),
      );

      // Assistant tool call message
      const assistantMsg: any = result![1];
      expect(assistantMsg.role).toBe('assistant');
      expect(String(assistantMsg.content)).toContain('Calling weather tool');
      expect(Array.isArray(assistantMsg.tool_calls)).toBe(true);
      expect(assistantMsg.tool_calls).toHaveLength(1);
      expect(assistantMsg.tool_calls[0].id).toBe('weather_tool_1');
      expect(assistantMsg.tool_calls[0].function.name).toBe('get_weather');
      const toolArgsOnce = JSON.parse(assistantMsg.tool_calls[0].function.arguments);
      const toolArgs = JSON.parse(toolArgsOnce);
      expect(toolArgs).toEqual({ city: 'Tokyo' });

      // Tool result message
      expect(result![2]).toEqual(
        expect.objectContaining({
          role: 'tool',
          tool_call_id: 'weather_tool_1',
          content: expect.stringContaining('Sunny'),
        }),
      );
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: vercelai.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/vercelai.ts

```typescript
import { compact, has, isArray, isObject, isString } from 'lodash';

import type { ModelTraceChatMessage, ModelTraceContentParts, ModelTraceToolCall } from '../ModelTrace.types';
import { prettyPrintChatMessage } from '../ModelTraceExplorer.utils';

type VercelAITextContent = {
  type: 'text';
  text: string;
};

type VercelAIImageContent = {
  type: 'image';
  image: string | URL;
};

type VercelAIToolCall = {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  input: string;
  providerOptions: Record<string, any>;
};

type VercelAIToolCallResult = {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  output: any;
};

type VercelAIContentPart = VercelAITextContent | VercelAIImageContent | VercelAIToolCall | VercelAIToolCallResult;

export type VercelAIMessage = {
  role: 'user' | 'assistant' | 'system' | 'tool' | 'function';
  content: string | VercelAIContentPart[];
  name?: string;
};

const isVercelAIContentPart = (obj: unknown): obj is VercelAIContentPart => {
  if (!isObject(obj) || !has(obj, 'type')) {
    return false;
  }

  const typedObj = obj as any;

  if (typedObj.type === 'text' && has(obj, 'text') && isString(typedObj.text)) {
    return true;
  }

  if (typedObj.type === 'image' && has(obj, 'image')) {
    return isString(typedObj.image);
  }

  if (isVercelAIToolCall(obj)) return true;

  if (typedObj.type === 'tool-result' && has(obj, 'output')) {
    return true;
  }

  return false;
};

const isVercelAIToolCall = (obj: unknown): obj is VercelAIToolCall => {
  if (!isObject(obj)) {
    return false;
  }

  return has(obj, 'toolCallId') && has(obj, 'toolName') && has(obj, 'input');
};

const isVercelAIMessage = (obj: unknown): obj is VercelAIMessage => {
  if (!isObject(obj)) {
    return false;
  }

  const typedObj = obj as any;

  const hasRole =
    has(obj, 'role') &&
    isString(typedObj.role) &&
    ['user', 'assistant', 'system', 'tool', 'function'].includes(typedObj.role);

  if (!hasRole) {
    return false;
  }

  const hasContent =
    has(obj, 'content') &&
    (isString(typedObj.content) || (isArray(typedObj.content) && typedObj.content.every(isVercelAIContentPart)));

  return hasContent;
};

const normalizeVercelAIContentPart = (item: VercelAIContentPart): ModelTraceContentParts => {
  switch (item.type) {
    case 'text': {
      return { type: 'text', text: item.text };
    }
    case 'image': {
      return { type: 'image_url', image_url: { url: item.image as string } };
    }
    case 'tool-call': {
      return { type: 'text', text: '' };
    }
    case 'tool-result': {
      return { type: 'text', text: JSON.stringify(item.output) };
    }
  }
};

const extractToolCalls = (content: VercelAIContentPart[]): ModelTraceToolCall[] => {
  return content.filter((item) => item.type === 'tool-call').map(processVercelAIToolCall);
};

const processVercelAIMessage = (message: VercelAIMessage): ModelTraceChatMessage | null => {
  if (typeof message.content === 'string') {
    return prettyPrintChatMessage({
      type: 'message',
      content: message.content,
      role: message.role,
      ...(message.name && { name: message.name }),
    });
  } else {
    // Convert content parts array to ModelTraceContentParts
    const contentParts: ModelTraceContentParts[] = message.content.map(normalizeVercelAIContentPart);
    const toolCalls: ModelTraceToolCall[] = extractToolCalls(message.content);
    const toolCallId = message.content.find((item) => item.type === 'tool-result')?.toolCallId;

    return prettyPrintChatMessage({
      content: contentParts,
      role: message.role,
      ...(message.name && { name: message.name }),
      ...(toolCallId && { tool_call_id: toolCallId }),
      ...(toolCalls && toolCalls.length > 0 && { tool_calls: toolCalls }),
    });
  }
};

const processVercelAIToolCall = (toolCall: VercelAIToolCall): ModelTraceToolCall => {
  return {
    id: toolCall.toolCallId,
    function: {
      name: toolCall.toolName,
      arguments: JSON.stringify(toolCall.input),
    },
  };
};
/**
 * Normalize Vercel AI chat input format (generateText.doGenerate)
 */
export const normalizeVercelAIChatInput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (!isObject(obj)) {
    return null;
  }

  const typedObj = obj as any;

  if (has(obj, 'messages') && isArray(typedObj.messages) && typedObj.messages.every(isVercelAIMessage)) {
    return compact(typedObj.messages.map(processVercelAIMessage));
  }

  return null;
};

/**
 * Normalize Vercel AI chat output format
 **/
export const normalizeVercelAIChatOutput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (!isObject(obj)) {
    return null;
  }

  const typedObj = obj as any;

  if (has(obj, 'text') && isString(typedObj.text)) {
    return compact([
      prettyPrintChatMessage({
        type: 'message',
        content: typedObj.text,
        role: 'assistant',
      }),
    ]);
  }

  if (has(obj, 'toolCalls') && isArray(typedObj.toolCalls) && typedObj.toolCalls.every(isVercelAIToolCall)) {
    return compact([
      prettyPrintChatMessage({
        type: 'message',
        content: '',
        role: 'assistant',
        tool_calls: compact(typedObj.toolCalls.map(processVercelAIToolCall)),
      }),
    ]);
  }

  return null;
};
```

--------------------------------------------------------------------------------

````
