---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 208
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 208 of 933)

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

---[FILE: mongodb.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/mongodb.mdx

```text
---
title: MongoDB
description: MongoDBデータベースに接続する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mongodb"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[MongoDB](https://www.mongodb.com/)ツールを使用すると、MongoDBデータベースに接続し、エージェントワークフロー内で直接ドキュメント指向の幅広い操作を実行できます。柔軟な構成と安全な接続管理により、データの操作や操作が簡単に行えます。

MongoDBツールでは、以下のことができます：

- **ドキュメントの検索**: `mongodb_query`操作を使用して、リッチなクエリフィルターでコレクションに問い合わせ、ドキュメントを取得します。
- **ドキュメントの挿入**: `mongodb_insert`操作を使用して、1つまたは複数のドキュメントをコレクションに追加します。
- **ドキュメントの更新**: `mongodb_update`操作を使用して、フィルター条件と更新アクションを指定して既存のドキュメントを変更します。
- **ドキュメントの削除**: `mongodb_delete`操作を使用して、フィルターと削除オプションを指定してコレクションからドキュメントを削除します。
- **データの集計**: `mongodb_execute`操作を使用して複雑な集計パイプラインを実行し、データを変換および分析します。

MongoDBツールは、エージェントが構造化されたドキュメントベースのデータを管理または分析する必要があるワークフローに最適です。ユーザー生成コンテンツの処理、アプリデータの管理、分析の強化など、MongoDBツールはデータアクセスと操作を安全でプログラム的な方法で効率化します。
{/* MANUAL-CONTENT-END */}

## 使用方法

MongoDBをワークフローに統合します。データの検索、挿入、更新、削除、集計が可能です。

## ツール

### `mongodb_query`

MongoDBコレクションで検索操作を実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | MongoDBサーバーのホスト名またはIPアドレス |
| `port` | number | はい | MongoDBサーバーのポート（デフォルト：27017） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | いいえ | MongoDBユーザー名 |
| `password` | string | いいえ | MongoDBパスワード |
| `authSource` | string | いいえ | 認証データベース |
| `ssl` | string | いいえ | SSL接続モード（disabled、required、preferred） |
| `collection` | string | はい | クエリを実行するコレクション名 |
| `query` | string | いいえ | JSON文字列としてのMongoDBクエリフィルター |
| `limit` | number | いいえ | 返すドキュメントの最大数 |
| `sort` | string | いいえ | JSON文字列としてのソート条件 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `documents` | array | クエリから返されたドキュメントの配列 |
| `documentCount` | number | 返されたドキュメント数 |

### `mongodb_insert`

MongoDBコレクションにドキュメントを挿入する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | MongoDBサーバーのホスト名またはIPアドレス |
| `port` | number | はい | MongoDBサーバーのポート（デフォルト：27017） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | いいえ | MongoDBユーザー名 |
| `password` | string | いいえ | MongoDBパスワード |
| `authSource` | string | いいえ | 認証データベース |
| `ssl` | string | いいえ | SSL接続モード（disabled、required、preferred） |
| `collection` | string | はい | 挿入先のコレクション名 |
| `documents` | array | はい | 挿入するドキュメントの配列 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `documentCount` | number | 挿入されたドキュメント数 |
| `insertedId` | string | 挿入されたドキュメントのID（単一挿入） |
| `insertedIds` | array | 挿入されたドキュメントIDの配列（複数挿入） |

### `mongodb_update`

MongoDBコレクション内のドキュメントを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | MongoDBサーバーのホスト名またはIPアドレス |
| `port` | number | はい | MongoDBサーバーのポート（デフォルト：27017） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | いいえ | MongoDBユーザー名 |
| `password` | string | いいえ | MongoDBパスワード |
| `authSource` | string | いいえ | 認証データベース |
| `ssl` | string | いいえ | SSL接続モード（disabled、required、preferred） |
| `collection` | string | はい | 更新するコレクション名 |
| `filter` | string | はい | JSON文字列としてのフィルター条件 |
| `update` | string | はい | JSON文字列としての更新操作 |
| `upsert` | boolean | いいえ | ドキュメントが見つからない場合に作成する |
| `multi` | boolean | いいえ | 複数のドキュメントを更新する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `matchedCount` | number | フィルターに一致したドキュメント数 |
| `modifiedCount` | number | 変更されたドキュメント数 |
| `documentCount` | number | 影響を受けたドキュメントの総数 |
| `insertedId` | string | 挿入されたドキュメントのID（upsertの場合） |

### `mongodb_delete`

MongoDBコレクションからドキュメントを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | MongoDBサーバーのホスト名またはIPアドレス |
| `port` | number | はい | MongoDBサーバーのポート（デフォルト：27017） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | いいえ | MongoDBユーザー名 |
| `password` | string | いいえ | MongoDBパスワード |
| `authSource` | string | いいえ | 認証データベース |
| `ssl` | string | いいえ | SSL接続モード（disabled、required、preferred） |
| `collection` | string | はい | 削除元のコレクション名 |
| `filter` | string | はい | JSON文字列としてのフィルター条件 |
| `multi` | boolean | いいえ | 複数のドキュメントを削除する |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `deletedCount` | number | 削除されたドキュメント数 |
| `documentCount` | number | 影響を受けたドキュメントの総数 |

### `mongodb_execute`

MongoDB集計パイプラインを実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | MongoDBサーバーのホスト名またはIPアドレス |
| `port` | number | はい | MongoDBサーバーのポート（デフォルト: 27017） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | いいえ | MongoDBのユーザー名 |
| `password` | string | いいえ | MongoDBのパスワード |
| `authSource` | string | いいえ | 認証データベース |
| `ssl` | string | いいえ | SSL接続モード（disabled、required、preferred） |
| `collection` | string | はい | パイプラインを実行するコレクション名 |
| `pipeline` | string | はい | JSON文字列としての集計パイプライン |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `documents` | array | 集計から返されたドキュメントの配列 |
| `documentCount` | number | 返されたドキュメント数 |

## 注意事項

- カテゴリ: `tools`
- タイプ: `mongodb`
```

--------------------------------------------------------------------------------

---[FILE: mysql.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/mysql.mdx

```text
---
title: MySQL
description: MySQLデータベースに接続する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="mysql"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[MySQL](https://www.mysql.com/)ツールを使用すると、任意のMySQLデータベースに接続し、エージェントワークフロー内で直接幅広いデータベース操作を実行できます。安全な接続処理と柔軟な設定により、データの管理やインタラクションが簡単に行えます。

MySQLツールでできること：

- **データのクエリ**: `mysql_query`操作を使用して、MySQLテーブルからデータを取得するSELECTクエリを実行できます。
- **レコードの挿入**: `mysql_insert`操作を使用して、テーブルと挿入するデータを指定することで、テーブルに新しい行を追加できます。
- **レコードの更新**: `mysql_update`操作を使用して、テーブル、新しいデータ、WHERE条件を指定することで、テーブル内の既存データを変更できます。
- **レコードの削除**: `mysql_delete`操作を使用して、テーブルとWHERE条件を指定することで、テーブルから行を削除できます。
- **生のSQL実行**: 高度なユースケース向けに、`mysql_execute`操作を使用して任意のカスタムSQLコマンドを実行できます。

MySQL ツールは、エージェントが構造化データとやり取りする必要があるシナリオに最適です。例えば、レポートの自動化、システム間のデータ同期、データ駆動型ワークフローの実現などに役立ちます。データベースアクセスを効率化し、MySQL データをプログラムで簡単に読み取り、書き込み、管理することができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

MySQL をワークフローに統合します。クエリ、挿入、更新、削除、および生の SQL の実行が可能です。

## ツール

### `mysql_query`

MySQL データベースで SELECT クエリを実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | MySQL サーバーのホスト名または IP アドレス |
| `port` | number | はい | MySQL サーバーのポート（デフォルト: 3306） |
| `database` | string | はい | 接続するデータベース名 |
| `username` | string | はい | データベースのユーザー名 |
| `password` | string | はい | データベースのパスワード |
| `ssl` | string | いいえ | SSL 接続モード（disabled, required, preferred） |
| `query` | string | はい | 実行する SQL SELECT クエリ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作のステータスメッセージ |
| `rows` | array | クエリから返された行の配列 |
| `rowCount` | number | 返された行数 |

### `mysql_insert`

MySQL データベースに新しいレコードを挿入する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | MySQL サーバーのホスト名または IP アドレス |
| `port` | number | はい | MySQL サーバーのポート（デフォルト: 3306） |
| `database` | string | はい | 接続するデータベース名 |
| `username` | string | はい | データベースのユーザー名 |
| `password` | string | はい | データベースのパスワード |
| `ssl` | string | いいえ | SSL 接続モード（disabled, required, preferred） |
| `table` | string | はい | 挿入先のテーブル名 |
| `data` | object | はい | キーと値のペアとして挿入するデータ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | 挿入された行の配列 |
| `rowCount` | number | 挿入された行数 |

### `mysql_update`

MySQLデータベースの既存レコードを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | MySQLサーバーのホスト名またはIPアドレス |
| `port` | number | はい | MySQLサーバーのポート（デフォルト：3306） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | データベースのユーザー名 |
| `password` | string | はい | データベースのパスワード |
| `ssl` | string | いいえ | SSL接続モード（disabled、required、preferred） |
| `table` | string | はい | 更新するテーブル名 |
| `data` | object | はい | キーと値のペアとして更新するデータ |
| `where` | string | はい | WHERE句の条件（WHEREキーワードなし） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | 更新された行の配列 |
| `rowCount` | number | 更新された行数 |

### `mysql_delete`

MySQLデータベースからレコードを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | MySQLサーバーのホスト名またはIPアドレス |
| `port` | number | はい | MySQLサーバーのポート（デフォルト：3306） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | データベースのユーザー名 |
| `password` | string | はい | データベースのパスワード |
| `ssl` | string | いいえ | SSL接続モード（disabled、required、preferred） |
| `table` | string | はい | 削除元のテーブル名 |
| `where` | string | はい | WHERE句の条件（WHEREキーワードなし） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `rows` | array | 削除された行の配列 |
| `rowCount` | number | 削除された行数 |

### `mysql_execute`

MySQLデータベースで生のSQLクエリを実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | MySQLサーバーのホスト名またはIPアドレス |
| `port` | number | はい | MySQLサーバーのポート（デフォルト：3306） |
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

- カテゴリ: `tools`
- タイプ: `mysql`
```

--------------------------------------------------------------------------------

---[FILE: neo4j.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/neo4j.mdx

```text
---
title: Neo4j
description: Neo4jグラフデータベースに接続する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="neo4j"
  color="#FFFFFF"
/>

## 使用方法

Neo4jグラフデータベースをワークフローに統合します。ノードとリレーションシップのクエリ、作成、マージ、更新、削除が可能です。

## ツール

### `neo4j_query`

MATCHクエリを実行してNeo4jグラフデータベースからノードとリレーションシップを読み取ります。最適なパフォーマンスを得るため、また大きな結果セットを防ぐために、クエリにLIMITを含めてください（例：

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | Neo4jサーバーのホスト名またはIPアドレス |
| `port` | number | はい | Neo4jサーバーのポート（デフォルト：Boltプロトコル用に7687） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | Neo4jユーザー名 |
| `password` | string | はい | Neo4jパスワード |
| `encryption` | string | いいえ | 接続暗号化モード（enabled、disabled） |
| `cypherQuery` | string | はい | 実行するCypherクエリ（通常はMATCH文） |
| `parameters` | object | いいえ | CypherクエリのパラメータをJSONオブジェクトとして指定。LIMITを含む動的な値に使用します（例：query: "MATCH \(n\) RETURN n LIMIT $limit"、parameters: \{limit: 100\}） |
| `parameters` | string | いいえ | 説明なし |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `records` | array | クエリから返されたレコードの配列 |
| `recordCount` | number | 返されたレコード数 |
| `summary` | json | タイミングとカウンターを含むクエリ実行の概要 |

### `neo4j_create`

CREATE文を実行してNeo4jグラフデータベースに新しいノードとリレーションシップを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | Neo4jサーバーのホスト名またはIPアドレス |
| `port` | number | はい | Neo4jサーバーのポート番号 \(デフォルト: Boltプロトコル用に7687\) |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | Neo4jのユーザー名 |
| `password` | string | はい | Neo4jのパスワード |
| `encryption` | string | いいえ | 接続の暗号化モード \(enabled, disabled\) |
| `cypherQuery` | string | はい | 実行するCypher CREATE文 |
| `parameters` | object | いいえ | CypherクエリのパラメータをJSONオブジェクトとして指定 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作のステータスメッセージ |
| `summary` | json | 作成されたノードとリレーションシップの数を含む作成サマリー |

### `neo4j_merge`

MERGE文を実行してNeo4jでノードとリレーションシップを検索または作成する（アップサート操作）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | Neo4jサーバーのホスト名またはIPアドレス |
| `port` | number | はい | Neo4jサーバーのポート番号 \(デフォルト: Boltプロトコル用に7687\) |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | Neo4jのユーザー名 |
| `password` | string | はい | Neo4jのパスワード |
| `encryption` | string | いいえ | 接続の暗号化モード \(enabled, disabled\) |
| `cypherQuery` | string | はい | 実行するCypher MERGE文 |
| `parameters` | object | いいえ | CypherクエリのパラメータをJSONオブジェクトとして指定 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `summary` | json | 作成またはマッチしたノード/リレーションシップのカウンターを含むマージ概要 |

### `neo4j_update`

Neo4jの既存ノードとリレーションシップのプロパティを更新するためのSETステートメントを実行します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | Neo4jサーバーのホスト名またはIPアドレス |
| `port` | number | はい | Neo4jサーバーポート（デフォルト：Boltプロトコル用7687） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | Neo4jユーザー名 |
| `password` | string | はい | Neo4jパスワード |
| `encryption` | string | いいえ | 接続暗号化モード（enabled、disabled） |
| `cypherQuery` | string | はい | プロパティを更新するためのMATCHとSETステートメントを含むCypherクエリ |
| `parameters` | object | いいえ | JSONオブジェクトとしてのCypherクエリのパラメータ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `summary` | json | 設定されたプロパティのカウンターを含む更新概要 |

### `neo4j_delete`

Neo4jからノードとリレーションシップを削除するためのDELETEまたはDETACH DELETEステートメントを実行します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | Neo4jサーバーのホスト名またはIPアドレス |
| `port` | number | はい | Neo4jサーバーポート（デフォルト：Boltプロトコル用7687） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | Neo4jユーザー名 |
| `password` | string | はい | Neo4jパスワード |
| `encryption` | string | いいえ | 接続暗号化モード（enabled、disabled） |
| `cypherQuery` | string | はい | MATCHとDELETE/DETACH DELETEステートメントを含むCypherクエリ |
| `parameters` | object | いいえ | JSONオブジェクトとしてのCypherクエリのパラメータ |
| `detach` | boolean | いいえ | ノードを削除する前にリレーションシップを削除するためにDETACH DELETEを使用するかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `summary` | json | 削除されたノードとリレーションシップのカウンターを含む削除サマリー |

### `neo4j_execute`

複雑な操作のためにNeo4jグラフデータベースで任意のCypherクエリを実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `host` | string | はい | Neo4jサーバーのホスト名またはIPアドレス |
| `port` | number | はい | Neo4jサーバーポート（デフォルト：Boltプロトコル用の7687） |
| `database` | string | はい | 接続先のデータベース名 |
| `username` | string | はい | Neo4jユーザー名 |
| `password` | string | はい | Neo4jパスワード |
| `encryption` | string | いいえ | 接続暗号化モード（enabled、disabled） |
| `cypherQuery` | string | はい | 実行するCypherクエリ（任意の有効なCypher文） |
| `parameters` | object | いいえ | JSONオブジェクトとしてのCypherクエリのパラメータ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `records` | array | クエリから返されたレコードの配列 |
| `recordCount` | number | 返されたレコードの数 |
| `summary` | json | タイミングとカウンターを含む実行サマリー |

## 注意事項

- カテゴリ: `tools`
- タイプ: `neo4j`
```

--------------------------------------------------------------------------------

---[FILE: notion.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/notion.mdx

```text
---
title: Notion
description: Notionページを管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="notion"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Notion](https://www.notion.so)は、ノート、ドキュメント、ウィキ、プロジェクト管理ツールを単一のプラットフォームに統合したオールインワンのワークスペースです。ユーザーがさまざまな形式でコンテンツを作成、整理、共同作業できる柔軟でカスタマイズ可能な環境を提供しています。

Notionでできること：

- **多様なコンテンツの作成**: ドキュメント、ウィキ、データベース、かんばんボード、カレンダーなどを構築
- **情報の整理**: ネストされたページと強力なデータベースでコンテンツを階層的に構造化
- **シームレスな共同作業**: ワークスペースやページをチームメンバーと共有してリアルタイムでコラボレーション
- **ワークスペースのカスタマイズ**: 柔軟なテンプレートとビルディングブロックで理想的なワークフローをデザイン
- **情報の接続**: ページとデータベース間をリンクして知識ネットワークを作成
- **どこからでもアクセス**: ウェブ、デスクトップ、モバイルプラットフォーム間で自動同期するNotionを使用

Simでは、Notion統合により、エージェントがプログラムでNotionワークスペースと直接やり取りできるようになります。これにより、ナレッジマネジメント、コンテンツ作成、情報検索などの強力な自動化シナリオが可能になります。エージェントができること：

- **Notionページの読み取り**: あらゆるNotionページからコンテンツとメタデータを抽出。
- **Notionデータベースの読み取り**: データベース構造と情報を取得。
- **ページへの書き込み**: 既存のNotionページに新しいコンテンツを追加。
- **新規ページの作成**: 親ページの下に、カスタムタイトルとコンテンツを持つ新しいNotionページを生成。
- **データベースのクエリ**: 高度なフィルターと並べ替え条件を使用してデータベースエントリを検索およびフィルタリング。
- **ワークスペースの検索**: 特定のクエリに一致するページやデータベースをNotionワークスペース全体で検索。
- **新規データベースの作成**: カスタムプロパティと構造を持つ新しいデータベースをプログラムで作成。

この統合により、AIワークフローとナレッジベースの間のギャップが埋まり、シームレスなドキュメント作成と情報管理が可能になります。SimとNotionを接続することで、ドキュメント作成プロセスの自動化、最新の情報リポジトリの維持、レポートの生成、情報のインテリジェントな整理など、すべてをインテリジェントエージェントを通じて実行できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Notionをワークフローに統合します。ページの読み取り、データベースの読み取り、ページの作成、データベースの作成、コンテンツの追加、データベースのクエリ、ワークスペースの検索が可能です。OAuthが必要です。

## ツール

### `notion_read`

Notionページからコンテンツを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `pageId` | string | はい | 読み取るNotionページのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | ヘッダー、段落、リスト、TODOを含むマークダウン形式のページコンテンツ |
| `metadata` | object | タイトル、URL、タイムスタンプを含むページメタデータ |

### `notion_read_database`

Notionからデータベース情報と構造を読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `databaseId` | string | はい | 読み取るNotionデータベースのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | タイトル、プロパティスキーマ、メタデータを含むデータベース情報 |
| `metadata` | object | タイトル、ID、URL、タイムスタンプ、プロパティスキーマを含むデータベースメタデータ |

### `notion_write`

Notionページにコンテンツを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `pageId` | string | はい | コンテンツを追加するNotionページのID |
| `content` | string | はい | ページに追加するコンテンツ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | コンテンツがページに追加されたことを確認する成功メッセージ |

### `notion_create_page`

Notionで新しいページを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `parentId` | string | はい | 親ページのID |
| `title` | string | いいえ | 新しいページのタイトル |
| `content` | string | いいえ | 作成時にページに追加するオプションのコンテンツ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | ページ作成を確認する成功メッセージ |
| `metadata` | object | タイトル、ページID、URL、タイムスタンプを含むページのメタデータ |

### `notion_query_database`

高度なフィルタリングでNotionデータベースのエントリを検索およびフィルタリングする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `databaseId` | string | はい | クエリを実行するデータベースのID |
| `filter` | string | いいえ | JSONとしてのフィルター条件（オプション） |
| `sorts` | string | いいえ | JSON配列としてのソート基準（オプション） |
| `pageSize` | number | いいえ | 返す結果の数（デフォルト：100、最大：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | プロパティを含むデータベースエントリのフォーマットされたリスト |
| `metadata` | object | 合計結果数、ページネーション情報、生の結果配列を含むクエリメタデータ |

### `notion_search`

Notionワークスペース内のすべてのページとデータベースを検索

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | いいえ | 検索語句（空白にするとすべてのページを取得） |
| `filterType` | string | いいえ | オブジェクトタイプでフィルタリング：page、database、または空白ですべて |
| `pageSize` | number | いいえ | 返す結果の数（デフォルト：100、最大：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | ページとデータベースを含む検索結果のフォーマット済みリスト |
| `metadata` | object | 検索メタデータ（総結果数、ページネーション情報、生の結果配列を含む） |

### `notion_create_database`

カスタムプロパティを持つ新しいデータベースをNotionに作成

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `parentId` | string | はい | データベースが作成される親ページのID |
| `title` | string | はい | 新しいデータベースのタイトル |
| `properties` | string | いいえ | JSONオブジェクトとしてのデータベースプロパティ（オプション、空の場合はデフォルトの「Name」プロパティが作成されます） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | データベースの詳細とプロパティリストを含む成功メッセージ |
| `metadata` | object | ID、タイトル、URL、作成時間、プロパティスキーマを含むデータベースメタデータ |

## メモ

- カテゴリー: `tools`
- タイプ: `notion`
```

--------------------------------------------------------------------------------

---[FILE: onedrive.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/onedrive.mdx

```text
---
title: OneDrive
description: ファイルの作成、アップロード、ダウンロード、一覧表示、削除
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="onedrive"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[OneDrive](https://onedrive.live.com)はMicrosoftのクラウドストレージおよびファイル同期サービスで、ユーザーが安全にファイルを保存し、デバイス間でアクセスおよび共有することができます。Microsoft 365エコシステムに深く統合されており、OneDriveはチームや組織間でのシームレスなコラボレーション、バージョン管理、コンテンツへのリアルタイムアクセスをサポートしています。

SimでOneDriveツールを統合して、クラウドファイルを自動的に取得、管理、ワークフロー内で整理する方法を学びましょう。このチュートリアルでは、OneDriveの接続、ファイルアクセスの設定、保存されたコンテンツを使用して自動化を強化する方法を説明します。重要な文書やメディアをエージェントとリアルタイムで同期するのに最適です。

OneDriveでは、次のことができます：

- **クラウドにファイルを安全に保存**: どのデバイスからでも文書、画像、その他のファイルをアップロードしてアクセス
- **コンテンツを整理**: 構造化されたフォルダを作成し、ファイルバージョンを簡単に管理
- **リアルタイムでコラボレーション**: ファイルを共有し、他のユーザーと同時に編集して変更を追跡
- **複数デバイスからアクセス**: デスクトップ、モバイル、WebプラットフォームからOneDriveを使用
- **Microsoft 365との統合**: Word、Excel、PowerPoint、Teamsとシームレスに連携
- **権限の制御**: カスタムアクセス設定と有効期限コントロールでファイルとフォルダを共有

Simでは、OneDrive統合によりエージェントがクラウドストレージと直接やり取りできるようになります。エージェントは特定のフォルダに新しいファイルをアップロードしたり、既存のファイルを取得して読み込んだり、フォルダの内容を一覧表示して情報を動的に整理しアクセスしたりできます。この統合により、エージェントはファイル操作をインテリジェントなワークフローに組み込むことができ、文書の取り込み、コンテンツ分析、構造化されたストレージ管理を自動化します。SimとOneDriveを接続することで、エージェントがクラウド文書をプログラムで管理・使用できるようになり、手動の手順を排除し、安全でリアルタイムのファイルアクセスで自動化を強化します。
{/* MANUAL-CONTENT-END */}

## 使用方法

OneDriveをワークフローに統合します。テキストファイルやExcelファイルの作成、ファイルのアップロード、ダウンロード、一覧表示、ファイルやフォルダの削除が可能です。

## ツール

### `onedrive_upload`

OneDriveにファイルをアップロードする

#### 入力

| パラメータ | 種類 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `fileName` | string | はい | アップロードするファイルの名前 |
| `file` | file | いいえ | アップロードするファイル（バイナリ） |
| `content` | string | いいえ | アップロードするテキスト内容（ファイルが提供されていない場合） |
| `mimeType` | string | いいえ | 作成するファイルのMIMEタイプ（例：.txtの場合はtext/plain、.xlsxの場合はapplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet） |
| `folderSelector` | string | いいえ | ファイルをアップロードするフォルダを選択 |
| `manualFolderId` | string | いいえ | 手動で入力したフォルダID（高度なモード） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | ファイルが正常にアップロードされたかどうか |
| `file` | object | アップロードされたファイルオブジェクト（ID、名前、webViewLink、webContentLink、タイムスタンプなどのメタデータを含む） |

### `onedrive_create_folder`

OneDriveに新しいフォルダを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `folderName` | string | はい | 作成するフォルダの名前 |
| `folderSelector` | string | いいえ | フォルダを作成する親フォルダを選択 |
| `manualFolderId` | string | いいえ | 手動で入力した親フォルダID（高度なモード） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | フォルダが正常に作成されたかどうか |
| `file` | object | 作成されたフォルダオブジェクト（ID、名前、webViewLink、タイムスタンプなどのメタデータを含む） |

### `onedrive_download`

OneDriveからファイルをダウンロードする

#### 入力

| パラメータ | 種類 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | はい | ダウンロードするファイルのID |
| `fileName` | string | いいえ | オプションのファイル名上書き |

#### 出力

| パラメータ | 種類 | 説明 |
| --------- | ---- | ----------- |
| `file` | file | 実行ファイルに保存されたダウンロードファイル |

### `onedrive_list`

OneDriveのファイルとフォルダを一覧表示する

#### 入力

| パラメータ | 種類 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `folderSelector` | string | いいえ | ファイルを一覧表示するフォルダを選択 |
| `manualFolderId` | string | いいえ | 手動で入力したフォルダID（高度なモード） |
| `query` | string | いいえ | ファイルをフィルタリングするクエリ |
| `pageSize` | number | いいえ | 返すファイルの数 |

#### 出力

| パラメータ | 種類 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | ファイルが正常に一覧表示されたかどうか |
| `files` | array | メタデータを含むファイルとフォルダオブジェクトの配列 |
| `nextPageToken` | string | 結果の次のページを取得するためのトークン（オプション） |

### `onedrive_delete`

OneDriveからファイルまたはフォルダを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `fileId` | string | はい | 削除するファイルまたはフォルダのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | ファイルが正常に削除されたかどうか |
| `deleted` | boolean | ファイルが削除されたことの確認 |
| `fileId` | string | 削除されたファイルのID |

## 注意事項

- カテゴリ: `tools`
- タイプ: `onedrive`
```

--------------------------------------------------------------------------------

---[FILE: openai.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/openai.mdx

```text
---
title: 埋め込み
description: OpenAI埋め込みを生成する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="openai"
  color="#10a37f"
/>

{/* MANUAL-CONTENT-START:intro */}
[OpenAI](https://www.openai.com)は、強力なAIモデルとAPIを提供する先進的なAI研究・展開企業です。OpenAIは、GPT-4などの大規模言語モデル、DALL-Eによる画像生成、そして開発者が高度なAI駆動アプリケーションを構築できる埋め込み技術など、最先端のテクノロジーを提供しています。

OpenAIでできること：

- **テキスト生成**: GPTモデルを使用して様々な用途に人間のようなテキストを作成
- **画像作成**: DALL-Eでテキスト説明をビジュアルコンテンツに変換
- **埋め込み生成**: テキストを意味検索や分析のための数値ベクトルに変換
- **AIアシスタント構築**: 専門知識を持つ会話型エージェントを開発
- **データ処理と分析**: 非構造化テキストから洞察やパターンを抽出
- **言語翻訳**: 高精度で異なる言語間でコンテンツを変換
- **コンテンツ要約**: 重要な情報を保持しながら長文テキストを簡潔にまとめる

Simでは、OpenAI統合によりエージェントがこれらの強力なAI機能をワークフローの一部としてプログラム的に活用できます。これにより、自然言語理解、コンテンツ生成、意味分析を組み合わせた高度な自動化シナリオが可能になります。エージェントはテキストからベクトル埋め込みを生成でき、これは意味を捉えた数値表現であり、高度な検索、分類、レコメンデーションシステムを実現します。さらに、DALL-E統合を通じて、エージェントはテキスト説明から画像を作成でき、ビジュアルコンテンツ生成の可能性を広げます。この統合はワークフロー自動化と最先端のAI機能の間のギャップを埋め、エージェントがコンテキストを理解し、関連コンテンツを生成し、意味理解に基づいたインテリジェントな決定を下すことを可能にします。SimとOpenAIを接続することで、より知的に情報を処理し、創造的なコンテンツを生成し、ユーザーにより個別化された体験を提供するエージェントを作成できます。
{/* MANUAL-CONTENT-END */}

## 使用手順

ワークフローに埋め込みを統合します。テキストから埋め込みを生成できます。APIキーが必要です。

## ツール

### `openai_embeddings`

OpenAIを使用してテキストから埋め込みを生成

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `input` | string | はい | 埋め込みを生成するテキスト |
| `model` | string | いいえ | 埋め込みに使用するモデル |
| `encodingFormat` | string | いいえ | 埋め込みを返す形式 |
| `apiKey` | string | はい | OpenAI APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 埋め込み生成結果 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `openai`
```

--------------------------------------------------------------------------------

---[FILE: outlook.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/outlook.mdx

```text
---
title: Outlook
description: Outlookメールメッセージの送信、読み取り、下書き、転送、移動
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="outlook"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Microsoft Outlook](https://outlook.office365.com)は、ユーザーがコミュニケーション、スケジュール、タスクを効率的に管理するための総合的なメールおよびカレンダープラットフォームです。Microsoftの生産性スイートの一部として、Outlookはメールの送信と整理、会議の調整、Microsoft 365アプリケーションとのシームレスな統合のための堅牢なツールを提供し、個人やチームがデバイス間で整理され、つながりを維持できるようにします。

Microsoft Outlookでは、次のことができます：

- **メールの送受信**：個人や配布リストと明確かつプロフェッショナルにコミュニケーションを取る  
- **カレンダーとイベントの管理**：会議のスケジュール設定、リマインダーの設定、空き状況の確認  
- **受信トレイの整理**：フォルダ、カテゴリ、ルールを使用してメールを効率的に管理  
- **連絡先とタスクへのアクセス**：重要な人物やアクションアイテムを一か所で管理  
- **Microsoft 365との統合**：Word、Excel、Teamsなど他のMicrosoftアプリとシームレスに連携  
- **複数デバイスでのアクセス**：デスクトップ、ウェブ、モバイルでリアルタイム同期でOutlookを使用  
- **プライバシーとセキュリティの維持**：エンタープライズグレードの暗号化とコンプライアンス管理を活用

Simでは、Microsoft Outlook統合により、エージェントがプログラムでメールやカレンダーデータに直接アクセスし、完全なメール管理機能を利用できます。これにより、メールワークフロー全体で強力な自動化シナリオが可能になります。エージェントは以下のことができます：

- **送信と下書き**: 添付ファイル付きのプロフェッショナルなメールを作成し、後で使用するために下書きを保存
- **読み取りと転送**: 受信トレイのメッセージにアクセスし、重要な連絡事項をチームメンバーに転送
- **効率的な整理**: メールを既読または未読としてマーク、フォルダ間でメッセージを移動、参照用にメールをコピー
- **受信トレイのクリーンアップ**: 不要なメッセージを削除し、整理されたフォルダ構造を維持
- **ワークフローのトリガー**: 新着メールにリアルタイムで反応し、受信メッセージに基づく応答性の高い自動化を実現

SimとMicrosoft Outlookを連携させることで、インテリジェントなエージェントがコミュニケーションを自動化し、スケジュール管理を効率化し、組織の通信を可視化し、受信トレイを整理することができます—すべてワークフローエコシステム内で実現します。顧客とのコミュニケーション管理、請求書処理、チーム更新の調整、フォローアップの自動化など、あらゆる場面でOutlook統合はエンタープライズグレードのメール自動化機能を提供します。
{/* MANUAL-CONTENT-END */}

## 使用手順

Outlookをワークフローに統合します。メールメッセージの読み取り、下書き、送信、転送、移動ができます。新しいメールを受信したときにワークフローをトリガーするトリガーモードでも使用できます。

## ツール

### `outlook_send`

Outlookを使用してメールを送信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `to` | string | はい | 受信者のメールアドレス |
| `subject` | string | はい | メールの件名 |
| `body` | string | はい | メール本文の内容 |
| `contentType` | string | いいえ | メール本文のコンテンツタイプ（テキストまたはHTML） |
| `replyToMessageId` | string | いいえ | 返信するメッセージID（スレッド用） |
| `conversationId` | string | いいえ | スレッド用の会話ID |
| `cc` | string | いいえ | CCの受信者（カンマ区切り） |
| `bcc` | string | いいえ | BCCの受信者（カンマ区切り） |
| `attachments` | file[] | いいえ | メールに添付するファイル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メール送信成功ステータス |
| `status` | string | メールの配信状況 |
| `timestamp` | string | メールが送信された時のタイムスタンプ |
| `message` | string | 成功またはエラーメッセージ |

### `outlook_draft`

Outlookを使用してメールを下書き作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `to` | string | はい | 受信者のメールアドレス |
| `subject` | string | はい | メールの件名 |
| `body` | string | はい | メール本文の内容 |
| `contentType` | string | いいえ | メール本文のコンテンツタイプ（テキストまたはHTML） |
| `cc` | string | いいえ | CCの受信者（カンマ区切り） |
| `bcc` | string | いいえ | BCCの受信者（カンマ区切り） |
| `attachments` | file[] | いいえ | メールの下書きに添付するファイル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メール下書き作成成功ステータス |
| `messageId` | string | 下書きメールの一意識別子 |
| `status` | string | メールの下書き状態 |
| `subject` | string | 下書きメールの件名 |
| `timestamp` | string | 下書きが作成されたタイムスタンプ |
| `message` | string | 成功またはエラーメッセージ |

### `outlook_read`

Outlookからメールを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `folder` | string | いいえ | メールを読み取るフォルダID（デフォルト：受信トレイ） |
| `maxResults` | number | いいえ | 取得するメールの最大数（デフォルト：1、最大：10） |
| `includeAttachments` | boolean | いいえ | メールの添付ファイルをダウンロードして含める |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはステータスメッセージ |
| `results` | array | メールメッセージオブジェクトの配列 |
| `attachments` | file[] | すべてのメールから抽出されたすべての添付ファイル |

### `outlook_forward`

既存のOutlookメッセージを指定した受信者に転送する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | 転送するメッセージのID |
| `to` | string | はい | 受信者のメールアドレス（複数の場合はカンマ区切り） |
| `comment` | string | いいえ | 転送メッセージに含める任意のコメント |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `results` | object | 配信結果の詳細 |

### `outlook_move`

Outlookフォルダ間でメールを移動する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | 移動するメッセージのID |
| `destinationId` | string | はい | 移動先フォルダのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メール移動成功ステータス |
| `message` | string | 成功またはエラーメッセージ |
| `messageId` | string | 移動されたメッセージのID |
| `newFolderId` | string | 移動先フォルダのID |

### `outlook_mark_read`

Outlookメッセージを既読としてマークする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | 既読としてマークするメッセージのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `message` | string | 成功またはエラーメッセージ |
| `messageId` | string | メッセージのID |
| `isRead` | boolean | メッセージの既読ステータス |

### `outlook_mark_unread`

Outlookメッセージを未読としてマークする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | 未読としてマークするメッセージのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `message` | string | 成功またはエラーメッセージ |
| `messageId` | string | メッセージのID |
| `isRead` | boolean | メッセージの既読ステータス |

### `outlook_delete`

Outlookメッセージを削除する（削除済みアイテムに移動）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | 削除するメッセージのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `message` | string | 成功またはエラーメッセージ |
| `messageId` | string | 削除されたメッセージのID |
| `status` | string | 削除ステータス |

### `outlook_copy`

Outlookメッセージを別のフォルダにコピーする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `messageId` | string | はい | コピーするメッセージのID |
| `destinationId` | string | はい | 宛先フォルダのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | メールコピー成功ステータス |
| `message` | string | 成功またはエラーメッセージ |
| `originalMessageId` | string | 元のメッセージのID |
| `copiedMessageId` | string | コピーされたメッセージのID |
| `destinationFolderId` | string | 宛先フォルダのID |

## 注意事項

- カテゴリ: `tools`
- タイプ: `outlook`
```

--------------------------------------------------------------------------------

---[FILE: parallel_ai.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/parallel_ai.mdx

```text
---
title: Parallel AI
description: Parallel AIによるウェブリサーチ
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="parallel_ai"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Parallel AI](https://parallel.ai/)は、あらゆるクエリに対して包括的で高品質な結果を提供するように設計された先進的なウェブ検索およびコンテンツ抽出プラットフォームです。インテリジェントな処理と大規模なデータ抽出を活用することで、Parallel AIはユーザーとエージェントがウェブ全体から情報にアクセス、分析、統合することをスピーディーかつ正確に可能にします。

Parallel AIでは、以下のことができます：

- **インテリジェントにウェブを検索する**：幅広いソースから関連性の高い最新情報を取得する  
- **コンテンツの抽出と要約**：ウェブページや文書から簡潔で意味のある抜粋を取得する  
- **検索目的のカスタマイズ**：特定のニーズや質問に合わせてクエリを調整し、的を絞った結果を得る  
- **大規模な結果処理**：高度な処理オプションで大量の検索結果を処理する  
- **ワークフローとの統合**：Simの中でParallel AIを使用して、調査、コンテンツ収集、知識抽出を自動化する  
- **出力の粒度を制御**：結果の数と結果ごとのコンテンツ量を指定する  
- **安全なAPIアクセス**：APIキー認証で検索とデータを保護する

Simでは、Parallel AI統合によりエージェントがプログラムでウェブ検索やコンテンツ抽出を実行できるようになります。これにより、リアルタイムの調査、競合分析、コンテンツモニタリング、ナレッジベース作成などの強力な自動化シナリオが可能になります。SimとParallel AIを接続することで、エージェントが自動化されたワークフローの一部としてウェブデータを収集、処理、活用する能力を解放します。
{/* MANUAL-CONTENT-END */}

## 使用方法

Parallel AIをワークフローに統合します。ウェブ検索、URLからの情報抽出、詳細な調査を行うことができます。

## ツール

### `parallel_search`

Parallel AIを使用してウェブを検索します。インテリジェントな処理とコンテンツ抽出により、包括的な検索結果を提供します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `objective` | string | はい | 検索目的または回答すべき質問 |
| `search_queries` | string | いいえ | 実行する検索クエリのオプションのカンマ区切りリスト |
| `processor` | string | いいえ | 処理方法：base または pro （デフォルト：base） |
| `max_results` | number | いいえ | 返す結果の最大数（デフォルト：5） |
| `max_chars_per_result` | number | いいえ | 結果ごとの最大文字数（デフォルト：1500） |
| `apiKey` | string | はい | Parallel AI APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `results` | array | 関連ページからの抜粋を含む検索結果 |

### `parallel_extract`

Parallel AIを使用して特定のURLから対象情報を抽出します。提供されたURLを処理し、目的に基づいて関連コンテンツを取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `urls` | string | はい | 情報を抽出するURLのカンマ区切りリスト |
| `objective` | string | はい | 提供されたURLから抽出する情報 |
| `excerpts` | boolean | はい | コンテンツから関連する抜粋を含めるかどうか |
| `full_content` | boolean | はい | ページの全コンテンツを含めるかどうか |
| `apiKey` | string | はい | Parallel AI APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `results` | array | 提供されたURLから抽出された情報 |

### `parallel_deep_research`

Parallel AIを使用してウェブ全体で包括的な詳細調査を実施します。引用付きで複数のソースからの情報を統合します。完了までに最大15分かかる場合があります。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `input` | string | はい | 研究クエリまたは質問（最大15,000文字） |
| `processor` | string | いいえ | 計算レベル：base、lite、pro、ultra、ultra2x、ultra4x、ultra8x（デフォルト：base） |
| `include_domains` | string | いいえ | 研究を制限するドメインのカンマ区切りリスト（ソースポリシー） |
| `exclude_domains` | string | いいえ | 研究から除外するドメインのカンマ区切りリスト（ソースポリシー） |
| `apiKey` | string | はい | Parallel AI APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `status` | string | タスクのステータス（完了、失敗） |
| `run_id` | string | この調査タスクの一意のID |
| `message` | string | ステータスメッセージ |
| `content` | object | 調査結果（output_schemaに基づいて構造化） |
| `basis` | array | 引用と情報源（根拠と信頼度レベルを含む） |

## 注意事項

- カテゴリー: `tools`
- タイプ: `parallel_ai`
```

--------------------------------------------------------------------------------

---[FILE: perplexity.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/perplexity.mdx

```text
---
title: Perplexity
description: Perplexity AIをチャットと検索に使用する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="perplexity"
  color="#20808D"
/>

{/* MANUAL-CONTENT-START:intro */}
[Perplexity AI](https://www.perplexity.ai)は、大規模言語モデルの能力とリアルタイムウェブ検索を組み合わせたAI駆動の検索エンジンおよび回答エンジンで、複雑な質問に対して正確で最新の情報と包括的な回答を提供します。

Perplexity AIを使用すると、以下のことが可能です：

- **正確な回答を得る**：信頼できる情報源からの引用付きで包括的な回答を受け取る
- **リアルタイム情報にアクセスする**：Perplexityのウェブ検索機能を通じて最新情報を入手する
- **トピックを深く探求する**：フォローアップ質問や関連情報でテーマをより深く掘り下げる
- **情報を検証する**：提供されたソースや参考文献を通じて回答の信頼性を確認する
- **コンテンツを生成する**：現在の情報に基づいて要約、分析、創造的なコンテンツを作成する
- **効率的に調査する**：複雑な質問に対する包括的な回答で調査プロセスを効率化する
- **会話形式でやり取りする**：自然な対話を通じて質問を洗練させ、トピックを探索する

Simでは、Perplexity統合によりエージェントがワークフローの一部としてこれらの強力なAI機能をプログラム的に活用できるようになります。これにより、自然言語理解、リアルタイム情報検索、コンテンツ生成を組み合わせた高度な自動化シナリオが可能になります。エージェントはクエリを作成し、引用付きの包括的な回答を受け取り、この情報を意思決定プロセスや出力に組み込むことができます。この統合により、ワークフロー自動化と最新かつ信頼性の高い情報へのアクセスの間のギャップが埋まり、エージェントがより情報に基づいた決定を下し、より正確な回答を提供できるようになります。SimとPerplexityを接続することで、最新情報を常に把握し、十分に調査された回答を提供し、ユーザーにより価値のある洞察を届けるエージェントを作成できます - すべて手動での調査や情報収集を必要とせずに実現できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Perplexityをワークフローに統合します。Perplexity AIチャットモデルを使用して文章を生成したり、高度なフィルタリングを使用してウェブ検索を実行したりできます。

## ツール

### `perplexity_chat`

Perplexity AIチャットモデルを使用して文章を生成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `systemPrompt` | string | いいえ | モデルの動作を導くシステムプロンプト |
| `content` | string | はい | モデルに送信するユーザーメッセージの内容 |
| `model` | string | はい | チャット生成に使用するモデル（例：sonar、mistral） |
| `max_tokens` | number | いいえ | 生成する最大トークン数 |
| `temperature` | number | いいえ | 0から1の間のサンプリング温度 |
| `apiKey` | string | はい | Perplexity APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 生成されたテキストコンテンツ |
| `model` | string | 生成に使用されたモデル |
| `usage` | object | トークン使用情報 |

### `perplexity_search`

Perplexityからランク付けされた検索結果を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 検索クエリまたはクエリの配列（マルチクエリ検索の場合は最大5つ） |
| `max_results` | number | いいえ | 返す検索結果の最大数（1-20、デフォルト：10） |
| `search_domain_filter` | array | いいえ | 検索結果を制限するドメイン/URLのリスト（最大20） |
| `max_tokens_per_page` | number | いいえ | 各ウェブページから取得する最大トークン数（デフォルト：1024） |
| `country` | string | いいえ | 検索結果をフィルタリングする国コード（例：US、GB、DE） |
| `search_recency_filter` | string | いいえ | 最新性で結果をフィルタリング：hour、day、week、month、またはyear |
| `search_after_date` | string | いいえ | この日付以降に公開されたコンテンツのみを含める（形式：MM/DD/YYYY） |
| `search_before_date` | string | いいえ | この日付以前に公開されたコンテンツのみを含める（形式：MM/DD/YYYY） |
| `apiKey` | string | はい | Perplexity APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `results` | array | 検索結果の配列 |

## 注意事項

- カテゴリ: `tools`
- タイプ: `perplexity`
```

--------------------------------------------------------------------------------

````
