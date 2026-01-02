---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 492
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 492 of 933)

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

---[FILE: trello.ts]---
Location: sim-main/apps/sim/blocks/blocks/trello.ts

```typescript
import { TrelloIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { ToolResponse } from '@/tools/types'

/**
 * Trello Block
 *
 * Note: Trello uses OAuth 1.0a authentication with a unique credential ID format
 * (non-UUID strings like CUID2). This is different from most OAuth 2.0 providers
 * that use UUID-based credential IDs. The OAuth credentials API has been updated
 * to accept both UUID and non-UUID credential ID formats to support Trello.
 */
export const TrelloBlock: BlockConfig<ToolResponse> = {
  type: 'trello',
  name: 'Trello',
  description: 'Manage Trello boards and cards',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate with Trello to manage boards and cards. List boards, list cards, create cards, update cards, get actions, and add comments.',
  docsLink: 'https://docs.sim.ai/tools/trello',
  category: 'tools',
  bgColor: '#0052CC',
  icon: TrelloIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Get Lists', id: 'trello_list_lists' },
        { label: 'List Cards', id: 'trello_list_cards' },
        { label: 'Create Card', id: 'trello_create_card' },
        { label: 'Update Card', id: 'trello_update_card' },
        { label: 'Get Actions', id: 'trello_get_actions' },
        { label: 'Add Comment', id: 'trello_add_comment' },
      ],
      value: () => 'trello_list_lists',
    },
    {
      id: 'credential',
      title: 'Trello Account',
      type: 'oauth-input',
      serviceId: 'trello',
      requiredScopes: ['read', 'write'],
      placeholder: 'Select Trello account',
      required: true,
    },

    {
      id: 'boardId',
      title: 'Board',
      type: 'short-input',
      placeholder: 'Enter board ID',
      condition: {
        field: 'operation',
        value: 'trello_list_lists',
      },
      required: true,
    },
    {
      id: 'boardId',
      title: 'Board',
      type: 'short-input',
      placeholder: 'Enter board ID or search for a board',
      condition: {
        field: 'operation',
        value: 'trello_list_cards',
      },
      required: true,
    },
    {
      id: 'listId',
      title: 'List (Optional)',
      type: 'short-input',
      placeholder: 'Enter list ID to filter cards by list',
      condition: {
        field: 'operation',
        value: 'trello_list_cards',
      },
    },
    {
      id: 'boardId',
      title: 'Board',
      type: 'short-input',
      placeholder: 'Enter board ID or search for a board',
      condition: {
        field: 'operation',
        value: 'trello_create_card',
      },
      required: true,
    },
    {
      id: 'listId',
      title: 'List',
      type: 'short-input',
      placeholder: 'Enter list ID or search for a list',
      condition: {
        field: 'operation',
        value: 'trello_create_card',
      },
      required: true,
    },

    {
      id: 'name',
      title: 'Card Name',
      type: 'short-input',
      placeholder: 'Enter card name/title',
      condition: {
        field: 'operation',
        value: 'trello_create_card',
      },
      required: true,
    },

    {
      id: 'desc',
      title: 'Description',
      type: 'long-input',
      placeholder: 'Enter card description (optional)',
      condition: {
        field: 'operation',
        value: 'trello_create_card',
      },
    },

    {
      id: 'pos',
      title: 'Position',
      type: 'dropdown',
      options: [
        { label: 'Top', id: 'top' },
        { label: 'Bottom', id: 'bottom' },
      ],
      condition: {
        field: 'operation',
        value: 'trello_create_card',
      },
    },

    {
      id: 'due',
      title: 'Due Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD or ISO 8601',
      condition: {
        field: 'operation',
        value: 'trello_create_card',
      },
    },

    {
      id: 'labels',
      title: 'Labels',
      type: 'short-input',
      placeholder: 'Comma-separated label IDs (optional)',
      condition: {
        field: 'operation',
        value: 'trello_create_card',
      },
    },

    {
      id: 'cardId',
      title: 'Card',
      type: 'short-input',
      placeholder: 'Enter card ID or search for a card',
      condition: {
        field: 'operation',
        value: 'trello_update_card',
      },
      required: true,
    },

    {
      id: 'name',
      title: 'New Card Name',
      type: 'short-input',
      placeholder: 'Enter new card name (leave empty to keep current)',
      condition: {
        field: 'operation',
        value: 'trello_update_card',
      },
    },

    {
      id: 'desc',
      title: 'New Description',
      type: 'long-input',
      placeholder: 'Enter new description (leave empty to keep current)',
      condition: {
        field: 'operation',
        value: 'trello_update_card',
      },
    },

    {
      id: 'closed',
      title: 'Archive Card',
      type: 'switch',
      condition: {
        field: 'operation',
        value: 'trello_update_card',
      },
    },

    {
      id: 'dueComplete',
      title: 'Mark Due Date Complete',
      type: 'switch',
      condition: {
        field: 'operation',
        value: 'trello_update_card',
      },
    },

    {
      id: 'idList',
      title: 'Move to List',
      type: 'short-input',
      placeholder: 'Enter list ID to move card',
      condition: {
        field: 'operation',
        value: 'trello_update_card',
      },
    },

    {
      id: 'due',
      title: 'Due Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD or ISO 8601',
      condition: {
        field: 'operation',
        value: 'trello_update_card',
      },
    },

    {
      id: 'boardId',
      title: 'Board ID',
      type: 'short-input',
      placeholder: 'Enter board ID to get board actions',
      condition: {
        field: 'operation',
        value: 'trello_get_actions',
      },
    },
    {
      id: 'cardId',
      title: 'Card ID',
      type: 'short-input',
      placeholder: 'Enter card ID to get card actions',
      condition: {
        field: 'operation',
        value: 'trello_get_actions',
      },
    },
    {
      id: 'filter',
      title: 'Action Filter',
      type: 'short-input',
      placeholder: 'e.g., commentCard,updateCard',
      condition: {
        field: 'operation',
        value: 'trello_get_actions',
      },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '50',
      condition: {
        field: 'operation',
        value: 'trello_get_actions',
      },
    },
    {
      id: 'cardId',
      title: 'Card',
      type: 'short-input',
      placeholder: 'Enter card ID or search for a card',
      condition: {
        field: 'operation',
        value: 'trello_add_comment',
      },
      required: true,
    },

    {
      id: 'text',
      title: 'Comment',
      type: 'long-input',
      placeholder: 'Enter your comment',
      condition: {
        field: 'operation',
        value: 'trello_add_comment',
      },
      required: true,
    },
  ],
  tools: {
    access: [
      'trello_list_lists',
      'trello_list_cards',
      'trello_create_card',
      'trello_update_card',
      'trello_get_actions',
      'trello_add_comment',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'trello_list_lists':
            return 'trello_list_lists'
          case 'trello_list_cards':
            return 'trello_list_cards'
          case 'trello_create_card':
            return 'trello_create_card'
          case 'trello_update_card':
            return 'trello_update_card'
          case 'trello_get_actions':
            return 'trello_get_actions'
          case 'trello_add_comment':
            return 'trello_add_comment'
          default:
            return 'trello_list_lists'
        }
      },
      params: (params) => {
        const { operation, limit, closed, dueComplete, ...rest } = params

        const result: Record<string, any> = { ...rest }

        if (limit && operation === 'trello_get_actions') {
          result.limit = Number.parseInt(limit, 10)
        }

        if (closed !== undefined && operation === 'trello_update_card') {
          if (typeof closed === 'string') {
            result.closed = closed.toLowerCase() === 'true' || closed === '1'
          } else if (typeof closed === 'number') {
            result.closed = closed !== 0
          } else {
            result.closed = Boolean(closed)
          }
        }

        if (dueComplete !== undefined && operation === 'trello_update_card') {
          if (typeof dueComplete === 'string') {
            result.dueComplete = dueComplete.toLowerCase() === 'true' || dueComplete === '1'
          } else if (typeof dueComplete === 'number') {
            result.dueComplete = dueComplete !== 0
          } else {
            result.dueComplete = Boolean(dueComplete)
          }
        }

        return result
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Trello operation to perform' },
    credential: { type: 'string', description: 'Trello OAuth credential' },
    boardId: { type: 'string', description: 'Board ID' },
    listId: { type: 'string', description: 'List ID' },
    cardId: { type: 'string', description: 'Card ID' },
    name: { type: 'string', description: 'Card name/title' },
    desc: { type: 'string', description: 'Card or board description' },
    pos: { type: 'string', description: 'Card position (top, bottom, or number)' },
    due: { type: 'string', description: 'Due date in ISO 8601 format' },
    labels: { type: 'string', description: 'Comma-separated label IDs' },
    closed: { type: 'boolean', description: 'Archive/close status' },
    idList: { type: 'string', description: 'ID of list to move card to' },
    dueComplete: { type: 'boolean', description: 'Mark due date as complete' },
    filter: { type: 'string', description: 'Action type filter' },
    limit: { type: 'number', description: 'Maximum number of results' },
    text: { type: 'string', description: 'Comment text' },
  },
  outputs: {
    lists: {
      type: 'array',
      description: 'Array of list objects (for list_lists operation)',
    },
    cards: {
      type: 'array',
      description: 'Array of card objects (for list_cards operation)',
    },
    card: {
      type: 'json',
      description: 'Card object (for create_card and update_card operations)',
    },
    actions: {
      type: 'array',
      description: 'Array of action objects (for get_actions operation)',
    },
    comment: {
      type: 'json',
      description: 'Comment object (for add_comment operation)',
    },
    count: {
      type: 'number',
      description: 'Number of items returned (lists, cards, actions)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: tts.ts]---
Location: sim-main/apps/sim/blocks/blocks/tts.ts

```typescript
import { TTSIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { TtsBlockResponse } from '@/tools/tts/types'

export const TtsBlock: BlockConfig<TtsBlockResponse> = {
  type: 'tts',
  name: 'Text-to-Speech',
  description: 'Convert text to speech using AI voices',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Generate natural-sounding speech from text using state-of-the-art AI voices from OpenAI, Deepgram, ElevenLabs, Cartesia, Google Cloud, Azure, and PlayHT. Supports multiple voices, languages, and audio formats.',
  docsLink: 'https://docs.sim.ai/blocks/tts',
  category: 'tools',
  bgColor: '#181C1E',
  icon: TTSIcon,

  subBlocks: [
    // Provider selection
    {
      id: 'provider',
      title: 'Provider',
      type: 'dropdown',
      options: [
        { label: 'OpenAI TTS', id: 'openai' },
        { label: 'Deepgram Aura', id: 'deepgram' },
        { label: 'ElevenLabs', id: 'elevenlabs' },
        { label: 'Cartesia Sonic', id: 'cartesia' },
        { label: 'Google Cloud TTS', id: 'google' },
        { label: 'Azure TTS', id: 'azure' },
        { label: 'PlayHT', id: 'playht' },
      ],
      value: () => 'openai',
      required: true,
    },

    // Text input (common to all providers)
    {
      id: 'text',
      title: 'Text',
      type: 'long-input',
      placeholder: 'Enter the text to convert to speech...',
      required: true,
    },

    // OpenAI Model Selection
    {
      id: 'model',
      title: 'Model',
      type: 'dropdown',
      condition: { field: 'provider', value: 'openai' },
      options: [
        { label: 'TTS-1', id: 'tts-1' },
        { label: 'TTS-1-HD', id: 'tts-1-hd' },
        { label: 'GPT-4o Mini TTS', id: 'gpt-4o-mini-tts' },
      ],
      value: () => 'tts-1',
      required: false,
    },

    // OpenAI Voice Selection
    {
      id: 'voice',
      title: 'Voice',
      type: 'dropdown',
      condition: { field: 'provider', value: 'openai' },
      options: [
        { label: 'Alloy', id: 'alloy' },
        { label: 'Ash', id: 'ash' },
        { label: 'Ballad', id: 'ballad' },
        { label: 'Cedar', id: 'cedar' },
        { label: 'Coral', id: 'coral' },
        { label: 'Echo', id: 'echo' },
        { label: 'Marin', id: 'marin' },
        { label: 'Sage', id: 'sage' },
        { label: 'Shimmer', id: 'shimmer' },
        { label: 'Verse', id: 'verse' },
      ],
      value: () => 'alloy',
      required: false,
    },

    // OpenAI Response Format
    {
      id: 'responseFormat',
      title: 'Audio Format',
      type: 'dropdown',
      condition: { field: 'provider', value: 'openai' },
      options: [
        { label: 'MP3', id: 'mp3' },
        { label: 'Opus', id: 'opus' },
        { label: 'AAC', id: 'aac' },
        { label: 'FLAC', id: 'flac' },
        { label: 'WAV', id: 'wav' },
      ],
      value: () => 'mp3',
      required: false,
    },

    // OpenAI Speed
    {
      id: 'speed',
      title: 'Speed',
      type: 'slider',
      condition: { field: 'provider', value: 'openai' },
      min: 0.25,
      max: 4.0,
      step: 0.25,
      value: () => '1.0',
      required: false,
    },

    // Deepgram Voice Selection
    {
      id: 'voice',
      title: 'Voice',
      type: 'dropdown',
      condition: { field: 'provider', value: 'deepgram' },
      options: [
        { label: 'Asteria', id: 'aura-asteria-en' },
        { label: 'Luna', id: 'aura-luna-en' },
        { label: 'Stella', id: 'aura-stella-en' },
        { label: 'Athena', id: 'aura-athena-en' },
        { label: 'Hera', id: 'aura-hera-en' },
        { label: 'Orion', id: 'aura-orion-en' },
        { label: 'Arcas', id: 'aura-arcas-en' },
        { label: 'Perseus', id: 'aura-perseus-en' },
        { label: 'Angus', id: 'aura-angus-en' },
        { label: 'Orpheus', id: 'aura-orpheus-en' },
        { label: 'Helios', id: 'aura-helios-en' },
        { label: 'Zeus', id: 'aura-zeus-en' },
      ],
      value: () => 'aura-asteria-en',
      required: true,
    },

    // Deepgram Encoding
    {
      id: 'encoding',
      title: 'Audio Format',
      type: 'dropdown',
      condition: { field: 'provider', value: 'deepgram' },
      options: [
        { label: 'MP3', id: 'mp3' },
        { label: 'Opus', id: 'opus' },
        { label: 'AAC', id: 'aac' },
        { label: 'FLAC', id: 'flac' },
        { label: 'Linear16', id: 'linear16' },
      ],
      value: () => 'mp3',
      required: false,
    },

    // Deepgram Sample Rate (only for linear16 format)
    {
      id: 'sampleRate',
      title: 'Sample Rate',
      type: 'dropdown',
      condition: {
        field: 'provider',
        value: 'deepgram',
        and: { field: 'encoding', value: 'linear16' },
      },
      options: [
        { label: '8000 Hz', id: '8000' },
        { label: '16000 Hz', id: '16000' },
        { label: '24000 Hz', id: '24000' },
        { label: '48000 Hz', id: '48000' },
      ],
      value: () => '24000',
      required: false,
    },

    // ElevenLabs Voice ID
    {
      id: 'voiceId',
      title: 'Voice ID',
      type: 'short-input',
      condition: { field: 'provider', value: 'elevenlabs' },
      placeholder: 'Enter ElevenLabs voice ID',
      required: true,
    },

    // ElevenLabs Model Selection
    {
      id: 'modelId',
      title: 'Model',
      type: 'dropdown',
      condition: { field: 'provider', value: 'elevenlabs' },
      options: [
        { label: 'Turbo v2.5', id: 'eleven_turbo_v2_5' },
        { label: 'Flash v2.5', id: 'eleven_flash_v2_5' },
        { label: 'Multilingual v2', id: 'eleven_multilingual_v2' },
        { label: 'Turbo v2', id: 'eleven_turbo_v2' },
        { label: 'Monolingual v1', id: 'eleven_monolingual_v1' },
        { label: 'Multilingual v1', id: 'eleven_multilingual_v1' },
      ],
      value: () => 'eleven_turbo_v2_5',
      required: false,
    },

    // ElevenLabs Stability
    {
      id: 'stability',
      title: 'Stability',
      type: 'slider',
      condition: { field: 'provider', value: 'elevenlabs' },
      min: 0.0,
      max: 1.0,
      step: 0.05,
      value: () => '0.5',
      required: false,
    },

    // ElevenLabs Similarity Boost
    {
      id: 'similarityBoost',
      title: 'Similarity Boost',
      type: 'slider',
      condition: { field: 'provider', value: 'elevenlabs' },
      min: 0.0,
      max: 1.0,
      step: 0.05,
      value: () => '0.8',
      required: false,
    },

    // ElevenLabs Style
    {
      id: 'style',
      title: 'Style',
      type: 'slider',
      condition: { field: 'provider', value: 'elevenlabs' },
      min: 0.0,
      max: 1.0,
      step: 0.05,
      value: () => '0.0',
      required: false,
    },

    // Cartesia Model Selection
    {
      id: 'modelId',
      title: 'Model',
      type: 'dropdown',
      condition: { field: 'provider', value: 'cartesia' },
      options: [
        { label: 'Sonic', id: 'sonic' },
        { label: 'Sonic 2', id: 'sonic-2' },
        { label: 'Sonic Turbo', id: 'sonic-turbo' },
        { label: 'Sonic 3', id: 'sonic-3' },
        { label: 'Sonic Multilingual', id: 'sonic-multilingual' },
      ],
      value: () => 'sonic-3',
      required: false,
    },

    // Cartesia Voice
    {
      id: 'voice',
      title: 'Voice ID',
      type: 'short-input',
      condition: { field: 'provider', value: 'cartesia' },
      placeholder: 'Enter Cartesia voice ID',
      required: true,
    },

    // Cartesia Speed
    {
      id: 'speed',
      title: 'Speed',
      type: 'slider',
      condition: { field: 'provider', value: 'cartesia' },
      min: 0.5,
      max: 2.0,
      step: 0.1,
      value: () => '1.0',
      required: false,
    },

    // Google Voice ID
    {
      id: 'voiceId',
      title: 'Voice ID',
      type: 'short-input',
      condition: { field: 'provider', value: 'google' },
      placeholder: 'e.g., en-US-Neural2-A',
      required: false,
    },

    // Google Language Code
    {
      id: 'languageCode',
      title: 'Language Code',
      type: 'short-input',
      condition: { field: 'provider', value: 'google' },
      placeholder: 'e.g., en-US, es-ES',
      value: () => 'en-US',
      required: true,
    },

    // Google Speaking Rate
    {
      id: 'speakingRate',
      title: 'Speaking Rate',
      type: 'slider',
      condition: { field: 'provider', value: 'google' },
      min: 0.25,
      max: 2.0,
      step: 0.25,
      value: () => '1.0',
      required: false,
    },

    // Google Pitch
    {
      id: 'pitch',
      title: 'Pitch',
      type: 'slider',
      condition: { field: 'provider', value: 'google' },
      min: -20.0,
      max: 20.0,
      step: 1.0,
      value: () => '0.0',
      required: false,
    },

    // Azure Voice ID
    {
      id: 'voiceId',
      title: 'Voice ID',
      type: 'short-input',
      condition: { field: 'provider', value: 'azure' },
      placeholder: 'e.g., en-US-JennyNeural',
      required: false,
    },

    // Azure Region
    {
      id: 'region',
      title: 'Region',
      type: 'short-input',
      condition: { field: 'provider', value: 'azure' },
      placeholder: 'e.g., eastus, westus',
      required: false,
    },

    // Azure Output Format
    {
      id: 'outputFormat',
      title: 'Output Format',
      type: 'dropdown',
      condition: { field: 'provider', value: 'azure' },
      options: [
        { label: 'MP3 24kHz 48kbps', id: 'audio-24khz-48kbitrate-mono-mp3' },
        { label: 'MP3 24kHz 96kbps', id: 'audio-24khz-96kbitrate-mono-mp3' },
        { label: 'MP3 48kHz 96kbps', id: 'audio-48khz-96kbitrate-mono-mp3' },
      ],
      value: () => 'audio-24khz-96kbitrate-mono-mp3',
      required: false,
    },

    // Azure Style
    {
      id: 'style',
      title: 'Speaking Style',
      type: 'short-input',
      condition: { field: 'provider', value: 'azure' },
      placeholder: 'e.g., cheerful, sad, angry',
      required: false,
    },

    // PlayHT User ID
    {
      id: 'userId',
      title: 'User ID',
      type: 'short-input',
      condition: { field: 'provider', value: 'playht' },
      placeholder: 'Enter your PlayHT user ID',
      password: true,
      required: true,
    },

    // PlayHT Voice
    {
      id: 'voice',
      title: 'Voice',
      type: 'short-input',
      condition: { field: 'provider', value: 'playht' },
      placeholder: 'Voice ID or manifest URL',
      required: false,
    },

    // PlayHT Quality
    {
      id: 'quality',
      title: 'Quality',
      type: 'dropdown',
      condition: { field: 'provider', value: 'playht' },
      options: [
        { label: 'Draft', id: 'draft' },
        { label: 'Standard', id: 'standard' },
        { label: 'Premium', id: 'premium' },
      ],
      value: () => 'standard',
      required: false,
    },

    // PlayHT Speed
    {
      id: 'speed',
      title: 'Speed',
      type: 'slider',
      condition: { field: 'provider', value: 'playht' },
      min: 0.5,
      max: 2.0,
      step: 0.1,
      value: () => '1.0',
      required: false,
    },

    // API Key (common to all providers)
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your API key',
      password: true,
      required: true,
    },
  ],

  tools: {
    access: [
      'tts_openai',
      'tts_deepgram',
      'tts_elevenlabs',
      'tts_cartesia',
      'tts_google',
      'tts_azure',
      'tts_playht',
    ],
    config: {
      tool: (params) => {
        // Select tool based on provider
        switch (params.provider) {
          case 'openai':
            return 'tts_openai'
          case 'deepgram':
            return 'tts_deepgram'
          case 'elevenlabs':
            return 'tts_elevenlabs'
          case 'cartesia':
            return 'tts_cartesia'
          case 'google':
            return 'tts_google'
          case 'azure':
            return 'tts_azure'
          case 'playht':
            return 'tts_playht'
          default:
            return 'tts_openai'
        }
      },
      params: (params) => {
        const baseParams = {
          text: params.text,
          apiKey: params.apiKey,
        }

        if (params.provider === 'openai') {
          return {
            ...baseParams,
            model: params.model,
            voice: params.voice,
            responseFormat: params.responseFormat,
            speed: params.speed ? Number(params.speed) : undefined,
          }
        }

        if (params.provider === 'deepgram') {
          return {
            ...baseParams,
            voice: params.voice,
            encoding: params.encoding,
            sampleRate: params.sampleRate ? Number(params.sampleRate) : undefined,
          }
        }

        if (params.provider === 'elevenlabs') {
          return {
            ...baseParams,
            voiceId: params.voiceId,
            modelId: params.modelId,
            stability: params.stability ? Number(params.stability) : undefined,
            similarityBoost: params.similarityBoost ? Number(params.similarityBoost) : undefined,
            style: params.style ? Number(params.style) : undefined,
          }
        }

        if (params.provider === 'cartesia') {
          return {
            ...baseParams,
            modelId: params.modelId,
            voice: params.voice,
            speed: params.speed ? Number(params.speed) : undefined,
          }
        }

        if (params.provider === 'google') {
          return {
            ...baseParams,
            voiceId: params.voiceId,
            languageCode: params.languageCode,
            speakingRate: params.speakingRate ? Number(params.speakingRate) : undefined,
            pitch: params.pitch ? Number(params.pitch) : undefined,
          }
        }

        if (params.provider === 'azure') {
          return {
            ...baseParams,
            voiceId: params.voiceId,
            region: params.region,
            outputFormat: params.outputFormat,
            style: params.style,
          }
        }

        if (params.provider === 'playht') {
          return {
            ...baseParams,
            userId: params.userId,
            voice: params.voice,
            quality: params.quality,
            speed: params.speed ? Number(params.speed) : undefined,
          }
        }

        return baseParams
      },
    },
  },

  inputs: {
    provider: {
      type: 'string',
      description: 'TTS provider (openai, deepgram, elevenlabs, cartesia, google, azure, playht)',
    },
    text: { type: 'string', description: 'Text to convert to speech' },
    apiKey: { type: 'string', description: 'Provider API key' },
    // OpenAI
    model: { type: 'string', description: 'OpenAI model (tts-1, tts-1-hd, gpt-4o-mini-tts)' },
    voice: { type: 'string', description: 'Voice identifier' },
    responseFormat: { type: 'string', description: 'Audio format (mp3, opus, aac, flac, wav)' },
    speed: { type: 'number', description: 'Speech speed (0.25 to 4.0) or speed multiplier' },
    // Deepgram
    encoding: { type: 'string', description: 'Audio encoding' },
    sampleRate: { type: 'number', description: 'Sample rate in Hz' },
    // ElevenLabs
    voiceId: { type: 'string', description: 'Voice ID (ElevenLabs, Google, Azure)' },
    modelId: { type: 'string', description: 'Model ID (ElevenLabs, Cartesia)' },
    stability: { type: 'number', description: 'Voice stability (0.0 to 1.0)' },
    similarityBoost: { type: 'number', description: 'Similarity boost (0.0 to 1.0)' },
    style: { type: 'string', description: 'Style exaggeration or speaking style' },
    // Cartesia
    language: { type: 'string', description: 'Language code (Cartesia)' },
    // Google Cloud
    languageCode: { type: 'string', description: 'Language code (Google)' },
    speakingRate: { type: 'number', description: 'Speaking rate (Google)' },
    pitch: { type: 'number', description: 'Voice pitch (Google)' },
    // Azure
    region: { type: 'string', description: 'Azure region' },
    outputFormat: { type: 'string', description: 'Output audio format' },
    // PlayHT
    userId: { type: 'string', description: 'PlayHT user ID' },
    quality: { type: 'string', description: 'Quality level (PlayHT)' },
  },

  outputs: {
    audioUrl: { type: 'string', description: 'URL to the generated audio file' },
    audioFile: { type: 'json', description: 'Generated audio file object (UserFile)' },
    duration: {
      type: 'number',
      description: 'Audio duration in seconds',
      condition: { field: 'provider', value: 'deepgram' },
    },
    characterCount: { type: 'number', description: 'Number of characters processed' },
    format: { type: 'string', description: 'Audio format' },
    provider: { type: 'string', description: 'TTS provider used' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: twilio.ts]---
Location: sim-main/apps/sim/blocks/blocks/twilio.ts

```typescript
import { TwilioIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { TwilioSMSBlockOutput } from '@/tools/twilio/types'

export const TwilioSMSBlock: BlockConfig<TwilioSMSBlockOutput> = {
  type: 'twilio_sms',
  name: 'Twilio SMS',
  description: 'Send SMS messages',
  authMode: AuthMode.ApiKey,
  longDescription: 'Integrate Twilio into the workflow. Can send SMS messages.',
  category: 'tools',
  bgColor: '#F22F46', // Twilio brand color
  icon: TwilioIcon,
  subBlocks: [
    {
      id: 'phoneNumbers',
      title: 'Recipient Phone Numbers',
      type: 'long-input',
      placeholder: 'Enter phone numbers with country code (one per line, e.g., +1234567890)',
      required: true,
    },
    {
      id: 'message',
      title: 'Message',
      type: 'long-input',
      placeholder: 'e.g. "Hello! This is a test message."',
      required: true,
    },
    {
      id: 'accountSid',
      title: 'Twilio Account SID',
      type: 'short-input',
      placeholder: 'Your Twilio Account SID',
      required: true,
    },
    {
      id: 'authToken',
      title: 'Auth Token',
      type: 'short-input',
      placeholder: 'Your Twilio Auth Token',
      password: true,
      required: true,
    },
    {
      id: 'fromNumber',
      title: 'From Twilio Phone Number',
      type: 'short-input',
      placeholder: 'e.g. +1234567890',
      required: true,
    },
  ],
  tools: {
    access: ['twilio_send_sms'],
    config: {
      tool: () => 'twilio_send_sms',
    },
  },
  inputs: {
    phoneNumbers: { type: 'string', description: 'Recipient phone numbers' },
    message: { type: 'string', description: 'SMS message text' },
    accountSid: { type: 'string', description: 'Twilio account SID' },
    authToken: { type: 'string', description: 'Twilio auth token' },
    fromNumber: { type: 'string', description: 'Sender phone number' },
  },
  outputs: {
    success: { type: 'boolean', description: 'Send success status' },
    messageId: { type: 'string', description: 'Twilio message SID' },
    status: { type: 'string', description: 'SMS delivery status (queued, sent, delivered, etc.)' },
    error: { type: 'string', description: 'Error information if sending fails' },
  },
}
```

--------------------------------------------------------------------------------

````
