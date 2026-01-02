---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 219
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 219 of 991)

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

---[FILE: index.ts]---
Location: mlflow-master/libs/typescript/integrations/anthropic/src/index.ts

```typescript
/**
 * Main tracedAnthropic wrapper function for MLflow tracing integration
 */

import { withSpan, LiveSpan, SpanAttributeKey, SpanType, TokenUsage } from 'mlflow-tracing';

const SUPPORTED_MODULES = ['Messages'];
const SUPPORTED_METHODS = ['create'];

/**
 * Create a traced version of Anthropic client with MLflow tracing
 * @param anthropicClient - The Anthropic client instance to trace
 * @returns Traced Anthropic client with tracing capabilities
 */
export function tracedAnthropic<T = any>(anthropicClient: T): T {
  const tracedClient = new Proxy(anthropicClient as any, {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver);
      const moduleName = (target as object).constructor?.name;

      if (typeof original === 'function') {
        if (shouldTraceMethod(moduleName, String(prop))) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          return wrapWithTracing(original as Function, moduleName) as T;
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        return (original as Function).bind(target) as T;
      }

      if (
        original &&
        !Array.isArray(original) &&
        !(original instanceof Date) &&
        typeof original === 'object'
      ) {
        return tracedAnthropic(original) as T;
      }

      return original as T;
    }
  });

  return tracedClient as T;
}

function shouldTraceMethod(moduleName: string | undefined, methodName: string): boolean {
  if (!moduleName) {
    return false;
  }
  return SUPPORTED_MODULES.includes(moduleName) && SUPPORTED_METHODS.includes(methodName);
}

// eslint-disable-next-line @typescript-eslint/ban-types
function wrapWithTracing(fn: Function, moduleName: string): Function {
  const spanType = getSpanType(moduleName);
  const name = moduleName;

  return function (this: any, ...args: any[]) {
    if (!spanType) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fn.apply(this, args);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return withSpan(
      async (span: LiveSpan) => {
        span.setInputs(args[0]);

        const result = await fn.apply(this, args);

        span.setOutputs(result);

        try {
          const usage = extractTokenUsage(result);
          if (usage) {
            span.setAttribute(SpanAttributeKey.TOKEN_USAGE, usage);
          }
        } catch (error) {
          console.debug('Error extracting token usage', error);
        }

        span.setAttribute(SpanAttributeKey.MESSAGE_FORMAT, 'anthropic');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
      },
      { name, spanType }
    );
  };
}

function getSpanType(moduleName: string): SpanType | undefined {
  switch (moduleName) {
    case 'Messages':
      return SpanType.LLM;
    default:
      return undefined;
  }
}

function extractTokenUsage(response: any): TokenUsage | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const usage = response?.usage;
  if (!usage) {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const inputTokens = usage.input_tokens;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const outputTokens = usage.output_tokens;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const totalTokens = usage.total_tokens ?? (inputTokens ?? 0) + (outputTokens ?? 0);

  return {
    input_tokens: inputTokens ?? 0,
    output_tokens: outputTokens ?? 0,
    total_tokens: totalTokens ?? 0
  };
}
```

--------------------------------------------------------------------------------

---[FILE: index.test.ts]---
Location: mlflow-master/libs/typescript/integrations/anthropic/tests/index.test.ts

