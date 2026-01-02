---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 529
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 529 of 933)

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

---[FILE: use-user-permissions.ts]---
Location: sim-main/apps/sim/hooks/use-user-permissions.ts
Signals: React

```typescript
import { useMemo } from 'react'
import { useSession } from '@/lib/auth/auth-client'
import { createLogger } from '@/lib/logs/console/logger'
import type { PermissionType, WorkspacePermissions } from '@/hooks/use-workspace-permissions'

const logger = createLogger('useUserPermissions')

export interface WorkspaceUserPermissions {
  // Core permission checks
  canRead: boolean
  canEdit: boolean
  canAdmin: boolean

  // Utility properties
  userPermissions: PermissionType
  isLoading: boolean
  error: string | null
}

/**
 * Custom hook to check current user's permissions within a workspace
 * This version accepts workspace permissions to avoid duplicate API calls
 *
 * @param workspacePermissions - The workspace permissions data
 * @param permissionsLoading - Whether permissions are currently loading
 * @param permissionsError - Any error from fetching permissions
 * @returns Object containing permission flags and utility properties
 */
export function useUserPermissions(
  workspacePermissions: WorkspacePermissions | null,
  permissionsLoading = false,
  permissionsError: string | null = null
): WorkspaceUserPermissions {
  const { data: session } = useSession()

  const userPermissions = useMemo((): WorkspaceUserPermissions => {
    const sessionEmail = session?.user?.email
    if (permissionsLoading || !sessionEmail) {
      return {
        canRead: false,
        canEdit: false,
        canAdmin: false,
        userPermissions: 'read',
        isLoading: permissionsLoading,
        error: permissionsError,
      }
    }

    // Find current user in workspace permissions (case-insensitive)
    const currentUser = workspacePermissions?.users?.find(
      (user) => user.email.toLowerCase() === sessionEmail.toLowerCase()
    )

    // If user not found in workspace, they have no permissions
    if (!currentUser) {
      logger.warn('User not found in workspace permissions', {
        userEmail: sessionEmail,
        hasPermissions: !!workspacePermissions,
        userCount: workspacePermissions?.users?.length || 0,
      })

      return {
        canRead: false,
        canEdit: false,
        canAdmin: false,
        userPermissions: 'read',
        isLoading: false,
        error: permissionsError || 'User not found in workspace',
      }
    }

    const userPerms = currentUser.permissionType || 'read'

    // Core permission checks
    const canAdmin = userPerms === 'admin'
    const canEdit = userPerms === 'write' || userPerms === 'admin'
    const canRead = true // If user is found in workspace permissions, they have read access

    return {
      canRead,
      canEdit,
      canAdmin,
      userPermissions: userPerms,
      isLoading: false,
      error: permissionsError,
    }
  }, [session, workspacePermissions, permissionsLoading, permissionsError])

  return userPermissions
}
```

--------------------------------------------------------------------------------

---[FILE: use-webhook-management.ts]---
Location: sim-main/apps/sim/hooks/use-webhook-management.ts
Signals: React, Next.js

