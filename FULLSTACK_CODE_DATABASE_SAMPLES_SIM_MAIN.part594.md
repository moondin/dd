---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 594
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 594 of 933)

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

---[FILE: credential-resolver.ts]---
Location: sim-main/apps/sim/lib/workflows/credentials/credential-resolver.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { getProviderIdFromServiceId } from '@/lib/oauth/oauth'
import { getBlock } from '@/blocks/index'
import type { SubBlockConfig } from '@/blocks/types'
import type { BlockState } from '@/stores/workflows/workflow/types'

const logger = createLogger('CredentialResolver')

interface Credential {
  id: string
  isDefault: boolean
  scopes?: string[]
}

/**
 * Resolves and auto-selects credentials for blocks before YAML generation
 * This ensures that credential fields are populated with appropriate values
 */
export async function resolveCredentialsForWorkflow(
  blocks: Record<string, BlockState>,
  subBlockValues: Record<string, Record<string, any>>,
  userId?: string
): Promise<Record<string, Record<string, any>>> {
  const resolvedValues = { ...subBlockValues }

  logger.info('Starting credential resolution for workflow', {
    userId,
    blockCount: Object.keys(blocks).length,
  })

  try {
    // Process each block
    for (const [blockId, blockState] of Object.entries(blocks)) {
      const blockConfig = getBlock(blockState.type)
      if (!blockConfig) {
        logger.debug(`No config found for block type: ${blockState.type}`)
        continue
      }

      // Initialize block values if not present
      if (!resolvedValues[blockId]) {
        resolvedValues[blockId] = {}
      }

      // Process each subBlock configuration
      for (const subBlockConfig of blockConfig.subBlocks) {
        // Only process oauth-input type subblocks (credential selectors)
        if (subBlockConfig.type !== 'oauth-input') continue

        const subBlockId = subBlockConfig.id
        const existingValue = resolvedValues[blockId][subBlockId]

        logger.debug(`Checking credential for ${blockId}.${subBlockId}`, {
          blockType: blockState.type,
          serviceId: subBlockConfig.serviceId,
          hasExistingValue: !!existingValue,
          existingValue,
        })

        // Skip if already has a valid value
        if (existingValue && typeof existingValue === 'string' && existingValue.trim()) {
          logger.debug(`Skipping - already has credential: ${existingValue}`)
          continue
        }

        // Resolve credential for this subblock
        const credentialId = await resolveCredentialForSubBlock(subBlockConfig, blockState, userId)

        if (credentialId) {
          resolvedValues[blockId][subBlockId] = credentialId
          logger.info(`Auto-selected credential for ${blockId}.${subBlockId}`, {
            blockType: blockState.type,
            serviceId: subBlockConfig.serviceId,
            credentialId,
          })
        } else {
          logger.info(`No credential auto-selected for ${blockId}.${subBlockId}`, {
            blockType: blockState.type,
            serviceId: subBlockConfig.serviceId,
          })
        }
      }
    }

    logger.info('Credential resolution completed', {
      resolvedCount: Object.values(resolvedValues).reduce(
        (count, blockValues) => count + Object.keys(blockValues).length,
        0
      ),
    })

    return resolvedValues
  } catch (error) {
    logger.error('Error resolving credentials for workflow:', error)
    // Return original values on error
    return subBlockValues
  }
}

/**
 * Resolves a single credential for a subblock
 */
async function resolveCredentialForSubBlock(
  subBlockConfig: SubBlockConfig & {
    requiredScopes?: string[]
    serviceId?: string
  },
  blockState: BlockState,
  userId?: string
): Promise<string | null> {
  try {
    const requiredScopes = subBlockConfig.requiredScopes || []
    const serviceId = subBlockConfig.serviceId

    logger.debug('Resolving credential for subblock', {
      blockType: blockState.type,
      serviceId,
      requiredScopes,
      userId,
    })

    if (!serviceId) {
      logger.debug('No serviceId specified, skipping credential resolution')
      return null
    }

    // Derive providerId from serviceId using OAuth config
    const effectiveProviderId = getProviderIdFromServiceId(serviceId)

    logger.debug('Derived provider info', {
      serviceId,
      effectiveProviderId,
    })

    // Fetch credentials from the API
    // Note: This assumes we're running in a server context with access to fetch
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const credentialsUrl = `${baseUrl}/api/auth/oauth/credentials?provider=${effectiveProviderId}`

    logger.debug('Fetching credentials', { url: credentialsUrl })

    const response = await fetch(credentialsUrl, {
      headers: userId ? { 'x-user-id': userId } : {},
    })

    if (!response.ok) {
      logger.error(`Failed to fetch credentials for provider ${effectiveProviderId}`, {
        status: response.status,
        statusText: response.statusText,
      })
      return null
    }

    const data = await response.json()
    const credentials: Credential[] = data.credentials || []

    logger.info(`Found ${credentials.length} credential(s) for provider ${effectiveProviderId}`, {
      credentials: credentials.map((c) => ({
        id: c.id,
        isDefault: c.isDefault,
      })),
    })

    if (credentials.length === 0) {
      return null
    }

    // Auto-selection logic (same as credential-selector component):
    // 1. Look for default credential
    // 2. If only one credential, select it
    const defaultCred = credentials.find((cred) => cred.isDefault)
    if (defaultCred) {
      logger.info(`Selected default credential: ${defaultCred.id}`)
      return defaultCred.id
    }

    if (credentials.length === 1) {
      logger.info(`Selected only credential: ${credentials[0].id}`)
      return credentials[0].id
    }

    // No clear selection, return null
    logger.info('Multiple credentials available, none selected (user must choose)')
    return null
  } catch (error) {
    logger.error('Error resolving credential for subblock:', error)
    return null
  }
}

