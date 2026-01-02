---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 211
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 211 of 933)

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

---[FILE: rds.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/rds.mdx

```text
---
title: Amazon RDS
description: Data APIを通じてAmazon RDSに接続
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="rds"
  color="linear-gradient(45deg, #2E27AD 0%, #527FFF 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon RDS Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/)は、アプリケーションのニーズに基づいて自動的に起動、シャットダウン、容量のスケーリングを行う完全マネージド型のリレーショナルデータベースです。データベースサーバーを管理することなく、クラウドでSQLデータベースを実行できます。

RDS Aurora Serverlessでは、以下のことが可能です：

- **データのクエリ**: テーブル間で柔軟なSQLクエリを実行
- **新しいレコードの挿入**: データベースに自動的にデータを追加
- **既存レコードの更新**: カスタムフィルターを使用してテーブル内のデータを変更
- **レコードの削除**: 正確な条件を使用して不要なデータを削除
- **生のSQLの実行**: Auroraでサポートされている有効なSQLコマンドを実行

Simでは、RDS統合により、エージェントがAmazon Aurora Serverlessデータベースを安全かつプログラム的に操作できるようになります。サポートされている操作には以下が含まれます：

- **クエリ**: SELECTやその他のSQLクエリを実行してデータベースから行を取得
- **挿入**: 構造化データを使用してテーブルに新しいレコードを挿入
- **更新**: 指定した条件に一致する行のデータを変更
- **削除**: カスタムフィルターや条件によってテーブルからレコードを削除
- **実行**: 高度なシナリオ向けに生のSQLを実行

この統合により、エージェントは手動介入なしに幅広いデータベース操作を自動化できます。SimとAmazon RDSを接続することで、ワークフロー内でリレーショナルデータを管理、更新、取得するエージェントを構築できます—すべてデータベースインフラストラクチャや接続を扱うことなく実現できます。
{/* MANUAL-CONTENT-END */}

## 使用手順

Data APIを使用してAmazon RDS Aurora Serverlessをワークフローに統合します。データベース接続を管理することなく、クエリ、挿入、更新、削除、生のSQLの実行が可能です。

## ツール

### `rds_query`

Data APIを使用してAmazon RDSでSELECTクエリを実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `accessKeyId` | string | はい | AWSアクセスキーID |
| `secretAccessKey` | string | はい | AWSシークレットアクセスキー |
| `resourceArn` | string | はい | Aurora DBクラスターのARN |
| `secretArn` | string | はい | DB認証情報を含むSecrets ManagerシークレットのARN |
| `database` | string | いいえ | データベース名（オプション） |
| `query` | string | はい | 実行するSQL SELECTクエリ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | クエリから返された行の配列 |
| `rowCount` | number | 返された行数 |

### `rds_insert`

Data APIを使用してAmazon RDSテーブルにデータを挿入する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `accessKeyId` | string | はい | AWSアクセスキーID |
| `secretAccessKey` | string | はい | AWSシークレットアクセスキー |
| `resourceArn` | string | はい | Aurora DBクラスターのARN |
| `secretArn` | string | はい | DB認証情報を含むSecrets ManagerシークレットのARN |
| `database` | string | いいえ | データベース名（オプション） |
| `table` | string | はい | 挿入先のテーブル名 |
| `data` | object | はい | キーと値のペアとして挿入するデータ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | 挿入された行の配列 |
| `rowCount` | number | 挿入された行数 |

### `rds_update`

Data APIを使用してAmazon RDSテーブルのデータを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `accessKeyId` | string | はい | AWSアクセスキーID |
| `secretAccessKey` | string | はい | AWSシークレットアクセスキー |
| `resourceArn` | string | はい | Aurora DBクラスターのARN |
| `secretArn` | string | はい | DB認証情報を含むSecrets ManagerシークレットのARN |
| `database` | string | いいえ | データベース名（オプション） |
| `table` | string | はい | 更新するテーブル名 |
| `data` | object | はい | キーと値のペアとして更新するデータ |
| `conditions` | object | はい | 更新の条件（例：`{"id": 1}`) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | 更新された行の配列 |
| `rowCount` | number | 更新された行数 |

### `rds_delete`

Data APIを使用してAmazon RDSテーブルからデータを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `region` | string | はい | AWS リージョン（例：us-east-1） |
| `accessKeyId` | string | はい | AWS アクセスキーID |
| `secretAccessKey` | string | はい | AWS シークレットアクセスキー |
| `resourceArn` | string | はい | Aurora DBクラスターのARN |
| `secretArn` | string | はい | DB認証情報を含むSecrets ManagerシークレットのARN |
| `database` | string | いいえ | データベース名（オプション） |
| `table` | string | はい | 削除対象のテーブル名 |
| `conditions` | object | はい | 削除条件（例：`{"id": 1}`) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | 削除された行の配列 |
| `rowCount` | number | 削除された行数 |

### `rds_execute`

Data APIを使用してAmazon RDSで生のSQLを実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `region` | string | はい | AWS リージョン（例：us-east-1） |
| `accessKeyId` | string | はい | AWS アクセスキーID |
| `secretAccessKey` | string | はい | AWS シークレットアクセスキー |
| `resourceArn` | string | はい | Aurora DBクラスターのARN |
| `secretArn` | string | はい | DB認証情報を含むSecrets ManagerシークレットのARN |
| `database` | string | いいえ | データベース名（オプション） |
| `query` | string | はい | 実行する生のSQLクエリ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | 返却または影響を受けた行の配列 |
| `rowCount` | number | 影響を受けた行数 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `rds`
```

--------------------------------------------------------------------------------

---[FILE: reddit.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/reddit.mdx

```text
---
title: Reddit
description: Redditのデータとコンテンツにアクセス
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="reddit"
  color="#FF5700"
/>

{/* MANUAL-CONTENT-START:intro */}
[Reddit](https://www.reddit.com/)は、サブレディットと呼ばれるトピックベースのコミュニティでユーザーがコンテンツを共有し議論するソーシャルプラットフォームです。

Simでは、Redditインテグレーションを使用して以下のことができます：

- **投稿の取得**: 任意のサブレディットから投稿を取得し、並べ替え（人気、新着、トップ、急上昇）やトップ投稿の時間フィルター（日、週、月、年、全期間）のオプションがあります。
- **コメントの取得**: 特定の投稿からコメントを取得し、並べ替えやコメント数の設定オプションがあります。

これらの操作により、エージェントは自動化されたワークフローの一部としてRedditのコンテンツにアクセスして分析することができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Redditをワークフローに統合します。投稿、コメントの閲覧、コンテンツの検索が可能です。投稿の作成、投票、返信、編集、Redditアカウントの管理ができます。

## ツール

### `reddit_get_posts`

さまざまな並べ替えオプションでサブレディットから投稿を取得します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | はい | 投稿を取得するサブレディットの名前（r/プレフィックスなし） |
| `sort` | string | いいえ | 投稿の並べ替え方法："hot"、"new"、"top"、または"rising"（デフォルト："hot"） |
| `limit` | number | いいえ | 返される投稿の最大数（デフォルト：10、最大：100） |
| `time` | string | いいえ | "top"で並べ替えた投稿の時間フィルター："day"、"week"、"month"、"year"、または"all"（デフォルト："day"） |
| `after` | string | いいえ | この後のアイテムを取得するためのフルネーム（ページネーション用） |
| `before` | string | いいえ | この前のアイテムを取得するためのフルネーム（ページネーション用） |
| `count` | number | いいえ | すでに表示されたアイテムの数（番号付けに使用） |
| `show` | string | いいえ | 通常フィルタリングされるアイテムを表示（例："all"） |
| `sr_detail` | boolean | いいえ | レスポンスにサブレディットの詳細を展開する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `subreddit` | string | 投稿が取得されたサブレディットの名前 |
| `posts` | array | タイトル、作成者、URL、スコア、コメント数、およびメタデータを含む投稿の配列 |

### `reddit_get_comments`

特定のReddit投稿からコメントを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `postId` | string | はい | コメントを取得するReddit投稿のID |
| `subreddit` | string | はい | 投稿があるサブレディット（r/プレフィックスなし） |
| `sort` | string | いいえ | コメントの並べ替え方法："confidence"、"top"、"new"、"controversial"、"old"、"random"、"qa"（デフォルト："confidence"） |
| `limit` | number | いいえ | 返されるコメントの最大数（デフォルト：50、最大：100） |
| `depth` | number | いいえ | スレッド内のサブツリーの最大深度（ネストされたコメントレベルを制御） |
| `context` | number | いいえ | 含める親コメントの数 |
| `showedits` | boolean | いいえ | コメントの編集情報を表示 |
| `showmore` | boolean | いいえ | レスポンスに「さらにコメントを読み込む」要素を含める |
| `showtitle` | boolean | いいえ | レスポンスに投稿タイトルを含める |
| `threaded` | boolean | いいえ | コメントをスレッド/ネスト形式で返す |
| `truncate` | number | いいえ | コメントの深さを切り詰める整数 |
| `after` | string | いいえ | この後のアイテムを取得するためのフルネーム（ページネーション用） |
| `before` | string | いいえ | この前のアイテムを取得するためのフルネーム（ページネーション用） |
| `count` | number | いいえ | すでに表示されたアイテムの数（番号付けに使用） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `post` | object | ID、タイトル、作成者、コンテンツ、メタデータを含む投稿情報 |

### `reddit_get_controversial`

サブレディットから議論を呼んでいる投稿を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | はい | 投稿を取得するサブレディットの名前（r/プレフィックスなし） |
| `time` | string | いいえ | 議論を呼んでいる投稿の時間フィルター：「hour」、「day」、「week」、「month」、「year」、または「all」（デフォルト：「all」） |
| `limit` | number | いいえ | 返す投稿の最大数（デフォルト：10、最大：100） |
| `after` | string | いいえ | ページネーションのために、これより後のアイテムを取得するための完全名 |
| `before` | string | いいえ | ページネーションのために、これより前のアイテムを取得するための完全名 |
| `count` | number | いいえ | リスティングですでに見たアイテムの数（番号付けに使用） |
| `show` | string | いいえ | 通常はフィルタリングされるアイテムを表示（例：「all」） |
| `sr_detail` | boolean | いいえ | レスポンスでサブレディットの詳細を展開する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `subreddit` | string | 投稿が取得されたサブレディットの名前 |
| `posts` | array | タイトル、作成者、URL、スコア、コメント数、およびメタデータを含む議論を呼んでいる投稿の配列 |

### `reddit_search`

サブレディット内の投稿を検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | はい | 検索するサブレディットの名前（r/プレフィックスなし） |
| `query` | string | はい | 検索クエリテキスト |
| `sort` | string | いいえ | 検索結果の並べ替え方法：「relevance」、「hot」、「top」、「new」、または「comments」（デフォルト：「relevance」） |
| `time` | string | いいえ | 検索結果の時間フィルター：「hour」、「day」、「week」、「month」、「year」、または「all」（デフォルト：「all」） |
| `limit` | number | いいえ | 返す投稿の最大数（デフォルト：10、最大：100） |
| `restrict_sr` | boolean | いいえ | 指定されたサブレディットのみに検索を制限する（デフォルト：true） |
| `after` | string | いいえ | ページネーションのために、この項目の後のアイテムを取得するためのフルネーム |
| `before` | string | いいえ | ページネーションのために、この項目の前のアイテムを取得するためのフルネーム |
| `count` | number | いいえ | リスティングですでに見たアイテムの数（番号付けに使用） |
| `show` | string | いいえ | 通常フィルタリングされるアイテムを表示する（例：「all」） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `subreddit` | string | 検索が実行されたサブレディットの名前 |
| `posts` | array | タイトル、作成者、URL、スコア、コメント数、およびメタデータを含む検索結果投稿の配列 |

### `reddit_submit_post`

サブレディットに新しい投稿を送信する（テキストまたはリンク）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | はい | 投稿先のサブレディットの名前（r/プレフィックスなし） |
| `title` | string | はい | 投稿のタイトル（最大300文字） |
| `text` | string | いいえ | 自己投稿用のテキストコンテンツ（マークダウン対応） |
| `url` | string | いいえ | リンク投稿用のURL（テキストと併用不可） |
| `nsfw` | boolean | いいえ | 投稿をNSFWとしてマークする |
| `spoiler` | boolean | いいえ | 投稿をスポイラーとしてマークする |
| `send_replies` | boolean | いいえ | 返信通知を受信トレイに送信する（デフォルト：true） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 投稿が正常に送信されたかどうか |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | ID、名前、URL、パーマリンクを含む投稿データ |

### `reddit_vote`

Redditの投稿やコメントに対して賛成投票、反対投票、または投票取り消しを行う

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `id` | string | はい | 投票対象の完全名（例：投稿の場合はt3_xxxxx、コメントの場合はt1_xxxxx） |
| `dir` | number | はい | 投票方向：1（賛成）、0（投票取り消し）、または-1（反対） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 投票が成功したかどうか |
| `message` | string | 成功またはエラーメッセージ |

### `reddit_save`

Redditの投稿やコメントを保存アイテムに保存する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `id` | string | はい | 保存する対象の完全名（例：投稿の場合はt3_xxxxx、コメントの場合はt1_xxxxx） |
| `category` | string | いいえ | 保存するカテゴリ（Reddit Goldの機能） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 保存が成功したかどうか |
| `message` | string | 成功またはエラーメッセージ |

### `reddit_unsave`

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `subreddit` | string | サブレディット名 |
| `posts` | json | 投稿データ |
| `post` | json | 単一投稿データ |
| `comments` | json | コメントデータ |

### `reddit_reply`

Redditの投稿やコメントにコメント返信を追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `parent_id` | string | はい | 返信する対象の完全名（例：投稿の場合はt3_xxxxx、コメントの場合はt1_xxxxx） |
| `text` | string | はい | マークダウン形式のコメントテキスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 返信が正常に投稿されたかどうか |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | ID、名前、パーマリンク、本文を含むコメントデータ |

### `reddit_edit`

自分のReddit投稿やコメントのテキストを編集する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `thing_id` | string | はい | 編集する対象の完全名（例：投稿の場合はt3_xxxxx、コメントの場合はt1_xxxxx） |
| `text` | string | はい | マークダウン形式の新しいテキストコンテンツ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 編集が成功したかどうか |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 更新されたコンテンツデータ |

### `reddit_delete`

自分のReddit投稿やコメントを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `id` | string | はい | 削除する対象の完全名（例：投稿の場合はt3_xxxxx、コメントの場合はt1_xxxxx） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 削除が成功したかどうか |
| `message` | string | 成功またはエラーメッセージ |

### `reddit_subscribe`

サブレディットを購読または購読解除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `subreddit` | string | はい | サブレディットの名前（r/プレフィックスなし） |
| `action` | string | はい | 実行するアクション：購読する場合は「sub」、購読解除する場合は「unsub」 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | サブスクリプション操作が成功したかどうか |
| `message` | string | 成功またはエラーメッセージ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `reddit`
```

--------------------------------------------------------------------------------

---[FILE: resend.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/resend.mdx

```text
---
title: Resend
description: Resendでメールを送信。
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="resend"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Resend](https://resend.com/)は、開発者がトランザクションメールやマーケティングメールを簡単に送信できるように設計された最新のメールサービスです。シンプルで信頼性の高いAPIとダッシュボードを提供し、メール配信、テンプレート、分析を管理できるため、アプリケーションやワークフローにメール機能を統合するための人気の選択肢となっています。

Resendでは以下のことが可能です：

- **トランザクションメールの送信**: パスワードリセット、通知、確認メールなどを高い配信率で送信
- **テンプレート管理**: 一貫したブランディングとメッセージングのためのメールテンプレートを作成・更新
- **分析の追跡**: 配信率、開封率、クリック率を監視してメールパフォーマンスを最適化
- **簡単な統合**: わかりやすいAPIとSDKを使用してアプリケーションとシームレスに統合
- **セキュリティの確保**: 堅牢な認証とドメイン検証によりメールの信頼性を保護

Simでは、Resend統合によりエージェントがプログラムでメールを送信し、自動化されたワークフローの一部として活用できます。これにより、通知、アラート、カスタムメッセージをSim搭載エージェントから直接送信するようなユースケースが可能になります。SimとResendを連携することで、コミュニケーションタスクを自動化し、手動介入なしでタイムリーかつ確実なメール配信を実現できます。この統合はResend APIキーを活用し、認証情報を安全に保ちながら強力なメール自動化シナリオを実現します。
{/* MANUAL-CONTENT-END */}

## 使用方法

Resendをワークフローに統合します。メールを送信できます。APIキーが必要です。

## ツール

### `resend_send`

あなた自身のResend APIキーと送信元アドレスを使用してメールを送信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `fromAddress` | string | はい | 送信元メールアドレス |
| `to` | string | はい | 受信者メールアドレス |
| `subject` | string | はい | メールの件名 |
| `body` | string | はい | メール本文 |
| `contentType` | string | いいえ | メール本文のコンテンツタイプ（テキストまたはHTML） |
| `resendApiKey` | string | はい | メール送信用のResend APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メールが正常に送信されたかどうか |
| `to` | string | 受信者メールアドレス |
| `subject` | string | メールの件名 |
| `body` | string | メール本文 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `resend`
```

--------------------------------------------------------------------------------

---[FILE: s3.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/s3.mdx

```text
---
title: S3
description: S3ファイルのアップロード、ダウンロード、一覧表示、管理
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="s3"
  color="linear-gradient(45deg, #1B660F 0%, #6CAE3E 100%)"
/>

{/* MANUAL-CONTENT-START:intro */}
[Amazon S3](https://aws.amazon.com/s3/)はAmazon Web Servicesが提供する高度にスケーラブルで安全、かつ耐久性のあるクラウドストレージサービスです。ウェブ上のどこからでも任意の量のデータを保存および取得できるように設計されており、あらゆる規模のビジネスで最も広く使用されているクラウドストレージソリューションの一つです。

Amazon S3では以下のことが可能です：

- **無制限のデータ保存**: 事実上無制限のストレージ容量で、あらゆるサイズと種類のファイルをアップロード
- **どこからでもアクセス**: 世界中のどこからでも低レイテンシーでファイルを取得
- **データの耐久性を確保**: 自動データレプリケーションによる99.999999999%（11個の9）の耐久性
- **アクセス制御**: きめ細かいセキュリティポリシーによるアクセス権限の管理
- **自動スケーリング**: 手動介入や容量計画なしに変動するワークロードに対応
- **シームレスな統合**: 他のAWSサービスやサードパーティアプリケーションと簡単に連携
- **コスト最適化**: アクセスパターンに基づいて複数のストレージクラスから選択し、コストを最適化

Simでは、S3統合によりエージェントがAmazon S3バケットに保存されたファイルを安全な署名付きURLを使用して取得・アクセスできるようになります。これにより、ドキュメント処理、保存データの分析、設定ファイルの取得、ワークフローの一部としてのメディアコンテンツへのアクセスなど、強力な自動化シナリオが可能になります。エージェントはAWS認証情報を公開することなくS3からファイルを安全に取得できるため、クラウドに保存されたアセットを自動化プロセスに簡単に組み込むことができます。この統合により、クラウドストレージとAIワークフローの間のギャップが埋められ、AWSの堅牢な認証メカニズムによるセキュリティのベストプラクティスを維持しながら、保存データへのシームレスなアクセスが可能になります。
{/* MANUAL-CONTENT-END */}

## 使用手順

S3をワークフローに統合します。ファイルのアップロード、オブジェクトのダウンロード、バケットの内容一覧表示、オブジェクトの削除、バケット間でのオブジェクトのコピーが可能です。AWSアクセスキーとシークレットアクセスキーが必要です。

## ツール

### `s3_put_object`

AWS S3バケットにファイルをアップロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | はい | AWSアクセスキーID |
| `secretAccessKey` | string | はい | AWSシークレットアクセスキー |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `bucketName` | string | はい | S3バケット名 |
| `objectKey` | string | はい | S3内のオブジェクトキー/パス（例：folder/filename.ext） |
| `file` | file | いいえ | アップロードするファイル |
| `content` | string | いいえ | アップロードするテキストコンテンツ（ファイルの代わり） |
| `contentType` | string | いいえ | Content-Typeヘッダー（指定がない場合はファイルから自動検出） |
| `acl` | string | いいえ | アクセスコントロールリスト（例：private, public-read） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `url` | string | アップロードされたS3オブジェクトのURL |
| `metadata` | object | ETagと場所を含むアップロードメタデータ |

### `s3_get_object`

AWS S3バケットからオブジェクトを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | はい | AWSアクセスキーID |
| `secretAccessKey` | string | はい | AWSシークレットアクセスキー |
| `s3Uri` | string | はい | S3オブジェクトURL |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `url` | string | S3オブジェクトをダウンロードするための署名付きURL |
| `metadata` | object | タイプ、サイズ、名前、最終更新日を含むファイルメタデータ |

### `s3_list_objects`

AWS S3バケット内のオブジェクトを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | はい | AWS アクセスキーID |
| `secretAccessKey` | string | はい | AWS シークレットアクセスキー |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `bucketName` | string | はい | S3バケット名 |
| `prefix` | string | いいえ | オブジェクトをフィルタリングするプレフィックス（例：folder/） |
| `maxKeys` | number | いいえ | 返すオブジェクトの最大数（デフォルト：1000） |
| `continuationToken` | string | いいえ | ページネーション用トークン |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `objects` | array | S3オブジェクトのリスト |

### `s3_delete_object`

AWS S3バケットからオブジェクトを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | はい | AWS アクセスキーID |
| `secretAccessKey` | string | はい | AWS シークレットアクセスキー |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `bucketName` | string | はい | S3バケット名 |
| `objectKey` | string | はい | 削除するオブジェクトのキー/パス |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | オブジェクトが正常に削除されたかどうか |
| `metadata` | object | 削除メタデータ |

### `s3_copy_object`

AWS S3バケット内または異なるバケット間でオブジェクトをコピーする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `accessKeyId` | string | はい | AWS アクセスキーID |
| `secretAccessKey` | string | はい | AWS シークレットアクセスキー |
| `region` | string | はい | AWSリージョン（例：us-east-1） |
| `sourceBucket` | string | はい | ソースバケット名 |
| `sourceKey` | string | はい | ソースオブジェクトのキー/パス |
| `destinationBucket` | string | はい | 宛先バケット名 |
| `destinationKey` | string | はい | 宛先オブジェクトのキー/パス |
| `acl` | string | いいえ | コピーされたオブジェクトのアクセス制御リスト（例：private、public-read） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `url` | string | コピーされたS3オブジェクトのURL |
| `metadata` | object | コピー操作のメタデータ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `s3`
```

--------------------------------------------------------------------------------

---[FILE: salesforce.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/salesforce.mdx

```text
---
title: Salesforce
description: Salesforce CRMとの連携
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="salesforce"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Salesforce](https://www.salesforce.com/)ツールを使用すると、SalesforceのCRMに直接接続し、エージェントワークフロー内で幅広い顧客関係管理操作を実行できます。シームレスで安全な統合により、営業、サポート、マーケティングデータ全体の主要なビジネスプロセスに効率的にアクセスし、自動化することができます。

Salesforceツールでは、以下のことが可能です：

- **アカウントの取得**: `salesforce_get_accounts`操作を使用して、カスタムフィルター、ソート、フィールド選択でSalesforceからアカウントを取得します。
- **アカウントの作成**: `salesforce_create_account`操作を使用して、名前、業種、請求先住所などの詳細を指定して、新しいアカウントをSalesforceに自動的に追加します。
- **連絡先の管理**: （提供されている場合、連絡先の追加、更新、または取得に利用できる同様のツール）
- **リードと商談の管理**: リードと商談の管理をワークフローに統合し、エージェントが販売パイプラインデータをキャプチャ、評価、更新できるようにします。
- **ケースとタスクの追跡**: Salesforce内のケースとタスクを操作することで、カスタマーサポートとフォローアップ活動を自動化します。

Salesforceツールは、エージェントが販売、アカウント管理、リード生成、サポート業務を効率化する必要があるワークフローに最適です。エージェントがプラットフォーム間でデータを同期する場合でも、リアルタイムの顧客インサイトを提供する場合でも、定期的なCRM更新を自動化する場合でも、Salesforceツールは、プログラム的なエージェント駆動プロセスにSalesforceの完全なパワーと拡張性をもたらします。
{/* MANUAL-CONTENT-END */}

## 使用方法

Salesforceをワークフローに統合します。強力な自動化機能でアカウント、連絡先、リード、商談、ケース、タスクを管理します。

## ツール

### `salesforce_get_accounts`

Salesforce CRMからアカウントを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | Salesforce OAuth からの ID トークン（インスタンス URL を含む） |
| `instanceUrl` | string | いいえ | Salesforce インスタンス URL |
| `limit` | string | いいえ | 返す結果の数（デフォルト：100、最大：2000） |
| `fields` | string | いいえ | 返すフィールドのカンマ区切りリスト（例："Id,Name,Industry,Phone"） |
| `orderBy` | string | いいえ | 並べ替えるフィールド（例："Name ASC" または "CreatedDate DESC"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | アカウントデータ |

### `salesforce_create_account`

Salesforce CRMに新しいアカウントを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `name` | string | はい | アカウント名（必須） |
| `type` | string | いいえ | アカウントタイプ（例：顧客、パートナー、見込み客） |
| `industry` | string | いいえ | 業種（例：テクノロジー、ヘルスケア、金融） |
| `phone` | string | いいえ | 電話番号 |
| `website` | string | いいえ | ウェブサイトURL |
| `billingStreet` | string | いいえ | 請求先住所 |
| `billingCity` | string | いいえ | 請求先市区町村 |
| `billingState` | string | いいえ | 請求先都道府県 |
| `billingPostalCode` | string | いいえ | 請求先郵便番号 |
| `billingCountry` | string | いいえ | 請求先国 |
| `description` | string | いいえ | アカウントの説明 |
| `annualRevenue` | string | いいえ | 年間売上（数値） |
| `numberOfEmployees` | string | いいえ | 従業員数（数値） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 作成されたアカウントデータ |

### `salesforce_update_account`

Salesforce CRMの既存アカウントを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `accountId` | string | はい | 更新するアカウントID（必須） |
| `name` | string | いいえ | アカウント名 |
| `type` | string | いいえ | アカウントタイプ |
| `industry` | string | いいえ | 業種 |
| `phone` | string | いいえ | 電話番号 |
| `website` | string | いいえ | ウェブサイトURL |
| `billingStreet` | string | いいえ | 請求先住所 |
| `billingCity` | string | いいえ | 請求先市区町村 |
| `billingState` | string | いいえ | 請求先都道府県 |
| `billingPostalCode` | string | いいえ | 請求先郵便番号 |
| `billingCountry` | string | いいえ | 請求先国 |
| `description` | string | いいえ | アカウントの説明 |
| `annualRevenue` | string | いいえ | 年間売上（数値） |
| `numberOfEmployees` | string | いいえ | 従業員数（数値） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 更新されたアカウントデータ |

### `salesforce_delete_account`

Salesforce CRMからアカウントを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `accountId` | string | はい | 削除するアカウントID（必須） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 削除されたアカウントデータ |

### `salesforce_get_contacts`

Salesforceから取引先責任者を取得 - IDが提供されている場合は単一の取引先責任者、そうでない場合はリスト

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `contactId` | string | いいえ | 取引先責任者ID（提供されている場合、単一の取引先責任者を返す） |
| `limit` | string | いいえ | 結果の数（デフォルト：100、最大：2000）。リストクエリの場合のみ。 |
| `fields` | string | いいえ | カンマ区切りのフィールド（例："Id,FirstName,LastName,Email,Phone"） |
| `orderBy` | string | いいえ | 並べ替えるフィールド（例："LastName ASC"）。リストクエリの場合のみ。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 取引先責任者データ |

### `salesforce_create_contact`

Salesforce CRMに新しい取引先責任者を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `lastName` | string | はい | 姓（必須） |
| `firstName` | string | いいえ | 名 |
| `email` | string | いいえ | メールアドレス |
| `phone` | string | いいえ | 電話番号 |
| `accountId` | string | いいえ | 関連付ける取引先ID |
| `title` | string | いいえ | 説明なし |
| `department` | string | いいえ | 部署 |
| `mailingStreet` | string | いいえ | 郵送先住所 |
| `mailingCity` | string | いいえ | 郵送先市区町村 |
| `mailingState` | string | いいえ | 郵送先都道府県 |
| `mailingPostalCode` | string | いいえ | 郵送先郵便番号 |
| `mailingCountry` | string | いいえ | 郵送先国 |
| `description` | string | いいえ | 取引先責任者の説明 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 作成された取引先責任者データ |

### `salesforce_update_contact`

Salesforce CRMの既存の取引先責任者を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `contactId` | string | はい | 更新する取引先責任者ID（必須） |
| `lastName` | string | いいえ | 姓 |
| `firstName` | string | いいえ | 名 |
| `email` | string | いいえ | メールアドレス |
| `phone` | string | いいえ | 電話番号 |
| `accountId` | string | いいえ | 関連付けるアカウントID |
| `title` | string | いいえ | 説明なし |
| `department` | string | いいえ | 部署 |
| `mailingStreet` | string | いいえ | 郵送先住所 |
| `mailingCity` | string | いいえ | 郵送先市区町村 |
| `mailingState` | string | いいえ | 郵送先都道府県 |
| `mailingPostalCode` | string | いいえ | 郵送先郵便番号 |
| `mailingCountry` | string | いいえ | 郵送先国 |
| `description` | string | いいえ | 説明 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 更新された取引先責任者データ |

### `salesforce_delete_contact`

Salesforce CRMから取引先責任者を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `contactId` | string | はい | 削除する取引先責任者ID（必須） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 削除された取引先責任者データ |

### `salesforce_get_leads`

Salesforceからリードを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `leadId` | string | いいえ | リードID（オプション） |
| `limit` | string | いいえ | 最大結果数（デフォルト：100） |
| `fields` | string | いいえ | カンマ区切りフィールド |
| `orderBy` | string | いいえ | 並べ替えフィールド |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | リードデータ |

### `salesforce_create_lead`

新しいリードを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `lastName` | string | はい | 姓（必須） |
| `company` | string | はい | 会社名（必須） |
| `firstName` | string | いいえ | 名 |
| `email` | string | いいえ | 説明なし |
| `phone` | string | いいえ | 説明なし |
| `status` | string | いいえ | リードステータス |
| `leadSource` | string | いいえ | リードソース |
| `title` | string | いいえ | 説明なし |
| `description` | string | いいえ | 説明 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 作成されたリード |

### `salesforce_update_lead`

既存のリードを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `leadId` | string | はい | リードID（必須） |
| `lastName` | string | いいえ | 姓 |
| `company` | string | いいえ | 説明なし |
| `firstName` | string | いいえ | 名 |
| `email` | string | いいえ | 説明なし |
| `phone` | string | いいえ | 説明なし |
| `status` | string | いいえ | リードステータス |
| `leadSource` | string | いいえ | リードソース |
| `title` | string | いいえ | 説明なし |
| `description` | string | いいえ | 説明 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 更新されたリード |

### `salesforce_delete_lead`

リードを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `leadId` | string | はい | リードID（必須） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 削除されたリード |

### `salesforce_get_opportunities`

Salesforceから商談を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `opportunityId` | string | いいえ | 商談ID（オプション） |
| `limit` | string | いいえ | 最大結果数（デフォルト：100） |
| `fields` | string | いいえ | カンマ区切りのフィールド |
| `orderBy` | string | いいえ | 並べ替えフィールド |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 商談データ |

### `salesforce_create_opportunity`

新しい商談を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `name` | string | はい | 商談名（必須） |
| `stageName` | string | はい | ステージ名（必須） |
| `closeDate` | string | はい | 完了予定日 YYYY-MM-DD（必須） |
| `accountId` | string | いいえ | アカウントID |
| `amount` | string | いいえ | 金額（数値） |
| `probability` | string | いいえ | 確度（0-100） |
| `description` | string | いいえ | 説明 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 作成された商談 |

### `salesforce_update_opportunity`

既存の商談を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `opportunityId` | string | はい | 商談ID（必須） |
| `name` | string | いいえ | 商談名 |
| `stageName` | string | いいえ | ステージ名 |
| `closeDate` | string | いいえ | 完了予定日 YYYY-MM-DD |
| `accountId` | string | いいえ | アカウントID |
| `amount` | string | いいえ | 説明なし |
| `probability` | string | いいえ | 確度（0-100） |
| `description` | string | いいえ | 説明 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 更新された商談 |

### `salesforce_delete_opportunity`

商談を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `opportunityId` | string | はい | 商談ID（必須） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 削除された商談 |

### `salesforce_get_cases`

Salesforceからケースを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `caseId` | string | いいえ | ケースID（任意） |
| `limit` | string | いいえ | 最大結果数（デフォルト：100） |
| `fields` | string | いいえ | カンマ区切りフィールド |
| `orderBy` | string | いいえ | 並べ替えフィールド |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | ケースデータ |

### `salesforce_create_case`

新しいケースを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `subject` | string | はい | ケース件名（必須） |
| `status` | string | いいえ | ステータス（例：新規、対応中、エスカレーション） |
| `priority` | string | いいえ | 優先度（例：低、中、高） |
| `origin` | string | いいえ | 発生源（例：電話、メール、ウェブ） |
| `contactId` | string | いいえ | 取引先責任者ID |
| `accountId` | string | いいえ | 取引先ID |
| `description` | string | いいえ | 説明 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 作成されたケース |

### `salesforce_update_case`

既存のケースを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `caseId` | string | はい | ケースID（必須） |
| `subject` | string | いいえ | ケース件名 |
| `status` | string | いいえ | ステータス |
| `priority` | string | いいえ | 優先度 |
| `description` | string | いいえ | 説明 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 更新されたケース |

### `salesforce_delete_case`

ケースを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `caseId` | string | はい | ケースID（必須） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 削除されたケース |

### `salesforce_get_tasks`

Salesforceからタスクを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `taskId` | string | いいえ | タスクID（オプション） |
| `limit` | string | いいえ | 最大結果数（デフォルト：100） |
| `fields` | string | いいえ | カンマ区切りのフィールド |
| `orderBy` | string | いいえ | 並べ替えフィールド |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | タスクデータ |

### `salesforce_create_task`

新しいタスクを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `subject` | string | はい | タスク件名（必須） |
| `status` | string | いいえ | ステータス（例：未開始、進行中、完了） |
| `priority` | string | いいえ | 優先度（例：低、普通、高） |
| `activityDate` | string | いいえ | 期日 YYYY-MM-DD |
| `whoId` | string | いいえ | 関連する取引先責任者/リードID |
| `whatId` | string | いいえ | 関連する取引先/商談ID |
| `description` | string | いいえ | 説明 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 作成されたタスク |

### `salesforce_update_task`

既存のタスクを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `taskId` | string | はい | タスクID（必須） |
| `subject` | string | いいえ | タスク件名 |
| `status` | string | いいえ | ステータス |
| `priority` | string | いいえ | 優先度 |
| `activityDate` | string | いいえ | 期日 YYYY-MM-DD |
| `description` | string | いいえ | 説明 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 更新されたタスク |

### `salesforce_delete_task`

タスクを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `taskId` | string | はい | タスクID（必須） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功 |
| `output` | object | 削除されたタスク |

### `salesforce_list_reports`

現在のユーザーがアクセスできるレポートのリストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `folderName` | string | いいえ | フォルダ名でフィルタリング |
| `searchTerm` | string | いいえ | 名前でレポートをフィルタリングする検索語 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 成功ステータス |
| `output` | object | レポートデータ |

### `salesforce_get_report`

特定のレポートのメタデータと説明情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `reportId` | string | はい | レポートID（必須） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | レポートメタデータ |

### `salesforce_run_report`

レポートを実行して結果を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `reportId` | string | はい | レポートID（必須） |
| `includeDetails` | string | いいえ | 詳細行を含める（true/false、デフォルト：true） |
| `filters` | string | いいえ | 適用するレポートフィルターのJSON文字列 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | レポート結果 |

### `salesforce_list_report_types`

利用可能なレポートタイプの一覧を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | レポートタイプデータ |

### `salesforce_list_dashboards`

現在のユーザーがアクセスできるダッシュボードの一覧を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `folderName` | string | いいえ | フォルダ名でフィルタリング |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | ダッシュボードデータ |

### `salesforce_get_dashboard`

特定のダッシュボードの詳細と結果を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `dashboardId` | string | はい | ダッシュボードID（必須） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | ダッシュボードデータ |

### `salesforce_refresh_dashboard`

最新データを取得するためにダッシュボードを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `dashboardId` | string | はい | ダッシュボードID（必須） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 更新されたダッシュボードデータ |

### `salesforce_query`

Salesforceからデータを取得するためのカスタムSOQLクエリを実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `query` | string | はい | 実行するSOQLクエリ（例：SELECT Id, Name FROM Account LIMIT 10） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | クエリ結果 |

### `salesforce_query_more`

前回のクエリからnextRecordsUrlを使用して追加のクエリ結果を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `nextRecordsUrl` | string | はい | 前回のクエリレスポンスからのnextRecordsUrl |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | クエリ結果 |

### `salesforce_describe_object`

Salesforceオブジェクトのメタデータとフィールド情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |
| `objectName` | string | はい | オブジェクトのAPI名（例：Account、Contact、Lead、Custom_Object__c） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | オブジェクトメタデータ |

### `salesforce_list_objects`

利用可能なすべてのSalesforceオブジェクトのリストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `idToken` | string | いいえ | 説明なし |
| `instanceUrl` | string | いいえ | 説明なし |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | オブジェクトリスト |

## 注意事項

- カテゴリー: `tools`
- タイプ: `salesforce`
```

--------------------------------------------------------------------------------

---[FILE: schedule.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/schedule.mdx

```text
---
title: スケジュール
description: スケジュールに基づいてワークフローの実行をトリガーする
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="schedule"
  color="#7B68EE"
/>

## 使用方法

ワークフローにスケジュールを組み込みます。スケジュール設定に基づいてワークフローをトリガーすることができます。

## 注意事項

- カテゴリー: `triggers`
- タイプ: `schedule`
```

--------------------------------------------------------------------------------

````
