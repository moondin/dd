---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 531
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 531 of 933)

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

---[FILE: logs.ts]---
Location: sim-main/apps/sim/hooks/queries/logs.ts

```typescript
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { parseQuery, queryToApiParams } from '@/lib/logs/query-parser'
import type { LogsResponse, WorkflowLog } from '@/stores/logs/filters/types'

export const logKeys = {
  all: ['logs'] as const,
  lists: () => [...logKeys.all, 'list'] as const,
  list: (workspaceId: string | undefined, filters: Omit<LogFilters, 'page'>) =>
    [...logKeys.lists(), workspaceId ?? '', filters] as const,
  details: () => [...logKeys.all, 'detail'] as const,
  detail: (logId: string | undefined) => [...logKeys.details(), logId ?? ''] as const,
  metrics: () => [...logKeys.all, 'metrics'] as const,
  executions: (workspaceId: string | undefined, filters: Record<string, any>) =>
    [...logKeys.metrics(), 'executions', workspaceId ?? '', filters] as const,
  workflowLogs: (
    workspaceId: string | undefined,
    workflowId: string | undefined,
    filters: Record<string, any>
  ) => [...logKeys.all, 'workflow-logs', workspaceId ?? '', workflowId ?? '', filters] as const,
  globalLogs: (workspaceId: string | undefined, filters: Record<string, any>) =>
    [...logKeys.all, 'global-logs', workspaceId ?? '', filters] as const,
}

interface LogFilters {
  timeRange: string
  level: string
  workflowIds: string[]
  folderIds: string[]
  triggers: string[]
  searchQuery: string
  limit: number
}

async function fetchLogsPage(
  workspaceId: string,
  filters: LogFilters,
  page: number
): Promise<{ logs: WorkflowLog[]; hasMore: boolean; nextPage: number | undefined }> {
  const queryParams = buildQueryParams(workspaceId, filters, page)
  const response = await fetch(`/api/logs?${queryParams}`)

  if (!response.ok) {
    throw new Error('Failed to fetch logs')
  }

  const apiData: LogsResponse = await response.json()
  const hasMore = apiData.data.length === filters.limit && apiData.page < apiData.totalPages

  return {
    logs: apiData.data || [],
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  }
}

async function fetchLogDetail(logId: string): Promise<WorkflowLog> {
  const response = await fetch(`/api/logs/${logId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch log details')
  }

  const { data } = await response.json()
  return data
}

function buildQueryParams(workspaceId: string, filters: LogFilters, page: number): string {
  const params = new URLSearchParams()

  params.set('workspaceId', workspaceId)
  params.set('limit', filters.limit.toString())
  params.set('offset', ((page - 1) * filters.limit).toString())

  if (filters.level !== 'all') {
    params.set('level', filters.level)
  }

  if (filters.triggers.length > 0) {
    params.set('triggers', filters.triggers.join(','))
  }

  if (filters.workflowIds.length > 0) {
    params.set('workflowIds', filters.workflowIds.join(','))
  }

  if (filters.folderIds.length > 0) {
    params.set('folderIds', filters.folderIds.join(','))
  }

  if (filters.timeRange !== 'All time') {
    const now = new Date()
    let startDate: Date

    switch (filters.timeRange) {
      case 'Past 30 minutes':
        startDate = new Date(now.getTime() - 30 * 60 * 1000)
        break
      case 'Past hour':
        startDate = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case 'Past 6 hours':
        startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000)
        break
      case 'Past 12 hours':
        startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000)
        break
      case 'Past 24 hours':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'Past 3 days':
        startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
        break
      case 'Past 7 days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'Past 14 days':
        startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        break
      case 'Past 30 days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0)
    }

    params.set('startDate', startDate.toISOString())
  }

  if (filters.searchQuery.trim()) {
    const parsedQuery = parseQuery(filters.searchQuery.trim())
    const searchParams = queryToApiParams(parsedQuery)

    for (const [key, value] of Object.entries(searchParams)) {
      params.set(key, value)
    }
  }

  return params.toString()
}

interface UseLogsListOptions {
  enabled?: boolean
  refetchInterval?: number | false
}

