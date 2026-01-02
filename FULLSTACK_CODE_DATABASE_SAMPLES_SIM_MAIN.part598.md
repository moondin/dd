---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 598
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 598 of 933)

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

---[FILE: deployment-utils.ts]---
Location: sim-main/apps/sim/lib/workflows/operations/deployment-utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { resolveStartCandidates, StartBlockPath } from '@/lib/workflows/triggers/triggers'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

const logger = createLogger('DeploymentUtils')

/**
 * Gets the input format example for a workflow's API deployment
 * Returns the -d flag with example data if inputs exist, empty string otherwise
 *
 * @param includeStreaming - Whether to include streaming parameters in the example
 * @param selectedStreamingOutputs - Array of output IDs to stream
 * @returns A string containing the curl -d flag with example data, or empty string if no inputs
 */
export function getInputFormatExample(
  includeStreaming = false,
  selectedStreamingOutputs: string[] = []
): string {
  let inputFormatExample = ''
  try {
    const blocks = Object.values(useWorkflowStore.getState().blocks)
    const candidates = resolveStartCandidates(useWorkflowStore.getState().blocks, {
      execution: 'api',
    })

    const targetCandidate =
      candidates.find((candidate) => candidate.path === StartBlockPath.UNIFIED) ||
      candidates.find((candidate) => candidate.path === StartBlockPath.SPLIT_API) ||
      candidates.find((candidate) => candidate.path === StartBlockPath.SPLIT_INPUT) ||
      candidates.find((candidate) => candidate.path === StartBlockPath.LEGACY_STARTER)

    const targetBlock = targetCandidate?.block

    if (targetBlock) {
      const inputFormat = useSubBlockStore.getState().getValue(targetBlock.id, 'inputFormat')

      const exampleData: Record<string, any> = {}

      if (inputFormat && Array.isArray(inputFormat) && inputFormat.length > 0) {
        inputFormat.forEach((field: any) => {
          if (field.name) {
            switch (field.type) {
              case 'string':
                exampleData[field.name] = 'example'
                break
              case 'number':
                exampleData[field.name] = 42
                break
              case 'boolean':
                exampleData[field.name] = true
                break
              case 'object':
                exampleData[field.name] = { key: 'value' }
                break
              case 'array':
                exampleData[field.name] = [1, 2, 3]
                break
              case 'files':
                exampleData[field.name] = [
                  {
                    data: 'data:application/pdf;base64,...',
                    type: 'file',
                    name: 'document.pdf',
                    mime: 'application/pdf',
                  },
                ]
                break
            }
          }
        })
      }

      // Add streaming parameters if enabled and outputs are selected
      if (includeStreaming && selectedStreamingOutputs.length > 0) {
        exampleData.stream = true
        // Convert blockId_attribute format to blockName.attribute format for display
        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

        const convertedOutputs = selectedStreamingOutputs
          .map((outputId) => {
            // If it starts with a UUID, convert to blockName.attribute format
            if (UUID_REGEX.test(outputId)) {
              const underscoreIndex = outputId.indexOf('_')
              if (underscoreIndex === -1) return null

              const blockId = outputId.substring(0, underscoreIndex)
              const attribute = outputId.substring(underscoreIndex + 1)

              // Find the block by ID and get its name
              const block = blocks.find((b) => b.id === blockId)
              if (block?.name) {
                // Normalize block name: lowercase and remove spaces
                const normalizedBlockName = block.name.toLowerCase().replace(/\s+/g, '')
                return `${normalizedBlockName}.${attribute}`
              }
              // Block not found (deleted), return null to filter out
              return null
            }

            // Already in blockName.attribute format, verify the block exists
            const parts = outputId.split('.')
            if (parts.length >= 2) {
              const blockName = parts[0]
              // Check if a block with this name exists
              const block = blocks.find(
                (b) => b.name?.toLowerCase().replace(/\s+/g, '') === blockName.toLowerCase()
              )
              if (!block) {
                // Block not found (deleted), return null to filter out
                return null
              }
            }

            return outputId
          })
          .filter((output): output is string => output !== null)

        exampleData.selectedOutputs = convertedOutputs
      }

      if (Object.keys(exampleData).length > 0) {
        inputFormatExample = ` -d '${JSON.stringify(exampleData)}'`
      }
    }
  } catch (error) {
    logger.warn('Error generating input format example:', error)
  }

  return inputFormatExample
}
```

--------------------------------------------------------------------------------

---[FILE: import-export.ts]---
Location: sim-main/apps/sim/lib/workflows/operations/import-export.ts

```typescript
import JSZip from 'jszip'
import { createLogger } from '@/lib/logs/console/logger'
import { sanitizeForExport } from '@/lib/workflows/sanitization/json-sanitizer'
import type { WorkflowState } from '@/stores/workflows/workflow/types'

