---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 520
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 520 of 933)

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

---[FILE: router-handler.ts]---
Location: sim-main/apps/sim/executor/handlers/router/router-handler.ts

```typescript
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { generateRouterPrompt } from '@/blocks/blocks/router'
import type { BlockOutput } from '@/blocks/types'
import { BlockType, DEFAULTS, HTTP, isAgentBlockType, ROUTER } from '@/executor/constants'
import type { BlockHandler, ExecutionContext } from '@/executor/types'
import { calculateCost, getProviderFromModel } from '@/providers/utils'
import type { SerializedBlock } from '@/serializer/types'

const logger = createLogger('RouterBlockHandler')

/**
 * Handler for Router blocks that dynamically select execution paths.
 */
export class RouterBlockHandler implements BlockHandler {
  constructor(private pathTracker?: any) {}

  canHandle(block: SerializedBlock): boolean {
    return block.metadata?.id === BlockType.ROUTER
  }

  async execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<BlockOutput> {
    const targetBlocks = this.getTargetBlocks(ctx, block)

    const routerConfig = {
      prompt: inputs.prompt,
      model: inputs.model || ROUTER.DEFAULT_MODEL,
      apiKey: inputs.apiKey,
    }

    const providerId = getProviderFromModel(routerConfig.model)

    try {
      const url = new URL('/api/providers', getBaseUrl())

      const messages = [{ role: 'user', content: routerConfig.prompt }]
      const systemPrompt = generateRouterPrompt(routerConfig.prompt, targetBlocks)
      const providerRequest = {
        provider: providerId,
        model: routerConfig.model,
        systemPrompt: systemPrompt,
        context: JSON.stringify(messages),
        temperature: ROUTER.INFERENCE_TEMPERATURE,
        apiKey: routerConfig.apiKey,
        workflowId: ctx.workflowId,
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': HTTP.CONTENT_TYPE.JSON,
        },
        body: JSON.stringify(providerRequest),
      })

      if (!response.ok) {
        let errorMessage = `Provider API request failed with status ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch (_e) {}
        throw new Error(errorMessage)
      }

      const result = await response.json()

      const chosenBlockId = result.content.trim().toLowerCase()
      const chosenBlock = targetBlocks?.find((b) => b.id === chosenBlockId)

      if (!chosenBlock) {
        logger.error(
          `Invalid routing decision. Response content: "${result.content}", available blocks:`,
          targetBlocks?.map((b) => ({ id: b.id, title: b.title })) || []
        )
        throw new Error(`Invalid routing decision: ${chosenBlockId}`)
      }

      const tokens = result.tokens || {
        prompt: DEFAULTS.TOKENS.PROMPT,
        completion: DEFAULTS.TOKENS.COMPLETION,
        total: DEFAULTS.TOKENS.TOTAL,
      }

      const cost = calculateCost(
        result.model,
        tokens.prompt || DEFAULTS.TOKENS.PROMPT,
        tokens.completion || DEFAULTS.TOKENS.COMPLETION,
        false
      )

      return {
        prompt: inputs.prompt,
        model: result.model,
        tokens: {
          prompt: tokens.prompt || DEFAULTS.TOKENS.PROMPT,
          completion: tokens.completion || DEFAULTS.TOKENS.COMPLETION,
          total: tokens.total || DEFAULTS.TOKENS.TOTAL,
        },
        cost: {
          input: cost.input,
          output: cost.output,
          total: cost.total,
        },
        selectedPath: {
          blockId: chosenBlock.id,
          blockType: chosenBlock.type || DEFAULTS.BLOCK_TYPE,
          blockTitle: chosenBlock.title || DEFAULTS.BLOCK_TITLE,
        },
        selectedRoute: String(chosenBlock.id),
      } as BlockOutput
    } catch (error) {
      logger.error('Router execution failed:', error)
      throw error
    }
  }

  private getTargetBlocks(ctx: ExecutionContext, block: SerializedBlock) {
    return ctx.workflow?.connections
      .filter((conn) => conn.source === block.id)
      .map((conn) => {
        const targetBlock = ctx.workflow?.blocks.find((b) => b.id === conn.target)
        if (!targetBlock) {
          throw new Error(`Target block ${conn.target} not found`)
        }

        let systemPrompt = ''
        if (isAgentBlockType(targetBlock.metadata?.id)) {
          systemPrompt =
            targetBlock.config?.params?.systemPrompt || targetBlock.inputs?.systemPrompt || ''

          if (!systemPrompt && targetBlock.inputs) {
            systemPrompt = targetBlock.inputs.systemPrompt || ''
          }
        }

        return {
          id: targetBlock.id,
          type: targetBlock.metadata?.id,
          title: targetBlock.metadata?.name,
          description: targetBlock.metadata?.description,
          subBlocks: {
            ...targetBlock.config.params,
            systemPrompt: systemPrompt,
          },
          currentState: ctx.blockStates.get(targetBlock.id)?.output,
        }
      })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: trigger-handler.test.ts]---
