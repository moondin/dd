---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 297
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 297 of 933)

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

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/schedules/route.test.ts

```typescript
/**
 * Integration tests for schedule configuration API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, mockExecutionDependencies } from '@/app/api/__test-utils__/utils'

const {
  mockGetSession,
  mockGetUserEntityPermissions,
  mockSelectLimit,
  mockInsertValues,
  mockOnConflictDoUpdate,
  mockInsert,
  mockUpdate,
  mockDelete,
  mockTransaction,
  mockRandomUUID,
  mockGetScheduleTimeValues,
  mockGetSubBlockValue,
  mockGenerateCronExpression,
  mockCalculateNextRunTime,
  mockValidateCronExpression,
} = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockGetUserEntityPermissions: vi.fn(),
  mockSelectLimit: vi.fn(),
  mockInsertValues: vi.fn(),
  mockOnConflictDoUpdate: vi.fn(),
  mockInsert: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
  mockTransaction: vi.fn(),
  mockRandomUUID: vi.fn(),
  mockGetScheduleTimeValues: vi.fn(),
  mockGetSubBlockValue: vi.fn(),
  mockGenerateCronExpression: vi.fn(),
  mockCalculateNextRunTime: vi.fn(),
  mockValidateCronExpression: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  getSession: mockGetSession,
}))

vi.mock('@/lib/workspaces/permissions/utils', () => ({
  getUserEntityPermissions: mockGetUserEntityPermissions,
}))

vi.mock('@sim/db', () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: mockSelectLimit,
        }),
      }),
    }),
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  },
}))

vi.mock('@sim/db/schema', () => ({
  workflow: {
    id: 'workflow_id',
    userId: 'user_id',
    workspaceId: 'workspace_id',
  },
  workflowSchedule: {
    id: 'schedule_id',
    workflowId: 'workflow_id',
    blockId: 'block_id',
    cronExpression: 'cron_expression',
    nextRunAt: 'next_run_at',
    status: 'status',
  },
}))

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((...args) => ({ type: 'eq', args })),
  and: vi.fn((...args) => ({ type: 'and', args })),
}))

vi.mock('crypto', () => ({
  randomUUID: mockRandomUUID,
  default: {
    randomUUID: mockRandomUUID,
  },
}))

vi.mock('@/lib/workflows/schedules/utils', () => ({
  getScheduleTimeValues: mockGetScheduleTimeValues,
  getSubBlockValue: mockGetSubBlockValue,
  generateCronExpression: mockGenerateCronExpression,
  calculateNextRunTime: mockCalculateNextRunTime,
  validateCronExpression: mockValidateCronExpression,
  BlockState: {},
}))

vi.mock('@/lib/core/utils/request', () => ({
  generateRequestId: vi.fn(() => 'test-request-id'),
}))

vi.mock('@/lib/logs/console/logger', () => ({
  createLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  })),
}))

vi.mock('@/lib/core/telemetry', () => ({
  trackPlatformEvent: vi.fn(),
}))

import { db } from '@sim/db'
import { POST } from '@/app/api/schedules/route'

describe('Schedule Configuration API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    ;(db as any).transaction = mockTransaction

    mockExecutionDependencies()

    mockGetSession.mockResolvedValue({
      user: {
        id: 'user-id',
        email: 'test@example.com',
      },
    })

    mockGetUserEntityPermissions.mockResolvedValue('admin')

    mockSelectLimit.mockReturnValue([
      {
        id: 'workflow-id',
        userId: 'user-id',
        workspaceId: null,
      },
    ])

    mockInsertValues.mockImplementation(() => ({
      onConflictDoUpdate: mockOnConflictDoUpdate,
    }))
    mockOnConflictDoUpdate.mockResolvedValue({})

    mockInsert.mockReturnValue({
      values: mockInsertValues,
    })

    mockUpdate.mockImplementation(() => ({
      set: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockResolvedValue([]),
      })),
    }))

    mockDelete.mockImplementation(() => ({
      where: vi.fn().mockResolvedValue([]),
    }))

    mockTransaction.mockImplementation(async (callback) => {
      const tx = {
        insert: vi.fn().mockReturnValue({
          values: mockInsertValues,
        }),
      }
      return callback(tx)
    })

    mockRandomUUID.mockReturnValue('test-uuid')

    mockGetScheduleTimeValues.mockReturnValue({
      scheduleTime: '09:30',
      minutesInterval: 15,
      hourlyMinute: 0,
      dailyTime: [9, 30],
      weeklyDay: 1,
      weeklyTime: [9, 30],
      monthlyDay: 1,
      monthlyTime: [9, 30],
    })

    mockGetSubBlockValue.mockImplementation((block: any, id: string) => {
      const subBlocks = {
        startWorkflow: 'schedule',
        scheduleType: 'daily',
        scheduleTime: '09:30',
        dailyTime: '09:30',
      }
      return subBlocks[id as keyof typeof subBlocks] || ''
    })

    mockGenerateCronExpression.mockReturnValue('0 9 * * *')
    mockCalculateNextRunTime.mockReturnValue(new Date())
    mockValidateCronExpression.mockReturnValue({ isValid: true })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should create a new schedule successfully', async () => {
    const req = createMockRequest('POST', {
      workflowId: 'workflow-id',
      state: {
        blocks: {
          'starter-id': {
            type: 'starter',
            subBlocks: {
              startWorkflow: { value: 'schedule' },
              scheduleType: { value: 'daily' },
              scheduleTime: { value: '09:30' },
              dailyTime: { value: '09:30' },
            },
          },
        },
        edges: [],
        loops: {},
      },
    })

    const response = await POST(req)

    expect(response).toBeDefined()
    expect(response.status).toBe(200)

    const responseData = await response.json()
    expect(responseData).toHaveProperty('message', 'Schedule updated')
    expect(responseData).toHaveProperty('cronExpression', '0 9 * * *')
    expect(responseData).toHaveProperty('nextRunAt')
  })

  it('should handle errors gracefully', async () => {
    mockSelectLimit.mockReturnValue([])

    const req = createMockRequest('POST', {
      workflowId: 'workflow-id',
      state: { blocks: {}, edges: [], loops: {} },
    })

    const response = await POST(req)

    expect(response.status).toBeGreaterThanOrEqual(400)
    const data = await response.json()
    expect(data).toHaveProperty('error')
  })

  it('should require authentication', async () => {
    mockGetSession.mockResolvedValue(null)

    const req = createMockRequest('POST', {
      workflowId: 'workflow-id',
      state: { blocks: {}, edges: [], loops: {} },
    })

    const response = await POST(req)

    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data).toHaveProperty('error', 'Unauthorized')
  })

  it('should validate input data', async () => {
    const req = createMockRequest('POST', {
      workflowId: 'workflow-id',
    })

    const response = await POST(req)

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data).toHaveProperty('error', 'Invalid request data')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/schedules/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { workflow, workflowSchedule } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import {
  type BlockState,
  calculateNextRunTime,
  generateCronExpression,
  getScheduleTimeValues,
  getSubBlockValue,
  validateCronExpression,
} from '@/lib/workflows/schedules/utils'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('ScheduledAPI')

const ScheduleRequestSchema = z.object({
  workflowId: z.string(),
  blockId: z.string().optional(),
  state: z.object({
    blocks: z.record(z.any()),
    edges: z.array(z.any()),
    loops: z.record(z.any()),
  }),
})

function hasValidScheduleConfig(
  scheduleType: string | undefined,
  scheduleValues: ReturnType<typeof getScheduleTimeValues>,
  starterBlock: BlockState
): boolean {
  switch (scheduleType) {
    case 'minutes':
      return !!scheduleValues.minutesInterval
    case 'hourly':
      return scheduleValues.hourlyMinute !== undefined
    case 'daily':
      return !!scheduleValues.dailyTime[0] || !!scheduleValues.dailyTime[1]
    case 'weekly':
      return (
        !!scheduleValues.weeklyDay &&
        (!!scheduleValues.weeklyTime[0] || !!scheduleValues.weeklyTime[1])
      )
    case 'monthly':
      return (
        !!scheduleValues.monthlyDay &&
        (!!scheduleValues.monthlyTime[0] || !!scheduleValues.monthlyTime[1])
      )
    case 'custom':
      return !!getSubBlockValue(starterBlock, 'cronExpression')
    default:
      return false
  }
}

/**
 * Get schedule information for a workflow
 */
export async function GET(req: NextRequest) {
  const requestId = generateRequestId()
  const url = new URL(req.url)
  const workflowId = url.searchParams.get('workflowId')
  const blockId = url.searchParams.get('blockId')
  const mode = url.searchParams.get('mode')

  if (mode && mode !== 'schedule') {
    return NextResponse.json({ schedule: null })
  }

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized schedule query attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!workflowId) {
      return NextResponse.json({ error: 'Missing workflowId parameter' }, { status: 400 })
    }

    const [workflowRecord] = await db
      .select({ userId: workflow.userId, workspaceId: workflow.workspaceId })
      .from(workflow)
      .where(eq(workflow.id, workflowId))
      .limit(1)

    if (!workflowRecord) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    let isAuthorized = workflowRecord.userId === session.user.id

    if (!isAuthorized && workflowRecord.workspaceId) {
      const userPermission = await getUserEntityPermissions(
        session.user.id,
        'workspace',
        workflowRecord.workspaceId
      )
      isAuthorized = userPermission !== null
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Not authorized to view this workflow' }, { status: 403 })
    }

    logger.info(`[${requestId}] Getting schedule for workflow ${workflowId}`)

    const conditions = [eq(workflowSchedule.workflowId, workflowId)]
    if (blockId) {
      conditions.push(eq(workflowSchedule.blockId, blockId))
    }

    const schedule = await db
      .select()
      .from(workflowSchedule)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .limit(1)

    const headers = new Headers()
    headers.set('Cache-Control', 'no-store, max-age=0')

    if (schedule.length === 0) {
      return NextResponse.json({ schedule: null }, { headers })
    }

    const scheduleData = schedule[0]
    const isDisabled = scheduleData.status === 'disabled'
    const hasFailures = scheduleData.failedCount > 0

    return NextResponse.json(
      {
        schedule: scheduleData,
        isDisabled,
        hasFailures,
        canBeReactivated: isDisabled,
      },
      { headers }
    )
  } catch (error) {
    logger.error(`[${requestId}] Error retrieving workflow schedule`, error)
    return NextResponse.json({ error: 'Failed to retrieve workflow schedule' }, { status: 500 })
  }
}

const saveAttempts = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX = 10 // 10 saves per minute

/**
 * Create or update a schedule for a workflow
 */
export async function POST(req: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized schedule update attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = Date.now()
    const userKey = session.user.id
    const limit = saveAttempts.get(userKey)

    if (limit && limit.resetAt > now) {
      if (limit.count >= RATE_LIMIT_MAX) {
        logger.warn(`[${requestId}] Rate limit exceeded for user: ${userKey}`)
        return NextResponse.json(
          { error: 'Too many save attempts. Please wait a moment and try again.' },
          { status: 429 }
        )
      }
      limit.count++
    } else {
      saveAttempts.set(userKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    }

    const body = await req.json()
    const { workflowId, blockId, state } = ScheduleRequestSchema.parse(body)

    logger.info(`[${requestId}] Processing schedule update for workflow ${workflowId}`)

    const [workflowRecord] = await db
      .select({ userId: workflow.userId, workspaceId: workflow.workspaceId })
      .from(workflow)
      .where(eq(workflow.id, workflowId))
      .limit(1)

    if (!workflowRecord) {
      logger.warn(`[${requestId}] Workflow not found: ${workflowId}`)
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    let isAuthorized = workflowRecord.userId === session.user.id

    if (!isAuthorized && workflowRecord.workspaceId) {
      const userPermission = await getUserEntityPermissions(
        session.user.id,
        'workspace',
        workflowRecord.workspaceId
      )
      isAuthorized = userPermission === 'write' || userPermission === 'admin'
    }

    if (!isAuthorized) {
      logger.warn(
        `[${requestId}] User not authorized to modify schedule for workflow: ${workflowId}`
      )
      return NextResponse.json({ error: 'Not authorized to modify this workflow' }, { status: 403 })
    }

    let targetBlock: BlockState | undefined
    if (blockId) {
      targetBlock = Object.values(state.blocks).find((block: any) => block.id === blockId) as
        | BlockState
        | undefined
    } else {
      targetBlock = Object.values(state.blocks).find(
        (block: any) => block.type === 'starter' || block.type === 'schedule'
      ) as BlockState | undefined
    }

    if (!targetBlock) {
      logger.warn(`[${requestId}] No starter or schedule block found in workflow ${workflowId}`)
      return NextResponse.json(
        { error: 'No starter or schedule block found in workflow' },
        { status: 400 }
      )
    }

    const startWorkflow = getSubBlockValue(targetBlock, 'startWorkflow')
    const scheduleType = getSubBlockValue(targetBlock, 'scheduleType')

    const scheduleValues = getScheduleTimeValues(targetBlock)

    const hasScheduleConfig = hasValidScheduleConfig(scheduleType, scheduleValues, targetBlock)

    const isScheduleBlock = targetBlock.type === 'schedule'
    const hasValidConfig = isScheduleBlock || (startWorkflow === 'schedule' && hasScheduleConfig)

    logger.info(`[${requestId}] Schedule validation debug:`, {
      workflowId,
      blockId,
      blockType: targetBlock.type,
      isScheduleBlock,
      startWorkflow,
      scheduleType,
      hasScheduleConfig,
      hasValidConfig,
      scheduleValues: {
        minutesInterval: scheduleValues.minutesInterval,
        dailyTime: scheduleValues.dailyTime,
        cronExpression: scheduleValues.cronExpression,
      },
    })

    if (!hasValidConfig) {
      logger.info(
        `[${requestId}] Removing schedule for workflow ${workflowId} - no valid configuration found`
      )
      const deleteConditions = [eq(workflowSchedule.workflowId, workflowId)]
      if (blockId) {
        deleteConditions.push(eq(workflowSchedule.blockId, blockId))
      }

      await db
        .delete(workflowSchedule)
        .where(deleteConditions.length > 1 ? and(...deleteConditions) : deleteConditions[0])

      return NextResponse.json({ message: 'Schedule removed' })
    }

    if (isScheduleBlock) {
      logger.info(`[${requestId}] Processing schedule trigger block for workflow ${workflowId}`)
    } else if (startWorkflow !== 'schedule') {
      logger.info(
        `[${requestId}] Setting workflow to scheduled mode based on schedule configuration`
      )
    }

    logger.debug(`[${requestId}] Schedule type for workflow ${workflowId}: ${scheduleType}`)

    let cronExpression: string | null = null
    let nextRunAt: Date | undefined
    const timezone = getSubBlockValue(targetBlock, 'timezone') || 'UTC'

    try {
      const defaultScheduleType = scheduleType || 'daily'
      const scheduleStartAt = getSubBlockValue(targetBlock, 'scheduleStartAt')
      const scheduleTime = getSubBlockValue(targetBlock, 'scheduleTime')

      logger.debug(`[${requestId}] Schedule configuration:`, {
        type: defaultScheduleType,
        timezone,
        startDate: scheduleStartAt || 'not specified',
        time: scheduleTime || 'not specified',
      })

      const sanitizedScheduleValues =
        defaultScheduleType !== 'custom'
          ? { ...scheduleValues, cronExpression: null }
          : scheduleValues

      cronExpression = generateCronExpression(defaultScheduleType, sanitizedScheduleValues)

      if (cronExpression) {
        const validation = validateCronExpression(cronExpression, timezone)
        if (!validation.isValid) {
          logger.error(`[${requestId}] Invalid cron expression: ${validation.error}`, {
            scheduleType: defaultScheduleType,
            cronExpression,
          })
          return NextResponse.json(
            { error: `Invalid schedule configuration: ${validation.error}` },
            { status: 400 }
          )
        }
      }

      nextRunAt = calculateNextRunTime(defaultScheduleType, sanitizedScheduleValues)

      logger.debug(
        `[${requestId}] Generated cron: ${cronExpression}, next run at: ${nextRunAt.toISOString()}`
      )
    } catch (error: any) {
      logger.error(`[${requestId}] Error generating schedule: ${error}`)
      const errorMessage = error?.message || 'Failed to generate schedule'
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const values = {
      id: crypto.randomUUID(),
      workflowId,
      blockId,
      cronExpression,
      triggerType: 'schedule',
      createdAt: new Date(),
      updatedAt: new Date(),
      nextRunAt,
      timezone,
      status: 'active', // Ensure new schedules are active
      failedCount: 0, // Reset failure count for new schedules
    }

    const setValues = {
      blockId,
      cronExpression,
      updatedAt: new Date(),
      nextRunAt,
      timezone,
      status: 'active', // Reactivate if previously disabled
      failedCount: 0, // Reset failure count on reconfiguration
    }

    await db.transaction(async (tx) => {
      await tx
        .insert(workflowSchedule)
        .values(values)
        .onConflictDoUpdate({
          target: [workflowSchedule.workflowId, workflowSchedule.blockId],
          set: setValues,
        })
    })

    logger.info(`[${requestId}] Schedule updated for workflow ${workflowId}`, {
      nextRunAt: nextRunAt?.toISOString(),
      cronExpression,
    })

    try {
      const { trackPlatformEvent } = await import('@/lib/core/telemetry')
      trackPlatformEvent('platform.schedule.created', {
        'workflow.id': workflowId,
        'schedule.type': scheduleType || 'daily',
        'schedule.timezone': timezone,
        'schedule.is_custom': scheduleType === 'custom',
      })
    } catch (_e) {
      // Silently fail
    }

    return NextResponse.json({
      message: 'Schedule updated',
      schedule: { id: values.id },
      nextRunAt,
      cronExpression,
    })
  } catch (error: any) {
    logger.error(`[${requestId}] Error updating workflow schedule`, error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error?.message || 'Failed to update workflow schedule'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/schedules/execute/route.test.ts
Signals: Next.js

```typescript
/**
 * Integration tests for scheduled workflow execution API route
 *
 * @vitest-environment node
 */
