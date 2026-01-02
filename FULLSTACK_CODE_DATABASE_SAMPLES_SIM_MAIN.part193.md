---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 193
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 193 of 933)

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

---[FILE: api.mdx]---
Location: sim-main/apps/docs/content/docs/ja/execution/api.mdx

```text
---
title: 外部API
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Simは、ワークフローの実行ログを照会したり、ワークフローが完了したときにリアルタイム通知を設定するためのWebhookを設定したりするための包括的な外部APIを提供しています。

## 認証

すべてのAPIリクエストには、`x-api-key`ヘッダーで渡されるAPIキーが必要です：

```bash
curl -H "x-api-key: YOUR_API_KEY" \
  https://sim.ai/api/v1/logs?workspaceId=YOUR_WORKSPACE_ID
```

SimダッシュボードのユーザーセッティングからAPIキーを生成できます。

## ログAPI

すべてのAPIレスポンスには、ワークフロー実行の制限と使用状況に関する情報が含まれています：

```json
"limits": {
  "workflowExecutionRateLimit": {
    "sync": {
      "requestsPerMinute": 60,  // Sustained rate limit per minute
      "maxBurst": 120,          // Maximum burst capacity
      "remaining": 118,         // Current tokens available (up to maxBurst)
      "resetAt": "..."          // When tokens next refill
    },
    "async": {
      "requestsPerMinute": 200, // Sustained rate limit per minute
      "maxBurst": 400,          // Maximum burst capacity
      "remaining": 398,         // Current tokens available
      "resetAt": "..."          // When tokens next refill
    }
  },
  "usage": {
    "currentPeriodCost": 1.234,  // Current billing period usage in USD
    "limit": 10,                  // Usage limit in USD
    "plan": "pro",                // Current subscription plan
    "isExceeded": false           // Whether limit is exceeded
  }
}
```

**注意:** レート制限はトークンバケットアルゴリズムを使用しています。最近の割り当てを完全に使用していない場合、`remaining`は`requestsPerMinute`を超えて`maxBurst`まで達することができ、バーストトラフィックを許可します。レスポンスボディのレート制限はワークフロー実行のためのものです。このAPIエンドポイントを呼び出すためのレート制限はレスポンスヘッダー（`X-RateLimit-*`）にあります。

### ログの照会

広範なフィルタリングオプションでワークフロー実行ログを照会します。

<Tabs items={['Request', 'Response']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs
    ```

    **必須パラメータ：**
    - `workspaceId` - ワークスペースID

    **オプションフィルター：**
    - `workflowIds` - カンマ区切りのワークフローID
    - `folderIds` - カンマ区切りのフォルダID
    - `triggers` - カンマ区切りのトリガータイプ: `api`, `webhook`, `schedule`, `manual`, `chat`
    - `level` - レベルでフィルタリング: `info`, `error`
    - `startDate` - 日付範囲開始のISOタイムスタンプ
    - `endDate` - 日付範囲終了のISOタイムスタンプ
    - `executionId` - 正確な実行ID一致
    - `minDurationMs` - 最小実行時間（ミリ秒）
    - `maxDurationMs` - 最大実行時間（ミリ秒）
    - `minCost` - 最小実行コスト
    - `maxCost` - 最大実行コスト
    - `model` - 使用されたAIモデルでフィルタリング

    **ページネーション：**
    - `limit` - ページあたりの結果数（デフォルト：100）
    - `cursor` - 次ページのカーソル
    - `order` - ソート順：`desc`, `asc` （デフォルト：desc）

    **詳細レベル:**
    - `details` - レスポンス詳細レベル: `basic`, `full` (デフォルト: basic)
    - `includeTraceSpans` - トレーススパンを含める (デフォルト: false)
    - `includeFinalOutput` - 最終出力を含める (デフォルト: false)
  </Tab>
  <Tab value="Response">

    ```json
    {
      "data": [
        {
          "id": "log_abc123",
          "workflowId": "wf_xyz789",
          "executionId": "exec_def456",
          "level": "info",
          "trigger": "api",
          "startedAt": "2025-01-01T12:34:56.789Z",
          "endedAt": "2025-01-01T12:34:57.123Z",
          "totalDurationMs": 334,
          "cost": {
            "total": 0.00234
          },
          "files": null
        }
      ],
      "nextCursor": "eyJzIjoiMjAyNS0wMS0wMVQxMjozNDo1Ni43ODlaIiwiaWQiOiJsb2dfYWJjMTIzIn0",
      "limits": {
        "workflowExecutionRateLimit": {
          "sync": {
            "requestsPerMinute": 60,
            "maxBurst": 120,
            "remaining": 118,
            "resetAt": "2025-01-01T12:35:56.789Z"
          },
          "async": {
            "requestsPerMinute": 200,
            "maxBurst": 400,
            "remaining": 398,
            "resetAt": "2025-01-01T12:35:56.789Z"
          }
        },
        "usage": {
          "currentPeriodCost": 1.234,
          "limit": 10,
          "plan": "pro",
          "isExceeded": false
        }
      }
    }
    ```

  </Tab>
</Tabs>

### ログ詳細の取得

特定のログエントリに関する詳細情報を取得します。

