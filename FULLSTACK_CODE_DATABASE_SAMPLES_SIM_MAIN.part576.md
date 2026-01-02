---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 576
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 576 of 933)

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

---[FILE: middleware.ts]---
Location: sim-main/apps/sim/lib/mcp/middleware.ts
Signals: Next.js

```typescript
import type { NextRequest, NextResponse } from 'next/server'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { createMcpErrorResponse } from '@/lib/mcp/utils'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('McpAuthMiddleware')

export type McpPermissionLevel = 'read' | 'write' | 'admin'

export interface McpAuthContext {
  userId: string
  workspaceId: string
  requestId: string
}

export type McpRouteHandler<TParams = Record<string, string>> = (
  request: NextRequest,
  context: McpAuthContext,
  routeContext: { params: Promise<TParams> }
) => Promise<NextResponse>

interface AuthResult {
  success: true
  context: McpAuthContext
}

interface AuthFailure {
  success: false
  errorResponse: NextResponse
}

type AuthValidationResult = AuthResult | AuthFailure

/**
 * Validates MCP authentication and authorization
 */
async function validateMcpAuth(
  request: NextRequest,
  permissionLevel: McpPermissionLevel
): Promise<AuthValidationResult> {
  const requestId = generateRequestId()

  try {
    const auth = await checkHybridAuth(request, { requireWorkflowId: false })
    if (!auth.success || !auth.userId) {
      logger.warn(`[${requestId}] Authentication failed: ${auth.error}`)
      return {
        success: false,
        errorResponse: createMcpErrorResponse(
          new Error(auth.error || 'Authentication required'),
          'Authentication failed',
          401
        ),
      }
    }

    let workspaceId: string | null = null

    const { searchParams } = new URL(request.url)
    workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      try {
        const contentType = request.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          const body = await request.json()
          workspaceId = body.workspaceId
          ;(request as any)._parsedBody = body
        }
      } catch (error) {
        logger.debug(`[${requestId}] Could not parse request body for workspaceId extraction`)
      }
    }

    if (!workspaceId) {
      return {
        success: false,
        errorResponse: createMcpErrorResponse(
          new Error('workspaceId is required'),
          'Missing required parameter',
          400
        ),
      }
    }

    const userPermissions = await getUserEntityPermissions(auth.userId, 'workspace', workspaceId)
    if (!userPermissions) {
      return {
        success: false,
        errorResponse: createMcpErrorResponse(
          new Error('Access denied to workspace'),
          'Insufficient permissions',
          403
        ),
      }
    }

    const hasRequiredPermission = checkPermissionLevel(userPermissions, permissionLevel)
    if (!hasRequiredPermission) {
      const permissionError = getPermissionErrorMessage(permissionLevel)
      return {
        success: false,
        errorResponse: createMcpErrorResponse(
          new Error(permissionError),
          'Insufficient permissions',
          403
        ),
      }
    }

    return {
      success: true,
      context: {
        userId: auth.userId,
        workspaceId,
        requestId,
      },
    }
  } catch (error) {
    logger.error(`[${requestId}] Error during MCP auth validation:`, error)
    return {
      success: false,
      errorResponse: createMcpErrorResponse(
        error instanceof Error ? error : new Error('Authentication validation failed'),
        'Authentication validation failed',
        500
      ),
    }
  }
}

/**
 * Check if user has required permission level
 */
function checkPermissionLevel(userPermission: string, requiredLevel: McpPermissionLevel): boolean {
  switch (requiredLevel) {
    case 'read':
      return ['read', 'write', 'admin'].includes(userPermission)
    case 'write':
      return ['write', 'admin'].includes(userPermission)
    case 'admin':
      return userPermission === 'admin'
    default:
      return false
  }
}

/**
 * Get appropriate error message for permission level
 */
function getPermissionErrorMessage(permissionLevel: McpPermissionLevel): string {
  switch (permissionLevel) {
    case 'read':
      return 'Workspace access required for MCP operations'
    case 'write':
      return 'Write or admin permission required for MCP server management'
    case 'admin':
      return 'Admin permission required for MCP server administration'
    default:
      return 'Insufficient permissions for MCP operation'
  }
}

/**
 * Higher-order function that wraps MCP route handlers with authentication middleware
 *
 * @param permissionLevel - Required permission level ('read', 'write', or 'admin')
 * @returns Middleware wrapper function
 *
 */
export function withMcpAuth<TParams = Record<string, string>>(
  permissionLevel: McpPermissionLevel = 'read'
) {
  return function middleware(handler: McpRouteHandler<TParams>) {
    return async function wrappedHandler(
      request: NextRequest,
      routeContext: { params: Promise<TParams> }
    ): Promise<NextResponse> {
      const authResult = await validateMcpAuth(request, permissionLevel)

      if (!authResult.success) {
        return (authResult as AuthFailure).errorResponse
      }

      try {
        return await handler(request, (authResult as AuthResult).context, routeContext)
      } catch (error) {
        logger.error(
          `[${(authResult as AuthResult).context.requestId}] Error in MCP route handler:`,
          error
        )
        return createMcpErrorResponse(
          error instanceof Error ? error : new Error('Internal server error'),
          'Internal server error',
          500
        )
      }
    }
  }
}

/**
 * Utility to get parsed request body
 */
export function getParsedBody(request: NextRequest): any {
  return (request as any)._parsedBody
}
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: sim-main/apps/sim/lib/mcp/service.ts

```typescript
/**
 * MCP Service - Clean stateless service for MCP operations
 */

