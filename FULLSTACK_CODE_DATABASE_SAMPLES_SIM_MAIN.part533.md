---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 533
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 533 of 933)

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

---[FILE: user-profile.ts]---
Location: sim-main/apps/sim/hooks/queries/user-profile.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('UserProfileQuery')

/**
 * Query key factories for user profile
 */
export const userProfileKeys = {
  all: ['userProfile'] as const,
  profile: () => [...userProfileKeys.all, 'profile'] as const,
}

/**
 * User profile type
 */
export interface UserProfile {
  id: string
  name: string
  email: string
  image: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Fetch user profile from API
 */
async function fetchUserProfile(): Promise<UserProfile> {
  const response = await fetch('/api/users/me/profile')

  if (!response.ok) {
    throw new Error('Failed to fetch user profile')
  }

  const { user } = await response.json()

  return {
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    image: user.image || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

/**
 * Hook to fetch user profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: userProfileKeys.profile(),
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes - profile data doesn't change often
    placeholderData: keepPreviousData, // Show cached data immediately
  })
}

/**
 * Update user profile mutation
 */
interface UpdateProfileParams {
  name?: string
  image?: string | null
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: UpdateProfileParams) => {
      const response = await fetch('/api/users/me/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      return response.json()
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: userProfileKeys.profile() })

      const previousProfile = queryClient.getQueryData<UserProfile>(userProfileKeys.profile())

      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(userProfileKeys.profile(), {
          ...previousProfile,
          ...updates,
          updatedAt: new Date().toISOString(),
        })
      }

      return { previousProfile }
    },
    onError: (err, _variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(userProfileKeys.profile(), context.previousProfile)
      }
      logger.error('Failed to update profile:', err)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userProfileKeys.profile() })
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: workflows.ts]---
Location: sim-main/apps/sim/hooks/queries/workflows.ts
Signals: React

```typescript
import { useEffect } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLogger } from '@/lib/logs/console/logger'
import { buildDefaultWorkflowArtifacts } from '@/lib/workflows/defaults'
import {
  createOptimisticMutationHandlers,
  generateTempId,
} from '@/hooks/queries/utils/optimistic-mutation'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import type { WorkflowMetadata } from '@/stores/workflows/registry/types'
import {
  generateCreativeWorkflowName,
  getNextWorkflowColor,
} from '@/stores/workflows/registry/utils'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'

const logger = createLogger('WorkflowQueries')

export const workflowKeys = {
  all: ['workflows'] as const,
  lists: () => [...workflowKeys.all, 'list'] as const,
  list: (workspaceId: string | undefined) => [...workflowKeys.lists(), workspaceId ?? ''] as const,
}

function mapWorkflow(workflow: any): WorkflowMetadata {
  return {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
    color: workflow.color,
    workspaceId: workflow.workspaceId,
    folderId: workflow.folderId,
    createdAt: new Date(workflow.createdAt),
    lastModified: new Date(workflow.updatedAt || workflow.createdAt),
  }
}

async function fetchWorkflows(workspaceId: string): Promise<WorkflowMetadata[]> {
  const response = await fetch(`/api/workflows?workspaceId=${workspaceId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch workflows')
  }

  const { data }: { data: any[] } = await response.json()
  return data.map(mapWorkflow)
}

export function useWorkflows(workspaceId?: string, options?: { syncRegistry?: boolean }) {
  const { syncRegistry = true } = options || {}
  const beginMetadataLoad = useWorkflowRegistry((state) => state.beginMetadataLoad)
  const completeMetadataLoad = useWorkflowRegistry((state) => state.completeMetadataLoad)
  const failMetadataLoad = useWorkflowRegistry((state) => state.failMetadataLoad)

  const query = useQuery({
    queryKey: workflowKeys.list(workspaceId),
    queryFn: () => fetchWorkflows(workspaceId as string),
    enabled: Boolean(workspaceId),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  })

  useEffect(() => {
    if (syncRegistry && workspaceId && query.status === 'pending') {
      beginMetadataLoad(workspaceId)
    }
  }, [syncRegistry, workspaceId, query.status, beginMetadataLoad])

  useEffect(() => {
    if (syncRegistry && workspaceId && query.status === 'success' && query.data) {
      completeMetadataLoad(workspaceId, query.data)
    }
  }, [syncRegistry, workspaceId, query.status, query.data, completeMetadataLoad])

  useEffect(() => {
    if (syncRegistry && workspaceId && query.status === 'error') {
      const message =
        query.error instanceof Error ? query.error.message : 'Failed to fetch workflows'
      failMetadataLoad(workspaceId, message)
    }
  }, [syncRegistry, workspaceId, query.status, query.error, failMetadataLoad])

  return query
}

