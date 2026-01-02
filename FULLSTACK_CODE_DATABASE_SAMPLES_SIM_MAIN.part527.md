---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 527
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 527 of 933)

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

---[FILE: use-mcp-tools.ts]---
Location: sim-main/apps/sim/hooks/use-mcp-tools.ts
Signals: React

```typescript
/**
 * Hook for discovering and managing MCP tools
 *
 * This hook provides a unified interface for accessing MCP tools
 * using TanStack Query for optimal caching and performance
 */

import type React from 'react'
import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { McpIcon } from '@/components/icons'
import { createLogger } from '@/lib/logs/console/logger'
import { createMcpToolId } from '@/lib/mcp/utils'
import { mcpKeys, useMcpToolsQuery } from '@/hooks/queries/mcp'

const logger = createLogger('useMcpTools')

export interface McpToolForUI {
  id: string
  name: string
  description?: string
  serverId: string
  serverName: string
  type: 'mcp'
  inputSchema: any
  bgColor: string
  icon: React.ComponentType<any>
}

export interface UseMcpToolsResult {
  mcpTools: McpToolForUI[]
  isLoading: boolean
  error: string | null
  refreshTools: (forceRefresh?: boolean) => Promise<void>
  getToolById: (toolId: string) => McpToolForUI | undefined
  getToolsByServer: (serverId: string) => McpToolForUI[]
}

export function useMcpTools(workspaceId: string): UseMcpToolsResult {
  const queryClient = useQueryClient()

  const { data: mcpToolsData = [], isLoading, error: queryError } = useMcpToolsQuery(workspaceId)

  const mcpTools = useMemo<McpToolForUI[]>(() => {
    return mcpToolsData.map((tool) => ({
      id: createMcpToolId(tool.serverId, tool.name),
      name: tool.name,
      description: tool.description,
      serverId: tool.serverId,
      serverName: tool.serverName,
      type: 'mcp' as const,
      inputSchema: tool.inputSchema,
      bgColor: '#6366F1',
      icon: McpIcon,
    }))
  }, [mcpToolsData])

  const refreshTools = useCallback(
    async (forceRefresh = false) => {
      if (!workspaceId) {
        logger.warn('Cannot refresh tools: no workspaceId provided')
        return
      }

      logger.info('Refreshing MCP tools', { forceRefresh, workspaceId })

      await queryClient.invalidateQueries({
        queryKey: mcpKeys.tools(workspaceId),
        refetchType: forceRefresh ? 'active' : 'all',
      })
    },
    [workspaceId, queryClient]
  )

  const getToolById = useCallback(
    (toolId: string): McpToolForUI | undefined => {
      return mcpTools.find((tool) => tool.id === toolId)
    },
    [mcpTools]
  )

  const getToolsByServer = useCallback(
    (serverId: string): McpToolForUI[] => {
      return mcpTools.filter((tool) => tool.serverId === serverId)
    },
    [mcpTools]
  )

  return {
    mcpTools,
    isLoading,
    error: queryError instanceof Error ? queryError.message : null,
    refreshTools,
    getToolById,
    getToolsByServer,
  }
}

export function useMcpToolExecution(workspaceId: string) {
  const executeTool = useCallback(
    async (serverId: string, toolName: string, args: Record<string, any>) => {
      if (!workspaceId) {
        throw new Error('workspaceId is required for MCP tool execution')
      }

      logger.info(
        `Executing MCP tool ${toolName} on server ${serverId} in workspace ${workspaceId}`
      )

      const response = await fetch('/api/mcp/tools/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverId,
          toolName,
          arguments: args,
          workspaceId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Tool execution failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Tool execution failed')
      }

      return result.data
    },
    [workspaceId]
  )

  return { executeTool }
}
```

--------------------------------------------------------------------------------

---[FILE: use-next-available-slot.ts]---
Location: sim-main/apps/sim/hooks/use-next-available-slot.ts
Signals: React