const logger = createLogger('WorkflowImportExport')

export interface WorkflowExportData {
  workflow: {
    id: string
    name: string
    description?: string
    color?: string
    folderId?: string | null
  }
  state: WorkflowState
  variables?: Array<{
    id: string
    name: string
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'plain'
    value: any
  }>
}

export interface FolderExportData {
  id: string
  name: string
  parentId: string | null
}

export interface WorkspaceExportStructure {
  workspace: {
    name: string
    exportedAt: string
  }
  workflows: WorkflowExportData[]
  folders: FolderExportData[]
}

function sanitizePathSegment(name: string): string {
  return name.replace(/[^a-z0-9-_]/gi, '-')
}

function buildFolderPath(
  folderId: string | null | undefined,
  foldersMap: Map<string, FolderExportData>
): string {
  if (!folderId) return ''

  const path: string[] = []
  let currentId: string | null = folderId

  while (currentId && foldersMap.has(currentId)) {
    const folder: FolderExportData = foldersMap.get(currentId)!
    path.unshift(sanitizePathSegment(folder.name))
    currentId = folder.parentId
  }

  return path.join('/')
}

export async function exportWorkspaceToZip(
  workspaceName: string,
  workflows: WorkflowExportData[],
  folders: FolderExportData[]
): Promise<Blob> {
  const zip = new JSZip()
  const foldersMap = new Map(folders.map((f) => [f.id, f]))

  const metadata = {
    workspace: {
      name: workspaceName,
      exportedAt: new Date().toISOString(),
    },
    folders: folders.map((f) => ({ id: f.id, name: f.name, parentId: f.parentId })),
  }

  zip.file('_workspace.json', JSON.stringify(metadata, null, 2))

  for (const workflow of workflows) {
    try {
      const workflowState = {
        ...workflow.state,
        metadata: {
          name: workflow.workflow.name,
          description: workflow.workflow.description,
          color: workflow.workflow.color,
          exportedAt: new Date().toISOString(),
        },
        variables: workflow.variables,
      }

      const exportState = sanitizeForExport(workflowState)
      const sanitizedName = sanitizePathSegment(workflow.workflow.name)
      const filename = `${sanitizedName}-${workflow.workflow.id}.json`

      const folderPath = buildFolderPath(workflow.workflow.folderId, foldersMap)
      const fullPath = folderPath ? `${folderPath}/${filename}` : filename

      zip.file(fullPath, JSON.stringify(exportState, null, 2))
    } catch (error) {
      logger.error(`Failed to export workflow ${workflow.workflow.id}:`, error)
    }
  }

  return await zip.generateAsync({ type: 'blob' })
}

export interface ImportedWorkflow {
  content: string
  name: string
  folderPath: string[]
}

export interface WorkspaceImportMetadata {
  workspaceName: string
  exportedAt?: string
}

export async function extractWorkflowsFromZip(
  zipFile: File
): Promise<{ workflows: ImportedWorkflow[]; metadata?: WorkspaceImportMetadata }> {
  const zip = await JSZip.loadAsync(await zipFile.arrayBuffer())
  const workflows: ImportedWorkflow[] = []
  let metadata: WorkspaceImportMetadata | undefined

  for (const [path, file] of Object.entries(zip.files)) {
    if (file.dir) continue

    if (path === '_workspace.json') {
      try {
        const content = await file.async('string')
        const parsed = JSON.parse(content)
        metadata = {
          workspaceName: parsed.workspace?.name || 'Imported Workspace',
          exportedAt: parsed.workspace?.exportedAt,
        }
      } catch (error) {
        logger.error('Failed to parse workspace metadata:', error)
      }
      continue
    }

    if (!path.toLowerCase().endsWith('.json')) continue

    try {
      const content = await file.async('string')
      const pathParts = path.split('/').filter((p) => p.length > 0)
      const filename = pathParts.pop() || path

      workflows.push({
        content,
        name: filename,
        folderPath: pathParts,
      })
    } catch (error) {
      logger.error(`Failed to extract ${path}:`, error)
    }
  }

  return { workflows, metadata }
}

