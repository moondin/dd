---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 547
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 547 of 933)

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

---[FILE: registry.ts]---
Location: sim-main/apps/sim/lib/copilot/registry.ts
Signals: Zod

```typescript
import { z } from 'zod'
import { KnowledgeBaseArgsSchema, KnowledgeBaseResultSchema } from './tools/shared/schemas'

// Tool IDs supported by the Copilot runtime
export const ToolIds = z.enum([
  'get_user_workflow',
  'edit_workflow',
  'run_workflow',
  'get_workflow_console',
  'get_blocks_and_tools',
  'get_blocks_metadata',
  'get_trigger_examples',
  'get_examples_rag',
  'get_operations_examples',
  'search_documentation',
  'search_online',
  'search_patterns',
  'search_errors',
  'remember_debug',
  'make_api_request',
  'set_environment_variables',
  'get_credentials',
  'reason',
  'list_user_workflows',
  'get_workflow_from_name',
  'get_workflow_data',
  'set_global_workflow_variables',
  'oauth_request_access',
  'get_trigger_blocks',
  'deploy_workflow',
  'check_deployment_status',
  'navigate_ui',
  'knowledge_base',
  'manage_custom_tool',
  'manage_mcp_tool',
])
export type ToolId = z.infer<typeof ToolIds>

// Base SSE wrapper for tool_call events emitted by the LLM
const ToolCallSSEBase = z.object({
  type: z.literal('tool_call'),
  data: z.object({
    id: z.string(),
    name: ToolIds,
    arguments: z.record(z.any()),
    partial: z.boolean().default(false),
  }),
})
export type ToolCallSSE = z.infer<typeof ToolCallSSEBase>

// Reusable small schemas
const StringArray = z.array(z.string())
const BooleanOptional = z.boolean().optional()
const NumberOptional = z.number().optional()

// Tool argument schemas (per SSE examples provided)
export const ToolArgSchemas = {
  get_user_workflow: z.object({}),
  // New tools
  list_user_workflows: z.object({}),
  get_workflow_from_name: z.object({ workflow_name: z.string() }),
  // Workflow data tool (variables, custom tools, MCP tools, files)
  get_workflow_data: z.object({
    data_type: z.enum(['global_variables', 'custom_tools', 'mcp_tools', 'files']),
  }),
  set_global_workflow_variables: z.object({
    operations: z.array(
      z.object({
        operation: z.enum(['add', 'delete', 'edit']),
        name: z.string(),
        type: z.enum(['plain', 'number', 'boolean', 'array', 'object']).optional(),
        value: z.string().optional(),
      })
    ),
  }),
  // New
  oauth_request_access: z.object({
    providerName: z.string(),
  }),

  deploy_workflow: z.object({
    action: z.enum(['deploy', 'undeploy']).optional().default('deploy'),
    deployType: z.enum(['api', 'chat']).optional().default('api'),
  }),

  check_deployment_status: z.object({
    workflowId: z.string().optional(),
  }),

  navigate_ui: z.object({
    destination: z.enum(['workflow', 'logs', 'templates', 'vector_db', 'settings']),
    workflowName: z.string().optional(),
  }),

  edit_workflow: z.object({
    operations: z
      .array(
        z.object({
          operation_type: z.enum(['add', 'edit', 'delete']),
          block_id: z.string(),
          params: z.record(z.any()).optional(),
        })
      )
      .min(1),
  }),

  run_workflow: z.object({
    workflow_input: z.string(),
  }),

  get_workflow_console: z.object({
    limit: NumberOptional,
    includeDetails: BooleanOptional,
  }),

  get_blocks_and_tools: z.object({}),

  get_blocks_metadata: z.object({
    blockIds: StringArray.min(1),
  }),

  get_trigger_blocks: z.object({}),

  get_block_best_practices: z.object({
    blockIds: StringArray.min(1),
  }),

  get_edit_workflow_examples: z.object({
    exampleIds: StringArray.min(1),
  }),

  get_trigger_examples: z.object({}),

  get_examples_rag: z.object({
    query: z.string(),
  }),

  get_operations_examples: z.object({
    query: z.string(),
  }),

  search_documentation: z.object({
    query: z.string(),
    topK: NumberOptional,
  }),

  search_online: z.object({
    query: z.string(),
    num: z.number().optional().default(10),
    type: z.enum(['search', 'news', 'places', 'images']).optional().default('search'),
    gl: z.string().optional(),
    hl: z.string().optional(),
  }),

  search_patterns: z.object({
    queries: z.array(z.string()).min(1).max(3),
    limit: z.number().optional().default(3),
  }),

  search_errors: z.object({
    query: z.string(),
    limit: z.number().optional().default(5),
  }),

  remember_debug: z.object({
    operation: z.enum(['add', 'edit', 'delete']),
    id: z.string().optional(),
    problem: z.string().optional(),
    solution: z.string().optional(),
    description: z.string().optional(),
  }),

  make_api_request: z.object({
    url: z.string(),
    method: z.enum(['GET', 'POST', 'PUT']),
    queryParams: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
    headers: z.record(z.string()).optional(),
    body: z.union([z.record(z.any()), z.string()]).optional(),
  }),

  set_environment_variables: z.object({
    variables: z.record(z.string()),
  }),

  get_credentials: z.object({}),

  reason: z.object({
    reasoning: z.string(),
  }),

  knowledge_base: KnowledgeBaseArgsSchema,

  manage_custom_tool: z.object({
    operation: z
      .enum(['add', 'edit', 'delete'])
      .describe('The operation to perform: add (create new), edit (update existing), or delete'),
    toolId: z
      .string()
      .optional()
      .describe(
        'Required for edit and delete operations. The database ID of the custom tool (e.g., "0robnW7_JUVwZrDkq1mqj"). Use get_workflow_data with data_type "custom_tools" to get the list of tools and their IDs. Do NOT use the function name - use the actual "id" field from the tool.'
      ),
    schema: z
      .object({
        type: z.literal('function'),
        function: z.object({
          name: z.string().describe('The function name (camelCase, e.g. getWeather)'),
          description: z.string().optional().describe('What the function does'),
          parameters: z.object({
            type: z.string(),
            properties: z.record(z.any()),
            required: z.array(z.string()).optional(),
          }),
        }),
      })
      .optional()
      .describe('Required for add. The OpenAI function calling format schema.'),
    code: z
      .string()
      .optional()
      .describe(
        'Required for add. The JavaScript function body code. Use {{ENV_VAR}} for environment variables and reference parameters directly by name.'
      ),
  }),

  manage_mcp_tool: z.object({
    operation: z
      .enum(['add', 'edit', 'delete'])
      .describe('The operation to perform: add (create new), edit (update existing), or delete'),
    serverId: z
      .string()
      .optional()
      .describe(
        'Required for edit and delete operations. The database ID of the MCP server. Use the MCP settings panel or API to get server IDs.'
      ),
    config: z
      .object({
        name: z.string().describe('The display name for the MCP server'),
        transport: z
          .enum(['streamable-http'])
          .optional()
          .default('streamable-http')
          .describe('Transport protocol (currently only streamable-http is supported)'),
        url: z.string().optional().describe('The MCP server endpoint URL (required for add)'),
        headers: z
          .record(z.string())
          .optional()
          .describe('Optional HTTP headers to send with requests'),
        timeout: z.number().optional().describe('Request timeout in milliseconds (default: 30000)'),
        enabled: z.boolean().optional().describe('Whether the server is enabled (default: true)'),
      })
      .optional()
      .describe('Required for add and edit operations. The MCP server configuration.'),
  }),
} as const
export type ToolArgSchemaMap = typeof ToolArgSchemas

// Tool-specific SSE schemas (tool_call with typed arguments)
function toolCallSSEFor<TName extends ToolId, TArgs extends z.ZodTypeAny>(
  name: TName,
  argsSchema: TArgs
) {
  return ToolCallSSEBase.extend({
    data: ToolCallSSEBase.shape.data.extend({
      name: z.literal(name),
      arguments: argsSchema,
    }),
  })
}

export const ToolSSESchemas = {
  get_user_workflow: toolCallSSEFor('get_user_workflow', ToolArgSchemas.get_user_workflow),
  // New tools
  list_user_workflows: toolCallSSEFor('list_user_workflows', ToolArgSchemas.list_user_workflows),
  get_workflow_from_name: toolCallSSEFor(
    'get_workflow_from_name',
    ToolArgSchemas.get_workflow_from_name
  ),
  // Workflow data tool (variables, custom tools, MCP tools, files)
  get_workflow_data: toolCallSSEFor('get_workflow_data', ToolArgSchemas.get_workflow_data),
  set_global_workflow_variables: toolCallSSEFor(
    'set_global_workflow_variables',
    ToolArgSchemas.set_global_workflow_variables
  ),
  edit_workflow: toolCallSSEFor('edit_workflow', ToolArgSchemas.edit_workflow),
  run_workflow: toolCallSSEFor('run_workflow', ToolArgSchemas.run_workflow),
  get_workflow_console: toolCallSSEFor('get_workflow_console', ToolArgSchemas.get_workflow_console),
  get_blocks_and_tools: toolCallSSEFor('get_blocks_and_tools', ToolArgSchemas.get_blocks_and_tools),
  get_blocks_metadata: toolCallSSEFor('get_blocks_metadata', ToolArgSchemas.get_blocks_metadata),
  get_trigger_blocks: toolCallSSEFor('get_trigger_blocks', ToolArgSchemas.get_trigger_blocks),

  get_trigger_examples: toolCallSSEFor('get_trigger_examples', ToolArgSchemas.get_trigger_examples),
  get_examples_rag: toolCallSSEFor('get_examples_rag', ToolArgSchemas.get_examples_rag),
  get_operations_examples: toolCallSSEFor(
    'get_operations_examples',
    ToolArgSchemas.get_operations_examples
  ),
  search_documentation: toolCallSSEFor('search_documentation', ToolArgSchemas.search_documentation),
  search_online: toolCallSSEFor('search_online', ToolArgSchemas.search_online),
  search_patterns: toolCallSSEFor('search_patterns', ToolArgSchemas.search_patterns),
  search_errors: toolCallSSEFor('search_errors', ToolArgSchemas.search_errors),
  remember_debug: toolCallSSEFor('remember_debug', ToolArgSchemas.remember_debug),
  make_api_request: toolCallSSEFor('make_api_request', ToolArgSchemas.make_api_request),
  set_environment_variables: toolCallSSEFor(
    'set_environment_variables',
    ToolArgSchemas.set_environment_variables
  ),
  get_credentials: toolCallSSEFor('get_credentials', ToolArgSchemas.get_credentials),
  reason: toolCallSSEFor('reason', ToolArgSchemas.reason),
  // New
  oauth_request_access: toolCallSSEFor('oauth_request_access', ToolArgSchemas.oauth_request_access),
  deploy_workflow: toolCallSSEFor('deploy_workflow', ToolArgSchemas.deploy_workflow),
  check_deployment_status: toolCallSSEFor(
    'check_deployment_status',
    ToolArgSchemas.check_deployment_status
  ),
  navigate_ui: toolCallSSEFor('navigate_ui', ToolArgSchemas.navigate_ui),
  knowledge_base: toolCallSSEFor('knowledge_base', ToolArgSchemas.knowledge_base),
  manage_custom_tool: toolCallSSEFor('manage_custom_tool', ToolArgSchemas.manage_custom_tool),
  manage_mcp_tool: toolCallSSEFor('manage_mcp_tool', ToolArgSchemas.manage_mcp_tool),
} as const
export type ToolSSESchemaMap = typeof ToolSSESchemas

// Known result schemas per tool (what tool_result.result should conform to)
// Note: Where legacy variability exists, schema captures the common/expected shape for new runtime.
const BuildOrEditWorkflowResult = z.object({
  yamlContent: z.string(),
  description: z.string().optional(),
  workflowState: z.unknown().optional(),
  data: z
    .object({
      blocksCount: z.number(),
      edgesCount: z.number(),
    })
    .optional(),
})

const ExecutionEntry = z.object({
  id: z.string(),
  executionId: z.string(),
  level: z.string(),
  trigger: z.string(),
  startedAt: z.string(),
  endedAt: z.string().nullable(),
  durationMs: z.number().nullable(),
  totalCost: z.number().nullable(),
  totalTokens: z.number().nullable(),
  blockExecutions: z.array(z.any()), // can be detailed per need
  output: z.any().optional(),
  errorMessage: z.string().optional(),
  errorBlock: z
    .object({
      blockId: z.string().optional(),
      blockName: z.string().optional(),
      blockType: z.string().optional(),
    })
    .optional(),
})

export const ToolResultSchemas = {
  get_user_workflow: z.object({ yamlContent: z.string() }).or(z.string()),
  // New tools
  list_user_workflows: z.object({ workflow_names: z.array(z.string()) }),
  get_workflow_from_name: z
    .object({ yamlContent: z.string() })
    .or(z.object({ userWorkflow: z.string() }))
    .or(z.string()),
  // Workflow data tool results (variables, custom tools, MCP tools, files)
  get_workflow_data: z.union([
    z.object({
      variables: z.array(z.object({ id: z.string(), name: z.string(), value: z.any() })),
    }),
    z.object({
      customTools: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          functionName: z.string(),
          description: z.string(),
          parameters: z.any().optional(),
        })
      ),
    }),
    z.object({
      mcpTools: z.array(
        z.object({
          name: z.string(),
          serverId: z.string(),
          serverName: z.string(),
          description: z.string(),
          inputSchema: z.any().optional(),
        })
      ),
    }),
    z.object({
      files: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          key: z.string(),
          path: z.string(),
          size: z.number(),
          type: z.string(),
          uploadedAt: z.string(),
        })
      ),
    }),
  ]),
  set_global_workflow_variables: z
    .object({ variables: z.record(z.any()) })
    .or(z.object({ message: z.any().optional(), data: z.any().optional() })),
  // New
  oauth_request_access: z.object({
    granted: z.boolean().optional(),
    message: z.string().optional(),
  }),

  edit_workflow: BuildOrEditWorkflowResult,
  run_workflow: z.object({
    executionId: z.string().optional(),
    message: z.any().optional(),
    data: z.any().optional(),
  }),
  get_workflow_console: z.object({ entries: z.array(ExecutionEntry) }),
  get_blocks_and_tools: z.object({ blocks: z.array(z.any()), tools: z.array(z.any()) }),
  get_blocks_metadata: z.object({ metadata: z.record(z.any()) }),
  get_trigger_blocks: z.object({ triggerBlockIds: z.array(z.string()) }),
  get_block_best_practices: z.object({ bestPractices: z.array(z.any()) }),
  get_edit_workflow_examples: z.object({
    examples: z.array(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        operations: z.array(z.any()).optional(),
      })
    ),
  }),
  get_trigger_examples: z.object({
    examples: z.array(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        operations: z.array(z.any()).optional(),
      })
    ),
  }),
  get_examples_rag: z.object({
    examples: z.array(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        operations: z.array(z.any()).optional(),
      })
    ),
  }),
  get_operations_examples: z.object({
    examples: z.array(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        operations: z.array(z.any()).optional(),
      })
    ),
  }),
  search_documentation: z.object({ results: z.array(z.any()) }),
  search_online: z.object({ results: z.array(z.any()) }),
  search_patterns: z.object({
    patterns: z.array(
      z.object({
        blocks_involved: z.array(z.string()).optional(),
        description: z.string().optional(),
        pattern_category: z.string().optional(),
        pattern_name: z.string().optional(),
        use_cases: z.array(z.string()).optional(),
        workflow_json: z.any().optional(),
      })
    ),
  }),
  search_errors: z.object({
    results: z.array(
      z.object({
        problem: z.string().optional(),
        solution: z.string().optional(),
        context: z.string().optional(),
        similarity: z.number().optional(),
      })
    ),
  }),
  remember_debug: z.object({
    success: z.boolean(),
    message: z.string().optional(),
    id: z.string().optional(),
  }),
  make_api_request: z.object({
    status: z.number(),
    statusText: z.string().optional(),
    headers: z.record(z.string()).optional(),
    body: z.any().optional(),
  }),
  set_environment_variables: z
    .object({ variables: z.record(z.string()) })
    .or(z.object({ message: z.any().optional(), data: z.any().optional() })),
  get_credentials: z.object({
    oauth: z.object({
      credentials: z.array(
        z.object({ id: z.string(), provider: z.string(), isDefault: z.boolean().optional() })
      ),
      total: z.number(),
    }),
    environment: z.object({
      variableNames: z.array(z.string()),
      count: z.number(),
    }),
  }),
  reason: z.object({ reasoning: z.string() }),
  deploy_workflow: z.object({
    action: z.enum(['deploy', 'undeploy']).optional(),
    deployType: z.enum(['api', 'chat']).optional(),
    isDeployed: z.boolean().optional(),
    deployedAt: z.string().optional(),
    needsApiKey: z.boolean().optional(),
    message: z.string().optional(),
    endpoint: z.string().optional(),
    curlCommand: z.string().optional(),
    apiKeyPlaceholder: z.string().optional(),
    openedModal: z.boolean().optional(),
  }),
  check_deployment_status: z.object({
    isDeployed: z.boolean(),
    deploymentTypes: z.array(z.string()),
    apiDeployed: z.boolean(),
    chatDeployed: z.boolean(),
    deployedAt: z.string().nullable(),
  }),
  navigate_ui: z.object({
    destination: z.enum(['workflow', 'logs', 'templates', 'vector_db', 'settings']),
    workflowName: z.string().optional(),
    navigated: z.boolean(),
  }),
  knowledge_base: KnowledgeBaseResultSchema,
  manage_custom_tool: z.object({
    success: z.boolean(),
    operation: z.enum(['add', 'edit', 'delete']),
    toolId: z.string().optional(),
    title: z.string().optional(),
    message: z.string().optional(),
  }),
  manage_mcp_tool: z.object({
    success: z.boolean(),
    operation: z.enum(['add', 'edit', 'delete']),
    serverId: z.string().optional(),
    serverName: z.string().optional(),
    message: z.string().optional(),
  }),
} as const
export type ToolResultSchemaMap = typeof ToolResultSchemas

// Consolidated registry entry per tool
export const ToolRegistry = Object.freeze(
  (Object.keys(ToolArgSchemas) as ToolId[]).reduce(
    (acc, toolId) => {
      const args = (ToolArgSchemas as any)[toolId] as z.ZodTypeAny
      const sse = (ToolSSESchemas as any)[toolId] as z.ZodTypeAny
      const result = (ToolResultSchemas as any)[toolId] as z.ZodTypeAny
      acc[toolId] = { id: toolId, args, sse, result }
      return acc
    },
    {} as Record<
      ToolId,
      { id: ToolId; args: z.ZodTypeAny; sse: z.ZodTypeAny; result: z.ZodTypeAny }
    >
  )
)
export type ToolRegistryMap = typeof ToolRegistry

// Convenience helper types inferred from schemas
export type InferArgs<T extends ToolId> = z.infer<(typeof ToolArgSchemas)[T]>
export type InferResult<T extends ToolId> = z.infer<(typeof ToolResultSchemas)[T]>
export type InferToolCallSSE<T extends ToolId> = z.infer<(typeof ToolSSESchemas)[T]>
```

