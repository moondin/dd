---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 632
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 632 of 933)

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

---[FILE: permissions.ts]---
Location: sim-main/apps/sim/socket-server/middleware/permissions.ts

```typescript
import { db } from '@sim/db'
import { workflow } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('SocketPermissions')

// Define operation permissions based on role
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'add',
    'remove',
    'update',
    'update-position',
    'update-name',
    'toggle-enabled',
    'update-parent',
    'update-wide',
    'update-advanced-mode',
    'update-trigger-mode',
    'toggle-handles',
    'duplicate',
    'replace-state',
  ],
  write: [
    'add',
    'remove',
    'update',
    'update-position',
    'update-name',
    'toggle-enabled',
    'update-parent',
    'update-wide',
    'update-advanced-mode',
    'update-trigger-mode',
    'toggle-handles',
    'duplicate',
    'replace-state',
  ],
  read: ['update-position'],
}

// Check if a role allows a specific operation (no DB query, pure logic)
export function checkRolePermission(
  role: string,
  operation: string
): { allowed: boolean; reason?: string } {
  const allowedOperations = ROLE_PERMISSIONS[role] || []

  if (!allowedOperations.includes(operation)) {
    return {
      allowed: false,
      reason: `Role '${role}' not permitted to perform '${operation}'`,
    }
  }

  return { allowed: true }
}

export async function verifyWorkspaceMembership(
  userId: string,
  workspaceId: string
): Promise<string | null> {
  try {
    const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
    return permission
  } catch (error) {
    logger.error(`Error verifying workspace permissions for ${userId} in ${workspaceId}:`, error)
    return null
  }
}

export async function verifyWorkflowAccess(
  userId: string,
  workflowId: string
): Promise<{ hasAccess: boolean; role?: string; workspaceId?: string }> {
  try {
    const workflowData = await db
      .select({
        userId: workflow.userId,
        workspaceId: workflow.workspaceId,
        name: workflow.name,
      })
      .from(workflow)
      .where(eq(workflow.id, workflowId))
      .limit(1)

    if (!workflowData.length) {
      logger.warn(`Workflow ${workflowId} not found`)
      return { hasAccess: false }
    }

    const { userId: workflowUserId, workspaceId, name: workflowName } = workflowData[0]

    // Check if user owns the workflow - treat as admin
    if (workflowUserId === userId) {
      logger.debug(
        `User ${userId} has admin access to workflow ${workflowId} (${workflowName}) as owner`
      )
      return { hasAccess: true, role: 'admin', workspaceId: workspaceId || undefined }
    }

    // Check workspace membership if workflow belongs to a workspace
    if (workspaceId) {
      const userRole = await verifyWorkspaceMembership(userId, workspaceId)
      if (userRole) {
        logger.debug(
          `User ${userId} has ${userRole} access to workflow ${workflowId} via workspace ${workspaceId}`
        )
        return { hasAccess: true, role: userRole, workspaceId }
      }
      logger.warn(
        `User ${userId} is not a member of workspace ${workspaceId} for workflow ${workflowId}`
      )
      return { hasAccess: false }
    }

    // Workflow doesn't belong to a workspace and user doesn't own it
    logger.warn(`User ${userId} has no access to workflow ${workflowId} (no workspace, not owner)`)
    return { hasAccess: false }
  } catch (error) {
    logger.error(
      `Error verifying workflow access for user ${userId}, workflow ${workflowId}:`,
      error
    )
    return { hasAccess: false }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: manager.ts]---
Location: sim-main/apps/sim/socket-server/rooms/manager.ts

```typescript
import * as schema from '@sim/db/schema'
import { workflowBlocks, workflowEdges } from '@sim/db/schema'
import { and, eq, isNull } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import type { Server } from 'socket.io'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const connectionString = env.DATABASE_URL
const db = drizzle(
  postgres(connectionString, {
    prepare: false,
    idle_timeout: 15,
    connect_timeout: 20,
    max: 3,
    onnotice: () => {},
  }),
  { schema }
)

const logger = createLogger('RoomManager')

