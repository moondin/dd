---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 631
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 631 of 933)

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

---[FILE: index.ts]---
Location: sim-main/apps/sim/socket-server/handlers/index.ts

```typescript
import { setupConnectionHandlers } from '@/socket-server/handlers/connection'
import { setupOperationsHandlers } from '@/socket-server/handlers/operations'
import { setupPresenceHandlers } from '@/socket-server/handlers/presence'
import { setupSubblocksHandlers } from '@/socket-server/handlers/subblocks'
import { setupVariablesHandlers } from '@/socket-server/handlers/variables'
import { setupWorkflowHandlers } from '@/socket-server/handlers/workflow'
import type { AuthenticatedSocket } from '@/socket-server/middleware/auth'
import type { RoomManager, UserPresence, WorkflowRoom } from '@/socket-server/rooms/manager'

export type { UserPresence, WorkflowRoom }

/**
 * Sets up all socket event handlers for an authenticated socket connection
 * @param socket - The authenticated socket instance
 * @param roomManager - Room manager instance for state management
 */
export function setupAllHandlers(socket: AuthenticatedSocket, roomManager: RoomManager) {
  setupWorkflowHandlers(socket, roomManager)
  setupOperationsHandlers(socket, roomManager)
  setupSubblocksHandlers(socket, roomManager)
  setupVariablesHandlers(socket, roomManager)
  setupPresenceHandlers(socket, roomManager)
  setupConnectionHandlers(socket, roomManager)
}

export {
  setupWorkflowHandlers,
  setupOperationsHandlers,
  setupSubblocksHandlers,
  setupVariablesHandlers,
  setupPresenceHandlers,
  setupConnectionHandlers,
}
```

--------------------------------------------------------------------------------

---[FILE: operations.ts]---
Location: sim-main/apps/sim/socket-server/handlers/operations.ts
Signals: Zod