interface CreateWorkflowVariables {
  workspaceId: string
  name?: string
  description?: string
  color?: string
  folderId?: string | null
}

interface CreateWorkflowResult {
  id: string
  name: string
  description?: string
  color: string
  workspaceId: string
  folderId?: string | null
}

interface DuplicateWorkflowVariables {
  workspaceId: string
  sourceId: string
  name: string
  description?: string
  color: string
  folderId?: string | null
}

interface DuplicateWorkflowResult {
  id: string
  name: string
  description?: string
  color: string
  workspaceId: string
  folderId?: string | null
  blocksCount: number
  edgesCount: number
  subflowsCount: number
}

/**
 * Creates optimistic mutation handlers for workflow operations
 */
function createWorkflowMutationHandlers<TVariables extends { workspaceId: string }>(
  queryClient: ReturnType<typeof useQueryClient>,
  name: string,
  createOptimisticWorkflow: (variables: TVariables, tempId: string) => WorkflowMetadata
) {
  return createOptimisticMutationHandlers<
    CreateWorkflowResult | DuplicateWorkflowResult,
    TVariables,
    WorkflowMetadata
  >(queryClient, {
    name,
    getQueryKey: (variables) => workflowKeys.list(variables.workspaceId),
    getSnapshot: () => ({ ...useWorkflowRegistry.getState().workflows }),
    generateTempId: () => generateTempId('temp-workflow'),
    createOptimisticItem: createOptimisticWorkflow,
    applyOptimisticUpdate: (tempId, item) => {
      useWorkflowRegistry.setState((state) => ({
        workflows: { ...state.workflows, [tempId]: item },
      }))
    },
    replaceOptimisticEntry: (tempId, data) => {
      useWorkflowRegistry.setState((state) => {
        const { [tempId]: _, ...remainingWorkflows } = state.workflows
        return {
          workflows: {
            ...remainingWorkflows,
            [data.id]: {
              id: data.id,
              name: data.name,
              lastModified: new Date(),
              createdAt: new Date(),
              description: data.description,
              color: data.color,
              workspaceId: data.workspaceId,
              folderId: data.folderId,
            },
          },
          error: null,
        }
      })
    },
    rollback: (snapshot) => {
      useWorkflowRegistry.setState({ workflows: snapshot })
    },
  })
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient()

  const handlers = createWorkflowMutationHandlers<CreateWorkflowVariables>(
    queryClient,
    'CreateWorkflow',
    (variables, tempId) => ({
      id: tempId,
      name: variables.name || generateCreativeWorkflowName(),
      lastModified: new Date(),
      createdAt: new Date(),
      description: variables.description || 'New workflow',
      color: variables.color || getNextWorkflowColor(),
      workspaceId: variables.workspaceId,
      folderId: variables.folderId || null,
    })
  )

  return useMutation({
    mutationFn: async (variables: CreateWorkflowVariables): Promise<CreateWorkflowResult> => {
      const { workspaceId, name, description, color, folderId } = variables

      logger.info(`Creating new workflow in workspace: ${workspaceId}`)

      const createResponse = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || generateCreativeWorkflowName(),
          description: description || 'New workflow',
          color: color || getNextWorkflowColor(),
          workspaceId,
          folderId: folderId || null,
        }),
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json()
        throw new Error(
          `Failed to create workflow: ${errorData.error || createResponse.statusText}`
        )
      }

      const createdWorkflow = await createResponse.json()
      const workflowId = createdWorkflow.id

      logger.info(`Successfully created workflow ${workflowId}`)

      const { workflowState } = buildDefaultWorkflowArtifacts()

      const stateResponse = await fetch(`/api/workflows/${workflowId}/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowState),
      })

      if (!stateResponse.ok) {
        const text = await stateResponse.text()
        logger.error('Failed to persist default Start block:', text)
      } else {
        logger.info('Successfully persisted default Start block')
      }

      return {
        id: workflowId,
        name: createdWorkflow.name,
        description: createdWorkflow.description,
        color: createdWorkflow.color,
        workspaceId,
        folderId: createdWorkflow.folderId,
      }
    },
    ...handlers,
    onSuccess: (data, variables, context) => {
      handlers.onSuccess(data, variables, context)

      // Initialize subblock values for new workflow
      const { subBlockValues } = buildDefaultWorkflowArtifacts()
      useSubBlockStore.setState((state) => ({
        workflowValues: {
          ...state.workflowValues,
          [data.id]: subBlockValues,
        },
      }))
    },
  })
}

export function useDuplicateWorkflowMutation() {
  const queryClient = useQueryClient()

  const handlers = createWorkflowMutationHandlers<DuplicateWorkflowVariables>(
    queryClient,
    'DuplicateWorkflow',
    (variables, tempId) => ({
      id: tempId,
      name: variables.name,
      lastModified: new Date(),
      createdAt: new Date(),
      description: variables.description,
      color: variables.color,
      workspaceId: variables.workspaceId,
      folderId: variables.folderId || null,
    })
  )

  return useMutation({
    mutationFn: async (variables: DuplicateWorkflowVariables): Promise<DuplicateWorkflowResult> => {
      const { workspaceId, sourceId, name, description, color, folderId } = variables

      logger.info(`Duplicating workflow ${sourceId} in workspace: ${workspaceId}`)

      const response = await fetch(`/api/workflows/${sourceId}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          color,
          workspaceId,
          folderId: folderId ?? null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Failed to duplicate workflow: ${errorData.error || response.statusText}`)
      }

      const duplicatedWorkflow = await response.json()

      logger.info(`Successfully duplicated workflow ${sourceId} to ${duplicatedWorkflow.id}`, {
        blocksCount: duplicatedWorkflow.blocksCount,
        edgesCount: duplicatedWorkflow.edgesCount,
        subflowsCount: duplicatedWorkflow.subflowsCount,
      })

      return {
        id: duplicatedWorkflow.id,
        name: duplicatedWorkflow.name || name,
        description: duplicatedWorkflow.description || description,
        color: duplicatedWorkflow.color || color,
        workspaceId,
        folderId: duplicatedWorkflow.folderId ?? folderId,
        blocksCount: duplicatedWorkflow.blocksCount || 0,
        edgesCount: duplicatedWorkflow.edgesCount || 0,
        subflowsCount: duplicatedWorkflow.subflowsCount || 0,
      }
    },
    ...handlers,
    onSuccess: (data, variables, context) => {
      handlers.onSuccess(data, variables, context)

      // Copy subblock values from source if it's the active workflow
      const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
      if (variables.sourceId === activeWorkflowId) {
        const sourceSubblockValues =
          useSubBlockStore.getState().workflowValues[variables.sourceId] || {}
        useSubBlockStore.setState((state) => ({
          workflowValues: {
            ...state.workflowValues,
            [data.id]: { ...sourceSubblockValues },
          },
        }))
      }
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: workspace-files.ts]---
Location: sim-main/apps/sim/hooks/queries/workspace-files.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLogger } from '@/lib/logs/console/logger'
import type { WorkspaceFileRecord } from '@/lib/uploads/contexts/workspace'

const logger = createLogger('WorkspaceFilesQuery')

/**
 * Query key factories for workspace files
 */
export const workspaceFilesKeys = {
  all: ['workspaceFiles'] as const,
  lists: () => [...workspaceFilesKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...workspaceFilesKeys.lists(), workspaceId] as const,
  storageInfo: (workspaceId: string) =>
    [...workspaceFilesKeys.all, 'storage', workspaceId] as const,
}

/**
 * Storage info type
 */
export interface StorageInfo {
  usedBytes: number
  limitBytes: number
  percentUsed: number
  plan?: string
}

/**
 * Fetch workspace files from API
 */
async function fetchWorkspaceFiles(workspaceId: string): Promise<WorkspaceFileRecord[]> {
  const response = await fetch(`/api/workspaces/${workspaceId}/files`)

  if (!response.ok) {
    throw new Error('Failed to fetch workspace files')
  }

  const data = await response.json()

  return data.success ? data.files : []
}

/**
 * Hook to fetch workspace files
 */
export function useWorkspaceFiles(workspaceId: string) {
  return useQuery({
    queryKey: workspaceFilesKeys.list(workspaceId),
    queryFn: () => fetchWorkspaceFiles(workspaceId),
    enabled: !!workspaceId,
    staleTime: 30 * 1000, // 30 seconds - files can change frequently
    placeholderData: keepPreviousData, // Show cached data immediately
  })
}

/**
 * Fetch storage info from API
 */
async function fetchStorageInfo(): Promise<StorageInfo | null> {
  const response = await fetch('/api/users/me/usage-limits')

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch storage info')
  }

  const data = await response.json()

  if (data.success && data.storage) {
    return {
      usedBytes: data.storage.usedBytes,
      limitBytes: data.storage.limitBytes,
      percentUsed: data.storage.percentUsed,
      plan: data.usage?.plan || 'free',
    }
  }

  return null
}

/**
 * Hook to fetch storage info
 */
export function useStorageInfo(enabled = true) {
  return useQuery({
    queryKey: ['storageInfo'],
    queryFn: fetchStorageInfo,
    enabled,
    retry: false, // Don't retry on 404
    staleTime: 60 * 1000, // 1 minute - storage info doesn't change often
    placeholderData: keepPreviousData,
  })
}

/**
 * Upload workspace file mutation
 */
interface UploadFileParams {
  workspaceId: string
  file: File
}

export function useUploadWorkspaceFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, file }: UploadFileParams) => {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/workspaces/${workspaceId}/files`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      return data
    },
    onSuccess: (_data, variables) => {
      // Invalidate files list to refetch
      queryClient.invalidateQueries({ queryKey: workspaceFilesKeys.list(variables.workspaceId) })
      // Invalidate storage info to update usage
      queryClient.invalidateQueries({ queryKey: ['storageInfo'] })
    },
    onError: (error) => {
      logger.error('Failed to upload file:', error)
    },
  })
}