```typescript
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { getBlock } from '@/blocks'
import { populateTriggerFieldsFromConfig } from '@/hooks/use-trigger-config-aggregation'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'
import { getTrigger, isTriggerValid } from '@/triggers'

const logger = createLogger('useWebhookManagement')

interface UseWebhookManagementProps {
  blockId: string
  triggerId?: string
  isPreview?: boolean
}

interface WebhookManagementState {
  webhookUrl: string
  webhookPath: string
  webhookId: string | null
  isLoading: boolean
  isSaving: boolean
  saveConfig: () => Promise<boolean>
  deleteConfig: () => Promise<boolean>
}

/**
 * Resolves the effective triggerId from various sources in order of priority
 */
function resolveEffectiveTriggerId(
  blockId: string,
  triggerId: string | undefined,
  webhook?: { providerConfig?: { triggerId?: string } }
): string | undefined {
  if (triggerId && isTriggerValid(triggerId)) {
    return triggerId
  }

  const selectedTriggerId = useSubBlockStore.getState().getValue(blockId, 'selectedTriggerId')
  if (typeof selectedTriggerId === 'string' && isTriggerValid(selectedTriggerId)) {
    return selectedTriggerId
  }

  const storedTriggerId = useSubBlockStore.getState().getValue(blockId, 'triggerId')
  if (typeof storedTriggerId === 'string' && isTriggerValid(storedTriggerId)) {
    return storedTriggerId
  }

  if (webhook?.providerConfig?.triggerId && typeof webhook.providerConfig.triggerId === 'string') {
    return webhook.providerConfig.triggerId
  }

  const workflowState = useWorkflowStore.getState()
  const block = workflowState.blocks?.[blockId]
  if (block) {
    const blockConfig = getBlock(block.type)
    if (blockConfig) {
      if (blockConfig.category === 'triggers') {
        return block.type
      }
      if (block.triggerMode && blockConfig.triggers?.enabled) {
        const selectedTriggerIdValue = block.subBlocks?.selectedTriggerId?.value
        const triggerIdValue = block.subBlocks?.triggerId?.value
        return (
          (typeof selectedTriggerIdValue === 'string' && isTriggerValid(selectedTriggerIdValue)
            ? selectedTriggerIdValue
            : undefined) ||
          (typeof triggerIdValue === 'string' && isTriggerValid(triggerIdValue)
            ? triggerIdValue
            : undefined) ||
          blockConfig.triggers?.available?.[0]
        )
      }
    }
  }

  return undefined
}

/**
 * Hook to manage webhook lifecycle for trigger blocks
 * Handles:
 * - Pre-generating webhook URLs based on blockId (without creating webhook)
 * - Loading existing webhooks from the API
 * - Saving and deleting webhook configurations
 */
export function useWebhookManagement({
  blockId,
  triggerId,
  isPreview = false,
}: UseWebhookManagementProps): WebhookManagementState {
  const params = useParams()
  const workflowId = params.workflowId as string

  const triggerDef = triggerId && isTriggerValid(triggerId) ? getTrigger(triggerId) : null

  const webhookId = useSubBlockStore(
    useCallback((state) => state.getValue(blockId, 'webhookId') as string | null, [blockId])
  )
  const webhookPath = useSubBlockStore(
    useCallback((state) => state.getValue(blockId, 'triggerPath') as string | null, [blockId])
  )
  const isLoading = useSubBlockStore((state) => state.loadingWebhooks.has(blockId))
  const isChecked = useSubBlockStore((state) => state.checkedWebhooks.has(blockId))

  const webhookUrl = useMemo(() => {
    if (!webhookPath) {
      const baseUrl = getBaseUrl()
      return `${baseUrl}/api/webhooks/trigger/${blockId}`
    }
    const baseUrl = getBaseUrl()
    return `${baseUrl}/api/webhooks/trigger/${webhookPath}`
  }, [webhookPath, blockId])

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (triggerId && !isPreview) {
      const storedTriggerId = useSubBlockStore.getState().getValue(blockId, 'triggerId')
      if (storedTriggerId !== triggerId) {
        useSubBlockStore.getState().setValue(blockId, 'triggerId', triggerId)
      }
    }
  }, [triggerId, blockId, isPreview])

  useEffect(() => {
    if (isPreview) {
      return
    }

    const store = useSubBlockStore.getState()
    const currentlyLoading = store.loadingWebhooks.has(blockId)
    const alreadyChecked = store.checkedWebhooks.has(blockId)
    const currentWebhookId = store.getValue(blockId, 'webhookId')

    if (currentlyLoading || (alreadyChecked && currentWebhookId)) {
      return
    }

    const loadWebhookOrGenerateUrl = async () => {
      useSubBlockStore.setState((state) => ({
        loadingWebhooks: new Set([...state.loadingWebhooks, blockId]),
      }))

      try {
        const response = await fetch(`/api/webhooks?workflowId=${workflowId}&blockId=${blockId}`)

        if (response.ok) {
          const data = await response.json()

          if (data.webhooks && data.webhooks.length > 0) {
            const webhook = data.webhooks[0].webhook

            useSubBlockStore.getState().setValue(blockId, 'webhookId', webhook.id)
            logger.info('Webhook loaded from API', {
              blockId,
              webhookId: webhook.id,
              hasProviderConfig: !!webhook.providerConfig,
            })

            if (webhook.path) {
              useSubBlockStore.getState().setValue(blockId, 'triggerPath', webhook.path)
            }

            if (webhook.providerConfig) {
              const effectiveTriggerId = resolveEffectiveTriggerId(blockId, triggerId, webhook)

              useSubBlockStore.getState().setValue(blockId, 'triggerConfig', webhook.providerConfig)

              if (effectiveTriggerId) {
                populateTriggerFieldsFromConfig(blockId, webhook.providerConfig, effectiveTriggerId)
              } else {
                logger.warn('Cannot migrate - triggerId not available', {
                  blockId,
                  propTriggerId: triggerId,
                  providerConfigTriggerId: webhook.providerConfig.triggerId,
                })
              }
            }
          } else {
            useSubBlockStore.getState().setValue(blockId, 'webhookId', null)
          }

          useSubBlockStore.setState((state) => ({
            checkedWebhooks: new Set([...state.checkedWebhooks, blockId]),
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
        logger.error('Error loading webhook:', { error, blockId, workflowId })
      } finally {
        useSubBlockStore.setState((state) => {
          const newSet = new Set(state.loadingWebhooks)
          newSet.delete(blockId)
          return { loadingWebhooks: newSet }
        })
      }
    }

    loadWebhookOrGenerateUrl()
  }, [isPreview, triggerId, workflowId, blockId])

  const createWebhook = async (
    effectiveTriggerId: string | undefined,
    selectedCredentialId: string | null
  ): Promise<boolean> => {
    if (!triggerDef || !effectiveTriggerId) {
      return false
    }

    const triggerConfig = useSubBlockStore.getState().getValue(blockId, 'triggerConfig')
    const webhookConfig = {
      ...(triggerConfig || {}),
      ...(selectedCredentialId ? { credentialId: selectedCredentialId } : {}),
      triggerId: effectiveTriggerId,
    }

    const path = blockId

    const response = await fetch('/api/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workflowId,
        blockId,
        path,
        provider: triggerDef.provider,
        providerConfig: webhookConfig,
      }),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to create webhook'
      try {
        const errorData = await response.json()
        errorMessage = errorData.details || errorData.error || errorMessage
      } catch {
        // If response is not JSON, use default message
      }
      logger.error('Failed to create webhook', { errorMessage })
      throw new Error(errorMessage)
    }

    const data = await response.json()
    const savedWebhookId = data.webhook.id

    useSubBlockStore.getState().setValue(blockId, 'triggerPath', path)
    useSubBlockStore.getState().setValue(blockId, 'triggerId', effectiveTriggerId)
    useSubBlockStore.getState().setValue(blockId, 'webhookId', savedWebhookId)
    useSubBlockStore.setState((state) => ({
      checkedWebhooks: new Set([...state.checkedWebhooks, blockId]),
    }))

    logger.info('Trigger webhook created successfully', {
      webhookId: savedWebhookId,
      triggerId: effectiveTriggerId,
      provider: triggerDef.provider,
      blockId,
    })

    return true
  }

  const updateWebhook = async (
    webhookIdToUpdate: string,
    effectiveTriggerId: string | undefined,
    selectedCredentialId: string | null
  ): Promise<boolean> => {
    const triggerConfig = useSubBlockStore.getState().getValue(blockId, 'triggerConfig')

    const response = await fetch(`/api/webhooks/${webhookIdToUpdate}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerConfig: {
          ...triggerConfig,
          ...(selectedCredentialId ? { credentialId: selectedCredentialId } : {}),
          triggerId: effectiveTriggerId,
        },
      }),
    })

    if (response.status === 404) {
      logger.warn('Webhook not found while updating, recreating', {
        blockId,
        lostWebhookId: webhookIdToUpdate,
      })
      useSubBlockStore.getState().setValue(blockId, 'webhookId', null)
      return createWebhook(effectiveTriggerId, selectedCredentialId)
    }

    if (!response.ok) {
      let errorMessage = 'Failed to save trigger configuration'
      try {
        const errorData = await response.json()
        errorMessage = errorData.details || errorData.error || errorMessage
      } catch {
        // If response is not JSON, use default message
      }
      logger.error('Failed to save trigger config', { errorMessage })
      throw new Error(errorMessage)
    }

    logger.info('Trigger config saved successfully', { blockId, webhookId: webhookIdToUpdate })
    return true
  }

  const saveConfig = async (): Promise<boolean> => {
    if (isPreview || !triggerDef) {
      return false
    }

    const effectiveTriggerId = resolveEffectiveTriggerId(blockId, triggerId)

    try {
      setIsSaving(true)

      const triggerCredentials = useSubBlockStore.getState().getValue(blockId, 'triggerCredentials')
      const selectedCredentialId = (triggerCredentials as string | null) || null

      if (!webhookId) {
        return createWebhook(effectiveTriggerId, selectedCredentialId)
      }

      return updateWebhook(webhookId, effectiveTriggerId, selectedCredentialId)
    } catch (error) {
      logger.error('Error saving trigger config:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const deleteConfig = async (): Promise<boolean> => {
    if (isPreview || !webhookId) {
      return false
    }

    try {
      setIsSaving(true)

      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        logger.error('Failed to delete webhook')
        return false
      }

      useSubBlockStore.getState().setValue(blockId, 'triggerPath', '')
      useSubBlockStore.getState().setValue(blockId, 'webhookId', null)
      useSubBlockStore.setState((state) => {
        const newSet = new Set(state.checkedWebhooks)
        newSet.delete(blockId)
        return { checkedWebhooks: newSet }
      })

      logger.info('Webhook deleted successfully')
      return true
    } catch (error) {
      logger.error('Error deleting webhook:', error)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return {
    webhookUrl,
    webhookPath: webhookPath || blockId,
    webhookId,
    isLoading,
    isSaving,
    saveConfig,
    deleteConfig,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-workspace-permissions.ts]---
Location: sim-main/apps/sim/hooks/use-workspace-permissions.ts
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react'
import type { permissionTypeEnum } from '@sim/db/schema'
import { createLogger } from '@/lib/logs/console/logger'
import { API_ENDPOINTS } from '@/stores/constants'

const logger = createLogger('useWorkspacePermissions')

export type PermissionType = (typeof permissionTypeEnum.enumValues)[number]

export interface WorkspaceUser {
  userId: string
  email: string
  name: string | null
  image: string | null
  permissionType: PermissionType
}

export interface WorkspacePermissions {
  users: WorkspaceUser[]
  total: number
}

interface UseWorkspacePermissionsReturn {
  permissions: WorkspacePermissions | null
  loading: boolean
  error: string | null
  updatePermissions: (newPermissions: WorkspacePermissions) => void
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch and manage workspace permissions
 *
 * @param workspaceId - The workspace ID to fetch permissions for
 * @returns Object containing permissions data, loading state, error state, and refetch function
 */
export function useWorkspacePermissions(workspaceId: string | null): UseWorkspacePermissionsReturn {
  const [permissions, setPermissions] = useState<WorkspacePermissions | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPermissions = async (id: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ENDPOINTS.WORKSPACE_PERMISSIONS(id))

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Workspace not found or access denied')
        }
        if (response.status === 401) {
          throw new Error('Authentication required')
        }
        throw new Error(`Failed to fetch permissions: ${response.statusText}`)
      }

      const data: WorkspacePermissions = await response.json()
      setPermissions(data)

      logger.info('Workspace permissions loaded', {
        workspaceId: id,
        userCount: data.total,
        users: data.users.map((u) => ({ email: u.email, permissions: u.permissionType })),
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      logger.error('Failed to fetch workspace permissions', {
        workspaceId: id,
        error: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const updatePermissions = (newPermissions: WorkspacePermissions): void => {
    setPermissions(newPermissions)
  }

  useEffect(() => {
    if (workspaceId) {
      fetchPermissions(workspaceId)
    } else {
      // Clear state if no workspace ID
      setPermissions(null)
      setError(null)
      setLoading(false)
    }
  }, [workspaceId])

  const refetch = useCallback(async () => {
    if (workspaceId) {
      await fetchPermissions(workspaceId)
    }
  }, [workspaceId])

  return {
    permissions,
    loading,
    error,
    updatePermissions,
    refetch,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: api-keys.ts]---
Location: sim-main/apps/sim/hooks/queries/api-keys.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { workspaceKeys } from '@/hooks/queries/workspace'

/**
 * Query key factories for API keys-related queries
 */
export const apiKeysKeys = {
  all: ['apiKeys'] as const,
  workspace: (workspaceId: string) => [...apiKeysKeys.all, 'workspace', workspaceId] as const,
  personal: () => [...apiKeysKeys.all, 'personal'] as const,
  combined: (workspaceId: string) => [...apiKeysKeys.all, 'combined', workspaceId] as const,
}

/**
 * API Key type definition
 */
export interface ApiKey {
  id: string
  name: string
  key: string
  displayKey?: string
  lastUsed?: string
  createdAt: string
  expiresAt?: string
  createdBy?: string
}

/**
 * Combined API keys response
 */
interface ApiKeysResponse {
  workspaceKeys: ApiKey[]
  personalKeys: ApiKey[]
  conflicts: string[]
}

/**
 * Fetch both workspace and personal API keys
 */
async function fetchApiKeys(workspaceId: string): Promise<ApiKeysResponse> {
  const [workspaceResponse, personalResponse] = await Promise.all([
    fetch(`/api/workspaces/${workspaceId}/api-keys`),
    fetch('/api/users/me/api-keys'),
  ])

  let workspaceKeys: ApiKey[] = []
  let personalKeys: ApiKey[] = []

  if (workspaceResponse.ok) {
    const workspaceData = await workspaceResponse.json()
    workspaceKeys = workspaceData.keys || []
  }

  if (personalResponse.ok) {
    const personalData = await personalResponse.json()
    personalKeys = personalData.keys || []
  }

  const workspaceKeyNames = new Set(workspaceKeys.map((k) => k.name))
  const conflicts = personalKeys
    .filter((key) => workspaceKeyNames.has(key.name))
    .map((key) => key.name)

  return {
    workspaceKeys,
    personalKeys,
    conflicts,
  }
}

/**
 * Hook to fetch API keys (both workspace and personal)
 */
export function useApiKeys(workspaceId: string) {
  return useQuery({
    queryKey: apiKeysKeys.combined(workspaceId),
    queryFn: () => fetchApiKeys(workspaceId),
    enabled: !!workspaceId,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

/**
 * Create API key mutation params
 */
interface CreateApiKeyParams {
  workspaceId: string
  name: string
  keyType: 'personal' | 'workspace'
}

/**
 * Hook to create a new API key
 */
export function useCreateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, name, keyType }: CreateApiKeyParams) => {
      const url =
        keyType === 'workspace'
          ? `/api/workspaces/${workspaceId}/api-keys`
          : '/api/users/me/api-keys'

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to create API key' }))
        throw new Error(error.error || 'Failed to create API key')
      }

      return response.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: apiKeysKeys.combined(variables.workspaceId),
      })
    },
  })
}

/**
 * Delete API key mutation params
 */
interface DeleteApiKeyParams {
  workspaceId: string
  keyId: string
  keyType: 'personal' | 'workspace'
}

/**
 * Hook to delete an API key
 */
export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, keyId, keyType }: DeleteApiKeyParams) => {
      const url =
        keyType === 'workspace'
          ? `/api/workspaces/${workspaceId}/api-keys/${keyId}`
          : `/api/users/me/api-keys/${keyId}`

      const response = await fetch(url, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to delete API key' }))
        throw new Error(error.error || 'Failed to delete API key')
      }

      return response.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: apiKeysKeys.combined(variables.workspaceId),
      })
    },
  })
}

