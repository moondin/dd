---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 651
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 651 of 933)

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
Location: sim-main/apps/sim/tools/types.ts

```typescript
import type { OAuthService } from '@/lib/oauth/oauth'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD'

export interface OutputProperty {
  type: string
  description?: string
  optional?: boolean
  properties?: Record<string, OutputProperty>
  items?: {
    type: string
    description?: string
    properties?: Record<string, OutputProperty>
  }
}

export type ParameterVisibility =
  | 'user-or-llm' // User can provide OR LLM must generate
  | 'user-only' // Only user can provide (required/optional determined by required field)
  | 'llm-only' // Only LLM provides (computed values)
  | 'hidden' // Not shown to user or LLM

export interface ToolResponse {
  success: boolean // Whether the tool execution was successful
  output: Record<string, any> // The structured output from the tool
  error?: string // Error message if success is false
  timing?: {
    startTime: string // ISO timestamp when the tool execution started
    endTime: string // ISO timestamp when the tool execution ended
    duration: number // Duration in milliseconds
  }
}

export interface OAuthConfig {
  required: boolean // Whether this tool requires OAuth authentication
  provider: OAuthService // The service that needs to be authorized
  requiredScopes?: string[] // Specific scopes this tool needs (for granular scope validation)
}

export interface ToolConfig<P = any, R = any> {
  // Basic tool identification
  id: string
  name: string
  description: string
  version: string

  // Parameter schema - what this tool accepts
  params: Record<
    string,
    {
      type: string
      required?: boolean
      visibility?: ParameterVisibility
      default?: any
      description?: string
      items?: {
        type: string
        description?: string
        properties?: Record<string, { type: string; description?: string }>
      }
    }
  >

  // Output schema - what this tool produces
  outputs?: Record<
    string,
    {
      type: 'string' | 'number' | 'boolean' | 'json' | 'file' | 'file[]' | 'array' | 'object'
      description?: string
      optional?: boolean
      fileConfig?: {
        mimeType?: string // Expected MIME type for file outputs
        extension?: string // Expected file extension
      }
      items?: {
        type: string
        properties?: Record<string, OutputProperty>
      }
      properties?: Record<string, OutputProperty>
    }
  >

  // OAuth configuration for this tool (if it requires authentication)
  oauth?: OAuthConfig

  // Error extractor to use for this tool's error responses
  // If specified, only this extractor will be used (deterministic)
  // If not specified, will try all extractors in order (fallback)
  errorExtractor?: string

  // Request configuration
  request: {
    url: string | ((params: P) => string)
    method: HttpMethod | ((params: P) => HttpMethod)
    headers: (params: P) => Record<string, string>
    body?: (params: P) => Record<string, any> | string
  }

  // Post-processing (optional) - allows additional processing after the initial request
  postProcess?: (
    result: R extends ToolResponse ? R : ToolResponse,
    params: P,
    executeTool: (toolId: string, params: Record<string, any>) => Promise<ToolResponse>
  ) => Promise<R extends ToolResponse ? R : ToolResponse>

  // Response handling
  transformResponse?: (response: Response, params?: P) => Promise<R>

  /**
   * Direct execution function for tools that don't need HTTP requests.
   * If provided, this will be called instead of making an HTTP request.
   */
  directExecution?: (params: P) => Promise<ToolResponse>
}

export interface TableRow {
  id: string
  cells: {
    Key: string
    Value: any
  }
}

export interface OAuthTokenPayload {
  credentialId: string
  workflowId?: string
}

/**
 * File data that tools can return for file-typed outputs
 */
export interface ToolFileData {
  name: string
  mimeType: string
  data?: Buffer | string // Buffer or base64 string
  url?: string // URL to download file from
  size?: number
}
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: sim-main/apps/sim/tools/utils.test.ts

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ToolConfig } from '@/tools/types'
import {
  createCustomToolRequestBody,
  createParamSchema,
  executeRequest,
  formatRequestParams,
  getClientEnvVars,
  transformTable,
  validateRequiredParametersAfterMerge,
} from '@/tools/utils'

vi.mock('@/lib/logs/console/logger', () => ({
  createLogger: vi.fn().mockReturnValue({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}))

vi.mock('@/stores/settings/environment/store', () => {
  const mockStore = {
    getAllVariables: vi.fn().mockReturnValue({
      API_KEY: { value: 'mock-api-key' },
      BASE_URL: { value: 'https://example.com' },
    }),
  }

  return {
    useEnvironmentStore: {
      getState: vi.fn().mockImplementation(() => mockStore),
    },
  }
})

const originalWindow = global.window
beforeEach(() => {
  global.window = {} as any
})

afterEach(() => {
  global.window = originalWindow

  vi.clearAllMocks()
})

describe('transformTable', () => {
  it.concurrent('should return empty object for null input', () => {
    const result = transformTable(null)
    expect(result).toEqual({})
  })

  it.concurrent('should transform table rows to key-value pairs', () => {
    const table = [
      { id: '1', cells: { Key: 'name', Value: 'John Doe' } },
      { id: '2', cells: { Key: 'age', Value: 30 } },
      { id: '3', cells: { Key: 'isActive', Value: true } },
      { id: '4', cells: { Key: 'data', Value: { foo: 'bar' } } },
    ]

    const result = transformTable(table)

    expect(result).toEqual({
      name: 'John Doe',
      age: 30,
      isActive: true,
      data: { foo: 'bar' },
    })
  })

  it.concurrent('should skip rows without Key or Value properties', () => {
    const table: any = [
      { id: '1', cells: { Key: 'name', Value: 'John Doe' } },
      { id: '2', cells: { Key: 'age' } }, // Missing Value
      { id: '3', cells: { Value: true } }, // Missing Key
      { id: '4', cells: {} }, // Empty cells
    ]

    const result = transformTable(table)

    expect(result).toEqual({
      name: 'John Doe',
    })
  })

  it.concurrent('should handle Value=0 and Value=false correctly', () => {
    const table = [
      { id: '1', cells: { Key: 'count', Value: 0 } },
      { id: '2', cells: { Key: 'enabled', Value: false } },
    ]

    const result = transformTable(table)

    expect(result).toEqual({
      count: 0,
      enabled: false,
    })
  })
})

describe('formatRequestParams', () => {
  let mockTool: ToolConfig

  beforeEach(() => {
    mockTool = {
      id: 'test-tool',
      name: 'Test Tool',
      description: 'A test tool',
      version: '1.0.0',
      params: {},
      request: {
        url: 'https://api.example.com',
        method: 'GET',
        headers: vi.fn().mockReturnValue({
          'Content-Type': 'application/json',
        }),
        body: vi.fn().mockReturnValue({ data: 'test-data' }),
      },
    }
  })

  it.concurrent('should format request with static URL', () => {
    const params = { foo: 'bar' }
    const result = formatRequestParams(mockTool, params)

    expect(result).toEqual({
      url: 'https://api.example.com',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined, // No body for GET
    })

    expect(mockTool.request.headers).toHaveBeenCalledWith(params)
  })

  it.concurrent('should format request with dynamic URL function', () => {
    mockTool.request.url = (params) => `https://api.example.com/${params.id}`
    const params = { id: '123' }

    const result = formatRequestParams(mockTool, params)

    expect(result).toEqual({
      url: 'https://api.example.com/123',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    })
  })

  it.concurrent('should use method from params over tool default', () => {
    const params = { method: 'POST' }
    const result = formatRequestParams(mockTool, params)

    expect(result.method).toBe('POST')
    expect(result.body).toBe(JSON.stringify({ data: 'test-data' }))
    expect(mockTool.request.body).toHaveBeenCalledWith(params)
  })

  it.concurrent('should handle preformatted content types', () => {
    // Set Content-Type to a preformatted type
    mockTool.request.headers = vi.fn().mockReturnValue({
      'Content-Type': 'application/x-www-form-urlencoded',
    })

    // Return a preformatted body
    mockTool.request.body = vi.fn().mockReturnValue('key1=value1&key2=value2')

    const params = { method: 'POST' }
    const result = formatRequestParams(mockTool, params)

    expect(result.body).toBe('key1=value1&key2=value2')
  })

  it.concurrent('should handle NDJSON content type', () => {
    // Set Content-Type to NDJSON
    mockTool.request.headers = vi.fn().mockReturnValue({
      'Content-Type': 'application/x-ndjson',
    })

    // Return a preformatted body for NDJSON
    mockTool.request.body = vi.fn().mockReturnValue('{"prompt": "Hello"}\n{"prompt": "World"}')

    const params = { method: 'POST' }
    const result = formatRequestParams(mockTool, params)

    expect(result.body).toBe('{"prompt": "Hello"}\n{"prompt": "World"}')
  })
})

