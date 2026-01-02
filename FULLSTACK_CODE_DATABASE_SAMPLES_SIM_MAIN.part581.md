---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 581
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 581 of 933)

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

---[FILE: calculators.ts]---
Location: sim-main/apps/sim/lib/tokenization/calculators.ts

```typescript
/**
 * Cost calculation functions for tokenization
 */

import { createLogger } from '@/lib/logs/console/logger'
import { createTokenizationError } from '@/lib/tokenization/errors'
import {
  estimateInputTokens,
  estimateOutputTokens,
  estimateTokenCount,
} from '@/lib/tokenization/estimators'
import type {
  CostBreakdown,
  StreamingCostResult,
  TokenizationInput,
  TokenUsage,
} from '@/lib/tokenization/types'
import {
  getProviderForTokenization,
  logTokenizationDetails,
  validateTokenizationInput,
} from '@/lib/tokenization/utils'
import { calculateCost } from '@/providers/utils'

const logger = createLogger('TokenizationCalculators')

/**
 * Calculates cost estimate for streaming execution using token estimation
 */
export function calculateStreamingCost(
  model: string,
  inputText: string,
  outputText: string,
  systemPrompt?: string,
  context?: string,
  messages?: Array<{ role: string; content: string }>
): StreamingCostResult {
  try {
    // Validate inputs
    validateTokenizationInput(model, inputText, outputText)

    const providerId = getProviderForTokenization(model)

    // Estimate input tokens (combine all input sources)
    const inputEstimate = estimateInputTokens(systemPrompt, context, messages, providerId)

    // Add the main input text to the estimation
    const mainInputEstimate = estimateTokenCount(inputText, providerId)
    const totalPromptTokens = inputEstimate.count + mainInputEstimate.count

    // Estimate output tokens
    const outputEstimate = estimateOutputTokens(outputText, providerId)
    const completionTokens = outputEstimate.count

    // Calculate total tokens
    const totalTokens = totalPromptTokens + completionTokens

    // Create token usage object
    const tokens: TokenUsage = {
      prompt: totalPromptTokens,
      completion: completionTokens,
      total: totalTokens,
    }

    // Calculate cost using provider pricing
    const costResult = calculateCost(model, totalPromptTokens, completionTokens, false)

    const cost: CostBreakdown = {
      input: costResult.input,
      output: costResult.output,
      total: costResult.total,
    }

    const result: StreamingCostResult = {
      tokens,
      cost,
      model,
      provider: providerId,
      method: 'tokenization',
    }

    logTokenizationDetails('Streaming cost calculation completed', {
      model,
      provider: providerId,
      inputLength: inputText.length,
      outputLength: outputText.length,
      tokens,
      cost,
      method: 'tokenization',
    })

    return result
  } catch (error) {
    logger.error('Streaming cost calculation failed', {
      model,
      inputLength: inputText?.length || 0,
      outputLength: outputText?.length || 0,
      error: error instanceof Error ? error.message : String(error),
    })

    if (error instanceof Error && error.name === 'TokenizationError') {
      throw error
    }

    throw createTokenizationError(
      'CALCULATION_FAILED',
      `Failed to calculate streaming cost: ${error instanceof Error ? error.message : String(error)}`,
      { model, inputLength: inputText?.length || 0, outputLength: outputText?.length || 0 }
    )
  }
}

/**
 * Calculates cost for tokenization input object
 */
export function calculateTokenizationCost(input: TokenizationInput): StreamingCostResult {
  return calculateStreamingCost(
    input.model,
    input.inputText,
    input.outputText,
    input.systemPrompt,
    input.context,
    input.messages
  )
}

/**
 * Creates a streaming cost result from existing provider response data
 */
export function createCostResultFromProviderData(
  model: string,
  providerTokens: TokenUsage,
  providerCost: CostBreakdown
): StreamingCostResult {
  const providerId = getProviderForTokenization(model)

  return {
    tokens: providerTokens,
    cost: providerCost,
    model,
    provider: providerId,
    method: 'provider_response',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/lib/tokenization/constants.ts

```typescript
/**
 * Configuration constants for tokenization functionality
 */

import type { ProviderTokenizationConfig } from '@/lib/tokenization/types'

