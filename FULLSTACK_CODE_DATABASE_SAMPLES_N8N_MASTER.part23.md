---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 23
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 23 of 51)

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

---[FILE: workflows.controller.ts]---
Location: n8n-master/packages/cli/src/workflows/workflows.controller.ts
Signals: Express, Zod
Excerpt (<=80 chars): export class WorkflowsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowsController
```

--------------------------------------------------------------------------------

---[FILE: workflow-history-helper.ts]---
Location: n8n-master/packages/cli/src/workflows/workflow-history/workflow-history-helper.ts
Signals: N/A
Excerpt (<=80 chars):  export function getWorkflowHistoryLicensePruneTime() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getWorkflowHistoryLicensePruneTime
- getWorkflowHistoryPruneTime
```

--------------------------------------------------------------------------------

---[FILE: workflow-history-manager.ts]---
Location: n8n-master/packages/cli/src/workflows/workflow-history/workflow-history-manager.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowHistoryManager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowHistoryManager
```

--------------------------------------------------------------------------------

---[FILE: workflow-history.controller.ts]---
Location: n8n-master/packages/cli/src/workflows/workflow-history/workflow-history.controller.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowHistoryController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowHistoryController
```

--------------------------------------------------------------------------------

---[FILE: workflow-history.service.ts]---
Location: n8n-master/packages/cli/src/workflows/workflow-history/workflow-history.service.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowHistoryService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowHistoryService
```

--------------------------------------------------------------------------------

---[FILE: workflows.controller.test.ts]---
Location: n8n-master/packages/cli/src/workflows/__tests__/workflows.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import type { ImportWorkflowFromUrlDto } from '@n8n/api-types';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: active-executions.test.ts]---
Location: n8n-master/packages/cli/src/__tests__/active-executions.test.ts
Signals: Express
Excerpt (<=80 chars): import { Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: command-registry.test.ts]---
Location: n8n-master/packages/cli/src/__tests__/command-registry.test.ts
Signals: Zod
Excerpt (<=80 chars): import type { Logger, ModuleRegistry } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: controller.registry.test.ts]---
Location: n8n-master/packages/cli/src/__tests__/controller.registry.test.ts
Signals: Express
Excerpt (<=80 chars): jest.mock('@n8n/backend-common', () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: credentials-overwrites.test.ts]---
Location: n8n-master/packages/cli/src/__tests__/credentials-overwrites.test.ts
Signals: Express
Excerpt (<=80 chars): import type { Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: project.test-data.ts]---
Location: n8n-master/packages/cli/src/__tests__/project.test-data.ts
Signals: N/A
Excerpt (<=80 chars):  export const createRawProjectData = (payload: Partial<RawProjectData>): Proj...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createRawProjectData
```

--------------------------------------------------------------------------------