describe('validateRequiredParametersAfterMerge', () => {
  let mockTool: ToolConfig

  beforeEach(() => {
    mockTool = {
      id: 'test-tool',
      name: 'Test Tool',
      description: 'A test tool',
      version: '1.0.0',
      params: {
        required1: {
          type: 'string',
          required: true,
          visibility: 'user-or-llm',
        },
        required2: {
          type: 'number',
          required: true,
          visibility: 'user-or-llm',
        },
        optional: {
          type: 'boolean',
        },
      },
      request: {
        url: 'https://api.example.com',
        method: 'GET',
        headers: () => ({}),
      },
    }
  })

  it.concurrent('should throw error for missing tool', () => {
    expect(() => {
      validateRequiredParametersAfterMerge('missing-tool', undefined, {})
    }).toThrow('Tool not found: missing-tool')
  })

  it.concurrent('should throw error for missing required parameters', () => {
    expect(() => {
      validateRequiredParametersAfterMerge('test-tool', mockTool, {
        required1: 'value',
        // required2 is missing
      })
    }).toThrow('Required2 is required for Test Tool')
  })

  it.concurrent('should not throw error when all required parameters are provided', () => {
    expect(() => {
      validateRequiredParametersAfterMerge('test-tool', mockTool, {
        required1: 'value',
        required2: 42,
      })
    }).not.toThrow()
  })

  it.concurrent('should not require optional parameters', () => {
    expect(() => {
      validateRequiredParametersAfterMerge('test-tool', mockTool, {
        required1: 'value',
        required2: 42,
        // optional parameter not provided
      })
    }).not.toThrow()
  })

  it.concurrent('should handle null and empty string values as missing', () => {
    expect(() => {
      validateRequiredParametersAfterMerge('test-tool', mockTool, {
        required1: null,
        required2: '',
      })
    }).toThrow('Required1 is required for Test Tool')
  })

  it.concurrent(
    'should not validate user-only parameters (they should be validated earlier)',
    () => {
      const toolWithUserOnlyParam = {
        ...mockTool,
        params: {
          ...mockTool.params,
          apiKey: {
            type: 'string' as const,
            required: true,
            visibility: 'user-only' as const, // This should NOT be validated here
          },
        },
      }

      // Should NOT throw for missing user-only params - they're validated at serialization
      expect(() => {
        validateRequiredParametersAfterMerge('test-tool', toolWithUserOnlyParam, {
          required1: 'value',
          required2: 42,
          // apiKey missing but it's user-only, so not validated here
        })
      }).not.toThrow()
    }
  )

  it.concurrent('should validate mixed user-or-llm and user-only parameters correctly', () => {
    const toolWithMixedParams = {
      ...mockTool,
      params: {
        userOrLlmParam: {
          type: 'string' as const,
          required: true,
          visibility: 'user-or-llm' as const, // Should be validated
        },
        userOnlyParam: {
          type: 'string' as const,
          required: true,
          visibility: 'user-only' as const, // Should NOT be validated
        },
        optionalParam: {
          type: 'string' as const,
          required: false,
          visibility: 'user-or-llm' as const,
        },
      },
    }

    // Should throw for missing user-or-llm param, but not user-only param
    expect(() => {
      validateRequiredParametersAfterMerge('test-tool', toolWithMixedParams, {
        // userOrLlmParam missing - should cause error
        // userOnlyParam missing - should NOT cause error (validated earlier)
      })
    }).toThrow('User Or Llm Param is required for')
  })

  it.concurrent('should use parameter description in error messages when available', () => {
    const toolWithDescriptions = {
      ...mockTool,
      params: {
        subreddit: {
          type: 'string' as const,
          required: true,
          visibility: 'user-or-llm' as const,
          description: 'Subreddit name (without r/ prefix)',
        },
      },
    }

    expect(() => {
      validateRequiredParametersAfterMerge('test-tool', toolWithDescriptions, {})
    }).toThrow('Subreddit is required for Test Tool')
  })

  it.concurrent('should fall back to parameter name when no description available', () => {
    const toolWithoutDescription = {
      ...mockTool,
      params: {
        subreddit: {
          type: 'string' as const,
          required: true,
          visibility: 'user-or-llm' as const,
          // No description provided
        },
      },
    }

    expect(() => {
      validateRequiredParametersAfterMerge('test-tool', toolWithoutDescription, {})
    }).toThrow('Subreddit is required for Test Tool')
  })

  it.concurrent('should handle undefined values as missing', () => {
    expect(() => {
      validateRequiredParametersAfterMerge('test-tool', mockTool, {
        required1: 'value',
        required2: undefined, // Explicitly undefined
      })
    }).toThrow('Required2 is required for Test Tool')
  })

  it.concurrent('should validate all missing parameters at once', () => {
    const toolWithMultipleRequired = {
      ...mockTool,
      params: {
        param1: {
          type: 'string' as const,
          required: true,
          visibility: 'user-or-llm' as const,
          description: 'First parameter',
        },
        param2: {
          type: 'string' as const,
          required: true,
          visibility: 'user-or-llm' as const,
          description: 'Second parameter',
        },
      },
    }

    // Should throw for the first missing parameter it encounters
    expect(() => {
      validateRequiredParametersAfterMerge('test-tool', toolWithMultipleRequired, {})
    }).toThrow('Param1 is required for Test Tool')
  })
})

