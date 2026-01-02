---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 217
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 217 of 933)

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

---[FILE: trello.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/trello.mdx

```text
---
title: Trello
description: Trelloのボードとカードを管理する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="trello"
  color="#0052CC"
/>

{/* MANUAL-CONTENT-START:intro */}
[Trello](https://trello.com)は、ボード、リスト、カードを使用してプロジェクト、タスク、ワークフローを整理するのに役立つビジュアルコラボレーションツールです。

SimでTrelloを使用すると、以下のことができます：

- **ボードとリストの一覧表示**：アクセス権のあるボードとそれに関連するリストを表示します。
- **カードの一覧表示と検索**：ボード上のすべてのカードを取得したり、リストでフィルタリングしてコンテンツとステータスを確認したりできます。
- **カードの作成**：説明、ラベル、期限日を含む新しいカードをTrelloリストに追加します。
- **カードの更新と移動**：カードのプロパティを編集し、リスト間でカードを移動し、期限日やラベルを設定します。
- **最近のアクティビティの取得**：ボードやカードのアクションと活動履歴を取得します。
- **カードへのコメント**：コラボレーションと追跡のためにカードにコメントを追加します。

TrelloをSimと統合することで、エージェントがチームのタスク、ボード、プロジェクトをプログラムで管理できるようになります。プロジェクト管理ワークフローの自動化、タスクリストの最新化、他のツールとの同期、またはTrelloイベントに応じたインテリジェントワークフローのトリガー—すべてをAIエージェントを通じて行うことができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Trelloと統合してボードとカードを管理します。ボードの一覧表示、カードの一覧表示、カードの作成、カードの更新、アクションの取得、コメントの追加ができます。

## ツール

### `trello_list_lists`

Trelloボード上のすべてのリストを表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | はい | リストを表示するボードのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `lists` | array | id、name、closed、pos、idBoardを含むリストオブジェクトの配列 |
| `count` | number | 返されたリストの数 |

### `trello_list_cards`

Trelloボード上のすべてのカードを表示する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | はい | カードを表示するボードのID |
| `listId` | string | いいえ | オプション：リストIDでカードをフィルタリング |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `cards` | array | id、name、desc、url、ボード/リストID、ラベル、期限日を含むカードオブジェクトの配列 |
| `count` | number | 返されたカードの数 |

### `trello_create_card`

Trelloボードに新しいカードを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | はい | カードを作成するボードのID |
| `listId` | string | はい | カードを作成するリストのID |
| `name` | string | はい | カードの名前/タイトル |
| `desc` | string | いいえ | カードの説明 |
| `pos` | string | いいえ | カードの位置（top、bottom、または正の浮動小数点数） |
| `due` | string | いいえ | 期限日（ISO 8601形式） |
| `labels` | string | いいえ | カンマ区切りのラベルIDリスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `card` | object | id、name、desc、urlなどのプロパティを含む作成されたカードオブジェクト |

### `trello_update_card`

Trelloの既存のカードを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `cardId` | string | はい | 更新するカードのID |
| `name` | string | いいえ | カードの新しい名前/タイトル |
| `desc` | string | いいえ | カードの新しい説明 |
| `closed` | boolean | いいえ | カードをアーカイブ/クローズする（true）または再開する（false） |
| `idList` | string | いいえ | カードを別のリストに移動する |
| `due` | string | いいえ | 期限日（ISO 8601形式） |
| `dueComplete` | boolean | いいえ | 期限日を完了としてマークする |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `card` | object | id、name、desc、urlなどのプロパティを含む更新されたカードオブジェクト |

### `trello_get_actions`

ボードまたはカードからアクティビティ/アクションを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | いいえ | アクションを取得するボードのID（boardIdまたはcardIdのいずれかが必要） |
| `cardId` | string | いいえ | アクションを取得するカードのID（boardIdまたはcardIdのいずれかが必要） |
| `filter` | string | いいえ | タイプでアクションをフィルタリング（例：「commentCard,updateCard,createCard」または「all」） |
| `limit` | number | いいえ | 返すアクションの最大数（デフォルト：50、最大：1000） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `actions` | array | type、date、member、dataを含むアクションオブジェクトの配列 |
| `count` | number | 返されたアクションの数 |

### `trello_add_comment`

Trelloカードにコメントを追加する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `cardId` | string | はい | コメントするカードのID |
| `text` | string | はい | コメントテキスト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `comment` | object | id、text、date、member creatorを含む作成されたコメントオブジェクト |

## 注意事項

- カテゴリー: `tools`
- タイプ: `trello`
```

--------------------------------------------------------------------------------

---[FILE: tts.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/tts.mdx

```text
---
title: テキスト読み上げ
description: AIボイスを使用してテキストを音声に変換
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="tts"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
最新のAIボイスを使用してテキストを自然な音声に変換します。SimのText-to-Speech（TTS）ツールは、数十の言語で書かれたテキストから音声を生成でき、表現力豊かな声、フォーマット、速度、スタイル、感情などの高度なコントロールを選択できます。

**対応プロバイダーとモデル：**

- **[OpenAI Text-to-Speech](https://platform.openai.com/docs/guides/text-to-speech/voice-options)** (OpenAI):  
  OpenAIのTTS APIは、`tts-1`、`tts-1-hd`、`gpt-4o-mini-tts`などの高度なAIモデルを使用した超リアルな音声を提供します。男性と女性の両方の声があり、alloy、echo、fable、onyx、nova、shimmer、ash、ballad、coral、sage、verseなどのオプションがあります。複数の音声フォーマット（mp3、opus、aac、flac、wav、pcm）、調整可能な速度、ストリーミング合成をサポートしています。

- **[Deepgram Aura](https://deepgram.com/products/text-to-speech)** (Deepgram Inc.):  
  DeepgramのAuraは、会話の明瞭さ、低遅延、カスタマイズに最適化された、表現力豊かな英語と多言語AIボイスを提供します。`aura-asteria-en`、`aura-luna-en`などのモデルが利用可能です。複数のエンコーディング形式（linear16、mp3、opus、aac、flac）と速度、サンプルレート、スタイルの微調整をサポートしています。

- **[ElevenLabs Text-to-Speech](https://elevenlabs.io/text-to-speech)** (ElevenLabs):  
  ElevenLabsは、29以上の言語で数十の声を提供し、カスタム音声のクローンを作成する能力を持つ、リアルで感情豊かなTTSをリードしています。モデルは音声デザイン、音声合成、直接APIアクセスをサポートし、スタイル、感情、安定性、類似性の高度なコントロールを備えています。オーディオブック、コンテンツ作成、アクセシビリティなどに適しています。

- **[Cartesia TTS](https://docs.cartesia.ai/)** (Cartesia):  
  Cartesiaは、プライバシーと柔軟な展開に焦点を当てた、高品質で高速かつ安全なテキスト読み上げを提供します。即時ストリーミング、リアルタイム合成を提供し、シンプルなAPIを通じてアクセス可能な複数の国際的な声とアクセントをサポートしています。

- **[Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)** (Google Cloud):  
  GoogleはDeepMind WaveNetとNeural2モデルを使用して、50以上の言語とバリアントで高忠実度の音声を提供しています。機能には、音声選択、ピッチ、発話速度、音量調整、SSMLタグ、標準音声とスタジオグレードのプレミアム音声へのアクセスが含まれます。アクセシビリティ、IVR、メディアで広く使用されています。

- **[Microsoft Azure Speech](https://azure.microsoft.com/en-us/products/ai-services/text-to-speech)** (Microsoft Azure):  
  Azureは140以上の言語とロケールにわたって400以上のニューラル音声を提供し、独自の音声カスタマイズ、スタイル、感情、役割、リアルタイム制御が可能です。発音、イントネーションなどのSSMLサポートを提供します。グローバル、エンタープライズ、またはクリエイティブなTTSニーズに最適です。

- **[PlayHT](https://play.ht/)** (PlayHT):  
  PlayHTは、100以上の言語で800以上の音声を使用したリアルな音声合成、音声クローニング、インスタントストリーミング再生を専門としています。機能には、感情、ピッチと速度の制御、マルチボイスオーディオ、APIまたはオンラインスタジオを通じたカスタム音声作成が含まれます。

**選び方：**  
言語、サポートされている音声タイプ、希望するフォーマット（mp3、wavなど）、制御の粒度（速度、感情など）、特殊機能（音声クローニング、アクセント、ストリーミング）を優先して、プロバイダーとモデルを選択してください。クリエイティブ、アクセシビリティ、または開発者のユースケースでは、アプリケーションの要件との互換性を確保し、コストを比較してください。

最新の機能、価格、ドキュメントの詳細については、各プロバイダーの公式サイトをご覧ください！
{/* MANUAL-CONTENT-END */}

## 使用方法

OpenAI、Deepgram、ElevenLabs、Cartesia、Google Cloud、Azure、PlayHTの最先端AI音声を使用して、テキストから自然な音声を生成します。複数の音声、言語、オーディオフォーマットをサポートしています。

## ツール

### `tts_openai`

OpenAI TTSモデルを使用してテキストを音声に変換

#### 入力

| パラメータ | タイプ | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `text` | string | はい | 音声に変換するテキスト |
| `apiKey` | string | はい | OpenAI APIキー |
| `model` | string | いいえ | 使用するTTSモデル（tts-1、tts-1-hd、またはgpt-4o-mini-tts） |
| `voice` | string | いいえ | 使用する音声（alloy、ash、ballad、cedar、coral、echo、marin、sage、shimmer、verse） |
| `responseFormat` | string | いいえ | オーディオフォーマット（mp3、opus、aac、flac、wav、pcm） |
| `speed` | number | いいえ | 発話速度（0.25から4.0、デフォルト：1.0） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成された音声ファイルのURL |
| `audioFile` | file | 生成された音声ファイルオブジェクト |
| `duration` | number | 音声の長さ（秒） |
| `characterCount` | number | 処理された文字数 |
| `format` | string | 音声フォーマット |
| `provider` | string | 使用されたTTSプロバイダー |

### `tts_deepgram`

Deepgram Auraを使用してテキストを音声に変換する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `text` | string | はい | 音声に変換するテキスト |
| `apiKey` | string | はい | Deepgram APIキー |
| `model` | string | いいえ | Deepgramモデル/音声（例：aura-asteria-en、aura-luna-en） |
| `voice` | string | いいえ | 音声識別子（modelパラメータの代替） |
| `encoding` | string | いいえ | 音声エンコーディング（linear16、mp3、opus、aac、flac） |
| `sampleRate` | number | いいえ | サンプルレート（8000、16000、24000、48000） |
| `bitRate` | number | いいえ | 圧縮フォーマットのビットレート |
| `container` | string | いいえ | コンテナフォーマット（none、wav、ogg） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成された音声ファイルのURL |
| `audioFile` | file | 生成された音声ファイルオブジェクト |
| `duration` | number | 音声の長さ（秒） |
| `characterCount` | number | 処理された文字数 |
| `format` | string | 音声フォーマット |
| `provider` | string | 使用されたTTSプロバイダー |

### `tts_elevenlabs`

ElevenLabsの音声を使用してテキストを音声に変換する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `text` | string | はい | 音声に変換するテキスト |
| `voiceId` | string | はい | 使用する音声のID |
| `apiKey` | string | はい | ElevenLabs APIキー |
| `modelId` | string | いいえ | 使用するモデル（例：eleven_monolingual_v1、eleven_turbo_v2_5、eleven_flash_v2_5） |
| `stability` | number | いいえ | 音声の安定性（0.0から1.0、デフォルト：0.5） |
| `similarityBoost` | number | いいえ | 類似性ブースト（0.0から1.0、デフォルト：0.8） |
| `style` | number | いいえ | スタイル誇張（0.0から1.0） |
| `useSpeakerBoost` | boolean | いいえ | スピーカーブーストを使用（デフォルト：true） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成された音声ファイルのURL |
| `audioFile` | file | 生成された音声ファイルオブジェクト |
| `duration` | number | 音声の長さ（秒） |
| `characterCount` | number | 処理された文字数 |
| `format` | string | 音声フォーマット |
| `provider` | string | 使用されたTTSプロバイダー |

### `tts_cartesia`

Cartesia Sonic（超低遅延）を使用してテキストを音声に変換する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `text` | string | はい | 音声に変換するテキスト |
| `apiKey` | string | はい | Cartesia APIキー |
| `modelId` | string | いいえ | モデルID（sonic-english、sonic-multilingual） |
| `voice` | string | いいえ | 音声IDまたは埋め込み |
| `language` | string | いいえ | 言語コード（en、es、fr、de、it、ptなど） |
| `outputFormat` | json | いいえ | 出力フォーマット設定（コンテナ、エンコーディング、サンプルレート） |
| `speed` | number | いいえ | 速度乗数 |
| `emotion` | array | いいえ | Sonic-3用の感情タグ（例：['positivity:high']） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成された音声ファイルのURL |
| `audioFile` | file | 生成された音声ファイルオブジェクト |
| `duration` | number | 音声の長さ（秒） |
| `characterCount` | number | 処理された文字数 |
| `format` | string | 音声フォーマット |
| `provider` | string | 使用されたTTSプロバイダー |

### `tts_google`

Google Cloud Text-to-Speechを使用してテキストを音声に変換

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `text` | string | はい | 音声に変換するテキスト |
| `apiKey` | string | はい | Google Cloud APIキー |
| `voiceId` | string | いいえ | 音声ID（例：en-US-Neural2-A、en-US-Wavenet-D） |
| `languageCode` | string | はい | 言語コード（例：en-US、es-ES、fr-FR） |
| `gender` | string | いいえ | 音声の性別（MALE、FEMALE、NEUTRAL） |
| `audioEncoding` | string | いいえ | 音声エンコーディング（LINEAR16、MP3、OGG_OPUS、MULAW、ALAW） |
| `speakingRate` | number | いいえ | 発話速度（0.25～2.0、デフォルト：1.0） |
| `pitch` | number | いいえ | 音声のピッチ（-20.0～20.0、デフォルト：0.0） |
| `volumeGainDb` | number | いいえ | 音量ゲイン（dB）（-96.0～16.0） |
| `sampleRateHertz` | number | いいえ | サンプルレート（Hz） |
| `effectsProfileId` | array | いいえ | エフェクトプロファイル（例：\['headphone-class-device'\]） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成された音声ファイルのURL |
| `audioFile` | file | 生成された音声ファイルオブジェクト |
| `duration` | number | 音声の長さ（秒） |
| `characterCount` | number | 処理された文字数 |
| `format` | string | 音声フォーマット |
| `provider` | string | 使用されたTTSプロバイダー |

### `tts_azure`

Azure Cognitive Servicesを使用してテキストを音声に変換

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `text` | string | はい | 音声に変換するテキスト |
| `apiKey` | string | はい | Azure Speech Services APIキー |
| `voiceId` | string | いいえ | 音声ID（例：en-US-JennyNeural、en-US-GuyNeural） |
| `region` | string | いいえ | Azureリージョン（例：eastus、westus、westeurope） |
| `outputFormat` | string | いいえ | 出力音声フォーマット |
| `rate` | string | いいえ | 話速（例：+10%、-20%、1.5） |
| `pitch` | string | いいえ | 音声のピッチ（例：+5Hz、-2st、low） |
| `style` | string | いいえ | 話し方のスタイル（例：cheerful、sad、angry - ニューラル音声のみ） |
| `styleDegree` | number | いいえ | スタイル強度（0.01〜2.0） |
| `role` | string | いいえ | 役割（例：Girl、Boy、YoungAdultFemale） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成された音声ファイルのURL |
| `audioFile` | file | 生成された音声ファイルオブジェクト |
| `duration` | number | 音声の長さ（秒） |
| `characterCount` | number | 処理された文字数 |
| `format` | string | 音声フォーマット |
| `provider` | string | 使用されたTTSプロバイダー |

### `tts_playht`

PlayHT（音声クローニング）を使用してテキストを音声に変換

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `text` | string | はい | 音声に変換するテキスト |
| `apiKey` | string | はい | PlayHT APIキー（AUTHORIZATIONヘッダー） |
| `userId` | string | はい | PlayHT ユーザーID（X-USER-IDヘッダー） |
| `voice` | string | いいえ | 音声IDまたはマニフェストURL |
| `quality` | string | いいえ | 品質レベル（draft、standard、premium） |
| `outputFormat` | string | いいえ | 出力形式（mp3、wav、ogg、flac、mulaw） |
| `speed` | number | いいえ | 速度倍率（0.5〜2.0） |
| `temperature` | number | いいえ | 創造性/ランダム性（0.0〜2.0） |
| `voiceGuidance` | number | いいえ | 音声の安定性（1.0〜6.0） |
| `textGuidance` | number | いいえ | テキスト忠実度（1.0〜6.0） |
| `sampleRate` | number | いいえ | サンプルレート（8000、16000、22050、24000、44100、48000） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成された音声ファイルのURL |
| `audioFile` | file | 生成された音声ファイルオブジェクト |
| `duration` | number | 音声の長さ（秒） |
| `characterCount` | number | 処理された文字数 |
| `format` | string | 音声フォーマット |
| `provider` | string | 使用されたTTSプロバイダー |

## メモ

- カテゴリー: `tools`
- タイプ: `tts`
```

--------------------------------------------------------------------------------

---[FILE: twilio_sms.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/twilio_sms.mdx

```text
---
title: Twilio SMS
description: SMSメッセージを送信
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="twilio_sms"
  color="#F22F46"
/>

{/* MANUAL-CONTENT-START:intro */}
[Twilio SMS](https://www.twilio.com/en-us/sms)は、企業がアプリケーションやサービスにメッセージング機能を統合できる強力なクラウドコミュニケーションプラットフォームです。

Twilio SMSは、プログラムによるテキストメッセージの送受信のための堅牢なAPIを提供しています。180か国以上をカバーし、99.999％のアップタイムSLAを持つTwilioは、通信技術業界のリーダーとしての地位を確立しています。

Twilio SMSの主な機能には以下が含まれます：

- **グローバルリーチ**：複数の国でローカル電話番号を使用して世界中の受信者にメッセージを送信
- **プログラム可能なメッセージング**：ウェブフック、配信確認、スケジューリングオプションでメッセージ配信をカスタマイズ
- **高度な分析**：配信率、エンゲージメント指標を追跡し、メッセージングキャンペーンを最適化

Simでは、Twilio SMS統合により、エージェントがワークフローの一部としてこれらの強力なメッセージング機能を活用できるようになります。これにより、予約リマインダー、確認コード、アラート、インタラクティブな会話など、高度な顧客エンゲージメントシナリオの機会が生まれます。この統合により、AIワークフローと顧客コミュニケーションチャネルの間のギャップが埋まり、エージェントがタイムリーで関連性の高い情報をユーザーのモバイルデバイスに直接配信できるようになります。SimとTwilio SMSを接続することで、ユーザー体験を向上させながら日常的なメッセージングタスクを自動化する、ユーザーの好みのコミュニケーションチャネルを通じて顧客と関わるインテリジェントなエージェントを構築できます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Twilioをワークフローに統合します。SMSメッセージを送信できます。

## ツール

### `twilio_send_sms`

Twilio APIを使用して、単一または複数の受信者にテキストメッセージを送信します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `phoneNumbers` | string | はい | メッセージを送信する電話番号（改行で区切る） |
| `message` | string | はい | 送信するメッセージ |
| `accountSid` | string | はい | Twilioアカウント SID |
| `authToken` | string | はい | Twilio認証トークン |
| `fromNumber` | string | はい | メッセージを送信するTwilio電話番号 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | SMS送信成功ステータス |
| `messageId` | string | Twilioメッセージの一意識別子（SID） |
| `status` | string | Twilioからのメッセージ配信ステータス |
| `fromNumber` | string | メッセージが送信された電話番号 |
| `toNumber` | string | メッセージが送信先の電話番号 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `twilio_sms`
```

--------------------------------------------------------------------------------

---[FILE: twilio_voice.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/twilio_voice.mdx

```text
---
title: Twilio Voice
description: 電話の発信と管理
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="twilio_voice"
  color="#F22F46"
/>

{/* MANUAL-CONTENT-START:intro */}
[Twilio Voice](https://www.twilio.com/en-us/voice)は、シンプルなAPIを通じてプログラムによる電話の発信、受信、管理を可能にする強力なクラウドコミュニケーションプラットフォームです。

Twilio Voiceは、グローバルな展開を持つ高度な音声アプリケーションを構築するための堅牢なAPIを提供しています。100カ国以上をカバーし、キャリアグレードの信頼性と99.95%のアップタイムSLAを持つTwilioは、プログラム可能な音声通信の業界リーダーとしての地位を確立しています。

Twilio Voiceの主な機能には以下が含まれます：

- **グローバル音声ネットワーク**：複数の国のローカル電話番号で世界中で電話の発信と受信が可能
- **プログラム可能な通話制御**：TwiMLを使用して通話フロー、会話の録音、DTMF入力の収集、IVRシステムの実装を制御
- **高度な機能**：音声認識、テキスト読み上げ、通話転送、電話会議、留守番電話検出
- **リアルタイム分析**：通話品質、通話時間、コストを追跡し、音声アプリケーションを最適化

Simでは、Twilio Voice統合によりエージェントがワークフローの一部としてこれらの強力な音声機能を活用できるようになります。これにより、予約リマインダー、確認電話、自動サポートライン、インタラクティブな音声応答システムなどの高度な顧客エンゲージメントシナリオが可能になります。この統合により、AIワークフローと音声通信チャネルの間のギャップが埋められ、エージェントが電話を通じてタイムリーで関連性の高い情報を直接提供できるようになります。SimとTwilio Voiceを接続することで、顧客が好むコミュニケーションチャネルを通じて顧客と関わる知的なエージェントを作成し、ユーザー体験を向上させながら定型的な通話タスクを自動化することができます。
{/* MANUAL-CONTENT-END */}

## 使用方法

Twilio Voiceをワークフローに統合します。発信通話を行い、通話録音を取得します。

## ツール

### `twilio_voice_make_call`

Twilio Voice APIを使用して発信通話を行います。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `to` | string | はい | 発信先電話番号（E.164形式、例：+14155551234） |
| `from` | string | はい | 発信元のTwilio電話番号（E.164形式） |
| `url` | string | いいえ | 通話のTwiML指示を返すURL |
| `twiml` | string | いいえ | 実行するTwiML指示（URLの代わり）。角括弧を山括弧の代わりに使用してください。例：\[Response\]\[Say\]Hello\[/Say\]\[/Response\] |
| `statusCallback` | string | いいえ | 通話状態更新用のWebhook URL |
| `statusCallbackMethod` | string | いいえ | ステータスコールバック用のHTTPメソッド（GETまたはPOST） |
| `accountSid` | string | はい | Twilioアカウント SID |
| `authToken` | string | はい | Twilio認証トークン |
| `record` | boolean | いいえ | 通話を録音するかどうか |
| `recordingStatusCallback` | string | いいえ | 録音状態更新用のWebhook URL |
| `timeout` | number | いいえ | 応答を待つ時間（秒、デフォルト：60） |
| `machineDetection` | string | いいえ | 留守番電話検出：EnableまたはDetectMessageEnd |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 通話が正常に開始されたかどうか |
| `callSid` | string | 通話の一意識別子 |
| `status` | string | 通話状態（queued、ringing、in-progress、completedなど） |
| `direction` | string | 通話方向（outbound-api） |
| `from` | string | 発信元電話番号 |
| `to` | string | 発信先電話番号 |
| `duration` | number | 通話時間（秒） |
| `price` | string | 通話料金 |
| `priceUnit` | string | 料金の通貨 |
| `error` | string | 通話失敗時のエラーメッセージ |

### `twilio_voice_list_calls`

アカウントとの間で発信・着信された通話のリストを取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `accountSid` | string | はい | Twilio アカウント SID |
| `authToken` | string | はい | Twilio 認証トークン |
| `to` | string | いいえ | この電話番号への通話でフィルタリング |
| `from` | string | いいえ | この電話番号からの通話でフィルタリング |
| `status` | string | いいえ | 通話状態でフィルタリング（待機中、呼び出し中、進行中、完了など） |
| `startTimeAfter` | string | いいえ | この日付以降に開始された通話でフィルタリング（YYYY-MM-DD） |
| `startTimeBefore` | string | いいえ | この日付以前に開始された通話でフィルタリング（YYYY-MM-DD） |
| `pageSize` | number | いいえ | 返すレコード数（最大1000、デフォルト50） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 通話が正常に取得されたかどうか |
| `calls` | array | 通話オブジェクトの配列 |
| `total` | number | 返された通話の総数 |
| `page` | number | 現在のページ番号 |
| `pageSize` | number | ページあたりの通話数 |
| `error` | string | 取得に失敗した場合のエラーメッセージ |

### `twilio_voice_get_recording`

通話録音情報とトランスクリプション（TwiMLで有効化されている場合）を取得します。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `recordingSid` | string | はい | 取得する録音SID |
| `accountSid` | string | はい | Twilio アカウント SID |
| `authToken` | string | はい | Twilio 認証トークン |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 録音が正常に取得されたかどうか |
| `recordingSid` | string | 録音の一意識別子 |
| `callSid` | string | この録音が属する通話SID |
| `duration` | number | 録音の秒単位の長さ |
| `status` | string | 録音のステータス（完了、処理中など） |
| `channels` | number | チャンネル数（モノラルは1、デュアルは2） |
| `source` | string | 録音の作成方法 |
| `mediaUrl` | string | 録音メディアファイルをダウンロードするためのURL |
| `price` | string | 録音の費用 |
| `priceUnit` | string | 価格の通貨 |
| `uri` | string | 録音リソースの相対URI |
| `transcriptionText` | string | 録音から文字起こしされたテキスト（利用可能な場合） |
| `transcriptionStatus` | string | 文字起こしのステータス（完了、進行中、失敗） |
| `transcriptionPrice` | string | 文字起こしの費用 |
| `transcriptionPriceUnit` | string | 文字起こし価格の通貨 |
| `error` | string | 取得に失敗した場合のエラーメッセージ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `twilio_voice`
```

--------------------------------------------------------------------------------

---[FILE: typeform.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/typeform.mdx

```text
---
title: Typeform
description: Typeformとの連携
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="typeform"
  color="#262627"
/>

{/* MANUAL-CONTENT-START:intro */}
[Typeform](https://www.typeform.com/)は、会話形式のフォーム、アンケート、クイズを作成するためのユーザーフレンドリーなプラットフォームで、魅力的なユーザー体験に重点を置いています。

Typeformでできること：

- **インタラクティブなフォームの作成**：一度に一つの質問を表示するユニークなインターフェースで、回答者を引き込む美しい会話形式のフォームをデザイン
- **体験のカスタマイズ**：条件分岐ロジック、非表示フィールド、カスタムテーマを使用してパーソナライズされたユーザージャーニーを作成
- **他のツールとの連携**：ネイティブ統合とAPIを通じて1000以上のアプリと接続
- **回答データの分析**：包括的な分析とレポートツールを通じて実用的な洞察を取得

Simでは、Typeform統合によりエージェントがワークフローの一部としてTypeformデータをプログラム的に操作できるようになります。エージェントはフォームの回答を取得し、送信データを処理し、ユーザーフィードバックを意思決定プロセスに直接組み込むことができます。この統合は、リード資格評価、顧客フィードバック分析、データ駆動型のパーソナライゼーションなどのシナリオに特に価値があります。SimとTypeformを接続することで、フォームの回答を実用的な洞察に変換するインテリジェントな自動化ワークフローを作成できます - 感情分析、フィードバックの分類、要約の生成、さらには特定の回答パターンに基づくフォローアップアクションのトリガーなどが可能です。
{/* MANUAL-CONTENT-END */}

## 使用方法

Typeformをワークフローにインテグレーションします。回答の取得、ファイルのダウンロード、フォームのインサイトの取得が可能です。フォームが送信されたときにワークフローをトリガーするトリガーモードで使用できます。APIキーが必要です。

## ツール

### `typeform_responses`

Typeformからフォームの回答を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `formId` | string | はい | Typeformフォームのid |
| `apiKey` | string | はい | Typeformパーソナルアクセストークン |
| `pageSize` | number | いいえ | 取得する回答の数（デフォルト：25） |
| `since` | string | いいえ | この日付以降に送信された回答を取得（ISO 8601形式） |
| `until` | string | いいえ | この日付以前に送信された回答を取得（ISO 8601形式） |
| `completed` | string | いいえ | 完了ステータスによるフィルタリング（true/false） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `total_items` | number | 回答の総数 |
| `page_count` | number | 利用可能なページの総数 |
| `items` | array | response_id、submitted_at、answers、およびmetadataを含む回答オブジェクトの配列 |

### `typeform_files`

Typeformレスポンスでアップロードされたファイルをダウンロードする

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `formId` | string | はい | TypeformフォームID |
| `responseId` | string | はい | ファイルを含むレスポンスID |
| `fieldId` | string | はい | ファイルアップロードフィールドの一意のID |
| `filename` | string | はい | アップロードされたファイルのファイル名 |
| `inline` | boolean | いいえ | インラインContent-Dispositionでファイルをリクエストするかどうか |
| `apiKey` | string | はい | Typeformパーソナルアクセストークン |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `fileUrl` | string | アップロードされたファイルの直接ダウンロードURL |
| `contentType` | string | アップロードされたファイルのMIMEタイプ |
| `filename` | string | アップロードされたファイルの元のファイル名 |

### `typeform_insights`

Typeformフォームのインサイトと分析を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `formId` | string | はい | TypeformフォームID |
| `apiKey` | string | はい | Typeformパーソナルアクセストークン |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `fields` | array | このフィールドで離脱したユーザー数 |

### `typeform_list_forms`

Typeformアカウント内のすべてのフォームのリストを取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Typeformパーソナルアクセストークン |
| `search` | string | いいえ | タイトルでフォームをフィルタリングする検索クエリ |
| `page` | number | いいえ | ページ番号（デフォルト：1） |
| `pageSize` | number | いいえ | ページあたりのフォーム数（デフォルト：10、最大：200） |
| `workspaceId` | string | いいえ | ワークスペースIDでフォームをフィルタリング |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `total_items` | number | アカウント内のフォームの総数 |
| `page_count` | number | 利用可能なページの総数 |
| `items` | array | id、title、created_at、last_updated_at、settings、theme、および_linksを含むフォームオブジェクトの配列 |

### `typeform_get_form`

特定のフォームの完全な詳細と構造を取得する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Typeformパーソナルアクセストークン |
| `formId` | string | はい | フォームの一意の識別子 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | string | フォームの一意の識別子 |
| `title` | string | フォームのタイトル |
| `type` | string | フォームのタイプ（form、quizなど） |
| `settings` | object | 言語、プログレスバーなどを含むフォーム設定 |
| `theme` | object | テーマ参照 |
| `workspace` | object | ワークスペース参照 |
| `fields` | array | フォームフィールド/質問の配列 |
| `welcome_screens` | array | ウェルカム画面の配列 |
| `thankyou_screens` | array | サンキュー画面の配列 |
| `_links` | object | 公開フォームURLを含む関連リソースリンク |

### `typeform_create_form`

フィールドと設定を含む新しいフォームを作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Typeformパーソナルアクセストークン |
| `title` | string | はい | フォームのタイトル |
| `type` | string | いいえ | フォームのタイプ（デフォルト："form"）。オプション："form"、"quiz" |
| `workspaceId` | string | いいえ | フォームを作成するワークスペースID |
| `fields` | json | いいえ | フォーム構造を定義するフィールドオブジェクトの配列。各フィールドには、type、title、およびオプションのプロパティ/検証が必要 |
| `settings` | json | いいえ | フォーム設定オブジェクト（言語、progress_barなど） |
| `themeId` | string | いいえ | フォームに適用するテーマID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | string | 作成されたフォームの一意の識別子 |
| `title` | string | フォームのタイトル |
| `type` | string | フォームのタイプ |
| `fields` | array | 作成されたフォームフィールドの配列 |
| `_links` | object | 公開フォームURLを含む関連リソースリンク |

### `typeform_update_form`

JSON Patchオペレーションを使用して既存のフォームを更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Typeformパーソナルアクセストークン |
| `formId` | string | はい | 更新するフォームの一意の識別子 |
| `operations` | json | はい | JSON Patchオペレーションの配列（RFC 6902）。各オペレーションには：op（add/remove/replace）、path、および値（add/replaceの場合）が必要 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `id` | string | 更新されたフォームの一意の識別子 |
| `title` | string | フォームのタイトル |
| `type` | string | フォームのタイプ |
| `settings` | object | フォーム設定 |
| `theme` | object | テーマ参照 |
| `workspace` | object | ワークスペース参照 |
| `fields` | array | フォームフィールドの配列 |
| `welcome_screens` | array | ウェルカム画面の配列 |
| `thankyou_screens` | array | サンクスページの配列 |
| `_links` | object | 関連リソースリンク |

### `typeform_delete_form`

フォームとそのすべての回答を完全に削除する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | Typeformパーソナルアクセストークン |
| `formId` | string | はい | 削除するフォームの一意の識別子 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `deleted` | boolean | フォームが正常に削除されたかどうか |
| `message` | string | 削除確認メッセージ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `typeform`
```

--------------------------------------------------------------------------------

---[FILE: video_generator.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/video_generator.mdx

```text
---
title: ビデオジェネレーター
description: AIを使用してテキストから動画を生成
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="video_generator"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
最先端のAIモデルを使用してテキストプロンプトから動画を作成します。Simのビデオジェネレーターはパワフルで創造的な動画合成機能をワークフローにもたらし、多様なモデル、アスペクト比、解像度、カメラコントロール、ネイティブオーディオ、高度なスタイルと一貫性機能をサポートします。

**対応プロバイダーとモデル：**

- **[Runway Gen-4](https://research.runwayml.com/gen2/)** (Runway ML):  
  Runwayはテキストから動画生成の先駆者で、Gen-2、Gen-3、Gen-4などの強力なモデルで知られています。最新の[Gen-4](https://research.runwayml.com/gen2/)モデル（および高速処理のためのGen-4 Turbo）は、よりリアルな動き、優れた世界の一貫性、キャラクター、オブジェクト、スタイル、場所のビジュアルリファレンスをサポートしています。16:9、9:16、1:1のアスペクト比、5～10秒の動画長、最大4K解像度、スタイルプリセット、一貫した生成のための参照画像の直接アップロードに対応しています。Runwayは世界中の映画製作者、スタジオ、コンテンツクリエイターのためのクリエイティブツールを提供しています。

- **[Google Veo](https://deepmind.google/technologies/veo/)** (Google DeepMind):  
  [Veo](https://deepmind.google/technologies/veo/)はGoogleの次世代ビデオ生成モデルで、最大1080pおよび16秒の高品質なネイティブオーディオ動画を提供します。高度な動き、映画的効果、ニュアンスのあるテキスト理解をサポートしています。Veoは内蔵サウンドで動画を生成できます—ネイティブオーディオと無音クリップの両方に対応。オプションには16:9アスペクト、可変長の動画時間、異なるモデル（veo-3、veo-3.1）、プロンプトベースのコントロールが含まれます。ストーリーテリング、広告、研究、アイデア創出に最適です。

- **[Luma Dream Machine](https://lumalabs.ai/dream-machine)** (Luma AI):  
  [Dream Machine](https://lumalabs.ai/dream-machine)はテキストから驚くほどリアルで流動的な動画を提供します。高度なカメラコントロール、撮影技法プロンプトを組み込み、ray-1とray-2の両モデルをサポートしています。Dream Machineは正確なアスペクト比（16:9、9:16、1:1）、可変長の動画時間、複雑な視覚的方向性のためのカメラパスの指定をサポートしています。Lumaは画期的な視覚的忠実度で知られ、主要なAIビジョン研究者によってサポートされています。

- **[MiniMax Hailuo-02](https://minimax.chat/)** (via [Fal.ai](https://fal.ai/)):  
  [MiniMax Hailuo-02](https://minimax.chat/)は高度な中国の生成ビデオモデルで、[Fal.ai](https://fal.ai/)を通じて世界中で利用可能です。横向きまたは縦向き形式で最大16秒のビデオを生成でき、明確さと創造性を向上させるためのプロンプト最適化オプションがあります。プロ版と標準版のエンドポイントが利用可能で、高解像度（最大1920×1080）をサポートしています。プロンプト翻訳と最適化、商業的なストーリーテリング、視覚的アイデアの迅速なプロトタイピングが必要な創造的プロジェクトに適しています。

**選び方：**  
品質、速度、時間、音声、コスト、独自機能に関するニーズに基づいてプロバイダーとモデルを選択してください。RunwayとVeoは世界をリードするリアリズムと映画的な機能を提供しています。Lumaは流動的な動きとカメラコントロールに優れています。MiniMaxは中国語のプロンプトに最適で、迅速で手頃な価格のアクセスを提供します。ツールを選択する際には、リファレンスサポート、スタイルプリセット、音声要件、価格を考慮してください。

機能、制限、価格、モデルの進歩についての詳細は、上記の各プロバイダーの公式ドキュメントを参照してください。
{/* MANUAL-CONTENT-END */}

## 使用方法

主要なAIプロバイダーを使用してテキストプロンプトから高品質のビデオを生成します。複数のモデル、アスペクト比、解像度、およびワールドの一貫性、カメラコントロール、音声生成などのプロバイダー固有の機能をサポートしています。

## ツール

### `video_runway`

ワールドの一貫性と視覚的参照を使用してRunway Gen-4でビデオを生成

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | はい | ビデオプロバイダー（runway） |
| `apiKey` | string | はい | Runway APIキー |
| `model` | string | いいえ | Runwayモデル：gen-4（デフォルト、高品質）またはgen-4-turbo（より速い） |
| `prompt` | string | はい | 生成するビデオを説明するテキストプロンプト |
| `duration` | number | いいえ | ビデオの長さ（秒）（5または10、デフォルト：5） |
| `aspectRatio` | string | いいえ | アスペクト比：16:9（横向き）、9:16（縦向き）、または1:1（正方形） |
| `resolution` | string | いいえ | ビデオ解像度（720p出力）。注：Gen-4 Turboはネイティブで720p出力 |
| `visualReference` | json | はい | Gen-4には参照画像が必須（UserFileオブジェクト）。Gen-4はイメージからビデオへの変換のみをサポートし、テキストのみの生成はサポートしていません |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `videoUrl` | string | 生成された動画URL |
| `videoFile` | json | メタデータを含む動画ファイルオブジェクト |
| `duration` | number | 動画の長さ（秒） |
| `width` | number | 動画の幅（ピクセル） |
| `height` | number | 動画の高さ（ピクセル） |
| `provider` | string | 使用されたプロバイダー（runway） |
| `model` | string | 使用されたモデル |
| `jobId` | string | Runwayジョブ ID |

### `video_veo`

ネイティブ音声生成機能を備えたGoogle Veo 3/3.1を使用して動画を生成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | はい | 動画プロバイダー（veo） |
| `apiKey` | string | はい | Google Gemini APIキー |
| `model` | string | いいえ | Veoモデル: veo-3（デフォルト、最高品質）、veo-3-fast（より速い）、またはveo-3.1（最新） |
| `prompt` | string | はい | 生成する動画を説明するテキストプロンプト |
| `duration` | number | いいえ | 動画の長さ（秒）（4、6、または8、デフォルト: 8） |
| `aspectRatio` | string | いいえ | アスペクト比: 16:9（横向き）または9:16（縦向き） |
| `resolution` | string | いいえ | 動画解像度: 720pまたは1080p（デフォルト: 1080p） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `videoUrl` | string | 生成された動画URL |
| `videoFile` | json | メタデータを含む動画ファイルオブジェクト |
| `duration` | number | 動画の長さ（秒） |
| `width` | number | 動画の幅（ピクセル） |
| `height` | number | 動画の高さ（ピクセル） |
| `provider` | string | 使用されたプロバイダー（veo） |
| `model` | string | 使用されたモデル |
| `jobId` | string | Veoジョブ ID |

### `video_luma`

高度なカメラコントロールを使用してLuma Dream Machineで動画を生成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | はい | 動画プロバイダー（luma） |
| `apiKey` | string | はい | Luma AI APIキー |
| `model` | string | いいえ | Lumaモデル: ray-2（デフォルト） |
| `prompt` | string | はい | 生成する動画を説明するテキストプロンプト |
| `duration` | number | いいえ | 動画の長さ（秒）（5または9、デフォルト: 5） |
| `aspectRatio` | string | いいえ | アスペクト比: 16:9（横向き）、9:16（縦向き）、または1:1（正方形） |
| `resolution` | string | いいえ | 動画解像度: 540p、720p、または1080p（デフォルト: 1080p） |
| `cameraControl` | json | いいえ | コンセプトオブジェクトの配列としてのカメラコントロール。形式: \[\{ "key": "concept_name" \}\]。有効なキー: truck_left, truck_right, pan_left, pan_right, tilt_up, tilt_down, zoom_in, zoom_out, push_in, pull_out, orbit_left, orbit_right, crane_up, crane_down, static, handheldなど20以上の事前定義オプション |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `videoUrl` | string | 生成された動画URL |
| `videoFile` | json | メタデータを含む動画ファイルオブジェクト |
| `duration` | number | 動画の長さ（秒） |
| `width` | number | 動画の幅（ピクセル） |
| `height` | number | 動画の高さ（ピクセル） |
| `provider` | string | 使用されたプロバイダー（luma） |
| `model` | string | 使用されたモデル |
| `jobId` | string | LumaジョブID |

### `video_minimax`

MiniMax PlatformのAPIを通じてMiniMax Hailuoを使用し、高度なリアリズムとプロンプト最適化で動画を生成

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | はい | 動画プロバイダー（minimax） |
| `apiKey` | string | はい | platform.minimax.ioから取得したMiniMax APIキー |
| `model` | string | いいえ | MiniMaxモデル：hailuo-02（デフォルト） |
| `prompt` | string | はい | 生成する動画を説明するテキストプロンプト |
| `duration` | number | いいえ | 動画の長さ（秒）（6または10、デフォルト：6） |
| `promptOptimizer` | boolean | いいえ | より良い結果を得るためのプロンプト最適化を有効にする（デフォルト：true） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `videoUrl` | string | 生成された動画のURL |
| `videoFile` | json | メタデータを含む動画ファイルオブジェクト |
| `duration` | number | 動画の長さ（秒） |
| `width` | number | 動画の幅（ピクセル） |
| `height` | number | 動画の高さ（ピクセル） |
| `provider` | string | 使用されたプロバイダー（minimax） |
| `model` | string | 使用されたモデル |
| `jobId` | string | MiniMaxジョブID |

### `video_falai`

Fal.aiプラットフォームを使用して、Veo 3.1、Sora 2、Kling 2.5、MiniMax Hailuoなど複数のモデルにアクセスして動画を生成

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | はい | 動画プロバイダー（falai） |
| `apiKey` | string | はい | Fal.ai APIキー |
| `model` | string | はい | Fal.aiモデル：veo-3.1（Google Veo 3.1）、sora-2（OpenAI Sora 2）、kling-2.5-turbo-pro（Kling 2.5 Turbo Pro）、kling-2.1-pro（Kling 2.1 Master）、minimax-hailuo-2.3-pro（MiniMax Hailuo Pro）、minimax-hailuo-2.3-standard（MiniMax Hailuo Standard）、wan-2.1（WAN T2V）、ltxv-0.9.8（LTXV 13B） |
| `prompt` | string | はい | 生成する動画を説明するテキストプロンプト |
| `duration` | number | いいえ | 動画の長さ（秒）（モデルによって異なる） |
| `aspectRatio` | string | いいえ | アスペクト比（モデルによって異なる）：16:9、9:16、1:1 |
| `resolution` | string | いいえ | 動画解像度（モデルによって異なる）：540p、720p、1080p |
| `promptOptimizer` | boolean | いいえ | MiniMaxモデル用のプロンプト最適化を有効にする（デフォルト：true） |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `videoUrl` | string | 生成された動画URL |
| `videoFile` | json | メタデータを含む動画ファイルオブジェクト |
| `duration` | number | 動画の長さ（秒） |
| `width` | number | 動画の幅（ピクセル） |
| `height` | number | 動画の高さ（ピクセル） |
| `provider` | string | 使用されたプロバイダー（falai） |
| `model` | string | 使用されたモデル |
| `jobId` | string | ジョブID |

## 注意事項

- カテゴリー: `tools`
- タイプ: `video_generator`
```

--------------------------------------------------------------------------------

---[FILE: vision.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/vision.mdx

```text
---
title: Vision
description: ビジョンモデルで画像を分析する
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="vision"
  color="#4D5FFF"
/>

{/* MANUAL-CONTENT-START:intro */}
Visionは、ビジョンモデルを使って画像を分析できるツールです。

Visionでは、以下のことができます：

- **画像を分析する**：ビジョンモデルで画像を分析
- **テキストを抽出する**：画像からテキストを抽出
- **オブジェクトを識別する**：画像内のオブジェクトを識別
- **画像を説明する**：画像を詳細に説明
- **画像を生成する**：テキストから画像を生成

Simでは、Vision統合によりエージェントがワークフローの一部としてビジョンモデルで画像を分析できるようになります。これにより、ビジョンモデルによる画像分析を必要とする強力な自動化シナリオが可能になります。エージェントはビジョンモデルで画像を分析し、画像からテキストを抽出し、画像内のオブジェクトを識別し、画像を詳細に説明し、テキストから画像を生成することができます。この統合により、AIワークフローと画像分析のニーズの間のギャップが埋まり、より高度で画像中心の自動化が可能になります。SimとVisionを接続することで、手動の介入やカスタムコードを必要とせずに、最新の情報を常に把握し、より正確な応答を提供し、ユーザーにより多くの価値を届けるエージェントを作成できます。
{/* MANUAL-CONTENT-END */}

## 使用手順

Visionをワークフローに統合します。ビジョンモデルで画像を分析できます。APIキーが必要です。

## ツール

### `vision_tool`

高度なビジョンモデルを使用して画像を処理・分析します。画像コンテンツの理解、テキストの抽出、オブジェクトの識別、詳細な視覚的説明の提供が可能です。

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | はい | 選択したモデルプロバイダーのAPIキー |
| `imageUrl` | string | いいえ | 公開アクセス可能な画像URL |
| `imageFile` | file | いいえ | 分析する画像ファイル |
| `model` | string | いいえ | 使用するビジョンモデル（gpt-4o、claude-3-opus-20240229など） |
| `prompt` | string | いいえ | 画像分析用のカスタムプロンプト |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `content` | string | 分析されたコンテンツと画像の説明 |
| `model` | string | 分析に使用されたビジョンモデル |
| `tokens` | number | 分析に使用された合計トークン数 |
| `usage` | object | 詳細なトークン使用内訳 |

## 注意事項

- カテゴリー: `tools`
- タイプ: `vision`
```

--------------------------------------------------------------------------------

---[FILE: wealthbox.mdx]---
Location: sim-main/apps/docs/content/docs/ja/tools/wealthbox.mdx

```text
---
title: Wealthbox
description: Wealthboxとやり取りする
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wealthbox"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Wealthbox](https://www.wealthbox.com/)は、ファイナンシャルアドバイザーや資産管理の専門家向けに特別に設計された包括的なCRMプラットフォームです。金融サービス業界において、顧客関係の管理、やり取りの追跡、ビジネスワークフローの整理のための一元化されたシステムを提供します。

Wealthboxでは、以下のことが可能です：

- **顧客関係の管理**: すべての顧客の詳細な連絡先情報、背景データ、関係履歴を保存
- **やり取りの追跡**: 会議、通話、その他の顧客とのやり取りに関するメモを作成・維持
- **タスクの整理**: フォローアップ活動、期限、重要なアクションアイテムのスケジュール設定と管理
- **ドキュメントワークフロー**: 顧客とのコミュニケーションやビジネスプロセスの包括的な記録を保持
- **顧客データへのアクセス**: 整理された連絡先管理と検索機能で情報を素早く取得
- **フォローアップの自動化**: リマインダーを設定し、タスクをスケジュールして一貫した顧客エンゲージメントを確保

Simでは、Wealthbox統合により、エージェントがOAuth認証を通じてCRMデータとシームレスにやり取りすることができます。これにより、会議の議事録から自動的に顧客メモを作成したり、連絡先情報を更新したり、フォローアップタスクをスケジュールしたり、パーソナライズされたコミュニケーションのために顧客の詳細を取得したりするなど、強力な自動化シナリオが可能になります。エージェントは既存のメモ、連絡先、タスクを読み取って顧客の履歴を理解しながら、新しいエントリを作成して最新の記録を維持することもできます。この統合により、AIワークフローと顧客関係管理の間のギャップが埋まり、自動データ入力、インテリジェントな顧客インサイト、合理化された管理プロセスが可能になり、より価値の高い顧客対応活動のための時間を確保できます。
{/* MANUAL-CONTENT-END */}

## 使用手順

Wealthboxをワークフローに統合します。メモの読み書き、連絡先の読み書き、タスクの読み書きが可能です。OAuth認証が必要です。

## ツール

### `wealthbox_read_note`

Wealthboxのノートからコンテンツを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `noteId` | string | いいえ | 読み取るノートのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | ノートデータとメタデータ |

### `wealthbox_write_note`

Wealthboxのノートを作成または更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `content` | string | はい | ノートの本文 |
| `contactId` | string | いいえ | このノートにリンクする連絡先のID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 作成または更新されたノートデータとメタデータ |

### `wealthbox_read_contact`

Wealthboxの連絡先からコンテンツを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | いいえ | 読み取る連絡先のID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 連絡先データとメタデータ |

### `wealthbox_write_contact`

Wealthboxの新規連絡先を作成する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `firstName` | string | はい | 連絡先の名 |
| `lastName` | string | はい | 連絡先の姓 |
| `emailAddress` | string | いいえ | 連絡先のメールアドレス |
| `backgroundInformation` | string | いいえ | 連絡先に関する背景情報 |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 作成または更新された連絡先データとメタデータ |

### `wealthbox_read_task`

Wealthboxタスクからコンテンツを読み取る

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | いいえ | 読み取るタスクのID |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | タスクデータとメタデータ |

### `wealthbox_write_task`

Wealthboxタスクを作成または更新する

#### 入力

| パラメータ | 型 | 必須 | 説明 |
| --------- | ---- | -------- | ----------- |
| `title` | string | はい | タスクの名前/タイトル |
| `dueDate` | string | はい | タスクの期日と時間（形式："YYYY-MM-DD HH:MM AM/PM -HHMM"、例："2015-05-24 11:00 AM -0400"） |
| `contactId` | string | いいえ | このタスクにリンクする連絡先のID |
| `description` | string | いいえ | タスクに関する説明またはメモ |

#### 出力

| パラメータ | 型 | 説明 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功ステータス |
| `output` | object | 作成または更新されたタスクデータとメタデータ |

## 注意事項

- カテゴリー: `tools`
- タイプ: `wealthbox`
```

--------------------------------------------------------------------------------

````