<Tabs items={['Request', 'Response']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs/{id}
    ```

  </Tab>
  <Tab value="Response">

    ```json
    {
      "data": {
        "id": "log_abc123",
        "workflowId": "wf_xyz789",
        "executionId": "exec_def456",
        "level": "info",
        "trigger": "api",
        "startedAt": "2025-01-01T12:34:56.789Z",
        "endedAt": "2025-01-01T12:34:57.123Z",
        "totalDurationMs": 334,
        "workflow": {
          "id": "wf_xyz789",
          "name": "My Workflow",
          "description": "Process customer data"
        },
        "executionData": {
          "traceSpans": [...],
          "finalOutput": {...}
        },
        "cost": {
          "total": 0.00234,
          "tokens": {
            "prompt": 123,
            "completion": 456,
            "total": 579
          },
          "models": {
            "gpt-4o": {
              "input": 0.001,
              "output": 0.00134,
              "total": 0.00234,
              "tokens": {
                "prompt": 123,
                "completion": 456,
                "total": 579
              }
            }
          }
        },
        "limits": {
          "workflowExecutionRateLimit": {
            "sync": {
              "requestsPerMinute": 60,
              "maxBurst": 120,
              "remaining": 118,
              "resetAt": "2025-01-01T12:35:56.789Z"
            },
            "async": {
              "requestsPerMinute": 200,
              "maxBurst": 400,
              "remaining": 398,
              "resetAt": "2025-01-01T12:35:56.789Z"
            }
          },
          "usage": {
            "currentPeriodCost": 1.234,
            "limit": 10,
            "plan": "pro",
            "isExceeded": false
          }
        }
      }
    }
    ```

  </Tab>
</Tabs>

### 実行詳細の取得

ワークフロー状態のスナップショットを含む実行詳細を取得します。

<Tabs items={['Request', 'Response']}>
  <Tab value="Request">

    ```http
    GET /api/v1/logs/executions/{executionId}
    ```

  </Tab>
  <Tab value="Response">

    ```json
    {
      "executionId": "exec_def456",
      "workflowId": "wf_xyz789",
      "workflowState": {
        "blocks": {...},
        "edges": [...],
        "loops": {...},
        "parallels": {...}
      },
      "executionMetadata": {
        "trigger": "api",
        "startedAt": "2025-01-01T12:34:56.789Z",
        "endedAt": "2025-01-01T12:34:57.123Z",
        "totalDurationMs": 334,
        "cost": {...}
      }
    }
    ```

  </Tab>
</Tabs>

## 通知

ワークフローの実行が完了したときに、Webhook、メール、またはSlackを通じてリアルタイム通知を受け取ることができます。通知はログページからワークスペースレベルで設定されます。

### 設定

ログページからメニューボタンをクリックし、「通知を設定する」を選択して通知を設定します。

**通知チャネル:**
- **Webhook**: エンドポイントにHTTP POSTリクエストを送信
- **メール**: 実行詳細を含むメール通知を受信
- **Slack**: Slackチャンネルにメッセージを投稿

**ワークフロー選択:**
- 監視する特定のワークフローを選択
- または「すべてのワークフロー」を選択して現在および将来のワークフローを含める

**フィルタリングオプション:**
- `levelFilter`: 受信するログレベル (`info`, `error`)
- `triggerFilter`: 受信するトリガータイプ (`api`, `webhook`, `schedule`, `manual`, `chat`)

**オプションデータ:**
- `includeFinalOutput`: ワークフローの最終出力を含める
- `includeTraceSpans`: 詳細な実行トレーススパンを含める
- `includeRateLimits`: レート制限情報（同期/非同期の制限と残り）を含める
- `includeUsageData`: 請求期間の使用状況と制限を含める

### アラートルール

すべての実行について通知を受け取る代わりに、問題が検出された場合にのみ通知されるようにアラートルールを設定できます：

**連続失敗**
- X回連続して実行が失敗した後にアラート（例：3回連続の失敗）
- 実行が成功すると、リセットされます

**失敗率**
- 過去Y時間の失敗率がX%を超えた場合にアラート
- ウィンドウ内で最低5回の実行が必要
- 完全な時間ウィンドウが経過した後にのみトリガーされます

**レイテンシーしきい値**
- 実行がX秒以上かかった場合にアラート
- 遅いまたは停止しているワークフローを検出するのに役立ちます

**レイテンシースパイク**
- 実行が平均よりX%遅い場合にアラート
- 設定された時間ウィンドウでの平均所要時間と比較
- ベースラインを確立するために最低5回の実行が必要

**コスト閾値**
- 単一の実行コストが$Xを超えた場合にアラート
- 高価なLLM呼び出しを検出するのに役立つ

**アクティビティなし**
- X時間以内に実行がない場合にアラート
- 定期的に実行されるべきスケジュールされたワークフローの監視に役立つ

**エラー数**
- 時間枠内でエラー数がXを超えた場合にアラート
- 連続ではなく、総エラー数を追跡

すべてのアラートタイプには、通知スパムを防ぐための1時間のクールダウンが含まれています。

### Webhook設定

Webhookの場合、追加オプションが利用可能です：
- `url`：WebhookエンドポイントURL
- `secret`：HMAC署名検証用のオプションシークレット

### ペイロード構造

ワークフロー実行が完了すると、Simは以下のペイロードを送信します（webhook POST、メール、またはSlackを介して）：

```json
{
  "id": "evt_123",
  "type": "workflow.execution.completed",
  "timestamp": 1735925767890,
  "data": {
    "workflowId": "wf_xyz789",
    "executionId": "exec_def456",
    "status": "success",
    "level": "info",
    "trigger": "api",
    "startedAt": "2025-01-01T12:34:56.789Z",
    "endedAt": "2025-01-01T12:34:57.123Z",
    "totalDurationMs": 334,
    "cost": {
      "total": 0.00234,
      "tokens": {
        "prompt": 123,
        "completion": 456,
        "total": 579
      },
      "models": {
        "gpt-4o": {
          "input": 0.001,
          "output": 0.00134,
          "total": 0.00234,
          "tokens": {
            "prompt": 123,
            "completion": 456,
            "total": 579
          }
        }
      }
    },
    "files": null,
    "finalOutput": {...},  // Only if includeFinalOutput=true
    "traceSpans": [...],   // Only if includeTraceSpans=true
    "rateLimits": {...},   // Only if includeRateLimits=true
    "usage": {...}         // Only if includeUsageData=true
  },
  "links": {
    "log": "/v1/logs/log_abc123",
    "execution": "/v1/logs/executions/exec_def456"
  }
}
```

### Webhookヘッダー

各Webhookリクエストには以下のヘッダーが含まれます（Webhookチャンネルのみ）：

- `sim-event`：イベントタイプ（常に`workflow.execution.completed`）
- `sim-timestamp`：ミリ秒単位のUnixタイムスタンプ
- `sim-delivery-id`：べき等性のための一意の配信ID
- `sim-signature`：検証用のHMAC-SHA256署名（シークレットが設定されている場合）
- `Idempotency-Key`：重複検出のための配信IDと同じ

### 署名検証

Webhookシークレットを設定した場合、署名を検証してWebhookがSimからのものであることを確認します：

<Tabs items={['Node.js', 'Python']}>
  <Tab value="Node.js">

    ```javascript
    import crypto from 'crypto';

    function verifyWebhookSignature(body, signature, secret) {
      const [timestampPart, signaturePart] = signature.split(',');
      const timestamp = timestampPart.replace('t=', '');
      const expectedSignature = signaturePart.replace('v1=', '');
      
      const signatureBase = `${timestamp}.${body}`;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(signatureBase);
      const computedSignature = hmac.digest('hex');
      
      return computedSignature === expectedSignature;
    }

    // In your webhook handler
    app.post('/webhook', (req, res) => {
      const signature = req.headers['sim-signature'];
      const body = JSON.stringify(req.body);
      
      if (!verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET)) {
        return res.status(401).send('Invalid signature');
      }
      
      // Process the webhook...
    });
    ```

  </Tab>
  <Tab value="Python">

    ```python
    import hmac
    import hashlib
    import json

    def verify_webhook_signature(body: str, signature: str, secret: str) -> bool:
        timestamp_part, signature_part = signature.split(',')
        timestamp = timestamp_part.replace('t=', '')
        expected_signature = signature_part.replace('v1=', '')
        
        signature_base = f"{timestamp}.{body}"
        computed_signature = hmac.new(
            secret.encode(),
            signature_base.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(computed_signature, expected_signature)

    # In your webhook handler
    @app.route('/webhook', methods=['POST'])
    def webhook():
        signature = request.headers.get('sim-signature')
        body = json.dumps(request.json)
        
        if not verify_webhook_signature(body, signature, os.environ['WEBHOOK_SECRET']):
            return 'Invalid signature', 401
        
        # Process the webhook...
    ```

  </Tab>
</Tabs>

### リトライポリシー

失敗したWebhook配信は指数バックオフとジッターを使用して再試行されます：

- 最大試行回数：5回
- リトライ遅延：5秒、15秒、1分、3分、10分
- ジッター：サンダリングハード問題を防ぐために最大10%の追加遅延
- HTTP 5xxと429レスポンスのみがリトライをトリガー
- 配信は30秒後にタイムアウト

<Callout type="info">
  Webhook配信は非同期で処理され、ワークフロー実行のパフォーマンスに影響しません。
</Callout>

## ベストプラクティス

1. **ポーリング戦略**: ログをポーリングする場合、`order=asc`と`startDate`を使用したカーソルベースのページネーションを利用して、新しいログを効率的に取得してください。

2. **Webhookセキュリティ**: 常にWebhookシークレットを設定し、署名を検証して、リクエストがSimからのものであることを確認してください。

3. **べき等性**: `Idempotency-Key`ヘッダーを使用して、重複するWebhook配信を検出し処理してください。

4. **プライバシー**: デフォルトでは、`finalOutput`と`traceSpans`はレスポンスから除外されます。データが必要で、プライバシーへの影響を理解している場合にのみ有効にしてください。

5. **レート制限**: 429レスポンスを受け取った場合は指数バックオフを実装してください。推奨待機時間については`Retry-After`ヘッダーを確認してください。

## レート制限

APIは**トークンバケットアルゴリズム**をレート制限に使用し、バーストトラフィックを許可しながら公平な使用を提供します：

| プラン | リクエスト/分 | バースト容量 |
|------|-----------------|----------------|
| 無料 | 10 | 20 |
| プロ | 30 | 60 |
| チーム | 60 | 120 |
| エンタープライズ | 120 | 240 |

**仕組み:**
- トークンは`requestsPerMinute`のレートで補充されます
- アイドル状態のとき、最大`maxBurst`トークンまで蓄積できます
- 各リクエストは1トークンを消費します
- バースト容量によりトラフィックスパイクの処理が可能になります

レート制限情報はレスポンスヘッダーに含まれています：
- `X-RateLimit-Limit`：1分あたりのリクエスト数（補充レート）
- `X-RateLimit-Remaining`：現在利用可能なトークン
- `X-RateLimit-Reset`：トークンが次に補充されるISOタイムスタンプ

## 例：新しいログのポーリング

```javascript
let cursor = null;
const workspaceId = 'YOUR_WORKSPACE_ID';
const startDate = new Date().toISOString();

async function pollLogs() {
  const params = new URLSearchParams({
    workspaceId,
    startDate,
    order: 'asc',
    limit: '100'
  });
  
  if (cursor) {
    params.append('cursor', cursor);
  }
  
  const response = await fetch(
    `https://sim.ai/api/v1/logs?${params}`,
    {
      headers: {
        'x-api-key': 'YOUR_API_KEY'
      }
    }
  );
  
  if (response.ok) {
    const data = await response.json();
    
    // Process new logs
    for (const log of data.data) {
      console.log(`New execution: ${log.executionId}`);
    }
    
    // Update cursor for next poll
    if (data.nextCursor) {
      cursor = data.nextCursor;
    }
  }
}

// Poll every 30 seconds
setInterval(pollLogs, 30000);
```

## 例：ウェブフックの処理

```javascript
import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

app.post('/sim-webhook', (req, res) => {
  // Verify signature
  const signature = req.headers['sim-signature'];
  const body = JSON.stringify(req.body);
  
  if (!verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Check timestamp to prevent replay attacks
  const timestamp = parseInt(req.headers['sim-timestamp']);
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  
  if (timestamp < fiveMinutesAgo) {
    return res.status(401).send('Timestamp too old');
  }
  
  // Process the webhook
  const event = req.body;
  
  switch (event.type) {
    case 'workflow.execution.completed':
      const { workflowId, executionId, status, cost } = event.data;
      
      if (status === 'error') {
        console.error(`Workflow ${workflowId} failed: ${executionId}`);
        // Handle error...
      } else {
        console.log(`Workflow ${workflowId} completed: ${executionId}`);
        console.log(`Cost: $${cost.total}`);
        // Process successful execution...
      }
      break;
  }
  
  // Return 200 to acknowledge receipt
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```
```

--------------------------------------------------------------------------------

---[FILE: basics.mdx]---
Location: sim-main/apps/docs/content/docs/ja/execution/basics.mdx

```text
---
title: 基本
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

Simでワークフローがどのように実行されるかを理解することは、効率的で信頼性の高い自動化を構築するための鍵です。実行エンジンは依存関係、並行処理、データフローを自動的に処理し、ワークフローがスムーズかつ予測可能に実行されることを保証します。

## ワークフローの実行方法

Simの実行エンジンは依存関係を分析し、最も効率的な順序でブロックを実行することで、ワークフローをインテリジェントに処理します。

### デフォルトでの並行実行

互いに依存関係のない複数のブロックは同時に実行されます。この並列実行は手動設定を必要とせずにパフォーマンスを劇的に向上させます。

<Image
  src="/static/execution/concurrency.png"
  alt="スタートブロックの後に複数のブロックが同時に実行されている"
  width={800}
  height={500}
/>

この例では、カスタマーサポートとディープリサーチャーの両方のエージェントブロックがスタートブロックの後に同時に実行され、効率を最大化しています。

### 自動出力結合

ブロックに複数の依存関係がある場合、実行エンジンはすべての依存関係が完了するのを自動的に待ち、それらの結合された出力を次のブロックに提供します。手動での結合は必要ありません。

<Image
  src="/static/execution/combination.png"
  alt="関数ブロックが複数の前のブロックからの出力を自動的に受け取る"
  width={800}
  height={500}
/>

関数ブロックは両方のエージェントブロックが完了するとすぐにそれらの出力を受け取り、結合された結果を処理することができます。

### スマートルーティング

ワークフローはルーティングブロックを使用して複数の方向に分岐できます。実行エンジンは決定論的ルーティング（条件ブロックを使用）とAI駆動ルーティング（ルーターブロックを使用）の両方をサポートしています。

<Image
  src="/static/execution/routing.png"
  alt="条件分岐とルーターベースの分岐の両方を示すワークフロー"
  width={800}
  height={500}
/>

このワークフローは、条件やAIの判断に基づいて実行が異なる経路をたどる方法を示しており、各経路は独立して実行されます。

## ブロックタイプ

Simは、ワークフロー内で特定の目的を果たす異なるタイプのブロックを提供しています：

<Cards>
  <Card title="トリガー" href="/triggers">
    **スタータブロック**はワークフローを開始し、**Webhookブロック**は外部イベントに応答します。すべてのワークフローは実行を開始するためのトリガーが必要です。
  </Card>
  
  <Card title="処理ブロック" href="/blocks">
    **エージェントブロック**はAIモデルと対話し、**ファンクションブロック**はカスタムコードを実行し、**APIブロック**は外部サービスに接続します。これらのブロックはデータを変換・処理します。
  </Card>
  
  <Card title="制御フロー" href="/blocks">
    **ルーターブロック**はAIを使用して経路を選択し、**条件ブロック**はロジックに基づいて分岐し、**ループ/並列ブロック**は反復と並行処理を扱います。
  </Card>
  
  <Card title="出力と応答" href="/blocks">
    **レスポンスブロック**はAPIやチャットインターフェース向けに最終出力をフォーマットし、ワークフローから構造化された結果を返します。
  </Card>
</Cards>

すべてのブロックは依存関係に基づいて自動的に実行されます - 実行順序やタイミングを手動で管理する必要はありません。

## 実行モニタリング

ワークフローが実行されると、Simは実行プロセスをリアルタイムで可視化します：

- **ライブブロック状態**：現在実行中、完了、または失敗したブロックを確認できます
- **実行ログ**：入力、出力、およびエラーを示す詳細なログがリアルタイムで表示されます
- **パフォーマンスメトリクス**：各ブロックの実行時間とコストを追跡します
- **パス可視化**：ワークフロー内でどの実行パスが取られたかを理解できます

<Callout type="info">
  すべての実行詳細はワークフローが完了した後でも確認できるように記録され、デバッグと最適化に役立ちます。
</Callout>

## 主要な実行原則

これらの核となる原則を理解することで、より良いワークフローを構築できます：

1. **依存関係ベースの実行**：ブロックはすべての依存関係が完了した時のみ実行されます
2. **自動並列化**：独立したブロックは設定なしで同時に実行されます
3. **スマートデータフロー**：出力は接続されたブロックに自動的に流れます
4. **エラー処理**：失敗したブロックはその実行パスを停止しますが、独立したパスには影響しません
5. **状態の永続化**：すべてのブロック出力と実行詳細はデバッグのために保存されます

## 次のステップ

実行の基本を理解したら、以下を探索してください：
- **[ブロックタイプ](/blocks)** - 特定のブロック機能について学ぶ
- **[ロギング](/execution/logging)** - ワークフロー実行を監視し問題をデバッグする
- **[コスト計算](/execution/costs)** - ワークフローコストを理解し最適化する
- **[トリガー](/triggers)** - ワークフローを実行するさまざまな方法を設定する
```

--------------------------------------------------------------------------------

---[FILE: costs.mdx]---
Location: sim-main/apps/docs/content/docs/ja/execution/costs.mdx

```text
---
title: コスト計算
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Simはすべてのワークフロー実行のコストを自動的に計算し、AIモデルの使用量と実行料金に基づいた透明な価格設定を提供します。これらのコストを理解することで、ワークフローを最適化し、予算を効果的に管理することができます。

## コストの計算方法

すべてのワークフロー実行には、次の2つのコスト要素が含まれます：

**基本実行料金**：1回の実行につき$0.001

**AIモデル使用料**：トークン消費量に基づく変動コスト

```javascript
modelCost = (inputTokens × inputPrice + outputTokens × outputPrice) / 1,000,000
totalCost = baseExecutionCharge + modelCost
```

<Callout type="info">
  AIモデルの価格は100万トークンあたりの金額です。実際のコストを算出するために1,000,000で割ります。AIブロックを使用しないワークフローは基本実行料金のみが発生します。
</Callout>

## ログでのモデル内訳

AIブロックを使用するワークフローでは、ログで詳細なコスト情報を確認できます：

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-cost.png"
    alt="モデル内訳"
    width={600}
    height={400}
    className="my-6"
  />
</div>

モデル内訳には以下が表示されます：
- **トークン使用量**：各モデルの入力および出力トークン数
- **コスト内訳**：モデルごとおよび操作ごとの個別コスト
- **モデル分布**：使用されたモデルとその回数
- **総コスト**：ワークフロー実行全体の合計コスト

## 料金オプション

<Tabs items={['Hosted Models', 'Bring Your Own API Key']}>
  <Tab>
    **ホステッドモデル** - Simは2.5倍の価格倍率でAPIキーを提供します：

    **OpenAI**
    | モデル | 基本価格（入力/出力） | ホステッド価格（入力/出力） |
    |-------|---------------------------|----------------------------|
    | GPT-5.1 | $1.25 / $10.00 | $3.13 / $25.00 |
    | GPT-5 | $1.25 / $10.00 | $3.13 / $25.00 |
    | GPT-5 Mini | $0.25 / $2.00 | $0.63 / $5.00 |
    | GPT-5 Nano | $0.05 / $0.40 | $0.13 / $1.00 |
    | GPT-4o | $2.50 / $10.00 | $6.25 / $25.00 |
    | GPT-4.1 | $2.00 / $8.00 | $5.00 / $20.00 |
    | GPT-4.1 Mini | $0.40 / $1.60 | $1.00 / $4.00 |
    | GPT-4.1 Nano | $0.10 / $0.40 | $0.25 / $1.00 |
    | o1 | $15.00 / $60.00 | $37.50 / $150.00 |
    | o3 | $2.00 / $8.00 | $5.00 / $20.00 |
    | o4 Mini | $1.10 / $4.40 | $2.75 / $11.00 |

    **Anthropic**
    | モデル | 基本価格（入力/出力） | ホステッド価格（入力/出力） |
    |-------|---------------------------|----------------------------|
    | Claude Opus 4.5 | $5.00 / $25.00 | $12.50 / $62.50 |
    | Claude Opus 4.1 | $15.00 / $75.00 | $37.50 / $187.50 |
    | Claude Sonnet 4.5 | $3.00 / $15.00 | $7.50 / $37.50 |
    | Claude Sonnet 4.0 | $3.00 / $15.00 | $7.50 / $37.50 |
    | Claude Haiku 4.5 | $1.00 / $5.00 | $2.50 / $12.50 |

    **Google**
    | モデル | 基本価格（入力/出力） | ホステッド価格（入力/出力） |
    |-------|---------------------------|----------------------------|
    | Gemini 3 Pro Preview | $2.00 / $12.00 | $5.00 / $30.00 |
    | Gemini 2.5 Pro | $0.15 / $0.60 | $0.38 / $1.50 |
    | Gemini 2.5 Flash | $0.15 / $0.60 | $0.38 / $1.50 |

    *2.5倍の倍率はインフラストラクチャとAPI管理コストをカバーしています。*
  </Tab>

  <Tab>
    **独自のAPIキー** - 基本価格で任意のモデルを使用：

    | プロバイダー | モデル例 | 入力 / 出力 |
    |----------|----------------|----------------|
    | Deepseek | V3, R1 | $0.75 / $1.00 |
    | xAI | Grok 4 Latest, Grok 3 | $3.00 / $15.00 |
    | Groq | Llama 4 Scout, Llama 3.3 70B | $0.11 / $0.34 |
    | Cerebras | Llama 4 Scout, Llama 3.3 70B | $0.11 / $0.34 |
    | Ollama | ローカルモデル | 無料 |
    | VLLM | ローカルモデル | 無料 |

    *プロバイダーに直接支払い、マークアップなし*
  </Tab>
</Tabs>

<Callout type="warning">
  表示価格は2025年9月10日時点のレートを反映しています。最新の価格については各プロバイダーのドキュメントをご確認ください。
</Callout>

## コスト最適化戦略

- **モデル選択**: タスクの複雑さに基づいてモデルを選択してください。単純なタスクにはGPT-4.1-nanoを使用し、複雑な推論にはo1やClaude Opusが必要な場合があります。
- **プロンプトエンジニアリング**: 構造化された簡潔なプロンプトは、品質を犠牲にすることなくトークン使用量を削減します。
- **ローカルモデル**: 重要度の低いタスクにはOllamaやVLLMを使用して、API費用を完全に排除します。
- **キャッシュと再利用**: 頻繁に使用される結果を変数やファイルに保存して、AIモデル呼び出しの繰り返しを避けます。
- **バッチ処理**: 個別の呼び出しを行うのではなく、単一のAIリクエストで複数のアイテムを処理します。

## 使用状況モニタリング

設定 → サブスクリプションで使用状況と請求を監視できます：

- **現在の使用状況**: 現在の期間のリアルタイムの使用状況とコスト
- **使用制限**: 視覚的な進捗指標付きのプラン制限
- **請求詳細**: 予測される料金と最低利用額
- **プラン管理**: アップグレードオプションと請求履歴

### プログラムによる使用状況の追跡

APIを使用して、現在の使用状況と制限をプログラムで照会できます：

**エンドポイント：**

```text
GET /api/users/me/usage-limits
```

**認証：**
- APIキーを `X-API-Key` ヘッダーに含めてください

**リクエスト例：**

```bash
curl -X GET -H "X-API-Key: YOUR_API_KEY" -H "Content-Type: application/json" https://sim.ai/api/users/me/usage-limits
```

**レスポンス例：**

```json
{
  "success": true,
  "rateLimit": {
    "sync": {
      "isLimited": false,
      "requestsPerMinute": 25,
      "maxBurst": 50,
      "remaining": 50,
      "resetAt": "2025-09-08T22:51:55.999Z"
    },
    "async": {
      "isLimited": false,
      "requestsPerMinute": 200,
      "maxBurst": 400,
      "remaining": 400,
      "resetAt": "2025-09-08T22:51:56.155Z"
    },
    "authType": "api"
  },
  "usage": {
    "currentPeriodCost": 12.34,
    "limit": 100,
    "plan": "pro"
  }
}
```

**レート制限フィールド：**
- `requestsPerMinute`：持続的なレート制限（トークンはこの速度で補充されます）
- `maxBurst`：蓄積できる最大トークン数（バースト容量）
- `remaining`：現在利用可能なトークン（最大で`maxBurst`まで）

**レスポンスフィールド：**
- `currentPeriodCost`は現在の請求期間の使用状況を反映します
- `limit`は個別の制限（無料/プロ）または組織のプール制限（チーム/エンタープライズ）から派生します
- `plan`はユーザーに関連付けられた最優先のアクティブなプランです

## プラン制限

サブスクリプションプランによって使用制限が異なります：

| プラン | 月間使用制限 | レート制限（分あたり） |
|------|-------------------|-------------------------|
| **無料** | $10 | 5同期、10非同期 |
| **プロ** | $100 | 10同期、50非同期 |
| **チーム** | $500（プール） | 50同期、100非同期 |
| **エンタープライズ** | カスタム | カスタム |

## 課金モデル

Simは**基本サブスクリプション+超過分**の課金モデルを使用しています：

### 仕組み

**プロプラン（月額$20）：**
- 月額サブスクリプションには$20分の使用量が含まれます
- 使用量が$20未満 → 追加料金なし
- 使用量が$20を超える → 月末に超過分を支払い
- 例：$35の使用量 = $20（サブスクリプション）+ $15（超過分）

**チームプラン（席あたり月額$40）：**
- チームメンバー全体でプールされた使用量
- チーム全体の使用量から超過分を計算
- 組織のオーナーが一括で請求を受ける

**エンタープライズプラン：**
- 固定月額料金、超過料金なし
- 契約に基づくカスタム使用制限

### しきい値課金

未請求の超過分が$50に達すると、Simは自動的に未請求の全額を請求します。

**例：**
- 10日目：$70の超過分 → 即時に$70を請求
- 15日目：追加$35の使用（合計$105） → すでに請求済み、アクションなし
- 20日目：さらに$50の使用（合計$155、未請求$85） → 即時に$85を請求

これにより、期間終了時に一度に大きな請求が発生するのではなく、月全体に大きな超過料金が分散されます。

## コスト管理のベストプラクティス

1. **定期的な監視**: 予期せぬ事態を避けるため、使用状況ダッシュボードを頻繁に確認する
2. **予算の設定**: プランの制限を支出のガードレールとして使用する
3. **ワークフローの最適化**: コストの高い実行を見直し、プロンプトやモデル選択を最適化する
4. **適切なモデルの使用**: タスクの要件にモデルの複雑さを合わせる
5. **類似タスクのバッチ処理**: 可能な場合は複数のリクエストを組み合わせてオーバーヘッドを削減する

## 次のステップ

- [設定 → サブスクリプション](https://sim.ai/settings/subscription)で現在の使用状況を確認する
- 実行詳細を追跡するための[ロギング](/execution/logging)について学ぶ
- プログラムによるコスト監視のための[外部API](/execution/api)を探索する
- コスト削減のための[ワークフロー最適化テクニック](/blocks)をチェックする
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/ja/execution/index.mdx

```text
---
title: 概要
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

Simの実行エンジンは、ブロックを正しい順序で処理し、データフローを管理し、エラーを適切に処理することで、ワークフローに命を吹き込みます。これにより、Simでワークフローがどのように実行されるかを正確に理解することができます。

<Callout type="info">
  すべてのワークフロー実行は、ブロック接続とロジックに基づいた決定論的なパスに従い、予測可能で信頼性の高い結果を保証します。
</Callout>

## ドキュメント概要

<Cards>
  <Card title="実行の基本" href="/execution/basics">
    基本的な実行フロー、ブロックタイプ、およびデータがワークフローをどのように流れるかについて学びます
  </Card>

  <Card title="ロギング" href="/execution/logging">
    包括的なロギングとリアルタイムの可視性でワークフロー実行を監視します
  </Card>
  
  <Card title="コスト計算" href="/execution/costs">
    ワークフロー実行コストがどのように計算され最適化されるかを理解します
  </Card>
  
  <Card title="外部API" href="/execution/api">
    REST APIを通じてプログラム的に実行ログにアクセスしウェブフックを設定します
  </Card>
</Cards>

## 主要概念

### トポロジカル実行
ブロックは依存関係の順序で実行され、スプレッドシートがセルを再計算する方法に似ています。実行エンジンは、完了した依存関係に基づいて、どのブロックが実行可能かを自動的に判断します。

### パス追跡
エンジンはワークフロー内の実行パスを積極的に追跡します。ルーターおよび条件ブロックはこれらのパスを動的に更新し、関連するブロックのみが実行されるようにします。

### レイヤーベースの処理
ブロックを一つずつ実行する代わりに、エンジンは並列実行可能なブロックのレイヤーを識別し、複雑なワークフローのパフォーマンスを最適化します。

### 実行コンテキスト
各ワークフローは実行中に以下を含む豊富なコンテキストを維持します：
- ブロックの出力と状態
- アクティブな実行パス
- ループと並列反復の追跡
- 環境変数
- ルーティング決定

## デプロイメントスナップショット

すべての公開エントリーポイント（API、チャット、スケジュール、Webhook、手動実行）は、ワークフローのアクティブなデプロイメントスナップショットを実行します。キャンバスを変更するたびに新しいデプロイメントを公開することで、すべてのトリガーが更新されたバージョンを使用するようになります。

<div className='flex justify-center my-6'>
  <Image
    src='/static/execution/deployment-versions.png'
    alt='デプロイメントバージョン一覧表'
    width={500}
    height={280}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

デプロイモーダルは完全なバージョン履歴を保持しています。任意のスナップショットを検査し、ドラフトと比較して、以前のリリースを復元する必要がある場合はワンクリックで昇格またはロールバックできます。

## プログラムによる実行

公式SDKを使用してアプリケーションからワークフローを実行できます：

```bash
# TypeScript/JavaScript
npm install simstudio-ts-sdk

# Python
pip install simstudio-sdk
```

```typescript
// TypeScript Example
import { SimStudioClient } from 'simstudio-ts-sdk';

const client = new SimStudioClient({ 
  apiKey: 'your-api-key' 
});

const result = await client.executeWorkflow('workflow-id', {
  input: { message: 'Hello' }
});
```

## ベストプラクティス

### 信頼性を考慮した設計
- 適切なフォールバックパスでエラーを適切に処理する
- 機密データには環境変数を使用する
- デバッグ用にFunction ブロックにログ記録を追加する

### パフォーマンスの最適化
- 可能な限り外部APIコールを最小限に抑える
- 独立した操作には並列実行を使用する
- 適切な場合はMemoryブロックで結果をキャッシュする

### 実行の監視
- パフォーマンスパターンを理解するために定期的にログを確認する
- AIモデル使用のコストを追跡する
- 問題をデバッグするためにワークフロースナップショットを使用する

## 次のステップ

ワークフローの実行方法を理解するには[実行の基本](/execution/basics)から始め、次に実行を監視するための[ログ記録](/execution/logging)や支出を最適化するための[コスト計算](/execution/costs)を探索してください。
```

--------------------------------------------------------------------------------

---[FILE: logging.mdx]---
Location: sim-main/apps/docs/content/docs/ja/execution/logging.mdx

```text
---
title: ロギング
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Simはすべてのワークフロー実行に対して包括的なロギングを提供し、ワークフローの実行方法、データの流れ、問題が発生する可能性のある場所について完全な可視性を提供します。

## ロギングシステム

Simは異なるワークフローとユースケースに対応する2つの補完的なロギングインターフェースを提供しています：

### リアルタイムコンソール

手動またはチャットワークフロー実行中、ログはワークフローエディタの右側にあるコンソールパネルにリアルタイムで表示されます：

<div className="flex justify-center">
  <Image
    src="/static/logs/console.png"
    alt="リアルタイムコンソールパネル"
    width={400}
    height={300}
    className="my-6"
  />
</div>

コンソールには以下が表示されます：
- アクティブなブロックのハイライト表示によるブロック実行の進行状況
- ブロックが完了するとリアルタイムで出力
- 各ブロックの実行時間
- 成功/エラーステータスインジケーター

### ログページ

手動、API、チャット、スケジュール、またはWebhookを介してトリガーされたすべてのワークフロー実行は、専用のログページに記録されます：

<div className="flex justify-center">
  <Image
    src="/static/logs/logs.png"
    alt="ログページ"
    width={600}
    height={400}
    className="my-6"
  />
</div>

ログページは以下を提供します：
- 時間範囲、ステータス、トリガータイプ、フォルダ、ワークフローによる包括的なフィルタリング
- すべてのログにわたる検索機能
- リアルタイム更新のためのライブモード
- 7日間のログ保持（長期保持にアップグレード可能）

## ログ詳細サイドバー

任意のログエントリをクリックすると、詳細なサイドバービューが開きます：

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-sidebar.png"
    alt="ログサイドバーの詳細"
    width={600}
    height={400}
    className="my-6"
  />
</div>

### ブロック入力/出力

各ブロックの完全なデータフローを表示し、タブを切り替えて：

<Tabs items={['Output', 'Input']}>
  <Tab>
    **出力タブ**はブロックの実行結果を表示します：
    - JSON形式の構造化データ
    - AI生成コンテンツのマークダウンレンダリング
    - データ抽出が簡単なコピーボタン
  </Tab>
  
  <Tab>
    **入力タブ**はブロックに渡されたものを表示します：
    - 解決された変数値
    - 他のブロックからの参照出力
    - 使用された環境変数
    - セキュリティのためにAPIキーは自動的に編集されます
  </Tab>
</Tabs>

### 実行タイムライン

ワークフローレベルのログでは、詳細な実行メトリクスを確認できます：
- 開始および終了タイムスタンプ
- ワークフロー全体の所要時間
- 個々のブロックの実行時間
- パフォーマンスのボトルネック特定

## ワークフロースナップショット

ログに記録された任意の実行について、「スナップショットを表示」をクリックすると、実行時のワークフローの正確な状態を確認できます：

<div className="flex justify-center">
  <Image
    src="/static/logs/logs-frozen-canvas.png"
    alt="ワークフロースナップショット"
    width={600}
    height={400}
    className="my-6"
  />
</div>

スナップショットでは以下を提供します：
- ワークフロー構造を示す凍結されたキャンバス
- 実行中のブロックの状態と接続
- 任意のブロックをクリックして入力と出力を確認
- その後変更されたワークフローのデバッグに役立つ

<Callout type="info">
  ワークフロースナップショットは、拡張ログシステム導入後の実行でのみ利用可能です。古い移行されたログでは「ログ状態が見つかりません」というメッセージが表示されます。
</Callout>

## ログ保持期間

- **無料プラン**：7日間のログ保持
- **プロプラン**：30日間のログ保持
- **チームプラン**：90日間のログ保持
- **エンタープライズプラン**：カスタム保持期間が利用可能

## ベストプラクティス

### 開発向け
- テスト中の即時フィードバックにはリアルタイムコンソールを使用
- データフローを確認するためにブロックの入力と出力をチェック
- 正常動作版と問題のある版を比較するためにワークフロースナップショットを使用

### 本番環境向け
- エラーやパフォーマンスの問題を定期的にログページで監視
- 特定のワークフローや期間に焦点を当てるためのフィルターを設定
- 重要なデプロイメント中はライブモードを使用してリアルタイムで実行を監視

### デバッグ向け
- 遅いブロックを特定するために常に実行タイムラインを確認
- 正常動作する実行と失敗する実行の間の入力を比較
- 問題が発生した時の正確な状態を確認するためにワークフロースナップショットを使用

## 次のステップ

- ワークフローの価格設定を理解するための[コスト計算](/execution/costs)について学ぶ
- プログラムによるログアクセスのための[外部API](/execution/api)を探索する
- webhook、メール、またはSlackによるリアルタイムアラートのための[通知](/execution/api#notifications)を設定する
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/ja/getting-started/index.mdx

```text
---
title: はじめに
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import {
  AgentIcon,
  ApiIcon,
  ChartBarIcon,
  CodeIcon,
  ConditionalIcon,
  ConnectIcon,
  ExaAIIcon,
  FirecrawlIcon,
  GmailIcon,
  NotionIcon,
  PerplexityIcon,
  SlackIcon,
} from '@/components/icons'
import { Video } from '@/components/ui/video'
import { Image } from '@/components/ui/image'

10分で最初のAIワークフローを構築しましょう。このチュートリアルでは、高度なLLM駆動の検索ツールを使用して個人に関する情報を抽出し構造化する人物調査エージェントを作成します。

<Callout type="info">
  このチュートリアルでは、Simでワークフローを構築するための基本的な概念を説明します。推定所要時間：10分。
</Callout>

## 作成するもの

以下の機能を持つ人物調査エージェント：
1. チャットインターフェースを通じてユーザー入力を受け付ける
2. AI駆動ツール（ExaとLinkup）を使用してウェブを検索する
3. 個人に関する情報を抽出し構造化する
4. 場所、職業、学歴を含む整形されたJSONデータを返す

<Image
  src="/static/getting-started/started-1.png"
  alt="はじめての例"
  width={800}
  height={500}
/>

## ステップバイステップのチュートリアル

<Steps>
  <Step title="ワークフローを作成しAIエージェントを追加する">
    ダッシュボードで**新規ワークフロー**をクリックし、「Getting Started」と名前を付けます。
    
    新しいワークフローには、デフォルトで**スタートブロック**が含まれています—これはユーザー入力を受け取るエントリーポイントです。このワークフローはチャットを通じてトリガーされるため、スタートブロックの設定は必要ありません。
    
    左パネルから**エージェントブロック**をキャンバスにドラッグして、以下のように設定します：
    - **モデル**：「OpenAI GPT-4o」を選択
    - **システムプロンプト**：「あなたは人物調査エージェントです。人物の名前が与えられたら、利用可能な検索ツールを使用して、その人物の居住地、職業、学歴、その他の関連情報を含む包括的な情報を見つけてください。」
    - **ユーザープロンプト**：スタートブロックの出力から接続をドラッグしてこのフィールドに接続し、`<start.input>` をユーザープロンプトに接続します
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-2.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="エージェントに検索ツールを追加する">
    ウェブ検索機能でエージェントを強化します。エージェントブロックをクリックして選択します。
    
    **ツール**セクションで：
    - **ツールを追加**をクリック
    - 利用可能なツールから**Exa**と**Linkup**を選択
    - ウェブ検索とデータアクセスを有効にするために両方のツールにAPIキーを提供
    
    <div className="mx-auto w-3/5 overflow-hidden rounded-lg">
      <Video src="getting-started/started-3.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="ワークフローをテストする">
    画面右側の**チャットパネル**を使用してワークフローをテストします。
    
    チャットパネルで：
    - ドロップダウンをクリックして`agent1.content`を選択し、エージェントの出力を表示
    - テストメッセージを入力：「Johnはサンフランシスコ出身のソフトウェアエンジニアで、スタンフォード大学でコンピュータサイエンスを学びました。」
    - **送信**をクリックしてワークフローを実行
    
    エージェントは人物を分析し、構造化された情報を返します。
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-4.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="構造化された出力を設定する">
    構造化されたJSONデータを返すようにエージェントを設定します。エージェントブロックをクリックして選択します。
    
    **レスポンスフォーマット**セクションで：
    - スキーマフィールドの横にある**魔法の杖アイコン**（✨）をクリック
    - プロンプトを入力：「location、profession、educationを含むpersonという名前のスキーマを作成する」
    - AIが自動的にJSONスキーマを生成します
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-5.mp4" width={700} height={450} />
    </div>
  </Step>
  
  <Step title="構造化された出力でテストする">
    **チャットパネル**に戻り、構造化されたレスポンス形式をテストします。
    
    レスポンス形式が設定されたことで、新しい出力オプションが利用可能になりました：
    - ドロップダウンをクリックして構造化された出力オプション（作成したスキーマ）を選択
    - テストメッセージを入力：「Sarahはニューヨーク出身のマーケティングマネージャーで、ハーバードビジネススクールでMBAを取得しました。」
    - **送信**をクリックしてワークフローを実行
    
    エージェントは、場所、職業、学歴のフィールドに整理された人物の情報を含む構造化されたJSON出力を返すようになります。
    
    <div className="mx-auto w-full overflow-hidden rounded-lg">
      <Video src="getting-started/started-6.mp4" width={700} height={450} />
    </div>
  </Step>
</Steps>

## 構築したもの

以下のことができるAIワークフローを正常に作成しました：
- ✅ チャットインターフェースを通じてユーザー入力を受け付ける
- ✅ AIを使用して非構造化テキストを処理する
- ✅ 外部検索ツール（ExaとLinkup）を統合する
- ✅ AIで生成されたスキーマを持つ構造化JSONデータを返す
- ✅ リアルタイムのテストと反復を実証する
- ✅ ビジュアルなノーコード開発の力を示す

## 学んだ主要な概念

### 使用したブロックタイプ

<Files>
  <File
    name="スタートブロック"
    icon={<ConnectIcon className="h-4 w-4" />}
    annotation="ユーザー入力のエントリーポイント（自動的に含まれる）"
  />
  <File
    name="エージェントブロック"
    icon={<AgentIcon className="h-4 w-4" />}
    annotation="テキスト処理と分析のためのAIモデル"
  />
</Files>

### コアワークフローの概念

**データフロー**  
ブロック間を接続してワークフローステップ間でデータを受け渡す

**チャットインターフェース**  
チャットパネルでワークフローをリアルタイムでテストし、異なる出力オプションを選択する

**ツール統合**  
ExaやLinkupなどの外部サービスを統合してエージェントの機能を拡張する

**変数参照**  
`<blockName.output>` 構文を使用してブロック出力にアクセスする

**構造化出力**  
JSONスキーマを定義して、AIからの一貫性のある整形された応答を確保する

**AI生成スキーマ**  
魔法の杖（✨）を使用して自然言語プロンプトからスキーマを生成する

**反復的な開発**  
即時フィードバックでワークフローを素早く構築、テスト、改良する

## 次のステップ

<Cards>
  <Card title="ワークフローブロックを探索する" href="/blocks">
    API、関数、条件などのワークフローブロックを発見する
  </Card>
  <Card title="統合機能を閲覧する" href="/tools">
    Gmail、Slack、Notionなど80以上のサービスに接続する
  </Card>
  <Card title="カスタムロジックを追加する" href="/blocks/function">
    高度なデータ処理のためのカスタム関数を作成する
  </Card>
  <Card title="ワークフローをデプロイする" href="/execution">
    REST APIやウェブフックを通じてワークフローにアクセスできるようにする
  </Card>
</Cards>

## リソース

**詳細な説明が必要ですか？** 各コンポーネントの包括的なガイドについては[ブロックのドキュメント](/blocks)をご覧ください。

**統合機能をお探しですか？** 利用可能な80以上の統合機能については[ツールのドキュメント](/tools)をご覧ください。

**本番環境に移行する準備はできましたか？** ワークフローを本番環境に対応させるための[実行とデプロイメント](/execution)について学びましょう。
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/ja/introduction/index.mdx

```text
---
title: はじめに
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Simはオープンソースのビジュアルワークフロービルダーで、AIエージェントワークフローの構築とデプロイに使用できます。ノーコードインターフェースを使用してインテリジェントな自動化システムを設計し、直感的なドラッグアンドドロップキャンバスを通じてAIモデル、データベース、API、ビジネスツールを接続できます。チャットボットの構築、ビジネスプロセスの自動化、複雑なデータパイプラインのオーケストレーションなど、SimはあなたのAIワークフローを実現するためのツールを提供します。

<div className="flex justify-center">
  <Image
    src="/static/introduction.png"
    alt="Simビジュアルワークフローキャンバス"
    width={700}
    height={450}
    className="my-6"
  />
</div>

## 構築できるもの

**AIアシスタント＆チャットボット**  
ツールやデータと統合するインテリジェントな会話エージェントを構築します。ウェブ検索、カレンダー管理、メール自動化、ビジネスシステムとのシームレスな連携などの機能を実現します。

**ビジネスプロセス自動化**  
組織全体の手作業を排除します。データ入力の自動化、レポート生成、顧客問い合わせへの対応、コンテンツ作成ワークフローの効率化を実現します。

**データ処理と分析**  
生データを実用的な洞察に変換します。文書から情報を抽出し、データセット分析を実行し、自動レポートを生成し、プラットフォーム間でデータを同期します。

**API統合ワークフロー**  
複雑なマルチサービス間の相互作用をオーケストレーションします。統一されたAPIエンドポイントを作成し、高度なビジネスロジックを実装し、イベント駆動型の自動化システムを構築します。

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/chat-workflow.mp4" width={700} height={450} />
</div>

## 仕組み

**ビジュアルワークフローエディタ**  
直感的なドラッグ＆ドロップキャンバスを使用してワークフローを設計します。AIモデル、データベース、API、サードパーティサービスをビジュアルなノーコードインターフェースで接続し、複雑な自動化ロジックを理解しやすく、保守しやすくします。

**モジュラーブロックシステム**  
専門化されたコンポーネントで構築：処理ブロック（AIエージェント、API呼び出し、カスタム関数）、ロジックブロック（条件分岐、ループ、ルーター）、出力ブロック（レスポンス、評価器）。各ブロックはワークフロー内の特定のタスクを処理します。

**柔軟な実行トリガー**  
チャットインターフェース、REST API、ウェブフック、スケジュールされたcronジョブ、SlackやGitHubなどのプラットフォームからの外部イベントなど、複数のチャネルを通じてワークフローを起動できます。

**リアルタイムコラボレーション**  
チームが一緒に構築できるようにします。複数のユーザーがリアルタイム更新と詳細な権限コントロールにより、同時にワークフローを編集できます。

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/build-workflow.mp4" width={700} height={450} />
</div>

## 連携機能

Simは複数のカテゴリにわたる80以上のサービスとネイティブ連携を提供します：

- **AIモデル**: OpenAI、Anthropic、Google Gemini、Groq、Cerebras、OllamaやVLLM経由のローカルモデル
- **コミュニケーション**: Gmail、Slack、Microsoft Teams、Telegram、WhatsApp  
- **生産性**: Notion、Google Workspace、Airtable、Monday.com
- **開発**: GitHub、Jira、Linear、自動化されたブラウザテスト
- **検索とデータ**: Google検索、Perplexity、Firecrawl、Exa AI
- **データベース**: PostgreSQL、MySQL、Supabase、Pinecone、Qdrant

カスタム連携については、[MCP（Model Context Protocol）サポート](/mcp)を活用して、任意の外部サービスやツールに接続できます。

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/integrations-sidebar.mp4" width={700} height={450} />
</div>

## Copilot

**質問と指導を受ける**  
コパイロットはSimに関する質問に答え、ワークフローを説明し、改善のための提案を提供します。`@`記号を使用してワークフロー、ブロック、ドキュメント、ナレッジ、ログを参照し、文脈に応じたサポートを受けられます。

**ワークフローの構築と編集**  
エージェントモードに切り替えると、コパイロットが変更を提案し、キャンバスに直接適用できます。自然言語コマンドでブロックの追加、設定の構成、変数の接続、ワークフローの再構築が可能です。

**適応型推論レベル**  
タスクの複雑さに応じて、高速、自動、高度、または超大型モードから選択できます。簡単な質問には高速モードから始め、複雑なアーキテクチャの変更や深いデバッグには超大型モードにスケールアップします。

[コパイロット機能](/copilot)の詳細とAIアシスタンスで生産性を最大化する方法についてもっと学びましょう。

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="introduction/copilot-workflow.mp4" width={700} height={450} />
</div>

## デプロイメントオプション

**クラウドホスティング**  
[sim.ai](https://sim.ai)ですぐに開始できます。完全に管理されたインフラストラクチャ、自動スケーリング、組み込みの可観測性を備えています。運用は私たちが処理するので、ワークフローの構築に集中できます。

**セルフホスティング**  
Docker ComposeまたはKubernetesを使用して独自のインフラストラクチャにデプロイできます。Ollama連携を通じてローカルAIモデルをサポートし、データを完全に制御できます。

## 次のステップ

最初のAIワークフローを構築する準備はできましたか？

<Cards>
  <Card title="はじめに" href="/getting-started">
    10分で最初のワークフローを作成
  </Card>
  <Card title="ワークフローブロック" href="/blocks">
    構成要素について学ぶ
  </Card>
  <Card title="ツールと連携" href="/tools">
    80以上の組み込み連携を探索
  </Card>
  <Card title="チーム権限" href="/permissions/roles-and-permissions">
    ワークスペースの役割と権限を設定
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

````
