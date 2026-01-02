---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 94
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 94 of 933)

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

---[FILE: telegram.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/telegram.mdx

```text
---
title: Telegram
description: Interact with Telegram
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="telegram"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Telegram](https://telegram.org) is a secure, cloud-based messaging platform that enables fast and reliable communication across devices and platforms. With over 700 million monthly active users, Telegram has established itself as one of the world's leading messaging services, known for its security, speed, and powerful API capabilities.

Telegram's Bot API provides a robust framework for creating automated messaging solutions and integrating communication features into applications. With support for rich media, inline keyboards, and custom commands, Telegram bots can facilitate sophisticated interaction patterns and automated workflows.

Learn how to create a webhook trigger in Sim that seamlessly initiates workflows from Telegram messages. This tutorial walks you through setting up a webhook, configuring it with Telegram's bot API, and triggering automated actions in real-time. Perfect for streamlining tasks directly from your chat!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/9oKcJtQ0_IM"
  title="Use Telegram with Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Learn how to use the Telegram Tool in Sim to seamlessly automate message delivery to any Telegram group. This tutorial walks you through integrating the tool into your workflow, configuring group messaging, and triggering automated updates in real-time. Perfect for enhancing communication directly from your workspace!

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/AG55LpUreGI"
  title="Use Telegram with Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Key features of Telegram include:

- Secure Communication: End-to-end encryption and secure cloud storage for messages and media
- Bot Platform: Powerful bot API for creating automated messaging solutions and interactive experiences
- Rich Media Support: Send and receive messages with text formatting, images, files, and interactive elements
- Global Reach: Connect with users worldwide with support for multiple languages and platforms

In Sim, the Telegram integration enables your agents to leverage these powerful messaging capabilities as part of their workflows. This creates opportunities for automated notifications, alerts, and interactive conversations through Telegram's secure messaging platform. The integration allows agents to send messages programmatically to individuals or channels, enabling timely communication and updates. By connecting Sim with Telegram, you can build intelligent agents that engage users through a secure and widely-adopted messaging platform, perfect for delivering notifications, updates, and interactive communications.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Telegram into the workflow. Can send and delete messages. Can be used in trigger mode to trigger a workflow when a message is sent to a chat.



## Tools

### `telegram_message`

Send messages to Telegram channels or users through the Telegram Bot API. Enables direct communication and notifications with message tracking and chat confirmation.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | Your Telegram Bot API Token |
| `chatId` | string | Yes | Target Telegram chat ID |
| `text` | string | Yes | Message text to send |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Telegram message data |

### `telegram_delete_message`

Delete messages in Telegram channels or chats through the Telegram Bot API. Requires the message ID of the message to delete.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | Your Telegram Bot API Token |
| `chatId` | string | Yes | Target Telegram chat ID |
| `messageId` | string | Yes | Message ID to delete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Delete operation result |

### `telegram_send_photo`

Send photos to Telegram channels or users through the Telegram Bot API.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | Your Telegram Bot API Token |
| `chatId` | string | Yes | Target Telegram chat ID |
| `photo` | string | Yes | Photo to send. Pass a file_id or HTTP URL |
| `caption` | string | No | Photo caption \(optional\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Telegram message data including optional photo\(s\) |

### `telegram_send_video`

Send videos to Telegram channels or users through the Telegram Bot API.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | Your Telegram Bot API Token |
| `chatId` | string | Yes | Target Telegram chat ID |
| `video` | string | Yes | Video to send. Pass a file_id or HTTP URL |
| `caption` | string | No | Video caption \(optional\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Telegram message data including optional media |

### `telegram_send_audio`

Send audio files to Telegram channels or users through the Telegram Bot API.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | Your Telegram Bot API Token |
| `chatId` | string | Yes | Target Telegram chat ID |
| `audio` | string | Yes | Audio file to send. Pass a file_id or HTTP URL |
| `caption` | string | No | Audio caption \(optional\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Telegram message data including voice/audio information |

### `telegram_send_animation`

Send animations (GIFs) to Telegram channels or users through the Telegram Bot API.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | Your Telegram Bot API Token |
| `chatId` | string | Yes | Target Telegram chat ID |
| `animation` | string | Yes | Animation to send. Pass a file_id or HTTP URL |
| `caption` | string | No | Animation caption \(optional\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Telegram message data including optional media |

### `telegram_send_document`

Send documents (PDF, ZIP, DOC, etc.) to Telegram channels or users through the Telegram Bot API.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | Yes | Your Telegram Bot API Token |
| `chatId` | string | Yes | Target Telegram chat ID |
| `files` | file[] | No | Document file to send \(PDF, ZIP, DOC, etc.\). Max size: 50MB |
| `caption` | string | No | Document caption \(optional\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Success or error message |
| `data` | object | Telegram message data including document |



## Notes

- Category: `tools`
- Type: `telegram`
```

--------------------------------------------------------------------------------

---[FILE: thinking.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/thinking.mdx

```text
---
title: Thinking
description: Forces model to outline its thought process.
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="thinking"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
The Thinking tool encourages AI models to engage in explicit reasoning before responding to complex queries. By providing a dedicated space for step-by-step analysis, this tool helps models break down problems, consider multiple perspectives, and arrive at more thoughtful conclusions.

Research has shown that prompting language models to "think step by step" can significantly improve their reasoning capabilities. According to [Anthropic's research on Claude's Think tool](https://www.anthropic.com/engineering/claude-think-tool), when models are given space to work through their reasoning explicitly, they demonstrate:

- **Improved problem-solving**: Breaking complex problems into manageable steps
- **Enhanced accuracy**: Reducing errors by carefully working through each component of a problem
- **Greater transparency**: Making the model's reasoning process visible and auditable
- **More nuanced responses**: Considering multiple angles before arriving at conclusions

In Sim, the Thinking tool creates a structured opportunity for your agents to engage in this kind of deliberate reasoning. By incorporating thinking steps into your workflows, you can help your agents tackle complex tasks more effectively, avoid common reasoning pitfalls, and produce higher-quality outputs. This is particularly valuable for tasks involving multi-step reasoning, complex decision-making, or situations where accuracy is critical.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Adds a step where the model explicitly outlines its thought process before proceeding. This can improve reasoning quality by encouraging step-by-step analysis.



## Tools

### `thinking_tool`

Processes a provided thought/instruction, making it available for subsequent steps.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `thought` | string | Yes | Your internal reasoning, analysis, or thought process. Use this to think through the problem step by step before responding. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `acknowledgedThought` | string | The thought that was processed and acknowledged |



## Notes

- Category: `tools`
- Type: `thinking`
```

--------------------------------------------------------------------------------

---[FILE: translate.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/translate.mdx

```text
---
title: Translate
description: Translate text to any language
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="translate"
  color="#FF4B4B"
/>

{/* MANUAL-CONTENT-START:intro */}
Translate is a tool that allows you to translate text between languages.

With Translate, you can:

- **Translate text**: Translate text between languages
- **Translate documents**: Translate documents between languages
- **Translate websites**: Translate websites between languages
- **Translate images**: Translate images between languages
- **Translate audio**: Translate audio between languages
- **Translate videos**: Translate videos between languages
- **Translate speech**: Translate speech between languages
- **Translate text**: Translate text between languages
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Translate into the workflow. Can translate text to any language.



## Tools

### `llm_chat`

Send a chat completion request to any supported LLM provider

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `model` | string | Yes | The model to use \(e.g., gpt-4o, claude-sonnet-4-5, gemini-2.0-flash\) |
| `systemPrompt` | string | No | System prompt to set the behavior of the assistant |
| `context` | string | Yes | The user message or context to send to the model |
| `apiKey` | string | No | API key for the provider \(uses platform key if not provided for hosted models\) |
| `temperature` | number | No | Temperature for response generation \(0-2\) |
| `maxTokens` | number | No | Maximum tokens in the response |
| `azureEndpoint` | string | No | Azure OpenAI endpoint URL |
| `azureApiVersion` | string | No | Azure OpenAI API version |
| `vertexProject` | string | No | Google Cloud project ID for Vertex AI |
| `vertexLocation` | string | No | Google Cloud location for Vertex AI \(defaults to us-central1\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `content` | string | The generated response content |
| `model` | string | The model used for generation |
| `tokens` | object | Token usage information |



## Notes

- Category: `tools`
- Type: `translate`
```

--------------------------------------------------------------------------------

---[FILE: trello.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/trello.mdx

```text
---
title: Trello
description: Manage Trello boards and cards
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="trello"
  color="#0052CC"
/>

{/* MANUAL-CONTENT-START:intro */}
[Trello](https://trello.com) is a visual collaboration tool that helps you organize projects, tasks, and workflows using boards, lists, and cards.

With Trello in Sim, you can:

- **List boards and lists**: View the boards you have access to and their associated lists.
- **List and search cards**: Retrieve all cards on a board or filter by list to see their content and status.
- **Create cards**: Add new cards to a Trello list, including descriptions, labels, and due dates.
- **Update and move cards**: Edit card properties, move cards across lists, and set due dates or labels.
- **Get recent activity**: Retrieve actions and activity history for boards and cards.
- **Comment on cards**: Add comments to cards for collaboration and tracking.

Integrating Trello with Sim empowers your agents to manage your team’s tasks, boards, and projects programmatically. Automate project management workflows, keep task lists up-to-date, synchronize with other tools, or trigger intelligent workflows in response to Trello events—all through your AI agents.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate with Trello to manage boards and cards. List boards, list cards, create cards, update cards, get actions, and add comments.



## Tools

### `trello_list_lists`

List all lists on a Trello board

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | Yes | ID of the board to list lists from |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `lists` | array | Array of list objects with id, name, closed, pos, and idBoard |
| `count` | number | Number of lists returned |

### `trello_list_cards`

List all cards on a Trello board

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | Yes | ID of the board to list cards from |
| `listId` | string | No | Optional: Filter cards by list ID |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `cards` | array | Array of card objects with id, name, desc, url, board/list IDs, labels, and due date |
| `count` | number | Number of cards returned |

### `trello_create_card`

Create a new card on a Trello board

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | Yes | ID of the board to create the card on |
| `listId` | string | Yes | ID of the list to create the card in |
| `name` | string | Yes | Name/title of the card |
| `desc` | string | No | Description of the card |
| `pos` | string | No | Position of the card \(top, bottom, or positive float\) |
| `due` | string | No | Due date \(ISO 8601 format\) |
| `labels` | string | No | Comma-separated list of label IDs |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `card` | object | The created card object with id, name, desc, url, and other properties |

### `trello_update_card`

Update an existing card on Trello

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `cardId` | string | Yes | ID of the card to update |
| `name` | string | No | New name/title of the card |
| `desc` | string | No | New description of the card |
| `closed` | boolean | No | Archive/close the card \(true\) or reopen it \(false\) |
| `idList` | string | No | Move card to a different list |
| `due` | string | No | Due date \(ISO 8601 format\) |
| `dueComplete` | boolean | No | Mark the due date as complete |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `card` | object | The updated card object with id, name, desc, url, and other properties |

### `trello_get_actions`

Get activity/actions from a board or card

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | No | ID of the board to get actions from \(either boardId or cardId required\) |
| `cardId` | string | No | ID of the card to get actions from \(either boardId or cardId required\) |
| `filter` | string | No | Filter actions by type \(e.g., "commentCard,updateCard,createCard" or "all"\) |
| `limit` | number | No | Maximum number of actions to return \(default: 50, max: 1000\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `actions` | array | Array of action objects with type, date, member, and data |
| `count` | number | Number of actions returned |

### `trello_add_comment`

Add a comment to a Trello card

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `cardId` | string | Yes | ID of the card to comment on |
| `text` | string | Yes | Comment text |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `comment` | object | The created comment object with id, text, date, and member creator |



## Notes

- Category: `tools`
- Type: `trello`
```

--------------------------------------------------------------------------------

---[FILE: tts.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/tts.mdx

```text
---
title: Text-to-Speech
description: Convert text to speech using AI voices
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="tts"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Convert text to natural-sounding speech using the latest AI voices. Sim's Text-to-Speech (TTS) tools let you generate audio from written text in dozens of languages, with a choice of expressive voices, formats, and advanced controls like speed, style, emotion, and more.

**Supported Providers & Models:**

- **[OpenAI Text-to-Speech](https://platform.openai.com/docs/guides/text-to-speech/voice-options)** (OpenAI):  
  OpenAI's TTS API offers ultra-realistic voices using advanced AI models like `tts-1`, `tts-1-hd`, and `gpt-4o-mini-tts`. Voices include both male and female, with options such as alloy, echo, fable, onyx, nova, shimmer, ash, ballad, coral, sage, and verse. Supports multiple audio formats (mp3, opus, aac, flac, wav, pcm), adjustable speed and streaming synthesis.

- **[Deepgram Aura](https://deepgram.com/products/text-to-speech)** (Deepgram Inc.):  
  Deepgram’s Aura provides expressive English and multilingual AI voices, optimized for conversational clarity, low latency, and customization. Models like `aura-asteria-en`, `aura-luna-en`, and others are available. Supports multiple encoding formats (linear16, mp3, opus, aac, flac) and fine tuning on speed, sample rate, and style.

- **[ElevenLabs Text-to-Speech](https://elevenlabs.io/text-to-speech)** (ElevenLabs):  
  ElevenLabs leads in lifelike, emotionally rich TTS, offering dozens of voices in 29+ languages and the ability to clone custom voices. Models support voice design, speech synthesis, and direct API access, with advanced controls for style, emotion, stability, and similarity. Suitable for audiobooks, content creation, accessibility, and more.

- **[Cartesia TTS](https://docs.cartesia.ai/)** (Cartesia):  
  Cartesia offers high-quality, fast, and secure text-to-speech with a focus on privacy and flexible deployment. It provides instant streaming, real-time synthesis, and supports multiple international voices and accents, accessible through a simple API.

- **[Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)** (Google Cloud):  
  Google uses DeepMind WaveNet and Neural2 models to power high-fidelity voices in 50+ languages and variants. Features include voice selection, pitch, speaking rate, volume control, SSML tags, and access to both standard and studio-grade premium voices. Widely used for accessibility, IVR, and media.

- **[Microsoft Azure Speech](https://azure.microsoft.com/en-us/products/ai-services/text-to-speech)** (Microsoft Azure):  
  Azure provides over 400 neural voices across 140+ languages and locales, with unique voice customization, style, emotion, role, and real-time controls. Offers SSML support for pronunciation, intonation, and more. Ideal for global, enterprise, or creative TTS needs.

- **[PlayHT](https://play.ht/)** (PlayHT):  
  PlayHT specializes in realistic voice synthesis, voice cloning, and instant streaming playback with 800+ voices in over 100 languages. Features include emotion, pitch and speed controls, multi-voice audio, and custom voice creation via the API or online studio.

**How to Choose:**  
Pick your provider and model by prioritizing languages, supported voice types, desired formats (mp3, wav, etc.), control granularity (speed, emotion, etc.), and specialized features (voice cloning, accent, streaming). For creative, accessibility, or developer use cases, ensure compatibility with your application's requirements and compare costs.

Visit each provider’s official site for up-to-date capabilities, pricing, and documentation details!
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Generate natural-sounding speech from text using state-of-the-art AI voices from OpenAI, Deepgram, ElevenLabs, Cartesia, Google Cloud, Azure, and PlayHT. Supports multiple voices, languages, and audio formats.



## Tools

### `tts_openai`

Convert text to speech using OpenAI TTS models

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Yes | The text to convert to speech |
| `apiKey` | string | Yes | OpenAI API key |
| `model` | string | No | TTS model to use \(tts-1, tts-1-hd, or gpt-4o-mini-tts\) |
| `voice` | string | No | Voice to use \(alloy, ash, ballad, cedar, coral, echo, marin, sage, shimmer, verse\) |
| `responseFormat` | string | No | Audio format \(mp3, opus, aac, flac, wav, pcm\) |
| `speed` | number | No | Speech speed \(0.25 to 4.0, default: 1.0\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL to the generated audio file |
| `audioFile` | file | Generated audio file object |
| `duration` | number | Audio duration in seconds |
| `characterCount` | number | Number of characters processed |
| `format` | string | Audio format |
| `provider` | string | TTS provider used |

### `tts_deepgram`

Convert text to speech using Deepgram Aura

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Yes | The text to convert to speech |
| `apiKey` | string | Yes | Deepgram API key |
| `model` | string | No | Deepgram model/voice \(e.g., aura-asteria-en, aura-luna-en\) |
| `voice` | string | No | Voice identifier \(alternative to model param\) |
| `encoding` | string | No | Audio encoding \(linear16, mp3, opus, aac, flac\) |
| `sampleRate` | number | No | Sample rate \(8000, 16000, 24000, 48000\) |
| `bitRate` | number | No | Bit rate for compressed formats |
| `container` | string | No | Container format \(none, wav, ogg\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL to the generated audio file |
| `audioFile` | file | Generated audio file object |
| `duration` | number | Audio duration in seconds |
| `characterCount` | number | Number of characters processed |
| `format` | string | Audio format |
| `provider` | string | TTS provider used |

### `tts_elevenlabs`

Convert text to speech using ElevenLabs voices

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Yes | The text to convert to speech |
| `voiceId` | string | Yes | The ID of the voice to use |
| `apiKey` | string | Yes | ElevenLabs API key |
| `modelId` | string | No | Model to use \(e.g., eleven_monolingual_v1, eleven_turbo_v2_5, eleven_flash_v2_5\) |
| `stability` | number | No | Voice stability \(0.0 to 1.0, default: 0.5\) |
| `similarityBoost` | number | No | Similarity boost \(0.0 to 1.0, default: 0.8\) |
| `style` | number | No | Style exaggeration \(0.0 to 1.0\) |
| `useSpeakerBoost` | boolean | No | Use speaker boost \(default: true\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL to the generated audio file |
| `audioFile` | file | Generated audio file object |
| `duration` | number | Audio duration in seconds |
| `characterCount` | number | Number of characters processed |
| `format` | string | Audio format |
| `provider` | string | TTS provider used |

### `tts_cartesia`

Convert text to speech using Cartesia Sonic (ultra-low latency)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Yes | The text to convert to speech |
| `apiKey` | string | Yes | Cartesia API key |
| `modelId` | string | No | Model ID \(sonic-english, sonic-multilingual\) |
| `voice` | string | No | Voice ID or embedding |
| `language` | string | No | Language code \(en, es, fr, de, it, pt, etc.\) |
| `outputFormat` | json | No | Output format configuration \(container, encoding, sampleRate\) |
| `speed` | number | No | Speed multiplier |
| `emotion` | array | No | Emotion tags for Sonic-3 \(e.g., \['positivity:high'\]\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL to the generated audio file |
| `audioFile` | file | Generated audio file object |
| `duration` | number | Audio duration in seconds |
| `characterCount` | number | Number of characters processed |
| `format` | string | Audio format |
| `provider` | string | TTS provider used |

### `tts_google`

Convert text to speech using Google Cloud Text-to-Speech

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Yes | The text to convert to speech |
| `apiKey` | string | Yes | Google Cloud API key |
| `voiceId` | string | No | Voice ID \(e.g., en-US-Neural2-A, en-US-Wavenet-D\) |
| `languageCode` | string | Yes | Language code \(e.g., en-US, es-ES, fr-FR\) |
| `gender` | string | No | Voice gender \(MALE, FEMALE, NEUTRAL\) |
| `audioEncoding` | string | No | Audio encoding \(LINEAR16, MP3, OGG_OPUS, MULAW, ALAW\) |
| `speakingRate` | number | No | Speaking rate \(0.25 to 2.0, default: 1.0\) |
| `pitch` | number | No | Voice pitch \(-20.0 to 20.0, default: 0.0\) |
| `volumeGainDb` | number | No | Volume gain in dB \(-96.0 to 16.0\) |
| `sampleRateHertz` | number | No | Sample rate in Hz |
| `effectsProfileId` | array | No | Effects profile \(e.g., \['headphone-class-device'\]\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL to the generated audio file |
| `audioFile` | file | Generated audio file object |
| `duration` | number | Audio duration in seconds |
| `characterCount` | number | Number of characters processed |
| `format` | string | Audio format |
| `provider` | string | TTS provider used |

### `tts_azure`

Convert text to speech using Azure Cognitive Services

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Yes | The text to convert to speech |
| `apiKey` | string | Yes | Azure Speech Services API key |
| `voiceId` | string | No | Voice ID \(e.g., en-US-JennyNeural, en-US-GuyNeural\) |
| `region` | string | No | Azure region \(e.g., eastus, westus, westeurope\) |
| `outputFormat` | string | No | Output audio format |
| `rate` | string | No | Speaking rate \(e.g., +10%, -20%, 1.5\) |
| `pitch` | string | No | Voice pitch \(e.g., +5Hz, -2st, low\) |
| `style` | string | No | Speaking style \(e.g., cheerful, sad, angry - neural voices only\) |
| `styleDegree` | number | No | Style intensity \(0.01 to 2.0\) |
| `role` | string | No | Role \(e.g., Girl, Boy, YoungAdultFemale\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL to the generated audio file |
| `audioFile` | file | Generated audio file object |
| `duration` | number | Audio duration in seconds |
| `characterCount` | number | Number of characters processed |
| `format` | string | Audio format |
| `provider` | string | TTS provider used |

### `tts_playht`

Convert text to speech using PlayHT (voice cloning)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `text` | string | Yes | The text to convert to speech |
| `apiKey` | string | Yes | PlayHT API key \(AUTHORIZATION header\) |
| `userId` | string | Yes | PlayHT user ID \(X-USER-ID header\) |
| `voice` | string | No | Voice ID or manifest URL |
| `quality` | string | No | Quality level \(draft, standard, premium\) |
| `outputFormat` | string | No | Output format \(mp3, wav, ogg, flac, mulaw\) |
| `speed` | number | No | Speed multiplier \(0.5 to 2.0\) |
| `temperature` | number | No | Creativity/randomness \(0.0 to 2.0\) |
| `voiceGuidance` | number | No | Voice stability \(1.0 to 6.0\) |
| `textGuidance` | number | No | Text adherence \(1.0 to 6.0\) |
| `sampleRate` | number | No | Sample rate \(8000, 16000, 22050, 24000, 44100, 48000\) |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `audioUrl` | string | URL to the generated audio file |
| `audioFile` | file | Generated audio file object |
| `duration` | number | Audio duration in seconds |
| `characterCount` | number | Number of characters processed |
| `format` | string | Audio format |
| `provider` | string | TTS provider used |



## Notes

- Category: `tools`
- Type: `tts`
```

--------------------------------------------------------------------------------

---[FILE: twilio_sms.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/twilio_sms.mdx

```text
---
title: Twilio SMS
description: Send SMS messages
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="twilio_sms"
  color="#F22F46"
/>

{/* MANUAL-CONTENT-START:intro */}
[Twilio SMS](https://www.twilio.com/en-us/sms) is a powerful cloud communications platform that enables businesses to integrate messaging capabilities into their applications and services.

Twilio SMS provides a robust API for programmatically sending and receiving text messages globally. With coverage in over 180 countries and a 99.999% uptime SLA, Twilio has established itself as an industry leader in communications technology.

Key features of Twilio SMS include:

- **Global Reach**: Send messages to recipients worldwide with local phone numbers in multiple countries
- **Programmable Messaging**: Customize message delivery with webhooks, delivery receipts, and scheduling options
- **Advanced Analytics**: Track delivery rates, engagement metrics, and optimize your messaging campaigns

In Sim, the Twilio SMS integration enables your agents to leverage these powerful messaging capabilities as part of their workflows. This creates opportunities for sophisticated customer engagement scenarios like appointment reminders, verification codes, alerts, and interactive conversations. The integration bridges the gap between your AI workflows and customer communication channels, allowing your agents to deliver timely, relevant information directly to users' mobile devices. By connecting Sim with Twilio SMS, you can build intelligent agents that engage customers through their preferred communication channel, enhancing user experience while automating routine messaging tasks.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Twilio into the workflow. Can send SMS messages.



## Tools

### `twilio_send_sms`

Send text messages to single or multiple recipients using the Twilio API.

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `phoneNumbers` | string | Yes | Phone numbers to send the message to, separated by newlines |
| `message` | string | Yes | Message to send |
| `accountSid` | string | Yes | Twilio Account SID |
| `authToken` | string | Yes | Twilio Auth Token |
| `fromNumber` | string | Yes | Twilio phone number to send the message from |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `success` | boolean | SMS send success status |
| `messageId` | string | Unique Twilio message identifier \(SID\) |
| `status` | string | Message delivery status from Twilio |
| `fromNumber` | string | Phone number message was sent from |
| `toNumber` | string | Phone number message was sent to |



## Notes

- Category: `tools`
- Type: `twilio_sms`
```

--------------------------------------------------------------------------------

````