```typescript
import { useCallback, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useNextAvailableSlot')

interface NextAvailableSlotResponse {
  success: boolean
  data?: {
    nextAvailableSlot: string | null
    fieldType: string
    usedSlots: string[]
    totalSlots: number
    availableSlots: number
  }
  error?: string
}

export function useNextAvailableSlot(knowledgeBaseId: string | null) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getNextAvailableSlot = useCallback(
    async (fieldType: string): Promise<string | null> => {
      if (!knowledgeBaseId) {
        setError('Knowledge base ID is required')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const url = new URL(
          `/api/knowledge/${knowledgeBaseId}/next-available-slot`,
          window.location.origin
        )
        url.searchParams.set('fieldType', fieldType)

        const response = await fetch(url.toString())

        if (!response.ok) {
          throw new Error(`Failed to get next available slot: ${response.statusText}`)
        }

        const data: NextAvailableSlotResponse = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to get next available slot')
        }

        return data.data?.nextAvailableSlot || null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        logger.error('Error getting next available slot:', err)
        setError(errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [knowledgeBaseId]
  )

  const getSlotInfo = useCallback(
    async (fieldType: string) => {
      if (!knowledgeBaseId) {
        setError('Knowledge base ID is required')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const url = new URL(
          `/api/knowledge/${knowledgeBaseId}/next-available-slot`,
          window.location.origin
        )
        url.searchParams.set('fieldType', fieldType)

        const response = await fetch(url.toString())

        if (!response.ok) {
          throw new Error(`Failed to get slot info: ${response.statusText}`)
        }

        const data: NextAvailableSlotResponse = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to get slot info')
        }

        return data.data || null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        logger.error('Error getting slot info:', err)
        setError(errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [knowledgeBaseId]
  )

  return {
    getNextAvailableSlot,
    getSlotInfo,
    isLoading,
    error,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-oauth-scope-status.ts]---
Location: sim-main/apps/sim/hooks/use-oauth-scope-status.ts

```typescript
'use client'

import type { Credential } from '@/lib/oauth/oauth'

export interface OAuthScopeStatus {
  requiresReauthorization: boolean
  missingScopes: string[]
  extraScopes: string[]
  canonicalScopes: string[]
  grantedScopes: string[]
}

/**
 * Extract scope status from a credential
 */
export function getCredentialScopeStatus(credential: Credential): OAuthScopeStatus {
  return {
    requiresReauthorization: credential.requiresReauthorization || false,
    missingScopes: credential.missingScopes || [],
    extraScopes: credential.extraScopes || [],
    canonicalScopes: credential.canonicalScopes || [],
    grantedScopes: credential.scopes || [],
  }
}

/**
 * Check if a credential needs reauthorization
 */
export function credentialNeedsReauth(credential: Credential): boolean {
  return credential.requiresReauthorization || false
}

/**
 * Check if any credentials in a list need reauthorization
 */
export function anyCredentialNeedsReauth(credentials: Credential[]): boolean {
  return credentials.some(credentialNeedsReauth)
}

/**
 * Get all credentials that need reauthorization
 */
export function getCredentialsNeedingReauth(credentials: Credential[]): Credential[] {
  return credentials.filter(credentialNeedsReauth)
}

/**
 * Scopes that control token behavior but are not returned in OAuth token responses.
 * These should be ignored when validating credential scopes.
 */
const IGNORED_SCOPES = new Set([
  'offline_access', // Microsoft - requests refresh token
  'refresh_token', // Salesforce - requests refresh token
  'offline.access', // Airtable - requests refresh token (note: dot not underscore)
])

/**
 * Compute which of the provided requiredScopes are NOT granted by the credential.
 * Note: Ignores special OAuth scopes that control token behavior (like offline_access)
 * as they are not returned in the token response's scope list even when granted.
 */
export function getMissingRequiredScopes(
  credential: Credential | undefined,
  requiredScopes: string[] = []
): string[] {
  if (!credential) {
    // Filter out ignored scopes from required scopes as they're not returned by OAuth providers
    return requiredScopes.filter((s) => !IGNORED_SCOPES.has(s))
  }

  const granted = new Set((credential.scopes || []).map((s) => s))
  const missing: string[] = []

  for (const s of requiredScopes) {
    // Skip ignored scopes as providers don't return them in the scope list even when granted
    if (IGNORED_SCOPES.has(s)) continue

    if (!granted.has(s)) missing.push(s)
  }

  return missing
}

