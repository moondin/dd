---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 530
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 530 of 933)

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

---[FILE: custom-tools.ts]---
Location: sim-main/apps/sim/hooks/queries/custom-tools.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLogger } from '@/lib/logs/console/logger'
import { useCustomToolsStore } from '@/stores/custom-tools/store'
import type { CustomToolDefinition, CustomToolSchema } from '@/stores/custom-tools/types'

const logger = createLogger('CustomToolsQueries')
const API_ENDPOINT = '/api/tools/custom'

/**
 * Query key factories for custom tools queries
 */
export const customToolsKeys = {
  all: ['customTools'] as const,
  lists: () => [...customToolsKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...customToolsKeys.lists(), workspaceId] as const,
  detail: (toolId: string) => [...customToolsKeys.all, 'detail', toolId] as const,
}

export type CustomTool = CustomToolDefinition

type ApiCustomTool = Partial<CustomToolDefinition> & {
  id: string
  title: string
  schema: Partial<CustomToolSchema> & {
    function?: Partial<CustomToolSchema['function']> & {
      parameters?: Partial<CustomToolSchema['function']['parameters']>
    }
  }
  code?: string
}

function normalizeCustomTool(tool: ApiCustomTool, workspaceId: string): CustomToolDefinition {
  const fallbackName = tool.schema.function?.name || tool.id
  const parameters = tool.schema.function?.parameters ?? {
    type: 'object',
    properties: {},
  }

  return {
    id: tool.id,
    title: tool.title,
    code: typeof tool.code === 'string' ? tool.code : '',
    workspaceId: tool.workspaceId ?? workspaceId ?? null,
    userId: tool.userId ?? null,
    createdAt:
      typeof tool.createdAt === 'string'
        ? tool.createdAt
        : tool.updatedAt && typeof tool.updatedAt === 'string'
          ? tool.updatedAt
          : new Date().toISOString(),
    updatedAt: typeof tool.updatedAt === 'string' ? tool.updatedAt : undefined,
    schema: {
      type: tool.schema.type ?? 'function',
      function: {
        name: fallbackName,
        description: tool.schema.function?.description,
        parameters: {
          type: parameters.type ?? 'object',
          properties: parameters.properties ?? {},
          required: parameters.required,
        },
      },
    },
  }
}

function syncCustomToolsToStore(tools: CustomToolDefinition[]) {
  useCustomToolsStore.getState().setTools(tools)
}

/**
 * Fetch custom tools for a workspace
 */
async function fetchCustomTools(workspaceId: string): Promise<CustomToolDefinition[]> {
  const response = await fetch(`${API_ENDPOINT}?workspaceId=${workspaceId}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Failed to fetch custom tools: ${response.statusText}`)
  }

  const { data } = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format')
  }

  const normalizedTools: CustomToolDefinition[] = []

  data.forEach((tool, index) => {
    if (!tool || typeof tool !== 'object') {
      logger.warn(`Skipping invalid tool at index ${index}: not an object`)
      return
    }
    if (!tool.id || typeof tool.id !== 'string') {
      logger.warn(`Skipping invalid tool at index ${index}: missing or invalid id`)
      return
    }
    if (!tool.title || typeof tool.title !== 'string') {
      logger.warn(`Skipping invalid tool at index ${index}: missing or invalid title`)
      return
    }
    if (!tool.schema || typeof tool.schema !== 'object') {
      logger.warn(`Skipping invalid tool at index ${index}: missing or invalid schema`)
      return
    }
    if (!tool.schema.function || typeof tool.schema.function !== 'object') {
      logger.warn(`Skipping invalid tool at index ${index}: missing function schema`)
      return
    }

    const apiTool: ApiCustomTool = {
      id: tool.id,
      title: tool.title,
      schema: tool.schema,
      code: typeof tool.code === 'string' ? tool.code : '',
      workspaceId: tool.workspaceId ?? null,
      userId: tool.userId ?? null,
      createdAt: tool.createdAt ?? undefined,
      updatedAt: tool.updatedAt ?? undefined,
    }

    try {
      normalizedTools.push(normalizeCustomTool(apiTool, workspaceId))
    } catch (error) {
      logger.warn(`Failed to normalize custom tool at index ${index}`, { error })
    }
  })

  return normalizedTools
}

