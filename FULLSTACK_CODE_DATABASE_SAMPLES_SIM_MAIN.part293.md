---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 293
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 293 of 933)

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

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/providers/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import type { StreamingExecution } from '@/executor/types'
import { executeProviderRequest } from '@/providers'
import { getApiKey } from '@/providers/utils'

const logger = createLogger('ProvidersAPI')

export const dynamic = 'force-dynamic'

/**
 * Server-side proxy for provider requests
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()

  try {
    logger.info(`[${requestId}] Provider API request started`, {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('User-Agent'),
      contentType: request.headers.get('Content-Type'),
    })

    const body = await request.json()
    const {
      provider,
      model,
      systemPrompt,
      context,
      tools,
      temperature,
      maxTokens,
      apiKey,
      azureEndpoint,
      azureApiVersion,
      vertexProject,
      vertexLocation,
      responseFormat,
      workflowId,
      workspaceId,
      stream,
      messages,
      environmentVariables,
      workflowVariables,
      blockData,
      blockNameMapping,
      reasoningEffort,
      verbosity,
    } = body

    logger.info(`[${requestId}] Provider request details`, {
      provider,
      model,
      hasSystemPrompt: !!systemPrompt,
      hasContext: !!context,
      hasTools: !!tools?.length,
      toolCount: tools?.length || 0,
      hasApiKey: !!apiKey,
      hasAzureEndpoint: !!azureEndpoint,
      hasAzureApiVersion: !!azureApiVersion,
      hasVertexProject: !!vertexProject,
      hasVertexLocation: !!vertexLocation,
      hasResponseFormat: !!responseFormat,
      workflowId,
      stream: !!stream,
      hasMessages: !!messages?.length,
      messageCount: messages?.length || 0,
      hasEnvironmentVariables:
        !!environmentVariables && Object.keys(environmentVariables).length > 0,
      hasWorkflowVariables: !!workflowVariables && Object.keys(workflowVariables).length > 0,
      reasoningEffort,
      verbosity,
    })

    let finalApiKey: string
    try {
      finalApiKey = getApiKey(provider, model, apiKey)
    } catch (error) {
      logger.error(`[${requestId}] Failed to get API key:`, {
        provider,
        model,
        error: error instanceof Error ? error.message : String(error),
        hasProvidedApiKey: !!apiKey,
      })
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'API key error' },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Executing provider request`, {
      provider,
      model,
      workflowId,
      hasApiKey: !!finalApiKey,
    })

    // Execute provider request directly with the managed key
    const response = await executeProviderRequest(provider, {
      model,
      systemPrompt,
      context,
      tools,
      temperature,
      maxTokens,
      apiKey: finalApiKey,
      azureEndpoint,
      azureApiVersion,
      vertexProject,
      vertexLocation,
      responseFormat,
      workflowId,
      workspaceId,
      stream,
      messages,
      environmentVariables,
      workflowVariables,
      blockData,
      blockNameMapping,
      reasoningEffort,
      verbosity,
    })

    const executionTime = Date.now() - startTime
    logger.info(`[${requestId}] Provider request completed successfully`, {
      provider,
      model,
      workflowId,
      executionTime,
      responseType:
        response instanceof ReadableStream
          ? 'stream'
          : response && typeof response === 'object' && 'stream' in response
            ? 'streaming-execution'
            : 'json',
    })

    // Check if the response is a StreamingExecution
    if (
      response &&
      typeof response === 'object' &&
      'stream' in response &&
      'execution' in response
    ) {
      const streamingExec = response as StreamingExecution
      logger.info(`[${requestId}] Received StreamingExecution from provider`)

      // Extract the stream and execution data
      const stream = streamingExec.stream
      const executionData = streamingExec.execution

      // Attach the execution data as a custom header
      // We need to safely serialize the execution data to avoid circular references
      let executionDataHeader
      try {
        // Create a safe version of execution data with the most important fields
        const safeExecutionData = {
          success: executionData.success,
          output: {
            // Sanitize content to remove non-ASCII characters that would cause ByteString errors
            content: executionData.output?.content
              ? String(executionData.output.content).replace(/[\u0080-\uFFFF]/g, '')
              : '',
            model: executionData.output?.model,
            tokens: executionData.output?.tokens || {
              prompt: 0,
              completion: 0,
              total: 0,
            },
            // Sanitize any potential Unicode characters in tool calls
            toolCalls: executionData.output?.toolCalls
              ? sanitizeToolCalls(executionData.output.toolCalls)
              : undefined,
            providerTiming: executionData.output?.providerTiming,
            cost: executionData.output?.cost,
          },
          error: executionData.error,
          logs: [], // Strip logs from header to avoid encoding issues
          metadata: {
            startTime: executionData.metadata?.startTime,
            endTime: executionData.metadata?.endTime,
            duration: executionData.metadata?.duration,
          },
          isStreaming: true, // Always mark streaming execution data as streaming
          blockId: executionData.logs?.[0]?.blockId,
          blockName: executionData.logs?.[0]?.blockName,
          blockType: executionData.logs?.[0]?.blockType,
        }
        executionDataHeader = JSON.stringify(safeExecutionData)
      } catch (error) {
        logger.error(`[${requestId}] Failed to serialize execution data:`, error)
        executionDataHeader = JSON.stringify({
          success: executionData.success,
          error: 'Failed to serialize full execution data',
        })
      }

      // Return the stream with execution data in a header
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'X-Execution-Data': executionDataHeader,
        },
      })
    }

    // Check if the response is a ReadableStream for streaming
    if (response instanceof ReadableStream) {
      logger.info(`[${requestId}] Streaming response from provider`)
      return new Response(response, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // Return regular JSON response for non-streaming
    return NextResponse.json(response)
  } catch (error) {
    const executionTime = Date.now() - startTime
    logger.error(`[${requestId}] Provider request failed:`, {
      error: error instanceof Error ? error.message : String(error),
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorStack: error instanceof Error ? error.stack : undefined,
      executionTime,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

/**
 * Helper function to sanitize tool calls to remove Unicode characters
 */
