---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 491
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 491 of 933)

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

---[FILE: tavily.ts]---
Location: sim-main/apps/sim/blocks/blocks/tavily.ts

```typescript
import { TavilyIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { TavilyResponse } from '@/tools/tavily/types'

export const TavilyBlock: BlockConfig<TavilyResponse> = {
  type: 'tavily',
  name: 'Tavily',
  description: 'Search and extract information',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Tavily into the workflow. Can search the web and extract content from specific URLs. Requires API Key.',
  category: 'tools',
  docsLink: 'https://docs.sim.ai/tools/tavily',
  bgColor: '#0066FF',
  icon: TavilyIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Search', id: 'tavily_search' },
        { label: 'Extract Content', id: 'tavily_extract' },
        { label: 'Crawl Website', id: 'tavily_crawl' },
        { label: 'Map Website', id: 'tavily_map' },
      ],
      value: () => 'tavily_search',
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'Enter your search query...',
      condition: { field: 'operation', value: 'tavily_search' },
      required: true,
    },
    {
      id: 'max_results',
      title: 'Max Results',
      type: 'short-input',
      placeholder: '5',
      condition: { field: 'operation', value: 'tavily_search' },
    },
    {
      id: 'topic',
      title: 'Topic',
      type: 'dropdown',
      options: [
        { label: 'General', id: 'general' },
        { label: 'News', id: 'news' },
        { label: 'Finance', id: 'finance' },
      ],
      value: () => 'general',
      condition: { field: 'operation', value: 'tavily_search' },
    },
    {
      id: 'search_depth',
      title: 'Search Depth',
      type: 'dropdown',
      options: [
        { label: 'Basic', id: 'basic' },
        { label: 'Advanced', id: 'advanced' },
      ],
      value: () => 'basic',
      condition: { field: 'operation', value: 'tavily_search' },
    },
    {
      id: 'include_answer',
      title: 'Include Answer',
      type: 'dropdown',
      options: [
        { label: 'None', id: '' },
        { label: 'Basic', id: 'basic' },
        { label: 'Advanced', id: 'advanced' },
      ],
      value: () => '',
      condition: { field: 'operation', value: 'tavily_search' },
    },
    {
      id: 'include_raw_content',
      title: 'Include Raw Content',
      type: 'dropdown',
      options: [
        { label: 'None', id: '' },
        { label: 'Markdown', id: 'markdown' },
        { label: 'Text', id: 'text' },
      ],
      value: () => '',
      condition: { field: 'operation', value: 'tavily_search' },
    },
    {
      id: 'include_images',
      title: 'Include Images',
      type: 'switch',
      condition: { field: 'operation', value: 'tavily_search' },
    },
    {
      id: 'include_image_descriptions',
      title: 'Include Image Descriptions',
      type: 'switch',
      condition: { field: 'operation', value: 'tavily_search' },
    },
    {
      id: 'include_favicon',
      title: 'Include Favicon',
      type: 'switch',
      condition: { field: 'operation', value: 'tavily_search' },
    },
    {
      id: 'time_range',
      title: 'Time Range',
      type: 'dropdown',
      options: [
        { label: 'All Time', id: '' },
        { label: 'Day', id: 'd' },
        { label: 'Week', id: 'w' },
        { label: 'Month', id: 'm' },
        { label: 'Year', id: 'y' },
      ],
      value: () => '',
      condition: { field: 'operation', value: 'tavily_search' },
    },
    {
      id: 'include_domains',
      title: 'Include Domains',
      type: 'long-input',
      placeholder: 'example.com, another.com (comma-separated)',
      condition: { field: 'operation', value: 'tavily_search' },
    },
    {
      id: 'exclude_domains',
      title: 'Exclude Domains',
      type: 'long-input',
      placeholder: 'example.com, another.com (comma-separated)',
      condition: { field: 'operation', value: 'tavily_search' },
    },
    {
      id: 'country',
      title: 'Country',
      type: 'short-input',
      placeholder: 'US',
      condition: { field: 'operation', value: 'tavily_search' },
    },
    {
      id: 'urls',
      title: 'URL',
      type: 'long-input',
      placeholder: 'Enter URL to extract content from...',
      condition: { field: 'operation', value: 'tavily_extract' },
      required: true,
    },
    {
      id: 'extract_depth',
      title: 'Extract Depth',
      type: 'dropdown',
      options: [
        { label: 'Basic', id: 'basic' },
        { label: 'Advanced', id: 'advanced' },
      ],
      value: () => 'basic',
      condition: { field: 'operation', value: 'tavily_extract' },
    },
    {
      id: 'format',
      title: 'Format',
      type: 'dropdown',
      options: [
        { label: 'Markdown', id: 'markdown' },
        { label: 'Text', id: 'text' },
      ],
      value: () => 'markdown',
      condition: { field: 'operation', value: 'tavily_extract' },
    },
    {
      id: 'include_images',
      title: 'Include Images',
      type: 'switch',
      condition: { field: 'operation', value: 'tavily_extract' },
    },
    {
      id: 'include_favicon',
      title: 'Include Favicon',
      type: 'switch',
      condition: { field: 'operation', value: 'tavily_extract' },
    },
    {
      id: 'url',
      title: 'Website URL',
      type: 'short-input',
      placeholder: 'https://example.com',
      condition: { field: 'operation', value: ['tavily_crawl', 'tavily_map'] },
      required: true,
    },
    {
      id: 'instructions',
      title: 'Instructions',
      type: 'long-input',
      placeholder: 'Natural language directions for the crawler...',
      condition: { field: 'operation', value: ['tavily_crawl', 'tavily_map'] },
    },
    {
      id: 'max_depth',
      title: 'Max Depth',
      type: 'short-input',
      placeholder: '1',
      condition: { field: 'operation', value: ['tavily_crawl', 'tavily_map'] },
    },
    {
      id: 'max_breadth',
      title: 'Max Breadth',
      type: 'short-input',
      placeholder: '20',
      condition: { field: 'operation', value: ['tavily_crawl', 'tavily_map'] },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '50',
      condition: { field: 'operation', value: ['tavily_crawl', 'tavily_map'] },
    },
    {
      id: 'select_paths',
      title: 'Select Paths',
      type: 'long-input',
      placeholder: '/docs/.*, /api/.* (regex patterns, comma-separated)',
      condition: { field: 'operation', value: ['tavily_crawl', 'tavily_map'] },
    },
    {
      id: 'select_domains',
      title: 'Select Domains',
      type: 'long-input',
      placeholder: '^docs\\.example\\.com$ (regex patterns, comma-separated)',
      condition: { field: 'operation', value: ['tavily_crawl', 'tavily_map'] },
    },
    {
      id: 'exclude_paths',
      title: 'Exclude Paths',
      type: 'long-input',
      placeholder: '/private/.*, /admin/.* (regex patterns, comma-separated)',
      condition: { field: 'operation', value: ['tavily_crawl', 'tavily_map'] },
    },
    {
      id: 'exclude_domains',
      title: 'Exclude Domains',
      type: 'long-input',
      placeholder: '^private\\.example\\.com$ (regex patterns, comma-separated)',
      condition: { field: 'operation', value: ['tavily_crawl', 'tavily_map'] },
    },
    {
      id: 'allow_external',
      title: 'Allow External Links',
      type: 'switch',
      condition: { field: 'operation', value: ['tavily_crawl', 'tavily_map'] },
    },
    {
      id: 'include_images',
      title: 'Include Images',
      type: 'switch',
      condition: { field: 'operation', value: 'tavily_crawl' },
    },
    {
      id: 'extract_depth',
      title: 'Extract Depth',
      type: 'dropdown',
      options: [
        { label: 'Basic', id: 'basic' },
        { label: 'Advanced', id: 'advanced' },
      ],
      value: () => 'basic',
      condition: { field: 'operation', value: 'tavily_crawl' },
    },
    {
      id: 'format',
      title: 'Format',
      type: 'dropdown',
      options: [
        { label: 'Markdown', id: 'markdown' },
        { label: 'Text', id: 'text' },
      ],
      value: () => 'markdown',
      condition: { field: 'operation', value: 'tavily_crawl' },
    },
    {
      id: 'include_favicon',
      title: 'Include Favicon',
      type: 'switch',
      condition: { field: 'operation', value: 'tavily_crawl' },
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your Tavily API key',
      password: true,
      required: true,
    },
  ],
  tools: {
    access: ['tavily_search', 'tavily_extract', 'tavily_crawl', 'tavily_map'],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'tavily_search':
            return 'tavily_search'
          case 'tavily_extract':
            return 'tavily_extract'
          case 'tavily_crawl':
            return 'tavily_crawl'
          case 'tavily_map':
            return 'tavily_map'
          default:
            return 'tavily_search'
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'Tavily API key' },
    // Search params
    query: { type: 'string', description: 'Search query terms' },
    max_results: { type: 'number', description: 'Maximum search results' },
    topic: { type: 'string', description: 'Search topic category' },
    search_depth: { type: 'string', description: 'Search depth level' },
    include_answer: { type: 'string', description: 'Include LLM-generated answer' },
    include_raw_content: { type: 'string', description: 'Include raw content format' },
    include_images: { type: 'boolean', description: 'Include images in results' },
    include_image_descriptions: { type: 'boolean', description: 'Include image descriptions' },
    include_favicon: { type: 'boolean', description: 'Include favicon URLs' },
    time_range: { type: 'string', description: 'Time range filter' },
    include_domains: { type: 'string', description: 'Domains to include' },
    exclude_domains: { type: 'string', description: 'Domains to exclude' },
    country: { type: 'string', description: 'Country filter' },
    // Extract params
    urls: { type: 'string', description: 'URL to extract' },
    extract_depth: { type: 'string', description: 'Extraction depth level' },
    format: { type: 'string', description: 'Output format' },
    // Crawl/Map params
    url: { type: 'string', description: 'Root URL for crawl/map' },
    instructions: { type: 'string', description: 'Natural language instructions' },
    max_depth: { type: 'number', description: 'Maximum crawl depth' },
    max_breadth: { type: 'number', description: 'Maximum breadth per level' },
    limit: { type: 'number', description: 'Total links limit' },
    select_paths: { type: 'string', description: 'Path patterns to include' },
    select_domains: { type: 'string', description: 'Domain patterns to include' },
    exclude_paths: { type: 'string', description: 'Path patterns to exclude' },
    allow_external: { type: 'boolean', description: 'Allow external links' },
  },
  outputs: {
    // Search outputs
    results: { type: 'json', description: 'Search/extract/crawl results data' },
    answer: { type: 'string', description: 'LLM-generated answer (search)' },
    query: { type: 'string', description: 'Search query used' },
    images: { type: 'array', description: 'Image URLs (search)' },
    auto_parameters: { type: 'json', description: 'Auto-selected parameters (search)' },
    // Extract outputs
    content: { type: 'string', description: 'Extracted content' },
    title: { type: 'string', description: 'Page title' },
    url: { type: 'string', description: 'Source URL' },
    failed_results: { type: 'array', description: 'Failed extraction URLs' },
    // Crawl/Map outputs
    base_url: { type: 'string', description: 'Base URL that was crawled/mapped' },
    response_time: { type: 'number', description: 'Request duration in seconds' },
    request_id: { type: 'string', description: 'Request identifier for support' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: telegram.ts]---
Location: sim-main/apps/sim/blocks/blocks/telegram.ts

```typescript
import { TelegramIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { TelegramResponse } from '@/tools/telegram/types'
import { getTrigger } from '@/triggers'

export const TelegramBlock: BlockConfig<TelegramResponse> = {
  type: 'telegram',
  name: 'Telegram',
  description: 'Interact with Telegram',
  authMode: AuthMode.BotToken,
  longDescription:
    'Integrate Telegram into the workflow. Can send and delete messages. Can be used in trigger mode to trigger a workflow when a message is sent to a chat.',
  docsLink: 'https://docs.sim.ai/tools/telegram',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: TelegramIcon,
  triggerAllowed: true,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Send Message', id: 'telegram_message' },
        { label: 'Send Photo', id: 'telegram_send_photo' },
        { label: 'Send Video', id: 'telegram_send_video' },
        { label: 'Send Audio', id: 'telegram_send_audio' },
        { label: 'Send Animation', id: 'telegram_send_animation' },
        { label: 'Send Document', id: 'telegram_send_document' },
        { label: 'Delete Message', id: 'telegram_delete_message' },
      ],
      value: () => 'telegram_message',
    },
    {
      id: 'botToken',
      title: 'Bot Token',
      type: 'short-input',
      placeholder: 'Enter your Telegram Bot Token',
      password: true,
      connectionDroppable: false,
      description: `Getting Bot Token:
1. If you haven't already, message "/newbot" to @BotFather
2. Choose a name for your bot
3. Copy the token it provides and paste it here`,
      required: true,
    },
    {
      id: 'chatId',
      title: 'Chat ID',
      type: 'short-input',
      placeholder: 'Enter Telegram Chat ID',
      description: `Getting Chat ID:
1. Add your bot as a member to desired Telegram channel
2. Send any message to the channel (e.g. "I love Sim")
3. Visit https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
4. Look for the chat field in the JSON response at the very bottom where you'll find the chat ID`,
      required: true,
    },
    {
      id: 'text',
      title: 'Message',
      type: 'long-input',
      placeholder: 'Enter the message to send',
      required: true,
      condition: { field: 'operation', value: 'telegram_message' },
    },
    {
      id: 'photo',
      title: 'Photo',
      type: 'short-input',
      placeholder: 'Enter photo URL or file_id',
      description: 'Photo to send. Pass a file_id or HTTP URL',
      required: true,
      condition: { field: 'operation', value: 'telegram_send_photo' },
    },
    {
      id: 'video',
      title: 'Video',
      type: 'short-input',
      placeholder: 'Enter video URL or file_id',
      description: 'Video to send. Pass a file_id or HTTP URL',
      required: true,
      condition: { field: 'operation', value: 'telegram_send_video' },
    },
    {
      id: 'audio',
      title: 'Audio',
      type: 'short-input',
      placeholder: 'Enter audio URL or file_id',
      description: 'Audio file to send. Pass a file_id or HTTP URL',
      required: true,
      condition: { field: 'operation', value: 'telegram_send_audio' },
    },
    {
      id: 'animation',
      title: 'Animation',
      type: 'short-input',
      placeholder: 'Enter animation URL or file_id',
      description: 'Animation (GIF) to send. Pass a file_id or HTTP URL',
      required: true,
      condition: { field: 'operation', value: 'telegram_send_animation' },
    },
    // File upload (basic mode) for Send Document
    {
      id: 'attachmentFiles',
      title: 'Document',
      type: 'file-upload',
      canonicalParamId: 'files',
      placeholder: 'Upload document file',
      condition: { field: 'operation', value: 'telegram_send_document' },
      mode: 'basic',
      multiple: false,
      required: false,
      description: 'Document file to send (PDF, ZIP, DOC, etc.). Max size: 50MB',
    },
    // Variable reference (advanced mode) for Send Document
    {
      id: 'files',
      title: 'Document',
      type: 'short-input',
      canonicalParamId: 'files',
      placeholder: 'Reference document from previous blocks',
      condition: { field: 'operation', value: 'telegram_send_document' },
      mode: 'advanced',
      required: false,
      description: 'Reference a document file from a previous block',
    },
    {
      id: 'caption',
      title: 'Caption',
      type: 'long-input',
      placeholder: 'Enter optional caption',
      description: 'Media caption (optional)',
      condition: {
        field: 'operation',
        value: [
          'telegram_send_photo',
          'telegram_send_video',
          'telegram_send_audio',
          'telegram_send_animation',
          'telegram_send_document',
        ],
      },
    },
    {
      id: 'messageId',
      title: 'Message ID',
      type: 'short-input',
      placeholder: 'Enter the message ID to delete',
      description: 'The unique identifier of the message you want to delete',
      required: true,
      condition: { field: 'operation', value: 'telegram_delete_message' },
    },
    ...getTrigger('telegram_webhook').subBlocks,
  ],
  tools: {
    access: [
      'telegram_message',
      'telegram_delete_message',
      'telegram_send_photo',
      'telegram_send_video',
      'telegram_send_audio',
      'telegram_send_animation',
      'telegram_send_document',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'telegram_message':
            return 'telegram_message'
          case 'telegram_delete_message':
            return 'telegram_delete_message'
          case 'telegram_send_photo':
            return 'telegram_send_photo'
          case 'telegram_send_video':
            return 'telegram_send_video'
          case 'telegram_send_audio':
            return 'telegram_send_audio'
          case 'telegram_send_animation':
            return 'telegram_send_animation'
          case 'telegram_send_document':
            return 'telegram_send_document'
          default:
            return 'telegram_message'
        }
      },
      params: (params) => {
        if (!params.botToken) throw new Error('Bot token required for this operation')

        const chatId = (params.chatId || '').trim()
        if (!chatId) {
          throw new Error('Chat ID is required.')
        }

        const commonParams = {
          botToken: params.botToken,
          chatId,
        }

        switch (params.operation) {
          case 'telegram_message':
            if (!params.text) {
              throw new Error('Message text is required.')
            }
            return {
              ...commonParams,
              text: params.text,
            }
          case 'telegram_delete_message':
            if (!params.messageId) {
              throw new Error('Message ID is required for delete operation.')
            }
            return {
              ...commonParams,
              messageId: params.messageId,
            }
          case 'telegram_send_photo':
            if (!params.photo) {
              throw new Error('Photo URL or file_id is required.')
            }
            return {
              ...commonParams,
              photo: params.photo,
              caption: params.caption,
            }
          case 'telegram_send_video':
            if (!params.video) {
              throw new Error('Video URL or file_id is required.')
            }
            return {
              ...commonParams,
              video: params.video,
              caption: params.caption,
            }
          case 'telegram_send_audio':
            if (!params.audio) {
              throw new Error('Audio URL or file_id is required.')
            }
            return {
              ...commonParams,
              audio: params.audio,
              caption: params.caption,
            }
          case 'telegram_send_animation':
            if (!params.animation) {
              throw new Error('Animation URL or file_id is required.')
            }
            return {
              ...commonParams,
              animation: params.animation,
              caption: params.caption,
            }
          case 'telegram_send_document': {
            // Handle file upload
            const fileParam = params.attachmentFiles || params.files
            return {
              ...commonParams,
              files: fileParam,
              caption: params.caption,
            }
          }
          default:
            return {
              ...commonParams,
              text: params.text,
            }
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    botToken: { type: 'string', description: 'Telegram bot token' },
    chatId: { type: 'string', description: 'Chat identifier' },
    text: { type: 'string', description: 'Message text' },
    photo: { type: 'string', description: 'Photo URL or file_id' },
    video: { type: 'string', description: 'Video URL or file_id' },
    audio: { type: 'string', description: 'Audio URL or file_id' },
    animation: { type: 'string', description: 'Animation URL or file_id' },
    attachmentFiles: {
      type: 'json',
      description: 'Files to attach (UI upload)',
    },
    files: { type: 'array', description: 'Files to attach (UserFile array)' },
    caption: { type: 'string', description: 'Caption for media' },
    messageId: { type: 'string', description: 'Message ID to delete' },
  },
  outputs: {
    // Send message operation outputs
    ok: { type: 'boolean', description: 'API response success status' },
    result: {
      type: 'json',
      description: 'Complete message result object from Telegram API',
    },
    message: { type: 'string', description: 'Success or error message' },
    data: { type: 'json', description: 'Response data' },
    // Specific result fields
    messageId: { type: 'number', description: 'Sent message ID' },
    chatId: { type: 'number', description: 'Chat ID where message was sent' },
    chatType: {
      type: 'string',
      description: 'Type of chat (private, group, supergroup, channel)',
    },
    username: { type: 'string', description: 'Chat username (if available)' },
    messageDate: {
      type: 'number',
      description: 'Unix timestamp of sent message',
    },
    messageText: {
      type: 'string',
      description: 'Text content of sent message',
    },
    // Delete message outputs
    deleted: {
      type: 'boolean',
      description: 'Whether the message was successfully deleted',
    },
    // Webhook trigger outputs (incoming messages)
    update_id: {
      type: 'number',
      description: 'Unique identifier for the update',
    },
    message_id: {
      type: 'number',
      description: 'Unique message identifier from webhook',
    },
    from_id: { type: 'number', description: 'User ID who sent the message' },
    from_username: { type: 'string', description: 'Username of the sender' },
    from_first_name: {
      type: 'string',
      description: 'First name of the sender',
    },
    from_last_name: { type: 'string', description: 'Last name of the sender' },
    chat_id: { type: 'number', description: 'Unique identifier for the chat' },
    chat_type: {
      type: 'string',
      description: 'Type of chat (private, group, supergroup, channel)',
    },
    chat_title: {
      type: 'string',
      description: 'Title of the chat (for groups and channels)',
    },
    text: { type: 'string', description: 'Message text content from webhook' },
    date: {
      type: 'number',
      description: 'Date the message was sent (Unix timestamp)',
    },
    entities: {
      type: 'json',
      description: 'Special entities in the message (mentions, hashtags, etc.)',
    },
  },
  triggers: {
    enabled: true,
    available: ['telegram_webhook'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: thinking.ts]---
Location: sim-main/apps/sim/blocks/blocks/thinking.ts

```typescript
import { BrainIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { ThinkingToolResponse } from '@/tools/thinking/types'

export const ThinkingBlock: BlockConfig<ThinkingToolResponse> = {
  type: 'thinking',
  name: 'Thinking',
  description: 'Forces model to outline its thought process.',
  longDescription:
    'Adds a step where the model explicitly outlines its thought process before proceeding. This can improve reasoning quality by encouraging step-by-step analysis.',
  docsLink: 'https://docs.sim.ai/tools/thinking',
  category: 'tools',
  bgColor: '#181C1E',
  icon: BrainIcon,
  hideFromToolbar: true,

  subBlocks: [
    {
      id: 'thought',
      title: 'Thought Process / Instruction',
      type: 'long-input',
      placeholder: 'Describe the step-by-step thinking process here...',
      hidden: true,
      required: true,
    },
  ],

  inputs: {
    thought: { type: 'string', description: 'Thinking process instructions' },
  },

  outputs: {
    acknowledgedThought: { type: 'string', description: 'Acknowledged thought process' },
  },

  tools: {
    access: ['thinking_tool'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: translate.ts]---
Location: sim-main/apps/sim/blocks/blocks/translate.ts

```typescript
import { TranslateIcon } from '@/components/icons'
import { isHosted } from '@/lib/core/config/feature-flags'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import { getHostedModels, getProviderIcon, providers } from '@/providers/utils'
import { useProvidersStore } from '@/stores/providers/store'

const getCurrentOllamaModels = () => {
  return useProvidersStore.getState().providers.ollama.models
}

const getTranslationPrompt = (targetLanguage: string) =>
  `Translate the following text into ${targetLanguage || 'English'}. Output ONLY the translated text with no additional commentary, explanations, or notes.`

export const TranslateBlock: BlockConfig = {
  type: 'translate',
  name: 'Translate',
  description: 'Translate text to any language',
  authMode: AuthMode.ApiKey,
  longDescription: 'Integrate Translate into the workflow. Can translate text to any language.',
  docsLink: 'https://docs.sim.ai/tools/translate',
  category: 'tools',
  bgColor: '#FF4B4B',
  icon: TranslateIcon,
  subBlocks: [
    {
      id: 'context',
      title: 'Text to Translate',
      type: 'long-input',
      placeholder: 'Enter the text you want to translate',
      required: true,
    },
    {
      id: 'targetLanguage',
      title: 'Translate To',
      type: 'short-input',
      placeholder: 'Enter language (e.g. Spanish, French, etc.)',
      required: true,
    },
    {
      id: 'model',
      title: 'Model',
      type: 'combobox',
      placeholder: 'Type or select a model...',
      required: true,
      options: () => {
        const providersState = useProvidersStore.getState()
        const baseModels = providersState.providers.base.models
        const ollamaModels = providersState.providers.ollama.models
        const openrouterModels = providersState.providers.openrouter.models
        const allModels = Array.from(new Set([...baseModels, ...ollamaModels, ...openrouterModels]))

        return allModels.map((model) => {
          const icon = getProviderIcon(model)
          return { label: model, id: model, ...(icon && { icon }) }
        })
      },
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your API key',
      password: true,
      connectionDroppable: false,
      required: true,
      // Hide API key for hosted models and Ollama models
      condition: isHosted
        ? {
            field: 'model',
            value: getHostedModels(),
            not: true, // Show for all models EXCEPT those listed
          }
        : () => ({
            field: 'model',
            value: getCurrentOllamaModels(),
            not: true, // Show for all models EXCEPT Ollama models
          }),
    },
    {
      id: 'azureEndpoint',
      title: 'Azure OpenAI Endpoint',
      type: 'short-input',
      password: true,
      placeholder: 'https://your-resource.openai.azure.com',
      connectionDroppable: false,
      condition: {
        field: 'model',
        value: providers['azure-openai'].models,
      },
    },
    {
      id: 'azureApiVersion',
      title: 'Azure API Version',
      type: 'short-input',
      placeholder: '2024-07-01-preview',
      connectionDroppable: false,
      condition: {
        field: 'model',
        value: providers['azure-openai'].models,
      },
    },
    {
      id: 'vertexProject',
      title: 'Vertex AI Project',
      type: 'short-input',
      placeholder: 'your-gcp-project-id',
      connectionDroppable: false,
      condition: {
        field: 'model',
        value: providers.vertex.models,
      },
    },
    {
      id: 'vertexLocation',
      title: 'Vertex AI Location',
      type: 'short-input',
      placeholder: 'us-central1',
      connectionDroppable: false,
      condition: {
        field: 'model',
        value: providers.vertex.models,
      },
    },
    {
      id: 'systemPrompt',
      title: 'System Prompt',
      type: 'code',
      hidden: true,
      value: (params: Record<string, any>) => {
        return getTranslationPrompt(params.targetLanguage || 'English')
      },
    },
  ],
  tools: {
    access: ['llm_chat'],
    config: {
      tool: () => 'llm_chat',
      params: (params: Record<string, any>) => ({
        model: params.model,
        systemPrompt: getTranslationPrompt(params.targetLanguage || 'English'),
        context: params.context,
        apiKey: params.apiKey,
        azureEndpoint: params.azureEndpoint,
        azureApiVersion: params.azureApiVersion,
        vertexProject: params.vertexProject,
        vertexLocation: params.vertexLocation,
      }),
    },
  },
  inputs: {
    context: { type: 'string', description: 'Text to translate' },
    targetLanguage: { type: 'string', description: 'Target language' },
    apiKey: { type: 'string', description: 'Provider API key' },
    azureEndpoint: { type: 'string', description: 'Azure OpenAI endpoint URL' },
    azureApiVersion: { type: 'string', description: 'Azure API version' },
    vertexProject: { type: 'string', description: 'Google Cloud project ID for Vertex AI' },
    vertexLocation: { type: 'string', description: 'Google Cloud location for Vertex AI' },
    systemPrompt: { type: 'string', description: 'Translation instructions' },
  },
  outputs: {
    content: { type: 'string', description: 'Translated text' },
    model: { type: 'string', description: 'Model used' },
    tokens: { type: 'json', description: 'Token usage' },
  },
}
```

--------------------------------------------------------------------------------

````
