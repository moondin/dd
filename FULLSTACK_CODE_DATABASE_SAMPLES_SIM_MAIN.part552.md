---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 552
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 552 of 933)

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

---[FILE: run-workflow.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/workflow/run-workflow.ts

```typescript
import { Loader2, MinusCircle, Play, XCircle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
  WORKFLOW_EXECUTION_TIMEOUT_MS,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'
import { executeWorkflowWithFullLogging } from '@/app/workspace/[workspaceId]/w/[workflowId]/utils'
import { useExecutionStore } from '@/stores/execution/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

interface RunWorkflowArgs {
  workflowId?: string
  description?: string
  workflow_input?: Record<string, any>
}

export class RunWorkflowClientTool extends BaseClientTool {
  static readonly id = 'run_workflow'

  constructor(toolCallId: string) {
    super(toolCallId, RunWorkflowClientTool.id, RunWorkflowClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Preparing to run your workflow', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Run this workflow?', icon: Play },
      [ClientToolCallState.executing]: { text: 'Running your workflow', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Workflow executed', icon: Play },
      [ClientToolCallState.error]: { text: 'Errored running workflow', icon: XCircle },
      [ClientToolCallState.rejected]: { text: 'Workflow execution skipped', icon: MinusCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted workflow execution', icon: MinusCircle },
      [ClientToolCallState.background]: { text: 'Running in background', icon: Play },
    },
    interrupt: {
      accept: { text: 'Run', icon: Play },
      reject: { text: 'Skip', icon: MinusCircle },
    },
    getDynamicText: (params, state) => {
      const workflowId = params?.workflowId || useWorkflowRegistry.getState().activeWorkflowId
      if (workflowId) {
        const workflowName = useWorkflowRegistry.getState().workflows[workflowId]?.name
        if (workflowName) {
          switch (state) {
            case ClientToolCallState.success:
              return `Ran ${workflowName}`
            case ClientToolCallState.executing:
              return `Running ${workflowName}`
            case ClientToolCallState.generating:
              return `Preparing to run ${workflowName}`
            case ClientToolCallState.pending:
              return `Run ${workflowName}?`
            case ClientToolCallState.error:
              return `Failed to run ${workflowName}`
            case ClientToolCallState.rejected:
              return `Skipped running ${workflowName}`
            case ClientToolCallState.aborted:
              return `Aborted running ${workflowName}`
            case ClientToolCallState.background:
              return `Running ${workflowName} in background`
          }
        }
      }
      return undefined
    },
  }

  async handleReject(): Promise<void> {
    await super.handleReject()
    this.setState(ClientToolCallState.rejected)
  }

  async handleAccept(args?: RunWorkflowArgs): Promise<void> {
    const logger = createLogger('RunWorkflowClientTool')

    // Use longer timeout for workflow execution (10 minutes)
    await this.executeWithTimeout(async () => {
      const params = args || {}
      logger.debug('handleAccept() called', {
        toolCallId: this.toolCallId,
        state: this.getState(),
        hasArgs: !!args,
        argKeys: args ? Object.keys(args) : [],
      })

      // prevent concurrent execution
      const { isExecuting, setIsExecuting } = useExecutionStore.getState()
      if (isExecuting) {
        logger.debug('Execution prevented: already executing')
        this.setState(ClientToolCallState.error)
        await this.markToolComplete(
          409,
          'The workflow is already in the middle of an execution. Try again later'
        )
        return
      }

      const { activeWorkflowId } = useWorkflowRegistry.getState()
      if (!activeWorkflowId) {
        logger.debug('Execution prevented: no active workflow')
        this.setState(ClientToolCallState.error)
        await this.markToolComplete(400, 'No active workflow found')
        return
      }
      logger.debug('Using active workflow', { activeWorkflowId })

      const workflowInput = params.workflow_input || undefined
      if (workflowInput) {
        logger.debug('Workflow input provided', {
          inputFields: Object.keys(workflowInput),
          inputPreview: JSON.stringify(workflowInput).slice(0, 120),
        })
      }

      setIsExecuting(true)
      logger.debug('Set isExecuting(true) and switching state to executing')
      this.setState(ClientToolCallState.executing)

      const executionId = uuidv4()
      const executionStartTime = new Date().toISOString()
      logger.debug('Starting workflow execution', {
        executionStartTime,
        executionId,
        toolCallId: this.toolCallId,
      })

      try {
        const result = await executeWorkflowWithFullLogging({
          workflowInput,
          executionId,
        })

        // Determine success for both non-streaming and streaming executions
        let succeeded = true
        let errorMessage: string | undefined
        try {
          if (result && typeof result === 'object' && 'success' in (result as any)) {
            succeeded = Boolean((result as any).success)
            if (!succeeded) {
              errorMessage = (result as any)?.error || (result as any)?.output?.error
            }
          } else if (
            result &&
            typeof result === 'object' &&
            'execution' in (result as any) &&
            (result as any).execution &&
            typeof (result as any).execution === 'object'
          ) {
            succeeded = Boolean((result as any).execution.success)
            if (!succeeded) {
              errorMessage =
                (result as any).execution?.error || (result as any).execution?.output?.error
            }
          }
        } catch {}

        if (succeeded) {
          logger.debug('Workflow execution finished with success')
          this.setState(ClientToolCallState.success)
          await this.markToolComplete(
            200,
            `Workflow execution completed. Started at: ${executionStartTime}`
          )
        } else {
          const msg = errorMessage || 'Workflow execution failed'
          logger.error('Workflow execution finished with failure', { message: msg })
          this.setState(ClientToolCallState.error)
          await this.markToolComplete(500, msg)
        }
      } finally {
        // Always clean up execution state
        setIsExecuting(false)
      }
    }, WORKFLOW_EXECUTION_TIMEOUT_MS)
  }

  async execute(args?: RunWorkflowArgs): Promise<void> {
    // For compatibility if execute() is explicitly invoked, route to handleAccept
    await this.handleAccept(args)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: set-global-workflow-variables.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/workflow/set-global-workflow-variables.ts

```typescript
import { Loader2, Settings2, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'
import { useVariablesStore } from '@/stores/panel/variables/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

interface OperationItem {
  operation: 'add' | 'edit' | 'delete'
  name: string
  type?: 'plain' | 'number' | 'boolean' | 'array' | 'object'
  value?: string
}

interface SetGlobalVarsArgs {
  operations: OperationItem[]
  workflowId?: string
}

export class SetGlobalWorkflowVariablesClientTool extends BaseClientTool {
  static readonly id = 'set_global_workflow_variables'

  constructor(toolCallId: string) {
    super(
      toolCallId,
      SetGlobalWorkflowVariablesClientTool.id,
      SetGlobalWorkflowVariablesClientTool.metadata
    )
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: {
        text: 'Preparing to set workflow variables',
        icon: Loader2,
      },
      [ClientToolCallState.pending]: { text: 'Set workflow variables?', icon: Settings2 },
      [ClientToolCallState.executing]: { text: 'Setting workflow variables', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Workflow variables updated', icon: Settings2 },
      [ClientToolCallState.error]: { text: 'Failed to set workflow variables', icon: X },
      [ClientToolCallState.aborted]: { text: 'Aborted setting variables', icon: XCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped setting variables', icon: XCircle },
    },
    interrupt: {
      accept: { text: 'Apply', icon: Settings2 },
      reject: { text: 'Skip', icon: XCircle },
    },
    getDynamicText: (params, state) => {
      if (params?.operations && Array.isArray(params.operations)) {
        const varNames = params.operations
          .slice(0, 2)
          .map((op: any) => op.name)
          .filter(Boolean)

        if (varNames.length > 0) {
          const varList = varNames.join(', ')
          const more = params.operations.length > 2 ? '...' : ''
          const displayText = `${varList}${more}`

          switch (state) {
            case ClientToolCallState.success:
              return `Set ${displayText}`
            case ClientToolCallState.executing:
              return `Setting ${displayText}`
            case ClientToolCallState.generating:
              return `Preparing to set ${displayText}`
            case ClientToolCallState.pending:
              return `Set ${displayText}?`
            case ClientToolCallState.error:
              return `Failed to set ${displayText}`
            case ClientToolCallState.aborted:
              return `Aborted setting ${displayText}`
            case ClientToolCallState.rejected:
              return `Skipped setting ${displayText}`
          }
        }
      }
      return undefined
    },
  }

  async handleReject(): Promise<void> {
    await super.handleReject()
    this.setState(ClientToolCallState.rejected)
  }

  async handleAccept(args?: SetGlobalVarsArgs): Promise<void> {
    const logger = createLogger('SetGlobalWorkflowVariablesClientTool')
    try {
      this.setState(ClientToolCallState.executing)
      const payload: SetGlobalVarsArgs = { ...(args || { operations: [] }) }
      if (!payload.workflowId) {
        const { activeWorkflowId } = useWorkflowRegistry.getState()
        if (activeWorkflowId) payload.workflowId = activeWorkflowId
      }
      if (!payload.workflowId) {
        throw new Error('No active workflow found')
      }

      // Fetch current variables so we can construct full array payload
      const getRes = await fetch(`/api/workflows/${payload.workflowId}/variables`, {
        method: 'GET',
      })
      if (!getRes.ok) {
        const txt = await getRes.text().catch(() => '')
        throw new Error(txt || 'Failed to load current variables')
      }
      const currentJson = await getRes.json()
      const currentVarsRecord = (currentJson?.data as Record<string, any>) || {}

      // Helper to convert string -> typed value
      function coerceValue(
        value: string | undefined,
        type?: 'plain' | 'number' | 'boolean' | 'array' | 'object'
      ) {
        if (value === undefined) return value
        const t = type || 'plain'
        try {
          if (t === 'number') {
            const n = Number(value)
            if (Number.isNaN(n)) return value
            return n
          }
          if (t === 'boolean') {
            const v = String(value).trim().toLowerCase()
            if (v === 'true') return true
            if (v === 'false') return false
            return value
          }
          if (t === 'array' || t === 'object') {
            const parsed = JSON.parse(value)
            if (t === 'array' && Array.isArray(parsed)) return parsed
            if (t === 'object' && parsed && typeof parsed === 'object' && !Array.isArray(parsed))
              return parsed
            return value
          }
        } catch {}
        return value
      }

      // Build mutable map by variable name
      const byName: Record<string, any> = {}
      Object.values(currentVarsRecord).forEach((v: any) => {
        if (v && typeof v === 'object' && v.id && v.name) byName[String(v.name)] = v
      })

      // Apply operations in order
      for (const op of payload.operations || []) {
        const key = String(op.name)
        const nextType = (op.type as any) || byName[key]?.type || 'plain'
        if (op.operation === 'delete') {
          delete byName[key]
          continue
        }
        const typedValue = coerceValue(op.value, nextType)
        if (op.operation === 'add') {
          byName[key] = {
            id: crypto.randomUUID(),
            workflowId: payload.workflowId,
            name: key,
            type: nextType,
            value: typedValue,
          }
          continue
        }
        if (op.operation === 'edit') {
          if (!byName[key]) {
            // If editing a non-existent variable, create it
            byName[key] = {
              id: crypto.randomUUID(),
              workflowId: payload.workflowId,
              name: key,
              type: nextType,
              value: typedValue,
            }
          } else {
            byName[key] = {
              ...byName[key],
              type: nextType,
              ...(op.value !== undefined ? { value: typedValue } : {}),
            }
          }
        }
      }

      const variablesArray = Object.values(byName)

      // POST full variables array to persist
      const res = await fetch(`/api/workflows/${payload.workflowId}/variables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variables: variablesArray }),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || `Failed to update variables (${res.status})`)
      }

      try {
        const { activeWorkflowId } = useWorkflowRegistry.getState()
        if (activeWorkflowId) {
          // Fetch the updated variables from the API
          const refreshRes = await fetch(`/api/workflows/${activeWorkflowId}/variables`, {
            method: 'GET',
          })

          if (refreshRes.ok) {
            const refreshJson = await refreshRes.json()
            const updatedVarsRecord = (refreshJson?.data as Record<string, any>) || {}

            // Update the variables store with the fresh data
            useVariablesStore.setState((state) => {
              // Remove old variables for this workflow
              const withoutWorkflow = Object.fromEntries(
                Object.entries(state.variables).filter(([, v]) => v.workflowId !== activeWorkflowId)
              )
              // Add the updated variables
              return {
                variables: { ...withoutWorkflow, ...updatedVarsRecord },
              }
            })

            logger.info('Refreshed variables in store', { workflowId: activeWorkflowId })
          }
        }
      } catch (refreshError) {
        logger.warn('Failed to refresh variables in store', { error: refreshError })
      }

      await this.markToolComplete(200, 'Workflow variables updated', { variables: byName })
      this.setState(ClientToolCallState.success)
    } catch (e: any) {
      const message = e instanceof Error ? e.message : String(e)
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, message || 'Failed to set workflow variables')
    }
  }

  async execute(args?: SetGlobalVarsArgs): Promise<void> {
    await this.handleAccept(args)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: base-tool.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/server/base-tool.ts

```typescript
export interface BaseServerTool<TArgs = any, TResult = any> {
  name: string
  execute(args: TArgs, context?: { userId: string }): Promise<TResult>
}
```

--------------------------------------------------------------------------------

---[FILE: router.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/server/router.ts

```typescript
import type { BaseServerTool } from '@/lib/copilot/tools/server/base-tool'
import { getBlocksAndToolsServerTool } from '@/lib/copilot/tools/server/blocks/get-blocks-and-tools'
import { getBlocksMetadataServerTool } from '@/lib/copilot/tools/server/blocks/get-blocks-metadata-tool'
import { getTriggerBlocksServerTool } from '@/lib/copilot/tools/server/blocks/get-trigger-blocks'
import { searchDocumentationServerTool } from '@/lib/copilot/tools/server/docs/search-documentation'
import {
  KnowledgeBaseInput,
  knowledgeBaseServerTool,
} from '@/lib/copilot/tools/server/knowledge/knowledge-base'
import { makeApiRequestServerTool } from '@/lib/copilot/tools/server/other/make-api-request'
import { searchOnlineServerTool } from '@/lib/copilot/tools/server/other/search-online'
import { getCredentialsServerTool } from '@/lib/copilot/tools/server/user/get-credentials'
import { setEnvironmentVariablesServerTool } from '@/lib/copilot/tools/server/user/set-environment-variables'
import { editWorkflowServerTool } from '@/lib/copilot/tools/server/workflow/edit-workflow'
import { getWorkflowConsoleServerTool } from '@/lib/copilot/tools/server/workflow/get-workflow-console'
import {
  ExecuteResponseSuccessSchema,
  GetBlocksAndToolsInput,
  GetBlocksAndToolsResult,
  GetBlocksMetadataInput,
  GetBlocksMetadataResult,
  GetTriggerBlocksInput,
  GetTriggerBlocksResult,
} from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'

// Generic execute response schemas (success path only for this route; errors handled via HTTP status)
export { ExecuteResponseSuccessSchema }
export type ExecuteResponseSuccess = (typeof ExecuteResponseSuccessSchema)['_type']

// Define server tool registry for the new copilot runtime
const serverToolRegistry: Record<string, BaseServerTool<any, any>> = {}
const logger = createLogger('ServerToolRouter')

// Register tools
serverToolRegistry[getBlocksAndToolsServerTool.name] = getBlocksAndToolsServerTool
serverToolRegistry[getBlocksMetadataServerTool.name] = getBlocksMetadataServerTool
serverToolRegistry[getTriggerBlocksServerTool.name] = getTriggerBlocksServerTool
serverToolRegistry[editWorkflowServerTool.name] = editWorkflowServerTool
serverToolRegistry[getWorkflowConsoleServerTool.name] = getWorkflowConsoleServerTool
serverToolRegistry[searchDocumentationServerTool.name] = searchDocumentationServerTool
serverToolRegistry[searchOnlineServerTool.name] = searchOnlineServerTool
serverToolRegistry[setEnvironmentVariablesServerTool.name] = setEnvironmentVariablesServerTool
serverToolRegistry[getCredentialsServerTool.name] = getCredentialsServerTool
serverToolRegistry[makeApiRequestServerTool.name] = makeApiRequestServerTool
serverToolRegistry[knowledgeBaseServerTool.name] = knowledgeBaseServerTool

export async function routeExecution(
  toolName: string,
  payload: unknown,
  context?: { userId: string }
): Promise<any> {
  const tool = serverToolRegistry[toolName]
  if (!tool) {
    throw new Error(`Unknown server tool: ${toolName}`)
  }
  logger.debug('Routing to tool', {
    toolName,
    payloadPreview: (() => {
      try {
        return JSON.stringify(payload).slice(0, 200)
      } catch {
        return undefined
      }
    })(),
  })

  let args: any = payload || {}
  if (toolName === 'get_blocks_and_tools') {
    args = GetBlocksAndToolsInput.parse(args)
  }
  if (toolName === 'get_blocks_metadata') {
    args = GetBlocksMetadataInput.parse(args)
  }
  if (toolName === 'get_trigger_blocks') {
    args = GetTriggerBlocksInput.parse(args)
  }
  if (toolName === 'knowledge_base') {
    args = KnowledgeBaseInput.parse(args)
  }

  const result = await tool.execute(args, context)

  if (toolName === 'get_blocks_and_tools') {
    return GetBlocksAndToolsResult.parse(result)
  }
  if (toolName === 'get_blocks_metadata') {
    return GetBlocksMetadataResult.parse(result)
  }
  if (toolName === 'get_trigger_blocks') {
    return GetTriggerBlocksResult.parse(result)
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: get-blocks-and-tools.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/server/blocks/get-blocks-and-tools.ts

```typescript
import type { BaseServerTool } from '@/lib/copilot/tools/server/base-tool'
import {
  type GetBlocksAndToolsInput,
  GetBlocksAndToolsResult,
} from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'
import { registry as blockRegistry } from '@/blocks/registry'
import type { BlockConfig } from '@/blocks/types'

export const getBlocksAndToolsServerTool: BaseServerTool<
  ReturnType<typeof GetBlocksAndToolsInput.parse>,
  ReturnType<typeof GetBlocksAndToolsResult.parse>
> = {
  name: 'get_blocks_and_tools',
  async execute() {
    const logger = createLogger('GetBlocksAndToolsServerTool')
    logger.debug('Executing get_blocks_and_tools')

    type BlockListItem = {
      type: string
      name: string
      description?: string
      triggerAllowed?: boolean
    }
    const blocks: BlockListItem[] = []

    Object.entries(blockRegistry)
      .filter(([, blockConfig]: [string, BlockConfig]) => !blockConfig.hideFromToolbar)
      .forEach(([blockType, blockConfig]: [string, BlockConfig]) => {
        blocks.push({
          type: blockType,
          name: blockConfig.name,
          description: blockConfig.longDescription,
          triggerAllowed: 'triggerAllowed' in blockConfig ? !!blockConfig.triggerAllowed : false,
        })
      })

    const specialBlocks: Record<string, { name: string; description: string }> = {
      loop: {
        name: 'Loop',
        description:
          'Control flow block for iterating over collections or repeating actions in a loop',
      },
      parallel: {
        name: 'Parallel',
        description: 'Control flow block for executing multiple branches simultaneously',
      },
    }
    Object.entries(specialBlocks).forEach(([blockType, info]) => {
      if (!blocks.some((b) => b.type === blockType)) {
        blocks.push({
          type: blockType,
          name: info.name,
          description: info.description,
        })
      }
    })

    return GetBlocksAndToolsResult.parse({ blocks })
  },
}
```

--------------------------------------------------------------------------------

````