export function useLogsList(
  workspaceId: string | undefined,
  filters: LogFilters,
  options?: UseLogsListOptions
) {
  return useInfiniteQuery({
    queryKey: logKeys.list(workspaceId, filters),
    queryFn: ({ pageParam }) => fetchLogsPage(workspaceId as string, filters, pageParam),
    enabled: Boolean(workspaceId) && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval ?? false,
    staleTime: 0, // Always consider stale for real-time logs
    placeholderData: keepPreviousData, // Keep showing old data while fetching new data
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}

export function useLogDetail(logId: string | undefined) {
  return useQuery({
    queryKey: logKeys.detail(logId),
    queryFn: () => fetchLogDetail(logId as string),
    enabled: Boolean(logId),
    staleTime: 30 * 1000, // Details can be slightly stale (30 seconds)
    placeholderData: keepPreviousData,
  })
}

interface WorkflowSegment {
  timestamp: string
  hasExecutions: boolean
  totalExecutions: number
  successfulExecutions: number
  successRate: number
  avgDurationMs?: number
  p50Ms?: number
  p90Ms?: number
  p99Ms?: number
}

interface WorkflowExecution {
  workflowId: string
  workflowName: string
  segments: WorkflowSegment[]
  overallSuccessRate: number
}

interface AggregateSegment {
  timestamp: string
  totalExecutions: number
  successfulExecutions: number
  avgDurationMs?: number
}

interface ExecutionsMetricsResponse {
  workflows: WorkflowExecution[]
  aggregateSegments: AggregateSegment[]
}

interface DashboardMetricsFilters {
  workspaceId: string
  segments: number
  startTime: string
  endTime: string
  workflowIds?: string[]
  folderIds?: string[]
  triggers?: string[]
  level?: string
}

async function fetchExecutionsMetrics(
  filters: DashboardMetricsFilters
): Promise<ExecutionsMetricsResponse> {
  const params = new URLSearchParams({
    segments: String(filters.segments),
    startTime: filters.startTime,
    endTime: filters.endTime,
  })

  if (filters.workflowIds && filters.workflowIds.length > 0) {
    params.set('workflowIds', filters.workflowIds.join(','))
  }

  if (filters.folderIds && filters.folderIds.length > 0) {
    params.set('folderIds', filters.folderIds.join(','))
  }

  if (filters.triggers && filters.triggers.length > 0) {
    params.set('triggers', filters.triggers.join(','))
  }

  if (filters.level && filters.level !== 'all') {
    params.set('level', filters.level)
  }

  const response = await fetch(
    `/api/workspaces/${filters.workspaceId}/metrics/executions?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch execution metrics')
  }

  const data = await response.json()

  const workflows: WorkflowExecution[] = (data.workflows || []).map((wf: any) => {
    const segments = (wf.segments || []).map((s: any) => {
      const total = s.totalExecutions || 0
      const success = s.successfulExecutions || 0
      const hasExecutions = total > 0
      const successRate = hasExecutions ? (success / total) * 100 : 100
      return {
        timestamp: s.timestamp,
        hasExecutions,
        totalExecutions: total,
        successfulExecutions: success,
        successRate,
        avgDurationMs: typeof s.avgDurationMs === 'number' ? s.avgDurationMs : 0,
        p50Ms: typeof s.p50Ms === 'number' ? s.p50Ms : 0,
        p90Ms: typeof s.p90Ms === 'number' ? s.p90Ms : 0,
        p99Ms: typeof s.p99Ms === 'number' ? s.p99Ms : 0,
      }
    })

    const totals = segments.reduce(
      (acc: { total: number; success: number }, seg: WorkflowSegment) => {
        acc.total += seg.totalExecutions
        acc.success += seg.successfulExecutions
        return acc
      },
      { total: 0, success: 0 }
    )

    const overallSuccessRate = totals.total > 0 ? (totals.success / totals.total) * 100 : 100

    return {
      workflowId: wf.workflowId,
      workflowName: wf.workflowName,
      segments,
      overallSuccessRate,
    }
  })

  const sortedWorkflows = workflows.sort((a, b) => {
    const errA = a.overallSuccessRate < 100 ? 1 - a.overallSuccessRate / 100 : 0
    const errB = b.overallSuccessRate < 100 ? 1 - b.overallSuccessRate / 100 : 0
    return errB - errA
  })

  const segmentCount = filters.segments
  const startTime = new Date(filters.startTime)
  const endTime = new Date(filters.endTime)

  const aggregateSegments: AggregateSegment[] = Array.from({ length: segmentCount }, (_, i) => {
    const base = startTime.getTime()
    const ts = new Date(base + Math.floor((i * (endTime.getTime() - base)) / segmentCount))
    return {
      timestamp: ts.toISOString(),
      totalExecutions: 0,
      successfulExecutions: 0,
      avgDurationMs: 0,
    }
  })

  const weightedDurationSums: number[] = Array(segmentCount).fill(0)
  const executionCounts: number[] = Array(segmentCount).fill(0)

  for (const wf of data.workflows as any[]) {
    wf.segments.forEach((s: any, i: number) => {
      const index = Math.min(i, segmentCount - 1)
      const execCount = s.totalExecutions || 0

      aggregateSegments[index].totalExecutions += execCount
      aggregateSegments[index].successfulExecutions += s.successfulExecutions || 0

      if (typeof s.avgDurationMs === 'number' && s.avgDurationMs > 0 && execCount > 0) {
        weightedDurationSums[index] += s.avgDurationMs * execCount
        executionCounts[index] += execCount
      }
    })
  }

  aggregateSegments.forEach((seg, i) => {
    if (executionCounts[i] > 0) {
      seg.avgDurationMs = weightedDurationSums[i] / executionCounts[i]
    } else {
      seg.avgDurationMs = 0
    }
  })

  return {
    workflows: sortedWorkflows,
    aggregateSegments,
  }
}

interface UseExecutionsMetricsOptions {
  enabled?: boolean
  refetchInterval?: number | false
}

export function useExecutionsMetrics(
  filters: DashboardMetricsFilters,
  options?: UseExecutionsMetricsOptions
) {
  return useQuery({
    queryKey: logKeys.executions(filters.workspaceId, filters),
    queryFn: () => fetchExecutionsMetrics(filters),
    enabled: Boolean(filters.workspaceId) && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval ?? false,
    staleTime: 10 * 1000, // Metrics can be slightly stale (10 seconds)
    placeholderData: keepPreviousData,
  })
}

interface DashboardLogsFilters {
  workspaceId: string
  startDate: string
  endDate: string
  workflowIds?: string[]
  folderIds?: string[]
  triggers?: string[]
  level?: string
  searchQuery?: string
  limit: number
}

interface DashboardLogsPage {
  logs: any[] // Will be mapped by the consumer
  hasMore: boolean
  nextPage: number | undefined
}

async function fetchDashboardLogsPage(
  filters: DashboardLogsFilters,
  page: number,
  workflowId?: string
): Promise<DashboardLogsPage> {
  const params = new URLSearchParams({
    limit: filters.limit.toString(),
    offset: ((page - 1) * filters.limit).toString(),
    workspaceId: filters.workspaceId,
    startDate: filters.startDate,
    endDate: filters.endDate,
    order: 'desc',
    details: 'full',
  })

  if (workflowId) {
    params.set('workflowIds', workflowId)
  } else if (filters.workflowIds && filters.workflowIds.length > 0) {
    params.set('workflowIds', filters.workflowIds.join(','))
  }

  if (filters.folderIds && filters.folderIds.length > 0) {
    params.set('folderIds', filters.folderIds.join(','))
  }

  if (filters.triggers && filters.triggers.length > 0) {
    params.set('triggers', filters.triggers.join(','))
  }

  if (filters.level && filters.level !== 'all') {
    params.set('level', filters.level)
  }

  if (filters.searchQuery?.trim()) {
    const parsed = parseQuery(filters.searchQuery)
    const extraParams = queryToApiParams(parsed)
    Object.entries(extraParams).forEach(([key, value]) => {
      params.set(key, value)
    })
  }

  const response = await fetch(`/api/logs?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard logs')
  }

  const data = await response.json()
  const logs = data.data || []
  const hasMore = logs.length === filters.limit

  return {
    logs,
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  }
}

interface UseDashboardLogsOptions {
  enabled?: boolean
}

export function useGlobalDashboardLogs(
  filters: DashboardLogsFilters,
  options?: UseDashboardLogsOptions
) {
  return useInfiniteQuery({
    queryKey: logKeys.globalLogs(filters.workspaceId, filters),
    queryFn: ({ pageParam }) => fetchDashboardLogsPage(filters, pageParam),
    enabled: Boolean(filters.workspaceId) && (options?.enabled ?? true),
    staleTime: 10 * 1000, // Slightly stale (10 seconds)
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}

export function useWorkflowDashboardLogs(
  workflowId: string | undefined,
  filters: DashboardLogsFilters,
  options?: UseDashboardLogsOptions
) {
  return useInfiniteQuery({
    queryKey: logKeys.workflowLogs(filters.workspaceId, workflowId, filters),
    queryFn: ({ pageParam }) => fetchDashboardLogsPage(filters, pageParam, workflowId),
    enabled: Boolean(filters.workspaceId) && Boolean(workflowId) && (options?.enabled ?? true),
    staleTime: 10 * 1000, // Slightly stale (10 seconds)
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: mcp.ts]---
Location: sim-main/apps/sim/hooks/queries/mcp.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLogger } from '@/lib/logs/console/logger'
import type { McpServerStatusConfig } from '@/lib/mcp/types'

const logger = createLogger('McpQueries')

export type { McpServerStatusConfig }

export const mcpKeys = {
  all: ['mcp'] as const,
  servers: (workspaceId: string) => [...mcpKeys.all, 'servers', workspaceId] as const,
  tools: (workspaceId: string) => [...mcpKeys.all, 'tools', workspaceId] as const,
}

export interface McpServer {
  id: string
  workspaceId: string
  name: string
  transport: 'streamable-http' | 'stdio'
  url?: string
  timeout: number
  headers?: Record<string, string>
  enabled: boolean
  connectionStatus?: 'connected' | 'disconnected' | 'error'
  lastError?: string | null
  statusConfig?: McpServerStatusConfig
  toolCount?: number
  lastToolsRefresh?: string
  lastConnected?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface McpServerConfig {
  name: string
  transport: 'streamable-http' | 'stdio'
  url?: string
  timeout: number
  headers?: Record<string, string>
  enabled: boolean
}

export interface McpTool {
  serverId: string
  serverName: string
  name: string
  description?: string
  inputSchema?: any
}

/**
 * Fetch MCP servers for a workspace
 */
async function fetchMcpServers(workspaceId: string): Promise<McpServer[]> {
  const response = await fetch(`/api/mcp/servers?workspaceId=${workspaceId}`)

  if (response.status === 404) {
    return []
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch MCP servers')
  }

  return data.data?.servers || []
}

/**
 * Hook to fetch MCP servers
 */
export function useMcpServers(workspaceId: string) {
  return useQuery({
    queryKey: mcpKeys.servers(workspaceId),
    queryFn: () => fetchMcpServers(workspaceId),
    enabled: !!workspaceId,
    retry: false, // Don't retry on 404 (no servers configured)
    staleTime: 60 * 1000, // 1 minute - servers don't change frequently
    placeholderData: keepPreviousData,
  })
}

/**
 * Fetch MCP tools for a workspace
 */
async function fetchMcpTools(workspaceId: string, forceRefresh = false): Promise<McpTool[]> {
  const params = new URLSearchParams({ workspaceId })
  if (forceRefresh) {
    params.set('refresh', 'true')
  }

  const response = await fetch(`/api/mcp/tools/discover?${params.toString()}`)

  // Treat 404 as "no tools available" - return empty array
  if (response.status === 404) {
    return []
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch MCP tools')
  }

  return data.data?.tools || []
}

/**
 * Hook to fetch MCP tools
 */
export function useMcpToolsQuery(workspaceId: string) {
  return useQuery({
    queryKey: mcpKeys.tools(workspaceId),
    queryFn: () => fetchMcpTools(workspaceId),
    enabled: !!workspaceId,
    retry: false, // Don't retry on 404 (no tools available)
    staleTime: 30 * 1000, // 30 seconds - tools can change when servers are added/removed
    placeholderData: keepPreviousData,
  })
}

/**
 * Create MCP server mutation
 */
interface CreateMcpServerParams {
  workspaceId: string
  config: McpServerConfig
}

export function useCreateMcpServer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, config }: CreateMcpServerParams) => {
      const serverData = {
        ...config,
        workspaceId,
      }

      const response = await fetch('/api/mcp/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serverData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create MCP server')
      }

      const serverId = data.data?.serverId
      const wasUpdated = data.data?.updated === true

      logger.info(
        wasUpdated
          ? `Updated existing MCP server: ${config.name} (ID: ${serverId})`
          : `Created MCP server: ${config.name} (ID: ${serverId})`
      )

      return {
        ...serverData,
        id: serverId,
        connectionStatus: 'connected' as const,
        serverId,
        updated: wasUpdated,
      }
    },
    onSuccess: async (data, variables) => {
      const freshTools = await fetchMcpTools(variables.workspaceId, true)

      const previousServers = queryClient.getQueryData<McpServer[]>(
        mcpKeys.servers(variables.workspaceId)
      )
      if (previousServers) {
        const newServer: McpServer = {
          id: data.id,
          workspaceId: variables.workspaceId,
          name: variables.config.name,
          transport: variables.config.transport,
          url: variables.config.url,
          timeout: variables.config.timeout || 30000,
          headers: variables.config.headers,
          enabled: variables.config.enabled,
          connectionStatus: 'connected',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const serverExists = previousServers.some((s) => s.id === data.id)
        queryClient.setQueryData<McpServer[]>(
          mcpKeys.servers(variables.workspaceId),
          serverExists
            ? previousServers.map((s) => (s.id === data.id ? { ...s, ...newServer } : s))
            : [...previousServers, newServer]
        )
      }

      queryClient.setQueryData(mcpKeys.tools(variables.workspaceId), freshTools)
      queryClient.invalidateQueries({ queryKey: mcpKeys.servers(variables.workspaceId) })
    },
  })
}

/**
 * Delete MCP server mutation
 */
interface DeleteMcpServerParams {
  workspaceId: string
  serverId: string
}

export function useDeleteMcpServer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, serverId }: DeleteMcpServerParams) => {
      const response = await fetch(
        `/api/mcp/servers?serverId=${serverId}&workspaceId=${workspaceId}`,
        {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete MCP server')
      }

      logger.info(`Deleted MCP server: ${serverId} from workspace: ${workspaceId}`)
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: mcpKeys.servers(variables.workspaceId) })
      queryClient.invalidateQueries({ queryKey: mcpKeys.tools(variables.workspaceId) })
    },
  })
}

