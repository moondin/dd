---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 224
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 224 of 933)

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
Location: sim-main/apps/docs/content/docs/zh/sdks/typescript.mdx

```text
---
title: TypeScript
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

Sim 的官方 TypeScript/JavaScript SDK 提供完整的类型安全性，并支持 Node.js 和浏览器环境，允许您从 Node.js 应用程序、Web 应用程序和其他 JavaScript 环境中以编程方式执行工作流。

<Callout type="info">
  TypeScript SDK 提供完整的类型安全性、异步执行支持、带有指数回退的自动速率限制以及使用情况跟踪。
</Callout>

## 安装

使用您喜欢的包管理器安装 SDK：

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

## 快速开始

以下是一个简单的示例，帮助您快速入门：

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

## API 参考

### SimStudioClient

#### 构造函数

```typescript
new SimStudioClient(config: SimStudioConfig)
```

**配置：**
- `config.apiKey` (string)：您的 Sim API 密钥
- `config.baseUrl` (string，可选)：Sim API 的基础 URL（默认为 `https://sim.ai`）

#### 方法

##### executeWorkflow()

使用可选的输入数据执行工作流。

```typescript
const result = await client.executeWorkflow('workflow-id', {
  input: { message: 'Hello, world!' },
  timeout: 30000 // 30 seconds
});
```

**参数：**
- `workflowId`（字符串）：要执行的工作流的 ID
- `options`（ExecutionOptions，可选）：
  - `input`（任意类型）：传递给工作流的输入数据
  - `timeout`（数字）：超时时间（以毫秒为单位，默认值：30000）
  - `stream`（布尔值）：启用流式响应（默认值：false）
  - `selectedOutputs`（字符串数组）：以 `blockName.attribute` 格式流式传输的块输出（例如，`["agent1.content"]`）
  - `async`（布尔值）：异步执行（默认值：false）

**返回值：** `Promise<WorkflowExecutionResult | AsyncExecutionResult>`

当 `async: true` 时，立即返回一个用于轮询的任务 ID。否则，等待完成。

##### getWorkflowStatus()

获取工作流的状态（部署状态等）。

```typescript
const status = await client.getWorkflowStatus('workflow-id');
console.log('Is deployed:', status.isDeployed);
```

**参数：**
- `workflowId`（字符串）：工作流的 ID

**返回值：** `Promise<WorkflowStatus>`

##### validateWorkflow()

验证工作流是否准备好执行。

```typescript
const isReady = await client.validateWorkflow('workflow-id');
if (isReady) {
  // Workflow is deployed and ready
}
```

**参数：**
- `workflowId`（字符串）：工作流的 ID

**返回值：** `Promise<boolean>`

##### getJobStatus()

获取异步任务执行的状态。

```typescript
const status = await client.getJobStatus('task-id-from-async-execution');
console.log('Status:', status.status); // 'queued', 'processing', 'completed', 'failed'
if (status.status === 'completed') {
  console.log('Output:', status.output);
}
```

**参数：**
- `taskId`（字符串）：异步执行返回的任务 ID

**返回值：** `Promise<JobStatus>`

**响应字段：**
- `success`（布尔值）：请求是否成功
- `taskId`（字符串）：任务 ID
- `status`（字符串）：以下之一 `'queued'`、`'processing'`、`'completed'`、`'failed'`、`'cancelled'`
- `metadata`（对象）：包含 `startedAt`、`completedAt` 和 `duration`
- `output`（任意类型，可选）：工作流输出（完成时）
- `error`（任意类型，可选）：错误详情（失败时）
- `estimatedDuration`（数字，可选）：估计持续时间（以毫秒为单位，处理中/排队时）

##### executeWithRetry()

使用指数退避自动重试速率限制错误的工作流执行。

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

**参数：**
- `workflowId`（字符串）：要执行的工作流的 ID
- `options`（ExecutionOptions，可选）：与 `executeWorkflow()` 相同
- `retryOptions`（RetryOptions，可选）：
  - `maxRetries`（数字）：最大重试次数（默认值：3）
  - `initialDelay`（数字）：初始延迟时间（以毫秒为单位，默认值：1000）
  - `maxDelay`（数字）：最大延迟时间（以毫秒为单位，默认值：30000）
  - `backoffMultiplier`（数字）：退避倍数（默认值：2）

**返回值：** `Promise<WorkflowExecutionResult | AsyncExecutionResult>`

