---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 16
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 16 of 51)

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

---[FILE: workflow-runner.ts]---
Location: n8n-master/packages/cli/src/workflow-runner.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowRunner {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowRunner
```

--------------------------------------------------------------------------------

---[FILE: zod-alias-support.ts]---
Location: n8n-master/packages/cli/src/zod-alias-support.ts
Signals: Zod
Excerpt (<=80 chars): import { z } from 'zod';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth.service.ts]---
Location: n8n-master/packages/cli/src/auth/auth.service.ts
Signals: Express
Excerpt (<=80 chars): export class AuthService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthService
```

--------------------------------------------------------------------------------

---[FILE: jwt.ts]---
Location: n8n-master/packages/cli/src/auth/jwt.ts
Signals: Express
Excerpt (<=80 chars): export function issueCookie(res: Response, user: User) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- issueCookie
```

--------------------------------------------------------------------------------

---[FILE: email.ts]---
Location: n8n-master/packages/cli/src/auth/methods/email.ts
Signals: N/A
Excerpt (<=80 chars):  export const handleEmailLogin = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- handleEmailLogin
```

--------------------------------------------------------------------------------

---[FILE: auth.service.test.ts]---
Location: n8n-master/packages/cli/src/auth/__tests__/auth.service.test.ts
Signals: Express
Excerpt (<=80 chars): import type { GlobalConfig } from '@n8n/config';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: database.manager.ts]---
Location: n8n-master/packages/cli/src/binary-data/database.manager.ts
Signals: N/A
Excerpt (<=80 chars): export class DatabaseManager implements BinaryData.Manager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DatabaseManager
```

--------------------------------------------------------------------------------

---[FILE: chat-execution-manager.ts]---
Location: n8n-master/packages/cli/src/chat/chat-execution-manager.ts
Signals: N/A
Excerpt (<=80 chars): export class ChatExecutionManager {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChatExecutionManager
```

--------------------------------------------------------------------------------