/**
 * Update MCP server mutation
 */
interface UpdateMcpServerParams {
  workspaceId: string
  serverId: string
  updates: Partial<McpServerConfig & { enabled?: boolean }>
}

export function useUpdateMcpServer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, serverId, updates }: UpdateMcpServerParams) => {
      const response = await fetch(`/api/mcp/servers/${serverId}?workspaceId=${workspaceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update MCP server')
      }

      logger.info(`Updated MCP server: ${serverId} in workspace: ${workspaceId}`)
      return data.data?.server
    },
    onMutate: async ({ workspaceId, serverId, updates }) => {
      await queryClient.cancelQueries({ queryKey: mcpKeys.servers(workspaceId) })

      const previousServers = queryClient.getQueryData<McpServer[]>(mcpKeys.servers(workspaceId))

      if (previousServers) {
        queryClient.setQueryData<McpServer[]>(
          mcpKeys.servers(workspaceId),
          previousServers.map((server) =>
            server.id === serverId
              ? { ...server, ...updates, updatedAt: new Date().toISOString() }
              : server
          )
        )
      }

      return { previousServers }
    },
    onError: (_err, variables, context) => {
      if (context?.previousServers) {
        queryClient.setQueryData(mcpKeys.servers(variables.workspaceId), context.previousServers)
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: mcpKeys.servers(variables.workspaceId) })
      queryClient.invalidateQueries({ queryKey: mcpKeys.tools(variables.workspaceId) })
    },
  })
}

/**
 * Refresh MCP server mutation - re-discovers tools from the server
 */
interface RefreshMcpServerParams {
  workspaceId: string
  serverId: string
}

export interface RefreshMcpServerResult {
  status: 'connected' | 'disconnected' | 'error'
  toolCount: number
  lastConnected: string | null
  error: string | null
}

export function useRefreshMcpServer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      workspaceId,
      serverId,
    }: RefreshMcpServerParams): Promise<RefreshMcpServerResult> => {
      const response = await fetch(
        `/api/mcp/servers/${serverId}/refresh?workspaceId=${workspaceId}`,
        {
          method: 'POST',
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh MCP server')
      }

      logger.info(`Refreshed MCP server: ${serverId}`)
      return data.data
    },
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: mcpKeys.servers(variables.workspaceId) })
      const freshTools = await fetchMcpTools(variables.workspaceId, true)
      queryClient.setQueryData(mcpKeys.tools(variables.workspaceId), freshTools)
    },
  })
}

/**
 * Test MCP server connection
 */
export interface McpServerTestParams {
  name: string
  transport: 'streamable-http' | 'stdio'
  url?: string
  headers?: Record<string, string>
  timeout: number
  workspaceId: string
}

export interface McpServerTestResult {
  success: boolean
  error?: string
  tools?: Array<{ name: string; description?: string }>
}

export function useTestMcpServer() {
  return useMutation({
    mutationFn: async (params: McpServerTestParams): Promise<McpServerTestResult> => {
      try {
        const response = await fetch('/api/mcp/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        })

        const data = await response.json()

        if (!response.ok) {
          return {
            success: false,
            error: data.error || 'Failed to test connection',
          }
        }

        return {
          success: true,
          tools: data.tools || [],
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Connection test failed',
        }
      }
    },
  })
}

/**
 * Stored MCP tool from workflow state
 */
export interface StoredMcpTool {
  workflowId: string
  workflowName: string
  serverId: string
  serverUrl?: string
  toolName: string
  schema?: Record<string, unknown>
}

/**
 * Fetch stored MCP tools from all workflows in the workspace
 */
async function fetchStoredMcpTools(workspaceId: string): Promise<StoredMcpTool[]> {
  const response = await fetch(`/api/mcp/tools/stored?workspaceId=${workspaceId}`)

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to fetch stored MCP tools')
  }

  const data = await response.json()
  return data.data?.tools || []
}

/**
 * Hook to fetch stored MCP tools from all workflows
 */
export function useStoredMcpTools(workspaceId: string) {
  return useQuery({
    queryKey: [...mcpKeys.all, workspaceId, 'stored'],
    queryFn: () => fetchStoredMcpTools(workspaceId),
    enabled: !!workspaceId,
    staleTime: 60 * 1000, // 1 minute - workflows don't change frequently
  })
}
```

--------------------------------------------------------------------------------

---[FILE: notifications.ts]---
Location: sim-main/apps/sim/hooks/queries/notifications.ts

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('NotificationQueries')

/**
 * Query key factories for notification-related queries
 */
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (workspaceId: string | undefined) =>
    [...notificationKeys.lists(), workspaceId ?? ''] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (workspaceId: string, notificationId: string) =>
    [...notificationKeys.details(), workspaceId, notificationId] as const,
}

type NotificationType = 'webhook' | 'email' | 'slack'
type LogLevel = 'info' | 'error'
type TriggerType = 'api' | 'webhook' | 'schedule' | 'manual' | 'chat'

type AlertRuleType =
  | 'consecutive_failures'
  | 'failure_rate'
  | 'latency_threshold'
  | 'latency_spike'
  | 'cost_threshold'
  | 'no_activity'
  | 'error_count'

interface AlertConfig {
  rule: AlertRuleType
  consecutiveFailures?: number
  failureRatePercent?: number
  windowHours?: number
  durationThresholdMs?: number
  latencySpikePercent?: number
  costThresholdDollars?: number
  inactivityHours?: number
  errorCountThreshold?: number
}

interface WebhookConfig {
  url: string
  secret?: string
}

interface SlackConfig {
  channelId: string
  channelName: string
  accountId: string
}

export interface NotificationSubscription {
  id: string
  notificationType: NotificationType
  workflowIds: string[]
  allWorkflows: boolean
  levelFilter: LogLevel[]
  triggerFilter: TriggerType[]
  includeFinalOutput: boolean
  includeTraceSpans: boolean
  includeRateLimits: boolean
  includeUsageData: boolean
  webhookConfig?: WebhookConfig | null
  emailRecipients?: string[] | null
  slackConfig?: SlackConfig | null
  alertConfig?: AlertConfig | null
  active: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Fetch notifications for a workspace
 */
async function fetchNotifications(workspaceId: string): Promise<NotificationSubscription[]> {
  const response = await fetch(`/api/workspaces/${workspaceId}/notifications`)
  if (!response.ok) {
    throw new Error('Failed to fetch notifications')
  }
  const data = await response.json()
  return data.data || []
}

/**
 * Hook to fetch notifications for a workspace
 */
export function useNotifications(workspaceId?: string) {
  return useQuery({
    queryKey: notificationKeys.list(workspaceId),
    queryFn: () => fetchNotifications(workspaceId!),
    enabled: Boolean(workspaceId),
    staleTime: 30 * 1000,
  })
}

interface CreateNotificationParams {
  workspaceId: string
  data: {
    notificationType: NotificationType
    workflowIds: string[]
    allWorkflows: boolean
    levelFilter: LogLevel[]
    triggerFilter: TriggerType[]
    includeFinalOutput: boolean
    includeTraceSpans: boolean
    includeRateLimits: boolean
    includeUsageData: boolean
    alertConfig?: AlertConfig | null
    webhookConfig?: WebhookConfig
    emailRecipients?: string[]
    slackConfig?: SlackConfig
  }
}

/**
 * Hook to create a notification
 */
export function useCreateNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, data }: CreateNotificationParams) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to create notification')
      }
      return response.json()
    },
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list(workspaceId) })
    },
    onError: (error) => {
      logger.error('Failed to create notification', { error })
    },
  })
}