export async function extractWorkflowsFromFiles(files: File[]): Promise<ImportedWorkflow[]> {
  const workflows: ImportedWorkflow[] = []

  for (const file of files) {
    if (!file.name.toLowerCase().endsWith('.json')) continue

    try {
      const content = await file.text()
      workflows.push({
        content,
        name: file.name,
        folderPath: [],
      })
    } catch (error) {
      logger.error(`Failed to read ${file.name}:`, error)
    }
  }

  return workflows
}

export function extractWorkflowName(content: string, filename: string): string {
  try {
    const parsed = JSON.parse(content)

    if (parsed.state?.metadata?.name && typeof parsed.state.metadata.name === 'string') {
      return parsed.state.metadata.name.trim()
    }
  } catch {
    // JSON parse failed, fall through to filename
  }

  let name = filename.replace(/\.json$/i, '')

  name = name.replace(/-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, '')

  name = name
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  return name.trim() || 'Imported Workflow'
}
```

--------------------------------------------------------------------------------

---[FILE: socket-operations.ts]---
Location: sim-main/apps/sim/lib/workflows/operations/socket-operations.ts

```typescript
import { client } from '@/lib/auth/auth-client'
import { createLogger } from '@/lib/logs/console/logger'
import { useOperationQueueStore } from '@/stores/operation-queue/store'
import type { WorkflowState } from '@/stores/workflows/workflow/types'

const logger = createLogger('WorkflowSocketOperations')

async function resolveUserId(): Promise<string> {
  try {
    const sessionResult = await client.getSession()
    const userId = sessionResult.data?.user?.id
    if (userId) {
      return userId
    }
  } catch (error) {
    logger.warn('Failed to resolve session user id for workflow operation', { error })
  }

  return 'unknown'
}

interface EnqueueWorkflowOperationArgs {
  operation: string
  target: string
  payload: any
  workflowId: string
  immediate?: boolean
  operationId?: string
}

/**
 * Queues a workflow socket operation so it flows through the standard operation queue,
 * ensuring consistent retries, confirmations, and telemetry.
 */
export async function enqueueWorkflowOperation({
  operation,
  target,
  payload,
  workflowId,
  immediate = false,
  operationId,
}: EnqueueWorkflowOperationArgs): Promise<string> {
  const userId = await resolveUserId()
  const opId = operationId ?? crypto.randomUUID()

  useOperationQueueStore.getState().addToQueue({
    id: opId,
    operation: {
      operation,
      target,
      payload,
    },
    workflowId,
    userId,
    immediate,
  })

  logger.debug('Queued workflow operation', {
    workflowId,
    operation,
    target,
    operationId: opId,
    immediate,
  })

  return opId
}

interface EnqueueReplaceStateArgs {
  workflowId: string
  state: WorkflowState
  immediate?: boolean
  operationId?: string
}

/**
 * Convenience wrapper for broadcasting a full workflow state replacement via the queue.
 */