重试逻辑使用指数退避（1 秒 → 2 秒 → 4 秒 → 8 秒...）并带有 ±25% 的抖动，以防止惊群效应。如果 API 提供了 `retry-after` 标头，则会使用该标头。

##### getRateLimitInfo()

从上一次 API 响应中获取当前的速率限制信息。

```typescript
const rateLimitInfo = client.getRateLimitInfo();
if (rateLimitInfo) {
  console.log('Limit:', rateLimitInfo.limit);
  console.log('Remaining:', rateLimitInfo.remaining);
  console.log('Reset:', new Date(rateLimitInfo.reset * 1000));
}
```

**返回值：** `RateLimitInfo | null`

##### getUsageLimits()

获取您的账户当前的使用限制和配额信息。

```typescript
const limits = await client.getUsageLimits();
console.log('Sync requests remaining:', limits.rateLimit.sync.remaining);
console.log('Async requests remaining:', limits.rateLimit.async.remaining);
console.log('Current period cost:', limits.usage.currentPeriodCost);
console.log('Plan:', limits.usage.plan);
```

**返回值：** `Promise<UsageLimits>`

**响应结构：**

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

更新 API 密钥。

```typescript
client.setApiKey('new-api-key');
```

##### setBaseUrl()

更新基础 URL。

```typescript
client.setBaseUrl('https://my-custom-domain.com');
```

## 类型

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

**常见错误代码：**
- `UNAUTHORIZED`: 无效的 API 密钥
- `TIMEOUT`: 请求超时
- `RATE_LIMIT_EXCEEDED`: 超出速率限制
- `USAGE_LIMIT_EXCEEDED`: 超出使用限制
- `EXECUTION_ERROR`: 工作流执行失败

## 示例

### 基本工作流执行

<Steps>
  <Step title="初始化客户端">
    使用您的 API 密钥设置 SimStudioClient。
  </Step>
  <Step title="验证工作流">
    检查工作流是否已部署并准备好执行。
  </Step>
  <Step title="执行工作流">
    使用您的输入数据运行工作流。
  </Step>
  <Step title="处理结果">
    处理执行结果并处理任何错误。
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

### 错误处理

处理工作流执行过程中可能发生的不同类型的错误：

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

### 环境配置

使用环境变量配置客户端：

<Tabs items={['开发', '生产']}>
  <Tab value="开发">

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
  <Tab value="生产">

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

### Node.js Express 集成

与 Express.js 服务器集成：

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

### Next.js API 路由

与 Next.js API 路由一起使用：

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

### 浏览器使用

在浏览器中使用（需正确配置 CORS）：

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

### 文件上传

文件对象会被自动检测并转换为 base64 格式。将它们包含在输入中，字段名称需与工作流的 API 触发输入格式匹配。

SDK 将文件对象转换为以下格式：

```typescript
{
  type: 'file',
  data: 'data:mime/type;base64,base64data',
  name: 'filename',
  mime: 'mime/type'
}
```

或者，您可以使用 URL 格式手动提供文件：

```typescript
{
  type: 'url',
  data: 'https://example.com/file.pdf',
  name: 'file.pdf',
  mime: 'application/pdf'
}
```

<Tabs items={['浏览器', 'Node.js']}>
  <Tab value="浏览器">

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
  在浏览器中使用 SDK 时，请注意不要暴露敏感的 API 密钥。建议使用后端代理或具有有限权限的公共 API 密钥。
</Callout>

### React Hook 示例

为工作流执行创建一个自定义 React hook：

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

### 异步工作流执行

为长时间运行的任务异步执行工作流：

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

### 速率限制和重试

通过指数退避自动处理速率限制：

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

### 使用监控

监控您的账户使用情况和限制：

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

### 流式工作流执行

通过实时流式响应执行工作流：

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

流式响应遵循服务器发送事件 (SSE) 格式：

```
data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":"One"}

data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":", two"}

data: {"event":"done","success":true,"output":{},"metadata":{"duration":610}}

data: [DONE]
```

**React 流式示例：**

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

## 获取您的 API 密钥