/**
 * Hook to fetch custom tools
 */
export function useCustomTools(workspaceId: string) {
  const query = useQuery<CustomToolDefinition[]>({
    queryKey: customToolsKeys.list(workspaceId),
    queryFn: () => fetchCustomTools(workspaceId),
    enabled: !!workspaceId,
    staleTime: 60 * 1000, // 1 minute - tools don't change frequently
    placeholderData: keepPreviousData,
  })

  if (query.data) {
    syncCustomToolsToStore(query.data)
  }

  return query
}

/**
 * Create custom tool mutation
 */
interface CreateCustomToolParams {
  workspaceId: string
  tool: {
    title: string
    schema: CustomToolSchema
    code: string
  }
}

export function useCreateCustomTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, tool }: CreateCustomToolParams) => {
      logger.info(`Creating custom tool: ${tool.title} in workspace ${workspaceId}`)

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: [
            {
              title: tool.title,
              schema: tool.schema,
              code: tool.code,
            },
          ],
          workspaceId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create tool')
      }

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid API response: missing tools data')
      }

      logger.info(`Created custom tool: ${tool.title}`)
      return data.data
    },
    onSuccess: (_data, variables) => {
      // Invalidate tools list for the workspace
      queryClient.invalidateQueries({ queryKey: customToolsKeys.list(variables.workspaceId) })
    },
  })
}

/**
 * Update custom tool mutation
 */
interface UpdateCustomToolParams {
  workspaceId: string
  toolId: string
  updates: {
    title?: string
    schema?: CustomToolSchema
    code?: string
  }
}

export function useUpdateCustomTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, toolId, updates }: UpdateCustomToolParams) => {
      logger.info(`Updating custom tool: ${toolId} in workspace ${workspaceId}`)

      const currentTools = queryClient.getQueryData<CustomToolDefinition[]>(
        customToolsKeys.list(workspaceId)
      )
      const currentTool = currentTools?.find((t) => t.id === toolId)

      if (!currentTool) {
        throw new Error('Tool not found')
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: [
            {
              id: toolId,
              title: updates.title ?? currentTool.title,
              schema: updates.schema ?? currentTool.schema,
              code: updates.code ?? currentTool.code,
            },
          ],
          workspaceId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update tool')
      }

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid API response: missing tools data')
      }

      logger.info(`Updated custom tool: ${toolId}`)
      return data.data
    },
    onMutate: async ({ workspaceId, toolId, updates }) => {
      await queryClient.cancelQueries({ queryKey: customToolsKeys.list(workspaceId) })

      const previousTools = queryClient.getQueryData<CustomToolDefinition[]>(
        customToolsKeys.list(workspaceId)
      )

      if (previousTools) {
        queryClient.setQueryData<CustomToolDefinition[]>(
          customToolsKeys.list(workspaceId),
          previousTools.map((tool) =>
            tool.id === toolId
              ? {
                  ...tool,
                  title: updates.title ?? tool.title,
                  schema: updates.schema ?? tool.schema,
                  code: updates.code ?? tool.code,
                }
              : tool
          )
        )
      }

      return { previousTools }
    },
    onError: (_err, variables, context) => {
      if (context?.previousTools) {
        queryClient.setQueryData(customToolsKeys.list(variables.workspaceId), context.previousTools)
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: customToolsKeys.list(variables.workspaceId) })
    },
  })
}

/**
 * Delete custom tool mutation
 */
interface DeleteCustomToolParams {
  workspaceId: string | null
  toolId: string
}

