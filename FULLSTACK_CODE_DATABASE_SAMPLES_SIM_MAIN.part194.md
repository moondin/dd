---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 194
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 194 of 933)

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

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/ja/knowledgebase/index.mdx

```text
---
title: 概要
description: インテリジェントなベクトル検索とチャンキングを使用して、ドキュメントをアップロード、処理、検索
---

import { Video } from '@/components/ui/video'
import { Image } from '@/components/ui/image'

ナレッジベースでは、インテリジェントなベクトル検索とチャンキングを使用して、ドキュメントのアップロード、処理、検索が可能です。様々な種類のドキュメントが自動的に処理され、埋め込まれ、検索可能になります。ドキュメントはインテリジェントにチャンク化され、自然言語クエリを使用して閲覧、編集、検索することができます。

## アップロードと処理

始めるには、単にドキュメントをアップロードするだけです。Simは自動的にバックグラウンドでドキュメントを処理し、テキストを抽出し、埋め込みを作成し、検索可能なチャンクに分割します。

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-1.mp4" width={700} height={450} />
</div>

システムは処理パイプライン全体を代行します：

1. **テキスト抽出**：各ファイルタイプに特化したパーサーを使用してコンテンツが抽出されます
2. **インテリジェントなチャンキング**：ドキュメントは設定可能なサイズとオーバーラップで意味のあるチャンクに分割されます
3. **埋め込み生成**：セマンティック検索機能のためのベクトル埋め込みが作成されます
4. **処理状況**：ドキュメントの処理進捗を追跡できます

## サポートされているファイルタイプ

SimはPDF、Word（DOC/DOCX）、プレーンテキスト（TXT）、Markdown（MD）、HTML、Excel（XLS/XLSX）、PowerPoint（PPT/PPTX）、CSVファイルをサポートしています。ファイルは最大100MBまで対応し、50MB未満のファイルが最適なパフォーマンスを発揮します。複数のドキュメントを同時にアップロードでき、PDFファイルにはスキャンされたドキュメント用のOCR処理が含まれています。

## チャンクの閲覧と編集

ドキュメントが処理されると、個々のチャンクを閲覧および編集できます。これにより、コンテンツの整理方法と検索方法を完全に制御できます。

<Image src="/static/knowledgebase/knowledgebase.png" alt="処理されたコンテンツを表示するドキュメントチャンクビュー" width={800} height={500} />

### チャンク設定
- **デフォルトチャンクサイズ**: 1,024文字
- **設定可能範囲**: チャンクあたり100〜4,000文字
- **スマートオーバーラップ**: コンテキスト保持のためデフォルトで200文字
- **階層的分割**: 文書構造（セクション、段落、文）を尊重

### 編集機能
- **チャンク内容の編集**: 個々のチャンクのテキスト内容を修正
- **チャンク境界の調整**: 必要に応じてチャンクの結合や分割
- **メタデータの追加**: 追加のコンテキストでチャンクを強化
- **一括操作**: 複数のチャンクを効率的に管理

## 高度なPDF処理

PDFドキュメントについて、Simは強化された処理機能を提供します：

### OCRサポート
Azureまたは[Mistral OCR](https://docs.mistral.ai/ocr/)で構成されている場合：
- **スキャンされたドキュメント処理**: 画像ベースのPDFからテキストを抽出
- **混合コンテンツ処理**: テキストと画像の両方を含むPDFを処理
- **高精度**: 高度なAIモデルが正確なテキスト抽出を保証

## ワークフローでのナレッジブロックの使用

ドキュメントが処理されると、ナレッジブロックを通じてAIワークフローで使用できるようになります。これにより検索拡張生成（RAG）が可能になり、AIエージェントがドキュメントの内容にアクセスして推論し、より正確でコンテキストに沿った回答を提供できます。

<Image src="/static/knowledgebase/knowledgebase-2.png" alt="ワークフローでのナレッジブロックの使用" width={800} height={500} />

### ナレッジブロックの機能
- **意味検索**: 自然言語クエリを使用して関連コンテンツを検索
- **コンテキスト統合**: エージェントプロンプトに関連チャンクを自動的に含める
- **動的検索**: ワークフロー実行中にリアルタイムで検索が行われる
- **関連性スコアリング**: 意味的類似性によって結果がランク付け

### 統合オプション
- **システムプロンプト**: AIエージェントにコンテキストを提供
- **動的コンテキスト**: 会話中に関連情報を検索して含める
- **複数ドキュメント検索**: ナレッジベース全体を横断して検索
- **フィルター検索**: タグと組み合わせて正確なコンテンツ検索

## ベクトル検索技術

Simは[pgvector](https://github.com/pgvector/pgvector)を活用したベクトル検索を使用して、コンテンツの意味とコンテキストを理解します：

### 意味的理解
- **コンテキスト検索**：正確なキーワードが一致しなくても関連コンテンツを見つける
- **概念ベースの検索**：アイデア間の関係性を理解
- **多言語サポート**：異なる言語間で機能
- **同義語認識**：関連する用語や概念を見つける

### 検索機能
- **自然言語クエリ**：平易な日本語で質問できる
- **類似性検索**：概念的に類似したコンテンツを見つける
- **ハイブリッド検索**：ベクトル検索と従来のキーワード検索を組み合わせる
- **結果の設定**：結果の数と関連性の閾値を制御

## ドキュメント管理

### 整理機能
- **一括アップロード**：非同期APIを通じて複数のファイルを一度にアップロード
- **処理状況**：ドキュメント処理のリアルタイム更新
- **検索とフィルタリング**：大規模なコレクションからドキュメントを素早く見つける
- **メタデータ追跡**：ファイル情報と処理詳細の自動キャプチャ

### セキュリティとプライバシー
- **安全なストレージ**：エンタープライズグレードのセキュリティでドキュメントを保存
- **アクセス制御**：ワークスペースベースの権限
- **処理の分離**：各ワークスペースは分離されたドキュメント処理を持つ
- **データ保持**：ドキュメント保持ポリシーの設定

## はじめに

1. **ナレッジベースに移動**：ワークスペースのサイドバーからアクセス
2. **ドキュメントのアップロード**：ドラッグ＆ドロップまたはファイルを選択してアップロード
3. **処理の監視**：ドキュメントが処理されチャンク化される過程を確認
4. **チャンクの探索**：処理されたコンテンツを表示・編集
5. **ワークフローへの追加**：ナレッジブロックを使用してAIエージェントと統合

ナレッジベースは静的なドキュメントを、AIワークフローがより情報に基づいた文脈的な応答のために活用できる、インテリジェントで検索可能なリソースに変換します。
```