import type { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function createMockRequest(): NextRequest {
  const mockHeaders = new Map([
    ['authorization', 'Bearer test-cron-secret'],
    ['content-type', 'application/json'],
  ])

  return {
    headers: {
      get: (key: string) => mockHeaders.get(key.toLowerCase()) || null,
    },
    url: 'http://localhost:3000/api/schedules/execute',
  } as NextRequest
}

describe('Scheduled Workflow Execution API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should execute scheduled workflows with Trigger.dev disabled', async () => {
    const mockExecuteScheduleJob = vi.fn().mockResolvedValue(undefined)

    vi.doMock('@/lib/auth/internal', () => ({
      verifyCronAuth: vi.fn().mockReturnValue(null),
    }))

    vi.doMock('@/background/schedule-execution', () => ({
      executeScheduleJob: mockExecuteScheduleJob,
    }))

    vi.doMock('@/lib/core/config/feature-flags', () => ({
      isTriggerDevEnabled: false,
      isHosted: false,
      isProd: false,
      isDev: true,
    }))

    vi.doMock('drizzle-orm', () => ({
      and: vi.fn((...conditions) => ({ type: 'and', conditions })),
      eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
      lte: vi.fn((field, value) => ({ field, value, type: 'lte' })),
      lt: vi.fn((field, value) => ({ field, value, type: 'lt' })),
      not: vi.fn((condition) => ({ type: 'not', condition })),
      isNull: vi.fn((field) => ({ type: 'isNull', field })),
      or: vi.fn((...conditions) => ({ type: 'or', conditions })),
    }))

    vi.doMock('@sim/db', () => {
      const returningSchedules = [
        {
          id: 'schedule-1',
          workflowId: 'workflow-1',
          blockId: null,
          cronExpression: null,
          lastRanAt: null,
          failedCount: 0,
          nextRunAt: new Date('2025-01-01T00:00:00.000Z'),
          lastQueuedAt: undefined,
        },
      ]

      const mockReturning = vi.fn().mockReturnValue(returningSchedules)
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning })
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere })
      const mockUpdate = vi.fn().mockReturnValue({ set: mockSet })

      return {
        db: {
          update: mockUpdate,
        },
        workflowSchedule: {
          id: 'id',
          workflowId: 'workflowId',
          blockId: 'blockId',
          cronExpression: 'cronExpression',
          lastRanAt: 'lastRanAt',
          failedCount: 'failedCount',
          status: 'status',
          nextRunAt: 'nextRunAt',
          lastQueuedAt: 'lastQueuedAt',
        },
      }
    })

    const { GET } = await import('@/app/api/schedules/execute/route')
    const response = await GET(createMockRequest())

    expect(response).toBeDefined()
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('message')
    expect(data).toHaveProperty('executedCount', 1)
  })

  it('should queue schedules to Trigger.dev when enabled', async () => {
    const mockTrigger = vi.fn().mockResolvedValue({ id: 'task-id-123' })

    vi.doMock('@/lib/auth/internal', () => ({
      verifyCronAuth: vi.fn().mockReturnValue(null),
    }))

    vi.doMock('@trigger.dev/sdk', () => ({
      tasks: {
        trigger: mockTrigger,
      },
    }))

    vi.doMock('@/lib/core/config/feature-flags', () => ({
      isTriggerDevEnabled: true,
      isHosted: false,
      isProd: false,
      isDev: true,
    }))

    vi.doMock('drizzle-orm', () => ({
      and: vi.fn((...conditions) => ({ type: 'and', conditions })),
      eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
      lte: vi.fn((field, value) => ({ field, value, type: 'lte' })),
      lt: vi.fn((field, value) => ({ field, value, type: 'lt' })),
      not: vi.fn((condition) => ({ type: 'not', condition })),
      isNull: vi.fn((field) => ({ type: 'isNull', field })),
      or: vi.fn((...conditions) => ({ type: 'or', conditions })),
    }))

    vi.doMock('@sim/db', () => {
      const returningSchedules = [
        {
          id: 'schedule-1',
          workflowId: 'workflow-1',
          blockId: null,
          cronExpression: null,
          lastRanAt: null,
          failedCount: 0,
          nextRunAt: new Date('2025-01-01T00:00:00.000Z'),
          lastQueuedAt: undefined,
        },
      ]

      const mockReturning = vi.fn().mockReturnValue(returningSchedules)
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning })
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere })
      const mockUpdate = vi.fn().mockReturnValue({ set: mockSet })

      return {
        db: {
          update: mockUpdate,
        },
        workflowSchedule: {
          id: 'id',
          workflowId: 'workflowId',
          blockId: 'blockId',
          cronExpression: 'cronExpression',
          lastRanAt: 'lastRanAt',
          failedCount: 'failedCount',
          status: 'status',
          nextRunAt: 'nextRunAt',
          lastQueuedAt: 'lastQueuedAt',
        },
      }
    })

    const { GET } = await import('@/app/api/schedules/execute/route')
    const response = await GET(createMockRequest())

    expect(response).toBeDefined()
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('executedCount', 1)
  })

  it('should handle case with no due schedules', async () => {
    vi.doMock('@/lib/auth/internal', () => ({
      verifyCronAuth: vi.fn().mockReturnValue(null),
    }))

    vi.doMock('@/background/schedule-execution', () => ({
      executeScheduleJob: vi.fn().mockResolvedValue(undefined),
    }))

    vi.doMock('@/lib/core/config/feature-flags', () => ({
      isTriggerDevEnabled: false,
      isHosted: false,
      isProd: false,
      isDev: true,
    }))

    vi.doMock('drizzle-orm', () => ({
      and: vi.fn((...conditions) => ({ type: 'and', conditions })),
      eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
      lte: vi.fn((field, value) => ({ field, value, type: 'lte' })),
      lt: vi.fn((field, value) => ({ field, value, type: 'lt' })),
      not: vi.fn((condition) => ({ type: 'not', condition })),
      isNull: vi.fn((field) => ({ type: 'isNull', field })),
      or: vi.fn((...conditions) => ({ type: 'or', conditions })),
    }))

    vi.doMock('@sim/db', () => {
      const mockReturning = vi.fn().mockReturnValue([])
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning })
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere })
      const mockUpdate = vi.fn().mockReturnValue({ set: mockSet })

      return {
        db: {
          update: mockUpdate,
        },
        workflowSchedule: {
          id: 'id',
          workflowId: 'workflowId',
          blockId: 'blockId',
          cronExpression: 'cronExpression',
          lastRanAt: 'lastRanAt',
          failedCount: 'failedCount',
          status: 'status',
          nextRunAt: 'nextRunAt',
          lastQueuedAt: 'lastQueuedAt',
        },
      }
    })

    const { GET } = await import('@/app/api/schedules/execute/route')
    const response = await GET(createMockRequest())

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('message')
    expect(data).toHaveProperty('executedCount', 0)
  })

  it('should execute multiple schedules in parallel', async () => {
    vi.doMock('@/lib/auth/internal', () => ({
      verifyCronAuth: vi.fn().mockReturnValue(null),
    }))

    vi.doMock('@/background/schedule-execution', () => ({
      executeScheduleJob: vi.fn().mockResolvedValue(undefined),
    }))

    vi.doMock('@/lib/core/config/feature-flags', () => ({
      isTriggerDevEnabled: false,
      isHosted: false,
      isProd: false,
      isDev: true,
    }))

    vi.doMock('drizzle-orm', () => ({
      and: vi.fn((...conditions) => ({ type: 'and', conditions })),
      eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
      lte: vi.fn((field, value) => ({ field, value, type: 'lte' })),
      lt: vi.fn((field, value) => ({ field, value, type: 'lt' })),
      not: vi.fn((condition) => ({ type: 'not', condition })),
      isNull: vi.fn((field) => ({ type: 'isNull', field })),
      or: vi.fn((...conditions) => ({ type: 'or', conditions })),
    }))

    vi.doMock('@sim/db', () => {
      const returningSchedules = [
        {
          id: 'schedule-1',
          workflowId: 'workflow-1',
          blockId: null,
          cronExpression: null,
          lastRanAt: null,
          failedCount: 0,
          nextRunAt: new Date('2025-01-01T00:00:00.000Z'),
          lastQueuedAt: undefined,
        },
        {
          id: 'schedule-2',
          workflowId: 'workflow-2',
          blockId: null,
          cronExpression: null,
          lastRanAt: null,
          failedCount: 0,
          nextRunAt: new Date('2025-01-01T01:00:00.000Z'),
          lastQueuedAt: undefined,
        },
      ]

      const mockReturning = vi.fn().mockReturnValue(returningSchedules)
      const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning })
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere })
      const mockUpdate = vi.fn().mockReturnValue({ set: mockSet })

      return {
        db: {
          update: mockUpdate,
        },
        workflowSchedule: {
          id: 'id',
          workflowId: 'workflowId',
          blockId: 'blockId',
          cronExpression: 'cronExpression',
          lastRanAt: 'lastRanAt',
          failedCount: 'failedCount',
          status: 'status',
          nextRunAt: 'nextRunAt',
          lastQueuedAt: 'lastQueuedAt',
        },
      }
    })

    const { GET } = await import('@/app/api/schedules/execute/route')
    const response = await GET(createMockRequest())

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('executedCount', 2)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/schedules/execute/route.ts
Signals: Next.js

