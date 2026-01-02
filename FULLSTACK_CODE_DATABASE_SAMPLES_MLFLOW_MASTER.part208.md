---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 208
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 208 of 991)

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

---[FILE: README.md]---
Location: mlflow-master/libs/tracing/README.md

```text
# MLflow Tracing: An Open-Source SDK for Observability and Monitoring GenAI Applications🔍

[![Latest Docs](https://img.shields.io/badge/docs-latest-success.svg?style=for-the-badge)](https://mlflow.org/docs/latest/index.html)
[![Apache 2 License](https://img.shields.io/badge/license-Apache%202-brightgreen.svg?style=for-the-badge&logo=apache)](https://github.com/mlflow/mlflow/blob/master/LICENSE.txt)
[![Slack](https://img.shields.io/badge/slack-@mlflow--users-CF0E5B.svg?logo=slack&logoColor=white&labelColor=3F0E40&style=for-the-badge)](https://mlflow.org/community/#slack)
[![Twitter](https://img.shields.io/twitter/follow/MLflow?style=for-the-badge&labelColor=00ACEE&logo=twitter&logoColor=white)](https://twitter.com/MLflow)

MLflow Tracing (`mlflow-tracing`) is an open-source, lightweight Python package that only includes the minimum set of dependencies and functionality
to instrument your code/models/agents with [MLflow Tracing Feature](https://mlflow.org/docs/latest/tracing). It is designed to be a perfect fit for production environments where you want:

- **⚡️ Faster Deployment**: The package size and dependencies are significantly smaller than the full MLflow package, allowing for faster deployment times in dynamic environments such as Docker containers, serverless functions, and cloud-based applications.
- **🔧 Simplified Dependency Management**: A smaller set of dependencies means less work keeping up with dependency updates, security patches, and breaking changes from upstream libraries.
- **📦 Portability**: With the less number of dependencies, MLflow Tracing can be easily deployed across different environments and platforms, without worrying about compatibility issues.
- **🔒 Fewer Security Risks**: Each dependency potentially introduces security vulnerabilities. By reducing the number of dependencies, MLflow Tracing minimizes the attack surface and reduces the risk of security breaches.

## ✨ Features

- [Automatic Tracing](https://mlflow.org/docs/latest/tracing/integrations/) for AI libraries (OpenAI, LangChain, DSPy, Anthropic, etc...). Follow the link for the full list of supported libraries.
- [Manual instrumentation APIs](https://mlflow.org/docs/latest/tracing/api/manual-instrumentation) such as `@trace` decorator.
- [Production Monitoring](https://mlflow.org/docs/latest/tracing/production)
- Other tracing APIs such as `mlflow.set_trace_tag`, `mlflow.search_traces`, etc.

## 🌐 Choose Backend

The MLflow Trace package is designed to work with a remote hosted MLflow server as a backend. This allows you to log your traces to a central location, making it easier to manage and analyze your traces. There are several different options for hosting your MLflow server, including:

- [Databricks](https://docs.databricks.com/machine-learning/mlflow/managed-mlflow.html) - Databricks offers a FREE, fully managed MLflow server as a part of their platform. This is the easiest way to get started with MLflow tracing, without having to set up any infrastructure.
- [Amazon SageMaker](https://aws.amazon.com/sagemaker-ai/experiments/) - MLflow on Amazon SageMaker is a fully managed service offered as part of the SageMaker platform by AWS, including tracing and other MLflow features such as model registry.
- [Nebius](https://nebius.com/) - Nebius, a cutting-edge cloud platform for GenAI explorers, offers a fully managed MLflow server.
- [Self-hosting](https://mlflow.org/docs/latest/tracking) - MLflow is a fully open-source project, allowing you to self-host your own MLflow server and keep your data private. This is a great option if you want to have full control over your data and infrastructure.

## 🚀 Getting Started

### Installation

To install the MLflow Python package, run the following command:

```bash
pip install mlflow-tracing
```

To install from the source code, run the following command:

```bash
pip install git+https://github.com/mlflow/mlflow.git#subdirectory=libs/tracing
```

> **NOTE:** It is **not** recommended to co-install this package with the full MLflow package together, as it may cause version mismatches issues.

### Connect to the MLflow Server

To connect to your MLflow server to log your traces, set the `MLFLOW_TRACKING_URI` environment variable or use the `mlflow.set_tracking_uri` function:

```python
import mlflow

mlflow.set_tracking_uri("databricks")
# Specify the experiment to log the traces to
mlflow.set_experiment("/Path/To/Experiment")
```

### Start Logging Traces

```python
import openai

client = openai.OpenAI(api_key="<your-api-key>")

# Enable auto-tracing for OpenAI
mlflow.openai.autolog()

# Call the OpenAI API as usual
response = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[{"role": "user", "content": "Hello, how are you?"}],
)
```

## 📘 Documentation

Official documentation for MLflow Tracing can be found at [here](https://mlflow.org/docs/latest/tracing).

## 🛑 Features _Not_ Included

The following MLflow features are not included in this package.

- MLflow tracking server and UI.
- MLflow's other tracking capabilities such as Runs, Model Registry, Projects, etc.
- Evaluate models/agents and log evaluation results.

To leverage the full feature set of MLflow, install the full package by running `pip install mlflow`.
```

