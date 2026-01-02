---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 32
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 32 of 51)

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

---[FILE: templates.types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/templates/templates.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type NodeCredentials = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeCredentials
- BaseNode
- NodeWithCredentials
- NodeWithRequiredCredential
- CredentialUsages
- AppCredentials
- NormalizedTemplateNodeCredentials
```

--------------------------------------------------------------------------------

---[FILE: useCredentialSetupState.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/templates/composables/useCredentialSetupState.ts
Signals: N/A
Excerpt (<=80 chars): export const getNodesRequiringCredentials = <TNode extends BaseNode>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getNodesRequiringCredentials
- groupNodeCredentialsByKey
- getAppCredentials
- useCredentialSetupState
```

--------------------------------------------------------------------------------

---[FILE: useSetupWorkflowCredentialsModalState.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/templates/composables/useSetupWorkflowCredentialsModalState.ts
Signals: N/A
Excerpt (<=80 chars):  export const useSetupWorkflowCredentialsModalState = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useSetupWorkflowCredentialsModalState
```

--------------------------------------------------------------------------------

---[FILE: templateActions.test.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/templates/utils/templateActions.test.ts
Signals: N/A
Excerpt (<=80 chars):  export const testTemplate2 = mock<ITemplatesWorkflowFull>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- testTemplate2
```

--------------------------------------------------------------------------------

---[FILE: templateTransforms.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/templates/utils/templateTransforms.ts
Signals: N/A
Excerpt (<=80 chars):  export type IWorkflowTemplateNodeWithCredentials = IWorkflowTemplateNode &

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- keyFromCredentialTypeAndName
- normalizeTemplateNodeCredentials
- getReplacedTemplateNodeCredentials
- getMissingTemplateNodeCredentials
- replaceAllTemplateNodeCredentials
- IWorkflowTemplateNodeWithCredentials
- TemplateCredentialKey
- TemplateNodeWithRequiredCredential
```

--------------------------------------------------------------------------------

---[FILE: typeGuards.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/templates/utils/typeGuards.ts
Signals: N/A
Excerpt (<=80 chars):  export function isTemplatesWorkflow(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isTemplatesWorkflow
- isFullTemplatesCollection
- isWorkflowDataWithTemplateId
```

--------------------------------------------------------------------------------

---[FILE: workflowSamples.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/templates/utils/workflowSamples.ts
Signals: N/A
Excerpt (<=80 chars):  export const getEasyAiWorkflowJson = (): WorkflowDataWithTemplateId => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getEasyAiWorkflowJson
- getRagStarterWorkflowJson
- SampleTemplates
- PrebuiltAgentTemplates
- TutorialTemplates
- isPrebuiltAgentTemplateId
- isTutorialTemplateId
- getPrebuiltAgents
- getTutorialTemplates
- getSampleWorkflowByTemplateId
```

--------------------------------------------------------------------------------

---[FILE: setupTemplate.store.testData.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/templates/__tests__/setupTemplate.store.testData.ts
Signals: N/A
Excerpt (<=80 chars):  export const newFullOneNodeTemplate = (node: IWorkflowTemplateNode): ITempla...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- newFullOneNodeTemplate
- newCredential
```

--------------------------------------------------------------------------------

---[FILE: useViewportSync.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/workflowDiff/useViewportSync.ts
Signals: N/A
Excerpt (<=80 chars):  export type ViewportSyncReturn = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ViewportSyncReturn
```

--------------------------------------------------------------------------------

---[FILE: useWorkflowDiff.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/workflowDiff/useWorkflowDiff.ts
Signals: N/A
Excerpt (<=80 chars):  export function mapConnections(connections: CanvasConnection[]) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mapConnections
- useWorkflowDiff
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/workflowHistory/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type WorkflowHistoryAction = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowHistoryAction
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/workflowHistory/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const getLastPublishedVersion = (workflowPublishHistory: WorkflowPubl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getLastPublishedVersion
- generateVersionName
- formatTimestamp
- computeTimelineEntries
- TimelineVersionEntry
- TimelineGroupHeader
- TimelineEntry
```

--------------------------------------------------------------------------------

---[FILE: workflowHistory.store.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/features/workflows/workflowHistory/workflowHistory.store.ts
Signals: N/A
Excerpt (<=80 chars):  export const useWorkflowHistoryStore = defineStore('workflowHistory', () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- useWorkflowHistoryStore
```

--------------------------------------------------------------------------------

---[FILE: mocks.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/mocks.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockNode = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createMockNodeTypes
- createTestWorkflowObject
- createTestWorkflow
- createTestNode
- createTestNodeProperties
- createMockEnterpriseSettings
- createTestTaskData
- createTestWorkflowExecutionResponse
- createTestExpressionLocalResolveContext
- mockNode
- mockNodeTypeDescription
- mockLoadedNodeType
- mockNodes
- defaultNodeTypes
- defaultNodeDescriptions
```

--------------------------------------------------------------------------------

---[FILE: render.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/render.ts
Signals: N/A
Excerpt (<=80 chars):  export type RenderOptions<T> = Omit<TestingLibraryRenderOptions<T>, 'props'>...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RenderOptions
```

--------------------------------------------------------------------------------

---[FILE: setup.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/setup.ts
Signals: N/A
Excerpt (<=80 chars):  export class IntersectionObserver {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IntersectionObserver
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/utils.ts
Signals: N/A
Excerpt (<=80 chars): export const retry = async (assertion: () => void, { interval = 20, timeout =...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- retry
- waitAllPromises
- getDropdownItems
- getSelectedDropdownValue
- mockedStore
- useEmitters
- Emitter
- Emitters
```

--------------------------------------------------------------------------------

---[FILE: users.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/data/users.ts
Signals: N/A
Excerpt (<=80 chars):  export const createUser = (overrides?: Partial<IUser>): IUser => ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createUser
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/index.ts
Signals: N/A
Excerpt (<=80 chars):  export function setupServer() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setupServer
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/types.ts
Signals: N/A
Excerpt (<=80 chars): export type AppSchema = Schema<AppRegistry>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AppSchema
```

--------------------------------------------------------------------------------

---[FILE: credential.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/endpoints/credential.ts
Signals: N/A
Excerpt (<=80 chars):  export function routesForCredentials(server: Server) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- routesForCredentials
```

--------------------------------------------------------------------------------

---[FILE: credentialType.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/endpoints/credentialType.ts
Signals: N/A
Excerpt (<=80 chars):  export function routesForCredentialTypes(server: Server) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- routesForCredentialTypes
```

--------------------------------------------------------------------------------

---[FILE: module.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/endpoints/module.ts
Signals: N/A
Excerpt (<=80 chars):  export function routesForModuleSettings(server: Server) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- routesForModuleSettings
```

--------------------------------------------------------------------------------

---[FILE: settings.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/endpoints/settings.ts
Signals: N/A
Excerpt (<=80 chars):  export function routesForSettings(server: Server) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- routesForSettings
```

--------------------------------------------------------------------------------

---[FILE: sourceControl.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/endpoints/sourceControl.ts
Signals: N/A
Excerpt (<=80 chars):  export function routesForSourceControl(server: Server) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- routesForSourceControl
```

--------------------------------------------------------------------------------

---[FILE: sso.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/endpoints/sso.ts
Signals: N/A
Excerpt (<=80 chars):  export function routesForSSO(server: Server) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- routesForSSO
```

--------------------------------------------------------------------------------

---[FILE: tag.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/endpoints/tag.ts
Signals: N/A
Excerpt (<=80 chars):  export function routesForTags(server: Server) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- routesForTags
```

--------------------------------------------------------------------------------

---[FILE: user.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/endpoints/user.ts
Signals: N/A
Excerpt (<=80 chars):  export function routesForUsers(server: Server) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- routesForUsers
```

--------------------------------------------------------------------------------

---[FILE: variable.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/endpoints/variable.ts
Signals: N/A
Excerpt (<=80 chars):  export function routesForVariables(server: Server) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- routesForVariables
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/endpoints/workflow.ts
Signals: N/A
Excerpt (<=80 chars):  export function routesForWorkflows(server: Server) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- routesForWorkflows
```

--------------------------------------------------------------------------------

---[FILE: credential.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/factories/credential.ts
Signals: N/A
Excerpt (<=80 chars):  export const credentialFactory = Factory.extend<ICredentialsResponse>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- credentialFactory
```

--------------------------------------------------------------------------------

---[FILE: credentialType.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/factories/credentialType.ts
Signals: N/A
Excerpt (<=80 chars):  export const credentialTypeFactory = Factory.extend<ICredentialType>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- credentialTypeFactory
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/factories/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const factories = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- factories
```

--------------------------------------------------------------------------------

---[FILE: tag.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/factories/tag.ts
Signals: N/A
Excerpt (<=80 chars):  export const tagFactory = Factory.extend<ITag>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- tagFactory
```

--------------------------------------------------------------------------------

---[FILE: user.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/factories/user.ts
Signals: N/A
Excerpt (<=80 chars):  export const userFactory = Factory.extend<IUser>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- userFactory
```

--------------------------------------------------------------------------------

---[FILE: variable.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/factories/variable.ts
Signals: N/A
Excerpt (<=80 chars):  export const variableFactory = Factory.extend<EnvironmentVariable>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- variableFactory
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/factories/workflow.ts
Signals: N/A
Excerpt (<=80 chars):  export const workflowFactory = Factory.extend<IWorkflowDb>({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- workflowFactory
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/fixtures/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const fixtures = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- fixtures
```

--------------------------------------------------------------------------------

---[FILE: workflows.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/fixtures/workflows.ts
Signals: N/A
Excerpt (<=80 chars):  export const workflows = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- workflows
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/frontend/editor-ui/src/__tests__/server/models/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const models = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- models
```

--------------------------------------------------------------------------------

---[FILE: i18n-locales-hmr-helpers.ts]---
Location: n8n-master/packages/frontend/editor-ui/vite/i18n-locales-hmr-helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export const isLocaleFile = (file: string): boolean =>

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isLocaleFile
- extractLocale
- sendLocaleUpdate
```

--------------------------------------------------------------------------------

---[FILE: build.ts]---
Location: n8n-master/packages/node-dev/commands/build.ts
Signals: N/A
Excerpt (<=80 chars):  export class Build extends Command {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Build
```

--------------------------------------------------------------------------------

---[FILE: new.ts]---
Location: n8n-master/packages/node-dev/commands/new.ts
Signals: N/A
Excerpt (<=80 chars):  export class New extends Command {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- New
```

--------------------------------------------------------------------------------

---[FILE: Interfaces.ts]---
Location: n8n-master/packages/node-dev/src/Interfaces.ts
Signals: N/A
Excerpt (<=80 chars): export interface IBuildOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IBuildOptions
```

--------------------------------------------------------------------------------

---[FILE: simple.ts]---
Location: n8n-master/packages/node-dev/templates/credentials/simple.ts
Signals: N/A
Excerpt (<=80 chars):  export class ClassNameReplace implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClassNameReplace
```

--------------------------------------------------------------------------------

---[FILE: simple.ts]---
Location: n8n-master/packages/node-dev/templates/execute/simple.ts
Signals: N/A
Excerpt (<=80 chars):  export class ClassNameReplace implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClassNameReplace
```

--------------------------------------------------------------------------------

---[FILE: simple.ts]---
Location: n8n-master/packages/node-dev/templates/trigger/simple.ts
Signals: N/A
Excerpt (<=80 chars):  export class ClassNameReplace implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClassNameReplace
```

--------------------------------------------------------------------------------

---[FILE: simple.ts]---
Location: n8n-master/packages/node-dev/templates/webhook/simple.ts
Signals: N/A
Excerpt (<=80 chars):  export class ClassNameReplace implements INodeType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClassNameReplace
```

--------------------------------------------------------------------------------

---[FILE: ActionNetworkApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/ActionNetworkApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ActionNetworkApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActionNetworkApi
```

--------------------------------------------------------------------------------

---[FILE: ActiveCampaignApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/ActiveCampaignApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ActiveCampaignApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActiveCampaignApi
```

--------------------------------------------------------------------------------

---[FILE: AcuitySchedulingApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AcuitySchedulingApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AcuitySchedulingApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AcuitySchedulingApi
```

--------------------------------------------------------------------------------

---[FILE: AcuitySchedulingOAuth2Api.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AcuitySchedulingOAuth2Api.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AcuitySchedulingOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AcuitySchedulingOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: AdaloApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AdaloApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AdaloApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AdaloApi
```

--------------------------------------------------------------------------------

---[FILE: AffinityApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AffinityApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AffinityApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AffinityApi
```

--------------------------------------------------------------------------------

---[FILE: AgileCrmApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AgileCrmApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AgileCrmApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AgileCrmApi
```

--------------------------------------------------------------------------------

---[FILE: AirtableApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AirtableApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AirtableApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AirtableApi
```

--------------------------------------------------------------------------------

---[FILE: AirtableOAuth2Api.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AirtableOAuth2Api.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AirtableOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AirtableOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: AirtableTokenApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AirtableTokenApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AirtableTokenApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AirtableTokenApi
```

--------------------------------------------------------------------------------

---[FILE: AirtopApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AirtopApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AirtopApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AirtopApi
```

--------------------------------------------------------------------------------

---[FILE: AlienVaultApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AlienVaultApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AlienVaultApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AlienVaultApi
```

--------------------------------------------------------------------------------

---[FILE: Amqp.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/Amqp.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class Amqp implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Amqp
```

--------------------------------------------------------------------------------

---[FILE: ApiTemplateIoApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/ApiTemplateIoApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ApiTemplateIoApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ApiTemplateIoApi
```

--------------------------------------------------------------------------------

---[FILE: AsanaApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AsanaApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AsanaApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AsanaApi
```

--------------------------------------------------------------------------------

---[FILE: AsanaOAuth2Api.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AsanaOAuth2Api.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AsanaOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AsanaOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: Auth0ManagementApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/Auth0ManagementApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class Auth0ManagementApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Auth0ManagementApi
```

--------------------------------------------------------------------------------

---[FILE: AutopilotApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AutopilotApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AutopilotApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AutopilotApi
```

--------------------------------------------------------------------------------

---[FILE: Aws.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/Aws.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class Aws implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Aws
```

--------------------------------------------------------------------------------

---[FILE: AwsAssumeRole.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AwsAssumeRole.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AwsAssumeRole implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AwsAssumeRole
```

--------------------------------------------------------------------------------

---[FILE: AzureStorageOAuth2Api.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AzureStorageOAuth2Api.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AzureStorageOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AzureStorageOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: AzureStorageSharedKeyApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/AzureStorageSharedKeyApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class AzureStorageSharedKeyApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AzureStorageSharedKeyApi
```

--------------------------------------------------------------------------------

---[FILE: BambooHrApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BambooHrApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BambooHrApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BambooHrApi
```

--------------------------------------------------------------------------------

---[FILE: BannerbearApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BannerbearApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BannerbearApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BannerbearApi
```

--------------------------------------------------------------------------------

---[FILE: BaserowApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BaserowApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BaserowApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaserowApi
```

--------------------------------------------------------------------------------

---[FILE: BeeminderApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BeeminderApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BeeminderApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BeeminderApi
```

--------------------------------------------------------------------------------

---[FILE: BeeminderOAuth2Api.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BeeminderOAuth2Api.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BeeminderOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BeeminderOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: BitbucketAccessTokenApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BitbucketAccessTokenApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BitbucketAccessTokenApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BitbucketAccessTokenApi
```

--------------------------------------------------------------------------------

---[FILE: BitbucketApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BitbucketApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BitbucketApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BitbucketApi
```

--------------------------------------------------------------------------------

---[FILE: BitlyApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BitlyApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BitlyApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BitlyApi
```

--------------------------------------------------------------------------------

---[FILE: BitlyOAuth2Api.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BitlyOAuth2Api.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BitlyOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BitlyOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: BitwardenApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BitwardenApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BitwardenApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BitwardenApi
```

--------------------------------------------------------------------------------

---[FILE: BoxOAuth2Api.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BoxOAuth2Api.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BoxOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BoxOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: BrandfetchApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BrandfetchApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BrandfetchApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BrandfetchApi
```

--------------------------------------------------------------------------------

---[FILE: BrevoApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BrevoApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BrevoApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BrevoApi
```

--------------------------------------------------------------------------------

---[FILE: BubbleApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/BubbleApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class BubbleApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BubbleApi
```

--------------------------------------------------------------------------------

---[FILE: CalApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/CalApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class CalApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CalApi
```

--------------------------------------------------------------------------------

---[FILE: CalendlyApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/CalendlyApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class CalendlyApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CalendlyApi
```

--------------------------------------------------------------------------------

---[FILE: CalendlyOAuth2Api.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/CalendlyOAuth2Api.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class CalendlyOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CalendlyOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: CarbonBlackApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/CarbonBlackApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class CarbonBlackApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CarbonBlackApi
```

--------------------------------------------------------------------------------

---[FILE: ChargebeeApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/ChargebeeApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ChargebeeApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChargebeeApi
```

--------------------------------------------------------------------------------

---[FILE: CircleCiApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/CircleCiApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class CircleCiApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CircleCiApi
```

--------------------------------------------------------------------------------

---[FILE: CiscoMerakiApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/CiscoMerakiApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class CiscoMerakiApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CiscoMerakiApi
```

--------------------------------------------------------------------------------

---[FILE: CiscoSecureEndpointApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/CiscoSecureEndpointApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class CiscoSecureEndpointApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CiscoSecureEndpointApi
```

--------------------------------------------------------------------------------

---[FILE: CiscoUmbrellaApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/CiscoUmbrellaApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class CiscoUmbrellaApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CiscoUmbrellaApi
```

--------------------------------------------------------------------------------

---[FILE: CiscoWebexOAuth2Api.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/CiscoWebexOAuth2Api.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class CiscoWebexOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CiscoWebexOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: ClearbitApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/ClearbitApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ClearbitApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClearbitApi
```

--------------------------------------------------------------------------------

---[FILE: ClickUpApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/ClickUpApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ClickUpApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClickUpApi
```

--------------------------------------------------------------------------------

---[FILE: ClickUpOAuth2Api.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/ClickUpOAuth2Api.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ClickUpOAuth2Api implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClickUpOAuth2Api
```

--------------------------------------------------------------------------------

---[FILE: ClockifyApi.credentials.ts]---
Location: n8n-master/packages/nodes-base/credentials/ClockifyApi.credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class ClockifyApi implements ICredentialType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClockifyApi
```

--------------------------------------------------------------------------------

````
