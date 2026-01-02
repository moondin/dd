---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 546
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 546 of 933)

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

---[FILE: api.ts]---
Location: sim-main/apps/sim/lib/copilot/api.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CopilotAPI')

/**
 * Citation interface for documentation references
 */
export interface Citation {
  id: number
  title: string
  url: string
  similarity?: number
}

/**
 * Message interface for copilot conversations
 */
export interface CopilotMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  citations?: Citation[]
}

/**
 * Chat config stored in database
 */
export interface CopilotChatConfig {
  mode?: 'ask' | 'build' | 'plan'
  model?: string
}

/**
 * Chat interface for copilot conversations
 */
export interface CopilotChat {
  id: string
  title: string | null
  model: string
  messages: CopilotMessage[]
  messageCount: number
  previewYaml: string | null
  planArtifact: string | null
  config: CopilotChatConfig | null
  createdAt: Date
  updatedAt: Date
}

/**
 * File attachment interface for message requests
 */
export interface MessageFileAttachment {
  id: string
  key: string
  filename: string
  media_type: string
  size: number
}

/**
 * Request interface for sending messages
 */
export interface SendMessageRequest {
  message: string
  userMessageId?: string // ID from frontend for the user message
  chatId?: string
  workflowId?: string
  mode?: 'ask' | 'agent' | 'plan'
  model?:
    | 'gpt-5-fast'
    | 'gpt-5'
    | 'gpt-5-medium'
    | 'gpt-5-high'
    | 'gpt-5.1-fast'
    | 'gpt-5.1'
    | 'gpt-5.1-medium'
    | 'gpt-5.1-high'
    | 'gpt-5-codex'
    | 'gpt-5.1-codex'
    | 'gpt-4o'
    | 'gpt-4.1'
    | 'o3'
    | 'claude-4-sonnet'
    | 'claude-4.5-haiku'
    | 'claude-4.5-sonnet'
    | 'claude-4.5-opus'
    | 'claude-4.1-opus'
    | 'gemini-3-pro'
  prefetch?: boolean
  createNewChat?: boolean
  stream?: boolean
  implicitFeedback?: string
  fileAttachments?: MessageFileAttachment[]
  abortSignal?: AbortSignal
  contexts?: Array<{
    kind: string
    label?: string
    chatId?: string
    workflowId?: string
    executionId?: string
  }>
}

/**
 * Base API response interface
 */
export interface ApiResponse {
  success: boolean
  error?: string
  status?: number
}

/**
 * Streaming response interface
 */
export interface StreamingResponse extends ApiResponse {
  stream?: ReadableStream
}

/**
 * Handle API errors and return user-friendly error messages
 */
async function handleApiError(response: Response, defaultMessage: string): Promise<string> {
  try {
    const data = await response.json()
    return (data && (data.error || data.message)) || defaultMessage
  } catch {
    return `${defaultMessage} (${response.status})`
  }
}

/**
 * Send a streaming message to the copilot chat API
 * This is the main API endpoint that handles all chat operations
 */