/**
 * Delete workspace file mutation
 */
interface DeleteFileParams {
  workspaceId: string
  fileId: string
  fileSize: number
}

export function useDeleteWorkspaceFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, fileId }: DeleteFileParams) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/files/${fileId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Delete failed')
      }

      return data
    },
    onMutate: async ({ workspaceId, fileId, fileSize }) => {
      await queryClient.cancelQueries({ queryKey: workspaceFilesKeys.list(workspaceId) })
      await queryClient.cancelQueries({ queryKey: ['storageInfo'] })

      const previousFiles = queryClient.getQueryData<WorkspaceFileRecord[]>(
        workspaceFilesKeys.list(workspaceId)
      )
      const previousStorage = queryClient.getQueryData<StorageInfo>(['storageInfo'])

      if (previousFiles) {
        queryClient.setQueryData<WorkspaceFileRecord[]>(
          workspaceFilesKeys.list(workspaceId),
          previousFiles.filter((f) => f.id !== fileId)
        )
      }

      if (previousStorage) {
        const newUsedBytes = Math.max(0, previousStorage.usedBytes - fileSize)
        const newPercentUsed = (newUsedBytes / previousStorage.limitBytes) * 100
        queryClient.setQueryData<StorageInfo>(['storageInfo'], {
          ...previousStorage,
          usedBytes: newUsedBytes,
          percentUsed: newPercentUsed,
        })
      }

      return { previousFiles, previousStorage }
    },
    onError: (_err, variables, context) => {
      if (context?.previousFiles) {
        queryClient.setQueryData(
          workspaceFilesKeys.list(variables.workspaceId),
          context.previousFiles
        )
      }
      if (context?.previousStorage) {
        queryClient.setQueryData(['storageInfo'], context.previousStorage)
      }
      logger.error('Failed to delete file')
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceFilesKeys.list(variables.workspaceId) })
      queryClient.invalidateQueries({ queryKey: ['storageInfo'] })
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: workspace.ts]---
Location: sim-main/apps/sim/hooks/queries/workspace.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * Query key factories for workspace-related queries
 */
