---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 548
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 548 of 933)

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
Location: sim-main/apps/sim/lib/copilot/tools/client/types.ts

```typescript
import type { BaseClientToolMetadata } from '@/lib/copilot/tools/client/base-tool'
import { ClientToolCallState } from '@/lib/copilot/tools/client/base-tool'

export interface ToolExecutionContext {
  toolCallId: string
  toolName: string
  // Logging only; tools must not mutate store state directly
  log: (
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    extra?: Record<string, any>
  ) => void
}

export interface ToolRunResult {
  status: number
  message?: any
  data?: any
}

export interface ClientToolDefinition<Args = any> {
  name: string
  metadata?: BaseClientToolMetadata
  // Return true if this tool requires user confirmation before execution
  hasInterrupt?: boolean | ((args?: Args) => boolean)
  // Main execution entry point. Returns a result for the store to handle.
  execute: (ctx: ToolExecutionContext, args?: Args) => Promise<ToolRunResult | undefined>
  // Optional accept/reject handlers for interrupt flows
  accept?: (ctx: ToolExecutionContext, args?: Args) => Promise<ToolRunResult | undefined>
  reject?: (ctx: ToolExecutionContext, args?: Args) => Promise<ToolRunResult | undefined>
}

export { ClientToolCallState }
```

--------------------------------------------------------------------------------

