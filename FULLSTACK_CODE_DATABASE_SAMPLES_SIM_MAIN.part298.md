---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 298
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 298 of 933)

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
Location: sim-main/apps/sim/app/api/schedules/[id]/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { workflow, workflowSchedule } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('ScheduleAPI')

export const dynamic = 'force-dynamic'

const scheduleActionEnum = z.enum(['reactivate', 'disable'])
const scheduleStatusEnum = z.enum(['active', 'disabled'])

const scheduleUpdateSchema = z
  .object({
    action: scheduleActionEnum.optional(),
    status: scheduleStatusEnum.optional(),
  })
  .refine((data) => data.action || data.status, {
    message: 'Either action or status must be provided',
  })

/**
 * Delete a schedule
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()

  try {
    const { id } = await params
    logger.debug(`[${requestId}] Deleting schedule with ID: ${id}`)

    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized schedule deletion attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the schedule and check ownership
    const schedules = await db
      .select({
        schedule: workflowSchedule,
        workflow: {
          id: workflow.id,
          userId: workflow.userId,
          workspaceId: workflow.workspaceId,
        },
      })
      .from(workflowSchedule)
      .innerJoin(workflow, eq(workflowSchedule.workflowId, workflow.id))
      .where(eq(workflowSchedule.id, id))
      .limit(1)

    if (schedules.length === 0) {
      logger.warn(`[${requestId}] Schedule not found: ${id}`)
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    const workflowRecord = schedules[0].workflow

    // Check authorization - either the user owns the workflow or has write/admin workspace permissions
    let isAuthorized = workflowRecord.userId === session.user.id

    // If not authorized by ownership and the workflow belongs to a workspace, check workspace permissions
    if (!isAuthorized && workflowRecord.workspaceId) {
      const userPermission = await getUserEntityPermissions(
        session.user.id,
        'workspace',
        workflowRecord.workspaceId
      )
      isAuthorized = userPermission === 'write' || userPermission === 'admin'
    }

    if (!isAuthorized) {
      logger.warn(`[${requestId}] Unauthorized schedule deletion attempt for schedule: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete the schedule
    await db.delete(workflowSchedule).where(eq(workflowSchedule.id, id))

    logger.info(`[${requestId}] Successfully deleted schedule: ${id}`)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error deleting schedule`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Update a schedule - can be used to reactivate a disabled schedule
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()

  try {
    const { id } = await params
    const scheduleId = id
    logger.debug(`[${requestId}] Updating schedule with ID: ${scheduleId}`)

    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized schedule update attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = scheduleUpdateSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.errors[0]
      logger.warn(`[${requestId}] Validation error:`, firstError)
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const { action, status: requestedStatus } = validation.data

    const [schedule] = await db
      .select({
        id: workflowSchedule.id,
        workflowId: workflowSchedule.workflowId,
        status: workflowSchedule.status,
      })
      .from(workflowSchedule)
      .where(eq(workflowSchedule.id, scheduleId))
      .limit(1)

    if (!schedule) {
      logger.warn(`[${requestId}] Schedule not found: ${scheduleId}`)
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    const [workflowRecord] = await db
      .select({ userId: workflow.userId, workspaceId: workflow.workspaceId })
      .from(workflow)
      .where(eq(workflow.id, schedule.workflowId))
      .limit(1)

    if (!workflowRecord) {
      logger.warn(`[${requestId}] Workflow not found for schedule: ${scheduleId}`)
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
      logger.warn(`[${requestId}] User not authorized to modify this schedule: ${scheduleId}`)
      return NextResponse.json({ error: 'Not authorized to modify this schedule' }, { status: 403 })
    }

    if (action === 'reactivate' || (requestedStatus && requestedStatus === 'active')) {
      if (schedule.status === 'active') {
        return NextResponse.json({ message: 'Schedule is already active' }, { status: 200 })
      }

      const now = new Date()
      const nextRunAt = new Date(now.getTime() + 60 * 1000) // Schedule to run in 1 minute

      await db
        .update(workflowSchedule)
        .set({
          status: 'active',
          failedCount: 0,
          updatedAt: now,
          nextRunAt,
        })
        .where(eq(workflowSchedule.id, scheduleId))

      logger.info(`[${requestId}] Reactivated schedule: ${scheduleId}`)

      return NextResponse.json({
        message: 'Schedule activated successfully',
        nextRunAt,
      })
    }

    if (action === 'disable' || (requestedStatus && requestedStatus === 'disabled')) {
      if (schedule.status === 'disabled') {
        return NextResponse.json({ message: 'Schedule is already disabled' }, { status: 200 })
      }

      const now = new Date()

      await db
        .update(workflowSchedule)
        .set({
          status: 'disabled',
          updatedAt: now,
          nextRunAt: null, // Clear next run time when disabled
        })
        .where(eq(workflowSchedule.id, scheduleId))

      logger.info(`[${requestId}] Disabled schedule: ${scheduleId}`)

      return NextResponse.json({
        message: 'Schedule disabled successfully',
      })
    }

    logger.warn(`[${requestId}] Unsupported update action for schedule: ${scheduleId}`)
    return NextResponse.json({ error: 'Unsupported update action' }, { status: 400 })
  } catch (error) {
    logger.error(`[${requestId}] Error updating schedule`, error)
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/schedules/[id]/status/route.test.ts

```typescript
/**
 * Integration tests for schedule status API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, mockScheduleStatusDb } from '@/app/api/__test-utils__/utils'

// Common mocks
const mockSchedule = {
  id: 'schedule-id',
  workflowId: 'workflow-id',
  status: 'active',
  failedCount: 0,
  lastRanAt: new Date('2024-01-01T00:00:00.000Z'),
  lastFailedAt: null,
  nextRunAt: new Date('2024-01-02T00:00:00.000Z'),
}

beforeEach(() => {
  vi.resetModules()

  vi.doMock('@/lib/logs/console/logger', () => ({
    createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
  }))

  vi.doMock('crypto', () => ({
    randomUUID: vi.fn(() => 'test-uuid'),
    default: { randomUUID: vi.fn(() => 'test-uuid') },
  }))
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('Schedule Status API Route', () => {
  it('returns schedule status successfully', async () => {
    mockScheduleStatusDb({}) // default mocks

    vi.doMock('@/lib/auth', () => ({
      getSession: vi.fn().mockResolvedValue({ user: { id: 'user-id' } }),
    }))

    const req = createMockRequest('GET')

    const { GET } = await import('@/app/api/schedules/[id]/status/route')

    const res = await GET(req, { params: Promise.resolve({ id: 'schedule-id' }) })

    expect(res.status).toBe(200)
    const data = await res.json()

    expect(data).toMatchObject({
      status: 'active',
      failedCount: 0,
      nextRunAt: mockSchedule.nextRunAt.toISOString(),
      isDisabled: false,
    })
  })

  it('marks disabled schedules with isDisabled = true', async () => {
    mockScheduleStatusDb({ schedule: [{ ...mockSchedule, status: 'disabled' }] })

    vi.doMock('@/lib/auth', () => ({
      getSession: vi.fn().mockResolvedValue({ user: { id: 'user-id' } }),
    }))

    const req = createMockRequest('GET')
    const { GET } = await import('@/app/api/schedules/[id]/status/route')
    const res = await GET(req, { params: Promise.resolve({ id: 'schedule-id' }) })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('status', 'disabled')
    expect(data).toHaveProperty('isDisabled', true)
    expect(data).toHaveProperty('lastFailedAt')
  })

  it('returns 404 if schedule not found', async () => {
    mockScheduleStatusDb({ schedule: [] })

    vi.doMock('@/lib/auth', () => ({
      getSession: vi.fn().mockResolvedValue({ user: { id: 'user-id' } }),
    }))

    const req = createMockRequest('GET')
    const { GET } = await import('@/app/api/schedules/[id]/status/route')
    const res = await GET(req, { params: Promise.resolve({ id: 'missing-id' }) })

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data).toHaveProperty('error', 'Schedule not found')
  })

  it('returns 404 if related workflow not found', async () => {
    mockScheduleStatusDb({ workflow: [] })

    vi.doMock('@/lib/auth', () => ({
      getSession: vi.fn().mockResolvedValue({ user: { id: 'user-id' } }),
    }))

    const req = createMockRequest('GET')
    const { GET } = await import('@/app/api/schedules/[id]/status/route')
    const res = await GET(req, { params: Promise.resolve({ id: 'schedule-id' }) })

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data).toHaveProperty('error', 'Workflow not found')
  })

  it('returns 403 when user is not owner of workflow', async () => {
    mockScheduleStatusDb({ workflow: [{ userId: 'another-user' }] })

    vi.doMock('@/lib/auth', () => ({
      getSession: vi.fn().mockResolvedValue({ user: { id: 'user-id' } }),
    }))

    const req = createMockRequest('GET')
    const { GET } = await import('@/app/api/schedules/[id]/status/route')
    const res = await GET(req, { params: Promise.resolve({ id: 'schedule-id' }) })

    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data).toHaveProperty('error', 'Not authorized to view this schedule')
  })

  it('returns 401 when user is not authenticated', async () => {
    mockScheduleStatusDb({})

    vi.doMock('@/lib/auth', () => ({
      getSession: vi.fn().mockResolvedValue(null),
    }))

    const req = createMockRequest('GET')
    const { GET } = await import('@/app/api/schedules/[id]/status/route')
    const res = await GET(req, { params: Promise.resolve({ id: 'schedule-id' }) })

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data).toHaveProperty('error', 'Unauthorized')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/schedules/[id]/status/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { workflow, workflowSchedule } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('ScheduleStatusAPI')

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params
  const scheduleId = id

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized schedule status request`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [schedule] = await db
      .select({
        id: workflowSchedule.id,
        workflowId: workflowSchedule.workflowId,
        status: workflowSchedule.status,
        failedCount: workflowSchedule.failedCount,
        lastRanAt: workflowSchedule.lastRanAt,
        lastFailedAt: workflowSchedule.lastFailedAt,
        nextRunAt: workflowSchedule.nextRunAt,
      })
      .from(workflowSchedule)
      .where(eq(workflowSchedule.id, scheduleId))
      .limit(1)

    if (!schedule) {
      logger.warn(`[${requestId}] Schedule not found: ${scheduleId}`)
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    const [workflowRecord] = await db
      .select({ userId: workflow.userId, workspaceId: workflow.workspaceId })
      .from(workflow)
      .where(eq(workflow.id, schedule.workflowId))
      .limit(1)

    if (!workflowRecord) {
      logger.warn(`[${requestId}] Workflow not found for schedule: ${scheduleId}`)
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Check authorization - either the user owns the workflow or has workspace permissions
    let isAuthorized = workflowRecord.userId === session.user.id

    // If not authorized by ownership and the workflow belongs to a workspace, check workspace permissions
    if (!isAuthorized && workflowRecord.workspaceId) {
      const userPermission = await getUserEntityPermissions(
        session.user.id,
        'workspace',
        workflowRecord.workspaceId
      )
      isAuthorized = userPermission !== null
    }

    if (!isAuthorized) {
      logger.warn(`[${requestId}] User not authorized to view this schedule: ${scheduleId}`)
      return NextResponse.json({ error: 'Not authorized to view this schedule' }, { status: 403 })
    }

    return NextResponse.json({
      status: schedule.status,
      failedCount: schedule.failedCount,
      lastRanAt: schedule.lastRanAt,
      lastFailedAt: schedule.lastFailedAt,
      nextRunAt: schedule.nextRunAt,
      isDisabled: schedule.status === 'disabled',
    })
  } catch (error) {
    logger.error(`[${requestId}] Error retrieving schedule status: ${scheduleId}`, error)
    return NextResponse.json({ error: 'Failed to retrieve schedule status' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/stars/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { env } from '@/lib/core/config/env'

function formatStarCount(num: number): string {
  if (num < 1000) return String(num)
  const formatted = (Math.round(num / 100) / 10).toFixed(1)
  return formatted.endsWith('.0') ? `${formatted.slice(0, -2)}k` : `${formatted}k`
}

export async function GET() {
  try {
    const token = env.GITHUB_TOKEN
    const response = await fetch('https://api.github.com/repos/simstudioai/sim', {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'SimStudio/1.0',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 3600 },
      cache: 'force-cache',
    })

    if (!response.ok) {
      console.warn('GitHub API request failed:', response.status)
      return NextResponse.json({ stars: formatStarCount(19400) })
    }

    const data = await response.json()
    return NextResponse.json({ stars: formatStarCount(Number(data?.stargazers_count ?? 19400)) })
  } catch (error) {
    console.warn('Error fetching GitHub stars:', error)
    return NextResponse.json({ stars: formatStarCount(19400) })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/status/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import type { IncidentIOWidgetResponse, StatusResponse, StatusType } from '@/app/api/status/types'

const logger = createLogger('StatusAPI')

let cachedResponse: { data: StatusResponse; timestamp: number } | null = null
const CACHE_TTL = 2 * 60 * 1000

function determineStatus(data: IncidentIOWidgetResponse): {
  status: StatusType
  message: string
} {
  if (data.ongoing_incidents && data.ongoing_incidents.length > 0) {
    const worstImpact = data.ongoing_incidents[0].current_worst_impact

    if (worstImpact === 'full_outage') {
      return { status: 'outage', message: 'Service Disruption' }
    }
    if (worstImpact === 'partial_outage') {
      return { status: 'degraded', message: 'Experiencing Issues' }
    }
    return { status: 'degraded', message: 'Experiencing Issues' }
  }

  if (data.in_progress_maintenances && data.in_progress_maintenances.length > 0) {
    return { status: 'maintenance', message: 'Under Maintenance' }
  }

  return { status: 'operational', message: 'All Systems Operational' }
}

export async function GET() {
  try {
    const now = Date.now()

    if (cachedResponse && now - cachedResponse.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedResponse.data, {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60',
          'X-Cache': 'HIT',
        },
      })
    }

    const response = await fetch('https://status.sim.ai/api/v1/summary', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(`incident.io API returned ${response.status}`)
    }

    const data: IncidentIOWidgetResponse = await response.json()

    const { status, message } = determineStatus(data)

    const statusResponse: StatusResponse = {
      status,
      message,
      url: data.page_url || 'https://status.sim.ai',
      lastUpdated: new Date().toISOString(),
    }

    cachedResponse = {
      data: statusResponse,
      timestamp: now,
    }

    return NextResponse.json(statusResponse, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60',
        'X-Cache': 'MISS',
      },
    })
  } catch (error) {
    logger.error('Error fetching status from incident.io:', error)

    const errorResponse: StatusResponse = {
      status: 'error',
      message: 'Status Unknown',
      url: 'https://status.sim.ai',
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(errorResponse, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/app/api/status/types.ts

```typescript
export interface IncidentIOComponent {
  id: string
  name: string
  group_name?: string
  current_status: 'operational' | 'degraded_performance' | 'partial_outage' | 'full_outage'
}

export interface IncidentIOIncident {
  id: string
  name: string
  status: 'investigating' | 'identified' | 'monitoring'
  url: string
  last_update_at: string
  last_update_message: string
  current_worst_impact: 'degraded_performance' | 'partial_outage' | 'full_outage'
  affected_components: IncidentIOComponent[]
}

export interface IncidentIOMaintenance {
  id: string
  name: string
  status: 'maintenance_scheduled' | 'maintenance_in_progress'
  url: string
  last_update_at: string
  last_update_message: string
  affected_components: IncidentIOComponent[]
  started_at?: string
  scheduled_end_at?: string
  starts_at?: string
  ends_at?: string
}

export interface IncidentIOWidgetResponse {
  page_title: string
  page_url: string
  ongoing_incidents: IncidentIOIncident[]
  in_progress_maintenances: IncidentIOMaintenance[]
  scheduled_maintenances: IncidentIOMaintenance[]
}

export type StatusType = 'operational' | 'degraded' | 'outage' | 'maintenance' | 'loading' | 'error'

export interface StatusResponse {
  status: StatusType
  message: string
  url: string
  lastUpdated: string
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/telemetry/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/core/config/env'
import { isProd } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('TelemetryAPI')

const ALLOWED_CATEGORIES = [
  'page_view',
  'feature_usage',
  'performance',
  'error',
  'workflow',
  'consent',
  'batch',
]

const DEFAULT_TIMEOUT = 5000 // 5 seconds timeout

/**
 * Validates telemetry data to ensure it doesn't contain sensitive information
 */