export interface UserPresence {
  userId: string
  workflowId: string
  userName: string
  socketId: string
  joinedAt: number
  lastActivity: number
  role: string
  cursor?: { x: number; y: number }
  selection?: { type: 'block' | 'edge' | 'none'; id?: string }
  avatarUrl?: string | null
}

export interface WorkflowRoom {
  workflowId: string
  users: Map<string, UserPresence> // socketId -> UserPresence
  lastModified: number
  activeConnections: number
}

export class RoomManager {
  private workflowRooms = new Map<string, WorkflowRoom>()
  private socketToWorkflow = new Map<string, string>()
  private userSessions = new Map<
    string,
    { userId: string; userName: string; avatarUrl?: string | null }
  >()
  private io: Server

  constructor(io: Server) {
    this.io = io
  }

  createWorkflowRoom(workflowId: string): WorkflowRoom {
    return {
      workflowId,
      users: new Map(),
      lastModified: Date.now(),
      activeConnections: 0,
    }
  }

  cleanupUserFromRoom(socketId: string, workflowId: string) {
    const room = this.workflowRooms.get(workflowId)
    if (room) {
      room.users.delete(socketId)
      room.activeConnections = Math.max(0, room.activeConnections - 1)

      if (room.activeConnections === 0) {
        this.workflowRooms.delete(workflowId)
        logger.info(`Cleaned up empty workflow room: ${workflowId}`)
      }
    }

    this.socketToWorkflow.delete(socketId)
    this.userSessions.delete(socketId)
  }

  handleWorkflowDeletion(workflowId: string) {
    logger.info(`Handling workflow deletion notification for ${workflowId}`)

    const room = this.workflowRooms.get(workflowId)
    if (!room) {
      logger.debug(`No active room found for deleted workflow ${workflowId}`)
      return
    }

    this.io.to(workflowId).emit('workflow-deleted', {
      workflowId,
      message: 'This workflow has been deleted',
      timestamp: Date.now(),
    })

    const socketsToDisconnect: string[] = []
    room.users.forEach((_presence, socketId) => {
      socketsToDisconnect.push(socketId)
    })

    socketsToDisconnect.forEach((socketId) => {
      const socket = this.io.sockets.sockets.get(socketId)
      if (socket) {
        socket.leave(workflowId)
        logger.debug(`Disconnected socket ${socketId} from deleted workflow ${workflowId}`)
      }
      this.cleanupUserFromRoom(socketId, workflowId)
    })

    this.workflowRooms.delete(workflowId)
    logger.info(
      `Cleaned up workflow room ${workflowId} after deletion (${socketsToDisconnect.length} users disconnected)`
    )
  }

  handleWorkflowRevert(workflowId: string, timestamp: number) {
    logger.info(`Handling workflow revert notification for ${workflowId}`)

    const room = this.workflowRooms.get(workflowId)
    if (!room) {
      logger.debug(`No active room found for reverted workflow ${workflowId}`)
      return
    }

    this.io.to(workflowId).emit('workflow-reverted', {
      workflowId,
      message: 'Workflow has been reverted to deployed state',
      timestamp,
    })

    room.lastModified = timestamp

    logger.info(`Notified ${room.users.size} users about workflow revert: ${workflowId}`)
  }

  handleWorkflowUpdate(workflowId: string) {
    logger.info(`Handling workflow update notification for ${workflowId}`)

    const room = this.workflowRooms.get(workflowId)
    if (!room) {
      logger.debug(`No active room found for updated workflow ${workflowId}`)
      return
    }

    const timestamp = Date.now()

    // Notify all clients in the workflow room that the workflow has been updated
    // This will trigger them to refresh their local state
    this.io.to(workflowId).emit('workflow-updated', {
      workflowId,
      message: 'Workflow has been updated externally',
      timestamp,
    })

    room.lastModified = timestamp

    logger.info(`Notified ${room.users.size} users about workflow update: ${workflowId}`)
  }

