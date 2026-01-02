---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 225
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 225 of 991)

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

---[FILE: tracedOpenAI.html]---
Location: mlflow-master/libs/typescript/integrations/openai/docs/functions/tracedOpenAI.html

```text
<!doctype html>
<html class="default" lang="en" data-base="../">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="IE=edge" />
    <title>tracedOpenAI | mlflow-openai</title>
    <meta name="description" content="Documentation for mlflow-openai" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="../assets/style.css" />
    <link rel="stylesheet" href="../assets/highlight.css" />
    <script defer src="../assets/main.js"></script>
    <script async src="../assets/icons.js" id="tsd-icons-script"></script>
    <script async src="../assets/search.js" id="tsd-search-script"></script>
    <script async src="../assets/navigation.js" id="tsd-nav-script"></script>
  </head>
  <body>
    <script>
      document.documentElement.dataset.theme = localStorage.getItem('tsd-theme') || 'os';
      document.body.style.display = 'none';
      setTimeout(
        () => (window.app ? app.showPage() : document.body.style.removeProperty('display')),
        500
      );
    </script>
    <header class="tsd-page-toolbar">
      <div class="tsd-toolbar-contents container">
        <a href="../index.html" class="title">mlflow-openai</a>
        <div id="tsd-toolbar-links"></div>
        <button id="tsd-search-trigger" class="tsd-widget" aria-label="Search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <use href="../assets/icons.svg#icon-search"></use>
          </svg>
        </button>
        <dialog id="tsd-search" aria-label="Search">
          <input
            role="combobox"
            id="tsd-search-input"
            aria-controls="tsd-search-results"
            aria-autocomplete="list"
            aria-expanded="true"
            autocapitalize="off"
            autocomplete="off"
            placeholder="Search the docs"
            maxlength="100"
          />
          <ul role="listbox" id="tsd-search-results"></ul>
          <div id="tsd-search-status" aria-live="polite" aria-atomic="true">
            <div>Preparing search index...</div>
          </div>
        </dialog>
        <a
          href="#"
          class="tsd-widget menu"
          id="tsd-toolbar-menu-trigger"
          data-toggle="menu"
          aria-label="Menu"
          ><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <use href="../assets/icons.svg#icon-menu"></use></svg
        ></a>
      </div>
    </header>
    <div class="container container-main">
      <div class="col-content">
        <div class="tsd-page-title">
          <ul class="tsd-breadcrumb" aria-label="Breadcrumb">
            <li><a href="" aria-current="page">tracedOpenAI</a></li>
          </ul>
          <h1>Function tracedOpenAI</h1>
        </div>
        <section class="tsd-panel">
          <ul class="tsd-signatures">
            <li class="">
              <div class="tsd-signature tsd-anchor-link" id="tracedopenai">
                <span class="tsd-kind-call-signature">tracedOpenAI</span
                ><span class="tsd-signature-symbol">&lt;</span
                ><a class="tsd-signature-type tsd-kind-type-parameter" href="#tracedopenait">T</a>
                <span class="tsd-signature-symbol">=</span>
                <span class="tsd-signature-type">any</span
                ><span class="tsd-signature-symbol">&gt;</span
                ><span class="tsd-signature-symbol">(</span
                ><span class="tsd-kind-parameter">openaiClient</span
                ><span class="tsd-signature-symbol">:</span>
                <a class="tsd-signature-type tsd-kind-type-parameter" href="#tracedopenait">T</a
                ><span class="tsd-signature-symbol">)</span
                ><span class="tsd-signature-symbol">:</span>
                <a class="tsd-signature-type tsd-kind-type-parameter" href="#tracedopenait">T</a
                ><a href="#tracedopenai" aria-label="Permalink" class="tsd-anchor-icon"
                  ><svg viewBox="0 0 24 24" aria-hidden="true">
                    <use href="../assets/icons.svg#icon-anchor"></use></svg
                ></a>
              </div>
              <div class="tsd-description">
                <div class="tsd-comment tsd-typography">
                  <p>Create a traced version of OpenAI client with MLflow tracing</p>
                </div>
                <section class="tsd-panel">
                  <h4>Type Parameters</h4>
                  <ul class="tsd-type-parameter-list">
                    <li>
                      <span id="tracedopenait"
                        ><span class="tsd-kind-type-parameter">T</span> =
                        <span class="tsd-signature-type">any</span></span
                      >
                    </li>
                  </ul>
                </section>
                <div class="tsd-parameters">
                  <h4 class="tsd-parameters-title">Parameters</h4>
                  <ul class="tsd-parameter-list">
                    <li>
                      <span
                        ><span class="tsd-kind-parameter">openaiClient</span>:
                        <a class="tsd-signature-type tsd-kind-type-parameter" href="#tracedopenait"
                          >T</a
                        ></span
                      >
                      <div class="tsd-comment tsd-typography">
                        <p>The OpenAI client instance to trace</p>
                      </div>
                      <div class="tsd-comment tsd-typography"></div>
                    </li>
                  </ul>
                </div>
                <h4 class="tsd-returns-title">
                  Returns
                  <a class="tsd-signature-type tsd-kind-type-parameter" href="#tracedopenait">T</a>
                </h4>
                <p>Traced OpenAI client with tracing capabilities</p>
                <div class="tsd-comment tsd-typography">
                  <div class="tsd-tag-example">
                    <h4 class="tsd-anchor-link" id="example">
                      Example<a href="#example" aria-label="Permalink" class="tsd-anchor-icon"
                        ><svg viewBox="0 0 24 24" aria-hidden="true">
                          <use href="../assets/icons.svg#icon-anchor"></use></svg
                      ></a>
                    </h4>
                    <pre><code class="ts"><span class="hl-3">const</span><span class="hl-1"> </span><span class="hl-8">openai</span><span class="hl-1"> = </span><span class="hl-3">new</span><span class="hl-1"> </span><span class="hl-0">OpenAI</span><span class="hl-1">({ </span><span class="hl-6">apiKey:</span><span class="hl-1"> </span><span class="hl-2">&#39;test-key&#39;</span><span class="hl-1"> });</span><br/><span class="hl-3">const</span><span class="hl-1"> </span><span class="hl-8">wrappedOpenAI</span><span class="hl-1"> = </span><span class="hl-0">tracedOpenAI</span><span class="hl-1">(</span><span class="hl-6">openai</span><span class="hl-1">);</span><br/><br/><span class="hl-3">const</span><span class="hl-1"> </span><span class="hl-8">response</span><span class="hl-1"> = </span><span class="hl-5">await</span><span class="hl-1"> </span><span class="hl-6">wrappedOpenAI</span><span class="hl-1">.</span><span class="hl-6">chat</span><span class="hl-1">.</span><span class="hl-6">completions</span><span class="hl-1">.</span><span class="hl-0">create</span><span class="hl-1">({</span><br/><span class="hl-1">  </span><span class="hl-6">messages:</span><span class="hl-1"> [{ </span><span class="hl-6">role:</span><span class="hl-1"> </span><span class="hl-2">&#39;user&#39;</span><span class="hl-1">, </span><span class="hl-6">content:</span><span class="hl-1"> </span><span class="hl-2">&#39;Hello!&#39;</span><span class="hl-1"> }],</span><br/><span class="hl-1">  </span><span class="hl-6">model:</span><span class="hl-1"> </span><span class="hl-2">&#39;gpt-4o-mini&#39;</span><span class="hl-1">,</span><br/><span class="hl-1">  </span><span class="hl-6">temperature:</span><span class="hl-1"> </span><span class="hl-4">0.5</span><br/><span class="hl-1">});</span><br/><br/><span class="hl-7">// The trace for the LLM call will be logged to MLflow</span>
</code><button type="button">Copy</button></pre>
                  </div>
                </div>
                <aside class="tsd-sources">
                  <ul>
                    <li>
                      Defined in
                      <a
                        href="https://github.com/B-Step62/mlflow/blob/eb4d233dd0494814558dd6fc289a886ce32ff004/packages/typescript/integrations/openai/src/index.ts#L34"
                        >index.ts:34</a
                      >
                    </li>
                  </ul>
                </aside>
              </div>
            </li>
          </ul>
        </section>
      </div>
      <div class="col-sidebar">
        <div class="page-menu">
          <div class="tsd-navigation settings">
            <details class="tsd-accordion">
              <summary class="tsd-accordion-summary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <use href="../assets/icons.svg#icon-chevronDown"></use>
                </svg>
                <h3>Settings</h3>
              </summary>
              <div class="tsd-accordion-details">
                <div class="tsd-filter-visibility">
                  <span class="settings-label">Member Visibility</span>
                  <ul id="tsd-filter-options">
                    <li class="tsd-filter-item">
                      <label class="tsd-filter-input"
                        ><input type="checkbox" id="tsd-filter-protected" name="protected" /><svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <rect
                            class="tsd-checkbox-background"
                            width="30"
                            height="30"
                            x="1"
                            y="1"
                            rx="6"
                            fill="none"
                          ></rect>
                          <path
                            class="tsd-checkbox-checkmark"
                            d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25"
                            stroke="none"
                            stroke-width="3.5"
                            stroke-linejoin="round"
                            fill="none"
                          ></path></svg
                        ><span>Protected</span></label
                      >
                    </li>
                    <li class="tsd-filter-item">
                      <label class="tsd-filter-input"
                        ><input
                          type="checkbox"
                          id="tsd-filter-inherited"
                          name="inherited"
                          checked
                        /><svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                          <rect
                            class="tsd-checkbox-background"
                            width="30"
                            height="30"
                            x="1"
                            y="1"
                            rx="6"
                            fill="none"
                          ></rect>
                          <path
                            class="tsd-checkbox-checkmark"
                            d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25"
                            stroke="none"
                            stroke-width="3.5"
                            stroke-linejoin="round"
                            fill="none"
                          ></path></svg
                        ><span>Inherited</span></label
                      >
                    </li>
                    <li class="tsd-filter-item">
                      <label class="tsd-filter-input"
                        ><input type="checkbox" id="tsd-filter-external" name="external" /><svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <rect
                            class="tsd-checkbox-background"
                            width="30"
                            height="30"
                            x="1"
                            y="1"
                            rx="6"
                            fill="none"
                          ></rect>
                          <path
                            class="tsd-checkbox-checkmark"
                            d="M8.35422 16.8214L13.2143 21.75L24.6458 10.25"
                            stroke="none"
                            stroke-width="3.5"
                            stroke-linejoin="round"
                            fill="none"
                          ></path></svg
                        ><span>External</span></label
                      >
                    </li>
                  </ul>
                </div>
                <div class="tsd-theme-toggle">
                  <label class="settings-label" for="tsd-theme">Theme</label
                  ><select id="tsd-theme">
                    <option value="os">OS</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </details>
          </div>
        </div>
        <div class="site-menu">
          <nav class="tsd-navigation">
            <a href="../modules.html">mlflow-openai</a>
            <ul class="tsd-small-nested-navigation" id="tsd-nav-container">
              <li>Loading...</li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <footer>
      <p class="tsd-generator">
        Generated using <a href="https://typedoc.org/" target="_blank">TypeDoc</a>
      </p>
    </footer>
    <div class="overlay"></div>
  </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/libs/typescript/integrations/openai/src/index.ts

```typescript
/**
 * Main tracedOpenAI wrapper function for MLflow tracing integration
 */