```typescript
/**
 * Tests for MLflow Anthropic integration with MSW mock server
 */

import * as mlflow from 'mlflow-tracing';
import Anthropic from '@anthropic-ai/sdk';
import { tracedAnthropic } from '../src';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { anthropicMockHandlers } from './mockAnthropicServer';

const TEST_TRACKING_URI = 'http://localhost:5000';

describe('tracedAnthropic', () => {
  let experimentId: string;
  let client: mlflow.MlflowClient;
  let server: ReturnType<typeof setupServer>;

  beforeAll(async () => {
    server = setupServer(...anthropicMockHandlers);
    server.listen();

    client = new mlflow.MlflowClient({ trackingUri: TEST_TRACKING_URI, host: TEST_TRACKING_URI });

    const experimentName = `anthropic-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    experimentId = await client.createExperiment(experimentName);

    mlflow.init({
      trackingUri: TEST_TRACKING_URI,
      experimentId
    });
  });

  afterAll(async () => {
    server.close();
    await client.deleteExperiment(experimentId);
  });

  const getLastActiveTrace = async (): Promise<mlflow.Trace> => {
    await mlflow.flushTraces();
    const traceId = mlflow.getLastActiveTraceId();
    const trace = await client.getTrace(traceId!);
    return trace;
  };

  beforeEach(() => {
    server.resetHandlers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trace messages.create()', async () => {
    const anthropic = new Anthropic({ apiKey: 'test-key' });
    const wrappedAnthropic = tracedAnthropic(anthropic);

    const result = await wrappedAnthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 256,
      messages: [{ role: 'user', content: 'Hello Claude!' }]
    });

    const trace = await getLastActiveTrace();
    expect(trace.info.state).toBe('OK');

    const tokenUsage = trace.info.tokenUsage;
    expect(tokenUsage).toBeDefined();
    expect(typeof tokenUsage?.input_tokens).toBe('number');
    expect(typeof tokenUsage?.output_tokens).toBe('number');
    expect(typeof tokenUsage?.total_tokens).toBe('number');

    const span = trace.data.spans[0];
    expect(span.name).toBe('Messages');
    expect(span.spanType).toBe(mlflow.SpanType.LLM);
    expect(span.status.statusCode).toBe(mlflow.SpanStatusCode.OK);
    expect(span.inputs).toEqual({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 256,
      messages: [{ role: 'user', content: 'Hello Claude!' }]
    });
    expect(span.outputs).toEqual(result);

    const spanTokenUsage = span.attributes[mlflow.SpanAttributeKey.TOKEN_USAGE];
    expect(spanTokenUsage).toBeDefined();
    expect(typeof spanTokenUsage[mlflow.TokenUsageKey.INPUT_TOKENS]).toBe('number');
    expect(typeof spanTokenUsage[mlflow.TokenUsageKey.OUTPUT_TOKENS]).toBe('number');
    expect(typeof spanTokenUsage[mlflow.TokenUsageKey.TOTAL_TOKENS]).toBe('number');

    const messageFormat = span.attributes[mlflow.SpanAttributeKey.MESSAGE_FORMAT];
    expect(messageFormat).toBe('anthropic');
  });

  it('should handle Anthropic errors properly', async () => {
    server.use(
      http.post('https://api.anthropic.com/v1/messages', () =>
        HttpResponse.json(
          {
            error: {
              type: 'rate_limit',
              message: 'Rate limit exceeded'
            }
          },
          { status: 429 }
        )
      )
    );

    const anthropic = new Anthropic({ apiKey: 'test-key' });
    const wrappedAnthropic = tracedAnthropic(anthropic);

    await expect(
      wrappedAnthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 128,
        messages: [{ role: 'user', content: 'This request should fail.' }]
      })
    ).rejects.toThrow();

    const trace = await getLastActiveTrace();
    expect(trace.info.state).toBe('ERROR');

    const span = trace.data.spans[0];
    expect(span.status.statusCode).toBe(mlflow.SpanStatusCode.ERROR);
    expect(span.inputs).toEqual({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 128,
      messages: [{ role: 'user', content: 'This request should fail.' }]
    });
    expect(span.outputs).toBeUndefined();
  });

  it('should trace Anthropic request wrapped in a parent span', async () => {
    const anthropic = new Anthropic({ apiKey: 'test-key' });
    const wrappedAnthropic = tracedAnthropic(anthropic);

    const result = await mlflow.withSpan(
      async (_span) => {
        const response = await wrappedAnthropic.messages.create({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: 128,
          messages: [{ role: 'user', content: 'Hello from parent span.' }]
        });
        return response.content[0];
      },
      {
        name: 'predict',
        spanType: mlflow.SpanType.CHAIN,
        inputs: 'Hello from parent span.'
      }
    );

    const trace = await getLastActiveTrace();
    expect(trace.info.state).toBe('OK');
    expect(trace.data.spans.length).toBe(2);

    const parentSpan = trace.data.spans[0];
    expect(parentSpan.name).toBe('predict');
    expect(parentSpan.spanType).toBe(mlflow.SpanType.CHAIN);
    expect(parentSpan.outputs).toEqual(result);

    const childSpan = trace.data.spans[1];
    expect(childSpan.name).toBe('Messages');
    expect(childSpan.spanType).toBe(mlflow.SpanType.LLM);
    expect(childSpan.inputs).toEqual({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 128,
      messages: [{ role: 'user', content: 'Hello from parent span.' }]
    });
    expect(childSpan.outputs).toBeDefined();

    const messageFormat = childSpan.attributes[mlflow.SpanAttributeKey.MESSAGE_FORMAT];
    expect(messageFormat).toBe('anthropic');
  });
});
```

--------------------------------------------------------------------------------

---[FILE: mockAnthropicServer.ts]---
Location: mlflow-master/libs/typescript/integrations/anthropic/tests/mockAnthropicServer.ts

```typescript
/**
 * MSW-based Anthropic API mock server for testing
 */

