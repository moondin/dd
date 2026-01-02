---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 765
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 765 of 933)

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

---[FILE: deepgram.ts]---
Location: sim-main/apps/sim/tools/stt/deepgram.ts

```typescript
import type { SttParams, SttResponse } from '@/tools/stt/types'
import type { ToolConfig } from '@/tools/types'

export const deepgramSttTool: ToolConfig<SttParams, SttResponse> = {
  id: 'stt_deepgram',
  name: 'Deepgram STT',
  description: 'Transcribe audio to text using Deepgram',
  version: '1.0.0',

  params: {
    provider: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'STT provider (deepgram)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Deepgram API key',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Deepgram model to use (nova-3, nova-2, whisper-large, etc.)',
    },
    audioFile: {
      type: 'file',
      required: false,
      visibility: 'user-or-llm',
      description: 'Audio or video file to transcribe',
    },
    audioFileReference: {
      type: 'file',
      required: false,
      visibility: 'user-or-llm',
      description: 'Reference to audio/video file from previous blocks',
    },
    audioUrl: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL to audio or video file',
    },
    language: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Language code (e.g., "en", "es", "fr") or "auto" for auto-detection',
    },
    timestamps: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Timestamp granularity: none, sentence, or word',
    },
    diarization: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Enable speaker diarization',
    },
  },

  request: {
    url: '/api/proxy/stt',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: SttParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'deepgram',
      apiKey: params.apiKey,
      model: params.model,
      audioFile: params.audioFile,
      audioFileReference: params.audioFileReference,
      audioUrl: params.audioUrl,
      language: params.language || 'auto',
      timestamps: params.timestamps || 'none',
      diarization: params.diarization || false,
      workspaceId: params._context?.workspaceId,
      workflowId: params._context?.workflowId,
      executionId: params._context?.executionId,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error || 'Transcription failed',
        output: {
          transcript: '',
        },
      }
    }

    return {
      success: true,
      output: {
        transcript: data.transcript,
        segments: data.segments,
        language: data.language,
        duration: data.duration,
        confidence: data.confidence,
      },
    }
  },

  outputs: {
    transcript: { type: 'string', description: 'Full transcribed text' },
    segments: { type: 'array', description: 'Timestamped segments with speaker labels' },
    language: { type: 'string', description: 'Detected or specified language' },
    duration: { type: 'number', description: 'Audio duration in seconds' },
    confidence: { type: 'number', description: 'Overall confidence score' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: elevenlabs.ts]---
Location: sim-main/apps/sim/tools/stt/elevenlabs.ts

```typescript
import type { SttParams, SttResponse } from '@/tools/stt/types'
import type { ToolConfig } from '@/tools/types'

