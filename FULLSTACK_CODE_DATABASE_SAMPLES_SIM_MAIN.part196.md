---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 196
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 196 of 933)

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

---[FILE: troubleshooting.mdx]---
Location: sim-main/apps/docs/content/docs/ja/self-hosting/troubleshooting.mdx

```text
---
title: トラブルシューティング
description: 一般的な問題と解決策
---

## データベース接続に失敗

```bash
# Check database is running
docker compose ps db

# Test connection
docker compose exec db psql -U postgres -c "SELECT 1"
```

`DATABASE_URL` 形式を確認してください: `postgresql://user:pass@host:5432/database`

## Ollamaモデルが表示されない

Docker内では、`localhost` = ホストマシンではなく、コンテナを指します。

```bash
# For host-machine Ollama, use:
OLLAMA_URL=http://host.docker.internal:11434  # macOS/Windows
OLLAMA_URL=http://192.168.1.x:11434           # Linux (use actual IP)
```

## WebSocket/リアルタイム機能が動作しない

1. `NEXT_PUBLIC_SOCKET_URL` がドメインと一致しているか確認する
2. リアルタイムサービスが実行されているか確認する: `docker compose ps realtime`
3. リバースプロキシがWebSocketアップグレードを通過させていることを確認する（[Dockerガイド](/self-hosting/docker)を参照）

## 502 Bad Gateway

```bash
# Check app is running
docker compose ps simstudio
docker compose logs simstudio

# Common causes: out of memory, database not ready
```

## マイグレーションエラー

```bash
# View migration logs
docker compose logs migrations

# Run manually
docker compose exec simstudio bun run db:migrate
```

## pgvectorが見つからない

正しいPostgreSQLイメージを使用してください：

```yaml
image: pgvector/pgvector:pg17  # NOT postgres:17
```

## 証明書エラー（CERT_HAS_EXPIRED）

外部APIを呼び出す際にSSL証明書エラーが表示される場合：

```bash
# Update CA certificates in container
docker compose exec simstudio apt-get update && apt-get install -y ca-certificates

# Or set in environment (not recommended for production)
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## ログイン後の空白ページ

1. ブラウザコンソールでエラーを確認する
2. `NEXT_PUBLIC_APP_URL` が実際のドメインと一致しているか確認する
3. ブラウザのCookieとローカルストレージをクリアする
4. すべてのサービスが実行されているか確認する: `docker compose ps`

## Windows特有の問題

**WindowsでのTurbopackエラー：**

```bash
# Use WSL2 for better compatibility
wsl --install

# Or disable Turbopack in package.json
# Change "next dev --turbopack" to "next dev"
```

**改行の問題：**

```bash
# Configure git to use LF
git config --global core.autocrlf input
```

## ログを表示

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f simstudio
```

## ヘルプを得る

