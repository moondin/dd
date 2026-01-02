---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 195
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 195 of 933)

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
Location: sim-main/apps/docs/content/docs/ja/sdks/typescript.mdx

```text
---
title: TypeScript
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

Simの公式TypeScript/JavaScript SDKは完全な型安全性を提供し、Node.jsとブラウザ環境の両方をサポートしています。これにより、Node.jsアプリケーション、Webアプリケーション、その他のJavaScript環境からプログラムでワークフローを実行することができます。

<Callout type="info">
  TypeScript SDKは完全な型安全性、非同期実行サポート、指数バックオフによる自動レート制限、使用状況追跡を提供します。
</Callout>

## インストール

お好みのパッケージマネージャーを使用してSDKをインストールします：

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

## クイックスタート

以下は簡単な使用例です：

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

## APIリファレンス

### SimStudioClient

#### コンストラクタ

```typescript
new SimStudioClient(config: SimStudioConfig)
```

**設定:**
- `config.apiKey` (string): SimのAPIキー
- `config.baseUrl` (string, オプション): Sim APIのベースURL（デフォルトは `https://sim.ai`）

#### メソッド

##### executeWorkflow()

オプションの入力データでワークフローを実行します。

```typescript
const result = await client.executeWorkflow('workflow-id', {
  input: { message: 'Hello, world!' },
  timeout: 30000 // 30 seconds
});
```

**パラメータ:**
- `workflowId` (string): 実行するワークフローのID
- `options` (ExecutionOptions, オプション):
  - `input` (any): ワークフローに渡す入力データ
  - `timeout` (number): タイムアウト（ミリ秒）（デフォルト: 30000）
  - `stream` (boolean): ストリーミングレスポンスを有効にする（デフォルト: false）
  - `selectedOutputs` (string[]): `blockName.attribute` 形式でストリーミングするブロック出力（例: `["agent1.content"]`）
  - `async` (boolean): 非同期実行（デフォルト: false）

**戻り値:** `Promise<WorkflowExecutionResult | AsyncExecutionResult>`

`async: true` の場合、ポーリング用のタスクIDをすぐに返します。それ以外の場合は、完了を待ちます。

##### getWorkflowStatus()

ワークフローのステータス（デプロイメントステータスなど）を取得します。

```typescript
const status = await client.getWorkflowStatus('workflow-id');
console.log('Is deployed:', status.isDeployed);
```

**パラメータ:**
- `workflowId` (string): ワークフローのID

**戻り値:** `Promise<WorkflowStatus>`

##### validateWorkflow()

ワークフローが実行準備ができているかを検証します。

```typescript
const isReady = await client.validateWorkflow('workflow-id');
if (isReady) {
  // Workflow is deployed and ready
}
```

**パラメータ:**
- `workflowId` (string): ワークフローのID

**戻り値:** `Promise<boolean>`

##### getJobStatus()

非同期ジョブ実行のステータスを取得します。

```typescript
const status = await client.getJobStatus('task-id-from-async-execution');
console.log('Status:', status.status); // 'queued', 'processing', 'completed', 'failed'
if (status.status === 'completed') {
  console.log('Output:', status.output);
}
```

**パラメータ:**
- `taskId` (string): 非同期実行から返されたタスクID

**戻り値:** `Promise<JobStatus>`

**レスポンスフィールド:**
- `success` (boolean): リクエストが成功したかどうか
- `taskId` (string): タスクID
- `status` (string): 次のいずれか `'queued'`, `'processing'`, `'completed'`, `'failed'`, `'cancelled'`
- `metadata` (object): `startedAt`, `completedAt`, および `duration` を含む
- `output` (any, オプション): ワークフロー出力（完了時）
- `error` (any, オプション): エラー詳細（失敗時）
- `estimatedDuration` (number, オプション): 推定所要時間（ミリ秒）（処理中/キュー時）

##### executeWithRetry()