--------------------------------------------------------------------------------

---[FILE: tags.mdx]---
Location: sim-main/apps/docs/content/docs/ja/knowledgebase/tags.mdx

```text
---
title: タグとフィルタリング
---

import { Video } from '@/components/ui/video'

タグは、ドキュメントを整理し、ベクトル検索に正確なフィルタリングを作成するための強力な方法を提供します。タグベースのフィルタリングとセマンティック検索を組み合わせることで、ナレッジベースから必要なコンテンツを正確に取得できます。

## ドキュメントへのタグの追加

ナレッジベース内の任意のドキュメントにカスタムタグを追加して、コンテンツを整理・分類し、より簡単に取得できるようにすることができます。

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-tag.mp4" width={700} height={450} />
</div>

### タグ管理
- **カスタムタグ**: ワークフローに合わせた独自のタグシステムを作成
- **ドキュメントごとの複数タグ**: 各ドキュメントに必要な数のタグを適用可能、ナレッジベースごとに7つのタグスロットが利用可能で、そのナレッジベース内のすべてのドキュメントで共有されます
- **タグの整理**: 一貫したタグ付けで関連ドキュメントをグループ化

### タグのベストプラクティス
- **一貫した命名**: ドキュメント全体で標準化されたタグ名を使用
- **説明的なタグ**: 明確で意味のあるタグ名を使用
- **定期的なクリーンアップ**: 未使用または古いタグを定期的に削除

## ナレッジブロックでのタグの使用

タグは、ワークフローのナレッジブロックと組み合わせると強力になります。特定のタグ付きコンテンツに検索をフィルタリングすることで、AIエージェントが最も関連性の高い情報を取得できるようになります。

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="knowledgebase-tag2.mp4" width={700} height={450} />
</div>

## 検索モード

ナレッジブロックは、提供する内容に応じて3つの異なる検索モードをサポートしています：

### 1. タグのみの検索
**タグのみを提供する場合**（検索クエリなし）：
- **直接取得**: 指定されたタグを持つすべてのドキュメントを取得
- **ベクトル検索なし**: 結果は純粋にタグマッチングに基づく
- **高速パフォーマンス**: セマンティック処理なしの迅速な取得
- **完全一致**: 指定されたすべてのタグを持つドキュメントのみが返される

**ユースケース**: 特定のカテゴリやプロジェクトからすべてのドキュメントが必要な場合

### 2. ベクトル検索のみ
**検索クエリのみを提供する**場合（タグなし）：
- **意味検索**: 意味とコンテキストに基づいてコンテンツを検索
- **完全なナレッジベース**: すべてのドキュメントを横断して検索
- **関連性ランキング**: 意味的類似性によって結果を順序付け
- **自然言語**: 質問やフレーズを使用して関連コンテンツを検索

**ユースケース**: 組織に関係なく最も関連性の高いコンテンツが必要な場合

### 3. タグフィルタリングとベクトル検索の組み合わせ
**タグと検索クエリの両方を提供する**場合：
1. **最初に**: 指定されたタグを持つドキュメントのみにフィルタリング
2. **次に**: そのフィルタリングされたサブセット内でベクトル検索を実行
3. **結果**: タグ付けされたドキュメントからのみ意味的に関連するコンテンツ

**ユースケース**: 特定のカテゴリやプロジェクトから関連コンテンツが必要な場合

### 検索設定

#### タグフィルタリング
- **複数タグ**: OR論理のために複数のタグを使用（ドキュメントは1つ以上のタグを持つ必要がある）
- **タグの組み合わせ**: 正確なフィルタリングのために異なるタグタイプを組み合わせる
- **大文字小文字の区別**: タグマッチングは大文字小文字を区別しない
- **部分一致**: 正確なタグ名の一致が必要

#### ベクトル検索パラメータ
- **クエリの複雑さ**: 自然言語の質問が最も効果的
- **結果の制限**: 取得するチャンクの数を設定
- **関連性のしきい値**: 最小類似性スコアを設定
- **コンテキストウィンドウ**: ユースケースに合わせてチャンクサイズを調整

## ワークフローとの統合

### ナレッジブロックの設定
1. **ナレッジベースを選択**: 検索するナレッジベースを選択
2. **タグを追加**: フィルタリングタグを指定（オプション）
3. **クエリを入力**: 検索クエリを追加（オプション）
4. **結果を設定**: 取得するチャンクの数を設定
5. **検索をテスト**: ワークフローで使用する前に結果をプレビュー

### 動的タグの使用法
- **変数タグ**: ワークフロー変数をタグ値として使用
- **条件付きフィルタリング**: ワークフローのロジックに基づいて異なるタグを適用
- **コンテキスト認識検索**: 会話のコンテキストに基づいてタグを調整
- **複数ステップのフィルタリング**: ワークフローのステップを通じて検索を絞り込み

### パフォーマンスの最適化
- **効率的なフィルタリング**: タグフィルタリングはベクトル検索の前に行われ、パフォーマンスが向上
- **キャッシング**: 頻繁に使用されるタグの組み合わせは速度向上のためにキャッシュされる
- **並列処理**: 複数のタグ検索を同時に実行可能
- **リソース管理**: 検索リソースの自動最適化

## タグの使用を始める

1. **タグ構造を計画する**: 一貫した命名規則を決める
2. **タグ付けを開始**: 既存のドキュメントに関連タグを追加する
3. **組み合わせをテスト**: タグと検索クエリの組み合わせを試す
4. **ワークフローに統合**: タグ付け戦略とともにナレッジブロックを使用する
5. **時間をかけて改良**: 検索結果に基づいてタグ付けアプローチを調整する

タグは、ナレッジベースを単なるドキュメント保存場所から、AIワークフローが精密に操作できる、正確に整理された検索可能なインテリジェンスシステムへと変換します。
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/ja/mcp/index.mdx

```text
---
title: MCP（モデルコンテキストプロトコル）
---