```typescript
import { ZodError } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { persistWorkflowOperation } from '@/socket-server/database/operations'
import type { HandlerDependencies } from '@/socket-server/handlers/workflow'
import type { AuthenticatedSocket } from '@/socket-server/middleware/auth'
import { checkRolePermission } from '@/socket-server/middleware/permissions'
import type { RoomManager } from '@/socket-server/rooms/manager'
import { WorkflowOperationSchema } from '@/socket-server/validation/schemas'

const logger = createLogger('OperationsHandlers')

export function setupOperationsHandlers(
  socket: AuthenticatedSocket,
  deps: HandlerDependencies | RoomManager
) {
  const roomManager =
    deps instanceof Object && 'roomManager' in deps ? deps.roomManager : (deps as RoomManager)
  socket.on('workflow-operation', async (data) => {
    const workflowId = roomManager.getWorkflowIdForSocket(socket.id)
    const session = roomManager.getUserSession(socket.id)

    if (!workflowId || !session) {
      socket.emit('error', {
        type: 'NOT_JOINED',
        message: 'Not joined to any workflow',
      })
      return
    }

    const room = roomManager.getWorkflowRoom(workflowId)
    if (!room) {
      socket.emit('error', {
        type: 'ROOM_NOT_FOUND',
        message: 'Workflow room not found',
      })
      return
    }

    let operationId: string | undefined

    try {
      const validatedOperation = WorkflowOperationSchema.parse(data)
      operationId = validatedOperation.operationId
      const { operation, target, payload, timestamp } = validatedOperation

      // For position updates, preserve client timestamp to maintain ordering
      // For other operations, use server timestamp for consistency
      const isPositionUpdate = operation === 'update-position' && target === 'block'
      const commitPositionUpdate =
        isPositionUpdate && 'commit' in payload ? payload.commit === true : false
      const operationTimestamp = isPositionUpdate ? timestamp : Date.now()

      // Skip permission checks for non-committed position updates (broadcasts only, no persistence)
      if (isPositionUpdate && !commitPositionUpdate) {
        // Update last activity
        const userPresence = room.users.get(socket.id)
        if (userPresence) {
          userPresence.lastActivity = Date.now()
        }
      } else {
        // Check permissions from cached role for all other operations
        const userPresence = room.users.get(socket.id)
        if (!userPresence) {
          logger.warn(`User presence not found for socket ${socket.id}`)
          socket.emit('operation-forbidden', {
            type: 'SESSION_ERROR',
            message: 'User session not found',
            operation,
            target,
          })
          return
        }

        userPresence.lastActivity = Date.now()

        // Check permissions using cached role (no DB query)
        const permissionCheck = checkRolePermission(userPresence.role, operation)
        if (!permissionCheck.allowed) {
          logger.warn(
            `User ${session.userId} (role: ${userPresence.role}) forbidden from ${operation} on ${target}`
          )
          socket.emit('operation-forbidden', {
            type: 'INSUFFICIENT_PERMISSIONS',
            message: `${permissionCheck.reason} on '${target}'`,
            operation,
            target,
          })
          return
        }
      }

      // Broadcast first for position updates to minimize latency, then persist
      // For other operations, persist first for consistency
      if (isPositionUpdate) {
        // Broadcast position updates immediately for smooth real-time movement
        const broadcastData = {
          operation,
          target,
          payload,
          timestamp: operationTimestamp,
          senderId: socket.id,
          userId: session.userId,
          userName: session.userName,
          metadata: {
            workflowId,
            operationId: crypto.randomUUID(),
            isPositionUpdate: true,
          },
        }

        socket.to(workflowId).emit('workflow-operation', broadcastData)

        if (!commitPositionUpdate) {
          return
        }

        try {
          await persistWorkflowOperation(workflowId, {
            operation,
            target,
            payload,
            timestamp: operationTimestamp,
            userId: session.userId,
          })
          room.lastModified = Date.now()

          if (operationId) {
            socket.emit('operation-confirmed', {
              operationId,
              serverTimestamp: Date.now(),
            })
          }
        } catch (error) {
          logger.error('Failed to persist position update:', error)

          if (operationId) {
            socket.emit('operation-failed', {
              operationId,
              error: error instanceof Error ? error.message : 'Database persistence failed',
              retryable: true,
            })
          }
        }

        return
      }

      if (target === 'variable' && ['add', 'remove', 'duplicate'].includes(operation)) {
        // Persist first, then broadcast
        await persistWorkflowOperation(workflowId, {
          operation,
          target,
          payload,
          timestamp: operationTimestamp,
          userId: session.userId,
        })

        room.lastModified = Date.now()

        const broadcastData = {
          operation,
          target,
          payload,
          timestamp: operationTimestamp,
          senderId: socket.id,
          userId: session.userId,
          userName: session.userName,
          metadata: {
            workflowId,
            operationId: crypto.randomUUID(),
          },
        }

        socket.to(workflowId).emit('workflow-operation', broadcastData)

        if (operationId) {
          socket.emit('operation-confirmed', {
            operationId,
            serverTimestamp: Date.now(),
          })
        }

        return
      }

      if (target === 'workflow' && operation === 'replace-state') {
        // Persist the workflow state replacement to database first
        await persistWorkflowOperation(workflowId, {
          operation,
          target,
          payload,
          timestamp: operationTimestamp,
          userId: session.userId,
        })

        room.lastModified = Date.now()

        const broadcastData = {
          operation,
          target,
          payload,
          timestamp: operationTimestamp,
          senderId: socket.id,
          userId: session.userId,
          userName: session.userName,
          metadata: {
            workflowId,
            operationId: crypto.randomUUID(),
          },
        }

        socket.to(workflowId).emit('workflow-operation', broadcastData)

        if (operationId) {
          socket.emit('operation-confirmed', {
            operationId,
            serverTimestamp: Date.now(),
          })
        }

        return
      }

      // For non-position operations, persist first then broadcast
      await persistWorkflowOperation(workflowId, {
        operation,
        target,
        payload,
        timestamp: operationTimestamp,
        userId: session.userId,
      })

      room.lastModified = Date.now()

      const broadcastData = {
        operation,
        target,
        payload,
        timestamp: operationTimestamp, // Preserve client timestamp for position updates
        senderId: socket.id,
        userId: session.userId,
        userName: session.userName,
        // Add operation metadata for better client handling
        metadata: {
          workflowId,
          operationId: crypto.randomUUID(),
          isPositionUpdate, // Flag to help clients handle position updates specially
        },
      }

      socket.to(workflowId).emit('workflow-operation', broadcastData)

      // Emit confirmation if operationId is provided
      if (operationId) {
        socket.emit('operation-confirmed', {
          operationId,
          serverTimestamp: Date.now(),
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

      // Emit operation-failed for queue-tracked operations
      if (operationId) {
        socket.emit('operation-failed', {
          operationId,
          error: errorMessage,
          retryable: !(error instanceof ZodError), // Don't retry validation errors
        })
      }

      // Also emit legacy operation-error for backward compatibility
      if (error instanceof ZodError) {
        socket.emit('operation-error', {
          type: 'VALIDATION_ERROR',
          message: 'Invalid operation data',
          errors: error.errors,
          operation: data.operation,
          target: data.target,
        })
        logger.warn(`Validation error for operation from ${session.userId}:`, error.errors)
      } else if (error instanceof Error) {
        // Handle specific database errors
        if (error.message.includes('not found')) {
          socket.emit('operation-error', {
            type: 'RESOURCE_NOT_FOUND',
            message: error.message,
            operation: data.operation,
            target: data.target,
          })
        } else if (error.message.includes('duplicate') || error.message.includes('unique')) {
          socket.emit('operation-error', {
            type: 'DUPLICATE_RESOURCE',
            message: 'Resource already exists',
            operation: data.operation,
            target: data.target,
          })
        } else {
          socket.emit('operation-error', {
            type: 'OPERATION_FAILED',
            message: error.message,
            operation: data.operation,
            target: data.target,
          })
        }
        logger.error(
          `Operation error for ${session.userId} (${data.operation} on ${data.target}):`,
          error
        )
      } else {
        socket.emit('operation-error', {
          type: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
          operation: data.operation,
          target: data.target,
        })
        logger.error('Unknown error handling workflow operation:', error)
      }
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: presence.ts]---
Location: sim-main/apps/sim/socket-server/handlers/presence.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { HandlerDependencies } from '@/socket-server/handlers/workflow'
import type { AuthenticatedSocket } from '@/socket-server/middleware/auth'
import type { RoomManager } from '@/socket-server/rooms/manager'

const logger = createLogger('PresenceHandlers')

export function setupPresenceHandlers(
  socket: AuthenticatedSocket,
  deps: HandlerDependencies | RoomManager
) {
  const roomManager =
    deps instanceof Object && 'roomManager' in deps ? deps.roomManager : (deps as RoomManager)
  socket.on('cursor-update', ({ cursor }) => {
    const workflowId = roomManager.getWorkflowIdForSocket(socket.id)
    const session = roomManager.getUserSession(socket.id)

    if (!workflowId || !session) return

    const room = roomManager.getWorkflowRoom(workflowId)
    if (!room) return

    const userPresence = room.users.get(socket.id)
    if (userPresence) {
      userPresence.cursor = cursor
      userPresence.lastActivity = Date.now()
    }

    socket.to(workflowId).emit('cursor-update', {
      socketId: socket.id,
      userId: session.userId,
      userName: session.userName,
      avatarUrl: session.avatarUrl,
      cursor,
    })
  })

  // Handle user selection (for showing what block/element a user has selected)
  socket.on('selection-update', ({ selection }) => {
    const workflowId = roomManager.getWorkflowIdForSocket(socket.id)
    const session = roomManager.getUserSession(socket.id)

    if (!workflowId || !session) return

    const room = roomManager.getWorkflowRoom(workflowId)
    if (!room) return

    const userPresence = room.users.get(socket.id)
    if (userPresence) {
      userPresence.selection = selection
      userPresence.lastActivity = Date.now()
    }

    socket.to(workflowId).emit('selection-update', {
      socketId: socket.id,
      userId: session.userId,
      userName: session.userName,
      avatarUrl: session.avatarUrl,
      selection,
    })
  })
}
```

