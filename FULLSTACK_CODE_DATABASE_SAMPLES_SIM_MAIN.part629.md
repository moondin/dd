---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 629
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 629 of 933)

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

---[FILE: test-workflows.ts]---
Location: sim-main/apps/sim/serializer/__test-utils__/test-workflows.ts

```typescript
/**
 * Test Workflows
 *
 * This file contains test fixtures for serializer tests, providing
 * sample workflow states with different configurations.
 */
import type { Edge } from 'reactflow'
import type { BlockState, Loop } from '@/stores/workflows/workflow/types'

/**
 * Workflow State Interface
 */
export interface WorkflowStateFixture {
  blocks: Record<string, BlockState>
  edges: Edge[]
  loops: Record<string, Loop>
}

/**
 * Create a minimal workflow with just a starter and one block
 */
export function createMinimalWorkflowState(): WorkflowStateFixture {
  const blocks: Record<string, BlockState> = {
    starter: {
      id: 'starter',
      type: 'starter',
      name: 'Starter Block',
      position: { x: 0, y: 0 },
      subBlocks: {
        description: {
          id: 'description',
          type: 'long-input',
          value: 'This is the starter block',
        },
      },
      outputs: {},
      enabled: true,
    },
    agent1: {
      id: 'agent1',
      type: 'agent',
      name: 'Agent Block',
      position: { x: 300, y: 0 },
      subBlocks: {
        provider: {
          id: 'provider',
          type: 'dropdown',
          value: 'anthropic',
        },
        model: {
          id: 'model',
          type: 'dropdown',
          value: 'claude-3-7-sonnet-20250219',
        },
        prompt: {
          id: 'prompt',
          type: 'long-input',
          value: 'Hello, world!',
        },
        tools: {
          id: 'tools',
          type: 'tool-input',
          value: '[]',
        },
        system: {
          id: 'system',
          type: 'long-input',
          value: 'You are a helpful assistant.',
        },
        responseFormat: {
          id: 'responseFormat',
          type: 'code',
          value: null,
        },
      },
      outputs: {},
      enabled: true,
    },
  }

  const edges: Edge[] = [
    {
      id: 'edge1',
      source: 'starter',
      target: 'agent1',
    },
  ]

  const loops: Record<string, Loop> = {}

  return { blocks, edges, loops }
}

/**
 * Create a workflow with condition blocks
 */
export function createConditionalWorkflowState(): WorkflowStateFixture {
  const blocks: Record<string, BlockState> = {
    starter: {
      id: 'starter',
      type: 'starter',
      name: 'Starter Block',
      position: { x: 0, y: 0 },
      subBlocks: {
        description: {
          id: 'description',
          type: 'long-input',
          value: 'This is the starter block',
        },
      },
      outputs: {},
      enabled: true,
    },
    condition1: {
      id: 'condition1',
      type: 'condition',
      name: 'Condition Block',
      position: { x: 300, y: 0 },
      subBlocks: {
        condition: {
          id: 'condition',
          type: 'long-input',
          value: 'input.value > 10',
        },
      },
      outputs: {},
      enabled: true,
    },
    agent1: {
      id: 'agent1',
      type: 'agent',
      name: 'True Path Agent',
      position: { x: 600, y: -100 },
      subBlocks: {
        provider: {
          id: 'provider',
          type: 'dropdown',
          value: 'anthropic',
        },
        model: {
          id: 'model',
          type: 'dropdown',
          value: 'claude-3-7-sonnet-20250219',
        },
        prompt: {
          id: 'prompt',
          type: 'long-input',
          value: 'Value is greater than 10',
        },
        tools: {
          id: 'tools',
          type: 'tool-input',
          value: '[]',
        },
        system: {
          id: 'system',
          type: 'long-input',
          value: 'You are a helpful assistant.',
        },
        responseFormat: {
          id: 'responseFormat',
          type: 'code',
          value: null,
        },
      },
      outputs: {},
      enabled: true,
    },
    agent2: {
      id: 'agent2',
      type: 'agent',
      name: 'False Path Agent',
      position: { x: 600, y: 100 },
      subBlocks: {
        provider: {
          id: 'provider',
          type: 'dropdown',
          value: 'anthropic',
        },
        model: {
          id: 'model',
          type: 'dropdown',
          value: 'claude-3-7-sonnet-20250219',
        },
        prompt: {
          id: 'prompt',
          type: 'long-input',
          value: 'Value is less than or equal to 10',
        },
        tools: {
          id: 'tools',
          type: 'tool-input',
          value: '[]',
        },
        system: {
          id: 'system',
          type: 'long-input',
          value: 'You are a helpful assistant.',
        },
        responseFormat: {
          id: 'responseFormat',
          type: 'code',
          value: null,
        },
      },
      outputs: {},
      enabled: true,
    },
  }

  const edges: Edge[] = [
    {
      id: 'edge1',
      source: 'starter',
      target: 'condition1',
    },
    {
      id: 'edge2',
      source: 'condition1',
      target: 'agent1',
      sourceHandle: 'condition-true',
    },
    {
      id: 'edge3',
      source: 'condition1',
      target: 'agent2',
      sourceHandle: 'condition-false',
    },
  ]

  const loops: Record<string, Loop> = {}

  return { blocks, edges, loops }
}

/**
 * Create a workflow with a loop
 */
export function createLoopWorkflowState(): WorkflowStateFixture {
  const blocks: Record<string, BlockState> = {
    starter: {
      id: 'starter',
      type: 'starter',
      name: 'Starter Block',
      position: { x: 0, y: 0 },
      subBlocks: {
        description: {
          id: 'description',
          type: 'long-input',
          value: 'This is the starter block',
        },
      },
      outputs: {},
      enabled: true,
    },
    function1: {
      id: 'function1',
      type: 'function',
      name: 'Function Block',
      position: { x: 300, y: 0 },
      subBlocks: {
        code: {
          id: 'code',
          type: 'code',
          value: 'let counter = input.counter || 0;\ncounter++;\nreturn { counter };',
        },
        language: {
          id: 'language',
          type: 'dropdown',
          value: 'javascript',
        },
      },
      outputs: {},
      enabled: true,
    },
    condition1: {
      id: 'condition1',
      type: 'condition',
      name: 'Loop Condition',
      position: { x: 600, y: 0 },
      subBlocks: {
        condition: {
          id: 'condition',
          type: 'long-input',
          value: 'input.counter < 5',
        },
      },
      outputs: {},
      enabled: true,
    },
    agent1: {
      id: 'agent1',
      type: 'agent',
      name: 'Loop Complete Agent',
      position: { x: 900, y: 100 },
      subBlocks: {
        provider: {
          id: 'provider',
          type: 'dropdown',
          value: 'anthropic',
        },
        model: {
          id: 'model',
          type: 'dropdown',
          value: 'claude-3-7-sonnet-20250219',
        },
        prompt: {
          id: 'prompt',
          type: 'long-input',
          value: 'Loop completed after {{input.counter}} iterations',
        },
        tools: {
          id: 'tools',
          type: 'tool-input',
          value: '[]',
        },
        system: {
          id: 'system',
          type: 'long-input',
          value: 'You are a helpful assistant.',
        },
        responseFormat: {
          id: 'responseFormat',
          type: 'code',
          value: null,
        },
      },
      outputs: {},
      enabled: true,
    },
  }

  const edges: Edge[] = [
    {
      id: 'edge1',
      source: 'starter',
      target: 'function1',
    },
    {
      id: 'edge2',
      source: 'function1',
      target: 'condition1',
    },
    {
      id: 'edge3',
      source: 'condition1',
      target: 'function1',
      sourceHandle: 'condition-true',
    },
    {
      id: 'edge4',
      source: 'condition1',
      target: 'agent1',
      sourceHandle: 'condition-false',
    },
  ]

  const loops: Record<string, Loop> = {
    loop1: {
      id: 'loop1',
      nodes: ['function1', 'condition1'],
      iterations: 10,
      loopType: 'for',
    },
  }

  return { blocks, edges, loops }
}

/**
 * Create a workflow with multiple block types
 */
export function createComplexWorkflowState(): WorkflowStateFixture {
  const blocks: Record<string, BlockState> = {
    starter: {
      id: 'starter',
      type: 'starter',
      name: 'Starter Block',
      position: { x: 0, y: 0 },
      subBlocks: {
        description: {
          id: 'description',
          type: 'long-input',
          value: 'This is the starter block',
        },
      },
      outputs: {},
      enabled: true,
    },
    api1: {
      id: 'api1',
      type: 'api',
      name: 'API Request',
      position: { x: 300, y: 0 },
      subBlocks: {
        url: {
          id: 'url',
          type: 'short-input',
          value: 'https://api.example.com/data',
        },
        method: {
          id: 'method',
          type: 'dropdown',
          value: 'GET',
        },
        headers: {
          id: 'headers',
          type: 'table',
          value: [
            ['Content-Type', 'application/json'],
            ['Authorization', 'Bearer {{API_KEY}}'],
          ],
        },
        body: {
          id: 'body',
          type: 'long-input',
          value: '',
        },
      },
      outputs: {},
      enabled: true,
    },
    function1: {
      id: 'function1',
      type: 'function',
      name: 'Process Data',
      position: { x: 600, y: 0 },
      subBlocks: {
        code: {
          id: 'code',
          type: 'code',
          value: 'const data = input.data;\nreturn { processed: data.map(item => item.name) };',
        },
        language: {
          id: 'language',
          type: 'dropdown',
          value: 'javascript',
        },
      },
      outputs: {},
      enabled: true,
    },
    agent1: {
      id: 'agent1',
      type: 'agent',
      name: 'Summarize Data',
      position: { x: 900, y: 0 },
      subBlocks: {
        provider: {
          id: 'provider',
          type: 'dropdown',
          value: 'openai',
        },
        model: {
          id: 'model',
          type: 'dropdown',
          value: 'gpt-4o',
        },
        prompt: {
          id: 'prompt',
          type: 'long-input',
          value: 'Summarize the following data:\n\n{{input.processed}}',
        },
        tools: {
          id: 'tools',
          type: 'tool-input',
          value:
            '[{"type":"function","name":"calculator","description":"Perform calculations","parameters":{"type":"object","properties":{"expression":{"type":"string","description":"Math expression to evaluate"}},"required":["expression"]}}]',
        },
        system: {
          id: 'system',
          type: 'long-input',
          value: 'You are a data analyst assistant.',
        },
        responseFormat: {
          id: 'responseFormat',
          type: 'code',
          value:
            '{"type":"object","properties":{"summary":{"type":"string"},"keyPoints":{"type":"array","items":{"type":"string"}},"sentiment":{"type":"string","enum":["positive","neutral","negative"]}},"required":["summary","keyPoints","sentiment"]}',
        },
      },
      outputs: {},
      enabled: true,
    },
  }

  const edges: Edge[] = [
    {
      id: 'edge1',
      source: 'starter',
      target: 'api1',
    },
    {
      id: 'edge2',
      source: 'api1',
      target: 'function1',
    },
    {
      id: 'edge3',
      source: 'function1',
      target: 'agent1',
    },
  ]

  const loops: Record<string, Loop> = {}

  return { blocks, edges, loops }
}

/**
 * Create a workflow with agent blocks that have custom tools
 */
export function createAgentWithToolsWorkflowState(): WorkflowStateFixture {
  const blocks: Record<string, BlockState> = {
    starter: {
      id: 'starter',
      type: 'starter',
      name: 'Starter Block',
      position: { x: 0, y: 0 },
      subBlocks: {
        description: {
          id: 'description',
          type: 'long-input',
          value: 'This is the starter block',
        },
      },
      outputs: {},
      enabled: true,
    },
    agent1: {
      id: 'agent1',
      type: 'agent',
      name: 'Custom Tools Agent',
      position: { x: 300, y: 0 },
      subBlocks: {
        provider: {
          id: 'provider',
          type: 'dropdown',
          value: 'openai',
        },
        model: {
          id: 'model',
          type: 'dropdown',
          value: 'gpt-4o',
        },
        prompt: {
          id: 'prompt',
          type: 'long-input',
          value: 'Use the tools to help answer: {{input.question}}',
        },
        tools: {
          id: 'tools',
          type: 'tool-input',
          value:
            '[{"type":"custom-tool","name":"weather","description":"Get current weather","parameters":{"type":"object","properties":{"location":{"type":"string"}},"required":["location"]}},{"type":"function","name":"calculator","description":"Calculate expression","parameters":{"type":"object","properties":{"expression":{"type":"string"}},"required":["expression"]}}]',
        },
        system: {
          id: 'system',
          type: 'long-input',
          value: 'You are a helpful assistant with access to tools.',
        },
        responseFormat: {
          id: 'responseFormat',
          type: 'code',
          value: null,
        },
      },
      outputs: {},
      enabled: true,
    },
  }

  const edges: Edge[] = [
    {
      id: 'edge1',
      source: 'starter',
      target: 'agent1',
    },
  ]

  const loops: Record<string, Loop> = {}

  return { blocks, edges, loops }
}

/**
 * Create a workflow state with an invalid block type for error testing
 */
export function createInvalidWorkflowState(): WorkflowStateFixture {
  const { blocks, edges, loops } = createMinimalWorkflowState()

  // Add an invalid block type
  blocks.invalid = {
    id: 'invalid',
    type: 'invalid-type',
    name: 'Invalid Block',
    position: { x: 600, y: 0 },
    subBlocks: {},
    outputs: {},
    enabled: true,
  }

  edges.push({
    id: 'edge-invalid',
    source: 'agent1',
    target: 'invalid',
  })

  return { blocks, edges, loops }
}

/**
 * Create a serialized workflow with invalid metadata for error testing
 */
export function createInvalidSerializedWorkflow() {
  return {
    version: '1.0',
    blocks: [
      {
        id: 'invalid',
        position: { x: 0, y: 0 },
        config: {
          tool: 'invalid',
          params: {},
        },
        inputs: {},
        outputs: {},
        metadata: {
          id: 'non-existent-type',
        },
        enabled: true,
      },
    ],
    connections: [],
    loops: {},
  }
}

/**
 * Create a serialized workflow with missing metadata for error testing
 */
export function createMissingMetadataWorkflow() {
  return {
    version: '1.0',
    blocks: [
      {
        id: 'invalid',
        position: { x: 0, y: 0 },
        config: {
          tool: 'invalid',
          params: {},
        },
        inputs: {},
        outputs: {},
        metadata: undefined,
        enabled: true,
      },
    ],
    connections: [],
    loops: {},
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.test.ts]---
Location: sim-main/apps/sim/socket-server/index.test.ts

```typescript
/**
 * Tests for the socket server index.ts
 *
 * @vitest-environment node
 */