import { db } from '@sim/db'
import { mcpServers } from '@sim/db/schema'
import { and, eq, isNull } from 'drizzle-orm'
import { isTest } from '@/lib/core/config/feature-flags'
import { generateRequestId } from '@/lib/core/utils/request'
import { getEffectiveDecryptedEnv } from '@/lib/environment/utils'
import { createLogger } from '@/lib/logs/console/logger'
import { McpClient } from '@/lib/mcp/client'
import {
  createMcpCacheAdapter,
  getMcpCacheType,
  type McpCacheStorageAdapter,
} from '@/lib/mcp/storage'
import type {
  McpServerConfig,
  McpServerStatusConfig,
  McpServerSummary,
  McpTool,
  McpToolCall,
  McpToolResult,
  McpTransport,
} from '@/lib/mcp/types'
import { MCP_CONSTANTS } from '@/lib/mcp/utils'

const logger = createLogger('McpService')

class McpService {
  private cacheAdapter: McpCacheStorageAdapter
  private readonly cacheTimeout = MCP_CONSTANTS.CACHE_TIMEOUT // 5 minutes

  constructor() {
    this.cacheAdapter = createMcpCacheAdapter()
    logger.info(`MCP Service initialized with ${getMcpCacheType()} cache`)
  }

  /**
   * Dispose of the service and cleanup resources
   */
  dispose(): void {
    this.cacheAdapter.dispose()
    logger.info('MCP Service disposed')
  }

  /**
   * Resolve environment variables in strings
   */
  private resolveEnvVars(value: string, envVars: Record<string, string>): string {
    const envMatches = value.match(/\{\{([^}]+)\}\}/g)
    if (!envMatches) return value

    let resolvedValue = value
    const missingVars: string[] = []

