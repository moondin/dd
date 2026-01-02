---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 202
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 202 of 933)

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

---[FILE: google_sheets.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/google_sheets.mdx

```text
---
title: Google スプレッドシート
description: データの読み取り、書き込み、更新
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_sheets"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google スプレッドシート](https://sheets.google.com)は、ユーザーがリアルタイムでスプレッドシートを作成、編集、共同作業できる強力なクラウドベースのスプレッドシートアプリケーションです。Googleの生産性スイートの一部として、Google スプレッドシートは堅牢な書式設定、数式、共有機能を備えたデータ整理、分析、視覚化のための多目的プラットフォームを提供しています。

Simで Google スプレッドシートの「読み取り」ツールを統合して、ワークフローに組み込むためにスプレッドシートからデータを簡単に取得する方法を学びましょう。このチュートリアルでは、Google スプレッドシートの接続、データ読み取りの設定、およびその情報を使用してリアルタイムでプロセスを自動化する方法を説明します。ライブデータをエージェントと同期させるのに最適です。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/xxP7MZRuq_0"
  title="Simで Google スプレッドシート読み取りツールを使用する"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Simで Google スプレッドシートの「書き込み」ツールを使用して、ワークフローからGoogle スプレッドシートにデータを自動的に送信する方法を発見しましょう。このチュートリアルでは、統合のセットアップ、書き込み操作の設定、ワークフローの実行に伴うシートのシームレスな更新について説明します。手動入力なしでリアルタイムの記録を維持するのに最適です。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/cO86qTj7qeY"
  title="Simで Google スプレッドシート書き込みツールを使用する"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Simで Google スプレッドシートの「更新」ツールを活用して、ワークフローの実行に基づいてスプレッドシートの既存のエントリを変更する方法を探りましょう。このチュートリアルでは、更新ロジックの設定、データフィールドのマッピング、変更の即時同期を実演します。データを最新かつ一貫した状態に保つのに最適です。

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/95by2fL9yn4"
  title="Simでのグーグルシート更新ツールの使用方法"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Simでグーグルシートの「追加」ツールを使用して、ワークフロー実行中にスプレッドシートに新しいデータ行を簡単に追加する方法を学びましょう。このチュートリアルでは、連携の設定、追加アクションの構成、スムーズなデータ拡張の確保について説明します。手動作業なしでレコードを拡張するのに最適です！

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/8DgNvLBCsAo"
  title="Simでのグーグルシート追加ツールの使用方法"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

グーグルシートでは、以下のことができます：

- **スプレッドシートの作成と編集**：包括的な書式設定と計算オプションを備えたデータ駆動型ドキュメントを開発
- **リアルタイムでの共同作業**：同じスプレッドシートで複数のユーザーと同時に作業
- **データ分析**：数式、関数、ピボットテーブルを使用してデータを処理し理解
- **情報の視覚化**：チャート、グラフ、条件付き書式を作成してデータを視覚的に表現
- **どこからでもアクセス**：自動クラウド同期により複数のデバイスでグーグルシートを使用
- **オフラインでの作業**：インターネット接続なしで作業を続け、オンラインに戻ったときに変更を同期
- **他のサービスとの統合**：グーグルドライブ、フォーム、サードパーティアプリケーションと連携

Simでは、グーグルシート連携によりエージェントがプログラムでスプレッドシートデータと直接やり取りできるようになります。これにより、データ抽出、分析、レポート作成、管理などの強力な自動化シナリオが可能になります。エージェントは既存のスプレッドシートから情報を抽出したり、スプレッドシートにデータを書き込んだり、新しいスプレッドシートを一から作成したりできます。この連携はAIワークフローとデータ管理の間のギャップを埋め、構造化データとのシームレスな相互作用を可能にします。Simとグーグルシートをつなげることで、データワークフローの自動化、レポート生成、データからの洞察抽出、最新情報の維持などを、すべてインテリジェントエージェントを通じて行うことができます。この連携はさまざまなデータ形式と範囲指定をサポートし、グーグルシートの共同作業とアクセシビリティの特性を維持しながら、多様なデータ管理ニーズに対応できる柔軟性を備えています。
{/* MANUAL-CONTENT-END */}

## 使用方法

Google Sheetsをワークフローに統合します。データの読み取り、書き込み、追加、更新が可能です。OAuthが必要です。

## ツール

### `google_sheets_read`

Google Sheetsスプレッドシートからデータを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | はい | スプレッドシートのID（URLで確認できます: docs.google.com/spreadsheets/d/\{SPREADSHEET_ID\}/edit） |
| `range` | string | いいえ | 読み取るA1表記の範囲（例: "Sheet1!A1:D10"、"A1:B5"）。指定しない場合、デフォルトで最初のシートのA1:Z1000が使用されます。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `data` | json | 範囲とセル値を含むシートデータ |
| `metadata` | json | IDとURLを含むスプレッドシートのメタデータ |

### `google_sheets_write`

Google Sheetsスプレッドシートにデータを書き込む

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | はい | スプレッドシートのID |
| `range` | string | いいえ | 書き込むA1表記の範囲（例: "Sheet1!A1:D10"、"A1:B5"） |
| `values` | array | はい | 2次元配列（例: \[\["名前", "年齢"\], \["Alice", 30\], \["Bob", 25\]\]）またはオブジェクトの配列として書き込むデータ |
| `valueInputOption` | string | いいえ | 書き込むデータの形式 |
| `includeValuesInResponse` | boolean | いいえ | レスポンスに書き込まれた値を含めるかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `updatedRange` | string | 更新されたセル範囲 |
| `updatedRows` | number | 更新された行数 |
| `updatedColumns` | number | 更新された列数 |
| `updatedCells` | number | 更新されたセル数 |
| `metadata` | json | IDとURLを含むスプレッドシートのメタデータ |

### `google_sheets_update`

Google Sheetsスプレッドシートのデータを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | はい | 更新するスプレッドシートのID |
| `range` | string | いいえ | 更新するA1表記の範囲（例: "Sheet1!A1:D10"、"A1:B5"） |
| `values` | array | はい | 2次元配列（例: \[\["名前", "年齢"\], \["Alice", 30\]\]）またはオブジェクトの配列として更新するデータ |
| `valueInputOption` | string | いいえ | 更新するデータの形式 |
| `includeValuesInResponse` | boolean | いいえ | レスポンスに更新された値を含めるかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `updatedRange` | string | 更新されたセルの範囲 |
| `updatedRows` | number | 更新された行数 |
| `updatedColumns` | number | 更新された列数 |
| `updatedCells` | number | 更新されたセル数 |
| `metadata` | json | IDとURLを含むスプレッドシートのメタデータ |

### `google_sheets_append`

Google Sheetsスプレッドシートの末尾にデータを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `spreadsheetId` | string | はい | 追加先のスプレッドシートID |
| `range` | string | いいえ | 追加するセル範囲 |
| `values` | array | はい | 追加するデータ |
| `valueInputOption` | string | いいえ | 追加するデータの形式 |
| `insertDataOption` | string | いいえ | データの挿入方法（上書きまたは行の挿入） |
| `includeValuesInResponse` | boolean | いいえ | レスポンスに追加された値を含めるかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `tableRange` | string | データが追加されたテーブルの範囲 |
| `updatedRange` | string | 更新されたセルの範囲 |
| `updatedRows` | number | 更新された行数 |
| `updatedColumns` | number | 更新された列数 |
| `updatedCells` | number | 更新されたセル数 |
| `metadata` | json | IDとURLを含むスプレッドシートのメタデータ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `google_sheets`
```

--------------------------------------------------------------------------------

---[FILE: google_slides.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/google_slides.mdx

```text
---
title: Google スライド
description: プレゼンテーションの読み取り、作成、編集
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_slides"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Google スライド](https://slides.google.com)は、ユーザーがリアルタイムでスライドショーを作成、編集、共同作業、プレゼンテーションできるダイナミッククラウドベースのプレゼンテーションアプリケーションです。Googleの生産性スイートの一部として、Google スライドは魅力的なプレゼンテーションの設計、他者との共同作業、クラウドを通じたコンテンツのシームレスな共有のための柔軟なプラットフォームを提供します。

Simで Google スライドツールを統合して、自動化されたワークフローの一部としてプレゼンテーションを簡単に管理する方法を学びましょう。Simを使用すると、エージェントや自動化されたプロセスを通じて直接Google スライドプレゼンテーションの読み取り、書き込み、作成、更新ができ、最新情報の配信、カスタムレポートの生成、またはプログラムによるブランド化されたデッキの作成が容易になります。

Google スライドでは、次のことができます：

- **プレゼンテーションの作成と編集**：テーマ、レイアウト、マルチメディアコンテンツを使用して視覚的に魅力的なスライドをデザイン
- **リアルタイムでの共同作業**：チームメイトと同時に作業し、コメントを残し、タスクを割り当て、プレゼンテーションに関するライブフィードバックを受け取る
- **どこでもプレゼンテーション**：オンラインまたはオフラインでプレゼンテーションを表示し、リンクを共有したり、ウェブに公開したりする
- **画像やリッチコンテンツの追加**：画像、グラフィック、チャート、動画を挿入してプレゼンテーションを魅力的にする
- **他のサービスとの統合**：Google ドライブ、ドキュメント、スプレッドシート、その他のサードパーティツールとシームレスに接続
- **あらゆるデバイスからアクセス**：最大限の柔軟性を得るために、デスクトップ、ラップトップ、タブレット、モバイルデバイスでGoogle スライドを使用

Simでは、Google スライド統合によりエージェントがプログラムでプレゼンテーションファイルと直接やり取りできるようになります。スライドコンテンツの読み取り、新しいスライドや画像の挿入、デッキ全体のテキスト置換、新しいプレゼンテーションの生成、スライドサムネイルの取得などのタスクを自動化します。これにより、コンテンツ作成のスケーリング、プレゼンテーションの最新状態の維持、自動化されたドキュメントワークフローへの組み込みが可能になります。SimとGoogle スライドを接続することで、AIによるプレゼンテーション管理を促進し、手動の労力なしにプレゼンテーションの生成、更新、または情報の抽出を簡単に行うことができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Google スライドをワークフローに統合します。プレゼンテーションの読み取り、書き込み、作成、テキストの置換、スライドの追加、画像の追加、サムネイルの取得が可能です。

## ツール

### `google_slides_read`

Google スライドプレゼンテーションからコンテンツを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | はい | 読み取るプレゼンテーションのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `slides` | json | コンテンツを含むスライドの配列 |
| `metadata` | json | ID、タイトル、URLを含むプレゼンテーションのメタデータ |

### `google_slides_write`

Google スライドプレゼンテーションにコンテンツを書き込みまたは更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | はい | 書き込み先のプレゼンテーションのID |
| `content` | string | はい | スライドに書き込むコンテンツ |
| `slideIndex` | number | いいえ | 書き込み先のスライドのインデックス（デフォルトは最初のスライド） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `updatedContent` | boolean | プレゼンテーションのコンテンツが正常に更新されたかどうかを示す |
| `metadata` | json | ID、タイトル、URLを含む更新されたプレゼンテーションのメタデータ |

### `google_slides_create`

新しいGoogle スライドプレゼンテーションを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `title` | string | はい | 作成するプレゼンテーションのタイトル |
| `content` | string | いいえ | 最初のスライドに追加するコンテンツ |
| `folderSelector` | string | いいえ | プレゼンテーションを作成するフォルダを選択 |
| `folderId` | string | いいえ | プレゼンテーションを作成するフォルダのID（内部使用） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `metadata` | json | 作成されたプレゼンテーションのメタデータ（ID、タイトル、URLを含む） |

### `google_slides_replace_all_text`

Google Slidesプレゼンテーション全体でテキストのすべての出現箇所を検索して置換する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | はい | プレゼンテーションのID |
| `findText` | string | はい | 検索するテキスト（例：\{\{placeholder\}\}） |
| `replaceText` | string | はい | 置換するテキスト |
| `matchCase` | boolean | いいえ | 検索で大文字と小文字を区別するかどうか（デフォルト：true） |
| `pageObjectIds` | string | いいえ | 特定のスライドに置換を制限するスライドオブジェクトIDのカンマ区切りリスト（すべてのスライドの場合は空のままにする） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `occurrencesChanged` | number | 置換されたテキストの出現回数 |
| `metadata` | json | プレゼンテーションIDとURLを含む操作メタデータ |

### `google_slides_add_slide`

指定されたレイアウトでGoogle Slidesプレゼンテーションに新しいスライドを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | はい | プレゼンテーションのID |
| `layout` | string | いいえ | スライドの事前定義されたレイアウト（BLANK、TITLE、TITLE_AND_BODY、TITLE_ONLY、SECTION_HEADERなど）。デフォルトはBLANK。 |
| `insertionIndex` | number | いいえ | スライドを挿入する場所を示すオプションのゼロベースのインデックス。指定されていない場合、スライドは最後に追加されます。 |
| `placeholderIdMappings` | string | いいえ | プレースホルダーにカスタムオブジェクトIDを割り当てるプレースホルダーマッピングのJSON配列。形式：\[\{"layoutPlaceholder":\{"type":"TITLE"\},"objectId":"custom_title_id"\}\] |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `slideId` | string | 新しく作成されたスライドのオブジェクトID |
| `metadata` | json | プレゼンテーションID、レイアウト、URLを含む操作メタデータ |

### `google_slides_add_image`

Google Slidesプレゼンテーションの特定のスライドに画像を挿入する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | はい | プレゼンテーションのID |
| `pageObjectId` | string | はい | 画像を追加するスライド/ページのオブジェクトID |
| `imageUrl` | string | はい | 画像の公開アクセス可能なURL（PNG、JPEG、またはGIF形式、最大50MB） |
| `width` | number | いいえ | ポイント単位の画像の幅（デフォルト：300） |
| `height` | number | いいえ | ポイント単位の画像の高さ（デフォルト：200） |
| `positionX` | number | いいえ | 左端からのX位置（ポイント単位）（デフォルト：100） |
| `positionY` | number | いいえ | 上端からのY位置（ポイント単位）（デフォルト：100） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `imageId` | string | 新しく作成された画像のオブジェクトID |
| `metadata` | json | プレゼンテーションIDと画像URLを含む操作メタデータ |

### `google_slides_get_thumbnail`

Google Slidesプレゼンテーションの特定のスライドのサムネイル画像を生成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `presentationId` | string | はい | プレゼンテーションのID |
| `pageObjectId` | string | はい | サムネイルを取得するスライド/ページのオブジェクトID |
| `thumbnailSize` | string | いいえ | サムネイルのサイズ：SMALL（200px）、MEDIUM（800px）、またはLARGE（1600px）。デフォルトはMEDIUM。 |
| `mimeType` | string | いいえ | サムネイル画像のMIMEタイプ：PNGまたはGIF。デフォルトはPNG。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `contentUrl` | string | サムネイル画像へのURL（30分間有効） |
| `width` | number | サムネイルの幅（ピクセル単位） |
| `height` | number | サムネイルの高さ（ピクセル単位） |
| `metadata` | json | プレゼンテーションIDとページオブジェクトIDを含む操作メタデータ |

## 注意事項

- カテゴリ: `tools`
- タイプ: `google_slides`
```

--------------------------------------------------------------------------------

---[FILE: google_vault.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/google_vault.mdx

```text
---
title: Google Vault
description: Vaultの案件に関する検索、エクスポート、保留/エクスポートの管理
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="google_vault"
  color="#E8F0FE"
/>

## 使用方法

Google Vaultに接続して、案件内のエクスポートの作成、エクスポートの一覧表示、保留の管理を行います。

## ツール

### `google_vault_create_matters_export`

案件内でエクスポートを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | はい | 説明なし |
| `exportName` | string | はい | 説明なし |
| `corpus` | string | はい | エクスポートするデータコーパス（MAIL、DRIVE、GROUPS、HANGOUTS_CHAT、VOICE） |
| `accountEmails` | string | いいえ | エクスポート範囲を指定するユーザーメールのカンマ区切りリスト |
| `orgUnitId` | string | いいえ | エクスポート範囲を指定する組織単位ID（メールの代替） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `export` | json | 作成されたエクスポートオブジェクト |

### `google_vault_list_matters_export`

案件のエクスポート一覧を表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | はい | 説明なし |
| `pageSize` | number | いいえ | 説明なし |
| `pageToken` | string | いいえ | 説明なし |
| `exportId` | string | いいえ | 説明なし |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `exports` | json | エクスポートオブジェクトの配列 |
| `export` | json | 単一のエクスポートオブジェクト（exportIdが提供された場合） |
| `nextPageToken` | string | 結果の次のページを取得するためのトークン |

### `google_vault_download_export_file`

Google Vaultエクスポート（GCSオブジェクト）から単一ファイルをダウンロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | はい | 説明なし |
| `bucketName` | string | はい | 説明なし |
| `objectName` | string | はい | 説明なし |
| `fileName` | string | いいえ | 説明なし |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `file` | file | 実行ファイルに保存されたVaultエクスポートファイルのダウンロード |

### `google_vault_create_matters_holds`

案件内に保留を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | はい | 説明なし |
| `holdName` | string | はい | 説明なし |
| `corpus` | string | はい | 保留するデータコーパス（MAIL、DRIVE、GROUPS、HANGOUTS_CHAT、VOICE） |
| `accountEmails` | string | いいえ | 保留するユーザーメールのカンマ区切りリスト |
| `orgUnitId` | string | いいえ | 保留する組織単位ID（アカウントの代替） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `hold` | json | 作成された保留オブジェクト |

### `google_vault_list_matters_holds`

案件の保留リストを表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `matterId` | string | はい | 説明なし |
| `pageSize` | number | いいえ | 説明なし |
| `pageToken` | string | いいえ | 説明なし |
| `holdId` | string | いいえ | 説明なし |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `holds` | json | 保留オブジェクトの配列 |
| `hold` | json | 単一の保留オブジェクト（holdIdが提供された場合） |
| `nextPageToken` | string | 結果の次のページを取得するためのトークン |

### `google_vault_create_matters`

Google Vaultで新しい案件を作成する

#### 入力

| パラメータ | タイプ | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `name` | string | はい | 説明なし |
| `description` | string | いいえ | 説明なし |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `matter` | json | 作成された案件オブジェクト |

### `google_vault_list_matters`

案件一覧を表示、またはmatterIdが提供されている場合は特定の案件を取得

#### 入力

| パラメータ | タイプ | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `pageSize` | number | いいえ | 説明なし |
| `pageToken` | string | いいえ | 説明なし |
| `matterId` | string | いいえ | 説明なし |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `matters` | json | 案件オブジェクトの配列 |
| `matter` | json | 単一の案件オブジェクト（matterIdが提供された場合） |
| `nextPageToken` | string | 結果の次のページを取得するためのトークン |

## 注意事項

- カテゴリ: `tools`
- タイプ: `google_vault`
```

--------------------------------------------------------------------------------

---[FILE: grafana.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/grafana.mdx

```text
---
title: Grafana
description: Grafanaダッシュボード、アラート、アノテーションを操作する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="grafana"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Grafana](https://grafana.com/)は、モニタリング、可観測性、視覚化のための主要なオープンソースプラットフォームです。さまざまなソースからのデータのクエリ、視覚化、アラート、分析を可能にし、インフラストラクチャとアプリケーションのモニタリングに不可欠なツールとなっています。

Grafanaでは以下のことができます：

- **データの視覚化**：メトリクス、ログ、トレースをリアルタイムで表示するためのダッシュボードを構築・カスタマイズ
- **健全性とステータスの監視**：Grafanaインスタンスと接続されたデータソースの健全性をチェック
- **アラートとアノテーションの管理**：アラートルールの設定、通知の管理、重要なイベントでダッシュボードにアノテーションを付ける
- **コンテンツの整理**：より良いアクセス管理のためにダッシュボードとデータソースをフォルダに整理

Simでは、Grafana統合によりエージェントがAPI経由でGrafanaインスタンスと直接やり取りできるようになり、以下のようなアクションが可能になります：

- Grafanaサーバー、データベース、データソースの健全性ステータスの確認
- ダッシュボード、アラートルール、アノテーション、データソース、フォルダの取得、一覧表示、管理
- Grafanaデータとアラートをワークフロー自動化に統合することによるインフラストラクチャのモニタリングの自動化

これらの機能により、Simエージェントはシステムを監視し、アラートに積極的に対応し、自動化されたワークフローの一部として、サービスの信頼性と可視性を確保するのに役立ちます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Grafanaをワークフローに統合します。ダッシュボード、アラート、アノテーション、データソース、フォルダを管理し、健全性ステータスを監視します。

## ツール

### `grafana_get_dashboard`

UIDでダッシュボードを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンスの組織ID |
| `dashboardUid` | string | はい | 取得するダッシュボードのUID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `dashboard` | json | 完全なダッシュボードJSONオブジェクト |
| `meta` | json | ダッシュボードのメタデータ（バージョン、権限など） |

### `grafana_list_dashboards`

すべてのダッシュボードを検索およびリスト表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `query` | string | いいえ | タイトルでダッシュボードをフィルタリングする検索クエリ |
| `tag` | string | いいえ | タグでフィルタリング（複数のタグはカンマ区切り） |
| `folderIds` | string | いいえ | フォルダIDでフィルタリング（カンマ区切り） |
| `starred` | boolean | いいえ | スター付きダッシュボードのみを返す |
| `limit` | number | いいえ | 返すダッシュボードの最大数 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `dashboards` | array | ダッシュボード検索結果のリスト |

### `grafana_create_dashboard`

新しいダッシュボードを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `title` | string | はい | 新しいダッシュボードのタイトル |
| `folderUid` | string | いいえ | ダッシュボードを作成するフォルダのUID |
| `tags` | string | いいえ | カンマ区切りのタグリスト |
| `timezone` | string | いいえ | ダッシュボードのタイムゾーン（例：browser、utc） |
| `refresh` | string | いいえ | 自動更新間隔（例：5s、1m、5m） |
| `panels` | string | いいえ | パネル設定のJSON配列 |
| `overwrite` | boolean | いいえ | 同じタイトルの既存ダッシュボードを上書きする |
| `message` | string | いいえ | ダッシュボードバージョンのコミットメッセージ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | number | 作成されたダッシュボードの数値ID |
| `uid` | string | 作成されたダッシュボードのUID |
| `url` | string | ダッシュボードへのURLパス |
| `status` | string | 操作のステータス（success） |
| `version` | number | ダッシュボードのバージョン番号 |
| `slug` | string | ダッシュボードのURL用スラッグ |

### `grafana_update_dashboard`

既存のダッシュボードを更新します。現在のダッシュボードを取得し、変更内容をマージします。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスのURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `dashboardUid` | string | はい | 更新するダッシュボードのUID |
| `title` | string | いいえ | ダッシュボードの新しいタイトル |
| `folderUid` | string | いいえ | ダッシュボードを移動する新しいフォルダのUID |
| `tags` | string | いいえ | 新しいタグのカンマ区切りリスト |
| `timezone` | string | いいえ | ダッシュボードのタイムゾーン（例：browser、utc） |
| `refresh` | string | いいえ | 自動更新間隔（例：5s、1m、5m） |
| `panels` | string | いいえ | パネル設定のJSON配列 |
| `overwrite` | boolean | いいえ | バージョンの競合があっても上書きする |
| `message` | string | いいえ | このバージョンのコミットメッセージ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | number | 更新されたダッシュボードの数値ID |
| `uid` | string | 更新されたダッシュボードのUID |
| `url` | string | ダッシュボードへのURLパス |
| `status` | string | 操作のステータス（success） |
| `version` | number | ダッシュボードの新しいバージョン番号 |
| `slug` | string | ダッシュボードのURL用スラッグ |

### `grafana_delete_dashboard`

UIDでダッシュボードを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `dashboardUid` | string | はい | 削除するダッシュボードのUID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `title` | string | 削除されたダッシュボードのタイトル |
| `message` | string | 確認メッセージ |
| `id` | number | 削除されたダッシュボードのID |

### `grafana_list_alert_rules`

Grafanaインスタンス内のすべてのアラートルールを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `rules` | array | アラートルールのリスト |

### `grafana_get_alert_rule`

UIDによって特定のアラートルールを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `alertRuleUid` | string | はい | 取得するアラートルールのUID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `uid` | string | アラートルールUID |
| `title` | string | アラートルールタイトル |
| `condition` | string | アラート条件 |
| `data` | json | アラートルールクエリデータ |
| `folderUID` | string | 親フォルダUID |
| `ruleGroup` | string | ルールグループ名 |
| `noDataState` | string | データが返されない場合の状態 |
| `execErrState` | string | 実行エラー時の状態 |
| `annotations` | json | アラート注釈 |
| `labels` | json | アラートラベル |

### `grafana_create_alert_rule`

新しいアラートルールを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `title` | string | はい | アラートルールのタイトル |
| `folderUid` | string | はい | アラートを作成するフォルダのUID |
| `ruleGroup` | string | はい | ルールグループの名前 |
| `condition` | string | はい | アラート条件として使用するクエリまたは式のrefId |
| `data` | string | はい | クエリ/式データオブジェクトのJSON配列 |
| `forDuration` | string | いいえ | 発火前の待機時間（例：5m、1h） |
| `noDataState` | string | いいえ | データが返されない場合の状態（NoData、Alerting、OK） |
| `execErrState` | string | いいえ | 実行エラー時の状態（Alerting、OK） |
| `annotations` | string | いいえ | 注釈のJSONオブジェクト |
| `labels` | string | いいえ | ラベルのJSONオブジェクト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `uid` | string | 作成されたアラートルールのUID |
| `title` | string | アラートルールのタイトル |
| `folderUID` | string | 親フォルダのUID |
| `ruleGroup` | string | ルールグループ名 |

### `grafana_update_alert_rule`

既存のアラートルールを更新します。現在のルールを取得し、変更内容をマージします。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスのURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンスの組織ID |
| `alertRuleUid` | string | はい | 更新するアラートルールのUID |
| `title` | string | いいえ | アラートルールの新しいタイトル |
| `folderUid` | string | いいえ | アラートを移動する新しいフォルダのUID |
| `ruleGroup` | string | いいえ | 新しいルールグループ名 |
| `condition` | string | いいえ | 新しい条件のrefId |
| `data` | string | いいえ | クエリ/式データオブジェクトの新しいJSON配列 |
| `forDuration` | string | いいえ | アラートを発生させるまでの待機時間（例：5m、1h） |
| `noDataState` | string | いいえ | データが返されない場合の状態（NoData、Alerting、OK） |
| `execErrState` | string | いいえ | 実行エラー時の状態（Alerting、OK） |
| `annotations` | string | いいえ | アノテーションのJSONオブジェクト |
| `labels` | string | いいえ | ラベルのJSONオブジェクト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `uid` | string | 更新されたアラートルールのUID |
| `title` | string | アラートルールのタイトル |
| `folderUID` | string | 親フォルダのUID |
| `ruleGroup` | string | ルールグループ名 |

### `grafana_delete_alert_rule`

UIDによるアラートルールの削除

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンスの組織ID |
| `alertRuleUid` | string | はい | 削除するアラートルールのUID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 確認メッセージ |

### `grafana_list_contact_points`

すべてのアラート通知コンタクトポイントの一覧表示

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンスの組織ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `contactPoints` | array | コンタクトポイントのリスト |

### `grafana_create_annotation`

ダッシュボード上または全体的なアノテーションとしてアノテーションを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `text` | string | はい | アノテーションのテキスト内容 |
| `tags` | string | いいえ | カンマ区切りのタグリスト |
| `dashboardUid` | string | はい | アノテーションを追加するダッシュボードのUID |
| `panelId` | number | いいえ | アノテーションを追加するパネルのID |
| `time` | number | いいえ | エポックミリ秒での開始時間（デフォルトは現在時刻） |
| `timeEnd` | number | いいえ | エポックミリ秒での終了時間（範囲アノテーション用） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | number | 作成されたアノテーションのID |
| `message` | string | 確認メッセージ |

### `grafana_list_annotations`

時間範囲、ダッシュボード、またはタグでアノテーションを検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `from` | number | いいえ | エポックミリ秒での開始時間 |
| `to` | number | いいえ | エポックミリ秒での終了時間 |
| `dashboardUid` | string | はい | アノテーションを取得するダッシュボードのUID |
| `panelId` | number | いいえ | パネルIDでフィルタリング |
| `tags` | string | いいえ | フィルタリングするタグのカンマ区切りリスト |
| `type` | string | いいえ | タイプでフィルタリング（alertまたはannotation） |
| `limit` | number | いいえ | 返すアノテーションの最大数 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `annotations` | array | アノテーションのリスト |

### `grafana_update_annotation`

既存のアノテーションを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `annotationId` | number | はい | 更新するアノテーションのID |
| `text` | string | はい | アノテーションの新しいテキスト内容 |
| `tags` | string | いいえ | 新しいタグのカンマ区切りリスト |
| `time` | number | いいえ | エポックミリ秒での新しい開始時間 |
| `timeEnd` | number | いいえ | エポックミリ秒での新しい終了時間 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | number | 更新されたアノテーションのID |
| `message` | string | 確認メッセージ |

### `grafana_delete_annotation`

IDでアノテーションを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `annotationId` | number | はい | 削除するアノテーションのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 確認メッセージ |

### `grafana_list_data_sources`

Grafanaで設定されているすべてのデータソースを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `dataSources` | array | データソースのリスト |

### `grafana_get_data_source`

IDまたはUIDでデータソースを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `dataSourceId` | string | はい | 取得するデータソースのIDまたはUID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | number | データソースID |
| `uid` | string | データソースUID |
| `name` | string | データソース名 |
| `type` | string | データソースタイプ |
| `url` | string | データソース接続URL |
| `database` | string | データベース名（該当する場合） |
| `isDefault` | boolean | これがデフォルトのデータソースかどうか |
| `jsonData` | json | 追加のデータソース設定 |

### `grafana_list_folders`

Grafanaのすべてのフォルダを一覧表示

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `limit` | number | いいえ | 返すフォルダの最大数 |
| `page` | number | いいえ | ページネーション用のページ番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `folders` | array | フォルダのリスト |

### `grafana_create_folder`

Grafanaに新しいフォルダを作成

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Grafanaサービスアカウントトークン |
| `baseUrl` | string | はい | GrafanaインスタンスURL（例：https://your-grafana.com） |
| `organizationId` | string | いいえ | マルチ組織Grafanaインスタンス用の組織ID |
| `title` | string | はい | 新しいフォルダのタイトル |
| `uid` | string | いいえ | フォルダのオプションUID（提供されない場合は自動生成） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | number | 作成されたフォルダの数値ID |
| `uid` | string | 作成されたフォルダのUID |
| `title` | string | 作成されたフォルダのタイトル |
| `url` | string | フォルダへのURLパス |
| `hasAcl` | boolean | フォルダがカスタムACL権限を持っているかどうか |
| `canSave` | boolean | 現在のユーザーがフォルダを保存できるかどうか |
| `canEdit` | boolean | 現在のユーザーがフォルダを編集できるかどうか |
| `canAdmin` | boolean | 現在のユーザーがフォルダに対して管理者権限を持っているかどうか |
| `canDelete` | boolean | 現在のユーザーがフォルダを削除できるかどうか |
| `createdBy` | string | フォルダを作成したユーザーのユーザー名 |
| `created` | string | フォルダが作成されたときのタイムスタンプ |
| `updatedBy` | string | フォルダを最後に更新したユーザーのユーザー名 |
| `updated` | string | フォルダが最後に更新されたときのタイムスタンプ |
| `version` | number | フォルダのバージョン番号 |

## メモ

- カテゴリー: `tools`
- タイプ: `grafana`
```

--------------------------------------------------------------------------------

---[FILE: hubspot.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/hubspot.mdx

```text
---
title: HubSpot
description: HubSpot CRMとの連携やHubSpotイベントからワークフローをトリガーする
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="hubspot"
  color="#FF7A59"
/>

{/* MANUAL-CONTENT-START:intro */}
[HubSpot](https://www.hubspot.com)は、ビジネスの成長をサポートするマーケティング、セールス、カスタマーサービスツールの完全なスイートを提供する包括的なCRMプラットフォームです。強力な自動化機能と広範なAPIを備えたHubSpotは、あらゆる規模や業界のビジネスにサービスを提供する世界有数のCRMプラットフォームの一つとなっています。

HubSpot CRMは、最初の接触から長期的な顧客成功まで、顧客関係を管理するための完全なソリューションを提供します。このプラットフォームは、コンタクト管理、商談追跡、マーケティング自動化、カスタマーサービスツールを統合システムに組み合わせ、チームが顧客の成功に焦点を当てて連携できるよう支援します。

HubSpot CRMの主な機能には以下が含まれます：

- コンタクト＆企業管理：顧客や見込み客の情報を保存・整理するための包括的なデータベース
- 商談パイプライン：カスタマイズ可能なステージを通じて商談を追跡するビジュアル販売パイプライン
- マーケティングイベント：詳細な属性を持つマーケティングキャンペーンやイベントの追跡と管理
- チケット管理：顧客の問題を追跡し解決するためのカスタマーサポートチケットシステム
- 見積もり＆明細項目：詳細な製品明細項目を含む販売見積もりの作成と管理
- ユーザー＆チーム管理：チームの編成、所有権の割り当て、プラットフォーム全体でのユーザーアクティビティの追跡

Simでは、HubSpot統合によりAIエージェントがCRMデータとシームレスに連携し、重要なビジネスプロセスを自動化できます。これにより、インテリジェントなリード評価、自動化された連絡先情報の充実化、案件管理、カスタマーサポートの自動化、およびテックスタック全体でのデータ同期のための強力な機会が生まれます。この統合により、エージェントはすべての主要なHubSpotオブジェクトの作成、取得、更新、検索が可能になり、CRMイベントに応答し、データ品質を維持し、チームが最新の顧客情報を確実に持てるような高度なワークフローを実現します。SimとHubSpotを接続することで、リードを自動的に評価し、サポートチケットを振り分け、顧客とのやり取りに基づいて案件ステージを更新し、見積もりを生成し、CRMデータを他のビジネスシステムと同期させるAIエージェントを構築できます—これにより最終的にチームの生産性が向上し、顧客体験が改善されます。
{/* MANUAL-CONTENT-END */}

## 使用手順

HubSpotをワークフローに統合します。強力な自動化機能を使用して、連絡先、企業、案件、チケット、その他のCRMオブジェクトを管理します。連絡先が作成、削除、または更新されたときにワークフローを開始するトリガーモードで使用できます。

## ツール

### `hubspot_get_users`

HubSpotアカウントからすべてのユーザーを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `limit` | string | いいえ | 返す結果の数 \(デフォルト: 100\) |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `users` | array | HubSpotユーザーオブジェクトの配列 |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `hubspot_list_contacts`

ページネーションをサポートしたHubSpotアカウントからのすべての連絡先の取得

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `limit` | string | いいえ | ページあたりの最大結果数（最大100、デフォルト100） |
| `after` | string | いいえ | 次のページの結果のためのページネーションカーソル |
| `properties` | string | いいえ | 返すプロパティのカンマ区切りリスト（例："email,firstname,lastname"） |
| `associations` | string | いいえ | 関連IDを取得するオブジェクトタイプのカンマ区切りリスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `contacts` | array | HubSpotコンタクトオブジェクトの配列 |
| `paging` | object | ページネーション情報 |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `hubspot_get_contact`

HubSpotからIDまたはメールで単一のコンタクトを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | はい | 取得するコンタクトのIDまたはメール |
| `idProperty` | string | いいえ | 一意の識別子として使用するプロパティ（例："email"）。指定されていない場合、レコードIDを使用 |
| `properties` | string | いいえ | 返すプロパティのカンマ区切りリスト |
| `associations` | string | いいえ | 関連IDを取得するオブジェクトタイプのカンマ区切りリスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `contact` | object | プロパティを持つHubSpotコンタクトオブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `hubspot_create_contact`

HubSpotで新しい連絡先を作成します。少なくともemail、firstname、lastnameのいずれか1つが必要です

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `properties` | object | はい | JSONオブジェクトとしての連絡先プロパティ。少なくともemail、firstname、lastnameのいずれか1つを含める必要があります |
| `associations` | array | いいえ | 連絡先と作成する関連付けの配列（例：企業、取引）。各オブジェクトには「to」（「id」を含む）と「types」（「associationCategory」と「associationTypeId」を含む）が必要です |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `contact` | object | 作成されたHubSpotコンタクトオブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `hubspot_update_contact`

IDまたはメールアドレスでHubSpotの既存の連絡先を更新します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | はい | 更新する連絡先のIDまたはメールアドレス |
| `idProperty` | string | いいえ | 一意の識別子として使用するプロパティ（例：「email」）。指定されていない場合は、レコードIDを使用します |
| `properties` | object | はい | JSONオブジェクトとして更新する連絡先プロパティ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `contact` | object | 更新されたHubSpotコンタクトオブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `hubspot_search_contacts`

フィルター、ソート、クエリを使用してHubSpotで連絡先を検索します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `filterGroups` | array | いいえ | フィルターグループの配列。各グループにはpropertyName、operator、valueを持つフィルターが含まれます |
| `sorts` | array | いいえ | propertyNameと方向（"ASCENDING"または"DESCENDING"）を持つソートオブジェクトの配列 |
| `query` | string | いいえ | 検索クエリ文字列 |
| `properties` | array | いいえ | 返すプロパティ名の配列 |
| `limit` | number | いいえ | 返す結果の最大数（最大100） |
| `after` | string | いいえ | 次のページのページネーションカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `contacts` | array | 一致するHubSpotコンタクトオブジェクトの配列 |
| `total` | number | 一致するコンタクトの総数 |
| `paging` | object | ページネーション情報 |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `hubspot_list_companies`

ページネーションをサポートしてHubSpotアカウントからすべての企業を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `limit` | string | いいえ | ページごとの最大結果数（最大100、デフォルト100） |
| `after` | string | いいえ | 結果の次のページのページネーションカーソル |
| `properties` | string | いいえ | 返すプロパティのカンマ区切りリスト |
| `associations` | string | いいえ | 関連IDを取得するオブジェクトタイプのカンマ区切りリスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `companies` | array | HubSpot会社オブジェクトの配列 |
| `paging` | object | ページネーション情報 |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `hubspot_get_company`

IDまたはドメインからHubSpotの単一企業を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | はい | 取得する企業のIDまたはドメイン |
| `idProperty` | string | いいえ | 一意の識別子として使用するプロパティ（例："domain"）。指定されていない場合、レコードIDを使用します |
| `properties` | string | いいえ | 返すプロパティのカンマ区切りリスト |
| `associations` | string | いいえ | 関連IDを取得するオブジェクトタイプのカンマ区切りリスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `company` | object | プロパティを持つHubSpot会社オブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `hubspot_create_company`

HubSpotに新しい企業を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `properties` | object | はい | JSONオブジェクトとしての企業プロパティ（例：名前、ドメイン、都市、業界） |
| `associations` | array | いいえ | 企業と作成する関連付けの配列 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `company` | object | 作成されたHubSpot会社オブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `hubspot_update_company`

IDまたはドメインによってHubSpotの既存企業を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `companyId` | string | はい | 更新する企業のIDまたはドメイン |
| `idProperty` | string | いいえ | 一意の識別子として使用するプロパティ（例："domain"）。指定されていない場合、レコードIDを使用します |
| `properties` | object | はい | JSONオブジェクトとして更新する企業プロパティ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `company` | object | 更新されたHubSpot会社オブジェクト |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `hubspot_search_companies`

フィルター、ソート、クエリを使用してHubSpotで会社を検索する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `filterGroups` | array | いいえ | フィルターグループの配列。各グループにはpropertyName、operator、valueを持つフィルターが含まれる |
| `sorts` | array | いいえ | propertyNameと方向（"ASCENDING"または"DESCENDING"）を持つソートオブジェクトの配列 |
| `query` | string | いいえ | 検索クエリ文字列 |
| `properties` | array | いいえ | 返すプロパティ名の配列 |
| `limit` | number | いいえ | 返す結果の最大数（最大100） |
| `after` | string | いいえ | 次のページのページネーションカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `companies` | array | 一致するHubSpot会社オブジェクトの配列 |
| `total` | number | 一致する会社の総数 |
| `paging` | object | ページネーション情報 |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

### `hubspot_list_deals`

ページネーションをサポートしてHubSpotアカウントからすべての取引を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `limit` | string | いいえ | ページあたりの最大結果数（最大100、デフォルト100） |
| `after` | string | いいえ | 結果の次のページのページネーションカーソル |
| `properties` | string | いいえ | 返すプロパティのカンマ区切りリスト |
| `associations` | string | いいえ | 関連IDを取得するオブジェクトタイプのカンマ区切りリスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deals` | array | HubSpotディールオブジェクトの配列 |
| `paging` | object | ページネーション情報 |
| `metadata` | object | 操作メタデータ |
| `success` | boolean | 操作成功ステータス |

## 注意事項

- カテゴリー: `tools`
- タイプ: `hubspot`
```

--------------------------------------------------------------------------------

````