```typescript
import { db, workflowSchedule } from '@sim/db'
import { tasks } from '@trigger.dev/sdk'
import { and, eq, isNull, lt, lte, not, or } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { verifyCronAuth } from '@/lib/auth/internal'
import { isTriggerDevEnabled } from '@/lib/core/config/feature-flags'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { executeScheduleJob } from '@/background/schedule-execution'

export const dynamic = 'force-dynamic'

const logger = createLogger('ScheduledExecuteAPI')

export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  logger.info(`[${requestId}] Scheduled execution triggered at ${new Date().toISOString()}`)

  const authError = verifyCronAuth(request, 'Schedule execution')
  if (authError) {
    return authError
  }

  const queuedAt = new Date()

  try {
    const dueSchedules = await db
      .update(workflowSchedule)
      .set({
        lastQueuedAt: queuedAt,
        updatedAt: queuedAt,
      })
      .where(
        and(
          lte(workflowSchedule.nextRunAt, queuedAt),
          not(eq(workflowSchedule.status, 'disabled')),
          or(
            isNull(workflowSchedule.lastQueuedAt),
            lt(workflowSchedule.lastQueuedAt, workflowSchedule.nextRunAt)
          )
        )
      )
      .returning({
        id: workflowSchedule.id,
        workflowId: workflowSchedule.workflowId,
        blockId: workflowSchedule.blockId,
        cronExpression: workflowSchedule.cronExpression,
        lastRanAt: workflowSchedule.lastRanAt,
        failedCount: workflowSchedule.failedCount,
        nextRunAt: workflowSchedule.nextRunAt,
        lastQueuedAt: workflowSchedule.lastQueuedAt,
      })

    logger.debug(`[${requestId}] Successfully queried schedules: ${dueSchedules.length} found`)
    logger.info(`[${requestId}] Processing ${dueSchedules.length} due scheduled workflows`)

    if (isTriggerDevEnabled) {
      const triggerPromises = dueSchedules.map(async (schedule) => {
        const queueTime = schedule.lastQueuedAt ?? queuedAt

        try {
          const payload = {
            scheduleId: schedule.id,
            workflowId: schedule.workflowId,
            blockId: schedule.blockId || undefined,
            cronExpression: schedule.cronExpression || undefined,
            lastRanAt: schedule.lastRanAt?.toISOString(),
            failedCount: schedule.failedCount || 0,
            now: queueTime.toISOString(),
            scheduledFor: schedule.nextRunAt?.toISOString(),
          }

          const handle = await tasks.trigger('schedule-execution', payload)
          logger.info(
            `[${requestId}] Queued schedule execution task ${handle.id} for workflow ${schedule.workflowId}`
          )
          return handle
        } catch (error) {
          logger.error(
            `[${requestId}] Failed to trigger schedule execution for workflow ${schedule.workflowId}`,
            error
          )
          return null
        }
      })

      await Promise.allSettled(triggerPromises)

      logger.info(`[${requestId}] Queued ${dueSchedules.length} schedule executions to Trigger.dev`)
    } else {
      const directExecutionPromises = dueSchedules.map(async (schedule) => {
        const queueTime = schedule.lastQueuedAt ?? queuedAt

        const payload = {
          scheduleId: schedule.id,
          workflowId: schedule.workflowId,
          blockId: schedule.blockId || undefined,
          cronExpression: schedule.cronExpression || undefined,
          lastRanAt: schedule.lastRanAt?.toISOString(),
          failedCount: schedule.failedCount || 0,
          now: queueTime.toISOString(),
          scheduledFor: schedule.nextRunAt?.toISOString(),
        }

        void executeScheduleJob(payload).catch((error) => {
          logger.error(
            `[${requestId}] Direct schedule execution failed for workflow ${schedule.workflowId}`,
            error
          )
        })

        logger.info(
          `[${requestId}] Queued direct schedule execution for workflow ${schedule.workflowId} (Trigger.dev disabled)`
        )
      })

      await Promise.allSettled(directExecutionPromises)

      logger.info(
        `[${requestId}] Queued ${dueSchedules.length} direct schedule executions (Trigger.dev disabled)`
      )
    }

    return NextResponse.json({
      message: 'Scheduled workflow executions processed',
      executedCount: dueSchedules.length,
    })
  } catch (error: any) {
    logger.error(`[${requestId}] Error in scheduled execution handler`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