--------------------------------------------------------------------------------

---[FILE: subblocks.ts]---
Location: sim-main/apps/sim/socket-server/handlers/subblocks.ts

```typescript
import { db } from '@sim/db'
import { workflow, workflowBlocks } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import type { HandlerDependencies } from '@/socket-server/handlers/workflow'
import type { AuthenticatedSocket } from '@/socket-server/middleware/auth'
import type { RoomManager } from '@/socket-server/rooms/manager'

const logger = createLogger('SubblocksHandlers')

type PendingSubblock = {
  latest: { blockId: string; subblockId: string; value: any; timestamp: number }
  timeout: NodeJS.Timeout
  // Map operationId -> socketId to emit confirmations/failures to correct clients
  opToSocket: Map<string, string>
}

// Keyed by `${workflowId}:${blockId}:${subblockId}`
const pendingSubblockUpdates = new Map<string, PendingSubblock>()

export function setupSubblocksHandlers(
  socket: AuthenticatedSocket,
  deps: HandlerDependencies | RoomManager
) {
  const roomManager =
    deps instanceof Object && 'roomManager' in deps ? deps.roomManager : (deps as RoomManager)
  socket.on('subblock-update', async (data) => {
    const workflowId = roomManager.getWorkflowIdForSocket(socket.id)
    const session = roomManager.getUserSession(socket.id)

    if (!workflowId || !session) {
      logger.debug(`Ignoring subblock update: socket not connected to any workflow room`, {
        socketId: socket.id,
        hasWorkflowId: !!workflowId,
        hasSession: !!session,
      })
      return
    }

    const { blockId, subblockId, value, timestamp, operationId } = data
    const room = roomManager.getWorkflowRoom(workflowId)

    if (!room) {
      logger.debug(`Ignoring subblock update: workflow room not found`, {
        socketId: socket.id,
        workflowId,
        blockId,
        subblockId,
      })
      return
    }

    try {
      const userPresence = room.users.get(socket.id)
      if (userPresence) {
        userPresence.lastActivity = Date.now()
      }

      // Server-side debounce/coalesce by workflowId+blockId+subblockId
      const debouncedKey = `${workflowId}:${blockId}:${subblockId}`
      const existing = pendingSubblockUpdates.get(debouncedKey)
      if (existing) {
        clearTimeout(existing.timeout)
        existing.latest = { blockId, subblockId, value, timestamp }
        if (operationId) existing.opToSocket.set(operationId, socket.id)
        existing.timeout = setTimeout(async () => {
          await flushSubblockUpdate(workflowId, existing, roomManager)
          pendingSubblockUpdates.delete(debouncedKey)
        }, 25)
      } else {
        const opToSocket = new Map<string, string>()
        if (operationId) opToSocket.set(operationId, socket.id)
        const timeout = setTimeout(async () => {
          const pending = pendingSubblockUpdates.get(debouncedKey)
          if (pending) {
            await flushSubblockUpdate(workflowId, pending, roomManager)
            pendingSubblockUpdates.delete(debouncedKey)
          }
        }, 25)
        pendingSubblockUpdates.set(debouncedKey, {
          latest: { blockId, subblockId, value, timestamp },
          timeout,
          opToSocket,
        })
      }
    } catch (error) {
      logger.error('Error handling subblock update:', error)

      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // Best-effort failure for the single operation if provided
      if (operationId) {
        socket.emit('operation-failed', {
          operationId,
          error: errorMessage,
          retryable: true,
        })
      }

      // Also emit legacy operation-error for backward compatibility
      socket.emit('operation-error', {
        type: 'SUBBLOCK_UPDATE_FAILED',
        message: `Failed to update subblock ${blockId}.${subblockId}: ${errorMessage}`,
        operation: 'subblock-update',
        target: 'subblock',
      })
    }
  })
}

async function flushSubblockUpdate(
  workflowId: string,
  pending: PendingSubblock,
  roomManager: RoomManager
) {
  const { blockId, subblockId, value, timestamp } = pending.latest
  try {
    // Verify workflow still exists
    const workflowExists = await db
      .select({ id: workflow.id })
      .from(workflow)
      .where(eq(workflow.id, workflowId))
      .limit(1)

    if (workflowExists.length === 0) {
      pending.opToSocket.forEach((socketId, opId) => {
        const sock = (roomManager as any).io?.sockets?.sockets?.get(socketId)
        if (sock) {
          sock.emit('operation-failed', {
            operationId: opId,
            error: 'Workflow not found',
            retryable: false,
          })
        }
      })
      return
    }

    let updateSuccessful = false
    await db.transaction(async (tx) => {
      const [block] = await tx
        .select({ subBlocks: workflowBlocks.subBlocks })
        .from(workflowBlocks)
        .where(and(eq(workflowBlocks.id, blockId), eq(workflowBlocks.workflowId, workflowId)))
        .limit(1)

      if (!block) {
        return
      }

      const subBlocks = (block.subBlocks as any) || {}
      if (!subBlocks[subblockId]) {
        subBlocks[subblockId] = { id: subblockId, type: 'unknown', value }
      } else {
        subBlocks[subblockId] = { ...subBlocks[subblockId], value }
      }

      await tx
        .update(workflowBlocks)
        .set({ subBlocks, updatedAt: new Date() })
        .where(and(eq(workflowBlocks.id, blockId), eq(workflowBlocks.workflowId, workflowId)))

      updateSuccessful = true
    })

    if (updateSuccessful) {
      // Broadcast to other clients (exclude senders to avoid overwriting their local state)
      const senderSocketIds = new Set(pending.opToSocket.values())
      const io = (roomManager as any).io
      if (io) {
        // Get all sockets in the room
        const roomSockets = io.sockets.adapter.rooms.get(workflowId)
        if (roomSockets) {
          roomSockets.forEach((socketId: string) => {
            // Only emit to sockets that didn't send any of the coalesced ops
            if (!senderSocketIds.has(socketId)) {
              const sock = io.sockets.sockets.get(socketId)
              if (sock) {
                sock.emit('subblock-update', {
                  blockId,
                  subblockId,
                  value,
                  timestamp,
                })
              }
            }
          })
        }
      }

      // Confirm all coalesced operationIds
      pending.opToSocket.forEach((socketId, opId) => {
        const sock = (roomManager as any).io?.sockets?.sockets?.get(socketId)
        if (sock) {
          sock.emit('operation-confirmed', { operationId: opId, serverTimestamp: Date.now() })
        }
      })
    } else {
      pending.opToSocket.forEach((socketId, opId) => {
        const sock = (roomManager as any).io?.sockets?.sockets?.get(socketId)
        if (sock) {
          sock.emit('operation-failed', {
            operationId: opId,
            error: 'Block no longer exists',
            retryable: false,
          })
        }
      })
    }
  } catch (error) {
    logger.error('Error flushing subblock update:', error)
    pending.opToSocket.forEach((socketId, opId) => {
      const sock = (roomManager as any).io?.sockets?.sockets?.get(socketId)
      if (sock) {
        sock.emit('operation-failed', {
          operationId: opId,
          error: error instanceof Error ? error.message : 'Unknown error',
          retryable: true,
        })
      }
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: variables.ts]---
Location: sim-main/apps/sim/socket-server/handlers/variables.ts

```typescript
import { db } from '@sim/db'
import { workflow } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import type { HandlerDependencies } from '@/socket-server/handlers/workflow'
import type { AuthenticatedSocket } from '@/socket-server/middleware/auth'
import type { RoomManager } from '@/socket-server/rooms/manager'