---[FILE: get-blocks-and-tools.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/blocks/get-blocks-and-tools.ts

```typescript
import { Blocks, Loader2, MinusCircle, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import {
  ExecuteResponseSuccessSchema,
  GetBlocksAndToolsResult,
} from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'

export class GetBlocksAndToolsClientTool extends BaseClientTool {
  static readonly id = 'get_blocks_and_tools'

  constructor(toolCallId: string) {
    super(toolCallId, GetBlocksAndToolsClientTool.id, GetBlocksAndToolsClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Exploring available options', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Exploring available options', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Exploring available options', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Explored available options', icon: Blocks },
      [ClientToolCallState.error]: { text: 'Failed to explore options', icon: XCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted exploring options', icon: MinusCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped exploring options', icon: MinusCircle },
    },
    interrupt: undefined,
  }

  async execute(): Promise<void> {
    const logger = createLogger('GetBlocksAndToolsClientTool')
    try {
      this.setState(ClientToolCallState.executing)

      const res = await fetch('/api/copilot/execute-copilot-server-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName: 'get_blocks_and_tools', payload: {} }),
      })
      if (!res.ok) {
        const errorText = await res.text().catch(() => '')
        throw new Error(errorText || `Server error (${res.status})`)
      }
      const json = await res.json()
      const parsed = ExecuteResponseSuccessSchema.parse(json)
      const result = GetBlocksAndToolsResult.parse(parsed.result)

      await this.markToolComplete(200, 'Successfully retrieved blocks and tools', result)
      this.setState(ClientToolCallState.success)
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error)
      await this.markToolComplete(500, message)
      this.setState(ClientToolCallState.error)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: get-blocks-metadata.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/blocks/get-blocks-metadata.ts

```typescript
import { ListFilter, Loader2, MinusCircle, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import {
  ExecuteResponseSuccessSchema,
  GetBlocksMetadataInput,
  GetBlocksMetadataResult,
} from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'

interface GetBlocksMetadataArgs {
  blockIds: string[]
}

export class GetBlocksMetadataClientTool extends BaseClientTool {
  static readonly id = 'get_blocks_metadata'

  constructor(toolCallId: string) {
    super(toolCallId, GetBlocksMetadataClientTool.id, GetBlocksMetadataClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Searching block choices', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Searching block choices', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Searching block choices', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Searched block choices', icon: ListFilter },
      [ClientToolCallState.error]: { text: 'Failed to search block choices', icon: XCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted searching block choices', icon: XCircle },
      [ClientToolCallState.rejected]: {
        text: 'Skipped searching block choices',
        icon: MinusCircle,
      },
    },
    getDynamicText: (params, state) => {
      if (params?.blockIds && Array.isArray(params.blockIds) && params.blockIds.length > 0) {
        const blockList = params.blockIds
          .slice(0, 3)
          .map((blockId) => blockId.replace(/_/g, ' '))
          .join(', ')
        const more = params.blockIds.length > 3 ? '...' : ''
        const blocks = `${blockList}${more}`

        switch (state) {
          case ClientToolCallState.success:
            return `Searched ${blocks}`
          case ClientToolCallState.executing:
          case ClientToolCallState.generating:
          case ClientToolCallState.pending:
            return `Searching ${blocks}`
          case ClientToolCallState.error:
            return `Failed to search ${blocks}`
          case ClientToolCallState.aborted:
            return `Aborted searching ${blocks}`
          case ClientToolCallState.rejected:
            return `Skipped searching ${blocks}`
        }
      }
      return undefined
    },
  }

  async execute(args?: GetBlocksMetadataArgs): Promise<void> {
    const logger = createLogger('GetBlocksMetadataClientTool')
    try {
      this.setState(ClientToolCallState.executing)

      const { blockIds } = GetBlocksMetadataInput.parse(args || {})

      const res = await fetch('/api/copilot/execute-copilot-server-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName: 'get_blocks_metadata', payload: { blockIds } }),
      })
      if (!res.ok) {
        const errorText = await res.text().catch(() => '')
        throw new Error(errorText || `Server error (${res.status})`)
      }
      const json = await res.json()
      const parsed = ExecuteResponseSuccessSchema.parse(json)
      const result = GetBlocksMetadataResult.parse(parsed.result)

      await this.markToolComplete(200, { retrieved: Object.keys(result.metadata).length }, result)
      this.setState(ClientToolCallState.success)
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error)
      logger.error('Execute failed', { message })
      await this.markToolComplete(500, message)
      this.setState(ClientToolCallState.error)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: get-trigger-blocks.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/blocks/get-trigger-blocks.ts

```typescript
import { ListFilter, Loader2, MinusCircle, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import {
  ExecuteResponseSuccessSchema,
  GetTriggerBlocksResult,
} from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'

export class GetTriggerBlocksClientTool extends BaseClientTool {
  static readonly id = 'get_trigger_blocks'

  constructor(toolCallId: string) {
    super(toolCallId, GetTriggerBlocksClientTool.id, GetTriggerBlocksClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Finding trigger blocks', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Finding trigger blocks', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Finding trigger blocks', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Found trigger blocks', icon: ListFilter },
      [ClientToolCallState.error]: { text: 'Failed to find trigger blocks', icon: XCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted finding trigger blocks', icon: MinusCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped finding trigger blocks', icon: MinusCircle },
    },
    interrupt: undefined,
  }

  async execute(): Promise<void> {
    const logger = createLogger('GetTriggerBlocksClientTool')
    try {
      this.setState(ClientToolCallState.executing)

      const res = await fetch('/api/copilot/execute-copilot-server-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName: 'get_trigger_blocks', payload: {} }),
      })
      if (!res.ok) {
        const errorText = await res.text().catch(() => '')
        try {
          const errorJson = JSON.parse(errorText)
          throw new Error(errorJson.error || errorText || `Server error (${res.status})`)
        } catch {
          throw new Error(errorText || `Server error (${res.status})`)
        }
      }
      const json = await res.json()
      const parsed = ExecuteResponseSuccessSchema.parse(json)
      const result = GetTriggerBlocksResult.parse(parsed.result)

      await this.markToolComplete(200, 'Successfully retrieved trigger blocks', result)
      this.setState(ClientToolCallState.success)
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error)
      await this.markToolComplete(500, message)
      this.setState(ClientToolCallState.error)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: get-examples-rag.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/examples/get-examples-rag.ts

```typescript
import { Loader2, MinusCircle, Search, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'

export class GetExamplesRagClientTool extends BaseClientTool {
  static readonly id = 'get_examples_rag'

  constructor(toolCallId: string) {
    super(toolCallId, GetExamplesRagClientTool.id, GetExamplesRagClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Fetching examples', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Fetching examples', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Fetching examples', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Fetched examples', icon: Search },
      [ClientToolCallState.error]: { text: 'Failed to fetch examples', icon: XCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted getting examples', icon: MinusCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped getting examples', icon: MinusCircle },
    },
    interrupt: undefined,
    getDynamicText: (params, state) => {
      if (params?.query && typeof params.query === 'string') {
        const query = params.query
        const truncated = query.length > 40 ? `${query.slice(0, 40)}...` : query

        switch (state) {
          case ClientToolCallState.success:
            return `Found examples for ${truncated}`
          case ClientToolCallState.executing:
          case ClientToolCallState.generating:
          case ClientToolCallState.pending:
            return `Searching examples for ${truncated}`
          case ClientToolCallState.error:
            return `Failed to find examples for ${truncated}`
          case ClientToolCallState.aborted:
            return `Aborted searching examples for ${truncated}`
          case ClientToolCallState.rejected:
            return `Skipped searching examples for ${truncated}`
        }
      }
      return undefined
    },
  }

  async execute(): Promise<void> {
    return
  }
}
```

--------------------------------------------------------------------------------

---[FILE: get-operations-examples.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/examples/get-operations-examples.ts

```typescript
import { Loader2, MinusCircle, XCircle, Zap } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'

export class GetOperationsExamplesClientTool extends BaseClientTool {
  static readonly id = 'get_operations_examples'

  constructor(toolCallId: string) {
    super(toolCallId, GetOperationsExamplesClientTool.id, GetOperationsExamplesClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Designing workflow component', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Designing workflow component', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Designing workflow component', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Designed workflow component', icon: Zap },
      [ClientToolCallState.error]: { text: 'Failed to design workflow component', icon: XCircle },
      [ClientToolCallState.aborted]: {
        text: 'Aborted designing workflow component',
        icon: MinusCircle,
      },
      [ClientToolCallState.rejected]: {
        text: 'Skipped designing workflow component',
        icon: MinusCircle,
      },
    },
    interrupt: undefined,
    getDynamicText: (params, state) => {
      if (params?.query && typeof params.query === 'string') {
        const query = params.query
        const truncated = query.length > 40 ? `${query.slice(0, 40)}...` : query

        switch (state) {
          case ClientToolCallState.success:
            return `Designed ${truncated}`
          case ClientToolCallState.executing:
          case ClientToolCallState.generating:
          case ClientToolCallState.pending:
            return `Designing ${truncated}`
          case ClientToolCallState.error:
            return `Failed to design ${truncated}`
          case ClientToolCallState.aborted:
            return `Aborted designing ${truncated}`
          case ClientToolCallState.rejected:
            return `Skipped designing ${truncated}`
        }
      }
      return undefined
    },
  }

  async execute(): Promise<void> {
    return
  }
}
```

--------------------------------------------------------------------------------

---[FILE: get-trigger-examples.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/examples/get-trigger-examples.ts

```typescript
import { Loader2, MinusCircle, XCircle, Zap } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'

export class GetTriggerExamplesClientTool extends BaseClientTool {
  static readonly id = 'get_trigger_examples'

  constructor(toolCallId: string) {
    super(toolCallId, GetTriggerExamplesClientTool.id, GetTriggerExamplesClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Selecting a trigger', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Selecting a trigger', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Selecting a trigger', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Selected a trigger', icon: Zap },
      [ClientToolCallState.error]: { text: 'Failed to select a trigger', icon: XCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted selecting a trigger', icon: MinusCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped selecting a trigger', icon: MinusCircle },
    },
    interrupt: undefined,
  }

  async execute(): Promise<void> {
    return
  }
}
```

--------------------------------------------------------------------------------

---[FILE: summarize.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/examples/summarize.ts

```typescript
import { Loader2, MinusCircle, PencilLine, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'

export class SummarizeClientTool extends BaseClientTool {
  static readonly id = 'summarize_conversation'

  constructor(toolCallId: string) {
    super(toolCallId, SummarizeClientTool.id, SummarizeClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Summarizing conversation', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Summarizing conversation', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Summarizing conversation', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Summarized conversation', icon: PencilLine },
      [ClientToolCallState.error]: { text: 'Failed to summarize conversation', icon: XCircle },
      [ClientToolCallState.aborted]: {
        text: 'Aborted summarizing conversation',
        icon: MinusCircle,
      },
      [ClientToolCallState.rejected]: {
        text: 'Skipped summarizing conversation',
        icon: MinusCircle,
      },
    },
    interrupt: undefined,
  }

  async execute(): Promise<void> {
    return
  }
}
```

--------------------------------------------------------------------------------

---[FILE: knowledge-base.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/knowledge/knowledge-base.ts

```typescript
import { Database, Loader2, MinusCircle, PlusCircle, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import {
  ExecuteResponseSuccessSchema,
  type KnowledgeBaseArgs,
} from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'
import { useCopilotStore } from '@/stores/panel/copilot/store'

/**
 * Client tool for knowledge base operations
 */
export class KnowledgeBaseClientTool extends BaseClientTool {
  static readonly id = 'knowledge_base'

  constructor(toolCallId: string) {
    super(toolCallId, KnowledgeBaseClientTool.id, KnowledgeBaseClientTool.metadata)
  }

  /**
   * Only show interrupt for create operation
   */
  getInterruptDisplays(): BaseClientToolMetadata['interrupt'] | undefined {
    const toolCallsById = useCopilotStore.getState().toolCallsById
    const toolCall = toolCallsById[this.toolCallId]
    const params = toolCall?.params as KnowledgeBaseArgs | undefined

    // Only require confirmation for create operation
    if (params?.operation === 'create') {
      const name = params?.args?.name || 'new knowledge base'
      return {
        accept: { text: `Create "${name}"`, icon: PlusCircle },
        reject: { text: 'Skip', icon: XCircle },
      }
    }

    // No interrupt for list, get, query - auto-execute
    return undefined
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Accessing knowledge base', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Accessing knowledge base', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Accessing knowledge base', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Accessed knowledge base', icon: Database },
      [ClientToolCallState.error]: { text: 'Failed to access knowledge base', icon: XCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted knowledge base access', icon: MinusCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped knowledge base access', icon: MinusCircle },
    },
    getDynamicText: (params: Record<string, any>, state: ClientToolCallState) => {
      const operation = params?.operation as string | undefined
      const name = params?.args?.name as string | undefined

      const opVerbs: Record<string, { active: string; past: string; pending?: string }> = {
        create: {
          active: 'Creating knowledge base',
          past: 'Created knowledge base',
          pending: name ? `Create knowledge base "${name}"?` : 'Create knowledge base?',
        },
        list: { active: 'Listing knowledge bases', past: 'Listed knowledge bases' },
        get: { active: 'Getting knowledge base', past: 'Retrieved knowledge base' },
        query: { active: 'Querying knowledge base', past: 'Queried knowledge base' },
      }
      const defaultVerb: { active: string; past: string; pending?: string } = {
        active: 'Accessing knowledge base',
        past: 'Accessed knowledge base',
      }
      const verb = operation ? opVerbs[operation] || defaultVerb : defaultVerb

      if (state === ClientToolCallState.success) {
        return verb.past
      }
      if (state === ClientToolCallState.pending && verb.pending) {
        return verb.pending
      }
      if (
        state === ClientToolCallState.generating ||
        state === ClientToolCallState.pending ||
        state === ClientToolCallState.executing
      ) {
        return verb.active
      }
      return undefined
    },
  }

  async handleReject(): Promise<void> {
    await super.handleReject()
    this.setState(ClientToolCallState.rejected)
  }

  async handleAccept(args?: KnowledgeBaseArgs): Promise<void> {
    await this.execute(args)
  }

  async execute(args?: KnowledgeBaseArgs): Promise<void> {
    const logger = createLogger('KnowledgeBaseClientTool')
    try {
      this.setState(ClientToolCallState.executing)
      const payload: KnowledgeBaseArgs = { ...(args || { operation: 'list' }) }

      const res = await fetch('/api/copilot/execute-copilot-server-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName: 'knowledge_base', payload }),
      })

      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || `Server error (${res.status})`)
      }

      const json = await res.json()
      const parsed = ExecuteResponseSuccessSchema.parse(json)

      this.setState(ClientToolCallState.success)
      await this.markToolComplete(200, 'Knowledge base operation completed', parsed.result)
      this.setState(ClientToolCallState.success)
    } catch (e: any) {
      logger.error('execute failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'Failed to access knowledge base')
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: navigate-ui.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/navigation/navigate-ui.ts

```typescript
import { Loader2, Navigation, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'
import { useCopilotStore } from '@/stores/panel/copilot/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

type NavigationDestination = 'workflow' | 'logs' | 'templates' | 'vector_db' | 'settings'

interface NavigateUIArgs {
  destination: NavigationDestination
  workflowName?: string
}

export class NavigateUIClientTool extends BaseClientTool {
  static readonly id = 'navigate_ui'

  constructor(toolCallId: string) {
    super(toolCallId, NavigateUIClientTool.id, NavigateUIClientTool.metadata)
  }

  /**
   * Override to provide dynamic button text based on destination
   */
  getInterruptDisplays(): BaseClientToolMetadata['interrupt'] | undefined {
    const toolCallsById = useCopilotStore.getState().toolCallsById
    const toolCall = toolCallsById[this.toolCallId]
    const params = toolCall?.params as NavigateUIArgs | undefined

    const destination = params?.destination
    const workflowName = params?.workflowName

    let buttonText = 'Navigate'

    if (destination === 'workflow' && workflowName) {
      buttonText = 'Open workflow'
    } else if (destination === 'logs') {
      buttonText = 'Open logs'
    } else if (destination === 'templates') {
      buttonText = 'Open templates'
    } else if (destination === 'vector_db') {
      buttonText = 'Open vector DB'
    } else if (destination === 'settings') {
      buttonText = 'Open settings'
    }

    return {
      accept: { text: buttonText, icon: Navigation },
      reject: { text: 'Skip', icon: XCircle },
    }
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: {
        text: 'Preparing to open',
        icon: Loader2,
      },
      [ClientToolCallState.pending]: { text: 'Open?', icon: Navigation },
      [ClientToolCallState.executing]: { text: 'Opening', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Opened', icon: Navigation },
      [ClientToolCallState.error]: { text: 'Failed to open', icon: X },
      [ClientToolCallState.aborted]: {
        text: 'Aborted opening',
        icon: XCircle,
      },
      [ClientToolCallState.rejected]: {
        text: 'Skipped opening',
        icon: XCircle,
      },
    },
    interrupt: {
      accept: { text: 'Open', icon: Navigation },
      reject: { text: 'Skip', icon: XCircle },
    },
    getDynamicText: (params, state) => {
      const destination = params?.destination as NavigationDestination | undefined
      const workflowName = params?.workflowName

      const action = 'open'
      const actionCapitalized = 'Open'
      const actionPast = 'opened'
      const actionIng = 'opening'
      let target = ''

      if (destination === 'workflow' && workflowName) {
        target = ` workflow "${workflowName}"`
      } else if (destination === 'workflow') {
        target = ' workflows'
      } else if (destination === 'logs') {
        target = ' logs'
      } else if (destination === 'templates') {
        target = ' templates'
      } else if (destination === 'vector_db') {
        target = ' vector database'
      } else if (destination === 'settings') {
        target = ' settings'
      }

      const fullAction = `${action}${target}`
      const fullActionCapitalized = `${actionCapitalized}${target}`
      const fullActionPast = `${actionPast}${target}`
      const fullActionIng = `${actionIng}${target}`

      switch (state) {
        case ClientToolCallState.success:
          return fullActionPast.charAt(0).toUpperCase() + fullActionPast.slice(1)
        case ClientToolCallState.executing:
          return fullActionIng.charAt(0).toUpperCase() + fullActionIng.slice(1)
        case ClientToolCallState.generating:
          return `Preparing to ${fullAction}`
        case ClientToolCallState.pending:
          return `${fullActionCapitalized}?`
        case ClientToolCallState.error:
          return `Failed to ${fullAction}`
        case ClientToolCallState.aborted:
          return `Aborted ${fullAction}`
        case ClientToolCallState.rejected:
          return `Skipped ${fullAction}`
      }
      return undefined
    },
  }

  async handleReject(): Promise<void> {
    await super.handleReject()
    this.setState(ClientToolCallState.rejected)
  }

  async handleAccept(args?: NavigateUIArgs): Promise<void> {
    const logger = createLogger('NavigateUIClientTool')
    try {
      this.setState(ClientToolCallState.executing)

      // Get params from copilot store if not provided directly
      let destination = args?.destination
      let workflowName = args?.workflowName

      if (!destination) {
        const toolCallsById = useCopilotStore.getState().toolCallsById
        const toolCall = toolCallsById[this.toolCallId]
        const params = toolCall?.params as NavigateUIArgs | undefined
        destination = params?.destination
        workflowName = params?.workflowName
      }

      if (!destination) {
        throw new Error('No destination provided')
      }

      let navigationUrl = ''
      let successMessage = ''

      // Get current workspace ID from URL
      const workspaceId = window.location.pathname.split('/')[2]

      switch (destination) {
        case 'workflow':
          if (workflowName) {
            // Find workflow by name
            const { workflows } = useWorkflowRegistry.getState()
            const workflow = Object.values(workflows).find(
              (w) => w.name.toLowerCase() === workflowName.toLowerCase()
            )

            if (!workflow) {
              throw new Error(`Workflow "${workflowName}" not found`)
            }

            navigationUrl = `/workspace/${workspaceId}/w/${workflow.id}`
            successMessage = `Navigated to workflow "${workflowName}"`
          } else {
            navigationUrl = `/workspace/${workspaceId}/w`
            successMessage = 'Navigated to workflows'
          }
          break

        case 'logs':
          navigationUrl = `/workspace/${workspaceId}/logs`
          successMessage = 'Navigated to logs'
          break

        case 'templates':
          navigationUrl = `/workspace/${workspaceId}/templates`
          successMessage = 'Navigated to templates'
          break

        case 'vector_db':
          navigationUrl = `/workspace/${workspaceId}/vector-db`
          successMessage = 'Navigated to vector database'
          break

        case 'settings':
          window.dispatchEvent(new CustomEvent('open-settings', { detail: { tab: 'general' } }))
          successMessage = 'Opened settings'
          break

        default:
          throw new Error(`Unknown destination: ${destination}`)
      }

      // Navigate if URL was set
      if (navigationUrl) {
        window.location.href = navigationUrl
      }

      this.setState(ClientToolCallState.success)
      await this.markToolComplete(200, successMessage, {
        destination,
        workflowName,
        navigated: true,
      })
    } catch (e: any) {
      logger.error('Navigation failed', { message: e?.message })
      this.setState(ClientToolCallState.error)

      // Get destination info for better error message
      const toolCallsById = useCopilotStore.getState().toolCallsById
      const toolCall = toolCallsById[this.toolCallId]
      const params = toolCall?.params as NavigateUIArgs | undefined
      const dest = params?.destination
      const wfName = params?.workflowName

      let errorMessage = e?.message || 'Failed to navigate'
      if (dest === 'workflow' && wfName) {
        errorMessage = `Failed to navigate to workflow "${wfName}": ${e?.message || 'Unknown error'}`
      } else if (dest) {
        errorMessage = `Failed to navigate to ${dest}: ${e?.message || 'Unknown error'}`
      }

      await this.markToolComplete(500, errorMessage)
    }
  }

  async execute(args?: NavigateUIArgs): Promise<void> {
    await this.handleAccept(args)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: checkoff-todo.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/other/checkoff-todo.ts

```typescript
import { Check, Loader2, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'

interface CheckoffTodoArgs {
  id?: string
  todoId?: string
}

export class CheckoffTodoClientTool extends BaseClientTool {
  static readonly id = 'checkoff_todo'

  constructor(toolCallId: string) {
    super(toolCallId, CheckoffTodoClientTool.id, CheckoffTodoClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Marking todo', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Marking todo', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Todo marked complete', icon: Check },
      [ClientToolCallState.error]: { text: 'Failed to mark todo', icon: XCircle },
    },
  }

  async execute(args?: CheckoffTodoArgs): Promise<void> {
    const logger = createLogger('CheckoffTodoClientTool')
    try {
      this.setState(ClientToolCallState.executing)

      const todoId = args?.id || args?.todoId
      if (!todoId) {
        this.setState(ClientToolCallState.error)
        await this.markToolComplete(400, 'Missing todo id')
        return
      }

      try {
        const { useCopilotStore } = await import('@/stores/panel/copilot/store')
        const store = useCopilotStore.getState()
        if (store.updatePlanTodoStatus) {
          store.updatePlanTodoStatus(todoId, 'completed')
        }
      } catch (e) {
        logger.warn('Failed to update todo status in store', { message: (e as any)?.message })
      }

      this.setState(ClientToolCallState.success)
      await this.markToolComplete(200, 'Todo checked off', { todoId })
      this.setState(ClientToolCallState.success)
    } catch (e: any) {
      logger.error('execute failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'Failed to check off todo')
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: make-api-request.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/other/make-api-request.ts

```typescript
import { Globe2, Loader2, MinusCircle, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { ExecuteResponseSuccessSchema } from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'

interface MakeApiRequestArgs {
  url: string
  method: 'GET' | 'POST' | 'PUT'
  queryParams?: Record<string, string | number | boolean>
  headers?: Record<string, string>
  body?: any
}

export class MakeApiRequestClientTool extends BaseClientTool {
  static readonly id = 'make_api_request'

  constructor(toolCallId: string) {
    super(toolCallId, MakeApiRequestClientTool.id, MakeApiRequestClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Preparing API request', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Review API request', icon: Globe2 },
      [ClientToolCallState.executing]: { text: 'Executing API request', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'API request complete', icon: Globe2 },
      [ClientToolCallState.error]: { text: 'Failed to execute API request', icon: XCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped API request', icon: MinusCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted API request', icon: XCircle },
    },
    interrupt: {
      accept: { text: 'Execute', icon: Globe2 },
      reject: { text: 'Skip', icon: MinusCircle },
    },
    getDynamicText: (params, state) => {
      if (params?.url && typeof params.url === 'string') {
        const method = params.method || 'GET'
        let url = params.url

        // Extract domain from URL for cleaner display
        try {
          const urlObj = new URL(url)
          url = urlObj.hostname + urlObj.pathname
          if (url.length > 40) {
            url = `${url.slice(0, 40)}...`
          }
        } catch {
          // If URL parsing fails, just truncate
          if (url.length > 40) {
            url = `${url.slice(0, 40)}...`
          }
        }

        switch (state) {
          case ClientToolCallState.success:
            return `${method} ${url} complete`
          case ClientToolCallState.executing:
            return `${method} ${url}`
          case ClientToolCallState.generating:
            return `Preparing ${method} ${url}`
          case ClientToolCallState.pending:
            return `Review ${method} ${url}`
          case ClientToolCallState.error:
            return `Failed ${method} ${url}`
          case ClientToolCallState.rejected:
            return `Skipped ${method} ${url}`
          case ClientToolCallState.aborted:
            return `Aborted ${method} ${url}`
        }
      }
      return undefined
    },
  }

  async handleReject(): Promise<void> {
    await super.handleReject()
    this.setState(ClientToolCallState.rejected)
  }

  async handleAccept(args?: MakeApiRequestArgs): Promise<void> {
    const logger = createLogger('MakeApiRequestClientTool')
    try {
      this.setState(ClientToolCallState.executing)
      const res = await fetch('/api/copilot/execute-copilot-server-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName: 'make_api_request', payload: args || {} }),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || `Server error (${res.status})`)
      }
      const json = await res.json()
      const parsed = ExecuteResponseSuccessSchema.parse(json)
      this.setState(ClientToolCallState.success)
      await this.markToolComplete(200, 'API request executed', parsed.result)
      this.setState(ClientToolCallState.success)
    } catch (e: any) {
      logger.error('execute failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'API request failed')
    }
  }

  async execute(args?: MakeApiRequestArgs): Promise<void> {
    await this.handleAccept(args)
  }
}
```

--------------------------------------------------------------------------------

````