export const workspaceKeys = {
  all: ['workspace'] as const,
  details: () => [...workspaceKeys.all, 'detail'] as const,
  detail: (id: string) => [...workspaceKeys.details(), id] as const,
  settings: (id: string) => [...workspaceKeys.detail(id), 'settings'] as const,
  permissions: (id: string) => [...workspaceKeys.detail(id), 'permissions'] as const,
  adminLists: () => [...workspaceKeys.all, 'adminList'] as const,
  adminList: (userId: string | undefined) => [...workspaceKeys.adminLists(), userId ?? ''] as const,
}

/**
 * Fetch workspace settings
 */
async function fetchWorkspaceSettings(workspaceId: string) {
  const [settingsResponse, permissionsResponse] = await Promise.all([
    fetch(`/api/workspaces/${workspaceId}`),
    fetch(`/api/workspaces/${workspaceId}/permissions`),
  ])

  if (!settingsResponse.ok || !permissionsResponse.ok) {
    throw new Error('Failed to fetch workspace settings')
  }

  const [settings, permissions] = await Promise.all([
    settingsResponse.json(),
    permissionsResponse.json(),
  ])

  return {
    settings,
    permissions,
  }
}

/**
 * Hook to fetch workspace settings
 */
export function useWorkspaceSettings(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.settings(workspaceId),
    queryFn: () => fetchWorkspaceSettings(workspaceId),
    enabled: !!workspaceId,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })
}

