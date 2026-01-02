---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 191
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 191 of 933)

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

---[FILE: workflow-variables.mdx]---
Location: sim-main/apps/docs/content/docs/fr/variables/workflow-variables.mdx

```text
---
title: Variables de flux de travail
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

Les variables dans Sim agissent comme un stockage global de données qui peuvent être consultées et modifiées par n'importe quel bloc dans votre flux de travail, vous permettant de stocker et partager des données à travers votre flux de travail avec des variables globales. Elles offrent un moyen puissant de partager des informations entre différentes parties de votre flux de travail, de maintenir un état et de créer des applications plus dynamiques.

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="variables.mp4" />
</div>

<Callout type="info">
  Les variables vous permettent de stocker et partager des données à travers tout votre flux de travail, facilitant le maintien d'état et la création de systèmes complexes et interconnectés.
</Callout>

## Aperçu

La fonctionnalité Variables sert de stockage central de données pour votre flux de travail, vous permettant de :

<Steps>
  <Step>
    <strong>Stocker des données globales</strong> : créer des variables qui persistent tout au long de l'exécution du flux de travail
  </Step>
  <Step>
    <strong>Partager des informations entre les blocs</strong> : accéder aux mêmes données depuis n'importe quel bloc dans votre flux de travail
  </Step>
  <Step>
    <strong>Maintenir l'état du flux de travail</strong> : suivre les valeurs importantes pendant l'exécution de votre flux de travail
  </Step>
  <Step>
    <strong>Créer des flux de travail dynamiques</strong> : construire des systèmes plus flexibles qui peuvent s'adapter en fonction des valeurs stockées
  </Step>
</Steps>

## Création de variables

Vous pouvez créer et gérer des variables depuis le panneau Variables dans la barre latérale. Chaque variable possède :

- **Nom** : un identifiant unique utilisé pour référencer la variable
- **Valeur** : les données stockées dans la variable (prend en charge divers types de données)
- **Description** (facultative) : une note expliquant l'objectif de la variable

## Accès aux variables

Les variables sont accessibles depuis n'importe quel bloc dans votre flux de travail en utilisant le menu déroulant des variables. Il suffit de :

1. Tapez `<` dans n'importe quel champ de texte à l'intérieur d'un bloc
2. Parcourez le menu déroulant pour sélectionner parmi les variables disponibles
3. Sélectionnez la variable que vous souhaitez utiliser

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="variables-dropdown.mp4" />
</div>

<Callout>
  Vous pouvez également faire glisser l'étiquette de connexion dans un champ pour ouvrir le menu déroulant des variables et accéder
  aux variables disponibles.
</Callout>

## Types de variables

Les variables dans Sim peuvent stocker différents types de données :

<Tabs items={['Text', 'Numbers', 'Boolean', 'Objects', 'Arrays']}>
  <Tab>

    ```
    "Hello, World!"
    ```

    <p className="mt-2">Les variables de texte stockent des chaînes de caractères. Elles sont utiles pour stocker des messages, des noms et d'autres données textuelles.</p>
  </Tab>
  <Tab>

    ```
    42
    ```

    <p className="mt-2">Les variables numériques stockent des valeurs numériques qui peuvent être utilisées dans des calculs ou des comparaisons.</p>
  </Tab>
  <Tab>

    ```
    true
    ```

    <p className="mt-2">Les variables booléennes stockent des valeurs vrai/faux, parfaites pour les indicateurs et les vérifications de conditions.</p>
  </Tab>
  <Tab>

    ```json
    {
      "name": "John",
      "age": 30,
      "city": "New York"
    }
    ```

    <p className="mt-2">Les variables d'objet stockent des données structurées avec des propriétés et des valeurs.</p>
  </Tab>
  <Tab>

    ```json
    [1, 2, 3, "four", "five"]
    ```

    <p className="mt-2">Les variables de tableau stockent des collections ordonnées d'éléments.</p>
  </Tab>
</Tabs>

## Utilisation des variables dans les blocs

Lorsque vous accédez à une variable depuis un bloc, vous pouvez :

- **Lire sa valeur** : utiliser la valeur actuelle de la variable dans la logique de votre bloc
- **La modifier** : mettre à jour la valeur de la variable en fonction du traitement de votre bloc
- **L'utiliser dans des expressions** : inclure des variables dans des expressions et des calculs

## Portée des variables

Les variables dans Sim ont une portée globale, ce qui signifie :

- Elles sont accessibles depuis n'importe quel bloc de votre flux de travail
- Les modifications apportées aux variables persistent tout au long de l'exécution du flux de travail
- Les variables conservent leurs valeurs entre les exécutions, sauf si elles sont explicitement réinitialisées

## Bonnes pratiques

- **Utilisez des noms descriptifs** : choisissez des noms de variables qui indiquent clairement ce que la variable représente. Par exemple, utilisez `userPreferences` au lieu de `up`.
- **Documentez vos variables** : ajoutez des descriptions à vos variables pour aider les autres membres de l'équipe à comprendre leur objectif et leur utilisation.
- **Tenez compte de la portée des variables** : n'oubliez pas que les variables sont globales et peuvent être modifiées par n'importe quel bloc. Concevez votre flux de travail en tenant compte de cela pour éviter un comportement inattendu.
- **Initialisez les variables tôt** : configurez et initialisez vos variables au début de votre flux de travail pour vous assurer qu'elles sont disponibles lorsque nécessaire.
- **Gérez les variables manquantes** : tenez toujours compte du cas où une variable pourrait ne pas encore exister ou pourrait avoir une valeur inattendue. Ajoutez une validation appropriée dans vos blocs.
- **Limitez le nombre de variables** : gardez le nombre de variables gérable. Trop de variables peuvent rendre votre flux de travail difficile à comprendre et à maintenir.
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/ja/index.mdx

```text
---
title: ドキュメント
---