Location: sim-main/apps/sim/executor/handlers/trigger/trigger-handler.test.ts

```typescript
import '@/executor/__test-utils__/mock-dependencies'

import { beforeEach, describe, expect, it } from 'vitest'
import { TriggerBlockHandler } from '@/executor/handlers/trigger/trigger-handler'
import type { ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'

describe('TriggerBlockHandler', () => {
  let handler: TriggerBlockHandler
  let mockContext: ExecutionContext

  beforeEach(() => {
    handler = new TriggerBlockHandler()

    mockContext = {
      workflowId: 'test-workflow-id',
      blockStates: new Map(),
      blockLogs: [],
      metadata: { duration: 0 },
      environmentVariables: {},
      decisions: { router: new Map(), condition: new Map() },
      loopExecutions: new Map(),
      executedBlocks: new Set(),
      activeExecutionPath: new Set(),
      completedLoops: new Set(),
    }
  })

  describe('canHandle', () => {
    it.concurrent('should handle blocks with triggers category', () => {
      const triggerBlock: SerializedBlock = {
        id: 'trigger-1',
        metadata: { id: 'schedule', name: 'Schedule Block', category: 'triggers' },
        position: { x: 0, y: 0 },
        config: { tool: 'schedule', params: {} },
        inputs: {},
        outputs: {},
        enabled: true,
      }

      expect(handler.canHandle(triggerBlock)).toBe(true)
    })

    it.concurrent('should handle blocks with triggerMode enabled', () => {
      const gmailTriggerBlock: SerializedBlock = {
        id: 'gmail-1',
        metadata: { id: 'gmail', name: 'Gmail Block', category: 'tools' },
        position: { x: 0, y: 0 },
        config: { tool: 'gmail', params: { triggerMode: true } },
        inputs: {},
        outputs: {},
        enabled: true,
      }

      expect(handler.canHandle(gmailTriggerBlock)).toBe(true)
    })

    it.concurrent('should not handle regular tool blocks without triggerMode', () => {
      const toolBlock: SerializedBlock = {
        id: 'tool-1',
        metadata: { id: 'gmail', name: 'Gmail Block', category: 'tools' },
        position: { x: 0, y: 0 },
        config: { tool: 'gmail', params: { triggerMode: false } },
        inputs: {},
        outputs: {},
        enabled: true,
      }

      expect(handler.canHandle(toolBlock)).toBe(false)
    })

    it.concurrent('should not handle blocks without trigger indicators', () => {
      const regularBlock: SerializedBlock = {
        id: 'regular-1',
        metadata: { id: 'api', name: 'API Block', category: 'tools' },
        position: { x: 0, y: 0 },
        config: { tool: 'api', params: {} },
        inputs: {},
        outputs: {},
        enabled: true,
      }

      expect(handler.canHandle(regularBlock)).toBe(false)
    })

    it.concurrent('should handle generic webhook blocks', () => {
      const webhookBlock: SerializedBlock = {
        id: 'webhook-1',
        metadata: { id: 'generic_webhook', name: 'Generic Webhook', category: 'triggers' },
        position: { x: 0, y: 0 },
        config: { tool: 'generic_webhook', params: {} },
        inputs: {},
        outputs: {},
        enabled: true,
      }

      expect(handler.canHandle(webhookBlock)).toBe(true)
    })
  })

  describe('execute', () => {
    it.concurrent('should return inputs directly when provided', async () => {
      const triggerBlock: SerializedBlock = {
        id: 'trigger-1',
        metadata: { id: 'gmail', name: 'Gmail Trigger', category: 'triggers' },
        position: { x: 0, y: 0 },
        config: { tool: 'gmail', params: {} },
        inputs: {},
        outputs: {},
        enabled: true,
      }

      const triggerInputs = {
        email: {
          id: '12345',
          subject: 'Test Email',
          from: 'test@example.com',
          body: 'Hello world',
        },
        timestamp: '2023-01-01T12:00:00Z',
      }

      const result = await handler.execute(mockContext, triggerBlock, triggerInputs)

      expect(result).toEqual(triggerInputs)
    })

    it.concurrent('should return empty object when no inputs provided', async () => {
      const triggerBlock: SerializedBlock = {
        id: 'trigger-1',
        metadata: { id: 'schedule', name: 'Schedule Trigger', category: 'triggers' },
        position: { x: 0, y: 0 },
        config: { tool: 'schedule', params: {} },
        inputs: {},
        outputs: {},
        enabled: true,
      }

      const result = await handler.execute(mockContext, triggerBlock, {})

      expect(result).toEqual({})
    })

    it.concurrent('should handle webhook payload inputs', async () => {
      const webhookBlock: SerializedBlock = {
        id: 'webhook-1',
        metadata: { id: 'generic_webhook', name: 'Generic Webhook', category: 'triggers' },
        position: { x: 0, y: 0 },
        config: { tool: 'generic_webhook', params: {} },
        inputs: {},
        outputs: {},
        enabled: true,
      }

      const webhookInputs = {
        webhook: {
          data: {
            provider: 'github',
            payload: { event: 'push', repo: 'test-repo' },
          },
        },
      }

      const result = await handler.execute(mockContext, webhookBlock, webhookInputs)

      expect(result).toEqual(webhookInputs)
    })

    it.concurrent('should handle Outlook trigger inputs', async () => {
      const outlookBlock: SerializedBlock = {
        id: 'outlook-1',
        metadata: { id: 'outlook', name: 'Outlook Block', category: 'tools' },
        position: { x: 0, y: 0 },
        config: { tool: 'outlook', params: { triggerMode: true } },
        inputs: {},
        outputs: {},
        enabled: true,
      }

      const outlookInputs = {
        email: {
          id: 'outlook123',
          subject: 'Meeting Invitation',
          from: 'colleague@company.com',
          bodyPreview: 'Join us for the quarterly review...',
        },
        timestamp: '2023-01-01T14:30:00Z',
      }

      const result = await handler.execute(mockContext, outlookBlock, outlookInputs)

      expect(result).toEqual(outlookInputs)
    })

    it.concurrent('should handle schedule trigger with no inputs', async () => {
      const scheduleBlock: SerializedBlock = {
        id: 'schedule-1',
        metadata: { id: 'schedule', name: 'Daily Schedule', category: 'triggers' },
        position: { x: 0, y: 0 },
        config: { tool: 'schedule', params: { scheduleType: 'daily' } },
        inputs: {},
        outputs: {},
        enabled: true,
      }

      const result = await handler.execute(mockContext, scheduleBlock, {})

      // Schedule triggers typically don't have input data, just trigger the workflow
      expect(result).toEqual({})
    })

    it.concurrent('should handle complex nested trigger data', async () => {
      const triggerBlock: SerializedBlock = {
        id: 'complex-trigger-1',
        metadata: { id: 'webhook', name: 'Complex Webhook', category: 'triggers' },
        position: { x: 0, y: 0 },
        config: { tool: 'webhook', params: {} },
        inputs: {},
        outputs: {},
        enabled: true,
      }

      const complexInputs = {
        webhook: {
          data: {
            provider: 'github',
            payload: {
              action: 'opened',
              pull_request: {
                id: 123,
                title: 'Fix bug in authentication',
                user: { login: 'developer' },
                base: { ref: 'main' },
                head: { ref: 'fix-auth-bug' },
              },
            },
            headers: { 'x-github-event': 'pull_request' },
          },
        },
        timestamp: '2023-01-01T15:45:00Z',
      }

      const result = await handler.execute(mockContext, triggerBlock, complexInputs)

      expect(result).toEqual(complexInputs)
    })
  })

  describe('integration scenarios', () => {
    it.concurrent('should work with different trigger block types', () => {
      const testCases = [
        {
          name: 'Gmail in trigger mode',
          block: {
            id: 'gmail-trigger',
            metadata: { id: 'gmail', category: 'tools' },
            config: { tool: 'gmail', params: { triggerMode: true } },
          },
          shouldHandle: true,
        },
        {
          name: 'Generic webhook',
          block: {
            id: 'webhook-trigger',
            metadata: { id: 'generic_webhook', category: 'triggers' },
            config: { tool: 'generic_webhook', params: {} },
          },
          shouldHandle: true,
        },
        {
          name: 'Schedule block',
          block: {
            id: 'schedule-trigger',
            metadata: { id: 'schedule', category: 'triggers' },
            config: { tool: 'schedule', params: {} },
          },
          shouldHandle: true,
        },
        {
          name: 'Regular API block',
          block: {
            id: 'api-block',
            metadata: { id: 'api', category: 'tools' },
            config: { tool: 'api', params: {} },
          },
          shouldHandle: false,
        },
        {
          name: 'Gmail in tool mode',
          block: {
            id: 'gmail-tool',
            metadata: { id: 'gmail', category: 'tools' },
            config: { tool: 'gmail', params: { triggerMode: false } },
          },
          shouldHandle: false,
        },
      ]

      testCases.forEach(({ name, block, shouldHandle }) => {
        const serializedBlock: SerializedBlock = {
          ...block,
          position: { x: 0, y: 0 },
          inputs: {},
          outputs: {},
          enabled: true,
        } as SerializedBlock

        expect(
          handler.canHandle(serializedBlock),
          `${name} should ${shouldHandle ? '' : 'not '}be handled`
        ).toBe(shouldHandle)
      })
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: trigger-handler.ts]---
Location: sim-main/apps/sim/executor/handlers/trigger/trigger-handler.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { BlockType } from '@/executor/constants'
import type { BlockHandler, ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'

const logger = createLogger('TriggerBlockHandler')

export class TriggerBlockHandler implements BlockHandler {
  canHandle(block: SerializedBlock): boolean {
    if (block.metadata?.id === BlockType.STARTER) {
      return true
    }

    const isTriggerCategory = block.metadata?.category === 'triggers'

    const hasTriggerMode = block.config?.params?.triggerMode === true

    return isTriggerCategory || hasTriggerMode
  }

  async execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<any> {
    logger.info(`Executing trigger block: ${block.id} (Type: ${block.metadata?.id})`)

    if (block.metadata?.id === BlockType.STARTER) {
      return this.executeStarterBlock(ctx, block, inputs)
    }

    const existingState = ctx.blockStates.get(block.id)
    if (existingState?.output && Object.keys(existingState.output).length > 0) {
      const existingOutput = existingState.output as any
      const existingProvider = existingOutput?.webhook?.data?.provider

      return existingOutput
    }

    const starterBlock = ctx.workflow?.blocks?.find((b) => b.metadata?.id === 'starter')
    if (starterBlock) {
      const starterState = ctx.blockStates.get(starterBlock.id)
      if (starterState?.output && Object.keys(starterState.output).length > 0) {
        const starterOutput = starterState.output

        if (starterOutput.webhook?.data) {
          const webhookData = starterOutput.webhook?.data || {}
          const provider = webhookData.provider

          if (provider === 'github') {
            const payloadSource = webhookData.payload || {}
            return {
              ...payloadSource,
              webhook: starterOutput.webhook,
            }
          }

          if (provider === 'microsoft-teams') {
            const providerData = (starterOutput as any)[provider] || webhookData[provider] || {}
            const payloadSource = providerData?.message?.raw || webhookData.payload || {}
            return {
              ...payloadSource,
              [provider]: providerData,
              webhook: starterOutput.webhook,
            }
          }

          if (provider === 'airtable') {
            return starterOutput
          }

          const result: any = {
            input: starterOutput.input,
          }

          for (const [key, value] of Object.entries(starterOutput)) {
            if (key !== 'webhook' && key !== provider) {
              result[key] = value
            }
          }

          if (provider && starterOutput[provider]) {
            const providerData = starterOutput[provider]

            for (const [key, value] of Object.entries(providerData)) {
              if (typeof value === 'object' && value !== null) {
                if (!result[key]) {
                  result[key] = value
                }
              }
            }

            result[provider] = providerData
          } else if (provider && webhookData[provider]) {
            const providerData = webhookData[provider]

            for (const [key, value] of Object.entries(providerData)) {
              if (typeof value === 'object' && value !== null) {
                if (!result[key]) {
                  result[key] = value
                }
              }
            }

            result[provider] = providerData
          } else if (
            provider &&
            (provider === 'gmail' || provider === 'outlook') &&
            webhookData.payload?.email
          ) {
            const emailData = webhookData.payload.email

            for (const [key, value] of Object.entries(emailData)) {
              if (!result[key]) {
                result[key] = value
              }
            }

            result.email = emailData

            if (webhookData.payload.timestamp) {
              result.timestamp = webhookData.payload.timestamp
            }
          }

          if (starterOutput.webhook) result.webhook = starterOutput.webhook

          return result
        }

        return starterOutput
      }
    }

    if (inputs && Object.keys(inputs).length > 0) {
      return inputs
    }

    return {}
  }

  private executeStarterBlock(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): any {
    logger.info(`Executing starter block: ${block.id}`, {
      blockName: block.metadata?.name,
    })

    const existingState = ctx.blockStates.get(block.id)
    if (existingState?.output && Object.keys(existingState.output).length > 0) {
      return existingState.output
    }

    logger.warn('Starter block output not found in context, returning empty output', {
      blockId: block.id,
    })

    return {
      input: inputs.input || '',
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: variables-handler.ts]---
Location: sim-main/apps/sim/executor/handlers/variables/variables-handler.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { BlockOutput } from '@/blocks/types'
import { BlockType } from '@/executor/constants'
import type { BlockHandler, ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'

const logger = createLogger('VariablesBlockHandler')

export class VariablesBlockHandler implements BlockHandler {
  canHandle(block: SerializedBlock): boolean {
    const canHandle = block.metadata?.id === BlockType.VARIABLES
    return canHandle
  }

  async execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<BlockOutput> {
    try {
      if (!ctx.workflowVariables) {
        ctx.workflowVariables = {}
      }

      const assignments = this.parseAssignments(inputs.variables)

      for (const assignment of assignments) {
        const existingEntry = assignment.variableId
          ? [assignment.variableId, ctx.workflowVariables[assignment.variableId]]
          : Object.entries(ctx.workflowVariables).find(
              ([_, v]) => v.name === assignment.variableName
            )

        if (existingEntry?.[1]) {
          const [id, variable] = existingEntry
          ctx.workflowVariables[id] = {
            ...variable,
            value: assignment.value,
          }
        } else {
          logger.warn(`Variable "${assignment.variableName}" not found in workflow variables`)
        }
      }

      const output: Record<string, any> = {}
      for (const assignment of assignments) {
        output[assignment.variableName] = assignment.value
      }

      return output
    } catch (error: any) {
      logger.error('Variables block execution failed:', error)
      throw new Error(`Variables block execution failed: ${error.message}`)
    }
  }

  private parseAssignments(
    assignmentsInput: any
  ): Array<{ variableId?: string; variableName: string; type: string; value: any }> {
    const result: Array<{ variableId?: string; variableName: string; type: string; value: any }> =
      []

    if (!assignmentsInput || !Array.isArray(assignmentsInput)) {
      return result
    }

    for (const assignment of assignmentsInput) {
      if (assignment?.variableName?.trim()) {
        const name = assignment.variableName.trim()
        const type = assignment.type || 'string'
        const value = this.parseValueByType(assignment.value, type, name)

        result.push({
          variableId: assignment.variableId,
          variableName: name,
          type,
          value,
        })
      }
    }

    return result
  }

  private parseValueByType(value: any, type: string, variableName?: string): any {
    if (value === null || value === undefined || value === '') {
      if (type === 'number') return 0
      if (type === 'boolean') return false
      if (type === 'array') return []
      if (type === 'object') return {}
      return ''
    }

    if (type === 'string' || type === 'plain') {
      return typeof value === 'string' ? value : String(value)
    }

    if (type === 'number') {
      if (typeof value === 'number') return value
      if (typeof value === 'string') {
        const trimmed = value.trim()
        if (trimmed === '') return 0
        const num = Number(trimmed)
        if (Number.isNaN(num)) {
          throw new Error(
            `Invalid number value for variable "${variableName || 'unknown'}": "${value}". Expected a valid number.`
          )
        }
        return num
      }
      throw new Error(
        `Invalid type for variable "${variableName || 'unknown'}": expected number, got ${typeof value}`
      )
    }

    if (type === 'boolean') {
      if (typeof value === 'boolean') return value
      if (typeof value === 'string') {
        const lower = value.toLowerCase().trim()
        if (lower === 'true') return true
        if (lower === 'false') return false
        throw new Error(
          `Invalid boolean value for variable "${variableName || 'unknown'}": "${value}". Expected "true" or "false".`
        )
      }
      return Boolean(value)
    }

    if (type === 'object' || type === 'array') {
      // If value is already an object or array, accept it as-is
      // The type hint is for UI purposes and string parsing, not runtime validation
      if (typeof value === 'object' && value !== null) {
        return value
      }
      // If it's a string, try to parse it as JSON
      if (typeof value === 'string' && value.trim()) {
        try {
          const parsed = JSON.parse(value)
          // Accept any valid JSON object or array
          if (typeof parsed === 'object' && parsed !== null) {
            return parsed
          }
          throw new Error(
            `Invalid JSON for variable "${variableName || 'unknown'}": parsed value is not an object or array`
          )
        } catch (error: any) {
          throw new Error(
            `Invalid JSON for variable "${variableName || 'unknown'}": ${error.message}`
          )
        }
      }
      return type === 'array' ? [] : {}
    }

    return value
  }
}
```