interface UpdateNotificationParams {
  workspaceId: string
  notificationId: string
  data: Partial<CreateNotificationParams['data']> & { active?: boolean }
}

/**
 * Hook to update a notification
 */
export function useUpdateNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, notificationId, data }: UpdateNotificationParams) => {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/notifications/${notificationId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      )
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to update notification')
      }
      return response.json()
    },
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list(workspaceId) })
    },
    onError: (error) => {
      logger.error('Failed to update notification', { error })
    },
  })
}

interface DeleteNotificationParams {
  workspaceId: string
  notificationId: string
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ workspaceId, notificationId }: DeleteNotificationParams) => {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/notifications/${notificationId}`,
        {
          method: 'DELETE',
        }
      )
      if (!response.ok) {
        throw new Error('Failed to delete notification')
      }
      return response.json()
    },
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list(workspaceId) })
    },
    onError: (error) => {
      logger.error('Failed to delete notification', { error })
    },
  })
}

interface TestNotificationParams {
  workspaceId: string
  notificationId: string
}

/**
 * Hook to test a notification
 */
export function useTestNotification() {
  return useMutation({
    mutationFn: async ({ workspaceId, notificationId }: TestNotificationParams) => {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/notifications/${notificationId}/test`,
        { method: 'POST' }
      )
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to send test notification')
      }
      return response.json()
    },
    onError: (error) => {
      logger.error('Failed to test notification', { error })
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: oauth-connections.ts]---
Location: sim-main/apps/sim/hooks/queries/oauth-connections.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/auth/auth-client'
import { createLogger } from '@/lib/logs/console/logger'
import { OAUTH_PROVIDERS, type OAuthServiceConfig } from '@/lib/oauth/oauth'

