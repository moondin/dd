---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 219
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 219 of 933)

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

---[FILE: zendesk.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/zendesk.mdx

```text
---
title: Zendesk
description: Zendeskでサポートチケット、ユーザー、組織を管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zendesk"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Zendesk](https://www.zendesk.com/)は、強力なツールとAPIを通じて組織がサポートチケット、ユーザー、組織を効率的に管理できるようにする、主要なカスタマーサービスおよびサポートプラットフォームです。SimにおけるZendesk統合により、エージェントは主要なサポート操作を自動化し、サポートデータをワークフローの残りの部分と同期させることができます。

SimでZendeskを使用すると、以下のことが可能です：

- **チケット管理：**
  - 高度なフィルタリングと並べ替えによるサポートチケットのリスト取得。
  - 追跡と解決のための単一チケットの詳細情報の取得。
  - 顧客の問題をプログラムで記録するための新規チケットの個別または一括作成。
  - 複雑なワークフローを効率化するためのチケットの更新または一括更新の適用。
  - ケースが解決されたり重複が発生したりした場合のチケットの削除または統合。

- **ユーザー管理：**
  - 顧客とエージェントのディレクトリを最新の状態に保つための、条件によるユーザーリストの取得またはユーザー検索。
  - 個々のユーザーまたは現在ログインしているユーザーに関する詳細情報の取得。
  - 顧客とエージェントのプロビジョニングを自動化する新規ユーザーの作成または一括オンボーディング。
  - 情報の正確性を確保するためのユーザー詳細の更新または一括更新。
  - プライバシーまたはアカウント管理のために必要に応じたユーザーの削除。

- **組織管理：**
  - 合理化されたサポートとアカウント管理のための組織のリスト表示、検索、オートコンプリート。
  - 組織の詳細を取得し、データベースを整理。
  - 顧客基盤の変化を反映するための組織の作成、更新、または削除。
  - 大規模なオンボーディング作業のための組織の一括作成。

- **高度な検索と分析：**
  - 多目的な検索エンドポイントを使用して、任意のフィールドからチケット、ユーザー、または組織をすばやく見つけることができます。
  - 検索結果の数を取得してレポートや分析に活用できます。

Zendeskのシム統合を活用することで、自動化されたワークフローがサポートチケットの振り分け、ユーザーのオンボーディング/オフボーディング、企業管理をシームレスに処理し、サポート業務をスムーズに運営できます。製品、CRM、または自動化システムとサポートを統合する場合でも、シムのZendeskツールは、大規模な一流のサポートを提供するための堅牢なプログラム制御を提供します。
{/* MANUAL-CONTENT-END */}

## 使用手順

Zendeskをワークフローに統合します。チケットの取得、チケットの取得、チケットの作成、チケットの一括作成、チケットの更新、チケットの一括更新、チケットの削除、チケットの統合、ユーザーの取得、ユーザーの取得、現在のユーザーの取得、ユーザーの検索、ユーザーの作成、ユーザーの一括作成、ユーザーの更新、ユーザーの一括更新、ユーザーの削除、組織の取得、組織の取得、組織のオートコンプリート、組織の作成、組織の一括作成、組織の更新、組織の削除、検索、検索数の取得が可能です。

## ツール

### `zendesk_get_tickets`

オプションのフィルタリングを使用してZendeskからチケットのリストを取得する

#### 入力

| パラメータ | タイプ | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン（例：「mycompany」（mycompany.zendesk.com用）） |
| `status` | string | いいえ | ステータスでフィルタリング（new, open, pending, hold, solved, closed） |
| `priority` | string | いいえ | 優先度でフィルタリング（low, normal, high, urgent） |
| `type` | string | いいえ | タイプでフィルタリング（problem, incident, question, task） |
| `assigneeId` | string | いいえ | 担当者ユーザーIDでフィルタリング |
| `organizationId` | string | いいえ | 組織IDでフィルタリング |
| `sortBy` | string | いいえ | ソートフィールド（created_at, updated_at, priority, status） |
| `sortOrder` | string | いいえ | ソート順（asc または desc） |
| `perPage` | string | いいえ | ページあたりの結果数（デフォルト：100、最大：100） |
| `page` | string | いいえ | ページ番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `tickets` | array | チケットオブジェクトの配列 |
| `paging` | object | ページネーション情報 |
| `metadata` | object | 操作メタデータ |

### `zendesk_get_ticket`

IDによってZendeskから単一のチケットを取得

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `ticketId` | string | はい | 取得するチケットID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ticket` | object | チケットオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_create_ticket`

カスタムフィールドをサポートするZendeskに新しいチケットを作成

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `subject` | string | いいえ | チケットの件名（任意 - 提供されない場合は自動生成されます） |
| `description` | string | はい | チケットの説明（最初のコメント） |
| `priority` | string | いいえ | 優先度（low、normal、high、urgent） |
| `status` | string | いいえ | ステータス（new、open、pending、hold、solved、closed） |
| `type` | string | いいえ | タイプ（problem、incident、question、task） |
| `tags` | string | いいえ | カンマ区切りのタグ |
| `assigneeId` | string | いいえ | 担当者ユーザーID |
| `groupId` | string | いいえ | グループID |
| `requesterId` | string | いいえ | 要求者ユーザーID |
| `customFields` | string | いいえ | JSONオブジェクトとしてのカスタムフィールド（例：\{"field_id": "value"\}） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ticket` | object | 作成されたチケットオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_create_tickets_bulk`

Zendeskで一度に複数のチケットを作成（最大100件）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `tickets` | string | はい | 作成するチケットオブジェクトのJSON配列（最大100件）。各チケットにはsubjectとcommentプロパティが必要です。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `jobStatus` | object | ジョブステータスオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_update_ticket`

カスタムフィールドをサポートしたZendeskの既存チケットの更新

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `ticketId` | string | はい | 更新するチケットID |
| `subject` | string | いいえ | 新しいチケットの件名 |
| `comment` | string | いいえ | チケットにコメントを追加 |
| `priority` | string | いいえ | 優先度（low、normal、high、urgent） |
| `status` | string | いいえ | ステータス（new、open、pending、hold、solved、closed） |
| `type` | string | いいえ | タイプ（problem、incident、question、task） |
| `tags` | string | いいえ | カンマ区切りのタグ |
| `assigneeId` | string | いいえ | 担当者ユーザーID |
| `groupId` | string | いいえ | グループID |
| `customFields` | string | いいえ | JSONオブジェクトとしてのカスタムフィールド |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ticket` | object | 更新されたチケットオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_update_tickets_bulk`

Zendeskで複数のチケットを一度に更新（最大100件）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | ZendeskのEメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | Zendeskのサブドメイン |
| `ticketIds` | string | はい | 更新するチケットIDをカンマ区切りで指定（最大100件） |
| `status` | string | いいえ | すべてのチケットの新しいステータス |
| `priority` | string | いいえ | すべてのチケットの新しい優先度 |
| `assigneeId` | string | いいえ | すべてのチケットの新しい担当者ID |
| `groupId` | string | いいえ | すべてのチケットの新しいグループID |
| `tags` | string | いいえ | すべてのチケットに追加するタグ（カンマ区切り） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `jobStatus` | object | ジョブステータスオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_delete_ticket`

Zendeskからチケットを削除

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | ZendeskのEメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | Zendeskのサブドメイン |
| `ticketId` | string | はい | 削除するチケットID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 削除成功 |
| `metadata` | object | 操作メタデータ |

### `zendesk_merge_tickets`

複数のチケットをターゲットチケットに統合する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `targetTicketId` | string | はい | ターゲットチケットID（チケットはこれに統合されます） |
| `sourceTicketIds` | string | はい | 統合するソースチケットIDのカンマ区切りリスト |
| `targetComment` | string | いいえ | 統合後にターゲットチケットに追加するコメント |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `jobStatus` | object | ジョブステータスオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_get_users`

オプションのフィルタリングを使用してZendeskからユーザーリストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン（例：「mycompany」はmycompany.zendesk.com用） |
| `role` | string | いいえ | ロールでフィルタリング（end-user、agent、admin） |
| `permissionSet` | string | いいえ | 権限セットIDでフィルタリング |
| `perPage` | string | いいえ | ページあたりの結果数（デフォルト：100、最大：100） |
| `page` | string | いいえ | ページ番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `users` | array | ユーザーオブジェクトの配列 |
| `paging` | object | ページネーション情報 |
| `metadata` | object | 操作メタデータ |

### `zendesk_get_user`

ZendeskからIDで単一のユーザーを取得

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `userId` | string | はい | 取得するユーザーID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `user` | object | ユーザーオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_get_current_user`

Zendeskから現在認証されているユーザーを取得

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `user` | object | 現在のユーザーオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_search_users`

クエリ文字列を使用してZendeskでユーザーを検索

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | Zendeskのメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | Zendeskのサブドメイン |
| `query` | string | いいえ | 検索クエリ文字列 |
| `externalId` | string | いいえ | 検索する外部ID |
| `perPage` | string | いいえ | ページあたりの結果数（デフォルト：100、最大：100） |
| `page` | string | いいえ | ページ番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `users` | array | ユーザーオブジェクトの配列 |
| `paging` | object | ページネーション情報 |
| `metadata` | object | 操作メタデータ |

### `zendesk_create_user`

Zendeskに新しいユーザーを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | Zendeskのメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | Zendeskのサブドメイン |
| `name` | string | はい | ユーザー名 |
| `userEmail` | string | いいえ | ユーザーメール |
| `role` | string | いいえ | ユーザーロール（end-user、agent、admin） |
| `phone` | string | いいえ | ユーザーの電話番号 |
| `organizationId` | string | いいえ | 組織ID |
| `verified` | string | いいえ | メール確認をスキップするには「true」に設定 |
| `tags` | string | いいえ | カンマ区切りのタグ |
| `customFields` | string | いいえ | JSONオブジェクトとしてのカスタムフィールド（例：\{"field_id": "value"\}） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `user` | object | 作成されたユーザーオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_create_users_bulk`

一括インポートを使用してZendeskに複数のユーザーを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `users` | string | はい | 作成するユーザーオブジェクトのJSON配列 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `jobStatus` | object | ジョブステータスオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_update_user`

Zendeskの既存ユーザーを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `userId` | string | はい | 更新するユーザーID |
| `name` | string | いいえ | 新しいユーザー名 |
| `userEmail` | string | いいえ | 新しいユーザーメール |
| `role` | string | いいえ | ユーザーロール（エンドユーザー、エージェント、管理者） |
| `phone` | string | いいえ | ユーザーの電話番号 |
| `organizationId` | string | いいえ | 組織ID |
| `verified` | string | いいえ | ユーザーを確認済みとしてマークするには「true」に設定 |
| `tags` | string | いいえ | カンマ区切りのタグ |
| `customFields` | string | いいえ | JSONオブジェクトとしてのカスタムフィールド |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `user` | object | 更新されたユーザーオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_update_users_bulk`

一括更新を使用してZendeskで複数のユーザーを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `users` | string | はい | 更新するユーザーオブジェクトのJSON配列（idフィールドを含む必要があります） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `jobStatus` | object | ジョブステータスオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_delete_user`

Zendeskからユーザーを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `userId` | string | はい | 削除するユーザーID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 削除成功 |
| `metadata` | object | 操作メタデータ |

### `zendesk_get_organizations`

Zendeskから組織のリストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン（例："mycompany"（mycompany.zendesk.com用）） |
| `perPage` | string | いいえ | ページあたりの結果数（デフォルト：100、最大：100） |
| `page` | string | いいえ | ページ番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `organizations` | array | 組織オブジェクトの配列 |
| `paging` | object | ページネーション情報 |
| `metadata` | object | 操作メタデータ |

### `zendesk_get_organization`

ZendeskからIDで単一の組織を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `organizationId` | string | はい | 取得する組織ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `organization` | object | 組織オブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_autocomplete_organizations`

名前のプレフィックスによるZendesk内の組織のオートコンプリート（名前マッチング/オートコンプリート用）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `name` | string | はい | 検索する組織名 |
| `perPage` | string | いいえ | ページあたりの結果数（デフォルト：100、最大：100） |
| `page` | string | いいえ | ページ番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `organizations` | array | 組織オブジェクトの配列 |
| `paging` | object | ページネーション情報 |
| `metadata` | object | 操作メタデータ |

### `zendesk_create_organization`

Zendeskで新しい組織を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `name` | string | はい | 組織名 |
| `domainNames` | string | いいえ | カンマ区切りのドメイン名 |
| `details` | string | いいえ | 組織の詳細 |
| `notes` | string | いいえ | 組織のメモ |
| `tags` | string | いいえ | カンマ区切りのタグ |
| `customFields` | string | いいえ | JSONオブジェクトとしてのカスタムフィールド（例：\{"field_id": "value"\}） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `organization` | object | 作成された組織オブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_create_organizations_bulk`

一括インポートを使用してZendeskに複数の組織を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `organizations` | string | はい | 作成する組織オブジェクトのJSON配列 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `jobStatus` | object | ジョブステータスオブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_update_organization`

Zendeskで既存の組織を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `organizationId` | string | はい | 更新する組織ID |
| `name` | string | いいえ | 新しい組織名 |
| `domainNames` | string | いいえ | カンマ区切りのドメイン名 |
| `details` | string | いいえ | 組織の詳細 |
| `notes` | string | いいえ | 組織のメモ |
| `tags` | string | いいえ | カンマ区切りのタグ |
| `customFields` | string | いいえ | JSONオブジェクトとしてのカスタムフィールド |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `organization` | object | 更新された組織オブジェクト |
| `metadata` | object | 操作メタデータ |

### `zendesk_delete_organization`

Zendeskから組織を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `organizationId` | string | はい | 削除する組織ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 削除成功 |
| `metadata` | object | 操作メタデータ |

### `zendesk_search`

Zendeskでチケット、ユーザー、組織を横断した統合検索

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `query` | string | はい | 検索クエリ文字列 |
| `sortBy` | string | いいえ | ソートフィールド（relevance、created_at、updated_at、priority、status、ticket_type） |
| `sortOrder` | string | いいえ | ソート順（ascまたはdesc） |
| `perPage` | string | いいえ | ページあたりの結果数（デフォルト：100、最大：100） |
| `page` | string | いいえ | ページ番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `results` | array | 結果オブジェクトの配列 |
| `paging` | object | ページネーション情報 |
| `metadata` | object | 操作メタデータ |

### `zendesk_search_count`

Zendeskでクエリに一致する検索結果の数をカウント

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | あなたのZendeskメールアドレス |
| `apiToken` | string | はい | Zendesk APIトークン |
| `subdomain` | string | はい | あなたのZendeskサブドメイン |
| `query` | string | はい | 検索クエリ文字列 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `count` | number | 一致する結果の数 |
| `metadata` | object | 操作メタデータ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `zendesk`
```

--------------------------------------------------------------------------------

---[FILE: zep.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/zep.mdx

```text
---
title: Zep
description: AIエージェント用の長期記憶
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zep"
  color="#E8E8E8"
/>

## 使用方法

Zepを統合して長期記憶管理を実現。スレッドの作成、メッセージの追加、AI駆動の要約や事実抽出によるコンテキストの取得が可能です。

## ツール

### `zep_create_thread`

Zepで新しい会話スレッドを開始する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | はい | スレッドの一意の識別子 |
| `userId` | string | はい | スレッドに関連付けられたユーザーID |
| `apiKey` | string | はい | あなたのZep APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `threadId` | string | スレッドID |
| `userId` | string | ユーザーID |
| `uuid` | string | 内部UUID |
| `createdAt` | string | 作成タイムスタンプ |
| `projectUuid` | string | プロジェクトUUID |

### `zep_get_threads`

すべての会話スレッドを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `pageSize` | number | いいえ | 1ページあたりに取得するスレッド数 |
| `pageNumber` | number | いいえ | ページネーションのページ番号 |
| `orderBy` | string | いいえ | 結果を並べ替える項目（created_at、updated_at、user_id、thread_id） |
| `asc` | boolean | いいえ | 並べ替え方向：昇順はtrue、降順はfalse |
| `apiKey` | string | はい | あなたのZep APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `threads` | array | スレッドオブジェクトの配列 |
| `responseCount` | number | このレスポンスに含まれるスレッドの数 |
| `totalCount` | number | 利用可能なスレッドの総数 |

### `zep_delete_thread`

Zepから会話スレッドを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | はい | 削除するスレッドID |
| `apiKey` | string | はい | あなたのZep APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | スレッドが削除されたかどうか |

### `zep_get_context`

サマリーモードまたは基本モードでスレッドからユーザーコンテキストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | はい | コンテキストを取得するスレッドID |
| `mode` | string | いいえ | コンテキストモード：「summary」（自然言語）または「basic」（生のファクト） |
| `minRating` | number | いいえ | 関連するファクトをフィルタリングする最小評価 |
| `apiKey` | string | はい | あなたのZep APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `context` | string | コンテキスト文字列（要約または基本モード） |

### `zep_get_messages`

スレッドからメッセージを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | はい | メッセージを取得するスレッドID |
| `limit` | number | いいえ | 返すメッセージの最大数 |
| `cursor` | string | いいえ | ページネーション用のカーソル |
| `lastn` | number | いいえ | 返す最新メッセージの数（limitとcursorより優先される） |
| `apiKey` | string | はい | あなたのZep APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `messages` | array | メッセージオブジェクトの配列 |
| `rowCount` | number | このレスポンスに含まれるメッセージの数 |
| `totalCount` | number | スレッド内のメッセージの総数 |

### `zep_add_messages`

既存のスレッドにメッセージを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `threadId` | string | はい | メッセージを追加するスレッドID |
| `messages` | json | はい | ロールとコンテンツを持つメッセージオブジェクトの配列 |
| `apiKey` | string | はい | あなたのZep APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `threadId` | string | スレッドID |
| `added` | boolean | メッセージが正常に追加されたかどうか |
| `messageIds` | array | 追加されたメッセージUUIDの配列 |

### `zep_add_user`

Zepで新しいユーザーを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | はい | ユーザーの一意の識別子 |
| `email` | string | いいえ | ユーザーのメールアドレス |
| `firstName` | string | いいえ | ユーザーの名 |
| `lastName` | string | いいえ | ユーザーの姓 |
| `metadata` | json | いいえ | JSONオブジェクトとしての追加メタデータ |
| `apiKey` | string | はい | あなたのZep APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `userId` | string | ユーザーID |
| `email` | string | ユーザーのメール |
| `firstName` | string | ユーザーの名 |
| `lastName` | string | ユーザーの姓 |
| `uuid` | string | 内部UUID |
| `createdAt` | string | 作成タイムスタンプ |
| `metadata` | object | ユーザーメタデータ |

### `zep_get_user`

Zepからユーザー情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | はい | 取得するユーザーID |
| `apiKey` | string | はい | あなたのZep APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `userId` | string | ユーザーID |
| `email` | string | ユーザーのメール |
| `firstName` | string | ユーザーの名 |
| `lastName` | string | ユーザーの姓 |
| `uuid` | string | 内部UUID |
| `createdAt` | string | 作成タイムスタンプ |
| `updatedAt` | string | 最終更新タイムスタンプ |
| `metadata` | object | ユーザーメタデータ |

### `zep_get_user_threads`

特定のユーザーのすべての会話スレッドを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | はい | スレッドを取得するユーザーID |
| `limit` | number | いいえ | 返すスレッドの最大数 |
| `apiKey` | string | はい | あなたのZep APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `threads` | array | このユーザーのスレッドオブジェクトの配列 |
| `totalCount` | number | 返されたスレッドの総数 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `zep`
```

--------------------------------------------------------------------------------

---[FILE: zoom.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/zoom.mdx

```text
---
title: Zoom
description: Zoomミーティングと録画の作成と管理
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="zoom"
  color="#2D8CFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Zoom](https://zoom.us/)は、ビデオ会議、ウェビナー、オンラインコラボレーションのための主要なクラウドベースのコミュニケーションプラットフォームです。ユーザーや組織が簡単に会議のスケジュール設定、ホスト、管理ができ、画面共有、チャット、録画などのツールを提供しています。

Zoomでは、以下のことができます：

- **会議のスケジュール設定と管理**：即時または定期的なイベントを含む予定会議の作成
- **会議オプションの設定**：会議パスワードの設定、待機室の有効化、参加者のビデオ/音声の制御
- **招待状の送信と詳細の共有**：会議の招待状や情報を取得して簡単に共有
- **会議データの取得と更新**：会議の詳細へのアクセス、既存の会議の変更、プログラムによる設定の管理

Simでは、Zoom統合によりエージェントがスケジュール設定と会議管理を自動化できます。ツールアクションを使用して：

- カスタム設定で新しい会議をプログラムで作成
- 特定のユーザー（またはあなた自身）のすべての会議をリスト表示
- 任意の会議の詳細や招待状を取得
- 自動化から直接既存の会議を更新または削除

Zoomに接続するには、Zoomブロックをドロップして `Connect` をクリックし、Zoomアカウントで認証します。接続後、Zoomツールを使用してZoomミーティングの作成、一覧表示、更新、削除ができます。いつでも設定 > 統合から `Disconnect` をクリックしてZoomアカウントの接続を解除でき、Zoomアカウントへのアクセスは直ちに取り消されます。

これらの機能により、リモートコラボレーションの効率化、定期的なビデオセッションの自動化、組織のZoom環境の管理をワークフローの一部として行うことができます。
{/* MANUAL-CONTENT-END */}

## 使用手順

Zoomをワークフローに統合します。Zoomミーティングの作成、一覧表示、更新、削除ができます。ミーティングの詳細、招待状、録画、参加者を取得します。クラウド録画をプログラムで管理します。

## ツール

### `zoom_create_meeting`

新しいZoomミーティングを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | はい | ユーザーIDまたはメールアドレス。認証済みユーザーの場合は「me」を使用。 |
| `topic` | string | はい | ミーティングのトピック |
| `type` | number | いいえ | ミーティングタイプ: 1=即時、2=予定済み、3=固定時間なしの定期的、8=固定時間の定期的 |
| `startTime` | string | いいえ | ISO 8601形式のミーティング開始時間（例：2025-06-03T10:00:00Z） |
| `duration` | number | いいえ | ミーティング時間（分） |
| `timezone` | string | いいえ | ミーティングのタイムゾーン（例：America/Los_Angeles） |
| `password` | string | いいえ | ミーティングパスワード |
| `agenda` | string | いいえ | ミーティングの議題 |
| `hostVideo` | boolean | いいえ | ホストのビデオをオンにして開始 |
| `participantVideo` | boolean | いいえ | 参加者のビデオをオンにして開始 |
| `joinBeforeHost` | boolean | いいえ | ホスト前の参加者の入室を許可 |
| `muteUponEntry` | boolean | いいえ | 入室時に参加者をミュート |
| `waitingRoom` | boolean | いいえ | 待機室を有効にする |
| `autoRecording` | string | いいえ | 自動録画設定: local、cloud、またはnone |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `meeting` | object | すべてのプロパティを含む作成されたミーティング |

### `zoom_list_meetings`

Zoomユーザーのすべてのミーティングをリスト表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | はい | ユーザーIDまたはメールアドレス。認証済みユーザーの場合は「me」を使用。 |
| `type` | string | いいえ | ミーティングタイプフィルター: scheduled、live、upcoming、upcoming_meetings、またはprevious_meetings |
| `pageSize` | number | いいえ | ページあたりのレコード数（最大300） |
| `nextPageToken` | string | いいえ | 次のページの結果を取得するためのページネーショントークン |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `meetings` | array | ミーティングのリスト |
| `pageInfo` | object | ページネーション情報 |

### `zoom_get_meeting`

特定のZoomミーティングの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | はい | ミーティングID |
| `occurrenceId` | string | いいえ | 定期的なミーティングの発生ID |
| `showPreviousOccurrences` | boolean | いいえ | 定期的なミーティングの過去の発生を表示 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `meeting` | object | ミーティングの詳細 |

特定のZoomミーティングの詳細を取得する

既存のZoomミーティングを更新する

#### 入力

| パラメータ | 種類 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | はい | 更新するミーティングID |
| `topic` | string | いいえ | ミーティングのトピック |
| `type` | number | いいえ | ミーティングタイプ: 1=即時、2=予定、3=固定時間なしの定期的、8=固定時間の定期的 |
| `startTime` | string | いいえ | ISO 8601形式のミーティング開始時間（例：2025-06-03T10:00:00Z） |
| `duration` | number | いいえ | ミーティング時間（分） |
| `timezone` | string | いいえ | ミーティングのタイムゾーン（例：America/Los_Angeles） |
| `password` | string | いいえ | ミーティングパスワード |
| `agenda` | string | いいえ | ミーティングの議題 |
| `hostVideo` | boolean | いいえ | ホストのビデオをオンにして開始 |
| `participantVideo` | boolean | いいえ | 参加者のビデオをオンにして開始 |
| `joinBeforeHost` | boolean | いいえ | ホスト前の参加者の入室を許可 |
| `muteUponEntry` | boolean | いいえ | 入室時に参加者をミュート |
| `waitingRoom` | boolean | いいえ | 待機室を有効化 |
| `autoRecording` | string | いいえ | 自動録画設定：local、cloud、またはnone |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | ミーティングが正常に更新されたかどうか |

Zoomミーティングを削除またはキャンセルする

Zoomミーティングを削除またはキャンセルする

#### 入力

| パラメータ | 種類 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | はい | 削除するミーティングID |
| `occurrenceId` | string | いいえ | 定期的なミーティングの特定の回を削除するための回数ID |
| `scheduleForReminder` | boolean | いいえ | 登録者にキャンセルのリマインダーメールを送信 |
| `cancelMeetingReminder` | boolean | いいえ | 登録者と代替ホストにキャンセルメールを送信 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | ミーティングが正常に削除されたかどうか |

### `zoom_get_meeting_invitation`

Zoomミーティングの招待テキストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | はい | ミーティングID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `invitation` | string | ミーティング招待テキスト |

### `zoom_list_recordings`

Zoomユーザーのすべてのクラウド録画を一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `userId` | string | はい | ユーザーIDまたはメールアドレス。認証済みユーザーの場合は「me」を使用。 |
| `from` | string | いいえ | 開始日（yyyy-mm-dd形式）（過去6ヶ月以内） |
| `to` | string | いいえ | 終了日（yyyy-mm-dd形式） |
| `pageSize` | number | いいえ | 1ページあたりのレコード数（最大300） |
| `nextPageToken` | string | いいえ | 次のページの結果を取得するためのページネーショントークン |
| `trash` | boolean | いいえ | ゴミ箱から録画を一覧表示するにはtrueに設定 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `recordings` | array | 録画のリスト |
| `pageInfo` | object | ページネーション情報 |

特定のZoomミーティングのすべての録画を取得する

特定のZoomミーティングのすべての録画を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | はい | ミーティングIDまたはミーティングUUID |
| `includeFolderItems` | boolean | いいえ | フォルダ内のアイテムを含める |
| `ttl` | number | いいえ | ダウンロードURLの有効期間（秒）（最大604800） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `recording` | object | すべてのファイルを含むミーティング録画 |

Zoomミーティングのクラウド録画を削除する

Zoomミーティングのクラウド録画を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | はい | ミーティングIDまたはミーティングUUID |
| `recordingId` | string | いいえ | 削除する特定の録画ファイルID。指定しない場合、すべての録画を削除します。 |
| `action` | string | いいえ | 削除アクション：「trash」（ゴミ箱に移動）または「delete」（完全に削除） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 録画が正常に削除されたかどうか |

過去のZoomミーティングの参加者を一覧表示する

過去のZoomミーティングの参加者を一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `meetingId` | string | はい | 過去のミーティングIDまたはUUID |
| `pageSize` | number | いいえ | ページあたりのレコード数（最大300） |
| `nextPageToken` | string | いいえ | 結果の次のページを取得するための改ページトークン |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `participants` | array | ミーティング参加者のリスト |
| `pageInfo` | object | ページネーション情報 |

## 注意事項

- カテゴリ: `tools`
- タイプ: `zoom`
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/ja/triggers/index.mdx

```text
---
title: 概要
description: トリガーはSimワークフローを開始するための基本的な方法です
---

import { Card, Cards } from 'fumadocs-ui/components/card'
import { Image } from '@/components/ui/image'

<div className="flex justify-center">
  <Image
    src="/static/blocks/triggers.png"
    alt="トリガーの概要"
    width={500}
    height={350}
    className="my-6"
  />
</div>

## コアトリガー

エディタ、APIへのデプロイ、またはチャットへのデプロイエクスペリエンスから始まるすべてのものにはスタートブロックを使用します。イベント駆動型ワークフローには他のトリガーも利用可能です：

<Cards>
  <Card title="Start" href="/triggers/start">
    エディタ実行、APIデプロイメント、チャットデプロイメントをサポートする統合エントリーポイント
  </Card>
  <Card title="Webhook" href="/triggers/webhook">
    外部のwebhookペイロードを受信
  </Card>
  <Card title="Schedule" href="/triggers/schedule">
    Cronまたは間隔ベースの実行
  </Card>
  <Card title="RSS Feed" href="/triggers/rss">
    新しいコンテンツのRSSとAtomフィードを監視
  </Card>
</Cards>

## クイック比較

| トリガー | 開始条件 |
|---------|-----------------|
| **Start** | エディタ実行、APIへのデプロイリクエスト、またはチャットメッセージ |
| **Schedule** | スケジュールブロックで管理されるタイマー |
| **Webhook** | 受信HTTPリクエスト時 |
| **RSS Feed** | フィードに新しいアイテムが公開された時 |

> スタートブロックは常に `input`、`conversationId`、および `files` フィールドを公開します。追加の構造化データには入力フォーマットにカスタムフィールドを追加してください。

## トリガーの使用方法

1. スタートスロットにスタートブロックを配置します（またはウェブフック/スケジュールなどの代替トリガーを使用）。
2. 必要なスキーマまたは認証を設定します。
3. ブロックをワークフローの残りの部分に接続します。

> デプロイメントはすべてのトリガーを動作させます。ワークフローを更新し、再デプロイすると、すべてのトリガーエントリーポイントが新しいスナップショットを取得します。詳細は[実行 → デプロイメントスナップショット](/execution)をご覧ください。

## 手動実行の優先順位

エディタで**実行**をクリックすると、Simは以下の優先順位に基づいて実行するトリガーを自動的に選択します：

1. **スタートブロック**（最高優先度）
2. **スケジュールトリガー**
3. **外部トリガー**（ウェブフック、Slack、Gmail、Airtableなどの統合）

ワークフローに複数のトリガーがある場合、最も優先度の高いトリガーが実行されます。例えば、スタートブロックとウェブフックトリガーの両方がある場合、実行をクリックするとスタートブロックが実行されます。

**モックペイロードを持つ外部トリガー**: 外部トリガー（ウェブフックと連携）が手動で実行される場合、Simはトリガーの予想されるデータ構造に基づいてモックペイロードを自動生成します。これにより、テスト中に下流のブロックが変数を正しく解決できるようになります。
```

--------------------------------------------------------------------------------

---[FILE: rss.mdx]---
Location: sim-main/apps/docs/content/docs/ja/triggers/rss.mdx

```text
---
title: RSSフィード
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Image } from '@/components/ui/image'

RSSフィードブロックはRSSとAtomフィードを監視します - 新しいアイテムが公開されると、ワークフローが自動的にトリガーされます。

<div className="flex justify-center">
  <Image
    src="/static/blocks/rss.png"
    alt="RSSフィードブロック"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 設定

1. **RSSフィードブロックを追加** - RSSフィードブロックをドラッグしてワークフローを開始
2. **フィードURLを入力** - 任意のRSSまたはAtomフィードのURLを貼り付け
3. **デプロイ** - ワークフローをデプロイしてポーリングを有効化

デプロイ後、フィードは1分ごとに新しいアイテムをチェックします。

## 出力フィールド

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `title` | string | アイテムのタイトル |
| `link` | string | アイテムのリンク |
| `pubDate` | string | 公開日 |
| `item` | object | すべてのフィールドを含む生のアイテム |
| `feed` | object | 生のフィードメタデータ |

マッピングされたフィールドに直接アクセスするか（`<rss.title>`）、任意のフィールドに生のオブジェクトを使用します（`<rss.item.author>`、`<rss.feed.language>`）。

## ユースケース

- **コンテンツ監視** - ブログ、ニュースサイト、または競合他社の更新を追跡
- **ポッドキャスト自動化** - 新しいエピソードが公開されたときにワークフローをトリガー
- **リリース追跡** - GitHubリリース、変更ログ、または製品アップデートを監視
- **ソーシャルアグリゲーション** - RSSフィードを公開しているプラットフォームからコンテンツを収集

<Callout>
RSSトリガーは、トリガーを保存した後に公開されたアイテムに対してのみ実行されます。既存のフィードアイテムは処理されません。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: schedule.mdx]---
Location: sim-main/apps/docs/content/docs/ja/triggers/schedule.mdx

```text
---
title: スケジュール
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'
import { Video } from '@/components/ui/video'

スケジュールブロックは、指定された間隔または時間に定期的なスケジュールでワークフローを自動的にトリガーします。

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule.png"
    alt="スケジュールブロック"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## スケジュールオプション

ドロップダウンオプションを使用してワークフローの実行タイミングを設定します：

<Tabs items={['簡単な間隔', 'Cron式']}>
  <Tab>
    <ul className="list-disc space-y-1 pl-6">
      <li><strong>数分ごと</strong>：5分、15分、30分間隔</li>
      <li><strong>毎時</strong>：1時間ごとまたは数時間ごと</li>
      <li><strong>毎日</strong>：1日に1回または複数回</li>
      <li><strong>毎週</strong>：週の特定の曜日</li>
      <li><strong>毎月</strong>：月の特定の日</li>
    </ul>
  </Tab>
  <Tab>
    <p>高度なスケジューリングにはCron式を使用します：</p>
    <div className="text-sm space-y-1">
      <div><code>0 9 * * 1-5</code> - 平日の午前9時</div>
      <div><code>*/15 * * * *</code> - 15分ごと</div>
      <div><code>0 0 1 * *</code> - 毎月1日</div>
    </div>
  </Tab>
</Tabs>

## スケジュールの設定

ワークフローがスケジュールされると：
- スケジュールが**有効**になり、次の実行時間が表示されます
- **「スケジュール済み」**ボタンをクリックするとスケジュールを無効にできます
- スケジュールは**3回連続で失敗すると**自動的に無効になります

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-2.png"
    alt="アクティブなスケジュールブロック"
    width={500}
    height={400}
    className="my-6"
  />
</div>

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-3.png"
    alt="無効化されたスケジュール"
    width={500}
    height={350}
    className="my-6"
  />
</div>

<div className="flex justify-center">
  <Image
    src="/static/blocks/schedule-3.png"
    alt="無効化されたスケジュール"
    width={500}
    height={400}
    className="my-6"
  />
</div>

無効化されたスケジュールは、最後に有効だった時間を表示します。**「無効」**バッジをクリックすると、スケジュールを再度有効にできます。

<Callout>
スケジュールブロックは入力接続を受け取ることができず、純粋なワークフロートリガーとして機能します。
</Callout>
```

--------------------------------------------------------------------------------

---[FILE: start.mdx]---
Location: sim-main/apps/docs/content/docs/ja/triggers/start.mdx

```text
---
title: スタート
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { Image } from '@/components/ui/image'

スタートブロックは、Simで構築されたワークフローのデフォルトトリガーです。構造化された入力を収集し、エディターテスト、APIデプロイメント、チャット体験のためにグラフの残りの部分に分岐します。

<div className="flex justify-center">
  <Image
    src="/static/start.png"
    alt="入力フォーマットフィールドを持つスタートブロック"
    width={360}
    height={380}
    className="my-6"
  />
</div>

<Callout type="info">
スタートブロックは、ワークフローを作成するときに開始スロットに配置されます。エディター実行、APIへのデプロイリクエスト、チャットセッションに同じエントリーポイントを提供したい場合は、そのままにしておきます。イベント駆動の実行のみが必要な場合は、WebhookまたはScheduleトリガーと交換してください。
</Callout>

## スタートによって公開されるフィールド

スタートブロックは、実行環境に応じて異なるデータを出力します：

- **入力フォーマットフィールド** — 追加した各フィールドは <code>&lt;start.fieldName&gt;</code> として利用可能になります。例えば、`customerId` フィールドは、下流のブロックとテンプレートで <code>&lt;start.customerId&gt;</code> として表示されます。
- **チャット専用フィールド** — ワークフローがチャットサイドパネルまたはデプロイされたチャット体験から実行される場合、Simは <code>&lt;start.input&gt;</code>（最新のユーザーメッセージ）、<code>&lt;start.conversationId&gt;</code>（アクティブなセッションID）、および <code>&lt;start.files&gt;</code>（チャットの添付ファイル）も提供します。

入力フォーマットフィールドは、後で参照する予定の名前に限定してください—これらの値は、エディター、API、およびチャット実行間で共有される唯一の構造化フィールドです。

## 入力フォーマットの設定

入力フォーマットのサブブロックを使用して、実行モード全体に適用されるスキーマを定義します：

1. 収集したい各値のフィールドを追加します。
2. タイプを選択します（`string`、`number`、`boolean`、`object`、`array`、または `files`）。ファイルフィールドは、チャットとAPIの呼び出し元からのアップロードを受け付けます。
3. 手動実行モーダルにテストデータを自動的に入力させたい場合は、デフォルト値を提供します。これらのデフォルト値はデプロイされた実行では無視されます。
4. フィールドを並べ替えて、エディターフォームでの表示方法を制御します。

接続するブロックに応じて、<code>&lt;start.customerId&gt;</code>のような式を使用して、下流の構造化された値を参照できます。

## エントリーポイントごとの動作

<Tabs items={['エディタ実行', 'APIにデプロイ', 'チャットにデプロイ']}>
  <Tab>
    <div className="space-y-3">
      <p>
        エディタで<strong>実行</strong>をクリックすると、スタートブロックは入力フォーマットをフォームとしてレンダリングします。デフォルト値により、データを再入力せずに簡単に再テストできます。フォームを送信するとワークフローが即座にトリガーされ、値は<code>&lt;start.fieldName&gt;</code>（例えば<code>&lt;start.sampleField&gt;</code>）で利用可能になります。
      </p>
      <p>
        フォーム内のファイルフィールドは対応する<code>&lt;start.fieldName&gt;</code>に直接アップロードされます。これらの値を使用して、下流のツールやストレージステップにデータを供給します。
      </p>
    </div>
  </Tab>
  <Tab>
    <div className="space-y-3">
      <p>
        APIにデプロイすると、入力フォーマットはクライアント向けのJSON契約に変換されます。各フィールドはリクエストボディの一部となり、Simは取り込み時にプリミティブ型を強制変換します。ファイルフィールドはアップロードされたファイルを参照するオブジェクトを想定しています。ワークフローを呼び出す前に、実行ファイルアップロードエンドポイントを使用してください。
      </p>
      <p>
        API呼び出し元は追加のオプションプロパティを含めることができます。これらは<code>&lt;start.fieldName&gt;</code>出力内に保持されるため、すぐに再デプロイせずに実験できます。
      </p>
    </div>
  </Tab>
  <Tab>
    <div className="space-y-3">
      <p>
        チャットデプロイメントでは、スタートブロックはアクティブな会話にバインドされます。最新のメッセージは<code>&lt;start.input&gt;</code>に入力され、セッション識別子は<code>&lt;start.conversationId&gt;</code>で利用可能になり、ユーザーの添付ファイルは<code>&lt;start.files&gt;</code>に表示されます。また、<code>&lt;start.fieldName&gt;</code>としてスコープされた入力フォーマットフィールドも同様です。
      </p>
      <p>
        追加の構造化されたコンテキスト（例えば埋め込みから）でチャットを起動すると、それは対応する<code>&lt;start.fieldName&gt;</code>出力にマージされ、下流のブロックがAPIや手動実行と一貫性を保ちます。
      </p>
    </div>
  </Tab>
</Tabs>

## 下流でのStart（開始）データの参照

- <code>&lt;start.fieldName&gt;</code>を構造化されたペイロードを期待するエージェント、ツール、または関数に直接接続します。
- プロンプトフィールドで<code>&lt;start.sampleField&gt;</code>や<code>&lt;start.files[0].url&gt;</code>（チャットのみ）などのテンプレート構文を使用します。
- 出力のグループ化、会話履歴の更新、またはチャットAPIへのコールバックが必要な場合は、<code>&lt;start.conversationId&gt;</code>を手元に置いておきます。

## ベストプラクティス

- APIとチャットの両方の呼び出し元をサポートしたい場合は、Startブロックを単一のエントリーポイントとして扱います。
- 下流のノードで生のJSONを解析するよりも、名前付き入力フォーマットフィールドを優先します。型の強制変換は自動的に行われます。
- ワークフローが成功するために特定のフィールドが必要な場合は、Startの直後に検証またはルーティングを追加します。

- <code>&lt;start.fieldName&gt;</code>を構造化されたペイロードを期待するエージェント、ツール、または関数に直接接続します。
- プロンプトフィールドで<code>&lt;start.sampleField&gt;</code>や<code>&lt;start.files[0].url&gt;</code>（チャットのみ）などのテンプレート構文を使用します。
- 出力のグループ化、会話履歴の更新、またはチャットAPIへのコールバックが必要な場合は、<code>&lt;start.conversationId&gt;</code>を手元に置いておきます。

## ベストプラクティス

- APIとチャットの両方の呼び出し元をサポートしたい場合は、スタートブロックを単一のエントリーポイントとして扱います。
- 下流のノードで生のJSONを解析するよりも、名前付き入力フォーマットフィールドを優先します。型の強制変換は自動的に行われます。
- ワークフローの成功に特定のフィールドが必要な場合は、スタートの直後に検証またはルーティングを追加します。
```

--------------------------------------------------------------------------------

````