export function useDeleteCustomTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, toolId }: DeleteCustomToolParams) => {
      logger.info(`Deleting custom tool: ${toolId}`)

      const url = workspaceId
        ? `${API_ENDPOINT}?id=${toolId}&workspaceId=${workspaceId}`
        : `${API_ENDPOINT}?id=${toolId}`

      const response = await fetch(url, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete tool')
      }

      logger.info(`Deleted custom tool: ${toolId}`)
      return data
    },
    onMutate: async ({ workspaceId, toolId }) => {
      if (!workspaceId) return

      await queryClient.cancelQueries({ queryKey: customToolsKeys.list(workspaceId) })

      const previousTools = queryClient.getQueryData<CustomToolDefinition[]>(
        customToolsKeys.list(workspaceId)
      )

      if (previousTools) {
        queryClient.setQueryData<CustomToolDefinition[]>(
          customToolsKeys.list(workspaceId),
          previousTools.filter((tool) => tool.id !== toolId)
        )
      }

      return { previousTools, workspaceId }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTools && context?.workspaceId) {
        queryClient.setQueryData(customToolsKeys.list(context.workspaceId), context.previousTools)
      }
    },
    onSettled: (_data, _error, variables) => {
      if (variables.workspaceId) {
        queryClient.invalidateQueries({ queryKey: customToolsKeys.list(variables.workspaceId) })
      }
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: environment.ts]---
Location: sim-main/apps/sim/hooks/queries/environment.ts
Signals: React

```typescript
import { useEffect } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { WorkspaceEnvironmentData } from '@/lib/environment/api'
import { fetchPersonalEnvironment, fetchWorkspaceEnvironment } from '@/lib/environment/api'
import { createLogger } from '@/lib/logs/console/logger'
import { API_ENDPOINTS } from '@/stores/constants'
import { useEnvironmentStore } from '@/stores/settings/environment/store'
import type { EnvironmentVariable } from '@/stores/settings/environment/types'

export type { WorkspaceEnvironmentData } from '@/lib/environment/api'
export type { EnvironmentVariable } from '@/stores/settings/environment/types'

const logger = createLogger('EnvironmentQueries')

/**
 * Query key factories for environment variable queries
 */
export const environmentKeys = {
  all: ['environment'] as const,
  personal: () => [...environmentKeys.all, 'personal'] as const,
  workspace: (workspaceId: string) => [...environmentKeys.all, 'workspace', workspaceId] as const,
}

/**
 * Environment Variable Types
 */
/**
 * Hook to fetch personal environment variables
 */
export function usePersonalEnvironment() {
  const setVariables = useEnvironmentStore((state) => state.setVariables)

  const query = useQuery({
    queryKey: environmentKeys.personal(),
    queryFn: fetchPersonalEnvironment,
    staleTime: 60 * 1000, // 1 minute
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (query.data) {
      setVariables(query.data)
    }
  }, [query.data, setVariables])

  return query
}

/**
 * Hook to fetch workspace environment variables
 */
export function useWorkspaceEnvironment<TData = WorkspaceEnvironmentData>(
  workspaceId: string,
  options?: { select?: (data: WorkspaceEnvironmentData) => TData }
) {
  return useQuery({
    queryKey: environmentKeys.workspace(workspaceId),
    queryFn: () => fetchWorkspaceEnvironment(workspaceId),
    enabled: !!workspaceId,
    staleTime: 60 * 1000, // 1 minute
    placeholderData: keepPreviousData,
    ...options,
  })
}

/**
 * Save personal environment variables mutation
 */
interface SavePersonalEnvironmentParams {
  variables: Record<string, string>
}

export function useSavePersonalEnvironment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ variables }: SavePersonalEnvironmentParams) => {
      const transformedVariables = Object.entries(variables).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: { key, value },
        }),
        {}
      )

      const response = await fetch(API_ENDPOINTS.ENVIRONMENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variables: Object.entries(transformedVariables).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: (value as EnvironmentVariable).value,
            }),
            {}
          ),
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save environment variables: ${response.statusText}`)
      }

      logger.info('Saved personal environment variables')
      return transformedVariables
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: environmentKeys.personal() })
      queryClient.invalidateQueries({ queryKey: environmentKeys.all })
    },
  })
}

/**
 * Upsert workspace environment variables mutation
 */
interface UpsertWorkspaceEnvironmentParams {
  workspaceId: string
  variables: Record<string, string>
}