import { CompletionUsage } from 'openai/resources/index';
import { ResponseUsage } from 'openai/resources/responses/responses';
import { withSpan, LiveSpan, SpanAttributeKey, SpanType, TokenUsage } from 'mlflow-tracing';

// NB: 'Completions' represents chat.completions
const SUPPORTED_MODULES = ['Completions', 'Responses', 'Embeddings'];
const SUPPORTED_METHODS = ['create']; // chat.completions.create, embeddings.create, responses.create

type OpenAIUsage = CompletionUsage | ResponseUsage;

/**
 * Create a traced version of OpenAI client with MLflow tracing
 * @param openaiClient - The OpenAI client instance to trace
 * @param config - Optional configuration for tracing
 * @returns Traced OpenAI client with tracing capabilities
 *
 * @example
 * const openai = new OpenAI({ apiKey: 'test-key' });
 * const wrappedOpenAI = tracedOpenAI(openai);
 *
 * const response = await wrappedOpenAI.chat.completions.create({
 *   messages: [{ role: 'user', content: 'Hello!' }],
 *   model: 'gpt-4o-mini',
 *   temperature: 0.5
 * });
 *
 * // The trace for the LLM call will be logged to MLflow
 *
 */
export function tracedOpenAI<T = any>(openaiClient: T): T {
  /**
   * Create a proxy to intercept method calls
   */
  const tracedClient = new Proxy(openaiClient as any, {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver);
      const moduleName = (target as object).constructor.name;

      if (typeof original === 'function') {
        // If reach to the end function to be traced, wrap it with tracing
        if (shouldTraceMethod(moduleName, String(prop))) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          return wrapWithTracing(original as Function, moduleName) as T;
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        return (original as Function).bind(target) as T;
      }

      // For nested objects (like chat.completions), recursively apply tracking
      if (
        original &&
        !Array.isArray(original) &&
        !(original instanceof Date) &&
        typeof original === 'object'
      ) {
        return tracedOpenAI(original) as T;
      }

      return original as T;
    }
  });
  return tracedClient as T;
}

