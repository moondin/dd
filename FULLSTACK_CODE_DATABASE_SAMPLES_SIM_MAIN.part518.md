---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 518
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 518 of 933)

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

---[FILE: evaluator-handler.test.ts]---
Location: sim-main/apps/sim/executor/handlers/evaluator/evaluator-handler.test.ts

```typescript
import '@/executor/__test-utils__/mock-dependencies'

import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { BlockType } from '@/executor/constants'
import { EvaluatorBlockHandler } from '@/executor/handlers/evaluator/evaluator-handler'
import type { ExecutionContext } from '@/executor/types'
import { getProviderFromModel } from '@/providers/utils'
import type { SerializedBlock } from '@/serializer/types'

const mockGetProviderFromModel = getProviderFromModel as Mock
const mockFetch = global.fetch as unknown as Mock

describe('EvaluatorBlockHandler', () => {
  let handler: EvaluatorBlockHandler
  let mockBlock: SerializedBlock
  let mockContext: ExecutionContext

  beforeEach(() => {
    handler = new EvaluatorBlockHandler()

    mockBlock = {
      id: 'eval-block-1',
      metadata: { id: BlockType.EVALUATOR, name: 'Test Evaluator' },
      position: { x: 20, y: 20 },
      config: { tool: BlockType.EVALUATOR, params: {} },
      inputs: {
        content: 'string',
        metrics: 'json',
        model: 'string',
        temperature: 'number',
      }, // Using ParamType strings
      outputs: {},
      enabled: true,
    }

    mockContext = {
      workflowId: 'test-workflow-id',
      blockStates: new Map(),
      blockLogs: [],
      metadata: { duration: 0 },
      environmentVariables: {},
      decisions: { router: new Map(), condition: new Map() },
      loopExecutions: new Map(),
      completedLoops: new Set(),
      executedBlocks: new Set(),
      activeExecutionPath: new Set(),
    }

    // Reset mocks using vi
    vi.clearAllMocks()

    // Default mock implementations
    mockGetProviderFromModel.mockReturnValue('openai')

    // Set up fetch mock to return a successful response
    mockFetch.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            content: JSON.stringify({ score1: 5, score2: 8 }),
            model: 'mock-model',
            tokens: { prompt: 50, completion: 10, total: 60 },
            cost: 0.002,
            timing: { total: 200 },
          }),
      })
    })
  })

  it('should handle evaluator blocks', () => {
    expect(handler.canHandle(mockBlock)).toBe(true)
    const nonEvalBlock: SerializedBlock = { ...mockBlock, metadata: { id: 'other' } }
    expect(handler.canHandle(nonEvalBlock)).toBe(false)
  })

  it('should execute evaluator block correctly with basic inputs', async () => {
    const inputs = {
      content: 'This is the content to evaluate.',
      metrics: [
        { name: 'score1', description: 'First score', range: { min: 0, max: 10 } },
        { name: 'score2', description: 'Second score', range: { min: 0, max: 10 } },
      ],
      model: 'gpt-4o',
      temperature: 0.1,
    }

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect(mockGetProviderFromModel).toHaveBeenCalledWith('gpt-4o')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: expect.any(Object),
        body: expect.any(String),
      })
    )

    // Verify the request body contains the expected data
    const fetchCallArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(fetchCallArgs[1].body)
    expect(requestBody).toMatchObject({
      provider: 'openai',
      model: 'gpt-4o',
      systemPrompt: expect.stringContaining(inputs.content),
      responseFormat: expect.objectContaining({
        schema: {
          type: 'object',
          properties: {
            score1: { type: 'number' },
            score2: { type: 'number' },
          },
          required: ['score1', 'score2'],
          additionalProperties: false,
        },
      }),
      temperature: 0.1,
    })

    expect(result).toEqual({
      content: 'This is the content to evaluate.',
      model: 'mock-model',
      tokens: { prompt: 50, completion: 10, total: 60 },
      cost: {
        input: 0,
        output: 0,
        total: 0,
      },
      score1: 5,
      score2: 8,
    })
  })

  it('should process JSON string content correctly', async () => {
    const contentObj = { text: 'Evaluate this JSON.', value: 42 }
    const inputs = {
      content: JSON.stringify(contentObj),
      metrics: [{ name: 'clarity', description: 'Clarity score', range: { min: 1, max: 5 } }],
    }

    mockFetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            content: JSON.stringify({ clarity: 4 }),
            model: 'm',
            tokens: {},
            cost: 0,
            timing: {},
          }),
      })
    })

    await handler.execute(mockContext, mockBlock, inputs)

    const fetchCallArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(fetchCallArgs[1].body)
    expect(requestBody).toMatchObject({
      systemPrompt: expect.stringContaining(JSON.stringify(contentObj, null, 2)),
    })
  })

  it('should process object content correctly', async () => {
    const contentObj = { data: [1, 2, 3], status: 'ok' }
    const inputs = {
      content: contentObj,
      metrics: [
        { name: 'completeness', description: 'Data completeness', range: { min: 0, max: 1 } },
      ],
    }

    mockFetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            content: JSON.stringify({ completeness: 1 }),
            model: 'm',
            tokens: {},
            cost: 0,
            timing: {},
          }),
      })
    })

    await handler.execute(mockContext, mockBlock, inputs)

    const fetchCallArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(fetchCallArgs[1].body)
    expect(requestBody).toMatchObject({
      systemPrompt: expect.stringContaining(JSON.stringify(contentObj, null, 2)),
    })
  })

  it('should parse valid JSON response correctly', async () => {
    const inputs = {
      content: 'Test content',
      metrics: [{ name: 'quality', description: 'Quality score', range: { min: 1, max: 10 } }],
    }

    mockFetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            content: '```json\n{ "quality": 9 }\n```',
            model: 'm',
            tokens: {},
            cost: 0,
            timing: {},
          }),
      })
    })

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect((result as any).quality).toBe(9)
  })

  it('should handle invalid/non-JSON response gracefully (scores = 0)', async () => {
    const inputs = {
      content: 'Test content',
      metrics: [{ name: 'score', description: 'Score', range: { min: 0, max: 5 } }],
    }

    mockFetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            content: 'Sorry, I cannot provide a score.',
            model: 'm',
            tokens: {},
            cost: 0,
            timing: {},
          }),
      })
    })

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect((result as any).score).toBe(0)
  })

  it('should handle partially valid JSON response (extracts what it can)', async () => {
    const inputs = {
      content: 'Test content',
      metrics: [
        { name: 'accuracy', description: 'Acc', range: { min: 0, max: 1 } },
        { name: 'fluency', description: 'Flu', range: { min: 0, max: 1 } },
      ],
    }

    mockFetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            content: '{ "accuracy": 1, "fluency": invalid }',
            model: 'm',
            tokens: {},
            cost: 0,
            timing: {},
          }),
      })
    })

    const result = await handler.execute(mockContext, mockBlock, inputs)
    expect((result as any).accuracy).toBe(0)
    expect((result as any).fluency).toBe(0)
  })

  it('should extract metric scores ignoring case', async () => {
    const inputs = {
      content: 'Test',
      metrics: [{ name: 'CamelCaseScore', description: 'Desc', range: { min: 0, max: 10 } }],
    }

    mockFetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            content: JSON.stringify({ camelcasescore: 7 }),
            model: 'm',
            tokens: {},
            cost: 0,
            timing: {},
          }),
      })
    })

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect((result as any).camelcasescore).toBe(7)
  })

  it('should handle missing metrics in response (score = 0)', async () => {
    const inputs = {
      content: 'Test',
      metrics: [
        { name: 'presentScore', description: 'Desc1', range: { min: 0, max: 5 } },
        { name: 'missingScore', description: 'Desc2', range: { min: 0, max: 5 } },
      ],
    }

    mockFetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            content: JSON.stringify({ presentScore: 4 }),
            model: 'm',
            tokens: {},
            cost: 0,
            timing: {},
          }),
      })
    })

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect((result as any).presentscore).toBe(4)
    expect((result as any).missingscore).toBe(0)
  })

  it('should handle server error responses', async () => {
    const inputs = { content: 'Test error handling.' }

    // Override fetch mock to return an error
    mockFetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      })
    })

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow('Server error')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: evaluator-handler.ts]---
Location: sim-main/apps/sim/executor/handlers/evaluator/evaluator-handler.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { BlockOutput } from '@/blocks/types'
import { BlockType, DEFAULTS, EVALUATOR, HTTP } from '@/executor/constants'
import type { BlockHandler, ExecutionContext } from '@/executor/types'
import { buildAPIUrl, extractAPIErrorMessage } from '@/executor/utils/http'
import { isJSONString, parseJSON, stringifyJSON } from '@/executor/utils/json'
import { calculateCost, getProviderFromModel } from '@/providers/utils'
import type { SerializedBlock } from '@/serializer/types'

const logger = createLogger('EvaluatorBlockHandler')

/**
 * Handler for Evaluator blocks that assess content against criteria.
 */
export class EvaluatorBlockHandler implements BlockHandler {
  canHandle(block: SerializedBlock): boolean {
    return block.metadata?.id === BlockType.EVALUATOR
  }

  async execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<BlockOutput> {
    const evaluatorConfig = {
      model: inputs.model || EVALUATOR.DEFAULT_MODEL,
      apiKey: inputs.apiKey,
    }
    const providerId = getProviderFromModel(evaluatorConfig.model)

    const processedContent = this.processContent(inputs.content)

    let systemPromptObj: { systemPrompt: string; responseFormat: any } = {
      systemPrompt: '',
      responseFormat: null,
    }

    logger.info('Inputs for evaluator:', inputs)
    let metrics: any[]
    if (Array.isArray(inputs.metrics)) {
      metrics = inputs.metrics
    } else {
      metrics = []
    }
    logger.info('Metrics for evaluator:', metrics)
    const metricDescriptions = metrics
      .filter((m: any) => m?.name && m.range)
      .map((m: any) => `"${m.name}" (${m.range.min}-${m.range.max}): ${m.description || ''}`)
      .join('\n')

    const responseProperties: Record<string, any> = {}
    metrics.forEach((m: any) => {
      if (m?.name) {
        responseProperties[m.name.toLowerCase()] = { type: 'number' }
      } else {
        logger.warn('Skipping invalid metric entry during response format generation:', m)
      }
    })

    systemPromptObj = {
      systemPrompt: `You are an evaluation agent. Analyze this content against the metrics and provide scores.
      
    Metrics:
    ${metricDescriptions}

    Content:
    ${processedContent}

    Return a JSON object with each metric name as a key and a numeric score as the value. No explanations, only scores.`,
      responseFormat: {
        name: EVALUATOR.RESPONSE_SCHEMA_NAME,
        schema: {
          type: 'object',
          properties: responseProperties,
          required: metrics.filter((m: any) => m?.name).map((m: any) => m.name.toLowerCase()),
          additionalProperties: false,
        },
        strict: true,
      },
    }

    if (!systemPromptObj.systemPrompt) {
      systemPromptObj.systemPrompt =
        'Evaluate the content and provide scores for each metric as JSON.'
    }

    try {
      const url = buildAPIUrl('/api/providers')

      const providerRequest = {
        provider: providerId,
        model: evaluatorConfig.model,
        systemPrompt: systemPromptObj.systemPrompt,
        responseFormat: systemPromptObj.responseFormat,
        context: stringifyJSON([
          {
            role: 'user',
            content:
              'Please evaluate the content provided in the system prompt. Return ONLY a valid JSON with metric scores.',
          },
        ]),

        temperature: EVALUATOR.DEFAULT_TEMPERATURE,
        apiKey: evaluatorConfig.apiKey,
        workflowId: ctx.workflowId,
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': HTTP.CONTENT_TYPE.JSON,
        },
        body: stringifyJSON(providerRequest),
      })

      if (!response.ok) {
        const errorMessage = await extractAPIErrorMessage(response)
        throw new Error(errorMessage)
      }

      const result = await response.json()

      const parsedContent = this.extractJSONFromResponse(result.content)

      const metricScores = this.extractMetricScores(parsedContent, inputs.metrics)

      const costCalculation = calculateCost(
        result.model,
        result.tokens?.prompt || DEFAULTS.TOKENS.PROMPT,
        result.tokens?.completion || DEFAULTS.TOKENS.COMPLETION,
        false
      )

      return {
        content: inputs.content,
        model: result.model,
        tokens: {
          prompt: result.tokens?.prompt || DEFAULTS.TOKENS.PROMPT,
          completion: result.tokens?.completion || DEFAULTS.TOKENS.COMPLETION,
          total: result.tokens?.total || DEFAULTS.TOKENS.TOTAL,
        },
        cost: {
          input: costCalculation.input,
          output: costCalculation.output,
          total: costCalculation.total,
        },
        ...metricScores,
      }
    } catch (error) {
      logger.error('Evaluator execution failed:', error)
      throw error
    }
  }

  private processContent(content: any): string {
    if (typeof content === 'string') {
      if (isJSONString(content)) {
        const parsed = parseJSON(content, null)
        if (parsed) {
          return stringifyJSON(parsed)
        }
        return content
      }
      return content
    }

    if (typeof content === 'object') {
      return stringifyJSON(content)
    }

    return String(content || '')
  }

  private extractJSONFromResponse(responseContent: string): Record<string, any> {
    try {
      const contentStr = responseContent.trim()

      const fullMatch = contentStr.match(/(\{[\s\S]*\})/)
      if (fullMatch) {
        return parseJSON(fullMatch[0], {})
      }

      if (contentStr.includes('{') && contentStr.includes('}')) {
        const startIdx = contentStr.indexOf('{')
        const endIdx = contentStr.lastIndexOf('}') + 1
        const jsonStr = contentStr.substring(startIdx, endIdx)
        return parseJSON(jsonStr, {})
      }

      return parseJSON(contentStr, {})
    } catch (error) {
      logger.error('Error parsing evaluator response:', error)
      logger.error('Raw response content:', responseContent)
      return {}
    }
  }

  private extractMetricScores(
    parsedContent: Record<string, any>,
    metrics: any
  ): Record<string, number> {
    const metricScores: Record<string, number> = {}
    let validMetrics: any[]
    if (Array.isArray(metrics)) {
      validMetrics = metrics
    } else {
      validMetrics = []
    }

    if (Object.keys(parsedContent).length === 0) {
      validMetrics.forEach((metric: any) => {
        if (metric?.name) {
          metricScores[metric.name.toLowerCase()] = DEFAULTS.EXECUTION_TIME
        }
      })
      return metricScores
    }

    validMetrics.forEach((metric: any) => {
      if (!metric?.name) {
        logger.warn('Skipping invalid metric entry:', metric)
        return
      }

      const score = this.findMetricScore(parsedContent, metric.name)
      metricScores[metric.name.toLowerCase()] = score
    })

    return metricScores
  }

  private findMetricScore(parsedContent: Record<string, any>, metricName: string): number {
    const lowerMetricName = metricName.toLowerCase()

    if (parsedContent[metricName] !== undefined) {
      return Number(parsedContent[metricName])
    }

    if (parsedContent[lowerMetricName] !== undefined) {
      return Number(parsedContent[lowerMetricName])
    }

    const matchingKey = Object.keys(parsedContent).find((key) => {
      return typeof key === 'string' && key.toLowerCase() === lowerMetricName
    })

    if (matchingKey) {
      return Number(parsedContent[matchingKey])
    }

    logger.warn(`Metric "${metricName}" not found in LLM response`)
    return DEFAULTS.EXECUTION_TIME
  }
}
```

