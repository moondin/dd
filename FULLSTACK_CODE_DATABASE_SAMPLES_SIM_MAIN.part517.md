---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 517
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 517 of 933)

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

---[FILE: api-handler.test.ts]---
Location: sim-main/apps/sim/executor/handlers/api/api-handler.test.ts

```typescript
import '@/executor/__test-utils__/mock-dependencies'

import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { BlockType } from '@/executor/constants'
import { ApiBlockHandler } from '@/executor/handlers/api/api-handler'
import type { ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'
import { executeTool } from '@/tools'
import type { ToolConfig } from '@/tools/types'
import { getTool } from '@/tools/utils'

const mockGetTool = vi.mocked(getTool)
const mockExecuteTool = executeTool as Mock

describe('ApiBlockHandler', () => {
  let handler: ApiBlockHandler
  let mockBlock: SerializedBlock
  let mockContext: ExecutionContext
  let mockApiTool: ToolConfig

  beforeEach(() => {
    handler = new ApiBlockHandler()
    mockBlock = {
      id: 'api-block-1',
      metadata: { id: BlockType.API, name: 'Test API Block' },
      position: { x: 10, y: 10 },
      config: { tool: 'http_request', params: {} },
      inputs: {},
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
    mockApiTool = {
      id: 'http_request',
      name: 'HTTP Request Tool',
      description: 'Makes an HTTP request',
      version: '1.0',
      params: {
        url: { type: 'string', required: true },
        method: { type: 'string', default: 'GET' },
        headers: { type: 'object' },
        body: { type: 'any' },
      },
      request: {
        url: 'https://example.com/api',
        method: 'POST',
        headers: () => ({ 'Content-Type': 'application/json' }),
        body: (params) => params,
      },
    }

    // Reset mocks using vi
    vi.clearAllMocks()

    // Set up mockGetTool to return the mockApiTool
    mockGetTool.mockImplementation((toolId) => {
      if (toolId === 'http_request') {
        return mockApiTool
      }
      return undefined
    })

    // Default mock implementations
    mockExecuteTool.mockResolvedValue({ success: true, output: { data: 'Success' } })
  })

  it('should handle api blocks', () => {
    expect(handler.canHandle(mockBlock)).toBe(true)
    const nonApiBlock: SerializedBlock = {
      ...mockBlock,
      metadata: { id: 'other-block' },
    }
    expect(handler.canHandle(nonApiBlock)).toBe(false)
  })

  it('should execute api block correctly with valid inputs', async () => {
    const inputs = {
      url: 'https://example.com/api',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value' }),
    }

    const expectedOutput = { data: 'Success' }

    mockExecuteTool.mockResolvedValue({ success: true, output: { data: 'Success' } })

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect(mockGetTool).toHaveBeenCalledWith('http_request')
    expect(mockExecuteTool).toHaveBeenCalledWith(
      'http_request',
      {
        ...inputs,
        body: { key: 'value' }, // Expect parsed body
        _context: { workflowId: 'test-workflow-id' },
      },
      false, // skipProxy
      false, // skipPostProcess
      mockContext // execution context
    )
    expect(result).toEqual(expectedOutput)
  })

  it('should handle missing URL gracefully (empty success response)', async () => {
    const inputs = {
      url: '', // Empty URL
      method: 'GET',
    }

    const expectedOutput = { data: null, status: 200, headers: {} }

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect(mockGetTool).toHaveBeenCalledWith('http_request')
    expect(mockExecuteTool).not.toHaveBeenCalled()
    expect(result).toEqual(expectedOutput)
  })

  it('should throw error for invalid URL format (no protocol)', async () => {
    const inputs = { url: 'example.com/api' }

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      'Invalid URL: "example.com/api" - URL must include protocol (try "https://example.com/api")'
    )
    expect(mockExecuteTool).not.toHaveBeenCalled()
  })

  it('should throw error for generally invalid URL format', async () => {
    const inputs = { url: 'htp:/invalid-url' }

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      /^Invalid URL: "htp:\/invalid-url" - URL must include protocol/
    )
    expect(mockExecuteTool).not.toHaveBeenCalled()
  })

  it('should parse JSON string body correctly', async () => {
    const inputs = {
      url: 'https://example.com/api',
      body: '  { "key": "value", "nested": { "num": 1 } }  ', // With extra whitespace
    }
    const expectedParsedBody = { key: 'value', nested: { num: 1 } }

    await handler.execute(mockContext, mockBlock, inputs)

    expect(mockExecuteTool).toHaveBeenCalledWith(
      'http_request',
      expect.objectContaining({ body: expectedParsedBody }),
      false, // skipProxy
      false, // skipPostProcess
      mockContext // execution context
    )
  })

  it('should keep non-JSON string body as string', async () => {
    const inputs = {
      url: 'https://example.com/api',
      body: 'This is plain text',
    }

    await handler.execute(mockContext, mockBlock, inputs)

    expect(mockExecuteTool).toHaveBeenCalledWith(
      'http_request',
      expect.objectContaining({ body: 'This is plain text' }),
      false, // skipProxy
      false, // skipPostProcess
      mockContext // execution context
    )
  })

  it('should handle null body by converting to undefined', async () => {
    const inputs = {
      url: 'https://example.com/api',
      body: null,
    }

    await handler.execute(mockContext, mockBlock, inputs)

    expect(mockExecuteTool).toHaveBeenCalledWith(
      'http_request',
      expect.objectContaining({ body: undefined }),
      false, // skipProxy
      false, // skipPostProcess
      mockContext // execution context
    )
  })

  it('should handle API errors correctly and format message', async () => {
    const inputs = {
      url: 'https://example.com/notfound',
      method: 'GET',
    }
    const errorOutput = { status: 404, statusText: 'Not Found' }
    mockExecuteTool.mockResolvedValue({
      success: false,
      output: errorOutput,
      error: 'Resource not found',
    })

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      'HTTP Request failed: URL: https://example.com/notfound | Method: GET | Error: Resource not found | Status: 404 | Status text: Not Found - The requested resource was not found'
    )
    expect(mockExecuteTool).toHaveBeenCalled()
  })

  it('should throw error if tool is not found', async () => {
    const inputs = { url: 'https://example.com' }

    // Override mock to return undefined for this test
    mockGetTool.mockImplementation(() => undefined)

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      'Tool not found: http_request'
    )
    expect(mockExecuteTool).not.toHaveBeenCalled()
  })

  it('should handle CORS error suggestion', async () => {
    const inputs = { url: 'https://example.com/cors-issue' }
    mockExecuteTool.mockResolvedValue({
      success: false,
      error: 'Request failed due to CORS policy',
    })

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      /CORS policy prevented the request, try using a proxy or server-side request/
    )
  })

  it('should handle generic fetch error suggestion', async () => {
    const inputs = { url: 'https://unreachable.local' }
    mockExecuteTool.mockResolvedValue({ success: false, error: 'Failed to fetch' })

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      /Network error, check if the URL is accessible and if you have internet connectivity/
    )
  })
})
```