function sanitizeToolCalls(toolCalls: any) {
  // If it's an object with a list property, sanitize the list
  if (toolCalls && typeof toolCalls === 'object' && Array.isArray(toolCalls.list)) {
    return {
      ...toolCalls,
      list: toolCalls.list.map(sanitizeToolCall),
    }
  }

  // If it's an array, sanitize each item
  if (Array.isArray(toolCalls)) {
    return toolCalls.map(sanitizeToolCall)
  }

  return toolCalls
}

/**
 * Sanitize a single tool call to remove Unicode characters
 */
function sanitizeToolCall(toolCall: any) {
  if (!toolCall || typeof toolCall !== 'object') return toolCall

  // Create a sanitized copy
  const sanitized = { ...toolCall }

  // Sanitize any string fields that might contain Unicode
  if (typeof sanitized.name === 'string') {
    sanitized.name = sanitized.name.replace(/[\u0080-\uFFFF]/g, '')
  }

  // Sanitize input/arguments
  if (sanitized.input && typeof sanitized.input === 'object') {
    sanitized.input = sanitizeObject(sanitized.input)
  }

  if (sanitized.arguments && typeof sanitized.arguments === 'object') {
    sanitized.arguments = sanitizeObject(sanitized.arguments)
  }

  // Sanitize output/result
  if (sanitized.output && typeof sanitized.output === 'object') {
    sanitized.output = sanitizeObject(sanitized.output)
  }

  if (sanitized.result && typeof sanitized.result === 'object') {
    sanitized.result = sanitizeObject(sanitized.result)
  }

  // Sanitize error message
  if (typeof sanitized.error === 'string') {
    sanitized.error = sanitized.error.replace(/[\u0080-\uFFFF]/g, '')
  }

  return sanitized
}

/**
 * Recursively sanitize an object to remove Unicode characters from strings
 */