function validateTelemetryData(data: any): boolean {
  if (!data || typeof data !== 'object') {
    return false
  }

  if (!data.category || !data.action) {
    return false
  }

  if (!ALLOWED_CATEGORIES.includes(data.category)) {
    return false
  }

  const jsonStr = JSON.stringify(data).toLowerCase()
  const sensitivePatterns = [/password/, /token/, /secret/, /key/, /auth/, /credential/, /private/]

  return !sensitivePatterns.some((pattern) => pattern.test(jsonStr))
}

/**
 * Safely converts a value to string, handling undefined and null values
 */
function safeStringValue(value: any): string {
  if (value === undefined || value === null) {
    return ''
  }

  try {
    return String(value)
  } catch (_e) {
    return ''
  }
}

/**
 * Creates a safe attribute object for OpenTelemetry
 */
function createSafeAttributes(
  data: Record<string, any>
): Array<{ key: string; value: { stringValue: string } }> {
  if (!data || typeof data !== 'object') {
    return []
  }

  const attributes: Array<{ key: string; value: { stringValue: string } }> = []

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && key) {
      attributes.push({
        key,
        value: { stringValue: safeStringValue(value) },
      })
    }
  })

  return attributes
}

/**
 * Forwards telemetry data to OpenTelemetry collector
 */
