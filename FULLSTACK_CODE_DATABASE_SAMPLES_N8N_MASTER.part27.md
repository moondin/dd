---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 27
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 27 of 51)

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

---[FILE: useGlobalEntityCreation.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useGlobalEntityCreation.ts
Signals: N/A
Excerpt (<=80 chars):  export const useGlobalEntityCreation = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useGlobalEntityCreation
```

--------------------------------------------------------------------------------

---[FILE: useGlobalLinkActions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useGlobalLinkActions.ts
Signals: N/A
Excerpt (<=80 chars):  export function useGlobalLinkActions() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useGlobalLinkActions
```

--------------------------------------------------------------------------------

---[FILE: useHistoryHelper.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useHistoryHelper.ts
Signals: N/A
Excerpt (<=80 chars):  export function useHistoryHelper(activeRoute: RouteLocationNormalizedLoaded) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useHistoryHelper
```

--------------------------------------------------------------------------------

---[FILE: useImportCurlCommand.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useImportCurlCommand.ts
Signals: N/A
Excerpt (<=80 chars):  export const flattenObject = <T extends Record<string, unknown>>(obj: T, pre...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sanitizeCurlUrlPlaceholders
- useImportCurlCommand
- flattenObject
- toHttpNodeParameters
```

--------------------------------------------------------------------------------

---[FILE: useIntersectionObserver.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useIntersectionObserver.ts
Signals: N/A
Excerpt (<=80 chars):  export interface UseIntersectionObserverOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useIntersectionObserver
- UseIntersectionObserverOptions
```

--------------------------------------------------------------------------------

---[FILE: useKeybindings.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useKeybindings.ts
Signals: N/A
Excerpt (<=80 chars):  export type KeyMap = Partial<Record<string, KeyboardEventHandler>>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useKeybindings
- KeyMap
```

--------------------------------------------------------------------------------

---[FILE: useLoadingService.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useLoadingService.ts
Signals: N/A
Excerpt (<=80 chars):  export function useLoadingService() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLoadingService
```

--------------------------------------------------------------------------------

---[FILE: useMessage.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useMessage.ts
Signals: N/A
Excerpt (<=80 chars):  export type MessageBoxConfirmResult = 'confirm' | 'cancel';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useMessage
- MessageBoxConfirmResult
```

--------------------------------------------------------------------------------

---[FILE: useN8nLocalStorage.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useN8nLocalStorage.ts
Signals: N/A
Excerpt (<=80 chars): export type WorkflowListPreferences = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useN8nLocalStorage
- WorkflowListPreferences
```

--------------------------------------------------------------------------------

---[FILE: useNodeConnections.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useNodeConnections.ts
Signals: N/A
Excerpt (<=80 chars):  export function useNodeConnections({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNodeConnections
```

--------------------------------------------------------------------------------

---[FILE: useNodeDirtiness.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useNodeDirtiness.ts
Signals: N/A
Excerpt (<=80 chars): export function useNodeDirtiness() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNodeDirtiness
```

--------------------------------------------------------------------------------

---[FILE: useNodeDocsUrl.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useNodeDocsUrl.ts
Signals: N/A
Excerpt (<=80 chars):  export const useNodeDocsUrl = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNodeDocsUrl
```

--------------------------------------------------------------------------------

---[FILE: useNodeHelpers.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useNodeHelpers.ts
Signals: N/A
Excerpt (<=80 chars):  export function useNodeHelpers(opts: { workflowState?: WorkflowState } = {}) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNodeHelpers
```

--------------------------------------------------------------------------------

---[FILE: useNodeType.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useNodeType.ts
Signals: N/A
Excerpt (<=80 chars):  export function useNodeType(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNodeType
```

--------------------------------------------------------------------------------

---[FILE: usePageRedirectionHelper.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/usePageRedirectionHelper.ts
Signals: N/A
Excerpt (<=80 chars):  export function usePageRedirectionHelper() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePageRedirectionHelper
```

--------------------------------------------------------------------------------

---[FILE: usePinnedData.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/usePinnedData.ts
Signals: N/A
Excerpt (<=80 chars):  export type PinDataSource =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePinnedData
- PinDataSource
- UnpinDataSource
```

--------------------------------------------------------------------------------

---[FILE: useResizablePanel.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useResizablePanel.ts
Signals: N/A
Excerpt (<=80 chars):  export function useResizablePanel(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useResizablePanel
```

--------------------------------------------------------------------------------

---[FILE: useResolvedExpression.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useResolvedExpression.ts
Signals: N/A
Excerpt (<=80 chars):  export function useResolvedExpression({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useResolvedExpression
```

--------------------------------------------------------------------------------

---[FILE: useResourcesListI18n.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useResourcesListI18n.ts
Signals: N/A
Excerpt (<=80 chars): export function useResourcesListI18n(resourceKey: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useResourcesListI18n
```

--------------------------------------------------------------------------------

---[FILE: useRunWorkflow.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useRunWorkflow.ts
Signals: N/A
Excerpt (<=80 chars):  export function useRunWorkflow(useRunWorkflowOpts: {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useRunWorkflow
```

--------------------------------------------------------------------------------

---[FILE: useSettingsItems.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useSettingsItems.ts
Signals: N/A
Excerpt (<=80 chars):  export function useSettingsItems() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSettingsItems
```

--------------------------------------------------------------------------------

---[FILE: useSidebarLayout.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useSidebarLayout.ts
Signals: N/A
Excerpt (<=80 chars):  export function useSidebarLayout() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSidebarLayout
```

--------------------------------------------------------------------------------

---[FILE: useStorage.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useStorage.ts
Signals: N/A
Excerpt (<=80 chars):  export function useStorage(key: string): Ref<string | null> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useStorage
```

--------------------------------------------------------------------------------

---[FILE: useStyles.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useStyles.ts
Signals: N/A
Excerpt (<=80 chars):  export const useStyles = () => ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useStyles
```

--------------------------------------------------------------------------------

---[FILE: useTelemetry.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useTelemetry.ts
Signals: N/A
Excerpt (<=80 chars):  export function useTelemetry(): Telemetry {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTelemetry
```

--------------------------------------------------------------------------------

---[FILE: useTelemetryContext.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useTelemetryContext.ts
Signals: N/A
Excerpt (<=80 chars): export function useTelemetryContext(overrides: TelemetryContext = {}): Teleme...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTelemetryContext
```

--------------------------------------------------------------------------------

---[FILE: useTelemetryInitializer.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useTelemetryInitializer.ts
Signals: N/A
Excerpt (<=80 chars): export function useTelemetryInitializer() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTelemetryInitializer
```

--------------------------------------------------------------------------------

---[FILE: useToast.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useToast.ts
Signals: N/A
Excerpt (<=80 chars):  export interface NotificationErrorWithNodeAndDescription extends Application...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useToast
- NotificationErrorWithNodeAndDescription
```

--------------------------------------------------------------------------------

---[FILE: useUniqueNodeName.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useUniqueNodeName.ts
Signals: N/A
Excerpt (<=80 chars):  export function useUniqueNodeName() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUniqueNodeName
```

--------------------------------------------------------------------------------

---[FILE: useUserHelpers.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useUserHelpers.ts
Signals: N/A
Excerpt (<=80 chars):  export function useUserHelpers(router: Router) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUserHelpers
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowActivate.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useWorkflowActivate.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWorkflowActivate() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowActivate
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowDiffRouting.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useWorkflowDiffRouting.ts
Signals: N/A
Excerpt (<=80 chars): export function useWorkflowDiffRouting() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowDiffRouting
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowExtraction.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useWorkflowExtraction.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWorkflowExtraction() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowExtraction
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowHelpers.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useWorkflowHelpers.ts
Signals: N/A
Excerpt (<=80 chars):  export type ResolveParameterOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- resolveRequiredParameters
- executeData
- useWorkflowHelpers
- ResolveParameterOptions
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowSaving.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useWorkflowSaving.ts
Signals: N/A
Excerpt (<=80 chars):  export function useWorkflowSaving({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowSaving
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowsCache.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useWorkflowsCache.ts
Signals: N/A
Excerpt (<=80 chars):  export type ActionType = (typeof actionTypes)[number];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowSettingsCache
- ActionType
- UserEvaluationPreferences
- WorkflowSettings
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowState.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/useWorkflowState.ts
Signals: N/A
Excerpt (<=80 chars):  export type WorkflowStateBusEvents = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowState
- injectWorkflowState
- workflowStateEventBus
- WorkflowStateBusEvents
- WorkflowState
```

--------------------------------------------------------------------------------

---[FILE: usePushConnection.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/usePushConnection/usePushConnection.ts
Signals: N/A
Excerpt (<=80 chars):  export function usePushConnection({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePushConnection
```

--------------------------------------------------------------------------------

---[FILE: executionFinished.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/composables/usePushConnection/handlers/executionFinished.ts
Signals: N/A
Excerpt (<=80 chars):  export type SimplifiedExecution = Pick<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- continueEvaluationLoop
- getRunExecutionData
- getRunDataExecutedErrorMessage
- handleExecutionFinishedWithWaitTill
- handleExecutionFinishedWithErrorOrCanceled
- handleExecutionFinishedWithSuccessOrOther
- setRunExecutionData
- SimplifiedExecution
- ExecutionFinishedOptions
```

--------------------------------------------------------------------------------

---[FILE: ai.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/ai.ts
Signals: N/A
Excerpt (<=80 chars): export const ASK_AI_MAX_PROMPT_LENGTH = 600;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ASK_AI_MAX_PROMPT_LENGTH
- ASK_AI_MIN_PROMPT_LENGTH
- ASK_AI_LOADING_DURATION_MS
- ASK_AI_SLIDE_OUT_DURATION_MS
- PLAN_APPROVAL_MESSAGE
- AI_NODES_PACKAGE_NAME
- AI_ASSISTANT_MAX_CONTENT_LENGTH
```

--------------------------------------------------------------------------------

---[FILE: auth.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/auth.ts
Signals: N/A
Excerpt (<=80 chars): export const MAIN_AUTH_FIELD_NAME = 'authentication';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MAIN_AUTH_FIELD_NAME
- NODE_RESOURCE_FIELD_NAME
- MFA_FORM
- MFA_AUTHENTICATION_REQUIRED_ERROR_CODE
- MFA_AUTHENTICATION_CODE_WINDOW_EXPIRED
- MFA_AUTHENTICATION_CODE_INPUT_MAX_LENGTH
- MFA_AUTHENTICATION_RECOVERY_CODE_INPUT_MAX_LENGTH
```

--------------------------------------------------------------------------------

---[FILE: breakpoints.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/breakpoints.ts
Signals: N/A
Excerpt (<=80 chars): export const BREAKPOINT_SM = 768;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BREAKPOINT_SM
- BREAKPOINT_MD
- BREAKPOINT_LG
- BREAKPOINT_XL
```

--------------------------------------------------------------------------------

---[FILE: curl.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/curl.ts
Signals: N/A
Excerpt (<=80 chars): export const CURL_IMPORT_NOT_SUPPORTED_PROTOCOLS = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CURL_IMPORT_NOT_SUPPORTED_PROTOCOLS
```

--------------------------------------------------------------------------------

---[FILE: durations.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/durations.ts
Signals: N/A
Excerpt (<=80 chars):  export const LOGS_EXECUTION_DATA_THROTTLE_DURATION = 1000;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LOGS_EXECUTION_DATA_THROTTLE_DURATION
- CANVAS_EXECUTION_DATA_THROTTLE_DURATION
- EXPRESSION_EDITOR_PARSER_TIMEOUT
- CLOUD_TRIAL_CHECK_INTERVAL
- TIME
- THREE_DAYS_IN_MILLIS
- SEVEN_DAYS_IN_MILLIS
- SIX_MONTHS_IN_MILLIS
```

--------------------------------------------------------------------------------

---[FILE: emails.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/emails.ts
Signals: N/A
Excerpt (<=80 chars): export const N8N_SALES_EMAIL = 'sales@n8n.io';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8N_SALES_EMAIL
- N8N_CONTACT_EMAIL
```

--------------------------------------------------------------------------------

---[FILE: events.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/events.ts
Signals: N/A
Excerpt (<=80 chars): export const MOUSE_EVENT_BUTTON = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MOUSE_EVENT_BUTTON
- MOUSE_EVENT_BUTTONS
```

--------------------------------------------------------------------------------

---[FILE: experiments.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/experiments.ts
Signals: N/A
Excerpt (<=80 chars): export const CANVAS_ZOOMED_VIEW_EXPERIMENT = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CANVAS_ZOOMED_VIEW_EXPERIMENT
- NDV_IN_FOCUS_PANEL_EXPERIMENT
- COMMAND_BAR_EXPERIMENT
- EXTRA_TEMPLATE_LINKS_EXPERIMENT
- TEMPLATE_ONBOARDING_EXPERIMENT
- BATCH_11AUG_EXPERIMENT
- PRE_BUILT_AGENTS_EXPERIMENT
- TEMPLATE_RECO_V2
- UPGRADE_PLAN_CTA_EXPERIMENT
- TEMPLATES_DATA_QUALITY_EXPERIMENT
- READY_TO_RUN_V2_EXPERIMENT
- READY_TO_RUN_V2_P3_EXPERIMENT
- PERSONALIZED_TEMPLATES_V3
- TEMPLATE_SETUP_EXPERIENCE
- AI_BUILDER_TEMPLATE_EXAMPLES_EXPERIMENT
- AI_BUILDER_MULTI_AGENT_EXPERIMENT
- EXPERIMENTS_TO_TRACK
```

--------------------------------------------------------------------------------

---[FILE: externalLinks.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/externalLinks.ts
Signals: N/A
Excerpt (<=80 chars): export const EXTERNAL_LINKS = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EXTERNAL_LINKS
```

--------------------------------------------------------------------------------

---[FILE: injectionKeys.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/injectionKeys.ts
Signals: N/A
Excerpt (<=80 chars):  export const CanvasKey = 'canvas' as unknown as InjectionKey<CanvasInjection...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CanvasKey
- CanvasNodeKey
- CanvasNodeHandleKey
```

--------------------------------------------------------------------------------

---[FILE: limits.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/limits.ts
Signals: N/A
Excerpt (<=80 chars): export const MAX_WORKFLOW_SIZE = 1024 * 1024 * 16; // Workflow size limit in ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MAX_WORKFLOW_SIZE
- MAX_EXPECTED_REQUEST_SIZE
- MAX_PINNED_DATA_SIZE
- MAX_DISPLAY_DATA_SIZE
- MAX_DISPLAY_DATA_SIZE_SCHEMA_VIEW
- MAX_DISPLAY_DATA_SIZE_LOGS_VIEW
- MAX_DISPLAY_ITEMS_AUTO_ALL
```

--------------------------------------------------------------------------------

---[FILE: localStorage.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/localStorage.ts
Signals: N/A
Excerpt (<=80 chars): export const LOCAL_STORAGE_ACTIVATION_FLAG = 'N8N_HIDE_ACTIVATION_ALERT';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LOCAL_STORAGE_ACTIVATION_FLAG
- LOCAL_STORAGE_PIN_DATA_DISCOVERY_NDV_FLAG
- LOCAL_STORAGE_PIN_DATA_DISCOVERY_CANVAS_FLAG
- LOCAL_STORAGE_MAIN_PANEL_RELATIVE_WIDTH
- LOCAL_STORAGE_NDV_DIMENSIONS
- LOCAL_STORAGE_ACTIVE_MODAL
- LOCAL_STORAGE_THEME
- LOCAL_STORAGE_EXPERIMENT_OVERRIDES
- LOCAL_STORAGE_HIDE_GITHUB_STAR_BUTTON
- LOCAL_STORAGE_LOGS_PANEL_OPEN
- LOCAL_STORAGE_TURN_OFF_WORKFLOW_SUGGESTIONS
- LOCAL_STORAGE_LOGS_SYNC_SELECTION
- LOCAL_STORAGE_LOGS_PANEL_DETAILS_PANEL
- LOCAL_STORAGE_LOGS_PANEL_DETAILS_PANEL_SUB_NODE
- LOCAL_STORAGE_WORKFLOW_LIST_PREFERENCES_KEY
- LOCAL_STORAGE_READ_WHATS_NEW_ARTICLES
- LOCAL_STORAGE_DISMISSED_WHATS_NEW_CALLOUT
- LOCAL_STORAGE_FOCUS_PANEL
```

--------------------------------------------------------------------------------

---[FILE: modals.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/modals.ts
Signals: N/A
Excerpt (<=80 chars): export const MODAL_CANCEL = 'cancel';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MODAL_CANCEL
- MODAL_CONFIRM
- MODAL_CLOSE
- ABOUT_MODAL_KEY
- CHAT_EMBED_MODAL_KEY
- CHANGE_PASSWORD_MODAL_KEY
- CONFIRM_PASSWORD_MODAL_KEY
- DUPLICATE_MODAL_KEY
- IMPORT_WORKFLOW_URL_MODAL_KEY
- VERSIONS_MODAL_KEY
- WORKFLOW_SETTINGS_MODAL_KEY
- WORKFLOW_SHARE_MODAL_KEY
- CONTACT_PROMPT_MODAL_KEY
- NODE_PINNING_MODAL_KEY
- NPS_SURVEY_MODAL_KEY
- WORKFLOW_ACTIVE_MODAL_KEY
- IMPORT_CURL_MODAL_KEY
- LOG_STREAM_MODAL_KEY
```

--------------------------------------------------------------------------------

---[FILE: navigation.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/navigation.ts
Signals: N/A
Excerpt (<=80 chars): export const enum VIEWS {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EDITABLE_CANVAS_VIEWS
```

--------------------------------------------------------------------------------

---[FILE: nodeCreator.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/nodeCreator.ts
Signals: N/A
Excerpt (<=80 chars):  export const TEMPLATE_CATEGORY_AI = 'categories/ai';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TEMPLATE_CATEGORY_AI
- CORE_NODES_CATEGORY
- HUMAN_IN_THE_LOOP_CATEGORY
- CUSTOM_NODES_CATEGORY
- DEFAULT_SUBCATEGORY
- AI_OTHERS_NODE_CREATOR_VIEW
- AI_NODE_CREATOR_VIEW
- REGULAR_NODE_CREATOR_VIEW
- TRIGGER_NODE_CREATOR_VIEW
- OTHER_TRIGGER_NODES_SUBCATEGORY
- TRANSFORM_DATA_SUBCATEGORY
- FILES_SUBCATEGORY
- FLOWS_CONTROL_SUBCATEGORY
- AI_SUBCATEGORY
- HELPERS_SUBCATEGORY
- HITL_SUBCATEGORY
- AI_CATEGORY_AGENTS
- AI_CATEGORY_CHAINS
```

--------------------------------------------------------------------------------

---[FILE: nodes.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/nodes.ts
Signals: N/A
Excerpt (<=80 chars):  export const MAIN_NODE_PANEL_WIDTH = 390;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MAIN_NODE_PANEL_WIDTH
- DEFAULT_STICKY_HEIGHT
- DEFAULT_STICKY_WIDTH
- NODE_MIN_INPUT_ITEMS_COUNT
- RUN_DATA_DEFAULT_PAGE_SIZE
```

--------------------------------------------------------------------------------

---[FILE: nodeTypes.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/nodeTypes.ts
Signals: N/A
Excerpt (<=80 chars):  export const BAMBOO_HR_NODE_TYPE = 'n8n-nodes-base.bambooHr';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BAMBOO_HR_NODE_TYPE
- CALENDLY_TRIGGER_NODE_TYPE
- CODE_NODE_TYPE
- AI_CODE_NODE_TYPE
- AI_MCP_TOOL_NODE_TYPE
- WIKIPEDIA_TOOL_NODE_TYPE
- CRON_NODE_TYPE
- CLEARBIT_NODE_TYPE
- FILTER_NODE_TYPE
- FUNCTION_NODE_TYPE
- GITHUB_TRIGGER_NODE_TYPE
- GIT_NODE_TYPE
- GOOGLE_GMAIL_NODE_TYPE
- GOOGLE_SHEETS_NODE_TYPE
- ERROR_TRIGGER_NODE_TYPE
- ELASTIC_SECURITY_NODE_TYPE
- EMAIL_SEND_NODE_TYPE
- EMAIL_IMAP_NODE_TYPE
```

--------------------------------------------------------------------------------

---[FILE: notice.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/notice.ts
Signals: N/A
Excerpt (<=80 chars): export const HIRING_BANNER = `

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HIRING_BANNER
- INSECURE_CONNECTION_WARNING
- BINARY_DATA_ACCESS_TOOLTIP
```

--------------------------------------------------------------------------------

---[FILE: parameters.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/parameters.ts
Signals: N/A
Excerpt (<=80 chars):  export const DATA_TYPE_ICON_MAP = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DATA_TYPE_ICON_MAP
- MAPPING_PARAMS
- nonExistingJsonPath
- APPEND_ATTRIBUTION_DEFAULT_PATH
- DRAG_EVENT_DATA_KEY
- CUSTOM_API_CALL_KEY
- CUSTOM_API_CALL_NAME
```

--------------------------------------------------------------------------------

---[FILE: placeholders.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/placeholders.ts
Signals: N/A
Excerpt (<=80 chars): export const PLACEHOLDER_FILLED_AT_EXECUTION_TIME = '[filled at execution tim...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PLACEHOLDER_FILLED_AT_EXECUTION_TIME
- IN_PROGRESS_EXECUTION_ID
```

--------------------------------------------------------------------------------

---[FILE: regex.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/regex.ts
Signals: N/A
Excerpt (<=80 chars): export const VALID_EMAIL_REGEX =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VALID_EMAIL_REGEX
- VALID_WORKFLOW_IMPORT_URL_REGEX
```

--------------------------------------------------------------------------------

---[FILE: samples.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/samples.ts
Signals: N/A
Excerpt (<=80 chars):  export const DUMMY_PIN_DATA = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DUMMY_PIN_DATA
- SAMPLE_SUBWORKFLOW_TRIGGER_ID
```

--------------------------------------------------------------------------------

---[FILE: sanitization.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/sanitization.ts
Signals: N/A
Excerpt (<=80 chars): export const ALLOWED_HTML_ATTRIBUTES = ['href', 'name', 'target', 'title', 'c...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ALLOWED_HTML_ATTRIBUTES
- ALLOWED_HTML_TAGS
```

--------------------------------------------------------------------------------

---[FILE: selectors.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/selectors.ts
Signals: N/A
Excerpt (<=80 chars): export const APP_MODALS_ELEMENT_ID = 'app-modals';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- APP_MODALS_ELEMENT_ID
- CODEMIRROR_TOOLTIP_CONTAINER_ELEMENT_ID
```

--------------------------------------------------------------------------------

---[FILE: templates.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/templates.ts
Signals: N/A
Excerpt (<=80 chars): export const TEMPLATES_NODES_FILTER = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TEMPLATES_NODES_FILTER
```

--------------------------------------------------------------------------------

---[FILE: urls.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/urls.ts
Signals: N/A
Excerpt (<=80 chars): export const DOCS_DOMAIN = 'docs.n8n.io';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DOCS_DOMAIN
- BUILTIN_NODES_DOCS_URL
- BUILTIN_CREDENTIALS_DOCS_URL
- DATA_PINNING_DOCS_URL
- DATA_EDITING_DOCS_URL
- SCHEMA_PREVIEW_DOCS_URL
- MFA_DOCS_URL
- NPM_PACKAGE_DOCS_BASE_URL
- N8N_QUEUE_MODE_DOCS_URL
- CUSTOM_NODES_DOCS_URL
- EXPRESSIONS_DOCS_URL
- EVALUATIONS_DOCS_URL
- ERROR_WORKFLOW_DOCS_URL
- TIME_SAVED_DOCS_URL
- N8N_PRICING_PAGE_URL
- N8N_MAIN_GITHUB_REPO_URL
- BASE_NODE_SURVEY_URL
- RELEASE_NOTES_URL
```

--------------------------------------------------------------------------------

---[FILE: workflows.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/workflows.ts
Signals: N/A
Excerpt (<=80 chars): export const PLACEHOLDER_EMPTY_WORKFLOW_ID = '__EMPTY__';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PLACEHOLDER_EMPTY_WORKFLOW_ID
- NEW_WORKFLOW_ID
- DEFAULT_NODETYPE_VERSION
- DEFAULT_NEW_WORKFLOW_NAME
- MIN_WORKFLOW_NAME_LENGTH
- MAX_WORKFLOW_NAME_LENGTH
- DUPLICATE_POSTFFIX
- NODE_OUTPUT_DEFAULT_KEY
- DEFAULT_WORKFLOW_PAGE_SIZE
- WORKFLOWS_DRAFT_PUBLISH_ENABLED_FLAG
- IS_DRAFT_PUBLISH_ENABLED
```

--------------------------------------------------------------------------------

---[FILE: workflowSuggestions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/constants/workflowSuggestions.ts
Signals: N/A
Excerpt (<=80 chars): export interface WorkflowSuggestion {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowSuggestion
```

--------------------------------------------------------------------------------

---[FILE: code-node-editor.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/event-bus/code-node-editor.ts
Signals: N/A
Excerpt (<=80 chars):  export type HighlightLineEvent = number | 'last';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- codeNodeEditorEventBus
- HighlightLineEvent
- CodeNodeEditorEventBusEvents
```

--------------------------------------------------------------------------------

---[FILE: data-pinning.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/event-bus/data-pinning.ts
Signals: N/A
Excerpt (<=80 chars):  export type DataPinningDiscoveryEvent = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- dataPinningEventBus
- DataPinningDiscoveryEvent
- UnpinNodeDataEvent
- DataPinningEventBusEvents
```

--------------------------------------------------------------------------------

---[FILE: global-link-actions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/event-bus/global-link-actions.ts
Signals: N/A
Excerpt (<=80 chars): export type LinkActionFn = (...args: any[]) => void;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- globalLinkActionsEventBus
- LinkActionFn
- RegisterCustomActionOpts
- GlobalLinkActionsEventBusEvents
```

--------------------------------------------------------------------------------

---[FILE: html-editor.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/event-bus/html-editor.ts
Signals: N/A
Excerpt (<=80 chars):  export interface HtmlEditorEventBusEvents {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- htmlEditorEventBus
- HtmlEditorEventBusEvents
```

--------------------------------------------------------------------------------

---[FILE: import-curl.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/event-bus/import-curl.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ImportCurlEventBusEvents {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- importCurlEventBus
- ImportCurlEventBusEvents
```

--------------------------------------------------------------------------------

---[FILE: node-view.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/event-bus/node-view.ts
Signals: N/A
Excerpt (<=80 chars):  export interface NodeViewEventBusEvents {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nodeViewEventBus
- NodeViewEventBusEvents
```

--------------------------------------------------------------------------------

---[FILE: history.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/models/history.ts
Signals: N/A
Excerpt (<=80 chars): export const enum COMMANDS {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- historyBus
- BulkCommand
- MoveNodeCommand
- AddNodeCommand
- RemoveNodeCommand
- AddConnectionCommand
- RemoveConnectionCommand
- EnableNodeToggleCommand
- RenameNodeCommand
- ReplaceNodeParametersCommand
```

--------------------------------------------------------------------------------

---[FILE: modalRegistry.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/moduleInitializer/modalRegistry.ts
Signals: N/A
Excerpt (<=80 chars):  export function getAll(): Map<string, ModalDefinition> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAll
- register
- unregister
- get
- getKeys
- has
- subscribe
```

--------------------------------------------------------------------------------

---[FILE: module.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/moduleInitializer/module.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type ModalDefinition = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModalDefinition
- ResourceMetadata
- FrontendModuleDescription
```

--------------------------------------------------------------------------------

---[FILE: moduleInitializer.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/moduleInitializer/moduleInitializer.ts
Signals: N/A
Excerpt (<=80 chars): export const registerModuleResources = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerModuleResources
- registerModuleProjectTabs
- registerModuleSettingsPages
- registerModuleModals
- registerModuleRoutes
```

--------------------------------------------------------------------------------

---[FILE: resourceRegistry.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/moduleInitializer/resourceRegistry.ts
Signals: N/A
Excerpt (<=80 chars): export function registerResource(metadata: ResourceMetadata): void {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- registerResource
- getResource
- hasResource
- getAllResourceKeys
```

--------------------------------------------------------------------------------

---[FILE: cache.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/plugins/cache.ts
Signals: N/A
Excerpt (<=80 chars): export type IndexedDbCache = Awaited<ReturnType<typeof indexedDbCache>>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IndexedDbCache
```

--------------------------------------------------------------------------------

---[FILE: chartjs.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/plugins/chartjs.ts
Signals: N/A
Excerpt (<=80 chars):  export const ChartJSPlugin = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChartJSPlugin
```

--------------------------------------------------------------------------------

---[FILE: sentry.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/plugins/sentry.ts
Signals: N/A
Excerpt (<=80 chars):  export function beforeSend(event: Sentry.ErrorEvent, { originalException }: ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- beforeSend
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/plugins/telemetry/index.ts
Signals: N/A
Excerpt (<=80 chars):  export class Telemetry {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- telemetry
```

--------------------------------------------------------------------------------

---[FILE: telemetry.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/plugins/telemetry/telemetry.types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IUserNodesPanelSession {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IUserNodesPanelSession
- RudderStack
```

--------------------------------------------------------------------------------

---[FILE: useEventSourceClient.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/push-connection/useEventSourceClient.ts
Signals: N/A
Excerpt (<=80 chars):  export type UseEventSourceClientOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useEventSourceClient
- UseEventSourceClientOptions
```

--------------------------------------------------------------------------------

---[FILE: useHeartbeat.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/push-connection/useHeartbeat.ts
Signals: N/A
Excerpt (<=80 chars):  export type UseHeartbeatOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useHeartbeat
- UseHeartbeatOptions
```

--------------------------------------------------------------------------------

---[FILE: useReconnectTimer.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/push-connection/useReconnectTimer.ts
Signals: N/A
Excerpt (<=80 chars): export const useReconnectTimer = ({ onAttempt, onAttemptScheduled }: UseRecon...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useReconnectTimer
```

--------------------------------------------------------------------------------

---[FILE: useWebSocketClient.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/push-connection/useWebSocketClient.ts
Signals: N/A
Excerpt (<=80 chars): export type UseWebSocketClientOptions<T> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebSocketState
- useWebSocketClient
- UseWebSocketClientOptions
```

--------------------------------------------------------------------------------

---[FILE: mockEventSource.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/push-connection/__tests__/mockEventSource.ts
Signals: N/A
Excerpt (<=80 chars): export class MockEventSource extends EventTarget {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockEventSource
```

--------------------------------------------------------------------------------

````