export async function enqueueReplaceWorkflowState({
  workflowId,
  state,
  immediate,
  operationId,
}: EnqueueReplaceStateArgs): Promise<string> {
  return enqueueWorkflowOperation({
    workflowId,
    operation: 'replace-state',
    target: 'workflow',
    payload: { state },
    immediate,
    operationId,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: custom-tools-persistence.ts]---
Location: sim-main/apps/sim/lib/workflows/persistence/custom-tools-persistence.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { upsertCustomTools } from '@/lib/workflows/custom-tools/operations'

const logger = createLogger('CustomToolsPersistence')

interface CustomTool {
  id?: string
  type: 'custom-tool'
  title: string
  toolId?: string
  schema: {
    function: {
      name?: string
      description: string
      parameters: Record<string, any>
    }
  }
  code: string
  usageControl?: string
}

/**
 * Stored tool format that may contain either reference or inline definition
 */
interface StoredCustomTool {
  type: string
  title?: string
  toolId?: string
  customToolId?: string
  schema?: any
  code?: string
  usageControl?: string
}

/**
 * Checks if a stored tool is a reference-only custom tool (no inline definition)
 */
function isCustomToolReference(tool: StoredCustomTool): boolean {
  return tool.type === 'custom-tool' && !!tool.customToolId && !tool.code
}

/**
 * Extract all custom tools from agent blocks in the workflow state
 *
 * @remarks
 * Only extracts tools with inline definitions (legacy format).
 * Reference-only tools (new format with customToolId) are skipped since they're already in the database.
 */
export function extractCustomToolsFromWorkflowState(workflowState: any): CustomTool[] {
  const customToolsMap = new Map<string, CustomTool>()

  if (!workflowState?.blocks) {
    return []
  }

  for (const [blockId, block] of Object.entries(workflowState.blocks)) {
    try {
      const blockData = block as any

      if (!blockData || blockData.type !== 'agent') {
        continue
      }

      const subBlocks = blockData.subBlocks || {}
      const toolsSubBlock = subBlocks.tools

      if (!toolsSubBlock?.value) {
        continue
      }

      let tools = toolsSubBlock.value

      if (typeof tools === 'string') {
        try {
          tools = JSON.parse(tools)
        } catch (error) {
          logger.warn(`Failed to parse tools in block ${blockId}`, { error })
          continue
        }
      }

      if (!Array.isArray(tools)) {
        continue
      }

      for (const tool of tools) {
        if (!tool || typeof tool !== 'object' || tool.type !== 'custom-tool') {
          continue
        }

        // Skip reference-only tools - they're already in the database
        if (isCustomToolReference(tool)) {
          logger.debug(`Skipping reference-only custom tool: ${tool.title || tool.customToolId}`)
          continue
        }

        // Only persist tools with inline definitions (legacy format)
        if (tool.title && tool.schema?.function && tool.code) {
          const toolKey = tool.toolId || tool.title

          if (!customToolsMap.has(toolKey)) {
            customToolsMap.set(toolKey, tool as CustomTool)
          }
        }
      }
    } catch (error) {
      logger.error(`Error extracting custom tools from block ${blockId}`, { error })
    }
  }

  return Array.from(customToolsMap.values())
}

/**
 * Persist custom tools to the database using the upsert function
 * Creates new tools or updates existing ones
 */
export async function persistCustomToolsToDatabase(
  customToolsList: CustomTool[],
  workspaceId: string | null,
  userId: string
): Promise<{ saved: number; errors: string[] }> {
  if (!customToolsList || customToolsList.length === 0) {
    return { saved: 0, errors: [] }
  }

  if (!workspaceId) {
    logger.debug('Skipping custom tools persistence - no workspaceId provided (user-scoped tools)')
    return { saved: 0, errors: [] }
  }

  const errors: string[] = []
  let saved = 0

  const validTools = customToolsList.filter((tool) => {
    if (!tool.schema?.function?.name) {
      logger.warn(`Skipping custom tool without function name: ${tool.title}`)
      return false
    }
    return true
  })

  if (validTools.length === 0) {
    return { saved: 0, errors: [] }
  }

  try {
    await upsertCustomTools({
      tools: validTools.map((tool) => ({
        id: tool.toolId,
        title: tool.title,
        schema: tool.schema,
        code: tool.code,
      })),
      workspaceId,
      userId,
    })

    saved = validTools.length
    logger.info(`Persisted ${saved} custom tool(s)`, { workspaceId })
  } catch (error) {
    const errorMsg = `Failed to persist custom tools: ${error instanceof Error ? error.message : String(error)}`
    logger.error(errorMsg, { error })
    errors.push(errorMsg)
  }

  return { saved, errors }
}

/**
 * Extract and persist custom tools from workflow state
 */
export async function extractAndPersistCustomTools(
  workflowState: any,
  workspaceId: string | null,
  userId: string
): Promise<{ saved: number; errors: string[] }> {
  const customToolsList = extractCustomToolsFromWorkflowState(workflowState)

  if (customToolsList.length === 0) {
    logger.debug('No custom tools found in workflow state')
    return { saved: 0, errors: [] }
  }

  logger.info(`Found ${customToolsList.length} custom tool(s) to persist`, {
    tools: customToolsList.map((t) => t.title),
    workspaceId,
  })

  return await persistCustomToolsToDatabase(customToolsList, workspaceId, userId)
}
```

--------------------------------------------------------------------------------

---[FILE: duplicate.ts]---
Location: sim-main/apps/sim/lib/workflows/persistence/duplicate.ts

```typescript
import { db } from '@sim/db'
import { workflow, workflowBlocks, workflowEdges, workflowSubflows } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'
import type { Variable } from '@/stores/panel/variables/types'
import type { LoopConfig, ParallelConfig } from '@/stores/workflows/workflow/types'

const logger = createLogger('WorkflowDuplicateHelper')

interface DuplicateWorkflowOptions {
  sourceWorkflowId: string
  userId: string
  name: string
  description?: string
  color?: string
  workspaceId?: string
  folderId?: string | null
  requestId?: string
}

interface DuplicateWorkflowResult {
  id: string
  name: string
  description: string | null
  color: string
  workspaceId: string
  folderId: string | null
  blocksCount: number
  edgesCount: number
  subflowsCount: number
}

/**
 * Duplicate a workflow with all its blocks, edges, and subflows
 * This is a shared helper used by both the workflow duplicate API and folder duplicate API
 */
export async function duplicateWorkflow(
  options: DuplicateWorkflowOptions
): Promise<DuplicateWorkflowResult> {
  const {
    sourceWorkflowId,
    userId,
    name,
    description,
    color,
    workspaceId,
    folderId,
    requestId = 'unknown',
  } = options

  // Generate new workflow ID
  const newWorkflowId = crypto.randomUUID()
  const now = new Date()

  // Duplicate workflow and all related data in a transaction
  const result = await db.transaction(async (tx) => {
    // First verify the source workflow exists
    const sourceWorkflowRow = await tx
      .select()
      .from(workflow)
      .where(eq(workflow.id, sourceWorkflowId))
      .limit(1)

    if (sourceWorkflowRow.length === 0) {
      throw new Error('Source workflow not found')
    }

    const source = sourceWorkflowRow[0]

    // Check if user has permission to access the source workflow
    let canAccessSource = false

    // Case 1: User owns the workflow
    if (source.userId === userId) {
      canAccessSource = true
    }

    // Case 2: User has admin or write permission in the source workspace
    if (!canAccessSource && source.workspaceId) {
      const userPermission = await getUserEntityPermissions(userId, 'workspace', source.workspaceId)
      if (userPermission === 'admin' || userPermission === 'write') {
        canAccessSource = true
      }
    }

    if (!canAccessSource) {
      throw new Error('Source workflow not found or access denied')
    }

    // Create the new workflow first (required for foreign key constraints)
    await tx.insert(workflow).values({
      id: newWorkflowId,
      userId,
      workspaceId: workspaceId || source.workspaceId,
      folderId: folderId !== undefined ? folderId : source.folderId,
      name,
      description: description || source.description,
      color: color || source.color,
      lastSynced: now,
      createdAt: now,
      updatedAt: now,
      isDeployed: false,
      runCount: 0,
      // Duplicate variables with new IDs and new workflowId
      variables: (() => {
        const sourceVars = (source.variables as Record<string, Variable>) || {}
        const remapped: Record<string, Variable> = {}
        for (const [, variable] of Object.entries(sourceVars) as [string, Variable][]) {
          const newVarId = crypto.randomUUID()
          remapped[newVarId] = {
            ...variable,
            id: newVarId,
            workflowId: newWorkflowId,
          }
        }
        return remapped
      })(),
    })

    // Copy all blocks from source workflow with new IDs
    const sourceBlocks = await tx
      .select()
      .from(workflowBlocks)
      .where(eq(workflowBlocks.workflowId, sourceWorkflowId))

    // Create a mapping from old block IDs to new block IDs
    const blockIdMapping = new Map<string, string>()

    if (sourceBlocks.length > 0) {
      // First pass: Create all block ID mappings
      sourceBlocks.forEach((block) => {
        const newBlockId = crypto.randomUUID()
        blockIdMapping.set(block.id, newBlockId)
      })

      // Second pass: Create blocks with updated parent relationships
      const newBlocks = sourceBlocks.map((block) => {
        const newBlockId = blockIdMapping.get(block.id)!

        // Update parent ID to point to the new parent block ID if it exists
        const blockData =
          block.data && typeof block.data === 'object' && !Array.isArray(block.data)
            ? (block.data as any)
            : {}
        let newParentId = blockData.parentId
        if (blockData.parentId && blockIdMapping.has(blockData.parentId)) {
          newParentId = blockIdMapping.get(blockData.parentId)!
        }

        // Update data.parentId and extent if they exist in the data object
        let updatedData = block.data
        let newExtent = blockData.extent
        if (block.data && typeof block.data === 'object' && !Array.isArray(block.data)) {
          const dataObj = block.data as any
          if (dataObj.parentId && typeof dataObj.parentId === 'string') {
            updatedData = { ...dataObj }
            if (blockIdMapping.has(dataObj.parentId)) {
              ;(updatedData as any).parentId = blockIdMapping.get(dataObj.parentId)!
              // Ensure extent is set to 'parent' for child blocks
              ;(updatedData as any).extent = 'parent'
              newExtent = 'parent'
            }
          }
        }

        return {
          ...block,
          id: newBlockId,
          workflowId: newWorkflowId,
          parentId: newParentId,
          extent: newExtent,
          data: updatedData,
          createdAt: now,
          updatedAt: now,
        }
      })

      await tx.insert(workflowBlocks).values(newBlocks)
      logger.info(
        `[${requestId}] Copied ${sourceBlocks.length} blocks with updated parent relationships`
      )
    }

    // Copy all edges from source workflow with updated block references
    const sourceEdges = await tx
      .select()
      .from(workflowEdges)
      .where(eq(workflowEdges.workflowId, sourceWorkflowId))

    if (sourceEdges.length > 0) {
      const newEdges = sourceEdges.map((edge) => ({
        ...edge,
        id: crypto.randomUUID(), // Generate new edge ID
        workflowId: newWorkflowId,
        sourceBlockId: blockIdMapping.get(edge.sourceBlockId) || edge.sourceBlockId,
        targetBlockId: blockIdMapping.get(edge.targetBlockId) || edge.targetBlockId,
        createdAt: now,
        updatedAt: now,
      }))

      await tx.insert(workflowEdges).values(newEdges)
      logger.info(`[${requestId}] Copied ${sourceEdges.length} edges with updated block references`)
    }

    // Copy all subflows from source workflow with new IDs and updated block references
    const sourceSubflows = await tx
      .select()
      .from(workflowSubflows)
      .where(eq(workflowSubflows.workflowId, sourceWorkflowId))

    if (sourceSubflows.length > 0) {
      const newSubflows = sourceSubflows
        .map((subflow) => {
          // The subflow ID should match the corresponding block ID
          const newSubflowId = blockIdMapping.get(subflow.id)

          if (!newSubflowId) {
            logger.warn(
              `[${requestId}] Subflow ${subflow.id} (${subflow.type}) has no corresponding block, skipping`
            )
            return null
          }

          logger.info(`[${requestId}] Mapping subflow ${subflow.id} → ${newSubflowId}`, {
            subflowType: subflow.type,
          })

          // Update block references in subflow config
          let updatedConfig: LoopConfig | ParallelConfig = subflow.config as
            | LoopConfig
            | ParallelConfig
          if (subflow.config && typeof subflow.config === 'object') {
            updatedConfig = JSON.parse(JSON.stringify(subflow.config)) as
              | LoopConfig
              | ParallelConfig

            // Update the config ID to match the new subflow ID

            ;(updatedConfig as any).id = newSubflowId

            // Update node references in config if they exist
            if ('nodes' in updatedConfig && Array.isArray(updatedConfig.nodes)) {
              updatedConfig.nodes = updatedConfig.nodes.map(
                (nodeId: string) => blockIdMapping.get(nodeId) || nodeId
              )
            }
          }

          return {
            ...subflow,
            id: newSubflowId, // Use the same ID as the corresponding block
            workflowId: newWorkflowId,
            config: updatedConfig,
            createdAt: now,
            updatedAt: now,
          }
        })
        .filter((subflow): subflow is NonNullable<typeof subflow> => subflow !== null)

      if (newSubflows.length > 0) {
        await tx.insert(workflowSubflows).values(newSubflows)
      }

      logger.info(
        `[${requestId}] Copied ${newSubflows.length}/${sourceSubflows.length} subflows with updated block references and matching IDs`
      )
    }

    // Update the workflow timestamp
    await tx
      .update(workflow)
      .set({
        updatedAt: now,
      })
      .where(eq(workflow.id, newWorkflowId))

    const finalWorkspaceId = workspaceId || source.workspaceId
    if (!finalWorkspaceId) {
      throw new Error('Workspace ID is required')
    }

    return {
      id: newWorkflowId,
      name,
      description: description || source.description,
      color: color || source.color,
      workspaceId: finalWorkspaceId,
      folderId: folderId !== undefined ? folderId : source.folderId,
      blocksCount: sourceBlocks.length,
      edgesCount: sourceEdges.length,
      subflowsCount: sourceSubflows.length,
    }
  })

  return result
}
```

--------------------------------------------------------------------------------

````