export const elevenLabsSttTool: ToolConfig<SttParams, SttResponse> = {
  id: 'stt_elevenlabs',
  name: 'ElevenLabs STT',
  description: 'Transcribe audio to text using ElevenLabs',
  version: '1.0.0',

  params: {
    provider: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'STT provider (elevenlabs)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ElevenLabs API key',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'ElevenLabs model to use (scribe_v1, scribe_v1_experimental)',
    },
    audioFile: {
      type: 'file',
      required: false,
      visibility: 'user-or-llm',
      description: 'Audio or video file to transcribe',
    },
    audioFileReference: {
      type: 'file',
      required: false,
      visibility: 'user-or-llm',
      description: 'Reference to audio/video file from previous blocks',
    },
    audioUrl: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL to audio or video file',
    },
    language: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Language code (e.g., "en", "es", "fr") or "auto" for auto-detection',
    },
    timestamps: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Timestamp granularity: none, sentence, or word',
    },
  },

  request: {
    url: '/api/proxy/stt',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: SttParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'elevenlabs',
      apiKey: params.apiKey,
      model: params.model,
      audioFile: params.audioFile,
      audioFileReference: params.audioFileReference,
      audioUrl: params.audioUrl,
      language: params.language || 'auto',
      timestamps: params.timestamps || 'none',
      workspaceId: params._context?.workspaceId,
      workflowId: params._context?.workflowId,
      executionId: params._context?.executionId,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error || 'Transcription failed',
        output: {
          transcript: '',
        },
      }
    }

    return {
      success: true,
      output: {
        transcript: data.transcript,
        segments: data.segments,
        language: data.language,
        duration: data.duration,
        confidence: data.confidence,
      },
    }
  },

  outputs: {
    transcript: { type: 'string', description: 'Full transcribed text' },
    segments: { type: 'array', description: 'Timestamped segments' },
    language: { type: 'string', description: 'Detected or specified language' },
    duration: { type: 'number', description: 'Audio duration in seconds' },
    confidence: { type: 'number', description: 'Overall confidence score' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: gemini.ts]---
Location: sim-main/apps/sim/tools/stt/gemini.ts

```typescript
import type { SttParams, SttResponse } from '@/tools/stt/types'
import type { ToolConfig } from '@/tools/types'

export const geminiSttTool: ToolConfig<SttParams, SttResponse> = {
  id: 'stt_gemini',
  name: 'Google Gemini STT',
  description: 'Transcribe audio to text using Google Gemini with multimodal capabilities',
  version: '1.0.0',

  params: {
    provider: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'STT provider (gemini)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Google API key',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Gemini model to use (default: gemini-2.5-flash)',
    },
    audioFile: {
      type: 'file',
      required: false,
      visibility: 'user-or-llm',
      description: 'Audio or video file to transcribe',
    },
    audioFileReference: {
      type: 'file',
      required: false,
      visibility: 'user-or-llm',
      description: 'Reference to audio/video file from previous blocks',
    },
    audioUrl: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL to audio or video file',
    },
    language: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Language code (e.g., "en", "es", "fr") or "auto" for auto-detection',
    },
    timestamps: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Timestamp granularity: none, sentence, or word',
    },
  },

  request: {
    url: '/api/proxy/stt',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: SttParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'gemini',
      apiKey: params.apiKey,
      model: params.model,
      audioFile: params.audioFile,
      audioFileReference: params.audioFileReference,
      audioUrl: params.audioUrl,
      language: params.language || 'auto',
      timestamps: params.timestamps || 'none',
      workspaceId: params._context?.workspaceId,
      workflowId: params._context?.workflowId,
      executionId: params._context?.executionId,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error || 'Transcription failed',
        output: {
          transcript: '',
        },
      }
    }

    return {
      success: true,
      output: {
        transcript: data.transcript,
        segments: data.segments,
        language: data.language,
        duration: data.duration,
        confidence: data.confidence,
      },
    }
  },

  outputs: {
    transcript: { type: 'string', description: 'Full transcribed text' },
    segments: { type: 'array', description: 'Timestamped segments' },
    language: { type: 'string', description: 'Detected or specified language' },
    duration: { type: 'number', description: 'Audio duration in seconds' },
    confidence: { type: 'number', description: 'Overall confidence score' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/stt/index.ts

```typescript
import { assemblyaiSttTool } from '@/tools/stt/assemblyai'
import { deepgramSttTool } from '@/tools/stt/deepgram'
import { elevenLabsSttTool } from '@/tools/stt/elevenlabs'
import { geminiSttTool } from '@/tools/stt/gemini'
import { whisperSttTool } from '@/tools/stt/whisper'

export { whisperSttTool, deepgramSttTool, elevenLabsSttTool, assemblyaiSttTool, geminiSttTool }
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/stt/types.ts

```typescript
import type { UserFile } from '@/executor/types'
import type { ToolResponse } from '@/tools/types'

export interface SttParams {
  provider: 'whisper' | 'deepgram' | 'elevenlabs' | 'assemblyai' | 'gemini'
  apiKey: string
  model?: string
  audioFile?: UserFile | UserFile[]
  audioFileReference?: UserFile | UserFile[]
  audioUrl?: string
  language?: string
  timestamps?: 'none' | 'sentence' | 'word'
  diarization?: boolean
  translateToEnglish?: boolean
  // AssemblyAI-specific options
  sentiment?: boolean
  entityDetection?: boolean
  piiRedaction?: boolean
  summarization?: boolean
}

export interface TranscriptSegment {
  text: string
  start: number
  end: number
  speaker?: string
  confidence?: number
}

export interface SttResponse extends ToolResponse {
  output: {
    transcript: string
    segments?: TranscriptSegment[]
    language?: string
    duration?: number
    confidence?: number
    // AssemblyAI-specific outputs
    sentiment?: any[]
    entities?: any[]
    summary?: string
  }
}

export interface SttBlockResponse extends ToolResponse {
  output: {
    transcript: string
    segments?: TranscriptSegment[]
    language?: string
    duration?: number
    confidence?: number
    // AssemblyAI-specific outputs
    sentiment?: any[]
    entities?: any[]
    summary?: string
  }
}

// Provider-specific types

export interface WhisperParams extends Omit<SttParams, 'provider'> {
  model?: string
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
  temperature?: number
}

export interface DeepgramParams extends Omit<SttParams, 'provider'> {
  model?: string
  punctuate?: boolean
  paragraphs?: boolean
  utterances?: boolean
}

export interface ElevenLabsSttParams extends Omit<SttParams, 'provider'> {
  model?: string
}

export interface AssemblyAIParams extends Omit<SttParams, 'provider'> {
  model?: string
  sentiment?: boolean
  entityDetection?: boolean
  piiRedaction?: boolean
  summarization?: boolean
}

export interface GeminiParams extends Omit<SttParams, 'provider'> {
  model?: string
}
```

--------------------------------------------------------------------------------

---[FILE: whisper.ts]---
Location: sim-main/apps/sim/tools/stt/whisper.ts

```typescript
import type { SttParams, SttResponse } from '@/tools/stt/types'
import type { ToolConfig } from '@/tools/types'

export const whisperSttTool: ToolConfig<SttParams, SttResponse> = {
  id: 'stt_whisper',
  name: 'OpenAI Whisper STT',
  description: 'Transcribe audio to text using OpenAI Whisper',
  version: '1.0.0',

  params: {
    provider: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'STT provider (whisper)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'OpenAI API key',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whisper model to use (default: whisper-1)',
    },
    audioFile: {
      type: 'file',
      required: false,
      visibility: 'user-or-llm',
      description: 'Audio or video file to transcribe',
    },
    audioFileReference: {
      type: 'file',
      required: false,
      visibility: 'user-or-llm',
      description: 'Reference to audio/video file from previous blocks',
    },
    audioUrl: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL to audio or video file',
    },
    language: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Language code (e.g., "en", "es", "fr") or "auto" for auto-detection',
    },
    timestamps: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Timestamp granularity: none, sentence, or word',
    },
    translateToEnglish: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Translate audio to English',
    },
    prompt: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        "Optional text to guide the model's style or continue a previous audio segment. Helps with proper nouns and context.",
    },
    temperature: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Sampling temperature between 0 and 1. Higher values make output more random, lower values more focused and deterministic.',
    },
  },

  request: {
    url: '/api/proxy/stt',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: SttParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'whisper',
      apiKey: params.apiKey,
      model: params.model,
      audioFile: params.audioFile,
      audioFileReference: params.audioFileReference,
      audioUrl: params.audioUrl,
      language: params.language || 'auto',
      timestamps: params.timestamps || 'none',
      translateToEnglish: params.translateToEnglish || false,
      prompt: (params as any).prompt,
      temperature: (params as any).temperature,
      workspaceId: params._context?.workspaceId,
      workflowId: params._context?.workflowId,
      executionId: params._context?.executionId,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error || 'Transcription failed',
        output: {
          transcript: '',
        },
      }
    }

    return {
      success: true,
      output: {
        transcript: data.transcript,
        segments: data.segments,
        language: data.language,
        duration: data.duration,
      },
    }
  },

  outputs: {
    transcript: { type: 'string', description: 'Full transcribed text' },
    segments: { type: 'array', description: 'Timestamped segments' },
    language: { type: 'string', description: 'Detected or specified language' },
    duration: { type: 'number', description: 'Audio duration in seconds' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: count.ts]---
Location: sim-main/apps/sim/tools/supabase/count.ts

```typescript
import type { SupabaseCountParams, SupabaseCountResponse } from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const countTool: ToolConfig<SupabaseCountParams, SupabaseCountResponse> = {
  id: 'supabase_count',
  name: 'Supabase Count',
  description: 'Count rows in a Supabase table',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the Supabase table to count rows from',
    },
    filter: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'PostgREST filter (e.g., "status=eq.active")',
    },
    countType: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Count type: exact, planned, or estimated (default: exact)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      let url = `https://${params.projectId}.supabase.co/rest/v1/${params.table}?select=*`

      // Add filters if provided
      if (params.filter?.trim()) {
        url += `&${params.filter.trim()}`
      }

      return url
    },
    method: 'HEAD',
    headers: (params) => {
      const countType = params.countType || 'exact'
      return {
        apikey: params.apiKey,
        Authorization: `Bearer ${params.apiKey}`,
        Prefer: `count=${countType}`,
      }
    },
  },

  transformResponse: async (response: Response) => {
    // Extract count from Content-Range header
    const contentRange = response.headers.get('content-range')

    if (!contentRange) {
      throw new Error('No content-range header found in response')
    }

    // Parse the content-range header (format: "0-9/100" or "*/100")
    const countMatch = contentRange.match(/\/(\d+)$/)

    if (!countMatch) {
      throw new Error(`Invalid content-range header format: ${contentRange}`)
    }

    const count = Number.parseInt(countMatch[1], 10)

    return {
      success: true,
      output: {
        message: `Successfully counted ${count} row${count === 1 ? '' : 's'}`,
        count: count,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    count: { type: 'number', description: 'Number of rows matching the filter' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/supabase/delete.ts

```typescript
import type { SupabaseDeleteParams, SupabaseDeleteResponse } from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const deleteTool: ToolConfig<SupabaseDeleteParams, SupabaseDeleteResponse> = {
  id: 'supabase_delete',
  name: 'Supabase Delete Row',
  description: 'Delete rows from a Supabase table based on filter criteria',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the Supabase table to delete from',
    },
    filter: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'PostgREST filter to identify rows to delete (e.g., "id=eq.123")',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      // Construct the URL for the Supabase REST API with select to return deleted data
      let url = `https://${params.projectId}.supabase.co/rest/v1/${params.table}?select=*`

      // Add filters (required for delete) - using PostgREST syntax
      if (params.filter?.trim()) {
        url += `&${params.filter.trim()}`
      } else {
        throw new Error(
          'Filter is required for delete operations to prevent accidental deletion of all rows'
        )
      }

      return url
    },
    method: 'DELETE',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
      Prefer: 'return=representation',
    }),
  },

  transformResponse: async (response: Response) => {
    const text = await response.text()
    let data

    if (text?.trim()) {
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        throw new Error(`Failed to parse Supabase response: ${parseError}`)
      }
    } else {
      data = []
    }

    const deletedCount = Array.isArray(data) ? data.length : 0

    if (deletedCount === 0) {
      return {
        success: true,
        output: {
          message: 'No rows were deleted (no matching records found)',
          results: data,
        },
        error: undefined,
      }
    }

    return {
      success: true,
      output: {
        message: `Successfully deleted ${deletedCount} row${deletedCount === 1 ? '' : 's'}`,
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: { type: 'array', description: 'Array of deleted records' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_row.ts]---
Location: sim-main/apps/sim/tools/supabase/get_row.ts

```typescript
import type { SupabaseGetRowParams, SupabaseGetRowResponse } from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const getRowTool: ToolConfig<SupabaseGetRowParams, SupabaseGetRowResponse> = {
  id: 'supabase_get_row',
  name: 'Supabase Get Row',
  description: 'Get a single row from a Supabase table based on filter criteria',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the Supabase table to query',
    },
    filter: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'PostgREST filter to find the specific row (e.g., "id=eq.123")',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      // Construct the URL for the Supabase REST API
      let url = `https://${params.projectId}.supabase.co/rest/v1/${params.table}?select=*`

      // Add filters (required for get_row) - using PostgREST syntax
      if (params.filter?.trim()) {
        url += `&${params.filter.trim()}`
      }

      // Limit to 1 row since we want a single row
      url += `&limit=1`

      return url
    },
    method: 'GET',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase response: ${parseError}`)
    }

    const rowFound = data.length > 0
    const results = rowFound ? [data[0]] : []

    return {
      success: true,
      output: {
        message: rowFound ? 'Successfully found 1 row' : 'No row found matching the criteria',
        results: results,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: {
      type: 'array',
      description: 'Array containing the row data if found, empty array if not found',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/supabase/index.ts

```typescript
import { countTool } from '@/tools/supabase/count'
import { deleteTool } from '@/tools/supabase/delete'
import { getRowTool } from '@/tools/supabase/get_row'
import { insertTool } from '@/tools/supabase/insert'
import { queryTool } from '@/tools/supabase/query'
import { rpcTool } from '@/tools/supabase/rpc'
import { storageCopyTool } from '@/tools/supabase/storage_copy'
import { storageCreateBucketTool } from '@/tools/supabase/storage_create_bucket'
import { storageCreateSignedUrlTool } from '@/tools/supabase/storage_create_signed_url'
import { storageDeleteTool } from '@/tools/supabase/storage_delete'
import { storageDeleteBucketTool } from '@/tools/supabase/storage_delete_bucket'
import { storageDownloadTool } from '@/tools/supabase/storage_download'
import { storageGetPublicUrlTool } from '@/tools/supabase/storage_get_public_url'
import { storageListTool } from '@/tools/supabase/storage_list'
import { storageListBucketsTool } from '@/tools/supabase/storage_list_buckets'
import { storageMoveTool } from '@/tools/supabase/storage_move'
import { storageUploadTool } from '@/tools/supabase/storage_upload'
import { textSearchTool } from '@/tools/supabase/text_search'
import { updateTool } from '@/tools/supabase/update'
import { upsertTool } from '@/tools/supabase/upsert'
import { vectorSearchTool } from '@/tools/supabase/vector_search'

export const supabaseQueryTool = queryTool
export const supabaseInsertTool = insertTool
export const supabaseGetRowTool = getRowTool
export const supabaseUpdateTool = updateTool
export const supabaseDeleteTool = deleteTool
export const supabaseUpsertTool = upsertTool
export const supabaseVectorSearchTool = vectorSearchTool
export const supabaseRpcTool = rpcTool
export const supabaseTextSearchTool = textSearchTool
export const supabaseCountTool = countTool
export const supabaseStorageUploadTool = storageUploadTool
export const supabaseStorageDownloadTool = storageDownloadTool
export const supabaseStorageListTool = storageListTool
export const supabaseStorageDeleteTool = storageDeleteTool
export const supabaseStorageMoveTool = storageMoveTool
export const supabaseStorageCopyTool = storageCopyTool
export const supabaseStorageCreateBucketTool = storageCreateBucketTool
export const supabaseStorageListBucketsTool = storageListBucketsTool
export const supabaseStorageDeleteBucketTool = storageDeleteBucketTool
export const supabaseStorageGetPublicUrlTool = storageGetPublicUrlTool
export const supabaseStorageCreateSignedUrlTool = storageCreateSignedUrlTool
```

--------------------------------------------------------------------------------

---[FILE: insert.ts]---
Location: sim-main/apps/sim/tools/supabase/insert.ts

```typescript
import type { SupabaseInsertParams, SupabaseInsertResponse } from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const insertTool: ToolConfig<SupabaseInsertParams, SupabaseInsertResponse> = {
  id: 'supabase_insert',
  name: 'Supabase Insert',
  description: 'Insert data into a Supabase table',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the Supabase table to insert data into',
    },
    data: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'The data to insert (array of objects or a single object)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => `https://${params.projectId}.supabase.co/rest/v1/${params.table}?select=*`,
    method: 'POST',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: (params) => {
      // Prepare the data - if it's an object but not an array, wrap it in an array
      const dataToSend =
        typeof params.data === 'object' && !Array.isArray(params.data) ? [params.data] : params.data

      return dataToSend
    },
  },

  transformResponse: async (response: Response) => {
    const text = await response.text()

    if (!text || text.trim() === '') {
      return {
        success: true,
        output: {
          message: 'Successfully inserted data into Supabase (no data returned)',
          results: [],
        },
        error: undefined,
      }
    }

    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase response: ${parseError}`)
    }

    // Check if results array is empty and provide better feedback
    const resultsArray = Array.isArray(data) ? data : [data]
    const isEmpty = resultsArray.length === 0 || (resultsArray.length === 1 && !resultsArray[0])

    if (isEmpty) {
      return {
        success: false,
        output: {
          message: 'No data was inserted into Supabase',
          results: data,
        },
        error:
          'No data was inserted into Supabase. This usually indicates invalid data format or schema mismatch. Please check that your JSON is valid and matches your table schema.',
      }
    }

    const insertedCount = resultsArray.length
    return {
      success: true,
      output: {
        message: `Successfully inserted ${insertedCount} row${insertedCount === 1 ? '' : 's'} into Supabase`,
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: { type: 'array', description: 'Array of inserted records' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: query.ts]---
Location: sim-main/apps/sim/tools/supabase/query.ts

```typescript
import type { SupabaseQueryParams, SupabaseQueryResponse } from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const queryTool: ToolConfig<SupabaseQueryParams, SupabaseQueryResponse> = {
  id: 'supabase_query',
  name: 'Supabase Query',
  description: 'Query data from a Supabase table',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the Supabase table to query',
    },
    filter: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'PostgREST filter (e.g., "id=eq.123")',
    },
    orderBy: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Column to order by (add DESC for descending)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of rows to return',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      // Construct the URL for the Supabase REST API
      let url = `https://${params.projectId}.supabase.co/rest/v1/${params.table}?select=*`

      // Add filters if provided - using PostgREST syntax
      if (params.filter?.trim()) {
        url += `&${params.filter.trim()}`
      }

      // Add order by if provided
      if (params.orderBy) {
        let orderParam = params.orderBy.trim()

        // Check if DESC is specified (case-insensitive)
        if (/\s+DESC$/i.test(orderParam)) {
          orderParam = `${orderParam.replace(/\s+DESC$/i, '').trim()}.desc`
        }
        // Check if ASC is specified (case-insensitive)
        else if (/\s+ASC$/i.test(orderParam)) {
          orderParam = `${orderParam.replace(/\s+ASC$/i, '').trim()}.asc`
        }
        // Default to ascending if no direction specified
        else {
          orderParam = `${orderParam}.asc`
        }

        url += `&order=${orderParam}`
      }

      // Add limit if provided
      if (params.limit) {
        url += `&limit=${Number(params.limit)}`
      }

      return url
    },
    method: 'GET',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase response: ${parseError}`)
    }

    const rowCount = Array.isArray(data) ? data.length : 0

    if (rowCount === 0) {
      return {
        success: true,
        output: {
          message: 'No rows found matching the query criteria',
          results: data,
        },
        error: undefined,
      }
    }

    return {
      success: true,
      output: {
        message: `Successfully queried ${rowCount} row${rowCount === 1 ? '' : 's'} from Supabase`,
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: { type: 'array', description: 'Array of records returned from the query' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: rpc.ts]---
Location: sim-main/apps/sim/tools/supabase/rpc.ts

```typescript
import type { SupabaseRpcParams, SupabaseRpcResponse } from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const rpcTool: ToolConfig<SupabaseRpcParams, SupabaseRpcResponse> = {
  id: 'supabase_rpc',
  name: 'Supabase RPC',
  description: 'Call a PostgreSQL function in Supabase',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    functionName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the PostgreSQL function to call',
    },
    params: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Parameters to pass to the function as a JSON object',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      return `https://${params.projectId}.supabase.co/rest/v1/rpc/${params.functionName}`
    },
    method: 'POST',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      return params.params || {}
    },
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase RPC response: ${parseError}`)
    }

    return {
      success: true,
      output: {
        message: 'Successfully executed PostgreSQL function',
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: { type: 'json', description: 'Result returned from the function' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: storage_copy.ts]---
Location: sim-main/apps/sim/tools/supabase/storage_copy.ts

```typescript
import type { SupabaseStorageCopyParams, SupabaseStorageCopyResponse } from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const storageCopyTool: ToolConfig<SupabaseStorageCopyParams, SupabaseStorageCopyResponse> = {
  id: 'supabase_storage_copy',
  name: 'Supabase Storage Copy',
  description: 'Copy a file within a Supabase storage bucket',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    bucket: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the storage bucket',
    },
    fromPath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The path of the source file (e.g., "folder/source.jpg")',
    },
    toPath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The path for the copied file (e.g., "folder/copy.jpg")',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      return `https://${params.projectId}.supabase.co/storage/v1/object/copy`
    },
    method: 'POST',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      return {
        bucketId: params.bucket,
        sourceKey: params.fromPath,
        destinationKey: params.toPath,
      }
    },
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase storage copy response: ${parseError}`)
    }

    return {
      success: true,
      output: {
        message: 'Successfully copied file in storage',
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: {
      type: 'object',
      description: 'Copy operation result',
    },
  },
}
```

--------------------------------------------------------------------------------

````
