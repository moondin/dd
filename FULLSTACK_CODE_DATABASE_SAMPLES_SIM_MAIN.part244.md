---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 244
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 244 of 933)

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
Location: sim-main/apps/docs/content/docs/zh/tools/stt.mdx

```text
---
title: 语音转文字
description: 使用 AI 将语音转换为文字
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="stt"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
使用来自世界一流提供商的最新 AI 模型，将语音转录为文本。Sim 的语音转文本 (STT) 工具使您能够将音频和视频转换为准确、带时间戳的转录文本，并可选择翻译支持多种语言，同时提供高级功能，如分角色对话和说话人识别。

**支持的提供商和模型：**

- **[OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text/overview)** (OpenAI)：  
  OpenAI 的 Whisper 是一个开源的深度学习模型，以其在多语言和多音频条件下的强大性能而闻名。它支持高级模型，例如 `whisper-1`，在转录、翻译以及需要高模型泛化能力的任务中表现出色。Whisper 由以 ChatGPT 和领先 AI 研究闻名的 OpenAI 提供支持，广泛用于研究领域并作为比较评估的基准。

- **[Deepgram](https://deepgram.com/)** (Deepgram Inc.)：  
  总部位于旧金山的 Deepgram 为开发者和企业提供可扩展的、生产级的语音识别 API。Deepgram 的模型包括 `nova-3`、`nova-2` 和 `whisper-large`，提供实时和批量转录，具有行业领先的准确性、多语言支持、自动标点、智能分角色对话、通话分析以及从电话到媒体制作的多种应用场景功能。

- **[ElevenLabs](https://elevenlabs.io/)** (ElevenLabs)：  
  作为语音 AI 的领导者，ElevenLabs 尤其以其高质量的语音合成和识别而闻名。其 STT 产品能够高精度、自然地理解多种语言、方言和口音。最新的 ElevenLabs STT 模型针对清晰度和说话人区分进行了优化，适用于创意和无障碍场景。ElevenLabs 因其在 AI 驱动的语音技术方面的尖端进展而备受认可。

- **[AssemblyAI](https://www.assemblyai.com/)** (AssemblyAI Inc.)：  
  AssemblyAI 提供基于 API 的高精度语音识别，功能包括自动章节划分、主题检测、摘要生成、情感分析和内容审核等。其专有模型，包括备受赞誉的 `Conformer-2`，为行业内一些最大的媒体、呼叫中心和合规应用提供支持。AssemblyAI 得到了全球财富 500 强企业和领先 AI 初创公司的信赖。

- **[Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)** (Google Cloud):  
  Google 的企业级语音转文字 API 支持超过 125 种语言和变体，提供高精度以及实时流式传输、单词级置信度、说话人分离、自动标点、自定义词汇和领域特定调优等功能。可用的模型包括 `latest_long`、`video` 以及领域优化模型，这些模型基于 Google 多年的研究成果，具备全球扩展能力。

- **[AWS Transcribe](https://aws.amazon.com/transcribe/)** (Amazon Web Services):  
  AWS Transcribe 利用 Amazon 的云基础设施，通过 API 提供强大的语音识别功能。它支持多种语言，并提供说话人识别、自定义词汇、通道识别（适用于呼叫中心音频）和医疗特定转录等功能。常用模型包括 `standard` 以及领域特定变体。AWS Transcribe 非常适合已经使用 Amazon 云服务的组织。

**如何选择：**  
选择适合您应用的提供商和模型——无论您需要快速、企业级的转录和额外分析（Deepgram、AssemblyAI、Google、AWS），高灵活性和开源访问（OpenAI Whisper），还是高级的说话人/上下文理解（ElevenLabs）。请考虑定价、语言覆盖范围、准确性以及您可能需要的任何特殊功能（如摘要、章节划分或情感分析）。

有关功能、定价、功能亮点和微调选项的更多详细信息，请参阅上述链接中的每个提供商的官方文档。
{/* MANUAL-CONTENT-END */}

## 使用说明

使用领先的 AI 提供商将音频和视频文件转录为文本。支持多种语言、时间戳和说话人分离。

## 工具

### `stt_whisper`

使用 OpenAI Whisper 将音频转录为文本

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | 是 | STT 提供商 \(whisper\) |
| `apiKey` | string | 是 | OpenAI API 密钥 |
| `model` | string | 否 | 要使用的 Whisper 模型 \(默认值：whisper-1\) |
| `audioFile` | file | 否 | 要转录的音频或视频文件 |
| `audioFileReference` | file | 否 | 来自前面模块的音频/视频文件引用 |
| `audioUrl` | string | 否 | 音频或视频文件的 URL |
| `language` | string | 否 | 语言代码 \(例如 "en", "es", "fr"\) 或 "auto" 进行自动检测 |
| `timestamps` | string | 否 | 时间戳粒度：无、句子或单词 |
| `translateToEnglish` | boolean | 否 | 将音频翻译为英语 |
| `prompt` | string | 否 | 可选文本，用于指导模型的风格或继续前一个音频片段。帮助处理专有名词和上下文。 |
| `temperature` | number | 否 | 采样温度，范围为 0 到 1。较高的值使输出更随机，较低的值使输出更集中和确定性。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `transcript` | string | 完整的转录文本 |
| `segments` | array | 带时间戳的片段 |
| `language` | string | 检测到的或指定的语言 |
| `duration` | number | 音频时长（以秒为单位） |

### `stt_deepgram`

使用 Deepgram 将音频转录为文本

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | 是 | STT 提供商 \(deepgram\) |
| `apiKey` | string | 是 | Deepgram API 密钥 |
| `model` | string | 否 | 要使用的 Deepgram 模型 \(nova-3, nova-2, whisper-large 等\) |
| `audioFile` | file | 否 | 要转录的音频或视频文件 |
| `audioFileReference` | file | 否 | 来自前面模块的音频/视频文件引用 |
| `audioUrl` | string | 否 | 音频或视频文件的 URL |
| `language` | string | 否 | 语言代码 \(例如："en", "es", "fr"\) 或 "auto" 进行自动检测 |
| `timestamps` | string | 否 | 时间戳粒度：无、句子或单词 |
| `diarization` | boolean | 否 | 启用说话人分离 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `transcript` | string | 完整的转录文本 |
| `segments` | array | 带有说话人标签的时间戳片段 |
| `language` | string | 检测到的或指定的语言 |
| `duration` | number | 音频时长（以秒为单位） |
| `confidence` | number | 总体置信度评分 |

### `stt_elevenlabs`

使用 ElevenLabs 将音频转录为文本

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | 是 | STT 提供商 \(elevenlabs\) |
| `apiKey` | string | 是 | ElevenLabs API 密钥 |
| `model` | string | 否 | 要使用的 ElevenLabs 模型 \(scribe_v1, scribe_v1_experimental\) |
| `audioFile` | file | 否 | 要转录的音频或视频文件 |
| `audioFileReference` | file | 否 | 来自前面模块的音频/视频文件引用 |
| `audioUrl` | string | 否 | 音频或视频文件的 URL |
| `language` | string | 否 | 语言代码 \(例如 "en", "es", "fr"\) 或 "auto" 进行自动检测 |
| `timestamps` | string | 否 | 时间戳粒度：无、句子或单词 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `transcript` | string | 完整的转录文本 |
| `segments` | array | 带时间戳的片段 |
| `language` | string | 检测到或指定的语言 |
| `duration` | number | 音频时长（秒） |
| `confidence` | number | 总体置信度评分 |

### `stt_assemblyai`

使用 AssemblyAI 和高级 NLP 功能将音频转录为文本

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | 是 | STT 提供商 \(assemblyai\) |
| `apiKey` | string | 是 | AssemblyAI API 密钥 |
| `model` | string | 否 | 要使用的 AssemblyAI 模型 \(默认：best\) |
| `audioFile` | file | 否 | 要转录的音频或视频文件 |
| `audioFileReference` | file | 否 | 来自前面模块的音频/视频文件引用 |
| `audioUrl` | string | 否 | 音频或视频文件的 URL |
| `language` | string | 否 | 语言代码 \(例如 "en", "es", "fr"\) 或 "auto" 进行自动检测 |
| `timestamps` | string | 否 | 时间戳粒度：无、句子或单词 |
| `diarization` | boolean | 否 | 启用说话人分离 |
| `sentiment` | boolean | 否 | 启用情感分析 |
| `entityDetection` | boolean | 否 | 启用实体检测 |
| `piiRedaction` | boolean | 否 | 启用 PII 涂黑 |
| `summarization` | boolean | 否 | 启用自动摘要 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `transcript` | string | 完整的转录文本 |
| `segments` | array | 带有说话人标签的时间戳片段 |
| `language` | string | 检测到或指定的语言 |
| `duration` | number | 音频时长（秒） |
| `confidence` | number | 总体置信度评分 |
| `sentiment` | array | 情感分析结果 |
| `entities` | array | 检测到的实体 |
| `summary` | string | 自动生成的摘要 |

### `stt_gemini`

使用具有多模态功能的 Google Gemini 将音频转录为文本

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `provider` | string | 是 | STT 提供商 \(gemini\) |
| `apiKey` | string | 是 | Google API 密钥 |
| `model` | string | 否 | 要使用的 Gemini 模型 \(默认值：gemini-2.5-flash\) |
| `audioFile` | file | 否 | 要转录的音频或视频文件 |
| `audioFileReference` | file | 否 | 来自前面模块的音频/视频文件引用 |
| `audioUrl` | string | 否 | 音频或视频文件的 URL |
| `language` | string | 否 | 语言代码 \(例如："en", "es", "fr"\) 或 "auto" 进行自动检测 |
| `timestamps` | string | 否 | 时间戳粒度：无、句子或单词 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `transcript` | string | 完整的转录文本 |
| `segments` | array | 带时间戳的片段 |
| `language` | string | 检测到或指定的语言 |
| `duration` | number | 音频时长（秒） |
| `confidence` | number | 总体置信度评分 |

## 注意

- 类别：`tools`
- 类型：`stt`
```