  handleCopilotWorkflowEdit(workflowId: string, description?: string) {
    logger.info(`Handling copilot workflow edit notification for ${workflowId}`)

    const room = this.workflowRooms.get(workflowId)
    if (!room) {
      logger.debug(`No active room found for copilot workflow edit ${workflowId}`)
      return
    }

    const timestamp = Date.now()

    // Emit special event for copilot edits that tells clients to rehydrate from database
    this.io.to(workflowId).emit('copilot-workflow-edit', {
      workflowId,
      description,
      message: 'Copilot has edited the workflow - rehydrating from database',
      timestamp,
    })

    room.lastModified = timestamp

    logger.info(`Notified ${room.users.size} users about copilot workflow edit: ${workflowId}`)
  }

  async validateWorkflowConsistency(
    workflowId: string
  ): Promise<{ valid: boolean; issues: string[] }> {
    try {
      const issues: string[] = []

      const orphanedEdges = await db
        .select({
          id: workflowEdges.id,
          sourceBlockId: workflowEdges.sourceBlockId,
          targetBlockId: workflowEdges.targetBlockId,
        })
        .from(workflowEdges)
        .leftJoin(workflowBlocks, eq(workflowEdges.sourceBlockId, workflowBlocks.id))
        .where(and(eq(workflowEdges.workflowId, workflowId), isNull(workflowBlocks.id)))

      if (orphanedEdges.length > 0) {
        issues.push(`Found ${orphanedEdges.length} orphaned edges with missing source blocks`)
      }

      return { valid: issues.length === 0, issues }
    } catch (error) {
      logger.error('Error validating workflow consistency:', error)
      return { valid: false, issues: ['Consistency check failed'] }
    }
  }

  getWorkflowRooms(): ReadonlyMap<string, WorkflowRoom> {
    return this.workflowRooms
  }

  getSocketToWorkflow(): ReadonlyMap<string, string> {
    return this.socketToWorkflow
  }

  getUserSessions(): ReadonlyMap<string, { userId: string; userName: string }> {
    return this.userSessions
  }

  hasWorkflowRoom(workflowId: string): boolean {
    return this.workflowRooms.has(workflowId)
  }

  getWorkflowRoom(workflowId: string): WorkflowRoom | undefined {
    return this.workflowRooms.get(workflowId)
  }

  setWorkflowRoom(workflowId: string, room: WorkflowRoom): void {
    this.workflowRooms.set(workflowId, room)
  }

  getWorkflowIdForSocket(socketId: string): string | undefined {
    return this.socketToWorkflow.get(socketId)
  }

  setWorkflowForSocket(socketId: string, workflowId: string): void {
    this.socketToWorkflow.set(socketId, workflowId)
  }

  getUserSession(
    socketId: string
  ): { userId: string; userName: string; avatarUrl?: string | null } | undefined {
    return this.userSessions.get(socketId)
  }

  setUserSession(
    socketId: string,
    session: { userId: string; userName: string; avatarUrl?: string | null }
  ): void {
    this.userSessions.set(socketId, session)
  }

  getTotalActiveConnections(): number {
    return Array.from(this.workflowRooms.values()).reduce(
      (total, room) => total + room.activeConnections,
      0
    )
  }

  broadcastPresenceUpdate(workflowId: string): void {
    const room = this.workflowRooms.get(workflowId)
    if (room) {
      const roomPresence = Array.from(room.users.values())
      this.io.to(workflowId).emit('presence-update', roomPresence)
    }
  }

  emitToWorkflow<T = unknown>(workflowId: string, event: string, payload: T): void {
    this.io.to(workflowId).emit(event, payload)
  }

  /**
   * Get the number of unique users in a workflow room
   * (not the number of socket connections)
   */
  getUniqueUserCount(workflowId: string): number {
    const room = this.workflowRooms.get(workflowId)
    if (!room) return 0

    const uniqueUsers = new Set<string>()
    room.users.forEach((presence) => {
      uniqueUsers.add(presence.userId)
    })

    return uniqueUsers.size
  }
}
```

--------------------------------------------------------------------------------

---[FILE: http.ts]---
Location: sim-main/apps/sim/socket-server/routes/http.ts

```typescript
import type { IncomingMessage, ServerResponse } from 'http'
import type { RoomManager } from '@/socket-server/rooms/manager'

interface Logger {
  info: (message: string, ...args: any[]) => void
  error: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
}

/**
 * Creates an HTTP request handler for the socket server
 * @param roomManager - RoomManager instance for managing workflow rooms and state
 * @param logger - Logger instance for logging requests and errors
 * @returns HTTP request handler function
 */
