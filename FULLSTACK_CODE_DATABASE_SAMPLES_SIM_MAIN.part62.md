---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 62
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 62 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: typescript.mdx]---
Location: sim-main/apps/docs/content/docs/en/sdks/typescript.mdx

```text
---
title: TypeScript
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

The official TypeScript/JavaScript SDK for Sim provides full type safety and supports both Node.js and browser environments, allowing you to execute workflows programmatically from your Node.js applications, web applications, and other JavaScript environments.

<Callout type="info">
  The TypeScript SDK provides full type safety, async execution support, automatic rate limiting with exponential backoff, and usage tracking.
</Callout>

## Installation

Install the SDK using your preferred package manager:

<Tabs items={['npm', 'yarn', 'bun']}>
  <Tab value="npm">
    ```bash
    npm install simstudio-ts-sdk
    ```
  </Tab>
  <Tab value="yarn">
    ```bash
    yarn add simstudio-ts-sdk
    ```
  </Tab>
  <Tab value="bun">
    ```bash
    bun add simstudio-ts-sdk
    ```
  </Tab>
</Tabs>

## Quick Start

Here's a simple example to get you started:

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

// Initialize the client
const client = new SimStudioClient({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://sim.ai' // optional, defaults to https://sim.ai
});

// Execute a workflow
try {
  const result = await client.executeWorkflow('workflow-id');
  console.log('Workflow executed successfully:', result);
} catch (error) {
  console.error('Workflow execution failed:', error);
}
```

## API Reference

### SimStudioClient

#### Constructor

```typescript
new SimStudioClient(config: SimStudioConfig)
```

**Configuration:**
- `config.apiKey` (string): Your Sim API key
- `config.baseUrl` (string, optional): Base URL for the Sim API (defaults to `https://sim.ai`)

#### Methods

##### executeWorkflow()

Execute a workflow with optional input data.

```typescript
const result = await client.executeWorkflow('workflow-id', {
  input: { message: 'Hello, world!' },
  timeout: 30000 // 30 seconds
});
```

**Parameters:**
- `workflowId` (string): The ID of the workflow to execute
- `options` (ExecutionOptions, optional):
  - `input` (any): Input data to pass to the workflow
  - `timeout` (number): Timeout in milliseconds (default: 30000)
  - `stream` (boolean): Enable streaming responses (default: false)
  - `selectedOutputs` (string[]): Block outputs to stream in `blockName.attribute` format (e.g., `["agent1.content"]`)
  - `async` (boolean): Execute asynchronously (default: false)

**Returns:** `Promise<WorkflowExecutionResult | AsyncExecutionResult>`

When `async: true`, returns immediately with a task ID for polling. Otherwise, waits for completion.

##### getWorkflowStatus()

Get the status of a workflow (deployment status, etc.).

```typescript
const status = await client.getWorkflowStatus('workflow-id');
console.log('Is deployed:', status.isDeployed);
```

**Parameters:**
- `workflowId` (string): The ID of the workflow

**Returns:** `Promise<WorkflowStatus>`

##### validateWorkflow()

Validate that a workflow is ready for execution.

```typescript
const isReady = await client.validateWorkflow('workflow-id');
if (isReady) {
  // Workflow is deployed and ready
}
```

**Parameters:**
- `workflowId` (string): The ID of the workflow

**Returns:** `Promise<boolean>`

##### getJobStatus()

Get the status of an async job execution.

```typescript
const status = await client.getJobStatus('task-id-from-async-execution');
console.log('Status:', status.status); // 'queued', 'processing', 'completed', 'failed'
if (status.status === 'completed') {
  console.log('Output:', status.output);
}
```

**Parameters:**
- `taskId` (string): The task ID returned from async execution

**Returns:** `Promise<JobStatus>`

**Response fields:**
- `success` (boolean): Whether the request was successful
- `taskId` (string): The task ID
- `status` (string): One of `'queued'`, `'processing'`, `'completed'`, `'failed'`, `'cancelled'`
- `metadata` (object): Contains `startedAt`, `completedAt`, and `duration`
- `output` (any, optional): The workflow output (when completed)
- `error` (any, optional): Error details (when failed)
- `estimatedDuration` (number, optional): Estimated duration in milliseconds (when processing/queued)

