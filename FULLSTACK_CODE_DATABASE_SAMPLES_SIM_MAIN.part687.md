---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 687
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 687 of 933)

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

---[FILE: update_annotation.ts]---
Location: sim-main/apps/sim/tools/grafana/update_annotation.ts

```typescript
import type {
  GrafanaUpdateAnnotationParams,
  GrafanaUpdateAnnotationResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const updateAnnotationTool: ToolConfig<
  GrafanaUpdateAnnotationParams,
  GrafanaUpdateAnnotationResponse
> = {
  id: 'grafana_update_annotation',
  name: 'Grafana Update Annotation',
  description: 'Update an existing annotation',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana Service Account Token',
    },
    baseUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana instance URL (e.g., https://your-grafana.com)',
    },
    organizationId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization ID for multi-org Grafana instances',
    },
    annotationId: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the annotation to update',
    },
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'New text content for the annotation',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of new tags',
    },
    time: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'New start time in epoch milliseconds',
    },
    timeEnd: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'New end time in epoch milliseconds',
    },
  },

  request: {
    url: (params) => `${params.baseUrl.replace(/\/$/, '')}/api/annotations/${params.annotationId}`,
    method: 'PATCH',
    headers: (params) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }
      if (params.organizationId) {
        headers['X-Grafana-Org-Id'] = params.organizationId
      }
      return headers
    },
    body: (params) => {
      const body: Record<string, any> = {
        text: params.text,
      }

      if (params.tags) {
        body.tags = params.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t)
      }

      if (params.time) {
        body.time = params.time
      }

      if (params.timeEnd) {
        body.timeEnd = params.timeEnd
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        id: data.id || 0,
        message: data.message || 'Annotation updated successfully',
      },
    }
  },

  outputs: {
    id: {
      type: 'number',
      description: 'The ID of the updated annotation',
    },
    message: {
      type: 'string',
      description: 'Confirmation message',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_dashboard.ts]---
Location: sim-main/apps/sim/tools/grafana/update_dashboard.ts

```typescript
import type { GrafanaUpdateDashboardParams } from '@/tools/grafana/types'
import type { ToolConfig, ToolResponse } from '@/tools/types'