export function createHttpHandler(roomManager: RoomManager, logger: Logger) {
  return (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          connections: roomManager.getTotalActiveConnections(),
        })
      )
      return
    }

    // Handle workflow deletion notifications from the main API
    if (req.method === 'POST' && req.url === '/api/workflow-deleted') {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        try {
          const { workflowId } = JSON.parse(body)
          roomManager.handleWorkflowDeletion(workflowId)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true }))
        } catch (error) {
          logger.error('Error handling workflow deletion notification:', error)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Failed to process deletion notification' }))
        }
      })
      return
    }

    // Handle workflow update notifications from the main API
    if (req.method === 'POST' && req.url === '/api/workflow-updated') {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        try {
          const { workflowId } = JSON.parse(body)
          roomManager.handleWorkflowUpdate(workflowId)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true }))
        } catch (error) {
          logger.error('Error handling workflow update notification:', error)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Failed to process update notification' }))
        }
      })
      return
    }

    // Handle copilot workflow edit notifications from the main API
    if (req.method === 'POST' && req.url === '/api/copilot-workflow-edit') {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        try {
          const { workflowId, description } = JSON.parse(body)
          roomManager.handleCopilotWorkflowEdit(workflowId, description)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true }))
        } catch (error) {
          logger.error('Error handling copilot workflow edit notification:', error)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Failed to process copilot edit notification' }))
        }
      })
      return
    }

    // Handle workflow revert notifications from the main API
    if (req.method === 'POST' && req.url === '/api/workflow-reverted') {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        try {
          const { workflowId, timestamp } = JSON.parse(body)
          roomManager.handleWorkflowRevert(workflowId, timestamp)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true }))
        } catch (error) {
          logger.error('Error handling workflow revert notification:', error)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Failed to process revert notification' }))
        }
      })
      return
    }

    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
}
```

--------------------------------------------------------------------------------

---[FILE: socket-server.test.ts]---
Location: sim-main/apps/sim/socket-server/tests/socket-server.test.ts

```typescript
import { createServer } from 'http'
import { Server } from 'socket.io'
import { io, type Socket } from 'socket.io-client'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Socket Server Integration Tests', () => {
  let httpServer: any
  let socketServer: Server
  let clientSocket: Socket
  let serverPort: number

  beforeAll(async () => {
    httpServer = createServer()
    socketServer = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    })

    await new Promise<void>((resolve) => {
      httpServer.listen(() => {
        serverPort = httpServer.address()?.port
        resolve()
      })
    })

    socketServer.on('connection', (socket) => {
      socket.on('join-workflow', ({ workflowId }) => {
        socket.join(workflowId)
        socket.emit('joined-workflow', { workflowId })
      })

      socket.on('workflow-operation', (data) => {
        socket.to(data.workflowId || 'test-workflow').emit('workflow-operation', {
          ...data,
          senderId: socket.id,
        })
      })
    })

    clientSocket = io(`http://localhost:${serverPort}`, {
      transports: ['polling', 'websocket'],
    })

    await new Promise<void>((resolve) => {
      clientSocket.on('connect', () => {
        resolve()
      })
    })
  })

  afterAll(async () => {
    if (clientSocket) {
      clientSocket.close()
    }
    if (socketServer) {
      socketServer.close()
    }
    if (httpServer) {
      httpServer.close()
    }
  })

  it('should connect to socket server', () => {
    expect(clientSocket.connected).toBe(true)
  })

  it('should join workflow room', async () => {
    const workflowId = 'test-workflow-123'

    const joinedPromise = new Promise<void>((resolve) => {
      clientSocket.once('joined-workflow', (data) => {
        expect(data.workflowId).toBe(workflowId)
        resolve()
      })
    })

    clientSocket.emit('join-workflow', { workflowId })
    await joinedPromise
  })

  it('should broadcast workflow operations', async () => {
    const workflowId = 'test-workflow-456'

    const client2 = io(`http://localhost:${serverPort}`)
    await new Promise<void>((resolve) => {
      client2.once('connect', resolve)
    })

    try {
      const join1Promise = new Promise<void>((resolve) => {
        clientSocket.once('joined-workflow', () => resolve())
      })
      const join2Promise = new Promise<void>((resolve) => {
        client2.once('joined-workflow', () => resolve())
      })

      clientSocket.emit('join-workflow', { workflowId })
      client2.emit('join-workflow', { workflowId })

      await Promise.all([join1Promise, join2Promise])

      const operationPromise = new Promise<void>((resolve) => {
        client2.once('workflow-operation', (data) => {
          expect(data.operation).toBe('add')
          expect(data.target).toBe('block')
          expect(data.payload.id).toBe('block-123')
          resolve()
        })
      })

      clientSocket.emit('workflow-operation', {
        workflowId,
        operation: 'add',
        target: 'block',
        payload: { id: 'block-123', type: 'action', name: 'Test Block' },
        timestamp: Date.now(),
      })

      await operationPromise
    } finally {
      client2.close()
    }
  })

  it('should handle multiple concurrent connections', async () => {
    const numClients = 10
    const clients: Socket[] = []
    const workflowId = 'stress-test-workflow'

    try {
      const connectPromises = Array.from({ length: numClients }, () => {
        const client = io(`http://localhost:${serverPort}`)
        clients.push(client)
        return new Promise<void>((resolve) => {
          client.once('connect', resolve)
        })
      })

      await Promise.all(connectPromises)

      const joinPromises = clients.map((client) => {
        return new Promise<void>((resolve) => {
          client.once('joined-workflow', () => resolve())
        })
      })

      clients.forEach((client) => {
        client.emit('join-workflow', { workflowId })
      })

      await Promise.all(joinPromises)

      let receivedCount = 0
      const expectedCount = numClients - 1

      const operationPromise = new Promise<void>((resolve) => {
        clients.forEach((client, index) => {
          if (index === 0) return

          client.once('workflow-operation', () => {
            receivedCount++
            if (receivedCount === expectedCount) {
              resolve()
            }
          })
        })
      })

      clients[0].emit('workflow-operation', {
        workflowId,
        operation: 'add',
        target: 'block',
        payload: { id: 'stress-block', type: 'action' },
        timestamp: Date.now(),
      })

      await operationPromise
      expect(receivedCount).toBe(expectedCount)
    } finally {
      clients.forEach((client) => client.close())
    }
  })

  it('should handle rapid operations without loss', async () => {
    const workflowId = 'rapid-test-workflow'
    const numOperations = 50

    const client2 = io(`http://localhost:${serverPort}`)
    await new Promise<void>((resolve) => {
      client2.once('connect', resolve)
    })

    try {
      const join1Promise = new Promise<void>((resolve) => {
        clientSocket.once('joined-workflow', () => resolve())
      })
      const join2Promise = new Promise<void>((resolve) => {
        client2.once('joined-workflow', () => resolve())
      })

      clientSocket.emit('join-workflow', { workflowId })
      client2.emit('join-workflow', { workflowId })

      await Promise.all([join1Promise, join2Promise])

      let receivedCount = 0
      const receivedOperations = new Set<string>()

      const operationsPromise = new Promise<void>((resolve) => {
        client2.on('workflow-operation', (data) => {
          receivedCount++
          receivedOperations.add(data.payload.id)

          if (receivedCount === numOperations) {
            resolve()
          }
        })
      })

      for (let i = 0; i < numOperations; i++) {
        clientSocket.emit('workflow-operation', {
          workflowId,
          operation: 'add',
          target: 'block',
          payload: { id: `rapid-block-${i}`, type: 'action' },
          timestamp: Date.now(),
        })
      }

      await operationsPromise
      expect(receivedCount).toBe(numOperations)
      expect(receivedOperations.size).toBe(numOperations)
    } finally {
      client2.close()
    }
  })
})
```

--------------------------------------------------------------------------------

---[FILE: schemas.ts]---
Location: sim-main/apps/sim/socket-server/validation/schemas.ts
Signals: Zod

```typescript
import { z } from 'zod'