/**
 * Update workspace API key settings mutation params
 */
interface UpdateWorkspaceApiKeySettingsParams {
  workspaceId: string
  allowPersonalApiKeys: boolean
}

/**
 * Hook to update workspace API key settings
 */
export function useUpdateWorkspaceApiKeySettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      workspaceId,
      allowPersonalApiKeys,
    }: UpdateWorkspaceApiKeySettingsParams) => {
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allowPersonalApiKeys }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to update settings' }))
        throw new Error(error.error || 'Failed to update workspace settings')
      }

      return response.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.settings(variables.workspaceId),
      })
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: copilot-keys.ts]---
Location: sim-main/apps/sim/hooks/queries/copilot-keys.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isHosted } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CopilotKeysQuery')

/**
 * Query key factories for Copilot API keys
 */
export const copilotKeysKeys = {
  all: ['copilot'] as const,
  keys: () => [...copilotKeysKeys.all, 'api-keys'] as const,
}

/**
 * Copilot API key type
 */
export interface CopilotKey {
  id: string
  displayKey: string // "•••••{last6}"
  name: string | null
  createdAt: string | null
  lastUsed: string | null
}

/**
 * Generate key response type
 */
export interface GenerateKeyResponse {
  success: boolean
  key: {
    id: string
    apiKey: string // Full key (only shown once)
  }
}