--------------------------------------------------------------------------------

---[FILE: request-helpers.ts]---
Location: sim-main/apps/sim/lib/copilot/request-helpers.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { authenticateApiKeyFromHeader, updateApiKeyLastUsed } from '@/lib/api-key/service'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'

export type { NotificationStatus } from '@/lib/copilot/types'

export interface CopilotAuthResult {
  userId: string | null
  isAuthenticated: boolean
}

export function createUnauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function createBadRequestResponse(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function createNotFoundResponse(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function createInternalServerErrorResponse(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 500 })
}

export function createRequestId(): string {
  return crypto.randomUUID()
}

export function createShortRequestId(): string {
  return generateRequestId()
}

export interface RequestTracker {
  requestId: string
  startTime: number
  getDuration(): number
}

export function createRequestTracker(short = true): RequestTracker {
  const requestId = short ? createShortRequestId() : createRequestId()
  const startTime = Date.now()

  return {
    requestId,
    startTime,
    getDuration(): number {
      return Date.now() - startTime
    },
  }
}

export async function authenticateCopilotRequest(req: NextRequest): Promise<CopilotAuthResult> {
  const session = await getSession()
  let userId: string | null = session?.user?.id || null

  if (!userId) {
    const apiKeyHeader = req.headers.get('x-api-key')
    if (apiKeyHeader) {
      const result = await authenticateApiKeyFromHeader(apiKeyHeader)
      if (result.success) {
        userId = result.userId!
        await updateApiKeyLastUsed(result.keyId!)
      }
    }
  }

  return {
    userId,
    isAuthenticated: userId !== null,
  }
}

