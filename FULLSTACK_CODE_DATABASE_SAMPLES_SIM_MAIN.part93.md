---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 93
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 93 of 933)

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
Location: sim-main/apps/docs/content/docs/en/tools/stt.mdx

```text
---
title: Speech-to-Text
description: Convert speech to text using AI
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="stt"
  color="#181C1E"
/>

{/* MANUAL-CONTENT-START:intro */}
Transcribe speech to text using the latest AI models from world-class providers. Sim's Speech-to-Text (STT) tools empower you to turn audio and video into accurate, timestamped, and optionally translated transcripts—supporting a diversity of languages and enhanced with advanced features such as diarization and speaker identification.

**Supported Providers & Models:**

- **[OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text/overview)** (OpenAI):  
  OpenAI’s Whisper is an open-source deep learning model renowned for its robustness across languages and audio conditions. It supports advanced models such as `whisper-1`, excelling in transcription, translation, and tasks demanding high model generalization. Backed by OpenAI—the company known for ChatGPT and leading AI research—Whisper is widely used in research and as a baseline for comparative evaluation.

- **[Deepgram](https://deepgram.com/)** (Deepgram Inc.):  
  Based in San Francisco, Deepgram offers scalable, production-grade speech recognition APIs for developers and enterprises. Deepgram’s models include `nova-3`, `nova-2`, and `whisper-large`, offering real-time and batch transcription with industry-leading accuracy, multi-language support, automatic punctuation, intelligent diarization, call analytics, and features for use cases ranging from telephony to media production.

- **[ElevenLabs](https://elevenlabs.io/)** (ElevenLabs):  
  A leader in voice AI, ElevenLabs is especially known for premium voice synthesis and recognition. Its STT product delivers high-accuracy, natural understanding of numerous languages, dialects, and accents. Recent ElevenLabs STT models are optimized for clarity, speaker distinction, and are suitable for both creative and accessibility scenarios. ElevenLabs is recognized for cutting-edge advancements in AI-powered speech technologies.

- **[AssemblyAI](https://www.assemblyai.com/)** (AssemblyAI Inc.):  
  AssemblyAI provides API-driven, highly accurate speech recognition, with features such as auto chaptering, topic detection, summarization, sentiment analysis, and content moderation alongside transcription. Its proprietary model, including the acclaimed `Conformer-2`, powers some of the largest media, call center, and compliance applications in the industry. AssemblyAI is trusted by Fortune 500s and leading AI startups globally.

- **[Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)** (Google Cloud):  
  Google’s enterprise-grade Speech-to-Text API supports over 125 languages and variants, offering high accuracy and features such as real-time streaming, word-level confidence, speaker diarization, automatic punctuation, custom vocabulary, and domain-specific tuning. Models such as `latest_long`, `video`, and domain-optimized models are available, powered by Google’s years of research and deployed for global scalability.

- **[AWS Transcribe](https://aws.amazon.com/transcribe/)** (Amazon Web Services):  
  AWS Transcribe leverages Amazon’s cloud infrastructure to deliver robust speech recognition as an API. It supports multiple languages and features such as speaker identification, custom vocabulary, channel identification (for call center audio), and medical-specific transcription. Popular models include `standard` and domain-specific variations. AWS Transcribe is ideal for organizations already using Amazon’s cloud.

**How to Choose:**  
Select the provider and model that fits your application—whether you need fast, enterprise-ready transcription with extra analytics (Deepgram, AssemblyAI, Google, AWS), high versatility and open-source access (OpenAI Whisper), or advanced speaker/contextual understanding (ElevenLabs). Consider the pricing, language coverage, accuracy, and any special features (like summarization, chaptering, or sentiment analysis) you might need.

For more details on capabilities, pricing, feature highlights, and fine-tuning options, refer to each provider’s official documentation via the links above.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Transcribe audio and video files to text using leading AI providers. Supports multiple languages, timestamps, and speaker diarization.



## Tools

### `stt_whisper`

Transcribe audio to text using OpenAI Whisper

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Yes | STT provider \(whisper\) |
| `apiKey` | string | Yes | OpenAI API key |
| `model` | string | No | Whisper model to use \(default: whisper-1\) |
| `audioFile` | file | No | Audio or video file to transcribe |
| `audioFileReference` | file | No | Reference to audio/video file from previous blocks |
| `audioUrl` | string | No | URL to audio or video file |
| `language` | string | No | Language code \(e.g., "en", "es", "fr"\) or "auto" for auto-detection |
| `timestamps` | string | No | Timestamp granularity: none, sentence, or word |
| `translateToEnglish` | boolean | No | Translate audio to English |
| `prompt` | string | No | Optional text to guide the model's style or continue a previous audio segment. Helps with proper nouns and context. |
| `temperature` | number | No | Sampling temperature between 0 and 1. Higher values make output more random, lower values more focused and deterministic. |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `transcript` | string | Full transcribed text |
| `segments` | array | Timestamped segments |
| `language` | string | Detected or specified language |
| `duration` | number | Audio duration in seconds |

### `stt_deepgram`

Transcribe audio to text using Deepgram

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Yes | STT provider \(deepgram\) |
| `apiKey` | string | Yes | Deepgram API key |
| `model` | string | No | Deepgram model to use \(nova-3, nova-2, whisper-large, etc.\) |
| `audioFile` | file | No | Audio or video file to transcribe |
| `audioFileReference` | file | No | Reference to audio/video file from previous blocks |
| `audioUrl` | string | No | URL to audio or video file |
| `language` | string | No | Language code \(e.g., "en", "es", "fr"\) or "auto" for auto-detection |
| `timestamps` | string | No | Timestamp granularity: none, sentence, or word |
| `diarization` | boolean | No | Enable speaker diarization |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `transcript` | string | Full transcribed text |
| `segments` | array | Timestamped segments with speaker labels |
| `language` | string | Detected or specified language |
| `duration` | number | Audio duration in seconds |
| `confidence` | number | Overall confidence score |

### `stt_elevenlabs`

Transcribe audio to text using ElevenLabs

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Yes | STT provider \(elevenlabs\) |
| `apiKey` | string | Yes | ElevenLabs API key |
| `model` | string | No | ElevenLabs model to use \(scribe_v1, scribe_v1_experimental\) |
| `audioFile` | file | No | Audio or video file to transcribe |
| `audioFileReference` | file | No | Reference to audio/video file from previous blocks |
| `audioUrl` | string | No | URL to audio or video file |
| `language` | string | No | Language code \(e.g., "en", "es", "fr"\) or "auto" for auto-detection |
| `timestamps` | string | No | Timestamp granularity: none, sentence, or word |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `transcript` | string | Full transcribed text |
| `segments` | array | Timestamped segments |
| `language` | string | Detected or specified language |
| `duration` | number | Audio duration in seconds |
| `confidence` | number | Overall confidence score |

### `stt_assemblyai`

Transcribe audio to text using AssemblyAI with advanced NLP features

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Yes | STT provider \(assemblyai\) |
| `apiKey` | string | Yes | AssemblyAI API key |
| `model` | string | No | AssemblyAI model to use \(default: best\) |
| `audioFile` | file | No | Audio or video file to transcribe |
| `audioFileReference` | file | No | Reference to audio/video file from previous blocks |
| `audioUrl` | string | No | URL to audio or video file |
| `language` | string | No | Language code \(e.g., "en", "es", "fr"\) or "auto" for auto-detection |
| `timestamps` | string | No | Timestamp granularity: none, sentence, or word |
| `diarization` | boolean | No | Enable speaker diarization |
| `sentiment` | boolean | No | Enable sentiment analysis |
| `entityDetection` | boolean | No | Enable entity detection |
| `piiRedaction` | boolean | No | Enable PII redaction |
| `summarization` | boolean | No | Enable automatic summarization |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `transcript` | string | Full transcribed text |
| `segments` | array | Timestamped segments with speaker labels |
| `language` | string | Detected or specified language |
| `duration` | number | Audio duration in seconds |
| `confidence` | number | Overall confidence score |
| `sentiment` | array | Sentiment analysis results |
| `entities` | array | Detected entities |
| `summary` | string | Auto-generated summary |

### `stt_gemini`

Transcribe audio to text using Google Gemini with multimodal capabilities

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `provider` | string | Yes | STT provider \(gemini\) |
| `apiKey` | string | Yes | Google API key |
| `model` | string | No | Gemini model to use \(default: gemini-2.5-flash\) |
| `audioFile` | file | No | Audio or video file to transcribe |
| `audioFileReference` | file | No | Reference to audio/video file from previous blocks |
| `audioUrl` | string | No | URL to audio or video file |
| `language` | string | No | Language code \(e.g., "en", "es", "fr"\) or "auto" for auto-detection |
| `timestamps` | string | No | Timestamp granularity: none, sentence, or word |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `transcript` | string | Full transcribed text |
| `segments` | array | Timestamped segments |
| `language` | string | Detected or specified language |
| `duration` | number | Audio duration in seconds |
| `confidence` | number | Overall confidence score |



## Notes

- Category: `tools`
- Type: `stt`
```

