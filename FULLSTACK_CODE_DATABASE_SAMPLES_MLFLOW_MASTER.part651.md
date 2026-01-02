---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 651
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 651 of 991)

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

---[FILE: voltagent.test.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/voltagent.test.ts

```typescript
import { describe, expect, it } from '@jest/globals';

import { normalizeConversation } from '../ModelTraceExplorer.utils';
import {
  normalizeVoltAgentChatInput,
  normalizeVoltAgentChatOutput,
  synthesizeVoltAgentChatMessages,
} from './voltagent';
import type { ModelTraceSpanNode } from '../ModelTrace.types';
import { ModelSpanType } from '../ModelTrace.types';

const MOCK_VOLTAGENT_SIMPLE_MESSAGES = [
  { role: 'user', content: 'Hello, how are you?' },
  { role: 'assistant', content: 'I am doing well, thank you!' },
];

const MOCK_VOLTAGENT_WITH_SYSTEM = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'What can you help me with?' },
  { role: 'assistant', content: 'I can help you with many things!' },
];

const MOCK_VOLTAGENT_TEXT_CONTENT_PARTS = [
  {
    role: 'user',
    content: [
      { type: 'text', text: 'First part' },
      { type: 'text', text: 'Second part' },
    ],
  },
];

const MOCK_VOLTAGENT_TOOL_CALLS = [
  { role: 'user', content: 'What is the weather in San Francisco?' },
  {
    role: 'assistant',
    content: [
      {
        type: 'tool-call',
        toolCallId: 'call_123',
        toolName: 'weather',
        input: { location: 'San Francisco' },
      },
    ],
  },
];

const MOCK_VOLTAGENT_TOOL_RESULTS = [
  { role: 'user', content: 'Get the weather' },
  {
    role: 'tool',
    content: [
      {
        type: 'tool-result',
        toolCallId: 'call_456',
        toolName: 'weather',
        output: { type: 'json', value: { temperature: 72, conditions: 'sunny' } },
      },
    ],
  },
];

const MOCK_VOLTAGENT_MIXED_CONTENT = [
  { role: 'user', content: 'Tell me the weather and explain it' },
  {
    role: 'assistant',
    content: [
      { type: 'text', text: 'Let me check the weather for you.' },
      {
        type: 'tool-call',
        toolCallId: 'call_789',
        toolName: 'weather',
        input: { location: 'New York' },
      },
    ],
  },
];

const MOCK_VOLTAGENT_FULL_TOOL_CYCLE = [
  { role: 'user', content: 'What is the weather in London?' },
  {
    role: 'assistant',
    content: [
      {
        type: 'tool-call',
        toolCallId: 'call_abc',
        toolName: 'get_weather',
        input: { city: 'London' },
      },
    ],
  },
  {
    role: 'tool',
    content: [
      {
        type: 'tool-result',
        toolCallId: 'call_abc',
        toolName: 'get_weather',
        output: { temperature: 15, conditions: 'cloudy' },
      },
    ],
  },
  {
    role: 'assistant',
    content: 'The weather in London is currently 15°C and cloudy.',
  },
];

describe('VoltAgent Chat Normalization', () => {
  describe('normalizeVoltAgentChatInput', () => {
    it('should normalize simple text messages', () => {
      const result = normalizeVoltAgentChatInput(MOCK_VOLTAGENT_SIMPLE_MESSAGES);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);
      expect(result![0]).toEqual(expect.objectContaining({ role: 'user', content: 'Hello, how are you?' }));
      expect(result![1]).toEqual(
        expect.objectContaining({ role: 'assistant', content: 'I am doing well, thank you!' }),
      );
    });

    it('should normalize messages with system prompt', () => {
      const result = normalizeVoltAgentChatInput(MOCK_VOLTAGENT_WITH_SYSTEM);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(3);
      expect(result![0]).toEqual(expect.objectContaining({ role: 'system', content: 'You are a helpful assistant.' }));
    });

    it('should normalize messages with text content parts', () => {
      const result = normalizeVoltAgentChatInput(MOCK_VOLTAGENT_TEXT_CONTENT_PARTS);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);
      expect(result![0]).toEqual(
        expect.objectContaining({ role: 'user', content: expect.stringContaining('First part') }),
      );
    });

    it('should normalize messages with tool calls', () => {
      const result = normalizeVoltAgentChatInput(MOCK_VOLTAGENT_TOOL_CALLS);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);

      const assistantMessage = result![1];
      expect(assistantMessage.role).toBe('assistant');
      expect(assistantMessage.tool_calls).toBeDefined();
      expect(assistantMessage.tool_calls).toHaveLength(1);
      expect(assistantMessage.tool_calls![0].id).toBe('call_123');
      expect(assistantMessage.tool_calls![0].function.name).toBe('weather');
    });

    it('should normalize messages with tool results', () => {
      const result = normalizeVoltAgentChatInput(MOCK_VOLTAGENT_TOOL_RESULTS);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);

      const toolMessage = result![1];
      expect(toolMessage.role).toBe('tool');
      expect(toolMessage.tool_call_id).toBe('call_456');
      expect(toolMessage.content).toContain('temperature');
    });

    it('should normalize messages with mixed content', () => {
      const result = normalizeVoltAgentChatInput(MOCK_VOLTAGENT_MIXED_CONTENT);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);

      const assistantMessage = result![1];
      expect(assistantMessage.role).toBe('assistant');
      expect(assistantMessage.content).toContain('Let me check the weather');
      expect(assistantMessage.tool_calls).toBeDefined();
      expect(assistantMessage.tool_calls).toHaveLength(1);
    });

    it('should normalize full tool usage cycle', () => {
      const result = normalizeVoltAgentChatInput(MOCK_VOLTAGENT_FULL_TOOL_CYCLE);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(4);
      expect(result![0].role).toBe('user');
      expect(result![1].role).toBe('assistant');
      expect(result![1].tool_calls).toBeDefined();
      expect(result![2].role).toBe('tool');
      expect(result![3].role).toBe('assistant');
      expect(result![3].content).toContain('15°C');
    });

    it('should handle JSON string input', () => {
      const jsonString = JSON.stringify(MOCK_VOLTAGENT_SIMPLE_MESSAGES);
      const result = normalizeVoltAgentChatInput(jsonString);

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);
    });

    it('should return null for invalid input', () => {
      expect(normalizeVoltAgentChatInput({ invalid: 'data' })).toBeNull();
      expect(normalizeVoltAgentChatInput(null)).toBeNull();
      expect(normalizeVoltAgentChatInput(undefined)).toBeNull();
      expect(normalizeVoltAgentChatInput([])).toBeNull();
      expect(normalizeVoltAgentChatInput('invalid json')).toBeNull();
    });

    it('should return null for messages with invalid roles', () => {
      const invalidRoles = [{ role: 'invalid_role', content: 'Hello' }];
      expect(normalizeVoltAgentChatInput(invalidRoles)).toBeNull();
    });
  });

  describe('normalizeVoltAgentChatOutput', () => {
    it('should normalize string output to assistant message', () => {
      const result = normalizeVoltAgentChatOutput('This is the AI response');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);
      expect(result![0]).toEqual(expect.objectContaining({ role: 'assistant', content: 'This is the AI response' }));
    });

    it('should return null for empty string', () => {
      expect(normalizeVoltAgentChatOutput('')).toBeNull();
      expect(normalizeVoltAgentChatOutput('   ')).toBeNull();
    });

    it('should return null for non-string outputs', () => {
      expect(normalizeVoltAgentChatOutput({ text: 'hello' })).toBeNull();
      expect(normalizeVoltAgentChatOutput(['hello'])).toBeNull();
      expect(normalizeVoltAgentChatOutput(null)).toBeNull();
      expect(normalizeVoltAgentChatOutput(undefined)).toBeNull();
    });
  });

  describe('synthesizeVoltAgentChatMessages', () => {
    const createMockToolSpan = (id: string, name: string, inputs: any, outputs: any): ModelTraceSpanNode => ({
      key: 'span_' + id,
      title: name,
      icon: null,
      start: 0,
      end: 100,
      type: ModelSpanType.TOOL,
      traceId: 'trace_123',
      inputs: inputs,
      outputs: outputs,
      attributes: {
        'span.type': 'tool',
        'tool.call.id': id,
        'tool.name': name,
      },
      events: [],
      children: [],
      assessments: [],
    });

    it('should synthesize messages with tool spans', () => {
      const inputs = [{ role: 'user', content: 'Get the weather' }];
      const outputs = 'The weather is sunny.';
      const children = [createMockToolSpan('tool_1', 'get_weather', { location: 'NYC' }, { temp: 72 })];

      const result = synthesizeVoltAgentChatMessages(inputs, outputs, children);

      expect(result).not.toBeNull();
      expect(result!.length).toBeGreaterThan(1);

      expect(result![0].role).toBe('user');

      const assistantWithToolCalls = result!.find((m) => m.role === 'assistant' && m.tool_calls);
      expect(assistantWithToolCalls).toBeDefined();
      expect(assistantWithToolCalls!.tool_calls![0].id).toBe('tool_1');

      const toolResult = result!.find((m) => m.role === 'tool');
      expect(toolResult).toBeDefined();

      const lastMessage = result![result!.length - 1];
      expect(lastMessage.role).toBe('assistant');
      expect(lastMessage.content).toBe('The weather is sunny.');
    });

    it('should return null when no valid input messages', () => {
      const result = synthesizeVoltAgentChatMessages({ invalid: 'data' }, 'output', []);
      expect(result).toBeNull();
    });

    it('should handle multiple tool spans', () => {
      const inputs = [{ role: 'user', content: 'Get weather for multiple cities' }];
      const outputs = 'Here are the weather reports.';
      const children = [
        createMockToolSpan('tool_1', 'get_weather', { location: 'NYC' }, { temp: 72 }),
        createMockToolSpan('tool_2', 'get_weather', { location: 'LA' }, { temp: 85 }),
      ];

      const result = synthesizeVoltAgentChatMessages(inputs, outputs, children);

      expect(result).not.toBeNull();

      const assistantWithToolCalls = result!.find((m) => m.role === 'assistant' && m.tool_calls);
      expect(assistantWithToolCalls!.tool_calls).toHaveLength(2);

      const toolMessages = result!.filter((m) => m.role === 'tool');
      expect(toolMessages).toHaveLength(2);
    });
  });

  describe('normalizeConversation with voltagent format', () => {
    it('should handle voltagent message format', () => {
      const result = normalizeConversation(MOCK_VOLTAGENT_SIMPLE_MESSAGES, 'voltagent');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);
      expect(result![0]).toEqual(expect.objectContaining({ role: 'user' }));
      expect(result![1]).toEqual(expect.objectContaining({ role: 'assistant' }));
    });

    it('should handle JSON string input with voltagent format', () => {
      const jsonString = JSON.stringify(MOCK_VOLTAGENT_WITH_SYSTEM);
      const result = normalizeConversation(jsonString, 'voltagent');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(3);
      expect(result![0]).toEqual(expect.objectContaining({ role: 'system' }));
    });

    it('should handle tool call messages', () => {
      const result = normalizeConversation(MOCK_VOLTAGENT_TOOL_CALLS, 'voltagent');

      expect(result).not.toBeNull();
      expect(result![1].tool_calls).toBeDefined();
      expect(result![1].tool_calls![0].function.name).toBe('weather');
    });

    it('should return null for invalid voltagent data', () => {
      expect(normalizeConversation({ invalid: 'data' }, 'voltagent')).toBeNull();
    });

    it('should return null for null input', () => {
      expect(normalizeConversation(null, 'voltagent')).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(normalizeConversation(undefined, 'voltagent')).toBeNull();
    });

    it('should normalize string output with voltagent format', () => {
      const result = normalizeConversation('AI response text', 'voltagent');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(1);
      expect(result![0].role).toBe('assistant');
      expect(result![0].content).toBe('AI response text');
    });
  });

  describe('Edge cases', () => {
    it('should handle messages with empty content array', () => {
      const messagesWithEmptyContent = [{ role: 'user', content: [] }];
      const result = normalizeVoltAgentChatInput(messagesWithEmptyContent);

      if (result !== null) {
        expect(result).toHaveLength(1);
        expect(result[0].role).toBe('user');
      }
    });

    it('should handle nested JSON value in tool result output', () => {
      const messagesWithNestedOutput = [
        {
          role: 'tool',
          content: [
            {
              type: 'tool-result',
              toolCallId: 'call_nested',
              toolName: 'complex_tool',
              output: {
                type: 'json',
                value: {
                  nested: {
                    deeply: {
                      value: 'found',
                    },
                  },
                },
              },
            },
          ],
        },
      ];

      const result = normalizeVoltAgentChatInput(messagesWithNestedOutput);
      expect(result).not.toBeNull();
      expect(result![0].content).toContain('found');
    });

    it('should handle tool call with providerExecuted flag', () => {
      const messagesWithProviderExecuted = [
        {
          role: 'assistant',
          content: [
            {
              type: 'tool-call',
              toolCallId: 'call_provider',
              toolName: 'builtin_tool',
              input: { param: 'value' },
              providerExecuted: true,
            },
          ],
        },
      ];

      const result = normalizeVoltAgentChatInput(messagesWithProviderExecuted);
      expect(result).not.toBeNull();
      expect(result![0].tool_calls).toBeDefined();
      expect(result![0].tool_calls![0].id).toBe('call_provider');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: voltagent.ts]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/chat-utils/voltagent.ts

```typescript
import { compact, has, isArray, isObject, isString } from 'lodash';

import type { ModelTraceChatMessage, ModelTraceSpanNode, ModelTraceToolCall } from '../ModelTrace.types';
import { prettyPrintChatMessage } from '../ModelTraceExplorer.utils';

/**
 * VoltAgent Message Format:
 *
 * Messages are in the `agent.messages` or `llm.messages` attribute as a JSON array.
 * Each message has:
 * - role: "system" | "user" | "assistant" | "tool"
 * - content: string | ContentPart[]
 *
 * ContentPart can be:
 * - { type: "text", text: string }
 * - { type: "tool-call", toolCallId: string, toolName: string, input: object }
 * - { type: "tool-result", toolCallId: string, toolName: string, output: object }
 */

type VoltAgentTextContent = {
  type: 'text';
  text: string;
};

type VoltAgentToolCallContent = {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  input: any;
  providerExecuted?: boolean;
};

type VoltAgentToolResultContent = {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  output: any;
};

type VoltAgentContentPart = VoltAgentTextContent | VoltAgentToolCallContent | VoltAgentToolResultContent;

type VoltAgentMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | VoltAgentContentPart[];
};

