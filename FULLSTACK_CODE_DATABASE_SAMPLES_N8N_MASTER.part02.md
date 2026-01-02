---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 2
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 2 of 51)

````text
================================================================================
FULLSTACK SAMPLES PATTERN DATABASE - n8n-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/n8n-master
================================================================================

NOTES:
- This file intentionally avoids copying large verbatim third-party code.
- It captures reusable patterns, surfaces, and file references.
- Use the referenced file paths to view full implementations locally.

================================================================================

---[FILE: add-node.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/add-node.tool.ts
Signals: Zod
Excerpt (<=80 chars): export const nodeCreationSchema = z.object(baseSchema);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAddNodeToolBase
- createAddNodeTool
- nodeCreationSchema
- nodeCreationE2ESchema
```

--------------------------------------------------------------------------------

---[FILE: builder-tools.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/builder-tools.ts
Signals: N/A
Excerpt (<=80 chars):  export function getBuilderTools({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getBuilderTools
- getBuilderToolsForDisplay
```

--------------------------------------------------------------------------------

---[FILE: categorize-prompt.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/categorize-prompt.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export const CATEGORIZE_PROMPT_TOOL: BuilderToolBase = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createCategorizePromptTool
```

--------------------------------------------------------------------------------

---[FILE: connect-nodes.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/connect-nodes.tool.ts
Signals: Zod
Excerpt (<=80 chars): export const nodeConnectionSchema = z.object({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createConnectNodesTool
- nodeConnectionSchema
```

--------------------------------------------------------------------------------

---[FILE: get-best-practices.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/get-best-practices.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export const GET_BEST_PRACTICES_TOOL: BuilderToolBase = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createGetBestPracticesTool
```

--------------------------------------------------------------------------------

---[FILE: get-node-parameter.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/get-node-parameter.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export const GET_NODE_PARAMETER_TOOL: BuilderToolBase = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createGetNodeParameterTool
```

--------------------------------------------------------------------------------

---[FILE: get-workflow-examples.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/get-workflow-examples.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export const GET_WORKFLOW_EXAMPLES_TOOL: BuilderToolBase = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createGetWorkflowExamplesTool
```

--------------------------------------------------------------------------------

---[FILE: node-details.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/node-details.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export const NODE_DETAILS_TOOL: BuilderToolBase = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createNodeDetailsTool
```

--------------------------------------------------------------------------------

---[FILE: node-search.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/node-search.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export const NODE_SEARCH_TOOL: BuilderToolBase = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createNodeSearchTool
```

--------------------------------------------------------------------------------

---[FILE: remove-connection.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/remove-connection.tool.ts
Signals: Zod
Excerpt (<=80 chars): export const removeConnectionSchema = z.object({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createRemoveConnectionTool
- removeConnectionSchema
```

--------------------------------------------------------------------------------

---[FILE: remove-node.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/remove-node.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export const REMOVE_NODE_TOOL: BuilderToolBase = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createRemoveNodeTool
```

--------------------------------------------------------------------------------

---[FILE: update-node-parameters.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/update-node-parameters.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export const UPDATING_NODE_PARAMETER_TOOL: BuilderToolBase = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createUpdateNodeParametersTool
```

--------------------------------------------------------------------------------

---[FILE: validate-configuration.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/validate-configuration.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export const VALIDATE_CONFIGURATION_TOOL: BuilderToolBase = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createValidateConfigurationTool
```

--------------------------------------------------------------------------------

---[FILE: validate-structure.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/validate-structure.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export const VALIDATE_STRUCTURE_TOOL: BuilderToolBase = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createValidateStructureTool
```

--------------------------------------------------------------------------------

---[FILE: validate-workflow.tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/validate-workflow.tool.ts
Signals: Zod
Excerpt (<=80 chars):  export const VALIDATE_WORKFLOW_TOOL: BuilderToolBase = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createValidateWorkflowTool
```

--------------------------------------------------------------------------------

---[FILE: chatbot.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/chatbot.ts
Signals: N/A
Excerpt (<=80 chars):  export class ChatbotBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChatbotBestPractices
```

--------------------------------------------------------------------------------

---[FILE: content-generation.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/content-generation.ts
Signals: N/A
Excerpt (<=80 chars):  export class ContentGenerationBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ContentGenerationBestPractices
```

--------------------------------------------------------------------------------

---[FILE: data-analysis.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/data-analysis.ts
Signals: N/A
Excerpt (<=80 chars):  export class DataAnalysisBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataAnalysisBestPractices
```

--------------------------------------------------------------------------------

---[FILE: data-extraction.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/data-extraction.ts
Signals: N/A
Excerpt (<=80 chars):  export class DataExtractionBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataExtractionBestPractices
```

--------------------------------------------------------------------------------

---[FILE: data-transformation.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/data-transformation.ts
Signals: N/A
Excerpt (<=80 chars):  export class DataTransformationBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataTransformationBestPractices
```

--------------------------------------------------------------------------------

---[FILE: document-processing.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/document-processing.ts
Signals: N/A
Excerpt (<=80 chars):  export class DocumentProcessingBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DocumentProcessingBestPractices
```

--------------------------------------------------------------------------------

---[FILE: enrichment.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/enrichment.ts
Signals: N/A
Excerpt (<=80 chars):  export class EnrichmentBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EnrichmentBestPractices
```

--------------------------------------------------------------------------------

---[FILE: form-input.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/form-input.ts
Signals: N/A
Excerpt (<=80 chars):  export class FormInputBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FormInputBestPractices
```

--------------------------------------------------------------------------------

---[FILE: human-in-the-loop.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/human-in-the-loop.ts
Signals: N/A
Excerpt (<=80 chars):  export class HumanInTheLoopBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HumanInTheLoopBestPractices
```

--------------------------------------------------------------------------------

---[FILE: knowledge-base.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/knowledge-base.ts
Signals: N/A
Excerpt (<=80 chars):  export class KnowledgeBaseBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- KnowledgeBaseBestPractices
```

--------------------------------------------------------------------------------

---[FILE: monitoring.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/monitoring.ts
Signals: N/A
Excerpt (<=80 chars):  export class MonitoringBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MonitoringBestPractices
```

--------------------------------------------------------------------------------

---[FILE: notification.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/notification.ts
Signals: N/A
Excerpt (<=80 chars):  export class NotificationBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NotificationBestPractices
```

--------------------------------------------------------------------------------

---[FILE: scheduling.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/scheduling.ts
Signals: N/A
Excerpt (<=80 chars):  export class SchedulingBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SchedulingBestPractices
```

--------------------------------------------------------------------------------

---[FILE: scraping-and-research.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/scraping-and-research.ts
Signals: N/A
Excerpt (<=80 chars):  export class ScrapingAndResearchBestPractices implements BestPracticesDocume...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScrapingAndResearchBestPractices
```

--------------------------------------------------------------------------------

---[FILE: triage.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/best-practices/triage.ts
Signals: N/A
Excerpt (<=80 chars):  export class TriageBestPractices implements BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TriageBestPractices
```

--------------------------------------------------------------------------------

---[FILE: node-search-engine.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/engines/node-search-engine.ts
Signals: N/A
Excerpt (<=80 chars): export const SCORE_WEIGHTS = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SCORE_WEIGHTS
- NodeSearchEngine
```

--------------------------------------------------------------------------------

---[FILE: progress.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/helpers/progress.ts
Signals: N/A
Excerpt (<=80 chars): export function createProgressReporter<TToolName extends string = string>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- reportProgress
- reportError
- createBatchProgressReporter
```

--------------------------------------------------------------------------------

---[FILE: response.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/helpers/response.ts
Signals: N/A
Excerpt (<=80 chars): export function createSuccessResponse<TState = typeof WorkflowState.State>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createErrorResponse
```

--------------------------------------------------------------------------------

---[FILE: state.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/helpers/state.ts
Signals: N/A
Excerpt (<=80 chars): export function getCurrentWorkflow(state: typeof WorkflowState.State): Simple...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getCurrentWorkflow
- getWorkflowState
- getCurrentWorkflowFromTaskInput
- updateWorkflowConnections
- addNodeToWorkflow
- addNodesToWorkflow
- removeNodeFromWorkflow
- removeNodesFromWorkflow
- updateNodeInWorkflow
- addConnectionToWorkflow
- removeConnectionFromWorkflow
```

--------------------------------------------------------------------------------

---[FILE: validation.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/helpers/validation.ts
Signals: N/A
Excerpt (<=80 chars): export function validateNodeExists(nodeId: string, nodes: INode[]): INode | n...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateNodeExists
- findNodeByName
- findNodeByIdOrName
- findNodeType
- validateConnection
- createValidationError
- createNodeNotFoundError
- createNodeTypeNotFoundError
- createNodeParameterTooLargeError
- hasNodes
```

--------------------------------------------------------------------------------

---[FILE: connection-parameters.utils.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/utils/connection-parameters.utils.ts
Signals: N/A
Excerpt (<=80 chars): export const CONNECTION_AFFECTING_PARAMETERS = new Set([

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateConnectionParameters
- extractConnectionParameters
- CONNECTION_AFFECTING_PARAMETERS
```

--------------------------------------------------------------------------------

---[FILE: connection.utils.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/utils/connection.utils.ts
Signals: N/A
Excerpt (<=80 chars): export function validateConnection(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateConnection
- nodeHasOutputType
- nodeAcceptsInputType
- createConnection
- removeConnection
- getNodeConnections
- formatConnectionMessage
- inferConnectionType
```

--------------------------------------------------------------------------------

---[FILE: markdown-workflow.utils.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/utils/markdown-workflow.utils.ts
Signals: N/A
Excerpt (<=80 chars): export interface MermaidOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mermaidStringify
- processWorkflowExamples
- stickyNotesStringify
- MermaidOptions
- MermaidResult
```

--------------------------------------------------------------------------------

---[FILE: node-creation.utils.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/utils/node-creation.utils.ts
Signals: N/A
Excerpt (<=80 chars): export function generateUniqueName(baseName: string, existingNodes: INode[]):...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateUniqueName
- getLatestVersion
- generateNodeId
- generateWebhookId
- requiresWebhook
- createNodeInstance
- mergeWithDefaults
```

--------------------------------------------------------------------------------

---[FILE: node-positioning.utils.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/utils/node-positioning.utils.ts
Signals: N/A
Excerpt (<=80 chars): export const POSITIONING_CONFIG = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- calculateNodePosition
- categorizeNodes
- getNodesAtPosition
- calculateConnectedNodePosition
- POSITIONING_CONFIG
```

--------------------------------------------------------------------------------

---[FILE: parameter-update.utils.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/tools/utils/parameter-update.utils.ts
Signals: N/A
Excerpt (<=80 chars): export function extractNodeParameters(node: INode): INodeParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractNodeParameters
- mergeParameters
- updateNodeWithParameters
- formatChangesForPrompt
```

--------------------------------------------------------------------------------

---[FILE: best-practices.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/best-practices.ts
Signals: N/A
Excerpt (<=80 chars): export interface BestPracticesDocument {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BestPracticesDocument
```

--------------------------------------------------------------------------------

---[FILE: categorization.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/categorization.ts
Signals: N/A
Excerpt (<=80 chars): export const WorkflowTechnique = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowTechnique
- WorkflowTechniqueType
- PromptCategorization
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/config.ts
Signals: N/A
Excerpt (<=80 chars): export interface LLMConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LLMConfig
- ParameterUpdaterOptions
- NodePromptConfig
- PromptGenerationOptions
- PromptBuilderContext
- ToolExecutorOptions
```

--------------------------------------------------------------------------------

---[FILE: connections.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/connections.ts
Signals: N/A
Excerpt (<=80 chars): export interface ConnectionResult {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConnectionResult
- ConnectionValidationResult
- ConnectionOperationResult
- InferConnectionTypeResult
```

--------------------------------------------------------------------------------

---[FILE: coordination.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/coordination.ts
Signals: N/A
Excerpt (<=80 chars):  export type SubgraphPhase = 'discovery' | 'builder' | 'configurator' | 'stat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createDiscoveryMetadata
- createBuilderMetadata
- createConfiguratorMetadata
- createErrorMetadata
- createStateManagementMetadata
- SubgraphPhase
- CoordinationMetadata
- CoordinationLogEntry
- DiscoveryMetadata
- BuilderMetadata
- ConfiguratorMetadata
- ErrorMetadata
- StateManagementMetadata
```

--------------------------------------------------------------------------------

---[FILE: discovery-types.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/discovery-types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface DiscoveryContext {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DiscoveryContext
```

--------------------------------------------------------------------------------

---[FILE: langchain.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/langchain.ts
Signals: N/A
Excerpt (<=80 chars):  export function isAIMessage(msg: BaseMessage): msg is AIMessage {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isAIMessage
- isBaseMessage
```

--------------------------------------------------------------------------------

---[FILE: messages.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/messages.ts
Signals: N/A
Excerpt (<=80 chars): export interface QuickReplyOption {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MessageResponse
- QuickReplyOption
- AssistantChatMessage
- AssistantSummaryMessage
- EndSessionMessage
- AgentChatMessage
```

--------------------------------------------------------------------------------

---[FILE: nodes.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/nodes.ts
Signals: N/A
Excerpt (<=80 chars): export interface NodeDetails {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeDetails
- NodeSearchResult
- AddedNode
```

--------------------------------------------------------------------------------

---[FILE: sessions.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/sessions.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Session {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isLangchainMessagesArray
- LangchainMessage
- Session
```

--------------------------------------------------------------------------------

---[FILE: streaming.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/streaming.ts
Signals: N/A
Excerpt (<=80 chars): export interface AgentMessageChunk {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StreamChunk
- AgentMessageChunk
- ToolProgressChunk
- WorkflowUpdateChunk
- ExecutionRequestChunk
- StreamOutput
- StreamProcessorConfig
```

--------------------------------------------------------------------------------

---[FILE: tools.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/tools.ts
Signals: Zod
Excerpt (<=80 chars): export type ProgressUpdateType = 'input' | 'output' | 'progress' | 'error';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProgressUpdateType
- NodeConfigurationsMap
- ProgressUpdate
- ToolProgressMessage
- ToolError
- ProgressReporter
- BatchReporter
- UpdateNodeParametersOutput
- AddNodeOutput
- ConnectNodesOutput
- RemoveNodeOutput
- NodeDetailsOutput
- NodeSearchOutput
- GetNodeParameterOutput
- RemoveConnectionOutput
- CategorizePromptOutput
- WorkflowMetadata
- NodeConfigurationEntry
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/utils.ts
Signals: N/A
Excerpt (<=80 chars): export type StateUpdater<TState = typeof WorkflowState.State> =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StateUpdater
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/workflow.ts
Signals: N/A
Excerpt (<=80 chars): export type SimpleWorkflow = Pick<IWorkflowBase, 'name' | 'nodes' | 'connecti...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SimpleWorkflow
- WorkflowOperation
```

--------------------------------------------------------------------------------

---[FILE: templates.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/types/web/templates.ts
Signals: N/A
Excerpt (<=80 chars): export const categories = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- categories
- Category
- TemplateSearchQuery
- TemplateWorkflowDescription
- TemplateSearchResponse
- TemplateFetchResponse
```

--------------------------------------------------------------------------------

---[FILE: cleanup-dangling-tool-call-messages.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/cleanup-dangling-tool-call-messages.ts
Signals: N/A
Excerpt (<=80 chars): export function cleanupDanglingToolCallMessages(messages: BaseMessage[]): Rem...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cleanupDanglingToolCallMessages
```

--------------------------------------------------------------------------------

---[FILE: context-builders.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/context-builders.ts
Signals: N/A
Excerpt (<=80 chars): export function buildWorkflowSummary(workflow: SimpleWorkflow): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- buildWorkflowSummary
- buildWorkflowJsonBlock
- buildDiscoveryContextBlock
- buildExecutionContextBlock
- buildExecutionSchemaBlock
- createContextMessage
```

--------------------------------------------------------------------------------

---[FILE: coordination-log.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/coordination-log.ts
Signals: N/A
Excerpt (<=80 chars):  export type RoutingDecision = 'discovery' | 'builder' | 'configurator' | 're...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getLastCompletedPhase
- getPhaseEntry
- hasPhaseCompleted
- getConfiguratorOutput
- getBuilderOutput
- getPhaseMetadata
- hasErrorInLog
- getErrorEntry
- getNextPhaseFromLog
- summarizeCoordinationLog
- RoutingDecision
```

--------------------------------------------------------------------------------

---[FILE: http-proxy-agent.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/http-proxy-agent.ts
Signals: N/A
Excerpt (<=80 chars): export function getProxyAgent(targetUrl?: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getProxyAgent
```

--------------------------------------------------------------------------------

---[FILE: node-helpers.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/node-helpers.ts
Signals: N/A
Excerpt (<=80 chars): export function isSubNode(nodeType: INodeTypeDescription, node?: INode): bool...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isSubNode
```

--------------------------------------------------------------------------------

---[FILE: operations-processor.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/operations-processor.ts
Signals: N/A
Excerpt (<=80 chars): export function applyOperations(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- applyOperations
- processOperations
```

--------------------------------------------------------------------------------

---[FILE: state-modifier.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/state-modifier.ts
Signals: N/A
Excerpt (<=80 chars):  export type StateModificationAction =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- determineStateAction
- handleCleanupDangling
- handleDeleteMessages
- StateModificationAction
- StateModifierInput
```

--------------------------------------------------------------------------------

---[FILE: state-reducers.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/state-reducers.ts
Signals: N/A
Excerpt (<=80 chars): export function appendArrayReducer<T>(current: T[], update: T[] | undefined |...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mergeNodeConfigurations
- nodeConfigurationsReducer
```

--------------------------------------------------------------------------------

---[FILE: stream-processor.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/stream-processor.ts
Signals: N/A
Excerpt (<=80 chars):  export interface BuilderToolBase {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cleanContextTags
- processStreamChunk
- formatMessages
- DEFAULT_WORKFLOW_UPDATE_TOOLS
- StreamEvent
- BuilderToolBase
- BuilderTool
```

--------------------------------------------------------------------------------

---[FILE: subgraph-helpers.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/subgraph-helpers.ts
Signals: N/A
Excerpt (<=80 chars): export function extractUserRequest(messages: BaseMessage[], defaultValue = ''...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractUserRequest
- createStandardShouldContinue
```

--------------------------------------------------------------------------------

---[FILE: token-usage.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/token-usage.ts
Signals: N/A
Excerpt (<=80 chars):  export type AIMessageWithUsageMetadata = AIMessage & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractLastTokenUsage
- estimateTokenCountFromString
- estimateTokenCountFromMessages
- AIMessageWithUsageMetadata
- TokenUsage
```

--------------------------------------------------------------------------------

---[FILE: trim-workflow-context.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/trim-workflow-context.ts
Signals: N/A
Excerpt (<=80 chars): export function trimWorkflowJSON(workflow: SimpleWorkflow): SimpleWorkflow {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- trimWorkflowJSON
```

--------------------------------------------------------------------------------

---[FILE: workflow-validation.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/workflow-validation.ts
Signals: N/A
Excerpt (<=80 chars):  export function formatWorkflowValidation(validation: ProgrammaticChecksResul...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatWorkflowValidation
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/utils/cache-control/helpers.ts
Signals: N/A
Excerpt (<=80 chars): export function findUserToolMessageIndices(messages: BaseMessage[]): number[] {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- findUserToolMessageIndices
- cleanStaleWorkflowContext
- applyCacheControlMarkers
- applySubgraphCacheMarkers
```

--------------------------------------------------------------------------------

---[FILE: programmatic.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/programmatic.ts
Signals: N/A
Excerpt (<=80 chars):  export function programmaticValidation(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- programmaticValidation
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type ProgrammaticViolationType = 'critical' | 'major' | 'minor';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PROGRAMMATIC_VIOLATION_NAMES
- ProgrammaticViolationType
- ProgrammaticViolationName
- TelemetryValidationStatus
- ProgrammaticViolation
- SingleEvaluatorResult
- ProgrammaticChecksResult
- ProgrammaticEvaluationResult
- ProgrammaticEvaluationInput
- NodeResolvedConnectionTypesInfo
```

--------------------------------------------------------------------------------

---[FILE: agent-prompt.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/checks/agent-prompt.ts
Signals: N/A
Excerpt (<=80 chars): export function validateAgentPrompt(workflow: SimpleWorkflow): ProgrammaticVi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateAgentPrompt
```

--------------------------------------------------------------------------------

---[FILE: connections.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/checks/connections.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateConnections(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateConnections
```

--------------------------------------------------------------------------------

---[FILE: credentials.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/checks/credentials.ts
Signals: N/A
Excerpt (<=80 chars): export function validateCredentials(workflow: SimpleWorkflow): ProgrammaticVi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateCredentials
```

--------------------------------------------------------------------------------

---[FILE: from-ai.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/checks/from-ai.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateFromAi(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateFromAi
```

--------------------------------------------------------------------------------

---[FILE: nodes.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/checks/nodes.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateNodes(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateNodes
```

--------------------------------------------------------------------------------

---[FILE: tools.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/checks/tools.ts
Signals: N/A
Excerpt (<=80 chars):  export function validateTools(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateTools
```

--------------------------------------------------------------------------------

---[FILE: trigger.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/checks/trigger.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TriggerEvaluationResult extends SingleEvaluatorResult {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateTrigger
- TriggerEvaluationResult
```

--------------------------------------------------------------------------------

---[FILE: expressions.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/utils/expressions.ts
Signals: N/A
Excerpt (<=80 chars):  export function containsExpression(value: unknown): boolean {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- containsExpression
- nodeParametersContainExpression
```

--------------------------------------------------------------------------------

---[FILE: is-tool.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/utils/is-tool.ts
Signals: N/A
Excerpt (<=80 chars):  export function isTool(nodeType: INodeTypeDescription): boolean {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isTool
```

--------------------------------------------------------------------------------

---[FILE: node-type-map.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/utils/node-type-map.ts
Signals: N/A
Excerpt (<=80 chars): export function createNodeTypeMap(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createNodeTypeMap
- getNodeTypeForNode
- createNodeTypeMaps
```

--------------------------------------------------------------------------------

---[FILE: resolve-connections.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/src/validation/utils/resolve-connections.ts
Signals: N/A
Excerpt (<=80 chars): export function resolveConnections<T = INodeInputConfiguration>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- resolveNodeOutputs
- resolveNodeInputs
```

--------------------------------------------------------------------------------

---[FILE: test-utils.ts]---
Location: n8n-master/packages/@n8n/ai-workflow-builder.ee/test/test-utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockProgress = (): MockProxy<ProgressReporter> => mock<Progress...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockProgress
- mockStateHelpers
- createNode
- createWorkflow
- createNodeType
- nodeTypes
- createConnection
- mockChain
- mockParameterUpdaterChain
- expectNodeToHaveParameters
- expectConnectionToExist
- setupLangGraphMocks
- parseToolResult
- extractProgressMessages
- findProgressMessage
- createToolConfig
- createToolConfigWithWriter
- setupWorkflowState
```

--------------------------------------------------------------------------------

---[FILE: api-keys.ts]---
Location: n8n-master/packages/@n8n/api-types/src/api-keys.ts
Signals: N/A
Excerpt (<=80 chars): export type UnixTimestamp = number | null;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnixTimestamp
- ApiKey
- ApiKeyWithRawValue
- ApiKeyAudience
```

--------------------------------------------------------------------------------

---[FILE: chat-hub.ts]---
Location: n8n-master/packages/@n8n/api-types/src/chat-hub.ts
Signals: Zod
Excerpt (<=80 chars): export const chatHubLLMProviderSchema = z.enum([

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chatHubLLMProviderSchema
- agentIconOrEmojiSchema
- chatHubProviderSchema
- chatHubConversationModelSchema
- chatModelsRequestSchema
- chatAttachmentSchema
- isValidTimeZone
- StrictTimeZoneSchema
- TimeZoneSchema
- ChatHubSendMessageRequest
- ChatHubRegenerateMessageRequest
- ChatHubEditMessageRequest
- ChatHubUpdateConversationRequest
- ChatHubConversationsRequest
- ChatHubCreateAgentRequest
- ChatHubUpdateAgentRequest
- UpdateChatSettingsRequest
- ChatHubLLMProvider
```

--------------------------------------------------------------------------------

---[FILE: community-node-types.ts]---
Location: n8n-master/packages/@n8n/api-types/src/community-node-types.ts
Signals: N/A
Excerpt (<=80 chars):  export type CommunityNodeType = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommunityNodeType
```

--------------------------------------------------------------------------------

---[FILE: datetime.ts]---
Location: n8n-master/packages/@n8n/api-types/src/datetime.ts
Signals: N/A
Excerpt (<=80 chars): export type Iso8601DateTimeString = string;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Iso8601DateTimeString
```

--------------------------------------------------------------------------------

````