--------------------------------------------------------------------------------

---[FILE: function-handler.test.ts]---
Location: sim-main/apps/sim/executor/handlers/function/function-handler.test.ts

```typescript
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { DEFAULT_EXECUTION_TIMEOUT_MS } from '@/lib/execution/constants'
import { BlockType } from '@/executor/constants'
import { FunctionBlockHandler } from '@/executor/handlers/function/function-handler'
import type { ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'
import { executeTool } from '@/tools'

vi.mock('@/lib/logs/console/logger', () => ({
  createLogger: vi.fn(() => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  })),
}))

vi.mock('@/tools', () => ({
  executeTool: vi.fn(),
}))

const mockExecuteTool = executeTool as Mock

describe('FunctionBlockHandler', () => {
  let handler: FunctionBlockHandler
  let mockBlock: SerializedBlock
  let mockContext: ExecutionContext

  beforeEach(() => {
    handler = new FunctionBlockHandler()

    mockBlock = {
      id: 'func-block-1',
      metadata: { id: BlockType.FUNCTION, name: 'Test Function' },
      position: { x: 30, y: 30 },
      config: { tool: BlockType.FUNCTION, params: {} },
      inputs: { code: 'string', timeout: 'number' }, // Using ParamType strings
      outputs: {},
      enabled: true,
    }

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

    // Reset mocks using vi
    vi.clearAllMocks()

    // Default mock implementation for executeTool
    mockExecuteTool.mockResolvedValue({ success: true, output: { result: 'Success' } })
  })

  it('should handle function blocks', () => {
    expect(handler.canHandle(mockBlock)).toBe(true)
    const nonFuncBlock: SerializedBlock = { ...mockBlock, metadata: { id: 'other' } }
    expect(handler.canHandle(nonFuncBlock)).toBe(false)
  })

  it('should execute function block with string code', async () => {
    const inputs = {
      code: 'console.log("Hello"); return 1 + 1;',
      timeout: 10000,
      envVars: {},
      isCustomTool: false,
      workflowId: undefined,
    }
    const expectedToolParams = {
      code: inputs.code,
      language: 'javascript',
      timeout: inputs.timeout,
      envVars: {},
      workflowVariables: {},
      blockData: {},
      blockNameMapping: {},
      _context: { workflowId: mockContext.workflowId, workspaceId: mockContext.workspaceId },
    }
    const expectedOutput: any = { result: 'Success' }

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect(mockExecuteTool).toHaveBeenCalledWith(
      'function_execute',
      expectedToolParams,
      false, // skipProxy
      false, // skipPostProcess
      mockContext // execution context
    )
    expect(result).toEqual(expectedOutput)
  })

  it('should execute function block with array code', async () => {
    const inputs = {
      code: [{ content: 'const x = 5;' }, { content: 'return x * 2;' }],
      timeout: 5000,
      envVars: {},
      isCustomTool: false,
      workflowId: undefined,
    }
    const expectedCode = 'const x = 5;\nreturn x * 2;'
    const expectedToolParams = {
      code: expectedCode,
      language: 'javascript',
      timeout: inputs.timeout,
      envVars: {},
      workflowVariables: {},
      blockData: {},
      blockNameMapping: {},
      _context: { workflowId: mockContext.workflowId, workspaceId: mockContext.workspaceId },
    }
    const expectedOutput: any = { result: 'Success' }

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect(mockExecuteTool).toHaveBeenCalledWith(
      'function_execute',
      expectedToolParams,
      false, // skipProxy
      false, // skipPostProcess
      mockContext // execution context
    )
    expect(result).toEqual(expectedOutput)
  })

  it('should use default timeout if not provided', async () => {
    const inputs = { code: 'return true;' }
    const expectedToolParams = {
      code: inputs.code,
      language: 'javascript',
      timeout: DEFAULT_EXECUTION_TIMEOUT_MS,
      envVars: {},
      workflowVariables: {},
      blockData: {},
      blockNameMapping: {},
      _context: { workflowId: mockContext.workflowId, workspaceId: mockContext.workspaceId },
    }

    await handler.execute(mockContext, mockBlock, inputs)

    expect(mockExecuteTool).toHaveBeenCalledWith(
      'function_execute',
      expectedToolParams,
      false, // skipProxy
      false, // skipPostProcess
      mockContext // execution context
    )
  })

  it('should handle execution errors from the tool', async () => {
    const inputs = { code: 'throw new Error("Code failed");' }
    const errorResult = { success: false, error: 'Function execution failed: Code failed' }
    mockExecuteTool.mockResolvedValue(errorResult)

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      'Function execution failed: Code failed'
    )
    expect(mockExecuteTool).toHaveBeenCalled()
  })

  it('should handle tool error with no specific message', async () => {
    const inputs = { code: 'some code' }
    const errorResult = { success: false }
    mockExecuteTool.mockResolvedValue(errorResult)

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      'Function execution failed'
    )
  })
})
```