export function useUpsertWorkspaceEnvironment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, variables }: UpsertWorkspaceEnvironmentParams) => {
      const response = await fetch(API_ENDPOINTS.WORKSPACE_ENVIRONMENT(workspaceId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variables }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update workspace environment: ${response.statusText}`)
      }

      logger.info(`Upserted workspace environment variables for workspace: ${workspaceId}`)
      return await response.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: environmentKeys.workspace(variables.workspaceId),
      })
      queryClient.invalidateQueries({ queryKey: environmentKeys.personal() })
    },
  })
}

/**
 * Remove workspace environment variables mutation
 */
interface RemoveWorkspaceEnvironmentParams {
  workspaceId: string
  keys: string[]
}

export function useRemoveWorkspaceEnvironment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, keys }: RemoveWorkspaceEnvironmentParams) => {
      const response = await fetch(API_ENDPOINTS.WORKSPACE_ENVIRONMENT(workspaceId), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys }),
      })

      if (!response.ok) {
        throw new Error(`Failed to remove workspace environment keys: ${response.statusText}`)
      }

      logger.info(`Removed ${keys.length} workspace environment keys for workspace: ${workspaceId}`)
      return await response.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: environmentKeys.workspace(variables.workspaceId),
      })
      queryClient.invalidateQueries({ queryKey: environmentKeys.personal() })
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: folders.ts]---
Location: sim-main/apps/sim/hooks/queries/folders.ts
Signals: React

```typescript
import { useEffect } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLogger } from '@/lib/logs/console/logger'
import {
  createOptimisticMutationHandlers,
  generateTempId,
} from '@/hooks/queries/utils/optimistic-mutation'
import { workflowKeys } from '@/hooks/queries/workflows'
import { useFolderStore, type WorkflowFolder } from '@/stores/folders/store'

const logger = createLogger('FolderQueries')

export const folderKeys = {
  all: ['folders'] as const,
  lists: () => [...folderKeys.all, 'list'] as const,
  list: (workspaceId: string | undefined) => [...folderKeys.lists(), workspaceId ?? ''] as const,
}

function mapFolder(folder: any): WorkflowFolder {
  return {
    id: folder.id,
    name: folder.name,
    userId: folder.userId,
    workspaceId: folder.workspaceId,
    parentId: folder.parentId,
    color: folder.color,
    isExpanded: folder.isExpanded,
    sortOrder: folder.sortOrder,
    createdAt: new Date(folder.createdAt),
    updatedAt: new Date(folder.updatedAt),
  }
}

async function fetchFolders(workspaceId: string): Promise<WorkflowFolder[]> {
  const response = await fetch(`/api/folders?workspaceId=${workspaceId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch folders')
  }

  const { folders }: { folders: any[] } = await response.json()
  return folders.map(mapFolder)
}

export function useFolders(workspaceId?: string) {
  const setFolders = useFolderStore((state) => state.setFolders)

  const query = useQuery({
    queryKey: folderKeys.list(workspaceId),
    queryFn: () => fetchFolders(workspaceId as string),
    enabled: Boolean(workspaceId),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  })

  useEffect(() => {
    if (query.data) {
      setFolders(query.data)
    }
  }, [query.data, setFolders])

  return query
}

interface CreateFolderVariables {
  workspaceId: string
  name: string
  parentId?: string
  color?: string
}

interface UpdateFolderVariables {
  workspaceId: string
  id: string
  updates: Partial<Pick<WorkflowFolder, 'name' | 'parentId' | 'color' | 'sortOrder'>>
}

interface DeleteFolderVariables {
  workspaceId: string
  id: string
}

interface DuplicateFolderVariables {
  workspaceId: string
  id: string
  name: string
  parentId?: string | null
  color?: string
}

/**
 * Creates optimistic mutation handlers for folder operations
 */
function createFolderMutationHandlers<TVariables extends { workspaceId: string }>(
  queryClient: ReturnType<typeof useQueryClient>,
  name: string,
  createOptimisticFolder: (
    variables: TVariables,
    tempId: string,
    previousFolders: Record<string, WorkflowFolder>
  ) => WorkflowFolder
) {
  return createOptimisticMutationHandlers<WorkflowFolder, TVariables, WorkflowFolder>(queryClient, {
    name,
    getQueryKey: (variables) => folderKeys.list(variables.workspaceId),
    getSnapshot: () => ({ ...useFolderStore.getState().folders }),
    generateTempId: () => generateTempId('temp-folder'),
    createOptimisticItem: (variables, tempId) => {
      const previousFolders = useFolderStore.getState().folders
      return createOptimisticFolder(variables, tempId, previousFolders)
    },
    applyOptimisticUpdate: (tempId, item) => {
      useFolderStore.setState((state) => ({
        folders: { ...state.folders, [tempId]: item },
      }))
    },
    replaceOptimisticEntry: (tempId, data) => {
      useFolderStore.setState((state) => {
        const { [tempId]: _, ...remainingFolders } = state.folders
        return {
          folders: {
            ...remainingFolders,
            [data.id]: data,
          },
        }
      })
    },
    rollback: (snapshot) => {
      useFolderStore.setState({ folders: snapshot })
    },
  })
}

/**
 * Calculates the next sort order for a folder in a given parent
 */
function getNextSortOrder(
  folders: Record<string, WorkflowFolder>,
  workspaceId: string,
  parentId: string | null | undefined
): number {
  const siblingFolders = Object.values(folders).filter(
    (f) => f.workspaceId === workspaceId && f.parentId === (parentId || null)
  )
  return siblingFolders.reduce((max, f) => Math.max(max, f.sortOrder), -1) + 1
}

export function useCreateFolder() {
  const queryClient = useQueryClient()

  const handlers = createFolderMutationHandlers<CreateFolderVariables>(
    queryClient,
    'CreateFolder',
    (variables, tempId, previousFolders) => ({
      id: tempId,
      name: variables.name,
      userId: '',
      workspaceId: variables.workspaceId,
      parentId: variables.parentId || null,
      color: variables.color || '#808080',
      isExpanded: false,
      sortOrder: getNextSortOrder(previousFolders, variables.workspaceId, variables.parentId),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  )

  return useMutation({
    mutationFn: async ({ workspaceId, ...payload }: CreateFolderVariables) => {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, workspaceId }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to create folder')
      }

      const { folder } = await response.json()
      return mapFolder(folder)
    },
    ...handlers,
  })
}

export function useUpdateFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, id, updates }: UpdateFolderVariables) => {
      const response = await fetch(`/api/folders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to update folder')
      }

      const { folder } = await response.json()
      return mapFolder(folder)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.list(variables.workspaceId) })
    },
  })
}