describe('executeRequest', () => {
  let mockTool: ToolConfig
  let mockFetch: any

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    mockTool = {
      id: 'test-tool',
      name: 'Test Tool',
      description: 'A test tool',
      version: '1.0.0',
      params: {},
      request: {
        url: 'https://api.example.com',
        method: 'GET',
        headers: () => ({ 'Content-Type': 'application/json' }),
      },
      transformResponse: vi.fn(async (response) => ({
        success: true,
        output: await response.json(),
      })),
    }
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should handle successful requests', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ result: 'success' }),
    })

    const result = await executeRequest('test-tool', mockTool, {
      url: 'https://api.example.com',
      method: 'GET',
      headers: {},
    })

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com', {
      method: 'GET',
      headers: {},
      body: undefined,
    })
    expect(mockTool.transformResponse).toHaveBeenCalled()
    expect(result).toEqual({
      success: true,
      output: { result: 'success' },
    })
  })

  it.concurrent('should use default transform response if not provided', async () => {
    mockTool.transformResponse = undefined

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ result: 'success' }),
    })

    const result = await executeRequest('test-tool', mockTool, {
      url: 'https://api.example.com',
      method: 'GET',
      headers: {},
    })

    expect(result).toEqual({
      success: true,
      output: { result: 'success' },
    })
  })

  it('should handle error responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ message: 'Invalid input' }),
    })

    const result = await executeRequest('test-tool', mockTool, {
      url: 'https://api.example.com',
      method: 'GET',
      headers: {},
    })

    expect(result).toEqual({
      success: false,
      output: {},
      error: 'Invalid input',
    })
  })

  it.concurrent('should handle network errors', async () => {
    const networkError = new Error('Network error')
    mockFetch.mockRejectedValueOnce(networkError)

    const result = await executeRequest('test-tool', mockTool, {
      url: 'https://api.example.com',
      method: 'GET',
      headers: {},
    })

    expect(result).toEqual({
      success: false,
      output: {},
      error: 'Network error',
    })
  })

  it('should handle JSON parse errors in error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Server Error',
      json: async () => {
        throw new Error('Invalid JSON')
      },
    })

    const result = await executeRequest('test-tool', mockTool, {
      url: 'https://api.example.com',
      method: 'GET',
      headers: {},
    })

    expect(result).toEqual({
      success: false,
      output: {},
      error: 'Server Error', // Should use statusText in the error message
    })
  })

  it('should handle transformResponse with non-JSON response', async () => {
    const toolWithTransform = {
      ...mockTool,
      transformResponse: async (response: Response) => {
        const xmlText = await response.text()
        return {
          success: true,
          output: {
            parsedData: 'mocked xml parsing result',
            originalXml: xmlText,
          },
        }
      },
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => '<xml><test>Mock XML response</test></xml>',
    })

    const result = await executeRequest('test-tool', toolWithTransform, {
      url: 'https://api.example.com',
      method: 'GET',
      headers: {},
    })

    expect(result).toEqual({
      success: true,
      output: {
        parsedData: 'mocked xml parsing result',
        originalXml: '<xml><test>Mock XML response</test></xml>',
      },
    })
  })
})

