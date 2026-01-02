---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 210
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 210 of 991)

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

---[FILE: package.json]---
Location: mlflow-master/libs/typescript/package.json

```json
{
  "name": "mlflow-typescript",
  "private": true,
  "description": "TypeScript implementation of MLflow Tracing SDK. This is the root workspace package that includes all the public packages as sub-directories.",
  "workspaces": [
    "core",
    "integrations/*"
  ],
  "scripts": {
    "build": "npm run build:subpackages",
    "build:subpackages": "npm run build:core && npm run build:integrations",
    "build:core": "cd core && npm run build",
    "build:integrations": "npm run -C integrations/openai build && npm run -C integrations/anthropic build && npm run -C integrations/gemini build",
    "test": "npm run test:core && npm run test:integrations",
    "test:core": "cd core && npm run test",
    "test:integrations": "npm run test:openai && npm run test:anthropic && npm run test:gemini",
    "test:openai": "npm run -C integrations/openai test",
    "test:anthropic": "npm run -C integrations/anthropic test",
    "test:gemini": "npm run -C integrations/gemini test",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "npm run build",
    "bump-version": "tsx scripts/bump-ts-version.ts"
  },
  "devDependencies": {
    "typedoc": "^0.28.0"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/libs/typescript/README.md

```text
<h1 align="center" style="border-bottom: none">
    <div>
        <a href="https://mlflow.org/"><picture>
            <img alt="MLflow Logo" src="https://raw.githubusercontent.com/mlflow/mlflow/refs/heads/master/assets/logo.svg" width="200" />
        </picture></a>
        <br>
        MLflow TypeScript SDK
    </div>
</h1>
<h2 align="center" style="border-bottom: none"></h2>

<p align="center">
  <a href="https://github.com/mlflow/mlflow"><img src="https://img.shields.io/github/stars/mlflow/mlflow?style=social" alt="stars"></a>
  <a href="https://www.npmjs.com/package/mlflow-tracing"><img src="https://img.shields.io/npm/v/mlflow-tracing.svg" alt="version"></a>
  <a href="https://www.npmjs.com/package/mlflow-tracing"><img src="https://img.shields.io/npm/dt/mlflow-tracing.svg" alt="downloads"></a>
  <a href="https://github.com/mlflow/mlflow/blob/main/LICENSE"><img src="https://img.shields.io/github/license/mlflow/mlflow" alt="license"></a>
</p>

