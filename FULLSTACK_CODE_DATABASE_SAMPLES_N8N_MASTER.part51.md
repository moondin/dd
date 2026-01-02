---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 51
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 51 of 51)

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

---[FILE: type-validation.ts]---
Location: n8n-master/packages/workflow/src/type-validation.ts
Signals: N/A
Excerpt (<=80 chars):  export const tryToParseNumber = (value: unknown): number => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateFieldType
- tryToParseNumber
- tryToParseString
- tryToParseAlphanumericString
- tryToParseBoolean
- tryToParseDateTime
- tryToParseTime
- tryToParseArray
- tryToParseObject
- tryToParseJsonToFormFields
- getValueDescription
- tryToParseUrl
- tryToParseJwt
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/workflow/src/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function isObject(value: unknown): value is Record<string, unknown> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isObject
- fileTypeFromMimeType
- updateDisplayOptions
- randomInt
- randomString
- isSafeObjectProperty
- setSafeObjectProperty
- isDomainAllowed
- isCommunityPackageName
- isObjectEmpty
- deepCopy
- jsonParse
- base64DecodeUTF8
- replaceCircularReferences
```

--------------------------------------------------------------------------------

---[FILE: versioned-node-type.ts]---
Location: n8n-master/packages/workflow/src/versioned-node-type.ts
Signals: N/A
Excerpt (<=80 chars):  export class VersionedNodeType implements IVersionedNodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- VersionedNodeType
```

--------------------------------------------------------------------------------

