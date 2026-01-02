---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 294
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 294 of 933)

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

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/proxy/stt/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { extractAudioFromVideo, isVideoFile } from '@/lib/audio/extractor'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { createLogger } from '@/lib/logs/console/logger'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'
import type { UserFile } from '@/executor/types'
import type { TranscriptSegment } from '@/tools/stt/types'

const logger = createLogger('SttProxyAPI')

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes for large files

interface SttRequestBody {
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
  // Whisper-specific options
  prompt?: string
  temperature?: number
  // AssemblyAI-specific options
  sentiment?: boolean
  entityDetection?: boolean
  piiRedaction?: boolean
  summarization?: boolean
  workspaceId?: string
  workflowId?: string
  executionId?: string
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()
  logger.info(`[${requestId}] STT transcription request started`)

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: SttRequestBody = await request.json()
    const {
      provider,
      apiKey,
      model,
      language,
      timestamps,
      diarization,
      translateToEnglish,
      sentiment,
      entityDetection,
      piiRedaction,
      summarization,
    } = body

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: provider and apiKey' },
        { status: 400 }
      )
    }

    let audioBuffer: Buffer
    let audioFileName: string
    let audioMimeType: string

    if (body.audioFile) {
      const file = Array.isArray(body.audioFile) ? body.audioFile[0] : body.audioFile
      logger.info(`[${requestId}] Processing uploaded file: ${file.name}`)

      audioBuffer = await downloadFileFromStorage(file, requestId, logger)
      audioFileName = file.name
      audioMimeType = file.type
    } else if (body.audioFileReference) {
      const file = Array.isArray(body.audioFileReference)
        ? body.audioFileReference[0]
        : body.audioFileReference
      logger.info(`[${requestId}] Processing referenced file: ${file.name}`)

      audioBuffer = await downloadFileFromStorage(file, requestId, logger)
      audioFileName = file.name
      audioMimeType = file.type
    } else if (body.audioUrl) {
      logger.info(`[${requestId}] Downloading from URL: ${body.audioUrl}`)

      const response = await fetch(body.audioUrl)
      if (!response.ok) {
        throw new Error(`Failed to download audio from URL: ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      audioBuffer = Buffer.from(arrayBuffer)
      audioFileName = body.audioUrl.split('/').pop() || 'audio_file'
      audioMimeType = response.headers.get('content-type') || 'audio/mpeg'
    } else {
      return NextResponse.json(
        { error: 'No audio source provided. Provide audioFile, audioFileReference, or audioUrl' },
        { status: 400 }
      )
    }

    if (isVideoFile(audioMimeType)) {
      logger.info(`[${requestId}] Extracting audio from video file`)
      try {
        const extracted = await extractAudioFromVideo(audioBuffer, audioMimeType, {
          outputFormat: 'mp3',
          sampleRate: 16000,
          channels: 1,
        })
        audioBuffer = extracted.buffer
        audioMimeType = 'audio/mpeg'
        audioFileName = audioFileName.replace(/\.[^.]+$/, '.mp3')
      } catch (error) {
        logger.error(`[${requestId}] Video extraction failed:`, error)
        return NextResponse.json(
          {
            error: `Failed to extract audio from video: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
          { status: 500 }
        )
      }
    }

    logger.info(`[${requestId}] Transcribing with ${provider}, file: ${audioFileName}`)

    let transcript: string
    let segments: TranscriptSegment[] | undefined
    let detectedLanguage: string | undefined
    let duration: number | undefined
    let confidence: number | undefined
    let sentimentResults: any[] | undefined
    let entities: any[] | undefined
    let summary: string | undefined

    try {
      if (provider === 'whisper') {
        const result = await transcribeWithWhisper(
          audioBuffer,
          apiKey,
          language,
          timestamps,
          translateToEnglish,
          model,
          body.prompt,
          body.temperature
        )
        transcript = result.transcript
        segments = result.segments
        detectedLanguage = result.language
        duration = result.duration
      } else if (provider === 'deepgram') {
        const result = await transcribeWithDeepgram(
          audioBuffer,
          apiKey,
          language,
          timestamps,
          diarization,
          model
        )
        transcript = result.transcript
        segments = result.segments
        detectedLanguage = result.language
        duration = result.duration
        confidence = result.confidence
      } else if (provider === 'elevenlabs') {
        const result = await transcribeWithElevenLabs(
          audioBuffer,
          apiKey,
          language,
          timestamps,
          model
        )
        transcript = result.transcript
        segments = result.segments
        detectedLanguage = result.language
        duration = result.duration
      } else if (provider === 'assemblyai') {
        const result = await transcribeWithAssemblyAI(
          audioBuffer,
          apiKey,
          language,
          timestamps,
          diarization,
          sentiment,
          entityDetection,
          piiRedaction,
          summarization,
          model
        )
        transcript = result.transcript
        segments = result.segments
        detectedLanguage = result.language
        duration = result.duration
        confidence = result.confidence
        sentimentResults = result.sentiment
        entities = result.entities
        summary = result.summary
      } else if (provider === 'gemini') {
        const result = await transcribeWithGemini(
          audioBuffer,
          apiKey,
          audioMimeType,
          language,
          timestamps,
          model
        )
        transcript = result.transcript
        segments = result.segments
        detectedLanguage = result.language
        duration = result.duration
        confidence = result.confidence
      } else {
        return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 })
      }
    } catch (error) {
      logger.error(`[${requestId}] Transcription failed:`, error)
      const errorMessage = error instanceof Error ? error.message : 'Transcription failed'
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }

    logger.info(`[${requestId}] Transcription completed successfully`)

    const response: Record<string, any> = { transcript }
    if (segments !== undefined) response.segments = segments
    if (detectedLanguage !== undefined) response.language = detectedLanguage
    if (duration !== undefined) response.duration = duration
    if (confidence !== undefined) response.confidence = confidence
    if (sentimentResults !== undefined) response.sentiment = sentimentResults
    if (entities !== undefined) response.entities = entities
    if (summary !== undefined) response.summary = summary

    return NextResponse.json(response)
  } catch (error) {
    logger.error(`[${requestId}] STT proxy error:`, error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

async function transcribeWithWhisper(
  audioBuffer: Buffer,
  apiKey: string,
  language?: string,
  timestamps?: 'none' | 'sentence' | 'word',
  translate?: boolean,
  model?: string,
  prompt?: string,
  temperature?: number
): Promise<{
  transcript: string
  segments?: TranscriptSegment[]
  language?: string
  duration?: number
}> {
  const formData = new FormData()

  const blob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/mpeg' })
  formData.append('file', blob, 'audio.mp3')
  formData.append('model', model || 'whisper-1')

  if (language && language !== 'auto') {
    formData.append('language', language)
  }

  if (prompt) {
    formData.append('prompt', prompt)
  }

  if (temperature !== undefined) {
    formData.append('temperature', temperature.toString())
  }

  formData.append('response_format', 'verbose_json')

  if (timestamps === 'word') {
    formData.append('timestamp_granularities', 'word')
  } else if (timestamps === 'sentence') {
    formData.append('timestamp_granularities', 'segment')
  }

  const endpoint = translate ? 'translations' : 'transcriptions'
  const response = await fetch(`https://api.openai.com/v1/audio/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    const errorMessage = error.error?.message || error.message || JSON.stringify(error)
    throw new Error(`Whisper API error: ${errorMessage}`)
  }

  const data = await response.json()

  let segments: TranscriptSegment[] | undefined
  if (timestamps !== 'none') {
    segments = (data.segments || data.words || []).map((seg: any) => ({
      text: seg.text,
      start: seg.start,
      end: seg.end,
    }))
  }

  return {
    transcript: data.text,
    segments,
    language: data.language,
    duration: data.duration,
  }
}

async function transcribeWithDeepgram(
  audioBuffer: Buffer,
  apiKey: string,
  language?: string,
  timestamps?: 'none' | 'sentence' | 'word',
  diarization?: boolean,
  model?: string
): Promise<{
  transcript: string
  segments?: TranscriptSegment[]
  language?: string
  duration?: number
  confidence?: number
}> {
  const params = new URLSearchParams({
    model: model || 'nova-3',
    smart_format: 'true',
    punctuate: 'true',
  })

  if (language && language !== 'auto') {
    params.append('language', language)
  } else if (language === 'auto') {
    params.append('detect_language', 'true')
  }

  if (timestamps === 'sentence') {
    params.append('utterances', 'true')
  }

  if (diarization) {
    params.append('diarize', 'true')
  }

  const response = await fetch(`https://api.deepgram.com/v1/listen?${params.toString()}`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'audio/mpeg',
    },
    body: new Uint8Array(audioBuffer),
  })

  if (!response.ok) {
    const error = await response.json()
    const errorMessage = error.err_msg || error.message || JSON.stringify(error)
    throw new Error(`Deepgram API error: ${errorMessage}`)
  }

  const data = await response.json()
  const result = data.results?.channels?.[0]?.alternatives?.[0]

  if (!result) {
    throw new Error('No transcription result from Deepgram')
  }

  const transcript = result.transcript
  const detectedLanguage = data.results?.channels?.[0]?.detected_language
  const confidence = result.confidence

  let segments: TranscriptSegment[] | undefined
  if (result.words && timestamps === 'word') {
    segments = result.words.map((word: any) => ({
      text: word.word,
      start: word.start,
      end: word.end,
      speaker: word.speaker !== undefined ? `Speaker ${word.speaker}` : undefined,
      confidence: word.confidence,
    }))
  } else if (data.results?.utterances && timestamps === 'sentence') {
    segments = data.results.utterances.map((utterance: any) => ({
      text: utterance.transcript,
      start: utterance.start,
      end: utterance.end,
      speaker: utterance.speaker !== undefined ? `Speaker ${utterance.speaker}` : undefined,
      confidence: utterance.confidence,
    }))
  }

  return {
    transcript,
    segments,
    language: detectedLanguage,
    duration: data.metadata?.duration,
    confidence,
  }
}

