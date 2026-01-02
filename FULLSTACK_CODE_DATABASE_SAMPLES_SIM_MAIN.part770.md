---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 770
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 770 of 933)

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

---[FILE: elevenlabs.ts]---
Location: sim-main/apps/sim/tools/tts/elevenlabs.ts

```typescript
import type { ElevenLabsTtsUnifiedParams, TtsBlockResponse } from '@/tools/tts/types'
import type { ToolConfig } from '@/tools/types'

export const elevenLabsTtsUnifiedTool: ToolConfig<ElevenLabsTtsUnifiedParams, TtsBlockResponse> = {
  id: 'tts_elevenlabs',
  name: 'ElevenLabs TTS',
  description: 'Convert text to speech using ElevenLabs voices',
  version: '1.0.0',

  params: {
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The text to convert to speech',
    },
    voiceId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the voice to use',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ElevenLabs API key',
    },
    modelId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Model to use (e.g., eleven_monolingual_v1, eleven_turbo_v2_5, eleven_flash_v2_5)',
    },
    stability: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Voice stability (0.0 to 1.0, default: 0.5)',
    },
    similarityBoost: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Similarity boost (0.0 to 1.0, default: 0.8)',
    },
    style: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Style exaggeration (0.0 to 1.0)',
    },
    useSpeakerBoost: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Use speaker boost (default: true)',
    },
  },

  request: {
    url: '/api/proxy/tts/unified',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: ElevenLabsTtsUnifiedParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'elevenlabs',
      text: params.text,
      apiKey: params.apiKey,
      voiceId: params.voiceId,
      modelId: params.modelId || 'eleven_turbo_v2_5',
      stability: params.stability ?? 0.5,
      similarityBoost: params.similarityBoost ?? 0.8,
      style: params.style,
      useSpeakerBoost: params.useSpeakerBoost ?? true,
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
        error: data.error || 'TTS generation failed',
        output: {
          audioUrl: '',
        },
      }
    }

    return {
      success: true,
      output: {
        audioUrl: data.audioUrl,
        audioFile: data.audioFile,
        duration: data.duration,
        characterCount: data.characterCount,
        format: data.format,
        provider: data.provider,
      },
    }
  },

  outputs: {
    audioUrl: { type: 'string', description: 'URL to the generated audio file' },
    audioFile: { type: 'file', description: 'Generated audio file object' },
    duration: { type: 'number', description: 'Audio duration in seconds' },
    characterCount: { type: 'number', description: 'Number of characters processed' },
    format: { type: 'string', description: 'Audio format' },
    provider: { type: 'string', description: 'TTS provider used' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: google.ts]---
Location: sim-main/apps/sim/tools/tts/google.ts

```typescript
import type { GoogleTtsParams, TtsBlockResponse } from '@/tools/tts/types'
import type { ToolConfig } from '@/tools/types'

