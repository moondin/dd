---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 769
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 769 of 933)

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

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/telegram/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface TelegramMessage {
  message_id: number
  from: {
    id: number
    is_bot: boolean
    first_name?: string
    username?: string
  }
  chat?: {
    id: number
    first_name?: string
    username?: string
    type?: string
  }
  date: number
  text?: string
}

export interface TelegramAudio extends TelegramMessage {
  voice: {
    duration: 2
    mime_type: string
    file_id: string
    file_unique_id: string
    file_size: number
  }
}

export interface TelegramPhoto extends TelegramMessage {
  photo?: {
    file_id: string
    file_unique_id: string
    file_size: number
    width: number
    height: number
  }
}

export interface TelegramMedia extends TelegramMessage {
  format?: {
    file_name: string
    mime_type: string
    duration: number
    width: number
    height: number
    thumbnail: {
      file_id: string
      file_unique_id: string
      file_size: number
      width: number
      height: number
    }
    thumb: {
      file_id: string
      file_unique_id: string
      file_size: number
      width: number
      height: number
    }
    file_id: string
    file_unique_id: string
    file_size: number
  }
  document?: {
    file_name: string
    mime_type: string
    thumbnail: {
      file_id: string
      file_unique_id: string
      file_size: number
      width: number
      height: number
    }
    thumb: {
      file_id: string
      file_unique_id: string
      file_size: number
      width: number
      height: number
    }
    file_id: string
    file_unique_id: string
    file_size: number
  }
}

export interface TelegramAuthParams {
  botToken: string
  chatId: string
}

export interface TelegramSendMessageParams extends TelegramAuthParams {
  text: string
}

export interface TelegramSendPhotoParams extends TelegramAuthParams {
  photo: string
  caption?: string
}

export interface TelegramSendVideoParams extends TelegramAuthParams {
  video: string
  caption?: string
}

export interface TelegramSendAudioParams extends TelegramAuthParams {
  audio: string
  caption?: string
}

export interface TelegramSendAnimationParams extends TelegramAuthParams {
  animation: string
  caption?: string
}

export interface TelegramSendDocumentParams extends TelegramAuthParams {
  files?: any
  caption?: string
}

export interface TelegramDeleteMessageParams extends TelegramAuthParams {
  messageId: number
}

export interface TelegramSendMessageResponse extends ToolResponse {
  output: {
    message: string
    data?: TelegramMessage
  }
}

export interface TelegramSendMediaResponse extends ToolResponse {
  output: {
    message: string
    data?: TelegramMedia
  }
}

export interface TelegramSendAudioResponse extends ToolResponse {
  output: {
    message: string
    data?: TelegramAudio
  }
}

export interface TelegramDeleteMessageResponse extends ToolResponse {
  output: {
    message: string
    data?: {
      ok: boolean
      deleted: boolean
    }
  }
}

export interface TelegramSendPhotoResponse extends ToolResponse {
  output: {
    message: string
    data?: TelegramPhoto
  }
}

export interface TelegramSendDocumentResponse extends ToolResponse {
  output: {
    message: string
    data?: TelegramMedia
  }
}

export type TelegramResponse =
  | TelegramSendMessageResponse
  | TelegramSendPhotoResponse
  | TelegramSendAudioResponse
  | TelegramSendMediaResponse
  | TelegramSendDocumentResponse
  | TelegramDeleteMessageResponse