--------------------------------------------------------------------------------

---[FILE: function-handler.ts]---
Location: sim-main/apps/sim/executor/handlers/function/function-handler.ts

```typescript
import { DEFAULT_EXECUTION_TIMEOUT_MS } from '@/lib/execution/constants'
import { DEFAULT_CODE_LANGUAGE } from '@/lib/execution/languages'
import { BlockType } from '@/executor/constants'
import type { BlockHandler, ExecutionContext } from '@/executor/types'
import { collectBlockData } from '@/executor/utils/block-data'
import type { SerializedBlock } from '@/serializer/types'
import { executeTool } from '@/tools'

/**
 * Handler for Function blocks that execute custom code.
 */
export class FunctionBlockHandler implements BlockHandler {
  canHandle(block: SerializedBlock): boolean {
    return block.metadata?.id === BlockType.FUNCTION
  }

  async execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<any> {
    const codeContent = Array.isArray(inputs.code)
      ? inputs.code.map((c: { content: string }) => c.content).join('\n')
      : inputs.code

    const { blockData, blockNameMapping } = collectBlockData(ctx)

    const result = await executeTool(
      'function_execute',
      {
        code: codeContent,
        language: inputs.language || DEFAULT_CODE_LANGUAGE,
        timeout: inputs.timeout || DEFAULT_EXECUTION_TIMEOUT_MS,
        envVars: ctx.environmentVariables || {},
        workflowVariables: ctx.workflowVariables || {},
        blockData,
        blockNameMapping,
        _context: {
          workflowId: ctx.workflowId,
          workspaceId: ctx.workspaceId,
        },
      },
      false,
      false,
      ctx
    )

    if (!result.success) {
      throw new Error(result.error || 'Function execution failed')
    }

    return result.output
  }
}
```

