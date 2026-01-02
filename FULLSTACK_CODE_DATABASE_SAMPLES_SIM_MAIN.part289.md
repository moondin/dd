---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 289
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 289 of 933)

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

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/logs/[id]/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import {
  permissions,
  workflow,
  workflowDeploymentVersion,
  workflowExecutionLogs,
} from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('LogDetailsByIdAPI')

export const revalidate = 0

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized log details access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { id } = await params

    const rows = await db
      .select({
        id: workflowExecutionLogs.id,
        workflowId: workflowExecutionLogs.workflowId,
        executionId: workflowExecutionLogs.executionId,
        stateSnapshotId: workflowExecutionLogs.stateSnapshotId,
        deploymentVersionId: workflowExecutionLogs.deploymentVersionId,
        level: workflowExecutionLogs.level,
        trigger: workflowExecutionLogs.trigger,
        startedAt: workflowExecutionLogs.startedAt,
        endedAt: workflowExecutionLogs.endedAt,
        totalDurationMs: workflowExecutionLogs.totalDurationMs,
        executionData: workflowExecutionLogs.executionData,
        cost: workflowExecutionLogs.cost,
        files: workflowExecutionLogs.files,
        createdAt: workflowExecutionLogs.createdAt,
        workflowName: workflow.name,
        workflowDescription: workflow.description,
        workflowColor: workflow.color,
        workflowFolderId: workflow.folderId,
        workflowUserId: workflow.userId,
        workflowWorkspaceId: workflow.workspaceId,
        workflowCreatedAt: workflow.createdAt,
        workflowUpdatedAt: workflow.updatedAt,
        deploymentVersion: workflowDeploymentVersion.version,
        deploymentVersionName: workflowDeploymentVersion.name,
      })
      .from(workflowExecutionLogs)
      .innerJoin(workflow, eq(workflowExecutionLogs.workflowId, workflow.id))
      .leftJoin(
        workflowDeploymentVersion,
        eq(workflowDeploymentVersion.id, workflowExecutionLogs.deploymentVersionId)
      )
      .innerJoin(
        permissions,
        and(
          eq(permissions.entityType, 'workspace'),
          eq(permissions.entityId, workflow.workspaceId),
          eq(permissions.userId, userId)
        )
      )
      .where(eq(workflowExecutionLogs.id, id))
      .limit(1)

    const log = rows[0]
    if (!log) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const workflowSummary = {
      id: log.workflowId,
      name: log.workflowName,
      description: log.workflowDescription,
      color: log.workflowColor,
      folderId: log.workflowFolderId,
      userId: log.workflowUserId,
      workspaceId: log.workflowWorkspaceId,
      createdAt: log.workflowCreatedAt,
      updatedAt: log.workflowUpdatedAt,
    }

    const response = {
      id: log.id,
      workflowId: log.workflowId,
      executionId: log.executionId,
      deploymentVersionId: log.deploymentVersionId,
      deploymentVersion: log.deploymentVersion ?? null,
      deploymentVersionName: log.deploymentVersionName ?? null,
      level: log.level,
      duration: log.totalDurationMs ? `${log.totalDurationMs}ms` : null,
      trigger: log.trigger,
      createdAt: log.startedAt.toISOString(),
      files: log.files || undefined,
      workflow: workflowSummary,
      executionData: {
        totalDuration: log.totalDurationMs,
        ...(log.executionData as any),
        enhanced: true,
      },
      cost: log.cost as any,
    }

    return NextResponse.json({ data: response })
  } catch (error: any) {
    logger.error(`[${requestId}] log details fetch error`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/mcp/servers/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { mcpServers } from '@sim/db/schema'
import { and, eq, isNull } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { getParsedBody, withMcpAuth } from '@/lib/mcp/middleware'
import { mcpService } from '@/lib/mcp/service'
import type { McpTransport } from '@/lib/mcp/types'
import { validateMcpServerUrl } from '@/lib/mcp/url-validator'
import {
  createMcpErrorResponse,
  createMcpSuccessResponse,
  generateMcpServerId,
} from '@/lib/mcp/utils'

const logger = createLogger('McpServersAPI')

export const dynamic = 'force-dynamic'

/**
 * Check if transport type requires a URL
 */
function isUrlBasedTransport(transport: McpTransport): boolean {
  return transport === 'streamable-http'
}

/**
 * GET - List all registered MCP servers for the workspace
 */
export const GET = withMcpAuth('read')(
  async (request: NextRequest, { userId, workspaceId, requestId }) => {
    try {
      logger.info(`[${requestId}] Listing MCP servers for workspace ${workspaceId}`)

      const servers = await db
        .select()
        .from(mcpServers)
        .where(and(eq(mcpServers.workspaceId, workspaceId), isNull(mcpServers.deletedAt)))

      logger.info(
        `[${requestId}] Listed ${servers.length} MCP servers for workspace ${workspaceId}`
      )
      return createMcpSuccessResponse({ servers })
    } catch (error) {
      logger.error(`[${requestId}] Error listing MCP servers:`, error)
      return createMcpErrorResponse(
        error instanceof Error ? error : new Error('Failed to list MCP servers'),
        'Failed to list MCP servers',
        500
      )
    }
  }
)

/**
 * POST - Register a new MCP server for the workspace (requires write permission)
 *
 * Uses deterministic server IDs based on URL hash to ensure that re-adding
 * the same server produces the same ID. This prevents "server not found" errors
 * when workflows reference the old server ID after delete/re-add cycles.
 *
 * If a server with the same ID already exists (same URL in same workspace),
 * it will be updated instead of creating a duplicate.
 */
export const POST = withMcpAuth('write')(
  async (request: NextRequest, { userId, workspaceId, requestId }) => {
    try {
      const body = getParsedBody(request) || (await request.json())

      logger.info(`[${requestId}] Registering MCP server:`, {
        name: body.name,
        transport: body.transport,
        workspaceId,
      })

      if (!body.name || !body.transport) {
        return createMcpErrorResponse(
          new Error('Missing required fields: name or transport'),
          'Missing required fields',
          400
        )
      }

      if (isUrlBasedTransport(body.transport) && body.url) {
        const urlValidation = validateMcpServerUrl(body.url)
        if (!urlValidation.isValid) {
          return createMcpErrorResponse(
            new Error(`Invalid MCP server URL: ${urlValidation.error}`),
            'Invalid server URL',
            400
          )
        }
        body.url = urlValidation.normalizedUrl
      }

      const serverId = body.url ? generateMcpServerId(workspaceId, body.url) : crypto.randomUUID()

      const [existingServer] = await db
        .select({ id: mcpServers.id, deletedAt: mcpServers.deletedAt })
        .from(mcpServers)
        .where(and(eq(mcpServers.id, serverId), eq(mcpServers.workspaceId, workspaceId)))
        .limit(1)

      if (existingServer) {
        logger.info(
          `[${requestId}] Server with ID ${serverId} already exists, updating instead of creating`
        )

        await db
          .update(mcpServers)
          .set({
            name: body.name,
            description: body.description,
            transport: body.transport,
            url: body.url,
            headers: body.headers || {},
            timeout: body.timeout || 30000,
            retries: body.retries || 3,
            enabled: body.enabled !== false,
            connectionStatus: 'connected',
            lastConnected: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          })
          .where(eq(mcpServers.id, serverId))

        await mcpService.clearCache(workspaceId)

        logger.info(
          `[${requestId}] Successfully updated MCP server: ${body.name} (ID: ${serverId})`
        )

        return createMcpSuccessResponse({ serverId, updated: true }, 200)
      }

      await db
        .insert(mcpServers)
        .values({
          id: serverId,
          workspaceId,
          createdBy: userId,
          name: body.name,
          description: body.description,
          transport: body.transport,
          url: body.url,
          headers: body.headers || {},
          timeout: body.timeout || 30000,
          retries: body.retries || 3,
          enabled: body.enabled !== false,
          connectionStatus: 'connected',
          lastConnected: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      await mcpService.clearCache(workspaceId)

      logger.info(
        `[${requestId}] Successfully registered MCP server: ${body.name} (ID: ${serverId})`
      )

      try {
        const { trackPlatformEvent } = await import('@/lib/core/telemetry')
        trackPlatformEvent('platform.mcp.server_added', {
          'mcp.server_id': serverId,
          'mcp.server_name': body.name,
          'mcp.transport': body.transport,
          'workspace.id': workspaceId,
        })
      } catch (_e) {
        // Silently fail
      }

      return createMcpSuccessResponse({ serverId }, 201)
    } catch (error) {
      logger.error(`[${requestId}] Error registering MCP server:`, error)
      return createMcpErrorResponse(
        error instanceof Error ? error : new Error('Failed to register MCP server'),
        'Failed to register MCP server',
        500
      )
    }
  }
)

/**
 * DELETE - Delete an MCP server from the workspace (requires admin permission)
 */
export const DELETE = withMcpAuth('admin')(
  async (request: NextRequest, { userId, workspaceId, requestId }) => {
    try {
      const { searchParams } = new URL(request.url)
      const serverId = searchParams.get('serverId')

      if (!serverId) {
        return createMcpErrorResponse(
          new Error('serverId parameter is required'),
          'Missing required parameter',
          400
        )
      }

      logger.info(`[${requestId}] Deleting MCP server: ${serverId} from workspace: ${workspaceId}`)

      const [deletedServer] = await db
        .delete(mcpServers)
        .where(and(eq(mcpServers.id, serverId), eq(mcpServers.workspaceId, workspaceId)))
        .returning()

      if (!deletedServer) {
        return createMcpErrorResponse(
          new Error('Server not found or access denied'),
          'Server not found',
          404
        )
      }

      await mcpService.clearCache(workspaceId)

      logger.info(`[${requestId}] Successfully deleted MCP server: ${serverId}`)
      return createMcpSuccessResponse({ message: `Server ${serverId} deleted successfully` })
    } catch (error) {
      logger.error(`[${requestId}] Error deleting MCP server:`, error)
      return createMcpErrorResponse(
        error instanceof Error ? error : new Error('Failed to delete MCP server'),
        'Failed to delete MCP server',
        500
      )
    }
  }
)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/mcp/servers/test-connection/route.ts
Signals: Next.js

```typescript
import type { NextRequest } from 'next/server'
import { getEffectiveDecryptedEnv } from '@/lib/environment/utils'
import { createLogger } from '@/lib/logs/console/logger'
import { McpClient } from '@/lib/mcp/client'
import { getParsedBody, withMcpAuth } from '@/lib/mcp/middleware'
import type { McpServerConfig, McpTransport } from '@/lib/mcp/types'
import { validateMcpServerUrl } from '@/lib/mcp/url-validator'
import { createMcpErrorResponse, createMcpSuccessResponse } from '@/lib/mcp/utils'

const logger = createLogger('McpServerTestAPI')

export const dynamic = 'force-dynamic'

/**
 * Check if transport type requires a URL
 * All modern MCP connections use Streamable HTTP which requires a URL
 */
function isUrlBasedTransport(transport: McpTransport): boolean {
  return transport === 'streamable-http'
}

/**
 * Resolve environment variables in strings
 */
function resolveEnvVars(value: string, envVars: Record<string, string>): string {
  const envMatches = value.match(/\{\{([^}]+)\}\}/g)
  if (!envMatches) return value

  let resolvedValue = value
  for (const match of envMatches) {
    const envKey = match.slice(2, -2).trim()
    const envValue = envVars[envKey]

    if (envValue === undefined) {
      logger.warn(`Environment variable "${envKey}" not found in MCP server test`)
      continue
    }

    resolvedValue = resolvedValue.replace(match, envValue)
  }
  return resolvedValue
}

interface TestConnectionRequest {
  name: string
  transport: McpTransport
  url?: string
  headers?: Record<string, string>
  timeout?: number
  workspaceId: string
}

interface TestConnectionResult {
  success: boolean
  error?: string
  serverInfo?: {
    name: string
    version: string
  }
  negotiatedVersion?: string
  supportedCapabilities?: string[]
  toolCount?: number
  warnings?: string[]
}

/**
 * POST - Test connection to an MCP server before registering it
 */
export const POST = withMcpAuth('write')(
  async (request: NextRequest, { userId, workspaceId, requestId }) => {
    try {
      const body: TestConnectionRequest = getParsedBody(request) || (await request.json())

      logger.info(`[${requestId}] Testing MCP server connection:`, {
        name: body.name,
        transport: body.transport,
        url: body.url ? `${body.url.substring(0, 50)}...` : undefined, // Partial URL for security
        workspaceId,
      })

      if (!body.name || !body.transport) {
        return createMcpErrorResponse(
          new Error('Missing required fields: name and transport are required'),
          'Missing required fields',
          400
        )
      }

      if (isUrlBasedTransport(body.transport)) {
        if (!body.url) {
          return createMcpErrorResponse(
            new Error('URL is required for HTTP-based transports'),
            'Missing required URL',
            400
          )
        }

        const urlValidation = validateMcpServerUrl(body.url)
        if (!urlValidation.isValid) {
          return createMcpErrorResponse(
            new Error(`Invalid MCP server URL: ${urlValidation.error}`),
            'Invalid server URL',
            400
          )
        }
        body.url = urlValidation.normalizedUrl
      }

      let resolvedUrl = body.url
      let resolvedHeaders = body.headers || {}

      try {
        const envVars = await getEffectiveDecryptedEnv(userId, workspaceId)

        if (resolvedUrl) {
          resolvedUrl = resolveEnvVars(resolvedUrl, envVars)
        }

        const resolvedHeadersObj: Record<string, string> = {}
        for (const [key, value] of Object.entries(resolvedHeaders)) {
          resolvedHeadersObj[key] = resolveEnvVars(value, envVars)
        }
        resolvedHeaders = resolvedHeadersObj
      } catch (envError) {
        logger.warn(
          `[${requestId}] Failed to resolve environment variables, using raw values:`,
          envError
        )
      }

      const testConfig: McpServerConfig = {
        id: `test-${requestId}`,
        name: body.name,
        transport: body.transport,
        url: resolvedUrl,
        headers: resolvedHeaders,
        timeout: body.timeout || 10000,
        retries: 1, // Only one retry for tests
        enabled: true,
      }

      const testSecurityPolicy = {
        requireConsent: false,
        auditLevel: 'none' as const,
        maxToolExecutionsPerHour: 0,
      }

      const result: TestConnectionResult = { success: false }
      let client: McpClient | null = null

      try {
        client = new McpClient(testConfig, testSecurityPolicy)
        await client.connect()

        result.negotiatedVersion = client.getNegotiatedVersion()

        try {
          const tools = await client.listTools()
          result.toolCount = tools.length
          result.success = true
        } catch (toolError) {
          logger.warn(`[${requestId}] Connection established but could not list tools:`, toolError)
          result.success = false
          const errorMessage = toolError instanceof Error ? toolError.message : 'Unknown error'
          result.error = `Connection established but could not list tools: ${errorMessage}`
          result.warnings = result.warnings || []
          result.warnings.push(
            'Server connected but tool listing failed - connection may be incomplete'
          )
        }

        const clientVersionInfo = McpClient.getVersionInfo()
        if (result.negotiatedVersion !== clientVersionInfo.preferred) {
          result.warnings = result.warnings || []
          result.warnings.push(
            `Server uses protocol version '${result.negotiatedVersion}' instead of preferred '${clientVersionInfo.preferred}'`
          )
        }

        logger.info(`[${requestId}] MCP server test successful:`, {
          name: body.name,
          negotiatedVersion: result.negotiatedVersion,
          toolCount: result.toolCount,
          capabilities: result.supportedCapabilities,
        })
      } catch (error) {
        logger.warn(`[${requestId}] MCP server test failed:`, error)

        result.success = false
        if (error instanceof Error) {
          result.error = error.message
        } else {
          result.error = 'Unknown connection error'
        }
      } finally {
        if (client) {
          try {
            await client.disconnect()
          } catch (disconnectError) {
            logger.debug(`[${requestId}] Test client disconnect error (expected):`, disconnectError)
          }
        }
      }

      return createMcpSuccessResponse(result, result.success ? 200 : 400)
    } catch (error) {
      logger.error(`[${requestId}] Error testing MCP server connection:`, error)
      return createMcpErrorResponse(
        error instanceof Error ? error : new Error('Failed to test server connection'),
        'Failed to test server connection',
        500
      )
    }
  }
)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/mcp/servers/[id]/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { mcpServers } from '@sim/db/schema'
import { and, eq, isNull } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { getParsedBody, withMcpAuth } from '@/lib/mcp/middleware'
import { mcpService } from '@/lib/mcp/service'
import { validateMcpServerUrl } from '@/lib/mcp/url-validator'
import { createMcpErrorResponse, createMcpSuccessResponse } from '@/lib/mcp/utils'

const logger = createLogger('McpServerAPI')

export const dynamic = 'force-dynamic'

/**
 * PATCH - Update an MCP server in the workspace (requires write or admin permission)
 */
export const PATCH = withMcpAuth<{ id: string }>('write')(
  async (request: NextRequest, { userId, workspaceId, requestId }, { params }) => {
    const { id: serverId } = await params

    try {
      const body = getParsedBody(request) || (await request.json())

      logger.info(`[${requestId}] Updating MCP server: ${serverId} in workspace: ${workspaceId}`, {
        userId,
        updates: Object.keys(body).filter((k) => k !== 'workspaceId'),
      })

      // Validate URL if being updated
      if (
        body.url &&
        (body.transport === 'http' ||
          body.transport === 'sse' ||
          body.transport === 'streamable-http')
      ) {
        const urlValidation = validateMcpServerUrl(body.url)
        if (!urlValidation.isValid) {
          return createMcpErrorResponse(
            new Error(`Invalid MCP server URL: ${urlValidation.error}`),
            'Invalid server URL',
            400
          )
        }
        body.url = urlValidation.normalizedUrl
      }

      // Remove workspaceId from body to prevent it from being updated
      const { workspaceId: _, ...updateData } = body

      // Get the current server to check if URL is changing
      const [currentServer] = await db
        .select({ url: mcpServers.url })
        .from(mcpServers)
        .where(
          and(
            eq(mcpServers.id, serverId),
            eq(mcpServers.workspaceId, workspaceId),
            isNull(mcpServers.deletedAt)
          )
        )
        .limit(1)

      const [updatedServer] = await db
        .update(mcpServers)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(mcpServers.id, serverId),
            eq(mcpServers.workspaceId, workspaceId),
            isNull(mcpServers.deletedAt)
          )
        )
        .returning()

      if (!updatedServer) {
        return createMcpErrorResponse(
          new Error('Server not found or access denied'),
          'Server not found',
          404
        )
      }

      // Only clear cache if URL changed (requires re-discovery)
      const urlChanged = body.url && currentServer?.url !== body.url
      if (urlChanged) {
        await mcpService.clearCache(workspaceId)
        logger.info(`[${requestId}] Cleared cache due to URL change`)
      }

      logger.info(`[${requestId}] Successfully updated MCP server: ${serverId}`)
      return createMcpSuccessResponse({ server: updatedServer })
    } catch (error) {
      logger.error(`[${requestId}] Error updating MCP server:`, error)
      return createMcpErrorResponse(
        error instanceof Error ? error : new Error('Failed to update MCP server'),
        'Failed to update MCP server',
        500
      )
    }
  }
)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/mcp/servers/[id]/refresh/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { mcpServers } from '@sim/db/schema'
import { and, eq, isNull } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { withMcpAuth } from '@/lib/mcp/middleware'
import { mcpService } from '@/lib/mcp/service'
import type { McpServerStatusConfig } from '@/lib/mcp/types'
import { createMcpErrorResponse, createMcpSuccessResponse } from '@/lib/mcp/utils'

const logger = createLogger('McpServerRefreshAPI')

export const dynamic = 'force-dynamic'

/**
 * POST - Refresh an MCP server connection (requires any workspace permission)
 */
export const POST = withMcpAuth<{ id: string }>('read')(
  async (request: NextRequest, { userId, workspaceId, requestId }, { params }) => {
    const { id: serverId } = await params

    try {
      logger.info(
        `[${requestId}] Refreshing MCP server: ${serverId} in workspace: ${workspaceId}`,
        {
          userId,
        }
      )

      const [server] = await db
        .select()
        .from(mcpServers)
        .where(
          and(
            eq(mcpServers.id, serverId),
            eq(mcpServers.workspaceId, workspaceId),
            isNull(mcpServers.deletedAt)
          )
        )
        .limit(1)

      if (!server) {
        return createMcpErrorResponse(
          new Error('Server not found or access denied'),
          'Server not found',
          404
        )
      }

      let connectionStatus: 'connected' | 'disconnected' | 'error' = 'error'
      let toolCount = 0
      let lastError: string | null = null

      const currentStatusConfig: McpServerStatusConfig =
        (server.statusConfig as McpServerStatusConfig | null) ?? {
          consecutiveFailures: 0,
          lastSuccessfulDiscovery: null,
        }

      try {
        const tools = await mcpService.discoverServerTools(userId, serverId, workspaceId)
        connectionStatus = 'connected'
        toolCount = tools.length
        logger.info(
          `[${requestId}] Successfully connected to server ${serverId}, discovered ${toolCount} tools`
        )
      } catch (error) {
        connectionStatus = 'error'
        lastError = error instanceof Error ? error.message : 'Connection test failed'
        logger.warn(`[${requestId}] Failed to connect to server ${serverId}:`, error)
      }

      const now = new Date()
      const newStatusConfig =
        connectionStatus === 'connected'
          ? { consecutiveFailures: 0, lastSuccessfulDiscovery: now.toISOString() }
          : {
              consecutiveFailures: currentStatusConfig.consecutiveFailures + 1,
              lastSuccessfulDiscovery: currentStatusConfig.lastSuccessfulDiscovery,
            }

      const [refreshedServer] = await db
        .update(mcpServers)
        .set({
          lastToolsRefresh: now,
          connectionStatus,
          lastError,
          lastConnected: connectionStatus === 'connected' ? now : server.lastConnected,
          toolCount,
          statusConfig: newStatusConfig,
          updatedAt: now,
        })
        .where(eq(mcpServers.id, serverId))
        .returning()

      if (connectionStatus === 'connected') {
        logger.info(
          `[${requestId}] Successfully refreshed MCP server: ${serverId} (${toolCount} tools)`
        )
        await mcpService.clearCache(workspaceId)
      } else {
        logger.warn(
          `[${requestId}] Refresh completed for MCP server ${serverId} but connection failed: ${lastError}`
        )
      }

      return createMcpSuccessResponse({
        status: connectionStatus,
        toolCount,
        lastConnected: refreshedServer?.lastConnected?.toISOString() || null,
        error: lastError,
      })
    } catch (error) {
      logger.error(`[${requestId}] Error refreshing MCP server:`, error)
      return createMcpErrorResponse(
        error instanceof Error ? error : new Error('Failed to refresh MCP server'),
        'Failed to refresh MCP server',
        500
      )
    }
  }
)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/mcp/tools/discover/route.ts
Signals: Next.js

```typescript
import type { NextRequest } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { getParsedBody, withMcpAuth } from '@/lib/mcp/middleware'
import { mcpService } from '@/lib/mcp/service'
import type { McpToolDiscoveryResponse } from '@/lib/mcp/types'
import { categorizeError, createMcpErrorResponse, createMcpSuccessResponse } from '@/lib/mcp/utils'

const logger = createLogger('McpToolDiscoveryAPI')

export const dynamic = 'force-dynamic'

/**
 * GET - Discover all tools from user's MCP servers
 */
export const GET = withMcpAuth('read')(
  async (request: NextRequest, { userId, workspaceId, requestId }) => {
    try {
      const { searchParams } = new URL(request.url)
      const serverId = searchParams.get('serverId')
      const forceRefresh = searchParams.get('refresh') === 'true'

      logger.info(`[${requestId}] Discovering MCP tools for user ${userId}`, {
        serverId,
        workspaceId,
        forceRefresh,
      })

      let tools
      if (serverId) {
        tools = await mcpService.discoverServerTools(userId, serverId, workspaceId)
      } else {
        tools = await mcpService.discoverTools(userId, workspaceId, forceRefresh)
      }

      const byServer: Record<string, number> = {}
      for (const tool of tools) {
        byServer[tool.serverId] = (byServer[tool.serverId] || 0) + 1
      }

      const responseData: McpToolDiscoveryResponse = {
        tools,
        totalCount: tools.length,
        byServer,
      }

      logger.info(
        `[${requestId}] Discovered ${tools.length} tools from ${Object.keys(byServer).length} servers`
      )
      return createMcpSuccessResponse(responseData)
    } catch (error) {
      logger.error(`[${requestId}] Error discovering MCP tools:`, error)
      const { message, status } = categorizeError(error)
      return createMcpErrorResponse(new Error(message), 'Failed to discover MCP tools', status)
    }
  }
)

/**
 * POST - Refresh tool discovery for specific servers
 */
export const POST = withMcpAuth('read')(
  async (request: NextRequest, { userId, workspaceId, requestId }) => {
    try {
      const body = getParsedBody(request) || (await request.json())
      const { serverIds } = body

      if (!Array.isArray(serverIds)) {
        return createMcpErrorResponse(
          new Error('serverIds must be an array'),
          'Invalid request format',
          400
        )
      }

      logger.info(
        `[${requestId}] Refreshing tool discovery for user ${userId}, servers:`,
        serverIds
      )

      const results = await Promise.allSettled(
        serverIds.map(async (serverId: string) => {
          const tools = await mcpService.discoverServerTools(userId, serverId, workspaceId)
          return { serverId, toolCount: tools.length }
        })
      )

      const successes: Array<{ serverId: string; toolCount: number }> = []
      const failures: Array<{ serverId: string; error: string }> = []

      results.forEach((result, index) => {
        const serverId = serverIds[index]
        if (result.status === 'fulfilled') {
          successes.push(result.value)
        } else {
          failures.push({
            serverId,
            error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
          })
        }
      })

      const responseData = {
        refreshed: successes,
        failed: failures,
        summary: {
          total: serverIds.length,
          successful: successes.length,
          failed: failures.length,
        },
      }

      logger.info(
        `[${requestId}] Tool discovery refresh completed: ${successes.length}/${serverIds.length} successful`
      )
      return createMcpSuccessResponse(responseData)
    } catch (error) {
      logger.error(`[${requestId}] Error refreshing tool discovery:`, error)
      const { message, status } = categorizeError(error)
      return createMcpErrorResponse(new Error(message), 'Failed to refresh tool discovery', status)
    }
  }
)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/mcp/tools/execute/route.ts
Signals: Next.js

```typescript
import type { NextRequest } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { getParsedBody, withMcpAuth } from '@/lib/mcp/middleware'
import { mcpService } from '@/lib/mcp/service'
import type { McpTool, McpToolCall, McpToolResult } from '@/lib/mcp/types'
import {
  categorizeError,
  createMcpErrorResponse,
  createMcpSuccessResponse,
  MCP_CONSTANTS,
  validateStringParam,
} from '@/lib/mcp/utils'

const logger = createLogger('McpToolExecutionAPI')

export const dynamic = 'force-dynamic'

interface SchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  description?: string
  enum?: unknown[]
  format?: string
  items?: SchemaProperty
  properties?: Record<string, SchemaProperty>
}

interface ToolExecutionResult {
  success: boolean
  output?: McpToolResult
  error?: string
}

function hasType(prop: unknown): prop is SchemaProperty {
  return typeof prop === 'object' && prop !== null && 'type' in prop
}

/**
 * POST - Execute a tool on an MCP server
 */
export const POST = withMcpAuth('read')(
  async (request: NextRequest, { userId, workspaceId, requestId }) => {
    try {
      const body = getParsedBody(request) || (await request.json())

      logger.info(`[${requestId}] MCP tool execution request received`, {
        hasAuthHeader: !!request.headers.get('authorization'),
        authHeaderType: request.headers.get('authorization')?.substring(0, 10),
        bodyKeys: Object.keys(body),
        serverId: body.serverId,
        toolName: body.toolName,
        hasWorkflowId: !!body.workflowId,
        workflowId: body.workflowId,
        userId: userId,
      })

      const { serverId, toolName, arguments: rawArgs } = body
      const args = rawArgs || {}

      const serverIdValidation = validateStringParam(serverId, 'serverId')
      if (!serverIdValidation.isValid) {
        logger.warn(`[${requestId}] Invalid serverId: ${serverId}`)
        return createMcpErrorResponse(new Error(serverIdValidation.error), 'Invalid serverId', 400)
      }

      const toolNameValidation = validateStringParam(toolName, 'toolName')
      if (!toolNameValidation.isValid) {
        logger.warn(`[${requestId}] Invalid toolName: ${toolName}`)
        return createMcpErrorResponse(new Error(toolNameValidation.error), 'Invalid toolName', 400)
      }

      logger.info(
        `[${requestId}] Executing tool ${toolName} on server ${serverId} for user ${userId} in workspace ${workspaceId}`
      )

      let tool: McpTool | null = null
      try {
        if (body.toolSchema) {
          tool = {
            name: toolName,
            inputSchema: body.toolSchema,
            serverId: serverId,
            serverName: 'provided-schema',
          } as McpTool
          logger.debug(`[${requestId}] Using provided schema for ${toolName}, skipping discovery`)
        } else {
          const tools = await mcpService.discoverServerTools(userId, serverId, workspaceId)
          tool = tools.find((t) => t.name === toolName) ?? null

          if (!tool) {
            return createMcpErrorResponse(
              new Error(
                `Tool ${toolName} not found on server ${serverId}. Available tools: ${tools.map((t) => t.name).join(', ')}`
              ),
              'Tool not found',
              404
            )
          }
        }

        if (tool.inputSchema?.properties) {
          for (const [paramName, paramSchema] of Object.entries(tool.inputSchema.properties)) {
            const schema = paramSchema as any
            const value = args[paramName]

            if (value === undefined || value === null) {
              continue
            }

            if (
              (schema.type === 'number' || schema.type === 'integer') &&
              typeof value === 'string'
            ) {
              const numValue =
                schema.type === 'integer' ? Number.parseInt(value) : Number.parseFloat(value)
              if (!Number.isNaN(numValue)) {
                args[paramName] = numValue
              }
            } else if (schema.type === 'boolean' && typeof value === 'string') {
              if (value.toLowerCase() === 'true') {
                args[paramName] = true
              } else if (value.toLowerCase() === 'false') {
                args[paramName] = false
              }
            } else if (schema.type === 'array' && typeof value === 'string') {
              const stringValue = value.trim()
              if (stringValue) {
                try {
                  const parsed = JSON.parse(stringValue)
                  if (Array.isArray(parsed)) {
                    args[paramName] = parsed
                  } else {
                    args[paramName] = [parsed]
                  }
                } catch {
                  if (stringValue.includes(',')) {
                    args[paramName] = stringValue
                      .split(',')
                      .map((item) => item.trim())
                      .filter((item) => item)
                  } else {
                    args[paramName] = [stringValue]
                  }
                }
              } else {
                args[paramName] = []
              }
            }
          }
        }
      } catch (error) {
        logger.warn(
          `[${requestId}] Failed to discover tools for validation, proceeding anyway:`,
          error
        )
      }

      if (tool) {
        const validationError = validateToolArguments(tool, args)
        if (validationError) {
          logger.warn(`[${requestId}] Tool validation failed: ${validationError}`)
          return createMcpErrorResponse(
            new Error(`Invalid arguments for tool ${toolName}: ${validationError}`),
            'Invalid tool arguments',
            400
          )
        }
      }

      const toolCall: McpToolCall = {
        name: toolName,
        arguments: args,
      }

      const result = await Promise.race([
        mcpService.executeTool(userId, serverId, toolCall, workspaceId),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Tool execution timeout')),
            MCP_CONSTANTS.EXECUTION_TIMEOUT
          )
        ),
      ])

      const transformedResult = transformToolResult(result)

      if (result.isError) {
        logger.warn(`[${requestId}] Tool execution returned error for ${toolName} on ${serverId}`)
        return createMcpErrorResponse(
          transformedResult,
          transformedResult.error || 'Tool execution failed',
          400
        )
      }
      logger.info(`[${requestId}] Successfully executed tool ${toolName} on server ${serverId}`)

      try {
        const { trackPlatformEvent } = await import('@/lib/core/telemetry')
        trackPlatformEvent('platform.mcp.tool_executed', {
          'mcp.server_id': serverId,
          'mcp.tool_name': toolName,
          'mcp.execution_status': 'success',
          'workspace.id': workspaceId,
        })
      } catch {
        // Telemetry failure is non-critical
      }

      return createMcpSuccessResponse(transformedResult)
    } catch (error) {
      logger.error(`[${requestId}] Error executing MCP tool:`, error)

      const { message, status } = categorizeError(error)
      return createMcpErrorResponse(new Error(message), message, status)
    }
  }
)

function validateToolArguments(tool: McpTool, args: Record<string, unknown>): string | null {
  if (!tool.inputSchema) {
    return null
  }

  const schema = tool.inputSchema

  if (schema.required && Array.isArray(schema.required)) {
    for (const requiredProp of schema.required) {
      if (!(requiredProp in (args || {}))) {
        return `Missing required property: ${requiredProp}`
      }
    }
  }

  if (schema.properties && args) {
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const propValue = args[propName]
      if (propValue !== undefined && hasType(propSchema)) {
        const expectedType = propSchema.type
        const actualType = typeof propValue

        if (expectedType === 'string' && actualType !== 'string') {
          return `Property ${propName} must be a string`
        }
        if (expectedType === 'number' && actualType !== 'number') {
          return `Property ${propName} must be a number`
        }
        if (expectedType === 'boolean' && actualType !== 'boolean') {
          return `Property ${propName} must be a boolean`
        }
        if (
          expectedType === 'object' &&
          (actualType !== 'object' || propValue === null || Array.isArray(propValue))
        ) {
          return `Property ${propName} must be an object`
        }
        if (expectedType === 'array' && !Array.isArray(propValue)) {
          return `Property ${propName} must be an array`
        }
      }
    }
  }

  return null
}

function transformToolResult(result: McpToolResult): ToolExecutionResult {
  if (result.isError) {
    return {
      success: false,
      error: result.content?.[0]?.text || 'Tool execution failed',
    }
  }

  return {
    success: true,
    output: result,
  }
}
```

--------------------------------------------------------------------------------

````
