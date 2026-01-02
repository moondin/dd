---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 591
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 591 of 933)

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
Location: sim-main/apps/sim/lib/webhooks/utils.ts

```typescript
/**
 * Pure utility functions for TwiML processing
 * This file has NO server-side dependencies to ensure it can be safely imported in client-side code
 */

/**
 * Convert square bracket notation to TwiML XML tags
 * Used by Twilio Voice tools to allow LLMs to generate TwiML without XML escaping issues
 *
 * @example
 * "[Response][Say]Hello[/Say][/Response]"
 * -> "<Response><Say>Hello</Say></Response>"
 */
export function convertSquareBracketsToTwiML(twiml: string | undefined): string | undefined {
  if (!twiml) {
    return twiml
  }
  // Replace [Tag] with <Tag> and [/Tag] with </Tag>
  return twiml.replace(/\[(\/?[^\]]+)\]/g, '<$1>')
}
```

--------------------------------------------------------------------------------

---[FILE: defaults.ts]---
Location: sim-main/apps/sim/lib/workflows/defaults.ts

```typescript
import { getBlockOutputs } from '@/lib/workflows/blocks/block-outputs'
import { getBlock } from '@/blocks'
import type { BlockConfig, SubBlockConfig } from '@/blocks/types'
import type { BlockState, SubBlockState, WorkflowState } from '@/stores/workflows/workflow/types'

export interface DefaultWorkflowArtifacts {
  workflowState: WorkflowState
  subBlockValues: Record<string, Record<string, unknown>>
  startBlockId: string
}

const START_BLOCK_TYPE = 'start_trigger'
const DEFAULT_START_POSITION = { x: 0, y: 0 }

function cloneDefaultValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => cloneDefaultValue(item))
  }

  if (value && typeof value === 'object') {
    return { ...(value as Record<string, unknown>) }
  }

  return value ?? null
}

function resolveInitialValue(subBlock: SubBlockConfig): unknown {
  if (typeof subBlock.value === 'function') {
    try {
      return cloneDefaultValue(subBlock.value({}))
    } catch (error) {
      // Ignore resolution errors and fall back to default/null values
    }
  }

  if (subBlock.defaultValue !== undefined) {
    return cloneDefaultValue(subBlock.defaultValue)
  }

  if (subBlock.type === 'input-format') {
    return [
      {
        id: crypto.randomUUID(),
        name: '',
        type: 'string',
        value: '',
        collapsed: false,
      },
    ]
  }

  if (subBlock.type === 'table') {
    return []
  }

  return null
}

function buildStartBlockConfig(): BlockConfig {
  const blockConfig = getBlock(START_BLOCK_TYPE)

  if (!blockConfig) {
    throw new Error('Start trigger block configuration is not registered')
  }

  return blockConfig
}

function buildStartBlockState(
  blockConfig: BlockConfig,
  blockId: string
): { blockState: BlockState; subBlockValues: Record<string, unknown> } {
  const subBlocks: Record<string, SubBlockState> = {}
  const subBlockValues: Record<string, unknown> = {}

  blockConfig.subBlocks.forEach((config) => {
    const initialValue = resolveInitialValue(config)

    subBlocks[config.id] = {
      id: config.id,
      type: config.type,
      value: (initialValue ?? null) as SubBlockState['value'],
    }

    subBlockValues[config.id] = initialValue ?? null
  })

  const outputs = getBlockOutputs(blockConfig.type, subBlocks)

  const blockState: BlockState = {
    id: blockId,
    type: blockConfig.type,
    name: blockConfig.name,
    position: { ...DEFAULT_START_POSITION },
    subBlocks,
    outputs,
    enabled: true,
    horizontalHandles: true,
    advancedMode: false,
    triggerMode: false,
    height: 0,
    data: {},
  }

  return { blockState, subBlockValues }
}

export function buildDefaultWorkflowArtifacts(): DefaultWorkflowArtifacts {
  const blockConfig = buildStartBlockConfig()
  const startBlockId = crypto.randomUUID()

  const { blockState, subBlockValues } = buildStartBlockState(blockConfig, startBlockId)

  const workflowState: WorkflowState = {
    blocks: {
      [startBlockId]: blockState,
    },
    edges: [],
    loops: {},
    parallels: {},
    lastSaved: Date.now(),
    isDeployed: false,
    deployedAt: undefined,
    deploymentStatuses: {},
    needsRedeployment: false,
  }

  return {
    workflowState,
    subBlockValues: {
      [startBlockId]: subBlockValues,
    },
    startBlockId,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: input-format-utils.ts]---
Location: sim-main/apps/sim/lib/workflows/input-format-utils.ts

```typescript
import type { InputFormatField } from '@/lib/workflows/types'