const logger = createLogger('VariablesHandlers')

type PendingVariable = {
  latest: { variableId: string; field: string; value: any; timestamp: number }
  timeout: NodeJS.Timeout
  opToSocket: Map<string, string>
}

// Keyed by `${workflowId}:${variableId}:${field}`
const pendingVariableUpdates = new Map<string, PendingVariable>()

export function setupVariablesHandlers(
  socket: AuthenticatedSocket,
  deps: HandlerDependencies | RoomManager
) {
  const roomManager =
    deps instanceof Object && 'roomManager' in deps ? deps.roomManager : (deps as RoomManager)

  socket.on('variable-update', async (data) => {
    const workflowId = roomManager.getWorkflowIdForSocket(socket.id)
    const session = roomManager.getUserSession(socket.id)

    if (!workflowId || !session) {
      logger.debug(`Ignoring variable update: socket not connected to any workflow room`, {
        socketId: socket.id,
        hasWorkflowId: !!workflowId,
        hasSession: !!session,
      })
      return
    }

    const { variableId, field, value, timestamp, operationId } = data
    const room = roomManager.getWorkflowRoom(workflowId)

    if (!room) {
      logger.debug(`Ignoring variable update: workflow room not found`, {
        socketId: socket.id,
        workflowId,
        variableId,
        field,
      })
      return
    }

    try {
      const userPresence = room.users.get(socket.id)
      if (userPresence) {
        userPresence.lastActivity = Date.now()
      }

      const debouncedKey = `${workflowId}:${variableId}:${field}`
      const existing = pendingVariableUpdates.get(debouncedKey)
      if (existing) {
        clearTimeout(existing.timeout)
        existing.latest = { variableId, field, value, timestamp }
        if (operationId) existing.opToSocket.set(operationId, socket.id)
        existing.timeout = setTimeout(async () => {
          await flushVariableUpdate(workflowId, existing, roomManager)
          pendingVariableUpdates.delete(debouncedKey)
        }, 25)
      } else {
        const opToSocket = new Map<string, string>()
        if (operationId) opToSocket.set(operationId, socket.id)
        const timeout = setTimeout(async () => {
          const pending = pendingVariableUpdates.get(debouncedKey)
          if (pending) {
            await flushVariableUpdate(workflowId, pending, roomManager)
            pendingVariableUpdates.delete(debouncedKey)
          }
        }, 25)
        pendingVariableUpdates.set(debouncedKey, {
          latest: { variableId, field, value, timestamp },
          timeout,
          opToSocket,
        })
      }
    } catch (error) {
      logger.error('Error handling variable update:', error)

      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      if (operationId) {
        socket.emit('operation-failed', {
          operationId,
          error: errorMessage,
          retryable: true,
        })
      }

      socket.emit('operation-error', {
        type: 'VARIABLE_UPDATE_FAILED',
        message: `Failed to update variable ${variableId}.${field}: ${errorMessage}`,
        operation: 'variable-update',
        target: 'variable',
      })
    }
  })
}