async function forwardToCollector(data: any): Promise<boolean> {
  if (!data || typeof data !== 'object') {
    logger.error('Invalid telemetry data format')
    return false
  }

  const endpoint = env.TELEMETRY_ENDPOINT || 'https://telemetry.simstudio.ai/v1/traces'
  const timeout = DEFAULT_TIMEOUT

  try {
    const timestamp = Date.now() * 1000000

    const safeAttrs = createSafeAttributes(data)

    const serviceAttrs = [
      { key: 'service.name', value: { stringValue: 'sim-studio' } },
      {
        key: 'service.version',
        value: { stringValue: '0.1.0' },
      },
      {
        key: 'deployment.environment',
        value: { stringValue: isProd ? 'production' : 'development' },
      },
    ]

    const spanName =
      data.category && data.action ? `${data.category}.${data.action}` : 'telemetry.event'

    const payload = {
      resourceSpans: [
        {
          resource: {
            attributes: serviceAttrs,
          },
          instrumentationLibrarySpans: [
            {
              spans: [
                {
                  name: spanName,
                  kind: 1,
                  startTimeUnixNano: timestamp,
                  endTimeUnixNano: timestamp + 1000000,
                  attributes: safeAttrs,
                },
              ],
            },
          ],
        },
      ],
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }

      const response = await fetch(endpoint, options)
      clearTimeout(timeoutId)

      if (!response.ok) {
        logger.error('Telemetry collector returned error', {
          status: response.status,
          statusText: response.statusText,
        })
        return false
      }

      return true
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        logger.error('Telemetry request timed out', { endpoint })
      } else {
        logger.error('Failed to send telemetry to collector', fetchError)
      }
      return false
    }
  } catch (error) {
    logger.error('Error preparing telemetry payload', error)
    return false
  }
}

