---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 197
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 197 of 933)

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

---[FILE: calendly.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/calendly.mdx

```text
---
title: Calendly
description: Calendlyのスケジュール管理とイベント管理
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="calendly"
  color="#FFFFFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Calendly](https://calendly.com/)は、会議、イベント、予約を簡単に設定できる人気のスケジューリング自動化プラットフォームです。Calendlyを使用すると、チームや個人はスケジューリングを効率化し、メールのやり取りを減らし、イベント周りのタスクを自動化できます。

Sim Calendly統合により、エージェントは以下のことができます：

- **アカウントや予定されたイベントに関する情報を取得する**：ツールを使用してユーザー情報、イベントタイプ、予定されたイベントを分析や自動化のために取得します。
- **イベントタイプとスケジューリングを管理する**：ユーザーや組織の利用可能なイベントタイプにアクセスしてリスト化し、特定のイベントタイプの詳細を取得し、予定されている会議や招待者データを監視します。
- **フォローアップとワークフローを自動化する**：ユーザーが会議をスケジュール、再スケジュール、またはキャンセルした場合、Simエージェントは自動的に対応するワークフロー（リマインダーの送信、CRMの更新、参加者への通知など）をトリガーできます。
- **webhookを使用して簡単に統合する**：招待者がスケジュール、キャンセル、またはルーティングフォームとやり取りする場合など、リアルタイムのCalendly webhookイベントに応答するSimワークフローを設定します。

会議の準備を自動化したい場合でも、招待を管理したい場合でも、スケジューリングアクティビティに応じてカスタムワークフローを実行したい場合でも、SimのCalendlyツールは柔軟で安全なアクセスを提供します。スケジュール変更に即座に反応する新しい自動化を解放し、チームの運用とコミュニケーションを効率化します。
{/* MANUAL-CONTENT-END */}

## 使用方法

Calendlyをワークフローに統合します。イベントタイプ、予定されたイベント、招待者、webhookを管理します。Calendly webhookイベント（招待者がスケジュール、招待者がキャンセル、ルーティングフォームが送信された）に基づいてワークフローをトリガーすることもできます。個人アクセストークンが必要です。

## ツール

### `calendly_get_current_user`

現在認証されているCalendlyユーザーに関する情報を取得する

#### 入力

| パラメータ | タイプ | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Calendly個人アクセストークン |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `resource` | object | 現在のユーザー情報 |

### `calendly_list_event_types`

ユーザーまたは組織のすべてのイベントタイプのリストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Calendly個人アクセストークン |
| `user` | string | いいえ | このユーザーに属するイベントタイプのみを返す（URI形式） |
| `organization` | string | いいえ | この組織に属するイベントタイプのみを返す（URI形式） |
| `count` | number | いいえ | ページあたりの結果数（デフォルト：20、最大：100） |
| `pageToken` | string | いいえ | ページネーション用のページトークン |
| `sort` | string | いいえ | 結果のソート順（例：「name:asc」、「name:desc」） |
| `active` | boolean | いいえ | trueの場合、アクティブなイベントタイプのみを表示。falseまたはチェックされていない場合、すべてのイベントタイプ（アクティブと非アクティブの両方）を表示。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `collection` | array | イベントタイプオブジェクトの配列 |

### `calendly_get_event_type`

特定のイベントタイプに関する詳細情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Calendly個人アクセストークン |
| `eventTypeUuid` | string | はい | イベントタイプUUID（完全なURIまたはUUIDのみ） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `resource` | object | イベントタイプの詳細 |

### `calendly_list_scheduled_events`

ユーザーまたは組織の予定されたイベントのリストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Calendly個人アクセストークン |
| `user` | string | いいえ | このユーザーに属するイベントを返します（URI形式）。「ユーザー」または「組織」のいずれかを提供する必要があります。 |
| `organization` | string | いいえ | この組織に属するイベントを返します（URI形式）。「ユーザー」または「組織」のいずれかを提供する必要があります。 |
| `invitee_email` | string | いいえ | 招待者がこのメールアドレスを持つイベントを返します |
| `count` | number | いいえ | ページあたりの結果数（デフォルト：20、最大：100） |
| `max_start_time` | string | いいえ | この時間より前に開始時間があるイベントを返します（ISO 8601形式） |
| `min_start_time` | string | いいえ | この時間より後に開始時間があるイベントを返します（ISO 8601形式） |
| `pageToken` | string | いいえ | ページネーション用のページトークン |
| `sort` | string | いいえ | 結果の並べ替え順序（例："start_time:asc"、"start_time:desc"） |
| `status` | string | いいえ | ステータスでフィルタリング（"active"または"canceled"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `collection` | array | 予定されたイベントオブジェクトの配列 |

### `calendly_get_scheduled_event`

特定のスケジュールされたイベントに関する詳細情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Calendly個人アクセストークン |
| `eventUuid` | string | はい | スケジュールされたイベントUUID（完全なURIまたはUUIDのみ） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `resource` | object | スケジュールされたイベントの詳細 |

### `calendly_list_event_invitees`

スケジュールされたイベントの招待者リストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Calendly個人アクセストークン |
| `eventUuid` | string | はい | スケジュールされたイベントUUID（完全なURIまたはUUIDのみ） |
| `count` | number | いいえ | ページあたりの結果数（デフォルト：20、最大：100） |
| `email` | string | いいえ | メールアドレスで招待者をフィルタリング |
| `pageToken` | string | いいえ | ページネーション用のページトークン |
| `sort` | string | いいえ | 結果のソート順（例："created_at:asc"、"created_at:desc"） |
| `status` | string | いいえ | ステータスによるフィルタリング（"active"または"canceled"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `collection` | array | 招待者オブジェクトの配列 |

### `calendly_cancel_event`

スケジュールされたイベントをキャンセルする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Calendly個人アクセストークン |
| `eventUuid` | string | はい | キャンセルするスケジュールされたイベントのUUID（完全なURIまたはUUIDのみ） |
| `reason` | string | いいえ | キャンセルの理由（招待者に送信されます） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `resource` | object | キャンセルの詳細 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `calendly`
```

--------------------------------------------------------------------------------

---[FILE: clay.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/clay.mdx

```text
---
title: Clay
description: Populate Clay workbook
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="clay"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Clay](https://www.clay.com/) is a data enrichment and workflow automation platform that helps teams streamline lead generation, research, and data operations through powerful integrations and flexible inputs.

Learn how to use the Clay Tool in Sim to seamlessly insert data into a Clay workbook through webhook triggers. This tutorial walks you through setting up a webhook, configuring data mapping, and automating real-time updates to your Clay workbooks. Perfect for streamlining lead generation and data enrichment directly from your workflow!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cx_75X5sI_s"
  title="Clay Integration with Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

With Clay, you can:

- **Enrich agent outputs**: Automatically feed your Sim agent data into Clay tables for structured tracking and analysis
- **Trigger workflows via webhooks**: Use Clay’s webhook support to initiate Sim agent tasks from within Clay
- **Leverage data loops**: Seamlessly iterate over enriched data rows with agents that operate across dynamic datasets

In Sim, the Clay integration allows your agents to push structured data into Clay tables via webhooks. This makes it easy to collect, enrich, and manage dynamic outputs such as leads, research summaries, or action items—all in a collaborative, spreadsheet-like interface. Your agents can populate rows in real time, enabling asynchronous workflows where AI-generated insights are captured, reviewed, and used by your team. Whether you're automating research, enriching CRM data, or tracking operational outcomes, Clay becomes a living data layer that interacts intelligently with your agents. By connecting Sim with Clay, you gain a powerful way to operationalize agent results, loop over datasets with precision, and maintain a clean, auditable record of AI-driven work.
{/* MANUAL-CONTENT-END */}

## Usage Instructions

Integrate Clay into the workflow. Can populate a table with data.

## Tools

### `clay_populate`

Populate Clay with data from a JSON file. Enables direct communication and notifications with timestamp tracking and channel confirmation.

#### Input

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `webhookURL` | string | はい | 設定するウェブフックURL |
| `data` | json | はい | 設定するデータ |
| `authToken` | string | いいえ | Clayウェブフック認証用のオプション認証トークン（ほとんどのウェブフックではこれは不要です） |

#### Output

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `data` | json | Clayウェブフックからのレスポンスデータ |
| `metadata` | object | ウェブフックレスポンスのメタデータ |

## Notes

- Category: `tools`
- Type: `clay`
```

--------------------------------------------------------------------------------

---[FILE: confluence.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/confluence.mdx

```text
---
title: Confluence
description: Confluenceとの連携
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="confluence"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Confluence](https://www.atlassian.com/software/confluence)はAtlassianの強力なチームコラボレーションおよびナレッジマネジメントプラットフォームです。部門や組織全体で情報を作成、整理、共有するための集中型ワークスペースとして機能します。

Confluenceでは以下のことが可能です：

- **構造化されたドキュメントの作成**: リッチフォーマットを使用した包括的なウィキ、プロジェクト計画、ナレッジベースの構築
- **リアルタイムでのコラボレーション**: コメント、メンション、編集機能を使用してチームメイトとドキュメント上で共同作業
- **階層的な情報整理**: 直感的なナビゲーションのためのスペース、ページ、ネストされた階層によるコンテンツの構造化
- **他のツールとの統合**: シームレスなワークフロー統合のためのJira、Trelloなどの他のAtlassian製品との連携
- **アクセス権限の管理**: 特定のコンテンツを閲覧、編集、コメントできるユーザーの管理

Simでは、Confluence統合により、エージェントが組織のナレッジベースにアクセスして活用することができます。エージェントはConfluenceページから情報を取得し、特定のコンテンツを検索し、必要に応じてドキュメントを更新することもできます。これにより、ワークフローに社内ドキュメントを参照し、確立された手順に従い、最新の情報リソースを維持するエージェントを構築することが可能になります。
{/* MANUAL-CONTENT-END */}

## 使用手順

Confluenceをワークフローに統合します。ページの読み取り、作成、更新、削除、コメント管理、添付ファイル管理、ラベル管理、コンテンツ検索が可能です。

## ツール

### `confluence_retrieve`

Confluence APIを使用してConfluenceページからコンテンツを取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `pageId` | string | はい | 取得するConfluenceページID |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 取得のタイムスタンプ |
| `pageId` | string | ConfluenceページID |
| `content` | string | HTMLタグが削除されたページコンテンツ |
| `title` | string | ページタイトル |

### `confluence_update`

Confluence APIを使用してConfluenceページを更新します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `pageId` | string | はい | 更新するConfluenceページID |
| `title` | string | いいえ | ページの新しいタイトル |
| `content` | string | いいえ | Confluenceストレージ形式での新しいページコンテンツ |
| `version` | number | いいえ | ページのバージョン番号（競合防止のために必要） |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 更新のタイムスタンプ |
| `pageId` | string | Confluenceページ ID |
| `title` | string | 更新されたページタイトル |
| `success` | boolean | 更新操作の成功ステータス |

### `confluence_create_page`

Confluenceスペースに新しいページを作成します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `spaceId` | string | はい | ページが作成されるConfluenceスペースID |
| `title` | string | はい | 新しいページのタイトル |
| `content` | string | はい | Confluenceストレージ形式（HTML）のページコンテンツ |
| `parentId` | string | いいえ | 子ページを作成する場合の親ページID |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 作成のタイムスタンプ |
| `pageId` | string | 作成されたページID |
| `title` | string | ページタイトル |
| `url` | string | ページURL |

### `confluence_delete_page`

Confluenceページを削除します（復元可能なゴミ箱に移動します）。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `pageId` | string | はい | 削除するConfluenceページID |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 削除のタイムスタンプ |
| `pageId` | string | 削除されたページID |
| `deleted` | boolean | 削除ステータス |

### `confluence_search`

Confluenceのページ、ブログ投稿、その他のコンテンツ全体を検索します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `query` | string | はい | 検索クエリ文字列 |
| `limit` | number | いいえ | 返す結果の最大数（デフォルト：25） |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 検索のタイムスタンプ |
| `results` | array | 検索結果 |

### `confluence_create_comment`

Confluenceページにコメントを追加します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `pageId` | string | はい | コメントするConfluenceページID |
| `comment` | string | はい | Confluenceストレージ形式でのコメントテキスト |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 作成のタイムスタンプ |
| `commentId` | string | 作成されたコメントID |
| `pageId` | string | ページID |

### `confluence_list_comments`

Confluenceページのすべてのコメントを一覧表示します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `pageId` | string | はい | コメントを一覧表示するConfluenceページID |
| `limit` | number | いいえ | 返すコメントの最大数（デフォルト：25） |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 取得のタイムスタンプ |
| `comments` | array | コメントのリスト |

### `confluence_update_comment`

Confluenceページの既存のコメントを更新します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `commentId` | string | はい | 更新するConfluenceコメントID |
| `comment` | string | はい | Confluenceストレージ形式での更新されたコメントテキスト |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 更新のタイムスタンプ |
| `commentId` | string | 更新されたコメントID |
| `updated` | boolean | 更新ステータス |

### `confluence_delete_comment`

Confluenceページからコメントを削除します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `commentId` | string | はい | 削除するConfluenceコメントID |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 削除のタイムスタンプ |
| `commentId` | string | 削除されたコメントID |
| `deleted` | boolean | 削除ステータス |

### `confluence_upload_attachment`

ファイルをConfluenceページに添付ファイルとしてアップロードします。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `pageId` | string | はい | ファイルを添付するConfluenceページID |
| `file` | file | はい | 添付ファイルとしてアップロードするファイル |
| `fileName` | string | いいえ | 添付ファイルのオプションのカスタムファイル名 |
| `comment` | string | いいえ | 添付ファイルに追加するオプションのコメント |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | アップロードのタイムスタンプ |
| `attachmentId` | string | アップロードされた添付ファイルID |
| `title` | string | 添付ファイル名 |
| `fileSize` | number | ファイルサイズ（バイト単位） |
| `mediaType` | string | 添付ファイルのMIMEタイプ |
| `downloadUrl` | string | 添付ファイルのダウンロードURL |
| `pageId` | string | 添付ファイルが追加されたページID |

### `confluence_list_attachments`

Confluenceページのすべての添付ファイルを一覧表示します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `pageId` | string | はい | 添付ファイルを一覧表示するConfluenceページID |
| `limit` | number | いいえ | 返す添付ファイルの最大数（デフォルト：25） |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 取得のタイムスタンプ |
| `attachments` | array | 添付ファイルのリスト |

### `confluence_delete_attachment`

Confluenceページから添付ファイルを削除します（ゴミ箱に移動します）。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `attachmentId` | string | はい | 削除するConfluence添付ファイルID |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 削除のタイムスタンプ |
| `attachmentId` | string | 削除された添付ファイルID |
| `deleted` | boolean | 削除ステータス |

### `confluence_list_labels`

Confluenceページのすべてのラベルを一覧表示します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `pageId` | string | はい | ラベルを一覧表示するConfluenceページID |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 取得のタイムスタンプ |
| `labels` | array | ラベルのリスト |

### `confluence_get_space`

特定のConfluenceスペースに関する詳細を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `spaceId` | string | はい | 取得するConfluenceスペースID |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 取得のタイムスタンプ |
| `spaceId` | string | スペースID |
| `name` | string | スペース名 |
| `key` | string | スペースキー |
| `type` | string | スペースタイプ |
| `status` | string | スペースステータス |
| `url` | string | スペースURL |

### `confluence_list_spaces`

ユーザーがアクセスできるすべてのConfluenceスペースを一覧表示します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのConfluenceドメイン（例：yourcompany.atlassian.net） |
| `limit` | number | いいえ | 返すスペースの最大数（デフォルト：25） |
| `cloudId` | string | いいえ | インスタンスのConfluence Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 取得のタイムスタンプ |
| `spaces` | array | スペースのリスト |

## 注意事項

- カテゴリー: `tools`
- タイプ: `confluence`
```

--------------------------------------------------------------------------------

---[FILE: cursor.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/cursor.mdx

```text
---
title: Cursor
description: GitHubリポジトリで作業するためのCursorクラウドエージェントを起動および管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="cursor"
  color="#1E1E1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Cursor](https://www.cursor.so/)はAI IDEおよびクラウドベースのプラットフォームで、GitHubリポジトリで直接作業できる強力なAIエージェントを起動・管理することができます。Cursorエージェントは開発タスクを自動化し、チームの生産性を向上させ、コード変更の実施、自然言語指示への応答、活動に関する会話履歴の維持によってあなたと協力します。

Cursorでは以下のことができます：

- **コードベース用のクラウドエージェントを起動**: クラウド上であなたのリポジトリで作業する新しいAIエージェントを即座に作成
- **自然言語を使用してコーディングタスクを委任**: 書面による指示、修正、説明でエージェントを導く
- **進捗と出力を監視**: エージェントのステータスを取得し、詳細な結果を表示し、現在または完了したタスクを検査
- **完全な会話履歴にアクセス**: 透明性と監査可能性のためにすべてのプロンプトとAI応答をレビュー
- **エージェントのライフサイクルを制御・管理**: アクティブなエージェントをリスト表示し、エージェントを終了し、APIベースのエージェント起動とフォローアップを管理

Simでは、Cursor統合によりエージェントとワークフローがCursorクラウドエージェントとプログラム的に対話できるようになります。つまり、Simを使用して以下のことができます：

- すべてのクラウドエージェントをリスト表示し、現在の状態を閲覧 (`cursor_list_agents`)
- 任意のエージェントの最新ステータスと出力を取得 (`cursor_get_agent`)
- 任意のコーディングエージェントの完全な会話履歴を表示 (`cursor_get_conversation`)
- 実行中のエージェントにフォローアップ指示や新しいプロンプトを追加
- 必要に応じてエージェントを管理・終了

この統合により、Simエージェントの柔軟なインテリジェンスとCursorの強力な開発自動化機能を組み合わせることができ、プロジェクト全体でAI駆動の開発をスケールすることが可能になります。
{/* MANUAL-CONTENT-END */}

## 使用方法

Cursor Cloud Agents APIを使用して、GitHubリポジトリで作業できるAIエージェントを起動します。エージェントの起動、フォローアップ指示の追加、ステータスの確認、会話の表示、およびエージェントのライフサイクル管理をサポートしています。

## ツール

### `cursor_list_agents`

認証されたユーザーのすべてのクラウドエージェントをオプションのページネーションで一覧表示します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Cursor APIキー |
| `limit` | number | いいえ | 返すエージェントの数（デフォルト：20、最大：100） |
| `cursor` | string | いいえ | 前の応答からのページネーションカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 人間が読めるエージェントのリスト |
| `metadata` | object | エージェントリストのメタデータ |

### `cursor_get_agent`

クラウドエージェントの現在のステータスと結果を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Cursor APIキー |
| `agentId` | string | はい | クラウドエージェントの一意の識別子（例：bc_abc123） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 人間が読めるエージェントの詳細 |
| `metadata` | object | エージェントのメタデータ |

### `cursor_get_conversation`

クラウドエージェントの会話履歴（すべてのユーザープロンプトとアシスタントの応答を含む）を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Cursor APIキー |
| `agentId` | string | はい | クラウドエージェントの一意の識別子（例：bc_abc123） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 人間が読める会話履歴 |
| `metadata` | object | 会話のメタデータ |

### `cursor_launch_agent`

指定された指示でGitHubリポジトリに取り組む新しいクラウドエージェントを開始します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Cursor APIキー |
| `repository` | string | はい | GitHubリポジトリURL（例：https://github.com/your-org/your-repo） |
| `ref` | string | いいえ | 作業するブランチ、タグ、またはコミット（デフォルトはデフォルトブランチ） |
| `promptText` | string | はい | エージェントへの指示テキスト |
| `promptImages` | string | いいえ | base64データと寸法を持つ画像オブジェクトのJSON配列 |
| `model` | string | いいえ | 使用するモデル（自動選択の場合は空のままにする） |
| `branchName` | string | いいえ | エージェントが使用するカスタムブランチ名 |
| `autoCreatePr` | boolean | いいえ | エージェントが終了したときに自動的にPRを作成する |
| `openAsCursorGithubApp` | boolean | いいえ | Cursor GitHub AppとしてPRを開く |
| `skipReviewerRequest` | boolean | いいえ | PRでのレビュアーのリクエストをスキップする |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | エージェントの詳細を含む成功メッセージ |
| `metadata` | object | 起動結果のメタデータ |

### `cursor_add_followup`

既存のクラウドエージェントにフォローアップ指示を追加します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Cursor APIキー |
| `agentId` | string | はい | クラウドエージェントの一意の識別子（例：bc_abc123） |
| `followupPromptText` | string | はい | エージェントへのフォローアップ指示テキスト |
| `promptImages` | string | いいえ | base64データと寸法を持つ画像オブジェクトのJSON配列（最大5つ） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | 結果メタデータ |

### `cursor_stop_agent`

実行中のクラウドエージェントを停止します。これはエージェントを削除せずに一時停止します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Cursor APIキー |
| `agentId` | string | はい | クラウドエージェントの一意の識別子（例：bc_abc123） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | 結果メタデータ |

### `cursor_delete_agent`

クラウドエージェントを完全に削除します。この操作は元に戻せません。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Cursor APIキー |
| `agentId` | string | はい | クラウドエージェントの一意の識別子（例：bc_abc123） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 成功メッセージ |
| `metadata` | object | 結果メタデータ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `cursor`
```

--------------------------------------------------------------------------------

---[FILE: datadog.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/datadog.mdx

```text
---
title: Datadog
description: Datadogでインフラストラクチャ、アプリケーション、ログを監視
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="datadog"
  color="#632CA6"
/>

{/* MANUAL-CONTENT-START:intro */}
[Datadog](https://datadoghq.com/)は、インフラストラクチャ、アプリケーション、ログなどを包括的に監視・分析するプラットフォームです。組織がシステムの健全性とパフォーマンスをリアルタイムで可視化し、異常を検出し、インシデント対応を自動化することを可能にします。

Datadogでは以下のことができます：

- **メトリクスの監視**: サーバー、クラウドサービス、カスタムアプリケーションからメトリクスを収集、視覚化、分析。
- **時系列データのクエリ**: トレンド分析とレポート作成のためにパフォーマンスメトリクスに対して高度なクエリを実行。
- **モニターとイベントの管理**: 問題を検出し、アラートをトリガーし、可観測性のためのイベントを作成するモニターを設定。
- **ダウンタイムの処理**: メンテナンス中にアラートを抑制するための計画的なダウンタイムをスケジュールし、プログラムで管理。
- **ログとトレースの分析** *(Datadogで追加設定が必要)*: より深いトラブルシューティングのためにログや分散トレースを一元化して検査。

SimのDatadog統合により、エージェントはこれらの操作を自動化し、Datadogアカウントとプログラム的に対話することができます。カスタムメトリクスの送信、時系列データのクエリ、モニターの管理、イベントの作成、Sim自動化内で直接監視ワークフローを効率化するために使用できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

ワークフローにDatadog監視を統合します。メトリクスの送信、モニターの管理、ログのクエリ、イベントの作成、ダウンタイムの処理などが可能です。

## ツール

### `datadog_submit_metrics`

カスタムメトリクスをDatadogに送信します。アプリケーションのパフォーマンス、ビジネスメトリクス、またはカスタム監視データの追跡に使用します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `series` | string | はい | 送信するメトリクスシリーズのJSON配列。各シリーズにはメトリクス名、タイプ\(gauge/rate/count\)、ポイント\(タイムスタンプ/値のペア\)、およびオプションのタグを含める必要があります。 |
| `apiKey` | string | はい | Datadog APIキー |
| `site` | string | いいえ | Datadogサイト/リージョン\(デフォルト: datadoghq.com\) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メトリクスが正常に送信されたかどうか |
| `errors` | array | 送信中に発生したエラー |

### `datadog_query_timeseries`

Datadogからメトリクスの時系列データをクエリします。トレンド分析、レポート作成、またはメトリクス値の取得に使用します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | Datadogメトリクスクエリ（例："avg:system.cpu.user\{*\}"） |
| `from` | number | はい | 開始時間（Unix秒タイムスタンプ） |
| `to` | number | はい | 終了時間（Unix秒タイムスタンプ） |
| `apiKey` | string | はい | Datadog APIキー |
| `applicationKey` | string | はい | Datadog アプリケーションキー |
| `site` | string | いいえ | Datadogサイト/リージョン（デフォルト: datadoghq.com） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `series` | array | メトリクス名、タグ、データポイントを含む時系列データの配列 |
| `status` | string | クエリステータス |

### `datadog_create_event`

Datadogイベントストリームにイベントを投稿します。デプロイ通知、アラート、または重要な出来事に使用します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `title` | string | はい | イベントタイトル |
| `text` | string | はい | イベント本文/説明。マークダウンをサポート。 |
| `alertType` | string | いいえ | アラートタイプ: error、warning、info、success、user_update、recommendation、またはsnapshot |
| `priority` | string | いいえ | イベント優先度: normalまたはlow |
| `host` | string | いいえ | このイベントに関連付けるホスト名 |
| `tags` | string | いいえ | カンマ区切りのタグリスト（例："env:production,service:api"） |
| `aggregationKey` | string | いいえ | イベントをまとめるためのキー |
| `sourceTypeName` | string | いいえ | イベントのソースタイプ名 |
| `dateHappened` | number | いいえ | イベントが発生したUnixタイムスタンプ（デフォルトは現在時刻） |
| `apiKey` | string | はい | Datadog APIキー |
| `site` | string | いいえ | Datadogサイト/リージョン（デフォルト: datadoghq.com） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `event` | object | 作成されたイベントの詳細 |

### `datadog_create_monitor`

Datadogで新しいモニター/アラートを作成します。モニターはメトリクス、サービスチェック、イベントなどを追跡できます。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `name` | string | はい | モニター名 |
| `type` | string | はい | モニタータイプ: metric alert、service check、event alert、process alert、log alert、query alert、composite、synthetics alert、slo alert |
| `query` | string | はい | モニタークエリ（例："avg\(last_5m\):avg:system.cpu.idle\{*\} &lt; 20"） |
| `message` | string | いいえ | 通知に含めるメッセージ。@メンションやマークダウンを含めることができます。 |
| `tags` | string | いいえ | カンマ区切りのタグリスト |
| `priority` | number | いいえ | モニターの優先度（1-5、1が最高）|
| `options` | string | いいえ | モニターオプションのJSON文字列（しきい値、notify_no_data、renotify_intervalなど） |
| `apiKey` | string | はい | Datadog APIキー |
| `applicationKey` | string | はい | Datadog アプリケーションキー |
| `site` | string | いいえ | Datadogサイト/リージョン（デフォルト: datadoghq.com） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `monitor` | object | 作成されたモニターの詳細 |

### `datadog_get_monitor`

IDで特定のモニターの詳細を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `monitorId` | string | はい | 取得するモニターのID |
| `groupStates` | string | いいえ | 含めるグループ状態のカンマ区切りリスト: alert、warn、no data、ok |
| `withDowntimes` | boolean | いいえ | モニターとともにダウンタイムデータを含める |
| `apiKey` | string | はい | Datadog APIキー |
| `applicationKey` | string | はい | Datadog アプリケーションキー |
| `site` | string | いいえ | Datadogサイト/リージョン（デフォルト: datadoghq.com） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `monitor` | object | モニターの詳細 |

### `datadog_list_monitors`

Datadogのすべてのモニターを、名前、タグ、または状態によるオプションのフィルタリングと共に一覧表示します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `groupStates` | string | いいえ | フィルタリングするグループ状態のカンマ区切りリスト: alert, warn, no data, ok |
| `name` | string | いいえ | 名前でモニターをフィルタリング（部分一致） |
| `tags` | string | いいえ | フィルタリングするタグのカンマ区切りリスト |
| `monitorTags` | string | いいえ | フィルタリングするモニタータグのカンマ区切りリスト |
| `withDowntimes` | boolean | いいえ | モニターとともにダウンタイムデータを含める |
| `page` | number | いいえ | ページネーションのページ番号（0から始まる） |
| `pageSize` | number | いいえ | 1ページあたりのモニター数（最大1000） |
| `apiKey` | string | はい | Datadog APIキー |
| `applicationKey` | string | はい | Datadog アプリケーションキー |
| `site` | string | いいえ | Datadogサイト/リージョン（デフォルト: datadoghq.com） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `monitors` | array | モニターのリスト |

### `datadog_mute_monitor`

通知を一時的に抑制するためにモニターをミュートします。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `monitorId` | string | はい | ミュートするモニターのID |
| `scope` | string | いいえ | ミュートするスコープ（例: "host:myhost"）。指定しない場合、すべてのスコープをミュートします。 |
| `end` | number | いいえ | ミュートを終了するUnixタイムスタンプ。指定しない場合、無期限にミュートします。 |
| `apiKey` | string | はい | Datadog APIキー |
| `applicationKey` | string | はい | Datadog アプリケーションキー |
| `site` | string | いいえ | Datadogサイト/リージョン（デフォルト: datadoghq.com） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | モニターが正常にミュートされたかどうか |

### `datadog_query_logs`

Datadogからログを検索して取得します。トラブルシューティング、分析、またはモニタリングに使用します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | ログ検索クエリ（例："service:web-app status:error"） |
| `from` | string | はい | ISO-8601形式または相対形式の開始時間（例："now-1h"） |
| `to` | string | はい | ISO-8601形式または相対形式の終了時間（例："now"） |
| `limit` | number | いいえ | 返すログの最大数（デフォルト：50、最大：1000） |
| `sort` | string | いいえ | ソート順：timestamp（古い順）または-timestamp（新しい順） |
| `indexes` | string | いいえ | 検索するログインデックスのカンマ区切りリスト |
| `apiKey` | string | はい | Datadog APIキー |
| `applicationKey` | string | はい | Datadog アプリケーションキー |
| `site` | string | いいえ | Datadogサイト/リージョン（デフォルト：datadoghq.com） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `logs` | array | ログエントリのリスト |

### `datadog_send_logs`

集中ログ記録と分析のために、ログエントリをDatadogに送信します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `logs` | string | はい | ログエントリのJSON配列。各エントリにはmessageが必要で、オプションでddsource、ddtags、hostname、serviceを含めることができます。 |
| `apiKey` | string | はい | Datadog APIキー |
| `site` | string | いいえ | Datadogサイト/リージョン（デフォルト：datadoghq.com） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | ログが正常に送信されたかどうか |

### `datadog_create_downtime`

メンテナンス期間中にモニター通知を抑制するためのダウンタイムをスケジュールします。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `scope` | string | はい | ダウンタイムを適用する範囲（例："host:myhost"、"env:production"、または全てに対して"*"） |
| `message` | string | いいえ | ダウンタイム中に表示するメッセージ |
| `start` | number | いいえ | ダウンタイム開始のUnixタイムスタンプ（デフォルトは現在時刻） |
| `end` | number | いいえ | ダウンタイム終了のUnixタイムスタンプ |
| `timezone` | string | いいえ | ダウンタイムのタイムゾーン（例："America/New_York"） |
| `monitorId` | string | いいえ | ミュートする特定のモニターID |
| `monitorTags` | string | いいえ | 一致させるモニタータグ（カンマ区切り、例："team:backend,priority:high"） |
| `muteFirstRecoveryNotification` | boolean | いいえ | 最初の復旧通知をミュートする |
| `apiKey` | string | はい | Datadog APIキー |
| `applicationKey` | string | はい | Datadog アプリケーションキー |
| `site` | string | いいえ | Datadogサイト/リージョン（デフォルト: datadoghq.com） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `downtime` | object | 作成されたダウンタイムの詳細 |

### `datadog_list_downtimes`

Datadogでスケジュールされたすべてのダウンタイムを一覧表示します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `currentOnly` | boolean | いいえ | 現在アクティブなダウンタイムのみを返す |
| `monitorId` | string | いいえ | モニターIDでフィルタリング |
| `apiKey` | string | はい | Datadog APIキー |
| `applicationKey` | string | はい | Datadog アプリケーションキー |
| `site` | string | いいえ | Datadogサイト/リージョン（デフォルト: datadoghq.com） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `downtimes` | array | ダウンタイムのリスト |

### `datadog_cancel_downtime`

スケジュールされたダウンタイムをキャンセルします。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `downtimeId` | string | はい | キャンセルするダウンタイムのID |
| `apiKey` | string | はい | Datadog APIキー |
| `applicationKey` | string | はい | Datadog アプリケーションキー |
| `site` | string | いいえ | Datadogサイト/リージョン \(デフォルト: datadoghq.com\) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | ダウンタイムが正常にキャンセルされたかどうか |

## 注意事項

- カテゴリー: `tools`
- タイプ: `datadog`
```

--------------------------------------------------------------------------------

````
