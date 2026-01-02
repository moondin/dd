---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 204
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 204 of 933)

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

---[FILE: intercom.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/intercom.mdx

```text
---
title: Intercom
description: Intercomで連絡先、企業、会話、チケット、メッセージを管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="intercom"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Intercom](https://www.intercom.com/)は、連絡先、企業、会話、チケット、メッセージとのやり取りを一か所で管理・自動化できる主要な顧客コミュニケーションプラットフォームです。SimのIntercom統合により、エージェントは自動化されたワークフローから顧客関係、サポートリクエスト、会話をプログラムで直接管理できます。

Intercomツールでは、以下のことができます：

- **連絡先管理：** 連絡先の作成、取得、更新、一覧表示、検索、削除—CRMプロセスを自動化し、顧客記録を最新の状態に保ちます。
- **企業管理：** 新しい企業の作成、企業詳細の取得、ユーザーやビジネスクライアントに関連するすべての企業の一覧表示。
- **会話処理：** 会話の取得、一覧表示、返信、検索—エージェントが進行中のサポートスレッドを追跡し、回答を提供し、フォローアップアクションを自動化できます。
- **チケット管理：** プログラムでチケットを作成および取得し、カスタマーサービス、サポート問題の追跡、ワークフローのエスカレーションを自動化します。
- **メッセージ送信：** ワークフロー自動化内からオンボーディング、サポート、マーケティングのためにユーザーやリードにメッセージをトリガーします。

IntercomツールをSimに統合することで、ワークフローがユーザーと直接通信し、カスタマーサポートプロセスを自動化し、リードを管理し、大規模なコミュニケーションを効率化する能力を与えます。新しい連絡先の作成、顧客データの同期、サポートチケットの管理、パーソナライズされたエンゲージメントメッセージの送信など、Intercomツールはインテリジェントな自動化の一部として顧客とのやり取りを管理するための包括的な方法を提供します。
{/* MANUAL-CONTENT-END */}

## 使用手順

Intercomをワークフローに統合します。連絡先の作成、取得、更新、一覧表示、検索、削除；企業の作成、取得、一覧表示；会話の取得、一覧表示、返信、検索；チケットの作成と取得；およびメッセージの作成が可能です。

## ツール

### `intercom_create_contact`

メール、external_id、または役割を使用してIntercomに新しい連絡先を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | いいえ | 連絡先のメールアドレス |
| `external_id` | string | いいえ | クライアントが提供する連絡先の一意の識別子 |
| `phone` | string | いいえ | 連絡先の電話番号 |
| `name` | string | いいえ | 連絡先の名前 |
| `avatar` | string | いいえ | 連絡先のアバター画像URL |
| `signed_up_at` | number | いいえ | ユーザーが登録した時間（Unixタイムスタンプ） |
| `last_seen_at` | number | いいえ | ユーザーが最後に確認された時間（Unixタイムスタンプ） |
| `owner_id` | string | いいえ | 連絡先のアカウント所有権が割り当てられた管理者のID |
| `unsubscribed_from_emails` | boolean | いいえ | 連絡先がメールの配信を解除しているかどうか |
| `custom_attributes` | string | いいえ | JSONオブジェクトとしてのカスタム属性（例：\{"attribute_name": "value"\}） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作の成功ステータス |
| `output` | object | 作成された連絡先データ |

### `intercom_get_contact`

IDからIntercomの単一の連絡先を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | はい | 取得する連絡先ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 連絡先データ |

### `intercom_update_contact`

Intercomの既存の連絡先を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | はい | 更新する連絡先ID |
| `email` | string | いいえ | 連絡先のメールアドレス |
| `phone` | string | いいえ | 連絡先の電話番号 |
| `name` | string | いいえ | 連絡先の名前 |
| `avatar` | string | いいえ | 連絡先のアバター画像URL |
| `signed_up_at` | number | いいえ | ユーザーが登録した時間（Unixタイムスタンプ） |
| `last_seen_at` | number | いいえ | ユーザーが最後に確認された時間（Unixタイムスタンプ） |
| `owner_id` | string | いいえ | 連絡先のアカウント所有権が割り当てられた管理者のID |
| `unsubscribed_from_emails` | boolean | いいえ | 連絡先がメールの配信を解除しているかどうか |
| `custom_attributes` | string | いいえ | JSONオブジェクトとしてのカスタム属性（例：\{"attribute_name": "value"\}） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 更新された連絡先データ |

### `intercom_list_contacts`

ページネーションをサポートしてIntercomからすべての連絡先をリストする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | いいえ | ページあたりの結果数（最大：150） |
| `starting_after` | string | いいえ | ページネーション用カーソル - 開始するIDの後 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 連絡先リスト |

### `intercom_search_contacts`

クエリを使用してIntercomで連絡先を検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 検索クエリ（例：\{"field":"email","operator":"=","value":"user@example.com"\}） |
| `per_page` | number | いいえ | ページあたりの結果数（最大：150） |
| `starting_after` | string | いいえ | ページネーション用カーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 検索結果 |

### `intercom_delete_contact`

IDでIntercomから連絡先を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | はい | 削除する連絡先ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 削除結果 |

### `intercom_create_company`

Intercomで企業を作成または更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `company_id` | string | はい | 企業の一意の識別子 |
| `name` | string | いいえ | 企業名 |
| `website` | string | いいえ | 企業のウェブサイト |
| `plan` | string | いいえ | 企業のプラン名 |
| `size` | number | いいえ | 企業の従業員数 |
| `industry` | string | いいえ | 企業が事業を展開している業界 |
| `monthly_spend` | number | いいえ | 企業があなたのビジネスにもたらす収益額。注：このフィールドは小数点以下を切り捨てて整数にします（例：155.98は155になります） |
| `custom_attributes` | string | いいえ | JSONオブジェクトとしてのカスタム属性 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作の成功ステータス |
| `output` | object | 作成または更新された企業データ |

### `intercom_get_company`

IDによってIntercomから単一の企業を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | はい | 取得する企業ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作の成功ステータス |
| `output` | object | 企業データ |

### `intercom_list_companies`

ページネーションをサポートしてIntercomからすべての企業を一覧表示します。注：このエンドポイントはページネーションを使用して返すことができる企業数が10,000社に制限されています。10,000社を超えるデータセットの場合は、代わりにスクロールAPIを使用してください。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | いいえ | ページあたりの結果数 |
| `page` | number | いいえ | ページ番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 企業のリスト |

### `intercom_get_conversation`

IDによりIntercomから単一の会話を取得

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | はい | 取得する会話ID |
| `display_as` | string | いいえ | プレーンテキストでメッセージを取得するには「plaintext」に設定 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 会話データ |

### `intercom_list_conversations`

ページネーションサポート付きでIntercomからすべての会話を一覧表示

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `per_page` | number | いいえ | ページあたりの結果数（最大：150） |
| `starting_after` | string | いいえ | ページネーション用カーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 会話のリスト |

### `intercom_reply_conversation`

管理者としてIntercomで会話に返信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `conversationId` | string | はい | 返信する会話ID |
| `message_type` | string | はい | メッセージタイプ：「comment」または「note」 |
| `body` | string | はい | 返信の本文テキスト |
| `admin_id` | string | いいえ | 返信を作成する管理者のID。提供されない場合、デフォルトの管理者（オペレーター/Fin）が使用されます。 |
| `attachment_urls` | string | いいえ | 画像URLのカンマ区切りリスト（最大10件） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 返信を含む更新された会話 |

### `intercom_search_conversations`

クエリを使用してIntercomで会話を検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | JSONオブジェクトとしての検索クエリ |
| `per_page` | number | いいえ | ページあたりの結果数（最大：150） |
| `starting_after` | string | いいえ | ページネーション用のカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 検索結果 |

### `intercom_create_ticket`

Intercomで新しいチケットを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `ticket_type_id` | string | はい | チケットタイプのID |
| `contacts` | string | はい | 連絡先識別子のJSON配列（例：\[\{"id": "contact_id"\}\]） |
| `ticket_attributes` | string | はい | _default_title_と_default_description_を含むチケット属性のJSONオブジェクト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 作成されたチケットデータ |

### `intercom_get_ticket`

IDによりIntercomから単一のチケットを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `ticketId` | string | はい | 取得するチケットID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | チケットデータ |

### `intercom_create_message`

Intercomで管理者が開始した新しいメッセージを作成して送信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `message_type` | string | はい | メッセージタイプ：「inapp」または「email」 |
| `subject` | string | いいえ | メッセージの件名（emailタイプの場合） |
| `body` | string | はい | メッセージの本文 |
| `from_type` | string | はい | 送信者タイプ：「admin」 |
| `from_id` | string | はい | メッセージを送信する管理者のID |
| `to_type` | string | はい | 受信者タイプ：「contact」 |
| `to_id` | string | はい | メッセージを受信する連絡先のID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 作成されたメッセージデータ |

## メモ

- カテゴリー: `tools`
- タイプ: `intercom`
```

--------------------------------------------------------------------------------

---[FILE: jina.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/jina.mdx

```text
---
title: Jina
description: ウェブを検索またはURLからコンテンツを抽出
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="jina"
  color="#333333"
/>

{/* MANUAL-CONTENT-START:intro */}
[Jina AI](https://jina.ai/)は、Simとシームレスに統合して、ウェブコンテンツをクリーンで読みやすいテキストに変換する強力なコンテンツ抽出ツールです。この統合により、開発者はウェブコンテンツ処理機能をエージェントワークフローに簡単に組み込むことができます。

Jina AI Readerは、ウェブページから最も関連性の高いコンテンツを抽出し、雑然としたもの、広告、フォーマットの問題を取り除いて、言語モデルやその他のテキスト処理タスクに最適化されたクリーンで構造化されたテキストを生成することを専門としています。

SimのJina AI統合により、以下のことが可能になります：

- URLを提供するだけで、任意のウェブページから**クリーンなコンテンツを抽出**
- 複雑なウェブレイアウトを構造化された読みやすい**テキストに処理**
- 不要な要素を削除しながら**重要なコンテキストを維持**
- エージェントワークフローでのさらなる処理のために**ウェブコンテンツを準備**
- ウェブ情報を使用可能なデータに素早く変換することで**研究タスクを効率化**

この統合は、ウェブから情報を収集して処理したり、研究を行ったり、ワークフローの一部としてオンラインコンテンツを分析したりする必要があるエージェントを構築する際に特に価値があります。
{/* MANUAL-CONTENT-END */}

## 使用方法

Jina AIをワークフローに統合します。ウェブを検索してLLMに適した結果を取得するか、高度な解析オプションを使用して特定のURLからクリーンなコンテンツを抽出します。

## ツール

### `jina_read_url`

Jina AI Readerを使用してウェブコンテンツを抽出し、LLMフレンドリーなクリーンテキストに処理します。高度なコンテンツ解析、リンク収集、および設定可能な処理オプションによる複数の出力形式をサポートします。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `url` | string | はい | 読み込んでマークダウンに変換するURL |
| `useReaderLMv2` | boolean | いいえ | より高品質のためにReaderLM-v2を使用するかどうか（トークンコストが3倍） |
| `gatherLinks` | boolean | いいえ | すべてのリンクを最後にまとめるかどうか |
| `jsonResponse` | boolean | いいえ | レスポンスをJSON形式で返すかどうか |
| `apiKey` | string | はい | あなたのJina AI APIキー |
| `withImagesummary` | boolean | いいえ | ページからメタデータ付きですべての画像を収集する |
| `retainImages` | string | いいえ | 画像の含め方の制御：「none」はすべて削除、「all」はすべて保持 |
| `returnFormat` | string | いいえ | 出力形式：markdown、html、text、screenshot、またはpageshot |
| `withIframe` | boolean | いいえ | 抽出にiframeコンテンツを含めるかどうか |
| `withShadowDom` | boolean | いいえ | Shadow DOMコンテンツを抽出する |
| `noCache` | boolean | いいえ | リアルタイム取得のためにキャッシュされたコンテンツをバイパスする |
| `withGeneratedAlt` | boolean | いいえ | VLMを使用して画像の代替テキストを生成する |
| `robotsTxt` | string | いいえ | robots.txtチェック用のボットユーザーエージェント |
| `dnt` | boolean | いいえ | Do Not Track - キャッシュ/トラッキングを防止する |
| `noGfm` | boolean | いいえ | GitHub Flavored Markdownを無効にする |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | URLから抽出されたコンテンツで、クリーンでLLMフレンドリーなテキストに処理されたもの |
| `links` | array | ページで見つかったリンクのリスト（gatherLinksまたはwithLinksummaryが有効な場合） |
| `images` | array | ページで見つかった画像のリスト（withImagesummaryが有効な場合） |

### `jina_search`

ウェブを検索し、LLMフレンドリーなコンテンツを含むトップ5の結果を返します。各結果は自動的にJina Reader APIを通じて処理されます。地理的フィルタリング、サイト制限、ページネーションをサポートしています。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `q` | string | はい | 検索クエリ文字列 |
| `apiKey` | string | はい | あなたのJina AI APIキー |
| `num` | number | いいえ | ページあたりの最大結果数（デフォルト：5） |
| `site` | string | いいえ | 特定のドメインに結果を制限する。複数のサイトの場合はカンマ区切りで指定可能（例："jina.ai,github.com"） |
| `withFavicon` | boolean | いいえ | 結果にウェブサイトのファビコンを含める |
| `withImagesummary` | boolean | いいえ | 結果ページからメタデータ付きですべての画像を収集する |
| `withLinksummary` | boolean | いいえ | 結果ページからすべてのリンクを収集する |
| `retainImages` | string | いいえ | 画像の含め方の制御：「none」はすべて削除、「all」はすべて保持 |
| `noCache` | boolean | いいえ | リアルタイム取得のためにキャッシュされたコンテンツをバイパスする |
| `withGeneratedAlt` | boolean | いいえ | VLMを使用して画像の代替テキストを生成する |
| `respondWith` | string | いいえ | ページコンテンツなしでメタデータのみを取得するには「no-content」に設定 |
| `returnFormat` | string | いいえ | 出力形式：markdown、html、text、screenshot、またはpageshot |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `results` | array | 検索結果の配列。各結果にはタイトル、説明、URL、LLMフレンドリーなコンテンツが含まれます |

## 注意事項

- カテゴリー: `tools`
- タイプ: `jina`
```

--------------------------------------------------------------------------------

---[FILE: jira.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/jira.mdx

```text
---
title: Jira
description: Jiraとの連携
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="jira"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Jira](https://www.atlassian.com/jira)は、チームがアジャイルソフトウェア開発プロジェクトを効果的に計画、追跡、管理するのに役立つ、主要なプロジェクト管理および課題追跡プラットフォームです。Atlassianスイートの一部として、Jiraは世界中のソフトウェア開発チームやプロジェクト管理の専門家にとって業界標準となっています。

Jiraは、柔軟でカスタマイズ可能なワークフローシステムを通じて、複雑なプロジェクトを管理するための包括的なツールセットを提供します。強力なAPIと統合機能により、チームは開発プロセスを効率化し、プロジェクトの進捗状況を明確に把握することができます。

Jiraの主な機能には以下が含まれます：

- アジャイルプロジェクト管理：カスタマイズ可能なボードとワークフローによるスクラムとカンバン手法のサポート
- 課題追跡：バグ、ストーリー、エピック、タスクの詳細なレポート機能を備えた高度な追跡システム
- ワークフロー自動化：繰り返しのタスクやプロセスを効率化する強力な自動化ルール
- 高度な検索：複雑な課題のフィルタリングとレポート作成のためのJQL（Jira Query Language）

Simでは、Jira統合によりエージェントがプロジェクト管理ワークフローとシームレスに連携できます。これにより、AIワークフローの一部として課題の自動作成、更新、追跡の機会が生まれます。この統合により、エージェントはプログラムによってJiraの課題を作成、取得、更新することができ、プロジェクト管理タスクの自動化を促進し、重要な情報が適切に追跡・文書化されることを保証します。SimとJiraを連携させることで、プロジェクトの可視性を維持しながら日常的なプロジェクト管理タスクを自動化するインテリジェントなエージェントを構築し、チームの生産性を向上させ、一貫したプロジェクト追跡を確保することができます。
{/* MANUAL-CONTENT-END */}

## 使用手順

Jiraをワークフローに統合します。課題の読み取り、書き込み、更新が可能です。Jiraのウェブフックイベントに基づいてワークフローをトリガーすることもできます。

## ツール

### `jira_retrieve`

特定のJira課題に関する詳細情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `projectId` | string | いいえ | JiraプロジェクトID（オプション；単一の課題を取得する場合は不要） |
| `issueKey` | string | はい | 取得するJira課題キー（例：PROJ-123） |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 課題キー（例：PROJ-123） |
| `summary` | string | 課題の要約 |
| `description` | json | 課題の説明内容 |
| `created` | string | 課題作成タイムスタンプ |
| `updated` | string | 課題最終更新タイムスタンプ |
| `issue` | json | すべてのフィールドを含む完全な課題オブジェクト |

### `jira_update`

Jira課題を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `projectId` | string | いいえ | 課題を更新するJiraプロジェクトID。提供されない場合、すべての課題が取得されます。 |
| `issueKey` | string | はい | 更新するJira課題キー |
| `summary` | string | いいえ | 課題の新しい要約 |
| `description` | string | いいえ | 課題の新しい説明 |
| `status` | string | いいえ | 課題の新しいステータス |
| `priority` | string | いいえ | 課題の新しい優先度 |
| `assignee` | string | いいえ | 課題の新しい担当者 |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 更新された課題キー（例：PROJ-123） |
| `summary` | string | 更新後の課題要約 |

### `jira_write`

Jira課題を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `projectId` | string | はい | 課題のプロジェクトID |
| `summary` | string | はい | 課題の要約 |
| `description` | string | いいえ | 課題の説明 |
| `priority` | string | いいえ | 課題の優先度 |
| `assignee` | string | いいえ | 課題の担当者 |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |
| `issueType` | string | はい | 作成する課題のタイプ（例：タスク、ストーリー） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 作成された課題キー（例：PROJ-123） |
| `summary` | string | 課題の要約 |
| `url` | string | 作成された課題へのURL |

### `jira_bulk_read`

複数のJira課題を一括で取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `projectId` | string | はい | JiraプロジェクトID |
| `cloudId` | string | いいえ | Jira cloud ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `issues` | array | タイムスタンプ、要約、説明、作成日時、更新日時を含むJira課題の配列 |

### `jira_delete_issue`

Jira課題を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | 削除するJira課題キー（例：PROJ-123） |
| `deleteSubtasks` | boolean | いいえ | サブタスクを削除するかどうか。falseの場合、サブタスクを持つ親課題は削除できません。 |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 削除された課題キー |

### `jira_assign_issue`

Jira課題をユーザーに割り当てる

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | 割り当てるJira課題キー（例：PROJ-123） |
| `accountId` | string | はい | 課題を割り当てるユーザーのアカウントID。自動割り当てには"-1"を使用するか、割り当て解除にはnullを使用します。 |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 割り当てられた課題キー |
| `assigneeId` | string | 担当者のアカウントID |

### `jira_transition_issue`

Jira課題をワークフローステータス間で移動する（例：To Do → In Progress）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | 移行するJira課題キー（例：PROJ-123） |
| `transitionId` | string | はい | 実行する移行のID（例：「11」は「To Do」、「21」は「In Progress」） |
| `comment` | string | いいえ | 課題を移行する際に追加するオプションのコメント |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 遷移した課題キー |
| `transitionId` | string | 適用されたトランジションID |

### `jira_search_issues`

JQL（Jira Query Language）を使用してJira課題を検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `jql` | string | はい | 課題を検索するためのJQLクエリ文字列（例：「project = PROJ AND status = Open」） |
| `startAt` | number | いいえ | 返す最初の結果のインデックス（ページネーション用） |
| `maxResults` | number | いいえ | 返す結果の最大数（デフォルト：50） |
| `fields` | array | いいえ | 返すフィールド名の配列（デフォルト：['summary', 'status', 'assignee', 'created', 'updated']） |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `total` | number | 一致する課題の総数 |
| `startAt` | number | ページネーション開始インデックス |
| `maxResults` | number | ページあたりの最大結果数 |
| `issues` | array | キー、要約、ステータス、担当者、作成日時、更新日時を含む一致する課題の配列 |

### `jira_add_comment`

Jira課題にコメントを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | コメントを追加するJira課題キー（例：PROJ-123） |
| `body` | string | はい | コメント本文テキスト |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | コメントが追加された課題キー |
| `commentId` | string | 作成されたコメントID |
| `body` | string | コメントのテキスト内容 |

### `jira_get_comments`

Jira課題からすべてのコメントを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | コメントを取得するJira課題キー（例：PROJ-123） |
| `startAt` | number | いいえ | 返す最初のコメントのインデックス（デフォルト：0） |
| `maxResults` | number | いいえ | 返すコメントの最大数（デフォルト：50） |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 課題キー |
| `total` | number | コメントの総数 |
| `comments` | array | ID、作成者、本文、作成日時、更新日時を含むコメントの配列 |

### `jira_update_comment`

Jira課題の既存コメントを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | コメントを含むJira課題キー（例：PROJ-123） |
| `commentId` | string | はい | 更新するコメントのID |
| `body` | string | はい | 更新されたコメントテキスト |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 課題キー |
| `commentId` | string | 更新されたコメントID |
| `body` | string | 更新されたコメントテキスト |

### `jira_delete_comment`

Jira課題からコメントを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | コメントを含むJira課題キー（例：PROJ-123） |
| `commentId` | string | はい | 削除するコメントのID |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 課題キー |
| `commentId` | string | 削除されたコメントID |

### `jira_get_attachments`

Jira課題からすべての添付ファイルを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | 添付ファイルを取得するJira課題キー（例：PROJ-123） |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 課題キー |
| `attachments` | array | ID、ファイル名、サイズ、MIMEタイプ、作成日時、作成者を含む添付ファイルの配列 |

### `jira_delete_attachment`

Jira課題から添付ファイルを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `attachmentId` | string | はい | 削除する添付ファイルのID |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `attachmentId` | string | 削除された添付ファイルID |

### `jira_add_worklog`

Jira課題に作業時間記録エントリを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | 作業ログを追加するJira課題キー（例：PROJ-123） |
| `timeSpentSeconds` | number | はい | 秒単位の作業時間 |
| `comment` | string | いいえ | 作業ログエントリのオプションコメント |
| `started` | string | いいえ | ISO形式のオプション開始時間（デフォルトは現在時刻） |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 作業ログが追加された課題キー |
| `worklogId` | string | 作成された作業ログID |
| `timeSpentSeconds` | number | 秒単位の作業時間 |

### `jira_get_worklogs`

Jira課題からすべての作業ログエントリを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | 作業ログを取得するJira課題キー（例：PROJ-123） |
| `startAt` | number | いいえ | 返す最初の作業ログのインデックス（デフォルト：0） |
| `maxResults` | number | いいえ | 返す作業ログの最大数（デフォルト：50） |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 課題キー |
| `total` | number | 作業ログの総数 |
| `worklogs` | array | ID、作成者、秒単位の作業時間、作業時間、コメント、作成日時、更新日時、開始日時を含む作業ログの配列 |

### `jira_update_worklog`

Jira課題の既存の作業ログエントリを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | 作業ログを含むJira課題キー（例：PROJ-123） |
| `worklogId` | string | はい | 更新する作業ログエントリのID |
| `timeSpentSeconds` | number | いいえ | 秒単位の作業時間 |
| `comment` | string | いいえ | 作業ログエントリのオプションコメント |
| `started` | string | いいえ | ISO形式のオプション開始時間 |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 課題キー |
| `worklogId` | string | 更新された作業ログID |

### `jira_delete_worklog`

Jira課題から作業ログエントリを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | 作業ログを含むJira課題キー（例：PROJ-123） |
| `worklogId` | string | はい | 削除する作業ログエントリのID |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 課題キー |
| `worklogId` | string | 削除された作業ログID |

### `jira_create_issue_link`

2つのJira課題間のリンク関係を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `inwardIssueKey` | string | はい | インワード課題のJira課題キー（例：PROJ-123） |
| `outwardIssueKey` | string | はい | アウトワード課題のJira課題キー（例：PROJ-456） |
| `linkType` | string | はい | リンク関係のタイプ（例：「ブロック」、「関連」、「重複」） |
| `comment` | string | いいえ | 課題リンクに追加するオプションのコメント |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `inwardIssue` | string | インワード課題キー |
| `outwardIssue` | string | アウトワード課題キー |
| `linkType` | string | 課題リンクのタイプ |
| `linkId` | string | 作成されたリンクID |

### `jira_delete_issue_link`

2つのJira課題間のリンクを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `linkId` | string | はい | 削除する課題リンクのID |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `linkId` | string | 削除されたリンクID |

### `jira_add_watcher`

更新に関する通知を受け取るためにJira課題にウォッチャーを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | ウォッチャーを追加するJira課題キー（例：PROJ-123） |
| `accountId` | string | はい | ウォッチャーとして追加するユーザーのアカウントID |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 課題キー |
| `watcherAccountId` | string | 追加されたウォッチャーのアカウントID |

### `jira_remove_watcher`

Jira課題からウォッチャーを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | あなたのJiraドメイン（例：yourcompany.atlassian.net） |
| `issueKey` | string | はい | ウォッチャーを削除するJira課題キー（例：PROJ-123） |
| `accountId` | string | はい | ウォッチャーとして削除するユーザーのアカウントID |
| `cloudId` | string | いいえ | インスタンスのJira Cloud ID。提供されない場合、ドメインを使用して取得されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `ts` | string | 操作のタイムスタンプ |
| `issueKey` | string | 課題キー |
| `watcherAccountId` | string | 削除されたウォッチャーのアカウントID |

## 注意事項

- カテゴリー: `tools`
- タイプ: `jira`
```

--------------------------------------------------------------------------------

---[FILE: kalshi.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/kalshi.mdx

```text
---
title: Kalshi
description: Kalshiの予測市場にアクセスして取引する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="kalshi"
  color="#09C285"
/>

{/* MANUAL-CONTENT-START:intro */}
[Kalshi](https://kalshi.com)は連邦政府の規制を受けた取引所で、ユーザーは将来のイベントの結果に直接取引できる予測市場です。KalshiのロバストなAPIとSimの統合により、エージェントやワークフローがプラットフォームのあらゆる側面にプログラム的にアクセスでき、調査や分析から自動取引や監視まで、すべてをサポートします。

SimにおけるKalshiの統合により、以下のことが可能になります：

- **市場とイベントデータ：** 市場やイベントのリアルタイムおよび過去のデータを検索、フィルタリング、取得。市場の状態、シリーズ、イベントグループなどの詳細情報を取得。
- **アカウントと残高管理：** アカウント残高、利用可能な資金へのアクセス、リアルタイムのオープンポジションの監視。
- **注文と取引管理：** 新規注文の発注、既存注文のキャンセル、オープン注文の表示、リアルタイムの注文板の取得、完全な取引履歴へのアクセス。
- **実行分析：** 最近の取引、過去の約定、バックテストや市場構造研究のためのローソク足データの取得。
- **監視：** 取引所全体またはシリーズレベルのステータスの確認、市場の変化や取引停止に関するリアルタイム更新の受信、自動応答の設定。
- **自動化対応：** 実世界のイベント確率を消費、分析、取引する完全自動化されたエージェントやダッシュボードの構築。

これらの統合されたツールとエンドポイントを使用することで、Kalshiの予測市場、リアルタイム取引機能、詳細なイベントデータをAIを活用したアプリケーション、ダッシュボード、ワークフローにシームレスに組み込むことができ、実世界の結果に結びついた高度な自動意思決定を可能にします。
{/* MANUAL-CONTENT-END */}

## 使用方法

Kalshiの予測市場をワークフローに統合します。市場一覧、個別市場、イベント一覧、個別イベント、残高、ポジション、注文、注文板、取引履歴、ローソク足チャート、約定履歴、シリーズ、取引所ステータスの取得、および取引の発注/キャンセル/変更が可能です。

## ツール

### `kalshi_get_markets`

オプションのフィルタリングを使用してKalshiから予測市場のリストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `status` | string | いいえ | ステータスでフィルタリング（unopened、open、closed、settled） |
| `seriesTicker` | string | いいえ | シリーズティッカーでフィルタリング |
| `eventTicker` | string | いいえ | イベントティッカーでフィルタリング |
| `limit` | string | いいえ | 結果の数（1-1000、デフォルト：100） |
| `cursor` | string | いいえ | 次のページのページネーションカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `markets` | array | 市場オブジェクトの配列 |
| `paging` | object | さらに結果を取得するためのページネーションカーソル |

### `kalshi_get_market`

ティッカーで特定の予測市場の詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `ticker` | string | はい | 市場ティッカー（例："KXBTC-24DEC31"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `market` | object | 詳細情報を含む市場オブジェクト |

### `kalshi_get_events`

オプションのフィルタリングを使用してKalshiからイベントのリストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `status` | string | いいえ | ステータスでフィルタリング（open、closed、settled） |
| `seriesTicker` | string | いいえ | シリーズティッカーでフィルタリング |
| `withNestedMarkets` | string | いいえ | レスポンスにネストされた市場を含める（true/false） |
| `limit` | string | いいえ | 結果の数（1-200、デフォルト：200） |
| `cursor` | string | いいえ | 次のページのページネーションカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `events` | array | イベントオブジェクトの配列 |
| `paging` | object | さらに結果を取得するためのページネーションカーソル |

### `kalshi_get_event`

ティッカーで特定のイベントの詳細を取得

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `eventTicker` | string | はい | イベントティッカー |
| `withNestedMarkets` | string | いいえ | レスポンスにネストされたマーケットを含める（true/false） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `event` | object | 詳細情報を含むイベントオブジェクト |

### `kalshi_get_balance`

Kalshiからアカウント残高とポートフォリオ価値を取得

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | はい | あなたのKalshi APIキーID |
| `privateKey` | string | はい | あなたのRSA秘密鍵（PEM形式） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `balance` | number | セント単位のアカウント残高 |
| `portfolioValue` | number | セント単位のポートフォリオ価値 |
| `balanceDollars` | number | ドル単位のアカウント残高 |
| `portfolioValueDollars` | number | ドル単位のポートフォリオ価値 |

### `kalshi_get_positions`

Kalshiからオープンポジションを取得

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | はい | あなたのKalshi APIキーID |
| `privateKey` | string | はい | あなたのRSA秘密鍵（PEM形式） |
| `ticker` | string | いいえ | マーケットティッカーでフィルタリング |
| `eventTicker` | string | いいえ | イベントティッカーでフィルタリング（最大10個のカンマ区切り） |
| `settlementStatus` | string | いいえ | 決済ステータスでフィルタリング（all、unsettled、settled）。デフォルト：unsettled |
| `limit` | string | いいえ | 結果の数（1-1000、デフォルト：100） |
| `cursor` | string | いいえ | 次ページのページネーションカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `positions` | array | ポジションオブジェクトの配列 |
| `paging` | object | さらに結果を取得するためのページネーションカーソル |

### `kalshi_get_orders`

オプションのフィルタリングを使用してKalshiから注文を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | はい | あなたのKalshi APIキーID |
| `privateKey` | string | はい | あなたのRSA秘密鍵（PEM形式） |
| `ticker` | string | いいえ | マーケットティッカーでフィルタリング |
| `eventTicker` | string | いいえ | イベントティッカーでフィルタリング（最大10個のカンマ区切り） |
| `status` | string | いいえ | ステータスでフィルタリング（resting、canceled、executed） |
| `limit` | string | いいえ | 結果の数（1-200、デフォルト：100） |
| `cursor` | string | いいえ | 次ページのページネーションカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `orders` | array | 注文オブジェクトの配列 |
| `paging` | object | さらに結果を取得するためのページネーションカーソル |

### `kalshi_get_order`

IDを指定してKalshiから特定の注文の詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | はい | あなたのKalshi APIキーID |
| `privateKey` | string | はい | あなたのRSA秘密鍵（PEM形式） |
| `orderId` | string | はい | 取得する注文ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `order` | object | 詳細情報を含む注文オブジェクト |

### `kalshi_get_orderbook`

特定の市場の注文板（yesとnoの注文）を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `ticker` | string | はい | 市場ティッカー（例：KXBTC-24DEC31） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `orderbook` | object | yes/noの買い注文と売り注文を含むオーダーブック |

### `kalshi_get_trades`

すべての市場の最近の取引を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `limit` | string | いいえ | 結果の数（1-1000、デフォルト：100） |
| `cursor` | string | いいえ | 次のページのページネーションカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `trades` | array | 取引オブジェクトの配列 |
| `paging` | object | さらに結果を取得するためのページネーションカーソル |

### `kalshi_get_candlesticks`

特定の市場のOHLCローソク足データを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `seriesTicker` | string | はい | シリーズティッカー |
| `ticker` | string | はい | 市場ティッカー（例：KXBTC-24DEC31） |
| `startTs` | number | はい | 開始タイムスタンプ（Unix秒） |
| `endTs` | number | はい | 終了タイムスタンプ（Unix秒） |
| `periodInterval` | number | はい | 期間間隔：1（1分）、60（1時間）、または1440（1日） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `candlesticks` | array | OHLC（始値・高値・安値・終値）ローソク足データの配列 |

### `kalshi_get_fills`

あなたのポートフォリオを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | はい | あなたのKalshi APIキーID |
| `privateKey` | string | はい | あなたのRSA秘密鍵（PEM形式） |
| `ticker` | string | いいえ | 市場ティッカーでフィルタリング |
| `orderId` | string | いいえ | 注文IDでフィルタリング |
| `minTs` | number | いいえ | 最小タイムスタンプ（Unixミリ秒） |
| `maxTs` | number | いいえ | 最大タイムスタンプ（Unixミリ秒） |
| `limit` | string | いいえ | 結果の数（1-1000、デフォルト：100） |
| `cursor` | string | いいえ | 次ページのページネーションカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `fills` | array | 約定/取引オブジェクトの配列 |
| `paging` | object | さらに結果を取得するためのページネーションカーソル |

### `kalshi_get_series_by_ticker`

ティッカーで特定の市場シリーズの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `seriesTicker` | string | はい | シリーズティッカー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `series` | object | 詳細を含むシリーズオブジェクト |

### `kalshi_get_exchange_status`

Kalshi取引所の現在のステータス（取引と取引所のアクティビティ）を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `status` | object | trading_activeとexchange_activeフラグを含む取引所ステータス |

### `kalshi_create_order`

Kalshi予測市場に新しい注文を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | はい | あなたのKalshi APIキーID |
| `privateKey` | string | はい | あなたのRSA秘密鍵（PEM形式） |
| `ticker` | string | はい | 市場ティッカー（例：KXBTC-24DEC31） |
| `side` | string | はい | 注文のサイド：'yes'または'no' |
| `action` | string | はい | アクションタイプ：'buy'または'sell' |
| `count` | string | はい | 契約数（最小1） |
| `type` | string | いいえ | 注文タイプ：'limit'または'market'（デフォルト：limit） |
| `yesPrice` | string | いいえ | Yesの価格（セント単位、1-99） |
| `noPrice` | string | いいえ | Noの価格（セント単位、1-99） |
| `yesPriceDollars` | string | いいえ | Yesの価格（ドル単位、例："0.56"） |
| `noPriceDollars` | string | いいえ | Noの価格（ドル単位、例："0.56"） |
| `clientOrderId` | string | いいえ | カスタム注文識別子 |
| `expirationTs` | string | いいえ | 注文有効期限のUnixタイムスタンプ |
| `timeInForce` | string | いいえ | 有効期間：'fill_or_kill'、'good_till_canceled'、'immediate_or_cancel' |
| `buyMaxCost` | string | いいえ | 最大コスト（セント単位、自動的にfill_or_killを有効にする） |
| `postOnly` | string | いいえ | メーカーオンリー注文の場合は'true'に設定 |
| `reduceOnly` | string | いいえ | ポジション削減のみの場合は'true'に設定 |
| `selfTradePreventionType` | string | いいえ | 自己取引防止：'taker_at_cross'または'maker' |
| `orderGroupId` | string | いいえ | 関連する注文グループID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `order` | object | 作成された注文オブジェクト |

### `kalshi_cancel_order`

Kalshiで既存の注文をキャンセルする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | はい | あなたのKalshi APIキーID |
| `privateKey` | string | はい | あなたのRSA秘密鍵（PEM形式） |
| `orderId` | string | はい | キャンセルする注文ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `order` | object | キャンセルされた注文オブジェクト |
| `reducedBy` | number | キャンセルされた契約数 |

### `kalshi_amend_order`

Kalshiで既存の注文の価格または数量を変更する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `keyId` | string | はい | あなたのKalshi APIキーID |
| `privateKey` | string | はい | あなたのRSA秘密鍵（PEM形式） |
| `orderId` | string | はい | 変更する注文ID |
| `ticker` | string | はい | マーケットティッカー |
| `side` | string | はい | 注文のサイド：'yes'または'no' |
| `action` | string | はい | アクションタイプ：'buy'または'sell' |
| `clientOrderId` | string | はい | クライアントが指定した元の注文ID |
| `updatedClientOrderId` | string | はい | 変更後のクライアントが指定した新しい注文ID |
| `count` | string | いいえ | 注文の更新された数量 |
| `yesPrice` | string | いいえ | 更新されたyes価格（セント単位、1-99） |
| `noPrice` | string | いいえ | 更新されたno価格（セント単位、1-99） |
| `yesPriceDollars` | string | いいえ | 更新されたyes価格（ドル単位、例："0.56"） |
| `noPriceDollars` | string | いいえ | 更新されたno価格（ドル単位、例："0.56"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `order` | object | 変更された注文オブジェクト |

## 注意事項

- カテゴリー: `tools`
- タイプ: `kalshi`
```

--------------------------------------------------------------------------------

````
