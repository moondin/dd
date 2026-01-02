---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 768
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 768 of 933)

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

---[FILE: message.ts]---
Location: sim-main/apps/sim/tools/telegram/message.ts

```typescript
import { ErrorExtractorId } from '@/tools/error-extractors'
import type {
  TelegramMessage,
  TelegramSendMessageParams,
  TelegramSendMessageResponse,
} from '@/tools/telegram/types'
import { convertMarkdownToHTML } from '@/tools/telegram/utils'
import type { ToolConfig } from '@/tools/types'

export const telegramMessageTool: ToolConfig<
  TelegramSendMessageParams,
  TelegramSendMessageResponse
> = {
  id: 'telegram_message',
  name: 'Telegram Send Message',
  description:
    'Send messages to Telegram channels or users through the Telegram Bot API. Enables direct communication and notifications with message tracking and chat confirmation.',
  version: '1.0.0',
  errorExtractor: ErrorExtractorId.TELEGRAM_DESCRIPTION,

  params: {
    botToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Telegram Bot API Token',
    },
    chatId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Target Telegram chat ID',
    },
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Message text to send',
    },
  },

  request: {
    url: (params: TelegramSendMessageParams) =>
      `https://api.telegram.org/bot${params.botToken}/sendMessage`,
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: TelegramSendMessageParams) => ({
      chat_id: params.chatId,
      text: convertMarkdownToHTML(params.text),
      parse_mode: 'HTML',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.ok) {
      const errorMessage = data.description || data.error || 'Failed to send message'
      throw new Error(errorMessage)
    }

    const result = data.result as TelegramMessage

    return {
      success: true,
      output: {
        message: 'Message sent successfully',
        data: result,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Telegram message data',
      properties: {
        message_id: {
          type: 'number',
          description: 'Unique Telegram message identifier',
        },
        from: {
          type: 'object',
          description: 'Chat information',
          properties: {
            id: { type: 'number', description: 'Chat ID' },
            is_bot: {
              type: 'boolean',
              description: 'Whether the chat is a bot or not',
            },
            first_name: {
              type: 'string',
              description: 'Chat username (if available)',
            },
            username: {
              type: 'string',
              description: 'Chat title (for groups and channels)',
            },
          },
        },
        chat: {
          type: 'object',
          description: 'Information about the bot that sent the message',
          properties: {
            id: { type: 'number', description: 'Bot user ID' },
            first_name: { type: 'string', description: 'Bot first name' },
            username: { type: 'string', description: 'Bot username' },
            type: {
              type: 'string',
              description: 'chat type private or channel',
            },
          },
        },
        date: {
          type: 'number',
          description: 'Unix timestamp when message was sent',
        },
        text: {
          type: 'string',
          description: 'Text content of the sent message',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: send_animation.ts]---
Location: sim-main/apps/sim/tools/telegram/send_animation.ts

```typescript
import { ErrorExtractorId } from '@/tools/error-extractors'
import type {
  TelegramMedia,
  TelegramSendAnimationParams,
  TelegramSendMediaResponse,
} from '@/tools/telegram/types'
import { convertMarkdownToHTML } from '@/tools/telegram/utils'
import type { ToolConfig } from '@/tools/types'

export const telegramSendAnimationTool: ToolConfig<
  TelegramSendAnimationParams,
  TelegramSendMediaResponse
> = {
  id: 'telegram_send_animation',
  name: 'Telegram Send Animation',
  description: 'Send animations (GIFs) to Telegram channels or users through the Telegram Bot API.',
  version: '1.0.0',
  errorExtractor: ErrorExtractorId.TELEGRAM_DESCRIPTION,

  params: {
    botToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Telegram Bot API Token',
    },
    chatId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Target Telegram chat ID',
    },
    animation: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Animation to send. Pass a file_id or HTTP URL',
    },
    caption: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Animation caption (optional)',
    },
  },

  request: {
    url: (params: TelegramSendAnimationParams) =>
      `https://api.telegram.org/bot${params.botToken}/sendAnimation`,
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: TelegramSendAnimationParams) => {
      const body: Record<string, any> = {
        chat_id: params.chatId,
        animation: params.animation,
      }

      if (params.caption) {
        body.caption = convertMarkdownToHTML(params.caption)
        body.parse_mode = 'HTML'
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.ok) {
      const errorMessage = data.description || data.error || 'Failed to send animation'
      throw new Error(errorMessage)
    }

    const result = data.result as TelegramMedia

    return {
      success: true,
      output: {
        message: 'Animation sent successfully',
        data: result,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Telegram message data including optional media',
      properties: {
        message_id: {
          type: 'number',
          description: 'Unique Telegram message identifier',
        },
        from: {
          type: 'object',
          description: 'Information about the sender',
          properties: {
            id: { type: 'number', description: 'Sender ID' },
            is_bot: {
              type: 'boolean',
              description: 'Whether the chat is a bot or not',
            },
            first_name: {
              type: 'string',
              description: "Sender's first name (if available)",
            },
            username: {
              type: 'string',
              description: "Sender's username (if available)",
            },
          },
        },
        chat: {
          type: 'object',
          description: 'Information about the chat where message was sent',
          properties: {
            id: { type: 'number', description: 'Chat ID' },
            first_name: {
              type: 'string',
              description: 'Chat first name (if private chat)',
            },
            username: {
              type: 'string',
              description: 'Chat username (for private or channels)',
            },
            type: {
              type: 'string',
              description: 'Type of chat (private, group, supergroup, or channel)',
            },
          },
        },
        date: {
          type: 'number',
          description: 'Unix timestamp when the message was sent',
        },
        text: {
          type: 'string',
          description: 'Text content of the sent message (if applicable)',
        },
        format: {
          type: 'object',
          description: 'Media format information (for videos, GIFs, etc.)',
          properties: {
            file_name: { type: 'string', description: 'Media file name' },
            mime_type: { type: 'string', description: 'Media MIME type' },
            duration: {
              type: 'number',
              description: 'Duration of media in seconds',
            },
            width: { type: 'number', description: 'Media width in pixels' },
            height: { type: 'number', description: 'Media height in pixels' },
            thumbnail: {
              type: 'object',
              description: 'Thumbnail image details',
              properties: {
                file_id: { type: 'string', description: 'Thumbnail file ID' },
                file_unique_id: {
                  type: 'string',
                  description: 'Unique thumbnail file identifier',
                },
                file_size: {
                  type: 'number',
                  description: 'Thumbnail file size in bytes',
                },
                width: {
                  type: 'number',
                  description: 'Thumbnail width in pixels',
                },
                height: {
                  type: 'number',
                  description: 'Thumbnail height in pixels',
                },
              },
            },
            thumb: {
              type: 'object',
              description: 'Secondary thumbnail details (duplicate of thumbnail)',
              properties: {
                file_id: { type: 'string', description: 'Thumbnail file ID' },
                file_unique_id: {
                  type: 'string',
                  description: 'Unique thumbnail file identifier',
                },
                file_size: {
                  type: 'number',
                  description: 'Thumbnail file size in bytes',
                },
                width: {
                  type: 'number',
                  description: 'Thumbnail width in pixels',
                },
                height: {
                  type: 'number',
                  description: 'Thumbnail height in pixels',
                },
              },
            },
            file_id: { type: 'string', description: 'Media file ID' },
            file_unique_id: {
              type: 'string',
              description: 'Unique media file identifier',
            },
            file_size: {
              type: 'number',
              description: 'Size of media file in bytes',
            },
          },
        },
        document: {
          type: 'object',
          description: 'Document file details if the message contains a document',
          properties: {
            file_name: { type: 'string', description: 'Document file name' },
            mime_type: { type: 'string', description: 'Document MIME type' },
            thumbnail: {
              type: 'object',
              description: 'Document thumbnail information',
              properties: {
                file_id: { type: 'string', description: 'Thumbnail file ID' },
                file_unique_id: {
                  type: 'string',
                  description: 'Unique thumbnail file identifier',
                },
                file_size: {
                  type: 'number',
                  description: 'Thumbnail file size in bytes',
                },
                width: {
                  type: 'number',
                  description: 'Thumbnail width in pixels',
                },
                height: {
                  type: 'number',
                  description: 'Thumbnail height in pixels',
                },
              },
            },
            thumb: {
              type: 'object',
              description: 'Duplicate thumbnail info (used for compatibility)',
              properties: {
                file_id: { type: 'string', description: 'Thumbnail file ID' },
                file_unique_id: {
                  type: 'string',
                  description: 'Unique thumbnail file identifier',
                },
                file_size: {
                  type: 'number',
                  description: 'Thumbnail file size in bytes',
                },
                width: {
                  type: 'number',
                  description: 'Thumbnail width in pixels',
                },
                height: {
                  type: 'number',
                  description: 'Thumbnail height in pixels',
                },
              },
            },
            file_id: { type: 'string', description: 'Document file ID' },
            file_unique_id: {
              type: 'string',
              description: 'Unique document file identifier',
            },
            file_size: {
              type: 'number',
              description: 'Size of document file in bytes',
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: send_audio.ts]---
Location: sim-main/apps/sim/tools/telegram/send_audio.ts

```typescript
import { ErrorExtractorId } from '@/tools/error-extractors'
import type {
  TelegramAudio,
  TelegramSendAudioParams,
  TelegramSendAudioResponse,
} from '@/tools/telegram/types'
import { convertMarkdownToHTML } from '@/tools/telegram/utils'
import type { ToolConfig } from '@/tools/types'

export const telegramSendAudioTool: ToolConfig<TelegramSendAudioParams, TelegramSendAudioResponse> =
  {
    id: 'telegram_send_audio',
    name: 'Telegram Send Audio',
    description: 'Send audio files to Telegram channels or users through the Telegram Bot API.',
    version: '1.0.0',
    errorExtractor: ErrorExtractorId.TELEGRAM_DESCRIPTION,

    params: {
      botToken: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your Telegram Bot API Token',
      },
      chatId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Target Telegram chat ID',
      },
      audio: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Audio file to send. Pass a file_id or HTTP URL',
      },
      caption: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Audio caption (optional)',
      },
    },

    request: {
      url: (params: TelegramSendAudioParams) =>
        `https://api.telegram.org/bot${params.botToken}/sendAudio`,
      method: 'POST',
      headers: () => ({
        'Content-Type': 'application/json',
      }),
      body: (params: TelegramSendAudioParams) => {
        const body: Record<string, any> = {
          chat_id: params.chatId,
          audio: params.audio,
        }

        if (params.caption) {
          body.caption = convertMarkdownToHTML(params.caption)
          body.parse_mode = 'HTML'
        }

        return body
      },
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      if (!data.ok) {
        const errorMessage = data.description || data.error || 'Failed to send audio'
        throw new Error(errorMessage)
      }

      const result = data.result as TelegramAudio

      return {
        success: true,
        output: {
          message: 'Audio sent successfully',
          data: result,
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
      data: {
        type: 'object',
        description: 'Telegram message data including voice/audio information',
        properties: {
          message_id: {
            type: 'number',
            description: 'Unique Telegram message identifier',
          },
          from: {
            type: 'object',
            description: 'Information about the sender',
            properties: {
              id: { type: 'number', description: 'Sender ID' },
              is_bot: {
                type: 'boolean',
                description: 'Whether the chat is a bot or not',
              },
              first_name: {
                type: 'string',
                description: "Sender's first name (if available)",
              },
              username: {
                type: 'string',
                description: "Sender's username (if available)",
              },
            },
          },
          chat: {
            type: 'object',
            description: 'Information about the chat where the message was sent',
            properties: {
              id: { type: 'number', description: 'Chat ID' },
              first_name: {
                type: 'string',
                description: 'Chat first name (if private chat)',
              },
              username: {
                type: 'string',
                description: 'Chat username (for private or channels)',
              },
              type: {
                type: 'string',
                description: 'Type of chat (private, group, supergroup, or channel)',
              },
            },
          },
          date: {
            type: 'number',
            description: 'Unix timestamp when the message was sent',
          },
          text: {
            type: 'string',
            description: 'Text content of the sent message (if applicable)',
          },
          audio: {
            type: 'object',
            description: 'Audio file details',
            properties: {
              duration: {
                type: 'number',
                description: 'Duration of the audio in seconds',
              },
              performer: {
                type: 'string',
                description: 'Performer of the audio',
              },
              title: {
                type: 'string',
                description: 'Title of the audio',
              },
              file_name: {
                type: 'string',
                description: 'Original filename of the audio',
              },
              mime_type: {
                type: 'string',
                description: 'MIME type of the audio file',
              },
              file_id: {
                type: 'string',
                description: 'Unique file identifier for this audio',
              },
              file_unique_id: {
                type: 'string',
                description: 'Unique identifier across different bots for this file',
              },
              file_size: {
                type: 'number',
                description: 'Size of the audio file in bytes',
              },
            },
          },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: send_document.ts]---
Location: sim-main/apps/sim/tools/telegram/send_document.ts

```typescript
import type {
  TelegramSendDocumentParams,
  TelegramSendDocumentResponse,
} from '@/tools/telegram/types'
import type { ToolConfig } from '@/tools/types'

export const telegramSendDocumentTool: ToolConfig<
  TelegramSendDocumentParams,
  TelegramSendDocumentResponse
> = {
  id: 'telegram_send_document',
  name: 'Telegram Send Document',
  description:
    'Send documents (PDF, ZIP, DOC, etc.) to Telegram channels or users through the Telegram Bot API.',
  version: '1.0.0',

  params: {
    botToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Telegram Bot API Token',
    },
    chatId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Target Telegram chat ID',
    },
    files: {
      type: 'file[]',
      required: false,
      visibility: 'user-only',
      description: 'Document file to send (PDF, ZIP, DOC, etc.). Max size: 50MB',
    },
    caption: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Document caption (optional)',
    },
  },

  request: {
    url: '/api/tools/telegram/send-document',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: TelegramSendDocumentParams) => {
      let normalizedFiles: unknown[] | null = null
      if (params.files) {
        normalizedFiles = Array.isArray(params.files) ? params.files : [params.files]
      }

      return {
        botToken: params.botToken,
        chatId: params.chatId,
        files: normalizedFiles,
        caption: params.caption,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to send Telegram document')
    }
    return {
      success: true,
      output: data.output,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Telegram message data including document',
      properties: {
        message_id: {
          type: 'number',
          description: 'Unique Telegram message identifier',
        },
        from: {
          type: 'object',
          description: 'Information about the sender',
          properties: {
            id: { type: 'number', description: 'Sender ID' },
            is_bot: {
              type: 'boolean',
              description: 'Whether the chat is a bot or not',
            },
            first_name: {
              type: 'string',
              description: "Sender's first name (if available)",
            },
            username: {
              type: 'string',
              description: "Sender's username (if available)",
            },
          },
        },
        chat: {
          type: 'object',
          description: 'Information about the chat where message was sent',
          properties: {
            id: { type: 'number', description: 'Chat ID' },
            first_name: {
              type: 'string',
              description: 'Chat first name (if private chat)',
            },
            username: {
              type: 'string',
              description: 'Chat username (for private or channels)',
            },
            type: {
              type: 'string',
              description: 'Type of chat (private, group, supergroup, or channel)',
            },
          },
        },
        date: {
          type: 'number',
          description: 'Unix timestamp when the message was sent',
        },
        document: {
          type: 'object',
          description: 'Document file details',
          properties: {
            file_name: { type: 'string', description: 'Document file name' },
            mime_type: { type: 'string', description: 'Document MIME type' },
            file_id: { type: 'string', description: 'Document file ID' },
            file_unique_id: {
              type: 'string',
              description: 'Unique document file identifier',
            },
            file_size: {
              type: 'number',
              description: 'Size of document file in bytes',
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: send_photo.ts]---
Location: sim-main/apps/sim/tools/telegram/send_photo.ts

```typescript
import { ErrorExtractorId } from '@/tools/error-extractors'
import type {
  TelegramPhoto,
  TelegramSendPhotoParams,
  TelegramSendPhotoResponse,
} from '@/tools/telegram/types'
import { convertMarkdownToHTML } from '@/tools/telegram/utils'
import type { ToolConfig } from '@/tools/types'

export const telegramSendPhotoTool: ToolConfig<TelegramSendPhotoParams, TelegramSendPhotoResponse> =
  {
    id: 'telegram_send_photo',
    name: 'Telegram Send Photo',
    description: 'Send photos to Telegram channels or users through the Telegram Bot API.',
    version: '1.0.0',
    errorExtractor: ErrorExtractorId.TELEGRAM_DESCRIPTION,

    params: {
      botToken: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your Telegram Bot API Token',
      },
      chatId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Target Telegram chat ID',
      },
      photo: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Photo to send. Pass a file_id or HTTP URL',
      },
      caption: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Photo caption (optional)',
      },
    },

    request: {
      url: (params: TelegramSendPhotoParams) =>
        `https://api.telegram.org/bot${params.botToken}/sendPhoto`,
      method: 'POST',
      headers: () => ({
        'Content-Type': 'application/json',
      }),
      body: (params: TelegramSendPhotoParams) => {
        const body: Record<string, any> = {
          chat_id: params.chatId,
          photo: params.photo,
        }

        if (params.caption) {
          body.caption = convertMarkdownToHTML(params.caption)
          body.parse_mode = 'HTML'
        }

        return body
      },
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      if (!data.ok) {
        const errorMessage = data.description || data.error || 'Failed to send photo'
        throw new Error(errorMessage)
      }

      const result = data.result as TelegramPhoto

      return {
        success: true,
        output: {
          message: 'Photo sent successfully',
          data: result,
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
      data: {
        type: 'object',
        description: 'Telegram message data including optional photo(s)',
        properties: {
          message_id: {
            type: 'number',
            description: 'Unique Telegram message identifier',
          },
          from: {
            type: 'object',
            description: 'Chat information',
            properties: {
              id: { type: 'number', description: 'Chat ID' },
              is_bot: {
                type: 'boolean',
                description: 'Whether the chat is a bot or not',
              },
              first_name: {
                type: 'string',
                description: 'Chat username (if available)',
              },
              username: {
                type: 'string',
                description: 'Chat title (for groups and channels)',
              },
            },
          },
          chat: {
            type: 'object',
            description: 'Information about the bot that sent the message',
            properties: {
              id: { type: 'number', description: 'Bot user ID' },
              first_name: { type: 'string', description: 'Bot first name' },
              username: { type: 'string', description: 'Bot username' },
              type: {
                type: 'string',
                description: 'Chat type (private, group, supergroup, channel)',
              },
            },
          },
          date: {
            type: 'number',
            description: 'Unix timestamp when message was sent',
          },
          text: {
            type: 'string',
            description: 'Text content of the sent message (if applicable)',
          },
          photo: {
            type: 'array',
            description: 'List of photos included in the message',
            items: {
              type: 'object',
              properties: {
                file_id: {
                  type: 'string',
                  description: 'Unique file ID of the photo',
                },
                file_unique_id: {
                  type: 'string',
                  description: 'Unique identifier for this file across different bots',
                },
                file_size: {
                  type: 'number',
                  description: 'Size of the photo file in bytes',
                },
                width: { type: 'number', description: 'Photo width in pixels' },
                height: { type: 'number', description: 'Photo height in pixels' },
              },
            },
          },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: send_video.ts]---
Location: sim-main/apps/sim/tools/telegram/send_video.ts

```typescript
import { ErrorExtractorId } from '@/tools/error-extractors'
import type {
  TelegramMedia,
  TelegramSendMediaResponse,
  TelegramSendVideoParams,
} from '@/tools/telegram/types'
import { convertMarkdownToHTML } from '@/tools/telegram/utils'
import type { ToolConfig } from '@/tools/types'

export const telegramSendVideoTool: ToolConfig<TelegramSendVideoParams, TelegramSendMediaResponse> =
  {
    id: 'telegram_send_video',
    name: 'Telegram Send Video',
    description: 'Send videos to Telegram channels or users through the Telegram Bot API.',
    version: '1.0.0',
    errorExtractor: ErrorExtractorId.TELEGRAM_DESCRIPTION,

    params: {
      botToken: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your Telegram Bot API Token',
      },
      chatId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Target Telegram chat ID',
      },
      video: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Video to send. Pass a file_id or HTTP URL',
      },
      caption: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Video caption (optional)',
      },
    },

    request: {
      url: (params: TelegramSendVideoParams) =>
        `https://api.telegram.org/bot${params.botToken}/sendVideo`,
      method: 'POST',
      headers: () => ({
        'Content-Type': 'application/json',
      }),
      body: (params: TelegramSendVideoParams) => {
        const body: Record<string, any> = {
          chat_id: params.chatId,
          video: params.video,
        }

        if (params.caption) {
          body.caption = convertMarkdownToHTML(params.caption)
          body.parse_mode = 'HTML'
        }

        return body
      },
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      if (!data.ok) {
        const errorMessage = data.description || data.error || 'Failed to send video'
        throw new Error(errorMessage)
      }

      const result = data.result as TelegramMedia

      return {
        success: true,
        output: {
          message: 'Video sent successfully',
          data: result,
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
      data: {
        type: 'object',
        description: 'Telegram message data including optional media',
        properties: {
          message_id: {
            type: 'number',
            description: 'Unique Telegram message identifier',
          },
          from: {
            type: 'object',
            description: 'Information about the sender',
            properties: {
              id: { type: 'number', description: 'Sender ID' },
              is_bot: {
                type: 'boolean',
                description: 'Whether the chat is a bot or not',
              },
              first_name: {
                type: 'string',
                description: "Sender's first name (if available)",
              },
              username: {
                type: 'string',
                description: "Sender's username (if available)",
              },
            },
          },
          chat: {
            type: 'object',
            description: 'Information about the chat where message was sent',
            properties: {
              id: { type: 'number', description: 'Chat ID' },
              first_name: {
                type: 'string',
                description: 'Chat first name (if private chat)',
              },
              username: {
                type: 'string',
                description: 'Chat username (for private or channels)',
              },
              type: {
                type: 'string',
                description: 'Type of chat (private, group, supergroup, or channel)',
              },
            },
          },
          date: {
            type: 'number',
            description: 'Unix timestamp when the message was sent',
          },
          text: {
            type: 'string',
            description: 'Text content of the sent message (if applicable)',
          },
          format: {
            type: 'object',
            description: 'Media format information (for videos, GIFs, etc.)',
            properties: {
              file_name: { type: 'string', description: 'Media file name' },
              mime_type: { type: 'string', description: 'Media MIME type' },
              duration: {
                type: 'number',
                description: 'Duration of media in seconds',
              },
              width: { type: 'number', description: 'Media width in pixels' },
              height: { type: 'number', description: 'Media height in pixels' },
              thumbnail: {
                type: 'object',
                description: 'Thumbnail image details',
                properties: {
                  file_id: { type: 'string', description: 'Thumbnail file ID' },
                  file_unique_id: {
                    type: 'string',
                    description: 'Unique thumbnail file identifier',
                  },
                  file_size: {
                    type: 'number',
                    description: 'Thumbnail file size in bytes',
                  },
                  width: {
                    type: 'number',
                    description: 'Thumbnail width in pixels',
                  },
                  height: {
                    type: 'number',
                    description: 'Thumbnail height in pixels',
                  },
                },
              },
              thumb: {
                type: 'object',
                description: 'Secondary thumbnail details (duplicate of thumbnail)',
                properties: {
                  file_id: { type: 'string', description: 'Thumbnail file ID' },
                  file_unique_id: {
                    type: 'string',
                    description: 'Unique thumbnail file identifier',
                  },
                  file_size: {
                    type: 'number',
                    description: 'Thumbnail file size in bytes',
                  },
                  width: {
                    type: 'number',
                    description: 'Thumbnail width in pixels',
                  },
                  height: {
                    type: 'number',
                    description: 'Thumbnail height in pixels',
                  },
                },
              },
              file_id: { type: 'string', description: 'Media file ID' },
              file_unique_id: {
                type: 'string',
                description: 'Unique media file identifier',
              },
              file_size: {
                type: 'number',
                description: 'Size of media file in bytes',
              },
            },
          },
          document: {
            type: 'object',
            description: 'Document file details if the message contains a document',
            properties: {
              file_name: { type: 'string', description: 'Document file name' },
              mime_type: { type: 'string', description: 'Document MIME type' },
              thumbnail: {
                type: 'object',
                description: 'Document thumbnail information',
                properties: {
                  file_id: { type: 'string', description: 'Thumbnail file ID' },
                  file_unique_id: {
                    type: 'string',
                    description: 'Unique thumbnail file identifier',
                  },
                  file_size: {
                    type: 'number',
                    description: 'Thumbnail file size in bytes',
                  },
                  width: {
                    type: 'number',
                    description: 'Thumbnail width in pixels',
                  },
                  height: {
                    type: 'number',
                    description: 'Thumbnail height in pixels',
                  },
                },
              },
              thumb: {
                type: 'object',
                description: 'Duplicate thumbnail info (used for compatibility)',
                properties: {
                  file_id: { type: 'string', description: 'Thumbnail file ID' },
                  file_unique_id: {
                    type: 'string',
                    description: 'Unique thumbnail file identifier',
                  },
                  file_size: {
                    type: 'number',
                    description: 'Thumbnail file size in bytes',
                  },
                  width: {
                    type: 'number',
                    description: 'Thumbnail width in pixels',
                  },
                  height: {
                    type: 'number',
                    description: 'Thumbnail height in pixels',
                  },
                },
              },
              file_id: { type: 'string', description: 'Document file ID' },
              file_unique_id: {
                type: 'string',
                description: 'Unique document file identifier',
              },
              file_size: {
                type: 'number',
                description: 'Size of document file in bytes',
              },
            },
          },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

````