/**
 * Endpoint that receives telemetry events and forwards them to OpenTelemetry collector
 */
export async function POST(req: NextRequest) {
  try {
    let eventData
    try {
      eventData = await req.json()
    } catch (_parseError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    if (!validateTelemetryData(eventData)) {
      return NextResponse.json(
        { error: 'Invalid telemetry data format or contains sensitive information' },
        { status: 400 }
      )
    }

    const forwarded = await forwardToCollector(eventData)

    return NextResponse.json({
      success: true,
      forwarded,
    })
  } catch (error) {
    logger.error('Error processing telemetry event', error)
    return NextResponse.json({ error: 'Failed to process telemetry event' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/templates/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import {
  member,
  templateCreators,
  templateStars,
  templates,
  user,
  workflow,
  workflowDeploymentVersion,
} from '@sim/db/schema'
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import {
  extractRequiredCredentials,
  sanitizeCredentials,
} from '@/lib/workflows/credentials/credential-extractor'

const logger = createLogger('TemplatesAPI')

export const revalidate = 0

// Function to sanitize sensitive data from workflow state
// Now uses the more comprehensive sanitizeCredentials from credential-extractor
function sanitizeWorkflowState(state: any): any {
  return sanitizeCredentials(state)
}

// Schema for creating a template
const CreateTemplateSchema = z.object({
  workflowId: z.string().min(1, 'Workflow ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  details: z
    .object({
      tagline: z.string().max(500, 'Tagline must be less than 500 characters').optional(),
      about: z.string().optional(), // Markdown long description
    })
    .optional(),
  creatorId: z.string().min(1, 'Creator profile is required'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional().default([]),
})

// Schema for query parameters
const QueryParamsSchema = z.object({
  limit: z.coerce.number().optional().default(50),
  offset: z.coerce.number().optional().default(0),
  search: z.string().optional(),
  workflowId: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  includeAllStatuses: z.coerce.boolean().optional().default(false), // For super users
})

// GET /api/templates - Retrieve templates
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized templates access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const params = QueryParamsSchema.parse(Object.fromEntries(searchParams.entries()))

    logger.debug(`[${requestId}] Fetching templates with params:`, params)

    // Check if user is a super user
    const currentUser = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    const isSuperUser = currentUser[0]?.isSuperUser || false

    // Build query conditions
    const conditions = []

    // Apply workflow filter if provided (for getting template by workflow)
    // When fetching by workflowId, we want to get the template regardless of status
    // This is used by the deploy modal to check if a template exists
    if (params.workflowId) {
      conditions.push(eq(templates.workflowId, params.workflowId))
      // Don't apply status filter when fetching by workflowId - we want to show
      // the template to its owner even if it's pending
    } else {
      // Apply status filter - only approved templates for non-super users
      if (params.status) {
        conditions.push(eq(templates.status, params.status))
      } else if (!isSuperUser || !params.includeAllStatuses) {
        // Non-super users and super users without includeAllStatuses flag see only approved templates
        conditions.push(eq(templates.status, 'approved'))
      }
    }

    // Apply search filter if provided
    if (params.search) {
      const searchTerm = `%${params.search}%`
      conditions.push(
        or(
          ilike(templates.name, searchTerm),
          sql`${templates.details}->>'tagline' ILIKE ${searchTerm}`
        )
      )
    }

    // Combine conditions
    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined

    // Apply ordering, limit, and offset with star information
    const results = await db
      .select({
        id: templates.id,
        workflowId: templates.workflowId,
        name: templates.name,
        details: templates.details,
        creatorId: templates.creatorId,
        creator: templateCreators,
        views: templates.views,
        stars: templates.stars,
        status: templates.status,
        tags: templates.tags,
        requiredCredentials: templates.requiredCredentials,
        state: templates.state,
        createdAt: templates.createdAt,
        updatedAt: templates.updatedAt,
        isStarred: sql<boolean>`CASE WHEN ${templateStars.id} IS NOT NULL THEN true ELSE false END`,
        isSuperUser: sql<boolean>`${isSuperUser}`, // Include super user status in response
      })
      .from(templates)
      .leftJoin(
        templateStars,
        and(eq(templateStars.templateId, templates.id), eq(templateStars.userId, session.user.id))
      )
      .leftJoin(templateCreators, eq(templates.creatorId, templateCreators.id))
      .where(whereCondition)
      .orderBy(desc(templates.views), desc(templates.createdAt))
      .limit(params.limit)
      .offset(params.offset)

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(templates)
      .where(whereCondition)

    const total = totalCount[0]?.count || 0

    logger.info(`[${requestId}] Successfully retrieved ${results.length} templates`)

    return NextResponse.json({
      data: results,
      pagination: {
        total,
        limit: params.limit,
        offset: params.offset,
        page: Math.floor(params.offset / params.limit) + 1,
        totalPages: Math.ceil(total / params.limit),
      },
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid query parameters`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error fetching templates`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/templates - Create a new template
export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized template creation attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = CreateTemplateSchema.parse(body)

    logger.debug(`[${requestId}] Creating template:`, {
      name: data.name,
      workflowId: data.workflowId,
    })

    // Verify the workflow exists and belongs to the user
    const workflowExists = await db
      .select({ id: workflow.id })
      .from(workflow)
      .where(eq(workflow.id, data.workflowId))
      .limit(1)

    if (workflowExists.length === 0) {
      logger.warn(`[${requestId}] Workflow not found: ${data.workflowId}`)
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Validate creator profile - required for all templates
    const creatorProfile = await db
      .select()
      .from(templateCreators)
      .where(eq(templateCreators.id, data.creatorId))
      .limit(1)

    if (creatorProfile.length === 0) {
      logger.warn(`[${requestId}] Creator profile not found: ${data.creatorId}`)
      return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 })
    }

    const creator = creatorProfile[0]

    // Verify user has permission to use this creator profile
    if (creator.referenceType === 'user') {
      if (creator.referenceId !== session.user.id) {
        logger.warn(`[${requestId}] User cannot use creator profile: ${data.creatorId}`)
        return NextResponse.json(
          { error: 'You do not have permission to use this creator profile' },
          { status: 403 }
        )
      }
    } else if (creator.referenceType === 'organization') {
      // Verify user is a member of the organization
      const membership = await db
        .select()
        .from(member)
        .where(
          and(eq(member.userId, session.user.id), eq(member.organizationId, creator.referenceId))
        )
        .limit(1)

      if (membership.length === 0) {
        logger.warn(
          `[${requestId}] User not a member of organization for creator: ${data.creatorId}`
        )
        return NextResponse.json(
          { error: 'You must be a member of the organization to use its creator profile' },
          { status: 403 }
        )
      }
    }

    // Create the template
    const templateId = uuidv4()
    const now = new Date()

    // Get the active deployment version for the workflow to copy its state
    const activeVersion = await db
      .select({
        id: workflowDeploymentVersion.id,
        state: workflowDeploymentVersion.state,
      })
      .from(workflowDeploymentVersion)
      .where(
        and(
          eq(workflowDeploymentVersion.workflowId, data.workflowId),
          eq(workflowDeploymentVersion.isActive, true)
        )
      )
      .limit(1)

    if (activeVersion.length === 0) {
      logger.warn(
        `[${requestId}] No active deployment version found for workflow: ${data.workflowId}`
      )
      return NextResponse.json(
        { error: 'Workflow must be deployed before creating a template' },
        { status: 400 }
      )
    }

    // Ensure the state includes workflow variables (if not already included)
    let stateWithVariables = activeVersion[0].state as any
    if (stateWithVariables && !stateWithVariables.variables) {
      // Fetch workflow variables if not in deployment version
      const [workflowRecord] = await db
        .select({ variables: workflow.variables })
        .from(workflow)
        .where(eq(workflow.id, data.workflowId))
        .limit(1)

      stateWithVariables = {
        ...stateWithVariables,
        variables: workflowRecord?.variables || undefined,
      }
    }

    // Extract credential requirements before sanitizing
    const requiredCredentials = extractRequiredCredentials(stateWithVariables)

    // Sanitize the workflow state to remove all credential values
    const sanitizedState = sanitizeWorkflowState(stateWithVariables)

    const newTemplate = {
      id: templateId,
      workflowId: data.workflowId,
      name: data.name,
      details: data.details || null,
      creatorId: data.creatorId,
      views: 0,
      stars: 0,
      status: 'pending' as const, // All new templates start as pending
      tags: data.tags || [],
      requiredCredentials: requiredCredentials, // Store the extracted credential requirements
      state: sanitizedState, // Store the sanitized state without credential values
      createdAt: now,
      updatedAt: now,
    }

    await db.insert(templates).values(newTemplate)

    logger.info(`[${requestId}] Successfully created template: ${templateId}`)

    return NextResponse.json(
      {
        id: templateId,
        message: 'Template submitted for approval successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid template data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid template data', details: error.errors },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error creating template`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