export const TOKENIZATION_CONFIG = {
  providers: {
    openai: {
      avgCharsPerToken: 4,
      confidence: 'high',
      supportedMethods: ['heuristic', 'fallback'],
    },
    'azure-openai': {
      avgCharsPerToken: 4,
      confidence: 'high',
      supportedMethods: ['heuristic', 'fallback'],
    },
    anthropic: {
      avgCharsPerToken: 4.5,
      confidence: 'high',
      supportedMethods: ['heuristic', 'fallback'],
    },
    google: {
      avgCharsPerToken: 5,
      confidence: 'medium',
      supportedMethods: ['heuristic', 'fallback'],
    },
    deepseek: {
      avgCharsPerToken: 4,
      confidence: 'medium',
      supportedMethods: ['heuristic', 'fallback'],
    },
    xai: {
      avgCharsPerToken: 4,
      confidence: 'medium',
      supportedMethods: ['heuristic', 'fallback'],
    },
    cerebras: {
      avgCharsPerToken: 4,
      confidence: 'medium',
      supportedMethods: ['heuristic', 'fallback'],
    },
    mistral: {
      avgCharsPerToken: 4,
      confidence: 'medium',
      supportedMethods: ['heuristic', 'fallback'],
    },
    groq: {
      avgCharsPerToken: 4,
      confidence: 'medium',
      supportedMethods: ['heuristic', 'fallback'],
    },
    ollama: {
      avgCharsPerToken: 4,
      confidence: 'low',
      supportedMethods: ['fallback'],
    },
  } satisfies Record<string, ProviderTokenizationConfig>,

  fallback: {
    avgCharsPerToken: 4,
    confidence: 'low',
    supportedMethods: ['fallback'],
  } satisfies ProviderTokenizationConfig,

  defaults: {
    model: 'gpt-4o',
    provider: 'openai',
  },
} as const

export const LLM_BLOCK_TYPES = ['agent', 'router', 'evaluator'] as const

export const MIN_TEXT_LENGTH_FOR_ESTIMATION = 1
export const MAX_PREVIEW_LENGTH = 100
```

--------------------------------------------------------------------------------

---[FILE: errors.ts]---
Location: sim-main/apps/sim/lib/tokenization/errors.ts

```typescript
/**
 * Custom error classes for tokenization functionality
 */

export class TokenizationError extends Error {
  public readonly code: 'INVALID_PROVIDER' | 'MISSING_TEXT' | 'CALCULATION_FAILED' | 'INVALID_MODEL'
  public readonly details?: Record<string, unknown>

  constructor(message: string, code: TokenizationError['code'], details?: Record<string, unknown>) {
    super(message)
    this.name = 'TokenizationError'
    this.code = code
    this.details = details
  }
}

export function createTokenizationError(
  code: TokenizationError['code'],
  message: string,
  details?: Record<string, unknown>
): TokenizationError {
  return new TokenizationError(message, code, details)
}
```

--------------------------------------------------------------------------------

---[FILE: estimators.ts]---
Location: sim-main/apps/sim/lib/tokenization/estimators.ts

```typescript
/**
 * Token estimation and accurate counting functions for different providers
 */

import { encodingForModel, type Tiktoken } from 'js-tiktoken'
import { createLogger } from '@/lib/logs/console/logger'
import { MIN_TEXT_LENGTH_FOR_ESTIMATION, TOKENIZATION_CONFIG } from '@/lib/tokenization/constants'
import type { TokenEstimate } from '@/lib/tokenization/types'
import { getProviderConfig } from '@/lib/tokenization/utils'

const logger = createLogger('TokenizationEstimators')

const encodingCache = new Map<string, Tiktoken>()

/**
 * Get or create a cached encoding for a model
 */
function getEncoding(modelName: string): Tiktoken {
  if (encodingCache.has(modelName)) {
    return encodingCache.get(modelName)!
  }

  try {
    const encoding = encodingForModel(modelName as Parameters<typeof encodingForModel>[0])
    encodingCache.set(modelName, encoding)
    return encoding
  } catch (error) {
    logger.warn(`Failed to get encoding for model ${modelName}, falling back to cl100k_base`)
    const encoding = encodingForModel('gpt-4')
    encodingCache.set(modelName, encoding)
    return encoding
  }
}

if (typeof process !== 'undefined') {
  process.on('beforeExit', () => {
    clearEncodingCache()
  })
}

/**
 * Get accurate token count for text using tiktoken
 * This is the exact count OpenAI's API will use
 */
export function getAccurateTokenCount(text: string, modelName = 'text-embedding-3-small'): number {
  if (!text || text.length === 0) {
    return 0
  }

  try {
    const encoding = getEncoding(modelName)
    const tokens = encoding.encode(text)
    return tokens.length
  } catch (error) {
    logger.error('Error counting tokens with tiktoken:', error)
    return Math.ceil(text.length / 4)
  }
}

/**
 * Truncate text to a maximum token count
 * Useful for handling texts that exceed model limits
 */
export function truncateToTokenLimit(
  text: string,
  maxTokens: number,
  modelName = 'text-embedding-3-small'
): string {
  if (!text || maxTokens <= 0) {
    return ''
  }

  try {
    const encoding = getEncoding(modelName)
    const tokens = encoding.encode(text)

    if (tokens.length <= maxTokens) {
      return text
    }

    const truncatedTokens = tokens.slice(0, maxTokens)
    const truncatedText = encoding.decode(truncatedTokens)

    logger.warn(
      `Truncated text from ${tokens.length} to ${maxTokens} tokens (${text.length} to ${truncatedText.length} chars)`
    )

    return truncatedText
  } catch (error) {
    logger.error('Error truncating text:', error)
    const maxChars = maxTokens * 4
    return text.slice(0, maxChars)
  }
}