--------------------------------------------------------------------------------

---[FILE: wait-handler.ts]---
Location: sim-main/apps/sim/executor/handlers/wait/wait-handler.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { BlockType } from '@/executor/constants'
import type { BlockHandler, ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'

const logger = createLogger('WaitBlockHandler')

/**
 * Helper function to sleep for a specified number of milliseconds
 * On client-side: checks for cancellation every 100ms (non-blocking for UI)
 * On server-side: simple sleep without polling (server execution can't be cancelled mid-flight)
 */
const sleep = async (ms: number, checkCancelled?: () => boolean): Promise<boolean> => {
  const isClientSide = typeof window !== 'undefined'

  if (!isClientSide) {
    await new Promise((resolve) => setTimeout(resolve, ms))
    return true
  }

  const chunkMs = 100
  let elapsed = 0

  while (elapsed < ms) {
    if (checkCancelled?.()) {
      return false
    }

    const sleepTime = Math.min(chunkMs, ms - elapsed)
    await new Promise((resolve) => setTimeout(resolve, sleepTime))
    elapsed += sleepTime
  }

  return true
}

/**
 * Handler for Wait blocks that pause workflow execution for a time delay
 */
export class WaitBlockHandler implements BlockHandler {
  canHandle(block: SerializedBlock): boolean {
    return block.metadata?.id === BlockType.WAIT
  }

  async execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<any> {
    const timeValue = Number.parseInt(inputs.timeValue || '10', 10)
    const timeUnit = inputs.timeUnit || 'seconds'

    if (Number.isNaN(timeValue) || timeValue <= 0) {
      throw new Error('Wait amount must be a positive number')
    }

    let waitMs = timeValue * 1000
    if (timeUnit === 'minutes') {
      waitMs = timeValue * 60 * 1000
    }

    const maxWaitMs = 10 * 60 * 1000
    if (waitMs > maxWaitMs) {
      const maxDisplay = timeUnit === 'minutes' ? '10 minutes' : '600 seconds'
      throw new Error(`Wait time exceeds maximum of ${maxDisplay}`)
    }

    const checkCancelled = () => {
      return (ctx as any).isCancelled === true
    }

    const completed = await sleep(waitMs, checkCancelled)

    if (!completed) {
      return {
        waitDuration: waitMs,
        status: 'cancelled',
      }
    }

    return {
      waitDuration: waitMs,
      status: 'completed',
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: workflow-handler.test.ts]---
Location: sim-main/apps/sim/executor/handlers/workflow/workflow-handler.test.ts

```typescript
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { BlockType } from '@/executor/constants'
import { WorkflowBlockHandler } from '@/executor/handlers/workflow/workflow-handler'
import type { ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'

vi.mock('@/lib/auth/internal', () => ({
  generateInternalToken: vi.fn().mockResolvedValue('test-token'),
}))

// Mock fetch globally
global.fetch = vi.fn()

describe('WorkflowBlockHandler', () => {
  let handler: WorkflowBlockHandler
  let mockBlock: SerializedBlock
  let mockContext: ExecutionContext
  let mockFetch: Mock

  beforeEach(() => {
    // Mock window.location.origin for getBaseUrl()
    ;(global as any).window = {
      location: {
        origin: 'http://localhost:3000',
      },
    }
    handler = new WorkflowBlockHandler()
    mockFetch = global.fetch as Mock

    mockBlock = {
      id: 'workflow-block-1',
      metadata: { id: BlockType.WORKFLOW, name: 'Test Workflow Block' },
      position: { x: 0, y: 0 },
      config: { tool: BlockType.WORKFLOW, params: {} },
      inputs: { workflowId: 'string' },
      outputs: {},
      enabled: true,
    }

    mockContext = {
      workflowId: 'parent-workflow-id',
      blockStates: new Map(),
      blockLogs: [],
      metadata: { duration: 0 },
      environmentVariables: {},
      decisions: { router: new Map(), condition: new Map() },
      loopExecutions: new Map(),
      executedBlocks: new Set(),
      activeExecutionPath: new Set(),
      completedLoops: new Set(),
      workflow: {
        version: '1.0',
        blocks: [],
        connections: [],
        loops: {},
      },
    }

    // Reset all mocks
    vi.clearAllMocks()

    // Setup default fetch mock
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            name: 'Child Workflow',
            state: {
              blocks: [
                {
                  id: 'starter',
                  metadata: { id: BlockType.STARTER, name: 'Starter' },
                  position: { x: 0, y: 0 },
                  config: { tool: BlockType.STARTER, params: {} },
                  inputs: {},
                  outputs: {},
                  enabled: true,
                },
              ],
              edges: [],
              loops: {},
              parallels: {},
            },
          },
        }),
    })
  })

  describe('canHandle', () => {
    it('should handle workflow blocks', () => {
      expect(handler.canHandle(mockBlock)).toBe(true)
    })

    it('should not handle non-workflow blocks', () => {
      const nonWorkflowBlock = { ...mockBlock, metadata: { id: BlockType.FUNCTION } }
      expect(handler.canHandle(nonWorkflowBlock)).toBe(false)
    })
  })

  describe('execute', () => {
    it('should throw error when no workflowId is provided', async () => {
      const inputs = {}

      await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
        'No workflow selected for execution'
      )
    })

    it('should enforce maximum depth limit', async () => {
      const inputs = { workflowId: 'child-workflow-id' }

      // Create a deeply nested context (simulate 11 levels deep to exceed the limit of 10)
      const deepContext = {
        ...mockContext,
        workflowId:
          'level1_sub_level2_sub_level3_sub_level4_sub_level5_sub_level6_sub_level7_sub_level8_sub_level9_sub_level10_sub_level11',
      }

      await expect(handler.execute(deepContext, mockBlock, inputs)).rejects.toThrow(
        'Error in child workflow "child-workflow-id": Maximum workflow nesting depth of 10 exceeded'
      )
    })

    it('should handle child workflow not found', async () => {
      const inputs = { workflowId: 'non-existent-workflow' }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
        'Error in child workflow "non-existent-workflow": Child workflow non-existent-workflow not found'
      )
    })

    it('should handle fetch errors gracefully', async () => {
      const inputs = { workflowId: 'child-workflow-id' }

      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
        'Error in child workflow "child-workflow-id": Network error'
      )
    })
  })

  describe('loadChildWorkflow', () => {
    it('should return null for 404 responses', async () => {
      const workflowId = 'non-existent-workflow'

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      const result = await (handler as any).loadChildWorkflow(workflowId)

      expect(result).toBeNull()
    })

    it('should handle invalid workflow state', async () => {
      const workflowId = 'invalid-workflow'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              name: 'Invalid Workflow',
              state: null, // Invalid state
            },
          }),
      })

      await expect((handler as any).loadChildWorkflow(workflowId)).rejects.toThrow(
        'Child workflow invalid-workflow has invalid state'
      )
    })
  })

  describe('mapChildOutputToParent', () => {
    it('should map successful child output correctly', () => {
      const childResult = {
        success: true,
        output: { data: 'test result' },
      }

      const result = (handler as any).mapChildOutputToParent(
        childResult,
        'child-id',
        'Child Workflow',
        100
      )

      expect(result).toEqual({
        success: true,
        childWorkflowName: 'Child Workflow',
        result: { data: 'test result' },
        childTraceSpans: [],
      })
    })

    it('should map failed child output correctly', () => {
      const childResult = {
        success: false,
        error: 'Child workflow failed',
      }

      const result = (handler as any).mapChildOutputToParent(
        childResult,
        'child-id',
        'Child Workflow',
        100
      )

      expect(result).toEqual({
        success: false,
        childWorkflowName: 'Child Workflow',
        result: {},
        error: 'Child workflow failed',
        childTraceSpans: [],
      })
    })

    it('should handle nested response structures', () => {
      const childResult = {
        output: { nested: 'data' },
      }

      const result = (handler as any).mapChildOutputToParent(
        childResult,
        'child-id',
        'Child Workflow',
        100
      )

      expect(result).toEqual({
        success: true,
        childWorkflowName: 'Child Workflow',
        result: { nested: 'data' },
        childTraceSpans: [],
      })
    })
  })
})
```

--------------------------------------------------------------------------------

````