/**
 * Whether a credential needs an upgrade specifically for the provided required scopes.
 */
export function needsUpgradeForRequiredScopes(
  credential: Credential | undefined,
  requiredScopes: string[] = []
): boolean {
  return getMissingRequiredScopes(credential, requiredScopes).length > 0
}
```

--------------------------------------------------------------------------------

---[FILE: use-schedule-management.ts]---
Location: sim-main/apps/sim/hooks/use-schedule-management.ts
Signals: React, Next.js

```typescript
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

const logger = createLogger('useScheduleManagement')

interface UseScheduleManagementProps {
  blockId: string
  isPreview?: boolean
}

interface SaveConfigResult {
  success: boolean
  nextRunAt?: string
  cronExpression?: string
}

interface ScheduleManagementState {
  scheduleId: string | null
  isLoading: boolean
  isSaving: boolean
  saveConfig: () => Promise<SaveConfigResult>
  deleteConfig: () => Promise<boolean>
}

/**
 * Hook to manage schedule lifecycle for schedule blocks
 * Handles:
 * - Loading existing schedules from the API
 * - Saving schedule configurations
 * - Deleting schedule configurations
 */
export function useScheduleManagement({
  blockId,
  isPreview = false,
}: UseScheduleManagementProps): ScheduleManagementState {
  const params = useParams()
  const workflowId = params.workflowId as string

  const scheduleId = useSubBlockStore(
    useCallback((state) => state.getValue(blockId, 'scheduleId') as string | null, [blockId])
  )

  const isLoading = useSubBlockStore((state) => state.loadingSchedules.has(blockId))
  const isChecked = useSubBlockStore((state) => state.checkedSchedules.has(blockId))

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isPreview) {
      return
    }

    const store = useSubBlockStore.getState()
    const currentlyLoading = store.loadingSchedules.has(blockId)
    const alreadyChecked = store.checkedSchedules.has(blockId)
    const currentScheduleId = store.getValue(blockId, 'scheduleId')

    if (currentlyLoading || (alreadyChecked && currentScheduleId)) {
      return
    }

    const loadSchedule = async () => {
      useSubBlockStore.setState((state) => ({
        loadingSchedules: new Set([...state.loadingSchedules, blockId]),
      }))

      try {
        const response = await fetch(
          `/api/schedules?workflowId=${workflowId}&blockId=${blockId}&mode=schedule`
        )

        if (response.ok) {
          const data = await response.json()

          if (data.schedule?.id) {
            useSubBlockStore.getState().setValue(blockId, 'scheduleId', data.schedule.id)
            logger.info('Schedule loaded from API', {
              blockId,
              scheduleId: data.schedule.id,
            })
          } else {
            useSubBlockStore.getState().setValue(blockId, 'scheduleId', null)
          }

          useSubBlockStore.setState((state) => ({
            checkedSchedules: new Set([...state.checkedSchedules, blockId]),
          }))
        } else {
          logger.warn('API response not OK', {
            blockId,
            workflowId,
            status: response.status,
            statusText: response.statusText,
          })
        }
      } catch (error) {
        logger.error('Error loading schedule:', { error, blockId, workflowId })
      } finally {
        useSubBlockStore.setState((state) => {
          const newSet = new Set(state.loadingSchedules)
          newSet.delete(blockId)
          return { loadingSchedules: newSet }
        })
      }
    }

    loadSchedule()
  }, [isPreview, workflowId, blockId])

  const saveConfig = async (): Promise<SaveConfigResult> => {
    if (isPreview || isSaving) {
      return { success: false }
    }

    try {
      setIsSaving(true)

      const workflowStore = useWorkflowStore.getState()
      const subBlockStore = useSubBlockStore.getState()

      const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
      const subBlockValues = activeWorkflowId
        ? subBlockStore.workflowValues[activeWorkflowId] || {}
        : {}

      const { mergeSubblockStateAsync } = await import('@/stores/workflows/server-utils')
      const mergedBlocks = await mergeSubblockStateAsync(workflowStore.blocks, subBlockValues)

      const workflowState = {
        blocks: mergedBlocks,
        edges: workflowStore.edges,
        loops: workflowStore.loops,
      }

      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          blockId,
          state: workflowState,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to save schedule'
        try {
          const errorData = await response.json()
          errorMessage = errorData.details || errorData.error || errorMessage
        } catch {
          // If response is not JSON, use default message
        }
        logger.error('Failed to save schedule', { errorMessage })
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.schedule?.id) {
        useSubBlockStore.getState().setValue(blockId, 'scheduleId', data.schedule.id)
        useSubBlockStore.setState((state) => ({
          checkedSchedules: new Set([...state.checkedSchedules, blockId]),
        }))
      }

      logger.info('Schedule saved successfully', {
        scheduleId: data.schedule?.id,
        blockId,
        nextRunAt: data.nextRunAt,
        cronExpression: data.cronExpression,
      })

      return { success: true, nextRunAt: data.nextRunAt, cronExpression: data.cronExpression }
    } catch (error) {
      logger.error('Error saving schedule:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const deleteConfig = async (): Promise<boolean> => {
    if (isPreview || !scheduleId) {
      return false
    }

    try {
      setIsSaving(true)

      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: params.workspaceId as string,
        }),
      })

      if (!response.ok) {
        logger.error('Failed to delete schedule')
        return false
      }

      useSubBlockStore.getState().setValue(blockId, 'scheduleId', null)
      useSubBlockStore.setState((state) => {
        const newSet = new Set(state.checkedSchedules)
        newSet.delete(blockId)
        return { checkedSchedules: newSet }
      })

      logger.info('Schedule deleted successfully')
      return true
    } catch (error) {
      logger.error('Error deleting schedule:', error)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return {
    scheduleId,
    isLoading,
    isSaving,
    saveConfig,
    deleteConfig,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-selector-display-name.ts]---
Location: sim-main/apps/sim/hooks/use-selector-display-name.ts
Signals: React

```typescript
import { useMemo } from 'react'
import type { SubBlockConfig } from '@/blocks/types'
import { resolveSelectorForSubBlock } from '@/hooks/selectors/resolution'
import type { SelectorKey } from '@/hooks/selectors/types'
import {
  useSelectorOptionDetail,
  useSelectorOptionMap,
  useSelectorOptions,
} from '@/hooks/selectors/use-selector-query'

interface SelectorDisplayNameArgs {
  subBlock?: SubBlockConfig
  value: unknown
  workflowId?: string
  credentialId?: string
  domain?: string
  projectId?: string
  planId?: string
  teamId?: string
  knowledgeBaseId?: string
}

export function useSelectorDisplayName({
  subBlock,
  value,
  workflowId,
  credentialId,
  domain,
  projectId,
  planId,
  teamId,
  knowledgeBaseId,
}: SelectorDisplayNameArgs) {
  const detailId = typeof value === 'string' && value.length > 0 ? value : undefined

  const resolution = useMemo(() => {
    if (!subBlock || !detailId) return null
    return resolveSelectorForSubBlock(subBlock, {
      workflowId,
      credentialId,
      domain,
      projectId,
      planId,
      teamId,
      knowledgeBaseId,
    })
  }, [
    subBlock,
    detailId,
    workflowId,
    credentialId,
    domain,
    projectId,
    planId,
    teamId,
    knowledgeBaseId,
  ])

  const key = resolution?.key
  const context = resolution?.context ?? {}
  const enabled = Boolean(key && detailId)
  const resolvedKey: SelectorKey = (key ?? 'slack.channels') as SelectorKey
  const resolvedContext = enabled ? context : {}

  const { data: options = [], isFetching: listLoading } = useSelectorOptions(resolvedKey, {
    context: resolvedContext,
    enabled,
  })

  const { data: detailOption, isLoading: detailLoading } = useSelectorOptionDetail(resolvedKey, {
    context: resolvedContext,
    detailId: enabled ? detailId : undefined,
    enabled,
  })

  const optionMap = useSelectorOptionMap(options, detailOption ?? undefined)
  const displayName = detailId ? (optionMap.get(detailId)?.label ?? null) : null

  return {
    displayName: enabled ? displayName : null,
    isLoading: enabled ? listLoading || detailLoading : false,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-slack-accounts.ts]---
Location: sim-main/apps/sim/hooks/use-slack-accounts.ts
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react'

interface SlackAccount {
  id: string
  accountId: string
  providerId: string
}

interface UseSlackAccountsResult {
  accounts: SlackAccount[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Fetches and manages connected Slack accounts for the current user.
 * @returns Object containing accounts array, loading state, error state, and refetch function
 */
export function useSlackAccounts(): UseSlackAccountsResult {
  const [accounts, setAccounts] = useState<SlackAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/auth/accounts?provider=slack')
      if (response.ok) {
        const data = await response.json()
        setAccounts(data.accounts || [])
      } else {
        const data = await response.json().catch(() => ({}))
        setError(data.error || 'Failed to load Slack accounts')
        setAccounts([])
      }
    } catch {
      setError('Failed to load Slack accounts')
      setAccounts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [])

  return { accounts, isLoading, error, refetch: fetchAccounts }
}
```

--------------------------------------------------------------------------------

---[FILE: use-stream-cleanup.ts]---
Location: sim-main/apps/sim/hooks/use-stream-cleanup.ts
Signals: React

```typescript
'use client'

import { useCallback, useEffect } from 'react'

/**
 * Generic hook to handle stream cleanup on page unload and component unmount
 * This ensures that ongoing streams are properly terminated when:
 * - Page is refreshed
 * - User navigates away
 * - Component unmounts
 * - Tab is closed
 */
export function useStreamCleanup(cleanup: () => void) {
  // Wrap cleanup function to ensure it's stable
  const stableCleanup = useCallback(() => {
    try {
      cleanup()
    } catch (error) {
      // Ignore errors during cleanup to prevent issues during page unload
      console.warn('Error during stream cleanup:', error)
    }
  }, [cleanup])

  useEffect(() => {
    // Handle page unload/navigation/refresh
    const handleBeforeUnload = () => {
      stableCleanup()
    }

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      stableCleanup()
    }
  }, [stableCleanup])
}
```

--------------------------------------------------------------------------------

---[FILE: use-subscription-state.ts]---
Location: sim-main/apps/sim/hooks/use-subscription-state.ts
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_FREE_CREDITS } from '@/lib/billing/constants'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useSubscriptionState')