function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item))
  }

  // Handle objects
  const result: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = value.replace(/[\u0080-\uFFFF]/g, '')
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value)
    } else {
      result[key] = value
    }
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/providers/base/models/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { getBaseModelProviders } from '@/providers/utils'

export async function GET() {
  try {
    const allModels = Object.keys(getBaseModelProviders())
    return NextResponse.json({ models: allModels })
  } catch (error) {
    return NextResponse.json({ models: [], error: 'Failed to fetch models' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/providers/ollama/models/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'
import type { ModelsObject } from '@/providers/ollama/types'

const logger = createLogger('OllamaModelsAPI')
const OLLAMA_HOST = env.OLLAMA_URL || 'http://localhost:11434'

/**
 * Get available Ollama models
 */
export async function GET(request: NextRequest) {
  try {
    logger.info('Fetching Ollama models', {
      host: OLLAMA_HOST,
    })

    const response = await fetch(`${OLLAMA_HOST}/api/tags`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      logger.warn('Ollama service is not available', {
        status: response.status,
        statusText: response.statusText,
      })
      return NextResponse.json({ models: [] })
    }

    const data = (await response.json()) as ModelsObject
    const models = data.models.map((model) => model.name)

    logger.info('Successfully fetched Ollama models', {
      count: models.length,
      models,
    })

    return NextResponse.json({ models })
  } catch (error) {
    logger.error('Failed to fetch Ollama models', {
      error: error instanceof Error ? error.message : 'Unknown error',
      host: OLLAMA_HOST,
    })

    return NextResponse.json({ models: [] })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/providers/openrouter/models/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { filterBlacklistedModels } from '@/providers/utils'

const logger = createLogger('OpenRouterModelsAPI')

interface OpenRouterModel {
  id: string
}

interface OpenRouterResponse {
  data: OpenRouterModel[]
}

export async function GET(_request: NextRequest) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      logger.warn('Failed to fetch OpenRouter models', {
        status: response.status,
        statusText: response.statusText,
      })
      return NextResponse.json({ models: [] })
    }

    const data = (await response.json()) as OpenRouterResponse
    const allModels = Array.from(new Set(data.data?.map((model) => `openrouter/${model.id}`) ?? []))
    const models = filterBlacklistedModels(allModels)

    logger.info('Successfully fetched OpenRouter models', {
      count: models.length,
      filtered: allModels.length - models.length,
    })

    return NextResponse.json({ models })
  } catch (error) {
    logger.error('Error fetching OpenRouter models', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ models: [] })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/providers/vllm/models/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('VLLMModelsAPI')

/**
 * Get available vLLM models
 */
export async function GET(request: NextRequest) {
  const baseUrl = (env.VLLM_BASE_URL || '').replace(/\/$/, '')

  if (!baseUrl) {
    logger.info('VLLM_BASE_URL not configured')
    return NextResponse.json({ models: [] })
  }

  try {
    logger.info('Fetching vLLM models', {
      baseUrl,
    })

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (env.VLLM_API_KEY) {
      headers.Authorization = `Bearer ${env.VLLM_API_KEY}`
    }

    const response = await fetch(`${baseUrl}/v1/models`, {
      headers,
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      logger.warn('vLLM service is not available', {
        status: response.status,
        statusText: response.statusText,
      })
      return NextResponse.json({ models: [] })
    }

    const data = (await response.json()) as { data: Array<{ id: string }> }
    const models = data.data.map((model) => `vllm/${model.id}`)

    logger.info('Successfully fetched vLLM models', {
      count: models.length,
      models,
    })

    return NextResponse.json({ models })
  } catch (error) {
    logger.error('Failed to fetch vLLM models', {
      error: error instanceof Error ? error.message : 'Unknown error',
      baseUrl,
    })

    return NextResponse.json({ models: [] })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/proxy/route.ts
Signals: Next.js, Zod

```typescript
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateInternalToken } from '@/lib/auth/internal'
import { isDev } from '@/lib/core/config/feature-flags'
import { createPinnedUrl, validateUrlWithDNS } from '@/lib/core/security/input-validation'
import { generateRequestId } from '@/lib/core/utils/request'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { executeTool } from '@/tools'
import { getTool, validateRequiredParametersAfterMerge } from '@/tools/utils'

const logger = createLogger('ProxyAPI')

const proxyPostSchema = z.object({
  toolId: z.string().min(1, 'toolId is required'),
  params: z.record(z.any()).optional().default({}),
  executionContext: z
    .object({
      workflowId: z.string().optional(),
      workspaceId: z.string().optional(),
      executionId: z.string().optional(),
      userId: z.string().optional(),
    })
    .optional(),
})

/**
 * Creates a minimal set of default headers for proxy requests
 * @returns Record of HTTP headers
 */
const getProxyHeaders = (): Record<string, string> => {
  return {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  }
}

/**
 * Formats a response with CORS headers
 * @param responseData Response data object
 * @param status HTTP status code
 * @returns NextResponse with CORS headers
 */
const formatResponse = (responseData: any, status = 200) => {
  return NextResponse.json(responseData, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

/**
 * Creates an error response with consistent formatting
 * @param error Error object or message
 * @param status HTTP status code
 * @param additionalData Additional data to include in the response
 * @returns Formatted error response
 */
const createErrorResponse = (error: any, status = 500, additionalData = {}) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  logger.error('Creating error response', {
    errorMessage,
    status,
    stack: isDev ? errorStack : undefined,
  })

  return formatResponse(
    {
      success: false,
      error: errorMessage,
      stack: isDev ? errorStack : undefined,
      ...additionalData,
    },
    status
  )
}

/**
 * GET handler for direct external URL proxying
 * This allows for GET requests to external APIs
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const targetUrl = url.searchParams.get('url')
  const requestId = generateRequestId()

  // Vault download proxy: /api/proxy?vaultDownload=1&bucket=...&object=...&credentialId=...
  const vaultDownload = url.searchParams.get('vaultDownload')
  if (vaultDownload === '1') {
    try {
      const bucket = url.searchParams.get('bucket')
      const objectParam = url.searchParams.get('object')
      const credentialId = url.searchParams.get('credentialId')

      if (!bucket || !objectParam || !credentialId) {
        return createErrorResponse('Missing bucket, object, or credentialId', 400)
      }

      // Fetch access token using existing token API
      const baseUrl = new URL(getBaseUrl())
      const tokenUrl = new URL('/api/auth/oauth/token', baseUrl)

      // Build headers: forward session cookies if present; include internal auth for server-side
      const tokenHeaders: Record<string, string> = { 'Content-Type': 'application/json' }
      const incomingCookie = request.headers.get('cookie')
      if (incomingCookie) tokenHeaders.Cookie = incomingCookie
      try {
        const internalToken = await generateInternalToken()
        tokenHeaders.Authorization = `Bearer ${internalToken}`
      } catch (_e) {
        // best-effort internal auth
      }

      // Optional workflow context for collaboration auth
      const workflowId = url.searchParams.get('workflowId') || undefined

      const tokenRes = await fetch(tokenUrl.toString(), {
        method: 'POST',
        headers: tokenHeaders,
        body: JSON.stringify({ credentialId, workflowId }),
      })

      if (!tokenRes.ok) {
        const err = await tokenRes.text()
        return createErrorResponse(`Failed to fetch access token: ${err}`, 401)
      }

      const tokenJson = await tokenRes.json()
      const accessToken = tokenJson.accessToken
      if (!accessToken) {
        return createErrorResponse('No access token available', 401)
      }

      // Avoid double-encoding: incoming object may already be percent-encoded
      const objectDecoded = decodeURIComponent(objectParam)
      const gcsUrl = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(
        bucket
      )}/o/${encodeURIComponent(objectDecoded)}?alt=media`

      const fileRes = await fetch(gcsUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!fileRes.ok) {
        const errText = await fileRes.text()
        return createErrorResponse(errText || 'Failed to download file', fileRes.status)
      }

      const headers = new Headers()
      fileRes.headers.forEach((v, k) => headers.set(k, v))
      return new NextResponse(fileRes.body, { status: 200, headers })
    } catch (error: any) {
      logger.error(`[${requestId}] Vault download proxy failed`, {
        error: error instanceof Error ? error.message : String(error),
      })
      return createErrorResponse('Vault download failed', 500)
    }
  }

  if (!targetUrl) {
    logger.error(`[${requestId}] Missing 'url' parameter`)
    return createErrorResponse("Missing 'url' parameter", 400)
  }

  const urlValidation = await validateUrlWithDNS(targetUrl)
  if (!urlValidation.isValid) {
    logger.warn(`[${requestId}] Blocked proxy request`, {
      url: targetUrl.substring(0, 100),
      error: urlValidation.error,
    })
    return createErrorResponse(urlValidation.error || 'Invalid URL', 403)
  }

  const method = url.searchParams.get('method') || 'GET'

  const bodyParam = url.searchParams.get('body')
  let body: string | undefined

  if (bodyParam && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    try {
      body = decodeURIComponent(bodyParam)
    } catch (error) {
      logger.warn(`[${requestId}] Failed to decode body parameter`, error)
    }
  }

  const customHeaders: Record<string, string> = {}

  for (const [key, value] of url.searchParams.entries()) {
    if (key.startsWith('header.')) {
      const headerName = key.substring(7)
      customHeaders[headerName] = value
    }
  }

  if (body && !customHeaders['Content-Type']) {
    customHeaders['Content-Type'] = 'application/json'
  }

  logger.info(`[${requestId}] Proxying ${method} request to: ${targetUrl}`)

  try {
    const pinnedUrl = createPinnedUrl(targetUrl, urlValidation.resolvedIP!)
    const response = await fetch(pinnedUrl, {
      method: method,
      headers: {
        ...getProxyHeaders(),
        ...customHeaders,
        Host: urlValidation.originalHostname!,
      },
      body: body || undefined,
    })

    const contentType = response.headers.get('content-type') || ''
    let data

    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    const errorMessage = !response.ok
      ? data && typeof data === 'object' && data.error
        ? `${data.error.message || JSON.stringify(data.error)}`
        : response.statusText || `HTTP error ${response.status}`
      : undefined

    if (!response.ok) {
      logger.error(`[${requestId}] External API error: ${response.status} ${response.statusText}`)
    }

    return formatResponse({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data,
      error: errorMessage,
    })
  } catch (error: any) {
    logger.error(`[${requestId}] Proxy GET request failed`, {
      url: targetUrl,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    return createErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = new Date()
  const startTimeISO = startTime.toISOString()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })
    if (!authResult.success) {
      logger.error(`[${requestId}] Authentication failed for proxy:`, authResult.error)
      return createErrorResponse('Unauthorized', 401)
    }

    let requestBody
    try {
      requestBody = await request.json()
    } catch (parseError) {
      logger.error(`[${requestId}] Failed to parse request body`, {
        error: parseError instanceof Error ? parseError.message : String(parseError),
      })
      throw new Error('Invalid JSON in request body')
    }

    const validationResult = proxyPostSchema.safeParse(requestBody)
    if (!validationResult.success) {
      logger.error(`[${requestId}] Request validation failed`, {
        errors: validationResult.error.errors,
      })
      const errorMessages = validationResult.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
      throw new Error(`Validation failed: ${errorMessages}`)
    }

    const { toolId, params } = validationResult.data

    logger.info(`[${requestId}] Processing tool: ${toolId}`)

    const tool = getTool(toolId)

    if (!tool) {
      logger.error(`[${requestId}] Tool not found: ${toolId}`)
      throw new Error(`Tool not found: ${toolId}`)
    }

    try {
      validateRequiredParametersAfterMerge(toolId, tool, params)
    } catch (validationError) {
      logger.warn(`[${requestId}] Tool validation failed for ${toolId}`, {
        error: validationError instanceof Error ? validationError.message : String(validationError),
      })

      const endTime = new Date()
      const endTimeISO = endTime.toISOString()
      const duration = endTime.getTime() - startTime.getTime()

      return createErrorResponse(validationError, 400, {
        startTime: startTimeISO,
        endTime: endTimeISO,
        duration,
      })
    }

    const hasFileOutputs =
      tool.outputs &&
      Object.values(tool.outputs).some(
        (output) => output.type === 'file' || output.type === 'file[]'
      )

    const result = await executeTool(
      toolId,
      params,
      true, // skipProxy (we're already in the proxy)
      !hasFileOutputs, // skipPostProcess (don't skip if tool has file outputs)
      undefined // execution context is not available in proxy context
    )

    if (!result.success) {
      logger.warn(`[${requestId}] Tool execution failed for ${toolId}`, {
        error: result.error || 'Unknown error',
      })

      throw new Error(result.error || 'Tool execution failed')
    }

    const endTime = new Date()
    const endTimeISO = endTime.toISOString()
    const duration = endTime.getTime() - startTime.getTime()

    const responseWithTimingData = {
      ...result,
      startTime: startTimeISO,
      endTime: endTimeISO,
      duration,
      timing: {
        startTime: startTimeISO,
        endTime: endTimeISO,
        duration,
      },
    }

    logger.info(`[${requestId}] Tool executed successfully: ${toolId} (${duration}ms)`)

    return formatResponse(responseWithTimingData)
  } catch (error: any) {
    logger.error(`[${requestId}] Proxy request failed`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })

    const endTime = new Date()
    const endTimeISO = endTime.toISOString()
    const duration = endTime.getTime() - startTime.getTime()

    return createErrorResponse(error, 500, {
      startTime: startTimeISO,
      endTime: endTimeISO,
      duration,
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/proxy/image/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { validateImageUrl } from '@/lib/core/security/input-validation'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ImageProxyAPI')

/**
 * Proxy for fetching images
 * This allows client-side requests to fetch images from various sources while avoiding CORS issues
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const imageUrl = url.searchParams.get('url')
  const requestId = generateRequestId()

  const authResult = await checkHybridAuth(request, { requireWorkflowId: false })
  if (!authResult.success) {
    logger.error(`[${requestId}] Authentication failed for image proxy:`, authResult.error)
    return new NextResponse('Unauthorized', { status: 401 })
  }

  if (!imageUrl) {
    logger.error(`[${requestId}] Missing 'url' parameter`)
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  const urlValidation = validateImageUrl(imageUrl)
  if (!urlValidation.isValid) {
    logger.warn(`[${requestId}] Blocked image proxy request`, {
      url: imageUrl.substring(0, 100),
      error: urlValidation.error,
    })
    return new NextResponse(urlValidation.error || 'Invalid image URL', { status: 403 })
  }

  logger.info(`[${requestId}] Proxying image request for: ${imageUrl}`)

  try {
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'image/webp,image/avif,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://sim.ai/',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    })

    if (!imageResponse.ok) {
      logger.error(`[${requestId}] Image fetch failed:`, {
        status: imageResponse.status,
        statusText: imageResponse.statusText,
      })
      return new NextResponse(`Failed to fetch image: ${imageResponse.statusText}`, {
        status: imageResponse.status,
      })
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'

    const imageBlob = await imageResponse.blob()

    if (imageBlob.size === 0) {
      logger.error(`[${requestId}] Empty image blob received`)
      return new NextResponse('Empty image received', { status: 404 })
    }

    return new NextResponse(imageBlob, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`[${requestId}] Image proxy error:`, { error: errorMessage })

    return new NextResponse(`Failed to proxy image: ${errorMessage}`, {
      status: 500,
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
```

--------------------------------------------------------------------------------

````