---[FILE: response-helper.test.ts]---
Location: n8n-master/packages/cli/src/__tests__/response-helper.test.ts
Signals: Express
Excerpt (<=80 chars): import type { Response } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: workflow-runner.test.ts]---
Location: n8n-master/packages/cli/src/__tests__/workflow-runner.test.ts
Signals: Express
Excerpt (<=80 chars): import { testDb, createWorkflow, mockInstance } from '@n8n/backend-test-utils';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: teardown.ts]---
Location: n8n-master/packages/cli/test/teardown.ts
Signals: TypeORM
Excerpt (<=80 chars): import 'tsconfig-paths/register';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: shared-setup.ts]---
Location: n8n-master/packages/cli/test/integration/access-control/shared-setup.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TestContext {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTestServer
- validateUserRoles
- validateProjects
- validateCustomRoles
- TestContext
```

--------------------------------------------------------------------------------

---[FILE: test-payloads.ts]---
Location: n8n-master/packages/cli/test/integration/access-control/test-payloads.ts
Signals: N/A
Excerpt (<=80 chars): export function createBasicWorkflowPayload(name: string, projectId?: string) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createBasicWorkflowPayload
- createComplexWorkflowPayload
- createWorkflowUpdatePayload
- createBasicCredentialPayload
- createHttpBasicAuthCredentialPayload
- createHttpHeaderAuthCredentialPayload
- createCredentialUpdatePayload
- createWorkflowSharePayload
- createCredentialSharePayload
- createWorkflowTransferPayload
- createCredentialTransferPayload
- TEST_WORKFLOW_NAMES
- TEST_CREDENTIAL_NAMES
```

--------------------------------------------------------------------------------

---[FILE: credentials.cmd.test.ts]---
Location: n8n-master/packages/cli/test/integration/commands/credentials.cmd.test.ts
Signals: Zod
Excerpt (<=80 chars): import { getPersonalProject, mockInstance, testDb } from '@n8n/backend-test-u...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: import.cmd.test.ts]---
Location: n8n-master/packages/cli/test/integration/commands/import.cmd.test.ts
Signals: Zod
Excerpt (<=80 chars): import {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: assertions.ts]---
Location: n8n-master/packages/cli/test/integration/controllers/invitation/assertions.ts
Signals: N/A
Excerpt (<=80 chars):  export function assertReturnedUserProps(user: User) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- assertReturnedUserProps
- assertStoredUserProps
- assertUserInviteResult
```

--------------------------------------------------------------------------------

---[FILE: oauth2.api.test.ts]---
Location: n8n-master/packages/cli/test/integration/controllers/oauth/oauth2.api.test.ts
Signals: Express
Excerpt (<=80 chars): import { testDb } from '@n8n/backend-test-utils';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: oauth2.skip-auth.api.test.ts]---
Location: n8n-master/packages/cli/test/integration/controllers/oauth/oauth2.skip-auth.api.test.ts
Signals: Express
Excerpt (<=80 chars): /**

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: body-parser.test.ts]---
Location: n8n-master/packages/cli/test/integration/middlewares/body-parser.test.ts
Signals: Express
Excerpt (<=80 chars): import type { Request, Response } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: saml.api.test.ts]---
Location: n8n-master/packages/cli/test/integration/saml/saml.api.test.ts
Signals: Express
Excerpt (<=80 chars): import { randomEmail, randomName, randomValidPassword } from '@n8n/backend-te...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: sample-metadata.ts]---
Location: n8n-master/packages/cli/test/integration/saml/sample-metadata.ts
Signals: N/A
Excerpt (<=80 chars): export const sampleMetadata =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sampleMetadata
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/cli/test/integration/security-audit/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function getRiskSection<C extends Risk.Category>(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- simulateOutdatedInstanceOnce
- simulateUpToDateInstance
- MOCK_09990_N8N_VERSION
- MOCK_01110_N8N_VERSION
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/test/integration/shared/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const REST_PATH_SEGMENT = Container.get(GlobalConfig).endpoints.rest;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- REST_PATH_SEGMENT
- PUBLIC_API_REST_PATH_SEGMENT
- SUCCESS_RESPONSE_BODY
- LOGGED_OUT_RESPONSE_BODY
- COMMUNITY_PACKAGE_VERSION
- COMMUNITY_NODE_VERSION
```

--------------------------------------------------------------------------------

---[FILE: execution-context-helpers.ts]---
Location: n8n-master/packages/cli/test/integration/shared/execution-context-helpers.ts
Signals: N/A
Excerpt (<=80 chars): export function validateBasicContextStructure(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateBasicContextStructure
- validateContextSource
- validateRootContext
- validateChildContextParentage
- validateCredentialInheritance
- validateFreshTimestamp
- validateVersionInheritance
- validateSubWorkflowSource
- validateChildContextInheritance
- validateTimestampChain
- validateConsistentVersions
- validateContextInheritanceChain
```

--------------------------------------------------------------------------------

---[FILE: ldap.ts]---
Location: n8n-master/packages/cli/test/integration/shared/ldap.ts
Signals: N/A
Excerpt (<=80 chars):  export const defaultLdapConfig = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- defaultLdapConfig
- createLdapConfig
```

--------------------------------------------------------------------------------

---[FILE: license.ts]---
Location: n8n-master/packages/cli/test/integration/shared/license.ts
Signals: N/A
Excerpt (<=80 chars):  export interface LicenseMockDefaults {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseMocker
- LicenseMockDefaults
```

--------------------------------------------------------------------------------

---[FILE: retry-until.ts]---
Location: n8n-master/packages/cli/test/integration/shared/retry-until.ts
Signals: N/A
Excerpt (<=80 chars): export const retryUntil = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- retryUntil
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/cli/test/integration/shared/types.ts
Signals: Express
Excerpt (<=80 chars):  export interface SetupProps {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SuperAgentTest
- SaveCredentialFunction
- SetupProps
- TestServer
```

--------------------------------------------------------------------------------

---[FILE: workflow-fixtures.ts]---
Location: n8n-master/packages/cli/test/integration/shared/workflow-fixtures.ts
Signals: N/A
Excerpt (<=80 chars): export function createSubWorkflowFixture() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createSubWorkflowFixture
- createParentWorkflowFixture
- createMiddleWorkflowFixture
- createSimpleWorkflowFixture
- createErrorWorkflowFixture
- createFailingWorkflowFixture
- createWorkflowWithErrorHandlerFixture
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: n8n-master/packages/cli/test/integration/shared/workflow.ts
Signals: N/A
Excerpt (<=80 chars):  export const FIRST_CREDENTIAL_ID = '1';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getWorkflow
- FIRST_CREDENTIAL_ID
- SECOND_CREDENTIAL_ID
- THIRD_CREDENTIAL_ID
```

--------------------------------------------------------------------------------

---[FILE: credentials.ts]---
Location: n8n-master/packages/cli/test/integration/shared/db/credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export function affixRoleToSaveCredential(role: CredentialSharingRole) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- affixRoleToSaveCredential
- getCredentialById
```

--------------------------------------------------------------------------------

---[FILE: data-tables.ts]---
Location: n8n-master/packages/cli/test/integration/shared/db/data-tables.ts
Signals: N/A
Excerpt (<=80 chars):  export const createDataTable = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createDataTable
```

--------------------------------------------------------------------------------

---[FILE: evaluation.ts]---
Location: n8n-master/packages/cli/test/integration/shared/db/evaluation.ts
Signals: N/A
Excerpt (<=80 chars): export const createTestRun = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createTestRun
- createTestCaseExecution
```

--------------------------------------------------------------------------------

---[FILE: folders.ts]---
Location: n8n-master/packages/cli/test/integration/shared/db/folders.ts
Signals: N/A
Excerpt (<=80 chars):  export const createFolder = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createFolder
```

--------------------------------------------------------------------------------

---[FILE: users.ts]---
Location: n8n-master/packages/cli/test/integration/shared/db/users.ts
Signals: N/A
Excerpt (<=80 chars):  export const addApiKey = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- addApiKey
- getAllUsers
- getUserById
- getLdapIdentities
```

--------------------------------------------------------------------------------

---[FILE: community-nodes.ts]---
Location: n8n-master/packages/cli/test/integration/shared/utils/community-nodes.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockPackageName = () => NODE_PACKAGE_PREFIX + randomName();

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockPackagePair
- mockPackageName
- mockPackage
- mockNode
- emptyPackage
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/cli/test/integration/shared/utils/index.ts
Signals: N/A
Excerpt (<=80 chars): export function getAuthToken(response: request.Response, authCookieName = AUT...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getAuthToken
- makeWorkflow
- MOCK_PINDATA
```

--------------------------------------------------------------------------------

---[FILE: node-types-data.ts]---
Location: n8n-master/packages/cli/test/integration/shared/utils/node-types-data.ts
Signals: N/A
Excerpt (<=80 chars):  export function mockNodeTypesData(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockNodeTypesData
```

--------------------------------------------------------------------------------

---[FILE: task-broker-test-server.ts]---
Location: n8n-master/packages/cli/test/integration/shared/utils/task-broker-test-server.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TestTaskBrokerServer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setupBrokerTestServer
- TestTaskBrokerServer
```

--------------------------------------------------------------------------------

---[FILE: test-command.ts]---
Location: n8n-master/packages/cli/test/integration/shared/utils/test-command.ts
Signals: N/A
Excerpt (<=80 chars):  export const setupTestCommand = <T extends CommandClass>(Command: T) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setupTestCommand
```

--------------------------------------------------------------------------------

---[FILE: test-server.ts]---
Location: n8n-master/packages/cli/test/integration/shared/utils/test-server.ts
Signals: Express
Excerpt (<=80 chars):  export const setupTestServer = ({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setupTestServer
```

--------------------------------------------------------------------------------

---[FILE: users.ts]---
Location: n8n-master/packages/cli/test/integration/shared/utils/users.ts
Signals: N/A
Excerpt (<=80 chars):  export const validateUser = (user: PublicUser) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateUser
- UserInvitationResult
```

--------------------------------------------------------------------------------

---[FILE: 1760020838000-unique-role-names.test.ts]---
Location: n8n-master/packages/cli/test/migration/1760020838000-unique-role-names.test.ts
Signals: TypeORM
Excerpt (<=80 chars): import {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: 1763048000000-activate-execute-workflow-trigger-workflows.test.ts]---
Location: n8n-master/packages/cli/test/migration/1763048000000-activate-execute-workflow-trigger-workflows.test.ts
Signals: TypeORM
Excerpt (<=80 chars): import {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: migration-test-helpers.test.ts]---
Location: n8n-master/packages/cli/test/migration/migration-test-helpers.test.ts
Signals: TypeORM
Excerpt (<=80 chars): import { initDbUpToMigration, runSingleMigration } from '@n8n/backend-test-ut...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: n8n-master/packages/cli/test/shared/helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export function toITaskData(taskData: TaskData[], overrides?: Partial<ITaskD...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- toITaskData
```

--------------------------------------------------------------------------------

---[FILE: mock-objects.ts]---
Location: n8n-master/packages/cli/test/shared/mock-objects.ts
Signals: N/A
Excerpt (<=80 chars):  export const mockCredential = (): CredentialsEntity =>

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockCredential
- mockUser
- mockProject
```

--------------------------------------------------------------------------------

---[FILE: mocking.ts]---
Location: n8n-master/packages/cli/test/shared/mocking.ts
Signals: TypeORM
Excerpt (<=80 chars):  export const mockEntityManager = (entityClass: Class) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- mockEntityManager
- mockCipher
```

--------------------------------------------------------------------------------

---[FILE: test-data.ts]---
Location: n8n-master/packages/cli/test/shared/test-data.ts
Signals: N/A
Excerpt (<=80 chars): export const badPasswords = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- badPasswords
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/cli/test/shared/external-secrets/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export class MockProviders {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MockProviders
- DummyProvider
- AnotherDummyProvider
- ErrorProvider
- FailedProvider
- TestFailProvider
```

--------------------------------------------------------------------------------

---[FILE: credential-types.ts]---
Location: n8n-master/packages/core/nodes-testing/credential-types.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialTypes implements ICredentialTypes {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialTypes
```

--------------------------------------------------------------------------------

---[FILE: credentials-helper.ts]---
Location: n8n-master/packages/core/nodes-testing/credentials-helper.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialsHelper extends ICredentialsHelper {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsHelper
```

--------------------------------------------------------------------------------

---[FILE: load-nodes-and-credentials.ts]---
Location: n8n-master/packages/core/nodes-testing/load-nodes-and-credentials.ts
Signals: N/A
Excerpt (<=80 chars): export class LoadNodesAndCredentials {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LoadNodesAndCredentials
```

--------------------------------------------------------------------------------

---[FILE: node-test-harness.ts]---
Location: n8n-master/packages/core/nodes-testing/node-test-harness.ts
Signals: N/A
Excerpt (<=80 chars):  export class NodeTestHarness {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeTestHarness
```

--------------------------------------------------------------------------------

---[FILE: node-types.ts]---
Location: n8n-master/packages/core/nodes-testing/node-types.ts
Signals: N/A
Excerpt (<=80 chars): export class NodeTypes implements INodeTypes {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeTypes
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/core/src/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const CUSTOM_EXTENSION_ENV = 'N8N_CUSTOM_EXTENSIONS';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CUSTOM_EXTENSION_ENV
- PLACEHOLDER_EMPTY_EXECUTION_ID
- PLACEHOLDER_EMPTY_WORKFLOW_ID
- HTTP_REQUEST_NODE_TYPE
- HTTP_REQUEST_AS_TOOL_NODE_TYPE
- HTTP_REQUEST_TOOL_NODE_TYPE
- RESTRICT_FILE_ACCESS_TO
- BLOCK_FILE_ACCESS_TO_N8N_FILES
- CONFIG_FILES
- BINARY_DATA_STORAGE_PATH
- UM_EMAIL_TEMPLATES_INVITE
- UM_EMAIL_TEMPLATES_PWRESET
- CREDENTIAL_ERRORS
- WAITING_TOKEN_QUERY_PARAM
```

--------------------------------------------------------------------------------

---[FILE: credentials.ts]---
Location: n8n-master/packages/core/src/credentials.ts
Signals: N/A
Excerpt (<=80 chars):  export class CredentialDataError extends ApplicationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialDataError
- Credentials
```

--------------------------------------------------------------------------------

---[FILE: data-deduplication-service.ts]---
Location: n8n-master/packages/core/src/data-deduplication-service.ts
Signals: N/A
Excerpt (<=80 chars): export class DataDeduplicationService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataDeduplicationService
```

--------------------------------------------------------------------------------

---[FILE: html-sandbox.ts]---
Location: n8n-master/packages/core/src/html-sandbox.ts
Signals: N/A
Excerpt (<=80 chars):  export const isWebhookHtmlSandboxingDisabled = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isWebhookHtmlSandboxingDisabled
- getWebhookSandboxCSP
- isHtmlRenderedContentType
```

--------------------------------------------------------------------------------

---[FILE: http-proxy.ts]---
Location: n8n-master/packages/core/src/http-proxy.ts
Signals: N/A
Excerpt (<=80 chars):  export function createHttpProxyAgent(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createHttpProxyAgent
- createHttpsProxyAgent
- installGlobalProxyAgent
- uninstallGlobalProxyAgent
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/core/src/interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export type Class<T = object, A extends unknown[] = unknown[]> = new (...arg...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Class
- ExtendedValidationResult
- IResponseError
- IWorkflowSettings
- IWorkflowData
```

--------------------------------------------------------------------------------

---[FILE: node-execute-functions.ts]---
Location: n8n-master/packages/core/src/node-execute-functions.ts
Signals: N/A
Excerpt (<=80 chars): export function getExecutePollFunctions(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getExecutePollFunctions
- getExecuteTriggerFunctions
```

--------------------------------------------------------------------------------

---[FILE: binary-data.config.ts]---
Location: n8n-master/packages/core/src/binary-data/binary-data.config.ts
Signals: Zod
Excerpt (<=80 chars):  export const BINARY_DATA_MODES = ['default', 'filesystem', 's3', 'database']...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BINARY_DATA_MODES
- BinaryDataConfig
```

--------------------------------------------------------------------------------

---[FILE: binary-data.service.ts]---
Location: n8n-master/packages/core/src/binary-data/binary-data.service.ts
Signals: N/A
Excerpt (<=80 chars): export class BinaryDataService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BinaryDataService
```

--------------------------------------------------------------------------------

---[FILE: file-system.manager.ts]---
Location: n8n-master/packages/core/src/binary-data/file-system.manager.ts
Signals: N/A
Excerpt (<=80 chars):  export class FileSystemManager implements BinaryData.Manager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileSystemManager
```

--------------------------------------------------------------------------------

---[FILE: object-store.manager.ts]---
Location: n8n-master/packages/core/src/binary-data/object-store.manager.ts
Signals: N/A
Excerpt (<=80 chars): export class ObjectStoreManager implements BinaryData.Manager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ObjectStoreManager
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/core/src/binary-data/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type ConfigMode = (typeof BINARY_DATA_MODES)[number];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConfigMode
- ServiceMode
- StoredMode
- Metadata
- WriteResult
- PreWriteMetadata
- FileLocation
- SigningPayload
- Manager
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/core/src/binary-data/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export function isStoredMode(mode: string): mode is BinaryData.StoredMode {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isStoredMode
- FileLocation
```

--------------------------------------------------------------------------------

---[FILE: object-store.config.ts]---
Location: n8n-master/packages/core/src/binary-data/object-store/object-store.config.ts
Signals: Zod
Excerpt (<=80 chars):  export type Protocol = z.infer<typeof protocolSchema>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ObjectStoreConfig
- Protocol
```

--------------------------------------------------------------------------------

---[FILE: object-store.service.ee.ts]---
Location: n8n-master/packages/core/src/binary-data/object-store/object-store.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class ObjectStoreService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ObjectStoreService
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/core/src/binary-data/object-store/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type MetadataResponseHeaders = Record<string, string> & {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MetadataResponseHeaders
```

--------------------------------------------------------------------------------

---[FILE: cipher.ts]---
Location: n8n-master/packages/core/src/encryption/cipher.ts
Signals: N/A
Excerpt (<=80 chars): export class Cipher {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Cipher
```

--------------------------------------------------------------------------------

---[FILE: binary-data-file-not-found.error.ts]---
Location: n8n-master/packages/core/src/errors/binary-data-file-not-found.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class BinaryDataFileNotFoundError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BinaryDataFileNotFoundError
```

--------------------------------------------------------------------------------

---[FILE: disallowed-filepath.error.ts]---
Location: n8n-master/packages/core/src/errors/disallowed-filepath.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class DisallowedFilepathError extends FileSystemError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DisallowedFilepathError
```

--------------------------------------------------------------------------------

---[FILE: error-reporter.ts]---
Location: n8n-master/packages/core/src/errors/error-reporter.ts
Signals: N/A
Excerpt (<=80 chars): export class ErrorReporter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ErrorReporter
```

--------------------------------------------------------------------------------

---[FILE: file-not-found.error.ts]---
Location: n8n-master/packages/core/src/errors/file-not-found.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class FileNotFoundError extends FileSystemError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileNotFoundError
```

--------------------------------------------------------------------------------

---[FILE: file-too-large.error.ts]---
Location: n8n-master/packages/core/src/errors/file-too-large.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class FileTooLargeError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileTooLargeError
```

--------------------------------------------------------------------------------

---[FILE: invalid-execution-metadata.error.ts]---
Location: n8n-master/packages/core/src/errors/invalid-execution-metadata.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class InvalidExecutionMetadataError extends ApplicationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidExecutionMetadataError
```

--------------------------------------------------------------------------------

---[FILE: invalid-manager.error.ts]---
Location: n8n-master/packages/core/src/errors/invalid-manager.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class InvalidManagerError extends BinaryDataError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidManagerError
```

--------------------------------------------------------------------------------

---[FILE: invalid-source-type.error.ts]---
Location: n8n-master/packages/core/src/errors/invalid-source-type.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class InvalidSourceTypeError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidSourceTypeError
```

--------------------------------------------------------------------------------

---[FILE: missing-source-id.error.ts]---
Location: n8n-master/packages/core/src/errors/missing-source-id.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class MissingSourceIdError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MissingSourceIdError
```

--------------------------------------------------------------------------------

---[FILE: unrecognized-credential-type.error.ts]---
Location: n8n-master/packages/core/src/errors/unrecognized-credential-type.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class UnrecognizedCredentialTypeError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnrecognizedCredentialTypeError
```

--------------------------------------------------------------------------------

---[FILE: unrecognized-node-type.error.ts]---
Location: n8n-master/packages/core/src/errors/unrecognized-node-type.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class UnrecognizedNodeTypeError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnrecognizedNodeTypeError
```

--------------------------------------------------------------------------------

---[FILE: workflow-has-issues.error.ts]---
Location: n8n-master/packages/core/src/errors/workflow-has-issues.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowHasIssuesError extends WorkflowOperationError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowHasIssuesError
```

--------------------------------------------------------------------------------

---[FILE: active-workflows.ts]---
Location: n8n-master/packages/core/src/execution-engine/active-workflows.ts
Signals: N/A
Excerpt (<=80 chars): export class ActiveWorkflows {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActiveWorkflows
```

--------------------------------------------------------------------------------

---[FILE: execution-context-hook-registry.service.ts]---
Location: n8n-master/packages/core/src/execution-engine/execution-context-hook-registry.service.ts
Signals: N/A
Excerpt (<=80 chars): export class ExecutionContextHookRegistry {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionContextHookRegistry
```

--------------------------------------------------------------------------------

---[FILE: execution-context.service.ts]---
Location: n8n-master/packages/core/src/execution-engine/execution-context.service.ts
Signals: N/A
Excerpt (<=80 chars): export class ExecutionContextService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionContextService
```

--------------------------------------------------------------------------------

---[FILE: execution-context.ts]---
Location: n8n-master/packages/core/src/execution-engine/execution-context.ts
Signals: N/A
Excerpt (<=80 chars): export const establishExecutionContext = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- establishExecutionContext
```

--------------------------------------------------------------------------------

---[FILE: execution-lifecycle-hooks.ts]---
Location: n8n-master/packages/core/src/execution-engine/execution-lifecycle-hooks.ts
Signals: N/A
Excerpt (<=80 chars):  export type ExecutionLifecycleHookHandlers = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionLifecycleHooks
- ExecutionLifecycleHookHandlers
- ExecutionLifecycleHookName
```

--------------------------------------------------------------------------------

---[FILE: external-secrets-proxy.ts]---
Location: n8n-master/packages/core/src/execution-engine/external-secrets-proxy.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IExternalSecretsManager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExternalSecretsProxy
- IExternalSecretsManager
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/core/src/execution-engine/interfaces.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IGetExecutePollFunctions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IGetExecutePollFunctions
- IGetExecuteTriggerFunctions
```

--------------------------------------------------------------------------------

---[FILE: requests-response.ts]---
Location: n8n-master/packages/core/src/execution-engine/requests-response.ts
Signals: N/A
Excerpt (<=80 chars): export function handleRequest({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleRequest
- isEngineRequest
- makeEngineResponse
```

--------------------------------------------------------------------------------

---[FILE: routing-node.ts]---
Location: n8n-master/packages/core/src/execution-engine/routing-node.ts
Signals: N/A
Excerpt (<=80 chars):  export class RoutingNode {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RoutingNode
```

--------------------------------------------------------------------------------

---[FILE: scheduled-task-manager.ts]---
Location: n8n-master/packages/core/src/execution-engine/scheduled-task-manager.ts
Signals: N/A
Excerpt (<=80 chars): export class ScheduledTaskManager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScheduledTaskManager
```

--------------------------------------------------------------------------------

````