---[FILE: workflow-checksum.ts]---
Location: n8n-master/packages/workflow/src/workflow-checksum.ts
Signals: N/A
Excerpt (<=80 chars): export interface WorkflowSnapshot {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowSnapshot
```

--------------------------------------------------------------------------------

---[FILE: workflow-data-proxy-env-provider.ts]---
Location: n8n-master/packages/workflow/src/workflow-data-proxy-env-provider.ts
Signals: N/A
Excerpt (<=80 chars):  export type EnvProviderState = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createEnvProviderState
- createEnvProvider
- EnvProviderState
```

--------------------------------------------------------------------------------

---[FILE: workflow-data-proxy-helpers.ts]---
Location: n8n-master/packages/workflow/src/workflow-data-proxy-helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export function getPinDataIfManualExecution(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getPinDataIfManualExecution
```

--------------------------------------------------------------------------------

---[FILE: workflow-data-proxy.ts]---
Location: n8n-master/packages/workflow/src/workflow-data-proxy.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowDataProxy {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowDataProxy
```

--------------------------------------------------------------------------------

---[FILE: workflow-diff.ts]---
Location: n8n-master/packages/workflow/src/workflow-diff.ts
Signals: N/A
Excerpt (<=80 chars):  export type DiffableNode = Pick<INode, 'id' | 'parameters' | 'name'>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- hasNonPositionalChanges
- hasCredentialChanges
- RULES
- WorkflowChangeSet
- DiffableNode
- DiffableWorkflow
- NodeDiff
- WorkflowDiff
- DiffRule
```

--------------------------------------------------------------------------------

---[FILE: workflow-validation.ts]---
Location: n8n-master/packages/workflow/src/workflow-validation.ts
Signals: N/A
Excerpt (<=80 chars):  export interface INodeTypesGetter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateWorkflowHasTriggerLikeNode
- INodeTypesGetter
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: n8n-master/packages/workflow/src/workflow.ts
Signals: N/A
Excerpt (<=80 chars):  export interface WorkflowParameters {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Workflow
- WorkflowParameters
```

--------------------------------------------------------------------------------

---[FILE: get-child-nodes.ts]---
Location: n8n-master/packages/workflow/src/common/get-child-nodes.ts
Signals: N/A
Excerpt (<=80 chars):  export function getChildNodes(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getChildNodes
```

--------------------------------------------------------------------------------

---[FILE: get-connected-nodes.ts]---
Location: n8n-master/packages/workflow/src/common/get-connected-nodes.ts
Signals: N/A
Excerpt (<=80 chars): export function getConnectedNodes(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getConnectedNodes
```

--------------------------------------------------------------------------------

---[FILE: get-node-by-name.ts]---
Location: n8n-master/packages/workflow/src/common/get-node-by-name.ts
Signals: N/A
Excerpt (<=80 chars): export function getNodeByName(nodes: INodes | INode[], name: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getNodeByName
```

--------------------------------------------------------------------------------

---[FILE: get-parent-nodes.ts]---
Location: n8n-master/packages/workflow/src/common/get-parent-nodes.ts
Signals: N/A
Excerpt (<=80 chars): export function getParentNodes(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getParentNodes
```

--------------------------------------------------------------------------------

---[FILE: map-connections-by-destination.ts]---
Location: n8n-master/packages/workflow/src/common/map-connections-by-destination.ts
Signals: N/A
Excerpt (<=80 chars):  export function mapConnectionsByDestination(connections: IConnections) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapConnectionsByDestination
```

--------------------------------------------------------------------------------

---[FILE: cli-subworkflow-operation.error.ts]---
Location: n8n-master/packages/workflow/src/errors/cli-subworkflow-operation.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class CliWorkflowOperationError extends SubworkflowOperationError {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CliWorkflowOperationError
```

--------------------------------------------------------------------------------

---[FILE: db-connection-timeout-error.ts]---
Location: n8n-master/packages/workflow/src/errors/db-connection-timeout-error.ts
Signals: N/A
Excerpt (<=80 chars):  export type DbConnectionTimeoutErrorOpts = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DbConnectionTimeoutError
- DbConnectionTimeoutErrorOpts
```

--------------------------------------------------------------------------------

---[FILE: ensure-error.ts]---
Location: n8n-master/packages/workflow/src/errors/ensure-error.ts
Signals: N/A
Excerpt (<=80 chars): export function ensureError(error: unknown): Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ensureError
```

--------------------------------------------------------------------------------

---[FILE: execution-cancelled.error.ts]---
Location: n8n-master/packages/workflow/src/errors/execution-cancelled.error.ts
Signals: N/A
Excerpt (<=80 chars):  export type CancellationReason = 'manual' | 'timeout' | 'shutdown';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ManualExecutionCancelledError
- TimeoutExecutionCancelledError
- SystemShutdownExecutionCancelledError
- CancellationReason
```

--------------------------------------------------------------------------------

---[FILE: expression-extension.error.ts]---
Location: n8n-master/packages/workflow/src/errors/expression-extension.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExpressionExtensionError extends ExpressionError {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExpressionExtensionError
```

--------------------------------------------------------------------------------

---[FILE: expression.error.ts]---
Location: n8n-master/packages/workflow/src/errors/expression.error.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ExpressionErrorOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExpressionError
- ExpressionErrorOptions
```

--------------------------------------------------------------------------------

---[FILE: node-api.error.ts]---
Location: n8n-master/packages/workflow/src/errors/node-api.error.ts
Signals: N/A
Excerpt (<=80 chars):  export interface NodeOperationErrorOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeApiError
- NodeOperationErrorOptions
```

--------------------------------------------------------------------------------

---[FILE: node-operation.error.ts]---
Location: n8n-master/packages/workflow/src/errors/node-operation.error.ts
Signals: N/A
Excerpt (<=80 chars): export class NodeOperationError extends NodeError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeOperationError
```

--------------------------------------------------------------------------------

---[FILE: node-ssl.error.ts]---
Location: n8n-master/packages/workflow/src/errors/node-ssl.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class NodeSslError extends ExecutionBaseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeSslError
```

--------------------------------------------------------------------------------

---[FILE: subworkflow-operation.error.ts]---
Location: n8n-master/packages/workflow/src/errors/subworkflow-operation.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class SubworkflowOperationError extends WorkflowOperationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SubworkflowOperationError
```

--------------------------------------------------------------------------------

---[FILE: trigger-close.error.ts]---
Location: n8n-master/packages/workflow/src/errors/trigger-close.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TriggerCloseError extends ApplicationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TriggerCloseError
```

--------------------------------------------------------------------------------

---[FILE: webhook-taken.error.ts]---
Location: n8n-master/packages/workflow/src/errors/webhook-taken.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class WebhookPathTakenError extends WorkflowActivationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookPathTakenError
```

--------------------------------------------------------------------------------

---[FILE: workflow-activation.error.ts]---
Location: n8n-master/packages/workflow/src/errors/workflow-activation.error.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowActivationError extends ExecutionBaseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowActivationError
```

--------------------------------------------------------------------------------

---[FILE: workflow-configuration.error.ts]---
Location: n8n-master/packages/workflow/src/errors/workflow-configuration.error.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowConfigurationError extends NodeOperationError {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowConfigurationError
```

--------------------------------------------------------------------------------

---[FILE: workflow-deactivation.error.ts]---
Location: n8n-master/packages/workflow/src/errors/workflow-deactivation.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowDeactivationError extends WorkflowActivationError {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowDeactivationError
```

--------------------------------------------------------------------------------

---[FILE: workflow-operation.error.ts]---
Location: n8n-master/packages/workflow/src/errors/workflow-operation.error.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowOperationError extends ExecutionBaseError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowOperationError
```

--------------------------------------------------------------------------------

---[FILE: base.error.ts]---
Location: n8n-master/packages/workflow/src/errors/base/base.error.ts
Signals: N/A
Excerpt (<=80 chars):  export type BaseErrorOptions = { description?: string | undefined | null } &...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseErrorOptions
```

--------------------------------------------------------------------------------

---[FILE: operational.error.ts]---
Location: n8n-master/packages/workflow/src/errors/base/operational.error.ts
Signals: N/A
Excerpt (<=80 chars):  export type OperationalErrorOptions = Omit<BaseErrorOptions, 'level'> & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OperationalError
- OperationalErrorOptions
```

--------------------------------------------------------------------------------

---[FILE: unexpected.error.ts]---
Location: n8n-master/packages/workflow/src/errors/base/unexpected.error.ts
Signals: N/A
Excerpt (<=80 chars):  export type UnexpectedErrorOptions = Omit<BaseErrorOptions, 'level'> & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnexpectedError
- UnexpectedErrorOptions
```

--------------------------------------------------------------------------------

---[FILE: user.error.ts]---
Location: n8n-master/packages/workflow/src/errors/base/user.error.ts
Signals: N/A
Excerpt (<=80 chars):  export type UserErrorOptions = Omit<BaseErrorOptions, 'level'> & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserError
- UserErrorOptions
```

--------------------------------------------------------------------------------

---[FILE: expression-helpers.ts]---
Location: n8n-master/packages/workflow/src/expressions/expression-helpers.ts
Signals: N/A
Excerpt (<=80 chars): export const isExpression = (expr: unknown): expr is string => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isExpression
```

--------------------------------------------------------------------------------

---[FILE: array-extensions.ts]---
Location: n8n-master/packages/workflow/src/extensions/array-extensions.ts
Signals: N/A
Excerpt (<=80 chars):  export function average(value: unknown[]) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- average
- toJsonString
- toInt
- toFloat
- toBoolean
- toDateTime
```

--------------------------------------------------------------------------------

---[FILE: boolean-extensions.ts]---
Location: n8n-master/packages/workflow/src/extensions/boolean-extensions.ts
Signals: N/A
Excerpt (<=80 chars):  export function toBoolean(value: boolean) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- toBoolean
- toInt
- toDateTime
```

--------------------------------------------------------------------------------

---[FILE: expression-extension.ts]---
Location: n8n-master/packages/workflow/src/extensions/expression-extension.ts
Signals: N/A
Excerpt (<=80 chars):  export const EXTENSION_OBJECTS: ExtensionMap[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extend
- extendOptional
- extendSyntax
- hasExpressionExtension
- hasNativeMethod
- extendTransform
```

--------------------------------------------------------------------------------

---[FILE: expression-parser.ts]---
Location: n8n-master/packages/workflow/src/extensions/expression-parser.ts
Signals: N/A
Excerpt (<=80 chars): export interface ExpressionText {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- escapeCode
- splitExpression
- joinExpression
- ExpressionChunk
- ExpressionText
- ExpressionCode
```

--------------------------------------------------------------------------------

---[FILE: extended-functions.ts]---
Location: n8n-master/packages/workflow/src/extensions/extended-functions.ts
Signals: N/A
Excerpt (<=80 chars):  export const extendedFunctions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extendedFunctions
```

--------------------------------------------------------------------------------

---[FILE: extensions.ts]---
Location: n8n-master/packages/workflow/src/extensions/extensions.ts
Signals: N/A
Excerpt (<=80 chars):  export type Alias = { label: string; info?: string; mode?: 'prefix' | 'exact...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Alias
- Extension
- NativeDoc
- DocMetadataArgument
- DocMetadataExample
- DocMetadata
- AliasCompletion
- ExtensionMap
```

--------------------------------------------------------------------------------

---[FILE: number-extensions.ts]---
Location: n8n-master/packages/workflow/src/extensions/number-extensions.ts
Signals: N/A
Excerpt (<=80 chars): export function toDateTime(value: number, extraArgs: [DateTimeFormat]) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- toDateTime
```

--------------------------------------------------------------------------------

---[FILE: object-extensions.ts]---
Location: n8n-master/packages/workflow/src/extensions/object-extensions.ts
Signals: N/A
Excerpt (<=80 chars):  export function compact(value: object): object {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- compact
- urlEncode
- toJsonString
- toInt
- toFloat
- toBoolean
- toDateTime
```

--------------------------------------------------------------------------------

---[FILE: string-extensions.ts]---
Location: n8n-master/packages/workflow/src/extensions/string-extensions.ts
Signals: N/A
Excerpt (<=80 chars):  export const SupportedHashAlgorithms = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- toJsonString
- toDateTime
- SupportedHashAlgorithms
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/workflow/src/extensions/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const convertToDateTime = (value: string | Date | DateTime): DateTime...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- convertToDateTime
```

--------------------------------------------------------------------------------

---[FILE: graph-utils.ts]---
Location: n8n-master/packages/workflow/src/graph/graph-utils.ts
Signals: N/A
Excerpt (<=80 chars):  export type ExtractableErrorResult =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getInputEdges
- getOutputEdges
- getRootNodes
- getLeafNodes
- hasPath
- buildAdjacencyList
- parseExtractableSubgraphSelection
- ExtractableErrorResult
- IConnectionAdjacencyList
- ExtractableSubgraphData
```

--------------------------------------------------------------------------------

---[FILE: filter-parameter.ts]---
Location: n8n-master/packages/workflow/src/node-parameters/filter-parameter.ts
Signals: N/A
Excerpt (<=80 chars):  export class FilterError extends ApplicationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- arrayContainsValue
- executeFilterCondition
- executeFilter
- validateFilterParameter
- FilterError
```

--------------------------------------------------------------------------------

---[FILE: parameter-type-validation.ts]---
Location: n8n-master/packages/workflow/src/node-parameters/parameter-type-validation.ts
Signals: N/A
Excerpt (<=80 chars):  export function assertParamIsNumber(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- assertParamIsNumber
- assertParamIsString
- assertParamIsBoolean
```

--------------------------------------------------------------------------------

---[FILE: path-utils.ts]---
Location: n8n-master/packages/workflow/src/node-parameters/path-utils.ts
Signals: N/A
Excerpt (<=80 chars): export function resolveRelativePath(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- resolveRelativePath
```

--------------------------------------------------------------------------------

---[FILE: rename-node-utils.ts]---
Location: n8n-master/packages/workflow/src/node-parameters/rename-node-utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function renameFormFields(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- renameFormFields
```

--------------------------------------------------------------------------------

---[FILE: run-execution-data.ts]---
Location: n8n-master/packages/workflow/src/run-execution-data/run-execution-data.ts
Signals: N/A
Excerpt (<=80 chars): export type IRunExecutionDataAll = IRunExecutionDataV0 | IRunExecutionDataV1;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- migrateRunExecutionData
- IRunExecutionDataAll
- IRunExecutionData
```

--------------------------------------------------------------------------------

---[FILE: run-execution-data.v0.ts]---
Location: n8n-master/packages/workflow/src/run-execution-data/run-execution-data.v0.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IRunExecutionDataV0 {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IRunExecutionDataV0
```

--------------------------------------------------------------------------------

---[FILE: run-execution-data.v1.ts]---
Location: n8n-master/packages/workflow/src/run-execution-data/run-execution-data.v1.ts
Signals: N/A
Excerpt (<=80 chars): export interface IRunExecutionDataV1 {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- runExecutionDataV0ToV1
- IRunExecutionDataV1
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: n8n-master/packages/workflow/test/helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export function NodeTypes(): INodeTypes {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeTypes
- readJsonFileSync
```

--------------------------------------------------------------------------------

---[FILE: node-types.ts]---
Location: n8n-master/packages/workflow/test/node-types.ts
Signals: N/A
Excerpt (<=80 chars):  export class NodeTypes implements INodeTypes {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeTypes
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: n8n-master/packages/workflow/test/ExpressionExtensions/helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export const nodeTypes = Helpers.NodeTypes();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- nodeTypes
- workflow
- expression
- evaluate
- getLocalISOString
```

--------------------------------------------------------------------------------

---[FILE: base.ts]---
Location: n8n-master/packages/workflow/test/ExpressionFixtures/base.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ExpressionTestTransform extends ExpressionTestBase {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExpressionTestEvaluation
- ExpressionTests
- ExpressionTestTransform
- ExpressionTestFixture
```

--------------------------------------------------------------------------------

````