指数バックオフを使用してレート制限エラー時に自動的に再試行するワークフロー実行。

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

**パラメータ:**
- `workflowId` (string): 実行するワークフローのID
- `options` (ExecutionOptions, オプション): `executeWorkflow()` と同じ
- `retryOptions` (RetryOptions, オプション):
  - `maxRetries` (number): 最大再試行回数（デフォルト: 3）
  - `initialDelay` (number): 初期遅延（ミリ秒）（デフォルト: 1000）
  - `maxDelay` (number): 最大遅延（ミリ秒）（デフォルト: 30000）
  - `backoffMultiplier` (number): バックオフ乗数（デフォルト: 2）

**戻り値:** `Promise<WorkflowExecutionResult | AsyncExecutionResult>`

リトライロジックは指数バックオフ（1秒 → 2秒 → 4秒 → 8秒...）を使用し、サンダリングハード問題を防ぐために±25%のジッターを適用します。APIが `retry-after` ヘッダーを提供する場合、代わりにそれが使用されます。

##### getRateLimitInfo()

最後のAPIレスポンスから現在のレート制限情報を取得します。

```typescript
const rateLimitInfo = client.getRateLimitInfo();
if (rateLimitInfo) {
  console.log('Limit:', rateLimitInfo.limit);
  console.log('Remaining:', rateLimitInfo.remaining);
  console.log('Reset:', new Date(rateLimitInfo.reset * 1000));
}
```

**戻り値:** `RateLimitInfo | null`

##### getUsageLimits()

アカウントの現在の使用制限とクォータ情報を取得します。

```typescript
const limits = await client.getUsageLimits();
console.log('Sync requests remaining:', limits.rateLimit.sync.remaining);
console.log('Async requests remaining:', limits.rateLimit.async.remaining);
console.log('Current period cost:', limits.usage.currentPeriodCost);
console.log('Plan:', limits.usage.plan);
```

**戻り値:** `Promise<UsageLimits>`

**レスポンス構造:**

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

APIキーを更新します。

```typescript
client.setApiKey('new-api-key');
```

##### setBaseUrl()

ベースURLを更新します。

```typescript
client.setBaseUrl('https://my-custom-domain.com');
```

## 型定義

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

### レート制限情報

```typescript
interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}
```

### 使用制限

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

### SimStudioエラー

```typescript
class SimStudioError extends Error {
  code?: string;
  status?: number;
}
```

**一般的なエラーコード:**
- `UNAUTHORIZED`: 無効なAPIキー
- `TIMEOUT`: リクエストタイムアウト
- `RATE_LIMIT_EXCEEDED`: レート制限超過
- `USAGE_LIMIT_EXCEEDED`: 使用制限超過
- `EXECUTION_ERROR`: ワークフロー実行失敗

## 例

### 基本的なワークフロー実行

<Steps>
  <Step title="クライアントの初期化">
    APIキーを使用してSimStudioClientをセットアップします。
  </Step>
  <Step title="ワークフローの検証">
    ワークフローがデプロイされ、実行準備ができているか確認します。
  </Step>
  <Step title="ワークフローの実行">
    入力データでワークフローを実行します。
  </Step>
  <Step title="結果の処理">
    実行結果を処理し、エラーを適切に扱います。
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

### エラー処理

ワークフロー実行中に発生する可能性のある様々なタイプのエラーを処理します：

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

### 環境設定

環境変数を使用してクライアントを設定します：

<Tabs items={['開発環境', '本番環境']}>
  <Tab value="開発環境">

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
  <Tab value="本番環境">

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

### Node.js Expressとの統合

Express.jsサーバーとの統合：

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

### Next.js APIルート

Next.js APIルートでの使用方法：

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

### ブラウザでの使用

ブラウザでの使用方法（適切なCORS設定が必要）：

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

### ファイルアップロード

Fileオブジェクトは自動的に検出され、base64形式に変換されます。ワークフローのAPIトリガー入力形式に一致するフィールド名で入力に含めてください。

