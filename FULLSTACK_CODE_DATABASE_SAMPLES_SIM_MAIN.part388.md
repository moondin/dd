---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 388
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 388 of 933)

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

---[FILE: use-export-workspace.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/hooks/use-export-workspace.ts
Signals: React

```typescript
import { useCallback, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import {
  exportWorkspaceToZip,
  type WorkflowExportData,
} from '@/lib/workflows/operations/import-export'

const logger = createLogger('useExportWorkspace')

interface UseExportWorkspaceProps {
  /**
   * Optional callback after successful export
   */
  onSuccess?: () => void
}

/**
 * Hook for managing workspace export to ZIP.
 *
 * Handles:
 * - Fetching all workflows and folders from workspace
 * - Fetching workflow states and variables
 * - Creating ZIP file with all workspace data
 * - Downloading the ZIP file
 * - Loading state management
 * - Error handling and logging
 *
 * @param props - Hook configuration
 * @returns Export workspace handlers and state
 */
export function useExportWorkspace({ onSuccess }: UseExportWorkspaceProps = {}) {
  const [isExporting, setIsExporting] = useState(false)

  /**
   * Export workspace to ZIP file
   */
  const handleExportWorkspace = useCallback(
    async (workspaceId: string, workspaceName: string) => {
      if (isExporting) return

      setIsExporting(true)
      try {
        logger.info('Exporting workspace', { workspaceId })

        // Fetch all workflows in workspace
        const workflowsResponse = await fetch(`/api/workflows?workspaceId=${workspaceId}`)
        if (!workflowsResponse.ok) {
          throw new Error('Failed to fetch workflows')
        }
        const { data: workflows } = await workflowsResponse.json()

        // Fetch all folders in workspace
        const foldersResponse = await fetch(`/api/folders?workspaceId=${workspaceId}`)
        if (!foldersResponse.ok) {
          throw new Error('Failed to fetch folders')
        }
        const foldersData = await foldersResponse.json()

        // Export each workflow
        const workflowsToExport: WorkflowExportData[] = []

        for (const workflow of workflows) {
          try {
            const workflowResponse = await fetch(`/api/workflows/${workflow.id}`)
            if (!workflowResponse.ok) {
              logger.warn(`Failed to fetch workflow ${workflow.id}`)
              continue
            }

            const { data: workflowData } = await workflowResponse.json()
            if (!workflowData?.state) {
              logger.warn(`Workflow ${workflow.id} has no state`)
              continue
            }

            const variablesResponse = await fetch(`/api/workflows/${workflow.id}/variables`)
            let workflowVariables: any[] = []
            if (variablesResponse.ok) {
              const variablesData = await variablesResponse.json()
              workflowVariables = Object.values(variablesData?.data || {}).map((v: any) => ({
                id: v.id,
                name: v.name,
                type: v.type,
                value: v.value,
              }))
            }

            workflowsToExport.push({
              workflow: {
                id: workflow.id,
                name: workflow.name,
                description: workflow.description,
                color: workflow.color,
                folderId: workflow.folderId,
              },
              state: workflowData.state,
              variables: workflowVariables,
            })
          } catch (error) {
            logger.error(`Failed to export workflow ${workflow.id}:`, error)
          }
        }

        const foldersToExport: Array<{
          id: string
          name: string
          parentId: string | null
        }> = (foldersData.folders || []).map((folder: any) => ({
          id: folder.id,
          name: folder.name,
          parentId: folder.parentId,
        }))

        const zipBlob = await exportWorkspaceToZip(
          workspaceName,
          workflowsToExport,
          foldersToExport
        )

        const blobUrl = URL.createObjectURL(zipBlob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `${workspaceName.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(blobUrl)

        logger.info('Workspace exported successfully', {
          workspaceId,
          workflowsCount: workflowsToExport.length,
          foldersCount: foldersToExport.length,
        })

        onSuccess?.()
      } catch (error) {
        logger.error('Error exporting workspace:', error)
        throw error
      } finally {
        setIsExporting(false)
      }
    },
    [isExporting, onSuccess]
  )

  return {
    isExporting,
    handleExportWorkspace,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-import-workflow.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/hooks/use-import-workflow.ts
Signals: React, Next.js

```typescript
import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'
import {
  extractWorkflowName,
  extractWorkflowsFromFiles,
  extractWorkflowsFromZip,
} from '@/lib/workflows/operations/import-export'
import { folderKeys, useCreateFolder } from '@/hooks/queries/folders'
import { useCreateWorkflow, workflowKeys } from '@/hooks/queries/workflows'
import { useWorkflowDiffStore } from '@/stores/workflow-diff/store'
import { parseWorkflowJson } from '@/stores/workflows/json/importer'

const logger = createLogger('useImportWorkflow')

interface UseImportWorkflowProps {
  workspaceId: string
}

/**
 * Custom hook to handle workflow import functionality.
 * Supports importing from:
 * - Single JSON file
 * - Multiple JSON files
 * - ZIP file containing multiple workflows with folder structure
 *
 * @param props - Configuration object containing workspaceId
 * @returns Import state and handlers
 */
export function useImportWorkflow({ workspaceId }: UseImportWorkflowProps) {
  const router = useRouter()
  const createWorkflowMutation = useCreateWorkflow()
  const queryClient = useQueryClient()
  const createFolderMutation = useCreateFolder()
  const [isImporting, setIsImporting] = useState(false)

  /**
   * Import a single workflow
   */
  const importSingleWorkflow = useCallback(
    async (content: string, filename: string, folderId?: string) => {
      const { data: workflowData, errors: parseErrors } = parseWorkflowJson(content)

      if (!workflowData || parseErrors.length > 0) {
        logger.warn(`Failed to parse ${filename}:`, parseErrors)
        return null
      }

      const workflowName = extractWorkflowName(content, filename)
      useWorkflowDiffStore.getState().clearDiff()

      // Extract color from metadata
      const parsedContent = JSON.parse(content)
      const workflowColor =
        parsedContent.state?.metadata?.color || parsedContent.metadata?.color || '#3972F6'

      const result = await createWorkflowMutation.mutateAsync({
        name: workflowName,
        description: workflowData.metadata?.description || 'Imported from JSON',
        workspaceId,
        folderId: folderId || undefined,
      })
      const newWorkflowId = result.id

      // Update workflow color if we extracted one
      if (workflowColor !== '#3972F6') {
        await fetch(`/api/workflows/${newWorkflowId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ color: workflowColor }),
        })
      }

      // Save workflow state
      await fetch(`/api/workflows/${newWorkflowId}/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData),
      })

      // Save variables if any
      if (workflowData.variables && workflowData.variables.length > 0) {
        const variablesPayload = workflowData.variables.map((v: any) => ({
          id: typeof v.id === 'string' && v.id.trim() ? v.id : crypto.randomUUID(),
          workflowId: newWorkflowId,
          name: v.name,
          type: v.type,
          value: v.value,
        }))

        await fetch(`/api/workflows/${newWorkflowId}/variables`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variables: variablesPayload }),
        })
      }

      logger.info(`Imported workflow: ${workflowName}`)
      return newWorkflowId
    },
    [createWorkflowMutation, workspaceId]
  )

  /**
   * Handle file selection and read
   */
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files || files.length === 0) return

      setIsImporting(true)
      try {
        const fileArray = Array.from(files)
        const hasZip = fileArray.some((f) => f.name.toLowerCase().endsWith('.zip'))
        const jsonFiles = fileArray.filter((f) => f.name.toLowerCase().endsWith('.json'))

        const importedWorkflowIds: string[] = []

        if (hasZip && fileArray.length === 1) {
          // Import from ZIP - preserves folder structure
          const zipFile = fileArray[0]
          const { workflows: extractedWorkflows, metadata } = await extractWorkflowsFromZip(zipFile)

          const folderName = metadata?.workspaceName || zipFile.name.replace(/\.zip$/i, '')
          const importFolder = await createFolderMutation.mutateAsync({
            name: folderName,
            workspaceId,
          })
          const folderMap = new Map<string, string>()

          for (const workflow of extractedWorkflows) {
            try {
              let targetFolderId = importFolder.id

              // Recreate nested folder structure
              if (workflow.folderPath.length > 0) {
                const folderPathKey = workflow.folderPath.join('/')

                if (!folderMap.has(folderPathKey)) {
                  let parentId = importFolder.id

                  for (let i = 0; i < workflow.folderPath.length; i++) {
                    const pathSegment = workflow.folderPath.slice(0, i + 1).join('/')

                    if (!folderMap.has(pathSegment)) {
                      const subFolder = await createFolderMutation.mutateAsync({
                        name: workflow.folderPath[i],
                        workspaceId,
                        parentId,
                      })
                      folderMap.set(pathSegment, subFolder.id)
                      parentId = subFolder.id
                    } else {
                      parentId = folderMap.get(pathSegment)!
                    }
                  }
                }

                targetFolderId = folderMap.get(folderPathKey)!
              }

              const workflowId = await importSingleWorkflow(
                workflow.content,
                workflow.name,
                targetFolderId
              )
              if (workflowId) importedWorkflowIds.push(workflowId)
            } catch (error) {
              logger.error(`Failed to import ${workflow.name}:`, error)
            }
          }
        } else if (jsonFiles.length > 0) {
          // Import multiple JSON files or single JSON
          const extractedWorkflows = await extractWorkflowsFromFiles(jsonFiles)

          for (const workflow of extractedWorkflows) {
            try {
              const workflowId = await importSingleWorkflow(workflow.content, workflow.name)
              if (workflowId) importedWorkflowIds.push(workflowId)
            } catch (error) {
              logger.error(`Failed to import ${workflow.name}:`, error)
            }
          }
        }

        // Reload workflows and folders to show newly imported ones
        await queryClient.invalidateQueries({ queryKey: workflowKeys.list(workspaceId) })
        await queryClient.invalidateQueries({ queryKey: folderKeys.list(workspaceId) })

        logger.info(`Import complete. Imported ${importedWorkflowIds.length} workflow(s)`)

        // Navigate to first imported workflow if any
        if (importedWorkflowIds.length > 0) {
          router.push(`/workspace/${workspaceId}/w/${importedWorkflowIds[0]}`)
        }
      } catch (error) {
        logger.error('Failed to import workflows:', error)
      } finally {
        setIsImporting(false)

        // Reset file input
        if (event.target) {
          event.target.value = ''
        }
      }
    },
    [importSingleWorkflow, workspaceId, router, createFolderMutation, queryClient]
  )

  return {
    isImporting,
    handleFileChange,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-import-workspace.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/hooks/use-import-workspace.ts
Signals: React, Next.js

```typescript
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'
import {
  extractWorkflowName,
  extractWorkflowsFromZip,
} from '@/lib/workflows/operations/import-export'
import { useCreateFolder } from '@/hooks/queries/folders'
import { useWorkflowDiffStore } from '@/stores/workflow-diff/store'
import { parseWorkflowJson } from '@/stores/workflows/json/importer'

const logger = createLogger('useImportWorkspace')

interface UseImportWorkspaceProps {
  /**
   * Optional callback after successful import
   */
  onSuccess?: () => void
}

/**
 * Hook for managing workspace import from ZIP files.
 *
 * Handles:
 * - Extracting workflows from ZIP file
 * - Creating new workspace
 * - Recreating folder structure
 * - Importing all workflows with states and variables
 * - Navigation to imported workspace
 * - Loading state management
 * - Error handling and logging
 *
 * @param props - Hook configuration
 * @returns Import workspace handlers and state
 */
export function useImportWorkspace({ onSuccess }: UseImportWorkspaceProps = {}) {
  const router = useRouter()
  const [isImporting, setIsImporting] = useState(false)
  const createFolderMutation = useCreateFolder()

  /**
   * Handle workspace import from ZIP file
   */
  const handleImportWorkspace = useCallback(
    async (zipFile: File) => {
      if (isImporting) {
        return
      }

      if (!zipFile.name.toLowerCase().endsWith('.zip')) {
        logger.error('Please select a ZIP file')
        return
      }

      setIsImporting(true)
      try {
        logger.info('Importing workspace from ZIP')

        // Extract workflows from ZIP
        const { workflows: extractedWorkflows, metadata } = await extractWorkflowsFromZip(zipFile)

        if (extractedWorkflows.length === 0) {
          logger.warn('No workflows found in ZIP file')
          return
        }

        // Create new workspace
        const workspaceName = metadata?.workspaceName || zipFile.name.replace(/\.zip$/i, '')
        const createResponse = await fetch('/api/workspaces', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: workspaceName }),
        })

        if (!createResponse.ok) {
          throw new Error('Failed to create workspace')
        }

        const { workspace: newWorkspace } = await createResponse.json()
        logger.info('Created new workspace:', newWorkspace)

        const folderMap = new Map<string, string>()

        // Import workflows
        for (const workflow of extractedWorkflows) {
          try {
            const { data: workflowData, errors: parseErrors } = parseWorkflowJson(workflow.content)

            if (!workflowData || parseErrors.length > 0) {
              logger.warn(`Failed to parse ${workflow.name}:`, parseErrors)
              continue
            }

            // Recreate folder structure
            let targetFolderId: string | null = null
            if (workflow.folderPath.length > 0) {
              const folderPathKey = workflow.folderPath.join('/')

              if (!folderMap.has(folderPathKey)) {
                let parentId: string | null = null

                for (let i = 0; i < workflow.folderPath.length; i++) {
                  const pathSegment = workflow.folderPath.slice(0, i + 1).join('/')

                  if (!folderMap.has(pathSegment)) {
                    const subFolder = await createFolderMutation.mutateAsync({
                      name: workflow.folderPath[i],
                      workspaceId: newWorkspace.id,
                      parentId: parentId || undefined,
                    })
                    folderMap.set(pathSegment, subFolder.id)
                    parentId = subFolder.id
                  } else {
                    parentId = folderMap.get(pathSegment)!
                  }
                }
              }

              targetFolderId = folderMap.get(folderPathKey) || null
            }

            const workflowName = extractWorkflowName(workflow.content, workflow.name)
            useWorkflowDiffStore.getState().clearDiff()

            // Extract color from workflow metadata
            const parsedContent = JSON.parse(workflow.content)
            const workflowColor =
              parsedContent.state?.metadata?.color || parsedContent.metadata?.color || '#3972F6'

            // Create workflow
            const createWorkflowResponse = await fetch('/api/workflows', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: workflowName,
                description: workflowData.metadata?.description || 'Imported from workspace export',
                color: workflowColor,
                workspaceId: newWorkspace.id,
                folderId: targetFolderId,
              }),
            })

            if (!createWorkflowResponse.ok) {
              logger.error(`Failed to create workflow ${workflowName}`)
              continue
            }

            const newWorkflow = await createWorkflowResponse.json()

            // Save workflow state
            const stateResponse = await fetch(`/api/workflows/${newWorkflow.id}/state`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(workflowData),
            })

            if (!stateResponse.ok) {
              logger.error(`Failed to save workflow state for ${newWorkflow.id}`)
              continue
            }

            // Save variables if any
            if (workflowData.variables && workflowData.variables.length > 0) {
              const variablesPayload = workflowData.variables.map((v: any) => ({
                id: typeof v.id === 'string' && v.id.trim() ? v.id : crypto.randomUUID(),
                workflowId: newWorkflow.id,
                name: v.name,
                type: v.type,
                value: v.value,
              }))

              await fetch(`/api/workflows/${newWorkflow.id}/variables`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ variables: variablesPayload }),
              })
            }

            logger.info(`Imported workflow: ${workflowName}`)
          } catch (error) {
            logger.error(`Failed to import ${workflow.name}:`, error)
          }
        }

        logger.info(`Workspace import complete. Imported ${extractedWorkflows.length} workflows`)

        // Navigate to new workspace
        router.push(`/workspace/${newWorkspace.id}/w`)

        onSuccess?.()
      } catch (error) {
        logger.error('Error importing workspace:', error)
        throw error
      } finally {
        setIsImporting(false)
      }
    },
    [isImporting, router, onSuccess, createFolderMutation]
  )

  return {
    isImporting,
    handleImportWorkspace,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: get-user-color.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/utils/get-user-color.ts

```typescript
/**
 * User color palette matching terminal.tsx RUN_ID_COLORS
 * These colors are used consistently across cursors, avatars, and terminal run IDs
 */
export const USER_COLORS = [
  '#4ADE80', // Green
  '#F472B6', // Pink
  '#60C5FF', // Blue
  '#FF8533', // Orange
  '#C084FC', // Purple
  '#FCD34D', // Yellow
] as const

/**
 * Hash a user ID to generate a consistent numeric index
 *
 * @param userId - The user ID to hash
 * @returns A positive integer
 */
function hashUserId(userId: string): number {
  return Math.abs(Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0))
}

/**
 * Gets a consistent color for a user based on their ID.
 * The same user will always get the same color across cursors, avatars, and terminal.
 *
 * @param userId - The unique user identifier
 * @returns A hex color string
 */
export function getUserColor(userId: string): string {
  const hash = hashUserId(userId)
  return USER_COLORS[hash % USER_COLORS.length]
}

/**
 * Creates a stable mapping of user IDs to color indices for a list of users.
 * Useful when you need to maintain consistent color assignments across renders.
 *
 * @param userIds - Array of user IDs to map
 * @returns Map of user ID to color index
 */
export function createUserColorMap(userIds: string[]): Map<string, number> {
  const colorMap = new Map<string, number>()
  let colorIndex = 0

  for (const userId of userIds) {
    if (!colorMap.has(userId)) {
      colorMap.set(userId, colorIndex++)
    }
  }

  return colorMap
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/layout.tsx

```typescript
import { ErrorBoundary } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/error'

export default function WorkflowLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex h-full flex-1 flex-col overflow-hidden bg-[var(--bg)]'>
      <ErrorBoundary>{children}</ErrorBoundary>
    </main>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/page.tsx

```typescript
import Workflow from '@/app/workspace/[workspaceId]/w/[workflowId]/workflow'

export default Workflow
```

--------------------------------------------------------------------------------

````
