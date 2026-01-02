---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 245
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 245 of 933)

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

---[FILE: tts.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/tts.mdx

```text
---
title: 文本转语音
description: 使用 AI 语音将文本转换为语音
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="tts"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
使用最新的 AI 语音将文本转换为自然的语音。Sim 的文本转语音 (TTS) 工具可以让您从书面文本生成音频，支持数十种语言，并提供多种富有表现力的语音、格式以及高级控制选项，如语速、风格、情感等。

**支持的提供商和模型：**

- **[OpenAI 文本转语音](https://platform.openai.com/docs/guides/text-to-speech/voice-options)** (OpenAI)：  
  OpenAI 的 TTS API 使用先进的 AI 模型（如 `tts-1`、`tts-1-hd` 和 `gpt-4o-mini-tts`）提供超逼真的语音。语音包括男性和女性选项，如 alloy、echo、fable、onyx、nova、shimmer、ash、ballad、coral、sage 和 verse。支持多种音频格式（mp3、opus、aac、flac、wav、pcm），并可调整语速和流式合成。

- **[Deepgram Aura](https://deepgram.com/products/text-to-speech)** (Deepgram Inc.)：  
  Deepgram 的 Aura 提供富有表现力的英语和多语言 AI 语音，优化了对话清晰度、低延迟和定制化。可用模型包括 `aura-asteria-en`、`aura-luna-en` 等。支持多种编码格式（linear16、mp3、opus、aac、flac），并可对语速、采样率和风格进行微调。

- **[ElevenLabs 文本转语音](https://elevenlabs.io/text-to-speech)** (ElevenLabs)：  
  ElevenLabs 在逼真且情感丰富的 TTS 领域处于领先地位，提供 29+ 种语言的数十种语音，并支持克隆自定义语音。模型支持语音设计、语音合成和直接 API 访问，具有风格、情感、稳定性和相似性等高级控制功能。适用于有声读物、内容创作、无障碍访问等。

- **[Cartesia TTS](https://docs.cartesia.ai/)** (Cartesia)：  
  Cartesia 提供高质量、快速且安全的文本转语音，注重隐私和灵活部署。支持即时流媒体、实时合成，并提供多种国际语音和口音，通过简单的 API 即可访问。

- **[Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)** (Google Cloud):  
  Google 使用 DeepMind WaveNet 和 Neural2 模型，为 50 多种语言和变体提供高保真语音。功能包括语音选择、音调、语速、音量控制、SSML 标签，以及标准和工作室级高级语音的访问权限。广泛用于无障碍访问、IVR 和媒体。

- **[Microsoft Azure Speech](https://azure.microsoft.com/en-us/products/ai-services/text-to-speech)** (Microsoft Azure):  
  Azure 提供超过 400 种神经语音，覆盖 140 多种语言和地区，具有独特的语音定制、风格、情感、角色和实时控制功能。支持 SSML 用于发音、语调等。非常适合全球化、企业或创意的 TTS 需求。

- **[PlayHT](https://play.ht/)** (PlayHT):  
  PlayHT 专注于逼真的语音合成、语音克隆和即时流媒体播放，支持 100 多种语言的 800 多种语音。功能包括情感、音调和速度控制、多语音音频，以及通过 API 或在线工作室创建自定义语音。

**如何选择：**  
根据语言、支持的语音类型、所需格式（mp3、wav 等）、控制粒度（速度、情感等）和特殊功能（语音克隆、口音、流媒体）来优先选择提供商和模型。对于创意、无障碍或开发者使用场景，请确保与您的应用程序需求兼容，并比较成本。

访问每个提供商的官方网站，了解最新功能、定价和文档详情！
{/* MANUAL-CONTENT-END */}

## 使用说明

使用来自 OpenAI、Deepgram、ElevenLabs、Cartesia、Google Cloud、Azure 和 PlayHT 的最先进 AI 语音，从文本生成自然语音。支持多种语音、语言和音频格式。

## 工具

### `tts_openai`

使用 OpenAI TTS 模型将文本转换为语音

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `text` | string | 是 | 要转换为语音的文本 |
| `apiKey` | string | 是 | OpenAI API 密钥 |
| `model` | string | 否 | 要使用的 TTS 模型 \(tts-1, tts-1-hd, 或 gpt-4o-mini-tts\) |
| `voice` | string | 否 | 要使用的语音 \(alloy, ash, ballad, cedar, coral, echo, marin, sage, shimmer, verse\) |
| `responseFormat` | string | 否 | 音频格式 \(mp3, opus, aac, flac, wav, pcm\) |
| `speed` | number | 否 | 语速 \(0.25 到 4.0，默认值：1.0\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成的音频文件的 URL |
| `audioFile` | file | 生成的音频文件对象 |
| `duration` | number | 音频时长（秒） |
| `characterCount` | number | 处理的字符数 |
| `format` | string | 音频格式 |
| `provider` | string | 使用的 TTS 提供商 |

### `tts_deepgram`

使用 Deepgram Aura 将文本转换为语音

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `text` | string | 是 | 要转换为语音的文本 |
| `apiKey` | string | 是 | Deepgram API 密钥 |
| `model` | string | 否 | Deepgram 模型/语音（例如：aura-asteria-en, aura-luna-en） |
| `voice` | string | 否 | 语音标识符（模型参数的替代选项） |
| `encoding` | string | 否 | 音频编码（linear16, mp3, opus, aac, flac） |
| `sampleRate` | number | 否 | 采样率（8000, 16000, 24000, 48000） |
| `bitRate` | number | 否 | 压缩格式的比特率 |
| `container` | string | 否 | 容器格式（none, wav, ogg） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成的音频文件的 URL |
| `audioFile` | file | 生成的音频文件对象 |
| `duration` | number | 音频时长（秒） |
| `characterCount` | number | 处理的字符数 |
| `format` | string | 音频格式 |
| `provider` | string | 使用的 TTS 提供商 |

### `tts_elevenlabs`

使用 ElevenLabs 声音将文本转换为语音

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `text` | string | 是 | 要转换为语音的文本 |
| `voiceId` | string | 是 | 要使用的声音 ID |
| `apiKey` | string | 是 | ElevenLabs API 密钥 |
| `modelId` | string | 否 | 使用的模型 \(例如，eleven_monolingual_v1, eleven_turbo_v2_5, eleven_flash_v2_5\) |
| `stability` | number | 否 | 声音稳定性 \(0.0 到 1.0，默认值：0.5\) |
| `similarityBoost` | number | 否 | 相似性增强 \(0.0 到 1.0，默认值：0.8\) |
| `style` | number | 否 | 风格夸张程度 \(0.0 到 1.0\) |
| `useSpeakerBoost` | boolean | 否 | 是否使用扬声器增强 \(默认值：true\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成的音频文件的 URL |
| `audioFile` | file | 生成的音频文件对象 |
| `duration` | number | 音频时长（秒） |
| `characterCount` | number | 处理的字符数 |
| `format` | string | 音频格式 |
| `provider` | string | 使用的 TTS 提供商 |

### `tts_cartesia`

使用 Cartesia Sonic （超低延迟）将文本转换为语音

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `text` | string | 是 | 要转换为语音的文本 |
| `apiKey` | string | 是 | Cartesia API 密钥 |
| `modelId` | string | 否 | 模型 ID \(sonic-english, sonic-multilingual\) |
| `voice` | string | 否 | 声音 ID 或嵌入 |
| `language` | string | 否 | 语言代码 \(en, es, fr, de, it, pt 等\) |
| `outputFormat` | json | 否 | 输出格式配置 \(容器, 编码, 采样率\) |
| `speed` | number | 否 | 速度倍增器 |
| `emotion` | array | 否 | Sonic-3 的情感标签 \(例如，\['positivity:high'\]\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成的音频文件的 URL |
| `audioFile` | file | 生成的音频文件对象 |
| `duration` | number | 音频时长（以秒为单位） |
| `characterCount` | number | 处理的字符数 |
| `format` | string | 音频格式 |
| `provider` | string | 使用的 TTS 提供商 |

### `tts_google`

使用 Google Cloud Text-to-Speech 将文本转换为语音

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `text` | string | 是 | 要转换为语音的文本 |
| `apiKey` | string | 是 | Google Cloud API 密钥 |
| `voiceId` | string | 否 | 语音 ID（例如，en-US-Neural2-A, en-US-Wavenet-D） |
| `languageCode` | string | 是 | 语言代码（例如，en-US, es-ES, fr-FR） |
| `gender` | string | 否 | 语音性别（MALE, FEMALE, NEUTRAL） |
| `audioEncoding` | string | 否 | 音频编码（LINEAR16, MP3, OGG_OPUS, MULAW, ALAW） |
| `speakingRate` | number | 否 | 语速（0.25 到 2.0，默认值：1.0） |
| `pitch` | number | 否 | 语音音调（-20.0 到 20.0，默认值：0.0） |
| `volumeGainDb` | number | 否 | 音量增益（以 dB 为单位，-96.0 到 16.0） |
| `sampleRateHertz` | number | 否 | 采样率（以 Hz 为单位） |
| `effectsProfileId` | array | 否 | 效果配置文件（例如，\['headphone-class-device'\]） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成的音频文件的 URL |
| `audioFile` | file | 生成的音频文件对象 |
| `duration` | number | 音频时长（秒） |
| `characterCount` | number | 处理的字符数 |
| `format` | string | 音频格式 |
| `provider` | string | 使用的 TTS 提供商 |

### `tts_azure`

使用 Azure 认知服务将文本转换为语音

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `text` | string | 是 | 要转换为语音的文本 |
| `apiKey` | string | 是 | Azure 语音服务 API 密钥 |
| `voiceId` | string | 否 | 语音 ID（例如，en-US-JennyNeural, en-US-GuyNeural） |
| `region` | string | 否 | Azure 区域（例如，eastus, westus, westeurope） |
| `outputFormat` | string | 否 | 输出音频格式 |
| `rate` | string | 否 | 语速（例如，+10%, -20%, 1.5） |
| `pitch` | string | 否 | 语音音调（例如，+5Hz, -2st, low） |
| `style` | string | 否 | 语音风格（例如，cheerful, sad, angry - 仅限神经语音） |
| `styleDegree` | number | 否 | 风格强度（0.01 到 2.0） |
| `role` | string | 否 | 角色（例如，Girl, Boy, YoungAdultFemale） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成的音频文件的 URL |
| `audioFile` | file | 生成的音频文件对象 |
| `duration` | number | 音频时长（秒） |
| `characterCount` | number | 处理的字符数 |
| `format` | string | 音频格式 |
| `provider` | string | 使用的 TTS 提供商 |

### `tts_playht`

使用 PlayHT （语音克隆）将文本转换为语音

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `text` | string | 是 | 要转换为语音的文本 |
| `apiKey` | string | 是 | PlayHT API 密钥 \(AUTHORIZATION header\) |
| `userId` | string | 是 | PlayHT 用户 ID \(X-USER-ID header\) |
| `voice` | string | 否 | 语音 ID 或清单 URL |
| `quality` | string | 否 | 质量级别 \(draft, standard, premium\) |
| `outputFormat` | string | 否 | 输出格式 \(mp3, wav, ogg, flac, mulaw\) |
| `speed` | number | 否 | 速度倍数 \(0.5 到 2.0\) |
| `temperature` | number | 否 | 创造性/随机性 \(0.0 到 2.0\) |
| `voiceGuidance` | number | 否 | 语音稳定性 \(1.0 到 6.0\) |
| `textGuidance` | number | 否 | 文本贴合度 \(1.0 到 6.0\) |
| `sampleRate` | number | 否 | 采样率 \(8000, 16000, 22050, 24000, 44100, 48000\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `audioUrl` | string | 生成的音频文件的 URL |
| `audioFile` | file | 生成的音频文件对象 |
| `duration` | number | 音频时长（秒） |
| `characterCount` | number | 处理的字符数 |
| `format` | string | 音频格式 |
| `provider` | string | 使用的 TTS 提供商 |

## 注意事项

- 类别：`tools`
- 类型：`tts`
```

--------------------------------------------------------------------------------

---[FILE: twilio_sms.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/twilio_sms.mdx

```text
---
title: Twilio SMS
description: 发送短信消息
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="twilio_sms"
  color="#F22F46"
/>

{/* MANUAL-CONTENT-START:intro */}
[Twilio SMS](https://www.twilio.com/en-us/sms) 是一个强大的云通信平台，能够让企业将消息功能集成到其应用程序和服务中。

Twilio SMS 提供了一个强大的 API，用于以编程方式在全球范围内发送和接收短信。凭借覆盖 180 多个国家和 99.999% 的正常运行时间 SLA，Twilio 已成为通信技术领域的行业领导者。

Twilio SMS 的主要功能包括：

- **全球覆盖**：通过多个国家的本地电话号码向全球收件人发送消息
- **可编程消息**：通过 webhooks、送达回执和调度选项自定义消息传递
- **高级分析**：跟踪送达率、参与度指标，并优化您的消息传递活动

在 Sim 中，Twilio SMS 集成使您的代理能够将这些强大的消息功能作为其工作流程的一部分。这为复杂的客户参与场景创造了机会，例如预约提醒、验证码、警报和互动对话。该集成弥合了您的 AI 工作流程与客户通信渠道之间的差距，使您的代理能够将及时、相关的信息直接传递到用户的移动设备。通过将 Sim 与 Twilio SMS 连接，您可以构建智能代理，通过客户首选的通信渠道与他们互动，在自动化常规消息任务的同时提升用户体验。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Twilio 集成到工作流程中。可以发送 SMS 消息。

## 工具

### `twilio_send_sms`

使用 Twilio API 向单个或多个收件人发送短信。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `phoneNumbers` | 字符串 | 是 | 要发送消息的电话号码，用换行符分隔 |
| `message` | 字符串 | 是 | 要发送的消息 |
| `accountSid` | 字符串 | 是 | Twilio 账户 SID |
| `authToken` | 字符串 | 是 | Twilio 授权令牌 |
| `fromNumber` | 字符串 | 是 | 用于发送消息的 Twilio 电话号码 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | 布尔值 | 短信发送成功状态 |
| `messageId` | 字符串 | 唯一的 Twilio 消息标识符（SID） |
| `status` | 字符串 | 来自 Twilio 的消息传递状态 |
| `fromNumber` | 字符串 | 发送消息的电话号码 |
| `toNumber` | 字符串 | 接收消息的电话号码 |

## 注意事项

- 类别：`tools`
- 类型：`twilio_sms`
```

--------------------------------------------------------------------------------

---[FILE: twilio_voice.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/twilio_voice.mdx

```text
---
title: Twilio Voice
description: 进行和管理电话通话
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="twilio_voice"
  color="#F22F46"
/>

{/* MANUAL-CONTENT-START:intro */}
[Twilio Voice](https://www.twilio.com/en-us/voice) 是一个强大的云通信平台，企业可以通过简单的 API 编程实现拨打、接听和管理电话通话。

Twilio Voice 提供了一个强大的 API，用于构建具有全球覆盖范围的复杂语音应用程序。凭借覆盖 100 多个国家/地区的服务、运营商级的可靠性以及 99.95% 的正常运行时间 SLA，Twilio 已成为可编程语音通信领域的行业领导者。

Twilio Voice 的主要功能包括：

- **全球语音网络**：通过多个国家的本地电话号码拨打和接听全球电话
- **可编程呼叫控制**：使用 TwiML 控制呼叫流程、录制对话、收集 DTMF 输入并实现 IVR 系统
- **高级功能**：语音识别、文本转语音、呼叫转接、会议和语音信箱检测
- **实时分析**：跟踪通话质量、时长、成本，并优化语音应用程序

在 Sim 中，Twilio Voice 集成使您的代理能够将这些强大的语音功能作为其工作流程的一部分。这为复杂的客户参与场景创造了机会，例如预约提醒、验证电话、自动支持热线和交互式语音响应系统。该集成弥合了您的 AI 工作流程与语音通信渠道之间的差距，使您的代理能够通过电话直接传递及时、相关的信息。通过将 Sim 与 Twilio Voice 连接，您可以创建智能代理，通过客户首选的通信渠道与他们互动，在自动化日常呼叫任务的同时提升用户体验。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Twilio Voice 集成到工作流程中。进行外呼并获取通话录音。

## 工具

### `twilio_voice_make_call`

使用 Twilio Voice API 进行外呼。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `to` | string | 是 | 要拨打的电话号码 \(E.164 格式，例如：+14155551234\) |
| `from` | string | 是 | 您的 Twilio 电话号码（作为呼出号码）\(E.164 格式\) |
| `url` | string | 否 | 返回通话 TwiML 指令的 URL |
| `twiml` | string | 否 | 要执行的 TwiML 指令（URL 的替代选项）。使用方括号代替尖括号，例如：\[Response\]\[Say\]Hello\[/Say\]\[/Response\] |
| `statusCallback` | string | 否 | 通话状态更新的 Webhook URL |
| `statusCallbackMethod` | string | 否 | 状态回调的 HTTP 方法 \(GET 或 POST\) |
| `accountSid` | string | 是 | Twilio 账户 SID |
| `authToken` | string | 是 | Twilio 授权令牌 |
| `record` | boolean | 否 | 是否录制通话 |
| `recordingStatusCallback` | string | 否 | 录音状态更新的 Webhook URL |
| `timeout` | number | 否 | 等待接听的时间（秒，默认：60） |
| `machineDetection` | string | 否 | 应答机检测：启用或检测消息结束 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 通话是否成功发起 |
| `callSid` | string | 通话的唯一标识符 |
| `status` | string | 通话状态 \(排队中、响铃中、进行中、已完成等\) |
| `direction` | string | 通话方向 \(outbound-api\) |
| `from` | string | 通话的发起号码 |
| `to` | string | 通话的接收号码 |
| `duration` | number | 通话时长（秒） |
| `price` | string | 通话费用 |
| `priceUnit` | string | 费用的货币单位 |
| `error` | string | 如果通话失败的错误信息 |

### `twilio_voice_list_calls`

检索与账户相关的呼叫列表。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `accountSid` | string | 是 | Twilio 账户 SID |
| `authToken` | string | 是 | Twilio 验证令牌 |
| `to` | string | 否 | 按此电话号码筛选呼叫 |
| `from` | string | 否 | 按此电话号码筛选呼叫 |
| `status` | string | 否 | 按呼叫状态筛选（排队中、响铃中、进行中、已完成等） |
| `startTimeAfter` | string | 否 | 筛选从此日期开始的呼叫（YYYY-MM-DD） |
| `startTimeBefore` | string | 否 | 筛选在此日期之前的呼叫（YYYY-MM-DD） |
| `pageSize` | number | 否 | 返回的记录数（最大 1000，默认 50） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功检索到呼叫 |
| `calls` | array | 呼叫对象数组 |
| `total` | number | 返回的呼叫总数 |
| `page` | number | 当前页码 |
| `pageSize` | number | 每页的呼叫数 |
| `error` | string | 如果检索失败，显示错误信息 |

### `twilio_voice_get_recording`

检索呼叫录音信息及转录（如果通过 TwiML 启用）。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `recordingSid` | string | 是 | 要检索的录音 SID |
| `accountSid` | string | 是 | Twilio 账户 SID |
| `authToken` | string | 是 | Twilio 验证令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否成功检索到录音 |
| `recordingSid` | string | 录音的唯一标识符 |
| `callSid` | string | 此录音所属的通话 SID |
| `duration` | number | 录音的时长（以秒为单位） |
| `status` | string | 录音状态（已完成、处理中等） |
| `channels` | number | 通道数量（1 表示单声道，2 表示双声道） |
| `source` | string | 录音的创建方式 |
| `mediaUrl` | string | 下载录音媒体文件的 URL |
| `price` | string | 录音的费用 |
| `priceUnit` | string | 费用的货币类型 |
| `uri` | string | 录音资源的相对 URI |
| `transcriptionText` | string | 录音的转录文本（如果可用） |
| `transcriptionStatus` | string | 转录状态（已完成、进行中、失败） |
| `transcriptionPrice` | string | 转录的费用 |
| `transcriptionPriceUnit` | string | 转录费用的货币类型 |
| `error` | string | 如果检索失败的错误信息 |

## 注意事项

- 类别: `tools`
- 类型: `twilio_voice`
```

--------------------------------------------------------------------------------

---[FILE: typeform.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/typeform.mdx

```text
---
title: Typeform
description: 与 Typeform 互动
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="typeform"
  color="#262627"
/>

{/* MANUAL-CONTENT-START:intro */}
[Typeform](https://www.typeform.com/) 是一个用户友好的平台，用于创建注重用户体验的对话式表单、调查和测验。

使用 Typeform，您可以：

- **创建互动表单**：设计美观的对话式表单，通过独特的一次一问界面吸引受访者
- **自定义您的体验**：使用条件逻辑、隐藏字段和自定义主题，创建个性化的用户旅程
- **与其他工具集成**：通过原生集成和 API 连接 1000 多个应用程序
- **分析响应数据**：通过全面的分析和报告工具获取可操作的洞察

在 Sim 中，Typeform 集成使您的代理能够以编程方式将 Typeform 数据纳入其工作流程。代理可以检索表单响应、处理提交数据，并将用户反馈直接纳入决策过程。此集成在潜在客户资格审查、客户反馈分析和数据驱动的个性化场景中特别有价值。通过将 Sim 与 Typeform 连接，您可以创建智能自动化工作流程，将表单响应转化为可操作的洞察——分析情绪、分类反馈、生成摘要，甚至根据特定的响应模式触发后续操作。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Typeform 集成到工作流程中。可以检索响应、下载文件并获取表单洞察。可以在触发模式下使用，当提交表单时触发工作流程。需要 API 密钥。

## 工具

### `typeform_responses`

从 Typeform 检索表单响应

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `formId` | string | 是 | Typeform 表单 ID |
| `apiKey` | string | 是 | Typeform 个人访问令牌 |
| `pageSize` | number | 否 | 要检索的响应数量 \(默认值：25\) |
| `since` | string | 否 | 检索此日期之后提交的响应 \(ISO 8601 格式\) |
| `until` | string | 否 | 检索此日期之前提交的响应 \(ISO 8601 格式\) |
| `completed` | string | 否 | 按完成状态过滤 \(true/false\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `total_items` | number | 响应的总数 |
| `page_count` | number | 可用页面的总数 |
| `items` | array | 包含 response_id、submitted_at、answers 和 metadata 的响应对象数组 |

### `typeform_files`

下载 Typeform 响应中上传的文件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `formId` | string | 是 | Typeform 表单 ID |
| `responseId` | string | 是 | 包含文件的响应 ID |
| `fieldId` | string | 是 | 文件上传字段的唯一 ID |
| `filename` | string | 是 | 上传文件的文件名 |
| `inline` | boolean | 否 | 是否以内联 Content-Disposition 请求文件 |
| `apiKey` | string | 是 | Typeform 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `fileUrl` | string | 上传文件的直接下载 URL |
| `contentType` | string | 上传文件的 MIME 类型 |
| `filename` | string | 上传文件的原始文件名 |

### `typeform_insights`

获取 Typeform 表单的洞察和分析

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `formId` | string | 是 | Typeform 表单 ID |
| `apiKey` | string | 是 | Typeform 个人访问令牌 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `fields` | 数组 | 在此字段中流失的用户数量 |

### `typeform_list_forms`

检索 Typeform 帐户中所有表单的列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Typeform 个人访问令牌 |
| `search` | string | 否 | 按标题过滤表单的搜索查询 |
| `page` | number | 否 | 页码 \(默认值：1\) |
| `pageSize` | number | 否 | 每页表单数量 \(默认值：10，最大值：200\) |
| `workspaceId` | string | 否 | 按工作区 ID 过滤表单 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `total_items` | number | 账户中的表单总数 |
| `page_count` | number | 可用页面的总数 |
| `items` | array | 包含 id、title、created_at、last_updated_at、settings、theme 和 _links 的表单对象数组 |

### `typeform_get_form`

检索特定表单的完整详细信息和结构

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Typeform 个人访问令牌 |
| `formId` | string | 是 | 表单唯一标识符 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | string | 表单唯一标识符 |
| `title` | string | 表单标题 |
| `type` | string | 表单类型 \(form, quiz 等\) |
| `settings` | object | 表单设置，包括语言、进度条等 |
| `theme` | object | 主题引用 |
| `workspace` | object | 工作区引用 |
| `fields` | array | 表单字段/问题数组 |
| `welcome_screens` | array | 欢迎页面数组 |
| `thankyou_screens` | array | 感谢页面数组 |
| `_links` | object | 包括公共表单 URL 在内的相关资源链接 |

### `typeform_create_form`

创建一个包含字段和设置的新表单

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Typeform 个人访问令牌 |
| `title` | string | 是 | 表单标题 |
| `type` | string | 否 | 表单类型 \(默认值："form"\)。选项："form"，"quiz" |
| `workspaceId` | string | 否 | 创建表单的工作区 ID |
| `fields` | json | 否 | 定义表单结构的字段对象数组。每个字段需要：类型、标题和可选属性/验证 |
| `settings` | json | 否 | 表单设置对象 \(语言、进度条等\) |
| `themeId` | string | 否 | 应用于表单的主题 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | string | 创建的表单唯一标识符 |
| `title` | string | 表单标题 |
| `type` | string | 表单类型 |
| `fields` | array | 创建的表单字段数组 |
| `_links` | object | 包括公共表单 URL 在内的相关资源链接 |

### `typeform_update_form`

使用 JSON Patch 操作更新现有表单

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Typeform 个人访问令牌 |
| `formId` | string | 是 | 要更新的表单唯一标识符 |
| `operations` | json | 是 | JSON Patch 操作数组 \(RFC 6902\)。每个操作需要：op \(add/remove/replace\)、path 和 value \(用于 add/replace\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `id` | string | 更新的表单唯一标识符 |
| `title` | string | 表单标题 |
| `type` | string | 表单类型 |
| `settings` | object | 表单设置 |
| `theme` | object | 主题引用 |
| `workspace` | object | 工作区引用 |
| `fields` | array | 表单字段数组 |
| `welcome_screens` | array | 欢迎屏幕数组 |
| `thankyou_screens` | array | 感谢屏幕数组 |
| `_links` | object | 相关资源链接 |

### `typeform_delete_form`

永久删除表单及其所有响应

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | Typeform 个人访问令牌 |
| `formId` | string | 是 | 要删除的表单唯一标识符 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `deleted` | boolean | 表单是否成功删除 |
| `message` | string | 删除确认消息 |

## 注意事项

- 类别：`tools`
- 类型：`typeform`
```

--------------------------------------------------------------------------------

---[FILE: video_generator.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/video_generator.mdx

```text
---
title: 视频生成器
description: 使用 AI 从文本生成视频
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="video_generator"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
使用顶级提供商的尖端 AI 模型，通过文本提示生成视频。Sim 的视频生成器为您的工作流程带来了强大的创意视频合成功能——支持多种模型、纵横比、分辨率、摄像机控制、原生音频以及高级风格和一致性功能。

**支持的提供商和模型：**

- **[Runway Gen-4](https://research.runwayml.com/gen2/)** (Runway ML)：  
  Runway 是文本生成视频领域的先驱，以强大的模型（如 Gen-2、Gen-3 和 Gen-4）而闻名。最新的 [Gen-4](https://research.runwayml.com/gen2/) 模型（以及 Gen-4 Turbo，用于更快的结果）支持更逼真的运动、更高的世界一致性，以及角色、物体、风格和位置的视觉参考。支持 16:9、9:16 和 1:1 的纵横比，5–10 秒的时长，最高 4K 分辨率，风格预设，以及直接上传参考图像以实现一致的生成。Runway 为全球的电影制作人、工作室和内容创作者提供创意工具。

- **[Google Veo](https://deepmind.google/technologies/veo/)** (Google DeepMind)：  
  [Veo](https://deepmind.google/technologies/veo/) 是 Google 的下一代视频生成模型，提供高质量、原生音频的视频，分辨率高达 1080p，时长最长 16 秒。支持高级运动、电影效果和细腻的文本理解。Veo 可以生成带有内置声音的视频——激活原生音频以及无声片段。选项包括 16:9 的纵横比、可变时长、不同的模型（veo-3、veo-3.1）以及基于提示的控制。非常适合讲故事、广告、研究和创意构思。

- **[Luma Dream Machine](https://lumalabs.ai/dream-machine)** (Luma AI)：  
  [Dream Machine](https://lumalabs.ai/dream-machine) 能够从文本生成令人惊叹的逼真流畅视频。它结合了高级摄像机控制、电影摄影提示，并支持 ray-1 和 ray-2 模型。Dream Machine 支持精确的纵横比（16:9、9:16、1:1）、可变时长，以及摄像机路径的指定以实现复杂的视觉指导。Luma 因其突破性的视觉保真度而闻名，并得到了顶尖 AI 视觉研究人员的支持。

- **[MiniMax Hailuo-02](https://minimax.chat/)**（通过 [Fal.ai](https://fal.ai/)）：  
  [MiniMax Hailuo-02](https://minimax.chat/) 是一个先进的中文生成视频模型，可通过 [Fal.ai](https://fal.ai/) 在全球范围内使用。支持生成最长 16 秒的视频，可选择横屏或竖屏格式，并提供提示优化选项以提高清晰度和创造力。提供专业版和标准版接口，支持高分辨率（最高 1920×1080）。非常适合需要提示翻译和优化的创意项目、商业叙事以及快速原型设计视觉创意。

**如何选择：**  
根据您对质量、速度、时长、音频、成本和独特功能的需求选择提供商和模型。Runway 和 Veo 提供世界领先的真实感和电影级能力；Luma 擅长流畅的运动和摄像机控制；MiniMax 非常适合中文提示，并提供快速且经济实惠的访问。在选择工具时，请考虑参考支持、风格预设、音频需求和定价。

有关功能、限制、定价和模型进展的更多详细信息，请参阅上述每个提供商的官方文档。
{/* MANUAL-CONTENT-END */}

## 使用说明

使用领先的 AI 提供商从文本提示生成高质量视频。支持多种模型、纵横比、分辨率以及提供商特定功能，如世界一致性、摄像机控制和音频生成。

## 工具

### `video_runway`

使用 Runway Gen-4 生成具有世界一致性和视觉参考的视频

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | 是 | 视频提供商 \(runway\) |
| `apiKey` | string | 是 | Runway API 密钥 |
| `model` | string | 否 | Runway 模型：gen-4 \(默认，更高质量\) 或 gen-4-turbo \(更快\) |
| `prompt` | string | 是 | 描述要生成视频的文本提示 |
| `duration` | number | 否 | 视频时长（秒）\(5 或 10，默认：5\) |
| `aspectRatio` | string | 否 | 纵横比：16:9 \(横屏\)、9:16 \(竖屏\) 或 1:1 \(方形\) |
| `resolution` | string | 否 | 视频分辨率 \(720p 输出\)。注意：Gen-4 Turbo 本身以 720p 输出 |
| `visualReference` | json | 是 | Gen-4 所需的参考图像 \(UserFile 对象\)。Gen-4 仅支持图像到视频，不支持仅文本生成 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `videoUrl` | string | 生成的视频 URL |
| `videoFile` | json | 带有元数据的视频文件对象 |
| `duration` | number | 视频时长（秒） |
| `width` | number | 视频宽度（像素） |
| `height` | number | 视频高度（像素） |
| `provider` | string | 使用的提供商 \(runway\) |
| `model` | string | 使用的模型 |
| `jobId` | string | Runway 作业 ID |

### `video_veo`

使用 Google Veo 3/3.1 生成带有原生音频的视频

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | 是 | 视频提供商 \(veo\) |
| `apiKey` | string | 是 | Google Gemini API 密钥 |
| `model` | string | 否 | Veo 模型：veo-3 \(默认，最高质量\)、veo-3-fast \(更快\) 或 veo-3.1 \(最新\) |
| `prompt` | string | 是 | 描述要生成视频的文本提示 |
| `duration` | number | 否 | 视频时长（秒）\(4、6 或 8，默认：8\) |
| `aspectRatio` | string | 否 | 纵横比：16:9 \(横向\) 或 9:16 \(纵向\) |
| `resolution` | string | 否 | 视频分辨率：720p 或 1080p \(默认：1080p\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `videoUrl` | string | 生成的视频 URL |
| `videoFile` | json | 带有元数据的视频文件对象 |
| `duration` | number | 视频时长（秒） |
| `width` | number | 视频宽度（像素） |
| `height` | number | 视频高度（像素） |
| `provider` | string | 使用的提供商 \(veo\) |
| `model` | string | 使用的模型 |
| `jobId` | string | Veo 作业 ID |

### `video_luma`

使用 Luma Dream Machine 和高级摄像机控制生成视频

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | 是 | 视频提供者 \(luma\) |
| `apiKey` | string | 是 | Luma AI API 密钥 |
| `model` | string | 否 | Luma 模型：ray-2 \(默认\) |
| `prompt` | string | 是 | 描述要生成视频的文本提示 |
| `duration` | number | 否 | 视频时长（以秒为单位）\(5 或 9，默认：5\) |
| `aspectRatio` | string | 否 | 纵横比：16:9 \(横向\)，9:16 \(纵向\)，或 1:1 \(正方形\) |
| `resolution` | string | 否 | 视频分辨率：540p、720p 或 1080p \(默认：1080p\) |
| `cameraControl` | json | 否 | 摄像机控制作为概念对象数组。格式：\[\{ "key": "concept_name" \}\]。有效键：truck_left、truck_right、pan_left、pan_right、tilt_up、tilt_down、zoom_in、zoom_out、push_in、pull_out、orbit_left、orbit_right、crane_up、crane_down、static、handheld，以及 20 多种预定义选项 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `videoUrl` | string | 生成的视频 URL |
| `videoFile` | json | 带有元数据的视频文件对象 |
| `duration` | number | 视频时长（以秒为单位） |
| `width` | number | 视频宽度（以像素为单位） |
| `height` | number | 视频高度（以像素为单位） |
| `provider` | string | 使用的提供者 \(luma\) |
| `model` | string | 使用的模型 |
| `jobId` | string | Luma 作业 ID |

### `video_minimax`

通过 MiniMax 平台 API 使用 MiniMax Hailuo 生成具有高级真实感和提示优化的视频

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | 是 | 视频提供商 \(minimax\) |
| `apiKey` | string | 是 | 来自 platform.minimax.io 的 MiniMax API 密钥 |
| `model` | string | 否 | MiniMax 模型：hailuo-02 \(默认\) |
| `prompt` | string | 是 | 描述要生成视频的文本提示 |
| `duration` | number | 否 | 视频时长（秒）\(6 或 10，默认：6\) |
| `promptOptimizer` | boolean | 否 | 启用提示优化以获得更好的结果 \(默认：true\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `videoUrl` | string | 生成的视频 URL |
| `videoFile` | json | 带有元数据的视频文件对象 |
| `duration` | number | 视频时长（秒） |
| `width` | number | 视频宽度（像素） |
| `height` | number | 视频高度（像素） |
| `provider` | string | 使用的提供商 \(minimax\) |
| `model` | string | 使用的模型 |
| `jobId` | string | MiniMax 作业 ID |

### `video_falai`

通过 Fal.ai 平台生成视频，可访问多个模型，包括 Veo 3.1、Sora 2、Kling 2.5、MiniMax Hailuo 等

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | 是 | 视频提供商 \(falai\) |
| `apiKey` | string | 是 | Fal.ai API 密钥 |
| `model` | string | 是 | Fal.ai 模型：veo-3.1 \(Google Veo 3.1\)、sora-2 \(OpenAI Sora 2\)、kling-2.5-turbo-pro \(Kling 2.5 Turbo Pro\)、kling-2.1-pro \(Kling 2.1 Master\)、minimax-hailuo-2.3-pro \(MiniMax Hailuo Pro\)、minimax-hailuo-2.3-standard \(MiniMax Hailuo Standard\)、wan-2.1 \(WAN T2V\)、ltxv-0.9.8 \(LTXV 13B\) |
| `prompt` | string | 是 | 描述要生成视频的文本提示 |
| `duration` | number | 否 | 视频时长（秒）\(因模型而异\) |
| `aspectRatio` | string | 否 | 纵横比 \(因模型而异\)：16:9、9:16、1:1 |
| `resolution` | string | 否 | 视频分辨率 \(因模型而异\)：540p、720p、1080p |
| `promptOptimizer` | boolean | 否 | 启用 MiniMax 模型的提示优化 \(默认：true\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `videoUrl` | string | 生成的视频 URL |
| `videoFile` | json | 带有元数据的视频文件对象 |
| `duration` | number | 视频时长（秒） |
| `width` | number | 视频宽度（像素） |
| `height` | number | 视频高度（像素） |
| `provider` | string | 使用的提供者 \(falai\) |
| `model` | string | 使用的模型 |
| `jobId` | string | 任务 ID |

## 注意事项

- 类别: `tools`
- 类型: `video_generator`
```

--------------------------------------------------------------------------------

---[FILE: vision.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/vision.mdx

```text
---
title: 视觉
description: 使用视觉模型分析图像
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="vision"
  color="#4D5FFF"
/>

{/* MANUAL-CONTENT-START:intro */}
视觉是一款可以使用视觉模型分析图像的工具。

使用 Vision，您可以：

- **分析图像**：使用视觉模型分析图像
- **提取文本**：从图像中提取文本
- **识别对象**：识别图像中的对象
- **描述图像**：详细描述图像
- **生成图像**：从文本生成图像

在 Sim 中，Vision 集成使您的代理能够在工作流程中使用视觉模型分析图像。这为需要使用视觉模型分析图像的强大自动化场景提供了可能。您的代理可以使用视觉模型分析图像、从图像中提取文本、识别图像中的对象、详细描述图像以及从文本生成图像。此集成弥合了您的 AI 工作流程与图像分析需求之间的差距，实现了更复杂且以图像为中心的自动化。通过将 Sim 与 Vision 连接，您可以创建能够跟上最新信息的代理，提供更准确的响应，并为用户带来更多价值——这一切都无需人工干预或自定义代码。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Vision 集成到工作流程中。可以使用视觉模型分析图像。需要 API 密钥。

## 工具

### `vision_tool`

使用先进的视觉模型处理和分析图像。能够理解图像内容、提取文本、识别对象并提供详细的视觉描述。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `apiKey` | string | 是 | 所选模型提供商的 API 密钥 |
| `imageUrl` | string | 否 | 可公开访问的图片 URL |
| `imageFile` | file | 否 | 要分析的图片文件 |
| `model` | string | 否 | 要使用的视觉模型 \(gpt-4o, claude-3-opus-20240229 等\) |
| `prompt` | string | 否 | 用于图像分析的自定义提示 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 分析后的内容和图像的描述 |
| `model` | string | 用于分析的视觉模型 |
| `tokens` | number | 分析中使用的总 token 数 |
| `usage` | object | 详细的 token 使用情况分析 |

## 注意事项

- 类别：`tools`
- 类型：`vision`
```

--------------------------------------------------------------------------------

---[FILE: wealthbox.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/wealthbox.mdx

```text
---
title: Wealthbox
description: 与 Wealthbox 互动
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wealthbox"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Wealthbox](https://www.wealthbox.com/) 是一款专为财务顾问和财富管理专业人士设计的综合 CRM 平台。它为金融服务行业提供了一个集中化的系统，用于管理客户关系、跟踪互动以及组织业务工作流程。

使用 Wealthbox，您可以：

- **管理客户关系**：存储所有客户的详细联系信息、背景数据和关系历史记录
- **跟踪互动**：创建并维护关于会议、电话和其他客户接触点的笔记
- **组织任务**：安排和管理后续活动、截止日期以及重要的行动事项
- **记录工作流程**：保存客户沟通和业务流程的全面记录
- **访问客户数据**：通过有序的联系人管理和搜索功能快速检索信息
- **自动化后续跟进**：设置提醒并安排任务，以确保与客户的持续互动

在 Sim 中，Wealthbox 集成使您的代理能够通过 OAuth 身份验证无缝地与您的 CRM 数据交互。这支持强大的自动化场景，例如从会议记录中自动创建客户笔记、更新联系信息、安排后续任务以及检索客户详细信息以进行个性化沟通。您的代理可以读取现有的笔记、联系人和任务以了解客户历史，同时创建新条目以保持记录的最新状态。此集成弥合了您的 AI 工作流程与客户关系管理之间的差距，实现了自动化数据输入、智能客户洞察以及简化的行政流程，从而为更有价值的客户互动活动腾出时间。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Wealthbox 集成到工作流程中。可以读取和写入备注、读取和写入联系人，以及读取和写入任务。需要 OAuth 授权。

## 工具

### `wealthbox_read_note`

从 Wealthbox 笔记中读取内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `noteId` | string | 否 | 要读取的笔记的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 笔记数据和元数据 |

### `wealthbox_write_note`

创建或更新 Wealthbox 笔记

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `content` | string | 是 | 笔记的主要内容 |
| `contactId` | string | 否 | 要链接到此笔记的联系人的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建或更新的笔记数据和元数据 |

### `wealthbox_read_contact`

从 Wealthbox 联系人中读取内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `contactId` | string | 否 | 要读取的联系人的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 联系人数据和元数据 |

### `wealthbox_write_contact`

创建一个新的 Wealthbox 联系人

#### 输入

| 参数 | 类型 | 必填 | 描述 |
| --------- | ---- | -------- | ----------- |
| `firstName` | string | 是 | 联系人的名字 |
| `lastName` | string | 是 | 联系人的姓氏 |
| `emailAddress` | string | 否 | 联系人的电子邮件地址 |
| `backgroundInformation` | string | 否 | 联系人的背景信息 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 创建或更新的联系人数据和元数据 |

### `wealthbox_read_task`

读取 Wealthbox 任务的内容

#### 输入

| 参数 | 类型 | 必填 | 描述 |
| --------- | ---- | -------- | ----------- |
| `taskId` | string | 否 | 要读取的任务 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 操作成功状态 |
| `output` | object | 任务数据和元数据 |

### `wealthbox_write_task`

创建或更新一个 Wealthbox 任务

#### 输入

| 参数 | 类型 | 必填 | 描述 |
| --------- | ---- | -------- | ----------- |
| `title` | string | 是 | 任务的名称/标题 |
| `dueDate` | string | 是 | 任务的截止日期和时间 \(格式："YYYY-MM-DD HH:MM AM/PM -HHMM"，例如："2015-05-24 11:00 AM -0400"\) |
| `contactId` | string | 否 | 要链接到此任务的联系人 ID |
| `description` | string | 否 | 任务的描述或备注 |

#### 输出

| 参数       | 类型   | 描述                 |
| --------- | ---- | ------------------ |
| `success` | boolean | 操作成功状态         |
| `output` | object  | 创建或更新的任务数据及元数据 |

## 注意事项

- 类别：`tools`
- 类型：`wealthbox`
```

--------------------------------------------------------------------------------

---[FILE: webflow.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/webflow.mdx

```text
---
title: Webflow
description: 管理 Webflow CMS 集合
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="webflow"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Webflow](https://webflow.com/) 是一个强大的可视化网页设计平台，能够让您无需编写代码即可构建响应式网站。它结合了可视化设计界面和强大的 CMS（内容管理系统），使您能够为网站创建、管理和发布动态内容。

使用 Webflow，您可以：

- **可视化设计**：使用可视化编辑器创建自定义网站，该编辑器会生成干净、语义化的 HTML/CSS 代码
- **动态管理内容**：使用 CMS 创建结构化内容集合，例如博客文章、产品、团队成员或任何自定义数据
- **即时发布**：将您的网站部署到 Webflow 的托管服务，或导出代码以进行自定义托管
- **创建响应式设计**：构建在桌面、平板电脑和移动设备上无缝运行的网站
- **自定义集合**：为您的内容类型定义自定义字段和数据结构
- **自动更新内容**：通过 API 编程方式管理您的 CMS 内容

在 Sim 中，Webflow 集成使您的代理能够通过 API 身份验证无缝与 Webflow CMS 集合交互。这支持强大的自动化场景，例如从 AI 生成的内容中自动创建博客文章、更新产品信息、管理团队成员资料以及检索 CMS 项目以生成动态内容。您的代理可以列出现有项目以浏览内容，通过 ID 检索特定项目，创建新条目以添加新内容，更新现有项目以保持信息最新，以及删除过时内容。此集成弥合了您的 AI 工作流与 Webflow CMS 之间的差距，实现了自动化内容管理、动态网站更新和简化的内容工作流，使您的网站无需人工干预即可保持新鲜和最新。{/* MANUAL-CONTENT-END */}

## 使用说明

将 Webflow CMS 集成到工作流程中。可以创建、获取、列出、更新或删除 Webflow CMS 集合中的项目。以编程方式管理您的 Webflow 内容。可以在触发模式下使用，当集合项目发生变化或提交表单时触发工作流程。

## 工具

### `webflow_list_items`

列出 Webflow CMS 集合中的所有项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | Webflow 网站的 ID |
| `collectionId` | string | 是 | 集合的 ID |
| `offset` | number | 否 | 分页的偏移量（可选） |
| `limit` | number | 否 | 要返回的最大项目数（可选，默认值：100） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `items` | json | 集合项目的数组 |
| `metadata` | json | 查询的元数据 |

### `webflow_get_item`

从 Webflow CMS 集合中获取单个项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | Webflow 网站的 ID |
| `collectionId` | string | 是 | 集合的 ID |
| `itemId` | string | 是 | 要检索项目的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `item` | json | 检索到的项目对象 |
| `metadata` | json | 检索到的项目的元数据 |

### `webflow_create_item`

在 Webflow CMS 集合中创建一个新项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | Webflow 网站的 ID |
| `collectionId` | string | 是 | 集合的 ID |
| `fieldData` | json | 是 | 新项目的字段数据，格式为 JSON 对象。键名应与集合字段名匹配。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `item` | json | 创建的项目对象 |
| `metadata` | json | 关于创建项目的元数据 |

### `webflow_update_item`

更新 Webflow CMS 集合中的现有项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | Webflow 网站的 ID |
| `collectionId` | string | 是 | 集合的 ID |
| `itemId` | string | 是 | 要更新项目的 ID |
| `fieldData` | json | 是 | 要更新的字段数据，格式为 JSON 对象。仅包含需要更改的字段。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `item` | json | 更新的项目对象 |
| `metadata` | json | 关于更新项目的元数据 |

### `webflow_delete_item`

从 Webflow CMS 集合中删除项目

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `siteId` | string | 是 | Webflow 网站的 ID |
| `collectionId` | string | 是 | 集合的 ID |
| `itemId` | string | 是 | 要删除项目的 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | 是否删除成功 |
| `metadata` | json | 有关删除的元数据 |

## 注意

- 类别：`tools`
- 类型：`webflow`
```

--------------------------------------------------------------------------------

---[FILE: webhook.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/webhook.mdx

```text
---
title: Webhook
description: 从外部 Webhook 触发工作流执行
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="webhook"
  color="#10B981"
/>

## 注意事项

- 类别: `triggers`
- 类型: `webhook`
```

--------------------------------------------------------------------------------

---[FILE: whatsapp.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/whatsapp.mdx

```text
---
title: WhatsApp
description: 发送 WhatsApp 消息
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="whatsapp"
  color="#25D366"
/>

【手动内容开始：简介】
[WhatsApp](https://www.whatsapp.com/) 是一个全球流行的消息平台，能够在个人和企业之间实现安全、可靠的通信。

WhatsApp Business API 为组织提供了强大的功能，可以：

- **吸引客户**：直接向客户首选的消息应用发送个性化消息、通知和更新
- **自动化对话**：为常见问题创建交互式聊天机器人和自动响应系统
- **增强支持**：通过支持丰富媒体的熟悉界面提供实时客户服务
- **推动转化**：在安全、合规的环境中促进交易和跟进客户

在 Sim 中，WhatsApp 集成使您的代理能够将这些消息功能作为其工作流程的一部分。这为复杂的客户参与场景创造了机会，例如预约提醒、验证码、警报和交互式对话。该集成弥合了您的 AI 工作流程与客户通信渠道之间的差距，使您的代理能够直接向用户的移动设备传递及时、相关的信息。通过将 Sim 与 WhatsApp 连接，您可以构建智能代理，通过客户首选的消息平台与他们互动，在自动化常规消息任务的同时提升用户体验。
【手动内容结束】

## 使用说明

将 WhatsApp 集成到工作流程中。可以发送消息。

## 工具

### `whatsapp_send_message`

发送 WhatsApp 消息

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `phoneNumber` | string | 是 | 带国家代码的接收者电话号码 |
| `message` | string | 是 | 要发送的消息内容 |
| `phoneNumberId` | string | 是 | WhatsApp Business 电话号码 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `success` | boolean | WhatsApp 消息发送成功状态 |
| `messageId` | string | 唯一的 WhatsApp 消息标识符 |
| `phoneNumber` | string | 接收者电话号码 |
| `status` | string | 消息传递状态 |
| `timestamp` | string | 消息发送时间戳 |

## 注意事项

- 类别：`tools`
- 类型：`whatsapp`
```

--------------------------------------------------------------------------------

---[FILE: wikipedia.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/wikipedia.mdx

```text
---
title: Wikipedia
description: 搜索并检索 Wikipedia 的内容
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="wikipedia"
  color="#000000"
/>

{/* MANUAL-CONTENT-START:intro */}
[Wikipedia](https://www.wikipedia.org/) 是全球最大的免费在线百科全书，提供数百万篇涵盖广泛主题的文章，由志愿者协作撰写和维护。

使用 Wikipedia，您可以：

- **搜索文章**：通过关键词或主题查找相关的 Wikipedia 页面
- **获取文章摘要**：检索 Wikipedia 页面简明扼要的摘要以供快速参考
- **访问完整内容**：获取 Wikipedia 文章的完整内容以深入了解信息
- **发现随机文章**：通过检索随机的 Wikipedia 页面探索新主题

在 Sim 中，Wikipedia 集成使您的代理能够以编程方式访问和交互 Wikipedia 内容，作为其工作流程的一部分。代理可以搜索文章、获取摘要、检索完整页面内容以及发现随机文章，为您的自动化提供来自全球最大百科全书的最新可靠信息。此集成非常适合研究、内容丰富、事实核查和知识发现等场景，使您的代理能够无缝地将 Wikipedia 数据整合到决策和任务执行过程中。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Wikipedia 集成到工作流程中。可以获取页面摘要、搜索页面、获取页面内容以及获取随机页面。

## 工具

### `wikipedia_summary`

获取特定 Wikipedia 页面摘要和元数据。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `pageTitle` | string | 是 | 要获取摘要的 Wikipedia 页面标题 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `summary` | object | Wikipedia 页面摘要和元数据 |

### `wikipedia_search`

按标题或内容搜索 Wikipedia 页面。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | string | 是 | 用于查找 Wikipedia 页面的搜索查询 |
| `searchLimit` | number | 否 | 返回结果的最大数量 \(默认值: 10, 最大值: 50\) |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `searchResults` | array | 匹配的 Wikipedia 页面数组 |

### `wikipedia_content`

获取 Wikipedia 页面完整的 HTML 内容。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `pageTitle` | string | 是 | 要获取内容的 Wikipedia 页面标题 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | object | Wikipedia 页面完整的 HTML 内容和元数据 |

### `wikipedia_random`

获取一个随机的 Wikipedia 页面。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `randomPage` | object | 随机 Wikipedia 页面数据 |

## 注意

- 分类: `tools`
- 类型: `wikipedia`
```

--------------------------------------------------------------------------------

````