const isVoltAgentTextContent = (obj: unknown): obj is VoltAgentTextContent => {
  if (!isObject(obj)) return false;
  const typedObj = obj as any;
  return typedObj.type === 'text' && isString(typedObj.text);
};

const isVoltAgentToolCallContent = (obj: unknown): obj is VoltAgentToolCallContent => {
  if (!isObject(obj)) return false;
  const typedObj = obj as any;
  return typedObj.type === 'tool-call' && isString(typedObj.toolCallId) && isString(typedObj.toolName);
};

const isVoltAgentToolResultContent = (obj: unknown): obj is VoltAgentToolResultContent => {
  if (!isObject(obj)) return false;
  const typedObj = obj as any;
  return typedObj.type === 'tool-result' && isString(typedObj.toolCallId) && isString(typedObj.toolName);
};

const isVoltAgentContentPart = (obj: unknown): obj is VoltAgentContentPart => {
  return isVoltAgentTextContent(obj) || isVoltAgentToolCallContent(obj) || isVoltAgentToolResultContent(obj);
};

const isVoltAgentMessage = (obj: unknown): obj is VoltAgentMessage => {
  if (!isObject(obj)) return false;
  const typedObj = obj as any;

  const hasRole =
    has(obj, 'role') && isString(typedObj.role) && ['system', 'user', 'assistant', 'tool'].includes(typedObj.role);

  if (!hasRole) return false;

  // Content can be a string or an array of content parts
  if (isString(typedObj.content)) return true;
  if (isArray(typedObj.content)) {
    return typedObj.content.every(isVoltAgentContentPart);
  }

  return false;
};