const logger = createLogger('OAuthConnectionsQuery')

/**
 * Query key factories for OAuth connections
 */
export const oauthConnectionsKeys = {
  all: ['oauthConnections'] as const,
  connections: () => [...oauthConnectionsKeys.all, 'connections'] as const,
}

/**
 * Service info type
 */
export interface ServiceInfo extends OAuthServiceConfig {
  isConnected: boolean
  lastConnected?: string
  accounts?: { id: string; name: string }[]
}

/**
 * Define available services from standardized OAuth providers
 */
function defineServices(): ServiceInfo[] {
  const servicesList: ServiceInfo[] = []

  Object.entries(OAUTH_PROVIDERS).forEach(([_providerKey, provider]) => {
    Object.values(provider.services).forEach((service) => {
      servicesList.push({
        ...service,
        isConnected: false,
        scopes: service.scopes || [],
      })
    })
  })

  return servicesList
}

/**
 * Fetch OAuth connections and merge with service definitions
 */
async function fetchOAuthConnections(): Promise<ServiceInfo[]> {
  try {
    const serviceDefinitions = defineServices()

    const response = await fetch('/api/auth/oauth/connections')

    if (response.status === 404) {
      return serviceDefinitions
    }

    if (!response.ok) {
      throw new Error('Failed to fetch OAuth connections')
    }

    const data = await response.json()
    const connections = data.connections || []

    const updatedServices = serviceDefinitions.map((service) => {
      const connection = connections.find((conn: any) => conn.provider === service.providerId)

      if (connection) {
        return {
          ...service,
          isConnected: connection.accounts?.length > 0,
          accounts: connection.accounts || [],
          lastConnected: connection.lastConnected,
        }
      }

      const connectionWithScopes = connections.find((conn: any) => {
        if (!conn.baseProvider || !service.providerId.startsWith(conn.baseProvider)) {
          return false
        }

        if (conn.scopes && service.scopes) {
          return service.scopes.every((scope) => conn.scopes.includes(scope))
        }

        return false
      })

      if (connectionWithScopes) {
        return {
          ...service,
          isConnected: connectionWithScopes.accounts?.length > 0,
          accounts: connectionWithScopes.accounts || [],
          lastConnected: connectionWithScopes.lastConnected,
        }
      }

      return service
    })

    return updatedServices
  } catch (error) {
    logger.error('Error fetching OAuth connections:', error)
    return defineServices()
  }
}