export function useDeleteFolderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId: _workspaceId, id }: DeleteFolderVariables) => {
      const response = await fetch(`/api/folders/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to delete folder')
      }

      return response.json()
    },
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.list(variables.workspaceId) })
      queryClient.invalidateQueries({ queryKey: workflowKeys.list(variables.workspaceId) })
    },
  })
}

export function useDuplicateFolderMutation() {
  const queryClient = useQueryClient()

  const handlers = createFolderMutationHandlers<DuplicateFolderVariables>(
    queryClient,
    'DuplicateFolder',
    (variables, tempId, previousFolders) => {
      // Get source folder info if available
      const sourceFolder = previousFolders[variables.id]
      return {
        id: tempId,
        name: variables.name,
        userId: sourceFolder?.userId || '',
        workspaceId: variables.workspaceId,
        parentId: variables.parentId ?? sourceFolder?.parentId ?? null,
        color: variables.color || sourceFolder?.color || '#808080',
        isExpanded: false,
        sortOrder: getNextSortOrder(previousFolders, variables.workspaceId, variables.parentId),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
  )

  return useMutation({
    mutationFn: async ({
      id,
      workspaceId,
      name,
      parentId,
      color,
    }: DuplicateFolderVariables): Promise<WorkflowFolder> => {
      const response = await fetch(`/api/folders/${id}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          name,
          parentId: parentId ?? null,
          color,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to duplicate folder')
      }

      const data = await response.json()
      return mapFolder(data.folder || data)
    },
    ...handlers,
    onSettled: (_data, _error, variables) => {
      // Invalidate both folders and workflows (duplicated folder may contain workflows)
      queryClient.invalidateQueries({ queryKey: folderKeys.list(variables.workspaceId) })
      queryClient.invalidateQueries({ queryKey: workflowKeys.list(variables.workspaceId) })
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: general-settings.ts]---
Location: sim-main/apps/sim/hooks/queries/general-settings.ts
Signals: React

