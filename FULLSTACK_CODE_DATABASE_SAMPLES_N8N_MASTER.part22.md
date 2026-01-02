---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 22
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 22 of 51)

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

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/src/sso.ee/oidc/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const OIDC_PREFERENCES_DB_KEY = 'features.oidc';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OIDC_PREFERENCES_DB_KEY
- OIDC_LOGIN_ENABLED
- OIDC_CLIENT_SECRET_REDACTED_VALUE
```

--------------------------------------------------------------------------------

---[FILE: oidc.service.ee.ts]---
Location: n8n-master/packages/cli/src/sso.ee/oidc/oidc.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class OidcService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OidcService
```

--------------------------------------------------------------------------------

---[FILE: oidc.controller.ee.ts]---
Location: n8n-master/packages/cli/src/sso.ee/oidc/routes/oidc.controller.ee.ts
Signals: Express
Excerpt (<=80 chars): export class OidcController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OidcController
```

--------------------------------------------------------------------------------

---[FILE: oidc.controller.ee.test.ts]---
Location: n8n-master/packages/cli/src/sso.ee/oidc/routes/__tests__/oidc.controller.ee.test.ts
Signals: Express
Excerpt (<=80 chars): import type { Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: oidc.service.ee.test.ts]---
Location: n8n-master/packages/cli/src/sso.ee/oidc/__tests__/oidc.service.ee.test.ts
Signals: Zod
Excerpt (<=80 chars): import type { OidcConfigDto } from '@n8n/api-types';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const SAML_PREFERENCES_DB_KEY = 'features.saml';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SAML_PREFERENCES_DB_KEY
- SAML_LOGIN_LABEL
- SAML_LOGIN_ENABLED
```

--------------------------------------------------------------------------------