--------------------------------------------------------------------------------

---[FILE: .eslintrc.json]---
Location: mlflow-master/libs/typescript/.eslintrc.json

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "ignorePatterns": ["dist/", "build/", "node_modules/", "*.d.ts", "jest.config.js"],
  "rules": {
    // TypeScript-specific rules
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-loss-of-precision": "error",
    // We cannot type everything like user inputs, outputs, json, etc.
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    // Namespaces are useful for organizing API specifications
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/ban-types": "off",

    // General JavaScript/TypeScript rules
    "no-console": ["warn", { "allow": ["debug", "warn", "error"] }],
    "no-debugger": "error",
    "no-alert": "error",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": ["error", "always", { "null": "never" }],
    "curly": ["error", "all"],
    "no-trailing-spaces": "error",
    "no-multiple-empty-lines": ["error", { "max": 2 }],
    "comma-dangle": ["error", "never"],

    // Import/Export rules
    "no-duplicate-imports": "error",

    // Promise/Async rules
    "no-async-promise-executor": "error",
    "require-await": "error"
  },
  "overrides": [
    {
      "files": ["*.test.ts", "*.spec.ts", "examples/**/*.ts", "jest.*.ts"],
      "rules": {
        "no-console": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-non-null-assertion": "off"
      }
    },
    {
      "files": ["scripts/**/*.ts"],
      "rules": {
        "no-console": "off"
      }
    },
    {
      "files": ["integrations/vercel/tests/*.test.ts"],
      "rules": {
        // AI SDK does not expose the type of createOpenAI return value
        "@typescript-eslint/no-unsafe-call": "off"
      }
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: mlflow-master/libs/typescript/.prettierignore

```text
**/dist/
**/build/
```

--------------------------------------------------------------------------------

---[FILE: .prettierrc]---
Location: mlflow-master/libs/typescript/.prettierrc

```text
{
  "semi": true,
  "trailingComma": "none",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

--------------------------------------------------------------------------------

---[FILE: jest.global-server-setup.ts]---
Location: mlflow-master/libs/typescript/jest.global-server-setup.ts

```typescript
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { mkdtempSync } from 'fs';
import { join } from 'path';
import { TEST_PORT, TEST_TRACKING_URI } from './core/tests/helper';

/**
 * Start MLflow Python server. This is necessary for testing Typescript SDK because
 * the SDK does not have a server implementation and talks to the Python server instead.
 */
module.exports = async () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'mlflow-test-'));

  const mlflowRoot = join(__dirname, '../..'); // Use the local dev version

  // Only start a server if one is not already running
  try {
    const response = await fetch(TEST_TRACKING_URI);
    if (response.ok) {
      return;
    }
  } catch (error) {
    // Ignore error
  }

  // eslint-disable-next-line no-console
  console.log(`Starting MLflow server on port ${TEST_PORT}. This may take a few seconds...
      To speed up the test, you can manually start the server and keep it running during local development.`);

  const mlflowProcess = spawn(
    'uv',
    ['run', '--directory', mlflowRoot, 'mlflow', 'server', '--port', TEST_PORT.toString()],
    {
      cwd: tempDir,
      stdio: 'inherit',
      // Create a new process group so we can kill the entire group
      detached: true
    }
  );

  try {
    await waitForServer(TEST_PORT);
    // eslint-disable-next-line no-console
    console.log(`MLflow server is ready on port ${TEST_PORT}`);
  } catch (error) {
    console.error('Failed to start MLflow server:', error);
    throw error;
  }

  // Set global variables for cleanup in jest.global-teardown.ts
  const globals = globalThis as any;
  globals.mlflowProcess = mlflowProcess;
  globals.tempDir = tempDir;
};

async function waitForServer(maxAttempts: number = 30): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(TEST_TRACKING_URI);
      if (response.ok) {
        return;
      }
    } catch (error) {
      // Ignore error
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error('Failed to start MLflow server');
}
```

--------------------------------------------------------------------------------

---[FILE: jest.global-server-teardown.ts]---
Location: mlflow-master/libs/typescript/jest.global-server-teardown.ts

```typescript
import { rmSync } from 'fs';
import { ChildProcess } from 'child_process';

module.exports = async () => {
  const globals = globalThis as any;
  const mlflowProcess = globals.mlflowProcess as ChildProcess;
  const tempDir = globals.tempDir as string;

  if (mlflowProcess) {
    // Kill the process group to ensure worker processes spawned by uvicorn are terminated
    process.kill(-mlflowProcess.pid!, 'SIGTERM');

    // Wait for 1 second to ensure the process is terminated
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  if (tempDir) {
    rmSync(tempDir, { recursive: true, force: true });
  }
};
```

--------------------------------------------------------------------------------

````
