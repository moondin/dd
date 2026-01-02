---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:37Z
part: 929
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 929 of 933)

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

---[FILE: index.test.ts]---
Location: sim-main/packages/ts-sdk/src/index.test.ts

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SimStudioClient, SimStudioError } from './index'

vi.mock('node-fetch', () => ({
  default: vi.fn(),
}))

describe('SimStudioClient', () => {
  let client: SimStudioClient

  beforeEach(() => {
    client = new SimStudioClient({
      apiKey: 'test-api-key',
      baseUrl: 'https://test.sim.ai',
    })
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create a client with correct configuration', () => {
      expect(client).toBeInstanceOf(SimStudioClient)
    })

    it('should use default base URL when not provided', () => {
      const defaultClient = new SimStudioClient({
        apiKey: 'test-api-key',
      })
      expect(defaultClient).toBeInstanceOf(SimStudioClient)
    })
  })

  describe('setApiKey', () => {
    it('should update the API key', () => {
      const newApiKey = 'new-api-key'
      client.setApiKey(newApiKey)

      // Verify the method exists
      expect(client.setApiKey).toBeDefined()
      // Verify the API key was actually updated
      expect((client as any).apiKey).toBe(newApiKey)
    })
  })

  describe('setBaseUrl', () => {
    it('should update the base URL', () => {
      const newBaseUrl = 'https://new.sim.ai'
      client.setBaseUrl(newBaseUrl)
      expect((client as any).baseUrl).toBe(newBaseUrl)
    })

    it('should strip trailing slash from base URL', () => {
      const urlWithSlash = 'https://test.sim.ai/'
      client.setBaseUrl(urlWithSlash)
      // Verify the trailing slash was actually stripped
      expect((client as any).baseUrl).toBe('https://test.sim.ai')
    })
  })

  describe('validateWorkflow', () => {
    it('should return false when workflow status request fails', async () => {
      const fetch = await import('node-fetch')
      vi.mocked(fetch.default).mockRejectedValue(new Error('Network error'))

      const result = await client.validateWorkflow('test-workflow-id')
      expect(result).toBe(false)
    })

    it('should return true when workflow is deployed', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          isDeployed: true,
          deployedAt: '2023-01-01T00:00:00Z',
          needsRedeployment: false,
        }),
      }
      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      const result = await client.validateWorkflow('test-workflow-id')
      expect(result).toBe(true)
    })

    it('should return false when workflow is not deployed', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          isDeployed: false,
          deployedAt: null,
          needsRedeployment: true,
        }),
      }
      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      const result = await client.validateWorkflow('test-workflow-id')
      expect(result).toBe(false)
    })
  })

  describe('executeWorkflow - async execution', () => {
    it('should return AsyncExecutionResult when async is true', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: true,
        status: 202,
        json: vi.fn().mockResolvedValue({
          success: true,
          taskId: 'task-123',
          status: 'queued',
          createdAt: '2024-01-01T00:00:00Z',
          links: {
            status: '/api/jobs/task-123',
          },
        }),
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }
      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      const result = await client.executeWorkflow('workflow-id', {
        input: { message: 'Hello' },
        async: true,
      })

      expect(result).toHaveProperty('taskId', 'task-123')
      expect(result).toHaveProperty('status', 'queued')
      expect(result).toHaveProperty('links')
      expect((result as any).links.status).toBe('/api/jobs/task-123')

      // Verify headers were set correctly
      const calls = vi.mocked(fetch.default).mock.calls
      expect(calls[0][1]?.headers).toMatchObject({
        'X-Execution-Mode': 'async',
      })
    })

    it('should return WorkflowExecutionResult when async is false', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          success: true,
          output: { result: 'completed' },
          logs: [],
        }),
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }
      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      const result = await client.executeWorkflow('workflow-id', {
        input: { message: 'Hello' },
        async: false,
      })

      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('output')
      expect(result).not.toHaveProperty('taskId')
    })

    it('should not set X-Execution-Mode header when async is undefined', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          success: true,
          output: {},
        }),
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }
      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      await client.executeWorkflow('workflow-id', {
        input: { message: 'Hello' },
      })

      const calls = vi.mocked(fetch.default).mock.calls
      expect(calls[0][1]?.headers).not.toHaveProperty('X-Execution-Mode')
    })
  })

  describe('getJobStatus', () => {
    it('should fetch job status with correct endpoint', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          success: true,
          taskId: 'task-123',
          status: 'completed',
          metadata: {
            startedAt: '2024-01-01T00:00:00Z',
            completedAt: '2024-01-01T00:01:00Z',
            duration: 60000,
          },
          output: { result: 'done' },
        }),
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }
      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      const result = await client.getJobStatus('task-123')

      expect(result).toHaveProperty('taskId', 'task-123')
      expect(result).toHaveProperty('status', 'completed')
      expect(result).toHaveProperty('output')

      // Verify correct endpoint was called
      const calls = vi.mocked(fetch.default).mock.calls
      expect(calls[0][0]).toBe('https://test.sim.ai/api/jobs/task-123')
    })

    it('should handle job not found error', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: vi.fn().mockResolvedValue({
          error: 'Job not found',
          code: 'JOB_NOT_FOUND',
        }),
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }
      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      await expect(client.getJobStatus('invalid-task')).rejects.toThrow(SimStudioError)
      await expect(client.getJobStatus('invalid-task')).rejects.toThrow('Job not found')
    })
  })

  describe('executeWithRetry', () => {
    it('should succeed on first attempt when no rate limit', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          success: true,
          output: { result: 'success' },
        }),
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }
      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      const result = await client.executeWithRetry('workflow-id', {
        input: { message: 'test' },
      })

      expect(result).toHaveProperty('success', true)
      expect(vi.mocked(fetch.default)).toHaveBeenCalledTimes(1)
    })

    it('should retry on rate limit error', async () => {
      const fetch = await import('node-fetch')

      // First call returns 429, second call succeeds
      const rateLimitResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: vi.fn().mockResolvedValue({
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
        }),
        headers: {
          get: vi.fn((header: string) => {
            if (header === 'retry-after') return '1'
            if (header === 'x-ratelimit-limit') return '100'
            if (header === 'x-ratelimit-remaining') return '0'
            if (header === 'x-ratelimit-reset') return String(Math.floor(Date.now() / 1000) + 60)
            return null
          }),
        },
      }

      const successResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          success: true,
          output: { result: 'success' },
        }),
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      vi.mocked(fetch.default)
        .mockResolvedValueOnce(rateLimitResponse as any)
        .mockResolvedValueOnce(successResponse as any)

      const result = await client.executeWithRetry(
        'workflow-id',
        { input: { message: 'test' } },
        { maxRetries: 3, initialDelay: 10 }
      )

      expect(result).toHaveProperty('success', true)
      expect(vi.mocked(fetch.default)).toHaveBeenCalledTimes(2)
    })

    it('should throw after max retries exceeded', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: vi.fn().mockResolvedValue({
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
        }),
        headers: {
          get: vi.fn((header: string) => {
            if (header === 'retry-after') return '1'
            return null
          }),
        },
      }

      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      await expect(
        client.executeWithRetry(
          'workflow-id',
          { input: { message: 'test' } },
          { maxRetries: 2, initialDelay: 10 }
        )
      ).rejects.toThrow('Rate limit exceeded')

      expect(vi.mocked(fetch.default)).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })

    it('should not retry on non-rate-limit errors', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({
          error: 'Server error',
          code: 'INTERNAL_ERROR',
        }),
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      await expect(
        client.executeWithRetry('workflow-id', { input: { message: 'test' } })
      ).rejects.toThrow('Server error')

      expect(vi.mocked(fetch.default)).toHaveBeenCalledTimes(1) // No retries
    })
  })

  describe('getRateLimitInfo', () => {
    it('should return null when no rate limit info available', () => {
      const info = client.getRateLimitInfo()
      expect(info).toBeNull()
    })

    it('should return rate limit info after API call', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true, output: {} }),
        headers: {
          get: vi.fn((header: string) => {
            if (header === 'x-ratelimit-limit') return '100'
            if (header === 'x-ratelimit-remaining') return '95'
            if (header === 'x-ratelimit-reset') return '1704067200'
            return null
          }),
        },
      }

      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      await client.executeWorkflow('workflow-id', { input: {} })

      const info = client.getRateLimitInfo()
      expect(info).not.toBeNull()
      expect(info?.limit).toBe(100)
      expect(info?.remaining).toBe(95)
      expect(info?.reset).toBe(1704067200)
    })
  })

  describe('getUsageLimits', () => {
    it('should fetch usage limits with correct structure', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          success: true,
          rateLimit: {
            sync: {
              isLimited: false,
              limit: 100,
              remaining: 95,
              resetAt: '2024-01-01T01:00:00Z',
            },
            async: {
              isLimited: false,
              limit: 50,
              remaining: 48,
              resetAt: '2024-01-01T01:00:00Z',
            },
            authType: 'api',
          },
          usage: {
            currentPeriodCost: 1.23,
            limit: 100.0,
            plan: 'pro',
          },
        }),
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      const result = await client.getUsageLimits()

      expect(result.success).toBe(true)
      expect(result.rateLimit.sync.limit).toBe(100)
      expect(result.rateLimit.async.limit).toBe(50)
      expect(result.usage.currentPeriodCost).toBe(1.23)
      expect(result.usage.plan).toBe('pro')

      // Verify correct endpoint was called
      const calls = vi.mocked(fetch.default).mock.calls
      expect(calls[0][0]).toBe('https://test.sim.ai/api/users/me/usage-limits')
    })

    it('should handle unauthorized error', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: vi.fn().mockResolvedValue({
          error: 'Invalid API key',
          code: 'UNAUTHORIZED',
        }),
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      await expect(client.getUsageLimits()).rejects.toThrow(SimStudioError)
      await expect(client.getUsageLimits()).rejects.toThrow('Invalid API key')
    })
  })

  describe('executeWorkflow - streaming with selectedOutputs', () => {
    it('should include stream and selectedOutputs in request body', async () => {
      const fetch = await import('node-fetch')
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          success: true,
          output: {},
        }),
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      vi.mocked(fetch.default).mockResolvedValue(mockResponse as any)

      await client.executeWorkflow('workflow-id', {
        input: { message: 'test' },
        stream: true,
        selectedOutputs: ['agent1.content', 'agent2.content'],
      })

      const calls = vi.mocked(fetch.default).mock.calls
      const requestBody = JSON.parse(calls[0][1]?.body as string)

      expect(requestBody).toHaveProperty('message', 'test')
      expect(requestBody).toHaveProperty('stream', true)
      expect(requestBody).toHaveProperty('selectedOutputs')
      expect(requestBody.selectedOutputs).toEqual(['agent1.content', 'agent2.content'])
    })
  })
})