describe('createParamSchema', () => {
  it.concurrent('should create parameter schema from custom tool schema', () => {
    const customTool = {
      id: 'test-tool',
      title: 'Test Tool',
      schema: {
        function: {
          name: 'testFunc',
          description: 'A test function',
          parameters: {
            type: 'object',
            properties: {
              required1: { type: 'string', description: 'Required param' },
              optional1: { type: 'number', description: 'Optional param' },
            },
            required: ['required1'],
          },
        },
      },
    }

    const result = createParamSchema(customTool)

    expect(result).toEqual({
      required1: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Required param',
      },
      optional1: {
        type: 'number',
        required: false,
        visibility: 'user-only',
        description: 'Optional param',
      },
    })
  })

  it.concurrent('should handle empty or missing schema gracefully', () => {
    const emptyTool = {
      id: 'empty-tool',
      title: 'Empty Tool',
      schema: {},
    }

    const result = createParamSchema(emptyTool)

    expect(result).toEqual({})

    const missingPropsTool = {
      id: 'missing-props',
      title: 'Missing Props',
      schema: { function: { parameters: {} } },
    }

    const result2 = createParamSchema(missingPropsTool)
    expect(result2).toEqual({})
  })
})

describe('getClientEnvVars', () => {
  it.concurrent('should return environment variables from store in browser environment', () => {
    const mockStoreGetter = () => ({
      getAllVariables: () => ({
        API_KEY: { value: 'mock-api-key' },
        BASE_URL: { value: 'https://example.com' },
      }),
    })

    const result = getClientEnvVars(mockStoreGetter)

    expect(result).toEqual({
      API_KEY: 'mock-api-key',
      BASE_URL: 'https://example.com',
    })
  })

  it.concurrent('should return empty object in server environment', () => {
    global.window = undefined as any

    const result = getClientEnvVars()

    expect(result).toEqual({})
  })
})

