---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 28
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 28 of 51)

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

---[FILE: mockWebSocketClient.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/push-connection/__tests__/mockWebSocketClient.ts
Signals: N/A
Excerpt (<=80 chars): export class MockWebSocket extends EventTarget {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockWebSocket
```

--------------------------------------------------------------------------------

---[FILE: canvas.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/canvas.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useCanvasStore = defineStore('canvas', () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCanvasStore
```

--------------------------------------------------------------------------------

---[FILE: cloudPlan.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/cloudPlan.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useCloudPlanStore = defineStore(STORES.CLOUD_PLAN, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useCloudPlanStore
```

--------------------------------------------------------------------------------

---[FILE: consent.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/consent.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useConsentStore = defineStore(STORES.CONSENT, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useConsentStore
```

--------------------------------------------------------------------------------

---[FILE: focusPanel.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/focusPanel.store.ts
Signals: N/A
Excerpt (<=80 chars):  export type RichFocusedNodeParameter = FocusedNodeParameter & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useFocusPanelStore
- RichFocusedNodeParameter
```

--------------------------------------------------------------------------------

---[FILE: history.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/history.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useHistoryStore = defineStore(STORES.HISTORY, {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useHistoryStore
```

--------------------------------------------------------------------------------

---[FILE: logs.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/logs.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useLogsStore = defineStore('logs', () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useLogsStore
```

--------------------------------------------------------------------------------

---[FILE: nodeTypes.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/nodeTypes.store.ts
Signals: N/A
Excerpt (<=80 chars):  export type NodeTypesStore = ReturnType<typeof useNodeTypesStore>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useNodeTypesStore
- NodeTypesStore
```

--------------------------------------------------------------------------------

---[FILE: npsSurvey.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/npsSurvey.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const MAXIMUM_TIMES_TO_SHOW_SURVEY_IF_IGNORED = 3;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MAXIMUM_TIMES_TO_SHOW_SURVEY_IF_IGNORED
- useNpsSurveyStore
```

--------------------------------------------------------------------------------

---[FILE: posthog.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/posthog.store.ts
Signals: N/A
Excerpt (<=80 chars):  export type PosthogStore = ReturnType<typeof usePostHog>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePostHog
- PosthogStore
```

--------------------------------------------------------------------------------

---[FILE: pushConnection.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/pushConnection.store.ts
Signals: N/A
Excerpt (<=80 chars):  export type OnPushMessageHandler = (event: PushMessage) => void;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePushConnectionStore
- OnPushMessageHandler
```

--------------------------------------------------------------------------------

---[FILE: rbac.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/rbac.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useRBACStore = defineStore(STORES.RBAC, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useRBACStore
```

--------------------------------------------------------------------------------

---[FILE: roles.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/roles.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useRolesStore = defineStore('roles', () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useRolesStore
```

--------------------------------------------------------------------------------

---[FILE: settings.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/settings.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useSettingsStore = defineStore(STORES.SETTINGS, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSettingsStore
```

--------------------------------------------------------------------------------

---[FILE: ui.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/ui.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useUIStore = defineStore(STORES.UI, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useUIStore
- listenForModalChanges
```

--------------------------------------------------------------------------------

---[FILE: ui.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/ui.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function applyThemeToBody(theme: ThemeOption, window_?: Window) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- applyThemeToBody
- isValidTheme
- getThemeOverride
```

--------------------------------------------------------------------------------

---[FILE: versions.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/versions.store.ts
Signals: N/A
Excerpt (<=80 chars): export const SEMVER_REGEX =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SEMVER_REGEX
- useVersionsStore
```

--------------------------------------------------------------------------------

---[FILE: webhooks.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/webhooks.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useWebhooksStore = defineStore(STORES.WEBHOOKS, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWebhooksStore
```

--------------------------------------------------------------------------------

---[FILE: workflows.ee.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/workflows.ee.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useWorkflowsEEStore = defineStore(STORES.WORKFLOWS_EE, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowsEEStore
```

--------------------------------------------------------------------------------

---[FILE: workflows.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/workflows.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useWorkflowsStore = defineStore(STORES.WORKFLOWS, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowsStore
```

--------------------------------------------------------------------------------

---[FILE: workflowState.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/workflowState.store.ts
Signals: N/A
Excerpt (<=80 chars): export const useWorkflowStateStore = defineStore(STORES.WORKFLOW_STATE, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowStateStore
```

--------------------------------------------------------------------------------

---[FILE: cloudStoreUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/stores/__tests__/utils/cloudStoreUtils.ts
Signals: N/A
Excerpt (<=80 chars): export function getUserCloudInfo(confirmed: boolean): Cloud.UserAccount {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getUserCloudInfo
- getTrialingUserResponse
- getTrialExpiredUserResponse
- getNotTrialingUserResponse
```

--------------------------------------------------------------------------------

---[FILE: completions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/types/completions.ts
Signals: N/A
Excerpt (<=80 chars): export type Word = { from: number; to: number; text: string };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Word
```

--------------------------------------------------------------------------------

---[FILE: expressions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/types/expressions.ts
Signals: N/A
Excerpt (<=80 chars):  export type RawSegment = { text: string; token: string } & Range;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RawSegment
- Segment
- Plaintext
- Html
- ResolvableState
- Resolvable
- Resolved
- Value
- ExpressionLocalResolveContext
```

--------------------------------------------------------------------------------

---[FILE: externalHooks.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/types/externalHooks.ts
Signals: N/A
Excerpt (<=80 chars): export interface ExternalHooksMethod<T = any, R = void> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalHooksKey
- ExtractExternalHooksMethodPayloadFromKey
- ExternalHooksMethod
- ExternalHooksGenericContext
- ExternalHooks
```

--------------------------------------------------------------------------------

---[FILE: nodeSettings.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/types/nodeSettings.ts
Signals: N/A
Excerpt (<=80 chars): export type NodeSettingsTab =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeSettingsTab
```

--------------------------------------------------------------------------------

---[FILE: pushConnection.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/types/pushConnection.ts
Signals: N/A
Excerpt (<=80 chars):  export type PushMessageQueueItem = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PushMessageQueueItem
```

--------------------------------------------------------------------------------

---[FILE: rbac.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/types/rbac.ts
Signals: N/A
Excerpt (<=80 chars):  export type AuthenticatedPermissionOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthenticatedPermissionOptions
- CustomPermissionOptions
- DefaultUserMiddlewareOptions
- InstanceOwnerMiddlewareOptions
- EnterprisePermissionOptions
- GuestPermissionOptions
- RBACPermissionOptions
- RolePermissionOptions
- PermissionType
- PermissionTypeOptions
- RBACPermissionCheck
```

--------------------------------------------------------------------------------

---[FILE: router.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/types/router.ts
Signals: N/A
Excerpt (<=80 chars):  export type RouterMiddlewareType = Exclude<PermissionType, 'instanceOwner'>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RouterMiddlewareType
- CustomMiddlewareOptions
- MiddlewareOptions
- RouterMiddlewareReturnType
- RouterMiddleware
```

--------------------------------------------------------------------------------

---[FILE: telemetry.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/types/telemetry.ts
Signals: N/A
Excerpt (<=80 chars):  export type TelemetryNdvType = 'ndv' | 'focus_panel' | 'zoomed_view';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TelemetryNdvType
- TelemetryNdvSource
- TelemetryContext
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/types/utils.ts
Signals: N/A
Excerpt (<=80 chars): export type RecursivePartial<T> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RecursivePartial
```

--------------------------------------------------------------------------------

---[FILE: aiUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/aiUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export type ParsedAiContent = Array<{

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseAiContent
- addTokenUsageData
- formatTokenUsageCount
- isChatNode
- ParsedAiContent
```

--------------------------------------------------------------------------------

---[FILE: credentialOnlyNodes.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/credentialOnlyNodes.ts
Signals: N/A
Excerpt (<=80 chars):  export function isCredentialOnlyNodeType(nodeTypeName: string): boolean {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isCredentialOnlyNodeType
- getCredentialTypeName
- getCredentialOnlyNodeTypeName
- getCredentialOnlyNodeType
```

--------------------------------------------------------------------------------

---[FILE: eventUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/eventUtils.ts
Signals: N/A
Excerpt (<=80 chars): export function isMiddleMouseButton(event: MouseEvent) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isMiddleMouseButton
```

--------------------------------------------------------------------------------

---[FILE: expressions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/expressions.ts
Signals: N/A
Excerpt (<=80 chars):  export const isEmptyExpression = (expr: string) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isEmptyExpression
- unwrapExpression
- removeExpressionPrefix
- isTestableExpression
- isNoExecDataExpressionError
- isNoNodeExecDataExpressionError
- isPairedItemIntermediateNodesError
- isPairedItemNoConnectionError
- isInvalidPairedItemError
- isNoPairedItemError
- isNoInputConnectionError
- isAnyPairedItemError
- getResolvableState
- getExpressionErrorMessage
- stringifyExpressionResult
- completeExpressionSyntax
- shouldConvertToExpression
```

--------------------------------------------------------------------------------

---[FILE: forceParse.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/forceParse.ts
Signals: N/A
Excerpt (<=80 chars):  export const ignoreUpdateAnnotation = Annotation.define<boolean>();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- forceParse
- ignoreUpdateAnnotation
```

--------------------------------------------------------------------------------

---[FILE: htmlUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/htmlUtils.ts
Signals: N/A
Excerpt (<=80 chars): export function sanitizeHtml(dirtyHtml: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sanitizeHtml
- isOutsideSelected
- getScrollbarWidth
- isEventTargetContainedBy
- sanitizeIfString
- capitalizeFirstLetter
- getBannerRowHeight
```

--------------------------------------------------------------------------------

---[FILE: json-schema.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/json-schema.ts
Signals: N/A
Excerpt (<=80 chars): export function generateJsonSchema(json: unknown): JSONSchema7 {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateJsonSchema
```

--------------------------------------------------------------------------------

---[FILE: mappingUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/mappingUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export function generatePath(root: string, path: Array<string | number>): st...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generatePath
- escapeMappingString
- getMappedExpression
- getNodeParentExpression
- propertyNameFromExpression
- getMappedResult
```

--------------------------------------------------------------------------------

---[FILE: nodeIcon.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/nodeIcon.ts
Signals: N/A
Excerpt (<=80 chars): export type NodeIconSource = BaseNodeIconSource & { badge?: BaseNodeIconSourc...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getNodeIconSource
- getNodeIcon
- getNodeIconUrl
- getBadgeIconUrl
- NodeIconSource
- NodeIconType
- IconNodeType
```

--------------------------------------------------------------------------------

---[FILE: nodeTypesUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/nodeTypesUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export function getAppNameFromCredType(name: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAppNameFromCredType
- getAppNameFromNodeName
- getTriggerNodeServiceName
- getActivatableTriggerNodes
- filterTemplateNodes
- hasExpressionMapping
- isValueExpression
- executionDataToJson
- hasOnlyListMode
- isRequiredCredential
- getMainAuthField
- getNodeAuthOptions
- getAllNodeCredentialForAuthType
- getNodeCredentialForSelectedAuthType
- getAuthTypeForNodeCredential
- isAuthRelatedParameter
- getNodeAuthFields
- isNodeFieldMatchingNodeVersion
```

--------------------------------------------------------------------------------

---[FILE: nodeViewUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/nodeViewUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export const GRID_SIZE = 16;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- snapPositionToGrid
- calculateElementIntersection
- isElementIntersection
- getGenericHints
- generateOffsets
- getBounds
- updateViewportToContainNodes
- calculateNodeSize
- GRID_SIZE
- CONFIGURATION_NODE_RADIUS
- DEFAULT_START_POSITION_X
- DEFAULT_START_POSITION_Y
- HEADER_HEIGHT
- PUSH_NODES_OFFSET
- getLeftmostTopNode
- getLeftMostNode
- getTopMostNode
- getRightMostNode
```

--------------------------------------------------------------------------------

---[FILE: objectUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/objectUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export function isDateObject(maybeDate: unknown): maybeDate is Date {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isDateObject
- isObjectOrArray
- isObject
- searchInObject
- getObjectSizeInKB
```

--------------------------------------------------------------------------------

---[FILE: pairedItemUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/pairedItemUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export const MAX_ITEM_COUNT_FOR_PAIRING = 1000;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getPairedItemId
- getSourceItems
- getPairedItemsMapping
- MAX_ITEM_COUNT_FOR_PAIRING
```

--------------------------------------------------------------------------------

---[FILE: parameterUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/parameterUtils.ts
Signals: N/A
Excerpt (<=80 chars): export function setParameterValue(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setParameterValue
```

--------------------------------------------------------------------------------

---[FILE: rbacUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/rbacUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export function inferProjectIdFromRoute(to: RouteLocationNormalized): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- inferProjectIdFromRoute
- inferResourceTypeFromRoute
- inferResourceIdFromRoute
```

--------------------------------------------------------------------------------

---[FILE: stringUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/stringUtils.ts
Signals: N/A
Excerpt (<=80 chars): export function splitTextBySearch(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- splitTextBySearch
```

--------------------------------------------------------------------------------

---[FILE: telemetryUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/telemetryUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export function createExpressionTelemetryPayload(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createExpressionTelemetryPayload
```

--------------------------------------------------------------------------------

---[FILE: typeGuards.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/typeGuards.ts
Signals: N/A
Excerpt (<=80 chars):  export const checkExhaustive = (value: never): never => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isValidCredentialResponse
- isString
- isNumber
- isDateObject
- isValidNodeConnectionType
- isValidCanvasConnectionMode
- isVueFlowConnection
- isTriggerPanelObject
- isFullExecutionResponse
- isRouteLocationRaw
- isComponentPublicInstance
- isWorkflowResource
- isFolderResource
- isVariableResource
- isCredentialsResource
- isSharedResource
- isResourceSortableByDate
- isBaseTextKey
```

--------------------------------------------------------------------------------

---[FILE: typeHelpers.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/typeHelpers.ts
Signals: N/A
Excerpt (<=80 chars): export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PartialBy
- TupleToUnion
```

--------------------------------------------------------------------------------

---[FILE: typesUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/typesUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export const omit = (keyToOmit: string, { [keyToOmit]: _, ...remainder }) =>...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isJsonKeyObject
- abbreviateNumber
- convertToDisplayDate
- convertToHumanReadableDate
- stringSizeInBytes
- toMegaBytes
- shorten
- isFocusableEl
- isBlurrableEl
- isSelectableEl
- hasFocusOnInput
- omit
- isEmpty
- intersection
- convertPath
- clearJsonKey
- isValidDate
- getObjectKeys
```

--------------------------------------------------------------------------------

---[FILE: workflowUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/workflowUtils.ts
Signals: N/A
Excerpt (<=80 chars): export function removeWorkflowExecutionData(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- removeWorkflowExecutionData
```

--------------------------------------------------------------------------------

---[FILE: dateFormatter.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/formatters/dateFormatter.ts
Signals: N/A
Excerpt (<=80 chars):  export const convertToDisplayDateComponents = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- convertToDisplayDate
- convertToDisplayDateComponents
- toDayMonth
- toTime
- formatTimeAgo
```

--------------------------------------------------------------------------------

---[FILE: listFormatter.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/formatters/listFormatter.ts
Signals: N/A
Excerpt (<=80 chars): export const formatList = <T>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatList
```

--------------------------------------------------------------------------------

---[FILE: textFormatter.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/formatters/textFormatter.ts
Signals: N/A
Excerpt (<=80 chars): export const truncateTextToFitWidth = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- truncateTextToFitWidth
```

--------------------------------------------------------------------------------

---[FILE: tabUtils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/modules/tabUtils.ts
Signals: N/A
Excerpt (<=80 chars):  export type DynamicTabOptions = TabOptions<string> & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- processDynamicTab
- processDynamicTabs
- DynamicTabOptions
```

--------------------------------------------------------------------------------

---[FILE: nodeTransforms.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/nodes/nodeTransforms.ts
Signals: N/A
Excerpt (<=80 chars): export function getNodeTypeDisplayableCredentials(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getNodeTypeDisplayableCredentials
- doesNodeHaveCredentialsToFill
- hasNodeCredentialFilled
- doesNodeHaveAllCredentialsFilled
- needsAgentInput
- getParameterDisplayableOptions
```

--------------------------------------------------------------------------------

---[FILE: nodeTypeTransforms.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/nodeTypes/nodeTypeTransforms.ts
Signals: N/A
Excerpt (<=80 chars):  export type NodeTypeProvider = Pick<NodeTypesStore, 'getNodeType'>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getNodeVersions
- groupNodeTypesByNameAndType
- NodeTypeProvider
```

--------------------------------------------------------------------------------

---[FILE: permissions.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/rbac/permissions.ts
Signals: N/A
Excerpt (<=80 chars):  export const permissions: Permissions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasPermission
```

--------------------------------------------------------------------------------

---[FILE: nodeTypeTestData.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/utils/testData/nodeTypeTestData.ts
Signals: N/A
Excerpt (<=80 chars):  export const nodeTypeTwitter = mock<INodeTypeDescription>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nodeTypeTwitter
- nodeTypeReadImap
- nodeTypeNextCloud
- nodeTypeTelegram
- nodeTypeHttpRequest
```

--------------------------------------------------------------------------------

---[FILE: database.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/workers/database.ts
Signals: N/A
Excerpt (<=80 chars):  export type DatabaseTable = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DatabaseTable
- DatabaseConfig
```

--------------------------------------------------------------------------------

---[FILE: sqlite-wasm.d.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/workers/sqlite-wasm.d.ts
Signals: N/A
Excerpt (<=80 chars):  export type Sqlite3Worker1PromiserConfig = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sqlite3Worker1Promiser
- Sqlite3Worker1PromiserConfig
- DbId
- PromiserMethods
- PromiserResponseSuccess
- PromiserResponseError
- PromiserResponse
- Promiser
```

--------------------------------------------------------------------------------

---[FILE: instance.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/workers/run-data/instance.ts
Signals: N/A
Excerpt (<=80 chars):  export const runDataWorker = Comlink.wrap<RunDataWorker>(worker);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- runDataWorker
```

--------------------------------------------------------------------------------

---[FILE: worker.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/app/workers/run-data/worker.ts
Signals: N/A
Excerpt (<=80 chars):  export const actions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- actions
- RunDataWorker
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/experiments/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const isExtraTemplateLinksExperimentEnabled = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isExtraTemplateLinksExperimentEnabled
- getTemplatePathByRole
- trackTemplatesClick
```

--------------------------------------------------------------------------------

---[FILE: aiTemplatesStarterCollection.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/experiments/aiTemplatesStarterCollection/stores/aiTemplatesStarterCollection.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useAITemplatesStarterCollectionStore = defineStore(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useAITemplatesStarterCollectionStore
```

--------------------------------------------------------------------------------

---[FILE: personalizedTemplates.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/experiments/personalizedTemplates/stores/personalizedTemplates.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const usePersonalizedTemplatesStore = defineStore(STORES.PERSONALIZED...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePersonalizedTemplatesStore
```

--------------------------------------------------------------------------------

---[FILE: personalizedTemplatesV3.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/experiments/personalizedTemplatesV3/stores/personalizedTemplatesV3.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const usePersonalizedTemplatesV3Store = defineStore(STORES.PERSONALIZ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePersonalizedTemplatesV3Store
```

--------------------------------------------------------------------------------

---[FILE: readyToRunWorkflows.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/experiments/readyToRunWorkflows/stores/readyToRunWorkflows.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useReadyToRunWorkflowsStore = defineStore(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useReadyToRunWorkflowsStore
```

--------------------------------------------------------------------------------

---[FILE: readyToRunWorkflowsV2.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/experiments/readyToRunWorkflowsV2/stores/readyToRunWorkflowsV2.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useReadyToRunWorkflowsV2Store = defineStore(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useReadyToRunWorkflowsV2Store
```

--------------------------------------------------------------------------------

---[FILE: predefinedData.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/experiments/templateRecoV2/nodes/predefinedData.ts
Signals: N/A
Excerpt (<=80 chars): export interface PredefinedNodeData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PredefinedNodeData
```

--------------------------------------------------------------------------------

---[FILE: templateRecoV2.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/experiments/templateRecoV2/stores/templateRecoV2.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const usePersonalizedTemplatesV2Store = defineStore(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- usePersonalizedTemplatesV2Store
```

--------------------------------------------------------------------------------

---[FILE: templatesDataQuality.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/experiments/templatesDataQuality/stores/templatesDataQuality.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useTemplatesDataQualityStore = defineStore('templatesDataQualit...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useTemplatesDataQualityStore
```

--------------------------------------------------------------------------------

---[FILE: assistant.api.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/assistant/assistant.api.ts
Signals: N/A
Excerpt (<=80 chars):  export function chatWithBuilder(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chatWithBuilder
- chatWithAssistant
```

--------------------------------------------------------------------------------

---[FILE: assistant.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/assistant/assistant.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const ENABLED_VIEWS = ASSISTANT_ENABLED_VIEWS;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ENABLED_VIEWS
- useAssistantStore
```

--------------------------------------------------------------------------------

---[FILE: assistant.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/assistant/assistant.types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface NodeExecutionSchema {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isTextMessage
- isSummaryMessage
- isAgentSuggestionMessage
- isAgentThinkingMessage
- isCodeDiffMessage
- isWorkflowUpdatedMessage
- isToolMessage
- isEndSessionMessage
- InteractionEventName
- AssistantContext
- RequestPayload
- ToolMessage
- MessageResponse
- NodeExecutionSchema
- ExpressionValue
- WorkflowContext
- ExecutionResultData
- ErrorContext
```

--------------------------------------------------------------------------------

---[FILE: builder.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/assistant/builder.store.ts
Signals: N/A
Excerpt (<=80 chars): export const ENABLED_VIEWS = BUILDER_ENABLED_VIEWS;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ENABLED_VIEWS
- useBuilderStore
- WorkflowBuilderJourneyEventType
```

--------------------------------------------------------------------------------

---[FILE: builder.utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/assistant/builder.utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function generateShortId() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateShortId
- generateMessageId
- createBuilderPayload
- shouldShowChat
```

--------------------------------------------------------------------------------

---[FILE: chatPanel.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/assistant/chatPanel.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const MAX_CHAT_WIDTH = 425;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MAX_CHAT_WIDTH
- MIN_CHAT_WIDTH
- DEFAULT_CHAT_WIDTH
- useChatPanelStore
```

--------------------------------------------------------------------------------

---[FILE: chatPanelState.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/assistant/chatPanelState.store.ts
Signals: N/A
Excerpt (<=80 chars):  export type ChatPanelMode = 'assistant' | 'builder';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DEFAULT_CHAT_WIDTH
- useChatPanelStateStore
- ChatPanelMode
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/assistant/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const ASSISTANT_ENABLED_VIEWS = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ASSISTANT_ENABLED_VIEWS
- BUILDER_ENABLED_VIEWS
```

--------------------------------------------------------------------------------

---[FILE: useAIAssistantHelpers.test.constants.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/assistant/composables/useAIAssistantHelpers.test.constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const PAYLOAD_SIZE_FOR_1_PASS = 4;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PAYLOAD_SIZE_FOR_1_PASS
- PAYLOAD_SIZE_FOR_2_PASSES
```

--------------------------------------------------------------------------------

---[FILE: useAIAssistantHelpers.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/assistant/composables/useAIAssistantHelpers.ts
Signals: N/A
Excerpt (<=80 chars):  export const useAIAssistantHelpers = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useAIAssistantHelpers
```

--------------------------------------------------------------------------------

---[FILE: useBuilderMessages.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/assistant/composables/useBuilderMessages.ts
Signals: N/A
Excerpt (<=80 chars):  export interface MessageProcessingResult {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useBuilderMessages
- MessageProcessingResult
```

--------------------------------------------------------------------------------

---[FILE: useBuilderTodos.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/assistant/composables/useBuilderTodos.ts
Signals: N/A
Excerpt (<=80 chars):  export interface PlaceholderDetail {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractPlaceholderLabel
- findPlaceholderDetails
- formatPlaceholderPath
- isPlaceholderValue
- useBuilderTodos
- PlaceholderDetail
- TodoTrackingItem
- TodosTrackingPayload
```

--------------------------------------------------------------------------------

---[FILE: chat.api.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/chatHub/chat.api.ts
Signals: N/A
Excerpt (<=80 chars):  export const fetchChatModelsApi = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sendMessageApi
- editMessageApi
- regenerateMessageApi
- buildChatAttachmentUrl
- fetchChatModelsApi
- stopGenerationApi
- fetchConversationsApi
- updateConversationApi
- updateConversationTitleApi
- deleteConversationApi
- fetchSingleConversationApi
- fetchAgentsApi
- fetchAgentApi
- createAgentApi
- updateAgentApi
- deleteAgentApi
- fetchChatSettingsApi
- fetchChatProviderSettingsApi
```

--------------------------------------------------------------------------------

---[FILE: chat.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/ai/chatHub/chat.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useChatStore = defineStore(CHAT_STORE, () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useChatStore
```

--------------------------------------------------------------------------------

````
