---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 209
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 209 of 933)

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

---[FILE: pinecone.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/pinecone.mdx

```text
---
title: Pinecone
description: Pineconeベクトルデータベースを使用する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="pinecone"
  color="#0D1117"
/>

{/* MANUAL-CONTENT-START:intro */}
[Pinecone](https://www.pinecone.io)は、高性能なベクトル検索アプリケーションを構築するために設計されたベクトルデータベースです。高次元ベクトル埋め込みの効率的な保存、管理、類似性検索を可能にし、セマンティック検索機能を必要とするAIアプリケーションに最適です。

Pineconeを使用すると、以下のことが可能です：

- **ベクトル埋め込みの保存**: 大規模な高次元ベクトルを効率的に管理
- **類似性検索の実行**: クエリベクトルに最も類似したベクトルをミリ秒単位で検索
- **セマンティック検索の構築**: キーワードではなく意味に基づいた検索体験を作成
- **レコメンデーションシステムの実装**: コンテンツの類似性に基づいたパーソナライズされた推奨を生成
- **機械学習モデルのデプロイ**: ベクトル類似性に依存するMLモデルを運用化
- **シームレスなスケーリング**: 一貫したパフォーマンスで数十億のベクトルを処理
- **リアルタイムインデックスの維持**: 新しいデータが到着するとリアルタイムでベクトルデータベースを更新

Simでは、Pineconeの統合により、エージェントがワークフローの一部としてベクトル検索機能をプログラム的に活用できるようになります。これにより、自然言語処理とセマンティック検索・取得を組み合わせた高度な自動化シナリオが可能になります。エージェントはテキストからエンベディングを生成し、これらのベクトルをPineconeインデックスに保存し、類似性検索を実行して最も関連性の高い情報を見つけることができます。この統合により、AIワークフローとベクトル検索インフラストラクチャの間のギャップが埋まり、正確なキーワードマッチングではなく意味的な理解に基づいたよりインテリジェントな情報検索が可能になります。SimとPineconeを接続することで、コンテキストを理解し、大規模なデータセットから関連情報を取得し、ユーザーにより正確でパーソナライズされた応答を提供するエージェントを作成できます - すべて複雑なインフラ管理やベクトルデータベースの専門知識を必要とせずに実現できます。
{/* MANUAL-CONTENT-END */}

## 使用手順

Pineconeをワークフローに統合します。エンベディングの生成、テキストのアップサート、テキストでの検索、ベクトルの取得、ベクトルでの検索が可能です。APIキーが必要です。

## ツール

### `pinecone_generate_embeddings`

Pineconeを使用してテキストからエンベディングを生成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `model` | string | はい | エンベディング生成に使用するモデル |
| `inputs` | array | はい | エンベディングを生成するテキスト入力の配列 |
| `apiKey` | string | はい | Pinecone APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `data` | array | 値とベクトルタイプを含む生成されたエンベディングデータ |
| `model` | string | エンベディング生成に使用されたモデル |
| `vector_type` | string | 生成されたベクトルのタイプ（密/疎） |
| `usage` | object | エンベディング生成の使用統計 |

### `pinecone_upsert_text`

Pineconeインデックスにテキストレコードを挿入または更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | はい | Pineconeインデックスのホスト完全URL |
| `namespace` | string | はい | レコードをアップサートする名前空間 |
| `records` | array | はい | アップサートするレコードまたはレコードの配列。各レコードには_id、テキスト、およびオプションのメタデータが含まれます |
| `apiKey` | string | はい | Pinecone APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `statusText` | string | アップサート操作のステータス |
| `upsertedCount` | number | 正常にアップサートされたレコードの数 |

### `pinecone_search_text`

Pineconeインデックスで類似テキストを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | はい | Pineconeインデックスのホスト完全URL |
| `namespace` | string | いいえ | 検索する名前空間 |
| `searchQuery` | string | はい | 検索するテキスト |
| `topK` | string | いいえ | 返す結果の数 |
| `fields` | array | いいえ | 結果に含めるフィールド |
| `filter` | object | いいえ | 検索に適用するフィルター |
| `rerank` | object | いいえ | 再ランキングパラメータ |
| `apiKey` | string | はい | Pinecone APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `matches` | array | ID、スコア、メタデータを含む検索結果 |

### `pinecone_search_vector`

Pineconeインデックスで類似ベクトルを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | はい | Pineconeインデックスのホスト完全URL |
| `namespace` | string | いいえ | 検索対象の名前空間 |
| `vector` | array | はい | 検索するベクトル |
| `topK` | number | いいえ | 返す結果の数 |
| `filter` | object | いいえ | 検索に適用するフィルター |
| `includeValues` | boolean | いいえ | レスポンスにベクトル値を含める |
| `includeMetadata` | boolean | いいえ | レスポンスにメタデータを含める |
| `apiKey` | string | はい | Pinecone APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `matches` | array | ID、スコア、値、メタデータを含むベクトル検索結果 |
| `namespace` | string | 検索が実行された名前空間 |

### `pinecone_fetch`

PineconeインデックスからIDでベクトルを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `indexHost` | string | はい | Pineconeインデックスのホスト完全URL |
| `ids` | array | はい | 取得するベクトルIDの配列 |
| `namespace` | string | いいえ | ベクトルを取得する名前空間 |
| `apiKey` | string | はい | Pinecone APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `matches` | array | ID、値、メタデータ、スコアを含む取得されたベクトル |

## 注意事項

- カテゴリー: `tools`
- タイプ: `pinecone`
```

--------------------------------------------------------------------------------

---[FILE: pipedrive.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/pipedrive.mdx

```text
---
title: Pipedrive
description: Pipedrive CRMとの連携
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="pipedrive"
  color="#2E6936"
/>

{/* MANUAL-CONTENT-START:intro */}
[Pipedrive](https://www.pipedrive.com)は、営業チームがリードを管理し、商談を追跡し、セールスパイプラインを最適化するために設計された強力な営業重視のCRMプラットフォームです。シンプルさと効果を念頭に置いて構築されたPipedriveは、直感的なビジュアルパイプライン管理と実用的な営業インサイトにより、世界中の営業プロフェッショナルや成長中の企業に愛用されています。

Pipedriveは、リード獲得から商談成立までの営業プロセス全体を管理するための包括的なツールセットを提供しています。強力なAPIと広範な統合機能により、Pipedriveは営業チームが繰り返し行うタスクを自動化し、データの一貫性を維持し、最も重要なこと—商談の成立—に集中できるようにします。

Pipedriveの主な機能には以下が含まれます：

- ビジュアルセールスパイプライン：カスタマイズ可能な営業段階を通じて商談を管理するための直感的なドラッグアンドドロップインターフェース
- リード管理：潜在的な機会を獲得、評価、変換するための包括的なリードインボックス
- 活動追跡：通話、会議、メール、タスクをスケジュールし追跡するための洗練されたシステム
- プロジェクト管理：販売後の顧客成功と納品のための組み込みプロジェクト追跡機能
- メール統合：CRM内でのシームレスなコミュニケーション追跡のためのネイティブメールボックス統合

Simでは、PipedriveインテグレーションによりAIエージェントがセールスワークフローとシームレスに連携できます。これにより、AIを活用した営業プロセスの一部として、リード評価の自動化、商談の作成と更新、活動のスケジューリング、パイプライン管理などの機会が生まれます。このインテグレーションにより、エージェントは商談、リード、活動、プロジェクトをプログラムで作成、取得、更新、管理できるようになり、インテリジェントな営業自動化を促進し、重要な顧客情報が適切に追跡され対応されることを保証します。SimとPipedriveを連携させることで、セールスパイプラインの可視性を維持し、定型的なCRMタスクを自動化し、リードをインテリジェントに評価し、商談の取りこぼしを防止するAIエージェントを構築できます—これにより営業チームの生産性を向上させ、一貫した収益成長を促進します。
{/* MANUAL-CONTENT-END */}

## 使用手順

Pipedriveをワークフローに統合します。強力なCRM機能を使用して、商談、連絡先、セールスパイプライン、プロジェクト、活動、ファイル、コミュニケーションを管理します。

## ツール

### `pipedrive_get_all_deals`

オプションのフィルターを使用してPipedriveからすべての商談を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `status` | string | いいえ | 特定のステータスの商談のみを取得します。値: open, won, lost。省略した場合、削除されていないすべての商談が返されます |
| `person_id` | string | いいえ | 指定された人物にリンクされた商談のみが返されます |
| `org_id` | string | いいえ | 指定された組織にリンクされた商談のみが返されます |
| `pipeline_id` | string | いいえ | 指定されたパイプラインの商談のみが返されます |
| `updated_since` | string | いいえ | 設定した場合、この時間以降に更新された商談のみが返されます。形式: 2025-01-01T10:20:00Z |
| `limit` | string | いいえ | 返す結果の数（デフォルト: 100、最大: 500） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deals` | array | Pipedriveからの取引オブジェクトの配列 |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_get_deal`

特定の取引に関する詳細情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | はい | 取得する取引のID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deal` | object | 詳細情報を含む取引オブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_create_deal`

Pipedriveで新しい取引を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `title` | string | はい | 取引のタイトル |
| `value` | string | いいえ | 取引の金銭的価値 |
| `currency` | string | いいえ | 通貨コード（例：USD、EUR） |
| `person_id` | string | いいえ | この取引に関連する人物のID |
| `org_id` | string | いいえ | この取引に関連する組織のID |
| `pipeline_id` | string | いいえ | この取引を配置するパイプラインのID |
| `stage_id` | string | いいえ | この取引を配置するステージのID |
| `status` | string | いいえ | 取引のステータス：open、won、lost |
| `expected_close_date` | string | いいえ | YYYY-MM-DD形式の予想クローズ日 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deal` | object | 作成された取引オブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_update_deal`

Pipedriveの既存のディールを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | はい | 更新するディールのID |
| `title` | string | いいえ | ディールの新しいタイトル |
| `value` | string | いいえ | ディールの新しい金銭的価値 |
| `status` | string | いいえ | 新しいステータス: open, won, lost |
| `stage_id` | string | いいえ | ディールの新しいステージID |
| `expected_close_date` | string | いいえ | YYYY-MM-DD形式の新しい予定終了日 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deal` | object | 更新された取引オブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_get_files`

オプションのフィルターを使用してPipedriveからファイルを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | いいえ | ディールIDでファイルをフィルタリング |
| `person_id` | string | いいえ | 担当者IDでファイルをフィルタリング |
| `org_id` | string | いいえ | 組織IDでファイルをフィルタリング |
| `limit` | string | いいえ | 返す結果の数（デフォルト: 100、最大: 500） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `files` | array | Pipedriveからのファイルオブジェクトの配列 |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_get_mail_messages`

Pipedriveメールボックスからメールスレッドを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `folder` | string | いいえ | フォルダーでフィルタリング: inbox, drafts, sent, archive \(デフォルト: inbox\) |
| `limit` | string | いいえ | 返す結果の数 \(デフォルト: 50\) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `messages` | array | Pipedriveメールボックスからのメールスレッドオブジェクトの配列 |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_get_mail_thread`

特定のメールスレッドからすべてのメッセージを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `thread_id` | string | はい | メールスレッドのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `messages` | array | スレッドからのメールメッセージオブジェクトの配列 |
| `metadata` | object | スレッドIDを含む操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_get_pipelines`

Pipedriveからすべてのパイプラインを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `sort_by` | string | いいえ | ソートするフィールド: id, update_time, add_time \(デフォルト: id\) |
| `sort_direction` | string | いいえ | ソート方向: asc, desc \(デフォルト: asc\) |
| `limit` | string | いいえ | 返す結果の数 \(デフォルト: 100, 最大: 500\) |
| `cursor` | string | いいえ | ページネーション用、次のページの最初の項目を表すマーカー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `pipelines` | array | Pipedriveからのパイプラインオブジェクトの配列 |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_get_pipeline_deals`

特定のパイプラインにあるすべての取引を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `pipeline_id` | string | はい | パイプラインのID |
| `stage_id` | string | いいえ | パイプライン内の特定のステージでフィルタリング |
| `status` | string | いいえ | 取引ステータスでフィルタリング: open、won、lost |
| `limit` | string | いいえ | 返す結果の数（デフォルト: 100、最大: 500） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deals` | array | パイプラインからの取引オブジェクトの配列 |
| `metadata` | object | パイプラインIDを含む操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_get_projects`

Pipedriveからすべてのプロジェクトまたは特定のプロジェクトを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `project_id` | string | いいえ | オプション: 取得する特定のプロジェクトのID |
| `status` | string | いいえ | プロジェクトステータスでフィルタリング: open、completed、deleted（すべてリスト表示する場合のみ） |
| `limit` | string | いいえ | 返す結果の数（デフォルト: 100、最大: 500、すべてリスト表示する場合のみ） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `projects` | array | プロジェクトオブジェクトの配列（すべてをリスト表示する場合） |
| `project` | object | 単一のプロジェクトオブジェクト（project_idが提供される場合） |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_create_project`

Pipedriveで新しいプロジェクトを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `title` | string | はい | プロジェクトのタイトル |
| `description` | string | いいえ | プロジェクトの説明 |
| `start_date` | string | いいえ | プロジェクト開始日（YYYY-MM-DD形式） |
| `end_date` | string | いいえ | プロジェクト終了日（YYYY-MM-DD形式） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `project` | object | 作成されたプロジェクトオブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_get_activities`

オプションのフィルターを使用してPipedriveからアクティビティ（タスク）を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deal_id` | string | いいえ | 取引IDでアクティビティをフィルタリング |
| `person_id` | string | いいえ | 担当者IDでアクティビティをフィルタリング |
| `org_id` | string | いいえ | 組織IDでアクティビティをフィルタリング |
| `type` | string | いいえ | アクティビティタイプでフィルタリング（通話、会議、タスク、期限、メール、ランチ） |
| `done` | string | いいえ | 完了ステータスでフィルタリング：0は未完了、1は完了 |
| `limit` | string | いいえ | 返す結果の数（デフォルト：100、最大：500） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `activities` | array | Pipedriveからのアクティビティオブジェクトの配列 |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_create_activity`

Pipedriveで新しいアクティビティ（タスク）を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `subject` | string | はい | アクティビティの件名/タイトル |
| `type` | string | はい | アクティビティタイプ: call, meeting, task, deadline, email, lunch |
| `due_date` | string | はい | YYYY-MM-DD形式の期日 |
| `due_time` | string | いいえ | HH:MM形式の期限時間 |
| `duration` | string | いいえ | HH:MM形式の所要時間 |
| `deal_id` | string | いいえ | 関連付けるディールのID |
| `person_id` | string | いいえ | 関連付ける人物のID |
| `org_id` | string | いいえ | 関連付ける組織のID |
| `note` | string | いいえ | アクティビティのメモ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `activity` | object | 作成されたアクティビティオブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_update_activity`

Pipedriveで既存のアクティビティ（タスク）を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `activity_id` | string | はい | 更新するアクティビティのID |
| `subject` | string | いいえ | アクティビティの新しい件名/タイトル |
| `due_date` | string | いいえ | YYYY-MM-DD形式の新しい期日 |
| `due_time` | string | いいえ | HH:MM形式の新しい期限時間 |
| `duration` | string | いいえ | HH:MM形式の新しい所要時間 |
| `done` | string | いいえ | 完了としてマーク: 0は未完了、1は完了 |
| `note` | string | いいえ | アクティビティの新しいメモ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `activity` | object | 更新されたアクティビティオブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_get_leads`

Pipedriveからすべてのリードまたは特定のリードを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | いいえ | オプション：取得する特定のリードのID |
| `archived` | string | いいえ | アクティブなリードの代わりにアーカイブされたリードを取得 |
| `owner_id` | string | いいえ | オーナーユーザーIDでフィルタリング |
| `person_id` | string | いいえ | 個人IDでフィルタリング |
| `organization_id` | string | いいえ | 組織IDでフィルタリング |
| `limit` | string | いいえ | 返す結果の数（デフォルト：100、最大：500） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `leads` | array | リード オブジェクトの配列（すべてをリスト表示する場合） |
| `lead` | object | 単一のリード オブジェクト（lead_id が提供される場合） |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_create_lead`

Pipedriveに新しいリードを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `title` | string | はい | リードの名前 |
| `person_id` | string | いいえ | 個人のID（organization_idが提供されない限り必須） |
| `organization_id` | string | いいえ | 組織のID（person_idが提供されない限り必須） |
| `owner_id` | string | いいえ | リードを所有するユーザーのID |
| `value_amount` | string | いいえ | 潜在的な価値の金額 |
| `value_currency` | string | いいえ | 通貨コード（例：USD、EUR） |
| `expected_close_date` | string | いいえ | YYYY-MM-DD形式の予想クローズ日 |
| `visible_to` | string | いいえ | 可視性：1（オーナーとフォロワー）、3（会社全体） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `lead` | object | 作成されたリードオブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_update_lead`

Pipedriveの既存リードを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | はい | 更新するリードのID |
| `title` | string | いいえ | リードの新しい名前 |
| `person_id` | string | いいえ | 新しい担当者ID |
| `organization_id` | string | いいえ | 新しい組織ID |
| `owner_id` | string | いいえ | 新しいオーナーユーザーID |
| `value_amount` | string | いいえ | 新しい金額 |
| `value_currency` | string | いいえ | 新しい通貨コード（例：USD、EUR） |
| `expected_close_date` | string | いいえ | YYYY-MM-DD形式の新しい予定クローズ日 |
| `is_archived` | string | いいえ | リードをアーカイブする：trueまたはfalse |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `lead` | object | 更新されたリードオブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `pipedrive_delete_lead`

Pipedriveから特定のリードを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `lead_id` | string | はい | 削除するリードのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `data` | object | 削除確認データ |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

## 注意事項

- カテゴリー: `tools`
- タイプ: `pipedrive`
```

--------------------------------------------------------------------------------

---[FILE: polymarket.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/polymarket.mdx

```text
---
title: Polymarket
description: Polymarketの予測市場データにアクセス
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="polymarket"
  color="#4C82FB"
/>

{/* MANUAL-CONTENT-START:intro */}
[Polymarket](https://polymarket.com)は、ユーザーがブロックチェーン技術を使用して将来のイベントの結果に取引できる分散型予測市場プラットフォームです。Polymarketは包括的なAPIを提供し、開発者やエージェントがライブ市場データ、イベントリスト、価格情報、注文台帳の統計にアクセスして、データ駆動型ワークフローやAI自動化を強化することができます。

PolymarketのAPIとSimの統合により、エージェントがプログラムで予測市場情報を取得し、オープン市場と関連イベントを探索し、過去の価格データを分析し、注文台帳と市場の中間点にアクセスすることができます。これにより、市場価格から導き出されるリアルタイムのイベント確率に反応する研究、自動分析、インテリジェントエージェントの開発に新たな可能性が生まれます。

Polymarket統合の主な機能には以下が含まれます：

- **市場リスト化とフィルタリング：** 現在または過去のすべての予測市場をリスト化し、タグでフィルタリングし、ソートし、結果をページ分けします。
- **市場詳細：** 市場IDまたはスラグによる単一市場の詳細を取得し、その結果と状態を含みます。
- **イベントリスト：** Polymarketイベントのリストと詳細なイベント情報にアクセスします。
- **注文台帳と価格データ：** 注文台帳を分析し、最新の市場価格を取得し、中間点を表示するか、任意の市場の過去の価格情報を取得します。
- **自動化対応：** 市場の発展、変化するオッズ、または特定のイベント結果にプログラムで反応するエージェントやツールを構築します。

これらの文書化されたAPIエンドポイントを使用することで、Polymarketの豊富なオンチェーン予測市場データをあなた自身のAIワークフロー、ダッシュボード、研究ツール、取引自動化にシームレスに統合することができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Polymarket予測市場をワークフローに統合します。市場一覧、特定の市場、イベント一覧、特定のイベント、タグ、シリーズ、注文台帳、価格、中間値、価格履歴、最終取引価格、スプレッド、ティックサイズ、ポジション、取引、および検索が可能です。

## ツール

### `polymarket_get_markets`

Polymarketから予測市場のリストをオプションのフィルタリングで取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `closed` | string | いいえ | クローズ状態でフィルタリング（true/false）。アクティブな市場のみの場合はfalseを使用。 |
| `order` | string | いいえ | ソートフィールド（例：volumeNum、liquidityNum、startDate、endDate、createdAt） |
| `ascending` | string | いいえ | ソート方向（昇順の場合はtrue、降順の場合はfalse） |
| `tagId` | string | いいえ | タグIDでフィルタリング |
| `limit` | string | いいえ | ページあたりの結果数（最大50） |
| `offset` | string | いいえ | ページネーションオフセット（この数の結果をスキップ） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 市場データとメタデータ |

### `polymarket_get_market`

IDまたはスラグで特定の予測市場の詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `marketId` | string | いいえ | 市場ID。slugが提供されていない場合は必須。 |
| `slug` | string | いいえ | 市場スラグ（例："will-trump-win"）。marketIdが提供されていない場合は必須。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 市場データとメタデータ |

### `polymarket_get_events`

Polymarketからイベントのリストを取得し、オプションでフィルタリングできます

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `closed` | string | いいえ | クローズ状態でフィルタリング（true/false）。アクティブなイベントのみの場合はfalseを使用。 |
| `order` | string | いいえ | ソートフィールド（例：volume、liquidity、startDate、endDate、createdAt） |
| `ascending` | string | いいえ | ソート方向（昇順の場合はtrue、降順の場合はfalse） |
| `tagId` | string | いいえ | タグIDでフィルタリング |
| `limit` | string | いいえ | ページあたりの結果数（最大50） |
| `offset` | string | いいえ | ページネーションオフセット（この数の結果をスキップ） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | イベントデータとメタデータ |

### `polymarket_get_event`

IDまたはスラグで特定のイベントの詳細を取得

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `eventId` | string | いいえ | イベントID。slugが提供されていない場合は必須。 |
| `slug` | string | いいえ | イベントスラグ（例："2024-presidential-election"）。eventIdが提供されていない場合は必須。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | イベントデータとメタデータ |

### `polymarket_get_tags`

Polymarketからマーケットのフィルタリング用の利用可能なタグを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `limit` | string | いいえ | ページあたりの結果数（最大50） |
| `offset` | string | いいえ | ページネーションオフセット（この数の結果をスキップ） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | タグデータとメタデータ |

### `polymarket_search`

Polymarketでマーケット、イベント、プロフィールを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 検索クエリ用語 |
| `limit` | string | いいえ | ページあたりの結果数（最大50） |
| `offset` | string | いいえ | ページネーションオフセット |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 検索結果データとメタデータ |

### `polymarket_get_series`

Polymarketからシリーズ（関連するマーケットグループ）を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `limit` | string | いいえ | ページあたりの結果数（最大50） |
| `offset` | string | いいえ | ページネーションオフセット（この数の結果をスキップ） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | シリーズデータとメタデータ |

### `polymarket_get_series_by_id`

PolymarketからIDで特定のシリーズ（関連する市場グループ）を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `seriesId` | string | はい | シリーズID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | シリーズデータとメタデータ |

### `polymarket_get_orderbook`

特定のトークンのオーダーブック概要を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | はい | CLOBトークンID（市場のclobTokenIdsから） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 注文台帳データとメタデータ |

### `polymarket_get_price`

特定のトークンとサイドの市場価格を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | はい | CLOBトークンID（市場のclobTokenIdsから） |
| `side` | string | はい | 注文サイド：buyまたはsell |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 市場価格データとメタデータ |

### `polymarket_get_midpoint`

特定のトークンの中間価格を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | はい | CLOBトークンID（市場のclobTokenIdsから） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 中間価格データとメタデータ |

### `polymarket_get_price_history`

特定の市場トークンの過去の価格データを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | はい | CLOBトークンID（市場のclobTokenIdsから） |
| `interval` | string | いいえ | 現在時刻で終了する期間（1m、1h、6h、1d、1w、max）。startTs/endTsと相互に排他的。 |
| `fidelity` | number | いいえ | データの解像度（分単位、例：60で1時間ごと） |
| `startTs` | number | いいえ | 開始タイムスタンプ（Unixの秒数、UTC） |
| `endTs` | number | いいえ | 終了タイムスタンプ（Unixの秒数、UTC） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 価格履歴データとメタデータ |

### `polymarket_get_last_trade_price`

特定のトークンの最終取引価格を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | はい | CLOBトークンID（市場のclobTokenIdsから） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 最終取引価格データとメタデータ |

### `polymarket_get_spread`

特定のトークンのビッドアスクスプレッドを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | はい | CLOBトークンID（市場のclobTokenIdsから） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | スプレッドデータとメタデータ |

### `polymarket_get_tick_size`

特定のトークンの最小ティックサイズを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `tokenId` | string | はい | CLOBトークンID（市場のclobTokenIdsから） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 最小ティックサイズデータとメタデータ |

### `polymarket_get_positions`

Polymarketからユーザーポジションを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `user` | string | はい | ユーザーウォレットアドレス |
| `market` | string | いいえ | ポジションをフィルタリングするためのオプションのマーケットID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | ポジションデータとメタデータ |

### `polymarket_get_trades`

Polymarketから取引履歴を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `user` | string | いいえ | 取引をフィルタリングするユーザーウォレットアドレス |
| `market` | string | いいえ | 取引をフィルタリングするマーケットID |
| `limit` | string | いいえ | ページあたりの結果数（最大50） |
| `offset` | string | いいえ | ページネーションオフセット（この数の結果をスキップ） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `trades` | array | 取引オブジェクトの配列 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `polymarket`
```

--------------------------------------------------------------------------------

---[FILE: postgresql.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/postgresql.mdx

```text
---
title: PostgreSQL
description: PostgreSQLデータベースに接続する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="postgresql"
  color="#336791"
/>

{/* MANUAL-CONTENT-START:intro */}
[PostgreSQL](https://www.postgresql.org/)ツールを使用すると、任意のPostgreSQLデータベースに接続し、エージェントワークフロー内で直接幅広いデータベース操作を実行できます。安全な接続処理と柔軟な構成により、データの管理やインタラクションが簡単に行えます。

PostgreSQLツールでは、以下のことが可能です：

- **データのクエリ**: `postgresql_query` 操作を使用して、PostgreSQLテーブルからデータを取得するSELECTクエリを実行できます。
- **レコードの挿入**: `postgresql_insert` 操作を使用して、テーブルと挿入するデータを指定することで、テーブルに新しい行を追加できます。
- **レコードの更新**: `postgresql_update` 操作を使用して、テーブル、新しいデータ、WHERE条件を提供することで、テーブル内の既存データを変更できます。
- **レコードの削除**: `postgresql_delete` 操作を使用して、テーブルとWHERE条件を指定することで、テーブルから行を削除できます。
- **生のSQLの実行**: 高度なユースケース向けに `postgresql_execute` 操作を使用して、任意のカスタムSQLコマンドを実行できます。

PostgreSQLツールは、エージェントが構造化データとインタラクションする必要があるシナリオに最適です。例えば、レポートの自動化、システム間のデータ同期、データ駆動型ワークフローの強化などです。データベースアクセスを合理化し、PostgreSQLデータをプログラムで簡単に読み取り、書き込み、管理できるようにします。
{/* MANUAL-CONTENT-END */}

## 使用方法

PostgreSQLをワークフローに統合します。クエリ、挿入、更新、削除、および生のSQLを実行できます。

## ツール

### `postgresql_query`

PostgreSQLデータベースでSELECTクエリを実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | PostgreSQLサーバーのホスト名またはIPアドレス |
| `port` | number | はい | PostgreSQLサーバーのポート（デフォルト：5432） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | データベースのユーザー名 |
| `password` | string | はい | データベースのパスワード |
| `ssl` | string | いいえ | SSL接続モード（disabled、required、preferred） |
| `query` | string | はい | 実行するSQL SELECTクエリ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | クエリから返された行の配列 |
| `rowCount` | number | 返された行数 |

### `postgresql_insert`

PostgreSQLデータベースにデータを挿入する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | PostgreSQLサーバーのホスト名またはIPアドレス |
| `port` | number | はい | PostgreSQLサーバーのポート（デフォルト：5432） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | データベースのユーザー名 |
| `password` | string | はい | データベースのパスワード |
| `ssl` | string | いいえ | SSL接続モード（disabled、required、preferred） |
| `table` | string | はい | データを挿入するテーブル名 |
| `data` | object | はい | 挿入するデータオブジェクト（キーと値のペア） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | 挿入されたデータ（RETURNING句が使用された場合） |
| `rowCount` | number | 挿入された行数 |

### `postgresql_update`

PostgreSQLデータベースのデータを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | PostgreSQLサーバーのホスト名またはIPアドレス |
| `port` | number | はい | PostgreSQLサーバーのポート（デフォルト：5432） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | データベースのユーザー名 |
| `password` | string | はい | データベースのパスワード |
| `ssl` | string | いいえ | SSL接続モード（disabled、required、preferred） |
| `table` | string | はい | データを更新するテーブル名 |
| `data` | object | はい | 更新するフィールドを含むデータオブジェクト（キーと値のペア） |
| `where` | string | はい | WHERE句の条件（WHEREキーワードなし） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | 更新されたデータ（RETURNINGクラウズを使用した場合） |
| `rowCount` | number | 更新された行数 |

### `postgresql_delete`

PostgreSQLデータベースからデータを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | PostgreSQLサーバーのホスト名またはIPアドレス |
| `port` | number | はい | PostgreSQLサーバーのポート（デフォルト：5432） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | データベースのユーザー名 |
| `password` | string | はい | データベースのパスワード |
| `ssl` | string | いいえ | SSL接続モード（disabled、required、preferred） |
| `table` | string | はい | データを削除するテーブル名 |
| `where` | string | はい | WHERE句の条件（WHEREキーワードなし） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | 削除されたデータ（RETURNINGクラウズを使用した場合） |
| `rowCount` | number | 削除された行数 |

### `postgresql_execute`

PostgreSQLデータベースで生のSQLクエリを実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | PostgreSQLサーバーのホスト名またはIPアドレス |
| `port` | number | はい | PostgreSQLサーバーのポート（デフォルト：5432） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | データベースのユーザー名 |
| `password` | string | はい | データベースのパスワード |
| `ssl` | string | いいえ | SSL接続モード（disabled、required、preferred） |
| `query` | string | はい | 実行する生のSQLクエリ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | クエリから返された行の配列 |
| `rowCount` | number | 影響を受けた行数 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `postgresql`
```

--------------------------------------------------------------------------------

````