--------------------------------------------------------------------------------

---[FILE: supabase.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/supabase.mdx

```text
---
title: Supabase
description: Use Supabase database
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="supabase"
  color="#1C1C1C"
/>

{/* MANUAL-CONTENT-START:intro */}
[Supabase](https://www.supabase.com/) is a powerful open-source backend-as-a-service platform that provides developers with a suite of tools to build, scale, and manage modern applications. Supabase offers a fully managed [PostgreSQL](https://www.postgresql.org/) database, robust authentication, instant RESTful and GraphQL APIs, real-time subscriptions, file storage, and edge functions—all accessible through a unified and developer-friendly interface. Its open-source nature and compatibility with popular frameworks make it a compelling alternative to Firebase, with the added benefit of SQL flexibility and transparency.

**Why Supabase?**
- **Instant APIs:** Every table and view in your database is instantly available via REST and GraphQL endpoints, making it easy to build data-driven applications without writing custom backend code.
- **Real-time Data:** Supabase enables real-time subscriptions, allowing your apps to react instantly to changes in your database.
- **Authentication & Authorization:** Built-in user management with support for email, OAuth, SSO, and more, plus row-level security for granular access control.
- **Storage:** Securely upload, serve, and manage files with built-in storage that integrates seamlessly with your database.
- **Edge Functions:** Deploy serverless functions close to your users for low-latency custom logic.

**Using Supabase in Sim**

Sim’s Supabase integration makes it effortless to connect your agentic workflows to your Supabase projects. With just a few configuration fields—your Project ID, Table name, and Service Role Secret—you can securely interact with your database directly from your Sim blocks. The integration abstracts away the complexity of API calls, letting you focus on building logic and automations.

**Key benefits of using Supabase in Sim:**
- **No-code/low-code database operations:** Query, insert, update, and delete rows in your Supabase tables without writing SQL or backend code.
- **Flexible querying:** Use [PostgREST filter syntax](https://postgrest.org/en/stable/api.html#operators) to perform advanced queries, including filtering, ordering, and limiting results.
- **Seamless integration:** Easily connect Supabase to other tools and services in your workflow, enabling powerful automations such as syncing data, triggering notifications, or enriching records.
- **Secure and scalable:** All operations use your Supabase Service Role Secret, ensuring secure access to your data with the scalability of a managed cloud platform.

Whether you’re building internal tools, automating business processes, or powering production applications, Supabase in Sim provides a fast, reliable, and developer-friendly way to manage your data and backend logic—no infrastructure management required. Simply configure your block, select the operation you need, and let Sim handle the rest.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Supabase into the workflow. Supports database operations (query, insert, update, delete, upsert), full-text search, RPC functions, row counting, vector search, and complete storage management (upload, download, list, move, copy, delete files and buckets).



## Tools

### `supabase_query`

Query data from a Supabase table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `table` | string | Yes | The name of the Supabase table to query |
| `filter` | string | No | PostgREST filter \(e.g., "id=eq.123"\) |
| `orderBy` | string | No | Column to order by \(add DESC for descending\) |
| `limit` | number | No | Maximum number of rows to return |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | array | Array of records returned from the query |

### `supabase_insert`

Insert data into a Supabase table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `table` | string | Yes | The name of the Supabase table to insert data into |
| `data` | array | Yes | The data to insert \(array of objects or a single object\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | array | Array of inserted records |

### `supabase_get_row`

Get a single row from a Supabase table based on filter criteria

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `table` | string | Yes | The name of the Supabase table to query |
| `filter` | string | Yes | PostgREST filter to find the specific row \(e.g., "id=eq.123"\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | array | Array containing the row data if found, empty array if not found |

### `supabase_update`

Update rows in a Supabase table based on filter criteria

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `table` | string | Yes | The name of the Supabase table to update |
| `filter` | string | Yes | PostgREST filter to identify rows to update \(e.g., "id=eq.123"\) |
| `data` | object | Yes | Data to update in the matching rows |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | array | Array of updated records |

### `supabase_delete`

Delete rows from a Supabase table based on filter criteria

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `table` | string | Yes | The name of the Supabase table to delete from |
| `filter` | string | Yes | PostgREST filter to identify rows to delete \(e.g., "id=eq.123"\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | array | Array of deleted records |

### `supabase_upsert`

Insert or update data in a Supabase table (upsert operation)

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `table` | string | Yes | The name of the Supabase table to upsert data into |
| `data` | array | Yes | The data to upsert \(insert or update\) - array of objects or a single object |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | array | Array of upserted records |

### `supabase_count`

Count rows in a Supabase table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `table` | string | Yes | The name of the Supabase table to count rows from |
| `filter` | string | No | PostgREST filter \(e.g., "status=eq.active"\) |
| `countType` | string | No | Count type: exact, planned, or estimated \(default: exact\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `count` | number | Number of rows matching the filter |

### `supabase_text_search`

Perform full-text search on a Supabase table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `table` | string | Yes | The name of the Supabase table to search |
| `column` | string | Yes | The column to search in |
| `query` | string | Yes | The search query |
| `searchType` | string | No | Search type: plain, phrase, or websearch \(default: websearch\) |
| `language` | string | No | Language for text search configuration \(default: english\) |
| `limit` | number | No | Maximum number of rows to return |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | array | Array of records matching the search query |

### `supabase_vector_search`

Perform similarity search using pgvector in a Supabase table

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `functionName` | string | Yes | The name of the PostgreSQL function that performs vector search \(e.g., match_documents\) |
| `queryEmbedding` | array | Yes | The query vector/embedding to search for similar items |
| `matchThreshold` | number | No | Minimum similarity threshold \(0-1\), typically 0.7-0.9 |
| `matchCount` | number | No | Maximum number of results to return \(default: 10\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | array | Array of records with similarity scores from the vector search. Each record includes a similarity field \(0-1\) indicating how similar it is to the query vector. |

### `supabase_rpc`

Call a PostgreSQL function in Supabase

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `functionName` | string | Yes | The name of the PostgreSQL function to call |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | json | Result returned from the function |

### `supabase_storage_upload`

Upload a file to a Supabase storage bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Yes | The name of the storage bucket |
| `path` | string | Yes | The path where the file will be stored \(e.g., "folder/file.jpg"\) |
| `fileContent` | string | Yes | The file content \(base64 encoded for binary files, or plain text\) |
| `contentType` | string | No | MIME type of the file \(e.g., "image/jpeg", "text/plain"\) |
| `upsert` | boolean | No | If true, overwrites existing file \(default: false\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | object | Upload result including file path and metadata |

### `supabase_storage_download`

Download a file from a Supabase storage bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Yes | The name of the storage bucket |
| `path` | string | Yes | The path to the file to download \(e.g., "folder/file.jpg"\) |
| `fileName` | string | No | Optional filename override |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `file` | file | Downloaded file stored in execution files |

### `supabase_storage_list`

List files in a Supabase storage bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Yes | The name of the storage bucket |
| `path` | string | No | The folder path to list files from \(default: root\) |
| `limit` | number | No | Maximum number of files to return \(default: 100\) |
| `offset` | number | No | Number of files to skip \(for pagination\) |
| `sortBy` | string | No | Column to sort by: name, created_at, updated_at \(default: name\) |
| `sortOrder` | string | No | Sort order: asc or desc \(default: asc\) |
| `search` | string | No | Search term to filter files by name |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | array | Array of file objects with metadata |

### `supabase_storage_delete`

Delete files from a Supabase storage bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Yes | The name of the storage bucket |
| `paths` | array | Yes | Array of file paths to delete \(e.g., \["folder/file1.jpg", "folder/file2.jpg"\]\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | array | Array of deleted file objects |

### `supabase_storage_move`

Move a file within a Supabase storage bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Yes | The name of the storage bucket |
| `fromPath` | string | Yes | The current path of the file \(e.g., "folder/old.jpg"\) |
| `toPath` | string | Yes | The new path for the file \(e.g., "newfolder/new.jpg"\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | object | Move operation result |

### `supabase_storage_copy`

Copy a file within a Supabase storage bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Yes | The name of the storage bucket |
| `fromPath` | string | Yes | The path of the source file \(e.g., "folder/source.jpg"\) |
| `toPath` | string | Yes | The path for the copied file \(e.g., "folder/copy.jpg"\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | object | Copy operation result |

### `supabase_storage_create_bucket`

Create a new storage bucket in Supabase

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Yes | The name of the bucket to create |
| `isPublic` | boolean | No | Whether the bucket should be publicly accessible \(default: false\) |
| `fileSizeLimit` | number | No | Maximum file size in bytes \(optional\) |
| `allowedMimeTypes` | array | No | Array of allowed MIME types \(e.g., \["image/png", "image/jpeg"\]\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | object | Created bucket information |

### `supabase_storage_list_buckets`

List all storage buckets in Supabase

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | array | Array of bucket objects |

### `supabase_storage_delete_bucket`

Delete a storage bucket in Supabase

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Yes | The name of the bucket to delete |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `results` | object | Delete operation result |

### `supabase_storage_get_public_url`

Get the public URL for a file in a Supabase storage bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Yes | The name of the storage bucket |
| `path` | string | Yes | The path to the file \(e.g., "folder/file.jpg"\) |
| `download` | boolean | No | If true, forces download instead of inline display \(default: false\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `publicUrl` | string | The public URL to access the file |

### `supabase_storage_create_signed_url`

Create a temporary signed URL for a file in a Supabase storage bucket

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `projectId` | string | Yes | Your Supabase project ID \(e.g., jdrkgepadsdopsntdlom\) |
| `bucket` | string | Yes | The name of the storage bucket |
| `path` | string | Yes | The path to the file \(e.g., "folder/file.jpg"\) |
| `expiresIn` | number | Yes | Number of seconds until the URL expires \(e.g., 3600 for 1 hour\) |
| `download` | boolean | No | If true, forces download instead of inline display \(default: false\) |
| `apiKey` | string | Yes | Your Supabase service role secret key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `message` | string | Operation status message |
| `signedUrl` | string | The temporary signed URL to access the file |



## Notes

- Category: `tools`
- Type: `supabase`
```

--------------------------------------------------------------------------------

---[FILE: tavily.mdx]---
Location: sim-main/apps/docs/content/docs/en/tools/tavily.mdx

```text
---
title: Tavily
description: Search and extract information
---

import { BlockInfoCard } from "@/components/ui/block-info-card"

<BlockInfoCard 
  type="tavily"
  color="#0066FF"
/>

{/* MANUAL-CONTENT-START:intro */}
[Tavily](https://www.tavily.com/) is an AI-powered search API designed specifically for LLM applications. It provides reliable, real-time information retrieval capabilities with features optimized for AI use cases, including semantic search, content extraction, and structured data retrieval.

With Tavily, you can:

- **Perform contextual searches**: Get relevant results based on semantic understanding rather than just keyword matching
- **Extract structured content**: Pull specific information from web pages in a clean, usable format
- **Access real-time information**: Retrieve up-to-date data from across the web
- **Process multiple URLs simultaneously**: Extract content from several web pages in a single request
- **Receive AI-optimized results**: Get search results specifically formatted for consumption by AI systems

In Sim, the Tavily integration enables your agents to search the web and extract information as part of their workflows. This allows for sophisticated automation scenarios that require up-to-date information from the internet. Your agents can formulate search queries, retrieve relevant results, and extract content from specific web pages to inform their decision-making processes. This integration bridges the gap between your workflow automation and the vast knowledge available on the web, enabling your agents to access real-time information without manual intervention. By connecting Sim with Tavily, you can create agents that stay current with the latest information, provide more accurate responses, and deliver more value to users.
{/* MANUAL-CONTENT-END */}


## Usage Instructions

Integrate Tavily into the workflow. Can search the web and extract content from specific URLs. Requires API Key.



## Tools

### `tavily_search`

Perform AI-powered web searches using Tavily

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `query` | string | Yes | The search query to execute |
| `max_results` | number | No | Maximum number of results \(1-20\) |
| `topic` | string | No | Category type: general, news, or finance \(default: general\) |
| `search_depth` | string | No | Search scope: basic \(1 credit\) or advanced \(2 credits\) \(default: basic\) |
| `include_answer` | string | No | LLM-generated response: true/basic for quick answer or advanced for detailed |
| `include_raw_content` | string | No | Parsed HTML content: true/markdown or text format |
| `include_images` | boolean | No | Include image search results |
| `include_image_descriptions` | boolean | No | Add descriptive text for images |
| `include_favicon` | boolean | No | Include favicon URLs |
| `chunks_per_source` | number | No | Maximum number of relevant chunks per source \(1-3, default: 3\) |
| `time_range` | string | No | Filter by recency: day/d, week/w, month/m, year/y |
| `start_date` | string | No | Earliest publication date \(YYYY-MM-DD format\) |
| `end_date` | string | No | Latest publication date \(YYYY-MM-DD format\) |
| `include_domains` | string | No | Comma-separated list of domains to whitelist \(max 300\) |
| `exclude_domains` | string | No | Comma-separated list of domains to blacklist \(max 150\) |
| `country` | string | No | Boost results from specified country \(general topic only\) |
| `auto_parameters` | boolean | No | Automatic parameter configuration based on query intent |
| `apiKey` | string | Yes | Tavily API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `query` | string | The search query that was executed |
| `results` | array | results output from the tool |

### `tavily_extract`

Extract raw content from multiple web pages simultaneously using Tavily

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `urls` | string | Yes | URL or array of URLs to extract content from |
| `extract_depth` | string | No | The depth of extraction \(basic=1 credit/5 URLs, advanced=2 credits/5 URLs\) |
| `format` | string | No | Output format: markdown or text \(default: markdown\) |
| `include_images` | boolean | No | Incorporate images in extraction output |
| `include_favicon` | boolean | No | Add favicon URL for each result |
| `apiKey` | string | Yes | Tavily API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | The URL that was extracted |

### `tavily_crawl`

Systematically crawl and extract content from websites using Tavily

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | string | Yes | The root URL to begin the crawl |
| `instructions` | string | No | Natural language directions for the crawler \(costs 2 credits per 10 pages\) |
| `max_depth` | number | No | How far from base URL to explore \(1-5, default: 1\) |
| `max_breadth` | number | No | Links followed per page level \(≥1, default: 20\) |
| `limit` | number | No | Total links processed before stopping \(≥1, default: 50\) |
| `select_paths` | string | No | Comma-separated regex patterns to include specific URL paths \(e.g., /docs/.*\) |
| `select_domains` | string | No | Comma-separated regex patterns to restrict crawling to certain domains |
| `exclude_paths` | string | No | Comma-separated regex patterns to skip specific URL paths |
| `exclude_domains` | string | No | Comma-separated regex patterns to block certain domains |
| `allow_external` | boolean | No | Include external domain links in results \(default: true\) |
| `include_images` | boolean | No | Incorporate images in crawl output |
| `extract_depth` | string | No | Extraction depth: basic \(1 credit/5 pages\) or advanced \(2 credits/5 pages\) |
| `format` | string | No | Output format: markdown or text \(default: markdown\) |
| `include_favicon` | boolean | No | Add favicon URL for each result |
| `apiKey` | string | Yes | Tavily API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `base_url` | string | The base URL that was crawled |
| `results` | array | The crawled page URL |

### `tavily_map`

Discover and visualize website structure using Tavily

#### Input

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | string | Yes | The root URL to begin mapping |
| `instructions` | string | No | Natural language guidance for mapping behavior \(costs 2 credits per 10 pages\) |
| `max_depth` | number | No | How far from base URL to explore \(1-5, default: 1\) |
| `max_breadth` | number | No | Links to follow per level \(default: 20\) |
| `limit` | number | No | Total links to process \(default: 50\) |
| `select_paths` | string | No | Comma-separated regex patterns for URL path filtering \(e.g., /docs/.*\) |
| `select_domains` | string | No | Comma-separated regex patterns to restrict mapping to specific domains |
| `exclude_paths` | string | No | Comma-separated regex patterns to exclude specific URL paths |
| `exclude_domains` | string | No | Comma-separated regex patterns to exclude domains |
| `allow_external` | boolean | No | Include external domain links in results \(default: true\) |
| `apiKey` | string | Yes | Tavily API Key |

#### Output

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `base_url` | string | The base URL that was mapped |
| `results` | array | Discovered URL |



## Notes

- Category: `tools`
- Type: `tavily`
```

--------------------------------------------------------------------------------

````