```typescript
import { useEffect } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { syncThemeToNextThemes } from '@/lib/core/utils/theme'
import { createLogger } from '@/lib/logs/console/logger'
import { useGeneralStore } from '@/stores/settings/general/store'

const logger = createLogger('GeneralSettingsQuery')

/**
 * Query key factories for general settings
 */
export const generalSettingsKeys = {
  all: ['generalSettings'] as const,
  settings: () => [...generalSettingsKeys.all, 'settings'] as const,
}

/**
 * General settings type
 */
export interface GeneralSettings {
  autoConnect: boolean
  showTrainingControls: boolean
  superUserModeEnabled: boolean
  theme: 'light' | 'dark' | 'system'
  telemetryEnabled: boolean
  billingUsageNotificationsEnabled: boolean
  errorNotificationsEnabled: boolean
}

/**
 * Fetch general settings from API
 */
async function fetchGeneralSettings(): Promise<GeneralSettings> {
  const response = await fetch('/api/users/me/settings')

  if (!response.ok) {
    throw new Error('Failed to fetch general settings')
  }

  const { data } = await response.json()

  return {
    autoConnect: data.autoConnect ?? true,
    showTrainingControls: data.showTrainingControls ?? false,
    superUserModeEnabled: data.superUserModeEnabled ?? true,
    // theme: data.theme || 'system',
    // Force dark mode - light mode is temporarily disabled (TODO: Remove this)
    theme: 'dark' as const,
    telemetryEnabled: data.telemetryEnabled ?? true,
    billingUsageNotificationsEnabled: data.billingUsageNotificationsEnabled ?? true,
    errorNotificationsEnabled: data.errorNotificationsEnabled ?? true,
  }
}

/**
 * Sync React Query cache to Zustand store and next-themes.
 * This ensures the rest of the app (which uses Zustand) stays in sync.
 * @param settings - The general settings to sync
 */
function syncSettingsToZustand(settings: GeneralSettings) {
  const { setSettings } = useGeneralStore.getState()

  setSettings({
    isAutoConnectEnabled: settings.autoConnect,
    showTrainingControls: settings.showTrainingControls,
    superUserModeEnabled: settings.superUserModeEnabled,
    theme: settings.theme,
    telemetryEnabled: settings.telemetryEnabled,
    isBillingUsageNotificationsEnabled: settings.billingUsageNotificationsEnabled,
    isErrorNotificationsEnabled: settings.errorNotificationsEnabled,
  })

  syncThemeToNextThemes(settings.theme)
}

/**
 * Hook to fetch general settings.
 * Also syncs to Zustand store to keep the rest of the app in sync.
 */
export function useGeneralSettings() {
  const query = useQuery({
    queryKey: generalSettingsKeys.settings(),
    queryFn: fetchGeneralSettings,
    staleTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (query.data) {
      syncSettingsToZustand(query.data)
    }
  }, [query.data])

  return query
}

/**
 * Update general settings mutation
 */
interface UpdateSettingParams {
  key: keyof GeneralSettings
  value: any
}

export function useUpdateGeneralSetting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ key, value }: UpdateSettingParams) => {
      const response = await fetch('/api/users/me/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update setting: ${key}`)
      }

      return response.json()
    },
    onMutate: async ({ key, value }) => {
      await queryClient.cancelQueries({ queryKey: generalSettingsKeys.settings() })

      const previousSettings = queryClient.getQueryData<GeneralSettings>(
        generalSettingsKeys.settings()
      )

      if (previousSettings) {
        const newSettings = {
          ...previousSettings,
          [key]: value,
        }
        queryClient.setQueryData<GeneralSettings>(generalSettingsKeys.settings(), newSettings)

        syncSettingsToZustand(newSettings)
      }

      return { previousSettings }
    },
    onError: (err, _variables, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(generalSettingsKeys.settings(), context.previousSettings)
        syncSettingsToZustand(context.previousSettings)
      }
      logger.error('Failed to update setting:', err)
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: generalSettingsKeys.settings() })
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: knowledge.ts]---
Location: sim-main/apps/sim/hooks/queries/knowledge.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLogger } from '@/lib/logs/console/logger'
import type {
  ChunkData,
  ChunksPagination,
  DocumentData,
  DocumentsPagination,
  KnowledgeBaseData,
} from '@/stores/knowledge/store'