import { Image } from '@/components/ui/image'
import { Callout } from 'fumadocs-ui/components/callout'

モデルコンテキストプロトコル（[MCP](https://modelcontextprotocol.com/)）を使用すると、標準化されたプロトコルを使用して外部ツールやサービスを接続し、APIやサービスをワークフローに直接統合することができます。MCPを使用することで、エージェントやワークフローとシームレスに連携するカスタム統合機能を追加して、Simの機能を拡張できます。

## MCPとは？

MCPは、AIアシスタントが外部データソースやツールに安全に接続できるようにするオープンスタンダードです。以下のような標準化された方法を提供します：

- データベース、API、ファイルシステムへの接続
- 外部サービスからのリアルタイムデータへのアクセス
- カスタムツールやスクリプトの実行
- 外部リソースへの安全で制御されたアクセスの維持

## MCPサーバーの設定

MCPサーバーはエージェントが使用できるツールのコレクションを提供します。ワークスペース設定で構成してください：

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-1.png"
    alt="設定でのMCPサーバーの構成"
    width={700}
    height={450}
    className="my-6"
  />
</div>

1. ワークスペース設定に移動します
2. **MCPサーバー**セクションに進みます
3. **MCPサーバーを追加**をクリックします
4. サーバー構成の詳細を入力します
5. 構成を保存します

<Callout type="info">
エージェントブロックのツールバーから直接MCPサーバーを構成することもできます（クイックセットアップ）。
</Callout>

## エージェントでのMCPツールの使用

MCPサーバーが構成されると、そのツールはエージェントブロック内で利用可能になります：

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-2.png"
    alt="エージェントブロックでのMCPツールの使用"
    width={700}
    height={450}
    className="my-6"
  />
</div>

1. **エージェント**ブロックを開きます
2. **ツール**セクションで、利用可能なMCPツールが表示されます
3. エージェントに使用させたいツールを選択します
4. これでエージェントは実行中にこれらのツールにアクセスできるようになります

## スタンドアロンMCPツールブロック

より細かい制御のために、特定のMCPツールを実行するための専用MCPツールブロックを使用できます：

<div className="flex justify-center">
  <Image
    src="/static/blocks/mcp-3.png"
    alt="スタンドアロンMCPツールブロック"
    width={700}
    height={450}
    className="my-6"
  />
</div>

MCPツールブロックでは以下のことが可能です：
- 構成済みのMCPツールを直接実行する
- ツールに特定のパラメータを渡す
- ツールの出力を後続のワークフローステップで使用する
- 複数のMCPツールを連鎖させる

### MCPツールとエージェントの使い分け

**エージェントとMCPツールを使用する場合：**
- AIにどのツールを使用するか決定させたい場合
- ツールをいつどのように使用するかについて複雑な推論が必要な場合
- ツールと自然言語でのやり取りが必要な場合

**MCPツールブロックを使用する場合：**
- 決定論的なツール実行が必要な場合
- 既知のパラメータで特定のツールを実行したい場合
- 予測可能なステップで構造化されたワークフローを構築している場合

## 権限要件

MCP機能には特定のワークスペース権限が必要です：

| アクション | 必要な権限 |
|--------|-------------------|
| 設定でMCPサーバーを構成する | **管理者** |
| エージェントでMCPツールを使用する | **書き込み** または **管理者** |
| 利用可能なMCPツールを表示する | **読み取り**、**書き込み**、または **管理者** |
| MCPツールブロックを実行する | **書き込み** または **管理者** |

## 一般的なユースケース

### データベース統合
ワークフロー内でデータのクエリ、挿入、更新を行うためにデータベースに接続します。

### API統合
組み込みのSim統合がない外部APIやWebサービスにアクセスします。

### ファイルシステムアクセス
ローカルまたはリモートファイルシステム上のファイルの読み取り、書き込み、操作を行います。

### カスタムビジネスロジック
組織のニーズに特化したカスタムスクリプトやツールを実行します。

### リアルタイムデータアクセス
ワークフロー実行中に外部システムからライブデータを取得します。

## セキュリティに関する考慮事項

- MCPサーバーは構成したユーザーの権限で実行されます
- インストール前に必ずMCPサーバーのソースを確認してください
- 機密性の高い構成データには環境変数を使用してください
- エージェントにアクセス権を付与する前にMCPサーバーの機能を確認してください

## トラブルシューティング

### MCPサーバーが表示されない
- サーバー構成が正しいことを確認してください
- 必要な権限があることを確認してください
- MCPサーバーが実行中でアクセス可能であることを確認してください

### ツール実行の失敗
- ツールパラメータが正しくフォーマットされていることを確認してください
- エラーメッセージについてMCPサーバーログを確認してください
- 必要な認証が構成されていることを確認してください

### 権限エラー
- ワークスペースの権限レベルを確認する
- MCPサーバーが追加認証を必要としているか確認する
- サーバーがワークスペース用に適切に構成されているか確認する
```

--------------------------------------------------------------------------------

---[FILE: roles-and-permissions.mdx]---
Location: sim-main/apps/docs/content/docs/ja/permissions/roles-and-permissions.mdx

```text
---
title: 役割と権限
---

import { Video } from '@/components/ui/video'

チームメンバーを組織やワークスペースに招待する際、どのレベルのアクセス権を付与するかを選択する必要があります。このガイドでは、各権限レベルでユーザーが実行できることを説明し、チームの役割と各権限レベルが提供するアクセス権を理解するのに役立ちます。

## ワークスペースに誰かを招待する方法

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="invitations.mp4" width={700} height={450} />
</div>

## ワークスペースの権限レベル

ワークスペースに誰かを招待する際、次の3つの権限レベルのいずれかを割り当てることができます：

| 権限 | できること |
|------------|------------------|
| **閲覧** | ワークフローの表示、実行結果の確認ができますが、変更はできません |
| **編集** | ワークフローの作成と編集、ワークフローの実行、環境変数の管理ができます |
| **管理者** | 編集権限のすべてに加え、ユーザーの招待/削除、ワークスペース設定の管理ができます |

## 各権限レベルでできること

各権限レベルでユーザーができることの詳細な内訳は次のとおりです：

### 閲覧権限
**最適な対象者：** ステークホルダー、オブザーバー、または可視性は必要だが変更を加えるべきではないチームメンバー

**できること：**
- ワークスペース内のすべてのワークフローの表示
- ワークフロー実行結果とログの確認
- ワークフロー構成と設定の閲覧
- 環境変数の表示（編集はできません）

**できないこと：**
- ワークフローの作成、編集、削除
- ワークフローの実行またはデプロイ
- ワークスペース設定の変更
- 他のユーザーの招待

### 編集権限  
**最適な対象者：** 開発者、コンテンツ作成者、または自動化に積極的に取り組むチームメンバー

**できること：**
- 閲覧ユーザーができることすべてに加えて：
- ワークフローの作成、編集、削除
- ワークフローの実行とデプロイ
- ワークスペース環境変数の追加、編集、削除
- 利用可能なすべてのツールと統合の使用
- ワークフロー編集でのリアルタイムコラボレーション

**彼らができないこと：**
- ワークスペースにユーザーを招待または削除すること
- ワークスペース設定を変更すること
- ワークスペースを削除すること

### 管理者権限
**最適な対象者：** チームリーダー、プロジェクトマネージャー、またはワークスペースを管理する必要のある技術リーダー

**彼らができること：**
- 書き込みユーザーができることすべてに加えて：
- 任意の権限レベルで新しいユーザーをワークスペースに招待すること
- ワークスペースからユーザーを削除すること
- ワークスペース設定と連携機能を管理すること
- 外部ツール接続を設定すること
- 他のユーザーが作成したワークフローを削除すること

**彼らができないこと：**
- ワークスペースを削除すること（ワークスペースオーナーのみ可能）
- ワークスペースからワークスペースオーナーを削除すること

---

## ワークスペースオーナーと管理者の違い

すべてのワークスペースには、1人の**オーナー**（作成者）と任意の数の**管理者**がいます。

### ワークスペースオーナー
- すべての管理者権限を持っています
- ワークスペースを削除できます
- ワークスペースから削除されることはありません
- 所有権を別のユーザーに譲渡できます

### ワークスペース管理者
- ワークスペースの削除やオーナーの削除を除くすべての操作が可能です
- オーナーや他の管理者によってワークスペースから削除される可能性があります

---

## 一般的なシナリオ

### チームに新しい開発者を追加する場合
1. **組織レベル**：**組織メンバー**として招待します
2. **ワークスペースレベル**：ワークフローの作成や編集ができるように**書き込み**権限を付与します

### プロジェクトマネージャーを追加する場合
1. **組織レベル**：**組織メンバー**として招待します
2. **ワークスペースレベル**：チームを管理しすべてを閲覧できるように**管理者**権限を付与します

### ステークホルダーやクライアントを追加する場合
1. **組織レベル**：**組織メンバー**として招待します
2. **ワークスペースレベル**：進捗を確認できるが変更はできないように**閲覧**権限を付与します

---

## 環境変数

ユーザーは2種類の環境変数を作成できます：

### 個人環境変数
- 個々のユーザーのみに表示されます
- 実行するすべてのワークフローで利用可能
- ユーザー設定で管理されます

### ワークスペース環境変数
- **読み取り権限**：変数名と値を確認できます
- **書き込み/管理者権限**：変数の追加、編集、削除ができます
- すべてのワークスペースメンバーが利用可能
- 個人変数とワークスペース変数が同じ名前の場合、個人変数が優先されます

---

## ベストプラクティス

### 最小限の権限から始める
業務に必要な最低限の権限レベルをユーザーに付与しましょう。後から権限を増やすことは常に可能です。

### 組織構造を賢く活用する
- 信頼できるチームリーダーを**組織管理者**にする
- ほとんどのチームメンバーは**組織メンバー**にする
- ワークスペースの**管理者**権限はユーザー管理が必要な人のために確保する

### 定期的に権限を見直す
チームメンバーが役割を変更したり退職したりした場合は特に、誰が何にアクセスできるかを定期的に確認しましょう。

### 環境変数のセキュリティ
- 機密性の高いAPIキーには個人環境変数を使用する
- 共有設定にはワークスペース環境変数を使用する
- 機密変数へのアクセス権を持つユーザーを定期的に監査する

---

## 組織の役割

組織に誰かを招待する際、次の2つの役割のいずれかを割り当てることができます：

### 組織管理者
**できること：**
- チームメンバーを組織に招待および削除する
- 新しいワークスペースを作成する
- 請求とサブスクリプション設定を管理する
- 組織内のすべてのワークスペースにアクセスする

### 組織メンバー  
**できること：**
- 特別に招待されたワークスペースにアクセスする
- 組織メンバーのリストを表示する
- 新しい人を招待したり組織設定を管理したりすることはできません
```

--------------------------------------------------------------------------------

---[FILE: python.mdx]---
Location: sim-main/apps/docs/content/docs/ja/sdks/python.mdx

```text
---
title: Python
---

import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'

Simの公式Python SDKを使用すると、公式Python SDKを使用してPythonアプリケーションからプログラムでワークフローを実行できます。

<Callout type="info">
  Python SDKはPython 3.8以上をサポートし、非同期実行、指数バックオフによる自動レート制限、使用状況追跡機能を提供します。
</Callout>

## インストール

pipを使用してSDKをインストールします：

```bash
pip install simstudio-sdk
```

## クイックスタート

以下は、始めるための簡単な例です：

```python
from simstudio import SimStudioClient

# Initialize the client
client = SimStudioClient(
    api_key="your-api-key-here",
    base_url="https://sim.ai"  # optional, defaults to https://sim.ai
)

# Execute a workflow
try:
    result = client.execute_workflow("workflow-id")
    print("Workflow executed successfully:", result)
except Exception as error:
    print("Workflow execution failed:", error)
```

## APIリファレンス

### SimStudioClient

#### コンストラクタ

```python
SimStudioClient(api_key: str, base_url: str = "https://sim.ai")
```

**パラメータ：**
- `api_key` (str): SimのAPIキー
- `base_url` (str, オプション): Sim APIのベースURL

#### メソッド

##### execute_workflow()

オプションの入力データでワークフローを実行します。

```python
result = client.execute_workflow(
    "workflow-id",
    input_data={"message": "Hello, world!"},
    timeout=30.0  # 30 seconds
)
```

**パラメータ:**
- `workflow_id` (str): 実行するワークフローのID
- `input_data` (dict, オプション): ワークフローに渡す入力データ
- `timeout` (float, オプション): タイムアウト（秒）（デフォルト: 30.0）
- `stream` (bool, オプション): ストリーミングレスポンスを有効にする（デフォルト: False）
- `selected_outputs` (list[str], オプション): `blockName.attribute`形式でストリーミングするブロック出力（例: `["agent1.content"]`）
- `async_execution` (bool, オプション): 非同期実行（デフォルト: False）

**戻り値:** `WorkflowExecutionResult | AsyncExecutionResult`

`async_execution=True`の場合、ポーリング用のタスクIDをすぐに返します。それ以外の場合は、完了を待ちます。

##### get_workflow_status()

ワークフローのステータス（デプロイメントステータスなど）を取得します。

```python
status = client.get_workflow_status("workflow-id")
print("Is deployed:", status.is_deployed)
```

**パラメータ:**
- `workflow_id` (str): ワークフローのID

**戻り値:** `WorkflowStatus`

##### validate_workflow()

ワークフローが実行準備ができているかを検証します。

```python
is_ready = client.validate_workflow("workflow-id")
if is_ready:
    # Workflow is deployed and ready
    pass
```

**パラメータ:**
- `workflow_id` (str): ワークフローのID

**戻り値:** `bool`

##### get_job_status()

非同期ジョブ実行のステータスを取得します。

```python
status = client.get_job_status("task-id-from-async-execution")
print("Status:", status["status"])  # 'queued', 'processing', 'completed', 'failed'
if status["status"] == "completed":
    print("Output:", status["output"])
```

**パラメータ:**
- `task_id` (str): 非同期実行から返されたタスクID

**戻り値:** `Dict[str, Any]`

**レスポンスフィールド:**
- `success` (bool): リクエストが成功したかどうか
- `taskId` (str): タスクID
- `status` (str): 次のいずれか: `'queued'`, `'processing'`, `'completed'`, `'failed'`, `'cancelled'`
- `metadata` (dict): `startedAt`, `completedAt`, `duration`を含む
- `output` (any, オプション): ワークフロー出力（完了時）
- `error` (any, オプション): エラー詳細（失敗時）
- `estimatedDuration` (int, オプション): 推定所要時間（ミリ秒）（処理中/キュー時）

##### execute_with_retry()

指数バックオフを使用してレート制限エラーで自動的に再試行するワークフロー実行。

```python
result = client.execute_with_retry(
    "workflow-id",
    input_data={"message": "Hello"},
    timeout=30.0,
    max_retries=3,           # Maximum number of retries
    initial_delay=1.0,       # Initial delay in seconds
    max_delay=30.0,          # Maximum delay in seconds
    backoff_multiplier=2.0   # Exponential backoff multiplier
)
```

**パラメータ:**
- `workflow_id` (str): 実行するワークフローのID
- `input_data` (dict, オプション): ワークフローに渡す入力データ
- `timeout` (float, オプション): タイムアウト（秒）
- `stream` (bool, オプション): ストリーミングレスポンスを有効にする
- `selected_outputs` (list, オプション): ストリーミングするブロック出力
- `async_execution` (bool, オプション): 非同期実行
- `max_retries` (int, オプション): 最大再試行回数（デフォルト: 3）
- `initial_delay` (float, オプション): 初期遅延（秒）（デフォルト: 1.0）
- `max_delay` (float, オプション): 最大遅延（秒）（デフォルト: 30.0）
- `backoff_multiplier` (float, オプション): バックオフ乗数（デフォルト: 2.0）

**戻り値:** `WorkflowExecutionResult | AsyncExecutionResult`

リトライロジックは、サンダリングハード問題を防ぐために±25%のジッターを伴う指数バックオフ（1秒→2秒→4秒→8秒...）を使用します。APIが `retry-after` ヘッダーを提供する場合、代わりにそれが使用されます。

##### get_rate_limit_info()

最後のAPIレスポンスから現在のレート制限情報を取得します。

```python
rate_limit_info = client.get_rate_limit_info()
if rate_limit_info:
    print("Limit:", rate_limit_info.limit)
    print("Remaining:", rate_limit_info.remaining)
    print("Reset:", datetime.fromtimestamp(rate_limit_info.reset))
```

**戻り値:** `RateLimitInfo | None`

##### get_usage_limits()

アカウントの現在の使用制限とクォータ情報を取得します。

```python
limits = client.get_usage_limits()
print("Sync requests remaining:", limits.rate_limit["sync"]["remaining"])
print("Async requests remaining:", limits.rate_limit["async"]["remaining"])
print("Current period cost:", limits.usage["currentPeriodCost"])
print("Plan:", limits.usage["plan"])
```

**戻り値:** `UsageLimits`

**レスポンス構造:**

```python
{
    "success": bool,
    "rateLimit": {
        "sync": {
            "isLimited": bool,
            "limit": int,
            "remaining": int,
            "resetAt": str
        },
        "async": {
            "isLimited": bool,
            "limit": int,
            "remaining": int,
            "resetAt": str
        },
        "authType": str  # 'api' or 'manual'
    },
    "usage": {
        "currentPeriodCost": float,
        "limit": float,
        "plan": str  # e.g., 'free', 'pro'
    }
}
```

##### set_api_key()

APIキーを更新します。

```python
client.set_api_key("new-api-key")
```

##### set_base_url()

ベースURLを更新します。

```python
client.set_base_url("https://my-custom-domain.com")
```

##### close()

基盤となるHTTPセッションを閉じます。

```python
client.close()
```

## データクラス

### WorkflowExecutionResult

```python
@dataclass
class WorkflowExecutionResult:
    success: bool
    output: Optional[Any] = None
    error: Optional[str] = None
    logs: Optional[List[Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    trace_spans: Optional[List[Any]] = None
    total_duration: Optional[float] = None
```

### AsyncExecutionResult

```python
@dataclass
class AsyncExecutionResult:
    success: bool
    task_id: str
    status: str  # 'queued'
    created_at: str
    links: Dict[str, str]  # e.g., {"status": "/api/jobs/{taskId}"}
```

### WorkflowStatus

```python
@dataclass
class WorkflowStatus:
    is_deployed: bool
    deployed_at: Optional[str] = None
    needs_redeployment: bool = False
```

### RateLimitInfo

```python
@dataclass
class RateLimitInfo:
    limit: int
    remaining: int
    reset: int
    retry_after: Optional[int] = None
```

### UsageLimits

```python
@dataclass
class UsageLimits:
    success: bool
    rate_limit: Dict[str, Any]
    usage: Dict[str, Any]
```

### SimStudioError

```python
class SimStudioError(Exception):
    def __init__(self, message: str, code: Optional[str] = None, status: Optional[int] = None):
        super().__init__(message)
        self.code = code
        self.status = status
```

**一般的なエラーコード:**
- `UNAUTHORIZED`: 無効なAPIキー
- `TIMEOUT`: リクエストがタイムアウトしました
- `RATE_LIMIT_EXCEEDED`: レート制限を超えました
- `USAGE_LIMIT_EXCEEDED`: 使用制限を超えました
- `EXECUTION_ERROR`: ワークフローの実行に失敗しました

## 例

### 基本的なワークフロー実行

<Steps>
  <Step title="クライアントの初期化">
    APIキーを使用してSimStudioClientをセットアップします。
  </Step>
  <Step title="ワークフローの検証">
    ワークフローがデプロイされ、実行準備ができているか確認します。
  </Step>
  <Step title="ワークフローの実行">
    入力データでワークフローを実行します。
  </Step>
  <Step title="結果の処理">
    実行結果を処理し、エラーがあれば対処します。
  </Step>
</Steps>

```python
import os
from simstudio import SimStudioClient

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def run_workflow():
    try:
        # Check if workflow is ready
        is_ready = client.validate_workflow("my-workflow-id")
        if not is_ready:
            raise Exception("Workflow is not deployed or ready")

        # Execute the workflow
        result = client.execute_workflow(
            "my-workflow-id",
            input_data={
                "message": "Process this data",
                "user_id": "12345"
            }
        )

        if result.success:
            print("Output:", result.output)
            print("Duration:", result.metadata.get("duration") if result.metadata else None)
        else:
            print("Workflow failed:", result.error)
            
    except Exception as error:
        print("Error:", error)

run_workflow()
```

### エラー処理

ワークフロー実行中に発生する可能性のある様々なタイプのエラーを処理します：

```python
from simstudio import SimStudioClient, SimStudioError
import os

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_with_error_handling():
    try:
        result = client.execute_workflow("workflow-id")
        return result
    except SimStudioError as error:
        if error.code == "UNAUTHORIZED":
            print("Invalid API key")
        elif error.code == "TIMEOUT":
            print("Workflow execution timed out")
        elif error.code == "USAGE_LIMIT_EXCEEDED":
            print("Usage limit exceeded")
        elif error.code == "INVALID_JSON":
            print("Invalid JSON in request body")
        else:
            print(f"Workflow error: {error}")
        raise
    except Exception as error:
        print(f"Unexpected error: {error}")
        raise
```

### コンテキストマネージャーの使用

リソースのクリーンアップを自動的に処理するためにクライアントをコンテキストマネージャーとして使用します：

```python
from simstudio import SimStudioClient
import os

# Using context manager to automatically close the session
with SimStudioClient(api_key=os.getenv("SIM_API_KEY")) as client:
    result = client.execute_workflow("workflow-id")
    print("Result:", result)
# Session is automatically closed here
```

### バッチワークフロー実行

複数のワークフローを効率的に実行します：

```python
from simstudio import SimStudioClient
import os

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_workflows_batch(workflow_data_pairs):
    """Execute multiple workflows with different input data."""
    results = []
    
    for workflow_id, input_data in workflow_data_pairs:
        try:
            # Validate workflow before execution
            if not client.validate_workflow(workflow_id):
                print(f"Skipping {workflow_id}: not deployed")
                continue
                
            result = client.execute_workflow(workflow_id, input_data)
            results.append({
                "workflow_id": workflow_id,
                "success": result.success,
                "output": result.output,
                "error": result.error
            })
            
        except Exception as error:
            results.append({
                "workflow_id": workflow_id,
                "success": False,
                "error": str(error)
            })
    
    return results

# Example usage
workflows = [
    ("workflow-1", {"type": "analysis", "data": "sample1"}),
    ("workflow-2", {"type": "processing", "data": "sample2"}),
]

results = execute_workflows_batch(workflows)
for result in results:
    print(f"Workflow {result['workflow_id']}: {'Success' if result['success'] else 'Failed'}")
```

### 非同期ワークフロー実行

長時間実行されるタスクのためにワークフローを非同期で実行します：

```python
import os
import time
from simstudio import SimStudioClient

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_async():
    try:
        # Start async execution
        result = client.execute_workflow(
            "workflow-id",
            input_data={"data": "large dataset"},
            async_execution=True  # Execute asynchronously
        )

        # Check if result is an async execution
        if hasattr(result, 'task_id'):
            print(f"Task ID: {result.task_id}")
            print(f"Status endpoint: {result.links['status']}")

            # Poll for completion
            status = client.get_job_status(result.task_id)

            while status["status"] in ["queued", "processing"]:
                print(f"Current status: {status['status']}")
                time.sleep(2)  # Wait 2 seconds
                status = client.get_job_status(result.task_id)

            if status["status"] == "completed":
                print("Workflow completed!")
                print(f"Output: {status['output']}")
                print(f"Duration: {status['metadata']['duration']}")
            else:
                print(f"Workflow failed: {status['error']}")

    except Exception as error:
        print(f"Error: {error}")

execute_async()
```

### レート制限とリトライ

指数バックオフを使用して自動的にレート制限を処理します：

```python
import os
from simstudio import SimStudioClient, SimStudioError

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_with_retry_handling():
    try:
        # Automatically retries on rate limit
        result = client.execute_with_retry(
            "workflow-id",
            input_data={"message": "Process this"},
            max_retries=5,
            initial_delay=1.0,
            max_delay=60.0,
            backoff_multiplier=2.0
        )

        print(f"Success: {result}")
    except SimStudioError as error:
        if error.code == "RATE_LIMIT_EXCEEDED":
            print("Rate limit exceeded after all retries")

            # Check rate limit info
            rate_limit_info = client.get_rate_limit_info()
            if rate_limit_info:
                from datetime import datetime
                reset_time = datetime.fromtimestamp(rate_limit_info.reset)
                print(f"Rate limit resets at: {reset_time}")

execute_with_retry_handling()
```

### 使用状況モニタリング

アカウントの使用状況と制限をモニタリングします：

```python
import os
from simstudio import SimStudioClient

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def check_usage():
    try:
        limits = client.get_usage_limits()

        print("=== Rate Limits ===")
        print("Sync requests:")
        print(f"  Limit: {limits.rate_limit['sync']['limit']}")
        print(f"  Remaining: {limits.rate_limit['sync']['remaining']}")
        print(f"  Resets at: {limits.rate_limit['sync']['resetAt']}")
        print(f"  Is limited: {limits.rate_limit['sync']['isLimited']}")

        print("\nAsync requests:")
        print(f"  Limit: {limits.rate_limit['async']['limit']}")
        print(f"  Remaining: {limits.rate_limit['async']['remaining']}")
        print(f"  Resets at: {limits.rate_limit['async']['resetAt']}")
        print(f"  Is limited: {limits.rate_limit['async']['isLimited']}")

        print("\n=== Usage ===")
        print(f"Current period cost: ${limits.usage['currentPeriodCost']:.2f}")
        print(f"Limit: ${limits.usage['limit']:.2f}")
        print(f"Plan: {limits.usage['plan']}")

        percent_used = (limits.usage['currentPeriodCost'] / limits.usage['limit']) * 100
        print(f"Usage: {percent_used:.1f}%")

        if percent_used > 80:
            print("⚠️  Warning: You are approaching your usage limit!")

    except Exception as error:
        print(f"Error checking usage: {error}")

check_usage()
```

### ワークフローの実行ストリーミング

リアルタイムのストリーミングレスポンスでワークフローを実行します：

```python
from simstudio import SimStudioClient
import os

client = SimStudioClient(api_key=os.getenv("SIM_API_KEY"))

def execute_with_streaming():
    """Execute workflow with streaming enabled."""
    try:
        # Enable streaming for specific block outputs
        result = client.execute_workflow(
            "workflow-id",
            input_data={"message": "Count to five"},
            stream=True,
            selected_outputs=["agent1.content"]  # Use blockName.attribute format
        )

        print("Workflow result:", result)
    except Exception as error:
        print("Error:", error)

execute_with_streaming()
```

ストリーミングレスポンスはServer-Sent Events（SSE）形式に従います：

```
data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":"One"}

data: {"blockId":"7b7735b9-19e5-4bd6-818b-46aae2596e9f","chunk":", two"}

data: {"event":"done","success":true,"output":{},"metadata":{"duration":610}}

data: [DONE]
```

**Flaskストリーミングの例：**

```python
from flask import Flask, Response, stream_with_context
import requests
import json
import os

app = Flask(__name__)

@app.route('/stream-workflow')
def stream_workflow():
    """Stream workflow execution to the client."""

    def generate():
        response = requests.post(
            'https://sim.ai/api/workflows/WORKFLOW_ID/execute',
            headers={
                'Content-Type': 'application/json',
                'X-API-Key': os.getenv('SIM_API_KEY')   
            },
            json={
                'message': 'Generate a story',
                'stream': True,
                'selectedOutputs': ['agent1.content']
            },
            stream=True
        )

        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                if decoded_line.startswith('data: '):
                    data = decoded_line[6:]  # Remove 'data: ' prefix

                    if data == '[DONE]':
                        break

                    try:
                        parsed = json.loads(data)
                        if 'chunk' in parsed:
                            yield f"data: {json.dumps(parsed)}\n\n"
                        elif parsed.get('event') == 'done':
                            yield f"data: {json.dumps(parsed)}\n\n"
                            print("Execution complete:", parsed.get('metadata'))
                    except json.JSONDecodeError:
                        pass

    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream'
    )

if __name__ == '__main__':
    app.run(debug=True)
```

### 環境設定

環境変数を使用してクライアントを設定します：

<Tabs items={['Development', 'Production']}>
  <Tab value="Development">

    ```python
    import os
    from simstudio import SimStudioClient

    # Development configuration
    client = SimStudioClient(
        api_key=os.getenv("SIM_API_KEY")
        base_url=os.getenv("SIM_BASE_URL", "https://sim.ai")
    )
    ```

  </Tab>
  <Tab value="Production">

    ```python
    import os
    from simstudio import SimStudioClient

    # Production configuration with error handling
    api_key = os.getenv("SIM_API_KEY")
    if not api_key:
        raise ValueError("SIM_API_KEY environment variable is required")

    client = SimStudioClient(
        api_key=api_key,
        base_url=os.getenv("SIM_BASE_URL", "https://sim.ai")
    )
    ```

  </Tab>
</Tabs>

## APIキーの取得方法

<Steps>
  <Step title="Simにログイン">
    [Sim](https://sim.ai)に移動してアカウントにログインします。
  </Step>
  <Step title="ワークフローを開く">
    プログラムで実行したいワークフローに移動します。
  </Step>
  <Step title="ワークフローをデプロイする">
    まだデプロイされていない場合は、「デプロイ」をクリックしてワークフローをデプロイします。
  </Step>
  <Step title="APIキーを作成または選択する">
    デプロイプロセス中に、APIキーを選択または作成します。
  </Step>
  <Step title="APIキーをコピーする">
    Pythonアプリケーションで使用するAPIキーをコピーします。
  </Step>
</Steps>

## 要件

- Python 3.8+
- requests >= 2.25.0

## ライセンス

Apache-2.0
```

--------------------------------------------------------------------------------

````
