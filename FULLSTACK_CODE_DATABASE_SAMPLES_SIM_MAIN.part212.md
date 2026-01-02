---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 212
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 212 of 933)

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

---[FILE: search.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/search.mdx

```text
---
title: 検索
description: ウェブを検索（検索1回あたり$0.01）
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="search"
  color="#3B82F6"
/>

{/* MANUAL-CONTENT-START:intro */}
**検索**ツールを使用すると、最先端の検索エンジンを活用してSimワークフロー内からウェブ検索ができます。これにより、最新の情報、ニュース、事実、ウェブコンテンツをエージェント、自動化、または会話に直接取り込むことができます。

- **一般的なウェブ検索**：ワークフローを補完するためにインターネットから最新情報を見つけることができます。
- **自動クエリ**：エージェントやプログラムロジックが検索クエリを送信し、結果を自動的に処理できます。
- **構造化された結果**：最も関連性の高いウェブ結果を返し、各結果のタイトル、リンク、スニペット、日付を含みます。

> **注意：** 検索は1クエリあたり**$0.01**の費用がかかります。

このツールは、エージェントがライブウェブデータにアクセスする必要がある、または現在のイベントを参照したり、調査を実行したり、補足コンテンツを取得したりする必要があるワークフローに最適です。
{/* MANUAL-CONTENT-END */}

## 使用方法

検索ツールを使用してウェブを検索します。検索は1クエリあたり$0.01の費用がかかります。

## ツール

### `search_tool`

ウェブを検索します。最も関連性の高いウェブ結果を返し、各結果のタイトル、リンク、スニペット、日付を含みます。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 検索クエリ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `results` | json | 検索結果 |
| `query` | string | 検索クエリ |
| `totalResults` | number | 結果の総数 |
| `source` | string | 検索ソース（exa） |
| `cost` | json | コスト情報（$0.01） |

## メモ

- カテゴリー: `tools`
- タイプ: `search`
```

--------------------------------------------------------------------------------

---[FILE: sendgrid.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/sendgrid.mdx

```text
---
title: SendGrid
description: SendGridでメールの送信、連絡先、リスト、テンプレートの管理を行う
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sendgrid"
  color="#1A82E2"
/>

{/* MANUAL-CONTENT-START:intro */}
[SendGrid](https://sendgrid.com)は、開発者や企業が信頼する、スケーラブルなトランザクションメールやマーケティングメールを確実に配信するクラウドベースのメール配信プラットフォームです。強力なAPIとツールを備え、SendGridは通知や領収書の送信から複雑なマーケティングキャンペーンの管理まで、あらゆるメールコミュニケーションを管理できます。

SendGridは、重要なメールワークフローの自動化や連絡先リスト、テンプレート、受信者のエンゲージメントの緻密な管理など、メール運用の完全なスイートを提供します。Simとのシームレスな統合により、エージェントやワークフローはターゲットを絞ったメッセージの配信、動的な連絡先やリストの維持、テンプレートを通じたパーソナライズされたメールの送信、そしてリアルタイムでの結果追跡が可能になります。

SendGridの主な機能には以下が含まれます：

- **トランザクションメール：** 自動化された大量のトランザクションメール（通知、領収書、パスワードリセットなど）を送信。
- **動的テンプレート：** リッチHTMLまたはテキストテンプレートに動的データを使用して、高度にパーソナライズされた大規模なコミュニケーションを実現。
- **連絡先管理：** マーケティング連絡先の追加と更新、受信者リストの管理、キャンペーン向けのセグメントのターゲティング。
- **添付ファイルのサポート：** メールに1つまたは複数のファイル添付が可能。
- **包括的なAPIカバレッジ：** メール、連絡先、リスト、テンプレート、抑制グループなどをプログラムで管理。

SendGridとSimを連携させることで、エージェントは以下のことが可能になります：

- ワークフローの一部として、シンプルなメールと高度な（テンプレート化または複数の受信者向けの）メールの両方を送信。
- 連絡先とリストを自動的に管理・セグメント化。
- 一貫性と動的なパーソナライゼーションのためにテンプレートを活用。
- 自動化されたプロセス内でメールのエンゲージメントを追跡し対応。

この連携により、重要なコミュニケーションフローをすべて自動化し、メッセージが適切な対象者に届くようにし、Simワークフローから直接組織のメール戦略を管理することができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

SendGridをワークフローに統合します。トランザクションメールの送信、マーケティング連絡先とリストの管理、メールテンプレートの操作が可能です。動的テンプレート、添付ファイル、包括的な連絡先管理をサポートしています。

## ツール

### `sendgrid_send_mail`

SendGrid APIを使用してメールを送信する

#### 入力

| パラメータ | 種類 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `from` | string | はい | 送信者のメールアドレス（SendGridで検証済みである必要があります） |
| `fromName` | string | いいえ | 送信者名 |
| `to` | string | はい | 受信者のメールアドレス |
| `toName` | string | いいえ | 受信者名 |
| `subject` | string | いいえ | メールの件名（事前定義された件名を持つテンプレートを使用しない限り必須） |
| `content` | string | いいえ | メール本文のコンテンツ（事前定義されたコンテンツを持つテンプレートを使用しない限り必須） |
| `contentType` | string | いいえ | コンテンツタイプ（text/plainまたはtext/html） |
| `cc` | string | いいえ | CCメールアドレス |
| `bcc` | string | いいえ | BCCメールアドレス |
| `replyTo` | string | いいえ | 返信先メールアドレス |
| `replyToName` | string | いいえ | 返信先名 |
| `attachments` | file[] | いいえ | メールに添付するファイル |
| `templateId` | string | いいえ | 使用するSendGridテンプレートID |
| `dynamicTemplateData` | json | いいえ | 動的テンプレートデータのJSONオブジェクト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メールが正常に送信されたかどうか |
| `messageId` | string | SendGridメッセージID |
| `to` | string | 受信者のメールアドレス |
| `subject` | string | メールの件名 |

### `sendgrid_add_contact`

SendGridに新しい連絡先を追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `email` | string | はい | 連絡先のメールアドレス |
| `firstName` | string | いいえ | 連絡先の名 |
| `lastName` | string | いいえ | 連絡先の姓 |
| `customFields` | json | いいえ | カスタムフィールドのキーと値のペアのJSONオブジェクト（フィールド名ではなく、e1_T、e2_N、e3_DなどのフィールドIDを使用） |
| `listIds` | string | いいえ | 連絡先を追加するリストIDのカンマ区切りリスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `jobId` | string | 非同期連絡先作成を追跡するためのジョブID |
| `email` | string | 連絡先のメールアドレス |
| `firstName` | string | 連絡先の名 |
| `lastName` | string | 連絡先の姓 |
| `message` | string | ステータスメッセージ |

### `sendgrid_get_contact`

SendGridから特定の連絡先をIDで取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `contactId` | string | はい | 連絡先ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | string | 連絡先ID |
| `email` | string | 連絡先のメールアドレス |
| `firstName` | string | 連絡先の名 |
| `lastName` | string | 連絡先の姓 |
| `createdAt` | string | 作成タイムスタンプ |
| `updatedAt` | string | 最終更新タイムスタンプ |
| `listIds` | json | 連絡先が所属するリストIDの配列 |
| `customFields` | json | カスタムフィールドの値 |

### `sendgrid_search_contacts`

クエリを使用してSendGrid内の連絡先を検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `query` | string | はい | 検索クエリ（例："email LIKE '%example.com%' AND CONTAINS(list_ids, 'list-id')"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `contacts` | json | 一致する連絡先の配列 |
| `contactCount` | number | 見つかった連絡先の総数 |

### `sendgrid_delete_contacts`

SendGridから1つ以上の連絡先を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `contactIds` | string | はい | 削除する連絡先IDのカンマ区切りリスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `jobId` | string | 削除リクエストのジョブID |

### `sendgrid_create_list`

SendGridで新しいコンタクトリストを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `name` | string | はい | リスト名 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | string | リストID |
| `name` | string | リスト名 |
| `contactCount` | number | リスト内のコンタクト数 |

### `sendgrid_get_list`

SendGridから特定のリストをIDで取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `listId` | string | はい | リストID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | string | リストID |
| `name` | string | リスト名 |
| `contactCount` | number | リスト内のコンタクト数 |

### `sendgrid_list_all_lists`

SendGridからすべてのコンタクトリストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `pageSize` | number | いいえ | ページごとに返すリスト数（デフォルト：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `lists` | json | リストの配列 |

### `sendgrid_delete_list`

SendGridからコンタクトリストを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `listId` | string | はい | 削除するリストID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功メッセージ |

### `sendgrid_add_contacts_to_list`

SendGridでコンタクトを追加または更新し、リストに割り当てる（PUT /v3/marketing/contactsを使用）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `listId` | string | はい | コンタクトを追加するリストID |
| `contacts` | json | はい | コンタクトオブジェクトのJSON配列。各コンタクトには少なくとも：email（またはphone_number_id/external_id/anonymous_id）が必要。例：\[\{"email": "user@example.com", "first_name": "John"\}\] |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `jobId` | string | 非同期操作を追跡するためのジョブID |
| `message` | string | ステータスメッセージ |

### `sendgrid_remove_contacts_from_list`

SendGridの特定のリストからコンタクトを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `listId` | string | はい | リストID |
| `contactIds` | string | はい | リストから削除するコンタクトIDのカンマ区切りリスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `jobId` | string | リクエストのジョブID |

### `sendgrid_create_template`

SendGridで新しいメールテンプレートを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `name` | string | はい | テンプレート名 |
| `generation` | string | いいえ | テンプレート生成タイプ（レガシーまたはダイナミック、デフォルト：ダイナミック） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | string | テンプレートID |
| `name` | string | テンプレート名 |
| `generation` | string | テンプレート生成 |
| `updatedAt` | string | 最終更新タイムスタンプ |
| `versions` | json | テンプレートバージョンの配列 |

### `sendgrid_get_template`

SendGridから特定のテンプレートをIDで取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `templateId` | string | はい | テンプレートID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | string | テンプレートID |
| `name` | string | テンプレート名 |
| `generation` | string | テンプレート生成 |
| `updatedAt` | string | 最終更新タイムスタンプ |
| `versions` | json | テンプレートバージョンの配列 |

### `sendgrid_list_templates`

SendGridからすべてのメールテンプレートを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `generations` | string | いいえ | 生成方法でフィルタリング（legacy、dynamic、または両方） |
| `pageSize` | number | いいえ | ページごとに返すテンプレートの数（デフォルト：20） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `templates` | json | テンプレートの配列 |

### `sendgrid_delete_template`

SendGridからメールテンプレートを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `templateId` | string | はい | 削除するテンプレートID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `message` | string | ステータスまたは成功メッセージ |
| `messageId` | string | メールメッセージID \(send_mail\) |
| `to` | string | 受信者のメールアドレス \(send_mail\) |
| `subject` | string | メールの件名 \(send_mail, create_template_version\) |
| `id` | string | リソースID |
| `jobId` | string | 非同期操作用のジョブID |
| `email` | string | 連絡先のメールアドレス |
| `firstName` | string | 連絡先の名 |
| `lastName` | string | 連絡先の姓 |
| `createdAt` | string | 作成タイムスタンプ |
| `updatedAt` | string | 最終更新タイムスタンプ |
| `listIds` | json | 連絡先が所属するリストIDの配列 |
| `customFields` | json | カスタムフィールドの値 |
| `contacts` | json | 連絡先の配列 |
| `contactCount` | number | 連絡先の数 |
| `lists` | json | リストの配列 |
| `name` | string | リソース名 |
| `templates` | json | テンプレートの配列 |
| `generation` | string | テンプレート世代 |
| `versions` | json | テンプレートバージョンの配列 |
| `templateId` | string | テンプレートID |
| `active` | boolean | テンプレートバージョンがアクティブかどうか |
| `htmlContent` | string | HTML内容 |
| `plainContent` | string | プレーンテキスト内容 |

### `sendgrid_create_template_version`

SendGridでメールテンプレートの新しいバージョンを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | SendGrid APIキー |
| `templateId` | string | はい | テンプレートID |
| `name` | string | はい | バージョン名 |
| `subject` | string | はい | メールの件名 |
| `htmlContent` | string | いいえ | テンプレートのHTML内容 |
| `plainContent` | string | いいえ | テンプレートのプレーンテキスト内容 |
| `active` | boolean | いいえ | このバージョンがアクティブかどうか（デフォルト：true） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | string | バージョンID |
| `templateId` | string | テンプレートID |
| `name` | string | バージョン名 |
| `subject` | string | メールの件名 |
| `active` | boolean | このバージョンがアクティブかどうか |
| `htmlContent` | string | HTML内容 |
| `plainContent` | string | プレーンテキスト内容 |
| `updatedAt` | string | 最終更新タイムスタンプ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `sendgrid`
```

--------------------------------------------------------------------------------

---[FILE: sentry.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/sentry.mdx

```text
---
title: Sentry
description: Sentryの問題、プロジェクト、イベント、リリースを管理
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sentry"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Sentry](https://sentry.io/)でエラー監視とアプリケーションの信頼性を強化しましょう — リアルタイムエラー追跡、パフォーマンス監視、リリース管理のための業界をリードするプラットフォームです。Sentryを自動化エージェントワークフローにシームレスに統合して、問題の監視、重要なイベントの追跡、プロジェクトの管理、およびすべてのアプリケーションとサービス全体でのリリースの調整を簡単に行うことができます。

Sentryツールを使用すると、以下のことが可能です：

- **問題の監視とトリアージ**: `sentry_issues_list` 操作を使用して問題の包括的なリストを取得し、`sentry_issues_get` を通じて個々のエラーやバグに関する詳細情報を取得できます。メタデータ、タグ、スタックトレース、統計情報に即座にアクセスして、解決までの平均時間を短縮します。
- **イベントデータの追跡**: `sentry_events_list` と `sentry_events_get` を使用して特定のエラーとイベントインスタンスを分析し、エラーの発生とユーザーへの影響に関する深い洞察を提供します。
- **プロジェクトとチームの管理**: `sentry_projects_list` と `sentry_project_get` を使用してすべてのSentryプロジェクトを列挙・確認し、チームのコラボレーションと一元化された構成を確保します。
- **リリースの調整**: `sentry_releases_list`、`sentry_release_get` などの操作を使用して、コードベース全体でのバージョン追跡、デプロイメントの健全性、変更管理を自動化します。
- **強力なアプリケーションインサイトの獲得**: 高度なフィルターとクエリを活用して、未解決または優先度の高い問題を見つけ、時間の経過に伴うイベント統計を集計し、コードベースの進化に伴う回帰を追跡します。

Sentryの統合により、エンジニアリングチームとDevOpsチームは早期に問題を検出し、最も影響の大きいバグに優先順位を付け、開発スタック全体でアプリケーションの健全性を継続的に改善することができます。最新の可観測性、インシデント対応、リリースライフサイクル管理のためのワークフロー自動化をプログラムで調整し、ダウンタイムを削減してユーザー満足度を向上させます。

**利用可能な主要なSentry操作**:
- `sentry_issues_list`: 組織やプロジェクトのSentry課題を一覧表示し、強力な検索とフィルタリング機能を提供します。
- `sentry_issues_get`: 特定のSentry課題に関する詳細情報を取得します。
- `sentry_events_list`: 根本原因分析のために特定の課題に関連するイベントを列挙します。
- `sentry_events_get`: スタックトレース、コンテキスト、メタデータを含む個別イベントの詳細情報を取得します。
- `sentry_projects_list`: 組織内のすべてのSentryプロジェクトを一覧表示します。
- `sentry_project_get`: 特定のプロジェクトの設定と詳細を取得します。
- `sentry_releases_list`: 最近のリリースとそのデプロイメント状況を一覧表示します。
- `sentry_release_get`: 関連するコミットと課題を含む詳細なリリース情報を取得します。

アプリの健全性を積極的に管理する場合でも、本番環境のエラーをトラブルシューティングする場合でも、リリースワークフローを自動化する場合でも、Sentryは世界クラスの監視、実用的なアラート、シームレスなDevOps統合を提供します。エージェントワークフローから、エラー追跡、可観測性、リリース管理にSentryを活用することで、ソフトウェアの品質と検索の可視性を向上させましょう。
{/* MANUAL-CONTENT-END */}

## 使用方法

Sentryをワークフローに統合します。アプリケーション全体で課題の監視、プロジェクト管理、イベント追跡、リリース調整を行います。

## ツール

### `sentry_issues_list`

特定の組織、およびオプションで特定のプロジェクトのSentryから課題を一覧表示します。ステータス、エラー数、最終確認タイムスタンプなどの課題の詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Sentry API認証トークン |
| `organizationSlug` | string | はい | 組織のスラグ |
| `projectSlug` | string | いいえ | 特定のプロジェクトスラグで課題をフィルタリング（オプション） |
| `query` | string | いいえ | 課題をフィルタリングする検索クエリ。Sentryの検索構文をサポート（例：「is:unresolved」、「level:error」） |
| `statsPeriod` | string | いいえ | 統計の期間（例：「24h」、「7d」、「30d」）。指定されない場合は24hがデフォルト |
| `cursor` | string | いいえ | 次のページの結果を取得するためのページネーションカーソル |
| `limit` | number | いいえ | ページごとに返す課題の数（デフォルト：25、最大：100） |
| `status` | string | いいえ | 課題のステータスでフィルタリング：unresolved、resolved、ignored、またはmuted |
| `sort` | string | いいえ | ソート順：date、new、freq、priority、またはuser（デフォルト：date） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `issues` | array | Sentryの問題一覧 |

### `sentry_issues_get`

IDによって特定のSentry問題に関する詳細情報を取得します。メタデータ、タグ、統計情報を含む問題の完全な詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Sentry API認証トークン |
| `organizationSlug` | string | はい | 組織のスラグ |
| `issueId` | string | はい | 取得する問題の一意のID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `issue` | object | Sentryの問題に関する詳細情報 |

### `sentry_issues_update`

ステータス、割り当て、ブックマーク状態、またはその他のプロパティを変更することでSentryの問題を更新します。更新された問題の詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Sentry API認証トークン |
| `organizationSlug` | string | はい | 組織のスラグ |
| `issueId` | string | はい | 更新する問題の一意のID |
| `status` | string | いいえ | 問題の新しいステータス：resolved、unresolved、ignored、またはresolvedInNextRelease |
| `assignedTo` | string | いいえ | 問題を割り当てるユーザーIDまたはメール。割り当てを解除するには空の文字列を使用します。 |
| `isBookmarked` | boolean | いいえ | 問題をブックマークするかどうか |
| `isSubscribed` | boolean | いいえ | 問題の更新を購読するかどうか |
| `isPublic` | boolean | いいえ | 問題を公開表示するかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `issue` | object | 更新されたSentryの課題 |

### `sentry_projects_list`

Sentryの組織内のすべてのプロジェクトを一覧表示します。名前、プラットフォーム、チーム、設定などのプロジェクト詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Sentry API認証トークン |
| `organizationSlug` | string | はい | 組織のスラグ |
| `cursor` | string | いいえ | 次のページの結果を取得するためのページネーションカーソル |
| `limit` | number | いいえ | ページごとに返すプロジェクト数（デフォルト：25、最大：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `projects` | array | Sentryプロジェクトのリスト |

### `sentry_projects_get`

スラグによって特定のSentryプロジェクトに関する詳細情報を取得します。チーム、機能、設定を含むプロジェクトの完全な詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Sentry API認証トークン |
| `organizationSlug` | string | はい | 組織のスラグ |
| `projectSlug` | string | はい | 取得するプロジェクトのIDまたはスラグ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `project` | object | Sentryプロジェクトに関する詳細情報 |

### `sentry_projects_create`

組織内に新しいSentryプロジェクトを作成します。プロジェクトを関連付けるチームが必要です。作成されたプロジェクトの詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Sentry API認証トークン |
| `organizationSlug` | string | はい | 組織のスラッグ |
| `name` | string | はい | プロジェクトの名前 |
| `teamSlug` | string | はい | このプロジェクトを所有するチームのスラッグ |
| `slug` | string | いいえ | URL用のプロジェクト識別子（提供されない場合は名前から自動生成されます） |
| `platform` | string | いいえ | プロジェクトのプラットフォーム/言語（例：javascript、python、node、react-native）。指定されない場合、デフォルトは"other"になります |
| `defaultRules` | boolean | いいえ | デフォルトのアラートルールを作成するかどうか（デフォルト：true） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `project` | object | 新しく作成されたSentryプロジェクト |

### `sentry_projects_update`

名前、スラッグ、プラットフォームなどの設定を変更して、Sentryプロジェクトを更新します。更新されたプロジェクトの詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Sentry API認証トークン |
| `organizationSlug` | string | はい | 組織のスラッグ |
| `projectSlug` | string | はい | 更新するプロジェクトのスラッグ |
| `name` | string | いいえ | プロジェクトの新しい名前 |
| `slug` | string | いいえ | 新しいURL用のプロジェクト識別子 |
| `platform` | string | いいえ | プロジェクトの新しいプラットフォーム/言語（例：javascript、python、node） |
| `isBookmarked` | boolean | いいえ | プロジェクトをブックマークするかどうか |
| `digestsMinDelay` | number | いいえ | ダイジェスト通知の最小遅延（秒単位） |
| `digestsMaxDelay` | number | いいえ | ダイジェスト通知の最大遅延（秒単位） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `project` | object | 更新されたSentryプロジェクト |

### `sentry_events_list`

Sentryプロジェクトからイベントを一覧表示します。課題ID、クエリ、または期間でフィルタリングできます。コンテキスト、タグ、ユーザー情報などのイベント詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Sentry API認証トークン |
| `organizationSlug` | string | はい | 組織のスラグ |
| `projectSlug` | string | はい | イベントを一覧表示するプロジェクトのスラグ |
| `issueId` | string | いいえ | 特定の課題IDでイベントをフィルタリング |
| `query` | string | いいえ | イベントをフィルタリングする検索クエリ。Sentryの検索構文をサポート（例："user.email:*@example.com"） |
| `cursor` | string | いいえ | 次のページの結果を取得するためのページネーションカーソル |
| `limit` | number | いいえ | ページごとに返すイベントの数（デフォルト：50、最大：100） |
| `statsPeriod` | string | いいえ | クエリの期間（例："24h"、"7d"、"30d"）。指定されない場合、デフォルトは90d |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `events` | array | Sentryイベントのリスト |

### `sentry_events_get`

IDによって特定のSentryイベントの詳細情報を取得します。スタックトレース、パンくずリスト、コンテキスト、ユーザー情報などの完全なイベント詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Sentry API認証トークン |
| `organizationSlug` | string | はい | 組織のスラグ |
| `projectSlug` | string | はい | プロジェクトのスラグ |
| `eventId` | string | はい | 取得するイベントの一意のID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `event` | object | Sentryイベントに関する詳細情報 |

### `sentry_releases_list`

Sentryの組織またはプロジェクトのリリース一覧を取得します。バージョン、コミット、デプロイ情報、関連プロジェクトなどのリリース詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Sentry API認証トークン |
| `organizationSlug` | string | はい | 組織のスラグ |
| `projectSlug` | string | いいえ | 特定のプロジェクトスラグでリリースをフィルタリング（オプション） |
| `query` | string | いいえ | リリースをフィルタリングする検索クエリ（例：バージョン名パターン） |
| `cursor` | string | いいえ | 次のページの結果を取得するためのページネーションカーソル |
| `limit` | number | いいえ | ページごとに返すリリース数（デフォルト：25、最大：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `releases` | array | Sentryリリースのリスト |

### `sentry_releases_create`

Sentryで新しいリリースを作成します。リリースとは、環境にデプロイされたコードのバージョンです。コミット情報や関連プロジェクトを含めることができます。作成されたリリースの詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Sentry API認証トークン |
| `organizationSlug` | string | はい | 組織のスラッグ |
| `version` | string | はい | リリースのバージョン識別子（例："2.0.0"、"my-app@1.0.0"、またはgitコミットSHA） |
| `projects` | string | はい | このリリースに関連付けるプロジェクトスラッグのカンマ区切りリスト |
| `ref` | string | いいえ | このリリースのGitリファレンス（コミットSHA、タグ、またはブランチ） |
| `url` | string | いいえ | リリースを指すURL（例：GitHubリリースページ） |
| `dateReleased` | string | いいえ | リリースがデプロイされた日時のISO 8601タイムスタンプ（デフォルトは現在時刻） |
| `commits` | string | いいえ | id、repository（オプション）、message（オプション）を持つコミットオブジェクトのJSON配列。例：\[\{"id":"abc123","message":"Fix bug"\}\] |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `release` | object | 新しく作成されたSentryリリース |

### `sentry_releases_deploy`

特定の環境でSentryリリースのデプロイ記録を作成します。デプロイは、リリースがいつどこにデプロイされたかを追跡します。作成されたデプロイの詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Sentry API認証トークン |
| `organizationSlug` | string | はい | 組織のスラグ |
| `version` | string | はい | デプロイされるリリースのバージョン識別子 |
| `environment` | string | はい | リリースがデプロイされる環境名（例："production"、"staging"） |
| `name` | string | いいえ | このデプロイのオプション名（例："Deploy v2.0 to Production"） |
| `url` | string | いいえ | デプロイを指すURL（例：CI/CDパイプラインURL） |
| `dateStarted` | string | いいえ | デプロイが開始された時刻のISO 8601タイムスタンプ（デフォルトは現在時刻） |
| `dateFinished` | string | いいえ | デプロイが完了した時刻のISO 8601タイムスタンプ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deploy` | object | 新しく作成されたデプロイレコード |

## 注意事項

- カテゴリー: `tools`
- タイプ: `sentry`
```

--------------------------------------------------------------------------------

---[FILE: serper.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/serper.mdx

```text
---
title: Serper
description: Serperを使用してウェブを検索
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="serper"
  color="#2B3543"
/>

{/* MANUAL-CONTENT-START:intro */}
[Serper](https://www.serper.com/)はGoogleの検索APIで、開発者にGoogleの検索結果へのプログラム的なアクセスを提供します。Webスクレイピングの複雑さや他の検索APIの制限なしに、Googleの検索機能をアプリケーションに統合するための信頼性の高い高性能な方法を提供します。

Serperでは以下のことが可能です：

- **Google検索結果へのアクセス**：Google検索結果から構造化データをプログラム的に取得
- **様々な検索タイプの実行**：Web検索、画像検索、ニュース検索など
- **豊富なメタデータの取得**：検索結果からタイトル、スニペット、URL、その他の関連情報を入手
- **アプリケーションのスケーリング**：信頼性が高く高速なAPIで検索機能を搭載した機能を構築
- **レート制限の回避**：IPブロックを心配することなく、検索結果への一貫したアクセスを確保

Simでは、Serper統合によりエージェントがワークフローの一部としてWeb検索の力を活用できるようになります。これにより、インターネットからの最新情報を必要とする高度な自動化シナリオが可能になります。エージェントは検索クエリを作成し、関連する結果を取得し、この情報を使用して決定を下したり応答を提供したりすることができます。この統合により、ワークフロー自動化とWeb上で利用可能な膨大な知識の間のギャップが埋まり、エージェントは手動介入なしにリアルタイムの情報にアクセスできるようになります。SimとSerperを接続することで、最新の情報を常に把握し、より正確な応答を提供し、ユーザーにより多くの価値を届けるエージェントを作成できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Serperをワークフローに統合します。Webを検索できます。APIキーが必要です。

## ツール

### `serper_search`

Serper.dev APIを通じてGoogle検索結果へのアクセスを提供する強力なWeb検索ツールです。通常のWeb検索、ニュース、場所、画像など、さまざまなタイプの検索をサポートし、各結果にはタイトル、URL、スニペット、タイプ固有の情報などの関連メタデータが含まれています。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 検索クエリ |
| `num` | number | いいえ | 返す結果の数 |
| `gl` | string | いいえ | 検索結果の国コード |
| `hl` | string | いいえ | 検索結果の言語コード |
| `type` | string | いいえ | 実行する検索のタイプ |
| `apiKey` | string | はい | Serper APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `searchResults` | array | タイトル、リンク、スニペット、およびタイプ固有のメタデータ（ニュースの日付、場所の評価、画像のimageUrl）を含む検索結果 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `serper`
```

--------------------------------------------------------------------------------

---[FILE: servicenow.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/servicenow.mdx

```text
---
title: ServiceNow
description: ServiceNowレコードの作成、読み取り、更新、削除
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="servicenow"
  color="#032D42"
/>

{/* MANUAL-CONTENT-START:intro */}
[ServiceNow](https://www.servicenow.com/)は、組織全体のITサービス管理（ITSM）、ワークフロー、ビジネスプロセスを効率化し自動化するために設計された強力なクラウドプラットフォームです。ServiceNowを使用すると、広範なAPIを使用してインシデント、リクエスト、タスク、ユーザーなどを管理できます。

ServiceNowでは、次のことができます。

- **ITワークフローの自動化**: インシデント、タスク、変更リクエスト、ユーザーなど、任意のServiceNowテーブルのレコードを作成、読み取り、更新、削除します。
- **システムの統合**: ServiceNowを他のツールやプロセスと接続して、シームレスな自動化を実現します。
- **単一の信頼できる情報源の維持**: すべてのサービスおよび運用データを整理してアクセス可能な状態に保ちます。
- **運用効率の向上**: カスタマイズ可能なワークフローと自動化により、手作業を削減し、サービス品質を向上させます。

Simでは、ServiceNow統合により、エージェントがワークフローの一部としてServiceNowインスタンスと直接やり取りできるようになります。エージェントは、任意のServiceNowテーブルのレコードを作成、読み取り、更新、削除でき、チケットやユーザーデータを活用して高度な自動化と意思決定を行うことができます。この統合により、ワークフロー自動化とIT運用が橋渡しされ、エージェントは手動介入なしでサービスリクエスト、インシデント、ユーザー、資産を管理できるようになります。SimとServiceNowを接続することで、サービス管理タスクを自動化し、応答時間を改善し、組織の重要なサービスデータへの一貫性のある安全なアクセスを確保できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

ServiceNowをワークフローに統合します。インシデント、タスク、変更リクエスト、ユーザーなど、任意のServiceNowテーブルのレコードを作成、読み取り、更新、削除します。

## ツール

### `servicenow_create_record`

ServiceNowテーブルに新しいレコードを作成

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | はい | ServiceNowインスタンスURL(例: https://instance.service-now.com) |
| `username` | string | はい | ServiceNowユーザー名 |
| `password` | string | はい | ServiceNowパスワード |
| `tableName` | string | はい | テーブル名(例: incident、task、sys_user) |
| `fields` | json | はい | レコードに設定するフィールド(JSONオブジェクト) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `record` | json | sys_idおよびその他のフィールドを含む作成されたServiceNowレコード |
| `metadata` | json | 操作メタデータ |

### `servicenow_read_record`

ServiceNowテーブルからレコードを読み取ります

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | はい | ServiceNowインスタンスURL(例: https://instance.service-now.com) |
| `username` | string | はい | ServiceNowユーザー名 |
| `password` | string | はい | ServiceNowパスワード |
| `tableName` | string | はい | テーブル名 |
| `sysId` | string | いいえ | 特定のレコードのsys_id |
| `number` | string | いいえ | レコード番号(例: INC0010001) |
| `query` | string | いいえ | エンコードされたクエリ文字列(例: "active=true^priority=1") |
| `limit` | number | いいえ | 返すレコードの最大数 |
| `fields` | string | いいえ | 返すフィールドのカンマ区切りリスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `records` | array | ServiceNowレコードの配列 |
| `metadata` | json | 操作メタデータ |

### `servicenow_update_record`

ServiceNowテーブル内の既存のレコードを更新

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | はい | ServiceNowインスタンスURL（例：https://instance.service-now.com） |
| `username` | string | はい | ServiceNowユーザー名 |
| `password` | string | はい | ServiceNowパスワード |
| `tableName` | string | はい | テーブル名 |
| `sysId` | string | はい | 更新するレコードのsys_id |
| `fields` | json | はい | 更新するフィールド（JSONオブジェクト） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `record` | json | 更新されたServiceNowレコード |
| `metadata` | json | 操作メタデータ |

### `servicenow_delete_record`

ServiceNowテーブルからレコードを削除

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `instanceUrl` | string | はい | ServiceNowインスタンスURL（例：https://instance.service-now.com） |
| `username` | string | はい | ServiceNowユーザー名 |
| `password` | string | はい | ServiceNowパスワード |
| `tableName` | string | はい | テーブル名 |
| `sysId` | string | はい | 削除するレコードのsys_id |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 削除が成功したかどうか |
| `metadata` | json | 操作メタデータ |

## 注意事項

- カテゴリ: `tools`
- タイプ: `servicenow`
```

--------------------------------------------------------------------------------

---[FILE: sftp.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/sftp.mdx

```text
---
title: SFTP
description: SFTP（SSH File Transfer Protocol）を介してファイルを転送
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sftp"
  color="#2D3748"
/>

{/* MANUAL-CONTENT-START:intro */}
[SFTP（SSH File Transfer Protocol）](https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol)は、リモートサーバー上でファイルのアップロード、ダウンロード、管理を可能にする安全なネットワークプロトコルです。SFTPはSSH上で動作し、現代のワークフロー内での自動化された暗号化ファイル転送とリモートファイル管理に最適です。

SimにSFTPツールを統合することで、AIエージェントと外部システムやサーバー間のファイル移動を簡単に自動化できます。これにより、エージェントは重要なデータ交換、バックアップ、ドキュメント生成、リモートシステムのオーケストレーションを堅牢なセキュリティで管理できるようになります。

**SFTPツールで利用可能な主要機能：**

- **ファイルのアップロード：** パスワードとSSH秘密鍵認証の両方をサポートし、ワークフローからリモートサーバーへあらゆるタイプのファイルをシームレスに転送。
- **ファイルのダウンロード：** リモートSFTPサーバーから直接ファイルを取得し、処理、アーカイブ、または更なる自動化を行う。
- **ファイルの一覧表示と管理：** ディレクトリの列挙、ファイルやフォルダの削除または作成、リモートでのファイルシステム権限の管理。
- **柔軟な認証：** 従来のパスワードまたはSSH鍵を使用して接続し、パスフレーズと権限制御をサポート。
- **大容量ファイルのサポート：** 安全性のための組み込みサイズ制限付きで、大容量ファイルのアップロードとダウンロードをプログラムで管理。

SimにSFTPを統合することで、データ収集、レポート作成、リモートシステムのメンテナンス、プラットフォーム間の動的コンテンツ交換など、あらゆるワークフローの一部として安全なファイル操作を自動化できます。

以下のセクションでは、利用可能な主要なSFTPツールについて説明します：

- **sftp_upload：** 1つまたは複数のファイルをリモートサーバーにアップロード。
- **sftp_download：** リモートサーバーからワークフローにファイルをダウンロード。
- **sftp_list：** リモートSFTPサーバー上のディレクトリ内容を一覧表示。
- **sftp_delete：** リモートサーバーからファイルまたはディレクトリを削除。
- **sftp_create：** リモートSFTPサーバー上に新しいファイルを作成。
- **sftp_mkdir：** リモートで新しいディレクトリを作成。

各操作の詳細な入力パラメータと出力パラメータについては、以下のツールドキュメントをご覧ください。
{/* MANUAL-CONTENT-END */}

## 使用方法

SFTPを介してリモートサーバーにファイルをアップロード、ダウンロード、一覧表示、管理できます。安全なファイル転送のためにパスワード認証と秘密鍵認証の両方をサポートしています。

## ツール

### `sftp_upload`

リモートSFTPサーバーにファイルをアップロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SFTPサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SFTPサーバーのポート（デフォルト：22） |
| `username` | string | はい | SFTPユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `remotePath` | string | はい | リモートサーバー上の宛先ディレクトリ |
| `files` | file[] | いいえ | アップロードするファイル |
| `fileContent` | string | いいえ | アップロードする直接ファイルコンテンツ（テキストファイル用） |
| `fileName` | string | いいえ | 直接コンテンツを使用する場合のファイル名 |
| `overwrite` | boolean | いいえ | 既存のファイルを上書きするかどうか（デフォルト：true） |
| `permissions` | string | いいえ | ファイルのパーミッション（例：0644） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | アップロードが成功したかどうか |
| `uploadedFiles` | json | アップロードされたファイルの詳細の配列（名前、リモートパス、サイズ） |
| `message` | string | 操作ステータスメッセージ |

### `sftp_download`

リモートSFTPサーバーからファイルをダウンロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SFTPサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SFTPサーバーのポート（デフォルト：22） |
| `username` | string | はい | SFTPユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `remotePath` | string | はい | リモートサーバー上のファイルパス |
| `encoding` | string | いいえ | 出力エンコーディング：テキストの場合はutf-8、バイナリの場合はbase64（デフォルト：utf-8） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | ダウンロードが成功したかどうか |
| `fileName` | string | ダウンロードしたファイルの名前 |
| `content` | string | ファイルの内容（テキストまたはbase64エンコード） |
| `size` | number | ファイルサイズ（バイト） |
| `encoding` | string | コンテンツエンコーディング（utf-8またはbase64） |
| `message` | string | 操作ステータスメッセージ |

### `sftp_list`

リモートSFTPサーバー上のファイルとディレクトリを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SFTPサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SFTPサーバーのポート（デフォルト：22） |
| `username` | string | はい | SFTPユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `remotePath` | string | はい | リモートサーバー上のディレクトリパス |
| `detailed` | boolean | いいえ | 詳細なファイル情報（サイズ、権限、更新日）を含める |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作が成功したかどうか |
| `path` | string | 一覧表示されたディレクトリパス |
| `entries` | json | 名前、タイプ、サイズ、権限、更新日時を含むディレクトリエントリの配列 |
| `count` | number | ディレクトリ内のエントリ数 |
| `message` | string | 操作のステータスメッセージ |

### `sftp_delete`

リモートSFTPサーバー上のファイルまたはディレクトリを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SFTPサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SFTPサーバーのポート（デフォルト：22） |
| `username` | string | はい | SFTPユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用の秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `remotePath` | string | はい | 削除するファイルまたはディレクトリのパス |
| `recursive` | boolean | いいえ | ディレクトリを再帰的に削除する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 削除が成功したかどうか |
| `deletedPath` | string | 削除されたパス |
| `message` | string | 操作のステータスメッセージ |

### `sftp_mkdir`

リモートSFTPサーバーにディレクトリを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | SFTPサーバーのホスト名またはIPアドレス |
| `port` | number | はい | SFTPサーバーのポート（デフォルト：22） |
| `username` | string | はい | SFTPユーザー名 |
| `password` | string | いいえ | 認証用パスワード（秘密鍵を使用しない場合） |
| `privateKey` | string | いいえ | 認証用秘密鍵（OpenSSH形式） |
| `passphrase` | string | いいえ | 暗号化された秘密鍵のパスフレーズ |
| `remotePath` | string | はい | 新しいディレクトリのパス |
| `recursive` | boolean | いいえ | 親ディレクトリが存在しない場合に作成する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | ディレクトリが正常に作成されたかどうか |
| `createdPath` | string | 作成されたディレクトリのパス |
| `message` | string | 操作のステータスメッセージ |

## 注意事項

- カテゴリ: `tools`
- タイプ: `sftp`
```

--------------------------------------------------------------------------------

---[FILE: sharepoint.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/sharepoint.mdx

```text
---
title: Sharepoint
description: ページとリストの操作
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="sharepoint"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[SharePoint](https://www.microsoft.com/en-us/microsoft-365/sharepoint/collaboration)はMicrosoftのコラボレーションプラットフォームで、ユーザーが社内ウェブサイトの構築・管理、文書の共有、チームリソースの整理を可能にします。組織全体でデジタルワークスペースを作成し、コンテンツ管理を効率化するための強力で柔軟なソリューションを提供します。

SharePointでは以下のことができます：

- **チームサイトとコミュニケーションサイトの作成**: コラボレーション、お知らせ、コンテンツ配信をサポートするページやポータルを設定
- **コンテンツの整理と共有**: 文書の保存、ファイル管理、安全な共有機能による版管理の実現
- **ページのカスタマイズ**: チームのニーズに合わせてテキストパーツを追加し、各サイトをカスタマイズ
- **検索性の向上**: メタデータ、検索機能、ナビゲーションツールを使用して、ユーザーが必要な情報を素早く見つけられるよう支援
- **安全なコラボレーション**: 堅牢な権限設定とMicrosoft 365との統合によるアクセス制御

Simでは、SharePoint統合によりエージェントがワークフローの一部としてSharePointサイトやページを作成・アクセスできるようになります。これにより、手動作業なしで文書管理、知識共有、ワークスペース作成の自動化が可能になります。エージェントはワークフローの入力に基づいて、新しいプロジェクトページの生成、ファイルのアップロードや取得、リソースの動的な整理ができます。SimとSharePointを連携させることで、構造化されたコラボレーションとコンテンツ管理を自動化フローに組み込み、エージェントがチーム活動の調整、重要情報の表示、組織全体での単一の情報源の維持を行う能力を提供します。
{/* MANUAL-CONTENT-END */}

## 使用方法

SharePointをワークフローに統合します。ページの読み取り/作成、サイトの一覧表示、リストの操作（読み取り、作成、アイテムの更新）が可能です。OAuthが必要です。

## ツール

### `sharepoint_create_page`

SharePointサイトに新しいページを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | いいえ | SharePointサイトのID（内部使用）|
| `siteSelector` | string | いいえ | SharePointサイトを選択 |
| `pageName` | string | はい | 作成するページの名前 |
| `pageTitle` | string | いいえ | ページのタイトル（提供されない場合はページ名がデフォルトになります）|
| `pageContent` | string | いいえ | ページの内容 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `page` | object | 作成されたSharePointページの情報 |

### `sharepoint_read_page`

SharePointサイトから特定のページを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | いいえ | SharePointサイトを選択 |
| `siteId` | string | いいえ | SharePointサイトのID（内部使用）|
| `pageId` | string | いいえ | 読み取るページのID |
| `pageName` | string | いいえ | 読み取るページの名前（pageIdの代替）|
| `maxPages` | number | いいえ | すべてのページを一覧表示する際に返す最大ページ数（デフォルト：10、最大：50）|

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `page` | object | SharePointページに関する情報 |

### `sharepoint_list_sites`

すべてのSharePointサイトの詳細を一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | いいえ | SharePointサイトを選択 |
| `groupId` | string | いいえ | グループチームサイトにアクセスするためのグループID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `site` | object | 現在のSharePointサイトに関する情報 |

### `sharepoint_create_list`

SharePointサイトに新しいリストを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | いいえ | SharePointサイトのID（内部使用） |
| `siteSelector` | string | いいえ | SharePointサイトを選択 |
| `listDisplayName` | string | はい | 作成するリストの表示名 |
| `listDescription` | string | いいえ | リストの説明 |
| `listTemplate` | string | いいえ | リストテンプレート名（例：'genericList'） |
| `pageContent` | string | いいえ | 列の定義を含むオプションのJSON。トップレベルの列定義の配列、または \{ columns: \[...\] \} を含むオブジェクト。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `list` | object | 作成されたSharePointリストの情報 |

### `sharepoint_get_list`

SharePointリストのメタデータ（およびオプションで列/アイテム）を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | いいえ | SharePointサイトを選択 |
| `siteId` | string | いいえ | SharePointサイトのID（内部使用） |
| `listId` | string | いいえ | 取得するリストのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `list` | object | SharePointリストに関する情報 |

### `sharepoint_update_list`

SharePointリストアイテムのプロパティ（フィールド）を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | いいえ | SharePointサイトを選択 |
| `siteId` | string | いいえ | SharePointサイトのID（内部使用） |
| `listId` | string | いいえ | アイテムを含むリストのID |
| `itemId` | string | はい | 更新するリストアイテムのID |
| `listItemFields` | object | はい | リストアイテムで更新するフィールド値 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `item` | object | 更新されたSharePointリストアイテム |

### `sharepoint_add_list_items`

SharePointリストに新しいアイテムを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteSelector` | string | いいえ | SharePointサイトを選択 |
| `siteId` | string | いいえ | SharePointサイトのID（内部使用） |
| `listId` | string | はい | アイテムを追加するリストのID |
| `listItemFields` | object | はい | 新しいリストアイテムのフィールド値 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `item` | object | 作成されたSharePointリストアイテム |

### `sharepoint_upload_file`

SharePointドキュメントライブラリにファイルをアップロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | いいえ | SharePointサイトのID |
| `driveId` | string | いいえ | ドキュメントライブラリ（ドライブ）のID。提供されない場合、デフォルトドライブを使用します。 |
| `folderPath` | string | いいえ | ドキュメントライブラリ内のオプションのフォルダパス（例：/Documents/Subfolder） |
| `fileName` | string | いいえ | オプション：アップロードされるファイル名を上書きする |
| `files` | file[] | いいえ | SharePointにアップロードするファイル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `uploadedFiles` | array | アップロードされたファイルオブジェクトの配列 |

## 注意事項

- カテゴリ: `tools`
- タイプ: `sharepoint`
```

--------------------------------------------------------------------------------

````