// Legacy type for backwards compatibility
export interface TelegramMessageParams {
  botToken: string
  chatId: string
  text: string
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/telegram/utils.ts

```typescript
export function convertMarkdownToHTML(text: string): string {
  return (
    text
      // Bold: **text** or __text__ -> <b>text</b>
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/__(.*?)__/g, '<b>$1</b>')
      // Italic: *text* or _text_ -> <i>text</i>
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/_(.*?)_/g, '<i>$1</i>')
      // Code: `text` -> <code>text</code>
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Links: [text](url) -> <a href="url">text</a>
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/thinking/index.ts

```typescript
import { thinkingTool } from '@/tools/thinking/tool'

export { thinkingTool }
```

--------------------------------------------------------------------------------

---[FILE: tool.ts]---
Location: sim-main/apps/sim/tools/thinking/tool.ts

```typescript
import type { ThinkingToolParams, ThinkingToolResponse } from '@/tools/thinking/types'
import type { ToolConfig } from '@/tools/types'

export const thinkingTool: ToolConfig<ThinkingToolParams, ThinkingToolResponse> = {
  id: 'thinking_tool',
  name: 'Thinking Tool',
  description:
    'Processes a provided thought/instruction, making it available for subsequent steps.',
  version: '1.0.0',

  params: {
    thought: {
      type: 'string',
      required: true,
      visibility: 'llm-only',
      description:
        'Your internal reasoning, analysis, or thought process. Use this to think through the problem step by step before responding.',
    },
  },

  request: {
    url: '/api/tools/thinking',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: ThinkingToolParams) => ({
      thought: params.thought,
    }),
  },

  transformResponse: async (response: Response): Promise<ThinkingToolResponse> => {
    const data = await response.json()
    return data
  },