SDKはFileオブジェクトを以下の形式に変換します：

```typescript
{
  type: 'file',
  data: 'data:mime/type;base64,base64data',
  name: 'filename',
  mime: 'mime/type'
}
```

または、URL形式を使用して手動でファイルを提供することもできます：

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
  ブラウザでSDKを使用する場合、機密性の高いAPIキーを公開しないよう注意してください。バックエンドプロキシや権限が制限された公開APIキーの使用を検討してください。
</Callout>

### Reactフックの例

ワークフロー実行用のカスタムReactフックを作成する：

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

### 非同期ワークフロー実行

長時間実行されるタスクのためにワークフローを非同期で実行する：

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

### レート制限とリトライ

指数バックオフを使用して自動的にレート制限を処理する：

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

### 使用状況のモニタリング

アカウントの使用状況と制限をモニタリングします：

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

### ワークフローのストリーミング実行

リアルタイムのストリーミングレスポンスでワークフローを実行します：

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

ストリーミングレスポンスはServer-Sent Events（SSE）形式に従います：

```
data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":"One"}

data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":", two"}

data: {"event":"done","success":true,"output":{},"metadata":{"duration":610}}

data: [DONE]
```

**Reactストリーミングの例：**

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

## APIキーの取得

<Steps>
  <Step title="Simにログイン">
    [Sim](https://sim.ai)に移動してアカウントにログインします。
  </Step>
  <Step title="ワークフローを開く">
    プログラムで実行したいワークフローに移動します。
  </Step>
  <Step title="ワークフローをデプロイする">
    まだデプロイされていない場合は、「デプロイ」をクリックしてワークフローをデプロイします。
  </Step>
  <Step title="APIキーを作成または選択する">
    デプロイプロセス中に、APIキーを選択または作成します。
  </Step>
  <Step title="APIキーをコピーする">
    TypeScript/JavaScriptアプリケーションで使用するAPIキーをコピーします。
  </Step>
</Steps>

## 要件

- Node.js 16+
- TypeScript 5.0+（TypeScriptプロジェクト用）

## ライセンス

Apache-2.0
```

--------------------------------------------------------------------------------

---[FILE: docker.mdx]---
Location: sim-main/apps/docs/content/docs/ja/self-hosting/docker.mdx

```text
---
title: Docker
description: Docker Composeを使用してSim Studioをデプロイする
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## クイックスタート

```bash
# Clone and start
git clone https://github.com/simstudioai/sim.git && cd sim
docker compose -f docker-compose.prod.yml up -d
```

[http://localhost:3000](http://localhost:3000)を開く

## 本番環境のセットアップ

### 1. 環境の設定

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

### 2. サービスの起動

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 3. SSLの設定

<Tabs items={['Caddy (推奨)', 'Nginx + Certbot']}>
  <Tab value="Caddy (推奨)">
Caddyは自動的にSSL証明書を処理します。

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

`/etc/caddy/Caddyfile`を作成します：

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

追加モデルを取得：

```bash
docker compose -f docker-compose.ollama.yml exec ollama ollama pull llama3.2
```

### 外部Ollama

Ollamaがホストマシン上で実行されている場合（Dockerではない）：

```bash
# macOS/Windows
OLLAMA_URL=http://host.docker.internal:11434 docker compose -f docker-compose.prod.yml up -d

# Linux - use your host IP
OLLAMA_URL=http://192.168.1.100:11434 docker compose -f docker-compose.prod.yml up -d
```

<Callout type="warning">
  Docker内では、`localhost`はホストではなくコンテナを指します。`host.docker.internal`またはホストのIPを使用してください。
</Callout>

## コマンド

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
Location: sim-main/apps/docs/content/docs/ja/self-hosting/environment-variables.mdx

```text
---
title: 環境変数
description: Sim Studioの設定リファレンス
---

import { Callout } from 'fumadocs-ui/components/callout'

## 必須項目

| 変数 | 説明 |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL接続文字列 |
| `BETTER_AUTH_SECRET` | 認証シークレット（32桁の16進数）: `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | アプリのURL |
| `ENCRYPTION_KEY` | 暗号化キー（32桁の16進数）: `openssl rand -hex 32` |
| `INTERNAL_API_SECRET` | 内部APIシークレット（32桁の16進数）: `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | 公開アプリURL |
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket URL（デフォルト: `http://localhost:3002`） |

## AIプロバイダー

| 変数 | プロバイダー |
|----------|----------|
| `OPENAI_API_KEY` | OpenAI |
| `ANTHROPIC_API_KEY_1` | Anthropic Claude |
| `GEMINI_API_KEY_1` | Google Gemini |
| `MISTRAL_API_KEY` | Mistral |
| `OLLAMA_URL` | Ollama（デフォルト: `http://localhost:11434`） |

<Callout type="info">
  負荷分散のために、`_1`、`_2`、`_3`のサフィックスを持つ複数のキーを追加できます（例：`OPENAI_API_KEY_1`、`OPENAI_API_KEY_2`）。OpenAI、Anthropic、Geminiで動作します。
</Callout>

<Callout type="info">
  Dockerでは、ホストマシンのOllamaに接続するために`OLLAMA_URL=http://host.docker.internal:11434`を使用してください。
</Callout>

### Azure OpenAI

| 変数 | 説明 |
|----------|-------------|
| `AZURE_OPENAI_API_KEY` | Azure OpenAI APIキー |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAIエンドポイントURL |
| `AZURE_OPENAI_API_VERSION` | APIバージョン（例：`2024-02-15-preview`） |

### vLLM（セルフホスト）

| 変数 | 説明 |
|----------|-------------|
| `VLLM_BASE_URL` | vLLMサーバーURL（例：`http://localhost:8000/v1`） |
| `VLLM_API_KEY` | vLLM用のオプションベアラートークン |

## OAuth プロバイダー

| 変数 | 説明 |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuthクライアントID |
| `GOOGLE_CLIENT_SECRET` | Google OAuthクライアントシークレット |
| `GITHUB_CLIENT_ID` | GitHub OAuthクライアントID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuthクライアントシークレット |

## オプション

| 変数 | 説明 |
|----------|-------------|
| `API_ENCRYPTION_KEY` | 保存されたAPIキーを暗号化します（32桁の16進数）: `openssl rand -hex 32` |
| `COPILOT_API_KEY` | コパイロット機能用のAPIキー |
| `ADMIN_API_KEY` | GitOps操作用の管理者APIキー |
| `RESEND_API_KEY` | 通知用のメールサービス |
| `ALLOWED_LOGIN_DOMAINS` | サインアップをドメインに制限（カンマ区切り） |
| `ALLOWED_LOGIN_EMAILS` | サインアップを特定のメールに制限（カンマ区切り） |
| `DISABLE_REGISTRATION` | 新規ユーザーのサインアップを無効にするには `true` に設定 |

## .envの例

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

すべてのオプションについては `apps/sim/.env.example` を参照してください。
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/ja/self-hosting/index.mdx

```text
---
title: セルフホスティング
description: 自社のインフラストラクチャにSim Studioをデプロイ
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Callout } from 'fumadocs-ui/components/callout'

DockerまたはKubernetesを使用して、自社のインフラストラクチャにSim Studioをデプロイします。

## 要件

| リソース | 最小 | 推奨 |
|----------|---------|-------------|
| CPU | 2コア | 4+コア |
| RAM | 12 GB | 16+ GB |
| ストレージ | 20 GB SSD | 50+ GB SSD |
| Docker | 20.10+ | 最新版 |

## クイックスタート

```bash
git clone https://github.com/simstudioai/sim.git && cd sim
docker compose -f docker-compose.prod.yml up -d
```

[http://localhost:3000](http://localhost:3000)を開く

## デプロイオプション

<Cards>
  <Card title="Docker" href="/self-hosting/docker">
    任意のサーバーでDocker Composeを使用してデプロイ
  </Card>
  <Card title="Kubernetes" href="/self-hosting/kubernetes">
    KubernetesクラスターでHelmを使用してデプロイ
  </Card>
  <Card title="クラウドプラットフォーム" href="/self-hosting/platforms">
    Railway、DigitalOcean、AWS、Azure、GCPのガイド
  </Card>
</Cards>

## アーキテクチャ

| コンポーネント | ポート | 説明 |
|-----------|------|-------------|
| simstudio | 3000 | メインアプリケーション |
| realtime | 3002 | WebSocketサーバー |
| db | 5432 | pgvector搭載のPostgreSQL |
| migrations | - | データベースマイグレーション（一度だけ実行） |
```

--------------------------------------------------------------------------------

---[FILE: kubernetes.mdx]---
Location: sim-main/apps/docs/content/docs/ja/self-hosting/kubernetes.mdx

```text
---
title: Kubernetes
description: Helmを使用してSim Studioをデプロイする
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## 前提条件

- Kubernetes 1.19+
- Helm 3.0+
- PVプロビジョナーのサポート

## インストール

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

## クラウド固有の値

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

## 主要な設定

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

すべてのオプションについては `helm/sim/values.yaml` を参照してください。

## 外部データベース

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

## コマンド

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
Location: sim-main/apps/docs/content/docs/ja/self-hosting/platforms.mdx

```text
---
title: クラウドプラットフォーム
description: クラウドプラットフォームにSim Studioをデプロイする
---

import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Callout } from 'fumadocs-ui/components/callout'

## Railway

ワンクリックデプロイメントで自動的にPostgreSQLをプロビジョニングします。

[

![Railwayにデプロイ](https://railway.app/button.svg)

](https://railway.com/new/template/sim-studio)

デプロイ後、Railwayダッシュボードで環境変数を追加してください：
- `BETTER_AUTH_SECRET`, `ENCRYPTION_KEY`, `INTERNAL_API_SECRET` (自動生成)
- `OPENAI_API_KEY` または他のAIプロバイダーキー
- 設定 → ネットワーキングでカスタムドメイン

## VPSデプロイメント

DigitalOcean、AWS EC2、Azure VMsまたは任意のLinuxサーバー向け：

<Tabs items={['DigitalOcean', 'AWS EC2', 'Azure VM']}>
  <Tab value="DigitalOcean">
**推奨：** 16 GB RAMドロップレット、Ubuntu 24.04

```bash
# Create Droplet via console, then SSH in
ssh root@your-droplet-ip
```

  </Tab>
  <Tab value="AWS EC2">
**推奨：** t3.xlarge (16 GB RAM)、Ubuntu 24.04

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

  </Tab>
  <Tab value="Azure VM">
**推奨：** Standard_D4s_v3 (16 GB RAM)、Ubuntu 24.04

```bash
ssh azureuser@your-vm-ip
```

  </Tab>
</Tabs>

### Dockerのインストール

```bash
# Install Docker (official method)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Logout and reconnect, then verify
docker --version
```

### Sim Studioのデプロイ

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

### CaddyによるSSL

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

ドメインのDNS AレコードをサーバーのIPアドレスに向けてください。

## Kubernetes (EKS, AKS, GKE)

[Kubernetesガイド](/self-hosting/kubernetes)でマネージドKubernetesへのHelmデプロイメントについて確認してください。

## マネージドデータベース（オプション）

本番環境では、マネージドPostgreSQLサービスを使用してください：

- **AWS RDS** / **Azure Database** / **Cloud SQL** - pgvector拡張機能を有効化
- **Supabase** / **Neon** - pgvector搭載済み

環境に`DATABASE_URL`を設定してください：

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```
```

--------------------------------------------------------------------------------

````