export const googleTtsTool: ToolConfig<GoogleTtsParams, TtsBlockResponse> = {
  id: 'tts_google',
  name: 'Google Cloud TTS',
  description: 'Convert text to speech using Google Cloud Text-to-Speech',
  version: '1.0.0',

  params: {
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The text to convert to speech',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Google Cloud API key',
    },
    voiceId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Voice ID (e.g., en-US-Neural2-A, en-US-Wavenet-D)',
    },
    languageCode: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Language code (e.g., en-US, es-ES, fr-FR)',
    },
    gender: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Voice gender (MALE, FEMALE, NEUTRAL)',
    },
    audioEncoding: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Audio encoding (LINEAR16, MP3, OGG_OPUS, MULAW, ALAW)',
    },
    speakingRate: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Speaking rate (0.25 to 2.0, default: 1.0)',
    },
    pitch: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Voice pitch (-20.0 to 20.0, default: 0.0)',
    },
    volumeGainDb: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Volume gain in dB (-96.0 to 16.0)',
    },
    sampleRateHertz: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Sample rate in Hz',
    },
    effectsProfileId: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: "Effects profile (e.g., ['headphone-class-device'])",
    },
  },

  request: {
    url: '/api/proxy/tts/unified',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: GoogleTtsParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'google',
      text: params.text,
      apiKey: params.apiKey,
      voiceId: params.voiceId,
      languageCode: params.languageCode,
      gender: params.gender,
      audioEncoding: params.audioEncoding || 'MP3',
      speakingRate: params.speakingRate ?? 1.0,
      pitch: params.pitch ?? 0.0,
      volumeGainDb: params.volumeGainDb,
      sampleRateHertz: params.sampleRateHertz,
      effectsProfileId: params.effectsProfileId,
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
        error: data.error || 'TTS generation failed',
        output: {
          audioUrl: '',
        },
      }
    }

    return {
      success: true,
      output: {
        audioUrl: data.audioUrl,
        audioFile: data.audioFile,
        duration: data.duration,
        characterCount: data.characterCount,
        format: data.format,
        provider: data.provider,
      },
    }
  },

  outputs: {
    audioUrl: { type: 'string', description: 'URL to the generated audio file' },
    audioFile: { type: 'file', description: 'Generated audio file object' },
    duration: { type: 'number', description: 'Audio duration in seconds' },
    characterCount: { type: 'number', description: 'Number of characters processed' },
    format: { type: 'string', description: 'Audio format' },
    provider: { type: 'string', description: 'TTS provider used' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/tts/index.ts

```typescript
export { azureTtsTool } from './azure'
export { cartesiaTtsTool } from './cartesia'
export { deepgramTtsTool } from './deepgram'
export { elevenLabsTtsUnifiedTool } from './elevenlabs'
export { googleTtsTool } from './google'
export { openaiTtsTool } from './openai'
export { playhtTtsTool } from './playht'
export * from './types'
```

--------------------------------------------------------------------------------

---[FILE: openai.ts]---
Location: sim-main/apps/sim/tools/tts/openai.ts

```typescript
import type { OpenAiTtsParams, TtsBlockResponse } from '@/tools/tts/types'
import type { ToolConfig } from '@/tools/types'

export const openaiTtsTool: ToolConfig<OpenAiTtsParams, TtsBlockResponse> = {
  id: 'tts_openai',
  name: 'OpenAI TTS',
  description: 'Convert text to speech using OpenAI TTS models',
  version: '1.0.0',

  params: {
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The text to convert to speech',
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
      description: 'TTS model to use (tts-1, tts-1-hd, or gpt-4o-mini-tts)',
    },
    voice: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Voice to use (alloy, ash, ballad, cedar, coral, echo, marin, sage, shimmer, verse)',
    },
    responseFormat: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Audio format (mp3, opus, aac, flac, wav, pcm)',
    },
    speed: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Speech speed (0.25 to 4.0, default: 1.0)',
    },
  },

  request: {
    url: '/api/proxy/tts/unified',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: OpenAiTtsParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'openai',
      text: params.text,
      apiKey: params.apiKey,
      model: params.model || 'tts-1',
      voice: params.voice || 'alloy',
      responseFormat: params.responseFormat || 'mp3',
      speed: params.speed || 1.0,
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
        error: data.error || 'TTS generation failed',
        output: {
          audioUrl: '',
        },
      }
    }

    return {
      success: true,
      output: {
        audioUrl: data.audioUrl,
        audioFile: data.audioFile,
        duration: data.duration,
        characterCount: data.characterCount,
        format: data.format,
        provider: data.provider,
      },
    }
  },

  outputs: {
    audioUrl: { type: 'string', description: 'URL to the generated audio file' },
    audioFile: { type: 'file', description: 'Generated audio file object' },
    duration: { type: 'number', description: 'Audio duration in seconds' },
    characterCount: { type: 'number', description: 'Number of characters processed' },
    format: { type: 'string', description: 'Audio format' },
    provider: { type: 'string', description: 'TTS provider used' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: playht.ts]---
Location: sim-main/apps/sim/tools/tts/playht.ts

```typescript
import type { PlayHtTtsParams, TtsBlockResponse } from '@/tools/tts/types'
import type { ToolConfig } from '@/tools/types'

export const playhtTtsTool: ToolConfig<PlayHtTtsParams, TtsBlockResponse> = {
  id: 'tts_playht',
  name: 'PlayHT TTS',
  description: 'Convert text to speech using PlayHT (voice cloning)',
  version: '1.0.0',

  params: {
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The text to convert to speech',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PlayHT API key (AUTHORIZATION header)',
    },
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PlayHT user ID (X-USER-ID header)',
    },
    voice: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Voice ID or manifest URL',
    },
    quality: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Quality level (draft, standard, premium)',
    },
    outputFormat: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Output format (mp3, wav, ogg, flac, mulaw)',
    },
    speed: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Speed multiplier (0.5 to 2.0)',
    },
    temperature: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Creativity/randomness (0.0 to 2.0)',
    },
    voiceGuidance: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Voice stability (1.0 to 6.0)',
    },
    textGuidance: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Text adherence (1.0 to 6.0)',
    },
    sampleRate: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Sample rate (8000, 16000, 22050, 24000, 44100, 48000)',
    },
  },

  request: {
    url: '/api/proxy/tts/unified',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: PlayHtTtsParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'playht',
      text: params.text,
      apiKey: params.apiKey,
      userId: params.userId,
      voice: params.voice,
      quality: params.quality || 'standard',
      outputFormat: params.outputFormat || 'mp3',
      speed: params.speed ?? 1.0,
      temperature: params.temperature,
      voiceGuidance: params.voiceGuidance,
      textGuidance: params.textGuidance,
      sampleRate: params.sampleRate,
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
        error: data.error || 'TTS generation failed',
        output: {
          audioUrl: '',
        },
      }
    }

    return {
      success: true,
      output: {
        audioUrl: data.audioUrl,
        audioFile: data.audioFile,
        duration: data.duration,
        characterCount: data.characterCount,
        format: data.format,
        provider: data.provider,
      },
    }
  },

  outputs: {
    audioUrl: { type: 'string', description: 'URL to the generated audio file' },
    audioFile: { type: 'file', description: 'Generated audio file object' },
    duration: { type: 'number', description: 'Audio duration in seconds' },
    characterCount: { type: 'number', description: 'Number of characters processed' },
    format: { type: 'string', description: 'Audio format' },
    provider: { type: 'string', description: 'TTS provider used' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/tts/types.ts

```typescript
import type { UserFile } from '@/executor/types'
import type { ToolResponse } from '@/tools/types'

export type TtsProvider =
  | 'openai'
  | 'deepgram'
  | 'elevenlabs'
  | 'cartesia'
  | 'google'
  | 'azure'
  | 'playht'

// OpenAI TTS Types
export interface OpenAiTtsParams {
  text: string
  model?: 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts'
  voice?:
    | 'alloy'
    | 'ash'
    | 'ballad'
    | 'cedar'
    | 'coral'
    | 'echo'
    | 'marin'
    | 'sage'
    | 'shimmer'
    | 'verse'
  responseFormat?: 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm'
  speed?: number // 0.25 to 4.0
  apiKey: string
}

// Deepgram TTS Types
export interface DeepgramTtsParams {
  text: string
  model?: string // e.g., 'aura-2'
  voice?: string // e.g., 'aura-asteria-en', 'aura-luna-en', etc.
  encoding?: 'linear16' | 'mp3' | 'opus' | 'aac' | 'flac' | 'mulaw' | 'alaw'
  sampleRate?: number // 8000, 16000, 24000, 48000
  bitRate?: number // For compressed formats
  container?: 'none' | 'wav' | 'ogg'
  apiKey: string
}

// ElevenLabs TTS Types
export interface ElevenLabsTtsUnifiedParams {
  text: string
  voiceId: string
  modelId?: string
  stability?: number // 0.0 to 1.0
  similarityBoost?: number // 0.0 to 1.0
  style?: number // 0.0 to 1.0
  useSpeakerBoost?: boolean
  apiKey: string
}

// Cartesia TTS Types
export interface CartesiaTtsParams {
  text: string
  modelId?: string // e.g., 'sonic-english', 'sonic-multilingual'
  voice?: string // Voice ID or embedding
  language?: string // Language code (en, es, fr, de, it, pt, etc.)
  outputFormat?: {
    container?: 'raw' | 'wav' | 'mp3' | 'ogg'
    encoding?: 'pcm_f32le' | 'pcm_s16le' | 'pcm_mulaw' | 'pcm_alaw'
    sampleRate?: number // 8000, 16000, 22050, 24000, 44100, 48000
  }
  speed?: number // Speed multiplier
  emotion?: string[] // For Sonic-3: e.g., ['positivity:high', 'curiosity:medium']
  apiKey: string
}

// Google Cloud TTS Types
export interface GoogleTtsParams {
  text: string
  voiceId?: string // e.g., 'en-US-Neural2-A'
  languageCode?: string // e.g., 'en-US'
  gender?: 'MALE' | 'FEMALE' | 'NEUTRAL'
  audioEncoding?: 'LINEAR16' | 'MP3' | 'OGG_OPUS' | 'MULAW' | 'ALAW'
  speakingRate?: number // 0.25 to 2.0
  pitch?: number // -20.0 to 20.0
  volumeGainDb?: number // -96.0 to 16.0
  sampleRateHertz?: number
  effectsProfileId?: string[] // e.g., ['headphone-class-device']
  apiKey: string
}

// Azure TTS Types
export interface AzureTtsParams {
  text: string
  voiceId?: string // e.g., 'en-US-JennyNeural'
  region?: string // e.g., 'eastus', 'westus'
  outputFormat?:
    | 'riff-8khz-16bit-mono-pcm'
    | 'riff-24khz-16bit-mono-pcm'
    | 'audio-24khz-48kbitrate-mono-mp3'
    | 'audio-24khz-96kbitrate-mono-mp3'
    | 'audio-48khz-96kbitrate-mono-mp3'
  rate?: string // e.g., '+10%', '-20%', '1.5'
  pitch?: string // e.g., '+5Hz', '-2st', 'low'
  style?: string // e.g., 'cheerful', 'sad', 'angry' (neural voices only)
  styleDegree?: number // 0.01 to 2.0
  role?: string // e.g., 'Girl', 'Boy', 'YoungAdultFemale'
  apiKey: string
}

// PlayHT TTS Types
export interface PlayHtTtsParams {
  text: string
  voice?: string // Voice ID or manifest URL
  quality?: 'draft' | 'standard' | 'premium'
  outputFormat?: 'mp3' | 'wav' | 'ogg' | 'flac' | 'mulaw'
  speed?: number // 0.5 to 2.0
  temperature?: number // 0.0 to 2.0 (creativity/randomness)
  voiceGuidance?: number // 1.0 to 6.0 (voice stability)
  textGuidance?: number // 1.0 to 6.0 (text adherence)
  sampleRate?: number // 8000, 16000, 22050, 24000, 44100, 48000
  userId: string // X-USER-ID header
  apiKey: string // AUTHORIZATION header
}

// Unified Response Type for block outputs
export interface TtsBlockResponse extends ToolResponse {
  output: {
    audioUrl: string
    audioFile?: UserFile
    duration?: number
    characterCount?: number
    format?: string
    provider?: TtsProvider
  }
}

// API Response type (used internally in proxy route)
export interface TtsResponse {
  audioUrl: string
  audioFile?: UserFile
  duration?: number
  characterCount?: number
  format?: string
  provider?: TtsProvider
}

// Voice options for different providers
export const OPENAI_VOICES = {
  // All voices work with all models
  alloy: 'Alloy (neutral, balanced)',
  ash: 'Ash (masculine, clear)',
  ballad: 'Ballad (smooth, melodic)',
  coral: 'Coral (warm, friendly)',
  echo: 'Echo (warm, masculine)',
  marin: 'Marin (soft, gentle)',
  cedar: 'Cedar (deep, resonant)',
  sage: 'Sage (calm, wise)',
  shimmer: 'Shimmer (warm, empathetic)',
  verse: 'Verse (poetic, expressive)',
} as const

export const DEEPGRAM_VOICES = {
  // Aura-1 English voices (legacy)
  'aura-asteria-en': 'Asteria (Aura-1, American, warm female)',
  'aura-luna-en': 'Luna (Aura-1, American, professional female)',
  'aura-stella-en': 'Stella (Aura-1, American, energetic female)',
  'aura-athena-en': 'Athena (Aura-1, British, sophisticated female)',
  'aura-hera-en': 'Hera (Aura-1, American, mature female)',
  'aura-orion-en': 'Orion (Aura-1, American, confident male)',
  'aura-arcas-en': 'Arcas (Aura-1, American, professional male)',
  'aura-perseus-en': 'Perseus (Aura-1, American, strong male)',
  'aura-angus-en': 'Angus (Aura-1, Irish, friendly male)',
  'aura-orpheus-en': 'Orpheus (Aura-1, American, smooth male)',
  'aura-helios-en': 'Helios (Aura-1, British, authoritative male)',
  'aura-zeus-en': 'Zeus (Aura-1, American, deep male)',

  // Aura-2 English voices
  'aura-2-arcas-en': 'Arcas (Aura-2, American male)',
  'aura-2-asteria-en': 'Asteria (Aura-2, American female)',
  'aura-2-luna-en': 'Luna (Aura-2, American female)',
  'aura-2-stella-en': 'Stella (Aura-2, American female)',
  'aura-2-athena-en': 'Athena (Aura-2, British female)',
  'aura-2-hera-en': 'Hera (Aura-2, American female)',
  'aura-2-orion-en': 'Orion (Aura-2, American male)',
  'aura-2-perseus-en': 'Perseus (Aura-2, American male)',
  'aura-2-orpheus-en': 'Orpheus (Aura-2, American male)',
  'aura-2-helios-en': 'Helios (Aura-2, British male)',
  'aura-2-zeus-en': 'Zeus (Aura-2, American male)',
  'aura-2-angus-en': 'Angus (Aura-2, Irish male)',
  'aura-2-sasha-en': 'Sasha (Aura-2, American female)',
  'aura-2-sophia-en': 'Sophia (Aura-2, American female)',
  'aura-2-oliver-en': 'Oliver (Aura-2, American male)',
  'aura-2-emma-en': 'Emma (Aura-2, American female)',
  'aura-2-jack-en': 'Jack (Aura-2, American male)',
  'aura-2-lily-en': 'Lily (Aura-2, American female)',
  'aura-2-noah-en': 'Noah (Aura-2, American male)',
  'aura-2-mia-en': 'Mia (Aura-2, American female)',
  'aura-2-william-en': 'William (Aura-2, American male)',
  'aura-2-emily-en': 'Emily (Aura-2, American female)',
  'aura-2-james-en': 'James (Aura-2, American male)',
  'aura-2-ava-en': 'Ava (Aura-2, American female)',
  'aura-2-benjamin-en': 'Benjamin (Aura-2, American male)',
  'aura-2-charlotte-en': 'Charlotte (Aura-2, American female)',
  'aura-2-lucas-en': 'Lucas (Aura-2, American male)',
  'aura-2-harper-en': 'Harper (Aura-2, American female)',
  'aura-2-henry-en': 'Henry (Aura-2, American male)',
  'aura-2-evelyn-en': 'Evelyn (Aura-2, American female)',
  'aura-2-alexander-en': 'Alexander (Aura-2, American male)',
  'aura-2-abigail-en': 'Abigail (Aura-2, American female)',
  'aura-2-michael-en': 'Michael (Aura-2, American male)',
  'aura-2-sofia-en': 'Sofia (Aura-2, American female)',
  'aura-2-daniel-en': 'Daniel (Aura-2, American male)',
  'aura-2-ella-en': 'Ella (Aura-2, American female)',
  'aura-2-matthew-en': 'Matthew (Aura-2, American male)',
  'aura-2-grace-en': 'Grace (Aura-2, American female)',
  'aura-2-jackson-en': 'Jackson (Aura-2, American male)',
  'aura-2-chloe-en': 'Chloe (Aura-2, American female)',
  'aura-2-samuel-en': 'Samuel (Aura-2, American male)',
  'aura-2-madison-en': 'Madison (Aura-2, American female)',

  // Aura-2 Spanish voices
  'aura-2-maria-es': 'Maria (Aura-2, Spanish female)',
  'aura-2-carmen-es': 'Carmen (Aura-2, Spanish female)',
  'aura-2-carlos-es': 'Carlos (Aura-2, Spanish male)',
  'aura-2-diego-es': 'Diego (Aura-2, Spanish male)',
  'aura-2-isabel-es': 'Isabel (Aura-2, Spanish female)',
  'aura-2-juan-es': 'Juan (Aura-2, Spanish male)',
  'aura-2-lucia-es': 'Lucia (Aura-2, Spanish female)',
  'aura-2-miguel-es': 'Miguel (Aura-2, Spanish male)',
  'aura-2-sofia-es': 'Sofia (Aura-2, Spanish female)',
  'aura-2-antonio-es': 'Antonio (Aura-2, Spanish male)',
} as const

export const ELEVENLABS_MODELS = {
  // V2 Models
  eleven_turbo_v2_5: 'Turbo v2.5 (faster, improved)',
  eleven_flash_v2_5: 'Flash v2.5 (ultra-fast, 75ms latency)',
  eleven_multilingual_v2: 'Multilingual v2 (32 languages)',
  eleven_turbo_v2: 'Turbo v2 (fast, good quality)',

  // V1 Models
  eleven_monolingual_v1: 'Monolingual v1 (English only)',
  eleven_multilingual_v1: 'Multilingual v1',
} as const

export const CARTESIA_MODELS = {
  sonic: 'Sonic (English, low latency)',
  'sonic-2': 'Sonic 2 (English, improved)',
  'sonic-turbo': 'Sonic Turbo (English, ultra-fast)',
  'sonic-3': 'Sonic 3 (English, highest quality)',
  'sonic-multilingual': 'Sonic Multilingual (100+ languages)',
} as const

export const GOOGLE_VOICE_GENDERS = {
  MALE: 'Male',
  FEMALE: 'Female',
  NEUTRAL: 'Neutral',
} as const

export const GOOGLE_AUDIO_ENCODINGS = {
  LINEAR16: 'LINEAR16 (uncompressed)',
  MP3: 'MP3 (compressed)',
  OGG_OPUS: 'OGG Opus (compressed)',
  MULAW: 'MULAW (8kHz)',
  ALAW: 'ALAW (8kHz)',
} as const

export const AZURE_OUTPUT_FORMATS = {
  'riff-8khz-16bit-mono-pcm': 'PCM 8kHz 16-bit',
  'riff-24khz-16bit-mono-pcm': 'PCM 24kHz 16-bit',
  'audio-24khz-48kbitrate-mono-mp3': 'MP3 24kHz 48kbps',
  'audio-24khz-96kbitrate-mono-mp3': 'MP3 24kHz 96kbps',
  'audio-48khz-96kbitrate-mono-mp3': 'MP3 48kHz 96kbps (high quality)',
} as const

export const PLAYHT_QUALITY_LEVELS = {
  draft: 'Draft (fastest)',
  standard: 'Standard (recommended)',
  premium: 'Premium (best quality)',
} as const

export const PLAYHT_OUTPUT_FORMATS = {
  mp3: 'MP3',
  wav: 'WAV',
  ogg: 'OGG',
  flac: 'FLAC',
  mulaw: 'MULAW',
} as const

// Audio format MIME types
export const AUDIO_MIME_TYPES: Record<string, string> = {
  mp3: 'audio/mpeg',
  opus: 'audio/opus',
  aac: 'audio/aac',
  flac: 'audio/flac',
  wav: 'audio/wav',
  pcm: 'audio/pcm',
  linear16: 'audio/pcm',
  mulaw: 'audio/basic',
  alaw: 'audio/basic',
  ogg: 'audio/ogg',
}

// Get file extension from format
export function getFileExtension(format: string): string {
  const formatMap: Record<string, string> = {
    mp3: 'mp3',
    opus: 'opus',
    aac: 'aac',
    flac: 'flac',
    wav: 'wav',
    pcm: 'pcm',
    linear16: 'wav',
    mulaw: 'wav',
    alaw: 'wav',
    ogg: 'ogg',
  }
  return formatMap[format] || 'mp3'
}

// Get MIME type from format
export function getMimeType(format: string): string {
  return AUDIO_MIME_TYPES[format] || 'audio/mpeg'
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/twilio/index.ts

```typescript
import { sendSMSTool } from '@/tools/twilio/send_sms'

export { sendSMSTool }
```

--------------------------------------------------------------------------------

---[FILE: send_sms.ts]---
Location: sim-main/apps/sim/tools/twilio/send_sms.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { TwilioSendSMSParams, TwilioSMSBlockOutput } from '@/tools/twilio/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('Twilio Send SMS Tool')

export const sendSMSTool: ToolConfig<TwilioSendSMSParams, TwilioSMSBlockOutput> = {
  id: 'twilio_send_sms',
  name: 'Twilio Send SMS',
  description: 'Send text messages to single or multiple recipients using the Twilio API.',
  version: '1.0.0',

  params: {
    phoneNumbers: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Phone numbers to send the message to, separated by newlines',
    },
    message: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Message to send',
    },
    accountSid: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Twilio Account SID',
    },
    authToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Twilio Auth Token',
    },
    fromNumber: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Twilio phone number to send the message from',
    },
  },

  request: {
    url: (params) => {
      if (!params.accountSid) {
        throw new Error('Twilio Account SID is required')
      }
      const url = `https://api.twilio.com/2010-04-01/Accounts/${params.accountSid}/Messages.json`
      return url
    },
    method: 'POST',
    headers: (params) => {
      if (!params.accountSid || !params.authToken) {
        throw new Error('Twilio credentials are required')
      }
      // Use Buffer instead of btoa for Node.js compatibility
      const authToken = Buffer.from(`${params.accountSid}:${params.authToken}`).toString('base64')
      const headers = {
        Authorization: `Basic ${authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
      return headers
    },
    body: (params) => {
      if (!params.phoneNumbers) {
        throw new Error('Phone numbers are required but not provided')
      }
      if (!params.message) {
        throw new Error('Message content is required but not provided')
      }
      if (!params.fromNumber) {
        throw new Error('From number is required but not provided')
      }

      // Get first phone number if multiple are provided
      const toNumber = params.phoneNumbers.split('\n')[0].trim()

      // Create a URLSearchParams object and convert to string
      const formData = new URLSearchParams()
      formData.append('To', toNumber)
      formData.append('From', params.fromNumber)
      formData.append('Body', params.message)

      const formDataString = formData.toString()
      return { body: formDataString }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    logger.info('Twilio Response:', data)
    logger.info('Twilio Response type:', typeof data)
    return {
      success: true,
      output: {
        success: true,
        messageId: data.sid,
        status: data.status,
      },
      error: undefined,
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'SMS send success status' },
    messageId: { type: 'string', description: 'Unique Twilio message identifier (SID)' },
    status: { type: 'string', description: 'Message delivery status from Twilio' },
    fromNumber: { type: 'string', description: 'Phone number message was sent from' },
    toNumber: { type: 'string', description: 'Phone number message was sent to' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/twilio/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface TwilioSendSMSParams {
  phoneNumbers: string
  message: string
  accountSid: string
  authToken: string
  fromNumber: string
}

export interface TwilioSMSBlockOutput extends ToolResponse {
  output: {
    success: boolean
    messageId?: string
    status?: string
    error?: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: get_recording.ts]---
Location: sim-main/apps/sim/tools/twilio_voice/get_recording.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { TwilioGetRecordingOutput, TwilioGetRecordingParams } from '@/tools/twilio_voice/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('TwilioVoiceGetRecordingTool')

export const getRecordingTool: ToolConfig<TwilioGetRecordingParams, TwilioGetRecordingOutput> = {
  id: 'twilio_voice_get_recording',
  name: 'Twilio Voice Get Recording',
  description: 'Retrieve call recording information and transcription (if enabled via TwiML).',
  version: '1.0.0',

  params: {
    recordingSid: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Recording SID to retrieve',
    },
    accountSid: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Twilio Account SID',
    },
    authToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Twilio Auth Token',
    },
  },

  request: {
    url: (params) => {
      if (!params.accountSid || !params.recordingSid) {
        throw new Error('Twilio Account SID and Recording SID are required')
      }
      if (!params.accountSid.startsWith('AC')) {
        throw new Error(
          `Invalid Account SID format. Account SID must start with "AC" (you provided: ${params.accountSid.substring(0, 2)}...)`
        )
      }
      return `https://api.twilio.com/2010-04-01/Accounts/${params.accountSid}/Recordings/${params.recordingSid}.json`
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accountSid || !params.authToken) {
        throw new Error('Twilio credentials are required')
      }
      const authToken = Buffer.from(`${params.accountSid}:${params.authToken}`).toString('base64')
      return {
        Authorization: `Basic ${authToken}`,
      }
    },
  },

  transformResponse: async (response, params) => {
    const data = await response.json()

    logger.info('Twilio Get Recording Response:', data)

    if (data.error_code) {
      return {
        success: false,
        output: {
          success: false,
          error: data.message || data.error_message || 'Failed to retrieve recording',
        },
        error: data.message || data.error_message || 'Failed to retrieve recording',
      }
    }

    const baseUrl = 'https://api.twilio.com'
    const mediaUrl = data.uri ? `${baseUrl}${data.uri.replace('.json', '')}` : undefined

    let transcriptionText: string | undefined
    let transcriptionStatus: string | undefined
    let transcriptionPrice: string | undefined
    let transcriptionPriceUnit: string | undefined

    try {
      const authToken = Buffer.from(`${params?.accountSid}:${params?.authToken}`).toString('base64')

      const transcriptionUrl = `https://api.twilio.com/2010-04-01/Accounts/${params?.accountSid}/Transcriptions.json?RecordingSid=${data.sid}`
      logger.info('Checking for transcriptions:', transcriptionUrl)

      const transcriptionResponse = await fetch(transcriptionUrl, {
        method: 'GET',
        headers: { Authorization: `Basic ${authToken}` },
      })

      if (transcriptionResponse.ok) {
        const transcriptionData = await transcriptionResponse.json()
        logger.info('Transcription response:', JSON.stringify(transcriptionData))

        if (transcriptionData.transcriptions && transcriptionData.transcriptions.length > 0) {
          const transcription = transcriptionData.transcriptions[0]
          transcriptionText = transcription.transcription_text
          transcriptionStatus = transcription.status
          transcriptionPrice = transcription.price
          transcriptionPriceUnit = transcription.price_unit
          logger.info('Transcription found:', {
            status: transcriptionStatus,
            textLength: transcriptionText?.length,
          })
        } else {
          logger.info(
            'No transcriptions found. To enable transcription, use <Record transcribe="true"> in your TwiML.'
          )
        }
      }
    } catch (error) {
      logger.warn('Failed to fetch transcription:', error)
    }

    return {
      success: true,
      output: {
        success: true,
        recordingSid: data.sid,
        callSid: data.call_sid,
        duration: data.duration ? Number.parseInt(data.duration, 10) : undefined,
        status: data.status,
        channels: data.channels,
        source: data.source,
        mediaUrl,
        price: data.price,
        priceUnit: data.price_unit,
        uri: data.uri,
        transcriptionText,
        transcriptionStatus,
        transcriptionPrice,
        transcriptionPriceUnit,
      },
      error: undefined,
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the recording was successfully retrieved' },
    recordingSid: { type: 'string', description: 'Unique identifier for the recording' },
    callSid: { type: 'string', description: 'Call SID this recording belongs to' },
    duration: { type: 'number', description: 'Duration of the recording in seconds' },
    status: { type: 'string', description: 'Recording status (completed, processing, etc.)' },
    channels: { type: 'number', description: 'Number of channels (1 for mono, 2 for dual)' },
    source: { type: 'string', description: 'How the recording was created' },
    mediaUrl: { type: 'string', description: 'URL to download the recording media file' },
    price: { type: 'string', description: 'Cost of the recording' },
    priceUnit: { type: 'string', description: 'Currency of the price' },
    uri: { type: 'string', description: 'Relative URI of the recording resource' },
    transcriptionText: {
      type: 'string',
      description: 'Transcribed text from the recording (if available)',
    },
    transcriptionStatus: {
      type: 'string',
      description: 'Transcription status (completed, in-progress, failed)',
    },
    transcriptionPrice: { type: 'string', description: 'Cost of the transcription' },
    transcriptionPriceUnit: { type: 'string', description: 'Currency of the transcription price' },
    error: { type: 'string', description: 'Error message if retrieval failed' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/twilio_voice/index.ts

```typescript
import { getRecordingTool } from '@/tools/twilio_voice/get_recording'
import { listCallsTool } from '@/tools/twilio_voice/list_calls'
import { makeCallTool } from '@/tools/twilio_voice/make_call'

export { getRecordingTool, listCallsTool, makeCallTool }
```

--------------------------------------------------------------------------------

````