  outputs: {
    acknowledgedThought: {
      type: 'string',
      description: 'The thought that was processed and acknowledged',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/thinking/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface ThinkingToolParams {
  thought: string
}

export interface ThinkingToolResponse extends ToolResponse {
  output: {
    acknowledgedThought: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: add_comment.ts]---
Location: sim-main/apps/sim/tools/trello/add_comment.ts

```typescript
import { env } from '@/lib/core/config/env'
import type { TrelloAddCommentParams, TrelloAddCommentResponse } from '@/tools/trello/types'
import type { ToolConfig } from '@/tools/types'

export const trelloAddCommentTool: ToolConfig<TrelloAddCommentParams, TrelloAddCommentResponse> = {
  id: 'trello_add_comment',
  name: 'Trello Add Comment',
  description: 'Add a comment to a Trello card',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'trello',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Trello OAuth access token',
    },
    cardId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the card to comment on',
    },
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comment text',
    },
  },

  request: {
    url: (params) => {
      if (!params.cardId) {
        throw new Error('Card ID is required')
      }
      const apiKey = env.TRELLO_API_KEY || ''
      const token = params.accessToken
      return `https://api.trello.com/1/cards/${params.cardId}/actions/comments?key=${apiKey}&token=${token}`
    },
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: (params) => {
      if (!params.text) {
        throw new Error('Comment text is required')
      }

      return {
        text: params.text,
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data?.id) {
      return {
        success: false,
        output: {
          error: data?.message || 'Failed to add comment',
        },
        error: data?.message || 'Failed to add comment',
      }
    }

    return {
      success: true,
      output: {
        comment: {
          id: data.id,
          text: data.data?.text,
          date: data.date,
          memberCreator: data.memberCreator,
        },
      },
    }
  },

  outputs: {
    comment: {
      type: 'object',
      description: 'The created comment object with id, text, date, and member creator',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_card.ts]---
Location: sim-main/apps/sim/tools/trello/create_card.ts

```typescript
import { env } from '@/lib/core/config/env'
import type { TrelloCreateCardParams, TrelloCreateCardResponse } from '@/tools/trello/types'
import type { ToolConfig } from '@/tools/types'

export const trelloCreateCardTool: ToolConfig<TrelloCreateCardParams, TrelloCreateCardResponse> = {
  id: 'trello_create_card',
  name: 'Trello Create Card',
  description: 'Create a new card on a Trello board',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'trello',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Trello OAuth access token',
    },
    boardId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the board to create the card on',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the list to create the card in',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name/title of the card',
    },
    desc: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Description of the card',
    },
    pos: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Position of the card (top, bottom, or positive float)',
    },
    due: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Due date (ISO 8601 format)',
    },
    labels: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of label IDs',
    },
  },

  request: {
    url: (params) => {
      const apiKey = env.TRELLO_API_KEY || ''
      const token = params.accessToken
      return `https://api.trello.com/1/cards?key=${apiKey}&token=${token}`
    },
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: (params) => {
      if (!params.name) {
        throw new Error('Card name is required')
      }
      if (!params.listId) {
        throw new Error('List ID is required')
      }

      const body: Record<string, any> = {
        idList: params.listId,
        name: params.name,
      }

      if (params.desc) body.desc = params.desc
      if (params.pos) body.pos = params.pos
      if (params.due) body.due = params.due
      if (params.labels) body.idLabels = params.labels

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data?.id) {
      return {
        success: false,
        output: {
          error: data?.message || 'Failed to create card',
        },
        error: data?.message || 'Failed to create card',
      }
    }

    return {
      success: true,
      output: {
        card: data,
      },
    }
  },

  outputs: {
    card: {
      type: 'object',
      description: 'The created card object with id, name, desc, url, and other properties',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_actions.ts]---
Location: sim-main/apps/sim/tools/trello/get_actions.ts

```typescript
import { env } from '@/lib/core/config/env'
import type { TrelloGetActionsParams, TrelloGetActionsResponse } from '@/tools/trello/types'
import type { ToolConfig } from '@/tools/types'

export const trelloGetActionsTool: ToolConfig<TrelloGetActionsParams, TrelloGetActionsResponse> = {
  id: 'trello_get_actions',
  name: 'Trello Get Actions',
  description: 'Get activity/actions from a board or card',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'trello',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Trello OAuth access token',
    },
    boardId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'ID of the board to get actions from (either boardId or cardId required)',
    },
    cardId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'ID of the card to get actions from (either boardId or cardId required)',
    },
    filter: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter actions by type (e.g., "commentCard,updateCard,createCard" or "all")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of actions to return (default: 50, max: 1000)',
    },
  },

  request: {
    url: (params) => {
      if (!params.boardId && !params.cardId) {
        throw new Error('Either boardId or cardId is required')
      }
      if (params.boardId && params.cardId) {
        throw new Error('Provide either boardId or cardId, not both')
      }

      const id = params.boardId || params.cardId
      const type = params.boardId ? 'boards' : 'cards'
      const apiKey = env.TRELLO_API_KEY || ''
      const token = params.accessToken

      let url = `https://api.trello.com/1/${type}/${id}/actions?key=${apiKey}&token=${token}&fields=id,type,date,memberCreator,data`

      if (params.filter) {
        url += `&filter=${params.filter}`
      }

      const limit = params.limit || 50
      url += `&limit=${limit}`

      return url
    },
    method: 'GET',
    headers: () => ({
      Accept: 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!Array.isArray(data)) {
      return {
        success: false,
        output: {
          actions: [],
          count: 0,
          error: 'Invalid response from Trello API',
        },
        error: 'Invalid response from Trello API',
      }
    }

    return {
      success: true,
      output: {
        actions: data,
        count: data.length,
      },
    }
  },

  outputs: {
    actions: {
      type: 'array',
      description: 'Array of action objects with type, date, member, and data',
    },
    count: { type: 'number', description: 'Number of actions returned' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/trello/index.ts

```typescript
import { trelloAddCommentTool } from '@/tools/trello/add_comment'
import { trelloCreateCardTool } from '@/tools/trello/create_card'
import { trelloGetActionsTool } from '@/tools/trello/get_actions'
import { trelloListCardsTool } from '@/tools/trello/list_cards'
import { trelloListListsTool } from '@/tools/trello/list_lists'
import { trelloUpdateCardTool } from '@/tools/trello/update_card'

export {
  trelloListListsTool,
  trelloListCardsTool,
  trelloCreateCardTool,
  trelloUpdateCardTool,
  trelloGetActionsTool,
  trelloAddCommentTool,
}
```

--------------------------------------------------------------------------------

---[FILE: list_cards.ts]---
Location: sim-main/apps/sim/tools/trello/list_cards.ts

```typescript
import { env } from '@/lib/core/config/env'
import type { TrelloListCardsParams, TrelloListCardsResponse } from '@/tools/trello/types'
import type { ToolConfig } from '@/tools/types'

export const trelloListCardsTool: ToolConfig<TrelloListCardsParams, TrelloListCardsResponse> = {
  id: 'trello_list_cards',
  name: 'Trello List Cards',
  description: 'List all cards on a Trello board',
  version: '1.0.0',
  oauth: {
    required: true,
    provider: 'trello',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Trello OAuth access token',
    },
    boardId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the board to list cards from',
    },
    listId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional: Filter cards by list ID',
    },
  },

  request: {
    url: (params) => {
      if (!params.boardId) {
        throw new Error('Board ID is required')
      }
      const apiKey = env.TRELLO_API_KEY || ''
      const token = params.accessToken
      let url = `https://api.trello.com/1/boards/${params.boardId}/cards?key=${apiKey}&token=${token}&fields=id,name,desc,url,idBoard,idList,closed,labels,due,dueComplete`
      if (params.listId) {
        url += `&list=${params.listId}`
      }
      return url
    },
    method: 'GET',
    headers: () => ({
      Accept: 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!Array.isArray(data)) {
      return {
        success: false,
        output: {
          cards: [],
          count: 0,
          error: 'Invalid response from Trello API',
        },
        error: 'Invalid response from Trello API',
      }
    }

    return {
      success: true,
      output: {
        cards: data,
        count: data.length,
      },
    }
  },

  outputs: {
    cards: {
      type: 'array',
      description:
        'Array of card objects with id, name, desc, url, board/list IDs, labels, and due date',
    },
    count: { type: 'number', description: 'Number of cards returned' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_lists.ts]---
Location: sim-main/apps/sim/tools/trello/list_lists.ts

```typescript
import { env } from '@/lib/core/config/env'
import type { TrelloListListsParams, TrelloListListsResponse } from '@/tools/trello/types'
import type { ToolConfig } from '@/tools/types'

export const trelloListListsTool: ToolConfig<TrelloListListsParams, TrelloListListsResponse> = {
  id: 'trello_list_lists',
  name: 'Trello List Lists',
  description: 'List all lists on a Trello board',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'trello',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Trello OAuth access token',
    },
    boardId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the board to list lists from',
    },
  },

  request: {
    url: (params) => {
      if (!params.boardId) {
        throw new Error('Board ID is required')
      }
      const apiKey = env.TRELLO_API_KEY || ''
      const token = params.accessToken

      if (!apiKey) {
        throw new Error('TRELLO_API_KEY environment variable is not set')
      }

      if (!token) {
        throw new Error('Trello access token is missing')
      }

      return `https://api.trello.com/1/boards/${params.boardId}/lists?key=${apiKey}&token=${token}`
    },
    method: 'GET',
    headers: () => ({
      Accept: 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!Array.isArray(data)) {
      return {
        success: false,
        output: {
          lists: [],
          count: 0,
          error: data?.message || data?.error || 'Invalid response from Trello API',
        },
        error: data?.message || data?.error || 'Invalid response from Trello API',
      }
    }

    return {
      success: true,
      output: {
        lists: data,
        count: data.length,
      },
    }
  },

  outputs: {
    lists: {
      type: 'array',
      description: 'Array of list objects with id, name, closed, pos, and idBoard',
    },
    count: { type: 'number', description: 'Number of lists returned' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/trello/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface TrelloBoard {
  id: string
  name: string
  desc: string
  url: string
  closed: boolean
}

export interface TrelloList {
  id: string
  name: string
  closed: boolean
  pos: number
  idBoard: string
}

export interface TrelloCard {
  id: string
  name: string
  desc: string
  url: string
  idBoard: string
  idList: string
  closed: boolean
  labels: Array<{
    id: string
    name: string
    color: string
  }>
  due?: string
  dueComplete?: boolean
}

export interface TrelloAction {
  id: string
  type: string
  date: string
  memberCreator: {
    id: string
    fullName: string
    username: string
  }
  data: Record<string, any>
}

export interface TrelloComment {
  id: string
  text: string
  date: string
  memberCreator: {
    id: string
    fullName: string
    username: string
  }
}

export interface TrelloListListsParams {
  accessToken: string
  boardId: string
}

export interface TrelloListCardsParams {
  accessToken: string
  boardId: string
  listId?: string
}

export interface TrelloCreateCardParams {
  accessToken: string
  boardId: string
  listId: string
  name: string
  desc?: string
  pos?: string
  due?: string
  labels?: string
}

export interface TrelloUpdateCardParams {
  accessToken: string
  cardId: string
  name?: string
  desc?: string
  closed?: boolean
  idList?: string
  due?: string
  dueComplete?: boolean
}

export interface TrelloGetActionsParams {
  accessToken: string
  boardId?: string
  cardId?: string
  filter?: string
  limit?: number
}

export interface TrelloAddCommentParams {
  accessToken: string
  cardId: string
  text: string
}

export interface TrelloListListsResponse extends ToolResponse {
  output: {
    lists: TrelloList[]
    count: number
    error?: string
  }
}

export interface TrelloListCardsResponse extends ToolResponse {
  output: {
    cards: TrelloCard[]
    count: number
    error?: string
  }
}

export interface TrelloCreateCardResponse extends ToolResponse {
  output: {
    card?: TrelloCard
    error?: string
  }
}

export interface TrelloUpdateCardResponse extends ToolResponse {
  output: {
    card?: TrelloCard
    error?: string
  }
}

export interface TrelloGetActionsResponse extends ToolResponse {
  output: {
    actions: TrelloAction[]
    count: number
    error?: string
  }
}

export interface TrelloAddCommentResponse extends ToolResponse {
  output: {
    comment?: TrelloComment
    error?: string
  }
}

export type TrelloResponse =
  | TrelloListListsResponse
  | TrelloListCardsResponse
  | TrelloCreateCardResponse
  | TrelloUpdateCardResponse
  | TrelloGetActionsResponse
  | TrelloAddCommentResponse
```

--------------------------------------------------------------------------------

---[FILE: update_card.ts]---
Location: sim-main/apps/sim/tools/trello/update_card.ts

```typescript
import { env } from '@/lib/core/config/env'
import type { TrelloUpdateCardParams, TrelloUpdateCardResponse } from '@/tools/trello/types'
import type { ToolConfig } from '@/tools/types'

export const trelloUpdateCardTool: ToolConfig<TrelloUpdateCardParams, TrelloUpdateCardResponse> = {
  id: 'trello_update_card',
  name: 'Trello Update Card',
  description: 'Update an existing card on Trello',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'trello',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Trello OAuth access token',
    },
    cardId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the card to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New name/title of the card',
    },
    desc: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New description of the card',
    },
    closed: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Archive/close the card (true) or reopen it (false)',
    },
    idList: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Move card to a different list',
    },
    due: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Due date (ISO 8601 format)',
    },
    dueComplete: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Mark the due date as complete',
    },
  },

  request: {
    url: (params) => {
      if (!params.cardId) {
        throw new Error('Card ID is required')
      }
      const apiKey = env.TRELLO_API_KEY || ''
      const token = params.accessToken
      return `https://api.trello.com/1/cards/${params.cardId}?key=${apiKey}&token=${token}`
    },
    method: 'PUT',
    headers: () => ({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.name !== undefined) body.name = params.name
      if (params.desc !== undefined) body.desc = params.desc
      if (params.closed !== undefined) body.closed = params.closed
      if (params.idList !== undefined) body.idList = params.idList
      if (params.due !== undefined) body.due = params.due
      if (params.dueComplete !== undefined) body.dueComplete = params.dueComplete

      if (Object.keys(body).length === 0) {
        throw new Error('At least one field must be provided to update')
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data?.id) {
      return {
        success: false,
        output: {
          error: data?.message || 'Failed to update card',
        },
        error: data?.message || 'Failed to update card',
      }
    }

    return {
      success: true,
      output: {
        card: data,
      },
    }
  },

  outputs: {
    card: {
      type: 'object',
      description: 'The updated card object with id, name, desc, url, and other properties',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: azure.ts]---
Location: sim-main/apps/sim/tools/tts/azure.ts

```typescript
import type { AzureTtsParams, TtsBlockResponse } from '@/tools/tts/types'
import type { ToolConfig } from '@/tools/types'

export const azureTtsTool: ToolConfig<AzureTtsParams, TtsBlockResponse> = {
  id: 'tts_azure',
  name: 'Azure TTS',
  description: 'Convert text to speech using Azure Cognitive Services',
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
      description: 'Azure Speech Services API key',
    },
    voiceId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Voice ID (e.g., en-US-JennyNeural, en-US-GuyNeural)',
    },
    region: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Azure region (e.g., eastus, westus, westeurope)',
    },
    outputFormat: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Output audio format',
    },
    rate: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Speaking rate (e.g., +10%, -20%, 1.5)',
    },
    pitch: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Voice pitch (e.g., +5Hz, -2st, low)',
    },
    style: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Speaking style (e.g., cheerful, sad, angry - neural voices only)',
    },
    styleDegree: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Style intensity (0.01 to 2.0)',
    },
    role: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Role (e.g., Girl, Boy, YoungAdultFemale)',
    },
  },

  request: {
    url: '/api/proxy/tts/unified',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: AzureTtsParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'azure',
      text: params.text,
      apiKey: params.apiKey,
      voiceId: params.voiceId || 'en-US-JennyNeural',
      region: params.region || 'eastus',
      outputFormat: params.outputFormat || 'audio-24khz-96kbitrate-mono-mp3',
      rate: params.rate,
      pitch: params.pitch,
      style: params.style,
      styleDegree: params.styleDegree,
      role: params.role,
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

---[FILE: cartesia.ts]---
Location: sim-main/apps/sim/tools/tts/cartesia.ts

```typescript
import type { CartesiaTtsParams, TtsBlockResponse } from '@/tools/tts/types'
import type { ToolConfig } from '@/tools/types'

export const cartesiaTtsTool: ToolConfig<CartesiaTtsParams, TtsBlockResponse> = {
  id: 'tts_cartesia',
  name: 'Cartesia TTS',
  description: 'Convert text to speech using Cartesia Sonic (ultra-low latency)',
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
      description: 'Cartesia API key',
    },
    modelId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Model ID (sonic-english, sonic-multilingual)',
    },
    voice: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Voice ID or embedding',
    },
    language: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Language code (en, es, fr, de, it, pt, etc.)',
    },
    outputFormat: {
      type: 'json',
      required: false,
      visibility: 'user-only',
      description: 'Output format configuration (container, encoding, sampleRate)',
    },
    speed: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Speed multiplier',
    },
    emotion: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: "Emotion tags for Sonic-3 (e.g., ['positivity:high'])",
    },
  },

  request: {
    url: '/api/proxy/tts/unified',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: CartesiaTtsParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'cartesia',
      text: params.text,
      apiKey: params.apiKey,
      modelId: params.modelId || 'sonic-3',
      voice: params.voice,
      language: params.language || 'en',
      outputFormat: params.outputFormat || {
        container: 'mp3',
        encoding: 'pcm_f32le',
        sampleRate: 44100,
      },
      speed: params.speed,
      emotion: params.emotion,
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

---[FILE: deepgram.ts]---
Location: sim-main/apps/sim/tools/tts/deepgram.ts

```typescript
import type { DeepgramTtsParams, TtsBlockResponse } from '@/tools/tts/types'
import type { ToolConfig } from '@/tools/types'

export const deepgramTtsTool: ToolConfig<DeepgramTtsParams, TtsBlockResponse> = {
  id: 'tts_deepgram',
  name: 'Deepgram TTS',
  description: 'Convert text to speech using Deepgram Aura',
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
      description: 'Deepgram API key',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Deepgram model/voice (e.g., aura-asteria-en, aura-luna-en)',
    },
    voice: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Voice identifier (alternative to model param)',
    },
    encoding: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Audio encoding (linear16, mp3, opus, aac, flac)',
    },
    sampleRate: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Sample rate (8000, 16000, 24000, 48000)',
    },
    bitRate: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Bit rate for compressed formats',
    },
    container: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Container format (none, wav, ogg)',
    },
  },

  request: {
    url: '/api/proxy/tts/unified',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: DeepgramTtsParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'deepgram',
      text: params.text,
      apiKey: params.apiKey,
      model: params.model || params.voice || 'aura-asteria-en',
      encoding: params.encoding || 'mp3',
      sampleRate: params.sampleRate,
      bitRate: params.bitRate,
      container: params.container || 'none',
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

````