/**
 * Get token count for multiple texts (for batching decisions)
 * Returns array of token counts in same order as input
 */
export function getTokenCountsForBatch(
  texts: string[],
  modelName = 'text-embedding-3-small'
): number[] {
  return texts.map((text) => getAccurateTokenCount(text, modelName))
}

/**
 * Calculate total tokens across multiple texts
 */
export function getTotalTokenCount(texts: string[], modelName = 'text-embedding-3-small'): number {
  return texts.reduce((total, text) => total + getAccurateTokenCount(text, modelName), 0)
}

/**
 * Batch texts by token count to stay within API limits
 * Returns array of batches where each batch's total tokens <= maxTokensPerBatch
 */
export function batchByTokenLimit(
  texts: string[],
  maxTokensPerBatch: number,
  modelName = 'text-embedding-3-small'
): string[][] {
  const batches: string[][] = []
  let currentBatch: string[] = []
  let currentTokenCount = 0

  for (const text of texts) {
    const tokenCount = getAccurateTokenCount(text, modelName)

    if (tokenCount > maxTokensPerBatch) {
      if (currentBatch.length > 0) {
        batches.push(currentBatch)
        currentBatch = []
        currentTokenCount = 0
      }

      const truncated = truncateToTokenLimit(text, maxTokensPerBatch, modelName)
      batches.push([truncated])
      continue
    }

    if (currentBatch.length > 0 && currentTokenCount + tokenCount > maxTokensPerBatch) {
      batches.push(currentBatch)
      currentBatch = [text]
      currentTokenCount = tokenCount
    } else {
      currentBatch.push(text)
      currentTokenCount += tokenCount
    }
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch)
  }

  return batches
}

/**
 * Clean up cached encodings (call when shutting down)
 */
export function clearEncodingCache(): void {
  encodingCache.clear()
  logger.info('Cleared tiktoken encoding cache')
}

/**
 * Estimates token count for text using provider-specific heuristics
 */
export function estimateTokenCount(text: string, providerId?: string): TokenEstimate {
  if (!text || text.length < MIN_TEXT_LENGTH_FOR_ESTIMATION) {
    return {
      count: 0,
      confidence: 'high',
      provider: providerId || 'unknown',
      method: 'fallback',
    }
  }

  const effectiveProviderId = providerId || TOKENIZATION_CONFIG.defaults.provider
  const config = getProviderConfig(effectiveProviderId)

  let estimatedTokens: number

  switch (effectiveProviderId) {
    case 'openai':
    case 'azure-openai':
      estimatedTokens = estimateOpenAITokens(text)
      break
    case 'anthropic':
      estimatedTokens = estimateAnthropicTokens(text)
      break
    case 'google':
      estimatedTokens = estimateGoogleTokens(text)
      break
    default:
      estimatedTokens = estimateGenericTokens(text, config.avgCharsPerToken)
  }

  return {
    count: Math.max(1, Math.round(estimatedTokens)),
    confidence: config.confidence,
    provider: effectiveProviderId,
    method: 'heuristic',
  }
}

/**
 * OpenAI-specific token estimation using BPE characteristics
 */