const extractToolCalls = (content: VoltAgentContentPart[]): ModelTraceToolCall[] => {
  const toolCalls: ModelTraceToolCall[] = [];

  for (const part of content) {
    if (isVoltAgentToolCallContent(part)) {
      toolCalls.push({
        id: part.toolCallId,
        function: {
          name: part.toolName,
          arguments: JSON.stringify(part.input, null, 2),
        },
      });
    }
  }

  return toolCalls;
};

const extractTextContent = (content: VoltAgentContentPart[]): string => {
  const textParts: string[] = [];

  for (const part of content) {
    if (isVoltAgentTextContent(part)) {
      textParts.push(part.text);
    }
  }

  return textParts.join('\n\n');
};

const extractToolResultContent = (content: VoltAgentContentPart[]): string | undefined => {
  for (const part of content) {
    if (isVoltAgentToolResultContent(part)) {
      const output = part.output;
      // Handle nested output structure
      if (output?.type === 'json' && output?.value) {
        return JSON.stringify(output.value, null, 2);
      }
      return JSON.stringify(output, null, 2);
    }
  }
  return undefined;
};

const extractToolCallId = (content: VoltAgentContentPart[]): string | undefined => {
  for (const part of content) {
    if (isVoltAgentToolResultContent(part)) {
      return part.toolCallId;
    }
  }
  return undefined;
};