##### executeWithRetry()

Execute a workflow with automatic retry on rate limit errors using exponential backoff.

```typescript
const result = await client.executeWithRetry('workflow-id', {
  input: { message: 'Hello' },
  timeout: 30000
}, {
  maxRetries: 3,           // Maximum number of retries
  initialDelay: 1000,      // Initial delay in ms (1 second)
  maxDelay: 30000,         // Maximum delay in ms (30 seconds)
  backoffMultiplier: 2     // Exponential backoff multiplier
});
```

**Parameters:**
- `workflowId` (string): The ID of the workflow to execute
- `options` (ExecutionOptions, optional): Same as `executeWorkflow()`
- `retryOptions` (RetryOptions, optional):
  - `maxRetries` (number): Maximum number of retries (default: 3)
  - `initialDelay` (number): Initial delay in ms (default: 1000)
  - `maxDelay` (number): Maximum delay in ms (default: 30000)
  - `backoffMultiplier` (number): Backoff multiplier (default: 2)

**Returns:** `Promise<WorkflowExecutionResult | AsyncExecutionResult>`

The retry logic uses exponential backoff (1s → 2s → 4s → 8s...) with ±25% jitter to prevent thundering herd. If the API provides a `retry-after` header, it will be used instead.

##### getRateLimitInfo()

Get the current rate limit information from the last API response.

```typescript
const rateLimitInfo = client.getRateLimitInfo();
if (rateLimitInfo) {
  console.log('Limit:', rateLimitInfo.limit);
  console.log('Remaining:', rateLimitInfo.remaining);
  console.log('Reset:', new Date(rateLimitInfo.reset * 1000));
}
```

**Returns:** `RateLimitInfo | null`

##### getUsageLimits()

Get current usage limits and quota information for your account.

```typescript
const limits = await client.getUsageLimits();
console.log('Sync requests remaining:', limits.rateLimit.sync.remaining);
console.log('Async requests remaining:', limits.rateLimit.async.remaining);
console.log('Current period cost:', limits.usage.currentPeriodCost);
console.log('Plan:', limits.usage.plan);
```

**Returns:** `Promise<UsageLimits>`

**Response structure:**
```typescript
{
  success: boolean
  rateLimit: {
    sync: {
      isLimited: boolean
      limit: number
      remaining: number
      resetAt: string
    }
    async: {
      isLimited: boolean
      limit: number
      remaining: number
      resetAt: string
    }
    authType: string  // 'api' or 'manual'
  }
  usage: {
    currentPeriodCost: number
    limit: number
    plan: string  // e.g., 'free', 'pro'
  }
}
```

##### setApiKey()

Update the API key.

```typescript
client.setApiKey('new-api-key');
```

##### setBaseUrl()

Update the base URL.

```typescript
client.setBaseUrl('https://my-custom-domain.com');
```

## Types

### WorkflowExecutionResult

```typescript
interface WorkflowExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  logs?: any[];
  metadata?: {
    duration?: number;
    executionId?: string;
    [key: string]: any;
  };
  traceSpans?: any[];
  totalDuration?: number;
}
```

### AsyncExecutionResult

```typescript
interface AsyncExecutionResult {
  success: boolean;
  taskId: string;
  status: 'queued';
  createdAt: string;
  links: {
    status: string;  // e.g., "/api/jobs/{taskId}"
  };
}
```

### WorkflowStatus

```typescript
interface WorkflowStatus {
  isDeployed: boolean;
  deployedAt?: string;
  needsRedeployment: boolean;
}
```

### RateLimitInfo

```typescript
interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}
```

### UsageLimits

```typescript
interface UsageLimits {
  success: boolean;
  rateLimit: {
    sync: {
      isLimited: boolean;
      limit: number;
      remaining: number;
      resetAt: string;
    };
    async: {
      isLimited: boolean;
      limit: number;
      remaining: number;
      resetAt: string;
    };
    authType: string;
  };
  usage: {
    currentPeriodCost: number;
    limit: number;
    plan: string;
  };
}
```