interface UsageData {
  current: number
  limit: number
  percentUsed: number
  isWarning: boolean
  isExceeded: boolean
  billingPeriodStart: Date | null
  billingPeriodEnd: Date | null
  lastPeriodCost: number
}

interface SubscriptionState {
  isPaid: boolean
  isPro: boolean
  isTeam: boolean
  isEnterprise: boolean
  plan: string
  status: string | null
  seats: number | null
  metadata: any | null
  usage: UsageData
}

/**
 * Consolidated hook for subscription state management
 * Combines subscription status, features, and usage data
 */
export function useSubscriptionState() {
  const [data, setData] = useState<SubscriptionState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSubscriptionState = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/billing?context=user')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const subscriptionData = result.data
      setData(subscriptionData)
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch subscription state')
      logger.error('Failed to fetch subscription state', { error })
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscriptionState()
  }, [fetchSubscriptionState])

  const refetch = useCallback(() => {
    return fetchSubscriptionState()
  }, [fetchSubscriptionState])

  return {
    subscription: {
      isPaid: data?.isPaid ?? false,
      isPro: data?.isPro ?? false,
      isTeam: data?.isTeam ?? false,
      isEnterprise: data?.isEnterprise ?? false,
      isFree: !(data?.isPaid ?? false),
      plan: data?.plan ?? 'free',
      status: data?.status,
      seats: data?.seats,
      metadata: data?.metadata,
    },

    usage: {
      current: data?.usage?.current ?? 0,
      limit: data?.usage?.limit ?? DEFAULT_FREE_CREDITS,
      percentUsed: data?.usage?.percentUsed ?? 0,
      isWarning: data?.usage?.isWarning ?? false,
      isExceeded: data?.usage?.isExceeded ?? false,
      billingPeriodStart: data?.usage?.billingPeriodStart
        ? new Date(data.usage.billingPeriodStart)
        : null,
      billingPeriodEnd: data?.usage?.billingPeriodEnd
        ? new Date(data.usage.billingPeriodEnd)
        : null,
      lastPeriodCost: data?.usage?.lastPeriodCost ?? 0,
    },

    isLoading,
    error,
    refetch,

    isAtLeastPro: () => {
      return data?.isPro || data?.isTeam || data?.isEnterprise || false
    },

    isAtLeastTeam: () => {
      return data?.isTeam || data?.isEnterprise || false
    },

    canUpgrade: () => {
      return data?.plan === 'free' || data?.plan === 'pro'
    },

    getBillingStatus: () => {
      const usage = data?.usage
      if (!usage) return 'unknown'

      if (usage.isExceeded) return 'exceeded'
      if (usage.isWarning) return 'warning'
      return 'ok'
    },

    getRemainingBudget: () => {
      const usage = data?.usage
      if (!usage) return 0
      return Math.max(0, usage.limit - usage.current)
    },

    getDaysRemainingInPeriod: () => {
      const usage = data?.usage
      if (!usage?.billingPeriodEnd) return null

      const now = new Date()
      const endDate = new Date(usage.billingPeriodEnd)
      const diffTime = endDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      return Math.max(0, diffDays)
    },
  }
}

