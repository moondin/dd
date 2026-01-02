---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 607
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 607 of 933)

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

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/workspaces/permissions/utils.ts
Signals: TypeORM

```typescript
import { db } from '@sim/db'
import { permissions, type permissionTypeEnum, user, workspace } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'

export type PermissionType = (typeof permissionTypeEnum.enumValues)[number]

/**
 * Get the highest permission level a user has for a specific entity
 *
 * @param userId - The ID of the user to check permissions for
 * @param entityType - The type of entity (e.g., 'workspace', 'workflow', etc.)
 * @param entityId - The ID of the specific entity
 * @returns Promise<PermissionType | null> - The highest permission the user has for the entity, or null if none
 */
export async function getUserEntityPermissions(
  userId: string,
  entityType: string,
  entityId: string
): Promise<PermissionType | null> {
  const result = await db
    .select({ permissionType: permissions.permissionType })
    .from(permissions)
    .where(
      and(
        eq(permissions.userId, userId),
        eq(permissions.entityType, entityType),
        eq(permissions.entityId, entityId)
      )
    )

  if (result.length === 0) {
    return null
  }

  const permissionOrder: Record<PermissionType, number> = { admin: 3, write: 2, read: 1 }
  const highestPermission = result.reduce((highest, current) => {
    return permissionOrder[current.permissionType] > permissionOrder[highest.permissionType]
      ? current
      : highest
  })

  return highestPermission.permissionType
}

/**
 * Check if a user has admin permission for a specific workspace
 *
 * @param userId - The ID of the user to check
 * @param workspaceId - The ID of the workspace to check
 * @returns Promise<boolean> - True if the user has admin permission for the workspace, false otherwise
 */
export async function hasAdminPermission(userId: string, workspaceId: string): Promise<boolean> {
  const result = await db
    .select({ id: permissions.id })
    .from(permissions)
    .where(
      and(
        eq(permissions.userId, userId),
        eq(permissions.entityType, 'workspace'),
        eq(permissions.entityId, workspaceId),
        eq(permissions.permissionType, 'admin')
      )
    )
    .limit(1)

  return result.length > 0
}

/**
 * Retrieves a list of users with their associated permissions for a given workspace.
 *
 * @param workspaceId - The ID of the workspace to retrieve user permissions for.
 * @returns A promise that resolves to an array of user objects, each containing user details and their permission type.
 */
export async function getUsersWithPermissions(workspaceId: string): Promise<
  Array<{
    userId: string
    email: string
    name: string
    permissionType: PermissionType
  }>
> {
  const usersWithPermissions = await db
    .select({
      userId: user.id,
      email: user.email,
      name: user.name,
      permissionType: permissions.permissionType,
    })
    .from(permissions)
    .innerJoin(user, eq(permissions.userId, user.id))
    .where(and(eq(permissions.entityType, 'workspace'), eq(permissions.entityId, workspaceId)))
    .orderBy(user.email)

  return usersWithPermissions.map((row) => ({
    userId: row.userId,
    email: row.email,
    name: row.name,
    permissionType: row.permissionType,
  }))
}

/**
 * Check if a user has admin access to a specific workspace
 *
 * @param userId - The ID of the user to check
 * @param workspaceId - The ID of the workspace to check
 * @returns Promise<boolean> - True if the user has admin access to the workspace, false otherwise
 */
export async function hasWorkspaceAdminAccess(
  userId: string,
  workspaceId: string
): Promise<boolean> {
  const workspaceResult = await db
    .select({ ownerId: workspace.ownerId })
    .from(workspace)
    .where(eq(workspace.id, workspaceId))
    .limit(1)

  if (workspaceResult.length === 0) {
    return false
  }

  if (workspaceResult[0].ownerId === userId) {
    return true
  }

  return await hasAdminPermission(userId, workspaceId)
}

/**
 * Get a list of workspaces that the user has access to
 *
 * @param userId - The ID of the user to check
 * @returns Promise<Array<{
 *   id: string
 *   name: string
 *   ownerId: string
 *   accessType: 'direct' | 'owner'
 * }>> - A list of workspaces that the user has access to
 */
export async function getManageableWorkspaces(userId: string): Promise<
  Array<{
    id: string
    name: string
    ownerId: string
    accessType: 'direct' | 'owner'
  }>
> {
  const ownedWorkspaces = await db
    .select({
      id: workspace.id,
      name: workspace.name,
      ownerId: workspace.ownerId,
    })
    .from(workspace)
    .where(eq(workspace.ownerId, userId))

  const adminWorkspaces = await db
    .select({
      id: workspace.id,
      name: workspace.name,
      ownerId: workspace.ownerId,
    })
    .from(workspace)
    .innerJoin(permissions, eq(permissions.entityId, workspace.id))
    .where(
      and(
        eq(permissions.userId, userId),
        eq(permissions.entityType, 'workspace'),
        eq(permissions.permissionType, 'admin')
      )
    )

  const ownedSet = new Set(ownedWorkspaces.map((w) => w.id))
  const combined = [
    ...ownedWorkspaces.map((ws) => ({ ...ws, accessType: 'owner' as const })),
    ...adminWorkspaces
      .filter((ws) => !ownedSet.has(ws.id))
      .map((ws) => ({ ...ws, accessType: 'direct' as const })),
  ]

  return combined
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/providers/index.ts

```typescript
import { getCostMultiplier } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'
import type { StreamingExecution } from '@/executor/types'
import type { ProviderRequest, ProviderResponse } from '@/providers/types'
import {
  calculateCost,
  generateStructuredOutputInstructions,
  getProvider,
  shouldBillModelUsage,
  supportsTemperature,
} from '@/providers/utils'