--------------------------------------------------------------------------------

---[FILE: api-handler.ts]---
Location: sim-main/apps/sim/executor/handlers/api/api-handler.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { BlockType, HTTP } from '@/executor/constants'
import type { BlockHandler, ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'
import { executeTool } from '@/tools'
import { getTool } from '@/tools/utils'

const logger = createLogger('ApiBlockHandler')

/**
 * Handler for API blocks that make external HTTP requests.
 */
export class ApiBlockHandler implements BlockHandler {
  canHandle(block: SerializedBlock): boolean {
    return block.metadata?.id === BlockType.API
  }

  async execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<any> {
    const tool = getTool(block.config.tool)
    if (!tool) {
      throw new Error(`Tool not found: ${block.config.tool}`)
    }

    if (tool.name?.includes('HTTP') && (!inputs.url || inputs.url.trim() === '')) {
      return { data: null, status: HTTP.STATUS.OK, headers: {} }
    }

    if (tool.name?.includes('HTTP') && inputs.url) {
      let urlToValidate = inputs.url
      if (typeof urlToValidate === 'string') {
        if (
          (urlToValidate.startsWith('"') && urlToValidate.endsWith('"')) ||
          (urlToValidate.startsWith("'") && urlToValidate.endsWith("'"))
        ) {
          urlToValidate = urlToValidate.slice(1, -1)
          inputs.url = urlToValidate
        }
      }

      if (!urlToValidate.match(/^https?:\/\//i)) {
        throw new Error(
          `Invalid URL: "${urlToValidate}" - URL must include protocol (try "https://${urlToValidate}")`
        )
      }

      try {
        new URL(urlToValidate)
      } catch (e: any) {
        throw new Error(`Invalid URL format: "${urlToValidate}" - ${e.message}`)
      }
    }

    try {
      const processedInputs = { ...inputs }

      if (processedInputs.body !== undefined) {
        if (typeof processedInputs.body === 'string') {
          try {
            const trimmedBody = processedInputs.body.trim()
            if (trimmedBody.startsWith('{') || trimmedBody.startsWith('[')) {
              processedInputs.body = JSON.parse(trimmedBody)
            }
          } catch (e) {}
        } else if (processedInputs.body === null) {
          processedInputs.body = undefined
        }
      }

      const result = await executeTool(
        block.config.tool,
        {
          ...processedInputs,
          _context: {
            workflowId: ctx.workflowId,
            workspaceId: ctx.workspaceId,
            executionId: ctx.executionId,
          },
        },
        false,
        false,
        ctx
      )

      if (!result.success) {
        const errorDetails = []

        if (inputs.url) errorDetails.push(`URL: ${inputs.url}`)
        if (inputs.method) errorDetails.push(`Method: ${inputs.method}`)

        if (result.error) errorDetails.push(`Error: ${result.error}`)
        if (result.output?.status) errorDetails.push(`Status: ${result.output.status}`)
        if (result.output?.statusText) errorDetails.push(`Status text: ${result.output.statusText}`)

        let suggestion = ''
        if (result.output?.status === HTTP.STATUS.FORBIDDEN) {
          suggestion = ' - This may be due to CORS restrictions or authorization issues'
        } else if (result.output?.status === HTTP.STATUS.NOT_FOUND) {
          suggestion = ' - The requested resource was not found'
        } else if (result.output?.status === HTTP.STATUS.TOO_MANY_REQUESTS) {
          suggestion = ' - Too many requests, you may need to implement rate limiting'
        } else if (result.output?.status >= HTTP.STATUS.SERVER_ERROR) {
          suggestion = ' - Server error, the target server is experiencing issues'
        } else if (result.error?.includes('CORS')) {
          suggestion =
            ' - CORS policy prevented the request, try using a proxy or server-side request'
        } else if (result.error?.includes('Failed to fetch')) {
          suggestion =
            ' - Network error, check if the URL is accessible and if you have internet connectivity'
        }

        const errorMessage =
          errorDetails.length > 0
            ? `HTTP Request failed: ${errorDetails.join(' | ')}${suggestion}`
            : `API request to ${tool.name || block.config.tool} failed with no error message`

        const error = new Error(errorMessage)

        Object.assign(error, {
          toolId: block.config.tool,
          toolName: tool.name || 'Unknown tool',
          blockId: block.id,
          blockName: block.metadata?.name || 'Unnamed Block',
          output: result.output || {},
          status: result.output?.status || null,
          request: {
            url: inputs.url,
            method: inputs.method || 'GET',
          },
          timestamp: new Date().toISOString(),
        })

        throw error
      }

      return result.output
    } catch (error: any) {
      if (!error.message || error.message === 'undefined (undefined)') {
        let errorMessage = `API request to ${tool.name || block.config.tool} failed`

        if (inputs.url) errorMessage += `: ${inputs.url}`
        if (error.status) errorMessage += ` (Status: ${error.status})`
        if (error.statusText) errorMessage += ` - ${error.statusText}`

        if (errorMessage === `API request to ${tool.name || block.config.tool} failed`) {
          errorMessage += ` - ${block.metadata?.name || 'Unknown error'}`
        }

        error.message = errorMessage
      }

      if (typeof error === 'object' && error !== null) {
        if (!error.toolId) error.toolId = block.config.tool
        if (!error.blockName) error.blockName = block.metadata?.name || 'Unnamed Block'

        if (inputs && !error.request) {
          error.request = {
            url: inputs.url,
            method: inputs.method || 'GET',
          }
        }
      }

      throw error
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: condition-handler.test.ts]---
Location: sim-main/apps/sim/executor/handlers/condition/condition-handler.test.ts

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BlockType } from '@/executor/constants'
import { ConditionBlockHandler } from '@/executor/handlers/condition/condition-handler'
import type { BlockState, ExecutionContext } from '@/executor/types'
import type { SerializedBlock, SerializedWorkflow } from '@/serializer/types'

vi.mock('@/lib/logs/console/logger', () => ({
  createLogger: vi.fn(() => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  })),
}))

vi.mock('@/lib/core/utils/request', () => ({
  generateRequestId: vi.fn(() => 'test-request-id'),
}))

vi.mock('@/lib/execution/isolated-vm', () => ({
  executeInIsolatedVM: vi.fn(),
}))

import { executeInIsolatedVM } from '@/lib/execution/isolated-vm'

const mockExecuteInIsolatedVM = executeInIsolatedVM as ReturnType<typeof vi.fn>

function simulateIsolatedVMExecution(
  code: string,
  contextVariables: Record<string, unknown>
): { result: unknown; stdout: string; error?: { message: string; name: string } } {
  try {
    const fn = new Function(...Object.keys(contextVariables), code)
    const result = fn(...Object.values(contextVariables))
    return { result, stdout: '' }
  } catch (error: any) {
    return {
      result: null,
      stdout: '',
      error: { message: error.message, name: error.name || 'Error' },
    }
  }
}

describe('ConditionBlockHandler', () => {
  let handler: ConditionBlockHandler
  let mockBlock: SerializedBlock
  let mockContext: ExecutionContext
  let mockWorkflow: Partial<SerializedWorkflow>
  let mockSourceBlock: SerializedBlock
  let mockTargetBlock1: SerializedBlock
  let mockTargetBlock2: SerializedBlock
  let mockResolver: any
  let mockPathTracker: any

  beforeEach(() => {
    mockSourceBlock = {
      id: 'source-block-1',
      metadata: { id: 'source', name: 'Source Block' },
      position: { x: 10, y: 10 },
      config: { tool: 'source_tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
    }
    mockBlock = {
      id: 'cond-block-1',
      metadata: { id: BlockType.CONDITION, name: 'Test Condition' },
      position: { x: 50, y: 50 },
      config: { tool: BlockType.CONDITION, params: {} },
      inputs: { conditions: 'json' },
      outputs: {},
      enabled: true,
    }
    mockTargetBlock1 = {
      id: 'target-block-1',
      metadata: { id: 'target', name: 'Target Block 1' },
      position: { x: 100, y: 100 },
      config: { tool: 'target_tool_1', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
    }
    mockTargetBlock2 = {
      id: 'target-block-2',
      metadata: { id: 'target', name: 'Target Block 2' },
      position: { x: 100, y: 150 },
      config: { tool: 'target_tool_2', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
    }

    mockWorkflow = {
      blocks: [mockSourceBlock, mockBlock, mockTargetBlock1, mockTargetBlock2],
      connections: [
        { source: mockSourceBlock.id, target: mockBlock.id },
        {
          source: mockBlock.id,
          target: mockTargetBlock1.id,
          sourceHandle: 'condition-cond1',
        },
        {
          source: mockBlock.id,
          target: mockTargetBlock2.id,
          sourceHandle: 'condition-else1',
        },
      ],
    }

    mockResolver = {
      resolveVariableReferences: vi.fn((expr) => expr),
      resolveBlockReferences: vi.fn((expr) => expr),
      resolveEnvVariables: vi.fn((expr) => expr),
    }

    mockPathTracker = {}

    handler = new ConditionBlockHandler(mockPathTracker, mockResolver)

    mockContext = {
      workflowId: 'test-workflow-id',
      blockStates: new Map<string, BlockState>([
        [
          mockSourceBlock.id,
          {
            output: { value: 10, text: 'hello' },
            executed: true,
            executionTime: 100,
          },
        ],
      ]),
      blockLogs: [],
      metadata: { duration: 0 },
      environmentVariables: {},
      decisions: { router: new Map(), condition: new Map() },
      loopExecutions: new Map(),
      executedBlocks: new Set([mockSourceBlock.id]),
      activeExecutionPath: new Set(),
      workflow: mockWorkflow as SerializedWorkflow,
      completedLoops: new Set(),
    }

    vi.clearAllMocks()

    mockExecuteInIsolatedVM.mockImplementation(async ({ code, contextVariables }) => {
      return simulateIsolatedVMExecution(code, contextVariables)
    })
  })

  it('should handle condition blocks', () => {
    expect(handler.canHandle(mockBlock)).toBe(true)
    const nonCondBlock: SerializedBlock = { ...mockBlock, metadata: { id: 'other' } }
    expect(handler.canHandle(nonCondBlock)).toBe(false)
  })

  it('should execute condition block correctly and select first path', async () => {
    const conditions = [
      { id: 'cond1', title: 'if', value: 'context.value > 5' },
      { id: 'else1', title: 'else', value: '' },
    ]
    const inputs = { conditions: JSON.stringify(conditions) }

    const expectedOutput = {
      value: 10,
      text: 'hello',
      conditionResult: true,
      selectedPath: {
        blockId: mockTargetBlock1.id,
        blockType: 'target',
        blockTitle: 'Target Block 1',
      },
      selectedOption: 'cond1',
    }

    mockResolver.resolveVariableReferences.mockReturnValue('context.value > 5')
    mockResolver.resolveBlockReferences.mockReturnValue('context.value > 5')
    mockResolver.resolveEnvVariables.mockReturnValue('context.value > 5')

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect(mockResolver.resolveVariableReferences).toHaveBeenCalledWith(
      'context.value > 5',
      mockBlock
    )
    expect(mockResolver.resolveBlockReferences).toHaveBeenCalledWith(
      'context.value > 5',
      mockContext,
      mockBlock
    )
    expect(mockResolver.resolveEnvVariables).toHaveBeenCalledWith('context.value > 5')
    expect(result).toEqual(expectedOutput)
    expect(mockContext.decisions.condition.get(mockBlock.id)).toBe('cond1')
  })

  it('should select the else path if other conditions fail', async () => {
    const conditions = [
      { id: 'cond1', title: 'if', value: 'context.value < 0' }, // Should fail (10 < 0 is false)
      { id: 'else1', title: 'else', value: '' }, // Should be selected
    ]
    const inputs = { conditions: JSON.stringify(conditions) }

    const expectedOutput = {
      value: 10,
      text: 'hello',
      conditionResult: true,
      selectedPath: {
        blockId: mockTargetBlock2.id,
        blockType: 'target',
        blockTitle: 'Target Block 2',
      },
      selectedOption: 'else1',
    }

    mockResolver.resolveVariableReferences.mockReturnValue('context.value < 0')
    mockResolver.resolveBlockReferences.mockReturnValue('context.value < 0')
    mockResolver.resolveEnvVariables.mockReturnValue('context.value < 0')

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect(mockResolver.resolveVariableReferences).toHaveBeenCalledWith(
      'context.value < 0',
      mockBlock
    )
    expect(mockResolver.resolveBlockReferences).toHaveBeenCalledWith(
      'context.value < 0',
      mockContext,
      mockBlock
    )
    expect(mockResolver.resolveEnvVariables).toHaveBeenCalledWith('context.value < 0')
    expect(result).toEqual(expectedOutput)
    expect(mockContext.decisions.condition.get(mockBlock.id)).toBe('else1')
  })

  it('should handle invalid conditions JSON format', async () => {
    const inputs = { conditions: '{ "invalid json ' }

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      /^Invalid conditions format:/
    )
  })

  it('should resolve references in conditions before evaluation', async () => {
    const conditions = [
      { id: 'cond1', title: 'if', value: '{{source-block-1.value}} > 5' },
      { id: 'else1', title: 'else', value: '' },
    ]
    const inputs = { conditions: JSON.stringify(conditions) }

    mockResolver.resolveVariableReferences.mockReturnValue('{{source-block-1.value}} > 5')
    mockResolver.resolveBlockReferences.mockReturnValue('10 > 5')
    mockResolver.resolveEnvVariables.mockReturnValue('10 > 5')

    await handler.execute(mockContext, mockBlock, inputs)

    expect(mockResolver.resolveVariableReferences).toHaveBeenCalledWith(
      '{{source-block-1.value}} > 5',
      mockBlock
    )
    expect(mockResolver.resolveBlockReferences).toHaveBeenCalledWith(
      '{{source-block-1.value}} > 5',
      mockContext,
      mockBlock
    )
    expect(mockResolver.resolveEnvVariables).toHaveBeenCalledWith('10 > 5')
    expect(mockContext.decisions.condition.get(mockBlock.id)).toBe('cond1')
  })

  it('should resolve variable references in conditions', async () => {
    const conditions = [
      { id: 'cond1', title: 'if', value: '<variable.userName> !== null' },
      { id: 'else1', title: 'else', value: '' },
    ]
    const inputs = { conditions: JSON.stringify(conditions) }

    mockResolver.resolveVariableReferences.mockReturnValue('"john" !== null')
    mockResolver.resolveBlockReferences.mockReturnValue('"john" !== null')
    mockResolver.resolveEnvVariables.mockReturnValue('"john" !== null')

    await handler.execute(mockContext, mockBlock, inputs)

    expect(mockResolver.resolveVariableReferences).toHaveBeenCalledWith(
      '<variable.userName> !== null',
      mockBlock
    )
    expect(mockResolver.resolveBlockReferences).toHaveBeenCalledWith(
      '"john" !== null',
      mockContext,
      mockBlock
    )
    expect(mockResolver.resolveEnvVariables).toHaveBeenCalledWith('"john" !== null')
    expect(mockContext.decisions.condition.get(mockBlock.id)).toBe('cond1')
  })

  it('should resolve environment variables in conditions', async () => {
    const conditions = [
      { id: 'cond1', title: 'if', value: '{{POOP}} === "hi"' },
      { id: 'else1', title: 'else', value: '' },
    ]
    const inputs = { conditions: JSON.stringify(conditions) }

    mockResolver.resolveVariableReferences.mockReturnValue('{{POOP}} === "hi"')
    mockResolver.resolveBlockReferences.mockReturnValue('{{POOP}} === "hi"')
    mockResolver.resolveEnvVariables.mockReturnValue('"hi" === "hi"')

    await handler.execute(mockContext, mockBlock, inputs)

    expect(mockResolver.resolveVariableReferences).toHaveBeenCalledWith(
      '{{POOP}} === "hi"',
      mockBlock
    )
    expect(mockResolver.resolveBlockReferences).toHaveBeenCalledWith(
      '{{POOP}} === "hi"',
      mockContext,
      mockBlock
    )
    expect(mockResolver.resolveEnvVariables).toHaveBeenCalledWith('{{POOP}} === "hi"')
    expect(mockContext.decisions.condition.get(mockBlock.id)).toBe('cond1')
  })

  it('should throw error if reference resolution fails', async () => {
    const conditions = [
      { id: 'cond1', title: 'if', value: '{{invalid-ref}}' },
      { id: 'else1', title: 'else', value: '' },
    ]
    const inputs = { conditions: JSON.stringify(conditions) }

    const resolutionError = new Error('Could not resolve reference: invalid-ref')
    mockResolver.resolveVariableReferences.mockImplementation(() => {
      throw resolutionError
    })

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      'Failed to resolve references in condition: Could not resolve reference: invalid-ref'
    )
  })

  it('should handle evaluation errors gracefully', async () => {
    const conditions = [
      { id: 'cond1', title: 'if', value: 'context.nonExistentProperty.doSomething()' },
      { id: 'else1', title: 'else', value: '' },
    ]
    const inputs = { conditions: JSON.stringify(conditions) }

    mockResolver.resolveVariableReferences.mockReturnValue(
      'context.nonExistentProperty.doSomething()'
    )
    mockResolver.resolveBlockReferences.mockReturnValue('context.nonExistentProperty.doSomething()')
    mockResolver.resolveEnvVariables.mockReturnValue('context.nonExistentProperty.doSomething()')

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      /Evaluation error in condition "if".*doSomething/
    )
  })

  it('should handle missing source block output gracefully', async () => {
    const conditions = [{ id: 'cond1', title: 'if', value: 'true' }]
    const inputs = { conditions: JSON.stringify(conditions) }

    const contextWithoutSource = {
      ...mockContext,
      blockStates: new Map<string, BlockState>(),
    }

    mockResolver.resolveVariableReferences.mockReturnValue('true')
    mockResolver.resolveBlockReferences.mockReturnValue('true')
    mockResolver.resolveEnvVariables.mockReturnValue('true')

    const result = await handler.execute(contextWithoutSource, mockBlock, inputs)

    expect(result).toHaveProperty('conditionResult', true)
    expect(result).toHaveProperty('selectedOption', 'cond1')
  })

  it('should throw error if target block is missing', async () => {
    const conditions = [{ id: 'cond1', title: 'if', value: 'true' }]
    const inputs = { conditions: JSON.stringify(conditions) }

    mockContext.workflow!.blocks = [mockSourceBlock, mockBlock, mockTargetBlock2]

    mockResolver.resolveVariableReferences.mockReturnValue('true')
    mockResolver.resolveBlockReferences.mockReturnValue('true')
    mockResolver.resolveEnvVariables.mockReturnValue('true')

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      `Target block ${mockTargetBlock1.id} not found`
    )
  })

  it('should return no-match result if no condition matches and no else exists', async () => {
    const conditions = [
      { id: 'cond1', title: 'if', value: 'false' },
      { id: 'cond2', title: 'else if', value: 'context.value === 99' },
    ]
    const inputs = { conditions: JSON.stringify(conditions) }

    mockContext.workflow!.connections = [
      { source: mockSourceBlock.id, target: mockBlock.id },
      {
        source: mockBlock.id,
        target: mockTargetBlock1.id,
        sourceHandle: 'condition-cond1',
      },
    ]

    mockResolver.resolveVariableReferences
      .mockReturnValueOnce('false')
      .mockReturnValueOnce('context.value === 99')
    mockResolver.resolveBlockReferences
      .mockReturnValueOnce('false')
      .mockReturnValueOnce('context.value === 99')
    mockResolver.resolveEnvVariables
      .mockReturnValueOnce('false')
      .mockReturnValueOnce('context.value === 99')

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect((result as any).conditionResult).toBe(false)
    expect((result as any).selectedPath).toBeNull()
    expect((result as any).selectedOption).toBeNull()
    expect(mockContext.decisions.condition.has(mockBlock.id)).toBe(false)
  })

  it('falls back to else path when loop context data is unavailable', async () => {
    const conditions = [
      { id: 'cond1', title: 'if', value: 'context.item === "apple"' },
      { id: 'else1', title: 'else', value: '' },
    ]
    const inputs = { conditions: JSON.stringify(conditions) }

    mockResolver.resolveVariableReferences.mockReturnValue('context.item === "apple"')
    mockResolver.resolveBlockReferences.mockReturnValue('context.item === "apple"')
    mockResolver.resolveEnvVariables.mockReturnValue('context.item === "apple"')

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect(mockContext.decisions.condition.get(mockBlock.id)).toBe('else1')
    expect((result as any).selectedOption).toBe('else1')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: condition-handler.ts]---
Location: sim-main/apps/sim/executor/handlers/condition/condition-handler.ts

```typescript
import { generateRequestId } from '@/lib/core/utils/request'
import { executeInIsolatedVM } from '@/lib/execution/isolated-vm'
import { createLogger } from '@/lib/logs/console/logger'
import type { BlockOutput } from '@/blocks/types'
import { BlockType, CONDITION, DEFAULTS, EDGE } from '@/executor/constants'
import type { BlockHandler, ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'

const logger = createLogger('ConditionBlockHandler')

const CONDITION_TIMEOUT_MS = 5000

/**
 * Evaluates a single condition expression with variable/block reference resolution
 * Returns true if condition is met, false otherwise
 */
export async function evaluateConditionExpression(
  ctx: ExecutionContext,
  conditionExpression: string,
  block: SerializedBlock,
  resolver: any,
  providedEvalContext?: Record<string, any>
): Promise<boolean> {
  const evalContext = providedEvalContext || {}

  let resolvedConditionValue = conditionExpression
  try {
    if (resolver) {
      const resolvedVars = resolver.resolveVariableReferences(conditionExpression, block)
      const resolvedRefs = resolver.resolveBlockReferences(resolvedVars, ctx, block)
      resolvedConditionValue = resolver.resolveEnvVariables(resolvedRefs)
    }
  } catch (resolveError: any) {
    logger.error(`Failed to resolve references in condition: ${resolveError.message}`, {
      conditionExpression,
      resolveError,
    })
    throw new Error(`Failed to resolve references in condition: ${resolveError.message}`)
  }

  try {
    const requestId = generateRequestId()

    const code = `return Boolean(${resolvedConditionValue})`

    const result = await executeInIsolatedVM({
      code,
      params: {},
      envVars: {},
      contextVariables: { context: evalContext },
      timeoutMs: CONDITION_TIMEOUT_MS,
      requestId,
    })

    if (result.error) {
      logger.error(`Failed to evaluate condition: ${result.error.message}`, {
        originalCondition: conditionExpression,
        resolvedCondition: resolvedConditionValue,
        evalContext,
        error: result.error,
      })
      throw new Error(
        `Evaluation error in condition: ${result.error.message}. (Resolved: ${resolvedConditionValue})`
      )
    }

    return Boolean(result.result)
  } catch (evalError: any) {
    logger.error(`Failed to evaluate condition: ${evalError.message}`, {
      originalCondition: conditionExpression,
      resolvedCondition: resolvedConditionValue,
      evalContext,
      evalError,
    })
    throw new Error(
      `Evaluation error in condition: ${evalError.message}. (Resolved: ${resolvedConditionValue})`
    )
  }
}

/**
 * Handler for Condition blocks that evaluate expressions to determine execution paths.
 */
export class ConditionBlockHandler implements BlockHandler {
  constructor(
    private pathTracker?: any,
    private resolver?: any
  ) {}

  canHandle(block: SerializedBlock): boolean {
    return block.metadata?.id === BlockType.CONDITION
  }

  async execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<BlockOutput> {
    const conditions = this.parseConditions(inputs.conditions)

    const sourceBlockId = ctx.workflow?.connections.find((conn) => conn.target === block.id)?.source
    const evalContext = this.buildEvaluationContext(ctx, block.id, sourceBlockId)
    const sourceOutput = sourceBlockId ? ctx.blockStates.get(sourceBlockId)?.output : null

    const outgoingConnections = ctx.workflow?.connections.filter((conn) => conn.source === block.id)

    const { selectedConnection, selectedCondition } = await this.evaluateConditions(
      conditions,
      outgoingConnections || [],
      evalContext,
      ctx,
      block
    )

    if (!selectedConnection || !selectedCondition) {
      return {
        ...((sourceOutput as any) || {}),
        conditionResult: false,
        selectedPath: null,
        selectedOption: null,
      }
    }

    const targetBlock = ctx.workflow?.blocks.find((b) => b.id === selectedConnection?.target)
    if (!targetBlock) {
      throw new Error(`Target block ${selectedConnection?.target} not found`)
    }

    const decisionKey = ctx.currentVirtualBlockId || block.id
    ctx.decisions.condition.set(decisionKey, selectedCondition.id)

    return {
      ...((sourceOutput as any) || {}),
      conditionResult: true,
      selectedPath: {
        blockId: targetBlock.id,
        blockType: targetBlock.metadata?.id || DEFAULTS.BLOCK_TYPE,
        blockTitle: targetBlock.metadata?.name || DEFAULTS.BLOCK_TITLE,
      },
      selectedOption: selectedCondition.id,
    }
  }

  private parseConditions(input: any): Array<{ id: string; title: string; value: string }> {
    try {
      const conditions = Array.isArray(input) ? input : JSON.parse(input || '[]')
      return conditions
    } catch (error: any) {
      logger.error('Failed to parse conditions:', { input, error })
      throw new Error(`Invalid conditions format: ${error.message}`)
    }
  }

  private buildEvaluationContext(
    ctx: ExecutionContext,
    blockId: string,
    sourceBlockId?: string
  ): Record<string, any> {
    let evalContext: Record<string, any> = {}

    if (sourceBlockId) {
      const sourceOutput = ctx.blockStates.get(sourceBlockId)?.output
      if (sourceOutput && typeof sourceOutput === 'object' && sourceOutput !== null) {
        evalContext = {
          ...evalContext,
          ...sourceOutput,
        }
      }
    }

    return evalContext
  }

  private async evaluateConditions(
    conditions: Array<{ id: string; title: string; value: string }>,
    outgoingConnections: Array<{ source: string; target: string; sourceHandle?: string }>,
    evalContext: Record<string, any>,
    ctx: ExecutionContext,
    block: SerializedBlock
  ): Promise<{
    selectedConnection: { target: string; sourceHandle?: string } | null
    selectedCondition: { id: string; title: string; value: string } | null
  }> {
    for (const condition of conditions) {
      if (condition.title === CONDITION.ELSE_TITLE) {
        const connection = this.findConnectionForCondition(outgoingConnections, condition.id)
        if (connection) {
          return { selectedConnection: connection, selectedCondition: condition }
        }
        continue
      }

      const conditionValueString = String(condition.value || '')
      try {
        const conditionMet = await evaluateConditionExpression(
          ctx,
          conditionValueString,
          block,
          this.resolver,
          evalContext
        )

        if (conditionMet) {
          const connection = this.findConnectionForCondition(outgoingConnections, condition.id)
          if (connection) {
            return { selectedConnection: connection, selectedCondition: condition }
          }
          // Condition is true but has no outgoing edge - branch ends gracefully
          logger.info(
            `Condition "${condition.title}" is true but has no outgoing edge - branch ending`,
            {
              blockId: block.id,
              conditionId: condition.id,
            }
          )
          return { selectedConnection: null, selectedCondition: null }
        }
      } catch (error: any) {
        logger.error(`Failed to evaluate condition "${condition.title}": ${error.message}`)
        throw new Error(`Evaluation error in condition "${condition.title}": ${error.message}`)
      }
    }

    const elseCondition = conditions.find((c) => c.title === CONDITION.ELSE_TITLE)
    if (elseCondition) {
      logger.warn(`No condition met, selecting 'else' path`, { blockId: block.id })
      const elseConnection = this.findConnectionForCondition(outgoingConnections, elseCondition.id)
      if (elseConnection) {
        return { selectedConnection: elseConnection, selectedCondition: elseCondition }
      }
      logger.info(`No condition matched and else has no connection - branch ending`, {
        blockId: block.id,
      })
      return { selectedConnection: null, selectedCondition: null }
    }

    logger.info(`No condition matched and no else block - branch ending`, { blockId: block.id })
    return { selectedConnection: null, selectedCondition: null }
  }

  private findConnectionForCondition(
    connections: Array<{ source: string; target: string; sourceHandle?: string }>,
    conditionId: string
  ): { target: string; sourceHandle?: string } | undefined {
    return connections.find(
      (conn) => conn.sourceHandle === `${EDGE.CONDITION_PREFIX}${conditionId}`
    )
  }
}
```

--------------------------------------------------------------------------------

````