/**
 * Fetch Copilot API keys
 */
async function fetchCopilotKeys(): Promise<CopilotKey[]> {
  const response = await fetch('/api/copilot/api-keys')

  if (!response.ok) {
    throw new Error('Failed to fetch Copilot API keys')
  }

  const data = await response.json()
  return data.keys || []
}

/**
 * Hook to fetch Copilot API keys
 */
export function useCopilotKeys() {
  return useQuery({
    queryKey: copilotKeysKeys.keys(),
    queryFn: fetchCopilotKeys,
    enabled: isHosted,
    staleTime: 30 * 1000, // 30 seconds
    placeholderData: keepPreviousData,
  })
}

/**
 * Generate key params
 */
interface GenerateKeyParams {
  name: string
}

/**
 * Generate new Copilot API key mutation
 */
export function useGenerateCopilotKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ name }: GenerateKeyParams): Promise<GenerateKeyResponse> => {
      const response = await fetch('/api/copilot/api-keys/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate Copilot API key')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: copilotKeysKeys.keys(),
        type: 'active',
      })
    },
    onError: (error) => {
      logger.error('Failed to generate Copilot API key:', error)
    },
  })
}

/**
 * Delete Copilot API key mutation with optimistic updates
 */
interface DeleteKeyParams {
  keyId: string
}

