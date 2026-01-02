---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 216
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 216 of 933)

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

---[FILE: stt.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/stt.mdx

```text
---
title: 音声テキスト変換
description: AIを使用して音声をテキストに変換
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="stt"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
世界クラスのプロバイダーによる最新のAIモデルを使用して音声をテキストに変換します。SimのSpeech-to-Text（STT）ツールは、音声や動画を正確でタイムスタンプ付き、オプションで翻訳されたトランスクリプトに変換する機能を提供します。多様な言語をサポートし、話者分離や話者識別などの高度な機能で強化されています。

**サポートされているプロバイダーとモデル：**

- **[OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text/overview)** (OpenAI):  
  OpenAIのWhisperは、言語や音声条件全体で堅牢性で知られるオープンソースの深層学習モデルです。`whisper-1`などの高度なモデルをサポートし、文字起こし、翻訳、高いモデル汎用性を要求するタスクで優れています。ChatGPTや先進的なAI研究で知られる企業OpenAIによって支えられており、Whisperは研究や比較評価のベースラインとして広く使用されています。

- **[Deepgram](https://deepgram.com/)** (Deepgram Inc.):  
  サンフランシスコを拠点とするDeepgramは、開発者や企業向けにスケーラブルな本番環境グレードの音声認識APIを提供しています。Deepgramのモデルには`nova-3`、`nova-2`、`whisper-large`が含まれ、業界をリードする精度、多言語サポート、自動句読点、インテリジェントな話者分離、通話分析、電話から媒体制作まで幅広いユースケース向けの機能を備えたリアルタイムおよびバッチ文字起こしを提供しています。

- **[ElevenLabs](https://elevenlabs.io/)** (ElevenLabs):  
  音声AIのリーダーであるElevenLabsは、特にプレミアム音声合成と認識で知られています。そのSTT製品は、多数の言語、方言、アクセントの高精度で自然な理解を提供します。最近のElevenLabs STTモデルは、明瞭さ、話者の区別に最適化されており、創造的なシナリオとアクセシビリティの両方に適しています。ElevenLabsはAI駆動の音声技術における最先端の進歩で認められています。

- **[AssemblyAI](https://www.assemblyai.com/)** (AssemblyAI Inc.):  
  AssemblyAIは、API駆動の高精度音声認識を提供し、文字起こしに加えて自動チャプタリング、トピック検出、要約、感情分析、コンテンツモデレーションなどの機能を備えています。著名な`Conformer-2`を含む独自のモデルは、業界最大のメディア、コールセンター、コンプライアンスアプリケーションの一部を支えています。AssemblyAIは世界中のフォーチュン500企業や主要AIスタートアップから信頼されています。

- **[Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)** (Google Cloud):  
  Googleのエンタープライズグレードのスピーチ・トゥ・テキストAPIは、125以上の言語とバリアントをサポートし、高精度と、リアルタイムストリーミング、単語レベルの信頼度、話者ダイアライゼーション、自動句読点、カスタム語彙、ドメイン固有のチューニングなどの機能を提供しています。`latest_long`、`video`、およびドメイン最適化モデルなどが利用可能で、Googleの長年の研究に支えられ、グローバルな拡張性のために展開されています。

- **[AWS Transcribe](https://aws.amazon.com/transcribe/)** (Amazon Web Services):  
  AWS TranscribeはAmazonのクラウドインフラストラクチャを活用して、堅牢な音声認識をAPIとして提供します。複数の言語をサポートし、話者識別、カスタム語彙、チャネル識別（コールセンターオーディオ用）、医療特化型文字起こしなどの機能を備えています。人気のモデルには`standard`やドメイン固有のバリエーションがあります。AWS TranscribeはすでにAmazonのクラウドを使用している組織に最適です。

**選び方：**  
あなたのアプリケーションに合ったプロバイダーとモデルを選択しましょう—高速でエンタープライズ対応の文字起こしと追加分析機能が必要な場合（Deepgram、AssemblyAI、Google、AWS）、高い汎用性とオープンソースアクセスが必要な場合（OpenAI Whisper）、または高度な話者/コンテキスト理解が必要な場合（ElevenLabs）。価格、言語カバレッジ、精度、および必要な特別機能（要約、チャプタリング、感情分析など）を考慮してください。

機能、価格、特徴のハイライト、および微調整オプションの詳細については、上記のリンクから各プロバイダーの公式ドキュメントを参照してください。
{/* MANUAL-CONTENT-END */}

## 使用方法

主要なAIプロバイダーを使用して、音声およびビデオファイルをテキストに文字起こしします。複数の言語、タイムスタンプ、および話者ダイアライゼーションをサポートしています。

## ツール

### `stt_whisper`

OpenAI Whisperを使用して音声をテキストに文字起こし

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | はい | STTプロバイダー（whisper） |
| `apiKey` | string | はい | OpenAI APIキー |
| `model` | string | いいえ | 使用するWhisperモデル（デフォルト：whisper-1） |
| `audioFile` | file | いいえ | 文字起こしする音声またはビデオファイル |
| `audioFileReference` | file | いいえ | 前のブロックからの音声/ビデオファイルの参照 |
| `audioUrl` | string | いいえ | 音声またはビデオファイルのURL |
| `language` | string | いいえ | 言語コード（例："en"、"es"、"fr"）または自動検出の場合は"auto" |
| `timestamps` | string | いいえ | タイムスタンプの粒度：none、sentence、またはword |
| `translateToEnglish` | boolean | いいえ | 音声を英語に翻訳 |
| `prompt` | string | いいえ | モデルのスタイルを導いたり、前の音声セグメントを継続したりするためのオプションテキスト。固有名詞やコンテキストの理解に役立ちます。 |
| `temperature` | number | いいえ | 0から1の間のサンプリング温度。値が高いほど出力はよりランダムに、値が低いほどより集中的で決定論的になります。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `transcript` | string | 文字起こしされた全テキスト |
| `segments` | array | タイムスタンプ付きセグメント |
| `language` | string | 検出または指定された言語 |
| `duration` | number | 音声の長さ（秒） |

### `stt_deepgram`

Deepgramを使用して音声をテキストに文字起こし

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | はい | STTプロバイダー（deepgram） |
| `apiKey` | string | はい | Deepgram APIキー |
| `model` | string | いいえ | 使用するDeepgramモデル（nova-3、nova-2、whisper-largeなど） |
| `audioFile` | file | いいえ | 文字起こしする音声またはビデオファイル |
| `audioFileReference` | file | いいえ | 前のブロックからの音声/ビデオファイルの参照 |
| `audioUrl` | string | いいえ | 音声またはビデオファイルのURL |
| `language` | string | いいえ | 言語コード（例："en"、"es"、"fr"）または自動検出の場合は"auto" |
| `timestamps` | string | いいえ | タイムスタンプの粒度：none、sentence、またはword |
| `diarization` | boolean | いいえ | 話者分離を有効にする |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `transcript` | string | 文字起こしされた全テキスト |
| `segments` | array | 話者ラベル付きのタイムスタンプセグメント |
| `language` | string | 検出または指定された言語 |
| `duration` | number | 音声の長さ（秒） |
| `confidence` | number | 全体的な信頼度スコア |

### `stt_elevenlabs`

ElevenLabsを使用して音声をテキストに文字起こし

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | はい | STTプロバイダー（elevenlabs） |
| `apiKey` | string | はい | ElevenLabs APIキー |
| `model` | string | いいえ | 使用するElevenLabsモデル（scribe_v1, scribe_v1_experimental） |
| `audioFile` | file | いいえ | 文字起こしする音声またはビデオファイル |
| `audioFileReference` | file | いいえ | 前のブロックからの音声/ビデオファイルの参照 |
| `audioUrl` | string | いいえ | 音声またはビデオファイルのURL |
| `language` | string | いいえ | 言語コード（例："en"、"es"、"fr"）または自動検出の場合は"auto" |
| `timestamps` | string | いいえ | タイムスタンプの粒度：none、sentence、またはword |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `transcript` | string | 完全な文字起こしテキスト |
| `segments` | array | タイムスタンプ付きセグメント |
| `language` | string | 検出または指定された言語 |
| `duration` | number | 音声の長さ（秒） |
| `confidence` | number | 全体的な信頼度スコア |

### `stt_assemblyai`

高度なNLP機能を備えたAssemblyAIを使用して音声をテキストに文字起こし

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | はい | STTプロバイダー（assemblyai） |
| `apiKey` | string | はい | AssemblyAI APIキー |
| `model` | string | いいえ | 使用するAssemblyAIモデル（デフォルト：best） |
| `audioFile` | file | いいえ | 文字起こしする音声またはビデオファイル |
| `audioFileReference` | file | いいえ | 前のブロックからの音声/ビデオファイルの参照 |
| `audioUrl` | string | いいえ | 音声またはビデオファイルのURL |
| `language` | string | いいえ | 言語コード（例："en"、"es"、"fr"）または自動検出の場合は"auto" |
| `timestamps` | string | いいえ | タイムスタンプの粒度：none、sentence、またはword |
| `diarization` | boolean | いいえ | 話者分離を有効にする |
| `sentiment` | boolean | いいえ | 感情分析を有効にする |
| `entityDetection` | boolean | いいえ | エンティティ検出を有効にする |
| `piiRedaction` | boolean | いいえ | PII編集を有効にする |
| `summarization` | boolean | いいえ | 自動要約を有効にする |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `transcript` | string | 完全な文字起こしテキスト |
| `segments` | array | 話者ラベル付きのタイムスタンプセグメント |
| `language` | string | 検出または指定された言語 |
| `duration` | number | 音声の長さ（秒） |
| `confidence` | number | 全体的な信頼度スコア |
| `sentiment` | array | 感情分析結果 |
| `entities` | array | 検出されたエンティティ |
| `summary` | string | 自動生成された要約 |

### `stt_gemini`

マルチモーダル機能を持つGoogle Geminiを使用して音声をテキストに変換する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | はい | STTプロバイダー（gemini） |
| `apiKey` | string | はい | Google APIキー |
| `model` | string | いいえ | 使用するGeminiモデル（デフォルト：gemini-2.5-flash） |
| `audioFile` | file | いいえ | 文字起こしする音声またはビデオファイル |
| `audioFileReference` | file | いいえ | 前のブロックからの音声/ビデオファイルの参照 |
| `audioUrl` | string | いいえ | 音声またはビデオファイルのURL |
| `language` | string | いいえ | 言語コード（例："en"、"es"、"fr"）または自動検出の場合は"auto" |
| `timestamps` | string | いいえ | タイムスタンプの粒度：none、sentence、またはword |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `transcript` | string | 完全な文字起こしテキスト |
| `segments` | array | タイムスタンプ付きセグメント |
| `language` | string | 検出または指定された言語 |
| `duration` | number | 音声の長さ（秒） |
| `confidence` | number | 全体的な信頼度スコア |

## 注意事項

- カテゴリー: `tools`
- タイプ: `stt`
```

--------------------------------------------------------------------------------

---[FILE: supabase.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/supabase.mdx

```text
---
title: Supabase
description: Supabaseデータベースを使用する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="supabase"
  color="#1C1C1C"
/>

{/* MANUAL-CONTENT-START:intro */}
[Supabase](https://www.supabase.com/)は、開発者がモダンなアプリケーションを構築、スケーリング、管理するためのツール群を提供する強力なオープンソースのバックエンド・アズ・ア・サービスプラットフォームです。Supabaseは、フルマネージドの[PostgreSQL](https://www.postgresql.org/)データベース、堅牢な認証機能、即時利用可能なRESTfulおよびGraphQL API、リアルタイムサブスクリプション、ファイルストレージ、エッジ関数を提供し、これらすべてを統一された開発者フレンドリーなインターフェースを通じてアクセスできます。そのオープンソースの性質と人気のあるフレームワークとの互換性により、SQLの柔軟性と透明性という追加の利点を持ちながら、Firebaseの魅力的な代替手段となっています。

**なぜSupabaseなのか？**
- **即時API：** データベース内のすべてのテーブルとビューは、RESTおよびGraphQLエンドポイントを通じて即座に利用可能になり、カスタムバックエンドコードを書かずにデータ駆動型アプリケーションを簡単に構築できます。
- **リアルタイムデータ：** Supabaseはリアルタイムサブスクリプションを可能にし、アプリがデータベースの変更に即座に反応できるようにします。
- **認証と認可：** メール、OAuth、SSOなどをサポートする組み込みのユーザー管理機能に加え、きめ細かいアクセス制御のための行レベルセキュリティを提供します。
- **ストレージ：** データベースとシームレスに統合された組み込みストレージで、ファイルを安全にアップロード、提供、管理できます。
- **エッジ関数：** 低レイテンシーのカスタムロジックのために、ユーザーの近くにサーバーレス関数をデプロイできます。

**Simでのスパベースの使用**

SimのSupabase統合により、エージェントワークフローをSupabaseプロジェクトに簡単に接続できます。プロジェクトID、テーブル名、サービスロールシークレットという数項目の設定だけで、Simブロックから直接データベースに安全にアクセスできます。この統合によりAPIコールの複雑さが抽象化され、ロジックと自動化の構築に集中できます。

**SimでSupabaseを使用する主なメリット:**
- **ノーコード/ローコードのデータベース操作:** SQLやバックエンドコードを書かずに、Supabaseテーブルの照会、挿入、更新、削除が可能。
- **柔軟なクエリ:** [PostgREST フィルター構文](https://postgrest.org/en/stable/api.html#operators)を使用して、フィルタリング、並べ替え、結果の制限などの高度なクエリを実行できます。
- **シームレスな統合:** Supabaseをワークフロー内の他のツールやサービスに簡単に接続し、データの同期、通知のトリガー、レコードの強化などの強力な自動化を実現。
- **安全でスケーラブル:** すべての操作はSupabaseサービスロールシークレットを使用し、マネージドクラウドプラットフォームのスケーラビリティを備えたデータへの安全なアクセスを確保します。

内部ツールの構築、ビジネスプロセスの自動化、本番アプリケーションの実行など、どのような用途でも、SimのSupabaseは、データとバックエンドロジックを管理するための高速で信頼性が高く、開発者に優しい方法を提供します—インフラ管理は必要ありません。ブロックを設定し、必要な操作を選択するだけで、Simが残りを処理します。
{/* MANUAL-CONTENT-END */}

## 使用方法

ワークフローにSupabaseを統合します。データベース操作（クエリ、挿入、更新、削除、アップサート）、全文検索、RPC関数、行数カウント、ベクトル検索、および完全なストレージ管理（ファイルとバケットのアップロード、ダウンロード、一覧表示、移動、コピー、削除）をサポートします。

## ツール

### `supabase_query`

Supabaseテーブルからデータを照会する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `table` | string | はい | 照会するSupabaseテーブルの名前 |
| `filter` | string | いいえ | PostgRESTフィルター（例："id=eq.123"） |
| `orderBy` | string | いいえ | 並べ替える列（降順の場合はDESCを追加） |
| `limit` | number | いいえ | 返す最大行数 |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | array | クエリから返されたレコードの配列 |

### `supabase_insert`

Supabaseテーブルにデータを挿入する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `table` | string | はい | データを挿入するSupabaseテーブルの名前 |
| `data` | array | はい | 挿入するデータ（オブジェクトの配列または単一のオブジェクト） |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | array | 挿入されたレコードの配列 |

### `supabase_get_row`

フィルター条件に基づいてSupabaseテーブルから単一の行を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | SupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `table` | string | はい | クエリを実行するSupabaseテーブルの名前 |
| `filter` | string | はい | 特定の行を見つけるためのPostgRESTフィルター（例："id=eq.123"） |
| `apiKey` | string | はい | Supabaseサービスロールのシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | array | 行データを含む配列（見つかった場合）、空の配列（見つからなかった場合） |

### `supabase_update`

フィルター条件に基づいてSupabaseテーブルの行を更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `table` | string | はい | 更新するSupabaseテーブルの名前 |
| `filter` | string | はい | 更新する行を識別するPostgRESTフィルター（例："id=eq.123"） |
| `data` | object | はい | 一致する行で更新するデータ |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | array | 更新されたレコードの配列 |

### `supabase_delete`

フィルター条件に基づいてSupabaseテーブルから行を削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `table` | string | はい | 削除するSupabaseテーブルの名前 |
| `filter` | string | はい | 削除する行を識別するPostgRESTフィルター（例："id=eq.123"） |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | array | 削除されたレコードの配列 |

### `supabase_upsert`

Supabaseテーブルにデータを挿入または更新する（アップサート操作）

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `table` | string | はい | データをアップサートするSupabaseテーブルの名前 |
| `data` | array | はい | アップサート（挿入または更新）するデータ - オブジェクトの配列または単一のオブジェクト |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | array | アップサートされたレコードの配列 |

### `supabase_count`

Supabaseテーブルの行数をカウントする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `table` | string | はい | 行数をカウントするSupabaseテーブルの名前 |
| `filter` | string | いいえ | PostgRESTフィルター（例："status=eq.active"） |
| `countType` | string | いいえ | カウントタイプ：exact、planned、またはestimated（デフォルト：exact） |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `count` | number | フィルターに一致する行数 |

### `supabase_text_search`

Supabaseテーブルで全文検索を実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `table` | string | はい | 検索するSupabaseテーブルの名前 |
| `column` | string | はい | 検索する列 |
| `query` | string | はい | 検索クエリ |
| `searchType` | string | いいえ | 検索タイプ：plain、phrase、またはwebsearch（デフォルト：websearch） |
| `language` | string | いいえ | テキスト検索設定の言語（デフォルト：english） |
| `limit` | number | いいえ | 返す最大行数 |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | array | 検索クエリに一致するレコードの配列 |

### `supabase_vector_search`

Supabaseテーブルでpgvectorを使用して類似性検索を実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `functionName` | string | はい | ベクトル検索を実行するPostgreSQL関数の名前（例：match_documents） |
| `queryEmbedding` | array | はい | 類似アイテムを検索するためのクエリベクトル/埋め込み |
| `matchThreshold` | number | いいえ | 最小類似度しきい値（0-1）、通常は0.7-0.9 |
| `matchCount` | number | いいえ | 返す結果の最大数（デフォルト：10） |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | array | ベクトル検索からの類似度スコア付きレコードの配列。各レコードには、クエリベクトルとの類似度を示す類似度フィールド（0-1）が含まれます。 |

### `supabase_rpc`

SupabaseでPostgreSQL関数を呼び出す

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `functionName` | string | はい | 呼び出すPostgreSQL関数の名前 |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | json | 関数から返された結果 |

### `supabase_storage_upload`

Supabaseストレージバケットにファイルをアップロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `bucket` | string | はい | ストレージバケットの名前 |
| `path` | string | はい | ファイルが保存されるパス（例："folder/file.jpg"） |
| `fileContent` | string | はい | ファイルの内容（バイナリファイルの場合はbase64エンコード、またはプレーンテキスト） |
| `contentType` | string | いいえ | ファイルのMIMEタイプ（例："image/jpeg"、"text/plain"） |
| `upsert` | boolean | いいえ | trueの場合、既存のファイルを上書きする（デフォルト：false） |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | object | ファイルパスとメタデータを含むアップロード結果 |

### `supabase_storage_download`

Supabaseストレージバケットからファイルをダウンロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `bucket` | string | はい | ストレージバケットの名前 |
| `path` | string | はい | ダウンロードするファイルへのパス（例："folder/file.jpg"） |
| `fileName` | string | いいえ | オプションのファイル名上書き |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `file` | file | 実行ファイルに保存されたダウンロードファイル |

### `supabase_storage_list`

Supabaseストレージバケット内のファイルを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `bucket` | string | はい | ストレージバケットの名前 |
| `path` | string | いいえ | ファイルを一覧表示するフォルダパス（デフォルト：ルート） |
| `limit` | number | いいえ | 返すファイルの最大数（デフォルト：100） |
| `offset` | number | いいえ | スキップするファイル数（ページネーション用） |
| `sortBy` | string | いいえ | 並べ替える列：name、created_at、updated_at（デフォルト：name） |
| `sortOrder` | string | いいえ | 並べ替え順序：asc（昇順）またはdesc（降順）（デフォルト：asc） |
| `search` | string | いいえ | ファイル名でフィルタリングする検索語 |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | array | メタデータを含むファイルオブジェクトの配列 |

### `supabase_storage_delete`

Supabaseストレージバケットからファイルを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `bucket` | string | はい | ストレージバケットの名前 |
| `paths` | array | はい | 削除するファイルパスの配列（例：["folder/file1.jpg", "folder/file2.jpg"]） |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | array | 削除されたファイルオブジェクトの配列 |

### `supabase_storage_move`

Supabaseストレージバケット内でファイルを移動する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `bucket` | string | はい | ストレージバケットの名前 |
| `fromPath` | string | はい | ファイルの現在のパス（例："folder/old.jpg"） |
| `toPath` | string | はい | ファイルの新しいパス（例："newfolder/new.jpg"） |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | object | 移動操作の結果 |

### `supabase_storage_copy`

Supabaseストレージバケット内のファイルをコピーする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `bucket` | string | はい | ストレージバケットの名前 |
| `fromPath` | string | はい | ソースファイルのパス（例："folder/source.jpg"） |
| `toPath` | string | はい | コピー先ファイルのパス（例："folder/copy.jpg"） |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | object | コピー操作の結果 |

### `supabase_storage_create_bucket`

Supabaseに新しいストレージバケットを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `bucket` | string | はい | 作成するバケットの名前 |
| `isPublic` | boolean | いいえ | バケットを公開アクセス可能にするかどうか（デフォルト：false） |
| `fileSizeLimit` | number | いいえ | 最大ファイルサイズ（バイト単位）（オプション） |
| `allowedMimeTypes` | array | いいえ | 許可されるMIMEタイプの配列（例：["image/png", "image/jpeg"]） |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | object | 作成されたバケット情報 |

### `supabase_storage_list_buckets`

Supabaseのすべてのストレージバケットを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | array | バケットオブジェクトの配列 |

### `supabase_storage_delete_bucket`

Supabaseのストレージバケットを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `bucket` | string | はい | 削除するバケットの名前 |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `results` | object | 削除操作の結果 |

### `supabase_storage_get_public_url`

Supabaseストレージバケット内のファイルの公開URLを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `bucket` | string | はい | ストレージバケットの名前 |
| `path` | string | はい | ファイルへのパス（例："folder/file.jpg"） |
| `download` | boolean | いいえ | trueの場合、インライン表示ではなくダウンロードを強制する（デフォルト：false） |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `publicUrl` | string | ファイルにアクセスするための公開URL |

### `supabase_storage_create_signed_url`

Supabaseストレージバケット内のファイルの一時署名付きURLを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | はい | あなたのSupabaseプロジェクトID（例：jdrkgepadsdopsntdlom） |
| `bucket` | string | はい | ストレージバケットの名前 |
| `path` | string | はい | ファイルへのパス（例："folder/file.jpg"） |
| `expiresIn` | number | はい | URLの有効期限までの秒数（例：1時間の場合は3600） |
| `download` | boolean | いいえ | trueの場合、インライン表示ではなくダウンロードを強制（デフォルト：false） |
| `apiKey` | string | はい | あなたのSupabaseサービスロールシークレットキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 操作ステータスメッセージ |
| `signedUrl` | string | ファイルにアクセスするための一時署名付きURL |

## 注意事項

- カテゴリ: `tools`
- タイプ: `supabase`
```

--------------------------------------------------------------------------------

---[FILE: tavily.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/tavily.mdx

```text
---
title: Tavily
description: 情報の検索と抽出
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="tavily"
  color="#0066FF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Tavily](https://www.tavily.com/)はLLMアプリケーション向けに特別に設計されたAI搭載検索APIです。セマンティック検索、コンテンツ抽出、構造化データ取得などのAIユースケース向けに最適化された機能を備え、信頼性の高いリアルタイム情報検索機能を提供します。

Tavilyでは以下のことが可能です：

- **文脈に基づいた検索の実行**：単なるキーワードマッチングではなく、意味的理解に基づいた関連性の高い結果を取得
- **構造化コンテンツの抽出**：ウェブページから特定の情報をクリーンで使いやすい形式で抽出
- **リアルタイム情報へのアクセス**：ウェブ全体から最新のデータを取得
- **複数のURLの同時処理**：1回のリクエストで複数のウェブページからコンテンツを抽出
- **AI最適化された結果の受信**：AIシステムでの利用に特化した形式の検索結果を取得

Simでは、Tavilyインテグレーションによりエージェントがワークフローの一部としてウェブを検索し情報を抽出することができます。これにより、インターネットからの最新情報を必要とする高度な自動化シナリオが可能になります。エージェントは検索クエリを作成し、関連する結果を取得し、特定のウェブページからコンテンツを抽出して意思決定プロセスに活用できます。このインテグレーションは、ワークフロー自動化とウェブ上の膨大な知識の間のギャップを埋め、エージェントが手動介入なしにリアルタイム情報にアクセスできるようにします。SimとTavilyを接続することで、最新情報を常に把握し、より正確な応答を提供し、ユーザーにより多くの価値を届けるエージェントを作成できます。
{/* MANUAL-CONTENT-END */}

## 使用手順

Tavilyをワークフローに統合します。ウェブを検索し、特定のURLからコンテンツを抽出できます。APIキーが必要です。

## ツール

### `tavily_search`

Tavilyを使用してAI搭載ウェブ検索を実行する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | はい | 実行する検索クエリ |
| `max_results` | number | いいえ | 結果の最大数（1-20） |
| `topic` | string | いいえ | カテゴリタイプ: general、news、またはfinance（デフォルト: general） |
| `search_depth` | string | いいえ | 検索範囲: basic（1クレジット）またはadvanced（2クレジット）（デフォルト: basic） |
| `include_answer` | string | いいえ | LLM生成レスポンス: true/basicで簡潔な回答、advancedで詳細な回答 |
| `include_raw_content` | string | いいえ | 解析されたHTMLコンテンツ: true/markdownまたはテキスト形式 |
| `include_images` | boolean | いいえ | 画像検索結果を含める |
| `include_image_descriptions` | boolean | いいえ | 画像の説明テキストを追加 |
| `include_favicon` | boolean | いいえ | ファビコンURLを含める |
| `chunks_per_source` | number | いいえ | ソースごとの関連チャンクの最大数（1-3、デフォルト: 3） |
| `time_range` | string | いいえ | 最新性でフィルタリング: day/d、week/w、month/m、year/y |
| `start_date` | string | いいえ | 最も古い公開日（YYYY-MM-DD形式） |
| `end_date` | string | いいえ | 最新の公開日（YYYY-MM-DD形式） |
| `include_domains` | string | いいえ | ホワイトリストに登録するドメインのカンマ区切りリスト（最大300） |
| `exclude_domains` | string | いいえ | ブラックリストに登録するドメインのカンマ区切りリスト（最大150） |
| `country` | string | いいえ | 指定した国からの結果を優先（一般トピックのみ） |
| `auto_parameters` | boolean | いいえ | クエリの意図に基づく自動パラメータ設定 |
| `apiKey` | string | はい | Tavily APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `query` | string | 実行された検索クエリ |
| `results` | array | ツールからの結果出力 |

### `tavily_extract`

Tavilyを使用して複数のウェブページから同時に生のコンテンツを抽出する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `urls` | string | はい | コンテンツを抽出するURLまたはURL配列 |
| `extract_depth` | string | いいえ | 抽出の深さ（basic=1クレジット/5 URL、advanced=2クレジット/5 URL） |
| `format` | string | いいえ | 出力形式：markdownまたはtext（デフォルト：markdown） |
| `include_images` | boolean | いいえ | 抽出出力に画像を含める |
| `include_favicon` | boolean | いいえ | 各結果にファビコンURLを追加 |
| `apiKey` | string | はい | Tavily APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `results` | array | 抽出されたURL |

### `tavily_crawl`

Tavilyを使用してウェブサイトから体系的にクロールしてコンテンツを抽出する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `url` | string | はい | クロールを開始するルートURL |
| `instructions` | string | いいえ | クローラーのための自然言語指示（10ページごとに2クレジットかかります） |
| `max_depth` | number | いいえ | ベースURLからどれだけ探索するか（1-5、デフォルト：1） |
| `max_breadth` | number | いいえ | ページレベルごとにフォローするリンク（≥1、デフォルト：20） |
| `limit` | number | いいえ | 停止する前に処理する総リンク数（≥1、デフォルト：50） |
| `select_paths` | string | いいえ | 特定のURLパスを含めるためのカンマ区切りの正規表現パターン（例：/docs/.*） |
| `select_domains` | string | いいえ | 特定のドメインにクロールを制限するためのカンマ区切りの正規表現パターン |
| `exclude_paths` | string | いいえ | 特定のURLパスをスキップするためのカンマ区切りの正規表現パターン |
| `exclude_domains` | string | いいえ | 特定のドメインをブロックするためのカンマ区切りの正規表現パターン |
| `allow_external` | boolean | いいえ | 結果に外部ドメインリンクを含める（デフォルト：true） |
| `include_images` | boolean | いいえ | クロール出力に画像を含める |
| `extract_depth` | string | いいえ | 抽出の深さ：basic（1クレジット/5ページ）またはadvanced（2クレジット/5ページ） |
| `format` | string | いいえ | 出力形式：markdownまたはtext（デフォルト：markdown） |
| `include_favicon` | boolean | いいえ | 各結果にファビコンURLを追加 |
| `apiKey` | string | はい | Tavily APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `base_url` | string | クロールされたベースURL |
| `results` | array | クロールされたページURL |

### `tavily_map`

Tavilyを使用してウェブサイト構造を発見・可視化する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `url` | string | はい | マッピングを開始するルートURL |
| `instructions` | string | いいえ | マッピング動作のための自然言語ガイダンス（10ページごとに2クレジットかかります） |
| `max_depth` | number | いいえ | ベースURLからの探索距離（1-5、デフォルト：1） |
| `max_breadth` | number | いいえ | レベルごとにフォローするリンク数（デフォルト：20） |
| `limit` | number | いいえ | 処理する総リンク数（デフォルト：50） |
| `select_paths` | string | いいえ | URLパスフィルタリング用のカンマ区切り正規表現パターン（例：/docs/.*） |
| `select_domains` | string | いいえ | 特定ドメインへのマッピングを制限するカンマ区切り正規表現パターン |
| `exclude_paths` | string | いいえ | 特定のURLパスを除外するカンマ区切り正規表現パターン |
| `exclude_domains` | string | いいえ | 除外するドメインのカンマ区切り正規表現パターン |
| `allow_external` | boolean | いいえ | 結果に外部ドメインリンクを含める（デフォルト：true） |
| `apiKey` | string | はい | Tavily APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `base_url` | string | マッピングされたベースURL |
| `results` | array | 発見されたURL |

## 注意事項

- カテゴリー: `tools`
- タイプ: `tavily`
```

--------------------------------------------------------------------------------

---[FILE: telegram.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/telegram.mdx

```text
---
title: Telegram
description: Telegramを通じてメッセージを送信したり、Telegramイベントからワークフローをトリガーしたりする
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="telegram"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Telegram](https://telegram.org)は、デバイスやプラットフォーム間で迅速かつ信頼性の高いコミュニケーションを可能にする、安全なクラウドベースのメッセージングプラットフォームです。月間アクティブユーザー数が7億人を超えるTelegramは、セキュリティ、スピード、強力なAPI機能で知られる世界有数のメッセージングサービスとして確立されています。

TelegramのBot APIは、自動化されたメッセージングソリューションを作成し、アプリケーションにコミュニケーション機能を統合するための堅牢なフレームワークを提供します。リッチメディア、インラインキーボード、カスタムコマンドのサポートにより、Telegramボットは高度なインタラクションパターンと自動化されたワークフローを実現できます。

Simでウェブフックトリガーを作成し、Telegramメッセージからシームレスにワークフローを開始する方法を学びましょう。このチュートリアルでは、ウェブフックの設定、TelegramのボットAPIとの連携、リアルタイムでの自動アクションのトリガー方法について説明します。チャットから直接タスクを効率化するのに最適です！

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/9oKcJtQ0_IM"
  title="SimでTelegramを使用する"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

SimのTelegramツールを使用して、任意のTelegramグループへのメッセージ配信をシームレスに自動化する方法を学びましょう。このチュートリアルでは、ツールをワークフローに統合する方法、グループメッセージングの設定方法、リアルタイムでの自動更新のトリガー方法について説明します。ワークスペースから直接コミュニケーションを強化するのに最適です！

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/AG55LpUreGI"
  title="SimでTelegramを使用する"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Telegramの主な機能：

- 安全な通信：メッセージやメディアのためのエンドツーエンドの暗号化と安全なクラウドストレージ
- ボットプラットフォーム：自動メッセージングソリューションやインタラクティブな体験を作成するための強力なボットAPI
- リッチメディアサポート：テキスト書式、画像、ファイル、インタラクティブ要素を含むメッセージの送受信
- グローバルリーチ：複数の言語とプラットフォームをサポートし、世界中のユーザーとつながる

Simでは、Telegramの統合により、エージェントがワークフローの一部としてこれらの強力なメッセージング機能を活用できるようになります。これにより、Telegramの安全なメッセージングプラットフォームを通じて、自動通知、アラート、インタラクティブな会話の機会が生まれます。この統合により、エージェントはプログラムによって個人やチャンネルにメッセージを送信でき、タイムリーなコミュニケーションと更新を可能にします。SimとTelegramを接続することで、安全で広く採用されているメッセージングプラットフォームを通じてユーザーと関わるインテリジェントなエージェントを構築でき、通知、更新、インタラクティブなコミュニケーションの配信に最適です。
{/* MANUAL-CONTENT-END */}

## 使用方法

Telegramをワークフローに統合します。メッセージを送信できます。チャットにメッセージが送信されたときにワークフローをトリガーするトリガーモードでも使用できます。

## ツール

### `telegram_message`

Telegram Bot APIを通じてTelegramチャンネルまたはユーザーにメッセージを送信します。メッセージの追跡とチャット確認機能を備えた直接的なコミュニケーションと通知を可能にします。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | あなたのTelegram Bot APIトークン |
| `chatId` | string | はい | 対象のTelegramチャットID |
| `text` | string | はい | 送信するメッセージテキスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | Telegramメッセージデータ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `telegram`

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | あなたのTelegram Bot APIトークン |
| `chatId` | string | はい | 対象のTelegramチャットID |
| `messageId` | string | はい | 削除するメッセージID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 削除操作の結果 |

### `telegram_send_photo`

Telegram Bot APIを通じてTelegramチャンネルまたはユーザーに写真を送信します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | あなたのTelegram Bot APIトークン |
| `chatId` | string | はい | 対象のTelegramチャットID |
| `photo` | string | はい | 送信する写真。file_idまたはHTTP URLを指定 |
| `caption` | string | いいえ | 写真のキャプション（任意） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 写真（任意）を含むTelegramメッセージデータ |

### `telegram_send_video`

Telegram Bot APIを通じてTelegramチャンネルまたはユーザーに動画を送信します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | あなたのTelegram Bot APIトークン |
| `chatId` | string | はい | 対象のTelegramチャットID |
| `video` | string | はい | 送信する動画。file_idまたはHTTP URLを指定 |
| `caption` | string | いいえ | 動画のキャプション（任意） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | オプションのメディアを含むTelegramメッセージデータ |

### `telegram_send_audio`

Telegram Bot APIを通じてTelegramチャンネルまたはユーザーに音声ファイルを送信します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | あなたのTelegram Bot APIトークン |
| `chatId` | string | はい | 対象のTelegramチャットID |
| `audio` | string | はい | 送信する音声ファイル。file_idまたはHTTP URLを渡してください |
| `caption` | string | いいえ | 音声のキャプション（オプション） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | 音声/オーディオ情報を含むTelegramメッセージデータ |

### `telegram_send_animation`

Telegram Bot APIを通じてTelegramチャンネルまたはユーザーにアニメーション（GIF）を送信します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | あなたのTelegram Bot APIトークン |
| `chatId` | string | はい | 対象のTelegramチャットID |
| `animation` | string | はい | 送信するアニメーション。file_idまたはHTTP URLを渡してください |
| `caption` | string | いいえ | アニメーションのキャプション（オプション） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | オプションのメディアを含むTelegramメッセージデータ |

### `telegram_send_document`

Telegram Bot APIを通じて、Telegramチャンネルやユーザーにドキュメント（PDF、ZIP、DOCなど）を送信します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | はい | あなたのTelegram Bot APIトークン |
| `chatId` | string | はい | 対象のTelegramチャットID |
| `files` | file[] | いいえ | 送信するドキュメントファイル（PDF、ZIP、DOCなど）。最大サイズ：50MB |
| `caption` | string | いいえ | ドキュメントのキャプション（任意） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功またはエラーメッセージ |
| `data` | object | ドキュメントを含むTelegramメッセージデータ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `telegram`
```

--------------------------------------------------------------------------------

---[FILE: thinking.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/thinking.mdx

```text
---
title: 思考
description: モデルに思考プロセスの概要を示すよう促します。
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="thinking"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
思考ツールは、AIモデルが複雑な質問に応答する前に明示的な推論を行うよう促します。段階的な分析のための専用スペースを提供することで、このツールはモデルが問題を分解し、複数の視点を考慮し、より思慮深い結論に到達するのを助けます。

研究によると、言語モデルに「ステップバイステップで考える」よう促すことで、その推論能力を大幅に向上させることができます。[AnthropicのClaudeの思考ツールに関する研究](https://www.anthropic.com/engineering/claude-think-tool)によれば、モデルが明示的に推論を展開するスペースを与えられると、以下のような効果が示されます：

- **問題解決能力の向上**：複雑な問題を管理しやすいステップに分解
- **精度の向上**：問題の各要素を慎重に検討することでエラーを減少
- **透明性の向上**：モデルの推論プロセスを可視化し監査可能に
- **より細やかな応答**：結論に至る前に複数の角度から検討

Simでは、思考ツールによってエージェントがこのような意図的な推論に取り組む構造化された機会が作られます。ワークフローに思考ステップを組み込むことで、エージェントが複雑なタスクをより効果的に処理し、一般的な推論の落とし穴を回避し、より高品質な出力を生み出すのを支援できます。これは特に、複数ステップの推論、複雑な意思決定、または正確さが重要な状況を含むタスクに価値があります。
{/* MANUAL-CONTENT-END */}

## 使用方法

モデルが次に進む前に明示的に思考プロセスを概説するステップを追加します。これにより、段階的な分析を促進し、推論の質を向上させることができます。

## ツール

### `thinking_tool`

提供された思考/指示を処理し、後続のステップで利用できるようにします。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `thought` | string | はい | あなたの内部的な推論、分析、または思考プロセス。これを使用して、応答する前に問題を段階的に考えてください。 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `acknowledgedThought` | string | 処理され認識された思考 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `thinking`
```

--------------------------------------------------------------------------------

---[FILE: translate.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/translate.mdx

```text
---
title: 翻訳
description: テキストをあらゆる言語に翻訳
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="translate"
  color="#FF4B4B"
/>

{/* MANUAL-CONTENT-START:intro */}
翻訳は言語間でテキストを翻訳できるツールです。

翻訳を使用すると、次のことができます：

- **テキスト翻訳**：言語間でテキストを翻訳
- **文書翻訳**：言語間で文書を翻訳
- **ウェブサイト翻訳**：言語間でウェブサイトを翻訳
- **画像翻訳**：言語間で画像を翻訳
- **音声翻訳**：言語間で音声を翻訳
- **動画翻訳**：言語間で動画を翻訳
- **スピーチ翻訳**：言語間でスピーチを翻訳
- **テキスト翻訳**：言語間でテキストを翻訳
{/* MANUAL-CONTENT-END */}

## 使用方法

ワークフローに翻訳を統合します。テキストをあらゆる言語に翻訳できます。

## ツール

### `llm_chat`

サポートされている任意のLLMプロバイダーにチャット完了リクエストを送信する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `model` | string | はい | 使用するモデル（例：gpt-4o、claude-sonnet-4-5、gemini-2.0-flash） |
| `systemPrompt` | string | いいえ | アシスタントの動作を設定するシステムプロンプト |
| `context` | string | はい | モデルに送信するユーザーメッセージまたはコンテキスト |
| `apiKey` | string | いいえ | プロバイダーのAPIキー（ホストされたモデルの場合、提供されない場合はプラットフォームキーを使用） |
| `temperature` | number | いいえ | レスポンス生成の温度（0-2） |
| `maxTokens` | number | いいえ | レスポンスの最大トークン数 |
| `azureEndpoint` | string | いいえ | Azure OpenAIエンドポイントURL |
| `azureApiVersion` | string | いいえ | Azure OpenAI APIバージョン |
| `vertexProject` | string | いいえ | Vertex AI用のGoogle CloudプロジェクトID |
| `vertexLocation` | string | いいえ | Vertex AI用のGoogle Cloudロケーション（デフォルトはus-central1） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 生成されたレスポンスの内容 |
| `model` | string | 生成に使用されたモデル |
| `tokens` | object | トークン使用情報 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `translate`
```

--------------------------------------------------------------------------------

````