const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
})

// Schema for auto-connect edge data
const AutoConnectEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
  type: z.string().optional(),
})

export const BlockOperationSchema = z.object({
  operation: z.enum([
    'add',
    'remove',
    'update-position',
    'update-name',
    'toggle-enabled',
    'update-parent',
    'update-wide',
    'update-advanced-mode',
    'update-trigger-mode',
    'toggle-handles',
    'duplicate',
  ]),
  target: z.literal('block'),
  payload: z.object({
    id: z.string(),
    sourceId: z.string().optional(), // For duplicate operations
    type: z.string().optional(),
    name: z.string().optional(),
    position: PositionSchema.optional(),
    commit: z.boolean().optional(),
    data: z.record(z.any()).optional(),
    subBlocks: z.record(z.any()).optional(),
    outputs: z.record(z.any()).optional(),
    parentId: z.string().nullable().optional(),
    extent: z.enum(['parent']).nullable().optional(),
    enabled: z.boolean().optional(),
    horizontalHandles: z.boolean().optional(),
    advancedMode: z.boolean().optional(),
    triggerMode: z.boolean().optional(),
    height: z.number().optional(),
    autoConnectEdge: AutoConnectEdgeSchema.optional(), // Add support for auto-connect edges
  }),
  timestamp: z.number(),
  operationId: z.string().optional(),
})