async function transcribeWithElevenLabs(
  audioBuffer: Buffer,
  apiKey: string,
  language?: string,
  timestamps?: 'none' | 'sentence' | 'word',
  model?: string
): Promise<{
  transcript: string
  segments?: TranscriptSegment[]
  language?: string
  duration?: number
}> {
  const formData = new FormData()
  const blob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/mpeg' })
  formData.append('file', blob, 'audio.mp3')
  formData.append('model_id', model || 'scribe_v1')

  if (language && language !== 'auto') {
    formData.append('language_code', language)
  }

  if (timestamps && timestamps !== 'none') {
    const granularity = timestamps === 'word' ? 'word' : 'word'
    formData.append('timestamps_granularity', granularity)
  } else {
    formData.append('timestamps_granularity', 'word')
  }

  const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    const errorMessage =
      typeof error.detail === 'string'
        ? error.detail
        : error.detail?.message || error.message || JSON.stringify(error)
    throw new Error(`ElevenLabs API error: ${errorMessage}`)
  }

  const data = await response.json()

  const words = data.words || []
  const segments: TranscriptSegment[] = words
    .filter((w: any) => w.type === 'word')
    .map((w: any) => ({
      text: w.text,
      start: w.start,
      end: w.end,
      speaker: w.speaker_id,
    }))

  return {
    transcript: data.text || '',
    segments: segments.length > 0 ? segments : undefined,
    language: data.language_code,
    duration: undefined, // ElevenLabs doesn't return duration in response
  }
}