export function useDeleteCopilotKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ keyId }: DeleteKeyParams) => {
      const response = await fetch(`/api/copilot/api-keys?id=${keyId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete Copilot API key')
      }

      return response.json()
    },
    onMutate: async ({ keyId }) => {
      await queryClient.cancelQueries({ queryKey: copilotKeysKeys.keys() })

      const previousKeys = queryClient.getQueryData<CopilotKey[]>(copilotKeysKeys.keys())

      queryClient.setQueryData<CopilotKey[]>(copilotKeysKeys.keys(), (old) => {
        return old?.filter((k) => k.id !== keyId) || []
      })

      return { previousKeys }
    },
    onError: (error, _variables, context) => {
      if (context?.previousKeys) {
        queryClient.setQueryData(copilotKeysKeys.keys(), context.previousKeys)
      }
      logger.error('Failed to delete Copilot API key:', error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: copilotKeysKeys.keys() })
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: creator-profile.ts]---
Location: sim-main/apps/sim/hooks/queries/creator-profile.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLogger } from '@/lib/logs/console/logger'
import type { CreatorProfileDetails } from '@/app/_types/creator-profile'

const logger = createLogger('CreatorProfileQuery')

/**
 * Query key factories for creator profiles
 */
export const creatorProfileKeys = {
  all: ['creatorProfile'] as const,
  profile: (userId: string) => [...creatorProfileKeys.all, 'profile', userId] as const,
  organizations: () => [...creatorProfileKeys.all, 'organizations'] as const,
}

/**
 * Organization type
 */
export interface Organization {
  id: string
  name: string
  role: string
}

/**
 * Creator profile type
 */
export interface CreatorProfile {
  id: string
  referenceType: 'user' | 'organization'
  referenceId: string
  name: string
  profileImageUrl: string
  details?: CreatorProfileDetails
  createdAt: string
  updatedAt: string
}

/**
 * Fetch organizations where user is owner or admin
 * Note: Filtering is done server-side in the API route
 */
async function fetchOrganizations(): Promise<Organization[]> {
  const response = await fetch('/api/organizations')

  if (!response.ok) {
    throw new Error('Failed to fetch organizations')
  }

  const data = await response.json()
  return data.organizations || []
}

/**
 * Hook to fetch organizations
 */
export function useOrganizations() {
  return useQuery({
    queryKey: creatorProfileKeys.organizations(),
    queryFn: fetchOrganizations,
    staleTime: 5 * 60 * 1000, // 5 minutes - organizations don't change often
    placeholderData: keepPreviousData, // Show cached data immediately
  })
}

/**
 * Fetch creator profile for a user
 */
async function fetchCreatorProfile(userId: string): Promise<CreatorProfile | null> {
  const response = await fetch(`/api/creators?userId=${userId}`)

  // Treat 404 as "no profile"
  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch creator profile')
  }

  const data = await response.json()

  if (data.profiles && data.profiles.length > 0) {
    return data.profiles[0]
  }

  return null
}

/**
 * Hook to fetch creator profile
 */
export function useCreatorProfile(userId: string) {
  return useQuery({
    queryKey: creatorProfileKeys.profile(userId),
    queryFn: () => fetchCreatorProfile(userId),
    enabled: !!userId,
    retry: false, // Don't retry on 404
    staleTime: 60 * 1000, // 1 minute
    placeholderData: keepPreviousData, // Show cached data immediately
  })
}

/**
 * Save creator profile mutation
 */
interface SaveProfileParams {
  referenceType: 'user' | 'organization'
  referenceId: string
  name: string
  profileImageUrl: string
  details?: CreatorProfileDetails
  existingProfileId?: string
}

export function useSaveCreatorProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      referenceType,
      referenceId,
      name,
      profileImageUrl,
      details,
      existingProfileId,
    }: SaveProfileParams) => {
      const payload = {
        referenceType,
        referenceId,
        name,
        profileImageUrl,
        details: details && Object.keys(details).length > 0 ? details : undefined,
      }

      const url = existingProfileId ? `/api/creators/${existingProfileId}` : '/api/creators'
      const method = existingProfileId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Failed to save creator profile'
        throw new Error(errorMessage)
      }

      const result = await response.json()
      return result.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: creatorProfileKeys.profile(variables.referenceId),
      })

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('creator-profile-saved'))
      }

      logger.info('Creator profile saved successfully')
    },
    onError: (error) => {
      logger.error('Failed to save creator profile:', error)
    },
  })
}
```

--------------------------------------------------------------------------------

````