import { http, HttpResponse } from 'msw';

interface MessagesCreateRequest {
  model: string;
  messages: Array<{
    role: string;
    content: string | Array<{ type: string; text: string }>;
  }>;
  max_tokens?: number;
  system?: string | Array<{ type: string; text: string }>;
}

function createMessageResponse(request: MessagesCreateRequest) {
  return {
    id: `msg_${Math.random().toString(36).slice(2)}`,
    type: 'message',
    role: 'assistant',
    model: request.model,
    stop_reason: 'end_turn',
    stop_sequence: null,
    usage: {
      input_tokens: 128,
      output_tokens: 256,
      total_tokens: 384
    },
    content: [
      {
        type: 'text',
        text: 'This is a mocked Anthropic response.'
      }
    ]
  };
}

export const anthropicMockHandlers = [
  http.post('https://api.anthropic.com/v1/messages', async ({ request }) => {
    const body = (await request.json()) as MessagesCreateRequest;
    return HttpResponse.json(createMessageResponse(body));
  })
];
```

--------------------------------------------------------------------------------

---[FILE: jest.config.js]---
Location: mlflow-master/libs/typescript/integrations/gemini/jest.config.js

```javascript
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },
  globalSetup: '<rootDir>/../../jest.global-server-setup.ts',
  globalTeardown: '<rootDir>/../../jest.global-server-teardown.ts',
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
};
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: mlflow-master/libs/typescript/integrations/gemini/package.json

```json
{
  "name": "mlflow-gemini",
  "version": "0.1.0",
  "description": "Gemini integration package for MLflow Tracing",
  "repository": {
    "type": "git",
    "url": "https://github.com/mlflow/mlflow.git"
  },
  "homepage": "https://mlflow.org/",
  "author": {
    "name": "MLflow",
    "url": "https://mlflow.org/"
  },
  "bugs": {
    "url": "https://github.com/mlflow/mlflow/issues"
  },
  "license": "Apache-2.0",
  "keywords": [
    "mlflow",
    "tracing",
    "observability",
    "opentelemetry",
    "llm",
    "gemini",
    "google",
    "javascript",
    "typescript"
  ],
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "peerDependencies": {
    "mlflow-tracing": "^0.1.0-rc.0",
    "@google/genai": "^1.22.0"
  },
  "devDependencies": {
    "jest": "^29.6.2",
    "json-bigint": "^1.0.0",
    "typescript": "^5.8.3"
  },
  "engines": {
    "node": ">=20"
  },
  "files": [
    "dist/"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/libs/typescript/integrations/gemini/README.md

```text
# MLflow Typescript SDK - Gemini