async function transcribeWithAssemblyAI(
  audioBuffer: Buffer,
  apiKey: string,
  language?: string,
  timestamps?: 'none' | 'sentence' | 'word',
  diarization?: boolean,
  sentiment?: boolean,
  entityDetection?: boolean,
  piiRedaction?: boolean,
  summarization?: boolean,
  model?: string
): Promise<{
  transcript: string
  segments?: TranscriptSegment[]
  language?: string
  duration?: number
  confidence?: number
  sentiment?: any[]
  entities?: any[]
  summary?: string
}> {
  const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      authorization: apiKey,
      'content-type': 'application/octet-stream',
    },
    body: new Uint8Array(audioBuffer),
  })

  if (!uploadResponse.ok) {
    const error = await uploadResponse.json()
    throw new Error(`AssemblyAI upload error: ${error.error || JSON.stringify(error)}`)
  }

  const { upload_url } = await uploadResponse.json()

  const transcriptRequest: any = {
    audio_url: upload_url,
  }

  if (model === 'best' || model === 'nano') {
    transcriptRequest.speech_model = model
  }

  if (language && language !== 'auto') {
    transcriptRequest.language_code = language
  } else if (language === 'auto') {
    transcriptRequest.language_detection = true
  }

  if (diarization) {
    transcriptRequest.speaker_labels = true
  }

  if (sentiment) {
    transcriptRequest.sentiment_analysis = true
  }

  if (entityDetection) {
    transcriptRequest.entity_detection = true
  }

  if (piiRedaction) {
    transcriptRequest.redact_pii = true
    transcriptRequest.redact_pii_policies = [
      'us_social_security_number',
      'email_address',
      'phone_number',
    ]
  }

  if (summarization) {
    transcriptRequest.summarization = true
    transcriptRequest.summary_model = 'informative'
    transcriptRequest.summary_type = 'bullets'
  }

  const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      authorization: apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(transcriptRequest),
  })

  if (!transcriptResponse.ok) {
    const error = await transcriptResponse.json()
    throw new Error(`AssemblyAI transcript error: ${error.error || JSON.stringify(error)}`)
  }

  const { id } = await transcriptResponse.json()

  let transcript: any
  let attempts = 0
  const maxAttempts = 60 // 5 minutes with 5-second intervals

  while (attempts < maxAttempts) {
    const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: {
        authorization: apiKey,
      },
    })

    if (!statusResponse.ok) {
      const error = await statusResponse.json()
      throw new Error(`AssemblyAI status error: ${error.error || JSON.stringify(error)}`)
    }

    transcript = await statusResponse.json()

    if (transcript.status === 'completed') {
      break
    }
    if (transcript.status === 'error') {
      throw new Error(`AssemblyAI transcription failed: ${transcript.error}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 5000))
    attempts++
  }

  if (transcript.status !== 'completed') {
    throw new Error('AssemblyAI transcription timed out')
  }

  let segments: TranscriptSegment[] | undefined
  if (timestamps !== 'none' && transcript.words) {
    segments = transcript.words.map((word: any) => ({
      text: word.text,
      start: word.start / 1000,
      end: word.end / 1000,
      speaker: word.speaker ? `Speaker ${word.speaker}` : undefined,
      confidence: word.confidence,
    }))
  }

  const result: any = {
    transcript: transcript.text,
    segments,
    language: transcript.language_code,
    duration: transcript.audio_duration,
    confidence: transcript.confidence,
  }

  if (sentiment && transcript.sentiment_analysis_results) {
    result.sentiment = transcript.sentiment_analysis_results
  }

  if (entityDetection && transcript.entities) {
    result.entities = transcript.entities
  }

  if (summarization && transcript.summary) {
    result.summary = transcript.summary
  }

  return result
}

async function transcribeWithGemini(
  audioBuffer: Buffer,
  apiKey: string,
  mimeType: string,
  language?: string,
  timestamps?: 'none' | 'sentence' | 'word',
  model?: string
): Promise<{
  transcript: string
  segments?: TranscriptSegment[]
  language?: string
  duration?: number
  confidence?: number
}> {
  const modelName = model || 'gemini-2.5-flash'

  const estimatedSize = audioBuffer.length * 1.34
  if (estimatedSize > 20 * 1024 * 1024) {
    throw new Error('Audio file exceeds 20MB limit for inline data')
  }

  const base64Audio = audioBuffer.toString('base64')

  const languagePrompt = language && language !== 'auto' ? ` The audio is in ${language}.` : ''

  const timestampPrompt =
    timestamps === 'sentence' || timestamps === 'word'
      ? ' Include timestamps in MM:SS format for each sentence.'
      : ''

  const requestBody = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Audio,
            },
          },
          {
            text: `Please transcribe this audio file.${languagePrompt}${timestampPrompt} Provide the full transcript.`,
          },
        ],
      },
    ],
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    if (response.status === 404) {
      throw new Error(
        `Model not found: ${modelName}. Use gemini-3-pro-preview, gemini-2.5-pro, gemini-2.5-flash, gemini-2.5-flash-lite, or gemini-2.0-flash-exp`
      )
    }
    const errorMessage = error.error?.message || JSON.stringify(error)
    throw new Error(`Gemini API error: ${errorMessage}`)
  }

  const data = await response.json()

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    const candidate = data.candidates?.[0]
    if (candidate?.finishReason === 'SAFETY') {
      throw new Error('Content was blocked by safety filters')
    }
    throw new Error('Invalid response structure from Gemini API')
  }

  const transcript = data.candidates[0].content.parts[0].text

  return {
    transcript,
    language: language !== 'auto' ? language : undefined,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/proxy/tts/route.ts
Signals: Next.js

```typescript
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { validateAlphanumericId } from '@/lib/core/security/input-validation'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { StorageService } from '@/lib/uploads'

const logger = createLogger('ProxyTTSAPI')

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })
    if (!authResult.success) {
      logger.error('Authentication failed for TTS proxy:', authResult.error)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      text,
      voiceId,
      apiKey,
      modelId = 'eleven_monolingual_v1',
      workspaceId,
      workflowId,
      executionId,
    } = body

    if (!text || !voiceId || !apiKey) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const voiceIdValidation = validateAlphanumericId(voiceId, 'voiceId', 255)
    if (!voiceIdValidation.isValid) {
      logger.error(`Invalid voice ID: ${voiceIdValidation.error}`)
      return NextResponse.json({ error: voiceIdValidation.error }, { status: 400 })
    }

    // Check if this is an execution context (from workflow tool execution)
    const hasExecutionContext = workspaceId && workflowId && executionId
    logger.info('Proxying TTS request for voice:', {
      voiceId,
      hasExecutionContext,
      workspaceId,
      workflowId,
      executionId,
    })

    const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
      }),
      signal: AbortSignal.timeout(60000),
    })

    if (!response.ok) {
      logger.error(`Failed to generate TTS: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `Failed to generate TTS: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const audioBlob = await response.blob()

    if (audioBlob.size === 0) {
      logger.error('Empty audio received from ElevenLabs')
      return NextResponse.json({ error: 'Empty audio received' }, { status: 422 })
    }

    const audioBuffer = Buffer.from(await audioBlob.arrayBuffer())
    const timestamp = Date.now()

    // Use execution storage for workflow tool calls, copilot for chat UI
    if (hasExecutionContext) {
      const { uploadExecutionFile } = await import('@/lib/uploads/contexts/execution')
      const fileName = `tts-${timestamp}.mp3`

      const userFile = await uploadExecutionFile(
        {
          workspaceId,
          workflowId,
          executionId,
        },
        audioBuffer,
        fileName,
        'audio/mpeg',
        authResult.userId
      )

      logger.info('TTS audio stored in execution context:', {
        executionId,
        fileName,
        size: userFile.size,
      })

      return NextResponse.json({
        audioFile: userFile,
        audioUrl: userFile.url,
      })
    }

    // Chat UI usage - no execution context, use copilot context
    const fileName = `tts-${timestamp}.mp3`
    const fileInfo = await StorageService.uploadFile({
      file: audioBuffer,
      fileName,
      contentType: 'audio/mpeg',
      context: 'copilot',
    })

    const audioUrl = `${getBaseUrl()}${fileInfo.path}`

    logger.info('TTS audio stored in copilot context (chat UI):', {
      fileName,
      size: fileInfo.size,
    })

    return NextResponse.json({
      audioUrl,
      size: fileInfo.size,
    })
  } catch (error) {
    logger.error('Error proxying TTS:', error)

    return NextResponse.json(
      {
        error: `Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/proxy/tts/stream/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { chat } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { env } from '@/lib/core/config/env'
import { validateAlphanumericId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { validateAuthToken } from '@/app/api/chat/utils'

const logger = createLogger('ProxyTTSStreamAPI')

/**
 * Validates chat-based authentication for deployed chat voice mode
 * Checks if the user has a valid chat auth cookie for the given chatId
 */
async function validateChatAuth(request: NextRequest, chatId: string): Promise<boolean> {
  try {
    const chatResult = await db
      .select({
        id: chat.id,
        isActive: chat.isActive,
        authType: chat.authType,
        password: chat.password,
      })
      .from(chat)
      .where(eq(chat.id, chatId))
      .limit(1)

    if (chatResult.length === 0 || !chatResult[0].isActive) {
      logger.warn('Chat not found or inactive for TTS auth:', chatId)
      return false
    }

    const chatData = chatResult[0]

    if (chatData.authType === 'public') {
      return true
    }

    const cookieName = `chat_auth_${chatId}`
    const authCookie = request.cookies.get(cookieName)

    if (authCookie && validateAuthToken(authCookie.value, chatId, chatData.password)) {
      return true
    }

    return false
  } catch (error) {
    logger.error('Error validating chat auth for TTS:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: any
    try {
      body = await request.json()
    } catch {
      return new Response('Invalid request body', { status: 400 })
    }

    const { text, voiceId, modelId = 'eleven_turbo_v2_5', chatId } = body

    if (!chatId) {
      return new Response('chatId is required', { status: 400 })
    }

    if (!text || !voiceId) {
      return new Response('Missing required parameters', { status: 400 })
    }

    const isChatAuthed = await validateChatAuth(request, chatId)
    if (!isChatAuthed) {
      logger.warn('Chat authentication failed for TTS, chatId:', chatId)
      return new Response('Unauthorized', { status: 401 })
    }

    const voiceIdValidation = validateAlphanumericId(voiceId, 'voiceId', 255)
    if (!voiceIdValidation.isValid) {
      logger.error(`Invalid voice ID: ${voiceIdValidation.error}`)
      return new Response(voiceIdValidation.error, { status: 400 })
    }

    const apiKey = env.ELEVENLABS_API_KEY
    if (!apiKey) {
      logger.error('ELEVENLABS_API_KEY not configured on server')
      return new Response('ElevenLabs service not configured', { status: 503 })
    }

    const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        optimize_streaming_latency: 4,
        output_format: 'mp3_22050_32', // Fastest format
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: false,
        },
        enable_ssml_parsing: false,
        apply_text_normalization: 'off',
        use_pvc_as_ivc: false,
      }),
    })

    if (!response.ok) {
      logger.error(`Failed to generate Stream TTS: ${response.status} ${response.statusText}`)
      return new Response(`Failed to generate TTS: ${response.status} ${response.statusText}`, {
        status: response.status,
      })
    }

    if (!response.body) {
      logger.error('No response body received from ElevenLabs')
      return new Response('No audio stream received', { status: 422 })
    }

    const { readable, writable } = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk)
      },
      flush(controller) {
        controller.terminate()
      },
    })

    const writer = writable.getWriter()
    const reader = response.body.getReader()

    ;(async () => {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            await writer.close()
            break
          }
          writer.write(value).catch(logger.error)
        }
      } catch (error) {
        logger.error('Error during Stream streaming:', error)
        await writer.abort(error)
      }
    })()

    return new Response(readable, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': '*',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
        'X-Stream-Type': 'real-time',
      },
    })
  } catch (error) {
    logger.error('Error in Stream TTS:', error)

    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
```

--------------------------------------------------------------------------------

````