export const EdgeOperationSchema = z.object({
  operation: z.enum(['add', 'remove']),
  target: z.literal('edge'),
  payload: z.object({
    id: z.string(),
    source: z.string().optional(),
    target: z.string().optional(),
    sourceHandle: z.string().nullable().optional(),
    targetHandle: z.string().nullable().optional(),
  }),
  timestamp: z.number(),
  operationId: z.string().optional(),
})

export const SubflowOperationSchema = z.object({
  operation: z.enum(['add', 'remove', 'update']),
  target: z.literal('subflow'),
  payload: z.object({
    id: z.string(),
    type: z.enum(['loop', 'parallel']).optional(),
    config: z.record(z.any()).optional(),
  }),
  timestamp: z.number(),
  operationId: z.string().optional(),
})

export const VariableOperationSchema = z.union([
  z.object({
    operation: z.literal('add'),
    target: z.literal('variable'),
    payload: z.object({
      id: z.string(),
      name: z.string(),
      type: z.any(),
      value: z.any(),
      workflowId: z.string(),
    }),
    timestamp: z.number(),
    operationId: z.string().optional(),
  }),
  z.object({
    operation: z.literal('remove'),
    target: z.literal('variable'),
    payload: z.object({
      variableId: z.string(),
    }),
    timestamp: z.number(),
    operationId: z.string().optional(),
  }),
  z.object({
    operation: z.literal('duplicate'),
    target: z.literal('variable'),
    payload: z.object({
      sourceVariableId: z.string(),
      id: z.string(),
    }),
    timestamp: z.number(),
    operationId: z.string().optional(),
  }),
])

export const WorkflowStateOperationSchema = z.object({
  operation: z.literal('replace-state'),
  target: z.literal('workflow'),
  payload: z.object({
    state: z.any(), // Full workflow state
  }),
  timestamp: z.number(),
  operationId: z.string().optional(),
})

export const WorkflowOperationSchema = z.union([
  BlockOperationSchema,
  EdgeOperationSchema,
  SubflowOperationSchema,
  VariableOperationSchema,
  WorkflowStateOperationSchema,
])

export { PositionSchema, AutoConnectEdgeSchema }
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/stores/constants.ts