    for (const match of envMatches) {
      const envKey = match.slice(2, -2).trim()
      const envValue = envVars[envKey]

      if (envValue === undefined) {
        missingVars.push(envKey)
        continue
      }

      resolvedValue = resolvedValue.replace(match, envValue)
    }

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variable${missingVars.length > 1 ? 's' : ''}: ${missingVars.join(', ')}. ` +
          `Please set ${missingVars.length > 1 ? 'these variables' : 'this variable'} in your workspace or personal environment settings.`
      )
    }

    return resolvedValue
  }

  /**
   * Resolve environment variables in server config
   */
  private async resolveConfigEnvVars(
    config: McpServerConfig,
    userId: string,
    workspaceId?: string
  ): Promise<McpServerConfig> {
    try {
      const envVars = await getEffectiveDecryptedEnv(userId, workspaceId)

      const resolvedConfig = { ...config }

      if (resolvedConfig.url) {
        resolvedConfig.url = this.resolveEnvVars(resolvedConfig.url, envVars)
      }

      if (resolvedConfig.headers) {
        const resolvedHeaders: Record<string, string> = {}
        for (const [key, value] of Object.entries(resolvedConfig.headers)) {
          resolvedHeaders[key] = this.resolveEnvVars(value, envVars)
        }
        resolvedConfig.headers = resolvedHeaders
      }

      return resolvedConfig
    } catch (error) {
      logger.error('Failed to resolve environment variables for MCP server config:', error)
      return config
    }
  }

  /**
   * Get server configuration from database
   */
  private async getServerConfig(
    serverId: string,
    workspaceId: string
  ): Promise<McpServerConfig | null> {
    const [server] = await db
      .select()
      .from(mcpServers)
      .where(
        and(
          eq(mcpServers.id, serverId),
          eq(mcpServers.workspaceId, workspaceId),
          eq(mcpServers.enabled, true),
          isNull(mcpServers.deletedAt)
        )
      )
      .limit(1)

    if (!server) {
      return null
    }

    return {
      id: server.id,
      name: server.name,
      description: server.description || undefined,
      transport: 'streamable-http' as const,
      url: server.url || undefined,
      headers: (server.headers as Record<string, string>) || {},
      timeout: server.timeout || 30000,
      retries: server.retries || 3,
      enabled: server.enabled,
      createdAt: server.createdAt.toISOString(),
      updatedAt: server.updatedAt.toISOString(),
    }
  }

  /**
   * Get all enabled servers for a workspace
   */
  private async getWorkspaceServers(workspaceId: string): Promise<McpServerConfig[]> {
    const whereConditions = [
      eq(mcpServers.workspaceId, workspaceId),
      eq(mcpServers.enabled, true),
      isNull(mcpServers.deletedAt),
    ]

    const servers = await db
      .select()
      .from(mcpServers)
      .where(and(...whereConditions))

    return servers.map((server) => ({
      id: server.id,
      name: server.name,
      description: server.description || undefined,
      transport: server.transport as McpTransport,
      url: server.url || undefined,
      headers: (server.headers as Record<string, string>) || {},
      timeout: server.timeout || 30000,
      retries: server.retries || 3,
      enabled: server.enabled,
      createdAt: server.createdAt.toISOString(),
      updatedAt: server.updatedAt.toISOString(),
    }))
  }

  /**
   * Create and connect to an MCP client
   */
  private async createClient(config: McpServerConfig): Promise<McpClient> {
    const securityPolicy = {
      requireConsent: true,
      auditLevel: 'basic' as const,
      maxToolExecutionsPerHour: 1000,
      allowedOrigins: config.url ? [new URL(config.url).origin] : undefined,
    }

    const client = new McpClient(config, securityPolicy)
    await client.connect()
    return client
  }

  /**
   * Execute a tool on a specific server with retry logic for session errors.
   * Retries once on session-related errors (400, 404, session ID issues).
   */
  async executeTool(
    userId: string,
    serverId: string,
    toolCall: McpToolCall,
    workspaceId: string
  ): Promise<McpToolResult> {
    const requestId = generateRequestId()
    const maxRetries = 2

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        logger.info(
          `[${requestId}] Executing MCP tool ${toolCall.name} on server ${serverId} for user ${userId}${attempt > 0 ? ` (attempt ${attempt + 1})` : ''}`
        )

        const config = await this.getServerConfig(serverId, workspaceId)
        if (!config) {
          throw new Error(`Server ${serverId} not found or not accessible`)
        }

        const resolvedConfig = await this.resolveConfigEnvVars(config, userId, workspaceId)
        const client = await this.createClient(resolvedConfig)

        try {
          const result = await client.callTool(toolCall)
          logger.info(`[${requestId}] Successfully executed tool ${toolCall.name}`)
          return result
        } finally {
          await client.disconnect()
        }
      } catch (error) {
        if (this.isSessionError(error) && attempt < maxRetries - 1) {
          logger.warn(
            `[${requestId}] Session error executing tool ${toolCall.name}, retrying (attempt ${attempt + 1}):`,
            error
          )
          await new Promise((resolve) => setTimeout(resolve, 100))
          continue
        }
        throw error
      }
    }

    throw new Error(`Failed to execute tool ${toolCall.name} after ${maxRetries} attempts`)
  }

  /**
   * Check if an error indicates a session-related issue that might be resolved by retry
   */
  private isSessionError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error)
    const lowerMessage = message.toLowerCase()
    return (
      lowerMessage.includes('session') ||
      lowerMessage.includes('400') ||
      lowerMessage.includes('404') ||
      lowerMessage.includes('no valid session')
    )
  }

  /**
   * Update server connection status after discovery attempt
   */
  private async updateServerStatus(
    serverId: string,
    workspaceId: string,
    success: boolean,
    error?: string,
    toolCount?: number
  ): Promise<void> {
    try {
      const [currentServer] = await db
        .select({ statusConfig: mcpServers.statusConfig })
        .from(mcpServers)
        .where(
          and(
            eq(mcpServers.id, serverId),
            eq(mcpServers.workspaceId, workspaceId),
            isNull(mcpServers.deletedAt)
          )
        )
        .limit(1)

      const currentConfig: McpServerStatusConfig =
        (currentServer?.statusConfig as McpServerStatusConfig | null) ?? {
          consecutiveFailures: 0,
          lastSuccessfulDiscovery: null,
        }

      const now = new Date()

      if (success) {
        await db
          .update(mcpServers)
          .set({
            connectionStatus: 'connected',
            lastConnected: now,
            lastError: null,
            toolCount: toolCount ?? 0,
            lastToolsRefresh: now,
            statusConfig: {
              consecutiveFailures: 0,
              lastSuccessfulDiscovery: now.toISOString(),
            },
            updatedAt: now,
          })
          .where(eq(mcpServers.id, serverId))
      } else {
        const newFailures = currentConfig.consecutiveFailures + 1
        const isErrorState = newFailures >= MCP_CONSTANTS.MAX_CONSECUTIVE_FAILURES

        await db
          .update(mcpServers)
          .set({
            connectionStatus: isErrorState ? 'error' : 'disconnected',
            lastError: error || 'Unknown error',
            statusConfig: {
              consecutiveFailures: newFailures,
              lastSuccessfulDiscovery: currentConfig.lastSuccessfulDiscovery,
            },
            updatedAt: now,
          })
          .where(eq(mcpServers.id, serverId))

        if (isErrorState) {
          logger.warn(
            `Server ${serverId} marked as error after ${newFailures} consecutive failures`
          )
        }
      }
    } catch (err) {
      logger.error(`Failed to update server status for ${serverId}:`, err)
    }
  }

  /**
   * Discover tools from all workspace servers
   */
  async discoverTools(
    userId: string,
    workspaceId: string,
    forceRefresh = false
  ): Promise<McpTool[]> {
    const requestId = generateRequestId()

    const cacheKey = `workspace:${workspaceId}`

    try {
      if (!forceRefresh) {
        try {
          const cached = await this.cacheAdapter.get(cacheKey)
          if (cached) {
            logger.debug(`[${requestId}] Using cached tools for user ${userId}`)
            return cached.tools
          }
        } catch (error) {
          logger.warn(`[${requestId}] Cache read failed, proceeding with discovery:`, error)
        }
      }

      logger.info(`[${requestId}] Discovering MCP tools for workspace ${workspaceId}`)

      const servers = await this.getWorkspaceServers(workspaceId)

      if (servers.length === 0) {
        logger.info(`[${requestId}] No servers found for workspace ${workspaceId}`)
        return []
      }

      const allTools: McpTool[] = []
      const results = await Promise.allSettled(
        servers.map(async (config) => {
          const resolvedConfig = await this.resolveConfigEnvVars(config, userId, workspaceId)
          const client = await this.createClient(resolvedConfig)
          try {
            const tools = await client.listTools()
            logger.debug(
              `[${requestId}] Discovered ${tools.length} tools from server ${config.name}`
            )
            return { serverId: config.id, tools }
          } finally {
            await client.disconnect()
          }
        })
      )

      let failedCount = 0
      const statusUpdates: Promise<void>[] = []

      results.forEach((result, index) => {
        const server = servers[index]
        if (result.status === 'fulfilled') {
          allTools.push(...result.value.tools)
          statusUpdates.push(
            this.updateServerStatus(
              server.id!,
              workspaceId,
              true,
              undefined,
              result.value.tools.length
            )
          )
        } else {
          failedCount++
          const errorMessage =
            result.reason instanceof Error ? result.reason.message : 'Unknown error'
          logger.warn(`[${requestId}] Failed to discover tools from server ${server.name}:`)
          statusUpdates.push(this.updateServerStatus(server.id!, workspaceId, false, errorMessage))
        }
      })

      Promise.allSettled(statusUpdates).catch((err) => {
        logger.error(`[${requestId}] Error updating server statuses:`, err)
      })

      if (failedCount === 0) {
        try {
          await this.cacheAdapter.set(cacheKey, allTools, this.cacheTimeout)
        } catch (error) {
          logger.warn(`[${requestId}] Cache write failed:`, error)
        }
      } else {
        logger.warn(
          `[${requestId}] Skipping cache due to ${failedCount} failed server(s) - will retry on next request`
        )
      }

      logger.info(
        `[${requestId}] Discovered ${allTools.length} tools from ${servers.length - failedCount}/${servers.length} servers`
      )
      return allTools
    } catch (error) {
      logger.error(`[${requestId}] Failed to discover MCP tools for user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Discover tools from a specific server with retry logic for session errors.
   * Retries once on session-related errors (400, 404, session ID issues).
   */
  async discoverServerTools(
    userId: string,
    serverId: string,
    workspaceId: string
  ): Promise<McpTool[]> {
    const requestId = generateRequestId()
    const maxRetries = 2

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        logger.info(
          `[${requestId}] Discovering tools from server ${serverId} for user ${userId}${attempt > 0 ? ` (attempt ${attempt + 1})` : ''}`
        )

        const config = await this.getServerConfig(serverId, workspaceId)
        if (!config) {
          throw new Error(`Server ${serverId} not found or not accessible`)
        }

        const resolvedConfig = await this.resolveConfigEnvVars(config, userId, workspaceId)
        const client = await this.createClient(resolvedConfig)

        try {
          const tools = await client.listTools()
          logger.info(`[${requestId}] Discovered ${tools.length} tools from server ${config.name}`)
          return tools
        } finally {
          await client.disconnect()
        }
      } catch (error) {
        if (this.isSessionError(error) && attempt < maxRetries - 1) {
          logger.warn(
            `[${requestId}] Session error discovering tools from server ${serverId}, retrying (attempt ${attempt + 1}):`,
            error
          )
          await new Promise((resolve) => setTimeout(resolve, 100))
          continue
        }
        throw error
      }
    }

    throw new Error(`Failed to discover tools from server ${serverId} after ${maxRetries} attempts`)
  }

  /**
   * Get server summaries for a user
   */
  async getServerSummaries(userId: string, workspaceId: string): Promise<McpServerSummary[]> {
    const requestId = generateRequestId()

    try {
      logger.info(`[${requestId}] Getting server summaries for workspace ${workspaceId}`)

      const servers = await this.getWorkspaceServers(workspaceId)
      const summaries: McpServerSummary[] = []

      for (const config of servers) {
        try {
          const resolvedConfig = await this.resolveConfigEnvVars(config, userId, workspaceId)
          const client = await this.createClient(resolvedConfig)
          const tools = await client.listTools()
          await client.disconnect()

          summaries.push({
            id: config.id,
            name: config.name,
            url: config.url,
            transport: config.transport,
            status: 'connected',
            toolCount: tools.length,
            lastSeen: new Date(),
            error: undefined,
          })
        } catch (error) {
          summaries.push({
            id: config.id,
            name: config.name,
            url: config.url,
            transport: config.transport,
            status: 'error',
            toolCount: 0,
            lastSeen: undefined,
            error: error instanceof Error ? error.message : 'Connection failed',
          })
        }
      }

      return summaries
    } catch (error) {
      logger.error(`[${requestId}] Failed to get server summaries for user ${userId}:`, error)
      throw error
    }
  }

  /**
   * Clear tool cache for a workspace or all workspaces
   */
  async clearCache(workspaceId?: string): Promise<void> {
    try {
      if (workspaceId) {
        const workspaceCacheKey = `workspace:${workspaceId}`
        await this.cacheAdapter.delete(workspaceCacheKey)
        logger.debug(`Cleared MCP tool cache for workspace ${workspaceId}`)
      } else {
        await this.cacheAdapter.clear()
        logger.debug('Cleared all MCP tool cache')
      }
    } catch (error) {
      logger.warn('Failed to clear cache:', error)
    }
  }
}