/**
 * Normalizes an input format value into a list of valid fields.
 *
 * Filters out:
 * - null or undefined values
 * - Empty arrays
 * - Non-array values
 * - Fields without names
 * - Fields with empty or whitespace-only names
 *
 * @param inputFormatValue - Raw input format value from subblock state
 * @returns Array of validated input format fields
 */
export function normalizeInputFormatValue(inputFormatValue: unknown): InputFormatField[] {
  // Handle null, undefined, and empty arrays
  if (
    inputFormatValue === null ||
    inputFormatValue === undefined ||
    (Array.isArray(inputFormatValue) && inputFormatValue.length === 0)
  ) {
    return []
  }

  // Handle non-array values
  if (!Array.isArray(inputFormatValue)) {
    return []
  }

  // Filter valid fields
  return inputFormatValue.filter(
    (field): field is InputFormatField =>
      field &&
      typeof field === 'object' &&
      typeof field.name === 'string' &&
      field.name.trim() !== ''
  )
}
```

--------------------------------------------------------------------------------

---[FILE: state-builder.ts]---
Location: sim-main/apps/sim/lib/workflows/state-builder.ts

```typescript
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

/**
 * Build workflow state in the same format as the deployment process
 * This utility ensures consistent state format between template creation and deployment
 */
export function buildWorkflowStateForTemplate(workflowId: string) {
  const workflowStore = useWorkflowStore.getState()
  const { activeWorkflowId } = useWorkflowRegistry.getState()

  // Get current workflow state
  const { blocks, edges } = workflowStore

  // Generate loops and parallels in the same format as deployment
  const loops = workflowStore.generateLoopBlocks()
  const parallels = workflowStore.generateParallelBlocks()

  // Build the state object in the same format as deployment
  const state = {
    blocks,
    edges,
    loops,
    parallels,
    lastSaved: Date.now(),
  }

  return state
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/workflows/types.ts

```typescript
export interface InputFormatField {
  name?: string
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'files' | string
  value?: unknown
}

export const USER_FILE_ACCESSIBLE_PROPERTIES = ['id', 'name', 'url', 'size', 'type'] as const

export type UserFileAccessibleProperty = (typeof USER_FILE_ACCESSIBLE_PROPERTIES)[number]

export const USER_FILE_PROPERTY_TYPES: Record<UserFileAccessibleProperty, string> = {
  id: 'string',
  name: 'string',
  url: 'string',
  size: 'number',
  type: 'string',
} as const

export const START_BLOCK_RESERVED_FIELDS = ['input', 'conversationId', 'files'] as const

export type StartBlockReservedField = (typeof START_BLOCK_RESERVED_FIELDS)[number]

export type LoopType = 'for' | 'forEach' | 'while' | 'doWhile'

export type ParallelType = 'collection' | 'count'
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/workflows/utils.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { permissions, workflow as workflowTable, workspace } from '@sim/db/schema'
import type { InferSelectModel } from 'drizzle-orm'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import type { PermissionType } from '@/lib/workspaces/permissions/utils'
import type { ExecutionResult } from '@/executor/types'
import type { WorkflowState } from '@/stores/workflows/workflow/types'

const logger = createLogger('WorkflowUtils')

type WorkflowSelection = InferSelectModel<typeof workflowTable>

export async function getWorkflowById(id: string) {
  const rows = await db.select().from(workflowTable).where(eq(workflowTable.id, id)).limit(1)

  return rows[0]
}

type WorkflowRecord = ReturnType<typeof getWorkflowById> extends Promise<infer R>
  ? NonNullable<R>
  : never

export interface WorkflowAccessContext {
  workflow: WorkflowRecord
  workspaceOwnerId: string | null
  workspacePermission: PermissionType | null
  isOwner: boolean
  isWorkspaceOwner: boolean
}

export async function getWorkflowAccessContext(
  workflowId: string,
  userId?: string
): Promise<WorkflowAccessContext | null> {
  const workflow = await getWorkflowById(workflowId)

  if (!workflow) {
    return null
  }

  let workspaceOwnerId: string | null = null
  let workspacePermission: PermissionType | null = null

  if (workflow.workspaceId) {
    const [workspaceRow] = await db
      .select({ ownerId: workspace.ownerId })
      .from(workspace)
      .where(eq(workspace.id, workflow.workspaceId))
      .limit(1)

    workspaceOwnerId = workspaceRow?.ownerId ?? null

    if (userId) {
      const [permissionRow] = await db
        .select({ permissionType: permissions.permissionType })
        .from(permissions)
        .where(
          and(
            eq(permissions.userId, userId),
            eq(permissions.entityType, 'workspace'),
            eq(permissions.entityId, workflow.workspaceId)
          )
        )
        .limit(1)

      workspacePermission = permissionRow?.permissionType ?? null
    }
  }

  const resolvedUserId = userId ?? null

  const isOwner = resolvedUserId ? workflow.userId === resolvedUserId : false
  const isWorkspaceOwner = resolvedUserId ? workspaceOwnerId === resolvedUserId : false

  return {
    workflow,
    workspaceOwnerId,
    workspacePermission,
    isOwner,
    isWorkspaceOwner,
  }
}

export async function updateWorkflowRunCounts(workflowId: string, runs = 1) {
  try {
    const workflow = await getWorkflowById(workflowId)
    if (!workflow) {
      logger.error(`Workflow ${workflowId} not found`)
      throw new Error(`Workflow ${workflowId} not found`)
    }

    // Use the API to update stats
    const response = await fetch(`${getBaseUrl()}/api/workflows/${workflowId}/stats?runs=${runs}`, {
      method: 'POST',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update workflow stats')
    }

    return response.json()
  } catch (error) {
    logger.error(`Error updating workflow stats for ${workflowId}`, error)
    throw error
  }
}

/**
 * Sanitize tools array by removing UI-only fields
 * @param tools - The tools array to sanitize
 * @returns A sanitized tools array
 */
function sanitizeToolsForComparison(tools: any[] | undefined): any[] {
  if (!Array.isArray(tools)) {
    return []
  }

  return tools.map((tool) => {
    // Remove UI-only field: isExpanded
    const { isExpanded, ...cleanTool } = tool
    return cleanTool
  })
}

/**
 * Sanitize inputFormat array by removing test-only value fields
 * @param inputFormat - The inputFormat array to sanitize
 * @returns A sanitized inputFormat array without test values
 */
function sanitizeInputFormatForComparison(inputFormat: any[] | undefined): any[] {
  if (!Array.isArray(inputFormat)) {
    return []
  }

  return inputFormat.map((field) => {
    // Remove test-only field: value (used only for manual testing)
    const { value, collapsed, ...cleanField } = field
    return cleanField
  })
}

/**
 * Normalize a value for consistent comparison by sorting object keys
 * @param value - The value to normalize
 * @returns A normalized version of the value
 */
function normalizeValue(value: any): any {
  // If not an object or array, return as is
  if (value === null || value === undefined || typeof value !== 'object') {
    return value
  }

  // Handle arrays by normalizing each element
  if (Array.isArray(value)) {
    return value.map(normalizeValue)
  }

  // For objects, sort keys and normalize each value
  const sortedObj: Record<string, any> = {}

  // Get all keys and sort them
  const sortedKeys = Object.keys(value).sort()

  // Reconstruct object with sorted keys and normalized values
  for (const key of sortedKeys) {
    sortedObj[key] = normalizeValue(value[key])
  }

  return sortedObj
}

/**
 * Generate a normalized JSON string for comparison
 * @param value - The value to normalize and stringify
 * @returns A normalized JSON string
 */
function normalizedStringify(value: any): string {
  return JSON.stringify(normalizeValue(value))
}

/**
 * Compare the current workflow state with the deployed state to detect meaningful changes
 * @param currentState - The current workflow state
 * @param deployedState - The deployed workflow state
 * @returns True if there are meaningful changes, false if only position changes or no changes
 */
export function hasWorkflowChanged(
  currentState: WorkflowState,
  deployedState: WorkflowState | null
): boolean {
  // If no deployed state exists, then the workflow has changed
  if (!deployedState) return true

  // 1. Compare edges (connections between blocks)
  // First check length
  const currentEdges = currentState.edges || []
  const deployedEdges = deployedState.edges || []

  // Create sorted, normalized representations of the edges for more reliable comparison
  const normalizedCurrentEdges = currentEdges
    .map((edge) => ({
      source: edge.source,
      sourceHandle: edge.sourceHandle,
      target: edge.target,
      targetHandle: edge.targetHandle,
    }))
    .sort((a, b) =>
      `${a.source}-${a.sourceHandle}-${a.target}-${a.targetHandle}`.localeCompare(
        `${b.source}-${b.sourceHandle}-${b.target}-${b.targetHandle}`
      )
    )

  const normalizedDeployedEdges = deployedEdges
    .map((edge) => ({
      source: edge.source,
      sourceHandle: edge.sourceHandle,
      target: edge.target,
      targetHandle: edge.targetHandle,
    }))
    .sort((a, b) =>
      `${a.source}-${a.sourceHandle}-${a.target}-${a.targetHandle}`.localeCompare(
        `${b.source}-${b.sourceHandle}-${b.target}-${b.targetHandle}`
      )
    )

  // Compare the normalized edge arrays
  if (
    normalizedStringify(normalizedCurrentEdges) !== normalizedStringify(normalizedDeployedEdges)
  ) {
    return true
  }

  // 2. Compare blocks and their configurations
  const currentBlockIds = Object.keys(currentState.blocks || {}).sort()
  const deployedBlockIds = Object.keys(deployedState.blocks || {}).sort()

  // Check if the block IDs are different
  if (
    currentBlockIds.length !== deployedBlockIds.length ||
    normalizedStringify(currentBlockIds) !== normalizedStringify(deployedBlockIds)
  ) {
    return true
  }

  // 3. Build normalized representations of blocks for comparison
  const normalizedCurrentBlocks: Record<string, any> = {}
  const normalizedDeployedBlocks: Record<string, any> = {}

  for (const blockId of currentBlockIds) {
    const currentBlock = currentState.blocks[blockId]
    const deployedBlock = deployedState.blocks[blockId]

    // Destructure and exclude non-functional fields:
    // - position: visual positioning only
    // - subBlocks: handled separately below
    // - layout: contains measuredWidth/measuredHeight from autolayout
    // - height: block height measurement from autolayout
    const {
      position: _currentPos,
      subBlocks: currentSubBlocks = {},
      layout: _currentLayout,
      height: _currentHeight,
      ...currentRest
    } = currentBlock

    const {
      position: _deployedPos,
      subBlocks: deployedSubBlocks = {},
      layout: _deployedLayout,
      height: _deployedHeight,
      ...deployedRest
    } = deployedBlock

    // Also exclude width/height from data object (container dimensions from autolayout)
    const {
      width: _currentDataWidth,
      height: _currentDataHeight,
      ...currentDataRest
    } = currentRest.data || {}
    const {
      width: _deployedDataWidth,
      height: _deployedDataHeight,
      ...deployedDataRest
    } = deployedRest.data || {}

    normalizedCurrentBlocks[blockId] = {
      ...currentRest,
      data: currentDataRest,
      subBlocks: undefined,
    }

    normalizedDeployedBlocks[blockId] = {
      ...deployedRest,
      data: deployedDataRest,
      subBlocks: undefined,
    }

    // Get all subBlock IDs from both states
    const allSubBlockIds = [
      ...new Set([...Object.keys(currentSubBlocks), ...Object.keys(deployedSubBlocks)]),
    ].sort()

    // Check if any subBlocks are missing in either state
    if (Object.keys(currentSubBlocks).length !== Object.keys(deployedSubBlocks).length) {
      return true
    }

    // Normalize and compare each subBlock
    for (const subBlockId of allSubBlockIds) {
      // If the subBlock doesn't exist in either state, there's a difference
      if (!currentSubBlocks[subBlockId] || !deployedSubBlocks[subBlockId]) {
        return true
      }

      // Get values with special handling for null/undefined
      let currentValue = currentSubBlocks[subBlockId].value ?? null
      let deployedValue = deployedSubBlocks[subBlockId].value ?? null

      // Special handling for 'tools' subBlock - sanitize UI-only fields
      if (subBlockId === 'tools' && Array.isArray(currentValue) && Array.isArray(deployedValue)) {
        currentValue = sanitizeToolsForComparison(currentValue)
        deployedValue = sanitizeToolsForComparison(deployedValue)
      }

      // Special handling for 'inputFormat' subBlock - sanitize UI-only fields (collapsed state)
      if (
        subBlockId === 'inputFormat' &&
        Array.isArray(currentValue) &&
        Array.isArray(deployedValue)
      ) {
        currentValue = sanitizeInputFormatForComparison(currentValue)
        deployedValue = sanitizeInputFormatForComparison(deployedValue)
      }

      // For string values, compare directly to catch even small text changes
      if (typeof currentValue === 'string' && typeof deployedValue === 'string') {
        if (currentValue !== deployedValue) {
          return true
        }
      } else {
        // For other types, use normalized comparison
        const normalizedCurrentValue = normalizeValue(currentValue)
        const normalizedDeployedValue = normalizeValue(deployedValue)

        if (
          normalizedStringify(normalizedCurrentValue) !==
          normalizedStringify(normalizedDeployedValue)
        ) {
          return true
        }
      }

      // Compare type and other properties
      const currentSubBlockWithoutValue = { ...currentSubBlocks[subBlockId], value: undefined }
      const deployedSubBlockWithoutValue = { ...deployedSubBlocks[subBlockId], value: undefined }

      if (
        normalizedStringify(currentSubBlockWithoutValue) !==
        normalizedStringify(deployedSubBlockWithoutValue)
      ) {
        return true
      }
    }

    // Skip the normalization of subBlocks since we've already done detailed comparison above
    const blocksEqual =
      normalizedStringify(normalizedCurrentBlocks[blockId]) ===
      normalizedStringify(normalizedDeployedBlocks[blockId])

    // We've already compared subBlocks in detail
    if (!blocksEqual) {
      return true
    }
  }

  // 4. Compare loops
  const currentLoops = currentState.loops || {}
  const deployedLoops = deployedState.loops || {}

  const currentLoopIds = Object.keys(currentLoops).sort()
  const deployedLoopIds = Object.keys(deployedLoops).sort()

  if (
    currentLoopIds.length !== deployedLoopIds.length ||
    normalizedStringify(currentLoopIds) !== normalizedStringify(deployedLoopIds)
  ) {
    return true
  }

  // Compare each loop with normalized values
  for (const loopId of currentLoopIds) {
    const normalizedCurrentLoop = normalizeValue(currentLoops[loopId])
    const normalizedDeployedLoop = normalizeValue(deployedLoops[loopId])

    if (
      normalizedStringify(normalizedCurrentLoop) !== normalizedStringify(normalizedDeployedLoop)
    ) {
      return true
    }
  }

  // 5. Compare parallels
  const currentParallels = currentState.parallels || {}
  const deployedParallels = deployedState.parallels || {}

  const currentParallelIds = Object.keys(currentParallels).sort()
  const deployedParallelIds = Object.keys(deployedParallels).sort()

  if (
    currentParallelIds.length !== deployedParallelIds.length ||
    normalizedStringify(currentParallelIds) !== normalizedStringify(deployedParallelIds)
  ) {
    return true
  }

  // Compare each parallel with normalized values
  for (const parallelId of currentParallelIds) {
    const normalizedCurrentParallel = normalizeValue(currentParallels[parallelId])
    const normalizedDeployedParallel = normalizeValue(deployedParallels[parallelId])

    if (
      normalizedStringify(normalizedCurrentParallel) !==
      normalizedStringify(normalizedDeployedParallel)
    ) {
      return true
    }
  }

  return false
}

export function stripCustomToolPrefix(name: string) {
  return name.startsWith('custom_') ? name.replace('custom_', '') : name
}

export const workflowHasResponseBlock = (executionResult: ExecutionResult): boolean => {
  if (
    !executionResult?.logs ||
    !Array.isArray(executionResult.logs) ||
    !executionResult.success ||
    !executionResult.output.response
  ) {
    return false
  }

  const responseBlock = executionResult.logs.find(
    (log) => log?.blockType === 'response' && log?.success
  )

  return responseBlock !== undefined
}

// Create a HTTP response from response block
export const createHttpResponseFromBlock = (executionResult: ExecutionResult): NextResponse => {
  const output = executionResult.output.response
  const { data = {}, status = 200, headers = {} } = output

  const responseHeaders = new Headers({
    'Content-Type': 'application/json',
    ...headers,
  })

  return NextResponse.json(data, {
    status: status,
    headers: responseHeaders,
  })
}

/**
 * Validates that the current user has permission to access/modify a workflow
 * Returns session and workflow info if authorized, or error response if not
 */
export async function validateWorkflowPermissions(
  workflowId: string,
  requestId: string,
  action: 'read' | 'write' | 'admin' = 'read'
) {
  const session = await getSession()
  if (!session?.user?.id) {
    logger.warn(`[${requestId}] No authenticated user session for workflow ${action}`)
    return {
      error: { message: 'Unauthorized', status: 401 },
      session: null,
      workflow: null,
    }
  }

  const accessContext = await getWorkflowAccessContext(workflowId, session.user.id)
  if (!accessContext) {
    logger.warn(`[${requestId}] Workflow ${workflowId} not found`)
    return {
      error: { message: 'Workflow not found', status: 404 },
      session: null,
      workflow: null,
    }
  }

  const { workflow, workspacePermission, isOwner } = accessContext

  if (isOwner) {
    return {
      error: null,
      session,
      workflow,
    }
  }

  if (workflow.workspaceId) {
    let hasPermission = false

    if (action === 'read') {
      // Any workspace permission allows read
      hasPermission = workspacePermission !== null
    } else if (action === 'write') {
      // Write or admin permission allows write
      hasPermission = workspacePermission === 'write' || workspacePermission === 'admin'
    } else if (action === 'admin') {
      // Only admin permission allows admin actions
      hasPermission = workspacePermission === 'admin'
    }

    if (!hasPermission) {
      logger.warn(
        `[${requestId}] User ${session.user.id} unauthorized to ${action} workflow ${workflowId} in workspace ${workflow.workspaceId}`
      )
      return {
        error: { message: `Unauthorized: Access denied to ${action} this workflow`, status: 403 },
        session: null,
        workflow: null,
      }
    }
  } else {
    logger.warn(
      `[${requestId}] User ${session.user.id} unauthorized to ${action} workflow ${workflowId} owned by ${workflow.userId}`
    )
    return {
      error: { message: `Unauthorized: Access denied to ${action} this workflow`, status: 403 },
      session: null,
      workflow: null,
    }
  }

  return {
    error: null,
    session,
    workflow,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/lib/workflows/autolayout/constants.ts

```typescript
/**
 * Autolayout Constants
 *
 * Layout algorithm specific constants for spacing, padding, and overlap detection.
 * Block dimensions are imported from the shared source: @/lib/workflows/blocks/block-dimensions
 */

// Re-export block dimensions for autolayout consumers
export { BLOCK_DIMENSIONS, CONTAINER_DIMENSIONS } from '@/lib/workflows/blocks/block-dimensions'

/**
 * Horizontal spacing between layers (columns)
 */
export const DEFAULT_HORIZONTAL_SPACING = 250

/**
 * Vertical spacing between blocks in the same layer
 */
export const DEFAULT_VERTICAL_SPACING = 200

/**
 * General container padding for layout calculations
 */
export const CONTAINER_PADDING = 150

/**
 * Container horizontal padding (X offset for children in layout coordinates)
 */
export const CONTAINER_PADDING_X = 180

/**
 * Container vertical padding (Y offset for children in layout coordinates)
 */
export const CONTAINER_PADDING_Y = 100

/**
 * Root level horizontal padding
 */
export const ROOT_PADDING_X = 150

/**
 * Root level vertical padding
 */
export const ROOT_PADDING_Y = 150

/**
 * Default padding for layout positioning
 */
export const DEFAULT_LAYOUT_PADDING = { x: 150, y: 150 }

/**
 * Margin for overlap detection
 */
export const OVERLAP_MARGIN = 30

/**
 * Maximum iterations for overlap resolution
 */
export const MAX_OVERLAP_ITERATIONS = 20

/**
 * Block types excluded from autolayout
 */
export const AUTO_LAYOUT_EXCLUDED_TYPES = new Set(['note'])

/**
 * Container block types that can have children
 */
export const CONTAINER_BLOCK_TYPES = new Set(['loop', 'parallel'])

/**
 * Default layout options
 */
export const DEFAULT_LAYOUT_OPTIONS = {
  horizontalSpacing: DEFAULT_HORIZONTAL_SPACING,
  verticalSpacing: DEFAULT_VERTICAL_SPACING,
  padding: DEFAULT_LAYOUT_PADDING,
}

/**
 * Default horizontal spacing for containers (tighter than root level)
 */
export const DEFAULT_CONTAINER_HORIZONTAL_SPACING = 250

/**
 * Container-specific layout options (tighter spacing for nested layouts)
 */
export const CONTAINER_LAYOUT_OPTIONS = {
  horizontalSpacing: DEFAULT_CONTAINER_HORIZONTAL_SPACING,
  verticalSpacing: DEFAULT_VERTICAL_SPACING,
  padding: { x: CONTAINER_PADDING_X, y: CONTAINER_PADDING_Y },
}
```

--------------------------------------------------------------------------------

---[FILE: containers.ts]---
Location: sim-main/apps/sim/lib/workflows/autolayout/containers.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import {
  CONTAINER_PADDING_X,
  CONTAINER_PADDING_Y,
  DEFAULT_VERTICAL_SPACING,
} from '@/lib/workflows/autolayout/constants'
import { layoutBlocksCore } from '@/lib/workflows/autolayout/core'
import type { Edge, LayoutOptions } from '@/lib/workflows/autolayout/types'
import { filterLayoutEligibleBlockIds, getBlocksByParent } from '@/lib/workflows/autolayout/utils'
import { CONTAINER_DIMENSIONS } from '@/lib/workflows/blocks/block-dimensions'
import type { BlockState } from '@/stores/workflows/workflow/types'

const logger = createLogger('AutoLayout:Containers')

/**
 * Default horizontal spacing for containers (tighter than root level)
 */
const DEFAULT_CONTAINER_HORIZONTAL_SPACING = 400

/**
 * Lays out children within container blocks (loops and parallels).
 * Updates both child positions and container dimensions.
 */
export function layoutContainers(
  blocks: Record<string, BlockState>,
  edges: Edge[],
  options: LayoutOptions = {}
): void {
  const { children } = getBlocksByParent(blocks)

  const containerOptions: LayoutOptions = {
    horizontalSpacing: options.horizontalSpacing
      ? options.horizontalSpacing * 0.85
      : DEFAULT_CONTAINER_HORIZONTAL_SPACING,
    verticalSpacing: options.verticalSpacing ?? DEFAULT_VERTICAL_SPACING,
    padding: { x: CONTAINER_PADDING_X, y: CONTAINER_PADDING_Y },
  }

  for (const [parentId, childIds] of children.entries()) {
    const parentBlock = blocks[parentId]
    if (!parentBlock) continue

    logger.debug('Processing container', { parentId, childCount: childIds.length })

    const layoutChildIds = filterLayoutEligibleBlockIds(childIds, blocks)
    const childBlocks: Record<string, BlockState> = {}
    for (const childId of layoutChildIds) {
      childBlocks[childId] = blocks[childId]
    }

    const childEdges = edges.filter(
      (edge) => layoutChildIds.includes(edge.source) && layoutChildIds.includes(edge.target)
    )

    if (Object.keys(childBlocks).length === 0) {
      continue
    }

    // Use the shared core layout function with container options
    const { nodes, dimensions } = layoutBlocksCore(childBlocks, childEdges, {
      isContainer: true,
      layoutOptions: containerOptions,
    })

    // Apply positions back to blocks
    for (const node of nodes.values()) {
      blocks[node.id].position = node.position
    }

    // Update container dimensions
    const calculatedWidth = dimensions.width
    const calculatedHeight = dimensions.height

    const containerWidth = Math.max(calculatedWidth, CONTAINER_DIMENSIONS.DEFAULT_WIDTH)
    const containerHeight = Math.max(calculatedHeight, CONTAINER_DIMENSIONS.DEFAULT_HEIGHT)

    if (!parentBlock.data) {
      parentBlock.data = {}
    }

    parentBlock.data.width = containerWidth
    parentBlock.data.height = containerHeight

    logger.debug('Container dimensions calculated', {
      parentId,
      width: containerWidth,
      height: containerHeight,
      childCount: childIds.length,
    })
  }
}
```

--------------------------------------------------------------------------------

````
