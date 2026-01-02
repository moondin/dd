---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 203
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 203 of 933)

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

---[FILE: huggingface.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/huggingface.mdx

```text
---
title: Hugging Face
description: Use Hugging Face Inference API
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="huggingface"
  color="#0B0F19"
/>

{/* MANUAL-CONTENT-START:intro */}
[HuggingFace](https://huggingface.co/) is a leading AI platform that provides access to thousands of pre-trained machine learning models and powerful inference capabilities. With its extensive model hub and robust API, HuggingFace offers comprehensive tools for both research and production AI applications.
With HuggingFace, you can:

Access pre-trained models: Utilize models for text generation, translation, image processing, and more
Generate AI completions: Create content using state-of-the-art language models through the Inference API
Natural language processing: Process and analyze text with specialized NLP models
Deploy at scale: Host and serve models for production applications
Customize models: Fine-tune existing models for specific use cases

In Sim, the HuggingFace integration enables your agents to programmatically generate completions using the HuggingFace Inference API. This allows for powerful automation scenarios such as content generation, text analysis, code completion, and creative writing. Your agents can generate completions with natural language prompts, access specialized models for different tasks, and integrate AI-generated content into workflows. This integration bridges the gap between your AI workflows and machine learning capabilities, enabling seamless AI-powered automation with one of the world's most comprehensive ML platforms.
{/* MANUAL-CONTENT-END */}

## Usage Instructions

Integrate Hugging Face into the workflow. Can generate completions using the Hugging Face Inference API.

## Tools

### `huggingface_chat`

Generate completions using Hugging Face Inference API

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `systemPrompt` | string | No | System prompt to guide the model behavior |
| `content` | string | Yes | The user message content to send to the model |
| `provider` | string | Yes | The provider to use for the API request \(e.g., novita, cerebras, etc.\) |
| `model` | string | Yes | Model to use for chat completions \(e.g., deepseek/deepseek-v3-0324\) |
| `maxTokens` | number | No | Maximum number of tokens to generate |
| `temperature` | number | No | Sampling temperature \(0-2\). Higher values make output more random |
| `apiKey` | string | Yes | Hugging Face API token |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | Operation success status |
| `output` | object | Chat completion results |

## Notes

- Category: `tools`
- Type: `huggingface`
```

--------------------------------------------------------------------------------

---[FILE: hunter.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/hunter.mdx

```text
---
title: Hunter io
description: プロフェッショナルなメールアドレスを検索・検証
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="hunter"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Hunter.io](https://hunter.io/)は、プロフェッショナルなメールアドレスの検索・検証、企業の発見、連絡先データの充実化を提供する主要プラットフォームです。Hunter.ioは、ドメイン検索、メール検索、検証、企業発見のための堅牢なAPIを提供し、営業、採用、ビジネス開発に不可欠なツールとなっています。

Hunter.ioでできること：

- **ドメインからメールアドレスを検索：** 特定の企業ドメインに関連する公開されているすべてのメールアドレスを検索できます。
- **企業を発見：** 高度なフィルターとAI搭載の検索機能を使用して、条件に合った企業を見つけられます。
- **特定のメールアドレスを検索：** 名前とドメインを使用して、企業における個人の最も可能性の高いメールアドレスを特定できます。
- **メールアドレスを検証：** あらゆるメールアドレスの配信可能性と有効性を確認できます。
- **企業データを充実：** 企業規模、使用技術など、企業に関する詳細情報を取得できます。

Simでは、Hunter.io統合により、エージェントがHunter.ioのAPIを使用してプログラム的にメールアドレスの検索と検証、企業の発見、連絡先データの充実化を行うことができます。これにより、リード生成、連絡先情報の充実化、メール検証をワークフロー内で直接自動化できます。エージェントはHunter.ioのツールを活用して、アウトリーチの効率化、CRMの最新状態の維持、営業、採用などのインテリジェントな自動化シナリオの実現が可能になります。
{/* MANUAL-CONTENT-END */}

## 使用方法

Hunterをワークフローに統合します。ドメインの検索、メールアドレスの検索、メールアドレスの検証、企業の発見、企業の検索、メールアドレスのカウントが可能です。APIキーが必要です。

## ツール

### `hunter_discover`

Hunter.ioのAI搭載検索を使用して、一連の条件に一致する企業を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `query` | string | いいえ | 企業の自然言語検索クエリ |
| `domain` | string | いいえ | フィルタリングする企業ドメイン名 |
| `headcount` | string | いいえ | 企業規模フィルター（例："1-10"、"11-50"） |
| `company_type` | string | いいえ | 組織のタイプ |
| `technology` | string | いいえ | 企業が使用しているテクノロジー |
| `apiKey` | string | はい | Hunter.io APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `results` | array | 検索条件に一致する企業の配列。各企業にはドメイン、名前、従業員数、テクノロジー、メールカウントが含まれます |

### `hunter_domain_search`

指定されたドメイン名を使用して見つかったすべてのメールアドレスを、ソース情報と共に返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | メールアドレスを検索するドメイン名 |
| `limit` | number | いいえ | 返すメールアドレスの最大数（デフォルト：10） |
| `offset` | number | いいえ | スキップするメールアドレスの数 |
| `type` | string | いいえ | 個人用または一般的なメールのフィルター |
| `seniority` | string | いいえ | 役職レベルによるフィルター：junior、senior、またはexecutive |
| `department` | string | いいえ | 特定の部門によるフィルター（例：sales、marketing） |
| `apiKey` | string | はい | Hunter.io APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `domain` | string | 検索されたドメイン名 |
| `disposable` | boolean | ドメインが使い捨てメールアドレスを受け入れるかどうか |
| `webmail` | boolean | ドメインがウェブメールプロバイダーかどうか |
| `accept_all` | boolean | ドメインがすべてのメールアドレスを受け入れるかどうか |
| `pattern` | string | 組織が使用するメールパターン |
| `organization` | string | 組織名 |
| `description` | string | 組織の説明 |
| `industry` | string | 組織の業種 |
| `twitter` | string | 組織のTwitterプロフィール |
| `facebook` | string | 組織のFacebookプロフィール |
| `linkedin` | string | 組織のLinkedInプロフィール |
| `instagram` | string | 組織のInstagramプロフィール |
| `youtube` | string | 組織のYouTubeチャンネル |
| `technologies` | array | 組織が使用するテクノロジーの配列 |
| `country` | string | 組織が所在する国 |
| `state` | string | 組織が所在する州 |
| `city` | string | 組織が所在する市 |
| `postal_code` | string | 組織の郵便番号 |
| `street` | string | 組織の住所 |
| `emails` | array | ドメインで見つかったメールアドレスの配列（各メールアドレスには値、タイプ、信頼度、ソース、個人の詳細が含まれる） |

### `hunter_email_finder`

名前と会社ドメインから、その人の最も可能性の高いメールアドレスを見つけます。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | 会社ドメイン名 |
| `first_name` | string | はい | 人の名（ファーストネーム） |
| `last_name` | string | はい | 人の姓（ラストネーム） |
| `company` | string | いいえ | 会社名 |
| `apiKey` | string | はい | Hunter.io APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `email` | string | 見つかったメールアドレス |
| `score` | number | 見つかったメールアドレスの信頼度スコア |
| `sources` | array | メールが見つかったソースの配列。各ソースにはdomain、uri、extracted_on、last_seen_on、still_on_pageが含まれます |
| `verification` | object | 日付とステータスを含む検証情報 |

### `hunter_email_verifier`

メールアドレスの配信可能性を検証し、詳細な検証ステータスを提供します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `email` | string | はい | 検証するメールアドレス |
| `apiKey` | string | はい | Hunter.io APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `result` | string | 配信可能性の結果：deliverable（配信可能）、undeliverable（配信不可）、またはrisky（リスクあり） |
| `score` | number | 検証結果の信頼度スコア |
| `email` | string | 検証されたメールアドレス |
| `regexp` | boolean | メールが有効な正規表現パターンに従っているかどうか |
| `gibberish` | boolean | メールが無意味な文字列に見えるかどうか |
| `disposable` | boolean | メールが使い捨てメールプロバイダーからのものかどうか |
| `webmail` | boolean | メールがウェブメールプロバイダーからのものかどうか |
| `mx_records` | boolean | ドメインにMXレコードが存在するかどうか |
| `smtp_server` | boolean | SMTPサーバーに到達可能かどうか |
| `smtp_check` | boolean | SMTPチェックが成功したかどうか |
| `accept_all` | boolean | ドメインがすべてのメールアドレスを受け入れるかどうか |
| `block` | boolean | メールがブロックされているかどうか |
| `status` | string | 検証ステータス：valid（有効）、invalid（無効）、accept_all（すべて受け入れ）、webmail（ウェブメール）、disposable（使い捨て）、またはunknown（不明） |
| `sources` | array | メールが見つかったソースの配列 |

### `hunter_companies_find`

ドメイン名を使用して企業データを充実させます。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | はい | 企業データを検索するドメイン |
| `apiKey` | string | はい | Hunter.io APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `person` | object | 個人情報（companies_findツールでは未定義） |
| `company` | object | 企業情報（名前、ドメイン、業種、規模、国、LinkedIn、Twitterを含む） |

### `hunter_email_count`

ドメインまたは企業に対して見つかったメールアドレスの総数を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `domain` | string | いいえ | メールをカウントするドメイン（会社名が提供されていない場合は必須） |
| `company` | string | いいえ | メールをカウントする会社名（ドメインが提供されていない場合は必須） |
| `type` | string | いいえ | 個人用または一般用メールのみをフィルタリング |
| `apiKey` | string | はい | Hunter.io APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `total` | number | 見つかったメールアドレスの総数 |
| `personal_emails` | number | 見つかった個人メールアドレスの数 |
| `generic_emails` | number | 見つかった一般メールアドレスの数 |
| `department` | object | 部門別のメールアドレスの内訳（経営陣、IT、財務、管理、営業、法務、サポート、人事、マーケティング、広報） |
| `seniority` | object | 職位レベル別のメールアドレスの内訳（ジュニア、シニア、エグゼクティブ） |

## メモ

- カテゴリー: `tools`
- タイプ: `hunter`
```

--------------------------------------------------------------------------------

---[FILE: image_generator.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/image_generator.mdx

```text
---
title: 画像ジェネレーター
description: 画像を生成する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="image_generator"
  color="#4D5FFF"
/>

{/* MANUAL-CONTENT-START:intro */}
[DALL-E](https://openai.com/dall-e-3)はOpenAIの先進的なAIシステムで、自然言語による説明から現実的な画像やアートを生成するために設計されています。最先端の画像生成モデルとして、DALL-Eはテキストプロンプトに基づいて詳細で創造的なビジュアルを作成し、ユーザーが芸術的なスキルを必要とせずにアイデアを視覚的なコンテンツに変換することを可能にします。

DALL-Eでは、以下のことができます：

- **リアルな画像の生成**: テキストによる説明から写真のようなビジュアルを作成
- **コンセプトアートのデザイン**: 抽象的なアイデアを視覚的な表現に変換
- **バリエーションの作成**: 同じプロンプトから複数の解釈を生成
- **芸術的スタイルのコントロール**: 芸術的スタイル、媒体、視覚的な美学を指定
- **詳細なシーンの作成**: 複数の要素と関係性を持つ複雑なシーンを描写
- **製品の視覚化**: 製品モックアップやデザインコンセプトを生成
- **アイデアのイラスト化**: 文章によるコンセプトを視覚的なイラストに変換

Simでは、DALL-E統合によりエージェントがワークフローの一部として画像をプログラム的に生成することができます。これにより、コンテンツ作成、ビジュアルデザイン、クリエイティブな発想など、強力な自動化シナリオが可能になります。エージェントは詳細なプロンプトを作成し、対応する画像を生成し、これらのビジュアルを出力や下流のプロセスに組み込むことができます。この統合は自然言語処理とビジュアルコンテンツ作成の間のギャップを埋め、エージェントがテキストだけでなく魅力的な画像を通じてコミュニケーションすることを可能にします。SimとDALL-Eを接続することで、視覚的なコンテンツをオンデマンドで生成し、概念を図解し、デザイン素材を生成し、豊かな視覚要素でユーザー体験を向上させるエージェントを作成できます - すべてクリエイティブプロセスにおいて人間の介入を必要とせずに。
{/* MANUAL-CONTENT-END */}

## 使用方法

画像ジェネレーターをワークフローに統合します。DALL-E 3またはGPT Imageを使用して画像を生成できます。APIキーが必要です。

## ツール

### `openai_image`

OpenAIを使用して画像を生成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `model` | string | はい | 使用するモデル（gpt-image-1またはdall-e-3） |
| `prompt` | string | はい | 希望する画像のテキスト説明 |
| `size` | string | はい | 生成される画像のサイズ（1024x1024、1024x1792、または1792x1024） |
| `quality` | string | いいえ | 画像の品質（standardまたはhd） |
| `style` | string | いいえ | 画像のスタイル（vividまたはnatural） |
| `background` | string | いいえ | 背景色、gpt-image-1のみ |
| `n` | number | いいえ | 生成する画像の数（1-10） |
| `apiKey` | string | はい | あなたのOpenAI APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 生成された画像データ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `image_generator`
```

--------------------------------------------------------------------------------

---[FILE: incidentio.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/incidentio.mdx

```text
---
title: incidentio
description: incident.ioでインシデントを管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="incidentio"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[incident.io](https://incident.io)でインシデント管理を強化しましょう – インシデントの調整、対応プロセスの合理化、アクションアイテムの追跡を一箇所で行える主要プラットフォームです。incident.ioを自動化ワークフローにシームレスに統合して、インシデントの作成、リアルタイムコラボレーション、フォローアップ、スケジューリング、エスカレーションなどを管理できます。

incident.ioツールでは、以下のことが可能です：

- **インシデントの一覧表示と検索**: `incidentio_incidents_list`を使用して、重要度、ステータス、タイムスタンプなどのメタデータを含む進行中または過去のインシデントのリストをすばやく取得できます。
- **新しいインシデントの作成**: `incidentio_incidents_create`を通じてプログラムで新しいインシデントを作成し、重要度、名前、タイプ、カスタム詳細を指定して、対応の遅延を防ぎます。
- **インシデントフォローアップの自動化**: incident.ioの強力な自動化機能を活用して、重要なアクションアイテムや学びが見逃されないようにし、チームが問題を解決しプロセスを改善するのを支援します。
- **ワークフローのカスタマイズ**: 組織のニーズに合わせたカスタムインシデントタイプ、重要度、カスタムフィールドを統合します。
- **スケジュールとエスカレーションによるベストプラクティスの実施**: 状況の進展に応じて自動的に割り当て、通知、エスカレーションを行うことで、オンコールとインシデント管理を効率化します。

incident.ioは、現代の組織がより迅速に対応し、チームを調整し、継続的な改善のために学びを捉えることを可能にします。SRE、DevOps、セキュリティ、またはITインシデントを管理する場合でも、incident.ioはエージェントワークフローにプログラムで一元化された最高クラスのインシデント対応をもたらします。

**利用可能な主要操作**：
- `incidentio_incidents_list`: 詳細情報を含むインシデントの一覧表示、ページネーション、フィルタリング。
- `incidentio_incidents_create`: カスタム属性と重複制御（べき等性）を備えた新しいインシデントをプログラムで開く。
- ...そしてさらに多くの機能が追加予定！

今日、incident.ioをワークフロー自動化と統合して、信頼性、説明責任、運用の卓越性を向上させましょう。
{/* MANUAL-CONTENT-END */}

## 使用方法

incident.ioをワークフローに統合します。インシデント、アクション、フォローアップ、ワークフロー、スケジュール、エスカレーション、カスタムフィールドなどを管理できます。

## ツール

### `incidentio_incidents_list`

incident.ioからインシデントのリストを取得します。重大度、ステータス、タイムスタンプなどの詳細を含むインシデントのリストを返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `page_size` | number | いいえ | ページごとに返すインシデントの数（デフォルト：25） |
| `after` | string | いいえ | 次のページの結果を取得するためのページネーションカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incidents` | array | インシデントのリスト |

### `incidentio_incidents_create`

incident.ioに新しいインシデントを作成します。idempotency_key、severity_id、visibilityが必要です。オプションとして、name、summary、type、statusを受け付けます。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `idempotency_key` | string | はい | インシデント作成の重複を防ぐための一意の識別子。UUIDまたは一意の文字列を使用してください。 |
| `name` | string | いいえ | インシデントの名前（オプション） |
| `summary` | string | いいえ | インシデントの簡単な概要 |
| `severity_id` | string | はい | 重大度レベルのID（必須） |
| `incident_type_id` | string | いいえ | インシデントタイプのID |
| `incident_status_id` | string | いいえ | 初期インシデントステータスのID |
| `visibility` | string | はい | インシデントの可視性："public"または"private"（必須） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incident` | object | 作成されたインシデントオブジェクト |

### `incidentio_incidents_show`

IDによってincident.ioから特定のインシデントに関する詳細情報を取得します。カスタムフィールドや役割の割り当てを含む完全なインシデントの詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | 取得するインシデントのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incident` | object | 詳細なインシデント情報 |

### `incidentio_incidents_update`

incident.ioで既存のインシデントを更新します。名前、概要、重大度、ステータス、またはタイプを更新できます。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | 更新するインシデントのID |
| `name` | string | いいえ | インシデントの更新された名前 |
| `summary` | string | いいえ | インシデントの更新された概要 |
| `severity_id` | string | いいえ | インシデントの更新された重大度ID |
| `incident_status_id` | string | いいえ | インシデントの更新されたステータスID |
| `incident_type_id` | string | いいえ | 更新されたインシデントタイプID |
| `notify_incident_channel` | boolean | はい | この更新についてインシデントチャンネルに通知するかどうか |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incident` | object | 更新されたインシデントオブジェクト |

### `incidentio_actions_list`

incident.ioからアクションを一覧表示します。オプションでインシデントIDによるフィルタリングが可能です。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `incident_id` | string | いいえ | インシデントIDでアクションをフィルタリング |
| `page_size` | number | いいえ | ページごとに返すアクションの数 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `actions` | array | アクションのリスト |

### `incidentio_actions_show`

incident.ioから特定のアクションに関する詳細情報を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | アクションID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `action` | object | アクションの詳細 |

### `incidentio_follow_ups_list`

incident.ioからフォローアップを一覧表示します。オプションでインシデントIDによるフィルタリングが可能です。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `incident_id` | string | いいえ | インシデントIDでフォローアップをフィルタリング |
| `page_size` | number | いいえ | ページごとに返すフォローアップの数 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `follow_ups` | array | フォローアップのリスト |

### `incidentio_follow_ups_show`

incident.ioから特定のフォローアップに関する詳細情報を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | フォローアップID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `follow_up` | object | フォローアップの詳細 |

### `incidentio_users_list`

Incident.ioワークスペース内のすべてのユーザーを一覧表示します。ID、名前、メール、役割などのユーザー詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Incident.io APIキー |
| `page_size` | number | いいえ | ページごとに返す結果の数（デフォルト：25） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `users` | array | ワークスペース内のユーザーリスト |

### `incidentio_users_show`

IDによってIncident.ioワークスペース内の特定のユーザーに関する詳細情報を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Incident.io APIキー |
| `id` | string | はい | 取得するユーザーの一意の識別子 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `user` | object | リクエストされたユーザーの詳細 |

### `incidentio_workflows_list`

incident.ioワークスペース内のすべてのワークフローを一覧表示します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `page_size` | number | いいえ | ページごとに返すワークフローの数 |
| `after` | string | いいえ | 次のページの結果を取得するためのページネーションカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `workflows` | array | ワークフローのリスト |

### `incidentio_workflows_show`

incident.ioの特定のワークフローの詳細を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | 取得するワークフローのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `workflow` | object | ワークフローの詳細 |

### `incidentio_workflows_update`

incident.ioの既存のワークフローを更新します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | 更新するワークフローのID |
| `name` | string | いいえ | ワークフローの新しい名前 |
| `state` | string | いいえ | ワークフローの新しい状態（active、draft、またはdisabled） |
| `folder` | string | いいえ | ワークフローの新しいフォルダ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `workflow` | object | 更新されたワークフロー |

### `incidentio_workflows_delete`

incident.ioでワークフローを削除します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | 削除するワークフローのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功メッセージ |

### `incidentio_schedules_list`

incident.ioのすべてのスケジュールを一覧表示します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `page_size` | number | いいえ | ページあたりの結果数（デフォルト：25） |
| `after` | string | いいえ | 次のページの結果を取得するためのページネーションカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `schedules` | array | スケジュールのリスト |

### `incidentio_schedules_create`

incident.ioで新しいスケジュールを作成します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `name` | string | はい | スケジュールの名前 |
| `timezone` | string | はい | スケジュールのタイムゾーン（例：America/New_York） |
| `config` | string | はい | ローテーションを含むJSONフォーマットのスケジュール設定。例：\{"rotations": \[\{"name": "Primary", "users": \[\{"id": "user_id"\}\], "handover_start_at": "2024-01-01T09:00:00Z", "handovers": \[\{"interval": 1, "interval_type": "weekly"\}\]\}\]\} |
| `Example` | string | いいえ | 説明なし |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `schedule` | object | 作成されたスケジュール |

### `incidentio_schedules_show`

incident.io内の特定のスケジュールの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | スケジュールのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `schedule` | object | スケジュールの詳細 |

### `incidentio_schedules_update`

incident.io内の既存のスケジュールを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | 更新するスケジュールのID |
| `name` | string | いいえ | スケジュールの新しい名前 |
| `timezone` | string | いいえ | スケジュールの新しいタイムゾーン（例：America/New_York） |
| `config` | string | いいえ | ローテーションを含むJSONフォーマットのスケジュール設定。例：\{"rotations": \[\{"name": "Primary", "users": \[\{"id": "user_id"\}\], "handover_start_at": "2024-01-01T09:00:00Z", "handovers": \[\{"interval": 1, "interval_type": "weekly"\}\]\}\]\} |
| `Example` | string | いいえ | 説明なし |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `schedule` | object | 更新されたスケジュール |

### `incidentio_schedules_delete`

incident.io内のスケジュールを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | 削除するスケジュールのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功メッセージ |

### `incidentio_escalations_list`

incident.io のすべてのエスカレーションポリシーを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io API キー |
| `page_size` | number | いいえ | ページあたりの結果数（デフォルト：25） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `escalations` | array | エスカレーションポリシーのリスト |

### `incidentio_escalations_create`

incident.io に新しいエスカレーションポリシーを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io API キー |
| `idempotency_key` | string | はい | 重複したエスカレーション作成を防ぐための一意の識別子。UUID または一意の文字列を使用してください。 |
| `title` | string | はい | エスカレーションのタイトル |
| `escalation_path_id` | string | いいえ | 使用するエスカレーションパスの ID（user_ids が提供されていない場合は必須） |
| `user_ids` | string | いいえ | 通知するユーザー ID のカンマ区切りリスト（escalation_path_id が提供されていない場合は必須） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `escalation` | object | 作成されたエスカレーションポリシー |

### `incidentio_escalations_show`

incident.io の特定のエスカレーションポリシーの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | エスカレーションポリシーのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `escalation` | object | エスカレーションポリシーの詳細 |

### `incidentio_custom_fields_list`

incident.ioからすべてのカスタムフィールドを一覧表示します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `custom_fields` | array | カスタムフィールドのリスト |

### `incidentio_custom_fields_create`

incident.ioに新しいカスタムフィールドを作成します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `name` | string | はい | カスタムフィールドの名前 |
| `description` | string | はい | カスタムフィールドの説明（必須） |
| `field_type` | string | はい | カスタムフィールドの種類（例：text、single_select、multi_select、numeric、datetime、link、user、team） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `custom_field` | object | 作成されたカスタムフィールド |

### `incidentio_custom_fields_show`

incident.ioの特定のカスタムフィールドに関する詳細情報を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | カスタムフィールドID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `custom_field` | object | カスタムフィールドの詳細 |

### `incidentio_custom_fields_update`

incident.ioの既存のカスタムフィールドを更新します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | カスタムフィールドID |
| `name` | string | はい | カスタムフィールドの新しい名前（必須） |
| `description` | string | はい | カスタムフィールドの新しい説明（必須） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `custom_field` | object | 更新されたカスタムフィールド |

### `incidentio_custom_fields_delete`

incident.ioからカスタムフィールドを削除します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | カスタムフィールドID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功メッセージ |

### `incidentio_severities_list`

Incident.ioワークスペースで設定されているすべての重大度レベルを一覧表示します。IDや名前、説明、ランクなどの重大度の詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Incident.io APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `severities` | array | 重大度レベルのリスト |

### `incidentio_incident_statuses_list`

Incident.ioワークスペースで設定されているすべてのインシデントステータスを一覧表示します。ID、名前、説明、カテゴリなどのステータスの詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Incident.io APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incident_statuses` | array | インシデントステータスのリスト |

### `incidentio_incident_types_list`

Incident.ioワークスペースで設定されているすべてのインシデントタイプを一覧表示します。ID、名前、説明、デフォルトフラグなどのタイプの詳細を返します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Incident.io APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incident_types` | array | インシデントタイプのリスト |

### `incidentio_incident_roles_list`

incident.ioのすべてのインシデントロールを一覧表示します

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incident_roles` | array | インシデントロールのリスト |

### `incidentio_incident_roles_create`

incident.ioで新しいインシデントロールを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `name` | string | はい | インシデントロールの名前 |
| `description` | string | はい | インシデントロールの説明 |
| `instructions` | string | はい | インシデントロールの指示 |
| `shortform` | string | はい | ロールの短縮形 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incident_role` | object | 作成されたインシデントロール |

### `incidentio_incident_roles_show`

incident.ioで特定のインシデントロールの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | インシデントロールのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incident_role` | object | インシデントロールの詳細 |

### `incidentio_incident_roles_update`

incident.ioで既存のインシデントロールを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | 更新するインシデントロールのID |
| `name` | string | はい | インシデントロールの名前 |
| `description` | string | はい | インシデントロールの説明 |
| `instructions` | string | はい | インシデントロールの指示 |
| `shortform` | string | はい | ロールの短縮形 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incident_role` | object | 更新されたインシデントロール |

### `incidentio_incident_roles_delete`

incident.ioでインシデントロールを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | 削除するインシデントロールのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功メッセージ |

### `incidentio_incident_timestamps_list`

incident.ioのすべてのインシデントタイムスタンプ定義をリスト表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incident_timestamps` | array | インシデントタイムスタンプ定義のリスト |

### `incidentio_incident_timestamps_show`

incident.ioの特定のインシデントタイムスタンプ定義の詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | インシデントタイムスタンプのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incident_timestamp` | object | インシデントタイムスタンプの詳細 |

### `incidentio_incident_updates_list`

incident.ioの特定のインシデントに関するすべての更新を一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `incident_id` | string | いいえ | 更新を取得するインシデントのID（オプション - 提供されない場合、すべての更新を返します） |
| `page_size` | number | いいえ | ページごとに返す結果の数 |
| `after` | string | いいえ | ページネーション用のカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `incident_updates` | array | インシデント更新のリスト |

### `incidentio_schedule_entries_list`

incident.ioの特定のスケジュールに関するすべてのエントリを一覧表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `schedule_id` | string | はい | エントリを取得するスケジュールのID |
| `entry_window_start` | string | いいえ | エントリをフィルタリングする開始日時（ISO 8601形式） |
| `entry_window_end` | string | いいえ | エントリをフィルタリングする終了日時（ISO 8601形式） |
| `page_size` | number | いいえ | ページごとに返す結果の数 |
| `after` | string | いいえ | ページネーション用のカーソル |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `schedule_entries` | array | スケジュールエントリのリスト |

### `incidentio_schedule_overrides_create`

incident.ioで新しいスケジュールオーバーライドを作成する

#### 入力

| パラメータ | タイプ | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `rotation_id` | string | はい | オーバーライドするローテーションのID |
| `schedule_id` | string | はい | スケジュールのID |
| `user_id` | string | いいえ | 割り当てるユーザーのID（user_id、user_email、またはuser_slack_idのいずれかを提供）|
| `user_email` | string | いいえ | 割り当てるユーザーのメールアドレス（user_id、user_email、またはuser_slack_idのいずれかを提供）|
| `user_slack_id` | string | いいえ | 割り当てるユーザーのSlack ID（user_id、user_email、またはuser_slack_idのいずれかを提供）|
| `start_at` | string | はい | オーバーライドの開始時間（ISO 8601形式）|
| `end_at` | string | はい | オーバーライドの終了時間（ISO 8601形式）|

#### 出力

| パラメータ | タイプ | 説明 |
| --------- | ---- | ----------- |
| `override` | object | 作成されたスケジュールオーバーライド |

### `incidentio_escalation_paths_create`

incident.ioで新しいエスカレーションパスを作成する

#### 入力

| パラメータ | タイプ | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `name` | string | はい | エスカレーションパスの名前 |
| `path` | json | はい | ターゲットと確認までの時間（秒）を含むエスカレーションレベルの配列。各レベルには以下が必要：targets（\{id, type, schedule_id?, user_id?, urgency\}の配列）とtime_to_ack_seconds（数値）|
| `working_hours` | json | いいえ | オプションの勤務時間設定。\{weekday, start_time, end_time\}の配列 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `escalation_path` | object | 作成されたエスカレーションパス |

### `incidentio_escalation_paths_show`

incident.io内の特定のエスカレーションパスの詳細を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | エスカレーションパスのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `escalation_path` | object | エスカレーションパスの詳細 |

### `incidentio_escalation_paths_update`

incident.ioで既存のエスカレーションパスを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | 更新するエスカレーションパスのID |
| `name` | string | いいえ | エスカレーションパスの新しい名前 |
| `path` | json | いいえ | 新しいエスカレーションパスの設定。ターゲットとtime_to_ack_secondsを持つエスカレーションレベルの配列 |
| `working_hours` | json | いいえ | 新しい稼働時間の設定。\{weekday, start_time, end_time\}の配列 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `escalation_path` | object | 更新されたエスカレーションパス |

### `incidentio_escalation_paths_delete`

incident.ioでエスカレーションパスを削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | incident.io APIキー |
| `id` | string | はい | 削除するエスカレーションパスのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `message` | string | 成功メッセージ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `incidentio`
```

--------------------------------------------------------------------------------

---[FILE: index.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/index.mdx

```text
---
title: 概要
description: エージェントワークフローを強化するパワフルなツール
---

import { Card, Cards } from "fumadocs-ui/components/card";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Video } from '@/components/ui/video';

ツールはSimの強力なコンポーネントで、ワークフローが外部サービスと連携したり、データを処理したり、特殊なタスクを実行したりすることを可能にします。これらはさまざまなAPIやサービスへのアクセスを提供することで、エージェントやワークフローの機能を拡張します。

<div className="mx-auto w-full overflow-hidden rounded-lg">
  <Video src="toolbar.mp4" width={700} height={450} />
</div>

## ツールとは

ツールとは、特定の機能や外部サービスとの統合を提供する専門的なコンポーネントです。ツールはウェブ検索、データベースとの対話、画像処理、テキストや画像の生成、メッセージングプラットフォームを通じたコミュニケーションなど、さまざまな用途に使用できます。

## ワークフローでのツールの使用

Simワークフローでツールを使用する主な方法は2つあります：

<Steps>
  <Step>
    <strong>スタンドアロンブロックとして</strong>：ツールの機能に確定的かつ直接的にアクセスする必要がある場合、個別のブロックとしてキャンバスに追加できます。これにより、ツールがいつどのように呼び出されるかを正確に制御できます。
  </Step>
  <Step>
    <strong>エージェントツールとして</strong>：「ツールを追加」をクリックして必要なパラメータを設定することで、ツールをエージェントブロックに追加できます。これにより、エージェントはタスクのコンテキストと要件に基づいて、使用するツールを動的に選択できます。
  </Step>
</Steps>

## ツールの設定

各ツールが適切に機能するには、特定の設定が必要です。一般的な設定要素には以下が含まれます：

- **APIキー**：多くのツールはAPIキーによる認証が必要です
- **接続パラメータ**：エンドポイント、データベース識別子など
- **入力フォーマット**：ツールに対してデータをどのように構造化するか
- **出力処理**：ツールからの結果をどのように処理するか

## 利用可能なツール

Simはさまざまな目的のための多様なツールコレクションを提供しています：

- **AIと言語処理**：OpenAI、ElevenLabs、翻訳サービス
- **検索とリサーチ**：Google検索、Tavily、Exa、Perplexity
- **ドキュメント操作**：Google Docs、Google Sheets、Notion、Confluence
- **メディア処理**：Vision、Image Generator
- **コミュニケーション**：Slack、WhatsApp、Twilio SMS、Gmail
- **データストレージ**：Pinecone、Supabase、Airtable
- **開発**：GitHub

各ツールには、設定と使用方法に関する詳細な説明が記載された専用のドキュメントページがあります。

## ツールの出力

ツールは通常、ワークフローの後続ブロックで処理できる構造化データを返します。このデータの形式はツールと操作によって異なりますが、一般的に以下を含みます：

- メインコンテンツまたは結果
- 操作に関するメタデータ
- ステータス情報

各ツールの正確な出力形式を理解するには、それぞれのツールの特定のドキュメントを参照してください。
```

--------------------------------------------------------------------------------

````
