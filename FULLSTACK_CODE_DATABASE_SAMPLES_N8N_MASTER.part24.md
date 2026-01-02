---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 24
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 24 of 51)

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

---[FILE: ssh-clients-manager.ts]---
Location: n8n-master/packages/core/src/execution-engine/ssh-clients-manager.ts
Signals: Zod
Excerpt (<=80 chars): export class SSHClientsConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSHClientsConfig
- SSHClientsManager
```

--------------------------------------------------------------------------------

---[FILE: triggers-and-pollers.ts]---
Location: n8n-master/packages/core/src/execution-engine/triggers-and-pollers.ts
Signals: N/A
Excerpt (<=80 chars): export class TriggersAndPollers {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TriggersAndPollers
```

--------------------------------------------------------------------------------

---[FILE: workflow-execute.ts]---
Location: n8n-master/packages/core/src/execution-engine/workflow-execute.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowExecute {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowExecute
```

--------------------------------------------------------------------------------

---[FILE: base-execute-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/base-execute-context.ts
Signals: N/A
Excerpt (<=80 chars):  export class BaseExecuteContext extends NodeExecutionContext {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseExecuteContext
```

--------------------------------------------------------------------------------

---[FILE: credentials-test-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/credentials-test-context.ts
Signals: N/A
Excerpt (<=80 chars):  export class CredentialTestContext implements ICredentialTestFunctions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialTestContext
```

--------------------------------------------------------------------------------

---[FILE: execute-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/execute-context.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExecuteContext extends BaseExecuteContext implements IExecuteFu...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecuteContext
```

--------------------------------------------------------------------------------

---[FILE: execute-single-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/execute-single-context.ts
Signals: N/A
Excerpt (<=80 chars):  export class ExecuteSingleContext extends BaseExecuteContext implements IExe...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecuteSingleContext
```

--------------------------------------------------------------------------------

---[FILE: hook-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/hook-context.ts
Signals: N/A
Excerpt (<=80 chars):  export class HookContext extends NodeExecutionContext implements IHookFuncti...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HookContext
```

--------------------------------------------------------------------------------

---[FILE: load-options-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/load-options-context.ts
Signals: N/A
Excerpt (<=80 chars):  export class LoadOptionsContext extends NodeExecutionContext implements ILoa...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoadOptionsContext
```

--------------------------------------------------------------------------------

---[FILE: local-load-options-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/local-load-options-context.ts
Signals: N/A
Excerpt (<=80 chars):  export class LocalLoadOptionsContext implements ILocalLoadOptionsFunctions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalLoadOptionsContext
```

--------------------------------------------------------------------------------

---[FILE: poll-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/poll-context.ts
Signals: N/A
Excerpt (<=80 chars):  export class PollContext extends NodeExecutionContext implements IPollFuncti...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PollContext
```

--------------------------------------------------------------------------------

---[FILE: supply-data-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/supply-data-context.ts
Signals: N/A
Excerpt (<=80 chars):  export class SupplyDataContext extends BaseExecuteContext implements ISupply...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SupplyDataContext
```

--------------------------------------------------------------------------------

---[FILE: trigger-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/trigger-context.ts
Signals: N/A
Excerpt (<=80 chars):  export class TriggerContext extends NodeExecutionContext implements ITrigger...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TriggerContext
```

--------------------------------------------------------------------------------

---[FILE: webhook-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/webhook-context.ts
Signals: Express
Excerpt (<=80 chars): export class WebhookContext extends NodeExecutionContext implements IWebhookF...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookContext
```

--------------------------------------------------------------------------------

---[FILE: workflow-node-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/workflow-node-context.ts
Signals: N/A
Excerpt (<=80 chars):  export class LoadWorkflowNodeContext extends NodeExecutionContext implements...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoadWorkflowNodeContext
```

--------------------------------------------------------------------------------

---[FILE: binary-helper-functions.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/binary-helper-functions.ts
Signals: N/A
Excerpt (<=80 chars): export function assertBinaryData(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- assertBinaryData
- detectBinaryEncoding
- getBinaryHelperFunctions
```

--------------------------------------------------------------------------------

---[FILE: cleanup-parameter-data.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/cleanup-parameter-data.ts
Signals: N/A
Excerpt (<=80 chars): export function cleanupParameterData(inputData: NodeParameterValueType): void {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cleanupParameterData
```

--------------------------------------------------------------------------------

---[FILE: construct-execution-metadata.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/construct-execution-metadata.ts
Signals: N/A
Excerpt (<=80 chars): export function constructExecutionMetaData(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- constructExecutionMetaData
```

--------------------------------------------------------------------------------

---[FILE: copy-input-items.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/copy-input-items.ts
Signals: N/A
Excerpt (<=80 chars): export function copyInputItems(items: INodeExecutionData[], properties: strin...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- copyInputItems
```

--------------------------------------------------------------------------------

---[FILE: create-node-as-tool.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/create-node-as-tool.ts
Signals: Zod
Excerpt (<=80 chars):  export type CreateNodeAsToolOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createNodeAsTool
- CreateNodeAsToolOptions
```

--------------------------------------------------------------------------------

---[FILE: data-table-helper-functions.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/data-table-helper-functions.ts
Signals: N/A
Excerpt (<=80 chars):  export function getDataTableHelperFunctions(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDataTableHelperFunctions
```

--------------------------------------------------------------------------------

---[FILE: deduplication-helper-functions.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/deduplication-helper-functions.ts
Signals: N/A
Excerpt (<=80 chars):  export const getDeduplicationHelperFunctions = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDeduplicationHelperFunctions
```

--------------------------------------------------------------------------------

---[FILE: ensure-type.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/ensure-type.ts
Signals: N/A
Excerpt (<=80 chars):  export function ensureType(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ensureType
```

--------------------------------------------------------------------------------

---[FILE: execution-metadata.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/execution-metadata.ts
Signals: N/A
Excerpt (<=80 chars):  export const KV_LIMIT = 10;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setWorkflowExecutionMetadata
- setAllWorkflowExecutionMetadata
- getAllWorkflowExecutionMetadata
- getWorkflowExecutionMetadata
- KV_LIMIT
```

--------------------------------------------------------------------------------

---[FILE: extract-value.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/extract-value.ts
Signals: N/A
Excerpt (<=80 chars):  export function extractValue(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractValue
```

--------------------------------------------------------------------------------

---[FILE: file-system-helper-functions.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/file-system-helper-functions.ts
Signals: N/A
Excerpt (<=80 chars):  export const getFileSystemHelperFunctions = (node: INode): FileSystemHelperF...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getFileSystemHelperFunctions
```

--------------------------------------------------------------------------------

---[FILE: get-additional-keys.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/get-additional-keys.ts
Signals: N/A
Excerpt (<=80 chars): export function getAdditionalKeys(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAdditionalKeys
```

--------------------------------------------------------------------------------

---[FILE: get-input-connection-data.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/get-input-connection-data.ts
Signals: N/A
Excerpt (<=80 chars):  export function makeHandleToolInvocation(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- makeHandleToolInvocation
```

--------------------------------------------------------------------------------

---[FILE: get-secrets-proxy.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/get-secrets-proxy.ts
Signals: N/A
Excerpt (<=80 chars):  export function getSecretsProxy(additionalData: IWorkflowExecuteAdditionalDa...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSecretsProxy
```

--------------------------------------------------------------------------------

---[FILE: normalize-items.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/normalize-items.ts
Signals: N/A
Excerpt (<=80 chars): export function normalizeItems(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- normalizeItems
```

--------------------------------------------------------------------------------

---[FILE: parse-incoming-message.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/parse-incoming-message.ts
Signals: N/A
Excerpt (<=80 chars): export const parseContentType = (contentType?: string): IContentType | null => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseIncomingMessage
- parseContentType
- parseContentDisposition
```

--------------------------------------------------------------------------------

---[FILE: request-helper-functions.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/request-helper-functions.ts
Signals: N/A
Excerpt (<=80 chars):  export const createFormDataObject = (data: Record<string, unknown>) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- convertN8nRequestToAxios
- applyPaginationRequestData
- createFormDataObject
- removeEmptyBody
- getRequestHelperFunctions
```

--------------------------------------------------------------------------------

---[FILE: return-json-array.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/return-json-array.ts
Signals: N/A
Excerpt (<=80 chars): export function returnJsonArray(jsonData: IDataObject | IDataObject[]): INode...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- returnJsonArray
```

--------------------------------------------------------------------------------

---[FILE: scheduling-helper-functions.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/scheduling-helper-functions.ts
Signals: N/A
Excerpt (<=80 chars):  export const getSchedulingFunctions = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSchedulingFunctions
```

--------------------------------------------------------------------------------

---[FILE: ssh-tunnel-helper-functions.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/ssh-tunnel-helper-functions.ts
Signals: N/A
Excerpt (<=80 chars):  export const getSSHTunnelFunctions = (): SSHTunnelFunctions => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSSHTunnelFunctions
```

--------------------------------------------------------------------------------

---[FILE: validate-value-against-schema.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/validate-value-against-schema.ts
Signals: N/A
Excerpt (<=80 chars):  export const validateValueAgainstSchema = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateValueAgainstSchema
```

--------------------------------------------------------------------------------

---[FILE: webhook-helper-functions.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/webhook-helper-functions.ts
Signals: N/A
Excerpt (<=80 chars): export function getWebhookDescription(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getWebhookDescription
- getNodeWebhookUrl
```

--------------------------------------------------------------------------------

---[FILE: create-node-as-tool.test.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/utils/__tests__/create-node-as-tool.test.ts
Signals: Zod
Excerpt (<=80 chars): import { mock } from 'jest-mock-extended';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: shared-tests.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/__tests__/shared-tests.ts
Signals: N/A
Excerpt (<=80 chars):  export const describeCommonTests = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- describeCommonTests
```

--------------------------------------------------------------------------------

---[FILE: webhook-context.test.ts]---
Location: n8n-master/packages/core/src/execution-engine/node-execution-context/__tests__/webhook-context.test.ts
Signals: Express
Excerpt (<=80 chars): import type { Request, Response } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: clean-run-data.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/clean-run-data.ts
Signals: N/A
Excerpt (<=80 chars): export function cleanRunData(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- cleanRunData
```

--------------------------------------------------------------------------------

---[FILE: directed-graph.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/directed-graph.ts
Signals: N/A
Excerpt (<=80 chars):  export type GraphConnection = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DirectedGraph
- GraphConnection
```

--------------------------------------------------------------------------------

---[FILE: filter-disabled-nodes.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/filter-disabled-nodes.ts
Signals: N/A
Excerpt (<=80 chars):  export function filterDisabledNodes(graph: DirectedGraph): DirectedGraph {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- filterDisabledNodes
```

--------------------------------------------------------------------------------

---[FILE: find-start-nodes.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/find-start-nodes.ts
Signals: N/A
Excerpt (<=80 chars): export function isDirty(node: INode, runData: IRunData = {}, pinData: IPinDat...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isDirty
- findStartNodes
```

--------------------------------------------------------------------------------

---[FILE: find-subgraph.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/find-subgraph.ts
Signals: N/A
Excerpt (<=80 chars): export function findSubgraph(options: {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- findSubgraph
```

--------------------------------------------------------------------------------

---[FILE: find-trigger-for-partial-execution.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/find-trigger-for-partial-execution.ts
Signals: N/A
Excerpt (<=80 chars):  export function anyReachableRootHasRunData(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- anyReachableRootHasRunData
- findTriggerForPartialExecution
```

--------------------------------------------------------------------------------

---[FILE: get-incoming-data.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/get-incoming-data.ts
Signals: N/A
Excerpt (<=80 chars):  export function getIncomingData(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getIncomingData
- getIncomingDataFromAnyRun
```

--------------------------------------------------------------------------------

---[FILE: get-source-data-groups.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/get-source-data-groups.ts
Signals: N/A
Excerpt (<=80 chars): export function getSourceDataGroups(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getSourceDataGroups
```

--------------------------------------------------------------------------------

---[FILE: handle-cycles.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/handle-cycles.ts
Signals: N/A
Excerpt (<=80 chars): export function handleCycles(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleCycles
```

--------------------------------------------------------------------------------

---[FILE: recreate-node-execution-stack.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/recreate-node-execution-stack.ts
Signals: N/A
Excerpt (<=80 chars):  export function addWaitingExecution(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addWaitingExecution
- addWaitingExecutionSource
- recreateNodeExecutionStack
```

--------------------------------------------------------------------------------

---[FILE: rewire-graph.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/rewire-graph.ts
Signals: N/A
Excerpt (<=80 chars):  export function rewireGraph(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- rewireGraph
```

--------------------------------------------------------------------------------

---[FILE: run-data-utils.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/run-data-utils.ts
Signals: N/A
Excerpt (<=80 chars): export function getNextExecutionIndex(runData: IRunData = {}): number {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getNextExecutionIndex
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: n8n-master/packages/core/src/execution-engine/partial-execution-utils/__tests__/helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export function createNodeData(stubData: StubNode): INode {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createNodeData
- toITaskData
- toIConnections
- nodeTypes
- defaultWorkflowParameter
```

--------------------------------------------------------------------------------

---[FILE: mock-node-types.ts]---
Location: n8n-master/packages/core/src/execution-engine/__tests__/mock-node-types.ts
Signals: N/A
Excerpt (<=80 chars):  export const passThroughNode: INodeType = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- modifyNode
- nodeTypeArguments
- nodeTypes
```

--------------------------------------------------------------------------------

---[FILE: instance-settings.ts]---
Location: n8n-master/packages/core/src/instance-settings/instance-settings.ts
Signals: N/A
Excerpt (<=80 chars): export class InstanceSettings {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InstanceSettings
```

--------------------------------------------------------------------------------

---[FILE: worker-missing-encryption-key.error.ts]---
Location: n8n-master/packages/core/src/instance-settings/worker-missing-encryption-key.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkerMissingEncryptionKey extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkerMissingEncryptionKey
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/core/src/nodes-loader/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const CUSTOM_NODES_CATEGORY = 'Custom Nodes';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CUSTOM_NODES_CATEGORY
```

--------------------------------------------------------------------------------

---[FILE: custom-directory-loader.ts]---
Location: n8n-master/packages/core/src/nodes-loader/custom-directory-loader.ts
Signals: N/A
Excerpt (<=80 chars): export class CustomDirectoryLoader extends DirectoryLoader {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CustomDirectoryLoader
```

--------------------------------------------------------------------------------

---[FILE: directory-loader.ts]---
Location: n8n-master/packages/core/src/nodes-loader/directory-loader.ts
Signals: N/A
Excerpt (<=80 chars):  export type Types = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Types
```

--------------------------------------------------------------------------------

---[FILE: lazy-package-directory-loader.ts]---
Location: n8n-master/packages/core/src/nodes-loader/lazy-package-directory-loader.ts
Signals: N/A
Excerpt (<=80 chars): export class LazyPackageDirectoryLoader extends PackageDirectoryLoader {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LazyPackageDirectoryLoader
```

--------------------------------------------------------------------------------

---[FILE: load-class-in-isolation.ts]---
Location: n8n-master/packages/core/src/nodes-loader/load-class-in-isolation.ts
Signals: N/A
Excerpt (<=80 chars): export const loadClassInIsolation = <T>(filePath: string, className: string) ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- loadClassInIsolation
```

--------------------------------------------------------------------------------

---[FILE: package-directory-loader.ts]---
Location: n8n-master/packages/core/src/nodes-loader/package-directory-loader.ts
Signals: N/A
Excerpt (<=80 chars): export class PackageDirectoryLoader extends DirectoryLoader {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageDirectoryLoader
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/core/src/nodes-loader/types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface PackageJson {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackageJson
```

--------------------------------------------------------------------------------

---[FILE: assertions.ts]---
Location: n8n-master/packages/core/src/utils/assertions.ts
Signals: N/A
Excerpt (<=80 chars):  export function assertExecutionDataExists(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- assertExecutionDataExists
```

--------------------------------------------------------------------------------

---[FILE: is-json-compatible.ts]---
Location: n8n-master/packages/core/src/utils/is-json-compatible.ts
Signals: N/A
Excerpt (<=80 chars): export function isJsonCompatible(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isJsonCompatible
```

--------------------------------------------------------------------------------

---[FILE: serialized-buffer.ts]---
Location: n8n-master/packages/core/src/utils/serialized-buffer.ts
Signals: N/A
Excerpt (<=80 chars): export type SerializedBuffer = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- toBuffer
- isSerializedBuffer
- SerializedBuffer
```

--------------------------------------------------------------------------------

---[FILE: signature-helpers.ts]---
Location: n8n-master/packages/core/src/utils/signature-helpers.ts
Signals: N/A
Excerpt (<=80 chars): export function generateUrlSignature(url: string, secret: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- generateUrlSignature
- prepareUrlForSigning
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/core/test/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockInstance = <T>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- toStream
- mockInstance
- toFileId
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/core/test/helpers/index.ts
Signals: N/A
Excerpt (<=80 chars):  export function NodeTypes(nodeTypes: INodeTypeData = predefinedNodesTypes): ...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeTypes
- WorkflowExecuteAdditionalData
- getNodeTypes
- workflowToTests
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/index.ts
Signals: N/A
Excerpt (<=80 chars):  export function createChat(options?: Partial<ChatOptions>) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createChat
```

--------------------------------------------------------------------------------

---[FILE: message.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/api/message.ts
Signals: N/A
Excerpt (<=80 chars):  export interface StreamingEventHandlers {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StreamingEventHandlers
```

--------------------------------------------------------------------------------

---[FILE: useChat.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/composables/useChat.ts
Signals: N/A
Excerpt (<=80 chars):  export function useChat() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useChat
```

--------------------------------------------------------------------------------

---[FILE: useI18n.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/composables/useI18n.ts
Signals: N/A
Excerpt (<=80 chars):  export function useI18n() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useI18n
```

--------------------------------------------------------------------------------

---[FILE: useOptions.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/composables/useOptions.ts
Signals: N/A
Excerpt (<=80 chars):  export function useOptions() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useOptions
```

--------------------------------------------------------------------------------

---[FILE: defaults.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/constants/defaults.ts
Signals: N/A
Excerpt (<=80 chars):  export const defaultOptions: ChatOptions = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defaultMountingTarget
```

--------------------------------------------------------------------------------

---[FILE: localStorage.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/constants/localStorage.ts
Signals: N/A
Excerpt (<=80 chars): export const localStorageNamespace = 'n8n-chat';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- localStorageNamespace
- localStorageSessionIdKey
```

--------------------------------------------------------------------------------

---[FILE: symbols.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/constants/symbols.ts
Signals: N/A
Excerpt (<=80 chars):  export const ChatSymbol = 'Chat' as unknown as InjectionKey<Chat>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChatSymbol
- ChatOptionsSymbol
```

--------------------------------------------------------------------------------

---[FILE: chatEventBus.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/event-buses/chatEventBus.ts
Signals: N/A
Excerpt (<=80 chars):  export const chatEventBus = createEventBus();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chatEventBus
```

--------------------------------------------------------------------------------

---[FILE: chat.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/types/chat.ts
Signals: N/A
Excerpt (<=80 chars):  export interface Chat {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Chat
```

--------------------------------------------------------------------------------

---[FILE: messages.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/types/messages.ts
Signals: N/A
Excerpt (<=80 chars): export type ChatMessage<T = Record<string, unknown>> = ChatMessageComponent<T...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChatMessage
- ChatMessageComponent
- ChatMessageText
```

--------------------------------------------------------------------------------

---[FILE: options.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/types/options.ts
Signals: N/A
Excerpt (<=80 chars):  export interface ChatOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChatOptions
```

--------------------------------------------------------------------------------

---[FILE: streaming.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/types/streaming.ts
Signals: N/A
Excerpt (<=80 chars): export type ChunkType = 'begin' | 'item' | 'end' | 'error';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChunkType
- StructuredChunk
- NodeStreamingState
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/types/webhook.ts
Signals: N/A
Excerpt (<=80 chars): export interface LoadPreviousSessionResponseItem {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoadPreviousSessionResponseItem
- LoadPreviousSessionResponse
- SendMessageResponse
```

--------------------------------------------------------------------------------

---[FILE: event-bus.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/utils/event-bus.ts
Signals: N/A
Excerpt (<=80 chars): export type CallbackFn = Function;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createEventBus
- CallbackFn
- UnregisterFn
- EventBus
```

--------------------------------------------------------------------------------

---[FILE: mount.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/utils/mount.ts
Signals: N/A
Excerpt (<=80 chars): export function createDefaultMountingTarget(mountingTarget: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createDefaultMountingTarget
```

--------------------------------------------------------------------------------

---[FILE: streaming.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/utils/streaming.ts
Signals: N/A
Excerpt (<=80 chars):  export interface NodeRunData {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createBotMessage
- updateMessageInArray
- StreamingMessageManager
- NodeRunData
```

--------------------------------------------------------------------------------

---[FILE: streamingHandlers.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/utils/streamingHandlers.ts
Signals: N/A
Excerpt (<=80 chars):  export function handleStreamingChunk(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleStreamingChunk
- handleNodeStart
- handleNodeComplete
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/utils/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function constructChatWebsocketUrl(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- constructChatWebsocketUrl
```

--------------------------------------------------------------------------------

---[FILE: create.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/__tests__/utils/create.ts
Signals: N/A
Excerpt (<=80 chars):  export function createTestChat(options: Parameters<typeof createChat>[0] = {...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTestChat
```

--------------------------------------------------------------------------------

---[FILE: fetch.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/__tests__/utils/fetch.ts
Signals: N/A
Excerpt (<=80 chars):  export function createFetchResponse<T>(data: T) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createMockStreamingFetchResponse
- createGetLatestMessagesResponse
- createSendMessageResponse
```

--------------------------------------------------------------------------------

---[FILE: selectors.ts]---
Location: n8n-master/packages/frontend/@n8n/chat/src/__tests__/utils/selectors.ts
Signals: N/A
Excerpt (<=80 chars):  export function getMountingTarget(target = defaultMountingTarget) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getMountingTarget
- getChatWindowWrapper
- getChatWindowToggle
- getChatWrapper
- getChatMessages
- getChatMessage
- getChatMessageByText
- getChatMessageTyping
- getGetStartedButton
- getChatInput
- getChatInputTextarea
- getChatInputSendButton
```

--------------------------------------------------------------------------------

---[FILE: useDeviceSupport.ts]---
Location: n8n-master/packages/frontend/@n8n/composables/src/useDeviceSupport.ts
Signals: N/A
Excerpt (<=80 chars):  export function useDeviceSupport() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useDeviceSupport
```

--------------------------------------------------------------------------------

---[FILE: useShortKeyPress.ts]---
Location: n8n-master/packages/frontend/@n8n/composables/src/useShortKeyPress.ts
Signals: N/A
Excerpt (<=80 chars):  export function useShortKeyPress(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useShortKeyPress
```

--------------------------------------------------------------------------------

---[FILE: modes.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/.storybook/modes.ts
Signals: N/A
Excerpt (<=80 chars): export const allModes = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- allModes
```

--------------------------------------------------------------------------------

---[FILE: preview.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/.storybook/preview.ts
Signals: N/A
Excerpt (<=80 chars):  export const parameters = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parameters
- decorators
- tags
```

--------------------------------------------------------------------------------

---[FILE: plugin.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/plugin.ts
Signals: N/A
Excerpt (<=80 chars):  export interface N8nPluginOptions {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- N8nPluginOptions
```

--------------------------------------------------------------------------------

---[FILE: AssistantAvatar.stories.ts]---
Location: n8n-master/packages/frontend/@n8n/design-system/src/components/AskAssistantAvatar/AssistantAvatar.stories.ts
Signals: N/A
Excerpt (<=80 chars):  export const Default = Template.bind({});

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Default
- Mini
```

--------------------------------------------------------------------------------

````