const logger = createLogger('Providers')

/**
 * Maximum number of iterations for tool call loops to prevent infinite loops.
 * Used across all providers that support tool/function calling.
 */
export const MAX_TOOL_ITERATIONS = 20

function sanitizeRequest(request: ProviderRequest): ProviderRequest {
  const sanitizedRequest = { ...request }

  if (sanitizedRequest.model && !supportsTemperature(sanitizedRequest.model)) {
    sanitizedRequest.temperature = undefined
  }

  return sanitizedRequest
}

function isStreamingExecution(response: any): response is StreamingExecution {
  return response && typeof response === 'object' && 'stream' in response && 'execution' in response
}

function isReadableStream(response: any): response is ReadableStream {
  return response instanceof ReadableStream
}

export async function executeProviderRequest(
  providerId: string,
  request: ProviderRequest
): Promise<ProviderResponse | ReadableStream | StreamingExecution> {
  const provider = getProvider(providerId)
  if (!provider) {
    throw new Error(`Provider not found: ${providerId}`)
  }

  if (!provider.executeRequest) {
    throw new Error(`Provider ${providerId} does not implement executeRequest`)
  }
  const sanitizedRequest = sanitizeRequest(request)

  if (sanitizedRequest.responseFormat) {
    if (
      typeof sanitizedRequest.responseFormat === 'string' &&
      sanitizedRequest.responseFormat === ''
    ) {
      logger.info('Empty response format provided, ignoring it')
      sanitizedRequest.responseFormat = undefined
    } else {
      const structuredOutputInstructions = generateStructuredOutputInstructions(
        sanitizedRequest.responseFormat
      )

      if (structuredOutputInstructions.trim()) {
        const originalPrompt = sanitizedRequest.systemPrompt || ''
        sanitizedRequest.systemPrompt =
          `${originalPrompt}\n\n${structuredOutputInstructions}`.trim()

        logger.info('Added structured output instructions to system prompt')
      }
    }
  }

  const response = await provider.executeRequest(sanitizedRequest)

  if (isStreamingExecution(response)) {
    logger.info('Provider returned StreamingExecution')
    return response
  }

  if (isReadableStream(response)) {
    logger.info('Provider returned ReadableStream')
    return response
  }

  if (response.tokens) {
    const { prompt: promptTokens = 0, completion: completionTokens = 0 } = response.tokens
    const useCachedInput = !!request.context && request.context.length > 0

    if (shouldBillModelUsage(response.model)) {
      const costMultiplier = getCostMultiplier()
      response.cost = calculateCost(
        response.model,
        promptTokens,
        completionTokens,
        useCachedInput,
        costMultiplier,
        costMultiplier
      )
    } else {
      response.cost = {
        input: 0,
        output: 0,
        total: 0,
        pricing: {
          input: 0,
          output: 0,
          updatedAt: new Date().toISOString(),
        },
      }
      logger.debug(
        `Not billing model usage for ${response.model} - user provided API key or not hosted model`
      )
    }
  }

  return response
}
```

--------------------------------------------------------------------------------

````