export const mcpService = new McpService()

/**
 * Setup process signal handlers for graceful shutdown
 */
export function setupMcpServiceCleanup() {
  if (isTest) {
    return
  }

  const cleanup = () => {
    mcpService.dispose()
  }

  process.on('SIGTERM', cleanup)
  process.on('SIGINT', cleanup)

  return () => {
    process.removeListener('SIGTERM', cleanup)
    process.removeListener('SIGINT', cleanup)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tool-validation.ts]---
Location: sim-main/apps/sim/lib/mcp/tool-validation.ts

```typescript
/**
 * MCP Tool Validation
 *
 * Shared logic for detecting issues with MCP tools across the platform.
 * Used by both tool-input.tsx (workflow context) and MCP modal (workspace context).
 */

import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'

export type McpToolIssueType =
  | 'server_not_found'
  | 'server_error'
  | 'tool_not_found'
  | 'schema_changed'
  | 'url_changed'

export interface McpToolIssue {
  type: McpToolIssueType
  message: string
}

export interface StoredMcpTool {
  serverId: string
  serverUrl?: string
  toolName: string
  schema?: Record<string, unknown>
}

export interface ServerState {
  id: string
  url?: string
  connectionStatus?: 'connected' | 'disconnected' | 'error'
  lastError?: string
}

export interface DiscoveredTool {
  serverId: string
  name: string
  inputSchema?: Record<string, unknown>
}

/**
 * Compares two schemas to detect changes.
 * Uses lodash isEqual for deep, key-order-independent comparison.
 * Ignores description field which may be backfilled.
 */
export function hasSchemaChanged(
  storedSchema: Record<string, unknown> | undefined,
  serverSchema: Record<string, unknown> | undefined
): boolean {
  if (!storedSchema || !serverSchema) return false

  const storedWithoutDesc = omit(storedSchema, 'description')
  const serverWithoutDesc = omit(serverSchema, 'description')

  return !isEqual(storedWithoutDesc, serverWithoutDesc)
}

/**
 * Detects issues with a stored MCP tool by comparing against current server/tool state.
 */
export function getMcpToolIssue(
  storedTool: StoredMcpTool,
  servers: ServerState[],
  discoveredTools: DiscoveredTool[]
): McpToolIssue | null {
  const { serverId, serverUrl, toolName, schema } = storedTool

  // Check server exists
  const server = servers.find((s) => s.id === serverId)
  if (!server) {
    return { type: 'server_not_found', message: 'Server not found' }
  }

  // Check server connection status
  if (server.connectionStatus === 'error') {
    return { type: 'server_error', message: server.lastError || 'Server connection error' }
  }
  if (server.connectionStatus !== 'connected') {
    return { type: 'server_error', message: 'Server not connected' }
  }

  // Check server URL changed (if we have stored URL)
  if (serverUrl && server.url && serverUrl !== server.url) {
    return { type: 'url_changed', message: 'Server URL changed - tools may be different' }
  }

  // Check tool exists on server
  const serverTool = discoveredTools.find((t) => t.serverId === serverId && t.name === toolName)
  if (!serverTool) {
    return { type: 'tool_not_found', message: 'Tool not found on server' }
  }

  // Check schema changed
  if (schema && serverTool.inputSchema) {
    if (hasSchemaChanged(schema, serverTool.inputSchema)) {
      return { type: 'schema_changed', message: 'Tool schema changed' }
    }
  }

  return null
}

/**
 * Returns a user-friendly label for the issue badge
 */
export function getIssueBadgeLabel(issue: McpToolIssue): string {
  switch (issue.type) {
    case 'schema_changed':
      return 'stale'
    case 'url_changed':
      return 'stale'
    default:
      return 'unavailable'
  }
}

/**
 * Checks if an issue means the tool cannot be used (vs just being stale)
 */
export function isToolUnavailable(issue: McpToolIssue | null): boolean {
  if (!issue) return false
  return (
    issue.type === 'server_not_found' ||
    issue.type === 'server_error' ||
    issue.type === 'tool_not_found'
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/mcp/types.ts

```typescript
/**
 * Model Context Protocol (MCP) Types
 */

// MCP Transport Types
// Modern MCP uses Streamable HTTP which handles both HTTP POST and SSE responses
export type McpTransport = 'streamable-http'

export interface McpServerStatusConfig {
  consecutiveFailures: number
  lastSuccessfulDiscovery: string | null
}

export interface McpServerConfig {
  id: string
  name: string
  description?: string
  transport: McpTransport

  // HTTP/SSE transport config
  url?: string
  headers?: Record<string, string>

  // Common config
  timeout?: number
  retries?: number
  enabled?: boolean
  statusConfig?: McpServerStatusConfig
  createdAt?: string
  updatedAt?: string
}

// Version negotiation support
export interface McpVersionInfo {
  supported: string[] // List of supported protocol versions
  preferred: string // Preferred version to use
}

// Security and Consent Framework
export interface McpConsentRequest {
  type: 'tool_execution' | 'resource_access' | 'data_sharing'
  context: {
    serverId: string
    serverName: string
    action: string // Tool name or resource path
    description?: string // Human-readable description
    dataAccess?: string[] // Types of data being accessed
    sideEffects?: string[] // Potential side effects
  }
  expires?: number // Consent expiration timestamp
}

export interface McpConsentResponse {
  granted: boolean
  expires?: number
  restrictions?: Record<string, any> // Any access restrictions
  auditId?: string // For audit trail
}

export interface McpSecurityPolicy {
  requireConsent: boolean
  allowedOrigins?: string[]
  blockedOrigins?: string[]
  maxToolExecutionsPerHour?: number
  auditLevel: 'none' | 'basic' | 'detailed'
}

// MCP Tool Types
export interface McpToolSchema {
  type: string
  properties?: Record<string, any>
  required?: string[]
  additionalProperties?: boolean
  description?: string
}

export interface McpTool {
  name: string
  description?: string
  inputSchema: McpToolSchema
  serverId: string
  serverName: string
}

export interface McpToolCall {
  name: string
  arguments: Record<string, any>
}

// Standard MCP protocol response format
export interface McpToolResult {
  content?: Array<{
    type: 'text' | 'image' | 'resource'
    text?: string
    data?: string
    mimeType?: string
  }>
  isError?: boolean
  // Allow additional fields that some MCP servers return
  [key: string]: any
}

// Connection and Error Types
export interface McpConnectionStatus {
  connected: boolean
  lastConnected?: Date
  lastError?: string
}

export class McpError extends Error {
  constructor(
    message: string,
    public code?: number,
    public data?: any
  ) {
    super(message)
    this.name = 'McpError'
  }
}

export class McpConnectionError extends McpError {
  constructor(message: string, serverName: string) {
    super(`Failed to connect to "${serverName}": ${message}`)
    this.name = 'McpConnectionError'
  }
}

export interface McpServerSummary {
  id: string
  name: string
  url?: string
  transport?: McpTransport
  status: 'connected' | 'disconnected' | 'error'
  toolCount: number
  resourceCount?: number
  promptCount?: number
  lastSeen?: Date
  error?: string
}

// API Response Types
export interface McpApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface McpToolDiscoveryResponse {
  tools: McpTool[]
  totalCount: number
  byServer: Record<string, number>
}
```

--------------------------------------------------------------------------------

---[FILE: url-validator.ts]---
Location: sim-main/apps/sim/lib/mcp/url-validator.ts

```typescript
/**
 * URL Validator for MCP Servers
 *
 * Provides SSRF (Server-Side Request Forgery) protection by validating
 * MCP server URLs against common attack patterns and dangerous destinations.
 */

import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('McpUrlValidator')

// Blocked IPv4 ranges
const PRIVATE_IP_RANGES = [
  /^127\./, // Loopback (127.0.0.0/8)
  /^10\./, // Private class A (10.0.0.0/8)
  /^172\.(1[6-9]|2[0-9]|3[01])\./, // Private class B (172.16.0.0/12)
  /^192\.168\./, // Private class C (192.168.0.0/16)
  /^169\.254\./, // Link-local (169.254.0.0/16)
  /^0\./, // Invalid range
]

// Blocked IPv6 ranges
const PRIVATE_IPV6_RANGES = [
  /^::1$/, // Localhost
  /^::ffff:/, // IPv4-mapped IPv6
  /^fc00:/, // Unique local (fc00::/7)
  /^fd00:/, // Unique local (fd00::/8)
  /^fe80:/, // Link-local (fe80::/10)
]

// Blocked hostnames - SSRF protection
const BLOCKED_HOSTNAMES = [
  'localhost',
  // Cloud metadata endpoints
  'metadata.google.internal', // Google Cloud metadata
  'metadata.gce.internal', // Google Compute Engine metadata (legacy)
  '169.254.169.254', // AWS/Azure/GCP metadata service IP
  'metadata.azure.com', // Azure Instance Metadata Service
  'instance-data.ec2.internal', // AWS EC2 instance metadata (internal)
  // Service discovery endpoints
  'consul', // HashiCorp Consul
  'etcd', // etcd key-value store
]

// Blocked ports
const BLOCKED_PORTS = [
  22, // SSH
  23, // Telnet
  25, // SMTP
  53, // DNS
  110, // POP3
  143, // IMAP
  993, // IMAPS
  995, // POP3S
  1433, // SQL Server
  1521, // Oracle
  3306, // MySQL
  5432, // PostgreSQL
  6379, // Redis
  9200, // Elasticsearch
  27017, // MongoDB
]

export interface UrlValidationResult {
  isValid: boolean
  error?: string
  normalizedUrl?: string
}

export function validateMcpServerUrl(urlString: string): UrlValidationResult {
  if (!urlString || typeof urlString !== 'string') {
    return {
      isValid: false,
      error: 'URL is required and must be a string',
    }
  }

  let url: URL
  try {
    url = new URL(urlString.trim())
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid URL format',
    }
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return {
      isValid: false,
      error: 'Only HTTP and HTTPS protocols are allowed',
    }
  }

  const hostname = url.hostname.toLowerCase()

  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return {
      isValid: false,
      error: `Hostname '${hostname}' is not allowed for security reasons`,
    }
  }

  if (isIPv4(hostname)) {
    for (const range of PRIVATE_IP_RANGES) {
      if (range.test(hostname)) {
        return {
          isValid: false,
          error: `Private IP addresses are not allowed: ${hostname}`,
        }
      }
    }
  }

  if (isIPv6(hostname)) {
    for (const range of PRIVATE_IPV6_RANGES) {
      if (range.test(hostname)) {
        return {
          isValid: false,
          error: `Private IPv6 addresses are not allowed: ${hostname}`,
        }
      }
    }
  }

  if (url.port) {
    const port = Number.parseInt(url.port, 10)
    if (BLOCKED_PORTS.includes(port)) {
      return {
        isValid: false,
        error: `Port ${port} is not allowed for security reasons`,
      }
    }
  }

  if (url.toString().length > 2048) {
    return {
      isValid: false,
      error: 'URL is too long (maximum 2048 characters)',
    }
  }

  if (url.protocol === 'https:' && url.port === '80') {
    return {
      isValid: false,
      error: 'HTTPS URLs should not use port 80',
    }
  }

  if (url.protocol === 'http:' && url.port === '443') {
    return {
      isValid: false,
      error: 'HTTP URLs should not use port 443',
    }
  }

  logger.debug(`Validated MCP server URL: ${hostname}`)

  return {
    isValid: true,
    normalizedUrl: url.toString(),
  }
}