/**
 * Hook for usage limit information with editing capabilities
 */
export function useUsageLimit() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUsageLimit = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/usage?context=user')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const limitData = await response.json()
      setData(limitData)
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch usage limit')
      logger.error('Failed to fetch usage limit', { error })
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsageLimit()
  }, [fetchUsageLimit])

  const refetch = useCallback(() => {
    return fetchUsageLimit()
  }, [fetchUsageLimit])

  const updateLimit = async (newLimit: number) => {
    try {
      const response = await fetch('/api/usage?context=user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limit: newLimit }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update usage limit')
      }

      await refetch()

      return { success: true }
    } catch (error) {
      logger.error('Failed to update usage limit', { error, newLimit })
      throw error
    }
  }

  return {
    currentLimit: data?.currentLimit ?? DEFAULT_FREE_CREDITS,
    canEdit: data?.canEdit ?? false,
    minimumLimit: data?.minimumLimit ?? DEFAULT_FREE_CREDITS,
    plan: data?.plan ?? 'free',
    setBy: data?.setBy,
    updatedAt: data?.updatedAt ? new Date(data.updatedAt) : null,
    updateLimit,
    isLoading,
    error,
    refetch,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-tag-definitions.ts]---
Location: sim-main/apps/sim/hooks/use-tag-definitions.ts
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'
import type { TagSlot } from '@/lib/knowledge/constants'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useTagDefinitions')