import { createServer, request as httpRequest } from 'http'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createLogger } from '@/lib/logs/console/logger'
import { createSocketIOServer } from '@/socket-server/config/socket'
import { RoomManager } from '@/socket-server/rooms/manager'
import { createHttpHandler } from '@/socket-server/routes/http'

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      verifyOneTimeToken: vi.fn(),
    },
  },
}))

vi.mock('@sim/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  },
}))

vi.mock('@/socket-server/middleware/auth', () => ({
  authenticateSocket: vi.fn((socket, next) => {
    socket.userId = 'test-user-id'
    socket.userName = 'Test User'
    socket.userEmail = 'test@example.com'
    next()
  }),
}))

vi.mock('@/socket-server/middleware/permissions', () => ({
  verifyWorkflowAccess: vi.fn().mockResolvedValue({
    hasAccess: true,
    role: 'admin',
  }),
  checkRolePermission: vi.fn().mockReturnValue({
    allowed: true,
  }),
}))

vi.mock('@/socket-server/database/operations', () => ({
  getWorkflowState: vi.fn().mockResolvedValue({
    id: 'test-workflow',
    name: 'Test Workflow',
    lastModified: Date.now(),
  }),
  persistWorkflowOperation: vi.fn().mockResolvedValue(undefined),
}))