```typescript
export const API_ENDPOINTS = {
  ENVIRONMENT: '/api/environment',
  SCHEDULE: '/api/schedules',
  SETTINGS: '/api/settings',
  WORKFLOWS: '/api/workflows',
  WORKSPACE_PERMISSIONS: (id: string) => `/api/workspaces/${id}/permissions`,
  WORKSPACE_ENVIRONMENT: (id: string) => `/api/workspaces/${id}/environment`,
}

export const COPILOT_TOOL_DISPLAY_NAMES: Record<string, string> = {
  search_documentation: 'Searching documentation',
  get_user_workflow: 'Analyzing your workflow',
  get_blocks_and_tools: 'Getting block information',
  get_blocks_metadata: 'Getting block metadata',
  get_yaml_structure: 'Analyzing workflow structure',
  get_edit_workflow_examples: 'Viewing workflow examples',
  get_environment_variables: 'Viewing environment variables',
  set_environment_variables: 'Setting environment variables',
  get_workflow_console: 'Reading workflow console',
  edit_workflow: 'Updating workflow',
  run_workflow: 'Executing workflow',
  search_online: 'Searching online',
  plan: 'Designing an approach',
  reason: 'Reasoning about your workflow',
} as const

export const COPILOT_TOOL_PAST_TENSE: Record<string, string> = {
  search_documentation: 'Searched documentation',
  get_user_workflow: 'Analyzed your workflow',
  get_blocks_and_tools: 'Retrieved block information',
  get_blocks_metadata: 'Retrieved block metadata',
  get_yaml_structure: 'Analyzed workflow structure',
  get_edit_workflow_examples: 'Viewed workflow examples',
  get_environment_variables: 'Found environment variables',
  set_environment_variables: 'Set environment variables',
  get_workflow_console: 'Read workflow console',
  edit_workflow: 'Updated workflow',
  run_workflow: 'Executed workflow',
  search_online: 'Searched online',
  plan: 'Designed an approach',
  reason: 'Finished reasoning',
} as const

export const COPILOT_TOOL_ERROR_NAMES: Record<string, string> = {
  search_documentation: 'Errored searching documentation',
  get_user_workflow: 'Errored analyzing your workflow',
  get_blocks_and_tools: 'Errored getting block information',
  get_blocks_metadata: 'Errored getting block metadata',
  get_yaml_structure: 'Errored analyzing workflow structure',
  get_edit_workflow_examples: 'Errored getting workflow examples',
  get_environment_variables: 'Errored getting environment variables',
  set_environment_variables: 'Errored setting environment variables',
  get_workflow_console: 'Errored getting workflow console',
  edit_workflow: 'Errored updating workflow',
  run_workflow: 'Errored running workflow',
  search_online: 'Errored searching online',
  plan: 'Errored planning approach',
  reason: 'Errored reasoning through problem',
} as const

export type CopilotToolId = keyof typeof COPILOT_TOOL_DISPLAY_NAMES
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/stores/index.ts
Signals: React

```typescript
'use client'

import { useEffect } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { useCustomToolsStore } from '@/stores/custom-tools/store'
import { useExecutionStore } from '@/stores/execution/store'
import { useCopilotStore } from '@/stores/panel/copilot/store'
import { useVariablesStore } from '@/stores/panel/variables/store'
import { useEnvironmentStore } from '@/stores/settings/environment/store'
import { useTerminalConsoleStore } from '@/stores/terminal'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

const logger = createLogger('Stores')

// Track initialization state
let isInitializing = false
let appFullyInitialized = false
let dataInitialized = false // Flag for actual data loading completion

/**
 * Initialize the application state and sync system
 * localStorage persistence has been removed - relies on DB and Zustand stores only
 */
async function initializeApplication(): Promise<void> {
  if (typeof window === 'undefined' || isInitializing) return

  isInitializing = true
  appFullyInitialized = false

  // Track initialization start time
  const initStartTime = Date.now()

  try {
    // Load environment variables directly from DB
    await useEnvironmentStore.getState().loadEnvironmentVariables()

    // Mark data as initialized only after sync managers have loaded data from DB
    dataInitialized = true

    // Log initialization timing information
    const initDuration = Date.now() - initStartTime
    logger.info(`Application initialization completed in ${initDuration}ms`)

    // Mark application as fully initialized
    appFullyInitialized = true
  } catch (error) {
    logger.error('Error during application initialization:', { error })
    // Still mark as initialized to prevent being stuck in initializing state
    appFullyInitialized = true
    // But don't mark data as initialized on error
    dataInitialized = false
  } finally {
    isInitializing = false
  }
}

/**
 * Checks if application is fully initialized
 */
export function isAppInitialized(): boolean {
  return appFullyInitialized
}

/**
 * Checks if data has been loaded from the database
 * This should be checked before any sync operations
 */
export function isDataInitialized(): boolean {
  return dataInitialized
}

/**
 * Handle application cleanup before unload
 */