const logger = createLogger('KnowledgeQueries')

export const knowledgeKeys = {
  all: ['knowledge'] as const,
  list: (workspaceId?: string) => [...knowledgeKeys.all, 'list', workspaceId ?? 'all'] as const,
  detail: (knowledgeBaseId?: string) =>
    [...knowledgeKeys.all, 'detail', knowledgeBaseId ?? ''] as const,
  documents: (knowledgeBaseId: string, paramsKey: string) =>
    [...knowledgeKeys.detail(knowledgeBaseId), 'documents', paramsKey] as const,
  chunks: (knowledgeBaseId: string, documentId: string, paramsKey: string) =>
    [
      ...knowledgeKeys.detail(knowledgeBaseId),
      'document',
      documentId,
      'chunks',
      paramsKey,
    ] as const,
}

export async function fetchKnowledgeBases(workspaceId?: string): Promise<KnowledgeBaseData[]> {
  const url = workspaceId ? `/api/knowledge?workspaceId=${workspaceId}` : '/api/knowledge'
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch knowledge bases: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  if (result?.success === false) {
    throw new Error(result.error || 'Failed to fetch knowledge bases')
  }

  return Array.isArray(result?.data) ? result.data : []
}

export async function fetchKnowledgeBase(knowledgeBaseId: string): Promise<KnowledgeBaseData> {
  const response = await fetch(`/api/knowledge/${knowledgeBaseId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch knowledge base: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  if (!result?.success || !result?.data) {
    throw new Error(result?.error || 'Failed to fetch knowledge base')
  }

  return result.data
}

export interface KnowledgeDocumentsParams {
  knowledgeBaseId: string
  search?: string
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: string
}

export interface KnowledgeDocumentsResponse {
  documents: DocumentData[]
  pagination: DocumentsPagination
}

export async function fetchKnowledgeDocuments({
  knowledgeBaseId,
  search,
  limit = 50,
  offset = 0,
  sortBy,
  sortOrder,
}: KnowledgeDocumentsParams): Promise<KnowledgeDocumentsResponse> {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (sortBy) params.set('sortBy', sortBy)
  if (sortOrder) params.set('sortOrder', sortOrder)
  params.set('limit', limit.toString())
  params.set('offset', offset.toString())

  const url = `/api/knowledge/${knowledgeBaseId}/documents${params.toString() ? `?${params.toString()}` : ''}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  if (!result?.success) {
    throw new Error(result?.error || 'Failed to fetch documents')
  }

  const documents: DocumentData[] = result.data?.documents ?? result.data ?? []
  const pagination: DocumentsPagination = result.data?.pagination ??
    result.pagination ?? {
      total: documents.length,
      limit,
      offset,
      hasMore: false,
    }

  return {
    documents,
    pagination: {
      total: pagination.total ?? documents.length,
      limit: pagination.limit ?? limit,
      offset: pagination.offset ?? offset,
      hasMore: Boolean(pagination.hasMore),
    },
  }
}

export interface KnowledgeChunksParams {
  knowledgeBaseId: string
  documentId: string
  search?: string
  limit?: number
  offset?: number
}

export interface KnowledgeChunksResponse {
  chunks: ChunkData[]
  pagination: ChunksPagination
}

export async function fetchKnowledgeChunks({
  knowledgeBaseId,
  documentId,
  search,
  limit = 50,
  offset = 0,
}: KnowledgeChunksParams): Promise<KnowledgeChunksResponse> {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (limit) params.set('limit', limit.toString())
  if (offset) params.set('offset', offset.toString())

  const response = await fetch(
    `/api/knowledge/${knowledgeBaseId}/documents/${documentId}/chunks${params.toString() ? `?${params.toString()}` : ''}`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch chunks: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  if (!result?.success) {
    throw new Error(result?.error || 'Failed to fetch chunks')
  }

  const chunks: ChunkData[] = result.data ?? []
  const pagination: ChunksPagination = {
    total: result.pagination?.total ?? chunks.length,
    limit: result.pagination?.limit ?? limit,
    offset: result.pagination?.offset ?? offset,
    hasMore: Boolean(result.pagination?.hasMore),
  }

  return { chunks, pagination }
}

export function useKnowledgeBasesQuery(
  workspaceId?: string,
  options?: {
    enabled?: boolean
  }
) {
  return useQuery({
    queryKey: knowledgeKeys.list(workspaceId),
    queryFn: () => fetchKnowledgeBases(workspaceId),
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

export function useKnowledgeBaseQuery(knowledgeBaseId?: string) {
  return useQuery({
    queryKey: knowledgeKeys.detail(knowledgeBaseId),
    queryFn: () => fetchKnowledgeBase(knowledgeBaseId as string),
    enabled: Boolean(knowledgeBaseId),
    staleTime: 60 * 1000,
  })
}

export const serializeDocumentParams = (params: KnowledgeDocumentsParams) =>
  JSON.stringify({
    search: params.search ?? '',
    limit: params.limit ?? 50,
    offset: params.offset ?? 0,
    sortBy: params.sortBy ?? '',
    sortOrder: params.sortOrder ?? '',
  })

export function useKnowledgeDocumentsQuery(
  params: KnowledgeDocumentsParams,
  options?: {
    enabled?: boolean
  }
) {
  const paramsKey = serializeDocumentParams(params)
  return useQuery({
    queryKey: knowledgeKeys.documents(params.knowledgeBaseId, paramsKey),
    queryFn: () => fetchKnowledgeDocuments(params),
    enabled: (options?.enabled ?? true) && Boolean(params.knowledgeBaseId),
    placeholderData: keepPreviousData,
  })
}

export const serializeChunkParams = (params: KnowledgeChunksParams) =>
  JSON.stringify({
    search: params.search ?? '',
    limit: params.limit ?? 50,
    offset: params.offset ?? 0,
  })

export function useKnowledgeChunksQuery(
  params: KnowledgeChunksParams,
  options?: {
    enabled?: boolean
  }
) {
  const paramsKey = serializeChunkParams(params)
  return useQuery({
    queryKey: knowledgeKeys.chunks(params.knowledgeBaseId, params.documentId, paramsKey),
    queryFn: () => fetchKnowledgeChunks(params),
    enabled: (options?.enabled ?? true) && Boolean(params.knowledgeBaseId && params.documentId),
    placeholderData: keepPreviousData,
  })
}

interface UpdateDocumentPayload {
  knowledgeBaseId: string
  documentId: string
  updates: Partial<DocumentData>
}

export function useMutateKnowledgeDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ knowledgeBaseId, documentId, updates }: UpdateDocumentPayload) => {
      const response = await fetch(`/api/knowledge/${knowledgeBaseId}/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to update document')
      }

      const result = await response.json()
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to update document')
      }

      return result
    },
    onMutate: async ({ knowledgeBaseId, documentId, updates }) => {
      await queryClient.cancelQueries({ queryKey: knowledgeKeys.detail(knowledgeBaseId) })

      const documentQueries = queryClient
        .getQueriesData<KnowledgeDocumentsResponse>({
          queryKey: knowledgeKeys.detail(knowledgeBaseId),
        })
        .filter(([key]) => Array.isArray(key) && key.includes('documents'))

      documentQueries.forEach(([key, data]) => {
        if (!data) return
        queryClient.setQueryData(key, {
          ...data,
          documents: data.documents.map((doc) =>
            doc.id === documentId ? { ...doc, ...updates } : doc
          ),
        })
      })
    },
    onError: (error) => {
      logger.error('Failed to mutate document', error)
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.detail(variables.knowledgeBaseId) })
    },
  })
}
```

--------------------------------------------------------------------------------

````