/**
 * Determine if a method should be traced based on the target object and property
 */
function shouldTraceMethod(module: string, methodName: string): boolean {
  return SUPPORTED_MODULES.includes(module) && SUPPORTED_METHODS.includes(methodName);
}

/**
 * Wrap a function with tracing using the full method path
 *
 * @param fn - The function to wrap
 * @param target - The target module that contains the function to wrap
 * @returns The wrapped function
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function wrapWithTracing(fn: Function, moduleName: string): Function {
  // Use the full method path for span type determination
  const spanType = getSpanType(moduleName);
  const name = moduleName;

  return function (this: any, ...args: any[]) {
    // If the method is not supported, return the original function
    if (!spanType) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fn.apply(this, args);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return withSpan(
      async (span: LiveSpan) => {
        span.setInputs(args[0]);

        const result = await fn.apply(this, args);

        // TODO: Handle streaming responses
        span.setOutputs(result);

        // Add token usage
        try {
          const usage = extractTokenUsage(result);
          if (usage) {
            span.setAttribute(SpanAttributeKey.TOKEN_USAGE, usage);
          }
        } catch (error) {
          console.debug('Error extracting token usage', error);
        }

        span.setAttribute(SpanAttributeKey.MESSAGE_FORMAT, 'openai');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
      },
      { name, spanType }
    );
  };
}

/**
 * Determine span type based on the full method path
 */