async function flushVariableUpdate(
  workflowId: string,
  pending: PendingVariable,
  roomManager: RoomManager
) {
  const { variableId, field, value, timestamp } = pending.latest
  try {
    const workflowExists = await db
      .select({ id: workflow.id })
      .from(workflow)
      .where(eq(workflow.id, workflowId))
      .limit(1)

    if (workflowExists.length === 0) {
      pending.opToSocket.forEach((socketId, opId) => {
        const sock = (roomManager as any).io?.sockets?.sockets?.get(socketId)
        if (sock) {
          sock.emit('operation-failed', {
            operationId: opId,
            error: 'Workflow not found',
            retryable: false,
          })
        }
      })
      return
    }

    let updateSuccessful = false
    await db.transaction(async (tx) => {
      const [workflowRecord] = await tx
        .select({ variables: workflow.variables })
        .from(workflow)
        .where(eq(workflow.id, workflowId))
        .limit(1)

      if (!workflowRecord) {
        return
      }

      const variables = (workflowRecord.variables as any) || {}
      if (!variables[variableId]) {
        return
      }

      variables[variableId] = {
        ...variables[variableId],
        [field]: value,
      }

      await tx
        .update(workflow)
        .set({ variables, updatedAt: new Date() })
        .where(eq(workflow.id, workflowId))

      updateSuccessful = true
    })

    if (updateSuccessful) {
      // Broadcast to other clients (exclude senders to avoid overwriting their local state)
      const senderSocketIds = new Set(pending.opToSocket.values())
      const io = (roomManager as any).io
      if (io) {
        const roomSockets = io.sockets.adapter.rooms.get(workflowId)
        if (roomSockets) {
          roomSockets.forEach((socketId: string) => {
            if (!senderSocketIds.has(socketId)) {
              const sock = io.sockets.sockets.get(socketId)
              if (sock) {
                sock.emit('variable-update', {
                  variableId,
                  field,
                  value,
                  timestamp,
                })
              }
            }
          })
        }
      }

      pending.opToSocket.forEach((socketId, opId) => {
        const sock = (roomManager as any).io?.sockets?.sockets?.get(socketId)
        if (sock) {
          sock.emit('operation-confirmed', { operationId: opId, serverTimestamp: Date.now() })
        }
      })

      logger.debug(`Flushed variable update ${workflowId}: ${variableId}.${field}`)
    } else {
      pending.opToSocket.forEach((socketId, opId) => {
        const sock = (roomManager as any).io?.sockets?.sockets?.get(socketId)
        if (sock) {
          sock.emit('operation-failed', {
            operationId: opId,
            error: 'Variable no longer exists',
            retryable: false,
          })
        }
      })
    }
  } catch (error) {
    logger.error('Error flushing variable update:', error)
    pending.opToSocket.forEach((socketId, opId) => {
      const sock = (roomManager as any).io?.sockets?.sockets?.get(socketId)
      if (sock) {
        sock.emit('operation-failed', {
          operationId: opId,
          error: error instanceof Error ? error.message : 'Unknown error',
          retryable: true,
        })
      }
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: sim-main/apps/sim/socket-server/handlers/workflow.ts

```typescript
import { db, user } from '@sim/db'
import { eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { getWorkflowState } from '@/socket-server/database/operations'
import type { AuthenticatedSocket } from '@/socket-server/middleware/auth'
import { verifyWorkflowAccess } from '@/socket-server/middleware/permissions'
import type { RoomManager, UserPresence, WorkflowRoom } from '@/socket-server/rooms/manager'

const logger = createLogger('WorkflowHandlers')

export type { UserPresence, WorkflowRoom }

export interface HandlerDependencies {
  roomManager: RoomManager
}

export const createWorkflowRoom = (workflowId: string): WorkflowRoom => ({
  workflowId,
  users: new Map(),
  lastModified: Date.now(),
  activeConnections: 0,
})

export const cleanupUserFromRoom = (
  socketId: string,
  workflowId: string,
  roomManager: RoomManager
) => {
  roomManager.cleanupUserFromRoom(socketId, workflowId)
}

export function setupWorkflowHandlers(
  socket: AuthenticatedSocket,
  deps: HandlerDependencies | RoomManager
) {
  const roomManager =
    deps instanceof Object && 'roomManager' in deps ? deps.roomManager : (deps as RoomManager)
  socket.on('join-workflow', async ({ workflowId }) => {
    try {
      const userId = socket.userId
      const userName = socket.userName

      if (!userId || !userName) {
        logger.warn(`Join workflow rejected: Socket ${socket.id} not authenticated`)
        socket.emit('join-workflow-error', { error: 'Authentication required' })
        return
      }

      logger.info(`Join workflow request from ${userId} (${userName}) for workflow ${workflowId}`)

      let userRole: string
      try {
        const accessInfo = await verifyWorkflowAccess(userId, workflowId)
        if (!accessInfo.hasAccess) {
          logger.warn(`User ${userId} (${userName}) denied access to workflow ${workflowId}`)
          socket.emit('join-workflow-error', { error: 'Access denied to workflow' })
          return
        }
        userRole = accessInfo.role || 'read'
      } catch (error) {
        logger.warn(`Error verifying workflow access for ${userId}:`, error)
        socket.emit('join-workflow-error', { error: 'Failed to verify workflow access' })
        return
      }

      const currentWorkflowId = roomManager.getWorkflowIdForSocket(socket.id)
      if (currentWorkflowId) {
        socket.leave(currentWorkflowId)
        roomManager.cleanupUserFromRoom(socket.id, currentWorkflowId)

        roomManager.broadcastPresenceUpdate(currentWorkflowId)
      }

      socket.join(workflowId)

      if (!roomManager.hasWorkflowRoom(workflowId)) {
        roomManager.setWorkflowRoom(workflowId, roomManager.createWorkflowRoom(workflowId))
      }

      const room = roomManager.getWorkflowRoom(workflowId)!
      room.activeConnections++

      let avatarUrl = socket.userImage || null
      if (!avatarUrl) {
        try {
          const [userRecord] = await db
            .select({ image: user.image })
            .from(user)
            .where(eq(user.id, userId))
            .limit(1)

          avatarUrl = userRecord?.image ?? null
        } catch (error) {
          logger.warn('Failed to load user avatar for presence', { userId, error })
        }
      }

      const userPresence: UserPresence = {
        userId,
        workflowId,
        userName,
        socketId: socket.id,
        joinedAt: Date.now(),
        lastActivity: Date.now(),
        role: userRole,
        avatarUrl,
      }

      room.users.set(socket.id, userPresence)
      roomManager.setWorkflowForSocket(socket.id, workflowId)
      roomManager.setUserSession(socket.id, {
        userId,
        userName,
        avatarUrl,
      })

      const workflowState = await getWorkflowState(workflowId)
      socket.emit('workflow-state', workflowState)

      roomManager.broadcastPresenceUpdate(workflowId)

      const uniqueUserCount = roomManager.getUniqueUserCount(workflowId)
      logger.info(
        `User ${userId} (${userName}) joined workflow ${workflowId}. Room now has ${uniqueUserCount} unique users (${room.activeConnections} connections).`
      )
    } catch (error) {
      logger.error('Error joining workflow:', error)
      socket.emit('error', {
        type: 'JOIN_ERROR',
        message: 'Failed to join workflow',
      })
    }
  })

  socket.on('leave-workflow', () => {
    const workflowId = roomManager.getWorkflowIdForSocket(socket.id)
    const session = roomManager.getUserSession(socket.id)

    if (workflowId && session) {
      socket.leave(workflowId)
      roomManager.cleanupUserFromRoom(socket.id, workflowId)

      roomManager.broadcastPresenceUpdate(workflowId)

      logger.info(`User ${session.userId} (${session.userName}) left workflow ${workflowId}`)
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: auth.ts]---
Location: sim-main/apps/sim/socket-server/middleware/auth.ts

```typescript
import type { Socket } from 'socket.io'
import { auth } from '@/lib/auth'
import { ANONYMOUS_USER, ANONYMOUS_USER_ID } from '@/lib/auth/constants'
import { isAuthDisabled } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SocketAuth')

/**
 * Authenticated socket with user data attached.
 */
export interface AuthenticatedSocket extends Socket {
  userId?: string
  userName?: string
  userEmail?: string
  activeOrganizationId?: string
  userImage?: string | null
}

/**
 * Socket.IO authentication middleware.
 * Handles both anonymous mode (DISABLE_AUTH=true) and normal token-based auth.
 */
export async function authenticateSocket(socket: AuthenticatedSocket, next: any) {
  try {
    if (isAuthDisabled) {
      socket.userId = ANONYMOUS_USER_ID
      socket.userName = ANONYMOUS_USER.name
      socket.userEmail = ANONYMOUS_USER.email
      socket.userImage = ANONYMOUS_USER.image
      logger.debug(`Socket ${socket.id} authenticated as anonymous`)
      return next()
    }

    // Extract authentication data from socket handshake
    const token = socket.handshake.auth?.token
    const origin = socket.handshake.headers.origin
    const referer = socket.handshake.headers.referer

    logger.info(`Socket ${socket.id} authentication attempt:`, {
      hasToken: !!token,
      origin,
      referer,
    })

    if (!token) {
      logger.warn(`Socket ${socket.id} rejected: No authentication token found`)
      return next(new Error('Authentication required'))
    }

    // Validate one-time token with Better Auth
    try {
      logger.debug(`Attempting token validation for socket ${socket.id}`, {
        tokenLength: token?.length || 0,
        origin,
      })

      const session = await auth.api.verifyOneTimeToken({
        body: {
          token,
        },
      })

      if (!session?.user?.id) {
        logger.warn(`Socket ${socket.id} rejected: Invalid token - no user found`)
        return next(new Error('Invalid session'))
      }

      // Store user info in socket for later use
      socket.userId = session.user.id
      socket.userName = session.user.name || session.user.email || 'Unknown User'
      socket.userEmail = session.user.email
      socket.userImage = session.user.image || null
      socket.activeOrganizationId = session.session.activeOrganizationId || undefined

      next()
    } catch (tokenError) {
      const errorMessage = tokenError instanceof Error ? tokenError.message : String(tokenError)
      const errorStack = tokenError instanceof Error ? tokenError.stack : undefined

      logger.warn(`Token validation failed for socket ${socket.id}:`, {
        error: errorMessage,
        stack: errorStack,
        origin,
        referer,
      })
      return next(new Error('Token validation failed'))
    }
  } catch (error) {
    logger.error(`Socket authentication error for ${socket.id}:`, error)
    next(new Error('Authentication failed'))
  }
}
```

--------------------------------------------------------------------------------

````
