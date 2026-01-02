---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 516
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 516 of 933)

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

---[FILE: memory.test.ts]---
Location: sim-main/apps/sim/executor/handlers/agent/memory.test.ts

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Memory } from '@/executor/handlers/agent/memory'
import type { AgentInputs, Message } from '@/executor/handlers/agent/types'
import type { ExecutionContext } from '@/executor/types'

vi.mock('@/lib/logs/console/logger', () => ({
  createLogger: () => ({
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  }),
}))

vi.mock('@/lib/tokenization/estimators', () => ({
  getAccurateTokenCount: vi.fn((text: string) => {
    return Math.ceil(text.length / 4)
  }),
}))

describe('Memory', () => {
  let memoryService: Memory
  let mockContext: ExecutionContext

  beforeEach(() => {
    memoryService = new Memory()
    mockContext = {
      workflowId: 'test-workflow-id',
      executionId: 'test-execution-id',
      workspaceId: 'test-workspace-id',
    } as ExecutionContext
  })

  describe('applySlidingWindow (message-based)', () => {
    it('should keep last N conversation messages', () => {
      const messages: Message[] = [
        { role: 'system', content: 'System prompt' },
        { role: 'user', content: 'Message 1' },
        { role: 'assistant', content: 'Response 1' },
        { role: 'user', content: 'Message 2' },
        { role: 'assistant', content: 'Response 2' },
        { role: 'user', content: 'Message 3' },
        { role: 'assistant', content: 'Response 3' },
      ]

      const result = (memoryService as any).applySlidingWindow(messages, '4')

      expect(result.length).toBe(5)
      expect(result[0].role).toBe('system')
      expect(result[0].content).toBe('System prompt')
      expect(result[1].content).toBe('Message 2')
      expect(result[4].content).toBe('Response 3')
    })

    it('should preserve only first system message', () => {
      const messages: Message[] = [
        { role: 'system', content: 'First system' },
        { role: 'user', content: 'User message' },
        { role: 'system', content: 'Second system' },
        { role: 'assistant', content: 'Assistant message' },
      ]

      const result = (memoryService as any).applySlidingWindow(messages, '10')

      const systemMessages = result.filter((m: Message) => m.role === 'system')
      expect(systemMessages.length).toBe(1)
      expect(systemMessages[0].content).toBe('First system')
    })

    it('should handle invalid window size', () => {
      const messages: Message[] = [{ role: 'user', content: 'Test' }]

      const result = (memoryService as any).applySlidingWindow(messages, 'invalid')
      expect(result).toEqual(messages)
    })
  })

  describe('applySlidingWindowByTokens (token-based)', () => {
    it('should keep messages within token limit', () => {
      const messages: Message[] = [
        { role: 'system', content: 'This is a system message' }, // ~6 tokens
        { role: 'user', content: 'Short' }, // ~2 tokens
        { role: 'assistant', content: 'This is a longer response message' }, // ~8 tokens
        { role: 'user', content: 'Another user message here' }, // ~6 tokens
        { role: 'assistant', content: 'Final response' }, // ~3 tokens
      ]

      // Set limit to ~15 tokens - should include last 2-3 messages
      const result = (memoryService as any).applySlidingWindowByTokens(messages, '15', 'gpt-4o')

      expect(result.length).toBeGreaterThan(0)
      expect(result.length).toBeLessThan(messages.length)

      // Should include newest messages
      expect(result[result.length - 1].content).toBe('Final response')
    })

    it('should include at least 1 message even if it exceeds limit', () => {
      const messages: Message[] = [
        {
          role: 'user',
          content:
            'This is a very long message that definitely exceeds our small token limit of just 5 tokens',
        },
      ]

      const result = (memoryService as any).applySlidingWindowByTokens(messages, '5', 'gpt-4o')

      expect(result.length).toBe(1)
      expect(result[0].content).toBe(messages[0].content)
    })

    it('should preserve first system message and exclude it from token count', () => {
      const messages: Message[] = [
        { role: 'system', content: 'A' }, // System message - always preserved
        { role: 'user', content: 'B' }, // ~1 token
        { role: 'assistant', content: 'C' }, // ~1 token
        { role: 'user', content: 'D' }, // ~1 token
      ]

      // Limit to 2 tokens - should fit system message + last 2 conversation messages (D, C)
      const result = (memoryService as any).applySlidingWindowByTokens(messages, '2', 'gpt-4o')

      // Should have: system message + 2 conversation messages = 3 total
      expect(result.length).toBe(3)
      expect(result[0].role).toBe('system') // First system message preserved
      expect(result[1].content).toBe('C') // Second most recent conversation message
      expect(result[2].content).toBe('D') // Most recent conversation message
    })

    it('should process messages from newest to oldest', () => {
      const messages: Message[] = [
        { role: 'user', content: 'Old message' },
        { role: 'assistant', content: 'Old response' },
        { role: 'user', content: 'New message' },
        { role: 'assistant', content: 'New response' },
      ]

      const result = (memoryService as any).applySlidingWindowByTokens(messages, '10', 'gpt-4o')

      // Should prioritize newer messages
      expect(result[result.length - 1].content).toBe('New response')
    })

    it('should handle invalid token limit', () => {
      const messages: Message[] = [{ role: 'user', content: 'Test' }]

      const result = (memoryService as any).applySlidingWindowByTokens(
        messages,
        'invalid',
        'gpt-4o'
      )
      expect(result).toEqual(messages) // Should return all messages
    })

    it('should handle zero or negative token limit', () => {
      const messages: Message[] = [{ role: 'user', content: 'Test' }]

      const result1 = (memoryService as any).applySlidingWindowByTokens(messages, '0', 'gpt-4o')
      expect(result1).toEqual(messages)

      const result2 = (memoryService as any).applySlidingWindowByTokens(messages, '-5', 'gpt-4o')
      expect(result2).toEqual(messages)
    })

    it('should work with different model names', () => {
      const messages: Message[] = [{ role: 'user', content: 'Test message' }]

      const result1 = (memoryService as any).applySlidingWindowByTokens(messages, '100', 'gpt-4o')
      expect(result1.length).toBe(1)

      const result2 = (memoryService as any).applySlidingWindowByTokens(
        messages,
        '100',
        'claude-3-5-sonnet-20241022'
      )
      expect(result2.length).toBe(1)

      const result3 = (memoryService as any).applySlidingWindowByTokens(messages, '100', undefined)
      expect(result3.length).toBe(1)
    })

    it('should handle empty messages array', () => {
      const messages: Message[] = []

      const result = (memoryService as any).applySlidingWindowByTokens(messages, '100', 'gpt-4o')
      expect(result).toEqual([])
    })
  })

  describe('buildMemoryKey', () => {
    it('should build correct key with conversationId:blockId format', () => {
      const inputs: AgentInputs = {
        memoryType: 'conversation',
        conversationId: 'emir',
      }

      const key = (memoryService as any).buildMemoryKey(mockContext, inputs, 'test-block-id')
      expect(key).toBe('emir:test-block-id')
    })

    it('should use same key format regardless of memory type', () => {
      const conversationId = 'user-123'
      const blockId = 'block-abc'

      const conversationKey = (memoryService as any).buildMemoryKey(
        mockContext,
        { memoryType: 'conversation', conversationId },
        blockId
      )
      const slidingWindowKey = (memoryService as any).buildMemoryKey(
        mockContext,
        { memoryType: 'sliding_window', conversationId },
        blockId
      )
      const slidingTokensKey = (memoryService as any).buildMemoryKey(
        mockContext,
        { memoryType: 'sliding_window_tokens', conversationId },
        blockId
      )

      // All should produce the same key - memory type only affects processing
      expect(conversationKey).toBe('user-123:block-abc')
      expect(slidingWindowKey).toBe('user-123:block-abc')
      expect(slidingTokensKey).toBe('user-123:block-abc')
    })

    it('should throw error for missing conversationId', () => {
      const inputs: AgentInputs = {
        memoryType: 'conversation',
        // conversationId missing
      }

      expect(() => {
        ;(memoryService as any).buildMemoryKey(mockContext, inputs, 'test-block-id')
      }).toThrow('Conversation ID is required for all memory types')
    })

    it('should throw error for empty conversationId', () => {
      const inputs: AgentInputs = {
        memoryType: 'conversation',
        conversationId: '   ', // Only whitespace
      }

      expect(() => {
        ;(memoryService as any).buildMemoryKey(mockContext, inputs, 'test-block-id')
      }).toThrow('Conversation ID is required for all memory types')
    })
  })

  describe('Token-based vs Message-based comparison', () => {
    it('should produce different results for same message count limit', () => {
      const messages: Message[] = [
        { role: 'user', content: 'A' }, // Short message (~1 token)
        {
          role: 'assistant',
          content: 'This is a much longer response that takes many more tokens',
        }, // Long message (~15 tokens)
        { role: 'user', content: 'B' }, // Short message (~1 token)
      ]

      // Message-based: last 2 messages
      const messageResult = (memoryService as any).applySlidingWindow(messages, '2')
      expect(messageResult.length).toBe(2)

      // Token-based: with limit of 10 tokens, might fit all 3 messages or just last 2
      const tokenResult = (memoryService as any).applySlidingWindowByTokens(
        messages,
        '10',
        'gpt-4o'
      )

      // The long message should affect what fits
      expect(tokenResult.length).toBeGreaterThanOrEqual(1)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: memory.ts]---
Location: sim-main/apps/sim/executor/handlers/agent/memory.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { getAccurateTokenCount } from '@/lib/tokenization/estimators'
import type { AgentInputs, Message } from '@/executor/handlers/agent/types'
import type { ExecutionContext } from '@/executor/types'
import { buildAPIUrl, buildAuthHeaders } from '@/executor/utils/http'
import { stringifyJSON } from '@/executor/utils/json'
import { PROVIDER_DEFINITIONS } from '@/providers/models'

const logger = createLogger('Memory')

/**
 * Class for managing agent conversation memory
 * Handles fetching and persisting messages to the memory table
 */
export class Memory {
  /**
   * Fetch messages from memory based on memoryType configuration
   */
  async fetchMemoryMessages(
    ctx: ExecutionContext,
    inputs: AgentInputs,
    blockId: string
  ): Promise<Message[]> {
    if (!inputs.memoryType || inputs.memoryType === 'none') {
      return []
    }

    if (!ctx.workflowId) {
      logger.warn('Cannot fetch memory without workflowId')
      return []
    }

    try {
      this.validateInputs(inputs.conversationId)

      const memoryKey = this.buildMemoryKey(ctx, inputs, blockId)
      let messages = await this.fetchFromMemoryAPI(ctx.workflowId, memoryKey)

      switch (inputs.memoryType) {
        case 'conversation':
          messages = this.applyContextWindowLimit(messages, inputs.model)
          break

        case 'sliding_window': {
          // Default to 10 messages if not specified (matches agent block default)
          const windowSize = inputs.slidingWindowSize || '10'
          messages = this.applySlidingWindow(messages, windowSize)
          break
        }

        case 'sliding_window_tokens': {
          // Default to 4000 tokens if not specified (matches agent block default)
          const maxTokens = inputs.slidingWindowTokens || '4000'
          messages = this.applySlidingWindowByTokens(messages, maxTokens, inputs.model)
          break
        }
      }

      return messages
    } catch (error) {
      logger.error('Failed to fetch memory messages:', error)
      return []
    }
  }

  /**
   * Persist assistant response to memory
   * Uses atomic append operations to prevent race conditions
   */
  async persistMemoryMessage(
    ctx: ExecutionContext,
    inputs: AgentInputs,
    assistantMessage: Message,
    blockId: string
  ): Promise<void> {
    if (!inputs.memoryType || inputs.memoryType === 'none') {
      return
    }

    if (!ctx.workflowId) {
      logger.warn('Cannot persist memory without workflowId')
      return
    }

    try {
      this.validateInputs(inputs.conversationId, assistantMessage.content)

      const memoryKey = this.buildMemoryKey(ctx, inputs, blockId)

      if (inputs.memoryType === 'sliding_window') {
        // Default to 10 messages if not specified (matches agent block default)
        const windowSize = inputs.slidingWindowSize || '10'

        const existingMessages = await this.fetchFromMemoryAPI(ctx.workflowId, memoryKey)
        const updatedMessages = [...existingMessages, assistantMessage]
        const messagesToPersist = this.applySlidingWindow(updatedMessages, windowSize)

        await this.persistToMemoryAPI(ctx.workflowId, memoryKey, messagesToPersist)
      } else if (inputs.memoryType === 'sliding_window_tokens') {
        // Default to 4000 tokens if not specified (matches agent block default)
        const maxTokens = inputs.slidingWindowTokens || '4000'

        const existingMessages = await this.fetchFromMemoryAPI(ctx.workflowId, memoryKey)
        const updatedMessages = [...existingMessages, assistantMessage]
        const messagesToPersist = this.applySlidingWindowByTokens(
          updatedMessages,
          maxTokens,
          inputs.model
        )

        await this.persistToMemoryAPI(ctx.workflowId, memoryKey, messagesToPersist)
      } else {
        // Conversation mode: use atomic append for better concurrency
        await this.atomicAppendToMemory(ctx.workflowId, memoryKey, assistantMessage)
      }

      logger.debug('Successfully persisted memory message', {
        workflowId: ctx.workflowId,
        key: memoryKey,
      })
    } catch (error) {
      logger.error('Failed to persist memory message:', error)
    }
  }

  /**
   * Persist user message to memory before agent execution
   */
  async persistUserMessage(
    ctx: ExecutionContext,
    inputs: AgentInputs,
    userMessage: Message,
    blockId: string
  ): Promise<void> {
    if (!inputs.memoryType || inputs.memoryType === 'none') {
      return
    }

    if (!ctx.workflowId) {
      logger.warn('Cannot persist user message without workflowId')
      return
    }

    try {
      const memoryKey = this.buildMemoryKey(ctx, inputs, blockId)

      if (inputs.slidingWindowSize && inputs.memoryType === 'sliding_window') {
        const existingMessages = await this.fetchFromMemoryAPI(ctx.workflowId, memoryKey)
        const updatedMessages = [...existingMessages, userMessage]
        const messagesToPersist = this.applySlidingWindow(updatedMessages, inputs.slidingWindowSize)
        await this.persistToMemoryAPI(ctx.workflowId, memoryKey, messagesToPersist)
      } else if (inputs.slidingWindowTokens && inputs.memoryType === 'sliding_window_tokens') {
        const existingMessages = await this.fetchFromMemoryAPI(ctx.workflowId, memoryKey)
        const updatedMessages = [...existingMessages, userMessage]
        const messagesToPersist = this.applySlidingWindowByTokens(
          updatedMessages,
          inputs.slidingWindowTokens,
          inputs.model
        )
        await this.persistToMemoryAPI(ctx.workflowId, memoryKey, messagesToPersist)
      } else {
        await this.atomicAppendToMemory(ctx.workflowId, memoryKey, userMessage)
      }
    } catch (error) {
      logger.error('Failed to persist user message:', error)
    }
  }

  /**
   * Build memory key based on conversationId and blockId
   * BlockId provides block-level memory isolation
   */
  private buildMemoryKey(_ctx: ExecutionContext, inputs: AgentInputs, blockId: string): string {
    const { conversationId } = inputs

    if (!conversationId || conversationId.trim() === '') {
      throw new Error(
        'Conversation ID is required for all memory types. ' +
          'Please provide a unique identifier (e.g., user-123, session-abc, customer-456).'
      )
    }

    return `${conversationId}:${blockId}`
  }

  /**
   * Apply sliding window to limit number of conversation messages
   *
   * System message handling:
   * - System messages are excluded from the sliding window count
   * - Only the first system message is preserved and placed at the start
   * - This ensures system prompts remain available while limiting conversation history
   */
  private applySlidingWindow(messages: Message[], windowSize: string): Message[] {
    const limit = Number.parseInt(windowSize, 10)

    if (Number.isNaN(limit) || limit <= 0) {
      logger.warn('Invalid sliding window size, returning all messages', { windowSize })
      return messages
    }

    const systemMessages = messages.filter((msg) => msg.role === 'system')
    const conversationMessages = messages.filter((msg) => msg.role !== 'system')

    const recentMessages = conversationMessages.slice(-limit)

    const firstSystemMessage = systemMessages.length > 0 ? [systemMessages[0]] : []

    return [...firstSystemMessage, ...recentMessages]
  }

  /**
   * Apply token-based sliding window to limit conversation by token count
   *
   * System message handling:
   * - For consistency with message-based sliding window, the first system message is preserved
   * - System messages are excluded from the token count
   * - This ensures system prompts are always available while limiting conversation history
   */
  private applySlidingWindowByTokens(
    messages: Message[],
    maxTokens: string,
    model?: string
  ): Message[] {
    const tokenLimit = Number.parseInt(maxTokens, 10)

    if (Number.isNaN(tokenLimit) || tokenLimit <= 0) {
      logger.warn('Invalid token limit, returning all messages', { maxTokens })
      return messages
    }

    // Separate system messages from conversation messages for consistent handling
    const systemMessages = messages.filter((msg) => msg.role === 'system')
    const conversationMessages = messages.filter((msg) => msg.role !== 'system')

    const result: Message[] = []
    let currentTokenCount = 0

    // Add conversation messages from most recent backwards
    for (let i = conversationMessages.length - 1; i >= 0; i--) {
      const message = conversationMessages[i]
      const messageTokens = getAccurateTokenCount(message.content, model)

      if (currentTokenCount + messageTokens <= tokenLimit) {
        result.unshift(message)
        currentTokenCount += messageTokens
      } else if (result.length === 0) {
        logger.warn('Single message exceeds token limit, including anyway', {
          messageTokens,
          tokenLimit,
          messageRole: message.role,
        })
        result.unshift(message)
        currentTokenCount += messageTokens
        break
      } else {
        // Token limit reached, stop processing
        break
      }
    }

    logger.debug('Applied token-based sliding window', {
      totalMessages: messages.length,
      conversationMessages: conversationMessages.length,
      includedMessages: result.length,
      totalTokens: currentTokenCount,
      tokenLimit,
    })

    // Preserve first system message and prepend to results (consistent with message-based window)
    const firstSystemMessage = systemMessages.length > 0 ? [systemMessages[0]] : []
    return [...firstSystemMessage, ...result]
  }

  /**
   * Apply context window limit based on model's maximum context window
   * Auto-trims oldest conversation messages when approaching the model's context limit
   * Uses 90% of context window (10% buffer for response)
   * Only applies if model has contextWindow defined and contextInformationAvailable !== false
   */
  private applyContextWindowLimit(messages: Message[], model?: string): Message[] {
    if (!model) {
      return messages
    }

    let contextWindow: number | undefined

    for (const provider of Object.values(PROVIDER_DEFINITIONS)) {
      if (provider.contextInformationAvailable === false) {
        continue
      }

      const matchesPattern = provider.modelPatterns?.some((pattern) => pattern.test(model))
      const matchesModel = provider.models.some((m) => m.id === model)

      if (matchesPattern || matchesModel) {
        const modelDef = provider.models.find((m) => m.id === model)
        if (modelDef?.contextWindow) {
          contextWindow = modelDef.contextWindow
          break
        }
      }
    }

    if (!contextWindow) {
      logger.debug('No context window information available for model, skipping auto-trim', {
        model,
      })
      return messages
    }

    const maxTokens = Math.floor(contextWindow * 0.9)

    logger.debug('Applying context window limit', {
      model,
      contextWindow,
      maxTokens,
      totalMessages: messages.length,
    })

    const systemMessages = messages.filter((msg) => msg.role === 'system')
    const conversationMessages = messages.filter((msg) => msg.role !== 'system')

    // Count tokens used by system messages first
    let systemTokenCount = 0
    for (const msg of systemMessages) {
      systemTokenCount += getAccurateTokenCount(msg.content, model)
    }

    // Calculate remaining tokens available for conversation messages
    const remainingTokens = Math.max(0, maxTokens - systemTokenCount)

    if (systemTokenCount >= maxTokens) {
      logger.warn('System messages exceed context window limit, including anyway', {
        systemTokenCount,
        maxTokens,
        systemMessageCount: systemMessages.length,
      })
      return systemMessages
    }

    const result: Message[] = []
    let currentTokenCount = 0

    for (let i = conversationMessages.length - 1; i >= 0; i--) {
      const message = conversationMessages[i]
      const messageTokens = getAccurateTokenCount(message.content, model)

      if (currentTokenCount + messageTokens <= remainingTokens) {
        result.unshift(message)
        currentTokenCount += messageTokens
      } else if (result.length === 0) {
        logger.warn('Single message exceeds remaining context window, including anyway', {
          messageTokens,
          remainingTokens,
          systemTokenCount,
          messageRole: message.role,
        })
        result.unshift(message)
        currentTokenCount += messageTokens
        break
      } else {
        logger.info('Auto-trimmed conversation history to fit context window', {
          originalMessages: conversationMessages.length,
          trimmedMessages: result.length,
          conversationTokens: currentTokenCount,
          systemTokens: systemTokenCount,
          totalTokens: currentTokenCount + systemTokenCount,
          maxTokens,
        })
        break
      }
    }

    return [...systemMessages, ...result]
  }

  /**
   * Fetch messages from memory API
   */
  private async fetchFromMemoryAPI(workflowId: string, key: string): Promise<Message[]> {
    try {
      const isBrowser = typeof window !== 'undefined'

      if (!isBrowser) {
        return await this.fetchFromMemoryDirect(workflowId, key)
      }

      const headers = await buildAuthHeaders()
      const url = buildAPIUrl(`/api/memory/${encodeURIComponent(key)}`, { workflowId })

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        if (response.status === 404) {
          return []
        }
        throw new Error(`Failed to fetch memory: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch memory')
      }

      const memoryData = result.data?.data || result.data
      if (Array.isArray(memoryData)) {
        return memoryData.filter(
          (msg) => msg && typeof msg === 'object' && 'role' in msg && 'content' in msg
        )
      }

      return []
    } catch (error) {
      logger.error('Error fetching from memory API:', error)
      return []
    }
  }

  /**
   * Direct database access
   */
  private async fetchFromMemoryDirect(workflowId: string, key: string): Promise<Message[]> {
    try {
      const { db } = await import('@sim/db')
      const { memory } = await import('@sim/db/schema')
      const { and, eq } = await import('drizzle-orm')

      const result = await db
        .select({
          data: memory.data,
        })
        .from(memory)
        .where(and(eq(memory.workflowId, workflowId), eq(memory.key, key)))
        .limit(1)

      if (result.length === 0) {
        return []
      }

      const memoryData = result[0].data as any
      if (Array.isArray(memoryData)) {
        return memoryData.filter(
          (msg) => msg && typeof msg === 'object' && 'role' in msg && 'content' in msg
        )
      }

      return []
    } catch (error) {
      logger.error('Error fetching from memory database:', error)
      return []
    }
  }

  /**
   * Persist messages to memory API
   */
  private async persistToMemoryAPI(
    workflowId: string,
    key: string,
    messages: Message[]
  ): Promise<void> {
    try {
      const isBrowser = typeof window !== 'undefined'

      if (!isBrowser) {
        await this.persistToMemoryDirect(workflowId, key, messages)
        return
      }

      const headers = await buildAuthHeaders()
      const url = buildAPIUrl('/api/memory')

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: stringifyJSON({
          workflowId,
          key,
          data: messages,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to persist memory: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to persist memory')
      }
    } catch (error) {
      logger.error('Error persisting to memory API:', error)
      throw error
    }
  }

  /**
   * Atomically append a message to memory
   */
  private async atomicAppendToMemory(
    workflowId: string,
    key: string,
    message: Message
  ): Promise<void> {
    try {
      const isBrowser = typeof window !== 'undefined'

      if (!isBrowser) {
        await this.atomicAppendToMemoryDirect(workflowId, key, message)
      } else {
        const headers = await buildAuthHeaders()
        const url = buildAPIUrl('/api/memory')

        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: stringifyJSON({
            workflowId,
            key,
            data: message,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to append memory: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to append memory')
        }
      }
    } catch (error) {
      logger.error('Error appending to memory:', error)
      throw error
    }
  }

  /**
   * Direct database atomic append for server-side
   * Uses PostgreSQL JSONB concatenation operator for atomic operations
   */
  private async atomicAppendToMemoryDirect(
    workflowId: string,
    key: string,
    message: Message
  ): Promise<void> {
    try {
      const { db } = await import('@sim/db')
      const { memory } = await import('@sim/db/schema')
      const { sql } = await import('drizzle-orm')
      const { randomUUID } = await import('node:crypto')

      const now = new Date()
      const id = randomUUID()

      await db
        .insert(memory)
        .values({
          id,
          workflowId,
          key,
          data: [message],
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [memory.workflowId, memory.key],
          set: {
            data: sql`${memory.data} || ${JSON.stringify([message])}::jsonb`,
            updatedAt: now,
          },
        })

      logger.debug('Atomically appended message to memory', {
        workflowId,
        key,
      })
    } catch (error) {
      logger.error('Error in atomic append to memory database:', error)
      throw error
    }
  }

  /**
   * Direct database access for server-side persistence
   * Uses UPSERT to handle race conditions atomically
   */
  private async persistToMemoryDirect(
    workflowId: string,
    key: string,
    messages: Message[]
  ): Promise<void> {
    try {
      const { db } = await import('@sim/db')
      const { memory } = await import('@sim/db/schema')
      const { randomUUID } = await import('node:crypto')

      const now = new Date()
      const id = randomUUID()

      await db
        .insert(memory)
        .values({
          id,
          workflowId,
          key,
          data: messages,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [memory.workflowId, memory.key],
          set: {
            data: messages,
            updatedAt: now,
          },
        })
    } catch (error) {
      logger.error('Error persisting to memory database:', error)
      throw error
    }
  }

  /**
   * Validate inputs to prevent malicious data or performance issues
   */
  private validateInputs(conversationId?: string, content?: string): void {
    if (conversationId) {
      if (conversationId.length > 255) {
        throw new Error('Conversation ID too long (max 255 characters)')
      }

      if (!/^[a-zA-Z0-9_\-:.@]+$/.test(conversationId)) {
        logger.warn('Conversation ID contains special characters', { conversationId })
      }
    }

    if (content) {
      const contentSize = Buffer.byteLength(content, 'utf8')
      const MAX_CONTENT_SIZE = 100 * 1024 // 100KB

      if (contentSize > MAX_CONTENT_SIZE) {
        throw new Error(`Message content too large (${contentSize} bytes, max ${MAX_CONTENT_SIZE})`)
      }
    }
  }
}

export const memoryService = new Memory()
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/executor/handlers/agent/types.ts

```typescript
export interface AgentInputs {
  model?: string
  responseFormat?: string | object
  tools?: ToolInput[]
  // Legacy inputs (backward compatible)
  systemPrompt?: string
  userPrompt?: string | object
  memories?: any // Legacy memory block output
  // New message array input (from messages-input subblock)
  messages?: Message[]
  // Memory configuration
  memoryType?: 'none' | 'conversation' | 'sliding_window' | 'sliding_window_tokens'
  conversationId?: string // Required for all non-none memory types
  slidingWindowSize?: string // For message-based sliding window
  slidingWindowTokens?: string // For token-based sliding window
  // LLM parameters
  temperature?: number
  maxTokens?: number
  apiKey?: string
  azureEndpoint?: string
  azureApiVersion?: string
  vertexProject?: string
  vertexLocation?: string
  reasoningEffort?: string
  verbosity?: string
}

export interface ToolInput {
  type?: string
  schema?: any
  title?: string
  code?: string
  params?: Record<string, any>
  timeout?: number
  usageControl?: 'auto' | 'force' | 'none'
  operation?: string
  /** Database ID for custom tools (new reference format) */
  customToolId?: string
}

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
  function_call?: any
  tool_calls?: any[]
}

export interface StreamingConfig {
  shouldUseStreaming: boolean
  isBlockSelectedForOutput: boolean
  hasOutgoingConnections: boolean
}
```

--------------------------------------------------------------------------------

````