export async function sendStreamingMessage(
  request: SendMessageRequest
): Promise<StreamingResponse> {
  try {
    const { abortSignal, ...requestBody } = request
    try {
      const preview = Array.isArray((requestBody as any).contexts)
        ? (requestBody as any).contexts.map((c: any) => ({
            kind: c?.kind,
            chatId: c?.chatId,
            workflowId: c?.workflowId,
            label: c?.label,
          }))
        : undefined
      logger.info('Preparing to send streaming message', {
        hasContexts: Array.isArray((requestBody as any).contexts),
        contextsCount: Array.isArray((requestBody as any).contexts)
          ? (requestBody as any).contexts.length
          : 0,
        contextsPreview: preview,
      })
    } catch {}
    const response = await fetch('/api/copilot/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...requestBody, stream: true }),
      signal: abortSignal,
      credentials: 'include', // Include cookies for session authentication
    })

    if (!response.ok) {
      const errorMessage = await handleApiError(response, 'Failed to send streaming message')
      return {
        success: false,
        error: errorMessage,
        status: response.status,
      }
    }

    if (!response.body) {
      return {
        success: false,
        error: 'No response body received',
        status: 500,
      }
    }

    return {
      success: true,
      stream: response.body,
    }
  } catch (error) {
    // Handle AbortError gracefully - this is expected when user aborts
    if (error instanceof Error && error.name === 'AbortError') {
      logger.info('Streaming message was aborted by user')
      return {
        success: false,
        error: 'Request was aborted',
      }
    }

    logger.error('Failed to send streaming message:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: chat-title.ts]---
Location: sim-main/apps/sim/lib/copilot/chat-title.ts

```typescript
import OpenAI, { AzureOpenAI } from 'openai'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SimAgentUtils')

const azureApiKey = env.AZURE_OPENAI_API_KEY
const azureEndpoint = env.AZURE_OPENAI_ENDPOINT
const azureApiVersion = env.AZURE_OPENAI_API_VERSION
const chatTitleModelName = env.WAND_OPENAI_MODEL_NAME || 'gpt-4o'
const openaiApiKey = env.OPENAI_API_KEY

const useChatTitleAzure = azureApiKey && azureEndpoint && azureApiVersion

const client = useChatTitleAzure
  ? new AzureOpenAI({
      apiKey: azureApiKey,
      apiVersion: azureApiVersion,
      endpoint: azureEndpoint,
    })
  : openaiApiKey
    ? new OpenAI({
        apiKey: openaiApiKey,
      })
    : null

/**
 * Generates a short title for a chat based on the first message
 * @param message First user message in the chat
 * @returns A short title or null if API key is not available
 */
export async function generateChatTitle(message: string): Promise<string | null> {
  if (!client) {
    return null
  }

  try {
    const response = await client.chat.completions.create({
      model: useChatTitleAzure ? chatTitleModelName : 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Generate a very short title (3-5 words max) for a chat that starts with this message. The title should be concise and descriptive. Do not wrap the title in quotes.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 20,
      temperature: 0.2,
    })

    const title = response.choices[0]?.message?.content?.trim() || null
    return title
  } catch (error) {
    logger.error('Error generating chat title:', error)
    return null
  }
}
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: sim-main/apps/sim/lib/copilot/client.ts

```typescript
import { env } from '@/lib/core/config/env'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { SIM_AGENT_API_URL_DEFAULT } from './constants'

const logger = createLogger('SimAgentClient')

export interface SimAgentRequest {
  workflowId: string
  userId?: string
  data?: Record<string, any>
}

export interface SimAgentResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  status?: number
}

class SimAgentClient {
  private baseUrl: string

  constructor() {
    // Move environment variable access inside the constructor
    this.baseUrl = env.SIM_AGENT_API_URL || SIM_AGENT_API_URL_DEFAULT
  }

  /**
   * Make a request to the sim-agent service
   */
  async makeRequest<T = any>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
      body?: Record<string, any>
      headers?: Record<string, string>
      apiKey?: string // Allow passing API key directly
    } = {}
  ): Promise<SimAgentResponse<T>> {
    const requestId = generateRequestId()
    const { method = 'POST', body, headers = {} } = options

    try {
      const url = `${this.baseUrl}${endpoint}`

      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
      }

      logger.info(`[${requestId}] Making request to sim-agent`, {
        url,
        method,
        hasBody: !!body,
      })

      const fetchOptions: RequestInit = {
        method,
        headers: requestHeaders,
      }

      if (body && (method === 'POST' || method === 'PUT')) {
        fetchOptions.body = JSON.stringify(body)
      }

      const response = await fetch(url, fetchOptions)
      const responseStatus = response.status

      let responseData
      try {
        const responseText = await response.text()
        responseData = responseText ? JSON.parse(responseText) : null
      } catch (parseError) {
        logger.error(`[${requestId}] Failed to parse response`, parseError)
        return {
          success: false,
          error: `Failed to parse response: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`,
          status: responseStatus,
        }
      }

      logger.info(`[${requestId}] Response received`, {
        status: responseStatus,
        success: response.ok,
        hasData: !!responseData,
      })

      return {
        success: response.ok,
        data: responseData,
        error: response.ok ? undefined : responseData?.error || `HTTP ${responseStatus}`,
        status: responseStatus,
      }
    } catch (fetchError) {
      logger.error(`[${requestId}] Request failed`, fetchError)
      return {
        success: false,
        error: `Connection failed: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`,
        status: 0,
      }
    }
  }

  /**
   * Generic method for custom API calls
   */
  async call<T = any>(
    endpoint: string,
    request: SimAgentRequest,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'
  ): Promise<SimAgentResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method,
      body: {
        workflowId: request.workflowId,
        userId: request.userId,
        ...request.data,
      },
    })
  }

  /**
   * Get the current configuration
   */
  getConfig() {
    return {
      baseUrl: this.baseUrl,
      environment: process.env.NODE_ENV,
    }
  }

  /**
   * Check if the sim-agent service is healthy
   */
  async healthCheck() {
    try {
      const response = await this.makeRequest('/health', { method: 'GET' })
      return response.success && response.data?.healthy === true
    } catch (error) {
      logger.error('Sim-agent health check failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const simAgentClient = new SimAgentClient()

// Export types and class for advanced usage
export { SimAgentClient }
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: sim-main/apps/sim/lib/copilot/config.ts

```typescript
import { AGENT_MODE_SYSTEM_PROMPT } from '@/lib/copilot/prompts'
import { createLogger } from '@/lib/logs/console/logger'
import { getProviderDefaultModel } from '@/providers/models'
import type { ProviderId } from '@/providers/types'

const logger = createLogger('CopilotConfig')

/**
 * Valid provider IDs for validation
 */
const VALID_PROVIDER_IDS: readonly ProviderId[] = [
  'openai',
  'azure-openai',
  'anthropic',
  'google',
  'deepseek',
  'xai',
  'cerebras',
  'mistral',
  'groq',
  'ollama',
] as const

/**
 * Configuration validation constraints
 */
const VALIDATION_CONSTRAINTS = {
  temperature: { min: 0, max: 2 },
  maxTokens: { min: 1, max: 100000 },
  maxSources: { min: 1, max: 20 },
  similarityThreshold: { min: 0, max: 1 },
  maxConversationHistory: { min: 1, max: 50 },
} as const

/**
 * Copilot model types
 */
export type CopilotModelType = 'chat' | 'rag' | 'title'

/**
 * Configuration validation result
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Copilot configuration interface
 */
export interface CopilotConfig {
  // Chat LLM configuration
  chat: {
    defaultProvider: ProviderId
    defaultModel: string
    temperature: number
    maxTokens: number
    systemPrompt: string
  }
  // RAG (documentation search) LLM configuration
  rag: {
    defaultProvider: ProviderId
    defaultModel: string
    temperature: number
    maxTokens: number
    embeddingModel: string
    maxSources: number
    similarityThreshold: number
  }
  // General configuration
  general: {
    streamingEnabled: boolean
    maxConversationHistory: number
    titleGenerationModel: string
  }
}

function validateProviderId(value: string | undefined): ProviderId | null {
  if (!value) return null
  return VALID_PROVIDER_IDS.includes(value as ProviderId) ? (value as ProviderId) : null
}

function parseFloatEnv(value: string | undefined, name: string): number | null {
  if (!value) return null
  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed)) {
    logger.warn(`Invalid ${name}: ${value}. Expected a valid number.`)
    return null
  }
  return parsed
}

function parseIntEnv(value: string | undefined, name: string): number | null {
  if (!value) return null
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) {
    logger.warn(`Invalid ${name}: ${value}. Expected a valid integer.`)
    return null
  }
  return parsed
}

function parseBooleanEnv(value: string | undefined): boolean | null {
  if (!value) return null
  return value.toLowerCase() === 'true'
}

export const DEFAULT_COPILOT_CONFIG: CopilotConfig = {
  chat: {
    defaultProvider: 'anthropic',
    defaultModel: 'claude-3-7-sonnet-latest',
    temperature: 0.1,
    maxTokens: 8192,
    systemPrompt: AGENT_MODE_SYSTEM_PROMPT,
  },
  rag: {
    defaultProvider: 'anthropic',
    defaultModel: 'claude-3-7-sonnet-latest',
    temperature: 0.1,
    maxTokens: 2000,
    embeddingModel: 'text-embedding-3-small',
    maxSources: 10,
    similarityThreshold: 0.3,
  },
  general: {
    streamingEnabled: true,
    maxConversationHistory: 10,
    titleGenerationModel: 'claude-3-haiku-20240307',
  },
}

function applyEnvironmentOverrides(config: CopilotConfig): void {
  const chatProvider = validateProviderId(process.env.COPILOT_CHAT_PROVIDER)
  if (chatProvider) {
    config.chat.defaultProvider = chatProvider
  } else if (process.env.COPILOT_CHAT_PROVIDER) {
    logger.warn(
      `Invalid COPILOT_CHAT_PROVIDER: ${process.env.COPILOT_CHAT_PROVIDER}. Valid providers: ${VALID_PROVIDER_IDS.join(', ')}`
    )
  }

  if (process.env.COPILOT_CHAT_MODEL) {
    config.chat.defaultModel = process.env.COPILOT_CHAT_MODEL
  }

  const chatTemperature = parseFloatEnv(
    process.env.COPILOT_CHAT_TEMPERATURE,
    'COPILOT_CHAT_TEMPERATURE'
  )
  if (chatTemperature !== null) {
    config.chat.temperature = chatTemperature
  }

  const chatMaxTokens = parseIntEnv(process.env.COPILOT_CHAT_MAX_TOKENS, 'COPILOT_CHAT_MAX_TOKENS')
  if (chatMaxTokens !== null) {
    config.chat.maxTokens = chatMaxTokens
  }

  const ragProvider = validateProviderId(process.env.COPILOT_RAG_PROVIDER)
  if (ragProvider) {
    config.rag.defaultProvider = ragProvider
  } else if (process.env.COPILOT_RAG_PROVIDER) {
    logger.warn(
      `Invalid COPILOT_RAG_PROVIDER: ${process.env.COPILOT_RAG_PROVIDER}. Valid providers: ${VALID_PROVIDER_IDS.join(', ')}`
    )
  }

  if (process.env.COPILOT_RAG_MODEL) {
    config.rag.defaultModel = process.env.COPILOT_RAG_MODEL
  }

  const ragTemperature = parseFloatEnv(
    process.env.COPILOT_RAG_TEMPERATURE,
    'COPILOT_RAG_TEMPERATURE'
  )
  if (ragTemperature !== null) {
    config.rag.temperature = ragTemperature
  }

  const ragMaxTokens = parseIntEnv(process.env.COPILOT_RAG_MAX_TOKENS, 'COPILOT_RAG_MAX_TOKENS')
  if (ragMaxTokens !== null) {
    config.rag.maxTokens = ragMaxTokens
  }

  const ragMaxSources = parseIntEnv(process.env.COPILOT_RAG_MAX_SOURCES, 'COPILOT_RAG_MAX_SOURCES')
  if (ragMaxSources !== null) {
    config.rag.maxSources = ragMaxSources
  }

  const ragSimilarityThreshold = parseFloatEnv(
    process.env.COPILOT_RAG_SIMILARITY_THRESHOLD,
    'COPILOT_RAG_SIMILARITY_THRESHOLD'
  )
  if (ragSimilarityThreshold !== null) {
    config.rag.similarityThreshold = ragSimilarityThreshold
  }

  const streamingEnabled = parseBooleanEnv(process.env.COPILOT_STREAMING_ENABLED)
  if (streamingEnabled !== null) {
    config.general.streamingEnabled = streamingEnabled
  }

  const maxConversationHistory = parseIntEnv(
    process.env.COPILOT_MAX_CONVERSATION_HISTORY,
    'COPILOT_MAX_CONVERSATION_HISTORY'
  )
  if (maxConversationHistory !== null) {
    config.general.maxConversationHistory = maxConversationHistory
  }

  if (process.env.COPILOT_TITLE_GENERATION_MODEL) {
    config.general.titleGenerationModel = process.env.COPILOT_TITLE_GENERATION_MODEL
  }
}

export function getCopilotConfig(): CopilotConfig {
  const config = structuredClone(DEFAULT_COPILOT_CONFIG)

  try {
    applyEnvironmentOverrides(config)
  } catch (error) {
    logger.warn('Error applying environment variable overrides, using defaults', { error })
  }

  return config
}

export function getCopilotModel(type: CopilotModelType): {
  provider: ProviderId
  model: string
} {
  const config = getCopilotConfig()

  switch (type) {
    case 'chat':
      return {
        provider: config.chat.defaultProvider,
        model: config.chat.defaultModel,
      }
    case 'rag':
      return {
        provider: config.rag.defaultProvider,
        model: config.rag.defaultModel,
      }
    case 'title':
      return {
        provider: config.chat.defaultProvider,
        model: config.general.titleGenerationModel,
      }
    default:
      throw new Error(`Unknown copilot model type: ${type}`)
  }
}

function validateNumericValue(
  value: number,
  constraint: { min: number; max: number },
  name: string
): string | null {
  if (value < constraint.min || value > constraint.max) {
    return `${name} must be between ${constraint.min} and ${constraint.max}`
  }
  return null
}

export function validateCopilotConfig(config: CopilotConfig): ValidationResult {
  const errors: string[] = []

  try {
    const chatDefaultModel = getProviderDefaultModel(config.chat.defaultProvider)
    if (!chatDefaultModel) {
      errors.push(`Chat provider '${config.chat.defaultProvider}' not found`)
    }
  } catch (error) {
    errors.push(`Invalid chat provider: ${config.chat.defaultProvider}`)
  }

  try {
    const ragDefaultModel = getProviderDefaultModel(config.rag.defaultProvider)
    if (!ragDefaultModel) {
      errors.push(`RAG provider '${config.rag.defaultProvider}' not found`)
    }
  } catch (error) {
    errors.push(`Invalid RAG provider: ${config.rag.defaultProvider}`)
  }

  const validationChecks = [
    {
      value: config.chat.temperature,
      constraint: VALIDATION_CONSTRAINTS.temperature,
      name: 'Chat temperature',
    },
    {
      value: config.rag.temperature,
      constraint: VALIDATION_CONSTRAINTS.temperature,
      name: 'RAG temperature',
    },
    {
      value: config.chat.maxTokens,
      constraint: VALIDATION_CONSTRAINTS.maxTokens,
      name: 'Chat maxTokens',
    },
    {
      value: config.rag.maxTokens,
      constraint: VALIDATION_CONSTRAINTS.maxTokens,
      name: 'RAG maxTokens',
    },
    {
      value: config.rag.maxSources,
      constraint: VALIDATION_CONSTRAINTS.maxSources,
      name: 'RAG maxSources',
    },
    {
      value: config.rag.similarityThreshold,
      constraint: VALIDATION_CONSTRAINTS.similarityThreshold,
      name: 'RAG similarityThreshold',
    },
    {
      value: config.general.maxConversationHistory,
      constraint: VALIDATION_CONSTRAINTS.maxConversationHistory,
      name: 'General maxConversationHistory',
    },
  ]

  for (const check of validationChecks) {
    const error = validateNumericValue(check.value, check.constraint, check.name)
    if (error) {
      errors.push(error)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/lib/copilot/constants.ts

```typescript
export const SIM_AGENT_API_URL_DEFAULT = 'https://copilot.sim.ai'
export const SIM_AGENT_VERSION = '1.0.3'
```

--------------------------------------------------------------------------------

---[FILE: process-contents.ts]---
Location: sim-main/apps/sim/lib/copilot/process-contents.ts

```typescript
import { db } from '@sim/db'
import { copilotChats, document, knowledgeBase, templates } from '@sim/db/schema'
import { and, eq, isNull } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { loadWorkflowFromNormalizedTables } from '@/lib/workflows/persistence/utils'
import { sanitizeForCopilot } from '@/lib/workflows/sanitization/json-sanitizer'
import type { ChatContext } from '@/stores/panel/copilot/types'

export type AgentContextType =
  | 'past_chat'
  | 'workflow'
  | 'current_workflow'
  | 'blocks'
  | 'logs'
  | 'knowledge'
  | 'templates'
  | 'workflow_block'
  | 'docs'

export interface AgentContext {
  type: AgentContextType
  tag: string
  content: string
}

const logger = createLogger('ProcessContents')

export async function processContexts(
  contexts: ChatContext[] | undefined
): Promise<AgentContext[]> {
  if (!Array.isArray(contexts) || contexts.length === 0) return []
  const tasks = contexts.map(async (ctx) => {
    try {
      if (ctx.kind === 'past_chat') {
        return await processPastChatViaApi(ctx.chatId, ctx.label ? `@${ctx.label}` : '@')
      }
      if ((ctx.kind === 'workflow' || ctx.kind === 'current_workflow') && ctx.workflowId) {
        return await processWorkflowFromDb(
          ctx.workflowId,
          ctx.label ? `@${ctx.label}` : '@',
          ctx.kind
        )
      }
      if (ctx.kind === 'knowledge' && (ctx as any).knowledgeId) {
        return await processKnowledgeFromDb(
          (ctx as any).knowledgeId,
          ctx.label ? `@${ctx.label}` : '@'
        )
      }
      if (ctx.kind === 'blocks' && (ctx as any).blockId) {
        return await processBlockMetadata((ctx as any).blockId, ctx.label ? `@${ctx.label}` : '@')
      }
      if (ctx.kind === 'templates' && (ctx as any).templateId) {
        return await processTemplateFromDb(
          (ctx as any).templateId,
          ctx.label ? `@${ctx.label}` : '@'
        )
      }
      if (ctx.kind === 'logs' && (ctx as any).executionId) {
        return await processExecutionLogFromDb(
          (ctx as any).executionId,
          ctx.label ? `@${ctx.label}` : '@'
        )
      }
      if (ctx.kind === 'workflow_block' && ctx.workflowId && (ctx as any).blockId) {
        return await processWorkflowBlockFromDb(ctx.workflowId, (ctx as any).blockId, ctx.label)
      }
      // Other kinds can be added here: workflow, blocks, logs, knowledge, templates, docs
      return null
    } catch (error) {
      logger.error('Failed processing context', { ctx, error })
      return null
    }
  })

  const results = await Promise.all(tasks)
  return results.filter((r): r is AgentContext => !!r) as AgentContext[]
}

// Server-side variant (recommended for use in API routes)
export async function processContextsServer(
  contexts: ChatContext[] | undefined,
  userId: string,
  userMessage?: string
): Promise<AgentContext[]> {
  if (!Array.isArray(contexts) || contexts.length === 0) return []
  const tasks = contexts.map(async (ctx) => {
    try {
      if (ctx.kind === 'past_chat' && ctx.chatId) {
        return await processPastChatFromDb(ctx.chatId, userId, ctx.label ? `@${ctx.label}` : '@')
      }
      if ((ctx.kind === 'workflow' || ctx.kind === 'current_workflow') && ctx.workflowId) {
        return await processWorkflowFromDb(
          ctx.workflowId,
          ctx.label ? `@${ctx.label}` : '@',
          ctx.kind
        )
      }
      if (ctx.kind === 'knowledge' && (ctx as any).knowledgeId) {
        return await processKnowledgeFromDb(
          (ctx as any).knowledgeId,
          ctx.label ? `@${ctx.label}` : '@'
        )
      }
      if (ctx.kind === 'blocks' && (ctx as any).blockId) {
        return await processBlockMetadata((ctx as any).blockId, ctx.label ? `@${ctx.label}` : '@')
      }
      if (ctx.kind === 'templates' && (ctx as any).templateId) {
        return await processTemplateFromDb(
          (ctx as any).templateId,
          ctx.label ? `@${ctx.label}` : '@'
        )
      }
      if (ctx.kind === 'logs' && (ctx as any).executionId) {
        return await processExecutionLogFromDb(
          (ctx as any).executionId,
          ctx.label ? `@${ctx.label}` : '@'
        )
      }
      if (ctx.kind === 'workflow_block' && ctx.workflowId && (ctx as any).blockId) {
        return await processWorkflowBlockFromDb(ctx.workflowId, (ctx as any).blockId, ctx.label)
      }
      if (ctx.kind === 'docs') {
        try {
          const { searchDocumentationServerTool } = await import(
            '@/lib/copilot/tools/server/docs/search-documentation'
          )
          const rawQuery = (userMessage || '').trim() || ctx.label || 'Sim documentation'
          const query = sanitizeMessageForDocs(rawQuery, contexts)
          const res = await searchDocumentationServerTool.execute({ query, topK: 10 })
          const content = JSON.stringify(res?.results || [])
          return { type: 'docs', tag: ctx.label ? `@${ctx.label}` : '@', content }
        } catch (e) {
          logger.error('Failed to process docs context', e)
          return null
        }
      }
      return null
    } catch (error) {
      logger.error('Failed processing context (server)', { ctx, error })
      return null
    }
  })
  const results = await Promise.all(tasks)
  const filtered = results.filter(
    (r): r is AgentContext => !!r && typeof r.content === 'string' && r.content.trim().length > 0
  )
  logger.info('Processed contexts (server)', {
    totalRequested: contexts.length,
    totalProcessed: filtered.length,
    kinds: Array.from(filtered.reduce((s, r) => s.add(r.type), new Set<string>())),
  })
  return filtered
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function sanitizeMessageForDocs(rawMessage: string, contexts: ChatContext[] | undefined): string {
  if (!rawMessage) return ''
  if (!Array.isArray(contexts) || contexts.length === 0) {
    // No context mapping; conservatively strip all @mentions-like tokens
    const stripped = rawMessage
      .replace(/(^|\s)@([^\s]+)/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
    return stripped
  }

  // Gather labels by kind
  const blockLabels = new Set(
    contexts
      .filter((c) => c.kind === 'blocks')
      .map((c) => c.label)
      .filter((l): l is string => typeof l === 'string' && l.length > 0)
  )
  const nonBlockLabels = new Set(
    contexts
      .filter((c) => c.kind !== 'blocks')
      .map((c) => c.label)
      .filter((l): l is string => typeof l === 'string' && l.length > 0)
  )

  let result = rawMessage

  // 1) Remove all non-block mentions entirely
  for (const label of nonBlockLabels) {
    const pattern = new RegExp(`(^|\\s)@${escapeRegExp(label)}(?!\\S)`, 'g')
    result = result.replace(pattern, ' ')
  }

  // 2) For block mentions, strip the '@' but keep the block name
  for (const label of blockLabels) {
    const pattern = new RegExp(`@${escapeRegExp(label)}(?!\\S)`, 'g')
    result = result.replace(pattern, label)
  }

  // 3) Remove any remaining @mentions (unknown or not in contexts)
  result = result.replace(/(^|\s)@([^\s]+)/g, ' ')

  // Normalize whitespace
  result = result.replace(/\s{2,}/g, ' ').trim()
  return result
}

async function processPastChatFromDb(
  chatId: string,
  userId: string,
  tag: string
): Promise<AgentContext | null> {
  try {
    const rows = await db
      .select({ messages: copilotChats.messages })
      .from(copilotChats)
      .where(and(eq(copilotChats.id, chatId), eq(copilotChats.userId, userId)))
      .limit(1)
    const messages = Array.isArray(rows?.[0]?.messages) ? (rows[0] as any).messages : []
    const content = messages
      .map((m: any) => {
        const role = m.role || 'user'
        let text = ''
        if (Array.isArray(m.contentBlocks) && m.contentBlocks.length > 0) {
          text = m.contentBlocks
            .filter((b: any) => b?.type === 'text')
            .map((b: any) => String(b.content || ''))
            .join('')
            .trim()
        }
        if (!text && typeof m.content === 'string') text = m.content
        return `${role}: ${text}`.trim()
      })
      .filter((s: string) => s.length > 0)
      .join('\n')
    logger.info('Processed past_chat context from DB', {
      chatId,
      length: content.length,
      lines: content ? content.split('\n').length : 0,
    })
    return { type: 'past_chat', tag, content }
  } catch (error) {
    logger.error('Error processing past chat from db', { chatId, error })
    return null
  }
}

async function processWorkflowFromDb(
  workflowId: string,
  tag: string,
  kind: 'workflow' | 'current_workflow' = 'workflow'
): Promise<AgentContext | null> {
  try {
    const normalized = await loadWorkflowFromNormalizedTables(workflowId)
    if (!normalized) {
      logger.warn('No normalized workflow data found', { workflowId })
      return null
    }
    const workflowState = {
      blocks: normalized.blocks || {},
      edges: normalized.edges || [],
      loops: normalized.loops || {},
      parallels: normalized.parallels || {},
    }
    // Sanitize workflow state for copilot (remove UI-specific data like positions)
    const sanitizedState = sanitizeForCopilot(workflowState)
    // Match get-user-workflow format: just the workflow state JSON
    const content = JSON.stringify(sanitizedState, null, 2)
    logger.info('Processed sanitized workflow context', {
      workflowId,
      blocks: Object.keys(sanitizedState.blocks || {}).length,
    })
    // Use the provided kind for the type
    return { type: kind, tag, content }
  } catch (error) {
    logger.error('Error processing workflow context', { workflowId, error })
    return null
  }
}

async function processPastChat(chatId: string, tagOverride?: string): Promise<AgentContext | null> {
  try {
    const resp = await fetch(`/api/copilot/chat/${encodeURIComponent(chatId)}`)
    if (!resp.ok) {
      logger.error('Failed to fetch past chat', { chatId, status: resp.status })
      return null
    }
    const data = await resp.json()
    const messages = Array.isArray(data?.chat?.messages) ? data.chat.messages : []
    const content = messages
      .map((m: any) => {
        const role = m.role || 'user'
        // Prefer contentBlocks text if present (joins text blocks), else use content
        let text = ''
        if (Array.isArray(m.contentBlocks) && m.contentBlocks.length > 0) {
          text = m.contentBlocks
            .filter((b: any) => b?.type === 'text')
            .map((b: any) => String(b.content || ''))
            .join('')
            .trim()
        }
        if (!text && typeof m.content === 'string') text = m.content
        return `${role}: ${text}`.trim()
      })
      .filter((s: string) => s.length > 0)
      .join('\n')
    logger.info('Processed past_chat context via API', { chatId, length: content.length })

    return { type: 'past_chat', tag: tagOverride || '@', content }
  } catch (error) {
    logger.error('Error processing past chat', { chatId, error })
    return null
  }
}

// Back-compat alias; used by processContexts above
async function processPastChatViaApi(chatId: string, tag?: string) {
  return processPastChat(chatId, tag)
}

async function processKnowledgeFromDb(
  knowledgeBaseId: string,
  tag: string
): Promise<AgentContext | null> {
  try {
    // Load KB metadata
    const kbRows = await db
      .select({
        id: knowledgeBase.id,
        name: knowledgeBase.name,
        updatedAt: knowledgeBase.updatedAt,
      })
      .from(knowledgeBase)
      .where(and(eq(knowledgeBase.id, knowledgeBaseId), isNull(knowledgeBase.deletedAt)))
      .limit(1)
    const kb = kbRows?.[0]
    if (!kb) return null

    // Load up to 20 recent doc filenames
    const docRows = await db
      .select({ filename: document.filename })
      .from(document)
      .where(and(eq(document.knowledgeBaseId, knowledgeBaseId), isNull(document.deletedAt)))
      .limit(20)

    const sampleDocuments = docRows.map((d: any) => d.filename).filter(Boolean)
    // We don't have total via this quick select; fallback to sample count
    const summary = {
      id: kb.id,
      name: kb.name,
      docCount: sampleDocuments.length,
      sampleDocuments,
    }
    const content = JSON.stringify(summary)
    return { type: 'knowledge', tag, content }
  } catch (error) {
    logger.error('Error processing knowledge context (db)', { knowledgeBaseId, error })
    return null
  }
}

async function processBlockMetadata(blockId: string, tag: string): Promise<AgentContext | null> {
  try {
    // Reuse registry to match get_blocks_metadata tool result
    const { registry: blockRegistry } = await import('@/blocks/registry')
    const { tools: toolsRegistry } = await import('@/tools/registry')
    const SPECIAL_BLOCKS_METADATA: Record<string, any> = {}

    let metadata: any = {}
    if ((SPECIAL_BLOCKS_METADATA as any)[blockId]) {
      metadata = { ...(SPECIAL_BLOCKS_METADATA as any)[blockId] }
      metadata.tools = metadata.tools?.access || []
    } else {
      const blockConfig: any = (blockRegistry as any)[blockId]
      if (!blockConfig) {
        return null
      }
      metadata = {
        id: blockId,
        name: blockConfig.name || blockId,
        description: blockConfig.description || '',
        longDescription: blockConfig.longDescription,
        category: blockConfig.category,
        bgColor: blockConfig.bgColor,
        inputs: blockConfig.inputs || {},
        outputs: blockConfig.outputs || {},
        tools: blockConfig.tools?.access || [],
        hideFromToolbar: blockConfig.hideFromToolbar,
      }
      if (blockConfig.subBlocks && Array.isArray(blockConfig.subBlocks)) {
        metadata.subBlocks = (blockConfig.subBlocks as any[]).map((sb: any) => ({
          id: sb.id,
          name: sb.name,
          type: sb.type,
          description: sb.description,
          default: sb.default,
          options: Array.isArray(sb.options) ? sb.options : [],
        }))
      } else {
        metadata.subBlocks = []
      }
    }

    if (Array.isArray(metadata.tools) && metadata.tools.length > 0) {
      metadata.toolDetails = {}
      for (const toolId of metadata.tools) {
        const tool = (toolsRegistry as any)[toolId]
        if (tool) {
          metadata.toolDetails[toolId] = { name: tool.name, description: tool.description }
        }
      }
    }

    const content = JSON.stringify({ metadata })
    return { type: 'blocks', tag, content }
  } catch (error) {
    logger.error('Error processing block metadata', { blockId, error })
    return null
  }
}

async function processTemplateFromDb(
  templateId: string,
  tag: string
): Promise<AgentContext | null> {
  try {
    const rows = await db
      .select({
        id: templates.id,
        name: templates.name,
        details: templates.details,
        stars: templates.stars,
        state: templates.state,
      })
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1)
    const t = rows?.[0]
    if (!t) return null
    const workflowState = t.state || {}
    const summary = {
      id: t.id,
      name: t.name,
      description: (t.details as any)?.tagline || '',
      stars: t.stars || 0,
      workflow: workflowState,
    }
    const content = JSON.stringify(summary)
    return { type: 'templates', tag, content }
  } catch (error) {
    logger.error('Error processing template context (db)', { templateId, error })
    return null
  }
}

async function processWorkflowBlockFromDb(
  workflowId: string,
  blockId: string,
  label?: string
): Promise<AgentContext | null> {
  try {
    const normalized = await loadWorkflowFromNormalizedTables(workflowId)
    if (!normalized) return null
    const block = (normalized.blocks as any)[blockId]
    if (!block) return null
    const tag = label ? `@${label} in Workflow` : `@${block.name || blockId} in Workflow`

    // Build content: isolate the block and include its subBlocks fully
    const contentObj = {
      workflowId,
      block: block,
    }
    const content = JSON.stringify(contentObj)
    return { type: 'workflow_block', tag, content }
  } catch (error) {
    logger.error('Error processing workflow_block context', { workflowId, blockId, error })
    return null
  }
}

async function processExecutionLogFromDb(
  executionId: string,
  tag: string
): Promise<AgentContext | null> {
  try {
    const { workflowExecutionLogs, workflow } = await import('@sim/db/schema')
    const { db } = await import('@sim/db')
    const rows = await db
      .select({
        id: workflowExecutionLogs.id,
        workflowId: workflowExecutionLogs.workflowId,
        executionId: workflowExecutionLogs.executionId,
        level: workflowExecutionLogs.level,
        trigger: workflowExecutionLogs.trigger,
        startedAt: workflowExecutionLogs.startedAt,
        endedAt: workflowExecutionLogs.endedAt,
        totalDurationMs: workflowExecutionLogs.totalDurationMs,
        executionData: workflowExecutionLogs.executionData,
        cost: workflowExecutionLogs.cost,
        workflowName: workflow.name,
      })
      .from(workflowExecutionLogs)
      .innerJoin(workflow, eq(workflowExecutionLogs.workflowId, workflow.id))
      .where(eq(workflowExecutionLogs.executionId, executionId))
      .limit(1)

    const log = rows?.[0] as any
    if (!log) return null

    const summary = {
      id: log.id,
      workflowId: log.workflowId,
      executionId: log.executionId,
      level: log.level,
      trigger: log.trigger,
      startedAt: log.startedAt?.toISOString?.() || String(log.startedAt),
      endedAt: log.endedAt?.toISOString?.() || (log.endedAt ? String(log.endedAt) : null),
      totalDurationMs: log.totalDurationMs ?? null,
      workflowName: log.workflowName || '',
      // Include trace spans and any available details without being huge
      executionData: log.executionData
        ? {
            traceSpans: (log.executionData as any).traceSpans || undefined,
            errorDetails: (log.executionData as any).errorDetails || undefined,
          }
        : undefined,
      cost: log.cost || undefined,
    }

    const content = JSON.stringify(summary)
    return { type: 'logs', tag, content }
  } catch (error) {
    logger.error('Error processing execution log context (db)', { executionId, error })
    return null
  }
}
```

--------------------------------------------------------------------------------

---[FILE: prompts.ts]---
Location: sim-main/apps/sim/lib/copilot/prompts.ts

```typescript
export const AGENT_MODE_SYSTEM_PROMPT = `You are a helpful AI assistant for Sim Studio, a powerful workflow automation platform.`

export const TITLE_GENERATION_SYSTEM_PROMPT =
  'Generate a concise, descriptive chat title based on the user message.'

export const TITLE_GENERATION_USER_PROMPT = (userMessage: string) =>
  `Create a short title for this: ${userMessage}`
```

--------------------------------------------------------------------------------

````
