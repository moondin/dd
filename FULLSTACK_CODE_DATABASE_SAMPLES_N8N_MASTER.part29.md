---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 29
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 29 of 51)

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

---[FILE: chat.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/chatHub/chat.types.ts
Signals: Zod
Excerpt (<=80 chars):  export interface UserMessage {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- credentialsMapSchema
- chatHubConversationModelWithCachedDisplayNameSchema
- StreamChunk
- CredentialsMap
- ChatHubConversationModelWithCachedDisplayName
- UserMessage
- AssistantMessage
- ErrorMessage
- ChatMessage
- ChatConversation
- StreamOutput
- NodeStreamingState
- GroupedConversations
- ChatAgentFilter
- ChatStreamingState
- FlattenedModel
- FetchOptions
```

--------------------------------------------------------------------------------

---[FILE: chat.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/chatHub/chat.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function getRelativeDate(now: Date, dateString: string): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getRelativeDate
- groupConversationsByDate
- getAgentRoute
- flattenModel
- unflattenModel
- filterAndSortAgents
- stringifyModel
- fromStringToModel
- isMatchedAgent
- createAiMessageFromStreamingState
- buildUiMessages
- isLlmProvider
- isLlmProviderModel
- findOneFromModelsResponse
- createSessionFromStreamingState
- createMimeTypes
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/chatHub/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const CHAT_VIEW = 'chat';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CHAT_VIEW
- CHAT_CONVERSATION_VIEW
- CHAT_WORKFLOW_AGENTS_VIEW
- CHAT_PERSONAL_AGENTS_VIEW
- CHAT_SETTINGS_VIEW
- CHAT_STORE
- CHAT_SESSIONS_PAGE_SIZE
- MOBILE_MEDIA_QUERY
- TOOLS_SELECTOR_MODAL_KEY
- AGENT_EDITOR_MODAL_KEY
- CHAT_CREDENTIAL_SELECTOR_MODAL_KEY
- CHAT_MODEL_BY_ID_SELECTOR_MODAL_KEY
- CHAT_PROVIDER_SETTINGS_MODAL_KEY
```

--------------------------------------------------------------------------------

---[FILE: availableTools.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/chatHub/composables/availableTools.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ChatHubToolProvider {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChatHubToolProvider
```

--------------------------------------------------------------------------------

---[FILE: useChatCredentials.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/chatHub/composables/useChatCredentials.ts
Signals: N/A
Excerpt (<=80 chars): export function useChatCredentials(userId: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useChatCredentials
```

--------------------------------------------------------------------------------

---[FILE: useChatHubMarkdownOptions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/chatHub/composables/useChatHubMarkdownOptions.ts
Signals: N/A
Excerpt (<=80 chars):  export function useChatHubMarkdownOptions(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useChatHubMarkdownOptions
```

--------------------------------------------------------------------------------

---[FILE: useCustomAgent.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/chatHub/composables/useCustomAgent.ts
Signals: N/A
Excerpt (<=80 chars):  export function useCustomAgent(agentId?: MaybeRef<string | undefined>) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCustomAgent
```

--------------------------------------------------------------------------------

---[FILE: useFileDrop.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/chatHub/composables/useFileDrop.ts
Signals: N/A
Excerpt (<=80 chars):  export function useFileDrop(canAcceptFiles: Ref<boolean>, onFilesDropped: (f...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFileDrop
```

--------------------------------------------------------------------------------

---[FILE: data.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/chatHub/__test__/data.ts
Signals: N/A
Excerpt (<=80 chars):  export function createTestChatMessage(overrides: Partial<ChatMessage> = {}):...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTestChatMessage
```

--------------------------------------------------------------------------------

---[FILE: evaluation.api.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/evaluation.ee/evaluation.api.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TestRunRecord {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getTestRuns
- getTestRun
- startTestRun
- cancelTestRun
- deleteTestRun
- getTestCaseExecutions
- TestRunRecord
- TestCaseExecutionRecord
```

--------------------------------------------------------------------------------

---[FILE: evaluation.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/evaluation.ee/evaluation.constants.ts
Signals: N/A
Excerpt (<=80 chars):  export type TestCaseExecutionErrorCodes =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getErrorBaseKey
- TestCaseExecutionErrorCodes
- TestRunErrorCode
```

--------------------------------------------------------------------------------

---[FILE: evaluation.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/evaluation.ee/evaluation.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useEvaluationStore = defineStore(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEvaluationStore
```

--------------------------------------------------------------------------------

---[FILE: evaluation.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/evaluation.ee/evaluation.types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface EditableField<T = string> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EditableField
- EditableFormState
- EvaluationFormState
```

--------------------------------------------------------------------------------

---[FILE: evaluation.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/evaluation.ee/evaluation.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const SHORT_TABLE_CELL_MIN_WIDTH = 125;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDefaultOrderedColumns
- applyCachedVisibility
- applyCachedSortOrder
- getTestCasesColumns
- getTestTableHeaders
- SHORT_TABLE_CELL_MIN_WIDTH
```

--------------------------------------------------------------------------------

---[FILE: useMetricsChart.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/evaluation.ee/composables/useMetricsChart.ts
Signals: N/A
Excerpt (<=80 chars):  export function useMetricsChart() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useMetricsChart
```

--------------------------------------------------------------------------------

---[FILE: mcp.api.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/mcpAccess/mcp.api.ts
Signals: N/A
Excerpt (<=80 chars):  export type McpSettingsResponse = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- McpSettingsResponse
```

--------------------------------------------------------------------------------

---[FILE: mcp.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/mcpAccess/mcp.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const MCP_ENDPOINT = 'mcp-server/http';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MCP_ENDPOINT
- MCP_DOCS_PAGE_URL
- ELIGIBLE_WORKFLOWS_DOCS_SECTION
- MCP_SETTINGS_VIEW
- MCP_STORE
- LOADING_INDICATOR_TIMEOUT
- MCP_TOOLTIP_DELAY
- MCP_CONNECT_POPOVER_WIDTH
- MCP_CONNECT_WORKFLOWS_MODAL_KEY
```

--------------------------------------------------------------------------------

---[FILE: mcp.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/mcpAccess/mcp.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useMCPStore = defineStore(MCP_STORE, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useMCPStore
```

--------------------------------------------------------------------------------

---[FILE: mcp.test.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/mcpAccess/mcp.test.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const createHomeProject = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createHomeProject
- createParentFolder
- createWorkflow
- createOAuthClient
```

--------------------------------------------------------------------------------

---[FILE: useMcp.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/mcpAccess/composables/useMcp.ts
Signals: N/A
Excerpt (<=80 chars):  export function useMcp() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useMcp
```

--------------------------------------------------------------------------------

---[FILE: collaboration.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/collaboration/collaboration/collaboration.store.ts
Signals: N/A
Excerpt (<=80 chars): export const useCollaborationStore = defineStore(STORES.COLLABORATION, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCollaborationStore
```

--------------------------------------------------------------------------------

---[FILE: projects.api.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/collaboration/projects/projects.api.ts
Signals: N/A
Excerpt (<=80 chars):  export const getAllProjects = async (context: IRestApiContext): Promise<Proj...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAllProjects
- getMyProjects
- getPersonalProject
- getProject
- createProject
- updateProject
- deleteProject
- getProjectsCount
- addProjectMembers
- updateProjectMemberRole
- deleteProjectMember
```

--------------------------------------------------------------------------------

---[FILE: projects.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/collaboration/projects/projects.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const PROJECT_MOVE_RESOURCE_MODAL = 'projectMoveResourceModal';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PROJECT_MOVE_RESOURCE_MODAL
```

--------------------------------------------------------------------------------

---[FILE: projects.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/collaboration/projects/projects.store.ts
Signals: N/A
Excerpt (<=80 chars):  export type ResourceCounts = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useProjectsStore
- ResourceCounts
```

--------------------------------------------------------------------------------

---[FILE: projects.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/collaboration/projects/projects.types.ts
Signals: N/A
Excerpt (<=80 chars):  export const ProjectTypes = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProjectTypes
- ProjectType
- ProjectRelation
- ProjectMemberData
- ProjectSharingData
- Project
- ProjectListItem
- ProjectsCount
```

--------------------------------------------------------------------------------

---[FILE: projects.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/collaboration/projects/projects.utils.ts
Signals: N/A
Excerpt (<=80 chars): export const splitName = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- splitName
- MAX_NAME_LENGTH
- getTruncatedProjectName
```

--------------------------------------------------------------------------------

---[FILE: useProjectPages.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/collaboration/projects/composables/useProjectPages.ts
Signals: N/A
Excerpt (<=80 chars): export const useProjectPages = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useProjectPages
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/collaboration/projects/__tests__/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const createProjectSharingData = (projectType?: ProjectType): Project...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTestProject
- createProjectSharingData
- createProjectListItem
```

--------------------------------------------------------------------------------

---[FILE: auth.eventBus.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/auth/auth.eventBus.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ConfirmPasswordClosedEventPayload {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- confirmPasswordEventBus
- mfaEventBus
- promptMfaCodeBus
- ConfirmPasswordClosedEventPayload
- ConfirmPasswordModalEvents
- MfaModalClosedEventPayload
- MfaModalEvents
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const DATA_TABLE_VIEW = 'data-tables';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DATA_TABLE_VIEW
- PROJECT_DATA_TABLES
- DATA_TABLE_DETAILS
- DATA_TABLE_STORE
- DEFAULT_DATA_TABLE_PAGE_SIZE
- DATA_TABLE_ID_COLUMN_WIDTH
- DEFAULT_COLUMN_WIDTH
- DATA_TABLE_HEADER_HEIGHT
- DATA_TABLE_ROW_HEIGHT
- ADD_ROW_ROW_ID
- DATA_TABLE_CARD_ACTIONS
- ADD_DATA_TABLE_MODAL_KEY
- DEFAULT_ID_COLUMN_NAME
- MAX_COLUMN_NAME_LENGTH
- COLUMN_NAME_REGEX
- MIN_LOADING_TIME
- NULL_VALUE
- EMPTY_VALUE
```

--------------------------------------------------------------------------------

---[FILE: dataTable.api.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/dataTable.api.ts
Signals: N/A
Excerpt (<=80 chars):  export const fetchDataTablesApi = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fetchDataTablesApi
- createDataTableApi
- deleteDataTableApi
- updateDataTableApi
- addDataTableColumnApi
- deleteDataTableColumnApi
- moveDataTableColumnApi
- renameDataTableColumnApi
- getDataTableRowsApi
- insertDataTableRowApi
- updateDataTableRowsApi
- deleteDataTableRowsApi
- fetchDataTableGlobalLimitInBytes
- downloadDataTableCsvApi
- uploadCsvFileApi
```

--------------------------------------------------------------------------------

---[FILE: dataTable.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/dataTable.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useDataTableStore = defineStore(DATA_TABLE_STORE, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDataTableStore
```

--------------------------------------------------------------------------------

---[FILE: dataTable.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/dataTable.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type DataTable = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DATA_TABLE_COLUMN_TYPES
- AG_GRID_CELL_TYPES
- DataTable
- DataTableColumnType
- AGGridCellType
- DataTableColumn
- DataTableColumnCreatePayload
- DataTableValue
- DataTableRow
- AddColumnResponse
```

--------------------------------------------------------------------------------

---[FILE: typeGuards.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/typeGuards.ts
Signals: N/A
Excerpt (<=80 chars):  export const isDataTableValue = (value: unknown): value is DataTableValue => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isDataTableValue
- isAGGridCellType
- isDataTableColumnType
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/types.ts
Signals: N/A
Excerpt (<=80 chars): export type DataTableResource = BaseResource &

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataTableResource
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/utils.ts
Signals: N/A
Excerpt (<=80 chars): export const reorderItem = <T extends { index: number }>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- reorderItem
```

--------------------------------------------------------------------------------

---[FILE: n8nTheme.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/components/dataGrid/n8nTheme.ts
Signals: N/A
Excerpt (<=80 chars):  export const n8nTheme = themeQuartz.withPart(iconSetAlpine).withParams({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- n8nTheme
```

--------------------------------------------------------------------------------

---[FILE: registerAgGridModulesOnce.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/components/dataGrid/registerAgGridModulesOnce.ts
Signals: N/A
Excerpt (<=80 chars):  export const registerAgGridModulesOnce = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerAgGridModulesOnce
```

--------------------------------------------------------------------------------

---[FILE: useAgGrid.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/composables/useAgGrid.ts
Signals: N/A
Excerpt (<=80 chars):  export type UseAgGridOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useAgGrid
- UseAgGridOptions
```

--------------------------------------------------------------------------------

---[FILE: useDataTableColumnFilters.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/composables/useDataTableColumnFilters.ts
Signals: N/A
Excerpt (<=80 chars):  export type UseDataTableColumnFiltersParams = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDataTableColumnFilters
- UseDataTableColumnFiltersParams
```

--------------------------------------------------------------------------------

---[FILE: useDataTableColumns.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/composables/useDataTableColumns.ts
Signals: N/A
Excerpt (<=80 chars):  export const useDataTableColumns = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDataTableColumns
```

--------------------------------------------------------------------------------

---[FILE: useDataTableOperations.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/composables/useDataTableOperations.ts
Signals: N/A
Excerpt (<=80 chars):  export type UseDataTableOperationsParams = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDataTableOperations
- UseDataTableOperationsParams
```

--------------------------------------------------------------------------------

---[FILE: useDataTablePagination.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/composables/useDataTablePagination.ts
Signals: N/A
Excerpt (<=80 chars):  export type PageSize = 10 | 20 | 50;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDataTablePagination
- PageSize
- UseDataTablePaginationOptions
```

--------------------------------------------------------------------------------

---[FILE: useDataTableSelection.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/composables/useDataTableSelection.ts
Signals: N/A
Excerpt (<=80 chars):  export const useDataTableSelection = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDataTableSelection
```

--------------------------------------------------------------------------------

---[FILE: useDataTableTypes.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/composables/useDataTableTypes.ts
Signals: N/A
Excerpt (<=80 chars):  export const useDataTableTypes = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDataTableTypes
```

--------------------------------------------------------------------------------

---[FILE: useDatePickerCommon.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/composables/useDatePickerCommon.ts
Signals: N/A
Excerpt (<=80 chars):  export interface DatePickerCallbacks {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDatePickerCommon
- DatePickerCallbacks
```

--------------------------------------------------------------------------------

---[FILE: dataTableFilters.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/types/dataTableFilters.types.ts
Signals: N/A
Excerpt (<=80 chars): export type BackendFilterCondition = 'eq' | 'neq' | 'ilike' | 'gt' | 'gte' | ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BackendFilterCondition
- BackendFilterRecord
- BackendFilter
- FilterOperation
- FilterModel
```

--------------------------------------------------------------------------------

---[FILE: columnUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/utils/columnUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export const getCellClass = (params: CellClassParams): string => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getCellClass
- createValueGetter
- createCellRendererSelector
- createStringValueSetter
- stringCellEditorParams
- dateValueFormatter
- numberValueFormatter
- getStringColumnFilterOptions
- getDateColumnFilterOptions
- getNumberColumnFilterOptions
- getBooleanColumnFilterOptions
```

--------------------------------------------------------------------------------

---[FILE: filterMappings.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/utils/filterMappings.ts
Signals: N/A
Excerpt (<=80 chars):  export const SPECIAL_COLUMNS = [DEFAULT_ID_COLUMN_NAME, 'add-column', 'ag-Gr...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapTextTypeToBackend
- mapNumberDateTypeToBackend
- SPECIAL_COLUMNS
- MAX_CONDITIONS
- GRID_FILTER_CONFIG
```

--------------------------------------------------------------------------------

---[FILE: filterProcessors.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/utils/filterProcessors.ts
Signals: N/A
Excerpt (<=80 chars):  export function processTextFilter(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- processTextFilter
- processNumberFilter
- processDateFilter
```

--------------------------------------------------------------------------------

---[FILE: typeUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/dataTable/utils/typeUtils.ts
Signals: N/A
Excerpt (<=80 chars): export const parseLooseDateInput = (text: string): Date | null => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseLooseDateInput
- areValuesEqual
```

--------------------------------------------------------------------------------

---[FILE: folders.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/folders/folders.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const ILLEGAL_FOLDER_CHARACTERS = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ILLEGAL_FOLDER_CHARACTERS
- FOLDER_NAME_ILLEGAL_CHARACTERS_REGEX
- FOLDER_NAME_ONLY_DOTS_REGEX
- FOLDER_NAME_MAX_LENGTH
- DELETE_FOLDER_MODAL_KEY
- MOVE_FOLDER_MODAL_KEY
- FOLDER_LIST_ITEM_ACTIONS
```

--------------------------------------------------------------------------------

---[FILE: folders.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/folders/folders.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useFoldersStore = defineStore(STORES.FOLDERS, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFoldersStore
```

--------------------------------------------------------------------------------

---[FILE: folders.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/folders/folders.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type DragTarget = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DragTarget
- DropTarget
- FolderShortInfo
- BaseFolderItem
- ResourceParentFolder
- FolderPathItem
- FolderCreateResponse
- FolderTreeResponseItem
- FolderListItem
- ChangeLocationSearchResponseItem
- ChangeLocationSearchResult
```

--------------------------------------------------------------------------------

---[FILE: useFolders.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/folders/composables/useFolders.ts
Signals: N/A
Excerpt (<=80 chars):  export function isDropTarget(target: DragTarget | DropTarget): target is Dro...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isDropTarget
- isValidResourceType
- useFolders
```

--------------------------------------------------------------------------------

---[FILE: useParentFolder.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/core/folders/composables/useParentFolder.ts
Signals: N/A
Excerpt (<=80 chars):  export function useParentFolder() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useParentFolder
```

--------------------------------------------------------------------------------

---[FILE: credentials.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/credentials/credentials.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const CREDENTIAL_EDIT_MODAL_KEY = 'editCredential';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CREDENTIAL_EDIT_MODAL_KEY
- CREDENTIAL_SELECT_MODAL_KEY
```

--------------------------------------------------------------------------------

---[FILE: credentials.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/credentials/credentials.store.ts
Signals: N/A
Excerpt (<=80 chars):  export type CredentialsStore = ReturnType<typeof useCredentialsStore>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCredentialsStore
- listenForCredentialChanges
- CredentialsStore
```

--------------------------------------------------------------------------------

---[FILE: credentials.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/credentials/credentials.types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ICredentialsResponse extends ICredentialsEncrypted {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ICredentialsResponse
- IUsedCredential
- ICredentialsBase
- ICredentialsDecryptedResponse
- ICredentialTypeMap
- ICredentialMap
- ICredentialsState
- IShareCredentialsPayload
```

--------------------------------------------------------------------------------

---[FILE: CredentialPicker.test.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/credentials/components/CredentialPicker/CredentialPicker.test.constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const TEST_CREDENTIALS: ICredentialMap = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PERSONAL_OPENAI_CREDENTIAL
- PROJECT_OPENAI_CREDENTIAL
- GLOBAL_OPENAI_CREDENTIAL
```

--------------------------------------------------------------------------------

---[FILE: useNodeCredentialOptions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/credentials/composables/useNodeCredentialOptions.ts
Signals: N/A
Excerpt (<=80 chars):  export interface CredentialDropdownOption extends ICredentialsResponse {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNodeCredentialOptions
- CredentialDropdownOption
```

--------------------------------------------------------------------------------

---[FILE: executions.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/executions/executions.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const DEBUG_PAYWALL_MODAL_KEY = 'debugPaywall';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEBUG_PAYWALL_MODAL_KEY
```

--------------------------------------------------------------------------------

---[FILE: executions.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/executions/executions.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useExecutionsStore = defineStore('executions', () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExecutionsStore
```

--------------------------------------------------------------------------------

---[FILE: executions.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/executions/executions.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type ExecutionFilterMetadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionFilterMetadata
- ExecutionFilterVote
- ExecutionFilterType
- ExecutionsQueryFilter
- ExecutionSummaryWithScopes
- IExecutionBase
- IExecutionFlatted
- IExecutionFlattedResponse
- IExecutionPushResponse
- IExecutionResponse
- IExecutionsListResponse
- IExecutionsCurrentSummaryExtended
- IExecutionsStopData
- IExecutionDeleteFilter
```

--------------------------------------------------------------------------------

---[FILE: executions.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/executions/executions.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function getDefaultExecutionFilters(): ExecutionFilterType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDefaultExecutionFilters
- isTrimmedNodeExecutionData
- isTrimmedTaskData
- hasTrimmedTaskData
- hasTrimmedRunData
- executionRetryMessage
- getExecutionErrorMessage
- getExecutionErrorToastConfiguration
- unflattenExecutionData
- findTriggerNodeToAutoSelect
- executionFilterToQueryFilter
- openFormPopupWindow
- clearPopupWindowState
- waitingNodeTooltip
```

--------------------------------------------------------------------------------

---[FILE: useExecutionData.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/executions/composables/useExecutionData.ts
Signals: N/A
Excerpt (<=80 chars):  export function useExecutionData({ node }: { node: ComputedRef<INode | undef...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExecutionData
```

--------------------------------------------------------------------------------

---[FILE: useExecutionDebugging.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/executions/composables/useExecutionDebugging.ts
Signals: N/A
Excerpt (<=80 chars):  export const useExecutionDebugging = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExecutionDebugging
```

--------------------------------------------------------------------------------

---[FILE: useExecutionHelpers.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/executions/composables/useExecutionHelpers.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IExecutionUIData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useExecutionHelpers
- IExecutionUIData
```

--------------------------------------------------------------------------------

---[FILE: chartjs.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/insights/chartjs.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const generateLinearGradient = (ctx: CanvasRenderingContext2D, height...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateLinearGradient
- generateLineChartOptions
- generateBarChartOptions
```

--------------------------------------------------------------------------------

---[FILE: insights.api.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/insights/insights.api.ts
Signals: N/A
Excerpt (<=80 chars):  export function serializeInsightsFilter<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fetchInsightsSummary
- fetchInsightsByTime
- fetchInsightsTimeSaved
- fetchInsightsByWorkflow
```

--------------------------------------------------------------------------------

---[FILE: insights.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/insights/insights.constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const INSIGHT_TYPES = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- INSIGHT_TYPES
- INSIGHT_IMPACT_TYPES
- GRANULARITY_DATE_FORMAT_MASK
```

--------------------------------------------------------------------------------

---[FILE: insights.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/insights/insights.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useInsightsStore = defineStore('insights', () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useInsightsStore
```

--------------------------------------------------------------------------------

---[FILE: insights.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/insights/insights.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type InsightsSummaryDisplay = Array<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InsightsSummaryDisplay
```

--------------------------------------------------------------------------------

---[FILE: insights.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/insights/insights.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const transformInsightsTimeSaved = (minutes: number): number =>

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- transformInsightsTimeSaved
- transformInsightsAverageRunTime
- transformInsightsFailureRate
- transformInsightsSummary
- getTimeRangeLabels
- formatDateRange
- getMatchingPreset
```

--------------------------------------------------------------------------------

---[FILE: insightChartProps.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/insights/components/charts/insightChartProps.ts
Signals: N/A
Excerpt (<=80 chars):  export type ChartProps = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChartProps
```

--------------------------------------------------------------------------------

---[FILE: logs.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/logs.constants.ts
Signals: N/A
Excerpt (<=80 chars): export const LOCAL_STORAGE_PANEL_HEIGHT = 'N8N_CANVAS_CHAT_HEIGHT';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LOCAL_STORAGE_PANEL_HEIGHT
- LOCAL_STORAGE_PANEL_WIDTH
- LOCAL_STORAGE_OVERVIEW_PANEL_WIDTH
- LOGS_PANEL_STATE
- LOG_DETAILS_PANEL_STATE
```

--------------------------------------------------------------------------------

---[FILE: logs.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/logs.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type LogEntry = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LogEntry
- LogEntrySelection
- LogsPanelState
- LogDetailsPanelState
- LogTreeCreationContext
- LatestNodeInfo
- LogTreeFilter
```

--------------------------------------------------------------------------------

---[FILE: logs.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/logs.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function getConsumedTokens(task: Array<INodeExecutionData | null>): L...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getConsumedTokens
- getTreeNodeData
- getTotalConsumedTokens
- getSubtreeTotalConsumedTokens
- createLogTree
- findLogEntryById
- findLogEntryRec
- findSelectedLogEntry
- flattenLogEntries
- getEntryAtRelativeIndex
- mergeStartData
- hasSubExecution
- findSubExecutionLocator
- getDefaultCollapsedEntries
- getDepth
- getInputKey
- extractBotResponse
- restoreChatHistory
```

--------------------------------------------------------------------------------

---[FILE: useChatMessaging.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/composables/useChatMessaging.ts
Signals: N/A
Excerpt (<=80 chars):  export type RunWorkflowChatPayload = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useChatMessaging
- RunWorkflowChatPayload
- ChatMessagingDependencies
```

--------------------------------------------------------------------------------

---[FILE: useChatState.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/composables/useChatState.ts
Signals: N/A
Excerpt (<=80 chars):  export function useChatState(isReadOnly: boolean): ChatState {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useChatState
```

--------------------------------------------------------------------------------

---[FILE: useClearExecutionButtonVisible.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/composables/useClearExecutionButtonVisible.ts
Signals: N/A
Excerpt (<=80 chars):  export function useClearExecutionButtonVisible() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useClearExecutionButtonVisible
```

--------------------------------------------------------------------------------

---[FILE: useLogsExecutionData.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/composables/useLogsExecutionData.ts
Signals: N/A
Excerpt (<=80 chars):  export function useLogsExecutionData({ isEnabled, filter }: UseLogsExecution...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLogsExecutionData
```

--------------------------------------------------------------------------------

---[FILE: useLogsPanelLayout.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/execution/logs/composables/useLogsPanelLayout.ts
Signals: N/A
Excerpt (<=80 chars):  export function useLogsPanelLayout(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLogsPanelLayout
```

--------------------------------------------------------------------------------

````
