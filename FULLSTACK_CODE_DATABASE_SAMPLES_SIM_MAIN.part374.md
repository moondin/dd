---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 374
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 374 of 933)

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

---[FILE: mcp.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/mcp/mcp.tsx
Signals: React, Next.js

```typescript
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useParams } from 'next/navigation'
import {
  Badge,
  Button,
  Input as EmcnInput,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/emcn'
import { Input } from '@/components/ui'
import { createLogger } from '@/lib/logs/console/logger'
import { getIssueBadgeLabel, getMcpToolIssue, type McpToolIssue } from '@/lib/mcp/tool-validation'
import { checkEnvVarTrigger } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/env-var-dropdown'
import {
  useCreateMcpServer,
  useDeleteMcpServer,
  useMcpServers,
  useMcpToolsQuery,
  useRefreshMcpServer,
  useStoredMcpTools,
} from '@/hooks/queries/mcp'
import { useMcpServerTest } from '@/hooks/use-mcp-server-test'
import type { InputFieldType, McpServerFormData, McpServerTestResult } from './components'
import {
  FormattedInput,
  FormField,
  formatTransportLabel,
  HeaderRow,
  McpServerSkeleton,
  ServerListItem,
} from './components'

interface McpTool {
  name: string
  description?: string
  serverId: string
}

interface McpServer {
  id: string
  name?: string
  transport?: string
  url?: string
  connectionStatus?: 'connected' | 'disconnected' | 'error'
  lastError?: string | null
  lastConnected?: string
}

const logger = createLogger('McpSettings')

const DEFAULT_FORM_DATA: McpServerFormData = {
  name: '',
  transport: 'streamable-http',
  url: '',
  timeout: 30000,
  headers: [{ key: '', value: '' }],
}

/**
 * Determines the label for the test connection button based on current state.
 */
function getTestButtonLabel(
  testResult: McpServerTestResult | null,
  isTestingConnection: boolean
): string {
  if (isTestingConnection) return 'Testing...'
  if (testResult?.success) return 'Connection success'
  if (testResult && !testResult.success) return 'No connection: retry'
  return 'Test Connection'
}

interface MCPProps {
  initialServerId?: string | null
}

/**
 * MCP Settings component for managing Model Context Protocol servers.
 * Handles server CRUD operations, connection testing, and environment variable integration.
 */
export function MCP({ initialServerId }: MCPProps) {
  const params = useParams()
  const workspaceId = params.workspaceId as string

  const {
    data: servers = [],
    isLoading: serversLoading,
    error: serversError,
  } = useMcpServers(workspaceId)
  const {
    data: mcpToolsData = [],
    error: toolsError,
    isLoading: toolsLoading,
    isFetching: toolsFetching,
  } = useMcpToolsQuery(workspaceId)
  const { data: storedTools = [] } = useStoredMcpTools(workspaceId)
  const createServerMutation = useCreateMcpServer()
  const deleteServerMutation = useDeleteMcpServer()
  const refreshServerMutation = useRefreshMcpServer()
  const { testResult, isTestingConnection, testConnection, clearTestResult } = useMcpServerTest()

  const urlInputRef = useRef<HTMLInputElement>(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<McpServerFormData>(DEFAULT_FORM_DATA)
  const [isAddingServer, setIsAddingServer] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [deletingServers, setDeletingServers] = useState<Set<string>>(new Set())

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [serverToDelete, setServerToDelete] = useState<{ id: string; name: string } | null>(null)

  const [selectedServerId, setSelectedServerId] = useState<string | null>(null)
  const [refreshingServers, setRefreshingServers] = useState<
    Record<string, 'refreshing' | 'refreshed'>
  >({})

  const [showEnvVars, setShowEnvVars] = useState(false)
  const [envSearchTerm, setEnvSearchTerm] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [activeInputField, setActiveInputField] = useState<InputFieldType | null>(null)
  const [activeHeaderIndex, setActiveHeaderIndex] = useState<number | null>(null)

  const [urlScrollLeft, setUrlScrollLeft] = useState(0)
  const [headerScrollLeft, setHeaderScrollLeft] = useState<Record<string, number>>({})

  // Auto-select server when initialServerId is provided
  useEffect(() => {
    if (initialServerId && servers.some((s) => s.id === initialServerId)) {
      setSelectedServerId(initialServerId)
    }
  }, [initialServerId, servers])

  /**
   * Resets environment variable dropdown state.
   */
  const resetEnvVarState = useCallback(() => {
    setShowEnvVars(false)
    setActiveInputField(null)
    setActiveHeaderIndex(null)
  }, [])

  /**
   * Resets the form to its default state.
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA)
    setShowAddForm(false)
    resetEnvVarState()
    clearTestResult()
  }, [clearTestResult, resetEnvVarState])

  /**
   * Updates a header field at the specified index.
   */
  const updateHeader = useCallback((index: number, field: 'key' | 'value', value: string) => {
    setFormData((prev) => {
      const newHeaders = [...(prev.headers || [])]
      if (newHeaders[index]) {
        newHeaders[index] = { ...newHeaders[index], [field]: value }
      }
      return { ...prev, headers: newHeaders }
    })
  }, [])

  /**
   * Handles environment variable selection and updates the appropriate field.
   */
  const handleEnvVarSelect = useCallback(
    (newValue: string) => {
      if (activeInputField === 'url') {
        setFormData((prev) => ({ ...prev, url: newValue }))
      } else if (activeHeaderIndex !== null) {
        const field = activeInputField === 'header-key' ? 'key' : 'value'
        const processedValue = field === 'key' ? newValue.replace(/[{}]/g, '') : newValue
        updateHeader(activeHeaderIndex, field, processedValue)
      }
      resetEnvVarState()
    },
    [activeInputField, activeHeaderIndex, updateHeader, resetEnvVarState]
  )

  /**
   * Handles input changes and manages environment variable dropdown visibility.
   */
  const handleInputChange = useCallback(
    (field: InputFieldType, value: string, headerIndex?: number) => {
      const input = document.activeElement as HTMLInputElement
      const pos = input?.selectionStart || 0

      setCursorPosition(pos)

      if (testResult) {
        clearTestResult()
      }

      const envVarTrigger = checkEnvVarTrigger(value, pos)
      setShowEnvVars(envVarTrigger.show)
      setEnvSearchTerm(envVarTrigger.show ? envVarTrigger.searchTerm : '')

      if (envVarTrigger.show) {
        setActiveInputField(field)
        setActiveHeaderIndex(headerIndex ?? null)
      } else {
        resetEnvVarState()
      }

      if (field === 'url') {
        setFormData((prev) => ({ ...prev, url: value }))
      } else if (headerIndex !== undefined) {
        const headerField = field === 'header-key' ? 'key' : 'value'
        updateHeader(headerIndex, headerField, value)
      }
    },
    [testResult, clearTestResult, updateHeader, resetEnvVarState]
  )

  /**
   * Converts headers array to Record format for API calls.
   * Filters out entries with empty keys.
   */
  const headersToRecord = useCallback(
    (headers: typeof formData.headers): Record<string, string> => {
      const record: Record<string, string> = {}
      for (const header of headers || []) {
        if (header.key.trim()) {
          record[header.key] = header.value
        }
      }
      return record
    },
    []
  )

  /**
   * Tests the connection to the MCP server with current form data.
   */
  const handleTestConnection = useCallback(async () => {
    if (!formData.name.trim() || !formData.url?.trim()) return

    await testConnection({
      name: formData.name,
      transport: formData.transport,
      url: formData.url,
      headers: headersToRecord(formData.headers),
      timeout: formData.timeout,
      workspaceId,
    })
  }, [formData, testConnection, workspaceId, headersToRecord])

  /**
   * Adds a new MCP server after validating and testing the connection.
   * Only creates the server if connection test succeeds.
   */
  const handleAddServer = useCallback(async () => {
    if (!formData.name.trim()) return

    setIsAddingServer(true)
    try {
      const headersRecord = headersToRecord(formData.headers)
      const serverConfig = {
        name: formData.name,
        transport: formData.transport,
        url: formData.url,
        headers: headersRecord,
        timeout: formData.timeout,
        workspaceId,
      }

      const connectionResult = await testConnection(serverConfig)

      if (!connectionResult.success) {
        logger.error('Connection test failed, server not added:', connectionResult.error)
        return
      }

      await createServerMutation.mutateAsync({
        workspaceId,
        config: {
          name: formData.name.trim(),
          transport: formData.transport,
          url: formData.url,
          timeout: formData.timeout || 30000,
          headers: headersRecord,
          enabled: true,
        },
      })

      logger.info(`Added MCP server: ${formData.name}`)
      resetForm()
    } catch (error) {
      logger.error('Failed to add MCP server:', error)
    } finally {
      setIsAddingServer(false)
    }
  }, [formData, testConnection, createServerMutation, workspaceId, headersToRecord, resetForm])

  /**
   * Opens the delete confirmation dialog for an MCP server.
   */
  const handleRemoveServer = useCallback((serverId: string, serverName: string) => {
    setServerToDelete({ id: serverId, name: serverName })
    setShowDeleteDialog(true)
  }, [])

  const confirmDeleteServer = useCallback(async () => {
    if (!serverToDelete) return

    setShowDeleteDialog(false)
    const { id: serverId, name: serverName } = serverToDelete
    setServerToDelete(null)

    setDeletingServers((prev) => new Set(prev).add(serverId))

    try {
      await deleteServerMutation.mutateAsync({ workspaceId, serverId })
      logger.info(`Removed MCP server: ${serverName}`)
    } catch (error) {
      logger.error('Failed to remove MCP server:', error)
    } finally {
      setDeletingServers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(serverId)
        return newSet
      })
    }
  }, [serverToDelete, deleteServerMutation, workspaceId])

  /**
   * Groups tools by their server ID for display.
   */
  const toolsByServer = useMemo(() => {
    return (mcpToolsData || []).reduce(
      (acc, tool) => {
        if (!tool?.serverId) return acc
        if (!acc[tool.serverId]) {
          acc[tool.serverId] = []
        }
        acc[tool.serverId].push(tool)
        return acc
      },
      {} as Record<string, typeof mcpToolsData>
    )
  }, [mcpToolsData])

  /**
   * Filters servers based on search term.
   */
  const filteredServers = useMemo(() => {
    return (servers || []).filter((server) =>
      server.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [servers, searchTerm])

  const handleNameChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, name: value }))
  }, [])

  const handleUrlScroll = useCallback((scrollLeft: number) => {
    setUrlScrollLeft(scrollLeft)
  }, [])

  const handleHeaderScroll = useCallback((key: string, scrollLeft: number) => {
    setHeaderScrollLeft((prev) => ({ ...prev, [key]: scrollLeft }))
  }, [])

  const handleAddHeader = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      headers: [...(prev.headers || []), { key: '', value: '' }],
    }))
  }, [])

  const handleRemoveHeader = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      headers: (prev.headers || []).filter((_, i) => i !== index),
    }))
  }, [])

  const handleCancelForm = useCallback(() => {
    setShowAddForm(false)
  }, [])

  /**
   * Opens the detail view for a specific server.
   */
  const handleViewDetails = useCallback((serverId: string) => {
    setSelectedServerId(serverId)
  }, [])

  /**
   * Closes the detail view and returns to the server list.
   */
  const handleBackToList = useCallback(() => {
    setSelectedServerId(null)
  }, [])

  /**
   * Refreshes a server's tools by re-discovering them from the MCP server.
   */
  const handleRefreshServer = useCallback(
    async (serverId: string) => {
      try {
        setRefreshingServers((prev) => ({ ...prev, [serverId]: 'refreshing' }))
        await refreshServerMutation.mutateAsync({ workspaceId, serverId })
        logger.info(`Refreshed MCP server: ${serverId}`)
        setRefreshingServers((prev) => ({ ...prev, [serverId]: 'refreshed' }))
        setTimeout(() => {
          setRefreshingServers((prev) => {
            const newState = { ...prev }
            delete newState[serverId]
            return newState
          })
        }, 2000)
      } catch (error) {
        logger.error('Failed to refresh MCP server:', error)
        setRefreshingServers((prev) => {
          const newState = { ...prev }
          delete newState[serverId]
          return newState
        })
      }
    },
    [refreshServerMutation, workspaceId]
  )

  /**
   * Gets the selected server and its tools for the detail view.
   */
  const selectedServer = useMemo(() => {
    if (!selectedServerId) return null
    const server = servers.find((s) => s.id === selectedServerId) as McpServer | undefined
    if (!server) return null
    const serverTools = (toolsByServer[selectedServerId] || []) as McpTool[]
    return { server, tools: serverTools }
  }, [selectedServerId, servers, toolsByServer])

  const error = toolsError || serversError
  const hasServers = servers && servers.length > 0
  const showEmptyState = !hasServers && !showAddForm
  const showNoResults = searchTerm.trim() && filteredServers.length === 0 && servers.length > 0

  const isFormValid = formData.name.trim() && formData.url?.trim()
  const isSubmitDisabled = serversLoading || isAddingServer || !isFormValid
  const testButtonLabel = getTestButtonLabel(testResult, isTestingConnection)

  /**
   * Gets issues for stored tools that reference a specific server tool.
   * Returns issues from all workflows that have stored this tool.
   */
  const getStoredToolIssues = useCallback(
    (serverId: string, toolName: string): { issue: McpToolIssue; workflowName: string }[] => {
      const relevantStoredTools = storedTools.filter(
        (st) => st.serverId === serverId && st.toolName === toolName
      )

      const serverStates = servers.map((s) => ({
        id: s.id,
        url: s.url,
        connectionStatus: s.connectionStatus,
        lastError: s.lastError || undefined,
      }))

      const discoveredTools = mcpToolsData.map((t) => ({
        serverId: t.serverId,
        name: t.name,
        inputSchema: t.inputSchema,
      }))

      const issues: { issue: McpToolIssue; workflowName: string }[] = []

      for (const storedTool of relevantStoredTools) {
        const issue = getMcpToolIssue(
          {
            serverId: storedTool.serverId,
            serverUrl: storedTool.serverUrl,
            toolName: storedTool.toolName,
            schema: storedTool.schema,
          },
          serverStates,
          discoveredTools
        )

        if (issue) {
          issues.push({ issue, workflowName: storedTool.workflowName })
        }
      }

      return issues
    },
    [storedTools, servers, mcpToolsData]
  )

  if (selectedServer) {
    const { server, tools } = selectedServer
    const transportLabel = formatTransportLabel(server.transport || 'http')

    return (
      <div className='flex h-full flex-col gap-[16px]'>
        <div className='min-h-0 flex-1 overflow-y-auto'>
          <div className='flex flex-col gap-[16px]'>
            <div className='flex flex-col gap-[8px]'>
              <span className='font-medium text-[13px] text-[var(--text-primary)]'>
                Server Name
              </span>
              <p className='text-[14px] text-[var(--text-secondary)]'>
                {server.name || 'Unnamed Server'}
              </p>
            </div>

            <div className='flex flex-col gap-[8px]'>
              <span className='font-medium text-[13px] text-[var(--text-primary)]'>Transport</span>
              <p className='text-[14px] text-[var(--text-secondary)]'>{transportLabel}</p>
            </div>

            {server.url && (
              <div className='flex flex-col gap-[8px]'>
                <span className='font-medium text-[13px] text-[var(--text-primary)]'>URL</span>
                <p className='break-all font-mono text-[13px] text-[var(--text-secondary)]'>
                  {server.url}
                </p>
              </div>
            )}

            {server.connectionStatus === 'error' && (
              <div className='flex flex-col gap-[8px]'>
                <span className='font-medium text-[13px] text-[var(--text-primary)]'>Status</span>
                <p className='text-[14px] text-red-500 dark:text-red-400'>
                  {server.lastError || 'Unable to connect'}
                </p>
              </div>
            )}

            <div className='flex flex-col gap-[8px]'>
              <span className='font-medium text-[13px] text-[var(--text-primary)]'>
                Tools ({tools.length})
              </span>
              {tools.length === 0 ? (
                <p className='text-[13px] text-[var(--text-muted)]'>No tools available</p>
              ) : (
                <div className='flex flex-col gap-[8px]'>
                  {tools.map((tool) => {
                    const issues = getStoredToolIssues(server.id, tool.name)
                    return (
                      <div
                        key={tool.name}
                        className='rounded-[6px] border bg-[var(--surface-3)] px-[10px] py-[8px]'
                      >
                        <div className='flex items-center justify-between'>
                          <p className='font-medium text-[13px] text-[var(--text-primary)]'>
                            {tool.name}
                          </p>
                          {issues.length > 0 && (
                            <Badge
                              variant='outline'
                              style={{
                                borderColor: 'var(--warning)',
                                color: 'var(--warning)',
                              }}
                            >
                              {getIssueBadgeLabel(issues[0].issue)}
                            </Badge>
                          )}
                        </div>
                        {tool.description && (
                          <p className='mt-[4px] text-[13px] text-[var(--text-tertiary)]'>
                            {tool.description}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='mt-auto flex items-center justify-between'>
          <Button
            onClick={() => handleRefreshServer(server.id)}
            variant='default'
            disabled={!!refreshingServers[server.id]}
          >
            {refreshingServers[server.id] === 'refreshing'
              ? 'Refreshing...'
              : refreshingServers[server.id] === 'refreshed'
                ? 'Refreshed'
                : 'Refresh Tools'}
          </Button>
          <Button
            onClick={handleBackToList}
            variant='primary'
            className='!bg-[var(--brand-tertiary-2)] !text-[var(--text-inverse)] hover:!bg-[var(--brand-tertiary-2)]/90'
          >
            Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='flex h-full flex-col gap-[16px]'>
        <div className='flex items-center gap-[8px]'>
          <div className='flex flex-1 items-center gap-[8px] rounded-[8px] border bg-[var(--surface-6)] px-[8px] py-[5px]'>
            <Search
              className='h-[14px] w-[14px] flex-shrink-0 text-[var(--text-tertiary)]'
              strokeWidth={2}
            />
            <Input
              placeholder='Search MCPs...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-auto flex-1 border-0 bg-transparent p-0 font-base leading-none placeholder:text-[var(--text-tertiary)] focus-visible:ring-0 focus-visible:ring-offset-0'
            />
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant='primary'
            disabled={serversLoading}
            className='!bg-[var(--brand-tertiary-2)] !text-[var(--text-inverse)] hover:!bg-[var(--brand-tertiary-2)]/90'
          >
            <Plus className='mr-[6px] h-[13px] w-[13px]' />
            Add
          </Button>
        </div>

        {showAddForm && !serversLoading && (
          <div className='rounded-[8px] border bg-[var(--surface-3)] p-[10px]'>
            <div className='flex flex-col gap-[8px]'>
              <FormField label='Server Name'>
                <EmcnInput
                  placeholder='e.g., My MCP Server'
                  value={formData.name}
                  onChange={(e) => {
                    if (testResult) clearTestResult()
                    handleNameChange(e.target.value)
                  }}
                  className='h-9'
                />
              </FormField>

              <FormField label='Server URL'>
                <FormattedInput
                  ref={urlInputRef}
                  placeholder='https://mcp.server.dev/{{YOUR_API_KEY}}/sse'
                  value={formData.url || ''}
                  scrollLeft={urlScrollLeft}
                  showEnvVars={showEnvVars && activeInputField === 'url'}
                  envVarProps={{
                    searchTerm: envSearchTerm,
                    cursorPosition,
                    workspaceId,
                    onSelect: handleEnvVarSelect,
                    onClose: resetEnvVarState,
                  }}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  onScroll={(scrollLeft) => handleUrlScroll(scrollLeft)}
                />
              </FormField>

              <div className='flex flex-col gap-[8px]'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium text-[13px] text-[var(--text-secondary)]'>
                    Headers
                  </span>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={handleAddHeader}
                    className='h-6 w-6 p-0'
                  >
                    <Plus className='h-3 w-3' />
                  </Button>
                </div>

                <div className='flex max-h-[140px] flex-col gap-[8px] overflow-y-auto'>
                  {(formData.headers || []).map((header, index) => (
                    <HeaderRow
                      key={index}
                      header={header}
                      index={index}
                      headerScrollLeft={headerScrollLeft}
                      showEnvVars={showEnvVars}
                      activeInputField={activeInputField}
                      activeHeaderIndex={activeHeaderIndex}
                      envSearchTerm={envSearchTerm}
                      cursorPosition={cursorPosition}
                      workspaceId={workspaceId}
                      onInputChange={handleInputChange}
                      onHeaderScroll={handleHeaderScroll}
                      onEnvVarSelect={handleEnvVarSelect}
                      onEnvVarClose={resetEnvVarState}
                      onRemove={() => handleRemoveHeader(index)}
                    />
                  ))}
                </div>
              </div>

              <div className='flex items-center justify-between pt-[12px]'>
                <Button
                  variant='default'
                  onClick={handleTestConnection}
                  disabled={isTestingConnection || !isFormValid}
                >
                  {testButtonLabel}
                </Button>

                <div className='flex items-center gap-[8px]'>
                  <Button variant='ghost' onClick={handleCancelForm}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddServer}
                    disabled={isSubmitDisabled}
                    className='!bg-[var(--brand-tertiary-2)] !text-[var(--text-inverse)] hover:!bg-[var(--brand-tertiary-2)]/90'
                  >
                    {isSubmitDisabled && isFormValid ? 'Adding...' : 'Add Server'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='min-h-0 flex-1 overflow-y-auto'>
          {error ? (
            <div className='flex h-full flex-col items-center justify-center gap-[8px]'>
              <p className='text-[#DC2626] text-[11px] leading-tight dark:text-[#F87171]'>
                {error instanceof Error ? error.message : 'Failed to load MCP servers'}
              </p>
            </div>
          ) : serversLoading ? (
            <div className='flex flex-col gap-[8px]'>
              <McpServerSkeleton />
              <McpServerSkeleton />
              <McpServerSkeleton />
            </div>
          ) : showEmptyState ? (
            <div className='flex h-full items-center justify-center text-[13px] text-[var(--text-muted)]'>
              Click "Add" above to get started
            </div>
          ) : (
            <div className='flex flex-col gap-[8px]'>
              {filteredServers.map((server) => {
                if (!server?.id) return null
                const tools = toolsByServer[server.id] || []
                const isLoadingTools = toolsLoading || toolsFetching

                return (
                  <ServerListItem
                    key={server.id}
                    server={server}
                    tools={tools}
                    isDeleting={deletingServers.has(server.id)}
                    isLoadingTools={isLoadingTools}
                    isRefreshing={refreshingServers[server.id] === 'refreshing'}
                    onRemove={() => handleRemoveServer(server.id, server.name || 'this server')}
                    onViewDetails={() => handleViewDetails(server.id)}
                  />
                )
              })}
              {showNoResults && (
                <div className='py-[16px] text-center text-[13px] text-[var(--text-muted)]'>
                  No servers found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <ModalContent className='w-[400px]'>
          <ModalHeader>Delete MCP Server</ModalHeader>
          <ModalBody>
            <p className='text-[12px] text-[var(--text-tertiary)]'>
              Are you sure you want to delete{' '}
              <span className='font-medium text-[var(--text-primary)]'>{serverToDelete?.name}</span>
              ? <span className='text-[var(--text-error)]'>This action cannot be undone.</span>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant='default' onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={confirmDeleteServer}
              className='!bg-[var(--text-error)] !text-white hover:!bg-[var(--text-error)]/90'
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/mcp/components/index.ts

```typescript
export { FormField } from './form-field/form-field'
export { FormattedInput } from './formatted-input/formatted-input'
export { HeaderRow } from './header-row/header-row'
export { McpServerSkeleton } from './mcp-server-skeleton/mcp-server-skeleton'
export { formatTransportLabel, ServerListItem } from './server-list-item/server-list-item'
export type {
  EnvVarDropdownConfig,
  HeaderEntry,
  InputFieldType,
  McpServerFormData,
  McpServerTestResult,
} from './types'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/mcp/components/types.ts

```typescript
import type { McpTransport } from '@/lib/mcp/types'

/**
 * Represents a single header entry in the form.
 * Using an array of objects allows duplicate keys during editing.
 */
export interface HeaderEntry {
  key: string
  value: string
}

export interface McpServerFormData {
  name: string
  transport: McpTransport
  url?: string
  timeout?: number
  headers?: HeaderEntry[]
}

export interface McpServerTestResult {
  success: boolean
  message?: string
  error?: string
  warnings?: string[]
}

export type InputFieldType = 'url' | 'header-key' | 'header-value'

export interface EnvVarDropdownConfig {
  searchTerm: string
  cursorPosition: number
  workspaceId: string
  onSelect: (value: string) => void
  onClose: () => void
}
```

--------------------------------------------------------------------------------

---[FILE: form-field.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/mcp/components/form-field/form-field.tsx

```typescript
import { Label } from '@/components/emcn'

interface FormFieldProps {
  label: string
  children: React.ReactNode
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className='flex items-center justify-between gap-[12px]'>
      <Label className='w-[100px] shrink-0 font-medium text-[13px] text-[var(--text-secondary)]'>
        {label}
      </Label>
      <div className='relative flex-1'>{children}</div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: formatted-input.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/mcp/components/formatted-input/formatted-input.tsx

```typescript
import { Input } from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { EnvVarDropdown } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/env-var-dropdown'
import { formatDisplayText } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/formatted-text'
import type { EnvVarDropdownConfig } from '../types'

interface FormattedInputProps {
  ref?: React.RefObject<HTMLInputElement | null>
  placeholder: string
  value: string
  scrollLeft: number
  showEnvVars: boolean
  envVarProps: EnvVarDropdownConfig
  className?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onScroll: (scrollLeft: number) => void
}

export function FormattedInput({
  ref,
  placeholder,
  value,
  scrollLeft,
  showEnvVars,
  envVarProps,
  className,
  onChange,
  onScroll,
}: FormattedInputProps) {
  const handleScroll = (e: React.UIEvent<HTMLInputElement>) => {
    onScroll(e.currentTarget.scrollLeft)
  }

  return (
    <div className={cn('relative', className)}>
      <Input
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        onInput={handleScroll}
        className='h-9 text-transparent caret-foreground placeholder:text-[var(--text-tertiary)]'
      />
      <div className='pointer-events-none absolute inset-0 flex items-center overflow-hidden px-[8px] py-[6px] font-medium font-sans text-sm'>
        <div className='whitespace-nowrap' style={{ transform: `translateX(-${scrollLeft}px)` }}>
          {formatDisplayText(value)}
        </div>
      </div>
      {showEnvVars && (
        <EnvVarDropdown
          visible={showEnvVars}
          onSelect={envVarProps.onSelect}
          searchTerm={envVarProps.searchTerm}
          inputValue={value}
          cursorPosition={envVarProps.cursorPosition}
          workspaceId={envVarProps.workspaceId}
          onClose={envVarProps.onClose}
          className='w-full'
          maxHeight='200px'
          style={{ position: 'absolute', top: '100%', left: 0, zIndex: 99999 }}
        />
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: header-row.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/mcp/components/header-row/header-row.tsx

```typescript
import { X } from 'lucide-react'
import { Button } from '@/components/emcn'
import { FormattedInput } from '../formatted-input/formatted-input'
import type { EnvVarDropdownConfig, HeaderEntry, InputFieldType } from '../types'

interface HeaderRowProps {
  header: HeaderEntry
  index: number
  headerScrollLeft: Record<string, number>
  showEnvVars: boolean
  activeInputField: InputFieldType | null
  activeHeaderIndex: number | null
  envSearchTerm: string
  cursorPosition: number
  workspaceId: string
  onInputChange: (field: InputFieldType, value: string, index?: number) => void
  onHeaderScroll: (key: string, scrollLeft: number) => void
  onEnvVarSelect: (value: string) => void
  onEnvVarClose: () => void
  onRemove: () => void
}

export function HeaderRow({
  header,
  index,
  headerScrollLeft,
  showEnvVars,
  activeInputField,
  activeHeaderIndex,
  envSearchTerm,
  cursorPosition,
  workspaceId,
  onInputChange,
  onHeaderScroll,
  onEnvVarSelect,
  onEnvVarClose,
  onRemove,
}: HeaderRowProps) {
  const isKeyActive =
    showEnvVars && activeInputField === 'header-key' && activeHeaderIndex === index
  const isValueActive =
    showEnvVars && activeInputField === 'header-value' && activeHeaderIndex === index

  const envVarProps: EnvVarDropdownConfig = {
    searchTerm: envSearchTerm,
    cursorPosition,
    workspaceId,
    onSelect: onEnvVarSelect,
    onClose: onEnvVarClose,
  }

  return (
    <div className='relative flex items-center gap-[8px]'>
      <FormattedInput
        placeholder='Name'
        value={header.key || ''}
        scrollLeft={headerScrollLeft[`key-${index}`] || 0}
        showEnvVars={isKeyActive}
        envVarProps={envVarProps}
        className='flex-1'
        onChange={(e) => onInputChange('header-key', e.target.value, index)}
        onScroll={(scrollLeft) => onHeaderScroll(`key-${index}`, scrollLeft)}
      />

      <FormattedInput
        placeholder='Value'
        value={header.value || ''}
        scrollLeft={headerScrollLeft[`value-${index}`] || 0}
        showEnvVars={isValueActive}
        envVarProps={envVarProps}
        className='flex-1'
        onChange={(e) => onInputChange('header-value', e.target.value, index)}
        onScroll={(scrollLeft) => onHeaderScroll(`value-${index}`, scrollLeft)}
      />

      <Button type='button' variant='ghost' onClick={onRemove} className='h-6 w-6 shrink-0 p-0'>
        <X className='h-3 w-3' />
      </Button>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: mcp-server-skeleton.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/mcp/components/mcp-server-skeleton/mcp-server-skeleton.tsx

```typescript
import { Skeleton } from '@/components/ui'

/**
 * Skeleton loader for MCP server list items.
 * Matches the structure of ServerListItem component.
 */
export function McpServerSkeleton() {
  return (
    <div className='flex items-center justify-between gap-[12px]'>
      <div className='flex min-w-0 flex-col justify-center gap-[1px]'>
        <div className='flex items-center gap-[6px]'>
          <Skeleton className='h-[14px] w-[100px]' />
          <Skeleton className='h-[13px] w-[80px]' />
        </div>
        <Skeleton className='h-[13px] w-[120px]' />
      </div>
      <div className='flex flex-shrink-0 items-center gap-[4px]'>
        <Skeleton className='h-[30px] w-[60px] rounded-[4px]' />
        <Skeleton className='h-[30px] w-[54px] rounded-[4px]' />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: server-list-item.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/mcp/components/server-list-item/server-list-item.tsx

```typescript
import { Button } from '@/components/emcn'

export function formatTransportLabel(transport: string): string {
  return transport
    .split('-')
    .map((word) =>
      ['http', 'sse', 'stdio'].includes(word.toLowerCase())
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('-')
}

function formatToolsLabel(tools: any[], connectionStatus?: string): string {
  if (connectionStatus === 'error') {
    return 'Unable to connect'
  }
  const count = tools.length
  const plural = count !== 1 ? 's' : ''
  const names = count > 0 ? `: ${tools.map((t) => t.name).join(', ')}` : ''
  return `${count} tool${plural}${names}`
}

interface ServerListItemProps {
  server: any
  tools: any[]
  isDeleting: boolean
  isLoadingTools?: boolean
  isRefreshing?: boolean
  onRemove: () => void
  onViewDetails: () => void
}

export function ServerListItem({
  server,
  tools,
  isDeleting,
  isLoadingTools = false,
  isRefreshing = false,
  onRemove,
  onViewDetails,
}: ServerListItemProps) {
  const transportLabel = formatTransportLabel(server.transport || 'http')
  const toolsLabel = formatToolsLabel(tools, server.connectionStatus)
  const isError = server.connectionStatus === 'error'

  return (
    <div className='flex items-center justify-between gap-[12px]'>
      <div className='flex min-w-0 flex-col justify-center gap-[1px]'>
        <div className='flex items-center gap-[6px]'>
          <span className='max-w-[200px] truncate font-medium text-[14px]'>
            {server.name || 'Unnamed Server'}
          </span>
          <span className='text-[13px] text-[var(--text-secondary)]'>({transportLabel})</span>
        </div>
        <p
          className={`truncate text-[13px] ${isError ? 'text-red-500 dark:text-red-400' : 'text-[var(--text-muted)]'}`}
        >
          {isRefreshing
            ? 'Refreshing...'
            : isLoadingTools && tools.length === 0
              ? 'Loading...'
              : toolsLabel}
        </p>
      </div>
      <div className='flex flex-shrink-0 items-center gap-[4px]'>
        <Button
          variant='primary'
          onClick={onViewDetails}
          className='!bg-[var(--brand-tertiary-2)] !text-[var(--text-inverse)] hover:!bg-[var(--brand-tertiary-2)]/90'
        >
          Details
        </Button>
        <Button variant='ghost' onClick={onRemove} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