import { Card, Cards } from 'fumadocs-ui/components/card'

# Simドキュメント

Simへようこそ。AIアプリケーション用のビジュアルワークフロービルダーです。キャンバス上でブロックを接続することで、強力なAIエージェント、自動化ワークフロー、データ処理パイプラインを構築できます。

## クイックスタート

<Cards>
  <Card title="はじめに" href="/introduction">
    Simで構築できるものについて学ぶ
  </Card>
  <Card title="使い方ガイド" href="/getting-started">
    10分で最初のワークフローを作成
  </Card>
  <Card title="ワークフローブロック" href="/blocks">
    構成要素について学ぶ
  </Card>
  <Card title="ツールと連携機能" href="/tools">
    80以上の組み込み連携機能を探索
  </Card>
</Cards>

## 基本概念

<Cards>
  <Card title="接続" href="/connections">
    ブロック間のデータフローを理解する
  </Card>
  <Card title="変数" href="/variables">
    ワークフロー変数と環境変数を使用する
  </Card>
  <Card title="実行" href="/execution">
    ワークフロー実行を監視しコストを管理する
  </Card>
  <Card title="トリガー" href="/triggers">
    API、ウェブフック、スケジュールでワークフローを開始する
  </Card>
</Cards>

## 高度な機能

<Cards>
  <Card title="チーム管理" href="/permissions/roles-and-permissions">
    ワークスペースの役割と権限を設定する
  </Card>
  <Card title="MCP統合" href="/mcp">
    モデルコンテキストプロトコルで外部サービスを接続する
  </Card>
  <Card title="SDK" href="/sdks">
    アプリケーションにSimを統合する
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