export async function authenticateCopilotRequestSessionOnly(): Promise<CopilotAuthResult> {
  const session = await getSession()
  const userId = session?.user?.id || null

  return {
    userId,
    isAuthenticated: userId !== null,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/copilot/types.ts

```typescript
/**
 * Copilot Types - Consolidated from various locations
 * This file contains all copilot-related type definitions
 */

// Tool call state types (from apps/sim/types/tool-call.ts)
export interface ToolCallState {
  id: string
  name: string
  displayName?: string
  parameters?: Record<string, any>
  state:
    | 'detecting'
    | 'pending'
    | 'executing'
    | 'completed'
    | 'error'
    | 'rejected'
    | 'applied'
    | 'ready_for_review'
    | 'aborted'
    | 'skipped'
    | 'background'
  startTime?: number
  endTime?: number
  duration?: number
  result?: any
  error?: string
  progress?: string
}

export interface ToolCallGroup {
  id: string
  toolCalls: ToolCallState[]
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  startTime?: number
  endTime?: number
  summary?: string
}

export interface InlineContent {
  type: 'text' | 'tool_call'
  content: string
  toolCall?: ToolCallState
}

export interface ParsedMessageContent {
  textContent: string
  toolCalls: ToolCallState[]
  toolGroups: ToolCallGroup[]
  inlineContent?: InlineContent[]
}

import type { ProviderId } from '@/providers/types'
// Copilot Tools Type Definitions (from workspace copilot lib)
import type { CopilotToolCall, ToolState } from '@/stores/panel/copilot/types'

export type NotificationStatus =
  | 'pending'
  | 'success'
  | 'error'
  | 'accepted'
  | 'rejected'
  | 'background'

// Export the consolidated types
export type { CopilotToolCall, ToolState }

// Display configuration for different states
export interface StateDisplayConfig {
  displayName: string
  icon?: string
  className?: string
}

// Complete display configuration for a tool
export interface ToolDisplayConfig {
  states: {
    [K in ToolState]?: StateDisplayConfig
  }
  getDynamicDisplayName?: (state: ToolState, params: Record<string, any>) => string | null
}

// Schema for tool parameters (OpenAI function calling format)
export interface ToolSchema {
  name: string
  description: string
  parameters?: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
}

// Tool metadata - all the static configuration
export interface ToolMetadata {
  id: string
  displayConfig: ToolDisplayConfig
  schema: ToolSchema
  requiresInterrupt: boolean
  allowBackgroundExecution?: boolean
  stateMessages?: Partial<Record<NotificationStatus, string>>
}

// Result from executing a tool
export interface ToolExecuteResult {
  success: boolean
  data?: any
  error?: string
}

// Response from the confirmation API
export interface ToolConfirmResponse {
  success: boolean
  message?: string
}

// Options for tool execution
export interface ToolExecutionOptions {
  onStateChange?: (state: ToolState) => void
  beforeExecute?: () => Promise<boolean>
  afterExecute?: (result: ToolExecuteResult) => Promise<void>
  context?: Record<string, any>
}

// The main tool interface that all tools must implement
export interface Tool {
  metadata: ToolMetadata
  execute(toolCall: CopilotToolCall, options?: ToolExecutionOptions): Promise<ToolExecuteResult>
  getDisplayName(toolCall: CopilotToolCall): string
  getIcon(toolCall: CopilotToolCall): string
  handleUserAction(
    toolCall: CopilotToolCall,
    action: 'run' | 'skip' | 'background',
    options?: ToolExecutionOptions
  ): Promise<void>
  requiresConfirmation(toolCall: CopilotToolCall): boolean
}

// Provider configuration for Sim Agent requests
// This type is only for the `provider` field in requests sent to the Sim Agent
export type CopilotProviderConfig =
  | {
      provider: 'azure-openai'
      model: string
      apiKey?: string
      apiVersion?: string
      endpoint?: string
    }
  | {
      provider: 'vertex'
      model: string
      apiKey?: string
      vertexProject?: string
      vertexLocation?: string
    }
  | {
      provider: Exclude<ProviderId, 'azure-openai' | 'vertex'>
      model?: string
      apiKey?: string
    }
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/copilot/utils.ts
Signals: Next.js

```typescript
import type { NextRequest } from 'next/server'
import { env } from '@/lib/core/config/env'

export function checkInternalApiKey(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  const expectedApiKey = env.INTERNAL_API_SECRET

  if (!expectedApiKey) {
    return { success: false, error: 'Internal API key not configured' }
  }

  if (!apiKey) {
    return { success: false, error: 'API key required' }
  }

  if (apiKey !== expectedApiKey) {
    return { success: false, error: 'Invalid API key' }
  }

  return { success: true }
}

export function checkCopilotApiKey(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  const expectedApiKey = env.COPILOT_API_KEY

  if (!expectedApiKey) {
    return { success: false, error: 'Copilot API key not configured' }
  }

  if (!apiKey) {
    return { success: false, error: 'API key required' }
  }

  if (apiKey !== expectedApiKey) {
    return { success: false, error: 'Invalid API key' }
  }

  return { success: true }
}
```

--------------------------------------------------------------------------------

---[FILE: permissions.ts]---
Location: sim-main/apps/sim/lib/copilot/auth/permissions.ts

```typescript
import { db } from '@sim/db'
import { workflow } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions, type PermissionType } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('CopilotPermissions')

/**
 * Verifies if a user has access to a workflow for copilot operations
 *
 * @param userId - The authenticated user ID
 * @param workflowId - The workflow ID to check access for
 * @returns Promise<{ hasAccess: boolean; userPermission: PermissionType | null; workspaceId?: string; isOwner: boolean }>
 */
export async function verifyWorkflowAccess(
  userId: string,
  workflowId: string
): Promise<{
  hasAccess: boolean
  userPermission: PermissionType | null
  workspaceId?: string
  isOwner: boolean
}> {
  try {
    const workflowData = await db
      .select({
        userId: workflow.userId,
        workspaceId: workflow.workspaceId,
      })
      .from(workflow)
      .where(eq(workflow.id, workflowId))
      .limit(1)

    if (!workflowData.length) {
      logger.warn('Attempt to access non-existent workflow', {
        workflowId,
        userId,
      })
      return { hasAccess: false, userPermission: null, isOwner: false }
    }

    const { userId: workflowOwnerId, workspaceId } = workflowData[0]

    if (workflowOwnerId === userId) {
      logger.debug('User has direct ownership of workflow', { workflowId, userId })
      return {
        hasAccess: true,
        userPermission: 'admin',
        workspaceId: workspaceId || undefined,
        isOwner: true,
      }
    }

    if (workspaceId && userId) {
      const userPermission = await getUserEntityPermissions(userId, 'workspace', workspaceId)

      if (userPermission !== null) {
        logger.debug('User has workspace permission for workflow', {
          workflowId,
          userId,
          workspaceId,
          userPermission,
        })
        return {
          hasAccess: true,
          userPermission,
          workspaceId: workspaceId || undefined,
          isOwner: false,
        }
      }
    }

    logger.warn('User has no access to workflow', {
      workflowId,
      userId,
      workspaceId,
      workflowOwnerId,
    })
    return {
      hasAccess: false,
      userPermission: null,
      workspaceId: workspaceId || undefined,
      isOwner: false,
    }
  } catch (error) {
    logger.error('Error verifying workflow access', { error, workflowId, userId })
    return { hasAccess: false, userPermission: null, isOwner: false }
  }
}

/**
 * Helper function to create consistent permission error messages
 */
export function createPermissionError(operation: string): string {
  return `Access denied: You do not have permission to ${operation} this workflow`
}
```

--------------------------------------------------------------------------------

---[FILE: base-tool.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/base-tool.ts

```typescript
import type { LucideIcon } from 'lucide-react'
// Lazy require in setState to avoid circular init issues
import { createLogger } from '@/lib/logs/console/logger'

const baseToolLogger = createLogger('BaseClientTool')

/** Default timeout for tool execution (5 minutes) */
const DEFAULT_TOOL_TIMEOUT_MS = 2 * 60 * 1000

/** Timeout for tools that run workflows (10 minutes) */
export const WORKFLOW_EXECUTION_TIMEOUT_MS = 10 * 60 * 1000

// Client tool call states used by the new runtime
export enum ClientToolCallState {
  generating = 'generating',
  pending = 'pending',
  executing = 'executing',
  aborted = 'aborted',
  rejected = 'rejected',
  success = 'success',
  error = 'error',
  review = 'review',
  background = 'background',
}

// Display configuration for a given state
export interface ClientToolDisplay {
  text: string
  icon: LucideIcon
}

/**
 * Function to generate dynamic display text based on tool parameters and state
 * @param params - The tool call parameters
 * @param state - The current tool call state
 * @returns The dynamic text to display, or undefined to use the default text
 */
export type DynamicTextFormatter = (
  params: Record<string, any>,
  state: ClientToolCallState
) => string | undefined

export interface BaseClientToolMetadata {
  displayNames: Partial<Record<ClientToolCallState, ClientToolDisplay>>
  interrupt?: {
    accept: ClientToolDisplay
    reject: ClientToolDisplay
  }
  /**
   * Optional function to generate dynamic display text based on parameters
   * If provided, this will override the default text in displayNames
   */
  getDynamicText?: DynamicTextFormatter
}

export class BaseClientTool {
  readonly toolCallId: string
  readonly name: string
  protected state: ClientToolCallState
  protected metadata: BaseClientToolMetadata
  protected isMarkedComplete = false
  protected timeoutMs: number = DEFAULT_TOOL_TIMEOUT_MS

  constructor(toolCallId: string, name: string, metadata: BaseClientToolMetadata) {
    this.toolCallId = toolCallId
    this.name = name
    this.metadata = metadata
    this.state = ClientToolCallState.generating
  }

  /**
   * Set a custom timeout for this tool (in milliseconds)
   */
  setTimeoutMs(ms: number): void {
    this.timeoutMs = ms
  }

  /**
   * Check if this tool has been marked complete
   */
  hasBeenMarkedComplete(): boolean {
    return this.isMarkedComplete
  }

  /**
   * Ensure the tool is marked complete. If not already marked, marks it with error.
   * This should be called in finally blocks to prevent leaked tool calls.
   */
  async ensureMarkedComplete(
    fallbackMessage = 'Tool execution did not complete properly'
  ): Promise<void> {
    if (!this.isMarkedComplete) {
      baseToolLogger.warn('Tool was not marked complete, marking with error', {
        toolCallId: this.toolCallId,
        toolName: this.name,
        state: this.state,
      })
      await this.markToolComplete(500, fallbackMessage)
      this.setState(ClientToolCallState.error)
    }
  }

  /**
   * Execute with timeout protection. Wraps the execution in a timeout and ensures
   * markToolComplete is always called.
   */
  async executeWithTimeout(executeFn: () => Promise<void>, timeoutMs?: number): Promise<void> {
    const timeout = timeoutMs ?? this.timeoutMs
    let timeoutId: NodeJS.Timeout | null = null

    try {
      await Promise.race([
        executeFn(),
        new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error(`Tool execution timed out after ${timeout / 1000} seconds`))
          }, timeout)
        }),
      ])
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      baseToolLogger.error('Tool execution failed or timed out', {
        toolCallId: this.toolCallId,
        toolName: this.name,
        error: message,
      })
      // Only mark complete if not already marked
      if (!this.isMarkedComplete) {
        await this.markToolComplete(500, message)
        this.setState(ClientToolCallState.error)
      }
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
      // Ensure tool is always marked complete
      await this.ensureMarkedComplete()
    }
  }

  // Intentionally left empty - specific tools can override
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_args?: Record<string, any>): Promise<void> {
    return
  }

  /**
   * Mark a tool as complete on the server (proxies to server-side route).
   * Once called, the tool is considered complete and won't be marked again.
   */
  async markToolComplete(status: number, message?: any, data?: any): Promise<boolean> {
    // Prevent double-marking
    if (this.isMarkedComplete) {
      baseToolLogger.warn('markToolComplete called but tool already marked complete', {
        toolCallId: this.toolCallId,
        toolName: this.name,
        existingState: this.state,
        attemptedStatus: status,
      })
      return true
    }

    this.isMarkedComplete = true

    try {
      baseToolLogger.info('markToolComplete called', {
        toolCallId: this.toolCallId,
        toolName: this.name,
        state: this.state,
        status,
        hasMessage: message !== undefined,
        hasData: data !== undefined,
      })
    } catch {}

    try {
      const res = await fetch('/api/copilot/tools/mark-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: this.toolCallId,
          name: this.name,
          status,
          message,
          data,
        }),
      })

      if (!res.ok) {
        // Try to surface server error
        let errorText = `Failed to mark tool complete (status ${res.status})`
        try {
          const { error } = await res.json()
          if (error) errorText = String(error)
        } catch {}
        throw new Error(errorText)
      }

      const json = (await res.json()) as { success?: boolean }
      return json?.success === true
    } catch (e) {
      // Default failure path - but tool is still marked complete locally
      baseToolLogger.error('Failed to mark tool complete on server', {
        toolCallId: this.toolCallId,
        error: e instanceof Error ? e.message : String(e),
      })
      return false
    }
  }

  // Accept (continue) for interrupt flows: move pending -> executing
  async handleAccept(): Promise<void> {
    this.setState(ClientToolCallState.executing)
  }

  // Reject (skip) for interrupt flows: mark complete with a standard skip message
  async handleReject(): Promise<void> {
    await this.markToolComplete(200, 'Tool execution was skipped by the user')
    this.setState(ClientToolCallState.rejected)
  }

  // Return the display configuration for the current state
  getDisplayState(): ClientToolDisplay | undefined {
    return this.metadata.displayNames[this.state]
  }

  // Return interrupt display config (labels/icons) if defined
  getInterruptDisplays(): BaseClientToolMetadata['interrupt'] | undefined {
    return this.metadata.interrupt
  }

  // Transition to a new state (also sync to Copilot store)
  setState(next: ClientToolCallState, options?: { result?: any }): void {
    const prev = this.state
    this.state = next

    // Notify store via manager to avoid import cycles
    try {
      const { syncToolState } = require('@/lib/copilot/tools/client/manager')
      syncToolState(this.toolCallId, next, options)
    } catch {}

    // Log transition after syncing
    try {
      baseToolLogger.info('setState transition', {
        toolCallId: this.toolCallId,
        toolName: this.name,
        prev,
        next,
        hasResult: options?.result !== undefined,
      })
    } catch {}
  }

  // Expose current state
  getState(): ClientToolCallState {
    return this.state
  }

  hasInterrupt(): boolean {
    return !!this.metadata.interrupt
  }
}
```

--------------------------------------------------------------------------------

---[FILE: manager.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/manager.ts

```typescript
const instances: Record<string, any> = {}