- [GitHub Issues](https://github.com/simstudioai/sim/issues)
- [Discord](https://discord.gg/Hr4UWYEcTT)
```

--------------------------------------------------------------------------------

---[FILE: ahrefs.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/ahrefs.mdx

```text
---
title: Ahrefs
description: Ahrefsを使ったSEO分析
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="ahrefs"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Ahrefs](https://ahrefs.com/)は、ウェブサイトの分析、ランキングの追跡、バックリンクのモニタリング、キーワードリサーチを行うための主要なSEOツールセットです。自社のウェブサイトや競合他社に関する詳細な洞察を提供し、検索での可視性を向上させるためのデータ駆動型の意思決定をサポートします。

SimでのAhrefs統合により、以下のことが可能になります：

- **ドメインレーティングと権威性の分析**：任意のウェブサイトのドメインレーティング（DR）とAhrefsランクを即座にチェックして、その権威性を評価できます。
- **バックリンクの取得**：サイトまたは特定のURLを指すバックリンクのリストを、アンカーテキスト、参照ページのDRなどの詳細情報とともに取得できます。
- **バックリンク統計の取得**：ドメインまたはURLのバックリンクタイプ（dofollow、nofollow、テキスト、画像、リダイレクトなど）に関するメトリクスにアクセスできます。
- **オーガニックキーワードの探索** *(計画中)*：ドメインがランク付けされているキーワードとGoogle検索結果での位置を表示します。
- **トップページの発見** *(計画中)*：オーガニックトラフィックとリンクによって最も成果の高いページを特定します。

これらのツールにより、エージェントはSEOリサーチの自動化、競合他社のモニタリング、レポートの生成をワークフロー自動化の一部として実行できます。Ahrefs統合を使用するには、API アクセス付きのAhrefs Enterpriseサブスクリプションが必要です。
{/* MANUAL-CONTENT-END */}

## 使用方法

AhrefsのSEOツールをワークフローに統合します。ドメインレーティング、バックリンク、オーガニックキーワード、トップページなどを分析できます。APIアクセス付きのAhrefs Enterpriseプランが必要です。

## ツール

### `ahrefs_domain_rating`

ターゲットドメインのドメインレーティング（DR）とAhrefsランクを取得します。ドメインレーティングはウェブサイトの強さを示します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `target` | string | はい | 分析対象のドメイン（例：example.com） |
| `date` | string | いいえ | 過去データの日付（YYYY-MM-DD形式、デフォルトは今日） |
| `apiKey` | string | はい | Ahrefs APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `domainRating` | number | ドメインレーティングスコア（0-100） |
| `ahrefsRank` | number | Ahrefs ランク - バックリンクプロファイルの強さに基づくグローバルランキング |

### `ahrefs_backlinks`

ターゲットドメインまたはURLを指すバックリンクのリストを取得します。各バックリンクについて、ソースURL、アンカーテキスト、ドメインレーティングなどの詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `target` | string | はい | 分析対象のドメインまたはURL |
| `mode` | string | いいえ | 分析モード：domain（ドメイン全体）、prefix（URLプレフィックス）、subdomains（すべてのサブドメインを含む）、exact（完全なURL一致） |
| `date` | string | いいえ | 過去データの日付（YYYY-MM-DD形式、デフォルトは今日） |
| `limit` | number | いいえ | 返す結果の最大数（デフォルト：100） |
| `offset` | number | いいえ | ページネーション用にスキップする結果の数 |
| `apiKey` | string | はい | Ahrefs APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `backlinks` | array | ターゲットを指すバックリンクのリスト |

### `ahrefs_backlinks_stats`

ターゲットドメインまたはURLのバックリンク統計を取得します。dofollow、nofollow、テキスト、画像、リダイレクトリンクなど、異なるバックリンクタイプの合計を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `target` | string | はい | 分析するターゲットドメインまたはURL |
| `mode` | string | いいえ | 分析モード: domain \(ドメイン全体\)、prefix \(URL接頭辞\)、subdomains \(すべてのサブドメインを含む\)、exact \(完全なURLマッチ\) |
| `date` | string | いいえ | 履歴データの日付（YYYY-MM-DD形式）\(デフォルトは今日\) |
| `apiKey` | string | はい | Ahrefs APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `stats` | object | バックリンク統計の概要 |

### `ahrefs_referring_domains`

ターゲットドメインまたはURLにリンクしているドメインのリストを取得します。ドメインレーティング、バックリンク数、発見日を含む一意の参照ドメインを返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `target` | string | はい | 分析するターゲットドメインまたはURL |
| `mode` | string | いいえ | 分析モード: domain \(ドメイン全体\)、prefix \(URL接頭辞\)、subdomains \(すべてのサブドメインを含む\)、exact \(完全なURLマッチ\) |
| `date` | string | いいえ | 履歴データの日付（YYYY-MM-DD形式）\(デフォルトは今日\) |
| `limit` | number | いいえ | 返す結果の最大数 \(デフォルト: 100\) |
| `offset` | number | いいえ | ページネーションのためにスキップする結果の数 |
| `apiKey` | string | はい | Ahrefs APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `referringDomains` | array | ターゲットにリンクしているドメインのリスト |

### `ahrefs_organic_keywords`

ターゲットドメインまたはURLがGoogle検索結果でランク付けされているオーガニックキーワードを取得します。検索ボリューム、ランキングポジション、推定トラフィックなどのキーワードの詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `target` | string | はい | 分析対象のドメインまたはURL |
| `country` | string | いいえ | 検索結果の国コード（例：us、gb、de）。デフォルト：us |
| `mode` | string | いいえ | 分析モード：domain（ドメイン全体）、prefix（URLプレフィックス）、subdomains（すべてのサブドメインを含む）、exact（完全なURL一致） |
| `date` | string | いいえ | 履歴データの日付（YYYY-MM-DD形式、デフォルトは今日） |
| `limit` | number | いいえ | 返す結果の最大数（デフォルト：100） |
| `offset` | number | いいえ | ページネーション用にスキップする結果の数 |
| `apiKey` | string | はい | Ahrefs APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `keywords` | array | ターゲットがランク付けされているオーガニックキーワードのリスト |

### `ahrefs_top_pages`

オーガニックトラフィック順にソートされたターゲットドメインのトップページを取得します。ページURLとそのトラフィック、キーワード数、推定トラフィック価値を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `target` | string | はい | 分析対象のドメイン |
| `country` | string | いいえ | トラフィックデータの国コード（例：us、gb、de）。デフォルト：us |
| `mode` | string | いいえ | 分析モード：domain（ドメイン全体）、prefix（URLプレフィックス）、subdomains（すべてのサブドメインを含む） |
| `date` | string | いいえ | 履歴データの日付（YYYY-MM-DD形式、デフォルトは今日） |
| `limit` | number | いいえ | 返す結果の最大数（デフォルト：100） |
| `offset` | number | いいえ | ページネーション用にスキップする結果の数 |
| `select` | string | いいえ | 返すフィールドのカンマ区切りリスト（例：url,traffic,keywords,top_keyword,value）。デフォルト：url,traffic,keywords,top_keyword,value |
| `apiKey` | string | はい | Ahrefs APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `pages` | array | オーガニックトラフィック別のトップページリスト |

### `ahrefs_keyword_overview`

検索ボリューム、キーワード難易度、CPC、クリック数、トラフィックポテンシャルなどを含むキーワードの詳細指標を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `keyword` | string | はい | 分析するキーワード |
| `country` | string | いいえ | キーワードデータの国コード（例：us、gb、de）。デフォルト：us |
| `apiKey` | string | はい | Ahrefs APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `overview` | object | キーワード指標の概要 |

### `ahrefs_broken_backlinks`

ターゲットドメインまたはURLを指すリンク切れのバックリンクのリストを取得します。リンク再取得の機会を特定するのに役立ちます。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `target` | string | はい | 分析対象のターゲットドメインまたはURL |
| `mode` | string | いいえ | 分析モード: domain（ドメイン全体）、prefix（URL接頭辞）、subdomains（すべてのサブドメインを含む）、exact（完全なURL一致） |
| `date` | string | いいえ | YYYY-MM-DD形式の履歴データの日付（デフォルトは今日） |
| `limit` | number | いいえ | 返す結果の最大数（デフォルト: 100） |
| `offset` | number | いいえ | ページネーション用にスキップする結果の数 |
| `apiKey` | string | はい | Ahrefs APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `brokenBacklinks` | array | リンク切れのバックリンクのリスト |

## 注意事項

- カテゴリー: `tools`
- タイプ: `ahrefs`
```

--------------------------------------------------------------------------------

---[FILE: airtable.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/airtable.mdx

```text
---
title: Airtable
description: Airtableの読み取り、作成、更新
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="airtable"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Airtable](https://airtable.com/)は、データベースの機能性とスプレッドシートのシンプルさを兼ね備えた強力なクラウドベースのプラットフォームです。情報の整理、保存、共同作業のための柔軟なデータベースを作成することができます。

Airtableでは以下のことが可能です：

- **カスタムデータベースの作成**：プロジェクト管理、コンテンツカレンダー、在庫管理などのためのカスタマイズされたソリューションを構築
- **データの視覚化**：情報をグリッド、かんばんボード、カレンダー、ギャラリーとして表示
- **ワークフローの自動化**：繰り返しのタスクを自動化するためのトリガーとアクションを設定
- **他のツールとの統合**：ネイティブ統合やAPIを通じて何百もの他のアプリケーションと連携

Simでは、Airtable統合によりエージェントがプログラム的にAirtableベースとやり取りすることができます。これにより、情報の取得、新しいレコードの作成、既存データの更新などのデータ操作をエージェントのワークフロー内でシームレスに行うことができます。Airtableをエージェントの動的なデータソースまたは送信先として使用し、意思決定やタスク実行プロセスの一部として構造化された情報にアクセスし操作できるようにします。
{/* MANUAL-CONTENT-END */}

## 使用方法

Airtableをワークフローに統合します。Airtableのレコードを作成、取得、一覧表示、または更新できます。OAuthが必要です。トリガーモードで使用すると、Airtableテーブルが更新されたときにワークフローをトリガーできます。

## ツール

### `airtable_list_records`

Airtableテーブルからレコードを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | はい | AirtableベースのID |
| `tableId` | string | はい | テーブルのID |
| `maxRecords` | number | いいえ | 返すレコードの最大数 |
| `filterFormula` | string | いいえ | レコードをフィルタリングするための数式（例："\(\{フィールド名\} = \'値\'\)"） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `records` | json | 取得したAirtableレコードの配列 |

### `airtable_get_record`

IDによってAirtableテーブルから単一のレコードを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | はい | Airtableベースのid |
| `tableId` | string | はい | テーブルのIDまたは名前 |
| `recordId` | string | はい | 取得するレコードのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `record` | json | id、createdTime、およびフィールドを含む取得したAirtableレコード |
| `metadata` | json | レコード数を含む操作メタデータ |

### `airtable_create_records`

Airtableテーブルに新しいレコードを書き込む

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | はい | Airtableベースのid |
| `tableId` | string | はい | テーブルのidまたは名前 |
| `records` | json | はい | 作成するレコードの配列、各レコードには`fields`オブジェクトが含まれる |
| `fields` | string | いいえ | 説明なし |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `records` | json | 作成されたAirtableレコードの配列 |

### `airtable_update_record`

IDによってAirtableテーブルの既存レコードを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | はい | Airtableベースのid |
| `tableId` | string | はい | テーブルのidまたは名前 |
| `recordId` | string | はい | 更新するレコードのid |
| `fields` | json | はい | フィールド名と新しい値を含むオブジェクト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `record` | json | id、createdTime、およびフィールドを含む更新されたAirtableレコード |
| `metadata` | json | レコード数と更新されたフィールド名を含む操作メタデータ |

### `airtable_update_multiple_records`

Airtableテーブルの複数の既存レコードを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `baseId` | string | はい | AirtableベースのID |
| `tableId` | string | はい | テーブルのIDまたは名前 |
| `records` | json | はい | 更新するレコードの配列。各レコードには`id`と`fields`オブジェクトが含まれます |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `records` | json | 更新されたAirtableレコードの配列 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `airtable`
```

--------------------------------------------------------------------------------

---[FILE: apify.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/apify.mdx

```text
---
title: Apify
description: Apifyアクターを実行して結果を取得する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="apify"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Apify](https://apify.com/)は、WebオートメーションとWebスクレイピングアクターを構築、デプロイ、大規模に実行するための強力なプラットフォームです。Apifyを使用すると、任意のWebサイトから有用なデータを抽出し、ワークフローを自動化し、データパイプラインをシームレスに接続できます。

Apifyでは以下のことが可能です：

- **既製または独自のアクターを実行する**：公開アクターを統合するか、独自のアクターを開発して、幅広いWebデータ抽出とブラウザタスクを自動化します。
- **データセットを取得する**：アクターによって収集された構造化データセットにリアルタイムでアクセスし管理します。
- **Webオートメーションをスケールする**：クラウドインフラストラクチャを活用して、堅牢なエラー処理を備えた同期または非同期のタスクを確実に実行します。

Simでは、Apify統合によりエージェントがプログラムでApifyの主要な操作を実行できます：

- **アクターの実行（同期）**：`apify_run_actor_sync`を使用してApifyアクターを起動し、完了を待って、実行が終了するとすぐに結果を取得します。
- **アクターの実行（非同期）**：`apify_run_actor_async`を使用してバックグラウンドでアクターを開始し、定期的に結果をポーリングします。これは長時間または複雑なジョブに適しています。

これらの操作により、エージェントはワークフロー内で直接、自動化、スクレイピング、データ収集またはブラウザ自動化タスクのオーケストレーションを行うことができます — すべて柔軟な構成と結果処理を備え、手動実行や外部ツールを必要としません。Apifyを動的な自動化およびデータ抽出エンジンとして統合し、プログラムでエージェントのWebスケールワークフローを強化します。
{/* MANUAL-CONTENT-END */}

## 使用方法

Apifyをワークフローに統合します。カスタム入力で任意のApifyアクターを実行し、結果を取得します。自動データセット取得機能を備えた同期および非同期実行の両方をサポートしています。

## ツール

### `apify_run_actor_sync`

APIPYアクターを同期的に実行して結果を取得（最大5分）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | console.apify.com/account#/integrationsから取得したAPIFY APIトークン |
| `actorId` | string | はい | アクターIDまたはユーザー名/アクター名（例："janedoe/my-actor"またはアクターID） |
| `input` | string | いいえ | JSON文字列としてのアクター入力。必須フィールドについてはアクターのドキュメントを参照してください。 |
| `timeout` | number | いいえ | タイムアウト（秒）（デフォルト：アクターのデフォルト） |
| `build` | string | いいえ | 実行するアクタービルド（例："latest"、"beta"、またはビルドタグ/番号） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | アクターの実行が成功したかどうか |
| `runId` | string | APIFY実行ID |
| `status` | string | 実行ステータス（SUCCEEDED、FAILED、など） |
| `items` | array | データセット項目（完了した場合） |

### `apify_run_actor_async`

長時間実行タスク用のポーリングを使用して、APIPYアクターを非同期で実行

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | console.apify.com/account#/integrationsから取得したAPIFY APIトークン |
| `actorId` | string | はい | アクターIDまたはユーザー名/アクター名（例："janedoe/my-actor"またはアクターID） |
| `input` | string | いいえ | JSON文字列としてのアクター入力 |
| `waitForFinish` | number | いいえ | ポーリング開始前の初期待機時間（秒）（0-60） |
| `itemLimit` | number | いいえ | 取得する最大データセット項目数（1-250000、デフォルト100） |
| `timeout` | number | いいえ | タイムアウト（秒）（デフォルト：アクターのデフォルト） |
| `build` | string | いいえ | 実行するアクタービルド（例："latest"、"beta"、またはビルドタグ/番号） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | アクターの実行が成功したかどうか |
| `runId` | string | APIFY実行ID |
| `status` | string | 実行ステータス（SUCCEEDED、FAILED、など） |
| `datasetId` | string | 結果を含むデータセットID |
| `items` | array | データセット項目（完了した場合） |

## 注意事項

- カテゴリー: `tools`
- タイプ: `apify`
```

--------------------------------------------------------------------------------

---[FILE: apollo.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/apollo.mdx

```text
---
title: Apollo
description: Apollo.ioで連絡先の検索、情報強化、管理を行う
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="apollo"
  color="#EBF212"
/>

{/* MANUAL-CONTENT-START:intro */}
[Apollo.io](https://apollo.io/)は、ユーザーが大規模に連絡先や企業を見つけ、情報を強化し、エンゲージメントを行うことができる、先進的な営業インテリジェンスおよびエンゲージメントプラットフォームです。Apollo.ioは、広範な連絡先データベースと堅牢な情報強化およびワークフロー自動化ツールを組み合わせ、営業、マーケティング、採用チームの成長を加速させるのに役立ちます。

Apollo.ioでは、以下のことが可能です：

- **数百万の連絡先と企業を検索**: 高度なフィルターを使用して正確なリードを見つける
- **リードとアカウントの情報を強化**: 検証済みデータと最新情報で不足している詳細を補完
- **CRMレコードの管理と整理**: 人物と企業のデータを正確かつ実用的に保つ
- **アウトリーチの自動化**: Apollo.ioから直接連絡先をシーケンスに追加し、フォローアップタスクを作成

Simでは、Apollo.io統合により、エージェントがプログラムによって主要なApollo操作を実行できます：

- **人物と企業の検索**: `apollo_people_search`を使用して、柔軟なフィルターで新しいリードを発見します。
- **人物データの強化**: `apollo_people_enrich`を使用して、連絡先を検証済み情報で補強します。
- **人物の一括強化**: `apollo_people_bulk_enrich`を使用して、複数の連絡先を一度に大規模に強化します。
- **企業の検索と強化**: `apollo_company_search`と`apollo_company_enrich`を使用して、主要な企業情報を発見し更新します。

これにより、エージェントは手動でのデータ入力やタブの切り替えなしに、見込み客の発掘、CRM情報強化、自動化のための強力なワークフローを構築できます。Apollo.ioを動的なデータソースとCRMエンジンとして統合することで、エージェントが日常業務の一部として、リードを特定し、資格を評価し、シームレスにアプローチすることができます。
{/* MANUAL-CONTENT-END */}

## 使用手順

Apollo.ioをワークフローに統合します。人物や企業を検索し、連絡先データを充実させ、CRMの連絡先やアカウントを管理し、連絡先をシーケンスに追加し、タスクを作成できます。

## ツール

### `apollo_people_search`

Apolloを検索

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `person_titles` | array | いいえ | 検索する役職（例：["CEO", "VP of Sales"]） |
| `person_locations` | array | いいえ | 検索する場所（例：["San Francisco, CA", "New York, NY"]） |
| `person_seniorities` | array | いいえ | 役職レベル（例：["senior", "executive", "manager"]） |
| `organization_names` | array | いいえ | 検索対象の企業名 |
| `q_keywords` | string | いいえ | 検索するキーワード |
| `page` | number | いいえ | ページネーションのページ番号（デフォルト：1） |
| `per_page` | number | いいえ | 1ページあたりの結果数（デフォルト：25、最大：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `people` | json | 検索条件に一致する人物の配列 |
| `metadata` | json | ページ、per_page、total_entriesを含むページネーション情報 |

### `apollo_people_enrich`

Apolloを使用して1人のデータを充実させる

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `first_name` | string | いいえ | 人物の名 |
| `last_name` | string | いいえ | 人物の姓 |
| `email` | string | いいえ | 人物のメールアドレス |
| `organization_name` | string | いいえ | 人物が勤務する企業名 |
| `domain` | string | いいえ | 企業ドメイン（例：apollo.io） |
| `linkedin_url` | string | いいえ | LinkedInプロフィールURL |
| `reveal_personal_emails` | boolean | いいえ | 個人メールアドレスを表示（クレジットを使用） |
| `reveal_phone_number` | boolean | いいえ | 電話番号を表示（クレジットを使用） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `person` | json | Apolloからの充実した人物データ |
| `metadata` | json | 充実ステータスを含むエンリッチメントメタデータ |

### `apollo_people_bulk_enrich`

Apolloを使用して一度に最大10人のデータを充実させる

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `people` | array | はい | 充実させる人物の配列（最大10人） |
| `reveal_personal_emails` | boolean | いいえ | 個人メールアドレスを表示（クレジットを使用） |
| `reveal_phone_number` | boolean | いいえ | 電話番号を表示（クレジットを使用） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `people` | json | 充実した人物データの配列 |
| `metadata` | json | 合計数と充実数を含む一括充実メタデータ |

### `apollo_organization_search`

Apolloを検索

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `organization_locations` | array | いいえ | 検索する会社の所在地 |
| `organization_num_employees_ranges` | array | いいえ | 従業員数の範囲（例：["1-10", "11-50"]） |
| `q_organization_keyword_tags` | array | いいえ | 業界またはキーワードタグ |
| `q_organization_name` | string | いいえ | 検索する組織名 |
| `page` | number | いいえ | ページネーションのページ番号 |
| `per_page` | number | いいえ | ページあたりの結果数（最大：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `organizations` | json | 検索条件に一致する組織の配列 |
| `metadata` | json | ページ、per_page、total_entriesを含むページネーション情報 |

### `apollo_organization_enrich`

Apolloを使用して単一の組織のデータを充実させる

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `organization_name` | string | いいえ | 組織名（organization_nameまたはdomainの少なくとも1つが必要） |
| `domain` | string | いいえ | 会社ドメイン（例：apollo.io）（domainまたはorganization_nameの少なくとも1つが必要） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `organization` | json | Apolloからの充実した組織データ |
| `metadata` | json | 充実ステータスを含むエンリッチメントメタデータ |

### `apollo_organization_bulk_enrich`

Apolloを使用して最大10の組織のデータを一度に充実させる

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `organizations` | array | はい | 充実させる組織の配列（最大10） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `organizations` | json | 充実した組織データの配列 |
| `metadata` | json | 合計数と充実数を含む一括エンリッチメントメタデータ |

### `apollo_contact_create`

Apolloデータベースに新しい連絡先を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `first_name` | string | はい | 連絡先の名 |
| `last_name` | string | はい | 連絡先の姓 |
| `email` | string | いいえ | 連絡先のメールアドレス |
| `title` | string | いいえ | 役職 |
| `account_id` | string | いいえ | 関連付けるApolloアカウントID |
| `owner_id` | string | いいえ | 連絡先所有者のユーザーID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `contact` | json | Apolloから作成された連絡先データ |
| `metadata` | json | 作成ステータスを含む作成メタデータ |

### `apollo_contact_update`

Apolloデータベースの既存の連絡先を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `contact_id` | string | はい | 更新する連絡先のID |
| `first_name` | string | いいえ | 連絡先の名 |
| `last_name` | string | いいえ | 連絡先の姓 |
| `email` | string | いいえ | メールアドレス |
| `title` | string | いいえ | 役職 |
| `account_id` | string | いいえ | Apolloアカウント ID |
| `owner_id` | string | いいえ | 連絡先所有者のユーザーID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `contact` | json | Apolloから更新された連絡先データ |
| `metadata` | json | 更新ステータスを含む更新メタデータ |

### `apollo_contact_search`

チームを検索

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `q_keywords` | string | いいえ | 検索するキーワード |
| `contact_stage_ids` | array | いいえ | 連絡先ステージIDでフィルタリング |
| `page` | number | いいえ | ページネーションのページ番号 |
| `per_page` | number | いいえ | 1ページあたりの結果数（最大：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `contacts` | json | 検索条件に一致する連絡先の配列 |
| `metadata` | json | ページ、per_page、total_entriesを含むページネーション情報 |

### `apollo_contact_bulk_create`

Apolloデータベースに一度に最大100件の連絡先を作成します。重複を防ぐための重複排除をサポートしています。マスターキーが必要です。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー（マスターキーが必要） |
| `contacts` | array | はい | 作成する連絡先の配列（最大100件）。各連絡先にはfirst_name、last_nameを含め、オプションでemail、title、account_id、owner_idを含めることができます |
| `run_dedupe` | boolean | いいえ | 重複する連絡先の作成を防ぐための重複排除を有効にします。trueの場合、既存の連絡先は変更せずに返されます |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `created_contacts` | json | 新しく作成された連絡先の配列 |
| `existing_contacts` | json | 既存の連絡先の配列（重複排除が有効な場合） |
| `metadata` | json | 作成された連絡先と既存の連絡先の数を含む一括作成メタデータ |

### `apollo_contact_bulk_update`

Apolloデータベース内の最大100件の既存の連絡先を一度に更新します。各連絡先にはidフィールドが含まれている必要があります。マスターキーが必要です。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー（マスターキーが必要） |
| `contacts` | array | はい | 更新する連絡先の配列（最大100件）。各連絡先にはidフィールドが必須で、オプションでfirst_name、last_name、email、title、account_id、owner_idを含めることができます |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `updated_contacts` | json | 正常に更新された連絡先の配列 |
| `failed_contacts` | json | 更新に失敗した連絡先の配列 |
| `metadata` | json | 更新された連絡先と失敗した連絡先の数を含む一括更新メタデータ |

### `apollo_account_create`

Apolloデータベースに新しいアカウント（会社）を作成します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `name` | string | はい | 会社名 |
| `website_url` | string | いいえ | 会社のウェブサイトURL |
| `phone` | string | いいえ | 会社の電話番号 |
| `owner_id` | string | いいえ | アカウント所有者のユーザーID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `account` | json | Apolloから作成されたアカウントデータ |
| `metadata` | json | 作成ステータスを含む作成メタデータ |

### `apollo_account_update`

Apolloデータベース内の既存のアカウントを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `account_id` | string | はい | 更新するアカウントのID |
| `name` | string | いいえ | 会社名 |
| `website_url` | string | いいえ | 会社のウェブサイトURL |
| `phone` | string | いいえ | 会社の電話番号 |
| `owner_id` | string | いいえ | アカウント所有者のユーザーID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `account` | json | Apolloから更新されたアカウントデータ |
| `metadata` | json | 更新ステータスを含む更新メタデータ |

### `apollo_account_search`

チームを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー（マスターキーが必要） |
| `q_keywords` | string | いいえ | アカウントデータで検索するキーワード |
| `owner_id` | string | いいえ | アカウント所有者のユーザーIDでフィルタリング |
| `account_stage_ids` | array | いいえ | アカウントステージIDでフィルタリング |
| `page` | number | いいえ | ページネーションのページ番号 |
| `per_page` | number | いいえ | 1ページあたりの結果数（最大：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `accounts` | json | 検索条件に一致するアカウントの配列 |
| `metadata` | json | ページ、per_page、total_entriesを含むページネーション情報 |

### `apollo_account_bulk_create`

Apolloデータベースに一度に最大100のアカウントを作成できます。注意：Apolloは重複排除を適用しないため、エントリが類似した名前やドメインを共有している場合、重複アカウントが作成される可能性があります。マスターキーが必要です。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー（マスターキーが必要） |
| `accounts` | array | はい | 作成するアカウントの配列（最大100）。各アカウントには名前（必須）、およびオプションでwebsite_url、phone、owner_idを含める必要があります |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `created_accounts` | json | 新しく作成されたアカウントの配列 |
| `failed_accounts` | json | 作成に失敗したアカウントの配列 |
| `metadata` | json | 作成されたアカウントと失敗したアカウントの数を含む一括作成メタデータ |

### `apollo_account_bulk_update`

Apolloデータベースで一度に最大1000の既存アカウントを更新します（連絡先よりも高い制限！）。各アカウントにはidフィールドを含める必要があります。マスターキーが必要です。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー（マスターキーが必要） |
| `accounts` | array | はい | 更新するアカウントの配列（最大1000）。各アカウントにはidフィールドを含め、オプションでname、website_url、phone、owner_idを含める必要があります |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `updated_accounts` | json | 正常に更新されたアカウントの配列 |
| `failed_accounts` | json | 更新に失敗したアカウントの配列 |
| `metadata` | json | 更新および失敗したアカウント数を含む一括更新メタデータ |

### `apollo_opportunity_create`

Apolloデータベースのアカウントに新しい取引を作成します（マスターキーが必要）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー（マスターキーが必要） |
| `name` | string | はい | 商談/取引の名前 |
| `account_id` | string | はい | この商談が属するアカウントのID |
| `amount` | number | いいえ | 商談の金銭的価値 |
| `stage_id` | string | いいえ | 取引ステージのID |
| `owner_id` | string | いいえ | 商談所有者のユーザーID |
| `close_date` | string | いいえ | 予想クローズ日（ISO 8601形式） |
| `description` | string | いいえ | 商談に関する説明またはメモ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `opportunity` | json | Apolloから作成された商談データ |
| `metadata` | json | 作成ステータスを含む作成メタデータ |

### `apollo_opportunity_search`

チーム内のすべての取引/商談を検索してリスト表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `q_keywords` | string | いいえ | 案件名で検索するキーワード |
| `account_ids` | array | いいえ | 特定のアカウントIDでフィルタリング |
| `stage_ids` | array | いいえ | 商談ステージIDでフィルタリング |
| `owner_ids` | array | いいえ | 案件担当者IDでフィルタリング |
| `page` | number | いいえ | ページネーション用のページ番号 |
| `per_page` | number | いいえ | 1ページあたりの結果数（最大：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `opportunities` | json | 検索条件に一致する案件の配列 |
| `metadata` | json | ページ、per_page、total_entriesを含むページネーション情報 |

### `apollo_opportunity_get`

IDで特定の商談/案件の詳細情報を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `opportunity_id` | string | はい | 取得する案件のID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `opportunity` | json | Apolloからの完全な案件データ |
| `metadata` | json | 検索状態を含む取得メタデータ |

### `apollo_opportunity_update`

Apolloデータベース内の既存の商談/案件を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー |
| `opportunity_id` | string | はい | 更新する案件のID |
| `name` | string | いいえ | 案件/取引の名前 |
| `amount` | number | いいえ | 案件の金銭的価値 |
| `stage_id` | string | いいえ | 取引ステージのID |
| `owner_id` | string | いいえ | 案件所有者のユーザーID |
| `close_date` | string | いいえ | 予定成約日（ISO 8601形式） |
| `description` | string | いいえ | 案件に関する説明やメモ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `opportunity` | json | Apolloからの更新された案件データ |
| `metadata` | json | 更新ステータスを含む更新メタデータ |

### `apollo_sequence_search`

チーム内のシーケンス/キャンペーンを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー（マスターキーが必要） |
| `q_name` | string | いいえ | 名前でシーケンスを検索 |
| `active` | boolean | いいえ | アクティブステータスでフィルタリング（アクティブなシーケンスはtrue、非アクティブはfalse） |
| `page` | number | いいえ | ページネーションのページ番号 |
| `per_page` | number | いいえ | 1ページあたりの結果数（最大：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `sequences` | json | 検索条件に一致するシーケンス/キャンペーンの配列 |
| `metadata` | json | ページ、per_page、total_entriesを含むページネーション情報 |

### `apollo_sequence_add_contacts`

Apolloシーケンスに連絡先を追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー（マスターキーが必要） |
| `sequence_id` | string | はい | 連絡先を追加するシーケンスのID |
| `contact_ids` | array | はい | シーケンスに追加する連絡先IDの配列 |
| `emailer_campaign_id` | string | いいえ | オプションのメーラーキャンペーンID |
| `send_email_from_user_id` | string | いいえ | メールの送信元となるユーザーID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `contacts_added` | json | シーケンスに追加された連絡先IDの配列 |
| `metadata` | json | sequence_idとtotal_added数を含むシーケンスメタデータ |

### `apollo_task_create`

Apolloで新しいタスクを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー（マスターキーが必要） |
| `note` | string | はい | タスクのメモ/説明 |
| `contact_id` | string | いいえ | 関連付ける連絡先ID |
| `account_id` | string | いいえ | 関連付けるアカウントID |
| `due_at` | string | いいえ | ISO形式の期日 |
| `priority` | string | いいえ | タスクの優先度 |
| `type` | string | いいえ | タスクのタイプ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `task` | json | Apolloから作成されたタスクデータ |
| `metadata` | json | 作成ステータスを含む作成メタデータ |

### `apollo_task_search`

Apolloでタスクを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー（マスターキーが必要） |
| `contact_id` | string | いいえ | 連絡先IDでフィルタリング |
| `account_id` | string | いいえ | アカウントIDでフィルタリング |
| `completed` | boolean | いいえ | 完了ステータスでフィルタリング |
| `page` | number | いいえ | ページネーション用のページ番号 |
| `per_page` | number | いいえ | 1ページあたりの結果数（最大：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `tasks` | json | 検索条件に一致するタスクの配列 |
| `metadata` | json | ページ、per_page、total_entriesを含むページネーション情報 |

### `apollo_email_accounts`

チームのリストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Apollo APIキー（マスターキーが必要） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `email_accounts` | json | Apolloにリンクされているチームのメールアカウントの配列 |
| `metadata` | json | メールアカウントの総数を含むメタデータ |

## メモ

- カテゴリー: `tools`
- タイプ: `apollo`
```

--------------------------------------------------------------------------------

---[FILE: arxiv.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/arxiv.mdx

```text
---
title: ArXiv
description: ArXivから学術論文を検索して取得する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="arxiv"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[ArXiv](https://arxiv.org/)は、物理学、数学、コンピュータサイエンス、定量生物学、定量金融、統計学、電気工学、システム科学、経済学などの分野における科学研究論文の無料でオープンアクセスなリポジトリです。ArXivはプレプリントや公開された論文の膨大なコレクションを提供し、世界中の研究者や実務家にとって主要なリソースとなっています。

ArXivでは以下のことができます：

- **学術論文の検索**：キーワード、著者名、タイトル、カテゴリなどで研究を検索
- **論文メタデータの取得**：要約、著者リスト、出版日、その他の書誌情報へのアクセス
- **全文PDFのダウンロード**：詳細な研究のためにほとんどの論文の完全なテキストを入手
- **著者の貢献の探索**：特定の著者によるすべての論文を閲覧
- **最新情報の入手**：あなたの分野における最新の投稿やトレンドトピックを発見

Simでは、ArXiv統合によりエージェントがArXivから科学論文をプログラム的に検索、取得、分析することができます。これにより、文献レビューの自動化、研究アシスタントの構築、または最新の科学知識をエージェントワークフローに組み込むことが可能になります。Simプロジェクト内での研究、発見、知識抽出のための動的なデータソースとしてArXivを活用してください。
{/* MANUAL-CONTENT-END */}

## 使用方法

ArXivをワークフローに統合します。論文の検索、論文の詳細取得、著者の論文取得が可能です。OAuthやAPIキーは必要ありません。

## ツール

### `arxiv_search`

キーワード、著者、タイトル、またはその他のフィールドでArXivの学術論文を検索します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `searchQuery` | string | はい | 実行する検索クエリ |
| `searchField` | string | いいえ | 検索するフィールド: all（すべて）、ti \(タイトル\)、au \(著者\)、abs \(要約\)、co \(コメント\)、jr \(ジャーナル\)、cat \(カテゴリ\)、rn \(レポート番号\) |
| `maxResults` | number | いいえ | 返す結果の最大数 \(デフォルト: 10、最大: 2000\) |
| `sortBy` | string | いいえ | 並べ替え: relevance（関連性）、lastUpdatedDate（最終更新日）、submittedDate（提出日） \(デフォルト: relevance\) |
| `sortOrder` | string | いいえ | 並べ替え順: ascending（昇順）、descending（降順） \(デフォルト: descending\) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `papers` | json | 検索クエリに一致する論文の配列 |

### `arxiv_get_paper`

IDを使用して特定のArXiv論文に関する詳細情報を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `paperId` | string | はい | ArXiv論文ID \(例: "1706.03762"\) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `paper` | json | リクエストされたArXiv論文に関する詳細情報 |

### `arxiv_get_author_papers`

ArXivで特定の著者による論文を検索します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `authorName` | string | はい | 検索する著者名 |
| `maxResults` | number | いいえ | 返す結果の最大数 \(デフォルト: 10、最大: 2000\) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `authorPapers` | json | 指定された著者が執筆した論文の配列 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `arxiv`
```

--------------------------------------------------------------------------------

---[FILE: asana.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/asana.mdx

```text
---
title: Asana
description: Asanaとの連携
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="asana"
  color="#E0E0E0"
/>

## 使用方法

Asanaをワークフローに統合します。タスクの読み取り、書き込み、更新が可能です。

## ツール

### `asana_get_task`

GIDで単一のタスクを取得するか、フィルターを使用して複数のタスクを取得します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | いいえ | タスクのグローバル一意識別子（GID）。指定しない場合は、複数のタスクを取得します。 |
| `workspace` | string | いいえ | タスクをフィルタリングするためのワークスペースGID（taskGidを使用しない場合は必須） |
| `project` | string | いいえ | タスクをフィルタリングするためのプロジェクトGID |
| `limit` | number | いいえ | 返すタスクの最大数（デフォルト：50） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `ts` | string | レスポンスのタイムスタンプ |
| `gid` | string | タスクのグローバル一意識別子 |
| `resource_type` | string | リソースタイプ（タスク） |
| `resource_subtype` | string | リソースのサブタイプ |
| `name` | string | タスク名 |
| `notes` | string | タスクのメモや説明 |
| `completed` | boolean | タスクが完了しているかどうか |
| `assignee` | object | 担当者の詳細 |

### `asana_create_task`

Asanaで新しいタスクを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | はい | タスクが作成されるワークスペースのGID |
| `name` | string | はい | タスクの名前 |
| `notes` | string | いいえ | タスクのメモや説明 |
| `assignee` | string | いいえ | タスクを割り当てるユーザーのGID |
| `due_on` | string | いいえ | YYYY-MM-DD形式の期日 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `ts` | string | レスポンスのタイムスタンプ |
| `gid` | string | タスクのグローバル一意識別子 |
| `name` | string | タスク名 |
| `notes` | string | タスクのメモや説明 |
| `completed` | boolean | タスクが完了しているかどうか |
| `created_at` | string | タスク作成のタイムスタンプ |
| `permalink_url` | string | Asana内のタスクへのURL |

### `asana_update_task`

Asanaの既存タスクを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | はい | 更新するタスクのグローバル一意識別子（GID） |
| `name` | string | いいえ | タスクの更新された名前 |
| `notes` | string | いいえ | タスクの更新されたメモや説明 |
| `assignee` | string | いいえ | 更新された担当者のユーザーGID |
| `completed` | boolean | いいえ | タスクを完了または未完了としてマークする |
| `due_on` | string | いいえ | YYYY-MM-DD形式の更新された期日 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `ts` | string | レスポンスのタイムスタンプ |
| `gid` | string | タスクのグローバル一意識別子 |
| `name` | string | タスク名 |
| `notes` | string | タスクのメモや説明 |
| `completed` | boolean | タスクが完了しているかどうか |
| `modified_at` | string | タスクの最終更新タイムスタンプ |

### `asana_get_projects`

Asanaワークスペースからすべてのプロジェクトを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | はい | プロジェクトを取得するワークスペースGID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `ts` | string | レスポンスのタイムスタンプ |
| `projects` | array | プロジェクトの配列 |

### `asana_search_tasks`

Asanaワークスペース内のタスクを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `workspace` | string | はい | タスクを検索するワークスペースGID |
| `text` | string | いいえ | タスク名で検索するテキスト |
| `assignee` | string | いいえ | 担当者ユーザーGIDでタスクをフィルタリング |
| `projects` | array | いいえ | タスクをフィルタリングするプロジェクトGIDの配列 |
| `completed` | boolean | いいえ | 完了ステータスでフィルタリング |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `ts` | string | レスポンスのタイムスタンプ |
| `tasks` | array | 一致するタスクの配列 |

### `asana_add_comment`

Asanaタスクにコメント（ストーリー）を追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `taskGid` | string | はい | タスクのグローバル一意識別子（GID） |
| `text` | string | はい | コメントのテキスト内容 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `ts` | string | レスポンスのタイムスタンプ |
| `gid` | string | コメントのグローバル一意識別子 |
| `text` | string | コメントのテキスト内容 |
| `created_at` | string | コメント作成タイムスタンプ |
| `created_by` | object | コメント投稿者の詳細 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `asana`
```

--------------------------------------------------------------------------------

---[FILE: browser_use.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/browser_use.mdx

```text
---
title: ブラウザの使用
description: ブラウザ自動化タスクを実行する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="browser_use"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[BrowserUse](https://browser-use.com/)は、プログラムでブラウザタスクを作成して実行できる強力なブラウザ自動化プラットフォームです。自然言語の指示を通じてウェブ操作を自動化する方法を提供し、コードを書かずにウェブサイトのナビゲーション、フォームの入力、データの抽出、複雑な一連のアクションの実行が可能になります。

BrowserUseでは、以下のことができます：

- **ウェブ操作の自動化**: ウェブサイトへの移動、ボタンのクリック、フォームの入力、その他のブラウザアクションの実行
- **データの抽出**: テキスト、画像、構造化データなど、ウェブサイトからコンテンツをスクレイピング
- **複雑なワークフローの実行**: 複数のアクションを連鎖させて高度なウェブタスクを完了
- **タスク実行のモニタリング**: リアルタイムでビジュアルフィードバックを伴うブラウザタスクの実行を監視
- **プログラムによる結果処理**: ウェブ自動化タスクから構造化された出力を受け取る

Simでは、BrowserUse統合により、エージェントが人間のユーザーのようにウェブとやり取りすることができます。これにより、リサーチ、データ収集、フォーム送信、ウェブテストなどのシナリオが、単純な自然言語指示を通じて可能になります。エージェントはウェブサイトから情報を収集し、ウェブアプリケーションとやり取りし、通常は手動でのブラウジングが必要な操作を実行できるため、ウェブ全体をリソースとして含めるようにその能力を拡張します。
{/* MANUAL-CONTENT-END */}

## 使用方法

Browser Useをワークフローに統合します。実際のユーザーがブラウザを操作しているかのようにウェブをナビゲートしアクションを実行できます。APIキーが必要です。

## ツール

### `browser_use_run_task`

BrowserUseを使用してブラウザ自動化タスクを実行します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `task` | string | はい | ブラウザエージェントが何をすべきか |
| `variables` | json | いいえ | シークレットとして使用するオプション変数（形式：\{key: value\}） |
| `format` | string | いいえ | 説明なし |
| `save_browser_data` | boolean | いいえ | ブラウザデータを保存するかどうか |
| `model` | string | いいえ | 使用するLLMモデル（デフォルト：gpt-4o） |
| `apiKey` | string | はい | BrowserUse APIのAPIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | string | タスク実行識別子 |
| `success` | boolean | タスク完了ステータス |
| `output` | json | タスク出力データ |
| `steps` | json | 実行された手順 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `browser_use`
```

--------------------------------------------------------------------------------

````