function getSpanType(moduleName: string): SpanType | undefined {
  switch (moduleName) {
    case 'Completions':
      return SpanType.LLM;
    case 'Responses':
      return SpanType.LLM;
    case 'Embeddings':
      return SpanType.EMBEDDING;
    // TODO: Support other methods in the future.
    default:
      return undefined;
  }
}

/**
 * Extract token usage information from OpenAI response
 * Supports both ChatCompletion API format and Responses API format
 */
function extractTokenUsage(response: any): TokenUsage | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const usage = response?.usage as OpenAIUsage | undefined;

  if (!usage) {
    return undefined;
  }

  // Try Responses API format first (input_tokens, output_tokens)
  if ('input_tokens' in usage) {
    return {
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      total_tokens: usage.total_tokens || usage.input_tokens + usage.output_tokens
    };
  }

  // Fall back to ChatCompletion API format (prompt_tokens, completion_tokens)
  if ('prompt_tokens' in usage) {
    return {
      input_tokens: usage.prompt_tokens,
      output_tokens: usage.completion_tokens ?? 0,
      total_tokens: usage.total_tokens || usage.prompt_tokens + (usage.completion_tokens ?? 0)
    };
  }

  return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: index.test.ts]---
Location: mlflow-master/libs/typescript/integrations/openai/tests/index.test.ts