function isIPv4(hostname: string): boolean {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipv4Regex.test(hostname)
}

function isIPv6(hostname: string): boolean {
  const cleanHostname = hostname.replace(/^\[|\]$/g, '')

  const ipv6Regex =
    /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^(?:[0-9a-fA-F]{1,4}:)*::[0-9a-fA-F]{1,4}(?::[0-9a-fA-F]{1,4})*$/

  return ipv6Regex.test(cleanHostname)
}
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: sim-main/apps/sim/lib/mcp/utils.test.ts

```typescript
import { describe, expect, it } from 'vitest'
import { generateMcpServerId } from './utils'

describe('generateMcpServerId', () => {
  const workspaceId = 'ws-test-123'
  const url = 'https://my-mcp-server.com/mcp'

  it.concurrent('produces deterministic IDs for the same input', () => {
    const id1 = generateMcpServerId(workspaceId, url)
    const id2 = generateMcpServerId(workspaceId, url)
    expect(id1).toBe(id2)
  })

  it.concurrent('normalizes trailing slashes', () => {
    const id1 = generateMcpServerId(workspaceId, url)
    const id2 = generateMcpServerId(workspaceId, `${url}/`)
    const id3 = generateMcpServerId(workspaceId, `${url}//`)
    expect(id1).toBe(id2)
    expect(id1).toBe(id3)
  })

  it.concurrent('is case insensitive for URL', () => {
    const id1 = generateMcpServerId(workspaceId, url)
    const id2 = generateMcpServerId(workspaceId, 'https://MY-MCP-SERVER.com/mcp')
    const id3 = generateMcpServerId(workspaceId, 'HTTPS://My-Mcp-Server.COM/MCP')
    expect(id1).toBe(id2)
    expect(id1).toBe(id3)
  })

  it.concurrent('ignores query parameters', () => {
    const id1 = generateMcpServerId(workspaceId, url)
    const id2 = generateMcpServerId(workspaceId, `${url}?token=abc123`)
    const id3 = generateMcpServerId(workspaceId, `${url}?foo=bar&baz=qux`)
    expect(id1).toBe(id2)
    expect(id1).toBe(id3)
  })

  it.concurrent('ignores fragments', () => {
    const id1 = generateMcpServerId(workspaceId, url)
    const id2 = generateMcpServerId(workspaceId, `${url}#section`)
    expect(id1).toBe(id2)
  })

  it.concurrent('produces different IDs for different workspaces', () => {
    const id1 = generateMcpServerId('ws-123', url)
    const id2 = generateMcpServerId('ws-456', url)
    expect(id1).not.toBe(id2)
  })

  it.concurrent('produces different IDs for different URLs', () => {
    const id1 = generateMcpServerId(workspaceId, 'https://server1.com/mcp')
    const id2 = generateMcpServerId(workspaceId, 'https://server2.com/mcp')
    expect(id1).not.toBe(id2)
  })

  it.concurrent('produces IDs in the correct format', () => {
    const id = generateMcpServerId(workspaceId, url)
    expect(id).toMatch(/^mcp-[a-f0-9]{8}$/)
  })

  it.concurrent('handles URLs with ports', () => {
    const id1 = generateMcpServerId(workspaceId, 'https://localhost:3000/mcp')
    const id2 = generateMcpServerId(workspaceId, 'https://localhost:3000/mcp/')
    expect(id1).toBe(id2)
    expect(id1).toMatch(/^mcp-[a-f0-9]{8}$/)
  })

  it.concurrent('handles invalid URLs gracefully', () => {
    const id = generateMcpServerId(workspaceId, 'not-a-valid-url')
    expect(id).toMatch(/^mcp-[a-f0-9]{8}$/)
  })
})
```

--------------------------------------------------------------------------------

````