/**
 * Checks if a workflow needs credential resolution
 * Returns true if any block has credential-type subblocks without values
 */
export function needsCredentialResolution(
  blocks: Record<string, BlockState>,
  subBlockValues: Record<string, Record<string, any>>
): boolean {
  for (const [blockId, blockState] of Object.entries(blocks)) {
    const blockConfig = getBlock(blockState.type)
    if (!blockConfig) continue

    for (const subBlockConfig of blockConfig.subBlocks) {
      if (subBlockConfig.type !== 'oauth-input') continue

      const value = subBlockValues[blockId]?.[subBlockConfig.id]
      if (!value || (typeof value === 'string' && !value.trim())) {
        return true
      }
    }
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: operations.ts]---
Location: sim-main/apps/sim/lib/workflows/custom-tools/operations.ts

```typescript
import { db } from '@sim/db'
import { customTools } from '@sim/db/schema'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CustomToolsOperations')

/**
 * Internal function to create/update custom tools
 * Can be called from API routes or internal services
 */
export async function upsertCustomTools(params: {
  tools: Array<{
    id?: string
    title: string
    schema: any
    code: string
  }>
  workspaceId: string
  userId: string
  requestId?: string
}) {
  const { tools, workspaceId, userId, requestId = generateRequestId() } = params

  return await db.transaction(async (tx) => {
    for (const tool of tools) {
      const nowTime = new Date()

      if (tool.id) {
        const existingWorkspaceTool = await tx
          .select()
          .from(customTools)
          .where(and(eq(customTools.id, tool.id), eq(customTools.workspaceId, workspaceId)))
          .limit(1)

        if (existingWorkspaceTool.length > 0) {
          await tx
            .update(customTools)
            .set({
              title: tool.title,
              schema: tool.schema,
              code: tool.code,
              updatedAt: nowTime,
            })
            .where(and(eq(customTools.id, tool.id), eq(customTools.workspaceId, workspaceId)))
          continue
        }

        const existingLegacyTool = await tx
          .select()
          .from(customTools)
          .where(
            and(
              eq(customTools.id, tool.id),
              isNull(customTools.workspaceId),
              eq(customTools.userId, userId)
            )
          )
          .limit(1)

        if (existingLegacyTool.length > 0) {
          await tx
            .update(customTools)
            .set({
              title: tool.title,
              schema: tool.schema,
              code: tool.code,
              updatedAt: nowTime,
            })
            .where(eq(customTools.id, tool.id))

          logger.info(`[${requestId}] Updated legacy tool ${tool.id}`)
          continue
        }
      }

      const duplicateTitle = await tx
        .select()
        .from(customTools)
        .where(and(eq(customTools.workspaceId, workspaceId), eq(customTools.title, tool.title)))
        .limit(1)

      if (duplicateTitle.length > 0) {
        throw new Error(`A tool with the title "${tool.title}" already exists in this workspace`)
      }

      await tx.insert(customTools).values({
        id: nanoid(),
        workspaceId,
        userId,
        title: tool.title,
        schema: tool.schema,
        code: tool.code,
        createdAt: nowTime,
        updatedAt: nowTime,
      })
    }

    const resultTools = await tx
      .select()
      .from(customTools)
      .where(eq(customTools.workspaceId, workspaceId))
      .orderBy(desc(customTools.createdAt))

    return resultTools
  })
}
```

--------------------------------------------------------------------------------

````
