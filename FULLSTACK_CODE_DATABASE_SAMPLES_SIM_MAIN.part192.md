---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 192
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 192 of 933)

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

---[FILE: loop.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/loop.mdx

```text
---
title: ループ
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

ループブロックはブロックを繰り返し実行するコンテナです。コレクションを反復処理したり、固定回数の操作を繰り返したり、条件が満たされている間継続したりすることができます。

<Callout type="info">
  ループブロックは内部に他のブロックを保持するコンテナノードです。含まれるブロックは設定に基づいて複数回実行されます。
</Callout>

## 設定オプション

### ループタイプ

4種類のループから選択できます：

<Tabs items={['For ループ', 'ForEach ループ', 'While ループ', 'Do-While ループ']}>
  <Tab>
    **For ループ（反復回数）** - 固定回数実行する数値ループ：
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-1.png"
        alt="反復回数を使用したFor ループ"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    特定の回数だけ操作を繰り返す必要がある場合に使用します。
    

    ```
    Example: Run 5 times
    - Iteration 1
    - Iteration 2
    - Iteration 3
    - Iteration 4
    - Iteration 5
    ```

  </Tab>
  <Tab>
    **ForEach ループ（コレクション）** - 配列やオブジェクト内の各アイテムを反復処理するコレクションベースのループ：
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-2.png"
        alt="コレクションを使用したForEach ループ"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    アイテムのコレクションを処理する必要がある場合に使用します。
    

    ```
    Example: Process ["apple", "banana", "orange"]
    - Iteration 1: Process "apple"
    - Iteration 2: Process "banana"
    - Iteration 3: Process "orange"
    ```

  </Tab>
  <Tab>
    **While ループ（条件ベース）** - 条件が真と評価される間、実行を継続します：
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-3.png"
        alt="条件付きWhile ループ"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    特定の条件が満たされるまでループする必要がある場合に使用します。条件は各反復の**前に**チェックされます。

    ```
    Example: While {"<variable.i>"} < 10
    - Check condition → Execute if true
    - Inside loop: Increment {"<variable.i>"}
    - Inside loop: Variables assigns i = {"<variable.i>"} + 1
    - Check condition → Execute if true
    - Check condition → Exit if false
    ```

  </Tab>
  <Tab>
    **Do-While ループ（条件ベース）** - 少なくとも1回実行し、その後条件が真である間継続します：
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-4.png"
        alt="条件付きDo-While ループ"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    少なくとも1回実行し、その後条件が満たされるまでループする必要がある場合に使用します。条件は各反復の**後に**チェックされます。

    ```
    Example: Do-while {"<variable.i>"} < 10
    - Execute blocks
    - Inside loop: Increment {"<variable.i>"}
    - Inside loop: Variables assigns i = {"<variable.i>"} + 1
    - Check condition → Continue if true
    - Check condition → Exit if false
    ```

    少なくとも1回実行し、その後条件が満たされるまでループする必要がある場合に使用します。条件は各反復の**後に**チェックされます。

    ```
    Example: Do-While Loop
    - Execute first iteration
    - Check condition → Continue if true
    - Check condition → Exit if false
    ```

  </Tab>
</Tabs>

## ループの使い方

### ループの作成

1. ツールバーからループブロックをキャンバスにドラッグします
2. ループタイプとパラメータを設定します
3. 他のブロックをループコンテナ内にドラッグします
4. 必要に応じてブロックを接続します

### 結果へのアクセス

ループが完了すると、集計された結果にアクセスできます：

- **loop.results**: すべてのループ反復からの結果の配列

## 使用例

**API結果の処理** - ForEachループでAPIから取得した顧客レコードを処理

```javascript
// API結果を反復処理
forEach(customerRecord in apiResponse.data) {
  // 各顧客レコードを処理
  processCustomer(customerRecord);
  // 必要に応じてデータベースを更新
  updateDatabase(customerRecord.id, { processed: true });
}
```

**反復的なコンテンツ生成** - Forループで複数のコンテンツバリエーションを生成

```javascript
// 5つのコンテンツバリエーションを生成
for (let i = 0; i < 5; i++) {
  // 各バリエーションに異なるトーンを使用
  const tone = tones[i];
  // AIを使用してコンテンツを生成
  const content = generateContent(prompt, { tone: tone });
  // 結果を保存
  variations.push(content);
}
```

**Whileループによるカウンター** - Whileループでカウンターを使用してアイテムを処理

```javascript
// カウンターを初期化
let counter = 0;

// 条件が満たされるまで処理を続ける
while (counter < items.length && !foundTarget) {
  // 現在のアイテムを処理
  const result = processItem(items[counter]);
  
  // 目標が見つかったかチェック
  if (result.isTarget) {
    foundTarget = true;
  }
  
  // カウンターを増加
  counter++;
}
```

## 高度な機能

### 制限事項

<Callout type="warning">
  コンテナブロック（ループと並列）は互いに入れ子にすることができません。つまり：
  - ループブロックを別のループブロック内に配置することはできません
  - 並列ブロックをループブロック内に配置することはできません
  - どのコンテナブロックも別のコンテナブロック内に配置することはできません
  
  多次元反復が必要な場合は、順次ループを使用するか、データを段階的に処理するようにワークフローを再構成することを検討してください。
</Callout>

<Callout type="info">
  ループは並列ではなく順次実行されます。同時実行が必要な場合は、代わりに並列ブロックを使用してください。
</Callout>

## 入力と出力

<Tabs items={['設定', '変数', '結果']}>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>ループタイプ</strong>：'for'、'forEach'、'while'、または'doWhile'から選択
      </li>
      <li>
        <strong>反復回数</strong>：実行する回数（forループ）
      </li>
      <li>
        <strong>コレクション</strong>：反復処理する配列またはオブジェクト（forEachループ）
      </li>
      <li>
        <strong>条件</strong>：評価するブール式（while/do-whileループ）
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>loop.currentItem</strong>：現在処理中のアイテム
      </li>
      <li>
        <strong>loop.index</strong>：現在の反復番号（0ベース）
      </li>
      <li>
        <strong>loop.items</strong>：完全なコレクション（forEachループ）
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>loop.results</strong>：すべての反復結果の配列
      </li>
      <li>
        <strong>構造</strong>：結果は反復順序を維持
      </li>
      <li>
        <strong>アクセス</strong>：ループ後のブロックで利用可能
      </li>
    </ul>
  </Tab>
</Tabs>
```

--------------------------------------------------------------------------------

---[FILE: parallel.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/parallel.mdx

```text
---
title: 並列
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

並列ブロックは、より高速なワークフロー処理のために複数のインスタンスを同時に実行するコンテナです。順次ではなく同時にアイテムを処理します。

<Callout type="info">
  並列ブロックはコンテンツを同時に複数回実行するコンテナノードであり、順次実行するループとは異なります。
</Callout>

## 設定オプション

### 並列タイプ

並列実行の2つのタイプから選択できます：

<Tabs items={['Count-based', 'Collection-based']}>
  <Tab>
    **カウントベースの並列処理** - 固定数の並列インスタンスを実行します：
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/parallel-1.png"
        alt="カウントベースの並列実行"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    同じ操作を同時に複数回実行する必要がある場合に使用します。
    

    ```
    Example: Run 5 parallel instances
    - Instance 1 ┐
    - Instance 2 ├─ All execute simultaneously
    - Instance 3 │
    - Instance 4 │
    - Instance 5 ┘
    ```

  </Tab>
  <Tab>
    **コレクションベースの並列処理** - コレクションを並列インスタンス間で分散します：
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/parallel-2.png"
        alt="コレクションベースの並列実行"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    各インスタンスはコレクションから1つのアイテムを同時に処理します。
    

    ```
    Example: Process ["task1", "task2", "task3"] in parallel
    - Instance 1: Process "task1" ┐
    - Instance 2: Process "task2" ├─ All execute simultaneously
    - Instance 3: Process "task3" ┘
    ```

  </Tab>
</Tabs>

## 並列ブロックの使用方法

### 並列ブロックの作成

1. ツールバーから並列ブロックをキャンバスにドラッグします
2. 並列タイプとパラメータを設定します
3. 単一のブロックを並列コンテナ内にドラッグします
4. 必要に応じてブロックを接続します

### 結果へのアクセス

並列ブロックが完了すると、集約された結果にアクセスできます：

- **`<parallel.results>`**: すべての並列インスタンスからの結果の配列

## 使用例

**バッチAPI処理** - 複数のAPIコールを同時に処理する

```
Parallel (Collection) → API (Call Endpoint) → Function (Aggregate)
```

**マルチモデルAI処理** - 複数のAIモデルから同時にレスポンスを取得する

```
Parallel (["gpt-4o", "claude-3.7-sonnet", "gemini-2.5-pro"]) → Agent → Evaluator (Select Best)
```

## 高度な機能

### 結果の集約

すべての並列インスタンスからの結果は自動的に収集されます：

## 並列実行の仕組み

### インスタンス分離

各並列インスタンスは独立して実行されます：
- 個別の変数スコープ
- インスタンス間で状態を共有しない
- 一つのインスタンスの失敗が他に影響しない

### 制限事項

<Callout type="warning">
  コンテナブロック（ループと並列）は互いにネストできません。つまり：
  - 並列ブロック内にループブロックを配置できません
  - 並列ブロック内に別の並列ブロックを配置できません
  - どのコンテナブロック内にも別のコンテナブロックを配置できません
</Callout>

<Callout type="info">
  並列実行は高速ですが、以下の点に注意してください：
  - 同時リクエスト時のAPIレート制限
  - 大規模データセット使用時のメモリ使用量
  - リソース枯渇を防ぐための最大20の同時インスタンス
</Callout>

## 並列処理とループ処理の比較

それぞれの使用タイミングを理解する：

| 機能 | 並列処理 | ループ処理 |
|---------|----------|------|
| 実行方法 | 同時実行 | 順次実行 |
| 速度 | 独立した操作では高速 | 遅いが順序を保持 |
| 順序 | 順序保証なし | 順序を維持 |
| ユースケース | 独立した操作 | 依存関係のある操作 |
| リソース使用量 | 高い | 低い |

## 入力と出力

<Tabs items={['設定', '変数', '結果']}>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>並列タイプ</strong>：「カウント」または「コレクション」から選択
      </li>
      <li>
        <strong>カウント</strong>：実行するインスタンス数（カウントベース）
      </li>
      <li>
        <strong>コレクション</strong>：分散する配列またはオブジェクト（コレクションベース）
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>parallel.currentItem</strong>：このインスタンスのアイテム
      </li>
      <li>
        <strong>parallel.index</strong>：インスタンス番号（0から始まる）
      </li>
      <li>
        <strong>parallel.items</strong>：完全なコレクション（コレクションベース）
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>parallel.results</strong>：すべてのインスタンス結果の配列
      </li>
      <li>
        <strong>アクセス</strong>：並列処理後のブロックで利用可能
      </li>
    </ul>
  </Tab>
</Tabs>

## ベストプラクティス

- **独立した操作のみ**：操作が互いに依存しないようにする
- **レート制限の処理**：API使用が多いワークフローには遅延やスロットリングを追加
- **エラー処理**：各インスタンスは自身のエラーを適切に処理すべき
```

--------------------------------------------------------------------------------

---[FILE: response.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/response.mdx

```text
---
title: レスポンス
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

レスポンスブロックは、構造化されたHTTPレスポンスをフォーマットしてAPIコーラーに送り返します。適切なステータスコードとヘッダーを含むワークフローの結果を返すために使用します。

<div className="flex justify-center">
  <Image
    src="/static/blocks/response.png"
    alt="レスポンスブロックの設定"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout type="info">
  レスポンスブロックは終端ブロックです - ワークフローの実行を終了し、他のブロックに接続することはできません。
</Callout>

## 設定オプション

### レスポンスデータ

レスポンスデータは、APIコーラーに送り返される主要なコンテンツです。これはJSON形式でフォーマットされ、以下を含むことができます：

- 静的な値
- `<variable.name>` 構文を使用したワークフロー変数への動的参照
- ネストされたオブジェクトと配列
- 任意の有効なJSON構造

### ステータスコード

レスポンスのHTTPステータスコードを設定します（デフォルトは200）：

**成功 (2xx):**
- **200**: OK - 標準的な成功レスポンス
- **201**: Created - リソースが正常に作成された
- **204**: No Content - レスポンス本文のない成功

**クライアントエラー (4xx):**
- **400**: Bad Request - 無効なリクエストパラメータ
- **401**: Unauthorized - 認証が必要
- **404**: Not Found - リソースが存在しない
- **422**: Unprocessable Entity - バリデーションエラー

**サーバーエラー (5xx):**
- **500**: Internal Server Error - サーバー側のエラー
- **502**: Bad Gateway - 外部サービスのエラー
- **503**: Service Unavailable - サービスが一時的に利用不可

### レスポンスヘッダー

レスポンスに含める追加のHTTPヘッダーを設定します。

ヘッダーはキーと値のペアとして設定されます：

| キー | 値 |
|-----|-------|
| Content-Type | application/json |
| Cache-Control | no-cache |
| X-API-Version | 1.0 |

## 使用例

**APIエンドポイントレスポンス** - 検索APIから構造化データを返す

```
Agent (Search) → Function (Format & Paginate) → Response (200, JSON)
```

**Webhookの確認** - Webhookの受信と処理を確認する

```
Webhook Trigger → Function (Process) → Response (200, Confirmation)
```

**エラーレスポンス処理** - 適切なエラーレスポンスを返す

```
Condition (Error Detected) → Router → Response (400/500, Error Details)
```

## 出力

レスポンスブロックは終端的なものです - ワークフローの実行を終了し、HTTPレスポンスをAPI呼び出し元に送信します。下流のブロックに利用可能な出力はありません。

## 変数の参照

`<variable.name>` 構文を使用して、レスポンスにワークフロー変数を動的に挿入します：

```json
{
  "user": {
    "id": "<variable.userId>",
    "name": "<variable.userName>",
    "email": "<variable.userEmail>"
  },
  "query": "<variable.searchQuery>",
  "results": "<variable.searchResults>",
  "totalFound": "<variable.resultCount>",
  "processingTime": "<variable.executionTime>ms"
}
```

<Callout type="warning">
  変数名は大文字と小文字が区別され、ワークフローで利用可能な変数と完全に一致する必要があります。
</Callout>

## ベストプラクティス

- **意味のあるステータスコードを使用する**: ワークフローの結果を正確に反映する適切なHTTPステータスコードを選択する
- **レスポンスを一貫した構造にする**: より良い開発者体験のために、すべてのAPIエンドポイントで一貫したJSON構造を維持する
- **関連するメタデータを含める**: デバッグとモニタリングに役立つタイムスタンプとバージョン情報を追加する
- **エラーを適切に処理する**: ワークフローで条件付きロジックを使用して、説明的なメッセージを含む適切なエラーレスポンスを設定する
- **変数参照を検証する**: レスポンスブロックが実行される前に、参照されるすべての変数が存在し、予想されるデータ型を含んでいることを確認する
```

--------------------------------------------------------------------------------

---[FILE: router.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/router.mdx

```text
---
title: ルーター
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

ルーターブロックはAIを使用してコンテンツ分析に基づいてワークフローをインテリジェントにルーティングします。単純なルールを使用する条件ブロックとは異なり、ルーターはコンテキストと意図を理解します。

<div className="flex justify-center">
  <Image
    src="/static/blocks/router.png"
    alt="複数のパスを持つルーターブロック"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## ルーターと条件の比較

**ルーターを使用する場合：**
- AIを活用したコンテンツ分析が必要な時
- 非構造化または多様なコンテンツを扱う時
- 意図ベースのルーティングが必要な時（例：「サポートチケットを部門にルーティングする」）

**条件を使用する場合：**
- 単純なルールベースの判断で十分な時
- 構造化データや数値比較を扱う時
- 高速で決定論的なルーティングが必要な時

## 設定オプション

### コンテンツ/プロンプト

ルーターがルーティング判断を行うために分析するコンテンツまたはプロンプト。これには以下が含まれます：

- ユーザーからの直接的な質問や入力
- 前のブロックからの出力
- システム生成メッセージ

### ターゲットブロック

ルーターが選択できる可能な宛先ブロック。ルーターは接続されたブロックを自動的に検出しますが、以下のこともできます：

- ルーティング精度を向上させるためにターゲットブロックの説明をカスタマイズする
- 各ターゲットブロックのルーティング基準を指定する
- 特定のブロックをルーティングターゲットとして考慮から除外する

### モデル選択

ルーティング判断を行うAIモデルを選択します：

- **OpenAI**: GPT-4o、o1、o3、o4-mini、gpt-4.1
- **Anthropic**: Claude 3.7 Sonnet
- **Google**: Gemini 2.5 Pro、Gemini 2.0 Flash
- **Other Providers**: Groq、Cerebras、xAI、DeepSeek
- **Local Models**: OllamaまたはVLLM互換モデル

最良の結果を得るには、GPT-4oやClaude 3.7 Sonnetなど、強力な推論能力を持つモデルを使用してください。

### APIキー

選択したLLMプロバイダーのAPIキー。これは安全に保存され、認証に使用されます。

## 出力

- **`<router.prompt>`**: ルーティングプロンプトの要約
- **`<router.selected_path>`**: 選択された宛先ブロック
- **`<router.tokens>`**: トークン使用統計
- **`<router.cost>`**: 推定ルーティングコスト
- **`<router.model>`**: 意思決定に使用されるモデル

## 使用例

**カスタマーサポートの振り分け** - チケットを専門部署にルーティング

```
Input (Ticket) → Router → Agent (Engineering) or Agent (Finance)
```

**コンテンツ分類** - ユーザー生成コンテンツを分類しルーティング

```
Input (Feedback) → Router → Workflow (Product) or Workflow (Technical)
```

**リード資格評価** - 資格基準に基づいてリードをルーティング

```
Input (Lead) → Router → Agent (Enterprise Sales) or Workflow (Self-serve)
```

## ベストプラクティス

- **明確な対象の説明を提供する**: 具体的で詳細な説明で、各宛先をいつ選択すべきかをルーターが理解できるようにする
- **具体的なルーティング基準を使用する**: 各経路に明確な条件と例を定義して精度を向上させる
- **フォールバックパスを実装する**: 特定の経路が適切でない場合のデフォルトの宛先を接続する
- **多様な入力でテストする**: ルーターが様々な入力タイプ、エッジケース、予期しないコンテンツを処理できることを確認する
- **ルーティングパフォーマンスを監視する**: ルーティングの決定を定期的に確認し、実際の使用パターンに基づいて基準を改善する
- **適切なモデルを選択する**: 複雑なルーティング決定には強力な推論能力を持つモデルを使用する
```

--------------------------------------------------------------------------------

---[FILE: variables.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/variables.mdx

```text
---
title: 変数
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Image } from '@/components/ui/image'

変数ブロックは実行中にワークフロー変数を更新します。変数はまずワークフローの変数セクションで初期化する必要があり、その後このブロックを使用してワークフロー実行中に値を更新できます。

<div className="flex justify-center">
  <Image
    src="/static/blocks/variables.png"
    alt="変数ブロック"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<Callout>
  ワークフロー内のどこからでも `<variable.variableName>` 構文を使用して変数にアクセスできます。
</Callout>

## 変数の使い方

### 1. ワークフロー変数で初期化する

まず、ワークフローの変数セクション（ワークフロー設定からアクセス可能）で変数を作成します：

```
customerEmail = ""
retryCount = 0
currentStatus = "pending"
```

### 2. 変数ブロックで更新する

実行中に値を更新するには、変数ブロックを使用します：

```
customerEmail = <api.email>
retryCount = <variable.retryCount> + 1
currentStatus = "processing"
```

### 3. どこからでもアクセスする

任意のブロックで変数を参照できます：

```
Agent prompt: "Send email to <variable.customerEmail>"
Condition: <variable.retryCount> < 5
API body: {"status": "<variable.currentStatus>"}
```

## 使用例

**ループカウンターと状態** - 繰り返し処理の進行状況を追跡する

```
Loop → Agent (Process) → Variables (itemsProcessed + 1) → Variables (Store lastResult)
```

**リトライロジック** - APIリトライ試行回数を追跡する

```
API (Try) → Variables (retryCount + 1) → Condition (retryCount < 3)
```

**動的設定** - ワークフロー用のユーザーコンテキストを保存する

```
API (Fetch Profile) → Variables (userId, userTier) → Agent (Personalize)
```

## 出力

- **`<variables.assignments>`**: このブロックからのすべての変数割り当てを含むJSONオブジェクト

## ベストプラクティス

- **ワークフロー設定で初期化する**: 変数を使用する前に、必ずワークフローの変数セクションで作成してください
- **動的に更新する**: ブロック出力や計算に基づいて値を更新するには、変数ブロックを使用してください
- **ループで使用する**: 繰り返し処理間で状態を追跡するのに最適です
- **わかりやすい名前を付ける**: `currentIndex`、`totalProcessed`、または`lastError`のような明確な名前を使用してください
```

--------------------------------------------------------------------------------

---[FILE: wait.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/wait.mdx

```text
---
title: 待機
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Image } from '@/components/ui/image'

待機ブロックは、次のブロックに進む前に指定された時間だけワークフローを一時停止します。アクション間に遅延を追加したり、APIレート制限を尊重したり、操作の間隔を空けたりするために使用します。

<div className="flex justify-center">
  <Image
    src="/static/blocks/wait.png"
    alt="待機ブロック"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 設定

### 待機時間

実行を一時停止する時間を入力してください：
- **入力値**：正の数
- **最大値**：600秒（10分）または10分

### 単位

時間単位を選択してください：
- **秒**：短く正確な遅延に
- **分**：長めの一時停止に

<Callout type="info">
  待機ブロックはワークフローを停止することでキャンセルできます。最大待機時間は10分です。
</Callout>

## 出力

- **`<wait.waitDuration>`**: ミリ秒単位の待機時間
- **`<wait.status>`**: 待機のステータス（'waiting'、'completed'、または'cancelled'）

## 使用例

**APIレート制限** - リクエスト間でAPIレート制限内に留まる

```
API (Request 1) → Wait (2s) → API (Request 2)
```

**タイムド通知** - 遅延後にフォローアップメッセージを送信

```
Function (Send Email) → Wait (5min) → Function (Follow-up)
```

**処理遅延** - 外部システムが処理を完了するまで待機

```
API (Trigger Job) → Wait (30s) → API (Check Status)
```

## ベストプラクティス

- **適切な待機時間を設定する**：最大10分までの遅延には待機機能を使用してください。より長い遅延にはスケジュールされたワークフローを検討してください
- **実行時間を監視する**：待機はワークフローの合計実行時間を延長することを忘れないでください
```

--------------------------------------------------------------------------------

---[FILE: workflow.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/workflow.mdx

```text
---
title: ワークフローブロック
description: 現在のフロー内で別のワークフローを実行する
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

## 機能

<div className='flex justify-center my-6'>
  <Image
    src='/static/blocks/workflow.png'
    alt='ワークフローブロックの設定'
    width={500}
    height={400}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

より大きなフローの一部として子ワークフローを呼び出したい場合は、ワークフローブロックをドロップします。このブロックは、そのワークフローの最新デプロイバージョンを実行し、完了するまで待機してから、親ワークフローを続行します。

## 設定方法

1. **ワークフローを選択** ドロップダウンから選びます（ループを防ぐため自己参照はブロックされています）。
2. **入力のマッピング**: 子ワークフローに入力フォームトリガーがある場合、各フィールドが表示され、親変数を接続できます。マッピングされた値が子ワークフローが受け取る内容になります。

<div className='flex justify-center my-6'>
  <Image
    src='/static/blocks/workflow-2.png'
    alt='入力マッピング例を示すワークフローブロック'
    width={700}
    height={400}
    className='rounded-xl border border-border shadow-sm'
  />
</div>

3. **出力**: 子ワークフローが完了すると、ブロックは以下を公開します：
   - `result` – 子ワークフローの最終応答
   - `success` – エラーなく実行されたかどうか
   - `error` – 実行が失敗した場合のメッセージ

## デプロイメントステータスバッジ

ワークフローブロックは、子ワークフローが実行準備ができているかどうかを追跡するのに役立つデプロイメントステータスバッジを表示します：

- **デプロイ済み** – 子ワークフローがデプロイされ、使用準備ができています。ブロックは現在デプロイされているバージョンを実行します。
- **未デプロイ** – 子ワークフローが一度もデプロイされていません。ワークフローブロックが実行する前にデプロイする必要があります。
- **再デプロイ** – 最後のデプロイ以降、子ワークフローに変更が検出されました。バッジをクリックして、最新の変更で子ワークフローを再デプロイしてください。

<Callout type="warn">
ワークフローブロックは常に子ワークフローの最新デプロイバージョンを実行し、エディタバージョンではありません。変更を加えた後は必ず再デプロイして、ブロックが最新のロジックを使用するようにしてください。
</Callout>

## 実行に関する注意事項

- 子ワークフローは同じワークスペースコンテキストで実行されるため、環境変数やツールは引き継がれます。
- ブロックはデプロイメントバージョン管理を使用します：API、スケジュール、ウェブフック、手動、またはチャット実行はすべてデプロイされたスナップショットを呼び出します。子ワークフローを変更した場合は再デプロイしてください。
- 子ワークフローが失敗した場合、下流で処理しない限り、ブロックはエラーを発生させます。

<Callout>
子ワークフローは焦点を絞ったものにしましょう。小さく再利用可能なフローは、深いネストを作成せずに組み合わせやすくなります。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: basics.mdx]---
Location: sim-main/apps/docs/content/docs/ja/connections/basics.mdx

```text
---
title: 基本
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Video } from '@/components/ui/video'

## 接続の仕組み

接続はワークフロー内のブロック間でデータが流れるための経路です。Simでは、接続によってある情報があるブロックから別のブロックへどのように渡されるかが定義され、ワークフロー全体でのデータの流れが可能になります。

<Callout type="info">
  各接続は、データがソースブロックの出力から宛先ブロックの入力へと流れる方向性のある関係を表します。
</Callout>

### 接続の作成

<Steps>
  <Step>
    <strong>ソースブロックの選択</strong>: 接続元となるブロックの出力ポートをクリックします
  </Step>
  <Step>
    <strong>接続の描画</strong>: 宛先ブロックの入力ポートまでドラッグします
  </Step>
  <Step>
    <strong>接続の確定</strong>: マウスを離して接続を作成します
  </Step>
</Steps>

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="connections-build.mp4" width={700} height={450} />
</div>

### 接続フロー

接続を通じたデータの流れは、以下の原則に従います：

1. **方向性のある流れ**：データは常に出力から入力へと流れます
2. **実行順序**：ブロックは接続に基づいて順番に実行されます
3. **データ変換**：データはブロック間を移動する際に変換される場合があります
4. **条件付きパス**：一部のブロック（ルーターや条件など）は異なるパスにフローを誘導できます

<Callout type="warning">
  接続を削除すると、ブロック間のデータフローが即座に停止します。接続を削除する前に、これが意図した操作であることを確認してください。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: data-structure.mdx]---
Location: sim-main/apps/docs/content/docs/ja/connections/data-structure.mdx

```text
---
title: データ構造
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

ブロックを接続する際、異なるブロック出力のデータ構造を理解することが重要です。なぜなら、ソースブロックからの出力データ構造によって、宛先ブロックで利用可能な値が決まるからです。各ブロックタイプは、下流のブロックで参照できる特定の出力構造を生成します。

<Callout type="info">
  これらのデータ構造を理解することは、接続タグを効果的に使用し、ワークフローで正しいデータにアクセスするために不可欠です。
</Callout>

## ブロック出力構造

ブロックタイプによって、異なる出力構造が生成されます。各ブロックタイプから期待できる出力は次のとおりです：

<Tabs items={['Agent Output', 'API Output', 'Function Output', 'Evaluator Output', 'Condition Output', 'Router Output']}>
  <Tab>

    ```json
    {
      "content": "The generated text response",
      "model": "gpt-4o",
      "tokens": {
        "prompt": 120,
        "completion": 85,
        "total": 205
      },
      "toolCalls": [...],
      "cost": [...],
      "usage": [...]
    }
    ```

    ### エージェントブロックの出力フィールド

    - **content**: エージェントによって生成されたメインテキスト応答
    - **model**: 使用されたAIモデル（例：「gpt-4o」、「claude-3-opus」）
    - **tokens**: トークン使用統計
      - **prompt**: プロンプトのトークン数
      - **completion**: 完了のトークン数
      - **total**: 使用された合計トークン数
    - **toolCalls**: エージェントによって行われたツールコールの配列（存在する場合）
    - **cost**: 各ツールコールのコストオブジェクトの配列（存在する場合）
    - **usage**: 応答全体のトークン使用統計

  </Tab>
  <Tab>

    ```json
    {
      "data": "Response data",
      "status": 200,
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache"
      }
    }
    ```

    ### APIブロックの出力フィールド

    - **data**: APIからのレスポンスデータ（任意の型）
    - **status**: レスポンスのHTTPステータスコード
    - **headers**: APIから返されたHTTPヘッダー

  </Tab>
  <Tab>

    ```json
    {
      "result": "Function return value",
      "stdout": "Console output",
    }
    ```

    ### 関数ブロックの出力フィールド

    - **result**: 関数の戻り値（任意の型）
    - **stdout**: 関数実行中にキャプチャされたコンソール出力

  </Tab>
  <Tab>

    ```json
    {
      "content": "Evaluation summary",
      "model": "gpt-5",
      "tokens": {
        "prompt": 120,
        "completion": 85,
        "total": 205
      },
      "metric1": 8.5,
      "metric2": 7.2,
      "metric3": 9.0
    }
    ```

    ### 評価ブロックの出力フィールド

    - **content**: 評価の要約
    - **model**: 評価に使用されたAIモデル
    - **tokens**: トークン使用統計
    - **[metricName]**: 評価者で定義された各メトリックのスコア（動的フィールド）

  </Tab>
  <Tab>

    ```json
    {
      "conditionResult": true,
      "selectedPath": {
        "blockId": "2acd9007-27e8-4510-a487-73d3b825e7c1",
        "blockType": "agent",
        "blockTitle": "Follow-up Agent"
      },
      "selectedOption": "condition-1"
    }
    ```

    ### 条件ブロックの出力フィールド

    - **conditionResult**: 条件評価の真偽値結果
    - **selectedPath**: 選択されたパスに関する情報
      - **blockId**: 選択されたパスの次のブロックのID
      - **blockType**: 次のブロックのタイプ
      - **blockTitle**: 次のブロックのタイトル
    - **selectedOption**: 選択された条件のID

  </Tab>
  <Tab>

    ```json
    {
      "content": "Routing decision",
      "model": "gpt-4o",
      "tokens": {
        "prompt": 120,
        "completion": 85,
        "total": 205
      },
      "selectedPath": {
        "blockId": "2acd9007-27e8-4510-a487-73d3b825e7c1",
        "blockType": "agent",
        "blockTitle": "Customer Service Agent"
      }
    }
    ```

    ### ルーターブロックの出力フィールド

    - **content**: ルーティング決定テキスト
    - **model**: ルーティングに使用されたAIモデル
    - **tokens**: トークン使用統計
    - **selectedPath**: 選択されたパスに関する情報
      - **blockId**: 選択された宛先ブロックのID
      - **blockType**: 選択されたブロックのタイプ
      - **blockTitle**: 選択されたブロックのタイトル

  </Tab>
</Tabs>

## カスタム出力構造

一部のブロックでは、その設定に基づいてカスタム出力構造を生成することがあります：

1. **レスポンスフォーマットを持つエージェントブロック**: エージェントブロックでレスポンスフォーマットを使用する場合、出力構造は標準構造ではなく、定義されたスキーマに一致します。

2. **関数ブロック**: `result` フィールドには、関数コードから返される任意のデータ構造が含まれます。

3. **APIブロック**: `data` フィールドには、APIが返す任意の有効なJSON構造が含まれます。

<Callout type="warning">
  開発中は常にブロックの実際の出力構造を確認し、接続で正しいフィールドを参照していることを確認してください。
</Callout>

## ネストされたデータ構造

多くのブロック出力にはネストされたデータ構造が含まれています。これらにはドット表記を使用して接続タグでアクセスできます：

```
<blockName.path.to.nested.data>
```

例えば：

- `<agent1.tokens.total>` - エージェントブロックから合計トークン数にアクセス
- `<api1.data.results[0].id>` - APIレスポンスの最初の結果のIDにアクセス
- `<function1.result.calculations.total>` - 関数ブロックの結果内のネストされたフィールドにアクセス
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/ja/connections/index.mdx

```text
---
title: 概要
description: ブロック同士を接続します。
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { ConnectIcon } from '@/components/icons'
import { Video } from '@/components/ui/video'

接続は、ワークフロー内のブロック間でデータが流れるための経路です。情報があるブロックから別のブロックへどのように渡されるかを定義し、複雑な多段階プロセスを作成することができます。

<Callout type="info">
  適切に設定された接続は、効果的なワークフローを作成するために不可欠です。接続によって、
  データがシステム内をどのように移動し、ブロック同士がどのように相互作用するかが決まります。
</Callout>

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="connections.mp4" />
</div>

## 接続タイプ

Simは様々なワークフローパターンを可能にする異なるタイプの接続をサポートしています：

<Cards>
  <Card title="接続の基本" href="/connections/basics">
    接続の仕組みとワークフローでの作成方法を学ぶ
  </Card>
  <Card title="接続タグ" href="/connections/tags">
    ブロック間でデータを参照するための接続タグの使い方を理解する
  </Card>
  <Card title="データ構造" href="/connections/data-structure">
    異なるブロックタイプの出力データ構造を探る
  </Card>
  <Card title="データへのアクセス" href="/connections/accessing-data">
    接続されたデータへのアクセスと操作のテクニックを学ぶ
  </Card>
  <Card title="ベストプラクティス" href="/connections/best-practices">
    効果的な接続管理のための推奨パターンに従う
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: tags.mdx]---
Location: sim-main/apps/docs/content/docs/ja/connections/tags.mdx

```text
---
title: タグ
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Video } from '@/components/ui/video'

接続タグは、接続されたブロックから利用可能なデータを視覚的に表現するもので、ブロック間のデータ参照やワークフロー内の前のブロックからの出力を簡単に参照する方法を提供します。

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="connections.mp4" />
</div>

### 接続タグとは？

接続タグは、ブロックが接続されたときに表示されるインタラクティブな要素です。これらは、あるブロックから別のブロックへ流れるデータを表現し、以下のことを可能にします：

- ソースブロックから利用可能なデータを視覚化する
- 宛先ブロックで特定のデータフィールドを参照する
- ブロック間の動的なデータフローを作成する

<Callout type="info">
  接続タグを使用すると、複雑なデータ構造を覚える必要なく、前のブロックから利用可能なデータを簡単に確認し、
  現在のブロックで使用することができます。
</Callout>

## 接続タグの使用方法

ワークフローで接続タグを使用する主な方法は2つあります：

<div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-2">
  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
    <h3 className="mb-2 text-lg font-medium">ドラッグ＆ドロップ</h3>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      接続タグをクリックして宛先ブロックの入力フィールドにドラッグします。利用可能な値を示すドロップダウンが
      表示されます。
    </div>
    <ol className="mt-2 list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400">
      <li>接続タグにカーソルを合わせると利用可能なデータが表示されます</li>
      <li>タグをクリックして入力フィールドにドラッグします</li>
      <li>ドロップダウンから特定のデータフィールドを選択します</li>
      <li>参照が自動的に挿入されます</li>
    </ol>
  </div>

  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
    <h3 className="mb-2 text-lg font-medium">山括弧構文</h3>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      入力フィールドに <code>&lt;&gt;</code> と入力すると、前のブロックから利用可能な接続値のドロップダウンが表示されます。
    </div>
    <ol className="mt-2 list-decimal pl-5 text-sm text-gray-600 dark:text-gray-400">
      <li>接続データを使用したい入力フィールドをクリックします</li>
      <li>
        <code>&lt;&gt;</code> と入力して接続ドロップダウンを表示させます
      </li>
      <li>参照したいデータを閲覧して選択します</li>
      <li>入力を続けるか、ドロップダウンから選択して参照を完了します</li>
    </ol>
  </div>
</div>

## タグの構文

接続タグはデータを参照するためのシンプルな構文を使用します：

```
<blockName.path.to.data>
```

ここで：

- `blockName` はソースブロックの名前
- `path.to.data` は特定のデータフィールドへのパス

例えば：

- `<agent1.content>` - ID「agent1」を持つブロックからコンテンツフィールドを参照
- `<api2.data.users[0].name>` - ID「api2」を持つブロックのデータフィールドからユーザー配列の最初のユーザーの名前を参照

## 動的タグ参照

接続タグは実行時に評価されるため：

1. 常に最新のデータを参照します
2. 式で使用したり、静的テキストと組み合わせたりできます
3. 他のデータ構造内にネストできます

### 例

```javascript
// Reference in text
"The user's name is <userBlock.name>"

// Reference in JSON
{
  "userName": "<userBlock.name>",
  "orderTotal": <apiBlock.data.total>
}

// Reference in code
const greeting = "Hello, <userBlock.name>!";
const total = <apiBlock.data.total> * 1.1; // Add 10% tax
```

<Callout type="warning">
  数値コンテキストで接続タグを使用する場合は、型変換の問題を避けるために、参照されるデータが実際に数値であることを確認してください。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/ja/copilot/index.mdx

```text
---
title: Copilot
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'
import { MessageCircle, Package, Zap, Infinity as InfinityIcon, Brain, BrainCircuit } from 'lucide-react'

Copilotはエディター内のアシスタントで、Sim Copilotを使用してワークフローの構築や編集を支援し、それらを理解して改善するのに役立ちます。以下のことができます：

- **説明**: Simや現在のワークフローに関する質問に回答
- **ガイド**: 編集の提案やベストプラクティスの提示
- **編集**: 承認後にブロック、接続、設定の変更を実行

<Callout type="info">
  CopilotはSimが管理するサービスです。セルフホスト型のデプロイメントでは、ホスト型アプリ（sim.ai → 設定 → Copilot）でCopilot APIキーを生成してください
  1. [sim.ai](https://sim.ai) → 設定 → Copilotに移動し、Copilot APIキーを生成
  2. セルフホスト環境の `COPILOT_API_KEY` にその値を設定
</Callout>

## コンテキストメニュー (@)

`@` 記号を使用して、さまざまなリソースを参照し、ワークスペースについてCopilotにより多くのコンテキストを提供できます：

<Image
  src="/static/copilot/copilot-menu.png"
  alt="利用可能な参照オプションを表示するCopilotコンテキストメニュー"
  width={600}
  height={400}
/>

`@` メニューから以下にアクセスできます：
- **チャット**: 以前のCopilotの会話を参照
- **すべてのワークフロー**: ワークスペース内の任意のワークフローを参照
- **ワークフローブロック**: ワークフローの特定のブロックを参照
- **ブロック**: ブロックタイプとテンプレートを参照
- **ナレッジ**: アップロードした文書やナレッジベースを参照
- **ドキュメント**: Simのドキュメントを参照
- **テンプレート**: ワークフローテンプレートを参照
- **ログ**: 実行ログと結果を参照

このコンテキスト情報は、Copilotがあなたの特定のユースケースに対してより正確で関連性の高い支援を提供するのに役立ちます。

## モード

<Cards>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        質問
      </span>
    }
  >
    <div className="m-0 text-sm">
      ワークフローに変更を加えずに、説明、ガイダンス、提案を行うQ&Aモード。
    </div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        エージェント
      </span>
    }
  >
    <div className="m-0 text-sm">
      構築・編集モード。Copilotが特定の編集（ブロックの追加、変数の接続、設定の調整）を提案し、承認後に適用します。
    </div>
  </Card>
</Cards>

<div className="flex justify-center">
  <Image
    src="/static/copilot/copilot-mode.png"
    alt="Copilotモード選択インターフェース"
    width={600}
    height={400}
    className="my-6"
  />
</div>

## 深度レベル

<Cards>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Zap className="h-4 w-4 text-muted-foreground" />
        高速
      </span>
    }
  >
    <div className="m-0 text-sm">最も速く、最も安価です。小さな編集、シンプルなワークフロー、軽微な調整に最適です。</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <InfinityIcon className="h-4 w-4 text-muted-foreground" />
        自動
      </span>
    }
  >
    <div className="m-0 text-sm">速度と推論のバランスが取れています。ほとんどのタスクに推奨されるデフォルト設定です。</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <Brain className="h-4 w-4 text-muted-foreground" />
        高度
      </span>
    }
  >
    <div className="m-0 text-sm">パフォーマンスを維持しながら、より大きなワークフローや複雑な編集のためのより深い推論を提供します。</div>
  </Card>
  <Card
    title={
      <span className="inline-flex items-center gap-2">
        <BrainCircuit className="h-4 w-4 text-muted-foreground" />
        ビヘモス
      </span>
    }
  >
    <div className="m-0 text-sm">詳細な計画、デバッグ、複雑なアーキテクチャ変更のための最大限の推論能力を提供します。</div>
  </Card>
