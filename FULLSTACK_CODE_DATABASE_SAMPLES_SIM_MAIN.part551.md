---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 551
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 551 of 933)

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

---[FILE: get-workflow-data.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/workflow/get-workflow-data.ts

```typescript
import { Database, Loader2, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

const logger = createLogger('GetWorkflowDataClientTool')

/** Data type enum for the get_workflow_data tool */
export type WorkflowDataType = 'global_variables' | 'custom_tools' | 'mcp_tools' | 'files'

interface GetWorkflowDataArgs {
  data_type: WorkflowDataType
}

export class GetWorkflowDataClientTool extends BaseClientTool {
  static readonly id = 'get_workflow_data'

  constructor(toolCallId: string) {
    super(toolCallId, GetWorkflowDataClientTool.id, GetWorkflowDataClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Fetching workflow data', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Fetching workflow data', icon: Database },
      [ClientToolCallState.executing]: { text: 'Fetching workflow data', icon: Loader2 },
      [ClientToolCallState.aborted]: { text: 'Aborted fetching data', icon: XCircle },
      [ClientToolCallState.success]: { text: 'Workflow data retrieved', icon: Database },
      [ClientToolCallState.error]: { text: 'Failed to fetch data', icon: X },
      [ClientToolCallState.rejected]: { text: 'Skipped fetching data', icon: XCircle },
    },
    getDynamicText: (params, state) => {
      const dataType = params?.data_type as WorkflowDataType | undefined
      if (!dataType) return undefined

      const typeLabels: Record<WorkflowDataType, string> = {
        global_variables: 'variables',
        custom_tools: 'custom tools',
        mcp_tools: 'MCP tools',
        files: 'files',
      }

      const label = typeLabels[dataType] || dataType

      switch (state) {
        case ClientToolCallState.success:
          return `Retrieved ${label}`
        case ClientToolCallState.executing:
        case ClientToolCallState.generating:
          return `Fetching ${label}`
        case ClientToolCallState.pending:
          return `Fetch ${label}?`
        case ClientToolCallState.error:
          return `Failed to fetch ${label}`
        case ClientToolCallState.aborted:
          return `Aborted fetching ${label}`
        case ClientToolCallState.rejected:
          return `Skipped fetching ${label}`
      }
      return undefined
    },
  }

  async execute(args?: GetWorkflowDataArgs): Promise<void> {
    try {
      this.setState(ClientToolCallState.executing)

      const dataType = args?.data_type
      if (!dataType) {
        await this.markToolComplete(400, 'Missing data_type parameter')
        this.setState(ClientToolCallState.error)
        return
      }

      const { activeWorkflowId, hydration } = useWorkflowRegistry.getState()
      const activeWorkspaceId = hydration.workspaceId

      switch (dataType) {
        case 'global_variables':
          await this.fetchGlobalVariables(activeWorkflowId)
          break
        case 'custom_tools':
          await this.fetchCustomTools(activeWorkspaceId)
          break
        case 'mcp_tools':
          await this.fetchMcpTools(activeWorkspaceId)
          break
        case 'files':
          await this.fetchFiles(activeWorkspaceId)
          break
        default:
          await this.markToolComplete(400, `Unknown data_type: ${dataType}`)
          this.setState(ClientToolCallState.error)
          return
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      await this.markToolComplete(500, message || 'Failed to fetch workflow data')
      this.setState(ClientToolCallState.error)
    }
  }

  /**
   * Fetch global workflow variables
   */
  private async fetchGlobalVariables(workflowId: string | null): Promise<void> {
    if (!workflowId) {
      await this.markToolComplete(400, 'No active workflow found')
      this.setState(ClientToolCallState.error)
      return
    }

    const res = await fetch(`/api/workflows/${workflowId}/variables`, { method: 'GET' })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      await this.markToolComplete(res.status, text || 'Failed to fetch workflow variables')
      this.setState(ClientToolCallState.error)
      return
    }

    const json = await res.json()
    const varsRecord = (json?.data as Record<string, unknown>) || {}
    const variables = Object.values(varsRecord).map((v: unknown) => {
      const variable = v as { id?: string; name?: string; value?: unknown }
      return {
        id: String(variable?.id || ''),
        name: String(variable?.name || ''),
        value: variable?.value,
      }
    })

    logger.info('Fetched workflow variables', { count: variables.length })
    await this.markToolComplete(200, `Found ${variables.length} variable(s)`, { variables })
    this.setState(ClientToolCallState.success)
  }

  /**
   * Fetch custom tools for the workspace
   */
  private async fetchCustomTools(workspaceId: string | null): Promise<void> {
    if (!workspaceId) {
      await this.markToolComplete(400, 'No active workspace found')
      this.setState(ClientToolCallState.error)
      return
    }

    const res = await fetch(`/api/tools/custom?workspaceId=${workspaceId}`, { method: 'GET' })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      await this.markToolComplete(res.status, text || 'Failed to fetch custom tools')
      this.setState(ClientToolCallState.error)
      return
    }

    const json = await res.json()
    const toolsData = (json?.data as unknown[]) || []
    const customTools = toolsData.map((tool: unknown) => {
      const t = tool as {
        id?: string
        title?: string
        schema?: { function?: { name?: string; description?: string; parameters?: unknown } }
        code?: string
      }
      return {
        id: String(t?.id || ''),
        title: String(t?.title || ''),
        functionName: String(t?.schema?.function?.name || ''),
        description: String(t?.schema?.function?.description || ''),
        parameters: t?.schema?.function?.parameters,
      }
    })

    logger.info('Fetched custom tools', { count: customTools.length })
    await this.markToolComplete(200, `Found ${customTools.length} custom tool(s)`, { customTools })
    this.setState(ClientToolCallState.success)
  }

  /**
   * Fetch MCP tools for the workspace
   */
  private async fetchMcpTools(workspaceId: string | null): Promise<void> {
    if (!workspaceId) {
      await this.markToolComplete(400, 'No active workspace found')
      this.setState(ClientToolCallState.error)
      return
    }

    const res = await fetch(`/api/mcp/tools/discover?workspaceId=${workspaceId}`, { method: 'GET' })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      await this.markToolComplete(res.status, text || 'Failed to fetch MCP tools')
      this.setState(ClientToolCallState.error)
      return
    }

    const json = await res.json()
    const toolsData = (json?.data?.tools as unknown[]) || []
    const mcpTools = toolsData.map((tool: unknown) => {
      const t = tool as {
        name?: string
        serverId?: string
        serverName?: string
        description?: string
        inputSchema?: unknown
      }
      return {
        name: String(t?.name || ''),
        serverId: String(t?.serverId || ''),
        serverName: String(t?.serverName || ''),
        description: String(t?.description || ''),
        inputSchema: t?.inputSchema,
      }
    })

    logger.info('Fetched MCP tools', { count: mcpTools.length })
    await this.markToolComplete(200, `Found ${mcpTools.length} MCP tool(s)`, { mcpTools })
    this.setState(ClientToolCallState.success)
  }

  /**
   * Fetch workspace files metadata
   */
  private async fetchFiles(workspaceId: string | null): Promise<void> {
    if (!workspaceId) {
      await this.markToolComplete(400, 'No active workspace found')
      this.setState(ClientToolCallState.error)
      return
    }

    const res = await fetch(`/api/workspaces/${workspaceId}/files`, { method: 'GET' })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      await this.markToolComplete(res.status, text || 'Failed to fetch files')
      this.setState(ClientToolCallState.error)
      return
    }

    const json = await res.json()
    const filesData = (json?.files as unknown[]) || []
    const files = filesData.map((file: unknown) => {
      const f = file as {
        id?: string
        name?: string
        key?: string
        path?: string
        size?: number
        type?: string
        uploadedAt?: string
      }
      return {
        id: String(f?.id || ''),
        name: String(f?.name || ''),
        key: String(f?.key || ''),
        path: String(f?.path || ''),
        size: Number(f?.size || 0),
        type: String(f?.type || ''),
        uploadedAt: String(f?.uploadedAt || ''),
      }
    })

    logger.info('Fetched workspace files', { count: files.length })
    await this.markToolComplete(200, `Found ${files.length} file(s)`, { files })
    this.setState(ClientToolCallState.success)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: get-workflow-from-name.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/workflow/get-workflow-from-name.ts

```typescript
import { FileText, Loader2, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'
import { sanitizeForCopilot } from '@/lib/workflows/sanitization/json-sanitizer'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

const logger = createLogger('GetWorkflowFromNameClientTool')

interface GetWorkflowFromNameArgs {
  workflow_name: string
}

export class GetWorkflowFromNameClientTool extends BaseClientTool {
  static readonly id = 'get_workflow_from_name'

  constructor(toolCallId: string) {
    super(toolCallId, GetWorkflowFromNameClientTool.id, GetWorkflowFromNameClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Reading workflow', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Reading workflow', icon: FileText },
      [ClientToolCallState.executing]: { text: 'Reading workflow', icon: Loader2 },
      [ClientToolCallState.aborted]: { text: 'Aborted reading workflow', icon: XCircle },
      [ClientToolCallState.success]: { text: 'Read workflow', icon: FileText },
      [ClientToolCallState.error]: { text: 'Failed to read workflow', icon: X },
      [ClientToolCallState.rejected]: { text: 'Skipped reading workflow', icon: XCircle },
    },
    getDynamicText: (params, state) => {
      if (params?.workflow_name && typeof params.workflow_name === 'string') {
        const workflowName = params.workflow_name

        switch (state) {
          case ClientToolCallState.success:
            return `Read ${workflowName}`
          case ClientToolCallState.executing:
          case ClientToolCallState.generating:
          case ClientToolCallState.pending:
            return `Reading ${workflowName}`
          case ClientToolCallState.error:
            return `Failed to read ${workflowName}`
          case ClientToolCallState.aborted:
            return `Aborted reading ${workflowName}`
          case ClientToolCallState.rejected:
            return `Skipped reading ${workflowName}`
        }
      }
      return undefined
    },
  }

  async execute(args?: GetWorkflowFromNameArgs): Promise<void> {
    try {
      this.setState(ClientToolCallState.executing)

      const workflowName = args?.workflow_name?.trim()
      if (!workflowName) {
        await this.markToolComplete(400, 'workflow_name is required')
        this.setState(ClientToolCallState.error)
        return
      }

      // Try to find by name from registry first to get ID
      const registry = useWorkflowRegistry.getState()
      const match = Object.values((registry as any).workflows || {}).find(
        (w: any) =>
          String(w?.name || '')
            .trim()
            .toLowerCase() === workflowName.toLowerCase()
      ) as any

      if (!match?.id) {
        await this.markToolComplete(404, `Workflow not found: ${workflowName}`)
        this.setState(ClientToolCallState.error)
        return
      }

      // Fetch full workflow from API route (normalized tables)
      const res = await fetch(`/api/workflows/${encodeURIComponent(match.id)}`, { method: 'GET' })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        await this.markToolComplete(res.status, text || 'Failed to fetch workflow by name')
        this.setState(ClientToolCallState.error)
        return
      }

      const json = await res.json()
      const wf = json?.data
      if (!wf?.state?.blocks) {
        await this.markToolComplete(422, 'Workflow state is empty or invalid')
        this.setState(ClientToolCallState.error)
        return
      }

      // Convert state to the same string format as get_user_workflow
      const workflowState = {
        blocks: wf.state.blocks || {},
        edges: wf.state.edges || [],
        loops: wf.state.loops || {},
        parallels: wf.state.parallels || {},
      }
      // Sanitize workflow state for copilot (remove UI-specific data)
      const sanitizedState = sanitizeForCopilot(workflowState)
      const userWorkflow = JSON.stringify(sanitizedState, null, 2)

      await this.markToolComplete(200, `Retrieved workflow ${workflowName}`, { userWorkflow })
      this.setState(ClientToolCallState.success)
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error)
      await this.markToolComplete(500, message || 'Failed to retrieve workflow by name')
      this.setState(ClientToolCallState.error)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: list-user-workflows.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/workflow/list-user-workflows.ts

```typescript
import { ListChecks, Loader2, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ListUserWorkflowsClientTool')

export class ListUserWorkflowsClientTool extends BaseClientTool {
  static readonly id = 'list_user_workflows'

  constructor(toolCallId: string) {
    super(toolCallId, ListUserWorkflowsClientTool.id, ListUserWorkflowsClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Listing your workflows', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Listing your workflows', icon: ListChecks },
      [ClientToolCallState.executing]: { text: 'Listing your workflows', icon: Loader2 },
      [ClientToolCallState.aborted]: { text: 'Aborted listing workflows', icon: XCircle },
      [ClientToolCallState.success]: { text: 'Listed your workflows', icon: ListChecks },
      [ClientToolCallState.error]: { text: 'Failed to list workflows', icon: X },
      [ClientToolCallState.rejected]: { text: 'Skipped listing workflows', icon: XCircle },
    },
  }

  async execute(): Promise<void> {
    try {
      this.setState(ClientToolCallState.executing)

      const res = await fetch('/api/workflows', { method: 'GET' })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        await this.markToolComplete(res.status, text || 'Failed to fetch workflows')
        this.setState(ClientToolCallState.error)
        return
      }

      const json = await res.json()
      const workflows = Array.isArray(json?.data) ? json.data : []
      const names = workflows
        .map((w: any) => (typeof w?.name === 'string' ? w.name : null))
        .filter((n: string | null) => !!n)

      logger.info('Found workflows', { count: names.length })

      await this.markToolComplete(200, `Found ${names.length} workflow(s)`, {
        workflow_names: names,
      })
      this.setState(ClientToolCallState.success)
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error)
      await this.markToolComplete(500, message || 'Failed to list workflows')
      this.setState(ClientToolCallState.error)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: manage-custom-tool.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/workflow/manage-custom-tool.ts

```typescript
import { Check, Loader2, Plus, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'
import { useCustomToolsStore } from '@/stores/custom-tools/store'
import { useCopilotStore } from '@/stores/panel/copilot/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

interface CustomToolSchema {
  type: 'function'
  function: {
    name: string
    description?: string
    parameters: {
      type: string
      properties: Record<string, any>
      required?: string[]
    }
  }
}

interface ManageCustomToolArgs {
  operation: 'add' | 'edit' | 'delete'
  toolId?: string
  schema?: CustomToolSchema
  code?: string
}

const API_ENDPOINT = '/api/tools/custom'

/**
 * Client tool for creating, editing, and deleting custom tools via the copilot.
 */
export class ManageCustomToolClientTool extends BaseClientTool {
  static readonly id = 'manage_custom_tool'
  private currentArgs?: ManageCustomToolArgs

  constructor(toolCallId: string) {
    super(toolCallId, ManageCustomToolClientTool.id, ManageCustomToolClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: {
        text: 'Managing custom tool',
        icon: Loader2,
      },
      [ClientToolCallState.pending]: { text: 'Manage custom tool?', icon: Plus },
      [ClientToolCallState.executing]: { text: 'Managing custom tool', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Managed custom tool', icon: Check },
      [ClientToolCallState.error]: { text: 'Failed to manage custom tool', icon: X },
      [ClientToolCallState.aborted]: {
        text: 'Aborted managing custom tool',
        icon: XCircle,
      },
      [ClientToolCallState.rejected]: {
        text: 'Skipped managing custom tool',
        icon: XCircle,
      },
    },
    interrupt: {
      accept: { text: 'Allow', icon: Check },
      reject: { text: 'Skip', icon: XCircle },
    },
    getDynamicText: (params, state) => {
      const operation = params?.operation as 'add' | 'edit' | 'delete' | undefined

      // Return undefined if no operation yet - use static defaults
      if (!operation) return undefined

      // Get tool name from schema, or look it up from the store by toolId
      let toolName = params?.schema?.function?.name
      if (!toolName && params?.toolId) {
        try {
          const tool = useCustomToolsStore.getState().getTool(params.toolId)
          toolName = tool?.schema?.function?.name
        } catch {
          // Ignore errors accessing store
        }
      }

      const getActionText = (verb: 'present' | 'past' | 'gerund') => {
        switch (operation) {
          case 'add':
            return verb === 'present' ? 'Create' : verb === 'past' ? 'Created' : 'Creating'
          case 'edit':
            return verb === 'present' ? 'Edit' : verb === 'past' ? 'Edited' : 'Editing'
          case 'delete':
            return verb === 'present' ? 'Delete' : verb === 'past' ? 'Deleted' : 'Deleting'
        }
      }

      // For add: only show tool name in past tense (success)
      // For edit/delete: always show tool name
      const shouldShowToolName = (currentState: ClientToolCallState) => {
        if (operation === 'add') {
          return currentState === ClientToolCallState.success
        }
        return true // edit and delete always show tool name
      }

      const nameText = shouldShowToolName(state) && toolName ? ` ${toolName}` : ' custom tool'

      switch (state) {
        case ClientToolCallState.success:
          return `${getActionText('past')}${nameText}`
        case ClientToolCallState.executing:
          return `${getActionText('gerund')}${nameText}`
        case ClientToolCallState.generating:
          return `${getActionText('gerund')}${nameText}`
        case ClientToolCallState.pending:
          return `${getActionText('present')}${nameText}?`
        case ClientToolCallState.error:
          return `Failed to ${getActionText('present')?.toLowerCase()}${nameText}`
        case ClientToolCallState.aborted:
          return `Aborted ${getActionText('gerund')?.toLowerCase()}${nameText}`
        case ClientToolCallState.rejected:
          return `Skipped ${getActionText('gerund')?.toLowerCase()}${nameText}`
      }
      return undefined
    },
  }

  /**
   * Gets the tool call args from the copilot store (needed before execute() is called)
   */
  private getArgsFromStore(): ManageCustomToolArgs | undefined {
    try {
      const { toolCallsById } = useCopilotStore.getState()
      const toolCall = toolCallsById[this.toolCallId]
      return (toolCall as any)?.params as ManageCustomToolArgs | undefined
    } catch {
      return undefined
    }
  }

  /**
   * Override getInterruptDisplays to only show confirmation for edit and delete operations.
   * Add operations execute directly without confirmation.
   */
  getInterruptDisplays(): BaseClientToolMetadata['interrupt'] | undefined {
    // Try currentArgs first, then fall back to store (for when called before execute())
    const args = this.currentArgs || this.getArgsFromStore()
    const operation = args?.operation
    if (operation === 'edit' || operation === 'delete') {
      return this.metadata.interrupt
    }
    return undefined
  }

  async handleReject(): Promise<void> {
    await super.handleReject()
    this.setState(ClientToolCallState.rejected)
  }

  async handleAccept(args?: ManageCustomToolArgs): Promise<void> {
    const logger = createLogger('ManageCustomToolClientTool')
    try {
      this.setState(ClientToolCallState.executing)
      await this.executeOperation(args, logger)
    } catch (e: any) {
      logger.error('execute failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'Failed to manage custom tool')
    }
  }

  async execute(args?: ManageCustomToolArgs): Promise<void> {
    this.currentArgs = args
    // For add operation, execute directly without confirmation
    // For edit/delete, the copilot store will check hasInterrupt() and wait for confirmation
    if (args?.operation === 'add') {
      await this.handleAccept(args)
    }
    // edit/delete will wait for user confirmation via handleAccept
  }

  /**
   * Executes the custom tool operation (add, edit, or delete)
   */
  private async executeOperation(
    args: ManageCustomToolArgs | undefined,
    logger: ReturnType<typeof createLogger>
  ): Promise<void> {
    if (!args?.operation) {
      throw new Error('Operation is required')
    }

    const { operation, toolId, schema, code } = args

    // Get workspace ID from the workflow registry
    const { hydration } = useWorkflowRegistry.getState()
    const workspaceId = hydration.workspaceId
    if (!workspaceId) {
      throw new Error('No active workspace found')
    }

    logger.info(`Executing custom tool operation: ${operation}`, {
      operation,
      toolId,
      functionName: schema?.function?.name,
      workspaceId,
    })

    switch (operation) {
      case 'add':
        await this.addCustomTool({ schema, code, workspaceId }, logger)
        break
      case 'edit':
        await this.editCustomTool({ toolId, schema, code, workspaceId }, logger)
        break
      case 'delete':
        await this.deleteCustomTool({ toolId, workspaceId }, logger)
        break
      default:
        throw new Error(`Unknown operation: ${operation}`)
    }
  }

  /**
   * Creates a new custom tool
   */
  private async addCustomTool(
    params: {
      schema?: CustomToolSchema
      code?: string
      workspaceId: string
    },
    logger: ReturnType<typeof createLogger>
  ): Promise<void> {
    const { schema, code, workspaceId } = params

    if (!schema) {
      throw new Error('Schema is required for adding a custom tool')
    }
    if (!code) {
      throw new Error('Code is required for adding a custom tool')
    }

    const functionName = schema.function.name

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tools: [{ title: functionName, schema, code }],
        workspaceId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create custom tool')
    }

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Invalid API response: missing tool data')
    }

    const createdTool = data.data[0]
    logger.info(`Created custom tool: ${functionName}`, { toolId: createdTool.id })

    this.setState(ClientToolCallState.success)
    await this.markToolComplete(200, `Created custom tool "${functionName}"`, {
      success: true,
      operation: 'add',
      toolId: createdTool.id,
      functionName,
    })
  }

  /**
   * Updates an existing custom tool
   */
  private async editCustomTool(
    params: {
      toolId?: string
      schema?: CustomToolSchema
      code?: string
      workspaceId: string
    },
    logger: ReturnType<typeof createLogger>
  ): Promise<void> {
    const { toolId, schema, code, workspaceId } = params

    if (!toolId) {
      throw new Error('Tool ID is required for editing a custom tool')
    }

    // At least one of schema or code must be provided
    if (!schema && !code) {
      throw new Error('At least one of schema or code must be provided for editing')
    }

    // We need to send the full tool data to the API for updates
    // First, fetch the existing tool to merge with updates
    const existingResponse = await fetch(`${API_ENDPOINT}?workspaceId=${workspaceId}`)
    const existingData = await existingResponse.json()

    if (!existingResponse.ok) {
      throw new Error(existingData.error || 'Failed to fetch existing tools')
    }

    const existingTool = existingData.data?.find((t: any) => t.id === toolId)
    if (!existingTool) {
      throw new Error(`Tool with ID ${toolId} not found`)
    }

    // Merge updates with existing tool - use function name as title
    const mergedSchema = schema ?? existingTool.schema
    const updatedTool = {
      id: toolId,
      title: mergedSchema.function.name,
      schema: mergedSchema,
      code: code ?? existingTool.code,
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tools: [updatedTool],
        workspaceId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update custom tool')
    }

    const functionName = updatedTool.schema.function.name
    logger.info(`Updated custom tool: ${functionName}`, { toolId })

    this.setState(ClientToolCallState.success)
    await this.markToolComplete(200, `Updated custom tool "${functionName}"`, {
      success: true,
      operation: 'edit',
      toolId,
      functionName,
    })
  }

  /**
   * Deletes a custom tool
   */
  private async deleteCustomTool(
    params: {
      toolId?: string
      workspaceId: string
    },
    logger: ReturnType<typeof createLogger>
  ): Promise<void> {
    const { toolId, workspaceId } = params

    if (!toolId) {
      throw new Error('Tool ID is required for deleting a custom tool')
    }

    const url = `${API_ENDPOINT}?id=${toolId}&workspaceId=${workspaceId}`
    const response = await fetch(url, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete custom tool')
    }

    logger.info(`Deleted custom tool: ${toolId}`)

    this.setState(ClientToolCallState.success)
    await this.markToolComplete(200, `Deleted custom tool`, {
      success: true,
      operation: 'delete',
      toolId,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: manage-mcp-tool.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/workflow/manage-mcp-tool.ts

```typescript
import { Check, Loader2, Server, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'
import { useCopilotStore } from '@/stores/panel/copilot/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

interface McpServerConfig {
  name: string
  transport: 'streamable-http'
  url?: string
  headers?: Record<string, string>
  timeout?: number
  enabled?: boolean
}

interface ManageMcpToolArgs {
  operation: 'add' | 'edit' | 'delete'
  serverId?: string
  config?: McpServerConfig
}

const API_ENDPOINT = '/api/mcp/servers'

/**
 * Client tool for creating, editing, and deleting MCP tool servers via the copilot.
 */
export class ManageMcpToolClientTool extends BaseClientTool {
  static readonly id = 'manage_mcp_tool'
  private currentArgs?: ManageMcpToolArgs

  constructor(toolCallId: string) {
    super(toolCallId, ManageMcpToolClientTool.id, ManageMcpToolClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: {
        text: 'Managing MCP tool',
        icon: Loader2,
      },
      [ClientToolCallState.pending]: { text: 'Manage MCP tool?', icon: Server },
      [ClientToolCallState.executing]: { text: 'Managing MCP tool', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Managed MCP tool', icon: Check },
      [ClientToolCallState.error]: { text: 'Failed to manage MCP tool', icon: X },
      [ClientToolCallState.aborted]: {
        text: 'Aborted managing MCP tool',
        icon: XCircle,
      },
      [ClientToolCallState.rejected]: {
        text: 'Skipped managing MCP tool',
        icon: XCircle,
      },
    },
    interrupt: {
      accept: { text: 'Allow', icon: Check },
      reject: { text: 'Skip', icon: XCircle },
    },
    getDynamicText: (params, state) => {
      const operation = params?.operation as 'add' | 'edit' | 'delete' | undefined

      if (!operation) return undefined

      const serverName = params?.config?.name || params?.serverName

      const getActionText = (verb: 'present' | 'past' | 'gerund') => {
        switch (operation) {
          case 'add':
            return verb === 'present' ? 'Add' : verb === 'past' ? 'Added' : 'Adding'
          case 'edit':
            return verb === 'present' ? 'Edit' : verb === 'past' ? 'Edited' : 'Editing'
          case 'delete':
            return verb === 'present' ? 'Delete' : verb === 'past' ? 'Deleted' : 'Deleting'
        }
      }

      const shouldShowServerName = (currentState: ClientToolCallState) => {
        if (operation === 'add') {
          return currentState === ClientToolCallState.success
        }
        return true
      }

      const nameText = shouldShowServerName(state) && serverName ? ` ${serverName}` : ' MCP tool'

      switch (state) {
        case ClientToolCallState.success:
          return `${getActionText('past')}${nameText}`
        case ClientToolCallState.executing:
          return `${getActionText('gerund')}${nameText}`
        case ClientToolCallState.generating:
          return `${getActionText('gerund')}${nameText}`
        case ClientToolCallState.pending:
          return `${getActionText('present')}${nameText}?`
        case ClientToolCallState.error:
          return `Failed to ${getActionText('present')?.toLowerCase()}${nameText}`
        case ClientToolCallState.aborted:
          return `Aborted ${getActionText('gerund')?.toLowerCase()}${nameText}`
        case ClientToolCallState.rejected:
          return `Skipped ${getActionText('gerund')?.toLowerCase()}${nameText}`
      }
      return undefined
    },
  }

  /**
   * Gets the tool call args from the copilot store (needed before execute() is called)
   */
  private getArgsFromStore(): ManageMcpToolArgs | undefined {
    try {
      const { toolCallsById } = useCopilotStore.getState()
      const toolCall = toolCallsById[this.toolCallId]
      return (toolCall as any)?.params as ManageMcpToolArgs | undefined
    } catch {
      return undefined
    }
  }

  /**
   * Override getInterruptDisplays to only show confirmation for edit and delete operations.
   * Add operations execute directly without confirmation.
   */
  getInterruptDisplays(): BaseClientToolMetadata['interrupt'] | undefined {
    const args = this.currentArgs || this.getArgsFromStore()
    const operation = args?.operation
    if (operation === 'edit' || operation === 'delete') {
      return this.metadata.interrupt
    }
    return undefined
  }

  async handleReject(): Promise<void> {
    await super.handleReject()
    this.setState(ClientToolCallState.rejected)
  }

  async handleAccept(args?: ManageMcpToolArgs): Promise<void> {
    const logger = createLogger('ManageMcpToolClientTool')
    try {
      this.setState(ClientToolCallState.executing)
      await this.executeOperation(args, logger)
    } catch (e: any) {
      logger.error('execute failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'Failed to manage MCP tool')
    }
  }

  async execute(args?: ManageMcpToolArgs): Promise<void> {
    this.currentArgs = args
    if (args?.operation === 'add') {
      await this.handleAccept(args)
    }
  }

  /**
   * Executes the MCP tool operation (add, edit, or delete)
   */
  private async executeOperation(
    args: ManageMcpToolArgs | undefined,
    logger: ReturnType<typeof createLogger>
  ): Promise<void> {
    if (!args?.operation) {
      throw new Error('Operation is required')
    }

    const { operation, serverId, config } = args

    const { hydration } = useWorkflowRegistry.getState()
    const workspaceId = hydration.workspaceId
    if (!workspaceId) {
      throw new Error('No active workspace found')
    }

    logger.info(`Executing MCP tool operation: ${operation}`, {
      operation,
      serverId,
      serverName: config?.name,
      workspaceId,
    })

    switch (operation) {
      case 'add':
        await this.addMcpServer({ config, workspaceId }, logger)
        break
      case 'edit':
        await this.editMcpServer({ serverId, config, workspaceId }, logger)
        break
      case 'delete':
        await this.deleteMcpServer({ serverId, workspaceId }, logger)
        break
      default:
        throw new Error(`Unknown operation: ${operation}`)
    }
  }

  /**
   * Creates a new MCP server
   */
  private async addMcpServer(
    params: {
      config?: McpServerConfig
      workspaceId: string
    },
    logger: ReturnType<typeof createLogger>
  ): Promise<void> {
    const { config, workspaceId } = params

    if (!config) {
      throw new Error('Config is required for adding an MCP tool')
    }
    if (!config.name) {
      throw new Error('Server name is required')
    }
    if (!config.url) {
      throw new Error('Server URL is required for streamable-http transport')
    }

    const serverData = {
      ...config,
      workspaceId,
      transport: config.transport || 'streamable-http',
      timeout: config.timeout || 30000,
      enabled: config.enabled !== false,
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serverData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create MCP tool')
    }

    const serverId = data.data?.serverId
    logger.info(`Created MCP tool: ${config.name}`, { serverId })

    this.setState(ClientToolCallState.success)
    await this.markToolComplete(200, `Created MCP tool "${config.name}"`, {
      success: true,
      operation: 'add',
      serverId,
      serverName: config.name,
    })
  }

  /**
   * Updates an existing MCP server
   */
  private async editMcpServer(
    params: {
      serverId?: string
      config?: McpServerConfig
      workspaceId: string
    },
    logger: ReturnType<typeof createLogger>
  ): Promise<void> {
    const { serverId, config, workspaceId } = params

    if (!serverId) {
      throw new Error('Server ID is required for editing an MCP tool')
    }

    if (!config) {
      throw new Error('Config is required for editing an MCP tool')
    }

    const updateData = {
      ...config,
      workspaceId,
    }

    const response = await fetch(`${API_ENDPOINT}/${serverId}?workspaceId=${workspaceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update MCP tool')
    }

    const serverName = config.name || data.data?.server?.name || serverId
    logger.info(`Updated MCP tool: ${serverName}`, { serverId })

    this.setState(ClientToolCallState.success)
    await this.markToolComplete(200, `Updated MCP tool "${serverName}"`, {
      success: true,
      operation: 'edit',
      serverId,
      serverName,
    })
  }

  /**
   * Deletes an MCP server
   */
  private async deleteMcpServer(
    params: {
      serverId?: string
      workspaceId: string
    },
    logger: ReturnType<typeof createLogger>
  ): Promise<void> {
    const { serverId, workspaceId } = params

    if (!serverId) {
      throw new Error('Server ID is required for deleting an MCP tool')
    }

    const url = `${API_ENDPOINT}?serverId=${serverId}&workspaceId=${workspaceId}`
    const response = await fetch(url, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete MCP tool')
    }

    logger.info(`Deleted MCP tool: ${serverId}`)

    this.setState(ClientToolCallState.success)
    await this.markToolComplete(200, `Deleted MCP tool`, {
      success: true,
      operation: 'delete',
      serverId,
    })
  }
}
```

--------------------------------------------------------------------------------

````