---[FILE: chat-server.ts]---
Location: n8n-master/packages/cli/src/chat/chat-server.ts
Signals: Express
Excerpt (<=80 chars): export class ChatServer {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChatServer
```

--------------------------------------------------------------------------------

---[FILE: chat-service.ts]---
Location: n8n-master/packages/cli/src/chat/chat-service.ts
Signals: Zod
Excerpt (<=80 chars): export class ChatService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ChatService
```

--------------------------------------------------------------------------------

---[FILE: chat-service.types.ts]---
Location: n8n-master/packages/cli/src/chat/chat-service.types.ts
Signals: Zod
Excerpt (<=80 chars):  export interface ChatRequest extends IncomingMessage {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- chatMessageSchema
- Session
- ChatMessage
- ChatRequest
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/cli/src/chat/utils.ts
Signals: N/A
Excerpt (<=80 chars): export function getMessage(execution: IExecutionResponse) {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getMessage
- getLastNodeExecuted
- shouldResumeImmediately
```

--------------------------------------------------------------------------------

---[FILE: chat-server.test.ts]---
Location: n8n-master/packages/cli/src/chat/__tests__/chat-server.test.ts
Signals: Express
Excerpt (<=80 chars): import type { Application } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: collaboration.message.ts]---
Location: n8n-master/packages/cli/src/collaboration/collaboration.message.ts
Signals: Zod
Excerpt (<=80 chars):  export type CollaborationMessage = WorkflowOpenedMessage | WorkflowClosedMes...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- workflowOpenedMessageSchema
- workflowClosedMessageSchema
- workflowMessageSchema
- parseWorkflowMessage
- CollaborationMessage
- WorkflowOpenedMessage
- WorkflowClosedMessage
- WorkflowMessage
```

--------------------------------------------------------------------------------

---[FILE: collaboration.service.ts]---
Location: n8n-master/packages/cli/src/collaboration/collaboration.service.ts
Signals: N/A
Excerpt (<=80 chars): export class CollaborationService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CollaborationService
```

--------------------------------------------------------------------------------

---[FILE: collaboration.state.ts]---
Location: n8n-master/packages/cli/src/collaboration/collaboration.state.ts
Signals: N/A
Excerpt (<=80 chars): export class CollaborationState {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CollaborationState
```

--------------------------------------------------------------------------------

---[FILE: audit.ts]---
Location: n8n-master/packages/cli/src/commands/audit.ts
Signals: Zod
Excerpt (<=80 chars): export class SecurityAudit extends BaseCommand<z.infer<typeof flagsSchema>> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecurityAudit
```

--------------------------------------------------------------------------------

---[FILE: execute-batch.ts]---
Location: n8n-master/packages/cli/src/commands/execute-batch.ts
Signals: Zod
Excerpt (<=80 chars): export class ExecuteBatch extends BaseCommand<z.infer<typeof flagsSchema>> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecuteBatch
```

--------------------------------------------------------------------------------

---[FILE: execute.ts]---
Location: n8n-master/packages/cli/src/commands/execute.ts
Signals: Zod
Excerpt (<=80 chars): export class Execute extends BaseCommand<z.infer<typeof flagsSchema>> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Execute
```

--------------------------------------------------------------------------------

---[FILE: start.ts]---
Location: n8n-master/packages/cli/src/commands/start.ts
Signals: Zod
Excerpt (<=80 chars): export class Start extends BaseCommand<z.infer<typeof flagsSchema>> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Start
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: n8n-master/packages/cli/src/commands/webhook.ts
Signals: N/A
Excerpt (<=80 chars): export class Webhook extends BaseCommand {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Webhook
```

--------------------------------------------------------------------------------

---[FILE: worker.ts]---
Location: n8n-master/packages/cli/src/commands/worker.ts
Signals: Zod
Excerpt (<=80 chars): export class Worker extends BaseCommand<z.infer<typeof flagsSchema>> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Worker
```

--------------------------------------------------------------------------------

---[FILE: revert.ts]---
Location: n8n-master/packages/cli/src/commands/db/revert.ts
Signals: TypeORM
Excerpt (<=80 chars): export class DbRevertMigrationCommand {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DbRevertMigrationCommand
```

--------------------------------------------------------------------------------

---[FILE: revert.test.ts]---
Location: n8n-master/packages/cli/src/commands/db/__tests__/revert.test.ts
Signals: TypeORM
Excerpt (<=80 chars): import { Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: credentials.ts]---
Location: n8n-master/packages/cli/src/commands/export/credentials.ts
Signals: Zod
Excerpt (<=80 chars): export class ExportCredentialsCommand extends BaseCommand<z.infer<typeof flag...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportCredentialsCommand
```

--------------------------------------------------------------------------------

---[FILE: entities.ts]---
Location: n8n-master/packages/cli/src/commands/export/entities.ts
Signals: Zod
Excerpt (<=80 chars): export class ExportEntitiesCommand extends BaseCommand<z.infer<typeof flagsSc...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportEntitiesCommand
```

--------------------------------------------------------------------------------

---[FILE: nodes.ts]---
Location: n8n-master/packages/cli/src/commands/export/nodes.ts
Signals: Zod
Excerpt (<=80 chars): export class ExportNodes extends BaseCommand<z.infer<typeof flagsSchema>> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportNodes
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: n8n-master/packages/cli/src/commands/export/workflow.ts
Signals: Zod
Excerpt (<=80 chars): export class ExportWorkflowsCommand extends BaseCommand<z.infer<typeof flagsS...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportWorkflowsCommand
```

--------------------------------------------------------------------------------

---[FILE: credentials.ts]---
Location: n8n-master/packages/cli/src/commands/import/credentials.ts
Signals: Zod
Excerpt (<=80 chars): export class ImportCredentialsCommand extends BaseCommand<z.infer<typeof flag...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportCredentialsCommand
```

--------------------------------------------------------------------------------

---[FILE: entities.ts]---
Location: n8n-master/packages/cli/src/commands/import/entities.ts
Signals: Zod
Excerpt (<=80 chars): export class ImportEntitiesCommand extends BaseCommand<z.infer<typeof flagsSc...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportEntitiesCommand
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: n8n-master/packages/cli/src/commands/import/workflow.ts
Signals: Zod
Excerpt (<=80 chars): export class ImportWorkflowsCommand extends BaseCommand<z.infer<typeof flagsS...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportWorkflowsCommand
```

--------------------------------------------------------------------------------

---[FILE: reset.ts]---
Location: n8n-master/packages/cli/src/commands/ldap/reset.ts
Signals: Zod
Excerpt (<=80 chars): export class Reset extends BaseCommand<z.infer<typeof flagsSchema>> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reset
```

--------------------------------------------------------------------------------

---[FILE: clear.ts]---
Location: n8n-master/packages/cli/src/commands/license/clear.ts
Signals: N/A
Excerpt (<=80 chars): export class ClearLicenseCommand extends BaseCommand {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ClearLicenseCommand
```

--------------------------------------------------------------------------------

---[FILE: info.ts]---
Location: n8n-master/packages/cli/src/commands/license/info.ts
Signals: N/A
Excerpt (<=80 chars): export class LicenseInfoCommand extends BaseCommand {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseInfoCommand
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: n8n-master/packages/cli/src/commands/list/workflow.ts
Signals: Zod
Excerpt (<=80 chars): export class ListWorkflowCommand extends BaseCommand<z.infer<typeof flagsSche...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListWorkflowCommand
```

--------------------------------------------------------------------------------

---[FILE: disable.ts]---
Location: n8n-master/packages/cli/src/commands/mfa/disable.ts
Signals: Zod
Excerpt (<=80 chars): export class DisableMFACommand extends BaseCommand<z.infer<typeof flagsSchema...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DisableMFACommand
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: n8n-master/packages/cli/src/commands/publish/workflow.ts
Signals: Zod
Excerpt (<=80 chars): export class PublishWorkflowCommand extends BaseCommand<z.infer<typeof flagsS...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PublishWorkflowCommand
```

--------------------------------------------------------------------------------

---[FILE: generate.ts]---
Location: n8n-master/packages/cli/src/commands/ttwf/generate.ts
Signals: Zod
Excerpt (<=80 chars): export class TTWFGenerateCommand extends BaseCommand<z.infer<typeof flagsSche...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TTWFGenerateCommand
```

--------------------------------------------------------------------------------

---[FILE: worker-pool.ts]---
Location: n8n-master/packages/cli/src/commands/ttwf/worker-pool.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkerPool<T> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkerPool
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: n8n-master/packages/cli/src/commands/unpublish/workflow.ts
Signals: Zod
Excerpt (<=80 chars): export class UnpublishWorkflowCommand extends BaseCommand<z.infer<typeof flag...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UnpublishWorkflowCommand
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: n8n-master/packages/cli/src/commands/update/workflow.ts
Signals: Zod
Excerpt (<=80 chars): export class UpdateWorkflowCommand extends BaseCommand<z.infer<typeof flagsSc...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UpdateWorkflowCommand
```

--------------------------------------------------------------------------------

---[FILE: reset.ts]---
Location: n8n-master/packages/cli/src/commands/user-management/reset.ts
Signals: N/A
Excerpt (<=80 chars): export class Reset extends BaseCommand {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Reset
```

--------------------------------------------------------------------------------

---[FILE: concurrency-control.service.ts]---
Location: n8n-master/packages/cli/src/concurrency/concurrency-control.service.ts
Signals: N/A
Excerpt (<=80 chars):  export const CLOUD_TEMP_PRODUCTION_LIMIT = 999;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CLOUD_TEMP_PRODUCTION_LIMIT
- CLOUD_TEMP_REPORTABLE_THRESHOLDS
- ConcurrencyControlService
- ConcurrencyQueueType
```

--------------------------------------------------------------------------------

---[FILE: concurrency-queue.ts]---
Location: n8n-master/packages/cli/src/concurrency/concurrency-queue.ts
Signals: N/A
Excerpt (<=80 chars): export class ConcurrencyQueue extends TypedEmitter<ConcurrencyEvents> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ConcurrencyQueue
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/cli/src/config/index.ts
Signals: N/A
Excerpt (<=80 chars):  export type Config = typeof config;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Config
```

--------------------------------------------------------------------------------

---[FILE: schema.ts]---
Location: n8n-master/packages/cli/src/config/schema.ts
Signals: N/A
Excerpt (<=80 chars): export const schema = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- schema
```

--------------------------------------------------------------------------------

---[FILE: active-workflows.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/active-workflows.controller.ts
Signals: N/A
Excerpt (<=80 chars): export class ActiveWorkflowsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActiveWorkflowsController
```

--------------------------------------------------------------------------------

---[FILE: ai.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/ai.controller.ts
Signals: Express
Excerpt (<=80 chars):  export type FlushableResponse = Response & { flush: () => void };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiController
- FlushableResponse
```

--------------------------------------------------------------------------------

---[FILE: annotation-tags.controller.ee.ts]---
Location: n8n-master/packages/cli/src/controllers/annotation-tags.controller.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class AnnotationTagsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AnnotationTagsController
```

--------------------------------------------------------------------------------

---[FILE: api-keys.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/api-keys.controller.ts
Signals: Express
Excerpt (<=80 chars):  export const isApiEnabledMiddleware: RequestHandler = (_, res, next) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ApiKeysController
```

--------------------------------------------------------------------------------

---[FILE: auth.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/auth.controller.ts
Signals: Express
Excerpt (<=80 chars): export class AuthController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AuthController
```

--------------------------------------------------------------------------------

---[FILE: binary-data.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/binary-data.controller.ts
Signals: Express
Excerpt (<=80 chars): export class BinaryDataController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BinaryDataController
```

--------------------------------------------------------------------------------

---[FILE: cta.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/cta.controller.ts
Signals: Express
Excerpt (<=80 chars): export class CtaController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CtaController
```

--------------------------------------------------------------------------------

---[FILE: debug.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/debug.controller.ts
Signals: N/A
Excerpt (<=80 chars): export class DebugController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DebugController
```

--------------------------------------------------------------------------------

---[FILE: dynamic-node-parameters.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/dynamic-node-parameters.controller.ts
Signals: N/A
Excerpt (<=80 chars): export class DynamicNodeParametersController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DynamicNodeParametersController
```

--------------------------------------------------------------------------------

---[FILE: e2e.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/e2e.controller.ts
Signals: Express
Excerpt (<=80 chars): export class E2EController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- E2EController
```

--------------------------------------------------------------------------------

---[FILE: folder.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/folder.controller.ts
Signals: Express
Excerpt (<=80 chars): export class ProjectController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProjectController
```

--------------------------------------------------------------------------------

---[FILE: invitation.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/invitation.controller.ts
Signals: Express
Excerpt (<=80 chars): export class InvitationController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InvitationController
```

--------------------------------------------------------------------------------

---[FILE: me.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/me.controller.ts
Signals: Express
Excerpt (<=80 chars): export class MeController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MeController
```

--------------------------------------------------------------------------------

---[FILE: mfa.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/mfa.controller.ts
Signals: Express
Excerpt (<=80 chars): export class MFAController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MFAController
```

--------------------------------------------------------------------------------

---[FILE: module-settings.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/module-settings.controller.ts
Signals: N/A
Excerpt (<=80 chars): export class ModuleSettingsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ModuleSettingsController
```

--------------------------------------------------------------------------------

---[FILE: node-types.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/node-types.controller.ts
Signals: Express
Excerpt (<=80 chars): export class NodeTypesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodeTypesController
```

--------------------------------------------------------------------------------

---[FILE: orchestration.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/orchestration.controller.ts
Signals: N/A
Excerpt (<=80 chars): export class OrchestrationController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OrchestrationController
```

--------------------------------------------------------------------------------

---[FILE: owner.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/owner.controller.ts
Signals: Express
Excerpt (<=80 chars): export class OwnerController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OwnerController
```

--------------------------------------------------------------------------------

---[FILE: password-reset.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/password-reset.controller.ts
Signals: Express
Excerpt (<=80 chars): export class PasswordResetController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PasswordResetController
```

--------------------------------------------------------------------------------

---[FILE: posthog.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/posthog.controller.ts
Signals: Express
Excerpt (<=80 chars): export class PostHogController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PostHogController
```

--------------------------------------------------------------------------------

---[FILE: project.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/project.controller.ts
Signals: Express
Excerpt (<=80 chars): export class ProjectController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProjectController
```

--------------------------------------------------------------------------------

---[FILE: role.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/role.controller.ts
Signals: N/A
Excerpt (<=80 chars): export class RoleController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RoleController
```

--------------------------------------------------------------------------------

---[FILE: survey-answers.dto.ts]---
Location: n8n-master/packages/cli/src/controllers/survey-answers.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class PersonalizationSurveyAnswersV4 implements IPersonalizationSurve...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PersonalizationSurveyAnswersV4
```

--------------------------------------------------------------------------------

---[FILE: tags.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/tags.controller.ts
Signals: Express
Excerpt (<=80 chars): export class TagsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TagsController
```

--------------------------------------------------------------------------------

---[FILE: telemetry.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/telemetry.controller.ts
Signals: Express
Excerpt (<=80 chars): export class TelemetryController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TelemetryController
```

--------------------------------------------------------------------------------

---[FILE: third-party-licenses.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/third-party-licenses.controller.ts
Signals: Express
Excerpt (<=80 chars): export class ThirdPartyLicensesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ThirdPartyLicensesController
```

--------------------------------------------------------------------------------

---[FILE: translation.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/translation.controller.ts
Signals: Express
Excerpt (<=80 chars):  export const CREDENTIAL_TRANSLATIONS_DIR = 'n8n-nodes-base/dist/credentials/...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CREDENTIAL_TRANSLATIONS_DIR
- NODE_HEADERS_PATH
- TranslationController
- Credential
```

--------------------------------------------------------------------------------

---[FILE: user-settings.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/user-settings.controller.ts
Signals: N/A
Excerpt (<=80 chars): export class UserSettingsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserSettingsController
```

--------------------------------------------------------------------------------

---[FILE: users.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/users.controller.ts
Signals: Express
Excerpt (<=80 chars): export class UsersController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UsersController
```

--------------------------------------------------------------------------------

---[FILE: workflow-statistics.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/workflow-statistics.controller.ts
Signals: Express
Excerpt (<=80 chars): export class WorkflowStatisticsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowStatisticsController
```

--------------------------------------------------------------------------------

---[FILE: workflow-statistics.types.ts]---
Location: n8n-master/packages/cli/src/controllers/workflow-statistics.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type GetOne = ExecutionRequest.GetOne;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GetOne
```

--------------------------------------------------------------------------------

---[FILE: oauth1-credential.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/oauth/oauth1-credential.controller.ts
Signals: Express
Excerpt (<=80 chars): export class OAuth1CredentialController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OAuth1CredentialController
```

--------------------------------------------------------------------------------

---[FILE: oauth2-credential.controller.ts]---
Location: n8n-master/packages/cli/src/controllers/oauth/oauth2-credential.controller.ts
Signals: Express
Excerpt (<=80 chars): export class OAuth2CredentialController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OAuth2CredentialController
```

--------------------------------------------------------------------------------

---[FILE: oauth2-dynamic-client-registration.schema.ts]---
Location: n8n-master/packages/cli/src/controllers/oauth/oauth2-dynamic-client-registration.schema.ts
Signals: Zod
Excerpt (<=80 chars):  export const oAuthAuthorizationServerMetadataSchema = z.object({

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- oAuthAuthorizationServerMetadataSchema
- dynamicClientRegistrationResponseSchema
```

--------------------------------------------------------------------------------

---[FILE: oauth1-credential.controller.test.ts]---
Location: n8n-master/packages/cli/src/controllers/oauth/__tests__/oauth1-credential.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import { Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: oauth2-credential.controller.test.ts]---
Location: n8n-master/packages/cli/src/controllers/oauth/__tests__/oauth2-credential.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import { Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: auth.controller.test.ts]---
Location: n8n-master/packages/cli/src/controllers/__tests__/auth.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import type { LoginRequestDto } from '@n8n/api-types';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: binary-data.controller.test.ts]---
Location: n8n-master/packages/cli/src/controllers/__tests__/binary-data.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import type { BinaryDataQueryDto, BinaryDataSignedQueryDto } from '@n8n/api-t...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: invitation.controller.test.ts]---
Location: n8n-master/packages/cli/src/controllers/__tests__/invitation.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import { EventService } from '@/events/event.service';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: me.controller.test.ts]---
Location: n8n-master/packages/cli/src/controllers/__tests__/me.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import { UserUpdateRequestDto } from '@n8n/api-types';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: project.controller.test.ts]---
Location: n8n-master/packages/cli/src/controllers/__tests__/project.controller.test.ts
Signals: Express
Excerpt (<=80 chars): import type { AuthenticatedRequest, ProjectRepository } from '@n8n/db';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: credential-resolution-provider.interface.ts]---
Location: n8n-master/packages/cli/src/credentials/credential-resolution-provider.interface.ts
Signals: N/A
Excerpt (<=80 chars):  export type CredentialResolveMetadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialResolveMetadata
- ICredentialResolutionProvider
```

--------------------------------------------------------------------------------

---[FILE: credentials-finder.service.ts]---
Location: n8n-master/packages/cli/src/credentials/credentials-finder.service.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialsFinderService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsFinderService
```

--------------------------------------------------------------------------------

---[FILE: credentials.controller.ts]---
Location: n8n-master/packages/cli/src/credentials/credentials.controller.ts
Signals: Zod
Excerpt (<=80 chars): export class CredentialsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsController
```

--------------------------------------------------------------------------------

---[FILE: credentials.service.ee.ts]---
Location: n8n-master/packages/cli/src/credentials/credentials.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class EnterpriseCredentialsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EnterpriseCredentialsService
```

--------------------------------------------------------------------------------

---[FILE: credentials.service.ts]---
Location: n8n-master/packages/cli/src/credentials/credentials.service.ts
Signals: N/A
Excerpt (<=80 chars):  export type CredentialsGetSharedOptions =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsService
- CredentialsGetSharedOptions
```

--------------------------------------------------------------------------------

---[FILE: dynamic-credential-storage.interface.ts]---
Location: n8n-master/packages/cli/src/credentials/dynamic-credential-storage.interface.ts
Signals: N/A
Excerpt (<=80 chars): export type CredentialStoreMetadata = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialStoreMetadata
- IDynamicCredentialStorageProvider
```

--------------------------------------------------------------------------------

---[FILE: dynamic-credentials-proxy.ts]---
Location: n8n-master/packages/cli/src/credentials/dynamic-credentials-proxy.ts
Signals: N/A
Excerpt (<=80 chars): export class DynamicCredentialsProxy

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DynamicCredentialsProxy
```

--------------------------------------------------------------------------------

---[FILE: credentials.test-data.ts]---
Location: n8n-master/packages/cli/src/credentials/__tests__/credentials.test-data.ts
Signals: N/A
Excerpt (<=80 chars):  export const credentialScopes: Scope[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- createNewCredentialsPayload
- createdCredentialsWithScopes
```

--------------------------------------------------------------------------------

---[FILE: deduplication-helper.ts]---
Location: n8n-master/packages/cli/src/deduplication/deduplication-helper.ts
Signals: N/A
Excerpt (<=80 chars):  export class DeduplicationHelper implements IDataDeduplicator {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeduplicationHelper
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/cli/src/deduplication/index.ts
Signals: N/A
Excerpt (<=80 chars):  export function getDataDeduplicationService(): IDataDeduplicator {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getDataDeduplicationService
```

--------------------------------------------------------------------------------

---[FILE: deprecation.service.ts]---
Location: n8n-master/packages/cli/src/deprecation/deprecation.service.ts
Signals: N/A
Excerpt (<=80 chars): export class DeprecationService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DeprecationService
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const SOURCE_CONTROL_PREFERENCES_DB_KEY = 'features.sourceControl';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SOURCE_CONTROL_PREFERENCES_DB_KEY
- SOURCE_CONTROL_GIT_FOLDER
- SOURCE_CONTROL_GIT_KEY_COMMENT
- SOURCE_CONTROL_WORKFLOW_EXPORT_FOLDER
- SOURCE_CONTROL_PROJECT_EXPORT_FOLDER
- SOURCE_CONTROL_CREDENTIAL_EXPORT_FOLDER
- SOURCE_CONTROL_VARIABLES_EXPORT_FILE
- SOURCE_CONTROL_TAGS_EXPORT_FILE
- SOURCE_CONTROL_FOLDERS_EXPORT_FILE
- SOURCE_CONTROL_OWNERS_EXPORT_FILE
- SOURCE_CONTROL_SSH_FOLDER
- SOURCE_CONTROL_SSH_KEY_NAME
- SOURCE_CONTROL_DEFAULT_BRANCH
- SOURCE_CONTROL_ORIGIN
- SOURCE_CONTROL_README
- SOURCE_CONTROL_DEFAULT_NAME
- SOURCE_CONTROL_DEFAULT_EMAIL
```

--------------------------------------------------------------------------------

---[FILE: source-control-export.service.ee.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/source-control-export.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class SourceControlExportService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlExportService
```

--------------------------------------------------------------------------------

---[FILE: source-control-git.service.ee.ts]---
Location: n8n-master/packages/cli/src/environments.ee/source-control/source-control-git.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class SourceControlGitService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SourceControlGitService
```

--------------------------------------------------------------------------------

````