// Using ToolResponse for intermediate state since this tool fetches existing data first
export const updateDashboardTool: ToolConfig<GrafanaUpdateDashboardParams, ToolResponse> = {
  id: 'grafana_update_dashboard',
  name: 'Grafana Update Dashboard',
  description:
    'Update an existing dashboard. Fetches the current dashboard and merges your changes.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana Service Account Token',
    },
    baseUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana instance URL (e.g., https://your-grafana.com)',
    },
    organizationId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization ID for multi-org Grafana instances',
    },
    dashboardUid: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The UID of the dashboard to update',
    },
    title: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New title for the dashboard',
    },
    folderUid: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New folder UID to move the dashboard to',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of new tags',
    },
    timezone: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Dashboard timezone (e.g., browser, utc)',
    },
    refresh: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Auto-refresh interval (e.g., 5s, 1m, 5m)',
    },
    panels: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'JSON array of panel configurations',
    },
    overwrite: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Overwrite even if there is a version conflict',
    },
    message: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Commit message for this version',
    },
  },

  request: {
    // First, GET the existing dashboard
    url: (params) =>
      `${params.baseUrl.replace(/\/$/, '')}/api/dashboards/uid/${params.dashboardUid}`,
    method: 'GET',
    headers: (params) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }
      if (params.organizationId) {
        headers['X-Grafana-Org-Id'] = params.organizationId
      }
      return headers
    },
  },

  transformResponse: async (response: Response) => {
    // Store the existing dashboard data for postProcess to use
    const data = await response.json()
    return {
      success: true,
      output: {
        _existingDashboard: data.dashboard,
        _existingMeta: data.meta,
      },
    }
  },

  postProcess: async (result, params) => {
    // Merge user changes with existing dashboard and POST the complete object
    const existingDashboard = result.output._existingDashboard
    const existingMeta = result.output._existingMeta

    if (!existingDashboard || !existingDashboard.uid) {
      return {
        success: false,
        output: {},
        error: 'Failed to fetch existing dashboard',
      }
    }

    // Build the updated dashboard by merging existing data with new params
    const updatedDashboard: Record<string, any> = {
      ...existingDashboard,
    }

    // Apply user's changes
    if (params.title) updatedDashboard.title = params.title
    if (params.timezone) updatedDashboard.timezone = params.timezone
    if (params.refresh) updatedDashboard.refresh = params.refresh

    if (params.tags) {
      updatedDashboard.tags = params.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t)
    }

    if (params.panels) {
      try {
        updatedDashboard.panels = JSON.parse(params.panels)
      } catch {
        // Keep existing panels if parse fails
      }
    }

    // Increment version for update
    if (existingDashboard.version) {
      updatedDashboard.version = existingDashboard.version
    }

    // Build the request body
    const body: Record<string, any> = {
      dashboard: updatedDashboard,
      overwrite: params.overwrite !== false,
    }

    // Use existing folder if not specified
    if (params.folderUid) {
      body.folderUid = params.folderUid
    } else if (existingMeta?.folderUid) {
      body.folderUid = existingMeta.folderUid
    }

    if (params.message) {
      body.message = params.message
    }

    // Make the POST request with the complete merged object
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }
    if (params.organizationId) {
      headers['X-Grafana-Org-Id'] = params.organizationId
    }

    const updateResponse = await fetch(`${params.baseUrl.replace(/\/$/, '')}/api/dashboards/db`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      return {
        success: false,
        output: {},
        error: `Failed to update dashboard: ${errorText}`,
      }
    }

    const data = await updateResponse.json()

    return {
      success: true,
      output: {
        id: data.id,
        uid: data.uid,
        url: data.url,
        status: data.status,
        version: data.version,
        slug: data.slug,
      },
    }
  },

  outputs: {
    id: {
      type: 'number',
      description: 'The numeric ID of the updated dashboard',
    },
    uid: {
      type: 'string',
      description: 'The UID of the updated dashboard',
    },
    url: {
      type: 'string',
      description: 'The URL path to the dashboard',
    },
    status: {
      type: 'string',
      description: 'Status of the operation (success)',
    },
    version: {
      type: 'number',
      description: 'The new version number of the dashboard',
    },
    slug: {
      type: 'string',
      description: 'URL-friendly slug of the dashboard',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/guardrails/index.ts

```typescript
export type { GuardrailsValidateInput, GuardrailsValidateOutput } from './validate'
export { guardrailsValidateTool } from './validate'
```

--------------------------------------------------------------------------------

---[FILE: validate.ts]---
Location: sim-main/apps/sim/tools/guardrails/validate.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface GuardrailsValidateInput {
  input: string
  validationType: 'json' | 'regex' | 'hallucination' | 'pii'
  regex?: string
  knowledgeBaseId?: string
  threshold?: string
  topK?: string
  model?: string
  apiKey?: string
  piiEntityTypes?: string[]
  piiMode?: string
  piiLanguage?: string
  _context?: {
    workflowId?: string
    workspaceId?: string
  }
}

export interface GuardrailsValidateOutput {
  success: boolean
  output: {
    passed: boolean
    validationType: string
    content: string
    error?: string
    score?: number
    reasoning?: string
    detectedEntities?: any[]
    maskedText?: string
  }
  error?: string
}

export const guardrailsValidateTool: ToolConfig<GuardrailsValidateInput, GuardrailsValidateOutput> =
  {
    id: 'guardrails_validate',
    name: 'Guardrails Validate',
    description:
      'Validate content using guardrails (JSON, regex, hallucination check, or PII detection)',
    version: '1.0.0',

    params: {
      input: {
        type: 'string',
        required: true,
        description: 'Content to validate (from wired block)',
      },
      validationType: {
        type: 'string',
        required: true,
        description: 'Type of validation: json, regex, hallucination, or pii',
      },
      regex: {
        type: 'string',
        required: false,
        description: 'Regex pattern (required for regex validation)',
      },
      knowledgeBaseId: {
        type: 'string',
        required: false,
        description: 'Knowledge base ID (required for hallucination check)',
      },
      threshold: {
        type: 'string',
        required: false,
        description: 'Confidence threshold (0-10 scale, default: 3, scores below fail)',
      },
      topK: {
        type: 'string',
        required: false,
        description: 'Number of chunks to retrieve from knowledge base (default: 10)',
      },
      model: {
        type: 'string',
        required: false,
        description: 'LLM model for confidence scoring (default: gpt-4o-mini)',
      },
      apiKey: {
        type: 'string',
        required: false,
        description: 'API key for LLM provider (optional if using hosted)',
      },
      piiEntityTypes: {
        type: 'array',
        required: false,
        description: 'PII entity types to detect (empty = detect all)',
      },
      piiMode: {
        type: 'string',
        required: false,
        description: 'PII action mode: block or mask (default: block)',
      },
      piiLanguage: {
        type: 'string',
        required: false,
        description: 'Language for PII detection (default: en)',
      },
    },

    outputs: {
      passed: {
        type: 'boolean',
        description: 'Whether validation passed',
      },
      validationType: {
        type: 'string',
        description: 'Type of validation performed',
      },
      input: {
        type: 'string',
        description: 'Original input',
      },
      error: {
        type: 'string',
        description: 'Error message if validation failed',
        optional: true,
      },
      score: {
        type: 'number',
        description:
          'Confidence score (0-10, 0=hallucination, 10=grounded, only for hallucination check)',
        optional: true,
      },
      reasoning: {
        type: 'string',
        description: 'Reasoning for confidence score (only for hallucination check)',
        optional: true,
      },
      detectedEntities: {
        type: 'array',
        description: 'Detected PII entities (only for PII detection)',
        optional: true,
      },
      maskedText: {
        type: 'string',
        description: 'Text with PII masked (only for PII detection in mask mode)',
        optional: true,
      },
    },

    request: {
      url: '/api/guardrails/validate',
      method: 'POST',
      headers: () => ({
        'Content-Type': 'application/json',
      }),
      body: (params: GuardrailsValidateInput) => ({
        input: params.input,
        validationType: params.validationType,
        regex: params.regex,
        knowledgeBaseId: params.knowledgeBaseId,
        threshold: params.threshold,
        topK: params.topK,
        model: params.model,
        apiKey: params.apiKey,
        piiEntityTypes: params.piiEntityTypes,
        piiMode: params.piiMode,
        piiLanguage: params.piiLanguage,
        workflowId: params._context?.workflowId,
        workspaceId: params._context?.workspaceId,
      }),
    },

    transformResponse: async (response: Response): Promise<GuardrailsValidateOutput> => {
      const result = await response.json()

      if (!response.ok && !result.output) {
        return {
          success: true,
          output: {
            passed: false,
            validationType: 'unknown',
            content: '',
            error: result.error || `Validation failed with status ${response.status}`,
          },
        }
      }

      return result
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/http/index.ts

```typescript
import { requestTool } from './request'

export const httpRequestTool = requestTool
```

--------------------------------------------------------------------------------

---[FILE: request.test.ts]---
Location: sim-main/apps/sim/tools/http/request.test.ts

```typescript
/**
 * @vitest-environment jsdom
 *
 * HTTP Request Tool Unit Tests
 *
 * This file contains unit tests for the HTTP Request tool, which is used
 * to make HTTP requests to external APIs and services.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockHttpResponses } from '@/tools/__test-utils__/mock-data'
import { ToolTester } from '@/tools/__test-utils__/test-tools'
import { requestTool } from '@/tools/http/request'

process.env.VITEST = 'true'

describe('HTTP Request Tool', () => {
  let tester: ToolTester

  beforeEach(() => {
    tester = new ToolTester(requestTool)
    process.env.NEXT_PUBLIC_APP_URL = 'https://app.simstudio.dev'
  })

  afterEach(() => {
    tester.cleanup()
    vi.resetAllMocks()
    process.env.NEXT_PUBLIC_APP_URL = undefined
  })

  describe('URL Construction', () => {
    it.concurrent('should construct URLs correctly', () => {
      expect(tester.getRequestUrl({ url: 'https://api.example.com/data' })).toBe(
        'https://api.example.com/data'
      )

      expect(
        tester.getRequestUrl({
          url: 'https://api.example.com/users/:userId/posts/:postId',
          pathParams: { userId: '123', postId: '456' },
        })
      ).toBe('https://api.example.com/users/123/posts/456')

      expect(
        tester.getRequestUrl({
          url: 'https://api.example.com/search',
          params: [
            { Key: 'q', Value: 'test query' },
            { Key: 'limit', Value: '10' },
          ],
        })
      ).toBe('https://api.example.com/search?q=test+query&limit=10')

      expect(
        tester.getRequestUrl({
          url: 'https://api.example.com/search?sort=desc',
          params: [{ Key: 'q', Value: 'test' }],
        })
      ).toBe('https://api.example.com/search?sort=desc&q=test')

      const url = tester.getRequestUrl({
        url: 'https://api.example.com/users/:userId',
        pathParams: { userId: 'user name+special&chars' },
      })
      expect(url.startsWith('https://api.example.com/users/user')).toBe(true)
      expect(url.includes('name')).toBe(true)
      expect(url.includes('special')).toBe(true)
      expect(url.includes('chars')).toBe(true)
    })
  })

  describe('Headers Construction', () => {
    it.concurrent('should set headers correctly', () => {
      expect(tester.getRequestHeaders({ url: 'https://api.example.com', method: 'GET' })).toEqual(
        {}
      )

      expect(
        tester.getRequestHeaders({
          url: 'https://api.example.com',
          method: 'GET',
          headers: [
            { Key: 'Authorization', Value: 'Bearer token123' },
            { Key: 'Accept', Value: 'application/json' },
          ],
        })
      ).toEqual({
        Authorization: 'Bearer token123',
        Accept: 'application/json',
      })

      expect(
        tester.getRequestHeaders({
          url: 'https://api.example.com',
          method: 'POST',
          body: { key: 'value' },
        })
      ).toEqual({
        'Content-Type': 'application/json',
      })
    })

    it.concurrent('should respect custom Content-Type headers', () => {
      const headers = tester.getRequestHeaders({
        url: 'https://api.example.com',
        method: 'POST',
        body: { key: 'value' },
        headers: [{ Key: 'Content-Type', Value: 'application/x-www-form-urlencoded' }],
      })
      expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded')

      const headers2 = tester.getRequestHeaders({
        url: 'https://api.example.com',
        method: 'POST',
        body: { key: 'value' },
        headers: [{ Key: 'content-type', Value: 'text/plain' }],
      })
      expect(headers2['content-type']).toBe('text/plain')
    })

    it('should set dynamic Referer header correctly', async () => {
      const originalWindow = global.window
      Object.defineProperty(global, 'window', {
        value: {
          location: {
            origin: 'https://app.simstudio.dev',
          },
        },
        writable: true,
      })

      tester.setup(mockHttpResponses.simple)

      await tester.execute({
        url: 'https://api.example.com',
        method: 'GET',
      })

      const fetchCall = (global.fetch as any).mock.calls[0]
      expect(fetchCall[1].headers.Referer).toBe('https://app.simstudio.dev')

      global.window = originalWindow
    })

    it('should set dynamic Host header correctly', async () => {
      tester.setup(mockHttpResponses.simple)

      await tester.execute({
        url: 'https://api.example.com/endpoint',
        method: 'GET',
      })

      const fetchCall = (global.fetch as any).mock.calls[0]
      expect(fetchCall[1].headers.Host).toBe('api.example.com')

      await tester.execute({
        url: 'https://api.example.com/endpoint',
        method: 'GET',
        headers: [{ cells: { Key: 'Host', Value: 'custom-host.com' } }],
      })

      const userHeaderCall = (global.fetch as any).mock.calls[1]
      expect(userHeaderCall[1].headers.Host).toBe('custom-host.com')
    })
  })

  describe('Body Construction', () => {
    it.concurrent('should handle JSON bodies correctly', () => {
      const body = { username: 'test', password: 'secret' }

      expect(
        tester.getRequestBody({
          url: 'https://api.example.com',
          body,
        })
      ).toEqual(body)
    })

    it.concurrent('should handle FormData correctly', () => {
      const formData = { file: 'test.txt', content: 'file content' }

      const result = tester.getRequestBody({
        url: 'https://api.example.com',
        formData,
      })

      expect(result).toBeInstanceOf(FormData)
    })
  })

  describe('Request Execution', () => {
    it('should apply default and dynamic headers to requests', async () => {
      tester.setup(mockHttpResponses.simple)

      const originalWindow = global.window
      Object.defineProperty(global, 'window', {
        value: {
          location: {
            origin: 'https://app.simstudio.dev',
          },
        },
        writable: true,
      })

      await tester.execute({
        url: 'https://api.example.com/data',
        method: 'GET',
      })

      const fetchCall = (global.fetch as any).mock.calls[0]
      const headers = fetchCall[1].headers

      expect(headers.Host).toBe('api.example.com')
      expect(headers.Referer).toBe('https://app.simstudio.dev')
      expect(headers['User-Agent']).toContain('Mozilla')
      expect(headers.Accept).toBe('*/*')
      expect(headers['Accept-Encoding']).toContain('gzip')
      expect(headers['Cache-Control']).toBe('no-cache')
      expect(headers.Connection).toBe('keep-alive')
      expect(headers['Sec-Ch-Ua']).toContain('Chromium')

      global.window = originalWindow
    })

    it('should handle successful GET requests', async () => {
      tester.setup(mockHttpResponses.simple)

      const result = await tester.execute({
        url: 'https://api.example.com/data',
        method: 'GET',
      })

      expect(result.success).toBe(true)
      expect(result.output.data).toEqual(mockHttpResponses.simple)
      expect(result.output.status).toBe(200)
      expect(result.output.headers).toHaveProperty('content-type')
    })

    it('should handle POST requests with body', async () => {
      tester.setup({ result: 'success' })

      const body = { name: 'Test User', email: 'test@example.com' }

      await tester.execute({
        url: 'https://api.example.com/users',
        method: 'POST',
        body,
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.any(String),
        })
      )

      const fetchCall = (global.fetch as any).mock.calls[0]
      const bodyArg = JSON.parse(fetchCall[1].body)
      expect(bodyArg).toEqual(body)
    })

    it('should handle POST requests with URL-encoded form data', async () => {
      tester.setup({ result: 'success' })

      const body = { username: 'testuser123', password: 'testpass456', email: 'test@example.com' }

      await tester.execute({
        url: 'https://api.example.com/oauth/token',
        method: 'POST',
        body,
        headers: [{ cells: { Key: 'Content-Type', Value: 'application/x-www-form-urlencoded' } }],
      })

      const fetchCall = (global.fetch as any).mock.calls[0]
      expect(fetchCall[0]).toBe('https://api.example.com/oauth/token')
      expect(fetchCall[1].method).toBe('POST')
      expect(fetchCall[1].headers['Content-Type']).toBe('application/x-www-form-urlencoded')

      expect(fetchCall[1].body).toBe(
        'username=testuser123&password=testpass456&email=test%40example.com'
      )
    })

    it('should handle OAuth client credentials requests', async () => {
      tester.setup({ access_token: 'token123', token_type: 'Bearer' })

      await tester.execute({
        url: 'https://oauth.example.com/token',
        method: 'POST',
        body: { grant_type: 'client_credentials', scope: 'read write' },
        headers: [
          { cells: { Key: 'Content-Type', Value: 'application/x-www-form-urlencoded' } },
          { cells: { Key: 'Authorization', Value: 'Basic Y2xpZW50OnNlY3JldA==' } },
        ],
      })

      const fetchCall = (global.fetch as any).mock.calls[0]
      expect(fetchCall[0]).toBe('https://oauth.example.com/token')
      expect(fetchCall[1].method).toBe('POST')
      expect(fetchCall[1].headers['Content-Type']).toBe('application/x-www-form-urlencoded')
      expect(fetchCall[1].headers.Authorization).toBe('Basic Y2xpZW50OnNlY3JldA==')

      expect(fetchCall[1].body).toBe('grant_type=client_credentials&scope=read+write')
    })

    it('should handle errors correctly', async () => {
      tester.setup(mockHttpResponses.error, { ok: false, status: 400 })

      const result = await tester.execute({
        url: 'https://api.example.com/data',
        method: 'GET',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should handle timeout parameter', async () => {
      tester.setup({ result: 'success' })

      await tester.execute({
        url: 'https://api.example.com/data',
        timeout: 5000,
      })

      expect(global.fetch).toHaveBeenCalled()
    })
  })

  describe('Response Transformation', () => {
    it('should transform JSON responses correctly', async () => {
      tester.setup({ data: { key: 'value' } }, { headers: { 'content-type': 'application/json' } })

      const result = await tester.execute({
        url: 'https://api.example.com/data',
      })

      expect(result.success).toBe(true)
      expect(result.output.data).toEqual({ data: { key: 'value' } })
    })

    it('should transform text responses correctly', async () => {
      const textContent = 'Plain text response'
      tester.setup(textContent, { headers: { 'content-type': 'text/plain' } })

      const result = await tester.execute({
        url: 'https://api.example.com/text',
      })

      expect(result.success).toBe(true)
      expect(result.output.data).toBe(textContent)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      tester.setupError('Network error')

      const result = await tester.execute({
        url: 'https://api.example.com/data',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Network error')
    })

    it('should handle 404 errors', async () => {
      tester.setup(mockHttpResponses.notFound, { ok: false, status: 404 })

      const result = await tester.execute({
        url: 'https://api.example.com/not-found',
      })

      expect(result.success).toBe(false)
      expect(result.output).toEqual({})
    })

    it('should handle 401 unauthorized errors', async () => {
      tester.setup(mockHttpResponses.unauthorized, { ok: false, status: 401 })

      const result = await tester.execute({
        url: 'https://api.example.com/restricted',
      })

      expect(result.success).toBe(false)
      expect(result.output).toEqual({})
    })
  })

  describe('Default Headers', () => {
    it('should apply all default headers correctly', async () => {
      tester.setup(mockHttpResponses.simple)

      const originalWindow = global.window
      Object.defineProperty(global, 'window', {
        value: {
          location: {
            origin: 'https://app.simstudio.dev',
          },
        },
        writable: true,
      })

      await tester.execute({
        url: 'https://api.example.com/data',
        method: 'GET',
      })

      const fetchCall = (global.fetch as any).mock.calls[0]
      const headers = fetchCall[1].headers

      expect(headers['User-Agent']).toMatch(/Mozilla\/5\.0.*Chrome.*Safari/)
      expect(headers.Accept).toBe('*/*')
      expect(headers['Accept-Encoding']).toBe('gzip, deflate, br')
      expect(headers['Cache-Control']).toBe('no-cache')
      expect(headers.Connection).toBe('keep-alive')
      expect(headers['Sec-Ch-Ua']).toMatch(/Chromium.*Not-A\.Brand/)
      expect(headers['Sec-Ch-Ua-Mobile']).toBe('?0')
      expect(headers['Sec-Ch-Ua-Platform']).toBe('"macOS"')
      expect(headers.Referer).toBe('https://app.simstudio.dev')
      expect(headers.Host).toBe('api.example.com')

      global.window = originalWindow
    })

    it('should allow overriding default headers', async () => {
      tester.setup(mockHttpResponses.simple)

      await tester.execute({
        url: 'https://api.example.com/data',
        method: 'GET',
        headers: [
          { cells: { Key: 'User-Agent', Value: 'Custom Agent' } },
          { cells: { Key: 'Accept', Value: 'application/json' } },
        ],
      })

      const fetchCall = (global.fetch as any).mock.calls[0]
      const headers = fetchCall[1].headers

      expect(headers['User-Agent']).toBe('Custom Agent')
      expect(headers.Accept).toBe('application/json')

      expect(headers['Accept-Encoding']).toBe('gzip, deflate, br')
      expect(headers['Cache-Control']).toBe('no-cache')
    })
  })

  describe('Proxy Functionality', () => {
    it.concurrent('should not use proxy in test environment', () => {
      const originalWindow = global.window
      Object.defineProperty(global, 'window', {
        value: {
          location: {
            origin: 'https://app.simstudio.dev',
          },
        },
        writable: true,
      })

      const url = tester.getRequestUrl({ url: 'https://api.example.com/data' })
      expect(url).toBe('https://api.example.com/data')
      expect(url).not.toContain('/api/proxy')

      global.window = originalWindow
    })

    it.concurrent('should include method parameter in proxy URL', () => {
      const originalWindow = global.window
      Object.defineProperty(global, 'window', {
        value: {
          location: {
            origin: 'https://sim.ai',
          },
        },
        writable: true,
      })

      const originalVitest = process.env.VITEST as string

      try {
        process.env.VITEST = undefined

        const buildProxyUrl = (params: any) => {
          const baseUrl = 'https://external-api.com/endpoint'
          let proxyUrl = `/api/proxy?url=${encodeURIComponent(baseUrl)}`

          if (params.method) {
            proxyUrl += `&method=${encodeURIComponent(params.method)}`
          }

          if (
            params.body &&
            ['POST', 'PUT', 'PATCH'].includes(params.method?.toUpperCase() || '')
          ) {
            const bodyStr =
              typeof params.body === 'string' ? params.body : JSON.stringify(params.body)
            proxyUrl += `&body=${encodeURIComponent(bodyStr)}`
          }

          return proxyUrl
        }

        const getParams = {
          url: 'https://external-api.com/endpoint',
          method: 'GET',
        }
        const getProxyUrl = buildProxyUrl(getParams)
        expect(getProxyUrl).toContain('/api/proxy?url=')
        expect(getProxyUrl).toContain('&method=GET')

        const postParams = {
          url: 'https://external-api.com/endpoint',
          method: 'POST',
          body: { key: 'value' },
        }
        const postProxyUrl = buildProxyUrl(postParams)
        expect(postProxyUrl).toContain('/api/proxy?url=')
        expect(postProxyUrl).toContain('&method=POST')
        expect(postProxyUrl).toContain('&body=')
        expect(postProxyUrl).toContain(encodeURIComponent('{"key":"value"}'))

        const putParams = {
          url: 'https://external-api.com/endpoint',
          method: 'PUT',
          body: 'string body',
        }
        const putProxyUrl = buildProxyUrl(putParams)
        expect(putProxyUrl).toContain('/api/proxy?url=')
        expect(putProxyUrl).toContain('&method=PUT')
        expect(putProxyUrl).toContain(`&body=${encodeURIComponent('string body')}`)
      } finally {
        global.window = originalWindow
        process.env.VITEST = originalVitest
      }
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: request.ts]---
Location: sim-main/apps/sim/tools/http/request.ts

```typescript
import type { RequestParams, RequestResponse } from '@/tools/http/types'
import { getDefaultHeaders, processUrl, transformTable } from '@/tools/http/utils'
import type { ToolConfig } from '@/tools/types'

export const requestTool: ToolConfig<RequestParams, RequestResponse> = {
  id: 'http_request',
  name: 'HTTP Request',
  description:
    'Make HTTP requests with comprehensive support for methods, headers, query parameters, path parameters, and form data. Features configurable timeout and status validation for robust API interactions.',
  version: '1.0.0',

  params: {
    url: {
      type: 'string',
      required: true,
      description: 'The URL to send the request to',
    },
    method: {
      type: 'string',
      default: 'GET',
      description: 'HTTP method (GET, POST, PUT, PATCH, DELETE)',
    },
    headers: {
      type: 'object',
      description: 'HTTP headers to include',
    },
    body: {
      type: 'object',
      description: 'Request body (for POST, PUT, PATCH)',
    },
    params: {
      type: 'object',
      description: 'URL query parameters to append',
    },
    pathParams: {
      type: 'object',
      description: 'URL path parameters to replace (e.g., :id in /users/:id)',
    },
    formData: {
      type: 'object',
      description: 'Form data to send (will set appropriate Content-Type)',
    },
  },

  request: {
    url: (params: RequestParams) => {
      // Process the URL once and cache the result
      return processUrl(params.url, params.pathParams, params.params)
    },

    method: (params: RequestParams) => {
      // Always return the user's intended method - executeTool handles proxy routing
      return params.method || 'GET'
    },

    headers: (params: RequestParams) => {
      const headers = transformTable(params.headers || null)
      const processedUrl = processUrl(params.url, params.pathParams, params.params)
      const allHeaders = getDefaultHeaders(headers, processedUrl)

      // Set appropriate Content-Type only if not already specified by user
      if (params.formData) {
        // Don't set Content-Type for FormData, browser will set it with boundary
        return allHeaders
      }
      if (params.body && !allHeaders['Content-Type'] && !allHeaders['content-type']) {
        allHeaders['Content-Type'] = 'application/json'
      }

      return allHeaders
    },

    body: (params: RequestParams) => {
      if (params.formData) {
        const formData = new FormData()
        Object.entries(params.formData).forEach(([key, value]) => {
          formData.append(key, value)
        })
        return formData
      }

      if (params.body) {
        // Check if user wants URL-encoded form data
        const headers = transformTable(params.headers || null)
        const contentType = headers['Content-Type'] || headers['content-type']

        if (
          contentType === 'application/x-www-form-urlencoded' &&
          typeof params.body === 'object'
        ) {
          // Convert JSON object to URL-encoded string
          const urlencoded = new URLSearchParams()
          Object.entries(params.body).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              urlencoded.append(key, String(value))
            }
          })
          return urlencoded.toString()
        }

        return params.body
      }

      return undefined
    },
  },

  transformResponse: async (response: Response) => {
    const contentType = response.headers.get('content-type') || ''

    // Standard response handling
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    const data = await (contentType.includes('application/json')
      ? response.json()
      : response.text())

    // Check if this is a proxy response (structured response from /api/proxy)
    if (
      contentType.includes('application/json') &&
      typeof data === 'object' &&
      data !== null &&
      data.data !== undefined &&
      data.status !== undefined
    ) {
      return {
        success: data.success,
        output: {
          data: data.data,
          status: data.status,
          headers: data.headers || {},
        },
        error: data.success ? undefined : data.error,
      }
    }

    // Direct response handling
    return {
      success: response.ok,
      output: {
        data,
        status: response.status,
        headers,
      },
      error: undefined, // Errors are handled upstream in executeTool
    }
  },

  outputs: {
    data: {
      type: 'json',
      description: 'Response data from the HTTP request (JSON object, text, or other format)',
    },
    status: {
      type: 'number',
      description: 'HTTP status code of the response (e.g., 200, 404, 500)',
    },
    headers: {
      type: 'object',
      description: 'Response headers as key-value pairs',
      properties: {
        'content-type': {
          type: 'string',
          description: 'Content type of the response',
          optional: true,
        },
        'content-length': { type: 'string', description: 'Content length', optional: true },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/http/types.ts

```typescript
import type { HttpMethod, TableRow, ToolResponse } from '@/tools/types'

export interface RequestParams {
  url: string
  method?: HttpMethod
  headers?: TableRow[]
  body?: any
  params?: TableRow[]
  pathParams?: Record<string, string>
  formData?: Record<string, string | Blob>
}

export interface RequestResponse extends ToolResponse {
  output: {
    data: any
    status: number
    headers: Record<string, string>
  }
}
```

--------------------------------------------------------------------------------

````