```typescript
/**
 * Tests for MLflow OpenAI integration with MSW mock server
 */

import * as mlflow from 'mlflow-tracing';
import { tracedOpenAI } from '../src';
import { OpenAI } from 'openai';
import { http, HttpResponse } from 'msw';
import { openAIMswServer, useMockOpenAIServer } from '../../helpers/openaiTestHelper';

const TEST_TRACKING_URI = 'http://localhost:5000';

describe('tracedOpenAI', () => {
  useMockOpenAIServer();

  let experimentId: string;
  let client: mlflow.MlflowClient;

  beforeAll(async () => {
    // Setup MLflow client and experiment
    client = new mlflow.MlflowClient({ trackingUri: TEST_TRACKING_URI, host: TEST_TRACKING_URI });

    // Create a new experiment
    const experimentName = `test-experiment-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    experimentId = await client.createExperiment(experimentName);
    mlflow.init({
      trackingUri: TEST_TRACKING_URI,
      experimentId: experimentId
    });
  });

  afterAll(async () => {
    await client.deleteExperiment(experimentId);
  });

  const getLastActiveTrace = async (): Promise<mlflow.Trace> => {
    await mlflow.flushTraces();
    const traceId = mlflow.getLastActiveTraceId();
    const trace = await client.getTrace(traceId!);
    return trace;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Chat Completions', () => {
    it('should trace chat.completions.create()', async () => {
      const openai = new OpenAI({ apiKey: 'test-key' });
      const wrappedOpenAI = tracedOpenAI(openai);

      const result = await wrappedOpenAI.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello!' }]
      });

      const trace = await getLastActiveTrace();
      expect(trace.info.state).toBe('OK');

      const tokenUsage = trace.info.tokenUsage;
      expect(tokenUsage).toBeDefined();
      expect(typeof tokenUsage?.input_tokens).toBe('number');
      expect(typeof tokenUsage?.output_tokens).toBe('number');
      expect(typeof tokenUsage?.total_tokens).toBe('number');

      const span = trace.data.spans[0];
      expect(span.name).toBe('Completions');
      expect(span.spanType).toBe(mlflow.SpanType.LLM);
      expect(span.status.statusCode).toBe(mlflow.SpanStatusCode.OK);
      expect(span.inputs).toEqual({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello!' }]
      });
      expect(span.outputs).toEqual(result);
      expect(span.startTime).toBeDefined();
      expect(span.endTime).toBeDefined();

      // Check that token usage is stored at span level
      const spanTokenUsage = span.attributes[mlflow.SpanAttributeKey.TOKEN_USAGE];
      expect(spanTokenUsage).toBeDefined();
      expect(typeof spanTokenUsage[mlflow.TokenUsageKey.INPUT_TOKENS]).toBe('number');
      expect(typeof spanTokenUsage[mlflow.TokenUsageKey.OUTPUT_TOKENS]).toBe('number');
      expect(typeof spanTokenUsage[mlflow.TokenUsageKey.TOTAL_TOKENS]).toBe('number');
    });

    it('should handle chat completion errors properly', async () => {
      // Configure MSW to return rate limit error
      openAIMswServer.use(
        http.post('https://api.openai.com/v1/chat/completions', () => {
          return HttpResponse.json(
            {
              error: {
                type: 'requests',
                message: 'Rate limit exceeded'
              }
            },
            { status: 429 }
          );
        })
      );

      const openai = new OpenAI({ apiKey: 'test-key' });
      const wrappedOpenAI = tracedOpenAI(openai);

      await expect(
        wrappedOpenAI.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: 'This should fail' }]
        })
      ).rejects.toThrow();

      const trace = await getLastActiveTrace();
      expect(trace.info.state).toBe('ERROR');

      const span = trace.data.spans[0];
      expect(span.status.statusCode).toBe(mlflow.SpanStatusCode.ERROR);
      expect(span.inputs).toEqual({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'This should fail' }]
      });
      expect(span.outputs).toBeUndefined();
      expect(span.startTime).toBeDefined();
      expect(span.endTime).toBeDefined();
    });

    it('should trace OpenAI request wrapped in a parent span', async () => {
      const openai = new OpenAI({ apiKey: 'test-key' });
      const wrappedOpenAI = tracedOpenAI(openai);

      const result = await mlflow.withSpan(
        async (_span) => {
          const response = await wrappedOpenAI.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: 'Hello!' }]
          });
          return response.choices[0].message.content;
        },
        {
          name: 'predict',
          spanType: mlflow.SpanType.CHAIN,
          inputs: 'Hello!'
        }
      );

      const trace = await getLastActiveTrace();
      expect(trace.info.state).toBe('OK');
      expect(trace.data.spans.length).toBe(2);

      const parentSpan = trace.data.spans[0];
      expect(parentSpan.name).toBe('predict');
      expect(parentSpan.status.statusCode).toBe(mlflow.SpanStatusCode.OK);
      expect(parentSpan.spanType).toBe(mlflow.SpanType.CHAIN);
      expect(parentSpan.inputs).toEqual('Hello!');
      expect(parentSpan.outputs).toEqual(result);
      expect(parentSpan.startTime).toBeDefined();
      expect(parentSpan.endTime).toBeDefined();

      const childSpan = trace.data.spans[1];
      expect(childSpan.name).toBe('Completions');
      expect(childSpan.status.statusCode).toBe(mlflow.SpanStatusCode.OK);
      expect(childSpan.spanType).toBe(mlflow.SpanType.LLM);
      expect(childSpan.inputs).toEqual({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello!' }]
      });
      expect(childSpan.outputs).toBeDefined();
      expect(childSpan.startTime).toBeDefined();
      expect(childSpan.endTime).toBeDefined();
    });
  });

  describe('Responses API', () => {
    it('should trace responses.create()', async () => {
      const openai = new OpenAI({ apiKey: 'test-key' });
      const wrappedOpenAI = tracedOpenAI(openai);

      const response = await wrappedOpenAI.responses.create({
        input: 'Hello!',
        model: 'gpt-4o',
        temperature: 0
      });

      // Verify response
      expect((response as any).id).toBe('responses-123');

      // Get and verify the trace
      const trace = await getLastActiveTrace();
      expect(trace.info.state).toBe('OK');
      expect(trace.info.tokenUsage?.input_tokens).toBe(response.usage?.input_tokens);
      expect(trace.info.tokenUsage?.output_tokens).toBe(response.usage?.output_tokens);
      expect(trace.info.tokenUsage?.total_tokens).toBe(response.usage?.total_tokens);
      expect(trace.data.spans.length).toBe(1);

      const span = trace.data.spans[0];
      expect(span.spanType).toBe(mlflow.SpanType.LLM);
      expect(span.inputs).toEqual({
        input: 'Hello!',
        model: 'gpt-4o',
        temperature: 0
      });
      expect(span.outputs).toEqual(response);
    });
  });

  describe('Embeddings API', () => {
    it('should trace embeddings.create() with input: %p', async () => {
      const openai = new OpenAI({ apiKey: 'test-key' });
      const wrappedOpenAI = tracedOpenAI(openai);

      const response = await wrappedOpenAI.embeddings.create({
        model: 'text-embedding-3-small',
        input: ['Hello', 'world']
      });

      expect(response.object).toBe('list');
      expect(response.data.length).toBe(2);
      expect(response.data[0].object).toBe('embedding');
      expect(response.data[0].embedding.length).toBeGreaterThan(0);
      expect(response.model).toBe('text-embedding-3-small');

      const trace = await getLastActiveTrace();
      expect(trace.info.state).toBe('OK');
      expect(trace.data.spans.length).toBe(1);

      const tokenUsage = trace.info.tokenUsage;
      expect(tokenUsage).toBeDefined();
      expect(tokenUsage?.input_tokens).toBe(response.usage.prompt_tokens);
      expect(tokenUsage?.output_tokens).toBe(0);
      expect(tokenUsage?.total_tokens).toBe(response.usage.total_tokens);

      const span = trace.data.spans[0];
      expect(span.name).toBe('Embeddings');
      expect(span.spanType).toBe(mlflow.SpanType.EMBEDDING);
      expect(span.status.statusCode).toBe(mlflow.SpanStatusCode.OK);
      expect(span.inputs).toEqual({
        model: 'text-embedding-3-small',
        input: ['Hello', 'world']
      });
      expect(span.outputs).toEqual(response);
      expect(span.startTime).toBeDefined();
      expect(span.endTime).toBeDefined();

      const spanTokenUsage = span.attributes[mlflow.SpanAttributeKey.TOKEN_USAGE];
      expect(spanTokenUsage).toBeDefined();
      expect(spanTokenUsage[mlflow.TokenUsageKey.INPUT_TOKENS]).toBe(response.usage.prompt_tokens);
      expect(spanTokenUsage[mlflow.TokenUsageKey.OUTPUT_TOKENS]).toBe(0);
      expect(spanTokenUsage[mlflow.TokenUsageKey.TOTAL_TOKENS]).toBe(response.usage.total_tokens);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: bump-ts-version.ts]---
Location: mlflow-master/libs/typescript/scripts/bump-ts-version.ts

```typescript
/**
 * CLI script to bump the version of MLflow TypeScript libraries.
 *
 * This script updates the version in:
 * - libs/typescript/core/package.json
 * - libs/typescript/integrations/openai/package.json (version and peerDependencies)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// list of packages that contain `mlflow-tracing` in peerDependencies
const INTEGRATION_PACKAGES = ['openai', 'anthropic', 'vercel', 'gemini'];

interface PackageJson {
  name: string;
  version: string;
  peerDependencies?: Record<string, string>;
  [key: string]: any;
}

function bumpVersion(version: string): void {
  // Define paths to package.json files
  const tsRoot = process.cwd();
  const corePackagePath = join(tsRoot, 'core', 'package.json');

  // Validate that files exist
  if (!existsSync(corePackagePath)) {
    console.error(`Error: ${corePackagePath} does not exist`);
    process.exit(1);
  }

  for (const packageName of INTEGRATION_PACKAGES) {
    const packagePath = join(tsRoot, 'integrations', packageName, 'package.json');
    if (!existsSync(packagePath)) {
      console.error(`Error: ${packagePath} does not exist`);
      process.exit(1);
    }
  }

  // Validate version format (semver with optional prerelease)
  // Matches: X.Y.Z or X.Y.Z-rc.0 or X.Y.Z-beta.1 etc.
  const semverPattern = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
  if (!semverPattern.test(version)) {
    console.error(
      `Error: Invalid version format '${version}'. Expected format: X.Y.Z or X.Y.Z-rc.0`
    );
    process.exit(1);
  }

  // Update core package.json
  console.log(`Updating core/package.json...`);
  const corePackageText = readFileSync(corePackagePath, 'utf-8');
  const corePackage: PackageJson = JSON.parse(corePackageText);

  const oldCoreVersion = corePackage.version;
  corePackage.version = version;

  writeFileSync(corePackagePath, JSON.stringify(corePackage, null, 2) + '\n', 'utf-8');
  console.log(`  ✓ Updated version: ${oldCoreVersion} → ${version}`);

  for (const packageName of INTEGRATION_PACKAGES) {
    const packagePath = join(tsRoot, 'integrations', packageName, 'package.json');
    console.log(`Updating integrations/${packageName}/package.json...`);
    const packageText = readFileSync(packagePath, 'utf-8');
    const packageJson: PackageJson = JSON.parse(packageText);

    const oldVersion = packageJson.version;
    packageJson.version = version;

    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
    console.log(`  ✓ Updated version: ${oldVersion} → ${version}`);

    if (packageJson.peerDependencies && 'mlflow-tracing' in packageJson.peerDependencies) {
      const oldPeerDep = packageJson.peerDependencies['mlflow-tracing'];
      packageJson.peerDependencies['mlflow-tracing'] = `^${version}`;
      writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
      console.log(`  ✓ Updated peerDependency mlflow-tracing: ${oldPeerDep} → ^${version}`);
    }
  }

  console.log(`\n✅ Successfully bumped TypeScript library versions to ${version}`);
}

function main(): void {
  const args = process.argv.slice(2);

  // Parse arguments
  let version: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--version') {
      if (i + 1 < args.length) {
        version = args[i + 1];
        i++;
      } else {
        console.error('Error: --version requires a value');
        process.exit(1);
      }
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log('Usage: tsx scripts/bump-ts-version.ts --version <version>');
      console.log('\nBump the version of MLflow TypeScript libraries');
      console.log('\nOptions:');
      console.log('  --version <version>  Version to bump to (e.g., 0.1.2, 0.2.0, or 1.0.0-rc.0)');
      console.log('  --help, -h           Show this help message');
      process.exit(0);
    }
  }

  if (!version) {
    console.error('Error: --version is required');
    console.log('\nUsage: tsx scripts/bump-ts-version.ts --version <version>');
    process.exit(1);
  }

  bumpVersion(version);
}

main();
```

--------------------------------------------------------------------------------

---[FILE: mockOpenAIServer.ts]---
Location: mlflow-master/libs/typescript/tests/helpers/mockOpenAIServer.ts

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

---[FILE: client.py]---
Location: mlflow-master/mlflow/client.py

```python
"""
The ``mlflow.client`` module provides a Python CRUD interface to MLflow Experiments, Runs,
Model Versions, and Registered Models. This is a lower level API that directly translates to MLflow
`REST API <../rest-api.html>`_ calls.
For a higher level API for managing an "active run", use the :py:mod:`mlflow` module.
"""

from mlflow.tracking.client import MlflowClient

__all__ = [
    "MlflowClient",
]
```

--------------------------------------------------------------------------------

---[FILE: db.py]---
Location: mlflow-master/mlflow/db.py

```python
import click


@click.group("db")
def commands():
    """
    Commands for managing an MLflow tracking database.
    """


@commands.command()
@click.argument("url")
def upgrade(url):
    """
    Upgrade the schema of an MLflow tracking database to the latest supported version.

    **IMPORTANT**: Schema migrations can be slow and are not guaranteed to be transactional -
    **always take a backup of your database before running migrations**. The migrations README,
    which is located at
    https://github.com/mlflow/mlflow/blob/master/mlflow/store/db_migrations/README.md, describes
    large migrations and includes information about how to estimate their performance and
    recover from failures.
    """
    import mlflow.store.db.utils

    engine = mlflow.store.db.utils.create_sqlalchemy_engine_with_retry(url)
    mlflow.store.db.utils._upgrade_db(engine)
```

--------------------------------------------------------------------------------

````