describe('SimStudioError', () => {
  it('should create error with message', () => {
    const error = new SimStudioError('Test error')
    expect(error.message).toBe('Test error')
    expect(error.name).toBe('SimStudioError')
  })

  it('should create error with code and status', () => {
    const error = new SimStudioError('Test error', 'TEST_CODE', 400)
    expect(error.message).toBe('Test error')
    expect(error.code).toBe('TEST_CODE')
    expect(error.status).toBe(400)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/packages/ts-sdk/src/index.ts

```typescript
import fetch from 'node-fetch'

export interface SimStudioConfig {
  apiKey: string
  baseUrl?: string
}

export interface WorkflowExecutionResult {
  success: boolean
  output?: any
  error?: string
  logs?: any[]
  metadata?: {
    duration?: number
    executionId?: string
    [key: string]: any
  }
  traceSpans?: any[]
  totalDuration?: number
}

export interface WorkflowStatus {
  isDeployed: boolean
  deployedAt?: string
  needsRedeployment: boolean
}

export interface ExecutionOptions {
  input?: any
  timeout?: number
  stream?: boolean
  selectedOutputs?: string[]
  async?: boolean
}

export interface AsyncExecutionResult {
  success: boolean
  taskId: string
  status: 'queued'
  createdAt: string
  links: {
    status: string
  }
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
}

export interface UsageLimits {
  success: boolean
  rateLimit: {
    sync: {
      isLimited: boolean
      limit: number
      remaining: number
      resetAt: string
    }
    async: {
      isLimited: boolean
      limit: number
      remaining: number
      resetAt: string
    }
    authType: string
  }
  usage: {
    currentPeriodCost: number
    limit: number
    plan: string
  }
}

export class SimStudioError extends Error {
  public code?: string
  public status?: number

  constructor(message: string, code?: string, status?: number) {
    super(message)
    this.name = 'SimStudioError'
    this.code = code
    this.status = status
  }
}

/**
 * Remove trailing slashes from a URL
 * Uses string operations instead of regex to prevent ReDoS attacks
 * @param url - The URL to normalize
 * @returns URL without trailing slashes
 */
function normalizeBaseUrl(url: string): string {
  let normalized = url
  while (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }
  return normalized
}

export class SimStudioClient {
  private apiKey: string
  private baseUrl: string
  private rateLimitInfo: RateLimitInfo | null = null

  constructor(config: SimStudioConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = normalizeBaseUrl(config.baseUrl || 'https://sim.ai')
  }

  /**
   * Execute a workflow with optional input data
   * If async is true, returns immediately with a task ID
   */
  /**
   * Convert File objects in input to API format (base64)
   * Recursively processes nested objects and arrays
   */
  private async convertFilesToBase64(
    value: any,
    visited: WeakSet<object> = new WeakSet()
  ): Promise<any> {
    if (typeof File !== 'undefined' && value instanceof File) {
      const arrayBuffer = await value.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64 = buffer.toString('base64')

      return {
        type: 'file',
        data: `data:${value.type || 'application/octet-stream'};base64,${base64}`,
        name: value.name,
        mime: value.type || 'application/octet-stream',
      }
    }

    if (Array.isArray(value)) {
      if (visited.has(value)) {
        return '[Circular]'
      }
      visited.add(value)
      const result = await Promise.all(
        value.map((item) => this.convertFilesToBase64(item, visited))
      )
      visited.delete(value)
      return result
    }

    if (value !== null && typeof value === 'object') {
      if (visited.has(value)) {
        return '[Circular]'
      }
      visited.add(value)
      const converted: any = {}
      for (const [key, val] of Object.entries(value)) {
        converted[key] = await this.convertFilesToBase64(val, visited)
      }
      visited.delete(value)
      return converted
    }

    return value
  }

  async executeWorkflow(
    workflowId: string,
    options: ExecutionOptions = {}
  ): Promise<WorkflowExecutionResult | AsyncExecutionResult> {
    const url = `${this.baseUrl}/api/workflows/${workflowId}/execute`
    const { input, timeout = 30000, stream, selectedOutputs, async } = options

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT')), timeout)
      })

      // Build headers - async execution uses X-Execution-Mode header
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      }
      if (async) {
        headers['X-Execution-Mode'] = 'async'
      }

      // Build JSON body - spread input at root level, then add API control parameters
      let jsonBody: any = input !== undefined ? { ...input } : {}

      // Convert any File objects in the input to base64 format
      jsonBody = await this.convertFilesToBase64(jsonBody)

      if (stream !== undefined) {
        jsonBody.stream = stream
      }
      if (selectedOutputs !== undefined) {
        jsonBody.selectedOutputs = selectedOutputs
      }

      const fetchPromise = fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(jsonBody),
      })

      const response = await Promise.race([fetchPromise, timeoutPromise])

      // Extract rate limit headers
      this.updateRateLimitInfo(response)

      // Handle rate limiting with retry
      if (response.status === 429) {
        const retryAfter = this.rateLimitInfo?.retryAfter || 1000
        throw new SimStudioError(
          `Rate limit exceeded. Retry after ${retryAfter}ms`,
          'RATE_LIMIT_EXCEEDED',
          429
        )
      }

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as unknown as any
        throw new SimStudioError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          errorData.code,
          response.status
        )
      }

      const result = await response.json()
      return result as WorkflowExecutionResult | AsyncExecutionResult
    } catch (error: any) {
      if (error instanceof SimStudioError) {
        throw error
      }

      if (error.message === 'TIMEOUT') {
        throw new SimStudioError(`Workflow execution timed out after ${timeout}ms`, 'TIMEOUT')
      }

      throw new SimStudioError(error?.message || 'Failed to execute workflow', 'EXECUTION_ERROR')
    }
  }

  /**
   * Get the status of a workflow (deployment status, etc.)
   */
  async getWorkflowStatus(workflowId: string): Promise<WorkflowStatus> {
    const url = `${this.baseUrl}/api/workflows/${workflowId}/status`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
        },
      })

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as unknown as any
        throw new SimStudioError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          errorData.code,
          response.status
        )
      }

      const result = await response.json()
      return result as WorkflowStatus
    } catch (error: any) {
      if (error instanceof SimStudioError) {
        throw error
      }

      throw new SimStudioError(error?.message || 'Failed to get workflow status', 'STATUS_ERROR')
    }
  }

  /**
   * Execute a workflow and poll for completion (useful for long-running workflows)
   */
  async executeWorkflowSync(
    workflowId: string,
    options: ExecutionOptions = {}
  ): Promise<WorkflowExecutionResult> {
    // Ensure sync mode by explicitly setting async to false
    const syncOptions = { ...options, async: false }
    return this.executeWorkflow(workflowId, syncOptions) as Promise<WorkflowExecutionResult>
  }

  /**
   * Validate that a workflow is ready for execution
   */
  async validateWorkflow(workflowId: string): Promise<boolean> {
    try {
      const status = await this.getWorkflowStatus(workflowId)
      return status.isDeployed
    } catch (error) {
      return false
    }
  }

  /**
   * Set a new API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
  }

  /**
   * Set a new base URL
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = normalizeBaseUrl(baseUrl)
  }

  /**
   * Get the status of an async job
   * @param taskId The task ID returned from async execution
   */
  async getJobStatus(taskId: string): Promise<any> {
    const url = `${this.baseUrl}/api/jobs/${taskId}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
        },
      })

      this.updateRateLimitInfo(response)

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as unknown as any
        throw new SimStudioError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          errorData.code,
          response.status
        )
      }

      const result = await response.json()
      return result
    } catch (error: any) {
      if (error instanceof SimStudioError) {
        throw error
      }

      throw new SimStudioError(error?.message || 'Failed to get job status', 'STATUS_ERROR')
    }
  }

  /**
   * Execute workflow with automatic retry on rate limit
   */
  async executeWithRetry(
    workflowId: string,
    options: ExecutionOptions = {},
    retryOptions: RetryOptions = {}
  ): Promise<WorkflowExecutionResult | AsyncExecutionResult> {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 30000,
      backoffMultiplier = 2,
    } = retryOptions

    let lastError: SimStudioError | null = null
    let delay = initialDelay

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeWorkflow(workflowId, options)
      } catch (error: any) {
        if (!(error instanceof SimStudioError) || error.code !== 'RATE_LIMIT_EXCEEDED') {
          throw error
        }

        lastError = error

        // Don't retry after last attempt
        if (attempt === maxRetries) {
          break
        }

        // Use retry-after if provided, otherwise use exponential backoff
        const waitTime =
          error.status === 429 && this.rateLimitInfo?.retryAfter
            ? this.rateLimitInfo.retryAfter
            : Math.min(delay, maxDelay)

        // Add jitter (±25%)
        const jitter = waitTime * (0.75 + Math.random() * 0.5)

        await new Promise((resolve) => setTimeout(resolve, jitter))

        // Exponential backoff for next attempt
        delay *= backoffMultiplier
      }
    }

    throw lastError || new SimStudioError('Max retries exceeded', 'MAX_RETRIES_EXCEEDED')
  }

  /**
   * Get current rate limit information
   */
  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo
  }

  /**
   * Update rate limit info from response headers
   * @private
   */
  private updateRateLimitInfo(response: any): void {
    const limit = response.headers.get('x-ratelimit-limit')
    const remaining = response.headers.get('x-ratelimit-remaining')
    const reset = response.headers.get('x-ratelimit-reset')
    const retryAfter = response.headers.get('retry-after')

    if (limit || remaining || reset) {
      this.rateLimitInfo = {
        limit: limit ? Number.parseInt(limit, 10) : 0,
        remaining: remaining ? Number.parseInt(remaining, 10) : 0,
        reset: reset ? Number.parseInt(reset, 10) : 0,
        retryAfter: retryAfter ? Number.parseInt(retryAfter, 10) * 1000 : undefined,
      }
    }
  }

  /**
   * Get current usage limits and quota information
   */
  async getUsageLimits(): Promise<UsageLimits> {
    const url = `${this.baseUrl}/api/users/me/usage-limits`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
        },
      })

      this.updateRateLimitInfo(response)

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as unknown as any
        throw new SimStudioError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          errorData.code,
          response.status
        )
      }

      const result = await response.json()
      return result as UsageLimits
    } catch (error: any) {
      if (error instanceof SimStudioError) {
        throw error
      }

      throw new SimStudioError(error?.message || 'Failed to get usage limits', 'USAGE_ERROR')
    }
  }
}

// Export types and classes
export { SimStudioClient as default }
```

--------------------------------------------------------------------------------

````
