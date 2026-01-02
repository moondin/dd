---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 30
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 30 of 51)

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

---[FILE: useLogsSelection.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/composables/useLogsSelection.ts
Signals: N/A
Excerpt (<=80 chars):  export function useLogsSelection(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLogsSelection
```

--------------------------------------------------------------------------------

---[FILE: useLogsTreeExpand.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/composables/useLogsTreeExpand.ts
Signals: N/A
Excerpt (<=80 chars):  export function useLogsTreeExpand(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLogsTreeExpand
```

--------------------------------------------------------------------------------

---[FILE: usePopOutWindow.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/composables/usePopOutWindow.ts
Signals: N/A
Excerpt (<=80 chars): export function usePopOutWindow({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePopOutWindow
```

--------------------------------------------------------------------------------

---[FILE: data.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/__test__/data.ts
Signals: N/A
Excerpt (<=80 chars):  export function createTestLogTreeCreationContext(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTestLogTreeCreationContext
- nodeTypes
- chatTriggerNode
- manualTriggerNode
- aiAgentNode
- aiModelNode
- aiManualWorkflow
- aiChatWorkflow
```

--------------------------------------------------------------------------------

---[FILE: mocks.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/__test__/mocks.ts
Signals: N/A
Excerpt (<=80 chars):  export function createTestLogEntry(data: Partial<LogEntry> = {}): LogEntry {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTestLogEntry
```

--------------------------------------------------------------------------------

---[FILE: externalSecrets.ee.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/integrations/externalSecrets.ee/externalSecrets.ee.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useExternalSecretsStore = defineStore('externalSecrets', () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExternalSecretsStore
```

--------------------------------------------------------------------------------

---[FILE: externalSecrets.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/integrations/externalSecrets.ee/externalSecrets.types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ExternalSecretsProviderSecret {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalSecretsProviderData
- ExternalSecretsProviderProperty
- ExternalSecretsProviderState
- ExternalSecretsProviderSecret
- ExternalSecretsProvider
```

--------------------------------------------------------------------------------

---[FILE: useExternalSecretsProvider.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/integrations/externalSecrets.ee/composables/useExternalSecretsProvider.ts
Signals: N/A
Excerpt (<=80 chars):  export function useExternalSecretsProvider(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExternalSecretsProvider
```

--------------------------------------------------------------------------------

---[FILE: logStreaming.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/integrations/logStreaming.ee/logStreaming.constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const circuitBreakerOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- circuitBreakerOptions
- webhookModalDescription
- syslogModalDescription
- sentryModalDescription
```

--------------------------------------------------------------------------------

---[FILE: logStreaming.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/integrations/logStreaming.ee/logStreaming.store.ts
Signals: N/A
Excerpt (<=80 chars):  export interface EventSelectionItem {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLogStreamingStore
- EventSelectionItem
- DestinationSettingsStore
```

--------------------------------------------------------------------------------

---[FILE: logStreaming.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/integrations/logStreaming.ee/logStreaming.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function destinationToFakeINodeUi(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- destinationToFakeINodeUi
```

--------------------------------------------------------------------------------

---[FILE: sourceControl.api.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/integrations/sourceControl.ee/sourceControl.api.ts
Signals: N/A
Excerpt (<=80 chars):  export const pushWorkfolder = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- pushWorkfolder
- pullWorkfolder
- getBranches
- savePreferences
- updatePreferences
- getPreferences
- getStatus
- getRemoteWorkflow
- getAggregatedStatus
- disconnect
- generateKeyPair
```

--------------------------------------------------------------------------------

---[FILE: sourceControl.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/integrations/sourceControl.ee/sourceControl.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const SOURCE_CONTROL_PUSH_MODAL_KEY = 'sourceControlPush';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SOURCE_CONTROL_PUSH_MODAL_KEY
- SOURCE_CONTROL_PULL_MODAL_KEY
```

--------------------------------------------------------------------------------

---[FILE: sourceControl.eventBus.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/integrations/sourceControl.ee/sourceControl.eventBus.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SourceControlEventBusEvents {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sourceControlEventBus
- SourceControlEventBusEvents
```

--------------------------------------------------------------------------------

---[FILE: sourceControl.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/integrations/sourceControl.ee/sourceControl.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useSourceControlStore = defineStore('sourceControl', () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSourceControlStore
```

--------------------------------------------------------------------------------

---[FILE: sourceControl.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/integrations/sourceControl.ee/sourceControl.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type SshKeyTypes = ['ed25519', 'rsa'];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SshKeyTypes
- SourceControlPreferences
- SourceControlStatus
```

--------------------------------------------------------------------------------

---[FILE: sourceControl.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/integrations/sourceControl.ee/sourceControl.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const getStatusText = (status: SourceControlledFileStatus) =>

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getStatusText
- getStatusTheme
- getPullPriorityByStatus
- getPushPriorityByStatus
- notifyUserAboutPullWorkFolderOutcome
```

--------------------------------------------------------------------------------

---[FILE: useNdvLayout.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/panel/composables/useNdvLayout.ts
Signals: N/A
Excerpt (<=80 chars):  export function useNdvLayout(options: UseNdvLayoutOptions) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNdvLayout
```

--------------------------------------------------------------------------------

---[FILE: ParameterInputList.test.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/components/ParameterInputList.test.constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const TEST_PARAMETERS: INodeProperties[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TEST_ISSUE
```

--------------------------------------------------------------------------------

---[FILE: theme.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/components/ExpressionEditorModal/theme.ts
Signals: N/A
Excerpt (<=80 chars):  export const inputTheme = (isReadOnly = false) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- inputTheme
- outputTheme
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/components/FilterConditions/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const DEFAULT_MAX_CONDITIONS = 10;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_MAX_CONDITIONS
- OPERATORS_BY_ID
- OPERATORS
- FilterOperatorId
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/components/FilterConditions/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface FilterOperator extends FilterOperatorValue {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConditionResult
- FilterOperator
- FilterOperatorGroup
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/components/FilterConditions/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const getFilterOperator = (key: string) =>

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getFilterOperator
- handleOperatorChange
- isEmptyInput
- resolveCondition
- operatorTypeToNodeProperty
- inferOperatorType
```

--------------------------------------------------------------------------------

---[FILE: ResourceMapper.test.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/components/ResourceMapper/ResourceMapper.test.constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const WORKFLOW_INPUTS_TEST_PARAMETER_PATH = 'parameters.workflowInputs';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WORKFLOW_INPUTS_TEST_PARAMETER_PATH
```

--------------------------------------------------------------------------------

---[FILE: ResourceMapper.test.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/components/ResourceMapper/ResourceMapper.test.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const NODE_PARAMETER_VALUES = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getLatestValueChangeEvent
- NODE_PARAMETER_VALUES
- UPDATED_SCHEMA
```

--------------------------------------------------------------------------------

---[FILE: useNodeSpecificationValues.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/composables/useNodeSpecificationValues.ts
Signals: N/A
Excerpt (<=80 chars):  export function useNodeSpecificationValues(typeOptions: INodePropertyTypeOpt...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNodeSpecificationValues
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowResourceLocatorDropdown.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/composables/useWorkflowResourceLocatorDropdown.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWorkflowResourceLocatorDropdown(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowResourceLocatorDropdown
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowResourceLocatorModes.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/composables/useWorkflowResourceLocatorModes.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWorkflowResourceLocatorModes(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowResourceLocatorModes
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowResourcesLocator.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/composables/useWorkflowResourcesLocator.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWorkflowResourcesLocator(router: Router) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowResourcesLocator
```

--------------------------------------------------------------------------------

---[FILE: assignmentCollection.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/utils/assignmentCollection.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function inferAssignmentType(value: unknown): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- inferAssignmentType
- typeFromExpression
- inputDataToAssignments
```

--------------------------------------------------------------------------------

---[FILE: buttonParameter.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/utils/buttonParameter.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export type TextareaRowData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getParentNodes
- getSchemas
- reducePayloadSizeOrThrow
- getUpdatedTextareaValue
- getTextareaCursorPosition
- TextareaRowData
```

--------------------------------------------------------------------------------

---[FILE: fromAIOverride.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/parameters/utils/fromAIOverride.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export type OverrideContext = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- updateFromAIOverrideValues
- isFromAIOverrideValue
- buildUniqueName
- buildValueFromOverride
- parseOverrides
- canBeContentOverride
- makeOverrideValue
- OverrideContext
- FromAIOverride
```

--------------------------------------------------------------------------------

---[FILE: schemaPreview.api.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/runData/schemaPreview.api.ts
Signals: N/A
Excerpt (<=80 chars):  export type GetSchemaPreviewOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSchemaPreview
- GetSchemaPreviewOptions
```

--------------------------------------------------------------------------------

---[FILE: schemaPreview.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/runData/schemaPreview.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useSchemaPreviewStore = defineStore('schemaPreview', () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSchemaPreviewStore
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/runData/components/ai/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function getReferencedData(taskData: ITaskData): IAiDataContent[] {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getReferencedData
- createHtmlFragmentWithSearchHighlight
- createSearchHighlightPlugin
```

--------------------------------------------------------------------------------

---[FILE: useNodeSettingsParameters.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/settings/composables/useNodeSettingsParameters.ts
Signals: N/A
Excerpt (<=80 chars):  export function useNodeSettingsParameters() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNodeSettingsParameters
```

--------------------------------------------------------------------------------

---[FILE: ndv.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/shared/ndv.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const LOCAL_STORAGE_MAPPING_IS_ONBOARDED = 'N8N_MAPPING_ONBOARDED';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LOCAL_STORAGE_MAPPING_IS_ONBOARDED
- LOCAL_STORAGE_AUTOCOMPLETE_IS_ONBOARDED
- LOCAL_STORAGE_TABLE_HOVER_IS_ONBOARDED
- LOCAL_STORAGE_NDV_INPUT_PANEL_DISPLAY_MODE
- LOCAL_STORAGE_NDV_OUTPUT_PANEL_DISPLAY_MODE
- LOCAL_STORAGE_NDV_PANEL_WIDTH
```

--------------------------------------------------------------------------------

---[FILE: ndv.eventBus.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/shared/ndv.eventBus.ts
Signals: N/A
Excerpt (<=80 chars):  export type Position = 'minLeft' | 'maxRight' | 'initial';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ndvEventBus
- Position
- CreateNewCredentialOpts
- NdvEventBusEvents
```

--------------------------------------------------------------------------------

---[FILE: ndv.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/shared/ndv.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useNDVStore = defineStore(STORES.NDV, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNDVStore
```

--------------------------------------------------------------------------------

---[FILE: ndv.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/shared/ndv.types.ts
Signals: N/A
Excerpt (<=80 chars): export type InputPanel = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InputPanel
- OutputPanel
- NodePanelType
- MainPanelType
- MainPanelDimensions
```

--------------------------------------------------------------------------------

---[FILE: ndv.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ndv/shared/ndv.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function getNodeSettingsInitialValues(): INodeParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getNodeSettingsInitialValues
- setValue
- updateDynamicConnections
- removeMismatchedOptionValues
- updateParameterByPath
- isResourceLocatorParameterType
- isValidParameterOption
- mustHideDuringCustomApiCall
- nameIsParameter
- formatAsExpression
- parseFromExpression
- shouldSkipParamValidation
- createCommonNodeSettings
- collectSettings
- collectParametersByTab
```

--------------------------------------------------------------------------------

---[FILE: useCredentialResolvers.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/resolvers/composables/useCredentialResolvers.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ModalCallbacks {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCredentialResolvers
- ModalCallbacks
```

--------------------------------------------------------------------------------

---[FILE: apiKeys.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/apiKeys/apiKeys.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const API_KEY_CREATE_OR_EDIT_MODAL_KEY = 'createOrEditApiKey';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- API_KEY_CREATE_OR_EDIT_MODAL_KEY
```

--------------------------------------------------------------------------------

---[FILE: apiKeys.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/apiKeys/apiKeys.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useApiKeysStore = defineStore(STORES.API_KEYS, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useApiKeysStore
```

--------------------------------------------------------------------------------

---[FILE: communityNodes.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/communityNodes/communityNodes.constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const COMMUNITY_PACKAGE_INSTALL_MODAL_KEY = 'communityPackageInstall';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- COMMUNITY_PACKAGE_INSTALL_MODAL_KEY
- COMMUNITY_PACKAGE_CONFIRM_MODAL_KEY
- COMMUNITY_NODES_INSTALLATION_DOCS_URL
- COMMUNITY_NODES_RISKS_DOCS_URL
- COMMUNITY_NODES_BLOCKLIST_DOCS_URL
- NPM_KEYWORD_SEARCH_URL
- COMMUNITY_PACKAGE_MANAGE_ACTIONS
```

--------------------------------------------------------------------------------

---[FILE: communityNodes.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/communityNodes/communityNodes.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useCommunityNodesStore = defineStore(STORES.COMMUNITY_NODES, ()...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCommunityNodesStore
```

--------------------------------------------------------------------------------

---[FILE: communityNodes.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/communityNodes/communityNodes.types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface CommunityPackageMap {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommunityPackageMap
```

--------------------------------------------------------------------------------

---[FILE: communityNodes.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/communityNodes/communityNodes.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export type ExtendedPublicInstalledPackage = PublicInstalledPackage & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExtendedPublicInstalledPackage
```

--------------------------------------------------------------------------------

---[FILE: useInstalledCommunityPackage.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/communityNodes/composables/useInstalledCommunityPackage.ts
Signals: N/A
Excerpt (<=80 chars):  export function useInstalledCommunityPackage(nodeTypeName?: MaybeRefOrGetter...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useInstalledCommunityPackage
```

--------------------------------------------------------------------------------

---[FILE: useInstallNode.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/communityNodes/composables/useInstallNode.ts
Signals: N/A
Excerpt (<=80 chars):  export function useInstallNode() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useInstallNode
```

--------------------------------------------------------------------------------

---[FILE: environments.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/environments.ee/environments.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const VARIABLE_MODAL_KEY = 'variableModal';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VARIABLE_MODAL_KEY
```

--------------------------------------------------------------------------------

---[FILE: environments.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/environments.ee/environments.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useEnvironmentsStore = defineStore('environments', () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEnvironmentsStore
```

--------------------------------------------------------------------------------

---[FILE: environments.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/environments.ee/environments.types.ts
Signals: N/A
Excerpt (<=80 chars): export interface EnvironmentVariable {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EnvironmentVariable
- CreateEnvironmentVariable
- UpdateEnvironmentVariable
```

--------------------------------------------------------------------------------

---[FILE: variables.completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/environments.ee/completions/variables.completions.ts
Signals: N/A
Excerpt (<=80 chars):  export const addVarType = (option: Completion) => ({ ...option, type: 'varia...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useVariablesCompletions
- addVarType
```

--------------------------------------------------------------------------------

---[FILE: orchestration.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/orchestration.ee/orchestration.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const WORKER_HISTORY_LENGTH = 100;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WORKER_HISTORY_LENGTH
- useOrchestrationStore
- IOrchestrationStoreState
- IWorkerHistoryItem
```

--------------------------------------------------------------------------------

---[FILE: orchestration.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/orchestration.ee/orchestration.utils.ts
Signals: N/A
Excerpt (<=80 chars): export function averageWorkerLoadFromLoads(loads: number[]): number {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- averageWorkerLoadFromLoads
- averageWorkerLoadFromLoadsAsString
- memAsGb
- memAsMb
```

--------------------------------------------------------------------------------

---[FILE: sso.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/sso/sso.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const SupportedProtocols = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SupportedProtocols
- useSSOStore
- SupportedProtocolType
```

--------------------------------------------------------------------------------

---[FILE: useAccessSettingsCsvExport.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/sso/provisioning/composables/useAccessSettingsCsvExport.ts
Signals: N/A
Excerpt (<=80 chars):  export function useAccessSettingsCsvExport() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useAccessSettingsCsvExport
```

--------------------------------------------------------------------------------

---[FILE: userRoleProvisioning.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/sso/provisioning/composables/userRoleProvisioning.store.ts
Signals: N/A
Excerpt (<=80 chars): export const useUserRoleProvisioningStore = defineStore('userRoleProvisioning...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUserRoleProvisioningStore
```

--------------------------------------------------------------------------------

---[FILE: useUserRoleProvisioningForm.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/sso/provisioning/composables/useUserRoleProvisioningForm.ts
Signals: N/A
Excerpt (<=80 chars): export function useUserRoleProvisioningForm(protocol: SupportedProtocolType) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUserRoleProvisioningForm
```

--------------------------------------------------------------------------------

---[FILE: usage.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/usage/usage.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const COMMUNITY_PLUS_ENROLLMENT_MODAL = 'communityPlusEnrollment';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- COMMUNITY_PLUS_ENROLLMENT_MODAL
- COMMUNITY_PLUS_DOCS_URL
```

--------------------------------------------------------------------------------

---[FILE: usage.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/usage/usage.store.ts
Signals: N/A
Excerpt (<=80 chars):  export type UsageTelemetry = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUsageStore
- UsageTelemetry
```

--------------------------------------------------------------------------------

---[FILE: users.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/users/users.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const DELETE_USER_MODAL_KEY = 'deleteUser';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DELETE_USER_MODAL_KEY
- INVITE_USER_MODAL_KEY
- PERSONALIZATION_MODAL_KEY
- EMAIL_KEY
- WORK_AREA_KEY
- FINANCE_WORK_AREA
- IT_ENGINEERING_WORK_AREA
- PRODUCT_WORK_AREA
- SALES_BUSINESSDEV_WORK_AREA
- SECURITY_WORK_AREA
- COMPANY_TYPE_KEY
- SAAS_COMPANY_TYPE
- ECOMMERCE_COMPANY_TYPE
- EDUCATION_TYPE
- MSP_COMPANY_TYPE
- DIGITAL_AGENCY_COMPANY_TYPE
- SYSTEMS_INTEGRATOR_COMPANY_TYPE
- OTHER_COMPANY_TYPE
```

--------------------------------------------------------------------------------

---[FILE: users.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/users/users.store.ts
Signals: N/A
Excerpt (<=80 chars):  export type LoginHook = (user: CurrentUserResponse) => void | Promise<void>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUsersStore
- LoginHook
```

--------------------------------------------------------------------------------

---[FILE: users.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/users/users.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type ILogInStatus = 'LoggedIn' | 'LoggedOut';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ILogInStatus
- InvitableRoleName
- IInviteResponse
- IUserListAction
```

--------------------------------------------------------------------------------

---[FILE: users.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/settings/users/users.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const LOGIN_STATUS: { LoggedIn: ILogInStatus; LoggedOut: ILogInStatus...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getPersonalizedNodeTypes
- isUserGlobalOwner
```

--------------------------------------------------------------------------------

---[FILE: banners.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/banners/banners.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useBannersStore = defineStore(STORES.BANNERS, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useBannersStore
```

--------------------------------------------------------------------------------

---[FILE: banners.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/banners/banners.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type N8nBanners = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nBanners
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type { CommandBarItem };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CommandBarEventHandlers
- CommandGroup
```

--------------------------------------------------------------------------------

---[FILE: useChatHubCommands.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useChatHubCommands.ts
Signals: N/A
Excerpt (<=80 chars):  export function useChatHubCommands(options: {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useChatHubCommands
```

--------------------------------------------------------------------------------

---[FILE: useCommandBar.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useCommandBar.ts
Signals: N/A
Excerpt (<=80 chars):  export function useCommandBar() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCommandBar
```

--------------------------------------------------------------------------------

---[FILE: useCredentialNavigationCommands.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useCredentialNavigationCommands.ts
Signals: N/A
Excerpt (<=80 chars):  export function useCredentialNavigationCommands(options: {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCredentialNavigationCommands
```

--------------------------------------------------------------------------------

---[FILE: useDataTableNavigationCommands.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useDataTableNavigationCommands.ts
Signals: N/A
Excerpt (<=80 chars):  export function useDataTableNavigationCommands(options: {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDataTableNavigationCommands
```

--------------------------------------------------------------------------------

---[FILE: useExecutionCommands.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useExecutionCommands.ts
Signals: N/A
Excerpt (<=80 chars):  export function useExecutionCommands(): CommandGroup {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExecutionCommands
```

--------------------------------------------------------------------------------

---[FILE: useExecutionNavigationCommands.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useExecutionNavigationCommands.ts
Signals: N/A
Excerpt (<=80 chars):  export function useExecutionNavigationCommands(): CommandGroup {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExecutionNavigationCommands
```

--------------------------------------------------------------------------------

---[FILE: useGenericCommands.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useGenericCommands.ts
Signals: N/A
Excerpt (<=80 chars):  export function useGenericCommands(): CommandGroup {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useGenericCommands
```

--------------------------------------------------------------------------------

---[FILE: useNodeCommands.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useNodeCommands.ts
Signals: N/A
Excerpt (<=80 chars):  export function useNodeCommands(options: {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNodeCommands
```

--------------------------------------------------------------------------------

---[FILE: useProjectNavigationCommands.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useProjectNavigationCommands.ts
Signals: N/A
Excerpt (<=80 chars):  export function useProjectNavigationCommands(options: {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useProjectNavigationCommands
```

--------------------------------------------------------------------------------

---[FILE: useRecentResources.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useRecentResources.ts
Signals: N/A
Excerpt (<=80 chars):  export function useRecentResources() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useRecentResources
```

--------------------------------------------------------------------------------

---[FILE: useTemplateCommands.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useTemplateCommands.ts
Signals: N/A
Excerpt (<=80 chars):  export function useTemplateCommands(): CommandGroup {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTemplateCommands
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowCommands.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useWorkflowCommands.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWorkflowCommands(): CommandGroup {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowCommands
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowNavigationCommands.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/commandBar/composables/useWorkflowNavigationCommands.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWorkflowNavigationCommands(options: {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowNavigationCommands
```

--------------------------------------------------------------------------------

---[FILE: useContextMenu.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/contextMenu/composables/useContextMenu.ts
Signals: N/A
Excerpt (<=80 chars):  export type ContextMenuTarget =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useContextMenu
- ContextMenuTarget
- ContextMenuActionCallback
```

--------------------------------------------------------------------------------

---[FILE: useContextMenuItems.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/contextMenu/composables/useContextMenuItems.ts
Signals: N/A
Excerpt (<=80 chars):  export type ContextMenuAction =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useContextMenuItems
- ContextMenuAction
```

--------------------------------------------------------------------------------

---[FILE: completer.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/completer.ts
Signals: N/A
Excerpt (<=80 chars):  export const useCompleter = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCompleter
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const NODE_TYPES_EXCLUDED_FROM_AUTOCOMPLETION = [STICKY_NODE_TYPE];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NODE_TYPES_EXCLUDED_FROM_AUTOCOMPLETION
- AUTOCOMPLETABLE_BUILT_IN_MODULES_JS
- DEFAULT_LINTER_DELAY_IN_MS
- OFFSET_FOR_SCRIPT_WRAPPER
```

--------------------------------------------------------------------------------

---[FILE: linter.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/shared/editors/components/CodeNodeEditor/linter.ts
Signals: N/A
Excerpt (<=80 chars):  export const useLinter = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLinter
```

--------------------------------------------------------------------------------

````