<Steps>
  <Step title="登录到 Sim">
    访问 [Sim](https://sim.ai) 并登录到您的账户。
  </Step>
  <Step title="打开您的工作流">
    导航到您想要以编程方式执行的工作流。
  </Step>
  <Step title="部署您的工作流">
    如果尚未部署，请点击“部署”以部署您的工作流。
  </Step>
  <Step title="创建或选择一个 API 密钥">
    在部署过程中，选择或创建一个 API 密钥。
  </Step>
  <Step title="复制 API 密钥">
    复制 API 密钥以在您的 TypeScript/JavaScript 应用程序中使用。
  </Step>
</Steps>

## 要求

- Node.js 16+
- TypeScript 5.0+（适用于 TypeScript 项目）

## 许可证

Apache-2.0
```

--------------------------------------------------------------------------------

---[FILE: docker.mdx]---
Location: sim-main/apps/docs/content/docs/zh/self-hosting/docker.mdx

```text
---
title: Docker
description: 使用 Docker Compose 部署 Sim Studio
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## 快速开始

```bash
# Clone and start
git clone https://github.com/simstudioai/sim.git && cd sim
docker compose -f docker-compose.prod.yml up -d
```

打开 [http://localhost:3000](http://localhost:3000)

## 生产环境设置

### 1. 配置环境

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

### 2. 启动服务

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 3. 设置 SSL

<Tabs items={['Caddy (推荐)', 'Nginx + Certbot']}>
  <Tab value="Caddy (推荐)">
Caddy 会自动处理 SSL 证书。

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

创建 `/etc/caddy/Caddyfile`：

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

拉取其他模型：

```bash
docker compose -f docker-compose.ollama.yml exec ollama ollama pull llama3.2
```

### 外部 Ollama

如果 Ollama 在您的主机上运行（而不是在 Docker 中）：

```bash
# macOS/Windows
OLLAMA_URL=http://host.docker.internal:11434 docker compose -f docker-compose.prod.yml up -d

# Linux - use your host IP
OLLAMA_URL=http://192.168.1.100:11434 docker compose -f docker-compose.prod.yml up -d
```

<Callout type="warning">
  在 Docker 内，`localhost` 指的是容器，而不是您的主机。请使用 `host.docker.internal` 或您的主机 IP。
</Callout>

## 命令

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
Location: sim-main/apps/docs/content/docs/zh/self-hosting/environment-variables.mdx

```text
---
title: 环境变量
description: Sim Studio 的配置参考
---

import { Callout } from 'fumadocs-ui/components/callout'

## 必需

| 变量 | 描述 |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL 连接字符串 |
| `BETTER_AUTH_SECRET` | 认证密钥（32 个十六进制字符）：`openssl rand -hex 32` |
| `BETTER_AUTH_URL` | 您的应用程序 URL |
| `ENCRYPTION_KEY` | 加密密钥（32 个十六进制字符）：`openssl rand -hex 32` |
| `INTERNAL_API_SECRET` | 内部 API 密钥（32 个十六进制字符）：`openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | 公共应用程序 URL |
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket URL（默认值：`http://localhost:3002`） |

## AI 提供商

| 变量 | 提供商 |
|----------|----------|
| `OPENAI_API_KEY` | OpenAI |
| `ANTHROPIC_API_KEY_1` | Anthropic Claude |
| `GEMINI_API_KEY_1` | Google Gemini |
| `MISTRAL_API_KEY` | Mistral |
| `OLLAMA_URL` | Ollama（默认值：`http://localhost:11434`） |

<Callout type="info">
  为了负载均衡，请添加带有 `_1`、`_2`、`_3` 后缀的多个密钥（例如，`OPENAI_API_KEY_1`、`OPENAI_API_KEY_2`）。适用于 OpenAI、Anthropic 和 Gemini。
</Callout>

<Callout type="info">
  在 Docker 中，使用 `OLLAMA_URL=http://host.docker.internal:11434` 作为主机机器的 Ollama。
</Callout>

### Azure OpenAI

| 变量 | 描述 |
|----------|-------------|
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API 密钥 |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI 端点 URL |
| `AZURE_OPENAI_API_VERSION` | API 版本（例如，`2024-02-15-preview`） |

### vLLM（自托管）

| 变量 | 描述 |
|----------|-------------|
| `VLLM_BASE_URL` | vLLM 服务器 URL（例如，`http://localhost:8000/v1`） |
| `VLLM_API_KEY` | vLLM 的可选 Bearer Token |

## OAuth 提供商

| 变量 | 描述 |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth 客户端 ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 客户端密钥 |
| `GITHUB_CLIENT_ID` | GitHub OAuth 客户端 ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth 客户端密钥 |

## 可选

| 变量 | 描述 |
|----------|-------------|
| `API_ENCRYPTION_KEY` | 加密存储的 API 密钥（32 个十六进制字符）：`openssl rand -hex 32` |
| `COPILOT_API_KEY` | 用于 copilot 功能的 API 密钥 |
| `ADMIN_API_KEY` | 用于 GitOps 操作的管理员 API 密钥 |
| `RESEND_API_KEY` | 用于通知的电子邮件服务 |
| `ALLOWED_LOGIN_DOMAINS` | 限制注册到特定域（逗号分隔） |
| `ALLOWED_LOGIN_EMAILS` | 限制注册到特定电子邮件（逗号分隔） |
| `DISABLE_REGISTRATION` | 设置为 `true` 以禁用新用户注册 |

## 示例 .env

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

查看 `apps/sim/.env.example` 以获取所有选项。
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/zh/self-hosting/index.mdx

```text
---
title: 自托管
description: 在您自己的基础设施上部署 Sim Studio
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Callout } from 'fumadocs-ui/components/callout'

使用 Docker 或 Kubernetes 在您自己的基础设施上部署 Sim Studio。

## 要求

| 资源 | 最低要求 | 推荐配置 |
|----------|---------|-------------|
| CPU | 2 核 | 4 核及以上 |
| 内存 | 12 GB | 16 GB 及以上 |
| 存储 | 20 GB SSD | 50 GB 及以上 SSD |
| Docker | 20.10+ | 最新版本 |

## 快速开始

```bash
git clone https://github.com/simstudioai/sim.git && cd sim
docker compose -f docker-compose.prod.yml up -d
```

打开 [http://localhost:3000](http://localhost:3000)

## 部署选项

<Cards>
  <Card title="Docker" href="/self-hosting/docker">
    使用 Docker Compose 在任何服务器上部署
  </Card>
  <Card title="Kubernetes" href="/self-hosting/kubernetes">
    使用 Helm 在 Kubernetes 集群上部署
  </Card>
  <Card title="Cloud Platforms" href="/self-hosting/platforms">
    Railway、DigitalOcean、AWS、Azure、GCP 指南
  </Card>
</Cards>

## 架构

| 组件 | 端口 | 描述 |
|-----------|------|-------------|
| simstudio | 3000 | 主应用程序 |
| realtime | 3002 | WebSocket 服务器 |
| db | 5432 | 带有 pgvector 的 PostgreSQL |
| migrations | - | 数据库迁移（运行一次） |
```

--------------------------------------------------------------------------------

---[FILE: kubernetes.mdx]---
Location: sim-main/apps/docs/content/docs/zh/self-hosting/kubernetes.mdx

```text
---
title: Kubernetes
description: 使用 Helm 部署 Sim Studio
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## 前置条件

- Kubernetes 1.19+
- Helm 3.0+
- 支持 PV 提供程序

## 安装

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

## 云特定值

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

## 关键配置

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

查看 `helm/sim/values.yaml` 了解所有选项。

## 外部数据库

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

## 命令

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

---[FILE: platforms.mdx]---
Location: sim-main/apps/docs/content/docs/zh/self-hosting/platforms.mdx

```text
---
title: 云平台
description: 在云平台上部署 Sim Studio
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## Railway

一键部署并自动配置 PostgreSQL。

[

![在 Railway 上部署](https://railway.app/button.svg)

](https://railway.com/new/template/sim-studio)

部署后，在 Railway 仪表板中添加环境变量：
- `BETTER_AUTH_SECRET`, `ENCRYPTION_KEY`, `INTERNAL_API_SECRET`（自动生成）
- `OPENAI_API_KEY` 或其他 AI 提供商密钥
- 自定义域名：设置 → 网络

## VPS 部署

适用于 DigitalOcean、AWS EC2、Azure VMs 或任何 Linux 服务器：

<Tabs items={['DigitalOcean', 'AWS EC2', 'Azure VM']}>
  <Tab value="DigitalOcean">
**推荐配置：** 16 GB RAM Droplet，Ubuntu 24.04

```bash
# Create Droplet via console, then SSH in
ssh root@your-droplet-ip
```

  </Tab>
  <Tab value="AWS EC2">
**推荐配置：** t3.xlarge（16 GB RAM），Ubuntu 24.04

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

  </Tab>
  <Tab value="Azure VM">
**推荐配置：** Standard_D4s_v3（16 GB RAM），Ubuntu 24.04

```bash
ssh azureuser@your-vm-ip
```

  </Tab>
</Tabs>

### 安装 Docker

```bash
# Install Docker (official method)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Logout and reconnect, then verify
docker --version
```

### 部署 Sim Studio

```bash
git clone https://github.com/simstudioai/sim.git && cd sim

# Create .env with secrets
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@db:5432/simstudio
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
INTERNAL_API_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_APP_URL=https://sim.yourdomain.com
BETTER_AUTH_URL=https://sim.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://sim.yourdomain.com
EOF

# Start
docker compose -f docker-compose.prod.yml up -d
```

### 使用 Caddy 配置 SSL

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy

# Configure (replace domain)
echo 'sim.yourdomain.com {
    reverse_proxy localhost:3000
    handle /socket.io/* {
        reverse_proxy localhost:3002
    }
}' | sudo tee /etc/caddy/Caddyfile

sudo systemctl restart caddy
```

将您的域名的 DNS A 记录指向您的服务器 IP。

## Kubernetes（EKS、AKS、GKE）

有关在托管 Kubernetes 上使用 Helm 部署的详细信息，请参阅 [Kubernetes 指南](/self-hosting/kubernetes)。

## 托管数据库（可选）

在生产环境中，请使用托管的 PostgreSQL 服务：

- **AWS RDS** / **Azure Database** / **Cloud SQL** - 启用 pgvector 扩展
- **Supabase** / **Neon** - 已包含 pgvector

在您的环境中设置 `DATABASE_URL`：

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```
```

--------------------------------------------------------------------------------

---[FILE: troubleshooting.mdx]---
Location: sim-main/apps/docs/content/docs/zh/self-hosting/troubleshooting.mdx

```text
---
title: 故障排除
description: 常见问题及解决方案
---

## 数据库连接失败

```bash
# Check database is running
docker compose ps db

# Test connection
docker compose exec db psql -U postgres -c "SELECT 1"
```

验证 `DATABASE_URL` 格式：`postgresql://user:pass@host:5432/database`

## Ollama 模型未显示

在 Docker 中，`localhost` = 容器，而不是您的主机。

```bash
# For host-machine Ollama, use:
OLLAMA_URL=http://host.docker.internal:11434  # macOS/Windows
OLLAMA_URL=http://192.168.1.x:11434           # Linux (use actual IP)
```

## WebSocket/实时功能无法正常工作

1. 检查 `NEXT_PUBLIC_SOCKET_URL` 是否与您的域名匹配
2. 验证实时服务是否正在运行：`docker compose ps realtime`
3. 确保反向代理支持 WebSocket 升级（参见 [Docker 指南](/self-hosting/docker)）

## 502 错误网关

```bash
# Check app is running
docker compose ps simstudio
docker compose logs simstudio

# Common causes: out of memory, database not ready
```

## 迁移错误

```bash
# View migration logs
docker compose logs migrations

# Run manually
docker compose exec simstudio bun run db:migrate
```

## 找不到 pgvector

使用正确的 PostgreSQL 镜像：

```yaml
image: pgvector/pgvector:pg17  # NOT postgres:17
```

## 证书错误 (CERT_HAS_EXPIRED)

如果调用外部 API 时出现 SSL 证书错误：

```bash
# Update CA certificates in container
docker compose exec simstudio apt-get update && apt-get install -y ca-certificates

# Or set in environment (not recommended for production)
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## 登录后出现空白页面

1. 检查浏览器控制台是否有错误
2. 验证 `NEXT_PUBLIC_APP_URL` 是否与您的实际域名匹配
3. 清除浏览器的 Cookie 和本地存储
4. 检查所有服务是否正在运行：`docker compose ps`

## Windows 特定问题

**Windows 上的 Turbopack 错误：**

```bash
# Use WSL2 for better compatibility
wsl --install

# Or disable Turbopack in package.json
# Change "next dev --turbopack" to "next dev"
```

**行尾问题：**

```bash
# Configure git to use LF
git config --global core.autocrlf input
```

## 查看日志

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f simstudio
```

## 获取帮助

- [GitHub Issues](https://github.com/simstudioai/sim/issues)
- [Discord](https://discord.gg/Hr4UWYEcTT)
```

--------------------------------------------------------------------------------

````