Seamlessly integrate [MLflow Tracing](https://github.com/mlflow/mlflow/tree/main/libs/typescript) with Gemini to automatically trace your Claude API calls.

| Package             | NPM                                                                                                                                         | Description                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [mlflow-gemini](./) | [![npm package](https://img.shields.io/npm/v/mlflow-tracing-gemini?style=flat-square)](https://www.npmjs.com/package/mlflow-tracing-gemini) | Auto-instrumentation integration for Gemini. |

## Installation

```bash
npm install mlflow-gemini
```

The package includes the [`mlflow-tracing`](https://github.com/mlflow/mlflow/tree/main/libs/typescript) package and `@google/genai` package as peer dependencies. Depending on your package manager, you may need to install these two packages separately.

## Quickstart

Start MLflow Tracking Server if you don't have one already:

```bash
pip install mlflow
mlflow server --backend-store-uri sqlite:///mlruns.db --port 5000
```

Self-hosting MLflow server requires Python 3.10 or higher. If you don't have one, you can also use [managed MLflow service](https://mlflow.org/#get-started) for free to get started quickly.

Instantiate MLflow SDK in your application:

```typescript
import * as mlflow from 'mlflow-tracing';

mlflow.init({
  trackingUri: 'http://localhost:5000',
  experimentId: '<experiment-id>'
});
```

Create a trace for Gemini:

```typescript
import { tracedGemini } from 'mlflow-gemini';
import { GoogleGenAI } from '@google/genai';

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const client = tracedGemini(gemini);

const response = await client.models.generateContent({
  model: 'gemini-2.0-flash-001',
  contents: 'Hello Gemini'
});
```

View traces in MLflow UI:

![MLflow Tracing UI](https://github.com/mlflow/mlflow/blob/master/docs/static/images/llms/gemini/gemini-tracing.png?raw=True)

## Documentation 📘

Official documentation for MLflow Typescript SDK can be found [here](https://mlflow.org/docs/latest/genai/tracing/quickstart).

## License

This project is licensed under the [Apache License 2.0](https://github.com/mlflow/mlflow/blob/master/LICENSE.txt).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: mlflow-master/libs/typescript/integrations/gemini/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*"],
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/libs/typescript/integrations/gemini/src/index.ts

```typescript
/**
 * MLflow Tracing wrapper for the @google/genai Gemini SDK.
 */

import {
  withSpan,
  SpanAttributeKey,
  SpanType,
  type TokenUsage,
  type LiveSpan
} from 'mlflow-tracing';

const SUPPORTED_MODULES = ['models'];
const SUPPORTED_METHODS = ['generateContent'];

/**
 * Create a traced version of Gemini client with MLflow tracing
 * @param geminiClient - The Gemini client instance to trace
 * @returns Traced Gemini client with tracing capabilities
 */
export function tracedGemini<T = any>(geminiClient: T): T {
  const tracedClient = new Proxy(geminiClient as any, {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver);
      const moduleName = (target as object).constructor?.name;

      if (typeof original === 'function') {
        if (shouldTraceMethod(moduleName, String(prop))) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          return wrapWithTracing(original as Function, String(prop));
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        return (original as Function).bind(target) as T;
      }

      if (
        original &&
        !Array.isArray(original) &&
        !(original instanceof Date) &&
        typeof original === 'object'
      ) {
        return tracedGemini(original) as T;
      }

      return original as T;
    }
  });

  return tracedClient as T;
}

function shouldTraceMethod(moduleName: string | undefined, methodName: string): boolean {
  if (!moduleName) {
    return false;
  }
  const lowerModuleName = moduleName.toLowerCase();
  return SUPPORTED_MODULES.includes(lowerModuleName) && SUPPORTED_METHODS.includes(methodName);
}

// eslint-disable-next-line @typescript-eslint/ban-types
function wrapWithTracing(fn: Function, methodName: string): Function {
  const spanType = getSpanType(methodName);

  return function (this: any, ...args: any[]) {
    if (!spanType) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fn.apply(this, args);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return withSpan(
      async (span: LiveSpan) => {
        span.setInputs(args[0]);

        const result = await fn.apply(this, args);

        span.setOutputs(result);

        try {
          const usage = extractTokenUsage(result);
          if (usage) {
            span.setAttribute(SpanAttributeKey.TOKEN_USAGE, usage);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.debug('Error extracting token usage', error);
        }

        span.setAttribute(SpanAttributeKey.MESSAGE_FORMAT, 'gemini');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
      },
      { name: methodName, spanType }
    );
  };
}

function getSpanType(methodName: string): SpanType | undefined {
  switch (methodName) {
    case 'generateContent':
      return SpanType.LLM;
    default:
      return undefined;
  }
}
function extractTokenUsage(response: any): TokenUsage | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const usage = response?.usageMetadata ?? response?.usage;
  if (!usage) {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const input = usage.promptTokenCount;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const output = usage.candidatesTokenCount;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const total = usage.totalTokenCount;

  if (input !== undefined && output !== undefined && total !== undefined) {
    return {
      input_tokens: input,
      output_tokens: output,
      total_tokens: total
    };
  }

  return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: index.test.ts]---
Location: mlflow-master/libs/typescript/integrations/gemini/tests/index.test.ts

```typescript
/**
 * Tests for MLflow Gemini integration with MSW mock server
 */

import * as mlflow from 'mlflow-tracing';
import { tracedGemini } from '../src';
import { GoogleGenAI } from '@google/genai';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { geminiMockHandlers } from './mockGeminiServer';

const TEST_TRACKING_URI = 'http://localhost:5000';

describe('tracedGemini', () => {
  let experimentId: string;
  let client: mlflow.MlflowClient;
  let server: ReturnType<typeof setupServer>;

  beforeAll(async () => {
    client = new mlflow.MlflowClient({ trackingUri: TEST_TRACKING_URI, host: TEST_TRACKING_URI });

    const experimentName = `test-experiment-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    experimentId = await client.createExperiment(experimentName);
    mlflow.init({
      trackingUri: TEST_TRACKING_URI,
      experimentId: experimentId
    });

    server = setupServer(...geminiMockHandlers);
    server.listen();
  });

  afterAll(async () => {
    server.close();
    await client.deleteExperiment(experimentId);
  });

  const getLastActiveTrace = async (): Promise<mlflow.Trace> => {
    await mlflow.flushTraces();
    const traceId = mlflow.getLastActiveTraceId();
    const trace = await client.getTrace(traceId!);
    return trace;
  };

  beforeEach(() => {
    server.resetHandlers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Generate Content', () => {
    it('should trace models.generateContent() without parent span', async () => {
      const gemini = new GoogleGenAI({ apiKey: 'test-key' });
      const wrappedGemini = tracedGemini(gemini);

      const result = await wrappedGemini.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: 'Hello Gemini'
      });

      expect(result).toBeDefined();
      expect(result.usageMetadata).toBeDefined();

      const trace = await getLastActiveTrace();
      expect(trace.info.state).toBe('OK');

      expect(trace.data.spans.length).toBe(1);

      const llmSpan = trace.data.spans[0];
      expect(llmSpan).toBeDefined();
      expect(llmSpan.name).toBe('generateContent');
      expect(llmSpan.spanType).toBe(mlflow.SpanType.LLM);
      expect(llmSpan.status.statusCode).toBe(mlflow.SpanStatusCode.OK);
      expect(llmSpan.inputs).toEqual({
        model: 'gemini-2.0-flash-001',
        contents: 'Hello Gemini'
      });
      expect(llmSpan.outputs).toEqual(result);
      expect(llmSpan.startTime).toBeDefined();
      expect(llmSpan.endTime).toBeDefined();

      const spanTokenUsage = llmSpan.attributes[mlflow.SpanAttributeKey.TOKEN_USAGE];
      expect(spanTokenUsage).toBeDefined();
      expect(typeof spanTokenUsage[mlflow.TokenUsageKey.INPUT_TOKENS]).toBe('number');
      expect(typeof spanTokenUsage[mlflow.TokenUsageKey.OUTPUT_TOKENS]).toBe('number');
      expect(typeof spanTokenUsage[mlflow.TokenUsageKey.TOTAL_TOKENS]).toBe('number');
      expect(spanTokenUsage[mlflow.TokenUsageKey.INPUT_TOKENS]).toBe(10);
      expect(spanTokenUsage[mlflow.TokenUsageKey.OUTPUT_TOKENS]).toBe(5);
      expect(spanTokenUsage[mlflow.TokenUsageKey.TOTAL_TOKENS]).toBe(15);

      const messageFormat = llmSpan.attributes[mlflow.SpanAttributeKey.MESSAGE_FORMAT];
      expect(messageFormat).toBe('gemini');
    });

    it('should trace models.generateContent()', async () => {
      const gemini = new GoogleGenAI({ apiKey: 'test-key' });
      const wrappedGemini = tracedGemini(gemini);

      const result = await mlflow.withSpan(
        async () => {
          return await wrappedGemini.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: 'Hello Gemini'
          });
        },
        {
          name: 'test-trace',
          spanType: mlflow.SpanType.CHAIN
        }
      );

      expect(result).toBeDefined();
      expect(result.usageMetadata).toBeDefined();

      const trace = await getLastActiveTrace();
      expect(trace.info.state).toBe('OK');

      expect(trace.data.spans.length).toBe(2);

      const llmSpan = trace.data.spans.find((s) => s.spanType === mlflow.SpanType.LLM)!;
      expect(llmSpan).toBeDefined();
      expect(llmSpan.name).toBe('generateContent');
      expect(llmSpan.status.statusCode).toBe(mlflow.SpanStatusCode.OK);
      expect(llmSpan.inputs).toEqual({
        model: 'gemini-2.0-flash-001',
        contents: 'Hello Gemini'
      });
      expect(llmSpan.outputs).toEqual(result);
      expect(llmSpan.startTime).toBeDefined();
      expect(llmSpan.endTime).toBeDefined();

      const spanTokenUsage = llmSpan.attributes[mlflow.SpanAttributeKey.TOKEN_USAGE];
      expect(spanTokenUsage).toBeDefined();
      expect(typeof spanTokenUsage[mlflow.TokenUsageKey.INPUT_TOKENS]).toBe('number');
      expect(typeof spanTokenUsage[mlflow.TokenUsageKey.OUTPUT_TOKENS]).toBe('number');
      expect(typeof spanTokenUsage[mlflow.TokenUsageKey.TOTAL_TOKENS]).toBe('number');
      expect(spanTokenUsage[mlflow.TokenUsageKey.INPUT_TOKENS]).toBe(10);
      expect(spanTokenUsage[mlflow.TokenUsageKey.OUTPUT_TOKENS]).toBe(5);
      expect(spanTokenUsage[mlflow.TokenUsageKey.TOTAL_TOKENS]).toBe(15);

      const messageFormat = llmSpan.attributes[mlflow.SpanAttributeKey.MESSAGE_FORMAT];
      expect(messageFormat).toBe('gemini');
    });

    it('should handle generateContent errors properly', async () => {
      server.use(
        http.post(
          'https://generativelanguage.googleapis.com/v1beta/models/*\\:generateContent',
          () => {
            return HttpResponse.json(
              {
                error: {
                  code: 429,
                  message: 'Resource has been exhausted',
                  status: 'RESOURCE_EXHAUSTED'
                }
              },
              { status: 429 }
            );
          }
        )
      );

      const gemini = new GoogleGenAI({ apiKey: 'test-key' });
      const wrappedGemini = tracedGemini(gemini);

      await expect(
        mlflow.withSpan(
          async () => {
            return await wrappedGemini.models.generateContent({
              model: 'gemini-2.0-flash-001',
              contents: 'This should fail'
            });
          },
          {
            name: 'error-test-trace',
            spanType: mlflow.SpanType.CHAIN
          }
        )
      ).rejects.toThrow();

      const trace = await getLastActiveTrace();
      expect(trace.info.state).toBe('ERROR');

      const llmSpan = trace.data.spans.find((s) => s.spanType === mlflow.SpanType.LLM);
      expect(llmSpan).toBeDefined();
      expect(llmSpan!.status.statusCode).toBe(mlflow.SpanStatusCode.ERROR);
      expect(llmSpan!.inputs).toEqual({
        model: 'gemini-2.0-flash-001',
        contents: 'This should fail'
      });
      expect(llmSpan!.outputs).toBeUndefined();
      expect(llmSpan!.startTime).toBeDefined();
      expect(llmSpan!.endTime).toBeDefined();
    });

    it('should trace Gemini request wrapped in a parent span', async () => {
      const gemini = new GoogleGenAI({ apiKey: 'test-key' });
      const wrappedGemini = tracedGemini(gemini);

      const result = await mlflow.withSpan(
        async (_span) => {
          const response = await wrappedGemini.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: 'Hello from parent span'
          });
          return response;
        },
        {
          name: 'predict',
          spanType: mlflow.SpanType.CHAIN,
          inputs: 'Hello from parent span'
        }
      );

      const trace = await getLastActiveTrace();
      expect(trace.info.state).toBe('OK');
      expect(trace.data.spans.length).toBe(2);

      const parentSpan = trace.data.spans[0];
      expect(parentSpan.name).toBe('predict');
      expect(parentSpan.status.statusCode).toBe(mlflow.SpanStatusCode.OK);
      expect(parentSpan.spanType).toBe(mlflow.SpanType.CHAIN);
      expect(parentSpan.inputs).toEqual('Hello from parent span');
      expect(parentSpan.outputs).toEqual(result);
      expect(parentSpan.startTime).toBeDefined();
      expect(parentSpan.endTime).toBeDefined();

      const childSpan = trace.data.spans[1];
      expect(childSpan.name).toBe('generateContent');
      expect(childSpan.status.statusCode).toBe(mlflow.SpanStatusCode.OK);
      expect(childSpan.spanType).toBe(mlflow.SpanType.LLM);
      expect(childSpan.inputs).toEqual({
        model: 'gemini-2.0-flash-001',
        contents: 'Hello from parent span'
      });
      expect(childSpan.outputs).toBeDefined();
      expect(childSpan.startTime).toBeDefined();
      expect(childSpan.endTime).toBeDefined();
    });

    it('should not trace methods outside SUPPORTED_METHODS', () => {
      const gemini = new GoogleGenAI({ apiKey: 'test-key' });
      const wrappedGemini = tracedGemini(gemini);

      expect(wrappedGemini.models).toBeDefined();
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: mockGeminiServer.ts]---
Location: mlflow-master/libs/typescript/integrations/gemini/tests/mockGeminiServer.ts

```typescript
/**
 * MSW-based Gemini API mock server for testing
 * Provides realistic Gemini API responses for comprehensive testing
 */

import { http, HttpResponse } from 'msw';

interface GeminiGenerateContentRequest {
  model?: string;
  contents: any;
  config?: any;
}

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
    index: number;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  text?: () => string;
}

/**
 * Create a realistic Gemini generateContent response
 */
function createGenerateContentResponse(
  _request: GeminiGenerateContentRequest
): GeminiGenerateContentResponse {
  const responseText = 'Test response from Gemini';

  return {
    candidates: [
      {
        content: {
          parts: [
            {
              text: responseText
            }
          ],
          role: 'model'
        },
        finishReason: 'STOP',
        index: 0
      }
    ],
    usageMetadata: {
      promptTokenCount: 10,
      candidatesTokenCount: 5,
      totalTokenCount: 15
    },
    text: () => responseText
  };
}

/**
 * Main MSW handlers for Gemini API endpoints
 */
export const geminiMockHandlers = [
  http.post(
    'https://generativelanguage.googleapis.com/v1beta/models/*\\:generateContent',
    async ({ request }) => {
      const body = (await request.json()) as GeminiGenerateContentRequest;
      return HttpResponse.json(createGenerateContentResponse(body));
    }
  ),

  http.post(
    'https://generativelanguage.googleapis.com/v1/models/*\\:generateContent',
    async ({ request }) => {
      const body = (await request.json()) as GeminiGenerateContentRequest;
      return HttpResponse.json(createGenerateContentResponse(body));
    }
  )
];
```

--------------------------------------------------------------------------------

---[FILE: openaiTestHelper.ts]---
Location: mlflow-master/libs/typescript/integrations/helpers/openaiTestHelper.ts

```typescript
/**
 * MSW-based OpenAI API mock server for testing
 * Provides realistic OpenAI API responses for comprehensive testing
 */

import { http, HttpResponse } from 'msw';
import {
  ChatCompletion,
  ChatCompletionCreateParams,
  CreateEmbeddingResponse,
  EmbeddingCreateParams
} from 'openai/resources/index';
import { ResponseCreateParams, Response } from 'openai/resources/responses/responses';
import { setupServer } from 'msw/node';

/**
 * Create a realistic chat completion response
 */
function createChatCompletionResponse(request: ChatCompletionCreateParams): ChatCompletion {
  const timestamp = Math.floor(Date.now() / 1000);
  const requestId = `chatcmpl-${Math.random().toString(36).substring(2, 15)}`;

  return {
    id: requestId,
    object: 'chat.completion',
    created: timestamp,
    model: request.model,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: 'Test response content',
          refusal: null
        },
        finish_reason: 'stop',
        logprobs: null
      }
    ],
    usage: {
      prompt_tokens: 100,
      completion_tokens: 200,
      total_tokens: 300
    }
  };
}

/**
 * Create a mock response for Responses API
 */
function createResponsesResponse(request: ResponseCreateParams): Response {
  return {
    id: 'responses-123',
    object: 'response',
    model: request.model || '',
    output: [
      {
        id: 'response-123',
        content: [
          {
            type: 'output_text',
            text: 'Dummy output',
            annotations: []
          }
        ],
        role: 'assistant',
        status: 'completed',
        type: 'message'
      }
    ],
    usage: {
      input_tokens: 36,
      output_tokens: 87,
      total_tokens: 123,
      input_tokens_details: {
        cached_tokens: 0
      },
      output_tokens_details: {
        reasoning_tokens: 0
      }
    },
    created_at: 123,
    output_text: 'Dummy output',
    error: null,
    incomplete_details: null,
    instructions: null,
    metadata: null,
    parallel_tool_calls: false,
    temperature: 0.5,
    tools: [],
    top_p: 1,
    tool_choice: 'auto'
  };
}

/**
 * Create a mock response for Embeddings API
 */
function createEmbeddingResponse(request: EmbeddingCreateParams): CreateEmbeddingResponse {
  const inputs = Array.isArray(request.input) ? request.input : [request.input];

  return {
    object: 'list',
    data: inputs.map((_, index) => ({
      object: 'embedding',
      index,
      embedding: Array(1536)
        .fill(0)
        .map(() => Math.random() * 0.1 - 0.05)
    })),
    model: request.model,
    usage: {
      prompt_tokens: inputs.length * 10,
      total_tokens: inputs.length * 10
    }
  };
}

/**
 * Main MSW handlers for OpenAI API endpoints
 */
export const openAIMockHandlers = [
  http.post('https://api.openai.com/v1/chat/completions', async ({ request }) => {
    const body = (await request.json()) as ChatCompletionCreateParams;
    return HttpResponse.json(createChatCompletionResponse(body));
  }),
  http.post('https://api.openai.com/v1/responses', async ({ request }) => {
    const body = (await request.json()) as ResponseCreateParams;
    return HttpResponse.json(createResponsesResponse(body));
  }),
  http.post('https://api.openai.com/v1/embeddings', async ({ request }) => {
    const body = (await request.json()) as EmbeddingCreateParams;
    return HttpResponse.json(createEmbeddingResponse(body));
  })
];

export const openAIMswServer = setupServer(...openAIMockHandlers);

export function useMockOpenAIServer(): void {
  beforeAll(() => openAIMswServer.listen());
  afterEach(() => openAIMswServer.resetHandlers());
  afterAll(() => openAIMswServer.close());
}
```

--------------------------------------------------------------------------------

---[FILE: jest.config.js]---
Location: mlflow-master/libs/typescript/integrations/openai/jest.config.js

```javascript
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },
  globalSetup: '<rootDir>/../../jest.global-server-setup.ts',
  globalTeardown: '<rootDir>/../../jest.global-server-teardown.ts',
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
};
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: mlflow-master/libs/typescript/integrations/openai/package.json

```json
{
  "name": "mlflow-openai",
  "version": "0.1.1",
  "description": "OpenAI integration package for MLflow Tracing",
  "repository": {
    "type": "git",
    "url": "https://github.com/mlflow/mlflow.git"
  },
  "homepage": "https://mlflow.org/",
  "author": {
    "name": "MLflow",
    "url": "https://mlflow.org/"
  },
  "bugs": {
    "url": "https://github.com/mlflow/mlflow/issues"
  },
  "license": "Apache-2.0",
  "keywords": [
    "mlflow",
    "tracing",
    "observability",
    "opentelemetry",
    "llm",
    "openai",
    "javascript",
    "typescript"
  ],
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "peerDependencies": {
    "mlflow-tracing": "^0.1.1",
    "openai": ">=4.0.0"
  },
  "devDependencies": {
    "jest": "^29.6.2",
    "typescript": "^5.8.3"
  },
  "engines": {
    "node": ">=18"
  },
  "files": [
    "dist/"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/libs/typescript/integrations/openai/README.md

```text
# MLflow Typescript SDK - OpenAI

Seamlessly integrate [MLflow Tracing](https://github.com/mlflow/mlflow/tree/main/libs/typescript) with OpenAI to automatically trace your OpenAI API calls.

| Package             | NPM                                                                                                                                         | Description                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [mlflow-openai](./) | [![npm package](https://img.shields.io/npm/v/mlflow-tracing-openai?style=flat-square)](https://www.npmjs.com/package/mlflow-tracing-openai) | Auto-instrumentation integration for OpenAI. |

## Installation

```bash
npm install mlflow-openai
```

The package includes the [`mlflow-tracing`](https://github.com/mlflow/mlflow/tree/main/libs/typescript) package and `openai` package as peer dependencies. Depending on your package manager, you may need to install these two packages separately.

## Quickstart

Start MLflow Tracking Server. If you have a local Python environment, you can run the following command:

```bash
pip install mlflow
mlflow server --backend-store-uri sqlite:///mlruns.db --port 5000
```

If you don't have Python environment locally, MLflow also supports Docker deployment or managed services. See [Self-Hosting Guide](https://mlflow.org/docs/latest/self-hosting/index.html) for getting started.

Instantiate MLflow SDK in your application:

```typescript
import * as mlflow from 'mlflow-tracing';

mlflow.init({
  trackingUri: 'http://localhost:5000',
  experimentId: '<experiment-id>'
});
```

Create a trace:

```typescript
import { OpenAI } from 'openai';
import { tracedOpenAI } from 'mlflow-openai';

// Wrap the OpenAI client with the tracedOpenAI function
const client = tracedOpenAI(new OpenAI());

// Invoke the client as usual
const response = await client.chat.completions.create({
  model: 'o4-mini',
  messages: [
    { role: 'system', content: 'You are a helpful weather assistant.' },
    { role: 'user', content: "What's the weather like in Seattle?" }
  ]
});
```

View traces in MLflow UI:

![MLflow Tracing UI](https://github.com/mlflow/mlflow/blob/891fed9a746477f808dd2b82d3abb2382293c564/docs/static/images/llms/tracing/quickstart/single-openai-trace-detail.png?raw=true)

## Documentation 📘

Official documentation for MLflow Typescript SDK can be found [here](https://mlflow.org/docs/latest/genai/tracing/quickstart).

## License

This project is licensed under the [Apache License 2.0](https://github.com/mlflow/mlflow/blob/master/LICENSE.txt).
```

--------------------------------------------------------------------------------

````