### SimStudioError

```typescript
class SimStudioError extends Error {
  code?: string;
  status?: number;
}
```

**Common error codes:**
- `UNAUTHORIZED`: Invalid API key
- `TIMEOUT`: Request timed out
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `USAGE_LIMIT_EXCEEDED`: Usage limit exceeded
- `EXECUTION_ERROR`: Workflow execution failed

## Examples

### Basic Workflow Execution

<Steps>
  <Step title="Initialize the client">
    Set up the SimStudioClient with your API key.
  </Step>
  <Step title="Validate the workflow">
    Check if the workflow is deployed and ready for execution.
  </Step>
  <Step title="Execute the workflow">
    Run the workflow with your input data.
  </Step>
  <Step title="Handle the result">
    Process the execution result and handle any errors.
  </Step>
</Steps>

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function runWorkflow() {
  try {
    // Check if workflow is ready
    const isReady = await client.validateWorkflow('my-workflow-id');
    if (!isReady) {
      throw new Error('Workflow is not deployed or ready');
    }

    // Execute the workflow
    const result = await client.executeWorkflow('my-workflow-id', {
      input: {
        message: 'Process this data',
        userId: '12345'
      }
    });

    if (result.success) {
      console.log('Output:', result.output);
      console.log('Duration:', result.metadata?.duration);
    } else {
      console.error('Workflow failed:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

runWorkflow();
```

### Error Handling

Handle different types of errors that may occur during workflow execution:

```typescript
import { SimStudioClient, SimStudioError } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function executeWithErrorHandling() {
  try {
    const result = await client.executeWorkflow('workflow-id');
    return result;
  } catch (error) {
    if (error instanceof SimStudioError) {
      switch (error.code) {
        case 'UNAUTHORIZED':
          console.error('Invalid API key');
          break;
        case 'TIMEOUT':
          console.error('Workflow execution timed out');
          break;
        case 'USAGE_LIMIT_EXCEEDED':
          console.error('Usage limit exceeded');
          break;
        case 'INVALID_JSON':
          console.error('Invalid JSON in request body');
          break;
        default:
          console.error('Workflow error:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
```

### Environment Configuration

Configure the client using environment variables:

<Tabs items={['Development', 'Production']}>
  <Tab value="Development">
    ```typescript
    import { SimStudioClient } from 'simstudio-ts-sdk';

    // Development configuration
    const apiKey = process.env.SIM_API_KEY;
    if (!apiKey) {
      throw new Error('SIM_API_KEY environment variable is required');
    }

    const client = new SimStudioClient({
      apiKey,
      baseUrl: process.env.SIM_BASE_URL // optional
    });
    ```
  </Tab>
  <Tab value="Production">
    ```typescript
    import { SimStudioClient } from 'simstudio-ts-sdk';

    // Production configuration with validation
    const apiKey = process.env.SIM_API_KEY;
    if (!apiKey) {
      throw new Error('SIM_API_KEY environment variable is required');
    }

    const client = new SimStudioClient({
      apiKey,
      baseUrl: process.env.SIM_BASE_URL || 'https://sim.ai'
    });
    ```
  </Tab>
</Tabs>

### Node.js Express Integration

Integrate with an Express.js server:

```typescript
import express from 'express';
import { SimStudioClient } from 'simstudio-ts-sdk';

const app = express();
const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

app.use(express.json());

app.post('/execute-workflow', async (req, res) => {
  try {
    const { workflowId, input } = req.body;
    
    const result = await client.executeWorkflow(workflowId, {
      input,
      timeout: 60000
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Workflow execution error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Next.js API Route

Use with Next.js API routes:

```typescript
// pages/api/workflow.ts or app/api/workflow/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workflowId, input } = req.body;

    const result = await client.executeWorkflow(workflowId, {
      input,
      timeout: 30000
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error executing workflow:', error);
    res.status(500).json({
      error: 'Failed to execute workflow'
    });
  }
}
```

### Browser Usage

Use in the browser (with proper CORS configuration):

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

// Note: In production, use a proxy server to avoid exposing API keys
const client = new SimStudioClient({
  apiKey: 'your-public-api-key', // Use with caution in browser
  baseUrl: 'https://sim.ai'
});

async function executeClientSideWorkflow() {
  try {
    const result = await client.executeWorkflow('workflow-id', {
      input: {
        userInput: 'Hello from browser'
      }
    });

    console.log('Workflow result:', result);

    // Update UI with result
    document.getElementById('result')!.textContent =
      JSON.stringify(result.output, null, 2);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### File Upload

File objects are automatically detected and converted to base64 format. Include them in your input under the field name matching your workflow's API trigger input format.

The SDK converts File objects to this format:
```typescript
{
  type: 'file',
  data: 'data:mime/type;base64,base64data',
  name: 'filename',
  mime: 'mime/type'
}
```

Alternatively, you can manually provide files using the URL format:
```typescript
{
  type: 'url',
  data: 'https://example.com/file.pdf',
  name: 'file.pdf',
  mime: 'application/pdf'
}
```

<Tabs items={['Browser', 'Node.js']}>
  <Tab value="Browser">
    ```typescript
    import { SimStudioClient } from 'simstudio-ts-sdk';

    const client = new SimStudioClient({
      apiKey: process.env.NEXT_PUBLIC_SIM_API_KEY!
    });

    // From file input
    async function handleFileUpload(event: Event) {
      const input = event.target as HTMLInputElement;
      const files = Array.from(input.files || []);

      // Include files under the field name from your API trigger's input format
      const result = await client.executeWorkflow('workflow-id', {
        input: {
          documents: files,  // Must match your workflow's "files" field name
          instructions: 'Analyze these documents'
        }
      });

      console.log('Result:', result);
    }
    ```
  </Tab>
  <Tab value="Node.js">
    ```typescript
    import { SimStudioClient } from 'simstudio-ts-sdk';
    import fs from 'fs';

    const client = new SimStudioClient({
      apiKey: process.env.SIM_API_KEY!
    });

    // Read file and create File object
    const fileBuffer = fs.readFileSync('./document.pdf');
    const file = new File([fileBuffer], 'document.pdf', {
      type: 'application/pdf'
    });

    // Include files under the field name from your API trigger's input format
    const result = await client.executeWorkflow('workflow-id', {
      input: {
        documents: [file],  // Must match your workflow's "files" field name
        query: 'Summarize this document'
      }
    });
    ```
  </Tab>
</Tabs>

<Callout type="warning">
  When using the SDK in the browser, be careful not to expose sensitive API keys. Consider using a backend proxy or public API keys with limited permissions.
</Callout>

### React Hook Example

Create a custom React hook for workflow execution:

```typescript
import { useState, useCallback } from 'react';
import { SimStudioClient, WorkflowExecutionResult } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

interface UseWorkflowResult {
  result: WorkflowExecutionResult | null;
  loading: boolean;
  error: Error | null;
  executeWorkflow: (workflowId: string, input?: any) => Promise<void>;
}

export function useWorkflow(): UseWorkflowResult {
  const [result, setResult] = useState<WorkflowExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeWorkflow = useCallback(async (workflowId: string, input?: any) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const workflowResult = await client.executeWorkflow(workflowId, {
        input,
        timeout: 30000
      });
      setResult(workflowResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    result,
    loading,
    error,
    executeWorkflow
  };
}

// Usage in component
function WorkflowComponent() {
  const { result, loading, error, executeWorkflow } = useWorkflow();

  const handleExecute = () => {
    executeWorkflow('my-workflow-id', {
      message: 'Hello from React!'
    });
  };

  return (
    <div>
      <button onClick={handleExecute} disabled={loading}>
        {loading ? 'Executing...' : 'Execute Workflow'}
      </button>

      {error && <div>Error: {error.message}</div>}
      {result && (
        <div>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### Async Workflow Execution

Execute workflows asynchronously for long-running tasks:

```typescript
import { SimStudioClient, AsyncExecutionResult } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function executeAsync() {
  try {
    // Start async execution
    const result = await client.executeWorkflow('workflow-id', {
      input: { data: 'large dataset' },
      async: true  // Execute asynchronously
    });

    // Check if result is an async execution
    if ('taskId' in result) {
      console.log('Task ID:', result.taskId);
      console.log('Status endpoint:', result.links.status);

      // Poll for completion
      let status = await client.getJobStatus(result.taskId);

      while (status.status === 'queued' || status.status === 'processing') {
        console.log('Current status:', status.status);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        status = await client.getJobStatus(result.taskId);
      }

      if (status.status === 'completed') {
        console.log('Workflow completed!');
        console.log('Output:', status.output);
        console.log('Duration:', status.metadata.duration);
      } else {
        console.error('Workflow failed:', status.error);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

executeAsync();
```

### Rate Limiting and Retry

Handle rate limits automatically with exponential backoff:

```typescript
import { SimStudioClient, SimStudioError } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function executeWithRetryHandling() {
  try {
    // Automatically retries on rate limit
    const result = await client.executeWithRetry('workflow-id', {
      input: { message: 'Process this' }
    }, {
      maxRetries: 5,
      initialDelay: 1000,
      maxDelay: 60000,
      backoffMultiplier: 2
    });

    console.log('Success:', result);
  } catch (error) {
    if (error instanceof SimStudioError && error.code === 'RATE_LIMIT_EXCEEDED') {
      console.error('Rate limit exceeded after all retries');

      // Check rate limit info
      const rateLimitInfo = client.getRateLimitInfo();
      if (rateLimitInfo) {
        console.log('Rate limit resets at:', new Date(rateLimitInfo.reset * 1000));
      }
    }
  }
}
```

### Usage Monitoring

Monitor your account usage and limits:

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function checkUsage() {
  try {
    const limits = await client.getUsageLimits();

    console.log('=== Rate Limits ===');
    console.log('Sync requests:');
    console.log('  Limit:', limits.rateLimit.sync.limit);
    console.log('  Remaining:', limits.rateLimit.sync.remaining);
    console.log('  Resets at:', limits.rateLimit.sync.resetAt);
    console.log('  Is limited:', limits.rateLimit.sync.isLimited);

    console.log('\nAsync requests:');
    console.log('  Limit:', limits.rateLimit.async.limit);
    console.log('  Remaining:', limits.rateLimit.async.remaining);
    console.log('  Resets at:', limits.rateLimit.async.resetAt);
    console.log('  Is limited:', limits.rateLimit.async.isLimited);

    console.log('\n=== Usage ===');
    console.log('Current period cost: $' + limits.usage.currentPeriodCost.toFixed(2));
    console.log('Limit: $' + limits.usage.limit.toFixed(2));
    console.log('Plan:', limits.usage.plan);

    const percentUsed = (limits.usage.currentPeriodCost / limits.usage.limit) * 100;
    console.log('Usage: ' + percentUsed.toFixed(1) + '%');

    if (percentUsed > 80) {
      console.warn('⚠️  Warning: You are approaching your usage limit!');
    }
  } catch (error) {
    console.error('Error checking usage:', error);
  }
}

checkUsage();
```

### Streaming Workflow Execution

Execute workflows with real-time streaming responses:

```typescript
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({
  apiKey: process.env.SIM_API_KEY!
});

async function executeWithStreaming() {
  try {
    // Enable streaming for specific block outputs
    const result = await client.executeWorkflow('workflow-id', {
      input: { message: 'Count to five' },
      stream: true,
      selectedOutputs: ['agent1.content'] // Use blockName.attribute format
    });

    console.log('Workflow result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

The streaming response follows the Server-Sent Events (SSE) format:

```
data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":"One"}

data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":", two"}

data: {"event":"done","success":true,"output":{},"metadata":{"duration":610}}

data: [DONE]
```

**React Streaming Example:**

```typescript
import { useState, useEffect } from 'react';

function StreamingWorkflow() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const executeStreaming = async () => {
    setLoading(true);
    setOutput('');

    // IMPORTANT: Make this API call from your backend server, not the browser
    // Never expose your API key in client-side code
    const response = await fetch('https://sim.ai/api/workflows/WORKFLOW_ID/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.SIM_API_KEY! // Server-side environment variable only
      },
      body: JSON.stringify({
        message: 'Generate a story',
        stream: true,
        selectedOutputs: ['agent1.content']
      })
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            setLoading(false);
            break;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.chunk) {
              setOutput(prev => prev + parsed.chunk);
            } else if (parsed.event === 'done') {
              console.log('Execution complete:', parsed.metadata);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  };

  return (
    <div>
      <button onClick={executeStreaming} disabled={loading}>
        {loading ? 'Generating...' : 'Start Streaming'}
      </button>
      <div style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
    </div>
  );
}
```

## Getting Your API Key

<Steps>
  <Step title="Log in to Sim">
    Navigate to [Sim](https://sim.ai) and log in to your account.
  </Step>
  <Step title="Open your workflow">
    Navigate to the workflow you want to execute programmatically.
  </Step>
  <Step title="Deploy your workflow">
    Click on "Deploy" to deploy your workflow if it hasn't been deployed yet.
  </Step>
  <Step title="Create or select an API key">
    During the deployment process, select or create an API key.
  </Step>
  <Step title="Copy the API key">
    Copy the API key to use in your TypeScript/JavaScript application.
  </Step>
</Steps>

## Requirements

- Node.js 16+
- TypeScript 5.0+ (for TypeScript projects)

## License

Apache-2.0
```

--------------------------------------------------------------------------------

---[FILE: docker.mdx]---
Location: sim-main/apps/docs/content/docs/en/self-hosting/docker.mdx

```text
---
title: Docker
description: Deploy Sim Studio with Docker Compose
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## Quick Start

```bash
# Clone and start
git clone https://github.com/simstudioai/sim.git && cd sim
docker compose -f docker-compose.prod.yml up -d
```

Open [http://localhost:3000](http://localhost:3000)

## Production Setup

### 1. Configure Environment

```bash
# Generate secrets
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@db:5432/simstudio
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
INTERNAL_API_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_APP_URL=https://sim.yourdomain.com
BETTER_AUTH_URL=https://sim.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://sim.yourdomain.com
EOF
```

### 2. Start Services

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 3. Set Up SSL

<Tabs items={['Caddy (Recommended)', 'Nginx + Certbot']}>
  <Tab value="Caddy (Recommended)">
Caddy automatically handles SSL certificates.

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

Create `/etc/caddy/Caddyfile`:
```
sim.yourdomain.com {
    reverse_proxy localhost:3000

    handle /socket.io/* {
        reverse_proxy localhost:3002
    }
}
```

```bash
sudo systemctl restart caddy
```
  </Tab>
  <Tab value="Nginx + Certbot">
```bash
# Install
sudo apt install nginx certbot python3-certbot-nginx -y

# Create /etc/nginx/sites-available/sim
server {
    listen 80;
    server_name sim.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Enable and get certificate
sudo ln -s /etc/nginx/sites-available/sim /etc/nginx/sites-enabled/
sudo certbot --nginx -d sim.yourdomain.com
```
  </Tab>
</Tabs>

## Ollama

```bash
# With GPU
docker compose -f docker-compose.ollama.yml --profile gpu --profile setup up -d

# CPU only
docker compose -f docker-compose.ollama.yml --profile cpu --profile setup up -d
```

Pull additional models:
```bash
docker compose -f docker-compose.ollama.yml exec ollama ollama pull llama3.2
```

### External Ollama

If Ollama runs on your host machine (not in Docker):

```bash
# macOS/Windows
OLLAMA_URL=http://host.docker.internal:11434 docker compose -f docker-compose.prod.yml up -d

# Linux - use your host IP
OLLAMA_URL=http://192.168.1.100:11434 docker compose -f docker-compose.prod.yml up -d
```

<Callout type="warning">
  Inside Docker, `localhost` refers to the container, not your host. Use `host.docker.internal` or your host's IP.
</Callout>

## Commands

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f simstudio

# Stop
docker compose -f docker-compose.prod.yml down

# Update
docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d

# Backup database
docker compose -f docker-compose.prod.yml exec db pg_dump -U postgres simstudio > backup.sql
```
```

--------------------------------------------------------------------------------

---[FILE: environment-variables.mdx]---
Location: sim-main/apps/docs/content/docs/en/self-hosting/environment-variables.mdx

```text
---
title: Environment Variables
description: Configuration reference for Sim Studio
---

import { Callout } from 'fumadocs-ui/components/callout'

## Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Auth secret (32 hex chars): `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | Your app URL |
| `ENCRYPTION_KEY` | Encryption key (32 hex chars): `openssl rand -hex 32` |
| `INTERNAL_API_SECRET` | Internal API secret (32 hex chars): `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket URL (default: `http://localhost:3002`) |

## AI Providers

| Variable | Provider |
|----------|----------|
| `OPENAI_API_KEY` | OpenAI |
| `ANTHROPIC_API_KEY_1` | Anthropic Claude |
| `GEMINI_API_KEY_1` | Google Gemini |
| `MISTRAL_API_KEY` | Mistral |
| `OLLAMA_URL` | Ollama (default: `http://localhost:11434`) |

<Callout type="info">
  For load balancing, add multiple keys with `_1`, `_2`, `_3` suffixes (e.g., `OPENAI_API_KEY_1`, `OPENAI_API_KEY_2`). Works with OpenAI, Anthropic, and Gemini.
</Callout>

<Callout type="info">
  In Docker, use `OLLAMA_URL=http://host.docker.internal:11434` for host-machine Ollama.
</Callout>

### Azure OpenAI

| Variable | Description |
|----------|-------------|
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL |
| `AZURE_OPENAI_API_VERSION` | API version (e.g., `2024-02-15-preview`) |

### vLLM (Self-Hosted)

| Variable | Description |
|----------|-------------|
| `VLLM_BASE_URL` | vLLM server URL (e.g., `http://localhost:8000/v1`) |
| `VLLM_API_KEY` | Optional bearer token for vLLM |

## OAuth Providers

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |

## Optional

| Variable | Description |
|----------|-------------|
| `API_ENCRYPTION_KEY` | Encrypts stored API keys (32 hex chars): `openssl rand -hex 32` |
| `COPILOT_API_KEY` | API key for copilot features |
| `ADMIN_API_KEY` | Admin API key for GitOps operations |
| `RESEND_API_KEY` | Email service for notifications |
| `ALLOWED_LOGIN_DOMAINS` | Restrict signups to domains (comma-separated) |
| `ALLOWED_LOGIN_EMAILS` | Restrict signups to specific emails (comma-separated) |
| `DISABLE_REGISTRATION` | Set to `true` to disable new user signups |

## Example .env

```bash
DATABASE_URL=postgresql://postgres:postgres@db:5432/simstudio
BETTER_AUTH_SECRET=<openssl rand -hex 32>
BETTER_AUTH_URL=https://sim.yourdomain.com
ENCRYPTION_KEY=<openssl rand -hex 32>
INTERNAL_API_SECRET=<openssl rand -hex 32>
NEXT_PUBLIC_APP_URL=https://sim.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://sim.yourdomain.com
OPENAI_API_KEY=sk-...
```

See `apps/sim/.env.example` for all options.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/en/self-hosting/index.mdx

```text
---
title: Self-Hosting
description: Deploy Sim Studio on your own infrastructure
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Callout } from 'fumadocs-ui/components/callout'

Deploy Sim Studio on your own infrastructure with Docker or Kubernetes.

## Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 12 GB | 16+ GB |
| Storage | 20 GB SSD | 50+ GB SSD |
| Docker | 20.10+ | Latest |

## Quick Start

```bash
git clone https://github.com/simstudioai/sim.git && cd sim
docker compose -f docker-compose.prod.yml up -d
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment Options

<Cards>
  <Card title="Docker" href="/self-hosting/docker">
    Deploy with Docker Compose on any server
  </Card>
  <Card title="Kubernetes" href="/self-hosting/kubernetes">
    Deploy with Helm on Kubernetes clusters
  </Card>
  <Card title="Cloud Platforms" href="/self-hosting/platforms">
    Railway, DigitalOcean, AWS, Azure, GCP guides
  </Card>
</Cards>

## Architecture

| Component | Port | Description |
|-----------|------|-------------|
| simstudio | 3000 | Main application |
| realtime | 3002 | WebSocket server |
| db | 5432 | PostgreSQL with pgvector |
| migrations | - | Database migrations (runs once) |
```

--------------------------------------------------------------------------------

---[FILE: kubernetes.mdx]---
Location: sim-main/apps/docs/content/docs/en/self-hosting/kubernetes.mdx

```text
---
title: Kubernetes
description: Deploy Sim Studio with Helm
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- PV provisioner support

## Installation

```bash
# Clone repo
git clone https://github.com/simstudioai/sim.git && cd sim

# Generate secrets
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
INTERNAL_API_SECRET=$(openssl rand -hex 32)

# Install
helm install sim ./helm/sim \
  --set app.env.BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET" \
  --set app.env.ENCRYPTION_KEY="$ENCRYPTION_KEY" \
  --set app.env.INTERNAL_API_SECRET="$INTERNAL_API_SECRET" \
  --namespace simstudio --create-namespace
```

## Cloud-Specific Values

<Tabs items={['AWS EKS', 'Azure AKS', 'GCP GKE']}>
  <Tab value="AWS EKS">
```bash
helm install sim ./helm/sim \
  --values ./helm/sim/examples/values-aws.yaml \
  --set app.env.BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET" \
  --set app.env.ENCRYPTION_KEY="$ENCRYPTION_KEY" \
  --set app.env.INTERNAL_API_SECRET="$INTERNAL_API_SECRET" \
  --set app.env.NEXT_PUBLIC_APP_URL="https://sim.yourdomain.com" \
  --namespace simstudio --create-namespace
```
  </Tab>
  <Tab value="Azure AKS">
```bash
helm install sim ./helm/sim \
  --values ./helm/sim/examples/values-azure.yaml \
  --set app.env.BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET" \
  --set app.env.ENCRYPTION_KEY="$ENCRYPTION_KEY" \
  --set app.env.INTERNAL_API_SECRET="$INTERNAL_API_SECRET" \
  --set app.env.NEXT_PUBLIC_APP_URL="https://sim.yourdomain.com" \
  --namespace simstudio --create-namespace
```
  </Tab>
  <Tab value="GCP GKE">
```bash
helm install sim ./helm/sim \
  --values ./helm/sim/examples/values-gcp.yaml \
  --set app.env.BETTER_AUTH_SECRET="$BETTER_AUTH_SECRET" \
  --set app.env.ENCRYPTION_KEY="$ENCRYPTION_KEY" \
  --set app.env.INTERNAL_API_SECRET="$INTERNAL_API_SECRET" \
  --set app.env.NEXT_PUBLIC_APP_URL="https://sim.yourdomain.com" \
  --namespace simstudio --create-namespace
```
  </Tab>
</Tabs>

## Key Configuration

```yaml
# Custom values.yaml
app:
  replicaCount: 2
  env:
    NEXT_PUBLIC_APP_URL: "https://sim.yourdomain.com"
    OPENAI_API_KEY: "sk-..."

postgresql:
  persistence:
    size: 50Gi

ingress:
  enabled: true
  className: nginx
  tls:
    enabled: true
  app:
    host: sim.yourdomain.com
```

See `helm/sim/values.yaml` for all options.

## External Database

```yaml
postgresql:
  enabled: false

externalDatabase:
  enabled: true
  host: "your-db-host"
  port: 5432
  username: "postgres"
  password: "your-password"
  database: "simstudio"
  sslMode: "require"
```

## Commands

```bash
# Port forward for local access
kubectl port-forward deployment/sim-sim-app 3000:3000 -n simstudio

# View logs
kubectl logs -l app.kubernetes.io/component=app -n simstudio --tail=100

# Upgrade
helm upgrade sim ./helm/sim --namespace simstudio

# Uninstall
helm uninstall sim --namespace simstudio
```
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/en/self-hosting/meta.json
Signals: Docker

```json
{
  "title": "Self-Hosting",
  "pages": [
    "index",
    "docker",
    "kubernetes",
    "platforms",
    "environment-variables",
    "troubleshooting"
  ],
  "defaultOpen": false
}
```

--------------------------------------------------------------------------------

````