/**
 * Hook to fetch OAuth connections
 */
export function useOAuthConnections() {
  return useQuery({
    queryKey: oauthConnectionsKeys.connections(),
    queryFn: fetchOAuthConnections,
    staleTime: 30 * 1000, // 30 seconds - connections don't change often
    retry: false, // Don't retry on 404
    placeholderData: keepPreviousData, // Show cached data immediately
  })
}

/**
 * Connect OAuth service mutation
 */
interface ConnectServiceParams {
  providerId: string
  callbackURL: string
}

export function useConnectOAuthService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ providerId, callbackURL }: ConnectServiceParams) => {
      if (providerId === 'trello') {
        window.location.href = '/api/auth/trello/authorize'
        return { success: true }
      }

      // Shopify requires a custom OAuth flow with shop domain input
      if (providerId === 'shopify') {
        const returnUrl = encodeURIComponent(callbackURL)
        window.location.href = `/api/auth/shopify/authorize?returnUrl=${returnUrl}`
        return { success: true }
      }

      await client.oauth2.link({
        providerId,
        callbackURL,
      })

      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: oauthConnectionsKeys.connections() })
    },
    onError: (error) => {
      logger.error('OAuth connection error:', error)
    },
  })
}

/**
 * Disconnect OAuth service mutation
 */