--------------------------------------------------------------------------------

---[FILE: generic-handler.test.ts]---
Location: sim-main/apps/sim/executor/handlers/generic/generic-handler.test.ts

```typescript
import '@/executor/__test-utils__/mock-dependencies'

import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { BlockType } from '@/executor/constants'
import { GenericBlockHandler } from '@/executor/handlers/generic/generic-handler'
import type { ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'
import { executeTool } from '@/tools'
import type { ToolConfig } from '@/tools/types'
import { getTool } from '@/tools/utils'

const mockGetTool = vi.mocked(getTool)
const mockExecuteTool = executeTool as Mock

describe('GenericBlockHandler', () => {
  let handler: GenericBlockHandler
  let mockBlock: SerializedBlock
  let mockContext: ExecutionContext
  let mockTool: ToolConfig

  beforeEach(() => {
    handler = new GenericBlockHandler()

    mockBlock = {
      id: 'generic-block-1',
      metadata: { id: 'custom-type', name: 'Test Generic Block' },
      position: { x: 40, y: 40 },
      config: { tool: 'some_custom_tool', params: { param1: 'value1' } },
      inputs: { param1: 'string' }, // Using ParamType strings
      outputs: {},
      enabled: true,
    }

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

    mockTool = {
      id: 'some_custom_tool',
      name: 'Some Custom Tool',
      description: 'Does something custom',
      version: '1.0',
      params: { param1: { type: 'string' } },
      request: {
        url: 'https://example.com/api',
        method: 'POST',
        headers: () => ({ 'Content-Type': 'application/json' }),
        body: (params) => params,
      },
    }

    // Reset mocks using vi
    vi.clearAllMocks()

    // Set up mockGetTool to return mockTool
    mockGetTool.mockImplementation((toolId) => {
      if (toolId === 'some_custom_tool') {
        return mockTool
      }
      return undefined
    })

    // Default mock implementations
    mockExecuteTool.mockResolvedValue({ success: true, output: { customResult: 'OK' } })
  })

  it.concurrent('should always handle any block type', () => {
    const agentBlock: SerializedBlock = { ...mockBlock, metadata: { id: BlockType.AGENT } }
    expect(handler.canHandle(agentBlock)).toBe(true)
    expect(handler.canHandle(mockBlock)).toBe(true)
    const noMetaIdBlock: SerializedBlock = { ...mockBlock, metadata: undefined }
    expect(handler.canHandle(noMetaIdBlock)).toBe(true)
  })

  it.concurrent('should execute generic block by calling its associated tool', async () => {
    const inputs = { param1: 'resolvedValue1' }
    const expectedToolParams = {
      ...inputs,
      _context: { workflowId: mockContext.workflowId },
    }
    const expectedOutput: any = { customResult: 'OK' }

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect(mockGetTool).toHaveBeenCalledWith('some_custom_tool')
    expect(mockExecuteTool).toHaveBeenCalledWith(
      'some_custom_tool',
      expectedToolParams,
      false, // skipProxy
      false, // skipPostProcess
      mockContext // execution context
    )
    expect(result).toEqual(expectedOutput)
  })

  it('should throw error if the associated tool is not found', async () => {
    const inputs = { param1: 'value' }

    // Override mock to return undefined for this test
    mockGetTool.mockImplementation(() => undefined)

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      'Tool not found: some_custom_tool'
    )
    expect(mockExecuteTool).not.toHaveBeenCalled()
  })

  it('should handle tool execution errors correctly', async () => {
    const inputs = { param1: 'value' }
    const errorResult = {
      success: false,
      error: 'Custom tool failed',
      output: { detail: 'error detail' },
    }
    mockExecuteTool.mockResolvedValue(errorResult)

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      'Custom tool failed'
    )

    // Re-execute to check error properties after catching
    try {
      await handler.execute(mockContext, mockBlock, inputs)
    } catch (e: any) {
      expect(e.toolId).toBe('some_custom_tool')
      expect(e.blockName).toBe('Test Generic Block')
      expect(e.output).toEqual({ detail: 'error detail' })
    }

    expect(mockExecuteTool).toHaveBeenCalledTimes(2) // Called twice now
  })

  it.concurrent('should handle tool execution errors with no specific message', async () => {
    const inputs = { param1: 'value' }
    const errorResult = { success: false, output: {} }
    mockExecuteTool.mockResolvedValue(errorResult)

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      'Block execution of Some Custom Tool failed with no error message'
    )
  })

  describe('Knowledge block cost tracking', () => {
    beforeEach(() => {
      // Set up knowledge block mock
      mockBlock = {
        ...mockBlock,
        config: { tool: 'knowledge_search', params: {} },
      }

      mockTool = {
        ...mockTool,
        id: 'knowledge_search',
        name: 'Knowledge Search',
      }

      mockGetTool.mockImplementation((toolId) => {
        if (toolId === 'knowledge_search') {
          return mockTool
        }
        return undefined
      })
    })

    it.concurrent(
      'should extract and restructure cost information from knowledge tools',
      async () => {
        const inputs = { query: 'test query' }
        const mockToolResponse = {
          success: true,
          output: {
            results: [],
            query: 'test query',
            totalResults: 0,
            cost: {
              input: 0.00001042,
              output: 0,
              total: 0.00001042,
              tokens: {
                prompt: 521,
                completion: 0,
                total: 521,
              },
              model: 'text-embedding-3-small',
              pricing: {
                input: 0.02,
                output: 0,
                updatedAt: '2025-07-10',
              },
            },
          },
        }

        mockExecuteTool.mockResolvedValue(mockToolResponse)

        const result = await handler.execute(mockContext, mockBlock, inputs)

        // Verify cost information is restructured correctly for enhanced logging
        expect(result).toEqual({
          results: [],
          query: 'test query',
          totalResults: 0,
          cost: {
            input: 0.00001042,
            output: 0,
            total: 0.00001042,
          },
          tokens: {
            prompt: 521,
            completion: 0,
            total: 521,
          },
          model: 'text-embedding-3-small',
        })
      }
    )

    it.concurrent('should handle knowledge_upload_chunk cost information', async () => {
      // Update to upload_chunk tool
      mockBlock.config.tool = 'knowledge_upload_chunk'
      mockTool.id = 'knowledge_upload_chunk'
      mockTool.name = 'Knowledge Upload Chunk'

      mockGetTool.mockImplementation((toolId) => {
        if (toolId === 'knowledge_upload_chunk') {
          return mockTool
        }
        return undefined
      })

      const inputs = { content: 'test content' }
      const mockToolResponse = {
        success: true,
        output: {
          data: {
            id: 'chunk-123',
            content: 'test content',
            chunkIndex: 0,
          },
          message: 'Successfully uploaded chunk',
          documentId: 'doc-123',
          cost: {
            input: 0.00000521,
            output: 0,
            total: 0.00000521,
            tokens: {
              prompt: 260,
              completion: 0,
              total: 260,
            },
            model: 'text-embedding-3-small',
            pricing: {
              input: 0.02,
              output: 0,
              updatedAt: '2025-07-10',
            },
          },
        },
      }

      mockExecuteTool.mockResolvedValue(mockToolResponse)

      const result = await handler.execute(mockContext, mockBlock, inputs)

      // Verify cost information is restructured correctly
      expect(result).toEqual({
        data: {
          id: 'chunk-123',
          content: 'test content',
          chunkIndex: 0,
        },
        message: 'Successfully uploaded chunk',
        documentId: 'doc-123',
        cost: {
          input: 0.00000521,
          output: 0,
          total: 0.00000521,
        },
        tokens: {
          prompt: 260,
          completion: 0,
          total: 260,
        },
        model: 'text-embedding-3-small',
      })
    })

    it('should pass through output unchanged for knowledge tools without cost info', async () => {
      const inputs = { query: 'test query' }
      const mockToolResponse = {
        success: true,
        output: {
          results: [],
          query: 'test query',
          totalResults: 0,
          // No cost information
        },
      }

      mockExecuteTool.mockResolvedValue(mockToolResponse)

      const result = await handler.execute(mockContext, mockBlock, inputs)

      // Should return original output without cost transformation
      expect(result).toEqual({
        results: [],
        query: 'test query',
        totalResults: 0,
      })
    })

    it.concurrent(
      'should process cost info for all tools (universal cost extraction)',
      async () => {
        mockBlock.config.tool = 'some_other_tool'
        mockTool.id = 'some_other_tool'

        mockGetTool.mockImplementation((toolId) => {
          if (toolId === 'some_other_tool') {
            return mockTool
          }
          return undefined
        })

        const inputs = { param: 'value' }
        const mockToolResponse = {
          success: true,
          output: {
            result: 'success',
            cost: {
              input: 0.001,
              output: 0.002,
              total: 0.003,
              tokens: { prompt: 100, completion: 50, total: 150 },
              model: 'some-model',
            },
          },
        }

        mockExecuteTool.mockResolvedValue(mockToolResponse)

        const result = await handler.execute(mockContext, mockBlock, inputs)

        expect(result).toEqual({
          result: 'success',
          cost: {
            input: 0.001,
            output: 0.002,
            total: 0.003,
          },
          tokens: { prompt: 100, completion: 50, total: 150 },
          model: 'some-model',
        })
      }
    )
  })
})
```

--------------------------------------------------------------------------------

````
