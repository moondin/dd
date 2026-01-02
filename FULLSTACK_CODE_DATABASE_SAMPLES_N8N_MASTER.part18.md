---
source_txt: fullstack_samples/n8n-master
converted_utc: 2025-12-18T10:47:15Z
part: 18
parts_total: 51
---

# FULLSTACK CODE DATABASE SAMPLES n8n-master

## Extracted Reusable Patterns (Non-verbatim) (Part 18 of 51)

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

---[FILE: event-message-generic.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/event-message-generic.ts
Signals: N/A
Excerpt (<=80 chars):  export const eventMessageGenericDestinationTestEvent = 'n8n.destination.test';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- eventMessageGenericDestinationTestEvent
- EventMessageGeneric
- EventPayloadGeneric
- EventMessageGenericOptions
```

--------------------------------------------------------------------------------

---[FILE: event-message-node.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/event-message-node.ts
Signals: N/A
Excerpt (<=80 chars): export interface EventPayloadNode extends AbstractEventPayload {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventMessageNode
- EventPayloadNode
- EventMessageNodeOptions
```

--------------------------------------------------------------------------------

---[FILE: event-message-queue.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/event-message-queue.ts
Signals: N/A
Excerpt (<=80 chars):  export interface EventPayloadQueue extends AbstractEventPayload {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventMessageQueue
- EventPayloadQueue
- EventMessageQueueOptions
```

--------------------------------------------------------------------------------

---[FILE: event-message-runner.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/event-message-runner.ts
Signals: N/A
Excerpt (<=80 chars):  export interface EventPayloadRunner extends AbstractEventPayload {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventMessageRunner
- EventPayloadRunner
- EventMessageRunnerOptions
```

--------------------------------------------------------------------------------

---[FILE: event-message-workflow.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/event-message-workflow.ts
Signals: N/A
Excerpt (<=80 chars): export interface EventPayloadWorkflow extends AbstractEventPayload {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventMessageWorkflow
- EventPayloadWorkflow
- EventMessageWorkflowOptions
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/cli/src/eventbus/event-message-classes/index.ts
Signals: N/A
Excerpt (<=80 chars):  export const eventNamesAiNodes = [

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- eventNamesAiNodes
- eventNamesRunner
- eventNamesQueue
- eventNamesWorkflow
- eventNamesGeneric
- eventNamesNode
- eventNamesExecution
- eventNamesAudit
- eventNamesAll
- EventNamesAiNodesType
- EventNamesRunnerType
- EventNamesQueueType
- EventNamesWorkflowType
- EventNamesAuditType
- EventNamesNodeType
- EventNamesExecutionType
- EventNamesGenericType
- EventNamesTypes
```

--------------------------------------------------------------------------------

---[FILE: message-event-bus.ts]---
Location: n8n-master/packages/cli/src/eventbus/message-event-bus/message-event-bus.ts
Signals: N/A
Excerpt (<=80 chars):  export type EventMessageReturnMode = 'sent' | 'unsent' | 'all' | 'unfinished';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MessageEventBus
- EventMessageReturnMode
- MessageWithCallback
- MessageEventBusInitializeOptions
```

--------------------------------------------------------------------------------

---[FILE: message-event-bus-destination-from-db.ts]---
Location: n8n-master/packages/cli/src/eventbus/message-event-bus-destination/message-event-bus-destination-from-db.ts
Signals: N/A
Excerpt (<=80 chars):  export function messageEventBusDestinationFromDb(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- messageEventBusDestinationFromDb
```

--------------------------------------------------------------------------------

---[FILE: message-event-bus-destination-sentry.ee.ts]---
Location: n8n-master/packages/cli/src/eventbus/message-event-bus-destination/message-event-bus-destination-sentry.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export const isMessageEventBusDestinationSentryOptions = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isMessageEventBusDestinationSentryOptions
- MessageEventBusDestinationSentry
```

--------------------------------------------------------------------------------

---[FILE: message-event-bus-destination-syslog.ee.ts]---
Location: n8n-master/packages/cli/src/eventbus/message-event-bus-destination/message-event-bus-destination-syslog.ee.ts
Signals: N/A
Excerpt (<=80 chars): export const isMessageEventBusDestinationSyslogOptions = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isMessageEventBusDestinationSyslogOptions
- MessageEventBusDestinationSyslog
```

--------------------------------------------------------------------------------

---[FILE: message-event-bus-destination-webhook.ee.ts]---
Location: n8n-master/packages/cli/src/eventbus/message-event-bus-destination/message-event-bus-destination-webhook.ee.ts
Signals: N/A
Excerpt (<=80 chars):  export const isMessageEventBusDestinationWebhookOptions = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isMessageEventBusDestinationWebhookOptions
- MessageEventBusDestinationWebhook
```

--------------------------------------------------------------------------------

---[FILE: message-event-bus-log-writer.ts]---
Location: n8n-master/packages/cli/src/eventbus/message-event-bus-writer/message-event-bus-log-writer.ts
Signals: N/A
Excerpt (<=80 chars):  export interface MessageEventBusLogWriterOptions {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MessageEventBusLogWriter
- MessageEventBusLogWriterOptions
```

--------------------------------------------------------------------------------

---[FILE: event.service.ts]---
Location: n8n-master/packages/cli/src/events/event.service.ts
Signals: N/A
Excerpt (<=80 chars): export class EventService extends TypedEmitter<EventMap> {}

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventService
```

--------------------------------------------------------------------------------

---[FILE: events.controller.ts]---
Location: n8n-master/packages/cli/src/events/events.controller.ts
Signals: N/A
Excerpt (<=80 chars): export class EventsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventsController
```

--------------------------------------------------------------------------------

---[FILE: ai.event-map.ts]---
Location: n8n-master/packages/cli/src/events/maps/ai.event-map.ts
Signals: N/A
Excerpt (<=80 chars): export type AiEventPayload = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- AiEventPayload
- AiEventMap
```

--------------------------------------------------------------------------------

---[FILE: queue-metrics.event-map.ts]---
Location: n8n-master/packages/cli/src/events/maps/queue-metrics.event-map.ts
Signals: N/A
Excerpt (<=80 chars): export type QueueMetricsEventMap = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueueMetricsEventMap
```

--------------------------------------------------------------------------------

---[FILE: relay.event-map.ts]---
Location: n8n-master/packages/cli/src/events/maps/relay.event-map.ts
Signals: N/A
Excerpt (<=80 chars):  export type UserLike = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserLike
- RelayEventMap
```

--------------------------------------------------------------------------------

---[FILE: event-relay.ts]---
Location: n8n-master/packages/cli/src/events/relays/event-relay.ts
Signals: N/A
Excerpt (<=80 chars): export class EventRelay {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EventRelay
```

--------------------------------------------------------------------------------

---[FILE: log-streaming.event-relay.ts]---
Location: n8n-master/packages/cli/src/events/relays/log-streaming.event-relay.ts
Signals: N/A
Excerpt (<=80 chars): export class LogStreamingEventRelay extends EventRelay {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LogStreamingEventRelay
```

--------------------------------------------------------------------------------

---[FILE: telemetry.event-relay.ts]---
Location: n8n-master/packages/cli/src/events/relays/telemetry.event-relay.ts
Signals: N/A
Excerpt (<=80 chars): export class TelemetryEventRelay extends EventRelay {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TelemetryEventRelay
```

--------------------------------------------------------------------------------

---[FILE: execute-error-workflow.ts]---
Location: n8n-master/packages/cli/src/execution-lifecycle/execute-error-workflow.ts
Signals: N/A
Excerpt (<=80 chars): export function executeErrorWorkflow(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- executeErrorWorkflow
```

--------------------------------------------------------------------------------

---[FILE: execution-lifecycle-hooks.ts]---
Location: n8n-master/packages/cli/src/execution-lifecycle/execution-lifecycle-hooks.ts
Signals: N/A
Excerpt (<=80 chars): export function getLifecycleHooksForSubExecutions(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getLifecycleHooksForSubExecutions
- getLifecycleHooksForScalingWorker
- getLifecycleHooksForScalingMain
- getLifecycleHooksForRegularMain
```

--------------------------------------------------------------------------------

---[FILE: to-save-settings.ts]---
Location: n8n-master/packages/cli/src/execution-lifecycle/to-save-settings.ts
Signals: N/A
Excerpt (<=80 chars):  export type ExecutionSaveSettings = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- toSaveSettings
- ExecutionSaveSettings
```

--------------------------------------------------------------------------------

---[FILE: shared-hook-functions.ts]---
Location: n8n-master/packages/cli/src/execution-lifecycle/shared/shared-hook-functions.ts
Signals: N/A
Excerpt (<=80 chars):  export function determineFinalExecutionStatus(runData: IRun): ExecutionStatus {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- determineFinalExecutionStatus
- prepareExecutionDataForDbUpdate
```

--------------------------------------------------------------------------------

---[FILE: execution-data.service.ts]---
Location: n8n-master/packages/cli/src/executions/execution-data.service.ts
Signals: N/A
Excerpt (<=80 chars): export class ExecutionDataService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionDataService
```

--------------------------------------------------------------------------------

---[FILE: execution-recovery.service.ts]---
Location: n8n-master/packages/cli/src/executions/execution-recovery.service.ts
Signals: N/A
Excerpt (<=80 chars): export class ExecutionRecoveryService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionRecoveryService
```

--------------------------------------------------------------------------------

---[FILE: execution.service.ee.ts]---
Location: n8n-master/packages/cli/src/executions/execution.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class EnterpriseExecutionsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- EnterpriseExecutionsService
```

--------------------------------------------------------------------------------

---[FILE: execution.service.ts]---
Location: n8n-master/packages/cli/src/executions/execution.service.ts
Signals: N/A
Excerpt (<=80 chars):  export const schemaGetExecutionsQueryFilter = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- schemaGetExecutionsQueryFilter
- allowedExecutionsQueryFilterFields
- ExecutionService
```

--------------------------------------------------------------------------------

---[FILE: execution.types.ts]---
Location: n8n-master/packages/cli/src/executions/execution.types.ts
Signals: N/A
Excerpt (<=80 chars):  export type StopResult = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StopResult
```

--------------------------------------------------------------------------------

---[FILE: execution.utils.ts]---
Location: n8n-master/packages/cli/src/executions/execution.utils.ts
Signals: N/A
Excerpt (<=80 chars): export function getWorkflowActiveStatusFromWorkflowData(workflowData: IWorkfl...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- getWorkflowActiveStatusFromWorkflowData
```

--------------------------------------------------------------------------------

---[FILE: executions.controller.ts]---
Location: n8n-master/packages/cli/src/executions/executions.controller.ts
Signals: N/A
Excerpt (<=80 chars): export class ExecutionsController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ExecutionsController
```

--------------------------------------------------------------------------------

---[FILE: legacy-sqlite-execution-recovery.service.ts]---
Location: n8n-master/packages/cli/src/executions/legacy-sqlite-execution-recovery.service.ts
Signals: N/A
Excerpt (<=80 chars): export class LegacySqliteExecutionRecoveryService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LegacySqliteExecutionRecoveryService
```

--------------------------------------------------------------------------------

---[FILE: parse-range-query.middleware.ts]---
Location: n8n-master/packages/cli/src/executions/parse-range-query.middleware.ts
Signals: Express
Excerpt (<=80 chars): export const parseRangeQuery = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseRangeQuery
```

--------------------------------------------------------------------------------

---[FILE: validation.ts]---
Location: n8n-master/packages/cli/src/executions/validation.ts
Signals: Zod
Excerpt (<=80 chars):  export function validateExecutionUpdatePayload(

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- validateExecutionUpdatePayload
```

--------------------------------------------------------------------------------

---[FILE: credentials-permission-checker.ts]---
Location: n8n-master/packages/cli/src/executions/pre-execution-checks/credentials-permission-checker.ts
Signals: N/A
Excerpt (<=80 chars): export class CredentialsPermissionChecker {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsPermissionChecker
```

--------------------------------------------------------------------------------

---[FILE: subworkflow-policy-checker.ts]---
Location: n8n-master/packages/cli/src/executions/pre-execution-checks/subworkflow-policy-checker.ts
Signals: N/A
Excerpt (<=80 chars): export class SubworkflowPolicyChecker {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SubworkflowPolicyChecker
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/src/executions/__tests__/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const OOM_WORKFLOW: Partial<IWorkflowDb> = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- IN_PROGRESS_EXECUTION_DATA
```

--------------------------------------------------------------------------------

---[FILE: parse-range-query.middleware.test.ts]---
Location: n8n-master/packages/cli/src/executions/__tests__/parse-range-query.middleware.test.ts
Signals: Express
Excerpt (<=80 chars): import type { NextFunction } from 'express';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: n8n-master/packages/cli/src/executions/__tests__/utils.ts
Signals: N/A
Excerpt (<=80 chars):  export const setupMessages = (executionId: string, workflowName: string): Ev...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- setupMessages
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/src/ldap.ee/constants.ts
Signals: N/A
Excerpt (<=80 chars):  export const LDAP_LOGIN_LABEL = 'sso.ldap.loginLabel';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LDAP_LOGIN_LABEL
- LDAP_LOGIN_ENABLED
- BINARY_AD_ATTRIBUTES
- LDAP_CONFIG_SCHEMA
```

--------------------------------------------------------------------------------

---[FILE: helpers.ee.ts]---
Location: n8n-master/packages/cli/src/ldap.ee/helpers.ee.ts
Signals: N/A
Excerpt (<=80 chars): export const isLdapEnabled = () => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isLdapEnabled
- getLdapLoginLabel
- isLdapLoginEnabled
- validateLdapConfigurationSchema
- resolveEntryBinaryAttributes
- resolveBinaryAttributes
- createFilter
- escapeFilter
- getAuthIdentityByLdapId
- getUserByLdapId
- getUserByEmail
- mapLdapAttributesToUser
- getLdapIds
- getLdapUsers
- mapLdapUserToDbUser
- processUsers
- saveLdapSynchronization
- getLdapSynchronizations
```

--------------------------------------------------------------------------------

---[FILE: ldap.controller.ee.ts]---
Location: n8n-master/packages/cli/src/ldap.ee/ldap.controller.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class LdapController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LdapController
```

--------------------------------------------------------------------------------

---[FILE: ldap.service.ee.ts]---
Location: n8n-master/packages/cli/src/ldap.ee/ldap.service.ee.ts
Signals: N/A
Excerpt (<=80 chars): export class LdapService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LdapService
```

--------------------------------------------------------------------------------

---[FILE: license.controller.ts]---
Location: n8n-master/packages/cli/src/license/license.controller.ts
Signals: N/A
Excerpt (<=80 chars): export class LicenseController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseController
```

--------------------------------------------------------------------------------

---[FILE: license.service.ts]---
Location: n8n-master/packages/cli/src/license/license.service.ts
Signals: N/A
Excerpt (<=80 chars):  export const LicenseErrors = {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseErrors
- LicenseService
```

--------------------------------------------------------------------------------

---[FILE: license-metrics.service.ts]---
Location: n8n-master/packages/cli/src/metrics/license-metrics.service.ts
Signals: N/A
Excerpt (<=80 chars): export class LicenseMetricsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- LicenseMetricsService
```

--------------------------------------------------------------------------------

---[FILE: prometheus-metrics.service.ts]---
Location: n8n-master/packages/cli/src/metrics/prometheus-metrics.service.ts
Signals: Express
Excerpt (<=80 chars): export class PrometheusMetricsService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PrometheusMetricsService
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: n8n-master/packages/cli/src/metrics/types.ts
Signals: N/A
Excerpt (<=80 chars): export type MetricCategory =

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MetricCategory
- MetricLabel
- Includes
```

--------------------------------------------------------------------------------

---[FILE: prometheus-metrics.service.test.ts]---
Location: n8n-master/packages/cli/src/metrics/__tests__/prometheus-metrics.service.test.ts
Signals: Express
Excerpt (<=80 chars): import { mockInstance } from '@n8n/backend-test-utils';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: prometheus-metrics.service.unmocked.test.ts]---
Location: n8n-master/packages/cli/src/metrics/__tests__/prometheus-metrics.service.unmocked.test.ts
Signals: Express
Excerpt (<=80 chars): import { mockInstance } from '@n8n/backend-test-utils';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: n8n-master/packages/cli/src/mfa/constants.ts
Signals: N/A
Excerpt (<=80 chars): export const MFA_FEATURE_ENABLED = 'mfa.enabled';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MFA_FEATURE_ENABLED
- MFA_ENFORCE_SETTING
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: n8n-master/packages/cli/src/mfa/helpers.ts
Signals: N/A
Excerpt (<=80 chars):  export const isMfaFeatureEnabled = () => Container.get(GlobalConfig).mfa.ena...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- isMfaFeatureEnabled
- handleMfaDisable
```

--------------------------------------------------------------------------------

---[FILE: mfa.service.ts]---
Location: n8n-master/packages/cli/src/mfa/mfa.service.ts
Signals: N/A
Excerpt (<=80 chars): export class MfaService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- MfaService
```

--------------------------------------------------------------------------------

---[FILE: totp.service.ts]---
Location: n8n-master/packages/cli/src/mfa/totp.service.ts
Signals: N/A
Excerpt (<=80 chars): export class TOTPService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TOTPService
```

--------------------------------------------------------------------------------

---[FILE: body-parser.ts]---
Location: n8n-master/packages/cli/src/middlewares/body-parser.ts
Signals: Express
Excerpt (<=80 chars): export const rawBodyReader: RequestHandler = async (req, _res, next) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- parseBody
```

--------------------------------------------------------------------------------

---[FILE: cors.ts]---
Location: n8n-master/packages/cli/src/middlewares/cors.ts
Signals: Express
Excerpt (<=80 chars):  export const corsMiddleware: RequestHandler = (req, res, next) => {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: filter.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/filter.ts
Signals: Express
Excerpt (<=80 chars):  export const filterListQueryMiddleware = async (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- filterListQueryMiddleware
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/index.ts
Signals: Express, Zod
Excerpt (<=80 chars):  export type ListQueryMiddleware = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ListQueryMiddleware
```

--------------------------------------------------------------------------------

---[FILE: pagination.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/pagination.ts
Signals: Express
Excerpt (<=80 chars):  export const paginationListQueryMiddleware: RequestHandler = (

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: select.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/select.ts
Signals: Express
Excerpt (<=80 chars):  export const selectListQueryMiddleware: RequestHandler = (req: ListQuery.Req...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: sort-by.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/sort-by.ts
Signals: Express
Excerpt (<=80 chars):  export const sortByQueryMiddleware: RequestHandler = (req: ListQuery.Request...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: base.filter.dto.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/dtos/base.filter.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class BaseFilter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseFilter
```

--------------------------------------------------------------------------------

---[FILE: base.select.dto.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/dtos/base.select.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class BaseSelect {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BaseSelect
```

--------------------------------------------------------------------------------

---[FILE: credentials.filter.dto.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/dtos/credentials.filter.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class CredentialsFilter extends BaseFilter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsFilter
```

--------------------------------------------------------------------------------

---[FILE: credentials.select.dto.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/dtos/credentials.select.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class CredentialsSelect extends BaseSelect {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CredentialsSelect
```

--------------------------------------------------------------------------------

---[FILE: pagination.dto.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/dtos/pagination.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class Pagination {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- Pagination
```

--------------------------------------------------------------------------------

---[FILE: user.filter.dto.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/dtos/user.filter.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class UserFilter extends BaseFilter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserFilter
```

--------------------------------------------------------------------------------

---[FILE: user.select.dto.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/dtos/user.select.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class UserSelect extends BaseSelect {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- UserSelect
```

--------------------------------------------------------------------------------

---[FILE: workflow.filter.dto.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/dtos/workflow.filter.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowFilter extends BaseFilter {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowFilter
```

--------------------------------------------------------------------------------

---[FILE: workflow.select.dto.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/dtos/workflow.select.dto.ts
Signals: N/A
Excerpt (<=80 chars):  export class WorkflowSelect extends BaseSelect {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowSelect
```

--------------------------------------------------------------------------------

---[FILE: workflow.sort-by.dto.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/dtos/workflow.sort-by.dto.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowSortByParameter implements ValidatorConstraintInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowSortByParameter
- WorkflowSorting
```

--------------------------------------------------------------------------------

---[FILE: list-query.test.ts]---
Location: n8n-master/packages/cli/src/middlewares/list-query/__tests__/list-query.test.ts
Signals: Express
Excerpt (<=80 chars): import type { ListQueryDb } from '@n8n/db';

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- (no obvious exported surface detected)
```

--------------------------------------------------------------------------------

---[FILE: breaking-changes.controller.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/breaking-changes.controller.ts
Signals: N/A
Excerpt (<=80 chars): export class BreakingChangesController {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BreakingChangesController
```

--------------------------------------------------------------------------------

---[FILE: breaking-changes.module.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/breaking-changes.module.ts
Signals: N/A
Excerpt (<=80 chars): export class BreakingChangesModule implements ModuleInterface {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BreakingChangesModule
```

--------------------------------------------------------------------------------

---[FILE: breaking-changes.rule-registry.service.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/breaking-changes.rule-registry.service.ts
Signals: N/A
Excerpt (<=80 chars): export class RuleRegistry {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RuleRegistry
```

--------------------------------------------------------------------------------

---[FILE: breaking-changes.service.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/breaking-changes.service.ts
Signals: N/A
Excerpt (<=80 chars): export class BreakingChangeService {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BreakingChangeService
```

--------------------------------------------------------------------------------

---[FILE: binary-data-storage.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/binary-data-storage.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class BinaryDataStorageRule implements IBreakingChangeInstanceRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- BinaryDataStorageRule
```

--------------------------------------------------------------------------------

---[FILE: cli-replace-update-workflow-command.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/cli-replace-update-workflow-command.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class CliActivateAllWorkflowsRule implements IBreakingChangeInstanceRu...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- CliActivateAllWorkflowsRule
```

--------------------------------------------------------------------------------

---[FILE: disabled-nodes.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/disabled-nodes.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class DisabledNodesRule implements IBreakingChangeWorkflowRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DisabledNodesRule
```

--------------------------------------------------------------------------------

---[FILE: dotenv-upgrade.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/dotenv-upgrade.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class DotenvUpgradeRule implements IBreakingChangeInstanceRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- DotenvUpgradeRule
```

--------------------------------------------------------------------------------

---[FILE: file-access.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/file-access.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class FileAccessRule implements IBreakingChangeWorkflowRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- FileAccessRule
```

--------------------------------------------------------------------------------

---[FILE: git-node-bare-repos.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/git-node-bare-repos.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class GitNodeBareReposRule implements IBreakingChangeWorkflowRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- GitNodeBareReposRule
```

--------------------------------------------------------------------------------

---[FILE: oauth-callback-auth.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/oauth-callback-auth.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class OAuthCallbackAuthRule implements IBreakingChangeInstanceRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- OAuthCallbackAuthRule
```

--------------------------------------------------------------------------------

---[FILE: process-env-access.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/process-env-access.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class ProcessEnvAccessRule implements IBreakingChangeWorkflowRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- ProcessEnvAccessRule
```

--------------------------------------------------------------------------------

---[FILE: pyodide-removed.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/pyodide-removed.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class PyodideRemovedRule implements IBreakingChangeWorkflowRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- PyodideRemovedRule
```

--------------------------------------------------------------------------------

---[FILE: queue-worker-max-stalled-count.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/queue-worker-max-stalled-count.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class QueueWorkerMaxStalledCountRule implements IBreakingChangeInstanc...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- QueueWorkerMaxStalledCountRule
```

--------------------------------------------------------------------------------

---[FILE: removed-database-types.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/removed-database-types.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class RemovedDatabaseTypesRule implements IBreakingChangeInstanceRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemovedDatabaseTypesRule
```

--------------------------------------------------------------------------------

---[FILE: removed-nodes.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/removed-nodes.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class RemovedNodesRule implements IBreakingChangeWorkflowRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- RemovedNodesRule
```

--------------------------------------------------------------------------------

---[FILE: settings-file-permissions.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/settings-file-permissions.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class SettingsFilePermissionsRule implements IBreakingChangeInstanceRu...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SettingsFilePermissionsRule
```

--------------------------------------------------------------------------------

---[FILE: sqlite-legacy-driver.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/sqlite-legacy-driver.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class SqliteLegacyDriverRule implements IBreakingChangeInstanceRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- SqliteLegacyDriverRule
```

--------------------------------------------------------------------------------

---[FILE: start-node-removed.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/start-node-removed.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class StartNodeRemovedRule implements IBreakingChangeWorkflowRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- StartNodeRemovedRule
```

--------------------------------------------------------------------------------

---[FILE: task-runner-docker-image.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/task-runner-docker-image.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class TaskRunnerDockerImageRule implements IBreakingChangeInstanceRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnerDockerImageRule
```

--------------------------------------------------------------------------------

---[FILE: task-runners.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/task-runners.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class TaskRunnersRule implements IBreakingChangeInstanceRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TaskRunnersRule
```

--------------------------------------------------------------------------------

---[FILE: tunnel-option.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/tunnel-option.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class TunnelOptionRule implements IBreakingChangeInstanceRule {

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- TunnelOptionRule
```

--------------------------------------------------------------------------------

---[FILE: wait-node-subworkflow.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/wait-node-subworkflow.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class WaitNodeSubworkflowRule implements IBreakingChangeBatchWorkflowR...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WaitNodeSubworkflowRule
```

--------------------------------------------------------------------------------

---[FILE: workflow-hooks-deprecated.rule.ts]---
Location: n8n-master/packages/cli/src/modules/breaking-changes/rules/v2/workflow-hooks-deprecated.rule.ts
Signals: N/A
Excerpt (<=80 chars): export class WorkflowHooksDeprecatedRule implements IBreakingChangeInstanceRu...

```typescript
# PSEUDOCODE / OUTLINE (non-verbatim)
Reusable surface (names only):
- WorkflowHooksDeprecatedRule
```

--------------------------------------------------------------------------------

````
