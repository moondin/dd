---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 220
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 220 of 933)

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

---[FILE: webhook.mdx]---
Location: sim-main/apps/docs/content/docs/ja/triggers/webhook.mdx

```text
---
title: Webhooks
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Webhookを使用すると、外部サービスがHTTPリクエストを送信してワークフローの実行をトリガーできます。Simはwebhookベースのトリガーに対して2つのアプローチをサポートしています。

## 汎用Webhookトリガー

汎用Webhookブロックは、あらゆるペイロードを受信してワークフローをトリガーできる柔軟なエンドポイントを作成します：

<div className="flex justify-center">
  <Image
    src="/static/blocks/webhook.png"
    alt="汎用Webhook設定"
    width={500}
    height={400}
    className="my-6"
  />
</div>

### 仕組み

1. **汎用Webhookブロックを追加** - 汎用Webhookブロックをドラッグしてワークフローを開始
2. **ペイロードの設定** - 予想されるペイロード構造を設定（任意）
3. **Webhook URLの取得** - 自動生成されたユニークなエンドポイントをコピー
4. **外部統合** - 外部サービスがこのURLにPOSTリクエストを送信するよう設定
5. **ワークフロー実行** - webhook URLへのリクエストごとにワークフローがトリガーされる

### 機能

- **柔軟なペイロード**：あらゆるJSON形式のペイロード構造を受け入れる
- **自動解析**：webhookデータは自動的に解析され、後続のブロックで利用可能
- **認証**：オプションのベアラートークンまたはカスタムヘッダー認証
- **レート制限**：乱用に対する組み込み保護
- **重複排除**：繰り返しリクエストからの重複実行を防止

<Callout type="info">
汎用Webhookトリガーは、webhook URLがリクエストを受信するたびに起動するため、リアルタイム統合に最適です。
</Callout>

## サービスブロックのトリガーモード

あるいは、特定のサービスブロック（SlackやGitHubなど）を「トリガーモード」で使用して、より専門的なwebhookエンドポイントを作成することもできます：

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="slack-trigger.mp4" width={700} height={450} />
</div>

### トリガーモードの設定

1. **サービスブロックを追加する** - サービスブロックを選択します（例：Slack、GitHub、Airtable）
2. **トリガーモードを有効にする** - ブロック設定で「トリガーとして使用」をオンにします
3. **サービスを設定する** - そのサービス特有の認証とイベントフィルターを設定します
4. **Webhookの登録** - サービスは自動的に外部プラットフォームにWebhookを登録します
5. **イベントベースの実行** - ワークフローはそのサービスからの特定のイベントに対してのみトリガーされます

### 各アプローチの使用タイミング

**汎用Webhookを使用する場合：**
- カスタムアプリケーションやサービスと統合する場合
- ペイロード構造に最大限の柔軟性が必要な場合
- 専用ブロックがないサービスと連携する場合
- 内部統合を構築する場合

**トリガーモードを使用する場合：**
- サポートされているサービス（Slack、GitHubなど）を使用する場合
- サービス固有のイベントフィルタリングが必要な場合
- 自動Webhook登録が必要な場合
- そのサービスの構造化されたデータ処理が必要な場合

## トリガーモードをサポートするサービス

**開発とプロジェクト管理**
- GitHub - 課題、PR、プッシュ、リリース、ワークフロー実行
- Jira - 課題イベント、作業ログ
- Linear - 課題、コメント、プロジェクト、サイクル、ラベル

**コミュニケーション**
- Slack - メッセージ、メンション、リアクション
- Microsoft Teams - チャットメッセージ、チャンネル通知
- Telegram - ボットメッセージ、コマンド
- WhatsApp - メッセージングイベント

**メール**
- Gmail - 新着メール（ポーリング）、ラベル変更
- Outlook - 新着メール（ポーリング）、フォルダーイベント

**CRMと営業**
- HubSpot - 連絡先、企業、取引、チケット、会話
- Stripe - 支払い、サブスクリプション、顧客

**フォームとアンケート**
- Typeform - フォーム送信
- Google Forms - フォーム回答
- Webflow - コレクションアイテム、フォーム送信

**その他**
- Airtable - レコード変更
- Twilio Voice - 着信、通話状態

## セキュリティとベストプラクティス

### 認証オプション

- **Bearerトークン**: `Authorization: Bearer <token>` ヘッダーを含める
- **カスタムヘッダー**: カスタム認証ヘッダーを定義する

### ペイロード処理

- **検証**: 不正な形式のデータを防ぐために受信ペイロードを検証する
- **サイズ制限**: Webhookにはセキュリティのためのペイロードサイズ制限がある
- **エラー処理**: 無効なリクエストに対するエラー応答を設定する

### Webhookのテスト

1. Postmanやcurlなどのツールを使用してWebhookエンドポイントをテストする
2. デバッグのためにワークフロー実行ログを確認する
3. ペイロード構造が期待通りであることを確認する
4. 認証とエラーシナリオをテストする

<Callout type="warning">
受信したWebhookデータは、ワークフローで処理する前に必ず検証とサニタイズを行ってください。
</Callout>

## 一般的なユースケース

### リアルタイム通知
- 自動応答をトリガーするSlackメッセージ
- 重要なイベントに対するメール通知

### CI/CD 統合  
- GitHub プッシュによるデプロイメントワークフローのトリガー
- ビルドステータスの更新
- 自動テストパイプライン

### データ同期
- Airtable の変更による他システムの更新
- フォーム送信によるフォローアップアクションのトリガー
- Eコマース注文処理

### カスタマーサポート
- サポートチケット作成ワークフロー
- 自動エスカレーションプロセス
- マルチチャネルコミュニケーションルーティング
```

--------------------------------------------------------------------------------

---[FILE: environment-variables.mdx]---
Location: sim-main/apps/docs/content/docs/ja/variables/environment-variables.mdx