--------------------------------------------------------------------------------

---[FILE: supabase.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/supabase.mdx

```text
---
title: Supabase
description: 使用 Supabase 数据库
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="supabase"
  color="#1C1C1C"
/>

{/* MANUAL-CONTENT-START:intro */}
[Supabase](https://www.supabase.com/) 是一个强大的开源后端即服务平台，为开发者提供了一套工具，用于构建、扩展和管理现代应用程序。Supabase 提供了完全托管的 [PostgreSQL](https://www.postgresql.org/) 数据库、强大的身份验证、即时的 RESTful 和 GraphQL API、实时订阅、文件存储以及边缘函数——所有功能都通过统一且对开发者友好的界面访问。其开源特性和对流行框架的兼容性使其成为 Firebase 的一个有吸引力的替代方案，同时还具有 SQL 的灵活性和透明性。

**为什么选择 Supabase？**
- **即时 API：** 数据库中的每个表和视图都可以通过 REST 和 GraphQL 端点即时访问，无需编写自定义后端代码即可轻松构建数据驱动的应用程序。
- **实时数据：** Supabase 支持实时订阅，使您的应用程序能够对数据库中的更改即时作出反应。
- **身份验证与授权：** 内置用户管理，支持电子邮件、OAuth、SSO 等多种方式，并提供行级安全性以实现精细的访问控制。
- **存储：** 通过内置存储安全地上传、提供和管理文件，并与您的数据库无缝集成。
- **边缘函数：** 部署无服务器函数到用户附近，以实现低延迟的自定义逻辑。

**在 Sim 中使用 Supabase**

Sim 的 Supabase 集成使您能够轻松地将代理工作流连接到您的 Supabase 项目。只需填写几个配置字段——您的项目 ID、表名和服务角色密钥，您就可以直接从 Sim 模块中安全地与数据库交互。该集成简化了 API 调用的复杂性，让您专注于构建逻辑和自动化流程。

**在 Sim 中使用 Supabase 的主要优势：**
- **无代码/低代码的数据库操作：** 无需编写 SQL 或后端代码即可查询、插入、更新和删除 Supabase 表中的行。
- **灵活的查询：** 使用 [PostgREST 过滤语法](https://postgrest.org/en/stable/api.html#operators) 执行高级查询，包括过滤、排序和限制结果。
- **无缝集成：** 轻松将 Supabase 连接到工作流中的其他工具和服务，实现强大的自动化功能，例如数据同步、触发通知或丰富记录。
- **安全且可扩展：** 所有操作都使用您的 Supabase 服务角色密钥，确保数据访问的安全性，同时享受托管云平台的可扩展性。

无论您是在构建内部工具、自动化业务流程，还是支持生产应用程序，Sim 中的 Supabase 都为您提供了一种快速、可靠且对开发者友好的方式来管理数据和后端逻辑——无需基础设施管理。只需配置模块，选择所需的操作，其余的交给 Sim 处理。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Supabase 集成到工作流程中。支持数据库操作（查询、插入、更新、删除、upsert）、全文搜索、RPC 函数、行计数、向量搜索以及完整的存储管理（上传、下载、列出、移动、复制、删除文件和存储桶）。

## 工具

### `supabase_query`

从 Supabase 表中查询数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | 字符串 | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `table` | 字符串 | 是 | 要查询的 Supabase 表名 |
| `filter` | 字符串 | 否 | PostgREST 过滤条件 \(例如："id=eq.123"\) |
| `orderBy` | 字符串 | 否 | 排序的列名 \(添加 DESC 表示降序\) |
| `limit` | 数字 | 否 | 返回的最大行数 |
| `apiKey` | 字符串 | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | array | 查询返回的记录数组 |

### `supabase_insert`

向 Supabase 表中插入数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `table` | string | 是 | 要插入数据的 Supabase 表名 |
| `data` | array | 是 | 要插入的数据 \(对象数组或单个对象\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | array | 插入的记录数组 |

### `supabase_get_row`

根据筛选条件从 Supabase 表中获取单行数据

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `table` | string | 是 | 要查询的 Supabase 表名 |
| `filter` | string | 是 | PostgREST 筛选条件以找到特定行 \(例如："id=eq.123"\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | array | 包含行数据的数组（如果找到），如果未找到则为空数组 |

### `supabase_update`

根据筛选条件更新 Supabase 表中的行

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `table` | string | 是 | 要更新的 Supabase 表的名称 |
| `filter` | string | 是 | 用于标识要更新行的 PostgREST 筛选条件 \(例如："id=eq.123"\) |
| `data` | object | 是 | 要更新到匹配行的数据 |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | array | 更新记录的数组 |

### `supabase_delete`

根据筛选条件从 Supabase 表中删除行

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `table` | string | 是 | 要删除的 Supabase 表的名称 |
| `filter` | string | 是 | 用于标识要删除行的 PostgREST 筛选条件 \(例如："id=eq.123"\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | array | 已删除记录的数组 |

### `supabase_upsert`

在 Supabase 表中插入或更新数据（upsert 操作）

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `table` | string | 是 | 要插入或更新数据的 Supabase 表名 |
| `data` | array | 是 | 要插入或更新的数据 \(插入或更新\) - 对象数组或单个对象 |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | array | 已 upsert 的记录数组 |

### `supabase_count`

统计 Supabase 表中的行数

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `table` | string | 是 | 要统计行数的 Supabase 表名 |
| `filter` | string | 否 | PostgREST 过滤条件 \(例如："status=eq.active"\) |
| `countType` | string | 否 | 计数类型：exact、planned 或 estimated \(默认：exact\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `count` | number | 符合过滤条件的行数 |

### `supabase_text_search`

在 Supabase 表中执行全文搜索

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `table` | string | 是 | 要搜索的 Supabase 表名 |
| `column` | string | 是 | 要搜索的列 |
| `query` | string | 是 | 搜索查询 |
| `searchType` | string | 否 | 搜索类型：plain、phrase 或 websearch \(默认：websearch\) |
| `language` | string | 否 | 文本搜索配置的语言 \(默认：english\) |
| `limit` | number | 否 | 返回的最大行数 |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | array | 与搜索查询匹配的记录数组 |

### `supabase_vector_search`

在 Supabase 表中使用 pgvector 执行相似性搜索

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `functionName` | string | 是 | 执行向量搜索的 PostgreSQL 函数名称 \(例如：match_documents\) |
| `queryEmbedding` | array | 是 | 要搜索相似项的查询向量/嵌入 |
| `matchThreshold` | number | 否 | 最小相似度阈值 \(0-1\)，通常为 0.7-0.9 |
| `matchCount` | number | 否 | 返回结果的最大数量 \(默认值：10\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | array | 包含向量搜索相似度分数的记录数组。每条记录包括一个相似度字段 \(0-1\)，表示与查询向量的相似程度。 |

### `supabase_rpc`

调用 Supabase 中的 PostgreSQL 函数

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `functionName` | string | 是 | 要调用的 PostgreSQL 函数名称 |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | json | 函数返回的结果 |

### `supabase_storage_upload`

将文件上传到 Supabase 存储桶

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `bucket` | string | 是 | 存储桶的名称 |
| `path` | string | 是 | 文件将存储的路径 \(例如："folder/file.jpg"\) |
| `fileContent` | string | 是 | 文件内容 \(二进制文件为 base64 编码，或纯文本\) |
| `contentType` | string | 否 | 文件的 MIME 类型 \(例如："image/jpeg", "text/plain"\) |
| `upsert` | boolean | 否 | 如果为 true，则覆盖现有文件 \(默认值：false\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | object | 上传结果，包括文件路径和元数据 |

### `supabase_storage_download`

从 Supabase 存储桶下载文件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `bucket` | string | 是 | 存储桶的名称 |
| `path` | string | 是 | 要下载的文件路径 \(例如："folder/file.jpg"\) |
| `fileName` | string | 否 | 可选的文件名覆盖 |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `file` | file | 下载的文件存储在执行文件中 |

### `supabase_storage_list`

列出 Supabase 存储桶中的文件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `bucket` | string | 是 | 存储桶的名称 |
| `path` | string | 否 | 要列出文件的文件夹路径 \(默认：根目录\) |
| `limit` | number | 否 | 返回的最大文件数 \(默认：100\) |
| `offset` | number | 否 | 要跳过的文件数 \(用于分页\) |
| `sortBy` | string | 否 | 排序的列：name, created_at, updated_at \(默认：name\) |
| `sortOrder` | string | 否 | 排序顺序：asc 或 desc \(默认：asc\) |
| `search` | string | 否 | 按名称过滤文件的搜索词 |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | array | 包含元数据的文件对象数组 |

### `supabase_storage_delete`

从 Supabase 存储桶中删除文件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `bucket` | string | 是 | 存储桶的名称 |
| `paths` | array | 是 | 要删除的文件路径数组 \(例如：\["folder/file1.jpg", "folder/file2.jpg"\]\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | array | 已删除文件对象的数组 |

### `supabase_storage_move`

在 Supabase 存储桶中移动文件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `bucket` | string | 是 | 存储桶的名称 |
| `fromPath` | string | 是 | 文件的当前路径 \(例如："folder/old.jpg"\) |
| `toPath` | string | 是 | 文件的新路径 \(例如："newfolder/new.jpg"\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | object | 移动操作结果 |

### `supabase_storage_copy`

在 Supabase 存储桶中复制文件

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `bucket` | string | 是 | 存储桶的名称 |
| `fromPath` | string | 是 | 源文件的路径 \(例如："folder/source.jpg"\) |
| `toPath` | string | 是 | 复制文件的路径 \(例如："folder/copy.jpg"\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | object | 复制操作结果 |

### `supabase_storage_create_bucket`

在 Supabase 中创建一个新的存储桶

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `bucket` | string | 是 | 要创建的存储桶名称 |
| `isPublic` | boolean | 否 | 存储桶是否应为公开访问 \(默认值：false\) |
| `fileSizeLimit` | number | 否 | 最大文件大小（以字节为单位）\(可选\) |
| `allowedMimeTypes` | array | 否 | 允许的 MIME 类型数组 \(例如：\["image/png", "image/jpeg"\]\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | object | 创建的存储桶信息 |

### `supabase_storage_list_buckets`

列出 Supabase 中的所有存储桶

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | array | 存储桶对象的数组 |

### `supabase_storage_delete_bucket`

删除 Supabase 中的存储桶

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `bucket` | string | 是 | 要删除的存储桶名称 |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `results` | object | 删除操作结果 |

### `supabase_storage_get_public_url`

获取 Supabase 存储桶中文件的公共 URL

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `bucket` | string | 是 | 存储桶的名称 |
| `path` | string | 是 | 文件路径 \(例如："folder/file.jpg"\) |
| `download` | boolean | 否 | 如果为 true，则强制下载而不是内联显示 \(默认值：false\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `publicUrl` | string | 访问文件的公共 URL |

### `supabase_storage_create_signed_url`

为 Supabase 存储桶中的文件创建一个临时签名 URL

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | 是 | 您的 Supabase 项目 ID \(例如：jdrkgepadsdopsntdlom\) |
| `bucket` | string | 是 | 存储桶的名称 |
| `path` | string | 是 | 文件的路径 \(例如："folder/file.jpg"\) |
| `expiresIn` | number | 是 | URL 过期的秒数 \(例如：3600 表示 1 小时\) |
| `download` | boolean | 否 | 如果为 true，则强制下载而不是内联显示 \(默认值：false\) |
| `apiKey` | string | 是 | 您的 Supabase 服务角色密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 操作状态消息 |
| `signedUrl` | string | 访问文件的临时签名 URL |

## 注意事项

- 类别：`tools`
- 类型：`supabase`
```

--------------------------------------------------------------------------------

---[FILE: tavily.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/tavily.mdx

```text
---
title: Tavily
description: 搜索和提取信息
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="tavily"
  color="#0066FF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Tavily](https://www.tavily.com/) 是一款专为 LLM 应用设计的 AI 驱动搜索 API。它提供可靠的实时信息检索功能，并针对 AI 使用场景优化了功能，包括语义搜索、内容提取和结构化数据检索。

使用 Tavily，您可以：

- **执行上下文搜索**：基于语义理解获取相关结果，而不仅仅是关键词匹配
- **提取结构化内容**：以干净、可用的格式从网页中提取特定信息
- **访问实时信息**：从整个网络中检索最新数据
- **同时处理多个 URL**：在单次请求中从多个网页提取内容
- **接收 AI 优化结果**：获取专为 AI 系统使用而格式化的搜索结果

在 Sim 中，Tavily 集成使您的代理能够在其工作流程中搜索网络并提取信息。这支持需要从互联网获取最新信息的复杂自动化场景。您的代理可以制定搜索查询，检索相关结果，并从特定网页中提取内容，以支持其决策过程。此集成弥合了您的工作流程自动化与网络上广泛知识之间的差距，使您的代理无需人工干预即可访问实时信息。通过将 Sim 与 Tavily 连接，您可以创建能够跟上最新信息的代理，提供更准确的响应，并为用户带来更多价值。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Tavily 集成到工作流程中。可以搜索网页并从特定 URL 提取内容。需要 API 密钥。

## 工具

### `tavily_search`

使用 Tavily 执行由 AI 驱动的网页搜索

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `query` | 字符串 | 是 | 要执行的搜索查询 |
| `max_results` | 数字 | 否 | 最大结果数量 \(1-20\) |
| `topic` | 字符串 | 否 | 类别类型：general、news 或 finance \(默认：general\) |
| `search_depth` | 字符串 | 否 | 搜索范围：basic \(1 积分\) 或 advanced \(2 积分\) \(默认：basic\) |
| `include_answer` | 字符串 | 否 | LLM 生成的响应：true/basic 表示快速回答，advanced 表示详细回答 |
| `include_raw_content` | 字符串 | 否 | 解析的 HTML 内容：true/markdown 或文本格式 |
| `include_images` | 布尔值 | 否 | 包括图片搜索结果 |
| `include_image_descriptions` | 布尔值 | 否 | 为图片添加描述性文本 |
| `include_favicon` | 布尔值 | 否 | 包括 favicon URL |
| `chunks_per_source` | 数字 | 否 | 每个来源的最大相关块数 \(1-3，默认：3\) |
| `time_range` | 字符串 | 否 | 按最新时间筛选：day/d、week/w、month/m、year/y |
| `start_date` | 字符串 | 否 | 最早发布日期 \(YYYY-MM-DD 格式\) |
| `end_date` | 字符串 | 否 | 最晚发布日期 \(YYYY-MM-DD 格式\) |
| `include_domains` | 字符串 | 否 | 逗号分隔的白名单域名列表 \(最多 300 个\) |
| `exclude_domains` | 字符串 | 否 | 逗号分隔的黑名单域名列表 \(最多 150 个\) |
| `country` | 字符串 | 否 | 提升指定国家的结果 \(仅限 general 主题\) |
| `auto_parameters` | 布尔值 | 否 | 根据查询意图自动配置参数 |
| `apiKey` | 字符串 | 是 | Tavily API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `query` | 字符串 | 已执行的搜索查询 |
| `results` | 数组 | 工具输出的结果 |

### `tavily_extract`

使用 Tavily 同时从多个网页提取原始内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `urls` | 字符串 | 是 | 要提取内容的 URL 或 URL 数组 |
| `extract_depth` | 字符串 | 否 | 提取深度 \(basic=1 积分/5 个 URL，advanced=2 积分/5 个 URL\) |
| `format` | 字符串 | 否 | 输出格式：markdown 或 text \(默认：markdown\) |
| `include_images` | 布尔值 | 否 | 在提取输出中包含图像 |
| `include_favicon` | 布尔值 | 否 | 为每个结果添加 favicon URL |
| `apiKey` | 字符串 | 是 | Tavily API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `results` | 数组 | 已提取的 URL |

### `tavily_crawl`

使用 Tavily 系统化地爬取并提取网站内容

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `url` | 字符串 | 是 | 开始爬取的根 URL |
| `instructions` | 字符串 | 否 | 爬取器的自然语言指令 \(每 10 页消耗 2 积分\) |
| `max_depth` | 数字 | 否 | 从基础 URL 探索的深度 \(1-5，默认：1\) |
| `max_breadth` | 数字 | 否 | 每个页面级别跟随的链接数量 \(≥1，默认：20\) |
| `limit` | 数字 | 否 | 停止前处理的总链接数量 \(≥1，默认：50\) |
| `select_paths` | 字符串 | 否 | 用逗号分隔的正则表达式模式，用于包含特定的 URL 路径 \(例如，/docs/.*\) |
| `select_domains` | 字符串 | 否 | 用逗号分隔的正则表达式模式，用于限制爬取特定域名 |
| `exclude_paths` | 字符串 | 否 | 用逗号分隔的正则表达式模式，用于跳过特定的 URL 路径 |
| `exclude_domains` | 字符串 | 否 | 用逗号分隔的正则表达式模式，用于屏蔽特定域名 |
| `allow_external` | 布尔值 | 否 | 在结果中包含外部域名链接 \(默认：true\) |
| `include_images` | 布尔值 | 否 | 在爬取输出中包含图像 |
| `extract_depth` | 字符串 | 否 | 提取深度：basic \(1 积分/5 页\) 或 advanced \(2 积分/5 页\) |
| `format` | 字符串 | 否 | 输出格式：markdown 或 text \(默认：markdown\) |
| `include_favicon` | 布尔值 | 否 | 为每个结果添加 favicon URL |
| `apiKey` | 字符串 | 是 | Tavily API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `base_url` | 字符串 | 被爬取的基础 URL |
| `results` | 数组 | 被爬取的页面 URL |

### `tavily_map`

使用 Tavily 探索并可视化网站结构

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `url` | 字符串 | 是 | 开始映射的根 URL |
| `instructions` | 字符串 | 否 | 用于映射行为的自然语言指导 \(每 10 页消耗 2 积分\) |
| `max_depth` | 数字 | 否 | 从基础 URL 探索的深度 \(1-5，默认值：1\) |
| `max_breadth` | 数字 | 否 | 每级要跟随的链接数量 \(默认值：20\) |
| `limit` | 数字 | 否 | 要处理的总链接数量 \(默认值：50\) |
| `select_paths` | 字符串 | 否 | 用于 URL 路径过滤的逗号分隔正则表达式模式 \(例如：/docs/.*\) |
| `select_domains` | 字符串 | 否 | 限制映射到特定域的逗号分隔正则表达式模式 |
| `exclude_paths` | 字符串 | 否 | 排除特定 URL 路径的逗号分隔正则表达式模式 |
| `exclude_domains` | 字符串 | 否 | 排除域的逗号分隔正则表达式模式 |
| `allow_external` | 布尔值 | 否 | 在结果中包含外部域链接 \(默认值：true\) |
| `apiKey` | 字符串 | 是 | Tavily API 密钥 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `base_url` | 字符串 | 被映射的基础 URL |
| `results` | 数组 | 发现的 URL |

## 注意事项

- 类别：`tools`
- 类型：`tavily`
```

--------------------------------------------------------------------------------

---[FILE: telegram.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/telegram.mdx

```text
---
title: Telegram
description: 通过 Telegram 发送消息或从 Telegram 事件触发工作流
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="telegram"
  color="#E0E0E0"
/>

{/* MANUAL-CONTENT-START:intro */}
[Telegram](https://telegram.org) 是一个安全的云端消息平台，能够在多个设备和平台上实现快速可靠的通信。Telegram 拥有超过 7 亿的月活跃用户，已成为全球领先的消息服务之一，以其安全性、速度和强大的 API 功能而闻名。

Telegram 的 Bot API 提供了一个强大的框架，用于创建自动化消息解决方案并将通信功能集成到应用程序中。通过支持丰富的媒体、内联键盘和自定义命令，Telegram 机器人可以实现复杂的交互模式和自动化工作流。

了解如何在 Sim 中创建一个 webhook 触发器，从 Telegram 消息中无缝启动工作流。本教程将指导您设置 webhook，使用 Telegram 的 Bot API 进行配置，并实时触发自动化操作。非常适合直接从聊天中简化任务！

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/9oKcJtQ0_IM"
  title="Use Telegram with Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

了解如何在 Sim 中使用 Telegram 工具，将消息无缝自动发送到任何 Telegram 群组。本教程将指导您将该工具集成到工作流中，配置群组消息，并实时触发自动更新。非常适合直接从工作空间中增强通信！

<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/AG55LpUreGI"
  title="Use Telegram with Sim"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>

Telegram 的主要功能包括：

- 安全通信：端到端加密和安全的云存储，用于消息和媒体
- 机器人平台：强大的机器人 API，可用于创建自动化消息解决方案和交互式体验
- 丰富的媒体支持：发送和接收带有文本格式、图片、文件和交互元素的消息
- 全球覆盖：支持多种语言和平台，与全球用户连接

在 Sim 中，Telegram 集成使您的代理能够将这些强大的消息功能融入到他们的工作流程中。这为通过 Telegram 的安全消息平台实现自动通知、警报和交互式对话创造了机会。该集成允许代理以编程方式向个人或频道发送消息，从而实现及时的沟通和更新。通过将 Sim 与 Telegram 连接，您可以构建智能代理，通过一个安全且被广泛采用的消息平台与用户互动，非常适合发送通知、更新和交互式通信。
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Telegram 集成到工作流程中。可以发送消息。可以在触发模式下使用，当消息发送到聊天时触发工作流程。

## 工具

### `telegram_message`

通过 Telegram Bot API 向 Telegram 频道或用户发送消息。支持直接通信和通知，并提供消息跟踪和聊天确认功能。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | 字符串 | 是 | 您的 Telegram Bot API 令牌 |
| `chatId` | 字符串 | 是 | 目标 Telegram 聊天 ID |
| `text` | 字符串 | 是 | 要发送的消息文本 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | 字符串 | 成功或错误消息 |
| `data` | 对象 | Telegram 消息数据 |

## 注意

- 类别：`tools`
- 类型：`telegram`

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | 字符串 | 是 | 您的 Telegram Bot API 令牌 |
| `chatId` | 字符串 | 是 | 目标 Telegram 聊天 ID |
| `messageId` | 字符串 | 是 | 要删除的消息 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | 字符串 | 成功或错误信息 |
| `data` | 对象 | 删除操作结果 |

### `telegram_send_photo`

通过 Telegram Bot API 向 Telegram 频道或用户发送照片。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | 字符串 | 是 | 您的 Telegram Bot API 令牌 |
| `chatId` | 字符串 | 是 | 目标 Telegram 聊天 ID |
| `photo` | 字符串 | 是 | 要发送的照片。传递 file_id 或 HTTP URL |
| `caption` | 字符串 | 否 | 照片标题（可选） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | 字符串 | 成功或错误信息 |
| `data` | 对象 | 包含可选照片的 Telegram 消息数据 |

### `telegram_send_video`

通过 Telegram Bot API 向 Telegram 频道或用户发送视频。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | 字符串 | 是 | 您的 Telegram Bot API 令牌 |
| `chatId` | 字符串 | 是 | 目标 Telegram 聊天 ID |
| `video` | 字符串 | 是 | 要发送的视频。传递 file_id 或 HTTP URL |
| `caption` | 字符串 | 否 | 视频标题（可选） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 包含可选媒体的 Telegram 消息数据 |

### `telegram_send_audio`

通过 Telegram Bot API 向 Telegram 频道或用户发送音频文件。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 您的 Telegram Bot API 令牌 |
| `chatId` | string | 是 | 目标 Telegram 聊天 ID |
| `audio` | string | 是 | 要发送的音频文件。传递 file_id 或 HTTP URL |
| `caption` | string | 否 | 音频标题（可选） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 包含语音/音频信息的 Telegram 消息数据 |

### `telegram_send_animation`

通过 Telegram Bot API 向 Telegram 频道或用户发送动画（GIF）。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 您的 Telegram Bot API 令牌 |
| `chatId` | string | 是 | 目标 Telegram 聊天 ID |
| `animation` | string | 是 | 要发送的动画。传递 file_id 或 HTTP URL |
| `caption` | string | 否 | 动画标题（可选） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | 字符串 | 成功或错误消息 |
| `data` | 对象 | 包含可选媒体的 Telegram 消息数据 |

### `telegram_send_document`

通过 Telegram Bot API 将文档（PDF、ZIP、DOC 等）发送到 Telegram 频道或用户。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `botToken` | string | 是 | 您的 Telegram Bot API 令牌 |
| `chatId` | string | 是 | 目标 Telegram 聊天 ID |
| `files` | file[] | 否 | 要发送的文档文件（PDF、ZIP、DOC 等）。最大大小：50MB |
| `caption` | string | 否 | 文档标题（可选） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `message` | string | 成功或错误消息 |
| `data` | object | 包含文档的 Telegram 消息数据 |

## 注意

- 类别：`tools`
- 类型：`telegram`
```

--------------------------------------------------------------------------------

---[FILE: thinking.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/thinking.mdx

```text
---
title: 思考
description: 引导模型梳理其思考过程。
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="thinking"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
思考工具鼓励 AI 模型在回答复杂问题之前进行明确的推理。通过提供一个专门用于逐步分析的空间，该工具帮助模型分解问题、考虑多种视角，并得出更深思熟虑的结论。

研究表明，引导语言模型“逐步思考”可以显著提高其推理能力。根据 [Anthropic 关于 Claude 的思考工具的研究](https://www.anthropic.com/engineering/claude-think-tool)，当模型被赋予明确推理的空间时，它们表现出：

- **改进的问题解决能力**：将复杂问题分解为可管理的步骤
- **提高的准确性**：通过仔细处理问题的每个组成部分来减少错误
- **更高的透明度**：使模型的推理过程可见且可审计
- **更细致的响应**：在得出结论之前考虑多个角度

在 Sim 中，思考工具为您的代理提供了一个结构化的机会，以进行这种深思熟虑的推理。通过将思考步骤融入您的工作流程，您可以帮助代理更有效地处理复杂任务，避免常见的推理陷阱，并生成更高质量的输出。这对于涉及多步骤推理、复杂决策或需要高度准确性的任务尤为重要。
{/* MANUAL-CONTENT-END */}

## 使用说明

添加一个步骤，让模型在继续之前明确地概述其思考过程。这可以通过鼓励逐步分析来提高推理质量。

## 工具

### `thinking_tool`

处理提供的思考或指令，使其可用于后续步骤。

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `thought` | 字符串 | 是 | 您的内部推理、分析或思考过程。使用此项逐步思考问题，然后再作出回应。 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `acknowledgedThought` | 字符串 | 已处理并确认的思考内容 |

## 注意事项

- 类别：`tools`
- 类型：`thinking`
```

--------------------------------------------------------------------------------

---[FILE: translate.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/translate.mdx

```text
---
title: 翻译
description: 将文本翻译成任何语言
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="translate"
  color="#FF4B4B"
/>

{/* MANUAL-CONTENT-START:intro */}
翻译是一种工具，可以让您在不同语言之间翻译文本。

使用翻译工具，您可以：

- **翻译文本**：在不同语言之间翻译文本
- **翻译文档**：在不同语言之间翻译文档
- **翻译网站**：在不同语言之间翻译网站
- **翻译图片**：在不同语言之间翻译图片
- **翻译音频**：在不同语言之间翻译音频
- **翻译视频**：在不同语言之间翻译视频
- **翻译语音**：在不同语言之间翻译语音
- **翻译文本**：在不同语言之间翻译文本
{/* MANUAL-CONTENT-END */}

## 使用说明

将 Translate 集成到工作流程中。可以将文本翻译成任何语言。

## 工具

### `llm_chat`

向任何支持的 LLM 提供商发送聊天完成请求

#### 输入

| 参数 | 类型 | 必填 | 说明 |
| --------- | ---- | -------- | ----------- |
| `model` | string | 是 | 要使用的模型（例如 gpt-4o、claude-sonnet-4-5、gemini-2.0-flash） |
| `systemPrompt` | string | 否 | 设置助手行为的 system prompt |
| `context` | string | 是 | 发送给模型的用户消息或上下文 |
| `apiKey` | string | 否 | 提供方的 API key（如未提供，托管模型将使用平台密钥） |
| `temperature` | number | 否 | 响应生成的 temperature（0-2） |
| `maxTokens` | number | 否 | 响应中的最大 tokens 数 |
| `azureEndpoint` | string | 否 | Azure OpenAI endpoint URL |
| `azureApiVersion` | string | 否 | Azure OpenAI API 版本 |
| `vertexProject` | string | 否 | Vertex AI 的 Google Cloud 项目 ID |
| `vertexLocation` | string | 否 | Vertex AI 的 Google Cloud 区域（默认为 us-central1） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `content` | string | 生成的响应内容 |
| `model` | string | 用于生成的模型 |
| `tokens` | object | 令牌使用信息 |

## 注意

- 类别: `tools`
- 类型: `translate`
```

--------------------------------------------------------------------------------

---[FILE: trello.mdx]---
Location: sim-main/apps/docs/content/docs/zh/tools/trello.mdx

```text
---
title: Trello
description: 管理 Trello 看板和卡片
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="trello"
  color="#0052CC"
/>

{/* MANUAL-CONTENT-START:intro */}
[Trello](https://trello.com) 是一个可视化协作工具，帮助您使用看板、列表和卡片来组织项目、任务和工作流程。

在 Sim 中使用 Trello，您可以：

- **列出看板和列表**：查看您有权限访问的看板及其关联的列表。
- **列出和搜索卡片**：检索看板上的所有卡片，或按列表筛选以查看其内容和状态。
- **创建卡片**：向 Trello 列表中添加新卡片，包括描述、标签和到期日期。
- **更新和移动卡片**：编辑卡片属性，将卡片移动到不同的列表，并设置到期日期或标签。
- **获取最近活动**：检索看板和卡片的操作和活动历史记录。
- **评论卡片**：向卡片添加评论以便协作和跟踪。

将 Trello 与 Sim 集成，可以让您的代理以编程方式管理团队的任务、看板和项目。通过您的 AI 代理，自动化项目管理工作流程，保持任务列表的最新状态，与其他工具同步，或响应 Trello 事件触发智能工作流程。
{/* MANUAL-CONTENT-END */}

## 使用说明

集成 Trello 以管理看板和卡片。列出看板、列出卡片、创建卡片、更新卡片、获取操作记录以及添加评论。

## 工具

### `trello_list_lists`

列出 Trello 看板上的所有列表

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | 是 | 要列出列表的看板 ID |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `lists` | array | 包含 id、name、closed、pos 和 idBoard 的列表对象数组 |
| `count` | number | 返回的列表数量 |

### `trello_list_cards`

列出 Trello 看板上的所有卡片

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | 是 | 要列出卡片的看板 ID |
| `listId` | string | 否 | 可选：按列表 ID 筛选卡片 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `cards` | array | 包含 id、name、desc、url、看板/列表 ID、标签和到期日期的卡片对象数组 |
| `count` | number | 返回的卡片数量 |

### `trello_create_card`

在 Trello 看板上创建新卡片

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | 是 | 要创建卡片的看板 ID |
| `listId` | string | 是 | 要创建卡片的列表 ID |
| `name` | string | 是 | 卡片的名称/标题 |
| `desc` | string | 否 | 卡片的描述 |
| `pos` | string | 否 | 卡片的位置（top、bottom 或正浮点数） |
| `due` | string | 否 | 到期日期（ISO 8601 格式） |
| `labels` | string | 否 | 逗号分隔的标签 ID 列表 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `card` | object | 创建的卡片对象，包含 id、name、desc、url 和其他属性 |

### `trello_update_card`

更新 Trello 上的现有卡片

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `cardId` | string | 是 | 要更新的卡片 ID |
| `name` | string | 否 | 卡片的新名称/标题 |
| `desc` | string | 否 | 卡片的新描述 |
| `closed` | boolean | 否 | 归档/关闭卡片（true）或重新打开卡片（false） |
| `idList` | string | 否 | 将卡片移动到其他列表 |
| `due` | string | 否 | 到期日期（ISO 8601 格式） |
| `dueComplete` | boolean | 否 | 将到期日期标记为已完成 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `card` | object | 更新的卡片对象，包含 id、name、desc、url 和其他属性 |

### `trello_get_actions`

获取看板或卡片的活动/操作

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `boardId` | string | 否 | 要获取操作的看板 ID（boardId 或 cardId 必填其一） |
| `cardId` | string | 否 | 要获取操作的卡片 ID（boardId 或 cardId 必填其一） |
| `filter` | string | 否 | 按类型筛选操作（例如 "commentCard,updateCard,createCard" 或 "all"） |
| `limit` | number | 否 | 返回的最大操作数（默认：50，最大：1000） |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `actions` | array | 包含 type、date、member 和 data 的操作对象数组 |
| `count` | number | 返回的操作数量 |

### `trello_add_comment`

向 Trello 卡片添加评论

#### 输入

| 参数 | 类型 | 必需 | 描述 |
| --------- | ---- | -------- | ----------- |
| `cardId` | string | 是 | 要评论的卡片 ID |
| `text` | string | 是 | 评论内容 |

#### 输出

| 参数 | 类型 | 描述 |
| --------- | ---- | ----------- |
| `comment` | object | 创建的评论对象，包含 id、text、date 和创建者信息 |

## 注意事项

- 类别：`tools`
- 类型：`trello`
```

--------------------------------------------------------------------------------

````