describe('createCustomToolRequestBody', () => {
  it.concurrent('should create request body function for client-side execution', () => {
    const customTool = {
      code: 'return a + b',
      schema: {
        function: {
          parameters: { type: 'object', properties: {} },
        },
      },
    }

    const mockStoreGetter = () => ({
      getAllVariables: () => ({
        API_KEY: { value: 'mock-api-key' },
        BASE_URL: { value: 'https://example.com' },
      }),
    })

    const bodyFn = createCustomToolRequestBody(customTool, true, undefined, mockStoreGetter)
    const result = bodyFn({ a: 5, b: 3 })

    expect(result).toEqual({
      code: 'return a + b',
      params: { a: 5, b: 3 },
      schema: { type: 'object', properties: {} },
      envVars: {
        API_KEY: 'mock-api-key',
        BASE_URL: 'https://example.com',
      },
      workflowId: undefined,
      workflowVariables: {},
      blockData: {},
      blockNameMapping: {},
      isCustomTool: true,
    })
  })

  it.concurrent('should create request body function for server-side execution', () => {
    const customTool = {
      code: 'return a + b',
      schema: {
        function: {
          parameters: { type: 'object', properties: {} },
        },
      },
    }

    const workflowId = 'test-workflow-123'
    const bodyFn = createCustomToolRequestBody(customTool, false, workflowId)
    const result = bodyFn({ a: 5, b: 3 })

    expect(result).toEqual({
      code: 'return a + b',
      params: { a: 5, b: 3 },
      schema: { type: 'object', properties: {} },
      envVars: {},
      workflowId: 'test-workflow-123',
      workflowVariables: {},
      blockData: {},
      blockNameMapping: {},
      isCustomTool: true,
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/utils.ts

```typescript
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { useCustomToolsStore } from '@/stores/custom-tools/store'
import { useEnvironmentStore } from '@/stores/settings/environment/store'
import { tools } from '@/tools/registry'
import type { TableRow, ToolConfig, ToolResponse } from '@/tools/types'

const logger = createLogger('ToolsUtils')

/**
 * Transforms a table from the store format to a key-value object
 * @param table Array of table rows from the store
 * @returns Record of key-value pairs
 */
export const transformTable = (table: TableRow[] | null): Record<string, any> => {
  if (!table) return {}

  return table.reduce(
    (acc, row) => {
      if (row.cells?.Key && row.cells?.Value !== undefined) {
        // Extract the Value cell as is - it should already be properly resolved
        // by the InputResolver based on variable type (number, string, boolean etc.)
        const value = row.cells.Value

        // Store the correctly typed value in the result object
        acc[row.cells.Key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )
}

interface RequestParams {
  url: string
  method: string
  headers: Record<string, string>
  body?: string
}

/**
 * Format request parameters based on tool configuration and provided params
 */
export function formatRequestParams(tool: ToolConfig, params: Record<string, any>): RequestParams {
  // Process URL
  const url = typeof tool.request.url === 'function' ? tool.request.url(params) : tool.request.url

  // Process method
  const method =
    typeof tool.request.method === 'function'
      ? tool.request.method(params)
      : params.method || tool.request.method || 'GET'

  // Process headers
  const headers = tool.request.headers ? tool.request.headers(params) : {}

  // Process body
  const hasBody = method !== 'GET' && method !== 'HEAD' && !!tool.request.body
  const bodyResult = tool.request.body ? tool.request.body(params) : undefined

  // Special handling for NDJSON content type or 'application/x-www-form-urlencoded'
  const isPreformattedContent =
    headers['Content-Type'] === 'application/x-ndjson' ||
    headers['Content-Type'] === 'application/x-www-form-urlencoded'

  let body: string | undefined
  if (hasBody) {
    if (isPreformattedContent) {
      // Check if bodyResult is a string
      if (typeof bodyResult === 'string') {
        body = bodyResult
      }
      // Check if bodyResult is an object with a 'body' property (Twilio pattern)
      else if (bodyResult && typeof bodyResult === 'object' && 'body' in bodyResult) {
        body = bodyResult.body
      }
      // Otherwise JSON stringify it
      else {
        body = JSON.stringify(bodyResult)
      }
    } else {
      body = typeof bodyResult === 'string' ? bodyResult : JSON.stringify(bodyResult)
    }
  }

  return { url, method, headers, body }
}

/**
 * Execute the actual request and transform the response
 */
export async function executeRequest(
  toolId: string,
  tool: ToolConfig,
  requestParams: RequestParams
): Promise<ToolResponse> {
  try {
    const { url, method, headers, body } = requestParams

    const externalResponse = await fetch(url, { method, headers, body })

    if (!externalResponse.ok) {
      let errorContent
      try {
        errorContent = await externalResponse.json()
      } catch (_e) {
        errorContent = { message: externalResponse.statusText }
      }

      const error = errorContent.message || `${toolId} API error: ${externalResponse.statusText}`
      logger.error(`${toolId} error:`, { error })
      throw new Error(error)
    }

    const transformResponse =
      tool.transformResponse ||
      (async (resp: Response) => ({
        success: true,
        output: await resp.json(),
      }))

    return await transformResponse(externalResponse)
  } catch (error: any) {
    return {
      success: false,
      output: {},
      error: error.message || 'Unknown error',
    }
  }
}

/**
 * Formats a parameter name for user-friendly error messages
 * Converts parameter names and descriptions to more readable format
 */
function formatParameterNameForError(paramName: string): string {
  // Split camelCase and snake_case/kebab-case into words, then capitalize first letter of each word
  return paramName
    .split(/(?=[A-Z])|[_-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Validates required parameters after LLM and user params have been merged
 * This is the final validation before tool execution - ensures all required
 * user-or-llm parameters are present after the merge process
 */
export function validateRequiredParametersAfterMerge(
  toolId: string,
  tool: ToolConfig | undefined,
  params: Record<string, any>,
  parameterNameMap?: Record<string, string>
): void {
  if (!tool) {
    throw new Error(`Tool not found: ${toolId}`)
  }

  // Validate all required user-or-llm parameters after merge
  // user-only parameters should have been validated earlier during serialization
  for (const [paramName, paramConfig] of Object.entries(tool.params)) {
    if (
      (paramConfig as any).visibility === 'user-or-llm' &&
      paramConfig.required &&
      (!(paramName in params) ||
        params[paramName] === null ||
        params[paramName] === undefined ||
        params[paramName] === '')
    ) {
      // Create a more user-friendly error message
      const toolName = tool.name || toolId
      const friendlyParamName =
        parameterNameMap?.[paramName] || formatParameterNameForError(paramName)
      throw new Error(`${friendlyParamName} is required for ${toolName}`)
    }
  }
}

/**
 * Creates parameter schema from custom tool schema
 */
export function createParamSchema(customTool: any): Record<string, any> {
  const params: Record<string, any> = {}

  if (customTool.schema.function?.parameters?.properties) {
    const properties = customTool.schema.function.parameters.properties
    const required = customTool.schema.function.parameters.required || []

    Object.entries(properties).forEach(([key, config]: [string, any]) => {
      const isRequired = required.includes(key)

      // Create the base parameter configuration
      const paramConfig: Record<string, any> = {
        type: config.type || 'string',
        required: isRequired,
        description: config.description || '',
      }

      // Set visibility based on whether it's required
      if (isRequired) {
        paramConfig.visibility = 'user-or-llm'
      } else {
        paramConfig.visibility = 'user-only'
      }

      params[key] = paramConfig
    })
  }

  return params
}

/**
 * Get environment variables from store (client-side only)
 * @param getStore Optional function to get the store (useful for testing)
 */
export function getClientEnvVars(getStore?: () => any): Record<string, string> {
  if (typeof window === 'undefined') return {}

  try {
    // Allow injecting the store for testing
    const envStore = getStore ? getStore() : useEnvironmentStore.getState()
    const allEnvVars = envStore.getAllVariables()

    // Convert environment variables to a simple key-value object
    return Object.entries(allEnvVars).reduce(
      (acc, [key, variable]: [string, any]) => {
        acc[key] = variable.value
        return acc
      },
      {} as Record<string, string>
    )
  } catch (_error) {
    // In case of any errors (like in testing), return empty object
    return {}
  }
}

/**
 * Creates the request body configuration for custom tools
 * @param customTool The custom tool configuration
 * @param isClient Whether running on client side
 * @param workflowId Optional workflow ID for server-side
 * @param getStore Optional function to get the store (useful for testing)
 */
export function createCustomToolRequestBody(
  customTool: any,
  isClient = true,
  workflowId?: string,
  getStore?: () => any
) {
  return (params: Record<string, any>) => {
    // Get environment variables - try multiple sources in order of preference:
    // 1. envVars parameter (passed from provider/agent context)
    // 2. Client-side store (if running in browser)
    // 3. Empty object (fallback)
    const envVars = params.envVars || (isClient ? getClientEnvVars(getStore) : {})

    // Get workflow variables from params (passed from execution context)
    const workflowVariables = params.workflowVariables || {}

    // Get block data and mapping from params (passed from execution context)
    const blockData = params.blockData || {}
    const blockNameMapping = params.blockNameMapping || {}

    // Include everything needed for execution
    return {
      code: customTool.code,
      params: params, // These will be available in the VM context
      schema: customTool.schema.function.parameters, // For validation
      envVars: envVars, // Environment variables
      workflowVariables: workflowVariables, // Workflow variables for <variable.name> resolution
      blockData: blockData, // Runtime block outputs for <block.field> resolution
      blockNameMapping: blockNameMapping, // Block name to ID mapping
      workflowId: workflowId, // Pass workflowId for server-side context
      isCustomTool: true, // Flag to indicate this is a custom tool execution
    }
  }
}

// Get a tool by its ID
export function getTool(toolId: string): ToolConfig | undefined {
  // Check for built-in tools
  const builtInTool = tools[toolId]
  if (builtInTool) return builtInTool

  // Check if it's a custom tool
  if (toolId.startsWith('custom_') && typeof window !== 'undefined') {
    // Only try to use the sync version on the client
    const customToolsStore = useCustomToolsStore.getState()
    const identifier = toolId.replace('custom_', '')

    // Try to find the tool directly by ID first
    let customTool = customToolsStore.getTool(identifier)

    // If not found by ID, try to find by title (for backward compatibility)
    if (!customTool) {
      const allTools = customToolsStore.getAllTools()
      customTool = allTools.find((tool) => tool.title === identifier)
    }

    if (customTool) {
      return createToolConfig(customTool, toolId)
    }
  }

  // If not found or running on the server, return undefined
  return undefined
}

// Get a tool by its ID asynchronously (supports server-side)
export async function getToolAsync(
  toolId: string,
  workflowId?: string
): Promise<ToolConfig | undefined> {
  // Check for built-in tools
  const builtInTool = tools[toolId]
  if (builtInTool) return builtInTool

  // Check if it's a custom tool
  if (toolId.startsWith('custom_')) {
    return getCustomTool(toolId, workflowId)
  }

  return undefined
}

// Helper function to create a tool config from a custom tool
function createToolConfig(customTool: any, customToolId: string): ToolConfig {
  // Create a parameter schema from the custom tool schema
  const params = createParamSchema(customTool)

  // Create a tool config for the custom tool
  return {
    id: customToolId,
    name: customTool.title,
    description: customTool.schema.function?.description || '',
    version: '1.0.0',
    params,

    // Request configuration - for custom tools we'll use the execute endpoint
    request: {
      url: '/api/function/execute',
      method: 'POST',
      headers: () => ({ 'Content-Type': 'application/json' }),
      body: createCustomToolRequestBody(customTool, true),
    },

    // Standard response handling for custom tools
    transformResponse: async (response: Response) => {
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Custom tool execution failed')
      }

      return {
        success: true,
        output: data.output.result || data.output,
        error: undefined,
      }
    },
  }
}

// Create a tool config from a custom tool definition
async function getCustomTool(
  customToolId: string,
  workflowId?: string
): Promise<ToolConfig | undefined> {
  const identifier = customToolId.replace('custom_', '')

  try {
    const baseUrl = getBaseUrl()
    const url = new URL('/api/tools/custom', baseUrl)

    // Add workflowId as a query parameter if available
    if (workflowId) {
      url.searchParams.append('workflowId', workflowId)
    }

    // For server-side calls (during workflow execution), use internal JWT token
    const headers: Record<string, string> = {}
    if (typeof window === 'undefined') {
      try {
        const { generateInternalToken } = await import('@/lib/auth/internal')
        const internalToken = await generateInternalToken()
        headers.Authorization = `Bearer ${internalToken}`
      } catch (error) {
        logger.warn('Failed to generate internal token for custom tools fetch', { error })
        // Continue without token - will fail auth and be reported upstream
      }
    }

    const response = await fetch(url.toString(), {
      headers,
    })

    if (!response.ok) {
      logger.error(`Failed to fetch custom tools: ${response.statusText}`)
      return undefined
    }

    const result = await response.json()

    if (!result.data || !Array.isArray(result.data)) {
      logger.error(`Invalid response when fetching custom tools: ${JSON.stringify(result)}`)
      return undefined
    }

    // Try to find the tool by ID or title
    const customTool = result.data.find(
      (tool: any) => tool.id === identifier || tool.title === identifier
    )

    if (!customTool) {
      logger.error(`Custom tool not found: ${identifier}`)
      return undefined
    }

    // Create a parameter schema
    const params = createParamSchema(customTool)

    // Create a tool config for the custom tool
    return {
      id: customToolId,
      name: customTool.title,
      description: customTool.schema.function?.description || '',
      version: '1.0.0',
      params,

      // Request configuration - for custom tools we'll use the execute endpoint
      request: {
        url: '/api/function/execute',
        method: 'POST',
        headers: () => ({ 'Content-Type': 'application/json' }),
        body: createCustomToolRequestBody(customTool, false, workflowId),
      },

      // Same response handling as client-side
      transformResponse: async (response: Response) => {
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Custom tool execution failed')
        }

        return {
          success: true,
          output: data.output.result || data.output,
          error: undefined,
        }
      },
    }
  } catch (error) {
    logger.error(`Error fetching custom tool ${identifier} from API:`, error)
    return undefined
  }
}
```

--------------------------------------------------------------------------------

````