</Cards>

### モード選択インターフェース

Copilotインターフェースのモードセレクターを使用して、異なる推論モード間を簡単に切り替えることができます：

<Image
  src="/static/copilot/copilot-models.png"
  alt="MAXトグル付きの高度モードを表示するCopilotモード選択"
  width={600}
  height={300}
/>

このインターフェースでは以下のことが可能です：
- **推論レベルの選択**：高速、自動、高度、またはビヘモスから選択
- **MAXモードの有効化**：最も徹底的な分析が必要な場合に最大限の推論能力を切り替え
- **モードの説明を確認**：各モードが最適化されている用途を理解

タスクの複雑さに基づいてモードを選択してください - 簡単な質問には高速モードを、複雑なアーキテクチャ変更にはビヘモスモードを使用します。

## 課金とコスト計算

### コストの計算方法

Copilotの使用料金は、基盤となるLLMからのトークンごとに請求されます：

- **入力トークン**：プロバイダーの基本料金で請求（**原価**）
- **出力トークン**：プロバイダーの基本出力料金の**1.5倍**で請求

```javascript
copilotCost = (inputTokens × inputPrice + outputTokens × (outputPrice × 1.5)) / 1,000,000
```

| コンポーネント | 適用される料金         |
|----------|----------------------|
| 入力    | inputPrice           |
| 出力   | outputPrice × 1.5    |

<Callout type="warning">
  表示価格は2025年9月4日時点のものです。最新の価格については、プロバイダーのドキュメントをご確認ください。
</Callout>

<Callout type="info">
  モデル価格は100万トークンあたりの料金です。実際のコストを算出するには1,000,000で割ります。背景と例については<a href="/execution/costs">コスト計算ページ</a>をご覧ください。
</Callout>
```

--------------------------------------------------------------------------------

````