---[FILE: agent.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/agent.mdx

```text
---
title: エージェント
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

エージェントブロックはワークフローを大規模言語モデル（LLM）に接続します。自然言語入力を処理し、外部ツールを呼び出し、構造化または非構造化の出力を生成します。

<div className="flex justify-center">
  <Image
    src="/static/blocks/agent.png"
    alt="エージェントブロックの設定"
    width={500}
    height={400}
    className="my-6"
  />
</div> 

## 設定オプション

### システムプロンプト

システムプロンプトはエージェントの操作パラメータと動作制約を確立します。この設定はエージェントの役割、応答方法、およびすべての受信リクエストの処理境界を定義します。

```markdown
You are a helpful assistant that specializes in financial analysis.
Always provide clear explanations and cite sources when possible.
When responding to questions about investments, include risk disclaimers.
```

### ユーザープロンプト

ユーザープロンプトは推論処理のための主要な入力データを表します。このパラメータはエージェントが分析して応答する自然言語テキストまたは構造化データを受け入れます。入力ソースには以下が含まれます：

- **静的設定**: ブロック設定で指定された直接テキスト入力
- **動的入力**: 接続インターフェースを通じて上流ブロックから渡されるデータ
- **実行時生成**: ワークフロー実行中にプログラムによって生成されるコンテンツ

### モデル選択

エージェントブロックは統一された推論インターフェースを通じて複数のLLMプロバイダーをサポートしています。利用可能なモデルには以下が含まれます：

- **OpenAI**: GPT-5.1、GPT-5、GPT-4o、o1、o3、o4-mini、gpt-4.1
- **Anthropic**: Claude 4.5 Sonnet、Claude Opus 4.1
- **Google**: Gemini 2.5 Pro、Gemini 2.0 Flash
- **その他のプロバイダー**: Groq、Cerebras、xAI、Azure OpenAI、OpenRouter
- **ローカルモデル**: OllamaまたはVLLM互換モデル

### 温度

応答のランダム性と創造性を制御します：

- **低（0-0.3）**: 決定論的で焦点が絞られています。事実に基づくタスクと精度に最適。
- **中（0.3-0.7）**: 創造性と焦点のバランスが取れています。一般的な用途に適しています。
- **高（0.7-2.0）**: 創造的で多様です。ブレインストーミングやコンテンツ生成に理想的。

### APIキー

選択したLLMプロバイダーのAPIキー。これは安全に保存され、認証に使用されます。

### ツール

外部連携でエージェントの機能を拡張します。60以上の事前構築されたツールから選択するか、カスタム関数を定義します。

**利用可能なカテゴリー:**
- **コミュニケーション**: Gmail、Slack、Telegram、WhatsApp、Microsoft Teams
- **データソース**: Notion、Google Sheets、Airtable、Supabase、Pinecone
- **ウェブサービス**: Firecrawl、Google検索、Exa AI、ブラウザ自動化
- **開発**: GitHub、Jira、Linear
- **AIサービス**: OpenAI、Perplexity、Hugging Face、ElevenLabs

**実行モード:**
- **自動**: モデルがコンテキストに基づいてツールを使用するタイミングを決定
- **必須**: すべてのリクエストでツールを呼び出す必要がある
- **なし**: ツールは利用可能だがモデルに提案されない

### レスポンスフォーマット

レスポンスフォーマットパラメータは、JSONスキーマ検証を通じて構造化された出力生成を強制します。これにより、事前定義されたデータ構造に準拠した一貫性のある機械可読なレスポンスが保証されます：

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

この設定はモデルの出力を指定されたスキーマに準拠するよう制約し、自由形式のテキスト応答を防ぎ、構造化データの生成を確保します。

### 結果へのアクセス

エージェントが完了すると、その出力にアクセスできます：

- **`<agent.content>`**: エージェントの応答テキストまたは構造化データ
- **`<agent.tokens>`**: トークン使用統計（プロンプト、完了、合計）
- **`<agent.tool_calls>`**: エージェントが実行中に使用したツールの詳細
- **`<agent.cost>`**: APIコールの推定コスト（利用可能な場合）

## 高度な機能

### メモリ + エージェント: 会話履歴

一貫した`id`（例えば、`chat`）を持つ`Memory`ブロックを使用して、実行間でメッセージを保持し、その履歴をエージェントのプロンプトに含めます。

- エージェントの前にユーザーのメッセージを追加
- コンテキストのために会話履歴を読み取る
- エージェントの実行後に返信を追加

詳細については、[`Memory`](/tools/memory)ブロックのリファレンスをご覧ください。

## 出力

- **`<agent.content>`**: エージェントの応答テキスト
- **`<agent.tokens>`**: トークン使用統計
- **`<agent.tool_calls>`**: ツール実行の詳細
- **`<agent.cost>`**: 推定APIコール費用

## 使用例

**カスタマーサポートの自動化** - データベースとツールアクセスを使用して問い合わせに対応

```
API (Ticket) → Agent (Postgres, KB, Linear) → Gmail (Reply) → Memory (Save)
```

**マルチモデルコンテンツ分析** - 異なるAIモデルでコンテンツを分析

```
Function (Process) → Agent (GPT-4o Technical) → Agent (Claude Sentiment) → Function (Report)
```

**ツール活用型リサーチアシスタント** - ウェブ検索とドキュメントアクセスで調査

```
Input → Agent (Google Search, Notion) → Function (Compile Report)
```

## ベストプラクティス

- **システムプロンプトで具体的に指示する**: エージェントの役割、トーン、制限を明確に定義してください。指示が具体的であればあるほど、エージェントは目的を果たすことができます。
- **適切な温度設定を選択する**: 正確さが重要な場合は低い温度設定（0〜0.3）を使用し、よりクリエイティブまたは多様な応答には温度を上げる（0.7〜2.0）
- **ツールを効果的に活用する**: エージェントの目的を補完し、その能力を強化するツールを統合してください。エージェントに負担をかけないよう、提供するツールを選択的にしてください。重複の少ないタスクには、最良の結果を得るために別のエージェントブロックを使用してください。
```

--------------------------------------------------------------------------------

---[FILE: api.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/api.mdx

```text
---
title: API
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

APIブロックは、HTTPリクエストを通じてワークフローを外部サービスに接続します。REST APIとの対話のために、GET、POST、PUT、DELETE、PATCHメソッドをサポートしています。

<div className="flex justify-center">
  <Image
    src="/static/blocks/api.png"
    alt="APIブロック"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 設定オプション

### URL

APIリクエストのエンドポイントURL。以下のいずれかになります：

- ブロックに直接入力された静的URL
- 別のブロックの出力から接続された動的URL
- パスパラメータを含むURL

### メソッド

リクエストに使用するHTTPメソッドを選択します：

- **GET**: サーバーからデータを取得する
- **POST**: リソースを作成するためにサーバーにデータを送信する
- **PUT**: サーバー上の既存のリソースを更新する
- **DELETE**: サーバーからリソースを削除する
- **PATCH**: 既存のリソースを部分的に更新する

### クエリパラメータ

URLにクエリパラメータとして追加されるキーと値のペアを定義します。例えば：

```
Key: apiKey
Value: your_api_key_here

Key: limit
Value: 10
```

これらはURLに `?apiKey=your_api_key_here&limit=10` として追加されます。

### ヘッダー

リクエストのHTTPヘッダーを設定します。一般的なヘッダーには以下があります：

```
Key: Content-Type
Value: application/json

Key: Authorization
Value: Bearer your_token_here
```

### リクエストボディ

リクエストボディをサポートするメソッド（POST、PUT、PATCH）では、送信するデータを定義できます。ボディは以下のいずれかになります：

- ブロックに直接入力されたJSONデータ
- 別のブロックの出力から接続されたデータ
- ワークフロー実行中に動的に生成されたデータ

### 結果へのアクセス

APIリクエストが完了すると、以下の出力にアクセスできます：

- **`<api.data>`**: APIからのレスポンスボディデータ
- **`<api.status>`**: HTTPステータスコード（200、404、500など）
- **`<api.headers>`**: サーバーからのレスポンスヘッダー
- **`<api.error>`**: リクエストが失敗した場合のエラー詳細

## 高度な機能

### 動的URL構築

前のブロックの変数を使用して動的にURLを構築します：

```javascript
// In a Function block before the API
const userId = <start.userId>;
const apiUrl = `https://api.example.com/users/${userId}/profile`;
```

### リクエストの再試行

APIブロックは自動的に以下を処理します：
- 指数バックオフによるネットワークタイムアウト
- レート制限レスポンス（429ステータスコード）
- 再試行ロジックによるサーバーエラー（5xxステータスコード）
- 再接続試行による接続失敗

### レスポンス検証

処理前にAPIレスポンスを検証します：

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

## 出力

- **`<api.data>`**: APIからのレスポンスボディデータ
- **`<api.status>`**: HTTPステータスコード
- **`<api.headers>`**: レスポンスヘッダー
- **`<api.error>`**: リクエストが失敗した場合のエラー詳細

## 使用例

**ユーザープロファイルデータの取得** - 外部サービスからユーザー情報を取得する

```
Function (Build ID) → API (GET /users/{id}) → Function (Format) → Response
```

**決済処理** - Stripe APIを通じて決済を処理する

```
Function (Validate) → API (Stripe) → Condition (Success) → Supabase (Update)
```

## ベストプラクティス

- **機密データには環境変数を使用する**: APIキーや認証情報をハードコードしないでください
- **エラーを適切に処理する**: 失敗したリクエストにはエラー処理ロジックを接続してください
- **レスポンスを検証する**: データを処理する前にステータスコードとレスポンス形式を確認してください
- **レート制限を尊重する**: APIのレート制限に注意し、適切なスロットリングを実装してください
```

--------------------------------------------------------------------------------

---[FILE: condition.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/condition.mdx

```text
---
title: 条件
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

条件ブロックは、ブール式に基づいてワークフローの実行を分岐させます。以前のブロック出力を使用して条件を評価し、LLMを必要とせずに異なるパスにルーティングします。

<div className="flex justify-center">
  <Image
    src="/static/blocks/condition.png"
    alt="条件ブロック"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 設定オプション

### 条件

評価される1つ以上の条件を定義します。各条件には以下が含まれます：

- **式**: trueまたはfalseに評価されるJavaScript/TypeScript式
- **パス**: 条件がtrueの場合にルーティングする宛先ブロック
- **説明**: 条件が何をチェックするかの任意の説明

複数の条件を作成でき、順番に評価されます。最初にマッチした条件が実行パスを決定します。

### 条件式のフォーマット

条件はJavaScript構文を使用し、前のブロックからの入力値を参照できます。

<Tabs items={['スコアしきい値', 'テキスト分析', '複数条件']}>
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

### 結果へのアクセス

条件が評価された後、以下の出力にアクセスできます：

- **condition.result**: 条件評価のブール結果
- **condition.matched_condition**: マッチした条件のID
- **condition.content**: 評価結果の説明
- **condition.path**: 選択されたルーティング先の詳細

## 高度な機能

### 複雑な式

条件内でJavaScriptの演算子や関数を使用できます：

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

### 複数条件の評価

条件は一致するものが見つかるまで順番に評価されます：

```javascript
// Condition 1: Check for high priority
<ticket.priority> === 'high'

// Condition 2: Check for urgent keywords
<ticket.subject>.toLowerCase().includes('urgent')

// Condition 3: Default fallback
true
```

### エラー処理

条件は以下を自動的に処理します：
- 未定義またはnull値の安全な評価
- 型の不一致に対する適切なフォールバック
- 無効な式のエラーログ記録
- 欠落した変数のデフォルト値処理

## 出力

- **`<condition.result>`**: 評価の真偽結果
- **`<condition.matched_condition>`**: マッチした条件のID
- **`<condition.content>`**: 評価結果の説明
- **`<condition.path>`**: 選択されたルーティング先の詳細

## 使用例

**カスタマーサポートのルーティング** - 優先度に基づいてチケットをルーティング

```
API (Ticket) → Condition (priority === 'high') → Agent (Escalation) or Agent (Standard)
```

**コンテンツモデレーション** - 分析に基づいてコンテンツをフィルタリング

```
Agent (Analyze) → Condition (toxicity > 0.7) → Moderation or Publish
```

**ユーザーオンボーディングフロー** - ユーザータイプに基づいてオンボーディングをパーソナライズ

```
Function (Process) → Condition (account_type === 'enterprise') → Advanced or Simple
```

## ベストプラクティス

- **条件を正しく順序付ける**: より具体的な条件を一般的な条件の前に配置して、特定のロジックがフォールバックよりも優先されるようにします
- **必要に応じてelse分岐を使用する**: 条件が一致せず、else分岐が接続されていない場合、ワークフロー分岐は正常に終了します。一致しないケースのフォールバックパスが必要な場合は、else分岐を接続してください
- **式をシンプルに保つ**: 読みやすさとデバッグのしやすさのために、明確で簡潔なブール式を使用します
- **条件を文書化する**: チームのコラボレーションとメンテナンスを向上させるために、各条件の目的を説明する説明を追加します
- **エッジケースをテストする**: 条件範囲の境界値でテストすることで、条件が境界値を正しく処理することを確認します
```

--------------------------------------------------------------------------------

---[FILE: evaluator.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/evaluator.mdx

```text
---
title: 評価者
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

評価ブロックはAIを使用してコンテンツの品質をカスタムメトリクスに対してスコア化し評価します。品質管理、A/Bテスト、AIの出力が特定の基準を満たしているかの確認に最適です。

<div className="flex justify-center">
  <Image
    src="/static/blocks/evaluator.png"
    alt="評価者ブロックの設定画面"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 設定オプション

### 評価メトリクス

コンテンツを評価するためのカスタムメトリクスを定義します。各メトリクスには以下が含まれます：

- **名前**：メトリクスの短い識別子
- **説明**：メトリクスが測定する内容の詳細な説明
- **範囲**：スコアリングの数値範囲（例：1-5、0-10）

メトリクスの例：

```
Accuracy (1-5): How factually accurate is the content?
Clarity (1-5): How clear and understandable is the content?
Relevance (1-5): How relevant is the content to the original query?
```

### コンテンツ

評価されるコンテンツ。これは以下のいずれかです：

- ブロック設定で直接提供される
- 別のブロックの出力（通常はエージェントブロック）から接続される
- ワークフロー実行中に動的に生成される

### モデル選択

評価を実行するAIモデルを選択します：

- **OpenAI**: GPT-4o、o1、o3、o4-mini、gpt-4.1
- **Anthropic**: Claude 3.7 Sonnet
- **Google**: Gemini 2.5 Pro、Gemini 2.0 Flash
- **Other Providers**: Groq、Cerebras、xAI、DeepSeek
- **Local Models**: OllamaまたはVLLM互換モデル

最良の結果を得るには、GPT-4oやClaude 3.7 Sonnetなど、強力な推論能力を持つモデルを使用してください。

### APIキー

選択したLLMプロバイダーのAPIキー。これは安全に保存され、認証に使用されます。

## 使用例

**コンテンツ品質評価** - 公開前にコンテンツを評価する

```
Agent (Generate) → Evaluator (Score) → Condition (Check threshold) → Publish or Revise
```

**A/Bテストコンテンツ** - 複数のAI生成レスポンスを比較する

```
Parallel (Variations) → Evaluator (Score Each) → Function (Select Best) → Response
```

**カスタマーサポート品質管理** - 応答が品質基準を満たしていることを確認する

```
Agent (Support Response) → Evaluator (Score) → Function (Log) → Condition (Review if Low)
```

## 出力

- **`<evaluator.content>`**: 評価のスコア付きサマリー
- **`<evaluator.model>`**: 評価に使用されたモデル
- **`<evaluator.tokens>`**: トークン使用統計
- **`<evaluator.cost>`**: 推定評価コスト

## ベストプラクティス

- **具体的な指標の説明を使用する**: 各指標が何を測定するかを明確に定義し、より正確な評価を得る
- **適切な範囲を選択する**: 過度に複雑にならない程度に十分な粒度を提供するスコアリング範囲を選択する
- **エージェントブロックと連携する**: 評価ブロックを使用してエージェントブロックの出力を評価し、フィードバックループを作成する
- **一貫した指標を使用する**: 比較分析のために、類似の評価間で一貫した指標を維持する
- **複数の指標を組み合わせる**: 包括的な評価を得るために複数の指標を使用する
```

--------------------------------------------------------------------------------

---[FILE: function.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/function.mdx

```text
---
title: 関数
---

import { Image } from '@/components/ui/image'

ファンクションブロックは、ワークフローでカスタムJavaScriptまたはTypeScriptコードを実行します。データの変換、計算の実行、またはカスタムロジックの実装が可能です。

<div className="flex justify-center">
  <Image
    src="/static/blocks/function.png"
    alt="コードエディタ付き関数ブロック"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 出力

- **`<function.result>`**: 関数から返される値
- **`<function.stdout>`**: コードからのconsole.log()出力

## 使用例

**データ処理パイプライン** - APIレスポンスを構造化データに変換

```
API (Fetch) → Function (Process & Validate) → Function (Calculate Metrics) → Response
```

**ビジネスロジックの実装** - ロイヤルティスコアとランクの計算

```
Agent (Get History) → Function (Calculate Score) → Function (Determine Tier) → Condition (Route)
```

**データの検証とサニタイズ** - ユーザー入力の検証とクリーニング

```
Input → Function (Validate & Sanitize) → API (Save to Database)
```

### 例：ロイヤルティスコア計算機

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

## ベストプラクティス

- **関数を集中させる**: 保守性とデバッグを向上させるために、一つのことをうまく行う関数を書く
- **エラーを適切に処理する**: try/catchブロックを使用して潜在的なエラーを処理し、意味のあるエラーメッセージを提供する
- **エッジケースをテストする**: 異常な入力、null値、境界条件を正しく処理することを確認する
- **パフォーマンスを最適化する**: 大規模なデータセットに対する計算の複雑さとメモリ使用量に注意する
- **デバッグにconsole.log()を使用する**: 関数の実行をデバッグおよび監視するためにstdout出力を活用する
```

--------------------------------------------------------------------------------

---[FILE: guardrails.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/guardrails.mdx

```text
---
title: ガードレール
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

ガードレールブロックは、複数の検証タイプに対してコンテンツをチェックすることで、AIワークフローを検証し保護します。データ品質の確保、ハルシネーション（幻覚）の防止、個人情報の検出、フォーマット要件の強制などをワークフローに組み込む前に行います。

<div className="flex justify-center">
  <Image
    src="/static/blocks/guardrails.png"
    alt="ガードレールブロック"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 検証タイプ

### JSON検証

コンテンツが適切にフォーマットされたJSONであることを検証します。構造化されたLLM出力を安全に解析できることを確認するのに最適です。

**ユースケース:**
- 解析前にエージェントブロックからのJSON応答を検証
- APIペイロードが適切にフォーマットされていることを確認
- 構造化データの整合性をチェック

**出力:**
- `passed`: 有効なJSONの場合は `true`、それ以外の場合は `false`
- `error`: 検証が失敗した場合のエラーメッセージ（例：「無効なJSON：予期しないトークン...」）

### 正規表現検証

コンテンツが指定された正規表現パターンに一致するかどうかをチェックします。

**ユースケース:**
- メールアドレスの検証
- 電話番号形式のチェック
- URLやカスタム識別子の確認
- 特定のテキストパターンの強制

**設定:**
- **正規表現パターン**: 照合する正規表現（例：メールの場合は `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`）

**出力:**
- `passed`: コンテンツがパターンに一致する場合は `true`、それ以外の場合は `false`
- `error`: 検証が失敗した場合のエラーメッセージ

### 幻覚検出

検索拡張生成（RAG）とLLMスコアリングを使用して、AI生成コンテンツがナレッジベースと矛盾している場合や、ナレッジベースに根拠がない場合を検出します。

**仕組み:**
1. 関連するコンテキストについてナレッジベースに問い合わせる
2. AI出力と取得したコンテキストの両方をLLMに送信
3. LLMが信頼度スコア（0〜10のスケール）を割り当てる
   - **0** = 完全な幻覚（まったく根拠なし）
   - **10** = 完全に根拠あり（ナレッジベースで完全にサポートされている）
4. スコアが閾値以上（デフォルト：3）であれば検証に合格

**設定:**
- **ナレッジベース**: 既存のナレッジベースから選択
- **モデル**: スコアリング用のLLMを選択（強力な推論能力が必要 - GPT-4o、Claude 3.7 Sonnetを推奨）
- **APIキー**: 選択したLLMプロバイダーの認証（ホスト型/OllamaまたはVLLM互換モデルの場合は自動的に非表示）
- **信頼度しきい値**: 合格するための最小スコア（0-10、デフォルト: 3）
- **Top K**（高度な設定）: 取得するナレッジベースのチャンク数（デフォルト: 10）

**出力:**
- `passed`: 信頼度スコア ≥ しきい値の場合は `true`
- `score`: 信頼度スコア（0-10）
- `reasoning`: スコアに対するLLMの説明
- `error`: 検証が失敗した場合のエラーメッセージ

**ユースケース:**
- ドキュメントに対するエージェントの回答を検証
- カスタマーサポートの回答が事実に基づいていることを確認
- 生成されたコンテンツがソース資料と一致することを確認
- RAGアプリケーションの品質管理

### PII検出

Microsoft Presidioを使用して個人を特定できる情報を検出します。複数の国と言語にわたる40以上のエンティティタイプをサポートしています。

<div className="flex justify-center">
  <Image
    src="/static/blocks/guardrails-2.png"
    alt="PII検出の設定"
    width={700}
    height={450}
    className="my-6"
  />
</div>

**仕組み:**
1. 検証するコンテンツを渡す（例：`<agent1.content>`）
2. モーダルセレクターを使用して検出するPIIタイプを選択
3. 検出モード（検出またはマスク）を選択
4. コンテンツが一致するPIIエンティティをスキャン
5. 検出結果と、オプションでマスクされたテキストを返す

<div className="mx-auto w-3/5 overflow-hidden rounded-lg">
  <Video src="guardrails.mp4" width={500} height={350} />
</div>

**設定:**
- **検出するPIIタイプ**: モーダルセレクターからグループ化されたカテゴリを選択
  - **一般**: 人名、メール、電話番号、クレジットカード、IPアドレスなど
  - **アメリカ**: 社会保障番号、運転免許証、パスポートなど
  - **イギリス**: NHS番号、国民保険番号
  - **スペイン**: NIF、NIE、CIF
  - **イタリア**: 納税者番号、運転免許証、VAT番号
  - **ポーランド**: PESEL、NIP、REGON
  - **シンガポール**: NRIC/FIN、UEN
  - **オーストラリア**: ABN、ACN、TFN、Medicare
  - **インド**: Aadhaar、PAN、パスポート、有権者番号
- **モード**: 
  - **検出**: PIIを識別するのみ（デフォルト）
  - **マスク**: 検出されたPIIをマスク値に置き換え
- **言語**: 検出言語（デフォルト：英語）

**出力:**
- `passed`: 選択したPIIタイプが検出された場合は `false`
- `detectedEntities`: タイプ、位置、信頼度を含む検出されたPIIの配列
- `maskedText`: PIIがマスクされたコンテンツ（モード = "Mask"の場合のみ）
- `error`: 検証が失敗した場合のエラーメッセージ

**ユースケース:**
- 機密性の高い個人情報を含むコンテンツをブロック
- データのログ記録や保存前にPIIをマスク
- GDPR、HIPAA、その他のプライバシー規制への準拠
- 処理前のユーザー入力のサニタイズ

## 設定

### 検証するコンテンツ

検証する入力コンテンツ。通常、以下から取得されます：
- エージェントブロックの出力: `<agent.content>`
- 関数ブロックの結果: `<function.output>`
- APIレスポンス: `<api.output>`
- その他のブロック出力

### 検証タイプ

4つの検証タイプから選択：
- **有効なJSON**: コンテンツが適切にフォーマットされたJSONかどうかを確認
- **正規表現マッチ**: コンテンツが正規表現パターンに一致するか検証
- **幻覚チェック**: LLMスコアリングによる知識ベースとの検証
- **PII検出**: 個人を特定できる情報を検出し、オプションでマスク

## 出力

すべての検証タイプは以下を返します：

- **`<guardrails.passed>`**: 検証が成功したかどうかを示すブール値
- **`<guardrails.validationType>`**: 実行された検証のタイプ
- **`<guardrails.input>`**: 検証された元の入力
- **`<guardrails.error>`**: 検証が失敗した場合のエラーメッセージ（オプション）

タイプ別の追加出力：

**幻覚チェック:**
- **`<guardrails.score>`**: 信頼度スコア（0-10）
- **`<guardrails.reasoning>`**: LLMの説明

**PII検出:**
- **`<guardrails.detectedEntities>`**: 検出されたPIIエンティティの配列
- **`<guardrails.maskedText>`**: PIIがマスクされたコンテンツ（モード = "マスク"の場合）

## ユースケース例

**解析前のJSONの検証** - エージェント出力が有効なJSONであることを確認

```
Agent (Generate) → Guardrails (Validate) → Condition (Check passed) → Function (Parse)
```

**幻覚の防止** - カスタマーサポートの回答を知識ベースと照合して検証

```
Agent (Response) → Guardrails (Check KB) → Condition (Score ≥ 3) → Send or Flag
```

**ユーザー入力のPIIをブロック** - ユーザーが提出したコンテンツをサニタイズ

```
Input → Guardrails (Detect PII) → Condition (No PII) → Process or Reject
```

## ベストプラクティス

- **条件ブロックと連携**: `<guardrails.passed>`を使用して検証結果に基づいてワークフローロジックを分岐
- **解析前のJSON検証**: LLM出力を解析する前に常にJSON構造を検証
- **適切なPIIタイプの選択**: パフォーマンス向上のため、ユースケースに関連するPIIエンティティタイプのみを選択
- **合理的な信頼度しきい値の設定**: 幻覚検出では、精度要件に基づいてしきい値を調整（高い = より厳格）
- **幻覚検出には強力なモデルを使用**: GPT-4oまたはClaude 3.7 Sonnetはより正確な信頼度スコアリングを提供
- **ログ記録用のPIIマスク**: PIIを含む可能性のあるコンテンツをログに記録または保存する場合は「マスク」モードを使用
- **正規表現パターンのテスト**: 本番環境にデプロイする前に正規表現パターンを徹底的に検証
- **検証失敗の監視**: `<guardrails.error>`メッセージを追跡して一般的な検証問題を特定

<Callout type="info">
  ガードレールの検証はワークフローで同期的に行われます。幻覚検出については、レイテンシーが重要な場合は、より高速なモデル（GPT-4o-miniなど）を選択してください。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: human-in-the-loop.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/human-in-the-loop.mdx

```text
---
title: ヒューマン・イン・ザ・ループ
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

ヒューマン・イン・ザ・ループブロックは、ワークフローの実行を一時停止し、続行する前に人間の介入を待ちます。承認ゲート、フィードバックの収集、または重要な決断ポイントでの追加入力の収集に使用します。

<div className="flex justify-center">
  <Image
    src="/static/blocks/hitl-1.png"
    alt="ヒューマン・イン・ザ・ループブロックの設定"
    width={500}
    height={400}
    className="my-6"
  />
</div>

実行がこのブロックに到達すると、承認ポータル、API、またはウェブフックを通じて人間が入力を提供するまで、ワークフローは無期限に一時停止します。

<div className="flex justify-center">
  <Image
    src="/static/blocks/hitl-2.png"
    alt="ヒューマン・イン・ザ・ループ承認ポータル"
    width={700}
    height={500}
    className="my-6"
  />
</div>

## 設定オプション

### 一時停止出力

承認者に表示されるデータを定義します。これは承認ポータルに表示されるコンテキストで、情報に基づいた決定を下すのに役立ちます。

ビジュアルビルダーまたはJSONエディタを使用してデータを構造化します。`<blockName.output>` 構文を使用してワークフロー変数を参照します。

```json
{
  "customerName": "<agent1.content.name>",
  "proposedAction": "<router1.selectedPath>",
  "confidenceScore": "<evaluator1.score>",
  "generatedEmail": "<agent2.content>"
}
```

### 通知

承認が必要な場合に承認者に警告する方法を設定します。サポートされているチャネルには以下が含まれます：

- **Slack** - チャンネルまたはDMへのメッセージ
- **Gmail** - 承認リンク付きのメール
- **Microsoft Teams** - チームチャンネル通知
- **SMS** - Twilioを介したテキストアラート
- **Webhooks** - カスタム通知システム

承認者がポータルにアクセスできるように、通知メッセージに承認URL（`<blockId.url>`）を含めてください。

### 再開入力

承認者が応答時に入力するフィールドを定義します。このデータは、ワークフローが再開された後、下流のブロックで利用可能になります。

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

`<blockId.resumeInput.fieldName>`を使用して、下流のブロックで再開データにアクセスします。

## 承認方法

<Tabs items={['承認ポータル', 'API', 'Webhook']}>
  <Tab>
    ### 承認ポータル
    
    各ブロックは一意のポータルURL（`<blockId.url>`）を生成し、一時停止された出力データとレジューム入力用のフォームフィールドを表示する視覚的インターフェースを提供します。モバイル対応で安全です。
    
    承認者が確認して応答できるよう、通知でこのURLを共有してください。
  </Tab>
  <Tab>
    ### REST API
    
    プログラムでワークフローを再開します：
    

    ```bash
    POST /api/workflows/{workflowId}/executions/{executionId}/resume/{blockId}
    
    {
      "approved": true,
      "comments": "Looks good to proceed"
    }
    ```

    
    カスタム承認UIを構築したり、既存のシステムと統合したりできます。
  </Tab>
  <Tab>
    ### Webhook
    
    通知セクションにWebhookツールを追加して、外部システムに承認リクエストを送信します。JiraやServiceNowなどのチケットシステムと統合できます。
  </Tab>
</Tabs>

## 一般的なユースケース

**コンテンツ承認** - 公開前にAI生成コンテンツをレビュー

```
Agent → Human in the Loop → API (Publish)
```

**複数段階の承認** - 重要な決定のために複数の承認ステップを連鎖

```
Agent → Human in the Loop (Manager) → Human in the Loop (Director) → Execute
```

**データ検証** - 処理前に抽出されたデータを確認

```
Agent (Extract) → Human in the Loop (Validate) → Function (Process)
```

**品質管理** - 顧客に送信する前にAI出力をレビュー

```
Agent (Generate) → Human in the Loop (QA) → Gmail (Send)
```

## ブロック出力

**`url`** - 承認ポータルの一意のURL  
**`resumeInput.*`** - レジューム入力で定義されたすべてのフィールドは、ワークフローが再開された後に利用可能になります

`<blockId.resumeInput.fieldName>`を使用してアクセスします。

## 例

**一時停止された出力：**

```json
{
  "title": "<agent1.content.title>",
  "body": "<agent1.content.body>",
  "qualityScore": "<evaluator1.score>"
}
```

**レジューム入力：**

```json
{
  "approved": { "type": "boolean" },
  "feedback": { "type": "string" }
}
```

**下流での使用：**

```javascript
// Condition block
<approval1.resumeInput.approved> === true
```

以下の例は、ワークフローが一時停止された後に承認者が見る承認ポータルを示しています。承認者はデータを確認し、ワークフロー再開の一部として入力を提供できます。承認ポータルは、固有のURL、`<blockId.url>`から直接アクセスできます。

<div className="mx-auto w-full overflow-hidden rounded-lg my-6">
  <Video src="hitl-resume.mp4" width={700} height={450} />
</div>

## 関連ブロック

- **[条件](/blocks/condition)** - 承認決定に基づいて分岐
- **[変数](/blocks/variables)** - 承認履歴とメタデータを保存
- **[レスポンス](/blocks/response)** - ワークフロー結果をAPIコーラーに返す
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/ja/blocks/index.mdx

```text
---
title: 概要
description: AIワークフローの構成要素
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Video } from '@/components/ui/video'

ブロックはAIワークフローを作成するために接続する構成要素です。AIモデルとのチャット、APIコールの実行、データ処理など、特定のタスクを処理する専門モジュールと考えてください。

<div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
  <Video src="connections.mp4" width={700} height={450} />
</div>

## 主要ブロックタイプ

Simは、AIワークフローの中核機能を処理する必須のブロックタイプを提供します：

### 処理ブロック
- **[エージェント](/blocks/agent)** - AIモデル（OpenAI、Anthropic、Google、ローカルモデル）とチャット
- **[ファンクション](/blocks/function)** - カスタムJavaScript/TypeScriptコードを実行
- **[API](/blocks/api)** - HTTP要求を介して外部サービスに接続

### ロジックブロック
- **[条件](/blocks/condition)** - ブール式に基づいてワークフローパスを分岐
- **[ルーター](/blocks/router)** - AIを使用してリクエストを異なるパスにインテリジェントにルーティング
- **[評価者](/blocks/evaluator)** - AIを使用してコンテンツの品質を評価・採点

### コントロールフローブロック
- **[変数](/blocks/variables)** - ワークフロースコープの変数を設定および管理
- **[待機](/blocks/wait)** - 指定した時間だけワークフロー実行を一時停止
- **[ヒューマンインザループ](/blocks/human-in-the-loop)** - 続行する前に人間の承認とフィードバックを待つ

### 出力ブロック
- **[レスポンス](/blocks/response)** - ワークフローからの最終結果をフォーマットして返す

## ブロックの仕組み

各ブロックには3つの主要コンポーネントがあります：

**入力**：他のブロックやユーザー入力からブロックに入ってくるデータ
**設定**：ブロックの動作を制御する設定
**出力**：ブロックが生成し、他のブロックが使用するデータ

<Steps>
  <Step>
    <strong>入力を受け取る</strong>：ブロックは接続されたブロックまたはユーザー入力からデータを受け取ります
  </Step>
  <Step>
    <strong>処理</strong>：ブロックは設定に従って入力を処理します
  </Step>
  <Step>
    <strong>結果を出力</strong>：ブロックはワークフロー内の次のブロックのための出力データを生成します
  </Step>
</Steps>

## ブロックの接続

ブロックを接続してワークフローを作成します。あるブロックの出力は、別のブロックの入力になります：

- **ドラッグして接続**：出力ポートから入力ポートにドラッグ
- **複数の接続**：1つの出力を複数の入力に接続可能
- **分岐パス**：一部のブロックは条件に基づいて異なるパスにルーティング可能

<div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
  <Video src="connections.mp4" width={700} height={450} />
</div>

## 一般的なパターン

### 順次処理
各ブロックが前のブロックの出力を処理するチェーン状にブロックを接続します：

```
User Input → Agent → Function → Response
```

### 条件分岐
条件またはルーターブロックを使用して異なるパスを作成します：

```
User Input → Router → Agent A (for questions)
                   → Agent B (for commands)
```

### 品質管理
評価ブロックを使用して出力を評価およびフィルタリングします：

```
Agent → Evaluator → Condition → Response (if good)
                              → Agent (retry if bad)
```

## ブロック設定

各ブロックタイプには特定の設定オプションがあります：

**すべてのブロック**:
- 入出力接続
- エラー処理の動作
- 実行タイムアウト設定

**AIブロック** (エージェント、ルーター、評価者):
- モデル選択（OpenAI、Anthropic、Google、ローカル）
- APIキーと認証
- 温度やその他のモデルパラメータ
- システムプロンプトと指示

**ロジックブロック** (条件、関数):
- カスタム式またはコード
- 変数参照
- 実行環境設定

**統合ブロック** (API、レスポンス):
- エンドポイント構成
- ヘッダーと認証
- リクエスト/レスポンスのフォーマット

<Cards>
  <Card title="エージェントブロック" href="/blocks/agent">
    AIモデルに接続し、インテリジェントな応答を作成
  </Card>
  <Card title="ファンクションブロック" href="/blocks/function">
    カスタムコードを実行してデータを処理および変換
  </Card>
  <Card title="APIブロック" href="/blocks/api">
    外部サービスやAPIと統合
  </Card>
  <Card title="条件ブロック" href="/blocks/condition">
    データ評価に基づいた分岐ロジックを作成
  </Card>
  <Card title="ヒューマンインザループブロック" href="/blocks/human-in-the-loop">
    続行する前に人間の承認とフィードバックを待つ
  </Card>
  <Card title="変数ブロック" href="/blocks/variables">
    ワークフロースコープの変数を設定および管理
  </Card>
  <Card title="待機ブロック" href="/blocks/wait">
    指定した時間だけワークフロー実行を一時停止
  </Card>
</Cards>
```

--------------------------------------------------------------------------------

````