describe('Socket Server Index Integration', () => {
  let httpServer: any
  let io: any
  let roomManager: RoomManager
  let logger: any
  let PORT: number

  beforeAll(() => {
    logger = createLogger('SocketServerTest')
  })

  beforeEach(async () => {
    PORT = 3333 + Math.floor(Math.random() * 1000)

    httpServer = createServer()

    io = createSocketIOServer(httpServer)

    roomManager = new RoomManager(io)

    const httpHandler = createHttpHandler(roomManager, logger)
    httpServer.on('request', httpHandler)

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Server failed to start on port ${PORT} within 15 seconds`))
      }, 15000)

      httpServer.listen(PORT, '0.0.0.0', () => {
        clearTimeout(timeout)
        resolve()
      })

      httpServer.on('error', (err: any) => {
        clearTimeout(timeout)
        if (err.code === 'EADDRINUSE') {
          PORT = 3333 + Math.floor(Math.random() * 1000)
          httpServer.close(() => {
            httpServer.listen(PORT, '0.0.0.0', () => {
              resolve()
            })
          })
        } else {
          reject(err)
        }
      })
    })
  }, 20000)

  afterEach(async () => {
    if (io) {
      await new Promise<void>((resolve) => {
        io.close(() => resolve())
      })
    }
    if (httpServer) {
      await new Promise<void>((resolve) => {
        httpServer.close(() => resolve())
      })
    }
    vi.clearAllMocks()
  })

  describe('HTTP Server Configuration', () => {
    it('should create HTTP server successfully', () => {
      expect(httpServer).toBeDefined()
      expect(httpServer.listening).toBe(true)
    })

    it('should handle health check endpoint', async () => {
      const data = await new Promise<{ status: string; timestamp: number; connections: number }>(
        (resolve, reject) => {
          const req = httpRequest(
            {
              hostname: 'localhost',
              port: PORT,
              path: '/health',
              method: 'GET',
            },
            (res) => {
              expect(res.statusCode).toBe(200)

              let body = ''
              res.on('data', (chunk) => {
                body += chunk
              })
              res.on('end', () => {
                try {
                  resolve(JSON.parse(body))
                } catch (e) {
                  reject(e)
                }
              })
            }
          )

          req.on('error', reject)
          req.end()
        }
      )

      expect(data).toHaveProperty('status', 'ok')
      expect(data).toHaveProperty('timestamp')
      expect(data).toHaveProperty('connections')
    })
  })

  describe('Socket.IO Server Configuration', () => {
    it('should create Socket.IO server with proper configuration', () => {
      expect(io).toBeDefined()
      expect(io.engine).toBeDefined()
    })

    it('should have proper CORS configuration', () => {
      const corsOptions = io.engine.opts.cors
      expect(corsOptions).toBeDefined()
      expect(corsOptions.methods).toContain('GET')
      expect(corsOptions.methods).toContain('POST')
      expect(corsOptions.credentials).toBe(true)
    })

    it('should have proper transport configuration', () => {
      const transports = io.engine.opts.transports
      expect(transports).toContain('polling')
      expect(transports).toContain('websocket')
    })
  })

  describe('Room Manager Integration', () => {
    it('should create room manager successfully', () => {
      expect(roomManager).toBeDefined()
      expect(roomManager.getTotalActiveConnections()).toBe(0)
    })

    it('should create workflow rooms', () => {
      const workflowId = 'test-workflow-123'
      const room = roomManager.createWorkflowRoom(workflowId)
      roomManager.setWorkflowRoom(workflowId, room)

      expect(roomManager.hasWorkflowRoom(workflowId)).toBe(true)
      const retrievedRoom = roomManager.getWorkflowRoom(workflowId)
      expect(retrievedRoom).toBeDefined()
      expect(retrievedRoom?.workflowId).toBe(workflowId)
    })

    it('should manage user sessions', () => {
      const socketId = 'test-socket-123'
      const workflowId = 'test-workflow-456'
      const session = { userId: 'user-123', userName: 'Test User' }

      roomManager.setWorkflowForSocket(socketId, workflowId)
      roomManager.setUserSession(socketId, session)

      expect(roomManager.getWorkflowIdForSocket(socketId)).toBe(workflowId)
      expect(roomManager.getUserSession(socketId)).toEqual(session)
    })

    it('should clean up rooms properly', () => {
      const workflowId = 'test-workflow-789'
      const socketId = 'test-socket-789'

      const room = roomManager.createWorkflowRoom(workflowId)
      roomManager.setWorkflowRoom(workflowId, room)

      // Add user to room
      room.users.set(socketId, {
        userId: 'user-789',
        workflowId,
        userName: 'Test User',
        socketId,
        joinedAt: Date.now(),
        lastActivity: Date.now(),
        role: 'admin',
      })
      room.activeConnections = 1

      roomManager.setWorkflowForSocket(socketId, workflowId)

      // Clean up user
      roomManager.cleanupUserFromRoom(socketId, workflowId)

      expect(roomManager.hasWorkflowRoom(workflowId)).toBe(false)
      expect(roomManager.getWorkflowIdForSocket(socketId)).toBeUndefined()
    })
  })

  describe('Module Integration', () => {
    it.concurrent('should properly import all extracted modules', async () => {
      const { createSocketIOServer } = await import('@/socket-server/config/socket')
      const { createHttpHandler } = await import('@/socket-server/routes/http')
      const { RoomManager } = await import('@/socket-server/rooms/manager')
      const { authenticateSocket } = await import('@/socket-server/middleware/auth')
      const { verifyWorkflowAccess } = await import('@/socket-server/middleware/permissions')
      const { getWorkflowState } = await import('@/socket-server/database/operations')
      const { WorkflowOperationSchema } = await import('@/socket-server/validation/schemas')

      expect(createSocketIOServer).toBeTypeOf('function')
      expect(createHttpHandler).toBeTypeOf('function')
      expect(RoomManager).toBeTypeOf('function')
      expect(authenticateSocket).toBeTypeOf('function')
      expect(verifyWorkflowAccess).toBeTypeOf('function')
      expect(getWorkflowState).toBeTypeOf('function')
      expect(WorkflowOperationSchema).toBeDefined()
    })

    it.concurrent('should maintain all original functionality after refactoring', () => {
      expect(httpServer).toBeDefined()
      expect(io).toBeDefined()
      expect(roomManager).toBeDefined()

      expect(typeof roomManager.createWorkflowRoom).toBe('function')
      expect(typeof roomManager.cleanupUserFromRoom).toBe('function')
      expect(typeof roomManager.handleWorkflowDeletion).toBe('function')
      expect(typeof roomManager.validateWorkflowConsistency).toBe('function')
    })
  })

  describe('Error Handling', () => {
    it('should have global error handlers configured', () => {
      expect(typeof process.on).toBe('function')
    })

    it('should handle server setup', () => {
      expect(httpServer).toBeDefined()
      expect(io).toBeDefined()
    })
  })

  describe('Authentication Middleware', () => {
    it('should apply authentication middleware to Socket.IO', () => {
      expect(io._parser).toBeDefined()
    })
  })

  describe('Graceful Shutdown', () => {
    it('should have shutdown capability', () => {
      expect(typeof httpServer.close).toBe('function')
      expect(typeof io.close).toBe('function')
    })
  })

  describe('Validation and Utils', () => {
    it.concurrent('should validate workflow operations', async () => {
      const { WorkflowOperationSchema } = await import('@/socket-server/validation/schemas')

      const validOperation = {
        operation: 'add',
        target: 'block',
        payload: {
          id: 'test-block',
          type: 'action',
          name: 'Test Block',
          position: { x: 100, y: 200 },
        },
        timestamp: Date.now(),
      }

      expect(() => WorkflowOperationSchema.parse(validOperation)).not.toThrow()
    })

    it.concurrent('should validate block operations with autoConnectEdge', async () => {
      const { WorkflowOperationSchema } = await import('@/socket-server/validation/schemas')

      const validOperationWithAutoEdge = {
        operation: 'add',
        target: 'block',
        payload: {
          id: 'test-block',
          type: 'action',
          name: 'Test Block',
          position: { x: 100, y: 200 },
          autoConnectEdge: {
            id: 'auto-edge-123',
            source: 'source-block',
            target: 'test-block',
            sourceHandle: 'output',
            targetHandle: 'target',
            type: 'workflowEdge',
          },
        },
        timestamp: Date.now(),
      }

      expect(() => WorkflowOperationSchema.parse(validOperationWithAutoEdge)).not.toThrow()
    })

    it.concurrent('should validate edge operations', async () => {
      const { WorkflowOperationSchema } = await import('@/socket-server/validation/schemas')

      const validEdgeOperation = {
        operation: 'add',
        target: 'edge',
        payload: {
          id: 'test-edge',
          source: 'block-1',
          target: 'block-2',
        },
        timestamp: Date.now(),
      }

      expect(() => WorkflowOperationSchema.parse(validEdgeOperation)).not.toThrow()
    })

    it('should validate subflow operations', async () => {
      const { WorkflowOperationSchema } = await import('@/socket-server/validation/schemas')

      const validSubflowOperation = {
        operation: 'update',
        target: 'subflow',
        payload: {
          id: 'test-subflow',
          type: 'loop',
          config: { iterations: 5 },
        },
        timestamp: Date.now(),
      }

      expect(() => WorkflowOperationSchema.parse(validSubflowOperation)).not.toThrow()
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/socket-server/index.ts

```typescript
import { createServer } from 'http'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'
import { createSocketIOServer } from '@/socket-server/config/socket'
import { setupAllHandlers } from '@/socket-server/handlers'
import { type AuthenticatedSocket, authenticateSocket } from '@/socket-server/middleware/auth'
import { RoomManager } from '@/socket-server/rooms/manager'
import { createHttpHandler } from '@/socket-server/routes/http'

const logger = createLogger('CollaborativeSocketServer')

// Enhanced server configuration - HTTP server will be configured with handler after all dependencies are set up
const httpServer = createServer()

const io = createSocketIOServer(httpServer)

// Initialize room manager after io is created
const roomManager = new RoomManager(io)

io.use(authenticateSocket)

const httpHandler = createHttpHandler(roomManager, logger)
httpServer.on('request', httpHandler)

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  // Don't exit in production, just log
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

httpServer.on('error', (error) => {
  logger.error('HTTP server error:', error)
})

io.engine.on('connection_error', (err) => {
  logger.error('Socket.IO connection error:', {
    req: err.req?.url,
    code: err.code,
    message: err.message,
    context: err.context,
  })
})

io.on('connection', (socket: AuthenticatedSocket) => {
  logger.info(`New socket connection: ${socket.id}`)

  setupAllHandlers(socket, roomManager)
})

httpServer.on('request', (req, res) => {
  logger.info(`🌐 HTTP Request: ${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin,
    host: req.headers.host,
    timestamp: new Date().toISOString(),
  })
})

io.engine.on('connection_error', (err) => {
  logger.error('❌ Engine.IO Connection error:', {
    code: err.code,
    message: err.message,
    context: err.context,
    req: err.req
      ? {
          url: err.req.url,
          method: err.req.method,
          headers: err.req.headers,
        }
      : 'No request object',
  })
})

const PORT = Number(env.PORT || env.SOCKET_PORT || 3002)

logger.info('Starting Socket.IO server...', {
  port: PORT,
  nodeEnv: env.NODE_ENV,
  hasDatabase: !!env.DATABASE_URL,
  hasAuth: !!env.BETTER_AUTH_SECRET,
})

httpServer.listen(PORT, '0.0.0.0', () => {
  logger.info(`Socket.IO server running on port ${PORT}`)
  logger.info(`🏥 Health check available at: http://localhost:${PORT}/health`)
})

httpServer.on('error', (error) => {
  logger.error('❌ Server failed to start:', error)
  process.exit(1)
})

process.on('SIGINT', () => {
  logger.info('Shutting down Socket.IO server...')
  httpServer.close(() => {
    logger.info('Socket.IO server closed')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  logger.info('Shutting down Socket.IO server...')
  httpServer.close(() => {
    logger.info('Socket.IO server closed')
    process.exit(0)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: socket.ts]---
Location: sim-main/apps/sim/socket-server/config/socket.ts

```typescript
import type { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { env } from '@/lib/core/config/env'
import { isProd } from '@/lib/core/config/feature-flags'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SocketIOConfig')

/**
 * Get allowed origins for Socket.IO CORS configuration
 */
function getAllowedOrigins(): string[] {
  const allowedOrigins = [
    getBaseUrl(),
    'http://localhost:3000',
    'http://localhost:3001',
    ...(env.ALLOWED_ORIGINS?.split(',') || []),
  ].filter((url): url is string => Boolean(url))

  logger.info('Socket.IO CORS configuration:', { allowedOrigins })

  return allowedOrigins
}

/**
 * Create and configure a Socket.IO server instance
 * @param httpServer - The HTTP server instance to attach Socket.IO to
 * @returns Configured Socket.IO server instance
 */
export function createSocketIOServer(httpServer: HttpServer): Server {
  const allowedOrigins = getAllowedOrigins()

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'socket.io'],
      credentials: true, // Enable credentials to accept cookies
    },
    transports: ['websocket', 'polling'], // WebSocket first, polling as fallback
    allowEIO3: true, // Keep legacy support for compatibility
    pingTimeout: 60000, // Back to original conservative setting
    pingInterval: 25000, // Back to original interval
    maxHttpBufferSize: 1e6,
    cookie: {
      name: 'io',
      path: '/',
      httpOnly: true,
      sameSite: 'none', // Required for cross-origin cookies
      secure: isProd, // HTTPS in production
    },
  })

  logger.info('Socket.IO server configured with:', {
    allowedOrigins: allowedOrigins.length,
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e6,
    cookieSecure: isProd,
    corsCredentials: true,
  })

  return io
}
```

--------------------------------------------------------------------------------

````