const processVoltAgentMessage = (message: VoltAgentMessage): ModelTraceChatMessage | null => {
  if (isString(message.content)) {
    return prettyPrintChatMessage({
      role: message.role,
      content: message.content,
    });
  }

  const contentParts = message.content;

  if (message.role === 'tool') {
    const toolResultContent = extractToolResultContent(contentParts);
    const toolCallId = extractToolCallId(contentParts);

    return prettyPrintChatMessage({
      role: 'tool',
      content: toolResultContent,
      ...(toolCallId && { tool_call_id: toolCallId }),
    });
  }

  if (message.role === 'assistant') {
    const textContent = extractTextContent(contentParts);
    const toolCalls = extractToolCalls(contentParts);

    return prettyPrintChatMessage({
      role: 'assistant',
      content: textContent || undefined,
      ...(toolCalls.length > 0 && { tool_calls: toolCalls }),
    });
  }

  const textContent = extractTextContent(contentParts);

  return prettyPrintChatMessage({
    role: message.role,
    content: textContent,
  });
};

export const normalizeVoltAgentChatInput = (obj: unknown): ModelTraceChatMessage[] | null => {
  let messages: unknown[] | null = null;

  if (isString(obj)) {
    try {
      const parsed = JSON.parse(obj);
      if (isArray(parsed)) {
        messages = parsed;
      }
    } catch {
      return null;
    }
  } else if (isArray(obj)) {
    messages = obj;
  }

  if (!messages || messages.length === 0) {
    return null;
  }

  if (!messages.every(isVoltAgentMessage)) {
    return null;
  }

  return compact((messages as VoltAgentMessage[]).map(processVoltAgentMessage));
};