```text
---
title: 環境変数
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

環境変数は、APIキーやワークフローがアクセスする必要のあるその他の機密データなど、ワークフロー全体で設定値や機密情報を安全に管理する方法を提供します。これにより、実行中にそれらを利用可能にしながら、ワークフロー定義から機密情報を切り離すことができます。

## 変数タイプ

Simの環境変数は2つのレベルで機能します：

- **個人環境変数**：あなたのアカウントに限定され、あなただけが閲覧・使用できます
- **ワークスペース環境変数**：ワークスペース全体で共有され、すべてのチームメンバーが利用できます

<Callout type="info">
名前の競合がある場合、ワークスペース環境変数は個人環境変数よりも優先されます。
</Callout>

## 環境変数の設定

設定に移動して環境変数を構成します：

<Image
  src="/static/environment/environment-1.png"
  alt="新しい変数を作成するための環境変数モーダル"
  width={500}
  height={350}
/>

ワークスペース設定から、個人レベルとワークスペースレベルの両方の環境変数を作成・管理できます。個人変数はあなたのアカウントに限定されますが、ワークスペース変数はすべてのチームメンバーと共有されます。

### 変数をワークスペーススコープにする

ワークスペーススコープトグルを使用して、変数をチーム全体で利用可能にします：

<Image
  src="/static/environment/environment-2.png"
  alt="環境変数のワークスペーススコープを切り替えるトグル"
  width={500}
  height={350}
/>

ワークスペーススコープを有効にすると、その変数はすべてのワークスペースメンバーが利用でき、そのワークスペース内のあらゆるワークフローで使用できるようになります。

### ワークスペース変数ビュー

ワークスペーススコープの変数を作成すると、環境変数リストに表示されます：

<Image
  src="/static/environment/environment-3.png"
  alt="環境変数リスト内のワークスペーススコープ変数"
  width={500}
  height={350}
/>

## ワークフローでの変数の使用

ワークフローで環境変数を参照するには、`{{}}`表記を使用します。任意の入力フィールドで`{{`と入力すると、個人用とワークスペースレベルの両方の環境変数を表示するドロップダウンが表示されます。使用したい変数を選択するだけです。

<Image
  src="/static/environment/environment-4.png"
  alt="二重括弧表記を使用した環境変数の使用方法"
  width={500}
  height={350}
/>

## 変数の解決方法

**ワークスペース変数は常に優先されます**。誰がワークフローを実行するかに関わらず、個人変数よりも優先されます。

キーに対するワークスペース変数が存在しない場合、個人変数が使用されます：
- **手動実行（UI）**：あなたの個人変数
- **自動実行（API、ウェブフック、スケジュール、デプロイされたチャット）**：ワークフロー所有者の個人変数

<Callout type="info">
個人変数はテストに最適です。本番環境のワークフローにはワークスペース変数を使用してください。
</Callout>

## セキュリティのベストプラクティス

### 機密データについて
- APIキー、トークン、パスワードはハードコーディングせず、環境変数として保存してください
- 複数のチームメンバーが必要とする共有リソースにはワークスペース変数を使用してください
- 個人の認証情報は個人変数に保管してください

### 変数の命名
- 説明的な名前を使用する：`DATABASE_URL`ではなく`DB`
- チーム全体で一貫した命名規則に従う
- 競合を避けるために接頭辞を検討する：`PROD_API_KEY`、`DEV_API_KEY`

### アクセス制御
- ワークスペース環境変数はワークスペースの権限を尊重します
- 書き込みアクセス権以上を持つユーザーのみがワークスペース変数を作成/変更できます
- 個人変数は常に個々のユーザーにプライベートです
```

--------------------------------------------------------------------------------

---[FILE: workflow-variables.mdx]---
Location: sim-main/apps/docs/content/docs/ja/variables/workflow-variables.mdx

```text
---
title: ワークフロー変数
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Simの変数は、ワークフロー内のどのブロックからもアクセスおよび変更できるデータのグローバルストアとして機能し、グローバル変数を使用してワークフロー全体でデータを保存および共有することができます。変数は、ワークフローの異なる部分間で情報を共有し、状態を維持し、よりダイナミックなアプリケーションを作成するための強力な方法を提供します。

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="variables.mp4" />
</div>

<Callout type="info">
  変数を使用すると、ワークフロー全体でデータを保存および共有できるため、状態を維持し、複雑な相互接続システムを簡単に作成できます。
</Callout>

## 概要

変数機能はワークフローの中央データストアとして機能し、以下のことが可能になります：

<Steps>
  <Step>
    <strong>グローバルデータの保存</strong>：ワークフロー実行全体で持続する変数を作成
  </Step>
  <Step>
    <strong>ブロック間での情報共有</strong>：ワークフロー内のどのブロックからも同じデータにアクセス
  </Step>
  <Step>
    <strong>ワークフロー状態の維持</strong>：ワークフローの実行中に重要な値を追跡
  </Step>
  <Step>
    <strong>動的ワークフローの作成</strong>：保存された値に基づいて適応できるより柔軟なシステムを構築
  </Step>
</Steps>

## 変数の作成

サイドバーの変数パネルから変数を作成および管理できます。各変数には以下があります：

- **名前**：変数を参照するための一意の識別子
- **値**：変数に保存されるデータ（様々なデータ型をサポート）
- **説明**（任意）：変数の目的を説明するメモ

## 変数へのアクセス

変数は変数ドロップダウンを使用してワークフロー内のどのブロックからもアクセスできます。単に：

1. ブロック内のテキストフィールドに `<` と入力します
2. ドロップダウンメニューを開いて、利用可能な変数を参照します
3. 使用したい変数を選択します

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="variables-dropdown.mp4" />
</div>

<Callout>
  接続タグをフィールドにドラッグすることでも、変数ドロップダウンを開いて利用可能な変数にアクセスできます。
</Callout>

## 変数の種類

Simの変数はさまざまな種類のデータを格納できます：

<Tabs items={['Text', 'Numbers', 'Boolean', 'Objects', 'Arrays']}>
  <Tab>

    ```
    "Hello, World!"
    ```

    <p className="mt-2">テキスト変数は文字列を格納します。メッセージ、名前、その他のテキストデータを保存するのに便利です。</p>
  </Tab>
  <Tab>

    ```
    42
    ```

    <p className="mt-2">数値変数は計算や比較に使用できる数値を格納します。</p>
  </Tab>
  <Tab>

    ```
    true
    ```

    <p className="mt-2">ブール変数はtrue/false値を格納し、フラグや条件チェックに最適です。</p>
  </Tab>
  <Tab>

    ```json
    {
      "name": "John",
      "age": 30,
      "city": "New York"
    }
    ```

    <p className="mt-2">オブジェクト変数はプロパティと値を持つ構造化されたデータを格納します。</p>
  </Tab>
  <Tab>

    ```json
    [1, 2, 3, "four", "five"]
    ```

    <p className="mt-2">配列変数は項目の順序付きコレクションを格納します。</p>
  </Tab>
</Tabs>

## ブロックでの変数の使用

ブロックから変数にアクセスする際、以下のことができます：

- **値の読み取り**：ブロックのロジックで変数の現在の値を使用する
- **変更**：ブロックの処理に基づいて変数の値を更新する
- **式での使用**：式や計算に変数を含める

## 変数のスコープ

Simの変数はグローバルスコープを持ち、以下のことを意味します：

- ワークフロー内のどのブロックからもアクセス可能
- 変数への変更はワークフロー実行全体で持続する
- 明示的にリセットされない限り、変数は実行間で値を維持する

## ベストプラクティス

- **わかりやすい名前を使用する**：変数が表すものを明確に示す変数名を選びましょう。例えば、`up` ではなく `userPreferences` を使用します。
- **変数を文書化する**：変数に説明を追加して、他のチームメンバーがその目的と使用方法を理解できるようにしましょう。
- **変数のスコープを考慮する**：変数はグローバルであり、どのブロックからも変更できることを忘れないでください。予期しない動作を防ぐために、このことを念頭にワークフローを設計しましょう。
- **変数を早期に初期化する**：必要なときに確実に利用できるよう、ワークフローの最初に変数をセットアップして初期化しましょう。
- **存在しない変数に対応する**：変数がまだ存在しない、または予期しない値を持つ可能性を常に考慮しましょう。ブロックに適切な検証を追加してください。
- **変数の数を制限する**：変数の数を管理しやすい範囲に保ちましょう。変数が多すぎると、ワークフローの理解と保守が難しくなります。
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/zh/index.mdx

```text
---
title: 文档
---

import { Card, Cards } from 'fumadocs-ui/components/card'

# Sim 文档

欢迎使用 Sim，这是一款用于构建 AI 应用的可视化工作流构建器。通过在画布上连接模块，构建强大的 AI 代理、自动化工作流和数据处理管道。

## 快速开始

<Cards>
  <Card title="简介" href="/introduction">
    了解您可以使用 Sim 构建的内容
  </Card>
  <Card title="入门指南" href="/getting-started">
    在 10 分钟内创建您的第一个工作流
  </Card>
  <Card title="工作流模块" href="/blocks">
    了解构建模块
  </Card>
  <Card title="工具与集成" href="/tools">
    探索 80 多种内置集成
  </Card>
</Cards>

## 核心概念

<Cards>
  <Card title="连接" href="/connections">
    了解数据如何在模块之间流动
  </Card>
  <Card title="变量" href="/variables">
    使用工作流和环境变量
  </Card>
  <Card title="执行" href="/execution">
    监控工作流运行并管理成本
  </Card>
  <Card title="触发器" href="/triggers">
    通过 API、webhooks 或计划启动工作流
  </Card>
</Cards>

## 高级功能

<Cards>
  <Card title="团队管理" href="/permissions/roles-and-permissions">
    设置工作区角色和权限
  </Card>
  <Card title="MCP 集成" href="/mcp">
    使用模型上下文协议连接外部服务
  </Card>
  <Card title="SDKs" href="/sdks">
    将 Sim 集成到您的应用程序中
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: agent.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/agent.mdx

```text
---
title: Agent
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

代理模块将您的工作流连接到大型语言模型 (LLM)。它处理自然语言输入，调用外部工具，并生成结构化或非结构化的输出。

<div className="flex justify-center">
  <Image
    src="/static/blocks/agent.png"
    alt="代理模块配置"
    width={500}
    height={400}
    className="my-6"
  />
</div> 

## 配置选项

### 系统提示

系统提示建立代理的操作参数和行为约束。此配置定义了代理的角色、响应方法以及处理所有传入请求的边界。

```markdown
You are a helpful assistant that specializes in financial analysis.
Always provide clear explanations and cite sources when possible.
When responding to questions about investments, include risk disclaimers.
```

### 用户提示

用户提示是推理处理的主要输入数据。此参数接受代理将分析和响应的自然语言文本或结构化数据。输入来源包括：

- **静态配置**：在模块配置中指定的直接文本输入
- **动态输入**：通过连接接口从上游模块传递的数据
- **运行时生成**：在工作流执行期间以编程方式生成的内容

### 模型选择

代理模块通过统一的推理接口支持多个 LLM 提供商。可用模型包括：

- **OpenAI**: GPT-5.1、GPT-5、GPT-4o、o1、o3、o4-mini、gpt-4.1
- **Anthropic**: Claude 4.5 Sonnet、Claude Opus 4.1
- **Google**: Gemini 2.5 Pro、Gemini 2.0 Flash
- **其他提供商**: Groq、Cerebras、xAI、Azure OpenAI、OpenRouter
- **本地模型**: 兼容 Ollama 或 VLLM 的模型

### 温度

控制响应的随机性和创造性：

- **低 (0-0.3)**：确定性和专注性强。适合事实性任务和高准确性。
- **中 (0.3-0.7)**：创造性与专注性平衡。适合一般用途。
- **高 (0.7-2.0)**：富有创造性和多样性。适合头脑风暴和内容生成。

### API 密钥

您选择的 LLM 提供商的 API 密钥。此密钥会被安全存储并用于身份验证。

### 工具

通过外部集成扩展代理的功能。从 60 多种预构建工具中选择，或定义自定义功能。

**可用类别：**
- **通信**：Gmail、Slack、Telegram、WhatsApp、Microsoft Teams
- **数据源**：Notion、Google Sheets、Airtable、Supabase、Pinecone
- **网络服务**：Firecrawl、Google Search、Exa AI、浏览器自动化
- **开发**：GitHub、Jira、Linear
- **AI 服务**：OpenAI、Perplexity、Hugging Face、ElevenLabs

**执行模式：**
- **自动**：模型根据上下文决定何时使用工具
- **必需**：每次请求必须调用工具
- **无**：工具可用但不建议模型使用

### 响应格式

响应格式参数通过 JSON Schema 验证强制执行结构化输出生成。这确保了符合预定义数据结构的一致、机器可读的响应：

```json
{
  "name": "user_analysis",
  "schema": {
    "type": "object",
    "properties": {
      "sentiment": {
        "type": "string",
        "enum": ["positive", "negative", "neutral"]
      },
      "confidence": {
        "type": "number",
        "minimum": 0,
        "maximum": 1
      }
    },
    "required": ["sentiment", "confidence"]
  }
}
```

此配置限制模型的输出以符合指定的模式，防止生成自由格式的文本响应，并确保生成结构化数据。

### 访问结果

代理完成后，您可以访问其输出：

- **`<agent.content>`**：代理的响应文本或结构化数据
- **`<agent.tokens>`**：令牌使用统计信息（提示、完成、总计）
- **`<agent.tool_calls>`**：代理在执行过程中使用的任何工具的详细信息
- **`<agent.cost>`**：API 调用的估计成本（如果可用）

## 高级功能

### 内存 + 代理：对话历史

使用一个 `Memory` 块和一个一致的 `id`（例如，`chat`）在运行之间持久化消息，并将该历史记录包含在代理的提示中。

- 在代理之前添加用户消息
- 读取对话历史以获取上下文
- 在代理运行后附加其回复

有关详细信息，请参阅[`Memory`](/tools/memory)模块参考。

## 输出

- **`<agent.content>`**：代理的响应文本
- **`<agent.tokens>`**：令牌使用统计
- **`<agent.tool_calls>`**：工具执行详情
- **`<agent.cost>`**：API 调用的估算成本

## 示例用例

**客户支持自动化** - 通过数据库和工具访问处理查询

```
API (Ticket) → Agent (Postgres, KB, Linear) → Gmail (Reply) → Memory (Save)
```

**多模型内容分析** - 使用不同的 AI 模型分析内容

```
Function (Process) → Agent (GPT-4o Technical) → Agent (Claude Sentiment) → Function (Report)
```

**工具驱动的研究助手** - 通过网络搜索和文档访问进行研究

```
Input → Agent (Google Search, Notion) → Function (Compile Report)
```

## 最佳实践

- **在系统提示中具体说明**：清晰定义代理的角色、语气和限制。指令越具体，代理越能更好地实现其预期目的。
- **选择合适的温度设置**：当准确性很重要时，使用较低的温度设置（0-0.3）；当需要更具创意或多样化的响应时，提高温度（0.7-2.0）。
- **有效利用工具**：集成能补充代理目的并增强其能力的工具。选择性地提供工具，避免让代理不堪重负。对于重叠较少的任务，使用另一个代理模块以获得最佳效果。
```

--------------------------------------------------------------------------------

---[FILE: api.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/api.mdx

```text
---
title: API
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

API 模块通过 HTTP 请求将您的工作流连接到外部服务。支持 GET、POST、PUT、DELETE 和 PATCH 方法与 REST API 交互。

<div className="flex justify-center">
  <Image
    src="/static/blocks/api.png"
    alt="API 模块"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 配置选项

### URL

API 请求的端点 URL。可以是：

- 直接在模块中输入的静态 URL
- 从另一个模块的输出连接的动态 URL
- 包含路径参数的 URL

### 方法

选择您的请求所需的 HTTP 方法：

- **GET**：从服务器检索数据
- **POST**：向服务器发送数据以创建资源
- **PUT**：更新服务器上的现有资源
- **DELETE**：从服务器删除资源
- **PATCH**：部分更新服务器上的现有资源

### 查询参数

定义将作为查询参数附加到 URL 的键值对。例如：

```
Key: apiKey
Value: your_api_key_here

Key: limit
Value: 10
```

这些将被添加到 URL 中作为 `?apiKey=your_api_key_here&limit=10`。

### 请求头

为您的请求配置 HTTP 请求头。常见的请求头包括：

```
Key: Content-Type
Value: application/json

Key: Authorization
Value: Bearer your_token_here
```

### 请求体

对于支持请求体的方法（POST、PUT、PATCH），您可以定义要发送的数据。请求体可以是：

- 直接在模块中输入的 JSON 数据
- 从另一个模块的输出连接的数据
- 在工作流执行期间动态生成的数据

### 访问结果

API 请求完成后，您可以访问其输出：

- **`<api.data>`**：API 的响应体数据
- **`<api.status>`**：HTTP 状态码（200、404、500 等）
- **`<api.headers>`**：服务器的响应头
- **`<api.error>`**：如果请求失败，包含错误详情

## 高级功能

### 动态 URL 构建

使用前面模块中的变量动态构建 URL：

```javascript
// In a Function block before the API
const userId = <start.userId>;
const apiUrl = `https://api.example.com/users/${userId}/profile`;
```

### 请求重试

API 模块会自动处理：
- 带有指数退避的网络超时
- 速率限制响应（429 状态码）
- 服务器错误（5xx 状态码）及重试逻辑
- 连接失败及重新连接尝试

### 响应验证

在处理之前验证 API 响应：

```javascript
// In a Function block after the API
if (<api.status> === 200) {
  const data = <api.data>;
  // Process successful response
} else {
  // Handle error response
  console.error(`API Error: ${<api.status>}`);
}
```

## 输出

- **`<api.data>`**：来自 API 的响应体数据
- **`<api.status>`**：HTTP 状态码
- **`<api.headers>`**：响应头
- **`<api.error>`**：如果请求失败，包含错误详情

## 示例用例

**获取用户资料数据** - 从外部服务检索用户信息

```
Function (Build ID) → API (GET /users/{id}) → Function (Format) → Response
```

**支付处理** - 通过 Stripe API 处理支付

```
Function (Validate) → API (Stripe) → Condition (Success) → Supabase (Update)
```

## 最佳实践

- **使用环境变量存储敏感数据**：不要硬编码 API 密钥或凭据
- **优雅地处理错误**：为失败的请求连接错误处理逻辑
- **验证响应**：在处理数据之前检查状态码和响应格式
- **遵守速率限制**：注意 API 的速率限制并实施适当的节流
```

--------------------------------------------------------------------------------

---[FILE: condition.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/condition.mdx

```text
---
title: 条件
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

条件模块根据布尔表达式分支工作流执行。使用前一个模块的输出评估条件，并路由到不同的路径，无需使用 LLM。

<div className="flex justify-center">
  <Image
    src="/static/blocks/condition.png"
    alt="条件块"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 配置选项

### 条件

定义一个或多个需要评估的条件。每个条件包括：

- **表达式**：一个 JavaScript/TypeScript 表达式，结果为 true 或 false
- **路径**：如果条件为 true，则路由到的目标模块
- **描述**：可选，解释条件检查的内容

您可以创建多个条件，这些条件按顺序评估，第一个匹配的条件决定执行路径。

### 条件表达式格式

条件使用 JavaScript 语法，并可以引用前一个模块的输入值。

<Tabs items={['分数阈值', '文本分析', '多个条件']}>
  <Tab>

    ```javascript
    // Check if a score is above a threshold
    <agent.score> > 75
    ```

  </Tab>
  <Tab>

    ```javascript
    // Check if a text contains specific keywords
    <agent.text>.includes('urgent') || <agent.text>.includes('emergency')
    ```

  </Tab>
  <Tab>

    ```javascript
    // Check multiple conditions
    <agent.age> >= 18 && <agent.country> === 'US'
    ```

  </Tab>
</Tabs>

### 访问结果

条件评估后，您可以访问其输出：

- **`<condition.result>`**：条件评估的布尔结果
- **`<condition.matched_condition>`**：匹配条件的 ID
- **`<condition.content>`**：评估结果的描述
- **`<condition.path>`**：所选路由目标的详细信息

## 高级功能

### 复杂表达式

在条件中使用 JavaScript 运算符和函数：

```javascript
// String operations
<user.email>.endsWith('@company.com')

// Array operations
<api.tags>.includes('urgent')

// Mathematical operations
<agent.confidence> * 100 > 85

// Date comparisons
new Date(<api.created_at>) > new Date('2024-01-01')
```

### 多条件评估

条件按顺序评估，直到一个条件匹配为止：

```javascript
// Condition 1: Check for high priority
<ticket.priority> === 'high'

// Condition 2: Check for urgent keywords
<ticket.subject>.toLowerCase().includes('urgent')

// Condition 3: Default fallback
true
```

### 错误处理

条件会自动处理：
- 使用安全评估处理未定义或空值
- 使用适当的回退处理类型不匹配
- 记录错误日志处理无效表达式
- 使用默认值处理缺失变量

## 输出

- **`<condition.result>`**：评估的布尔结果
- **`<condition.matched_condition>`**：匹配条件的 ID
- **`<condition.content>`**：评估结果的描述
- **`<condition.path>`**：所选路由目标的详细信息

## 示例用例

**客户支持路由** - 根据优先级路由工单

```
API (Ticket) → Condition (priority === 'high') → Agent (Escalation) or Agent (Standard)
```

**内容审核** - 基于分析过滤内容

```
Agent (Analyze) → Condition (toxicity > 0.7) → Moderation or Publish
```

**用户引导流程** - 根据用户类型个性化引导

```
Function (Process) → Condition (account_type === 'enterprise') → Advanced or Simple
```

## 最佳实践

- **正确排列条件顺序**：将更具体的条件放在一般条件之前，以确保特定逻辑优先于回退逻辑
- **在需要时使用 else 分支**：如果没有条件匹配且 else 分支未连接，工作流分支将优雅地结束。如果需要为未匹配的情况提供回退路径，请连接 else 分支
- **保持表达式简单**：使用清晰、直观的布尔表达式以提高可读性和调试的便利性
- **为条件添加文档说明**：添加描述以解释每个条件的目的，从而提高团队协作和维护效率
- **测试边界情况**：通过测试条件范围边界值，验证条件是否正确处理边界值
```

--------------------------------------------------------------------------------

---[FILE: evaluator.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/evaluator.mdx

```text
---
title: Evaluator
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

Evaluator 模块使用 AI 根据自定义指标对内容质量进行评分和评估。非常适合质量控制、A/B 测试，以及确保 AI 输出符合特定标准。

<div className="flex justify-center">
  <Image
    src="/static/blocks/evaluator.png"
    alt="Evaluator 模块配置"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 配置选项

### 评估指标

定义用于评估内容的自定义指标。每个指标包括：

- **名称**：指标的简短标识符
- **描述**：对指标测量内容的详细说明
- **范围**：评分的数值范围（例如，1-5，0-10）

示例指标：

```
Accuracy (1-5): How factually accurate is the content?
Clarity (1-5): How clear and understandable is the content?
Relevance (1-5): How relevant is the content to the original query?
```

### 内容

需要评估的内容可以是：

- 在模块配置中直接提供
- 从另一个模块的输出（通常是 Agent 模块）连接
- 在工作流执行期间动态生成

### 模型选择

选择一个 AI 模型来执行评估：

- **OpenAI**：GPT-4o、o1、o3、o4-mini、gpt-4.1
- **Anthropic**：Claude 3.7 Sonnet
- **Google**：Gemini 2.5 Pro、Gemini 2.0 Flash
- **其他提供商**：Groq、Cerebras、xAI、DeepSeek
- **本地模型**：兼容 Ollama 或 VLLM 的模型

使用具有强大推理能力的模型，例如 GPT-4o 或 Claude 3.7 Sonnet，以获得最佳效果。

### API 密钥

您所选 LLM 提供商的 API 密钥。此密钥会被安全存储并用于身份验证。

## 示例用例

**内容质量评估** - 在发布前评估内容

```
Agent (Generate) → Evaluator (Score) → Condition (Check threshold) → Publish or Revise
```

**A/B 测试内容** - 比较多个 AI 生成的响应

```
Parallel (Variations) → Evaluator (Score Each) → Function (Select Best) → Response
```

**客户支持质量控制** - 确保响应符合质量标准

```
Agent (Support Response) → Evaluator (Score) → Function (Log) → Condition (Review if Low)
```

## 输出

- **`<evaluator.content>`**：评估摘要及评分
- **`<evaluator.model>`**：用于评估的模型
- **`<evaluator.tokens>`**：令牌使用统计
- **`<evaluator.cost>`**：评估成本估算

## 最佳实践

- **使用具体的指标描述**：清晰定义每个指标的衡量内容，以获得更准确的评估
- **选择合适的范围**：选择提供足够细粒度但不过于复杂的评分范围
- **与 Agent 模块连接**：使用 Evaluator 模块评估 Agent 模块的输出并创建反馈循环
- **使用一致的指标**：为了进行比较分析，在类似评估中保持指标的一致性
- **结合多种指标**：使用多种指标以获得全面的评估
```

--------------------------------------------------------------------------------

---[FILE: function.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/function.mdx

```text
---
title: 函数
---

import { Image } from '@/components/ui/image'

Function 模块在您的工作流中执行自定义 JavaScript 或 TypeScript 代码。可以用于转换数据、执行计算或实现自定义逻辑。

<div className="flex justify-center">
  <Image
    src="/static/blocks/function.png"
    alt="函数块与代码编辑器"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 输出

- **`<function.result>`**: 您的函数返回的值
- **`<function.stdout>`**: 您代码中 Console.log() 的输出

## 示例用例

**数据处理管道** - 将 API 响应转换为结构化数据

```
API (Fetch) → Function (Process & Validate) → Function (Calculate Metrics) → Response
```

**业务逻辑实现** - 计算忠诚度分数和等级

```
Agent (Get History) → Function (Calculate Score) → Function (Determine Tier) → Condition (Route)
```

**数据验证和清理** - 验证并清理用户输入

```
Input → Function (Validate & Sanitize) → API (Save to Database)
```

### 示例：忠诚度分数计算器

```javascript title="loyalty-calculator.js"
// Process customer data and calculate loyalty score
const { purchaseHistory, accountAge, supportTickets } = <agent>;

// Calculate metrics
const totalSpent = purchaseHistory.reduce((sum, purchase) => sum + purchase.amount, 0);
const purchaseFrequency = purchaseHistory.length / (accountAge / 365);
const ticketRatio = supportTickets.resolved / supportTickets.total;

// Calculate loyalty score (0-100)
const spendScore = Math.min(totalSpent / 1000 * 30, 30);
const frequencyScore = Math.min(purchaseFrequency * 20, 40);
const supportScore = ticketRatio * 30;

const loyaltyScore = Math.round(spendScore + frequencyScore + supportScore);

return {
  customer: <agent.name>,
  loyaltyScore,
  loyaltyTier: loyaltyScore >= 80 ? "Platinum" : loyaltyScore >= 60 ? "Gold" : "Silver",
  metrics: { spendScore, frequencyScore, supportScore }
};
```

## 最佳实践

- **保持函数专注**：编写专注于单一功能的函数，以提高可维护性和调试性
- **优雅地处理错误**：使用 try/catch 块处理潜在错误并提供有意义的错误信息
- **测试边界情况**：确保您的代码能够正确处理异常输入、空值和边界条件
- **优化性能**：注意大数据集的计算复杂性和内存使用
- **使用 console.log() 进行调试**：利用标准输出调试和监控函数执行
```

--------------------------------------------------------------------------------

---[FILE: guardrails.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/guardrails.mdx

```text
---
title: Guardrails
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

Guardrails 模块通过针对多种验证类型检查内容，验证并保护您的 AI 工作流。在内容进入工作流之前，确保数据质量、防止幻觉、检测 PII（个人身份信息）并强制执行格式要求。

<div className="flex justify-center">
  <Image
    src="/static/blocks/guardrails.png"
    alt="防护栏块"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 验证类型

### JSON 验证

验证内容是否为正确格式的 JSON。这是确保结构化 LLM 输出可以安全解析的理想方法。

**使用场景：**
- 在解析之前验证 Agent 块的 JSON 响应
- 确保 API 负载格式正确
- 检查结构化数据的完整性

**输出：**
- `passed`：如果是有效的 JSON，则为 `true`，否则为 `false`
- `error`：如果验证失败，则为错误消息（例如，“无效的 JSON：意外的标记...”）

### 正则表达式验证

检查内容是否符合指定的正则表达式模式。

**使用场景：**
- 验证电子邮件地址
- 检查电话号码格式
- 验证 URL 或自定义标识符
- 强制执行特定的文本模式

**配置：**
- **正则表达式模式**：要匹配的正则表达式（例如，`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` 用于电子邮件）

**输出：**
- `passed`：如果内容匹配模式，则为 `true`，否则为 `false`
- `error`：如果验证失败，则为错误消息

### 幻觉检测

使用基于检索增强生成 (RAG) 的 LLM 评分来检测 AI 生成的内容是否与您的知识库相矛盾或不基于事实。

**工作原理：**
1. 查询您的知识库以获取相关上下文
2. 将 AI 输出和检索到的上下文发送到 LLM
3. LLM 分配一个置信评分（0-10 分制）
   - **0** = 完全幻觉（完全没有依据）
   - **10** = 完全基于事实（完全由知识库支持）
4. 如果评分 ≥ 阈值（默认值：3），验证通过

**配置：**
- **知识库**：从现有知识库中选择
- **模型**：选择用于评分的 LLM（需要强推理能力 - 推荐 GPT-4o、Claude 3.7 Sonnet）
- **API 密钥**：所选 LLM 提供商的身份验证（对于托管/Ollama 或 VLLM 兼容模型会自动隐藏）
- **置信度阈值**：通过的最低分数（0-10，默认值：3）
- **Top K**（高级）：要检索的知识库块数量（默认值：10）

**输出：**
- `passed`：如果置信度分数 ≥ 阈值，则为 `true`
- `score`：置信度分数（0-10）
- `reasoning`：LLM 对分数的解释
- `error`：验证失败时的错误信息

**用例：**
- 根据文档验证代理的回复
- 确保客户支持回答事实准确
- 验证生成的内容是否与源材料匹配
- RAG 应用的质量控制

### PII 检测

使用 Microsoft Presidio 检测个人身份信息。支持 40 多种实体类型，覆盖多个国家和语言。

<div className="flex justify-center">
  <Image
    src="/static/blocks/guardrails-2.png"
    alt="PII 检测配置"
    width={700}
    height={450}
    className="my-6"
  />
</div>

**工作原理：**
1. 提交要验证的内容（例如，`<agent1.content>`）
2. 使用模态选择器选择要检测的 PII 类型
3. 选择检测模式（检测或屏蔽）
4. 扫描内容以匹配 PII 实体
5. 返回检测结果，并可选择返回屏蔽后的文本

<div className="mx-auto w-3/5 overflow-hidden rounded-lg">
  <Video src="guardrails.mp4" width={500} height={350} />
</div>

**配置：**
- **要检测的 PII 类型**：通过模态选择器从分组类别中选择
  - **常见**：姓名、电子邮件、电话、信用卡、IP 地址等
  - **美国**：社会安全号码、驾照、护照等
  - **英国**：NHS 编号、国家保险号码
  - **西班牙**：NIF、NIE、CIF
  - **意大利**：税号、驾照、增值税号
  - **波兰**：PESEL、NIP、REGON
  - **新加坡**：NRIC/FIN、UEN
  - **澳大利亚**：ABN、ACN、TFN、Medicare
  - **印度**：Aadhaar、PAN、护照、选民编号
- **模式**：
  - **检测**：仅识别 PII（默认）
  - **屏蔽**：将检测到的 PII 替换为屏蔽值
- **语言**：检测语言（默认：英语）

**输出：**
- `passed`：如果检测到任何选定的 PII 类型，则为 `false`
- `detectedEntities`：包含类型、位置和置信度的检测到的 PII 数组
- `maskedText`：屏蔽 PII 的内容（仅当模式为 "屏蔽" 时）
- `error`：验证失败时的错误信息

**使用场景：**
- 阻止包含敏感个人信息的内容
- 在记录或存储数据之前屏蔽 PII
- 符合 GDPR、HIPAA 和其他隐私法规
- 在处理之前清理用户输入

## 配置

### 要验证的内容

要验证的输入内容。通常来源于：
- Agent 块的输出：`<agent.content>`
- Function 块的结果：`<function.output>`
- API 响应：`<api.output>`
- 任何其他块的输出

### 验证类型

从以下四种验证类型中选择：
- **有效 JSON**：检查内容是否为正确格式的 JSON
- **正则表达式匹配**：验证内容是否匹配正则表达式模式
- **幻觉检查**：通过 LLM 评分与知识库进行验证
- **PII 检测**：检测并可选择屏蔽个人身份信息

## 输出

所有验证类型返回：

- **`<guardrails.passed>`**：布尔值，指示验证是否通过
- **`<guardrails.validationType>`**：执行的验证类型
- **`<guardrails.input>`**：被验证的原始输入
- **`<guardrails.error>`**：如果验证失败，返回错误信息（可选）

按类型的额外输出：

**幻觉检查：**
- **`<guardrails.score>`**：置信分数（0-10）
- **`<guardrails.reasoning>`**：LLM 的解释

**PII 检测：**
- **`<guardrails.detectedEntities>`**：检测到的 PII 实体数组
- **`<guardrails.maskedText>`**：屏蔽 PII 后的内容（如果模式为 "Mask"）

## 示例使用场景

**在解析之前验证 JSON** - 确保 Agent 输出为有效的 JSON

```
Agent (Generate) → Guardrails (Validate) → Condition (Check passed) → Function (Parse)
```

**防止幻觉** - 验证客户支持响应是否符合知识库

```
Agent (Response) → Guardrails (Check KB) → Condition (Score ≥ 3) → Send or Flag
```

**阻止用户输入中的 PII** - 清理用户提交的内容

```
Input → Guardrails (Detect PII) → Condition (No PII) → Process or Reject
```

## 最佳实践

- **与条件块链式使用**：使用 `<guardrails.passed>` 根据验证结果分支工作流逻辑
- **在解析之前使用 JSON 验证**：在尝试解析 LLM 输出之前始终验证 JSON 结构
- **选择合适的 PII 类型**：仅选择与您的使用场景相关的 PII 实体类型以提高性能
- **设置合理的置信阈值**：对于幻觉检测，根据您的准确性要求调整阈值（值越高越严格）
- **使用强大的模型进行幻觉检测**：GPT-4o 或 Claude 3.7 Sonnet 提供更准确的置信评分
- **为日志记录屏蔽 PII**：当需要记录或存储可能包含 PII 的内容时，使用 "Mask" 模式
- **测试正则表达式模式**：在生产环境部署之前彻底验证您的正则表达式模式
- **监控验证失败**：跟踪 `<guardrails.error>` 消息以识别常见的验证问题

<Callout type="info">
  Guardrails 验证会在您的工作流程中同步进行。对于幻觉检测，如果延迟至关重要，请选择更快的模型（例如 GPT-4o-mini）。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: human-in-the-loop.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/human-in-the-loop.mdx

```text
---
title: 人工干预
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

“人工干预”模块会暂停工作流的执行，等待人工干预后再继续。可用于添加审批关卡、收集反馈或在关键决策点获取额外输入。

<div className="flex justify-center">
  <Image
    src="/static/blocks/hitl-1.png"
    alt="人工干预模块配置"
    width={500}
    height={400}
    className="my-6"
  />
</div>

当执行到达此模块时，工作流会无限期暂停，直到通过审批门户、API 或 webhook 提供人工输入。

<div className="flex justify-center">
  <Image
    src="/static/blocks/hitl-2.png"
    alt="人工干预审批门户"
    width={700}
    height={500}
    className="my-6"
  />
</div>

## 配置选项

### 暂停输出

定义显示给审批者的数据。这是审批门户中显示的上下文信息，帮助他们做出明智的决策。

使用可视化构建器或 JSON 编辑器来构建数据结构。使用 `<blockName.output>` 语法引用工作流变量。

```json
{
  "customerName": "<agent1.content.name>",
  "proposedAction": "<router1.selectedPath>",
  "confidenceScore": "<evaluator1.score>",
  "generatedEmail": "<agent2.content>"
}
```

### 通知

配置在需要审批时如何提醒审批者。支持的渠道包括：

- **Slack** - 发送到频道或私信的消息
- **Gmail** - 带有审批链接的电子邮件
- **Microsoft Teams** - 团队频道通知
- **SMS** - 通过 Twilio 的短信提醒
- **Webhooks** - 自定义通知系统

在通知消息中包含审批 URL (`<blockId.url>`)，以便审批者可以访问门户。

### 恢复输入

定义审批者在响应时填写的字段。这些数据在工作流恢复后可供下游模块使用。

```json
{
  "approved": {
    "type": "boolean",
    "description": "Approve or reject this request"
  },
  "comments": {
    "type": "string",
    "description": "Optional feedback or explanation"
  }
}
```

在下游模块中使用 `<blockId.resumeInput.fieldName>` 访问简历数据。

## 审批方法

<Tabs items={['Approval Portal', 'API', 'Webhook']}>
  <Tab>
    ### 审批门户
    
    每个模块都会生成一个唯一的门户 URL (`<blockId.url>`)，提供一个可视化界面，显示所有暂停的输出数据和用于恢复输入的表单字段。支持移动端响应且安全可靠。
    
    在通知中分享此 URL，供审批人查看和响应。
  </Tab>
  <Tab>
    ### REST API
    
    以编程方式恢复工作流：
    

    ```bash
    POST /api/workflows/{workflowId}/executions/{executionId}/resume/{blockId}
    
    {
      "approved": true,
      "comments": "Looks good to proceed"
    }
    ```

    
    构建自定义审批界面或与现有系统集成。
  </Tab>
  <Tab>
    ### Webhook
    
    在通知部分添加一个 Webhook 工具，将审批请求发送到外部系统。可与 Jira 或 ServiceNow 等工单系统集成。
  </Tab>
</Tabs>

## 常见用例

**内容审批** - 在发布前审核 AI 生成的内容

```
Agent → Human in the Loop → API (Publish)
```

**多阶段审批** - 为高风险决策设置多个审批步骤

```
Agent → Human in the Loop (Manager) → Human in the Loop (Director) → Execute
```

**数据验证** - 在处理前验证提取的数据

```
Agent (Extract) → Human in the Loop (Validate) → Function (Process)
```

**质量控制** - 在发送给客户之前审核 AI 输出

```
Agent (Generate) → Human in the Loop (QA) → Gmail (Send)
```

## 模块输出

**`url`** - 审批门户的唯一 URL  
**`resumeInput.*`** - 在工作流恢复后，Resume Input 中定义的所有字段将可用

通过 `<blockId.resumeInput.fieldName>` 访问。

## 示例

**暂停的输出：**

```json
{
  "title": "<agent1.content.title>",
  "body": "<agent1.content.body>",
  "qualityScore": "<evaluator1.score>"
}
```

**恢复输入：**

```json
{
  "approved": { "type": "boolean" },
  "feedback": { "type": "string" }
}
```

**下游使用：**

```javascript
// Condition block
<approval1.resumeInput.approved> === true
```

下面的示例展示了一个审批门户，显示了工作流暂停后审批者的视图。审批者可以审查数据并提供输入，作为工作流恢复的一部分。审批门户可以通过唯一的 URL `<blockId.url>` 直接访问。

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="hitl-resume.mp4" width={700} height={450} />
</div>

## 相关模块

- **[Condition](/blocks/condition)** - 基于审批决策进行分支
- **[Variables](/blocks/variables)** - 存储审批历史和元数据
- **[Response](/blocks/response)** - 将工作流结果返回给 API 调用者
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/index.mdx

```text
---
title: 概览
description: 构建 AI 工作流的组件
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

模块是您连接在一起以创建 AI 工作流的构建组件。可以将它们视为专门的模块，每个模块都处理特定任务——从与 AI 模型聊天到进行 API 调用或处理数据。

<div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
  <Video src="connections.mp4" width={700} height={450} />
</div>

## 核心模块类型

Sim 提供了处理 AI 工作流核心功能的基本模块类型：

### 处理模块
- **[Agent](/blocks/agent)** - 与 AI 模型（OpenAI、Anthropic、Google、本地模型）聊天
- **[Function](/blocks/function)** - 运行自定义 JavaScript/TypeScript 代码
- **[API](/blocks/api)** - 通过 HTTP 请求连接到外部服务

### 逻辑模块
- **[Condition](/blocks/condition)** - 基于布尔表达式分支工作流路径
- **[Router](/blocks/router)** - 使用 AI 智能路由请求到不同路径
- **[Evaluator](/blocks/evaluator)** - 使用 AI 评分并评估内容质量

### 控制流模块
- **[Variables](/blocks/variables)** - 设置和管理工作流范围内的变量
- **[Wait](/blocks/wait)** - 暂停工作流执行指定的时间延迟
- **[Human in the Loop](/blocks/human-in-the-loop)** - 在继续之前暂停以获得人工批准和反馈

### 输出模块
- **[响应](/blocks/response)** - 格式化并返回工作流的最终结果

## 模块的工作原理

每个模块有三个主要组成部分：

**输入**：从其他模块或用户输入接收的数据
**配置**：控制模块行为的设置
**输出**：模块为其他模块生成的数据

<Steps>
  <Step>
    <strong>接收输入</strong>：模块从连接的模块或用户输入接收数据
  </Step>
  <Step>
    <strong>处理</strong>：模块根据其配置处理输入
  </Step>
  <Step>
    <strong>输出结果</strong>：模块生成输出数据供工作流中的下一个模块使用
  </Step>
</Steps>

## 连接模块

通过将模块连接在一起创建工作流。一个模块的输出成为另一个模块的输入：

- **拖动连接**：从输出端口拖动到输入端口
- **多重连接**：一个输出可以连接到多个输入
- **分支路径**：某些模块可以根据条件路由到不同的路径

<div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
  <Video src="connections.mp4" width={700} height={450} />
</div>

## 常见模式

### 顺序处理
将模块连接成链，每个模块处理前一个模块的输出：

```
User Input → Agent → Function → Response
```

### 条件分支
使用条件或路由模块创建不同的路径：

```
User Input → Router → Agent A (for questions)
                   → Agent B (for commands)
```

### 质量控制
使用评估模块评估和筛选输出：

```
Agent → Evaluator → Condition → Response (if good)
                              → Agent (retry if bad)
```

## 模块配置

每种模块类型都有特定的配置选项：

**所有模块**：
- 输入/输出连接
- 错误处理行为
- 执行超时设置

**AI 模块**（Agent、Router、Evaluator）：
- 模型选择（OpenAI、Anthropic、Google、本地）
- API 密钥和身份验证
- 温度及其他模型参数
- 系统提示和指令

**逻辑模块**（Condition、Function）：
- 自定义表达式或代码
- 变量引用
- 执行环境设置

**集成模块**（API、Response）：
- 端点配置
- 请求头和身份验证
- 请求/响应格式化

<Cards>
  <Card title="Agent 模块" href="/blocks/agent">
    连接 AI 模型并创建智能响应
  </Card>
  <Card title="Function 模块" href="/blocks/function">
    运行自定义代码以处理和转换数据
  </Card>
  <Card title="API 模块" href="/blocks/api">
    集成外部服务和 API
  </Card>
  <Card title="Condition 模块" href="/blocks/condition">
    基于数据评估创建分支逻辑
  </Card>
  <Card title="Human in the Loop 模块" href="/blocks/human-in-the-loop">
    在继续之前暂停以获得人工批准和反馈
  </Card>
  <Card title="Variables 模块" href="/blocks/variables">
    设置和管理工作流范围内的变量
  </Card>
  <Card title="Wait 模块" href="/blocks/wait">
    暂停工作流执行指定的时间延迟
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: loop.mdx]---
Location: sim-main/apps/docs/content/docs/zh/blocks/loop.mdx

```text
---
title: 循环
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

循环块是一个容器，用于重复执行块。可以迭代集合、重复操作固定次数，或在满足条件时继续执行。

<Callout type="info">
  循环块是容器节点，内部包含其他块。根据您的配置，内部块会多次执行。
</Callout>

## 配置选项

### 循环类型

选择以下四种循环类型之一：

<Tabs items={['For 循环', 'ForEach 循环', 'While 循环', 'Do-While 循环']}>
  <Tab>
    **For 循环（迭代）** - 一个执行固定次数的数字循环：
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-1.png"
        alt="带有迭代的 For 循环"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    当需要重复操作特定次数时使用此方法。
    

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
    **ForEach 循环（集合）** - 一个基于集合的循环，迭代数组或对象中的每一项：
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-2.png"
        alt="带有集合的 ForEach 循环"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    当需要处理一组项目时使用此方法。
    

    ```
    Example: Process ["apple", "banana", "orange"]
    - Iteration 1: Process "apple"
    - Iteration 2: Process "banana"
    - Iteration 3: Process "orange"
    ```

  </Tab>
  <Tab>
    **While 循环（基于条件）** - 当条件为真时继续执行：
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-3.png"
        alt="带有条件的 While 循环"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    当需要循环直到满足特定条件时使用此方法。条件在每次迭代的**之前**进行检查。

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
    **Do-While 循环（基于条件）** - 至少执行一次，然后在条件为真时继续执行：
    
    <div className="flex justify-center">
      <Image
        src="/static/blocks/loop-4.png"
        alt="带有条件的 Do-While 循环"
        width={500}
        height={400}
        className="my-6"
      />
    </div>
    
    当需要至少执行一次，然后循环直到满足条件时使用此方法。条件在每次迭代的**之后**进行检查。

    ```
    Example: Do-while {"<variable.i>"} < 10
    - Execute blocks
    - Inside loop: Increment {"<variable.i>"}
    - Inside loop: Variables assigns i = {"<variable.i>"} + 1
    - Check condition → Continue if true
    - Check condition → Exit if false
    ```

  </Tab>
</Tabs>

## 如何使用循环

### 创建循环

1. 从工具栏中拖动一个循环块到画布上
2. 配置循环类型和参数
3. 将其他块拖入循环容器内
4. 根据需要连接这些块

### 访问结果

循环完成后，您可以访问聚合结果：

- **`<loop.results>`**：所有循环迭代结果的数组

## 示例用例

**处理 API 结果** - ForEach 循环处理来自 API 的客户记录

```
API (Fetch) → Loop (ForEach) → Agent (Analyze) → Function (Store)
```

**迭代内容生成** - For 循环生成多个内容变体

```
Loop (5x) → Agent (Generate) → Evaluator (Score) → Function (Select Best)
```

**带计数器的 While 循环** - While 循环使用计数器处理项目

```
Variables (i=0) → Loop (While i<10) → Agent (Process) → Variables (i++)
```

## 高级功能

### 限制

<Callout type="warning">
  容器块（循环和并行）不能嵌套在彼此内部。这意味着：
  - 您不能将一个循环块放入另一个循环块中
  - 您不能将一个并行块放入循环块中
  - 您不能将任何容器块放入另一个容器块中
  
  如果您需要多维迭代，请考虑重构您的工作流以使用顺序循环或分阶段处理数据。
</Callout>

<Callout type="info">
  循环是按顺序执行的，而不是并行执行。如果您需要并发执行，请使用并行块。
</Callout>

## 输入和输出

<Tabs items={['配置', '变量', '结果']}>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>循环类型</strong>：选择 'for'、'forEach'、'while' 或 'doWhile'
      </li>
      <li>
        <strong>迭代次数</strong>：执行的次数（for 循环）
      </li>
      <li>
        <strong>集合</strong>：要迭代的数组或对象（forEach 循环）
      </li>
      <li>
        <strong>条件</strong>：布尔表达式（while/do-while 循环）
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>loop.currentItem</strong>：当前正在处理的项目
      </li>
      <li>
        <strong>loop.index</strong>：当前迭代编号（从 0 开始）
      </li>
      <li>
        <strong>loop.items</strong>：完整集合（forEach 循环）
      </li>
    </ul>
  </Tab>
  <Tab>
    <ul className="list-disc space-y-2 pl-6">
      <li>
        <strong>loop.results</strong>：所有迭代结果的数组
      </li>
      <li>
        <strong>结构</strong>：结果保持迭代顺序
      </li>
      <li>
        <strong>访问</strong>：在循环后的块中可用
      </li>
    </ul>
  </Tab>
</Tabs>

## 最佳实践

- **设置合理的限制**：保持迭代次数在合理范围内，以避免长时间的执行
- **对集合使用 ForEach**：在处理数组或对象时，使用 ForEach 而不是 For 循环
- **优雅地处理错误**：考虑在循环中添加错误处理，以实现更健壮的工作流程
```

--------------------------------------------------------------------------------

````
