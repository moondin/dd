---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 549
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 549 of 933)

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

---[FILE: mark-todo-in-progress.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/other/mark-todo-in-progress.ts

```typescript
import { Loader2, MinusCircle, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'

interface MarkTodoInProgressArgs {
  id?: string
  todoId?: string
}

export class MarkTodoInProgressClientTool extends BaseClientTool {
  static readonly id = 'mark_todo_in_progress'

  constructor(toolCallId: string) {
    super(toolCallId, MarkTodoInProgressClientTool.id, MarkTodoInProgressClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Marking todo in progress', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Marking todo in progress', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Marking todo in progress', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Todo marked in progress', icon: Loader2 },
      [ClientToolCallState.error]: { text: 'Failed to mark in progress', icon: XCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted marking in progress', icon: MinusCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped marking in progress', icon: MinusCircle },
    },
  }

  async execute(args?: MarkTodoInProgressArgs): Promise<void> {
    const logger = createLogger('MarkTodoInProgressClientTool')
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
          store.updatePlanTodoStatus(todoId, 'executing')
        }
      } catch (e) {
        logger.warn('Failed to update todo status in store', { message: (e as any)?.message })
      }

      this.setState(ClientToolCallState.success)
      await this.markToolComplete(200, 'Todo marked in progress', { todoId })
      this.setState(ClientToolCallState.success)
    } catch (e: any) {
      logger.error('execute failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'Failed to mark todo in progress')
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: oauth-request-access.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/other/oauth-request-access.ts

```typescript
import { CheckCircle, Loader2, MinusCircle, PlugZap, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'
import { OAUTH_PROVIDERS, type OAuthServiceConfig } from '@/lib/oauth/oauth'

const logger = createLogger('OAuthRequestAccessClientTool')

interface OAuthRequestAccessArgs {
  providerName?: string
}

interface ResolvedServiceInfo {
  serviceId: string
  providerId: string
  service: OAuthServiceConfig
}

/**
 * Finds the service configuration from a provider name.
 * The providerName should match the exact `name` field returned by get_credentials tool's notConnected services.
 */
function findServiceByName(providerName: string): ResolvedServiceInfo | null {
  const normalizedName = providerName.toLowerCase().trim()

  // First pass: exact match (case-insensitive)
  for (const [, providerConfig] of Object.entries(OAUTH_PROVIDERS)) {
    for (const [serviceId, service] of Object.entries(providerConfig.services)) {
      if (service.name.toLowerCase() === normalizedName) {
        return { serviceId, providerId: service.providerId, service }
      }
    }
  }

  // Second pass: partial match as fallback for flexibility
  for (const [, providerConfig] of Object.entries(OAUTH_PROVIDERS)) {
    for (const [serviceId, service] of Object.entries(providerConfig.services)) {
      if (
        service.name.toLowerCase().includes(normalizedName) ||
        normalizedName.includes(service.name.toLowerCase())
      ) {
        return { serviceId, providerId: service.providerId, service }
      }
    }
  }

  return null
}

export interface OAuthConnectEventDetail {
  providerName: string
  serviceId: string
  providerId: string
  requiredScopes: string[]
  newScopes?: string[]
}

export class OAuthRequestAccessClientTool extends BaseClientTool {
  static readonly id = 'oauth_request_access'

  private providerName?: string

  constructor(toolCallId: string) {
    super(toolCallId, OAuthRequestAccessClientTool.id, OAuthRequestAccessClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Requesting integration access', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Requesting integration access', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Connecting integration', icon: Loader2 },
      [ClientToolCallState.rejected]: { text: 'Skipped integration access', icon: MinusCircle },
      [ClientToolCallState.success]: { text: 'Integration connected', icon: CheckCircle },
      [ClientToolCallState.error]: { text: 'Failed to request integration access', icon: X },
      [ClientToolCallState.aborted]: { text: 'Aborted integration access request', icon: XCircle },
    },
    interrupt: {
      accept: { text: 'Connect', icon: PlugZap },
      reject: { text: 'Skip', icon: MinusCircle },
    },
    getDynamicText: (params, state) => {
      if (params.providerName) {
        const name = params.providerName
        switch (state) {
          case ClientToolCallState.generating:
          case ClientToolCallState.pending:
            return `Requesting ${name} access`
          case ClientToolCallState.executing:
            return `Connecting to ${name}`
          case ClientToolCallState.rejected:
            return `Skipped ${name} access`
          case ClientToolCallState.success:
            return `${name} connected`
          case ClientToolCallState.error:
            return `Failed to connect ${name}`
          case ClientToolCallState.aborted:
            return `Aborted ${name} connection`
        }
      }
      return undefined
    },
  }

  async handleAccept(args?: OAuthRequestAccessArgs): Promise<void> {
    try {
      if (args?.providerName) {
        this.providerName = args.providerName
      }

      if (!this.providerName) {
        logger.error('No provider name provided')
        this.setState(ClientToolCallState.error)
        await this.markToolComplete(400, 'No provider name specified')
        return
      }

      // Find the service by name
      const serviceInfo = findServiceByName(this.providerName)
      if (!serviceInfo) {
        logger.error('Could not find OAuth service for provider', {
          providerName: this.providerName,
        })
        this.setState(ClientToolCallState.error)
        await this.markToolComplete(400, `Unknown provider: ${this.providerName}`)
        return
      }

      const { serviceId, providerId, service } = serviceInfo

      logger.info('Opening OAuth connect modal', {
        providerName: this.providerName,
        serviceId,
        providerId,
      })

      // Move to executing state
      this.setState(ClientToolCallState.executing)

      // Dispatch event to open the OAuth modal (same pattern as open-settings)
      window.dispatchEvent(
        new CustomEvent<OAuthConnectEventDetail>('open-oauth-connect', {
          detail: {
            providerName: this.providerName,
            serviceId,
            providerId,
            requiredScopes: service.scopes || [],
          },
        })
      )

      // Mark as success - the modal will handle the actual OAuth flow
      this.setState(ClientToolCallState.success)
      await this.markToolComplete(200, `Opened ${this.providerName} connection dialog`)
    } catch (e) {
      logger.error('Failed to open OAuth connect modal', { error: e })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, 'Failed to open OAuth connection dialog')
    }
  }

  async handleReject(): Promise<void> {
    await super.handleReject()
    this.setState(ClientToolCallState.rejected)
  }

  async execute(args?: OAuthRequestAccessArgs): Promise<void> {
    await this.handleAccept(args)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: plan.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/other/plan.ts

```typescript
import { ListTodo, Loader2, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'

interface PlanArgs {
  objective?: string
  todoList?: Array<{ id?: string; content: string } | string>
}

export class PlanClientTool extends BaseClientTool {
  static readonly id = 'plan'

  constructor(toolCallId: string) {
    super(toolCallId, PlanClientTool.id, PlanClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Planning', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Planning', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Planning an approach', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Finished planning', icon: ListTodo },
      [ClientToolCallState.error]: { text: 'Failed to plan', icon: X },
      [ClientToolCallState.aborted]: { text: 'Aborted planning', icon: XCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped planning approach', icon: XCircle },
    },
  }

  async execute(args?: PlanArgs): Promise<void> {
    const logger = createLogger('PlanClientTool')
    try {
      this.setState(ClientToolCallState.executing)

      // Update store todos from args if present (client-side only)
      try {
        const todoList = args?.todoList
        if (Array.isArray(todoList)) {
          const todos = todoList.map((item: any, index: number) => ({
            id: (item && (item.id || item.todoId)) || `todo-${index}`,
            content: typeof item === 'string' ? item : item.content,
            completed: false,
            executing: false,
          }))
          const { useCopilotStore } = await import('@/stores/panel/copilot/store')
          const store = useCopilotStore.getState()
          if (store.setPlanTodos) {
            store.setPlanTodos(todos)
            useCopilotStore.setState({ showPlanTodos: true })
          }
        }
      } catch (e) {
        logger.warn('Failed to update plan todos in store', { message: (e as any)?.message })
      }

      this.setState(ClientToolCallState.success)
      // Echo args back so store/tooling can parse todoList if needed
      await this.markToolComplete(200, 'Plan ready', args || {})
      this.setState(ClientToolCallState.success)
    } catch (e: any) {
      logger.error('execute failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'Failed to plan')
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: remember-debug.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/other/remember-debug.ts

```typescript
import { CheckCircle2, Loader2, MinusCircle, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'

export class RememberDebugClientTool extends BaseClientTool {
  static readonly id = 'remember_debug'

  constructor(toolCallId: string) {
    super(toolCallId, RememberDebugClientTool.id, RememberDebugClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Validating fix', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Validating fix', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Validating fix', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Validated fix', icon: CheckCircle2 },
      [ClientToolCallState.error]: { text: 'Failed to validate', icon: XCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted validation', icon: MinusCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped validation', icon: MinusCircle },
    },
    interrupt: undefined,
    getDynamicText: (params, state) => {
      const operation = params?.operation

      if (operation === 'add' || operation === 'edit') {
        // For add/edit, show from problem or solution
        const text = params?.problem || params?.solution
        if (text && typeof text === 'string') {
          const truncated = text.length > 40 ? `${text.slice(0, 40)}...` : text

          switch (state) {
            case ClientToolCallState.success:
              return `Validated fix ${truncated}`
            case ClientToolCallState.executing:
            case ClientToolCallState.generating:
            case ClientToolCallState.pending:
              return `Validating fix ${truncated}`
            case ClientToolCallState.error:
              return `Failed to validate fix ${truncated}`
            case ClientToolCallState.aborted:
              return `Aborted validating fix ${truncated}`
            case ClientToolCallState.rejected:
              return `Skipped validating fix ${truncated}`
          }
        }
      } else if (operation === 'delete') {
        // For delete, show from problem or solution (or id as fallback)
        const text = params?.problem || params?.solution || params?.id
        if (text && typeof text === 'string') {
          const truncated = text.length > 40 ? `${text.slice(0, 40)}...` : text

          switch (state) {
            case ClientToolCallState.success:
              return `Adjusted fix ${truncated}`
            case ClientToolCallState.executing:
            case ClientToolCallState.generating:
            case ClientToolCallState.pending:
              return `Adjusting fix ${truncated}`
            case ClientToolCallState.error:
              return `Failed to adjust fix ${truncated}`
            case ClientToolCallState.aborted:
              return `Aborted adjusting fix ${truncated}`
            case ClientToolCallState.rejected:
              return `Skipped adjusting fix ${truncated}`
          }
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

---[FILE: search-documentation.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/other/search-documentation.ts

```typescript
import { BookOpen, Loader2, MinusCircle, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { ExecuteResponseSuccessSchema } from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'

interface SearchDocumentationArgs {
  query: string
  topK?: number
  threshold?: number
}

export class SearchDocumentationClientTool extends BaseClientTool {
  static readonly id = 'search_documentation'

  constructor(toolCallId: string) {
    super(toolCallId, SearchDocumentationClientTool.id, SearchDocumentationClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Searching documentation', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Searching documentation', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Searching documentation', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Documentation search complete', icon: BookOpen },
      [ClientToolCallState.error]: { text: 'Failed to search docs', icon: XCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted documentation search', icon: XCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped documentation search', icon: MinusCircle },
    },
    getDynamicText: (params, state) => {
      if (params?.query && typeof params.query === 'string') {
        const query = params.query
        const truncated = query.length > 50 ? `${query.slice(0, 50)}...` : query

        switch (state) {
          case ClientToolCallState.success:
            return `Searched docs for ${truncated}`
          case ClientToolCallState.executing:
          case ClientToolCallState.generating:
          case ClientToolCallState.pending:
            return `Searching docs for ${truncated}`
          case ClientToolCallState.error:
            return `Failed to search docs for ${truncated}`
          case ClientToolCallState.aborted:
            return `Aborted searching docs for ${truncated}`
          case ClientToolCallState.rejected:
            return `Skipped searching docs for ${truncated}`
        }
      }
      return undefined
    },
  }

  async execute(args?: SearchDocumentationArgs): Promise<void> {
    const logger = createLogger('SearchDocumentationClientTool')
    try {
      this.setState(ClientToolCallState.executing)
      const res = await fetch('/api/copilot/execute-copilot-server-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName: 'search_documentation', payload: args || {} }),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || `Server error (${res.status})`)
      }
      const json = await res.json()
      const parsed = ExecuteResponseSuccessSchema.parse(json)
      this.setState(ClientToolCallState.success)
      await this.markToolComplete(200, 'Documentation search complete', parsed.result)
      this.setState(ClientToolCallState.success)
    } catch (e: any) {
      logger.error('execute failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'Documentation search failed')
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: search-errors.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/other/search-errors.ts

```typescript
import { Bug, Loader2, MinusCircle, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'

export class SearchErrorsClientTool extends BaseClientTool {
  static readonly id = 'search_errors'

  constructor(toolCallId: string) {
    super(toolCallId, SearchErrorsClientTool.id, SearchErrorsClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Debugging', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Debugging', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Debugging', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Debugged', icon: Bug },
      [ClientToolCallState.error]: { text: 'Failed to debug', icon: XCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted debugging', icon: MinusCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped debugging', icon: MinusCircle },
    },
    interrupt: undefined,
    getDynamicText: (params, state) => {
      if (params?.query && typeof params.query === 'string') {
        const query = params.query
        const truncated = query.length > 50 ? `${query.slice(0, 50)}...` : query

        switch (state) {
          case ClientToolCallState.success:
            return `Debugged ${truncated}`
          case ClientToolCallState.executing:
          case ClientToolCallState.generating:
          case ClientToolCallState.pending:
            return `Debugging ${truncated}`
          case ClientToolCallState.error:
            return `Failed to debug ${truncated}`
          case ClientToolCallState.aborted:
            return `Aborted debugging ${truncated}`
          case ClientToolCallState.rejected:
            return `Skipped debugging ${truncated}`
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

---[FILE: search-online.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/other/search-online.ts

```typescript
import { Globe, Loader2, MinusCircle, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { ExecuteResponseSuccessSchema } from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'

interface SearchOnlineArgs {
  query: string
  num?: number
  type?: string
  gl?: string
  hl?: string
}

export class SearchOnlineClientTool extends BaseClientTool {
  static readonly id = 'search_online'

  constructor(toolCallId: string) {
    super(toolCallId, SearchOnlineClientTool.id, SearchOnlineClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Searching online', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Searching online', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Searching online', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Online search complete', icon: Globe },
      [ClientToolCallState.error]: { text: 'Failed to search online', icon: XCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped online search', icon: MinusCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted online search', icon: XCircle },
    },
    getDynamicText: (params, state) => {
      if (params?.query && typeof params.query === 'string') {
        const query = params.query
        const truncated = query.length > 50 ? `${query.slice(0, 50)}...` : query

        switch (state) {
          case ClientToolCallState.success:
            return `Searched online for ${truncated}`
          case ClientToolCallState.executing:
          case ClientToolCallState.generating:
          case ClientToolCallState.pending:
            return `Searching online for ${truncated}`
          case ClientToolCallState.error:
            return `Failed to search online for ${truncated}`
          case ClientToolCallState.aborted:
            return `Aborted searching online for ${truncated}`
          case ClientToolCallState.rejected:
            return `Skipped searching online for ${truncated}`
        }
      }
      return undefined
    },
  }

  async execute(args?: SearchOnlineArgs): Promise<void> {
    const logger = createLogger('SearchOnlineClientTool')
    try {
      this.setState(ClientToolCallState.executing)
      const res = await fetch('/api/copilot/execute-copilot-server-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName: 'search_online', payload: args || {} }),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || `Server error (${res.status})`)
      }
      const json = await res.json()
      const parsed = ExecuteResponseSuccessSchema.parse(json)
      this.setState(ClientToolCallState.success)
      await this.markToolComplete(200, 'Online search complete', parsed.result)
      this.setState(ClientToolCallState.success)
    } catch (e: any) {
      logger.error('execute failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'Search failed')
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: search-patterns.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/other/search-patterns.ts

```typescript
import { Loader2, MinusCircle, Search, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'

export class SearchPatternsClientTool extends BaseClientTool {
  static readonly id = 'search_patterns'

  constructor(toolCallId: string) {
    super(toolCallId, SearchPatternsClientTool.id, SearchPatternsClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Searching workflow patterns', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Searching workflow patterns', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Searching workflow patterns', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Found workflow patterns', icon: Search },
      [ClientToolCallState.error]: { text: 'Failed to search patterns', icon: XCircle },
      [ClientToolCallState.aborted]: { text: 'Aborted pattern search', icon: MinusCircle },
      [ClientToolCallState.rejected]: { text: 'Skipped pattern search', icon: MinusCircle },
    },
    interrupt: undefined,
    getDynamicText: (params, state) => {
      if (params?.queries && Array.isArray(params.queries) && params.queries.length > 0) {
        const firstQuery = String(params.queries[0])
        const truncated = firstQuery.length > 50 ? `${firstQuery.slice(0, 50)}...` : firstQuery

        switch (state) {
          case ClientToolCallState.success:
            return `Searched ${truncated}`
          case ClientToolCallState.executing:
          case ClientToolCallState.generating:
          case ClientToolCallState.pending:
            return `Searching ${truncated}`
          case ClientToolCallState.error:
            return `Failed to search ${truncated}`
          case ClientToolCallState.aborted:
            return `Aborted searching ${truncated}`
          case ClientToolCallState.rejected:
            return `Skipped searching ${truncated}`
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

---[FILE: get-credentials.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/user/get-credentials.ts

```typescript
import { Key, Loader2, MinusCircle, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { ExecuteResponseSuccessSchema } from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

interface GetCredentialsArgs {
  userId?: string
  workflowId?: string
}

export class GetCredentialsClientTool extends BaseClientTool {
  static readonly id = 'get_credentials'

  constructor(toolCallId: string) {
    super(toolCallId, GetCredentialsClientTool.id, GetCredentialsClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Fetching connected integrations', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Fetching connected integrations', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Fetching connected integrations', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Fetched connected integrations', icon: Key },
      [ClientToolCallState.error]: {
        text: 'Failed to fetch connected integrations',
        icon: XCircle,
      },
      [ClientToolCallState.aborted]: {
        text: 'Aborted fetching connected integrations',
        icon: MinusCircle,
      },
      [ClientToolCallState.rejected]: {
        text: 'Skipped fetching connected integrations',
        icon: MinusCircle,
      },
    },
  }

  async execute(args?: GetCredentialsArgs): Promise<void> {
    const logger = createLogger('GetCredentialsClientTool')
    try {
      this.setState(ClientToolCallState.executing)
      const payload: GetCredentialsArgs = { ...(args || {}) }
      if (!payload.workflowId && !payload.userId) {
        const { activeWorkflowId } = useWorkflowRegistry.getState()
        if (activeWorkflowId) payload.workflowId = activeWorkflowId
      }
      const res = await fetch('/api/copilot/execute-copilot-server-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName: 'get_credentials', payload }),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || `Server error (${res.status})`)
      }
      const json = await res.json()
      const parsed = ExecuteResponseSuccessSchema.parse(json)
      this.setState(ClientToolCallState.success)
      await this.markToolComplete(200, 'Connected integrations fetched', parsed.result)
      this.setState(ClientToolCallState.success)
    } catch (e: any) {
      logger.error('execute failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'Failed to fetch connected integrations')
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: set-environment-variables.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/user/set-environment-variables.ts

```typescript
import { Loader2, Settings2, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { ExecuteResponseSuccessSchema } from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'
import { useEnvironmentStore } from '@/stores/settings/environment/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

interface SetEnvArgs {
  variables: Record<string, string>
  workflowId?: string
}

export class SetEnvironmentVariablesClientTool extends BaseClientTool {
  static readonly id = 'set_environment_variables'

  constructor(toolCallId: string) {
    super(
      toolCallId,
      SetEnvironmentVariablesClientTool.id,
      SetEnvironmentVariablesClientTool.metadata
    )
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: {
        text: 'Preparing to set environment variables',
        icon: Loader2,
      },
      [ClientToolCallState.pending]: { text: 'Set environment variables?', icon: Settings2 },
      [ClientToolCallState.executing]: { text: 'Setting environment variables', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Set environment variables', icon: Settings2 },
      [ClientToolCallState.error]: { text: 'Failed to set environment variables', icon: X },
      [ClientToolCallState.aborted]: {
        text: 'Aborted setting environment variables',
        icon: XCircle,
      },
      [ClientToolCallState.rejected]: {
        text: 'Skipped setting environment variables',
        icon: XCircle,
      },
    },
    interrupt: {
      accept: { text: 'Apply', icon: Settings2 },
      reject: { text: 'Skip', icon: XCircle },
    },
    getDynamicText: (params, state) => {
      if (params?.variables && typeof params.variables === 'object') {
        const count = Object.keys(params.variables).length
        const varText = count === 1 ? 'variable' : 'variables'

        switch (state) {
          case ClientToolCallState.success:
            return `Set ${count} ${varText}`
          case ClientToolCallState.executing:
            return `Setting ${count} ${varText}`
          case ClientToolCallState.generating:
            return `Preparing to set ${count} ${varText}`
          case ClientToolCallState.pending:
            return `Set ${count} ${varText}?`
          case ClientToolCallState.error:
            return `Failed to set ${count} ${varText}`
          case ClientToolCallState.aborted:
            return `Aborted setting ${count} ${varText}`
          case ClientToolCallState.rejected:
            return `Skipped setting ${count} ${varText}`
        }
      }
      return undefined
    },
  }

  async handleReject(): Promise<void> {
    await super.handleReject()
    this.setState(ClientToolCallState.rejected)
  }

  async handleAccept(args?: SetEnvArgs): Promise<void> {
    const logger = createLogger('SetEnvironmentVariablesClientTool')
    try {
      this.setState(ClientToolCallState.executing)
      const payload: SetEnvArgs = { ...(args || { variables: {} }) }
      if (!payload.workflowId) {
        const { activeWorkflowId } = useWorkflowRegistry.getState()
        if (activeWorkflowId) payload.workflowId = activeWorkflowId
      }
      const res = await fetch('/api/copilot/execute-copilot-server-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName: 'set_environment_variables', payload }),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || `Server error (${res.status})`)
      }
      const json = await res.json()
      const parsed = ExecuteResponseSuccessSchema.parse(json)
      this.setState(ClientToolCallState.success)
      await this.markToolComplete(200, 'Environment variables updated', parsed.result)
      this.setState(ClientToolCallState.success)

      // Refresh the environment store so the UI reflects the new variables
      try {
        await useEnvironmentStore.getState().loadEnvironmentVariables()
        logger.info('Environment store refreshed after setting variables')
      } catch (error) {
        logger.warn('Failed to refresh environment store:', error)
      }
    } catch (e: any) {
      logger.error('execute failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'Failed to set environment variables')
    }
  }

  async execute(args?: SetEnvArgs): Promise<void> {
    await this.handleAccept(args)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: check-deployment-status.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/workflow/check-deployment-status.ts

```typescript
import { Loader2, Rocket, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

interface CheckDeploymentStatusArgs {
  workflowId?: string
}

export class CheckDeploymentStatusClientTool extends BaseClientTool {
  static readonly id = 'check_deployment_status'

  constructor(toolCallId: string) {
    super(toolCallId, CheckDeploymentStatusClientTool.id, CheckDeploymentStatusClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: {
        text: 'Checking deployment status',
        icon: Loader2,
      },
      [ClientToolCallState.pending]: { text: 'Checking deployment status', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Checking deployment status', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Checked deployment status', icon: Rocket },
      [ClientToolCallState.error]: { text: 'Failed to check deployment status', icon: X },
      [ClientToolCallState.aborted]: {
        text: 'Aborted checking deployment status',
        icon: XCircle,
      },
      [ClientToolCallState.rejected]: {
        text: 'Skipped checking deployment status',
        icon: XCircle,
      },
    },
    interrupt: undefined,
  }

  async execute(args?: CheckDeploymentStatusArgs): Promise<void> {
    const logger = createLogger('CheckDeploymentStatusClientTool')
    try {
      this.setState(ClientToolCallState.executing)

      const { activeWorkflowId } = useWorkflowRegistry.getState()
      const workflowId = args?.workflowId || activeWorkflowId

      if (!workflowId) {
        throw new Error('No workflow ID provided')
      }

      // Fetch deployment status from API
      const [apiDeployRes, chatDeployRes] = await Promise.all([
        fetch(`/api/workflows/${workflowId}/deploy`),
        fetch(`/api/workflows/${workflowId}/chat/status`),
      ])

      const apiDeploy = apiDeployRes.ok ? await apiDeployRes.json() : null
      const chatDeploy = chatDeployRes.ok ? await chatDeployRes.json() : null

      const isApiDeployed = apiDeploy?.isDeployed || false
      const isChatDeployed = !!(chatDeploy?.isDeployed && chatDeploy?.deployment)

      const deploymentTypes: string[] = []

      if (isApiDeployed) {
        // Default to sync API, could be extended to detect streaming/async
        deploymentTypes.push('api')
      }

      if (isChatDeployed) {
        deploymentTypes.push('chat')
      }

      const isDeployed = isApiDeployed || isChatDeployed

      this.setState(ClientToolCallState.success)
      await this.markToolComplete(
        200,
        isDeployed
          ? `Workflow is deployed as: ${deploymentTypes.join(', ')}`
          : 'Workflow is not deployed',
        {
          isDeployed,
          deploymentTypes,
          apiDeployed: isApiDeployed,
          chatDeployed: isChatDeployed,
          deployedAt: apiDeploy?.deployedAt || null,
        }
      )
    } catch (e: any) {
      logger.error('Check deployment status failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'Failed to check deployment status')
    }
  }
}
```

--------------------------------------------------------------------------------

````