export interface TagDefinition {
  id: string
  tagSlot: TagSlot
  displayName: string
  fieldType: string
  createdAt: string
  updatedAt: string
}

export interface TagDefinitionInput {
  tagSlot: TagSlot
  displayName: string
  fieldType: string
  // Optional: for editing existing definitions
  _originalDisplayName?: string
}

/**
 * Hook for managing KB-scoped tag definitions
 * @param knowledgeBaseId - The knowledge base ID
 * @param documentId - The document ID (required for API calls)
 */
export function useTagDefinitions(
  knowledgeBaseId: string | null,
  documentId: string | null = null
) {
  const [tagDefinitions, setTagDefinitions] = useState<TagDefinition[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTagDefinitions = useCallback(async () => {
    if (!knowledgeBaseId || !documentId) {
      setTagDefinitions([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/knowledge/${knowledgeBaseId}/documents/${documentId}/tag-definitions`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch tag definitions: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.data)) {
        setTagDefinitions(data.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      logger.error('Error fetching tag definitions:', err)
      setError(errorMessage)
      setTagDefinitions([])
    } finally {
      setIsLoading(false)
    }
  }, [knowledgeBaseId, documentId])

  const saveTagDefinitions = useCallback(
    async (definitions: TagDefinitionInput[]) => {
      if (!knowledgeBaseId || !documentId) {
        throw new Error('Knowledge base ID and document ID are required')
      }

      // Simple validation
      const validDefinitions = (definitions || []).filter(
        (def) => def?.tagSlot && def.displayName && def.displayName.trim()
      )

      try {
        const response = await fetch(
          `/api/knowledge/${knowledgeBaseId}/documents/${documentId}/tag-definitions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ definitions: validDefinitions }),
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to save tag definitions: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to save tag definitions')
        }

        // Refresh the definitions after saving
        await fetchTagDefinitions()

        return data.data
      } catch (err) {
        logger.error('Error saving tag definitions:', err)
        throw err
      }
    },
    [knowledgeBaseId, documentId, fetchTagDefinitions]
  )

  const deleteTagDefinitions = useCallback(async () => {
    if (!knowledgeBaseId || !documentId) {
      throw new Error('Knowledge base ID and document ID are required')
    }

    try {
      const response = await fetch(
        `/api/knowledge/${knowledgeBaseId}/documents/${documentId}/tag-definitions`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to delete tag definitions: ${response.statusText}`)
      }

      // Refresh the definitions after deleting
      await fetchTagDefinitions()
    } catch (err) {
      logger.error('Error deleting tag definitions:', err)
      throw err
    }
  }, [knowledgeBaseId, documentId, fetchTagDefinitions])

  const getTagLabel = useCallback(
    (tagSlot: string): string => {
      const definition = tagDefinitions.find((def) => def.tagSlot === tagSlot)
      return definition?.displayName || tagSlot
    },
    [tagDefinitions]
  )

  const getTagDefinition = useCallback(
    (tagSlot: string): TagDefinition | undefined => {
      return tagDefinitions.find((def) => def.tagSlot === tagSlot)
    },
    [tagDefinitions]
  )

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    fetchTagDefinitions()
  }, [fetchTagDefinitions])

  return {
    tagDefinitions,
    isLoading,
    error,
    fetchTagDefinitions,
    saveTagDefinitions,
    deleteTagDefinitions,
    getTagLabel,
    getTagDefinition,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-tag-selection.ts]---
Location: sim-main/apps/sim/hooks/use-tag-selection.ts
Signals: React

```typescript
import { useCallback } from 'react'
import { useCollaborativeWorkflow } from '@/hooks/use-collaborative-workflow'

/**
 * Hook for handling immediate tag dropdown selections
 * Uses the collaborative workflow system but with immediate processing
 */
export function useTagSelection(blockId: string, subblockId: string) {
  const { collaborativeSetTagSelection } = useCollaborativeWorkflow()

  const emitTagSelectionValue = useCallback(
    (value: any) => {
      // Use the collaborative system with immediate processing (no debouncing)
      collaborativeSetTagSelection(blockId, subblockId, value)
    },
    [blockId, subblockId, collaborativeSetTagSelection]
  )

  return emitTagSelectionValue
}
```

--------------------------------------------------------------------------------

---[FILE: use-trigger-config-aggregation.ts]---
Location: sim-main/apps/sim/hooks/use-trigger-config-aggregation.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { getTrigger, isTriggerValid } from '@/triggers'
import { SYSTEM_SUBBLOCK_IDS } from '@/triggers/constants'

const logger = createLogger('useTriggerConfigAggregation')

/**
 * Maps old trigger config field names to new subblock IDs for backward compatibility.
 * This handles field name changes during the migration from modal-based configuration
 * to individual subblock fields.
 *
 * @param oldFieldName - The field name from the old triggerConfig object
 * @returns The corresponding new subblock ID, or the original field name if no mapping exists
 *
 * @example
 * mapOldFieldNameToNewSubBlockId('credentialId') // Returns 'triggerCredentials'
 * mapOldFieldNameToNewSubBlockId('labelIds') // Returns 'labelIds' (no mapping needed)
 */
function mapOldFieldNameToNewSubBlockId(oldFieldName: string): string {
  const fieldMapping: Record<string, string> = {
    credentialId: 'triggerCredentials',
    includeCellValuesInFieldIds: 'includeCellValues',
  }
  return fieldMapping[oldFieldName] || oldFieldName
}

/**
 * Aggregates individual trigger field subblocks into a triggerConfig object.
 * This is called on-demand when saving, not continuously.
 *
 * @param blockId - The block ID that has the trigger fields
 * @param triggerId - The trigger ID to get the config fields from
 * @returns The aggregated config object, or null if no valid config
 */

export function useTriggerConfigAggregation(
  blockId: string,
  triggerId: string | undefined
): Record<string, any> | null {
  if (!triggerId || !blockId) {
    return null
  }

  if (!isTriggerValid(triggerId)) {
    logger.warn(`Trigger definition not found for ID: ${triggerId}`)
    return null
  }

  const triggerDef = getTrigger(triggerId)

  const subBlockStore = useSubBlockStore.getState()

  const aggregatedConfig: Record<string, any> = {}
  let hasAnyValue = false

  triggerDef.subBlocks
    .filter((sb) => sb.mode === 'trigger' && !SYSTEM_SUBBLOCK_IDS.includes(sb.id))
    .forEach((subBlock) => {
      const fieldValue = subBlockStore.getValue(blockId, subBlock.id)

      let valueToUse = fieldValue
      if (
        (fieldValue === null || fieldValue === undefined || fieldValue === '') &&
        subBlock.required &&
        subBlock.defaultValue !== undefined
      ) {
        valueToUse = subBlock.defaultValue
      }

      if (valueToUse !== null && valueToUse !== undefined && valueToUse !== '') {
        aggregatedConfig[subBlock.id] = valueToUse
        hasAnyValue = true
      }
    })

  if (!hasAnyValue) {
    return null
  }

  logger.debug('Aggregated trigger config fields', {
    blockId,
    triggerId,
    aggregatedConfig,
  })

  return aggregatedConfig
}

/**
 * Populates individual trigger field subblocks from a triggerConfig object.
 * Used for backward compatibility when loading existing workflows.
 *
 * @param blockId - The block ID to populate fields for
 * @param triggerConfig - The trigger config object to extract fields from
 * @param triggerId - The trigger ID to get the field definitions
 */
export function populateTriggerFieldsFromConfig(
  blockId: string,
  triggerConfig: Record<string, any> | null | undefined,
  triggerId: string | undefined
) {
  if (!triggerConfig || !triggerId || !blockId) {
    return
  }

  if (Object.keys(triggerConfig).length === 0) {
    return
  }

  if (!isTriggerValid(triggerId)) {
    return
  }

  const triggerDef = getTrigger(triggerId)

  const subBlockStore = useSubBlockStore.getState()

  triggerDef.subBlocks
    .filter((sb) => sb.mode === 'trigger' && !SYSTEM_SUBBLOCK_IDS.includes(sb.id))
    .forEach((subBlock) => {
      let configValue: any

      if (subBlock.id in triggerConfig) {
        configValue = triggerConfig[subBlock.id]
      } else {
        for (const [oldFieldName, value] of Object.entries(triggerConfig)) {
          const mappedFieldName = mapOldFieldNameToNewSubBlockId(oldFieldName)
          if (mappedFieldName === subBlock.id) {
            configValue = value
            break
          }
        }
      }

      if (configValue !== undefined) {
        const currentValue = subBlockStore.getValue(blockId, subBlock.id)

        let normalizedValue = configValue
        if (subBlock.id === 'labelIds' || subBlock.id === 'folderIds') {
          if (typeof configValue === 'string' && configValue.trim() !== '') {
            try {
              normalizedValue = JSON.parse(configValue)
            } catch {
              normalizedValue = [configValue]
            }
          } else if (
            !Array.isArray(configValue) &&
            configValue !== null &&
            configValue !== undefined
          ) {
            normalizedValue = [configValue]
          }
        }

        if (currentValue === null || currentValue === undefined || currentValue === '') {
          subBlockStore.setValue(blockId, subBlock.id, normalizedValue)
        }
      }
    })
}
```

--------------------------------------------------------------------------------

````
