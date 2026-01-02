---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 207
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 207 of 933)

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

---[FILE: mailgun.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/mailgun.mdx

```text
---
title: Mailgun
description: Mailgunでメールを送信し、メーリングリストを管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mailgun"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mailgun](https://www.mailgun.com)は、開発者やビジネス向けに設計された強力なメール配信サービスで、メールの送受信やトラッキングを簡単に行うことができます。Mailgunを使用すると、信頼性の高いトランザクションメールやマーケティングメール、柔軟なメーリングリスト管理、高度なイベントトラッキングのための堅牢なAPIを活用できます。

Mailgunの包括的な機能セットにより、主要なメール操作を自動化し、配信可能性や受信者のエンゲージメントを緊密に監視することができます。これにより、コミュニケーション、通知、キャンペーンメールがワークフローの中核となるプロセスの理想的なソリューションとなります。

Mailgunの主な機能には以下が含まれます：

- **トランザクションメール送信：** アカウント通知、領収書、アラート、パスワードリセットなどの大量メールを配信。
- **リッチメールコンテンツ：** プレーンテキストとHTMLの両方のメールを送信し、タグを使用してメッセージを分類・追跡。
- **メーリングリスト管理：** メーリングリストとメンバーを作成、更新、管理して、グループコミュニケーションを効率的に送信。
- **ドメイン情報：** 送信ドメインに関する詳細を取得して、構成と健全性を監視。
- **イベントトラッキング：** 送信メッセージに関する詳細なイベントデータで、メールの配信可能性とエンゲージメントを分析。
- **メッセージ取得：** コンプライアンス、分析、またはトラブルシューティングのニーズのために保存されたメッセージにアクセス。

MailgunをSimに統合することで、エージェントはプログラムによるメール送信、メーリングリスト管理、ドメイン情報へのアクセス、自動化されたワークフローの一部としてリアルタイムイベントの監視を行うことができます。これにより、AIを活用したプロセスから直接ユーザーとインテリジェントでデータ駆動型のエンゲージメントが可能になります。
{/* MANUAL-CONTENT-END */}

## 使用手順

Mailgunをワークフローに統合します。トランザクションメールの送信、メーリングリストとメンバーの管理、ドメイン情報の表示、メールイベントの追跡が可能です。テキストメールとHTMLメール、追跡用のタグ、包括的なリスト管理をサポートしています。

## ツール

### `mailgun_send_message`

Mailgun APIを使用してメールを送信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Mailgun APIキー |
| `domain` | string | はい | Mailgunドメイン（例：mg.example.com） |
| `from` | string | はい | 送信者のメールアドレス |
| `to` | string | はい | 受信者のメールアドレス（複数の場合はカンマ区切り） |
| `subject` | string | はい | メールの件名 |
| `text` | string | いいえ | メールのプレーンテキスト本文 |
| `html` | string | いいえ | メールのHTML本文 |
| `cc` | string | いいえ | CCメールアドレス（複数の場合はカンマ区切り） |
| `bcc` | string | いいえ | BCCメールアドレス（複数の場合はカンマ区切り） |
| `tags` | string | いいえ | メールのタグ（カンマ区切り） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メッセージが正常に送信されたかどうか |
| `id` | string | メッセージID |
| `message` | string | Mailgunからのレスポンスメッセージ |

### `mailgun_get_message`

キーによって保存されたメッセージを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Mailgun APIキー |
| `domain` | string | はい | Mailgunドメイン |
| `messageKey` | string | はい | メッセージストレージキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | リクエストが成功したかどうか |
| `recipients` | string | メッセージの受信者 |
| `from` | string | 送信者のメールアドレス |
| `subject` | string | メッセージの件名 |
| `bodyPlain` | string | プレーンテキスト本文 |
| `strippedText` | string | 整形されたテキスト |
| `strippedSignature` | string | 整形された署名 |
| `bodyHtml` | string | HTML本文 |
| `strippedHtml` | string | 整形されたHTML |
| `attachmentCount` | number | 添付ファイルの数 |
| `timestamp` | number | メッセージのタイムスタンプ |
| `messageHeaders` | json | メッセージヘッダー |
| `contentIdMap` | json | コンテンツIDマップ |

### `mailgun_list_messages`

Mailgunを通じて送信されたメッセージのイベント（ログ）を一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Mailgun APIキー |
| `domain` | string | はい | Mailgunドメイン |
| `event` | string | いいえ | イベントタイプでフィルタリング（accepted、delivered、failed、opened、clickedなど） |
| `limit` | number | いいえ | 返すイベントの最大数（デフォルト：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | リクエストが成功したかどうか |
| `items` | json | イベント項目の配列 |
| `paging` | json | ページング情報 |

### `mailgun_create_mailing_list`

新しいメーリングリストを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Mailgun APIキー |
| `address` | string | はい | メーリングリストアドレス（例：list@example.com） |
| `name` | string | いいえ | メーリングリスト名 |
| `description` | string | いいえ | メーリングリストの説明 |
| `accessLevel` | string | いいえ | アクセスレベル：readonly、members、またはeveryone |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | リストが正常に作成されたかどうか |
| `message` | string | レスポンスメッセージ |
| `list` | json | 作成されたメーリングリストの詳細 |

### `mailgun_get_mailing_list`

メーリングリストの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Mailgun APIキー |
| `address` | string | はい | メーリングリストアドレス |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | リクエストが成功したかどうか |
| `list` | json | メーリングリストの詳細 |

### `mailgun_add_list_member`

メーリングリストにメンバーを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Mailgun APIキー |
| `listAddress` | string | はい | メーリングリストアドレス |
| `address` | string | はい | メンバーのメールアドレス |
| `name` | string | いいえ | メンバー名 |
| `vars` | string | いいえ | カスタム変数のJSON文字列 |
| `subscribed` | boolean | いいえ | メンバーが購読しているかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メンバーが正常に追加されたかどうか |
| `message` | string | レスポンスメッセージ |
| `member` | json | 追加されたメンバーの詳細 |

### `mailgun_list_domains`

Mailgunアカウントのすべてのドメインを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Mailgun APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | リクエストが成功したかどうか |
| `totalCount` | number | ドメインの総数 |
| `items` | json | ドメインオブジェクトの配列 |

### `mailgun_get_domain`

特定のドメインの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Mailgun APIキー |
| `domain` | string | はい | ドメイン名 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | リクエストが成功したかどうか |
| `domain` | json | ドメインの詳細 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `mailgun`
```

--------------------------------------------------------------------------------

---[FILE: mcp.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/mcp.mdx

```text
---
title: MCPツール
description: Model Context Protocol (MCP)サーバーからツールを実行する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mcp"
  color="#181C1E"
/>

## 使用方法

ワークフローにMCPを統合します。MCPサーバーからツールを実行できます。ワークスペース設定にMCPサーバーが必要です。

## 注意事項

- カテゴリー: `tools`
- タイプ: `mcp`
```

--------------------------------------------------------------------------------

---[FILE: mem0.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/mem0.mdx

```text
---
title: Mem0
description: エージェントメモリ管理
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mem0"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Mem0](https://mem0.ai)はAIエージェント専用に設計された強力なメモリ管理システムです。エージェントが過去のやり取りを記憶し、経験から学び、会話やワークフロー実行間でコンテキストを維持できる永続的で検索可能なメモリストアを提供します。

Mem0では、以下のことが可能です：

- **エージェントのメモリを保存**: 会話履歴、ユーザー設定、重要なコンテキストを保存
- **関連情報を取得**: セマンティック検索を使用して最も関連性の高い過去のやり取りを見つける
- **コンテキストを認識するエージェントを構築**: エージェントが過去の会話を参照し、連続性を維持できるようにする
- **インタラクションをパーソナライズ**: ユーザーの履歴と設定に基づいて応答をカスタマイズ
- **長期記憶を実装**: 時間の経過とともに学習し適応するエージェントを作成
- **メモリ管理をスケール**: 複数のユーザーや複雑なワークフローのメモリニーズに対応

Simでは、Mem0統合によりエージェントがワークフロー実行間で永続的なメモリを維持できます。これにより、エージェントが過去の会話を思い出し、ユーザーの好みを記憶し、以前のやり取りを基に構築するという、よりコンテキストを認識した自然なインタラクションが可能になります。SimとMem0を接続することで、過去の経験から記憶し学習する能力においてより人間らしいエージェントを作成できます。この統合は、新しいメモリの追加、既存のメモリのセマンティック検索、特定のメモリレコードの取得をサポートしています。このメモリ管理機能は、時間の経過とともにコンテキストを維持し、ユーザー履歴に基づいてインタラクションをパーソナライズし、蓄積された知識を通じて継続的にパフォーマンスを向上させる高度なエージェントを構築するために不可欠です。
{/* MANUAL-CONTENT-END */}

## 使用手順

Mem0をワークフローに統合します。メモリの追加、検索、取得が可能です。APIキーが必要です。

## ツール

### `mem0_add_memories`

永続的な保存と取得のためにMem0にメモリを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | はい | メモリに関連付けられたユーザーID |
| `messages` | json | はい | ロールとコンテンツを持つメッセージオブジェクトの配列 |
| `apiKey` | string | はい | あなたのMem0 APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ids` | array | 作成されたメモリIDの配列 |
| `memories` | array | 作成されたメモリオブジェクトの配列 |

### `mem0_search_memories`

セマンティック検索を使用してMem0内のメモリを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | はい | メモリを検索するユーザーID |
| `query` | string | はい | 関連するメモリを見つけるための検索クエリ |
| `limit` | number | いいえ | 返す結果の最大数 |
| `apiKey` | string | はい | あなたのMem0 APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `searchResults` | array | メモリデータを含む検索結果の配列（各結果にはid、data、scoreが含まれる） |
| `ids` | array | 検索結果で見つかったメモリIDの配列 |

### `mem0_get_memories`

IDまたはフィルター条件によってMem0からメモリを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | はい | メモリを取得するユーザーID |
| `memoryId` | string | いいえ | 取得する特定のメモリID |
| `startDate` | string | いいえ | created_atでフィルタリングするための開始日（形式：YYYY-MM-DD） |
| `endDate` | string | いいえ | created_atでフィルタリングするための終了日（形式：YYYY-MM-DD） |
| `limit` | number | いいえ | 返す結果の最大数 |
| `apiKey` | string | はい | あなたのMem0 APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `memories` | array | 取得されたメモリオブジェクトの配列 |
| `ids` | array | 取得されたメモリIDの配列 |

## 注意事項

- カテゴリ: `tools`
- タイプ: `mem0`
```

--------------------------------------------------------------------------------

---[FILE: memory.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/memory.mdx

```text
---
title: メモリー
description: メモリーストアを追加
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="memory"
  color="#F64F9E"
/>

## 使用方法

ワークフローにメモリーを統合します。メモリーの追加、取得、すべてのメモリーの取得、メモリーの削除が可能です。

## ツール

### `memory_add`

新しいメモリーをデータベースに追加するか、同じIDの既存のメモリーに追加します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | いいえ | 会話識別子（例：user-123、session-abc）。このブロックに対してこの会話IDのメモリがすでに存在する場合、新しいメッセージはそれに追加されます。 |
| `id` | string | いいえ | 会話識別子のレガシーパラメータ。代わりにconversationIdを使用してください。後方互換性のために提供されています。 |
| `role` | string | はい | エージェントメモリの役割（user、assistant、またはsystem） |
| `content` | string | はい | エージェントメモリのコンテンツ |
| `blockId` | string | いいえ | オプションのブロックID。提供されない場合、実行コンテキストから現在のブロックIDを使用するか、デフォルトで「default」になります。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メモリが正常に追加されたかどうか |
| `memories` | array | 新規または更新されたメモリを含むメモリオブジェクトの配列 |
| `error` | string | 操作が失敗した場合のエラーメッセージ |

### `memory_get`

conversationId、blockId、blockName、またはそれらの組み合わせによってメモリを取得します。一致するすべてのメモリを返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | いいえ | 会話識別子（例：user-123、session-abc）。単独で提供された場合、すべてのブロックにわたるこの会話のすべてのメモリを返します。 |
| `id` | string | いいえ | 会話識別子のレガシーパラメータ。代わりにconversationIdを使用してください。後方互換性のために提供されています。 |
| `blockId` | string | いいえ | ブロック識別子。単独で提供された場合、すべての会話にわたるこのブロックのすべてのメモリを返します。conversationIdと一緒に提供された場合、そのブロック内の特定の会話のメモリを返します。 |
| `blockName` | string | いいえ | ブロック名。blockIdの代替。単独で提供された場合、この名前を持つブロックのすべてのメモリを返します。conversationIdと一緒に提供された場合、この名前を持つブロック内のその会話のメモリを返します。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メモリが正常に取得されたかどうか |
| `memories` | array | conversationId、blockId、blockName、およびdataフィールドを含むメモリオブジェクトの配列 |
| `message` | string | 成功またはエラーメッセージ |
| `error` | string | 操作が失敗した場合のエラーメッセージ |

### `memory_get_all`

データベースからすべてのメモリを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | すべてのメモリが正常に取得されたかどうか |
| `memories` | array | key、conversationId、blockId、blockName、およびdataフィールドを含むすべてのメモリオブジェクトの配列 |
| `message` | string | 成功またはエラーメッセージ |
| `error` | string | 操作が失敗した場合のエラーメッセージ |

### `memory_delete`

conversationId、blockId、blockName、またはそれらの組み合わせによってメモリを削除します。一括削除をサポートしています。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | いいえ | 会話識別子（例：user-123、session-abc）。単独で提供された場合、すべてのブロックにわたるこの会話のすべてのメモリを削除します。 |
| `id` | string | いいえ | 会話識別子のレガシーパラメータ。代わりにconversationIdを使用してください。後方互換性のために提供されています。 |
| `blockId` | string | いいえ | ブロック識別子。単独で提供された場合、すべての会話にわたるこのブロックのすべてのメモリを削除します。conversationIdと共に提供された場合、そのブロック内の特定の会話のメモリを削除します。 |
| `blockName` | string | いいえ | ブロック名。blockIdの代替。単独で提供された場合、この名前を持つブロックのすべてのメモリを削除します。conversationIdと共に提供された場合、この名前を持つブロック内のその会話のメモリを削除します。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メモリが正常に削除されたかどうか |
| `message` | string | 成功またはエラーメッセージ |
| `error` | string | 操作が失敗した場合のエラーメッセージ |

## 注意事項

- カテゴリ: `blocks`
- タイプ: `memory`
```

--------------------------------------------------------------------------------

---[FILE: meta.json]---
Location: sim-main/apps/docs/content/docs/ja/tools/meta.json

```json
{
  "pages": [
    "index",
    "airtable",
    "arxiv",
    "asana",
    "browser_use",
    "clay",
    "confluence",
    "discord",
    "elevenlabs",
    "exa",
    "file",
    "firecrawl",
    "github",
    "gmail",
    "google_calendar",
    "google_docs",
    "google_drive",
    "google_forms",
    "google_search",
    "google_sheets",
    "google_vault",
    "hubspot",
    "huggingface",
    "hunter",
    "image_generator",
    "jina",
    "jira",
    "knowledge",
    "linear",
    "linkup",
    "mem0",
    "memory",
    "microsoft_excel",
    "microsoft_planner",
    "microsoft_teams",
    "mistral_parse",
    "mongodb",
    "mysql",
    "notion",
    "onedrive",
    "openai",
    "outlook",
    "parallel_ai",
    "perplexity",
    "pinecone",
    "pipedrive",
    "postgresql",
    "qdrant",
    "reddit",
    "resend",
    "s3",
    "salesforce",
    "serper",
    "sharepoint",
    "slack",
    "stagehand",
    "stagehand_agent",
    "stripe",
    "supabase",
    "tavily",
    "telegram",
    "thinking",
    "translate",
    "trello",
    "twilio_sms",
    "twilio_voice",
    "typeform",
    "vision",
    "wealthbox",
    "webflow",
    "whatsapp",
    "wikipedia",
    "x",
    "youtube",
    "zep"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: microsoft_excel.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/microsoft_excel.mdx

```text
---
title: Microsoft Excel
description: データの読み取り、書き込み、更新
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_excel"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-365/excel)は、データ管理、分析、視覚化を可能にする強力なスプレッドシートアプリケーションです。SimのMicrosoft Excel統合を通じて、プログラムによるスプレッドシートデータの読み取り、書き込み、操作が可能になり、ワークフロー自動化のニーズをサポートします。

Microsoft Excel統合により、以下のことが可能になります：

- **スプレッドシートデータの読み取り**：特定の範囲、シート、セルからデータにアクセス
- **データの書き込みと更新**：新しいデータの追加や既存のスプレッドシートコンテンツの修正
- **テーブルの管理**：表形式のデータ構造の作成と操作
- **複数シートの処理**：ワークブック内の複数のワークシートの操作
- **データ処理**：スプレッドシートデータのインポート、エクスポート、変換

Simでは、Microsoft Excel統合によりOAuth認証を通じてスプレッドシート機能にシームレスにアクセスできます。特定の範囲からデータを読み取り、新しい情報を書き込み、既存のセルを更新し、さまざまなデータ形式を処理することができます。この統合は、柔軟な入出力オプションを備えた読み取りと書き込みの両方の操作をサポートしています。これにより、分析のための情報抽出、レコードの自動更新、アプリケーション間のデータ一貫性の維持など、スプレッドシートデータを効果的に管理するワークフローを構築することができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Microsoft Excelをワークフローに統合します。読み取り、書き込み、更新、テーブルへの追加、新しいワークシートの作成が可能です。

## ツール

### `microsoft_excel_read`

Microsoft Excelスプレッドシートからデータを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | はい | 読み取り元のスプレッドシートID |
| `range` | string | いいえ | 読み取るセル範囲。「シート名!A1:B2」のような明示的な範囲指定や、単に「シート名」と指定してそのシートの使用範囲を読み取ることができます。省略した場合、最初のシートの使用範囲を読み取ります。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `data` | object | スプレッドシートからの範囲データ |

### `microsoft_excel_write`

Microsoft Excelスプレッドシートにデータを書き込む

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | はい | 書き込み先のスプレッドシートID |
| `range` | string | いいえ | 書き込むセル範囲 |
| `values` | array | はい | スプレッドシートに書き込むデータ |
| `valueInputOption` | string | いいえ | 書き込むデータの形式 |
| `includeValuesInResponse` | boolean | いいえ | レスポンスに書き込まれた値を含めるかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `updatedRange` | string | 更新された範囲 |
| `updatedRows` | number | 更新された行数 |
| `updatedColumns` | number | 更新された列数 |
| `updatedCells` | number | 更新されたセル数 |
| `metadata` | object | スプレッドシートのメタデータ |

### `microsoft_excel_table_add`

Microsoft Excelテーブルに新しい行を追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | はい | テーブルを含むスプレッドシートのID |
| `tableName` | string | はい | 行を追加するテーブルの名前 |
| `values` | array | はい | テーブルに追加するデータ（配列の配列またはオブジェクトの配列） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `index` | number | 追加された最初の行のインデックス |
| `values` | array | テーブルに追加された行の配列 |
| `metadata` | object | スプレッドシートのメタデータ |

### `microsoft_excel_worksheet_add`

Microsoft Excelブックに新しいワークシート（シート）を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | はい | ワークシートを追加するExcelブックのID |
| `worksheetName` | string | はい | 新しいワークシートの名前。ブック内で一意である必要があり、31文字を超えることはできません |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `worksheet` | object | 新しく作成されたワークシートの詳細 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `microsoft_excel`
```

--------------------------------------------------------------------------------

---[FILE: microsoft_planner.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/microsoft_planner.mdx

```text
---
title: Microsoft Planner
description: Microsoft Plannerでタスク、プラン、バケットを管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_planner"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Planner](https://www.microsoft.com/en-us/microsoft-365/planner)は、ボード、タスク、バケットを使用してチームが視覚的に作業を整理するのに役立つタスク管理ツールです。Microsoft 365と統合されており、チームプロジェクトの管理、責任の割り当て、進捗状況の追跡を簡単で直感的に行う方法を提供します。

Microsoft Plannerでは、次のことができます：

- **タスクの作成と管理**: 期日、優先順位、担当者を設定した新しいタスクを追加
- **バケットでの整理**: チームのワークフローを反映するために、フェーズ、ステータス、カテゴリごとにタスクをグループ化
- **プロジェクトステータスの可視化**: ボード、チャート、フィルターを使用して作業負荷を監視し、進捗状況を追跡
- **Microsoft 365との統合**: Teams、Outlook、その他のMicrosoftツールとタスクをシームレスに接続

Simでは、Microsoft Planner統合により、エージェントがワークフローの一部としてプログラムでタスクを作成、読み取り、管理することができます。エージェントは受信リクエストに基づいて新しいタスクを生成し、意思決定を促進するためにタスクの詳細を取得し、プロジェクト全体のステータスを追跡することができます—すべて人間の介入なしに。クライアントのオンボーディング、内部プロジェクトの追跡、フォローアップタスクの生成のためのワークフローを構築する場合でも、Microsoft PlannerとSimを統合することで、エージェントは作業を調整し、タスク作成を自動化し、チームの連携を維持するための構造化された方法を提供します。
{/* MANUAL-CONTENT-END */}

## 使用手順

Microsoft Plannerをワークフローに統合します。タスク、プラン、バケット、およびチェックリストや参照を含むタスクの詳細を管理します。

## ツール

### `microsoft_planner_read_task`

Microsoft Plannerからタスクを読み取る - すべてのユーザータスクまたは特定のプランからすべてのタスクを取得

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `planId` | string | いいえ | タスクを取得するプランのID（提供されない場合、すべてのユーザータスクを取得） |
| `taskId` | string | いいえ | 取得するタスクのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | タスクが正常に取得されたかどうか |
| `tasks` | array | フィルタリングされたプロパティを持つタスクオブジェクトの配列 |
| `metadata` | object | planId、userId、planUrlを含むメタデータ |

### `microsoft_planner_create_task`

Microsoft Plannerで新しいタスクを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `planId` | string | はい | タスクが作成されるプランのID |
| `title` | string | はい | タスクのタイトル |
| `description` | string | いいえ | タスクの説明 |
| `dueDateTime` | string | いいえ | タスクの期限日時（ISO 8601形式） |
| `assigneeUserId` | string | いいえ | タスクを割り当てるユーザーID |
| `bucketId` | string | いいえ | タスクを配置するバケットID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | タスクが正常に作成されたかどうか |
| `task` | object | すべてのプロパティを持つ作成されたタスクオブジェクト |
| `metadata` | object | planId、taskId、taskUrlを含むメタデータ |

### `microsoft_planner_update_task`

Microsoft Plannerでタスクを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | はい | 更新するタスクのID |
| `etag` | string | はい | 更新するタスクからのETag値（If-Matchヘッダー） |
| `title` | string | いいえ | タスクの新しいタイトル |
| `bucketId` | string | いいえ | タスクを移動するバケットID |
| `dueDateTime` | string | いいえ | タスクの期限日時（ISO 8601形式） |
| `startDateTime` | string | いいえ | タスクの開始日時（ISO 8601形式） |
| `percentComplete` | number | いいえ | タスク完了の割合（0-100） |
| `priority` | number | いいえ | タスクの優先度（0-10） |
| `assigneeUserId` | string | いいえ | タスクを割り当てるユーザーID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | タスクが正常に更新されたかどうか |
| `message` | string | タスクが更新された際の成功メッセージ |
| `task` | object | すべてのプロパティを持つ更新されたタスクオブジェクト |
| `taskId` | string | 更新されたタスクのID |
| `etag` | string | 更新後の新しいETag - 後続の操作に使用します |
| `metadata` | object | taskId、planId、taskUrlを含むメタデータ |

### `microsoft_planner_delete_task`

Microsoft Plannerからタスクを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | はい | 削除するタスクのID |
| `etag` | string | はい | 削除するタスクのETag値（If-Matchヘッダー） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | タスクが正常に削除されたかどうか |
| `deleted` | boolean | 削除の確認 |
| `metadata` | object | 追加のメタデータ |

### `microsoft_planner_list_plans`

現在のユーザーと共有されているすべてのプランを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | プランが正常に取得されたかどうか |
| `plans` | array | 現在のユーザーと共有されているプランオブジェクトの配列 |
| `metadata` | object | userIdと数を含むメタデータ |

### `microsoft_planner_read_plan`

特定のMicrosoft Plannerプランの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `planId` | string | はい | 取得するプランのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | プランが正常に取得されたかどうか |
| `plan` | object | すべてのプロパティを持つプランオブジェクト |
| `metadata` | object | planIdとplanUrlを含むメタデータ |

### `microsoft_planner_list_buckets`

Microsoft Plannerプラン内のすべてのバケットを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `planId` | string | はい | プランのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | バケットが正常に取得されたかどうか |
| `buckets` | array | バケットオブジェクトの配列 |
| `metadata` | object | planIdと数を含むメタデータ |

### `microsoft_planner_read_bucket`

特定のバケットの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | はい | 取得するバケットのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | バケットが正常に取得されたかどうか |
| `bucket` | object | すべてのプロパティを持つバケットオブジェクト |
| `metadata` | object | bucketIdとplanIdを含むメタデータ |

### `microsoft_planner_create_bucket`

Microsoft Plannerプランに新しいバケットを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `planId` | string | はい | バケットが作成されるプランのID |
| `name` | string | はい | バケットの名前 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | バケットが正常に作成されたかどうか |
| `bucket` | object | すべてのプロパティを持つ作成されたバケットオブジェクト |
| `metadata` | object | bucketIdとplanIdを含むメタデータ |

### `microsoft_planner_update_bucket`

Microsoft Plannerのバケットを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | はい | 更新するバケットのID |
| `name` | string | いいえ | バケットの新しい名前 |
| `etag` | string | はい | 更新するバケットからのETag値（If-Matchヘッダー） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | バケットが正常に更新されたかどうか |
| `bucket` | object | すべてのプロパティを持つ更新されたバケットオブジェクト |
| `metadata` | object | bucketIdとplanIdを含むメタデータ |

### `microsoft_planner_delete_bucket`

Microsoft Plannerからバケットを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `bucketId` | string | はい | 削除するバケットのID |
| `etag` | string | はい | 削除するバケットからのETag値（If-Matchヘッダー） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | バケットが正常に削除されたかどうか |
| `deleted` | boolean | 削除の確認 |
| `metadata` | object | 追加のメタデータ |

### `microsoft_planner_get_task_details`

チェックリストや参照を含むタスクの詳細情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | はい | タスクのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | タスクの詳細が正常に取得されたかどうか |
| `taskDetails` | object | 説明、チェックリスト、参照を含むタスクの詳細 |
| `etag` | string | このタスク詳細のETag値 - 更新操作に使用します |
| `metadata` | object | taskIdを含むメタデータ |

### `microsoft_planner_update_task_details`

Microsoft Plannerでタスクの詳細（説明、チェックリスト項目、参照）を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | はい | タスクのID |
| `etag` | string | はい | 更新するタスク詳細からのETag値（If-Matchヘッダー） |
| `description` | string | いいえ | タスクの説明 |
| `checklist` | object | いいえ | JSONオブジェクトとしてのチェックリスト項目 |
| `references` | object | いいえ | JSONオブジェクトとしての参照 |
| `previewType` | string | いいえ | プレビュータイプ：automatic、noPreview、checklist、description、またはreference |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | タスクの詳細が正常に更新されたかどうか |
| `taskDetails` | object | すべてのプロパティを持つ更新されたタスク詳細オブジェクト |
| `metadata` | object | taskIdを含むメタデータ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `microsoft_planner`
```

--------------------------------------------------------------------------------

---[FILE: microsoft_teams.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/microsoft_teams.mdx

```text
---
title: Microsoft Teams
description: Teams でメッセージ、リアクション、メンバーを管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="microsoft_teams"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Teams](https://teams.microsoft.com)は、チームや組織内でリアルタイムメッセージング、会議、コンテンツ共有を可能にする強力なコミュニケーションおよびコラボレーションプラットフォームです。Microsoftの生産性エコシステムの一部として、Microsoft Teamsは Office 365と統合されたシームレスなチャット機能を提供し、ユーザーがメッセージを投稿し、作業を調整し、デバイスやワークフロー間で接続を維持することができます。

Microsoft Teamsでは、次のことが可能です：

- **メッセージの送受信**: チャットスレッドで個人やグループとリアルタイムにコミュニケーション  
- **リアルタイムでのコラボレーション**: チャンネルやチャット内でチーム全体に更新情報を共有  
- **会話の整理**: スレッド化された議論と永続的なチャット履歴でコンテキストを維持  
- **ファイルとコンテンツの共有**: チャット内で直接ドキュメント、画像、リンクを添付・閲覧  
- **Microsoft 365との統合**: Outlook、SharePoint、OneDriveなどとシームレスに連携  
- **複数デバイスでのアクセス**: デスクトップ、ウェブ、モバイルでクラウド同期された会話を利用  
- **安全なコミュニケーション**: エンタープライズグレードのセキュリティとコンプライアンス機能を活用

Simでは、Microsoft Teams統合により、エージェントがプログラムによってチャットメッセージと直接やり取りすることができます。これにより、更新の送信、アラートの投稿、タスクの調整、リアルタイムでの会話への応答など、強力な自動化シナリオが可能になります。エージェントは、チャットやチャンネルに新しいメッセージを書き込んだり、ワークフローデータに基づいてコンテンツを更新したり、コラボレーションが行われる場所でユーザーとやり取りしたりすることができます。SimとMicrosoft Teamsを統合することで、インテリジェントなワークフローとチームコミュニケーションの間のギャップを埋め、エージェントがコラボレーションを効率化し、コミュニケーションタスクを自動化し、チームの連携を維持できるようにします。
{/* MANUAL-CONTENT-END */}

## 使用手順

Microsoft Teams をワークフローに統合します。チャットやチャネルのメッセージの読み取り、書き込み、更新、削除ができます。メッセージへの返信、リアクションの追加、チーム/チャネルメンバーの一覧表示が可能です。チャットやチャネルにメッセージが送信されたときにワークフローをトリガーするトリガーモードでも使用できます。メッセージでユーザーにメンションするには、名前を `<at>` タグで囲みます: `<at>userName</at>`

## ツール

### `microsoft_teams_read_chat`

Microsoft Teamsチャットからコンテンツを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | はい | 読み取り元のチャットID |
| `includeAttachments` | boolean | いいえ | メッセージの添付ファイル（ホストされたコンテンツ）をダウンロードしてストレージに含める |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | Teamsチャット読み取り操作の成功ステータス |
| `messageCount` | number | チャットから取得したメッセージ数 |
| `chatId` | string | 読み取り元のチャットID |
| `messages` | array | チャットメッセージオブジェクトの配列 |
| `attachmentCount` | number | 見つかった添付ファイルの総数 |
| `attachmentTypes` | array | 見つかった添付ファイルの種類 |
| `content` | string | チャットメッセージのフォーマット済みコンテンツ |
| `attachments` | file[] | 利便性のためにアップロードされた添付ファイル（フラット化済み） |

### `microsoft_teams_write_chat`

Microsoft Teams チャットでコンテンツを作成または更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | はい | 書き込み先のチャットID |
| `content` | string | はい | メッセージに書き込む内容 |
| `files` | file[] | いいえ | メッセージに添付するファイル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | Teams チャットメッセージ送信成功ステータス |
| `messageId` | string | 送信されたメッセージの一意の識別子 |
| `chatId` | string | メッセージが送信されたチャットのID |
| `createdTime` | string | メッセージが作成されたタイムスタンプ |
| `url` | string | メッセージへのウェブURL |
| `updatedContent` | boolean | コンテンツが正常に更新されたかどうか |

### `microsoft_teams_read_channel`

Microsoft Teams チャネルからコンテンツを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | はい | 読み取り元のチームID |
| `channelId` | string | はい | 読み取り元のチャネルID |
| `includeAttachments` | boolean | いいえ | メッセージの添付ファイル（ホストされたコンテンツ）をダウンロードしてストレージに含める |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | Teamsチャネル読み取り操作の成功ステータス |
| `messageCount` | number | チャネルから取得したメッセージ数 |
| `teamId` | string | 読み取り元のチームID |
| `channelId` | string | 読み取り元のチャネルID |
| `messages` | array | チャネルメッセージオブジェクトの配列 |
| `attachmentCount` | number | 見つかった添付ファイルの総数 |
| `attachmentTypes` | array | 見つかった添付ファイルの種類 |
| `content` | string | チャネルメッセージのフォーマット済みコンテンツ |
| `attachments` | file[] | 利便性のためにアップロードされた添付ファイル（フラット化済み） |

### `microsoft_teams_write_channel`

Microsoft Teamsチャネルにメッセージを書き込むまたは送信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | はい | 書き込み先のチームID |
| `channelId` | string | はい | 書き込み先のチャネルID |
| `content` | string | はい | チャネルに書き込む内容 |
| `files` | file[] | いいえ | メッセージに添付するファイル |

#### 出力

| パラメータ | 種類 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | Teamsチャネルメッセージ送信成功ステータス |
| `messageId` | string | 送信されたメッセージの一意識別子 |
| `teamId` | string | メッセージが送信されたチームのID |
| `channelId` | string | メッセージが送信されたチャネルのID |
| `createdTime` | string | メッセージが作成されたタイムスタンプ |
| `url` | string | メッセージへのウェブURL |
| `updatedContent` | boolean | コンテンツが正常に更新されたかどうか |

### `microsoft_teams_update_chat_message`

Microsoft Teams チャットの既存メッセージを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | はい | メッセージを含むチャットのID |
| `messageId` | string | はい | 更新するメッセージのID |
| `content` | string | はい | メッセージの新しい内容 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 更新が成功したかどうか |
| `messageId` | string | 更新されたメッセージのID |
| `updatedContent` | boolean | コンテンツが正常に更新されたかどうか |

### `microsoft_teams_update_channel_message`

Microsoft Teams チャネルの既存メッセージを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | はい | チームのID |
| `channelId` | string | はい | メッセージを含むチャネルのID |
| `messageId` | string | はい | 更新するメッセージのID |
| `content` | string | はい | メッセージの新しい内容 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 更新が成功したかどうか |
| `messageId` | string | 更新されたメッセージのID |
| `updatedContent` | boolean | コンテンツが正常に更新されたかどうか |

### `microsoft_teams_delete_chat_message`

Microsoft Teamsチャットでメッセージをソフト削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `chatId` | string | はい | メッセージを含むチャットのID |
| `messageId` | string | はい | 削除するメッセージのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 削除が成功したかどうか |
| `deleted` | boolean | 削除の確認 |
| `messageId` | string | 削除されたメッセージのID |

### `microsoft_teams_delete_channel_message`

Microsoft Teamsチャネルでメッセージをソフト削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | はい | チームのID |
| `channelId` | string | はい | メッセージを含むチャネルのID |
| `messageId` | string | はい | 削除するメッセージのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 削除が成功したかどうか |
| `deleted` | boolean | 削除の確認 |
| `messageId` | string | 削除されたメッセージのID |

### `microsoft_teams_reply_to_message`

Microsoft Teamsチャネルの既存のメッセージに返信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | はい | チームのID |
| `channelId` | string | はい | チャネルのID |
| `messageId` | string | はい | 返信するメッセージのID |
| `content` | string | はい | 返信の内容 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 返信が成功したかどうか |
| `messageId` | string | 返信メッセージのID |
| `updatedContent` | boolean | コンテンツが正常に送信されたかどうか |

### `microsoft_teams_get_message`

Microsoft Teamsのチャットまたはチャネルから特定のメッセージを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | いいえ | チームのID（チャネルメッセージの場合） |
| `channelId` | string | いいえ | チャネルのID（チャネルメッセージの場合） |
| `chatId` | string | いいえ | チャットのID（チャットメッセージの場合） |
| `messageId` | string | はい | 取得するメッセージのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 取得が成功したかどうか |
| `content` | string | メッセージの内容 |
| `metadata` | object | 送信者、タイムスタンプなどを含むメッセージのメタデータ |

### `microsoft_teams_set_reaction`

Microsoft Teamsのメッセージに絵文字リアクションを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | いいえ | チームのID（チャネルメッセージの場合） |
| `channelId` | string | いいえ | チャネルのID（チャネルメッセージの場合） |
| `chatId` | string | いいえ | チャットのID（チャットメッセージの場合） |
| `messageId` | string | はい | リアクションするメッセージのID |
| `reactionType` | string | はい | 絵文字リアクション（例：❤️、👍、😊） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | リアクションが正常に追加されたかどうか |
| `reactionType` | string | 追加された絵文字 |
| `messageId` | string | メッセージのID |

### `microsoft_teams_unset_reaction`

Microsoft Teamsのメッセージから絵文字リアクションを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | いいえ | チームのID（チャネルメッセージの場合） |
| `channelId` | string | いいえ | チャネルのID（チャネルメッセージの場合） |
| `chatId` | string | いいえ | チャットのID（チャットメッセージの場合） |
| `messageId` | string | はい | メッセージのID |
| `reactionType` | string | はい | 削除する絵文字リアクション（例：❤️、👍、😊） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | リアクションが正常に削除されたかどうか |
| `reactionType` | string | 削除された絵文字 |
| `messageId` | string | メッセージのID |

### `microsoft_teams_list_team_members`

Microsoft Teamsチームのすべてのメンバーを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | はい | チームのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 一覧表示が成功したかどうか |
| `members` | array | チームメンバーの配列 |
| `memberCount` | number | メンバーの総数 |

### `microsoft_teams_list_channel_members`

Microsoft Teamsチャネルのすべてのメンバーを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `teamId` | string | はい | チームのID |
| `channelId` | string | はい | チャネルのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 一覧表示が成功したかどうか |
| `members` | array | チャネルメンバーの配列 |
| `memberCount` | number | メンバーの総数 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `microsoft_teams`
```

--------------------------------------------------------------------------------

---[FILE: mistral_parse.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/mistral_parse.mdx

```text
---
title: Mistral Parser
description: PDFドキュメントからテキストを抽出する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mistral_parse"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
Mistral Parseツールは、[Mistralの OCR API](https://mistral.ai/)を使用してPDFドキュメントからコンテンツを抽出し処理する強力な方法を提供します。このツールは高度な光学式文字認識を活用して、PDFファイルからテキストと構造を正確に抽出し、ドキュメントデータをエージェントワークフローに簡単に組み込むことができます。

Mistral Parseツールでは、以下のことが可能です：

- **PDFからテキストを抽出**: PDFコンテンツをテキスト、マークダウン、またはJSONフォーマットに正確に変換
- **URLからPDFを処理**: URLを提供することでオンラインでホストされているPDFから直接コンテンツを抽出
- **ドキュメント構造の維持**: 元のPDFからフォーマット、テーブル、レイアウトを保持
- **画像の抽出**: オプションでPDFに埋め込まれた画像を含める
- **特定のページを選択**: 複数ページのドキュメントから必要なページのみを処理

Mistral Parseツールは、エージェントがPDFコンテンツを扱う必要があるシナリオ、例えばレポートの分析、フォームからのデータ抽出、またはスキャンされた文書からのテキスト処理などに特に役立ちます。PDFコンテンツをエージェントが利用できるようにするプロセスを簡素化し、PDFに保存された情報を直接テキスト入力と同じくらい簡単に扱えるようにします。
{/* MANUAL-CONTENT-END */}

## 使用方法

Mistral Parseをワークフローに統合します。アップロードされたPDF文書またはURLからテキストを抽出できます。APIキーが必要です。

## ツール

### `mistral_parser`

Mistral OCR APIを使用してPDF文書を解析する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `filePath` | string | はい | 処理するPDF文書のURL |
| `fileUpload` | object | いいえ | ファイルアップロードコンポーネントからのファイルアップロードデータ |
| `resultType` | string | いいえ | 解析結果の種類（markdown、text、またはjson）。デフォルトはmarkdown |
| `includeImageBase64` | boolean | いいえ | レスポンスにbase64エンコードされた画像を含める |
| `pages` | array | いいえ | 処理する特定のページ（ページ番号の配列、0から開始） |
| `imageLimit` | number | いいえ | PDFから抽出する画像の最大数 |
| `imageMinSize` | number | いいえ | PDFから抽出する画像の最小の高さと幅 |
| `apiKey` | string | はい | Mistral APIキー（MISTRAL_API_KEY） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | PDFが正常に解析されたかどうか |
| `content` | string | 要求されたフォーマット（markdown、text、またはJSON）で抽出されたコンテンツ |
| `metadata` | object | jobId、fileType、pageCount、使用情報を含む処理メタデータ |

## メモ

- カテゴリー: `tools`
- タイプ: `mistral_parse`
```

--------------------------------------------------------------------------------

````