function handleBeforeUnload(event: BeforeUnloadEvent): void {
  // Check if we're on an authentication page and skip confirmation if we are
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    // Skip confirmation for auth-related pages
    if (
      path === '/login' ||
      path === '/signup' ||
      path === '/reset-password' ||
      path === '/verify'
    ) {
      return
    }
  }

  // Standard beforeunload pattern
  event.preventDefault()
  event.returnValue = ''
}

/**
 * Clean up sync system
 */
function cleanupApplication(): void {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  // Note: No sync managers to dispose - Socket.IO handles cleanup
}

/**
 * Clear all user data when signing out
 * localStorage persistence has been removed
 */
export async function clearUserData(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    // Note: No sync managers to dispose - Socket.IO handles cleanup

    // Reset all stores to their initial state
    resetAllStores()

    // Clear localStorage except for essential app settings (minimal usage)
    const keysToKeep = ['next-favicon', 'theme']
    const keysToRemove = Object.keys(localStorage).filter((key) => !keysToKeep.includes(key))
    keysToRemove.forEach((key) => localStorage.removeItem(key))

    // Reset application initialization state
    appFullyInitialized = false
    dataInitialized = false

    logger.info('User data cleared successfully')
  } catch (error) {
    logger.error('Error clearing user data:', { error })
  }
}

/**
 * Hook to manage application lifecycle
 */
export function useAppInitialization() {
  useEffect(() => {
    // Use Promise to handle async initialization
    initializeApplication()

    return () => {
      cleanupApplication()
    }
  }, [])
}

/**
 * Hook to reinitialize the application after successful login
 * Use this in the login success handler or post-login page
 */
export function useLoginInitialization() {
  useEffect(() => {
    reinitializeAfterLogin()
  }, [])
}

/**
 * Reinitialize the application after login
 * This ensures we load fresh data from the database for the new user
 */
export async function reinitializeAfterLogin(): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    // Reset application initialization state
    appFullyInitialized = false
    dataInitialized = false

    // Note: No sync managers to dispose - Socket.IO handles cleanup

    // Clean existing state to avoid stale data
    resetAllStores()

    // Reset initialization flags to force a fresh load
    isInitializing = false

    // Reinitialize the application
    await initializeApplication()

    logger.info('Application reinitialized after login')
  } catch (error) {
    logger.error('Error reinitializing application:', { error })
  }
}

// Initialize immediately when imported on client
if (typeof window !== 'undefined') {
  initializeApplication()
}

// Export all stores
export {
  useWorkflowStore,
  useWorkflowRegistry,
  useEnvironmentStore,
  useExecutionStore,
  useTerminalConsoleStore,
  useCopilotStore,
  useCustomToolsStore,
  useVariablesStore,
  useSubBlockStore,
}

// Helper function to reset all stores
export const resetAllStores = () => {
  // Reset all stores to initial state
  useWorkflowRegistry.setState({
    workflows: {},
    activeWorkflowId: null,
    error: null,
    deploymentStatuses: {},
    hydration: {
      phase: 'idle',
      workspaceId: null,
      workflowId: null,
      requestId: null,
      error: null,
    },
  })
  useWorkflowStore.getState().clear()
  useSubBlockStore.getState().clear()
  useEnvironmentStore.getState().reset()
  useExecutionStore.getState().reset()
  useTerminalConsoleStore.setState({ entries: [], isOpen: false })
  useCopilotStore.setState({ messages: [], isSendingMessage: false, error: null })
  useCustomToolsStore.getState().reset()
  // Variables store has no tracking to reset; registry hydrates
}

// Helper function to log all store states
export const logAllStores = () => {
  const state = {
    workflow: useWorkflowStore.getState(),
    workflowRegistry: useWorkflowRegistry.getState(),
    environment: useEnvironmentStore.getState(),
    execution: useExecutionStore.getState(),
    console: useTerminalConsoleStore.getState(),
    copilot: useCopilotStore.getState(),
    customTools: useCustomToolsStore.getState(),
    subBlock: useSubBlockStore.getState(),
    variables: useVariablesStore.getState(),
  }

  return state
}
```

--------------------------------------------------------------------------------

````