/**
 * Update workspace settings mutation
 */
interface UpdateWorkspaceSettingsParams {
  workspaceId: string
  billedAccountUserId?: string
  billingAccountUserEmail?: string
}

export function useUpdateWorkspaceSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, ...updates }: UpdateWorkspaceSettingsParams) => {
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update workspace settings')
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

/**
 * Workspace type returned by admin workspaces query
 */
export interface AdminWorkspace {
  id: string
  name: string
  isOwner: boolean
  ownerId?: string
  canInvite: boolean
}

/**
 * Fetch workspaces where user has admin access
 */
async function fetchAdminWorkspaces(userId: string | undefined): Promise<AdminWorkspace[]> {
  if (!userId) {
    return []
  }

  const workspacesResponse = await fetch('/api/workspaces')
  if (!workspacesResponse.ok) {
    throw new Error('Failed to fetch workspaces')
  }

  const workspacesData = await workspacesResponse.json()
  const allUserWorkspaces = workspacesData.workspaces || []

  const permissionPromises = allUserWorkspaces.map(
    async (workspace: { id: string; name: string; isOwner?: boolean; ownerId?: string }) => {
      try {
        const permissionResponse = await fetch(`/api/workspaces/${workspace.id}/permissions`)
        if (!permissionResponse.ok) {
          return null
        }
        const permissionData = await permissionResponse.json()
        return { workspace, permissionData }
      } catch (error) {
        return null
      }
    }
  )

  const results = await Promise.all(permissionPromises)

  const adminWorkspaces: AdminWorkspace[] = []
  for (const result of results) {
    if (!result) continue

    const { workspace, permissionData } = result
    let hasAdminAccess = false

    if (permissionData.users) {
      const currentUserPermission = permissionData.users.find(
        (user: { id: string; userId?: string; permissionType: string }) =>
          user.id === userId || user.userId === userId
      )
      hasAdminAccess = currentUserPermission?.permissionType === 'admin'
    }

    const isOwner = workspace.isOwner || workspace.ownerId === userId

    if (hasAdminAccess || isOwner) {
      adminWorkspaces.push({
        id: workspace.id,
        name: workspace.name,
        isOwner,
        ownerId: workspace.ownerId,
        canInvite: true,
      })
    }
  }

  return adminWorkspaces
}

/**
 * Hook to fetch workspaces where user has admin access
 */
export function useAdminWorkspaces(userId: string | undefined) {
  return useQuery({
    queryKey: workspaceKeys.adminList(userId),
    queryFn: () => fetchAdminWorkspaces(userId),
    enabled: Boolean(userId),
    staleTime: 60 * 1000, // Cache for 60 seconds
    placeholderData: keepPreviousData,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/hooks/queries/utils/index.ts

```typescript
export {
  createOptimisticMutationHandlers,
  generateTempId,
  type OptimisticMutationConfig,
  type OptimisticMutationContext,
} from './optimistic-mutation'
```

--------------------------------------------------------------------------------

---[FILE: optimistic-mutation.ts]---
Location: sim-main/apps/sim/hooks/queries/utils/optimistic-mutation.ts

```typescript
import type { QueryClient } from '@tanstack/react-query'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('OptimisticMutation')

export interface OptimisticMutationConfig<TData, TVariables, TItem, TContext> {
  name: string
  getQueryKey: (variables: TVariables) => readonly unknown[]
  getSnapshot: () => Record<string, TItem>
  generateTempId: () => string
  createOptimisticItem: (variables: TVariables, tempId: string) => TItem
  applyOptimisticUpdate: (tempId: string, item: TItem) => void
  replaceOptimisticEntry: (tempId: string, data: TData) => void
  rollback: (snapshot: Record<string, TItem>) => void
  onSuccessExtra?: (data: TData, variables: TVariables) => void
}

export interface OptimisticMutationContext<TItem> {
  tempId: string
  previousState: Record<string, TItem>
}

export function createOptimisticMutationHandlers<TData, TVariables, TItem>(
  queryClient: QueryClient,
  config: OptimisticMutationConfig<TData, TVariables, TItem, OptimisticMutationContext<TItem>>
) {
  const {
    name,
    getQueryKey,
    getSnapshot,
    generateTempId,
    createOptimisticItem,
    applyOptimisticUpdate,
    replaceOptimisticEntry,
    rollback,
    onSuccessExtra,
  } = config

  return {
    onMutate: async (variables: TVariables): Promise<OptimisticMutationContext<TItem>> => {
      const queryKey = getQueryKey(variables)
      await queryClient.cancelQueries({ queryKey })
      const previousState = getSnapshot()
      const tempId = generateTempId()
      const optimisticItem = createOptimisticItem(variables, tempId)
      applyOptimisticUpdate(tempId, optimisticItem)
      logger.info(`[${name}] Added optimistic entry: ${tempId}`)
      return { tempId, previousState }
    },

    onSuccess: (data: TData, variables: TVariables, context: OptimisticMutationContext<TItem>) => {
      logger.info(`[${name}] Success, replacing temp entry ${context.tempId}`)
      replaceOptimisticEntry(context.tempId, data)
      onSuccessExtra?.(data, variables)
    },

    onError: (
      error: Error,
      _variables: TVariables,
      context: OptimisticMutationContext<TItem> | undefined
    ) => {
      logger.error(`[${name}] Failed:`, error)
      if (context?.previousState) {
        rollback(context.previousState)
        logger.info(`[${name}] Rolled back to previous state`)
      }
    },

    onSettled: (_data: TData | undefined, _error: Error | null, variables: TVariables) => {
      queryClient.invalidateQueries({ queryKey: getQueryKey(variables) })
    },
  }
}

export function generateTempId(prefix: string): string {
  return `${prefix}-${Date.now()}`
}
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: sim-main/apps/sim/hooks/selectors/helpers.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SelectorHelpers')

interface FetchJsonOptions extends RequestInit {
  searchParams?: Record<string, string | number | undefined | null>
}

export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}): Promise<T> {
  const { searchParams, headers, ...rest } = options
  let finalUrl = url
  if (searchParams) {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      params.set(key, String(value))
    })
    const qs = params.toString()
    if (qs) {
      finalUrl = `${url}${url.includes('?') ? '&' : '?'}${qs}`
    }
  }

  const response = await fetch(finalUrl, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  })

  if (!response.ok) {
    let message = `Failed request ${response.status}`
    try {
      const err = await response.json()
      message = err.error || err.message || message
    } catch (error) {
      logger.warn('Failed to parse error response', { error })
    }
    throw new Error(message)
  }

  return response.json()
}

interface TokenResponse {
  accessToken?: string
}

export async function fetchOAuthToken(
  credentialId: string,
  workflowId?: string
): Promise<string | null> {
  if (!credentialId) return null
  const body = JSON.stringify({ credentialId, workflowId })
  const token = await fetchJson<TokenResponse>('/api/auth/oauth/token', {
    method: 'POST',
    body,
  })
  return token.accessToken ?? null
}
```

--------------------------------------------------------------------------------

````