interface DisconnectServiceParams {
  provider: string
  providerId: string
  serviceId: string
  accountId: string
}

export function useDisconnectOAuthService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ provider, providerId }: DisconnectServiceParams) => {
      const response = await fetch('/api/auth/oauth/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          providerId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect service')
      }

      return response.json()
    },
    onMutate: async ({ serviceId, accountId }) => {
      await queryClient.cancelQueries({ queryKey: oauthConnectionsKeys.connections() })

      const previousServices = queryClient.getQueryData<ServiceInfo[]>(
        oauthConnectionsKeys.connections()
      )

      if (previousServices) {
        queryClient.setQueryData<ServiceInfo[]>(
          oauthConnectionsKeys.connections(),
          previousServices.map((svc) => {
            if (svc.id === serviceId) {
              const updatedAccounts = svc.accounts?.filter((acc) => acc.id !== accountId) || []
              return {
                ...svc,
                accounts: updatedAccounts,
                isConnected: updatedAccounts.length > 0,
              }
            }
            return svc
          })
        )
      }

      return { previousServices }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData(oauthConnectionsKeys.connections(), context.previousServices)
      }
      logger.error('Failed to disconnect service')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: oauthConnectionsKeys.connections() })
    },
  })
}
```

--------------------------------------------------------------------------------

````
