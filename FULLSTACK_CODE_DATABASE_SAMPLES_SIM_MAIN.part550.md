---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 550
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 550 of 933)

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

---[FILE: deploy-workflow.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/workflow/deploy-workflow.ts

```typescript
import { Loader2, Rocket, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'
import { getInputFormatExample } from '@/lib/workflows/operations/deployment-utils'
import { useCopilotStore } from '@/stores/panel/copilot/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

interface DeployWorkflowArgs {
  action: 'deploy' | 'undeploy'
  deployType?: 'api' | 'chat'
  workflowId?: string
}

interface ApiKeysData {
  workspaceKeys: Array<{ id: string; name: string }>
  personalKeys: Array<{ id: string; name: string }>
}

export class DeployWorkflowClientTool extends BaseClientTool {
  static readonly id = 'deploy_workflow'

  constructor(toolCallId: string) {
    super(toolCallId, DeployWorkflowClientTool.id, DeployWorkflowClientTool.metadata)
  }

  /**
   * Override to provide dynamic button text based on action and deployType
   */
  getInterruptDisplays(): BaseClientToolMetadata['interrupt'] | undefined {
    // Get params from the copilot store
    const toolCallsById = useCopilotStore.getState().toolCallsById
    const toolCall = toolCallsById[this.toolCallId]
    const params = toolCall?.params as DeployWorkflowArgs | undefined

    const action = params?.action || 'deploy'
    const deployType = params?.deployType || 'api'

    // Check if workflow is already deployed
    const workflowId = params?.workflowId || useWorkflowRegistry.getState().activeWorkflowId
    const isAlreadyDeployed = workflowId
      ? useWorkflowRegistry.getState().getWorkflowDeploymentStatus(workflowId)?.isDeployed
      : false

    let buttonText = action.charAt(0).toUpperCase() + action.slice(1)

    // Change to "Redeploy" if already deployed
    if (action === 'deploy' && isAlreadyDeployed) {
      buttonText = 'Redeploy'
    } else if (action === 'deploy' && deployType === 'chat') {
      buttonText = 'Deploy as chat'
    }

    return {
      accept: { text: buttonText, icon: Rocket },
      reject: { text: 'Skip', icon: XCircle },
    }
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: {
        text: 'Preparing to deploy workflow',
        icon: Loader2,
      },
      [ClientToolCallState.pending]: { text: 'Deploy workflow?', icon: Rocket },
      [ClientToolCallState.executing]: { text: 'Deploying workflow', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Deployed workflow', icon: Rocket },
      [ClientToolCallState.error]: { text: 'Failed to deploy workflow', icon: X },
      [ClientToolCallState.aborted]: {
        text: 'Aborted deploying workflow',
        icon: XCircle,
      },
      [ClientToolCallState.rejected]: {
        text: 'Skipped deploying workflow',
        icon: XCircle,
      },
    },
    interrupt: {
      accept: { text: 'Deploy', icon: Rocket },
      reject: { text: 'Skip', icon: XCircle },
    },
    getDynamicText: (params, state) => {
      const action = params?.action === 'undeploy' ? 'undeploy' : 'deploy'
      const deployType = params?.deployType || 'api'

      // Check if workflow is already deployed
      const workflowId = params?.workflowId || useWorkflowRegistry.getState().activeWorkflowId
      const isAlreadyDeployed = workflowId
        ? useWorkflowRegistry.getState().getWorkflowDeploymentStatus(workflowId)?.isDeployed
        : false

      // Determine action text based on deployment status
      let actionText = action
      let actionTextIng = action === 'undeploy' ? 'undeploying' : 'deploying'
      let actionTextPast = action === 'undeploy' ? 'undeployed' : 'deployed'

      // If already deployed and action is deploy, change to redeploy
      if (action === 'deploy' && isAlreadyDeployed) {
        actionText = 'redeploy'
        actionTextIng = 'redeploying'
        actionTextPast = 'redeployed'
      }

      const actionCapitalized = actionText.charAt(0).toUpperCase() + actionText.slice(1)

      // Special text for chat deployment
      const isChatDeploy = action === 'deploy' && deployType === 'chat'
      const displayAction = isChatDeploy ? 'deploy as chat' : actionText
      const displayActionCapitalized = isChatDeploy ? 'Deploy as chat' : actionCapitalized

      switch (state) {
        case ClientToolCallState.success:
          return isChatDeploy
            ? 'Opened chat deployment settings'
            : `${actionCapitalized}ed workflow`
        case ClientToolCallState.executing:
          return isChatDeploy
            ? 'Opening chat deployment settings'
            : `${actionCapitalized}ing workflow`
        case ClientToolCallState.generating:
          return `Preparing to ${displayAction} workflow`
        case ClientToolCallState.pending:
          return `${displayActionCapitalized} workflow?`
        case ClientToolCallState.error:
          return `Failed to ${displayAction} workflow`
        case ClientToolCallState.aborted:
          return isChatDeploy
            ? 'Aborted opening chat deployment'
            : `Aborted ${actionTextIng} workflow`
        case ClientToolCallState.rejected:
          return isChatDeploy
            ? 'Skipped opening chat deployment'
            : `Skipped ${actionTextIng} workflow`
      }
      return undefined
    },
  }

  /**
   * Checks if the user has any API keys (workspace or personal)
   */
  private async hasApiKeys(workspaceId: string): Promise<boolean> {
    try {
      const [workspaceRes, personalRes] = await Promise.all([
        fetch(`/api/workspaces/${workspaceId}/api-keys`),
        fetch('/api/users/me/api-keys'),
      ])

      if (!workspaceRes.ok || !personalRes.ok) {
        return false
      }

      const workspaceData = await workspaceRes.json()
      const personalData = await personalRes.json()

      const workspaceKeys = (workspaceData?.keys || []) as Array<any>
      const personalKeys = (personalData?.keys || []) as Array<any>

      return workspaceKeys.length > 0 || personalKeys.length > 0
    } catch (error) {
      const logger = createLogger('DeployWorkflowClientTool')
      logger.warn('Failed to check API keys:', error)
      return false
    }
  }

  /**
   * Opens the settings modal to the API keys tab
   */
  private openApiKeysModal(): void {
    window.dispatchEvent(new CustomEvent('open-settings', { detail: { tab: 'apikeys' } }))
  }

  /**
   * Opens the deploy modal to the chat tab
   */
  private openDeployModal(tab: 'api' | 'chat' = 'api'): void {
    window.dispatchEvent(new CustomEvent('open-deploy-modal', { detail: { tab } }))
  }

  async handleReject(): Promise<void> {
    await super.handleReject()
    this.setState(ClientToolCallState.rejected)
  }

  async handleAccept(args?: DeployWorkflowArgs): Promise<void> {
    const logger = createLogger('DeployWorkflowClientTool')
    try {
      const action = args?.action || 'deploy'
      const deployType = args?.deployType || 'api'
      const { activeWorkflowId, workflows } = useWorkflowRegistry.getState()
      const workflowId = args?.workflowId || activeWorkflowId

      if (!workflowId) {
        throw new Error('No workflow ID provided')
      }

      const workflow = workflows[workflowId]
      const workspaceId = workflow?.workspaceId

      // For chat deployment, just open the deploy modal
      if (action === 'deploy' && deployType === 'chat') {
        this.setState(ClientToolCallState.success)
        this.openDeployModal('chat')
        await this.markToolComplete(
          200,
          'Opened chat deployment settings. Configure and deploy your workflow as a chat interface.',
          {
            action,
            deployType,
            openedModal: true,
          }
        )
        return
      }

      // For deploy action, check if user has API keys first
      if (action === 'deploy') {
        if (!workspaceId) {
          throw new Error('Workflow workspace not found')
        }

        const hasKeys = await this.hasApiKeys(workspaceId)

        if (!hasKeys) {
          // Mark as rejected since we can't deploy without an API key
          this.setState(ClientToolCallState.rejected)

          // Open the API keys modal to help user create one
          this.openApiKeysModal()

          await this.markToolComplete(
            200,
            'Cannot deploy without an API key. Opened API key settings so you can create one. Once you have an API key, try deploying again.',
            {
              needsApiKey: true,
              message:
                'You need to create an API key before you can deploy your workflow. The API key settings have been opened for you. After creating an API key, you can deploy your workflow.',
            }
          )
          return
        }
      }

      this.setState(ClientToolCallState.executing)

      // Perform the deploy/undeploy action
      const endpoint = `/api/workflows/${workflowId}/deploy`
      const method = action === 'deploy' ? 'POST' : 'DELETE'

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: action === 'deploy' ? JSON.stringify({ deployChatEnabled: false }) : undefined,
      })

      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt || `Server error (${res.status})`)
      }

      const json = await res.json()

      let successMessage = ''
      let resultData: any = {
        action,
        isDeployed: action === 'deploy',
        deployedAt: json.deployedAt,
      }

      if (action === 'deploy') {
        // Generate the curl command for the deployed workflow (matching deploy modal format)
        const appUrl =
          typeof window !== 'undefined'
            ? window.location.origin
            : process.env.NEXT_PUBLIC_APP_URL || 'https://app.sim.ai'
        const endpoint = `${appUrl}/api/workflows/${workflowId}/execute`
        const apiKeyPlaceholder = '$SIM_API_KEY'

        // Get input format example (returns empty string if no inputs, or -d flag with example data)
        const inputExample = getInputFormatExample(false)

        // Match the exact format from deploy modal
        const curlCommand = `curl -X POST -H "X-API-Key: ${apiKeyPlaceholder}" -H "Content-Type: application/json"${inputExample} ${endpoint}`

        successMessage = 'Workflow deployed successfully. You can now call it via the API.'

        resultData = {
          ...resultData,
          endpoint,
          curlCommand,
          apiKeyPlaceholder,
        }
      } else {
        successMessage = 'Workflow undeployed successfully.'
      }

      this.setState(ClientToolCallState.success)
      await this.markToolComplete(200, successMessage, resultData)

      // Refresh the workflow registry to update deployment status
      try {
        const setDeploymentStatus = useWorkflowRegistry.getState().setDeploymentStatus
        if (action === 'deploy') {
          setDeploymentStatus(
            workflowId,
            true,
            json.deployedAt ? new Date(json.deployedAt) : undefined,
            json.apiKey || ''
          )
        } else {
          setDeploymentStatus(workflowId, false, undefined, '')
        }
        const actionPast = action === 'undeploy' ? 'undeployed' : 'deployed'
        logger.info(`Workflow ${actionPast} and registry updated`)
      } catch (error) {
        logger.warn('Failed to update workflow registry:', error)
      }
    } catch (e: any) {
      logger.error('Deploy/undeploy failed', { message: e?.message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, e?.message || 'Failed to deploy/undeploy workflow')
    }
  }

  async execute(args?: DeployWorkflowArgs): Promise<void> {
    await this.handleAccept(args)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: edit-workflow.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/workflow/edit-workflow.ts

```typescript
import { Grid2x2, Grid2x2Check, Grid2x2X, Loader2, MinusCircle, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { ExecuteResponseSuccessSchema } from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'
import { stripWorkflowDiffMarkers } from '@/lib/workflows/diff'
import { sanitizeForCopilot } from '@/lib/workflows/sanitization/json-sanitizer'
import { useWorkflowDiffStore } from '@/stores/workflow-diff/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { mergeSubblockState } from '@/stores/workflows/utils'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'
import type { WorkflowState } from '@/stores/workflows/workflow/types'

interface EditWorkflowOperation {
  operation_type: 'add' | 'edit' | 'delete'
  block_id: string
  params?: Record<string, any>
}

interface EditWorkflowArgs {
  operations: EditWorkflowOperation[]
  workflowId: string
  currentUserWorkflow?: string
}

export class EditWorkflowClientTool extends BaseClientTool {
  static readonly id = 'edit_workflow'
  private lastResult: any | undefined
  private hasExecuted = false
  private hasAppliedDiff = false
  private workflowId: string | undefined

  constructor(toolCallId: string) {
    super(toolCallId, EditWorkflowClientTool.id, EditWorkflowClientTool.metadata)
  }

  /**
   * Get sanitized workflow JSON from a workflow state, merge subblocks, and sanitize for copilot
   * This matches what get_user_workflow returns
   */
  private getSanitizedWorkflowJson(workflowState: any): string | undefined {
    const logger = createLogger('EditWorkflowClientTool')

    if (!this.workflowId) {
      logger.warn('No workflowId available for getting sanitized workflow JSON')
      return undefined
    }

    if (!workflowState) {
      logger.warn('No workflow state provided')
      return undefined
    }

    try {
      // Normalize required properties
      if (!workflowState.loops) workflowState.loops = {}
      if (!workflowState.parallels) workflowState.parallels = {}
      if (!workflowState.edges) workflowState.edges = []
      if (!workflowState.blocks) workflowState.blocks = {}

      // Merge latest subblock values so edits are reflected
      let mergedState = workflowState
      if (workflowState.blocks) {
        mergedState = {
          ...workflowState,
          blocks: mergeSubblockState(workflowState.blocks, this.workflowId as any),
        }
        logger.info('Merged subblock values into workflow state', {
          workflowId: this.workflowId,
          blockCount: Object.keys(mergedState.blocks || {}).length,
        })
      }

      // Sanitize workflow state for copilot (remove UI-specific data)
      const sanitizedState = sanitizeForCopilot(mergedState)

      // Convert to JSON string for transport
      const workflowJson = JSON.stringify(sanitizedState, null, 2)
      logger.info('Successfully created sanitized workflow JSON', {
        workflowId: this.workflowId,
        jsonLength: workflowJson.length,
      })

      return workflowJson
    } catch (error) {
      logger.error('Failed to get sanitized workflow JSON', {
        error: error instanceof Error ? error.message : String(error),
      })
      return undefined
    }
  }

  /**
   * Safely get the current workflow JSON sanitized for copilot without throwing.
   * Used to ensure we always include workflow state in markComplete.
   */
  private getCurrentWorkflowJsonSafe(logger: ReturnType<typeof createLogger>): string | undefined {
    try {
      const currentState = useWorkflowStore.getState().getWorkflowState()
      if (!currentState) {
        logger.warn('No current workflow state available')
        return undefined
      }
      return this.getSanitizedWorkflowJson(currentState)
    } catch (error) {
      logger.warn('Failed to get current workflow JSON safely', {
        error: error instanceof Error ? error.message : String(error),
      })
      return undefined
    }
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Editing your workflow', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Editing your workflow', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Edited your workflow', icon: Grid2x2Check },
      [ClientToolCallState.error]: { text: 'Failed to edit your workflow', icon: XCircle },
      [ClientToolCallState.review]: { text: 'Review your workflow changes', icon: Grid2x2 },
      [ClientToolCallState.rejected]: { text: 'Rejected workflow changes', icon: Grid2x2X },
      [ClientToolCallState.aborted]: { text: 'Aborted editing your workflow', icon: MinusCircle },
      [ClientToolCallState.pending]: { text: 'Editing your workflow', icon: Loader2 },
    },
    getDynamicText: (params, state) => {
      const workflowId = params?.workflowId || useWorkflowRegistry.getState().activeWorkflowId
      if (workflowId) {
        const workflowName = useWorkflowRegistry.getState().workflows[workflowId]?.name
        if (workflowName) {
          switch (state) {
            case ClientToolCallState.success:
              return `Edited ${workflowName}`
            case ClientToolCallState.executing:
            case ClientToolCallState.generating:
            case ClientToolCallState.pending:
              return `Editing ${workflowName}`
            case ClientToolCallState.error:
              return `Failed to edit ${workflowName}`
            case ClientToolCallState.review:
              return `Review changes to ${workflowName}`
            case ClientToolCallState.rejected:
              return `Rejected changes to ${workflowName}`
            case ClientToolCallState.aborted:
              return `Aborted editing ${workflowName}`
          }
        }
      }
      return undefined
    },
  }

  async handleAccept(): Promise<void> {
    const logger = createLogger('EditWorkflowClientTool')
    logger.info('handleAccept called', { toolCallId: this.toolCallId, state: this.getState() })
    // Tool was already marked complete in execute() - this is just for UI state
    this.setState(ClientToolCallState.success)
  }

  async handleReject(): Promise<void> {
    const logger = createLogger('EditWorkflowClientTool')
    logger.info('handleReject called', { toolCallId: this.toolCallId, state: this.getState() })
    // Tool was already marked complete in execute() - this is just for UI state
    this.setState(ClientToolCallState.rejected)
  }

  async execute(args?: EditWorkflowArgs): Promise<void> {
    const logger = createLogger('EditWorkflowClientTool')

    // Use timeout protection to ensure tool always completes
    await this.executeWithTimeout(async () => {
      if (this.hasExecuted) {
        logger.info('execute skipped (already executed)', { toolCallId: this.toolCallId })
        // Even if skipped, ensure we mark complete with current workflow state
        if (!this.hasBeenMarkedComplete()) {
          const currentWorkflowJson = this.getCurrentWorkflowJsonSafe(logger)
          await this.markToolComplete(
            200,
            'Tool already executed',
            currentWorkflowJson ? { userWorkflow: currentWorkflowJson } : undefined
          )
        }
        return
      }
      this.hasExecuted = true
      logger.info('execute called', { toolCallId: this.toolCallId, argsProvided: !!args })
      this.setState(ClientToolCallState.executing)

      // Resolve workflowId
      let workflowId = args?.workflowId
      if (!workflowId) {
        const { activeWorkflowId } = useWorkflowRegistry.getState()
        workflowId = activeWorkflowId as any
      }
      if (!workflowId) {
        this.setState(ClientToolCallState.error)
        await this.markToolComplete(400, 'No active workflow found')
        return
      }

      // Store workflowId for later use
      this.workflowId = workflowId

      // Validate operations
      const operations = args?.operations || []
      if (!operations.length) {
        this.setState(ClientToolCallState.error)
        const currentWorkflowJson = this.getCurrentWorkflowJsonSafe(logger)
        await this.markToolComplete(
          400,
          'No operations provided for edit_workflow',
          currentWorkflowJson ? { userWorkflow: currentWorkflowJson } : undefined
        )
        return
      }

      // Prepare currentUserWorkflow JSON from stores to preserve block IDs
      let currentUserWorkflow = args?.currentUserWorkflow

      if (!currentUserWorkflow) {
        try {
          const workflowStore = useWorkflowStore.getState()
          const fullState = workflowStore.getWorkflowState()
          const mergedBlocks = mergeSubblockState(fullState.blocks, workflowId as any)
          const payloadState = stripWorkflowDiffMarkers({
            ...fullState,
            blocks: mergedBlocks,
            edges: fullState.edges || [],
            loops: fullState.loops || {},
            parallels: fullState.parallels || {},
          })
          currentUserWorkflow = JSON.stringify(payloadState)
        } catch (error) {
          logger.warn('Failed to build currentUserWorkflow from stores; proceeding without it', {
            error,
          })
        }
      }

      // Fetch with AbortController for timeout support
      const controller = new AbortController()
      const fetchTimeout = setTimeout(() => controller.abort(), 60000) // 60s fetch timeout

      try {
        const res = await fetch('/api/copilot/execute-copilot-server-tool', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toolName: 'edit_workflow',
            payload: {
              operations,
              workflowId,
              ...(currentUserWorkflow ? { currentUserWorkflow } : {}),
            },
          }),
          signal: controller.signal,
        })

        clearTimeout(fetchTimeout)

        if (!res.ok) {
          const errorText = await res.text().catch(() => '')
          let errorMessage: string
          try {
            const errorJson = JSON.parse(errorText)
            errorMessage = errorJson.error || errorText || `Server error (${res.status})`
          } catch {
            errorMessage = errorText || `Server error (${res.status})`
          }
          // Mark complete with error but include current workflow state
          this.setState(ClientToolCallState.error)
          const currentWorkflowJson = this.getCurrentWorkflowJsonSafe(logger)
          await this.markToolComplete(
            res.status,
            errorMessage,
            currentWorkflowJson ? { userWorkflow: currentWorkflowJson } : undefined
          )
          return
        }

        const json = await res.json()
        const parsed = ExecuteResponseSuccessSchema.parse(json)
        const result = parsed.result as any
        this.lastResult = result
        logger.info('server result parsed', {
          hasWorkflowState: !!result?.workflowState,
          blocksCount: result?.workflowState
            ? Object.keys(result.workflowState.blocks || {}).length
            : 0,
          hasSkippedItems: !!result?.skippedItems,
          skippedItemsCount: result?.skippedItems?.length || 0,
          hasInputValidationErrors: !!result?.inputValidationErrors,
          inputValidationErrorsCount: result?.inputValidationErrors?.length || 0,
        })

        // Log skipped items and validation errors for visibility
        if (result?.skippedItems?.length > 0) {
          logger.warn('Some operations were skipped during edit_workflow', {
            skippedItems: result.skippedItems,
          })
        }
        if (result?.inputValidationErrors?.length > 0) {
          logger.warn('Some inputs were rejected during edit_workflow', {
            inputValidationErrors: result.inputValidationErrors,
          })
        }

        // Update diff directly with workflow state - no YAML conversion needed!
        if (!result.workflowState) {
          this.setState(ClientToolCallState.error)
          const currentWorkflowJson = this.getCurrentWorkflowJsonSafe(logger)
          await this.markToolComplete(
            500,
            'No workflow state returned from server',
            currentWorkflowJson ? { userWorkflow: currentWorkflowJson } : undefined
          )
          return
        }

        let actualDiffWorkflow: WorkflowState | null = null

        if (!this.hasAppliedDiff) {
          const diffStore = useWorkflowDiffStore.getState()
          // setProposedChanges applies the state optimistically to the workflow store
          await diffStore.setProposedChanges(result.workflowState)
          logger.info('diff proposed changes set for edit_workflow with direct workflow state')
          this.hasAppliedDiff = true
        }

        // Read back the applied state from the workflow store
        const workflowStore = useWorkflowStore.getState()
        actualDiffWorkflow = workflowStore.getWorkflowState()

        if (!actualDiffWorkflow) {
          this.setState(ClientToolCallState.error)
          const currentWorkflowJson = this.getCurrentWorkflowJsonSafe(logger)
          await this.markToolComplete(
            500,
            'Failed to retrieve workflow state after applying changes',
            currentWorkflowJson ? { userWorkflow: currentWorkflowJson } : undefined
          )
          return
        }

        // Get the workflow state that was just applied, merge subblocks, and sanitize
        // This matches what get_user_workflow would return (the true state after edits were applied)
        let workflowJson = this.getSanitizedWorkflowJson(actualDiffWorkflow)

        // Fallback: try to get current workflow state if sanitization failed
        if (!workflowJson) {
          workflowJson = this.getCurrentWorkflowJsonSafe(logger)
        }

        // userWorkflow must always be present on success - log error if missing
        if (!workflowJson) {
          logger.error('Failed to get workflow JSON on success path - this should not happen', {
            toolCallId: this.toolCallId,
            workflowId: this.workflowId,
          })
        }

        // Build sanitized data including workflow JSON and any skipped/validation info
        // Always include userWorkflow on success paths
        const sanitizedData: Record<string, any> = {
          userWorkflow: workflowJson ?? '{}', // Fallback to empty object JSON if all else fails
        }

        // Include skipped items and validation errors in the response for LLM feedback
        if (result?.skippedItems?.length > 0) {
          sanitizedData.skippedItems = result.skippedItems
          sanitizedData.skippedItemsMessage = result.skippedItemsMessage
        }
        if (result?.inputValidationErrors?.length > 0) {
          sanitizedData.inputValidationErrors = result.inputValidationErrors
          sanitizedData.inputValidationMessage = result.inputValidationMessage
        }

        // Build a message that includes info about skipped items
        let completeMessage = 'Workflow diff ready for review'
        if (result?.skippedItems?.length > 0 || result?.inputValidationErrors?.length > 0) {
          const parts: string[] = []
          if (result?.skippedItems?.length > 0) {
            parts.push(`${result.skippedItems.length} operation(s) skipped`)
          }
          if (result?.inputValidationErrors?.length > 0) {
            parts.push(`${result.inputValidationErrors.length} input(s) rejected`)
          }
          completeMessage = `Workflow diff ready for review. Note: ${parts.join(', ')}.`
        }

        // Mark complete early to unblock LLM stream - sanitizedData always has userWorkflow
        await this.markToolComplete(200, completeMessage, sanitizedData)

        // Move into review state
        this.setState(ClientToolCallState.review, { result })
      } catch (fetchError: any) {
        clearTimeout(fetchTimeout)
        // Handle error with current workflow state
        this.setState(ClientToolCallState.error)
        const currentWorkflowJson = this.getCurrentWorkflowJsonSafe(logger)
        const errorMessage =
          fetchError.name === 'AbortError'
            ? 'Server request timed out'
            : fetchError.message || String(fetchError)
        await this.markToolComplete(
          500,
          errorMessage,
          currentWorkflowJson ? { userWorkflow: currentWorkflowJson } : undefined
        )
      }
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: get-user-workflow.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/workflow/get-user-workflow.ts

```typescript
import { Loader2, Workflow as WorkflowIcon, X, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { createLogger } from '@/lib/logs/console/logger'
import { stripWorkflowDiffMarkers } from '@/lib/workflows/diff'
import { sanitizeForCopilot } from '@/lib/workflows/sanitization/json-sanitizer'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { mergeSubblockState } from '@/stores/workflows/utils'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

interface GetUserWorkflowArgs {
  workflowId?: string
  includeMetadata?: boolean
}

const logger = createLogger('GetUserWorkflowClientTool')

export class GetUserWorkflowClientTool extends BaseClientTool {
  static readonly id = 'get_user_workflow'

  constructor(toolCallId: string) {
    super(toolCallId, GetUserWorkflowClientTool.id, GetUserWorkflowClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Reading your workflow', icon: Loader2 },
      [ClientToolCallState.pending]: { text: 'Reading your workflow', icon: WorkflowIcon },
      [ClientToolCallState.executing]: { text: 'Reading your workflow', icon: Loader2 },
      [ClientToolCallState.aborted]: { text: 'Aborted reading your workflow', icon: XCircle },
      [ClientToolCallState.success]: { text: 'Read your workflow', icon: WorkflowIcon },
      [ClientToolCallState.error]: { text: 'Failed to read your workflow', icon: X },
      [ClientToolCallState.rejected]: { text: 'Skipped reading your workflow', icon: XCircle },
    },
    getDynamicText: (params, state) => {
      const workflowId = params?.workflowId || useWorkflowRegistry.getState().activeWorkflowId
      if (workflowId) {
        const workflowName = useWorkflowRegistry.getState().workflows[workflowId]?.name
        if (workflowName) {
          switch (state) {
            case ClientToolCallState.success:
              return `Read ${workflowName}`
            case ClientToolCallState.executing:
            case ClientToolCallState.generating:
            case ClientToolCallState.pending:
              return `Reading ${workflowName}`
            case ClientToolCallState.error:
              return `Failed to read ${workflowName}`
            case ClientToolCallState.aborted:
              return `Aborted reading ${workflowName}`
            case ClientToolCallState.rejected:
              return `Skipped reading ${workflowName}`
          }
        }
      }
      return undefined
    },
  }

  async execute(args?: GetUserWorkflowArgs): Promise<void> {
    try {
      this.setState(ClientToolCallState.executing)

      // Determine workflow ID (explicit or active)
      let workflowId = args?.workflowId
      if (!workflowId) {
        const { activeWorkflowId } = useWorkflowRegistry.getState()
        if (!activeWorkflowId) {
          await this.markToolComplete(400, 'No active workflow found')
          this.setState(ClientToolCallState.error)
          return
        }
        workflowId = activeWorkflowId as any
      }

      logger.info('Fetching user workflow from stores', {
        workflowId,
        includeMetadata: args?.includeMetadata,
      })

      // Always use main workflow store as the source of truth
      const workflowStore = useWorkflowStore.getState()
      const fullWorkflowState = workflowStore.getWorkflowState()

      let workflowState: any = null

      if (!fullWorkflowState || !fullWorkflowState.blocks) {
        const workflowRegistry = useWorkflowRegistry.getState()
        const wfKey = String(workflowId)
        const workflow = (workflowRegistry as any).workflows?.[wfKey]

        if (!workflow) {
          await this.markToolComplete(404, `Workflow ${workflowId} not found in any store`)
          this.setState(ClientToolCallState.error)
          return
        }

        logger.warn('No workflow state found, using workflow metadata only', { workflowId })
        workflowState = workflow
      } else {
        workflowState = stripWorkflowDiffMarkers(fullWorkflowState)
        logger.info('Using workflow state from workflow store', {
          workflowId,
          blockCount: Object.keys(fullWorkflowState.blocks || {}).length,
        })
      }

      // Normalize required properties
      if (workflowState) {
        if (!workflowState.loops) workflowState.loops = {}
        if (!workflowState.parallels) workflowState.parallels = {}
        if (!workflowState.edges) workflowState.edges = []
        if (!workflowState.blocks) workflowState.blocks = {}
      }

      // Merge latest subblock values so edits are reflected
      try {
        if (workflowState?.blocks) {
          workflowState = {
            ...workflowState,
            blocks: mergeSubblockState(workflowState.blocks, workflowId as any),
          }
          logger.info('Merged subblock values into workflow state', {
            workflowId,
            blockCount: Object.keys(workflowState.blocks || {}).length,
          })
        }
      } catch (mergeError) {
        logger.warn('Failed to merge subblock values; proceeding with raw workflow state', {
          workflowId,
          error: mergeError instanceof Error ? mergeError.message : String(mergeError),
        })
      }

      logger.info('Validating workflow state', {
        workflowId,
        hasWorkflowState: !!workflowState,
        hasBlocks: !!workflowState?.blocks,
        workflowStateType: typeof workflowState,
      })

      if (!workflowState || !workflowState.blocks) {
        await this.markToolComplete(422, 'Workflow state is empty or invalid')
        this.setState(ClientToolCallState.error)
        return
      }

      // Sanitize workflow state for copilot (remove UI-specific data)
      const sanitizedState = sanitizeForCopilot(workflowState)

      // Convert to JSON string for transport
      let workflowJson = ''
      try {
        workflowJson = JSON.stringify(sanitizedState, null, 2)
        logger.info('Successfully stringified sanitized workflow state', {
          workflowId,
          jsonLength: workflowJson.length,
        })
      } catch (stringifyError) {
        await this.markToolComplete(
          500,
          `Failed to convert workflow to JSON: ${
            stringifyError instanceof Error ? stringifyError.message : 'Unknown error'
          }`
        )
        this.setState(ClientToolCallState.error)
        return
      }

      // Mark complete with data; keep state success for store render
      await this.markToolComplete(200, 'Workflow analyzed', { userWorkflow: workflowJson })
      this.setState(ClientToolCallState.success)
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error)
      logger.error('Error in tool execution', {
        toolCallId: this.toolCallId,
        error,
        message,
      })
      await this.markToolComplete(500, message || 'Failed to fetch workflow')
      this.setState(ClientToolCallState.error)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: get-workflow-console.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/client/workflow/get-workflow-console.ts

```typescript
import { Loader2, MinusCircle, TerminalSquare, XCircle } from 'lucide-react'
import {
  BaseClientTool,
  type BaseClientToolMetadata,
  ClientToolCallState,
} from '@/lib/copilot/tools/client/base-tool'
import { ExecuteResponseSuccessSchema } from '@/lib/copilot/tools/shared/schemas'
import { createLogger } from '@/lib/logs/console/logger'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

interface GetWorkflowConsoleArgs {
  workflowId?: string
  limit?: number
  includeDetails?: boolean
}

export class GetWorkflowConsoleClientTool extends BaseClientTool {
  static readonly id = 'get_workflow_console'

  constructor(toolCallId: string) {
    super(toolCallId, GetWorkflowConsoleClientTool.id, GetWorkflowConsoleClientTool.metadata)
  }

  static readonly metadata: BaseClientToolMetadata = {
    displayNames: {
      [ClientToolCallState.generating]: { text: 'Fetching execution logs', icon: Loader2 },
      [ClientToolCallState.executing]: { text: 'Fetching execution logs', icon: Loader2 },
      [ClientToolCallState.success]: { text: 'Fetched execution logs', icon: TerminalSquare },
      [ClientToolCallState.error]: { text: 'Failed to fetch execution logs', icon: XCircle },
      [ClientToolCallState.rejected]: {
        text: 'Skipped fetching execution logs',
        icon: MinusCircle,
      },
      [ClientToolCallState.aborted]: {
        text: 'Aborted fetching execution logs',
        icon: MinusCircle,
      },
      [ClientToolCallState.pending]: { text: 'Fetching execution logs', icon: Loader2 },
    },
    getDynamicText: (params, state) => {
      const limit = params?.limit
      if (limit && typeof limit === 'number') {
        const logText = limit === 1 ? 'execution log' : 'execution logs'

        switch (state) {
          case ClientToolCallState.success:
            return `Fetched last ${limit} ${logText}`
          case ClientToolCallState.executing:
          case ClientToolCallState.generating:
          case ClientToolCallState.pending:
            return `Fetching last ${limit} ${logText}`
          case ClientToolCallState.error:
            return `Failed to fetch last ${limit} ${logText}`
          case ClientToolCallState.rejected:
            return `Skipped fetching last ${limit} ${logText}`
          case ClientToolCallState.aborted:
            return `Aborted fetching last ${limit} ${logText}`
        }
      }
      return undefined
    },
  }

  async execute(args?: GetWorkflowConsoleArgs): Promise<void> {
    const logger = createLogger('GetWorkflowConsoleClientTool')
    try {
      this.setState(ClientToolCallState.executing)

      const params = args || {}
      let workflowId = params.workflowId
      if (!workflowId) {
        const { activeWorkflowId } = useWorkflowRegistry.getState()
        workflowId = activeWorkflowId || undefined
      }
      if (!workflowId) {
        logger.error('No active workflow found for console fetch')
        this.setState(ClientToolCallState.error)
        await this.markToolComplete(400, 'No active workflow found')
        return
      }

      const payload = {
        workflowId,
        limit: params.limit ?? 3,
        includeDetails: params.includeDetails ?? true,
      }

      const res = await fetch('/api/copilot/execute-copilot-server-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName: 'get_workflow_console', payload }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `Server error (${res.status})`)
      }

      const json = await res.json()
      const parsed = ExecuteResponseSuccessSchema.parse(json)

      // Mark success and include result data for UI rendering
      this.setState(ClientToolCallState.success)
      await this.markToolComplete(200, 'Workflow console fetched', parsed.result)
      this.setState(ClientToolCallState.success)
    } catch (e: any) {
      const message = e instanceof Error ? e.message : String(e)
      createLogger('GetWorkflowConsoleClientTool').error('execute failed', { message })
      this.setState(ClientToolCallState.error)
      await this.markToolComplete(500, message)
    }
  }
}
```

--------------------------------------------------------------------------------

````