let syncStateFn: ((toolCallId: string, nextState: any, options?: { result?: any }) => void) | null =
  null

export function registerClientTool(toolCallId: string, instance: any) {
  instances[toolCallId] = instance
}

export function getClientTool(toolCallId: string): any | undefined {
  return instances[toolCallId]
}

export function unregisterClientTool(toolCallId: string) {
  delete instances[toolCallId]
}

export function registerToolStateSync(
  fn: (toolCallId: string, nextState: any, options?: { result?: any }) => void
) {
  syncStateFn = fn
}

export function syncToolState(toolCallId: string, nextState: any, options?: { result?: any }) {
  try {
    syncStateFn?.(toolCallId, nextState, options)
  } catch {}
}
```

--------------------------------------------------------------------------------

---[FILE: registry.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/registry.ts

```typescript
import type { ClientToolDefinition, ToolExecutionContext } from '@/lib/copilot/tools/client/types'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ClientToolRegistry')

const tools: Record<string, ClientToolDefinition<any>> = {}

export function registerTool(def: ClientToolDefinition<any>) {
  tools[def.name] = def
}

export function getTool(name: string): ClientToolDefinition<any> | undefined {
  return tools[name]
}

export function createExecutionContext(params: {
  toolCallId: string
  toolName: string
}): ToolExecutionContext {
  const { toolCallId, toolName } = params
  return {
    toolCallId,
    toolName,
    log: (level, message, extra) => {
      try {
        logger[level](message, { toolCallId, toolName, ...(extra || {}) })
      } catch {}
    },
  }
}

export function getRegisteredTools(): Record<string, ClientToolDefinition<any>> {
  return { ...tools }
}
```

--------------------------------------------------------------------------------

````