MLflow Typescript SDK is a variant of the [MLflow Python SDK](https://github.com/mlflow/mlflow) that provides a TypeScript API for MLflow.

> [!IMPORTANT]
> MLflow Typescript SDK is catching up with the Python SDK. Currently only support [Tracing]() and [Feedback Collection]() features. Please raise an issue in Github if you need a feature that is not supported.

## Packages

| Package                                | NPM                                                                                                                                         | Description                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [mlflow-tracing](./core)               | [![npm package](https://img.shields.io/npm/v/mlflow-tracing?style=flat-square)](https://www.npmjs.com/package/mlflow-tracing)               | The core tracing functionality and manual instrumentation. |
| [mlflow-openai](./integrations/openai) | [![npm package](https://img.shields.io/npm/v/mlflow-tracing-openai?style=flat-square)](https://www.npmjs.com/package/mlflow-tracing-openai) | Auto-instrumentation integration for OpenAI.               |

## Installation

```bash
npm install mlflow-tracing
```

> [!NOTE]
> MLflow Typescript SDK requires Node.js 20 or higher.

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

### Configure with environment variables

The SDK can also read configuration from environment variables so you can avoid
hard-coding connection details. If `MLFLOW_TRACKING_URI` and
`MLFLOW_EXPERIMENT_ID` are set, you can initialize the client without passing
any arguments:

```bash
export MLFLOW_TRACKING_URI=http://localhost:5000
export MLFLOW_EXPERIMENT_ID=123456789
```

```typescript
import * as mlflow from 'mlflow-tracing';

mlflow.init(); // Uses the values from the environment
```

Create a trace:

```typescript
// Wrap a function with mlflow.trace to generate a span when the function is called.
// MLflow will automatically record the function name, arguments, return value,
// latency, and exception information to the span.
const getWeather = mlflow.trace(
  (city: string) => {
    return `The weather in ${city} is sunny`;
  },
  // Pass options to set span name. See https://mlflow.org/docs/latest/genai/tracing/quickstart
  // for the full list of options.
  { name: 'get-weather' }
);
getWeather('San Francisco');

// Alternatively, start and end span manually
const span = mlflow.startSpan({ name: 'my-span' });
span.end();
```

View traces in MLflow UI:

![MLflow Tracing UI](https://github.com/mlflow/mlflow/blob/891fed9a746477f808dd2b82d3abb2382293c564/docs/static/images/llms/tracing/quickstart/openai-tool-calling-trace-detail.png?raw=true)

## Publishing

1. Run `yarn bump-version --version <new_version>` from this directory to bump the package versions appropriately
2. `cd` into `core` and run `npm publish`, and repeat for `integrations/openai`

## Adding New Integrations

The TypeScript SDK supports pluggable auto-instrumentation packages under [`integrations/`](./integrations). To add a new integration:

1. Create a new workspace package (for example, `integrations/<provider>`), modeled after the [OpenAI integration](./integrations/openai).
2. Implement the instrumentation entry points in `src/`, exporting a `register()` helper that configures tracing for the target client library.
3. Add package metadata (`package.json`, `tsconfig.json`, and optional `README.md`) so the integration can be built and published.
4. Add unit and/or integration tests under `tests/` that exercise the new instrumentation.
5. Update the root [`package.json`](./package.json) `build:integrations` and `test:integrations` scripts if your package requires additional build or test commands.

Once your integration package is ready, run the local workflow outlined in [Running the SDK after changes](#running-the-sdk-after-changes) and open a pull request that describes the new provider support.

## Contributing

We welcome contributions of new features, bug fixes, and documentation improvements. To contribute:

1. Review the project-wide [contribution guidelines](../../CONTRIBUTING.md) and follow the MLflow [Code of Conduct](../../CODE_OF_CONDUCT.rst).
2. Discuss larger proposals in a GitHub issue or the MLflow community channels before investing significant effort.
3. Fork the repository (or use a feature branch) and make your changes with clear, well-structured commits.
4. Ensure your code includes tests and documentation updates where appropriate.
5. Submit a pull request that summarizes the motivation, implementation details, and validation steps. The MLflow team will review and provide feedback.

## Running the SDK after Changes

The TypeScript workspace uses npm workspaces. After modifying the core SDK or any integration:

```bash
npm install        # Install or update workspace dependencies
npm run build      # Build the core package and all integrations
npm run test       # Execute the test suites for the core SDK and integrations
```

You can run package-specific scripts from their respective directories (for example, `cd core && npm run test`) when iterating on a particular feature. Remember to rebuild before consuming the SDK from another project so that the latest TypeScript output is emitted to `dist/`.

## Trace Usage

MLflow Tracing empowers you throughout the end-to-end lifecycle of your application. Here's how it helps you at each step of the workflow, click on each section to learn more:

<details>
<summary><strong>🔍 Build & Debug</strong></summary>

<table>
<tr>
<td width="60%">

#### Smooth Debugging Experience

MLflow's tracing capabilities provide deep insights into what happens beneath the abstractions of your application, helping you precisely identify where issues occur.

[Learn more →](https://mlflow.org/docs/latest/genai/tracing/observe-with-traces/ui)

</td>
<td width="40%">

![Trace Debug](https://raw.githubusercontent.com/mlflow/mlflow/master/docs/static/images/llms/tracing/genai-trace-debug.png)

</td>
</tr>
</table>

</details>

<details>
<summary><strong>💬 Human Feedback</strong></summary>

<table>
<tr>
<td width="60%">

#### Track Annotation and User Feedback Attached to Traces

Collecting and managing feedback is essential for improving your application. MLflow Tracing allows you to attach user feedback and annotations directly to traces, creating a rich dataset for analysis.

This feedback data helps you understand user satisfaction, identify areas for improvement, and build better evaluation datasets based on real user interactions.

[Learn more →](https://mlflow.org/docs/latest/genai/assessments/feedback)

</td>
<td width="40%">

![Human Feedback](https://raw.githubusercontent.com/mlflow/mlflow/master/docs/static/images/llms/tracing/genai-human-feedback.png)

</td>
</tr>
</table>

</details>

<details>
<summary><strong>📊 Evaluation</strong></summary>

<table>
<tr>
<td width="60%">

#### Systematic Quality Assessment Throughout Your Application

Evaluating the performance of your application is crucial, but creating a reliable evaluation process can be challenging. Traces serve as a rich data source, helping you assess quality with precise metrics for all components.

When combined with MLflow's evaluation capabilities, you get a seamless experience for assessing and improving your application's performance.

[Learn more →](https://mlflow.org/docs/latest/genai/eval-monitor)

</td>
<td width="40%">

![Evaluation](https://raw.githubusercontent.com/mlflow/mlflow/master/docs/static/images/llms/tracing/genai-trace-evaluation.png)

</td>
</tr>
</table>

</details>

<details>
<summary><strong>🚀 Production Monitoring</strong></summary>

<table>
<tr>
<td width="60%">

#### Monitor Applications with Your Favorite Observability Stack

Machine learning projects don't end with the first launch. Continuous monitoring and incremental improvement are critical to long-term success.

Integrated with various observability platforms such as Databricks, Datadog, Grafana, and Prometheus, MLflow Tracing provides a comprehensive solution for monitoring your applications in production.

[Learn more →](https://mlflow.org/docs/latest/genai/tracing/prod-tracing)

</td>
<td width="40%">

![Monitoring](https://raw.githubusercontent.com/mlflow/mlflow/master/docs/static/images/llms/tracing/genai-monitoring.png)

</td>
</tr>
</table>

</details>

<details>
<summary><strong>📦 Dataset Collection</strong></summary>

<table>
<tr>
<td width="60%">

#### Create High-Quality Evaluation Datasets from Production Traces

Traces from production are invaluable for building comprehensive evaluation datasets. By capturing real user interactions and their outcomes, you can create test cases that truly represent your application's usage patterns.

This comprehensive data capture enables you to create realistic test scenarios, validate model performance on actual usage patterns, and continuously improve your evaluation datasets.

[Learn more →](https://mlflow.org/docs/latest/genai/tracing/search-traces#creating-evaluation-datasets)

</td>
<td width="40%">

![Dataset Collection](https://raw.githubusercontent.com/mlflow/mlflow/master/docs/static/images/llms/tracing/genai-trace-dataset.png)

</td>
</tr>
</table>

</details>

## Documentation 📘

Official documentation for MLflow Typescript SDK can be found [here](https://mlflow.org/docs/latest/genai/tracing/quickstart).

## License

This project is licensed under the [Apache License 2.0](https://github.com/mlflow/mlflow/blob/master/LICENSE.txt).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.base.json]---
Location: mlflow-master/libs/typescript/tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowJs": true,
    "checkJs": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: mlflow-master/libs/typescript/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

--------------------------------------------------------------------------------

---[FILE: jest.config.js]---
Location: mlflow-master/libs/typescript/core/jest.config.js

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
  globalSetup: '<rootDir>/../jest.global-server-setup.ts',
  globalTeardown: '<rootDir>/../jest.global-server-teardown.ts',
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
};
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: mlflow-master/libs/typescript/core/package.json

```json
{
  "name": "mlflow-tracing",
  "version": "0.1.1",
  "description": "TypeScript implementation of MLflow Tracing SDK for LLM observability",
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
  "dependencies": {
    "@opentelemetry/api": "^1.9.0",
    "@opentelemetry/sdk-node": "^0.201.1",
    "fast-safe-stringify": "^2.1.1",
    "bignumber.js": "^9.0.0",
    "ini": "^5.0.0"
  },
  "devDependencies": {
    "@types/ini": "^4.1.1",
    "@types/jest": "^29.5.3",
    "@types/node": "^20.4.5",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "eslint": "^8.57.1",
    "jest": "^29.6.2",
    "msw": "^2.10.3",
    "prettier": "^3.5.3",
    "ts-jest": "^29.1.1",
    "tsx": "^4.7.0",
    "typescript": "^5.8.3",
    "whatwg-fetch": "^3.6.20"
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
Location: mlflow-master/libs/typescript/core/README.md

```text
# MLflow Typescript SDK - Core

This is the core package of the [MLflow Typescript SDK](https://github.com/mlflow/mlflow/tree/main/libs/typescript). It is a skinny package that includes the core tracing functionality and manual instrumentation.

| Package              | NPM                                                                                                                           | Description                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [mlflow-tracing](./) | [![npm package](https://img.shields.io/npm/v/mlflow-tracing?style=flat-square)](https://www.npmjs.com/package/mlflow-tracing) | The core tracing functionality and manual instrumentation. |

## Installation

```bash
npm install mlflow-tracing
```

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
// Wrap a function with mlflow.trace to generate a span when the function is called.
// MLflow will automatically record the function name, arguments, return value,
// latency, and exception information to the span.
const getWeather = mlflow.trace(
  (city: string) => {
    return `The weather in ${city} is sunny`;
  },
  // Pass options to set span name. See https://mlflow.org/docs/latest/genai/tracing/quickstart
  // for the full list of options.
  { name: 'get-weather' }
);
getWeather('San Francisco');

// Alternatively, start and end span manually
const span = mlflow.startSpan({ name: 'my-span' });
span.end();
```

## Documentation 📘

Official documentation for MLflow Typescript SDK can be found [here](https://mlflow.org/docs/latest/genai/tracing/quickstart).

## License

This project is licensed under the [Apache License 2.0](https://github.com/mlflow/mlflow/blob/master/LICENSE.txt).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: mlflow-master/libs/typescript/core/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowJs": true,
    "checkJs": true,
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/libs/typescript/core/src/index.ts

```typescript
import { init } from './core/config';
import {
  getLastActiveTraceId,
  getCurrentActiveSpan,
  updateCurrentTrace,
  startSpan,
  trace,
  withSpan
} from './core/api';
import { flushTraces } from './core/provider';
import { MlflowClient } from './clients';

export {
  getLastActiveTraceId,
  getCurrentActiveSpan,
  updateCurrentTrace,
  flushTraces,
  init,
  startSpan,
  trace,
  withSpan,
  MlflowClient
};

// Export entities
export * from './core/constants';
export type { LiveSpan, Span } from './core/entities/span';
export type { Trace } from './core/entities/trace';
export type { TraceInfo, TokenUsage } from './core/entities/trace_info';
export type { TraceData } from './core/entities/trace_data';
export { SpanStatusCode } from './core/entities/span_status';
export type { UpdateCurrentTraceOptions, SpanOptions, TraceOptions } from './core/api';
export { registerOnSpanStartHook, registerOnSpanEndHook } from './exporters/span_processor_hooks';
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: mlflow-master/libs/typescript/core/src/clients/client.ts

```typescript
import { TraceInfo } from '../core/entities/trace_info';
import { Trace } from '../core/entities/trace';
import { CreateExperiment, DeleteExperiment, GetTraceInfoV3, StartTraceV3 } from './spec';
import { getRequestHeaders, makeRequest } from './utils';
import { TraceData } from '../core/entities/trace_data';
import { ArtifactsClient, getArtifactsClient } from './artifacts';

/**
 * Client for MLflow tracing operations
 */
export class MlflowClient {
  /** MLflow tracking server host or Databricks workspace URL */
  private host: string;
  /** Databricks personal access token */
  private databricksToken?: string;
  /** Client implementation to upload/download trace data artifacts */
  private artifactsClient: ArtifactsClient;
  /** The tracking server username for basic auth */
  private trackingServerUsername?: string;
  /** The tracking server password for basic auth */
  private trackingServerPassword?: string;

  constructor(options: {
    trackingUri: string;
    host: string;
    databricksToken?: string;
    trackingServerUsername?: string;
    trackingServerPassword?: string;
  }) {
    this.host = options.host;
    this.databricksToken = options.databricksToken;
    this.trackingServerUsername = options.trackingServerUsername;
    this.trackingServerPassword = options.trackingServerPassword;
    this.artifactsClient = getArtifactsClient({
      trackingUri: options.trackingUri,
      host: options.host,
      databricksToken: options.databricksToken
    });
  }

  // === TRACE LOGGING METHODS ===
  /**
   * Create a new TraceInfo record in the backend store.
   * Corresponding to the Python SDK's start_trace_v3() method.
   *
   * Note: the backend API is named as "Start" due to unfortunate miscommunication.
   * The API is indeed called at the "end" of a trace, not the "start".
   */
  async createTrace(traceInfo: TraceInfo): Promise<TraceInfo> {
    const url = StartTraceV3.getEndpoint(this.host);
    const payload: StartTraceV3.Request = { trace: { trace_info: traceInfo.toJson() } };
    const response = await makeRequest<StartTraceV3.Response>(
      'POST',
      url,
      getRequestHeaders(
        this.databricksToken,
        this.trackingServerUsername,
        this.trackingServerPassword
      ),
      payload
    );
    return TraceInfo.fromJson(response.trace.trace_info);
  }

  // === TRACE RETRIEVAL METHODS ===
  /**
   * Get a single trace by ID
   * Fetches both trace info and trace data from backend
   * Corresponds to Python: client.get_trace()
   */
  async getTrace(traceId: string): Promise<Trace> {
    const traceInfo = await this.getTraceInfo(traceId);
    const traceData = await this.artifactsClient.downloadTraceData(traceInfo);
    return new Trace(traceInfo, traceData);
  }

  /**
   * Get trace info using V3 API
   * Endpoint: GET /api/3.0/mlflow/traces/{trace_id}
   */
  async getTraceInfo(traceId: string): Promise<TraceInfo> {
    const url = GetTraceInfoV3.getEndpoint(this.host, traceId);
    const response = await makeRequest<GetTraceInfoV3.Response>(
      'GET',
      url,
      getRequestHeaders(
        this.databricksToken,
        this.trackingServerUsername,
        this.trackingServerPassword
      )
    );

    // The V3 API returns a Trace object with trace_info field
    if (response.trace?.trace_info) {
      return TraceInfo.fromJson(response.trace.trace_info);
    }

    throw new Error(`Invalid response format: missing trace_info: ${JSON.stringify(response)}`);
  }

  /**
   * Upload trace data to the artifact store.
   */
  async uploadTraceData(traceInfo: TraceInfo, traceData: TraceData): Promise<void> {
    await this.artifactsClient.uploadTraceData(traceInfo, traceData);
  }

  // === EXPERIMENT METHODS  ===
  /**
   * Create a new experiment
   */
  async createExperiment(
    name: string,
    artifactLocation?: string,
    tags?: Record<string, string>
  ): Promise<string> {
    const url = CreateExperiment.getEndpoint(this.host);
    const payload: CreateExperiment.Request = { name, artifact_location: artifactLocation, tags };
    const response = await makeRequest<CreateExperiment.Response>(
      'POST',
      url,
      getRequestHeaders(
        this.databricksToken,
        this.trackingServerUsername,
        this.trackingServerPassword
      ),
      payload
    );
    return response.experiment_id;
  }

  /**
   * Delete an experiment
   */
  async deleteExperiment(experimentId: string): Promise<void> {
    const url = DeleteExperiment.getEndpoint(this.host);
    const payload: DeleteExperiment.Request = { experiment_id: experimentId };
    await makeRequest<void>(
      'POST',
      url,
      getRequestHeaders(
        this.databricksToken,
        this.trackingServerUsername,
        this.trackingServerPassword
      ),
      payload
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: mlflow-master/libs/typescript/core/src/clients/index.ts

```typescript
export { MlflowClient } from './client';
```

--------------------------------------------------------------------------------

---[FILE: spec.ts]---
Location: mlflow-master/libs/typescript/core/src/clients/spec.ts

```typescript
/**
 * MLflow API Request/Response Specifications
 *
 * This module defines the types and interfaces for MLflow API communication,
 * including request payloads and response structures for all trace-related endpoints.
 */

import type { TraceInfo } from '../core/entities/trace_info';
import { ArtifactCredentialType } from './artifacts/databricks';

/**
 * Create a new TraceInfo entity in the backend.
 */
export namespace StartTraceV3 {
  export const getEndpoint = (host: string) => `${host}/api/3.0/mlflow/traces`;

  export interface Request {
    trace: {
      trace_info: Parameters<typeof TraceInfo.fromJson>[0];
    };
  }

  export interface Response {
    trace: {
      trace_info: Parameters<typeof TraceInfo.fromJson>[0];
    };
  }
}

/**
 * Get the TraceInfo entity for a given trace ID.
 */
export namespace GetTraceInfoV3 {
  export const getEndpoint = (host: string, traceId: string) =>
    `${host}/api/3.0/mlflow/traces/${traceId}`;

  export interface Response {
    trace: {
      trace_info: Parameters<typeof TraceInfo.fromJson>[0];
    };
  }
}

/** Create Experiment (used for testing) */
export namespace CreateExperiment {
  export const getEndpoint = (host: string) => `${host}/api/2.0/mlflow/experiments/create`;

  export interface Request {
    name?: string;
    artifact_location?: string;
    tags?: Record<string, string>;
  }

  export interface Response {
    experiment_id: string;
  }
}

/** Delete Experiment (used for testing) */
export namespace DeleteExperiment {
  export const getEndpoint = (host: string) => `${host}/api/2.0/mlflow/experiments/delete`;

  export interface Request {
    experiment_id: string;
  }
}

/**
 * Get credentials for uploading trace data to the artifact store. Only used for Databricks.
 */
export namespace GetCredentialsForTraceDataUpload {
  export const getEndpoint = (host: string, traceId: string) =>
    `${host}/api/2.0/mlflow/traces/${traceId}/credentials-for-data-upload`;

  export interface Response {
    credential_info: {
      type: ArtifactCredentialType;
      signed_uri: string;
    };
  }
}

/**
 * Get credentials for downloading trace data from the artifact store. Only used for Databricks.
 */
export namespace GetCredentialsForTraceDataDownload {
  export const getEndpoint = (host: string, traceId: string) =>
    `${host}/api/2.0/mlflow/traces/${traceId}/credentials-for-data-download`;

  export interface Response {
    credential_info: {
      type: ArtifactCredentialType;
      signed_uri: string;
    };
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: mlflow-master/libs/typescript/core/src/clients/utils.ts

```typescript
import { JSONBig } from '../core/utils/json';

/**
 * Get the request headers for the given token or basic auth credentials.
 * Token will be used if provided, otherwise basic auth credentials will be used.
 *
 * @param token - The token to use to authenticate the request.
 * @param username - The username to use to authenticate the request with basic auth.
 * @param password - The password to use to authenticate the request with basic auth.
 * @returns The request headers.
 */
export function getRequestHeaders(
  token?: string,
  username?: string,
  password?: string
): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (username && password) {
    headers['Authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  }

  return headers;
}

/**
 * Make a request to the given URL with the given method, headers, body, and timeout.
 *
 * TODO: add retry logic for transient errors
 */
export async function makeRequest<T>(
  method: string,
  url: string,
  headers: Record<string, string>,
  body?: any,
  timeout?: number
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout ?? getDefaultTimeout());

  try {
    const response = await fetch(url, {
      method,
      headers: headers,
      body: body ? JSONBig.stringify(body) : undefined,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle empty responses (like DELETE operations)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    const responseText = await response.text();
    return JSONBig.parse(responseText) as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw new Error(`API request failed: ${error.message}`);
    }
    throw new Error(`API request failed: ${String(error)}`);
  }
}

function getDefaultTimeout(): number {
  const envTimeout = process.env.MLFLOW_HTTP_REQUEST_TIMEOUT;
  if (envTimeout) {
    const timeout = parseInt(envTimeout, 10);
    if (!isNaN(timeout) && timeout > 0) {
      return timeout;
    }
  }
  return 30000; // Default 30 seconds
}
```

--------------------------------------------------------------------------------

---[FILE: base.ts]---
Location: mlflow-master/libs/typescript/core/src/clients/artifacts/base.ts

```typescript
import { TraceData } from '../../core/entities/trace_data';
import { TraceInfo } from '../../core/entities/trace_info';

export interface ArtifactsClient {
  uploadTraceData(traceInfo: TraceInfo, traceData: TraceData): Promise<void>;
  downloadTraceData(traceInfo: TraceInfo): Promise<TraceData>;
}
```

--------------------------------------------------------------------------------

````