---[FILE: saml-helpers.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/saml-helpers.ts
Signals: N/A
Excerpt (<=80 chars): export function isSamlLoginEnabled(): boolean {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isSamlLoginEnabled
- getSamlLoginLabel
- setSamlLoginLabel
- isSamlLicensed
- isSamlLicensedAndEnabled
- getMappedSamlAttributesFromFlowResult
- isConnectionTestRequest
- isSamlPreferences
```

--------------------------------------------------------------------------------

---[FILE: saml-validator.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/saml-validator.ts
Signals: N/A
Excerpt (<=80 chars): export class SamlValidator {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SamlValidator
```

--------------------------------------------------------------------------------

---[FILE: saml.service.ee.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/saml.service.ee.ts
Signals: Express
Excerpt (<=80 chars): export class SamlService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SamlService
```

--------------------------------------------------------------------------------

---[FILE: service-provider.ee.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/service-provider.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export function getServiceProviderEntityId(): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getServiceProviderEntityId
- getServiceProviderReturnUrl
- getServiceProviderConfigTestReturnUrl
- getServiceProviderInstance
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type SamlLoginBinding = SamlPreferences['loginBinding'];

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SamlLoginBinding
- SamlAttributeMapping
- SamlUserAttributes
```

--------------------------------------------------------------------------------

---[FILE: invalid-saml-metadata-url.error.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/errors/invalid-saml-metadata-url.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class InvalidSamlMetadataUrlError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidSamlMetadataUrlError
```

--------------------------------------------------------------------------------

---[FILE: invalid-saml-metadata.error.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/errors/invalid-saml-metadata.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class InvalidSamlMetadataError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvalidSamlMetadataError
```

--------------------------------------------------------------------------------

---[FILE: saml-enabled-middleware.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/middleware/saml-enabled-middleware.ts
Signals: Express
Excerpt (<=80 chars):  export const samlLicensedAndEnabledMiddleware: RequestHandler = (_, res, nex...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: saml.controller.ee.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/routes/saml.controller.ee.ts
Signals: Express
Excerpt (<=80 chars): export class SamlController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SamlController
```

--------------------------------------------------------------------------------

---[FILE: saml.controller.ee.test.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/routes/__tests__/saml.controller.ee.test.ts
Signals: Express
Excerpt (<=80 chars): import { GLOBAL_OWNER_ROLE, type User } from '@n8n/db';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: init-sso-post.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/views/init-sso-post.ts
Signals: N/A
Excerpt (<=80 chars):  export function getInitSSOFormView(context: PostBindingContext): string {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getInitSSOFormView
```

--------------------------------------------------------------------------------

---[FILE: saml.service.ee.test.ts]---
Location: n8n-master/packages/cli/src/sso.ee/saml/__tests__/saml.service.ee.test.ts
Signals: Express
Excerpt (<=80 chars): import type { SamlPreferences } from '@n8n/api-types';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: default-task-runner-disconnect-analyzer.ts]---
Location: n8n-master/packages/cli/src/task-runners/default-task-runner-disconnect-analyzer.ts
Signals: N/A
Excerpt (<=80 chars): export class DefaultTaskRunnerDisconnectAnalyzer implements DisconnectAnalyzer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DefaultTaskRunnerDisconnectAnalyzer
```

--------------------------------------------------------------------------------

---[FILE: forward-to-logger.ts]---
Location: n8n-master/packages/cli/src/task-runners/forward-to-logger.ts
Signals: N/A
Excerpt (<=80 chars): export function forwardToLogger(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- forwardToLogger
```

--------------------------------------------------------------------------------

---[FILE: internal-task-runner-disconnect-analyzer.ts]---
Location: n8n-master/packages/cli/src/task-runners/internal-task-runner-disconnect-analyzer.ts
Signals: N/A
Excerpt (<=80 chars): export class InternalTaskRunnerDisconnectAnalyzer extends DefaultTaskRunnerDi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InternalTaskRunnerDisconnectAnalyzer
```

--------------------------------------------------------------------------------

---[FILE: node-process-oom-detector.ts]---
Location: n8n-master/packages/cli/src/task-runners/node-process-oom-detector.ts
Signals: N/A
Excerpt (<=80 chars): export class NodeProcessOomDetector {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeProcessOomDetector
```

--------------------------------------------------------------------------------

---[FILE: sliding-window-signal.ts]---
Location: n8n-master/packages/cli/src/task-runners/sliding-window-signal.ts
Signals: N/A
Excerpt (<=80 chars):  export type SlidingWindowSignalOpts = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SlidingWindowSignal
- SlidingWindowSignalOpts
```

--------------------------------------------------------------------------------

---[FILE: task-runner-lifecycle-events.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-runner-lifecycle-events.ts
Signals: N/A
Excerpt (<=80 chars): export class TaskRunnerLifecycleEvents extends TypedEmitter<TaskRunnerLifecyc...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerLifecycleEvents
```

--------------------------------------------------------------------------------

---[FILE: task-runner-module.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-runner-module.ts
Signals: N/A
Excerpt (<=80 chars): export class TaskRunnerModule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerModule
```

--------------------------------------------------------------------------------

---[FILE: task-runner-process-base.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-runner-process-base.ts
Signals: N/A
Excerpt (<=80 chars):  export type ChildProcess = ReturnType<typeof spawn>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChildProcess
- ExitReason
- TaskRunnerProcessEventMap
```

--------------------------------------------------------------------------------

---[FILE: task-runner-process-js.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-runner-process-js.ts
Signals: N/A
Excerpt (<=80 chars): export class JsTaskRunnerProcess extends TaskRunnerProcessBase {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JsTaskRunnerProcess
```

--------------------------------------------------------------------------------

---[FILE: task-runner-process-py.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-runner-process-py.ts
Signals: N/A
Excerpt (<=80 chars): export class PyTaskRunnerProcess extends TaskRunnerProcessBase {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PyTaskRunnerProcess
```

--------------------------------------------------------------------------------

---[FILE: task-runner-process-restart-loop-detector.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-runner-process-restart-loop-detector.ts
Signals: N/A
Excerpt (<=80 chars): export class TaskRunnerProcessRestartLoopDetector extends TypedEmitter<TaskRu...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerProcessRestartLoopDetector
```

--------------------------------------------------------------------------------

---[FILE: missing-auth-token.error.ts]---
Location: n8n-master/packages/cli/src/task-runners/errors/missing-auth-token.error.ts
Signals: N/A
Excerpt (<=80 chars): export class MissingAuthTokenError extends Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MissingAuthTokenError
```

--------------------------------------------------------------------------------

---[FILE: missing-requirements.error.ts]---
Location: n8n-master/packages/cli/src/task-runners/errors/missing-requirements.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class MissingRequirementsError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MissingRequirementsError
```

--------------------------------------------------------------------------------

---[FILE: task-request-timeout.error.ts]---
Location: n8n-master/packages/cli/src/task-runners/errors/task-request-timeout.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TaskRequestTimeoutError extends OperationalError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRequestTimeoutError
```

--------------------------------------------------------------------------------

---[FILE: task-runner-disconnected-error.ts]---
Location: n8n-master/packages/cli/src/task-runners/errors/task-runner-disconnected-error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TaskRunnerDisconnectedError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerDisconnectedError
```

--------------------------------------------------------------------------------

---[FILE: task-runner-failed-heartbeat.error.ts]---
Location: n8n-master/packages/cli/src/task-runners/errors/task-runner-failed-heartbeat.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TaskRunnerFailedHeartbeatError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerFailedHeartbeatError
```

--------------------------------------------------------------------------------

---[FILE: task-runner-oom-error.ts]---
Location: n8n-master/packages/cli/src/task-runners/errors/task-runner-oom-error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TaskRunnerOomError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerOomError
```

--------------------------------------------------------------------------------

---[FILE: task-runner-restart-loop-error.ts]---
Location: n8n-master/packages/cli/src/task-runners/errors/task-runner-restart-loop-error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TaskRunnerRestartLoopError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerRestartLoopError
```

--------------------------------------------------------------------------------

---[FILE: task-broker-server.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-broker/task-broker-server.ts
Signals: Express
Excerpt (<=80 chars): export class TaskBrokerServer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskBrokerServer
```

--------------------------------------------------------------------------------

---[FILE: task-broker-types.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-broker/task-broker-types.ts
Signals: Express
Excerpt (<=80 chars):  export interface DisconnectAnalyzer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskBrokerServerInitResponse
- DisconnectReason
- DisconnectErrorOptions
- DisconnectAnalyzer
- TaskBrokerServerInitRequest
```

--------------------------------------------------------------------------------

---[FILE: task-broker-ws-server.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-broker/task-broker-ws-server.ts
Signals: N/A
Excerpt (<=80 chars): export class TaskBrokerWsServer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskBrokerWsServer
```

--------------------------------------------------------------------------------

---[FILE: task-broker.service.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-broker/task-broker.service.ts
Signals: N/A
Excerpt (<=80 chars):  export interface TaskRunner {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskBroker
- MessageCallback
- RequesterMessageCallback
- TaskRunner
- Task
- TaskOffer
- TaskRequest
```

--------------------------------------------------------------------------------

---[FILE: task-broker-auth.controller.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-broker/auth/task-broker-auth.controller.ts
Signals: Express
Excerpt (<=80 chars): export class TaskBrokerAuthController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskBrokerAuthController
```

--------------------------------------------------------------------------------

---[FILE: task-broker-auth.schema.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-broker/auth/task-broker-auth.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const taskBrokerAuthRequestBodySchema = z.object({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- taskBrokerAuthRequestBodySchema
```

--------------------------------------------------------------------------------

---[FILE: task-broker-auth.service.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-broker/auth/task-broker-auth.service.ts
Signals: N/A
Excerpt (<=80 chars): export class TaskBrokerAuthService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskBrokerAuthService
```

--------------------------------------------------------------------------------

---[FILE: task-broker-auth.controller.test.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-broker/auth/__tests__/task-broker-auth.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import { mockInstance } from '@n8n/backend-test-utils';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: task-deferred.error.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-broker/errors/task-deferred.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TaskDeferredError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskDeferredError
```

--------------------------------------------------------------------------------

---[FILE: task-reject.error.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-broker/errors/task-reject.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TaskRejectError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRejectError
```

--------------------------------------------------------------------------------

---[FILE: task-runner-accept-timeout.error.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-broker/errors/task-runner-accept-timeout.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TaskRunnerAcceptTimeoutError extends OperationalError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerAcceptTimeoutError
```

--------------------------------------------------------------------------------

---[FILE: task-runner-execution-timeout.error.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-broker/errors/task-runner-execution-timeout.error.ts
Signals: N/A
Excerpt (<=80 chars):  export class TaskRunnerExecutionTimeoutError extends OperationalError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerExecutionTimeoutError
```

--------------------------------------------------------------------------------

---[FILE: data-request-response-builder.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-managers/data-request-response-builder.ts
Signals: N/A
Excerpt (<=80 chars): export class DataRequestResponseBuilder {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataRequestResponseBuilder
```

--------------------------------------------------------------------------------

---[FILE: data-request-response-stripper.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-managers/data-request-response-stripper.ts
Signals: N/A
Excerpt (<=80 chars): export class DataRequestResponseStripper {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DataRequestResponseStripper
```

--------------------------------------------------------------------------------

---[FILE: local-task-requester.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-managers/local-task-requester.ts
Signals: N/A
Excerpt (<=80 chars): export class LocalTaskRequester extends TaskRequester {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LocalTaskRequester
```

--------------------------------------------------------------------------------

---[FILE: task-requester.ts]---
Location: n8n-master/packages/cli/src/task-runners/task-managers/task-requester.ts
Signals: N/A
Excerpt (<=80 chars):  export type RequestAccept = (jobId: string) => void;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RequestAccept
- RequestReject
- TaskAccept
- TaskReject
- RunnerStatus
- TaskRequest
- Task
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/cli/src/telemetry/index.ts
Signals: N/A
Excerpt (<=80 chars): export class Telemetry {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Telemetry
```

--------------------------------------------------------------------------------

---[FILE: commands.types.ts]---
Location: n8n-master/packages/cli/src/types/commands.types.ts
Signals: N/A
Excerpt (<=80 chars):  export interface IResult {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IResult
- IExecutionResult
- IWorkflowExecutionProgress
- INodeSpecialCases
- INodeSpecialCase
```

--------------------------------------------------------------------------------

---[FILE: interfaces.ts]---
Location: n8n-master/packages/cli/src/user-management/email/interfaces.ts
Signals: N/A
Excerpt (<=80 chars): export type InviteEmailData = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InviteEmailData
- PasswordResetData
- SendEmailResult
- MailData
```

--------------------------------------------------------------------------------

---[FILE: node-mailer.ts]---
Location: n8n-master/packages/cli/src/user-management/email/node-mailer.ts
Signals: N/A
Excerpt (<=80 chars): export class NodeMailer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeMailer
```

--------------------------------------------------------------------------------

---[FILE: user-management-mailer.ts]---
Location: n8n-master/packages/cli/src/user-management/email/user-management-mailer.ts
Signals: N/A
Excerpt (<=80 chars): export class UserManagementMailer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserManagementMailer
```

--------------------------------------------------------------------------------

---[FILE: circuit-breaker.ts]---
Location: n8n-master/packages/cli/src/utils/circuit-breaker.ts
Signals: N/A
Excerpt (<=80 chars): export class CircuitBreakerOpen extends Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CircuitBreakerOpen
- CircuitBreaker
- CircuitBreakerOptions
```

--------------------------------------------------------------------------------

---[FILE: compression.util.ts]---
Location: n8n-master/packages/cli/src/utils/compression.util.ts
Signals: N/A
Excerpt (<=80 chars):  export interface CompressionOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CompressionOptions
- DecompressionOptions
```

--------------------------------------------------------------------------------

---[FILE: get-item-count-by-connection-type.ts]---
Location: n8n-master/packages/cli/src/utils/get-item-count-by-connection-type.ts
Signals: N/A
Excerpt (<=80 chars):  export function getItemCountByConnectionType(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getItemCountByConnectionType
```

--------------------------------------------------------------------------------

---[FILE: handlebars.util.ts]---
Location: n8n-master/packages/cli/src/utils/handlebars.util.ts
Signals: N/A
Excerpt (<=80 chars): export function createHandlebarsEngine() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createHandlebarsEngine
```

--------------------------------------------------------------------------------

---[FILE: object-to-error.ts]---
Location: n8n-master/packages/cli/src/utils/object-to-error.ts
Signals: N/A
Excerpt (<=80 chars):  export function objectToError(errorObject: unknown, workflow: Workflow): Err...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- objectToError
```

--------------------------------------------------------------------------------

---[FILE: sliding-window.ts]---
Location: n8n-master/packages/cli/src/utils/sliding-window.ts
Signals: N/A
Excerpt (<=80 chars): export interface SlidingWindowOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SlidingWindow
- SlidingWindowOptions
```

--------------------------------------------------------------------------------

---[FILE: validate-database-type.ts]---
Location: n8n-master/packages/cli/src/utils/validate-database-type.ts
Signals: N/A
Excerpt (<=80 chars): export const supportedTypesForExport = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateDbTypeForExportEntities
- validateDbTypeForImportEntities
- supportedTypesForExport
- supportedTypesForImport
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/src/webhooks/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const authAllowlistedNodes = new Set([CHAT_TRIGGER_NODE_TYPE]);

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- authAllowlistedNodes
```

--------------------------------------------------------------------------------

---[FILE: live-webhooks.ts]---
Location: n8n-master/packages/cli/src/webhooks/live-webhooks.ts
Signals: Express
Excerpt (<=80 chars): export class LiveWebhooks implements IWebhookManager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LiveWebhooks
```

--------------------------------------------------------------------------------

---[FILE: test-webhook-registrations.service.ts]---
Location: n8n-master/packages/cli/src/webhooks/test-webhook-registrations.service.ts
Signals: N/A
Excerpt (<=80 chars):  export type TestWebhookRegistration = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestWebhookRegistrationsService
- TestWebhookRegistration
```

--------------------------------------------------------------------------------

---[FILE: test-webhooks.ts]---
Location: n8n-master/packages/cli/src/webhooks/test-webhooks.ts
Signals: Express
Excerpt (<=80 chars): export class TestWebhooks implements IWebhookManager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TestWebhooks
```

--------------------------------------------------------------------------------

---[FILE: waiting-forms.ts]---
Location: n8n-master/packages/cli/src/webhooks/waiting-forms.ts
Signals: Express
Excerpt (<=80 chars): export class WaitingForms extends WaitingWebhooks {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WaitingForms
```

--------------------------------------------------------------------------------

---[FILE: waiting-webhooks.ts]---
Location: n8n-master/packages/cli/src/webhooks/waiting-webhooks.ts
Signals: Express
Excerpt (<=80 chars): export class WaitingWebhooks implements IWebhookManager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WaitingWebhooks
```

--------------------------------------------------------------------------------

---[FILE: webhook-execution-context.ts]---
Location: n8n-master/packages/cli/src/webhooks/webhook-execution-context.ts
Signals: N/A
Excerpt (<=80 chars): export class WebhookExecutionContext {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookExecutionContext
```

--------------------------------------------------------------------------------

---[FILE: webhook-form-data.ts]---
Location: n8n-master/packages/cli/src/webhooks/webhook-form-data.ts
Signals: N/A
Excerpt (<=80 chars): export const createMultiFormDataParser = (maxFormDataSizeInMb: number) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createMultiFormDataParser
```

--------------------------------------------------------------------------------

---[FILE: webhook-helpers.ts]---
Location: n8n-master/packages/cli/src/webhooks/webhook-helpers.ts
Signals: Express
Excerpt (<=80 chars):  export function handleHostedChatResponse(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleHostedChatResponse
- getWorkflowWebhooks
- autoDetectResponseMode
- setupResponseNodePromise
- prepareExecutionData
- _privateGetWebhookErrorMessage
- handleFormRedirectionCase
```

--------------------------------------------------------------------------------

---[FILE: webhook-on-received-response-extractor.ts]---
Location: n8n-master/packages/cli/src/webhooks/webhook-on-received-response-extractor.ts
Signals: N/A
Excerpt (<=80 chars): export function extractWebhookOnReceivedResponse(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- extractWebhookOnReceivedResponse
```

--------------------------------------------------------------------------------

---[FILE: webhook-request-handler.ts]---
Location: n8n-master/packages/cli/src/webhooks/webhook-request-handler.ts
Signals: Express
Excerpt (<=80 chars):  export function createWebhookHandlerFor(webhookManager: IWebhookManager) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createWebhookHandlerFor
```

--------------------------------------------------------------------------------

---[FILE: webhook-request-sanitizer.ts]---
Location: n8n-master/packages/cli/src/webhooks/webhook-request-sanitizer.ts
Signals: Express
Excerpt (<=80 chars):  export const sanitizeWebhookRequest = (req: Request) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sanitizeWebhookRequest
```

--------------------------------------------------------------------------------

---[FILE: webhook-response.ts]---
Location: n8n-master/packages/cli/src/webhooks/webhook-response.ts
Signals: N/A
Excerpt (<=80 chars):  export const WebhookResponseTag = Symbol('WebhookResponse');

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookResponseTag
- isWebhookResponse
- isWebhookNoResponse
- isWebhookStaticResponse
- isWebhookStreamResponse
- createNoResponse
- createStaticResponse
- createStreamResponse
- WebhookNoResponse
- WebhookStaticResponse
- WebhookResponseStream
- WebhookResponse
```

--------------------------------------------------------------------------------

---[FILE: webhook-server.ts]---
Location: n8n-master/packages/cli/src/webhooks/webhook-server.ts
Signals: N/A
Excerpt (<=80 chars): export class WebhookServer extends AbstractServer {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookServer
```

--------------------------------------------------------------------------------

---[FILE: webhook.service.ts]---
Location: n8n-master/packages/cli/src/webhooks/webhook.service.ts
Signals: N/A
Excerpt (<=80 chars): export class WebhookService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookService
```

--------------------------------------------------------------------------------

---[FILE: webhook.types.ts]---
Location: n8n-master/packages/cli/src/webhooks/webhook.types.ts
Signals: Express
Excerpt (<=80 chars):  export type WebhookOptionsRequest = Request & { method: 'OPTIONS' };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhookOptionsRequest
- WebhookRequest
- WaitingWebhookRequest
- Method
- WebhookResponseHeaders
- WebhookNodeResponseHeaders
- WebhookAccessControlOptions
- IWebhookManager
- IWebhookResponseCallbackData
```

--------------------------------------------------------------------------------

---[FILE: webhooks.controller.ts]---
Location: n8n-master/packages/cli/src/webhooks/webhooks.controller.ts
Signals: Express
Excerpt (<=80 chars): export class WebhooksController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebhooksController
```

--------------------------------------------------------------------------------

---[FILE: live-webhooks.test.ts]---
Location: n8n-master/packages/cli/src/webhooks/__tests__/live-webhooks.test.ts
Signals: Express
Excerpt (<=80 chars): import { mockLogger } from '@n8n/backend-test-utils';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: test-webhooks.test.ts]---
Location: n8n-master/packages/cli/src/webhooks/__tests__/test-webhooks.test.ts
Signals: Express
Excerpt (<=80 chars): import type { WorkflowEntity } from '@n8n/db';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: waiting-forms.test.ts]---
Location: n8n-master/packages/cli/src/webhooks/__tests__/waiting-forms.test.ts
Signals: Express
Excerpt (<=80 chars): import type { IExecutionResponse, ExecutionRepository } from '@n8n/db';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: waiting-webhooks.test.ts]---
Location: n8n-master/packages/cli/src/webhooks/__tests__/waiting-webhooks.test.ts
Signals: Express
Excerpt (<=80 chars): import type { IExecutionResponse, ExecutionRepository } from '@n8n/db';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: webhook-form-data.test.ts]---
Location: n8n-master/packages/cli/src/webhooks/__tests__/webhook-form-data.test.ts
Signals: Express
Excerpt (<=80 chars): import express from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: webhook-helpers.test.ts]---
Location: n8n-master/packages/cli/src/webhooks/__tests__/webhook-helpers.test.ts
Signals: Express
Excerpt (<=80 chars): import { Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: webhook-request-handler.test.ts]---
Location: n8n-master/packages/cli/src/webhooks/__tests__/webhook-request-handler.test.ts
Signals: Express
Excerpt (<=80 chars): import { type Response } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: webhook-request-sanitizer.test.ts]---
Location: n8n-master/packages/cli/src/webhooks/__tests__/webhook-request-sanitizer.test.ts
Signals: Express
Excerpt (<=80 chars): import type { Request } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: workflow-execution.service.ts]---
Location: n8n-master/packages/cli/src/workflows/workflow-execution.service.ts
Signals: Express
Excerpt (<=80 chars): export class WorkflowExecutionService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowExecutionService
```

--------------------------------------------------------------------------------

---[FILE: workflow-finder.service.ts]---
Location: n8n-master/packages/cli/src/workflows/workflow-finder.service.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowFinderService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowFinderService
```

--------------------------------------------------------------------------------

---[FILE: workflow-sharing.service.ts]---
Location: n8n-master/packages/cli/src/workflows/workflow-sharing.service.ts
Signals: N/A
Excerpt (<=80 chars):  export type ShareWorkflowOptions =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowSharingService
- ShareWorkflowOptions
```

--------------------------------------------------------------------------------

---[FILE: workflow-static-data.service.ts]---
Location: n8n-master/packages/cli/src/workflows/workflow-static-data.service.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowStaticDataService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowStaticDataService
```

--------------------------------------------------------------------------------

---[FILE: workflow-validation.service.ts]---
Location: n8n-master/packages/cli/src/workflows/workflow-validation.service.ts
Signals: N/A
Excerpt (<=80 chars):  export interface WorkflowValidationResult {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowValidationService
- WorkflowValidationResult
```

--------------------------------------------------------------------------------

---[FILE: workflow.formatter.ts]---
Location: n8n-master/packages/cli/src/workflows/workflow.formatter.ts
Signals: N/A
Excerpt (<=80 chars): export function formatWorkflow(workflow: IWorkflowBase) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- formatWorkflow
```

--------------------------------------------------------------------------------

---[FILE: workflow.service.ee.ts]---
Location: n8n-master/packages/cli/src/workflows/workflow.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class EnterpriseWorkflowService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EnterpriseWorkflowService
```

--------------------------------------------------------------------------------

---[FILE: workflow.service.ts]---
Location: n8n-master/packages/cli/src/workflows/workflow.service.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowService
```

--------------------------------------------------------------------------------

````
