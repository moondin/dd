---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 649
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 649 of 991)

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

---[FILE: openai-agent.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/openai-agent.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';

const MOCK_OPENAI_AGENT_INPUT = [
  {
    content: 'What is the weather like in Tokyo today?',
    role: 'user',
  },
  {
    id: 'fc_67d369499e588191bd568526dc7ee44a0b0cc610b3768fc1',
    arguments: '{"city": "Tokyo"}',
    call_id: 'call_bRNQ2ZycSlQAOKWomPbtaub4',
    name: 'get_weather',
    type: 'function_call',
    status: 'completed',
  },
  {
    call_id: 'call_bRNQ2ZycSlQAOKWomPbtaub4',
    output: 'The weather in Tokyo is sunny.',
    type: 'function_call_output',
  },
];

const MOCK_OPENAI_AGENT_OUTPUT = [
  {
    id: 'msg_67d3694a904c8191819d3b2c22d3a90f0b0cc610b3768fc1',
    content: [
      {
        annotations: [],
        text: 'The weather in Tokyo is currently sunny.',
        type: 'output_text',
      },
    ],
    role: 'assistant',
    status: 'completed',
    type: 'message',
  },
];

const MOCK_OPENAI_AGENT_COMPLEX_INPUT = [
  {
    content: 'Please check the weather and book a flight to Tokyo.',
    role: 'user',
  },
  {
    id: 'weather_call_1',
    arguments: '{"city": "Tokyo"}',
    call_id: 'call_weather_123',
    name: 'get_weather',
    type: 'function_call',
    status: 'completed',
  },
  {
    call_id: 'call_weather_123',
    output: 'The weather in Tokyo is sunny with 25°C.',
    type: 'function_call_output',
  },
  {
    id: 'flight_call_1',
    arguments: '{"destination": "Tokyo", "date": "2024-01-15"}',
    call_id: 'call_flight_456',
    name: 'book_flight',
    type: 'function_call',
    status: 'completed',
  },
  {
    call_id: 'call_flight_456',
    output: 'Flight booked successfully. Booking ID: FL12345',
    type: 'function_call_output',
  },
];

const MOCK_OPENAI_AGENT_COMPLEX_OUTPUT = [
  {
    id: 'msg_final_response',
    content: [
      {
        annotations: [],
        text: 'I checked the weather in Tokyo and booked your flight. The weather is sunny with 25°C, and your flight has been booked successfully with booking ID FL12345.',
        type: 'output_text',
      },
    ],
    role: 'assistant',
    status: 'completed',
    type: 'message',
  },
];

describe('normalizeConversation', () => {
  it('handles an OpenAI Agent input', () => {
    const result = normalizeConversation(MOCK_OPENAI_AGENT_INPUT, 'openai-agent');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);

    expect(result![0]).toEqual(
      expect.objectContaining({
        role: 'user',
        content: 'What is the weather like in Tokyo today?',
      }),
    );

    expect(result![1]).toEqual(
      expect.objectContaining({
        role: 'assistant',
        tool_calls: expect.arrayContaining([
          expect.objectContaining({
            id: 'call_bRNQ2ZycSlQAOKWomPbtaub4',
            function: expect.objectContaining({
              name: 'get_weather',
              arguments: expect.stringContaining('Tokyo'),
            }),
          }),
        ]),
      }),
    );

    expect(result![2]).toEqual(
      expect.objectContaining({
        role: 'tool',
        content: 'The weather in Tokyo is sunny.',
        tool_call_id: 'call_bRNQ2ZycSlQAOKWomPbtaub4',
      }),
    );
  });

  it('handles an OpenAI Agent output', () => {
    expect(normalizeConversation(MOCK_OPENAI_AGENT_OUTPUT, 'openai-agent')).toEqual([
      expect.objectContaining({
        role: 'assistant',
        content: 'The weather in Tokyo is currently sunny.',
      }),
    ]);
  });

  it('handles an OpenAI Agent complex input', () => {
    const result = normalizeConversation(MOCK_OPENAI_AGENT_COMPLEX_INPUT, 'openai-agent');
    expect(result).not.toBeNull();
    expect(result).toHaveLength(5);

    expect(result![0]).toEqual(
      expect.objectContaining({
        role: 'user',
        content: 'Please check the weather and book a flight to Tokyo.',
      }),
    );

    expect(result![1]).toEqual(
      expect.objectContaining({
        role: 'assistant',
        tool_calls: expect.arrayContaining([
          expect.objectContaining({
            id: 'call_weather_123',
            function: expect.objectContaining({
              name: 'get_weather',
              arguments: expect.stringContaining('Tokyo'),
            }),
          }),
        ]),
      }),
    );

    expect(result![2]).toEqual(
      expect.objectContaining({
        role: 'tool',
        content: 'The weather in Tokyo is sunny with 25°C.',
        tool_call_id: 'call_weather_123',
      }),
    );

    expect(result![3]).toEqual(
      expect.objectContaining({
        role: 'assistant',
        tool_calls: expect.arrayContaining([
          expect.objectContaining({
            id: 'call_flight_456',
            function: expect.objectContaining({
              name: 'book_flight',
              arguments: expect.stringContaining('Tokyo'),
            }),
          }),
        ]),
      }),
    );

    expect(result![4]).toEqual(
      expect.objectContaining({
        role: 'tool',
        content: 'Flight booked successfully. Booking ID: FL12345',
        tool_call_id: 'call_flight_456',
      }),
    );
  });

  it('handles an OpenAI Agent complex output', () => {
    expect(normalizeConversation(MOCK_OPENAI_AGENT_COMPLEX_OUTPUT, 'openai-agent')).toEqual([
      expect.objectContaining({
        role: 'assistant',
        content:
          'I checked the weather in Tokyo and booked your flight. The weather is sunny with 25°C, and your flight has been booked successfully with booking ID FL12345.',
      }),
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: openai.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/openai.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';

const MOCK_OPENAI_CHAT_INPUT = {
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'user',
      content: 'tell me a joke in 50 words',
    },
    {
      role: 'assistant',
      tool_calls: [
        {
          id: '1',
          function: {
            arguments: '{"joke_length": 50}',
            name: 'tell_joke',
          },
        },
      ],
    },
    {
      role: 'tool',
      content: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
      tool_call_id: '1',
    },
  ],
  tools: [
    {
      function: {
        name: 'tell_joke',
        description: 'Tell a joke with specified length',
        parameters: {
          type: 'object',
          properties: {
            joke_length: {
              type: 'number',
              description: 'Length of the joke in words',
            },
          },
          required: ['joke_length'],
        },
      },
      type: 'function',
    },
  ],
};

const MOCK_OPENAI_CHAT_OUTPUT = {
  id: 'chatcmpl-A8HdoWt2DsJgtZoxjjAcPdx01jkul',
  choices: [
    {
      finish_reason: 'stop',
      index: 0,
      logprobs: null,
      message: {
        content: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
        refusal: null,
        role: 'assistant',
        function_call: null,
        tool_calls: null,
      },
    },
  ],
  created: 1726537800,
  model: 'gpt-4o-mini-2024-07-18',
  object: 'chat.completion',
  service_tier: null,
  system_fingerprint: 'fp_483d39d857',
  usage: {
    completion_tokens: 17,
    prompt_tokens: 172,
    total_tokens: 189,
    completion_tokens_details: {
      accepted_prediction_tokens: 0,
      audio_tokens: 0,
      reasoning_tokens: 0,
      rejected_prediction_tokens: 0,
    },
    prompt_tokens_details: {
      audio_tokens: 0,
      cached_tokens: 0,
    },
  },
};

const MOCK_OPENAI_RESPONSES_OUTPUT = {
  id: 'resp_68916d4bd2b4819f89d9b238a190feda00db89e39031ce17',
  created_at: 1754361163,
  error: null,
  incomplete_details: null,
  instructions: null,
  metadata: {},
  model: 'o4-mini-2025-04-16',
  object: 'response',
  output: [
    {
      id: 'rs_68916d4c7ae0819f8c2a18395b3a866500db89e39031ce17',
      summary: [],
      type: 'reasoning',
      encrypted_content: null,
      status: null,
    },
    {
      id: 'msg_68916d50a8e8819f99c04a698299cf5a00db89e39031ce17',
      content: [
        {
          annotations: [],
          text: 'The capital of France is Paris.',
          type: 'output_text',
          logprobs: [],
        },
      ],
      role: 'assistant',
      status: 'completed',
      type: 'message',
    },
  ],
  parallel_tool_calls: true,
  temperature: 1,
  tool_choice: 'auto',
  tools: [],
  top_p: 1,
  background: false,
  max_output_tokens: null,
  max_tool_calls: null,
  previous_response_id: null,
  prompt: null,
  reasoning: {
    effort: 'medium',
    generate_summary: null,
    summary: null,
  },
  service_tier: 'default',
  status: 'completed',
  text: {
    format: {
      type: 'text',
    },
  },
  top_logprobs: 0,
  truncation: 'disabled',
  usage: {
    input_tokens: 13,
    input_tokens_details: {
      cached_tokens: 0,
    },
  },
  user: null,
  prompt_cache_key: null,
  safety_identifier: null,
  store: true,
};

const MOCK_OPENAI_RESPONSES_INPUT = {
  model: 'o4-mini',
  input: 'What is the capital of France?',
};

// from mlflow.types.responses.ResponsesAgentRequest
const MOCK_RESPONSE_AGENT_INPUT = {
  request: {
    tool_choice: null,
    truncation: null,
    max_output_tokens: null,
    metadata: null,
    parallel_tool_calls: null,
    tools: null,
    reasoning: null,
    store: null,
    stream: null,
    temperature: null,
    text: null,
    top_p: null,
    user: null,
    input: [
      {
        status: null,
        content: 'What is 6*7 in Python? use your tool',
        role: 'user',
        type: 'message',
      },
    ],
    custom_inputs: null,
    context: null,
  },
};

const MOCK_OPENAI_RESPONSES_STREAMING_OUTPUT = [
  {
    type: 'response.output_text.delta',
    delta: 'The',
    custom_outputs: null,
    item_id: 'a3330f22-46ee-4df7-b880-85939b69f458',
  },
  {
    type: 'response.output_text.delta',
    delta: 'capital',
    custom_outputs: null,
    item_id: 'a3330f22-46ee-4df7-b880-85939b69f458',
  },
  {
    type: 'response.output_text.delta',
    delta: 'of',
    custom_outputs: null,
    item_id: 'a3330f22-46ee-4df7-b880-85939b69f458',
  },
  {
    type: 'response.output_text.delta',
    delta: 'France',
    custom_outputs: null,
    item_id: 'a3330f22-46ee-4df7-b880-85939b69f458',
  },
  {
    type: 'response.output_text.delta',
    delta: 'is',
    custom_outputs: null,
    item_id: 'a3330f22-46ee-4df7-b880-85939b69f458',
  },
  {
    type: 'response.output_text.delta',
    delta: 'Paris.',
    custom_outputs: null,
    item_id: 'a3330f22-46ee-4df7-b880-85939b69f458',
  },
  {
    type: 'response.output_item.done',
    custom_outputs: null,
    sequence_number: 1,
    item: {
      id: 'a3330f22-46ee-4df7-b880-85939b69f458',
      type: 'message',
      status: 'completed',
      content: [{ type: 'output_text', text: 'The capital of France is Paris.' }],
      role: 'assistant',
    },
  },
];

describe('normalizeConversation', () => {
  it('handles an OpenAI chat input', () => {
    expect(normalizeConversation(MOCK_OPENAI_CHAT_INPUT, 'openai')).toEqual([
      expect.objectContaining({
        role: 'user',
        content: 'tell me a joke in 50 words',
      }),
      expect.objectContaining({
        role: 'assistant',
        tool_calls: [
          {
            id: '1',
            function: {
              arguments: expect.stringContaining('joke_length'),
              name: 'tell_joke',
            },
          },
        ],
      }),
      expect.objectContaining({
        role: 'tool',
        content: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
        tool_call_id: '1',
      }),
    ]);
  });

  it('handles an OpenAI chat output', () => {
    expect(normalizeConversation(MOCK_OPENAI_CHAT_OUTPUT, 'openai')).toEqual([
      expect.objectContaining({
        role: 'assistant',
        content: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
      }),
    ]);
  });

  it('handles an OpenAI responses formats', () => {
    expect(normalizeConversation(MOCK_OPENAI_RESPONSES_INPUT, 'openai')).toEqual([
      expect.objectContaining({
        role: 'user',
        content: 'What is the capital of France?',
      }),
    ]);
    expect(normalizeConversation(MOCK_OPENAI_RESPONSES_OUTPUT, 'openai')).toEqual([
      expect.objectContaining({
        role: 'assistant',
        content: 'The capital of France is Paris.',
      }),
    ]);
  });

  it('handles an OpenAI responses streaming output', () => {
    expect(normalizeConversation(MOCK_OPENAI_RESPONSES_STREAMING_OUTPUT, 'openai')).toEqual([
      expect.objectContaining({
        role: 'assistant',
        content: 'The capital of France is Paris.',
      }),
    ]);
  });

  it('handles a ResponsesAgent input', () => {
    expect(normalizeConversation(MOCK_RESPONSE_AGENT_INPUT, 'responses-agent')).toEqual([
      expect.objectContaining({
        role: 'user',
        content: 'What is 6*7 in Python? use your tool',
      }),
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: openai.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/openai.ts

```typescript
import { compact, get, has, isArray, isNil, isObject, isString } from 'lodash';

import type {
  OpenAIResponsesInput,
  OpenAIResponsesInputFile,
  OpenAIResponsesInputImage,
  OpenAIResponsesInputMessage,
  OpenAIResponsesInputMessageRole,
  OpenAIResponsesInputText,
  OpenAIResponsesOutputItem,
  OpenAIResponsesStreamingOutputDelta,
  OpenAIResponsesStreamingOutputDone,
} from './openai.types';
import type { ModelTraceChatMessage } from '../ModelTrace.types';
import {
  isModelTraceChatResponse,
  isModelTraceChoices,
  isRawModelTraceChatMessage,
  prettyPrintChatMessage,
  prettyPrintToolCall,
} from '../ModelTraceExplorer.utils';

// normalize the OpenAI chat input format (object with 'messages' or 'input' key)
export const normalizeOpenAIChatInput = (obj: any): ModelTraceChatMessage[] | null => {
  if (!obj) {
    return null;
  }

  const messages = obj.messages ?? obj.input ?? obj.request?.input;
  if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isRawModelTraceChatMessage)) {
    return null;
  }

  return compact(messages.map(prettyPrintChatMessage));
};

// normalize the OpenAI chat response format (object with 'choices' key)
export const normalizeOpenAIChatResponse = (obj: any): ModelTraceChatMessage[] | null => {
  if (isModelTraceChoices(obj)) {
    return obj.map((choice) => ({
      ...choice.message,
      tool_calls: choice.message.tool_calls?.map(prettyPrintToolCall),
    }));
  }

  if (!isModelTraceChatResponse(obj)) {
    return null;
  }

  return obj.choices.map((choice) => ({
    ...choice.message,
    tool_calls: choice.message.tool_calls?.map(prettyPrintToolCall),
  }));
};

const isOpenAIResponsesInputMessage = (obj: unknown): obj is OpenAIResponsesInputMessage => {
  if (has(obj, 'role') && has(obj, 'content') && ['user', 'assistant', 'system', 'developer'].includes(obj.role)) {
    return (
      isString(obj.content) ||
      (isArray(obj.content) &&
        obj.content.every(
          (item: unknown) => has(item, 'type') && ['input_text', 'input_image', 'input_file'].includes(item.type),
        ))
    );
  }

  return false;
};

export const isOpenAIResponsesInput = (obj: unknown): obj is OpenAIResponsesInput => {
  return isString(obj) || isOpenAIResponsesInputMessage(obj);
};

export const isOpenAIResponsesOutputItem = (obj: unknown): obj is OpenAIResponsesOutputItem => {
  if (!isObject(obj)) {
    return false;
  }

  if (get(obj, 'type') === 'message') {
    return isRawModelTraceChatMessage(obj);
  }

  if (get(obj, 'type') === 'function_call') {
    return isString(get(obj, 'call_id')) && isString(get(obj, 'name')) && isString(get(obj, 'arguments'));
  }

  if (get(obj, 'type') === 'function_call_output') {
    return isString(get(obj, 'call_id')) && isString(get(obj, 'output'));
  }

  if (get(obj, 'type') === 'image_generation_call') {
    const outputFormat = get(obj, 'output_format');
    return isString(get(obj, 'result')) && isString(outputFormat) && ['png', 'jpeg', 'webp'].includes(outputFormat);
  }

  if (get(obj, 'type') === 'reasoning') {
    return has(obj, 'id') && isArray(get(obj, 'summary'));
  }

  return false;
};

const normalizeOpenAIResponsesInputItem = (
  obj: OpenAIResponsesInputText | OpenAIResponsesInputFile | OpenAIResponsesInputImage,
  role: OpenAIResponsesInputMessageRole,
): ModelTraceChatMessage | null => {
  const text = get(obj, 'text');
  if (get(obj, 'type') === 'input_text' && isString(text)) {
    return prettyPrintChatMessage({
      type: 'message',
      content: [{ type: 'text', text }],
      role: role,
    });
  }

  const imageUrl = get(obj, 'image_url');
  if (get(obj, 'type') === 'input_image' && isString(imageUrl)) {
    return prettyPrintChatMessage({
      type: 'message',
      content: [{ type: 'image_url', image_url: { url: imageUrl } }],
      role: role,
    });
  }

  // TODO: file input not supported yet
  // if ('type' in obj && obj.type === 'input_file') {
  //   return prettyPrintChatMessage({ type: 'message', content: obj.file_url, role: role });
  // }

  return null;
};

const normalizeOpenAIResponsesInputMessage = (obj: OpenAIResponsesInputMessage): ModelTraceChatMessage[] | null => {
  if (isString(obj.content)) {
    const message = prettyPrintChatMessage({ type: 'message', content: obj.content, role: obj.role });
    return message && [message];
  } else {
    return obj.content.map((item) => normalizeOpenAIResponsesInputItem(item, obj.role)).filter((item) => item !== null);
  }
};

export const normalizeOpenAIResponsesInput = (obj: unknown): ModelTraceChatMessage[] | null => {
  // if the object does not have the 'input' key, then try using the object directly
  // (user may have passed in the response input directly to the span)
  const input: unknown = get(obj, 'input') ?? get(obj, 'request.input') ?? obj;

  if (isString(input)) {
    const message = prettyPrintChatMessage({ type: 'message', content: input, role: 'user' });
    return message && [message];
  }

  if (isArray(input) && input.every(isOpenAIResponsesInputMessage)) {
    return compact(input.flatMap(normalizeOpenAIResponsesInputMessage));
  }

  return null;
};

export const normalizeOpenAIResponsesOutputItem = (obj: OpenAIResponsesOutputItem): ModelTraceChatMessage | null => {
  if (obj.type === 'message') {
    return prettyPrintChatMessage(obj);
  }

  if (obj.type === 'function_call') {
    return {
      role: 'assistant',
      tool_calls: [
        prettyPrintToolCall({
          id: obj.call_id,
          function: {
            arguments: obj.arguments,
            name: obj.name,
          },
        }),
      ],
    };
  }

  if (obj.type === 'function_call_output') {
    return {
      role: 'tool',
      tool_call_id: obj.call_id,
      content: obj.output,
    };
  }

  if (obj.type === 'image_generation_call') {
    return prettyPrintChatMessage({
      type: 'message',
      content: [{ type: 'image_url', image_url: { url: `data:image/${obj.output_format};base64,${obj.result}` } }],
      role: 'tool',
    });
  }

  if (obj.type === 'reasoning') {
    // Skip reasoning entries as they don't translate to chat messages
    return null;
  }

  return null;
};

export const normalizeOpenAIResponsesOutput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (isNil(obj)) {
    return null;
  }

  // if the object does not have the 'output' key, then try using the object directly
  // (user may have passed in the response output directly to the span)
  const output: unknown = get(obj, 'output') ?? obj;

  // list of output items
  if (isArray(output) && output.length > 0 && output.every(isOpenAIResponsesOutputItem)) {
    return compact(output.map(normalizeOpenAIResponsesOutputItem).filter(Boolean));
  }

  // list of output chunks
  if (
    isArray(output) &&
    output.length > 0 &&
    output.every((chunk) => chunk.type === 'response.output_item.done' && isOpenAIResponsesOutputItem(chunk.item))
  ) {
    return compact(output.map((chunk) => normalizeOpenAIResponsesOutputItem(chunk.item)));
  }

  return null;
};

// New functions for OpenAI agent chat pattern

const isOpenAIAgentMessage = (obj: unknown): boolean => {
  if (!isObject(obj)) {
    return false;
  }

  // Check for regular message format (with optional id, status, type fields)
  if (has(obj, 'role') && has(obj, 'content') && ['user', 'assistant', 'system', 'tool'].includes(obj.role)) {
    return true;
  }

  // Check for function call format (with optional id, status fields)
  if (get(obj, 'type') === 'function_call') {
    return isString(get(obj, 'call_id')) && isString(get(obj, 'name')) && isString(get(obj, 'arguments'));
  }

  // Check for function call output format
  if (get(obj, 'type') === 'function_call_output') {
    return isString(get(obj, 'call_id')) && isString(get(obj, 'output'));
  }

  return false;
};

const isOpenAIAgentStreamingOutputDelta = (obj: unknown): obj is OpenAIResponsesStreamingOutputDelta => {
  if (!isObject(obj)) {
    return false;
  }

  return get(obj, 'type') === 'response.output_text.delta' && isString(get(obj, 'delta'));
};

const isOpenAIAgentStreamingOutputDone = (obj: unknown): obj is OpenAIResponsesStreamingOutputDone => {
  if (!isObject(obj)) {
    return false;
  }

  return get(obj, 'type') === 'response.output_item.done' && isOpenAIResponsesOutputItem(get(obj, 'item'));
};

const normalizeOpenAIAgentMessage = (obj: any): ModelTraceChatMessage | null => {
  // Handle regular message format
  if (has(obj, 'role') && has(obj, 'content')) {
    // Handle content that might be an array with output_text objects
    if (isArray(obj.content)) {
      const textContent = obj.content
        .filter((item: any) => item.type === 'output_text' && isString(item.text))
        .map((item: any) => item.text)
        .join(' ');

      if (textContent) {
        return prettyPrintChatMessage({
          ...obj,
          content: textContent,
        });
      }
    }

    // Fall back to regular prettyPrintChatMessage for string content
    return prettyPrintChatMessage(obj);
  }

  // Handle function call format
  if (get(obj, 'type') === 'function_call') {
    const callId = get(obj, 'call_id');
    const arguments_ = get(obj, 'arguments');
    const name = get(obj, 'name');

    if (isString(callId) && isString(arguments_) && isString(name)) {
      return {
        role: 'assistant',
        tool_calls: [
          prettyPrintToolCall({
            id: callId,
            function: {
              arguments: arguments_,
              name: name,
            },
          }),
        ],
      };
    }
  }

  // Handle function call output format
  if (get(obj, 'type') === 'function_call_output') {
    const callId = get(obj, 'call_id');
    const output = get(obj, 'output');

    if (isString(callId) && isString(output)) {
      return {
        role: 'tool',
        tool_call_id: callId,
        content: output,
      };
    }
  }

  return null;
};

export const normalizeOpenAIAgentInput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (isNil(obj)) {
    return null;
  }

  // Handle array of messages directly
  if (isArray(obj) && obj.length > 0 && obj.every(isOpenAIAgentMessage)) {
    return compact(obj.map(normalizeOpenAIAgentMessage));
  }

  return null;
};

export const normalizeOpenAIAgentOutput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (isNil(obj)) {
    return null;
  }

  // Handle array of messages directly
  if (isArray(obj) && obj.length > 0 && obj.every(isOpenAIAgentMessage)) {
    return compact(obj.map(normalizeOpenAIAgentMessage));
  }

  return null;
};

export const normalizeOpenAIResponsesStreamingOutput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (isNil(obj)) {
    return null;
  }

  if (
    isArray(obj) &&
    obj.length > 0 &&
    obj.every((message) => isOpenAIAgentStreamingOutputDelta(message) || isOpenAIAgentStreamingOutputDone(message)) &&
    // ensure there's at least one "done" event
    obj.some((message) => isOpenAIAgentStreamingOutputDone(message))
  ) {
    // for streaming outputs, the full text will be contained in the `response.output_item.done` event.
    // in order to conveniently display the text, we just ignore the deltas and return the full messages.
    return compact(
      obj
        .filter(isOpenAIAgentStreamingOutputDone)
        .map((done_events) => normalizeOpenAIResponsesOutputItem(done_events.item)),
    );
  }

  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: openai.types.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/openai.types.ts

```typescript
import type { RawModelTraceChatMessage } from '../ModelTrace.types';

export type OpenAIResponsesFunctionCallOutput = {
  type: 'function_call_output';
  call_id: string;
  output: string;
};

export type OpenAIResponsesFunctionCall = {
  type: 'function_call';
  call_id: string;
  name: string;
  arguments: string;
  id: string;
};

export type OpenAIResponsesImageGenerationCall = {
  type: 'image_generation_call';
  id: string;
  result: string | null;
  status: string;
  output_format: 'png' | 'jpeg' | 'webp';
};

export type OpenAIResponsesInputText = {
  text: string;
  type: 'input_text';
};

export type OpenAIResponsesInputImage = {
  detail: 'high' | 'low' | 'auto';
  type: 'input_image';
  file_id?: string;
  image_url?: string;
};

export type OpenAIResponsesInputFile = {
  type: 'input_file';
  file_data?: string;
  file_id?: string;
  file_url?: string;
  filename?: string;
};

export type OpenAIResponsesInputMessageRole = 'user' | 'assistant' | 'system' | 'developer';

export type OpenAIResponsesInputMessage = {
  content: string | (OpenAIResponsesInputText | OpenAIResponsesInputImage | OpenAIResponsesInputFile)[];
  role: OpenAIResponsesInputMessageRole;
};

// type OpenAIResponsesItem =
//   | InputMessage
//   | OutputMessage
//   | FileSearchToolCall
//   | ComputerToolCall
//   | ComputerToolCallOutput
//   | WebSearchToolCall
//   | FunctionToolCall
//   | FunctionToolCallOutput
//   | Reasoning
//   | ImageGenerationToolCall
//   | CodeInterpreterToolCall
//   | LocalShellCall
//   | LocalShellCallOutput
//   | MCPListTools
//   | MCPApprovalRequest
//   | MCPApprovalResponse
//   | MCPToolCall;

// type OpenAIResponsesItemReference = {
//   id: string;
//   type?: 'item_reference';
// };

// NOTE: these types not supported yet
export type OpenAIResponsesInput =
  | string
  | OpenAIResponsesInputMessage /* | OpenAIResponsesItem | OpenAIResponsesItemReference */[];

export type OpenAIResponsesOutputItem =
  | RawModelTraceChatMessage
  | OpenAIResponsesFunctionCall
  | OpenAIResponsesImageGenerationCall
  | OpenAIResponsesFunctionCallOutput;

export type OpenAIResponsesStreamingOutputDelta = {
  type: 'response.output_text.delta';
  delta: string;
};

export type OpenAIResponsesStreamingOutputDone = {
  type: 'response.output_item.done';
  role: 'assistant';
  item: OpenAIResponsesOutputItem;
};
```

--------------------------------------------------------------------------------

---[FILE: otel.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/otel.test.ts

```typescript
import { describe, expect, it } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';

describe('normalizeConversation (OTEL GenAI)', () => {
  it('normalizes simple text messages', () => {
    const input = [
      {
        role: 'user',
        parts: [{ type: 'text', content: 'Hello there' }],
      },
      {
        role: 'assistant',
        parts: [{ type: 'text', content: 'Hi! How can I help?' }],
      },
    ];

    const result = normalizeConversation(input);

    expect(result).toEqual([
      expect.objectContaining({ role: 'user', content: 'Hello there' }),
      expect.objectContaining({ role: 'assistant', content: 'Hi! How can I help?' }),
    ]);
  });

  it('normalizes tool call request and response', () => {
    const input = [
      {
        role: 'assistant',
        parts: [
          { type: 'text', content: 'Let me check the weather.' },
          { type: 'tool_call', id: 'call_weather_1', name: 'get_weather', arguments: { city: 'NYC' } },
        ],
      },
      {
        role: 'assistant',
        parts: [{ type: 'tool_call_response', id: 'call_weather_1', response: { tempC: 22 } }],
      },
    ];

    const result = normalizeConversation(input);
    expect(result).toHaveLength(2);

    // First message: assistant with a tool_call
    expect(result?.[0]).toEqual(
      expect.objectContaining({
        role: 'assistant',
        content: expect.stringContaining('Let me check the weather.'),
        tool_calls: [
          expect.objectContaining({
            id: 'call_weather_1',
            function: expect.objectContaining({ name: 'get_weather', arguments: expect.any(String) }),
          }),
        ],
      }),
    );

    // Second message: tool response mapped to role 'tool'
    expect(result?.[1]).toEqual(
      expect.objectContaining({
        role: 'tool',
        tool_call_id: 'call_weather_1',
        content: expect.stringContaining('tempC'),
      }),
    );
  });
});
```

--------------------------------------------------------------------------------

---[FILE: otel.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/otel.ts

```typescript
import { get, has, isArray, isNil, isObject, isString } from 'lodash';

import type { ModelTraceChatMessage, ModelTraceContentParts, ModelTraceToolCall } from '../ModelTrace.types';
import { prettyPrintChatMessage } from '../ModelTraceExplorer.utils';

// This file normalizes OpenTelemetry GenAI semantic convention input messages
// Schema reference: https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-input-messages.json
// Supported parts: TextPart, ToolCallRequestPart, ToolCallResponsePart
// Not supported (rejected): BlobPart, FilePart, UriPart, ReasoningPart, GenericPart

type OtelBasePart = { type: string } & Record<string, unknown>;

type OtelTextPart = OtelBasePart & { type: 'text'; content: string };

type OtelToolCallRequestPart = OtelBasePart & {
  type: 'tool_call';
  id?: string | null;
  name: string;
  arguments?: unknown;
};

type OtelToolCallResponsePart = OtelBasePart & {
  type: 'tool_call_response';
  id?: string | null;
  response: unknown;
};

type OTelGenAIPart = OtelTextPart | OtelToolCallRequestPart | OtelToolCallResponsePart;

type OtelGenAIMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  name?: string;
  parts: OTelGenAIPart[];
};

const isOtelTextPart = (obj: unknown): obj is OtelTextPart => {
  return isObject(obj) && get(obj, 'type') === 'text' && isString(get(obj, 'content'));
};

const isOtelToolCallRequestPart = (obj: unknown): obj is OtelToolCallRequestPart => {
  if (!isObject(obj) || get(obj, 'type') !== 'tool_call') return false;
  if (!isString(get(obj, 'name'))) return false;
  const id = get(obj, 'id');
  return isNil(id) || isString(id);
};

const isOtelToolCallResponsePart = (obj: unknown): obj is OtelToolCallResponsePart => {
  if (!isObject(obj) || get(obj, 'type') !== 'tool_call_response') return false;
  const id = get(obj, 'id');
  if (!(isNil(id) || isString(id))) return false;
  return has(obj, 'response');
};

const isSupportedOtelPart = (obj: unknown): obj is OTelGenAIPart => {
  return isOtelTextPart(obj) || isOtelToolCallRequestPart(obj) || isOtelToolCallResponsePart(obj);
};

export const isOtelGenAIChatMessage = (obj: unknown): obj is OtelGenAIMessage => {
  if (!isObject(obj)) return false;
  const role = get(obj, 'role');
  if (!isString(role) || !['system', 'user', 'assistant', 'tool'].includes(role)) return false;
  if (!has(obj, 'parts') || !isArray((obj as any).parts) || (obj as any).parts.length === 0) return false;
  return (obj as any).parts.every(isSupportedOtelPart);
};

const normalizeToolCallRequestPart = (part: OtelToolCallRequestPart): ModelTraceToolCall => {
  const args = get(part, 'arguments') as unknown;
  let argumentsStr = '';
  try {
    argumentsStr = JSON.stringify(args ?? {});
  } catch {
    argumentsStr = String(args);
  }
  return {
    id: String(get(part, 'id') ?? get(part, 'name') ?? ''),
    function: {
      name: String(get(part, 'name')),
      arguments: argumentsStr,
    },
  };
};
const normalizeToolCallResponsePart = (part: OtelToolCallResponsePart): ModelTraceChatMessage => {
  const callId = String(get(part, 'id') ?? '');
  const response = get(part, 'response');
  const content = isString(response)
    ? response
    : (() => {
        try {
          return JSON.stringify(response);
        } catch {
          return String(response);
        }
      })();
  return {
    role: 'tool',
    tool_call_id: callId,
    content,
  };
};

// Convert a single OTEL GenAI message into a single UI message.
export const normalizeOtelGenAIChatMessage = (obj: OtelGenAIMessage): ModelTraceChatMessage | null => {
  if (!isOtelGenAIChatMessage(obj)) return null;
  const role: ModelTraceChatMessage['role'] = obj.role as any;

  const contentParts: ModelTraceContentParts[] = [];
  const toolCalls: ModelTraceToolCall[] = [];
  let toolResultMessage: ModelTraceChatMessage | null = null;

  for (const part of obj.parts) {
    if (isOtelTextPart(part)) {
      contentParts.push({ type: 'text', text: part.content });
      continue;
    }
    if (isOtelToolCallRequestPart(part)) {
      toolCalls.push(normalizeToolCallRequestPart(part));
      continue;
    }
    if (isOtelToolCallResponsePart(part)) {
      toolResultMessage = normalizeToolCallResponsePart(part);
      continue;
    }
  }

  if (toolResultMessage && contentParts.length === 0 && toolCalls.length === 0) {
    return toolResultMessage;
  }

  return prettyPrintChatMessage({
    type: 'message',
    role,
    ...(obj.name && { name: obj.name }),
    ...(contentParts.length > 0 && { content: contentParts }),
    ...(toolCalls.length > 0 && { tool_calls: toolCalls }),
  });
};
```

--------------------------------------------------------------------------------

---[FILE: otel.types.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/otel.types.ts

```typescript
// Type definitions for OpenTelemetry GenAI semantic convention input messages
// Schema reference: https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-input-messages.json

export type OtelBasePart = { type: string } & Record<string, unknown>;

export type OtelTextPart = OtelBasePart & { type: 'text'; content: string };

export type OtelToolCallRequestPart = OtelBasePart & {
  type: 'tool_call' | 'function_call';
  id?: string | null;
  name: string;
  arguments?: unknown;
};

export type OtelToolCallResponsePart = OtelBasePart & {
  type: 'tool_call_response';
  id?: string | null;
  response: unknown;
};

export type SupportedOtelPart = OtelTextPart | OtelToolCallRequestPart | OtelToolCallResponsePart;

export type OtelGenAIMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  name?: string;
  parts: SupportedOtelPart[];
};
```

--------------------------------------------------------------------------------

````
