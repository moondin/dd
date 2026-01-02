---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 21
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 21 of 51)

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

---[FILE: workflow-index.service.ts]---
Location: n8n-master/packages/cli/src/modules/workflow-index/workflow-index.service.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowIndexService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowIndexService
```

--------------------------------------------------------------------------------

---[FILE: oauth.service.ts]---
Location: n8n-master/packages/cli/src/oauth/oauth.service.ts
Signals: Express
Excerpt (<=80 chars):  export function shouldSkipAuthOnOAuthCallback() {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- shouldSkipAuthOnOAuthCallback
- skipAuthOnOAuthCallback
- OauthService
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/cli/src/oauth/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type CsrfStateRequired = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MAX_CSRF_AGE
- algorithmMap
- CsrfStateRequired
- CreateCsrfStateData
- CsrfState
- OAuth1CredentialData
```

--------------------------------------------------------------------------------

---[FILE: oauth.service.test.ts]---
Location: n8n-master/packages/cli/src/oauth/__tests__/oauth.service.test.ts
Signals: Express
Excerpt (<=80 chars): import { Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/cli/src/posthog/index.ts
Signals: N/A
Excerpt (<=80 chars): export class PostHogClient {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PostHogClient
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/cli/src/public-api/index.ts
Signals: Express
Excerpt (<=80 chars):  export const loadPublicApiVersions = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isApiEnabled
- loadPublicApiVersions
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/cli/src/public-api/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type PaginatedRequest = AuthenticatedRequest<

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PaginatedRequest
- Invite
- ResolveSignUp
- SignUp
- Delete
- Get
- Reinvite
- Update
- OperationID
- PaginationOffsetDecoded
- PaginationCursorDecoded
- OffsetPagination
- CursorPagination
- IRequired
- IDependency
- IJsonSchema
```

--------------------------------------------------------------------------------

---[FILE: audit.handler.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/audit/audit.handler.ts
Signals: Express
Excerpt (<=80 chars): import { Container } from '@n8n/di';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: credentials.handler.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/credentials/credentials.handler.ts
Signals: Express, Zod
Excerpt (<=80 chars): /* eslint-disable @typescript-eslint/no-unsafe-argument */

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: credentials.middleware.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/credentials/credentials.middleware.ts
Signals: Express
Excerpt (<=80 chars):  export const validCredentialType = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validCredentialType
- validCredentialsProperties
```

--------------------------------------------------------------------------------

---[FILE: credentials.service.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/credentials/credentials.service.ts
Signals: N/A
Excerpt (<=80 chars):  export function sanitizeCredentials(credentials: CredentialsEntity): Partial...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- sanitizeCredentials
- toJsonSchema
```

--------------------------------------------------------------------------------

---[FILE: executions.handler.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/executions/executions.handler.ts
Signals: Express
Excerpt (<=80 chars): import { ExecutionRepository } from '@n8n/db';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: projects.handler.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/projects/projects.handler.ts
Signals: Express
Excerpt (<=80 chars): import {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: source-control.handler.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/source-control/source-control.handler.ts
Signals: Express
Excerpt (<=80 chars): import { PullWorkFolderRequestDto } from '@n8n/api-types';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: tags.handler.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/tags/tags.handler.ts
Signals: Express
Excerpt (<=80 chars): import type { TagEntity } from '@n8n/db';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: users.handler.ee.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/users/users.handler.ee.ts
Signals: Express
Excerpt (<=80 chars): import { InviteUsersRequestDto, RoleChangeRequestDto } from '@n8n/api-types';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: users.service.ee.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/users/users.service.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export function clean(user: User, options?: { includeRole: boolean }): Parti...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- clean
```

--------------------------------------------------------------------------------

---[FILE: variables.handler.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/variables/variables.handler.ts
Signals: Express
Excerpt (<=80 chars): import { CreateVariableRequestDto } from '@n8n/api-types';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: workflows.handler.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/workflows/workflows.handler.ts
Signals: Express, Zod
Excerpt (<=80 chars): import { GlobalConfig } from '@n8n/config';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: workflows.service.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/handlers/workflows/workflows.service.ts
Signals: N/A
Excerpt (<=80 chars):  export function parseTagNames(tags: string): string[] {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseTagNames
```

--------------------------------------------------------------------------------

---[FILE: global.middleware.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/shared/middlewares/global.middleware.ts
Signals: Express
Excerpt (<=80 chars):  export type ProjectScopeResource = 'workflow' | 'credential';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- globalScope
- projectScope
- validCursor
- apiKeyHasScope
- apiKeyHasScopeWithGlobalScopeFallback
- validLicenseWithUserQuota
- isLicensed
- ProjectScopeResource
```

--------------------------------------------------------------------------------

---[FILE: pagination.service.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/shared/services/pagination.service.ts
Signals: N/A
Excerpt (<=80 chars):  export const decodeCursor = (cursor: string): PaginationOffsetDecoded | Pagi...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- decodeCursor
- encodeNextCursor
```

--------------------------------------------------------------------------------

---[FILE: global.middleware.test.ts]---
Location: n8n-master/packages/cli/src/public-api/v1/__tests__/global.middleware.test.ts
Signals: Express
Excerpt (<=80 chars): import { mockInstance } from '@n8n/backend-test-utils';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: abstract.push.ts]---
Location: n8n-master/packages/cli/src/push/abstract.push.ts
Signals: N/A
Excerpt (<=80 chars):  export interface AbstractPushEvents {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AbstractPushEvents
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/cli/src/push/index.ts
Signals: Express
Excerpt (<=80 chars): export class Push extends TypedEmitter<PushEvents> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Push
```

--------------------------------------------------------------------------------

---[FILE: origin-validator.ts]---
Location: n8n-master/packages/cli/src/push/origin-validator.ts
Signals: Express
Excerpt (<=80 chars):  export interface OriginValidationResult {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateOriginHeaders
- OriginValidationResult
```

--------------------------------------------------------------------------------

---[FILE: push.config.ts]---
Location: n8n-master/packages/cli/src/push/push.config.ts
Signals: N/A
Excerpt (<=80 chars): export class PushConfig {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PushConfig
```

--------------------------------------------------------------------------------

---[FILE: sse.push.ts]---
Location: n8n-master/packages/cli/src/push/sse.push.ts
Signals: N/A
Excerpt (<=80 chars): export class SSEPush extends AbstractPush<Connection> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SSEPush
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/cli/src/push/types.ts
Signals: Express
Excerpt (<=80 chars):  export type PushRequest = AuthenticatedRequest<{}, {}, {}, { pushRef: string...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PushRequest
- SSEPushRequest
- WebSocketPushRequest
- PushResponse
- OnPushMessage
```

--------------------------------------------------------------------------------

---[FILE: websocket.push.ts]---
Location: n8n-master/packages/cli/src/push/websocket.push.ts
Signals: N/A
Excerpt (<=80 chars): export class WebSocketPush extends AbstractPush<WebSocket> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WebSocketPush
```

--------------------------------------------------------------------------------

---[FILE: index.test.ts]---
Location: n8n-master/packages/cli/src/push/__tests__/index.test.ts
Signals: Express
Excerpt (<=80 chars): import type { Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/src/scaling/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const QUEUE_NAME = 'jobs';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QUEUE_NAME
- JOB_TYPE_NAME
- COMMAND_PUBSUB_CHANNEL
- WORKER_RESPONSE_PUBSUB_CHANNEL
- SELF_SEND_COMMANDS
- IMMEDIATE_COMMANDS
```

--------------------------------------------------------------------------------

---[FILE: job-processor.ts]---
Location: n8n-master/packages/cli/src/scaling/job-processor.ts
Signals: N/A
Excerpt (<=80 chars): export class JobProcessor {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JobProcessor
```

--------------------------------------------------------------------------------

---[FILE: multi-main-setup.ee.ts]---
Location: n8n-master/packages/cli/src/scaling/multi-main-setup.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class MultiMainSetup extends TypedEmitter<MultiMainEvents> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MultiMainSetup
```

--------------------------------------------------------------------------------

---[FILE: scaling.service.ts]---
Location: n8n-master/packages/cli/src/scaling/scaling.service.ts
Signals: N/A
Excerpt (<=80 chars): export class ScalingService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ScalingService
```

--------------------------------------------------------------------------------

---[FILE: scaling.types.ts]---
Location: n8n-master/packages/cli/src/scaling/scaling.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type JobQueue = Bull.Queue<JobData>;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JobQueue
- Job
- JobId
- JobData
- JobResult
- JobStatus
- JobOptions
- JobMessage
- RespondToWebhookMessage
- JobFinishedMessage
- SendChunkMessage
- JobFailedMessage
- AbortJobMessage
- RunningJob
- QueueRecoveryContext
```

--------------------------------------------------------------------------------

---[FILE: worker-server.ts]---
Location: n8n-master/packages/cli/src/scaling/worker-server.ts
Signals: Express
Excerpt (<=80 chars):  export type WorkerServerEndpointsConfig = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkerServer
- WorkerServerEndpointsConfig
```

--------------------------------------------------------------------------------

---[FILE: worker-status.service.ee.ts]---
Location: n8n-master/packages/cli/src/scaling/worker-status.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkerStatusService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkerStatusService
```

--------------------------------------------------------------------------------

---[FILE: publisher.service.ts]---
Location: n8n-master/packages/cli/src/scaling/pubsub/publisher.service.ts
Signals: N/A
Excerpt (<=80 chars): export class Publisher {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Publisher
```

--------------------------------------------------------------------------------

---[FILE: pubsub.event-map.ts]---
Location: n8n-master/packages/cli/src/scaling/pubsub/pubsub.event-map.ts
Signals: N/A
Excerpt (<=80 chars):  export type PubSubCommandMap = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PubSubCommandMap
- PubSubWorkerResponseMap
- PubSubEventMap
```

--------------------------------------------------------------------------------

---[FILE: pubsub.eventbus.ts]---
Location: n8n-master/packages/cli/src/scaling/pubsub/pubsub.eventbus.ts
Signals: N/A
Excerpt (<=80 chars): export class PubSubEventBus extends TypedEmitter<PubSubEventMap> {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PubSubEventBus
```

--------------------------------------------------------------------------------

---[FILE: pubsub.registry.ts]---
Location: n8n-master/packages/cli/src/scaling/pubsub/pubsub.registry.ts
Signals: N/A
Excerpt (<=80 chars): export class PubSubRegistry {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PubSubRegistry
```

--------------------------------------------------------------------------------

---[FILE: pubsub.types.ts]---
Location: n8n-master/packages/cli/src/scaling/pubsub/pubsub.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type Channel = typeof COMMAND_PUBSUB_CHANNEL | typeof WORKER_RESPONSE...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Channel
- HandlerFn
- ReloadLicense
- ReloadOIDCConfiguration
- ReloadSamlConfiguration
- ReloadCredentialsOverwrites
- RestartEventBus
- ReloadExternalSecretsProviders
- CommunityPackageInstall
- CommunityPackageUpdate
- CommunityPackageUninstall
- GetWorkerId
- GetWorkerStatus
- AddWebhooksTriggersAndPollers
- RemoveTriggersAndPollers
- DisplayWorkflowActivation
- DisplayWorkflowDeactivation
- DisplayWorkflowActivationError
```

--------------------------------------------------------------------------------

---[FILE: subscriber.service.ts]---
Location: n8n-master/packages/cli/src/scaling/pubsub/subscriber.service.ts
Signals: N/A
Excerpt (<=80 chars): export class Subscriber {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Subscriber
```

--------------------------------------------------------------------------------

---[FILE: redis.types.ts]---
Location: n8n-master/packages/cli/src/scaling/redis/redis.types.ts
Signals: N/A
Excerpt (<=80 chars): export type RedisClientType = N8nRedisClientType | BullRedisClientType;

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RedisClientType
```

--------------------------------------------------------------------------------

---[FILE: worker-server.test.ts]---
Location: n8n-master/packages/cli/src/scaling/__tests__/worker-server.test.ts
Signals: Express
Excerpt (<=80 chars): import { mockLogger } from '@n8n/backend-test-utils';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/src/security-audit/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const RISK_CATEGORIES: Risk.Category[] = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SQL_NODE_TYPES_WITH_QUERY_PARAMS
- SQL_NODE_TYPES
- WEBHOOK_NODE_TYPE
- WEBHOOK_VALIDATOR_NODE_TYPES
- FILESYSTEM_INTERACTION_NODE_TYPES
- OFFICIAL_RISKY_NODE_TYPES
- DATABASE_REPORT
- CREDENTIALS_REPORT
- FILESYSTEM_REPORT
- NODES_REPORT
- INSTANCE_REPORT
- ENV_VARS_DOCS_URL
- DB_QUERY_PARAMS_DOCS_URL
- COMMUNITY_NODES_RISKS_URL
- NPM_PACKAGE_URL
```

--------------------------------------------------------------------------------

---[FILE: security-audit.repository.ts]---
Location: n8n-master/packages/cli/src/security-audit/security-audit.repository.ts
Signals: TypeORM
Excerpt (<=80 chars): export class PackagesRepository extends Repository<InstalledPackages> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PackagesRepository
```

--------------------------------------------------------------------------------

---[FILE: security-audit.service.ts]---
Location: n8n-master/packages/cli/src/security-audit/security-audit.service.ts
Signals: N/A
Excerpt (<=80 chars): export class SecurityAuditService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SecurityAuditService
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/cli/src/security-audit/types.ts
Signals: N/A
Excerpt (<=80 chars):  export type Category = 'database' | 'credentials' | 'nodes' | 'instance' | '...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Category
- NodeLocation
- CommunityNodeDetails
- CustomNodeDetails
- Report
- StandardSection
- InstanceSection
- StandardReport
- InstanceReport
- Audit
- SyncReportFn
- AsyncReportFn
- Version
- RiskReporter
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/cli/src/security-audit/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const toFlaggedNode = ({ node, workflow }: { node: Node; workflow: IW...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getNodeTypes
- toFlaggedNode
- toReportTitle
```

--------------------------------------------------------------------------------

---[FILE: credentials-risk-reporter.ts]---
Location: n8n-master/packages/cli/src/security-audit/risk-reporters/credentials-risk-reporter.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialsRiskReporter implements RiskReporter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsRiskReporter
```

--------------------------------------------------------------------------------

---[FILE: database-risk-reporter.ts]---
Location: n8n-master/packages/cli/src/security-audit/risk-reporters/database-risk-reporter.ts
Signals: N/A
Excerpt (<=80 chars): export class DatabaseRiskReporter implements RiskReporter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DatabaseRiskReporter
```

--------------------------------------------------------------------------------

---[FILE: filesystem-risk-reporter.ts]---
Location: n8n-master/packages/cli/src/security-audit/risk-reporters/filesystem-risk-reporter.ts
Signals: N/A
Excerpt (<=80 chars): export class FilesystemRiskReporter implements RiskReporter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FilesystemRiskReporter
```

--------------------------------------------------------------------------------

---[FILE: instance-risk-reporter.ts]---
Location: n8n-master/packages/cli/src/security-audit/risk-reporters/instance-risk-reporter.ts
Signals: N/A
Excerpt (<=80 chars): export class InstanceRiskReporter implements RiskReporter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- InstanceRiskReporter
```

--------------------------------------------------------------------------------

---[FILE: nodes-risk-reporter.ts]---
Location: n8n-master/packages/cli/src/security-audit/risk-reporters/nodes-risk-reporter.ts
Signals: N/A
Excerpt (<=80 chars): export class NodesRiskReporter implements RiskReporter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NodesRiskReporter
```

--------------------------------------------------------------------------------

---[FILE: access.service.ts]---
Location: n8n-master/packages/cli/src/services/access.service.ts
Signals: N/A
Excerpt (<=80 chars): export class AccessService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AccessService
```

--------------------------------------------------------------------------------

---[FILE: active-workflows.service.ts]---
Location: n8n-master/packages/cli/src/services/active-workflows.service.ts
Signals: N/A
Excerpt (<=80 chars): export class ActiveWorkflowsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ActiveWorkflowsService
```

--------------------------------------------------------------------------------

---[FILE: ai-workflow-builder.service.ts]---
Location: n8n-master/packages/cli/src/services/ai-workflow-builder.service.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowBuilderService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowBuilderService
```

--------------------------------------------------------------------------------

---[FILE: ai.service.ts]---
Location: n8n-master/packages/cli/src/services/ai.service.ts
Signals: N/A
Excerpt (<=80 chars): export class AiService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiService
```

--------------------------------------------------------------------------------

---[FILE: annotation-tag.service.ee.ts]---
Location: n8n-master/packages/cli/src/services/annotation-tag.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class AnnotationTagService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AnnotationTagService
```

--------------------------------------------------------------------------------

---[FILE: banner.service.ts]---
Location: n8n-master/packages/cli/src/services/banner.service.ts
Signals: N/A
Excerpt (<=80 chars): export class BannerService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BannerService
```

--------------------------------------------------------------------------------

---[FILE: credentials-tester.service.ts]---
Location: n8n-master/packages/cli/src/services/credentials-tester.service.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialsTester {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsTester
```

--------------------------------------------------------------------------------

---[FILE: cta.service.ts]---
Location: n8n-master/packages/cli/src/services/cta.service.ts
Signals: N/A
Excerpt (<=80 chars): export class CtaService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CtaService
```

--------------------------------------------------------------------------------

---[FILE: dynamic-node-parameters.service.ts]---
Location: n8n-master/packages/cli/src/services/dynamic-node-parameters.service.ts
Signals: N/A
Excerpt (<=80 chars): export class DynamicNodeParametersService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DynamicNodeParametersService
```

--------------------------------------------------------------------------------

---[FILE: execution-metadata.service.ts]---
Location: n8n-master/packages/cli/src/services/execution-metadata.service.ts
Signals: N/A
Excerpt (<=80 chars): export class ExecutionMetadataService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionMetadataService
```

--------------------------------------------------------------------------------

---[FILE: export.service.ts]---
Location: n8n-master/packages/cli/src/services/export.service.ts
Signals: TypeORM
Excerpt (<=80 chars): export class ExportService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExportService
```

--------------------------------------------------------------------------------

---[FILE: folder.service.ts]---
Location: n8n-master/packages/cli/src/services/folder.service.ts
Signals: N/A
Excerpt (<=80 chars):  export interface SimpleFolderNode {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FolderService
- SimpleFolderNode
```

--------------------------------------------------------------------------------

---[FILE: frontend.service.ts]---
Location: n8n-master/packages/cli/src/services/frontend.service.ts
Signals: N/A
Excerpt (<=80 chars): export type PublicFrontendSettings = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FrontendService
- PublicFrontendSettings
```

--------------------------------------------------------------------------------

---[FILE: hooks.service.ts]---
Location: n8n-master/packages/cli/src/services/hooks.service.ts
Signals: Express
Excerpt (<=80 chars): export class HooksService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- HooksService
```

--------------------------------------------------------------------------------

---[FILE: import.service.ts]---
Location: n8n-master/packages/cli/src/services/import.service.ts
Signals: Zod, TypeORM
Excerpt (<=80 chars): export class ImportService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ImportService
```

--------------------------------------------------------------------------------

---[FILE: jwt.service.ts]---
Location: n8n-master/packages/cli/src/services/jwt.service.ts
Signals: N/A
Excerpt (<=80 chars): export class JwtService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- JwtService
- JwtPayload
```

--------------------------------------------------------------------------------

---[FILE: last-active-at.service.ts]---
Location: n8n-master/packages/cli/src/services/last-active-at.service.ts
Signals: Express
Excerpt (<=80 chars): export class LastActiveAtService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LastActiveAtService
```

--------------------------------------------------------------------------------

---[FILE: naming.service.ts]---
Location: n8n-master/packages/cli/src/services/naming.service.ts
Signals: N/A
Excerpt (<=80 chars): export class NamingService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- NamingService
```

--------------------------------------------------------------------------------

---[FILE: ownership.service.ts]---
Location: n8n-master/packages/cli/src/services/ownership.service.ts
Signals: N/A
Excerpt (<=80 chars): export class OwnershipService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OwnershipService
```

--------------------------------------------------------------------------------

---[FILE: password.utility.ts]---
Location: n8n-master/packages/cli/src/services/password.utility.ts
Signals: N/A
Excerpt (<=80 chars): export class PasswordUtility {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PasswordUtility
```

--------------------------------------------------------------------------------

---[FILE: project.service.ee.ts]---
Location: n8n-master/packages/cli/src/services/project.service.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export class TeamProjectOverQuotaError extends UserError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TeamProjectOverQuotaError
- UnlicensedProjectRoleError
- ProjectService
```

--------------------------------------------------------------------------------

---[FILE: public-api-key.service.ts]---
Location: n8n-master/packages/cli/src/services/public-api-key.service.ts
Signals: Express
Excerpt (<=80 chars): export class PublicApiKeyService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PublicApiKeyService
```

--------------------------------------------------------------------------------

---[FILE: redis-client.service.ts]---
Location: n8n-master/packages/cli/src/services/redis-client.service.ts
Signals: N/A
Excerpt (<=80 chars): export class RedisClientService extends TypedEmitter<RedisEventMap> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RedisClientService
```

--------------------------------------------------------------------------------

---[FILE: role-cache.service.ts]---
Location: n8n-master/packages/cli/src/services/role-cache.service.ts
Signals: N/A
Excerpt (<=80 chars): export class RoleCacheService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RoleCacheService
```

--------------------------------------------------------------------------------

---[FILE: role.service.ts]---
Location: n8n-master/packages/cli/src/services/role.service.ts
Signals: N/A
Excerpt (<=80 chars): export class RoleService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RoleService
```

--------------------------------------------------------------------------------

---[FILE: tag.service.ts]---
Location: n8n-master/packages/cli/src/services/tag.service.ts
Signals: N/A
Excerpt (<=80 chars): export class TagService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TagService
```

--------------------------------------------------------------------------------

---[FILE: url.service.ts]---
Location: n8n-master/packages/cli/src/services/url.service.ts
Signals: N/A
Excerpt (<=80 chars): export class UrlService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UrlService
```

--------------------------------------------------------------------------------

---[FILE: user.service.ts]---
Location: n8n-master/packages/cli/src/services/user.service.ts
Signals: N/A
Excerpt (<=80 chars): export class UserService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserService
```

--------------------------------------------------------------------------------

---[FILE: workflow-loader.service.ts]---
Location: n8n-master/packages/cli/src/services/workflow-loader.service.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowLoaderService implements IWorkflowLoader {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowLoaderService
```

--------------------------------------------------------------------------------

---[FILE: workflow-statistics.service.ts]---
Location: n8n-master/packages/cli/src/services/workflow-statistics.service.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowStatisticsService extends TypedEmitter<WorkflowStatistic...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowStatisticsService
```

--------------------------------------------------------------------------------

---[FILE: cache.service.ts]---
Location: n8n-master/packages/cli/src/services/cache/cache.service.ts
Signals: N/A
Excerpt (<=80 chars): export class CacheService extends TypedEmitter<CacheEvents> {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CacheService
```

--------------------------------------------------------------------------------

---[FILE: cache.types.ts]---
Location: n8n-master/packages/cli/src/services/cache/cache.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type TaggedRedisCache = RedisCache & { kind: 'redis' };

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaggedRedisCache
- TaggedMemoryCache
- Hash
- MaybeHash
```

--------------------------------------------------------------------------------

---[FILE: redis.cache-manager.ts]---
Location: n8n-master/packages/cli/src/services/cache/redis.cache-manager.ts
Signals: N/A
Excerpt (<=80 chars):  export class NoCacheableError implements Error {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- redisStoreUsingClient
- avoidNoCacheable
- NoCacheableError
- RedisCache
- RedisClusterConfig
- RedisStore
```

--------------------------------------------------------------------------------

---[FILE: executions-pruning.service.ts]---
Location: n8n-master/packages/cli/src/services/pruning/executions-pruning.service.ts
Signals: N/A
Excerpt (<=80 chars): export class ExecutionsPruningService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionsPruningService
```

--------------------------------------------------------------------------------

---[FILE: export.service.test.ts]---
Location: n8n-master/packages/cli/src/services/__tests__/export.service.test.ts
Signals: TypeORM
Excerpt (<=80 chars): import { type Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: hooks.service.test.ts]---
Location: n8n-master/packages/cli/src/services/__tests__/hooks.service.test.ts
Signals: Express
Excerpt (<=80 chars): import type {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: import.service.test.ts]---
Location: n8n-master/packages/cli/src/services/__tests__/import.service.test.ts
Signals: TypeORM
Excerpt (<=80 chars): import { safeJoinPath, type Logger } from '@n8n/backend-common';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: last-active-at.service.test.ts]---
Location: n8n-master/packages/cli/src/services/__tests__/last-active-at.service.test.ts
Signals: Express
Excerpt (<=80 chars): import { mockLogger } from '@n8n/backend-test-utils';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: public-api-key.service.integration.test.ts]---
Location: n8n-master/packages/cli/src/services/__tests__/public-api-key.service.integration.test.ts
Signals: Express
Excerpt (<=80 chars): import { testDb } from '@n8n/backend-test-utils';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: workflow-statistics.service.integration.test.ts]---
Location: n8n-master/packages/cli/src/services/__tests__/workflow-statistics.service.integration.test.ts
Signals: TypeORM
Excerpt (<=80 chars): import {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: shutdown.service.ts]---
Location: n8n-master/packages/cli/src/shutdown/shutdown.service.ts
Signals: N/A
Excerpt (<=80 chars): export class ComponentShutdownError extends UnexpectedError {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ComponentShutdownError
- ShutdownService
```

--------------------------------------------------------------------------------

---[FILE: sso-helpers.ts]---
Location: n8n-master/packages/cli/src/sso.ee/sso-helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export function getCurrentAuthenticationMethod(): AuthProviderType {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getCurrentAuthenticationMethod
- isSamlCurrentAuthenticationMethod
- isLdapCurrentAuthenticationMethod
- isOidcCurrentAuthenticationMethod
- isSsoCurrentAuthenticationMethod
- isEmailCurrentAuthenticationMethod
- isSsoJustInTimeProvisioningEnabled
- doRedirectUsersFromLoginToSsoFlow
```

--------------------------------------------------------------------------------

````