function estimateOpenAITokens(text: string): number {
  const words = text.trim().split(/\s+/)
  let tokenCount = 0

  for (const word of words) {
    if (word.length === 0) continue

    if (word.length <= 4) {
      tokenCount += 1
    } else if (word.length <= 8) {
      tokenCount += Math.ceil(word.length / 4.5)
    } else {
      tokenCount += Math.ceil(word.length / 4)
    }

    const punctuationCount = (word.match(/[.,!?;:"'()[\]{}<>]/g) || []).length
    tokenCount += punctuationCount * 0.5
  }

  const newlineCount = (text.match(/\n/g) || []).length
  tokenCount += newlineCount * 0.5

  return tokenCount
}

/**
 * Anthropic Claude-specific token estimation
 */
function estimateAnthropicTokens(text: string): number {
  const words = text.trim().split(/\s+/)
  let tokenCount = 0

  for (const word of words) {
    if (word.length === 0) continue

    if (word.length <= 4) {
      tokenCount += 1
    } else if (word.length <= 8) {
      tokenCount += Math.ceil(word.length / 5)
    } else {
      tokenCount += Math.ceil(word.length / 4.5)
    }
  }

  const newlineCount = (text.match(/\n/g) || []).length
  tokenCount += newlineCount * 0.3

  return tokenCount
}

/**
 * Google Gemini-specific token estimation
 */
function estimateGoogleTokens(text: string): number {
  const words = text.trim().split(/\s+/)
  let tokenCount = 0

  for (const word of words) {
    if (word.length === 0) continue

    if (word.length <= 5) {
      tokenCount += 1
    } else if (word.length <= 10) {
      tokenCount += Math.ceil(word.length / 6)
    } else {
      tokenCount += Math.ceil(word.length / 5)
    }
  }

  return tokenCount
}

/**
 * Generic token estimation fallback
 */
function estimateGenericTokens(text: string, avgCharsPerToken: number): number {
  const charCount = text.trim().length
  return Math.ceil(charCount / avgCharsPerToken)
}

/**
 * Estimates tokens for input content including context
 */
export function estimateInputTokens(
  systemPrompt?: string,
  context?: string,
  messages?: Array<{ role: string; content: string }>,
  providerId?: string
): TokenEstimate {
  let totalText = ''

  if (systemPrompt) {
    totalText += `${systemPrompt}\n`
  }

  if (context) {
    totalText += `${context}\n`
  }

  if (messages) {
    for (const message of messages) {
      totalText += `${message.role}: ${message.content}\n`
    }
  }

  return estimateTokenCount(totalText, providerId)
}

/**
 * Estimates tokens for output content
 */
export function estimateOutputTokens(content: string, providerId?: string): TokenEstimate {
  return estimateTokenCount(content, providerId)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/tokenization/index.ts

```typescript
export {
  calculateStreamingCost,
  calculateTokenizationCost,
  createCostResultFromProviderData,
} from '@/lib/tokenization/calculators'
export { LLM_BLOCK_TYPES, TOKENIZATION_CONFIG } from '@/lib/tokenization/constants'
export { createTokenizationError, TokenizationError } from '@/lib/tokenization/errors'
export {
  batchByTokenLimit,
  clearEncodingCache,
  estimateInputTokens,
  estimateOutputTokens,
  estimateTokenCount,
  getAccurateTokenCount,
  getTokenCountsForBatch,
  getTotalTokenCount,
  truncateToTokenLimit,
} from '@/lib/tokenization/estimators'
export { processStreamingBlockLog, processStreamingBlockLogs } from '@/lib/tokenization/streaming'
export type {
  CostBreakdown,
  ProviderTokenizationConfig,
  StreamingCostResult,
  TokenEstimate,
  TokenizationInput,
  TokenUsage,
} from '@/lib/tokenization/types'
export {
  createTextPreview,
  extractTextContent,
  formatTokenCount,
  getProviderConfig,
  getProviderForTokenization,
  hasRealCostData,
  hasRealTokenData,
  isTokenizableBlockType,
  logTokenizationDetails,
  validateTokenizationInput,
} from '@/lib/tokenization/utils'
```

--------------------------------------------------------------------------------

---[FILE: streaming.ts]---
Location: sim-main/apps/sim/lib/tokenization/streaming.ts

```typescript
/**
 * Streaming-specific tokenization helpers
 */

import { createLogger } from '@/lib/logs/console/logger'
import { calculateStreamingCost } from '@/lib/tokenization/calculators'
import { TOKENIZATION_CONFIG } from '@/lib/tokenization/constants'
import {
  extractTextContent,
  hasRealCostData,
  hasRealTokenData,
  isTokenizableBlockType,
  logTokenizationDetails,
} from '@/lib/tokenization/utils'
import type { BlockLog } from '@/executor/types'

const logger = createLogger('StreamingTokenization')

/**
 * Processes a block log and adds tokenization data if needed
 */
export function processStreamingBlockLog(log: BlockLog, streamedContent: string): boolean {
  // Check if this block should be tokenized
  if (!isTokenizableBlockType(log.blockType)) {
    return false
  }

  // Check if we already have meaningful token/cost data
  if (hasRealTokenData(log.output?.tokens) && hasRealCostData(log.output?.cost)) {
    return false
  }

  // Check if we have content to tokenize
  if (!streamedContent?.trim()) {
    return false
  }

  try {
    // Determine model to use
    const model = getModelForBlock(log)

    // Prepare input text from log
    const inputText = extractTextContent(log.input)

    // Calculate streaming cost
    const result = calculateStreamingCost(
      model,
      inputText,
      streamedContent,
      log.input?.systemPrompt,
      log.input?.context,
      log.input?.messages
    )

    // Update the log output with tokenization data
    if (!log.output) {
      log.output = {}
    }

    log.output.tokens = result.tokens
    log.output.cost = result.cost
    log.output.model = result.model

    logTokenizationDetails(`Streaming tokenization completed for ${log.blockType}`, {
      blockId: log.blockId,
      blockType: log.blockType,
      model: result.model,
      provider: result.provider,
      inputLength: inputText.length,
      outputLength: streamedContent.length,
      tokens: result.tokens,
      cost: result.cost,
      method: result.method,
    })

    return true
  } catch (error) {
    logger.error(`Streaming tokenization failed for block ${log.blockId}`, {
      blockType: log.blockType,
      error: error instanceof Error ? error.message : String(error),
      contentLength: streamedContent?.length || 0,
    })

    // Don't throw - graceful degradation
    return false
  }
}

/**
 * Determines the appropriate model for a block
 */
function getModelForBlock(log: BlockLog): string {
  // Try to get model from output first
  if (log.output?.model?.trim()) {
    return log.output.model
  }

  // Try to get model from input
  if (log.input?.model?.trim()) {
    return log.input.model
  }

  // Use block type specific defaults
  const blockType = log.blockType
  if (blockType === 'agent' || blockType === 'router' || blockType === 'evaluator') {
    return TOKENIZATION_CONFIG.defaults.model
  }

  // Final fallback
  return TOKENIZATION_CONFIG.defaults.model
}

/**
 * Processes multiple block logs for streaming tokenization
 */
export function processStreamingBlockLogs(
  logs: BlockLog[],
  streamedContentMap: Map<string, string>
): number {
  let processedCount = 0

  for (const log of logs) {
    const content = streamedContentMap.get(log.blockId)
    if (content && processStreamingBlockLog(log, content)) {
      processedCount++
    }
  }

  logger.info(`Streaming tokenization summary`, {
    totalLogs: logs.length,
    processedBlocks: processedCount,
    streamedBlocks: streamedContentMap.size,
  })

  return processedCount
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/tokenization/types.ts

```typescript
/**
 * Type definitions for tokenization functionality
 */

export interface TokenEstimate {
  /** Estimated number of tokens */
  count: number
  /** Confidence level of the estimation */
  confidence: 'high' | 'medium' | 'low'
  /** Provider used for estimation */
  provider: string
  /** Method used for estimation */
  method: 'precise' | 'heuristic' | 'fallback'
}

export interface TokenUsage {
  /** Number of prompt/input tokens */
  prompt: number
  /** Number of completion/output tokens */
  completion: number
  /** Total number of tokens */
  total: number
}

export interface CostBreakdown {
  /** Input cost in USD */
  input: number
  /** Output cost in USD */
  output: number
  /** Total cost in USD */
  total: number
}

export interface StreamingCostResult {
  /** Token usage breakdown */
  tokens: TokenUsage
  /** Cost breakdown */
  cost: CostBreakdown
  /** Model used for calculation */
  model: string
  /** Provider ID */
  provider: string
  /** Estimation method used */
  method: 'tokenization' | 'provider_response'
}

export interface TokenizationInput {
  /** Primary input text */
  inputText: string
  /** Generated output text */
  outputText: string
  /** Model identifier */
  model: string
  /** Optional system prompt */
  systemPrompt?: string
  /** Optional context */
  context?: string
  /** Optional message history */
  messages?: Array<{ role: string; content: string }>
}

export interface ProviderTokenizationConfig {
  /** Average characters per token for this provider */
  avgCharsPerToken: number
  /** Confidence level for this provider's estimation */
  confidence: TokenEstimate['confidence']
  /** Supported token estimation methods */
  supportedMethods: TokenEstimate['method'][]
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/tokenization/utils.ts

```typescript
/**
 * Utility functions for tokenization
 */

import { createLogger } from '@/lib/logs/console/logger'
import {
  LLM_BLOCK_TYPES,
  MAX_PREVIEW_LENGTH,
  TOKENIZATION_CONFIG,
} from '@/lib/tokenization/constants'
import { createTokenizationError } from '@/lib/tokenization/errors'
import type { ProviderTokenizationConfig, TokenUsage } from '@/lib/tokenization/types'
import { getProviderFromModel } from '@/providers/utils'

const logger = createLogger('TokenizationUtils')

/**
 * Gets tokenization configuration for a specific provider
 */
export function getProviderConfig(providerId: string): ProviderTokenizationConfig {
  const config =
    TOKENIZATION_CONFIG.providers[providerId as keyof typeof TOKENIZATION_CONFIG.providers]

  if (!config) {
    logger.debug(`No specific config for provider ${providerId}, using fallback`, { providerId })
    return TOKENIZATION_CONFIG.fallback
  }

  return config
}

/**
 * Extracts provider ID from model name
 */
export function getProviderForTokenization(model: string): string {
  try {
    return getProviderFromModel(model)
  } catch (error) {
    logger.warn(`Failed to get provider for model ${model}, using default`, {
      model,
      error: error instanceof Error ? error.message : String(error),
    })
    return TOKENIZATION_CONFIG.defaults.provider
  }
}

/**
 * Checks if a block type should be tokenized
 */
export function isTokenizableBlockType(blockType?: string): boolean {
  if (!blockType) return false
  return LLM_BLOCK_TYPES.includes(blockType as any)
}

/**
 * Checks if tokens/cost data is meaningful (non-zero)
 */
export function hasRealTokenData(tokens?: TokenUsage): boolean {
  if (!tokens) return false
  return tokens.total > 0 || tokens.prompt > 0 || tokens.completion > 0
}

/**
 * Checks if cost data is meaningful (non-zero)
 */
export function hasRealCostData(cost?: {
  total?: number
  input?: number
  output?: number
}): boolean {
  if (!cost) return false
  return (cost.total || 0) > 0 || (cost.input || 0) > 0 || (cost.output || 0) > 0
}

/**
 * Safely extracts text content from various input formats
 */
export function extractTextContent(input: unknown): string {
  if (typeof input === 'string') {
    return input.trim()
  }

  if (input && typeof input === 'object') {
    try {
      return JSON.stringify(input)
    } catch (error) {
      logger.warn('Failed to stringify input object', {
        inputType: typeof input,
        error: error instanceof Error ? error.message : String(error),
      })
      return ''
    }
  }

  return String(input || '')
}

/**
 * Creates a preview of text for logging (truncated)
 */
export function createTextPreview(text: string): string {
  if (text.length <= MAX_PREVIEW_LENGTH) {
    return text
  }
  return `${text.substring(0, MAX_PREVIEW_LENGTH)}...`
}

/**
 * Validates tokenization input
 */
export function validateTokenizationInput(
  model: string,
  inputText: string,
  outputText: string
): void {
  if (!model?.trim()) {
    throw createTokenizationError('INVALID_MODEL', 'Model is required for tokenization', { model })
  }

  if (!inputText?.trim() && !outputText?.trim()) {
    throw createTokenizationError(
      'MISSING_TEXT',
      'Either input text or output text must be provided',
      {
        inputLength: inputText?.length || 0,
        outputLength: outputText?.length || 0,
      }
    )
  }
}

/**
 * Formats token count for display
 */
export function formatTokenCount(count: number): string {
  if (count === 0) return '0'
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

/**
 * Logs tokenization operation details
 */
export function logTokenizationDetails(
  operation: string,
  details: {
    blockId?: string
    blockType?: string
    model?: string
    provider?: string
    inputLength?: number
    outputLength?: number
    tokens?: TokenUsage
    cost?: { input?: number; output?: number; total?: number }
    method?: string
  }
): void {
  logger.info(`${operation}`, {
    blockId: details.blockId,
    blockType: details.blockType,
    model: details.model,
    provider: details.provider,
    inputLength: details.inputLength,
    outputLength: details.outputLength,
    tokens: details.tokens,
    cost: details.cost,
    method: details.method,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: sim-main/apps/sim/lib/uploads/config.ts

```typescript
import { env } from '@/lib/core/config/env'
import type { StorageConfig, StorageContext } from '@/lib/uploads/shared/types'

export type { StorageConfig, StorageContext } from '@/lib/uploads/shared/types'
export const UPLOAD_DIR = '/uploads'

const hasS3Config = !!(env.S3_BUCKET_NAME && env.AWS_REGION)
const hasBlobConfig = !!(
  env.AZURE_STORAGE_CONTAINER_NAME &&
  ((env.AZURE_ACCOUNT_NAME && env.AZURE_ACCOUNT_KEY) || env.AZURE_CONNECTION_STRING)
)

export const USE_BLOB_STORAGE = hasBlobConfig
export const USE_S3_STORAGE = hasS3Config && !USE_BLOB_STORAGE

export const S3_CONFIG = {
  bucket: env.S3_BUCKET_NAME || '',
  region: env.AWS_REGION || '',
}

export const BLOB_CONFIG = {
  accountName: env.AZURE_ACCOUNT_NAME || '',
  accountKey: env.AZURE_ACCOUNT_KEY || '',
  connectionString: env.AZURE_CONNECTION_STRING || '',
  containerName: env.AZURE_STORAGE_CONTAINER_NAME || '',
}

export const S3_KB_CONFIG = {
  bucket: env.S3_KB_BUCKET_NAME || '',
  region: env.AWS_REGION || '',
}

export const S3_EXECUTION_FILES_CONFIG = {
  bucket: env.S3_EXECUTION_FILES_BUCKET_NAME || 'sim-execution-files',
  region: env.AWS_REGION || '',
}

export const BLOB_KB_CONFIG = {
  accountName: env.AZURE_ACCOUNT_NAME || '',
  accountKey: env.AZURE_ACCOUNT_KEY || '',
  connectionString: env.AZURE_CONNECTION_STRING || '',
  containerName: env.AZURE_STORAGE_KB_CONTAINER_NAME || '',
}

export const BLOB_EXECUTION_FILES_CONFIG = {
  accountName: env.AZURE_ACCOUNT_NAME || '',
  accountKey: env.AZURE_ACCOUNT_KEY || '',
  connectionString: env.AZURE_CONNECTION_STRING || '',
  containerName: env.AZURE_STORAGE_EXECUTION_FILES_CONTAINER_NAME || 'sim-execution-files',
}

export const S3_CHAT_CONFIG = {
  bucket: env.S3_CHAT_BUCKET_NAME || '',
  region: env.AWS_REGION || '',
}

export const BLOB_CHAT_CONFIG = {
  accountName: env.AZURE_ACCOUNT_NAME || '',
  accountKey: env.AZURE_ACCOUNT_KEY || '',
  connectionString: env.AZURE_CONNECTION_STRING || '',
  containerName: env.AZURE_STORAGE_CHAT_CONTAINER_NAME || '',
}

export const S3_COPILOT_CONFIG = {
  bucket: env.S3_COPILOT_BUCKET_NAME || '',
  region: env.AWS_REGION || '',
}

export const BLOB_COPILOT_CONFIG = {
  accountName: env.AZURE_ACCOUNT_NAME || '',
  accountKey: env.AZURE_ACCOUNT_KEY || '',
  connectionString: env.AZURE_CONNECTION_STRING || '',
  containerName: env.AZURE_STORAGE_COPILOT_CONTAINER_NAME || '',
}

export const S3_PROFILE_PICTURES_CONFIG = {
  bucket: env.S3_PROFILE_PICTURES_BUCKET_NAME || '',
  region: env.AWS_REGION || '',
}

export const BLOB_PROFILE_PICTURES_CONFIG = {
  accountName: env.AZURE_ACCOUNT_NAME || '',
  accountKey: env.AZURE_ACCOUNT_KEY || '',
  connectionString: env.AZURE_CONNECTION_STRING || '',
  containerName: env.AZURE_STORAGE_PROFILE_PICTURES_CONTAINER_NAME || '',
}

/**
 * Get the current storage provider as a human-readable string
 */
export function getStorageProvider(): 'Azure Blob' | 'S3' | 'Local' {
  if (USE_BLOB_STORAGE) return 'Azure Blob'
  if (USE_S3_STORAGE) return 'S3'
  return 'Local'
}

/**
 * Check if we're using any cloud storage (S3 or Blob)
 */
export function isUsingCloudStorage(): boolean {
  return USE_S3_STORAGE || USE_BLOB_STORAGE
}

/**
 * Get the appropriate storage configuration for a given context
 */
export function getStorageConfig(context: StorageContext): StorageConfig {
  if (USE_BLOB_STORAGE) {
    return getBlobConfig(context)
  }

  if (USE_S3_STORAGE) {
    return getS3Config(context)
  }

  return {}
}

/**
 * Get S3 configuration for a given context
 */
function getS3Config(context: StorageContext): StorageConfig {
  switch (context) {
    case 'knowledge-base':
      return {
        bucket: S3_KB_CONFIG.bucket,
        region: S3_KB_CONFIG.region,
      }
    case 'chat':
      return {
        bucket: S3_CHAT_CONFIG.bucket,
        region: S3_CHAT_CONFIG.region,
      }
    case 'copilot':
      return {
        bucket: S3_COPILOT_CONFIG.bucket,
        region: S3_COPILOT_CONFIG.region,
      }
    case 'execution':
      return {
        bucket: S3_EXECUTION_FILES_CONFIG.bucket,
        region: S3_EXECUTION_FILES_CONFIG.region,
      }
    case 'workspace':
      return {
        bucket: S3_CONFIG.bucket,
        region: S3_CONFIG.region,
      }
    case 'profile-pictures':
      return {
        bucket: S3_PROFILE_PICTURES_CONFIG.bucket,
        region: S3_PROFILE_PICTURES_CONFIG.region,
      }
    default:
      return {
        bucket: S3_CONFIG.bucket,
        region: S3_CONFIG.region,
      }
  }
}

/**
 * Get Azure Blob configuration for a given context
 */
function getBlobConfig(context: StorageContext): StorageConfig {
  switch (context) {
    case 'knowledge-base':
      return {
        accountName: BLOB_KB_CONFIG.accountName,
        accountKey: BLOB_KB_CONFIG.accountKey,
        connectionString: BLOB_KB_CONFIG.connectionString,
        containerName: BLOB_KB_CONFIG.containerName,
      }
    case 'chat':
      return {
        accountName: BLOB_CHAT_CONFIG.accountName,
        accountKey: BLOB_CHAT_CONFIG.accountKey,
        connectionString: BLOB_CHAT_CONFIG.connectionString,
        containerName: BLOB_CHAT_CONFIG.containerName,
      }
    case 'copilot':
      return {
        accountName: BLOB_COPILOT_CONFIG.accountName,
        accountKey: BLOB_COPILOT_CONFIG.accountKey,
        connectionString: BLOB_COPILOT_CONFIG.connectionString,
        containerName: BLOB_COPILOT_CONFIG.containerName,
      }
    case 'execution':
      return {
        accountName: BLOB_EXECUTION_FILES_CONFIG.accountName,
        accountKey: BLOB_EXECUTION_FILES_CONFIG.accountKey,
        connectionString: BLOB_EXECUTION_FILES_CONFIG.connectionString,
        containerName: BLOB_EXECUTION_FILES_CONFIG.containerName,
      }
    case 'workspace':
      return {
        accountName: BLOB_CONFIG.accountName,
        accountKey: BLOB_CONFIG.accountKey,
        connectionString: BLOB_CONFIG.connectionString,
        containerName: BLOB_CONFIG.containerName,
      }
    case 'profile-pictures':
      return {
        accountName: BLOB_PROFILE_PICTURES_CONFIG.accountName,
        accountKey: BLOB_PROFILE_PICTURES_CONFIG.accountKey,
        connectionString: BLOB_PROFILE_PICTURES_CONFIG.connectionString,
        containerName: BLOB_PROFILE_PICTURES_CONFIG.containerName,
      }
    default:
      return {
        accountName: BLOB_CONFIG.accountName,
        accountKey: BLOB_CONFIG.accountKey,
        connectionString: BLOB_CONFIG.connectionString,
        containerName: BLOB_CONFIG.containerName,
      }
  }
}

/**
 * Check if a specific storage context is configured
 * Returns false if the context would fall back to general config but general isn't configured
 */
export function isStorageContextConfigured(context: StorageContext): boolean {
  const config = getStorageConfig(context)

  if (USE_BLOB_STORAGE) {
    return !!(
      config.containerName &&
      (config.connectionString || (config.accountName && config.accountKey))
    )
  }

  if (USE_S3_STORAGE) {
    return !!(config.bucket && config.region)
  }

  return true
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/uploads/index.ts

```typescript
export {
  getStorageConfig,
  isUsingCloudStorage,
  type StorageConfig,
  type StorageContext,
  UPLOAD_DIR,
  USE_BLOB_STORAGE,
  USE_S3_STORAGE,
} from '@/lib/uploads/config'
export * as ChatFiles from '@/lib/uploads/contexts/chat'
export * as CopilotFiles from '@/lib/uploads/contexts/copilot'
export * as ExecutionFiles from '@/lib/uploads/contexts/execution'
export * as WorkspaceFiles from '@/lib/uploads/contexts/workspace'
export {
  getFileMetadata,
  getServePathPrefix,
  getStorageProvider,
} from '@/lib/uploads/core/storage-client'
export * as StorageService from '@/lib/uploads/core/storage-service'
export {
  bufferToBase64,
  createFileContent as createAnthropicFileContent,
  type FileAttachment,
  getContentType as getAnthropicContentType,
  getFileExtension,
  getMimeTypeFromExtension,
  isSupportedFileType,
  type MessageContent as AnthropicMessageContent,
  MIME_TYPE_MAPPING,
} from '@/lib/uploads/utils/file-utils'
```

--------------------------------------------------------------------------------

---[FILE: chat-file-manager.ts]---
Location: sim-main/apps/sim/lib/uploads/contexts/chat/chat-file-manager.ts

```typescript
import { processExecutionFiles } from '@/lib/execution/files'
import { createLogger } from '@/lib/logs/console/logger'
import type { UserFile } from '@/executor/types'

const logger = createLogger('ChatFileManager')

export interface ChatFile {
  data?: string // Legacy field - base64-encoded file data (data:mime;base64,...) or raw base64
  dataUrl?: string // Preferred field - base64-encoded file data (data:mime;base64,...)
  url?: string // Direct URL to existing file
  name: string // Original filename
  type: string // MIME type
}

export interface ChatExecutionContext {
  workspaceId: string
  workflowId: string
  executionId: string
}

/**
 * Process and upload chat files to temporary execution storage
 *
 * Handles two input formats:
 * 1. Base64 dataUrl - File content encoded as data URL (uploaded from client)
 * 2. Direct URL - Pass-through URL to existing file (already uploaded)
 *
 * Files are stored in the execution context with 5-10 minute expiry.
 *
 * @param files Array of chat file attachments
 * @param executionContext Execution context for temporary storage
 * @param requestId Unique request identifier for logging/tracing
 * @param userId User ID for file metadata (optional)
 * @returns Array of UserFile objects with upload results
 */
export async function processChatFiles(
  files: ChatFile[],
  executionContext: ChatExecutionContext,
  requestId: string,
  userId?: string
): Promise<UserFile[]> {
  logger.info(
    `Processing ${files.length} chat files for execution ${executionContext.executionId}`,
    {
      requestId,
      executionContext,
    }
  )

  const transformedFiles = files.map((file) => {
    const inlineData = file.dataUrl || file.data

    return {
      type: inlineData ? ('file' as const) : ('url' as const),
      data: inlineData || file.url || '',
      name: file.name,
      mime: file.type,
    }
  })

  const userFiles = await processExecutionFiles(
    transformedFiles,
    executionContext,
    requestId,
    userId
  )

  logger.info(`Successfully processed ${userFiles.length} chat files`, {
    requestId,
    executionId: executionContext.executionId,
  })

  return userFiles
}

/**
 * Upload a single chat file to temporary execution storage
 *
 * This is a convenience function for uploading individual files.
 * For batch uploads, use processChatFiles() for better performance.
 *
 * @param file Chat file to upload
 * @param executionContext Execution context for temporary storage
 * @param requestId Unique request identifier
 * @returns UserFile object with upload result
 */
export async function uploadChatFile(
  file: ChatFile,
  executionContext: ChatExecutionContext,
  requestId: string,
  userId?: string
): Promise<UserFile> {
  const [userFile] = await processChatFiles([file], executionContext, requestId, userId)
  return userFile
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/uploads/contexts/chat/index.ts

```typescript
export {
  type ChatExecutionContext,
  type ChatFile,
  processChatFiles,
  uploadChatFile,
} from './chat-file-manager'
```

--------------------------------------------------------------------------------

````
