---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 199
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 199 of 933)

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

---[FILE: elasticsearch.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/elasticsearch.mdx

```text
---
title: Elasticsearch
description: Elasticsearchでデータの検索、インデックス作成、管理を行う
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="elasticsearch"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Elasticsearch](https://www.elastic.co/elasticsearch/)は、大量のデータをリアルタイムでインデックス作成、検索、分析できる強力な分散型検索・分析エンジンです。検索機能、ログやイベントデータの分析、可観測性など、幅広い用途に利用されています。

SimのElasticsearchを使用すると、以下のような主要なElasticsearch機能にプログラムからアクセスできます：

- **ドキュメント検索**: Query DSLを使用して構造化または非構造化テキストの高度な検索を実行し、ソート、ページネーション、フィールド選択をサポートします。
- **ドキュメントのインデックス作成**: 新しいドキュメントを追加したり、任意のElasticsearchインデックス内の既存のドキュメントを更新したりして、即時に取得・分析できます。
- **ドキュメントの取得、更新、削除**: IDによって特定のドキュメントを取得、変更、または削除します。
- **一括操作**: 高スループットのデータ処理のために、単一のリクエストで複数のインデックス作成または更新アクションを実行します。
- **インデックス管理**: ワークフロー自動化の一部として、インデックスの作成、削除、または詳細の取得を行います。
- **クラスターモニタリング**: Elasticsearchデプロイメントの健全性と統計を確認します。

SimのElasticsearchツールは、セルフホスト型とElastic Cloudの両方の環境で動作します。Elasticsearchをエージェントワークフローに統合することで、データ取り込みの自動化、膨大なデータセットの検索、レポートの実行、検索機能を備えたカスタムアプリケーションの構築など、すべて手動介入なしで実行できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

強力な検索、インデックス作成、データ管理のためにElasticsearchをワークフローに統合します。ドキュメントのCRUD操作、高度な検索クエリ、一括操作、インデックス管理、クラスターモニタリングをサポートします。セルフホスト型とElastic Cloudの両方のデプロイメントで動作します。

## ツール

### `elasticsearch_search`

Query DSLを使用してElasticsearchでドキュメントを検索します。スコアとメタデータを含む一致するドキュメントを返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | はい | デプロイメントタイプ: self_hosted または cloud |
| `host` | string | いいえ | Elasticsearch ホストURL（self-hosted用） |
| `cloudId` | string | いいえ | Elastic Cloud ID（cloudデプロイメント用） |
| `authMethod` | string | はい | 認証方法: api_key または basic_auth |
| `apiKey` | string | いいえ | Elasticsearch APIキー |
| `username` | string | いいえ | 基本認証のユーザー名 |
| `password` | string | いいえ | 基本認証のパスワード |
| `index` | string | はい | 検索するインデックス名 |
| `query` | string | いいえ | JSON文字列としてのQuery DSL |
| `from` | number | いいえ | ページネーションの開始オフセット（デフォルト: 0） |
| `size` | number | いいえ | 返す結果の数（デフォルト: 10） |
| `sort` | string | いいえ | JSON文字列としてのソート指定 |
| `sourceIncludes` | string | いいえ | _sourceに含めるフィールドのカンマ区切りリスト |
| `sourceExcludes` | string | いいえ | _sourceから除外するフィールドのカンマ区切りリスト |
| `trackTotalHits` | boolean | いいえ | 正確なヒット数をカウントするかどうか（デフォルト: true） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `took` | number | 検索にかかった時間（ミリ秒） |
| `timed_out` | boolean | 検索がタイムアウトしたかどうか |
| `hits` | object | 合計カウントと一致するドキュメントを含む検索結果 |
| `aggregations` | json | 集計結果（ある場合） |

### `elasticsearch_index_document`

Elasticsearchにドキュメントをインデックス（作成または更新）します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | はい | デプロイメントタイプ: self_hosted または cloud |
| `host` | string | いいえ | Elasticsearch ホスト URL （self-hosted の場合） |
| `cloudId` | string | いいえ | Elastic Cloud ID （cloud デプロイメントの場合） |
| `authMethod` | string | はい | 認証方法: api_key または basic_auth |
| `apiKey` | string | いいえ | Elasticsearch API キー |
| `username` | string | いいえ | 基本認証のユーザー名 |
| `password` | string | いいえ | 基本認証のパスワード |
| `index` | string | はい | 対象インデックス名 |
| `documentId` | string | いいえ | ドキュメント ID （指定しない場合は自動生成） |
| `document` | string | はい | JSON 文字列としてのドキュメント本文 |
| `refresh` | string | いいえ | リフレッシュポリシー: true, false, または wait_for |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `_index` | string | ドキュメントが保存されたインデックス |
| `_id` | string | ドキュメント ID |
| `_version` | number | ドキュメントバージョン |
| `result` | string | 操作結果 （created または updated） |

### `elasticsearch_get_document`

Elasticsearchから ID によりドキュメントを取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | はい | デプロイメントタイプ: self_hosted または cloud |
| `host` | string | いいえ | Elasticsearch ホスト URL （self-hosted の場合） |
| `cloudId` | string | いいえ | Elastic Cloud ID （cloud デプロイメントの場合） |
| `authMethod` | string | はい | 認証方法: api_key または basic_auth |
| `apiKey` | string | いいえ | Elasticsearch API キー |
| `username` | string | いいえ | 基本認証のユーザー名 |
| `password` | string | いいえ | 基本認証のパスワード |
| `index` | string | はい | インデックス名 |
| `documentId` | string | はい | 取得するドキュメント ID |
| `sourceIncludes` | string | いいえ | 含めるフィールドのカンマ区切りリスト |
| `sourceExcludes` | string | いいえ | 除外するフィールドのカンマ区切りリスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `_index` | string | インデックス名 |
| `_id` | string | ドキュメントID |
| `_version` | number | ドキュメントバージョン |
| `found` | boolean | ドキュメントが見つかったかどうか |
| `_source` | json | ドキュメントの内容 |

### `elasticsearch_update_document`

docマージを使用してElasticsearchのドキュメントを部分的に更新します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | はい | デプロイメントタイプ: self_hosted または cloud |
| `host` | string | いいえ | Elasticsearch ホストURL（self_hosted用） |
| `cloudId` | string | いいえ | Elastic Cloud ID（cloudデプロイメント用） |
| `authMethod` | string | はい | 認証方法: api_key または basic_auth |
| `apiKey` | string | いいえ | Elasticsearch APIキー |
| `username` | string | いいえ | 基本認証のユーザー名 |
| `password` | string | いいえ | 基本認証のパスワード |
| `index` | string | はい | インデックス名 |
| `documentId` | string | はい | 更新するドキュメントID |
| `document` | string | はい | マージする部分的なドキュメント（JSON文字列形式） |
| `retryOnConflict` | number | いいえ | バージョン競合時の再試行回数 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `_index` | string | インデックス名 |
| `_id` | string | ドキュメントID |
| `_version` | number | 新しいドキュメントバージョン |
| `result` | string | 操作結果（updated または noop） |

### `elasticsearch_delete_document`

IDによってElasticsearchからドキュメントを削除します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | はい | デプロイメントタイプ: self_hosted または cloud |
| `host` | string | いいえ | Elasticsearch ホスト URL （self-hosted の場合） |
| `cloudId` | string | いいえ | Elastic Cloud ID （cloud デプロイメントの場合） |
| `authMethod` | string | はい | 認証方法: api_key または basic_auth |
| `apiKey` | string | いいえ | Elasticsearch API キー |
| `username` | string | いいえ | 基本認証のユーザー名 |
| `password` | string | いいえ | 基本認証のパスワード |
| `index` | string | はい | インデックス名 |
| `documentId` | string | はい | 削除するドキュメントID |
| `refresh` | string | いいえ | リフレッシュポリシー: true、false、または wait_for |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `_index` | string | インデックス名 |
| `_id` | string | ドキュメントID |
| `_version` | number | ドキュメントバージョン |
| `result` | string | 操作結果（deleted または not_found） |

### `elasticsearch_bulk`

高パフォーマンスのために、複数のインデックス作成、削除、または更新操作を1つのリクエストで実行します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | はい | デプロイメントタイプ: self_hosted または cloud |
| `host` | string | いいえ | Elasticsearch ホスト URL （self-hosted の場合） |
| `cloudId` | string | いいえ | Elastic Cloud ID （cloud デプロイメントの場合） |
| `authMethod` | string | はい | 認証方法: api_key または basic_auth |
| `apiKey` | string | いいえ | Elasticsearch API キー |
| `username` | string | いいえ | 基本認証のユーザー名 |
| `password` | string | いいえ | 基本認証のパスワード |
| `index` | string | いいえ | インデックスを指定しない操作のデフォルトインデックス |
| `operations` | string | はい | NDJSON文字列（改行区切りJSON）としての一括操作 |
| `refresh` | string | いいえ | リフレッシュポリシー: true、false、または wait_for |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `took` | number | 一括操作にかかった時間（ミリ秒） |
| `errors` | boolean | いずれかの操作でエラーが発生したかどうか |
| `items` | array | 各操作の結果 |

### `elasticsearch_count`

Elasticsearchでクエリに一致するドキュメント数をカウントします。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | はい | デプロイメントタイプ: self_hosted または cloud |
| `host` | string | いいえ | Elasticsearch ホスト URL（self_hosted の場合） |
| `cloudId` | string | いいえ | Elastic Cloud ID（cloud デプロイメントの場合） |
| `authMethod` | string | はい | 認証方法: api_key または basic_auth |
| `apiKey` | string | いいえ | Elasticsearch API キー |
| `username` | string | いいえ | 基本認証のユーザー名 |
| `password` | string | いいえ | 基本認証のパスワード |
| `index` | string | はい | ドキュメントをカウントするインデックス名 |
| `query` | string | いいえ | ドキュメントをフィルタリングするオプションクエリ（JSON文字列） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `count` | number | クエリに一致するドキュメント数 |
| `_shards` | object | シャード統計 |

### `elasticsearch_create_index`

オプションの設定とマッピングを使用して新しいインデックスを作成します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | はい | デプロイメントタイプ: self_hosted または cloud |
| `host` | string | いいえ | Elasticsearch ホスト URL（self_hosted の場合） |
| `cloudId` | string | いいえ | Elastic Cloud ID（cloud デプロイメントの場合） |
| `authMethod` | string | はい | 認証方法: api_key または basic_auth |
| `apiKey` | string | いいえ | Elasticsearch API キー |
| `username` | string | いいえ | 基本認証のユーザー名 |
| `password` | string | いいえ | 基本認証のパスワード |
| `index` | string | はい | 作成するインデックス名 |
| `settings` | string | いいえ | JSON文字列としてのインデックス設定 |
| `mappings` | string | いいえ | JSON文字列としてのインデックスマッピング |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `acknowledged` | boolean | リクエストが承認されたかどうか |
| `shards_acknowledged` | boolean | シャードが承認されたかどうか |
| `index` | string | 作成されたインデックス名 |

### `elasticsearch_delete_index`

インデックスとそのすべてのドキュメントを削除します。この操作は元に戻せません。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | はい | デプロイメントタイプ: self_hosted または cloud |
| `host` | string | いいえ | Elasticsearch ホスト URL （self-hosted の場合） |
| `cloudId` | string | いいえ | Elastic Cloud ID （cloud デプロイメントの場合） |
| `authMethod` | string | はい | 認証方法: api_key または basic_auth |
| `apiKey` | string | いいえ | Elasticsearch API キー |
| `username` | string | いいえ | 基本認証のユーザー名 |
| `password` | string | いいえ | 基本認証のパスワード |
| `index` | string | はい | 削除するインデックス名 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `acknowledged` | boolean | 削除が承認されたかどうか |

### `elasticsearch_get_index`

設定、マッピング、エイリアスを含むインデックス情報を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | はい | デプロイメントタイプ: self_hosted または cloud |
| `host` | string | いいえ | Elasticsearch ホスト URL （self-hosted の場合） |
| `cloudId` | string | いいえ | Elastic Cloud ID （cloud デプロイメントの場合） |
| `authMethod` | string | はい | 認証方法: api_key または basic_auth |
| `apiKey` | string | いいえ | Elasticsearch API キー |
| `username` | string | いいえ | 基本認証のユーザー名 |
| `password` | string | いいえ | 基本認証のパスワード |
| `index` | string | はい | 情報を取得するインデックス名 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `index` | json | エイリアス、マッピング、設定を含むインデックス情報 |

### `elasticsearch_cluster_health`

Elasticsearchクラスターの健全性ステータスを取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | はい | デプロイメントタイプ: self_hosted または cloud |
| `host` | string | いいえ | Elasticsearch ホスト URL \(self_hosted の場合\) |
| `cloudId` | string | いいえ | Elastic Cloud ID \(cloud デプロイメントの場合\) |
| `authMethod` | string | はい | 認証方法: api_key または basic_auth |
| `apiKey` | string | いいえ | Elasticsearch API キー |
| `username` | string | いいえ | 基本認証のユーザー名 |
| `password` | string | いいえ | 基本認証のパスワード |
| `waitForStatus` | string | いいえ | クラスターがこのステータスに達するまで待機: green、yellow、または red |
| `timeout` | string | いいえ | 待機操作のタイムアウト \(例: 30s、1m\) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `cluster_name` | string | クラスターの名前 |
| `status` | string | クラスターの健全性ステータス: green、yellow、または red |
| `number_of_nodes` | number | クラスター内のノードの総数 |
| `number_of_data_nodes` | number | データノードの数 |
| `active_shards` | number | アクティブなシャードの数 |
| `unassigned_shards` | number | 未割り当てのシャードの数 |

### `elasticsearch_cluster_stats`

Elasticsearchクラスターに関する包括的な統計情報を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `deploymentType` | string | はい | デプロイメントタイプ: self_hosted または cloud |
| `host` | string | いいえ | Elasticsearch ホスト URL （self-hosted の場合） |
| `cloudId` | string | いいえ | Elastic Cloud ID （cloud デプロイメントの場合） |
| `authMethod` | string | はい | 認証方法: api_key または basic_auth |
| `apiKey` | string | いいえ | Elasticsearch API キー |
| `username` | string | いいえ | 基本認証のユーザー名 |
| `password` | string | いいえ | 基本認証のパスワード |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `cluster_name` | string | クラスターの名前 |
| `status` | string | クラスターの健全性ステータス |
| `nodes` | object | ノード数とバージョンを含むノード統計 |
| `indices` | object | ドキュメント数とストアサイズを含むインデックス統計 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `elasticsearch`
```

--------------------------------------------------------------------------------

---[FILE: elevenlabs.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/elevenlabs.mdx

```text
---
title: ElevenLabs
description: ElevenLabsを使用してTTSに変換
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="elevenlabs"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[ElevenLabs](https://elevenlabs.io/)は、信じられないほど自然で表現力豊かなAI音声を作成する最先端のテキスト読み上げプラットフォームです。現在利用可能な中で最もリアルで感情豊かな合成音声を提供しており、生き生きとしたオーディオコンテンツの作成に最適です。

ElevenLabsでは、以下のことが可能です：

- **自然な音声の生成**：人間の声とほぼ区別がつかないオーディオを作成
- **多様な音声オプションから選択**：異なるアクセント、トーン、特性を持つ既製の音声ライブラリにアクセス
- **音声のクローン作成**：音声サンプルに基づいてカスタム音声を作成（適切な許可を得た上で）
- **音声パラメータの制御**：安定性、明瞭さ、感情的なトーンを調整して出力を微調整
- **リアルな感情の追加**：幸福、悲しみ、興奮などの自然な感情を取り入れる

Simでは、ElevenLabs統合によりエージェントがテキストを生き生きとした音声に変換でき、アプリケーションのインタラクティブ性と魅力を高めることができます。これは特に音声アシスタントの作成、オーディオコンテンツの生成、アクセシブルなアプリケーションの開発、より人間らしく感じる会話インターフェースの構築に価値があります。この統合により、ElevenLabsの高度な音声合成機能をエージェントワークフローにシームレスに組み込み、テキストベースのAIと自然な人間のコミュニケーションの間のギャップを埋めることができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

ElevenLabsをワークフローに統合します。テキストを音声に変換できます。APIキーが必要です。

## ツール

### `elevenlabs_tts`

ElevenLabsの音声を使用してTTSに変換

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `text` | string | はい | 音声に変換するテキスト |
| `voiceId` | string | はい | 使用する音声のID |
| `modelId` | string | いいえ | 使用するモデルのID（デフォルトはeleven_monolingual_v1） |
| `apiKey` | string | はい | あなたのElevenLabs APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成された音声のURL |
| `audioFile` | file | 生成された音声ファイル |

## 注意事項

- カテゴリー: `tools`
- タイプ: `elevenlabs`
```

--------------------------------------------------------------------------------

---[FILE: exa.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/exa.mdx

```text
---
title: Exa
description: Exa AIで検索
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="exa"
  color="#1F40ED"
/>

{/* MANUAL-CONTENT-START:intro */}
[Exa](https://exa.ai/)は、開発者や研究者向けに特別に設計されたAI搭載の検索エンジンで、ウェブ全体から高い関連性と最新の情報を提供します。高度なセマンティック検索機能とAI理解を組み合わせることで、従来の検索エンジンよりも正確で文脈に関連した結果を提供します。

Exaでは、以下のことができます：

- **自然言語で検索**: 会話形式のクエリや質問を使用して情報を見つける
- **正確な結果を取得**: セマンティック理解による高い関連性のある検索結果を受け取る
- **最新情報にアクセス**: ウェブ全体から最新の情報を取得する
- **類似コンテンツを見つける**: コンテンツの類似性に基づいて関連リソースを発見する
- **ウェブページの内容を抽出**: ウェブページの全文を取得して処理する
- **引用付きで質問に回答**: 質問をして、情報源を示した直接的な回答を受け取る
- **研究タスクを実行**: 情報の収集、統合、要約のための複数ステップの研究ワークフローを自動化する

Simでは、Exa統合によりエージェントがウェブ上の情報を検索したり、特定のURLからコンテンツを取得したり、類似リソースを見つけたり、引用付きで質問に回答したり、研究タスクを実行したりすることが可能になります—すべてAPIコールを通じてプログラム的に行えます。これにより、エージェントはインターネットからリアルタイムの情報にアクセスでき、正確で最新かつ関連性の高い回答を提供する能力が向上します。この統合は特に研究タスク、情報収集、コンテンツ発見、ウェブ全体から最新情報を必要とする質問への回答に価値があります。
{/* MANUAL-CONTENT-END */}

## 使用方法

Exaをワークフローに統合します。検索、コンテンツ取得、類似リンクの検索、質問への回答、研究の実行が可能です。APIキーが必要です。

## ツール

### `exa_search`

Exa AIを使用してウェブを検索します。タイトル、URL、テキストスニペットを含む関連性の高い検索結果を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 実行する検索クエリ |
| `numResults` | number | いいえ | 返す結果の数（デフォルト：10、最大：25） |
| `useAutoprompt` | boolean | いいえ | クエリを改善するためにオートプロンプトを使用するかどうか（デフォルト：false） |
| `type` | string | いいえ | 検索タイプ：neural、keyword、auto、またはfast（デフォルト：auto） |
| `includeDomains` | string | いいえ | 結果に含めるドメインのカンマ区切りリスト |
| `excludeDomains` | string | いいえ | 結果から除外するドメインのカンマ区切りリスト |
| `category` | string | いいえ | カテゴリによるフィルタリング：company、research paper、news、pdf、github、tweet、personal site、linkedin profile、financial report |
| `text` | boolean | いいえ | 結果に全文コンテンツを含める（デフォルト：false） |
| `highlights` | boolean | いいえ | 結果にハイライトされたスニペットを含める（デフォルト：false） |
| `summary` | boolean | いいえ | 結果にAI生成の要約を含める（デフォルト：false） |
| `livecrawl` | string | いいえ | ライブクロールモード：never（デフォルト）、fallback、always、またはpreferred（常にライブクロールを試み、失敗した場合はキャッシュにフォールバック） |
| `apiKey` | string | はい | Exa AI APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `results` | array | タイトル、URL、テキストスニペットを含む検索結果 |

### `exa_get_contents`

Exa AIを使用してウェブページのコンテンツを取得します。各URLのタイトル、テキストコンテンツ、およびオプションの要約を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `urls` | string | はい | コンテンツを取得するURLのカンマ区切りリスト |
| `text` | boolean | いいえ | trueの場合、デフォルト設定で完全なページテキストを返します。falseの場合、テキスト返却を無効にします。 |
| `summaryQuery` | string | いいえ | 要約生成をガイドするクエリ |
| `subpages` | number | いいえ | 提供されたURLからクロールするサブページの数 |
| `subpageTarget` | string | いいえ | 特定のサブページをターゲットにするためのカンマ区切りキーワード（例："docs,tutorial,about"） |
| `highlights` | boolean | いいえ | 結果にハイライトされたスニペットを含める（デフォルト：false） |
| `livecrawl` | string | いいえ | ライブクロールモード：never（デフォルト）、fallback、always、またはpreferred（常にライブクロールを試み、失敗した場合はキャッシュにフォールバック） |
| `apiKey` | string | はい | Exa AI APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `results` | array | タイトル、テキスト、要約を含むURLから取得したコンテンツ |

### `exa_find_similar_links`

Exa AIを使用して、指定されたURLに類似したウェブページを検索します。タイトルとテキストスニペットを含む類似リンクのリストを返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `url` | string | はい | 類似リンクを検索するURL |
| `numResults` | number | いいえ | 返す類似リンクの数（デフォルト：10、最大：25） |
| `text` | boolean | いいえ | 類似ページの全文を含めるかどうか |
| `includeDomains` | string | いいえ | 結果に含めるドメインのカンマ区切りリスト |
| `excludeDomains` | string | いいえ | 結果から除外するドメインのカンマ区切りリスト |
| `excludeSourceDomain` | boolean | いいえ | 結果からソースドメインを除外する（デフォルト：false） |
| `highlights` | boolean | いいえ | 結果にハイライトされたスニペットを含める（デフォルト：false） |
| `summary` | boolean | いいえ | 結果にAI生成の要約を含める（デフォルト：false） |
| `livecrawl` | string | いいえ | ライブクロールモード：never（デフォルト）、fallback、always、またはpreferred（常にライブクロールを試み、失敗した場合はキャッシュにフォールバック） |
| `apiKey` | string | はい | Exa AI APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `similarLinks` | array | タイトル、URL、テキストスニペットを含む類似リンク |

### `exa_answer`

Exa AIを使用してウェブからの引用付きでAIが生成した質問への回答を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 回答する質問 |
| `text` | boolean | いいえ | 回答の全文を含めるかどうか |
| `apiKey` | string | はい | Exa AI APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `answer` | string | 質問に対するAI生成の回答 |
| `citations` | array | 回答の情報源と引用 |

### `exa_research`

AIを使用して包括的な調査を行い、引用付きの詳細なレポートを生成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 調査クエリまたはトピック |
| `model` | string | いいえ | 調査モデル: exa-research-fast、exa-research（デフォルト）、または exa-research-pro |
| `apiKey` | string | はい | Exa AI APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `research` | array | 引用と要約を含む包括的な調査結果 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `exa`
```

--------------------------------------------------------------------------------

---[FILE: file.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/file.mdx

```text
---
title: ファイル
description: 複数のファイルを読み込んで解析する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="file"
  color="#40916C"
/>

{/* MANUAL-CONTENT-START:intro */}
ファイルパーサーツールは、さまざまなファイル形式からコンテンツを抽出して処理する強力な方法を提供し、エージェントワークフローにドキュメントデータを簡単に組み込むことができます。このツールは複数のファイル形式をサポートし、最大200MBのサイズのファイルを処理できます。

ファイルパーサーを使用すると、以下のことが可能です：

- **複数のファイル形式を処理**: PDF、CSV、Wordドキュメント（DOCX）、テキストファイルなどからテキストを抽出
- **大きなファイルを処理**: 最大200MBサイズのドキュメントを処理
- **URLからファイルを解析**: オンラインでホストされているファイルのURLを提供することで、直接コンテンツを抽出
- **複数のファイルを一度に処理**: 一回の操作で複数のファイルをアップロードして解析
- **構造化データを抽出**: 可能な限り元のドキュメントからフォーマットと構造を維持

ファイルパーサーツールは、エージェントがレポートの分析、スプレッドシートからのデータ抽出、さまざまなドキュメントソースからのテキスト処理など、ドキュメントコンテンツを扱う必要があるシナリオで特に役立ちます。ドキュメントコンテンツをエージェントが利用できるようにするプロセスを簡素化し、直接テキスト入力と同じくらい簡単にファイルに保存された情報を扱うことができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

ワークフローにファイルを統合します。手動でファイルをアップロードするか、ファイルURLを挿入することができます。

## ツール

### `file_parser`

アップロードされたファイルまたはURL（テキスト、PDF、CSV、画像など）からのファイルを1つ以上解析します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `filePath` | string | はい | ファイルへのパス。単一のパス、URL、またはパスの配列が可能です。 |
| `fileType` | string | いいえ | 解析するファイルの種類（指定しない場合は自動検出されます） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `files` | array | 解析されたファイルの配列 |
| `combinedContent` | string | すべての解析されたファイルの結合コンテンツ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `file`
```

--------------------------------------------------------------------------------

---[FILE: firecrawl.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/firecrawl.mdx

```text
---
title: Firecrawl
description: ウェブデータのスクレイピング、検索、クロール、マッピング、抽出
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="firecrawl"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
[Firecrawl](https://firecrawl.dev/)は、強力なウェブスクレイピングおよびコンテンツ抽出APIで、Simにシームレスに統合され、開発者があらゆるウェブサイトからクリーンで構造化されたコンテンツを抽出できるようにします。この統合により、ウェブページを必要なコンテンツを保持したまま、MarkdownやHTMLなどの使いやすいデータ形式に変換する簡単な方法を提供します。

SimでFirecrawlを使用すると、以下のことが可能です：

- **クリーンなコンテンツの抽出**: 広告、ナビゲーション要素、その他の気を散らすものを削除し、メインコンテンツのみを取得
- **構造化フォーマットへの変換**: ウェブページをMarkdown、HTML、またはJSONに変換
- **メタデータの取得**: SEOメタデータ、Open Graphタグ、その他のページ情報を抽出
- **JavaScriptを多用したサイトの処理**: JavaScriptに依存する最新のウェブアプリケーションからコンテンツを処理
- **コンテンツのフィルタリング**: CSSセレクタを使用してページの特定の部分に焦点を当てる
- **大規模な処理**: 信頼性の高いAPIで大量のスクレイピングニーズに対応
- **ウェブ検索**: インテリジェントなウェブ検索を実行し、構造化された結果を取得
- **サイト全体のクロール**: ウェブサイトから複数のページをクロールし、そのコンテンツを集約

Simでは、Firecrawl統合によりエージェントがワークフローの一部としてプログラムでウェブコンテンツにアクセスして処理することができます。サポートされている操作には以下が含まれます：

- **スクレイプ**: 単一のウェブページから構造化されたコンテンツ（Markdown、HTML、メタデータ）を抽出。
- **検索**: Firecrawlのインテリジェントな検索機能を使用してウェブ情報を検索。
- **クロール**: ウェブサイトから複数のページをクロールし、各ページの構造化されたコンテンツとメタデータを返す。

これにより、エージェントはウェブサイトから情報を収集し、構造化データを抽出し、その情報を使用して決定を下したり洞察を生成したりすることができます—すべて生のHTML解析やブラウザ自動化の複雑さに対処する必要なく。FirecrawlブロックをAPIキーで構成し、操作（スクレイプ、検索、またはクロール）を選択し、関連するパラメータを提供するだけです。エージェントはすぐにクリーンで構造化された形式でウェブコンテンツの操作を開始できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Firecrawlをワークフローに統合します。ページのスクレイピング、ウェブ検索、サイト全体のクローリング、URL構造のマッピング、AIによる構造化データの抽出が可能です。

## ツール

### `firecrawl_scrape`

ウェブページから構造化されたコンテンツを包括的なメタデータサポートで抽出します。コンテンツをマークダウンやHTMLに変換しながら、SEOメタデータ、Open Graphタグ、ページ情報をキャプチャします。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `url` | string | はい | コンテンツをスクレイピングするURL |
| `scrapeOptions` | json | いいえ | コンテンツスクレイピングのオプション |
| `apiKey` | string | はい | Firecrawl APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `markdown` | string | マークダウン形式のページコンテンツ |
| `html` | string | ページの生HTMLコンテンツ |
| `metadata` | object | SEOやOpen Graph情報を含むページメタデータ |

### `firecrawl_search`

Firecrawlを使用してウェブ上の情報を検索します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 使用する検索クエリ |
| `apiKey` | string | はい | Firecrawl APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `data` | array | 検索結果データ |

### `firecrawl_crawl`

ウェブサイト全体をクロールし、アクセス可能なすべてのページから構造化されたコンテンツを抽出します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `url` | string | はい | クロールするウェブサイトURL |
| `limit` | number | いいえ | クロールするページの最大数（デフォルト：100） |
| `onlyMainContent` | boolean | いいえ | ページからメインコンテンツのみを抽出する |
| `apiKey` | string | はい | Firecrawl APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `pages` | array | クロールされたページとそのコンテンツおよびメタデータの配列 |

### `firecrawl_map`

任意のウェブサイトからURLの完全なリストを迅速かつ確実に取得します。サイト上のすべてのページをクロールせずに発見するのに役立ちます。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `url` | string | はい | リンクを発見・マッピングするベースURL |
| `search` | string | いいえ | 検索語に関連する結果でフィルタリング（例：「blog」） |
| `sitemap` | string | いいえ | サイトマップの使用方法：「skip」、「include」（デフォルト）、または「only」 |
| `includeSubdomains` | boolean | いいえ | サブドメインからのURLを含めるかどうか（デフォルト：true） |
| `ignoreQueryParameters` | boolean | いいえ | クエリ文字列を含むURLを除外する（デフォルト：true） |
| `limit` | number | いいえ | 返すリンクの最大数（最大：100,000、デフォルト：5,000） |
| `timeout` | number | いいえ | リクエストタイムアウト（ミリ秒） |
| `location` | json | いいえ | プロキシの地理的コンテキスト（国、言語） |
| `apiKey` | string | はい | Firecrawl APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | マッピング操作が成功したかどうか |
| `links` | array | ウェブサイトから発見されたURLの配列 |

### `firecrawl_extract`

自然言語プロンプトとJSONスキーマを使用して、ウェブページ全体から構造化データを抽出します。インテリジェントなデータ抽出のための強力なエージェント機能です。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `urls` | json | はい | データを抽出するURLの配列（glob形式をサポート） |
| `prompt` | string | いいえ | 抽出プロセスのための自然言語ガイダンス |
| `schema` | json | いいえ | 抽出するデータの構造を定義するJSONスキーマ |
| `enableWebSearch` | boolean | いいえ | 補足情報を見つけるためのウェブ検索を有効にする（デフォルト：false） |
| `ignoreSitemap` | boolean | いいえ | スキャン中にsitemap.xmlファイルを無視する（デフォルト：false） |
| `includeSubdomains` | boolean | いいえ | サブドメインにスキャンを拡張する（デフォルト：true） |
| `showSources` | boolean | いいえ | レスポンスにデータソースを含める（デフォルト：false） |
| `ignoreInvalidURLs` | boolean | いいえ | 配列内の無効なURLをスキップする（デフォルト：true） |
| `scrapeOptions` | json | いいえ | 高度なスクレイピング設定オプション |
| `apiKey` | string | はい | Firecrawl APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 抽出操作が成功したかどうか |
| `data` | object | スキーマまたはプロンプトに従って抽出された構造化データ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `firecrawl`
```

--------------------------------------------------------------------------------

---[FILE: generic_webhook.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/generic_webhook.mdx

```text
---
title: Webhook
description: カスタムウェブフックを設定して、任意のサービスからウェブフックを受信します。
---

import { BlockInfoCard } from "@/components/ui/block-info-card"
import { Image } from '@/components/ui/image'

<BlockInfoCard 
  type="generic_webhook"
  color="#10B981"
/>

<div className="flex justify-center">
  <Image
    src="/static/blocks/webhook.png"
    alt="Webhookブロックの設定"
    width={500}
    height={400}
    className="my-6"
  />
</div>

## 概要

汎用Webhookブロックを使用すると、任意の外部サービスからWebhookを受信できます。これは柔軟なトリガーであり、あらゆるJSONペイロードを処理できるため、専用のSimブロックがないサービスとの統合に最適です。

## 基本的な使用方法

### シンプルなパススルーモード

入力フォーマットを定義しない場合、Webhookはリクエスト本文全体をそのまま渡します：

```bash
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "message": "Test webhook trigger",
    "data": {
      "key": "value"
    }
  }'
```

下流のブロックでデータにアクセスする方法：
- `<webhook1.message>` → "Test webhook trigger"
- `<webhook1.data.key>` → "value"

### 構造化入力フォーマット（オプション）

入力スキーマを定義して、型付きフィールドを取得し、ファイルアップロードなどの高度な機能を有効にします：

**入力フォーマット設定：**

```json
[
  { "name": "message", "type": "string" },
  { "name": "priority", "type": "number" },
  { "name": "documents", "type": "files" }
]
```

**Webhookリクエスト：**

```bash
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "message": "Invoice submission",
    "priority": 1,
    "documents": [
      {
        "type": "file",
        "data": "data:application/pdf;base64,JVBERi0xLjQK...",
        "name": "invoice.pdf",
        "mime": "application/pdf"
      }
    ]
  }'
```

## ファイルアップロード

### サポートされているファイル形式

Webhookは2つのファイル入力形式をサポートしています：

#### 1. Base64エンコードファイル
ファイルコンテンツを直接アップロードする場合：

```json
{
  "documents": [
    {
      "type": "file",
      "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
      "name": "screenshot.png",
      "mime": "image/png"
    }
  ]
}
```

- **最大サイズ**: ファイルあたり20MB
- **フォーマット**: Base64エンコーディングを使用した標準データURL
- **ストレージ**: ファイルは安全な実行ストレージにアップロードされます

#### 2. URL参照
既存のファイルURLを渡す場合：

```json
{
  "documents": [
    {
      "type": "url",
      "data": "https://example.com/files/document.pdf",
      "name": "document.pdf",
      "mime": "application/pdf"
    }
  ]
}
```

### 下流のブロックでファイルにアクセスする

ファイルは以下のプロパティを持つ `UserFile` オブジェクトに処理されます：

```typescript
{
  id: string,          // Unique file identifier
  name: string,        // Original filename
  url: string,         // Presigned URL (valid for 5 minutes)
  size: number,        // File size in bytes
  type: string,        // MIME type
  key: string,         // Storage key
  uploadedAt: string,  // ISO timestamp
  expiresAt: string    // ISO timestamp (5 minutes)
}
```

**ブロック内でのアクセス:**
- `<webhook1.documents[0].url>` → ダウンロードURL
- `<webhook1.documents[0].name>` → "invoice.pdf"
- `<webhook1.documents[0].size>` → 524288
- `<webhook1.documents[0].type>` → "application/pdf"

### ファイルアップロードの完全な例

```bash
# Create a base64-encoded file
echo "Hello World" | base64
# SGVsbG8gV29ybGQK

# Send webhook with file
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret" \
  -d '{
    "subject": "Document for review",
    "attachments": [
      {
        "type": "file",
        "data": "data:text/plain;base64,SGVsbG8gV29ybGQK",
        "name": "sample.txt",
        "mime": "text/plain"
      }
    ]
  }'
```

## 認証

### 認証の設定（オプション）

ウェブフック設定で：
1. 「認証を要求する」を有効にする
2. シークレットトークンを設定する
3. ヘッダータイプを選択する：
   - **カスタムヘッダー**: `X-Sim-Secret: your-token`
   - **認証ベアラー**: `Authorization: Bearer your-token`

### 認証の使用

```bash
# With custom header
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "X-Sim-Secret: your-secret-token" \
  -d '{"message": "Authenticated request"}'

# With bearer token
curl -X POST https://sim.ai/api/webhooks/trigger/{webhook-path} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{"message": "Authenticated request"}'
```

## ベストプラクティス

1. **構造化のための入力フォーマットの使用**: 予想されるスキーマがわかっている場合は入力フォーマットを定義してください。これにより以下が提供されます：
   - 型の検証
   - エディタでのより良いオートコンプリート
   - ファイルアップロード機能

2. **認証**: 不正アクセスを防ぐため、本番環境のウェブフックには常に認証を有効にしてください。

3. **ファイルサイズの制限**: ファイルは20MB未満に保ってください。より大きなファイルの場合は、代わりにURL参照を使用してください。

4. **ファイルの有効期限**: ダウンロードされたファイルのURLは5分間有効です。すぐに処理するか、長期間必要な場合は別の場所に保存してください。

5. **エラー処理**: ウェブフック処理は非同期です。エラーについては実行ログを確認してください。

6. **テスト**: 設定をデプロイする前に、エディタの「ウェブフックをテスト」ボタンを使用して設定を検証してください。

## ユースケース

- **フォーム送信**: ファイルアップロード機能を持つカスタムフォームからデータを受け取る
- **サードパーティ連携**: ウェブフックを送信するサービス（Stripe、GitHubなど）と接続する
- **ドキュメント処理**: 外部システムからドキュメントを受け取って処理する
- **イベント通知**: さまざまなソースからイベントデータを受け取る
- **カスタムAPI**: アプリケーション用のカスタムAPIエンドポイントを構築する

## 注意事項

- カテゴリ：`triggers`
- タイプ：`generic_webhook`
- **ファイルサポート**：入力フォーマット設定で利用可能
- **最大ファイルサイズ**：ファイルあたり20MB
```

--------------------------------------------------------------------------------

````