export const normalizeVoltAgentChatOutput = (obj: unknown): ModelTraceChatMessage[] | null => {
  if (isString(obj) && obj.trim().length > 0) {
    const message = prettyPrintChatMessage({
      role: 'assistant',
      content: obj,
    });
    return message ? [message] : null;
  }

  return null;
};

const getToolCallIdFromSpan = (child: ModelTraceSpanNode): string => {
  return child.attributes?.['tool.call.id'] as string;
};

const getToolNameFromSpan = (child: ModelTraceSpanNode): string => {
  return child.attributes?.['tool.name'] as string;
};

export const synthesizeVoltAgentChatMessages = (
  inputs: any,
  outputs: any,
  children: ModelTraceSpanNode[],
): ModelTraceChatMessage[] | null => {
  const messages: ModelTraceChatMessage[] = [];

  const inputMessages = normalizeVoltAgentChatInput(inputs);

  if (!inputMessages || inputMessages.length === 0) {
    return null;
  }

  messages.push(...inputMessages);

  const toolSpans = children.filter((child) => child.attributes?.['span.type'] === 'tool');

  if (toolSpans.length > 0) {
    const toolCalls: ModelTraceToolCall[] = toolSpans.map((toolSpan) => {
      const toolCallId = getToolCallIdFromSpan(toolSpan);
      const toolName = getToolNameFromSpan(toolSpan);
      const toolInput = toolSpan.inputs;

      return {
        id: toolCallId,
        function: {
          name: toolName,
          arguments: isObject(toolInput) ? JSON.stringify(toolInput, null, 2) : String(toolInput ?? ''),
        },
      };
    });

    const assistantWithToolCalls = prettyPrintChatMessage({
      role: 'assistant',
      content: undefined,
      tool_calls: toolCalls,
    });

    if (assistantWithToolCalls) {
      messages.push(assistantWithToolCalls);
    }

    for (const toolSpan of toolSpans) {
      const toolCallId = getToolCallIdFromSpan(toolSpan);
      const toolOutput = toolSpan.outputs;
      const toolResultContent = isObject(toolOutput) ? JSON.stringify(toolOutput, null, 2) : String(toolOutput ?? '');

      const toolResultMessage = prettyPrintChatMessage({
        role: 'tool',
        content: toolResultContent,
        tool_call_id: toolCallId,
      });

      if (toolResultMessage) {
        messages.push(toolResultMessage);
      }
    }
  }

  if (isString(outputs) && outputs.trim().length > 0) {
    const finalAssistantMessage = prettyPrintChatMessage({
      role: 'assistant',
      content: outputs,
    });

    if (finalAssistantMessage) {
      messages.push(finalAssistantMessage);
    }
  }

  return messages.length > 0 ? messages : null;
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentSchemaContext.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/contexts/AssessmentSchemaContext.tsx
Signals: React

```typescript
import React, { createContext, useContext, type ReactNode, useMemo } from 'react';

import { parseAssessmentSchemas } from './AssessmentSchemaContext.utils';
import type { Assessment } from '../ModelTrace.types';
import type { AssessmentFormInputDataType } from '../assessments-pane/AssessmentsPane.utils';

export type AssessmentSchema = {
  name: string;
  assessmentType: 'feedback' | 'expectation';
  dataType: AssessmentFormInputDataType;
};

interface AssessmentSchemaContextValue {
  schemas: AssessmentSchema[];
}

const AssessmentSchemaContext = createContext<AssessmentSchemaContextValue>({
  schemas: [],
});

interface AssessmentSchemaContextProviderProps {
  children: ReactNode;
  assessments: Assessment[];
}

export const AssessmentSchemaContextProvider: React.FC<AssessmentSchemaContextProviderProps> = ({
  children,
  assessments,
}) => {
  const schemas = useMemo(() => parseAssessmentSchemas(assessments), [assessments]);
  const value: AssessmentSchemaContextValue = useMemo(
    () => ({
      schemas,
    }),
    [schemas],
  );

  return <AssessmentSchemaContext.Provider value={value}>{children}</AssessmentSchemaContext.Provider>;
};

export const useAssessmentSchemas = (): AssessmentSchemaContextValue => {
  return useContext(AssessmentSchemaContext);
};
```

--------------------------------------------------------------------------------

---[FILE: AssessmentSchemaContext.utils.test.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/contexts/AssessmentSchemaContext.utils.test.tsx

```typescript
import { describe, it, expect } from '@jest/globals';

import { parseAssessmentSchemas } from './AssessmentSchemaContext.utils';
import type { Assessment } from '../ModelTrace.types';
import { MOCK_ASSESSMENT, MOCK_EXPECTATION } from '../ModelTraceExplorer.test-utils';

describe('parseAssessmentSchemas', () => {
  it('should handle empty assessments array', () => {
    const result = parseAssessmentSchemas([]);
    expect(result).toEqual([]);
  });

  it('should parse multiple assessments with different data types', () => {
    const assessments: Assessment[] = [
      MOCK_ASSESSMENT, // string type
      {
        ...MOCK_ASSESSMENT,
        assessment_name: 'numeric',
        feedback: { value: 3 },
      },
      {
        ...MOCK_ASSESSMENT,
        assessment_name: 'undefined',
        feedback: { value: undefined },
      },
      MOCK_EXPECTATION, // json
    ];
    const result = parseAssessmentSchemas(assessments);

    expect(result).toHaveLength(4);
    expect(result).toEqual([
      {
        name: 'Relevance',
        assessmentType: 'feedback',
        dataType: 'string',
      },
      {
        name: 'numeric',
        assessmentType: 'feedback',
        dataType: 'number',
      },
      {
        name: 'expected_facts',
        assessmentType: 'expectation',
        dataType: 'json',
      },
      // nullish assessments get put to the back of the array due
      // to implementation, but since it's a typeahead it shouldn't
      // matter very much
      {
        name: 'undefined',
        assessmentType: 'feedback',
        // undefined should default to boolean dataType
        dataType: 'boolean',
      },
    ]);
  });

  it('should deduplicate assessments with the same assessment_name', () => {
    const assessments: Assessment[] = [
      MOCK_ASSESSMENT,
      { ...MOCK_ASSESSMENT, feedback: { value: 3 } },
      MOCK_EXPECTATION,
    ];
    const result = parseAssessmentSchemas(assessments);

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      {
        name: 'Relevance',
        assessmentType: 'feedback',
        dataType: 'string',
      },
      {
        name: 'expected_facts',
        assessmentType: 'expectation',
        dataType: 'json',
      },
    ]);
  });

  it('should default dataType to first non-null feedback value', () => {
    const assessments: Assessment[] = [
      { ...MOCK_ASSESSMENT, feedback: { value: null } },
      { ...MOCK_ASSESSMENT, feedback: { value: undefined } },
      { ...MOCK_ASSESSMENT, feedback: { value: 3 } },
    ];
    const result = parseAssessmentSchemas(assessments);

    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        name: 'Relevance',
        assessmentType: 'feedback',
        dataType: 'number',
      },
    ]);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: AssessmentSchemaContext.utils.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/contexts/AssessmentSchemaContext.utils.tsx

```typescript
import { isNil } from 'lodash';

import type { AssessmentSchema } from './AssessmentSchemaContext';
import type { Assessment } from '../ModelTrace.types';
import type { AssessmentFormInputDataType } from '../assessments-pane/AssessmentsPane.utils';
import { getAssessmentValue } from '../assessments-pane/utils';

// this function accepts a flat list of assessments (e.g. the result
// of tracesInfos.flatMap(info => info.assessments)), and returns a
// list of assessment schemas
export const parseAssessmentSchemas = (assessments: Assessment[]): AssessmentSchema[] => {
  // stores all schemas for which we can determine the data type
  const schemaMap: { [assessmentName: string]: AssessmentSchema } = {};
  // stores all schemas with null / undefined values.
  // after parsing all values, we will merge the two,
  // keeping the data type from the schemaMap if it exists,
  // and using `boolean` if it does not.
  const nullsSchemaMap: { [assessmentName: string]: AssessmentSchema } = {};

  for (const assessment of assessments) {
    if (schemaMap[assessment.assessment_name]) {
      continue;
    }

    // NOTE: the getAssessmentValue function does not parse
    // serialized JSON, and just returns them as strings.
    const value = getAssessmentValue(assessment);

    if (isNil(value)) {
      nullsSchemaMap[assessment.assessment_name] = {
        name: assessment.assessment_name,
        assessmentType: 'feedback' in assessment ? 'feedback' : 'expectation',
        dataType: 'boolean',
      };
      continue;
    }

    const isSerializedExpectation = 'expectation' in assessment && 'serialized_value' in assessment.expectation;

    let dataType: AssessmentFormInputDataType;
    switch (typeof value) {
      case 'string':
        dataType = isSerializedExpectation ? 'json' : 'string';
        break;
      case 'boolean':
        dataType = 'boolean';
        break;
      case 'number':
        dataType = 'number';
        break;
      // for unexpected types, just default to boolean
      default:
        dataType = 'boolean';
        break;
    }

    schemaMap[assessment.assessment_name] = {
      name: assessment.assessment_name,
      assessmentType: 'feedback' in assessment ? 'feedback' : 'expectation',
      dataType,
    };
  }

  // combine the two maps, keeping the data type from the schemaMap if it exists,
  for (const [assessmentName, schema] of Object.entries(nullsSchemaMap)) {
    if (!(assessmentName in schemaMap)) {
      schemaMap[assessmentName] = schema;
    }
  }

  return Object.values(schemaMap);
};
```

--------------------------------------------------------------------------------

---[FILE: UpdateTraceContext.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/contexts/UpdateTraceContext.tsx
Signals: React

```typescript
import React, { useMemo } from 'react';

import type { ModelTrace } from '../ModelTrace.types';

const ModelTraceExplorerUpdateTraceContext = React.createContext<{
  sqlWarehouseId?: string;
  modelTraceInfo?: ModelTrace['info'];
  invalidateTraceQuery?: (traceId?: string) => void;
}>({
  sqlWarehouseId: undefined,
  modelTraceInfo: undefined,
  invalidateTraceQuery: undefined,
});

/**
 * Provides configuration context used to update trace data (assessments, tags).
 * Contains:
 * - an ID of the SQL warehouse to use for queries
 * - info of the currently selected model trace
 */
export const ModelTraceExplorerUpdateTraceContextProvider = ({
  sqlWarehouseId,
  modelTraceInfo,
  children,
  invalidateTraceQuery,
}: {
  sqlWarehouseId?: string;
  modelTraceInfo?: ModelTrace['info'];
  children: React.ReactNode;
  invalidateTraceQuery?: (traceId?: string) => void;
}) => {
  const contextValue = useMemo(
    () => ({ sqlWarehouseId, modelTraceInfo, invalidateTraceQuery }),
    [sqlWarehouseId, modelTraceInfo, invalidateTraceQuery],
  );
  return (
    <ModelTraceExplorerUpdateTraceContext.Provider value={contextValue}>
      {children}
    </ModelTraceExplorerUpdateTraceContext.Provider>
  );
};

export const useModelTraceExplorerUpdateTraceContext = () => React.useContext(ModelTraceExplorerUpdateTraceContext);
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerChatToolsRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/field-renderers/ModelTraceExplorerChatToolsRenderer.tsx

```typescript
import { Typography, useDesignSystemTheme } from '@databricks/design-system';

import type { ModelTraceChatTool } from '../ModelTrace.types';
import { ModelTraceExplorerChatTool } from '../right-pane/ModelTraceExplorerChatTool';

export const ModelTraceExplorerChatToolsRenderer = ({
  title,
  tools,
}: {
  title: string;
  tools: ModelTraceChatTool[];
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.sm,
        padding: theme.spacing.sm,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borders.borderRadiusSm,
      }}
    >
      {title && (
        <Typography.Text css={{ marginLeft: theme.spacing.xs }} bold>
          {title}
        </Typography.Text>
      )}
      {tools.map((tool) => (
        <ModelTraceExplorerChatTool key={tool.function.name} tool={tool} />
      ))}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerFieldRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/field-renderers/ModelTraceExplorerFieldRenderer.tsx
Signals: React

```typescript
import { every, isBoolean, isNumber, isString } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { Typography, useDesignSystemTheme } from '@databricks/design-system';
import { FormattedMessage } from '@databricks/i18n';

import { ModelTraceExplorerChatToolsRenderer } from './ModelTraceExplorerChatToolsRenderer';
import { ModelTraceExplorerRetrieverFieldRenderer } from './ModelTraceExplorerRetrieverFieldRenderer';
import { ModelTraceExplorerTextFieldRenderer } from './ModelTraceExplorerTextFieldRenderer';
import { CodeSnippetRenderMode } from '../ModelTrace.types';
import { isModelTraceChatTool, isRetrieverDocument, normalizeConversation } from '../ModelTraceExplorer.utils';
import { ModelTraceExplorerCodeSnippet } from '../ModelTraceExplorerCodeSnippet';
import { ModelTraceExplorerConversation } from '../right-pane/ModelTraceExplorerConversation';

export const DEFAULT_MAX_VISIBLE_CHAT_MESSAGES = 3;

export const ModelTraceExplorerFieldRenderer = ({
  title,
  data,
  renderMode,
  chatMessageFormat,
  maxVisibleMessages = DEFAULT_MAX_VISIBLE_CHAT_MESSAGES,
}: {
  title: string;
  data: string;
  renderMode: 'default' | 'json' | 'text';
  chatMessageFormat?: string;
  maxVisibleMessages?: number;
}) => {
  const { theme } = useDesignSystemTheme();
  const [messagesExpanded, setMessagesExpanded] = useState(false);
  const parsedData = useMemo(() => {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }, [data]);

  useEffect(() => {
    setMessagesExpanded(false);
  }, [data]);

  const dataIsScalar = isString(parsedData) || isNumber(parsedData) || isBoolean(parsedData);
  // wrap the value in an object with the title as key. this helps normalizeConversation
  // recognize the format, as this util function was designed to receive the whole input
  // object rather than value by value. it does not work for complex cases where we need
  // to check multiple keys in the object (e.g. anthropic), but works for cases where we're
  // basically just looking for the field that contains chat messages.
  const chatMessages = normalizeConversation(title ? { [title]: parsedData } : parsedData, chatMessageFormat);
  const isChatTools = Array.isArray(parsedData) && parsedData.length > 0 && every(parsedData, isModelTraceChatTool);
  const isRetrieverDocuments =
    Array.isArray(parsedData) && parsedData.length > 0 && every(parsedData, isRetrieverDocument);

  if (chatMessages && chatMessages.length > 0) {
    const shouldTruncateMessages = chatMessages.length > maxVisibleMessages;
    const visibleMessages =
      messagesExpanded || !shouldTruncateMessages ? chatMessages : chatMessages.slice(-maxVisibleMessages);
    const hiddenMessageCount = shouldTruncateMessages ? chatMessages.length - visibleMessages.length : 0;

    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.sm,
          padding: theme.spacing.sm,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borders.borderRadiusSm,
        }}
      >
        {title && (
          <Typography.Title level={4} color="secondary" withoutMargins css={{ marginLeft: theme.spacing.xs }}>
            {title}
          </Typography.Title>
        )}
        {shouldTruncateMessages && (
          <Typography.Link
            css={{ alignSelf: 'flex-start', marginLeft: theme.spacing.xs }}
            componentId="shared.model-trace-explorer.conversation-toggle"
            onClick={() => setMessagesExpanded(!messagesExpanded)}
          >
            {messagesExpanded ? (
              <FormattedMessage
                defaultMessage="Show less"
                description="Button label to collapse conversation messages in model trace explorer"
              />
            ) : (
              <FormattedMessage
                defaultMessage="Show {hiddenMessageCount} more"
                description="Button label to expand and show hidden conversation messages in model trace explorer"
                values={{ hiddenMessageCount }}
              />
            )}
          </Typography.Link>
        )}
        <ModelTraceExplorerConversation messages={visibleMessages} />
      </div>
    );
  }

  if (renderMode === 'json') {
    return <ModelTraceExplorerCodeSnippet title={title} data={data} initialRenderMode={CodeSnippetRenderMode.JSON} />;
  }

  if (renderMode === 'text') {
    return <ModelTraceExplorerCodeSnippet title={title} data={data} initialRenderMode={CodeSnippetRenderMode.TEXT} />;
  }

  if (dataIsScalar) {
    return <ModelTraceExplorerTextFieldRenderer title={title} value={String(parsedData)} />;
  }

  if (isChatTools) {
    return <ModelTraceExplorerChatToolsRenderer title={title} tools={parsedData} />;
  }

  if (isRetrieverDocuments) {
    return <ModelTraceExplorerRetrieverFieldRenderer title={title} documents={parsedData} />;
  }

  return <ModelTraceExplorerCodeSnippet title={title} data={data} />;
};
```

--------------------------------------------------------------------------------

---[FILE: ModelTraceExplorerRetrieverFieldRenderer.tsx]---
Location: mlflow-master/mlflow/server/js/src/shared/web-shared/model-trace-explorer/field-renderers/ModelTraceExplorerRetrieverFieldRenderer.tsx

```typescript
import { Typography, useDesignSystemTheme } from '@databricks/design-system';

import type { RetrieverDocument } from '../ModelTrace.types';
import { ModelTraceExplorerRetrieverDocument } from '../right-pane/ModelTraceExplorerRetrieverDocument';

export const ModelTraceExplorerRetrieverFieldRenderer = ({
  title,
  documents,
}: {
  title: string;
  documents: RetrieverDocument[];
}) => {
  const { theme } = useDesignSystemTheme();
  return (
    <div
      css={{
        backgroundColor: theme.colors.backgroundPrimary,
        borderRadius: theme.borders.borderRadiusSm,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {title && (
        <div
          css={{
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <Typography.Text bold>{title}</Typography.Text>
        </div>
      )}
      {documents.map((document, idx) => (
        <div key={idx} css={{ borderBottom: idx !== documents.length - 1 ? `1px solid ${theme.colors.border}` : '' }}>
          <ModelTraceExplorerRetrieverDocument key={idx} text={document.page_content} metadata={document.metadata} />
        </div>
      ))}
    </div>
  );
};
```

--------------------------------------------------------------------------------

````
