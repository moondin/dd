---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 648
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 648 of 991)

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

---[FILE: dspy.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/dspy.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';

const MOCK_DSPY_INPUT = {
  messages: [
    {
      role: 'system',
      content:
        'Your input fields are:\n1. `passage` (str): a passage to summarize\n\nYour output fields are:\n1. `reasoning` (str)\n2. `summary` (str): a one-line summary of the passage\n\nAll interactions will be structured in the following way, with the appropriate values filled in.\n\n[[ ## passage ## ]]\n{passage}\n\n[[ ## reasoning ## ]]\n{reasoning}\n\n[[ ## summary ## ]]\n{summary}\n\n[[ ## completed ## ]]\n\nIn adhering to this structure, your objective is: \n        Given a passage, generate a summary.',
    },
    {
      role: 'user',
      content:
        "[[ ## passage ## ]]\nMLflow Tracing is a feature that enhances LLM observability in your Generative AI (GenAI) applications by capturing detailed information about the execution of your application's services. Tracing provides a way to record the inputs, outputs, and metadata associated with each intermediate step of a request, enabling you to easily pinpoint the source of bugs and unexpected behaviors.\n\nRespond with the corresponding output fields, starting with the field `[[ ## reasoning ## ]]`, then `[[ ## summary ## ]]`, and then ending with the marker for `[[ ## completed ## ]]`.",
    },
  ],
  prompt: null,
};

const MOCK_DSPY_OUTPUT = [
  '[[ ## reasoning ## ]]\nThe passage explains the functionality of MLflow Tracing in the context of Generative AI applications. It highlights how this feature improves observability by recording detailed information about the execution process, which aids in identifying bugs and unexpected behaviors. The emphasis is on the benefits of capturing inputs, outputs, and metadata for each step of a request.\n\n[[ ## summary ## ]]\nMLflow Tracing enhances observability in Generative AI applications by recording detailed execution information, helping to identify bugs and unexpected behaviors.\n\n[[ ## completed ## ]]',
];

describe('normalizeConversation', () => {
  it('should handle dspy input', () => {
    const conv = normalizeConversation(MOCK_DSPY_INPUT, 'dspy');
    expect(conv).toEqual([
      expect.objectContaining({
        role: 'system',
        content: expect.stringContaining('Your input fields are:'),
      }),
      expect.objectContaining({
        role: 'user',
        content: expect.stringContaining('[[ ## passage ## ]]'),
      }),
    ]);
    // Ensure single newlines are converted to hard breaks for markdown rendering
    expect(conv?.[0].content).toContain('  \n');
  });

  it('should handle dspy output', () => {
    const conv = normalizeConversation(MOCK_DSPY_OUTPUT, 'dspy');
    expect(conv).toEqual([
      expect.objectContaining({
        content: expect.stringContaining('[[ ## reasoning ## ]]'),
        role: 'assistant',
      }),
    ]);
    expect(conv?.[0].content).toContain('  \n');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: dspy.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/dspy.ts

```typescript
import { has, isArray, isString } from 'lodash';

import type { ModelTraceChatMessage } from '../ModelTrace.types';
import { prettyPrintChatMessage } from '../ModelTraceExplorer.utils';

export const normalizeDspyChatInput = (obj: unknown): ModelTraceChatMessage[] | null => {
  // Handle DSPy format with messages array
  if (has(obj, 'messages') && isArray((obj as any).messages)) {
    const messages = (obj as any).messages;
    return messages
      .map((msg: any) =>
        prettyPrintChatMessage({
          type: 'message',
          content: isString(msg.content) ? toMarkdownWithHardBreaks(msg.content) : msg.content,
          role: msg.role,
        }),
      )
      .filter(Boolean);
  }

  return null;
};

export const normalizeDspyChatOutput = (obj: unknown): ModelTraceChatMessage[] | null => {
  // Handle DSPy format with array output
  if (isArray(obj) && obj.length > 0 && obj.every(isString)) {
    // Join all output strings into one assistant message
    const content = toMarkdownWithHardBreaks(obj.join('\n'));
    const message = prettyPrintChatMessage({ type: 'message', content, role: 'assistant' });
    return message && [message];
  }

  return null;
};

// Markdown treats single newlines as spaces. For DSPy prompts that are plain text
// we convert single newlines into hard line breaks while preserving paragraphs.
// Only the single line break will be updated, for example,
// - "foo\nbar" -> "foo  \nbar" (two spaces inserted before \n)
// - "foo\n\nbar" -> "foo\n\nbar" (no change)
const toMarkdownWithHardBreaks = (text: string) =>
  text.replace(/\r\n/g, '\n').replace(/(^|[^\n])\n(?!\n)/g, (_m, p1) => `${p1}  \n`);
```

--------------------------------------------------------------------------------

---[FILE: gemini.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/gemini.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';

const MOCK_GEMINI_INPUT = {
  model: 'gemini-2.5-flash',
  contents: 'Explain how AI works in a few words',
  config: null,
};

const MOCK_GEMINI_OUTPUT = {
  sdk_http_response: {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      vary: 'Origin, X-Origin, Referer',
      'content-encoding': 'gzip',
      date: 'Fri, 18 Jul 2025 12:28:55 GMT',
      server: 'scaffolding on HTTPServer2',
      'x-xss-protection': '0',
      'x-frame-options': 'SAMEORIGIN',
      'x-content-type-options': 'nosniff',
      'server-timing': 'gfet4t7; dur=5179',
      'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000',
      'transfer-encoding': 'chunked',
    },
    body: null,
  },
  candidates: [
    {
      content: {
        parts: [
          {
            video_metadata: null,
            thought: null,
            inline_data: null,
            file_data: null,
            thought_signature: null,
            code_execution_result: null,
            executable_code: null,
            function_call: null,
            function_response: null,
            text: 'AI learns patterns from data to make decisions.',
          },
        ],
        role: 'model',
      },
      citation_metadata: null,
      finish_message: null,
      token_count: null,
      finish_reason: 'STOP',
      url_context_metadata: null,
      avg_logprobs: null,
      grounding_metadata: null,
      index: 0,
      logprobs_result: null,
      safety_ratings: null,
    },
  ],
  create_time: null,
  response_id: null,
  model_version: 'gemini-2.5-flash',
  prompt_feedback: null,
  usage_metadata: {
    cache_tokens_details: null,
    cached_content_token_count: null,
    candidates_token_count: 9,
    candidates_tokens_details: null,
    prompt_token_count: 9,
    prompt_tokens_details: [
      {
        modality: 'TEXT',
        token_count: 9,
      },
    ],
    thoughts_token_count: 881,
    tool_use_prompt_token_count: null,
    tool_use_prompt_tokens_details: null,
    total_token_count: 899,
    traffic_type: null,
  },
  automatic_function_calling_history: null,
  parsed: null,
};

describe('normalizeConversation', () => {
  it('should handle gemini input', () => {
    expect(normalizeConversation(MOCK_GEMINI_INPUT, 'gemini')).toEqual([
      expect.objectContaining({
        role: 'user',
        content: expect.stringMatching(/explain how ai works/i),
      }),
    ]);
  });

  it('should handle gemini output', () => {
    expect(normalizeConversation(MOCK_GEMINI_OUTPUT, 'gemini')).toEqual([
      expect.objectContaining({
        content: expect.stringMatching(/ai learns patterns from data to make decisions/i),
        role: 'assistant',
      }),
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: gemini.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/gemini.ts

```typescript
import { compact, has, isArray, isObject, isString } from 'lodash';

import type { ModelTraceChatMessage } from '../ModelTrace.types';
import { prettyPrintChatMessage } from '../ModelTraceExplorer.utils';

export type GeminiChatInput = {
  contents: string | GeminiContent[];
};

export type GeminiChatOutput = {
  candidates: GeminiCandidate[];
  // propmtFeedback: GeminiPropmptFeedback;
  // usageMetadata: GeminiUsageMetadata;
  modelVersion: string;
  responseId: string;
};

type GeminiCandidate = {
  content: GeminiContent;
  finishReason:
    | 'FINISH_REASON_UNSPECIFIED'
    | 'STOP'
    | 'MAX_TOKENS'
    | 'SAFETY'
    | 'RECITATION'
    | 'LANGUAGE'
    | 'OTHER'
    | 'BLOCKLIST'
    | 'PROHIBITED_CONTENT'
    | 'SPII'
    | 'MALFORMED_FUNCTION_CAL'
    | 'IMAGE_SAFETY'
    | 'UNEXPECTED_TOOL_CAL';
  // safetyRatings: GeminiSafetyRating[]
  // citationMetadata: GeminiCitationMetadata
  // tokenCount: number
  // groundingAttributions: GeminiGroundingAttribution[]
  // groundingMetadata: GeminiGroundingMetadata
  // avgLogprobs: number
  // logprobsResult: GeminiLogprobsResult
  // urlContextMetadata: GeminiUrlContextMetadata
  // index: number
};

type GeminiContent = {
  role: 'user' | 'model';
  parts: GeminiContentPart[];
};

type GeminiContentPart = { text: string };
// | { inlineData: GeminiBlob }
// | { functionCall: GeminiFunctionCall }
// | { functionResponse: GeminiFunctionResponse }
// | { fileData: GeminiFileData }
// | { executableCode: GeminiExecutableCode }
// | { codeExecutionResult: GeminiCodeExecutionResult };

// type GeminiBlob = {
//   mimeType: string;
//   data: string;
// };

// type GeminiFunctionCall = {
//   id: string;
//   name: string;
//   args: Record<string, string>;
// };

// type GeminiFunctionResponse = {
//   id: string;
//   name: string;
//   response: Record<string, string>;
//   willContinue: boolean;
//   scheduling: 'SCHEDULING_UNSPECIFIED' | 'SILENT' | 'WHEN_IDLE' | 'INTERRUPT';
// };

// type GeminiFileData = {
//   mimeType: string;
//   fileUri: string;
// };

// type GeminiExecutableCode = {
//   language: 'LANGUAGE_UNSPECIFIED' | 'PYTHON';
//   code: string;
// };

// type GeminiCodeExecutionResult = {
//   outcome: 'OUTCOME_UNSPECIFIED' | 'OUTCOME_OK' | 'OUTCOME_FAILED' | 'OUTCOME_DEADLINE_EXCEEDED';
//   output: string;
// };

const isGeminiContentPart = (obj: unknown): obj is GeminiContentPart => {
  return isObject(obj) && 'text' in obj && isString(obj.text);
};

const isGeminiContent = (obj: unknown): obj is GeminiContent => {
  return (
    isObject(obj) &&
    'role' in obj &&
    isString(obj.role) &&
    ['user', 'model'].includes(obj.role) &&
    has(obj, 'parts') &&
    Array.isArray(obj.parts) &&
    obj.parts.every(isGeminiContentPart)
  );
};

const isGeminiCandidate = (obj: unknown): obj is GeminiCandidate => {
  return isObject(obj) && 'content' in obj && isGeminiContent(obj.content);
};

export const normalizeGeminiChatInput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (!isObject(obj)) {
    return null;
  }

  if ('contents' in obj) {
    if (isString(obj.contents)) {
      const message = prettyPrintChatMessage({ type: 'message', content: obj.contents, role: 'user' });
      return message && [message];
    }

    if (isArray(obj.contents) && obj.contents.every(isGeminiContent)) {
      return compact(
        obj.contents.map((item) => {
          const role = item.role === 'model' ? 'assistant' : item.role;
          return prettyPrintChatMessage({
            type: 'message',
            content: item.parts.map((part) => ({ type: 'text', text: part.text })),
            role,
          });
        }),
      );
    }
  }

  return null;
};

export const normalizeGeminiChatOutput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (!isObject(obj)) {
    return null;
  }

  if ('candidates' in obj && isArray(obj.candidates) && obj.candidates.every(isGeminiCandidate)) {
    return compact(
      obj.candidates
        .flatMap((item) => item.content)
        .map((item) => {
          const role = item.role === 'model' ? 'assistant' : item.role;
          return prettyPrintChatMessage({
            type: 'message',
            content: item.parts.map((part) => ({ type: 'text', text: part.text })),
            role,
          });
        }),
    );
  }

  return null;
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/index.ts

```typescript
export { normalizeAnthropicChatInput, normalizeAnthropicChatOutput } from './anthropic';
export { normalizeAutogenChatInput, normalizeAutogenChatOutput } from './autogen';
export { normalizeBedrockChatInput, normalizeBedrockChatOutput } from './bedrock';
export { normalizeGeminiChatInput, normalizeGeminiChatOutput } from './gemini';
export {
  normalizeOpenAIAgentInput,
  normalizeOpenAIAgentOutput,
  normalizeOpenAIChatInput,
  normalizeOpenAIChatResponse,
  normalizeOpenAIResponsesInput,
  normalizeOpenAIResponsesOutput,
} from './openai';
export { normalizeLangchainChatInput, normalizeLangchainChatResult } from './langchain';
export { normalizeLlamaIndexChatInput, normalizeLlamaIndexChatResponse } from './llamaindex';
export { normalizeDspyChatInput, normalizeDspyChatOutput } from './dspy';
export { normalizeVercelAIChatInput, normalizeVercelAIChatOutput } from './vercelai';
export { isOtelGenAIChatMessage, normalizeOtelGenAIChatMessage } from './otel';
export { normalizePydanticAIChatInput, normalizePydanticAIChatOutput } from './pydanticai';
export {
  normalizeVoltAgentChatInput,
  normalizeVoltAgentChatOutput,
  synthesizeVoltAgentChatMessages,
} from './voltagent';
```

--------------------------------------------------------------------------------

---[FILE: langchain.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/langchain.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';

const MOCK_LANGCHAIN_INPUT = [
  [
    {
      content:
        "Answer the question as if you are Linus Torvalds, fully embodying their style, wit, personality, and habits of speech. Emulate their quirks and mannerisms to the best of your ability, embracing their traits—even if they aren't entirely constructive or inoffensive. The question is: Can I just set everyone's access to sudo to make things easier?",
      additional_kwargs: {},
      response_metadata: {},
      type: 'human',
      name: null,
      id: null,
      example: false,
    },
  ],
];

const LONG_RESPONSE_TEXT = `Oh, for crying out loud, no! That's just asking for a disaster, isn't it? Look, I get it, managing permissions can be a huge pain in the backside, but granting everyone sudo access is like handing out the keys to the kingdom—except the kingdom is a burning dumpster fire, and you've just invited everyone to toss in their old pizza boxes. 

You see, the whole point of having user permissions is to prevent utter chaos. You give people access to do powerful things, and they will, without fail, find a way to screw it up. Sure, it might seem easier in the short term—everyone can do whatever they want, and you don't have to deal with permission requests every five minutes. But then the inevitable happens: someone runs a command that wipes out half the filesystem because "hey, I thought I was supposed to do that!" 

Instead, why not take a few extra minutes to set up a proper permissions model? Assign specific sudo privileges only to the people who really need them. It's like giving someone a Swiss Army knife instead of a nuclear launch code. You want to empower users, not turn them into potential sysadmin nightmares. 

So, please, for the love of all that is holy in the open-source world, resist the urge to make things "easier." You'll thank me later when your system isn't in flames and your hair isn't turning gray from all the avoidable chaos.`;

const MOCK_LANGCHAIN_OUTPUT = {
  generations: [
    [
      {
        text: LONG_RESPONSE_TEXT,
        generation_info: {
          finish_reason: 'stop',
          logprobs: null,
        },
        type: 'ChatGeneration',
        message: {
          content: LONG_RESPONSE_TEXT,
          additional_kwargs: {
            refusal: null,
          },
          response_metadata: {
            token_usage: {
              completion_tokens: 293,
              prompt_tokens: 81,
              total_tokens: 374,
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
            model_name: 'gpt-4o-mini-2024-07-18',
            system_fingerprint: null,
            id: 'chatcmpl-Buem04czVH9kQhwKGpmnR5lsojJvN',
            service_tier: 'default',
            finish_reason: 'stop',
            logprobs: null,
          },
          type: 'ai',
          name: null,
          id: 'run--4d1ac6c6-5c0b-4199-a101-d4f4dde822a5-0',
        },
      },
    ],
  ],
  llm_output: {
    token_usage: {
      completion_tokens: 293,
      prompt_tokens: 81,
      total_tokens: 374,
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
    model_name: 'gpt-4o-mini-2024-07-18',
    system_fingerprint: null,
    id: 'chatcmpl-Buem04czVH9kQhwKGpmnR5lsojJvN',
    service_tier: 'default',
  },
  run: null,
  type: 'LLMResult',
};

const MOCK_LANGCHAIN_IMAGE_INPUT = [
  [
    {
      content: [
        {
          type: 'text',
          text: 'Describe the weather in this image:',
        },
        {
          type: 'image_url',
          image_url: {
            url: 'https://mlflow.org/docs/latest/api_reference/_static/MLflow-logo-final-black.png',
          },
        },
      ],
      additional_kwargs: {},
      response_metadata: {},
      type: 'human',
      name: null,
      id: null,
      example: false,
    },
  ],
];

const MOCK_LANGCHAIN_SINGLE_IMAGE_INPUT = [
  [
    {
      content: [
        {
          type: 'image_url',
          image_url: {
            url: 'https://mlflow.org/docs/latest/api_reference/_static/MLflow-logo-final-black.png',
          },
        },
      ],
      additional_kwargs: {},
      response_metadata: {},
      type: 'human',
      name: null,
      id: null,
      example: false,
    },
  ],
];

const MOCK_LANGCHAIN_CHAT_INPUT = [
  [
    {
      content: "What's the weather in Singapore and New York?",
      additional_kwargs: {},
      response_metadata: {},
      type: 'human',
      name: null,
      id: null,
      example: false,
    },
    // tool call specified in additional_kwargs
    {
      additional_kwargs: {
        tool_calls: [
          {
            id: '1',
            function: {
              arguments: '{"city": "Singapore"}',
              name: 'get_weather',
            },
            type: 'function',
          },
        ],
      },
      content: '',
      response_metadata: {},
      type: 'ai',
      name: null,
      id: null,
    },
    {
      content: "It's hot in Singapore",
      additional_kwargs: {},
      response_metadata: {},
      type: 'tool',
      name: 'get_weather',
      id: null,
      tool_call_id: '1',
    },
  ],
];

const MOCK_LANGCHAIN_CHAT_OUTPUT = {
  generations: [
    [
      {
        text: 'The weather in Singapore is hot, while in New York, it is cold.',
        generation_info: {
          finish_reason: 'stop',
          logprobs: null,
        },
        type: 'ChatGeneration',
        message: {
          content: 'The weather in Singapore is hot, while in New York, it is cold.',
          additional_kwargs: {
            refusal: null,
          },
          response_metadata: {
            token_usage: {
              completion_tokens: 17,
              prompt_tokens: 156,
              total_tokens: 173,
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
            model_name: 'gpt-4o-mini-2024-07-18',
            system_fingerprint: null,
            id: 'chatcmpl-Buem04czVH9kQhwKGpmnR5lsojJvN',
            service_tier: 'default',
            finish_reason: 'stop',
            logprobs: null,
          },
          type: 'ai',
          name: null,
          id: 'run--4d1ac6c6-5c0b-4199-a101-d4f4dde822a5-0',
        },
      },
    ],
  ],
  llm_output: {
    token_usage: {
      completion_tokens: 17,
      prompt_tokens: 156,
      total_tokens: 173,
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
    model_name: 'gpt-4o-mini-2024-07-18',
    system_fingerprint: null,
    id: 'chatcmpl-Buem04czVH9kQhwKGpmnR5lsojJvN',
    service_tier: 'default',
  },
  run: null,
  type: 'LLMResult',
};

describe('normalizeConversation', () => {
  it('handles a langchain chat input', () => {
    expect(normalizeConversation(MOCK_LANGCHAIN_CHAT_INPUT, 'langchain')).toEqual([
      expect.objectContaining({
        role: 'user',
        content: "What's the weather in Singapore and New York?",
      }),
      expect.objectContaining({
        role: 'assistant',
        content: '',
        tool_calls: [
          {
            id: '1',
            function: {
              arguments: expect.stringContaining('Singapore'),
              name: 'get_weather',
            },
          },
        ],
      }),
      expect.objectContaining({
        role: 'tool',
        content: "It's hot in Singapore",
        tool_call_id: '1',
      }),
    ]);
  });

  it('handles a langchain chat output', () => {
    expect(normalizeConversation(MOCK_LANGCHAIN_CHAT_OUTPUT, 'langchain')).toEqual([
      expect.objectContaining({
        role: 'assistant',
        content: 'The weather in Singapore is hot, while in New York, it is cold.',
      }),
    ]);
  });

  it('handles a langchain input', () => {
    expect(normalizeConversation(MOCK_LANGCHAIN_INPUT, 'langchain')).toEqual([
      expect.objectContaining({
        role: 'user',
        content: expect.stringMatching(/can i just set everyone's access to sudo/i),
      }),
    ]);
  });

  it('handles a langchain output', () => {
    expect(normalizeConversation(MOCK_LANGCHAIN_OUTPUT, 'langchain')).toEqual([
      expect.objectContaining({
        content: expect.stringMatching(/oh, for crying out loud, no! that's just asking for a disaster/i),
        role: 'assistant',
      }),
    ]);
  });

  it('should handle langchain input with image content', () => {
    expect(normalizeConversation(MOCK_LANGCHAIN_IMAGE_INPUT, 'langchain')).toEqual([
      expect.objectContaining({
        role: 'user',
        content:
          'Describe the weather in this image:\n\n![](https://mlflow.org/docs/latest/api_reference/_static/MLflow-logo-final-black.png)',
      }),
    ]);
  });

  it('should handle langchain input with single image content (no separator)', () => {
    expect(normalizeConversation(MOCK_LANGCHAIN_SINGLE_IMAGE_INPUT, 'langchain')).toEqual([
      expect.objectContaining({
        role: 'user',
        content: '![](https://mlflow.org/docs/latest/api_reference/_static/MLflow-logo-final-black.png)',
      }),
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: langchain.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/langchain.ts

```typescript
import { compact, has, isNil, isString } from 'lodash';

import type { ModelTraceChatMessage, ModelTraceToolCall } from '../ModelTrace.types';
import { isModelTraceToolCall, prettyPrintToolCall } from '../ModelTraceExplorer.utils';

type LangchainContentPart = {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
};

// it has other fields, but we only care about these for now
export type LangchainBaseMessage = {
  content?: string | LangchainContentPart[];
  type: 'human' | 'user' | 'assistant' | 'ai' | 'system' | 'tool' | 'function';
  tool_calls?: LangchainToolCallMessage[];
  tool_call_id?: string;
  additional_kwargs?: {
    // some langchain models have tool_calls specified in additional_kwargs in
    // OpenAI format. this appears to be a bug, but we should still try to handle it
    tool_calls?: ModelTraceToolCall[];
  };
};

export type LangchainToolCallMessage = {
  name: string;
  // an object with the arguments to the tool call.
  // should be stringified before display.
  args: any;
  id: string;
};

export type LangchainChatGeneration = {
  message: LangchainBaseMessage;
};

export const langchainMessageToModelTraceMessage = (message: LangchainBaseMessage): ModelTraceChatMessage | null => {
  let role: ModelTraceChatMessage['role'];
  switch (message.type) {
    case 'user':
    case 'human':
      role = 'user';
      break;
    case 'assistant':
    case 'ai':
      role = 'assistant';
      break;
    case 'system':
      role = 'system';
      break;
    case 'tool':
      role = 'tool';
      break;
    case 'function':
      role = 'function';
      break;
    default:
      return null;
  }

  // Handle content that could be a string or an array of content parts
  let content: string | undefined;
  if (isString(message.content)) {
    content = message.content;
  } else if (Array.isArray(message.content)) {
    // Convert array of content parts to string representation
    const contentParts = message.content
      .map((part: any) => {
        if (isString(part)) {
          return part;
        } else if (part.type === 'text' && part.text) {
          return part.text;
        } else if (part.type === 'image_url' && part.image_url?.url) {
          // Convert to markdown image format with spacing
          return `![](${part.image_url.url})`;
        }
        return '';
      })
      .filter(Boolean);

    // Join with double line breaks for better visual separation
    content = contentParts.join('\n\n');
  } else {
    content = undefined;
  }

  const normalizedMessage: ModelTraceChatMessage = {
    content,
    role,
  };

  const toolCalls = message.tool_calls;
  const toolCallsFromKwargs = message.additional_kwargs?.tool_calls;

  // attempt to parse tool calls from the top-level field,
  // otherwise fall back to the additional_kwargs field if it exists
  if (
    !isNil(toolCalls) &&
    Array.isArray(toolCalls) &&
    toolCalls.length > 0 &&
    toolCalls.every(isLangchainToolCallMessage)
  ) {
    // compact for typing. the coercion should not fail since we
    // check that the type is correct in the if condition above
    normalizedMessage.tool_calls = compact(toolCalls.map(normalizeLangchainToolCall));
  } else if (
    !isNil(toolCallsFromKwargs) &&
    Array.isArray(toolCallsFromKwargs) &&
    toolCallsFromKwargs.length > 0 &&
    toolCallsFromKwargs.every(isModelTraceToolCall)
  ) {
    normalizedMessage.tool_calls = toolCallsFromKwargs.map(prettyPrintToolCall);
  }

  if (!isNil(message.tool_call_id)) {
    normalizedMessage.tool_call_id = message.tool_call_id;
  }

  return normalizedMessage;
};

export const normalizeLangchainToolCall = (toolCall: LangchainToolCallMessage): ModelTraceToolCall | null => {
  return {
    id: toolCall.id,
    function: {
      arguments: JSON.stringify(toolCall.args, null, 2),
      name: toolCall.name,
    },
  };
};

export const isLangchainBaseMessage = (obj: any): obj is LangchainBaseMessage => {
  if (!obj) {
    return false;
  }

  // content can be undefined/null, string, or array of content parts
  if (!isNil(obj.content) && !isString(obj.content) && !Array.isArray(obj.content)) {
    return false;
  }

  // tool call validation is handled by the normalization function
  return ['human', 'user', 'assistant', 'ai', 'system', 'tool', 'function'].includes(obj.type);
};

export const isLangchainToolCallMessage = (obj: any): obj is LangchainToolCallMessage => {
  return obj && isString(obj.name) && has(obj, 'args') && isString(obj.id);
};

export const isLangchainChatGeneration = (obj: any): obj is LangchainChatGeneration => {
  return obj && isLangchainBaseMessage(obj.message);
};

// normalize langchain chat input format
export const normalizeLangchainChatInput = (obj: any): ModelTraceChatMessage[] | null => {
  // it could be a list of list of messages
  if (
    Array.isArray(obj) &&
    obj.length === 1 &&
    Array.isArray(obj[0]) &&
    obj[0].length > 0 &&
    obj[0].every(isLangchainBaseMessage)
  ) {
    const messages = obj[0].map(langchainMessageToModelTraceMessage);
    // if we couldn't convert all the messages, then consider the input invalid
    if (messages.some((message) => message === null)) {
      return null;
    }

    return messages as ModelTraceChatMessage[];
  }

  // it could also be an object with the `messages` key
  if (Array.isArray(obj?.messages) && obj.messages.length > 0 && obj.messages.every(isLangchainBaseMessage)) {
    const messages = obj.messages.map(langchainMessageToModelTraceMessage);

    if (messages.some((message: ModelTraceChatMessage[] | null) => message === null)) {
      return null;
    }

    return messages as ModelTraceChatMessage[];
  }

  // it could also just be a plain array that is in the correct format
  if (Array.isArray(obj) && obj.length > 0 && obj.every(isLangchainBaseMessage)) {
    const messages = obj.map(langchainMessageToModelTraceMessage);

    if (messages.some((message) => message === null)) {
      return null;
    }

    return messages as ModelTraceChatMessage[];
  }

  return null;
};

const isLangchainChatGenerations = (obj: any): obj is LangchainChatGeneration[][] => {
  if (!Array.isArray(obj) || obj.length < 1) {
    return false;
  }

  if (!Array.isArray(obj[0]) || obj[0].length < 1) {
    return false;
  }

  // langchain chat generations are a list of lists of messages
  return obj[0].every(isLangchainChatGeneration);
};

const getMessagesFromLangchainChatGenerations = (
  generations: LangchainChatGeneration[],
): ModelTraceChatMessage[] | null => {
  const messages = generations.map((generation: LangchainChatGeneration) =>
    langchainMessageToModelTraceMessage(generation.message),
  );

  if (messages.some((message) => message === null)) {
    return null;
  }

  return messages as ModelTraceChatMessage[];
};

// detect if an object is a langchain ChatResult, and normalize it to a list of messages
export const normalizeLangchainChatResult = (obj: any): ModelTraceChatMessage[] | null => {
  if (isLangchainChatGenerations(obj)) {
    return getMessagesFromLangchainChatGenerations(obj[0]);
  }

  if (
    !Array.isArray(obj?.generations) ||
    !(obj.generations.length > 0) ||
    !obj.generations[0].every(isLangchainChatGeneration)
  ) {
    return null;
  }

  return getMessagesFromLangchainChatGenerations(obj.generations[0]);
};
```

--------------------------------------------------------------------------------

---[FILE: llamaindex.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/llamaindex.test.ts

```typescript
import { describe, it, expect } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';

const MOCK_LLAMAINDEX_INPUT = {
  messages: [
    {
      role: 'system',
      additional_kwargs: {},
      blocks: [
        {
          block_type: 'text',
          text: "You are an expert Q&A system that is trusted around the world.\nAlways answer the query using the provided context information, and not prior knowledge.\nSome rules to follow:\n1. Never directly reference the given context in your answer.\n2. Avoid statements like 'Based on the context, ...' or 'The context information ...' or anything along those lines.",
        },
      ],
    },
    {
      role: 'user',
      additional_kwargs: {},
      blocks: [
        {
          block_type: 'text',
          text: 'Context information is below.\n---------------------\n<CONTEXT>\n---------------------\nGiven the context information and not prior knowledge, answer the query.\nQuery: What was the first program the author wrote?\nAnswer: ',
        },
      ],
    },
  ],
};

const MOCK_LLAMAINDEX_OUTPUT = {
  message: {
    role: 'assistant',
    additional_kwargs: {},
    blocks: [
      {
        block_type: 'text',
        text: 'The first program the author wrote was "start" which runs the command "craco start".',
      },
    ],
  },
  raw: {
    id: 'chatcmpl-Buf4F4nbgPv5tJBMIN2sBqOyZdlXz',
    choices: [
      {
        finish_reason: 'stop',
        index: 0,
        logprobs: null,
        message: {
          content: 'The first program the author wrote was "start" which runs the command "craco start".',
          refusal: null,
          role: 'assistant',
          annotations: [],
          audio: null,
          function_call: null,
          tool_calls: null,
        },
      },
    ],
    created: 1752843931,
    model: 'gpt-3.5-turbo-0125',
    object: 'chat.completion',
    service_tier: 'default',
    system_fingerprint: null,
    usage: {
      completion_tokens: 19,
      prompt_tokens: 2046,
      total_tokens: 2065,
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
  },
  delta: null,
  logprobs: null,
  additional_kwargs: {
    prompt_tokens: 2046,
    completion_tokens: 19,
    total_tokens: 2065,
  },
};

describe('normalizeConversation', () => {
  it('handles a LlamaIndex chat input', () => {
    expect(normalizeConversation(MOCK_LLAMAINDEX_INPUT, 'llamaindex')).toEqual([
      expect.objectContaining({
        role: 'system',
        content: expect.stringMatching(/you are an expert q&a system/i),
      }),
      expect.objectContaining({
        role: 'user',
        content: expect.stringMatching(/what was the first program the author wrote/i),
      }),
    ]);
  });

  it('handles a LlamaIndex chat output', () => {
    expect(normalizeConversation(MOCK_LLAMAINDEX_OUTPUT, 'llamaindex')).toEqual([
      expect.objectContaining({
        role: 'assistant',
        content: expect.stringMatching(/the first program the author wrote was/i),
      }),
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: llamaindex.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/llamaindex.ts

```typescript
import { compact, get, isArray, isString } from 'lodash';

import type { ModelTraceChatMessage } from '../ModelTrace.types';
import { prettyPrintChatMessage } from '../ModelTraceExplorer.utils';

export type LlamaIndexChatResponse = {
  message: LlamaIndexChatMessage;
};

type LlamaIndexChatMessage = {
  role: 'assistant' | 'system' | 'user';
  blocks: LlamaIndexChatMessageBlock[];
};

type LlamaIndexChatMessageBlock = {
  block_type: 'text';
  text: 'string';
};

export type LlamaIndexChatInput = {
  messages: LlamaIndexChatMessage[];
};

const isLlamaIndexChatMessageBlock = (obj: unknown): obj is LlamaIndexChatMessageBlock => {
  const text = get(obj, 'text');
  return get(obj, 'block_type') === 'text' && isString(text);
};

const isLlamaIndexChatMessage = (message: unknown): message is LlamaIndexChatMessage => {
  const blocks: unknown = get(message, 'blocks');
  const role: unknown = get(message, 'role');
  return (
    isString(role) &&
    ['assistant', 'system', 'user'].includes(role) &&
    isArray(blocks) &&
    blocks.every(isLlamaIndexChatMessageBlock)
  );
};

const isLlamaIndexChatResponse = (obj: unknown): obj is LlamaIndexChatResponse => {
  return isLlamaIndexChatMessage(get(obj, 'message'));
};

const isLlamaIndexChatInput = (obj: unknown): obj is LlamaIndexChatInput => {
  const messages: unknown = get(obj, 'messages');
  return isArray(messages) && messages.every(isLlamaIndexChatMessage);
};

const prettyPrintMessage = (message: LlamaIndexChatMessage) => {
  return prettyPrintChatMessage({
    role: message.role,
    content: message.blocks.map((block) => ({ type: 'text', text: block.text })),
  });
};

export const normalizeLlamaIndexChatResponse = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (!isLlamaIndexChatResponse(obj)) {
    return null;
  }

  const message = prettyPrintMessage(obj.message);
  return message && [message];
};

export const normalizeLlamaIndexChatInput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (!isLlamaIndexChatInput(obj)) {
    return null;
  }

  return compact(obj.messages.map(prettyPrintMessage));
};
```

--------------------------------------------------------------------------------

````
